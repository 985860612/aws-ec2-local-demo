

# 使用 EC2Launch v2 代理在 EC2 Windows 实例启动期间执行任务
<a name="ec2launch-v2"></a>

默认情况下，从 AWS Windows Server 2022 和 Windows Server 2025 AMI 启动的所有受支持的 Amazon EC2 实例包含 EC2Launch v2 启动代理 (`EC2Launch.exe`)。我们还提供 Windows Server 2016 和 2019 AMI，其中安装了 EC2Launch v2 作为默认的启动代理。除了包含 EC2Launch v1 的 Windows Server 2016 和 2019 AMI 之外，还提供了这些 AMI。您可以在 Amazon EC2 控制台 **AMI** 页面的搜索中输入以下前缀来搜索默认包含 EC2Launch v2 的 Windows AMI：`EC2LaunchV2-Windows_Server-*`。

要比较启动代理版本的功能，请参阅 [比较 Amazon EC2 启动代理](configure-launch-agents.md#ec2launch-agent-compare)。

EC2Launch v2 在实例启动期间执行任务，并可在实例停止并稍后启动或重新启动时运行。EC2Launch v2 还可按需执行任务。部分任务可自动启用，而其他任务必须手动启用。EC2Launch v2 服务支持所有 EC2Config 和 EC2Launch 功能。

此服务使用配置文件来控制其操作。您可以使用图形工具或直接将其作为单个 .yml 文件 (`agent-config.yml`) 进行编辑，以此来更新配置文件。有关文件位置的更多信息，请参阅 [EC2Launch v2 目录结构](#ec2launch-v2-directory)。

EC2Launch v2 发布 Windows 事件日志，帮助您进行故障排除和设置触发器。有关更多信息，请参阅 [Windows 事件日志](ec2launchv2-troubleshooting.md#ec2launchv2-windows-event-logs)。

**支持的操作系统版本**  
EC2Launch v2 代理支持以下 Windows Server 操作系统（OS）版本：
+ Windows Server 2025
+ Windows Server 2022
+ Windows Server 2019（长期服务渠道和半年期服务渠道）
+ Windows Server 2016

**默认运行的任务**  
EC2Launch v2 代理在初始实例启动期间默认仅运行以下任务一次。任务按照其在启动阶段的运行顺序进行组织。

`Boot` 阶段
+ extendRootPartition

`PreReady` 阶段
+ activateWindows
+ setDnsSuffix
+ setAdminAccount
+ setWallpaper

`PostReady` 阶段
+ startSsm

## EC2Launch v2 概念
<a name="ec2launch-v2-concepts"></a>

在考虑使用 EC2Launch v2 时，以下概念很有用。

**agent-config**  
`agent-config` 是位于 EC2Launch v2 的配置文件夹中的文件。它包括用于 boot、network、PreReady 和 PostReady 阶段的配置。此文件用于指定在 AMI 首次引导或以后引导时，应运行任务的实例配置。  
默认情况下，EC2Launch v2 安装会安装一个 `agent-config` 文件，其中包含在标准 Amazon Windows AMI 中使用的推荐配置。您可以更新配置文件以更改 EC2Launch v2 为您的 AMI 指定的默认引导体验。有关文件位置的更多信息，请参阅 [EC2Launch v2 目录结构](#ec2launch-v2-directory)。

**频率**  
任务频率决定任务的运行时间，具体取决于引导上下文。大多数任务的频率只有一次。您可以指定 `executeScript` 任务的频率。  
您将在 [EC2Launch v2 任务配置](ec2launch-v2-settings.md#ec2launch-v2-task-configuration) 中看到以下频率。  
+ 一次 — 任务在 AMI 首次引导时（完成了 Sysprep）运行一次。
+ 始终 — 任务在每次启动代理运行时都会运行。启动代理在以下情况运行：
  + 实例启动或重新启动时
  + EC2Launch 服务运行时
  + `EC2Launch.exe run` 被调用

**暂存区**  
阶段是 EC2Launch v2 代理运行的任务的逻辑分组。某些任务只能在特定阶段运行。另一些任务可以分多个阶段运行。使用 `agent-config.yml` 时，必须指定阶段列表以及每个阶段内运行的任务列表。  
该服务按以下顺序运行阶段：    
第 1 阶段：启动  
  
第 2 阶段：网络  
  
第 3 阶段：PreReady  
  
Windows 准备就绪  
PreReady 阶段完成后，该服务会将 `Windows is ready` 消息发送到 Amazon EC2 控制台。  
第 4 阶段：PostReady  
用户数据在 *PostReady* 阶段运行。有些脚本版本在 `agent-config.yml` 文件 *PostReady* 阶段之前运行，有些则在之后运行，如下所示：    
在 `agent-config.yml` 之前：  
+ YAML 用户数据版本 1.1
+ XML 用户数据  
在 `agent-config.yml` 之后  
+ YAML 用户数据版本 1.0（用于向后兼容的旧版本）
有关示例阶段和任务，请参阅 [示例：`agent-config.yml`](ec2launch-v2-settings.md#ec2launch-v2-example-agent-config)。  
使用用户数据时，必须指定要运行的启动代理的任务列表。阶段是默认的。有关示例任务，请参阅 [示例：用户数据](ec2launch-v2-settings.md#ec2launch-v2-example-user-data)。  
EC2Launch v2 会按照您在 `agent-config.yml` 和用户数据中指定的顺序运行任务列表。阶段按顺序运行。上一阶段完成后，开始下一阶段。任务也按顺序运行。

**任务**：  
您可以调用任务来对实例执行操作。您可以在 `agent-config.yml` 文件中或通过用户数据配置任务。有关 EC2Launch v2 的可用任务列表，请参阅 [EC2Launch v2 任务](#ec2launch-v2-tasks)。有关任务配置架构和详细信息，请参阅 [EC2Launch v2 任务配置](ec2launch-v2-settings.md#ec2launch-v2-task-configuration)。

**用户数据**  
用户数据是在启动实例时可配置的数据。您可以更新用户数据以动态更改如何配置自定义 AMI 或快速启动 AMI。EC2Launch v2 支持 60 kB 用户数据输入长度。用户数据仅包括 UserData 阶段，因此在 `agent-config` 文件之后运行。您可以在使用启动实例向导启动实例时输入用户数据，也可以从 EC2 控制台修改用户数据。有关使用用户的更多信息，请参阅[Amazon EC2 如何处理 Windows 实例的用户数据](user-data.md#ec2-windows-user-data)。

## EC2Launch v2 任务概览
<a name="ec2launch-v2-tasks"></a>

EC2Launch v2 可以在每次引导时执行以下任务：
+ 设置新的（可选）自定义壁纸，以呈现有关实例的信息。
+ 为在本地计算机上创建的管理员账户设置属性。
+ 将 DNS 后缀添加到搜索后缀列表中。只有尚不存在的后缀才会添加到列表中。
+ 为任何附加卷设置驱动器盘符，并扩展它们以使用可用空间。
+ 将配置中的文件写入磁盘。
+ 运行 EC2Launch v2 配置文件或 `user-data` 中指定的脚本。`user-data` 的脚本可以是纯文本，也可以是压缩文件，并以 base64 格式提供。
+ 使用给定参数运行程序。
+ 设置计算机名称。
+ 将实例信息发送到 Amazon EC2 控制台。
+ 向 Amazon EC2 控制台发送 RDP 证书指纹。
+ 请动态扩展操作系统分区，以包含所有未分区的空间。
+ 运行用户数据。有关指定用户数据的更多信息，请参阅[EC2Launch v2 任务配置](ec2launch-v2-settings.md#ec2launch-v2-task-configuration)。
+ 设置非持久静态路由以访问元数据服务和 AWS KMS 服务器。
+ 将非引导分区设置为 `mbr` 或 `gpt`。
+ 在 Sysprep 之后启动 Systems Manager 服务。
+ 优化 ENA 设置。
+ 为更高版本的 Windows 启用 OpenSSH。
+ 启用巨型帧。
+ 将 Sysprep 设置为与 EC2Launch v2 一起运行。
+ 发布 Windows 事件日志。

## EC2Launch v2 目录结构
<a name="ec2launch-v2-directory"></a>

EC2Launch v2 应安装在以下目录中：
+ 服务二进制文件：`%ProgramFiles%\Amazon\EC2Launch`
+ 服务数据（设置、日志文件和状态文件）：`%ProgramData%\Amazon\EC2Launch`

**注意**  
默认情况下，Windows 会隐藏 `C:\ProgramData` 下的文件和文件夹。要查看 EC2Launch v2 目录和文件，必须在 Windows 资源管理器中输入路径，或者更改文件夹属性以显示隐藏的文件和文件夹。

`%ProgramFiles%\Amazon\EC2Launch` 目录包含二进制文件和支持库。它包括以下子目录：
+ `settings`
  + `EC2LaunchSettingsUI.exe`：用于修改 `agent-config.yml` 文件的用户界面
  + `YamlDotNet.dll`：用于支持用户界面中部分操作的 DLL
+ `tools`
  + `ebsnvme-id.exe`：用于检查实例上 EBS 卷的元数据的工具
  + `AWSAcpiSpcrReader.exe`：用于确定要使用的正确 COM 端口的工具
  + `EC2LaunchEventMessage.dll`：用于支持 EC2Launch 的 Windows 事件日志记录的 DLL
+ `service`
  + `EC2LaunchService.exe`：当启动代理作为一项服务运行时所启动的 Windows 服务可执行文件
+ `EC2AgentTelemetry.dll`：用于支持 EC2 代理遥测的 DLL
+ `EC2Launch.exe`：主要 EC2Launch 可执行文件
+ `EC2LaunchAgentAttribution.txt`：EC2Launch 中使用的代码的归因

`%ProgramData%\Amazon\EC2Launch` 目录包含以下子目录。服务生成的所有数据（包括日志、配置和状态）都存储在此目录中。
+ `config` – 配置

  服务配置文件作为 `agent-config.yml` 存储在此目录中。此文件可以进行更新以修改、添加或删除由服务运行的原定设置任务。在此目录中创建文件的权限仅限于管理员账户，以防止特权提升。
+ `log` – 实例日志

  服务 (`agent.log`) 和遥测 (`telemetry.log`) 的日志都存储在此目录中。当 `agent.log` 大小达到 1 MB 时，它会自动轮换，并使用时间戳格式创建备份文件（例如，`agent-2026-03-02T18-56-39.188.log`）。一次只能维护一个备份日志文件。
+ `state` – 服务状态数据

  服务用于确定应运行哪些任务的状态存储在此处。其中有一个 `.run-once` 文件，指示服务是否已在 Sysprep 之后运行（因此，频率为一次的任务在下次运行时将跳过）。此子目录包含 `state.json` 和 `previous-state.json`，用于跟踪每个任务的状态。
+ `sysprep` – Sysprep

  此目录包含的文件用于确定 Sysprep 在创建可重复使用的自定义 Windows AMI 时，需要执行哪些操作。
+ `wallpaper` – 墙纸

  此墙纸图像存储在此目录中。

## 遥测
<a name="ec2launch-v2-telemetry"></a>

遥测是附加信息，可帮助 AWS 更好地了解您的需求、诊断问题并提供功能，以改善 AWS 服务 带给您的体验。

EC2Launch v2 版本 `2.1.592` 及更高版本会收集遥测，例如使用情况指标和错误。此数据是从运行 EC2Launch v2 的 Amazon EC2 实例收集的。这包括 AWS 拥有的所有 Windows AMI。

EC2Launch v2 收集以下类型的遥测：
+ **使用情况信息** — 代理命令、安装方法和计划的运行频率。
+ **错误和诊断信息** — 代理安装错误代码、运行错误代码和错误调用堆栈。

从 2.0.592 到 2.1.1 版本收集的数据示例：

```
2025/07/18 22:38:52Z: EC2LaunchTelemetry: IsTelemetryEnabled=true
2025/07/18 22:38:52Z: EC2LaunchTelemetry: AgentOsArch=windows_amd64
2025/07/18 22:38:52Z: EC2LaunchTelemetry: IsAgentScheduledPerBoot=true
2025/07/18 22:38:52Z: EC2LaunchTelemetry: AgentCommandErrorCode=0
2025/07/18 22:38:52Z: EC2LaunchTelemetry: AdminPasswordTypeCode=0
2025/07/18 22:38:52Z: EC2LaunchTelemetry: IpConflictDetectionCode=0
2025/07/18 22:38:52Z: EC2LaunchTelemetry: AgentErrorLocation=addroutes.go:49
```

从 2.2.63 版本开始，EC2 代理遥测数据被格式化为 JSON 对象：

```
{"type":"EC2AgentTelemetry","agentId":"WindowsLaunchAgentV2" ... }
```

预设情况下，遥测处于启用状态。您可以随时禁用遥测收集。

**在实例上禁用遥测**  
要禁用单个实例的遥测，您可以设置系统环境变量，也可以使用 MSI 修改安装。

要通过设置系统环境变量来禁用遥测，请以管理员身份运行以下命令。

```
setx /M EC2LAUNCH_TELEMETRY 0
```

要使用 MSI 禁用遥测，请在[下载 MSI](ec2launch-v2-install.md) 后运行以下命令。

```
msiexec /i ".\AmazonEC2Launch.msi" Remove="Telemetry" /q
```

**Topics**
+ [EC2Launch v2 概念](#ec2launch-v2-concepts)
+ [EC2Launch v2 任务概览](#ec2launch-v2-tasks)
+ [EC2Launch v2 目录结构](#ec2launch-v2-directory)
+ [遥测](#ec2launch-v2-telemetry)
+ [安装最新版本的 EC2Launch v2](ec2launch-v2-install.md)
+ [配置 Windows 实例的 EC2Launch v2 设置](ec2launch-v2-settings.md)
+ [EC2Launch v2 启动任务的任务定义](ec2launch-v2-task-definitions.md)
+ [排查 EC2Launch v2 代理的问题](ec2launchv2-troubleshooting.md)
+ [EC2Launch v2 版本历史记录](ec2launchv2-versions.md)
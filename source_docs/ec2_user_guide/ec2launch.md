

# 使用 EC2Launch v1 代理在 EC2 Windows 实例启动期间执行任务
<a name="ec2launch"></a>

适用于 Windows Server 2016 和 2019 的 Amazon 托管 AMI 包含一组名为 EC2Launch 的 Windows Powershell 脚本。EC2Launch 在初始实例启动期间执行各种任务。有关 AWS Windows AMI 中包含的 EC2Launch 版本的信息，请参阅 [AWS Windows AMI Reference](https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/windows-amis.html)。

**注意**  
Windows Server 2016 及更高版本操作系统的最新启动代理是 EC2Launch v2，它取代了 EC2Config 和 EC2Launch，并预安装在名称以 `EC2LaunchV2-Windows_Server-*` 开头的 AWS Windows Server 2016 和 2019 AMI 上。您也可以在 Windows Server 2016 和 2019 上手动安装和配置代理。有关更多信息，请参阅 [安装 EC2Launch v2](ec2launch-v2-install.md)。  
要将 EC2Launch 与 IMDSv2 一起使用，版本必须为 1.3.2002730 或更高版本。

您可以使用以下 Windows PowerShell 命令验证已安装的 EC2Launch 版本。

```
Test-ModuleManifest -Path "C:\ProgramData\Amazon\EC2-Windows\Launch\Module\Ec2Launch.psd1" | Select Version
```

## EC2Launch 任务
<a name="ec2launch-tasks"></a>

在初始实例启动期间，默认情况下 EC2Launch 执行以下任务：
+ 设置用来呈现实例相关信息的新墙纸。
+ 将计算机名称设置为实例的私有 IPv4 地址。
+ 向 Amazon EC2 控制台发送实例信息。
+ 向 EC2 控制台发送 RDP 证书指纹。
+ 设置管理员账户的随机密码。
+ 添加 DNS 后缀。
+ 动态扩展操作系统分区以包含所有未分区的空间。
+ 执行用户数据 (如果指定)。有关指定用户数据的更多信息，请参阅[在启动包含用户数据输入的 EC2 实例时运行命令](user-data.md)。
+  设置持久静态路由以访问元数据服务和 AWS KMS 服务器。
**重要**  
如果从此实例创建了自定义 AMI，则捕获这些路由作为操作配置的一部分，并且从 AMI 启动的任意新实例将保留相同的路由，而不论其子网放置如何。要更新路由，请参阅[在启动自定义 AMI 时更新 Server 2016 及更高版本的元数据/KMS 路由](ec2launch-sysprep.md#update-metadata-KMS)。

以下任务有助于保持与 EC2Config 服务的向后兼容。在启动期间，您还可以配置 EC2Launch 来执行以下任务：
+ 初始化辅助 EBS 卷。
+ 将 Windows 事件日志发送到 EC2 控制台日志。
+ 将 *Windows 已可供使用* 消息发送到 EC2 控制台。

## EC2Launch 目录结构
<a name="ec2launch-directories"></a>

默认情况下，EC2Launch 安装在根目录 `C:\ProgramData\Amazon\EC2-Windows\Launch` 中的 Windows Server 2016 及更高版本 AMI 上。

**注意**  
默认情况下，Windows 会隐藏 `C:\ProgramData` 下的文件和文件夹。要查看 EC2Launch 目录和文件，必须在 Windows 资源管理器中键入路径，或者更改文件夹属性以显示隐藏的文件和文件夹。

`Launch` 目录包含以下子目录。
+ `Scripts` — 包含组成 EC2Launch 的 PowerShell 脚本。
+ `Module` — 包含用于生成与 Amazon EC2 相关的脚本的模块。
+ `Config` — 包含您可以自定义的脚本配置文件。
+ `Sysprep` — 包含 Sysprep 资源。
+ `Settings` — 包含一个适用于 Sysprep 图形用户界面的应用程序。
+ `Library` — 包含 EC2 启动代理的共享库。
+ `Log` — 包含脚本的子目录和脚本生成的日志文件。

## 遥测
<a name="ec2launch-telemetry"></a>

遥测是附加信息，可帮助 AWS 更好地了解您的需求、诊断问题并提供功能，以改善 AWS 服务带给您的体验。

EC2Launch 版本 `1.3.2003498` 及更高版本会收集遥测，例如使用情况指标和错误。此数据是从运行 EC2Launch 的 Amazon EC2 实例收集的。这包括 AWS 拥有的所有 Windows AMI。

EC2Launch 收集以下类型的遥测：
+ **使用情况信息** — 代理命令、安装方法和计划的运行频率。
+ **错误和诊断信息** — 代理安装和运行错误代码。

收集的数据示例：

```
2021/07/15 21:44:12Z: EC2LaunchTelemetry: IsAgentScheduledPerBoot=true
2021/07/15 21:44:12Z: EC2LaunchTelemetry: IsUserDataScheduledPerBoot=true
2021/07/15 21:44:12Z: EC2LaunchTelemetry: AgentCommandCode=1
2021/07/15 21:44:12Z: EC2LaunchTelemetry: AgentCommandErrorCode=5
2021/07/15 21:44:12Z: EC2LaunchTelemetry: AgentInstallCode=2
2021/07/15 21:44:12Z: EC2LaunchTelemetry: AgentInstallErrorCode=0
```

预设情况下，遥测处于启用状态。您可以随时禁用遥测收集。如果启用了遥测，EC2Launch 会发送遥测数据，无需额外的客户通知。

已收集您启用或禁用遥测的选择。

您可以选择或取消遥测收集。收集您选择或取消遥测的选择，以确保我们能够遵守您的遥测选项。

**遥测可见性**  
启用遥测后，它将显示在 Amazon EC2 控制台输出中，如下所示：

```
2021/07/15 21:44:12Z: Telemetry: <Data>
```

**在实例上禁用遥测**  
要通过设置系统环境变量来禁用遥测，请以管理员身份运行以下命令：

```
setx /M EC2LAUNCH_TELEMETRY 0
```

如需在安装过程中禁用遥测，请按照如下所示运行 `install.ps1`：

```
. .\install.ps1 -EnableTelemetry:$false
```

**Topics**
+ [EC2Launch 任务](#ec2launch-tasks)
+ [EC2Launch 目录结构](#ec2launch-directories)
+ [遥测](#ec2launch-telemetry)
+ [安装最新版本的 EC2Launch](ec2launch-download.md)
+ [在 Windows 实例上配置 EC2Launch v1 代理](ec2launch-config.md)
+ [EC2Launch 版本历史记录](ec2launch-version-details.md)
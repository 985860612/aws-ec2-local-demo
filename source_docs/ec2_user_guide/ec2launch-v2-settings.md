

# 配置 Windows 实例的 EC2Launch v2 设置
<a name="ec2launch-v2-settings"></a>

本节包含有关如何配置 EC2Launch v2 的设置的信息。

**Topics**
+ [使用 EC2Launch v2 设置对话框更改设置](#ec2launch-v2-ui)
+ [使用 CLI 配置 EC2Launch v2](#ec2launch-v2-cli)
+ [EC2Launch v2 任务配置](#ec2launch-v2-task-configuration)
+ [EC2Launch v2 退出代码并重新启动](#ec2launch-v2-exit-codes-reboots)
+ [EC2Launch v2 和 Sysprep](#ec2launch-v2-sysprep)

## 使用 EC2Launch v2 设置对话框更改设置
<a name="ec2launch-v2-ui"></a>

以下过程介绍如何使用 EC2Launch v2 设置对话框来启用或禁用设置。
**注意**  
如果您在 agent-config.yml 文件中适当配置了自定义任务，并尝试打开 Amazon EC2Launch settings（Amazon EC2Launch 设置）对话框，则会收到错误消息。有关示例架构，请参阅 [示例：`agent-config.yml`](#ec2launch-v2-example-agent-config)。

1. 启动并连接到您的 Windows 实例。

1. 从“开始”菜单，选择**所有程序**，然后导航到 **EC2Launch 设置**。在选择**使用 Sysprep 关机**或**不使用 Sysprep 关机**之前，请务必保存要在运行关机时应用的所有更改。  
![EC2 Launch Settings 应用程序。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2launchv2-settings.png)

1. 在 **EC2Launch 设置** 对话框的**常规**选项卡上，您可以启用或禁用以下设置。

   1. **Set Computer Name（设置电脑名称**

      如果启用此设置（默认情况下禁用），则每次引导时会将当前主机名与所需主机名进行比较。如果主机名不匹配，则会重置主机名，然后系统可以选择重新启动以接受新的主机名。如果未指定自定义主机名，则该主机名会以十六进制格式的私有 IPv4 地址生成，例如：`ip-AC1F4E6`。若要防止修改现有主机名，请不要启用该设置。

   1. **扩展引导卷**

      此设置可动态扩展 `Disk 0`/`Volume 0` 以包含所有未分区的空间。从具有自定义大小的根卷启动实例时，此设置非常有用。

   1. **设置管理员账户**

      启用后，您可以为在本地计算机上创建的管理员账户设置用户名和密码属性。如果未启用此功能，则在 Sysprep 之后，不会在系统上创建管理员账户。仅当 `adminPassword` 为 `adminPasswordtype` 时，在 `Specify` 中提供密码。

      密码类型定义如下：

      1. `Random`

         EC2Launch 生成一个密码并使用用户的密钥对其进行加密。系统会在实例启动后禁用此设置，以便在重新启动或停止再启动实例后该密码仍然存在。

      1. `Specify`

         EC2Launch 使用您在 `adminPassword` 中指定的密码 如果密码不满足系统要求，EC2Launch 会生成随机密码。该密码以明文方式存储在 `agent-config.yml` 文件中，并且在 Sysprep 设置管理员密码时会被删除。EC2Launch 使用用户的密钥对密码进行加密。

      1. `Do not set`

         EC2Launch 使用您在 unattend.xml 文件中指定的密码。如果未在 unattend.xml 中指定密码，管理员账户会被禁用。

   1. **启动 SSM 服务**

      如果选择此选项，Systems Manager 服务将启用，以便在 Sysprep 之后启动。EC2Launch v2 执行[前面](ec2launch-v2.md#ec2launch-v2-tasks)所述的所有任务，而 SSM Agent 处理 Run Command 和 State Manager 这样的 Systems Manager 功能的请求。

      您可以使用 Run Command 升级现有实例，以便使用最新版本的 EC2Launch v2 服务和 SSM Agent。有关更多信息，请参阅《AWS Systems Manager 用户指南》**中的[使用 Run Command 更新 SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command-tutorial-update-software.html)。

   1. **优化 ENA**

      在选中时，将配置 ENA 设置以确保针对 AWS 优化了 ENA 接收端扩展和接收队列深度设置。有关更多信息，请参阅[配置接收端缩放 CPU 关联](enhanced-networking-os.md#windows-rss-cpu-affinity)。

   1. **启用 SSH**

      此设置为更高版本的 Windows 启用 OpenSSH，以允许远程系统管理。

   1. **启用巨型帧**

      选择此项可启用巨型帧。巨型帧可能会对您的网络通信造成意外的影响，因此在启用之前，请确保您了解巨型帧将如何影响系统。有关巨型帧的详细信息，请参阅[巨型帧 (9001 MTU)](network_mtu.md#jumbo_frame_instances)。

   1. **准备映像**

      选择您希望在使用或不使用 Sysprep 的情况下关闭 EC2 实例。如果您希望将 Sysprep 与 EC2Launch v2 配合使用，请选择 **Shutdown with Sysprep (使用 Sysprep 关闭)**。

1. 在 **DNS 后缀**选项卡上，您可以选择是否要添加 DNS 后缀列表，供在 EC2 中运行的服务器的 DNS 解析使用，而不提供完全限定的域名。DNS 后缀可以包含变量 `$REGION` 和 `$AZ`。只有尚不存在的后缀才会添加到列表中。  
![EC2 Launch Settings 应用程序。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2launchv2-dns.png)

1. 在**墙纸**选项卡上，您可以使用背景图像配置实例墙纸，并为要显示的墙纸指定实例详细信息。Amazon EC2 会在您每次登录时生成详细信息。

   您可以使用以下控件配置墙纸。
   + **在墙纸上显示实例详细信息** – 此复选框会启用或禁用在墙纸上显示实例详细信息。
   + **图像路径 (.jpg)** – 指定用作墙纸背景的图像路径。
   + **选择要在墙纸上显示的属性** – 选中要在墙纸上显示的实例详细信息的复选框。清除之前选中的要从墙纸中删除的实例详细信息的复选框。
   + **在墙纸上显示实例标签** – 选择以下设置之一，以在墙纸上显示实例标签：
     + **无** – 不在墙纸上显示任何实例标签。
     + **显示全部** – 在墙纸上显示所有实例标签。
     + **显示筛选部分** – 在墙纸上显示指定的实例标签。当您选择此设置时，您可以在**实例标签筛选条件**框中添加要在墙纸上显示的实例标签。
**注意**  
必须启用元数据中的标签，才能在墙纸上显示标签。有关实例标签和元数据的更多信息，请参阅 [使用实例元数据来查看 EC2 实例的标签](work-with-tags-in-IMDS.md)。  
![EC2 Launch Setting“墙纸”选项卡。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2launchv2-wallpaper-02.png)

1. 在**卷**选项卡上，选择是否要初始化附加到实例的卷。启用时，可为任何附加卷设置驱动器盘符，并扩展它们以使用可用空间。如果选择**全部**，则初始化所有存储卷。如果选择**设备**，则只初始化列表中指定的设备。您必须为要初始化的每个设备进行输入。使用 EC2 控制台上列出的设备，例如，`xvdb` 或 `/dev/nvme0n1`。下拉列表显示已附加到实例的存储卷。要输入未附加到实例的设备，请在文本字段中输入该设备。

   **名称**、**盘符**和**分区**是可选字段。如果没有为**分区**指定值，则使用 `gpt` 分区类型初始化大于 2 TB 的存储卷，使用 `mbr` 分区类型初始化小于 2 TB 的存储卷。如果配置了设备，并且非 NTFS 设备包含分区表，或者磁盘的前 4 KB 包含数据，则跳过磁盘并记录操作。  
![EC2 Launch Settings 应用程序。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2launchv2-volumes.png)

## 使用 CLI 配置 EC2Launch v2
<a name="ec2launch-v2-cli"></a>

您可以使用命令行界面 (CLI) 配置 EC2Launch 设置和管理服务。以下部分包含您可用于管理 EC2Launch v2 的 CLI 命令的描述和使用信息。

**注意**  
EC2Launch v2 CLI 可执行文件 `EC2Launch.exe` 位于 `C:\Program Files\Amazon\EC2Launch\` 中。此目录默认不在 Windows PATH 中。本部分示例中显示的 `ec2launch {{command}}` 形式为速记形式，shell 无法直接识别。要运行命令，可使用可执行文件的完整路径，或者先切换到安装目录。以下 PowerShell 示例使用带有调用操作符的完整路径：  

```
& "C:\Program Files\Amazon\EC2Launch\EC2Launch.exe" status
```

**Topics**
+ [collect-logs](#ec2launch-v2-collect-logs)
+ [get-agent-config](#ec2launch-v2-get-agent-config)
+ [list-volumes](#ec2launch-v2-list-volumes)
+ [重置](#ec2launch-v2-reset)
+ [运行](#ec2launch-v2-run)
+ [status](#ec2launch-v2-settings-status)
+ [sysprep](#ec2launch-v2-settings-sysprep)
+ [验证](#ec2launch-v2-validate)
+ [version](#ec2launch-v2-version)
+ [wallpaper](#ec2launch-v2-wallpaper)

### collect-logs
<a name="ec2launch-v2-collect-logs"></a>

收集 EC2Launch 的日志文件，压缩文件，并将其放置在指定的目录中。

**示例**

```
ec2launch collect-logs -o C:\Mylogs.zip
```

**用量**

`ec2launch collect-logs [flags]`

**Flags**

`-h`, `--help`

`collect-logs` 的帮助

`-o`, `--output string`

压缩输出日志文件的路径

### get-agent-config
<a name="ec2launch-v2-get-agent-config"></a>

以指定的格式（JSON 或 YAML）输出 `agent-config.yml`。如果未指定格式，则会以先前指定的格式输出 `agent-config.yml`。

**示例**

```
ec2launch get-agent-config -f json
```

**用法**

`ec2launch get-agent-config [flags]`

**Flags**

`-h`, `--help`

`get-agent-config` 的帮助

`-f`, `--format string`

`agent-config` 文件的输出格式：`json`、`yaml`

### list-volumes
<a name="ec2launch-v2-list-volumes"></a>

列出附加到实例的所有存储卷，包括临时卷和 EBS 卷。

**示例**

```
ec2launch list-volumes
```

**用量**

`ec2launch list-volumes`

**Flags**

`-h`, `--help`

`list-volumes` 的帮助

### 重置
<a name="ec2launch-v2-reset"></a>

此任务的主要目标是在代理下次运行时对其进行重置 为此，**reset** 命令从本地 `EC2Launch` 目录中删除 EC2Launch v2 的所有代理状态数据（请参阅 [EC2Launch v2 目录结构](ec2launch-v2.md#ec2launch-v2-directory)）。重置可选择性地删除服务和 Sysprep 日志。

脚本行为取决于代理在哪种模式下运行脚本：内联或分离。

内联（默认）  
EC2Launch v2 代理一次只能运行一个脚本（`detach: false`）。这是默认设置。  
当您的内联脚本发出 **reset** 或 **sysprep** 命令时，它会立即运行并重置代理。当前任务完成，然后代理在不运行任何其他任务的情况下关闭。  
例如，如果发出命令的任务之后会有 `startSsm` 任务（默认情况下在用户数据运行后包括在内），则该任务不会运行，Systems Manager 服务也不会启动。

已分离  
EC2Launch v2 代理与其他任务同时运行脚本（`detach: true`）。  
当分离的脚本发出 **reset** 或 **sysprep** 命令时，这些命令会等待代理完成后再运行。executeScript 之后的任务仍将运行。

**示例**

```
ec2launch reset -c
```

**用量**

`ec2launch reset [flags]`

**Flags**

`-c`, `--clean`

在`reset`前清除实例日志

`-h`, `--help`

`reset` 的帮助

### 运行
<a name="ec2launch-v2-run"></a>

运行 EC2Launch v2。

**示例**

```
ec2launch run
```

**用量**

`ec2launch run [flags]`

**Flags**

`-h`, `--help`

`run` 的帮助

### status
<a name="ec2launch-v2-settings-status"></a>

获取 EC2Launch v2 代理的状态。也可选择在代理完成运行之前阻止该进程。进程退出代码决定了代理状态：
+ `0` – 代理已运行并且成功。
+ `1` – 代理已运行但失败。
+ `2` – 代理仍在运行中。
+ `3` – 代理处于未知状态。代理状态为未运行或已停止。
+ `4` – 尝试检索代理状态时出现错误。
+ `5` – 代理未运行，并且上次已知运行的状态未知。这可能意味着以下之一：
  + `state.json` 和 `previous-state.json` 都将被删除。
  + `previous-state.json` 已损坏。

  这是运行 [`reset`](#ec2launch-v2-reset) 命令后的代理状态。

**示例：**

```
ec2launch status -b
```

**注意**  
`status` 命令向控制台写入一条短消息（例如，`agent ran successfully`）。但是，决定代理状态的是前面列出的进程退出代码值，而不是那条消息。要在 PowerShell 中查看退出代码，请在运行命令后读取 `$LASTEXITCODE` 自动变量，例如：  

```
& "C:\Program Files\Amazon\EC2Launch\EC2Launch.exe" status; "ExitCode=$LASTEXITCODE"
```
输出为 `ExitCode=0` 表示代理已成功运行。

**用量**

`ec2launch status [flags]`

**Flags**

`-b`,`--block`

在代理完成运行前阻止才进程

`-h`,`--help`

`status` 的帮助

### sysprep
<a name="ec2launch-v2-settings-sysprep"></a>

此任务的主要目标是在代理下次运行时对其进行重置 为此，**sysprep** 命令会重置代理状态、更新 `unattend.xml` 文件、禁用 RDP 并运行 Sysprep。

脚本行为取决于代理在哪种模式下运行脚本：内联或分离。

内联（默认）  
EC2Launch v2 代理一次只能运行一个脚本（`detach: false`）。这是默认设置。  
当您的内联脚本发出 **reset** 或 **sysprep** 命令时，它会立即运行并重置代理。当前任务完成，然后代理在不运行任何其他任务的情况下关闭。  
例如，如果发出命令的任务之后会有 `startSsm` 任务（默认情况下在用户数据运行后包括在内），则该任务不会运行，Systems Manager 服务也不会启动。

已分离  
EC2Launch v2 代理与其他任务同时运行脚本（`detach: true`）。  
当分离的脚本发出 **reset** 或 **sysprep** 命令时，这些命令会等待代理完成后再运行。executeScript 之后的任务仍将运行。

**示例：**

```
ec2launch sysprep
```

**用量**

`ec2launch sysprep [flags]`

**Flags**

`-c`,`--clean`

在`sysprep`前清除实例日志

`-h`,`--help`

Sysprep 的帮助

`-s`,`--shutdown`

`sysprep`之后关闭实例

### 验证
<a name="ec2launch-v2-validate"></a>

验证 `agent-config` 文件 `C:\ProgramData\Amazon\EC2Launch\config\agent-config.yml`。

**示例**

```
ec2launch validate
```

**用量**

`ec2launch validate [flags]`

**Flags**

-h` `，`--help`

`validate` 的帮助

### version
<a name="ec2launch-v2-version"></a>

获取可执行版本。

**示例**

```
ec2launch version
```

**用量**

`ec2launch version [flags]`

**Flags**

`-h`, `--help`

`version` 的帮助

### wallpaper
<a name="ec2launch-v2-wallpaper"></a>

将新壁纸设置为提供的壁纸路径（.jpg 文件），并显示选定的实例详细信息。

#### 语法
<a name="lv2-wallpaper-syntax"></a>

```
ec2launch wallpaper ^
--path="C:\ProgramData\Amazon\EC2Launch\wallpaper\Ec2Wallpaper.jpg" ^
--all-tags ^
--attributes=hostName,instanceId,privateIpAddress,publicIpAddress,ipv6Address,instanceSize,availabilityZone,architecture
```

#### 输入
<a name="lv2-wallpaper-inputs"></a>参数

**--allowed-tags [{{tag-name-1}}、{{tag-name-n}}]**  
（可选）要显示在墙纸上的实例标签名称的 JSON 数组（采用 Base64 编码）。您可以使用此标签或 `--all-tags`，但不能同时使用两者。

**--attributes {{attribute-string-1}}、{{attribute-string-n}}**  
（可选）以逗号分隔的 `wallpaper` 属性字符串列表，用于将设置应用于墙纸。

**[--path \| -p] {{path-string}}**  
（必需）指定 `wallpaper` 背景图像文件路径。Flags

**--all-tags**  
（可选）显示墙纸上的所有实例标签。您可以使用此标签或 `--allowed-tags`，但不能同时使用两者。

**[--help \| -h]**  
显示 **wallpaper** 命令的帮助信息。

## EC2Launch v2 任务配置
<a name="ec2launch-v2-task-configuration"></a>

本节包括 `agent-config.yml` 和用户数据的配置架构、任务、详细信息和示例。

**Topics**
+ [架构：`agent-config.yml`](#ec2launch-v2-schema-agent-config)
+ [配置在启动或重启期间运行的 EC2Launch v2 用户数据脚本](#ec2launch-v2-schema-user-data)

### 架构：`agent-config.yml`
<a name="ec2launch-v2-schema-agent-config"></a>

`agent-config.yml` 文件的结构如下所示。请注意，不能在同一阶段重复一个任务。有关任务属性，请参阅随后的任务说明。

#### 文档结构：agent-config.yml
<a name="ec2launch-v2-schema-agent-config-doc-structure"></a>

**“JSON**”

```
{
	"version": "1.1",
	"config": [
		{
			"stage": "string",
			"tasks": [
				{
					"task": "string",
					"inputs": {
						...
					}
				},
				...
			]
		},
		...
	]
}
```

**YAML**（）

```
version: 1.1
config:
- stage: string
  tasks:
  - task: string
	inputs:
	  ...
  ...
...
```

#### 示例：`agent-config.yml`
<a name="ec2launch-v2-example-agent-config"></a>

以下示例显示了 `agent-config.yml` 配置文件的设置。

```
version: 1.1
config:
- stage: boot
  tasks:
  - task: extendRootPartition
- stage: preReady
  tasks:
  - task: activateWindows
    inputs:
      activation:
        type: amazon
  - task: setDnsSuffix
    inputs:
      suffixes:
      - $REGION.ec2-utilities.amazonaws.com
  - task: setAdminAccount
    inputs:
      password:
        type: random
  - task: setWallpaper
    inputs:
      path: C:\ProgramData\Amazon\EC2Launch\wallpaper\Ec2Wallpaper.jpg
      attributes:
      - hostName
      - instanceId
      - privateIpAddress
      - publicIpAddress
      - instanceSize
      - availabilityZone
      - architecture
- stage: postReady
  tasks:
  - task: startSsm
```

### 配置在启动或重启期间运行的 EC2Launch v2 用户数据脚本
<a name="ec2launch-v2-schema-user-data"></a>

以下 JSON 和 YAML 示例显示了用户数据的文档结构。Amazon EC2 解析您在文档中指定的 `tasks` 数组中命名的每个任务。每个任务都有自己的一组属性和要求。有关详细信息，请参阅 [EC2Launch v2 启动任务的任务定义](ec2launch-v2-task-definitions.md)。

**注意**  
任务只能在用户数据任务数组中出现一次。

#### 文档结构：用户数据
<a name="ec2launch-v2-schema-user-data-doc-structure"></a>

**“JSON**”

```
{
	"version": "1.1",
	"tasks": [
		{
			"task": "string",
			"inputs": {
				...
			},
		},
		...
	]
}
```

**YAML**（）

```
version: 1.1
tasks:
- task: string
  inputs:
    ...
...
```

#### 示例：用户数据
<a name="ec2launch-v2-example-user-data"></a>

有关用户数据的更多信息，请参阅 [Amazon EC2 如何处理 Windows 实例的用户数据](user-data.md#ec2-windows-user-data)。

以下 YAML 文档示例显示了 EC2Launch v2 作为用户数据运行的 PowerShell 脚本，用于创建文件。

```
version: 1.1
tasks:
- task: executeScript
  inputs:
  - frequency: always
    type: powershell
    runAs: localSystem
    content: |-
      New-Item -Path 'C:\PowerShellTest.txt' -ItemType File
```

您可以对用户数据使用与先前版本的启动代理兼容的 XML 格式。EC2Launch v2 在 `UserData` 阶段将脚本作为 `executeScript` 任务运行。为了符合 EC2Launch v1 和 EC2Config 的行为，默认情况下，用户数据脚本以附加/内联进程运行。

您可以添加可选标签来自定义脚本的运行方式。例如，要在实例重新启动时运行用户数据脚本以及在实例启动时运行一次用户数据脚本，您可以使用以下标签：

`<persist>true</persist>`

**示例：**

```
<powershell>
  $file = $env:SystemRoot + "\Temp" + (Get-Date).ToString("MM-dd-yy-hh-mm")
  New-Item $file -ItemType file
</powershell>
<persist>true</persist>
```

您可以使用 `<powershellArguments>` 标签来指定一个或多个 PowerShell 参数。如果未传递任何参数，则默认情况下，EC2Launch v2 会添加以下参数：`-ExecutionPolicy Unrestricted`。

**示例：**

```
<powershell>
  $file = $env:SystemRoot + "\Temp" + (Get-Date).ToString("MM-dd-yy-hh-mm")
  New-Item $file -ItemType file
</powershell>
<powershellArguments>-ExecutionPolicy Unrestricted -NoProfile -NonInteractive</powershellArguments>
```

要将 XML 用户数据脚本作为分离的进程运行，请在您的用户数据中添加以下标签。

`<detach>true</detach>`

**示例：**

```
<powershell>
  $file = $env:SystemRoot + "\Temp" + (Get-Date).ToString("MM-dd-yy-hh-mm")
  New-Item $file -ItemType file
</powershell>
<detach>true</detach>
```

**注意**  
以前的启动代理不支持分离标签。

#### 更改日志：用户数据
<a name="ec2launch-v2-versions-user-data"></a>

下表列出了用户数据更改，并将其交叉引用至适用的 EC2Launch v2 代理版本。


| 用户数据版本 | 说明 | 已引入 | 
| --- | --- | --- | 
| 1.1 | +  用户数据任务在代理配置文件中的 `PostReady` 阶段之前运行。 <br />+  在启动 Systems Manager Agent 之前运行用户数据（与 EC2Launch v1 和 EC2Config 的行为相同）。\*  | EC2Launch v2 版本 2.0.1245 | 
| 1.0 | +  将弃用。 <br />+  用户数据任务在代理配置文件中的 `PostReady` 阶段之后运行。这不与 EC2Launch v1 向后兼容。 <br />+  受 Systems Manager Agent 启动和用户数据任务之间争用情况的影响。  | EC2Launch v2 版本 2.0.0 | 

\* 与默认 `agent-config.yml` 文件结合使用时。

## EC2Launch v2 退出代码并重新启动
<a name="ec2launch-v2-exit-codes-reboots"></a>

您可以使用 EC2Launch v2 定义脚本如何处理退出代码。默认情况下，脚本中运行的最后一个命令的退出代码将报告为整个脚本的退出代码。例如，如果脚本包含三个命令，而第一个命令失败，但以下命令成功，则运行状态将报告为 `success`，因为最后一个命令成功。

如果您希望脚本重启实例，则必须在脚本中指定 `exit 3010`，即使重启是脚本中的最后一步，也必须在脚本中指定。`exit 3010` 指示 EC2Launch v2 重新启动实例并再次调用脚本，直到它返回不是 `3010` 的退出代码，或者直到达到最大重启计数为止。EC2Launch v2 允许每个任务最多重启 5 次。如果您尝试使用其他机制（例如）从脚本重启实例 `Restart-Computer`，则脚本运行状态将不一致。例如，它可能会陷入重启循环或不执行重启。

如果您使用的是与旧代理兼容的 XML 用户数据格式，则用户数据的运行时间可能会超过您预期的运行时间。有关更多信息，请参阅排查部分中的[服务多次运行用户数据](ec2launchv2-troubleshooting.md#ec2launchv2-troubleshooting-user-data-more-than-once)。

## EC2Launch v2 和 Sysprep
<a name="ec2launch-v2-sysprep"></a>

EC2Launch v2 服务会运行 Sysprep，借助该 Microsoft 工具您可以创建可重复使用的自定义 Windows AMI。在 EC2Launch v2 调用 Sysprep 时，会使用 `%ProgramData%\Amazon\EC2Launch` 中的设置文件来确定要执行的操作。您可以使用 **EC2Launch 设置**对话框间接编辑这些文件，也可以直接使用 YAML 编辑器或文本编辑器直接编辑。然而，有些高级设置并未包含在 **EC2Launch 设置** 对话框中，因此您必须直接编辑这些条目。

如果您在更新某实例的设置之后从中创建了一个 AMI，则新设置会应用到所有从新 AMI 启动的实例。有关创建 AMI 的信息，请参阅[创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。
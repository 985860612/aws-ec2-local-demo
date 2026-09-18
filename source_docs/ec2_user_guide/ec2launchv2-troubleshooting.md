

# 排查 EC2Launch v2 代理的问题
<a name="ec2launchv2-troubleshooting"></a>

本节介绍 EC2Launch v2 的常见故障排除场景以及有关查看 Windows 事件日志及控制台日志输出和消息的信息。

**Topics**
+ [常见场景](#ec2launchv2-troubleshooting-scenarios)
+ [Windows 事件日志](#ec2launchv2-windows-event-logs)
+ [EC2Launch v2 控制台日志输出](#ec2launchv2-console-output)

## 常见故障排除场景
<a name="ec2launchv2-troubleshooting-scenarios"></a>

本节介绍常见的故障排除场景和解决步骤。

**Topics**
+ [服务无法设置壁纸](#ec2launchv2-troubleshooting-wallpaper)
+ [服务无法运行用户数据](#ec2launchv2-troubleshooting-user-data)
+ [服务只运行一次任务](#ec2launchv2-troubleshooting-task-once)
+ [服务无法运行任务](#ec2launchv2-troubleshooting-task-failed)
+ [服务多次运行用户数据](#ec2launchv2-troubleshooting-user-data-more-than-once)
+ [EC2Launch v1 中的计划任务在迁移到 EC2Launch v2 后无法运行](#ec2launchv2-troubleshooting-scheduled-tasks-migration)
+ [服务初始化不为空的 EBS 卷](#ec2launchv2-troubleshooting-ebs-initialize)
+ [`setWallpaper` 任务未启用，但壁纸会在重新启动时重置](#ec2launchv2-troubleshooting-wallpaper-resets)
+ [服务停留在运行状态](#ec2launchv2-troubleshooting-service-stuck-running)
+ [无效的 `agent-config.yml` 会阻止打开 EC2Launch v2 设置对话框](#ec2launchv2-troubleshooting-invalid-agent-config)
+ [`task:executeScript should be unique and only invoked once`](#ec2launchv2-troubleshooting-executescript)

### 服务无法设置壁纸
<a name="ec2launchv2-troubleshooting-wallpaper"></a>

**解决方案**

1. 确保存在 `%AppData%\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\setwallpaper.lnk` 。

1. 检查 `%ProgramData%\Amazon\EC2Launch\log\agent.log` 是否发生任何错误。

### 服务无法运行用户数据
<a name="ec2launchv2-troubleshooting-user-data"></a>

**可能的原因**：服务可能在运行用户数据之前失败。

**解决方案**

1. 检查 `%ProgramData%\Amazon\EC2Launch\state\previous-state.json`。

1. 查看 `boot`、`network`、`preReady` 和 `postReadyLocalData` 是否全部标记为成功。

1. 如果其中一个阶段失败，请检查 `%ProgramData%\Amazon\EC2Launch\log\agent.log` 中的具体错误。

### 服务只运行一次任务
<a name="ec2launchv2-troubleshooting-task-once"></a>

**解决方案**

1. 检查任务的频率。

1. 如果服务已在 Sysprep 之后运行，并且任务频率设置为 `once`，则该任务不会再次运行。

1. 如果您希望任务在每次运行 EC2Launch v2 时运行，请将任务的频率设置为 `always`。

### 服务无法运行任务
<a name="ec2launchv2-troubleshooting-task-failed"></a>

**解决方案**

1. 检查 `%ProgramData%\Amazon\EC2Launch\log\agent.log` 中的最新条目。

1. 如果没有发生错误，请尝试从 `"%ProgramFiles%\Amazon\EC2Launch\EC2Launch.exe" run` 手动运行服务以查看任务是否成功。

### 服务多次运行用户数据
<a name="ec2launchv2-troubleshooting-user-data-more-than-once"></a>

**解决方案**  
用户数据在 EC2Launch v1 和 EC2Launch v2 之间的处理方式不同。将 `persist` 设置为 `true` 时，EC2Launch v1 在实例上将用户数据作为计划任务运行。如果 `persist` 设置为 `false`，则即使重新启动后退出或运行时中断，也不会计划该任务。

EC2Launch v2 将用户数据作为代理任务运行并跟踪其运行状态。如果用户数据发出计算机重启或用户数据在运行时中断，则运行状态将保持不变，`pending` 并且用户数据将在下次实例启动时再次运行。如果要阻止用户数据脚本多次运行，请使脚本具有幂等性。

以下示例幂极脚本设置计算机名称并加入域。

```
<powershell>
  $name = $env:computername
  if ($name -ne $desiredName) {
	Rename-Computer -NewName $desiredName
  }
  $domain = Get-ADDomain
  if ($domain -ne $desiredDomain) 
  {
	Add-Computer -DomainName $desiredDomain
  }
  $telnet = Get-WindowsFeature -Name Telnet-Client
  if (-not $telnet.Installed)
  {
	Install-WindowsFeature -Name "Telnet-Client"
  }
</powershell>
<persist>false</persist>
```

### EC2Launch v1 中的计划任务在迁移到 EC2Launch v2 后无法运行
<a name="ec2launchv2-troubleshooting-scheduled-tasks-migration"></a>

**解决方案**  
迁移工具不会检测任何链接到 EC2Launch v1 脚本的计划任务；因此，它不会在 EC2Launch v2 中自动设置这些任务。要配置这些任务，请编辑 [`agent-config.yml`](ec2launch-v2-settings.md#ec2launch-v2-task-configuration) 文件或使用 [EC2Launch v2 设置对话框](ec2launch-v2-settings.md#ec2launch-v2-ui)。例如，如果实例的计划任务正在运行 `InitializeDisks.ps1`，则在运行迁移工具之后，您必须在 EC2Launch v2 设置对话框中指定要初始化的卷。请参阅 [使用 EC2Launch v2 设置对话框更改设置](ec2launch-v2-settings.md#ec2launch-v2-ui) 程序的步骤 6。

### 服务初始化不为空的 EBS 卷
<a name="ec2launchv2-troubleshooting-ebs-initialize"></a>

**解决方案**  
在初始化卷之前，EC2Launch v2 会尝试检测该卷是否为空。如果卷不为空，则会跳过初始化。不初始化任何检测到不为空的卷。如果卷的前 4 KiB 为空，或者卷没有 [Windows 可识别的驱动器布局](https://learn.microsoft.com/en-us/windows/win32/api/winioctl/ns-winioctl-drive_layout_information_ex)，则该卷被视为空。在 Linux 系统上初始化和格式化的卷没有 Windows 可识别的驱动程序布局，例如 MBR 或 GPT。因此，它将被视为空并已初始化。如果要保留此数据，请不要依赖 EC2Launch v2 空驱动器检测。相反，请指定要在 [EC2Launch v2 设置对话框](ec2launch-v2-settings.md#ec2launch-v2-ui)（请参阅步骤 6）或 [`agent-config.yml`](ec2launch-v2-task-definitions.md#ec2launch-v2-initializevolume) 中初始化的卷。

### `setWallpaper` 任务未启用，但壁纸会在重新启动时重置
<a name="ec2launchv2-troubleshooting-wallpaper-resets"></a>

`setWallpaper` 任务在每个现有用户的启动文件夹中创建 `setwallpaper.lnk` 快捷方式文件。当用户在实例启动后首次登录时，此快捷方式文件就会运行。使用显示实例属性的自定义壁纸设置实例。删除 `setWallpaper` 任务不会删除此快捷方式文件。您必须手动删除此文件或使用脚本将其删除。

快捷方式路径是：

`$env:SystemDrive/Users/<user>/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/setwallpaper.lnk`

**解决方案**  
手动删除此文件，或使用脚本将其删除。

**删除快捷方式文件的 PowerShell 脚本示例**

```
foreach ($userDir in (Get-ChildItem "C:\Users" -Force -Directory).FullName)
{
	$startupPath = Join-Path $userDir -ChildPath "AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"
	if (Test-Path $startupPath)
	{
		$wallpaperSetupPath = Join-Path $startupPath -ChildPath "setwallpaper.lnk"
		if (Test-Path $wallpaperSetupPath)
		{
			Remove-Item $wallpaperSetupPath -Force -Confirm:$false
		}
	}
}
```

### 服务停留在运行状态
<a name="ec2launchv2-troubleshooting-service-stuck-running"></a>

**说明**

EC2Launch v2 被阻止，日志消息（`agent.log`）与以下类似：

```
2022-02-24 08:08:58 Info: *****************************************************************************************
2022-02-24 08:08:58 Info: EC2Launch Service starting
2022-02-24 08:08:58 Info: Windows event custom log exists: Amazon EC2Launch
2022-02-24 08:08:58 Info: ACPI SPCR table not supported. Bailing Out
2022-02-24 08:08:58 Info: Serial port is in use. Waiting for Serial Port...
2022-02-24 08:09:00 Info: ACPI SPCR table not supported. Use default console port.
2022-02-24 08:09:02 Info: ACPI SPCR table not supported. Use default console port.
2022-02-24 08:09:04 Info: ACPI SPCR table not supported. Use default console port.
2022-02-24 08:09:06 Info: ACPI SPCR table not supported. Use default console port.
```

**可能的原因**  
SAC 已启用并使用串行端口。有关更多信息，请参阅[使用 SAC 排查 Windows 实例的问题](troubleshoot-using-serial-console.md#troubleshooting-sac)。

**解决方案**  
请尝试以下步骤来解决该问题：
+ 禁用使用串行端口的服务。
+ 如果您希望服务继续使用串行端口，请编写自定义脚本来执行启动代理任务，并将其作为计划的任务调用。

### 无效的 `agent-config.yml` 会阻止打开 EC2Launch v2 设置对话框
<a name="ec2launchv2-troubleshooting-invalid-agent-config"></a>

**说明**  
EC2Launch v2 设置在打开对话框之前尝试解析 `agent-config.yml` 文件。如果 YAML 配置文件不遵循支持的架构，则对话框将显示以下错误：

`Unable to parse configuration file agent-config.yml. Review configuration file. Exiting application.`

**解决方案**

1. 验证配置文件是否遵循[支持的架构](ec2launch-v2-settings.md#ec2launch-v2-schema-agent-config)。

1. 如果想从头开始，请将默认配置文件复制到 `agent-config.yml` 中。您可以使用“任务配置”部分中提供的[示例 `agent-config.yml`](ec2launch-v2-settings.md#ec2launch-v2-example-agent-config)。

1. 您也可以通过删除 `agent-config.yml` 重新开始。EC2Launch v2 设置会生成空配置文件。

### `task:executeScript should be unique and only invoked once`
<a name="ec2launchv2-troubleshooting-executescript"></a>

**说明**  
不能在同一阶段重复一个任务。

**解决方案**  
有些任务必须作为数组输入，例如 [**executeScript**](ec2launch-v2-task-definitions.md#ec2launch-v2-executescript) 和 [**executeProgram**](ec2launch-v2-task-definitions.md#ec2launch-v2-executeprogram)。有关如何将脚本编写为数组的示例，请参阅 [**executeScript**](ec2launch-v2-task-definitions.md#ec2launch-v2-executescript)。

## Windows 事件日志
<a name="ec2launchv2-windows-event-logs"></a>

EC2Launch v2 发布重要事件的 Windows 事件日志，例如服务启动、Windows 已就绪以及任务成功和失败。事件标识符唯一标识特定事件。每个事件都包含阶段、任务和级别信息以及描述。您可以使用事件标识符为特定事件设置触发器。

事件 ID 提供有关事件的信息，并唯一标识某些事件。事件 ID 的最低有效位表示事件的严重性。


| 活动 | 最低有效位 | 
| --- | --- | 
|  Success  | . . .0 | 
| Informational | . . .1 | 
| Warning | . . .2 | 
| Error | . . .3 | 

当服务启动或停止时生成的与服务相关的事件，包括个位数事件标识符。


| 活动 | 个位数标识符 | 
| --- | --- | 
|  Success  | 0 | 
| Informational | 1 | 
| Warning | 2 | 
| Error | 3 | 

`EC2LaunchService.exe` 事件的事件消息以 `Service:` 开头。`EC2Launch.exe` 事件的事件消息不以 `Service:` 开头。

四位数的事件 ID 包括有关事件阶段、任务和严重性的信息。

**Topics**
+ [事件 ID 格式](#ec2launchv2-windows-event-logs-format)
+ [事件 ID 示例](#ec2launchv2-windows-event-logs-id-examples)
+ [Windows 事件日志架构](#ec2launch-v2-windows-event-logs-schema)

### 事件 ID 格式
<a name="ec2launchv2-windows-event-logs-format"></a>

下表显示了 EC2Launch v2 事件标识符的格式。


| 3 | 2 1 | 0 | 
| --- | --- | --- | 
| S | T | L | 

表中的字母和数字代表以下事件类型和定义。


| Event type | 定义 | 
| --- | --- | 
| S（阶段） | 0 – 服务级别消息<br />1 – Boot<br />2 – Network<br />3 – PreReady<br />5 – Windows 准备就绪<br />6 – Postready<br />7 – UserData | 
| T（任务） | 由相应的两个值表示的任务在每个阶段都不同。要查看事件的完整列表，请参阅 [Windows 事件日志架构](#ec2launch-v2-windows-event-logs-schema)。 | 
| L（事件级别） | 0 – 成功<br />1 – 信息性<br />2 – 警告<br />3 – 错误 | 

### 事件 ID 示例
<a name="ec2launchv2-windows-event-logs-id-examples"></a>

以下是示例事件 ID。
+ `5000` – Windows 已准备好使用
+ `3010` – PreReady 阶段中的激活 Windows 任务已成功执行
+ `6013` – Postready 本地数据阶段中的设置壁纸任务遇到错误

### Windows 事件日志架构
<a name="ec2launch-v2-windows-event-logs-schema"></a>


| 消息/事件 ID | 事件消息 | 
| --- | --- | 
|  . . .0  | Success | 
|  . . .1  | Informational | 
|  . . .2  | Warning | 
|  . . .3  | Error | 
|  x  | EC2Launch service-level logs | 
|  0  | EC2Launch service exited successfully | 
|  1  |  EC2Launch service informational logs | 
|  2  |  EC2Launch service warning logs | 
| 3 | EC2Launch service error logs | 
|  10  | Replace state.json with previous-state.json | 
| 100 | Serial Port | 
| 200 | Sysprep | 
| 300 | PrimaryNic | 
| 400 | Metadata | 
|  x000  | Stage (1 digit), Task (2 digits), Status (1 digit) | 
|  1000  | Boot | 
|  1010  | Boot - extend\_root\_partition | 
| 2000 | Network | 
|  2010  | Network - add\_routes | 
|  3000  | PreReady | 
|  3010  | PreReady - activate\_windows | 
|  3020  | PreReady - install\_egpu\_manager | 
|  3030  | PreReady - set\_monitor\_on | 
|  3040  | PreReady - set\_hibernation | 
|  3050  | PreReady - set\_admin\_account | 
|  3060  | PreReady - set\_dns\_suffix | 
|  3070  | PreReady - set\_wallpaper | 
|  3080  | PreReady - set\_update\_schedule | 
|  3090  | PreReady - output\_log | 
|  3100  | PreReady - enable\_open\_ssh | 
|  5000  | Windows is Ready to use | 
|  6000  | PostReadyLocalData | 
| 7000 | PostReadyUserData | 
|  6010/7010  | PostReadyLocal/UserData - set\_wallpaper | 
|  6020/7020  | PostReadyLocal/UserData - set\_update\_schedule | 
|  6030/7030  | PostReadyLocal/UserData - set\_hostname | 
|  6040/7040  | PostReadyLocal/UserData - execute\_program | 
|  6050/7050  | PostReadyLocal/UserData - execute\_script | 
|  6060/7060  | PostReadyLocal/UserData - manage\_package | 
|  6070/7070  | PostReadyLocal/UserData - initialize\_volume | 
|  6080/7080  | PostReadyLocal/UserData - write\_file | 
|  6090/7090  | PostReadyLocal/UserData - start\_ssm | 
|  7100  | PostReadyUserData - enable\_open\_ssh | 
|  6110/7110  | PostReadyLocal/UserData - enable\_jumbo\_frames | 

## EC2Launch v2 控制台日志输出
<a name="ec2launchv2-console-output"></a>

本部分包含 EC2Launch v2 的示例控制台日志输出，并列出所有 EC2Launch v2 控制台日志错误消息，以帮助您排查问题。有关实例控制台输出及如何进行访问的更多信息，请参阅 [实例控制台输出](troubleshoot-unreachable-instance.md#instance-console-console-output)。

**Topics**
+ [EC2Launch v2 控制台日志输出](#ec2launchv2-console-log-output)
+ [EC2Launch v2 控制台日志消息](#ec2launchv2-console-log-messages)

### EC2Launch v2 控制台日志输出
<a name="ec2launchv2-console-log-output"></a>

以下是 EC2Launch v2 的示例控制台日志输出。本示例中的某些值被用大括号括起来的代表性文本替换。

```
2025/07/22 21:26:53Z: Windows sysprep configuration complete.
2025/07/22 21:26:53Z: Message: Waiting for access to metadata...
2025/07/22 21:26:53Z: Message: Meta-data is now available.
2025/07/22 21:26:53Z: AMI Origin Version: 2024.12.13
2025/07/22 21:26:53Z: AMI Origin Name: Windows_Server-2022-English-Full-Base
2025/07/22 21:26:53Z: OS: Microsoft Windows NT 10.0.20348
2025/07/22 21:26:53Z: OsVersion: 10.0
2025/07/22 21:26:53Z: OsProductName: Windows Server 2022 Datacenter
2025/07/22 21:26:53Z: OsBuildLabEx: 20348.1.amd64fre.fe_release.210507-1500
2025/07/22 21:26:53Z: OsCurrentBuild: 20348
2025/07/22 21:26:53Z: OsReleaseId: 2009
2025/07/22 21:26:53Z: Language: en-US
2025/07/22 21:26:53Z: TimeZone: UTC
2025/07/22 21:26:53Z: Offset: UTC +0000
2025/07/22 21:26:53Z: Launch: EC2 Launch v2.2.63
2025/07/22 21:26:53Z: AMI-ID: ami-1234567890abcdef1
2025/07/22 21:26:53Z: Instance-ID: i-1234567890abcdef0
2025/07/22 21:26:54Z: Instance Type: t3.xlarge
2025/07/22 21:26:54Z: Driver: AWS NVMe Driver v1.6.0.35
2025/07/22 21:26:54Z: SubComponent: 1.6.0.35; EnableSCSIPersistentReservations: 0
2025/07/22 21:26:54Z: Driver: AWS PV Driver Package v8.5.0
2025/07/22 21:26:55Z: Driver: Amazon Elastic Network Adapter v2.8.0.0
2025/07/22 21:26:55Z: Driver: EC2 Windows Utility Device v3.1.0.25
2025/07/22 21:26:55Z: HOSTNAME: EC2AMAZ-9FJG5CC
2025/07/22 21:26:55Z: RDPCERTIFICATE-SUBJECTNAME: {certificate subject name}
2025/07/22 21:26:55Z: RDPCERTIFICATE-THUMBPRINT: {thumbprint hash}
2025/07/22 21:26:56Z: SSM: Amazon SSM Agent v3.3.2746.0
2025/07/22 21:26:57Z: User data format: no_user_data
2025/07/22 21:26:57Z: EC2LaunchTelemetry: IsTelemetryEnabled=true
2025/07/22 21:26:57Z: EC2LaunchTelemetry: AgentOsArch=windows_amd64
2025/07/22 21:26:57Z: EC2LaunchTelemetry: IsAgentScheduledPerBoot=true
2025/07/22 21:26:57Z: EC2LaunchTelemetry: AgentCommandErrorCode=1
2025/07/22 21:26:57Z: EC2LaunchTelemetry: AdminPasswordTypeCode=0
2025/07/22 21:26:57Z: EC2LaunchTelemetry: AgentErrorLocation=execute_windows.go:410
2025/07/22 21:26:57Z: EC2LaunchTelemetry: IpConflictDetectionCode=0
2025/07/22 21:26:57Z: Message: Windows is Ready to use
{"type":"EC2AgentTelemetry","agentId":"WindowsLaunchAgentV2", ...}
{"type":"EC2AgentTelemetry","agentId":"WindowsLaunchAgentV2", ...}
```

### EC2Launch v2 控制台日志消息
<a name="ec2launchv2-console-log-messages"></a>

以下是所有 EC2Launch v2 控制台日志消息的列表。

```
Error EC2Launch service is stopping. {error message}
```

停止服务错误详情：
+ `Error setting up EC2Launch agent folders`
+ `See instance logs for detail`
+ `Error stopping service`
+ `Error initializing service`

```
Windows sysprep configuration complete
```

```
Invalid administrator username: {invalid username}
```

```
Invalid administrator password
Username: {username}
Password: <Password>{encrypted password}</Password>
```

以下消息是包含 AMI 详细信息的信息块：

```
AMI Origin Version: {amiVersion}
AMI Origin Name: {amiName}
Microsoft Windows NT {currentVersion}.{currentBuildNumber}
OsVersion: {currentVersion}
OsProductName: {productName}
OsBuildLabEx: {buildLabEx}
OsCurrentBuild: {currentBuild}
OsReleaseId: {releaseId}
Language: {language}
TimeZone: {timeZone}
Offset: UTC {offset}
Launch agent: EC2Launch {BuildVersion}
AMI-ID: {amiId}
Instance-ID: {instanceId}
Instance Type: {instanceType}
HOSTNAME: {computer name}
RDPCERTIFICATE-SUBJECTNAME: {certificate subject name}
RDPCERTIFICATE-THUMBPRINT: {thumbprint hash}
SqlServerBilling: {sql billing}
SqlServerInstall: {sql patch leve, edition type}
Driver: AWS NVMe Driver {version}
Driver: Inbox NVMe Driver {version}
Driver: AWS PV Driver Package {version}
Driver: EC2 Windows Utility Device {version}
SSM: Amazon SSM Agent {version}
AWS VSS Version: {version}
```

```
Windows sysprep configuration complete.
Windows is being configured. 'SysprepState is {state}'
Windows is still being configured. 'SysprepState is {state}'
Windows is Ready to use
Waiting for access to metadata...
Meta-data is now available.
Metadata is not available for this instance.
Timed out waiting for access to metadata.
User data format: {format}
```

EC2Launch v2 遥测消息包括启动遥测属性值。从 2.2.63 版本开始，EC2 代理遥测数据被格式化为 JSON 对象。

```
EC2LaunchTelemetry: {telemetry property}
```

```
{"type":"EC2AgentTelemetry","agentId":"WindowsLaunchAgentV2" ... }
```
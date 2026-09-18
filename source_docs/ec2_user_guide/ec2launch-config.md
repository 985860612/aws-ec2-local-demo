

# 在 Windows 实例上配置 EC2Launch v1 代理
<a name="ec2launch-config"></a>

在您的实例首次初始化后，您可以配置 EC2Launch 以再次运行并执行不同的启动任务。

**Topics**
+ [配置初始化文件](#ec2launch-inittasks)
+ [计划 EC2Launch 在每次启动时运行](#run-on-every-boot)
+ [初始化驱动器并映射盘符](#ec2launch-mapping)
+ [将 Windows 事件日志发送到 EC2 控制台](#ec2launch-sendlogs)
+ [在成功启动后发送 Windows 已准备就绪消息](#ec2launch-sendwinisready)

## 配置初始化文件
<a name="ec2launch-inittasks"></a>

指定 `LaunchConfig.json` 文件中的设置以启用或禁用以下初始化任务：
+ 将计算机名称设置为实例的私有 IPv4 地址。
+ 将显示器设置为始终保持打开状态。
+ 设置新墙纸。
+ 添加 DNS 后缀列表。
**注意**  
这会为以下域添加 DNS 后缀查找，并配置其他标准后缀。有关启动代理如何设置 DNS 后缀的更多信息，请参阅 [为 EC2 Windows 启动代理配置 DNS 后缀](launch-agents-set-dns.md)。  

  ```
  {{region}}.ec2-utilities.amazonaws.com
  ```
+ 扩展引导卷大小。
+ 设置管理员密码。

**配置初始化设置**

1. 在要配置的实例上，在文本编辑器中打开以下文件：`C:\ProgramData\Amazon\EC2-Windows\Launch\Config\LaunchConfig.json`。

1. 根据需要更新以下设置并保存您的更改。仅当 `adminPassword` 为 `adminPasswordtype` 时，在 `Specify` 中提供密码。

   ```
   {
   	"setComputerName": false,
   	"setMonitorAlwaysOn": true,
   	"setWallpaper": true,
   	"addDnsSuffixList": true,
   	"extendBootVolumeSize": true,
   	"handleUserData": true,					  
   	"adminPasswordType": "Random | Specify | DoNothing",
   	"adminPassword": "password that adheres to your security policy (optional)"
   }
   ```

   密码类型定义如下：  
`Random`  
EC2Launch 生成一个密码并使用用户的密钥对其进行加密。系统会在实例启动后禁用此设置，以便在重新启动或停止再启动实例后该密码仍然存在。  
`Specify`  
EC2Launch 使用您在 `adminPassword` 中指定的密码。如果密码不满足系统要求，EC2Launch 会生成随机密码。该密码以明文方式存储在 `LaunchConfig.json` 文件中，并且在 Sysprep 设置管理员密码时会被删除。EC2Launch 使用用户的密钥对密码进行加密。  
`DoNothing`  
EC2Launch 使用您在 `unattend.xml` 文件中指定的密码。如果未在 `unattend.xml` 中指定密码，管理员账户会被禁用。

1. 在 Windows PowerShell 中运行以下命令，以便安排脚本作为 Windows 计划任务运行。该脚本将在下次启动期间执行一次，然后禁止这些任务再次运行。

   ```
   C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\InitializeInstance.ps1 -Schedule
   ```

## 计划 EC2Launch 在每次启动时运行
<a name="run-on-every-boot"></a>

您可以计划 EC2Launch 在每次启动时运行，而不是仅仅在首次启动时运行。

要允许 EC2Launch 在每次启动时运行，请执行以下操作：

1. 打开 Windows PowerShell 并运行以下命令：

   ```
   C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\InitializeInstance.ps1 -SchedulePerBoot
   ```

1. 或者，使用以下命令运行可执行文件：

   ```
   C:\ProgramData\Amazon\EC2-Windows\Launch\Settings\Ec2LaunchSettings.exe
   ```

   然后选择 `Run EC2Launch on every boot`。您可以为 EC2 实例指定 `Shutdown without Sysprep` 或 `Shutdown with Sysprep`。

**注意**  
当您允许 EC2Launch 在每次启动时运行，下次 EC2Launch 运行时将发生以下情况：  
如果 `AdminPasswordType` 仍设置为 `Random`，则 EC2Launch 将在下次启动时生成新密码。在启动之后，`AdminPasswordType` 会自动设置为 `DoNothing`，以防止 EC2Launch 在后续启动时生成新密码。要防止 EC2Launch 在第一次启动时生成新密码，请手动将 `AdminPasswordType` 设置为 `DoNothing`，然后再重新启动。
除非用户数据的 `HandleUserData` 设置为 `false`，否则 `persist` 将设置回 `true`。有关更多信息，请参阅 [用户数据脚本](user-data.md#user-data-scripts)。

## 初始化驱动器并映射盘符
<a name="ec2launch-mapping"></a>

在 `DriveLetterMappingConfig.json` 文件中指定设置以将盘符映射到您的 EC2 实例上的卷。该脚本用于初始化尚未初始化和分区的驱动器。有关在 Windows 中获取卷详细信息的更多信息，请参阅 Microsoft 文档中的 [Get-Volume](https://learn.microsoft.com/en-us/powershell/module/storage/get-volume)。

**将盘符映射到卷**

1. 在文本编辑器中打开 `C:\ProgramData\Amazon\EC2-Windows\Launch\Config\DriveLetterMappingConfig.json` 文件。

1. 指定以下卷设置并保存您的更改：

   ```
   {
   	"driveLetterMapping": [
   		{
   			"volumeName": "{{sample volume}}",
   			"driveLetter": "{{H}}"
   		}
   	]
   }
   ```

1. 打开 Windows PowerShell 并使用以下命令来运行初始化磁盘的 EC2Launch 脚本：

   ```
   C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\InitializeDisks.ps1
   ```

   要在每次实例启动时初始化磁盘，请添加 `-Schedule` 标记，如下所示：

   ```
   C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\InitializeDisks.ps1 -Schedule
   ```

## 将 Windows 事件日志发送到 EC2 控制台
<a name="ec2launch-sendlogs"></a>

在 `EventLogConfig.json` 文件中指定设置，以便将 Windows 事件日志发送到 EC2 控制台日志。

**配置设置来发送 Windows 事件日志**

1. 在实例上，在文本编辑器中 `C:\ProgramData\Amazon\EC2-Windows\Launch\Config\EventLogConfig.json` 打开文件。

1. 配置以下日志设置并保存您的更改：

   ```
   {
   	"events": [
   		{
   			"logName": "{{System}}",
   			"source": "{{An event source (optional)}}",
   			"level": "{{Error | Warning | Information}}",
   			"numEntries": {{3}}
   		}
   	]
   }
   ```

1. 在 Windows PowerShell 中运行以下命令，以便每当实例启动时系统都安排脚本作为 Windows 计划任务运行。

   ```
   C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\SendEventLogs.ps1 -Schedule
   ```

   日志可能需要三分钟或更长时间才会显示在 EC2 控制台日志中。

## 在成功启动后发送 Windows 已准备就绪消息
<a name="ec2launch-sendwinisready"></a>

在每次启动后，EC2Config 服务会向 EC2 控制台发送“Windows 已准备就绪”消息。EC2Launch 仅在初次启动后发送此消息。为了实现与 EC2Config 服务的向后兼容，您可以安排 EC2Launch 在每次启动时发送此消息。在实例上，打开 Windows PowerShell 并运行以下命令。系统会安排脚本作为 Windows 计划任务运行。

```
C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\SendWindowsIsReady.ps1 -Schedule
```
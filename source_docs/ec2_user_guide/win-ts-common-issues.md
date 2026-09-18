

# 排查 Amazon EC2 Windows 实例问题
<a name="win-ts-common-issues"></a>

以下问题排查技巧有助于解决与 Amazon EC2 Windows 实例相关的问题。

**Topics**
+ [无法将 AWS Systems Manager 会话管理器连接到 Windows Server 2025 实例](#connect-sysmgr-win2025)
+ [EBS 卷在 Windows Server 2016 和 2019 上不初始化](#init-disks-win2k16)
+ [将 EC2 Windows 实例启动至目录服务还原模式 (DSRM)](#boot-dsrm)
+ [实例失去网络连接或计划的任务不按预期方式运行](#instance-loses-network-connectivity)
+ [无法获取控制台输出](#no-console-output)
+ [网络上不可用的 Windows Server 2012 R2](#server-2012-network-loss)
+ [磁盘签名冲突](#disk-signature-collision)

## 无法将 AWS Systems Manager 会话管理器连接到 Windows Server 2025 实例
<a name="connect-sysmgr-win2025"></a>

将 AWS Systems Manager 会话管理器连接到 Windows Server 2025 实例可能会遇到问题。要解决此问题，请登录实例，然后导航到`Settings > Apps > Optional Features`并添加 `WMIC`。重启 SSM 代理服务或重启实例，并且Sessions Manager应该可以连接了。

您也可以使用以下 PowerShell 命令执行相同的操作：

```
Start-Process -FilePath "$env:SystemRoot\system32\Dism.exe" -ArgumentList @('/Online', '/Add-Capability', '/CapabilityName:WMIC~~~~') -Wait; Restart-Service -Name AmazonSSMAgent
```

## EBS 卷在 Windows Server 2016 和 2019 上不初始化
<a name="init-disks-win2k16"></a>

从 Windows Server 2016 和 2019 的 Amazon 系统映像（AMI）创建的实例使用 EC2Launch v1 代理来执行各种启动任务，包括初始化 EBS 卷。默认情况下，EC2Launch v1 不初始化辅助卷。不过，您可以将 EC2Launch v1 配置为自动初始化这些磁盘，如下所示。

**将盘符映射到卷**

1. 连接到要配置的实例并在文本编辑器中打开 `C:\ProgramData\Amazon\EC2-Windows\Launch\Config\DriveLetterMappingConfig.json` 文件。

1. 指定卷设置如下：

   ```
   {
   "driveLetterMapping": [
   	{
   	  "volumeName": "{{sample volume}}",
   	  "driveLetter": "{{H}}"
   	}]
   }
   ```

1. 保存更改并关闭文件。

1. 打开 Windows PowerShell 并使用以下命令来运行初始化磁盘的 EC2Launch v1 脚本：

   ```
   PS C:\>  C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\InitializeDisks.ps1
   ```

   要在每次实例启动时初始化磁盘，请添加 `-Schedule` 标记，如下所示：

   ```
   PS C:\>  C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\InitializeDisks.ps1 -Schedule
   ```

   EC2Launch v1 代理可以运行实例初始化脚本，例如 `initializeDisks.ps1` 与 `InitializeInstance.ps1` 脚本并行使用。如果 `InitializeInstance.ps1` 脚本重启实例，它可能会中断实例启动时运行的其他计划任务。为避免任何潜在的冲突，建议向 `initializeDisks.ps1` 脚本添加逻辑，以确保首先完成实例初始化。
**注意**  
如果 EC2Launch 脚本未初始化卷，请确保卷处于联机状态。如果卷处于脱机状态，请运行以下命令，使所有磁盘联机。  

   ```
   PS C:\> Get-Disk | Where-Object IsOffline -Eq $True | Set-Disk -IsOffline $False
   ```

## 将 EC2 Windows 实例启动至目录服务还原模式 (DSRM)
<a name="boot-dsrm"></a>

如果运行 Microsoft Active Directory 的实例遇到系统故障或其他关键问题，您可以通过启动至特殊版本的安全模式（称为*目录服务还原模式* (DSRM)）对该实例进行故障排除。在 DSRM 中，您可以修复或恢复 Active Directory。

### DSRM 的驱动程序支持
<a name="boot-dsrm-driver"></a>

您启用 DSRM 和启动至实例的方式取决于实例正在运行的驱动程序。在 EC2 控制台中，您可以从系统日志查看实例的驱动程序版本详细信息。下表显示了 DSRM 支持的驱动程序。


| 驱动程序版本 | DSRM 是否支持？ | 后续步骤 | 
| --- | --- | --- | 
| Citrix PV 驱动程序 5.9 | 否 | 从备份还原实例。您无法启用 DSRM。 | 
| AWS PV 7.2.0 | 否 | 尽管该驱动程序不支持 DSRM，但您仍可以将根卷从实例分离并为其创建快照或 AMI，然后将其作为辅助卷附加到同一个可用区中的其他实例。然后，您可以按照本部分的说明启用 DSRM。 | 
| AWS PV 7.2.2 和更高版本 | 是 | 分离根卷，将其附加到其他实例，然后启用 DSRM (如本节中所述)。 | 
| 增强联网 | 是 | 分离根卷，将其附加到其他实例，然后启用 DSRM (如本节中所述)。 | 

有关如何启用增强联网的信息，请参阅 [在 EC2 实例上使用 ENA 启用增强联网功能](enhanced-networking-ena.md)。有关升级 AWS PV 驱动程序的信息，请参阅[在 Windows 实例上升级半虚拟化驱动程序](Upgrading_PV_drivers.md)。

### 将实例配置为启动至 DSRM
<a name="configure-boot-dsrm"></a>

在操作系统运行前，EC2 Windows 实例没有网络连接。因此，您无法通过按键盘上的 F8 键来选择启动选项。您必须使用以下过程之一将 EC2 Windows Server 实例启动至 DSRM。

如果您怀疑 Active Directory 已损坏，但该实例仍在运行，则可以使用 System Configuration 对话框或命令提示符将该实例配置为启动至 DSRM。

**使用 System Configuration 对话框将在线实例启动至 DSRM**

1. 在 **Run** 对话框中，键入 `msconfig` 并按下 Enter。

1. 选择 **Boot** 选项卡。

1. 在 **Boot options** 下，选择 **Safe boot**。

1. 选择 **Active Directory repair**，然后选择 **OK**。系统将提示您重新启动服务器。

**使用命令行将在线实例启动至 DSRM**  
从命令提示符窗口运行以下命令：

```
bcdedit /set safeboot dsrepair
```

如果某个实例处于离线状态并且无法访问，您必须先分离根卷并将其附加到其他实例才能启用 DSRM 模式。

**将离线实例启动至 DSRM**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 找到并选择受影响的实例。依次选择**实例状态**、**停止实例**。

1. 选择**启动实例**并在受影响实例所在的同一可用区中创建一个临时实例。选择使用其他 Windows 版本的实例类型。例如，如果实例是 Windows Server 2016，请选择 Windows Server 2019 实例。
**重要**  
如果您未在与受影响实例相同的可用区中创建该实例，则无法将受影响的实例的根卷附加到新实例。

1. 在导航窗格中，选择 **Volumes**。

1. 找到受影响的实例的根卷。[分离](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-detaching-volume.html)该卷并将其[附加到](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-attaching-volume.html)早先创建的临时实例。使用默认设备名称 (xvdf) 附加该卷。

1. 使用远程桌面连接临时实例，然后通过磁盘管理实用工具[使该卷可供使用](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html)。

1. 打开命令提示符窗口并运行以下命令。将 *D* 替换为您刚刚附加的辅助卷的实际驱动器号：

   ```
   bcdedit /store D:\Boot\BCD /set {default} safeboot dsrepair
   ```

1. 在磁盘管理实用工具中，选择您之前附加的驱动器，打开上下文（右键单击）菜单，然后选择**脱机**。

1. 在 EC2 控制台中，将受影响的卷从临时实例分离，然后将其重新附加到设备名称为 `/dev/sda1` 的原始实例。您必须指定此设备名称才能将卷指派为根卷。

1. [启动实例。](Stop_Start.md)

1. 在实例将健康检查传入 EC2 控制台后，使用远程桌面连接到实例，然后验证实例是否启动至 DSRM 模式。

1. (可选) 删除或停止您在本过程中创建的临时实例。

## 实例失去网络连接或计划的任务不按预期方式运行
<a name="instance-loses-network-connectivity"></a>

如果您重新启动实例而该实例失去网络连接，则可能该实例的时间不正确。

默认情况下，Windows 实例使用协调世界时 (UTC)。如果将实例的时间设置为不同的时区，然后再重新启动实例，则时间会发生偏移，该实例暂时失去其 IP 地址。实例最终会重新获取网络连接，但这可能要用数小时的时间。实例重新获取网络连接所用的时间取决于 UTC 与其他时区之间的差异。

这种时间问题也可能导致计划的任务不如期运行。在这种情况下，计划的任务会因实例的时间不正确而不如期运行。

要持久使用 UTC 以外的时区，您必须设置 **RealTimeIsUniversal** 注册表项。若不设置此项，则实例会在重新启动后使用 UTC。

**解决造成网络连接丢失的时间问题**

1. 确保所运行的是建议的半虚拟化驱动程序。有关更多信息，请参阅 [在 EC2 Windows 实例上升级半虚拟化驱动程序](Upgrading_PV_drivers.md)。

1. 验证以下注册表项存在并且已设置为 `1`：**HKEY\_LOCAL\_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\TimeZoneInformation\\RealTimeIsUniversal**

## 无法获取控制台输出
<a name="no-console-output"></a>

对于 Windows 实例，实例控制台显示在 Windows 引导过程中执行的任务的输出。如果 Windows 成功启动，则最后记录的消息是 `Windows is Ready to use`。您也可以在控制台中显示事件日志消息，但根据您的 Windows 版本，此功能可能默认未启用。有关更多信息，请参阅 [Amazon EC2 Windows 实例上的 Windows 启动代理](configure-launch-agents.md)。

要使用 Amazon EC2 控制台获取您的实例的控制台输出，请选择实例，然后依次选择 **Actions (操作)**、**Monitor and troubleshoot (显示屏和问题排查)**、**Get System Log (获取系统日志)**。要使用命令行获取控制台输出，请使用以下命令之一：[get-console-output](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-console-output.html) (AWS CLI) 或 [Get-EC2ConsoleOutput](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ConsoleOutput.html) (AWS Tools for Windows PowerShell)。

对于运行 Windows Server 2012 R2 和更早版本的实例，如果控制台输出为空，则可能表示 EC2Config 服务出现问题（如未正确配置的配置文件），或者 Windows 无法正确引导。要修复该问题，请下载并安装最新版本的 EC2Config。有关更多信息，请参阅 [安装最新版的 EC2Config](UsingConfig_Install.md)。

## 网络上不可用的 Windows Server 2012 R2
<a name="server-2012-network-loss"></a>

有关对网络上不可用的 Windows Server 2012 R2 实例进行故障排除的信息，请参阅 [Windows Server 2012 R2 在实例重启后丢失网络和存储连接](pvdrivers-troubleshooting.md#server2012R2-instance-unavailable)。

## 磁盘签名冲突
<a name="disk-signature-collision"></a>

您可以使用 [EC2Rescue for Windows Server](Windows-Server-EC2Rescue.md) 检查和解决磁盘签名冲突。或者，您可以通过执行以下步骤手动解决磁盘签名问题。
**警告**  
以下过程介绍了如何使用注册表编辑器编辑 Windows 注册表。如果您不熟悉 Windows 注册表或如何安全地使用注册表编辑器进行更改，请参阅[配置注册表](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc725612(v=ws.11))。

1. 打开命令提示符，键入 **regedit.exe**，然后按 Enter。

1. 在 **Registry Editor (注册表编辑器)** 中，从上下文菜单（右键单击）中选择 **HKEY\_LOCAL\_MACHINE**，然后选择 **Find (查找)**。

1. 键入 **Windows Boot Manager**，然后选择 **Find Next (查找下一个)**。

1. 选择名为 `11000001` 的密钥。此密钥是您在上一步中找到的密钥的同级。

1. 在右侧窗格中，选择 `Element`，然后从上下文菜单（右键单击）中选择 **Modify (修改)**。

1. 找到数据中偏移 0x38 处的四字节磁盘签名。这是启动配置数据库签名 (BCD)。反转字节以创建磁盘签名，然后将其记录下来。例如，由以下数据表示的磁盘签名是 `E9EB3AA5`：

   ```
   ...
   0030  00 00 00 00 01 00 00 00
   0038  {{A5 3A EB E9}} 00 00 00 00
   0040  00 00 00 00 00 00 00 00
   ...
   ```

1. 在命令提示符窗口运行以下命令以启动 Microsoft DiskPart。

   ```
   diskpart
   ```

1. 运行 `select disk` DiskPart 命令，并为存在磁盘签名冲突的卷指定磁盘号。
**提示**  
要检查存在磁盘签名冲突的卷的磁盘号，请使用**磁盘管理**实用程序。打开命令提示符，键入 `compmgmt.msc`，然后按 **Enter** 键。在左侧导航面板中，打开**磁盘管理**。在**磁盘管理**实用程序中，检查存在磁盘签名冲突的脱机卷的磁盘号。

   ```
   DISKPART> select disk {{1}}
   Disk {{1}} is now the selected disk.
   ```

1. 运行以下 DiskPart 命令以获取磁盘签名。

   ```
   DISKPART>  uniqueid disk
   Disk ID: {{0C764FA8}}
   ```

1. 如果上一步中显示的磁盘签名与之前写下的磁盘签名不匹配，请使用以下 DiskPart 命令更改磁盘签名，使其匹配：

   ```
   DISKPART> uniqueid disk id={{E9EB3AA5}}
   ```
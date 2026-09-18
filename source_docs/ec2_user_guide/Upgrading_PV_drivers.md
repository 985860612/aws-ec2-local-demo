

# 在 EC2 Windows 实例上升级半虚拟化驱动程序
<a name="Upgrading_PV_drivers"></a>

我们建议您安装最新的半虚拟化驱动程序来提高您的 EC2 Windows 实例的稳定性和性能。本页上的说明可以帮助您下载驱动程序包并运行安装程序。

**验证您的 Windows 实例使用哪个驱动程序**

打开**设备管理器**，查看**网络适配器**。验证 PV 驱动程序是否是以下一种：
+ AWS PV 网络设备
+ Citrix PV 以太网适配器
+ Red Hat PV NIC 驱动程序

**Topics**
+ [AWS PV 驱动程序包的系统要求](#aws-pv-requirements)
+ [使用分发服务器升级 Windows Server 实例（AWS PV 升级）](#aws-pv-upgrade-distributor)
+ [手动升级 Windows Server 实例(AWS PV 升级)](#aws-pv-upgrade)
+ [升级域控制器 (AWS PV 升级)](#aws-pv-upgrade-dc)
+ [升级 Windows Server 2008 和 2008 R2 实例（Red Hat 到 Citrix PV 的升级）](#win2008-citrix-upgrade)
+ [升级 Citrix Xen 代理客户服务](#citrix-pv-guest-agent-upgrade)

## AWS PV 驱动程序包的系统要求
<a name="aws-pv-requirements"></a>

无论是通过 Systems Manager 还是以手动方式安装，以下要求均适用于 AWS PV 驱动程序包。
+ 该程序包版本支持的 Windows Server 版本。旧版本 Windows Server 需要使用较早的程序包版本。有关与您的操作系统配合使用的程序包版本，请参阅[Windows 实例的半虚拟化驱动程序](xen-drivers-overview.md)。
+ 程序包安装程序所需的最低 .NET Framework 版本如下表所示。


| AWS PV 驱动程序包版本 | 最低 .NET Framework 版本 | 
| --- | --- | 
| 最新 | 4.7.2 | 
| 8.4.3 | 4.5 | 
| 8.3.5 | 4.5 | 

## 使用分发服务器升级 Windows Server 实例（AWS PV 升级）
<a name="aws-pv-upgrade-distributor"></a>

您可以使用分发服务器（AWS Systems Manager 的一项功能）安装或升级 AWS PV 驱动程序包。安装或升级可以执行一次，也可以按计划进行安装或升级。此分发服务器软件包不支持**安装类型** 的 `In-place update` 选项。

**重要**  
如果您的实例是域控制器，请参阅[升级域控制器 (AWS PV 升级)](#aws-pv-upgrade-dc)。这些域控制器实例的升级过程与标准版本的 Windows 的升级过程不同。

1. 如果需要回滚更改，我们建议您创建备份。
**提示**  
您可以使用 `AWS-CreateImage` 运行手册，通过 Systems Manager Automation 创建 AMI，而不是从 Amazon EC2 控制台创建 AMI。有关更多信息，请参阅 *AWS Systems Manager Automation 运行手册参考用户指南*中的 [AWS-CreateImage](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-aws-createimage.html)。

   1. 当您停止某个实例时，任何实例存储卷上的数据都将被擦除。在停止实例之前，请确认您是否已将所需数据从实例存储卷复制到持久性存储，例如 Amazon EBS 或 Amazon S3。

   1. 在导航窗格中，选择**实例**。

   1. 选择需要升级驱动程序的实例，然后依次选择 **Instance state (实例状态)**、**Stop instance (停止实例)**。

   1. 实例停止后，选择实例，依次选择 **Actions (操作) **、**Image and templates (映像和模板)**，然后选择 **Create image (创建映像)**。

   1. 依次选择**实例状态**、**启动实例**。

1. 使用远程桌面来连接到实例。有关更多信息，请参阅 [使用 RDP 客户端连接到 Windows 实例](connect-rdp.md)。

1. <a name="secondary-disks-step-distributor"></a>在执行此升级之前，建议您将所有非系统磁盘离线，然后记录磁盘管理中映射到辅助磁盘的所有盘符。如果您要对 AWS PV 驱动程序执行就地升级，则不需要此步骤。我们还建议在 Services 控制台中将不必要的服务设置为 **Manual** 启动。

1. <a name="distributor-procedure-awspv"></a>有关如何使用分发服务器安装或升级 AWS PV 驱动程序包的说明，请参阅 *AWS Systems Manager 用户指南*中的[安装或更新软件包](https://docs.aws.amazon.com/systems-manager/latest/userguide/distributor-working-with-packages-deploy.html)。

1. 在**名称**中，选择 **AWSPVDriver**。

1. 在**安装类型**中，选择**卸载并重新安装**。

1. 根据需要为软件包配置其他参数，然后使用 [Step 4](#distributor-procedure-awspv) 中提及的过程运行安装或升级。

   在运行分发服务器软件包后，实例将自动重启，然后升级驱动程序。实例将有长达 15 分钟的时间不可用。

1. 升级完成且实例通过 Amazon EC2 控制台的两项运行状况检查后，使用远程桌面连接实例，验证新驱动程序是否已安装。

1. 连接后，请运行以下 PowerShell 命令：

   ```
   Get-ItemProperty HKLM:\SOFTWARE\Amazon\PVDriver
   ```

1. 确认驱动程序版本与驱动程序版本历史记录表中列出的最新版本相同。有关更多信息，请参阅 [AWS PV 驱动程序包历史记录](xen-drivers-overview.md#pv-driver-history)。打开磁盘管理以审核所有脱机辅助卷，并按照 [Step 3](#secondary-disks-step-distributor) 中记录的对应盘符将其联机。

如果您之前使用 Netsh 为 Citrix PV 驱动程序禁用了 [TCP 分载](pvdrivers-troubleshooting.md#citrix-tcp-offloading)，建议您在升级到 AWS PV 驱动程序后重新启用此功能。Citrix 驱动程序的 TCP 分载问题在 AWS PV 驱动程序中不会出现。因此，通过使用 AWS PV 驱动程序，TCP 分载可提供更高的性能。

如果您之前已将一个静态 IP 地址或 DNS 配置应用于网络接口，则可能需要在升级 AWS PV 驱动程序后重新应用该静态 IP 地址或 DNS 配置。

## 手动升级 Windows Server 实例(AWS PV 升级)
<a name="aws-pv-upgrade"></a>

使用以下过程对 AWS PV 驱动程序执行就地升级，或在 Windows Server 2008 R2、Windows Server 2012、Windows Server 2012 R2、Windows Server 2016、Windows Server 2019 或 Windows Server 2022 上从 Citrix PV 驱动程序升级到 AWS PV 驱动程序。此升级不适用于 Red Hat 驱动程序或 Windows Server 的其他版本。

**重要**  
如果您的实例是域控制器，请参阅[升级域控制器 (AWS PV 升级)](#aws-pv-upgrade-dc)。这些域控制器实例的升级过程与标准版本的 Windows 的升级过程不同。

**手动升级 AWS PV 驱动程序**

1. 如果需要回滚更改，我们建议您创建备份。
**提示**  
您可以使用 `AWS-CreateImage` 运行手册，通过 Systems Manager Automation 创建 AMI，而不是从 Amazon EC2 控制台创建 AMI。有关更多信息，请参阅 *AWS Systems Manager Automation 运行手册参考用户指南*中的 [AWS-CreateImage](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-aws-createimage.html)。

   1. 当您停止某个实例时，任何实例存储卷上的数据都将被擦除。在停止实例之前，请确认您是否已将所需数据从实例存储卷复制到持久性存储，例如 Amazon EBS 或 Amazon S3。

   1. 在导航窗格中，选择**实例**。

   1. 选择需要升级驱动程序的实例，然后依次选择 **Instance state (实例状态)**、**Stop instance (停止实例)**。

   1. 实例停止后，选择实例，依次选择 **Actions (操作) **、**Image and templates (映像和模板)**，然后选择 **Create image (创建映像)**。

   1. 依次选择**实例状态**、**启动实例**。

1. 使用远程桌面来连接到实例。

1. <a name="secondary-disks-step-manual"></a>在执行此升级之前，建议您将所有非系统磁盘离线，然后记录磁盘管理中映射到辅助磁盘的所有盘符。如果您要对 AWS PV 驱动程序执行就地升级，则不需要此步骤。我们还建议在 Services 控制台中将不必要的服务设置为 **Manual** 启动。

1. 使用以下选项之一将驱动程序下载到您的实例：
   + **浏览器** - 将最新的驱动程序包[下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSPV/Latest/AWSPVDriver.zip)到实例并解压缩 zip 存档。
   + **PowerShell** – 运行以下命令：

     ```
     Invoke-WebRequest https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSPV/Latest/AWSPVDriver.zip -outfile $env:USERPROFILE\pv_driver.zip
     Expand-Archive $env:userprofile\pv_driver.zip -DestinationPath $env:userprofile\pv_drivers
     ```

     如果您在下载文件时收到错误，并且正在使用 Windows Server 2016 或更早的版本，则可能需要为 PowerShell 终端启用 TLS 1.2。可以使用以下命令为当前 PowerShell 会话启用 TLS 1.2，然后重试：

     ```
     [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
     ```

1. 运行 `AWSPVDriverSetup.msi`。

在运行 MSI 后，实例将自动重启，然后升级驱动程序。实例将有长达 15 分钟的时间不可用。在升级完成并且实例通过了 Amazon EC2 控制台中的两项运行状况检查后，您可以通过使用远程桌面连接到实例，然后运行以下 PowerShell 命令，来验证新驱动程序是否已安装：

```
Get-ItemProperty HKLM:\SOFTWARE\Amazon\PVDriver
```

确认驱动程序版本与驱动程序版本历史记录表中列出的最新版本相同。有关更多信息，请参阅 [AWS PV 驱动程序包历史记录](xen-drivers-overview.md#pv-driver-history)。打开磁盘管理以审核所有脱机辅助卷，并按照 [Step 3](#secondary-disks-step-manual) 中记录的对应盘符将其联机。

如果您之前使用 Netsh 为 Citrix PV 驱动程序禁用了 [TCP 分载](pvdrivers-troubleshooting.md#citrix-tcp-offloading)，建议您在升级到 AWS PV 驱动程序后重新启用此功能。Citrix 驱动程序的 TCP 分载问题在 AWS PV 驱动程序中不会出现。因此，通过使用 AWS PV 驱动程序，TCP 分载可提供更高的性能。

如果您之前已将一个静态 IP 地址或 DNS 配置应用于网络接口，则可能需要在升级 AWS PV 驱动程序后重新应用该静态 IP 地址或 DNS 配置。

## 升级域控制器 (AWS PV 升级)
<a name="aws-pv-upgrade-dc"></a>

使用以下过程在域控制器上对 AWS PV 驱动程序执行就地升级，或者从 Citrix PV 驱动程序升级到 AWS PV 驱动程序。为确保您的 FSMO 角色在升级期间保持可操作性，我们建议您在开始升级之前将这些角色转移到其他域控制器。有关更多信息，请参阅 *Microsoft Learn* 网站上的 [How to view and transfer FSMO roles](https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/view-transfer-fsmo-roles)。

**升级域控制器**

1. 如果需要回滚更改，我们建议您创建域控制器的备份。不支持使用 AMI 作为备份。有关更多信息，请参阅 Microsoft 文档中的[备份和还原注意事项](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/virtualized-domain-controllers-hyper-v#backup-and-restore-considerations)。

1. 运行以下命令，将 Windows 配置为启动进入目录服务还原模式 (DSRM)。
**警告**  
在运行该命令之前，请确认您知道 DSRM 密码。您需要此信息，这样您可以在升级完成后登录您的实例，并且实例会自动重启。

   ```
   bcdedit /set {default} safeboot dsrepair
   ```

   PowerShell：

   ```
   PS C:\> bcdedit /set "{default}" safeboot dsrepair
   ```

   由于升级实用工具删除 Citrix PV 存储驱动程序以便安装 AWS PV 驱动程序，因此系统必须启动进入 DSRM 模式。因此，建议您记录磁盘管理中的所有盘符和文件夹对辅助磁盘的映射。没有 Citrix PV 存储驱动程序时，将不会检测到第二个驱动器。使用第二个驱动器上的 NTDS 文件夹的域控制器将不会启动，因为不会检测到第二个磁盘。
**警告**  
运行该命令后，请勿手动重启系统。系统将无法访问，因为 Citrix PV 驱动程序不支持 DSRM。

1. 运行以下命令添加 **DisableDCCheck** 到注册表：

   ```
   reg add HKLM\SOFTWARE\Wow6432Node\Amazon\AWSPVDriverSetup /v DisableDCCheck /t REG_SZ /d true
   ```

1.  将最新的驱动程序包[下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSPV/Latest/AWSPVDriver.zip)到实例并解压缩 zip 存档。

1. 运行 `AWSPVDriverSetup.msi`。

   在运行 MSI 后，实例将自动重启，然后升级驱动程序。实例将有长达 15 分钟的时间不可用。

1. 在升级完成并且实例在 Amazon EC2 控制台中通过了两项健康检查后，使用远程桌面连接到实例。打开磁盘管理以审核所有脱机辅助卷，并按照之前记录的对应盘符和文件夹映射将其联机。

   您必须按以下格式指定用户名来连接到实例：*hostname*\\administrato。例如，Win2k12TestBox\\administrator。

1. 运行以下命令删除 DSRM 启动配置：

   ```
   bcdedit /deletevalue safeboot
   ```

1. 重启实例。

1. 要完成升级过程，请验证是否安装了新驱动程序。在设备管理器中的**存储控制器**下，找到 **AWS PV 存储主适配器**。确认驱动程序版本与驱动程序版本历史记录表中列出的最新版本相同。有关更多信息，请参阅[AWS PV 驱动程序包历史记录](xen-drivers-overview.md#pv-driver-history)。

1. 运行以下命令，从注册表中删除 **DisableDCCheck**：

   ```
   reg delete HKLM\SOFTWARE\Wow6432Node\Amazon\AWSPVDriverSetup /v DisableDCCheck
   ```

**注意**  
如果您之前使用 Netsh 为 Citrix PV 驱动程序禁用了 [TCP 分载](pvdrivers-troubleshooting.md#citrix-tcp-offloading)，建议您在升级到 AWS PV 驱动程序后重新启用此功能。Citrix 驱动程序的 TCP 分载问题在 AWS PV 驱动程序中不会出现。因此，通过使用 AWS PV 驱动程序，TCP 分载可提供更高的性能。

## 升级 Windows Server 2008 和 2008 R2 实例（Red Hat 到 Citrix PV 的升级）
<a name="win2008-citrix-upgrade"></a>

开始将 Red Hat 驱动程序升级为 Citrix PV 驱动程序之前，请务必执行以下操作：
+ 安装最新版本的 EC2Config 服务。有关更多信息，请参阅[安装最新版的 EC2Config](UsingConfig_Install.md)。
+ 验证您是否安装了 Windows PowerShell 3.0。要验证已安装的版本，请在 PowerShell 窗口中运行以下命令：

  ```
  PS C:\> $PSVersionTable.PSVersion
  ```

  Windows PowerShell 3.0 捆绑在 Windows 管理框架 (WMF) 3.0 版安装包中。如果您需要安装 Windows PowerShell 3.0，请参阅 Microsoft 下载中心中的 [Windows Management Framework 3.0](https://www.microsoft.com/en-us/download/details.aspx?id=34595)。
+ 备份实例上的重要信息或者从实例创建一个 AMI。有关创建 AMI 的更多信息，请参阅[创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。
**提示**  
您可以使用 `AWS-CreateImage` 运行手册，通过 Systems Manager Automation 创建 AMI，而不是从 Amazon EC2 控制台创建 AMI。有关更多信息，请参阅 *AWS Systems Manager Automation 运行手册参考用户指南*中的 [AWS-CreateImage](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-aws-createimage.html)。

  如果您要创建 AMI，请务必执行以下操作：
  + 写下您的密码。
  + 请勿手动运行 Sysprep 工具或使用 EC2Config 服务。
  + 将您的以太网适配器设置为使用 DHCP 自动获取 IP 地址。

**升级 Red Hat 驱动程序**

1. 连接到您的实例并以本地管理员身份登录。有关连接到实例的更多信息，请参阅[使用 RDP 连接到 Windows 实例](connecting_to_windows_instance.md)。

1. 在您的实例中，[下载](https://s3.amazonaws.com/ec2-downloads-windows/Drivers/Citrix-Win_PV.zip) Citrix 半虚拟化升级程序包。

1. 将升级包的内容提取到您所选的位置。

1. 打开 **Upgrade.bat** 文件。如果您收到安全警告，请选择 **Run**。

1. 在 **Upgrade Drivers** 对话框中，查看此信息并选择 **Yes** (如果您已开始升级)。

1. 在 **Red Hat Paravirtualized Xen Drivers for Windows uninstaller** 对话框中，选择**是**，删除 Red Hat 软件。您的实例会重新启动。
**注意**  
如果您没有看到卸载程序对话框，请选择 Windows 任务栏中的 **Red Hat Paravirtualize**。  
![任务栏中的 Red Hat Paravirtualized。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/win2003-citrix-taskbar.png)

1. 检查实例是否已重新启动并且可以使用。

   1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

   1. 在**实例**页面上，依次选择**操作**、**监控和排查**，然后选择**获取系统日志**。

   1. 升级操作应该已重新启动服务器 3 到 4 次。您可以在日志文件中看到此信息 (依据 `Windows is Ready to use` 的显示次数)。  
![Windows 系统日志。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/win2008-sys-log.png)

1. 连接到您的实例并以本地管理员身份登录。

1. 关闭 **Red Hat Paravirtualized Xen Drivers for Windows uninstaller** 对话框。

1. 确认安装已完成。导航至您之前提取的 `Citrix-WIN_PV` 文件夹，打开 `PVUpgrade.log` 文件，然后检查是否有文本 `INSTALLATION IS COMPLETE`。  
![PVUpgrade 日志文件。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/win2008-pvupgrade-log.png)

## 升级 Citrix Xen 代理客户服务
<a name="citrix-pv-guest-agent-upgrade"></a>

如果您要在 Windows Server 上使用 Citrix PV 驱动程序，则可以升级 Citrix Xen 来宾代理服务。此 Windows 服务会处理相关任务，例如通过 API 进行的关闭和重启事件。您可以在任意版本的 Windows Server 上运行此升级包，前提是该实例正在运行 Citrix PV 驱动程序。

**重要**  
对于 Windows Server 2008 R2 及更高版本，我们建议您升级到包含 Guest Agent 更新的 AWS PV 驱动程序。

升级您的驱动程序之前，请确保您已经备份实例上的重要信息，或者从实例创建了一个 AMI。有关创建 AMI 的更多信息，请参阅[创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。

**提示**  
您可以使用 `AWS-CreateImage` 运行手册，通过 Systems Manager Automation 创建 AMI，而不是从 Amazon EC2 控制台创建 AMI。有关更多信息，请参阅 *AWS Systems Manager Automation 运行手册参考用户指南*中的 [AWS-CreateImage](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-aws-createimage.html)。

如果您要创建 AMI，请务必执行以下操作：
+ 不在 EC2Config 服务中启用 Sysprep 工具。
+ 写下您的密码。
+ 将您的以太网适配器设为 DHCP。

**升级 Citrix Xen 代理客户服务**

1. 连接到您的实例并以本地管理员身份登录。有关连接到实例的更多信息，请参阅[使用 RDP 连接到 Windows 实例](connecting_to_windows_instance.md)。

1. 在您的实例中，[下载](https://s3.amazonaws.com/ec2-downloads-windows/Drivers/Citrix-Win_PV.zip) Citrix 升级程序包。

1. 将升级包的内容提取到您所选的位置。

1. 打开 **Upgrade.bat** 文件。如果您收到安全警告，请选择 **Run**。

1. 在 **Upgrade Drivers** 对话框中，查看此信息并选择 **Yes** (如果您已开始升级)。

1. 升级完成后，`PVUpgrade.log` 文件会打开并包含文本 `UPGRADE IS COMPLETE`。

1. 重新启动您的实例。
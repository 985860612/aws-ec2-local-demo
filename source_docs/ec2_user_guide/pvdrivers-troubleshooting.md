

# 排查 Windows 实例上的 PV 驱动程序问题
<a name="pvdrivers-troubleshooting"></a>

以下是您可能遇到的有关较旧的 Amazon EC2 映像和 PV 驱动程序的问题的解决方案。

**Topics**
+ [Windows Server 2012 R2 在实例重启后丢失网络和存储连接](#server2012R2-instance-unavailable)
+ [TCP 分载](#citrix-tcp-offloading)
+ [时间同步](#citrix-time-sync)
+ [利用 20,000 多个磁盘 IOPS 由于 CPU 瓶颈而发生降级的工作负载](#pvdriver-troubleshooting-cpu-bottlenecks)

## Windows Server 2012 R2 在实例重启后丢失网络和存储连接
<a name="server2012R2-instance-unavailable"></a>

**重要**  
仅 2014 年 9 月之前提供的 AMI 会出现此问题。

在 2014 年 9 月 10 日之前提供的 Windows Server 2012 R2 亚马逊机器映像（AMI）可能在实例重启后丢失网络和存储连接。AWS 管理控制台系统日志中的错误指明：“Difficulty detecting PV driver details for Console Output”。连接丢失是由即插即用清理功能导致。此功能每 30 天扫描一次不活动的系统设备并禁用它们。此功能错误地将 EC2 网络设备识别为不活动状态并将其从系统中删除。出现这种情况时，实例在重启后会丢失网络连接。

对于您怀疑可能受此问题影响的系统，您可以下载并运行就地驱动程序升级。如果您无法执行就地驱动程序升级，则可以运行帮助程序脚本。该脚本将确定您的实例是否受影响。如果实例受影响，并且 Amazon EC2 网络设备尚未移除，该脚本将禁用即插即用清理扫描。如果网络设备已移除，该脚本将修复设备，禁用即插即用清理扫描，并可让您的实例重新启动并启用网络连接。

**Topics**
+ [选择如何解决问题](#choose-fix)
+ [方法 1 - 增强联网](#plug-n-play-fix-method1)
+ [方法 2 - 注册表配置](#plug-n-play-fix-method2)
+ [运行修正脚本](#plug-n-play-script)

### 选择如何解决问题
<a name="choose-fix"></a>

有两种方法可以恢复与受此问题影响的实例的网络和存储连接。选择以下方法之一：


| 方法 | 先决条件 | 过程概述 | 
| --- | --- | --- | 
| 方法 1 - 增强联网 | 增强联网仅在需要 C3 实例类型的 Virtual Private Cloud (VPC) 中可用。如果服务器当前不使用 C3 实例类型，则必须临时更改它。 | 您应将服务器实例类型更改为 C3 实例。增强联网随后可让您连接到受影响的实例并修复问题。修复问题后，您将实例更改回原始的实例类型。此方法通常比方法 2 更快，导致用户错误的可能性也小。只要 C3 实例运行，您就会产生额外费用。 | 
| 方法 2 - 注册表配置 | 能够创建或访问辅助服务器。能够更改注册表设置。 | 您将根卷从受影响的实例分离，将其附加到其他实例，连接该实例，然后在注册表中进行更改。只要额外的服务器运行，您就会产生额外费用。此方法比方法 1 慢一些，但此方法在方法 1 无法解决问题的情况下有效。 | 

### 方法 1 - 增强联网
<a name="plug-n-play-fix-method1"></a>

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 找到受影响的实例。选择实例并选择 **Instance state (实例状态)**，然后选择 **Stop instance (停止实例)**。
**警告**  
停止某个实例时，实例存储卷上的数据将会丢失。要保留这些数据，请将其备份到持久性存储中。

1. 在实例停止后创建备份。选择实例，再依次选择 **Actions (操作) **、**Image and templates (映像和模板)**，然后选择 **Create image (创建映像)**。

1. 将实例类型[更改](ec2-instance-resize.md)为任何 C3 实例类型。

1. [启动实例。](Stop_Start.md)

1. 使用远程桌面连接到实例，然后将 AWS PV 驱动程序升级包[下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSPV/Latest/AWSPVDriver.zip)到实例。

1. 提取文件夹的内容，然后运行 `AWSPVDriverSetup.msi`。

   在运行 MSI 后，实例将自动重启，然后升级驱动程序。实例将有长达 15 分钟的时间不可用。

1. 在升级已完成并且实例在 Amazon EC2 控制台中通过了两项健康检查后，请使用远程桌面连接到实例并验证新驱动程序是否已安装。在设备管理器中的**存储控制器**下，找到 **AWS PV 存储主适配器**。确认驱动程序版本与驱动程序版本历史记录表中列出的最新版本相同。有关更多信息，请参阅[AWS PV 驱动程序包历史记录](xen-drivers-overview.md#pv-driver-history)。

1. 停止实例并将实例更改回原始的实例类型。

1. 启动实例并恢复正常使用。

### 方法 2 - 注册表配置
<a name="plug-n-play-fix-method2"></a>

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 找到受影响的实例。选择实例，再选择 **Instance state (实例状态)**，然后选择 **Stop instance （停止实例)**。
**警告**  
停止某个实例时，实例存储卷上的数据将会丢失。要保留这些数据，请将其备份到持久性存储中。

1. 选择 **Launch Instance (启动实例)** 并在与受影响实例相同的可用区中创建临时的 Windows Server 2008 或 Windows Server 2012 实例。不要创建 Windows Server 2012 R2 实例。
**重要**  
如果您未在与受影响实例相同的可用区中创建该实例，则无法将受影响的实例的根卷附加到新实例。

1. 在导航窗格中，选择 **Volumes**。

1. 找到受影响的实例的根卷。分离卷并向之前创建的临时实例附加卷。使用默认设备名称 (xvdf) 附加该卷。

1. 使用远程桌面连接临时实例，然后通过磁盘管理实用工具使该卷可供使用。

1. 在临时实例上，打开**运行**对话框，键入 **regedit**，然后按 Enter。

1. 在注册表编辑器导航窗格中，选择 **HKEY\_Local\_Machine**，然后从 **File**（文件）菜单中选择 **Load Hive**（加载 Hive）。

1. 在 **Load Hive**（加载 Hive）对话框中，导航到*Affected Volume*（受影响的卷）\\Windows\\System32\\config\\System 并在 **Key Name**（项名称）对话框中键入临时名称。例如，输入 OldSys。

1. 在注册表编辑器的导航窗格中，找到以下项：

    **HKEY\_LOCAL\_MACHINE\\{{临时项名称}}\\ControlSet001\\Control\\Class\\4d36e97d-e325-11ce-bfc1-08002be10318** 

    **HKEY\_LOCAL\_MACHINE\\{{临时项名称}}\\ControlSet001\\Control\\Class\\4d36e96a-e325-11ce-bfc1-08002be10318** 

1. 对于每个项，打开 **UpperFilters**，输入 XENFILT 值，然后选择**确定**。  
![受影响的卷的注册表项。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/troubleshooting-server2012R2-regedit.png)

1. 找到以下项：

    **HKEY\_LOCAL\_MACHINE\\{{临时项名称}}\\ControlSet001\\Services\\XENBUS\\Parameters** 

1. 使用名称 ActiveDevice 和以下值创建新字符串 (REG\_SZ)：

    **PCI\\VEN\_5853&DEV\_0001&SUBSYS\_00015853&REV\_01** 

1. 找到以下项：

    **HKEY\_LOCAL\_MACHINE\\{{临时项名称}}\\ControlSet001\\Services\\XENBUS** 

1. 将 **Count** 从 0 更改为 1。

1. 找到并删除以下项：

    **HKEY\_LOCAL\_MACHINE\\{{临时项名称}}\\ControlSet001\\Services\\xenvbd\\StartOverride** 

    **HKEY\_LOCAL\_MACHINE \\{{临时项名称}}\\ControlSet001\\Services\\xenfilt\\StartOverride** 

1. 在注册表编辑器导航窗格中，选择您在首次打开注册表编辑器时创建的临时项。

1. 从 **File**（文件）菜单中，选择 **Unload Hive**（卸载 Hive）。

1. 在磁盘管理实用工具中，选择您之前附加的驱动器，打开上下文（右键单击）菜单，然后选择**脱机**。

1. 在 Amazon EC2 控制台中，将受影响的实例从临时实例分离，然后将其重新附加到您的具有设备名称 /dev/sda1 的 Windows Server 2012 R2 实例。您必须指定此设备名称才能将卷指派为根卷。

1. [启动实例。](Stop_Start.md)

1. 使用远程桌面连接到实例，然后将 AWS PV 驱动程序升级包[下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSPV/Latest/AWSPVDriver.zip)到实例。

1. 提取文件夹的内容，然后运行 `AWSPVDriverSetup.msi`。

   在运行 MSI 后，实例将自动重启，然后升级驱动程序。实例将有长达 15 分钟的时间不可用。

1. 在升级已完成并且实例在 Amazon EC2 控制台中通过了两项健康检查后，请使用远程桌面连接到实例并验证新驱动程序是否已安装。在设备管理器中的**存储控制器**下，找到 **AWS PV 存储主适配器**。确认驱动程序版本与驱动程序版本历史记录表中列出的最新版本相同。有关更多信息，请参阅[AWS PV 驱动程序包历史记录](xen-drivers-overview.md#pv-driver-history)。

1. 删除或停止您在本过程中创建的临时实例。

### 运行修正脚本
<a name="plug-n-play-script"></a>

如果您无法执行就地驱动程序升级或无法迁移到较新的实例，则可以运行修正脚本来修复即插即用清理任务导致的问题。

**运行修正脚本**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择要为其运行修正脚本的实例。选择 **Instance state (实例状态)**，然后选择 **Stop instance （停止实例)**。
**警告**  
停止某个实例时，实例存储卷上的数据将会丢失。要保留这些数据，请将其备份到持久性存储中。

1. 在实例停止后创建备份。选择实例，再依次选择 **Actions (操作) **、**Image and templates (映像和模板)**，然后选择 **Create image (创建映像)**。

1. 选择 **Instance state (实例状态)**，然后选择 **Start instance （开始实例)**。

1. 使用远程桌面连接到实例，然后将 RemediateDriverIssue.zip 文件夹[下载](https://s3.amazonaws.com/ec2-downloads-windows/Scripts/RemediateDriverIssue.zip)到实例。

1. 提取文件夹的内容。

1. 根据 Readme.txt 文件中的指示运行修正脚本。该文件位于您提取 RemediateDriverIssue.zip 的文件夹中。

## TCP 分载
<a name="citrix-tcp-offloading"></a>

**重要**  
此问题不适用于运行 AWS PV 或 Intel 网络驱动程序的实例。

默认情况下，会为 Windows AMI 中的 Citrix PV 驱动程序启用 TCP 分载。如果您遇到传输级错误或数据包传输错误（在 Windows 性能监视器上可见，例如在运行特定 SQL 工作负载时），可能需要禁用此功能。

**警告**  
禁用 TCP 分载可能会降低实例的网络性能。

**为 Windows Server 2012 和 2008 禁用 TCP 分载**

1. 连接到您的实例并以本地管理员身份登录。

1. 如果您使用 Windows Server 2012，请按 **Ctrl\+Esc** 访问 **Start** 屏幕，然后选择 **Control Panel**。如果您使用 Windows Server 2008，请选择 **Start** 并选择 **Control Panel**。

1. 依次选择 **Network and Internet** 和 **Network and Sharing Center**。

1. 选择 **Change adapter settings**。

1. 打开 **Citrix PV 以太网适配器 \#0** 的上下文（右键单击）菜单，然后选择**属性**。  
![本地连接属性。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/citrix-local-area-conn.png)

1. 在 **Local Area Connection Properties** 对话框中，选择 **Configure** 以打开 **Citrix PV Ethernet Adapter \#0 Properties** 对话框。

1. 在 **Advanced** 选项卡上，禁用每个属性，但 **Correct TCP/UDP Checksum Value** 除外。要禁用一个属性，请从 **Property** 中选择该属性，然后从 **Value** 中选择 **Disabled**。

1. 选择 **OK (确定)**。

1. 从命令提示符窗口运行以下命令。

   ```
   netsh int ip set global taskoffload=disabled
   netsh int tcp set global chimney=disabled
   netsh int tcp set global rss=disabled
   netsh int tcp set global netdma=disabled
   ```

1. 重启实例。

## 时间同步
<a name="citrix-time-sync"></a>

在 2013.02.13 Windows AMI 版本前，Citrix Xen 代理客户无法正确设置系统时间。这可能导致您的 DHCP 租约过期。如果您在连接到您的实例时遇到问题，可能需要更新代理。

要确定您是否有更新的 Citrix Xen 客户代理，请检查 `C:\Program Files\Citrix\XenGuestAgent.exe` 文件的日期是否为 2013 年 3 月。如果此文件的日期早于这个时间，则请更新 Citrix Xen 代理客户服务。有关更多信息，请参阅[升级 Citrix Xen 代理客户服务](Upgrading_PV_drivers.md#citrix-pv-guest-agent-upgrade)。

## 利用 20,000 多个磁盘 IOPS 由于 CPU 瓶颈而发生降级的工作负载
<a name="pvdriver-troubleshooting-cpu-bottlenecks"></a>

如果您使用的是运行 AWS PV 驱动程序的 Windows 实例（利用 20000 多个 IOPS），则可能会受到此问题的影响，并且会遇到错误代码 `0x9E: USER_MODE_HEALTH_MONITOR`。

AWS PV 驱动程序中的磁盘读取和写入 (IO) 分两个阶段进行：**IO 准备**和 **IO 完成**。默认情况下，准备阶段在单个任意核心上运行。完成阶段在核心 `0` 上运行。处理 IO 所需的计算量因其大小和其他属性而异。有些 IO 在准备阶段使用更多计算，其他 IO 则在完成阶段使用更多计算。当实例驱动超过 20,000 个 IOPS 时，准备阶段或完成阶段可能会导致瓶颈，其中运行实例的 CPU 达到 100% 容量。准备阶段或完成阶段是否成为瓶颈取决于应用程序所使用 IO 的属性。

从 AWS PV 驱动程序 8.4.0 开始，准备阶段和完成阶段的负载可以跨多个核心分配，从而消除瓶颈。每个应用程序使用不同的 IO 属性。因此，应用以下配置之一可能会提高、降低或不影响应用程序的性能。应用这些配置中的任何一个之后，监控应用程序以验证它是否符合所需的性能。

1. 

**先决条件**

   在开始此故障排除过程之前，请验证以下先决条件：
   + 您的实例使用 AWS PV 驱动程序 8.4.0 或更高版本。要升级，请参阅 [在 EC2 Windows 实例上升级半虚拟化驱动程序](Upgrading_PV_drivers.md)。
   + 您对实例拥有 RDP 访问权限。使用 RDP 连接到 Windows 实例的步骤，请参阅 [使用 RDP 客户端连接到 Windows 实例](connect-rdp.md)。
   + 您对实例拥有管理员访问权限。

1. 

**观察实例的 CPU 负载**

   您可以使用 Windows 任务管理器查看每个 CPU 的负载，以确定磁盘 IO 的潜在瓶颈。

   1. 验证应用程序是否正在运行并处理与生产工作负载类似的流量。

   1. 使用 RDP 连接到您的实例。

   1. 选择实例上的**开始**菜单。

   1. 进入**开始**菜单中的 `Task Manager` 以打开任务管理器。

   1. 如果任务管理器显示摘要视图，请选择**更多详细信息**以展开详细视图。

   1. 选择 **Performance** (性能) 选项卡。

   1. 在左侧窗格中，选择 **CPU**。

   1. 打开主窗格中图表的上下文（右键单击）菜单，然后选择**将图表更改为** > **逻辑处理器**，以显示每个单独的核心。

   1. 根据实例上的核心数量，您可能会看到显示随时间变化的 CPU 负载的行，也可能只看到一个数字。
      + 如果您看到显示随时间变化的负载的图表，请查找显示框几乎完全变成阴影的 CPU。
      + 如果您在每个核心上看到一个数字，请查找始终显示 95％ 或更高的核心。

   1. 注意核心 `0` 或者另一个核心是否正在经历重负载。

1. 

**选择要应用的配置**    
[See the AWS documentation website for more details](http://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/pvdrivers-troubleshooting.html)
**注意**  
我们建议您在没有同时分配 IO 完成的情况下不要分配 IO 准备（设置 `DpcRedirection` 而不设置 `NotifierDistributed`），因为在准备阶段并行运行时，完成阶段对准备阶段过载敏感。

**注册表项的值**
   + *NotifierDistributed*

     值 `0` 或不存在 — 完成阶段将在核心 `0` 上运行。

     值 `1` — 驱动程序选择运行完成阶段或核心 `0` 或者每个附加磁盘一个额外核心。

     值 `2` — 驱动程序在每个附加磁盘的额外核心上运行完成阶段。
   + *DpcRedirection*

     值 `0` 或不存在 — 准备阶段将在单个、任意的核心上运行。

     值 `1` — 准备阶段跨多个核心分配。

   

   

**默认配置**

   对于 8.4.0 之前的 AWS PV 驱动程序版本，或者如果在应用本节中的一个其他配置后观察到性能或稳定性降级，则应用默认配置。

   1. 使用 RDP 连接到您的实例。

   1. 以管理员身份打开新的 PowerShell 命令提示符。

   1. 运行以下命令以删除 `NotifierDistributed` 和 `DpcRedirection` 注册表项。

      ```
      Remove-ItemProperty -Path HKLM:\System\CurrentControlSet\Services\xenvbd\Parameters -Name NotifierDistributed
      ```

      ```
      Remove-ItemProperty -Path HKLM:\System\CurrentControlSet\Services\xenvbd\Parameters -Name DpcRedirection
      ```

   1. 重新启动您的实例。

   

   

**允许驱动程序选择是否分配完成**

   设置 `NotiferDistributed` 注册表项，以允许 PV 存储驱动程序选择是否分发 IO 完成操作。

   1. 使用 RDP 连接到您的实例。

   1. 以管理员身份打开新的 PowerShell 命令提示符。

   1. 运行以下命令以设置 `NotiferDistributed` 注册表项。

      ```
      Set-ItemProperty -Type DWORD -Path HKLM:\System\CurrentControlSet\Services\xenvbd\Parameters -Value 0x00000001 -Name NotifierDistributed
      ```

   1. 重新启动您的实例。

   

   

**分配准备和完成**

   设置 `NotifierDistributed` 和 `DpcRedirection` 注册表项以始终分配准备阶段和完成阶段。

   1. 使用 RDP 连接到您的实例。

   1. 以管理员身份打开新的 PowerShell 命令提示符。

   1. 运行以下命令以设置 `NotifierDistributed` 和 `DpcRedirection` 注册表项。

      ```
      Set-ItemProperty -Type DWORD -Path HKLM:\System\CurrentControlSet\Services\xenvbd\Parameters -Value 0x00000002 -Name NotifierDistributed
      ```

      ```
      Set-ItemProperty -Type DWORD -Path HKLM:\System\CurrentControlSet\Services\xenvbd\Parameters -Value 0x00000001 -Name DpcRedirection
      ```

   1. 重新启动您的实例。
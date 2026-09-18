

# Windows 实例的半虚拟化驱动程序
<a name="xen-drivers-overview"></a>

Windows AMI 包含一系列驱动程序，以允许访问虚拟化硬件。Amazon EC2 会使用这些驱动程序将实例存储和 Amazon EBS 卷映射到其设备。下表显示了不同驱动程序之间的主要区别。


|  | Red Hat 半虚拟化 | Citrix PV 驱动程序 | AWS PV | 
| --- | --- | --- | --- | 
| 实例类型 | 并非对所有实例类型都支持。如果您指定了不受支持的实例类型，实例将受损。 | 支持 Xen 实例类型。 | 支持 Xen 实例类型。 | 
| 附加的卷 | 支持最多 16 个附加的卷。 | 支持超过 16 个附加的卷。 | 支持超过 16 个附加的卷。 | 
| Network | 此驱动程序在高负载下 (例如，快速 FTP 文件传输) 重置网络连接时存在已知问题。 |  | 若采用兼容的实例类型，此驱动程序会在网络适配器上自动配置巨型帧。在实例位于集群置放群组时，这会在集群置放群组中的实例之间提供更好的网络性能。有关更多信息，请参阅 [Amazon EC2 实例的置放群组](placement-groups.md)。 | 

下表显示了应在 Amazon EC2 上每个版本的 Windows Server 上运行的 PV 驱动程序。


| Windows Server 版本 | PV 驱动程序版本 | 
| --- | --- | 
| Windows Server 2025 | 不支持 | 
| Windows Server 2022 | AWS PV 最新版本 | 
| Windows Server 2019 | AWS PV 最新版本 | 
| Windows Server 2016 | AWS PV 最新版本 | 
| Windows Server 2012 R2 | AWS PV 版本 8.4.3 | 
| Windows Server 2012  | AWS PV 版本 8.4.3 | 
| Windows Server 2008 R2 | AWS PV 版本 8.3.5 | 
| Windows Server 2008 | Citrix PV 驱动程序 5.9 | 
| Windows Server 2003 | Citrix PV 驱动程序 5.9 | 

**Topics**
+ [AWS PV 驱动程序](#xen-driver-awspv)
+ [Citrix PV 驱动程序](#xen-driver-citrix)
+ [Red Hat PV 驱动程序](#xen-driver-redhat)
+ [订阅 通知](#drivers-subscribe-notifications)
+ [在 EC2 Windows 实例上升级半虚拟化驱动程序](Upgrading_PV_drivers.md)
+ [排查 Windows 实例上的 PV 驱动程序问题](pvdrivers-troubleshooting.md)

## AWS PV 驱动程序
<a name="xen-driver-awspv"></a>

AWS PV 驱动程序存储在 `%ProgramFiles%\Amazon\Xentools` 目录中。此目录还包含公有符号和一个命令行工具 `xenstore_client.exe`，使用该工具可以访问 XenStore 中的条目。例如，以下 PowerShell 命令从虚拟机监控程序返回当前时间：

```
PS C:\> [DateTime]::FromFileTimeUTC((gwmi -n root\wmi -cl AWSXenStoreBase).XenTime).ToString("hh:mm:ss")
11:17:00
```

AWS PV 驱动程序在 Windows 注册表中列于 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services` 之下。这些驱动程序组件如下所示：xenbus、xeniface、xennet、xenvbd 和 xenvif。

AWS PV 驱动程序还有一个名为 LiteAgent 的 Windows 服务，它在用户模式下运行。它会处理相关任务，例如在 Xen 代实例上通过 AWS API 进行的关闭和重启事件。您可以通过从命令行运行 `Services.msc` 来访问和管理服务。在 Nitro 代实例上运行时，AWS PV 驱动程序将不会使用，并且 LiteAgent 服务将自动停止启动使用驱动程序版本 8.2.4。更新至最新的 AWS PV 驱动程序也将更新 LiteAgent 并提高所有实例世代上的可靠性。

### 安装最新的 AWS PV 驱动程序
<a name="aws-pv-download"></a>

Amazon Windows AMI 包含一系列驱动程序，以允许访问虚拟化硬件。Amazon EC2 会使用这些驱动程序将实例存储和 Amazon EBS 卷映射到其设备。我们建议您安装最新的驱动程序来提高您的 EC2 Windows 实例的稳定性和性能。

**安装选项**
+ 使用 AWS Systems Manager 自动更新 PV 驱动程序。有关更多信息，请参阅《AWS Systems Manager 用户指南》**中的[演练：在 EC2 Windows 实例上自动更新 PV 驱动程序](https://docs.aws.amazon.com/systems-manager/latest/userguide/state-manager-update-pv-drivers.html)。
+  [下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSPV/Latest/AWSPVDriver.zip)驱动程序包并手动运行安装程序。有关下载和安装 AWS PV 驱动程序，或者升级域控制器的信息，请参阅 [手动升级 Windows Server 实例(AWS PV 升级)](Upgrading_PV_drivers.md#aws-pv-upgrade)。

有关安装 AWS PV 驱动程序包的系统要求，请参阅[AWS PV 驱动程序包的系统要求](Upgrading_PV_drivers.md#aws-pv-requirements)。

### AWS PV 驱动程序包历史记录
<a name="pv-driver-history"></a>

下表显示了每个驱动程序版本中的 AWS PV 驱动程序更改。


| 程序包版本 | 详细信息 | 发行日期 | 
| --- | --- | --- | 
|  [8.6.1](https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSPV/8.6.1/AWSPVDriver.zip)  |  +  更新了安装程序包中的运行时依赖项。   | 2026 年 7 月 21 日 | 
| 8.6.0 |  +  有关 XenStore 交互的稳定性修复。   | 2025 年 5 月 27 日 | 
| 8.5.0 |  +  稳定性修复解决了网络设备分离期间罕见的崩溃情况。 <br />+  稳定性修复可解决 EBS 卷分离期间崩溃的少数问题。 <br />+  修复了包安装程序中的错误。 <br />+  更新了 PV 安装程序以使用 `Pnputil`。   | 2024 年 10 月 31 日 | 
|  [8.4.3](https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSPV/8.4.3/AWSPVDriver.zip)  | 为改善升级体验，修复了软件包安装程序中的错误。这是最后一个可以在 Windows Server 2012 和 2012 R2 上运行的版本。此版本可供下载，但由于 Windows Server 2012 和 2012 R2 已终止支持，因此不再受支持。 | 2023 年 1 月 24 日 | 
| 8.4.2 | 稳定性修复以解决争用情况。 | 2022 年 4 月 13 日 | 
| 8.4.1 | 改进了软件包安装程序。 | 2022 年 1 月 7 日 | 
| 8.4.0 |  +  稳定性修复可解决磁盘 IO 卡住的少数问题。 <br />+  稳定性修复可解决 EBS 卷分离期间崩溃的少数问题。 <br />+  增加了跨多个核心分配负载的功能，用于利用 20,000 多个 IOPS 以及由于瓶颈而发生降级的工作负载。要启用此功能，请参阅 [利用 20,000 多个磁盘 IOPS 由于 CPU 瓶颈而发生降级的工作负载](pvdrivers-troubleshooting.md#pvdriver-troubleshooting-cpu-bottlenecks)。   | 2021 年 3 月 2 日 | 
|  [8.3.5](https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSPV/8.3.5/AWSPVDriver.zip)  | 改进了软件包安装程序。<br />这是最后一个可以在 Windows Server 2008 R2 上运行的版本。此版本可供下载，但不再受支持。Windows Server 2008 R2 的生命周期已经终止，Microsoft 不再提供支持。 | 2022 年 1 月 7 日 | 
| 8.3.4 | 提高了网络设备连接的可靠性。 | 2020 年 8 月 4 日 | 
| 8.3.3 | +  更新面向 XenStore 的组件，以防止在错误处理路径期间进行错误检查。 <br />+  更新存储组件，以避免在提交无效 SRB 时崩溃。 要在 Windows Server 2008 R2 实例上更新此驱动程序，您必须首先验证安装了相应的修补程序，以解决以下 Microsoft 安全公告：[Microsoft Security Advisory 3033929](https://learn.microsoft.com/en-us/security-updates/SecurityAdvisories/2015/3033929)。 | 2020 年 2 月 4 日 | 
| 8.3.2 | 增强了网络组件的可靠性。 | 2019 年 7 月 30 日 | 
| 8.3.1 | 提高了存储组件的性能和可靠性。 | 2019 年 6 月 12 日 | 
| 8.2.7 | 提高效率以支持迁移到最新一代实例类型。 | 2019 年 5 月 20 日 | 
| 8.2.6 | 提高了故障转储路径的效率。 | 2019 年 1 月 15 日 | 
| 8.2.5 | 更多安全增强。<br />PowerShell 安装程序现在在程序包中提供。 | 2018 年 12 月 12 日 | 
| 8.2.4 | 可靠性改进。 | 2018 年 10 月 2 日 | 
| 8.2.3 | 缺陷修复和性能改进。<br />将 EBS 卷 ID 报告为 EBS 卷的磁盘序列号。这可实现集群方案，如 S2D。 | 2018 年 5 月 29 日 | 
| 8.2.1 | 网络和存储性能改进以及多项可靠性修复。<br />要验证是否已安装此版本，请参阅以下 Windows 注册表值：`HKLM\Software\Amazon\PVDriver\Version 8.2.1`。 | 2018 年 3 月 8 日 | 
| 7.4.3 | 增加了适用于 Windows Server 2016 的支持。<br />对所有受支持的 Windows 操作系统版本的稳定性修复。<br />\*AWS PV 驱动程序版本 7.4.3 的签名将于 2019 年 3 月 29 日过期。我们建议更新到最新的 AWS PV 驱动程序。 | 2016 年 11 月 18 日 | 
| 7.4.2 | 对 X1 实例类型支持的稳定性修复。 | 2016 年 8 月 2 日 | 
| 7.4.1 |  +  AWS PV 存储驱动程序的性能改进。 <br />+  对 AWS PV 存储驱动程序进行了稳定性修复：修复了实例在遇到错误代码 0x0000DEAD 时出现系统崩溃的问题。 <br />+  AWS PV 网络驱动程序的稳定性修复。 <br />+  增加了适用于 Windows Server 2008R2 的支持。   | 2016 年 12 月 7 日 | 
| 7.3.2 |  +  改进了日志记录和诊断。 <br />+  AWS PV 存储驱动程序的稳定性修复。在某些情况下，将磁盘重新附加到实例后，磁盘可能不显示在 Windows 中。 <br />+  增加了适用于 Windows Server 2012 的支持。   | 2015 年 6 月 24 日 | 
| 7.3.1 | TRIM 更新：与 TRIM 请求相关的修复。该修复实现了实例的稳定性并提高了管理大量 TRIM 请求时的实例性能。 |  | 
| 7.3.0 | TRIM 支持：AWS PV 驱动程序现在将 TRIM 请求发送到管理程序。假如基础存储支持 TRIM (SSD)，临时磁盘将妥善处理 TRIM 请求。请注意，自 2015 年 3 月起，基于 EBS 的存储不再支持 TRIM。 |  | 
| 7.2.5 |  +  AWS PV 存储驱动程序中的稳定性修复：在某些情况下，AWS PV 驱动程序可能解除引用无效的内存并导致系统故障。 <br />+  生成故障转储时的稳定性修复：在某些情况下，在写入故障转储时，AWS PV 驱动程序可能受阻于竞争条件。在此版本之前，该问题只能通过强制驱动程序停止并重启来解决，这样做会丢失内存转储。   |  | 
| 7.2.4 | 设备 ID 持久性：此驱动程序修复将掩盖平台 PCI 设备 ID 并强制系统始终显示同一设备 ID，即使实例发生移动也是如此。更普遍的情况是，修复将影响管理程序显示虚拟设备的方式。修复还包括对 AWS PV 驱动程序的辅助安装程序的修改，因此系统保留了映射的虚拟设备。 |  | 
| 7.2.2 |  +  在目录服务还原模式 (DSRM) 中加载 AWS PV 驱动程序：目录服务还原模式是 Windows Server 域控制器的安全模式启动选项。 <br />+  在重新附加虚拟网络适配器设备时保留设备 ID：此修复将强制系统检查 MAC 地址映射并保留设备 ID。此修复将确保重新附加适配器时适配器保留其静态设置。   |  | 
| 7.2.1 |  +  在安全模式下运行：修复了驱动程序在安全模式下无法加载的问题。以前，AWS PV 驱动程序只会在正常运行的系统中进行实例化。 <br />+  将磁盘添加到 Microsoft Windows 存储池：以前，我们汇总了第 83 页的查询。此修复禁用了第 83 页的支持。请注意，这不会影响在集群环境中使用的存储池，因为半虚拟化磁盘不是有效的集群磁盘。   |  | 
| 7.2.0 | 基础：AWS PV 基础版本。 |  | 

## Citrix PV 驱动程序
<a name="xen-driver-citrix"></a>

Citrix 半虚拟驱动程序存储在 `%ProgramFiles%\Citrix\XenTools` (32 位实例) 和 `%ProgramFiles(x86)%\Citrix\XenTools` (64 位实例) 目录中。

Citrix PV 驱动程序在 Windows 注册表中列于 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services` 之下。这些驱动程序组件如下：xenevtchn、xeniface、xennet、Xennet6、xensvc、xenvbd 和 xenvif。

Citrix 还有一个名为 XenGuestAgent 的驱动程序组件，它以 Windows 服务的形式运行。它会处理相关任务，例如通过 API 进行的关闭和重启事件。您可以通过从命令行运行 `Services.msc` 来访问和管理服务。

如果您在执行某些工作负载时遇到联网错误，可能需要禁用 Citrix PV 驱动程序的 TCP 分载功能。有关更多信息，请参阅 [TCP 分载](pvdrivers-troubleshooting.md#citrix-tcp-offloading)。

## Red Hat PV 驱动程序
<a name="xen-driver-redhat"></a>

支持对旧实例使用 Red Hat 驱动程序，但不建议对具有 12 GB 以上的 RAM 的较新实例使用该驱动程序，因为存在驱动程序限制。运行 Red Hat 驱动程序并具有 12 GB 以上的 RAM 的实例可能无法启动并变得无法访问。我们建议将 Red Hat 驱动程序升级为 Citrix PV 驱动程序，然后将 Citrix PV 驱动程序升级为 AWS PV 驱动程序。

Red Hat 驱动程序的源文件在 `%ProgramFiles%\RedHat`（32 位实例）或 `%ProgramFiles(x86)%\RedHat`（64 位实例）目录中。这两种驱动程序分别为 Red Hat 半虚拟化网络驱动程序 `rhelnet` 和 Red Hat SCSI 微端口驱动程序 `rhelscsi`。

## 订阅 通知
<a name="drivers-subscribe-notifications"></a>

Amazon SNS 可在 EC2 Windows 驱动程序的新版本发布时向您发送通知。您可以订阅这些通知。

**注意**  
必须指定创建 SNS 主题时所在的区域。

每当发布新的 EC2 Windows 驱动程序时，我们都会向订户发送通知。如果您不希望再接收这些通知，可以取消订阅。有关更多信息，请参阅 [Delete an SNS topic and subscription](https://docs.aws.amazon.com/sns/latest/dg/sns-delete-subscription-topic.html)。

------
#### [ Console ]

**订阅通知**

1. 通过以下网址打开 Amazon SNS 控制台：[https://console.aws.amazon.com/sns/v3/home](https://console.aws.amazon.com/sns/v3/home)。

1. 如果需要，可在导航栏中将区域更改为**美国东部（弗吉尼亚州北部）**。您必须选择此区域，因为您订阅的 SNS 通知是在此区域中创建的。

1. 在导航窗格中，选择 **Subscriptions**。

1. 选择 **Create subscription**。

1. 在 **Create subscription** 对话框中，执行以下操作：

   1. 对于 **TopicARN**，复制以下 Amazon 资源名称（ARN）：

      arn:aws:sns:us-east-1:801119661308:ec2-windows-drivers

   1. 对于 **Protocol**，选择 `Email`。

   1. 对于 **Endpoint**，键入可用于接收通知的电子邮件地址。

   1. 选择 **Create subscription**。

1. 您将收到一封确认电子邮件。打开电子邮件，然后按照说明操作以完成订阅。

------
#### [ AWS CLI ]

**订阅通知**  
使用以下命令。

```
aws sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:801119661308:ec2-windows-drivers \
    --region us-east-1 \
    --protocol email \
    --notification-endpoint {{YourUserName@YourDomainName.ext}}
```

------
#### [ PowerShell ]

**订阅通知**  
使用以下命令。

```
Connect-SNSNotification `
    -TopicArn 'arn:aws:sns:us-east-1:801119661308:ec2-windows-drivers' `
    -Region us-east-1 `
    -Protocol email `
    -Endpoint "{{YourUserName@YourDomainName.ext}}"
```

------


# 在 EC2 Windows 实例上执行就地升级
<a name="os-inplaceupgrade"></a>

在执行就地升级之前，您必须确定此实例正在运行的网络驱动程序。半虚拟化网络驱动程序使您能够使用远程桌面访问实例。实例使用 AWS PV、Intel Network Adapter 或增强联网驱动程序。有关更多信息，请参阅 [Windows 实例的半虚拟化驱动程序](xen-drivers-overview.md)。

## 就地升级开始前的准备工作
<a name="os-upgrade-before"></a>

开始就地升级之前，请完成以下任务并注意以下重要详细信息。
+ 阅读 Microsoft 文档了解更新要求、已知问题和限制。还应参阅有关升级的正式说明。
  + [Windows Server 2012 的升级选项](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/jj574204(v=ws.11))
  + [Windows Server 2012 R2 的升级选项](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn303416(v=ws.11))
  + [Windows Server 2016 及更高版本的升级和转换选项](https://learn.microsoft.com/en-us/windows-server/get-started/install-upgrade-migrate)
  + [Windows Server 升级](https://learn.microsoft.com/en-us/windows-server/get-started/upgrade-overview)
+ 我们建议在具有至少 2 个 vCPU 和 4GB RAM 的实例上执行操作系统升级。如果需要，您可以将实例更改为相同类型的更大尺寸（例如，将 t2.small 更改为 t2.large），执行升级，然后将其调整为原始大小。如果您需要保留实例大小，则可以使用[实例控制台屏幕截图](troubleshoot-unreachable-instance.md#instance-console-screenshot)监控进度。有关更多信息，请参阅[Amazon EC2 实例类型更改](ec2-instance-resize.md)。
+ 确认 Windows 实例上的根卷有足够的可用磁盘空间。Windows 安装过程可能不会发出磁盘空间不足的警告。有关升级特定操作系统所需的磁盘空间的信息，请参阅 Microsoft 文档。如果卷没有足够空间，可将其扩展。有关更多信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 弹性卷](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html)。
+ 确定升级方法。您必须将操作系统升级到相同架构。例如，必须将 32 位系统升级到 32 位系统。Windows Server 2008 R2 及更高版本是纯粹的 64 位系统。
+ 禁用反病毒和反间谍软件和防火墙。这些类型的软件可与升级程序发生冲突。在完成升级后，请重新启用反病毒和反间谍软件以及防火墙。
+ 更新到最新驱动程序，如[将 EC2 Windows 实例迁移到基于 Nitro 的实例类型](migrating-latest-types.md)中所述。
+ 升级帮助程序服务仅支持运行 Citrix PV 驱动程序的实例。如果实例运行的是 Red Hat 驱动程序，您必须先手动[升级这些驱动程序](Upgrading_PV_drivers.md)。

## 使用 AWS PV、Intel Network Adapter 或增强联网驱动程序就地升级实例
<a name="os-upgrade-pv"></a>

通过以下步骤，使用 AWS PV 、Intel Network Adapter 或增强联网驱动程序升级 Windows Server 实例。

**执行就地升级**

1. 出于备份或测试目的，创建计划升级的系统的 AMI。然后，您可以对副本执行升级以模拟测试环境。如果升级完成，就可以在停机时间很短的情况下将流量切换到此实例。如果升级失败，则可以转至备份。有关更多信息，请参阅 [创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。

1. 确保您的 Windows Server 实例使用最新网络驱动程序。

   1. 要更新您的 AWS PV 驱动程序，请参阅 [在 EC2 Windows 实例上升级半虚拟化驱动程序](Upgrading_PV_drivers.md)。

   1. 要更新您的 ENA 驱动程序，请参阅 [在 EC2 Windows 实例上安装 ENA 驱动程序](ena-adapter-driver-install-upgrade-win.md)。

   1. 要更新您的 Intel 驱动程序，请参阅 [通过 Intel 82599 VF 接口实现增强联网](sriov-networking.md)

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。找到该实例。记下该实例的实例 ID 和可用区。您在此过程的稍后部分需要此信息。

1. 如果您要从 Windows Server 2012 或 2012 R2 升级到 Windows Server 2016 或更高版本，请在继续操作之前在您的实例上执行以下操作。

   1. 卸载 EC2Config 服务。有关更多信息，请参阅 [EC2Launch v2 和 EC2Config 代理的 Windows 服务管理](launch-agents-service-admin.md)。

   1. 安装 EC2Launch v1 或 EC2Launch v2 代理。有关更多信息，请参阅 [使用 EC2Launch v1 代理在 EC2 Windows 实例启动期间执行任务](ec2launch.md) 和 [使用 EC2Launch v2 代理在 EC2 Windows 实例启动期间执行任务](ec2launch-v2.md)。

   1. 安装 AWS Systems Manager SSM Agent 有关更多信息，请参阅《AWS Systems Manager 用户指南》中的[在适用于 Windows Server 的 Amazon EC2 实例上手动安装 SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/manually-install-ssm-agent-windows.html)**。

1. 从 Windows Server 安装介质快照创建新卷。

   1. 在左导航窗格中的 **Elastic Block Store (弹性数据块存储)** 下，选择 **Snapshots (快照)**。

   1. 从筛选条件栏中，选择**公有快照**。

   1. 在搜索栏中，指定以下筛选条件：
      + 依次选择**拥有者别名**、**=** 和 **amazon**。
      + 选择**描述**，然后开始键入 **Windows**。选择符合您要升级到的系统架构和语言首选项的 Windows 筛选条件。例如，选择 **Windows 2019 English Installation Media** 以升级到 Windows Server 2019。

   1. 选中符合要升级到的系统架构和语言首选项的快照旁的复选框，然后选择**操作**、**从快照创建卷**。

   1. 在**创建卷**页面中，选择与您的 Windows 实例匹配的可用区，然后选择**创建卷**。

1. 在页面顶部的**已成功创建卷 vol-{{1234567890example}}** 横幅中，选择刚刚创建的卷的 ID。

1. 选择 **Actions**（操作）、**Attach Volume**（附加卷）。

1. 在**挂载卷**页面上，对于**实例**，选择您的 Windows 实例的实例 ID，然后选择**挂载卷**。

1. 按照[使 Amazon EBS 卷可供使用](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html)中的步骤使新卷可供使用。
**重要**  
请勿对磁盘进行初始化，因为这样做将会删除现有的数据。

1. 在 Windows PowerShell 中，切换到新的卷驱动器。通过打开已附加到实例的安装介质卷，开始升级。

   1. 如果您升级到 Windows Server 2016 或更高版本，请执行以下操作：

      ```
      .\setup.exe /auto upgrade /dynamicupdate disable
      ```
**注意**  
运行 setup.exe 并将 `/dynamicupdate` 选项设置为禁用，将会阻止 Windows 在 Windows Server 升级过程中安装更新，因为在升级过程中安装更新可能会导致失败。升级完成后，您可以使用 Windows 更新安装更新。

      如果您升级到较早的 Windows Server 版本，请运行以下操作：

      ```
      Sources\setup.exe
      ```

   1. 对于**选择要安装的操作系统**，选择您的 Windows Server 实例的完整安装选项，然后选择**下一步**。

   1. 对于 **Which type of installation do you want? (您需要什么类型的安装?)**，选择 **Upgrade (升级)**。

   1. 完成向导。

Windows Server 安装程序将复制并处理文件。几分钟后，远程桌面会话关闭。升级所用的时间取决于在 Windows Server 实例上运行的应用程序和服务器角色的数量。升级过程少则 40 分钟，多则数小时。在升级过程中，实例可能无法通过一项或两项状态检查。升级完成后，可以通过所有状态检查。您可以检查系统日志中的控制台输出，或使用磁盘和 CPU 活动的 Amazon CloudWatch 指标以确定升级是否正在进行。

**注意**  
如果升级到 Windows Server 2019，在升级完成后，如果需要，您可以手动更改桌面背景以删除以前的操作系统名称。

如果实例在数小时后还未通过所有状态检查，请参阅[对 EC2 Windows 实例上的操作系统升级进行问题排查](os-upgrade-trbl.md)。

## 升级后的任务
<a name="os-post"></a>

1. 登录实例以启动 .NET Framework 的升级并在提示时重启系统。

1. 如果您尚未在之前的步骤中执行此操作，请安装 EC2Launch v1 或 EC2Launch v2 代理。有关更多信息，请参阅 [使用 EC2Launch v1 代理在 EC2 Windows 实例启动期间执行任务](ec2launch.md) 和 [使用 EC2Launch v2 代理在 EC2 Windows 实例启动期间执行任务](ec2launch-v2.md)。

1. 如果您已升级到 Windows Server 2012 R2，我们建议您将 PV 驱动程序升级到 AWS PV 驱动程序。如果您在基于 Nitro 的实例上进行升级，我们建议您安装或升级 NVME 和 ENA 驱动程序。有关更多信息，请参阅 [NVMe 驱动程序](aws-nvme-drivers.md) 或 [在 Windows 上启用增强联网](enabling_enhanced_networking.md#enable-enhanced-networking-ena-windows)。

1. 重新启用反病毒和反间谍软件以及防火墙。
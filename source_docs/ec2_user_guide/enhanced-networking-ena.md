

# 在 EC2 实例上使用 ENA 启用增强联网功能
<a name="enhanced-networking-ena"></a>

Amazon EC2 通过弹性网络适配器（ENA）提供增强联网功能。要启用增强联网功能，必须使用包含所需 ENA 驱动程序的 AMI，或者手动安装该驱动程序。然后，您可以在实例上启用 ENA 支持。

要查看 ENA 驱动程序的发行说明或安装说明，请参阅与实例操作系统平台匹配的选项卡。

------
#### [ Linux ]

您可以在 GitHub 上查看以下文档：
+ 在 GitHub 上查看 [ENA Linux kernel driver release notes](https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/ena/RELEASENOTES.md)。
+ 有关包含安装说明的 ENA Linux 内核驱动程序的概述，请参阅 GitHub 上的 [弹性网络适配器（ENA）系列的 Linux 内核驱动程序](https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/ena/README.rst)。

------
#### [ Windows ]

您可以在本指南的**管理设备驱动程序**部分查看以下文档：
+ [跟踪 ENA Windows 驱动程序发行版](ena-driver-releases-windows.md).
+ [在 EC2 Windows 实例上安装 ENA 驱动程序](ena-adapter-driver-install-upgrade-win.md).

------

对于基于 Nitro 的实例，增强联网功能因实例类型实现的 Nitro 版本而异。

要查看实例的网络规范，请选择适合实例类型的实例系列链接。如果不确定适用哪个实例系列，请参阅《Amazon EC2 Instance Types Guide》中的 [Naming conventions](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html)。**
+ [加速型计算实例的网络规格](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html#ac_network)
+ [计算优化型实例的网络规格](https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html#co_network)
+ [通用实例的网络规格](https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html#gp_network)
+ [高性能计算型实例的网络规格](https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html#hpc_network)
+ [内存优化型实例的网络规格](https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html#mo_network)
+ [存储优化型实例的网络规格](https://docs.aws.amazon.com/ec2/latest/instancetypes/so.html#so_network)

**Topics**
+ [使用 ENA 启用增强联网功能的先决条件](#ena-requirements)
+ [测试是否启用了增强联网功能](test-enhanced-networking-ena.md)
+ [在实例上启用增强联网](enabling_enhanced_networking.md)
+ [ENA 实例集数](ena-queues.md)
+ [排查 Linux 上 ENA 内核驱动程序的问题](troubleshooting-ena.md)
+ [对弹性网络适配器 Windows 驱动程序进行问题排查](troubleshoot-ena-driver.md)

## 使用 ENA 启用增强联网功能的先决条件
<a name="ena-requirements"></a>

要使用 ENA 准备增强联网，请按如下方式设置您的实例：
+ 启动[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。
+ 确保实例具有 Internet 连接。
+ 如果您的实例上有重要的数据需要保留，则应立即从您的实例创建 AMI，来备份这些数据。更新 ENA 内核驱动程序以及启用 `enaSupport` 属性可能会导致实例不兼容或操作系统无法访问。如果您有最新备份，则发生此情况时仍将保留数据。
+ **Linux 实例**：使用支持的 Linux 内核版本及支持的发行版启动实例，以便为实例自动启用 ENA 增强联网。有关更多信息，请参阅 [ENA Linux 内核驱动程序发行说明](https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/ena/RELEASENOTES.md)。
+ **Windows 实例**：如果实例运行的是 Windows Server 2008 R2 SP1，请确保该实例具有 [SHA-2 代码签名支持更新](https://support.microsoft.com/en-us/help/4474419/sha-2-code-signing-support-update)。
+ 从AWS 管理控制台使用 [AWS CloudShell](https://console.aws.amazon.com/cloudshell)，或在您选择的任意电脑（最好是本地台式机或笔记本电脑）上安装并配置 [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) 或 [AWS Tools for Windows PowerShell](https://docs.aws.amazon.com/powershell/latest/userguide/)。有关的更多信息，请参阅 [访问 Amazon EC2](concepts.md#access-ec2) 或 [AWS CloudShell 用户指南](https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html)。不能从 Amazon EC2 控制台管理增强联网。
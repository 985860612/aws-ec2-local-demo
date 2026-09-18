

# Amazon EC2 中的 AMI 类型和特征
<a name="ComponentsAMIs"></a>

启动实例时，您选择的 AMI 必须与您选择的实例类型兼容。可以基于以下特性选择要使用的 AMI：
+ [区域](using-regions-availability-zones.md)
+ 操作系统
+ 处理器架构
+ [启动许可](#launch-permissions)
+ [根卷类型](#storage-for-the-root-device)
+ [虚拟化类型](#virtualization_types)

## 启动许可
<a name="launch-permissions"></a>

启动许可决定谁可以使用 AMI 启动实例。您可以将启动许可视为[共享 AMI](sharing-amis.md)，即当您授予启动许可时，您就是在与其他用户共享 AMI。只有 AMI 的拥有者可以通过指定启动许可来确定其可用性。启动许可分为以下类别。


| 启动权限 | 描述 | 
| --- | --- | 
| 公有 | 拥有者向所有 AWS 账户授予启动许可。 | 
| 显式 | 拥有者向特定 AWS 账户、企业或企业部门（OU）授予启动许可。 | 
| 隐式 | 拥有者拥有 AMI 的隐式启动许可。 | 

Amazon 和 Amazon EC2 社区提供了大量的公用 AMI。有关更多信息，请参阅[了解 Amazon EC2 中共享 AMI 的使用情况](sharing-amis.md)。开发人员可以为其 AMI 收费。有关更多信息，请参阅 [AWS Marketplace 中适用于 Amazon EC2 实例的付费 AMI](paid-amis.md)。

## 根卷类型
<a name="storage-for-the-root-device"></a>

所有 AMI 均可归类为*由 Amazon EBS 支持*或*由 Amazon S3 支持*。
+ Amazon EBS-backed AMI – 从 AMI 启动的实例的根卷是从 Amazon EBS 快照创建的 Amazon Elastic Block Store（Amazon EBS）卷。同时支持 Linux 和 Windows AMI。
+ Amazon S3 支持的 AMI – 从 AMI 启动的实例的根卷是根据一个存储在 Amazon S3 中的模板创建而来的实例存储卷。仅支持 Linux AMI。Windows AMI 不支持根卷的实例存储。

有关更多信息，请参阅 [Amazon EC2 实例的根卷](RootDeviceStorage.md)。

**注意**  
Amazon S3 支持的 AMI 已达生命周期终止，不建议新使用此类 AMI。仅下列早期实例类型支持此类 AMI：C1、C3、D2、I2、M1、M2、M3、R3 和 X1。

下表总结了使用两种类型的 AMI 时的重要区别。


| 特征 | Amazon EBS-backed AMI | Amazon S3 支持的 AMI | 
| --- | --- | --- | 
| 根卷 | EBS 卷 | 实例存储卷 | 
| 实例的启动时间 | 通常不到 1 分钟 | 通常不到 5 分钟 | 
| 数据持久性 | 默认情况下，实例终止时将删除根卷。\* 默认情况下，在实例终止后，任何其他 EBS 卷上的数据仍然存在。 | 任意实例存储卷上的数据仅在实例的生命周期内保留。 | 
| 停止状态 | 可以处于停止状态。即使实例已停止并且未运行，根卷也会持久保留在 Amazon EBS 中。 | 不可置于已停止状态；实例正在运行或已终止。 | 
| 修改 | 实例停止后，实例类型、内核、RAM 磁盘和用户数据仍可更改。 | 实例存在期间，实例属性是稳定不变的。 | 
| 收费 | 您需要为实例使用、EBS 卷使用以及将 AMI 存储为 EBS 快照付费。 | 您需要为实例使用以及在 Amazon S3 中存储 AMI 付费。 | 
| AMI 创建/捆绑 | 使用单一命令/调用 | 需要安装和使用 AMI 工具 | 

\* 默认情况下，EBS 根卷的 `DeleteOnTermination` 标志设置为 `true`。有关如何更改此标志以便卷在终止之后保留的信息，请参阅[Amazon EC2 实例终止后会保留 Amazon EBS 根卷](configure-root-volume-delete-on-termination.md)。

\*\* 仅支持 `io2` EBS Block Express。有关更多信息，请参阅《Amazon EBS 用户指南》**中的[预调配 IOPS SSD Block Express 卷](https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html#io2-block-express)。

## 虚拟化类型
<a name="virtualization_types"></a>

亚马逊机器映像使用两种虚拟化类型之一：半虚拟化 (PV) 或硬件虚拟机 (HVM)。半虚拟化和 HVM AMI 之间的主要区别在于它们的启动方式，以及它们能否使用特定硬件扩展（CPU、网络和存储）实现更好的性能。Windows AMI 是硬件虚拟机 AMI。

下表比较 HVM 和 PV AMI。


| 特征 | 全虚拟化 | PV | 
| --- | --- | --- | 
| 描述 | 硬件虚拟机 AMI 配有一组完全虚拟化的硬件，通过执行映像根块储存设备的主启动记录来启动。通过此虚拟化类型可以直接在虚拟机上运行操作系统而不进行任何修改 (如同它在裸机硬件上运行一样)。Amazon EC2 主机系统可模拟向客户机提供的部分或所有底层硬件。 | 半虚拟化 AMIs 使用名为 PV-GRUB 的特殊启动加载程序启动，该加载程序开始启动周期，然后对映像链式加载 menu.lst 文件中指定的内核。半虚拟来宾可以在没有明确支持虚拟化的主机硬件上运行。有关 PV-GRUB 及其在 Amazon EC2 中的使用情况的更多信息，请参阅 [User provided kernels](https://docs.aws.amazon.com/linux/al2/ug/UserProvidedKernels.html)。 | 
| 支持的实例类型 | 当前一代的所有实例类型都支持 HVM AMI。 | 以下上一代实例类型支持 PV AMI：C1、C3、M1、M3、M2 和 T1。最新一代实例类型不支持 PV AMI。 | 
| 支持硬件扩展 | 硬件虚拟机客户机可以利用硬件扩展快速访问主机系统上的底层硬件。它们需要使用增强联网和 GPU 处理。要将指令传递给专用网络和 GPU 设备，操作系统必须能访问本机硬件平台；HVM 虚拟化可提供这种访问。有关更多信息，请参阅 [Amazon EC2 实例上的增强联网功能](enhanced-networking.md)。 | 否，它们无法利用特殊的硬件扩展，例如增强网络或 GPU 处理。 | 
| [如何查找](finding-an-ami.md) | 使用控制台或 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令验证 AMI 的虚拟化类型是否已设置为 hvm。 | 使用控制台或 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令验证 AMI 的虚拟化类型是否已设置为 paravirtual。 | 

**硬件虚拟机上的半虚拟化**  
以往，半虚拟化客户机在存储和网络操作方面的性能要优于硬件虚拟机客户机，因为它们可以对 I/O 使用特殊驱动程序，从而避免模拟网络和磁盘硬件的开销，而硬件虚拟机客户机必须将这些指令转换为模拟的硬件。现在，半虚拟化驱动程序可用于硬件虚拟机客户机，因此无法移植到半虚拟化环境中运行的操作系统仍可以通过它们获得存储和网络 I/O 方面的性能优势。借助这些硬件虚拟机驱动程序上的半虚拟化，硬件虚拟机客户机可以获得与半虚拟化客户机相同甚至更佳的性能。
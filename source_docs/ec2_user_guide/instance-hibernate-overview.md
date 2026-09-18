

# Amazon EC2 实例休眠的工作原理
<a name="instance-hibernate-overview"></a>

下图显示了 EC2 实例休眠过程的基本概述。

![休眠流概述。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/hibernation-flow.png)


## 将实例休眠时发生的情况
<a name="how-instance-hibernation-works"></a>

当您使实例休眠时，将出现以下情况：
+ 该实例移至 `stopping` 状态。Amazon EC2 会向操作系统发出信号来执行休眠 (suspend-to-disk)。休眠会冻结所有进程、将 RAM 中的内容保存到 EBS 根卷，然后执行常规关闭。
+ 关闭完成后，实例将进入 `stopped` 状态。
+ 所有 EBS 卷保持附加到实例，而且其数据将保留下来，包括已保存的 RAM 内容。
+ 所有 Amazon EC2 实例存储卷都会继续保持连接到实例，但实例存储卷上的数据将会丢失。
+ 大多数情况下，实例会在启动时迁移到新的底层主机。当您停止并启动实例时，也会发生此类情况。
+ 当实例启动时，实例将启动，操作系统从 EBS 根卷读取 RAM 内容，然后解冻进程以恢复其状态。
+ 实例会保留其私有 IPv4 地址和任何 IPv6 地址。当实例启动时，实例将继续保留其私有 IPv4 地址和所有 IPv6 地址。
+ Amazon EC2 释放公有 IPv4 地址。当实例启动时，Amazon EC2 会为实例分配一个新的公有 IPv4 地址。
+ 实例会保留其关联的弹性 IP 地址。您需要为与已休眠实例关联的所有弹性 IP 地址付费。

有关休眠与重启、停止和终止之间的区别，请参阅[实例状态之间的区别](ec2-instance-lifecycle.md#lifecycle-differences)。

## 限制
<a name="instance-hibernate-limitations"></a>
+ 当您休眠某个实例时，任何实例存储卷上的数据都会丢失。
+ （Linux 实例）您不能将具有超过 150 GiB RAM 的 Linux 实例休眠。
+ （Windows 实例）您不能将具有超过 16 GiB RAM 的 Windows 实例休眠。
+ 当实例处于休眠状态时，将无法对其进行修改。这与已停止的实例不同，已停止的实例并未休眠，并且您可以修改某些属性，例如实例类型或大小。
+ 如果您从已休眠或已启用休眠的实例创建快照或 AMI，则可能无法连接到从该 AMI 启动的新实例，或者通过从快照创建的 AMI 启动的新实例。
+ （仅限竞价型实例）如果 Amazon EC2 对您的竞价型实例进行休眠，则只有 Amazon EC2 可以恢复您的实例。如果您对竞价型实例进行休眠（[用户启动的休眠](hibernating-instances.md)），则您可以恢复您的实例。仅当容量可用且竞价价格低于或等于您指定的最高价格时，才能恢复休眠的竞价型实例。
+ 您不能使位于自动扩缩组中或者由 Amazon ECS 使用的实例休眠。如果实例位于自动扩缩组中并且您尝试使该实例休眠，则 Amazon EC2 Auto Scaling 服务会将已停止的实例标记为运行状况不佳，可能会终止它并启动替换实例。有关更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南》**中的[自动扩缩组中实例的运行状况检查](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html)。
+ 您不能对配置为在启用 [UEFI 安全引导](uefi-secure-boot.md)的情况下以 UEFI 模式启动的实例进行休眠。
+ 如果您休眠启动到 容量预留 的实例，容量预留 不能确保休眠的实例在尝试启动后可以恢复。
+ 如已启用美国联邦信息处理标准（FIPS）模式，则无法将内核低于 5.10 的实例休眠。
+ 我们支持的实例持续休眠时间不超过 60 天。要保留实例超过 60 天，您必须启动已休眠的实例，停止该实例，然后启动它。
+ 我们不断通过升级和安全补丁更新平台，这可能会与现有已休眠的实例冲突。我们会通知您有关需要启动已休眠实例的关键更新，这样我们才会执行关闭或重启操作以应用必需的升级和安全补丁。

## 对竞价型实例进行休眠的注意事项
<a name="spot-hibernation-considerations"></a>
+ 如果*您*对竞价型实例进行休眠，则只要容量可用且竞价价格低于或等于您指定的最高价格，就可以重新进行启动。
+ 如果 *Amazon EC2* 对您的竞价型实例进行休眠：
  + 只有 Amazon EC2 可以恢复您的实例。
  + 当容量可用且竞价价格低于或等于您指定的最高价格时，Amazon EC2 将恢复休眠的竞价型实例。
  + 在 Amazon EC2 对您的竞价型实例进行休眠之前，您将在休眠开始前两分钟收到中断通知。

  有关更多信息，请参阅 [竞价型实例中断](spot-interruptions.md)。
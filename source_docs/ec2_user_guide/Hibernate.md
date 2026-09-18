

# 将您的 Amazon EC2 实例休眠
<a name="Hibernate"></a>

当您使实例休眠时，Amazon EC2 会向操作系统发出信号来执行休眠 (suspend-to-disk)。休眠会将实例内存 (RAM) 中的内容保存到您的 Amazon Elastic Block Store (Amazon EBS) 根卷。Amazon EC2 保存实例的 EBS 根卷以及任何附加的 EBS 数据卷。当您的实例启动时：
+ EBS 根卷会恢复为之前的状态
+ 会重新加载 RAM 内容
+ 并恢复实例上之前运行的进程
+ 之前附加的数据卷会重新附加，实例也会保留其实例 ID

只有当实例[已启用休眠](enabling-hibernation.md)并且满足[休眠先决条件](hibernating-prerequisites.md)，您才可以使该实例休眠。

如果实例或应用程序在引导和进行内存占用以开始发挥全部生产功能时所需的时间较长，您可以使用休眠来预热实例。要预热实例，您需要执行以下操作：

1. 启动实例时启用休眠。

1. 将其设置为所需的状态。

1. 使实例休眠，并在需要时随时恢复到所需状态。

您无需为处于 `stopped` 状态的休眠实例支付实例使用费用，也无需为将 RAM 内容转移到 EBS 根卷的数据传输付费。您需要支付所有 EBS 卷的存储费用，包括 RAM 内容的存储费用。

如果您不再需要某个实例，可以随时终止它，包括当实例处于 `stopped`（已休眠）状态时。有关更多信息，请参阅 [终止 Amazon EC2 实例](terminating-instances.md)。

**Topics**
+ [工作原理](instance-hibernate-overview.md)
+ [先决条件](hibernating-prerequisites.md)
+ [配置 Linux AMI 以支持休眠](hibernation-enabled-AMI.md)
+ [启用实例休眠](enabling-hibernation.md)
+ [在实例上禁用 KASLR（仅限 Ubuntu）](hibernation-disable-kaslr.md)
+ [休眠实例](hibernating-instances.md)
+ [启动已休眠的实例](hibernating-resuming.md)
+ [故障排除](troubleshoot-instance-hibernate.md)
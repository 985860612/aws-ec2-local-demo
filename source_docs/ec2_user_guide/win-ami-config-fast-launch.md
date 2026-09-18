

# 对 Windows 实例使用 EC2 Fast Launch
<a name="win-ami-config-fast-launch"></a>

为 EC2 Fast Launch 配置 Windows Server AMI 时，Amazon EC2 会创建一组预置的快照，用于加快启动速度，如下所示。

1. Amazon EC2 会根据您的设置启动一组临时 t3 实例。

1. 当每个临时实例完成标准启动步骤时，Amazon EC2 会创建该实例的预置快照。其将快照存储在您的 Amazon S3 桶中。

1. 快照准备就绪后，Amazon EC2 会终止关联的 t3 实例，从而尽可能地降低资源成本。

1. 下次 Amazon EC2 从启用了 EC2 Fast Launch 的 AMI 启动实例时，将使用其中的一个快照来显著缩短启动时间。

Amazon EC2 会自动补充您手头的快照，因为它会使用这些快照从启用了 EC2 Fast Launch 的 AMI 启动实例。

任何有权访问启用了 EC2 Fast Launch 的 AMI 的账户都可以从缩短的启动时间中受益。当 AMI 所有者授予您启动实例的权限时，预置快照将来自 AMI 所有者的账户。

如果与您共享了支持 EC2 Fast Launch 的 AMI，则可以在共享的 AMI 上启用或禁用快速启动功能。如果为 EC2 Fast Launch 启用共享的 AMI，Amazon EC2 会直接在账户中创建预置快照。如果您耗尽账户中的快照，您仍然可以使用 AMI 所有者账户中的快照。

**注意**  
EC2 Fast Launch 会在启动使用预置快照后立即将其删除，从而最大限度地降低存储成本并防止重用。但是，如果已删除的快照符合保留规则，则回收站会自动将其保留。我们建议您查看回收站保留规则的范围，以免发生这种情况。有关更多信息，请参阅《Amazon EBS User Guide》中的 [Recycle Bin](https://docs.aws.amazon.com/ebs/latest/userguide/recycle-bin.html)。**  
此功能与 [EBS 快速快照还原](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-fast-snapshot-restore.html)不同。您必须逐个显式启用 EBS 快速快照还原，并且会产生相关的成本。

以下视频演示了如何配置 Windows AMI 以加快启动速度，并快速概述了相关关键术语及其定义：[在 AWS 上启动 EC2 Windows 实例的速度最多可提高 65%](https://www.youtube.com/watch?v=qTWlmhf9I9I)。

**资源成本**  
为 EC2 Fast Launch 配置 Windows AMI 无需支付服务费。但是，标准定价适用于 Amazon EC2 使用的任何底层 AWS 资源。要了解有关相关资源成本以及如何进行管理的更多信息，请参阅 [管理 EC2 Fast Launch 底层资源的成本](win-fast-launch-manage-costs.md)。

**Topics**
+ [关键术语](#win-fast-launch-key-terms)
+ [Windows 的 EC2 Fast Launch 先决条件](win-start-fast-launch-prereqs.md)
+ [为 Amazon EC2 Windows Server AMI 配置 EC2 Fast Launch 设置](win-fast-launch-configure.md)
+ [查看启用了 EC2 Fast Launch 的 AMI](win-view-fast-launch.md)
+ [管理 EC2 Fast Launch 底层资源的成本](win-fast-launch-manage-costs.md)
+ [监控 EC2 Fast Launch](win-fast-launch-monitor.md)
+ [用于 EC2 Fast Launch 的服务相关角色](slr-windows-fast-launch.md)
+ [排查 Windows EC2 Fast Launch 问题](win-fast-launch-troubleshoot.md)

## 关键术语
<a name="win-fast-launch-key-terms"></a>

EC2 Fast Launch 功能使用以下关键术语：

**预置的快照**  
满足以下条件的实例的快照：已从启用了 EC2 Fast Launch 的 Windows AMI 启动，完成了下列 Windows 启动步骤，并根据需要重启。  
+ Sysprep 专门化
+ Windows 全新体验（OOBE）
完成这些步骤后，EC2 Fast Launch 会停止实例并创建一张快照，这样即可根据您的配置缩短以后从 AMI 启动的时间。

**启动频率**  
控制 Amazon EC2 可在指定时间范围内启动的预置快照的数量。为 AMI 启用 EC2 Fast Launch 时，Amazon EC2 会在后台创建一组初始的预置快照。例如，如果启动频率设置为每小时启动五次（默认值），则 EC2 Fast Launch 会创建一组初始的预置快照（共五张）。  
Amazon EC2 从启用了 EC2 Fast Launch 的 AMI 启动实例时，它将使用其中的一张预置快照来缩短启动时间。使用快照时，它们会自动补充，最多不超过启动频率指定的数量。  
如果您预计从 AMI 启动的实例数量会飙升（例如，在特殊活动期间），则可以提前提高启动频率以覆盖所需的其他实例。当启动速率恢复正常时，您可以重新调低频率。  
当您遇到的启动次数超过预期时，您可能会耗尽可用的所有预置快照。这不会导致任何启动失败。但是，它可能会导致某些实例经历标准启动过程，直到可以补充快照为止。

**目标资源计数**  
为启用了 EC2 Fast Launch 的 Amazon EC2 Windows Server AMI 预留的预置快照数量。

**最大并行启动数**  
控制 Amazon EC2 可以同时启动多少个实例，以便为 EC2 Fast Launch 创建预置快照。如果您的目标资源数高于您配置的最大并行启动数，Amazon EC2 将启动**最大并行启动数**指定的实例数量以开始创建快照。当这些实例完成该过程时，Amazon EC2 会创建快照并停止实例。然后，它会继续启动更多实例，直至可用快照总数达到目标资源计数。**最大并行启动数**的值必须大于等于 6。
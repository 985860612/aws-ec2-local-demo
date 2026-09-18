

# ML 容量块
<a name="ec2-capacity-blocks"></a>

机器学习容量块允许您在未来预留基于 GPU 的加速型计算实例，以支持您的短期机器学习工作负载。在容量块内运行的实例会自动紧密放置在 [Amazon EC2 UltraClusters](https://aws.amazon.com/ec2/ultraclusters/) 中，以实现低延迟、PB 级非阻塞联网。

您还可以使用容量块为 Amazon EC2 UltraServers 预留容量。UltraServer 在低延迟、高带宽的加速器互连中连接多个 Amazon EC2 实例。您可以使用 UltraServer 来处理训练、微调和推理中最需要计算和内存的 AI/ML 工作负载。有关更多信息，请参阅 [Amazon EC2 UltraServers](https://aws.amazon.com/ec2/ultraservers/)。

使用容量块，您可以了解 GPU 实例容量在未来何时可用，并安排容量块在最适合您的时间启动。当您预留容量块时，您可以获得 GPU 实例的可预测容量保证，同时只需为所需的时间付费。如果您需要 GPU 一次支持几天或几周的 ML 工作负载，并且不想在未使用 GPU 实例时支付预留费用，我们建议您使用容量块。

以下是容量块的一些常见使用案例。
+ **ML 模型训练和微调** - 无中断地访问您为完成 ML 模型训练和微调而预留的 GPU 实例。
+ **ML 实验和原型** - 运行实验并构建需要短期 GPU 实例的原型。

某些 AWS 区域的部分实例类型可使用容量块。有关更多信息，请参阅 [支持的实例类型和区域](#capacity-blocks-prerequisites)。

您可以预留容量块，预留开始时间最长为未来 8 周。每个容量块最多可以有 64 个实例，您最多可以跨容量块拥有 256 个实例。

**Topics**
+ [支持的实例类型和区域](#capacity-blocks-prerequisites)
+ [支持的平台](#capacity-blocks-platforms)
+ [注意事项](#capacity-blocks-considerations)
+ [相关资源](#capacity-blocks-related-resources)
+ [Amazon EC2 容量块工作原理](capacity-blocks-how.md)
+ [容量块定价和计费](capacity-blocks-pricing-billing.md)
+ [查找和购买容量块](capacity-blocks-purchase.md)
+ [使用容量块启动实例](capacity-blocks-launch.md)
+ [查看容量块](capacity-blocks-view.md)
+ [延长容量块期限](capacity-blocks-extend.md)
+ [共享容量块](capacity-blocks-share.md)
+ [为 UltraServer 容量块创建容量预留资源组](cb-group.md)
+ [使用 EventBridge 监控容量块](capacity-blocks-monitor.md)
+ [使用 记录容量块 API 调用AWS CloudTrail](capacity-blocks-logging-using-cloudtrail.md)

## 支持的实例类型和区域
<a name="capacity-blocks-prerequisites"></a>

实例和 UltraServer 容量块可用于以下实例类型和 AWS 区域。

**注意**  
并非所有 AWS 区域 中的所有实例类型都支持 64 个实例的容量块大小。

### 实例容量块
<a name="capacity-blocks-instance-prerequisites"></a>


| 实例类型 | 美国东部（弗吉尼亚州北部）us-east-1 | 美国东部（俄亥俄州）us-east-2 | 美国西部（北加利福尼亚）us-west-1 | 美国西部（俄勒冈州）us-west-2 | 欧洲地区（斯德哥尔摩）eu-north-1 | 欧洲（伦敦）eu-west-2 | 欧洲（西班牙）eu-south-2 | 亚太地区（东京) (ap-northeast-1) | 亚太地区（首尔）ap-northeast-2 | 亚太地区（孟买）ap-south-1 | 亚太地区（海得拉巴）ap-south-2 | 亚太地区（悉尼） (ap-southeast-2) | 亚太地区（雅加达）ap-southeast-3 | 亚太地区（墨尔本）ap-southeast-4 | 南美洲（圣保罗）sa-east-1 | AWS GovCloud（美国东部）us-gov-east-1 | AWS GovCloud（美国西部）us-gov-west-1 | 美国东部（亚特兰大）us-east-1-atl-2a | 美国西部（凤凰城）us-west-2-phx-2a | 
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | 
| p6-b300.48xlarge | ✓ |  |  | ✓ |  |  |  |  | ✓ |  | ✓ |  | ✓ |  |  | ✓ |  | ✓ |  | 
| p6-b200.48xlarge | ✓ | ✓ |  | ✓ |  |  |  |  |  | ✓ | ✓ |  |  |  |  | ✓ | ✓ |  |  | 
| p5.4xlarge | ✓ | ✓ |  | ✓ |  | ✓ |  | ✓ |  | ✓ |  | ✓ |  |  | ✓ |  |  |  |  | 
| p5.48xlarge | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ |  | ✓ |  | ✓ | ✓ |  | ✓ |  |  | ✓ |  | 
| p5e.48xlarge | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ |  | ✓ |  | ✓ | ✓ |  | ✓ |  |  |  | ✓ | 
| p5en.48xlarge | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ | ✓ |  |  |  |  |  |  | 
| p4d.24xlarge | ✓ | ✓ |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 
| p4de.24xlarge | ✓ |  |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 
| trn1.32xlarge | ✓ | ✓ |  | ✓ | ✓ |  |  |  |  | ✓ |  | ✓ |  | ✓ |  |  |  |  |  | 
| trn2.3xlarge |  |  |  |  |  |  |  |  |  |  |  |  |  | ✓ | ✓ |  |  |  |  | 
| trn2.48xlarge |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 

### UltraServer 容量块
<a name="capacity-blocks-ultraserver-prerequisites"></a>


| 实例类型 | 美国东部（俄亥俄州）us-east-2 | 美国东部（达拉斯）us-east-1-dfw-2a | 
| --- | --- | --- | 
| Trn2 | ✓ |  | 
| P6e-GB200 |  | ✓ | 

## 支持的平台
<a name="capacity-blocks-platforms"></a>

适用于 ML 的容量块目前仅支持具有默认租赁的实例和 UltraServer。当您使用 AWS 管理控制台 购买容量块时，默认平台选项为 Linux/UNIX。当您使用 AWS Command Line Interface（AWS CLI）或 AWS SDK 购买容量块时，可以使用以下平台选项：
+ Linux/Unix
+ Red Hat Enterprise Linux
+ 含有 HA 的 RHEL
+ SUSE Linux
+ Ubuntu Pro

## 注意事项
<a name="capacity-blocks-considerations"></a>

在使用容量块之前，请考虑以下细节和限制。
+ 如果检测到 UltraServer 容量块存在缺陷，您将收到通知，但通常不会终止您在该容量块上的实例。这是为了最大限度地减少对工作负载的意外中断。收到此通知后，您可以继续按原样使用 UltraServer 容量块，也可以通过终止容量块上的所有实例并提交 AWS 支持案例来请求补救。收到您的支持案例后，补救完成时将通知您，之后您便可将实例重新启动到 UltraServer 容量块上。
+ 对于 `P6e-GB200` UltraServer 容量块，您必须在容量块结束时间前至少 60 分钟终止实例。
+  要购买和使用 Local Zones 中的容量块，您必须主动启用该本地区域。
+ 每个容量块最多可以有 64 个实例，您最多可以跨容量块拥有 256 个实例。
+ 您可以描述最快 30 分钟内即可启动的容量块产品。
+ 容量块于协调世界时 (UTC) 上午 11:30 结束。
+ 在容量块中运行的实例的终止过程从预留最后一天协调世界时（UTC）上午 11:00 开始。
+ 容量块的预留起始时间最长为未来 8 周。
+ 不允许取消容量块。
+ UltraServer 容量块不能跨 AWS 账户或在 AWS 组织内部共享。
+ 无法[移动](capacity-reservations-move.md)或[拆分](capacity-reservations-split.md)容量块。
+ 可以将 UltraServer 容量块和实例容量块添加到某个容量预留资源组中。有关更多信息，请参阅 [容量预留资源组](cr-groups.md)。
+ 容量块不支持置放群组。无论是通过预留 ID 还是通过容量预留资源组来定位容量块，在实例启动到容量块时都无法指定置放群组。
+ 在特定日期，AWS 组织中所有账户的容量块中可预留的实例总数不能超过 256 个。
+ 要使用容量块，实例必须具体定位预留 ID。
+ 容量块中的实例不计入按需型实例限制。
+ 对于使用自定义 AMI 的 P5 实例，请确保拥有 [EFA 所需的软件和配置](gpu-instances-started.md)。
+ 对于 Amazon EKS 托管式节点组，请参阅[创建带适用于 ML 的 Amazon EC2 容量块的托管式节点组](https://docs.aws.amazon.com/eks/latest/userguide/capacity-blocks-mng.html)。对于 Amazon EKS 自行管理的节点组，请参阅[将适用于机器学习的容量块与自行管理的节点配合使用](https://docs.aws.amazon.com/eks/latest/userguide/capacity-blocks.html)。

## 相关资源
<a name="capacity-blocks-related-resources"></a>

创建容量块后，您可以使用容量块执行以下操作：
+ 在容量块中启动实例。有关更多信息，请参阅 [使用容量块启动实例](capacity-blocks-launch.md)。
+ 创建 Amazon EC2 Auto Scaling 组。有关更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南》**中的[将容量块用于机器学习工作负载](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-template-capacity-blocks.html)。
**注意**  
如果使用 Amazon EC2 Auto Scaling 或 Amazon EKS，则您可以将扩展计划为在容量块预留开始时运行。计划扩展时，AWS 会自动为您处理重试，让您无需担心实现重试逻辑来处理暂时性故障。
+  使用 AWS 并行计算服务增强 ML 工作流。有关更多信息，请参阅 [Capacity Blocks support for AWS Parallel Computing Service](https://aws.amazon.com/blogs/hpc/announcing-capacity-blocks-support-for-aws-parallel-computing-service/)。
+ 使用 AWS ParallelCluster 增强 ML 工作流。有关更多信息，请参阅 [Enhancing ML workflows with AWS ParallelCluster and Amazon EC2 Capacity Blocks for ML](https://aws.amazon.com/blogs/hpc/enhancing-ml-workflows-with-aws-parallelcluster-and-amazon-ec2-capacity-blocks-for-ml/)。

 有关 AWS 并行计算服务的更多信息，请参阅 [What is AWS Parallel Computing Service](https://docs.aws.amazon.com/pcs/latest/userguide/what-is-service.html)。

 有关 AWS ParallelCluster 的更多信息，请参阅[什么是 AWS ParallelCluster](https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html)。
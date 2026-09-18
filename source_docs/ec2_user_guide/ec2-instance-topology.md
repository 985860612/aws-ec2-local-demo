

# Amazon EC2 拓扑
<a name="ec2-instance-topology"></a>

Amazon EC2 拓扑提供了计算容量的相对邻近度的分层视图。您可以使用此信息来大规模管理高性能计算（HPC）、机器学习（ML）和生成式人工智能计算基础设施。

**可用的 API**

Amazon EC2 提供了两个 API 来了解您的 EC2 拓扑：
+ [DescribeInstanceTopology](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html)
  + 显示*正在运行*的实例在网络层次结构中相对于彼此的位置。
  + 帮助优化在现有实例上运行工作负载的位置。
+ [DescribeCapacityReservationTopology](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeCapacityReservationTopology.html)
  + 显示在*启动实例之前*预留容量在网络层次结构中相对于彼此的位置。
  + 告知您在启动实例之前预留容量的置放情况，从而帮助进行容量规划。

**主要优势**

EC2 拓扑具有以下主要优势：
+ 容量管理 – 优化资源利用率。
+ 任务计划工作安排 – 做出关于工作负载置放的明智决策。
+ 节点排名 – 了解相对邻近度，以对紧密耦合的实例进行性能优化。

**注意事项**
+ 拓扑视图仅适用于：
  + 处于 `running` 状态的实例
  + 处于 `pending` 或 `active` 状态的容量预留
+ 每个 AWS 账户 的每个拓扑视图都是唯一的。
+ AWS 管理控制台 不支持查看拓扑。
+ 虽然拓扑信息可帮助您了解实例置放，但不能用其来启动物理上靠近现有实例的新实例。要影响实例放置，您可以[在集群置放群组中创建容量预留](cr-cpg.md)。

**定价**  
描述您的 EC2 拓扑不会产生额外的成本。

**Topics**
+ [工作原理](how-ec2-instance-topology-works.md)
+ [先决条件](ec2-instance-topology-prerequisites.md)
+ [示例](ec2-instance-topology-examples.md)
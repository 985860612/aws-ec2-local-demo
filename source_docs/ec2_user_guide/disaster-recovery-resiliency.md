

# Amazon EC2 中的恢复功能
<a name="disaster-recovery-resiliency"></a>

AWS 全球基础设施围绕 AWS 区域和可用区构建。区域提供多个在物理上独立且隔离的可用区，这些可用区通过延迟低、吞吐量高且冗余性高的网络连接在一起。利用可用区，您可以设计和操作在可用区之间无中断地自动实现故障转移的应用程序和数据库。与传统的单个或多个数据中心基础设施相比，可用区具有更高的可用性、容错性和可扩展性。

如果需要跨更大的地理距离复制数据或应用程序，请使用 AWSLocal Zones。AWS 本地扩展区是在地理上靠近您的用户的 AWS 区域的扩展。Local Zones 有自己的 Internet 连接并支持。Direct Connect与所有 AWS 区域类似，AWS Local Zones 与其他 AWS区域完全隔离。

如果您需要在 AWS 本地扩展区中复制数据或应用程序，AWS 建议您使用以下区域作为失效转移区域：
+ 另一个本地扩展区
+ 区域中不是父区域的可用区。您可以使用 [describe-availability-zones](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-availability-zones.html) 命令查看父区域。

有关AWS区域和可用区的更多信息，请参阅[AWS全球基础设施](https://aws.amazon.com/about-aws/global-infrastructure/)。

除了 AWS 全球基础设施以外，Amazon EC2 还提供以下功能以支持数据恢复：
+ 跨区域复制 AMI
+ 跨区域复制 EBS 快照
+ 使用 Amazon Data Lifecycle Manager 自动化 EBS 支持的 AMI
+ 使用 Amazon Data Lifecycle Manager 自动处理 EBS 快照
+ 使用 Amazon EC2 Auto Scaling 保持队列的运行状况和可用性
+ 使用 Elastic Load Balancing 在一个或多个可用区中的多个实例之间分配传入流量
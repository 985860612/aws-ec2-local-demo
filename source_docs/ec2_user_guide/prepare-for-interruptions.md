

# 为测试竞价型实例中断做好准备
<a name="prepare-for-interruptions"></a>

对竞价型实例的需求可能因时间不同而有显著的差异，竞价型实例 的可用性也会因为有多少未使用 EC2 实例可用而差别巨大。竞价型实例可能会中断。因此，必须确保应用程序针对竞价型实例中断做好准备。

我们建议您遵循以下最佳实践，以便您为竞价型实例中断做好准备。
+ 使用 Auto Scaling 组创建竞价型请求。如果您的竞价型实例被中断，Auto Scaling 组将自动启动替换实例。有关更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南》**中的[具有多个实例类型和购买选项的自动扩缩组](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html)。
+ 使用包含所需软件配置的亚马逊机器映像（AMI），确保您的实例在请求完成时随时可以启动。您还可以使用用户数据在启动时运行命令。
+ 停止或终止实例后，实例存储卷上的数据将丢失。将实例存储卷上的所有重要数据备份到持久性存储，例如 Amazon S3、Amazon EBS 或 Amazon DynamoDB。
+ 在不会受竞价型实例终止影响的位置例行存储重要数据。例如，您可以使用 Amazon S3、Amazon EBS 或 DynamoDB。
+ 将工作拆分为小的任务 (使用网格、Hadoop 或基于实例集的架构) 或者使用检查点，以便您经常保存工作。
+ 当实例处于较高的中断风险时，Amazon EC2 会向竞价型实例发出再平衡建议信号。您可以依靠再平衡建议来主动管理竞价型实例中断，而无需等待两分钟的竞价型实例中断通知。有关更多信息，请参阅[EC2 实例再平衡建议](rebalance-recommendations.md)。
+ 使用两分钟的竞价型实例中断通知监控您的竞价型实例的状态。有关更多信息，请参阅[竞价型实例中断通知](spot-instance-termination-notices.md)。
+ 虽然我们尽一切努力尽快提供这些警告，但您的竞价型实例可能会在我们提供此警告之前被中断。测试您的应用程序，确保它很好地处理了意外的实例终止，即使您正在监控再平衡建议信号和中断通知。您可以使用按需型实例来运行应用程序，然后自行终止该按需型实例，以便确认这一点。
+ 使用 AWS Fault Injection Service 运行受控的故障注入实验，以测试在竞价型实例中断时应用程序如何响应。有关更多信息，请参阅 *AWS Fault Injection Service 用户指南*中的[教程，使用 AWS FIS 测试竞价型实例中断](https://docs.aws.amazon.com/fis/latest/userguide/fis-tutorial-spot-interruptions.html)。
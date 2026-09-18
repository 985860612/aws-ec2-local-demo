

# 适用于 Amazon EC2 实例的 Amazon EBS 永久块存储
<a name="storage_ebs"></a>

Amazon Elastic Block Store（Amazon EBS）提供了可扩展、高性能的块存储资源，可以与 Amazon EC2 实例一起使用。使用 Amazon EBS，您可以创建和管理以下数据块存储资源：
+ **Amazon EBS 卷** – 挂载到 Amazon EC2 实例的存储卷。将卷附加到实例后，您可以像使用数据块存储一样使用卷。实例就像与本地驱动器交互一样与该卷交互。
+ **Amazon EBS 快照** – 独立于卷本身持续存在的 Amazon EBS 卷的时间点备份。您可以通过创建快照来备份 Amazon EBS 卷上的数据。而后可以随时从这些快照还原新卷。

您可以在启动期间创建 EBS 卷并将其附加到实例，也可以在启动后随时创建 EBS 卷并将其附加到实例。您还可以在不分离卷或重启实例的情况下增加 EBS 卷的大小或性能。

创建后，您可以随时从 EBS 卷中创建 EBS 快照。您可以使用 EBS 快照来备份卷上存储的数据。然后，您可以使用这些快照立即还原卷或跨 AWS 账户、AWS 区域或可用区迁移数据。您可以使用 Amazon Data Lifecycle Manager 或 AWS Backup 自动创建、保留和删除 EBS 快照。

*托管 EBS 卷*是指由服务提供商（例如 Amazon EKS 自动模式）管理的卷。您不能直接修改托管 EBS 卷的设置。托管 EBS 卷由**托管**字段中的 **true** 值标识。有关更多信息，请参阅 [Amazon EC2 托管式实例](amazon-ec2-managed-instances.md)。

有关使用卷和快照的更多信息，请参阅《Amazon EBS 用户指南》[https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html](https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html)。
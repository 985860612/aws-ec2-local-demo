

# Amazon EC2 的最佳实践
<a name="ec2-best-practices"></a>

为最大程度地利用 Amazon EC2 的优势，建议您执行以下最佳实践。

**安全性**
+ 尽可能将身份联合验证与身份提供商和 IAM 角色结合使用，以管理对 AWS 资源和 API 的访问权限。有关更多信息，请参阅 *IAM 用户指南*中的[身份提供者和联合身份验证](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html)。
+ 为安全组实现最严格的规则。
+ 定期修补、更新和保护实例上的操作系统和应用程序。有关更多信息，请参阅 [更新管理](update-management.md)。有关特定于 Windows 操作系统的指导原则，请参阅 [Windows 实例的安全最佳实践](ec2-windows-security-best-practices.md)。
+ 使用 Amazon Inspector 可以自动发现并扫描 Amazon EC2 实例是否存在软件漏洞和意外网络暴露。有关更多信息，请参阅 [Amazon Inspector 用户指南](https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html)。
+ 根据安全最佳实践和安全标准，使用 AWS Security Hub CSPM 控件监控 Amazon EC2 资源。有关使用 Security Hub CSPM 的更多信息，请参阅《AWS Security Hub CSPM 用户指南》**中的 [Amazon Elastic Compute Cloud 控件](https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html)。

**存储**
+ 了解根卷类型对数据持久性、备份和恢复的影响。有关更多信息，请参阅 [根卷类型](ComponentsAMIs.md#storage-for-the-root-device)。
+ 对操作系统与您的数据分别使用单独的 Amazon EBS 卷。确保含有您数据的卷可在实例终止后保留。有关更多信息，请参阅 [实例终止时保留数据](preserving-volumes-on-termination.md)。
+ 使用您的实例可用的实例存储来存储临时数据。请注意，当您停止、休眠或终止您的实例时，系统会删除存储在实例存储中的数据。如果将实例存储用于数据库存储，请确保您拥有一个具有重复因子的集群，从而确保容错。
+ 对 EBS 卷和快照进行加密。有关更多信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 加密](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html)。

**资源管理**
+ 使用实例元数据和自定义资源标签跟踪并确定您的 AWS 资源。有关更多信息，请参阅 [使用实例元数据管理 EC2 实例](ec2-instance-metadata.md) 和 [标记 Amazon EC2 资源](Using_Tags.md)。
+ 查看您的 Amazon EC2 的当前限制。需要时请提前计划请求提高限制。有关更多信息，请参阅 [Amazon EC2 Service Quotas](ec2-resource-limits.md)。
+ 使用 AWS Trusted Advisor 检查您的 AWS 环境，然后在有可能节省开支、提高系统可用性和性能或弥补安全漏洞时为您提供建议。有关更多信息，请参阅《AWS 支持 用户指南》**中的 [AWS Trusted Advisor](https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html)。

**备份和恢复**
+ 使用 [Amazon EBS 快照](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html)定期备份您的 EBS 卷，并从您的实例创建 [Amazon Machine Image (AMI)](AMIs.md)，以便保存配置以作为启动未来实例的模板。有关有助于实现此使用案例的 AWS 服务的更多信息，请参阅 [AWS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/) 和 [Amazon Data Lifecycle Manager](https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-lifecycle.html)。
+ 跨多个可用区部署应用程序的关键组件，并适当地复制数据。
+ 设计您的应用程序，以便在实例重新启动时处理动态 IP 地址分配。有关更多信息，请参阅 [Amazon EC2 实例 IP 寻址](using-instance-addressing.md)。
+ 监控和响应事件。有关更多信息，请参阅 [监控 Amazon EC2 资源](monitoring_ec2.md)。
+ 确保您已准备好处理故障转移。对于基本解决方案，您可以手动将网络接口或弹性 IP 地址附加到替换实例。有关更多信息，请参阅 [弹性网络接口](using-eni.md)。对于自动解决方案，您可以使用 Amazon EC2 Auto Scaling。有关更多信息，请参阅 [Amazon EC2 Auto Scaling 用户指南](https://docs.aws.amazon.com/autoscaling/ec2/userguide/)。
+ 定期测试恢复您的实例和 Amazon EBS 卷的过程，以确保成功还原数据和服务。

**联网**
+ 对于 IPv4 和 IPv6，将应用程序的生存时间 (TTL) 值设置为 255。如果使用更小的值，则存在 TTL 在应用程序流量传输过程中过期的风险，从而导致实例发生可访问性问题。
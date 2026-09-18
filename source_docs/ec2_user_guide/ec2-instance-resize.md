

# Amazon EC2 实例类型更改
<a name="ec2-instance-resize"></a>

随着需求发生变化，您可能会发现 Amazon EC2 实例对于其工作负载来说太大或太小。如果是这种情况，您可以通过更改实例类型来调整实例的大小。例如，如果您 `t2.micro` 实例对于其工作负载来说太小，您可以通过将其更改为更大的 T2 实例类型来增加其大小，例如 `t2.large`。或者，您可以将其更改其它实例类型，如 `m5.large`。您可能还想将实例类型从上一代更改为最新一代以利用某些功能，例如 IPv6 支持。

如果您想要针对能够最好地处理现有工作负载的实例类型获得建议，则可以使用 AWS Compute Optimizer。有关更多信息，请参阅 [从 Compute Optimizer 获取 EC2 实例建议](ec2-instance-recommendations.md)。

更改实例类型时，您将开始支付新实例类型的费率。有关所有实例类型的按需费率，请参阅 [Amazon EC2 按需定价](https://aws.amazon.com/ec2/pricing/on-demand/)。

要在不更改实例类型的情况下，向实例添加额外的存储空间，请向实例添加一个 EBS 卷。有关更多信息，请参阅《Amazon EBS 用户指南》**中的[将 Amazon EBS 卷挂载到实例](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-attaching-volume.html)。

## 要遵循哪些说明？
<a name="choose-instance-resize-instructions"></a>

对于更改实例类型，我们有不同的说明。应该使用哪些说明取决于实例的根卷，以及实例类型是否与实例的当前配置兼容。有关如何确定兼容性的信息，请参阅 [更改实例类型的兼容性](resize-limitations.md)。

使用下表确定需要遵守的说明。


| 根卷 | 兼容性 | 使用以下说明进行操作 | 
| --- | --- | --- | 
| EBS | 兼容 | [更改实例类型](change-instance-type-of-ebs-backed-instance.md) | 
| EBS | 不兼容 | [迁移到新实例类型](migrate-instance-configuration.md) | 
| 实例存储 | 不适用 | [迁移到新实例类型](migrate-instance-configuration.md) | 
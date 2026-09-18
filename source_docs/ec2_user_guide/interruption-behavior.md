

# 竞价型实例中断行为
<a name="interruption-behavior"></a>

您可以在创建 Spot 请求时指定中断行为。以下是可能的中断行为：
+ [停止](#stop-spot-instances)
+ [Hibernate](#hibernate-spot-instances)
+ [终止](#terminate-interrupted-spot-instances)

默认行为是 Amazon EC2 在竞价型实例中断时终止这些实例。

## 停止中断的竞价型实例
<a name="stop-spot-instances"></a>

您可以指定 Amazon EC2 在竞价型实例中断时将其停止。竞价型实例请求类型必须为 `persistent`。您不能在竞价型实例请求中指定启动组。对于 EC2 实例集或竞价型实例集，请求类型必须为 `maintain`。

**注意事项**
+ 只有 Amazon EC2 才能重新启动已停止的竞价型实例。
+ 对于由 `persistent` 竞价型实例请求启动的竞价型实例：Amazon EC2 会在容量在同一可用区中可用且适用于已停止的实例的同一实例类型（必须使用相同的启动规范）时重新启动已停止的实例。
+ 在停止竞价型实例后，您可以修改其部分实例属性，但不能修改实例类型。如果您分离或删除一个 EBS 卷，则在启动竞价型实例时不会附加该卷。如果您分离根卷并且 Amazon EC2 尝试启动竞价型实例，则该实例将无法启动，Amazon EC2 将终止已停止的实例。
+ 当竞价型实例停止时，您可以将其终止。
+ 如果取消竞价型实例请求、EC2 机群或竞价型实例集，Amazon EC2 将终止任何停止的关联竞价型实例。
+ 在中断的竞价型实例停止后，您只需为保留的 EBS 卷付费。对于 EC2 实例集和 Spot 实例集，如果具有很多停止的实例，则可能会超出您的账户的 EBS 卷数限制。有关竞价型实例中断时如何收费的更多信息，请参阅 [中断的竞价型实例的计费](billing-for-interrupted-spot-instances.md)。
+ 确保您熟知停止实例的影响。有关实例停止可能会发生情况的更多信息，请参阅 [实例状态之间的区别](ec2-instance-lifecycle.md#lifecycle-differences)。

## 休眠中断的竞价型实例
<a name="hibernate-spot-instances"></a>

您可以指定 Amazon EC2 在竞价型实例中断时将其休眠。有关更多信息，请参阅 [将您的 Amazon EC2 实例休眠](Hibernate.md)。

Amazon EC2 现在为竞价型实例提供了与当前按需型实例相同的休眠体验。它提供了更广泛的支持，竞价型实例休眠现在支持：
+ [更多支持的 AMI](hibernating-prerequisites.md#hibernation-prereqs-supported-amis)
+ [更多支持的实例系列](hibernating-prerequisites.md#hibernation-prereqs-supported-instance-families)
+ [用户启动的休眠](hibernating-instances.md)

## 终止中断的竞价型实例
<a name="terminate-interrupted-spot-instances"></a>

当 Amazon EC2 中断竞价型实例时，默认情况下会终止该实例，除非您指定了其他中断行为，例如停止或休眠。有关更多信息，请参阅 [终止 Amazon EC2 实例](terminating-instances.md)。


# 查看容量块
<a name="capacity-blocks-view"></a>

预留容量块后，您可以在 AWS 账户中查看容量块预留。您可以查看 `start-date` 和 `end-date`，了解您的预留何时开始和结束。在容量块预留开始之前，可用容量显示为零。您可以通过标签键 `aws:ec2capacityreservation:incrementalRequestedQuantity` 的标签值查看容量块中有多少可用实例。

当容量块预留开始时，预留状态从 `scheduled` 变为 `active`。系统通过 Amazon EventBridge 发出一个事件，通知您容量块可以使用。有关更多信息，请参阅 [使用 EventBridge 监控容量块](capacity-blocks-monitor.md)。

容量块具有以下状态：
+ `payment-pending` - 预付款尚未处理。
+ `payment-failed` - 无法在 12 小时内处理付款。您的容量块已释放。
+ `scheduled` - 付款已处理，但容量块预留尚未开始。
+ `active` - 预留容量可供使用。
+ `expired` - 容量块预留将在您的预留请求中指定的日期和时间自动到期。预留容量不再可供您使用。

------
#### [ Console ]

**查看容量块**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 在**容量预留概述**页面上，您会看到一个资源表，其中包含有关所有容量预留资源的详细信息。要查找您的容量块预留，请从**容量预留 ID** 上方的下拉列表中选择**容量块**。在表中，您可以看到有关容量块的信息，比如开始和结束日期、持续时间和状态。

1. 有关容量块的更多详细信息，请选择要查看的容量块的预留 ID。**容量预留详细信息**页面将显示预留的所有属性以及容量块中正在使用和可用的实例数。
**注意**  
在容量块预留开始之前，可用容量显示为零。您可以通过使用标签键的以下标签值查看容量块预留开始时有多少可用实例：`aws:ec2capacityreservation:incrementalRequestedQuantity`。

------
#### [ AWS CLI ]

**查看容量块**  
使用 [describe-capacity-blocks](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-blocks.html) 命令查看有关容量块预留的详细信息。

```
aws ec2 describe-capacity-blocks
```

------
#### [ PowerShell ]

**查看容量块**  
使用 [Get-EC2CapacityBlock](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2CapacityBlock.html) cmdlet 查看有关容量块预留的详细信息。

```
Get-EC2CapacityBlock
```

------
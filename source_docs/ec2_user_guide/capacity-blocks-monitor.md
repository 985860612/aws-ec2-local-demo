

# 使用 EventBridge 监控容量块
<a name="capacity-blocks-monitor"></a>

当您的容量块预留开始时，Amazon EC2 将通过 EventBridge 发出一个事件，表明您的容量已准备就绪，可以使用。在容量块预留结束前 40 分钟，您会收到另一个 EventBridge 事件，通知您预留中运行的所有实例将在 10 分钟后开始进行终止。有关 EventBridge 事件的更多信息，请参阅 [Amazon EventBridge 事件](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html)。

容量块发出的事件结构如下：

**已交付的容量块**  
以下示例显示了已交付的容量块的事件。

```
{
  "customer_event_id": "[Capacity Reservation Id]-delivered",
  "detail_type": "Capacity Block Delivered",
  "source": "aws.ec2",
  "account": "[Customer Account ID]",
  "time": "[Current time]",
  "resources": [
    "[ODCR ARN]"
  ],
  "detail": {
    "capacity-reservation-id": "[ODCR ID]",
    "end-date": "[ODCR End Date]"
  }
}
```

**容量块过期警告**  
以下示例显示了容量块过期警告事件。

```
{
  "customer_event_id": "[Capacity Reservation Id]-approaching-expiry",
  "detail_type": "Capacity Block Expiration Warning",
  "source": "aws.ec2",
  "account": "[Customer Account ID]",
  "time": "[Current time]",
  "resources": [
    "[ODCR ARN]"
  ],
  "detail": {
    "capacity-reservation-id": "[ODCR ID]",
    "end-date": "[ODCR End Date]"
  }
}
```

**容量预留实例中断警告**  
下面的示例显示了 EC2 容量预留实例中断警告事件。

```
{
    "version": "0",
    "id": "12345678-1234-1234-1234-123456789012",
    "detail_type": "EC2 Capacity Reservation Instance Interruption Warning",
    "source": "aws.ec2",
    "account": "[Customer Account ID]",
    "time": "[Current time]",
    "region": "[Region]",
    "resources": [
        "[Instance ARN]"
    ],
    "detail": {
        "instance-id": "[Instance ID]",
        "instance-action": "terminate",
        "instance-termination-time": "[Current time]",
        "availability-zone-id": "[Availability Zone ID]",
        "instance-lifecycle": "capacity-block"
    }
}
```
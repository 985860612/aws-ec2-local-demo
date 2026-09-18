

# 监控未来日期容量预留的状态变化
<a name="monitor-fcr-state"></a>

当未来日期容量预留的状态发生变化时，Amazon EC2 会向 Amazon EventBridge 发送事件。

以下是此事件的示例。在此示例中，未来日期的容量预留进入 `scheduled` 状态。请注意 `detail-type` 字段中突出显示的状态。

```
{
   "version":"0",
   "id":"12345678-1234-1234-1234-123456789012",
   "detail-type":"EC2 Capacity Reservation {{Scheduled}}",
   "source":"aws.ec2",
   "account":"123456789012",
   "time":"yyyy-mm-ddThh:mm:ssZ",
   "region":"us-east-1",
   "resources":[
      "arn:aws:ec2:us-east-1:123456789012:capacity-reservation/cr-1234567890abcdefg"
   ],
   "detail":{
      "capacity-reservation-id":"cr-1234567890abcdefg",
      "state":"scheduled"
   }
}
```

`detail-type` 字段可能的值为：
+ `Scheduled`
+ `Active`
+ `Delayed`
+ `Unsupported`
+ `Failed`
+ `Expired`

有关这些状态的更多信息，请参阅 [查看容量预留的状态](capacity-reservations-view.md)。

您可以创建 Amazon EventBridge 事件来监控这些事件，然后在事件发生时触发特定的操作。有关更多信息，请参阅 [Creating rules that react to events in Amazon EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule.html)。

要创建监控所有状态改变事件的规则，您可以使用以下事件模式。

```
{
  "source": ["aws.ec2"],
  "detail-type": [{
    "prefix": "EC2 Capacity Reservation"
  }]
}
```

要创建仅监控特定状态变化的规则，您可以使用以下事件模式。

```
{
  "source": ["aws.ec2"],
  "detail-type": [{
    "prefix": "EC2 Capacity Reservation {{state}}"
  }]
}
```

例如，以下事件模式监控未来日期的容量预留进入 `active` 状态时发送的事件。

```
{
  "source": ["aws.ec2"],
  "detail-type": [{
    "prefix": "EC2 Capacity Reservation Active"
  }]
}
```
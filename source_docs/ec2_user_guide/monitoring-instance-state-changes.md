

# Amazon EC2 实例的状态更改事件
<a name="monitoring-instance-state-changes"></a>

当实例状态发生更改时，Amazon EC2 会向 Amazon EventBridge 发送 `EC2 Instance State-change Notification` 事件。

以下是此事件的示例数据。在此示例中，实例进入了 `pending` 状态。

```
{
   "id":"7bf73129-1428-4cd3-a780-95db273d1602",
   "detail-type":"EC2 Instance State-change Notification",
   "source":"aws.ec2",
   "account":"123456789012",
   "time":"2021-11-11T21:29:54Z",
   "region":"us-east-1",
   "resources":[
      "arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0"
   ],
   "detail":{
      "instance-id":"i-1234567890abcdef0",
      "state":"pending"
   }
}
```

`state` 可使用的值为：
+ `pending`
+ `running`
+ `stopping`
+ `stopped`
+ `shutting-down`
+ `terminated`

当您启用或启动实例时，它会进入 `pending` 状态，然后进入 `running` 状态。当您停止实例时，它会进入 `stopping` 状态，然后进入 `stopped` 状态。当您终止实例时，它会进入 `shutting-down` 状态，然后进入 `terminated` 状态。有关更多信息，请参阅 [Amazon EC2 实例状态更改](ec2-instance-lifecycle.md)。
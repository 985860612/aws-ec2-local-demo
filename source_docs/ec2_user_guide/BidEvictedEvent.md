

# 确定 Amazon EC2 是否终止了竞价型实例
<a name="BidEvictedEvent"></a>

竞价型实例将一直运行，直到 Amazon EC2 因竞价型实例中断而将其终止，或者直到您自行终止该竞价型实例。有关更多信息，请参阅 [竞价型实例中断行为](interruption-behavior.md)。

竞价型实例终止后，您可以使用 AWS CloudTrail 查看 Amazon EC2 是否终止了该实例。如果 CloudTrail 日志包含 `BidEvictedEvent`，则表示 Amazon EC2 终止了竞价型实例。相反，如果您看到一个 `TerminateInstances` 事件，则表示用户终止了竞价型实例。

或者，如果您想收到 Amazon EC2 将中断您的竞价型实例的通知，请使用 Amazon EventBridge 来响应 [EC2 竞价型实例中断警告事件](spot-instance-termination-notices.md#ec2-spot-instance-interruption-warning-event)。

**在 CloudTrail 中查看 BidEvictedEvent 事件**

1. 访问 [https://console.aws.amazon.com/cloudtrail/](https://console.aws.amazon.com/cloudtrail/)，打开 CloudTrail 控制台。

1. 在导航窗格中，选择**事件历史记录**。

1. 从筛选器列表中，选择**事件名称**，然后在右侧的筛选字段中，输入 **BidEvictedEvent**。

1. （可选）选择一个时间范围。

1. 如果列表不为空，请从生成的条目中选择 **BidEvictedEvent** 以打开其详细信息页面。您可以在**事件记录**窗格中找到有关竞价型实例的信息，包括竞价型实例的 ID。以下是事件记录的示例。

   ```
   {
       "eventVersion": "1.05",
       "userIdentity": {
           "accountId": "123456789012",
           "invokedBy": "ec2.amazonaws.com"
       },
       "eventTime": "2016-08-16T22:30:00Z",
       "eventSource": "ec2.amazonaws.com",
       "userAgent": "ec2.amazonaws.com",
       "sourceIPAddress": "ec2.amazonaws.com",
       "eventName": "BidEvictedEvent",
       "awsRegion": "us-east-2",
       "eventID": "d27a6096-807b-4bd0-8c20-a33a83375054",
       "eventType": "AwsServiceEvent",
       "recipientAccountId": "123456789012",
       "RequestParameters": null,
       "ResponseElements": null,
       "serviceEventDetails": {
           "instanceIdSet": [
             "i-1eb2ac8eEXAMPLE"
           ]
       }
   }
   ```

1. 如果您没有找到 `BidEvictedEvent` 事件的条目，请输入 **TerminateInstances** 作为事件名称。有关 `TerminateInstances` 事件记录的更多信息，请参阅[Amazon EC2 API 事件示例](monitor-with-cloudtrail.md#cloudtrail-event-examples)。
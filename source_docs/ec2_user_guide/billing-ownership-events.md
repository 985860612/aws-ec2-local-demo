

# 监控共享容量预留的账单分配请求
<a name="billing-ownership-events"></a>

当账单分配请求的状态发生变化时，Amazon EC2 会发送 Amazon EventBridge 事件。
+ 当请求进入以下状态时，将向容量预留所有者发送事件：`accepted` \| `rejected` \| `expired` \| `revoked`。
+ 当请求进入以下状态时，将向请求的使用者账户发送事件：`pending` \| `expired` \| `cancelled` \| `revoked`。

有关 Amazon EventBridge 的信息，请参阅 [Amazon EventBridge 用户指南](https://docs.aws.amazon.com/eventbridge/latest/userguide/)。

以下是 Amazon EventBridge 事件的模式。

```
{
   "version":"0",
   "id":"12345678-1234-1234-1234-123456789012",
   "detail-type":"On-Demand Capacity Reservation Billing Ownership Request {{pending|accepted|rejected|cancelled|revoked|expired}}",
   "source":"aws.ec2",
   "account":"{{account_id}}",
   "time":"{{state_change_timestamp}}",
   "region":"{{region}}",
   "resources":[
      "arn:aws:ec2:{{region}}:{{cr_owner_account_id}}:capacity-reservation/{{cr_id}}"
   ],
   "detail":{
      "capacity-reservation-id":"{{cr_id}}",
      "updateTime":{{timestamp}},
      "ownerAccountId":"{{cr_owner_account_id}}",
      "unusedReservationChargesOwnerID":"{{consumer_account_id}}",
      "status":"{{pending|accepted|rejected|cancelled|revoked|expired}}",
      "statusMessage":"{{message}}
   }
}
```

以下是当使用者账户 (`111111111111`) 接受共享容量预留 (`cr-01234567890abcdef`) 的账单分配请求时，将向容量预留所有者 (`222222222222`) 发送的事件示例。

```
{
   "version":"0",
   "id":"12345678-1234-1234-1234-123456789012",
   "detail-type":"On-Demand Capacity Reservation Billing Ownership Request accepted",
   "source":"aws.ec2",
   "account":"222222222222",
   "time":"2024-09-01Thh:59:59Z",
   "region":"us-east-1",
   "resources":[
      "arn:aws:ec2:us-east-1:222222222222:capacity-reservation/cr-01234567890abcdef"
   ],
   "detail":{
      "capacity-reservation-id":"cr-01234567890abcdef",
      "updateTime":"2024-08-01Thh:59:59Z",
      "ownerAccountId":"222222222222",
      "unusedReservationChargesOwnerID":"111111111111",
      "status":"accepted",
      "statusMessage":"billing transfer status message"
   }
}
```
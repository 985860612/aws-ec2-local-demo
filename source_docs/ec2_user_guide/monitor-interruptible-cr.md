

# 使用 EventBridge 和 CloudTrail 监控可中断容量预留
<a name="monitor-interruptible-cr"></a>

可中断容量预留会发送 EventBridge 通知和 CloudTrail 事件，以帮助您监控和响应容量更改。

**Topics**
+ [EventBridge 通知](#eventbridge-notifications)
+ [CloudTrail 事件](#cloudtrail-events)

## EventBridge 通知
<a name="eventbridge-notifications"></a>

您会收到两种类型的 EventBridge 通知。有关如何设置 EventBridge 通知的信息，请参阅 [Creating Amazon EventBridge rules](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule.html)。

### 实例中断警告
<a name="instance-interruption-warning"></a>

如果您在可中断预留中运行实例，则会在实例终止前 2 分钟收到此通知：

```
{
    "version": "0",
    "id": "{{12345678-1234-1234-1234-123456789012}}",
    "detail-type": "EC2 Capacity Reservation Instance Interruption Warning",
    "source": "aws.ec2",
    "account": "[{{instance owner Account ID}}]",
    "time": "[{{Current time in yyyy-mm-ddThh:mm:ssZ}}]",
    "resources": "[{{instance arn}}]",
    "region": "[{{region}}]",
    "detail": {
        "instance-id": "[{{instance-id}}]",
        "instance-action": "{{terminate}}",
        "instance-termination-time": "{{yyyy-mm-ddThh:mm:ssZ}}",
        "azId": "[{{availability-zone-id}}]"
    }
}
```

### 回收完成
<a name="reclamation-completion"></a>

如果您拥有源预留，则在容量回收完成后会收到此通知：

```
{
    "version": "0",
    "id": "{{12345678-1234-1234-1234-123456789012}}",
    "detail-type": "EC2 Interruptible Capacity Reservation Allocation Reclamation Completed",
    "source": "aws.ec2",
    "account": "[{{source Capacity Reservation Owner Account ID}}]",
    "time": "[{{Current time in yyyy-mm-ddThh:mm:ssZ}}]",
    "region": "{{us-east-1}}",
    "resources": ["{{source_cr_arn}}"],
    "detail": {
        "sourceCapacityReservationId": "string",
        "instanceType": "string",
        "availabilityZoneId": "string",
        "TotalInstanceCount": "{{current total count in the source}}",
        "ReclaimedInstanceCount": "{{count of instances added to the source}}",
        "targetInstanceCount": "{{number}}"
    }
}
```

## CloudTrail 事件
<a name="cloudtrail-events"></a>

CloudTrail 会对可中断容量预留记录以下事件：
+ `InterruptibleCapacityReservationCreated`：当您创建可中断分配时
+ `InterruptibleCapacityReservationAllocationUpdated`：当您修改分配时
+ `InterruptibleCapacityReservationCancelled`：当您取消分配时
+ `CapacityReservationModified`：当我们修改源预留以进行分配时
+ `InterruptibleCapacityReservationInstancesTerminated`：当我们在回收期间终止实例时
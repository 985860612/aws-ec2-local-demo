

# 使用 Amazon EventBridge 监控 AMI 事件
<a name="monitor-ami-events"></a>

当亚马逊机器映像（AMI）状态发生变化时，Amazon EC2 将生成发送到 Amazon EventBridge（以前称为 Amazon CloudWatch Events）的事件。事件以 JSON 格式发送到默认的 EventBridge 事件总线。您可以使用 Amazon EventBridge 检测并响应这些事件。要做到这一点，您可以在 EventBridge 中创建触发操作以响应事件的规则。例如，您可以创建 EventBridge 规则，以检测 AMI 创建过程何时完成，然后调用 Amazon SNS 主题以向您发送电子邮件通知。

当 AMI 进入以下任何状态时，Amazon EC2 将生成 `EC2 AMI State Change` 事件：
+ `available`
+ `failed`
+ `deregistered`
+ `disabled`

事件将尽最大努力生成。

下表列出了 AMI 操作和 AMI 可能存在的状态。在表中，**是**表示相应操作运行时 AMI 可能存在的状态。


| AMI 操作 | available | failed | deregistered | disabled | 
| --- | --- | --- | --- | --- | 
| CopyImage | 支持 | 是 |  |  | 
| CreateImage | 是 | 是 |  |  | 
| CreateRestoreImageTask | 是 | 是 |  |  | 
| DeregisterImage |  |  | 是 |  | 
| DisableImage |  |  |  | 是 | 
| EnableImage | 是 |  |  |  | 
| RegisterImage | 是 | 是 |  |  | 

**EC2 AMI State Change 事件**
+ [事件详细信息](#ami-events)
+ [available 事件](#ami-event-available)
+ [failed 事件](#ami-event-failed)
+ [deregistered 事件](#ami-event-deregistered)
+ [disabled 事件](#ami-event-disabled)

## 事件详细信息
<a name="ami-events"></a>

您可以使用事件中的以下字段创建触发操作的规则：

`"source": "aws.ec2"`  
识别来自 Amazon EC2 的事件。

`"detail-type": "EC2 AMI State Change"`  
识别事件名称。

`"detail": { "ImageId": "ami-0abcdef1234567890", "State": "available", }`  
提供 AMI ID 和 AMI 的状态（`available`、`failed`、`deregistered` 或 `disabled`）。

有关更多信息，请参阅《Amazon EventBridge User Guide》**中的以下内容：
+ [Amazon EventBridge 事件](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html)
+ [Amazon EventBridge 事件模式](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html)
+ [Amazon EventBridge 规则](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html)

有关如何创建 Lambda 函数和运行 Lambda 函数的 EventBridge 规则的教程，请参阅《AWS Lambda Developer Guide》**中的 [Tutorial: Log the state of an Amazon EC2 instance using EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-log-ec2-instance-state.html)。

## available 事件
<a name="ami-event-available"></a>

以下是 Amazon EC2 在 AMI 于 `CreateImage`、`CopyImage`、`RegisterImage`、`CreateRestoreImageTask` 或 `EnableImage` 操作成功后进入 `available` 状态时所生成的事件的示例。

`"State": "available"` 表明 操作成功。

```
{
    "version": "0",
    "id": "example-9f07-51db-246b-d8b8441bcdf0",
    "detail-type": "EC2 AMI State Change",
    "source": "aws.ec2",
    "account": "012345678901",
    "time": "yyyy-mm-ddThh:mm:ssZ",
    "region": "us-east-1",
    "resources": ["arn:aws:ec2:us-east-1::image/ami-0abcdef1234567890"],
    "detail": {
        "RequestId": "example-9dcc-40a6-aa77-7ce457d5442b",
        "ImageId": "ami-0abcdef1234567890",
        "State": "available",
        "ErrorMessage": ""
    }
}
```

## failed 事件
<a name="ami-event-failed"></a>

以下是 Amazon EC2 在 AMI 于 `CreateImage`、`CopyImage`、`RegisterImage` 或 `CreateRestoreImageTask` 操作失败后进入 `failed` 状态时所生成的事件的示例。

以下字段提供相关信息：
+ `"State": "failed"` – 指示操作失败。
+ `"ErrorMessage": ""` – 提供操作失败的原因。

```
{
    "version": "0",
    "id": "example-9f07-51db-246b-d8b8441bcdf0",
    "detail-type": "EC2 AMI State Change",
    "source": "aws.ec2",
    "account": "012345678901",
    "time": "yyyy-mm-ddThh:mm:ssZ",
    "region": "us-east-1",
    "resources": ["arn:aws:ec2:us-east-1::image/ami-0abcdef1234567890"],
    "detail": {
        "RequestId": "example-9dcc-40a6-aa77-7ce457d5442b",
        "ImageId": "ami-0abcdef1234567890",
        "State": "failed",
        "ErrorMessage": "Description of failure"
    }
}
```

## deregistered 事件
<a name="ami-event-deregistered"></a>

以下是 Amazon EC2 在 AMI 于 `DeregisterImage` 操作成功后进入 `deregistered` 状态时所生成的事件的示例。如果操作失败，则不会生成任何事件。由于 `DeregisterImage` 是同步操作，任何故障都能被立即知晓。

`"State": "deregistered"` 表明 `DeregisterImage` 操作成功。

```
{
    "version": "0",
    "id": "example-9f07-51db-246b-d8b8441bcdf0",
    "detail-type": "EC2 AMI State Change",
    "source": "aws.ec2",
    "account": "012345678901",
    "time": "yyyy-mm-ddThh:mm:ssZ",
    "region": "us-east-1",
    "resources": ["arn:aws:ec2:us-east-1::image/ami-0abcdef1234567890"],
    "detail": {
        "RequestId": "example-9dcc-40a6-aa77-7ce457d5442b",
        "ImageId": "ami-0abcdef1234567890",
        "State": "deregistered",
        "ErrorMessage": ""
    }
}
```

## disabled 事件
<a name="ami-event-disabled"></a>

以下是 Amazon EC2 在 AMI 于 `DisableImage` 操作成功后进入 `disabled` 状态时所生成的事件的示例。如果操作失败，则不会生成任何事件。由于 `DisableImage` 是同步操作，任何故障都能被立即知晓。

`"State": "disabled"` 表明 `DisableImage` 操作成功。

```
{
    "version": "0",
    "id": "example-9f07-51db-246b-d8b8441bcdf0",
    "detail-type": "EC2 AMI State Change",
    "source": "aws.ec2",
    "account": "012345678901",
    "time": "yyyy-mm-ddThh:mm:ssZ",
    "region": "us-east-1",
    "resources": ["arn:aws:ec2:us-east-1::image/ami-0abcdef1234567890"],
    "detail": {
        "RequestId": "example-9dcc-40a6-aa77-7ce457d5442b",
        "ImageId": "ami-0abcdef1234567890",
        "State": "disabled",
        "ErrorMessage": ""
    }
}
```
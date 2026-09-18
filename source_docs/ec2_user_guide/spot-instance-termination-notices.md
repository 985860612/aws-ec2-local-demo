

# 竞价型实例中断通知
<a name="spot-instance-termination-notices"></a>

*竞价型实例中断通知*是在 Amazon EC2 停止或终止竞价型实例之前的两分钟发出的警告。如果您将休眠指定为中断行为，则会收到中断通知，但由于休眠过程立即开始，因此您不会提前两分钟收到警告。

正常处理竞价型实例中断的最佳方法是，设计应用程序以提供容错能力。为此，您可以利用竞价型实例中断通知。我们建议您每 5 秒检查一次这些中断通知。

中断通知将以 EventBridge 事件以及竞价型实例上的[实例元数据](ec2-instance-metadata.md)项的形式提供。将尽最大努力发出中断通知。

## EC2 Spot Instance Interruption Warning 事件
<a name="ec2-spot-instance-interruption-warning-event"></a>

当 Amazon EC2 将要中断竞价型实例时，它在实际中断之前的两分钟发出一个事件（休眠除外，此时会收到中断通知，但不会提前两分钟，因为休眠是立即开始的）。Amazon EventBridge 可以检测该事件。有关 EventBridge 事件的更多信息，请参阅《Amazon EventBridge 用户指南》[https://docs.aws.amazon.com/eventbridge/latest/userguide/](https://docs.aws.amazon.com/eventbridge/latest/userguide/)。有关指导您如何创建和使用事件规则的详细示例，请参阅[利用 Amazon EC2 竞价型实例中断通知](https://aws.amazon.com/blogs/compute/taking-advantage-of-amazon-ec2-spot-instance-interruption-notices/)。

以下是竞价型实例中断事件的示例。`instance-action` 的可能值为 `hibernate`、`stop` 或 `terminate`。

```
{
    "version": "0",
    "id": "{{12345678-1234-1234-1234-123456789012}}",
    "detail-type": "EC2 Spot Instance Interruption Warning",
    "source": "aws.ec2",
    "account": "{{123456789012}}",
    "time": "{{yyyy}}-{{mm}}-{{dd}}T{{hh}}:{{mm}}:{{ss}}Z",
    "region": "{{us-east-2}}",
    "resources": ["arn:aws:ec2:{{us-east-2a}}:instance/{{i-1234567890abcdef0}}"],
    "detail": {
        "instance-id": "{{i-1234567890abcdef0}}",
        "instance-action": "{{action}}"
    }
}
```

**注意**  
竞价型实例中断事件的 ARN 格式为 `arn:aws:ec2:{{availability-zone}}:instance/{{instance-id}}`。此格式不同于 [EC2 资源的 ARN 格式](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html#amazonec2-resources-for-iam-policies)。

## instance-action
<a name="instance-action-metadata"></a>

`instance-action` 项目指定操作及其大致执行时间 (采用 UTC 格式)。

如果竞价型实例标记为由 Amazon EC2 停止或终止，将在您的[实例元数据](ec2-instance-metadata.md)中包含 `instance-action` 项。如果没有，则不显示。可以使用实例元数据服务版本 2（IMDSv2）检索 `instance-action`，如下所示。

------
#### [ Linux ]

```
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
    && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/spot/instance-action
```

------
#### [ Windows ]

```
[string]$token = Invoke-RestMethod `
    -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} `
    -Method PUT -Uri http://169.254.169.254/latest/meta-data/spot/instance-action
```

------

 以下示例输出指示将停止此实例的时间。

```
{"action": "stop", "time": "2017-09-18T08:22:00Z"}
```

以下示例输出指示将终止此实例的时间。

```
{"action": "terminate", "time": "2017-09-18T08:22:00Z"}
```

如果 Amazon EC2 没有准备停止或终止该实例，或者如果您自己终止了该实例，则实例元数据中不存在 `instance-action`，并且在尝试检索它时出现 HTTP 404 错误。

## termination-time
<a name="termination-time-metadata"></a>

`termination-time` 项目指定实例将收到关闭信号的大致时间（用 UTC 表示）。

**注意**  
为向后兼容而保留此项目；您应改为使用 `instance-action`。

如果您的竞价型实例被 Amazon EC2 标记为终止（由于中断行为设置为 `terminate` 的竞价型实例中断，或由于永久竞价型实例请求取消），则 `termination-time` 项目将出现在您的[实例元数据](ec2-instance-metadata.md)中。如果没有，则不显示。可以使用 IMDSv2 检索 `termination-time`，如下所示。

------
#### [ Linux ]

```
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
if curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/spot/termination-time | grep -q .*T.*Z; then echo termination_scheduled; fi
```

------
#### [ Windows ]

```
[string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/meta-data/spot/termination-time
```

------

下面是示例输出。

```
2015-01-05T18:02:00Z
```

如果 Amazon EC2 未准备终止实例（因为没有竞价型实例中断，或因为您的中断行为设置为 `stop` 或 `hibernate`），或者如果您自己终止了竞价型实例，则 `termination-time` 项目或者不存在于实例元数据中（这样您会收到 HTTP 404 错误），或者包含并非时间值的值。

如果 Amazon EC2 无法终止实例，请求状态将设置为 `fulfilled`。`termination-time` 值会将实例元数据保持原始大致时间（现已成为过去时间）。
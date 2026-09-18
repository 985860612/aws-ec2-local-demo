

# EC2 实例再平衡建议
<a name="rebalance-recommendations"></a>

EC2 实例*再平衡建议*是一个信号，可在竞价型实例处于较高的中断风险时通知您。信号可能比该[两分钟的竞价型实例中断通知](spot-instance-termination-notices.md)更早到达，从而让您有机会主动管理竞价型实例。您可以决定将工作负载再平衡到不处于较高中断风险的新的或现有的竞价型实例。

Amazon EC2 并不总能在两分钟的竞价型实例中断通知之前发送再平衡建议信号。因此，再平衡建议信号可能会随两分钟的中断通知一起到达。

再平衡建议是作为 EventBridge 事件以及竞价型实例上的[实例元数据](ec2-instance-metadata.md)中的项目提供的。尽最大努力发出事件。

**注意**  
再平衡建议仅支持 2020 年 11 月 5 日 00:00 UTC 之后推出的竞价型实例。

**Topics**
+ [您可以采取的再平衡操作](#rebalancing-actions)
+ [监控再平衡建议信号](#monitor-rebalance-recommendations)
+ [使用再平衡建议信号的服务](#services-using-rebalance-rec-signal)

## 您可以采取的再平衡操作
<a name="rebalancing-actions"></a>

以下是您可以采取的一些可能的再平衡操作：

正常关闭  
当您收到竞价型实例的再平衡建议信号时，您可以启动实例关闭过程，其中可能包括确保在停止进程之前完成它们。例如，您可以将系统或应用程序日志上传到 Amazon Simple Storage Service (Amazon S3)、关闭 Amazon SQS 工作程序或从域名系统 (DNS) 中完成注销。您还可以将工作保存在外部存储器中，稍后再恢复工作。

防止计划新工作  
当您收到竞价型实例的再平衡建议信号时，您可以阻止在实例上计划新工作，同时继续使用实例直到计划的工作完成。

主动启动新的替换实例  
您可以配置 Auto Scaling 组、EC2 实例集或竞价型实例集，以在系统发出再平衡建议信号时自动启动替换竞价型实例集。有关更多信息，请参阅《Amazon EC2 Auto Scaling User Guide》**中的 [Use Capacity Rebalancing to handle Amazon EC2 Spot interruptions](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-capacity-rebalancing.html)，以及本用户指南中的[在 EC2 实例集和竞价型实例集中使用“容量再平衡”功能来替换存在风险的竞价型实例](ec2-fleet-capacity-rebalance.md)。

## 监控再平衡建议信号
<a name="monitor-rebalance-recommendations"></a>

您可以监控再平衡建议信号，以便在发出该信号时，可以执行上一节中指定的操作。再平衡建议信号作为发送到 Amazon EventBridge（以前称为 Amazon CloudWatch Events）的事件和竞价型实例上的实例元数据提供。

**Topics**
+ [使用 Amazon EventBridge](#cp-eventbridge)
+ [使用实例元数据](#cp-instance-metadata)

### 使用 Amazon EventBridge
<a name="cp-eventbridge"></a>

当发出竞价型实例的再平衡建议信号时，该信号的事件将被发送到 Amazon EventBridge。如果 EventBridge 检测到与规则中定义的模式匹配的事件模式，则 EventBridge 调用规则中指定的一个或多个目标。

以下是再平衡建议信号的示例事件。

```
{
    "version": "0",
    "id": "{{12345678-1234-1234-1234-123456789012}}",
    "detail-type": "EC2 Instance Rebalance Recommendation",
    "source": "aws.ec2",
    "account": "{{123456789012}}",
    "time": "{{yyyy}}-{{mm}}-{{dd}}T{{hh}}:{{mm}}:{{ss}}Z",
    "region": "{{us-east-2}}",
    "resources": ["arn:aws:ec2:{{us-east-2}}:{{123456789012}}:instance/{{i-1234567890abcdef0}}"],
    "detail": {
        "instance-id": "{{i-1234567890abcdef0}}"
    }
}
```

下列字段构成规则中定义的事件模式：

`"detail-type": "EC2 Instance Rebalance Recommendation"`  
确定该事件是再平衡建议事件

`"source": "aws.ec2"`  
识别来自 Amazon EC2 的事件

#### 创建 EventBridge 规则
<a name="cp-eventbridge-rule"></a>

当事件模式与规则匹配时，您可以编写 EventBridge 规则并自动执行要采取的操作。

下面的示例可创建 EventBridge 规则，以便在 Amazon EC2 每次发出再平衡建议信号时发送电子邮件、短信或移动推送通知。信号作为 `EC2 Instance Rebalance Recommendation` 事件发出，这将触发规则定义的操作。

创建 EventBridge 规则之前，您必须为电子邮件、短信或移动推送通知创建 Amazon SNS 主题。

**要为再平衡建议事件创建 EventBridge 规则**

1. 打开位于 [https://console.aws.amazon.com/events/](https://console.aws.amazon.com/events/) 的 Amazon EventBridge 控制台。

1. 选择 **Create rule**（创建规则）。

1. 对于**定义规则详细信息**，请执行以下操作：

   1. 输入规则的 **Name (名称)** 和“Description (描述)”（可选）。

      规则不能与同一区域中的另一个规则和同一事件总线上的名称相同。

   1. 对于 **Event bus**（事件总线），选择 **default**（默认）。当您账户中的某个 AWS 服务生成一个事件时，它始终会发送到您账户的默认事件总线。

   1. 对于 **Rule type**（规则类型），选择 **Rule with an event pattern**（具有事件模式的规则）。

   1. 选择**下一步**。

1. 对于 **Build event pattern**（构建事件模式），执行以下操作：

   1. 对于 **Event source**（事件源），选择 **AWS 事件或 EventBridge 合作伙伴事件**。

   1. 对于 **Event pattern**（事件模式），在此示例中，您将指定以下事件模式以匹配 `EC2 Instance Rebalance Recommendation` 事件，然后选择 **Save**（保存）。

      ```
      {
       "source": ["aws.ec2"],
       "detail-type": ["EC2 Instance Rebalance Recommendation"]
      }
      ```

      要添加事件模式，您可以通过选择 **Event pattern form**（事件模式表）使用模板，或者通过选择 **Custom pattern (JSON editor)**（自定义模式（JSON 编辑器））指定您自己的模式，如下所示：

      1. 要使用模板创建事件模式，请执行以下操作：

         1. 选择 **Event pattern form**（事件模式表）。

         1. 对于 **Event source**（事件源），选择 **AWS services**（服务）。

         1. 对于 **AWS 服务**，选择 **EC2 竞价型实例集**。

         1. 对于 **Event type**（事件类型），选择 **EC2 Instance Rebalance Recommendation**（EC2 实例再平衡建议）。

         1. 要自定义模板，请选择 **Edit pattern**（编辑模式），然后进行更改以匹配示例事件模式。

      1. （可选）要指定自定义事件模式，请执行以下操作：

         1. 选择 **Custom pattern (JSON editor)**（自定义模式（JSON 编辑器））。

         1. 在 **Event pattern**（事件模式）框中，为此示例添加事件模式。

   1. 选择**下一步**。

1. 对于 **Select target(s)**（选择目标），请执行以下操作：

   1. 对于 **Target types**（目标类型），选择 **AWS service**（服务）。

   1. 对于 **Select a target**（选择目标），选择 **SNS topic**（SNS 主题）以在事件发生时发送电子邮件、短信或移动推送通知。

   1. 对于 **Topic**（主题），选择现有主题。您首先需要使用 Amazon SNS 控制台创建 Amazon SNS 主题。有关更多信息，请参阅*Amazon Simple Notification Service 开发人员指南*中的[使用 Amazon SNS 进行应用程序对人 (A2P) 消息传送](https://docs.aws.amazon.com/sns/latest/dg/sns-user-notifications.html)。

   1. （可选）在 **Additional settings**（其他设置）下，您可以选择配置其他设置。有关更多信息，请参阅《Amazon EventBridge User Guide》**中的 [Creating Amazon EventBridge rules that react to events](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule.html)（步骤 16）。

   1. 选择**下一步**。

1. （可选）对于 **Tags**（标签），您可以选择向规则分配一个或多个标签，然后选择 **Next**（下一步）。

1. 对于 **Review and create**（查看与创建），执行以下操作：

   1. 查看规则的详细信息并根据需要对其进行修改。

   1. 选择 **Create rule**（创建规则）。

有关更多信息，请参阅 *Amazon EventBridge 用户指南*中的 [Amazon EventBridge 规则](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html)和 [Amazon EventBridge 事件模式](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html)。

### 使用实例元数据
<a name="cp-instance-metadata"></a>

实例元数据类别 `events/recommendations/rebalance` 提供为竞价型实例发出再平衡建议信号的大致时间 (UTC)。

我们建议您每 5 秒检查一次再平衡建议信号，这样您就不会错过对再平衡建议采取行动的机会。

如果竞价型实例收到再平衡建议，则信号发出的时间将显示在实例元数据中。您可以按如下方式检索信号发出的时间。

------
#### [ IMDSv2 ]

**Linux**  
在 Linux 实例上运行以下命令。

**IMDSv2**：

```
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
    && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/events/recommendations/rebalance
```

**Windows**  
在 Windows 实例上运行以下 cmdlet

```
[string]$token = Invoke-RestMethod `
    -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} `
    -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
Invoke-RestMethod `
    -Headers @{"X-aws-ec2-metadata-token" = $token} `
    -Method GET -Uri http://169.254.169.254/latest/meta-data/events/recommendations/rebalance
```

------
#### [ IMDSv1 ]

**Linux**  
在 Linux 实例上运行以下命令。

```
curl http://169.254.169.254/latest/meta-data/events/recommendations/rebalance
```

**Windows**  
在 Windows 实例上运行以下 cmdlet。

```
Invoke-RestMethod -Uri http://169.254.169.254/latest/meta-data/events/recommendations/rebalance
```

------

以下是示例输出，表示为竞价型实例发出的再平衡建议信号时间 (UTC)。

```
{"noticeTime": "2020-10-27T08:22:00Z"}
```

如果尚未为实例发出信号，则 `events/recommendations/rebalance` 不存在，您将在尝试检索该信号时收到 HTTP 404 错误。

## 使用再平衡建议信号的服务
<a name="services-using-rebalance-rec-signal"></a>

Amazon EC2 Auto Scaling、EC2 实例集和竞价型实例集使用再平衡建议信号让您可以轻松地在运行中的实例收到两分钟的竞价型实例中断通知之前，主动使用新的竞价型实例扩展您的实例集，从而帮助您维护工作负载的可用性。您可以让这些服务监控和主动响应影响您的竞价型实例可用性的更改。有关更多信息，请参阅下列内容：
+ 《Amazon EC2 Auto Scaling User Guide》中的 [Use Capacity Rebalancing to handle Amazon EC2 Spot interruptions](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-capacity-rebalancing.html)**
+ 本用户指南中 EC2 实例集和竞价型实例集主题中的[在 EC2 实例集和竞价型实例集中使用“容量再平衡”功能来替换存在风险的竞价型实例](ec2-fleet-capacity-rebalance.md)
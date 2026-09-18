

# 使用 EventBridge 自动执行 Amazon EC2
<a name="automating_with_eventbridge"></a>

您可以使用 Amazon EventBridge 自动执行您的 AWS 服务 和自动响应系统事件，例如应用程序可用性问题或资源更改。AWS 服务中的事件将近乎实时传输到 EventBridge。您可以创建规则来指示要关注的事件，以及在事件匹配规则时要执行的操作。可自动触发的操作包括：
+ 调用 AWS Lambda 函数
+ 调用 Amazon EC2 Run Command
+ 将事件中继到 Amazon Kinesis Data Streams
+ 激活 AWS Step Functions 状态机
+ 通知 Amazon SNS 主题
+ 通知 Amazon SQS 队列

以下示例说明如何将 EventBridge 与 Amazon EC2 结合使用：
+ 每当实例进入运行状态时激活 Lambda 函数。
+ 在创建或修改 Amazon EBS 卷时通知 Amazon SNS 主题。
+ 当另一个 AWS 服务中发生特定事件时，使用 Amazon EC2 Run Command 向一个或多个 Amazon EC2 实例发送命令。

有关更多信息，请参阅 [Amazon EventBridge 用户指南](https://docs.aws.amazon.com/eventbridge/latest/userguide/)。

## Amazon EC2 事件类型
<a name="ec2-events-eventbridge"></a>

Amazon EC2 支持以下事件类型：
+ [EC2 AMI 状态变化](monitor-ami-events.md#ami-events)
+ [EC2 快速启动状态更改通知](win-fast-launch-monitor.md#win-monitor-fast-launch-events)
+ [EC2 实例集错误](monitor-ec2-fleet-using-eventbridge.md#ec2-fleet-config-not-valid)
+ [EC2 实例集信息](monitor-ec2-fleet-using-eventbridge.md#ec2-fleet-info)
+ [EC2 实例集实例更改](monitor-ec2-fleet-using-eventbridge.md#ec2-fleet-instance-change)
+ [EC2 实例集竞价型实例请求更改](monitor-ec2-fleet-using-eventbridge.md#ec2-fleet-spot-instance-request-change)
+ [EC2 实例集状态更改](monitor-ec2-fleet-using-eventbridge.md#ec2-fleet-state-change)
+ [EC2 实例再平衡建议](rebalance-recommendations.md#cp-eventbridge)
+ [EC2 实例状态更改通知](monitoring-instance-state-changes.md)
+ [EC2 竞价型实例集错误](monitor-ec2-fleet-using-eventbridge.md#spot-fleet-config-not-valid)
+ [EC2 竞价型实例集信息](monitor-ec2-fleet-using-eventbridge.md#spot-fleet-info)
+ [EC2 竞价型实例集实例更改](monitor-ec2-fleet-using-eventbridge.md#spot-fleet-instance-change)
+ [EC2 竞价型实例集竞价型实例请求更改](monitor-ec2-fleet-using-eventbridge.md#spot-fleet-spot-instance-request-change)
+ [EC2 竞价型实例集状态更改](monitor-ec2-fleet-using-eventbridge.md#spot-fleet-state-change)
+ [EC2 竞价型实例中断警告](spot-instance-termination-notices.md#ec2-spot-instance-interruption-warning-event)
+ [EC2 竞价型实例请求履行](spot-request-status.md#spot-request-fulfillment-event)
+ [EC2 ODCR 利用不足通知](cr-eventbridge.md)

有关 Amazon EBS 支持的事件类型的信息，请参阅 [Amazon EventBridge for Amazon EBS](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-cloud-watch-events.html)。
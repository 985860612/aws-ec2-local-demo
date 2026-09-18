

# 监控 EC2 实例集或竞价型实例集
<a name="fleet-monitor"></a>

有效监控您的 EC2 实例集或竞价型实例集对于保持最佳性能和确保可靠性至关重要。有各种工具可以帮助您实现这一目标，包括本主题中介绍的 Amazon CloudWatch 和 Amazon EventBridge。

使用 CloudWatch，您可以收集和跟踪指标，设置警报，并自动应对实例集的状态变化。

借助 EventBridge，您可以通过编程方式监控和响应实例集发出的事件。通过在 EventBridge 中定义规则，您可以自动响应特定的实例集事件，例如实例终止或实例集状态更改，从而提高运营效率。

**Topics**
+ [使用 CloudWatch 监控 EC2 实例集或竞价型实例集](ec2-fleet-cloudwatch-metrics.md)
+ [使用 Amazon EventBridge 监控并以编程方式响应您的 EC2 实例集或竞价型实例集发出的事件](monitor-ec2-fleet-using-eventbridge.md)


# 使用 CloudWatch 监控您的实例
<a name="using-cloudwatch"></a>

您可以使用 Amazon CloudWatch 监控您的实例，此工具可从 Amazon EC2 收集原始数据，并将数据处理为易读的近乎实时的指标。这些统计数据会保存 15 个月，从而使您能够访问历史信息，并能够更好地了解您的 Web 应用程序或服务的执行情况。

默认情况下，Amazon EC2 每隔 5 分钟向 CloudWatch 发送一次指标数据。要每隔 1 分钟向 CloudWatch 发送一次实例的指标数据，可以对实例启用详细监控。有关更多信息，请参阅 [管理 EC2 实例的详细监控](manage-detailed-monitoring.md)。

Amazon EC2 控制台将根据来自 Amazon CloudWatch 的原始数据显示一系列图表。根据您的需求，您可能更愿意从 Amazon CloudWatch 而非控制台中的图表中获取实例数据。

有关 Amazon CloudWatch 账单和成本信息，请参阅《Amazon CloudWatch 用户指南》中的 [CloudWatch 账单和成本](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_billing.html)。**

**Topics**
+ [在 Amazon EC2 控制台中管理 EC2 实例的 CloudWatch 警报](ec2-instance-alarms.md)
+ [管理 EC2 实例的详细监控](manage-detailed-monitoring.md)
+ [可用于实例的 CloudWatch 指标](viewing_metrics_with_cloudwatch.md)
+ [使用 Amazon EC2 控制台安装和配置 CloudWatch 代理以添加其他指标](install-and-configure-cloudwatch-agent-using-ec2-console.md)
+ [实例的 CloudWatch 指标的统计数据](monitoring_get_statistics.md)
+ [查看实例的监控图形](graphs-in-the-aws-management-console.md)
+ [为实例创建 CloudWatch 警报](using-cloudwatch-createalarm.md)
+ [创建停止、终止、重启或恢复实例的警报](UsingAlarmActions.md)
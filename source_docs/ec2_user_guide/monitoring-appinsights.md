

# 使用 CloudWatch Application Insights 监控 .NET 和 SQL Server 应用程序
<a name="monitoring-appinsights"></a>

CloudWatch Application Insights 可帮助您监控使用 Amazon EC2 实例以及其他 [AWS 应用程序资源](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-what-is.html#appinsights-components)的 .NET 和 SQL Server 应用程序。该服务在应用程序资源和技术堆栈 [例如：Microsoft SQL Server 数据库、Web（IIS）和应用程序服务器、操作系统、负载均衡器以及队列] 中，指定并设置关键指标日志和警报。它持续监控指标和日志，以检测异常情况和错误并将它们关联起来。在检测到错误和异常情况时，Application Insights 会生成可用于设置通知或执行操作的事件。为了帮助进行故障排除，它为检测到的问题创建自动化控制面板，其中包括关联的指标异常情况和日志错误以及指出潜在根本原因的其他信息。自动化控制面板帮助您快速采取修复措施，以将应用程序保持正常运行并防止对应用程序的最终用户造成影响。

**为检测到的问题提供的相关信息：**
+ 问题的简短摘要
+ 问题的开始时间和日期
+ 问题严重性：高/中/低
+ 检测到的问题的状态：正在进行/已解决
+ 信息：自动生成有关检测到的问题和可能的根本原因的信息
+ 信息反馈：您为有关适用于 .NET 和 SQL Server 的 CloudWatch Application Insights 生成的信息是否有用提供的反馈
+ 相关的观察结果：与各种应用程序组件中的问题相关的指标异常情况和相关日志错误片段的详细视图

**反馈**  
您可以指定为检测到的问题自动生成的信息是否有用以提供反馈。将使用您对这些信息的反馈以及应用程序诊断（指标异常情况和日志异常情况）改进将来对类似问题的检测。

有关更多信息，请参阅 *Amazon CloudWatch 用户指南*中的 [CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) 文档。
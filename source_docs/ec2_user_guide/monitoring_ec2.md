

# 监控 Amazon EC2 资源
<a name="monitoring_ec2"></a>

监控是保持 Amazon EC2 实例和 AWS 解决方案的可靠性、可用性以及性能的重要方面。您的 AWS 解决方案的所有组成部分都应收集监控数据，以便更轻松地调试出现的多点故障。

AWS提供各种可以用来监控 Amazon EC2 的工具。Amazon EC2 和 CloudWatch 控制台控制面板提供您的 Amazon EC2 环境状态的概览视图。此外，我们提供以下各项：
+ **系统状态检查** – 监控使用您的实例所需的 AWS 系统，以确保这些系统正常工作。这些检查会检测出需要 AWS 参与修复的实例问题。当一个系统状态检查故障时，您可以等待 AWS 修复故障，或者您也可以亲自解决该故障（例如，通过停止和重启或终止和替换实例）。导致系统状态检查出现故障的问题示例包括：
  + 网络连接丢失
  + 系统电源损耗
  + 物理主机上的软件问题
  + 物理主机上影响到网络连接状态的硬件问题

  有关更多信息，请参阅[Amazon EC2 实例的状态检查](monitoring-system-instance-status-check.md)。
+ **实例状态检查** – 监控单个实例的软件和网络配置。这些检查检测需要您参与修复的问题。一旦发生实例状态检查故障，一般需要都您亲自解决这些问题（例如，通过重启实例或者在您的操作系统中进行修改）。可能导致实例状态检查出现故障的问题示例包括：
  + 系统状态检查故障
  + 网络或启动配置错误
  + 内存耗尽
  + 文件系统损坏
  + 内核不兼容

  有关更多信息，请参阅[Amazon EC2 实例的状态检查](monitoring-system-instance-status-check.md)。
+ **Amazon CloudWatch 警报** – 在您指定的时间段内监控单个指标，并根据指标值在一些时间段内与给定阈值的对比情况执行一个或多个操作。操作是一个发送到 Amazon Simple Notification Service (Amazon SNS) 主题或 Amazon EC2 Auto Scaling 策略的通知。警报只会调用操作进行持续的状态变更。CloudWatch 警报将不会调用操作，因为这些操作处于特定状态，该状态必须改变并在指定数量的时间段内一直保持。有关更多信息，请参阅 [使用 CloudWatch 监控您的实例](using-cloudwatch.md)。
+ **Amazon EventBridge 事件** – 自动执行 AWS 服务并自动响应系统事件。AWS服务中的事件将近实时传输到 EventBridge，并且您可以指定要在事件匹配您编写的规则时执行的自动操作。有关更多信息，请参阅 [使用 EventBridge 自动执行 Amazon EC2](automating_with_eventbridge.md)。
+ **AWS CloudTrail 日志** – 捕获有关向 Amazon EC2 API 发出的调用的详细信息，并将其以日志文件的形式存储在 Amazon S3 中。您可以使用 CloudTrail 日志确定已发出的调用、调用的源 IP 地址、调用的发出方、调用的发出时间。有关更多信息，请参阅 [使用 AWS CloudTrail 记录 Amazon EC2 API 调用](monitor-with-cloudtrail.md)。
+ **CloudWatch 代理** – 从 EC2 实例和本地服务器上的主机及访客中收集日志和系统级指标。有关更多信息，请参阅 *Amazon CloudWatch 用户指南* 中的[使用 CloudWatch 代理从 Amazon EC2 实例和本地服务器中收集指标和日志](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)。
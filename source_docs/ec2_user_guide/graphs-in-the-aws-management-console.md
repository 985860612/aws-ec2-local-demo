

# 查看实例的监控图形
<a name="graphs-in-the-aws-management-console"></a>

在您启动实例后，可以打开 Amazon EC2 控制台并在 **Monitoring**（监控）选项卡上查看实例的监控图表。每个图表以一个可用的 Amazon EC2 指标为基础。

可供使用图形如下：
+ CPU 平均使用率 (%)
+ 平均读磁盘数 (字节)
+ 平均写磁盘数 (字节)
+ 最大网络输入 (字节)
+ 最大网络输出 (字节)
+ 读磁盘操作概括 (计数)
+ 写磁盘操作概括 (计数)
+ 状态概括 (任意)
+ 实例状态概括 (计数)
+ 系统状态概括 (计数)

有关指标及其向图表提供的数据的更多信息，请参阅 [可用于实例的 CloudWatch 指标](viewing_metrics_with_cloudwatch.md)。

**使用 CloudWatch 控制台绘制指标图标**  
您还可以使用 CloudWatch 控制台将 Amazon EC2 和其他 AWS 服务生成的指标数据绘制成图表。有关更多信息，请参阅《Amazon CloudWatch 用户指南》**中的[绘制指标图表](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/graph_metrics.html)。


# 为未能通过状态检查的 Amazon EC2 实例创建 CloudWatch 警报
<a name="creating_status_check_alarms"></a>

您可以使用[状态检查指标](viewing_metrics_with_cloudwatch.md#status-check-metrics)创建 CloudWatch 警报，以在实例的状态检查失败时向您发送通知。

如果缺少指标数据点，状态检查和状态检查警报可能会暂时进入*数据不足*状态。尽管很少见，但当指标报告系统出现中断时，即使实例运行正常，也会发生这种情况。我们建议将此状态视为数据丢失，而不是状态检查失败或警报违例。为了响应事件而对实例执行停止、终止、重启或恢复操作时，这一点尤其重要。

------
#### [ Console ]

此示例配置了当实例未通过状态检查时发送通知的警报。您可以选择停止、终止或恢复实例。

**创建状态检查警报**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例，选择**状态检查**选项卡，然后依次选择**操作**、**创建状态检查警报**。

1. 在 **Manage CloudWatch alarms**（管理 CloudWatch 警报）页面的 **Add or edit alarm**（添加或编辑警报）下，选择 **Create an alarm**（创建警报）。

1. 对于**警报通知**，打开开关以配置 Amazon Simple Notification Service (Amazon SNS) 通知。选择现有 Amazon SNS 主题或输入名称来创建新主题。

   如果您向收件人列表添加了电子邮件地址或创建了新的主题，则 Amazon SNS 会向每个新地址发送一封确认电子邮件。每位收件人都必须在电子邮件中选择确认链接。仅已确认的地址会收到提醒通知。

1. 对于**警报操作**，打开开关以指定触发警报时要执行的操作。选择操作。

1. 对于**警报阈值**，请指定警报的指标和条件。

   您可以保留**样本分组依据**（**平均值**）和**样本数据类型**（**状态检查 failed:either**）的默认设置，也可以根据自己的需求进行更改。

   在 **Consecutive period**（连续周期）中，设置要评估的周期数，然后在 **Period**（时间段）中输入评估时间段的持续时间，此评估时间段结束后才会触发警报并发送电子邮件。

1. （可选）对于**样本指标数据**，选择**添加到控制面板**。

1. 选择**创建**。

如果需要更改实例状态警报，则可以对其进行编辑。

**编辑状态检查警报**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择所需实例，然后依次选择**操作**、**监控**、**管理 CloudWatch 警报**。

1. 在 **Manage CloudWatch alarms**（管理 CloudWatch 警报）页面的 **Add or edit alarm**（添加或编辑警报）下，选择 **Edit an alarm**（编辑警报）。

1. 对于 **Search for alarm**（搜索警报），选择警报。

1. 完成更改后，选择 **Update**（更新）。

------
#### [ AWS CLI ]

在以下示例中，当实例的实例检查或系统状态检查在至少两个期间连续失败后，警报将向 SNS 主题发送通知。使用的 CloudWatch 指标为 `StatusCheckFailed`。

**创建状态检查警报**

1. 选择一个现有 SNS 主题或创建一个新的主题。有关更多信息，请参阅《AWS Command Line Interface 用户指南》**中的[在 AWS CLI 中访问 Amazon SNS](https://docs.aws.amazon.com/cli/latest/userguide/cli-services-sns.html)。

1. 使用以下 [list-metrics](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/list-metrics.html) 命令查看 Amazon EC2 的可用 Amazon CloudWatch 指标。

   ```
   aws cloudwatch list-metrics --namespace AWS/EC2
   ```

1. 使用以下 [put-metric-alarm](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/put-metric-alarm.html) 命令创建警报。

   ```
   aws cloudwatch put-metric-alarm \
       --alarm-name {{StatusCheckFailed-Alarm-for-i-1234567890abcdef0}} \
       --metric-name StatusCheckFailed \
       --namespace AWS/EC2 \
       --statistic Maximum \
       --dimensions Name=InstanceId,Value={{i-1234567890abcdef0}} \
       --unit Count \
       --period 300 \
       --evaluation-periods 2 \
       --threshold 1 \
       --comparison-operator GreaterThanOrEqualToThreshold \
       --alarm-actions arn:aws:sns:{{us-west-2}}:{{111122223333}}:{{my-sns-topic}}
   ```

   周期为收集 Amazon CloudWatch 指标所需的时间范围（以秒为单位）。此示例使用 300，这是 60 秒乘以 5 分钟得到的结果。评估期是必须将指标数值与阈值相比较的连续周期数。此示例使用 2。警报操作是要在此警报触发时执行的操作。

------
#### [ PowerShell ]

**创建状态检查警报**  
当实例的状态检查在至少两个期间连续失败后，按如下方式使用 [Write-CWMetricAlarm](https://docs.aws.amazon.com/powershell/latest/reference/items/Write-CWMetricAlarm.html) cmdlet 将通知发送到 SNS 主题。

```
Write-CWMetricAlarm `
    -AlarmName "{{StatusCheckFailed-Alarm-for-i-1234567890abcdef0}}" `
    -MetricName "StatusCheckFailed" `
    -Namespace "AWS/EC2" `
    -Statistic "Maximum" `
    -Dimension @{Name="InstanceId"; Values="{{i-1234567890abcdef0}}"} `
    -Unit "Count" `
    -Period 300 `
    -EvaluationPeriod 2 `
    -Threshold 1 `
    -ComparisonOperator "GreaterThanOrEqualToThreshold" `
    -AlarmAction "arn:aws:sns:{{us-west-2}}:{{111122223333}}:{{my-sns-topic}}"
```

周期为收集 Amazon CloudWatch 指标所需的时间范围（以秒为单位）。此示例使用 300，这是 60 秒乘以 5 分钟得到的结果。评估期是必须将指标数值与阈值相比较的连续周期数。此示例使用 2。警报操作是要在此警报触发时执行的操作。

------
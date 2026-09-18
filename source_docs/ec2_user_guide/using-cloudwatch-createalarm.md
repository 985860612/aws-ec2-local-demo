

# 为实例创建 CloudWatch 警报
<a name="using-cloudwatch-createalarm"></a>

您可以创建 CloudWatch 警报来监控您的任一实例的 CloudWatch 指标。当该指标达到指定阈值时，CloudWatch 自动向您发送通知。您可以使用 Amazon EC2 控制台创建 CloudWatch 警报，或者使用 CloudWatch 控制台提供的更多高级选项。

**使用 CloudWatch 控制台创建警报**  
有关示例，请参阅*Amazon CloudWatch 用户指南*中的[创建 Amazon CloudWatch 警报](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)。

**使用 Amazon EC2 控制台创建警报**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择所需实例，然后依次选择 **Actions**（操作）、**Monitor and troubleshoot**（监控和问题排查）、**Manage CloudWatch alarms**（管理 CloudWatch 警报）。

1. 在 **Manage CloudWatch alarms**（管理 CloudWatch 警报）详细信息页面中的 **Add or edit alarm**（添加或编辑警报）下，选择 **Create an alarm**（创建警报）。

1. 对于**警报通知**，选择是否配置 Amazon Simple Notification Service（Amazon SNS）通知。输入现有 Amazon SNS 主题或输入名称来创建新主题。

1. 对于**警报操作**，选择是否指定触发警报时要执行的操作。从列表中选择操作。

1. 对于**警报阈值**，选择警报的指标和条件。例如，要创建一个当 CPU 利用率在 5 分钟内达到 80% 时触发的警报，请执行以下操作：

   1. 为**样本分组依据**（**平均**）和**要采样的数据类型**（**CPU 利用率**）保留默认设置。

   1. 对于**警报触发条件**，选择 **>=** 并输入 **0.80** 作为**百分比**。

   1. 对于**连续周期**，输入 **1** 并选择 **5 分钟**作为**周期**。

1. （可选）对于**样本指标数据**，选择**添加到控制面板**。

1. 选择**创建**。

您可以从 Amazon EC2 控制台或 CloudWatch 控制台编辑 CloudWatch 警报设置。如果要删除警报，可以从 CloudWatch 控制台执行此操作。有关更多信息，请参阅《Amazon CloudWatch 用户指南》**中的[编辑或删除 CloudWatch 警报](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Manage-CloudWatch-Alarm.html#Edit-CloudWatch-Alarm)。


# 在 Amazon EC2 控制台中管理 EC2 实例的 CloudWatch 警报
<a name="ec2-instance-alarms"></a>

从 Amazon EC2 控制台的**实例**屏幕中，您可以管理实例的 Amazon CloudWatch 警报。在**实例**表中，**警报状态**列提供了两个控制台控件：一个用于查看警报，一个用于创建或编辑警报。以下屏幕截图显示了这些控制台控件，编号为 **1**（**查看警报**）和 **2**（**\+** 号表示创建或编辑警报）。

![用于查看和创建警报的“实例”表控件。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/instance-alarms.png)


## 从“实例”屏幕查看警报
<a name="view-ec2-instance-alarms"></a>

您可以从**实例**屏幕查看每个实例的警报。

**从“实例”屏幕查看实例的警报**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 在**实例**表中，对于您选择的实例，选择**查看警报**（上一屏幕截图中编号为 **1**）。

1. 在 **{{i-1234567890abcdef0}} 的警报详细信息**窗口中，选择该警报名称以在 CloudWatch 控制台查看该警报。

## 从“实例”屏幕创建警报
<a name="create-ec2-instance-alarms"></a>

您可以从**实例**屏幕为每个实例创建警报。

**从“实例”屏幕为实例创建警报**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 在**实例**表中，对于您选择的实例，选择加号（上一屏幕截图中编号为 **2**）。

1. 在**管理 CloudWatch 警报**屏幕中，创建警报。有关更多信息，请参阅 [为实例创建 CloudWatch 警报](using-cloudwatch-createalarm.md)。

## 从实例屏幕编辑警报
<a name="edit-ec2-instance-alarms"></a>

您可以从**实例**屏幕编辑实例的警报。

**要从实例屏幕编辑实例的警报**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 在**实例**表中，对于您选择的实例，选择加号（上一屏幕截图中编号为 **2**）。

1. 在**管理 CloudWatch 警报**屏幕中，编辑警报。有关更多信息，请参阅《Amazon CloudWatch 用户指南》**中的[编辑或删除 CloudWatch 警报](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Manage-CloudWatch-Alarm.html#Edit-CloudWatch-Alarm)。
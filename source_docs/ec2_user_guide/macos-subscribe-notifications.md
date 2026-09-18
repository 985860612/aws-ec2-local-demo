

# 订阅 macOS AMI 通知
<a name="macos-subscribe-notifications"></a>

要在新 AMI 发布时或 bridgeOS 更新时收到通知，请使用 Amazon SNS 来订阅通知。

有关 EC2 macOS AMI 的更多信息，请参阅 [Amazon EC2 macOS AMI 发布说明](macos-ami-overview.md)。

**订阅 macOS AMI 通知**

1. 通过以下网址打开 Amazon SNS 控制台：[https://console.aws.amazon.com/sns/v3/home](https://console.aws.amazon.com/sns/v3/home)。

1. 如果需要，可在导航栏中将区域更改为**美国东部（弗吉尼亚州北部）**。您必须使用此区域，因为您订阅的 SNS 通知是在此区域中创建的。

1. 在导航窗格中，选择**订阅**。

1. 选择 **Create subscription**。

1. 对于**创建订阅**对话框，执行以下操作：

   1. 对于 **Topic ARN**，复制并粘贴以下任意一个 Amazon 资源名称（ARN）：
      + **arn:aws:sns:us-east-1:898855652048:amazon-ec2-macos-ami-updates**
      + **arn:aws:sns:us-east-1:898855652048:amazon-ec2-bridgeos-updates**

   1. 对于**协议**，选择以下选项之一：
      + **电子邮件：**

        对于 **Endpoint**，键入可用于接收通知的电子邮件地址。在您创建订阅之后，您将收到一条确认消息，其中包含主题行`AWS Notification - Subscription Confirmation`。打开电子邮件，然后选择 **Confirm subscription (确认订阅)** 以完成订阅。
      + **SMS：**

        对于 **Endpoint (端点)**，键入可用于接收通知的电话号码。
      + **AWS Lambda、Amazon SQS、Amazon Data Firehose**（*通知将以 JSON 格式提供*）：

        对于 **Endpoint (端点)**，输入 Lambda 函数、SQS 队列或者可用于接收通知的 Firehose 流。

   1. 选择 **Create subscription**。

每当发布 macOS AMI 时，我们都会向 `amazon-ec2-macos-ami-updates` 主题的订阅者发送通知。只要 bridgeOS 更新，我们就会向 `amazon-ec2-bridgeos-updates` 主题的订阅者发送通知。如果您不希望再收到这些通知，请通过以下步骤取消订阅。

**取消订阅 macOS AMI 通知**

1. 通过以下网址打开 Amazon SNS 控制台：[https://console.aws.amazon.com/sns/v3/home](https://console.aws.amazon.com/sns/v3/home)。

1. 如果需要，可在导航栏中将区域更改为**美国东部（弗吉尼亚州北部）**。您必须使用此区域，因为 SNS 通知是在此区域中创建的。

1. 在导航窗格中，选择 **Subscriptions**。

1. 选择订阅，然后选择 **Actions**、**Delete subscriptions**，在提示确认时，选择 **Delete**。
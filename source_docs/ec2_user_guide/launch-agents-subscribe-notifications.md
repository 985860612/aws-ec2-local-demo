

# 订阅 EC2 Windows 启动代理通知
<a name="launch-agents-subscribe-notifications"></a>

Amazon SNS 可在 EC2 启动代理的新版本发布时向您发送通知。使用以下过程订阅这些通知。

**订阅 EC2Config 通知**

1. 通过以下网址打开 Amazon SNS 控制台：[https://console.aws.amazon.com/sns/v3/home](https://console.aws.amazon.com/sns/v3/home)。

1. 如果需要，可在导航栏中将区域更改为**美国东部（弗吉尼亚州北部）**。您必须选择此区域，因为您订阅的 SNS 通知是在此区域中创建的。

1. 在导航窗格中，选择 **Subscriptions**。

1. 选择 **Create subscription**。

1. 在 **Create subscription** 对话框中，执行以下操作：

   1. 对于**主题 ARN**，请使用以下 Amazon 资源名称（ARN），该名称与您想要接收通知的代理相匹配：
      + **EC2Launch v2**：

        ```
        arn:aws:sns:us-east-1:309726204594:amazon-ec2launch-v2
        ```
      + **EC2Launch 或 EC2Config**：

        ```
        arn:aws:sns:us-east-1:801119661308:ec2-windows-ec2config
        ```

   1. 对于 **Protocol**，选择 `Email`。

   1. 对于**端点**，输入您要接收通知的电子邮件地址。

   1. 选择 **Create subscription**。

1. 您将收到要求您确认订阅的电子邮件。打开电子邮件，然后按照说明操作以完成订阅。

当启动代理的新版本发布时，我们会向订阅用户发送通知。如果您不希望再收到这些通知，请通过以下步骤取消订阅。

**取消订阅启动代理通知**

1. 打开 Amazon SNS 控制台。

1. 在导航窗格中，选择 **Subscriptions**。

1. 选择订阅，然后依次选择**操作**、**删除订阅**。当系统提示进行确认时，选择 **Delete**。
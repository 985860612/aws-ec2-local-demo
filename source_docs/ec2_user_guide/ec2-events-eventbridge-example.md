

# 创建会在 Amazon EC2 实例更改状态时发送电子邮件的警报
<a name="ec2-events-eventbridge-example"></a>

若要在实例状态更改时接收电子邮件通知，请创建一个 Amazon SNS 主题，然后为 `EC2 Instance State-change Notification` 事件创建一条 EventBridge 规则。

**创建 SNS 主题**

1. 通过 [https://console.aws.amazon.com/sns/v3/home](https://console.aws.amazon.com/sns/v3/home) 打开 Amazon SNS 控制台。

1. 在导航窗格中，选择**主题**。

1. 选择**创建主题**。

1. 对于**类型**，选择**标准**。

1. 对于 **Name**（名称），请为主题输入一个名称。

1. 选择**创建主题**。

1. 选择**创建订阅**。

1. 对于**协议**，选择**电子邮件**。

1. 对于 **Endpoint**（端点），请输入接收通知的电子邮件地址。

1. 选择**创建订阅**。

1. 您将收到电子邮件消息，其主题行为：AWS Notification - Subscription Confirmation。请按照说明确认订阅。

**要创建 EventBridge 规则**

1. 打开位于 [https://console.aws.amazon.com/events/](https://console.aws.amazon.com/events/) 的 Amazon EventBridge 控制台。

1. 选择 **Create rule**（创建规则）。

1. 对于 **Name**（名称），请为规则输入一个名称。

1. 对于**规则类型**，选择**具有事件模式的规则**。

1. 选择**下一步**。

1. 对于 **Event pattern**（事件模式），执行以下操作：

   1. 对于**事件源**，选择 **AWS 服务**。

   1. 对于 **AWS 服务**，请选择 **EC2**。

   1. 对于**事件类型**，请选择 **EC2 实例状态更改通知**。

   1. 默认情况下，我们会就任何实例的任何状态更改发送通知。如果愿意，您可以选择特定状态或特定实例。

1. 选择**下一步**。

1. 按以下操作指定目标：

   1. 对于 **Target types**（目标类型），选择 **AWS 服务**。

   1. 对于 **Select a target**（选择一个目标），选择 **SNS topic**（SNS 主题）。

   1. 对于 **Topic**（主题），请选择您在上一步中创建的 SNS 主题。

1. 选择**下一步**。

1. （可选）向规则添加标签。

1. 选择**下一步**。

1. 选择 **Create rule**（创建规则）。

1. 为测试规则，请发起状态更改。例如，开始已停止的实例、停止正在运行的实例或启动实例。您将收到电子邮件消息，其主题行为：AWS Notification Message。电子邮件正文包含事件数据。
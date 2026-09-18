

# 监控容量预留利用率不足
<a name="cr-eventbridge"></a>

您可以使用以下方法监控容量预留利用率不足：

**Topics**
+ [Amazon EventBridge 事件](#cr-underutilization-events)
+ [电子邮件和 AWS Health 控制面板通知](#monitor-cr-utilization)

## Amazon EventBridge 事件
<a name="cr-underutilization-events"></a>

AWS Health当您账户中的容量预留在特定时间段内的使用率低于 20% 时， 会向 Amazon EventBridge 发送事件。通过 EventBridge，您可以建立触发编程操作的规则，以响应此类事件。例如，您可以创建一个规则：当容量预留的利用率在 7 天内降至 20% 以下时，自动取消容量预留。

EventBridge 中的事件表示为 JSON 对象。该事件独有的字段包含在 JSON 对象的“详细信息”部分。“事件”字段包含事件名称。“结果”字段包含触发事件的操作的已完成状态。有关更多信息，请参阅 *Amazon EventBridge 用户指南*中的 [Amazon EventBridge 事件模式](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html)。

有关更多信息，请参阅 [Amazon EventBridge 用户指南](https://docs.aws.amazon.com/eventbridge/latest/userguide/)。

AWS GovCloud (US) 不支持此功能。

### Events
<a name="cr-eventbridge-events"></a>

AWS Health当容量预留的容量使用率低于 20% 时， 会发送以下事件。
+ `AWS_EC2_ODCR_UNDERUTILIZATION_NOTIFICATION`

  以下是当新创建的容量预留在 24 小时内容量使用率低于 20% 时生成的事件示例。

  ```
  {
      "version": "0",
      "id": "b3e00086-f271-12a1-a36c-55e8ddaa130a",
      "detail-type": "AWS Health Event",
      "source": "aws.health",
      "account": "123456789012",
      "time": "2023-03-10T12:03:38Z",
      "region": "ap-south-1",
      "resources": [
          "cr-01234567890abcdef"
      ],
      "detail": {
          "eventArn": "arn:aws:health:ap-south-1::event/EC2/AWS_EC2_ODCR_UNDERUTILIZATION_NOTIFICATION/AWS_EC2_ODCR_UNDERUTILIZATION_NOTIFICATION_cr-01234567890abcdef-6211-4d50-9286-0c9fbc243f04",
          "service": "EC2",
          "eventTypeCode": "AWS_EC2_ODCR_UNDERUTILIZATION_NOTIFICATION",
          "eventTypeCategory": "accountNotification",
          "startTime": "Fri, 10 Mar 2023 12:03:38 GMT",
          "endTime": "Fri, 10 Mar 2023 12:03:38 GMT",
          "eventDescription": [
              {
                  "language": "en_US",
                  "latestDescription": "{{A description of the event will be provided here}}"
              }
          ],
          "affectedEntities": [
              {
                  "entityValue": "cr-01234567890abcdef"
              }
          ]
      }
      }
  ```
+ `AWS_EC2_ODCR_UNDERUTILIZATION_NOTIFICATION_SUMMARY`

  以下是当一个或多个容量预留在 7 天内容量使用率低于 20% 时生成的事件示例。

  ```
  { 
      "version": "0", "id":"7439d42b-3c7f-ad50-6a88-25e2a70977e2", 
      "detail-type": "AWS Health Event", 
      "source": "aws.health", 
      "account": "123456789012", 
      "time": "2023-03-07T06:06:01Z", 
      "region": "us-east-1", 
      "resources": [ 
          "cr-01234567890abcdef | us-east-1b | t3.medium | Linux/UNIX | 0.0%", 
          "cr-09876543210fedcba | us-east-1a | t3.medium | Linux/UNIX | 0.0%" 
      ], 
      "detail": { 
          "eventArn": "arn:aws:health:us-east-1::event/EC2/AWS_EC2_ODCR_UNDERUTILIZATION_NOTIFICATION_SUMMARY/AWS_EC2_ODCR_UNDERUTILIZATION_NOTIFICATION_SUMMARY_726c1732-d6f6-4037-b9b8-bec3c2d3ba65", 
          "service": "EC2", 
          "eventTypeCode": "AWS_EC2_ODCR_UNDERUTILIZATION_NOTIFICATION_SUMMARY", 
          "eventTypeCategory": "accountNotification", 
          "startTime": "Tue, 7 Mar 2023 06:06:01 GMT", 
          "endTime": "Tue, 7 Mar 2023 06:06:01 GMT", 
          "eventDescription": [
              { 
                  "language": "en_US", 
                  "latestDescription": "{{A description of the event will be provided here}}" 
              }
          ], 
          "affectedEntities": [
              { 
                  "entityValue": "cr-01234567890abcdef | us-east-1b | t3.medium | Linux/UNIX | 0.0%" 
              }, 
              { 
                  "entityValue": "cr-09876543210fedcba | us-east-1a | t3.medium | Linux/UNIX | 0.0%" 
              }
          ]
      }
  }
  ```

### 创建 EventBridge 规则
<a name="cr-eventbridge-use"></a>

如要在容量预留利用率降至 20% 以下时接收电子邮件通知，请创建一个 Amazon SNS 主题，然后为 `AWS_EC2_ODCR_UNDERUTILIZATION_NOTIFICATION` 事件创建 EventBridge 规则。

**创建 Amazon SNS 主题**

1. 通过 [https://console.aws.amazon.com/sns/v3/home](https://console.aws.amazon.com/sns/v3/home) 打开 Amazon SNS 控制台。

1. 在导航窗格中，选择**主题**，然后选择**创建主题**。

1. 对于**类型**，选择**标准**。

1. 对于**名称**，输入新主题的名称。

1. 选择**创建主题**。

1. 选择**创建订阅**。

1. 对于**协议**，选择**电子邮件**，然后对于**端点**，输入接收通知的电子邮件地址。

1. 选择**创建订阅**。

1. 上面输入的电子邮件地址将收到具有以下主题行的电子邮件：`AWS Notification - Subscription Confirmation`。请按照说明确认订阅。

**创建 EventBridge 规则**

1. 访问 [https://console.aws.amazon.com/events/](https://console.aws.amazon.com/events/)，打开 Amazon EventBridge 控制台。

1. 在导航窗格中，选择**规则**，然后选择**创建规则**。

1. 对于**名称**，输入新规则的名称。

1. 对于**规则类型**，选择**具有事件模式的规则**。

1. 选择**下一步**。

1. 在**事件模式**中，执行以下操作：

   1. 对于**事件源**，选择**AWS 服务**。

   1. 对于 **AWS Service**，选择 **AWS Health**。

   1. 对于**事件类型**，选择 **EC2 ODCR 利用不足通知**。

1. 选择**下一步**。

1. 对于**目标 1**，执行以下操作：

   1. 对于**目标类型**，选择**AWS 服务**。

   1. 对于 **Select a target**（选择一个目标），选择 **SNS topic**（SNS 主题）。

   1. 对于**主题**，选择您之前创建的主题。

1. 选择**下一步**，然后再次选择**下一步**。

1. 选择 **Create rule**（创建规则）。

## 电子邮件和 AWS Health 控制面板通知
<a name="monitor-cr-utilization"></a>

当您的账户中容量预留的容量利用率降至 20% 以下时，AWS Health 会发送以下电子邮件和 Health Dashboard 通知。
+ 单独通知：针对在过去 24 小时内利用率低于 20% 的每个新创建的容量预留。
+ 摘要通知：针对在过去 7 天内利用率低于 20% 的所有容量预留。

电子邮件通知和 Health Dashboard 通知将发送到与拥有容量预留的 AWS 账户相关联的电子邮件地址。这些通知包含以下信息：
+ 容量预留的 ID。
+ 容量预留的可用区。
+ 容量预留的平均利用率。
+ 容量预留的实例类型和平台（操作系统）。

此外，当您的账户中容量预留的容量利用率在 24 小时和 7 天内下降到 20% 以下时，AWS Health 会向 EventBridge 发送事件。通过 EventBridge，您可以创建规则来激活自动操作，例如发送电子邮件通知或触发 AWS Lambda 功能，以响应此类事件。有关更多信息，请参阅 [监控容量预留利用率不足](#cr-eventbridge)。
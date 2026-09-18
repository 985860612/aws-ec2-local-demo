

# 使用 Amazon EventBridge 监控并以编程方式响应您的 EC2 实例集或竞价型实例集发出的事件
<a name="monitor-ec2-fleet-using-eventbridge"></a>

当 EC2 实例集或竞价型实例集的状态发生变化时，其将发出通知。该通知作为发送到 Amazon EventBridge（以前称为 Amazon CloudWatch Events）的事件提供。尽最大努力发出事件。

您可以使用 Amazon EventBridge 创建触发编程操作以响应事件的规则。例如，您可以创建两个 EventBridge 规则：一个在实例集状态变化时触发，另一个在实例集中的实例终止时触发。在本例中，您可以配置第一条规则，这样如果实例集状态发生变化，该规则将调用 SNS 主题，向您发送电子邮件通知。您可以配置第二条规则，这样如果实例集中的实例被终止，该规则将调用 Lambda 函数以启动新实例。

**注意**  
只有类型 `maintain` 和 `request` 的队列才能触发事件。类型 `instant` 的队列不会触发事件，因为它们提交同步一次性请求，并且队列的状态立即可在响应中获知。要使用 Amazon EventBridge 监控实例集事件，请求类型必须为 `maintain` 或 `request`。

有关如何描述实例集事件历史记录的说明，请参阅[描述 EC2 实例集的事件历史记录](describe-ec2-fleet.md#describe-ec2-fleet-event-history)。

**Topics**
+ [创建 Amazon EventBridge 规则以监控 EC2 实例集或竞价型实例集事件](#fleet_create-eventbridge-rules)
+ [EC2 队列 事件类型](#ec2-fleet-event-types)
+ [Spot 队列事件类型](#spot-fleet-event-types)

## 创建 Amazon EventBridge 规则以监控 EC2 实例集或竞价型实例集事件
<a name="fleet_create-eventbridge-rules"></a>

当 EC2 实例集或竞价型实例集发出状态变更通知时，该通知将作为事件以 JSON 文件的形式发送到 Amazon EventBridge。如果 EventBridge 检测到与规则中定义的模式匹配的事件模式，则 EventBridge 调用规则中指定的一个或多个目标。

您可以编写 EventBridge 规则，从而根据匹配的事件模式自动执行操作。

事件中的下列字段构成规则中定义的事件模式：

`"source": "aws.ec2fleet"`  
识别来自 EC2 队列 的事件。

`"detail-type": "{{EC2 Fleet State Change}}"`  
识别事件类型。

`"detail": { "sub-type": "{{submitted}}" }`  
识别事件子类型。

有关 EC2 实例集和竞价型实例集事件和示例事件数据的列表，请参阅 [EC2 队列 事件类型](#ec2-fleet-event-types)和[Spot 队列事件类型](#spot-fleet-event-types)。

**Topics**
+ [创建 EventBridge 规则以发送通知](#eventbridge-send-notification)
+ [创建 EventBridge 规则以触发 Lambda 函数](#eventbridge-trigger-lambda)

### 创建 EventBridge 规则以发送通知
<a name="eventbridge-send-notification"></a>

下面的示例可创建 EventBridge 规则，以便在 Amazon EC2 每次发出 EC2 队列状态变化通知时发送电子邮件、短信或移动推送通知。本示例中的信号作为 `EC2 Fleet State Change` 事件发出，这将触发规则定义的操作。

**先决条件**  
创建 EventBridge 规则之前，您必须为电子邮件、短信或移动推送通知创建 Amazon SNS 主题。

**创建 EventBridge 规则以在 EC2 队列 状态变化时发送通知**

1. 打开位于 [https://console.aws.amazon.com/events/](https://console.aws.amazon.com/events/) 的 Amazon EventBridge 控制台。

1. 选择 **Create rule**（创建规则）。

1. 对于**定义规则详细信息**，请执行以下操作：

   1. 输入规则的 **Name (名称)** 和“Description (描述)”（可选）。

      规则不能与同一区域中的另一个规则和同一事件总线上的名称相同。

   1. 对于 **Event bus**（事件总线），选择 **default**（默认）。当您账户中的某个 AWS 服务生成一个事件时，它始终会发送到您账户的默认事件总线。

   1. 对于 **Rule type**（规则类型），选择 **Rule with an event pattern**（具有事件模式的规则）。

   1. 选择**下一步**。

1. 对于 **Build event pattern**（构建事件模式），执行以下操作：

   1. 对于 **Event source**（事件源），选择 **AWS 事件或 EventBridge 合作伙伴事件**。

   1. 对于 **Event pattern**（事件模式），在此示例中，您将指定以下事件模式以匹配 `EC2 Fleet Instance Change` 事件。

      ```
      {
       "source": ["aws.ec2fleet"],
       "detail-type": ["EC2 Fleet Instance Change"]
      }
      ```

      要添加事件模式，您可以通过选择 **Event pattern form**（事件模式表）使用模板，或者通过选择 **Custom pattern (JSON editor)**（自定义模式（JSON 编辑器））指定您自己的模式，如下所示：

      1. 要使用模板创建事件模式，请执行以下操作：

         1. 选择 **Event pattern form**（事件模式表）。

         1. 对于 **Event source**（事件源），选择 **AWS services**（服务）。

         1. 对于 **AWS 服务**，选择 **EC2 实例集**。

         1. 对于 **Event type**（事件类型），选择 **EC2 Fleet Instance Change**（EC2 实例集实例更改）。

         1. 要自定义模板，请选择 **Edit pattern**（编辑模式），然后进行更改以匹配示例事件模式。

      1. （可选）要指定自定义事件模式，请执行以下操作：

         1. 选择 **Custom pattern (JSON editor)**（自定义模式（JSON 编辑器））。

         1. 在 **Event pattern**（事件模式）框中，为此示例添加事件模式。

   1. 选择**下一步**。

1. 对于 **Select target(s)**（选择目标），请执行以下操作：

   1. 对于 **Target types**（目标类型），选择 **AWS service**（服务）。

   1. 对于 **Select a target**（选择目标），选择 **SNS topic**（SNS 主题）以在事件发生时发送电子邮件、短信或移动推送通知。

   1. 对于 **Topic**（主题），选择现有主题。您首先需要使用 Amazon SNS 控制台创建 Amazon SNS 主题。有关更多信息，请参阅*Amazon Simple Notification Service 开发人员指南*中的[使用 Amazon SNS 进行应用程序对人 (A2P) 消息传送](https://docs.aws.amazon.com/sns/latest/dg/sns-user-notifications.html)。

   1. （可选）在 **Additional settings**（其他设置）下，您可以选择配置其他设置。有关更多信息，请参阅《Amazon EventBridge User Guide》**中的 [Creating Amazon EventBridge rules that react to events](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule.html)（步骤 16）。

   1. 选择**下一步**。

1. （可选）对于 **Tags**（标签），您可以选择向规则分配一个或多个标签，然后选择 **Next**（下一步）。

1. 对于 **Review and create**（查看与创建），执行以下操作：

   1. 查看规则的详细信息并根据需要对其进行修改。

   1. 选择 **Create rule**（创建规则）。

有关更多信息，请参阅 *Amazon EventBridge 用户指南*中的 [Amazon EventBridge 规则](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html)和 [Amazon EventBridge 事件模式](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html)。

### 创建 EventBridge 规则以触发 Lambda 函数
<a name="eventbridge-trigger-lambda"></a>

下面的示例可创建 EventBridge 规则，以便在 Amazon EC2 每次在实例启动时发出 EC2 队列实例变更通知时触发 Lambda 函数。本示例中的信号作为 `EC2 Fleet Instance Change` 事件子类型 `launched` 发出，这将触发规则定义的操作。

在创建 EventBridge 规则之前，您必须创建 Lambda 函数。

**创建要在 EventBridge 规则中使用的 Lambda 函数**

1. 打开 AWS Lambda 控制台，地址：[https://console.aws.amazon.com/lambda/](https://console.aws.amazon.com/lambda/)。

1. 选择**创建函数**。

1. 输入函数的名称，配置代码，然后选择 **Create function**（创建函数）。

   有关更多信息，请参阅《AWS Lambda 开发人员指南》**中的[创建第一个 Lambda 函数](https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html)。

**创建 EventBridge 规则以在 EC2 队列 中的实例改变状态时触发 Lambda 函数**

1. 打开位于 [https://console.aws.amazon.com/events/](https://console.aws.amazon.com/events/) 的 Amazon EventBridge 控制台。

1. 选择 **Create rule**（创建规则）。

1. 对于**定义规则详细信息**，请执行以下操作：

   1. 输入规则的 **Name (名称)** 和“Description (描述)”（可选）。

      规则不能与同一区域中的另一个规则和同一事件总线上的名称相同。

   1. 对于 **Event bus**（事件总线），选择 **default**（默认）。当您账户中的某个 AWS 服务生成一个事件时，它始终会发送到您账户的默认事件总线。

   1. 对于 **Rule type**（规则类型），选择 **Rule with an event pattern**（具有事件模式的规则）。

   1. 选择**下一步**。

1. 对于 **Build event pattern**（构建事件模式），执行以下操作：

   1. 对于 **Event source**（事件源），选择 **AWS 事件或 EventBridge 合作伙伴事件**。

   1. 对于 **Event pattern**（事件模式），在此示例中，您将指定以下事件模式以匹配 `EC2 Fleet Instance Change` 事件和 `launched` 子类型。

      ```
      {
       "source": ["aws.ec2fleet"],
       "detail-type": ["EC2 Fleet Instance Change"],
       "detail": {
         "sub-type": ["launched"]
      }
      ```

      要添加事件模式，您可以通过选择 **Event pattern form**（事件模式表）使用模板，或者通过选择 **Custom pattern (JSON editor)**（自定义模式（JSON 编辑器））指定您自己的模式，如下所示：

      1. 要使用模板创建事件模式，请执行以下操作：

         1. 选择 **Event pattern form**（事件模式表）。

         1. 对于 **Event source**（事件源），选择 **AWS services**（服务）。

         1. 对于 **AWS 服务**，选择 **EC2 实例集**。

         1. 对于 **Event type**（事件类型），选择 **EC2 Fleet Instance Change**（EC2 实例集实例更改）。

         1. 选择 **Edit pattern**（编辑模式），然后添加 `"detail": {"sub-type": ["launched"]` 以匹配示例事件模式。对于正确的 JSON 格式，在前面的方括号（`,`）之后插入一个逗号（`]`）。

      1. （可选）要指定自定义事件模式，请执行以下操作：

         1. 选择 **Custom pattern (JSON editor)**（自定义模式（JSON 编辑器））。

         1. 在 **Event pattern**（事件模式）框中，为此示例添加事件模式。

   1. 选择**下一步**。

1. 对于 **Select target(s)**（选择目标），请执行以下操作：

   1. 对于 **Target types**（目标类型），选择 **AWS service**（服务）。

   1. 对于 **Select a target**（选择目标），选择 **SNS topic**（SNS 主题）以在事件发生时发送电子邮件、短信或移动推送通知。

   1. 对于 **Topic**（主题），选择 **Lambda function**（Lambda 函数），对于 **Function**（函数），选择您创建的用于在事件发生时响应的函数。

   1. （可选）在 **Additional settings**（其他设置）下，您可以选择配置其他设置。有关更多信息，请参阅《Amazon EventBridge User Guide》**中的 [Creating Amazon EventBridge rules that react to events](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule.html)（步骤 16）。

   1. 选择**下一步**。

1. （可选）对于 **Tags**（标签），您可以选择向规则分配一个或多个标签，然后选择 **Next**（下一步）。

1. 对于 **Review and create**（查看与创建），执行以下操作：

   1. 查看规则的详细信息并根据需要对其进行修改。

   1. 选择 **Create rule**（创建规则）。

有关如何创建 Lambda 函数和运行 Lambda 函数的 EventBridge 规则的教程，请参阅 *AWS Lambda 开发人员指南*中的[教程：使用 EventBridge 记录 Amazon EC2 实例的状态](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-log-ec2-instance-state.html)。

## EC2 队列 事件类型
<a name="ec2-fleet-event-types"></a>

EC2 队列 事件类型有五种。对于每种事件类型，都有几个子类型。

**Topics**
+ [EC2 队列状态变化](#ec2-fleet-state-change)
+ [EC2 实例集竞价型实例请求更改](#ec2-fleet-spot-instance-request-change)
+ [EC2 队列实例更改](#ec2-fleet-instance-change)
+ [EC2 队列信息](#ec2-fleet-info)
+ [EC2 队列错误](#ec2-fleet-config-not-valid)

### EC2 队列状态变化
<a name="ec2-fleet-state-change"></a>

当 EC2 队列 状态变化时，EC2 队列 会将 `EC2 Fleet State Change` 事件发送到 Amazon EventBridge。

以下是此事件的示例数据。

```
{
    "version": "0",
    "id": "715ed6b3-b8fc-27fe-fad6-528c7b8bf8a2",
    "detail-type": "EC2 Fleet State Change",
    "source": "aws.ec2fleet",
    "account": "123456789012",
    "time": "2020-11-09T09:00:20Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:ec2:us-east-1:123456789012:fleet/fleet-598fb973-87b7-422d-be4d-6b0809bfff0a"
    ],
    "detail": {
        "sub-type": "active"
    }
}
```

`sub-type` 可使用的值为：

`active`  
EC2 实例集请求已验证，并且 Amazon EC2 正在尝试使正在运行的实例保持目标数量。

`deleted`  
EC2 队列 请求已删除，没有正在运行的实例。EC2 队列 将在其实例终止两天后被删除。

`deleted_running`  
EC2 队列 请求已删除，且不启动其他实例。现有实例将继续运行，直至被中断或终止。请求会保持此状态，直到所有实例都已中断或终止。

`deleted_terminating`  
EC2 实例集请求已删除，正在终止其实例。请求会保持此状态，直到所有实例都已终止。

`expired`  
EC2 队列 请求已过期。如果请求使用 `TerminateInstancesWithExpiration` 集创建，则随后的 `terminated` 事件指示实例已终止。

`modify_in_progress`  
正在修改 EC2 实例集请求。请求将保持该状态，直到完全处理修改。

`modify_succeeded`  
EC2 队列 请求已修改。

`submitted`  
EC2 实例集正在接受评估，并且 Amazon EC2 正准备启动目标数量的实例。

`progress`  
该 EC2 队列 请求正在执行过程中。

### EC2 实例集竞价型实例请求更改
<a name="ec2-fleet-spot-instance-request-change"></a>

当队列中的竞价型实例请求状态变化时，EC2 实例集 会将 `EC2 Fleet Spot Instance Request Change` 事件发送到 Amazon EventBridge。

以下是此事件的示例数据。

```
{
    "version": "0",
    "id": "19331f74-bf4b-a3dd-0f1b-ddb1422032b9",
    "detail-type": "EC2 Fleet Spot Instance Request Change",
    "source": "aws.ec2fleet",
    "account": "123456789012",
    "time": "2020-11-09T09:00:05Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:ec2:us-east-1:123456789012:fleet/fleet-83fd4e48-552a-40ef-9532-82a3acca5f10"
    ],
    "detail": {
        "spot-instance-request-id": "sir-rmqske6h",
        "description": "SpotInstanceRequestId sir-rmqske6h, PreviousState: cancelled_running",
        "sub-type": "cancelled"
    }
}
```

`sub-type` 可使用的值为：

`active`  
竞价型实例请求已执行并有关联的竞价型实例。

`cancelled`  
您取消了竞价型实例请求，或竞价型实例请求已过期。

`disabled`  
您停止了竞价型实例。

`submitted`  
已提交竞价型实例请求。

### EC2 队列实例更改
<a name="ec2-fleet-instance-change"></a>

当队列中的实例状态变化时，EC2 队列 会将 `EC2 Fleet Instance Change` 事件发送到 Amazon EventBridge。

以下是此事件的示例数据。

```
{
    "version": "0",
    "id": "542ce428-c8f1-0608-c015-e8ed6522c5bc",
    "detail-type": "EC2 Fleet Instance Change",
    "source": "aws.ec2fleet",
    "account": "123456789012",
    "time": "2020-11-09T09:00:23Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:ec2:us-east-1:123456789012:fleet/fleet-598fb973-87b7-422d-be4d-6b0809bfff0a"
    ],
    "detail": {
        "instance-id": "i-0c594155dd5ff1829",
        "description": "{\"instanceType\":\"c5.large\",\"image\":\"ami-6057e21a\",\"productDescription\":\"Linux/UNIX\",\"availabilityZone\":\"us-east-1d\"}",
        "sub-type": "launched"
    }
}
```

`sub-type` 可使用的值为：

`launched`  
启动了一个新实例。

`terminated`  
实例已终止。

`termination_notified`  
当 Amazon EC2 在缩减期间终止竞价型实例时，机群的目标容量被缩减，例如，从目标容量 4 减至目标容量 3 时，会发送实例终止通知。

### EC2 队列信息
<a name="ec2-fleet-info"></a>

在履行过程中出错时，EC2 队列 会将 `EC2 Fleet Information` 事件发送到 Amazon EventBridge。信息事件不会阻止队列尝试实现其目标容量。

以下是此事件的示例数据。

```
{
    "version": "0",
    "id": "76529817-d605-4571-7224-d36cc1b2c0c4",
    "detail-type": "EC2 Fleet Information",
    "source": "aws.ec2fleet",
    "account": "123456789012",
    "time": "2020-11-09T08:17:07Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:ec2:us-east-1:123456789012:fleet/fleet-8becf5fe-bb9e-415d-8f54-3fa5a8628b91"
    ],
    "detail": {
        "description": "c4.xlarge, ami-0947d2ba12ee1ff75, Linux/UNIX, us-east-1a, Spot price in either SpotFleetRequestConfigData or SpotFleetLaunchSpecification or LaunchTemplate or LaunchTemplateOverrides is less than Spot market price $0.0619",
        "sub-type": "launchSpecUnusable"
    }
}
```

`sub-type` 可使用的值为：

`fleetProgressHalted`  
每个启动规范中的价格无效，因为它低于 Spot 价格（所有启动规范都已生成 `launchSpecUnusable` 事件）。如果 Spot 价格发生变化，启动规范可能会变为有效。

`launchSpecTemporarilyBlacklisted`  
配置无效，多次启动实例的尝试都已失败。有关更多信息，请参阅事件的描述。

`launchSpecUnusable`  
启动规范中的价格无效，因为它低于 Spot 价格。

`registerWithLoadBalancersFailed`  
尝试向负载均衡器注册实例失败。有关更多信息，请参阅事件的描述。

### EC2 队列错误
<a name="ec2-fleet-config-not-valid"></a>

在履行过程中出错时，EC2 队列 会将 `EC2 Fleet Error` 事件发送到 Amazon EventBridge。错误事件阻止了队列尝试实现其目标容量。

以下是此事件的示例数据。

```
{
    "version": "0",
    "id": "69849a22-6d0f-d4ce-602b-b47c1c98240e",
    "detail-type": "EC2 Fleet Error",
    "source": "aws.ec2fleet",
    "account": "123456789012",
    "time": "2020-10-07T01:44:24Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:ec2:us-east-1:123456789012:fleet/fleet-9bb19bc6-60d3-4fd2-ae47-d33e68eafa08"
    ],
    "detail": {
        "description": "m3.large, ami-00068cd7555f543d5, Linux/UNIX: IPv6 is not supported for the instance type 'm3.large'. ",
        "sub-type": "spotFleetRequestConfigurationInvalid"
    }
}
```

`sub-type` 可使用的值为：

`iamFleetRoleInvalid`  
EC2 机群没有启动或终止实例所需的权限。

`allLaunchSpecsTemporarilyBlacklisted`  
所有配置均无效，多次启动实例的尝试已失败。有关更多信息，请参阅事件的描述。

`spotInstanceCountLimitExceeded`  
您已达到可启动的竞价型实例的数量限制。

`spotFleetRequestConfigurationInvalid`  
该配置无效。有关更多信息，请参阅事件的描述。

## Spot 队列事件类型
<a name="spot-fleet-event-types"></a>

**注意**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

Spot 队列事件类型有五种。对于每种事件类型，都有几个子类型。

**Topics**
+ [EC2 Spot 队列状态变化](#spot-fleet-state-change)
+ [EC2竞价型实例集竞价型实例请求更改](#spot-fleet-spot-instance-request-change)
+ [EC2 Spot 队列实例更改](#spot-fleet-instance-change)
+ [EC2 Spot 队列信息](#spot-fleet-info)
+ [EC2 Spot 队列错误](#spot-fleet-config-not-valid)

### EC2 Spot 队列状态变化
<a name="spot-fleet-state-change"></a>

当 Spot 队列状态变化时，Spot 队列会将 `EC2 Spot Fleet State Change` 事件发送到 Amazon EventBridge。

以下是此事件的示例数据。

```
{
    "version": "0",
    "id": "d1af1091-6cc3-2e24-203a-3b870e455d5b",
    "detail-type": "EC2 Spot Fleet State Change",
    "source": "aws.ec2spotfleet",
    "account": "123456789012",
    "time": "2020-11-09T08:57:06Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:ec2:us-east-1:123456789012:spot-fleet-request/sfr-4b6d274d-0cea-4b2c-b3be-9dc627ad1f55"
    ],
    "detail": {
        "sub-type": "submitted"
    }
}
```

`sub-type` 可使用的值为：

`active`  
已验证竞价型实例集请求，并且 Amazon EC2 正在尝试维护目标数量的正在运行的实例。

`cancelled`  
竞价型实例集请求已取消，没有正在运行的实例。Spot 队列将在其实例终止两天后被删除。

`cancelled_running`  
竞价型实例集请求已取消，且不启动其他实例。现有实例将继续运行，直至被中断或终止。请求会保持此状态，直到所有实例都已中断或终止。

`cancelled_terminating`  
竞价型实例集请求已取消，正在终止其实例。请求会保持此状态，直到所有实例都已终止。

`expired`  
Spot 队列请求已过期。如果请求使用 `TerminateInstancesWithExpiration` 集创建，则随后的 `terminated` 事件指示实例已终止。

`modify_in_progress`  
竞价型实例集请求正在修改中。请求将保持该状态，直到完全处理修改。

`modify_succeeded`  
Spot 队列请求已修改。

`submitted`  
正在评估竞价型实例集请求，并且 Amazon EC2 正准备启动目标数量的实例。

`progress`  
Spot 队列请求正在执行过程中。

### EC2竞价型实例集竞价型实例请求更改
<a name="spot-fleet-spot-instance-request-change"></a>

当队列中的竞价型实例请求状态变化时，竞价型实例集会将 `EC2 Spot Fleet Spot Instance Request Change` 事件发送到 Amazon EventBridge。

以下是此事件的示例数据。

```
{
    "version": "0",
    "id": "cd141ef0-14af-d670-a71d-fe46e9971bd2",
    "detail-type": "EC2 Spot Fleet Spot Instance Request Change",
    "source": "aws.ec2spotfleet",
    "account": "123456789012",
    "time": "2020-11-09T08:53:21Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:ec2:us-east-1:123456789012:spot-fleet-request/sfr-a98d2133-941a-47dc-8b03-0f94c6852ad1"
    ],
    "detail": {
        "spot-instance-request-id": "sir-a2w9gc5h",
        "description": "SpotInstanceRequestId sir-a2w9gc5h, PreviousState: cancelled_running",
        "sub-type": "cancelled"
    }
}
```

`sub-type` 可使用的值为：

`active`  
竞价型实例请求已执行并有关联的竞价型实例。

`cancelled`  
您取消了竞价型实例请求，或竞价型实例请求已过期。

`disabled`  
您停止了竞价型实例。

`submitted`  
已提交竞价型实例请求。

### EC2 Spot 队列实例更改
<a name="spot-fleet-instance-change"></a>

当队列中的实例状态变化时，Spot 队列会将 `EC2 Spot Fleet Instance Change` 事件发送到 Amazon EventBridge。

以下是此事件的示例数据。

```
{
    "version": "0",
    "id": "11591686-5bd7-bbaa-eb40-d46529c2710f",
    "detail-type": "EC2 Spot Fleet Instance Change",
    "source": "aws.ec2spotfleet",
    "account": "123456789012",
    "time": "2020-11-09T07:25:02Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:ec2:us-east-1:123456789012:spot-fleet-request/sfr-c8a764a4-bedc-4b62-af9c-0095e6e3ba61"
    ],
    "detail": {
        "instance-id": "i-08b90df1e09c30c9b",
        "description": "{\"instanceType\":\"r4.2xlarge\",\"image\":\"ami-032930428bf1abbff\",\"productDescription\":\"Linux/UNIX\",\"availabilityZone\":\"us-east-1a\"}",
        "sub-type": "launched"
    }
}
```

`sub-type` 可使用的值为：

`launched`  
启动了一个新实例。

`terminated`  
实例已终止。

`termination_notified`  
当 Amazon EC2 在缩减期间终止竞价型实例时，机群的目标容量被缩减，例如，从目标容量 4 减至目标容量 3 时，会发送实例终止通知。

### EC2 Spot 队列信息
<a name="spot-fleet-info"></a>

在履行过程中出错时，Spot 队列会将 `EC2 Spot Fleet Information` 事件发送到 Amazon EventBridge。信息事件不会阻止队列尝试实现其目标容量。

以下是此事件的示例数据。

```
{
    "version": "0",
    "id": "73a60f70-3409-a66c-635c-7f66c5f5b669",
    "detail-type": "EC2 Spot Fleet Information",
    "source": "aws.ec2spotfleet",
    "account": "123456789012",
    "time": "2020-11-08T20:56:12Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:ec2:us-east-1:123456789012:spot-fleet-request/sfr-2531ea06-af18-4647-8757-7d69c94971b1"
    ],
    "detail": {
        "description": "r3.8xlarge, ami-032930428bf1abbff, Linux/UNIX, us-east-1a, Spot bid price is less than Spot market price $0.5291",
        "sub-type": "launchSpecUnusable"
    }
}
```

`sub-type` 可使用的值为：

`fleetProgressHalted`  
每个启动规范中的价格无效，因为它低于 Spot 价格（所有启动规范都已生成 `launchSpecUnusable` 事件）。如果 Spot 价格发生变化，启动规范可能会变为有效。

`launchSpecTemporarilyBlacklisted`  
配置无效，多次启动实例的尝试都已失败。有关更多信息，请参阅事件的描述。

`launchSpecUnusable`  
启动规范中的价格无效，因为它低于 Spot 价格。

`registerWithLoadBalancersFailed`  
尝试向负载均衡器注册实例失败。有关更多信息，请参阅事件的描述。

### EC2 Spot 队列错误
<a name="spot-fleet-config-not-valid"></a>

在履行过程中出错时，Spot 队列会将 `EC2 Spot Fleet Error` 事件发送到 Amazon EventBridge。错误事件阻止了队列尝试实现其目标容量。

以下是此事件的示例数据。

```
{
    "version": "0",
    "id": "10adc4e7-675c-643e-125c-5bfa1b1ba5d2",
    "detail-type": "EC2 Spot Fleet Error",
    "source": "aws.ec2spotfleet",
    "account": "123456789012",
    "time": "2020-11-09T06:56:07Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:ec2:us-east-1:123456789012:spot-fleet-request/sfr-38725d30-25f1-4f30-83ce-2907c56dba17"
    ],
    "detail": {
        "description": "r4.2xlarge, ami-032930428bf1abbff, Linux/UNIX: The associatePublicIPAddress parameter can only be specified for the network interface with DeviceIndex 0. ",
        "sub-type": "spotFleetRequestConfigurationInvalid"
    }
}
```

`sub-type` 可使用的值为：

`iamFleetRoleInvalid`  
竞价型实例集不具有启动或终止实例所需的权限。

`allLaunchSpecsTemporarilyBlacklisted`  
所有配置均无效，多次启动实例的尝试已失败。有关更多信息，请参阅事件的描述。

`spotInstanceCountLimitExceeded`  
您已达到可启动的竞价型实例的数量限制。

`spotFleetRequestConfigurationInvalid`  
该配置无效。有关更多信息，请参阅事件的描述。
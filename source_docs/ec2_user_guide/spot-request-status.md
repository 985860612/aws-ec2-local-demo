

# 获取竞价型实例请求的状态
<a name="spot-request-status"></a>

要帮助跟踪您的竞价型实例请求和规划您对竞价型实例的使用，请使用 Amazon EC2 提供的请求状态。例如，请求状态可以提供尚未完成 Spot 请求的原因，或者列出妨碍完成 Spot 请求的限制。

在此过程（也称为 Spot 请求*生命周期*）中的每一步，都有特定事件确定连续的请求状态。

以下演示了竞价型实例请求的运行方式。请注意，请求类型（一次性或持久性）确定在 Amazon EC2 中断竞价型实例时或者在您停止竞价型实例时是否重新打开请求。如果请求是持久性请求，则在中断竞价型实例之后将重新打开请求。如果请求是持久性的，并且您停止了竞价型实例，则请求仅在您启动竞价型实例后打开。

![竞价型实例请求的工作原理。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/spot_lifecycle.png)


**Topics**
+ [获取请求状态信息](#get-spot-instance-request-status)
+ [Spot 请求状态代码](#spot-instance-request-status-understand)
+ [EC2 竞价型实例请求履行事件](#spot-request-fulfillment-event)
+ [Spot 请求的状态更改](spot-instances-request-status-lifecycle.md)

## 获取请求状态信息
<a name="get-spot-instance-request-status"></a>

您可以获取竞价型实例的状态信息。

------
#### [ Console ]

**获取请求状态信息**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests (Spot 请求)**，然后选择所需的 Spot 请求。

1. 要检查状态，请在 **Description (描述)** 选项卡上检查 **Status (状态)** 字段。

------
#### [ AWS CLI ]

**获取请求状态信息**  
使用以下 [describe-spot-instance-requests](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-spot-instance-requests.html) 命令。

```
aws ec2 describe-spot-instance-requests --spot-instance-request-ids {{sir-0e54a519c9EXAMPLE}}
```

------
#### [ PowerShell ]

**获取请求状态信息**  
使用 [Get-EC2SpotInstanceRequest](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2SpotInstanceRequest.html) cmdlet。

```
Get-EC2SpotInstanceRequest -SpotInstanceRequestId {{sir-0e54a519c9EXAMPLE}}
```

------

## Spot 请求状态代码
<a name="spot-instance-request-status-understand"></a>

Spot 请求状态信息包含状态代码、更新时间以及状态消息。这些信息帮助您确定如何处理 Spot 请求。

下面是 Spot 请求状态代码：

`az-group-constraint`  
Amazon EC2 无法在同一可用区中启动您请求的所有实例。

`bad-parameters`  
您的 Spot 请求的一个或多个参数无效 (例如，您指定的 AMI 不存在)。状态消息指示哪个参数无效。

`canceled-before-fulfillment`  
在完成前，用户取消了竞价请求。

`capacity-not-available`  
您请求的实例没有足够的容量可用。

`constraint-not-fulfillable`  
由于一个或多个限制无效 (例如，可用区不存在)，Spot 请求无法完成。状态消息指示哪个限制无效。

`fulfilled`  
Spot 请求处于 `active` 状态，Amazon EC2 正在启动您的竞价型实例。

`instance-stopped-by-price`  
您的实例已停止，因为 Spot 价格超出了您的最高价格。

`instance-stopped-by-user`  
由于用户停止了实例或从实例运行了 shutdown 命令，您的实例已停止。

`instance-stopped-no-capacity`  
由于 EC2 容量管理需要，您的实例已停止。

`instance-terminated-by-price`  
您的实例已终止，因为 Spot 价格超出了您的最高价格。如果您的请求是持久性的，该过程将重新开始，因此，您的请求将等待进行评估。

`instance-terminated-by-schedule`  
您的竞价型实例在其计划持续时间结束时终止。

`instance-terminated-by-service`  
您的实例从停止状态终止。

`instance-terminated-by-user` 或者 `spot-instance-terminated-by-user`\*\*  
您终止了已完成的竞价型实例，因此，请求状态为（`closed`除非这是持久性请求），实例状态为 `terminated`。

`instance-terminated-launch-group-constraint`  
您的启动组中的一个或多个实例已终止，因此不再满足启动组的限制。

`instance-terminated-no-capacity`  
由于标准容量管理流程，您的实例已终止。

`launch-group-constraint`  
Amazon EC2 无法同时启动您请求的所有实例。启动组内的所有实例都一起启动和终止。

`limit-exceeded`  
超过了 EBS 卷数量或总卷存储的限制。有关更多信息，请参阅《Amazon EBS User Guide》**中的 [Quotas for Amazon EBS](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-resource-quotas.html)。

`marked-for-stop`  
竞价型实例被标记为停止。

`marked-for-termination`  
竞价型实例被标记为终止。

`not-scheduled-yet`  
您的 Spot 请求在指定日期之前不会被评估。

`pending-evaluation`  
当您提交竞价型实例请求之后，该请求会进入 `pending-evaluation` 状态，同时系统会评估您的请求中的参数。

`pending-fulfillment`  
Amazon EC2 正尝试预置竞价型实例。

`placement-group-constraint`  
因为竞价型实例目前不能添加到置放群组中，因此尚无法完成 Spot 请求。

`price-too-low`  
由于您的最高价低于 Spot 价格，无法完成请求。在这种情况下，不会启动任何实例，并且您的请求保持 `open` 状态。

`request-canceled-and-instance-running`  
在竞价型实例仍在运行时，您取消了 Spot 请求。请求为 `cancelled`，但是，实例保持为 `running`。

`schedule-expired`  
由于没有在指定日期前完成，Spot 请求已过期。

`system-error`  
出现意外系统错误。如果这是反复出现的问题，请联系 AWS 支持 以获取帮助。

## EC2 竞价型实例请求履行事件
<a name="spot-request-fulfillment-event"></a>

当竞价型实例请求履行后，Amazon EC2 会向 Amazon EventBridge 发送一个 EC2 竞价型实例请求履行事件。您可以创建一条规则，以在此事件发生时执行操作，例如调用某个 Lambda 函数或通知某个 Amazon SNS 主题。

以下是此事件的示例数据。

```
{
    "version": "0",
    "id": "{{01234567-1234-0123-1234-012345678901}}",
    "detail-type": "EC2 Spot Instance Request Fulfillment",
    "source": "aws.ec2",
    "account": "{{123456789012}}",
    "time": "{{yyyy}}-{{mm}}-{{dd}}T{{hh}}:{{mm}}:{{ss}}Z",
    "region": "{{us-east-2}}",
    "resources": ["arn:aws:ec2:{{us-east-2}}:{{123456789012}}:instance/{{i-1234567890abcdef0}}"],
    "detail": {
        "spot-instance-request-id": "{{sir-0e54a519c9EXAMPLE}}",
        "instance-id": "{{i-1234567890abcdef0}}"
    }
}
```

有关更多信息，请参阅 [Amazon EventBridge 用户指南](https://docs.aws.amazon.com/eventbridge/latest/userguide/)。


# 容量使用者的可中断容量预留
<a name="capacity-consumer-procedures"></a>

容量使用者是将实例启动到共享的可中断容量预留的账户，但须知，当所有者回收容量时，其实例可能会被终止。

本节介绍您（容量使用者）如何将实例启动到可中断容量预留，并了解当所有者回收容量时会发生什么情况。

**Topics**
+ [查看可中断容量预留](#view-interruptible-cr-consumer)
+ [将实例启动到可中断预留中](#launch-instances-interruptible)
+ [中断体验](#interruption-experience)

## 查看可中断容量预留
<a name="view-interruptible-cr-consumer"></a>

请按照以下过程查看可中断容量预留。

------
#### [ Console ]

**查看您账户中的可中断容量预留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择**容量预留**。

1. 在**可中断**列中，查找标记为**是**的预留。

1. 请记下预留 ID，以便在您的实例启动时使用。

------
#### [ AWS CLI ]

**查找您账户中的所有可中断容量预留**  
使用 [describe-capacity-reservations](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/describe-capacity-reservations.html) 命令：

```
aws ec2 describe-capacity-reservations \
--filters Name=state,Values=active
```

查找响应中 `Interruptible` 设置为 `true` 的预留。

**专门筛选可中断预留**  
使用以下命令：

```
aws ec2 describe-capacity-reservations \
--capacity-reservation-ids {{cr-example123}} \
--query 'CapacityReservations[?Interruptible==`true`]'
```

------

**注意**  
可中断容量预留默认情况下是有针对性的容量预留，因此您需要在实例启动时专门将其作为目标。与开放式预留不同，可中断预留不会自动涵盖匹配的实例。启动时必须明确指定预留 ID。

## 将实例启动到可中断预留中
<a name="launch-instances-interruptible"></a>

请按照以下过程将 Amazon EC2 实例启动到您的账户中的可中断容量预留中。

**注意**  
我们建议您仅对可能中断的应用程序使用可中断容量预留。

------
#### [ Console ]

**将实例启动到可中断容量预留中**

1. 打开 Amazon EC2 控制台，网址为 [https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在 Amazon EC2 控制面板中，选择 **Launch Instance (启动实例)**。

1. 配置您的实例设置。

1. 在容量预留的**高级详细信息**中，选择**在您的有效预留中启动可中断实例**。

1. 选择可中断预留 ID 和新的实例购买选项。

1. 选择**启动实例**。

------
#### [ AWS CLI ]

```
aws ec2 run-instances \
--instance-type {{m5.large}} \
--count {{2}} \
--image-id {{ami-12345678}} \
--instance-market-options '{
    "MarketType": "interruptible-capacity-reservation"
}' \
--capacity-reservation-specification '{
    "CapacityReservationTarget": {
        "CapacityReservationId": "{{cr-abcdef1234567890}}"
    }   
}'
```

------

### 使用自动扩缩组启动实例
<a name="launch-with-asg"></a>

您还可以将自动扩缩组与启动模板结合使用来将实例启动到可中断的预留中。为启动模板配置可中断市场类型和预留 ID，然后使用该模板创建自动扩缩组。有关更多信息，请参阅 [Interruptible Capacity Reservations with EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-interruptible-capacity-reservations.html)。

## 中断体验
<a name="interruption-experience"></a>

当所有者回收容量时，您将在实例终止前 2 分钟收到中断通知。此警告来自 EventBridge 事件，让您有时间执行以下操作：
+ 保存所做的工作或检查应用程序
+ 关闭过程
+ 准备终止实例

EventBridge 事件包括有关哪些实例将被终止以及确切终止时间的详细信息。有关更多信息，请参阅 [实例中断警告](monitor-interruptible-cr.md#instance-interruption-warning)。
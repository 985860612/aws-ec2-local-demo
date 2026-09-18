

# Amazon EC2 实例的计划事件
<a name="monitoring-instances-status-check_sched"></a>

为确保基础设施的可靠性和性能，AWS 可以计划事件来重启、停止和停用您的实例。这些事件不会频繁发生。

如果您的一个实例将受某计划事件影响，则 AWS 将使用与您的 AWS 账户关联的电子邮件地址提前通知您。该电子邮件将提供有关该事件的详细信息，包括开始和结束日期。根据事件类型的不同，您也许能够执行操作来控制事件的发生时间。AWS 还会发送 AWS Health 事件，您可以使用 Amazon EventBridge 对该事件进行监控和管理。有关更多信息，请参阅 [Monitoring events in AWS Health with Amazon EventBridge](https://docs.aws.amazon.com/health/latest/ug/cloudwatch-events-health.html)。

计划的事件由 AWS 管理。您无法为实例计划事件。不过，您可以：
+ 查看实例的计划事件。
+ 您可以自定义计划事件通知，以便在电子邮件通知中包含或删除标签。
+ 重新计划某些已计划的事件。
+ 为计划事件创建自定义事件窗口。
+ 在实例按计划重启、停止或停用时执行操作。

为确保您会收到计划事件的通知，请在[账户](https://console.aws.amazon.com/billing/home?#/account)页面上验证您的联系信息。

**注意**  
当实例受计划事件的影响并且它属于自动扩缩组的一部分时，Amazon EC2 Auto Scaling 最终将其替换为其运行状况检查的一部分，您无需采取进一步措施。有关由 Amazon EC2 Auto Scaling 执行的运行状况检查的更多信息，请参阅《*Amazon EC2 Auto Scaling 用户指南*》中的 [Health checks for instances in an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html)。

## 计划的事件类型
<a name="types-of-scheduled-events"></a>

Amazon EC2 可以创建以下类型的计划实例事件，这些事件会在计划的时间发生：


| Event type | 事件代码 | 事件操作 | 
| --- | --- | --- | 
| 实例停止 | instance-stop | 实例将在计划的时间停止。再次启动实例时，实例会迁移至新主机。仅适用于具有 Amazon EBS 根卷的实例。 | 
| 实例指令引退 | instance-retirement | 如果实例具有 Amazon EBS 根卷，则实例将在计划的时间停止；如果实例具有实例存储根卷，则实例将在计划的时间终止。 | 
| 实例重启 | instance-reboot | 实例将在计划的时间重启。实例将保留在主机上，并且主机将在重启期间进行维护。这称为就地重启。 | 
| 系统重启 | system-reboot | 实例将在计划的时间重启并迁移至新的主机。这称为重启迁移。 | 
| 系统维护 | system-maintenance | 实例可能会在计划的时间因网络维护或电源维护而临时受到影响。 | 

## 确定事件类型
<a name="scheduled-event-type"></a>

您可以检查为实例计划的事件类型。

------
#### [ Console ]

**确定事件类型**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Events**。

1. 事件代码会显示在表中的**事件类型**列中。

1. 要对该表进行筛选以仅显示涉及相关实例的事件，请在搜索字段的筛选条件列表中选择**资源类型：实例**。

------
#### [ AWS CLI ]

**确定实例的事件类型**  
使用 [describe-instance-status](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-status.html) 命令。如果实例具有关联的计划事件，则输出会提供有关该计划事件的信息。

```
aws ec2 describe-instance-status \
    --instance-ids {{i-1234567890abcdef0}} \
    --query InstanceStatuses[].Events
```

下面是示例输出。计划的事件代码是 `system-reboot`。

```
[
    "Events": [
        {
            "InstanceEventId": "instance-event-0d59937288b749b32",
            "Code": "system-reboot",
            "Description": "The instance is scheduled for a reboot",
            "NotAfter": "2020-03-14T22:00:00.000Z",
            "NotBefore": "2020-03-14T20:00:00.000Z",
            "NotBeforeDeadline": "2020-04-05T11:00:00.000Z"
        }
    ]
]
```

------
#### [ PowerShell ]

**确定实例的事件类型**  
使用 [Get-EC2InstanceStatus](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceStatus.html) cmdlet。如果实例具有关联的计划事件，则输出会提供有关该计划事件的信息。

```
(Get-EC2InstanceStatus `
    -InstanceId {{i-1234567890abcdef0}}).Events
```

下面是示例输出。计划的事件代码是 `system-reboot`。

```
Code              : system-reboot
Description       : The instance is scheduled for a reboot
InstanceEventId   : instance-event-0d59937288b749b32
NotAfter          : 2020-03-14T22:00:00.000Z
NotBefore         : 2020-03-14T20:00:00.000Z
NotBeforeDeadline : 2020-04-05T11:00:00.000Z
```

------

**Topics**
+ [计划的事件类型](#types-of-scheduled-events)
+ [确定事件类型](#scheduled-event-type)
+ [管理计划停止或停用的 Amazon EC2 实例](schedevents_actions_retire.md)
+ [管理计划重启的 Amazon EC2 实例](schedevents_actions_reboot.md)
+ [管理计划维护的 Amazon EC2 实例](schedevents_actions_maintenance.md)
+ [查看会影响 Amazon EC2 实例的计划事件](viewing_scheduled_events.md)
+ [针对 EC2 实例自定义计划事件通知](customizing_scheduled_event_notifications.md)
+ [重新计划 EC2 实例的计划事件](reschedule-event.md)
+ [为会影响 Amazon EC2 实例的计划事件创建自定义事件窗口](event-windows.md)


# 重新计划 EC2 实例的计划事件
<a name="reschedule-event"></a>

您可以重新安排一个事件，以便它在适合您的特定日期和时间发生。重新计划事件后，可能需要一两分钟才能显示更新后的日期。

**限制**
+ 只有具有事件截止日期的事件才可以重新计划。可以将事件重新计划到事件截止日期之前的日期。**截止期限**列（控制台）和 `NotBeforeDeadline` 字段（AWS CLI）会指示事件的截止日期。
+ 只有尚未开始的事件才可以重新计划。**开始时间**列（控制台）和 `NotBefore` 字段（AWS CLI）会指示事件的开始时间。距离开始时间只剩 5 分钟的计划事件无法改期。
+ 新的事件开始时间离当前时间必须至少有 60 分钟。
+ 如果您使用控制台重新计划多个事件，则事件截止期限由具有最早的事件截止期限的事件决定。

------
#### [ Console ]

**重新安排事件**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Events**。

1. 从筛选器列表中选择 **Resource type: instance (资源类型：实例)**。

1. 选择一个或多个实例，然后依次选择 **Actions (操作)**、**Schedule Event (计划事件)**。

   只有具有事件截止期限（由 **Deadline (截止期限)** 值指示）的事件才可以重新计划。如果某个选定的事件没有截止期限，则会禁用 **Actions (操作)** 下的 **Schedule Event (计划事件)**。

1. 对于 **New start time (新的开始时间)**，为事件输入新的日期和时间。新的日期和时间必须早于 **Event deadline (事件截止期限)**。

1. 选择**保存**。

   更新的事件开始时间可能需要一两分钟才会反映在控制台中。

------
#### [ AWS CLI ]

**重新安排事件**  
使用 [modify-instance-event-start-time](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-event-start-time.html) 命令。

```
aws ec2 modify-instance-event-start-time \
    --instance-id {{i-1234567890abcdef0}} \
    --instance-event-id {{instance-event-0d59937288b749b32}} \
    --not-before {{2020-03-25T10:00:00.000}}
```

------
#### [ PowerShell ]

**重新安排事件**  
使用 [Edit-EC2InstanceEventStartTime](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceEventStartTime.html) cmdlet。

```
Edit-EC2InstanceEventStartTime `
    -InstanceId {{i-1234567890abcdef0}} `
    -InstanceEventId {{instance-event-0d59937288b749b32}} `
    -NotBefore {{2020-03-25T10:00:00.000}}
```

------
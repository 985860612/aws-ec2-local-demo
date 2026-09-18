

# 为会影响 Amazon EC2 实例的计划事件创建自定义事件窗口
<a name="event-windows"></a>

您可以为重新启动、停止或终止 Amazon EC2 实例的计划事件定义自定义事件窗口。您可以将一个或多个实例与事件窗口关联。如果计划了这些实例的计划事件，AWS 将在关联事件窗口中调度事件。

通过指定工作负载在非高峰期间发生的事件窗口，可以使用事件窗口最大化工作负载可用性。您还可以将事件窗口与内部维护计划保持一致。

您可以通过指定一组时间范围来定义事件窗口。最短持续时间为 2 小时。总计组合时间范围必须至少为 4 小时。

您可以使用实例 ID 或实例标签将一个或多个实例与事件窗口相关联。您还可以使用主机 ID 将专属主机与事件窗口相关联。

**警告**  
事件窗口仅适用于停止、重新启动或终止实例的计划事件。  
事件窗口不适用于：  
加速计划事件和网络维护事件。
[自动实例恢复](ec2-instance-recover.md)等非计划维护和非计划重启。

**Topics**
+ [注意事项](#event-windows-considerations)
+ [创建事件窗口](#create-event-windows)
+ [将目标与事件窗口关联](#associate-target-event-window)
+ [取消目标与事件窗口的关联](#disassociate-target-event-window)
+ [修改事件窗口](#modify-event-windows)
+ [删除事件窗口](#delete-event-windows)

## 注意事项
<a name="event-windows-considerations"></a>
+ 所有事件窗口均采用 UTC 时间。
+ 一个事件窗口可以包含多个时间范围。虽然每个范围必须至少为 2 小时，但所有范围的总持续时间必须至少为 4 小时。
+ 一个事件窗口只能关联一个目标类型（实例 ID、专属主机 ID 或实例标签）。
+ 一个目标（实例 ID、专属主机 ID 或实例标签）只能关联一个事件窗口。
+ 一个事件窗口最多可以关联 100 个实例 ID 或 50 个专属主机 ID 或 50 个实例标签。实例标签可以关联任意数量的实例。
+ 每个 AWS 区域最多可以创建 200 个事件窗口。
+ 与事件窗口关联的多个实例可能会同时发生计划的事件。
+ 如果 AWS 已计划事件，修改事件窗口不会更改计划事件的时间。如果事件有截止日期，您可以[重新计划事件](reschedule-event.md)。
+ 您可以在计划事件开始之前停止并启动实例。这会将实例迁移至新主机并清除该事件。

## 创建事件窗口
<a name="create-event-windows"></a>

您可以创建一个或多个事件窗口。对于每个事件窗口，您可以指定一个或多个时间块。例如，您可以创建一个带有时间块的事件窗口，发生于每天凌晨 4 点，持续 2 个小时。或者，您可以创建一个带有时间块的事件窗口，发生于星期日凌晨 2 点至凌晨 4 点以及星期三凌晨 3 点至凌晨 5 点。

事件窗口每周重复出现，直至将其删除。

------
#### [ Console ]

**创建事件窗口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Events**。

1. 选择 **Actions (操作)**，然后选择 **Manage event windows (管理事件窗口)**。

1. 选择 **Create instance event window (创建实例事件窗口)**。

1. 对于 **Event window name (事件窗口名称)**，输入事件窗口的描述性名称。

1. 对于 **Event window schedule (事件窗口时间表)**，选择通过使用 Cron schedule builder（Cron 计划生成器）或指定时间范围来指定事件窗口中的时间块。
   + 如果选择 **Cron schedule builder (Cron 计划生成器)**，请指定以下内容：

     1. 对于 **Days (UTC) (天数(UTC))**，请指定发生事件窗口的具体日期。

     1. 对于 **Start time (UTC) (开始时间(UTC))**，请指定事件窗口开始的时间。

     1. 对于 **Duration (持续时间)**，请指定事件窗口中时间块的持续时间。每个时间块的最短持续时间为 2 小时。事件窗口的最短持续时间总计必须等于或超过 4 小时。所有时间均采用 UTC。
   + 如果选择 **Time ranges (时间范围)**，选择 **Add new time range (添加新时间范围)**，并指定开始以及结束日期和时间。每个时间范围重复此操作。每个时间范围的最短持续时间为 2 小时。所有时间范围总计最小持续时间必须等于或超过 4 小时。

1. （可选）对于**目标详细信息**，将一个或多个实例关联到该事件时段。使用实例 ID 或实例标签来关联实例。使用主机 ID 来关联专属主机。当这些目标列入计划维护时，该事件将在此事件时段内出现。

   请注意，您可以在不将目标与窗口关联的情况下创建事件窗口。稍后，您可以修改窗口以关联一个或多个目标。

1. （可选）对于 **Event window tags (事件窗口标签)**，选择 **Add tag (添加标签)**，然后输入标签键和值。对每个标签重复此操作。

1. 选择 **Create event window (创建事件窗口)**。

------
#### [ AWS CLI ]

**创建有时间范围的事件窗口**  
使用 [create-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-instance-event-window.html) 命令。

```
aws ec2 create-instance-event-window \
    --time-range StartWeekDay={{monday}},StartHour={{2}},EndWeekDay={{wednesday}},EndHour={{8}} \
    --tag-specifications "ResourceType=instance-event-window,Tags=[{Key={{K1}},Value={{V1}}}]" \
    --name {{myEventWindowName}}
```

下面是示例输出。

```
{
    "InstanceEventWindow": {
        "InstanceEventWindowId": "iew-0abcdef1234567890",
        "TimeRanges": [
            {
                "StartWeekDay": "monday",
                "StartHour": 2,
                "EndWeekDay": "wednesday",
                "EndHour": 8
            }
        ],
        "Name": "myEventWindowName",
        "State": "creating",
        "Tags": [
            {
                "Key": "K1",
                "Value": "V1"
            }
        ]
    }
}
```

**创建有 Cron 表达式的事件窗口**  
使用 [create-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-instance-event-window.html) 命令。

```
aws ec2 create-instance-event-window \
    --cron-expression "{{* 21-23 * * 2,3}}" \
    --tag-specifications "ResourceType=instance-event-window,Tags=[{Key={{K1}},Value={{V1}}}]" \
    --name {{myEventWindowName}}
```

下面是示例输出。

```
{
    "InstanceEventWindow": {
        "InstanceEventWindowId": "iew-0abcdef1234567890",
        "Name": "myEventWindowName",
        "CronExpression": "* 21-23 * * 2,3",
        "State": "creating",
        "Tags": [
            {
                "Key": "K1",
                "Value": "V1"
            }
        ]
    }
}
```

------
#### [ PowerShell ]

**创建有时间范围的事件窗口**  
使用 [New-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2InstanceEventWindow.html) cmdlet。

```
$timeRange = New-Object Amazon.EC2.Model.InstanceEventWindowTimeRangeRequest
$timeRange.StartWeekDay = "monday"
$timeRange.EndWeekDay = "wednesday"
$timeRange.StartHour = 2
$timeRange.EndHour = 8
$tag = @{Key="{{key1}}"; Value="{{value1}}"}
$tagspec = New-Object Amazon.EC2.Model.TagSpecification
$tagspec.ResourceType = "instance-event-window"
$tagspec.Tags.Add($tag)
New-EC2InstanceEventWindow `
    -Name {{my-event-window}} `
    -TagSpecification $tagspec `
    -TimeRange @($timeRange)
```

下面是示例输出。

```
AssociationTarget     : 
CronExpression        : 
InstanceEventWindowId : iew-0abcdef1234567890
Name                  : my-event-window
State                 : creating
Tags                  : {key1}
TimeRanges            : {Amazon.EC2.Model.InstanceEventWindowTimeRange}
```

**创建有 Cron 表达式的事件窗口**  
使用 [New-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2InstanceEventWindow.html) cmdlet。

```
$tag = @{Key="{{key1}}"; Value="{{value1}}"}
$tagspec = New-Object Amazon.EC2.Model.TagSpecification
$tagspec.ResourceType = "instance-event-window"
$tagspec.Tags.Add($tag)
New-EC2InstanceEventWindow `
    -Name {{my-event-window}} `
    -TagSpecification $tagspec`
    -CronExpression "{{* 21-23 * * 2,3}}"
```

下面是示例输出。

```
AssociationTarget     : 
CronExpression        : * 21-23 * * 2,3
InstanceEventWindowId : iew-0abcdef1234567890
Name                  : my-event-window
State                 : creating
Tags                  : {key1}
TimeRanges            : {}
```

------

## 将目标与事件窗口关联
<a name="associate-target-event-window"></a>

创建事件窗口后，您可以将目标与事件窗口相关联。一个事件窗口只能关联一个目标类型。您可以指定实例 ID、专属主机 ID 或实例标签。

------
#### [ Console ]

**将目标与事件窗口相关联**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Events**。

1. 选择要修改的事件窗口。

1. 选择**操作**、**修改实例事件窗口**。

------
#### [ AWS CLI ]

**将实例标签与事件窗口相关联**  
使用 [associate-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference/ec2/associate-instance-event-window.html) 命令。

```
aws ec2 associate-instance-event-window \
    --instance-event-window-id {{iew-0abcdef1234567890}} \
    --association-target "InstanceTags=[{Key={{k2}},Value={{v2}}},{Key={{k1}},Value={{v1}}}]"
```

下面是示例输出。

```
{
    "InstanceEventWindow": {
        "InstanceEventWindowId": "iew-0abcdef1234567890",
        "Name": "myEventWindowName",
        "CronExpression": "* 21-23 * * 2,3",
        "AssociationTarget": {
            "InstanceIds": [],
            "Tags": [
                {
                    "Key": "k2",
                    "Value": "v2"
                },
                {
                    "Key": "k1",
                    "Value": "v1"
                }
            ],
            "DedicatedHostIds": []
        },
        "State": "creating"
    }
}
```

**将实例 ID 与事件窗口相关联**  
使用 [associate-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference/ec2/associate-instance-event-window.html) 命令。

```
aws ec2 associate-instance-event-window \
    --instance-event-window-id {{iew-0abcdef1234567890}} \
    --association-target "InstanceIds={{i-1234567890abcdef0}},{{i-0598c7d356eba48d7}}"
```

下面是示例输出。

```
{
    "InstanceEventWindow": {
        "InstanceEventWindowId": "iew-0abcdef1234567890",
        "Name": "myEventWindowName",
        "CronExpression": "* 21-23 * * 2,3",
        "AssociationTarget": {
            "InstanceIds": [
                "i-1234567890abcdef0",
                "i-0598c7d356eba48d7"
            ],
            "Tags": [],
            "DedicatedHostIds": []
        },
        "State": "creating"
    }
}
```

**将专属主机与事件窗口相关联**  
使用 [associate-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference/ec2/associate-instance-event-window.html) 命令。

```
aws ec2 associate-instance-event-window \
    --instance-event-window-id {{iew-0abcdef1234567890}} \
    --association-target "DedicatedHostIds={{h-029fa35a02b99801d}}"
```

下面是示例输出。

```
{
    "InstanceEventWindow": {
        "InstanceEventWindowId": "iew-0abcdef1234567890",
        "Name": "myEventWindowName",
        "CronExpression": "* 21-23 * * 2,3",
        "AssociationTarget": {
            "InstanceIds": [],
            "Tags": [],
            "DedicatedHostIds": [
                "h-029fa35a02b99801d"
            ]
        },
        "State": "creating"
    }
}
```

------
#### [ PowerShell ]

**将实例标签与事件窗口相关联**  
使用 [Register-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2InstanceEventWindow.html) cmdlet。

```
$tag1 = @{Key="key1"; Value="value1"}
$tag2 = @{Key="key2"; Value="value2"}
Register-EC2InstanceEventWindow `
    -InstanceEventWindowId {{iew-0abcdef1234567890}} `
    -AssociationTarget_InstanceTag @($tag1,$tag2)
```

**将实例 ID 与事件窗口相关联**  
使用 [Register-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2InstanceEventWindow.html) cmdlet。

```
Register-EC2InstanceEventWindow `
    -InstanceEventWindowId {{iew-0abcdef1234567890}} `
    -AssociationTarget_InstanceId {{i-1234567890abcdef0}}, {{i-0598c7d356eba48d7}}
```

**将专属主机与事件窗口相关联**  
使用 [Register-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2InstanceEventWindow.html) cmdlet。

```
Register-EC2InstanceEventWindow `
    -InstanceEventWindowId {{iew-0abcdef1234567890}} `
    -AssociationTarget_DedicatedHostId {{h-029fa35a02b99801d}}
```

------

## 取消目标与事件窗口的关联
<a name="disassociate-target-event-window"></a>

------
#### [ Console ]

**取消目标与事件窗口的关联**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Events**。

1. 选择要修改的事件窗口。

1. 选择**操作**、**修改实例事件窗口**。

------
#### [ AWS CLI ]

**取消实例标签与事件窗口的关联**  
使用[disassociate-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference//ec2/disassociate-instance-event-window.html) 命令。

```
aws ec2 disassociate-instance-event-window \
    --instance-event-window-id {{iew-0abcdef1234567890}} \
    --association-target "InstanceTags=[{Key={{k2}},Value={{v2}}},{Key={{k1}},Value={{v1}}}]"
```

下面是示例输出。

```
{
    "InstanceEventWindow": {
        "InstanceEventWindowId": "iew-0abcdef1234567890",
        "Name": "myEventWindowName",
        "CronExpression": "* 21-23 * * 2,3",
        "AssociationTarget": {
            "InstanceIds": [],
            "Tags": [],
            "DedicatedHostIds": []
        },
        "State": "creating"
    }
}
```

**取消实例 ID 与事件窗口的关联**  
使用[disassociate-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference/ec2/disassociate-instance-event-window.html) 命令。

```
aws ec2 disassociate-instance-event-window \
    --instance-event-window-id {{iew-0abcdef1234567890}} \
    --association-target "InstanceIds={{i-1234567890abcdef0}},{{i-0598c7d356eba48d7}}"
```

下面是示例输出。

```
{
    "InstanceEventWindow": {
        "InstanceEventWindowId": "iew-0abcdef1234567890",
        "Name": "myEventWindowName",
        "CronExpression": "* 21-23 * * 2,3",
        "AssociationTarget": {
            "InstanceIds": [],
            "Tags": [],
            "DedicatedHostIds": []
        },
        "State": "creating"
    }
}
```

**取消专属主机与事件窗口的关联**  
使用[disassociate-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference/ec2/disassociate-instance-event-window.html) 命令。

```
aws ec2 disassociate-instance-event-window \
    --instance-event-window-id {{iew-0abcdef1234567890}} \
    --association-target DedicatedHostIds={{h-029fa35a02b99801d}}
```

下面是示例输出。

```
{
    "InstanceEventWindow": {
        "InstanceEventWindowId": "iew-0abcdef1234567890",
        "Name": "myEventWindowName",
        "CronExpression": "* 21-23 * * 2,3",
        "AssociationTarget": {
            "InstanceIds": [],
            "Tags": [],
            "DedicatedHostIds": []
        },
        "State": "creating"
    }
}
```

------
#### [ PowerShell ]

**取消实例标签与事件窗口的关联**  
使用 [Unregister-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2InstanceEventWindow.html) cmdlet。

```
$tag1 = @{Key="key1"; Value="value1"}
$tag2 = @{Key="key2"; Value="value2"}
Unregister-EC2InstanceEventWindow `
    -InstanceEventWindowId {{iew-0abcdef1234567890}} `
    -AssociationTarget_InstanceTag @($tag1, $tag2)
```

**取消实例 ID 与事件窗口的关联**  
使用 [Unregister-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2InstanceEventWindow.html) cmdlet。

```
Unregister-EC2InstanceEventWindow `
    -InstanceEventWindowId {{iew-0abcdef1234567890}} `
    -AssociationTarget_InstanceId {{i-1234567890abcdef0}}, {{i-0598c7d356eba48d7}}
```

**取消专属主机与事件窗口的关联**  
使用 [Unregister-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2InstanceEventWindow.html) cmdlet。

```
Unregister-EC2InstanceEventWindow `
    -InstanceEventWindowId {{iew-0abcdef1234567890}} `
    -AssociationTarget_DedicatedHostId {{h-029fa35a02b99801d}}
```

------

## 修改事件窗口
<a name="modify-event-windows"></a>

您可以修改事件窗口中除 ID 之外的所有字段。例如，夏令时开始时，您可能需要修改事件窗口计划。对于现有事件窗口，您可能需要添加或移除目标。

您可以在修改事件窗口时修改时间范围或 Cron 表达式，但不能同时修改两者。

------
#### [ Console ]

**修改事件窗口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Events**。

1. 选择 **Actions (操作)**，然后选择 **Manage event windows (管理事件窗口)**。

1. 选择要修改的事件窗口，然后选择 **Actions (操作)**、**Modify instance event window (修改实例事件窗口)**。

1. 在事件窗口中修改字段，然后选择 **Modify event window (修改事件窗口)**。

------
#### [ AWS CLI ]

**修改事件窗口的时间范围**  
使用 [modify-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-event-window.html) 命令。

```
aws ec2 modify-instance-event-window 
    --instance-event-window-id {{iew-0abcdef1234567890}} \
    --time-range StartWeekDay={{monday}},StartHour={{2}},EndWeekDay={{wednesday}},EndHour={{8}}
```

下面是示例输出。

```
{
    "InstanceEventWindow": {
        "InstanceEventWindowId": "iew-0abcdef1234567890",
        "TimeRanges": [
            {
                "StartWeekDay": "monday",
                "StartHour": 2,
                "EndWeekDay": "wednesday",
                "EndHour": 8
            }
        ],
        "Name": "myEventWindowName",
        "AssociationTarget": {
            "InstanceIds": [
                "i-0abcdef1234567890",
                "i-0be35f9acb8ba01f0"
            ],
            "Tags": [],
            "DedicatedHostIds": []
        },
        "State": "creating",
        "Tags": [
            {
                "Key": "K1",
                "Value": "V1"
            }
        ]
    }
}
```

**修改事件窗口的一组时间范围**  
使用 [modify-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-event-window.html) 命令。

```
aws ec2 modify-instance-event-window 
    --instance-event-window-id {{iew-0abcdef1234567890}} \
    --time-range '[{"StartWeekDay": "{{monday}}", "StartHour": {{2}}, "EndWeekDay": "{{wednesday}}", "EndHour": {{8}}},
	  {"StartWeekDay": "{{thursday}}", "StartHour": {{2}}, "EndWeekDay": "{{friday}}", "EndHour": {{8}}}]'
```

下面是示例输出。

```
{
    "InstanceEventWindow": {
        "InstanceEventWindowId": "iew-0abcdef1234567890",
        "TimeRanges": [
            {
                "StartWeekDay": "monday",
                "StartHour": 2,
                "EndWeekDay": "wednesday",
                "EndHour": 8
            },
            {
                "StartWeekDay": "thursday",
                "StartHour": 2,
                "EndWeekDay": "friday",
                "EndHour": 8
            }
        ],
        "Name": "myEventWindowName",
        "AssociationTarget": {
            "InstanceIds": [
                "i-0abcdef1234567890",
                "i-0be35f9acb8ba01f0"
            ],
            "Tags": [],
            "DedicatedHostIds": []
        },
        "State": "creating",
        "Tags": [
            {
                "Key": "K1",
                "Value": "V1"
            }
        ]
    }
}
```

**修改事件窗口的 Cron 表达式**  
使用 [modify-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-event-window.html) 命令。

```
aws ec2 modify-instance-event-window 
    --instance-event-window-id {{iew-0abcdef1234567890}} \
    --cron-expression "{{* 21-23 * * 2,3}}"
```

下面是示例输出。

```
{
    "InstanceEventWindow": {
        "InstanceEventWindowId": "iew-0abcdef1234567890",
        "Name": "myEventWindowName",
        "CronExpression": "* 21-23 * * 2,3",
        "AssociationTarget": {
            "InstanceIds": [
                "i-0abcdef1234567890",
                "i-0be35f9acb8ba01f0"
            ],
            "Tags": [],
            "DedicatedHostIds": []
        },
        "State": "creating",
        "Tags": [
            {
                "Key": "K1",
                "Value": "V1"
            }
        ]
    }
}
```

------
#### [ PowerShell ]

**修改事件窗口的时间范围**  
使用 [Edit-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceEventWindow.html) cmdlet。

```
$timeRange1 = New-Object Amazon.EC2.Model.InstanceEventWindowTimeRangeRequest
$timeRange1.StartWeekDay = "monday"
$timeRange1.EndWeekDay = "wednesday"
$timeRange1.StartHour = 2
$timeRange1.EndHour = 8
$timeRange2 = New-Object Amazon.EC2.Model.InstanceEventWindowTimeRangeRequest
$timeRange2.StartWeekDay = "thursday"
$timeRange2.EndWeekDay = "friday"
$timeRange2.StartHour = 1
$timeRange2.EndHour = 6
Edit-EC2InstanceEventWindow `
    -InstanceEventWindowId {{iew-0abcdef1234567890}} `
    -TimeRange @($timeRange1, $timeRange2)
```

**修改事件窗口的 Cron 表达式**  
使用 [Edit-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceEventWindow.html) cmdlet。

```
Edit-EC2InstanceEventWindow `
    -InstanceEventWindowId {{iew-0abcdef1234567890}} `
    -CronExpression "{{* 21-23 * * 2,3}}"
```

------

## 删除事件窗口
<a name="delete-event-windows"></a>

您可以一次删除一个事件窗口。

------
#### [ Console ]

**删除事件窗口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Events**。

1. 选择 **Actions (操作)**，然后选择 **Manage event windows (管理事件窗口)**。

1. 选择要删除的事件窗口，然后选择 **Actions (操作)**、**Delete instance event window (删除实例事件窗口)**。

1. 当系统提示时，输入 **delete**，然后选择**删除**。

------
#### [ AWS CLI ]

**删除事件窗口**  
使用 [delete-instance-event-window](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-instance-event-window.html) 命令并指定要删除的事件窗口。

```
aws ec2 delete-instance-event-window \
    --instance-event-window-id {{iew-0abcdef1234567890}}
```

**强制删除事件时段**  
使用 `--force-delete` 参数（如果事件窗口当前与目标相关联）。

```
aws ec2 delete-instance-event-window \
    --instance-event-window-id {{iew-0abcdef1234567890}} \
    --force-delete
```

------
#### [ PowerShell ]

**删除事件窗口**  
使用 [Remove-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2InstanceEventWindow.html) cmdlet。

```
Remove-EC2InstanceEventWindow `
    -InstanceEventWindowId {{iew-0abcdef1234567890}}
```

**强制删除事件时段**  
使用 [Remove-EC2InstanceEventWindow](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2InstanceEventWindow.html) cmdlet。

```
Remove-EC2InstanceEventWindow `
    -InstanceEventWindowId {{iew-0abcdef1234567890}} `
    -ForceDelete $true
```

------
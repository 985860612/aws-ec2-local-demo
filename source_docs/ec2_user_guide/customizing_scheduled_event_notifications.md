

# 针对 EC2 实例自定义计划事件通知
<a name="customizing_scheduled_event_notifications"></a>

您可以自定义计划事件通知，以便在电子邮件通知中包含标签。这样就可以更轻松地识别受影响的资源（实例或 专用主机），并为即将到来的事件确定操作的优先级。

当您自定义事件通知以包含标签时，您可以选择包括：
+ 与受影响资源关联的所有标签
+ 仅限与受影响资源关联的特定标签

例如，假设您为所有实例分配 `application`、`costcenter`、`project` 和 `owner` 标签。您可以选择在事件通知中包含所有标签。或者，如果您只想在事件通知中查看 `owner` 和 `project` 标签，则可以选择仅包含这些标签。

选择要包含的标签后，事件通知将包含与受影响资源关联的资源 ID（实例 ID 或专用主机 ID）以及标签键/值对。

**Topics**
+ [在事件通知中包含标签](#register-tags)
+ [从事件通知中删除标签](#deregister-tags)
+ [查看要包含在事件通知中的标签](#view-tags)

## 在事件通知中包含标签
<a name="register-tags"></a>

您选择包含的标签将应用于选定区域中的所有资源（实例和 专用主机）。要自定义其他区域中的事件通知，请首先选择所需的区域，然后执行以下步骤。

------
#### [ Console ]

**在事件通知中包含标签**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Events**。

1. 选择**操作**、**Manage event notifications (管理事件通知)**。

1. 启用**在事件通知中包含标签**。

1. 根据要包含在事件通知中的标签，执行以下操作之一：
   + 要包含与受影响实例或专属主机关联的所有标签，请选择**包含所有标签**。
   + 要选择要包含的标签，请选择**选择要包含的标签**，然后选择或输入标签键。

1. 选择**保存**。

------
#### [ AWS CLI ]

**在事件通知中包含所有标签**  
使用 [register-instance-event-notification-attributes](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-instance-event-notification-attributes.html) 命令，并将 `IncludeAllTagsOfInstance` 参数设置为 `true`。

```
aws ec2 register-instance-event-notification-attributes \
    --instance-tag-attribute "IncludeAllTagsOfInstance=true"
```

**在事件通知中包含特定标签**  
使用 [register-instance-event-notification-attributes](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-instance-event-notification-attributes.html) 命令，并使用 `InstanceTagKeys` 参数指定要包含的标签。

```
aws ec2 register-instance-event-notification-attributes \
    --instance-tag-attribute 'InstanceTagKeys=["{{tag_key_1}}", "{{tag_key_2}}", "{{tag_key_3}}"]'
```

------
#### [ PowerShell ]

**在事件通知中包含所有标签**  
使用 [Register-EC2InstanceEventNotificationAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2InstanceEventNotificationAttribute.html) cmdlet。

```
Register-EC2InstanceEventNotificationAttribute `
    -InstanceTagAttribute_IncludeAllTagsOfInstance $true
```

**在事件通知中包含特定标签**  
使用 [Register-EC2InstanceEventNotificationAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2InstanceEventNotificationAttribute.html) cmdlet。

```
Register-EC2InstanceEventNotificationAttribute `
    -InstanceTagAttribute_InstanceTagKey {{tag_key_1}}, {{tag_key_2}}, {{tag_key_3}}
```

------

## 从事件通知中删除标签
<a name="deregister-tags"></a>

您可以从事件通知中删除标签。

------
#### [ Console ]

**从事件通知中删除标签**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Events**。

1. 选择**操作**、**Manage event notifications (管理事件通知)**。

1. 要从事件通知中删除所有标签，请关闭**在事件通知中包含标签**。

1. 要从事件通知中删除特定标签，请为相应的标签键选择 **X**)。

1. 选择**保存**。

------
#### [ AWS CLI ]

**从事件通知中删除所有标签**  
使用 [deregister-instance-event-notification-attributes](https://docs.aws.amazon.com/cli/latest/reference/ec2/deregister-instance-event-notification-attributes.html) 命令，并将 `IncludeAllTagsOfInstance` 参数设置为 `false`。

```
aws ec2 deregister-instance-event-notification-attributes \
    --instance-tag-attribute "IncludeAllTagsOfInstance=false"
```

**从事件通知中删除标签**  
使用 [deregister-instance-event-notification-attributes](https://docs.aws.amazon.com/cli/latest/reference/ec2/deregister-instance-event-notification-attributes.html) 命令，并使用 `InstanceTagKeys` 参数指定要删除的标签。

```
aws ec2 deregister-instance-event-notification-attributes \
    --instance-tag-attribute 'InstanceTagKeys=["{{tag_key_3}}"]'
```

------
#### [ PowerShell ]

**从事件通知中删除所有标签**  
使用 [Unregister-EC2InstanceEventNotificationAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2InstanceEventNotificationAttribute.html) cmdlet。

```
Unregister-EC2InstanceEventNotificationAttribute `
    -InstanceTagAttribute_IncludeAllTagsOfInstance $false
```

**从事件通知中删除标签**  
使用 [Unregister-EC2InstanceEventNotificationAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2InstanceEventNotificationAttribute.html) cmdlet。

```
Unregister-EC2InstanceEventNotificationAttribute `
    -InstanceTagAttribute_InstanceTagKey {{tag_key_3}}
```

------

## 查看要包含在事件通知中的标签
<a name="view-tags"></a>

您可以查看要包含在事件通知中的标签。

------
#### [ Console ]

**查看要包含在事件通知中的标签**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Events**。

1. 选择**操作**、**Manage event notifications (管理事件通知)**。

------
#### [ AWS CLI ]

**查看要包含在事件通知中的标签**  
使用 [describe-instance-event-notification-attributes](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-event-notification-attributes.html) 命令。

```
aws ec2 describe-instance-event-notification-attributes
```

------
#### [ PowerShell ]

**查看要包含在事件通知中的标签**  
使用 [Get-EC2InstanceEventNotificationAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceEventNotificationAttribute.html) cmdlet。

```
Get-EC2InstanceEventNotificationAttribute
```

------
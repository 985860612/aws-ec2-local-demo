

# 查看会影响 Amazon EC2 实例的计划事件
<a name="viewing_scheduled_events"></a>

除了通过电子邮件接收计划事件的通知外，您还可以查看计划的事件。

------
#### [ Console ]

**查看实例的计划事件**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 控制面板的**计划的事件**下将显示与事件关联的所有资源。  
![使用控制面板查看事件。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/dashboard-scheduled-events.png)

1. 有关更多详细信息，在导航窗格中，选择**事件**。将显示与事件关联的所有资源。您可以按事件类型、资源类型和可用区等特征进行筛选。  
![使用“Events”页查看事件。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/events-instance-scheduled-stop.png)

------
#### [ AWS CLI ]

**查看实例的计划事件**  
使用 [describe-instance-status](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-status.html) 命令。

```
aws ec2 describe-instance-status \
    --instance-ids {{i-1234567890abcdef0}} \
    --query "InstanceStatuses[].Events"
```

以下示例输出显示重启事件：

```
[
    "Events": [
        {
            "InstanceEventId": "instance-event-0d59937288b749b32",
            "Code": "system-reboot",
            "Description": "The instance is scheduled for a reboot",
            "NotAfter": "2019-03-15T22:00:00.000Z",
            "NotBefore": "2019-03-14T20:00:00.000Z",
            "NotBeforeDeadline": "2019-04-05T11:00:00.000Z"
         }

    ]
]
```

以下示例输出显示实例停用事件。

```
[
    "Events": [
        {
            "InstanceEventId": "instance-event-0e439355b779n26",                        
            "Code": "instance-stop",
            "Description": "The instance is running on degraded hardware",
            "NotBefore": "2015-05-23T00:00:00.000Z"
        }
    ]
]
```

------
#### [ PowerShell ]

**查看实例的计划事件**  
使用以下 [Get-EC2InstanceStatus](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceStatus.html) 命令。

```
(Get-EC2InstanceStatus -InstanceId {{i-1234567890abcdef0}}).Events
```

以下示例输出显示实例停用事件。

```
Code         : instance-stop
Description  : The instance is running on degraded hardware
NotBefore    : 5/23/2015 12:00:00 AM
```

------
#### [ Instance metadata ]

**使用实例元数据查看实例的计划事件**  
您可以使用实例元数据服务版本 2 或实例元数据服务版本 1 从[实例元数据](ec2-instance-metadata.md)中检索有关实例的活动维护事件的信息。

**IMDSv2**

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/events/maintenance/scheduled
```

**IMDSv1**

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/events/maintenance/scheduled
```

以下是 JSON 格式的计划系统重启事件信息的示例输出。

```
[ 
  {
    "NotBefore" : "21 Jan 2019 09:00:43 GMT",
    "Code" : "system-reboot",
    "Description" : "scheduled reboot",
    "EventId" : "instance-event-0d59937288b749b32",
    "NotAfter" : "21 Jan 2019 09:17:23 GMT",
    "State" : "active"
  } 
]
```

**使用实例元数据查看有关实例的已完成或已取消事件的事件历史记录**  
您可以使用实例元数据服务版本 2 或实例元数据服务版本 1 从[实例元数据](ec2-instance-metadata.md)中检索有关已完成或已取消的事件的信息。

**IMDSv2**

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/events/maintenance/history
```

**IMDSv1**

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/events/maintenance/history
```

以下是 JSON 格式的已取消和已完成系统重启事件相关信息的示例输出。

```
[ 
  {
    "NotBefore" : "21 Jan 2019 09:00:43 GMT",
    "Code" : "system-reboot",
    "Description" : "[Canceled] scheduled reboot",
    "EventId" : "instance-event-0d59937288b749b32",
    "NotAfter" : "21 Jan 2019 09:17:23 GMT",
    "State" : "canceled"
  }, 
  {
    "NotBefore" : "29 Jan 2019 09:00:43 GMT",
    "Code" : "system-reboot",
    "Description" : "[Completed] scheduled reboot",
    "EventId" : "instance-event-0d59937288b749b32",
    "NotAfter" : "29 Jan 2019 09:17:23 GMT",
    "State" : "completed"
  }
]
```

------
#### [ AWS Health ]

您可以使用 AWS Health Dashboard 了解可能影响您的实例的事件。Health Dashboard 会分三组管理问题：未处理问题、已计划更改和其他通知。已计划更改组包含正在进行或即将进行的项目。

有关更多信息，请参阅 *AWS Health 用户指南*中的[开始使用 AWS Health Dashboard](https://docs.aws.amazon.com/health/latest/ug/getting-started-health-dashboard.html)。

------
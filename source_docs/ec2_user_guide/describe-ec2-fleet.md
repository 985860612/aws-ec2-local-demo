

# 描述 EC2 实例集、其实例及其事件
<a name="describe-ec2-fleet"></a>

您可以描述 EC2 机群配置、EC2 机群中的实例，以及 EC2 机群的历史事件。

**Topics**
+ [描述 EC2 机群](#describe-all-ec2-fleets)
+ [描述 EC2 实例集中的所有实例](#describe-instances-in-ec2-fleet)
+ [描述 EC2 实例集的事件历史记录](#describe-ec2-fleet-event-history)

## 描述 EC2 机群
<a name="describe-all-ec2-fleets"></a>

------
#### [ AWS CLI ]

**描述 EC2 实例集**  
使用 [describe-fleets](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-fleets.html) 命令。

```
aws ec2 describe-fleets \
    --fleet-ids {{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}
```

下面是示例输出。

```
{
    "Fleets": [
        {
            "ActivityStatus": "fulfilled",
            "CreateTime": "2022-02-09T03:35:52+00:00",
            "FleetId": "fleet-364457cd-3a7a-4ed9-83d0-7b63e51bb1b7",
            "FleetState": "active",
            "ExcessCapacityTerminationPolicy": "termination",
            "FulfilledCapacity": 2.0,
            "FulfilledOnDemandCapacity": 0.0,
            "LaunchTemplateConfigs": [
                {
                    "LaunchTemplateSpecification": {
                        "LaunchTemplateName": "my-launch-template",
                        "Version": "$Latest"
                    }
                }
            ],
            "TargetCapacitySpecification": {
                "TotalTargetCapacity": 2,
                "OnDemandTargetCapacity": 0,
                "SpotTargetCapacity": 2,
                "DefaultTargetCapacityType": "spot"
            },
            "TerminateInstancesWithExpiration": false,
            "Type": "maintain",
            "ReplaceUnhealthyInstances": false,
            "SpotOptions": {
                "AllocationStrategy": "capacity-optimized",
                "InstanceInterruptionBehavior": "terminate"
            },
            "OnDemandOptions": {
                "AllocationStrategy": "lowestPrice"
            }
        }
    ]
}
```

------
#### [ PowerShell ]

**描述 EC2 实例集**  
使用 [Get-EC2FleetList](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2FleetList.html) cmdlet。

```
Get-EC2FleetList `
    -FleetId {{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}
```

------

## 描述 EC2 实例集中的所有实例
<a name="describe-instances-in-ec2-fleet"></a>

正在运行的实例的返回列表将定期刷新，或可能过时。

------
#### [ AWS CLI ]

**描述指定 EC2 实例集中的实例**  
使用 [describe-fleet-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-fleet-instances.html) 命令。

```
aws ec2 describe-fleet-instances \
    --fleet-id {{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}
```

下面是示例输出。

```
{
    "ActiveInstances": [
        {
            "InstanceId": "i-09cd595998cb3765e", 
            "InstanceHealth": "healthy", 
            "InstanceType": "m4.large", 
            "SpotInstanceRequestId": "sir-86k84j6p"
        }, 
        {
            "InstanceId": "i-09cf95167ca219f17", 
            "InstanceHealth": "healthy", 
            "InstanceType": "m4.large", 
            "SpotInstanceRequestId": "sir-dvxi7fsm"
        }
    ], 
    "FleetId": "fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE"
}
```

------
#### [ PowerShell ]

**描述指定 EC2 实例集中的实例**  
使用 [Get-EC2FleetInstanceList](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2FleetInstanceList.html) cmdlet。

```
Get-EC2FleetInstanceList `
    -FleetId {{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}
```

------

## 描述 EC2 实例集的事件历史记录
<a name="describe-ec2-fleet-event-history"></a>

有关事件历史记录中事件的更多信息，请参阅[EC2 队列 事件类型](monitor-ec2-fleet-using-eventbridge.md#ec2-fleet-event-types)。

------
#### [ AWS CLI ]

**描述指定 EC2 实例集的事件**  
使用 [describe-fleet-history](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-fleet-history.html) 命令。

```
aws ec2 describe-fleet-history \
    --fleet-id {{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}} \
    --start-time {{2020-06-01T00:00:00Z}}
```

下面是示例输出。

```
{
    "HistoryRecords": [
        {
            "EventInformation": {
                "EventSubType": "submitted"
            },
            "EventType": "fleetRequestChange",
            "Timestamp": "2020-09-01T18:26:05.000Z"
        },
        {
            "EventInformation": {
                "EventSubType": "active"
            },
            "EventType": "fleetRequestChange",
            "Timestamp": "2020-09-01T18:26:15.000Z"
        },
        {
            "EventInformation": {
                "EventDescription": "t2.small, ami-07c8bc5c1ce9598c3, ...",
                "EventSubType": "progress"
            },
            "EventType": "fleetRequestChange",
            "Timestamp": "2020-09-01T18:26:17.000Z"
        },
        {
            "EventInformation": {
                "EventDescription": "{\"instanceType\":\"t2.small\", ...}",
                "EventSubType": "launched",
                "InstanceId": "i-083a1c446e66085d2"
            },
            "EventType": "instanceChange",
            "Timestamp": "2020-09-01T18:26:17.000Z"
        },
        {
            "EventInformation": {
                "EventDescription": "{\"instanceType\":\"t2.small\", ...}",
                "EventSubType": "launched",
                "InstanceId": "i-090db02406cc3c2d6"
            },
            "EventType": "instanceChange",
            "Timestamp": "2020-09-01T18:26:17.000Z"
        }
    ], 
    "FleetId": "fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE", 
    "LastEvaluatedTime": "1970-01-01T00:00:00.000Z", 
    "StartTime": "2020-06-01T00:00:00.000Z"
}
```

------
#### [ PowerShell ]

**描述指定 EC2 实例集的事件**  
使用 [Get-EC2FleetHistory](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2FleetHistory.html) cmdlet。

```
Get-EC2FleetHistory `
    -FleetId {{fleet-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}} `
    -UtcStartTime {{2020-06-01T00:00:00Z}}
```

------
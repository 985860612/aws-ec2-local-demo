

# 查看容量预留的状态
<a name="capacity-reservations-view"></a>

Amazon EC2 会持续监控容量预留状态。

由于 Amazon EC2 API 遵循[最终一致性](https://docs.aws.amazon.com/ec2/latest/devguide/eventual-consistency.html)模型，创建容量预留后，最多可能需要 5 分钟来表明容量预留处于 `active` 状态。在此期间，容量预留可能会保持 `pending` 状态。但是，容量预留可能已经可供使用，在这种情况下，如果您尝试在其中启动实例，将会成功。

------
#### [ Console ]

**查看容量预留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 选择容量预留。

------
#### [ AWS CLI ]

**描述容量预留**  
使用 [describe-capacity-reservations](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservations.html) 命令。

例如，以下命令会描述所有容量预留。

```
aws ec2 describe-capacity-reservations
```

下面是示例输出。

```
{
    "CapacityReservations": [
        {
            "CapacityReservationId": "cr-1234abcd56EXAMPLE",
            "EndDateType": "unlimited",
            "AvailabilityZone": "eu-west-1a",
            "InstanceMatchCriteria": "open",
            "Tags": [],
            "EphemeralStorage": false,
            "CreateDate": "2019-08-16T09:03:18.000Z",
            "AvailableInstanceCount": 1,
            "InstancePlatform": "Linux/UNIX",
            "TotalInstanceCount": 1,
            "State": "active",
            "Tenancy": "default",
            "EbsOptimized": true,
            "InstanceType": "a1.medium",
            "PlacementGroupArn": "arn:aws:ec2:us-east-1:123456789012:placement-group/MyPG"
        },
        {
            "CapacityReservationId": "cr-abcdEXAMPLE9876ef",
            "EndDateType": "unlimited",
            "AvailabilityZone": "eu-west-1a",
            "InstanceMatchCriteria": "open",
            "Tags": [],
            "EphemeralStorage": false,
            "CreateDate": "2019-08-07T11:34:19.000Z",
            "AvailableInstanceCount": 3,
            "InstancePlatform": "Linux/UNIX",
            "TotalInstanceCount": 3,
            "State": "cancelled",
            "Tenancy": "default",
            "EbsOptimized": true,
            "InstanceType": "m5.large"
        }
    ]
}
```

------
#### [ PowerShell ]

**删除容量预留**  
使用 [Get-EC2CapacityReservation](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2CapacityReservation.html) cmdlet。

```
Get-EC2CapacityReservation `
    -CapacityReservationId {{cr-1234abcd56EXAMPLE}}
```

------

## 容量预留状态
<a name="capacity-reseration-states"></a>

容量预留可能具有以下几种状态。


| 州 | 说明 | 
| --- | --- | 
| active |  容量可供使用。 | 
| expired | 容量预留已在您预留请求中指定的日期和时间自动到期。预留容量不再可供您使用。 | 
| cancelled | 容量预留已取消。预留容量不再可供您使用。 | 
| pending | 容量预留请求已成功，但容量预置仍待处理。 | 
| failed | 容量预留请求失败。请求可能由于无效的请求参数、容量限制或实例限制等约束条件失败。您可以查看 60 分钟内的失败请求。 | 
| scheduled | （仅限未来日期的容量预留）未来日期的容量预留请求已获批准，并且容量预留计划于请求的开始日期交付。 | 
| assessing | （仅限未来日期的容量预留）Amazon EC2 正在评估您对未来日期的容量预留的请求。有关更多信息，请参阅 [未来日期的容量预留评估](cr-concepts.md#cr-future-dated-assessment)。 | 
| delayed | （仅限未来日期的容量预留）Amazon EC2 在预置请求的未来日期的容量预留时遇到延迟。Amazon EC2 无法在请求的开始日期和时间之前提供请求的容量。 | 
| unsupported | （仅限未来日期的容量预留）由于容量限制，Amazon EC2 无法支持未来日期的容量预留请求。您可以查看 30 天内不受支持的请求。将不会交付容量预留。 | 
| cancelling | （仅限未来日期的容量预留）容量预留正在取消。容量已经释放，但费用将持续到缩短的承诺期结束。承诺结束时，容量预留将过渡到 cancelled。有关更多信息，请参阅 [取消费用](capacity-reservations-release.md#cr-cancellation-charges)。 | 
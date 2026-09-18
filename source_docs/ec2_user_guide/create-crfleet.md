

# 创建容量预留实例集
<a name="create-crfleet"></a>

当您创建容量预留实例集时，它会自动为实例集请求中指定的实例类型创建容量预留，最多可达到指定的总目标容量。容量预留实例集为其预留容量的实例数取决于总目标容量和您在请求中指定的实例类型权重。有关更多信息，请参阅 [实例类型权重](crfleet-concepts.md#instance-weight) 和 [总目标容量](crfleet-concepts.md#target-capacity)。

创建实例集时，您必须指定要使用的实例类型以及每种实例类型的优先级。有关更多信息，请参阅 [分配策略](crfleet-concepts.md#allocation-strategy) 和 [实例类型优先级](crfleet-concepts.md#instance-priority)。

**注意**  
**Amazon Web Services ServiceRoleForEC2CapacityReservationFleet** 服务相关角色在您首次创建容量预留实例集时将在您的账户中自动创建。有关更多信息，请参阅 [将服务相关角色用于容量预留实例集](using-service-linked-roles.md)。

目前，容量预留实例集仅支持 `open` 实例匹配条件。

------
#### [ AWS CLI ]

**要创建容量预留实例集**  
使用 [create-capacity-reservation-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-capacity-reservation-fleet.html) 命令。

```
aws ec2 create-capacity-reservation-fleet \
    --total-target-capacity {{24}} \
    --allocation-strategy prioritized \
    --instance-match-criteria open \
    --tenancy {{default}} \
    --end-date {{2021-12-31T23:59:59.000Z}} \
    --instance-type-specifications file://instanceTypeSpecification.json
```

以下是 `instanceTypeSpecification.json` 的内容。

```
[
  {
    "InstanceType": "{{m5.xlarge}}",
    "InstancePlatform": "{{Linux/UNIX}}",
    "Weight": {{3.0}},
    "AvailabilityZone":"{{us-east-1a}}",
    "EbsOptimized": true,
    "Priority" : {{1}}
  }
]
```

下面是示例输出。

```
{
    "Status": "submitted", 
    "TotalFulfilledCapacity": 0.0, 
    "CapacityReservationFleetId": "crf-abcdef01234567890", 
    "TotalTargetCapacity": 24
}
```

------
#### [ PowerShell ]

**要创建容量预留实例集**  
使用 [New-EC2CapacityReservationFleet](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2CapacityReservationFleet.html) cmdlet。

```
New-EC2CapacityReservationFleet `
    -TotalTargetCapacity {{24}} `
    -AllocationStrategy "prioritized" `
    -InstanceMatchCriterion "open" `
    -Tenancy "{{default}}" `
    -EndDate {{2021-12-31T23:59:59.000Z}} `
    -InstanceTypeSpecification $specification
```

规范定义如下。

```
$specification = New-Object Amazon.EC2.Model.ReservationFleetInstanceSpecification
$specification.InstanceType = "{{m5.xlarge}}"
$specification.InstancePlatform = "{{Linux/UNIX}}"
$specification.Weight = {{3.0}}
$specification.AvailabilityZone = "{{us-east-1a}}"
$specification.EbsOptimized = $true
$specification.Priority = {{1}}
```

------
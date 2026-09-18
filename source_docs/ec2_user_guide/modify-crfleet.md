

# 修改容量预留实例集
<a name="modify-crfleet"></a>

您可以随时修改容量预留实例集的总目标容量和日期。当您修改容量预留实例集的总目标容量时，实例集会自动创建新的容量预留，或者修改或取消实例集中的现有容量预留以满足新的总目标容量。当您修改实例集的结束日期时，所有单个容量预留的结束日期都会相应更新。

**注意事项**
+ 修改实例集后，其状态将转换为 `modifying`。当实例集处于 `modifying` 状态时，您无法尝试对其进行其他修改。
+ 您无法修改容量预留实例集使用的租赁、可用区、实例类型、实例平台、优先级或权重。如果您需要更改这些参数中的任何一个，您可能需要取消现有实例集并创建具有所需参数的新实例集。
+ 您不能在同一个命令中指定 `--end-date` 和 `--remove-end-date`。

------
#### [ AWS CLI ]

**修改容量预留实例集**  
使用 [modify-capacity-reservation-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-capacity-reservation-fleet.html) 命令。

**示例 1：修改总目标容量**

```
aws ec2 modify-capacity-reservation-fleet \
    --capacity-reservation-fleet-id {{crf-01234567890abcedf}} \
    --total-target-capacity {{160}}
```

**示例 2：修改结束日期**

```
aws ec2 modify-capacity-reservation-fleet \
    --capacity-reservation-fleet-id {{crf-01234567890abcedf}} \
    --end-date {{2021-07-04T23:59:59.000Z}}
```

**示例 3：删除结束日期**

```
aws ec2 modify-capacity-reservation-fleet \
    --capacity-reservation-fleet-id {{crf-01234567890abcedf}} \
    --remove-end-date
```

------
#### [ PowerShell ]

**修改容量预留实例集**  
使用 [Edit-EC2CapacityReservationFleet](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2CapacityReservationFleet.html) cmdlet。

**示例 1：修改总目标容量**

```
Edit-EC2CapacityReservationFleet `
    -CapacityReservationFleetId {{crf-01234567890abcedf}} `
    -TotalTargetCapacity {{160}}
```

**示例 2：修改结束日期**

```
Edit-EC2CapacityReservationFleet `
    -CapacityReservationFleetId {{crf-01234567890abcedf}} `
    -EndDate {{2021-07-04T23:59:59.000Z}}
```

**示例 3：删除结束日期**

```
Edit-EC2CapacityReservationFleet `
    -CapacityReservationFleetId {{crf-01234567890abcedf}} `
    -RemoveEndDate
```

------
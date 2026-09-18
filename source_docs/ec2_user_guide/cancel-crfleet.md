

# 取消容量预留实例集
<a name="cancel-crfleet"></a>

当您不再需要容量预留实例集及其预留的容量时，可以取消它。当您取消实例集时，实例集状态将更改为 `cancelled`，且其不能再创建新的容量预留。此外，实例集中的所有单个容量预留都将取消。之前在预留容量中运行的实例将在共享容量中继续正常运行。

------
#### [ AWS CLI ]

**要取消容量预留机群**  
使用 [cancel-capacity-reservation-fleets](https://docs.aws.amazon.com/cli/latest/reference/ec2/cancel-capacity-reservation-fleets.html) 命令。

```
aws ec2 cancel-capacity-reservation-fleets \
    --capacity-reservation-fleet-ids {{crf-abcdef01234567890}}
```

下面是示例输出。

```
{
    "SuccessfulFleetCancellations": [
        {
            "CurrentFleetState": "cancelling", 
            "PreviousFleetState": "active", 
            "CapacityReservationFleetId": "crf-abcdef01234567890"
        }
    ], 
    "FailedFleetCancellations": []
}
```

------
#### [ PowerShell ]

**要取消容量预留机群**  
使用 [Stop-EC2CapacityReservationFleet](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2CapacityReservationFleet.html) cmdlet。

```
Stop-EC2CapacityReservationFleet `
    -CapacityReservationFleetId {{crf-abcdef01234567890}}
```

------
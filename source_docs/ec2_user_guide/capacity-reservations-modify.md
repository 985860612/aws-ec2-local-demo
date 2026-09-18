

# 修改活动容量预留
<a name="capacity-reservations-modify"></a>

如果您现有的容量预留不适合需要容量的工作负载，则可以修改实例数量、实例资格（`open` 或 `targeted`）和结束时间（`At specific time` 或 `Manually`）。如果指定的新实例数量超过了选定实例类型的剩余按需型实例限制，则更新将失败。

允许的修改取决于容量预留的状态：
+ `assessing` 或 `scheduled` 状态：只能修改标签。
+ `pending` 状态：无法以任何方式修改容量预留。
+ `active` 状态但仍在承诺期限内：不能将实例计数减少到承诺的实例计数以下，也不能将结束日期设置为早于承诺期限。允许进行所有其他修改。
+ `active` 状态但没有承诺期限或承诺期限已过：允许进行所有修改。
+ `expired`、`cancelled`、`unsupported` 或 `failed` 状态：不能以任何方式修改容量预留。

**注意事项**
+ 创建后，您无法更改实例类型、平台、可用区或租赁。如果您需要修改任意这些属性，我们建议您取消预留，然后使用所需属性创建新的预留。
+ 如果通过将实例资格从 `targeted` 更改为 `open` 来修改现有容量预留，那么与容量预留属性匹配、已将 `CapacityReservationPreference` 参数设置为 `open` 且尚未在容量预留中运行的任何运行中实例，都将自动使用修改后的容量预留。
+ 要更改实例资格，容量预留必须完全处于空闲状态（零使用率），因为当实例在预留内运行时，Amazon EC2 无法修改实例资格。

------
#### [ Console ]

**修改容量预留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择**容量预留**，选择要修改的容量预留，然后选择**编辑**。

1. 根据需要修改**总容量**、**容量预留结束**或**实例资格**选项，然后选择**保存**。

------
#### [ AWS CLI ]

**修改容量预留**  
使用 [modify-capacity-reservation](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-capacity-reservation.html) 命令。以下示例将修改指定容量预留，使其为 8 个实例预留容量。

```
aws ec2 modify-capacity-reservation \
    --capacity-reservation-id {{cr-1234567890abcdef0}} \
    --instance-count {{8}}
```

------
#### [ PowerShell ]

**修改容量预留**  
使用 [Edit-EC2CapacityReservation](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2CapacityReservation.html) cmdlet。以下示例将修改指定容量预留，使其为 8 个实例预留容量。

```
Edit-EC2CapacityReservation `
    -CapacityReservationId {{cr-1234567890abcdef0}} `
    -InstanceCount {{8}}
```

------


# 接受或拒绝共享 EC2 容量预留的账单
<a name="accept-decline-billing-transfer"></a>

收到与您共享的容量预留的账单分配请求后，您可以接受也可以拒绝该请求。请求在被接受或拒绝之前，会保持 `pending` 状态。

如果您接受该请求，则将进入 `accepted` 状态，并且从那时起，该容量预留中任何可用或*未使用*容量的账单将分配给您的账户。在您接受该请求后，只有容量预留所有者才可以撤销您账户的账单。

如果您拒绝该请求，请求将进入 `rejected` 状态，容量预留的可用容量账单仍分配给容量预留所有者。

如果未在 12 小时内接受或拒绝请求，则请求将会过期。如果请求过期，则容量预留中任何未使用容量的账单仍分配给容量预留所有者。

请求被接受或拒绝时，系统会将一个 Amazon EventBridge 事件发送给容量预留所有者的账户。请求过期时，系统会将一个 Amazon EventBridge 事件发送给容量预留所有者账户和该使用者账户。有关更多信息，请参阅 [监控共享容量预留的账单分配请求](billing-ownership-events.md)。

------
#### [ Console ]

**接受或拒绝请求**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航面板中，选择**容量预留**。

1. 如果您有待处理的请求，则屏幕顶部会显示**待处理的账单分配请求**横幅。如果未显示该横幅，则表示您没有待处理的请求。

   要查看请求，请选择横幅中的**查看请求**。

1. 选择要接受或拒绝的请求，然后选择**接受**或**拒绝**。

------
#### [ AWS CLI ]

**接受请求**  
使用 [accept-capacity-reservation-billing-ownership](https://docs.aws.amazon.com/cli/latest/reference/ec2/accept-capacity-reservation-billing-ownership.html) 命令。对于 `--capacity-reservation-id`，请指定要接受请求的容量预留的 ID。

```
aws ec2 accept-capacity-reservation-billing-ownership \
    --capacity-reservation-id {{cr-01234567890abcdef}}
```

**拒绝请求**  
使用 [reject-capacity-reservation-billing-ownership](https://docs.aws.amazon.com/cli/latest/reference/ec2/reject-capacity-reservation-billing-ownership.html) 命令。对于 `--capacity-reservation-id`，请指定要拒绝请求的容量预留的 ID。

```
aws ec2 reject-capacity-reservation-billing-ownership \
    --capacity-reservation-id {{cr-01234567890abcdef}}
```

------
#### [ PowerShell ]

**接受请求**  
使用 [Approve-EC2CapacityReservationBillingOwnership](https://docs.aws.amazon.com/powershell/latest/reference/items/Approve-EC2CapacityReservationBillingOwnership.html) cmdlet。

```
Approve-EC2CapacityReservationBillingOwnership `
    -CapacityReservationId {{cr-01234567890abcdef}}
```

**拒绝请求**  
使用 [Deny-EC2CapacityReservationBillingOwnership](https://docs.aws.amazon.com/powershell/latest/reference/items/Deny-EC2CapacityReservationBillingOwnership.html) cmdlet。

```
Deny-EC2CapacityReservationBillingOwnership `
    -CapacityReservationId {{cr-01234567890abcdef}}
```

------


# 取消或撤销共享 EC2 容量预留的账单分配请求
<a name="cancel-billing-transfer"></a>

只有容量预留所有者才能取消 `pending` 账单分配请求。如果待处理的请求被取消，请求将进入 `cancelled` 状态，容量预留中任何可用（即*未使用*）容量的账单仍分配给容量预留所有者。

请求处于 `accepted` 状态后，只有容量预留所有者才能撤销已分配账户的账单。如果账单被撤销，请求将进入 `revoked` 状态，容量预留中任何可用容量的账单将重新分配给容量预留所有者。

请求被取消或撤销时，系统会将 Amazon EventBridge 事件发送给容量预留所有者账户和指定的使用者账户。有关更多信息，请参阅 [监控共享容量预留的账单分配请求](billing-ownership-events.md)。

------
#### [ Console ]

**取消或撤销请求**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航面板中，选择**容量预留**，然后选择要取消或撤销请求的容量预留。

1. 在**可用容量的账单**部分中，根据请求的当前状态选择**取消转移**或**撤销转移**。

------
#### [ AWS CLI ]

**取消或撤销请求**  
使用 [disassociate-capacity-reservation-billing-owner](https://docs.aws.amazon.com/cli/latest/reference/ec2/disassociate-capacity-reservation-billing-owner.html) 命令。对于 `--unused-reservation-billing-owner-id`，请指定向其发送了请求的 AWS 账户的 ID。

```
aws ec2 disassociate-capacity-reservation-billing-owner \
    --capacity-reservation-id {{cr-01234567890abcdef}} \
    --unused-reservation-billing-owner-id {{123456789012}}
```

------
#### [ PowerShell ]

**取消或撤销请求**  
使用 [Unregister-EC2CapacityReservationBillingOwner](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2CapacityReservationBillingOwner.html) cmdlet。对于 `-UnusedReservationBillingOwnerId`，请指定向其发送了请求的 AWS 账户的 ID。

```
Unregister-EC2CapacityReservationBillingOwner `
    -CapacityReservationId {{cr-01234567890abcdef}} `
    -UnusedReservationBillingOwnerId {{123456789012}}
```

------
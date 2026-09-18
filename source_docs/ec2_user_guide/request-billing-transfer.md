

# 将共享 EC2 容量预留的账单分配给其他账户
<a name="request-billing-transfer"></a>

要将共享容量预留的可用容量账单分配给其他账户，容量预留所有者必须向所需账户发起请求。在 Amazon EC2 控制台中，此请求称为*转移请求*。

只有在满足下列条件时，容量预留所有者才能将容量预留的可用容量的账单分配给某个账户：
+ 该容量预留已与该账户共享。
+ 该账户与容量预留所有者合并到同一 AWS Organizations 付款人账户下。

只有在指定账户接受请求后，才会将账单分配给该账户。

容量预留所有者发起请求时，系统会将一个 Amazon EventBridge 事件发送给被请求的账户。有关更多信息，请参阅 [监控共享容量预留的账单分配请求](billing-ownership-events.md)。

------
#### [ Console ]

**分配共享容量预留的账单**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航面板中，选择**容量预留**，然后选择该共享容量预留。

1. 在**可用容量的账单**部分中，选择**分配账单**。

1. 在**分配账单**屏幕中，选择要向其分配账单的使用者账户，然后选择**请求**。

------
#### [ AWS CLI ]

**分配共享容量预留的账单**  
使用 [associate-capacity-reservation-billing-owner](https://docs.aws.amazon.com/cli/latest/reference/ec2/associate-capacity-reservation-billing-owner.html) 命令。对于 `--capacity-reservation-id`，指定共享容量预留的 ID。对于 `--unused-reservation-billing-owner-id`，请指定要向其分配账单的 AWS 账户的 ID。

```
aws ec2 associate-capacity-reservation-billing-owner \
    --capacity-reservation-id {{cr-01234567890abcdef}} \
    --unused-reservation-billing-owner-id {{123456789012}}
```

------
#### [ PowerShell ]

**分配共享容量预留的账单**  
使用 [Register-EC2CapacityReservationBillingOwner](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2CapacityReservationBillingOwner.html) cmdlet。对于 `-CapacityReservationId`，指定共享容量预留的 ID。对于 `-UnusedReservationBillingOwnerId`，请指定要向其分配账单的 AWS 账户的 ID。

```
Register-EC2CapacityReservationBillingOwner `
    -CapacityReservationId {{cr-01234567890abcdef}} `
    -UnusedReservationBillingOwnerId {{123456789012}}
```

------
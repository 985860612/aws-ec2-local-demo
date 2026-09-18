

# 查看共享 EC2 容量预留的账单分配请求
<a name="view-billing-transfers"></a>

容量预留所有者只能查看其最新发起的账单分配请求。使用者账户只能查看向其发送的最新账单分配请求。

在请求进入 `cancelled`、`expired` 或 `revoked` 状态后，可以在 24 小时内查看请求。24 小时后，其将无法再查看。

------
#### [ Console ]

**（容量预留所有者）查看您发起的请求**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航面板中，选择**容量预留**，然后选择要查看请求的共享容量预留。

1. **可用容量的账单**部分会显示最新的请求及其当前状态。

**（使用者账户）发送给您的请求**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航面板中，选择**容量预留**。

1. 如果您有待处理的请求，则屏幕顶部会显示**待处理的账单分配请求**横幅。如果未显示该横幅，则表示您没有待处理的请求。

   要查看请求，请选择横幅中的**查看请求**。

------
#### [ AWS CLI ]

**（容量预留所有者）查看您发起的请求**  
使用 [describe-capacity-reservation-billing-requests](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservation-billing-requests.html) 命令。

```
aws ec2 describe-capacity-reservation-billing-requests \
    --role odcr-owner
```

**（使用者账户）查看发送给您的请求**  
使用 [describe-capacity-reservation-billing-requests](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservation-billing-requests.html) 命令。

```
aws ec2 describe-capacity-reservation-billing-requests \
    --role unused-reservation-billing-owner
```

------
#### [ PowerShell ]

**（容量预留所有者）查看您发起的请求**  
使用 [Get-EC2CapacityReservationBillingRequest](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2CapacityReservationBillingRequest.html) cmdlet。

```
Get-EC2CapacityReservationBillingRequest `
    -Role odcr-owner
```

**（使用者账户）查看发送给您的请求**  
使用 [Get-EC2CapacityReservationBillingRequest](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2CapacityReservationBillingRequest.html) cmdlet。

```
Get-EC2CapacityReservationBillingRequest `
    -Role unused-reservation-billing-owner
```

------

请求可以处于以下某种状态。


| 州 | 说明 | 
| --- | --- | 
| pending | 该请求尚未被接受或拒绝，也未过期。 | 
| accepted | 该请求已被指定账户接受。容量预留的可用容量账单已分配给该使用者账户。 | 
| rejected | 该请求也被使用者账户拒绝。 | 
| cancelled | 该请求在处于 pending 状态时被容量预留所有者取消。 | 
| revoked | 由于以下原因之一，已从该使用者账户撤销了账单：+  容量预留所有者显式撤销了账单。 <br />+  容量预留不再与该使用者账户共享。 <br />+  该使用者账户不再是该 AWS 组织的成员。   | 
| expired | 由于使用者账户未在 12 小时内接受或拒绝请求，因此请求已过期。 | 
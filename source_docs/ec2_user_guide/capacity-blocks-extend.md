

# 延长容量块期限
<a name="capacity-blocks-extend"></a>

使用容量块，您可以为工作负载预留计算容量，以确保可用性和一致性。为了满足您不断变化的需求，您可以根据需要延长现有容量块的持续时间。

要延长容量块，其状态必须为 `active` 或 `scheduled`，并且没有处于 `payment-pending` 状态的延期。您可以在容量块过期前，申请将其期限延长至最少 1 小时或最多 57 天。您可以将容量块以 1 天为增量延长至总计最长 14 天，或者以 7 天为增量延长至总计最长 182 天（26 周）。当您延长容量块期限时，其结束日期将会更新，以便您的实例可以继续运行而不中断。
+ 可以应用于容量块的延期数量没有限制
+ 延长块期限后，您的容量预留 ID 将保持不变
+ 只有当具有足够的可用容量来支持容量块时，才能对其进行延期，但这并不能保证。

## 计费
<a name="capacity-blocks-extend-billing"></a>

容量块产品是预先收费的。延期将保持 `payment-pending` 状态，直到账单付清为止。如果您的付款无法在 12 小时内或容量块预计结束前的 35 分钟内处理（以先到者为准），则您的延期将失败，并且状态将更改为 `payment-failed`。您的容量块预留将保持 `active` 状态，并将于原始结束日期终止。

成功处理您的付款后，容量块延期状态将更改为 `payment-succeeded`，并且容量块预留的结束日期将更新为新的结束日期。延期的详细信息可以在控制台的**容量块延期详细信息**部分中查看，也可以使用 [describe-capacity-block-extension-history](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-block-extension-history.html) 命令查看。

## 延长您的容量块期限
<a name="capacity-blocks-extend-procedure"></a>

------
#### [ Console ]

**延长容量块期限**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 在**容量预留概述**页面上，您会看到一个资源表，其中包含有关所有容量预留资源的详细信息。选择要延期的容量块的预留 ID。

1. 从**操作**下拉菜单中，选择**延长容量块期限**。

1. 在**持续时间**下，输入您需要延长预留的天数或周数。

1. 选择**查找容量块**。

1. 如果有符合您规格的容量块，则会在**推荐的容量块**下显示一个产品。要查看其他容量块产品，请调整搜索输入，然后再次选择**查找容量块**。

1. 当您找到要购买的容量块产品时，请选择**延期**。

1. 在**延长容量块期限**弹出窗口中，输入*确认*，然后选择**延期**。

------
#### [ AWS CLI ]

**查找容量块延期**  
使用 [describe-capacity-block-extension-offerings](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-block-extension-offerings.html) 命令。以下示例搜索指定预留的 48 小时容量块延期。

```
aws ec2 describe-capacity-block-extension-offerings \
    --capacity-reservation-id {{cr-1234567890abcdefg}} \
    --capacity-block-extension-duration-hours {{48}}
```

**延长容量块期限**  
使用 [purchase-capacity-block-extension](https://docs.aws.amazon.com/cli/latest/reference/ec2/purchase-capacity-block-extension.html) 命令。从上一个示例的输出中指定延期产品 ID。

```
aws ec2 purchase-capacity-block-extension \
    --capacity-block-extension-offering-id {{cbe-0123456789abcdefg}} \
    --capacity-reservation-id {{cr-1234567890abcdefg}}
```

------
#### [ PowerShell ]

**查找容量块延期**  
使用 [Get-EC2CapacityBlockExtensionOffering](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2CapacityBlockExtensionOffering.html) cmdlet。以下示例搜索指定预留的 48 小时容量块延期。

```
Get-EC2CapacityBlockExtensionOffering `
    -CapacityReservationId {{cr-1234567890abcdefg}} `
    -CapacityBlockExtensionDurationHour {{48}}
```

**延长容量块期限**  
使用 [Invoke-EC2CapacityBlockExtension](https://docs.aws.amazon.com/powershell/latest/reference/items/Invoke-EC2CapacityBlockExtension.html) cmdlet。从上一个示例的输出中指定延期产品 ID。

```
Invoke-EC2CapacityBlockExtension `
    -CapacityBlockExtensionOfferingId {{cbe-0123456789abcdefg}} `
    -CapacityReservationId {{cr-1234567890abcdefg}}
```

------
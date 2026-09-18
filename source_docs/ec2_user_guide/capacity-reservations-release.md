

# 取消 容量预留
<a name="capacity-reservations-release"></a>

可以取消处于以下状态之一的容量预留：
+ `assessing`
+ `scheduled`
+ `active`
+ `delayed`

**注意**  
您无法修改或取消容量块。有关更多信息，请参阅 [ML 容量块](ec2-capacity-blocks.md)。

如果容量预留的状态为 `active` 而且没有承诺期限或承诺期限已过，则可以免费取消。

如果容量预留的状态为 `assessing` 或 `delayed`，则可以免费取消。

如果容量预留的状态为 `scheduled` 或 `active` 而且有剩余承诺期限，则可能需要支付取消费用。有关更多信息，请参阅 [取消费用](#cr-cancellation-charges)。

如果您取消具有正在运行的实例的容量预留，这些实例将继续在容量预留之外正常运行并应用标准按需型实例费率；或者，如果您有匹配的节省计划或区域预留实例，则应用折扣费率。

取消容量预留之后，定位到其中的实例无法再启动。修改这些实例，使其定位到不同容量预留、启动到任意处于“开放”状态且具有匹配属性和充足容量的容量预留，或者避免将其启动到容量预留中。有关更多信息，请参阅 [修改您的实例的容量预留设置](capacity-reservations-modify-instance.md)。

**Topics**
+ [取消费用](#cr-cancellation-charges)
+ [取消报价](#cr-cancellation-quote)
+ [取消 容量预留](#capacity-reservations-cancel-procedures)

## 取消费用
<a name="cr-cancellation-charges"></a>

如果您在开始日期后的 8 周内或交付后的承诺期限内取消未来日期的容量预留，则需要按承诺期限的一定百分比向您收取费用。容量将在您取消后立即释放，但在缩短的承诺期结束之前，预留将继续按按需型费率计费。如果您有匹配的节省计划或区域预留实例，则自动应用折扣费率。

要计算费用，Amazon EC2 会将您的承诺期限乘以取消费率。相对于开始日期，您取消的时间越早，费率就越低。下表显示取消费率。


**取消费率**  

| 您取消的时间 | 最低取消费率 | 
| --- | --- | 
| 最初的开始日期前 8 周或更长时间 | 免费 | 
| 最初的开始日期前 2 到 8 周 | 总承诺金额的 25% | 
| 最初的开始日期前 2 周内 | 总承诺金额的 50% | 
| 交付后，在承诺期限内 | 剩余承诺金额的 50% | 

下表提供了有关取消费用的一般指导。取消报价决定了确切的取消费用持续时间。

例如，如果您拥有 70 个实例的 `c8g.xlarge` 容量预留，承诺期限为 14 天，并且在最初开始日期前的 2 周内取消（取消费率为 50%），则需要按照 7 天的承诺使用期收费。在这 7 天内，您按按需型费率为 70 个实例付费。

当您被收取取消费用时：
+ 容量预留进入 `cancelling` 状态。
+ 无法修改、移动、共享或拆分容量预留。
+ 容量预留在控制台和 `DescribeCapacityReservations` 回复中仍然可见。
+ 承诺结束时，容量预留将过渡到 `cancelled`。

要了解取消费用何时结束，请使用 [describe-capacity-reservations](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservations.html) 命令并检查回复中的 `CommitmentInfo.CommitmentEndDate` 字段。当承诺结束且容量预留过渡到 `cancelled` 时，费用将停止。有关取消费用在 AWS 成本和使用情况报告 2.0 中的显示方式的信息，请参阅 [成本和使用情况报告 2.0 中的取消费用](capacity-reservations-pricing-billing.md#capacity-reservations-cancellation-billing-cur)。

如果容量预留还有剩余的承诺期限，则无法在实例仍在运行时将其取消。您必须先停止或终止正在运行的实例，这样可以防止您同时产生取消费用和按需型实例费用。

要取消容量预留并收取取消费用，您必须先生成取消报价并接受条款。有关更多信息，请参阅 [取消报价](#cr-cancellation-quote)。

## 取消报价
<a name="cr-cancellation-quote"></a>

当取消需要收费时，您必须先查看并接受取消报价，然后再继续。报价提供了确切的取消条款，包括以下详细信息：
+ 容量预留的当前配置
+ 取消后容量预留过渡到的状态（`cancelling`）
+ 费用所应用的已承诺实例数
+ 费用持续时间
+ 费用结束日期（承诺结束且容量预留过渡到 `cancelled`）

查看条款后，您可以通过接受报价来确认取消。

在 Amazon EC2 控制台中，报价会在您发起取消操作时自动生成。您可以查看条款并直接确认接受。通过 AWS CLI 或 API，使用 `CreateCapacityReservationCancellationQuote` 生成报价，然后将报价 ID 传递给 `CancelCapacityReservation`。

取消报价的有效期为 24 小时。24 小时后，您必须生成新的报价。要查看您现有的取消报价，请使用 `DescribeCapacityReservationCancellationQuotes`。

**重要**  
取消是不可逆的。在您接受取消报价并取消容量预留后，您将无法撤消取消。

## 取消 容量预留
<a name="capacity-reservations-cancel-procedures"></a>

请按照以下过程取消容量预留。

------
#### [ Console ]

**取消容量预留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择**容量预留**，然后选择要取消的容量预留。

1. 选择**取消预留**。

1. 如果需要取消报价，请查看取消条款，包括费用持续时间和费用结束日期。输入 **confirm** 接受条款。

1. 选择**取消预留**。

------
#### [ AWS CLI ]

**取消容量预留**  
使用 [cancel-capacity-reservation](https://docs.aws.amazon.com/cli/latest/reference/ec2/cancel-capacity-reservation.html) 命令。

```
aws ec2 cancel-capacity-reservation \
    --capacity-reservation-id {{cr-1234567890abcdef0}}
```

如果需要取消报价，请先使用 [create-capacity-reservation-cancellation-quote](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-capacity-reservation-cancellation-quote.html) 生成报价，然后将报价 ID 传递给取消命令。

```
aws ec2 create-capacity-reservation-cancellation-quote \
    --capacity-reservation-id {{cr-1234567890abcdef0}}
```

查看回复中的 `CancellationTerms`，包括 `ChargeCommitmentDurationHours` 和 `ChargeEndDate`。然后使用报价 ID 取消：

```
aws ec2 cancel-capacity-reservation \
    --capacity-reservation-id {{cr-1234567890abcdef0}} \
    --quote-id {{crcq-1a2b3c4d5e6f7g8h9}} \
    --apply-cancellation-charges commitment-wind-down
```

------
#### [ PowerShell ]

**取消容量预留**  
使用 [Remove-EC2CapacityReservation](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2CapacityReservation.html) cmdlet。

```
Remove-EC2CapacityReservation `
    -CapacityReservationId {{cr-1234567890abcdef0}}
```

如果需要取消报价，请先使用 [New-EC2CapacityReservationCancellationQuote](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2CapacityReservationCancellationQuote.html) 生成报价，然后将报价 ID 传递给取消 cmdlet。

```
New-EC2CapacityReservationCancellationQuote `
    -CapacityReservationId {{cr-1234567890abcdef0}}
```

查看回复中的取消条款。然后使用报价 ID 取消：

```
Remove-EC2CapacityReservation `
    -CapacityReservationId {{cr-1234567890abcdef0}} `
    -QuoteId {{crcq-1a2b3c4d5e6f7g8h9}} `
    -ApplyCancellationCharge "commitment-wind-down"
```

------
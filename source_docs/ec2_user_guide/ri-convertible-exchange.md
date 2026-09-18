

# 交换 可转换预留实例
<a name="ri-convertible-exchange"></a>

您可以将一个或多个 可转换预留实例 与具有不同配置的其他 可转换预留实例（包括实例系列、操作系统和租期）进行交换。执行交换的次数没有限制，前提是新的可转换预留实例的值等于或高于要交换的可转换预留实例的值。

在交换可转换预留实例时，您当前预留的实例数与新可转换预留实例的配置的实例数（其涵盖的值相等或更高）进行交换。Amazon EC2 计算您可以通过交换获得的预留实例数量。

您不能交换标准 预留实例，但可对其进行修改。有关更多信息，请参阅[修改 预留实例](ri-modifying.md)。

**Topics**
+ [交换可转换预留实例的要求](#riconvertible-exchange-limits)
+ [计算 可转换预留实例 交换](#riconvertible-exchange-cost)
+ [合并 可转换预留实例](#ri-merge-convertible)
+ [交换部分 可转换预留实例](#ri-split-convertible)
+ [提出交换请求](#ri-exchange-process)

## 交换可转换预留实例的要求
<a name="riconvertible-exchange-limits"></a>

如果满足以下条件，Amazon EC2 将处理您的交换请求。您可转换预留实例必须：
+ 处于活动状态
+ 没有以前等待处理的交换请求
+ 距离到期至少还剩 24 小时

以下规则适用：
+ 可转换预留实例必须与当前由 AWS 提供的其他可转换预留实例交换。
+ 可转换预留实例 与特定区域关联，在预留期限内是固定的。您不能将可转换预留实例与其他区域中的可转换预留实例进行交换。
+ 要交换区域可转换预留实例，AWS 必须为该区域中的新实例类型提供足够的容量。
+ 一次只能将一个或多个 可转换预留实例 与一个 可转换预留实例 交换。
+ 要交换部分 可转换预留实例，您可以修改它以将其拆分为两个或更多预留，然后将一个或多个预留与新 可转换预留实例 交换。有关更多信息，请参阅[交换部分 可转换预留实例](#ri-split-convertible)。有关修改 预留实例 的更多信息，请参阅[修改 预留实例](ri-modifying.md)。
+ 预付全费的 可转换预留实例 可用来交换预付部分费用的 可转换预留实例，反之亦然。
**注意**  
如果交换所需的总预付款（调整费用）少于 0.00 USD，AWS会自动向您提供可转换预留实例 中可确保调整费用大于等于 0.00 USD 的实例数。
**注意**  
如果新可转换预留实例的总价值（预付价格 \+ 每小时价格 \* 剩余小时数）少于交换的可转换预留实例的总价值，AWS会自动向您提供可转换预留实例中可确保总价值大于等于交换的可转换预留实例的总价值的实例数。
+ 要享受更优惠的定价，您可以将无预付费用的 可转换预留实例 交换为预付全费或预付部分费用的 可转换预留实例。
+ 不能将预付全部费用和预付部分费用的可转换预留实例交换为无预付费用的可转换预留实例。
+ 仅当新 可转换预留实例 的每小时价格大于等于交换的 可转换预留实例 的每小时价格时，才能将一个无预付费用的 可转换预留实例 交换为另一个无预付费用的 可转换预留实例。
**注意**  
如果新可转换预留实例的总价值（预付价格 \+ 每小时价格 \* 剩余小时数）少于交换的可转换预留实例的总价值，AWS会自动向您提供可转换预留实例中可确保总价值大于等于交换的可转换预留实例的总价值的实例数。
+ 如果交换到期日期不同的多个 可转换预留实例，则新 可转换预留实例 的到期日期是将来最晚的日期。
+ 如果您交换了单个 可转换预留实例，则它必须与新 可转换预留实例 具有相同的期限（1 年或 3 年）。如果合并期限不同的多个 可转换预留实例，则新 可转换预留实例 期限为 3 年。有关更多信息，请参阅 [合并 可转换预留实例](#ri-merge-convertible)。
+ 当 Amazon EC2 交换可转换预留实例时，它会停用相关的预留，并将结束日期传输到新预留。交换后，Amazon EC2 会将旧预留的结束日期和新预留的开始日期设置为等于交换日期。例如，如果您交换一个剩余期限为 16 个月的三年期预留，则新预留是为期 16 个月的预留，其结束日期与您交换的可转换预留实例相同。

## 计算 可转换预留实例 交换
<a name="riconvertible-exchange-cost"></a>

交换可转换预留实例是免费的。但是，您可能需要支付调整费用，即您拥有的可转换预留实例与通过交换收到的新可转换预留实例之间差额的按比例预付费用。

每个可转换预留实例都具有标价。此价目表值将与您所需可转换预留实例的价目表值进行比较，以确定您可通过交换获得的实例预留数量。

例如：您有 1 个 35 美金标价的可转换预留实例，您希望交换为标价为 10 美金的全新实例类型。

```
$35/$10 = 3.5
```

您可以将 可转换预留实例 交换为三个 10 美元的 可转换预留实例。无法购买半预留；因此必须购买额外的可转换预留实例才能涵盖剩余部分：

```
3.5 = 3 whole Convertible Reserved Instances + 1 additional Convertible Reserved Instance
```

第四个可转换预留实例与其他三个具有相同的结束日期。如果要交换部分或全部预付可转换预留实例，则需要支付第四个预留的调整费用。如果 可转换预留实例 的剩余预付费用为 500 USD，新预留通常按比例分摊为 600 USD，则需要支付 100 USD。

```
$600 prorated upfront cost of new reservations - $500 remaining upfront cost of old reservations = $100 difference
```

## 合并 可转换预留实例
<a name="ri-merge-convertible"></a>

如果合并两个或更多可转换预留实例，则新可转换预留实例的期限必须与旧可转换预留实例的期限相同，或者与可转换预留实例中的最高期限相同。新可转换预留实例的到期日期是未来有效时间最长的到期日期。

例如，您的账户中有以下可转换预留实例：


| Reserved Instance ID | 租期 | 到期日期 | 
| --- | --- | --- | 
| aaaa1111 | 1 年 | 2018-12-31 | 
| bbbb2222 | 1 年 | 2018-07-31 | 
| cccc3333 | 3 年 | 2018-06-30 | 
| dddd4444 | 3 年 | 2019-12-31 | 
+ 您可以合并 `aaaa1111` 和 `bbbb2222` 并将它们与 1 年期 可转换预留实例 交换。您无法将它们与 3 年期可转换预留实例交换。新可转换预留实例的到期日期为 2018-12-31。
+ 您可以合并 `bbbb2222` 和 `cccc3333` 并将它们与 3 年期 可转换预留实例 交换。您无法将它们与 1 年期可转换预留实例交换。新可转换预留实例的到期日期为 2018-07-31。
+ 您可以合并 `cccc3333` 和 `dddd4444` 并将它们与 3 年期 可转换预留实例 交换。您无法将它们与 1 年期可转换预留实例交换。新可转换预留实例的到期日期为 2019-12-31。

## 交换部分 可转换预留实例
<a name="ri-split-convertible"></a>

您可以使用修改过程将 可转换预留实例 拆分为较小的预留，然后将一个或多个新预留与新 可转换预留实例 交换。以下示例演示了如何执行此操作。

**Example 示例：包含多个实例的可转换预留实例**  
在本示例中，您有一个在预留中有四个实例的 `t2.micro` 可转换预留实例。将两个 `t2.micro` 实例与一个 `m4.xlarge` 实例交换：  

1. 修改 `t2.micro` 可转换预留实例，方法为将其拆分为两个 `t2.micro` 可转换预留实例，每一个都包含两个实例。

1. 将其中一个新 `t2.micro` 可转换预留实例 与一个 `m4.xlarge` 可转换预留实例 交换。

![修改和交换预留实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ri-split-cri-multiple.png)


**Example 示例：包含单个实例的可转换预留实例**  
在本示例中，您拥有一个 `t2.large` 可转换预留实例。将其更改为一个较小的 `t2.medium` 实例和一个 `m3.medium` 实例：  

1. 修改 `t2.large` 可转换预留实例，方法为将其拆分为两个 `t2.medium` 可转换预留实例。单个 `t2.large` 实例具有两个 `t2.medium` 实例相同的实例大小占用空间。

1. 将其中一个新 `t2.medium` 可转换预留实例 与一个 `m3.medium` 可转换预留实例 交换。

![修改和交换预留实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ri-split-cri-single.png)

有关更多信息，请参阅[对于修改实例大小的支持](ri-modifying.md#ri-modification-instancemove)和[提出交换请求](#ri-exchange-process)。

## 提出交换请求
<a name="ri-exchange-process"></a>

您可以交换可转换预留实例。交换的预留实例已停用。

------
#### [ Console ]

**交换可转换预留实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择 **Reserved Instances (预留实例)**，选择要交换的 可转换预留实例，然后依次选择 **Actions (操作)** 和 **Exchange Reserved Instance (交换预留实例)**。

1. 选择所需配置的属性，然后选择 **Find offering (查找产品)**。

1. 选择一个新的 可转换预留实例。在屏幕底部，您可以查看通过交换收到的 预留实例 数和任何额外费用。

1. 当您选择了符合需求的 可转换预留实例 时，请选择 **Review (审核)**。

1. 选择 **Exchange (交换)**，然后选择 ** Close (关闭)**。

------
#### [ AWS CLI ]

**交换可转换预留实例**

1. 使用 [describe-reserved-instances-offerings](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances-offerings.html) 命令查找符合需求的新可转换预留实例。

1. 使用 [get-reserved-instances-exchange-quote](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-reserved-instances-exchange-quote.html) 命令获取交换的报价。这包括通过交换获得的预留实例数以及交换的调整费用：

1. 使用 [accept-reserved-instances-exchange-quote](https://docs.aws.amazon.com/cli/latest/reference/ec2/accept-reserved-instances-exchange-quote.html) 命令执行交换。

------
#### [ PowerShell ]

**交换可转换预留实例**

1. 使用 [Get-EC2ReservedInstancesOffering](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstancesOffering.html) cmdlet 查找符合需求的新可转换预留实例。

1. 使用 [GetEC2-ReservedInstancesExchangeQuote](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstancesExchangeQuote.html) cmdlet 获取交换的报价。这包括通过交换获得的预留实例数以及交换的调整费用：

1. 使用 [Approve-EC2ReservedInstancesExchangeQuote](https://docs.aws.amazon.com/powershell/latest/reference/items/Approve-EC2ReservedInstancesExchangeQuote.html) cmdlet 进行交换

------
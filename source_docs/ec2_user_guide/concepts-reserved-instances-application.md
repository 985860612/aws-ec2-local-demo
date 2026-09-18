

# 预留实例的计费方式
<a name="concepts-reserved-instances-application"></a>

与按需定价不同，所有预留实例都提供折扣。使用预留实例时，无论实际使用情况如何，都需要为整个期限付费。您可以根据为 Reserved Instance 指定的[付款选项](ec2-reserved-instances.md#ri-payment-options)，为 Reserved Instance 选择预付、部分预付或按月付费。

预留实例过期后，需要根据按需费率支付 EC2 实例使用费用。您最早可以提前三年排队购买 Reserved Instance。这样可以帮助您确保获得不中断的服务。有关更多信息，请参阅 [排队购买](ri-market-concepts-buying.md#ri-queued-purchase)。

AWS Free Tier 可供新的 AWS 账户 使用。如果您使用 AWS Free Tier 运行 Amazon EC2 实例，并购买了预留实例，则需要按标准定价付费。有关信息，请参阅。[AWS Free Tier](https://aws.amazon.com/free/)

**Topics**
+ [使用情况计费](#hourly-billing)
+ [查看您的账单](#ri-market-buyer-billing)
+ [预留实例和整合账单](#concepts-reserved-instances-billing)
+ [Reserved Instance折扣定价套餐](#reserved-instances-discounts)

## 使用情况计费
<a name="hourly-billing"></a>

在选择的预留实例期限内，无论实例是否运行，预留实例均按小时计费。每时钟小时从标准 24 小时制的整点（该小时经过了零分零秒）开始。例如，1:00:00 到 1:59:59 是一个时钟小时。有关实例状态的更多信息，请参阅 [Amazon EC2 实例状态更改](ec2-instance-lifecycle.md)。

Reserved Instance账单优势适用于按秒收费的运行实例。每秒计费适用于使用开源 Linux 发行版的实例，例如 Amazon Linux 和 Ubuntu。每小时计费用于商业 Linux 发行版，例如 Red Hat Enterprise Linux 和 SUSE Linux Enterprise Server。

Reserved Instance账单优势适用于每小时最多 3600 秒 (一小时) 的实例使用。您可同时运行多个实例，但每小时只能获得总计 3600 秒的Reserved Instance折扣优惠；每小时超出 3600 秒的实例使用将根据按需费率计费。

例如，如果您购买了一个 `m4.xlarge` Reserved Instance，同时运行 4 个 `m4.xlarge` 实例 1 小时，则一个实例将按 1 小时的Reserved Instance使用收费，其他三个实例将按 3 小时的按需使用收费。

但是，如果您购买一个 `m4.xlarge` Reserved Instance，在同一小时内运行 4 个 `m4.xlarge` 实例各 15 分钟（900 秒），那么实例的总运行时间为 1 小时，这将产生 1 小时的Reserved Instance使用和 0 小时的按需使用。

![四个 m4.xlarge 实例在同一小时内各运行 15 分钟。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ri-per-second-billing.png)


如果多个合格实例同时运行，Reserved Instance账单优势将在一小时内（最多 3600 秒）同时适用于所有实例；在该时间后，根据按需费率收取费用。

![通过预留实例账单同时运行多个实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ri-per-second-billing-concurrent.png)


使用 [Billing and Cost Management](https://console.aws.amazon.com/billing) 控制台上的 **Cost Explorer (成本管理器)** 可以分析运行 按需型实例 所节省的成本。[预留实例 常见问题](https://aws.amazon.com/ec2/faqs/#reserved-instances)包括标价计算的示例。

如果您关闭 AWS 账户，则您资源的按需计费会停止。不过，如果账户中有任何预留实例，则会继续收到这些实例的账单，直至实例过期。

## 查看您的账单
<a name="ri-market-buyer-billing"></a>

您可通过查看 [AWS 账单与成本管理](https://console.aws.amazon.com/billing) 控制台来了解您的账户的费用情况。
+ **控制面板**显示了您的账户的花费汇总。
+ 在 **Bills (账单)** 页面的 **Details (详细信息)** 下，展开 **Elastic Compute Cloud** 部分及区域，以了解有关您的 预留实例 的账单信息。

您可以在线查看费用，也可以下载 CSV 文件。

您还可以使用AWS成本和使用情况报告来跟踪您的预留实例使用情况。有关更多信息，请参阅 [Understanding your reservations](https://docs.aws.amazon.com/cur/latest/userguide/understanding-ri.html)。

## 预留实例和整合账单
<a name="concepts-reserved-instances-billing"></a>

如果购买者账户是在一个整合账单付款人账户之下计费的一组账户中的其中之一，则可以共享预留实例定价优惠。每月将在付款人账户中汇总所有成员账户的实例使用量。这通常对具有不同职能团队或团体的公司很有用；然后，将应用正常的Reserved Instance逻辑来计算账单。有关更多信息，请参阅 [AWS Organizations 的整合账单](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html)。

如果您关闭购买预留实例的账户，会继续向付款人账户收取预留实例的费用，直到预留实例过期为止。已关闭的账户在 90 天后永久删除后，成员账户不再享受预留实例账单折扣。

**注意**  
区域预留实例仅为所属账户预留容量，不能与其他 AWS 账户 账户共享。如果您需要与其他 AWS 账户 共享容量，请使用 [使用 EC2 按需容量预留来预留计算容量](ec2-capacity-reservations.md)。

## Reserved Instance折扣定价套餐
<a name="reserved-instances-discounts"></a>

如果您的账户有资格获得折扣定价套餐，那么自您取得该资格时起，您在该套餐等级内购买的Reserved Instance的预付费和实例使用费均自动享受折扣。要取得折扣资格，在该区域内的 预留实例 的标价必须达到 500000 美元或更高。

以下规则适用：
+ 定价套餐和相关折扣仅适用于购买 Amazon EC2 标准 预留实例。
+ 定价套餐不适用于面向带 SQL Server Standard、SQL Server Web 和 SQL Server Enterprise 的 Windows 的 预留实例。
+ 定价套餐不适用于任何类型的含有 SQL Server 的 Linux 的预留实例。
+ 定价套餐折扣仅适用于通过 AWS 进行的购买。这些折扣不适用于第三方预留实例购买。
+ 折扣定价套餐当前不适用于可转换预留实例购买。

**Topics**
+ [计算 Reserved Instance 定价折扣](#pricing-discounts)
+ [以折扣套餐价格购买](#buying-discount-tier)
+ [跨越定价套餐](#crossing-pricing-tiers)
+ [定价套餐的整合账单](#consolidating-billing)

### 计算 Reserved Instance 定价折扣
<a name="pricing-discounts"></a>

通过计算在区域中的所有 预留实例 的标价，可以确定账户所适用的定价套餐。将每个预留的每小时费用乘以期限的总小时数，再加上购买时的未打折预付价格（也称为固定价格）。因为价目表值基于未打折 (公开) 定价，是否有资格获得批量折扣或者购买预留实例后是否降价均不影响价目表值。

```
List value = fixed price + (undiscounted recurring hourly price * hours in term)
```

例如，对于一年期部分预付 `t2.small` Reserved Instance，假定预付价格是 60.00 美元，每小时费率为 0.007 美元。这将提供 121.32 美元的标价。

```
121.32 = 60.00 + (0.007 * 8760)
```

**使用 Amazon EC2 控制台查看 预留实例 的固定价格**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Reserved Instances**。

1. 要显示**预付价格**列，请选择右上角的设置（![Settings icon](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/settings-icon.png)），开启**预付价格**，然后选择**确认**。

**使用命令行查看 预留实例 的固定价格**
+ [describe-reserved-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances.html) (AWS CLI)
+  [Get-EC2ReservedInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstance.html) (AWS Tools for Windows PowerShell)

### 以折扣套餐价格购买
<a name="buying-discount-tier"></a>

购买 预留实例 时，Amazon EC2 自动将所有折扣应用于所购产品处于折扣定价套餐范围内的部分。您无需执行任何其他操作，而且可以使用任何 Amazon EC2 工具购买 预留实例。有关更多信息，请参阅[购买 Amazon EC2 的预留实例](ri-market-concepts-buying.md)。

在某区域的活动 预留实例 的标价达到某一折扣定价套餐范围后，以后在该区域购买任何 预留实例 都将按打折费率计费。如果在某区域的 预留实例 单项购买额超过折扣套餐阈值，则该项购买超出价格阈值的部分将按打折费率计费。有关在购买过程中创建的临时 Reserved Instance ID 的更多信息，请参阅[跨越定价套餐](#crossing-pricing-tiers)。

如果标价降至低于折扣定价套餐价格点（例如，如果部分 预留实例 到期），之后在该区域购买 预留实例 将不享受折扣。不过，原来在折扣定价套餐范围内购买的所有预留实例将继续享受折扣。

购买预留实例时，可能出现以下四种情况之一：
+ **没有折扣** — 您在某区域内的购买仍然低于折扣阈值。
+ **部分折扣** — 您在某区域内的购买跨越了第一折扣套餐的阈值。没有折扣将应用于一个或多个预留，而折扣费率将应用于剩余的预留。
+ **全部折扣** — 您在某区域内的购买全部在一个折扣套餐之内并且获得了相应的折扣。
+ **两种折扣率** — 您在某区域内的购买从较低折扣套餐跨入较高的折扣套餐。您将按两种费率付费：一个或多个预留采用较低的折扣费率，剩余的预留采用较高的折扣费率。

### 跨越定价套餐
<a name="crossing-pricing-tiers"></a>

如果您的购买跨入某个折扣定价套餐范围，您将看到该项购买有多个条目：一个条目显示购买中将按常规价格收费的部分，另一个条目显示购买中将按适用的打折费率收费的部分。

Reserved Instance 服务会生成多个 Reserved Instance ID，因为您的购买从未打折套餐跨入到打折套餐，或从一个打折套餐跨入到另一个打折套餐。套餐中的每组预留都有一个 ID。因此，由购买 CLI 命令或 API 操作返回的 ID 不同于新预留实例的实际 ID。

### 定价套餐的整合账单
<a name="consolidating-billing"></a>

整合账单账户汇总了某个区域内所有成员账户的标价。当整合账单账户的所有活动 预留实例 的标价达到折扣定价套餐时，整合账单账户的任何账户成员在此后购买任何 预留实例 都将享受打折费率（前提是整合账单账户的标价始终高于折扣定价套餐阈值）。有关更多信息，请参阅 [预留实例和整合账单](#concepts-reserved-instances-billing)。
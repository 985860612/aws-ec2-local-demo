

# 可突增实例的无限模式概念
<a name="burstable-performance-instances-unlimited-mode-concepts"></a>

`unlimited` 是用于可突增性能实例的积分配置选项。可以随时对正在运行或已停止的实例启用或禁用它。您可以在每个 AWS 区域的账户级别[将 `unlimited` 设置为每个可突增性能实例系列的默认积分选项](burstable-performance-instances-how-to.md#burstable-performance-instance-set-default-credit-specification-for-account)，以便账户中所有新的可突增性能实例都使用默认积分选项启动。

## 无限可突增性能实例的工作原理
<a name="how-burstable-performance-instances-unlimited-works"></a>

如果配置为 `unlimited` 的可突增性能实例用完其 CPU 积分余额，它可能会花费*超额*积分以突增到[基准](burstable-credits-baseline-concepts.md#baseline_performance)以上。在该实例的 CPU 使用率低于基准时，实例会使用它获得的 CPU 积分支付以前花费的超额积分。凭借获得 CPU 积分来支付超额积分的能力，Amazon EC2 可以在 24 小时周期内将实例的 CPU 使用率保持在平均水平。如果 24 小时的平均 CPU 使用率超过基准，则会按每 vCPU 小时的[固定额外费率](https://aws.amazon.com/ec2/pricing/on-demand/#T2.2FT3.2FT4g_Unlimited_Mode_Pricing)对实例收取额外的使用费用。

下图显示 `t3.large` 的 CPU 使用率。`t3.large` 的基准 CPU 使用率为 30%。如果实例在 24 小时内以平均 30% CPU 使用率或更低运行，则没有额外费用，因为费用已由实例每小时价格所涵盖。但是，如果实例在 24 小时内以平均 40% 的 CPU 使用率运行（如图中所示），则会按每 vCPU 小时的[固定额外费率](https://aws.amazon.com/ec2/pricing/on-demand/#T2.2FT3.2FT4g_Unlimited_Mode_Pricing)对实例收取额外的 10% CPU 使用率费用。

![T3.large 实例的 CPU 使用情况计费。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/t3-cpu-usage.png)


有关每个实例类型的每个 vCPU 的基准利用率以及每个实例类型可获得的积分数的更多信息，请参阅[积分表](burstable-credits-baseline-concepts.md#burstable-performance-instances-credit-table)。

## 何时使用无限模式与固定 CPU
<a name="when-to-use-unlimited-mode"></a>

当确定您在 `unlimited` 模式下是应使用可突增性能实例（如 T3）还是固定性能实例（如 M5）时，您需要确定收支平衡 CPU 使用率。可突增性能实例的收支平衡 CPU 使用率是可突增性能实例与固定性能实例的费用相同的点。收支平衡 CPU 使用率可帮助您确定以下内容：
+ 如果 24 小时内的平均 CPU 使用率等于或低于收支平衡 CPU 使用率，请在 `unlimited` 模式下使用可突增性能实例，以便您可以受益于可突增性能实例的较低价格，同时获得与固定性能实例相同的性能。
+ 如果 24 小时内的平均 CPU 使用率高于收支平衡 CPU 使用率，可突增性能实例将花费比同等大小的固定性能实例更多的费用。如果 T3 实例以 100% CPU 持续突增，则您最终要支付的价格约为同等大小 M5 实例的价格的 1.5 倍。

下图显示了其中 `t3.large` 花费与 `m5.large` 花费相同的收支平衡 CPU 使用率点。`t3.large` 的收支平衡 CPU 使用率点为 42.5%。如果平均 CPU 使用率为 42.5%，则运行 `t3.large` 的费用与 `m5.large` 的运行费用相同，如果平均 CPU 使用率高于 42.5%，则前者费用更高。如果工作负载需要低于 42.5% 的平均 CPU 使用率，您可以受益于 `t3.large` 的较低价格，同时获得与 `m5.large` 相同的性能。

![T3.large 实例的收支平衡 CPU 使用率点为 42.5%。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/T3-unltd-when-to-use.png)


下表显示了如何计算收支平衡的 CPU 使用率阈值，以便您可以确定何时使用 `unlimited` 模式的可突增性能实例或固定性能实例将更为便宜。表中的列标记为 A 到 K。


|  实例类型  |  vCPU  |  T3 价格\*/小时  |  M5 价格\*/小时  |  价格差异  |  T3 的每个 vCPU 的基准利用率 (%)  |  向超额积分每 vCPU 小时收取费用  |  每 vCPU 分钟收费  |  每 vCPU 可用的额外突增分钟数  |  可用的额外 CPU %  |  收支平衡 CPU %  | 
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | 
| A | B | C | D  | E = D - C | F | G | H = G / 60 | I = E / H | J = (I / 60) / B | K = F \+ J | 
| t3.large | 2 | 0.0835 美元 | 0.096 美元 | 0.0125 USD | 30% | $0.05 | 0.000833 美元  | 15 | 12.5% | 42.5% | 


| 备注 | 
| --- | 
| \* 价格基于 us-east-1 和 Linux OS。 | 

该表提供以下信息：
+ 列 A 显示实例类型 `t3.large`。
+ 列 B 显示 `t3.large` 的 vCPU 数。
+ 列 C 显示每小时 `t3.large` 的价格。
+ 列 D 显示每小时 `m5.large` 的价格。
+ 列 E 显示 `t3.large` 和 `m5.large` 之间的价格差异。
+ F 列显示的是 `t3.large` 的每个 vCPU 的基准利用率，即 30%。在基准时，实例的每小时成本涵盖 CPU 使用率的成本。
+ 列 G 显示向实例收取的每 vCPU 小时的[固定额外费率](https://aws.amazon.com/ec2/pricing/on-demand/#T2.2FT3.2FT4g_Unlimited_Mode_Pricing)（如果实例在耗尽其获得的积分后以 100% CPU 突增）。
+ 列 H 显示向实例收取的每 vCPU 分钟的[固定额外费率](https://aws.amazon.com/ec2/pricing/on-demand/#T2.2FT3.2FT4g_Unlimited_Mode_Pricing)（如果实例在耗尽其获得的积分后以 100% CPU 突增）。
+ 列 I 显示 `t3.large` 可每小时以 100% CPU 突增的同时支付与 `m5.large` 相同的每小时价格的额外分钟数。
+ 列 J 显示该实例可突增的同时支付与 `m5.large` 相同的每小时价格的超过基准的额外 CPU 使用率（单位为 %）。
+ 列 K 显示 `t3.large` 在支付不超过 `m5.large` 的费用的情况下可突增的收支平衡 CPU 使用率（单位为 %）。除此之外，`t3.large` 的费用超过 `m5.large`。

下表显示了与类似大小的 M5 实例类型相比 T3 实例类型的收支平衡 CPU 使用率（单位为 %）。


| T3 实例类型 | T3 的收支平衡 CPU 使用率（单位为 %）（与 M5 相比） | 
| --- | --- | 
| t3.large | 42.5% | 
| t3.xlarge | 52.5% | 
| t3.2xlarge | 52.5% | 

## 超额积分会产生费用
<a name="unlimited-mode-surplus-credits"></a>

如果实例的平均 CPU 使用率等于或低于基准，则实例不会产生额外的费用。由于实例在 24 小时周期内可获得[最大数量的积分](burstable-credits-baseline-concepts.md#burstable-performance-instances-credit-table)（例如，`t3.micro` 实例可在 24 小时周期内获得最多 288 积分）的原因，因此在花费的超额积分不超过最大积分数时，不会立即向您收费。

但是，如果 CPU 利用率保持在基准以上，则实例无法获得足够的积分来支付已花费的超额积分。对于未支付的超额积分，按每 vCPU 小时的固定费率收取额外的费用。有关费率的信息，请参阅 [ T2/T3/T4g 无限模式定价 ](https://aws.amazon.com/ec2/pricing/on-demand/#T2.2FT3.2FT4g_Unlimited_Mode_Pricing)。

在出现以下任一情况时，将对之前花费的超额积分收费：
+ 花费的超额积分超出实例可在 24 小时周期内获得的[最大积分数](burstable-credits-baseline-concepts.md#burstable-performance-instances-credit-table)。对于超出最大积分数的所花费超额积分，将在该小时结束时向您收费。
+ 实例已停止或终止。
+ 实例从 `unlimited` 切换为 `standard`。

花费的超额积分是通过 CloudWatch 指标 `CPUSurplusCreditBalance` 跟踪的。通过 CloudWatch 指标 `CPUSurplusCreditsCharged` 来跟踪收费的超额积分。有关更多信息，请参阅 [可突增性能实例的其他 CloudWatch 指标](burstable-performance-instances-monitoring-cpu-credits.md#burstable-performance-instances-cw-metrics)。

## 无限突增性能的成本是多少？
<a name="how-much-does-unlimited-burstable-performance-cost"></a>

如果您使用了剩余的服务抵扣金，但这些服务抵扣金未被已获得的服务抵扣金予以清偿（请参阅 [超额积分会产生费用](#unlimited-mode-surplus-credits)），则需按照每 vCPU 小时的固定额外费率来支付剩余的服务抵扣金费用。费率列在 *Amazon EC2 按需型定价*页面上的 [T2/T3/T4g 无限模式定价](https://aws.amazon.com/ec2/pricing/on-demand/#T2.2FT3.2FT4g_Unlimited_Mode_Pricing)部分中。

## T2 无限实例没有启动积分
<a name="unlimited-mode-no-launch-credits"></a>

T2 标准实例可收到[启动积分](burstable-performance-instances-standard-mode-concepts.md#launch-credits)，但 T2 无限实例不会收到启动积分。T2 无限实例可以随时突增到基准以上，而不会收取额外的费用，但前提是在滚动 24 小时时间段或其生命周期（以较短者为准）内实例的平均 CPU 使用率等于或低于基准。因此，T2 无限实例不需要启动积分，即可在启动后立即达到较高的性能。

如果 T2 实例从 `standard` 切换到 `unlimited`，则将从 `CPUCreditBalance` 中扣除所有累积的启动积分，然后再结转剩余的 `CPUCreditBalance`。

T4g、T3a 和 T3 实例永远不会收到启动积分，因为这些实例默认以无限模式启动，所以才可以在启动时立即突增。无限模式积分配置让 T4g、T3a 和 T3 实例能够根据需要使用尽可能多的 CPU，以便在需要的时间内突增超出基准。

## 启用无限模式
<a name="unlimited-mode-enabling"></a>

您可以随时在正在运行或停止的实例上从 `unlimited` 切换到 `standard` 以及从 `standard` 切换到 `unlimited`。有关更多信息，请参阅[在启动时配置积分规范](burstable-performance-instances-how-to.md#launch-burstable-performance-instances) 和 [管理可突增性能实例的积分规范](burstable-performance-instances-how-to.md#modify-burstable-performance-instances)。

您可以在每个AWS区域的账户级别将 `unlimited` 设置为每个可突增性能实例系列的默认积分选项，以便账户中所有新的可突增性能实例都使用默认积分选项启动。有关更多信息，请参阅[管理账户的默认积分规范](burstable-performance-instances-how-to.md#burstable-performance-instance-set-default-credit-specification-for-account)。

您可以使用 Amazon EC2 控制台或 AWS CLI，检查可突增性能实例已配置为 `unlimited` 还是 `standard`。有关更多信息，请参阅 [配置可突增性能实例](burstable-performance-instances-how-to.md)。

## 在无限模式和标准模式之间切换时，积分会出现什么情况
<a name="unlimited-mode-switching-and-credits"></a>

`CPUCreditBalance` 是跟踪实例产生的积分数的 CloudWatch 指标。`CPUSurplusCreditBalance` 是跟踪实例所用超额积分数的 CloudWatch 指标。

当您将配置为 `unlimited` 的实例更改为 `standard` 时，会出现以下情况：
+ `CPUCreditBalance` 值保持不变并进行结转。
+ 立即针对 `CPUSurplusCreditBalance` 值进行收费。

在 `standard` 实例切换到 `unlimited` 时，会出现以下情况：
+ 将结转包含已累积获得的积分的 `CPUCreditBalance` 值。
+ 对于 T2 标准实例，将从 `CPUCreditBalance` 值中扣除所有启动积分，并且将结转包含已累积获得的积分的剩余 `CPUCreditBalance` 值。

## 监控积分使用情况
<a name="unlimited-mode-monitoring-credit-usage"></a>

要了解您实例花费的积分是否超过基准提供的积分，您可以使用 CloudWatch 指标来跟踪使用情况，并且可以设置小时警报，以便获得积分使用情况通知。有关更多信息，请参阅 [监控可突增实例的 CPU 积分](burstable-performance-instances-monitoring-cpu-credits.md)。
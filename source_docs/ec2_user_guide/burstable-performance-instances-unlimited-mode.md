

# 可突增性能实例的无限模式
<a name="burstable-performance-instances-unlimited-mode"></a>

配置为 `unlimited` 的可突增性能实例可以承受所需的任何时段的高 CPU 利用率。如果在滚动 24 小时或实例生命周期（以较短者为准）内实例的平均 CPU 使用率等于或低于基准，实例的每小时价格自动涵盖所有 CPU 使用峰值。

对于绝大多数通用型工作负载，配置为 `unlimited` 的实例可提供足够高的性能，而不会收取任何额外的费用。如果实例长时间以较高的 CPU 利用率运行，可能会按每 vCPU 小时的固定费率收取额外的费用。有关定价的信息，请参阅 [Amazon EC2 定价](https://aws.amazon.com/ec2/pricing/)和 [T2/T3/T4 无限模式定价](https://aws.amazon.com/ec2/pricing/on-demand/#T2.2FT3.2FT4g_Unlimited_Mode_Pricing)。

如果您在 2025 年 7 月 15 日之前创建 AWS 账户且使用的 `t2.micro` 或 `t3.micro` 实例享受[AWS Free Tier](https://aws.amazon.com/free/)优惠并在 `unlimited` 模式下使用，则在连续 24 小时内平均利用率超过实例的[基准利用率](burstable-credits-baseline-concepts.md#baseline_performance)时，您可能需要支付相应费用。

T4g、T3a 和 T3 实例默认情况下以 `unlimited` 模式启动（除非您[更改默认值](burstable-performance-instances-how-to.md#burstable-performance-instance-set-default-credit-specification-for-account)）。如果滚动 24 小时内的平均 CPU 使用率超过基准，将会产生超额积分费用。如果您以 `unlimited` 模式启动竞价型实例并计划立即短时间进行使用（没有空闲时间来累积 CPU 积分），则会产生超额积分费用。建议您以[标准](burstable-performance-instances-standard-mode.md)模式启动竞价型实例，以避免支付更高的费用。有关更多信息，请参阅 [超额积分会产生费用](burstable-performance-instances-unlimited-mode-concepts.md#unlimited-mode-surplus-credits) 和 [启动可突增性能实例](how-spot-instances-work.md#burstable-spot-instances)。

**注意**  
预设情况下 T3 实例在专属主机启动时启动为 `standard`；`unlimited` 模式不支持专属主机上的 T3 实例。

**Contents**
+ [可突增实例的无限模式概念](burstable-performance-instances-unlimited-mode-concepts.md)
  + [无限可突增性能实例的工作原理](burstable-performance-instances-unlimited-mode-concepts.md#how-burstable-performance-instances-unlimited-works)
  + [何时使用无限模式与固定 CPU](burstable-performance-instances-unlimited-mode-concepts.md#when-to-use-unlimited-mode)
  + [超额积分会产生费用](burstable-performance-instances-unlimited-mode-concepts.md#unlimited-mode-surplus-credits)
  + [无限突增性能的成本是多少？](burstable-performance-instances-unlimited-mode-concepts.md#how-much-does-unlimited-burstable-performance-cost)
  + [T2 无限实例没有启动积分](burstable-performance-instances-unlimited-mode-concepts.md#unlimited-mode-no-launch-credits)
  + [启用无限模式](burstable-performance-instances-unlimited-mode-concepts.md#unlimited-mode-enabling)
  + [在无限模式和标准模式之间切换时，积分会出现什么情况](burstable-performance-instances-unlimited-mode-concepts.md#unlimited-mode-switching-and-credits)
  + [监控积分使用情况](burstable-performance-instances-unlimited-mode-concepts.md#unlimited-mode-monitoring-credit-usage)
+ [可突增实例的无限模式示例](unlimited-mode-examples.md)
  + [示例 1：介绍 T3 无限版的积分使用情况](unlimited-mode-examples.md#t3_unlimited_example)
  + [示例 2：介绍 T2 无限版的积分使用情况](unlimited-mode-examples.md#t2_unlimited_example)
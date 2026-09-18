

# 可突增性能实例的标准模式
<a name="burstable-performance-instances-standard-mode"></a>

配置为 `standard` 的可突增性能实例适用于具有平均 CPU 利用率的工作负载，它始终低于实例的基准 CPU 利用率。为了突增到基准以上，实例会花费在其 CPU 积分余额中累积的积分。如果实例累积的积分较少，CPU 利用率将逐渐下降到基准水平，因此，在累积的 CPU 积分余额用完时，实例的性能不会急剧下降。有关更多信息，请参阅[可突增性能实例的关键概念](burstable-credits-baseline-concepts.md)。

**Contents**
+ [可突增实例的标准模式概念](burstable-performance-instances-standard-mode-concepts.md)
  + [标准可突增性能实例的工作原理](burstable-performance-instances-standard-mode-concepts.md#how-burstable-performance-instances-standard-works)
  + [启动积分](burstable-performance-instances-standard-mode-concepts.md#launch-credits)
  + [启动积分限制](burstable-performance-instances-standard-mode-concepts.md#launch-credit-limits)
  + [启动积分和获得的积分之间的区别](burstable-performance-instances-standard-mode-concepts.md#burstable-performance-instances-diff-launch-earned-credits)
+ [可突增实例的标准模式示例](standard-mode-examples.md)
  + [示例 1：介绍 T3 标准版的积分使用情况](standard-mode-examples.md#t3_standard_example)
  + [示例 2：介绍 T2 标准版的积分使用情况](standard-mode-examples.md#t2-standard-example)
    + [第 1 个时段：1 – 24 小时](standard-mode-examples.md#period-1)
    + [第 2 个时段：25 – 36 小时](standard-mode-examples.md#period-2)
    + [第 3 个时段：37 – 61 小时](standard-mode-examples.md#period-3)
    + [第 4 个时段：62 – 72 小时](standard-mode-examples.md#period-4)
    + [第 5 个时段：73 – 75 小时](standard-mode-examples.md#period-5)
    + [第 6 个时段：76 – 90 小时](standard-mode-examples.md#period-6)
    + [第 7 个时段：91 – 96 小时](standard-mode-examples.md#period-7)
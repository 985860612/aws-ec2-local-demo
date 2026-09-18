

# 可突增实例的标准模式概念
<a name="burstable-performance-instances-standard-mode-concepts"></a>

`standard` 是用于可突增性能实例的配置选项。可以随时对正在运行或已停止的实例启用或禁用它。您可以在每个 AWS 区域的账户级别[将 `standard` 设置为每个可突增性能实例系列的默认积分选项](burstable-performance-instances-how-to.md#burstable-performance-instance-set-default-credit-specification-for-account)，以便账户中所有新的可突增性能实例都使用默认积分选项启动。

## 标准可突增性能实例的工作原理
<a name="how-burstable-performance-instances-standard-works"></a>

当配置为 `standard` 的可突增性能实例处于运行状态时，它会以设定的每小时速率（以毫秒级精度）持续获得积分。对于 T2 标准模式，在实例停止后，会丢失积累的全部积分，积分余额会重置为零。在它重新启动后，会接受一组新的启动积分，并开始累积获得积分。对于 T4g、T3a 和 T3 标准实例，CPU 积分余额将在实例停止后保留七天，而后不复存在。如果在七天内启动实例，则不会丢失积分。

T2 标准实例会收到两种类型的 [CPU 积分](burstable-credits-baseline-concepts.md#key-concepts)：*获得的积分*以及*启动积分*。在 T2 标准实例处于运行状态时，它会以固定的每小时速率 (以毫秒级精度) 持续获得积分。在一开始，该实例尚未获得积分来提供良好的初始体验；因此为了提供良好的初始体验，一开始会收到启动积分，可以先花费，同时累积获得积分。

T4g、T3a 和 T3 实例不会收到启动积分，因为这些实例支持无限模式。无限模式积分配置让 T4g、T3a 和 T3 实例能够根据需要使用尽可能多的 CPU，以便在需要的时间内突增超出基准。

## 启动积分
<a name="launch-credits"></a>

在启动时，T2 标准实例的每个 vCPU 会获得 30 个启动积分，而 T1 标准实例会获得 15 个启动积分。例如，`t2.micro` 实例具有一个 vCPU 并获得 30 个启动积分，而 `t2.xlarge` 实例具有 4 个 vCPU 并获得 120 个启动积分。启动积分旨在提供良好的初始体验，以使实例能够在启动后 (没有累积获得积分之前) 立即突增到更高的性能。

首先花费启动积分，再使用获得的积分。未花费的启动积分将累积到 CPU 积分余额中，但不会计入 CPU 积分余额限制。例如，`t2.micro` 实例的 CPU 积分余额限制为 144 个获得的积分。如果实例启动并保持空闲状态 24 小时，其 CPU 积分余额将达到 174 (30 个启动积分 \+ 144 个获得的积分)，这已超过限制。不过，在实例花费 30 个启动积分后，积分余额就不能超过 144 个。有关每种实例大小的 CPU 积分余额限制的更多信息，请参阅[积分表](burstable-credits-baseline-concepts.md#burstable-performance-instances-credit-table)。

下表列出了在启动时分配的初始 CPU 积分以及 vCPU 数。


|  实例类型  |  启动积分  |  vCPU  | 
| --- | --- | --- | 
| t1.micro | 15 | 1 | 
| t2.nano | 30 | 1 | 
| t2.micro | 30 | 1 | 
| t2.small | 30 | 1 | 
| t2.medium | 60 | 2 | 
| t2.large | 60 | 2 | 
| t2.xlarge | 120 | 4 | 
| t2.2xlarge | 240 | 8 | 

## 启动积分限制
<a name="launch-credit-limits"></a>

T2 标准实例接收启动积分的次数存在限制。在每个区域，每 24 个小时的滚动周期内，每个账户中所有 T2 标准实例组合的默认限制是 100 次启动。例如，当一个实例在 24 小时周期内停止并启动 100 次时，或当 100 个实例在 24 小时周期内启动时，或者其他组合等同于 100 次启动时，将达到此限制。新账户可能具有较低的限制，该限制随着时间根据您的使用情况而增加。

**提示**  
要确保您的工作负载始终获得所需的性能，请切换到[可突增性能实例的无限模式](burstable-performance-instances-unlimited-mode.md)或考虑使用更大的实例。

## 启动积分和获得的积分之间的区别
<a name="burstable-performance-instances-diff-launch-earned-credits"></a>

下表列出了启动积分和获得的积分之间的区别。


|    |  启动积分  |  获得的积分  | 
| --- | --- | --- | 
| **积分获得率** | 在启动时，T2 标准实例的每个 vCPU 获得 30 个启动积分。<br />如果 T2 实例从 `unlimited` 切换到 `standard`，则在切换时不会获得启动积分。 | 每个 T2 实例以固定的每小时速率 (以毫秒级精度) 持续获得 CPU 积分，具体取决于实例大小。有关每种实例大小获得的 CPU 积分数量的更多信息，请参阅[积分表](burstable-credits-baseline-concepts.md#burstable-performance-instances-credit-table)。 | 
| **积分获得限制** | 对于每个区域，在每 24 个小时的滚动周期内，每个账户中所有 T2 标准实例组合的启动积分接收限制是 100 次启动。新账户可能具有较低的限制，该限制随着时间根据您的使用情况而增加。 | T2 实例累积的积分数不能超过 CPU 积分余额限制。如果 CPU 积分余额已达到其限制，则将丢弃在达到限制后获得的任何积分。启动积分不计入限制。有关每种 T2 实例大小的 CPU 积分余额限制的更多信息，请参阅[积分表](burstable-credits-baseline-concepts.md#burstable-performance-instances-credit-table)。 | 
| **积分使用** | 首先花费启动积分，再使用获得的积分。 | 只有花完所有启动积分后才能花费获得的积分。 | 
| **过期积分** | 在 T2 标准实例运行过程中，启动积分不会过期。当 T2 标准实例停止或切换至“T2 无限”时，所有启动积分都将丢失。 | 在 T2 实例运行过程中，已累积获得的积分不会过期。T2 实例停止后，将丢失所有已累积获得的积分。 | 

CloudWatch 指标 `CPUCreditBalance` 可跟踪已累积的启动积分和已累积获得的积分数。有关更多信息，请参阅 [CloudWatch 指标表](burstable-performance-instances-monitoring-cpu-credits.md#burstable-performance-instances-CW-metrics-table)中的 `CPUCreditBalance`。


# 监控可突增实例的 CPU 积分
<a name="burstable-performance-instances-monitoring-cpu-credits"></a>

EC2 将指标发送到 Amazon CloudWatch。您可以在 CloudWatch 控制台的 Amazon EC2 每个实例指标中查看 CPU 积分指标，也可以使用 AWS CLI 列出每个实例的指标。有关更多信息，请参阅 [可用于实例的 CloudWatch 指标](viewing_metrics_with_cloudwatch.md)。

**Topics**
+ [可突增性能实例的其他 CloudWatch 指标](#burstable-performance-instances-cw-metrics)
+ [计算使用的 CPU 积分](#burstable-performance-instances-calculating-credit-use)

## 可突增性能实例的其他 CloudWatch 指标
<a name="burstable-performance-instances-cw-metrics"></a>

可突增性能实例具有这些额外的 CloudWatch 指标，将每 5 分钟更新一次这些指标：
+ `CPUCreditUsage` – 在测量周期内花费的 CPU 积分数。
+ `CPUCreditBalance` – 实例产生的 CPU 积分数量。在 CPU 突增以及 CPU 积分的花费速度比获得速度快时，该余额将用完。
+ `CPUSurplusCreditBalance` – 在 `CPUCreditBalance` 值为零时，用于保持 CPU 利用率而花费的超额 CPU 积分数。
+ `CPUSurplusCreditsCharged` – 超过可在 24 小时内获得的 [CPU 积分数上限](burstable-credits-baseline-concepts.md#burstable-performance-instances-credit-table)的超额 CPU 积分数，因而会产生额外的费用。

最后两个指标仅适用于配置为 `unlimited` 的实例。

下表描述了可突增性能实例的 CloudWatch 指标。有关更多信息，请参阅[可用于实例的 CloudWatch 指标](viewing_metrics_with_cloudwatch.md)。


| 指标 | 描述 | 
| --- | --- | 
| CPUCreditUsage | 实例为保持 CPU 使用率而花费的 CPU 积分数。一个 CPU 积分等于一个 vCPU 按 100% 利用率运行一分钟，或者 vCPU、利用率和时间的等效组合（例如， 一个 vCPU 按 50% 利用率运行两分钟，或者两个 vCPU 按 25% 利用率运行两分钟）。<br />CPU 积分指标仅每 5 分钟提供一次。如果您指定一个大于五分钟的时间段，请使用`Sum` 统计数据，而非 `Average` 统计数据。<br />单位：积分 (vCPU 分钟) | 
| CPUCreditBalance | 实例自启动后已累积获得的 CPU 积分数。对于 T2 标准，`CPUCreditBalance` 还包含已累积的启动积分数。<br />在获得积分后，积分将在积分余额中累积；在花费积分后，将从积分余额中扣除积分。积分余额具有最大值限制，这是由实例大小决定的。在达到限制后，将丢弃获得的任何新积分。对于 T2 标准，启动积分不计入限制。<br />实例可以花费 `CPUCreditBalance` 中的积分，以便突增到基准 CPU 使用率以上。<br />在实例运行过程中，`CPUCreditBalance` 中的积分不会过期。在 T4g、T3a 或 T3 实例停止时，`CPUCreditBalance` 值将保留七天。之后，所有累积的积分都将丢失。在 T2 实例停止时，`CPUCreditBalance` 值不会保留，并且所有累积的积分都将丢失。<br />CPU 积分指标仅每 5 分钟提供一次。<br />单位：积分 (vCPU 分钟) | 
| CPUSurplusCreditBalance  | 在 `unlimited` 值为零时，`CPUCreditBalance` 实例花费的超额积分数。<br />`CPUSurplusCreditBalance` 值由获得的 CPU 积分支付。如果超额积分数超出实例可在 24 小时周期内获得的最大积分数，则超出最大积分数的已花费超额积分将产生额外费用。<br />单位：积分 (vCPU 分钟)  | 
| CPUSurplusCreditsCharged | 未由获得的 CPU 积分支付并且会产生额外费用的已花费超额积分数。<br />在出现以下任一情况时，将对花费的超额积分收费：+  花费的超额积分超出实例可在 24 小时周期内获得的最大积分数。对于超出最大积分数的所花费超额积分，将在该小时结束时向您收费。 <br />+  实例已停止或终止。 <br />+  实例从 `unlimited` 切换为 `standard`。 <br />单位：积分 (vCPU 分钟)  | 

## 计算使用的 CPU 积分
<a name="burstable-performance-instances-calculating-credit-use"></a>

实例使用的 CPU 积分使用上表中所述的实例 CloudWatch 指标计算。

Amazon EC2 每 5 分钟向 CloudWatch 发送一次指标。在任何时间点引用的*以前* 指标值是指 *5 分钟前* 发送的以前指标值。

### 计算标准实例使用的 CPU 积分
<a name="burstable-performance-instances-standard-calculation"></a>
+ 如果 CPU 使用率低于基准，此时花费的积分低于前 5 分钟间隔获得的积分，CPU 积分余额将增加。
+ 如果 CPU 使用率高于基准，此时花费的积分超过前 5 分钟间隔获得的积分，CPU 积分余额将减少。

从数学上讲，这是使用以下公式得出的：

**Example**  

```
CPUCreditBalance = prior CPUCreditBalance + [Credits earned per hour * (5/60) - CPUCreditUsage]
```

实例大小确定实例每小时可获得的积分数以及实例可在积分余额中累积获得的积分数。有关每小时获得的积分数的信息，以及每个实例大小的积分余额限制，请参阅[积分表](burstable-credits-baseline-concepts.md#burstable-performance-instances-credit-table)。

**示例**  
该示例使用 `t3.nano` 实例。要计算实例的 `CPUCreditBalance` 值，请按以下方式使用前面的公式：
+ `CPUCreditBalance` – 要计算的当前积分余额。
+ `prior CPUCreditBalance` – 5 分钟前的积分余额。在该示例中，实例累积了两积分。
+ `Credits earned per hour` – `t3.nano` 实例每小时获得 6 积分。
+ `5/60` – 表示 CloudWatch 指标发布的 5 分钟间隔。将每小时获得的积分乘以 5/60（5 分钟）以计算实例在过去 5 分钟获得的积分数。`t3.nano` 实例每 5 分钟获得 0.5 积分。
+ `CPUCreditUsage` – 实例在过去 5 分钟内花费的积分数。在该示例中，实例在过去 5 分钟内花费 1 积分。

您可以使用这些值计算 `CPUCreditBalance` 值：

**Example**  

```
CPUCreditBalance = 2 + [0.5 - 1] = 1.5
```

### 计算无限实例使用的 CPU 积分
<a name="burstable-performance-instances-unlimited-calculation"></a>

在可突增性能实例需要突增到基准以上时，它始终先花费累积的积分，然后再花费超额积分。在用完累积的 CPU 积分余额时，它会花费超额积分以将 CPU 突增所需的时间。在 CPU 使用率低于基准时，在实例累积获得的积分之前始终先支付超额积分。

我们在以下公式中使用 `Adjusted balance` 项以反映在该 5 分钟间隔内发生的活动。我们使用该值计算 `CPUCreditBalance` 和 `CPUSurplusCreditBalance` CloudWatch 指标的值。

**Example**  

```
Adjusted balance = [prior CPUCreditBalance - prior CPUSurplusCreditBalance] + [Credits earned per hour * (5/60) - CPUCreditUsage]
```

如果 `0` 的值为 `Adjusted balance`，表示实例花费获得的所有积分来进行突增，而未花费任何超额积分。因此，`CPUCreditBalance` 和 `CPUSurplusCreditBalance` 均设置为 `0`。

正的 `Adjusted balance` 值表示实例累积获得了积分，并支付了以前的超额积分 (如果有)。因此，将 `Adjusted balance` 值分配给 `CPUCreditBalance`，并将 `CPUSurplusCreditBalance` 设置为 `0`。实例大小决定了可累积的[最大积分数](burstable-credits-baseline-concepts.md#burstable-performance-instances-credit-table)。

**Example**  

```
CPUCreditBalance = min [max earned credit balance, Adjusted balance]
CPUSurplusCreditBalance = 0
```

负的 `Adjusted balance` 值表示实例花费了其累积获得的所有积分，并且还花费了超额积分来进行突增。因此，将 `Adjusted balance` 值分配给 `CPUSurplusCreditBalance`，并将 `CPUCreditBalance` 设置为 `0`。此外，实例大小决定了它可累积的[最大积分数](burstable-credits-baseline-concepts.md#burstable-performance-instances-credit-table)。

**Example**  

```
CPUSurplusCreditBalance = min [max earned credit balance, -Adjusted balance]
CPUCreditBalance = 0
```

如果花费的超额积分超过了实例可累积的最大积分，超额积分余额将设置为最大值，如前面的公式中所示。将对剩余的超额积分收费，如 `CPUSurplusCreditsCharged` 指标表示。

**Example**  

```
CPUSurplusCreditsCharged = max [-Adjusted balance - max earned credit balance, 0]
```

最后，在实例终止时，将对由 `CPUSurplusCreditBalance` 跟踪的任何超额积分收费。如果实例从 `unlimited` 切换到 `standard`，则还会对任何剩余的 `CPUSurplusCreditBalance` 收费。
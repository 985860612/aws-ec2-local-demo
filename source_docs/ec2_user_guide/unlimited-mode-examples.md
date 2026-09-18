

# 可突增实例的无限模式示例
<a name="unlimited-mode-examples"></a>

以下示例介绍当实例配置为 `unlimited` 时的积分使用情况。

**Topics**
+ [示例 1：介绍 T3 无限版的积分使用情况](#t3_unlimited_example)
+ [示例 2：介绍 T2 无限版的积分使用情况](#t2_unlimited_example)

## 示例 1：介绍 T3 无限版的积分使用情况
<a name="t3_unlimited_example"></a>

在此示例中，您可以查看作为 `t3.nano` 启动的 `unlimited` 实例的 CPU 利用率，以及它如何花费*获得* 的积分和*超额* 积分来保持 CPU 利用率。

`t3.nano` 实例在 24 小时滚动周期内获得 144 个 CPU 积分，这些积分可兑换 144 分钟 vCPU 使用时间。在实例用完 CPU 积分余额（由 CloudWatch 指标 `CPUCreditBalance`表示）时，它会花费*超额* CPU 积分—（*尚未获得的* 积分）—以突增所需的时间。由于 `t3.nano` 实例在 24 小时周期内最多可获得 144 积分，因此，在花费的超额积分不超过该最大积分数时，不会立即向您收费。如果花费 144 个以上的 CPU 积分，则会在该小时结束时对超出的部分进行收费。

下图所示的示例旨在说明实例如何使用超额积分突增到基准以上，甚至在用完 `CPUCreditBalance` 后。以下工作流程引用图中的编号数据点：

**P1** – 在图表中的 0 小时处，实例以 `unlimited` 模式启动并立即开始获得积分。实例自启动后保持闲置状态（CPU 利用率为 0%），不使用任何积分。所有未使用的积分都累积到积分余额中。对于前 24 小时，`CPUCreditUsage` 为 0，而 `CPUCreditBalance` 值达到其最大值 144。

**P2** – 对于接下来的 12 小时，CPU 利用率为 2.5%，这低于 5% 基准。实例获得的积分多于花费的积分，但 `CPUCreditBalance` 值不能超过其最大值 144 积分。

**P3** – 对于接下来的 24 小时，CPU 利用率为 7%（高于基准），这要求花费 57.6 积分。实例花费的积分多于获得的积分，`CPUCreditBalance` 值降至 86.4 积分。

**P4** – 对于接下来的 12 小时，CPU 利用率降至 2.5%（低于基准），这要求花费 36 积分。同时，实例获得 72 积分。实例获得的积分多于花费的积分，`CPUCreditBalance` 值增至 122 积分。

**P5** – 对于接下来的 5 小时，实例突增至 100% CPU 利用率，并花费总计 570 积分来持续突增。在进入此期间的大约一小时内，此实例用完其整个 `CPUCreditBalance` 122 积分，并开始花费超额积分来维持高的 CPU 利用率，在此期间总共花费 448 个超额积分 (570-122=448)。当 `CPUSurplusCreditBalance` 值达到 144 个 CPU 积分（`t3.nano` 实例在 24 小时内可获得的最大值）时，之后任何花费的超额积分都无法由获得的积分抵消。之后花费的超额积分总计为 304 积分 (448-144=304)，这会导致这一小时结束后对于这 304 积分收取很小的一笔附加费。

**P6** – 对于接下来的 13 小时，CPU 利用率为 5%（基准）。实例获得的积分与花费的积分一样多，而无需额外支付 `CPUSurplusCreditBalance` 的费用。`CPUSurplusCreditBalance` 值保持为 144 积分。

**P7** – 对于本例中的最后 24 小时，实例空闲，CPU 利用率为 0%。在此期间，实例获得 144 积分，用于支付 `CPUSurplusCreditBalance` 的费用。

![T3 实例在 24 小时后获得 144 积分。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/t3_unlimited_graph.png)


## 示例 2：介绍 T2 无限版的积分使用情况
<a name="t2_unlimited_example"></a>

在此示例中，您可以查看作为 `t2.nano` 启动的 `unlimited` 实例的 CPU 利用率，以及它如何花费*获得* 的积分和*超额* 积分来保持 CPU 利用率。

`t2.nano` 实例在 24 小时滚动周期内获得 72 个 CPU 积分，这些积分可兑换 72 分钟 vCPU 使用时间。在实例用完 CPU 积分余额（由 CloudWatch 指标 `CPUCreditBalance`表示）时，它会花费*超额* CPU 积分—（*尚未获得的* 积分）—以突增所需的时间。由于 `t2.nano` 实例在 24 小时周期内最多可获得 72 积分，因此，在花费的超额积分不超过该最大积分数时，不会立即向您收费。如果花费 72 个以上的 CPU 积分，则会在该小时结束时对超出的部分进行收费。

下图所示的示例旨在说明实例如何使用超额积分突增到基准以上，甚至在用完 `CPUCreditBalance` 后。您可以假定，在图表的时间线开始时，实例累积的积分余额等于它可在 24 小时内获得的最大积分数。以下工作流程引用图中的编号数据点：

**1** – 在前 10 分钟内，`CPUCreditUsage` 设置为 0 并且 `CPUCreditBalance` 值始终为最大值 72。

**2** – 在 23:40，随着 CPU 使用率增加，实例花费 CPU 积分并且 `CPUCreditBalance` 值减少。

**3** – 在大约 00:47，实例用完全部 `CPUCreditBalance`，并开始花费超额积分以保持较高的 CPU 利用率。

**4** – 一直花费超额积分，直到 1:55，此时 `CPUSurplusCreditBalance` 值达到 72 个 CPU 积分。这等于 `t2.nano` 实例在 24 小时周期内可获得的最大积分数。以后花费的任何超额积分无法由 24 小时周期内获得的积分抵消，这会导致在该小时结束时收取少量的额外费用。

**5** – 在大约 2:20，实例继续花费超额积分。此时，CPU 使用率低于基准并且实例开始获得积分，每小时 3 积分 (或每 5 分钟 0.25 积分)，它使用这些积分来支付 `CPUSurplusCreditBalance`。在 `CPUSurplusCreditBalance` 值减少到 0 后，实例开始在其 `CPUCreditBalance` 中累积获得积分（每 5 分钟 0.25 积分）。

![以无限模式启动的 t2.nano 实例的 CPU 使用率图示。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/t2_unlimited_graph.png)


**计算账单（Linux 实例）**  
超额积分每 vCPU 小时收取 0.05 美元。在 1:55 和 2:20 之间，实例大约花费 25 个超额积分，这相当于 0.42 个 vCPU 小时。该实例产生的额外费用为 0.42 vCPU 小时 x 0.05 美元/vCPU 小时 = 0.021 美元，舍入到 0.02 美元。下面是该 T2 无限实例的月末账单：

![T2 无限实例的账单示例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/t2_unlimited_bill_linux.png)


**计算账单（Windows 实例）**  
超额积分每 vCPU 小时收取 0.096 美元。在 1:55 和 2:20 之间，实例大约花费 25 个超额积分，这相当于 0.42 个 vCPU 小时。该实例产生的额外费用为 0.42 vCPU 小时 x 0.096 美元/vCPU 小时 = 0.04032 美元，舍入到 0.04 美元。下面是该 T2 无限实例的月末账单：

![T2 无限实例的账单示例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/t2_unlimited_bill_windows.png)


您可以设置账单提醒以每小时通知一次产生的任何费用，并在必要时采取相应的措施。
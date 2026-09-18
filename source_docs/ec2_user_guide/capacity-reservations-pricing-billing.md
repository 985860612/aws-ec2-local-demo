

# 容量预留定价和计费
<a name="capacity-reservations-pricing-billing"></a>

本节中的主题旨在概述容量预留的定价和计费。

**Topics**
+ [定价](#capacity-reservations-pricing)
+ [计费](#capacity-reservations-billing)
+ [账单折扣](#capacity-reservations-discounts)
+ [成本和使用情况报告 2.0 中的取消费用](#capacity-reservations-cancellation-billing-cur)
+ [查看您的账单](#capacity-reservations-viewing-bill)

## 定价
<a name="capacity-reservations-pricing"></a>

无论您是否在预留容量中运行实例，都按等同的按需费率为您计算容量预留费用，包括专用实例任何使用的区域额外费用。如果您没有使用预留，这将在您的 Amazon EC2 账单中显示为未使用的预留。如果您运行的实例属性与预留匹配，则您只需要为该实例付费，不需要为预留付费。没有任何预付费用或额外收费。

例如，如果您为 20 个 `m4.large` Linux 实例创建容量预留并在同一个可用区中运行 15 个 `m4.large` Linux 实例，则会向您收取 15 个活动的实例和预留中 5 个未使用的实例的费用。

节省计划和区域性预留实例的账单折扣适用于容量预留。有关更多信息，请参阅[账单折扣](#capacity-reservations-discounts)。

有关更多信息，请参阅 [Amazon EC2 定价](https://aws.amazon.com/ec2/pricing/)。

## 计费
<a name="capacity-reservations-billing"></a>

计费在您的账户中预置容量预留后立即开始，并在容量预留保持在账户中预置状态期间继续计费。对于未来日期的容量预留，这意味着只有在请求的未来日期于您的账户中预置容量预留后，才会开始计费。

容量预留按秒级粒度计费，最低计费时长为 60 秒。这意味着会向您收取不足一小时的费用。例如，如果容量预留在您的账户中保持预置状态 `24` 小时 `15` 分钟，则会向您收取 `24.25` 个预留小时的费用。

下面的示例说明如何对容量预留计费。为一个 `m4.large` Linux 实例创建了容量预留，其按需费率为每使用一小时 0.10 美元。在此示例中，账户内的容量预留预置了五个小时。第一个小时未使用容量预留，因此按照 `m4.large` 实例类型的标准按需费率计入一小时未使用费用。从第二个小时到第五个小时，`m4.large` 实例占用了容量预留。在这段时间内，容量预留不会产生任何费用，改为向账户收取占用这部分容量的 `m4.large` 实例的费用。在第六个小时取消了容量预留，并在预留容量之外正常运行 `m4.large` 实例。对于这一个小时，将以 `m4.large` 实例类型的按需费率进行收费。

![容量预留计费示例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/cr-billing-example.png)


## 账单折扣
<a name="capacity-reservations-discounts"></a>

节省计划和区域性预留实例的账单折扣适用于容量预留。AWS 自动将这些折扣应用于具有匹配属性的容量预留。当容量预留由某个实例使用时，折扣将适用于该实例。折扣将优先适用于已产生的实例使用量，然后再用于未使用的容量预留。

区域预留实例的账单折扣不适用于容量预留。

有关更多信息，请参阅下列内容：
+ [Amazon EC2 的预留实例概览](ec2-reserved-instances.md)
+ [节省计划用户指南](https://docs.aws.amazon.com/savingsplans/latest/userguide/)
+ [计费和购买选项](https://aws.amazon.com/ec2/faqs/#capacityreservations)

## 成本和使用情况报告 2.0 中的取消费用
<a name="capacity-reservations-cancellation-billing-cur"></a>

如果您取消未来日期的容量预留，并且需要支付取消费用，费用将显示在 AWS 成本和使用情况报告（CUR）2.0 中。有关 CUR 2.0 中容量预留列的更多信息，请参阅[容量预留列](https://docs.aws.amazon.com/cur/latest/userguide/table-dictionary-cur2-capacity-reservation.html)。下表显示了取消之前和之后的容量预留行项目的显示情况。


**有效预留的 CUR 2.0 值**  

| capacity\_reservation\_capacity\_reservation\_status | line\_item\_usage\_type | 代表什么 | 
| --- | --- | --- | 
| Reserved | 预留 | 预留容量总量 | 
| Used | BoxUsage | 启动的实例 | 
| Unused | UnusedBox | 空闲容量 | 


**取消后的 CUR 2.0 值**  

| capacity\_reservation\_capacity\_reservation\_status | line\_item\_usage\_type | 代表什么 | 
| --- | --- | --- | 
| Cancelling | 预留 | 已取消的容量 | 
| Cancelling | UnusedBox | 取消费用 | 

## 查看您的账单
<a name="capacity-reservations-viewing-bill"></a>

您可以在 AWS 账单与成本管理 控制台上查看您账户的费用情况。
+ **控制面板**显示了您的账户的花费汇总。
+ 在 **Bills (账单)** 页面上的 **Details (详细信息)** 下，展开 **Elastic Compute Cloud** 部分及区域，以获取有关您的容量预留的账单信息。

您可以在线查看费用，也可以下载 CSV 文件。有关更多信息，请参阅 [Capacity Reservation line items](https://docs.aws.amazon.com/cur/latest/userguide/monitor-ondemand-reservations.html#capacity-reservation-li)。
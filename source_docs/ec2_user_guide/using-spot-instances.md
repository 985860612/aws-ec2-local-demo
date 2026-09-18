

# Spot Instances
<a name="using-spot-instances"></a>

竞价型实例是一种使用备用 EC2 容量的实例，以低于按需价格提供。由于竞价型实例允许您以极低的折扣请求未使用的 EC2 实例，这可能会显著降低您的 Amazon EC2 成本。竞价型实例的每小时价格称为 Spot 价格。每个可用区中的每种实例类型的 Spot 价格是由 Amazon EC2 设置的，并根据竞价型实例的长期供求趋势逐步调整。您的竞价型实例在容量可用时运行。

如果能灵活控制应用程序的运行时间并且应用程序可以中断，竞价型实例就是经济实惠之选。例如，竞价型实例非常适合数据分析、批处理作业、后台处理和可选的任务。有关更多信息，请参阅 [Amazon EC2 竞价型实例](https://aws.amazon.com/ec2/spot/)。

有关 EC2 实例不同购买选项的比较，请参阅 [Amazon EC2 账单和购买选项](instance-purchasing-options.md)。

## 概念
<a name="spot-features"></a>

在开始使用竞价型实例之前，应该熟悉以下概念：
+ *Spot 容量池* – 一组具有相同实例类型（如 `m5.large`）和可用区的未使用 EC2 实例。
+ *Spot 价格* –竞价型实例的当前每小时价格。
+ *竞价型实例请求* – 请求竞价型实例。当有容量可用时，Amazon EC2 将满足您的请求。竞价型实例请求是*一次性*或者*持续性*请求。在与请求关联的竞价型实例中断之后，Amazon EC2 会自动重新提交持续性竞价型实例请求。
+ *EC2 实例再平衡建议* – Amazon EC2 发出实例再平衡建议信号，以通知您竞价型实例处于中断高风险。此信号使您有机会在现有或新的竞价型实例间主动再平衡工作负载，而无需等待两分钟的竞价型实例中断通知。
+ *竞价型实例中断* – 如果 Amazon EC2 需要回收容量，Amazon EC2 会将您的竞价型实例停止、停止或休眠。Amazon EC2 将提供竞价型实例中断通知，这会在实例中断之前为其提供两分钟的警告。

## 竞价型实例与按需型实例的区别
<a name="key-differences-spot-on-demand"></a>

下表列出了竞价型实例与[按需型实例](ec2-on-demand-instances.md)之间的主要区别。


|  | 竞价型实例 | On-Demand Instances | 
| --- | --- | --- | 
| 启动时间 | 只有竞价型实例请求处于活动状态并且有可用容量时才能立即启动。 | 只有发出手动启动请求并且有可用容量时才能立即启动。 | 
| 可用容量 | 如果没有可用容量，则竞价型实例请求会继续自动发起启动请求，直到有可用容量为止。 | 如果在发出启动请求时没有可用容量，您会收到容量不足错误 (ICE)。 | 
| 每小时价格 | 竞价型实例的每小时价格根据长期的供需情况而有所调整。 | 按需型实例的每小时价格是静态的。 | 
| 再平衡建议 | 当实例处于较高的中断风险时，Amazon EC2 为正在运行的竞价型实例发出信号。 | 您可以决定何时中断个按需型实例（停止、休眠或终止）。 | 
| 实例中断 | 您可以停止和启动由 Amazon EBS 支持的竞价型实例。此外，如果容量不再可用，Amazon EC2 可能会[中断](spot-interruptions.md)单个竞价型实例。 | 您可以决定何时中断个按需型实例（停止、休眠或终止）。 | 

## 定价和节省
<a name="spot-pricing"></a>

您可以为竞价型实例支付 Spot 价格，该价格由 Amazon EC2 设置，并根据竞价型实例的长期供求趋势逐步进行调整。您的竞价型实例将持续运行，直到您将其终止、容量不再可用或您的 Amazon EC2 Auto Scaling 组在[横向缩减](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-lifecycle.html#as-lifecycle-scale-in)期间将其终止为止。

如果您或 Amazon EC2 中断正在运行的竞价型实例，您将按使用的秒数或整个小时付费，或者您不收取任何费用，具体取决于所使用的操作系统以及竞价型实例的中断方。有关更多信息，请参阅 [中断的竞价型实例的计费](billing-for-interrupted-spot-instances.md)。

节省计划不涵盖竞价型实例。如果您使用了节省计划，那么除了使用竞价型实例已经节省的费用外，此计划不会节省额外的费用。此外，您在竞价型实例上的支出并不适用于计算类节省计划中的承诺。

### 查看价格
<a name="spot-pricing-view-prices"></a>

要查看各个 AWS 区域和实例类型的当前最低竞价型实例价格（每 5 分钟更新一次），请参阅 [Amazon EC2 竞价型实例定价](https://aws.amazon.com/ec2/spot/pricing/) 页面。

要查看过去三个月竞价型实例价格的历史记录，请使用 Amazon EC2 控制台或 [describe-spot-price-history](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-spot-price-history.html) 命令。有关更多信息，请参阅 [查看竞价型实例定价历史记录](using-spot-instances-history.md)。

我们将可用区独立地映射到每个 AWS 账户的代码。因此，不同账户的相同可用区代码 (如 `us-west-2a`) 可能会返回不同的结果。

### 查看节省
<a name="spot-pricing-view-savings"></a>

您可以查看使用单个 [竞价型实例集](Fleets.md) 或所有竞价型实例时通过使用竞价型实例所节省的成本。您可以查看过去一小时或过去三天的节省，还可以查看每 vCPU 小时和每内存 (GiB) 小时的平均费用。节省是估算的，因为未算入您使用期间的计费调整，所以可能与实际的节省有所差异。有关查看节省信息的更多信息，请参阅[通过购买竞价型实例实现节省](spot-savings.md)。

### 查看账单
<a name="spot-pricing-view-billing"></a>

您的账单提供了服务使用量的详细信息。有关更多信息，请参阅 *AWS Billing 用户指南*中的[查看您的账单](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/getting-viewing-bill.html)。
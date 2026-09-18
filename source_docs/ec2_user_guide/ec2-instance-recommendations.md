

# 从 Compute Optimizer 获取 EC2 实例建议
<a name="ec2-instance-recommendations"></a>

AWS Compute Optimizer 提供了 Amazon EC2 建议，以帮助您提高性能和/或节省资金。您可以根据这些建议来决定是否更改为新的实例类型。

为了生成建议，Compute Optimizer 会分析现有实例规范和利用率指标。然后，利用已编译数据来建议哪些 Amazon EC2 实例类型能够最好地处理现有工作负载。建议随每小时实例定价一起返回。有关更多信息，请参阅《AWS Compute Optimizer User Guide》**中的 [Amazon EC2 instance metrics](https://docs.aws.amazon.com/compute-optimizer/latest/ug/metrics.html#ec2-metrics-analyzed)。

**Topics**
+ [要求](#compute-optimizer-limitations)
+ [结果分类](#findings-classifications)
+ [查看建议](#viewing-recommendations)
+ [评估建议时的注意事项](#considerations)

## 要求
<a name="compute-optimizer-limitations"></a>

要从 Compute Optimizer 中获取建议，您必须首先选择加入 Compute Optimizer。有关更多信息，请参阅 *AWS Compute Optimizer 用户指南*中的 [AWS Compute Optimizer 入门](https://docs.aws.amazon.com/compute-optimizer/latest/ug/getting-started.html)。

Compute Optimizer 会为某些实例类型生成建议，但不会为所有实例类型生成建议。如果您使用不支持的实例类型，Compute Optimizer 将不会生成建议。有关支持的实例类型的列表，请参阅《AWS Compute Optimizer User Guide》**中的 [Amazon EC2 instance requirements](https://docs.aws.amazon.com/compute-optimizer/latest/ug/requirements.html#requirements-ec2-instances)。

## 结果分类
<a name="findings-classifications"></a>

Compute Optimizer 将其对 EC2 实例的调查结果分类为：
+ **预配置不足** – 当您的实例的至少一个规格（如 CPU、内存或网络）没有满足工作负载的性能要求时，将 EC2 实例视为预配置不足。预配置不足的 EC2 实例可能会导致应用程序性能较差。
+ **过度预配置** – 当您的实例的至少一个规格（如 CPU、内存或网络）可缩小但仍能满足工作负载的性能要求时，并且没有任何规格处于预配置不足状态时，将 EC2 实例视为过度预配置。过度预配置的 EC2 实例可能会导致不必要的基础设施成本。
+ **已优化** – 当您的实例的所有规格（如 CPU、内存和网络）满足工作负载的性能要求且实例未处于过度预配置状态时，将 EC2 实例视为已优化。已优化的 EC2 实例以最佳的性能和基础设施成本运行您的工作负载。对于已优化的实例，Compute Optimizer 有时可能会建议新一代实例类型。
+ **无** – 没有对此实例的建议。如果您选择加入 Compute Optimizer 的时间少于 12 小时、实例的运行时间少于 30 小时，或者 Compute Optimizer 不支持实例类型，则可能会发生这种情况。

## 查看建议
<a name="viewing-recommendations"></a>

在选择加入 Compute Optimizer 后，您可以在 Amazon EC2 控制台中查看 Compute Optimizer 为 EC2 实例生成的结果。然后，您可以访问 Compute Optimizer 控制台来查看建议。如果您是最近选择加入的，EC2 控制台可能在长达 12 小时内不会反映调查结果。

**使用 Amazon EC2 控制台查看实例的建议**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例 ID 以打开实例详细信息页面。

1. 在实例详细信息页面的顶部摘要部分，找到 **AWS Compute Optimizer 调查发现**。如果有调查发现，我们会显示调查发现分类和查看详细信息的链接。否则，我们将显示**此实例没有可用的建议**。

1. 如果有调查发现，请选择**查看详细信息**。这将打开 Compute Optimizer 控制台中的 **EC2 实例建议**页面。当前实例类型标记为**当前**。还有最多三个实例类型建议，分别标记为**选项 1**、**选项 2** 和**选项 3**。此页面还显示了该实例的最新 CloudWatch 指标数据。

**查看对所有区域中所有实例的建议**  
您可以使用 Compute Optimizer 控制台查看所有区域中所有 Amazon EC2 实例的建议。有关更多信息，请参阅《AWS Compute Optimizer User Guide》**中的 [Viewing EC2 instances recommendations](https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ec2-recommendations.html#ec2-view-recommendations) 和 [Viewing EC2 instance details](https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ec2-recommendations.html#ec2-viewing-details)。

## 评估建议时的注意事项
<a name="considerations"></a>

在收到建议时，您必须决定是否执行操作。在更改实例类型之前，请考虑以下事项：
+ 这些建议不会预测您的使用情况。建议基于您在最近 14 天时间段内的历史使用情况。请务必选择一种预计能够满足您的未来资源需求的实例类型。
+ 关注图表指标以确定实际使用量是否低于实例容量。您还可以在 CloudWatch 中查看指标数据（平均值、峰值、百分比），以进一步评估 EC2 实例建议。例如，观察当天 CPU 百分比指标如何变化，以及是否有需要满足的峰值。有关更多信息，请参阅 *Amazon CloudWatch 用户指南* 中的[查看可用指标](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html)。
+ Compute Optimizer 可能会为可突增性能实例（即 T3、T3a 和 T2 实例）提供建议。如果您定期突增至基线之上，请确保您可以基于新实例类型的 vCPU 继续如此。有关更多信息，请参阅[可突增性能实例的关键概念](burstable-credits-baseline-concepts.md)。
+ 如果您购买了 Reserved Instance，您的个按需型实例可能会作为 Reserved Instance 进行计费。在更改当前实例类型之前，请首先评估对Reserved Instance使用率和覆盖率的影响。
+ 尽可能考虑转换为较新一代实例。
+ 在迁移到其他实例系列时，请确保当前实例类型和新实例类型在虚拟化、架构或网络类型等方面兼容。有关更多信息，请参阅[更改实例类型的兼容性](resize-limitations.md)。
+ 最后，请考虑为每个建议提供的性能风险评级。性能风险表示您为验证建议的实例类型是否满足工作负载的性能要求而可能需要投入的工作量。我们还建议在进行任何更改前后进行严格的负载和性能测试。
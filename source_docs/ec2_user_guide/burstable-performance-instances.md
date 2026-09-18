

# 可突增性能实例
<a name="burstable-performance-instances"></a>

许多通用型工作负载通常不繁忙，并且不需要高水平的持续 CPU 性能。下图展示了当前客户在 AWS 云中运行的许多常见工作负载的 CPU 利用率。

![该图显示了平均 CPU 利用率等于或低于基线且偶尔出现峰值的常见工作负载。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/CPU-common-workloads.png)


这些低至中等 CPU 利用率工作负载会导致 CPU 周期浪费，因此，您需要支付的费用超过使用量。为了解决这个问题，您可以利用低成本可突增通用型实例，即 T 实例。

T 实例系列提供基准 CPU 性能，而且只要有需要，就能随时突增到基准线以上。基准 CPU 旨在满足大多数通用型工作负载的需求，包括大型微服务、Web 服务器、中小型数据库、数据记录、代码存储库、虚拟桌面、开发和测试环境以及业务关键型应用程序。T 实例平衡了计算、内存和网络资源，并为您提供最经济高效的方式来运行各种具有低至中等 CPU 利用率的通用型应用程序。与 M 实例相比，它们可以为您节省高达 15% 的成本，并且可以通过更小、更经济的实例大小节约更多成本，提供低至 2 个 vCPU 和 0.5GiB 的内存。较小的 T 实例大小（例如纳型、微型、小型和中型）非常适合需要少量内存且无需高 CPU 利用率的工作负载。

**注意**  
本主题介绍可突增 CPU。有关可突增网络性能的信息，请参阅 [Amazon EC2 实例网络带宽](ec2-instance-network-bandwidth.md)。

## EC2 可突增实例类型
<a name="burstable-instance-types"></a>

EC2 可突增实例包括 T4g、T3a 和 T3 实例类型，以及上一代 T2 实例类型。

T4g 实例类型是最新一代可突增实例。它们提供最好的性价比，并为您提供所有 EC2 实例类型中最低的成本。T4g 实例类型由基于 Arm 的 [AWS Graviton2](https://aws.amazon.com/ec2/graviton/) 处理器提供动力，并且具有操作系统供应商、独立软件供应商以及流行的 AWS 服务和应用程序广泛的生态系统支持。

下表总结了可突增实例类型之间的主要区别。



<table>
<thead>
  <tr><th>类型</th><th>描述</th><th>处理器系列</th></tr>
</thead>
<tbody>
  <tr><td colspan="3"><b>最新一代</b></td></tr>
  <tr><td>T4g</td><td>成本最低的 EC2 实例类型，与 T3 相比，性价比高 40%，成本低 20%</td><td>AWS采用 Arm Neoverse N1 核心的 Graviton2 处理器</td></tr>
  <tr><td>T3a</td><td>成本最低的基于 x86 的实例，与 T3 实例相比，成本低 10%</td><td>AMD 第一代 EPYC 处理器</td></tr>
  <tr><td>T3</td><td>适用于 x86 工作负载的最佳峰值性价比，同等性能的价格比上一代 T2 实例低 30%</td><td>英特尔至强可扩展（Skylake、Cascade Lake 处理器）</td></tr>
  <tr><td colspan="3"><b>上一代</b></td></tr>
  <tr><td>T2</td><td>上一代可突增实例</td><td>英特尔至强处理器</td></tr>
</tbody>
</table>


有关实例定价以及其他规格的信息，请参阅 [Amazon EC2 定价](https://aws.amazon.com/ec2/pricing/)和 [Amazon EC2 实例类型](https://aws.amazon.com/ec2/instance-types/)。有关可突增网络性能的信息，请参阅 [Amazon EC2 实例网络带宽](ec2-instance-network-bandwidth.md)。

如果您是在 2025 年 7 月 15 日之前创建的 AWS 账户且其使用时间未满 12 个月，您可以在特定使用限制下免费使用 `t2.micro` 实例（或者在 `t2.micro` 不可用的区域中使用 `t3.micro` 实例）。如果您是在 2025 年 7 月 15 日当天或之后创建的 AWS 账户，则可以使用 `t3.micro`、`t3.small`、`t4g.micro` 和 `t4g.small` 实例类型 6 个月，或直到您的服务抵扣金用完为止。有关更多信息，请参阅 [AWS Free Tier](https://aws.amazon.com/free/)。

**T 实例支持的购买选项**
+ On-Demand Instances
+ Reserved Instances
+ 专用实例（仅限 T3）
+ 专属主机（仅限 T3，仅处于 `standard` 模式）
+ 竞价型实例

有关更多信息，请参阅 [Amazon EC2 账单和购买选项](instance-purchasing-options.md)。

**Topics**
+ [EC2 可突增实例类型](#burstable-instance-types)
+ [最佳实践](#burstable-performance-instances-best-practices)
+ [可突增性能实例的关键概念](burstable-credits-baseline-concepts.md)
+ [可突增性能实例的无限模式](burstable-performance-instances-unlimited-mode.md)
+ [可突增性能实例的标准模式](burstable-performance-instances-standard-mode.md)
+ [配置可突增性能实例](burstable-performance-instances-how-to.md)
+ [监控可突增实例的 CPU 积分](burstable-performance-instances-monitoring-cpu-credits.md)

## 最佳实践
<a name="burstable-performance-instances-best-practices"></a>

按照这些最佳实践可以从可突增性能实例获得最大的好处。
+ 确保您选择的实例大小达到您的操作系统和应用程序的最低内存要求。在许多使用案例中，带有消耗大量内存和 CPU 资源的图形用户界面的操作系统（例如，Windows）可能需要 `t3.micro` 或更大的实例。随着您的工作负载对内存和 CPU 的需求随时间增加，您可以通过 T 实例灵活地扩展到相同实例类型更大实例大小，或者选择其他实例类型。
+ 为您的账户启用 [AWS Compute Optimizer](https://aws.amazon.com/compute-optimizer/getting-started/) 并审查针对您的工作负载的 Compute Optimizer 推荐。Compute Optimizer 可以帮助评测是应该扩大实例规模以提高性能，还是应该缩小实例规模以节省成本。Compute Optimizer 还可以根据您的场景推荐不同的实例类型。有关更多信息，请参阅《AWS Compute Optimizer 用户指南》**中的[查看 EC2 实例建议](https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ec2-recommendations.html)。
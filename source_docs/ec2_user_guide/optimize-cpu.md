

# 包含许可证的实例的优化 CPU 功能
<a name="optimize-cpu"></a>

Microsoft SQL Server 之类的工作负载通常需要大量的内存和 IOPS，但同时又需要较低的 vCPU 数量。AWS 提供了种类繁多的实例类型，能够满足您大部分的基础设施需求。然而，为了降低 Windows 和 Microsoft SQL Server 基于 vCPU 的许可费用，您可以自定义在您的 EC2 实例上运行的 vCPU 数量，同时保持相同的内存、存储和网络规格。这种方法可以节省基于 vCPU 的许可费用（包括包含许可证工作负载和自带许可（BYOL）工作负载）。您可以使用控制台或 Amazon EC2 API 在启动或修改实例时指定 CPU 选项。有关说明，请参阅[为 Amazon EC2 实例指定 CPU 选项](instance-specify-cpu-options.md)。

有关更多信息，请参阅这篇关于优化 SQL Server 工作负载的 CPU 的最佳实践的[博客文章](https://aws.amazon.com/blogs/modernizing-with-aws/optimize-cpus-best-practices-for-sql-server-workloads-continued/)。

## 支持的许可证类型
<a name="win-opt-cpu-supported-lic-types"></a>

对于从包含许可证的 AMI 启动的实例，“优化 CPU”功能支持根据活跃 CPU 的数量对以下类型的许可证配置进行计费。有关许可证类型的更多信息，请参阅 [AMI 账单信息字段](billing-info-fields.md)。

**含许可证的 AMI 实例账单**


| 包含许可证 | 使用情况操作 | 每 vCPU 小时价格 | 
| --- | --- | --- | 
| Windows Server | RunInstances:0002 | $0.046 | 
| 含有 SQL Server Enterprise 的 Windows Server | RunInstances:0102 | $0.421 | 
| 含有 SQL Server Standard 的 Windows Server | RunInstances:0006 | $0.166 | 
| 包含 SQL Server Web 的 Windows Server | RunInstances:0202 | $0.063 | 

## 支持的购买选项
<a name="win-opt-cpu-supported-po"></a>

“优化 CPU”功能为包含许可证的实例提供以下购买选项：
+ 按需
+ 节省计划

**警告**  
如果您使用预留实例，则在针对同一付款账户中包含许可证的实例配置“优化 CPU”功能时，折扣可能无法适用。我们建议您使用节省计划来降低基于 vCPU 的许可成本，并提供与计算成本相关的同等节省金额。  
在 2025 年 10 月 15 日之前，那些在同一实例类型上为 Windows 和 SQL Server 同时使用了“优化 CPU”和“预留实例”功能的账户已被列入退出列表，以维持其现有的计费体验。要利用优化 CPU 许可证节省的优势，请联系 [AWS 支持 中心](https://console.aws.amazon.com/support/home#/)将其从选择退出列表中移除。

## “优化 CPU”功能如何节省许可费用
<a name="win-opt-cpu-how-it-works"></a>

以下示例有助于说明在配置 CPU 使用率时所能实现的成本节省情况。

**示例 1：默认账单**此示例展示了通过包含许可证的 Windows 和 SQL Server Enterprise AMI 启动的 r7i.8xlarge 实例。该实例运行了 100 小时，其实例类型默认的 CPU 配置为 32 个 vCPU（总计 3200 个 vCPU 小时）。

该账单中有一个行项目列出了综合费率，其中既包含了使用费用，也包含了许可费用。

![包含许可证的 Windows 和 SQL Server Enterprise 实例的默认计费示例账单。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/optimize-cpus-sample-bill-default.png)


**示例 2：优化 CPU 账单**此示例展示了通过使用包含许可证的 Windows 和 SQL Server Enterprise AMI 来启动的 r7i.8xlarge 实例。为了节省许可证费用，处于活动状态的 CPU 数量减少到 16 个 vCPU。然后，该实例使用新配置运行了 100 个小时。

账单显示以下行项目。

计费说明：**Elastic Compute Cloud**  
第一个行项目显示了运行 100 小时的 Windows 和 SQL Server 实例的基准成本（211.68 美元）。

计费说明：**Amazon EC2 优化 CPU 包含许可证的第三方费用**  
第二个行项目涵盖了基于计费期间内处于活动状态的 vCPU 数量而产生的许可费用（673.60 美元）。

![包含许可证的 Windows 和 SQL Server Enterprise 实例的优化 CPU 计费示例账单。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/optimize-cpus-sample-bill-optimized.png)


**示例 3：采用节省计划的优化 CPU 账单**此示例展示了通过使用包含许可证的 Windows 和 SQL Server Enterprise AMI 来启动的 r7i.8xlarge 实例。为了节省许可证费用，处于活动状态的 CPU 数量减少到 16 个 vCPU。然后，该实例使用新配置运行了 100 个小时。

一项为期一年的*无预付费用计算类节省计划*，每小时承诺费用为 1.60 美元（四舍五入），可进一步节省成本，从而降低 Windows 和 SQL Server 实例的基准成本。节省计划承诺涵盖了 r7i.8xlarge 实例的全部 100 小时使用时长，其节省计划的费率为每小时 1.53362 美元。

账单显示以下行项目。

计费说明：**计算类使用量的节省计划**  
第一个行项目显示了整整 100 小时使用量的节省计划承诺（160.00 美元）。

计费说明：**Elastic Compute Cloud**  
第二个行项目包含两个条目。第一个条目显示了运行 100 小时的 Windows 和 SQL Server 实例的基准成本在未采用节省计划时原本为（211.68 美元）。第二个条目显示，全部基准成本已由计算类节省计划承担（费用为 -211.68 美元），因此该行项目的净成本为零。

计费说明：**Amazon EC2 优化 CPU 包含许可证的第三方费用**  
第三个行项目涵盖了基于计费期间内处于活动状态的 vCPU 数量而产生的许可费用（673.60 美元）。

![包含许可证的 Windows 和 SQL Server Enterprise 实例的节省计划和优化 CPU 计费示例账单。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/optimize-cpus-sample-bill-savings-plan.png)

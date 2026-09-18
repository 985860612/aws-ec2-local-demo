

# 为 Amazon EC2 购买按需型实例
<a name="ec2-on-demand-instances"></a>

使用按需型实例，您按秒为计算容量支付费用，无需长期订阅。实例的生命周期完全由您控制 – 您决定何时启动、停止、休眠、开机、重启或终止实例。

购买按需型实例没有长期承诺。您只需要为处于 `running` 状态的按需型实例的秒数付费，最少 60 秒。运行中的个按需型实例的每秒价格是固定的，[Amazon EC2 定价，按需定价页面](https://aws.amazon.com/ec2/pricing/on-demand/)上列出了此价格。

我们建议您为短期的不规则且不能中断的应用程序使用按需型实例。

要通过按需实例节省大量费用，请使用 [AWS Savings Plans](https://aws.amazon.com/savingsplans/)、[Spot Instances](using-spot-instances.md) 或 [Amazon EC2 的预留实例概览](ec2-reserved-instances.md)。

**Contents**
+ [按需型实例限额](#ec2-on-demand-instances-limits)
  + [监控按需型实例限额和使用情况](#monitoring-on-demand-limits)
  + [请求提高限额](#vcpu-limits-request-increase)
+ [查询按需型实例的价格](#query-aws-price-list)

## 按需型实例限额
<a name="ec2-on-demand-instances-limits"></a>

每个 AWS 账户可在每个区域运行的按需型实例数量存在限额。按需型实例的限额根据运行的按需型实例所用*虚拟中央处理器（vCPU）数*进行管理，而无论为哪种实例类型。每种限额类型都规定了一个或多个实例系列的最大 vCPUs 数。

您的账户包含以下按需型实例配额。处于待处理、正在停止、已停止和已休眠状态的实例不计入按需型实例限额。容量预留会计入按需型实例限额，即使未使用也是如此。


| 名称 | 默认值 | 可调整 | 
| --- | --- | --- | 
| 正在运行的按需 DL 实例 | 0 | [是](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-6E869C2A) | 
| 正在运行的按需 F 实例 | 0 | [是](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-74FC7D96) | 
| 正在运行的按需 G 和 VT 实例 | 0 | [是](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-DB2E81BA) | 
| 正在运行的按需型 HPC 实例 | 0 | [是](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-F7808C92) | 
| 正在运行按需内存增强型实例 | 0 | [是](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-43DA4232) | 
| 正在运行的按需 Inf 实例 | 0 | [是](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-1945791B) | 
| 正在运行的按需 P 实例 | 0 | [是](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-417A185B) | 
| 正在运行的按需标准（A、C、D、H、I、M、R、T、Z）实例 | 5 | [是](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-1216C47A) | 
| 正在运行的按需型 Trn 实例 | 0 | [是](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-2C3B7624) | 
| 正在运行的按需 X 实例 | 0 | [是](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-7295265B) | 

有关不同实例系列、实例代和大小的信息，请参阅《Amazon EC2 Instance Types Guide》[https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html)。

只要 vCPU 数不超过账户的限额，您就可以启动任意实例类型组合来满足您不断变化的应用程序需求。例如，对于 256 个 vCPU 的标准实例限额，您可以启动 32 个 `m5.2xlarge` 实例（32 x 8 vCPU）或 16 个 `c5.4xlarge` 实例（16 x 16 vCPU）。有关更多信息，请参阅 [EC2 个按需实例限制](https://aws.amazon.com/ec2/faqs/#EC2_On-Demand_Instance_limits)。

**Topics**
+ [监控按需型实例限额和使用情况](#monitoring-on-demand-limits)
+ [请求提高限额](#vcpu-limits-request-increase)

### 监控按需型实例限额和使用情况
<a name="monitoring-on-demand-limits"></a>

您可以使用以下方法查看和管理您在每个区域的按需型实例限额。

**使用服务限额控制台查看当前限额**

1. 访问 [https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/)，打开 Service Quotas 控制台。

1. 从导航栏中选择一个区域。

1. 在筛选条件字段中输入 **On-Demand**。

1. **应用的限额值**列会显示账户中每种按需型实例限额类型的最大 vCPU 数量。

**使用 AWS Trusted Advisor 控制台查看当前限额**  
打开 AWS Trusted Advisor 控制台中的[服务限制页面](https://console.aws.amazon.com/trustedadvisor/home?#/category/service-limits)。

**配置 CloudWatch 告警**  
借助 Amazon CloudWatch 指标集成，您可以根据限额监控 EC2 使用情况。您还可以配置警报以在即将达到限额时发出警告。有关更多信息，请参阅《服务限额用户指南》中的 [服务限额与 Amazon CloudWatch 警报](https://docs.aws.amazon.com/servicequotas/latest/userguide/configure-cloudwatch.html)**。

### 请求提高限额
<a name="vcpu-limits-request-increase"></a>

尽管 Amazon EC2 会根据您的使用情况自动提高按需型实例限额，您仍可以在必要时请求提高限额。例如，假设您计划启动超过当前限额允许数量的实例，则可以按照 [Amazon EC2 Service Quotas](ec2-resource-limits.md) 中的描述，在服务限额控制台中使用请求提高限额。

## 查询按需型实例的价格
<a name="query-aws-price-list"></a>

可以使用价目表服务 API 或 AWS 价目表 API 查询按需型实例的价格。有关更多信息，请参阅 *AWS Billing 用户指南*中的[使用AWS价目表 API](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/price-changes.html)。
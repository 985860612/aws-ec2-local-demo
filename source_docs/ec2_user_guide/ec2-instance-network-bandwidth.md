

# Amazon EC2 实例网络带宽
<a name="ec2-instance-network-bandwidth"></a>

实例带宽规格适用于实例的入站和出站流量。例如，假设实例指定了高达 10 Gbps 的带宽，这意味着该实例将同时具有高达 10 Gbps 的入站流量带宽和高达 10 Gbps 的出站流量带宽。EC2 实例可用的网络带宽取决于多个因素，如下所示。

**多流流量**  
当流量通过互联网网关或[本地网关](https://docs.aws.amazon.com/outposts/latest/userguide/outposts-local-gateways.html)时，多流流量的可用带宽会取决于实例类型。


| 实例类型 | 可用带宽 | 
| --- | --- | 
| vCPU 少于 32 个的实例类型 | 限制为 5Gbps | 
| vCPU 超过 32 个的实例类型 | 限制为实例类型可用带宽的 50% | 
| C8in、C8ine、M8in、M8ine、M8idn、R8in、R8idn 实例 | 限制为实例类型的基准带宽 | 

**单流流量**  
如果实例不在同一[集群置放群组](placement-strategies.md#placement-groups-cluster)中，单流流量的带宽限制为 5Gbps。要减少延迟并增加单流带宽，请尝试以下任一操作：
+ 使用集群置放群组，使同一置放群组内的实例具有高达 10 Gbps 的带宽。
+ 在任意两个端点之间设置多条路径，以通过多路径 TCP（MPTCP）实现更高带宽。
+ 为同一可用区内符合条件的实例配置 ENA Express，以便在这些实例之间实现高达 25 Gbps 的带宽。

**注意**  
单流被视作唯一的 5 元组 TCP 或 UDP 流。对于位于 IP 标头之后的其他协议（例如 `GRE` 或 `IPsec`），使用源 IP、目标 IP 和下一个协议的 3 元组来定义流。

## 可用实例带宽
<a name="available-instance-bandwidth"></a>

实例的可用网络带宽取决于其拥有的 vCPU 数量。例如，`m5.8xlarge` 实例有 32 个 vCPU 和 10 Gbps 的网络带宽，`m5.16xlarge` 实例有 64 个 vCPU 和 20 Gbps 的网络带宽。但是，如果实例超过实例级别的网络限额（例如每秒数据包或跟踪的连接数），则实例可能无法实现此带宽。流量可以使用多少可用带宽取决于 vCPU 的数量和目标地址。例如，`m5.16xlarge` 实例具有 64 个 vCPU，因此发往同一区域中另一个实例的流量可以使用全部可用带宽（20 Gbps）。但是，通过互联网网关或[本地网关](https://docs.aws.amazon.com/outposts/latest/userguide/outposts-local-gateways.html)的流量只能使用 50% 的可用带宽（10 Gbps）。

通常，有 16 个或更少 vCPU 的实例（大小为 `4xlarge` 或更小）被记录为具有“高达”的指定带宽；例如，“高达 10 Gbps”。这些实例具备基准带宽。为满足其他需求，可以使用网络 I/O 积分机制，以突增超出其基准带宽。实例可以在有限时间内使用突增带宽，通常为 5 到 60 分钟，具体取决于实例的大小。

实例在启动时接收最大数量的网络 I/O 积分。如果实例耗尽了其网络 I/O 积分，则返回至其基准带宽。正在运行的实例只要使用少于其基准带宽的网络带宽，就会获得网络 I/O 积分。已停止的实例不会获得网络 I/O 积分。即使实例有可用积分，实例突增也已尽了最大努力，因为突增带宽是一个共享资源。

入站和出站流量都有单独的网络 I/O 积分桶。

**基本和爆发网络性能**

《Amazon EC2 实例类型指南》**介绍了每种实例类型的网络性能，以及可以使用突增带宽的实例可用的基准网络带宽。有关更多信息，请参阅下列内容：
+ [网络规格 – 通用型](https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html#gp_network)
+ [网络规格 – 计算优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html#co_network)
+ [网络规格 – 内存优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html#mo_network)
+ [网络规格 – 存储优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/so.html#so_network)
+ [网络规格 – 加速计算型](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html#ac_network)
+ [网络规格 – 高性能计算型](https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html#hpc_network)
+ [网络规格 – 上一代](https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html#pg_network)

或者，您可以使用命令行工具来获取此信息。Amazon EC2 控制台不显示实例类型的基准网络带宽。

------
#### [ AWS CLI ]

您可以使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令来显示有关实例类型的信息。以下示例显示了所有 C5 实例的网络性能信息。

```
aws ec2 describe-instance-types \
    --filters "Name=instance-type,Values=c5.*" \
    --query "InstanceTypes[].[InstanceType, NetworkInfo.NetworkPerformance, NetworkInfo.NetworkCards[0].BaselineBandwidthInGbps] | sort_by(@,&[2])" \
    --output table
```

下面是示例输出。如果您的输出未达到基准带宽，请更新到最新版本的 AWS CLI。

```
---------------------------------------------
|           DescribeInstanceTypes           |
+--------------+--------------------+-------+
|  c5.large    |  Up to 10 Gigabit  |  0.75 |
|  c5.xlarge   |  Up to 10 Gigabit  |  1.25 |
|  c5.2xlarge  |  Up to 10 Gigabit  |  2.5  |
|  c5.4xlarge  |  Up to 10 Gigabit  |  5.0  |
|  c5.9xlarge  |  12 Gigabit        |  12.0 |
|  c5.12xlarge |  12 Gigabit        |  12.0 |
|  c5.18xlarge |  25 Gigabit        |  25.0 |
|  c5.24xlarge |  25 Gigabit        |  25.0 |
|  c5.metal    |  25 Gigabit        |  25.0 |
+--------------+--------------------+-------+
```

------
#### [ PowerShell ]

您可以使用 [Get-EC2InstanceType ](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) PowerShell 命令来显示有关实例类型的信息。以下示例显示了所有 C5 实例的网络性能信息。

```
Get-EC2InstanceType -Filter @{Name = "instance-type"; Values = "c5.*" } | `
    Select-Object `
    InstanceType,
    @{Name = 'NetworkPerformance'; Expression = {($_.Networkinfo.NetworkCards.NetworkPerformance)}},
    @{Name = 'BaselineBandwidthInGbps'; Expression = {($_.Networkinfo.NetworkCards.BaselineBandwidthInGbps)}} | `
Format-Table -AutoSize
```

下面是示例输出。

```
InstanceType NetworkPerformance BaselineBandwidthInGbps
------------ ------------------ -----------------------
c5.4xlarge   Up to 10 Gigabit                      5.00
c5.xlarge    Up to 10 Gigabit                      1.25
c5.12xlarge  12 Gigabit                           12.00
c5.9xlarge   12 Gigabit                           12.00
c5.24xlarge  25 Gigabit                           25.00
c5.metal     25 Gigabit                           25.00
c5.2xlarge   Up to 10 Gigabit                      2.50
c5.large     Up to 10 Gigabit                      0.75
c5.18xlarge  25 Gigabit                           25.00
```

------

## 监控实例带宽
<a name="monitor-instance-bandwidth"></a>

您可以使用 CloudWatch 指标监控实例网络带宽以及发送和接收的数据包。您可以使用弹性网络适配器（ENA）驱动程序提供的网络性能指标来监控流量何时超过 Amazon EC2 在实例级别定义的网络限额。

您可以配置 Amazon EC2 是使用 1 分钟还是 5 分钟时段将实例的指标数据发送到 CloudWatch。网络性能指标可能会显示超出限额并丢弃数据包，而 CloudWatch 实例指标不会显示。当实例对网络资源的需求出现短暂峰值（称为微爆发），但 CloudWatch 指标的精细程度不足以反映这些微秒峰值时，就会发生这种情况。

**了解更多**
+ [实例指标](viewing_metrics_with_cloudwatch.md#ec2-cloudwatch-metrics)
+ [监控网络性能](monitoring-network-performance-ena.md)
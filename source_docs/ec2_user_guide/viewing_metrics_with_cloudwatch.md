

# 可用于实例的 CloudWatch 指标
<a name="viewing_metrics_with_cloudwatch"></a>

Amazon EC2 将指标发送到 Amazon CloudWatch。可使用 AWS 管理控制台、AWS CLI 或 API 列出 Amazon EC2 发送到 CloudWatch 的指标。默认情况下，每个数据点中包含的是实例自启动后的 5 分钟内的活动。如果您启用了详细监控，则每个数据点包含自启动后的 1 分钟内的活动。请注意，对于统计数据 Minimum、Maximum 和 Average，EC2 提供的指标的最小粒度为 1 分钟。

有关如何使用 AWS 管理控制台或 AWS CLI 查看可用指标的信息，请参阅《Amazon CloudWatch 用户指南》**中的[查看可用的指标](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html)。

有关获取这些指标的统计数据的信息，请参阅 [实例的 CloudWatch 指标的统计数据](monitoring_get_statistics.md)。

**Topics**
+ [实例指标](#ec2-cloudwatch-metrics)
+ [加速器指标](#accelerator-metrics)
+ [CPU 积分指标](#cpu-credit-metrics)
+ [专属主机指标](#dh-metrics)
+ [基于 Nitro 的实例的 Amazon EBS 指标](#ebs-metrics-nitro)
+ [状态检查指标](#status-check-metrics)
+ [流量镜像指标](#traffic-mirroring-metrics)
+ [自动扩缩组指标](#autoscaling-metrics)
+ [Amazon EC2 指标维度](#ec2-cloudwatch-dimensions)
+ [Amazon EC2 使用情况指标](#service-quota-metrics)

## 实例指标
<a name="ec2-cloudwatch-metrics"></a>

`AWS/EC2` 命名空间包括以下实例指标。


| 指标 | 说明 | 单位 | 有意义的统计数据 | 
| --- | --- | --- | --- | 
| CPUUtilization | Amazon EC2 用于运行 EC2 实例的物理 CPU 时间的百分比，包括运行用户代码和 Amazon EC2 代码所花费的时间。<br />在很高的级别上，`CPUUtilization` 是 guest `CPUUtilization` 和 hypervisor `CPUUtilization` 的总和。<br />由于旧设备模拟、非旧设备配置、中断密集型工作负载、实时迁移和实时更新等因素，操作系统中的工具显示的百分比可能与 CloudWatch 不同。 | Percent |  +  Average <br />+  Minimum <br />+  Maximum   | 
| DiskReadOps | 在指定时间段内从可供实例使用的所有实例存储卷完成的读取操作数。<br />要计算该周期的每秒平均 I/O 操作数 (IOPS)，请将该周期的总操作数除以总秒数。<br />如果没有实例存储卷，则值为 0 或不报告指标。 | Count |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 
| DiskWriteOps | 在指定时间段内向可供实例使用的所有实例存储卷完成的写入操作数。<br />要计算该周期的每秒平均 I/O 操作数 (IOPS)，请将该周期的总操作数除以总秒数。<br />如果没有实例存储卷，则值为 0 或不报告指标。 | Count |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 
| DiskReadBytes | 从可供实例使用的所有实例存储卷读取的字节数。<br />该指标用来确定应用程序从实例的硬盘读取的数据量。它可以用来确定应用程序的速度。<br />报告的数量是该期间内接收的字节数。如果您使用的是基本（5 分钟）监控，则可以将此数字除以 300 以获得字节/秒。如果您使用的是详细（1 分钟）监控，请将其除以 60。您也可以使用 CloudWatch 指标数学函数 `DIFF_TIME` 来查找每秒字节数。例如，如果您在 CloudWatch 中绘制 `DiskReadBytes` 为 `m1`，指标数学公式 `m1/(DIFF_TIME(m1))` 会返回以字节/秒为单位的指标。有关 `DIFF_TIME` 和其他指标数学函数的更多信息，请参阅《Amazon CloudWatch 用户指南》**中的[使用指标数学](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)。<br />如果没有实例存储卷，则值为 0 或不报告指标。 | Bytes |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 
| DiskWriteBytes | 向可供实例使用的所有实例存储卷写入的字节数。<br />该指标用来确定应用程序向实例的硬盘写入的数据量。它可以用来确定应用程序的速度。<br />报告的数量是该期间内接收的字节数。如果您使用的是基本（5 分钟）监控，则可以将此数字除以 300 以获得字节/秒。如果您使用的是详细（1 分钟）监控，请将其除以 60。您也可以使用 CloudWatch 指标数学函数 `DIFF_TIME` 来查找每秒字节数。例如，如果您在 CloudWatch 中绘制 `DiskWriteBytes` 为 `m1`，指标数学公式 `m1/(DIFF_TIME(m1))` 会返回以字节/秒为单位的指标。有关 `DIFF_TIME` 和其他指标数学函数的更多信息，请参阅《Amazon CloudWatch 用户指南》**中的[使用指标数学](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)。<br />如果没有实例存储卷，则值为 0 或不报告指标。 | Bytes |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 
| MetadataNoToken | 在没有令牌的情况下成功访问实例元数据服务（IMDS）的次数。<br />该指标用于确定是否有任何进程正在使用实例元数据服务版本 1（IMDSv1）访问实例元数据，但未使用令牌。如果所有请求都使用支持令牌的会话，即实例元数据服务版本 2（IMDSv2），则该值为 0。有关更多信息，请参阅 [转换为使用 实例元数据服务版本 2](instance-metadata-transition-to-version-2.md)。 | Count |  +  Sum <br />+  Percentiles   | 
| MetadataNoTokenRejected | 在 IMDSv1 被禁用后尝试进行 IMDSv1 调用的次数。<br />如果出现此指标，则表示尝试了 IMDSv1 调用但被拒绝。您可以重新启用 IMDSv1，也可以确保所有调用都使用 IMDSv2。有关更多信息，请参阅 [转换为使用 实例元数据服务版本 2](instance-metadata-transition-to-version-2.md)。 | Count |  +  Sum <br />+  Percentiles   | 
| NetworkIn | 实例在所有网络接口上收到的字节数。此指标用于确定流向单个实例的传入网络流量。<br />报告的数量是该期间内接收的字节数。如果您使用的是基本（5 分钟）监控且统计数据为 Sum，则可以将此数字除以 300 以获得字节/秒。如果您使用的是详细（1 分钟）监控且统计数据为 Sum，请将其除以 60。 | Bytes |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 
| NetworkOut | 实例在所有网络接口上发送的字节数。此指标用于确定来自单个实例的传出网络流量。<br />报告的数字是该时间段内发送的字节数。如果您使用的是基本（5 分钟）监控且统计数据为 Sum，则可以将此数字除以 300 以获得字节/秒。如果您使用的是详细（1 分钟）监控且统计数据为 Sum，请将其除以 60。 | Bytes |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 
| NetworkPacketsIn | 实例在所有网络接口上收到的数据包数。此指标依据单个实例上的数据包数量来标识传入流量的量。<br />此指标仅可用于基本监控（5 分钟期间）。要计算实例 5 分钟内每秒收到的数据包数 (PPS)，请将 Sum 统计数据除以 300。 | Count |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 
| NetworkPacketsOut | 实例在所有网络接口上发送的数据包数。此指标依据单个实例上的数据包数量标识传出流量的量。<br />此指标仅可用于基本监控（5 分钟期间）。要计算实例 5 分钟内每秒发送的数据包数（PPS），请将 Sum 统计数据除以 300。 | Count |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 

## 加速器指标
<a name="accelerator-metrics"></a>

`AWS/EC2` 命名空间包括您的[加速型计算实例](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html)的以下加速器指标。仅在部分加速型计算实例类型中受支持。


| 指标 | 说明 | 单位 | 有意义的统计数据 | 
| --- | --- | --- | --- | 
| GPUPowerUtilization | 有功功率使用量占最大有功功率的百分比。 | 百分比 |  +  Average <br />+  Minimum <br />+  Maximum   | 

## CPU 积分指标
<a name="cpu-credit-metrics"></a>

`AWS/EC2` 命名空间包括 [可突增性能实例](burstable-performance-instances.md)的以下 CPU 积分指标。


| 指标 | 说明 | 单位 | 有意义的统计数据 | 
| --- | --- | --- | --- | 
| CPUCreditUsage | 实例为保持 CPU 使用率而花费的 CPU 积分数。一个 CPU 积分等于一个 vCPU 按 100% 利用率运行一分钟，或者 vCPU、利用率和时间的等效组合（例如， 一个 vCPU 按 50% 利用率运行两分钟，或者两个 vCPU 按 25% 利用率运行两分钟）。<br />CPU 信用指标仅每 5 分钟提供一次。如果您指定一个大于五分钟的时间段，请使用`Sum` 统计数据，而非 `Average` 统计数据。 | 积分 (vCPU 分钟) |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 
| CPUCreditBalance | 实例自启动后已累积获得的 CPU 积分数。对于 T2 标准，`CPUCreditBalance` 还包含已累积的启动积分数。<br />在获得积分后，积分将在积分余额中累积；在花费积分后，将从积分余额中扣除积分。积分余额具有最大值限制，这是由实例大小决定的。在达到限制后，将丢弃获得的任何新积分。对于 T2 标准，启动积分不计入限制。<br />实例可以花费 `CPUCreditBalance` 中的积分，以便突增到基准 CPU 使用率以上。<br />在实例运行过程中，`CPUCreditBalance` 中的积分不会过期。在 T3 或 T3a 实例停止时，`CPUCreditBalance` 值将保留七天。之后，所有累积的积分都将丢失。在 T2 实例停止时，`CPUCreditBalance` 值不会保留，并且所有累积的积分都将丢失。<br />CPU 信用指标仅每 5 分钟提供一次。 | 积分（vCPU 分钟） |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 
| CPUSurplusCreditBalance  | 在 `unlimited` 值为零时，`CPUCreditBalance` 实例花费的超额积分数。<br />`CPUSurplusCreditBalance` 值由获得的 CPU 积分支付。如果超额积分数超出实例可在 24 小时周期内获得的最大积分数，则超出最大积分数的已花费超额积分将产生额外费用。<br />CPU 信用指标仅每 5 分钟提供一次。 | 积分（vCPU 分钟） |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 
| CPUSurplusCreditsCharged | 未由获得的 CPU 积分支付并且会产生额外费用的已花费超额积分数。<br />在出现以下任一情况时，将对花费的超额积分收费：+  花费的超额积分超出实例可在 24 小时周期内获得的最大积分数。对于超出最大积分数的所花费超额积分，将在该小时结束时向您收费。 <br />+  实例已停止或终止。 <br />+  实例从 `unlimited` 切换为 `standard`。 <br />CPU 信用指标仅每 5 分钟提供一次。 | 积分（vCPU 分钟） |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 

## 专属主机指标
<a name="dh-metrics"></a>

`AWS/EC2` 命名空间包括 T3 专属主机的下列指标。


| 指标 | 说明 | 单位 | 有意义的统计数据 | 
| --- | --- | --- | --- | 
|  DedicatedHostCPUUtilization | 在专属主机上运行的实例当前正在使用的已分配计算容量的百分比。 | Percent |  +  Sum <br />+  Average <br />+  Minimum <br />+  Maximum   | 

## 基于 Nitro 的实例的 Amazon EBS 指标
<a name="ebs-metrics-nitro"></a>

`AWS/EC2` 命名空间包括所添加的卷的基于 Nitro 的实例（非裸机实例）的其他 Amazon EBS 指标。


| 指标 | 说明 | 单位 | 有意义的统计数据 | 
| --- | --- | --- | --- | 
|  InstanceEBSIOPSExceededCheck  | 报告应用程序是否在最后一分钟内尝试驱动超过实例最大 EBS IOPS 限制的 IOPS。此指标可以是 `0`（未超过 IOPS），也可以是 `1`（已超过 IOPS）。 | 无 |  +  总和 <br />+  平均值 <br />+  最小值 <br />+  最大值   | 
|  InstanceEBSThroughputExceededCheck  | 报告应用程序是否在最后一分钟内尝试驱动超过实例最大 EBS 吞吐量限制的吞吐量。此指标可以是 `0`（未超过吞吐量），也可以是 `1`（超出吞吐量）。 | 无 |  +  总和 <br />+  平均值 <br />+  最小值 <br />+  最大值   | 
|  EBSReadOps | 在指定时间段内在挂载到实例的所有 Amazon EBS 卷中完成的读取操作数。<br />要计算该时间段的平均每秒读取 I/O 操作数（读取 IOPS），请将该时间段的总操作数除以秒数。如果使用基本（5 分钟）监控，您可以将该数字除以 300 以计算读取 IOPS。如果您使用的是详细（1 分钟）监控，请将其除以 60。您也可以使用 CloudWatch 指标数学函数 `DIFF_TIME` 来查找每秒操作数。例如，如果您在 CloudWatch 中绘制 `EBSReadOps` 为 `m1`，指标数学公式 `m1/(DIFF_TIME(m1))` 会返回以操作/秒为单位的指标。有关 `DIFF_TIME` 和其他指标数学函数的更多信息，请参阅《Amazon CloudWatch 用户指南》**中的[使用指标数学](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)。 | 计数 |  +  总和 <br />+  平均值 <br />+  最小值 <br />+  最大值   | 
|  EBSWriteOps  | 在指定时间段内在附加到实例的所有 EBS 卷中完成的写入操作数。<br />要计算该时间段的平均每秒写入 I/O 操作数（写入 IOPS），请将该时间段的总操作数除以秒数。如果使用基本（5 分钟）监控，您可以将该数字除以 300 以计算写入 IOPS。如果您使用的是详细（1 分钟）监控，请将其除以 60。您也可以使用 CloudWatch 指标数学函数 `DIFF_TIME` 来查找每秒操作数。例如，如果您在 CloudWatch 中绘制 `EBSWriteOps` 为 `m1`，指标数学公式 `m1/(DIFF_TIME(m1))` 会返回以操作/秒为单位的指标。有关 `DIFF_TIME` 和其他指标数学函数的更多信息，请参阅《Amazon CloudWatch 用户指南》**中的[使用指标数学](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)。 | 计数 |  +  总和 <br />+  平均值 <br />+  最小值 <br />+  最大值   | 
|  EBSReadBytes  | 在指定时间段内从附加到实例的所有 EBS 卷中读取的字节数。<br />报告的数字是在该时间段内读取的字节数。如果使用基本（5 分钟）监控，您可以将该数字除以 300 以计算每秒读取的字节数。如果您使用的是详细（1 分钟）监控，请将其除以 60。您也可以使用 CloudWatch 指标数学函数 `DIFF_TIME` 来查找每秒字节数。例如，如果您在 CloudWatch 中绘制 `EBSReadBytes` 为 `m1`，指标数学公式 `m1/(DIFF_TIME(m1))` 会返回以字节/秒为单位的指标。有关 `DIFF_TIME` 和其他指标数学函数的更多信息，请参阅《Amazon CloudWatch 用户指南》**中的[使用指标数学](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)。 | 字节 |  +  总和 <br />+  平均值 <br />+  最小值 <br />+  最大值   | 
|  EBSWriteBytes  | 在指定时间段内写入附加到实例的所有 EBS 卷的字节数。<br />报告的数字是在该时间段内写入的字节数。如果使用基本（5 分钟）监控，您可以将该数字除以 300 以计算每秒写入的字节数。如果您使用的是详细（1 分钟）监控，请将其除以 60。您也可以使用 CloudWatch 指标数学函数 `DIFF_TIME` 来查找每秒字节数。例如，如果您在 CloudWatch 中绘制 `EBSWriteBytes` 为 `m1`，指标数学公式 `m1/(DIFF_TIME(m1))` 会返回以字节/秒为单位的指标。有关 `DIFF_TIME` 和其他指标数学函数的更多信息，请参阅《Amazon CloudWatch 用户指南》**中的[使用指标数学](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)。 | 字节 |  +  总和 <br />+  平均值 <br />+  最小值 <br />+  最大值   | 
|  EBSIOBalance%  | 提供有关突增存储桶中剩余的 I/O 积分百分比的信息。此指标仅对基本监控可用。<br />此指标仅适用于某些 `*.4xlarge` 大小和更小的实例，这样的实例仅需 30 分钟便可突增到最高性能，且至少每 24 小时发生一次。<br />`Sum` 统计数据不适用于该指标。 | 百分比 |  +  最小值 <br />+  最大值   | 
|  EBSByteBalance%  | 提供有关突增存储桶中剩余的吞吐量积分百分比的信息。此指标仅对基本监控可用。<br />此指标仅适用于某些 `*.4xlarge` 大小和更小的实例，这样的实例仅需 30 分钟便可突增到最高性能，且至少每 24 小时发生一次。<br />`Sum` 统计数据不适用于该指标。 | 百分比 |  +  最小值 <br />+  最大值   | 

有关为 EBS 卷提供的指标的信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 卷的指标](https://docs.aws.amazon.com/ebs/latest/userguide/using_cloudwatch_ebs.html#ebs-volume-metrics)。有关为 EC2 实例集和竞价型实例集提供的指标的信息，请参阅[使用 CloudWatch 监控 EC2 实例集或竞价型实例集](ec2-fleet-cloudwatch-metrics.md)。

## 状态检查指标
<a name="status-check-metrics"></a>

默认情况下，状态检查指标可在 1 分钟的频率下免费提供。对于新启动的实例，状态检查指标数据仅在实例完成初始化状态之后（实例进入 `running` 状态的几分钟之内）提供。有关 EC2 状态检查的更多信息，请参阅[Amazon EC2 实例的状态检查](monitoring-system-instance-status-check.md)。

`AWS/EC2` 命名空间包括以下状态检查指标。


| 指标 | 说明 | 单位 | 有意义的统计数据 | 
| --- | --- | --- | --- | 
| StatusCheckFailed | 报告实例在上一分钟内是否通过了所有系统状态检查。<br />此指标可以是 `0`（通过）或 `1`（失败）。<br />默认情况下，此指标可在 1 分钟的频率下免费提供。 | Count |  +  Average <br />+  Minimum <br />+  Maximum   | 
| StatusCheckFailed\_Instance | 报告实例在上个 1 分钟内是否通过了 实例状况检查。<br />此指标可以是 `0`（通过）或 `1`（失败）。<br />默认情况下，此指标可在 1 分钟的频率下免费提供。 | Count |  +  Average <br />+  Minimum <br />+  Maximum   | 
| StatusCheckFailed\_System | 报告实例在上一分钟内是否通过了 系统状况检查。<br />此指标可以是 `0`（通过）或 `1`（失败）。<br />默认情况下，此指标可在 1 分钟的频率下免费提供。 | Count |  +  Average <br />+  Minimum <br />+  Maximum   | 
| StatusCheckFailed\_AttachedEBS | 报告实例在上一分钟内是否通过了附加的 EBS 卷状态检查。<br />此指标可以是 `0`（通过）或 `1`（失败）。<br />默认情况下，此指标可在 1 分钟的频率下免费提供。 | Count |  +  Average <br />+  Minimum <br />+  Maximum   | 

`AWS/EBS` 命名空间包括以下状态检查指标。


| 指标 | 说明 | 单位 | 有意义的统计数据 | 
| --- | --- | --- | --- | 
| VolumeStalledIOCheck | **注意：**仅适用于 Nitro 实例。对附加到 Amazon ECS 和 AWS Fargate 任务的卷未发布。<br />报告卷在最后一分钟是否通过*停滞的 IO 检查*。此指标可以是 `0`（通过）或 `1`（失败）。 | 无 |  +  Average <br />+  Minimum <br />+  Maximum   | 

## 流量镜像指标
<a name="traffic-mirroring-metrics"></a>

`AWS/EC2` 命名空间包含镜像流量的指标。有关更多信息，请参阅《Amazon VPC Traffic Mirroring 指南》**中的[使用 Amazon CloudWatch 监控镜像的流量](https://docs.aws.amazon.com/vpc/latest/mirroring/traffic-mirror-cloudwatch.html)。

## 自动扩缩组指标
<a name="autoscaling-metrics"></a>

`AWS/AutoScaling` 命名空间包括自动扩缩组的指标。有关更多信息，请参阅《Amazon EC2 Auto Scaling User Guide》**中的 [Monitor CloudWatch metrics for your Auto Scaling groups and instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-cloudwatch-monitoring.html)。

## Amazon EC2 指标维度
<a name="ec2-cloudwatch-dimensions"></a>

您可以使用以下维度来优化上表中列出的指标。


| 维度 | 描述 | 
| --- | --- | 
|  AutoScalingGroupName  | 该维度筛选您为指定容量组中的所有实例请求的数据。如果您使用自动扩缩，*自动扩缩组*就是您定义的实例集合。当实例在上述自动扩缩组中时，该维度仅供 Amazon EC2 指标使用。可供启用了详细或基本监控的实例使用。 | 
|  ImageId  | 该维度筛选您为运行此 Amazon EC2 亚马逊机器映像（AMI）的所有实例而请求的数据。可供启用了详细监控功能的实例使用。 | 
|  InstanceId  | 该维度筛选您仅为已识别实例请求的数据。这样有助于您精确定位要对其监控数据的确切实例。 | 
|  InstanceType  | 该维度筛选您为以这一指定实例类型运行的所有实例请求的数据。这样有助于您按运行的实例类型给数据分类。例如，您可以比较 m1.small 实例和 m1.large 实例的数据，以确定哪一个对您的应用程序具有更好的商业价值。可供启用了详细监控功能的实例使用。 | 

## Amazon EC2 使用情况指标
<a name="service-quota-metrics"></a>

您可以使用 CloudWatch 用量指标来提供账户资源使用情况的可见性。使用这些指标在 CloudWatch 图表和控制面板上可视化当前服务用量。

Amazon EC2 用量指标与 AWS 服务配额对应。您可以配置警报，以在用量接近服务配额时向您发出警报。有关 CloudWatch 与 Service Quotas 集成的更多信息，请参阅《Amazon CloudWatch 用户指南》**中的 [AWS 使用情况指标](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Service-Quota-Integration.html)。

Amazon EC2 在 `AWS/Usage` 命名空间中发布以下指标。


| 指标 | 描述 | 
| --- | --- | 
| `ResourceCount` | 您账户中运行的指定资源的数量。资源由与指标关联的维度定义。<br />此指标最有用的统计数据是 `MAXIMUM`，这表示 1 分钟期间内使用的最大资源数。 | 

以下维度用于优化由 Amazon EC2 发布的用量指标。


| 维度 | 描述 | 
| --- | --- | 
|  Service  | 包含该资源的 AWS 服务的名称。对于 Amazon EC2 用量指标，此维度的值为 `EC2`。 | 
|  Type  | 正在报告的实体的类型。目前，Amazon EC2 用量指标的唯一有效值为 `Resource`。 | 
|  Resource  | 正在运行的资源的类型。目前，Amazon EC2 用量指标的唯一有效值是 `vCPU`，它返回有关正在运行的实例的信息。 | 
|  Class  | 所跟踪的资源的类。对于以 `vCPU` 作为 `Resource` 维度的值的 Amazon EC2 用量指标，有效值为 `Standard/OnDemand`、`F/OnDemand`、`G/OnDemand`、`Inf/OnDemand`、`P/OnDemand` 和 `X/OnDemand`。<br />此维度的值定义由该指标报告的实例类型的第一个字母。例如，`Standard/OnDemand` 返回有关类型以 A、C、D、H、I、M、R、T 和 Z 开头的所有正在运行的实例的信息，并且 `G/OnDemand` 返回有关类型以 G 开头的所有正在运行的实例的信息。 | 
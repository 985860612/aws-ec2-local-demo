

# 使用 CloudWatch 监控 EC2 实例集或竞价型实例集
<a name="ec2-fleet-cloudwatch-metrics"></a>

您可以使用本节所述的 Amazon CloudWatch 指标监控 EC2 实例集或竞价型实例集。

**重要**  
为确保准确性，我们建议您在使用这些指标时启用详细监控。有关更多信息，请参阅 [管理 EC2 实例的详细监控](manage-detailed-monitoring.md)。

有关使用 CloudWatch 的更多信息，请参阅[使用 CloudWatch 监控您的实例](using-cloudwatch.md)。

## EC2 实例集和竞价型实例集指标
<a name="ec2-fleet-metrics"></a>

`AWS/EC2Spot` 命名空间包含以下实例集指标，以及实例集中竞价型实例的 CloudWatch 指标。有关更多信息，请参阅 [实例指标](viewing_metrics_with_cloudwatch.md#ec2-cloudwatch-metrics)。


| 指标 | 说明 | 
| --- | --- | 
| AvailableInstancePoolsCount | 实例集请求中指定的竞价型容量池。<br />单位：计数 | 
| BidsSubmittedForCapacity | Amazon EC2 已提交实例集请求的容量。<br />单位：计数 | 
| EligibleInstancePoolCount | 在 Amazon EC2 可以完成请求的实例集请求中指定的竞价型容量池。在您愿意为竞价型实例支付的最高价格低于 Spot 价格或 Spot 价格高于按需型实例价格的池中，Amazon EC2 不会完成请求。<br />单位：计数 | 
| FulfilledCapacity | Amazon EC2 已执行的容量。<br />单位：计数 | 
| MaxPercentCapacityAllocation | 实例集请求中指定的所有实例集池间的 `PercentCapacityAllocation` 最大值。<br />单位：百分比 | 
| PendingCapacity | `TargetCapacity` 与 `FulfilledCapacity` 之间的区别。<br />单位：计数 | 
| PercentCapacityAllocation | 针对所指定维度的 Spot 容量池分配的容量。要获取所有 Spot 容量池中记录的最大值，请使用 `MaxPercentCapacityAllocation`。<br />单位：百分比 | 
| TargetCapacity | 实例集请求的目标容量。<br />单位：计数 | 
| TerminatingCapacity | 因预置容量大于目标容量而终止的容量。<br />单位：计数 | 

如果指标的度量单位是 `Count`，则最有用的统计信息是 `Average`。

## EC2 实例集和竞价型实例集维度
<a name="ec2-fleet-dimensions"></a>

要筛选实例集的数据，请使用以下维度。


| Dimensions | 描述 | 
| --- | --- | 
| AvailabilityZone | 按照可用区筛选数据。 | 
| FleetRequestId | 按照实例集请求筛选数据。 | 
| InstanceType | 按实例类型筛选数据。 | 

## 查看 EC2 实例集或竞价型实例集的 CloudWatch 指标
<a name="view-ec2-fleet-metrics"></a>

您可以使用 Amazon CloudWatch 控制台查看实例集的 CloudWatch 指标。这些指标显示为监控图表。如果实例集处于活动状态，则这些图表会显示数据点。

指标首先按命名空间进行分组，然后按各命名空间内的各种维度组合进行分组。例如，您可以按实例集请求 ID、实例类型或可用区查看所有实例集指标或实例集指标组。

**查看实例集指标**

1. 通过 [https://console.aws.amazon.com/cloudwatch/](https://console.aws.amazon.com/cloudwatch/) 打开 CloudWatch 控制台。

1. 在导航窗格中，展开**指标**，然后选择**所有指标**。

1. 选择 **EC2 Spot** 命名空间。
**注意**  
如果未显示 **EC2 Spot** 命名空间，这种情况有两个原因。您从未在该区域中使用过 EC2 实例集或竞价型实例集 – 只有正在使用的 AWS 服务才会将指标发送到 Amazon CloudWatch。或者，如果您在该区域中使用了 EC2 实例集或竞价型实例集，但过去两周没有使用，则不会显示命名空间。

1. 要按维度筛选指标，请选择下列选项之一：
   + **实例集请求指标** – 按实例集请求分组
   + **按可用区** – 按实例集请求和可用区分组
   + **按实例类型** – 按实例集请求和实例类型分组
   + **按可用区/实例类型** – 按实例集请求、可用区和实例类型分组

1. 要查看某指标的数据，请选中该指标旁边的复选框。
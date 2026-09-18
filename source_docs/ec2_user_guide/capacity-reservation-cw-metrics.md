

# 使用 CloudWatch 指标监控容量预留使用情况
<a name="capacity-reservation-cw-metrics"></a>

使用 CloudWatch 指标，您可以通过设置 CloudWatch 警报以在达到使用情况阈值时通知您，高效地监控您的容量预留并识别未使用的容量。这可以帮助您保持恒定的容量预留卷并实现更高级别的利用率。

容量预留每五分钟向 CloudWatch 发送一次指标数据。对于处于活动状态少于五分钟的容量预留，不支持指标。

有关在 CloudWatch 控制台中查看指标的更多信息，请参阅[使用 Amazon CloudWatch 指标](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)。有关创建警报的更多信息，请参阅[创建 Amazon CloudWatch 警报](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)。

**Topics**
+ [容量预留使用情况指标](#capacity-reservation-usage-metrics)
+ [容量预留指标维度](#capacity-reservation-dimensions)
+ [查看用于 容量预留 的 CloudWatch 指标](#viewing-capacity-reservation-metrics)

## 容量预留使用情况指标
<a name="capacity-reservation-usage-metrics"></a>

`AWS/EC2CapacityReservations` 命名空间包括以下使用情况指标，可用于监控和维护在为预留指定的阈值内的按需容量。


| 指标 | 描述 | 
| --- | --- | 
|  UsedInstanceCount | 当前正在使用的实例数。<br />单位：计数 | 
|  AvailableInstanceCount  | 可用实例的数量。<br />单位：计数 | 
|  TotalInstanceCount  | 您预留的实例总数。<br />单位：计数 | 
|  InstanceUtilization  | 当前正在使用的预留容量实例的百分比。<br />单位：百分比 | 

## 容量预留指标维度
<a name="capacity-reservation-dimensions"></a>

您可以使用以下维度来优化所选区域和账户内上表中列出的指标。


|  维度  |  说明  | 
| --- | --- | 
|  （无维度）  | 此维度筛选所有容量预留的指定指标。 | 
|  CapacityReservationId  | 此维度筛选已确定容量预留的指定指标。 | 
|  InstanceType  | 此维度筛选已确定实例类型的指定指标。 | 
|  AvailabilityZone  | 此维度筛选已确定可用区的指定指标。 | 
|  InstanceMatchCriteria  | 此维度筛选已确定实例匹配条件的指定指标（`open` 或 `targeted`）。 | 
|  InstancePlatform  | 此维度筛选已确定平台的指定指标数据。 | 
|  Tenancy  | 此维度筛选已确定租赁的指定指标。 | 

## 查看用于 容量预留 的 CloudWatch 指标
<a name="viewing-capacity-reservation-metrics"></a>

指标首先按服务命名空间进行分组，然后按支持的维度进行分组。您可以按照以下过程查看容量预留的各项指标。

**使用 CloudWatch 控制台查看容量预留指标**

1. 通过以下网址打开 CloudWatch 控制台：[https://console.aws.amazon.com/cloudwatch/](https://console.aws.amazon.com/cloudwatch/)。

1. 如果需要，可以更改区域。从导航栏中，选择您的容量预留所在的区域。有关更多信息，请参阅 [Regions and Endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html)。

1. 在导航窗格中，选择**指标**。

1. 对于**所有指标**，选择 **EC2 容量预留**。

1. 从上述指标维度中选择**跨所有容量预留**、**按容量预留**、**按实例类型**、**按可用区**、**按平台**、**按实例匹配条件**或**按租户**，指标将分别按“无维度”、`CapacityReservationId`、`InstanceType`、`AvailabilityZone`、`Platform`、`InstanceMatchCriteria` 和 `Tenancy` 进行分组。

1. 要对指标进行排序，请使用列标题。要为指标绘制图表，请选中该指标旁边的复选框。

**使用 AWS CLI 查看容量预留指标**  
使用以下 [list-metrics](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/list-metrics.html) 命令：

```
aws cloudwatch list-metrics --namespace "AWS/EC2CapacityReservations"
```
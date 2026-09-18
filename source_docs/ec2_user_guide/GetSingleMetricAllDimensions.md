

# 聚合不同实例的统计数据
<a name="GetSingleMetricAllDimensions"></a>

聚合统计信息适用于已经启用详细监控的实例。聚合中不包含使用基本监控的实例。在获取多实例聚合统计数据前，必须[启用详细监控](manage-detailed-monitoring.md#enable-detailed-monitoring)（另外收费），以提供以 1 分钟为间隔的数据。

请注意，Amazon CloudWatch 不能跨各个 AWS 区域聚合数据。指标在各区域间彼此独立。

此示例显示了如何使用详细监控来获取 EC2 实例的平均 CPU 使用率。因为未指定任何维度，所以 CloudWatch 会返回 `AWS/EC2` 命名空间中所有维度的统计数据。

**重要**  
此方法可以在 AWS 命名空间中检索所有维度，但不适用于发布到 Amazon CloudWatch 的自定义命名空间。对于自定义命名空间，必须指定与任意给定数据关联的完整的维度组，以检索包含数据点的统计数据。

**显示实例的平均 CPU 利用率（控制台）**

1. 通过以下网址打开 CloudWatch 控制台：[https://console.aws.amazon.com/cloudwatch/](https://console.aws.amazon.com/cloudwatch/)。

1. 在导航窗格中，选择**指标**。

1. 选择 **EC2** 命名空间，然后选择 **Across All Instances (跨所有实例)**。

1. 选择包含 **CPUUtilization** 的行，这将显示所有 EC2 实例的指标的图表。要为该图标命名，请选择铅笔图标。要更改时间范围，请选择某个预定义的值或选择 **custom**。  
![跨 EC2 实例聚合的指标。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/metric_aggregated_instances.png)

1. 要更改指标的统计数据或时间段，请选择 **Graphed metrics** 选项卡。选择列标题或单个值，然后选择其他值。

**获取实例的平均 CPU 利用率 (AWS CLI)**  
使用 [get-metric-statistics](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/get-metric-statistics.html) 命令 (如下所示) 获取实例的平均 **CPUUtilization** 指标。

```
aws cloudwatch get-metric-statistics \
    --namespace AWS/EC2 \
    --metric-name CPUUtilization \ 
    --period 3600  --statistics "Average" "SampleCount" \ 
    --start-time {{2022-10-11T23:18:00}} \
    --end-time {{2022-10-12T23:18:00}}
```

下面是示例输出：

```
{
    "Datapoints": [
        {
            "SampleCount": 238.0, 
            "Timestamp": "2022-10-12T07:18:00Z", 
            "Average": 0.038235294117647062, 
            "Unit": "Percent"
        }, 
        {
            "SampleCount": 240.0, 
            "Timestamp": "2022-10-12T09:18:00Z", 
            "Average": 0.16670833333333332, 
            "Unit": "Percent"
        }, 
        {
            "SampleCount": 238.0, 
            "Timestamp": "2022-10-11T23:18:00Z", 
            "Average": 0.041596638655462197, 
            "Unit": "Percent"
        }
    ], 
    "Label": "CPUUtilization"
}
```
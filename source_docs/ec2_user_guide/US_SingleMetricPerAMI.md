

# 按 AMI 聚合统计数据
<a name="US_SingleMetricPerAMI"></a>

您可以通过 AMI 聚合已启用详细监控的实例的统计数据。聚合中不包含使用基本监控的实例。在获取多实例聚合统计数据前，必须[启用详细监控](manage-detailed-monitoring.md#enable-detailed-monitoring)（另外收费），以提供以 1 分钟为间隔的数据。

请注意，Amazon CloudWatch 不能跨各个 AWS 区域聚合数据。指标在各区域间彼此独立。

此示例显示了如何确定使用特定亚马逊机器映像（AMI）的所有实例的平均 CPU 使用率。平均值以 60 秒为时间间隔 1 天为周期。

**按 AMI 显示平均 CPU 利用率（控制台）**

1. 通过以下网址打开 CloudWatch 控制台：[https://console.aws.amazon.com/cloudwatch/](https://console.aws.amazon.com/cloudwatch/)。

1. 在导航窗格中，选择**指标**。

1. 选择 **EC2** 命名空间，然后选择 **By Image (AMI) Id**。

1. 选择 **CPUUtilization** 指标和特定 AMI 所在的行，这将显示指定 AMI 的指标的图表。要为该图标命名，请选择铅笔图标。要更改时间范围，请选择某个预定义的值或选择 **custom**。

1. 要更改指标的统计数据或时间段，请选择 **Graphed metrics** 选项卡。选择列标题或单个值，然后选择其他值。

**获取某个映像 ID 的平均 CPU 利用率 (AWS CLI)**  
使用 [get-metric-statistics](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/get-metric-statistics.html) 命令，如下所示。

```
aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization  --period 3600 \
--statistics Average --dimensions Name=ImageId,Value=ami-{{3c47a355}} --start-time {{2022-10-10T00:00:00}} --end-time {{2022-10-11T00:00:00}}
```

下面是示例输出。每个数值代表运行指定 AMI 的 EC2 实例的平均 CPU 使用率百分比。

```
{
    "Datapoints": [
        {
            "Timestamp": "2022-10-10T07:00:00Z", 
            "Average": 0.041000000000000009, 
            "Unit": "Percent"
        }, 
        {
            "Timestamp": "2022-10-10T14:00:00Z", 
            "Average": 0.079579831932773085, 
            "Unit": "Percent"
        }, 
        {
            "Timestamp": "2022-10-10T06:00:00Z", 
            "Average": 0.036000000000000011, 
            "Unit": "Percent"
        }
    ], 
    "Label": "CPUUtilization"
}
```
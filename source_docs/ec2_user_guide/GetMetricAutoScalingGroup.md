

# 按自动扩缩组聚合统计数据
<a name="GetMetricAutoScalingGroup"></a>

您可以聚合自动扩缩组中 EC2 实例的统计数据。请注意，Amazon CloudWatch 不能跨各个 AWS 区域聚合数据。指标在各区域间彼此独立。

此示例说明如何检索为一个自动扩缩组写入磁盘的字节总数。总数以 1 分钟为周期 24 小时为间隔针对指定自动扩缩组中的所有 EC2 实例计算得出。

**显示一个自动扩缩组中的实例的 DiskWriteBytes（控制台）**

1. 通过以下网址打开 CloudWatch 控制台：[https://console.aws.amazon.com/cloudwatch/](https://console.aws.amazon.com/cloudwatch/)。

1. 在导航窗格中，选择**指标**。

1. 选择 **EC2** 命名空间，然后选择 **By Auto Scaling Group**。

1. 选择 **DiskWriteBytes** 指标和特定自动扩缩组所在的行，这将显示自动扩缩组中实例的指标的图表。要为该图标命名，请选择铅笔图标。要更改时间范围，请选择某个预定义的值或选择 **custom**。

1. 要更改指标的统计数据或时间段，请选择 **Graphed metrics** 选项卡。选择列标题或单个值，然后选择其他值。

**显示一个自动扩缩组中的实例的 DiskWriteBytes（AWS CLI）**  
使用 [get-metric-statistics](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/get-metric-statistics.html) 命令，如下所示。

```
aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name DiskWriteBytes --period 360 \
--statistics "Sum" "SampleCount" --dimensions Name=AutoScalingGroupName,Value={{my-asg}} --start-time {{2022-10-16T23:18:00}} --end-time {{2022-10-18T23:18:00}}
```

下面是示例输出：

```
{
    "Datapoints": [
        {
            "SampleCount": 18.0, 
            "Timestamp": "2022-10-19T21:36:00Z", 
            "Sum": 0.0, 
            "Unit": "Bytes"
        }, 
        {
            "SampleCount": 5.0, 
            "Timestamp": "2022-10-19T21:42:00Z", 
            "Sum": 0.0, 
            "Unit": "Bytes"
        }
    ], 
    "Label": "DiskWriteBytes"
}
```
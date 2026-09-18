

# 获取特定实例的统计数据
<a name="US_SingleMetricPerInstance"></a>

您可以使用 AWS 管理控制台或 AWS CLI 来获取特定实例的统计数据。以下示例显示了如何使用 AWS 管理控制台 或 AWS CLI 来确定特定 EC2 实例的最大 CPU 利用率。

**要求**
+ 您必须拥有实例的 ID。可使用 AWS 管理控制台 或 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令获取实例 ID。
+ 默认情况下，基本监控已启用，但您可以启用详细监控。有关更多信息，请参阅 [管理 EC2 实例的详细监控](manage-detailed-monitoring.md)。

**显示指定实例的 CPU 利用率（控制台）**

1. 通过以下网址打开 CloudWatch 控制台：[https://console.aws.amazon.com/cloudwatch/](https://console.aws.amazon.com/cloudwatch/)。

1. 在导航窗格中，选择**指标**。

1. 选择 **EC2** 指标命名空间。

1. 选择 **Per-Instance Metrics (每个实例的指标)** 维度。

1. 在搜索框中，输入 **CPUUtilization** 并按 Enter。选择特定实例所在的行，这将显示该实例的 **CPUUtilization** 指标的图表。要为该图标命名，请选择铅笔图标。要更改时间范围，请选择某个预定义的值或选择 **custom**。  
![绘制单个指标的图表。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/metric_statistics_ec2_instance.png)

1. 要更改指标的统计数据或时间段，请选择 **Graphed metrics** 选项卡。选择列标题或单个值，然后选择其他值。  
![更改指标的统计数据或时段。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/metric_statistics_ec2_instance_statistic_period.png)

**获取特定实例的 CPU 利用率 (AWS CLI)**  
使用以下 [get-metric-statistics](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/get-metric-statistics.html) 命令获取指定实例的 **CPUUtilization** 指标（使用指定周期和时间间隔）：

```
aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization  --period 3600 \
--statistics Maximum --dimensions Name=InstanceId,Value={{i-1234567890abcdef0}} \
--start-time {{2022-10-18T23:18:00}} --end-time {{2022-10-19T23:18:00}}
```

下面是示例输出。每个数值代表一个 EC2 实例的最大 CPU 使用率百分比。

```
{
    "Datapoints": [
        {
            "Timestamp": "2022-10-19T00:18:00Z", 
            "Maximum": 0.33000000000000002, 
            "Unit": "Percent"
        }, 
        {
            "Timestamp": "2022-10-19T03:18:00Z", 
            "Maximum": 99.670000000000002, 
            "Unit": "Percent"
        }, 
        {
            "Timestamp": "2022-10-19T07:18:00Z", 
            "Maximum": 0.34000000000000002, 
            "Unit": "Percent"
        }, 
        {
            "Timestamp": "2022-10-19T12:18:00Z", 
            "Maximum": 0.34000000000000002, 
            "Unit": "Percent"
        }
    ], 
    "Label": "CPUUtilization"
}
```
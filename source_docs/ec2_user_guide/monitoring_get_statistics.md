

# 实例的 CloudWatch 指标的统计数据
<a name="monitoring_get_statistics"></a>

您可以获取有关实例的 CloudWatch 指标的统计信息。*统计数据*是指定时间段内的指标数据汇总。CloudWatch 提供统计数据的依据是您的自定义数据所提供的指标数据点，或其他 AWS 服务向 CloudWatch 提供的指标数据点。聚合通过使用命名空间、指标名称、维度以及数据点度量单位在您指定的时间段内完成。下表介绍了可用的统计信息。


| 统计数据 | 描述 | 
| --- | --- | 
| Minimum | 指定时间段内的最低观察值。可以使用此值来决定应用程序的活动量是否较低。 | 
| Maximum | 指定时间段内的最高观察值。可以使用此值来决定应用程序的活动量是否较高。 | 
| Sum | 为匹配指标所提交的所有的值添加在一起。此统计信息的作用是决定指标的总量。 | 
| Average | 指定时间段内 `Sum` / `SampleCount` 的值。通过将此统计信息与 `Minimum` 和 `Maximum` 进行比较，可以决定指标的完整范围以及平均使用率与 `Minimum` 和 `Maximum` 的接近程度。这样的比较可以帮助了解何时应该根据需要增加或减少资源。 | 
| SampleCount | 数据点计数 (数量) 用于统计信息的计算。 | 
| pNN.NN | 指定的百分位数的值。您可以指定任何百分位数，最多使用两位小数 (例如 p95.45)。 | 

**Topics**
+ [获取特定实例的统计数据](US_SingleMetricPerInstance.md)
+ [聚合不同实例的统计数据](GetSingleMetricAllDimensions.md)
+ [按自动扩缩组聚合统计数据](GetMetricAutoScalingGroup.md)
+ [按 AMI 聚合统计数据](US_SingleMetricPerAMI.md)
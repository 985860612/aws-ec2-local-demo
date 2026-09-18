

# Amazon EC2 实例存储卷的详细性能统计数据
<a name="nvme-detailed-performance-stats"></a>

Amazon EC2 为连接到基于 Nitro 的 Amazon EC2 实例的 NVMe 实例存储卷提供实时、高分辨率的性能统计数据。这些统计数据以聚合计数器的形式显示，将在实例的生命周期内保留。统计数据提供有关累积操作数、发送和接收的字节数、读取和写入 I/O 操作所花费的时间以及读取和写入 I/O 操作直方图的详细信息。这些统计数据与 [Amazon EBS 详细性能统计数据](https://docs.aws.amazon.com/ebs/latest/userguide/nvme-detailed-performance-stats.html)保持一致，同时还包含按 I/O 大小细分的详细延迟直方图，可以更精细地洞察您的存储性能模式。这种增强的可见性使您能够精确识别哪些特定的 I/O 大小遇到了延迟问题，从而可以优化应用程序性能并更有效地解决问题。

您可以按最高 1 秒的间隔收集这些统计数据。如果发出请求的频率超过 1 秒的间隔，NVMe 驱动程序可能会将这些请求与其他管理命令一起排队，以便稍后处理。

**注意事项**
+ 仅挂载到基于 Nitro 的实例的 NVMe 实例存储卷支持这些统计数据。
+ 在实例停止和重启期间，计数器不会保留。
+ 这些统计数据无需额外费用即可使用。

## 统计数据
<a name="nvme-stats"></a>

NVMe 块设备提供以下统计信息：


| 统计数据名称 | 全名 | 类型 | 说明 | 
| --- | --- | --- | --- | 
| total\_read\_ops | 总读取操作数 | 计数器 | 已完成的读取操作总数。 | 
| total\_write\_ops | 总写入操作数 | 计数器 | 已完成的写入操作总数。 | 
| total\_read\_bytes | 总读取字节数 | 计数器 | 传输的读取字节总数。 | 
| total\_write\_bytes | 总写入字节数 | 计数器 | 传输的写入字节总数。 | 
| total\_read\_time | 总读取时间 | 计数器 | 所有已完成读取操作的总耗时（单位：微秒）。 | 
| total\_write\_time | 总写入时间 | 计数器 | 所有已完成写入操作的总耗时（单位：微秒）。 | 
| instance\_store\_volume\_performance\_exceeded\_iops | 总需求时间超出卷的最大 IOPS | 计数器 | IOPS 请求超出卷最大 IOPS 的总时间（单位：微秒）。大于 0 的任何值都表明您的工作负载需要的 IOPS 超出卷的交付能力。理想情况下，该指标的增量计数在两次快照时间之间应最少。 | 
| instance\_store\_volume\_performance\_exceeded\_tp | 总需求时间超出卷的最大吞吐量 | 计数器 | 吞吐量请求超出卷最大吞吐量的总时间（单位：微秒）。大于 0 的任何值都表明您的工作负载需要的吞吐量超出卷的交付能力。理想情况下，该指标的增量计数在两次快照时间之间应最少。 | 
| volume\_queue\_length | 卷队列长度 | 时间点 | 待完成的读取与写入操作的数量。 | 
| read\_io\_latency\_histogram | 读取 I/O 直方图 | 直方图\* | 每个延迟区间内完成的读取操作数（单位：微秒）。 | 
| write\_io\_latency\_histogram | 写入 I/O 直方图 | 直方图\* | 每个延迟区间内完成的写入操作数（单位：微秒）。 | 

**注意**  
\* 直方图统计数据仅表示成功完成的 I/O 操作数。停滞或受损的 I/O 操作不包括在内，但将在 `volume_queue_length` 统计数据中显示，以时间点统计数据的形式呈现。

## 访问统计数据
<a name="nvme-stat-access"></a>

必须直接从实例存储卷所挂载的实例访问统计数据。您可以使用以下方法之一访问统计数据。

### Linux 实例
<a name="nvme-stat-access-linux"></a>

------
#### [ Amazon CloudWatch ]

您可以将 Amazon CloudWatch 代理配置为从实例收集统计数据，然后将其作为自定义指标提供给 CloudWatch。然后，您可以使用 CloudWatch 中的指标来分析 I/O 模式、跟踪性能趋势、创建自定义控制面板以及根据性能阈值设置自动警报。

有关配置 CloudWatch 代理的更多信息，请参阅[收集 Amazon EC2 实例存储卷指标](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-instance-store-Collect.html)。

------
#### [ nvme-cli tool ]

**访问统计数据**

1. 连接到卷所挂载的实例。

1. 2025 年 9 月 15 日之后发布的 Amazon Linux 2023 AMI 包含最新版本的 `nvme-cli` 工具。如果您使用的是较旧的 Amazon Linux AMI，请更新 `nvme-cli` 工具。

   ```
   sudo yum install nvme-cli
   ```

1. 运行以下命令并指定卷的设备名称。

   ```
   sudo nvme amzn stats /dev/{{nvme0n1}}
   ```

统计数据还提供了按 I/O 大小细分的详细延迟直方图。要查看按 I/O 大小细分的统计数据，请包含 `--details` 选项。例如：

```
sudo nvme amzn stats --details /dev/{{nvme0n1}}
```

通过指定 `--help` 选项，您可以获得有关如何使用该工具的更多信息。例如：

```
sudo nvme amzn stats --help
```

------

### Windows 实例
<a name="nvme-stat-access-windows"></a>

------
#### [ nvme\_amzn.exe tool ]

**访问统计数据**

1. 连接到卷所挂载的实例。

1. 确保您使用的是 AWSNVMe 驱动程序版本 `1.7.0` 或更高版本。有关更新 AWSNVMe 驱动程序的更多信息，请参阅 [AWS NVMe 驱动程序](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/aws-nvme-drivers.html)。

1. 获取卷的磁盘编号。有关更多信息，请参阅[将 Amazon EC2 Windows 实例上的 NVMe 磁盘映射到卷](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/windows-list-disks-nvme.html)。

1. 以管理员身份运行以下命令，并指定卷的磁盘编号。

   ```
   .\nvme_amzn.exe stats {{disk_number}}
   ```

统计数据还提供了按 I/O 大小细分的详细延迟直方图。要查看按 I/O 大小细分的统计数据，请包含 `--details` 选项。例如：

```
.\nvme_amzn.exe stats --details {{disk_number}}
```

------
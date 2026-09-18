

# 验证是否已进行实例自动恢复
<a name="verify-if-automatic-recovery-occurred"></a>

如果实例出现脱机后又意外重启，则可能是因底层硬件或软件问题而进行了[实例自动恢复](ec2-instance-recover.md#ec2-automatic-instance-recovery-key-concepts)。您可以在 Health Dashboard 中检查是否有实例自动恢复事件来加以验证。您还可以查看 **StatusCheckFailed\_System** Amazon CloudWatch 指标，检查是否检测到实例的底层硬件或软件问题。

## 在 Health Dashboard 中检查是否有事件
<a name="automatic-instance-recovery-events"></a>

在尝试执行实例自动恢复时，AWS 会向 Health Dashboard 发送事件。具体事件取决于配置的恢复机制以及尝试成功与否。

**在 Health Dashboard 中检查是否有实例自动恢复事件**

1. 通过以下网址打开 Health Dashboard：[https://phd.aws.amazon.com/phd/home\#/](https://phd.aws.amazon.com/phd/)。

1. 查找与实例自动恢复相关的事件。这些事件的存在可以确认是否进行了实例自动恢复以及恢复结果。
   + 简化的自动恢复
     + 成功事件：`AWS_EC2_SIMPLIFIED_AUTO_RECOVERY_SUCCESS`
     + 失败事件：`AWS_EC2_SIMPLIFIED_AUTO_RECOVERY_FAILURE`
   + CloudWatch 基于操作的恢复
     + 成功事件：`AWS_EC2_INSTANCE_AUTO_RECOVERY_SUCCESS`
     + 失败事件：`AWS_EC2_INSTANCE_AUTO_RECOVERY_FAILURE`

## 使用 CloudWatch 监控系统状态检查情况
<a name="verify-an-underlying-hardware-issue"></a>

在 CloudWatch 中查看 [StatusCheckFailed\_System](viewing_metrics_with_cloudwatch.md#status-check-metrics) 指标，即可验证实例是否检测到了底层硬件或软件问题。该指标值会表明系统状态检查是通过（无硬件或软件问题）还是失败（有硬件或软件问题）。

**验证是否检测出底层硬件或软件问题**

1. 通过以下网址打开 CloudWatch 控制台的**指标**页面：[https://console.aws.amazon.com/cloudwatch/home?\#metricsV2](https://console.aws.amazon.com/cloudwatch/home?#metricsV2)。

1. 确认自己与 EC2 实例位于同一区域。

1. 将以下指标粘贴到**指标**搜索字段中，然后按 Enter。

   ```
   StatusCheckFailed_System
   ```

1. 选择 **EC2 > 每个实例的指标**。

1. 在表中，选中要检查的实例旁边的复选框。

1. 将查询时段更改为疑似发生了恢复事件的时间。

1. 选择**绘成图表的指标**选项卡，然后对 **StatusCheckFailed\_System** 执行以下操作：

   1. 在**统计数据**字段中选择**平均值**、**最大值**或**最小值**。

   1. 对于**周期**，选择 **1 分钟**。

1. 检查 **StatusCheckFailed\_System** 的值。
   + 值为 **0**：系统状态检查通过，表示没有底层硬件或软件问题。
   + 值为 **1**：系统状态检查失败，表示存在底层硬件或软件问题。

有关更多信息，请参阅 [实例自动恢复](ec2-instance-recover.md)。
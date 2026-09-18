

# 步进扩展：使用步进扩展策略扩展竞价型实例集
<a name="spot-fleet-step-scaling"></a>

在使用步进扩展策略时，您可以指定 CloudWatch 警报以触发扩展过程。例如，如果您希望在 CPU 利用率达到特定水平时横向扩展，可以使用 Amazon EC2 提供的 `CPUUtilization` 指标创建警报。

在创建步进扩展策略时，您必须指定以下扩展调整类型之一：
+ **添加**：按指定的容量单位数量或当前容量的指定百分比来增加实例集的目标容量。
+ **移除**：按指定的容量单位数量或当前容量的指定百分比来缩减实例集的目标容量。
+ **设置为**：将实例集的目标容量设为指定的容量单位数量。

当触发警报时，自动扩展过程使用执行容量和扩展策略计算新的目标容量，然后相应地更新目标容量。例如，假设目标容量和执行容量为 10，扩展策略加 1。触发警报时，自动扩展过程为 10 增加 1 得到 11，因此竞价型实例集将启动 1 个实例。

当竞价型实例集因目标容量下降而终止竞价型实例时，该实例将收到一条竞价型实例中断通知。

**先决条件**
+ 竞价型实例集请求必须使用 `maintain` 作为请求类型。`request` 类型的请求不支持自动扩缩。
+ 配置 [竞价型实例集自动扩展所需的 IAM 权限](spot-fleet-auto-scaling-IAM.md)。
+ 考虑哪些 CloudWatch 指标对您的应用程序比较重要。您可以根据 AWS 提供的指标或您自己的自定义指标来创建 CloudWatch 告警。
+ 如果您打算在扩展策略中使用 AWS 指标，请为其启用 CloudWatch 指标集合（如果提供这些指标的服务默认未启用它的话）。
+ 查看[注意事项](spot-fleet-automatic-scaling.md#considerations-for-spot-fleet-automatic-scaling)。

**创建 CloudWatch 警报**

1. 通过以下网址打开 CloudWatch 控制台：[https://console.aws.amazon.com/cloudwatch/](https://console.aws.amazon.com/cloudwatch/)。

1. 在导航窗格中，展开**警报**，然后选择**所有警报**。

1. 选择 **Create Alarm (创建警报)**。

1. 在 **Specify metric and conditions (指定指标和条件)** 页面上，选择 **Select metric (选择指标)**。

1. 依次选择 **EC2 竞价型实例**、**实例集请求指标**，选择一个指标（例如，**TargetCapacity**），然后选择**选择指标**。

   这将显示 **Specify metric and conditions (指定指标和条件)** 页面，其中显示一个图表以及有关所选指标的其他信息。

1. 对于**周期**，选择警报的评估周期，例如 **1 分钟**。评估警报时，每个周期都聚合到一个数据点。
**注意**  
周期越短，创建的警报越敏感。

1. 在 **Conditions (条件)** 下，通过定义阈值条件来定义警报。例如，您可以定义一个阈值，在指标值大于或等于 80% 时触发警报。

1. 在 **Additional configuration (附加配置)** 下，对于 **Datapoints to alarm (触发警报的数据点数)**，请指定必须有多少个数据点（评估期）处于 ALARM 状态才会触发警报，例如，1 个或 2 个（共 3 个）评估期。这将创建一个警报，如果多个连续周期超出阈值，该警报将进入 ALARM（警报）状态。有关更多信息，请参阅 *Amazon CloudWatch 用户指南* 中的[评估警报](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation)。

1. 对于 **Missing data treatment (缺失数据处理)**，选择某个选项（或保留 **Treat missing data as missing (将缺失的数据视为缺失)** 的默认值）。有关更多信息，请参阅 *Amazon CloudWatch 用户指南*中的[配置 CloudWatch 警报处理缺少数据的方式](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-and-missing-data)。

1. 选择 **Next (下一步)**。

1. （可选）要接收扩展事件的通知，在 **Notification (通知)** 中，您可以选择或创建要用于接收通知的 Amazon SNS 主题。当然，您也可以立即删除通知，之后按需添加通知。

1. 选择**下一步**。

1. 在**添加名称和描述**下，输入警报的名称和描述，然后选择**下一步**。

1. 选择**创建警报**。

**为竞价型实例集配置分步扩展策略**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择竞价型实例集请求。

1. 选择屏幕底部附近的**自动扩缩**选项卡。如果您选择了竞价型实例集的链接，则没有选项卡；而是向下滚动到**自动扩缩**部分。

1. 如果未配置自动扩展，请选择 **Configure**。

1. 使用**扩展容量，使其介于**设置实例集的最小和最大容量。扩展策略不会将实例集扩展至超出最小或最大容量范围。

1. 在**扩展策略**下，对于**策略类型**，选择**步进扩展策略**。

1. 最初，**扩展策略**包含名为 **ScaleUp** 和 **ScaleDown** 的分步扩展策略。您可以完善这些策略，或选择 **Remove policy** 来删除它们。您也可以选择 **Add policy (添加策略)**。

1. 要定义策略，请执行以下操作：

   1. 对于 **Policy name**（策略名称），输入此策略的名称。

   1. 对于**策略触发器**，可以选择现有的警报，也可以选择**创建警报**打开 Amazon CloudWatch 控制台并创建警报。

   1. 对于**修改容量**，定义扩展量以及分步调整的下限和上限。您可以添加或删除特定数量的实例或现有实例集大小的百分比，也可将实例集设置为准确的大小。

      例如，要创建将实例集容量增加 30% 的步进扩展策略，请选择**添加**，在下一个字段中输入 **30**，然后选择**百分比**。默认情况下，添加策略的下限为警报阈值，上限为正（\+）无穷。默认情况下，移除策略的上限为警报阈值，下限为负 (-) 无穷。

   1. （可选）要添加其他步骤，请选择**添加步骤**。

   1. 对于**冷却时间**，指定新值（以秒为单位）或保留默认值。

1. 选择**保存**。

**使用 AWS CLI 为竞价型实例集配置分步扩展策略**

1. 使用 [register-scalable-target](https://docs.aws.amazon.com/cli/latest/reference/application-autoscaling/register-scalable-target.html) 命令将竞价型实例集请求注册为可扩展目标。

1. 使用 [put-scaling-policy](https://docs.aws.amazon.com/cli/latest/reference/application-autoscaling/put-scaling-policy.html) 命令创建扩展策略。

1. 使用 [put-metric-alarm](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/put-metric-alarm.html) 命令创建触发扩展策略的警报。
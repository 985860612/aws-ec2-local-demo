

# 目标跟踪扩展：通过确定特定指标的目标值来扩展竞价型实例集
<a name="spot-fleet-target-tracking"></a>

凭借目标跟踪扩展，您可以通过选择指标并设置目标值来创建目标跟踪扩展策略。然后，竞价型实例集将创建和管理触发扩展策略的 CloudWatch 警报，并根据所选指标和目标值计算扩展调整。扩展策略通过根据需要添加或删除实例来调整容量，将指标保持在指定的目标值或接近指定的目标值。目标跟踪策略将指标保持在目标值附近，而且还可以根据由于负载模式波动而造成的指标波动进行调节，并最大限度地减少快速容量波动。

您可以为竞价型实例集创建多个目标跟踪扩展策略，但前提是每个策略分别使用不同的指标。实例集根据指定最大实例集容量的策略进行扩展。这样便可涵盖多种场景，以确保您的应用程序工作负载拥有足够的容量。

为了确保应用程序可用性，实例集针对指标尽快按比例向外扩展，但会逐渐向内扩展。

当竞价型实例集因目标容量下降而终止竞价型实例时，该实例将收到一条竞价型实例中断通知。

**注意**  
请勿编辑或删除竞价型实例集为目标跟踪扩展策略管理的 CloudWatch 警报。在删除目标跟踪扩展策略时，竞价型实例集将自动删除警报。

**先决条件**
+ 竞价型实例集请求必须使用 `maintain` 作为请求类型。`request` 类型的请求不支持自动扩缩。
+ 配置 [竞价型实例集自动扩展所需的 IAM 权限](spot-fleet-auto-scaling-IAM.md)。
+ 查看[注意事项](spot-fleet-automatic-scaling.md#considerations-for-spot-fleet-automatic-scaling)。

**配置目标跟踪策略**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择竞价型实例集请求。

1. 选择屏幕底部附近的**自动扩缩**选项卡。如果您选择了竞价型实例集的链接，则没有选项卡；而是向下滚动到**自动扩缩**部分。

1. 如果未配置自动扩展，请选择 **Configure**。

1. 使用**扩展容量，使其介于**设置实例集的最小和最大容量。实例集的自动扩展操作不会超出最小或最大容量范围。

1. 对于 **Policy name**（策略名称），输入此策略的名称。

1. 选择一个**目标指标**。

1. 为该指标键入一个**目标值**。

1. 对于**冷却时间**，指定新值（以秒为单位）或保留默认值。

1. （可选）要忽略根据当前配置创建横向缩减策略，请选择**禁用缩减**。您可以使用不同的配置创建一个横向缩减策略。

1. 选择 **Save**。

**使用 AWS CLI 配置目标跟踪策略**

1. 使用 [register-scalable-target](https://docs.aws.amazon.com/cli/latest/reference/application-autoscaling/register-scalable-target.html) 命令将竞价型实例集请求注册为可扩展目标。

1. 使用 [put-scaling-policy](https://docs.aws.amazon.com/cli/latest/reference/application-autoscaling/put-scaling-policy.html) 命令创建扩展策略。
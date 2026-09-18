

# 使用您的预留实例
<a name="using-reserved-instances"></a>

预留实例 将自动应用于正在运行的 按需型实例（前提匹配规范）。如果正在运行的 按需型实例 都与 Reserved Instance 的规范不匹配，则不会使用 Reserved Instance，直到您启动具有指定规范的实例。

如果您要启动按需型实例以利用预留实例的账单收益，请确保您在配置按需型实例时指定了以下信息：

**平台**  
您必须指定与您预留实例的平台（产品说明）相匹配的亚马逊机器映像（AMI）。例如，如果您为预留实例指定 `Linux/UNIX`，则可以从 Amazon Linux AMI 或 Ubuntu AMI 启动实例。

**实例类型**  
如果您购买了可用区预留实例，则必须指定与您的预留实例相同的实例类型，例如：`t3.large`。有关更多信息，请参阅 [如何应用可用区预留实例](apply_ri.md#apply-zonal-ri)。  
如果您购买了区域性预留实例，则必须指定与预留实例的实例类型相同的实例系列中的实例类型。例如，如果您为预留实例指定 `t3.xlarge` 作为实例类型，则您必须从 T3 系列启动实例，但可指定其为任意大小，例如 `t3.medium`。有关更多信息，请参阅 [如何应用区域性预留实例](apply_ri.md#apply-regional-ri)。

**可用区**。  
如果您为特定可用区购买了可用区预留实例，则必须在相同的可用区中启动实例。  
如果您购买了区域性预留实例，则可以在任何您为该预留实例指定的区域的可用区中启动实例。

**租赁**  
实例的租赁必须与预留实例的租赁匹配；例如 `dedicated` 或 `shared`。有关更多信息，请参阅 [Amazon EC2 专用实例](dedicated-instance.md)。

有关如何将预留实例应用于正在运行的按需型实例的示例，请参阅 [如何应用预留实例折扣](apply_ri.md)。有关更多信息，请参阅[为什么我的 Amazon EC2 预留实例没有以我期望的方式应用于我的 AWS 账单？](https://repost.aws/knowledge-center/reserved-instance-applying-why)

您可以使用多种方法来启动使用您的预留实例折扣的按需型实例。有关不同启动方法的信息，请参阅 [启动 Amazon EC2 实例](LaunchingAndUsingInstances.md)。您也可以使用 Amazon EC2 Auto Scaling 来启动实例。有关更多信息，请参阅 [Amazon EC2 Auto Scaling 用户指南](https://docs.aws.amazon.com/autoscaling/ec2/userguide/)。
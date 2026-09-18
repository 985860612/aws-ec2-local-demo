

# 从 EC2 实例类型查找器获取建议
<a name="get-ec2-instance-type-recommendations"></a>

EC2 实例类型查找器会考虑您的使用案例、工作负载类型和 CPU 制造商偏好，您优先考虑价格还是性能，以及您可以指定的其他参数。随后，它利用这些数据提供有关最适合新工作负载的 Amazon EC2 实例类型的建议和指导。

有如此多的实例类型可供使用，因此找到适用于您工作负载的实例类型可能非常耗时和复杂。使用 EC2 实例类型查找器，您可以随时获得最新的实例类型，并为您的工作负载实现最佳性价比。

您可以使用 Amazon EC2 控制台获取有关 EC2 实例类型的建议和指导。您也可以直接转到 Amazon Q，以寻求实例类型建议。有关更多信息，请参阅《Amazon Q 开发者版用户指南》[https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html)。

如果您正在为*现有的*工作负载寻找实例类型建议，请使用 AWS Compute Optimizer。有关更多信息，请参阅 [从 Compute Optimizer 获取 EC2 实例建议](ec2-instance-recommendations.md)。

## 使用 EC2 实例类型查找器
<a name="use-ec2-instance-type-finder"></a>

在 Amazon EC2 控制台中，您可以在启动实例向导中、创建启动模板时或在**实例类型**页面上，从 EC2 实例类型查找器获取实例类型建议。

请按照以下说明，使用 Amazon EC2 控制台中的 EC2 实例类型查找器获得 EC2 实例类型建议和指导。要观看这些步骤的动画，请参阅 [观看动画：使用 EC2 实例类型查找器获取实例类型建议](#use-ec2-instance-type-finder-animation)。

**使用 EC2 实例类型查找器获取实例类型建议**

1. 使用以下任一方法开始您的流程：
   + 按照程序[启动实例](ec2-launch-instance-wizard.md)。在**实例类型**的旁边，选择**获取建议**链接。
   + 按照该程序[创建启动模板](create-launch-template.md#create-launch-template-define-parameters)。在**实例类型**的旁边，选择**获取建议**链接。
   + 在导航窗格中，选择**实例类型**，然后选择**实例类型查找器**按钮。

1. 在**获取有关实例类型选择的建议**屏幕中，执行以下操作：

   1. 通过选择**工作负载类型**、**使用案例**、**优先级**和 **CPU 制造商**选项来指定您的实例类型要求。

   1. （可选）要为您的工作负载指定更详细的要求，请执行以下操作：

      1. 展开**高级参数**。

      1. 要添加参数，请选择一个参数，选择**添加**，然后为该参数指定一个值。对每个想要添加的附加参数重复上述操作。要表示没有最小值或最大值，请将该字段留空。

      1. 要在添加参数后将其删除，请选择该参数旁边的 **X**。

   1. 选择**获取实例类型建议**。

      Amazon EC2 为您提供符合您指定要求的实例系列的建议。

1. 要查看建议的实例系列中每种实例类型的详细信息，请选择**查看推荐的实例系列详细信息**。

1. 选择符合您要求的实例类型，然后选择**操作**、**启动实例**或**操作**、**创建启动模板**。

   或者，如果您在启动实例向导或启动模板页面中启动了该流程，并且希望返回到原来的流程，则请记下您要使用的实例类型。然后，在启动实例向导或启动模板中，为**实例类型**选择该实例类型，然后完成启动实例或创建启动模板的过程。

### 观看动画：使用 EC2 实例类型查找器获取实例类型建议
<a name="use-ec2-instance-type-finder-animation"></a>

![使用实例类型查找器获取实例类型建议。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/use-ec2-instance-type-finder-animation.gif)

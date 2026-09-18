

# 使用控制台中的启动实例向导来启动 EC2 实例
<a name="ec2-launch-instance-wizard"></a>

您可以使用 Amazon EC2 控制台中的启动实例向导启动 Amazon EC2 实例。该向导提供了启动参数的默认值，您可以接受这些值，也可以修改这些值以满足您的要求。唯一未指定的参数是密钥对。如果您选择接受默认值，则可以通过仅选择密钥对来快速启动实例。

**重要**  
实例处于 `running` 状态时，即使其一直处于空闲状态，您也需为其付费。但是，如果您符合免费套餐的资格，则可能不会产生任何费用。有关更多信息，请参阅[跟踪 Amazon EC2 免费套餐使用情况](ec2-free-tier-usage.md)。

有关启动实例向导中每个参数的说明，请参阅[Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

**Topics**
+ [快速启动实例](#liw-quickly-launch-instance)
+ [使用定义的参数启动实例](#liw-launch-instance-with-defined-parameters)

## 快速启动实例
<a name="liw-quickly-launch-instance"></a>

如需快速设置实例以进行测试，请按照以下步骤。您需要选择操作系统和密钥对，然后接受默认值。除了密钥对外，启动实例向导还会为所有参数提供默认值。您可以接受任何或全部默认值，也可以通过为每个参数指定自己的值来配置实例。

有关启动实例向导中每个参数的说明，请参阅[Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

**使用启动实例向导快速启动实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在屏幕顶部的导航栏中，会显示当前 AWS 区域，例如，美国东部美国东部（俄亥俄州）。如果需要，选择要在其中启动实例的不同区域。

1. 从 Amazon EC2 控制台控制面板中，选择**启动实例**。

1. （可选）在 **Name and tags**（名称与标签）下，为 **Name**（名称）输入实例的描述性名称。

1. 在 **Application and OS Images（Amazon Machine Image）**（应用程序和操作系统镜像（亚马逊机器映像））下，选择 **Quick Start**（快速启动），然后为您的实例选择操作系统（OS）。

1. （可选）在 **Key pair (login)**（密钥对（登录））下，为 **Key pair name**（密钥对名称）选择一个现有密钥对或新建一个密钥对。

1. 在 **Summary**（摘要）面板中，选择 **Launch instance**（启动实例）。

## 使用定义的参数启动实例
<a name="liw-launch-instance-with-defined-parameters"></a>

如果您要启动将在生产中使用的实例，则需要配置该实例以满足您的要求。有关启动实例向导中每个参数的说明，请参阅[Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

**使用启动实例向导通过定义所有启动参数来启动实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在屏幕顶部的导航栏中，会显示当前 AWS 区域，例如，美国东部美国东部（俄亥俄州）。如果需要，选择要在其中启动实例的不同区域。

1. 从 Amazon EC2 控制台控制面板中，选择**启动实例**。

1. （可选）在**名称和标签**下的**名称**中，输入实例的描述性名称，以便您可以轻松地对其进行跟踪。

   实例名称是一个标签，其中密钥为**名称**，而值为您指定的名称。

1. 在**应用程序和操作系统镜像（亚马逊机器映像）**下，为您的实例选择操作系统（OS），然后选择 AMI。

   AMI 是一个模板，其中包含启动实例所需的操作系统和软件。

1. 在 **Instance type**（实例类型）下，选择一个实例类型。

   实例类型决定了用于实例的硬件配置（CPU、内存、存储和网络容量）和主机大小。

   如果不确定要选择哪种实例类型，则可以执行以下操作：
   + 选择**比较实例类型**，通过以下属性比较不同的实例类型：vCPU 数、架构、内存量（GiB）、存储量（GB）、存储类型和网络性能。
   + 选择**获取建议**，从 EC2 实例类型查找器中获取实例类型的指导和建议。有关更多信息，请参阅 [从 EC2 实例类型查找器获取建议](get-ec2-instance-type-recommendations.md)。
**注意**  
根据您创建账户的时间，您可能可以在免费套餐下免费使用实例类型。这些实例类型标记为**符合免费套餐资格**。  
如果您在 2025 年 7 月 15 日之前创建 AWS 账户且其使用时间未满 12 个月，您可以通过选择 **t2.micro** 实例类型（或在 **t2.micro** 不可用的区域中选择 **t3.micro** 实例类型）来使用免费套餐下的 Amazon EC2。请注意，在启动 **t3.micro** 实例时，默认会启用[**无限**模式](burstable-performance-instances-unlimited-mode.md)，该模式可能会根据 CPU 使用情况产生额外费用。  
如果您是在 2025 年 7 月 15 日当天或之后创建的 AWS 账户，则可以使用 **t3.micro**、**t3.small**、**t4g.micro**、**t4g.small**、**c7i-flex.large** 和 **m7i-flex.large** 实例类型 6 个月，或直到您的服务抵扣金用完为止。  
有关更多信息，请参阅 [2025 年 7 月 15 日之前和之后的免费套餐权益](ec2-free-tier-usage.md#ec2-free-tier-comparison)。

1. （可选）在**密钥对（登录）**下，为**密钥对名称**选择一个现有密钥对或新建一个密钥对。如果您不需要密钥对即可连接到实例，则可以选择**在没有密钥对的情况下继续（不推荐）**。

1. 在**网络设置**下，如果您要启动测试实例，则可以保留默认设置。如果您要启动生产实例，则最佳实践是使用您定义的网络设置和安全组来控制进出实例的流量。

1. 在**配置存储**下，您可以保留默认值或指定其他存储。您选择的 AMI 包含一个或多个存储卷，包括根卷。您可以指定要附加到实例的其它卷。

   您可以使用 **Simple**（简单）或 **Advanced**（高级）视图。借助 **Simple**（简单）视图，您可以指定卷的大小和类型。若要指定所有卷参数，请选择位于卡片的右上角的 **Advanced**（高级）视图。

1. 对于**高级详细信息**，请展开该部分以查看字段并为实例指定任何其他参数。

1. 在**摘要**面板中，您可以执行以下操作：

   1. 指定要启动的实例数量。

   1. 查看实例配置，选择某部分的链接以直接导航到该部分。

   1. 当您准备好启动您的实例时，请选择 **Launch instance**（启动实例）。

   如果实例无法启动或状态立即转至 `terminated` 而非 `running`，请参阅 [排查 Amazon EC2 实例启动问题](troubleshooting-launch.md)。

1. （可选）您可以为实例创建账单提醒。在确认屏幕上的 **Next Steps**（下一步）下选择 **Create billing alerts**（创建账单提醒）并按照指示操作。还可以在启动实例后创建账单提醒。有关更多信息，请参阅 *Amazon CloudWatch 用户指南*中的[创建账单告警以监控预估 AWS 费用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)。
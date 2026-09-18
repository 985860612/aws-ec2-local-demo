

# AWS Outposts 上的置放群组
<a name="placement-groups-outpost"></a>

AWS Outposts 是一项完全托管的服务，可将 AWS 基础设施、服务、API 和工具扩展到客户场所。通过提供对 AWS 托管基础设施的本地访问，AWS Outposts 使客户能够使用与 AWS 区域中相同的编程接口在本地构建和运行应用程序，同时使用本地计算和存储资源来满足更低的延迟和本地数据处理需求。

Outpost 是部署在客户站点的 AWS 计算和存储容量池。AWS 作为 AWS 区域的一部分运营、监控和管理此容量。

您可以在您在账户中创建的 Outpost 上创建置放群组。从而将实例分布在您站点中的 Outpost 上的底层硬件上。在 Outpost 上创建和使用置放群组的方式与您在常规可用区中创建和使用置放群组时相同。当您在 Outpost 上创建具有分布策略的置放群组时，您可以选择让置放群组跨主机或机架分布实例。跨主机分布实例允许您使用具有单个机架 Outpost 的分布策略。

**注意事项**：
+ 机架级别的分布置放群组可以容纳与 Outpost 部署中机架数量一样多的实例。
+ 主机级别的分布置放群组可以容纳与 Outpost 部署中的主机数量一样多的实例。

**先决条件**  
您的站点必须安装一个 Outpost。有关更多信息，请参阅 *AWS Outposts 用户指南*中的[创建 Outpost 并订购 Outpost 容量](https://docs.aws.amazon.com/outposts/latest/userguide/order-outpost-capacity.html)。

**在 Outpost 上使用置放群组**

1. 在 Outpost 上创建子网。有关更多信息，请参阅 *AWS Outposts 用户指南*中的[创建子网](https://docs.aws.amazon.com/outposts/latest/userguide/launch-instance.html#create-subnet)。

1. 在与该 Outpost 关联的区域中创建一个置放群组。如果您创建具有分布策略的置放群组，则可以选择主机或机架分布级别，以确定该群组如何在 Outpost 上的底层硬件之间分布实例。有关更多信息，请参阅 [为 EC2 实例创建置放群组](create-placement-group.md)。

1. 将一个实例启动到置放群组。对于 **Subnet**（子网），选择您在第 1 步中创建的子网，然后对于 **Placement group name**（置放群组名称），选择您在第 2 步中创建的置放群组。有关更多信息，请参阅 *AWS Outposts 用户指南*中的[在 Outpost 中启动实例](https://docs.aws.amazon.com/outposts/latest/userguide/launch-instance.html#launch-instances)。
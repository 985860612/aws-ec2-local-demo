

# AWS Outposts 上的容量预留
<a name="capacity-reservations-outposts"></a>

AWS Outposts 是一项完全托管的服务，可将 AWS 基础设施、服务、API 和工具扩展到客户场所。通过提供对 AWS 托管基础设施的本地访问，AWS Outposts 使客户能够使用与 AWS 区域中相同的编程接口在本地构建和运行应用程序，同时使用本地计算和存储资源来满足更低的延迟和本地数据处理需求。

Outpost 是部署在客户站点的 AWS 计算和存储容量池。AWS 作为 AWS 区域的一部分运营、监控和管理此容量。

您可以对您在账户中创建的 Outpost 创建容量预留。这样，您就可以在站点的 Outpost 上预留计算容量。您可以按照在常规可用区中创建和使用容量预留的方法，在 Outpost 中创建和使用容量预留。相同的功能和实例匹配行为适用。

您可以使用 AWS Resource Access Manager 与您组织内的AWS账户共享 Outpost 上的容量预留。有关共享预留容量的更多信息，请参阅[共享容量预留](capacity-reservation-sharing.md)。

**先决条件**  
您的站点必须安装一个 Outpost。有关更多信息，请参阅 *AWS Outposts 用户指南*中的[创建 Outpost 并订购 Outpost 容量](https://docs.aws.amazon.com/outposts/latest/userguide/order-outpost-capacity.html)。

**注意事项**：
+ 您不能使用 Outpost 上的容量预留组。

**使用 Outpost 上的容量预留组**

1. 在 Outpost 上创建子网。有关更多信息，请参阅 *AWS Outposts 用户指南*中的[创建子网](https://docs.aws.amazon.com/outposts/latest/userguide/launch-instance.html#create-subnet)。

1. 在 Outpost 上创建容量预留。

   1. 打开 AWS Outposts 控制台 ([https://console.aws.amazon.com/outposts/](https://console.aws.amazon.com/outposts/home))。

   1. 在导航窗格中，选择 **Outpost**，然后选择 **Actions (操作)**、**Create Capacity Reservation (创建容量预留)**。

   1. 根据需要配置容量预留，然后选择 **Create (创建)**。有关更多信息，请参阅[创建 容量预留](capacity-reservations-create.md)。
**注意**  
**Instance Type (实例类型)** 下拉菜单仅列出所选 Outpost 支持的实例类型，**Availability Zone (可用区)** 下拉菜单仅列出与所选 Outpost 相关的可用区。

1. 在现有容量预留中启动实例 对于 **Subnet (子网)**，选择您在步骤 1 中创建的子网，对于 **Capacity Reservation (容量预留)**，选择您在步骤 2 中创建的容量预留。有关更多信息，请参阅 *AWS Outposts 用户指南*中的[在 Outpost 中启动实例](https://docs.aws.amazon.com/outposts/latest/userguide/launch-instance.html#launch-instances)。


# AWS Outposts 上的 Amazon EC2 专属主机
<a name="dh-outposts"></a>

AWS Outposts 是一项完全托管的服务，可将 AWS 基础设施、服务、API 和工具扩展到您的场所。通过提供对 AWS 托管基础设施的本地访问，AWS Outposts 使您能够使用与 AWS 区域中相同的编程接口在本地构建和运行应用程序，同时使用本地计算和存储资源来满足更低的延迟和本地数据处理需求。

Outpost 是部署在客户站点的 AWS 计算和存储容量池。AWS 作为 AWS 区域的一部分运营、监控和管理此容量。

您可以在账户中拥有的 Outposts 站上分配专属主机。这使您可以更轻松地将需要专用物理服务器的现有软件许可证和工作负载构建到 AWS Outposts。您还可以将 Outpost 上的特定硬件资产作为目标，以帮助最大限度地减少工作负载之间的延迟。

专属主机允许您在 Amazon EC2 上使用符合条件的软件许可证，以便您获得使用自己的许可证的灵活性和成本效益。绑定到虚拟机、套接字或物理内核的其他软件许可证也可以在专属主机上使用，但须遵守其许可条款。尽管 Outposts 一直是单租户环境，符合 BYOL 工作负载的条件，但专属主机允许您将所需的许可证限制为单个主机，而不是整个 Outpost 部署。

此外，在 Outpost 上使用专属主机可以提高实例类型部署的灵活性，并更精细地控制实例放置。您可以针对特定主机进行实例启动，并使用主机关联来确保实例始终在该主机上运行，也可以使用自动放置在具有匹配配置和可用容量的任何可用主机上启动实例。

**Contents**
+ [先决条件](#dh-outpost-prereqs)
+ [支持的功能](#dh-outpost-features)
+ [注意事项](#dh-outpost-considerations)
+ [在 AWS Outposts 上分配 Amazon EC2 专属主机](dh-outpost-allocate.md)

## 先决条件
<a name="dh-outpost-prereqs"></a>

您的站点必须安装一个 Outpost。有关更多信息，请参阅 *AWS Outposts 用户指南*中的[创建 Outpost 并订购 Outpost 容量](https://docs.aws.amazon.com/outposts/latest/userguide/order-outpost-capacity.html)。

## 支持的功能
<a name="dh-outpost-features"></a>
+ 支持以下实例系列：
  + **通用型：**M5 \| M5d \| M7i \| M8i
  + **计算优化型：**C5 \| C5d \| C7i \| C8i
  + **内存优化型：**R5 \| R5d \| R7i \| R8i
  + **存储优化型：**I3en
  + **加速型计算：**G4dn
+ Outposts 上的专属主机可以配置为支持多种实例大小。以下实例系列支持多个实例大小：
  + **通用型：**M5 \| M5d \| M7i
  + **计算优化型：**C5 \| C5d \| C7i
  + **内存优化型：**R5 \| R5d \| R7i

  有关更多信息，请参阅 [Amazon EC2 专属主机实例容量配置](dedicated-hosts-limits.md)。
+ Outposts 上的专属主机支持自动放置和目标实例启动。有关更多信息，请参阅 [Amazon EC2 专属主机自动置放和主机关联](dedicated-hosts-understanding.md)。
+ Outposts 上的专属主机支持主机关联。有关更多信息，请参阅 [Amazon EC2 专属主机自动置放和主机关联](dedicated-hosts-understanding.md)。
+ Outposts 上的专属主机支持与 AWS RAM 共享。有关更多信息，请参阅 [跨账户 Amazon EC2 专属主机共享](dh-sharing.md)。

## 注意事项
<a name="dh-outpost-considerations"></a>
+ Outposts 上不支持专属主机预留。
+ Outposts 上不支持主机资源组和 AWS License Manager。
+ Outposts 上的专属主机不支持可突增的 T3 实例。
+ Outposts 上的专属主机不支持主机恢复。
+ 在 Outposts 上具有专属主机租赁的实例不支持简化的自动恢复操作。
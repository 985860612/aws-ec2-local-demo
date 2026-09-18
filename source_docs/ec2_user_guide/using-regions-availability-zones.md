

# 区域和可用区
<a name="using-regions-availability-zones"></a>

Amazon EC2 托管在全球多个位置。这些位置由 AWS 区域、可用区、Local Zones、AWS Outposts 和 Wavelength Zones 组成。
+ **区域**是独立的地理区域。
+ **可用区**是每个区域内的多个相互隔离的位置。
+ **Local Zones** 让您可以在多个距离最终用户较近的位置放置资源（如计算和存储）。
+ **Wavelength Zones** 让您能够为 5G 设备和最终用户打造具有超低延迟的应用程序。Wavelength 可以将标准 AWS 计算和存储服务部署到电信运营商的 5G 网络边缘。
+ **AWS Outposts** 让您能够几乎在任何数据中心、主机托管空间或本地设施使用原生的 AWS 服务、基础设施和运营模式。

AWS运行着具有高可用性的先进数据中心。数据中心有时会发生影响托管于同一位置的所有实例的可用性的故障，虽然这种故障极少发生。如果您将所有实例都托管在受故障影响的同一个位置，则您的所有实例都将不可用。

如需更多信息，请参阅 [AWS 全球基础设施](https://aws.amazon.com/about-aws/global-infrastructure/)。

**Topics**
+ [Regions](#concepts-regions)
+ [可用区](#concepts-availability-zones)
+ [Local Zones](#concepts-local-zones)
+ [Wavelength 区域](#concepts-wavelength-zones)
+ [AWS Outposts](#concepts-outposts)

## Regions
<a name="concepts-regions"></a>

从设计而言，每个 区域都与其他 区域隔离。这可实现最大程度的容错能力和稳定性。

当您启动实例时，请选择能让您的实例更靠近特定客户的区域，或选择能够满足法律或其他要求的区域。您可以在多个区域中启动实例。

当您查看资源时，只会看到与您指定的 区域关联的资源。这是因为 区域间彼此隔离，而且我们不会自动跨 区域复制资源。

### 可用区
<a name="concepts-available-regions"></a>

有关可用区域的列表，请参阅 [AWS 区域](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html)。

### Amazon EC2 区域性端点
<a name="using-regions-endpoints"></a>

当您通过命令行界面或 API 操作使用实例时，必须指定其区域端点。有关 Amazon EC2 区域和端点的更多信息，请参阅《Amazon EC2 Developer Guide》**中的 [Amazon EC2 service endpoints](https://docs.aws.amazon.com/ec2/latest/devguide/ec2-endpoints.html)。

有关更多信息，请参阅*《AWS 区域 和可用区用户指南》* 中的 [AWS 区域](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html)。

## 可用区
<a name="concepts-availability-zones"></a>

每个区域都有多个相互隔离的位置，称为*可用区*。可用区的代码由其区域代码后跟一个字母标识符组成。例如 `us-east-1a`。

通过在多个可用区启动 EC2 实例，可以确保应用程序不受区域中单一位置故障的影响。

下图说明 AWS 区域中的多个可用区。可用区 A 和可用区 B 各有一个子网，每个子网均有 EC2 实例。可用区 C 没有子网，因此您无法在此可用区内启动实例。

![在某个可用区中具有实例的区域。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/region-with-azs.png)


有关更多信息，请参阅 [适用于您的 EC2 实例的虚拟私有云](using-vpc.md)。

### 各区域的可用区
<a name="available-availability-zones"></a>

有关各区域的可用区列表，请参阅 [AWS 可用区](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)。

### 可用区中的实例
<a name="using-regions-availability-zones-launching"></a>

启动实例时，您需要选择区域和虚拟私有云（VPC）。然后，您可以选择其中一个可用区内的子网，也可以让我们为您选择子网。启动初始实例时，建议让我们根据系统运行状况和可用容量为您选择可用区。如果要启动其他实例，请仅在新实例必须靠近现有实例或必须与现有实例相隔离时指定可用区。

如果实例跨多个可用区分布且其中的某个实例发生故障，则应用程序的设计应确保可以使用另一可用区中的实例可代为处理相关请求。

有关更多信息，请参阅*《AWS 区域 用户指南》*中的 [AWS 可用区](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)。

## Local Zones
<a name="concepts-local-zones"></a>

本地区域是在地理上靠近您的用户的 AWS 区域的扩展。Local Zones 有自己的互联网连接并支持 Direct Connect，以便在本地区域中创建的资源可以通过低延迟通信为本地用户提供服务。有关更多信息，请参阅《AWS Local Zones 用户指南》中的 [What is AWS Local Zones?](https://docs.aws.amazon.com/local-zones/latest/ug/what-is-aws-local-zones.html)。**

本地区域的代码由其区域代码后跟一个指示其实际位置的标识符组成。例如，在洛杉矶的 `us-west-2-lax-1`。

下图说明了 AWS 区域 `us-west-2`、其两个可用区及其两个本地区域。VPC 跨多个可用区和其中一个本地区域。VPC 中的每个区域都有一个子网，每个子网都有一个实例。

![具有可用区和本地区域的 VPC。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/region-with-lzs.png)


### 可用 Local Zones
<a name="available-local-zones"></a>

有关可用本地区的列表，请参阅《AWS Local Zones User Guide》**中的 [Available Local Zones](https://docs.aws.amazon.com/local-zones/latest/ug/available-local-zones.html)。有关已公布的本地区列表，请参阅[AWS Local Zones 站点](https://aws.amazon.com/about-aws/global-infrastructure/localzones/locations/)。

### 本地区中的实例
<a name="local-zones-launching"></a>

要使用 Local Zones，您必须先启用它。然后，在本地区中创建子网。您可以在启动实例时指定本地区子网，这会将其置于本地区的本地区子网中。

启动本地区中的实例时，您还可从网络边界组分配 IP 地址。网络边界组是一组唯一的可用区、Local Zones 或 Wavelength 区域（AWS 可从中公告 IP 地址，例如 `us-west-2-lax-1a`）。您可以从网络边界组分配以下 IP 地址：
+ Amazon 提供的弹性 IPv4 地址
+ Amazon 提供的 IPv6 VPC 地址（仅在洛杉矶区域可用）

有关如何在 Local Zone 中启动实例的更多信息，请参阅**《AWS Local Zone 用户指南》中的 [AWS Local Zone 入门](https://docs.aws.amazon.com/local-zones/latest/ug/getting-started.html)。

## Wavelength 区域
<a name="concepts-wavelength-zones"></a>

AWS Wavelength利用 ，开发人员可以为移动设备和最终用户打造具有超低延迟的应用程序。Wavelength 可以将标准 AWS 计算和存储服务部署到电信运营商的 5G 网络边缘。开发人员可以将 Virtual Private Cloud（VPC）扩展到一个或多个 Wavelength 区域，然后使用 Amazon EC2 实例等 AWS 资源来运行需要超低延迟并连接到区域中的 AWS 服务的应用程序。

Wavelength 区域是在其中部署 Wavelength 基础设施的运营商位置中的隔离区域。Wavelength 区域与一个区域相关联。Wavelength 区域是区域的逻辑扩展，由区域中的控制平面管理。

Wavelength 区域的代码由其区域代码后跟一个指示实际位置的标识符组成。例如，在波士顿的 `us-east-1-wl1-bos-wlz-1`。

下图说明了 AWS 区域 `us-west-2`、其两个可用区及 Wavelength 区域。VPC 跨多个可用区和 Wavelength 区域。VPC 中的每个区域都有一个子网，每个子网都有一个实例。

![具有可用区和 Wavelength 区域的 VPC。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/region-with-wavelength-zones.png)


Wavelength 区域并非在每个区域中都可用。有关支持 Wavelength 区域的区域的信息，请参阅 *AWS Wavelength 开发人员指南*中的[可用 Wavelength 区域](https://docs.aws.amazon.com/wavelength/latest/developerguide/wavelength-quotas.html#concepts-available-zones)。

### 可用的 Wavelength 区
<a name="available-wavelength-zones"></a>

有关可用 Wavelength 区的列表，请参阅《AWS Wavelength Guide》**中的 [Available Wavelength Zones](https://docs.aws.amazon.com/wavelength/latest/developerguide/available-wavelength-zones.html)。

### Wavelength 区中的实例
<a name="wavelength-zones-launching"></a>

要使用 Wavelength 区域，您必须首先选择加入此区域。然后，在 Wavelength 区中创建子网。您可以在启动实例时指定 Wavelength 子网。您还可以从网络边界组分配运营商 IP 地址，该组是一组唯一的可用区、Local Zones 或 Wavelength 区域（AWS 可从中公告 IP 地址，例如 `us-east-1-wl1-bos-wlz-1`）。

有关如何在 Wavelength 区中启动实例的信息，请参阅《AWS Wavelength Guide》**中的 [Get started with AWS Wavelength](https://docs.aws.amazon.com/wavelength/latest/developerguide/get-started-wavelength.html)。

## AWS Outposts
<a name="concepts-outposts"></a>

AWS Outposts 是一项完全托管的服务，可将 AWS 基础设施、服务、API 和工具扩展到客户场所。通过提供对 AWS 托管基础设施的本地访问，AWS Outposts 使客户能够使用与 AWS 区域中相同的编程接口在本地构建和运行应用程序，同时使用本地计算和存储资源来满足更低的延迟和本地数据处理需求。

Outpost 是部署在客户站点的 AWS 计算和存储容量池。AWS 作为 AWS 区域的一部分运营、监控和管理此容量。您可以在 Outpost 上创建子网，并在创建 AWS 资源时指定这些子网。Outpost 子网中的实例使用私有 IP 地址与 AWS 区域中的其他实例通信，全部都在相同 VPC 内进行。

下图说明了 AWS 区域 `us-west-2`、其两个可用区及 Outpost。VPC 跨多个可用区和 Outpost。Outpost 位于本地部署的客户数据中心。VPC 中的每个区域都有一个子网，每个子网都有一个实例。

![具有可用区和 Outpost 的 VPC。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/region-with-outpost.png)


### Outpost 上的实例
<a name="outposts-instances"></a>

要开始使用 AWS Outposts，必须创建一个 Outpost 并订购 Outpost 容量。AWS Outposts 提供两种外形规格：Outposts 机架和 Outposts 服务器。有关 Outposts 配置的更多信息，请参阅 [AWS Outposts 系列](https://aws.amazon.com/outposts/)。安装 Outpost 设备后，当您在 Outpost 上启动 EC2 实例时，就可以使用计算和存储容量。

要启动 EC2 实例，您必须创建 Outpost 子网。安全组控制 Outpost 子网中实例的入站和出站流量，就像控制可用区子网中的实例一样。要使用 SSH 连接到 Outpost 子网中的实例，请像为可用区子网中的实例指定密钥对一样，在启动实例时指定密钥对。

有关更多信息，请参阅 [Get started with Outposts racks](https://docs.aws.amazon.com/outposts/latest/userguide/get-started-outposts.html) 或 [Get started with Outposts servers](https://docs.aws.amazon.com/outposts/latest/server-userguide/get-started-outposts.html)。

### Outposts 机架上的卷
<a name="outposts-rack-volumes"></a>

如果 Outposts 容量位于 Outposts 机架上，则可在创建的 Outpost 子网中创建 EBS 卷。创建卷时，请指定 Outpost 的 Amazon Resource Name (ARN)。

以下 [create-volume](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-volume.html) 命令在指定的 Outpost 上创建一个空的 50 GB 卷。

```
aws ec2 create-volume --availability-zone {{us-east-2a}} --outpost-arn arn:aws:outposts:{{us-east-2}}:{{123456789012}}:outpost/{{op-03e6fecad652a6138}} --size {{50}}
```

您可以在不分离卷的情况下动态修改 Amazon EBS gp2 卷的大小。有关在不分离卷的情况下修改卷的更多信息，请参阅《Amazon EBS User Guide》**中 [Request modifications to your EBS volumes](https://docs.aws.amazon.com/ebs/latest/userguide/requesting-ebs-volume-modifications.html)。

建议您将 Outpost 机架上实例的根卷大小限制在 30GiB 或以下。您可以在 AMI 或实例的块设备映射中指定数据卷以提供额外存储。要从引导卷中裁剪未使用的块，请参阅 AWS Partner Network Blog** 中的 [How to Build Sparse EBS Volumes](https://aws.amazon.com/blogs/apn/how-to-build-sparse-ebs-volumes-for-fun-and-easy-snapshotting/)。

我们建议您增加根卷的 NVMe 超时。有关更多信息，请参阅《Amazon EBS User Guide》**中的 [I/O operation timeout](https://docs.aws.amazon.com/ebs/latest/userguide/nvme-ebs-volumes.html#timeout-nvme-ebs-volumes)。

### Outposts 服务器上的卷
<a name="outposts-server-volumes"></a>

Outposts 服务器上的实例提供实例存储卷，但不支持 EBS 卷。选择只有单个 EBS 快照的 Amazon EBS-backed AMI。选择具有足够实例存储空间的实例大小来满足应用程序需求。有关更多信息，请参阅 [实例存储卷限制](instance-store-volumes.md)。
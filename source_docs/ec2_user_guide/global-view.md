

# 使用 AWS 全局视图查看跨区域的资源
<a name="global-view"></a>

通过 AWS 全局视图，您可以在单个控制台中跨单个 AWS 区域或跨多个区域查看资源。AWS全局视图还提供*全局搜索*功能，让您能同时搜索多个区域中的特定资源或特定资源类型。

AWS 全局视图不允许您以任何方式修改资源。

**支持的资源**  
使用 AWS 全局视图，您可以查看已启用 AWS 账户 的所有区域中以下资源的全局摘要。
+ 自动扩缩组
+ 可用区
+ 容量预留和容量块
+ 数据库集群
+ 数据库实例数
+ DHCP 选项集
+ Amazon Elastic Container Service（Amazon ECS）集群
+ ECS 服务
+ ECS 任务
+ 仅出口互联网网关
+ 弹性 IP
+ 端点服务
+ 实例
+ 互联网网关
+ 托管前缀列表
+ NAT 网关
+ 网络 ACL
+ 网络接口
+ Outposts
+ 路由表
+ S3 存储桶
+ 安全组
+ 子网
+ 卷
+ VPC
+ VPC 端点
+ VPC 对等连接

**所需的权限**  
用户必须具有以下权限才能使用 AWS 全局视图。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
  {
    "Effect": "Allow",
    "Action": [
      "autoscaling:DescribeAutoScalingGroups",
      "ec2:DescribeRegions",
      "ec2:DescribeCapacityReservations",
      "ec2:DescribeDhcpOptions",
      "ec2:DescribeEgressOnlyInternetGateways",
      "ec2:DescribeAddresses",
      "ec2:DescribeVpcEndpointServices",
      "ec2:DescribeInstances",
      "ec2:DescribeInternetGateways",
      "ec2:DescribePrefixLists",
      "ec2:DescribeNatGateways",
      "ec2:DescribeNetworkAcls",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DescribeRouteTables",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeSubnets",
      "ec2:DescribeVolumes",
      "ec2:DescribeVpcs",
      "ec2:DescribeVpcEndpoints",
      "ec2:DescribeVpcPeeringConnections",
      "ec2:DescribeAvailabilityZones",
      "ec2:DescribeVpcEndpointServiceConfigurations",
      "ec2:DescribeManagedPrefixLists",
      "ecs:ListClusters",
      "ecs:DescribeServices",
      "ecs:ListTasks",
      "outposts:ListOutposts",
      "rds:DescribeDBInstances",
      "rds:DescribeDBClusters",
      "s3:ListAllMyBuckets"
  ],
  "Resource": "*"
  }]
}
```

------

**使用 AWS 全局视图**  
登录 [AWS 全局视图控制台](https://console.aws.amazon.com/ec2globalview/home#RegionsAndZones)。

**重要**  
您不能在 Firefox 中使用私密窗口来访问 AWS 全局视图。

控制台由以下各项组成：
+ **区域资源管理器**：此页面包括以下各节：
  + **摘要** – 提供您在所有区域中的资源的简要概述。

    展开**显示所有资源摘要**以表示已启用 AWS 账户的区域数。剩余字段表示您当前在这些区域中拥有的资源数量。选择任何链接以查看所有区域该类型的资源。例如，如果 **Instances**（实例）标签以下的链接是 **29 in 10 Regions**（10 个区域中的 29 个），它表示您当前在 `10` 个区域有 `29` 个实例。选择该链接以查看所有 29 个实例的列表。
  + **区域资源管理器**：列出所有 AWS 区域（包括没有为其启用账户的那些区域），并提供每个区域的每种资源类型的总计。

    选择区域名称，以查看该特定区域所有类型的所有资源。例如，选择 **Africa (Cape Town) af-south-1**（非洲（开普敦）af-south-1）可查看该区域中的所有 VPC、子网、实例、安全组、卷和自动扩缩组。或者，选择一个区域，然后选择 **View resources for selected Region**（查看所选区域的资源）。

    选择特定区域中特定资源类型的值，以便仅查看该区域中该类型的资源。例如，选择 **Africa (Cape Town) af-south-1**（非洲（开普敦）af-south-1）实例的值，以仅查看该区域中的实例。
+ **全局搜索** – 在此页面上，您可以跨单个区域或跨多个区域搜索特定资源或特定资源类型。它还使您能够查看特定资源的详细信息。

  要搜索资源，请在网格前面的字段中输入搜索条件。您可以按区域、按资源类型以及按分配给资源的标签进行搜索。

  要查看特定资源的详细信息，请在网格中选中。您也可以选择资源的资源 ID，以在各自的控制台中打开该资源。例如，选择实例 ID 以在 Amazon EC2 控制台中打开实例，或选择子网 ID 以在 Amazon VPC 控制台中打开子网。
+ **区域和可用区** - 在此页面上，您可以查看和管理所有可用区域、可用区、本地区域和 Wavelength 区域。您可以使用**列表视图**/**地图视图**切换开关在**列表视图**和**地图视图**之间切换。您的视图偏好设置会在不同会话之间保留。
  + **地图视图**：在交互式世界地图上显示所有区域和可用区，按状态着色。要查看某个位置的详细信息，请指向它或选择它。选择要执行操作的位置：您可以启用区域、启用可用区或打开其详细信息页面。您还可以筛选地图以仅显示特定状态。地图和详细列表保持同步：在一个地图上选择一个位置，另一个地图上会高亮显示该位置。
  + **列表视图**：以表格形式显示区域和可用区。在**区域**选项卡中，可以查看所有 AWS 区域。**状态**列显示为您的 AWS 账户启用的区域。

  在此页面中，您可以选择一个区域来执行以下操作：
  + 查看区域的详细信息，例如区域代码、地理位置和每种区域的数量。

    您还可以查看可用区、本地区域和 Wavelength 区域的列表以及区域中的资源列表。
  + 启用或禁用区域。

  从每个区域选项卡中，您可以查看该区域类型的列表。在**本地区域**选项卡中，您可以选择加入某个本地区域。

**提示**  
如果您仅使用特定区域或资源类型，则可以自定义 AWS 全局视图，使其仅显示这些区域和资源类型。要自定义显示的区域和资源类型，请在导航面板中选择**设置**，然后在**资源**和**区域**选项卡上，选择不希望在 AWS 全局视图中显示的区域和资源类型。
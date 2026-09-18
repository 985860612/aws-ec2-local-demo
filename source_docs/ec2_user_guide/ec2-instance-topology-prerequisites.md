

# Amazon EC2 拓扑的先决条件
<a name="ec2-instance-topology-prerequisites"></a>

要描述您的 Amazon EC2 拓扑，请确保您的实例和容量预留满足以下先决条件。

**Topics**
+ [AWS 区域](#inst-net-topology-prereqs-regions)
+ [实例类型](#inst-net-topology-prereqs-instance-types)
+ [州](#inst-net-topology-prereqs-instance-state)
+ [IAM 权限](#ec2-instance-topology-iam-permissions)

## AWS 区域
<a name="inst-net-topology-prereqs-regions"></a>

支持 AWS 区域：
+ 美国东部（弗吉尼亚州北部）、美国东部（俄亥俄州）、美国西部（北加利福尼亚）、美国西部（俄勒冈州）
+ 非洲（开普敦）
+ 亚太地区（雅加达）、亚太地区（香港）、亚太地区（海得拉巴）、亚太地区（墨尔本）、亚太地区（孟买）、亚太地区（大阪）、亚太地区（首尔）、亚太地区（新加坡）、亚太地区（悉尼）、亚太地区（东京）
+ 加拿大（中部）
+ 欧洲地区（法兰克福）、欧洲地区（爱尔兰）、欧洲地区（伦敦）、欧洲地区（巴黎）、欧洲（西班牙）、欧洲地区（斯德哥尔摩）、欧洲（苏黎世）
+ 以色列（特拉维夫）
+ 中东（巴林）、中东（阿联酋）
+ 南美洲（圣保罗）
+ AWS GovCloud（美国西部）
+ AWS European Sovereign Cloud (Germany)

以色列（特拉维夫）和 AWS GovCloud（美国西部）不支持 DescribeCapacityReservationTopology API。

## 实例类型
<a name="inst-net-topology-prereqs-instance-types"></a>

支持的实例类型：
+ 响应中返回 **3\* 个网络节点** 
  + `g6e.xlarge` \| `g6e.2xlarge` \| `g6e.4xlarge` \| `g6e.8xlarge` \| `g6e.12xlarge` \| `g6e.16xlarge` \| `g6e.24xlarge` \| `g6e.48xlarge` \| `g7e.2xlarge` \| `g7e.4xlarge` \| `g7e.8xlarge` \| `g7e.12xlarge` \| `g7e.24xlarge` \| `g7e.48xlarge`
  + `hpc6a.48xlarge` \| `hpc6id.32xlarge` \| `hpc7g.4xlarge` \| `hpc7g.8xlarge` \| `hpc7g.16xlarge` \| `hpc7a.12xlarge` \| `hpc7a.24xlarge` \| `hpc7a.48xlarge` \| `hpc7a.96xlarge` \| `hpc8a.96xlarge`
  + `p3dn.24xlarge` \| `p4d.24xlarge` \| `p4de.24xlarge` \| `p5.48xlarge` \| `p5e.48xlarge` \| `p5en.48xlarge` \| `p6e-gb200.36xlarge`
  + `trn1.2xlarge` \| `trn1.32xlarge` \| `trn1n.32xlarge` \| `trn2.48xlarge` \| `trn2u.48xlarge`
+ 响应中返回 **4\* 个网络节点** 
  + `p6-b200.48xlarge` \| `p6-b300.48xlarge`

\* 返回的网络节点数量仅在使用 DescribeInstanceTopology API 时适用。对于 DescribeCapacityReservationTopology API，返回的网络节点数量将因容量预留的类型和状态而异。

可用的实例类型因区域而异。有关更多信息，请参阅 [Amazon EC2 instance types by Region](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-regions.html)。

## 州
<a name="inst-net-topology-prereqs-instance-state"></a>
+ 对于 `DescribeInstanceTopology` – 示例必须处于 `running` 状态。
+ 对于 `DescribeCapacityReservationTopology` – 容量预留必须处于 `pending` 或 `active` 状态。

您无法获取处于任何其他状态的实例或容量预留的拓扑信息。

## IAM 权限
<a name="ec2-instance-topology-iam-permissions"></a>

IAM 身份（用户、用户组或角色）需要以下权限：
+ `ec2:DescribeInstanceTopology`
+ `ec2:DescribeCapacityReservationTopology`


# 适用于您的 EC2 实例的虚拟私有云
<a name="using-vpc"></a>

通过 Amazon Virtual Private Cloud (Amazon VPC)，您可以在 AWS 云内您自己的逻辑隔离区域中定义虚拟网络，我们称之为 *Virtual Private Cloud* 或 *VPC*。您可将 AWS 资源（如 Amazon EC2 实例）创建到 VPC 的子网中。您的 VPC 与您在自己的数据中心中运行的传统网络可能极为相似，同时享有使用来自 AWS 的可扩展基础设施的优势。您可以配置您的 VPC；您可以选择它的 IP 地址范围、创建子网并配置路由表、网关和安全设置。现在您可以将您的 VPC 中的实例连接到 Internet 或您自己的数据中心。

**Topics**
+ [您的默认 VPC](#default-vpcs)
+ [非默认 VPC](#create-nondefault-vpcs)
+ [互联网访问](#access-internet-from-vpc)
+ [共享子网](#ec2-shared-VPC-subnets)
+ [仅限 IPv6 子网](#ec2-ipv6-only-subnets)

## 您的默认 VPC
<a name="default-vpcs"></a>

在您创建 AWS 账户时，我们会在每个区域中创建一个*默认 VPC*。默认 VPC 是已配置好可供您使用的 VPC。例如，在每个默认 VPC 中，每个可用区都有一个默认子网，一个连接到 VPC 的互联网网关，并且主路由表中有一条将所有流量 (0.0.0.0/0) 发送到互联网网关的路由。您可以按需修改默认 VPC 的配置。例如，您可以添加子网和路由表。

![我们在每个区域中创建默认 VPC，每个可用区都有默认子网。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/default-vpc.png)


## 非默认 VPC
<a name="create-nondefault-vpcs"></a>

您可以创建自己的 VPC，而不是为您的资源使用默认 VPC，如《Amazon VPC 用户指南》**的[创建 VPC](https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html) 中所述。

以下是为 EC2 实例创建 VPC 时要考虑的一些事项。
+ 您可以使用 IPv4 CIDR 块的默认建议，也可以输入应用程序或网络所需的 CIDR 块。
+ 为了确保高可用性，请在多个可用区中创建子网。
+ 如果必须可从互联网访问您的实例，请执行以下操作之一：
  + 如果您的实例可以位于公共子网中，则请添加公共子网。保持两个 DNS 选项都处于启用状态。您可以选择立即或稍后添加私有子网。
  + 如果您的实例必须位于私有子网中，则请仅添加私有子网。您可以添加 NAT 网关，为私有子网中的实例提供互联网访问。如果您的实例跨可用区发送或接收大量流量，则请在每个可用区创建一个 NAT 网关。否则，您可以仅在其中一个可用区中创建 NAT 网关，并在与 NAT 网关相同的可用区中启动发送或接收跨区域流量的实例。

## 互联网访问
<a name="access-internet-from-vpc"></a>

在默认 VPC 中的默认子网中启动的实例可以访问互联网，因为默认 VPC 配置为分配公有 IP 地址和 DNS 主机名，并且主路由表配置了通往连接到 VPC 的互联网网关的路由。

对于在非默认子网和 VPC 中启动的实例，可以使用以下选项之一，以确保在这些子网中启动的实例可以访问互联网：
+ 配置互联网网关。有关更多信息，请参阅《*Amazon VPC 用户指南*》中的[使用互联网网关连接到互联网](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)。
+ 配置公有 NAT 网关。有关更多信息，请参阅 *Amazon VPC 用户指南*中的[从私有子网访问互联网](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-scenarios.html#public-nat-internet-access)。

## 共享子网
<a name="ec2-shared-VPC-subnets"></a>

在共享 VPC 子网中启动 EC2 实例时，请注意以下几点：
+ 参与者可以通过指定共享子网 ID 在共享子网中运行实例。参与者必须拥有其指定的任何网络接口。
+ 参与者可以启动、停止、终止和描述其在共享子网中创建的实例。参与者无法启动、停止、终止或描述 VPC 所有者在共享子网中创建的实例。
+ VPC 所有者无法启动、停止、终止或描述参与者在共享子网中创建的实例。
+ 参与者可以使用 EC2 Instance Connect Endpoint 连接到共享子网中的实例。参与者必须在共享子网中创建 EC2 Instance Connect Endpoint。参与者不能使用 VPC 所有者在共享子网中创建的 EC2 Instance Connect Endpoint。

有关共享 Amazon EC2 资源的更多信息，请参阅以下资源：
+ [管理与组织或 OU 共享的 AMI](share-amis-org-ou-manage.md)
+ [共享容量预留](capacity-reservation-sharing.md)
+ [共享置放群组](share-placement-group.md)
+ [跨账户 Amazon EC2 专属主机共享](dh-sharing.md)

有关共享子网的更多信息，请参阅 *Amazon VPC 用户指南*中的[与其他账户共享 VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-sharing.html)。

## 仅限 IPv6 子网
<a name="ec2-ipv6-only-subnets"></a>

在仅使用 IPv6 的子网中启动的 EC2 实例将会获得 IPv6 地址，但不会获得 IPv4 地址。您在仅使用 IPv6 的子网中启动的任何实例，必须是[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。
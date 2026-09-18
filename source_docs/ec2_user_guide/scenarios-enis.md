

# 您的 Amazon EC2 实例的多个网络接口
<a name="scenarios-enis"></a>

当您需要以下功能时，将多个网络接口附加到一个实例很有帮助：
+ 一个[管理网络](#creating-a-management-network)。
+ [网络和安全设备](#use-network-and-security-appliances-in-your-vpc)。
+ 工作负载位于不同[子网](#creating-dual-homed-instances-with-workloads-roles-on-distinct-subnets)或 [VPC](#creating-dual-homed-instances-with-workloads-roles-on-distinct-subnets) 中的双主机实例。
+ 一个[低预算、高可用性](#create-a-low-budget-high-availability-solution)解决方案。

## 管理网络
<a name="creating-a-management-network"></a>

以下概述描述了使用多个网络接口创建的管理网络。

**标准**
+ 实例上的主网络接口（例如 eth0）处理公有流量。
+ 实例上的辅助网络接口（例如 eth1）处理后端管理流量。它连接到具有更严格的访问控制的单独子网，并作为主网络接口位于可用区内。

**设置**
+ 主网络接口（可能配置或未配置负载均衡器）具有允许从 Internet 访问服务器的关联的安全组。例如，允许来自 0.0.0.0/0 或来自负载均衡器的 TCP 端口 80 和 443。
+ 辅助网络接口具有一个关联的安全组，该安全组仅允许 SSH 访问，从以下位置之一启动：
  + 允许的 IP 地址范围，可以是 VPC 之内，也可以是来自互联网。
  + 与主网络接口位于同一可用区内的私有子网。
  + 虚拟私有网关。

**注意**  
为确保故障转移功能，可以考虑针对网络接口上的传入流量使用辅助私有 IPv4。在某个实例失效时，您可以将接口和/或辅助私有 IPv4 地址移动到备用实例中。

![创建管理网络。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/EC2_ENI_management_network.png)


## 网络和安全设备
<a name="use-network-and-security-appliances-in-your-vpc"></a>

负载均衡器、网络地址转换 (NAT) 服务器和代理服务器等网络和安全设备更偏向于配置多个网络接口。您可以创建并附加辅助网络接口至正在运行这些类型的应用程序的实例中，并用实例自己的公用和私有 IP 地址、安全组和源/目标检查设置其他接口。

## 工作负载位于不同子网中的双主机实例
<a name="creating-dual-homed-instances-with-workloads-roles-on-distinct-subnets"></a>

您可以将网络接口放置到每一个与承载应用程序服务器的中间层网络相连接的 Web 服务器。应用程序服务器也可以用双主机连接至承载数据库服务器的后端网络（子网）。每一个双主机实例都在前端接收和处理请求、启动与后端的连接，然后将请求发送至后端网络上的服务器，而不是通过双主机实例路由网络数据包。

## 工作负载位于同一账户下不同 VPC 中的双主机实例
<a name="creating-dual-homed-instances-with-workloads-roles-on-distinct-vpcs"></a>

您可以在一个 VPC 中启动 EC2 实例，并从其他 VPC 附加辅助 ENI，只要网络接口与实例位于同一可用区中即可。这使您能够在具有不同网络和安全配置的 VPC 之间创建多宿主实例。您不能在不同 AWS 账户中的 VPC 之间创建多宿主实例。

在以下使用案例中，您可以跨 VPC 使用双宿主实例：
+ **克服两个无法对等互连的 VPC 之间的 CIDR 重叠**：您可以利用 VPC 中的辅助 CIDR 并允许实例跨两个不重叠的 IP 范围进行通信。
+ **在单个账户中连接多个 VPC**：启用通常由 VPC 边界分隔的各个资源之间的通信。

## 低预算、高可用性解决方案
<a name="create-a-low-budget-high-availability-solution"></a>

如果您的一个提供特定功能的实例失效，则其网络接口可附加到一个针对同一角色预配置的替代或热备用实例，以快速恢复服务。例如，您可以将一个网络接口用作连接数据库实例或 NAT 实例等关键服务的主要或辅助网络接口。如果实例失效，您 (或更有可能是代表您运行的代码) 可以将网络接口附加到热备用实例。由于接口保持其私有 IP 地址、弹性 IP 地址和 MAC 地址，因此只要您将网络接口附加到替代实例，网络流量就会立即开始流向备用实例。在实例失效之后、网络接口附加到备用实例之前，用户会暂时失去连接，但不需要更改路由表或您的 DNS 服务器。


# 针对不同使用案例的安全组规则
<a name="security-group-rules-reference"></a>

您可以创建安全组，并添加可反映与安全组关联的实例角色的规则。例如，配置作为 Web 服务器的实例需要允许入站 HTTP 和 HTTPS 访问的安全组规则。同样，数据库实例需要允许数据库类型访问的规则，例如，对 MySQL 允许通过端口 3306 进行访问。

以下是您可以添加到允许特定类型访问的安全组的规则类型示例。

**Topics**
+ [Web 服务器规则](#sg-rules-web-server)
+ [数据库服务器规则](#sg-rules-db-server)
+ [用于从您的计算机连接到实例的规则](#sg-rules-local-access)
+ [用于在具有相同安全组的实例之间进行连接的规则](#sg-rules-other-instances)
+ [用于 ping/ICMP 的规则](#sg-rules-ping)
+ [DNS 服务器规则](#sg-rules-dns)
+ [Amazon EFS 规则](#sg-rules-efs)
+ [Elastic Load Balancing 规则](#sg-rules-elb)

有关说明，请参阅[创建安全组](creating-security-group.md)和[配置安全组规则](changing-security-group.md#add-remove-security-group-rules)。

## Web 服务器规则
<a name="sg-rules-web-server"></a>

以下入站规则允许来自任何 IP 地址的 HTTP 和 HTTPS 访问。如果您为 VPC 启用了 IPv6，则可添加规则以控制来自 IPv6 地址的入站 HTTP 和 HTTPS 流量。


| 协议类型 | 协议编号 | 端口 | 源 IP | 备注 | 
| --- | --- | --- | --- | --- | 
| TCP | 6 | 80 (HTTP) | 0.0.0.0/0 | 允许来自任何 IPv4 地址的入站 HTTP 访问。 | 
| TCP | 6 | 443 (HTTPS) | 0.0.0.0/0 | 允许来自任何 IPv4 地址的入站 HTTPS 访问 | 
| TCP | 6 | 80 (HTTP) | ::/0 | 允许来自任何 IPv6 地址的入站 HTTP 访问 | 
| TCP | 6 | 443 (HTTPS) | ::/0 | 允许来自任何 IPv6 地址的入站 HTTPS 访问 | 

## 数据库服务器规则
<a name="sg-rules-db-server"></a>

以下入站规则是您可以为数据库访问添加的规则示例，具体取决于您在实例运行的数据库类型。有关 Amazon RDS 实例的更多信息，请参阅 [Amazon RDS 用户指南](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/)。

对于源 IP，请指定以下其中一项：
+ 本地网络中的特定 IP 地址或 IP 地址范围（采用 CIDR 数据块表示法）
+ 访问数据库的一组实例的安全组 ID


| 协议类型 | 协议编号 | 端口 | 备注 | 
| --- | --- | --- | --- | 
| TCP | 6 | 1433 (MS SQL) | 访问 Microsoft SQL Server 数据库的默认端口，例如，在 Amazon RDS 实例上 | 
| TCP | 6 | 3306 (MYSQL/Aurora) | 访问 MySQL 或 Aurora 数据库的默认端口，例如，在 Amazon RDS 实例上 | 
| TCP | 6 | 5439 (Redshift) | 访问 Amazon Redshift 集群数据库的默认端口。 | 
| TCP | 6 | 5432 (PostgreSQL) | 访问 PostgreSQL 数据库的默认端口，例如，在 Amazon RDS 实例上 | 
| TCP | 6 | 1521 (Oracle) | 访问 Oracle 数据库的默认端口，例如，在 Amazon RDS 实例上 | 

您可以选择限制来自数据库服务器的出站流量。例如，您可能希望允许访问 Internet 进行软件更新，但限制所有其他类型的流量。您必须先删除允许所有出站流量的默认出站规则。


| 协议类型 | 协议编号 | 端口 | 目的地 IP | 备注 | 
| --- | --- | --- | --- | --- | 
| TCP | 6 | 80 (HTTP) | 0.0.0.0/0 | 允许对任何 IPv4 地址进行出站 HTTP 访问 | 
| TCP | 6 | 443 (HTTPS) | 0.0.0.0/0 | 允许对任何 IPv4 地址进行出站 HTTPS 访问 | 
| TCP | 6 | 80 (HTTP) | ::/0 | (仅限已启用 IPv6 的 VPC) 允许对任何 IPv6 地址进行出站 HTTP 访问 | 
| TCP | 6 | 443 (HTTPS) | ::/0 | (仅限已启用 IPv6 的 VPC) 允许对任何 IPv6 地址进行出站 HTTPS 访问 | 

## 用于从您的计算机连接到实例的规则
<a name="sg-rules-local-access"></a>

要连接到您的实例，您的安全组必须拥有允许 SSH 访问 (适用于 Linux 实例) 或 RDP 访问 (适用于 Windows 实例) 的入站规则。


| 协议类型 | 协议编号 | 端口 | 源 IP | 
| --- | --- | --- | --- | 
| TCP | 6 | 22 (SSH) | 您电脑的公有 IPv4 地址或您的本地网络中的 IP 地址范围。如果您为 VPC 启用了 IPv6，并且您的实例有一个 IPv6 地址，则可以输入一个 IPv6 地址或范围。 | 
| TCP | 6 | 3389 (RDP) | 您电脑的公有 IPv4 地址或您的本地网络中的 IP 地址范围。如果您为 VPC 启用了 IPv6，并且您的实例有一个 IPv6 地址，则可以输入一个 IPv6 地址或范围。 | 

## 用于在具有相同安全组的实例之间进行连接的规则
<a name="sg-rules-other-instances"></a>

要允许与同一安全组关联的实例之间相互通信，您必须明确添加实现此目的的规则。

**注意**  
如果您将路由配置为通过中间设备在不同子网中的两个实例之间转发流量，则必须确保这两个实例的安全组允许流量在实例之间流动。每个实例的安全组必须引用另一个实例的私有 IP 地址或包含另一个实例的子网的 CIDR 范围作为源。如果您引用另一个实例的安全组作为源，则安全组不允许流量在实例之间流动。

下表描述了允许关联的实例相互通信的安全组的入站规则。该规则允许所有类型的流量。


| 协议类型 | 协议编号 | 端口 | 源 IP | 
| --- | --- | --- | --- | 
| -1 (All) | -1 (All) | -1 (All) | 安全组的 ID 或包含另一个实例的子网的 CIDR 范围（请参阅注释）。 | 

## 用于 ping/ICMP 的规则
<a name="sg-rules-ping"></a>

**ping** 命令是一种 ICMP 流量。要对实例执行 ping 操作，您必须添加以下入站 ICMP 规则之一。


| 类型 | 协议 | 来源 | 
| --- | --- | --- | 
| 自定义 ICMP - IPv4 | Echo 请求 | 计算机的公有 IPv4 地址、特定 IPv4 地址、或是来自任何位置的 IPv4 或 IPv6 地址。 | 
| 所有 ICMP - IPv4 | IPv4 ICMP (1) | 计算机的公有 IPv4 地址、特定 IPv4 地址、或是来自任何位置的 IPv4 或 IPv6 地址。 | 

要使用 **ping6** 命令对您的实例的 IPv6 地址执行 ping 操作，您必须添加以下入站 ICMPv6 规则。


| 类型 | 协议 | 来源 | 
| --- | --- | --- | 
| 所有 ICMP - IPv6 | IPv6 ICMP (58) | 计算机的 IPv6 地址、特定 IPv4 地址、或是来自任何位置的 IPv4 或 IPv6 地址。 | 

## DNS 服务器规则
<a name="sg-rules-dns"></a>

如果您已将 EC2 实例设置为 DNS 服务器，则必须确保 TCP 和 UDP 流量可通过端口 53 访问您的 DNS 服务器。

对于源 IP，请指定以下其中一项：
+ 网络中的 IP 地址或 IP 地址范围（采用 CIDR 数据块表示法）
+ 您网络中需要访问 DNS 服务器的实例组的安全组 ID。


| 协议类型 | 协议编号 | 端口 | 
| --- | --- | --- | 
| TCP | 6 | 53 | 
| UDP | 17 | 53 | 

## Amazon EFS 规则
<a name="sg-rules-efs"></a>

如果您将 Amazon EFS 文件系统与 Amazon EC2 实例结合使用，与 Amazon EFS 挂载目标关联的安全组必须允许使用 NFS 协议传输的流量。


| 协议类型 | 协议编号 | 端口 | 源 IP | 备注 | 
| --- | --- | --- | --- | --- | 
| TCP | 6 | 2049 (NFS) | 安全组 ID | 允许从与该安全组关联的资源 (包括挂载目标) 进行入站 NFS 访问。 | 

要在 Amazon EC2 实例上挂载 Amazon EFS 文件系统，您必须连接到您的实例。因此，与您的实例关联的安全组必须拥有允许来自本地计算机或本地网络的入站 SSH 的规则。


| 协议类型 | 协议编号 | 端口 | 源 IP | 备注 | 
| --- | --- | --- | --- | --- | 
| TCP | 6 | 22 (SSH) | 本地计算机的 IP 地址范围或网络的 IP 地址范围（采用 CIDR 数据块表示法）。 | 允许从您的本地计算机进行入站 SSH 访问。 | 

## Elastic Load Balancing 规则
<a name="sg-rules-elb"></a>

如果在负载均衡器中注册 EC2 实例，与负载均衡器关联的安全组必须允许与实例进行通信。有关更多信息，请参阅弹性负载均衡文档中的以下内容。
+ [应用程序负载均衡器的安全组](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-update-security-groups.html)
+ [网络负载均衡器的安全组](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-security-groups.html)
+ [为经典负载均衡器配置安全组](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-vpc-security-groups.html)
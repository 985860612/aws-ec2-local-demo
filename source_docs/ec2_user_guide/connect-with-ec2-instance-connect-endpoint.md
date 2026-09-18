

# 使用私有 IP 地址和 EC2 Instance Connect Endpoint 连接到您的实例
<a name="connect-with-ec2-instance-connect-endpoint"></a>

借助 EC2 Instance Connect 端点，您可以通过互联网安全地连接到实例，无需使用堡垒主机，也不需要您的虚拟私有云（VPC）直接连接到互联网。

**优势**
+ 您可以连接到实例，而实例无需具有公有 IPv4 或 IPv6 地址。AWS 对所有公有 IPv4 地址收费，包括与正在运行的实例关联的公有 IPv4 地址，以及弹性 IP 地址。有关更多信息，请参阅 [Amazon VPC 定价页面](https://aws.amazon.com/vpc/pricing/)中的**公有 IPv4 地址定价**选项卡。
+ 您可以通过互联网连接到实例，并且您的 VPC 也无需通过[互联网网关](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)直接建立互联网连接。
+ 您可以使用 [IAM 策略和权限](permissions-for-ec2-instance-connect-endpoint.md)来控制创建 EC2 Instance Connect 端点以及使用此端点连接到实例的权限。
+ 所有连接到实例的尝试，无论成功还是失败，都将记录到 [CloudTrail](log-ec2-instance-connect-endpoint-using-cloudtrail.md)。

**定价**  
使用 EC2 Instance Connect 端点不会产生额外的成本。如果您使用 EC2 Instance Connect 端点连接到位于其他可用区的实例，则将产生跨可用区[传输数据的额外费用](https://aws.amazon.com/ec2/pricing/on-demand/#Data_Transfer_within_the_same_AWS_Region)。

**Topics**
+ [工作原理](#how-eice-works)
+ [注意事项](#ec2-instance-connect-endpoint-prerequisites)
+ [权限](permissions-for-ec2-instance-connect-endpoint.md)
+ [安全组](eice-security-groups.md)
+ [创建 EC2 Instance Connect Endpoint](create-ec2-instance-connect-endpoints.md)
+ [修改 EC2 Instance Connect Endpoint](modify-ec2-instance-connect-endpoint.md)
+ [删除 EC2 Instance Connect 端点](delete-ec2-instance-connect-endpoint.md)
+ [连接到实例](connect-using-eice.md)
+ [日志连接](log-ec2-instance-connect-endpoint-using-cloudtrail.md)
+ [服务相关角色](eice-slr.md)
+ [配额](eice-quotas.md)

## 工作原理
<a name="how-eice-works"></a>

EC2 Instance Connect 端点是一种身份感知型 TCP 代理。EC2 Instance Connect 端点服务将使用您的 IAM 实体的凭证，建立从您的计算机到该端点的私有隧道。流量在到达您的 VPC 之前已通过身份验证和授权。

您可以[配置其他安全组规则](eice-security-groups.md)来限制实例的入站流量。例如，您可以使用入站规则仅允许来自 EC2 Instance Connect 端点的流量通过管理端口。

您可以配置路由表规则来允许该端点连接到 VPC 的任何子网中的任何实例。

下图显示了用户如何使用 EC2 Instance Connect 端点从互联网连接到实例。首先，在子网 A 中创建一个 **EC2 Instance Connect 端点**。我们为子网中为该端点创建一个网络接口，以作为发往 VPC 中实例的流量的入口点。如果子网 B 的路由表允许来自子网 A 的流量，则可以使用该端点连接到子网 B 中的实例。

![EC2 Instance Connect Endpoint 流程概述。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2-instance-connect-endpoint.png)


## 注意事项
<a name="ec2-instance-connect-endpoint-prerequisites"></a>

开始之前，请注意以下因素：
+ EC2 Instance Connect 端点专用于管理流量使用案例，不适用于大容量数据传输。大容量数据传输将被节流。
+ 您可以创建一个 EC2 Instance Connect 端点，以支持访问具有私有 IPv4 地址或 IPv6 地址的实例的流量。端点的 IP 地址类型必须与实例的 IP 地址匹配。您可以创建支持所有 IP 地址类型的端点。
+ （Linux 实例）如果您使用自己的密钥对，则可以使用任何 Linux AMI。否则，实例必须已经安装了 EC2 Instance Connect。有关哪些 AMI 包含 EC2 Instance Connect 以及如何将其安装在其他支持的 AMI 上的信息，请参阅 [安装 EC2 Instance Connect](ec2-instance-connect-set-up.md)。
+ 您可以为 EC2 Instance Connect 端点分配一个安全组。如果未分配安全组，则将使用 VPC 的默认安全组。EC2 Instance Connect 端点的安全组必须允许指向目标实例的出站流量。有关更多信息，请参阅 [EC2 Instance Connect Endpoint 安全组](eice-security-groups.md)。
+ 您可以将 EC2 Instance Connect 端点配置为在将请求路由到实例时保留客户端的源 IP 地址。否则，网络接口的 IP 地址将成为所有传入流量的客户端 IP 地址。
  + 如果您开启了客户端 IP 保留功能，则实例的安全组必须允许来自客户端的流量。此外，这些实例必须与 EC2 Instance Connect 端点位于同一 VPC 中。
  + 如果您关闭了客户端 IP 保留功能，则实例的安全组必须允许来自 VPC 的流量。这是默认值。
  + 只有 IPv4 EC2 Instance Connect 端点支持客户端 IP 保留。要使用客户端 IP 保留，EC2 Instance Connect 端点的 IP 地址类型必须为 IPv4。当 IP 地址类型为双堆栈或 IPv6 时，不支持客户端 IP 保留。
  + 以下实例类型不支持客户端 IP 保留：C1、CC1、CG2、G1、HI1、M1、M2、M3 和 T1。如果您开启了客户端 IP 保留功能并尝试使用 EC2 Instance Connect 端点连接到属于上述任何实例类型的实例，则连接将会失败。
  + 当流量通过中转网关路由时，不支持客户端 IP 保留功能。
+ 当您创建 EC2 Instance Connect Endpoint 时，系统将为 AWS Identity and Access Management（IAM）中的 Amazon EC2 服务自动创建服务相关的角色。Amazon EC2 使用服务相关的角色在您的账户中预置配网络接口，这是创建 EC2 Instance Connect Endpoint 时所必需的。有关更多信息，请参阅 [EC2 Instance Connect Endpoint 的服务相关角色](eice-slr.md)。
+ 每个 VPC 和每个子网只能创建一个 EC2 Instance Connect Endpoint。有关更多信息，请参阅 [EC2 Instance Connect 端点的限额](eice-quotas.md)。如需在同一 VPC 内的不同可用区中创建另一个 EC2 Instance Connect Endpoint，则必须先删除现有的 EC2 Instance Connect Endpoint。否则，您会收到限额错误。
+ 每个 EC2 Instance Connect 端点最多可支持 20 个并发连接。
+ 已建立 TCP 连接的最长持续时间为 1 小时（3,600 秒）。您可以在 IAM 策略中指定允许的最大持续时间，最长可以为 3,600 秒。有关更多信息，请参阅 [使用 EC2 Instance Connect 端点连接到实例的权限](permissions-for-ec2-instance-connect-endpoint.md#iam-OpenTunnel)。

  连接的持续时间并不是由 IAM 凭证的持续时间决定的。如果您的 IAM 凭证过期，连接将继续保持，直到达到指定的最长持续时间。当您使用 EC2 Instance Connect Endpoint 控制台体验连接到实例时，将**最大隧道持续时间（秒）**设置为小于 IAM 凭证持续时间的值。如果您的 IAM 凭证提前过期，请关闭浏览器页面以终止与实例的连接。
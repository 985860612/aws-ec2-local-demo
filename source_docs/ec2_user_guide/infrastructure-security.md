

# Amazon EC2 中的基础设施安全性
<a name="infrastructure-security"></a>

作为一项托管式服务，Amazon Elastic Compute Cloud 受 AWS 全球网络安全保护。有关 AWS 安全服务以及 AWS 如何保护基础设施的信息，请参阅 [AWS 云安全性](https://aws.amazon.com/security/)。要按照基础设施安全最佳实践设计您的 AWS 环境，请参阅《安全性支柱 AWS Well‐Architected Framework》**中的[基础设施保护](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/infrastructure-protection.html)。

您可以使用AWS发布的 API 调用通过网络访问 Amazon EC2。客户端必须支持以下内容：
+ 传输层安全性协议（TLS）。我们要求使用 TLS 1.2，建议使用 TLS 1.3。
+ 具有完全向前保密（PFS）的密码套件，例如 DHE（临时 Diffie-Hellman）或 ECDHE（临时椭圆曲线 Diffie-Hellman）。大多数现代系统（如 Java 7 及更高版本）都支持这些模式。

有关更多信息，请参阅《安全支柱：AWS Well-Architected 框架》**中的[基础设施保护](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/infrastructure-protection.html)。

## 网络隔离
<a name="network-isolation"></a>

虚拟私有云（VPC）是 AWS 云内您自己的逻辑隔离区域中的虚拟网络。可以使用单独的 VPC 按工作负载或组织实体隔离基础设施。

子网是 VPC 中的 IP 地址范围。在启动实例时，您可以在 VPC 上的子网中启动该实例。可以使用子网隔离单个 VPC 中的应用程序层（例如，Web、应用程序和数据库）。如果不应直接从 Internet 访问实例，请使用私有子网访问。

要使用私有 IP 地址从 VPC 调用 Amazon EC2 API，请使用 AWS PrivateLink。有关更多信息，请参阅 [使用接口 VPC 端点访问 Amazon EC2](interface-vpc-endpoints.md)。

## 物理主机上的隔离
<a name="physical-isolation"></a>

同一物理主机上的不同 EC2 实例彼此隔离，就好像它们位于不同的物理主机上一样。虚拟机监控程序隔离 CPU 和内存，并为实例提供虚拟化磁盘，而不是访问原始磁盘设备。

在停止或终止实例时，虚拟机监控程序将清理分配给实例的内存（设置为零），然后再将内存分配给新实例并重置每个存储块。这会确保不会意外向另一个实例泄露数据。

网络 MAC 地址由 AWS 网络基础设施动态分配给实例。IP 地址由 AWS 网络基础设施动态分配给实例，或者由 EC2 管理员通过经过身份验证的 API 请求进行分配。AWS 网络允许实例仅从分配给它们的 MAC 和 IP 地址发送流量。否则，将会丢弃流量。

默认情况下，实例无法接收未明确将其指定为目标地址的流量。如果需要在实例上运行网络地址转换（NATI）、路由或防火墙服务，您可以为网络接口禁用源/目标检查。

## 控制网络流量
<a name="control-network-traffic"></a>

请考虑使用以下方法来控制到 EC2 实例的网络流量：
+ 使用[安全组](ec2-security-groups.md)限制实例访问。配置允许所需最小网络流量的规则。例如，您可以仅允许来自公司网络地址范围的流量或仅允许特定协议（如 HTTPS）的流量。对于 Windows 实例，允许 Windows 管理流量和最少出站连接。
+ 使用安全组作为用于控制对 Amazon EC2 实例的网络访问的主要机制。必要时，尽量少使用网络 ACL，以提供无状态的粗略网络控制。安全组比网络 ACL 更为通用，因为它们能够执行有状态数据包筛选和创建引用其他安全组的规则。不过，网络 ACL 作为一项辅助控制，可以有效地拒绝特定流量子集或提供高级子网护栏。此外，由于网络 ACL 将应用于整个子网，因此，可以将它用作深度防御措施，以防实例在没有正确安全组的情况下意外启动。
+ [Windows 实例] 使用组策略对象（GPO）集中管理 Windows 防火墙设置，以便进一步增强网络控制。通常，客户将使用 Windows 防火墙来进一步查看网络流量并对安全组筛选器进行补充，创建高级规则来阻止特定应用程序访问网络或筛选来自子集 IP 地址的流量。例如，Windows 防火墙可以将对 EC2 元数据服务 IP 地址的访问限制为特定的用户或应用程序。或者，面向公众的服务可能使用安全组来限制特定端口的流量，而 Windows 防火墙则维护显式阻止的 IP 地址的列表。
+ 如果不应直接从 Internet 访问实例，请使用私有子网访问。使用堡垒主机或 NAT 网关从私有子网中的实例进行 Internet 访问。
+ [Windows 实例] 使用安全管理协议，如通过 SSL/TLS 进行的 RDP 封装。Remote Desktop Gateway Quick Start 提供了有关部署远程桌面网关（包括将 RDP 配置为使用 SSL/TLS）的最佳实践。
+ [Windows 实例] 使用 Active Directory 或 Directory Service 严格集中地控制和监控对 Windows 实例的交互式用户和组访问，并避免本地用户权限。此外，请避免使用域管理员，而是创建更精细的、应用程序特定的基于角色的账户。利用 Just Enough Administration (JEA)，可以在没有交互式访问或管理员访问的情况下管理对 Windows 实例进行的更改。此外，JEA 使组织能够锁定对实例管理所需的 Windows PowerShell 命令子集的管理访问权限。有关更多信息，请参阅[安全性、身份和合规性最佳实践](https://aws.amazon.com/architecture/security-identity-compliance/)。
+ [Windows 实例] 系统管理员应使用带有限访问权限的 Windows 账户执行日常活动，并且仅在有必要执行特定配置更改时提升访问权限。此外，仅在绝对必要时直接访问 Windows 实例。相反，利用中央配置管理系统（例如 EC2 Run Command、Systems Center Configuration Manager (SCCM)、Windows PowerShell DSC 或 Amazon EC2 Systems Manager (SSM)）将更改推送到 Windows 服务器。
+ 使用所需的最少网络路由配置 Amazon VPC 子网路由表。例如，仅将需要互联网的直接访问权限的 Amazon EC2 实例放置到带互联网网关路由的子网中，并且仅将需要内部网络的直接访问权限的 Amazon EC2 实例放置到带虚拟私有网关路由的子网中。
+ 考虑使用其他安全组或网络接口，独立于常规应用程序流量来控制和审计 Amazon EC2 实例管理流量。此方法可让客户实施用于更改控制的特殊 IAM 策略，从而更轻松地审计对安全组规则或自动规则验证脚本进行的更改。使用多个网络接口还提供了额外的网络流量控制选择，包括能够创建基于主机的路由策略或根据网络接口分配的子网利用不同的 VPC 子网路由规则。
+ 使用 AWS Virtual Private Network 或 Direct Connect 建立从远程网络到 VPC 的私有连接。有关更多信息，请参阅[网络到 Amazon VPC 的连接选项](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/network-to-amazon-vpc-connectivity-options.html)。
+ 使用 [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html) 监控到达实例的流量。
+ 使用 [GuardDuty 恶意软件防护](https://docs.aws.amazon.com/guardduty/latest/ug/malware-protection.html)来识别实例上表明恶意软件的可疑行为，这些行为可能会损害您的工作负载、重新利用资源用于恶意使用以及未经授权访问您的数据。
+ 使用 [GuardDuty 运行时监控](https://docs.aws.amazon.com/guardduty/latest/ug/runtime-monitoring.html)来识别和应对您的实例面临的潜在威胁。有关更多信息，请参阅 [How Runtime Monitoring works with Amazon EC2 instances](https://docs.aws.amazon.com/guardduty/latest/ug/how-runtime-monitoring-works-ec2.html)（运行时监控如何与 Amazon EC2 实例协同工作）。
+ 使用 [AWS Security Hub CSPM](https://docs.aws.amazon.com/securityhub/latest/userguide/)、[Reachability Analyzer](https://docs.aws.amazon.com/vpc/latest/reachability/) 或[网络访问分析器](https://docs.aws.amazon.com/vpc/latest/network-access-analyzer/)检查来自实例的意外网络访问。
+ 使用 [EC2 Instance Connect](connect-linux-inst-eic.md) 通过 Secure Shell（SSH）连接到实例，而无需共享和管理 SSH 密钥。
+ 使用 [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html) 远程访问实例，而不是打开入站 SSH 或 RDP 端口并管理密钥对。
+ 使用 [AWS Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html) 自动执行常见的管理任务，而不是连接到实例。
+ [Windows 实例] 许多 Windows 操作系统角色和 Microsoft 业务应用程序还提供了增强功能，例如 IIS 中的 IP 地址范围限制、Microsoft SQL Server 中的 TCP/IP 筛选策略以及 Microsoft Exchange 中的连接筛选策略。应用层中的网络限制功能可以为关键业务应用程序服务器提供额外的防御层。

Amazon VPC 支持其他网络安全控制，例如网关、代理服务器和网络监控选项。有关更多信息，请参阅《Amazon VPC 用户指南》**中的[控制网络流量](https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html#control-network-traffic)。
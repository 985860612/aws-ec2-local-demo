

# Windows 实例的安全最佳实践
<a name="ec2-windows-security-best-practices"></a>

建议您对 Windows 实例遵循以下安全最佳实践。

**Topics**
+ [高级安全最佳实践](#high-level-security)
+ [更新管理](#ec2-windows-update-management)
+ [配置管理](#configuration-management)
+ [变更管理](#change-management)
+ [Amazon EC2 Windows 实例的审计和问责](#audit-accountability)

## 高级安全最佳实践
<a name="high-level-security"></a>

对于 Windows 实例，您应遵循以下高级安全最佳实践：
+ **最小访问权限**：仅授予对受信任的和预期的系统和位置的访问权限。这适用于所有 Microsoft 产品，例如 Active Directory、Microsoft 业务生产力服务器以及基础设施服务（例如远程桌面服务、反向代理服务器、IIS Web 服务器等）。使用 AWS 功能（例如 Amazon EC2 实例安全组、网络访问控制列表 (ACL) 和 Amazon VPC 公有/私有子网）跨架构中的多个位置对安全性进行分层。在 Windows 实例中，客户可以使用 Windows 防火墙在其部署中进一步对深度防御策略进行分层。只安装系统按设计运行所需的操作系统组件和应用程序。将 IIS 等基础设施服务配置为在服务账户下运行，或使用应用程序池身份等功能以跨基础设施本地和远程访问资源。
+ **最低权限**：确定实例和账户执行其功能所需的最低权限集。限制服务器和用户以仅允许这些已定义的权限。使用基于角色的访问控制等技术来减小管理账户的表面面积，并创建最受限的角色来完成任务。使用 NTFS 中的加密文件系统（EFS）等操作系统功能来对敏感数据进行静态加密，并控制应用程序和用户对该数据的访问。
+ **配置管理**：创建一个基准服务器配置，其中包含最新的安全修补程序和基于主机的保护套件，其中包括防病毒、防恶意软件、入侵检测/防护和文件完整性监控。根据当前记录的基准评测每个服务器，以确定和标记任何偏差。确保将每个服务器配置为生成和安全存储适当的日志和审计数据。
+ **更改管理**：创建流程来控制对服务器配置基准进行的更改，并致力于完全自动化的更改流程。此外，通过将 Just Enough Administration (JEA) 与 Windows PowerShell DSC 结合使用来限制对最少所需功能的管理访问。
+ **补丁管理**：实施定期安装补丁、更新和保护 EC2 实例上的操作系统和应用程序的流程。
+ **审计日志**：审计访问权限和对 Amazon EC2 实例进行的所有更改，以验证服务器完整性并确保仅进行授权更改。利用 [IIS 增强日志记录](https://learn.microsoft.com/en-us/iis/get-started/whats-new-in-iis-85/enhanced-logging-for-iis85)等功能来增强默认日志记录功能。AWS 功能（例如 VPC 流日志和 AWS CloudTrail）也可用于审计网络访问权限，包括允许/拒绝的请求和 API 调用。

## 更新管理
<a name="ec2-windows-update-management"></a>

为确保在 Amazon EC2 上运行 Windows Server 时的最佳结果，我们建议您实施以下最佳实践：
+ [Configure Windows Update](#windows-update)
+ [Update drivers](#drivers)
+ [Use the latest Windows AMIs](#AMI)
+ [Test performance before migration](#test)
+ [Update launch agents](#agents)
+ 在安装更新之后重启 Windows 实例。有关更多信息，请参阅 [重启 Amazon EC2 实例](ec2-instance-reboot.md)。

有关如何将 Windows 实例升级或迁移到 Windows Server 新版本的信息，请参阅[将 EC2 Windows 实例升级到更高版本的 Windows Server](serverupgrade.md)。

**配置 Windows 更新**  
默认情况下，从 AWS Windows Server AMI 启动的实例不会通过 Windows 更新接收更新。

**更新 Windows 驱动程序**

维护所有 Windows EC2 实例上的最新驱动程序，以确保在您的实例集中应用最新的问题修复和性能增强。您需要更新 AWS PV、Amazon ENA 和 AWS NVMe 驱动程序，具体取决于您的实例类型。
+ 使用 [SNS 主题](xen-drivers-overview.md#drivers-subscribe-notifications)接收新驱动程序版本的更新。
+ 使用 AWS Systems Manager Automation 运行手册 [AWSSupport-UpgradeWindowsAWSDrivers](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awssupport-upgradewindowsawsdrivers.html) 跨实例中轻松应用更新。

**使用最新 Windows AMI 启动实例**

AWS 每月发布新的 Windows AMI，其中包含最新的操作系统补丁、驱动程序和启动代理。您应该在启动新实例或构建自己的自定义映像时利用最新的 AMI。
+ 要查看每个版本的 AWS Windows AMI 的更新，请参阅 [AWS Windows AMI 版本历史记录](https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/ec2-windows-ami-version-history.html)。
+ 要使用最新 AMI 进行构建，请参阅[使用 Systems Manager Parameter Store 查询最新的 Windows AMI](https://aws.amazon.com/blogs/mt/query-for-the-latest-windows-ami-using-systems-manager-parameter-store/)。
+ 有关可用于启动数据库实例的专用 Windows AMI 以及合规性强化用例的更多信息，请参阅《AWS Windows AMI Reference》**中的 [Specialized Windows AMIs](https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/specialized-windows-amis.html)。

**在迁移前测试系统/应用程序性能**

将企业应用程序迁移到 AWS 可能涉及很多变量和配置。始终对 EC2 解决方案进行性能测试，以确保：
+ 已正确配置实例类型，包括实例大小、增强联网和租赁（共享或专用）。
+ 实例拓扑适用于工作负载，并在必要时利用高性能功能（如专用租赁、放置组、实例存储卷和裸机）。

**安装最新版本的 EC2Launch v2**  
安装最新的 EC2Launch v2 代理，以确保在您的实例集中应用最新的增强。有关更多信息，请参阅 [安装 EC2Launch v2](ec2launch-v2-install.md)。

如果有混合实例集，或者要继续使用 EC2Launch（Windows Server 2016 和 2019）或 EC2 Config（仅限旧式操作系统）代理，请更新到相应代理的最新版本。

以下 Windows Server 版本和启动代理的组合支持自动更新。您可以在 **Amazon EC2 启动代理**下的 [SSM 快速设置主机管理](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-host-management.html)控制台中选择自动更新。


| Windows 版本 | EC2Launch v1 | EC2Launch v2 | 
| --- | --- | --- | 
| 2016 | ✓ | ✓ | 
| 2019 | ✓ | ✓ | 
| 2022 |  | ✓ | 
+ 有关更新到 EC2Launch v2 的更多信息，请参阅 [安装最新版本的 EC2Launch v2](ec2launch-v2-install.md)。
+ 有关手动更新 EC2Config 的信息，请参阅 [安装最新版的 EC2Config](UsingConfig_Install.md)。
+ 有关手动更新 EC2Launch 的信息，请参阅 [安装最新版本的 EC2Launch](ec2launch-download.md)。

## 配置管理
<a name="configuration-management"></a>

亚马逊机器映像（AMI）为 Amazon EC2 实例提供了初始配置，其中包括 Windows OS 和可选的客户特定的自定义项，例如应用程序和安全控制。创建包含自定义安全配置基准的 AMI 目录可确保使用标准安全控制启动所有 Windows 实例。可以将安全基准烘焙成 AMI，在启动 EC2 实例时动态引导它，或将它打包为产品，以便通过 AWS Service Catalog 产品组合进行统一分发。有关保护 AMI 的更多信息，请参阅[构建 AMI 的最佳实践](https://docs.aws.amazon.com/marketplace/latest/userguide/best-practices-for-building-your-amis.html)。

每个 Amazon EC2 实例都应遵循组织安全标准。请勿安装任何不需要的 Windows 角色和功能，并安装软件来抵御恶意代码（防病毒软件、防恶意软件、利用缓解）、监控主机完整性并执行入侵检测。配置安全软件来监控和维护 OS 安全设置，保护关键 OS 文件的完整性，并在偏离安全基准时发出警报。考虑实施由 Microsoft、互联网安全中心 (CIS) 或美国国家标准与技术研究院 (NIST) 发布的建议安全配置基准。考虑对特定的应用程序服务器使用其他 Microsoft 工具，例如 [SQL Server 的最佳实践分析器](https://www.microsoft.com/en-us/download/details.aspx?id=29302)。

AWS 客户还可以运行 Amazon Inspector 评估，以改进 Amazon EC2 实例上部署的应用程序的安全性和合规性。Amazon Inspector 将自动评估应用程序以查看是否存在漏洞或偏离最佳实践，并且包含一个知识库，其中包含映射到常见安全合规性标准（例如，PCI DSS）和漏洞定义的几百条规则。内置规则的示例包括检查是否启用了远程根登录或是否安装了易受攻击的软件版本。AWS 安全研究员会定期更新这些规则。

在保护 Windows 实例时，建议您实施 Active Directory 域服务，以便为分布式位置启用可扩展的、安全的且可管理的基础设施。此外，在通过 Amazon EC2 控制台或使用 Amazon EC2 预配置工具（例如 AWS CloudFormation）启动实例后，最好是使用本机操作系统功能（例如 Microsoft Windows PowerShell DSC），以便在发生配置偏差时维护配置状态。

## 变更管理
<a name="change-management"></a>

在启动时将初始安全基准应用于 Amazon EC2 实例后，可以控制正在进行的 Amazon EC2 更改来维护虚拟机的安全性。建立变更管理流程以授权和合并对 AWS 资源（例如，安全组、路由表和网络 ACL）以及操作系统和应用程序配置（例如 Windows 或应用程序修补、软件升级或配置文件更新）进行的更改。

AWS 提供了多种工具来帮助管理对 AWS 资源（包括 AWS CloudTrail、AWS Config、CloudFormation 和 AWS Elastic Beanstalk 以及 Systems Center Operations Manager 和 System Center Virtual Machine Manager 的管理包）进行的更改。请注意，Microsoft 会在每月的第二个星期二（或根据需要）发布 Windows 补丁，而 AWS 将在 Microsoft 发布补丁后五天内更新所有由 AWS 管理的 Windows AMI。因此，必须持续修补所有基准 AMI、使用最新的 AMI ID 更新 CloudFormation 模板和自动扩缩组配置，并实施工具来自动实施运行的实例修补管理。

Microsoft 提供了几个用于管理 Windows 操作系统和应用程序更改的选项。例如，SCCM 提供了环境修改的完整生命周期覆盖。选择相应工具，以便满足业务需求并控制更改如何影响应用程序 SLA、容量、安全性和灾难恢复过程。避免手动更改，并改用自动化配置管理软件或命令行工具（例如 EC2 Run Command 或 Windows PowerShell）来实施脚本化的、可重复的变更流程。要帮助达到此要求，请使用带增强日志记录的堡垒主机来进行与 Windows 实例的所有交互，以确保自动记录所有事件和任务。

## Amazon EC2 Windows 实例的审计和问责
<a name="audit-accountability"></a>

AWS CloudTrail、AWS Config 和 AWS Config 规则 提供了审计和更改跟踪功能来审计 AWS 资源更改。将 Windows 事件日志配置为将本地日志文件发送到集中式日志管理系统，以便保留日志数据来进行安全和操作行为分析。Microsoft System Center Operations Manager (SCOM) 聚合有关部署到 Windows 实例的 Microsoft 应用程序的信息，并根据应用程序角色和服务来应用预配置的规则集和自定义规则集。System Center Management Packs 基于 SCOM 而构建，旨在提供特定于应用程序的监控和配置准则。这些[管理包](https://learn.microsoft.com/en-us/archive/technet-wiki/16174.microsoft-management-packs)支持 Windows Server Active Directory、SharePoint Server 2013、Exchange Server 2013、Lync Server 2013、SQL Server 2014 和许多其他的服务器和技术。

除了 Microsoft 系统管理工具之外，客户还可以使用 Amazon CloudWatch 监控实例 CPU 利用率、磁盘性能、网络 I/O 以及执行主机和实例状态检查。EC2Config、EC2Launch 和 EC2Launch v2 启动代理提供对 Windows 实例的其他高级功能的访问。例如，它们可以将 Windows 系统、安全性、应用程序和 Internet Information Services (IIS) 日志导出到 CloudWatch Logs，这些日志随后可与 Amazon CloudWatch 指标和警报集成。此外，客户可以创建脚本来将 Windows 性能计数器导出到 Amazon CloudWatch 自定义指标。
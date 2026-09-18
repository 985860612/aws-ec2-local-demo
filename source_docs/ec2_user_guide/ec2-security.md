

# Amazon EC2 中的安全性
<a name="ec2-security"></a>

AWS的云安全性的优先级最高。作为 AWS 客户，您将从专为满足大多数安全敏感型组织的要求而打造的数据中心和网络架构中受益。

安全性是 AWS 和您的共同责任。[责任共担模式](https://aws.amazon.com/compliance/shared-responsibility-model/)将其描述为云的安全性和云中的安全性：
+ **云安全性**：AWS 负责保护在 AWS 云中运行 AWS 服务的基础结构。AWS 还向您提供可安全使用的服务。作为[AWS合规性计划](https://aws.amazon.com/compliance/programs/)的一部分，第三方审计人员将定期测试和验证安全性的有效性。要了解适用于 Amazon EC2 的合规性计划，请参阅 内的[AWS 服务合规性计划范围内](https://aws.amazon.com/compliance/services-in-scope/)的服务。
+ **云中的安全性** – 您的责任包括以下各个方面：
  + 例如，通过配置 VPC 和安全组来控制对实例的网络访问。有关更多信息，请参阅[控制网络流量](infrastructure-security.md#control-network-traffic)。
  + 管理用于连接到您的实例的凭证。
  + 管理访客操作系统和部署到访客操作系统的软件，包括更新和安全补丁。有关更多信息，请参阅[Amazon EC2 实例的更新管理](update-management.md)。
  + 配置附加到实例的 IAM 角色以及与这些角色关联的权限。有关更多信息，请参阅[适用于 Amazon EC2 的 IAM 角色](iam-roles-for-amazon-ec2.md)。

该文档帮助您了解如何在使用 Amazon EC2 时应用责任共担模式。它说明了如何配置 Amazon EC2 以实现您的安全性和合规性目标。您还会了解如何使用其他AWS服务以帮助您监控和保护 Amazon EC2 资源。

**Topics**
+ [数据保护](data-protection.md)
+ [基础设施安全性](infrastructure-security.md)
+ [故障恢复能力](disaster-recovery-resiliency.md)
+ [合规性验证](compliance-validation.md)
+ [Identity and Access Management](security-iam.md)
+ [更新管理](update-management.md)
+ [Windows 实例的最佳实践](ec2-windows-security-best-practices.md)
+ [密钥对](ec2-key-pairs.md)
+ [安全组](ec2-security-groups.md)
+ [NitroTPM](nitrotpm.md)
+ [EC2 实例认证](nitrotpm-attestation.md)
+ [适用于 Windows 实例的凭证保护](credential-guard.md)
+ [AWS PrivateLink](interface-vpc-endpoints.md)
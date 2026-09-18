

# 使用公有 IP 地址和 EC2 Instance Connect 连接到 Linux 实例
<a name="connect-linux-inst-eic"></a>

Amazon EC2 Instance Connect 提供了一种安全的方法，可使用 Secure Shell（SSH）连接到 Linux 实例。借助 EC2 Instance Connect，您可以使用 AWS Identity and Access Management (IAM) [策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)和[主体](https://docs.aws.amazon.com/IAM/latest/UserGuide/intro-structure.html#intro-structure-principal)来控制对实例的 SSH 访问，无需共享和管理 SSH 密钥。使用 EC2 Instance Connect 的所有连接请求将[记录到 AWS CloudTrail 中](monitor-with-cloudtrail.md#ec2-instance-connect-cloudtrail)，以便您可以审核连接请求。

您可以通过 Amazon EC2 控制台或所选的 SSH 客户端使用 EC2 Instance Connect 连接到实例。

在使用 EC2 Instance Connect 连接到实例时，EC2 Instance Connect API 会将一个 SSH 公有密钥推送到[实例元数据](ec2-instance-metadata.md)并在其中保留 60 秒。附加到用户的 IAM policy 会授权用户将公有密钥推送到实例元数据。SSH 进程守护程序使用在安装 EC2 Instance Connect 时配置的 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser`，从实例元数据中查找公有密钥以进行身份验证，并将您连接到实例。

**提示**  
EC2 Instance Connect 是连接到 Linux 实例的选项之一。有关其他选项，请参阅 [使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)。要连接到 Windows 实例，请参阅 [使用 RDP 连接到 Windows 实例](connecting_to_windows_instance.md)。

**定价**  
EC2 Instance Connect 无需额外付费。

**区域可用性**  
EC2 Instance Connect 适用于所有 AWS 区域，但 AWS European Sovereign Cloud (Germany) 除外。但在本地区中不受支持。

**Topics**
+ [教程](ec2-instance-connect-tutorial.md)
+ [先决条件](ec2-instance-connect-prerequisites.md)
+ [权限](ec2-instance-connect-configure-IAM-role.md)
+ [安装 EC2 Instance Connect](ec2-instance-connect-set-up.md)
+ [连接到实例](ec2-instance-connect-methods.md)
+ [卸载 EC2 Instance Connect](ec2-instance-connect-uninstall.md)

有关讨论如何使用 EC2 Instance Connect 提高堡垒主机安全性的博客文章，请参阅[使用 Amazon EC2 Instance Connect 保护您的堡垒主机](https://aws.amazon.com/blogs/infrastructure-and-automation/securing-your-bastion-hosts-with-amazon-ec2-instance-connect/)。
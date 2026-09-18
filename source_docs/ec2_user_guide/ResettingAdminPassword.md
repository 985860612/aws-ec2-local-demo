

# 重置 Amazon EC2 Windows 实例的 Windows 管理员密码
<a name="ResettingAdminPassword"></a>

如果因为 Windows 管理员密码丢失或过期而无法连接到 Amazon EC2 Windows 实例，则可以重置密码。

**注意**  
有一个自动应用重置本地管理员密码所需的手动步骤的 AWS Systems Manager 自动化文档。有关更多信息，请参阅 *AWS Systems Manager 用户指南*中的[在 Amazon EC2 实例上重置密码和 SSH 密钥](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-ec2reset.html)。

重置管理员密码的手动方法使用 EC2Launch v2、EC2Config 或 EC2Launch。
+ 对于包含 EC2Launch v2 代理的所有受支持的 Windows AMI，请使用 EC2Launch v2。
+ 对于 Windows Server 2016 之前的 Windows AMI，请使用 EC2Config 服务。
+ 对于 Windows Server 2016 及更高版本 AMI，请使用 EC2Launch 服务。

这些过程还描述了在丢失用于创建实例的密钥对时如何连接实例。Amazon EC2 使用公有密钥加密某个数据（如一个密码)，并使用私有密钥解密数据。公有和私有密钥被称为*密钥对*。对于 Windows 实例，您可以使用密钥对获得管理员密码，然后使用 RDP 登录实例。

**注意**  
如果您在实例上禁用了本地管理员账户，并且您的实例已配置为 Systems Manager，则还可以使用 EC2Rescue 和 Run Command 重新启用和重置本地管理员密码。有关更多信息，请参阅[将适用于 Windows Server 的 EC2Rescue 与 Systems Manager Run Command 配合使用](ec2rw-ssm.md)。

**Topics**
+ [使用 EC2Launch v2 重置 EC2 实例的 Windows 管理员密码](ResettingAdminPassword_EC2Launchv2.md)
+ [使用 EC2Launch 重置 EC2 实例的 Windows 管理员密码](ResettingAdminPassword_EC2Launch.md)
+ [使用 EC2Config 重置 EC2 实例的 Windows 管理员密码](ResettingAdminPassword_EC2Config.md)


# 适用于 Amazon EC2 的 Identity and Access Management
<a name="security-iam"></a>

AWS Identity and Access Management（IAM）是一项 AWS 服务，可以帮助管理员安全地控制对 AWS 资源的访问。IAM 管理员控制谁可以*通过身份验证*（登录）和*获得授权*（具有权限）来使用 Amazon EC2 资源。IAM 是一项无需额外费用即可使用的。AWS 服务

您的安全凭证使 AWS 中的服务可以识别您，并授予您对 AWS 资源（例如您 Amazon EC2 资源）的使用权限。您可以使用 Amazon EC2 和 IAM 的功能，在不共享您安全凭证情况下允许其他用户、服务和应用程序使用您 Amazon EC2 资源。您可以使用 IAM 控制其他用户对您 AWS 账户 中资源的使用方式，并且您可以使用安全组来控制对您 Amazon EC2 实例的访问。您可以选择允许 Amazon EC2 资源的完全使用或有限使用权限。

如果您是开发人员，则可以使用 IAM 角色来管理在 EC2 实例上运行的应用程序所需的安全凭证。将 IAM 角色附加到实例后，在该实例上运行的应用程序可以从实例元数据服务（IMDS）检索凭证。

有关使用 IAM 保护您 AWS 资源的最佳实践，请参阅《IAM 用户指南》**中的 [IAM 的安全防御最佳实操](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)。

**Topics**
+ [Amazon EC2 基于身份的策略](iam-policies-for-amazon-ec2.md)
+ [用于控制访问 Amazon EC2 API 的示例策略](ExamplePolicies_EC2.md)
+ [用于控制对 Amazon EC2 控制台的访问的示例策略](iam-policies-ec2-console.md)
+ [AWSAmazon EC2 的 托管式策略](security-iam-awsmanpol.md)
+ [适用于 Amazon EC2 的 IAM 角色](iam-roles-for-amazon-ec2.md)
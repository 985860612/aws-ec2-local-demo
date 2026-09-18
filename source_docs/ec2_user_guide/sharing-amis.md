

# 了解 Amazon EC2 中共享 AMI 的使用情况
<a name="sharing-amis"></a>

*共享 AMI* 是开发人员创建并可供其他人员使用的 AMI。要开始使用 Amazon EC2，最简单的方法之一是使用共享 AMI，您可以从中获得所需的组件，然后添加自定义内容。您还可以创建自己的 AMI 并与他人共享。

使用共享 AMI 需自行承担风险。Amazon 不保证其他 Amazon EC2 用户共享的 AMI 的完整性或安全性。因此，您应该像处理其他您可能会考虑在自己的数据中心部署的外来代码一样处理共享 AMI，对其执行适当的功能调查。我们建议您从可信来源（例如经过验证的提供者）获取 AMI。

## 经过验证的提供商
<a name="verified-ami-provider"></a>

在 Amazon EC2 控制台中，将 Amazon 或经过验证的 Amazon 合作伙伴拥有的公有 AMI 标记为**经过验证的提供商**。

您也可以使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) AWS CLI 命令标识来自经过验证的提供商的公共 AMI。Amazon 或经过验证的合作伙伴拥有的公共映像具有一个别名拥有者，即 `amazon`、`aws-backup-vault` 或 `aws-marketplace`。在 CLI 输出中，将为 `ImageOwnerAlias` 显示这些值。其他用户不能对其 AMI 使用别名。这使您可以轻松查找来自 Amazon 或经过验证的合作伙伴的 AMI。

要成为经过验证的提供商，您必须在 AWS Marketplace 上注册成为卖方。在注册后，您可以在 AWS Marketplace 上列出您的 AMI。有关更多信息，请参阅*《AWS Marketplace 卖方指南》*中的[以卖方身份开始使用](https://docs.aws.amazon.com/marketplace/latest/userguide/user-guide-for-sellers.html)和[基于 AMI 的产品](https://docs.aws.amazon.com/marketplace/latest/userguide/ami-products.html)。

**Topics**
+ [经过验证的提供商](#verified-ami-provider)
+ [查找用于 Amazon EC2 实例的共享 AMI](usingsharedamis-finding.md)
+ [准备使用适用于 Linux 的共享 AMI](usingsharedamis-confirm.md)
+ [使用“允许的 AMI”控制在 Amazon EC2 中对 AMI 的发现和使用](ec2-allowed-amis.md)
+ [将您的 AMI 设为可在 Amazon EC2 中公开使用](sharingamis-intro.md)
+ [了解 AMI 的屏蔽公共访问](block-public-access-to-amis.md)
+ [与组织和组织单位共享 AMI](share-amis-with-organizations-and-OUs.md)
+ [与特定 AWS 账户共享 AMI](sharingamis-explicit.md)
+ [取消与您的 AWS 账户 共享 AMI](cancel-sharing-an-AMI.md)
+ [创建共享 Linux AMI 的建议](building-shared-amis.md)

**如果您正在寻找有关其他主题的信息**
+ 有关创建 AMI 的信息，请参阅 [创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md) 或 [创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。
+ 有关在 AWS Marketplace 中构建、交付和维护应用程序的信息，请参阅 [AWS Marketplace 文档](https://docs.aws.amazon.com/marketplace/)。
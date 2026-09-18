

# 了解 AMI 的屏蔽公共访问
<a name="block-public-access-to-amis"></a>

要防止公开共享您的 AMI，请在账户级别启用*屏蔽对 AMI 的公共访问*。

启用阻止公开访问后，任何将 AMI 设为公开的尝试都会被自动阻止。但是，如果您已经有公有 AMI，则其将保持公开可用。

要公开共享 AMI，您必须禁用阻止公开访问。共享完成后，最佳实践是重新启用阻止公开访问功能，以防止意外地公开共享您的 AMI。

**注意**  
此设置是在账户级别配置，可以直接在账户中配置，也可以使用声明式策略进行配置。您必须在要防止公开共享 AMI 的每个 AWS 区域中配置该功能。使用声明式策略可同时将设置应用于多个区域，也可以同时应用于多个账户。当使用声明性策略时，您无法直接在账户中修改设置。本主题介绍如何直接在账户中配置设置。有关使用声明式策略的信息，请参阅《AWS Organizations User Guide》**中的 [Declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html)。

您可以将 IAM 权限限制为管理员用户，这样只有此类用户可启用或禁用阻止 AMI 的公开访问。

**Topics**
+ [默认设置](#block-public-access-to-amis-default-settings)
+ [管理 AMI 的屏蔽公共访问设置](manage-block-public-access-for-amis.md)

## 默认设置
<a name="block-public-access-to-amis-default-settings"></a>

根据您的账户是新账户还是现有账户，以及您是否拥有公用 AMI，默认启用或禁用**阻止公开访问 AMI** 设置。下表列出了默认设置：


| AWS 账户 | “阻止公开访问 AMI”默认设置 | 
| --- | --- | 
| 新账户 | 已启用 | 
| 没有公用 AMI 的现有账户¹ | 已启用 | 
| 有一个或多个公用 AMI 的现有账户¹ | 已禁用 | 

¹如果您的账户在 2023 年 7 月 15 日当天或之后拥有一个或多个公用 AMI，那么即使您随后将所有 AMI 设为私有，系统仍会为您的账户默认禁用**阻止公开访问 AMI**。
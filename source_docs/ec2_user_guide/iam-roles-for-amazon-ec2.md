

# 适用于 Amazon EC2 的 IAM 角色
<a name="iam-roles-for-amazon-ec2"></a>

应用程序必须通过 AWS 凭证签署其 API 请求。因此，如果您是应用程序开发人员，您需要一个策略来为 EC2 实例上运行的应用程序管理凭证。例如，您可以安全地将您的 AWS 凭证分配至实例，从而允许这些实例上的应用程序使用您的凭证签署请求，并保护您的凭证不被其他用户使用。但是，要将凭证安全地分配至每个实例是有难度的，尤其是 AWS 以您的名义创建的实例，例如竞价型实例或自动扩缩组中的实例。当您轮换 AWS 凭证时，您还必须能够更新每项实例上的凭证。

我们设计了 IAM 角色，以便您的应用程序能够安全地从实例发出 API 请求，而无需管理应用程序使用的安全凭证。您可以使用 IAM 角色委托授权以发出 API 请求，而不用创建并分配您的 AWS 凭证，如下所示：

1. 创建一个 IAM 角色。

1. 定义能够担任此角色的账户或 AWS 服务。

1. 定义担任角色后应用程序可以使用的 API 操作和资源。

1. 在您启动实例时指定角色，或者将角色附加到现有实例。

1. 让应用程序检索一组临时证书并使用它们。

例如，您可以使用 IAM 角色为在实例上运行的应用程序授予使用 Amazon S3 中的存储桶所需的权限。您可以通过创建 JSON 格式的策略为 IAM 角色指定权限。这些类似于您为 用户创建的策略。如果您更改了某个角色，系统会将此更改传播到所有实例。

**注意**  
Amazon EC2 IAM 角色凭证不受角色中配置的会话持续时间上限的限制。有关更多信息，请参阅《IAM 用户指南》**中的[担任角色的方法](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage-assume.html)。

在创建 IAM 角色时，请关联最低权限 IAM policies，这些策略将限制对应用程序所需的特定 API 调用的访问权限。对于 Windows 到 Windows 的通信，请使用明确定义且良好记录的 Windows 组和角色以授予 Windows 实例之间的应用程序级访问权限。组和角色允许客户定义最低权限的应用程序和 NTFS 文件夹级别的权限，从而限制对应用程序特定的要求的访问。

您只能将一个 IAM 角色附加到实例，但可以将同一角色附加到多个实例。有关创建和使用 IAM 角色的更多信息，请参阅 *IAM 用户指南* 中的[角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)。

您可以将资源级权限应用到您的 IAM 策略，以便控制用户为一个实例附加、替换或分离 IAM 角色的能力。有关更多信息，请参阅 [Amazon EC2 API 操作支持的资源级权限](iam-policies-for-amazon-ec2.md#ec2-supported-iam-actions-resources) 以及以下示例：[示例：使用 IAM 角色](ExamplePolicies_EC2.md#iam-example-iam-roles)。

**Topics**
+ [实例配置文件](#ec2-instance-profile)
+ [使用案例的权限](#generate-policy-for-iam-role)
+ [检索安全凭证](instance-metadata-security-credentials.md)
+ [将角色附加到实例的权限](permission-to-pass-iam-roles.md)
+ [将角色附加到实例](attach-iam-role.md)
+ [实例身份角色](#ec2-instance-identity-roles)

## 实例配置文件
<a name="ec2-instance-profile"></a>

Amazon EC2 使用*实例配置文件* 作为 IAM 角色的容器。使用 IAM 控制台创建 IAM 角色时，控制台自动创建实例配置文件，按相应的角色为文件命名。如果您使用 Amazon EC2 控制台启动一个带 IAM 角色的实例或将一个 IAM 角色附加到实例，则请根据实例配置文件名称列表选择角色。

如果您使用 AWS CLI、API 或 AWS 开发工具包创建角色，则是以单独操作的形式创建角色和实例配置文件，可以为它们提供不同的名称。如果您使用 AWS CLI、API 或 AWS 开发工具包启动带有 IAM 角色的实例，或将 IAM 角色附加到实例，请指定实例配置文件名称。

一个实例配置文件只能包含一个 IAM 角色。您可以将一个 IAM 角色包含在多个实例配置文件中。

要更新实例的权限，请替换其实例配置文件。我们不建议从实例配置文件中移除角色，因为此更改最长需要一小时才会生效。

有关更多信息，请参阅《IAM 用户指南》**中的[使用实例配置文件](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html)。

## 使用案例的权限
<a name="generate-policy-for-iam-role"></a>

首次为应用程序创建 IAM 角色时，有时授予的权限可能超出所需权限。在生产环境中启动应用程序之前，您可以根据 IAM 角色的访问活动生成 IAM 策略。IAM 访问分析器会查看您的 AWS CloudTrail 日志并生成一个策略模板，其中包含角色在指定日期范围内使用的权限。您可以使用模板创建具有精细权限的托管策略，然后将其附加到 IAM 角色。这样，您仅需授予角色与特定使用案例中的 AWS 资源进行交互所需的权限。这可帮助您遵循[授予最低权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege)的最佳实践。有关更多信息，请参阅《IAM 用户指南》**中的 [IAM Access Analyzer 策略生成](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-generation.html)。

## Amazon EC2 实例的实例身份角色
<a name="ec2-instance-identity-roles"></a>

您启动的每个 Amazon EC2 实例都有一个代表其身份的*实例身份角色*。实例身份角色是一种 IAM 角色。集成使用实例身份角色的 AWS 服务和功能可以使用它来标识服务的实例。

实例身份角色凭证可通过 `/identity-credentials/ec2/security-credentials/ec2-instance` 的实例元数据服务（IMDS）访问。凭证由 AWS 临时访问密钥对和会话令牌组成。它们用于对使用实例身份角色的 AWS 服务签署 AWS Sigv4 请求。无论实例上是否启用了使用实例身份角色的服务或功能，凭证都存在于实例元数据中。

实例身份角色会在实例启动时自动创建，没有 role-trust 策略文档，并且不受任何身份或资源策略的约束。

### 支持的服务
<a name="iir-supported-services"></a>

以下 AWS 服务使用实例身份角色：
+ **Amazon Bedrock AgentCore**：[AgentCore 运行时实例](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-instances-how-it-works.html)使用实例身份角色在启动期间设置实例。
+ **Amazon EC2**：[EC2 Instance Connect](connect-linux-inst-eic.md) 使用实例身份角色来更新 Linux 实例的主机密钥。
+ **Amazon GuardDuty**：[GuardDuty 运行时监控](https://docs.aws.amazon.com/guardduty/latest/ug/runtime-monitoring.html)使用实例身份角色，允许运行时代理向 GuardDuty VPC 端点发送安全遥测数据。
+ **AWS Lambda**：[Lambda 托管实例](https://docs.aws.amazon.com/lambda/latest/dg/lambda-managed-instances.html)使用实例身份角色进行生命周期挂钩、遥测和构件分发。
+ **AWS Security Token Service（AWS STS）**– 实例身份角色凭证可与 AWS STS [`GetCallerIdentity`](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html) 操作结合使用。
+ **AWS Systems Manager** – 使用[默认主机管理配置](https://docs.aws.amazon.com/systems-manager/latest/userguide/fleet-manager-default-host-management-configuration.html)时，AWS Systems Manager 将使用实例身份角色提供的身份来注册 EC2 实例。标识实例后，Systems Manager 可将 `AWSSystemsManagerDefaultEC2InstanceManagementRole` IAM 角色传递给实例。

实例身份角色不能与其他 AWS 服务或功能结合使用，因为其并未与实例身份角色集成。

### 实例身份角色 ARN
<a name="iir-arn"></a>

实例身份角色 ARN 采用以下格式：

```
arn:{{aws-partition}}:iam::{{account-number}}:assumed-role/aws:ec2-instance/{{instance-id}}
```

例如：

```
arn:{{aws}}:iam::{{0123456789012}}:assumed-role/aws:ec2-instance/{{i-1234567890abcdef0}}
```

有关 ARN 的更多信息，请参阅《IAM 用户指南》**中的 [Amazon 资源名称（ARN）](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html)。


# 与组织和组织单位共享 AMI
<a name="share-amis-with-organizations-and-OUs"></a>

 [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_integrate_services_list.html) 是一项账户管理服务，可让您将多个 AWS 账户 整合到您创建并集中管理的组织中。除了[与特定账户共享 AMI](sharingamis-explicit.md) 之外，您还可以与您创建的企业或企业部门 (OU) 共享 AMI。

组织是指您创建用于整合和集中管理您的 AWS 账户 的实体。您可以以分层树状结构来组织账户，将[根](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html#root)放在树顶部，并将[组织单位](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html#organizationalunit)嵌套在组织根下。每个账户都可以直接添加到根中，也可以放在层次结构的其中一个 OU 中。有关更多信息，请参阅《AWS 用户指南》[https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html)中的 *AWS Organizations Organizations 术语和概念*。

当您与企业或 OU 共享 AMI 时，所有子账户都可以访问该 AMI。例如，在下图中，AMI 与顶层 OU 共享（由数字 **1** 处的箭头指示）。嵌套在该顶层 OU 下面的所有 OU 和账户（由数字 **2** 处的虚线指示）还可以访问 AMI。组织中的账户和 OU 在虚线之外的账户（由数字 **3** 指示）没有访问该 AMI 的权限，因为它们不是 AMI 共享的 OU 的子级账户。

![AMI 与 OU 共享，所有子级 OU 和账户都可以访问 AMI。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ami-share-with-orgs-and-ous.png)


**Topics**
+ [注意事项](#considerations-org-ou)
+ [获取组织或组织单位的 ARN](get-org-ou-ARN.md)
+ [允许企业和 OU 使用 KMS 密钥](allow-org-ou-to-use-key.md)
+ [管理与组织或 OU 共享的 AMI](share-amis-org-ou-manage.md)

## 注意事项
<a name="considerations-org-ou"></a>

在与特定企业或企业部门共享 AMI 时，请考虑以下事项。
+ **所有权** – 若要共享 AMI，您的 AWS 账户 必须拥有 AMI。
+ **共享限制** – AMI 拥有者可以与任何组织或 OU 共享 AMI，包括他们不是其成员的组织和 OU。

  有关某一区域内可以共享 AMI 的最大实体数量，请参阅 [Amazon EC2 服务限额](https://docs.aws.amazon.com/general/latest/gr/ec2-service.html#limits_ec2)。
+ **标签** – 您无法共享用户定义的标签（附加到 AMI 的标签）。共享 AMI 时，与其共享 AMI 的组织或 OU 中的 AWS 账户 的任何用户均无法使用用户定义的标签。
+ **ARN 格式** – 在命令中指定企业或 OU 时，请确保使用正确的 ARN 格式。如果只指定 ID，例如，如果您仅指定 `o-123example` 或 `ou-1234-5example`，则会出现错误。

  正确的 ARN 格式：
  + 企业 ARN：`arn:aws:organizations::{{111122223333}}:organization/{{organization-id}}`
  + OU ARN：`arn:aws:organizations::{{111122223333}}:ou/{{organization-id}}/{{ou-id}}`

  其中：
  + {{`111122223333`}} 举例说明管理账户的 12 位账户 ID。如果您不知道管理账号，您可以描述企业或企业部门以获取 ARN，其中包括管理账号。有关更多信息，请参阅 [获取组织或组织单位的 ARN](get-org-ou-ARN.md)。
  + {{`organization-id`}} 是企业 ID，例如 。`o-123example`
  + {{`ou-id`}} 是企业部门 ID，例如 。`ou-1234-5example`

  有关 ARN 格式的更多信息，请参阅 *IAM 用户指南*中的 [Amazon 资源名称(ARN)](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html)。
+ **加密和密钥** – 您可以共享由未加密和加密快照支持的 AMI。
  + 加密快照必须使用客户托管式密钥加密。您无法共享由使用默认 AWS 托管式密钥加密的快照支持的 AMI。
  + 如果您共享由加密快照支持的 AMI，则必须允许企业或 OU 使用用于加密快照的客户托管式密钥。有关更多信息，请参阅 [允许企业和 OU 使用 KMS 密钥](allow-org-ou-to-use-key.md)。
+ **区域** – AMI 是一种区域性资源。当您共享 AMI 时，则它只能在您共享该 AMI 的区域使用。要使 AMI 能够在其他区域使用，请将该 AMI 复制到该区域并进行共享。有关更多信息，请参阅 [复制 Amazon EC2 AMI](CopyingAMIs.md)。
+ **使用** – 当您共享 AMI 时，用户只能从该 AMI 启动实例。他们无法删除、共享或修改实例。但是，在他们使用您的 AMI 启动实例后，他们可以从其启动的实例创建 AMI。
+ **账单** – 当其他 AWS 账户 使用您的 AMI 启动实例时，您无需付费。使用 AMI 启动实例的账户将为它们启动的实例付费。
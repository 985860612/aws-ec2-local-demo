

# 用于 EC2 Fast Launch 的服务相关角色
<a name="slr-windows-fast-launch"></a>

Amazon EC2 使用服务相关角色获取代表您调用其他 AWS 服务 所需的权限。服务相关角色是一种独特类型的 IAM 角色，它与 AWS 服务 直接相关。服务相关角色提供了一种将权限委托给 AWS 服务 的安全方式，因为只有相关服务才能担任服务相关角色。有关 Amazon EC2 如何使用 IAM 角色的更多信息，请参阅 [适用于 Amazon EC2 的 IAM 角色](iam-roles-for-amazon-ec2.md)。

Amazon EC2 使用名为 AWSServiceRoleForEC2FastLaunch 的服务相关角色创建和管理一组预置快照，从而减少从 Windows AMI 启动实例所需的时间。

## 授予的权限AWSServiceRoleForEC2FastLaunch
<a name="slr-permissions-granted-win-faster-launching"></a>

AWSServiceRoleForEC2FastLaunch 服务相关角色仅信任以下服务来担任该角色：
+ `ec2fastlaunch.amazonaws.com`

Amazon EC2 使用 [EC2FastLaunchServiceRolePolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/EC2FastLaunchServiceRolePolicy.html) 托管式策略完成以下操作：
+ **AWS CloudFormation**：允许 EC2 Fast Launch 获取关联的 CloudFormation 堆栈的描述。
+ **Amazon CloudWatch**：将与 EC2 Fast Launch 关联的指标数据发布到 Amazon EC2 命名空间。
+ **Amazon EC2**：授予 EC2 Fast Launch 执行以下操作的权限：
  + 从启用了 EC2 Fast Launch 的 Amazon EC2 Windows Server AMI 启动实例，以执行预置步骤。此外，还需要指定资源模式以允许对关联到 License Manager 的 AMI 执行 `ec2:RunInstances` 操作。
  + 在 EC2 Fast Launch 创建预调配快照后，停止并终止由其启动的实例。
  + 描述用于从启用了 EC2 Fast Launch 的 Amazon EC2 Windows Server AMI 启动实例的映像和实例类型资源，并利用这些资源创建快照。
  + 描述启动模板资源并从启动模板启动实例。
  + 描述实例、实例属性和实例状态、卷和卷属性。
  + 描述网络接口。
  + 删除 EC2 Fast Launch 创建的资源，包括快照、启动模板、卷和网络接口。
  + 标记 EC2 Fast Launch 为了启动和预调配 Windows 实例的资源，并创建快照以便在最终启动过程中使用。
+ **Amazon EventBridge**：包含创建 EventBridge 事件规则以及检索所创建规则的详细信息或删除规则的权限。EC2 Fast Launch 还可获取接收基于事件规则转发的 EC2 Fast Launch 事件的目标服务列表，以及将目标服务添加到由其创建的事件规则或将其从所创建的规则中移除。
+ **IAM**：允许 EC2 Fast Launch 创建 `EC2FastLaunchServiceRolePolicy` 服务相关角色，获取和使用名称中包含 `ec2fastlaunch` 的实例配置文件，以及使用启动模板中的实例配置文件代表您启动实例。
+ **AWS KMS**：包含创建授权以及列出由 EC2 Fast Launch 创建并且可以停用的授权。还用于描述或使用密钥来加密或解密挂载到 EC2 Fast Launch 所创建实例的卷，以及生成非明文数据密钥。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [EC2FastLaunchServiceRolePolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/EC2FastLaunchServiceRolePolicy.html)**。

有关 Amazon EC2 使用托管式策略的更多信息，请参阅 [AWSAmazon EC2 的 托管式策略](security-iam-awsmanpol.md)。

## 创建服务相关角色
<a name="create-fast-launch-slr"></a>

您无需手动创建该服务相关角色。开始为 AMI 使用 EC2 Fast Launch 时，如果服务相关角色尚不存在，Amazon EC2 将为您创建一个。

如果从账户中删除了该服务相关角色，则可以为另一个 Windows AMI 启用 EC2 Fast Launch，以便在账户中重新创建此角色。或者，您还可以为当前 AMI 禁用 EC2 Fast Launch，然后将其重新启用。但是，禁用该功能会导致您的 AMI 对所有新实例使用标准启动流程，而 Amazon EC2 会删除所有预置快照。删除所有预置快照之后，您可以重新为 AMI 启用 EC2 Fast Launch。

## 访问客户自主管理型密钥
<a name="win-faster-launching-slr-access-to-cust-keys"></a>

要为使用客户自主管理型密钥进行加密的[加密 AMI](AMIEncryption.md) 启用 EC2 Fast Launch，您必须授予 AWSServiceRoleForEC2FastLaunch 角色使用 CMK 的权限。为此，请调用 [create-grant](https://docs.aws.amazon.com/cli/latest/reference/kms/create-grant.html) 命令。对于 `--grantee-principal`，请为账户中的 AWSServiceRoleForEC2FastLaunch 角色指定 ARN。对于 `--operations`，请指定 `CreateGrant`。

```
aws kms create-grant \
    --key-id arn:aws:kms:{{us-east-1}}:{{111122223333}}:key/{{1234abcd-12ab-34cd-56ef-1234567890ab}} \
    --grantee-principal arn:aws:iam::{{111122223333}}:role/AWSServiceRoleForEC2FastLaunch \
    --operations CreateGrant
```

## 编辑服务相关角色
<a name="edit-fast-launch-slr"></a>

Amazon EC2 不允许您编辑 AWSServiceRoleForEC2FastLaunch 服务相关角色。在创建服务相关角色后，您将无法更改角色的名称，因为可能有多种实体引用该角色。但是可以使用 IAM 编辑角色说明。有关更多信息，请参阅《IAM 用户指南》**中的[编辑服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_update-service-linked-role.html)。

## 删除服务相关角色
<a name="delete-fast-launch-slr"></a>

只有在先删除所有相关资源后，才能删除服务相关角色。这可确保您不会无意中删除相关资源的访问权限，从而保护与启用了 EC2 Fast Launch 的 Amazon EC2 Windows Server AMI 关联的 Amazon EC2 资源。

使用 IAM 控制台、AWS CLI 或 AWS API 删除 **AWSServiceRoleForEC2FastLaunch** 服务相关角色。有关更多信息，请参阅《IAM 用户指南》**中的[删除服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage_delete.html#id_roles_manage_delete_slr)。

## 支持的区域
<a name="regions-fast-launch-slr"></a>

Amazon EC2 在所有开放 Amazon EC2 服务的区域均支持 EC2 Fast Launch 服务相关角色。
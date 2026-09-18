

# 竞价型实例请求的服务相关角色
<a name="service-linked-roles-spot-instance-requests"></a>

Amazon EC2 使用服务相关角色获取代表您调用其他AWS服务所需的权限。服务相关角色是一种独特类型的 IAM 角色，它与 AWS 服务 直接相关。服务相关角色提供了一种将权限委托给 AWS 服务 的安全方式，因为只有相关服务才能担任服务相关角色。有关更多信息，请参阅《IAM 用户指南》**中的[服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create-service-linked-role.html)。

Amazon EC2 使用名为 **AWSServiceRoleForEC2Spot** 的服务相关角色代表您启动和管理竞价型实例。

## 授予的权限AWSServiceRoleForEC2Spot
<a name="service-linked-role-permissions-granted-by-AWSServiceRoleForEC2Spot"></a>

Amazon EC2 使用 **Amazon Web Services ServiceRoleForEC2Spot** 完成以下操作：
+ `ec2:DescribeInstances` – 描述竞价型实例
+ `ec2:StopInstances` – 停止竞价型实例
+ `ec2:StartInstances` – 启动竞价型实例

## 创建服务相关角色
<a name="service-linked-role-creating-for-spot"></a>

在大多数情况下，无需手动创建服务相关角色。Amazon EC2 在您首次使用控制台请求 Spot 实例时创建 **Amazon Web Services ServiceRoleForEC2Spot** 服务相关角色。

如果在 2017 年 10 月之前具有活动Spot 实例请求（此时 Amazon EC2 开始支持该服务相关角色），则 Amazon EC2 在您的AWS账户中创建 **Amazon Web Services ServiceRoleForEC2Spot** 角色。有关更多信息，请参阅*IAM 用户指南*中的[我的账户中出现新角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_roles.html#troubleshoot_roles_new-role-appeared)。

如果您使用 AWS CLI 或 API 来请求竞价型实例，则必须确保此角色存在。

**要使用控制台创建 **Amazon Web Services ServiceRoleForEC2Spot****

1. 通过以下网址打开 IAM 控制台：[https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/)。

1. 在导航窗格中，选择 **Roles**（角色）。

1. 选择**创建角色**。

1. 在 **Select type of trusted entity (选择受信任实体的类型)** 页面上，依次选择 **EC2**、**EC2 - Spot Instances (EC2 -竞价型实例)** 和 **Next: Permissions (下一步: 权限)**。

1. 在下一页上，选择 **Next:Review（下一步：审核）**。

1. 在 **Review (审核)** 页面上，选择 **Create role (创建角色)**。

**要使用 AWS CLI 创建 **Amazon Web Services ServiceRoleForEC2Spot****  
如下所示使用 [create-service-linked-role](https://docs.aws.amazon.com/cli/latest/reference/iam/create-service-linked-role.html) 命令。

```
aws iam create-service-linked-role --aws-service-name spot.amazonaws.com
```

如果您不再需要使用 Spot 实例，我们建议您删除 **Amazon Web Services ServiceRoleForEC2Spot** 角色。从账户中删除该角色后，如果您请求竞价型实例，Amazon EC2 将再次创建该角色。

## 授予对用于加密的 AMI 和 EBS 快照的客户托管密钥的访问权限
<a name="spot-instance-service-linked-roles-access-to-cmks"></a>

如果为竞价型实例指定[加密的 AMI](AMIEncryption.md) 或加密的 Amazon EBS 快照，并且您使用客户托管密钥进行加密，则必须为 **AWSServiceRoleForEC2Spot** 角色授予使用客户托管密钥的权限，以便 Amazon EC2 可以代表您启动竞价型实例。为此，您必须在客户托管密钥中添加授权，如以下过程中所示。

在提供权限时，授权是密钥策略的替代方法。有关更多信息，请参阅 *AWS Key Management Service 开发人员指南*中的[使用授权](https://docs.aws.amazon.com/kms/latest/developerguide/grants.html)和[在 AWS KMS 中使用密钥策略](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html)。

**为 **Amazon Web Services ServiceRoleForEC2Spot** 角色授予使用客户托管密钥的权限**
+ 使用 [create-grant](https://docs.aws.amazon.com/cli/latest/reference/kms/create-grant.html) 命令在客户托管密钥中添加授权，并指定授予权限的委托人（**Amazon Web Services ServiceRoleForEC2Spot** 服务相关角色），以执行授权允许的操作。客户托管密钥由 `key-id` 参数和客户托管密钥的 ARN 指定。委托人是由 `grantee-principal` 参数和 **Amazon Web Services ServiceRoleForEC2Spot** 服务相关角色的 ARN 指定的。

  ```
  aws kms create-grant \
      --region {{us-east-1}} \
      --key-id arn:aws:kms:{{us-east-1}}:{{444455556666}}:key/{{1234abcd-12ab-34cd-56ef-1234567890ab}} \
      --grantee-principal arn:aws:iam::{{111122223333}}:role/aws-service-role/spot.amazonaws.com/AWSServiceRoleForEC2Spot \
      --operations "Decrypt" "Encrypt" "GenerateDataKey" "GenerateDataKeyWithoutPlaintext" "CreateGrant" "DescribeKey" "ReEncryptFrom" "ReEncryptTo"
  ```
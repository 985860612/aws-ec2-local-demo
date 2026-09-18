

# EC2 实例集先决条件
<a name="ec2-fleet-prerequisites"></a>

**Topics**
+ [启动模板](#ec2-fleet-prerequisites-launch-template)
+ [EC2 实例集的服务相关角色](#ec2-fleet-service-linked-role)
+ [授予对用于加密的 AMI 和 EBS 快照的客户托管密钥的访问权限](#ec2-fleet-service-linked-roles-access-to-cmks)
+ [EC2 实例集用户的权限](#ec2-fleet-iam-users)

## 启动模板
<a name="ec2-fleet-prerequisites-launch-template"></a>

启动模板指定要启动的实例的相关配置信息，例如实例类型和可用区。有关启动模板的更多信息，请参阅[在 Amazon EC2 启动模板中存储实例启动参数](ec2-launch-templates.md)。

## EC2 实例集的服务相关角色
<a name="ec2-fleet-service-linked-role"></a>

`AWSServiceRoleForEC2Fleet` 角色授予 EC2 实例集权限以代表您请求、启动、终止和标记实例。Amazon EC2 使用此服务相关角色来完成以下操作：
+ `ec2:RunInstances` – 启动实例。
+ `ec2:RequestSpotInstances`：请求竞价型实例。
+ `ec2:TerminateInstances` – 终止实例。
+ `ec2:DescribeImages`：描述实例的亚马逊机器映像（AMI）。
+ `ec2:DescribeInstanceStatus`：描述实例的状态。
+ `ec2:DescribeSubnets`：描述实例的子网。
+ `ec2:CreateTags`：将标签添加到 EC2 实例集、实例和卷中。

确保此角色存在，然后才使用 AWS CLI 或 API 来创建 EC2 实例集。

**注意**  
`instant` EC2 实例集不需要此角色。

要创建该角色，请如下使用 IAM 控制台。

**为 EC2 实例集创建 AWSServiceRoleForEC2Fleet 角色**

1. 通过以下网址打开 IAM 控制台：[https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/)。

1. 在导航窗格中，选择 **Roles**（角色）。

1. 选择**创建角色**。

1. 在**选择受信任的实体**页面上，请执行以下操作：

   1. 在**可信实体类型**中选择 **AWS 服务**。

   1. 在**使用案例**下，对于**服务或使用案例**，选择 **EC2 - 实例集**。
**提示**  
请务必选择 **EC2 - 实例集**。如果您选择 **EC2**，则 **EC2 - 实例集**使用案例不会出现在**使用案例**列表中。**EC2 - 实例集**使用案例将自动创建具有所需 IAM 权限的策略，并建议将 **AWSServiceRoleForEC2Fleet** 作为角色名称。

   1. 选择**下一步**。

1. 在**添加权限**页面上，选择**下一步**。

1. 在**命名、检查并创建**页面上，选择**创建角色**。

如果您不再需要使用 EC2 实例集，我们建议您删除 **AWSServiceRoleForEC2Fleet** 角色。当此角色从您的账户中删除后，如果您创建其他实例集，可再次创建此角色。

有关更多信息，请参阅《IAM 用户指南》**中的[服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create-service-linked-role.html)。

## 授予对用于加密的 AMI 和 EBS 快照的客户托管密钥的访问权限
<a name="ec2-fleet-service-linked-roles-access-to-cmks"></a>

如果在 EC2 实例集中指定[加密的 AMI](AMIEncryption.md) 或加密的 Amazon EBS 快照，并且您使用 AWS KMS 密钥进行加密，则必须授予 **AWSServiceRoleForEC2Fleet** 角色使用客户托管式密钥的权限，以便 Amazon EC2 可以代表您启动实例。为此，您必须在客户托管密钥中添加授权，如以下过程中所示。

在提供权限时，授权是密钥策略的替代方法。有关更多信息，请参阅 *AWS Key Management Service 开发人员指南*中的[使用授权](https://docs.aws.amazon.com/kms/latest/developerguide/grants.html)和[在 AWS KMS 中使用密钥策略](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html)。

**为 AWSServiceRoleForEC2Fleet 角色授予使用客户托管密钥的权限**
+ 使用 [create-grant](https://docs.aws.amazon.com/cli/latest/reference/kms/create-grant.html) 命令在客户托管密钥中添加授权，并指定授予权限的主体（**AWSServiceRoleForEC2Fleet** 服务相关角色），以执行授权允许的操作。客户托管密钥由 `key-id` 参数和客户托管密钥的 ARN 指定。主体是由 `grantee-principal` 参数和 **AWSServiceRoleForEC2Fleet** 服务相关角色的 ARN 指定的。

  ```
  aws kms create-grant \
      --region {{us-east-1}} \
      --key-id arn:aws:kms:{{us-east-1}}:{{444455556666}}:key/{{1234abcd-12ab-34cd-56ef-1234567890ab}} \
      --grantee-principal arn:aws:iam::{{111122223333}}:role/AWSServiceRoleForEC2Fleet \
      --operations "Decrypt" "Encrypt" "GenerateDataKey" "GenerateDataKeyWithoutPlaintext" "CreateGrant" "DescribeKey" "ReEncryptFrom" "ReEncryptTo"
  ```

## EC2 实例集用户的权限
<a name="ec2-fleet-iam-users"></a>

如果用户打算创建或管理 EC2 实例集，请确保为其授予所需权限。

**为 EC2 实例集创建策略**

1. 打开 IAM 控制台：[https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/)。

1. 在导航窗格中，选择**策略**。

1. 选择 **Create policy**。

1. 在**创建策略**页面上，选择 **JSON** 选项卡，将文本替换为以下内容，并选择**查看策略**。

------
#### [ JSON ]

****  

   ```
   {
       "Version":"2012-10-17",		 	 	 
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "ec2:*"
               ],
               "Resource": "*"
           },
           {
               "Effect": "Allow",
               "Action": [
                 "iam:ListRoles",
                 "iam:PassRole",
                 "iam:ListInstanceProfiles"
               ],
               "Resource":"arn:aws:iam::123456789012:role/DevTeam*"
           }
       ]
   }
   ```

------

   `ec2:*` 为用户授予调用所有 Amazon EC2 API 操作的权限。要将用户限制到特定 Amazon EC2 API 操作，请改为指定这些操作。

   用户必须具有相应权限，可以调用 `iam:ListRoles` 操作以枚举现有 IAM 角色、调用 `iam:PassRole` 操作以指定 EC2 实例集角色以及调用 `iam:ListInstanceProfiles` 操作以枚举现有实例配置文件。

   （可选）要允许用户使用 IAM 控制台创建角色或实例配置文件，还必须在策略中添加以下操作：
   + `iam:AddRoleToInstanceProfile`
   + `iam:AttachRolePolicy`
   + `iam:CreateInstanceProfile`
   + `iam:CreateRole`
   + `iam:GetRole`
   + `iam:ListPolicies`

1. 在**查看策略**页面上，输入策略名称和描述，然后选择**创建策略**。

1. 要提供访问权限，请为您的用户、组或角色添加权限：
   + AWS IAM Identity Center 中的用户和群组：

     创建权限集合。按照《AWS IAM Identity Center 用户指南》**中[创建权限集](https://docs.aws.amazon.com/singlesignon/latest/userguide/howtocreatepermissionset.html)的说明进行操作。
   + 通过身份提供者在 IAM 中托管的用户：

     创建适用于身份联合验证的角色。按照《IAM 用户指南》**中[针对第三方身份提供者创建角色（联合身份验证）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp.html)的说明进行操作。
   + IAM 用户：
     + 创建您的用户可以担任的角色。按照《IAM 用户指南》**中[为 IAM 用户创建角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)的说明进行操作。
     + （不推荐使用）将策略直接附加到用户或将用户添加到用户组。按照《IAM 用户指南》**中[向用户添加权限（控制台）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console)中的说明进行操作。
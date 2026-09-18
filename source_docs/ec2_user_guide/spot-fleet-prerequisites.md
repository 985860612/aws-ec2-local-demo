

# 竞价型实例集权限
<a name="spot-fleet-prerequisites"></a>

**重要**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

如果用户打算创建或管理竞价型实例集，您需要为其授予所需权限。

如果您使用 Amazon EC2 控制台创建竞价型实例集，将创建两个名为 `AWSServiceRoleForEC2SpotFleet` 和 `AWSServiceRoleForEC2Spot` 的服务相关角色和一个名为 `aws-ec2-spot-fleet-tagging-role` 的角色，这些角色为竞价型实例集授予代表您请求、启动、终止和标记资源的权限。如果您使用 AWS CLI 或 API，您必须确保这些角色存在。

按照以下说明授予所需的权限并创建角色。

**Topics**
+ [向用户授予竞价型实例集权限](#spot-fleet-iam-users)
+ [竞价型实例集的服务相关角色](#service-linked-roles-spot-fleet-requests)
+ [竞价型实例的服务相关角色](#service-linked-roles-spot-instances)
+ [用于标记竞价型实例集的 IAM 角色](#spot-fleet-service-linked-role)

## 向用户授予竞价型实例集权限
<a name="spot-fleet-iam-users"></a>

如果用户打算创建或管理竞价型实例集，请确保为其授予所需的权限。

**为竞价型实例集创建策略**

1. 通过以下网址打开 IAM 控制台：[https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/)。

1. 在导航窗格中，选择 **Policies**、**Create policy**。

1. 在 **Create policy (创建策略)** 页面上，选择 **JSON**，然后将文本替换为以下内容。

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
                   "ec2:RunInstances",
                   "ec2:CreateTags",
                   "ec2:RequestSpotFleet",
                   "ec2:ModifySpotFleetRequest",
                   "ec2:CancelSpotFleetRequests",
                   "ec2:DescribeSpotFleetRequests",
                   "ec2:DescribeSpotFleetInstances",
                   "ec2:DescribeSpotFleetRequestHistory"
               ],
               "Resource": "*"
           },
           {
               "Effect": "Allow",
               "Action": "iam:PassRole",
               "Resource": "arn:aws:iam::*:role/aws-ec2-spot-fleet-tagging-role"
           },
           {
               "Effect": "Allow",
               "Action": [
                   "iam:CreateServiceLinkedRole",
                   "iam:ListRoles",
                   "iam:ListInstanceProfiles"
               ],
               "Resource": "*"
           }
       ]
   }
   ```

------

   上述示例策略为用户授予多数竞价型实例集使用案例所需的权限。要将用户限制为特定的 API 操作，请仅指定这些 API 操作。

   **所需的 EC2 和 IAM API**

   必须在策略中包含以下 API：
   + `ec2:RunInstances` – 需要其启动竞价型实例集中的实例
   + `ec2:CreateTags` – 需要其标记竞价型实例集请求、实例或卷
   + `iam:PassRole` – 需要其指定竞价型实例集角色
   + `iam:CreateServiceLinkedRole` – 需要其创建服务相关角色
   + `iam:ListRoles` – 需要其枚举现有的 IAM 角色
   + `iam:ListInstanceProfiles` – 需要其枚举现有的实例配置文件
**重要**  
如果您在启动规范或启动模板中为 IAM 实例配置文件指定角色，则必须授予用户将该角色传递给服务的权限。为此，在 IAM policy 中，包括 `"arn:aws:iam::*:role/{{IamInstanceProfile-role}}"` 作为 `iam:PassRole` 操作的资源。有关更多信息，请参阅 *IAM 用户指南*中的[向用户授予将角色传递给 AWS 服务的权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_passrole.html)。

   **竞价型实例集 API**

   根据需要，将以下竞价型实例集 API 操作添加到策略中：
   + `ec2:RequestSpotFleet`
   + `ec2:ModifySpotFleetRequest`
   + `ec2:CancelSpotFleetRequests`
   + `ec2:DescribeSpotFleetRequests`
   + `ec2:DescribeSpotFleetInstances`
   + `ec2:DescribeSpotFleetRequestHistory`

   **可选的 IAM API**

   （可选）要允许用户使用 IAM 控制台创建角色或实例配置文件，您必须在策略中添加以下操作：
   + `iam:AddRoleToInstanceProfile`
   + `iam:AttachRolePolicy`
   + `iam:CreateInstanceProfile`
   + `iam:CreateRole`
   + `iam:GetRole`
   + `iam:ListPolicies`

1. 选择**查看策略**。

1. 在**查看策略**页面上，输入策略名称和描述，然后选择**创建策略**。

1. 要提供访问权限，请为您的用户、组或角色添加权限：
   + AWS IAM Identity Center 中的用户和群组：

     创建权限集合。按照《AWS IAM Identity Center 用户指南》**中[创建权限集](https://docs.aws.amazon.com/singlesignon/latest/userguide/howtocreatepermissionset.html)的说明进行操作。
   + 通过身份提供者在 IAM 中托管的用户：

     创建适用于身份联合验证的角色。按照《IAM 用户指南》**中[针对第三方身份提供者创建角色（联合身份验证）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp.html)的说明进行操作。
   + IAM 用户：
     + 创建您的用户可以担任的角色。按照《IAM 用户指南》**中[为 IAM 用户创建角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)的说明进行操作。
     + （不推荐使用）将策略直接附加到用户或将用户添加到用户组。按照*《IAM 用户指南》*中[向用户添加权限（控制台）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console)中的说明进行操作。

## 竞价型实例集的服务相关角色
<a name="service-linked-roles-spot-fleet-requests"></a>

Amazon EC2 使用服务相关角色获取代表您调用其他AWS服务所需的权限。服务相关角色是一种独特类型的 IAM 角色，它与AWS服务直接相关。服务相关角色提供了一种将权限委托给 AWS 服务的安全方式，因为只有相关服务才能担任服务相关角色。有关更多信息，请参阅《IAM 用户指南》**中的[服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create-service-linked-role.html)。

Amazon EC2 使用名为 **AWSServiceRoleForEC2SpotFleet** 的服务相关角色代表您启动和管理实例。

**重要**  
如果在竞价型实例集中指定[加密的 AMI](AMIEncryption.md) 或加密的 Amazon EBS 快照，则必须为 **AWSServiceRoleForEC2SpotFleet** 角色授予使用该 CMK 的权限，以便 Amazon EC2 可以代表您启动实例。有关更多信息，请参阅[授予对用于加密的 AMI 和 EBS 快照的 CMK 的访问权限](#spot-fleet-service-linked-roles-access-to-cmks)。

### AWSServiceRoleForEC2SpotFleet 授予的权限
<a name="service-linked-role-permissions-granted-by-AWSServiceRoleForEC2SpotFleet"></a>

**AWSServiceRoleForEC2SpotFleet** 角色授予竞价型实例集权限以代表您请求、启动、终止和标记实例。Amazon EC2 使用此服务相关角色来完成以下操作：
+ `ec2:RequestSpotInstances`：请求竞价型实例
+ `ec2:RunInstances` - 启动实例
+ `ec2:TerminateInstances` - 终止实例
+ `ec2:DescribeImages` – 描述实例的亚马逊机器映像（AMI）
+ `ec2:DescribeInstanceStatus` - 监控实例的状态。
+ `ec2:DescribeSubnets` - 描述实例的子网
+ `ec2:CreateTags` – 在竞价型实例集请求、实例和卷中添加标签
+ `elasticloadbalancing:RegisterInstancesWithLoadBalancer` - 将指定的实例添加到指定的负载均衡器
+ `elasticloadbalancing:RegisterTargets` - 向指定目标组注册指定目标

### 创建服务相关角色
<a name="service-linked-role-creating-for-spot-fleet"></a>

在大多数情况下，无需手动创建服务相关角色。Amazon EC2 在您首次使用控制台创建竞价型实例集时创建 **AWSServiceRoleForEC2SpotFleet** 服务相关角色。

如果在 2017 年 10 月之前具有活动竞价型实例集请求（此时 Amazon EC2 开始支持该服务相关角色），则 Amazon EC2 在您的AWS账户中创建 **AWSServiceRoleForEC2SpotFleet** 角色。有关更多信息，请参阅 *IAM 用户指南*中的[我的AWS账户中出现新角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_roles.html#troubleshoot_roles_new-role-appeared)。

如果您使用 AWS CLI 或 API 来创建竞价型实例集，则必须确保此角色存在。

**使用控制台为竞价型实例集创建 AWSServiceRoleForEC2SpotFleet 角色**

1. 通过以下网址打开 IAM 控制台：[https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/)。

1. 在导航窗格中，选择 **Roles**（角色）。

1. 选择**创建角色**。

1. 在**选择受信任的实体**页面上，请执行以下操作：

   1. 在**可信实体类型**中选择 **AWS 服务**。

   1. 在**使用案例**下，对于**服务或使用案例**，选择 **EC2**。

   1. 对于**使用案例**，选择 **EC2 - 竞价型实例集**。
**注意**  
**EC2 - 竞价型实例集**使用案例将自动创建具有所需 IAM 权限的策略，并建议将 **AWSEC2SpotFleetServiceRolePolicy** 作为角色名称。

   1. 选择**下一步**。

1. 在**添加权限**页面上，选择**下一步**。

1. 在**命名、检查并创建**页面上，选择**创建角色**。

**使用 AWS CLI 为竞价型实例集创建 AWSServiceRoleForEC2SpotFleet 角色**  
如下所示使用 [create-service-linked-role](https://docs.aws.amazon.com/cli/latest/reference/iam/create-service-linked-role.html) 命令。

```
aws iam create-service-linked-role --aws-service-name spotfleet.amazonaws.com
```

如果您不再需要使用竞价型实例集，我们建议您删除 **AWSServiceRoleForEC2SpotFleet** 角色。从您的账户中删除该角色后，如果您使用控制台请求竞价型实例集，Amazon EC2 将再次创建该角色。有关更多信息，请参阅《IAM 用户指南》**中的[删除服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage_delete.html#id_roles_manage_delete_slr)。

### 授予对用于加密的 AMI 和 EBS 快照的 CMK 的访问权限
<a name="spot-fleet-service-linked-roles-access-to-cmks"></a>

如果在竞价型实例集请求中指定[加密的 AMI](AMIEncryption.md) 或加密的 Amazon EBS 快照，并且您使用客户托管的密钥进行加密，则必须为 **AWSServiceRoleForEC2SpotFleet** 角色授予使用该 CMK 的权限，以便 Amazon EC2 可以代表您启动实例。为此，您必须在 CMK 中添加授权，如以下过程中所示。

在提供权限时，授权是密钥策略的替代方法。有关更多信息，请参阅 *AWS Key Management Service 开发人员指南*中的[使用授权](https://docs.aws.amazon.com/kms/latest/developerguide/grants.html)和[在 AWS KMS 中使用密钥策略](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html)。

**为 AWSServiceRoleForEC2SpotFleet 角色授予使用 CMK 的权限**
+ 使用 [create-grant](https://docs.aws.amazon.com/cli/latest/reference/kms/create-grant.html) 命令在 CMK 中添加授权，并指定授予权限的主体（**AWSServiceRoleForEC2SpotFleet** 服务相关角色）以执行授权允许的操作。CMK 是由 `key-id` 参数和 CMK 的 ARN 指定的。主体是由 `grantee-principal` 参数和 **AWSServiceRoleForEC2SpotFleet** 服务相关角色的 ARN 指定的。

  ```
  aws kms create-grant \
      --region {{us-east-1}} \
      --key-id arn:aws:kms:{{us-east-1}}:{{444455556666}}:key/{{1234abcd-12ab-34cd-56ef-1234567890ab}} \
      --grantee-principal arn:aws:iam::{{111122223333}}:role/aws-service-role/spotfleet.amazonaws.com/AWSServiceRoleForEC2SpotFleet \
      --operations "Decrypt" "Encrypt" "GenerateDataKey" "GenerateDataKeyWithoutPlaintext" "CreateGrant" "DescribeKey" "ReEncryptFrom" "ReEncryptTo"
  ```

## 竞价型实例的服务相关角色
<a name="service-linked-roles-spot-instances"></a>

Amazon EC2 使用名为 **AWSServiceRoleForEC2Spot** 的服务相关角色代表您启动和管理竞价型实例。有关更多信息，请参阅[竞价型实例请求的服务相关角色](service-linked-roles-spot-instance-requests.md)。

## 用于标记竞价型实例集的 IAM 角色
<a name="spot-fleet-service-linked-role"></a>

`aws-ec2-spot-fleet-tagging-role` IAM 角色授予竞价型实例集标记竞价型实例集请求、实例和卷的权限。有关更多信息，请参阅 [标记新的或现有的竞价型实例集请求及其启动的实例和卷](tag-spot-fleet.md)。

**重要**  
如果您选择在实例集中标记实例并选择保持目标容量（竞价型实例集请求属于类型 `maintain`），用户与 `IamFleetRole` 的权限差异可能会导致实例集中实例的标记行为不一致。如果 `IamFleetRole` 不包含 `CreateTags` 权限，则可能不会标记由实例集启动的某些实例。虽然我们正在努力修复这种不一致性，但为了确保实例集启动的所有实例都被标记，我们建议您为 `aws-ec2-spot-fleet-tagging-role` 使用 `IamFleetRole` 角色。或者，要使用现有角色，请将 `AmazonEC2SpotFleetTaggingRole` AWS 托管策略附加到现有角色。否则，您需要手动将 `CreateTags` 权限添加到现有策略。

**创建用于标记竞价型实例集的 IAM 角色**

1. 通过以下网址打开 IAM 控制台：[https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/)。

1. 在导航窗格中，选择 **Roles**（角色）。

1. 选择**创建角色**。

1. 在 **Select trusted entity**（选择可信实体）页面中，在 **Trusted entity type**（可信实体类型）下选择 ** service**（AWS 服务）。

1. 在**使用案例**下，从**其他 AWS 服务的使用案例**中选择 **EC2**，然后选择 **EC2 – 竞价型实例集标记**。

1. 选择**下一步**。

1. 在**添加权限**页面上，选择**下一步**。

1. 在 **Name, review, and create**（命名、检查和创建）页面上，对于 **Role name**（角色名称），输入角色的名称（例如 **aws-ec2-spot-fleet-tagging-role**）。

1. 检查此页面上的信息，然后选择 **Create role**（创建角色）。

### 防止跨服务混淆座席
<a name="cross-service-confused-deputy-prevention"></a>

[混淆代理问题](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html)是一个安全问题，即没有执行操作权限的实体可能会迫使更具权限的实体执行该操作。我们建议在 `aws-ec2-spot-fleet-tagging-role` 信任策略中使用 [`aws:SourceArn`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-sourcearn) 和 [`aws:SourceAccount`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-sourceaccount) 全局条件上下文键，以限制竞价型实例集为其他服务提供的资源访问权限。

**将 aws:SourceArn 和 aws:SourceAccount 条件键添加到 `aws-ec2-spot-fleet-tagging-role` 信任策略**

1. 通过以下网址打开 IAM 控制台：[https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/)。

1. 在导航窗格中，选择**角色**。

1. 找到您之前创建的 `aws-ec2-spot-fleet-tagging-role` 并选择链接（而不是复选框）。

1. 在 **Summary**（摘要）下，选择 **Trust relationships**（信任关系）选项卡，然后选择 **Edit trust policy**（编辑信任策略）。

1. 在 JSON 语句中，添加一个包含您的 `aws:SourceAccount` 和 `aws:SourceArn` 全局条件上下文键的 `Condition` 元素，以防止[混淆代理人问题](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html)，如下所示：

   ```
   "Condition": {
         "ArnLike": {
           "aws:SourceArn": "arn:aws:ec2:us-east-1:{{111122223333}}:spot-fleet-request/sfr-*"
         },
         "StringEquals": {
           "aws:SourceAccount": "{{111122223333}}"
         }
   ```
**注意**  
如果 `aws:SourceArn` 值包含账户 ID，并且您同时使用了这两个全局条件上下文键，则 `aws:SourceAccount` 值和 `aws:SourceArn` 值中的账户在同一策略语句中使用时，必须使用相同的账户 ID。

   最终的信任策略将如下所示：

------
#### [ JSON ]

****  

   ```
   {
     "Version":"2012-10-17",		 	 	 
     "Statement": {
       "Sid": "ConfusedDeputyPreventionExamplePolicy",
       "Effect": "Allow",
       "Principal": {
         "Service": "spotfleet.amazonaws.com"
       },
       "Action": "sts:AssumeRole",
       "Condition": {
         "ArnLike": {
           "aws:SourceArn": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:spot-fleet-request/sfr-*"
         },
         "StringEquals": {
           "aws:SourceAccount": "{{111122223333}}"
         }
       }
     }
   }
   ```

------

1. 选择**更新策略**。

下表提供了 `aws:SourceArn` 的潜在值，以根据不同的明确程度限制 `aws-ec2-spot-fleet-tagging-role` 的范围。



| API 操作 | 调用的服务 | 范围 | `aws:SourceArn` | 
| --- | --- | --- | --- | 
| RequestSpotFleet | AWS STS (AssumeRole) | 将 aws-ec2-spot-fleet-tagging-role 上的 AssumeRole 功能限定为指定账户中的竞价型实例集请求。 | arn:aws:ec2:\*:{{123456789012}}:spot-fleet-request/sfr-\* | 
| RequestSpotFleet | AWS STS (AssumeRole) | 将 aws-ec2-spot-fleet-tagging-role 上的 AssumeRole 功能限定为指定账户和指定区域中的竞价型实例集请求。请注意，此角色将不能在其他区域使用。 | arn:aws:ec2:{{us-east-1}}:{{123456789012}}:spot-fleet-request/sfr-\* | 
| RequestSpotFleet | AWS STS (AssumeRole) | 将 aws-ec2-spot-fleet-tagging-role 上的 AssumeRole 功能限定为仅影响实例集 sfr-11111111-1111-1111-1111-111111111111 的操作。请注意，此角色可能无法用于其他竞价型实例集。此外，此角色不能用于通过请求竞价型实例集来启动任何新的竞价型实例集。 | arn:aws:ec2:{{us-east-1}}:{{123456789012}}:spot-fleet-request/sfr-{{11111111-1111-1111-1111-111111111111}} | 
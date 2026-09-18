

# Amazon EC2 基于身份的策略
<a name="iam-policies-for-amazon-ec2"></a>

默认情况下，用户没有创建或修改 Amazon EC2 资源或使用 Amazon EC2 API、Amazon EC2 控制台或 CLI 执行任务的权限。要允许用户创建或修改资源和执行任务，您必须创建 IAM 策略以允许用户使用所需的特定资源和 API 操作，然后将这些策略与需要这些权限的用户、组或 IAM 角色关联起来。

在将策略附加到一个用户、一组用户或角色时，它会授权或拒绝用户使用指定资源执行指定任务。有关 IAM 策略的更多一般信息，请参阅《IAM 用户指南**》中的 [IAM 中的策略与权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)。有关管理和创建 IAM 策略的更多信息，请参阅[管理 IAM 策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage.html)。

IAM 策略必须授予或拒绝使用一个或多个 Amazon EC2 操作的权限。它还必须指定可以用于操作的资源 (可以是所有资源，在某些情况下可以是特定资源)。策略还可以包含应用于资源的条件。

首先，您可以检查 Amazon EC2 的 AWS 托管式策略是否满足您的需求。若不满足，您可以创建自己的自定义策略。有关更多信息，请参阅 [AWSAmazon EC2 的 托管式策略](security-iam-awsmanpol.md)。

**Topics**
+ [策略语法](#policy-syntax)
+ [Amazon EC2 操作](#UsingWithEC2_Actions)
+ [Amazon EC2 API 操作支持的资源级权限](#ec2-supported-iam-actions-resources)
+ [适用于 Amazon EC2 的 Amazon 资源名称（ARN）](#EC2_ARN_Format)
+ [Amazon EC2 的条件键](#amazon-ec2-keys)
+ [使用基于属性的访问控制访问权限](#control-access-with-tags)
+ [向用户、组和角色授予权限](#granting-iam-permissions)
+ [检查用户是否具有所需权限](#check-required-permissions)

## 策略语法
<a name="policy-syntax"></a>

IAM 策略是包含一个或多个语句的 JSON 文档。每个语句的结构如下。

```
{
  "Statement":[{
    "Effect":"{{effect}}",
    "Action":"{{action}}",
    "Resource":"{{arn}}",
    "Condition":{
      "{{condition}}":{
        "{{key}}":"{{value}}"
        }
      }
    }
  ]
}
```

组成语句的各个元素如下：
+ **Effect：**此 *effect* 可以是 `Allow` 或 `Deny`。默认情况下 用户没有使用资源和 API 操作的权限，因此，所有请求均会被拒绝。显式允许将覆盖默认规则。显式拒绝将覆盖任何允许。
+ **Action**：*action* 是对其授予或拒绝权限的特定 API 操作。要了解有关指定 *action* 的信息，请参阅 [Amazon EC2 操作](#UsingWithEC2_Actions)。
+ **Resource**：受操作影响的资源。有些 Amazon EC2 API 操作允许您在策略中包括该操作可以创建或修改的特定资源。您可使用 Amazon 资源名称（ARN）来指定资源，或使用通配符（\*）以指明该语句适用于所有资源。有关更多信息，请参阅 [Amazon EC2 API 操作支持的资源级权限](#ec2-supported-iam-actions-resources)。
+ **Condition**：条件是可选的。它们可以用于控制策略生效的时间。想要了解更多有关为 Amazon EC2 指定条件的信息，请参阅 [Amazon EC2 的条件键](#amazon-ec2-keys)。

有关策略要求的更多信息，请参阅《IAM 用户指南》**中的 [IAM JSON 策略元素参考](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html)。有关适用于 Amazon EC2 的 IAM 策略语句示例，请参阅 [用于控制访问 Amazon EC2 API 的示例策略](ExamplePolicies_EC2.md)。

## Amazon EC2 操作
<a name="UsingWithEC2_Actions"></a>

在 IAM 策略语句中，您可以从支持 IAM 的任何服务中指定任何 API 操作。对于 Amazon EC2，请使用以下前缀为 API 操作命名：`ec2:`。例如：`ec2:RunInstances` 和 `ec2:CreateImage`。

要在单个语句中指定多项操作，请使用逗号将它们隔开，如下所示：

```
"Action": ["ec2:action1", "ec2:action2"]
```

您也可以使用通配符指定多项操作。例如，您可以指定名称以单词“Describe”开头的所有操作，如下所示：

```
"Action": "ec2:Describe*"
```

**注意**  
当前， Amazon EC2 描述 \* API 操作都不支持资源级权限。有关 Amazon EC2 资源级权限更多信息，请参阅 [Amazon EC2 基于身份的策略](#iam-policies-for-amazon-ec2)。

要指定所有 Amazon EC2 API 操作，请使用 \* 通配符，如下所示：

```
"Action": "ec2:*"
```

有关 Amazon EC2 操作的列表，请参阅 [Amazon EC2 *服务授权参考*中定义的操作](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html#amazonec2-actions-as-permissions)。

## Amazon EC2 API 操作支持的资源级权限
<a name="ec2-supported-iam-actions-resources"></a>

*资源级权限*指的是能够指定允许用户对哪些资源执行操作的能力。Amazon EC2 部分支持资源级权限。这意味着对于某些 Amazon EC2 操作，您可以控制何时允许用户执行操作 (基于必须满足的条件)或是允许用户使用的特定资源。例如，您可以向用户授予启动实例的权限，但是仅限特定类型的实例，并且只能使用特定的 AMI。

要在 IAM 策略语句中指定资源，请使用其 Amazon 资源名称（ARN）。有关指定 ARN 值的详细信息，请参阅 [适用于 Amazon EC2 的 Amazon 资源名称（ARN）](#EC2_ARN_Format)。如果 API 操作不支持单个 ARN，则必须使用通配符 (\*) 来指定所有资源都可能受到操作的影响。

要查看标识哪些 Amazon EC2 API 操作支持资源级权限的表，以及您可以在策略中使用的 ARN 和条件键，请参阅 [Amazon EC2 的操作、资源和条件键](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html)。

请记住，您可以在用于 Amazon EC2 API 操作的 IAM 策略中应用基于标签的资源级权限。这可让您更好地控制用户可创建、修改或使用哪些资源。有关更多信息，请参阅[在创建过程中授予标记 Amazon EC2 资源的权限](supported-iam-actions-tagging.md)。

## 适用于 Amazon EC2 的 Amazon 资源名称（ARN）
<a name="EC2_ARN_Format"></a>

每个 IAM 策略语句适用于您使用资源的 ARN 指定的资源。

ARN 的一般语法如下：

```
arn:aws:[service]:[region]:[account-id]:resourceType/resourcePath
```

*服务*  
服务 (例如，`ec2`)。

*region*  
资源所在区域（例如，`us-east-1`）。

*account-id*  
AWS 账户 ID，不包含连字符（例如，`123456789012`）。

*resourceType*  
资源类型 (例如，`instance`)。

*resourcePath*  
识别资源的路径。您可以在路径中使用 \* 通配符。

例如，您可以使用特定实例 (`i-1234567890abcdef0`) 的 ARN 在语句中指定它，如下所示。

```
"Resource": "arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0"
```

您可以使用 \* 通配符指定属于特定账户的所有实例，如下所示。

```
"Resource": "arn:aws:ec2:us-east-1:123456789012:instance/*"
```

还可以使用 \* 通配符指定属于特定账户的所有 Amazon EC2 资源，如下所示。

```
"Resource": "arn:aws:ec2:us-east-1:123456789012:*"
```

要指定所有资源，或者如果特定 API 操作不支持 ARN，请在 `Resource` 元素中使用 \* 通配符，如下所示。

```
"Resource": "*"
```

许多 Amazon EC2 API 操作涉及多种资源。例如，`AttachVolume` 将一个 Amazon EBS 卷附加到一个实例，从而使用户必须获得相应权限才能使用该卷和该实例。要在单个语句中指定多个资源，请使用逗号分隔其 ARN，如下所示。

```
"Resource": ["arn1", "arn2"]
```

有关 Amazon EC2 资源的 ARN 列表，请参阅 [Amazon EC2 定义的资源类型](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html#amazonec2-resources-for-iam-policies)。

## Amazon EC2 的条件键
<a name="amazon-ec2-keys"></a>

在策略语句中，您可以选择性指定控制策略生效时间的条件。每个条件都包含一个或多个键值对。条件键不区分大小写。我们已经定义了 AWS 全局条件键以及其他特定于服务的条件键。

有关 Amazon EC2 的服务特定条件键的列表，请参阅 [Amazon EC2 的条件键](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html#amazonec2-policy-keys)。Amazon EC2 还实施了 AWS 全局条件键。有关更多信息，请参阅 *IAM 用户指南*中的[在所有请求中可用的信息](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_variables.html#policy-vars-infoallreqs)。

所有 Amazon EC2 操作都支持 `aws:RequestedRegion` 和 `ec2:Region` 条件键。有关更多信息，请参阅 [示例：限制对特定区域的访问权限](ExamplePolicies_EC2.md#iam-example-region)。

要在 IAM 策略中使用条件键，请使用 `Condition` 语句。例如，以下策略授予用户添加和删除任何安全组的入站和出站规则的权限。它使用 `ec2:Vpc` 条件键来指定只能对特定 VPC 中的安全组执行这些操作。

------
#### [ JSON ]

****  

```
{
"Version":"2012-10-17",		 	 	 
  "Statement":[{
    "Effect":"Allow",
    "Action": [
       "ec2:AuthorizeSecurityGroupIngress",
       "ec2:AuthorizeSecurityGroupEgress",
       "ec2:RevokeSecurityGroupIngress",
       "ec2:RevokeSecurityGroupEgress"],
     "Resource": "arn:aws:ec2:us-east-1:111122223333:security-group/*",
      "Condition": {
        "StringEquals": {
          "ec2:Vpc": "arn:aws:ec2:us-east-1:111122223333:vpc/vpc-11223344556677889"
        }
      }
    }
  ]
}
```

------

如果您指定了多个条件或在单一条件中指定了多个密钥，我们将通过逻辑 AND 操作对其进行评估。如果您在单一条件中指定了一个具有多个值的密钥，我们将通过逻辑 OR 操作对其进行评估。必须满足所有条件才能授予权限。

在指定条件时，您也可使用占位符。有关更多信息，请参阅 *IAM 用户指南* 中的 [IAM 策略元素：变量和标签](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_variables.html)。

**重要**  
许多条件键是特定于某个资源的，而某些 API 操作会使用多个资源。如果您使用条件键编写策略，请使用语句的 `Resource` 元素指定要应用该条件键的资源。否则，该策略可能会完全阻止用户执行操作，因为针对未应用条件键的资源的条件检查失败。如果您不想指定资源，或者如果您已将策略的 `Action` 元素编写为包含多个 API 操作，则必须使用 `...IfExists` 条件类型以确保对不使用条件键的资源忽略条件键。有关更多信息，请参阅《*IAM 用户指南*》中的 [...IfExists 条件](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Conditions_IfExists)。

**Topics**
+ [ec2:Attribute 条件键](#attribute-key)
+ [ec2:ResourceID 条件键](#imageId-key)
+ [ec2:SourceInstanceARN 条件键](#SourceInstanceARN)

### ec2:Attribute 条件键
<a name="attribute-key"></a>

`ec2:Attribute` 条件键可用于按资源的属性筛选访问权限的条件。

此条件键仅支持原始数据类型（如字符串或整数）的属性，或者仅包含 **Value** 属性的复杂 **[AttributeValue](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AttributeValue.html)** 对象（如 [ ModifyImageAttribute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyImageAttribute.html) API 操作的 **Description** 或 **ImdsSupport** 对象）。条件键不能用于包含多个属性的复杂对象，例如 [ModifyImageAttribute](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyImageAttribute.html) 的 **LaunchPermission** 对象。

例如，以下策略使用 `ec2:Attribute/Description` 条件键按 **ModifyImageAttribute** API 操作的复杂 **Description**（描述）对象筛选访问权限。条件键仅允许将图像描述修改为 `Production` 或 `Development` 的请求。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:ModifyImageAttribute",
      "Resource": "arn:aws:ec2:{{us-east-1}}::image/ami-*",
      "Condition": {
        "StringEquals": {
          "ec2:Attribute/Description": [
            "Production",
            "Development"
          ]
        }
      }
    }
  ]
}
```

------

以下示例策略使用 `ec2:Attribute` 条件键按 ** ModifyImageAttribute** API 操作的主要 **Attribute**（属性）属性筛选访问权限。条件键拒绝尝试修改图像描述的所有请求。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "ec2:ModifyImageAttribute",
      "Resource": "arn:aws:ec2:{{us-east-1}}::image/ami-*",
      "Condition": {
        "StringEquals": {
          "ec2:Attribute": "Description"
        }
      }
    }
  ]
}
```

------

### ec2:ResourceID 条件键
<a name="imageId-key"></a>

通过指定的 API 操作使用以下 `ec2:{{Resource}}ID` 条件键时，条件键值用于指定 API 操作创建的结果资源。`ec2:{{Resource}}ID` 条件键不能用于指定 API 请求中特定的源资源。如果您通过指定 API 使用以下其中一个 `ec2:{{Resource}}ID` 条件键，则必须始终指定通配符 (`*`)。如果您指定不同的值，则在运行期间条件始终解析为 `*`。例如，要通过 **CopyImage** API 使用 `ec2:ImageId` 条件键，则必须按如下方式指定条件键：

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:CopyImage",
      "Resource": "arn:aws:ec2:{{us-east-1}}::image/ami-*",
      "Condition": {
        "StringEquals": {
          "ec2:ImageID": "*"
        }
      }
    }
  ]
}
```

------

我们建议您避免将以下条件键与以下 API 操作一起使用：
+ `ec2:DhcpOptionsID` – `CreateDhcpOptions`
+ `ec2:ImageID` – `CopyImage`、`CreateImage`、`ImportImage` 和 `RegisterImage`
+ `ec2:InstanceID` – `RunInstances` 和 `ImportInstance`
+ `ec2:InternetGatewayID` – `CreateInternetGateway`
+ `ec2:NetworkAclID` – `CreateNetworkAcl`
+ `ec2:NetworkInterfaceID` – `CreateNetworkInterface`
+ `ec2:PlacementGroupName` – `CreatePlacementGroup`
+ `ec2:RouteTableID` – `CreateRouteTable`
+ `ec2:SecurityGroupID` – `CreateSecurityGroup`
+ `ec2:SnapshotID` – `CopySnapshot`、`CreateSnapshot`、`CreateSnapshots` 和 `ImportSnapshots`
+ `ec2:SubnetID` – `CreateSubnet`
+ `ec2:VolumeID` – `CreateVolume` 和 `ImportVolume`
+ `ec2:VpcID` – `CreateVpc`
+ `ec2:VpcPeeringConnectionID` – `CreateVpcPeeringConnection`

要根据特定的资源 ID 筛选访问权限，我们建议您使用 `Resource` 策略元素，如下所示。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:CopyImage",
      "Resource": "arn:aws:ec2:{{us-east-1}}::image/ami-01234567890abcdef"
    }
  ]
}
```

------

### ec2:SourceInstanceARN 条件键
<a name="SourceInstanceARN"></a>

使用 `ec2:SourceInstanceARN` 指定从中发出请求的实例的 ARN。这是一个 [AWS 全局条件密钥](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html)，这意味着您可以将其用于 Amazon EC2 以外的服务。有关策略示例，请参阅[示例：允许特定实例查看其他 AWS 服务中的资源](ExamplePolicies_EC2.md#iam-example-source-instance)。

## 使用基于属性的访问控制访问权限
<a name="control-access-with-tags"></a>

在创建向用户授予使用 EC2 资源的权限的 IAM 策略时，可以在该策略的 `Condition` 元素中包含标签信息，以根据标签控制访问权限。这称为基于属性的访问权限控制（ABAC）。ABAC 可以让您更好地控制用户可以修改、使用或删除哪些资源。有关更多信息，请参阅[什么是适用于 AWS 的 ABAC？](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html)

例如，您可以创建一个策略，允许用户终止实例，但在实例具有 `environment=production` 标签时拒绝此操作。为此，您可以使用 `aws:ResourceTag` 条件键来基于附加到资源的标签允许或拒绝对资源的访问。

```
"StringEquals": { "aws:ResourceTag/environment": "production" }
```

要了解 Amazon EC2 API 操作是否支持使用 `aws:ResourceTag` 条件键控制访问，请参阅 [Amazon EC2 的操作、资源和条件建](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html)。请注意，`Describe` 操作不支持资源级权限，因此，您必须在不带条件的单独语句中指定它们。

有关示例 IAM policies，请参阅 [用于控制访问 Amazon EC2 API 的示例策略](ExamplePolicies_EC2.md)。

如果您基于标签允许或拒绝用户访问资源，则必须考虑显式拒绝用户对相同资源添加或删除这些标签的能力。否则，用户可能通过修改资源标签来绕过您的限制并获得资源访问权限。

## 向用户、组和角色授予权限
<a name="granting-iam-permissions"></a>

要提供访问权限，请为您的用户、组或角色添加权限：
+ AWS IAM Identity Center 中的用户和群组：

  创建权限集合。按照《AWS IAM Identity Center 用户指南》**中[创建权限集](https://docs.aws.amazon.com/singlesignon/latest/userguide/howtocreatepermissionset.html)的说明进行操作。
+ 通过身份提供者在 IAM 中托管的用户：

  创建适用于身份联合验证的角色。按照《IAM 用户指南》**中[针对第三方身份提供者创建角色（联合身份验证）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp.html)的说明进行操作。
+ IAM 用户：
  + 创建您的用户可以担任的角色。按照《IAM 用户指南》**中[为 IAM 用户创建角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)的说明进行操作。
  + （不推荐使用）将策略直接附加到用户或将用户添加到用户组。按照《IAM 用户指南》**中[向用户添加权限（控制台）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console)中的说明进行操作。

## 检查用户是否具有所需权限
<a name="check-required-permissions"></a>

在您创建 IAM 策略后，建议您检查它是否允许用户使用策略生效前所需的特定 API 操作和资源。

首先，创建一个用于测试目的的用户，然后将您创建的 IAM 策略与该测试用户关联起来。然后，以测试用户身份提出请求。

如果您测试的 Amazon EC2 操作创建或修改了一种资源，您在提交请求时应该使用 `DryRun` 参数（或运行带有 `--dry-run` 选项的 AWS CLI 命令）。在这种情况下，调用会完成身份验证检查，但是不会完成该操作。例如，您可以检查用户能否终止特定实例，但不会真的终止它。如果测试用户具有所需的权限，请求会返回 `DryRunOperation`；否则，它会返回 `UnauthorizedOperation`。

如果策略未授予用户您所期望的权限，您可以根据需要调节策略并重新测试，直到您获得预期的结果。

**重要**  
在其生效之前，它需要几分钟时间将策略更改为适合状态。因此，我们建议您在测试策略更新前，等候五分钟的时间。

如果身份验证检查失败，该请求将返回一个带有诊断信息的代码消息。您可以使用 `DecodeAuthorizationMessage` 操作对消息进行解码。有关更多信息，请参阅《AWS Security Token Service API Reference》**中的 [DecodeAuthorizationMessage](https://docs.aws.amazon.com/STS/latest/APIReference/API_DecodeAuthorizationMessage.html)，以及 [decode-authorization-message](https://docs.aws.amazon.com/cli/latest/reference/sts/decode-authorization-message.html)。
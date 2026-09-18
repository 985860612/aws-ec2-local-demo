

# 用于控制对 Amazon EC2 控制台的访问的示例策略
<a name="iam-policies-ec2-console"></a>

您可以使用 IAM 策略向用户授予使用 Amazon EC2 所需的权限。有关分步说明，请参阅《IAM 用户指南》**中的[创建 IAM 策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html)。

控制台使用其他 API 操作实现其功能，因此这些策略可能不会按预期方式起作用。例如，只拥有 `DescribeVolumes` API 操作使用权限的用户在控制台中查看卷时会遇到错误。此部分演示使用户可以使用控制台的特定部分的策略。有关创建 Amazon EC2 控制台的策略的更多信息，请参阅发布的以下AWS安全博客：[授予用户在 Amazon EC2 控制台中工作的权限](https://aws.amazon.com/blogs/security/granting-users-permission-to-work-in-the-amazon-ec2-console/)。

以下示例显示了您可用于向用户授予使用 Amazon EC2 的权限的策略语句。将每个{{用户输入占位符}}替换为您自己的信息。这些策略设计用于采用 AWS 管理控制台 发出的请求。Amazon EC2 控制台可能会调用多个 API 操作来显示单个资源，但在用户尝试执行任务且控制台显示错误之前，这可能并不明显。有关更多信息，请参阅以下 AWS Security Blog 文章：[Granting Users Permission to Work in the Amazon EC2 Console](https://aws.amazon.com/blogs/security/granting-users-permission-to-work-in-the-amazon-ec2-console/)。

**Topics**
+ [只读访问权限](#ex-read-only)
+ [使用 EC2 启动实例向导](#ex-launch-wizard)
+ [使用安全组](#ex-security-groups)
+ [使用弹性 IP 地址](#ex-eip)
+ [使用预留实例](#ex-reservedinstances)

为帮助了解在控制台中执行任务所需的相应 API 操作，您可以使用能够记录调用的服务，例如 AWS CloudTrail。如果您的策略不授予创建或修改特定资源的权限，则控制台显示一个包含诊断信息的编码消息。您可以使用适用于 AWS STS 的 [DecodeAuthorizationMessage](https://docs.aws.amazon.com/STS/latest/APIReference/API_DecodeAuthorizationMessage.html) API 操作或 AWS CLI 中的 [decode-authorization-message](https://docs.aws.amazon.com/cli/latest/reference/sts/decode-authorization-message.html) 命令对该消息解码。

## 示例：只读访问权限
<a name="ex-read-only"></a>

要允许用户在 Amazon EC2 控制台中查看所有资源，您可以使用与以下示例相同的策略：[示例：只读访问权限](ExamplePolicies_EC2.md#iam-example-read-only)用户无法对这些资源执行任何操作或创建新资源 (除非其他语句为用户授予执行此操作的权限)。

**查看实例、AMI 和快照**

或者，您可以提供对资源子集的只读访问权限。为此，请对每个资源将 `ec2:Describe` API 操作中的 \* 通配符替换为特定 `ec2:Describe` 操作。以下策略允许用户在 Amazon EC2 控制台中查看所有实例、AMI 和快照。`ec2:DescribeTags` 操作允许用户查看公用 AMI。控制台需要标记信息来显示公用 AMI；但是，您可以删除此操作以允许用户只查看私有 AMI。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [{
      "Effect": "Allow",
      "Action": [
         "ec2:DescribeInstances", 
         "ec2:DescribeImages",
         "ec2:DescribeTags", 
         "ec2:DescribeSnapshots"
      ],
      "Resource": "*"
   }
   ]
}
```

------

**注意**  
Amazon EC2 `ec2:Describe*` API 操作不支持资源级权限，因此您无法控制用户可以在控制台中查看哪些单个资源。因此，在以上语句的 `Resource` 元素中需要 \* 通配符。有关哪些 ARN 可用于哪些 Amazon EC2 API 操作的更多信息，请参阅 [Amazon EC2 的操作、资源和条件键](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html)。

**查看实例和 CloudWatch 指标**

以下策略允许用户在 Amazon EC2 控制台中查看实例，以及在 **Instances** 页面的 **Monitoring** 选项卡中查看 CloudWatch 警报和指标。Amazon EC2 控制台使用 CloudWatch API 显示警报和指标，因此您必须授权用户执行 `cloudwatch:DescribeAlarms`、`cloudwatch:DescribeAlarmsForMetric`、`cloudwatch:ListMetrics`、`cloudwatch:GetMetricStatistics` 和 `cloudwatch:GetMetricData` 操作。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [{
      "Effect": "Allow",
      "Action": [
         "ec2:DescribeInstances",
         "ec2:DescribeInstanceTypes",
         "cloudwatch:DescribeAlarms",
         "cloudwatch:DescribeAlarmsForMetric",
         "cloudwatch:ListMetrics",
         "cloudwatch:GetMetricStatistics",
         "cloudwatch:GetMetricData"
      ],
      "Resource": "*"
   }
   ]
}
```

------

## 示例：使用 EC2 启动实例向导
<a name="ex-launch-wizard"></a>

Amazon EC2 启动实例向导是一个屏幕，其中包含用于配置和启动实例的选项。您的策略必须包含允许用户使用向导选项的 API 操作使用权限。如果您的策略不包含使用这些操作的权限，则向导中的一些项目无法正确加载，用户无法完成启动。

**启动实例向导基本访问权限**

要成功完成启动，必须为用户授予使用 `ec2:RunInstances` API 操作以及至少以下 API 操作的权限：
+ `ec2:DescribeImages`：查看并选择 AMI。
+ `ec2:DescribeInstanceTypes`：查看并选择一种实例类型。
+ `ec2:DescribeVpcs`：查看可用网络选项。
+ `ec2:DescribeSubnets`：查看所选 VPC 的所有可用子网。
+ `ec2:DescribeSecurityGroups` 或 `ec2:CreateSecurityGroup`：查看并选择现有安全组，或者创建新的安全组。
+ `ec2:DescribeKeyPairs` 或 `ec2:CreateKeyPair`：选择现有密钥对，或者创建新密钥对。
+ `ec2:AuthorizeSecurityGroupIngress`：添加入站规则。

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
                "ec2:DescribeInstances",
                "ec2:DescribeImages",
                "ec2:DescribeInstanceTypes",
                "ec2:DescribeKeyPairs",
                "ec2:DescribeVpcs",
                "ec2:DescribeSubnets",
                "ec2:DescribeSecurityGroups",
                "ec2:CreateSecurityGroup",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:CreateKeyPair"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "ec2:RunInstances",
            "Resource": "*"
        }
    ]
}
```

------

您可以向策略添加 API 操作以便为用户提供更多选项，例如：
+ `ec2:DescribeAvailabilityZones`：查看并选择特定可用区。
+ `ec2:DescribeNetworkInterfaces`：查看并选择所选子网的现有网络接口。
+ 要向 VPC 安全组添加出站规则，必须为用户授予使用 `ec2:AuthorizeSecurityGroupEgress` API 操作的权限。要修改或删除现有规则，必须为用户授予使用相关 `ec2:RevokeSecurityGroup*` API 操作的权限。
+ `ec2:CreateTags`：标记通过 创建的资源。`RunInstances`有关更多信息，请参阅 [在创建过程中授予标记 Amazon EC2 资源的权限](supported-iam-actions-tagging.md)。如果用户没有使用此操作的权限而又尝试在启动实例向导的标记页上应用标签，则启动失败。
**重要**  
启动实例时指定 **Name**（名称）会创建一个标签并需要 `ec2:CreateTags` 操作。向用户授予使用 `ec2:CreateTags` 操作的权限时请谨慎，因为这样做会限制您使用 `aws:ResourceTag` 条件键限制用户使用其他资源的功能。如果您授予用户使用 `ec2:CreateTags` 操作的权限，则他们可以更改资源的标签以绕过这些限制。有关更多信息，请参阅 [使用基于属性的访问控制访问权限](iam-policies-for-amazon-ec2.md#control-access-with-tags)。
+ 要在选择 AMI 时使用 Systems Manager 参数，您必须将 `ssm:DescribeParameters` 和 `ssm:GetParameters` 添加到 IAM 策略中。`ssm:DescribeParameters` 会授予用户查看和选择 Systems Manager 参数的权限。`ssm:GetParameters` 则会授予用户获取 Systems Manager 参数值的权限。您还可以限制对特定 Systems Manager 参数的访问权限。有关更多信息，请参阅本节后文中的**限制对特定 Systems Manager 参数的访问**。

当前，Amazon EC2 `Describe*` API 操作不支持资源级权限，因此您无法限制用户可以在启动实例向导中查看的单个资源。但是，您可以对 `ec2:RunInstances` API 操作应用资源级权限，以限制用户可以用于启动实例的资源。如果用户选择未授权他们使用的选项，则启动会失败。

**限制对特定实例类型、子网和区域的访问**

以下策略允许用户使用 Amazon 拥有的 AMI 启动 `t2.micro` 实例，并且仅在特定子网 (`subnet-1a2b3c4d`) 中启动。用户只能在指定区域中启动。如果用户在启动实例向导中选择不同区域或选择不同实例类型、AMI 或子网，则启动会失败。

第一条语句为用户授予权限以查看启动实例向导中的选项或创建新选项，如上例所示。第二条语句为用户授予将网络接口、卷、密钥对、安全组和子网资源 (在 VPC 中启动实例需要这些资源) 用于 `ec2:RunInstances` 操作的权限。有关使用 `ec2:RunInstances` 操作的更多信息，请参阅 [启动实例 (RunInstances)](ExamplePolicies_EC2.md#iam-example-runinstances)。第三和第四条语句分别为用户授予权限以使用实例（仅当实例是 `t2.micro` 实例时）和 AMI 资源（仅当 AMI 由 Amazon 或某些受信任或经过验证的合作伙伴所有时）。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [{
      "Effect": "Allow",
      "Action": [
         "ec2:DescribeInstances",
         "ec2:DescribeImages",
         "ec2:DescribeInstanceTypes",
         "ec2:DescribeKeyPairs", 
         "ec2:CreateKeyPair", 
         "ec2:DescribeVpcs", 
         "ec2:DescribeSubnets", "ec2:DescribeSecurityGroups", 
         "ec2:CreateSecurityGroup", 
         "ec2:AuthorizeSecurityGroupIngress"
	  ],
	  "Resource": "*"
   },
   {
      "Effect": "Allow",
      "Action":"ec2:RunInstances",
      "Resource": [
         "arn:aws:ec2:{{us-east-2}}:{{111122223333}}:network-interface/*",
         "arn:aws:ec2:{{us-east-2}}:{{111122223333}}:volume/*",
         "arn:aws:ec2:{{us-east-2}}:{{111122223333}}:key-pair/*",
         "arn:aws:ec2:{{us-east-2}}:{{111122223333}}:security-group/*",
         "arn:aws:ec2:{{us-east-2}}:{{111122223333}}:subnet/{{subnet-1a2b3c4d}}"
      ]
   },
   {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [
         "arn:aws:ec2:{{us-east-2}}:{{111122223333}}:instance/*"
      ],
      "Condition": {
         "StringEquals": {
            "ec2:InstanceType": "{{t2.micro}}"
         }
      }
   },
   {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [ 
            "arn:aws:ec2:{{us-east-2}}::image/ami-*"
      ],
      "Condition": {
         "StringEquals": {
            "ec2:Owner": "amazon"
         }
      }
   }
   ]
}
```

------

**限制对特定 Systems Manager 参数的访问**

以下策略授予访问权限以使用具有特定名称的 Systems Manager 参数。

第一条语句授予用户权限，可在启动实例向导中选择 AMI 时查看 Systems Manager 参数。第二条语句授予用户仅使用名为 `prod-*` 的参数的权限。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [{
      "Effect": "Allow",
      "Action": [
         "ssm:DescribeParameters"
      ],
      "Resource": "*"
   },
   {
      "Effect": "Allow",
      "Action": [
         "ssm:GetParameters"
      ],
     "Resource": "arn:aws:ssm:{{us-east-2}}:{{123456123456}}:parameter/prod-*"
   }
   ]
}
```

------

## 示例：使用安全组
<a name="ex-security-groups"></a>

**查看安全组以及添加和删除规则**

以下策略为用户授予相应的权限，以便在 Amazon EC2 控制台中查看安全组、添加和删除入站和出站规则，以及为具有标签 `Department=Test` 的现有安全组列出并修改规则描述。

在第一条语句中，`ec2:DescribeTags` 操作允许用户在控制台中查看标签，这样，用户更易于识别自己可修改的安全组。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [{
      "Effect": "Allow",
      "Action": [
         "ec2:DescribeSecurityGroups", 
         "ec2:DescribeSecurityGroupRules", 
         "ec2:DescribeTags"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
         "ec2:AuthorizeSecurityGroupIngress", 
         "ec2:RevokeSecurityGroupIngress", 
         "ec2:AuthorizeSecurityGroupEgress", 
         "ec2:RevokeSecurityGroupEgress", 
         "ec2:ModifySecurityGroupRules", 
         "ec2:UpdateSecurityGroupRuleDescriptionsIngress", 
         "ec2:UpdateSecurityGroupRuleDescriptionsEgress"
      ],
      "Resource": [
         "arn:aws:ec2:{{us-east-2}}:{{111122223333}}:security-group/*"
      ],
      "Condition": {
         "StringEquals": {
            "aws:ResourceTag/{{Department}}": "{{Test}}"
         }
      }
   },
   {
      "Effect": "Allow",
      "Action": [
         "ec2:ModifySecurityGroupRules"
      ],
      "Resource": [
         "arn:aws:ec2:{{us-east-2}}:{{111122223333}}:security-group-rule/*"
      ]
   }
]}
```

------

**使用 Create Security Group（创建安全组）对话框**

您可以创建一个策略，以允许用户使用 Amazon EC2 控制台中的 **Create Security Group (创建安全组)** 对话框。要使用此对话框，必须为用户授予使用至少以下 API 操作的权限：
+ `ec2:CreateSecurityGroup`: 创建新安全组。
+ `ec2:DescribeVpcs`查看 **VPC** 列表中的现有 VPC 列表。

借助这些权限，用户可以成功创建新安全组，但是他们不能向其中添加任何规则。要在 **Create Security Group (创建安全组)** 对话框中使用规则，您可以向策略添加以下 API 操作：
+ `ec2:AuthorizeSecurityGroupIngress`：添加入站规则。
+ `ec2:AuthorizeSecurityGroupEgress`：向 VPC 安全组添加出站规则。
+ `ec2:RevokeSecurityGroupIngress`：修改或删除现有入站规则。如果要允许用户使用控制台中的 **Copy to new** 功能，这十分有用。此功能会打开 **Create Security Group (创建安全组)** 对话框，并使用所选安全组的规则进行填充。
+ `ec2:RevokeSecurityGroupEgress`：修改或删除适用于 VPC 安全组的出站规则。若要允许用户修改或删除允许所有出站流量的默认出站规则，这十分有用。
+ `ec2:DeleteSecurityGroup`：适用于无效规则无法保存的情况。控制台首先创建安全组，然后添加指定的规则。如果规则无效，则操作会失败，而控制台会尝试删除安全组。用户仍会停留在“**Create Security Group**”对话框中，这样就能更正无效规则和尝试重新创建安全组。此 API 操作不是必需的，但是如果用户在无权使用它的情况下尝试创建具有无效规则的安全组，则会创建不包含任何规则的安全组，用户必须在之后添加规则。
+ `ec2:UpdateSecurityGroupRuleDescriptionsIngress`：添加或更新入口（入站）安全组规则的描述。
+ `ec2:UpdateSecurityGroupRuleDescriptionsEgress`：添加或更新出口（出站）安全组规则的描述。
+ `ec2:ModifySecurityGroupRules`：修改安全组规则。
+ `ec2:DescribeSecurityGroupRules`：列出安全组规则。

以下策略向用户授予使用 **Create Security Group (创建安全组)** 对话框，以及为与特定 VPC (`vpc-1a2b3c4d`) 关联的安全组创建入站和出站规则的权限。用户可以为 VPC 创建安全组，但是无法向它们添加任何规则。同样，用户无法向不与 VPC `vpc-1a2b3c4d` 关联的任何现有安全组添加任何规则。还向用户授予了在控制台中查看所有安全组的权限。这样，用户更易于识别自己可添加入站规则的安全组。此策略还为用户授予删除与 VPC `vpc-1a2b3c4d` 关联的安全组的权限。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [{
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeSecurityGroups", 
        "ec2:CreateSecurityGroup", 
        "ec2:DescribeVpcs"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DeleteSecurityGroup", 
        "ec2:AuthorizeSecurityGroupIngress", 
        "ec2:AuthorizeSecurityGroupEgress"
      ],
      "Resource": "arn:aws:ec2:{{us-east-2}}:{{111122223333}}:security-group/*",
      "Condition":{
         "ArnEquals": {
            "ec2:Vpc": "arn:aws:ec2:{{us-east-2}}:{{111122223333}}:vpc/{{vpc-1a2b3c4d}}"
         }
      }
    }
   ]
}
```

------

## 示例：使用弹性 IP 地址
<a name="ex-eip"></a>

为了让用户能够查看 Amazon EC2 控制台中的弹性 IP 地址，您必须授予用户使用 `ec2:DescribeAddresses` 操作的权限。

要允许用户使用弹性 IP 地址，可将以下操作添加到您策略中。
+ `ec2:AllocateAddress`：分配弹性 IP 地址。
+ `ec2:ReleaseAddress`: 解除弹性 IP 地址。
+ `ec2:AssociateAddress`：将弹性 IP 地址与实例或网络接口关联。
+ `ec2:DescribeNetworkInterfaces` 和 `ec2:DescribeInstances`：使用 **Associate Address (关联地址)** 屏幕。屏幕显示了您可以将弹性 IP 地址关联到的可用实例或网络接口。
+ `ec2:DisassociateAddress`：取消弹性 IP 地址与实例或网络接口的关联。

以下策略允许用户查看弹性 IP 地址并将其分配给实例和与实例相关联。用户不可以将弹性 IP 地址与网络接口关联、取消弹性 IP 地址的关联或释放弹性 IP 地址。

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
                "ec2:DescribeAddresses",
                "ec2:AllocateAddress",
                "ec2:DescribeInstances",
                "ec2:AssociateAddress"
            ],
            "Resource": "*"
        }
    ]
}
```

------

## 示例：使用预留实例
<a name="ex-reservedinstances"></a>

以下策略允许用户查看和修改账户中的预留实例，同时也能在 AWS 管理控制台 内购买新的预留实例。

此策略允许用户查看账户中的所有预留实例和按需型实例。无法为单个预留实例设置资源级别的权限。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [{
      "Effect": "Allow",
      "Action": [
         "ec2:DescribeReservedInstances", 
         "ec2:ModifyReservedInstances",
         "ec2:PurchaseReservedInstancesOffering", 
         "ec2:DescribeInstances",
         "ec2:DescribeInstanceTypes",
         "ec2:DescribeAvailabilityZones", 
         "ec2:DescribeReservedInstancesOfferings"
      ],
      "Resource": "*"
   }
   ]
}
```

------

必须执行 `ec2:DescribeAvailabilityZones` 操作才能确保 Amazon EC2 控制台可以显示有关您能够购买预留实例的可用区的信息。`ec2:DescribeInstances` 操作不是必须的，但是请确保用户可查看账户内的实例并且能够购买预留实例，以匹配正确的规格。

您可以调整 API 操作，以限制用户访问，例如删除`ec2:DescribeInstances`，而`ec2:DescribeAvailabilityZones`表示用户有只读形式的访问权。
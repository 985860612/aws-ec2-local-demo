

# 用于控制访问 Amazon EC2 API 的示例策略
<a name="ExamplePolicies_EC2"></a>

您可以使用 IAM 策略向用户授予使用 Amazon EC2 所需的权限。有关分步说明，请参阅《IAM 用户指南》**中的[创建 IAM 策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html)。

以下示例显示了您可用于向用户授予使用 Amazon EC2 的权限的策略语句。这些策略设计用于采用 AWS CLI 或 AWS SDK 发出的请求。在以下示例中，将每个 {{user input placeholder}} 替换为您自己的信息。

**Topics**
+ [只读访问权限](#iam-example-read-only)
+ [限制对特定区域的访问](#iam-example-region)
+ [使用实例](#iam-example-instances)
+ [启动实例 (RunInstances)](#iam-example-runinstances)
+ [使用竞价型实例](#iam-example-spot-instances)
+ [使用预留实例](#iam-example-reservedinstances)
+ [标记资源](#iam-example-taggingresources)
+ [使用 IAM 角色](#iam-example-iam-roles)
+ [使用路由表](#iam-example-route-tables)
+ [允许特定实例查看其他 AWS 服务中的资源](#iam-example-source-instance)
+ [使用启动模板](#iam-example-launch-templates)
+ [使用实例元数据](#iam-example-instance-metadata)
+ [使用 Amazon EBS 卷和快照](#iam-example-ebs)

有关用于 Amazon EC2 控制台的策略示例，请参阅 [用于控制对 Amazon EC2 控制台的访问的示例策略](iam-policies-ec2-console.md)。

## 示例：只读访问权限
<a name="iam-example-read-only"></a>

以下策略为用户授予使用名称以 `Describe` 开头的所有 Amazon EC2 API 操作的权限。`Resource` 元素使用通配符表示用户可以通过这些 API 操作指定所有资源。在 API 操作不支持资源级权限的情况下，也需要 \* 通配符。有关哪些 ARN 可用于哪些 Amazon EC2 API 操作的更多信息，请参阅 [Amazon EC2 的操作、资源和条件键](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html)。

用户无权对资源执行任何操作 (除非其他语句为用户授予执行此操作的权限)，因为在默认情况下会对用户拒绝使用 API 操作的权限。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:Describe*",
      "Resource": "*"
    }
   ]
}
```

------

## 示例：限制对特定区域的访问权限
<a name="iam-example-region"></a>

以下策略拒绝用户使用所有 Amazon EC2 API 操作的权限，除非区域为欧洲地区（法兰克福）。该区域使用全局条件键 `aws:RequestedRegion`，所有 Amazon EC2 API 操作均支持此条件键。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
       {
      "Effect": "Deny",
      "Action": "ec2:*",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": "eu-central-1"
        }
      }
    }  
  ]
}
```

------

或者，您也可以使用条件键 `ec2:Region`，此条件键是 Amazon EC2 特定的，所有 Amazon EC2 API 操作均支持它。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
       {
      "Effect": "Deny",
      "Action": "ec2:*",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "ec2:Region": "eu-central-1"
        }
      }
    }  
  ]
}
```

------

## 使用实例
<a name="iam-example-instances"></a>

**Topics**
+ [示例：描述、启动、停止和终止所有实例](#iam-example-instances-all)
+ [示例：描述所有实例，以及仅停止、启动和终止特定实例](#iam-example-instances-specific)

### 示例：描述、启动、停止和终止所有实例
<a name="iam-example-instances-all"></a>

以下策略为用户授予使用 `Action` 元素中指定的 API 操作的权限。`Resource` 元素使用 \* 通配符表示用户可以通过这些 API 操作指定所有资源。在 API 操作不支持资源级权限的情况下，也需要 \* 通配符。有关哪些 ARN 可用于哪些 Amazon EC2 API 操作的更多信息，请参阅 [Amazon EC2 的操作、资源和条件键](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html)。

用户无权使用任何其他 API 操作 (除非其他语句允许用户执行此操作)，因为用户在默认情况下没有使用 API 操作的权限。

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
        "ec2:DescribeKeyPairs", 
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeAvailabilityZones",
        "ec2:RunInstances", 
        "ec2:TerminateInstances",
        "ec2:StopInstances", 
        "ec2:StartInstances"
      ],
      "Resource": "*"
    }
   ]
}
```

------

### 示例：描述所有实例，以及仅停止、启动和终止特定实例
<a name="iam-example-instances-specific"></a>

以下策略允许用户描述所有实例，但只能启动和停止实例 i-1234567890abcdef0 和 i-0598c7d356eba48d7，且只能终止在 `us-east-1` 区域中具有“`purpose=test`”资源标签的实例。

第一条语句为 `Resource` 元素使用 \* 通配符以指示用户可以在操作中指定所有资源；在本例中，用户可以列出所有实例。在 API 操作不支持资源级权限的情况下 (在此情况下，为 `ec2:DescribeInstances`)，也需要 \* 通配符。有关哪些 ARN 可用于哪些 Amazon EC2 API 操作的更多信息，请参阅 [Amazon EC2 的操作、资源和条件键](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html)。

第二条语句为 `StopInstances` 和 `StartInstances` 操作使用资源级权限。特定实例在 `Resource` 元素中通过其 ARN 进行指示。

第三条语句允许用户终止在 `us-east-1` 区域中属于指定 AWS 账户的所有实例（但仅在实例具有 `"purpose=test"` 标签的情况下）。当策略语句生效时，`Condition` 元素具备资格。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [
   {
   "Effect": "Allow",
      "Action": "ec2:DescribeInstances",
      "Resource": "*"
   },
   {
      "Effect": "Allow",
      "Action": [
        "ec2:StopInstances", 
        "ec2:StartInstances"
      ],
      "Resource": [
        "arn:aws:ec2:us-east-1:{{111122223333}}:instance/i-1234567890abcdef0",
        "arn:aws:ec2:us-east-1:{{111122223333}}:instance/i-0598c7d356eba48d7"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "ec2:TerminateInstances",
      "Resource": "arn:aws:ec2:us-east-1:{{111122223333}}:instance/*",
      "Condition": {
         "StringEquals": {
            "aws:ResourceTag/purpose": "test"
         }
      }
   }

   ]
}
```

------

## 启动实例 (RunInstances)
<a name="iam-example-runinstances"></a>

[RunInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RunInstances.html) API 操作可启动一个或多个按需型实例或一个或多个竞价型实例。`RunInstances` 需要 AMI 并创建实例。用户可以在请求中指定键对和安全组。启动到 VPC 中需要子网，会创建网络接口。从 Amazon EBS-backed AMI 启动将创建卷。因此，用户必须具有使用这些 Amazon EC2 资源的权限。您可以创建要求用户对 `RunInstances` 指定可选参数或限制用户针对某个参数使用特定值的策略语句。

有关启动实例所需的资源级权限的更多信息，请参阅 [Amazon EC2 的操作、资源和条件键](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html)。

默认情况下，用户没有描述、启动、停止或终止生成的实例的权限。授予用户管理所生成实例的权限的一种方法是：为每个实例创建一个特定标签，然后创建一个允许用户使用该标签管理实例的语句。有关更多信息，请参阅 [使用实例](#iam-example-instances)。

**Topics**
+ [AMI](#iam-example-runinstances-ami)
+ [实例类型](#iam-example-runinstances-instance-type)
+ [子网](#iam-example-runinstances-subnet)
+ [EBS 卷](#iam-example-runinstances-volumes)
+ [标签](#iam-example-runinstances-tags)
+ [启动模板中的标签](#iam-example-tags-launch-template)
+ [Elastic GPUs](#iam-example-runinstances-egpu)
+ [启动模板](#iam-example-runinstances-launch-templates)

### AMI
<a name="iam-example-runinstances-ami"></a>

以下策略仅允许用户使用指定的 AMI、`ami-9e1670f7` 和 `ami-45cf5c3c` 启动实例。用户无法使用其他 AMI 启动实例（除非其他语句允许用户执行此操作）。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [
   {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [
        "arn:aws:ec2:{{us-east-1}}::image/ami-9e1670f7",
        "arn:aws:ec2:{{us-east-1}}::image/ami-45cf5c3c",
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*",
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:volume/*",
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:key-pair/*",
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:security-group/*",
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:subnet/*",
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:network-interface/*"
      ]
    }
   ]
}
```

------

另外，以下策略允许用户从 Amazon 或某些受信任和经过验证的合作伙伴拥有的所有 AMI 启动实例。第一个语句的 `Condition` 元素测试 `ec2:Owner` 是不是 `amazon`。用户无法使用其他 AMI 启动实例（除非其他语句允许用户执行此操作）。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [
         {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [ 
         "arn:aws:ec2:{{us-east-1}}::image/ami-*"
      ],
      "Condition": {
         "StringEquals": {
            "ec2:Owner": "amazon"
         }
      }
   },
   {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [ 
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:subnet/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:volume/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:network-interface/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:key-pair/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:security-group/*"
         ]
      }
   ]
}
```

------

### 实例类型
<a name="iam-example-runinstances-instance-type"></a>

以下策略仅允许用户使用 `t2.micro` 或 `t2.small` 实例类型启动实例，您也可以通过此操作控制成本。用户无法启动更大的实例，因为第一条语句的 `Condition` 元素会测试 `ec2:InstanceType` 是否是 `t2.micro` 或 `t2.small`。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [
        {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*"
      ],
      "Condition": {
         "StringEquals": {
            "ec2:InstanceType": ["t2.micro", "t2.small"]
         }
      }
   },
   {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [
         "arn:aws:ec2:{{us-east-1}}::image/ami-*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:subnet/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:network-interface/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:volume/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:key-pair/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:security-group/*"
         ]
      }
   ]
}
```

------

或者，您也可以创建一个策略，以拒绝用户启动 `t2.micro` 和 `t2.small` 实例类型之外的任何实例的权限。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [
        { 
      "Effect": "Deny",
      "Action": "ec2:RunInstances",
      "Resource": [
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*"
      ],
      "Condition": {
         "StringNotEquals": {
            "ec2:InstanceType": ["t2.micro", "t2.small"]
         }
      }
   },
   {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [
         "arn:aws:ec2:{{us-east-1}}::image/ami-*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:network-interface/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:subnet/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:volume/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:key-pair/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:security-group/*"
         ]
      }
   ]
}
```

------

### 子网
<a name="iam-example-runinstances-subnet"></a>

以下策略仅允许用户使用指定子网 `subnet-{{12345678}}` 启动实例。组无法将实例启动到任何其他子网中 (除非其他语句授予执行此操作的用户权限)。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:subnet/subnet-{{12345678}}",
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:network-interface/*",
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*",
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:volume/*",
        "arn:aws:ec2:{{us-east-1}}::image/ami-*",
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:key-pair/*",
        "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:security-group/*"
      ]
    }
   ]
}
```

------

或者，您也可以创建一个策略，以拒绝用户将实例启动到任何其他子网的权限。该语句通过拒绝创建网络接口的权限来执行此操作，除非指定了子网 `subnet-{{12345678}}`。此拒绝会覆盖创建的任何其他策略以允许将实例启动到其他子网中。

------
#### [ JSON ]

****  

```
{
   "Version":"2012-10-17",		 	 	 
   "Statement": [
         {
      "Effect": "Deny",
      "Action": "ec2:RunInstances",
      "Resource": [
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:network-interface/*"
      ],
      "Condition": {
         "ArnNotEquals": {
            "ec2:Subnet": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:subnet/subnet-{{12345678}}"
         }
      }
   },
   {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [
         "arn:aws:ec2:{{us-east-1}}::image/ami-*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:network-interface/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:subnet/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:volume/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:key-pair/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:security-group/*"
         ]
      }
   ]
}
```

------

### EBS 卷
<a name="iam-example-runinstances-volumes"></a>

仅当实例的 EBS 卷为加密卷时，下面的策略才允许用户启动实例。用户必须从使用加密快照创建的 AMI 启动实例，以确保根卷是加密的。此外，用户在启动期间附加到此实例的任何其他卷也必须是加密的。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
                {
            "Effect": "Allow",
            "Action": "ec2:RunInstances",
            "Resource": [
                "arn:aws:ec2:*:*:volume/*"
            ],
            "Condition": {
                "Bool": {
                    "ec2:Encrypted": "true"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": "ec2:RunInstances",
            "Resource": [
                "arn:aws:ec2:*::image/ami-*",
                "arn:aws:ec2:*:*:network-interface/*",
                "arn:aws:ec2:*:*:instance/*",
                "arn:aws:ec2:*:*:subnet/*",
                "arn:aws:ec2:*:*:key-pair/*",
                "arn:aws:ec2:*:*:security-group/*"
            ]
        }
    ]
}
```

------

### 标签
<a name="iam-example-runinstances-tags"></a>

**在创建时标记实例**

下面的策略允许用户启动实例并在创建期间标记实例。对于应用标签的资源创建操作，用户必须具有使用 `CreateTags` 操作的权限。第二个语句使用 `ec2:CreateAction` 条件键使用户只能在 `RunInstances` 上下文中且只能为实例创建标签。用户无法标记现有资源，并且用户无法使用 `RunInstances` 请求标记卷。

有关更多信息，请参阅[在创建过程中授予标记 Amazon EC2 资源的权限](supported-iam-actions-tagging.md)。

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
         "ec2:RunInstances"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
         "ec2:CreateTags"
      ],
      "Resource": "arn:aws:ec2:us-east-1:{{111122223333}}:instance/*",
      "Condition": {
         "StringEquals": {
             "ec2:CreateAction" : "RunInstances"
          }
       }
    }
  ]
}
```

------

**在创建时使用特定标签标记实例和卷**

下面的策略包含 `aws:RequestTag` 条件键，该条件键要求用户标记使用标签 `RunInstances` 和 `environment=production` 通过 `purpose=webserver` 创建的任何卷。如果用户不传递这些特定标签，或者根本不指定任何标签，则请求失败。

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
         "ec2:RunInstances"
      ],
      "Resource": [
         "arn:aws:ec2:{{us-east-1}}::image/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:subnet/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:network-interface/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:security-group/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:key-pair/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
         "ec2:RunInstances"
      ],
      "Resource": [
          "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:volume/*",
          "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*"
      ],
      "Condition": {
         "StringEquals": {
             "aws:RequestTag/environment": "production" ,
             "aws:RequestTag/purpose": "webserver"
          }
       }
    },
    {
      "Effect": "Allow",
      "Action": [
         "ec2:CreateTags"
      ],
      "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:*/*",
      "Condition": {
         "StringEquals": {
             "ec2:CreateAction" : "RunInstances"
          }
       }
    }
  ]
}
```

------

**在创建时使用至少一个特定标记标记实例和卷**

下面的策略对 `ForAnyValue` 条件使用了 `aws:TagKeys` 修饰符，以指示必须在请求中指定至少一个标签，并且其必须包含键 `environment` 或 `webserver`。标签必须应用于实例及卷。可以在请求中指定任何标签值。

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
         "ec2:RunInstances"
      ],
      "Resource": [
         "arn:aws:ec2:{{us-east-1}}::image/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:subnet/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:network-interface/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:security-group/*",
         "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:key-pair/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
          "ec2:RunInstances"
      ],
      "Resource": [
          "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:volume/*",
          "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*"
      ],
      "Condition": {
          "ForAnyValue:StringEquals": {
              "aws:TagKeys": ["environment","webserver"]
          }
       }
    },
    {
      "Effect": "Allow",
      "Action": [
          "ec2:CreateTags"
      ],
      "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:*/*",
      "Condition": {
          "StringEquals": {
              "ec2:CreateAction" : "RunInstances"
          }
       }
    }
  ]
}
```

------

**如果在创建时标记实例，则必须使用特定标签标记它们**

在下面的策略中，用户不必在请求中指定标签，但如果用户指定标签，则标签必须为 `purpose=test`。不允许使用任何其他标签。用户可以在 `RunInstances` 请求中向任何可标记资源应用标签。

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
         "ec2:RunInstances"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
         "ec2:CreateTags"
      ],
      "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:*/*",
      "Condition": {
         "StringEquals": {
             "aws:RequestTag/purpose": "test",
             "ec2:CreateAction" : "RunInstances"
          },
          "ForAllValues:StringEquals": {
              "aws:TagKeys": "purpose"
          }
       }
    }
  ]
}
```

------

禁止任何人在创建时为 RunInstances 调用标签



------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "AllowRun",
            "Effect": "Allow",
            "Action": [
                "ec2:RunInstances"
            ],
            "Resource": [
                "arn:aws:ec2:us-east-1::image/*",
                "arn:aws:ec2:us-east-1:*:subnet/*",
                "arn:aws:ec2:us-east-1:*:network-interface/*",
                "arn:aws:ec2:us-east-1:*:security-group/*",
                "arn:aws:ec2:us-east-1:*:key-pair/*",
                "arn:aws:ec2:us-east-1:*:volume/*",
                "arn:aws:ec2:us-east-1:*:instance/*",
                "arn:aws:ec2:us-east-1:*:spot-instances-request/*"
            ]
        },
        {
            "Effect": "Deny",
            "Action": "ec2:CreateTags",
            "Resource": "*"
        }
    ]
}
```

------

仅允许为 spot-instances-request 使用特定标签。第二个意外的不一致之处在这里发挥了作用。在正常情况下，不指定标签将导致 Unauthenticated 错误。对于 spot-instances-request，如果没有 spot-instances-request 标签，则不会评估此策略，因此无标签的 Spot on Run 请求将成功。

### 启动模板中的标签
<a name="iam-example-tags-launch-template"></a>

在以下示例中，用户可以启动实例，但前提是他们使用特定的启动模板 (`lt-09477bcd97b0d310e`)。`ec2:IsLaunchTemplateResource` 条件键禁止用户覆盖在启动模板中指定的任何资源。语句的第二部分允许用户在创建时标记实例 — 如果在启动模板中为实例指定了标签，则该语句部分是必需的。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	  
  "Statement": [
   {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": "*",
      "Condition": {
         "ArnLike": {
             "ec2:LaunchTemplate": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/lt-09477bcd97b0d310e" 
          },
          "Bool": {
             "ec2:IsLaunchTemplateResource": "true"
          }
       }
    },
    {
      "Effect": "Allow",
      "Action": [
         "ec2:CreateTags"
      ],
      "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*",
      "Condition": {
         "StringEquals": {
             "ec2:CreateAction" : "RunInstances"
          }
       }
    }
  ]
}
```

------

### Elastic GPUs
<a name="iam-example-runinstances-egpu"></a>

在以下策略中，用户可以启动实例并指定要附加到实例的 Elastic GPU。用户可以在任何区域中启动实例，但他们只能在 `us-east-2` 区域中启动期间附加 Elastic GPU。

`ec2:ElasticGpuType` 条件键确保实例使用 `eg1.medium` 或 `eg1.large` 弹性 GPU 类型。

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
                "ec2:RunInstances"
            ],
            "Resource": [
                "arn:aws:ec2:*:{{111122223333}}:elastic-gpu/*"
            ],
            "Condition": {
                "StringEquals": {
                    "ec2:Region": "us-east-2",
                    "ec2:ElasticGpuType": [
                        "eg1.medium",
                        "eg1.large"
                    ]
                }  
            }
        },
        {
            "Effect": "Allow",
            "Action": "ec2:RunInstances",
            "Resource": [
                "arn:aws:ec2:*::image/ami-*",
                "arn:aws:ec2:*:{{111122223333}}:network-interface/*",
                "arn:aws:ec2:*:{{111122223333}}:instance/*",
                "arn:aws:ec2:*:{{111122223333}}:subnet/*",
                "arn:aws:ec2:*:{{111122223333}}:volume/*",
                "arn:aws:ec2:*:{{111122223333}}:key-pair/*",
                "arn:aws:ec2:*:{{111122223333}}:security-group/*"
            ]
        }
    ]
}
```

------

### 启动模板
<a name="iam-example-runinstances-launch-templates"></a>

在以下示例中，用户可以启动实例，但前提是他们使用特定的启动模板 (`lt-09477bcd97b0d310e`)。用户可以在 `RunInstances` 操作中指定参数以覆盖启动模板中的任何参数。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	  
  "Statement": [
         {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": "*",
      "Condition": {
         "ArnLike": {
             "ec2:LaunchTemplate": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/lt-09477bcd97b0d310e" 
          }
       }
    }
  ]
}
```

------

在该示例中，只有在用户使用启动模板时，他们才能启动实例。该策略使用 `ec2:IsLaunchTemplateResource` 条件键防止用户覆盖启动模板中任何预先存在的 ARN。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	  
  "Statement": [
         {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": "*",
      "Condition": {
         "ArnLike": {
             "ec2:LaunchTemplate": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/*" 
          },
          "Bool": {
             "ec2:IsLaunchTemplateResource": "true"
          }
       }
    }
  ]
}
```

------

以下示例策略允许用户启动实例，但前提是他们使用启动模板。用户无法覆盖请求中的子网和网络接口参数；只能在启动模板中指定这些参数。语句的第一部分使用 [NotResource](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_notresource.html) 元素允许子网和网络接口以外的所有其他资源。语句的第二部分允许子网和网络接口资源，但前提是它们来自于启动模板。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	  
  "Statement": [
        {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "NotResource": ["arn:aws:ec2:{{us-east-1}}:{{111122223333}}:subnet/*",
                      "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:network-interface/*" ],
      "Condition": {
         "ArnLike": {
             "ec2:LaunchTemplate": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/*" 
          }
       }
    },
   {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": ["arn:aws:ec2:{{us-east-1}}:{{111122223333}}:subnet/*",
                   "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:network-interface/*" ],
      "Condition": {
         "ArnLike": {
             "ec2:LaunchTemplate": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/*" 
          },
          "Bool": {
             "ec2:IsLaunchTemplateResource": "true"
          }
       }
    }
  ]
}
```

------

以下示例允许用户启动实例，但前提是他们使用启动模板，并且启动模板具有标签 `Purpose=Webservers`。用户无法覆盖 `RunInstances` 操作中的任何启动模板参数。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	  
  "Statement": [
        {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "NotResource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/*",
      "Condition": {
         "ArnLike": {
             "ec2:LaunchTemplate": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/*" 
          },
         "Bool": {
             "ec2:IsLaunchTemplateResource": "true"
          }
       }
    },
    {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/*",
      "Condition": {
       "StringEquals": {
           "aws:ResourceTag/Purpose": "Webservers" 
        }
       }
     }
  ]
}
```

------

## 使用竞价型实例
<a name="iam-example-spot-instances"></a>

您可以使用 RunInstances 操作创建竞价型实例请求，并在创建时标记竞价型实例请求。要为 RunInstances 指定的资源为 `spot-instances-request`。

在 IAM 策略中评估 `spot-instances-request` 资源，如下所示：
+ 如果您在创建时未标记竞价型实例请求，则 Amazon EC2 不会在 RunInstances 语句中评估 `spot-instances-request` 资源。
+ 如果您在创建时标记竞价型实例请求，则 Amazon EC2 会在 RunInstances 语句中评估 `spot-instances-request` 资源。

因此，对于 `spot-instances-request` 资源，以下规则适用于 IAM 策略：
+ 如果您使用 RunInstances 创建竞价型实例请求，并且您不打算在创建时标记竞价型实例请求，则无需明确允许 `spot-instances-request` 资源；调用将成功。
+ 如果您使用 RunInstances 创建竞价型实例请求并打算在创建时标记竞价型实例请求，则必须在 RunInstances 允许语句中包含 `spot-instances-request` 资源，否则调用将失败。
+ 如果您使用 RunInstances 创建竞价型实例请求并打算在创建时标记竞价型实例请求，则必须在 CreateTags 允许语句中指定 `spot-instances-request` 资源或 `*` 通配符，否则调用将失败。

您可以使用 RunInstances 或 RequestSpotInstances 请求竞价型实例。以下示例 IAM 策略仅在使用 RunInstances 请求竞价型实例时适用。

**示例：使用 RunInstances 请求竞价型实例**

以下策略允许用户使用 RunInstances 操作请求竞价型实例。由 RunInstances 创建的 `spot-instances-request` 资源将请求竞价型实例。

**注意**  
要使用 RunInstances 创建竞价型实例请求，您可以从 `spot-instances-request` 列表中省略 `Resource`（如果您不打算在创建时标记竞价型实例请求）。这是因为，如果在创建时未标记竞价型实例请求，则 Amazon EC2 不会在 RunInstances 语句中评估 `spot-instances-request` 资源。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "AllowRun",
            "Effect": "Allow",
            "Action": [
                "ec2:RunInstances"
            ],
            "Resource": [
                "arn:aws:ec2:us-east-1::image/*",
                "arn:aws:ec2:us-east-1:*:subnet/*",
                "arn:aws:ec2:us-east-1:*:network-interface/*",
                "arn:aws:ec2:us-east-1:*:security-group/*",
                "arn:aws:ec2:us-east-1:*:key-pair/*",
                "arn:aws:ec2:us-east-1:*:volume/*",
                "arn:aws:ec2:us-east-1:*:instance/*",
                "arn:aws:ec2:us-east-1:*:spot-instances-request/*"
            ]
        }
    ]
}
```

------

**警告**  
**不支持 – 示例：拒绝用户使用 RunInstances 请求竞价型实例的权限**  
`spot-instances-request` 资源不支持以下策略。  
以下策略旨在向用户授予启动按需型实例的权限，但拒绝用户请求竞价型实例的权限。由 RunInstances 创建的 `spot-instances-request` 资源是请求竞价型实例的资源。第二个语句旨在拒绝针对 `spot-instances-request` 资源的 RunInstances 操作。但不支持此条件，这是因为，如果在创建时未标记竞价型实例请求，则 Amazon EC2 不会在 RunInstances 语句中评估 `spot-instances-request` 资源。  

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "AllowRun",
            "Effect": "Allow",
            "Action": [
                "ec2:RunInstances"
            ],
            "Resource": [
                "arn:aws:ec2:us-east-1::image/*",
                "arn:aws:ec2:us-east-1:*:subnet/*",
                "arn:aws:ec2:us-east-1:*:network-interface/*",
                "arn:aws:ec2:us-east-1:*:security-group/*",
                "arn:aws:ec2:us-east-1:*:key-pair/*",
                "arn:aws:ec2:us-east-1:*:volume/*",
                "arn:aws:ec2:us-east-1:*:instance/*"
            ]
        },
        {
            "Sid": "DenySpotInstancesRequestsNOTSUPPORTEDDONOTUSE",
            "Effect": "Deny",
            "Action": "ec2:RunInstances",
            "Resource": "arn:aws:ec2:us-east-1:*:spot-instances-request/*"
        }
    ]
}
```

**示例：在创建时标记竞价型实例请求**

以下策略允许用户标记在实例启动期间创建的所有资源。第一个语句允许 RunInstances 创建列出的资源。由 RunInstances 创建的 `spot-instances-request` 资源是请求竞价型实例的资源。第二个语句提供了一个 `*` 通配符，以允许在实例启动时创建所有资源时对其进行标记。

**注意**  
如果您在创建时标记竞价型实例请求，则 Amazon EC2 会在 RunInstances 语句中评估 `spot-instances-request` 资源。因此，您必须明确允许 RunInstances 操作的 `spot-instances-request` 资源，否则调用将失败。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "AllowRun",
            "Effect": "Allow",
            "Action": [
                "ec2:RunInstances"
            ],
            "Resource": [
                "arn:aws:ec2:us-east-1::image/*",
                "arn:aws:ec2:us-east-1:*:subnet/*",
                "arn:aws:ec2:us-east-1:*:network-interface/*",
                "arn:aws:ec2:us-east-1:*:security-group/*",
                "arn:aws:ec2:us-east-1:*:key-pair/*",
                "arn:aws:ec2:us-east-1:*:volume/*",
                "arn:aws:ec2:us-east-1:*:instance/*",
                "arn:aws:ec2:us-east-1:*:spot-instances-request/*"
            ]
        },
        {
            "Sid": "TagResources",
            "Effect": "Allow",
            "Action": "ec2:CreateTags",
            "Resource": "*"
        }
    ]
}
```

------

**示例：拒绝在创建时标记竞价型实例请求**

以下策略拒绝用户标记在实例启动期间创建的资源的权限。

第一个语句允许 RunInstances 创建列出的资源。由 RunInstances 创建的 `spot-instances-request` 资源是请求竞价型实例的资源。第二个语句提供了一个 `*` 通配符，以拒绝在实例启动时创建所有资源时对其进行标记。如果在创建时标记 `spot-instances-request` 或任何其他资源，则 RunInstances 调用将失败。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "AllowRun",
            "Effect": "Allow",
            "Action": [
                "ec2:RunInstances"
            ],
            "Resource": [
                "arn:aws:ec2:us-east-1::image/*",
                "arn:aws:ec2:us-east-1:*:subnet/*",
                "arn:aws:ec2:us-east-1:*:network-interface/*",
                "arn:aws:ec2:us-east-1:*:security-group/*",
                "arn:aws:ec2:us-east-1:*:key-pair/*",
                "arn:aws:ec2:us-east-1:*:volume/*",
                "arn:aws:ec2:us-east-1:*:instance/*",
                "arn:aws:ec2:us-east-1:*:spot-instances-request/*"
            ]
        },
        {
            "Sid": "DenyTagResources",
            "Effect": "Deny",
            "Action": "ec2:CreateTags",
            "Resource": "*"
        }
    ]
}
```

------

**警告**  
**不支持 – 示例：仅在为竞价型实例请求分配了特定标签时允许创建该请求**  
`spot-instances-request` 资源不支持以下策略。  
以下策略旨在向 RunInstances 授予权限以仅在使用特定标签标记竞价型实例请求时创建该请求。  
第一个语句允许 RunInstances 创建列出的资源。  
第二个语句旨在向用户授予权限以仅在竞价型实例请求具有标签 `environment=production` 时创建该请求。如果将此条件应用于由 RunInstances 创建的其他资源，则不指定标签会导致 `Unauthenticated` 错误。但是，如果没有为竞价型实例请求指定标签，则 Amazon EC2 不会在 RunInstances 语句中评估 `spot-instances-request` 资源，这会导致 RunInstances 创建未标记的竞价型实例请求。  
请注意，请指定 `environment=production` 之外的其他标签会导致错误 `Unauthenticated`，这是因为，如果用户标记竞价型实例请求，则 Amazon EC2 会在 RunInstances 语句中评估 `spot-instances-request` 资源。  

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "AllowRun",
            "Effect": "Allow",
            "Action": [
                "ec2:RunInstances"
            ],
            "Resource": [
                "arn:aws:ec2:us-east-1::image/*",
                "arn:aws:ec2:us-east-1:*:subnet/*",
                "arn:aws:ec2:us-east-1:*:network-interface/*",
                "arn:aws:ec2:us-east-1:*:security-group/*",
                "arn:aws:ec2:us-east-1:*:key-pair/*",
                "arn:aws:ec2:us-east-1:*:volume/*",
                "arn:aws:ec2:us-east-1:*:instance/*"
            ]
        },
        {
            "Sid": "RequestSpotInstancesOnlyIfTagIsEnvironmentProductionNOTSUPPORTEDDONOTUSE",
            "Effect": "Allow",
            "Action": "ec2:RunInstances",
            "Resource": "arn:aws:ec2:us-east-1:*:spot-instances-request/*",
            "Condition": {
                "StringEquals": {
                    "aws:RequestTag/environment": "production"
                }
            }
        },
        {
            "Sid": "TagResources",
            "Effect": "Allow",
            "Action": "ec2:CreateTags",
            "Resource": "*"
        }

    ]
}
```

**示例：在为竞价型实例请求分配了特定标签的情况下拒绝创建该请求**

如果使用 `environment=production` 标记了竞价型实例请求，则以下策略将拒绝 RunInstances 创建该请求的权限。

第一个语句允许 RunInstances 创建列出的资源。

第二个语句在竞价型实例请求具有标签 `environment=production` 时拒绝用户创建该请求的权限。指定 `environment=production` 作为标签会导致 `Unauthenticated` 错误。指定其他标签或不指定标签将导致创建竞价型实例请求。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "AllowRun",
            "Effect": "Allow",
            "Action": [
                "ec2:RunInstances"
            ],
            "Resource": [
                "arn:aws:ec2:us-east-1::image/*",
                "arn:aws:ec2:us-east-1:*:subnet/*",
                "arn:aws:ec2:us-east-1:*:network-interface/*",
                "arn:aws:ec2:us-east-1:*:security-group/*",
                "arn:aws:ec2:us-east-1:*:key-pair/*",
                "arn:aws:ec2:us-east-1:*:volume/*",
                "arn:aws:ec2:us-east-1:*:instance/*",
                "arn:aws:ec2:us-east-1:*:spot-instances-request/*"
            ]
        },
        {
            "Sid": "DenySpotInstancesRequests",
            "Effect": "Deny",
            "Action": "ec2:RunInstances",
            "Resource": "arn:aws:ec2:us-east-1:*:spot-instances-request/*",
            "Condition": {
                "StringEquals": {
                    "aws:RequestTag/environment": "production"
                }
            }
        },
        {
            "Sid": "TagResources",
            "Effect": "Allow",
            "Action": "ec2:CreateTags",
            "Resource": "*"
        }
    ]
}
```

------

## 示例：使用预留实例
<a name="iam-example-reservedinstances"></a>

下面的策略向用户授予在账户中查看、修改和购买预留实例的权限。

无法为个别的预留实例设置资源级别的许可。此策略表示用户可以访问账户中的所有预留实例。

`Resource` 元素使用 \* 通配符指示用户可以在操作中指定所有资源；在本例中，他们可以列出并修改账户中的所有 预留实例。他们还可以使用账户凭证购买预留实例。在 API 操作不支持资源级权限的情况下，也需要 \* 通配符。

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
        "ec2:DescribeReservedInstances", 
        "ec2:ModifyReservedInstances",
        "ec2:PurchaseReservedInstancesOffering", 
        "ec2:DescribeAvailabilityZones",
        "ec2:DescribeReservedInstancesOfferings"
      ],
      "Resource": "*"
    }
   ]
}
```

------

要允许用户查看和修改账户中的 预留实例，但不允许购买新的 预留实例，请使用以下命令：

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
        "ec2:DescribeReservedInstances", 
        "ec2:ModifyReservedInstances",
        "ec2:DescribeAvailabilityZones"
      ],
      "Resource": "*"
    }
  ]
}
```

------

## 示例：标记资源
<a name="iam-example-taggingresources"></a>

仅当标签包含键 `CreateTags` 和值 `environment` 时，下面的策略才允许用户使用 `production` 操作向实例应用标签。不允许使用其他标签，并且用户无法为任何其他资源类型添加标签。

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
                "ec2:CreateTags"
            ],
            "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/*",
            "Condition": {
                "StringEquals": {
                    "aws:RequestTag/environment": "production"
                }
            }
        }
    ]
}
```

------

以下策略允许用户标记已具有键为 `owner`、值为用户名的标签的任何可标记资源。此外，用户还必须在请求中指定键为 `anycompany:environment-type`、值为 `test` 或 `prod` 的标签。用户可以在请求中指定其他的标签。

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
                "ec2:CreateTags"
            ],
            "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:*/*",
            "Condition": {
                "StringEquals": {
                    "aws:RequestTag/anycompany:environment-type": ["test","prod"],
                    "aws:ResourceTag/owner": "${aws:username}"
                } 
            }
        }
    ]
}
```

------

您可以创建允许用户删除资源的特定标签的 IAM 策略。例如，当在请求中指定的标签键为 `environment` 或 `cost-center` 时，下面的策略允许用户删除卷的标签。可以为此标签指定任何值，但标签键必须匹配某个指定键。

**注意**  
如果删除资源，则所有与资源相关的标签都将被删除。用户不需要使用 `ec2:DeleteTags` 操作删除具有标签的资源的权限，他们仅需要执行删除操作的权限。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
       {
      "Effect": "Allow",
      "Action": "ec2:DeleteTags",
      "Resource": "arn:aws:ec2:us-east-1:{{111122223333}}:volume/*",
      "Condition": {
        "ForAllValues:StringEquals": {
          "aws:TagKeys": ["environment","cost-center"]
        }
      }
    }
  ]
}
```

------

该策略仅允许用户删除任何资源上的 `environment=prod` 标签，但前提是已使用键为 `owner`、值为用户名的标签标记该资源。用户无法删除资源的任何其他标签。

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
        "ec2:DeleteTags"
      ],
      "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:*/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestTag/environment": "prod",
          "aws:ResourceTag/owner": "${aws:username}"
        },
        "ForAllValues:StringEquals": {
          "aws:TagKeys": ["environment"]
        }
      }
    }
  ]
}
```

------

## 示例：使用 IAM 角色
<a name="iam-example-iam-roles"></a>

以下策略允许用户将 IAM 角色附加、替换到具有标签 `department=test` 的实例或与之分离。替换或分离 IAM 角色需要一个关联 ID，因此该策略还授予用户使用 `ec2:DescribeIamInstanceProfileAssociations` 操作的权限。

用户必须具有使用 `iam:PassRole` 操作的权限，才能将角色传递到实例。

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
        "ec2:AssociateIamInstanceProfile",
        "ec2:ReplaceIamInstanceProfileAssociation",
        "ec2:DisassociateIamInstanceProfile"
      ],
      "Resource": "arn:aws:ec2:us-east-1:{{111122223333}}:instance/*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceTag/department":"test"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "ec2:DescribeIamInstanceProfileAssociations",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::{{111122223333}}:role/DevTeam*"
    }
  ]
}
```

------

以下策略允许用户为所有实例附加或替换 IAM 角色。用户只能附加或替换名称以 `TestRole-` 开头的 IAM 角色。对于 `iam:PassRole` 操作，请确保您指定的是 IAM 角色的名称而不是实例配置文件的名称（如果名称不同）。有关更多信息，请参阅 [实例配置文件](iam-roles-for-amazon-ec2.md#ec2-instance-profile)。

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
                "ec2:AssociateIamInstanceProfile",
                "ec2:ReplaceIamInstanceProfileAssociation"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "ec2:DescribeIamInstanceProfileAssociations",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "arn:aws:iam::{{111122223333}}:role/TestRole-*"
        }
    ]
}
```

------

## 示例：使用路由表
<a name="iam-example-route-tables"></a>

以下策略允许用户添加、删除和替换仅与 VPC `vpc-ec43eb89` 关联的路由表的路由。要为 `ec2:Vpc` 条件键指定 VPC，必须指定 VPC 的完整 ARN。

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
                "ec2:DeleteRoute",
                "ec2:CreateRoute",
                "ec2:ReplaceRoute"
            ],
            "Resource": [
                "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:route-table/*"
            ],
            "Condition": {
                "StringEquals": {
                    "ec2:Vpc": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:vpc/vpc-ec43eb89"
                }
            }
        }
    ]
}
```

------

## 示例：允许特定实例查看其他 AWS 服务中的资源
<a name="iam-example-source-instance"></a>

下面是您可能附加到 IAM 角色的策略的示例。该策略允许实例查看不同 AWS 服务中的资源。它使用 `ec2:SourceInstanceARN` 全局条件键指定从中发出请求的实例必须是实例 `i-093452212644b0dd6`。如果同一个 IAM 角色还与另一个实例关联，则另一个实例无法执行任何这些操作。

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
                "ec2:DescribeVolumes",
                "s3:ListAllMyBuckets",
                "dynamodb:ListTables",
                "rds:DescribeDBInstances"
            ],
            "Resource": [
                "*"
            ],
            "Condition": {
                "ArnEquals": {
                    "ec2:SourceInstanceARN": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:instance/i-093452212644b0dd6"
                }
            }
        }
    ]
}
```

------

## 示例：使用启动模板
<a name="iam-example-launch-templates"></a>

以下策略允许用户创建启动模板版本和修改启动模板，但仅适用于特定的启动模板 (`lt-{{09477bcd97b0d3abc}}`)。用户无法使用其他启动模板。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
   {
      "Action": [
        "ec2:CreateLaunchTemplateVersion",
        "ec2:ModifyLaunchTemplate"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/lt-{{09477bcd97b0d3abc}}"
    }
  ]
}
```

------

以下策略允许用户删除任何启动模板和启动模板版本，但前提是启动模板具有标签 `Purpose`=`Testing`。

------
#### [ JSON ]

****  

```
{
  "Version":"2012-10-17",		 	 	 
  "Statement": [
       {
      "Action": [
        "ec2:DeleteLaunchTemplate",
        "ec2:DeleteLaunchTemplateVersions"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:launch-template/*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceTag/Purpose": "Testing"
        }
      }
    }
  ]
}
```

------

## 使用实例元数据
<a name="iam-example-instance-metadata"></a>

以下策略确保用户只能使用 实例元数据服务版本 2 (IMDSv2) 检索[实例元数据](ec2-instance-metadata.md)。您可以将以下四个策略合并为一个具有四个语句的策略。当合并为一个策略时，您可以将该策略用作服务控制策略 (SCP)。它可以很好地用作应用于现有 IAM 策略的*拒绝*策略（取消和限制现有权限），也可以很好地用作在账户、组织单元（OU）或整个组织间全局应用的 SCP。

**注意**  
以下 RunInstances 元数据选项策略必须与授予主体使用 RunInstances 启动实例的权限的策略结合使用。如果主体没有同时具有 RunInstances 权限，则无法启动实例。有关更多信息，请参阅[使用实例](#iam-example-instances)和[启动实例 (RunInstances)](#iam-example-runinstances) 中的策略。

**重要**  
如果您使用自动扩缩组且需要要求对所有新实例使用 IMDSv2，您的自动扩缩组必须使用*启动模板*。  
当自动扩缩组使用启动模板时，会在创建新自动扩缩组时检查 IAM 主体的 `ec2:RunInstances` 权限。当更新现有自动扩缩组以使用新启动模板或新版本的启动模板时，也会检查这些内容。  
只有在创建或更新正在使用启动模板的自动扩缩组时，才会检查对 `RunInstances` 的 IAM 主体使用 IMDSv1 的限制。对于配置为使用 `Latest` 或 `Default` 启动模板的自动扩缩组，在创建启动模板的新版本时不会检查权限。要检查权限，您必须将自动扩缩组配置为使用*特定版本* 的启动模板。  
通过对创建的新主体使用服务控制策略（SCP）或 IAM 权限边界，请对组织中的所有账户禁用启动配置。对于具有自动扩缩组权限的现有 IAM 主体，请使用此条件键更新其关联策略。要禁用启动配置，请使用值指定为 `"autoscaling:LaunchConfigurationName"` 的 `null` 条件键创建或修改相关 SCP、权限边界或 IAM 策略。
对于新启动模板，请在启动模板中配置实例元数据选项。对于现有启动模板，创建启动模板的新版本，并在新版本中配置实例元数据选项。
在向任何主体授予使用启动模板的权限的策略中，通过指定 `$latest` 来限制 `$default` 和 `"autoscaling:LaunchTemplateVersionSpecified": "true"` 的关联。通过限制只使用特定版本的启动模板，您可以确保使用在其中配置实例元数据选项的版本启动新实例。有关更多信息，请参阅 *Amazon EC2 Auto Scaling API 参考* 中的 [LaunchTemplateSpecification](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_LaunchTemplateSpecification.html)，特别是 `Version` 参数。
对于使用启动配置的自动扩缩组，请将启动配置替换为启动模板。有关更多信息，请参阅《Amazon EC2 Auto Scaling User Guide》**中的 [Migrate your Auto Scaling groups to launch templates](https://docs.aws.amazon.com/autoscaling/ec2/userguide/migrate-to-launch-templates.html)。
对于使用启动模板的自动扩缩组，请确保它使用配置了实例元数据选项的新启动模板，或使用配置了实例元数据选项的新版本的当前启动模板。有关更多信息，请参阅 [update-auto-scaling-group](https://docs.aws.amazon.com/cli/latest/reference/autoscaling/update-auto-scaling-group.html)。

**Topics**
+ [要求使用 IMDSv2](#iam-example-instance-metadata-requireIMDSv2)
+ [拒绝退出 IMDSv2](#iam-example-instance-metadata-denyoptoutIMDSv2)
+ [指定最大跃点数限制](#iam-example-instance-metadata-maxHopLimit)
+ [限制可以修改实例元数据选项的用户](#iam-example-instance-metadata-limit-modify-IMDS-options)
+ [要求从 IMDSv2 检索角色凭证](#iam-example-instance-metadata-require-roles-to-use-IMDSv2-credentials)

### 要求使用 IMDSv2
<a name="iam-example-instance-metadata-requireIMDSv2"></a>

以下策略指定您不能调用 RunInstances API，除非该实例也选择需要使用 IMDSv2（由 `"ec2:MetadataHttpTokens": "required"` 指示）。如果您未指定实例需要 IMDSv2，则在调用 RunInstances API 时会收到 `UnauthorizedOperation` 错误。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
               {
            "Sid": "RequireImdsV2",
            "Effect": "Deny",
            "Action": "ec2:RunInstances",
            "Resource": "arn:aws:ec2:*:*:instance/*",
            "Condition": {
                "StringNotEquals": {
                    "ec2:MetadataHttpTokens": "required"
                }
            }
        }
    ]
}
```

------

### 拒绝退出 IMDSv2
<a name="iam-example-instance-metadata-denyoptoutIMDSv2"></a>

以下策略指定您不能调用 `ModifyInstanceMetadataOptions` API 并允许选择 IMDSv1 或 IMDSv2。如果您调用 `ModifyInstanceMetadataOptions` API，则必须将 `HttpTokens` 属性设置为 `required`。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [{
        "Sid": "DenyIMDSv1HttpTokensModification",
        "Effect": "Deny",
        "Action": "ec2:ModifyInstanceMetadataOptions",
        "Resource": "arn:aws:ec2:*:*:instance/*",
        "Condition": {
            "StringNotEquals": {
                "ec2:Attribute/HttpTokens": "required"
            },
            "Null": {
                "ec2:Attribute/HttpTokens": false
            }
        }
    }]
}
```

------

### 指定最大跃点数限制
<a name="iam-example-instance-metadata-maxHopLimit"></a>

以下策略指定您不能调用 RunInstances API，除非您还指定了跃点限制，且跃点限制不能超过 3。如果您无法执行此操作，则在调用 RunInstances API 时会收到 `UnauthorizedOperation` 错误。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
               {
            "Sid": "MaxImdsHopLimit",
            "Effect": "Deny",
            "Action": "ec2:RunInstances",
            "Resource": "arn:aws:ec2:*:*:instance/*",
            "Condition": {
                "NumericGreaterThan": {
                    "ec2:MetadataHttpPutResponseHopLimit": "3"
                }
            }
        }
    ]
}
```

------

### 限制可以修改实例元数据选项的用户
<a name="iam-example-instance-metadata-limit-modify-IMDS-options"></a>

以下策略仅允许具有 `ec2-imds-admins` 角色的用户对实例元数据选项进行更改。如果除 `ec2-imds-admins` 角色以外的任何主体尝试调用 ModifyInstanceMetadataOptions API，则会收到 `UnauthorizedOperation` 错误。此语句可用于控制 ModifyInstanceMetadataOptions API 的使用；目前对于 ModifyInstanceMetadataOptions API 没有精细访问控制（条件）。

### 要求从 IMDSv2 检索角色凭证
<a name="iam-example-instance-metadata-require-roles-to-use-IMDSv2-credentials"></a>

以下策略指定如果将此策略应用于某个角色，并且该角色由 EC2 服务代入且生成的凭证用于对请求进行签名，则必须由从 IMDSv2 中检索的 EC2 角色凭证对该请求进行签名。否则，它的所有 API 调用都会收到 `UnauthorizedOperation` 错误。此语句/策略可广泛应用，因为如果请求未由 EC2 角色证书签名，则其为无效。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
               {
            "Sid": "RequireAllEc2RolesToUseV2",
            "Effect": "Deny",
            "Action": "*",
            "Resource": "*",
            "Condition": {
                "NumericLessThan": {
                    "ec2:RoleDelivery": "2.0"
                }
            }
        }
    ]
}
```

------

## 使用 Amazon EBS 卷和快照
<a name="iam-example-ebs"></a>

有关使用 Amazon EBS 卷和快照的策略示例，请参阅 [Amazon EBS 的基于身份的策略示例](https://docs.aws.amazon.com/ebs/latest/userguide/security_iam_id-based-policy-examples.html)。
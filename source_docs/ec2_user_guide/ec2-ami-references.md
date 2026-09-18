

# 识别引用指定 AMI 的资源
<a name="ec2-ami-references"></a>

您可以识别引用指定亚马逊机器映像（AMI）的 AWS 资源，无论 AMI 是公共的还是私有的，也无论它们的所有者是谁。这种可见性可帮助您确保资源使用最新的合规 AMI。

**主要优势**

检查 AMI 引用可以帮助您：
+ 审核您账户中 AMI 的使用情况。
+ 检查引用特定 AMI 的位置。
+ 通过更新资源以引用最新的 AMI 来保持合规性。

 

**Topics**
+ [支持的资源](#ec2-ami-references-supported-resources)
+ [AMI 引用检查的工作原理](#how-ami-references-works)
+ [所需的 IAM 权限](#ami-references-required-permissions)
+ [检查 AMI 引用的步骤](#ami-reference-procedures)

## 支持的资源
<a name="ec2-ami-references-supported-resources"></a>

可在以下位置检查 AMI 引用：
+ EC2 实例
+ 启动模板
+ SSM 参数
+ Image Builder 映像配方
+ Image Builder 容器配方

## AMI 引用检查的工作原理
<a name="how-ami-references-works"></a>

**基础操作**

运行 AMI 引用调查时，您可以：
+ 指定要检查的 AMI。
+ 选择要扫描的资源类型。
+ 接收引用指定 AMI 的资源列表。

**资源类型选择**

在控制台中，选择要扫描的资源类型。

在 CLI 中，使用以下一个或两个 CLI 参数指定要扫描的资源类型：
+ `IncludeAllResourceTypes`：扫描所有支持的资源类型。
+ `ResourceTypes`：扫描指定的资源类型。

**响应范围界定**

您可以使用 `ResourceTypes` 参数自定义 `ResourceTypeOptions` 值，从而限定 EC2 实例和启动模板的响应范围。控制台和 `IncludeAllResourceTypes` 参数都使用默认选项值。当 `ResourceTypes` 和 `IncludeAllResourceTypes` 一起使用时，`ResourceTypes` 选项值优先于默认值。

以下是默认值：


| 资源类型 | 范围界定选项 (`OptionName`) | 用途 | `OptionValue` 和控制台的默认值 | 
| --- | --- | --- | --- | 
| EC2 实例 | state-name | 按实例状态筛选 | pending、running、shutting-down、terminated、stopping、stopped（所有状态） | 
| 启动模板 | version-depth | 指定要检查的启动模板版本数（从最新版本开始） | 10（最新版本） | 

## 所需的 IAM 权限
<a name="ami-references-required-permissions"></a>

要使用 DescribeImageReferences API 来识别引用指定 AMI 的资源，您需要以下 IAM 权限来描述资源：
+ `ec2:DescribeInstances`
+ `ec2:DescribeLaunchTemplates`
+ `ec2:DescribeLaunchTemplateVersions`
+ `ssm:DescribeParameters`
+ `ssm:GetParameters`
+ `imagebuilder:ListImageRecipes`
+ `imagebuilder:ListContainerRecipes`
+ `imagebuilder:GetContainerRecipe`

**使用 DescribeImageReferences API 的 IAM 策略示例**  
以下示例策略授予您使用 DescribeImageReferences API 的权限，其中包括描述 EC2 实例、启动模板、Systems Manager 参数、Image Builder 映像配方和 Image Builder 容器配方的权限。

------
#### [ JSON ]

****  

```
{
	"Version":"2012-10-17",		 	 	 
	"Statement": [
		{
			"Effect": "Allow",
			"Action": "ec2:DescribeImageReferences",
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"ec2:DescribeInstances",
				"ec2:DescribeLaunchTemplates",
				"ec2:DescribeLaunchTemplateVersions",
				"ssm:DescribeParameters",
				"ssm:GetParameters",
				"imagebuilder:ListImageRecipes",
				"imagebuilder:ListContainerRecipes",
				"imagebuilder:GetContainerRecipe"
			],
			"Resource": "*",
			"Condition": {
				"ForAnyValue:StringEquals": {
					"aws:CalledVia": [
						"ec2-images.amazonaws.com"
					]
				}
			}
		}
	]
}
```

------

**重要**  
我们强烈建议您使用 AWS 托管策略 [`AmazonEC2ImageReferencesAccessPolicy`](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2ImageReferencesAccessPolicy.html)，而不是自行创建策略。创建仅提供所需权限的自定义 IAM 策略需要时间和专业知识，并且随着新资源类型推出，需要更新。  
`AmazonEC2ImageReferencesAccessPolicy` 托管策略：  
授予使用 DescribeImageReferences API 所需的所有权限（包括描述 EC2 实例、启动模板、Systems Manager 参数以及 Image Builder 容器和映像配方的权限）。
在新的资源类型可用时自动支持它们（在使用 `IncludeAllResourceTypes` 参数时尤其重要）。
您可以将 `AmazonEC2ImageReferencesAccessPolicy` 策略附加到 IAM 身份（用户、组和角色）。  
要查看此策略中包含的权限，请参阅《*AWS 托管式策略参考*》中的 [AmazonEC2ImageReferencesAccessPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2ImageReferencesAccessPolicy.html)。

## 检查 AMI 引用的步骤
<a name="ami-reference-procedures"></a>

使用以下过程确定哪些 AWS 资源正在引用指定的 AMI。

------
#### [ Console ]

**识别引用指定 AMI 的资源**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择一个或多个 AMI 来检查引用。

1. 选择**操作**、**AMI 使用情况**、**查看引用的资源**。

1. 在**查看引用所选 AMI 的资源**页面上：

   1. 对于**资源类型**，选择一种或多种资源类型。

   1. 选择**查看资源**。

1. 此时将出现**引用所选 AMI 的资源**部分。该列表显示引用指定 AMI 的资源。每行提供以下信息：
   + **AMI ID** – 所引用 AMI 的 ID。
   + **资源类型** – 引用 AMI 的资源的资源类型。
   + **资源 ID** – 引用 AMI 的资源的 ID。

------
#### [ AWS CLI ]

**检查特定资源类型的 AMI 引用**  
使用带有 `--resource-types` 参数的 [describe-image-references](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-image-references.html) cmdlet。以下示例检查 EC2 实例（按实例状态限定范围）、启动模板（限定范围为最新 20 个启动模板版本）以及其他特定资源类型。

```
aws ec2 describe-image-references \
    --image-ids {{ami-0abcdef1234567890}} {{ami-1234567890abcdef0}} \
    --resource-types \
        'ResourceType=ec2:Instance,ResourceTypeOptions=[{OptionName=state-name,OptionValues=[{{running}},{{pending}}]}]' \
        'ResourceType=ec2:LaunchTemplate,ResourceTypeOptions=[{OptionName=version-depth,OptionValues=[{{20}}]}]' \
        'ResourceType=ssm:Parameter' \
        'ResourceType=imagebuilder:ImageRecipe' \
        'ResourceType=imagebuilder:ContainerRecipe'
```

下面是示例输出。

```
{
    "ImageReferences": [
        {
            "ImageId": "ami-0abcdef1234567890",
            "ResourceType": "ec2:Instance",
            "Arn": "arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0"
        },
        {
            "ImageId": "ami-1234567890abcdef0",
            "ResourceType": "ec2:LaunchTemplate",
            "Arn": "arn:aws:ec2:us-east-1:123456789012:launch-template/lt-1234567890abcdef0"
        }
    ]
}
```

**检查所有支持的资源类型的 AMI 引用**  
使用带 `--include-all-resource-types` 参数的 [describe-image-references](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-image-references.html) cmdlet。

```
aws ec2 describe-image-references \
    --image-ids {{ami-0abcdef1234567890}} {{ami-1234567890abcdef0}} \
    --include-all-resource-types
```

**检查所有支持的资源类型和特定选项的 AMI 引用**  
使用带 `--include-all-resource-types` 和 `--resource-types` 参数的 [describe-image-references](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-image-references.html) cmdlet。此示例检查所有资源类型，同时将 EC2 实例的响应范围限定为正在运行或待处理的实例。

```
aws ec2 describe-image-references \
    --image-ids {{ami-0abcdef1234567890}} {{ami-1234567890abcdef0}} \
    --include-all-resource-types \
    --resource-types 'ResourceType=ec2:Instance,ResourceTypeOptions=[{OptionName=state-name,OptionValues=[{{running}},{{pending}}]}]'
```

------
#### [ PowerShell ]

**检查特定资源类型的 AMI 引用**  
使用带 `-ResourceType` 参数的 [Get-EC2ImageReference](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageReference.html) cmdlet。以下示例检查 EC2 实例（按实例状态限定范围）、启动模板（限定范围为最新 20 个启动模板版本）以及其他特定资源类型。

```
Get-EC2ImageReference `
    -ImageId '{{ami-0abcdef1234567890}}', '{{ami-1234567890abcdef0}}' `
    -ResourceType @(
        @{
            ResourceType = 'ec2:Instance'
            ResourceTypeOptions = @(
                @{
                    OptionName = 'state-name'
                    OptionValues = @('{{running}}', '{{pending}}')
                }
            )
        },
        @{
            ResourceType = 'ec2:LaunchTemplate'
            ResourceTypeOptions = @(
                @{
                    OptionName = 'version-depth'
                    OptionValues = @('{{20}}')
                }
            )
        },
        @{
            ResourceType = 'ssm:Parameter'
        },
        @{
            ResourceType = 'imagebuilder:ImageRecipe'
        },
        @{
            ResourceType = 'imagebuilder:ContainerRecipe'
        }
    )
```

**检查所有支持的资源类型的 AMI 引用**  
使用带 `-IncludeAllResourceTypes` 参数的 [Get-EC2ImageReference](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageReference.html) cmdlet。

```
Get-EC2ImageReference `
    -ImageId '{{ami-0abcdef1234567890}}', '{{ami-1234567890abcdef0}}' `
    -IncludeAllResourceTypes
```

**检查所有支持的资源类型和特定选项的 AMI 引用**  
使用带 `-IncludeAllResourceTypes` 和 `-ResourceType` 参数的 [Get-EC2ImageReference](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageReference.html) cmdlet。此示例检查所有资源类型，同时将 EC2 实例的响应范围限定为正在运行或待处理的实例。

```
Get-EC2ImageReference `
    -ImageId '{{ami-0abcdef1234567890}}', '{{ami-1234567890abcdef0}}' `
    -IncludeAllResourceTypes `
    -ResourceType @(
        @{
            ResourceType = 'ec2:Instance'
            ResourceTypeOptions = @(
                @{
                    OptionName = 'state-name'
                    OptionValues = @({{'running'}}, '{{pending'}})
                }
            )
        }
    )
```

------
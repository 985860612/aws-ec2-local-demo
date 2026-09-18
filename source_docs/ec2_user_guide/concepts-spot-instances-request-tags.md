

# 标记竞价型实例请求
<a name="concepts-spot-instances-request-tags"></a>

要对您的竞价型实例请求进行分类和管理，您可使用自定义元数据标记它们。您可以在创建竞价型实例请求时或之后为其分配标签。您可以使用 Amazon EC2 控制台或命令行工具分配标签。

在标记竞价型实例请求时，不会自动标记由竞价型实例请求启动的实例和卷。您需要明确标记由竞价型实例请求启动的实例和卷。您可以在启动期间或之后为竞价型实例和卷分配标签。

有关标签的工作原理的更多信息，请参阅[标记 Amazon EC2 资源](Using_Tags.md)。

**Topics**
+ [前提条件](#tag-spot-request-prereqs)
+ [标记新的竞价型实例请求](#tag-new-spot-instance-request)
+ [标记现有竞价型实例请求](#tag-existing-spot-instance-request)
+ [查看竞价型实例请求标记](#view-spot-instance-request-tags)

## 前提条件
<a name="tag-spot-request-prereqs"></a>

授予用户标记资源的权限。有关 IAM policies 和示例策略的更多信息，请参阅[示例：标记资源](ExamplePolicies_EC2.md#iam-example-taggingresources)。

您创建的 IAM policy 由您用于创建竞价型实例请求的方法决定。
+ 如果您使用启动实例向导或 `run-instances` 请求竞价型实例，请参阅[To grant a user the permission to tag resources when using the launch instance wizard or run-instances](#iam-run-instances)。
+ 如果您使用 `request-spot-instances` 命令请求竞价型实例，请参阅 [To grant a user the permission to tag resources when using request-spot-instances](#iam-request-spot-instances)。

**在使用启动实例向导或 run-instances 时向用户授予资源标记权限**  
创建包含以下内容的 IAM policy：
+ `ec2:RunInstances` 操作。这将授予用户授予启动实例的权限。
+ 对于 `Resource`，请指定 `spot-instances-request`。这允许用户创建竞价型实例请求，以请求竞价型实例。
+ `ec2:CreateTags` 操作。这将授予用户创建标签的权限。
+ 对于 `Resource`，请指定 `*`。这将允许用户标记在实例启动期间创建的所有资源。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "AllowLaunchInstances",
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
            "Sid": "TagSpotInstanceRequests",
            "Effect": "Allow",
            "Action": "ec2:CreateTags",
            "Resource": "*"
        }
    ]
}
```

------

使用 RunInstances 操作创建竞价型实例请求，并在创建时标记竞价型实例请求时，您需要了解 Amazon EC2 如何评估 RunInstances 语句（在 IAM 策略中评估）中的 `spot-instances-request` 资源，如下所示：
+ 如果您在创建时未标记竞价型实例请求，则 Amazon EC2 不会在 RunInstances 语句中评估 `spot-instances-request` 资源。
+ 如果您在创建时标记竞价型实例请求，则 Amazon EC2 会在 RunInstances 语句中评估 `spot-instances-request` 资源。

因此，对于 `spot-instances-request` 资源，以下规则适用于 IAM 策略：
+ 如果您使用 RunInstances 创建竞价型实例请求，并且您不打算在创建时标记竞价型实例请求，则无需明确允许 `spot-instances-request` 资源；调用将成功。
+ 如果您使用 RunInstances 创建竞价型实例请求并打算在创建时标记竞价型实例请求，则必须在 RunInstances 允许语句中包含 `spot-instances-request` 资源，否则调用将失败。
+ 如果您使用 RunInstances 创建竞价型实例请求并打算在创建时标记竞价型实例请求，则必须在 CreateTags 允许语句中指定 `spot-instances-request` 资源或包括 `*` 通配符，否则调用将失败。

有关示例 IAM policy（包括竞价型实例请求不支持的策略），请参阅 [使用竞价型实例](ExamplePolicies_EC2.md#iam-example-spot-instances)。

**在使用 request-spot-instances 时向用户授予资源标记权限**  
创建包含以下内容的 IAM policy：
+ `ec2:RequestSpotInstances` 操作。这将授予用户创建竞价型实例请求的权限。
+ `ec2:CreateTags` 操作。这将授予用户创建标签的权限。
+ 对于 `Resource`，请指定 `spot-instances-request`。这将允许用户仅标记竞价型实例请求。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Sid": "TagSpotInstanceRequest",
            "Effect": "Allow",
            "Action": [
                "ec2:RequestSpotInstances",
                "ec2:CreateTags"
            ],
            "Resource": "arn:aws:ec2:{{us-east-1}}:{{111122223333}}:spot-instances-request/*"
        }
    ]
}
```

------

## 标记新的竞价型实例请求
<a name="tag-new-spot-instance-request"></a>

在 AWS CLI 和 PowerShell 示例中，按如下方式配置竞价型实例请求：
+ 对于 `ResourceType`，请指定 `spot-instances-request`。如果指定其他值，则竞价型实例请求将失败。
+ 对于 `Tags`，请指定键值对。您可以指定多个键值对。

------
#### [ Console ]

**标记新竞价型实例请求**

1. 按照[管理您的竞价型实例](using-spot-instances-request.md)过程操作。

1. 要添加标签，请在**添加标签**页上，选择**添加标签**，然后输入标签的键和值。为每个附加标签选择**添加其他标签**。

   对于每个标签，您可以使用相同标签来标记竞价型实例请求、竞价型实例和卷。要标记所有这三个项，请确保已选定 **Instances (实例)**、**Volumes (卷)**和 **Spot Instance Requests (竞价型实例请求)**。要仅标记其中的一个或两个项，请确保已选定要标记的资源，并清除其他资源。

1. 填写必填字段以创建竞价型实例请求，然后选择 **Launch (启动)**。有关更多信息，请参阅 [管理您的竞价型实例](using-spot-instances-request.md)。

------
#### [ AWS CLI ]

**标记新竞价型实例请求**  
使用 [request-spot-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-instances.html) 命令和 `--tag-specification` 选项。

标签规范向竞价型实例请求添加两个标签：`Environment=Production` 和 `Cost-Center=123`。

```
aws ec2 request-spot-instances \
    --instance-count {{5}} \
    --type "one-time" \
    --launch-specification file://{{specification.json}} \
    --tag-specification 'ResourceType=spot-instances-request,Tags=[{Key={{Environment}},Value={{Production}}},{Key={{Cost-Center}},Value={{123}}}]'
```

------
#### [ PowerShell ]

**标记新竞价型实例请求**  
使用 [Request-EC2SpotInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/Request-EC2SpotInstance.html) cmdlet 和 `-TagSpecification` 参数。

```
-TagSpecification $tagspec
```

标签规范定义如下。它向竞价型实例请求添加两个标签：`Environment=Production` 和 `Cost-Center=123`。

```
$tag1 = @{Key="Environment"; Value="Production"}
$tag2 = @{Key="Cost-Center"; Value="123"}
$tagspec = New-Object Amazon.EC2.Model.TagSpecification
$tagspec.ResourceType = "spot-instances-request"
$tagspec.Tags = @($tag1,$tag2)
```

------

## 标记现有竞价型实例请求
<a name="tag-existing-spot-instance-request"></a>

------
#### [ Console ]

**标记现有竞价型实例请求**

创建竞价型实例请求后，您可以使用控制台向竞价型实例请求添加标签。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择您的竞价型实例请求。

1. 选择 **Tags (标签)** 选项卡，然后选择 **Create Tag (创建标签)**。

**使用控制台标记现有的竞价型实例**  
在竞价型实例请求启动竞价型实例后，您可以使用控制台向实例添加标签。有关更多信息，请参阅 [使用控制台添加标签](Using_Tags_Console.md#adding-or-deleting-tags)。

------
#### [ AWS CLI ]

**标记现有的竞价型实例请求或竞价型实例**  
使用 [create-tags](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-tags.html) 命令标记现有的资源。在以下示例中，使用 `purpose=test` 标记现有竞价型实例请求和竞价型实例。

```
aws ec2 create-tags \
    --resources {{sir-0e54a519c9EXAMPLE}} {{i-1234567890abcdef0}} \
    --tags Key={{purpose}},Value={{test}}
```

------
#### [ PowerShell ]

**标记现有的竞价型实例请求或竞价型实例**  
使用 [New-EC2Tag](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Tag.html) cmdlet。以下示例将标签 `purpose=test` 添加到现有竞价型实例请求和竞价型实例。

```
New-EC2Tag `
    -Resource {{sir-0e54a519c9EXAMPLE}}, {{i-1234567890abcdef0}} `
    -Tag @{Key="{{purpose}}"; Value="{{test}}"}
```

------

## 查看竞价型实例请求标记
<a name="view-spot-instance-request-tags"></a>

------
#### [ Console ]

**查看竞价型实例请求标签**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择您的竞价型实例请求并选择 **Tags (标签)** 选项卡。

------
#### [ AWS CLI ]

**描述竞价型实例请求标记**  
使用 [describe-spot-instance-requests](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-spot-instance-requests.html) 命令可查看指定的竞价型实例请求的配置，其中包括为请求指定的任何标签。

```
aws ec2 describe-spot-instance-requests \
    --spot-instance-request-ids {{sir-0e54a519c9EXAMPLE}} \
    --query "SpotInstanceRequests[*].Tags"
```

下面是示例输出。

```
[
    [
        {
            "Key": "Environment",
            "Value": "Production"
        },
        {
            "Key": "Department",
            "Value": "101"
        }
    ]
]
```

------
#### [ PowerShell ]

**描述竞价型实例请求标记**  
使用 [Get-EC2SpotInstanceRequest](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2SpotInstanceRequest.html) cmdlet。

```
(Get-EC2SpotInstanceRequest `
    -SpotInstanceRequestId {{sir-0e54a519c9EXAMPLE}}).Tags
```

下面是示例输出。

```
Key         Value
---         -----
Environment Production
Department  101
```

------
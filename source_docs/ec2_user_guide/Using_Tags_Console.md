

# 添加或删除 Amazon EC2 资源的标签
<a name="Using_Tags_Console"></a>

在创建 Amazon EC2 资源（例如 Amazon EC2 实例）时，可以指定要添加到资源的标签。Amazon EC2 控制台可用于显示特定 Amazon EC2 资源的标签。您也可以在现有的 Amazon EC2 资源中添加或删除标签。

使用 AWS Resource Groups 控制台中的**标签编辑器**，可以查看、添加或删除所有区域中所有 AWS 资源的标签。您可以同时将标签应用到多个类型的资源，也可以同时从多个类型的资源删除标签。有关更多信息，请参阅 [标记 AWS 资源用户指南](https://docs.aws.amazon.com/tag-editor/latest/userguide/tagging.html)。

**Topics**
+ [使用控制台添加标签](#adding-or-deleting-tags)
+ [使用 AWS CLI 添加标签](#create-tag-examples)
+ [使用 PowerShell 添加标签](#powershell-add-tag-specifications)
+ [使用 CloudFormation 添加标签](#cloudformation-add-tag-specifications)

## 使用控制台添加标签
<a name="adding-or-deleting-tags"></a>

您可以从资源页面直接为现有的资源添加标签。

**向现有资源添加标签**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 从导航栏中选择资源所在的区域。

1. 在导航窗格中，选择资源类型 (例如，**Instances**)。

1. 从列表中选择相应资源。

1. 从**标签**选项卡中选择**管理标签**。

1. 选择**添加新标签**，然后输入标签键和标签值。

1. 选择**保存**。

## 使用 AWS CLI 添加标签
<a name="create-tag-examples"></a>

您可以在创建资源时添加标签，也可以向现有资源添加标签。

**在创建资源时添加标签**  
使用 `-tag-specifications` 选项在创建资源时标记资源。标签规范规定了要标记的资源类型、标签键和标签值。以下示例会创建一个标签并将其添加到标签规范中。

```
--tag-specifications 'ResourceType={{instance}},Tags=[{Key={{stack}},Value={{production}}}]'
```

**向现有资源添加标签**  
以下示例演示了如何使用 [create-tags](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-tags.html) 命令向现有资源添加标签。

**Example 示例：将标签添加到资源**  
以下示例将标签 **Stack=production** 添加到指定的映像，或者覆盖该 AMI 的现有标签（其中标签键为 stack）。如果命令成功，则不返回任何输出。  

```
aws ec2 create-tags \
    --resources {{ami-0abcdef1234567890}} \
    --tags Key={{stack}},Value={{production}}
```

**Example 示例：将标签添加到多个资源**  
此示例为 AMI 和实例添加（或覆盖）两个标签。其中一个标签仅包含键 (webserver)，不包含值（我们将值设置为空字符串）。另一个标签则包含键 (stack) 和值 (**Production**)。如果命令成功，则不返回任何输出。  

```
aws ec2 create-tags \
    --resources {{ami-0abcdef1234567890}} {{i-1234567890abcdef0}} \
    --tags Key={{webserver}},Value=  Key={{stack}},Value={{Production}}
```

**Example 示例：使用特殊字符添加标签**  
此示例将标签 [Group]=test 添加到实例。方括号（[ 和 ]）是特殊字符，必须对其进行转义。  
如果您使用的是 Linux 或 OS X，要转义特殊字符，请用双引号 (") 将具有特殊字符的元素引起来，然后用单引号 (') 将整个键和值结构引起来。  

```
aws ec2 create-tags \
    --resources {{i-1234567890abcdef0}} \
    --tags 'Key="{{[Group]}}",Value={{test}}'
```
如果您使用的是 Windows，要转义特殊字符，请用双引号 (") 将具有特殊字符的元素引起来，然后在每个双引号字符前面添加反斜杠 (**\\**)，如下所示：  

```
aws ec2 create-tags ^
    --resources {{i-1234567890abcdef0}} ^
    --tags Key=\"{{[Group]}}\",Value={{test}}
```
如果您使用的是 Windows PowerShell，要转义特殊字符，请用双引号 (**"**) 将具有特殊字符的值引起来，在每个双引号字符前面添加反斜杠 (**\\**)，然后用单引号 (**'**) 将整个键和值结构引起来，如下所示：  

```
aws ec2 create-tags `
    --resources {{i-1234567890abcdef0}} `
    --tags 'Key=\"{{[Group]}}\",Value={{test}}'
```

## 使用 PowerShell 添加标签
<a name="powershell-add-tag-specifications"></a>

您可以在创建资源时添加标签，也可以向现有资源添加标签。

**在创建资源时添加标签**  
使用 `-TagSpecification` 参数在创建资源时标记资源。标签规范规定了要标记的资源类型、标签键和标签值。以下示例会创建一个标签并将其添加到标签规范中。

```
$tag = @{Key="{{stack}}"; Value="{{production}}"}
$tagspec = new-object Amazon.EC2.Model.TagSpecification
$tagspec.ResourceType = "{{instance}}"
$tagspec.Tags.Add($tag)
```

以下示例会在 `-TagSpecification` 参数中指定此标签。

```
-TagSpecification $tagspec
```

**向现有资源添加标签**  
使用 [New-EC2Tag](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Tag.html) cmdlet。您必须指定资源、标签键和标签值。

```
New-EC2Tag `
    -Resource {{i-1234567890abcdef0}} `
    -Tag @{Key="{{purpose}}"; Value="{{production}}"}
```

## 使用 CloudFormation 添加标签
<a name="cloudformation-add-tag-specifications"></a>

对于 Amazon EC2 资源类型，您可以使用 `Tags` 或 `TagSpecifications` 属性指定标签。

以下示例使用其 `Tags` 属性将标签 **Stack=Production** 添加到 [AWS::EC2::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-instance.html)。

**Example 示例：YAML 中的 Tags**  

```
Tags:
  - Key: "Stack"
    Value: "Production"
```

**Example 示例：JSON 中的 Tags**  

```
"Tags": [
    {
        "Key": "Stack",
        "Value": "Production"
    }
]
```

以下示例使用其 `TagSpecifications` 属性将标签 **Stack=Production** 添加到 [AWS::EC2::LaunchTemplate LaunchTemplateData](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata.html)。

**Example 示例：YAML 中的 TagSpecifications**  

```
TagSpecifications:
  - ResourceType: "instance"
    Tags:
    - Key: "Stack"
      Value: "Production"
```

**Example 示例：JSON 中的 TagSpecifications**  

```
"TagSpecifications": [
    {
        "ResourceType": "instance",
        "Tags": [
            {
                "Key": "Stack",
                "Value": "Production"
            }
        ]
    }
]
```
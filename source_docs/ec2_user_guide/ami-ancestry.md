

# 使用 AMI 世系跟踪 AMI 的源
<a name="ami-ancestry"></a>

AMI 世系通过返回所有原级 AMI 的 ID 和区域来帮助您跟踪 AMI 的源。当您创建或复制 AMI 时，新 AMI 会保留其源（父）AMI 的 ID 和区域。这使您能够跟踪 AMI 的链，直至根 AMI。

**主要优势**

使用 AMI 世系可以帮助您：
+ 跟踪 AMI 衍生品以确保符合内部策略。
+ 当在原级 AMI 中发现安全问题时，识别潜在易受攻击的 AMI。
+ 在多个区域保持 AMI 源的可见性。

**Topics**
+ [AMI 世系的工作原理](#how-ami-ancestry-works)
+ [注意事项](#ami-ancestry-conditions)
+ [查看 AMI 世系](#view-ami-ancestry)
+ [识别源 AMI](#identify-source-ami-used-to-create-new-ami)

## AMI 世系的工作原理
<a name="how-ami-ancestry-works"></a>

AMI 世系识别用于创建指定 AMI 的父 AMI、父级的父级，依此类推，直至根 AMI。下面将介绍操作方式：
+ 每个 AMI 都会显示其源（父）AMI 的 ID 和区域。
+ 从所选 AMI 开始，世系条目列表按顺序显示每个父 AMI。
+ 世系条目列表可以追溯到根 AMI。根 AMI 可以是以下任一项：
  + 来自[经过验证的提供商](sharing-amis.md#verified-ami-provider)的公共 AMI（由其所有者别名标识，即 `amazon` 或 `aws-marketplace`）。
  + 没有记录的原级的 AMI。例如，当使用 [RegisterImage](creating-an-ami-ebs.md#creating-launching-ami-from-snapshot) 直接从一组快照创建 AMI 时，与从实例创建 AMI 时不同，此时没有要跟踪的源 AMI。
  + 一个 AMI，其源 AMI 来自不同的[分区](https://docs.aws.amazon.com/glossary/latest/reference/glos-chap.html#partition)。
  + 列表中的第 50 个 AMI。世系列表中最多可以包含 50 个 AMI。

## 注意事项
<a name="ami-ancestry-conditions"></a>
+ 源 AMI 的 ID 和区域仅适用于使用 [CreateImage](creating-an-ami-ebs.md#how-to-create-ebs-ami)、[CopyImage](CopyingAMIs.md#ami-copy-steps) 或 [CreateRestoreImageTask](store-restore-how-it-works.md#CreateRestoreImageTask) 创建的 AMI。
+ 对于使用 [CreateImage](creating-an-ami-ebs.md#how-to-create-ebs-ami) 创建的 AMI（从实例创建 AMI），源 AMI ID 是用于启动实例的 AMI 的 ID。
+ 源 AMI 信息不适用于：
  + 使用 [RegisterImage](creating-an-ami-ebs.md#creating-launching-ami-from-snapshot) 创建的 AMI，因为它们是根据快照创建的。
  + 对于一些较旧 AMI。
+ 在以下情况下会保留源 AMI 信息：
  + 跨多个区域复制 AMI。
  + 源 AMI 已被注销（删除）。
  + 您无权访问源 AMI。
+ 每个世系列表最多只能包含 50 个 AMI。

## 查看 AMI 世系
<a name="view-ami-ancestry"></a>

您可以使用以下方法查看 AMI 的世系。

------
#### [ Console ]

**查看 AMI 的世系**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择一个 AMI，然后选择 **AMI 世系**选项卡。

1. **AMI 世系条目**表列出了世系列表中的所有 AMI。
   + **AMI ID**：世系列表中每个 AMI 的标识符。表中的第一个条目是选定的 AMI，后面是其原级。
   + **源 AMI ID**：创建 **AMI ID** 列中的 AMI 所依据的 AMI 的 ID。破折号（**-**）表示 AMI 世系列表的结尾。
   + **源 AMI 区域**：源 AMI 所在的 AWS 区域。
   + **世系等级**：世系列表中的位置，其中：
     + **0（输入 AMI）**表示您想知道其世系的所选 AMI。
     + 数字越大，显示的原级更老。
     + **{{n}}（原始 AMI）**表示根 AMI，数字表示世系列表可以追溯的层级深度。
   + **创建日期**：AMI 的创建时间，采用 UTC 格式。
   + **所有者别名**：AMI 所有者的别名（例如 `amazon`）。破折号（**-**）表示 AMI 没有所有者别名。

------
#### [ AWS CLI ]

**查看 AMI 的世系**  
使用 [get-image-ancestry](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-image-ancestry.html) 命令并指定 AMI ID。

```
aws ec2 get-image-ancestry \
    --image-id {{ami-1111111111EXAMPLE}} \
    --region {{us-east-1}}
```

下面是示例输出。输出按照世系顺序列出 AMI：第一个条目是指定的（输入）AMI，后面依次是其父级、父级的父级，依此类推，直到根 AMI。

```
{
    "ImageAncestryEntries": [
        {
            "CreationDate": "2025-01-17T18:37:50.000Z",
            "ImageId": "ami-1111111111EXAMPLE", // Input AMI
            "SourceImageId": "ami-2222222222EXAMPLE",
            "SourceImageRegion": "us-east-1"

        },
        {
            "CreationDate": "2025-01-17T18:37:50.000Z",
            "ImageId": "ami-2222222222EXAMPLE", // Parent AMI
            "SourceImageId": "ami-3333333333EXAMPLE",
            "SourceImageRegion": "us-east-1"
        },
        ...
        {
            "CreationDate": "2025-01-17T18:37:50.000Z",
            "ImageId": "ami-8888888888EXAMPLE", // Root AMI
            "ImageOwnerAlias": "aws-marketplace",
            "SourceImageId": "ami-9999999999EXAMPLE",
            "SourceImageRegion": "us-east-2"
        }
    ]
}
```

------
#### [ PowerShell ]

**查看 AMI 的世系**  
使用 [Get-EC2ImageAncestry](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageAncestry.html) cmdlet。

```
Get-EC2ImageAncestry -ImageId {{ami-1111111111EXAMPLE}}
```

下面是示例输出。输出按照世系顺序列出 AMI：第一个条目是指定的（输入）AMI，后面依次是其父级、父级的父级，依此类推，直到根 AMI。

```
ImageAncestryEntries : {
    @{
        CreationDate = "2025-01-17T18:37:50.000Z"
        ImageId = "ami-1111111111EXAMPLE"    # Input AMI
        SourceImageId = "ami-2222222222EXAMPLE"
        SourceImageRegion = "us-east-1"
    },
    @{
        CreationDate = "2025-01-17T18:37:50.000Z"
        ImageId = "ami-2222222222EXAMPLE"    # Parent AMI
        SourceImageId = "ami-3333333333EXAMPLE"
        SourceImageRegion = "us-east-1"
    },
    ...
    @{
        CreationDate = "2025-01-17T18:37:50.000Z"
        ImageId = "ami-8888888888EXAMPLE"    # Root AMI
        ImageOwnerAlias = "aws-marketplace"
        SourceImageId = "ami-9999999999EXAMPLE"
        SourceImageRegion = "us-east-2"
    }
}
```

------

## 识别源 AMI
<a name="identify-source-ami-used-to-create-new-ami"></a>

如果您只需要识别用于创建某个 AMI 的直接父级（源）AMI，则可以使用以下方法。

------
#### [ Console ]

**识别用于创建所选 AMI 的源 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI 以查看其详细信息。

   源 AMI 信息显示在下面的字段中：**源 AMI ID** 和**源 AMI 区域**

------
#### [ AWS CLI ]

**识别用于创建指定 AMI 的源 AMI**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --region {{us-east-1}} \
    --image-ids {{ami-0abcdef1234567890}} \
    --query "Images[].{ID:SourceImageId,Region:SourceImageRegion}"
```

下面是示例输出。

```
[
    {
        "ID": "ami-0abcdef1234567890",
        "Region": "us-west-2"
    }
}
```

------
#### [ PowerShell ]

**识别用于创建指定 AMI 的源 AMI**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
Get-EC2Image -ImageId {{ami-0abcdef1234567890}} | Select SourceImageId, SourceImageRegion
```

下面是示例输出。

```
SourceImageId           SourceImageRegion
-------------           -----------------
ami-0abcdef1234567890 us-west-2
```

------
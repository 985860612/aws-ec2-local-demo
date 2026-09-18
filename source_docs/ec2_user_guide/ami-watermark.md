

# 使用 AMI 水印来跟踪和识别 AMI
<a name="ami-watermark"></a>

AMI 水印是向私有 AMI 附加的用于跟踪来源和执行治理策略的标识符。水印在整个 AMI 生命周期中持续存在：
+ 如果基于从带水印的 AMI 启动的正在运行的实例创建新的 AMI，则新 AMI 会继承该水印。
+ 如果复制带水印的 AMI，则副本会带有该水印。
+ 如果与其他账户共享带水印的 AMI，则接收方仍能看到该水印。

**主要优势**
+ 跨账户和区域跟踪来源：识别哪些 AMI 源自已批准的基本图像。
+ 跨账户筛选并查找相关的 AMI。
+ 帮助 AMI 使用者发现并识别与项目或组织相关联的可信 AMI。
+ 通过将水印与[允许的 AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-allowed-amis.html) 相结合，将实例启动限制为仅允许携带经批准水印的 AMI 来实施治理。

**Topics**
+ [AMI 水印的工作原理](#ami-watermark-how-it-works)
+ [所需的权限](#ami-watermark-permissions)
+ [向 AMI 附加水印](#ami-watermark-attach)
+ [从 AMI 分离水印](#ami-watermark-detach)
+ [查看 AMI 水印](#ami-watermark-view)
+ [按水印筛选 AMI](#ami-watermark-filter)

## AMI 水印的工作原理
<a name="ami-watermark-how-it-works"></a>

AMI 水印是向 AMI 附加的结构化标识符。下面介绍了水印的主要特征：
+ **持续存在**：当向 AMI 附加水印时，水印会延续到所有衍生 AMI。
+ **仅所有者**：仅 AMI 所有者可以向 AMI 附加水印。
+ **对所有人可见**：任何有权访问 AMI 的人均可查看其水印。
+ **上限为 5**：一个 AMI 最多可以有 5 个水印。
+ **不适用于公有 AMI**：无法向公有 AMI 附加水印，也无法将带水印的 AMI 设为公有。
+ **可筛选**：使用 `describe-images` 时可以按水印筛选 AMI。

### 水印格式
<a name="ami-watermark-format"></a>

水印是包含以下字段的结构化对象：
+ `WatermarkKey`：水印的唯一标识符，由 `{{account-id}}:{{watermark-name}}` 组成。账户 ID 部分是 AMI 所有者的 12 位 AWS 账户 ID。水印名称部分是客户指定的名称。
+ `SourceImageRegion`：最初向其附加水印的 AMI 的区域。
+ `SourceImageId`：最初向其附加水印的 AMI。
+ `SourceImageCreationDate`：最初向其附加水印的 AMI 的创建日期。
+ `WatermarkCreationTime`：应用水印的时间戳。

水印名称的长度必须为 3 到 128 个字符，且可包含字母数字字符、圆括号（()）、方括号（[]）、空格、句点（.）、斜杠（/）、破折号（-）、单引号（'）、@ 符号或下划线（\_）。

## 所需的权限
<a name="ami-watermark-permissions"></a>

要使用 AMI 水印，您需要以下 IAM 权限：
+ `ec2:AttachImageWatermark`：向 AMI 附加水印。
+ `ec2:DetachImageWatermark`：从 AMI 分离水印。
+ `ec2:DescribeImages`：查看 AMI 上的水印。

## 向 AMI 附加水印
<a name="ami-watermark-attach"></a>

您可以使用控制台、AWS CLI 或 PowerShell 向 AMI 附加水印。

------
#### [ Console ]

**向 AMI 附加水印**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI。

1. 在**详细信息**选项卡的**水印**部分，选择**管理水印**。

1. 输入水印名称，然后选择**附加**。

------
#### [ AWS CLI ]

**向 AMI 附加水印**  
使用 [attach-image-watermark](https://docs.aws.amazon.com/cli/latest/reference/ec2/attach-image-watermark.html) 命令。

```
aws ec2 attach-image-watermark \
    --image-id {{ami-1111111111EXAMPLE}} \
    --image-watermark-name "{{prod-baseline}}"
```

下面是示例输出。

```
{
    "WatermarkKey": "123456789012:prod-baseline"
}
```

------
#### [ PowerShell ]

**向 AMI 附加水印**  
使用 [Add-EC2ImageWatermark](https://docs.aws.amazon.com/powershell/latest/reference/items/Add-EC2ImageWatermark.html) cmdlet。

```
Add-EC2ImageWatermark `
    -ImageId {{ami-1111111111EXAMPLE}} `
    -ImageWatermarkName "{{prod-baseline}}"
```

------

一个 AMI 最多可以附加 5 个水印。

## 从 AMI 分离水印
<a name="ami-watermark-detach"></a>

您可以使用控制台、AWS CLI 或 PowerShell 从 AMI 分离水印。

------
#### [ Console ]

**从 AMI 分离水印**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI。

1. 在**详细信息**选项卡的**水印**部分，选择**管理水印**。

1. 选择要移除的水印，然后选择**移除**。

------
#### [ AWS CLI ]

**从 AMI 分离水印**  
使用 [detach-image-watermark](https://docs.aws.amazon.com/cli/latest/reference/ec2/detach-image-watermark.html) 命令。

```
aws ec2 detach-image-watermark \
    --image-id {{ami-1111111111EXAMPLE}} \
    --image-watermark-key "{{111122223333:prod-baseline}}"
```

------
#### [ PowerShell ]

**从 AMI 分离水印**  
使用 [Remove-EC2ImageWatermark](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2ImageWatermark.html) cmdlet。

```
Remove-EC2ImageWatermark `
    -ImageId {{ami-1111111111EXAMPLE}} `
    -ImageWatermarkKey "{{111122223333:prod-baseline}}"
```

------

**注意**  
从 AMI 分离水印不会将其从已带该水印的衍生 AMI 中移除。为确保水印持续存在，请仅向需要管理水印的可信管理员授予 `ec2:DetachImageWatermark` 权限。

## 查看 AMI 水印
<a name="ami-watermark-view"></a>

您可以使用控制台、AWS CLI 或 PowerShell 查看 AMI 的水印。

------
#### [ Console ]

**查看 AMI 的水印**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI。

1. 在**详细信息**选项卡的**水印**部分查看水印。

------
#### [ AWS CLI ]

**查看 AMI 的水印**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --image-ids {{ami-046863d776a820ccd}} \
    --region {{us-east-1}}
```

响应包含每个 AMI 的 `ImageWatermarks` 数组。

```
{
    "Images": [
        {
            "ImageId": "ami-046863d776a820ccd",
            "Public": false,
            "OwnerId": "123456789012",
            ...
            "ImageWatermarks": [
                {
                    "WatermarkKey": "111122223333:prod-baseline",
                    "Region": "us-east-1",
                    "SourceImageId": "ami-0b752bf1df193a6c4",
                    "SourceImageCreationDate": "2024-07-10T08:15:00",
                    "CreationDate": "2024-07-12T14:30:00"
                },
                {
                    "WatermarkKey": "222222222222:security-approved",
                    "Region": "eu-north-1",
                    "SourceImageId": "ami-12345678",
                    "SourceImageCreationDate": "2024-06-01T10:00:00",
                    "CreationDate": "2024-06-05T09:45:00"
                }
            ]
        }
    ]
}
```

------
#### [ PowerShell ]

**查看 AMI 的水印**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
(Get-EC2Image -ImageId {{ami-046863d776a820ccd}}).ImageWatermarks
```

------

## 按水印筛选 AMI
<a name="ami-watermark-filter"></a>

您可以使用控制台、AWS CLI 或 PowerShell 按水印筛选 AMI。

------
#### [ Console ]

**按水印筛选 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 在搜索栏中，选择**水印键**筛选条件并输入水印键值。

------
#### [ AWS CLI ]

**按水印筛选 AMI**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令和 `image-watermark-key` 筛选条件。

```
aws ec2 describe-images \
    --filters "Name=image-watermark-key,Values={{111122223333:prod-baseline}}"
```

这将返回您有权访问且带有指定水印的所有 AMI，包括通过复制操作继承了该水印的衍生 AMI。

------
#### [ PowerShell ]

**按水印筛选 AMI**  
使用带 `-Filter` 参数的 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
Get-EC2Image `
    -Filter @{Name="image-watermark-key"; Values="{{111122223333:prod-baseline}}"}
```

这将返回您有权访问且带有指定水印的所有 AMI，包括通过复制操作继承了该水印的衍生 AMI。

------
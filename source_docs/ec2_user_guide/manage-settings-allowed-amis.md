

# 管理“允许的 AMI”设置
<a name="manage-settings-allowed-amis"></a>

您可以管理“允许的 AMI”设置 这些设置按区域和账户生效。

**Topics**
+ [启用“允许的 AMI”](#enable-allowed-amis-criteria)
+ [设置“允许的 AMI”条件](#update-allowed-amis-criteria)
+ [禁用“允许的 AMI”](#disable-allowed-amis-criteria)
+ [获取“允许的 AMI”条件](#identify-allowed-amis-state-and-criteria)
+ [查找允许的 AMI](#identify-amis-that-meet-allowed-amis-criteria)
+ [查找利用不允许的 AMI 启动的实例](#identify-instances-with-allowed-AMIs)

## 启用“允许的 AMI”
<a name="enable-allowed-amis-criteria"></a>

您可以启用“允许的 AMI”并指定“允许的 AMI”条件。我们建议您首先在审计模式中进行此操作，因为此模式可在不实际限制访问权限的情况下显示会受到筛选条件影响的具体 AMI。

------
#### [ Console ]

**启用“允许的 AMI”**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择**允许的 AMI**。

1. 在**允许的 AMI** 选项卡上，选择**管理**。

1. 对于**允许的 AMI 设置**，选择**审计模式**或**启用**。我们建议您首先在审计模式中对筛选条件进行测试，然后再返回此步骤启用“允许的 AMI”。

1. （可选）对于 **AMI 条件**，请输入 JSON 格式的条件。

1. 选择**更新**。

------
#### [ AWS CLI ]

**启用“允许的 AMI”**  
使用 [enable-allowed-images-settings](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-allowed-images-settings.html) 命令。

```
aws ec2 enable-allowed-images-settings --allowed-images-settings-state enabled
```

要改为启用审计模式，请指定 `audit-mode`，而不是 `enabled`。

```
aws ec2 enable-allowed-images-settings --allowed-images-settings-state audit-mode
```

------
#### [ PowerShell ]

**启用“允许的 AMI”**  
使用 [Enable-EC2AllowedImagesSetting](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-EC2AllowedImagesSetting.html) cmdlet。

```
Enable-EC2AllowedImagesSetting -AllowedImagesSettingsState enabled
```

要改为启用审计模式，请指定 `audit-mode`，而不是 `enabled`。

```
Enable-EC2AllowedImagesSetting -AllowedImagesSettingsState audit-mode
```

------

## 设置“允许的 AMI”条件
<a name="update-allowed-amis-criteria"></a>

启用“允许的 AMI”后，您可以设置或替换“允许的 AMI”条件。

有关正确的配置和有效值，请参阅[允许的 AMI 配置](ec2-allowed-amis.md#allowed-amis-json-configuration)和[允许的 AMI 参数](ec2-allowed-amis.md#allowed-amis-criteria)。

------
#### [ Console ]

**设置“允许的 AMI”条件**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择**允许的 AMI**。

1. 在**允许的 AMI** 选项卡上，选择**管理**。

1. 对于 **AMI 条件**，请输入 JSON 格式的条件。

1. 选择**更新**。

------
#### [ AWS CLI ]

**设置“允许的 AMI”条件**  
使用 [replace-image-criteria-in-allowed-images-settings](https://docs.aws.amazon.com/cli/latest/reference/ec2/replace-image-criteria-in-allowed-images-settings.html) 命令并指定包含允许的 AMI 标准的 JSON 文件。

```
aws ec2 replace-image-criteria-in-allowed-images-settings --cli-input-json file://{{file_name.json}}
```

------
#### [ PowerShell ]

**设置“允许的 AMI”条件**  
使用 [Set-EC2ImageCriteriaInAllowedImagesSetting](https://docs.aws.amazon.com/powershell/latest/reference/items/Set-EC2ImageCriteriaInAllowedImagesSetting.html) cmdlet 并指定包含允许的 AMI 标准的 JSON 文件。

```
$imageCriteria = Get-Content -Path .\{{file_name.json}} | ConvertFrom-Json
Set-EC2ImageCriteriaInAllowedImagesSetting -ImageCriterion $imageCriteria
```

------

## 禁用“允许的 AMI”
<a name="disable-allowed-amis-criteria"></a>

您可以按如下所示禁用“允许的 AMI”。

------
#### [ Console ]

**禁用“允许的 AMI”**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择**允许的 AMI**。

1. 在**允许的 AMI** 选项卡上，选择**管理**。

1. 对于**“允许的 AMI”设置**，选择**禁用**。

1. 选择**更新**。

------
#### [ AWS CLI ]

**禁用“允许的 AMI”**  
使用 [disable-allowed-images-settings](https://docs.aws.amazon.com/cli/latest/reference/ec2/disable-allowed-images-settings.html) 命令。

```
aws ec2 disable-allowed-images-settings
```

------
#### [ PowerShell ]

**禁用“允许的 AMI”**  
使用 [Disable-EC2AllowedImagesSetting](https://docs.aws.amazon.com/powershell/latest/reference/items/Disable-EC2AllowedImagesSetting.html) cmdlet。

```
Disable-EC2AllowedImagesSetting
```

------

## 获取“允许的 AMI”条件
<a name="identify-allowed-amis-state-and-criteria"></a>

您可以获取当前“允许的 AMI”设置状态和“允许的 AMI”条件。

------
#### [ Console ]

**获取“允许的 AMI”状态和条件**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择**允许的 AMI**。

1. 在**允许的 AMI** 选项卡上，将**允许的 AMI** 设置为**启用**、**禁用**或**审计模式**。

1. 如果“允许的 AMI”设置状态为**启用**或**审计模式**，则 **AMI 条件**将以 JSON 格式显示 AMI 条件。

------
#### [ AWS CLI ]

**获取“允许的 AMI”状态和条件**  
使用 [get-allowed-images-settings](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-allowed-images-settings.html) 命令。

```
aws ec2 get-allowed-images-settings
```

在以下示例输出中，状态为 `audit-mode`，且已在账户中设置映像标准。

```
{
    "State": "audit-mode",
    "ImageCriteria": [
        {
            "MarketplaceProductCodes": [
                "abcdefg1234567890"
            ]
        },
        {
            "ImageProviders": [
                "123456789012",
                "123456789013"
            ],
            "CreationDateCondition": {
                "MaximumDaysSinceCreated": 300
            }
        },
        {
            "ImageProviders": [
                "123456789014"
            ],
            "ImageNames": [
                "golden-ami-*"
            ]
        },
        {
            "ImageProviders": [
                "amazon"
            ],
            "DeprecationTimeCondition": {
                "MaximumDaysSinceDeprecated": 0
            }
        }
    ],
    "ManagedBy": "account"
}
```

------
#### [ PowerShell ]

**获取“允许的 AMI”状态和条件**  
使用 [Get-EC2AllowedImagesSetting](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2AllowedImagesSetting.html) cmdlet。

```
Get-EC2AllowedImagesSetting | Select-Object `
    State, `
    ManagedBy, `
    @{Name='ImageProviders'; Expression={($_.ImageCriteria.ImageProviders)}}, `
    @{Name='MarketplaceProductCodes'; Expression={($_.ImageCriteria.MarketplaceProductCodes)}}, `
    @{Name='ImageNames'; Expression={($_.ImageCriteria.ImageNames)}}, `
    @{Name='MaximumDaysSinceCreated'; Expression={($_.ImageCriteria.CreationDateCondition.MaximumDaysSinceCreated)}}, `
    @{Name='MaximumDaysSinceDeprecated'; Expression={($_.ImageCriteria.DeprecationTimeCondition.MaximumDaysSinceDeprecated)}}
```

在以下示例输出中，状态为 `audit-mode`，且已在账户中设置映像标准。

```
State      : audit-mode
ManagedBy  : account
ImageProviders            : {123456789012, 123456789013, 123456789014, amazon}
MarketplaceProductCodes   : {abcdefg1234567890}
ImageNames                : {golden-ami-*}
MaximumDaysSinceCreated  : 300
MaximumDaysSinceDeprecated: 0
```

------

## 查找允许的 AMI
<a name="identify-amis-that-meet-allowed-amis-criteria"></a>

您可以查找当前“允许的 AMI”条件允许或不允许的 AMI。

**注意**  
“允许的 AMI”设置必须为“审计模式”。

------
#### [ Console ]

**检查 AMI 是否符合“允许的 AMI”条件**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI。

1. 在**详细信息**选项卡（如果选中了复选框）或摘要区域（如果选择了 AMI ID）中，找到**允许的镜像**字段。
   + **是** – 此 AMI 符合“允许的 AMI”条件。启用“允许的 AMI”后，您账户中的用户将可使用此 AMI。
   + **否** – 此 AMI 不符合“允许的 AMI”条件。

1. 在导航窗格中，选择 **AMI Catalog**（AMI 目录）。

   标记为**不允许**的 AMI 表示 AMI 不符合“允许的 AMI”标准。禁用“允许的 AMI”时，此 AMI 将对您账户中的用户不可见且不可用。

------
#### [ AWS CLI ]

**检查 AMI 是否符合“允许的 AMI”条件**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --image-id {{ami-0abcdef1234567890}} \
    --query Images[].ImageAllowed \
    --output text
```

下面是示例输出。

```
True
```

**查找符合“允许的 AMI”条件的 AMI**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --filters "Name=image-allowed,Values=true" \
    --max-items 10 \
    --query Images[].ImageId
```

下面是示例输出。

```
ami-000eaaa8be2fd162a
ami-000f82db25e50de8e
ami-000fc21eb34c7a9a6
ami-0010b876f1287d7be
ami-0010b929226fe8eba
ami-0010957836340aead
ami-00112c992a47ba871
ami-00111759e194abcc1
ami-001112565ffcafa5e
ami-0011e45aaee9fba88
```

------
#### [ PowerShell ]

**检查 AMI 是否符合“允许的 AMI”条件**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
(Get-EC2Image -ImageId {{ami-0abcdef1234567890}}).ImageAllowed
```

下面是示例输出。

```
True
```

**查找符合“允许的 AMI”条件的 AMI**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
Get-EC2Image `
    -Filter @{Name="image-allows";Values="true"} `
    -MaxResult 10 | `
    Select ImageId
```

下面是示例输出。

```
ami-000eaaa8be2fd162a
ami-000f82db25e50de8e
ami-000fc21eb34c7a9a6
ami-0010b876f1287d7be
ami-0010b929226fe8eba
ami-0010957836340aead
ami-00112c992a47ba871
ami-00111759e194abcc1
ami-001112565ffcafa5e
ami-0011e45aaee9fba88
```

------

## 查找利用不允许的 AMI 启动的实例
<a name="identify-instances-with-allowed-AMIs"></a>

您可以识别使用不符合“允许的 AMI”条件的 AMI 启动的实例。

------
#### [ Console ]

**检查某个实例是否是使用不允许的 AMI 启动的**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 在**详细信息**选项卡的**实例详细信息**下，找到**允许的映像**字段。
   + **是** – 此 AMI 符合“允许的 AMI”条件。
   + **否** – 此 AMI 不符合“允许的 AMI”条件。

------
#### [ AWS CLI ]

**查找使用不允许的 AMI 启动的实例**  
使用 [describe-instance-image-metadata](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-image-metadata.html) 命令和 `image-allowed` 筛选条件。

```
aws ec2 describe-instance-image-metadata \
    --filters "Name=image-allowed,Values=false" \
    --query "InstanceImageMetadata[*].[InstanceId,ImageMetadata.ImageId]" \
    --output table
```

下面是示例输出。

```
--------------------------------------------------
|          DescribeInstanceImageMetadata         |
+----------------------+-------------------------+
|  i-08fd74f3f1595fdbd |  ami-09245d5773578a1d6  |
|  i-0b1bf24fd4f297ab9 |  ami-07cccf2bd80ed467f  |
|  i-026a2eb590b4f7234 |  ami-0c0ec0a3a3a4c34c0  |
|  i-006a6a4e8870c828f |  ami-0a70b9d193ae8a799  |
|  i-0781e91cfeca3179d |  ami-00c257e12d6828491  |
|  i-02b631e2a6ae7c2d9 |  ami-0bfddf4206f1fa7b9  |
+----------------------+-------------------------+
```

------
#### [ PowerShell ]

**查找使用不允许的 AMI 启动的实例**  
使用 [Get-EC2InstanceImageMetadata](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceImageMetadata.html) cmdlet。

```
Get-EC2InstanceImageMetadata `
    -Filter @{Name="image-allowed";Values="false"} | `
    Select InstanceId, @{Name='ImageId'; Expression={($_.ImageMetadata.ImageId)}}
```

下面是示例输出。

```
InstanceId          ImageId
----------          -------
i-08fd74f3f1595fdbd ami-09245d5773578a1d6
i-0b1bf24fd4f297ab9 ami-07cccf2bd80ed467f
i-026a2eb590b4f7234 ami-0c0ec0a3a3a4c34c0
i-006a6a4e8870c828f ami-0a70b9d193ae8a799
i-0781e91cfeca3179d ami-00c257e12d6828491
i-02b631e2a6ae7c2d9 ami-0bfddf4206f1fa7b9
```

------
#### [ AWS Config ]

您可以添加 **ec2-instance-launched-with-allowed-ami** AWS Config 规则，根据自己的要求对其进行配置，然后用来评估您的实例。

有关更多信息，请参阅 *AWS Config 开发人员指南*中的[添加 AWS Config 规则](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_add-rules.html)和 [ec2-instance-launched-with-allowed-ami](https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-launched-with-allowed-ami.html)。

------
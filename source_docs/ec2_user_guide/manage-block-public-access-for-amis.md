

# 管理 AMI 的屏蔽公共访问设置
<a name="manage-block-public-access-for-amis"></a>

您可以管理 AMI 的屏蔽公共访问设置，以控制其是否可以公开共享。您可以使用 Amazon EC2 控制台或 AWS CLI 来启用、禁用或查看 AMI 的当前屏蔽公共访问状态。

## 查看 AMI 的阻止公共访问状态
<a name="get-block-public-access-state-for-amis"></a>

要查看您的账户中是否禁止公开共享 AMI，您可以查看 AMI 的阻止公开访问状态。您必须在每个希望了解是否阻止 AMI 公开共享的 AWS 区域 中查看此状态。

**所需的权限**  
要获取 AMI 的当前屏蔽公共访问设置，您必须拥有 `GetImageBlockPublicAccessState` IAM 权限。

------
#### [ Console ]

**查看指定区域中 AMI 的阻止公开访问状态**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航栏（位于屏幕顶部）中，选择查看 AMI 的阻止公开访问状态的区域。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择**数据保护和安全**。

1. 在**阻止公开访问 AMI** 下，选中**公开访问**字段。值为**已阻止新的公开共享**或**已允许新的公开共享**。

------
#### [ AWS CLI ]

**要获取 AMI 的阻止公开访问状态**  
使用 [get-image-block-public-access-state](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-image-block-public-access-state.html) 命令。该值为 `block-new-sharing` 或 `unblocked`。

**示例：对于特定区域**

```
aws ec2 get-image-block-public-access-state --region {{us-east-1}}
```

`ManagedBy` 字段表示配置了该设置的实体。在本例中，`account` 表示是直接在账户中配置的设置。值为 `declarative-policy` 表示该设置是由声明式策略所配置。有关更多信息，请参阅《AWS Organizations User Guide》**中的 [Declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html)。

```
{
    "ImageBlockPublicAccessState": "block-new-sharing",
    "ManagedBy": "account"
}
```

**示例：对于账户中的所有区域**

```
echo -e "Region   \t Public Access State" ; \
echo -e "-------------- \t ----------------------" ; \
for region in $(
    aws ec2 describe-regions \
        --region us-east-1 \
        --query "Regions[*].[RegionName]" \
        --output text
    ); 
    do (output=$(
        aws ec2 get-image-block-public-access-state \
            --region $region \
            --output text)
        echo -e "$region \t $output" 
    );
done
```

下面是示例输出。

```
Region           Public Access State
--------------   ----------------------
ap-south-1       block-new-sharing
eu-north-1       unblocked
eu-west-3        block-new-sharing
...
```

------
#### [ PowerShell ]

**要获取 AMI 的阻止公开访问状态**  
使用 [Get-EC2ImageBlockPublicAccessState](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageBlockPublicAccessState.html) cmdlet。该值为 `block-new-sharing` 或 `unblocked`。

**示例：对于特定区域**

```
Get-EC2ImageBlockPublicAccessState -Region {{us-east-1}}
```

下面是示例输出。

```
block-new-sharing
```

**示例：对于账户中的所有区域**

```
(Get-EC2Region).RegionName | `
    ForEach-Object {
        [PSCustomObject]@{
            Region   = $_
            PublicAccessState = (Get-EC2ImageBlockPublicAccessState -Region $_)
        }
} | `
Format-Table -AutoSize
```

下面是示例输出。

```
Region         PublicAccessState
------         -----------------
ap-south-1     block-new-sharing
eu-north-1     block-new-sharing
eu-west-3      block-new-sharing
...
```

------

## 启用阻止公开访问 AMI
<a name="enable-block-public-access-for-amis"></a>

要防止公开共享您的 AMI，请在账户级别启用阻止公开访问 AMI。您必须在要阻止公开共享 AMI 的每个 AWS 区域 中启用阻止公开访问 AMI。如果您已经有公开 AMI，它们将保持公开状态。

**所需的权限**  
要启用 AMI 的屏蔽公共访问设置，您必须拥有 `EnableImageBlockPublicAccess` IAM 权限。

**注意事项**
+ 最多可能需要 10 分钟来配置此设置。在此期间，如果您描述了公共访问状态，则响应为 `unblocked`。配置完成后，响应将为 `block-new-sharing`。

------
#### [ Console ]

**在指定区域中启用阻止公开访问 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航栏（位于屏幕顶部）中，选择启用阻止公开访问 AMI 的区域。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择**数据保护和安全**。

1. 在**阻止公开访问 AMI** 下，选择**管理**。

1. 选择**阻止新的公开共享**复选框，然后选择**更新**。

------
#### [ AWS CLI ]

**要启用 AMI 的阻止公开访问**  
使用 [enable-image-block-public-access](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-image-block-public-access.html) 命令。

**示例：对于特定区域**

```
aws ec2 enable-image-block-public-access \
--region {{us-east-1}} \
--image-block-public-access-state block-new-sharing
```

下面是示例输出。

```
{ 
    "ImageBlockPublicAccessState": "block-new-sharing"
}
```

**示例：对于账户中的所有区域**

```
echo -e "Region   \t Public Access State" ; \
echo -e "-------------- \t ----------------------" ; \
for region in $(
    aws ec2 describe-regions \
        --region us-east-1 \
        --query "Regions[*].[RegionName]" \
        --output text
    ); 
    do (output=$(
        aws ec2 enable-image-block-public-access \
            --region $region \
            --image-block-public-access-state block-new-sharing \
            --output text)
        echo -e "$region \t $output" 
    );
done
```

下面是示例输出。

```
Region           Public Access State
--------------   ----------------------
ap-south-1       block-new-sharing
eu-north-1       block-new-sharing
eu-west-3        block-new-sharing
...
```

------
#### [ PowerShell ]

**要启用 AMI 的阻止公开访问**  
使用 [Enable-EC2ImageBlockPublicAccess](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-EC2ImageBlockPublicAccess.html) 命令。

**示例：对于特定区域**

```
Enable-EC2ImageBlockPublicAccess `
    -Region {{us-east-1}} `
    -ImageBlockPublicAccessState block-new-sharing
```

下面是示例输出。

```
Value
-----
block-new-sharing
```

**示例：对于账户中的所有区域**

```
(Get-EC2Region).RegionName | `
    ForEach-Object {
    [PSCustomObject]@{
        Region            = $_
        PublicAccessState = (
        Enable-EC2ImageBlockPublicAccess `
         -Region $_ `
         -ImageBlockPublicAccessState block-new-sharing)
    }
} | `
Format-Table -AutoSize
```

下面是示例输出。

```
Region         PublicAccessState
------         -----------------
ap-south-1     block-new-sharing
eu-north-1     block-new-sharing
eu-west-3      block-new-sharing
...
```

------

## 禁用阻止公开访问 AMI
<a name="disable-block-public-access-for-amis"></a>

要允许您账户中的用户公开共享您的 AMI，请在账户级别禁用阻止公开访问。在要允许公开共享 AMI 的每个 AWS 区域 中，您都必须禁用阻止公开访问 AMI。

**所需的权限**  
要禁用 AMI 的屏蔽公共访问设置，您必须拥有 `DisableImageBlockPublicAccess` IAM 权限。

**注意事项**
+ 最多可能需要 10 分钟来配置此设置。在此期间，如果您描述了公共访问状态，则响应为 `block-new-sharing`。配置完成后，响应将为 `unblocked`。

------
#### [ Console ]

**在指定区域禁用阻止公开访问 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航栏（位于屏幕顶部）中，选择禁用阻止公开访问 AMI 的区域。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择**数据保护和安全**。

1. 在**阻止公开访问 AMI** 下，选择**管理**。

1. 清除**阻止新的公开共享**复选框，然后选择**更新**。

1. 提示进行确认时，输入 **confirm**，然后选择**允许公开共享**。

------
#### [ AWS CLI ]

**要禁用 AMI 的阻止公开访问**  
使用 [disable-image-block-public-access](https://docs.aws.amazon.com/cli/latest/reference/ec2/disable-image-block-public-access.html) 命令。

**示例：对于特定区域**

```
aws ec2 disable-image-block-public-access --region {{us-east-1}}
```

下面是示例输出。

```
{
   "ImageBlockPublicAccessState": "unblocked"
}
```

**示例：对于账户中的所有区域**

```
echo -e "Region   \t Public Access State" ; \
echo -e "-------------- \t ----------------------" ; \
for region in $(
    aws ec2 describe-regions \
        --region us-east-1 \
        --query "Regions[*].[RegionName]" \
        --output text
    ); 
    do (output=$(
        aws ec2 disable-image-block-public-access \
            --region $region \
            --output text)
        echo -e "$region \t $output" 
    );
done
```

下面是示例输出。

```
Region           Public Access State
--------------   ----------------------
ap-south-1       unblocked
eu-north-1       unblocked
eu-west-3        unblocked
...
```

------
#### [ PowerShell ]

**要禁用 AMI 的阻止公开访问**  
使用 [Disable-EC2ImageBlockPublicAccess](https://docs.aws.amazon.com/powershell/latest/reference/items/Disable-EC2ImageBlockPublicAccess.html) cmdlet。

**示例：对于特定区域**

```
Disable-EC2ImageBlockPublicAccess -Region {{us-east-1}}
```

下面是示例输出。

```
Value
-----
unblocked
```

**示例：对于账户中的所有区域**

```
(Get-EC2Region).RegionName | `
    ForEach-Object {
    [PSCustomObject]@{
        Region            = $_
        PublicAccessState = (Disable-EC2ImageBlockPublicAccess -Region $_)
    }
} | `
Format-Table -AutoSize
```

下面是示例输出。

```
Region         PublicAccessState
------         -----------------
ap-south-1     unblocked
eu-north-1     unblocked
eu-west-3      unblocked
...
```

------


# 为新实例配置实例元数据选项
<a name="configuring-IMDS-new-instances"></a>

可为新实例配置以下实例元数据选项。

**Topics**
+ [要求使用 IMDSv2](#configure-IMDS-new-instances)
+ [启用 IMDS IPv4 和 IPv6 端点](#configure-IMDS-new-instances-ipv4-ipv6-endpoints)
+ [关闭对实例元数据的访问](#configure-IMDS-new-instances--turn-off-instance-metadata)
+ [允许访问实例元数据中的标签](#configure-IMDS-new-instances-tags-in-instance-metadata)

**注意**  
这些选项的设置在账户级别配置，可以直接在账户中配置，也可以使用声明式策略进行配置。必须在要配置实例元数据选项的每个 AWS 区域中对选项进行配置。使用声明式策略允许同时将设置应用于多个区域，也可以同时应用于多个账户。当使用声明式策略时，您无法直接在账户中修改设置。本主题介绍如何直接在账户中配置设置。有关使用声明式策略的信息，请参阅《AWS Organizations User Guide》**中的 [Declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html)。

## 要求使用 IMDSv2
<a name="configure-IMDS-new-instances"></a>

可以使用以下方法要求在新实例上使用 IMDSv2。

**Topics**
+ [将 IMDSv2 设置为账户默认设置](#set-imdsv2-account-defaults)
+ [在账户级别强制使用 IMDSv2](#enforce-imdsv2-at-the-account-level)
+ [在启动时配置实例](#configure-IMDS-new-instances-instance-settings)
+ [配置 AMI](#configure-IMDS-new-instances-ami-configuration)
+ [使用 IAM policy](#configure-IMDS-new-instances-iam-policy)

### 将 IMDSv2 设置为账户默认设置
<a name="set-imdsv2-account-defaults"></a>

可以在账户级别为每个 AWS 区域 设置实例元数据服务（IMDS）的默认版本。这意味着在启动*新*实例后，实例元数据版本会自动设置为该账户级别的默认值。但是，您可以在启动实例时或启动实例后手动覆盖该值。有关账户级别设置和手动覆盖会如何影响实例的更多信息，请参阅 [实例元数据选项的优先顺序](configuring-instance-metadata-options.md#instance-metadata-options-order-of-precedence)。

**注意**  
设置账户级别的默认值不会重置*现有的*实例。例如，假设您将账户级别的默认值设置为 IMDSv2，则任何设置为 IMDSv1 的现有实例都不会受到影响。如果要更改现有实例的值，则必须手动更改相关实例本身的值。

您可以将实例元数据版本的账户默认值设置为 IMDSv2，这样账户中的所有*新*实例启动时都会需要 IMDSv2，而 IMDSv1 将被禁用。如果应用此账户默认设置，以下是该实例启动时的默认值：
+ 控制台：**元数据版本**设置为**仅 V2（需要令牌）**，并且**元数据响应跃点限制**设置为 **2**。
+ AWS CLI：`HttpTokens` 设置为 `required`，并且 `HttpPutResponseHopLimit` 设置为 `2`。

**注意**  
在将账户默认值设置为 IMDSv2 之前，请确保您的实例不依赖 IMDSv1。有关更多信息，请参阅 [要求 IMDSv2 的建议途径](instance-metadata-transition-to-version-2.md#recommended-path-for-requiring-imdsv2)。

------
#### [ Console ]

**将 IMDSv2 设置为指定区域内的账户默认设置**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 要更改 AWS 区域，请使用页面右上角的区域选择器。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择**数据保护和安全**。

1. 选择 **IMDS 默认设置**旁边的**管理**。

1. 在**管理 IMDS 默认设置**页面上，执行以下操作：

   1. 对于**实例元数据服务**，选择**启用**。

   1. 对于 **Metadata version**（元数据版本），选择 **V2 only (token required)**（仅限 V2（需要令牌））。

   1. 对于**元数据响应跃点限制**，如果实例将托管容器，请指定 **2**。否则，请选择**无首选项**。如果未指定首选项，则在启动时，如果 AMI 具有设置 `ImdsSupport: v2.0`，则该值默认为 **2**；否则默认为 **1**。

   1. 选择**更新**。

------
#### [ AWS CLI ]

**将 IMDSv2 设置为指定区域内的账户默认设置**  
使用 [modify-instance-metadata-defaults](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-defaults.html) 命令，并指定要在其中修改 IMDS 账户级别设置的区域。如果实例将托管容器，则将 `--http-tokens` 设置为 `required`，并将 `--http-put-response-hop-limit` 设置为 `2`。否则，请指定 `-1`，表示无首选项。如果已指定 `-1`（无首选项），则在启动时，如果 AMI 具有设置 `ImdsSupport: v2.0`，则该值默认为 `2`；否则默认为 `1`。

```
aws ec2 modify-instance-metadata-defaults \
    --region {{us-east-1}} \
    --http-tokens required \
    --http-put-response-hop-limit {{2}}
```

下面是示例输出。

```
{
    "Return": true
}
```

**查看指定区域的实例元数据选项的默认账户设置**  
使用 [get-instance-metadata-defaults](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-metadata-defaults.html) 命令并指定区域。

```
aws ec2 get-instance-metadata-defaults --region {{us-east-1}}
```

下面是示例输出。

```
{
    "AccountLevel": {
        "HttpTokens": "required",
        "HttpPutResponseHopLimit": 2
    },
    "ManagedBy": "account"
}
```

`ManagedBy` 字段表示配置了该设置的实体。在本例中，`account` 表示是直接在账户中配置的设置。值为 `declarative-policy` 表示设置是由声明式策略所配置。有关更多信息，请参阅《AWS Organizations User Guide》**中的 [Declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html)。

**将 IMDSv2 设置为所有区域的账户默认设置**  
使用 [modify-instance-metadata-defaults](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-defaults.html) 命令修改所有区域的 IMDS 账户级别设置。如果实例将托管容器，则将 `--http-tokens` 设置为 `required`，并将 `--http-put-response-hop-limit` 设置为 `2`。否则，请指定 `-1`，表示无首选项。如果已指定 `-1`（无首选项），则在启动时，如果 AMI 具有设置 `ImdsSupport: v2.0`，则该值默认为 `2`；否则默认为 `1`。

```
echo -e "Region          \t Modified" ; \
echo -e "--------------  \t ---------" ; \
for region in $(
    aws ec2 describe-regions \
        --region us-east-1 \
        --query "Regions[*].[RegionName]" \
        --output text
    ); 
    do (output=$(
        aws ec2 modify-instance-metadata-defaults \
            --region $region \
            --http-tokens required \
            --http-put-response-hop-limit {{2}} \
            --output text)
        echo -e "$region        \t $output"
    );
done
```

下面是示例输出。

```
Region                   Modified
--------------           ---------
ap-south-1               True
eu-north-1               True
eu-west-3                True
...
```

**查看所有区域实例元数据选项的默认账户设置**  
使用 [get-instance-metadata-defaults](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-metadata-defaults.html) 命令。

```
echo -e "Region   \t Level          Hops    HttpTokens" ; \
echo -e "-------------- \t ------------   ----    ----------" ; \
for region in $(
    aws ec2 describe-regions \
        --region us-east-1 \
        --query "Regions[*].[RegionName]" \
        --output text
    ); 
    do (output=$(
        aws ec2 get-instance-metadata-defaults \
            --region $region \
            --output text)
        echo -e "$region \t $output" 
    );
done
```

下面是示例输出。

```
Region           Level          Hops    HttpTokens
--------------   ------------   ----    ----------
ap-south-1       ACCOUNTLEVEL   2       required
eu-north-1       ACCOUNTLEVEL   2       required
eu-west-3        ACCOUNTLEVEL   2       required
...
```

------
#### [ PowerShell ]

**将 IMDSv2 设置为指定区域内的账户默认设置**  
使用 [Edit-EC2InstanceMetadataDefault](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataDefault.html) cmdlet，并指定要在其中修改 IMDS 账户级别设置的区域。如果实例将托管容器，则将 `-HttpToken` 设置为 `required`，并将 `-HttpPutResponseHopLimit` 设置为 `2`。否则，请指定 `-1`，表示无首选项。如果已指定 `-1`（无首选项），则在启动时，如果 AMI 具有设置 `ImdsSupport: v2.0`，则该值默认为 `2`；否则默认为 `1`。

```
Edit-EC2InstanceMetadataDefault `
    -Region {{us-east-1}} `
    -HttpToken required `
    -HttpPutResponseHopLimit {{2}}
```

下面是示例输出。

```
True
```

**查看指定区域的实例元数据选项的默认账户设置**  
使用 [Get-EC2InstanceMetadataDefault](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceMetadataDefault.html) cmdlet 并指定区域。

```
Get-EC2InstanceMetadataDefault -Region {{us-east-1}} | Format-List
```

下面是示例输出。

```
HttpEndpoint            : 
HttpPutResponseHopLimit : {{2}}
HttpTokens              : required
InstanceMetadataTags    :
```

**将 IMDSv2 设置为所有区域的账户默认设置**  
使用 [Edit-EC2InstanceMetadataDefault](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataDefault.html) cmdlet 修改所有区域的 IMDS 账户级别设置。如果实例将托管容器，则将 `-HttpToken` 设置为 `required`，并将 `-HttpPutResponseHopLimit` 设置为 `2`。否则，请指定 `-1`，表示无首选项。如果已指定 `-1`（无首选项），则在启动时，如果 AMI 具有设置 `ImdsSupport: v2.0`，则该值默认为 `2`；否则默认为 `1`。

```
(Get-EC2Region).RegionName | `
    ForEach-Object {
    [PSCustomObject]@{
        Region   = $_
        Modified = (Edit-EC2InstanceMetadataDefault `
                -Region $_ `
                -HttpToken required `
                -HttpPutResponseHopLimit {{2}})
    } 
} | `
Format-Table Region, Modified -AutoSize
```

预期输出

```
Region         Modified
------         --------
ap-south-1         True
eu-north-1         True
eu-west-3          True
...
```

**查看所有区域实例元数据选项的默认账户设置**  
使用 [Get-EC2InstanceMetadataDefault](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceMetadataDefault.html) cmdlet。

```
(Get-EC2Region).RegionName | `
    ForEach-Object {
    [PSCustomObject]@{
        Region = $_
        HttpPutResponseHopLimit = (Get-EC2InstanceMetadataDefault -Region $_).HttpPutResponseHopLimit
        HttpTokens              = (Get-EC2InstanceMetadataDefault -Region $_).HttpTokens
    }
} | `
Format-Table -AutoSize
```

示例输出

```
Region         HttpPutResponseHopLimit HttpTokens
------         ----------------------- ----------
ap-south-1                           2 required
eu-north-1                           2 required
eu-west-3                            2 required                    
...
```

------

### 在账户级别强制使用 IMDSv2
<a name="enforce-imdsv2-at-the-account-level"></a>

可以在账户级别为每个 AWS 区域强制要求使用 IMDSv2。强制使用后，实例只有配置为必须使用 IMDSv2 时才能启动。无论实例配置或 AMI 配置如何，都必须遵守此强制使用要求。

**注意**  
在账户级别启用 IMDSv2 强制使用之前，请确保您的应用程序和 AMI 支持 IMDSv2。有关更多信息，请参阅 [要求 IMDSv2 的建议途径](instance-metadata-transition-to-version-2.md#recommended-path-for-requiring-imdsv2)。如果启用了 IMDSv2 强制使用，但未在启动时的实例配置中或在账户设置或 AMI 配置中将 `httpTokens` 设置为 `required`，则实例启动将会失败。有关问题排查信息，请参阅[启动启用 IMDSv1 的实例时失败](troubleshooting-launch.md#launching-an-imdsv1-enabled-instance-fails)。

**注意**  
此设置不会更改现有实例的 IMDS 版本，但会阻止在当前已禁用 IMDSv1 的现有实例上启用 IMDSv1。

------
#### [ Console ]

**在指定区域中为账户强制使用 IMDSv2**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 要更改 AWS 区域，请使用页面右上角的区域选择器。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择**数据保护和安全**。

1. 选择 **IMDS 默认设置**旁边的**管理**。

1. 在**管理 IMDS 默认设置**页面上，执行以下操作：

   1. 对于 **Metadata version**（元数据版本），选择 **V2 only (token required)**（仅限 V2（需要令牌））。

   1. 对于**强制使用 IMDSv2**，请选择**已启用**。

   1. 选择**更新**。

------
#### [ AWS CLI ]

**在指定区域中为账户强制使用 IMDSv2**  
 使用 [modify-instance-metadata-defaults](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-defaults.html) 命令，并指定要强制使用 IMDSv2 的区域。

```
aws ec2 modify-instance-metadata-defaults \
    --region {{us-east-1}} \
    --http-tokens required \
    --http-tokens-enforced enabled
```

下面是示例输出。

```
{
"Return": true
}
```

**查看指定区域中的账户 IMDSv2 强制使用设置**  
使用 [get-instance-metadata-defaults](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-metadata-defaults.html) 命令并指定区域。

```
aws ec2 get-instance-metadata-defaults --region {{us-east-1}}
```

下面是示例输出。

```
{
    "AccountLevel": {
        "HttpTokens": "required",
        "HttpTokensEnforced": "enabled"
    },
    "ManagedBy": "account"
}
```

`ManagedBy` 字段表示配置了该设置的实体。在本例中，`account` 表示是直接在账户中配置的设置。值为 `declarative-policy` 表示设置是由声明式策略所配置。有关更多信息，请参阅《AWS 用户指南》中的 [Declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html)**。

**在所有区域为账户强制使用 IMDSv2**  
使用 [modify-instance-metadata-defaults](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-defaults.html) 命令，以在所有区域强制使用 IMDSv2。

```
echo -e "Region          \t Modified" ; \
echo -e "--------------  \t ---------" ; \
for region in $(
    aws ec2 describe-regions \
        --region us-east-1 \
        --query "Regions[*].[RegionName]" \
        --output text
    ); 
    do (output=$(
        aws ec2 modify-instance-metadata-defaults \
            --region $region \
            --http-tokens-enforced enabled \
            --output text)
        echo -e "$region        \t $output"
    );
done
```

下面是示例输出。

```
Region                   Modified
--------------           ---------
ap-south-1               True
eu-north-1               True
eu-west-3                True
...
```

**查看所有区域中的账户 IMDSv2 强制使用设置**  
使用 [get-instance-metadata-defaults](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-metadata-defaults.html) 命令。

```
echo -e "Region   \t Level           HttpTokensEnforced" ; \
echo -e "-------------- \t ------------   ----------------" ; \
for region in $(
    aws ec2 describe-regions \
        --region us-east-1 \
        --query "Regions[*].[RegionName]" \
        --output text
    ); 
    do (output=$(
        aws ec2 get-instance-metadata-defaults \
            --region $region \
            --query 'AccountLevel.HttpTokensEnforced' \           
            --output text)
        echo -e "$region \t ACCOUNTLEVEL $output" 
    );
done
```

下面是示例输出。

```
Region           Level          HttpTokensEnforced
--------------   ------------   ------------------
ap-south-1       ACCOUNTLEVEL   enabled
eu-north-1       ACCOUNTLEVEL   enabled
eu-west-3        ACCOUNTLEVEL   enabled
...
```

------
#### [ PowerShell ]

**在指定区域中为账户强制使用 IMDSv2**  
使用 [Edit-EC2InstanceMetadataDefault](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataDefault.html) cmdlet，并指定要强制使用 IMDSv2 的区域。

```
Edit-EC2InstanceMetadataDefault `
    -Region {{us-east-1}} `
    -HttpToken required `
    -HttpPutResponseHopLimit 2
```

下面是示例输出。

```
@{
    Return = $true
}
```

**查看指定区域中的账户 IMDSv2 强制使用设置**  
使用 Get-EC2InstanceMetadataDefault 命令并指定区域。

```
Get-EC2InstanceMetadataDefault -Region {{us-east-1}}
```

下面是示例输出。

```
@{
    AccountLevel = @{
        HttpTokens = "required"
        HttpTokensEnforced = "enabled"
    }
    ManagedBy = "account"
}
```

`ManagedBy` 字段表示配置了该设置的实体。在本例中，`account` 表示是直接在账户中配置的设置。值为 `declarative-policy` 表示设置是由声明式策略所配置。有关更多信息，请参阅《AWS 用户指南》中的 [Declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html)**。

**在所有区域为账户强制使用 IMDSv2**  
使用 [modify-instance-metadata-defaults](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-defaults.html) 命令，以在所有区域强制使用 IMDSv2。

```
echo -e "Region          \t Modified" ; \
echo -e "--------------  \t ---------" ; \
for region in $(
    aws ec2 describe-regions \
        --region us-east-1 \
        --query "Regions[*].[RegionName]" \
        --output text
    ); 
    do (output=$(
        aws ec2 modify-instance-metadata-defaults \
            --region $region \
            --http-tokens-enforced enabled \
            --output text)
        echo -e "$region        \t $output"
    );
done
```

下面是示例输出。

```
Region                   Modified
--------------           ---------
ap-south-1               True
eu-north-1               True
eu-west-3                True
...
```

**将 IMDSv2 设置为所有区域的账户默认设置**  
使用 [Edit-EC2InstanceMetadataDefault](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataDefault.html) cmdlet 修改所有区域的 IMDS 账户级别设置。如果实例将托管容器，则将 `-HttpToken` 设置为 `required`，并将 `-HttpPutResponseHopLimit` 设置为 `2`。否则，请指定 `-1`，表示无首选项。如果已指定 `-1`（无首选项），则在启动时，如果 AMI 具有设置 `ImdsSupport: v2.0`，则该值默认为 `2`；否则默认为 `1`。

```
(Get-EC2Region).RegionName | `
    ForEach-Object {
    [PSCustomObject]@{
        Region   = $_
        Modified = (Edit-EC2InstanceMetadataDefault `
                -Region $_ `
                -HttpToken required `
                -HttpPutResponseHopLimit {{2}})
    } 
} | `
Format-Table Region, Modified -AutoSize
```

预期输出

```
Region         Modified
------         --------
ap-south-1         True
eu-north-1         True
eu-west-3          True
...
```

**查看所有区域实例元数据选项的默认账户设置**  
使用 [Get-EC2InstanceMetadataDefault](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceMetadataDefault.html) cmdlet。

```
(Get-EC2Region).RegionName | `
    ForEach-Object {
    [PSCustomObject]@{
        Region = $_
        HttpPutResponseHopLimit = (Get-EC2InstanceMetadataDefault -Region $_).HttpPutResponseHopLimit
        HttpTokens              = (Get-EC2InstanceMetadataDefault -Region $_).HttpTokens
    }
} | `
Format-Table -AutoSize
```

示例输出

```
Region         HttpPutResponseHopLimit HttpTokens
------         ----------------------- ----------
ap-south-1                           2 required
eu-north-1                           2 required
eu-west-3                            2 required                    
...
```

------

### 在启动时配置实例
<a name="configure-IMDS-new-instances-instance-settings"></a>

当您 [启动实例](ec2-launch-instance-wizard.md) 时，您可以通过配置以下字段，从而将实例配置为要求使用 IMDSv2：
+ Amazon EC2 控制台：将 **Metadata version**（元数据版本）设置为 **V2 only (token required)** [仅 V2（必须使用令牌）]。
+ AWS CLI：将 `HttpTokens` 设置为 `required`。

当您指定必须使用 IMDSv2 时，还必须将**可访问元数据**设置为**已启用**（控制台），或将 `HttpEndpoint` 设置为 `enabled`（AWS CLI），以启用实例元数据服务（IMDS）端点。

在容器环境中，需要 IMDSv2 时，我们建议将跃点限制设置为 `2`。有关更多信息，请参阅 [实例元数据访问注意事项](instancedata-data-retrieval.md#imds-considerations)。

------
#### [ Console ]

**要求在新实例上使用 IMDSv2**
+ 在 Amazon EC2 控制台中启动新实例时，展开 **Advanced details**（高级详细信息），然后执行以下操作：
  + 对于 **Metadata accessible**（可访问的元数据），选择 **Enabled**（已启用）。
  + 对于 **Metadata version**（元数据版本），选择 **V2 only (token required)**（仅限 V2（需要令牌））。
  + （容器环境）对于**元数据响应跃点限制**，请选择 **2**。

  有关更多信息，请参阅 [高级详细信息](ec2-instance-launch-parameters.md#liw-advanced-details)。

------
#### [ AWS CLI ]

**要求在新实例上使用 IMDSv2**  
以下 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 示例会启动 `c6i.large` 设置为 `--metadata-options` 的 `HttpTokens=required` 实例。在为 `HttpTokens` 指定值时，还必须将 `HttpEndpoint` 设置为 `enabled`。由于元数据检索请求的安全令牌标头设置为 `required`，这会在请求实例元数据时要求实例使用 IMDSv2。

在容器环境中，需要 IMDSv2 时，我们建议使用 `HttpPutResponseHopLimit=2` 将跃点限制设置为 `2`。

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --instance-type {{c6i.large}} \
	...
    --metadata-options "HttpEndpoint=enabled,HttpTokens=required,HttpPutResponseHopLimit=2"
```

------
#### [ PowerShell ]

**要求在新实例上使用 IMDSv2**  
以下 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 示例启动了一个 `c6i.large` 实例，并将 `MetadataOptions_HttpEndpoint` 设置为 `enabled`，将 `MetadataOptions_HttpTokens` 参数设置为 `required`。在为 `HttpTokens` 指定值时，还必须将 `HttpEndpoint` 设置为 `enabled`。由于元数据检索请求的安全令牌标头设置为 `required`，这会在请求实例元数据时要求实例使用 IMDSv2。

```
New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{c6i.large}} `
    -MetadataOptions_HttpEndpoint enabled `
    -MetadataOptions_HttpTokens required
```

------
#### [ CloudFormation ]

要使用 CloudFormation 指定实例的元数据选项，请参阅 *AWS CloudFormation 用户指南*中的 [亚马逊云科技::EC2::LaunchTemplate MetadataOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-metadataoptions.html) 属性。

------

### 配置 AMI
<a name="configure-IMDS-new-instances-ami-configuration"></a>

注册新 AMI 或修改现有 AMI 时，可将 `imds-support` 参数设置为 `v2.0`。从此 AMI 启动的实例会将**元数据版本**设置为 **仅 V2（必须使用令牌）**（控制台），或将 `HttpTokens` 设置为 `required`（AWS CLI）。借助这些设置，实例将要求在请求实例元数据时使用 IMDSv2。

请注意，如果您将 `imds-support` 设置为 `v2.0`，从此 AMI 启动的实例还会将 **Metadata response hop limit**（元数据响应跃点限制）（控制台）或 `http-put-response-hop-limit`（AWS CLI）将设置为 **2**。

**重要**  
除非 AMI 软件支持 IMDSv2，否则不要使用该参数。将值设置为 `v2.0` 后，无法撤消。“重置”AMI 的唯一方法是从底层快照创建新的 AMI。

**为 IMDSv2 配置新的 AMI**  
使用以下方法之一将新 AMI 配置为 IMDSv2。

------
#### [ AWS CLI ]

下面的 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 示例将使用某个 EBS 根卷的指定快照的 AMI 注册为设备 `/dev/xvda`。为 `imds-support` 参数指定 `v2.0`，以便从此 AMI 启动的实例要求在请求实例元数据时使用 IMDSv2。

```
aws ec2 register-image \
    --name {{my-image}} \
    --root-device-name /dev/xvda \
    --block-device-mappings DeviceName=/dev/xvda,Ebs={SnapshotId=snap-{{0123456789example}}} \
    --architecture x86_64 \
    --imds-support v2.0
```

------
#### [ PowerShell ]

以下 [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html) cmdlet 示例将 EBS 根卷的指定快照作为设备 `/dev/xvda` 来注册了一个 AMI。为 `ImdsSupport` 参数指定 `v2.0`，以便从此 AMI 启动的实例要求在请求实例元数据时使用 IMDSv2。

```
Register-EC2Image `
    -Name '{{my-image}}' `
    -RootDeviceName /dev/xvda `
    -BlockDeviceMapping  ( 
    New-Object `
        -TypeName Amazon.EC2.Model.BlockDeviceMapping `
        -Property @{ 
        DeviceName = '/dev/xvda'; 
        EBS        = (New-Object -TypeName Amazon.EC2.Model.EbsBlockDevice -Property @{ 
                SnapshotId = 'snap-{{0123456789example}}'
                VolumeType = 'gp3' 
                } )      
        }  ) `
    -Architecture X86_64 `
    -ImdsSupport v2.0
```

------

**为 IMDSv2 配置现有 AMI**  
使用以下方法之一配置 IMDSv2 的现有 AMI。

------
#### [ AWS CLI ]

以下 [modify-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-image-attribute.html) 示例仅为 IMDSv2 修改现有 AMI。为 `imds-support` 参数指定 `v2.0`，以便从此 AMI 启动的实例要求在请求实例元数据时使用 IMDSv2。

```
aws ec2 modify-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --imds-support v2.0
```

------
#### [ PowerShell ]

以下 [Edit-EC2ImageAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2ImageAttribute.html) cmdlet 示例仅修改了 IMDSv2 的一个现有 AMI。为 `imds-support` 参数指定 `v2.0`，以便从此 AMI 启动的实例要求在请求实例元数据时使用 IMDSv2。

```
Edit-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -ImdsSupport 'v2.0'
```

------

### 使用 IAM policy
<a name="configure-IMDS-new-instances-iam-policy"></a>

您可以创建一个将执行以下操作之一的 IAM 策略：
+ 除非要求必须在新实例上使用 IMDSv2，否则阻止用户启动新实例。
+ 阻止用户调用 ModifyInstanceMetadataOptions API 来更改正在运行的实例的元数据选项。限制对 ModifyInstanceMetadataOptions httpTokens 属性的访问，以防止对正在运行的实例进行意外的更新。
+ 阻止用户调用 ModifyInstanceMetadataDefaults API 来更改 httpTokens 和 httpTokensEnforced 的账户默认设置。限制对这两个属性的访问，将确保只有获得授权的角色才能修改账户默认值。

**使用 IAM policy 强制要求在所有新实例上使用 IMDSv2**  
要确保用户只能启动要求在请求实例元数据时使用 IMDSv2 的实例，请执行以下操作：
+ 限制对 `ModifyInstanceMetadataOptions` 和 `ModifyInstanceMetadataDefaults` API 的访问，更具体而言是限制对 `httpTokens` 和 `httpTokensEnforced` 属性的访问。
+ 然后将账户默认值设置为 `httpTokens = required` 和 `httpTokensEnforced = enabled`。

  有关示例 IAM policy，请参阅 [使用实例元数据](ExamplePolicies_EC2.md#iam-example-instance-metadata)。

## 启用 IMDS IPv4 和 IPv6 端点
<a name="configure-IMDS-new-instances-ipv4-ipv6-endpoints"></a>

实例上的 IMDS 有两个端点：IPv4 (`169.254.169.254`) 和 IPv6 (`[fd00:ec2::254]`)。启用 IMDS 时，会自动启用 IPv4 端点。即使将实例启动到仅限 IPv6 的子网中，IPv6 端点仍处于禁用状态。要启用 IPv6 端点，需将其显式启用。启用 IPv6 端点后，IPv4 端点将保持启用状态。

您可以在启动实例时或启动实例之后启用 IPv6 端点。

**启用 IPv6 端点的要求**
+ 所选的实例类型是[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。
+ 选定的子网支持 IPv6，其中子网[要么为双堆栈，要么仅限 IPv6](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html#subnet-ip-address-range)。

使用以下方法之一启动启用了 IMDS IPv6 端点的实例。

------
#### [ Console ]

**在启动实例时启用 IMDS IPv6 端点**
+ 在 Amazon EC2 控制台中 [启动实例](ec2-launch-instance-wizard.md)，并在 **Advanced details**（高级详细信息）下指定以下参数：
  + 对于**元数据 IPv6 端点**，选择**启用**。

有关更多信息，请参阅 [高级详细信息](ec2-instance-launch-parameters.md#liw-advanced-details)。

------
#### [ AWS CLI ]

**在启动实例时启用 IMDS IPv6 端点**  
下方 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 示例会启动一个为 IMDS 启用了 IPv6 端点的 `c6i.large` 实例。要启用 IPv6 端点，请将 `--metadata-options` 参数指定为 `HttpProtocolIpv6=enabled`。在为 `HttpProtocolIpv6` 指定值时，还必须将 `HttpEndpoint` 设置为 `enabled`。

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --instance-type {{c6i.large}} \
    ...
    --metadata-options "HttpEndpoint=enabled,HttpProtocolIpv6=enabled"
```

------
#### [ PowerShell ]

**在启动实例时启用 IMDS IPv6 端点**  
以下 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 示例启动了一个为 IMDS 启用了 IPv6 端点的 `c6i.large` 实例。要启用 IPv6 端点，请将 `MetadataOptions_HttpProtocolIpv6` 指定为 `enabled`。在为 `MetadataOptions_HttpProtocolIpv6` 指定值时，还必须将 `MetadataOptions_HttpEndpoint` 设置为 `enabled`。

```
New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{c6i.large}} `
    -MetadataOptions_HttpEndpoint enabled `
    -MetadataOptions_HttpProtocolIpv6 enabled
```

------

## 关闭对实例元数据的访问
<a name="configure-IMDS-new-instances--turn-off-instance-metadata"></a>

您可以通过在启动实例时禁用 IMDS 来关闭对实例元数据的访问。您可以稍后通过重新启用 IMDS 来开启访问权限。有关更多信息，请参阅 [开启对实例元数据的访问权限](configuring-IMDS-existing-instances.md#enable-instance-metadata-on-existing-instances)。

**重要**  
您可以选择在启动时或启动后禁用 IMDS。如果您*在启动时*禁用 IMDS，则可能发生以下情况：  
您可能不再拥有对实例的 SSH 访问权限。`public-keys/0/openssh-key` 作为您的实例的 SSH 公钥，将无法访问，因为该密钥通常是从 EC2 实例元数据提供和访问的。
EC2 用户数据将不可用，也不会在实例启动时运行。EC2 用户数据托管在 IMDS 上。如果您禁用 IMDS，则实际上关闭了对用户数据的访问。
要访问此功能，您可以在启动后重新启用 IMDS。

------
#### [ Console ]

**要在启动时关闭对实例元数据的访问**
+ 在 Amazon EC2 控制台中 [启动实例](ec2-launch-instance-wizard.md)，并在 **Advanced details**（高级详细信息）下指定以下参数：
  + 对于 **Metadata accessible**（可访问的元数据），选择 **Disabled**（已禁用）。

有关更多信息，请参阅 [高级详细信息](ec2-instance-launch-parameters.md#liw-advanced-details)。

------
#### [ AWS CLI ]

**要在启动时关闭对实例元数据的访问**  
启动实例并将 `--metadata-options` 设置为 `HttpEndpoint=disabled`。

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --instance-type {{c6i.large}} \
    ... 
    --metadata-options "HttpEndpoint=disabled"
```

------
#### [ PowerShell ]

**要在启动时关闭对实例元数据的访问**  
以下 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 示例启动了将 `MetadataOptions_HttpEndpoint` 设置为 `disabled` 的实例。

```
New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{c6i.large}} `
    -MetadataOptions_HttpEndpoint disabled
```

------
#### [ CloudFormation ]

要使用 CloudFormation 指定实例的元数据选项，请参阅 *CloudFormation 用户指南*中的 [亚马逊云科技::EC2::LaunchTemplate MetadataOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-metadataoptions.html) 属性。

------

## 允许访问实例元数据中的标签
<a name="configure-IMDS-new-instances-tags-in-instance-metadata"></a>

默认情况下，无法访问实例元数据中的实例标签。对于每个实例，您必须明确允许访问。如果允许访问，则实例标签*键*必须符合特定的字符限制，否则实例启动将失败。有关更多信息，请参阅 [启用对实例元数据中标签的访问权限](work-with-tags-in-IMDS.md#allow-access-to-tags-in-IMDS)。
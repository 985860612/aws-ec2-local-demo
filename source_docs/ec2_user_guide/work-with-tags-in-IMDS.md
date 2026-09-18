

# 使用实例元数据来查看 EC2 实例的标签
<a name="work-with-tags-in-IMDS"></a>

您可以从实例元数据访问实例的标签。通过从实例元数据访问标签，您无需再使用 `DescribeInstances` 或 `DescribeTags` API 调用来检索标签信息，这可以减少每秒的 API 事务量，并允许您的标签检索随您控制的实例数量扩展。此外，在实例上运行的本地进程可以直接从实例元数据中查看实例的标签信息。

默认情况下，实例元数据中不提供标签；您必须明确允许访问。您可以在实例启动时或启动后在正在运行或停止的实例上允许访问。您还可以通过在启动模板中指定标签来允许访问标签。使用模板启动的实例允许访问实例元数据中的标签。

如果您添加或移除实例标签，则实例元数据将在实例运行期间更新，无需停止后再启动实例。

**Topics**
+ [启用对实例元数据中标签的访问权限](#allow-access-to-tags-in-IMDS)
+ [从实例元数据中检索标签](#retrieve-tags-from-IMDS)
+ [禁用对实例元数据中标签的访问权限](#turn-off-access-to-tags-in-IMDS)

## 启用对实例元数据中标签的访问权限
<a name="allow-access-to-tags-in-IMDS"></a>

默认情况下，无法访问实例元数据中的实例标签。对于每个实例，您必须显式启用访问权限。

**注意**  
如果您允许访问实例元数据中的标签，则实例标签*键*存在特定的限制。不合规将导致新实例启动失败或现有实例出错。这些限制包括：  
只能包含字母（`a-z`、`A-Z`）、数字 (`0-9`) 和以下字符：`+ - = . , _ : @`。
不能包含空格或 `/`。
不能只包含 `.`（一个句点）、`..`（两个句点）或 `_index`。
有关更多信息，请参阅 [标签限制](Using_Tags.md#tag-restrictions)。

------
#### [ Console ]

**在实例启动期间启用对实例元数据中标签的访问权限**

1. 按照程序[启动实例](ec2-launch-instance-wizard.md)。

1. 展开**高级详细信息**，对于**允许元数据中的标签**，选择**启用**。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

**在实例启动后启用对实例元数据中标签的访问权限**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后依次选择**操作**、**实例设置**、**允许实例元数据中的标签**。

1. 要允许访问实例元数据中的标签，请选择**允许**复选框。

1. 选择**保存**。

------
#### [ AWS CLI ]

**在实例启动期间启用对实例元数据中标签的访问权限**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令并添加以下 `--metadata-options` 选项。

```
--metadata-options "InstanceMetadataTags=enabled"
```

**在实例启动后启用对实例元数据中标签的访问权限**  
使用以下 [modify-instance-metadata-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-options.html) 命令。

```
aws ec2 modify-instance-metadata-options \
    --instance-id {{i-1234567890abcdef0}} \
    --instance-metadata-tags enabled
```

**验证对实例元数据中标签的访问权限已启用**  
使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令并检查 `InstanceMetadataTags` 的值。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --query "Reservations[*].Instances[].MetadataOptions[].InstanceMetadataTags"
```

下面是示例输出。该值为 `enabled` 或 `disabled`。

```
[
    "enabled"
]
```

------
#### [ PowerShell ]

**在实例启动期间启用对实例元数据中标签的访问权限**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 并添加以下 `-MetadataOptions_InstanceMetadataTags` 参数。

```
-MetadataOptions_InstanceMetadataTags enabled
```

**在实例启动后启用对实例元数据中标签的访问权限**  
使用 [Edit-EC2InstanceMetadataOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataOption.html) cmdlet。

```
Edit-EC2InstanceMetadataOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -InstanceMetadataTags enabled
```

**验证对实例元数据中标签的访问权限已启用**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/cli/latest/reference/ec2/Get-EC2Instance.html) cmdlet 并检查 `InstanceMetadataTags` 的值。

```
(Get-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}}).Instances.MetadataOptions.InstanceMetadataTags.Value
```

下面是示例输出。该值为 `enabled` 或 `disabled`。

```
enabled
```

------

## 从实例元数据中检索标签
<a name="retrieve-tags-from-IMDS"></a>

在允许访问实例元数据中的实例标签后，您可以从实例元数据访问 `tags/instance` 类别。有关更多信息，请参阅 [访问 EC2 实例的实例元数据](instancedata-data-retrieval.md)。

------
#### [ IMDSv2 ]

**Linux**  
在 Linux 实例中运行以下命令，列出该实例的所有标签键。

```
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
    && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/tags/instance
```

此示例会获取上一示例中获取的键的值。IMDSv2 请求使用在前面的示例中使用命令中创建的存储令牌。令牌不得过期。

```
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/tags/instance/{{tag-key}}
```

**Windows**  
在 Windows 实例中运行以下 cmdlet，列出该实例的所有标签键。

```
$token = Invoke-RestMethod `
    -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} `
    -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
Invoke-RestMethod `
    -Headers @{"X-aws-ec2-metadata-token" = $token} `
    -Method GET -Uri http://169.254.169.254/latest/meta-data/tags/instance
```

此示例会获取上一示例中获取的键的值。IMDSv2 请求使用在前面的示例中使用命令中创建的存储令牌。令牌不得过期。

```
Invoke-RestMethod `
    -Headers @{"X-aws-ec2-metadata-token" = $token} `
    -Method GET -Uri http://169.254.169.254/latest/meta-data/tags/instance/{{tag-key}}
```

------
#### [ IMDSv1 ]

**Linux**  
在 Linux 实例中运行以下命令，列出该实例的所有标签键。

```
curl http://169.254.169.254/latest/meta-data/tags/instance
```

此示例会获取上一示例中获取的键的值。

```
curl http://169.254.169.254/latest/meta-data/tags/instance/{{tag-key}}
```

**Windows**  
在 Windows 实例中运行以下 cmdlet，列出该实例的所有标签键。

```
Invoke-RestMethod -Uri http://169.254.169.254/latest/meta-data/tags/instance
```

此示例会获取上一示例中获取的键的值。

```
Invoke-RestMethod -Uri http://169.254.169.254/latest/meta-data/tags/instance/{{tag-key}}
```

------

## 禁用对实例元数据中标签的访问权限
<a name="turn-off-access-to-tags-in-IMDS"></a>

您可以禁用对实例元数据中实例标签的访问权限。您无需在启动时禁用对实例元数据中实例标签的访问权限，因此在默认情况下已禁用此权限。

------
#### [ Console ]

**禁用对实例元数据中标签的访问权限**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后依次选择** Actions**（操作）、**Instance settings**（实例设置）、**Allow tags in instance metadata**（允许实例元数据中的标签）。

1. 要关闭对实例元数据中的标签的访问，请清除**允许**复选框。

1. 选择**保存**。

------
#### [ AWS CLI ]

**禁用对实例元数据中标签的访问权限**  
使用以下 [modify-instance-metadata-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-options.html) 命令。

```
aws ec2 modify-instance-metadata-options \
    --instance-id {{i-1234567890abcdef0}} \
    --instance-metadata-tags disabled
```

------
#### [ PowerShell ]

**禁用对实例元数据中标签的访问权限**  
使用 [Edit-EC2InstanceMetadataOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataOption.html) cmdlet。

```
Edit-EC2InstanceMetadataOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -InstanceMetadataTag disabled
```

------
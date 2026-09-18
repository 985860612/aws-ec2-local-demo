

# 为现有实例修改实例元数据选项
<a name="configuring-IMDS-existing-instances"></a>

您可以修改现有实例的实例元数据选项。

您还可以创建 IAM policy，以阻止用户修改现有实例上的实例元数据选项。要控制哪些用户可以修改实例元数据选项，请指定一个策略，阻止除具有指定角色的用户以外的所有用户使用 [ModifyInstanceMetadataOptions](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceMetadataOptions.html) API。有关示例 IAM policy，请参阅 [使用实例元数据](ExamplePolicies_EC2.md#iam-example-instance-metadata)。

**注意**  
如果使用了声明式策略来配置实例元数据选项，则无法在账户中直接对选项进行修改。有关更多信息，请参阅《AWS Organizations User Guide》**中的 [Declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html)。

## 要求使用 IMDSv2
<a name="modify-require-IMDSv2"></a>

使用以下方法之一修改现有实例上的实例元数据选项，以要求在请求实例元数据时使用 IMDSv2。如果 IMDSv2 是必需的，则无法使用 IMDSv1。

**注意**  
在要求必须使用 IMDSv2 之前，请确保该实例没有进行 IMDSv1 调用。`MetadataNoToken` CloudWatch 指标会跟踪 IMDSv1 调用。当 `MetadataNoToken` 记录某个实例的 IMDSv1 使用量为零时，就可以要求该实例必须使用 IMDSv2。

------
#### [ Console ]

**要求在现有实例上使用 IMDSv2**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例。

1. 依次选择**操作**、**实例设置**、**修改实例元数据选项**。

1. 在**修改实例元数据选项**对话框中，执行以下操作：

   1. 对于**实例元数据服务**，选择**启用**。

   1. 对于**IMDSv2**，选择**必需**。

   1. 选择**保存**。

------
#### [ AWS CLI ]

**要求在现有实例上使用 IMDSv2**  
请使用 [modify-instance-metadata-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-options.html) CLI 命令，并将 `http-tokens` 参数设置为 `required`。在为 `http-tokens` 指定值时，还必须将 `http-endpoint` 设置为 `enabled`。

```
aws ec2 modify-instance-metadata-options \
    --instance-id {{i-1234567890abcdef0}} \
    --http-tokens required \
    --http-endpoint enabled
```

------
#### [ PowerShell ]

**要求在现有实例上使用 IMDSv2**  
使用 [Edit-EC2InstanceMetadataOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataOption.html) cmdlet 并将 `HttpTokens` 参数设置为 `required`。在为 `HttpTokens` 指定值时，还必须将 `HttpEndpoint` 设置为 `enabled`。

```
(Edit-EC2InstanceMetadataOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -HttpTokens required `
    -HttpEndpoint enabled).InstanceMetadataOptions
```

------

## 恢复使用 imdsv1
<a name="modify-restore-IMDSv1"></a>

在实例上要求必须使用 IMDSv2 时，使用 IMDSv1 请求将会失败。如果 IMDSv2 是可选的，则 IMDSv2 和 IMDSv1 都将正常工作。因此，要恢复使用 IMDSv1，请使用以下方法之一将 IMDSv2 设为可选 (`httpTokens = optional`)。

`httpTokensEnforced` IMDS 属性还可以防止尝试在现有实例上启用 IMDSv1。在某个区域为账户启用此功能后，尝试将 `httpTokens` 设置为 `optional` 将导致 `UnsupportedOperation` 异常。有关更多信息，请参阅 [问题排查](#troubleshoot-modifying-an-imdsv1-enabled-instance-fails)。

**重要**  
如果实例因强制使用 IMDSv2 而启动失败，则可通过两种方法成功启动：  
**将实例启动为仅限 IMDSv2**：如果在实例上运行的软件仅使用 IMDSv2（不依赖 IMDSv1），则可以将实例启动为仅限 IMDSv2。要执行此操作，请通过在启动参数或账户在该区域的元数据默认值中设置 `httpTokens = required`，从而配置仅限 IMDSv2。
**禁用强制使用**：如果您的软件仍依赖于 IMDSv1，则在该区域将账户的 `httpTokensEnforced` 设置为 `disabled`。有关更多信息，请参阅 [在账户级别强制使用 IMDSv2](configuring-IMDS-new-instances.md#enforce-imdsv2-at-the-account-level)。

------
#### [ Console ]

**恢复在实例上使用 IMDSv1**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例。

1. 依次选择**操作**、**实例设置**、**修改实例元数据选项**。

1. 在**修改实例元数据选项**对话框中，执行以下操作：

   1. 对于**实例元数据服务**，请确保选择**启用**。

   1. 对于 **IMDSv2**，选择**可选**。

   1. 选择**保存**。

------
#### [ AWS CLI ]

**恢复在实例上使用 IMDSv1**  
您可以使用 [modify-instance-metadata-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-options.html) CLI 命令并将 `http-tokens` 设置为 `optional`，以在请求实例元数据时恢复使用 IMDSv1。

```
aws ec2 modify-instance-metadata-options \
    --instance-id {{i-1234567890abcdef0}} \
    --http-tokens optional \
    --http-endpoint enabled
```

------
#### [ PowerShell ]

**恢复在实例上使用 IMDSv1**  
您可以使用 [Edit-EC2InstanceMetadataOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataOption.html) cmdlet 并将 `HttpTokens` 设置为 `optional`，以在请求实例元数据时恢复使用 IMDSv1。

```
(Edit-EC2InstanceMetadataOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -HttpTokens optional `
    -HttpEndpoint enabled).InstanceMetadataOptions
```

------

## 更改 PUT 响应跃点限制
<a name="modify-PUT-response-hop-limit"></a>

对于现有的实例，您可以更改 `PUT` 响应跃点数限制设置。

目前仅 AWS CLI 和 AWS SDK 支持更改 PUT 响应跃点限制。

------
#### [ AWS CLI ]

**更改 PUT 响应跃点限制**  
请使用 [modify-instance-metadata-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-options.html) CLI 命令，并将 `http-put-response-hop-limit` 参数设置为所需的跃点数。在以下示例中，跃点数限制设置为 `3`。请注意，在为 `http-put-response-hop-limit` 指定值时，还必须将 `http-endpoint` 设置为 `enabled`。

```
aws ec2 modify-instance-metadata-options \
    --instance-id {{i-1234567890abcdef0}} \
    --http-put-response-hop-limit {{3}} \
    --http-endpoint enabled
```

------
#### [ PowerShell ]

**更改 PUT 响应跃点限制**  
使用 [Edit-EC2InstanceMetadataOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataOption.html) cmdlet 并将 `HttpPutResponseHopLimit` 参数设置为所需的跃点数。在以下示例中，跃点数限制设置为 `3`。请注意，在为 `HttpPutResponseHopLimit` 指定值时，还必须将 `HttpEndpoint` 设置为 `enabled`。

```
(Edit-EC2InstanceMetadataOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -HttpPutResponseHopLimit 3 `
    -HttpEndpoint enabled).InstanceMetadataOptions
```

------

## 启用 IMDS IPv4 和 IPv6 端点
<a name="enable-ipv6-endpoint-for-existing-instances"></a>

实例上的 IMDS 有两个端点：IPv4 (`169.254.169.254`) 和 IPv6 (`[fd00:ec2::254]`)。启用 IMDS 时，会自动启用 IPv4 端点。即使将实例启动到仅限 IPv6 的子网中，IPv6 端点仍处于禁用状态。要启用 IPv6 端点，需将其显式启用。启用 IPv6 端点后，IPv4 端点将保持启用状态。

您可以在启动实例时或启动实例之后启用 IPv6 端点。

**启用 IPv6 端点的要求**
+ 所选的实例类型是[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。
+ 选定的子网支持 IPv6，其中子网[要么为双堆栈，要么仅限 IPv6](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html#subnet-ip-address-range)。

目前，仅 AWS CLI 和 AWS SDK 支持在启动实例后启用 IMDS IPv6 端点。

------
#### [ AWS CLI ]

**为实例启用 IMDS IPv6 端点**  
请使用 [modify-instance-metadata-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-options.html) CLI 命令，并将 `http-protocol-ipv6` 参数设置为 `enabled`。请注意，在为 `http-protocol-ipv6` 指定值时，还必须将 `http-endpoint` 设置为 `enabled`。

```
aws ec2 modify-instance-metadata-options \
	--instance-id {{i-1234567890abcdef0}} \
	--http-protocol-ipv6 enabled \
	--http-endpoint enabled
```

------
#### [ PowerShell ]

**为实例启用 IMDS IPv6 端点**  
使用 [Edit-EC2InstanceMetadataOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataOption.html) cmdlet 并将 `HttpProtocolIpv6` 参数设置为 `enabled`。请注意，在为 `HttpProtocolIpv6` 指定值时，还必须将 `HttpEndpoint` 设置为 `enabled`。

```
(Edit-EC2InstanceMetadataOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -HttpProtocolIpv6 enabled `
    -HttpEndpoint enabled).InstanceMetadataOptions
```

------

## 开启对实例元数据的访问权限
<a name="enable-instance-metadata-on-existing-instances"></a>

您可以通过启用实例上 IMDS 的 HTTP 端点来开启对实例元数据的访问权限，无论您使用的是哪个版本的 IMDS。您可以随时通过禁用 HTTP 端点来撤消该更改。

使用以下方法之一，即可开启对实例上实例元数据的访问权限。

------
#### [ Console ]

**开启对实例元数据的访问权限**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例。

1. 依次选择**操作**、**实例设置**、**修改实例元数据选项**。

1. 在**修改实例元数据选项**对话框中，执行以下操作：

   1. 对于**实例元数据服务**，选择**启用**。

   1. 选择**保存**。

------
#### [ AWS CLI ]

**开启对实例元数据的访问权限**  
请使用 [modify-instance-metadata-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-options.html) CLI 命令，并将 `http-endpoint` 参数设置为 `enabled`。

```
aws ec2 modify-instance-metadata-options \
    --instance-id {{i-1234567890abcdef0}} \
    --http-endpoint enabled
```

------
#### [ PowerShell ]

**开启对实例元数据的访问权限**  
使用 [Edit-EC2InstanceMetadataOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataOption.html) cmdlet 并将 `HttpEndpoint` 参数设置为 `enabled`。

```
(Edit-EC2InstanceMetadataOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -HttpEndpoint enabled).InstanceMetadataOptions
```

------

## 关闭对实例元数据的访问
<a name="disable-instance-metadata-on-existing-instances"></a>

您可以通过禁用实例上 IMDS 的 HTTP 端点来关闭对实例元数据的访问权限，无论您使用的是哪个版本的 IMDS。您可以随时启用 HTTP 终端节点以撤消该更改。

使用以下方法之一，即可关闭对实例上实例元数据的访问权限。

------
#### [ Console ]

**关闭对实例元数据的访问**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例。

1. 依次选择**操作**、**实例设置**、**修改实例元数据选项**。

1. 在**修改实例元数据选项**对话框中，执行以下操作：

   1. 对于**实例元数据服务**，清除**启用**。

   1. 选择**保存**。

------
#### [ AWS CLI ]

**关闭对实例元数据的访问**  
请使用 [modify-instance-metadata-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-options.html) CLI 命令，并将 `http-endpoint` 参数设置为 `disabled`。

```
aws ec2 modify-instance-metadata-options \
    --instance-id {{i-1234567890abcdef0}} \
    --http-endpoint disabled
```

------
#### [ PowerShell ]

**关闭对实例元数据的访问**  
使用 [Edit-EC2InstanceMetadataOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMetadataOption.html) cmdlet 并将 `HttpEndpoint` 参数设置为 `disabled`。

```
(Edit-EC2InstanceMetadataOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -HttpEndpoint disabled).InstanceMetadataOptions
```

------

## 允许访问实例元数据中的标签
<a name="modify-access-to-tags-in-instance-metadata-on-existing-instances"></a>

您可允许访问正在运行或已停止实例上的实例元数据中的标签。对于每个实例，您必须明确允许访问。如果允许访问，则实例标签*键*必须符合特定的字符限制，否则会出错。有关更多信息，请参阅 [启用对实例元数据中标签的访问权限](work-with-tags-in-IMDS.md#allow-access-to-tags-in-IMDS)。

## 问题排查
<a name="troubleshoot-modifying-an-imdsv1-enabled-instance-fails"></a>

### 修改启用 IMDSv1 的实例时失败
<a name="modifying-an-imdsv1-enabled-instance-fails"></a>

#### 说明
<a name="modifying-an-imdsv1-enabled-instance-fails-description"></a>

您收到了以下错误消息：

`You can't launch instances with IMDSv1 because httpTokensEnforced is enabled for this account. Either launch the instance with httpTokens=required or contact your account owner to disable httpTokensEnforced using the ModifyInstanceMetadataDefaults API or the account settings in the EC2 console.`

#### 原因
<a name="modifying-an-imdsv1-enabled-instance-fails-cause"></a>

在 EC2 账户设置或 AWS 组织声明性策略强制使用 IMDSv2 (`httpTokensEnforced = enabled`) 的账户中，尝试将现有实例修改为启用 IMDSv1 (`httpTokens = optional`) 时，将会引发此错误。

#### 解决方案
<a name="modifying-an-imdsv1-enabled-instance-fails-solution"></a>

如果需要在现有实例上支持 IMDSv1，则需要在该区域为该账户禁用 IMDSv2 强制使用。要禁用 IMDSv2 强制使用，请将 `HttpTokensEnforced` 设置为 `disabled`。有关更多信息，请参阅《Amazon EC2 API 参考》中的 [ModifyInstanceMetadataDefaults](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceMetadataDefaults.html)。如果您更喜欢使用控制台来配置此设置，请参阅[在账户级别强制使用 IMDSv2](configuring-IMDS-new-instances.md#enforce-imdsv2-at-the-account-level)。

建议使用仅限 IMDSv2 (`httpTokens=required`)。有关更多信息，请参阅 [转换为使用 实例元数据服务版本 2](instance-metadata-transition-to-version-2.md)。

 


# 转换为使用 实例元数据服务版本 2
<a name="instance-metadata-transition-to-version-2"></a>

如果要将实例配置为仅接受实例元数据服务版本 2（IMDSv2）调用，我们建议您使用以下工具和转换途径。

**Topics**
+ [转换为 IMDSv2 的工具](#tools-for-transitioning-to-imdsv2)
+ [要求 IMDSv2 的建议途径](#recommended-path-for-requiring-imdsv2)

## 转换为 IMDSv2 的工具
<a name="tools-for-transitioning-to-imdsv2"></a>

以下工具可以帮助您识别、监控和管理软件从 imdsv1 到 imdsv2 的转换。有关如何使用这些工具的说明，请参阅[要求 IMDSv2 的建议途径](#recommended-path-for-requiring-imdsv2)。

**AWS 软件**  
最新版本的 AWS CLI 和 AWS SDK 均支持 IMDSv2。要使用 IMDSv2，请更新 EC2 实例以使用最新版本。有关支持 IMDSv2 的最低 AWS 开发工具包版本，请参阅 [使用支持的 AWS 开发工具包](configuring-instance-metadata-service.md#use-a-supported-sdk-version-for-imdsv2)。  
所有的 Amazon Linux 2 和 Amazon Linux 2023 软件包都支持 IMDSv2。Amazon Linux 2023 默认禁用 IMDSv1。

**IMDS Packet Analyzer**  
IMDS Packet Analyzer 是一个开源工具，用于识别和记录您的实例启动阶段和运行时阶段的 IMDSv1 调用。通过分析这些日志，您可以精确地识别对您的实例进行 imdsv1 调用的软件，并确定需要更新哪些内容以仅在您的实例上支持 IMDSv2。您可以从命令行运行 IMDS Packet Analyzer，也可以将其作为服务安装。有关更多信息，请参阅 *GitHub* 上的 [AWS ImdsPacketAnalyzer](https://github.com/aws/aws-imds-packet-analyzer)。

**CloudWatch**  
CloudWatch 提供以下两个指标来监控实例：  
`MetadataNoToken`：IMDSv2 使用由令牌支持的会话，而 IMDSv1 不使用。`MetadataNoToken` 指标跟踪对使用 IMDSv1 的实例元数据服务（IMDS）的调用次数。通过查看该指标是否为零，您可以确定是否以及何时将所有软件升级为使用 IMDSv2。  
`MetadataNoTokenRejected`：禁用 IMDSv1 后，您可以使用 `MetadataNoTokenRejected` 指标来跟踪 IMDSv1 调用被尝试和拒绝的次数。通过跟踪该指标，您可以确定您的软件是否需要更新以使用 IMDSv2。  
对于每个 EC2 实例，这些指标是互斥的。启用 IMDSV1 (`httpTokens = optional`) 后，将仅会发出 `MetadataNoToken`。禁用 IMDSV1 (`httpTokens = required`) 后，将仅会发出 `MetadataNoTokenRejected`。有关何时该使用这些指标，请参阅[要求 IMDSv2 的建议途径](#recommended-path-for-requiring-imdsv2)。  
有关更多信息，请参阅 [实例指标](viewing_metrics_with_cloudwatch.md#ec2-cloudwatch-metrics)。

**启动 API**  
**新实例：**使用 [RunInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RunInstances.html) API 启动要求必须使用 IMDSv2 的新实例。有关更多信息，请参阅 [为新实例配置实例元数据选项](configuring-IMDS-new-instances.md)。  
**现有实例：**使用 [ModifyInstanceMetadataOptions](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceMetadataOptions.html) API 要求必须在现有实例上使用 IMDSv2。有关更多信息，请参阅 [为现有实例修改实例元数据选项](configuring-IMDS-existing-instances.md)。  
**自动扩缩组启动的新实例：**要规定必须在自动扩缩组启动的所有新实例上使用 IMDSv2，您的自动扩缩组可以使用启动模板或启动配置。当您[创建启动模板](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-launch-template.html)或[创建启动配置](https://docs.aws.amazon.com/cli/latest/reference/autoscaling/create-launch-configuration.html)时，必须配置 `MetadataOptions` 参数以要求使用 IMDSv2。自动扩缩组将使用新的启动模板或启动配置来启动新实例，但现有实例不受影响。  
**自动扩缩组中的现有实例：**使用 [ModifyInstanceMetadataOptions](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceMetadataOptions.html) API 要求必须在现有实例上使用 IMDSv2，也可终止实例，然后由自动扩缩组使用在新启动模板或启动配置中定义的实例元数据选项设置启动新的替换实例。

**AMI**  
将 `ImdsSupport` 参数设置为 `v2.0` 的 AMI 将启动默认需要 imdsv2 的实例。Amazon Linux 2023 配置了 `ImdsSupport = v2.0`。  
**新 AMI：**创建新 AMI 时，使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) CLI 命令将 `ImdsSupport` 参数设置为 `v2.0`。  
**现有 AMI：**修改现有 AMI 时，使用 [modify-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-image-attribute.html) CLI 命令将 `ImdsSupport` 参数设置为 `v2.0`。  
有关更多信息，请参阅 [配置 AMI](configuring-IMDS-new-instances.md#configure-IMDS-new-instances-ami-configuration)。

**账户级别控制**  
可以在账户级别配置所有实例元数据选项的默认值。启动实例时将会自动应用默认值。有关更多信息，请参阅[将 IMDSv2 设置为账户默认设置](configuring-IMDS-new-instances.md#set-imdsv2-account-defaults)。  
您也可以在账户级别强制要求使用 IMDSv2。启用 IMDSv2 强制使用后：  
+ **新实例：**配置为在启动时启用 IMDSv1 的实例将会启动失败
+ **已禁用 IMDSv1 的现有实例：**将阻止尝试在现有实例上启用 IMDSv1。
+ **已启用 IMDSv1 的现有实例：**已启用 IMDSv1 的现有实例不受影响。
有关更多信息，请参阅 [在账户级别强制使用 IMDSv2](configuring-IMDS-new-instances.md#enforce-imdsv2-at-the-account-level)。

**IAM policy 和 SCP**  
您可以使用 IAM policy 或 AWS Organizations 服务控制策略（SCP）来控制用户，具体如下所示：  
+ 除非将实例配置为使用 IMDSv2，否则无法使用 [RunInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RunInstances.html) API 启动实例。
+ 无法通过使用 [ModifyInstanceMetadataOptions](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceMetadataOptions.html) API 修改正在运行的实例来重新启用 IMDSv1。
IAM policy 或 SCP 必须包含以下 IAM 条件键：  
+ `ec2:MetadataHttpEndpoint`
+ `ec2:MetadataHttpPutResponseHopLimit`
+ `ec2:MetadataHttpTokens`
如果 API 或 CLI 调用中的参数与包含该条件键的策略中指定的状态不一致，则 API 或 CLI 调用将失败并显示 `UnauthorizedOperation` 响应。  
此外，您还可以选择额外的保护层以强制从 IMDSv1 更改为 IMDSv2。在与通过 EC2 角色凭证调用的 API 相关的访问管理层，您可以在 IAM 策略或 AWS Organizations 服务控制策略（SCP）中使用条件键。具体来说，通过在 IAM policy 中使用值为 `ec2:RoleDelivery` 的条件键 `2.0`，使用从 IMDSv1 获取的 EC2 角色凭证进行的 API 调用将会收到 `UnauthorizedOperation` 响应。通过使用 SCP 所需的该条件，可以更广泛地实现相同的效果。这可确保通过 IMDSv1 提供的凭证无法实际用于调用 API，因为任何不符合指定条件的 API 调用都将收到 `UnauthorizedOperation` 错误。  
有关示例 IAM policies，请参阅 [使用实例元数据](ExamplePolicies_EC2.md#iam-example-instance-metadata)。有关 SCP 的更多信息，请参阅《AWS Organizations User Guide》**中的 [Service control policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)。

**声明性策略**  
使用声明性策略（AWS Organizations 的一项功能）为整个组织集中设置 IMDS 账户默认值，包括 IMDSv2 强制使用。有关示例策略，请参阅《AWS Organizations 用户指南》中 [Supported declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative_syntax.html#declarative-policy-examples) 部分的**实例元数据**选项卡**。

## 要求 IMDSv2 的建议途径
<a name="recommended-path-for-requiring-imdsv2"></a>

**Topics**
+ [步骤1：识别 IMDSv2=optional 的实例，并审核 imdsV1 使用情况](#path-step-1)
+ [步骤 2：将软件更新为 IMDSv2](#path-step-2)
+ [步骤 3：在实例上要求 IMDSv2](#path-step-3)
+ [步骤 4：将 IMDSv2=required 设置为默认值](#path-step-4)
+ [步骤 5：强制实例要求 IMDSv2](#path-step-5)

### 步骤1：识别 IMDSv2=optional 的实例，并审核 imdsV1 使用情况
<a name="path-step-1"></a>

要评测 IMDSv2 迁移范围，请识别配置为允许 IMDSv1 或 IMDSv2 的实例，并审核 imdsv1 调用。

1. **识别配置为允许 IMDSv1 或 IMDSv2 的实例：**

------
#### [ Amazon EC2 console ]

   1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

   1. 在导航窗格中，选择 **Instances (实例)**。

   1. 要仅查看配置为允许 IMDSv1 或 IMDSv2 的实例，请添加筛选条件 **IMDSv2 = optional**。

   1. 或者，要查看 IMDSv2 对于所有实例是 **optional** 还是 **required**，请打开**首选项**窗口（齿轮图标），打开 **IMDSv2**，然后选择**确认**。这会将 **IMDSv2** 列添加到**实例**表中。

------
#### [ AWS CLI ]

   使用 [describe-instances](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/modify-instance-metadata-options.html) 命令并按 `metadata-options.http-tokens = optional` 进行筛选，如下所示：

   ```
   aws ec2 describe-instances --filters "Name=metadata-options.http-tokens,Values=optional" --query "Reservations[*].Instances[*].[InstanceId]" --output text
   ```

------

1. **审核每个实例上的 IMDSv1 调用：**

   使用 CloudWatch 指标 `MetadataNoToken`。此指标显示对实例上 IMDS 的 IMDSv1 调用次数。有关更多信息，请参阅 [实例指标](viewing_metrics_with_cloudwatch.md#ec2-cloudwatch-metrics)。

1. **识别您的实例上进行 IMDSv1 调用的软件：**

   使用开源 [IMDS Packet Analyzer](https://github.com/aws/aws-imds-packet-analyzer) 在实例启动阶段和运行时操作期间识别和记录 IMDSv1调用。使用此信息确定要更新的软件，以使您的实例准备好仅使用 IMDSv2。您可以从命令行运行 IMDS Packet Analyzer，也可以将其作为服务安装。

### 步骤 2：将软件更新为 IMDSv2
<a name="path-step-2"></a>

将在您的实例上使用角色凭证的所有 SDK、CLI 和软件更新为与 IMDSv2 兼容的版本。有关更新 CLI 的更多信息，请参阅《AWS Command Line Interface 用户指南》**中的[安装或更新最新版本的 AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)。

### 步骤 3：在实例上要求 IMDSv2
<a name="path-step-3"></a>

在通过 `MetadataNoToken` 指标确认零个 IMDSv1 调用后，请将现有实例配置为需要 IMDSv2。此外，将所有新实例配置为需要 IMDSv2。换句话说，在所有现有实例和新实例上禁用 IMDSv1。

1. **将现有实例配置为需要 IMDSv2：**

------
#### [ Amazon EC2 console ]

   1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

   1. 在导航窗格中，选择 **Instances (实例)**。

   1. 选择实例。

   1. 依次选择**操作**、**实例设置**、**修改实例元数据选项**。

   1. 对于**IMDSv2**，选择**必需**。

   1. 选择**保存**。

------
#### [ AWS CLI ]

   使用 [modify-instance-metadata-options](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/modify-instance-metadata-options.html) CLI 命令指定仅使用 IMDSv2。

------
**注意**  
您可以在正在运行的实例上修改此设置。此更改立即生效，无需重启实例。

   有关更多信息，请参阅 [要求使用 IMDSv2](configuring-IMDS-existing-instances.md#modify-require-IMDSv2)。

1. **禁用 IMDSv1 后监控是否存在问题：**

   1. 使用 CloudWatch 指标 `MetadataNoTokenRejected` 跟踪 IMDSv1 调用尝试次数以及被拒绝的次数。

   1. 如果 `MetadataNoTokenRejected` 指标记录了遇到软件问题的实例上的 IMDSv1 调用，则表明该软件需要更新才能使用 IMDSv2。

1. **将新实例配置为需要 IMDSv2：**

------
#### [ Amazon EC2 console ]

   1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

   1. 按照以下步骤[启动实例](ec2-launch-instance-wizard.md)。

   1. 展开**高级详细信息**，对于**元数据版本**，选择**仅 V2（需要令牌）**。

   1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。

      有关更多信息，请参阅 [在启动时配置实例](configuring-IMDS-new-instances.md#configure-IMDS-new-instances-instance-settings)。

------
#### [ AWS CLI ]

   AWS CLI：使用 [run-instances](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/run-instances.html) 命令并指定需要使用 IMDSv2。

------

### 步骤 4：将 IMDSv2=required 设置为默认值
<a name="path-step-4"></a>

您可以将 IMDSv2=required 设置为账户或组织级别的默认配置。这确保所有新启动的实例都自动配置为需要 IMDSv2。

1. **设置账户级别默认值：**

------
#### [ Amazon EC2 console ]

   1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

   1. 在导航窗格中，选择**控制面板**。

   1. 在**账户属性**卡的**设置**下，选择**数据保护和安全**。

   1. 在 **IMDS 默认值**下，选择**管理**。

   1. 对于**实例元数据服务**，选择**启用**。

   1. 对于**元数据版本**，选择**仅 V2（需要令牌）**。

   1. 选择**更新**。

------
#### [ AWS CLI ]

   使用 [modify-instance-metadata-defaults](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/modify-instance-metadata-defaults.html) CLI 命令并指定 `--http-tokens required` 和 `--http-put-response-hop-limit {{2}}`。

------

   有关更多信息，请参阅 [将 IMDSv2 设置为账户默认设置](configuring-IMDS-new-instances.md#set-imdsv2-account-defaults)。

1. **或者，使用声明性策略设置组织级别默认值：**

   使用声明性策略将 IMDSv2 的组织默认值为 required。有关示例策略，请参阅《AWS Organizations 用户指南》中 [Supported declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative_syntax.html#declarative-policy-examples) 部分的**实例元数据**选项卡**。

### 步骤 5：强制实例要求 IMDSv2
<a name="path-step-5"></a>

确认所有实例均不依赖 IMDSv1 后，我们建议您在所有新实例上强制使用 IMDSv2。

使用以下选项之一来强制使用 IMDSv2：

1. **使用账户属性强制使用 IMDSv2**

   可以在账户级别为每个 AWS 区域强制要求使用 IMDSv2。强制使用后，实例只有配置为必须使用 IMDSv2 时才能启动。无论实例配置或 AMI 配置如何，都必须遵守此强制使用要求。有关更多信息，请参阅 [在账户级别强制使用 IMDSv2](configuring-IMDS-new-instances.md#enforce-imdsv2-at-the-account-level)。要在组织级别应用此设置，请设置声明性策略。有关示例策略，请参阅《AWS Organizations 用户指南》中 [Supported declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative_syntax.html#declarative-policy-examples) 部分的**实例元数据**选项卡**。

   要防止强制使用被撤销，应使用 IAM 策略来阻止对 [ModifyInstanceMetadataDefaults](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceMetadataDefaults.html) API 对访问。有关更多信息，请参阅 [使用 IAM policy](configuring-IMDS-new-instances.md#configure-IMDS-new-instances-iam-policy)。
**注意**  
此设置不会更改现有实例的 IMDS 版本，但会阻止在当前已禁用 IMDSv1 的现有实例上启用 IMDSv1。
**警告**  
如果启用了 IMDSv2 强制使用，但未在启动时的实例配置中或在账户设置或 AMI 配置中将 `httpTokens` 设置为 `required`，则实例启动将会失败。有关问题排查信息，请参阅[启动启用 IMDSv1 的实例时失败](troubleshooting-launch.md#launching-an-imdsv1-enabled-instance-fails)。

1. **也可使用以下 IAM 或 SCP 条件键强制使用 IMDSv2**：
   + `ec2:MetadataHttpTokens`
   + `ec2:MetadataHttpPutResponseHopLimit`
   + `ec2:MetadataHttpEndpoint`

   这些条件键控制 [RunInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RunInstances.html) 和 [ModifyInstanceMetadataOptions](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceMetadataOptions.html) API 及相应 CLI 的使用。如果创建了策略，并且 API 调用中的参数与使用条件键的策略中指定的状态不匹配，API 或 CLI 调用将失败并显示 `UnauthorizedOperation` 响应。

   有关示例 IAM policies，请参阅 [使用实例元数据](ExamplePolicies_EC2.md#iam-example-instance-metadata)。
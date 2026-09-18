

# 配置实例元数据服务选项
<a name="configuring-instance-metadata-options"></a>

实例元数据服务（IMDS）在每个 EC2 实例上本地运行。*实例元数据选项*是一组配置，可用于控制 EC2 实例上 IMDS 的可访问性和行为。

可在每个实例上配置以下实例元数据选项：

**实例元数据服务（IMDS）**：`enabled` \|`disabled`   
可在实例上启用或禁用 IMDS。禁用后，您或任何代码都将无法访问实例上的实例元数据。  
实例上的 IMDS 有两个端点：IPv4 (`169.254.169.254`) 和 IPv6 (`[fd00:ec2::254]`)。启用 IMDS 时，会自动启用 IPv4 端点。若要启用 IPv6 端点，需将其显式启用。

**IMDS IPv6 端点**：`enabled` \|`disabled`   
可在实例上显式启用 IPv6 IMDS 端点。启用 IPv6 端点后，IPv4 端点将保持启用状态。IPv6 端点仅在[支持 IPv6 的子网](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html#subnet-ip-address-range)（双栈或仅 IPv6）中[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)上受支持。

**元数据版本**：`IMDSv1 or IMDSv2 (token optional)` \|`IMDSv2 only (token required)`   
请求实例元数据时，IMDSv2 调用需要令牌。IMDSv1 调用不需要令牌。可将实例配置为允许调用 IMDSv1 或 IMDSv2（可以使用令牌），或者仅允许调用 IMDSv2（必须使用令牌）。

**元数据响应跃点限制**：`1` `64`–   
跃点限制是允许进行 PUT 响应的网络跃点数。可以设置跃点限制，最小值为 `1`，最大值为 `64`。在容器环境中，跃点限制 `1` 可能会导致问题。有关如何缓解这些问题的信息，请参阅[实例元数据访问注意事项](instancedata-data-retrieval.md#imds-considerations)下方有关容器环境的信息。

**访问实例元数据中的标签**：`enabled` \|`disabled`   
可以启用或禁用从实例元数据访问实例标签。有关更多信息，请参阅 [使用实例元数据来查看 EC2 实例的标签](work-with-tags-in-IMDS.md)。

要查看实例的当前配置，请参阅 [查询现有实例的实例元数据选项](instancedata-data-retrieval.md#query-IMDS-existing-instances)。

## 在何处配置实例元数据选项
<a name="where-to-configure-instance-metadata-options"></a>

可以在不同级别配置实例元数据选项，如下所示：
+ **账户**：可以在账户级别为每个 AWS 区域 设置实例元数据选项的默认值。启动实例后，实例元数据选项会自动设置为账户级别的值。您可以在启动后更改这些值。账户级别的默认值不会影响现有实例。
+ **AMI**：注册或修改 AMI 时，可将 `imds-support` 参数设置为 `v2.0`。使用此 AMI 启动实例后，实例元数据版本会自动设置为 IMDSv2，并且跃点限制会设置为 2。
+ **实例**：可以在启动实例时，更改实例上的所有实例元数据选项，从而覆盖默认设置。也可以在正在运行或已停止的实例上启动后，再更改实例元数据选项。请注意，更改可能受到 IAM 或 SCP 策略的限制。

有关更多信息，请参阅[为新实例配置实例元数据选项](configuring-IMDS-new-instances.md)和[为现有实例修改实例元数据选项](configuring-IMDS-existing-instances.md)。

## 实例元数据选项的优先顺序
<a name="instance-metadata-options-order-of-precedence"></a>

每个实例元数据选项的值都会在启动实例时按照优先级分层顺序确定。分层顺序如下，按最高优先级从上至下依次排序：
+ **优先级 1：启动时的实例配置**：可以在启动模板或实例配置中指定值。此处指定的任何值都会覆盖在账户级别或 AMI 中指定的值。
+ **优先级 2：账户设置**：如果启动实例时未指定值，则该值将根据账户级别的设置（针对每个 AWS 区域 进行设置）确定。账户级别设置通常会包含各个元数据选项的值，或者不会指示任何首选项。
+ **优先级 3：AMI 配置**：如果启动实例时未指定值或账户级别设置未确定值，则该值将根据 AMI 配置确定。这适用于 `HttpTokens` 和 `HttpPutResponseHopLimit`。

每个元数据选项都将分开评估。可以通过组合使用直接实例配置、账户级别默认设置和 AMI 配置，配置实例。

在正在运行或已停止的实例上启动后，可以更改任何元数据选项的值，除非更改受到 IAM 或 SCP 策略的限制。

**注意**  
首先需要根据优先顺序确定好实例的 IMDS 设置之后，才会评估账户级别 IMDSv2 强制使用设置。启用 IMDSv2 强制使用后，使用 IMDSv1 启用的实例将会失败。有关强制使用的更多信息，请参阅[在账户级别强制使用 IMDSv2](configuring-IMDS-new-instances.md#enforce-imdsv2-at-the-account-level)。

**警告**  
如果启用了 IMDSv2 强制使用，但未在启动时的实例配置中或在账户设置或 AMI 配置中将 `httpTokens` 设置为 `required`，则启动将会失败。

**示例 1 – 确定元数据选项的值**

在此示例中，EC2 实例会启动到一个区域中，其中 `HttpPutResponseHopLimit` 在账户级别设置为 `1`。指定 AMI 会将 `ImdsSupport` 设置为 `v2.0`。启动时不会直接在实例上指定元数据选项。该实例通过以下元数据选项启动：

```
"MetadataOptions": {
    ...
    "HttpTokens": "required",
    "HttpPutResponseHopLimit": 1,
    ...
```

这些值如下所示确定：
+ **启动时未指定元数据选项：**实例启动期间，实例启动参数或启动模板中均未提供元数据选项的特定值。
+ **账户设置优先级次之：**如果启动时未指定特定值，则会优先应用区域内的账户级别设置。这意味着将应用账户级别配置的默认值。在本例中，`HttpPutResponseHopLimit` 设置为 `1`。
+ **AMI 设置优先级最低：**如果启动时或账户级别未指定 `HttpTokens`（实例元数据版本）的特定值，则应用 AMI 设置。在本例中，由 AMI 设置 `ImdsSupport: v2.0` 确定将 `HttpTokens` 设置为 `required`。请注意，虽然 AMI 设置 `ImdsSupport: v2.0` 旨在设置 `HttpPutResponseHopLimit: 2`，但其被账户级别设置 `HttpPutResponseHopLimit: 1` 覆盖，而后者的优先级更高。

**示例 2 – 确定元数据选项的值**

在此示例中，使用与前面示例 1 中相同的设置启动 EC2 实例，不过启动时直接在实例上将 `HttpTokens` 设置为 `optional`。该实例通过以下元数据选项启动：

```
"MetadataOptions": {
    ...
    "HttpTokens": "optional",
    "HttpPutResponseHopLimit": 1,
    ...
```

`HttpPutResponseHopLimit` 的值的确定方式与示例 1 中相同。但是，`HttpTokens` 的值按以下方式确定：启动时在实例上配置的元数据选项优先。即使 AMI 配置了 `ImdsSupport: v2.0`（也就是 `HttpTokens` 设置为 `required`），启动时在实例上指定的值（`HttpTokens` 设置为 `optional`）仍优先。

**示例 3 – 在启用 HttpTokensEnforced 的情况下确定元数据选项的值**

在此示例中，该账户在该区域中的设置为 `HttpTokens = required` 和 `HttpTokensEnforced = enabled`。

考虑以下 EC2 实例启动尝试：
+ 在将 `HttpTokens` 设置为 `optional` 的情况下尝试启动：启动将会失败，因为启用了账户级别强制使用 (`HttpTokensEnforced = enabled`)，并且启动参数的优先级高于账户默认设置。
+ 在将 `HttpTokens` 设置为 `required` 的情况下尝试启动：启动将会成功，因为它符合账户级别强制使用的要求。
+ 在未指定 `HttpTokens` 值的情况下尝试启动：启动将会成功，因为根据账户设置，该值默认为 `required`。

### 设置实例元数据版本
<a name="metadata-version-order-of-precedence"></a>

实例启动时，实例*元数据版本*的值为 **IMDSv1 或 IMDSv2（令牌可选）**(`httpTokens=optional`) 或**仅限 IMDSv2（需要令牌）(`httpTokens=required`)**。

实例启动时，您可以手动指定元数据版本的值，也可以使用默认值。如果手动指定该值，则将覆盖所有默认值。如果不手动指定该值，则该值将由默认设置的组合确定。

以下流程图显示了不同配置级别的设置如何确定实例启动时的元数据版本以及强制使用的评估位置。下表列举了每个级别的具体设置。

![显示实例元数据版本和 IMDSv2 强制使用评估点的流程图。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/imds-defaults-launch-flow.png)


该表显示了不同配置级别的设置如何确定启动实例时的元数据版本（由第 4 列中**生成的实例配置**指示）。优先级顺序如下所示，从左到右，第一列优先级最高：
+ 第 1 列：**启动参数**：表示启动时手动指定的实例设置。
+ 第 2 列：**账户级别默认设置**：表示账户设置。
+ 第 3 列：**AMI 默认设置**：表示 AMI 设置。


| 启动参数 | 默认账户级别 | 默认 AMI | 生成的实例配置 | 
| --- | --- | --- | --- | 
| 仅 V2（需要令牌） | 无首选项 | 仅 V2 | 仅 V2 | 
| 仅 V2（需要令牌） | 仅 V2 | 仅 V2 | 仅 V2 | 
| 仅 V2（需要令牌） | V1 或 V2 | 仅 V2 | 仅 V2 | 
| V1 或 V2（可以使用令牌） | 无首选项 | 仅 V2 | V1 或 V2 | 
| V1 或 V2（可以使用令牌） | 仅 V2 | 仅 V2 | V1 或 V2 | 
| V1 或 V2（可以使用令牌） | V1 或 V2 | 仅 V2 | V1 或 V2 | 
| 未设置 | 无首选项 | 仅 V2 | 仅 V2 | 
| 未设置 | 仅 V2 | 仅 V2 | 仅 V2 | 
| 未设置 | V1 或 V2 | 仅 V2 | V1 或 V2 | 
| 仅 V2（需要令牌） | 无首选项 | null | 仅 V2 | 
| 仅 V2（需要令牌） | 仅 V2 | null | 仅 V2 | 
| 仅 V2（需要令牌） | V1 或 V2 | null | 仅 V2 | 
| V1 或 V2（可以使用令牌） | 无首选项 | null | V1 或 V2 | 
| V1 或 V2（可以使用令牌） | 仅 V2 | null | V1 或 V2 | 
| V1 或 V2（可以使用令牌） | V1 或 V2 | null | V1 或 V2 | 
| 未设置 | 无首选项 | null | V1 或 V2 | 
| 未设置 | 仅 V2 | null | 仅 V2 | 
| 未设置 | V1 或 V2 | null | V1 或 V2 | 

## 使用 IAM 条件键限制实例元数据选项
<a name="iam-condition-keys-and-imds"></a>

可以在 IAM 策略或 SCP 中使用 IAM 条件键，如下所示：
+ 仅在实例配置为要求使用 IMDSv2 时允许实例启动
+ 限制允许的跃点数
+ 关闭对实例元数据的访问

**Topics**
+ [在何处配置实例元数据选项](#where-to-configure-instance-metadata-options)
+ [实例元数据选项的优先顺序](#instance-metadata-options-order-of-precedence)
+ [使用 IAM 条件键限制实例元数据选项](#iam-condition-keys-and-imds)
+ [为新实例配置实例元数据选项](configuring-IMDS-new-instances.md)
+ [为现有实例修改实例元数据选项](configuring-IMDS-existing-instances.md)

**注意**  
在进行任何更改之前，您应谨慎执行操作并进行仔细的测试。记录以下内容：  
如果您强制使用 IMDSv2，则使用 IMDSv1 访问实例元数据的应用程序或代理将会中断。
如果禁用对实例元数据的所有访问，则依赖于实例元数据访问才能正常工作的应用程序或代理将会中断。
对于 IMDSv2，在检索令牌时必须使用 `/latest/api/token`。
（仅限 Windows）如果您的 PowerShell 版本早于 4.0，则必须[更新到 Windows Management Framework 4.0](https://devblogs.microsoft.com/powershell/windows-management-framework-wmf-4-0-update-now-available-for-windows-server-2012-windows-server-2008-r2-sp1-and-windows-7-sp1/) 才能要求使用 IMDSv2。
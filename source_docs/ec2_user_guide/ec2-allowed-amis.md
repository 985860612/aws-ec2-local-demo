

# 使用“允许的 AMI”控制在 Amazon EC2 中对 AMI 的发现和使用
<a name="ec2-allowed-amis"></a>

要控制 AWS 账户中的用户对亚马逊机器映像（AMI）的发现和使用，可以使用*允许的 AMI* 功能。您可指定 AMI 要在账户中可见和可用而必须满足的标准。启用该标准后，启动实例的用户将只能看到并有权访问符合指定标准的 AMI。例如，您可以指定可信的 AMI 提供商列表作为标准，只有来自这些提供商的 AMI 才可见并可供使用。

在启用“允许的 AMI”设置之前，您可以启用*审核模式*来预览哪些 AMI 将可见或不可见、可供使用或不可供使用。这有助于您根据需要完善标准，确保只有预期的 AMI 才对账户中的用户可见和可用。此外，使用 [describe-instance-image-metadata](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-image-metadata.html) 命令可查找使用不符合指定标准的 AMI 启动的实例。这些信息可以指导您作出决策，选择是更新启动配置以使用合规的 AMI（例如在启动模板中指定不同的 AMI），还是调整标准来允许这些 AMI。

您可以在账户级别指定“允许的 AMI”设置，可以直接在账户中指定，也可以使用声明式策略进行指定。必须在想要在其中控制 AMI 使用的每个 AWS 区域中配置这些设置。使用声明式策略允许同时将设置应用于多个区域，也可以同时应用于多个账户。当使用声明式策略时，您无法直接在账户中修改设置。本主题介绍如何直接在账户中配置设置。有关使用声明式策略的信息，请参阅《AWS Organizations User Guide》**中的 [Declarative policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_declarative.html)。

**注意**  
“允许的 AMI”功能仅控制公用 AMI 或与账户共享的 AMI 的发现和使用。它不会限制账户拥有的 AMI。无论设置的条件是什么，您账户中的用户始终可以发现和使用由您的账户创建的 AMI。

**“允许的 AMI”功能的主要优势**
+ **合规与安全**：用户只能发现和使用符合指定标准的 AMI，从而降低使用不合规的 AMI 的风险。
+ **高效管理**：通过减少允许的 AMI 数量，管理其余 AMI 将变得更加轻松高效。
+ **集中式账户级别实施**：直接在账户内或通过声明式策略在账户级别配置“允许的 AMI”设置。这提供了一种集中而高效的方式来控制整个账户的 AMI 使用情况。

**Topics**
+ [“允许的 AMI”的工作原理](#how-allowed-amis-works)
+ [实施“允许的 AMI”的最佳实践](#best-practice-for-implementing-allowed-amis)
+ [所需的 IAM 权限](#iam-permissions-for-allowed-amis)
+ [管理“允许的 AMI”设置](manage-settings-allowed-amis.md)

## “允许的 AMI”的工作原理
<a name="how-allowed-amis-works"></a>

为了控制哪些 AMI 可以在您的账户中发现和使用，您可以定义一组用于评估 AMI 的标准。这些标准由一个或多个 `ImageCriterion` 组成，如下图所示。图后附有说明。

![允许的 AMI ImageCriteria 配置层次结构。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ami_allowed-amis-imagecriteria.png)


配置分为三个级别：
+ **1**：参数值
  + 多值参数：
    + `ImageProviders`
    + `ImageNames`
    + `MarketplaceProductCodes`

      AMI 匹配参数中的*任意*值即获得允许。

      示例：`ImageProviders` = `amazon` **OR** 账户 `111122223333` **OR** 账户 `444455556666`（参数值的评估逻辑未在图表中显示。）
    + `ImageWatermarks`
  + 单值参数：
    + `CreationDateCondition`
    + `DeprecationTimeCondition`
+ **2**：`ImageCriterion`
  + 使用 **AND** 逻辑对多个参数进行分组。
  + AMI 必须匹配 `ImageCriterion` 中的*所有*参数才能获得允许。
  + 示例：`ImageProviders` = `amazon` **AND** `CreationDateCondition` = 300 天或更短
+ **3**：`ImageCriteria`
  + 使用 **OR** 逻辑将多个 `ImageCriterion` 组合在一起。
  + AMI 匹配*任何* `ImageCriterion` 即获得允许。
  + 形成评估 AMI 所依据的完整配置。

**Topics**
+ [允许的 AMI 参数](#allowed-amis-criteria)
+ [允许的 AMI 配置](#allowed-amis-json-configuration)
+ [如何评估标准](#how-allowed-amis-criteria-are-evaluated)
+ [限制](#allowed-amis-json-configuration-limits)
+ [“允许的 AMI”操作](#allowed-amis-operations)

### 允许的 AMI 参数
<a name="allowed-amis-criteria"></a>

可配置以下参数用于创建 `ImageCriterion`：

`ImageProviders`  
允许其 AMI 的 AMI 提供商。  
有效值是由 AWS 和 AWS 账户 ID 定义的别名，如下所示：  
+ `amazon`：别名，用于标识由 Amazon 或经过验证的提供商创建的 AMI
+ `aws-marketplace`：别名，用于标识由 中经过验证的提供商创建的 AMIAWS Marketplace
+ `aws-backup-vault`：别名，用于标识位于逻辑上受物理隔离的 AWS Backup 保管库账户中的备份 AMI。如果您使用 AWS Backup 逻辑上受物理隔离的保管库功能，请确保将此别名作为 AMI 提供商包含在内。
+ AWS 账户 ID：一个或多个 12 位 AWS 账户 ID
+ `none`：表示只能发现和使用您的账户创建的 AMI。无法发现和使用公有或共享的 AMI。指定后将无法指定其他标准。

`ImageNames`  
允许的 AMI 名称，使用精确匹配或通配符（`?` 或 `*`）。

`MarketplaceProductCodes`  
允许的 AMI AWS Marketplace 的产品代码。

`CreationDateCondition`  
允许的 AMI 的最大期限。

`DeprecationTimeCondition`  
自弃用允许的 AMI 以来的最长期限。

`ImageWatermarks`  
水印筛选条件的列表。如果 AMI 上的任何水印与任何筛选条件条目（OR 逻辑）相匹配，则筛选条件将允许 AMI。每个筛选条件都可以包含以下字段：  
+ `WatermarkKey`：要匹配的水印密钥（`account-id:watermark-name`）
+ `SourceImageRegion`：最初向其附加水印的 AMI 的区域
+ `MaximumDaysSinceSourceImageCreated`：应用水印时源 AMI 的最长使用期限
+ `MaximumDaysSinceWatermarkCreated`：从应用水印开始的最大天数

有关每个标准的有效值和约束，请参阅《Amazon EC2 API Reference》**中的 [ImageCriterionRequest](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ImageCriterionRequest.html)。

### 允许的 AMI 配置
<a name="allowed-amis-json-configuration"></a>

“允许的 AMI”的核心配置是定义允许的 AMI 标准的 `ImageCriteria` 配置。以下 JSON 结构显示可以指定的参数：

```
{
    "State": "enabled" | "disabled" | "audit-mode",  
    "ImageCriteria" : [
        {
            "ImageProviders": ["string",...],
            "MarketplaceProductCodes": ["string",...],           
            "ImageNames":["string",...],
            "CreationDateCondition" : {
                "MaximumDaysSinceCreated": integer
            },
            "DeprecationTimeCondition" : {
                "MaximumDaysSinceDeprecated": integer
            },
            "ImageWatermarks": [
                {
                    "WatermarkKey": "string",
                    "SourceImageRegion": "string",
                    "MaximumDaysSinceSourceImageCreated": integer,
                    "MaximumDaysSinceWatermarkCreated": integer
                },...
            ]
         },
         ...
}
```

#### ImageCriteria 示例
<a name="allowed-amis-json-configuration-example"></a>

以下 `ImageCriteria` 示例配置五个 `ImageCriterion`。如果 AMI 与其中任何一个 `ImageCriterion` 匹配，则允许使用。有关如何评估标准的信息，请参阅[如何评估标准](#how-allowed-amis-criteria-are-evaluated)。

```
{
    "ImageCriteria": [
        // ImageCriterion 1: Allow AWS Marketplace AMIs with product code "abcdefg1234567890"
        {
            "MarketplaceProductCodes": [
                "{{abcdefg1234567890}}"
            ]
        },
        // ImageCriterion 2: Allow AMIs from providers whose accounts are
        // "123456789012" OR "123456789013" AND AMI age is less than 300 days
        {
            "ImageProviders": [
                "{{123456789012}}",
                "{{123456789013}}"
            ],
            "CreationDateCondition": {
                "MaximumDaysSinceCreated": {{300}}
            }
        },
        // ImageCriterion 3: Allow AMIs from provider whose account is "123456789014" 
        // AND with names following the pattern "golden-ami-*"
        {
            "ImageProviders": [
                "{{123456789014}}"
            ],
            "ImageNames": [
                "{{golden-ami-*}}"
            ]
        },
        // ImageCriterion 4: Allow AMIs from Amazon or verified providers 
        // AND which aren't deprecated
        {
            "ImageProviders": [
                "amazon"
            ],
            "DeprecationTimeCondition": {
                "MaximumDaysSinceDeprecated": {{0}}
            }
        },
        // ImageCriterion 5: Allow AMIs that carry an approved watermark
        // from account "111122223333" AND the watermark was applied less than 90 days ago
        {
            "ImageWatermarks": [
                {
                    "WatermarkKey": "{{111122223333:prod-baseline}}",
                    "MaximumDaysSinceWatermarkCreated": {{90}}
                }
            ]
        }
    ]
}
```

### 如何评估标准
<a name="how-allowed-amis-criteria-are-evaluated"></a>

下表说明确定是否允许 AMI 的评估规则，并显示在每个级别如何应用 `AND` 或 `OR` 运算符：


| 评估级别 | 运算符 | 成为允许的 AMI 的要求 | 
| --- | --- | --- | 
| ImageProviders、ImageNames、MarketplaceProductCodes 和 ImageWatermarks 的参数值 | OR | AMI 必须匹配每个参数列表中至少一个值 | 
| ImageCriterion | AND | AMI 必须匹配每个 ImageCriterion 中的所有参数 | 
| ImageCriteria | OR | AMI 必须匹配任何一个 ImageCriterion | 

使用上述评估规则，让我们看看如何将其应用于 [ImageCriteria 示例](#allowed-amis-json-configuration-example)：
+ `ImageCriterion` 1：允许具有 AWS Marketplace 产品代码 `abcdefg1234567890` 的 AMI

  `OR`
+ `ImageCriterion` 2：允许同时符合以下两个标准的 AMI：
  + 由账户 `123456789012` `OR` `123456789013` 拥有
    + `AND`
  + 已在过去 300 天内创建

  `OR`
+ `ImageCriterion` 3：允许同时符合以下两个标准的 AMI：
  + 由账户 `123456789014` 拥有
    + `AND`
  + 以 `golden-ami-*` 模式命名

  `OR`
+ `ImageCriterion` 4：允许同时符合以下两个标准的 AMI：
  + 由 Amazon 发布或经过验证的提供商（通过 `amazon` 别名指定）
    + `AND`
  + 未弃用（自弃用以来的最长天数为 `0`）

  `OR`
+ `ImageCriterion` 5：允许带有水印的 AMI 匹配以下内容：
  + 水印密钥 `111122223333:prod-baseline`
    + `AND`
  + 您在不到 90 天前应用了该水印

### 限制
<a name="allowed-amis-json-configuration-limits"></a>

`ImageCriteria` 最多可以包含：
+ 10 `ImageCriterion`

每个 `ImageCriterion` 最多可以包含：
+ 200 个 `ImageProviders` 值
+ 50 个 `ImageNames` 值 
+ 50 个 `MarketplaceProductCodes` 值 
+ 50 个 `ImageWatermarks` 值

**限制示例**

使用前面的 [ImageCriteria 示例](#allowed-amis-json-configuration-example)：
+ 有 5 个 `ImageCriterion`。最多可以向请求再添加 5 个，达到 10 个的上限。
+ 在第一个 `ImageCriterion` 中，有 1 个 `MarketplaceProductCodes` 值。最多可以向此 `ImageCriterion` 再添加 49 个值，达到 50 个值的上限。
+ 在第二个 `ImageCriterion` 中，有 2 个 `ImageProviders` 值。最多可以向此 `ImageCriterion` 再添加 198 个值，达到 200 个值的上限。
+ 在第三个 `ImageCriterion` 中，有 1 个 `ImageNames` 值。最多可以向此 `ImageCriterion` 再添加 49 个值，达到 50 个值的上限。

### “允许的 AMI”操作
<a name="allowed-amis-operations"></a>

“允许的 AMI”功能有三种用于管理映像标准的运行状态：**启用**、**禁用**和**审核模式**。您可借助此功能启用或禁用镜像标准，或根据需要对其进行审核。

**已启用**

启用“允许的 AMI”时：
+ 将应用 `ImageCriteria`。
+ 只有允许的 AMI 才能在 EC2 控制台中由使用镜像（例如描述、复制、存储或执行其他使用镜像的操作）的 API 发现。
+ 只能使用允许的 AMI 启动实例。

**已禁用**

禁用“允许的 AMI”时：
+ 不会应用 `ImageCriteria`。
+ 对 AMI 的可发现性或使用不会施加任何限制。

**审核模式**

 在审核模式下：
+ 将应用 `ImageCriteria`，但对 AMI 的可发现性或使用不会施加任何限制。
+ 在 EC2 控制台中，对于每个 AMI，**允许的镜像**字段会显示**是**或**否**，指示在启用“允许的 AMI”时，账户中的用户是否可以发现和使用该 AMI。
+ 在命令行中，`describe-image` 操作的响应包括 `"ImageAllowed": true` 或 `"ImageAllowed": false`，指示在启用“允许的 AMI”时，账户中的用户是否可以发现和使用该 AMI。
+ 在 EC2 控制台中，AMI 目录会在当启用“允许的 AMI”时账户中的用户无法发现或无法使用的 AMI 旁显示**不允许**。

## 实施“允许的 AMI”的最佳实践
<a name="best-practice-for-implementing-allowed-amis"></a>

在实施“允许的 AMI”时，请考虑这些最佳实践，确保平稳过渡并最大限度地减少对 AWS 环境的潜在干扰。

1. **启用审核模式**

   首先在审核模式下启用“允许的 AMI”。此状态允许您查看哪些 AMI 将受到标准的影响，而无需实际限制访问权限，从而提供无风险的评估期。

1. **设置“允许的 AMI”标准**

   仔细确定哪些 AMI 提供商符合贵组织的安全政策、合规性要求和运营需求。
**注意**  
在使用 Amazon ECS 或 Amazon EKS 或 AWS Lambda 托管实例等 AWS 托管服务时，我们建议指定 `amazon` 别名以允许 AWS 创建的 AMI。这些服务依赖于 Amazon 发布的 AMI 来启动实例。  
为任何 AMI 设置 `CreationDateCondition` 限制时均需谨慎。如果设置过于严格的日期条件（例如，AMI 必须少于 5 天），则 AMI（无论是来自 AWS 还是其他提供商）未在指定的时间范围内更新可能会导致实例启动失败。  
我们建议将 `ImageNames` 与 `ImageProviders` 搭配使用，以获得更好的控制和更高的精确度。单独使用 `ImageNames` 可能无法唯一标识 AMI。

1. **检查对预期业务流程的影响**

   您可以通过控制台或 CLI 来识别任何使用不符合指定标准的 AMI 启动的实例。这些信息可以指导您作出决策，选择是更新启动配置以使用合规的 AMI（例如在启动模板中指定不同的 AMI），还是调整标准来允许这些 AMI。

   控制台：使用 [ec2-instance-launched-with-allowed-ami](https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-launched-with-allowed-ami.html) AWS Config 规则来检查正在运行或已停止的实例是否使用符合“允许的 AMI”标准的 AMI 启动。如果 AMI 不符合“允许的 AMI”标准，则规则为 **NON\_COMPLIANT**；如果符合，则规则为 **COMPLIANT**。仅当“允许的 AMI”设置为**已启用**或**审核模式**时，规则才会生效。

   CLI：运行 [describe-instance-image-metadata](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-image-metadata.html) 命令并筛选响应，以识别任何使用不符合指定标准的 AMI 启动的实例。

   有关控制台和 CLI 说明，请参阅 [查找利用不允许的 AMI 启动的实例](manage-settings-allowed-amis.md#identify-instances-with-allowed-AMIs)。

1. **启用“允许的 AMI**

   确认该标准不会对预期业务流程产生不利影响后，请启用“允许的 AMI”。

1. **监控实例启动情况**

   继续监控 AMI 在应用程序和您使用的 AWS 托管服务（例如 Amazon EMR、Amazon ECR、Amazon EKS 和 AWS Elastic Beanstalk）中启动实例的情况。检查是否存在任何意外问题，并对“允许的 AMI”标准进行必要的调整。

1. **试用新 AMI**

   要测试不符合您当前“允许的 AMI”设置的第三方 AMI，AWS 建议采用以下方法：
   + 使用单独的 AWS 账户：创建一个无法访问您关键业务资源的账户。确保未在此账户中启用“允许的 AMI”设置，或明确允许您要测试的 AMI，以便您可以对其进行测试。
   + 在其他 AWS 区域进行测试：使用可使用第三方 AMI 但尚未启用“允许的 AMI”设置的区域。

   这些方法有助于确保在测试新 AMI 时，您的关键业务资源仍然安全。

## 所需的 IAM 权限
<a name="iam-permissions-for-allowed-amis"></a>

要使用“允许的 AMI”功能，您需要以下 IAM 权限：
+ `GetAllowedImagesSettings`
+ `EnableAllowedImagesSettings`
+ `DisableAllowedImagesSettings`
+ `ReplaceImageCriteriaInAllowedImagesSettings`


# 在预留实例市场中销售 Amazon EC2 的预留实例
<a name="ri-market-general"></a>

Amazon EC2 预留实例市场是一个便于 AWS 客户和第三方卖家销售未使用标准预留实例的平台。这些预留实例的期限长短和定价选项可能有所不同。当您不再需要预留实例时，例如将实例移动到新的 AWS 区域、更改为其他实例类型、在预留实例期限到期之前完成项目、业务需求发生变化或容量过剩时，您可能希望出售预留实例。

只要在预留实例 Marketplace 中列出预留实例，便可供潜在的买方找到。所有预留实例将根据剩余期限及小时价格进行分组。

为了满足买家通过预留实例市场购买第三方卖家预留实例的请求，AWS 会优先出售指定分组中预付价格最低的预留实例。然后，AWS再出售下一个最低价格的预留实例，直到买方的整个订单完成为止。AWS随后处理这些交易，并将预留实例的所有权转移给买方。

在您的Reserved Instance出售之前，它将归您所有。出售之后，您便放弃了容量预留和打折的周期性费用。如果继续使用您的实例，AWS将从您的预留实例出售的时间开始以按需价格向您收费。

在预留实例 Marketplace 上销售未使用的预留实例必须满足特定资格条件。

有关在预留实例 Marketplace 上购买预留实例的更多信息，请参阅 [从预留实例 Marketplace 中购买](ri-market-concepts-buying.md#ri-market-buying-guide)。

**Topics**
+ [限制和局限性](#ri-seller-limits)
+ [注册成为卖家](#ri-market-seller-profile)
+ [银行支付账户](#ri-market-concepts-bank)
+ [税务信息](#ri-market-concepts-taxinfo)
+ [您的 预留实例 的价格](#ri-market-concepts-pricing)
+ [列出您的 预留实例](#ri-market-selling-listing)
+ [Reserved Instance列表状态](#ri-listing-states)
+ [列表的生命周期](#ri-market-concepts-sold-partial)
+ [在Reserved Instance出售后](#ri-market-concepts-sold)
+ [收款](#ri-market-sold-gettingpaid)
+ [与买方共享的信息](#ri-market-seller-disclosure)

## 限制和局限性
<a name="ri-seller-limits"></a>

您必须先注册为预留实例 Marketplace 中的卖家，然后才能出售未使用的预留实例。有关信息，请参阅 [注册成为卖家](#ri-market-seller-profile)。

以下限制在出售预留实例时适用：
+ 只有 Amazon EC2 标准区域和分区预留实例可在预留实例 Marketplace 出售。
+ Amazon EC2 可转换预留实例不可在预留实例市场出售。
+ 其他 AWS 服务（比如 Amazon RDS 和 Amazon ElastiCache）的预留实例无法在预留实例 Marketplace 出售。
+ 标准Reserved Instance的剩余期限必须至少为一个月。
+ 您不能在[默认禁用](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-regions.html)的区域中销售标准预留实例。
+ 预留实例 Marketplace 中允许的最低价格为 0.00 USD。
+ 只要实例在账户中处于激活状态至少 30 天，您就可以在预留实例市场中销售“无预付费用”“预付部分费用”或“预付全部费用”的预留实例。此外，如果预留实例上有预付款，则只能在 AWS 收到预付款之后将其出售。
+ 如果您使用批量折扣购买预留实例，则无法在预留实例市场中销售该预留实例。
+ 您无法在预留实例 Marketplace 中直接修改您的列示内容。然而，您可通过先取消它然后再用新参数创建另一个实例出售清单来改变您的实例出售清单。有关信息，请参阅 [您的 预留实例 的价格](#ri-market-concepts-pricing)。您也可以在列出预留实例时对其进行修改。有关信息，请参阅 [修改 预留实例](ri-modifying.md)。
+ AWS会向您收取您在预留实例市场中出售的每个标准预留实例的总预付价格 12% 的服务费。预付价格是卖方对标准Reserved Instance收取的费用。
+ 当您注册为卖家时，您指定的银行必须有一个美国地址。有关更多信息，请参阅 *AWS Marketplace 销售指南*中的[对付费商品的其他卖家要求](https://docs.aws.amazon.com/marketplace/latest/userguide/user-guide-for-sellers.html#additional-seller-requirements-for-paid-products)。
+ 即使 Amazon Web Services India Private Limited（AWS India）的客户拥有美国银行账户，也无法在 EC2 预留实例市场中注册为卖家，且无法在 EC2 预留实例市场中上架或出售预留实例。有关更多信息，请参阅[AWS 账户 和 AWS 印度账户之间有何区别？](https://repost.aws/knowledge-center/aws-india-differences)
+ 如果您记录的卖家更改为 Amazon Web Services India Private Limited (AWS India)，则您的卖家身份将从 EC2 预留实例市场注销，并且将移除您在 EC2 预留实例市场中的所有现有在售商品。要恢复卖家身份，您必须将账户所在地更改为印度以外的国家/地区，然后重新完成卖家注册流程。

## 注册成为卖家
<a name="ri-market-seller-profile"></a>

**注意**  
只有 AWS 账户根用户 才可以将账户注册为卖家。

要在预留实例 Marketplace 中销售，您必须先注册为卖家。在注册过程中，您应提供以下信息：
+ **银行信息**：AWS 必须获得您的银行信息，才能在您出售预留实例后将所收款项转给您。您指定的银行必须有一个美国地址。有关更多信息，请参阅[银行支付账户](#ri-market-concepts-bank)。
+ **税务信息** — 所有卖方都需要完成税务信息审查以确定任何必要的税务报告义务。有关更多信息，请参阅[税务信息](#ri-market-concepts-taxinfo)。

在 AWS 收到您已完成的卖家注册后，您会收到对您的注册进行确认并告知您可以开始在预留实例 Marketplace 中出售实例的电子邮件。

## 银行支付账户
<a name="ri-market-concepts-bank"></a>

AWS 必须获得您的银行信息，才能在您出售预留实例后将所收款项转给您。您指定的银行必须有一个美国地址。有关更多信息，请参阅 *AWS Marketplace 销售指南*中的[对付费商品的其他卖家要求](https://docs.aws.amazon.com/marketplace/latest/userguide/user-guide-for-sellers.html#additional-seller-requirements-for-paid-products)。

**注册付款的默认银行账户**

1. 打开[预留实例 Marketplace 卖家注册](https://us-east-1.console.aws.amazon.com/rimarketplace/home?region=us-east-1)页面并使用您的 AWS 凭证登录。

1. 在 **Manage Bank Account** 页面上，提供有关您的收款行的以下信息：
   + 银行账户持有人姓名
   + 路由号码
   + 账号
   + 银行账户类型
**注意**  
如果您使用的是公司银行账户，系统将提示您通过传真（1-206-765-3424）发送该银行账户的相关信息。

注册后，将提供的银行账户设置为默认账户，等待银行进行验证。验证新的银行账户可能需要两周时间，在此期间，您无法收到付款。对于已建立的账户，付款的完成通常需要两天左右的时间。

**更改付款的默认银行账户**

1. 在[预留实例 Marketplace 卖家注册](https://us-east-1.console.aws.amazon.com/rimarketplace/home?region=us-east-1)页面上，使用您注册时所用的账户登录。

1. 在 **Manage Bank Account** 页面上，根据需要添加新的银行账户或修改默认银行账户。

## 税务信息
<a name="ri-market-concepts-taxinfo"></a>

出售预留实例可能需要交纳交易税，例如销售税或增值税。您应与您的企业的税务、法律、财务或会计部门沟通，以确定是否适用于基于交易的税种。您负责向相关税务机构收集并交纳基于交易的税款。

作为卖家注册的一部分，您必须在[卖家注册门户](https://portal.aws.amazon.com/ec2/ri/seller_registration?action=taxInterview)中完成税务审查。此审查将收集税务信息并填充 IRS 表 W-9、W-8BEN 或 W-8BEN-E，后者用于确定任何必要的税务报告义务。

您在税务审查中输入的税务信息可能不同，具体取决于您是作为个人还是企业运营，以及您是否为美国人，您的企业是否为美国实体。当您填写税务资料时，请记住以下事项：
+ AWS 提供的信息 (包括本主题中的信息) 不构成税务、法律或其他专业建议。查明 IRS 报告要求将如何影响您的企业，或者如果您有其他问题，请联系您的税务、法律或其他专业顾问。
+ 为了尽可能高效地满足 IRS 报告要求，在会见过程中回答所有的问题并输入所有要求的信息。
+ 检查您的回答。避免拼写错误或输入了不正确的税务识别号，它们会导致纳税申报表格无效。

根据您的税务审查响应和 IRS 报告阈值，Amazon 可能对表格 1099-K 归档。 Amazon 会在您的账户达到阈值级别的那一年的后一年的 1 月 31 日或之前通过电子邮件发送表格 1099-K 的副本。例如，如果您的账户在 2018 年达到阈值，则将在 2019 年 1 月 31 日或之前通过电子邮件发送您的表 1099-K。

有关 IRS 要求和表 1099-K 的更多信息，请参阅 IRS 网站上的 [Form 1099-K FAQs](https://www.irs.gov/newsroom/form-1099-k-faqs-third-party-filers-of-form-1099-k)。

## 您的 预留实例 的价格
<a name="ri-market-concepts-pricing"></a>

在为预留实例设置价格时，请注意以下方面：
+ **预付价格** – 预付价格是您可为要出售的预留实例指定的唯一费用。预付价格是买方在购买每个预留实例时支付的一次性费用。

  因为预留实例的价值随时间的推移而降低，所以，默认情况下，AWS可设定以同样的变化量逐月降低的价格。但是，您可根据预留实例出售的时间设置不同的预付价格。例如，如果您的 Reserved Instance 剩余期限为九个月，您可以指定客户如需购买这个剩余九个月的 Reserved Instance，您愿意接受的价格。您还可以分别设置剩余期限为五个月、一个月的价格。

  预留实例 Marketplace 中允许的最低价格为 0.00 USD。
+ **限制** – 以下预留实例出售限制适用于您的 AWS 账户的*有效期*。这种限制不是年度限制，无法增加。
  + **对于预留实例，您最多可以销售 50,000 USD**。
  + **您最多可以销售 5,000 个预留实例**。
+ **不能修改** – 您无法直接修改上架项目。然而，您可通过先取消它然后再用新参数创建另一个实例出售清单来改变您的实例出售清单。
+ **可以取消 ** – 您可以随时取消处于 `active` 状态的上架项目。您无法取消已经匹配或正在为销售进行处理的实例出售清单。如果您的实例出售清单中的某些实例已匹配且您取消了实例出售清单，则仅剩余的未匹配的实例将从实例出售清单中删除。

## 列出您的 预留实例
<a name="ri-market-selling-listing"></a>

注册卖家可以选择销售一个或多个预留实例。您可以选择在一次列出中销售所有实例，或分成多个部分销售。此外，您可以列出任意实例类型、平台和范围配置的预留实例。

控制台将确定建议的价格。它会检查与您的 Reserved Instance 匹配的产品，并与价格最低的产品匹配。否则，它会根据剩余时间的 Reserved Instance 成本计算建议价格。如果计算出的价值小于 1.01 美元，则建议的价格为 1.01 美元。

如果您取消出售清单，且出售清单的一部分已经售出，则取消不会在已售出的部分生效。仅实例出售清单中未售出的部分在预留实例 Marketplace 中将不再可用。

------
#### [ Console ]

**在预留实例 Marketplace 中列出预留实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Reserved Instances**。

1. 选择要列出的预留实例，然后依次选择**操作**、**销售预留实例**。

1. 在 **Configure Your Reserved Instance Listing (配置您的预留实例列表)** 页面上，在相关列中设置要出售的实例数并为剩余期限设定预付价格。单击 **Months Remaining** 列旁边的箭头，了解您的预留的价值是如何随着剩余期限的变化而变化的。

1. 如果您是高级用户且想对定价进行自定义，那么您可为后续月输入一个不同的值。要返回默认的线性价格降低，请选择 **Reset**。

1. 当您完成列表配置后，请选择 **Continue (继续)**。

1. 在 **Confirm Your Reserved Instance Listing (确认您的预留实例列表)** 页面上确认您的列表详细信息；如果对此类信息感到满意，请选择 **List Reserved Instance (列出预留实例)**。

**在 Amazon EC2 控制台中查看您的列表**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Reserved Instances**。

1. 选择您已列出的Reserved Instance，然后选择页面底部附近的**我的列表**选项卡。

------
#### [ AWS CLI ]

**在预留实例 Marketplace 中管理预留实例**

1. 使用 [describe-reserved-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances.html) 命令获取 预留实例 的列表。请注意您要列出的预留实例的 ID。

1. 使用 [create-reserved-instances-listing](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-reserved-instances-listing.html) 命令。您必须指定Reserved Instance的 ID、实例数以及价格表。

1. 要查看列表，请使用 [describe-reserved-instances-listings](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances-listings.html) 命令。

1. 要取消列表，请使用 [cancel-reserved-instances-listing](https://docs.aws.amazon.com/cli/latest/reference/ec2/cancel-reserved-instances-listing.html) 命令。

------
#### [ PowerShell ]

**在预留实例 Marketplace 中管理预留实例**

1. 使用 [Get-EC2ReservedInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstance.html) cmdlet 获取您的预留实例列表。请注意您要列出的预留实例的 ID。

1. 使用 [New-EC2ReservedInstancesListing](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2ReservedInstancesListing.html) cmdlet。您必须指定Reserved Instance的 ID、实例数以及价格表。

1. 要查看您的列表，请使用 [Get-EC2ReservedInstancesListing](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstancesListing.html) cmdlet。

1. 要取消您的列表，请使用 [Stop-EC2ReservedInstancesListing](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2ReservedInstancesListing.html) cmdlet。

------

## Reserved Instance列表状态
<a name="ri-listing-states"></a>

预留实例 页面的 **My Listings (我的列表)** 选项卡上的 **Listing State (列表状态)** 显示了列表的当前状态：

**Listing State (列表状态)** 显示的信息与您在预留实例 Marketplace 中的列表的状态有关。它与 **Reserved Instances (预留实例)** 页面中的 **State (状态)** 列显示的状态信息不同。此 **State** 信息是关于您的预留的。
+ **active (已激活)** — 列表可供购买。
+ **canceled (已取消)** –列表已取消，并且在预留实例 Marketplace 中不再可供购买。
+ **closed (已关闭)** — Reserved Instance 未列出。Reserved Instance 可能因列表已完成销售而处于 `closed` 状态。

## 列表的生命周期
<a name="ri-market-concepts-sold-partial"></a>

当实例出售清单中的所有实例都匹配且售出时，**My Listings** 选项卡将指示 **Total instance count** 匹配 **Sold** 下方列出的计数。此外，实例出售清单中没有 **Available** 实例，并且其 **Status** 为 `closed`。

当列表中只有一部分售出时，AWS将停用列表中的预留实例并创建与剩余预留实例数量相等的预留实例。因此，实例出售清单 ID 及其代表的实例出售清单 (现在具有较少的待售预留) 仍处于激活状态。

将以此方式处理此列表中任何未来预留实例销售。当列表中的所有预留实例售出后，AWS将列表标记为 `closed`。

例如，您创建一个列表数量为 5 的列表：*预留实例 listing ID 5ec28771-05ff-4b9b-aa31-9e57dexample*。

**Reserved Instance** 控制台页中的 **My Listings** 选项卡将按以下所示显示实例出售清单：

*Reserved Instance listing ID 5ec28771-05ff-4b9b-aa31-9e57dexample*
+ 总预留计数= 5
+ 已售 = 0
+ 可用 = 5
+ 状态 = 已激活

 某个买家购买了其中两个预留，这使得三个预留的计数依然可供销售。由于此部分销售，AWS 创建了一个实例计数为 3 的新预留，以表示剩下的三个预留依然可供销售。

这是您的实例出售清单在 **My Listings** 选项卡中的显示方式：

*Reserved Instance listing ID 5ec28771-05ff-4b9b-aa31-9e57dexample*
+ 总预留计数= 5
+ 已售 = 2
+ 可用 = 3
+ 状态 = 已激活

如果您取消您的出售清单，且出售清单的一部分已经售出，取消不会在已售出的部分生效。仅实例出售清单中未售出的部分在预留实例 Marketplace 中将不再可用。

## 在Reserved Instance出售后
<a name="ri-market-concepts-sold"></a>

当您的预留实例售出后，AWS会向您发送一条电子邮件通知。每天如有任何类型的活动，您会收到一封电子邮件通知，其中包含当天的所有活动。活动可能包括您创建或销售列表，或者 AWS 向您的账户发送资金。

------
#### [ Console ]

**跟踪预留实例列表的状态**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航页面中，选择**预留实例**。

1. 在**我的列表**选项卡上，查找**列表状态**值。该选项卡还包含有关期限和标价的信息，以及列表中可用、待处理、售出和取消的实例数量明细。

------
#### [ AWS CLI ]

**跟踪预留实例列表的状态**  
使用 [describe-reserved-instances-listings](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances-listings.html) 命令，借助合适的筛选条件来获取有关您的列表的信息。

```
aws ec2 describe-reserved-instances-listings
```

------
#### [ PowerShell ]

**跟踪预留实例列表的状态**  
使用 [Get-EC2ReservedInstancesListing](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstancesListing.html) cmdlet。

```
Get-EC2ReservedInstancesListing
```

------

## 收款
<a name="ri-market-sold-gettingpaid"></a>

AWS从买方收到资金后，会向已售预留实例的注册所有者账户发送一封电子邮件。

AWS 将自动清算所 (ACH) 电汇发送至您的指定银行账户。通常，此电汇在您的Reserved Instance已售出后的一天到三天内发生。付款每天进行一次。在发放资金后，您将收到包含支付报告的电子邮件。请记住，在 AWS 从您的银行收到确认信息后，您才能收到付款。这可能需要长达两周的时间。

在查看 预留实例 时，仍会显示已销售的 Reserved Instance。

预留实例的现金付款通过电汇转账直接进入您的银行账户。AWS 向您收取您在预留实例 Marketplace 中出售的每个预留实例的总预付价格 12% 的服务费。

## 与买方共享的信息
<a name="ri-market-seller-disclosure"></a>

当您在预留实例 Marketplace 中出售时，AWS 将按照美国的规章在买方声明上分享您的公司法律名称。此外，如果买家因发票或其他税务相关的原因需要联系您而致电 支持，那么 AWS 可能需要向买家提供您的电子邮件地址，这样买家就能与您直接联系。

出于同样的原因，买方的邮政编码和国家/地区信息将在支付报告中提供给卖方。作为卖家，您可能需要在汇给政府任何必要的交易税 (例如销售税和增值税) 时附带此信息。

AWS 不能提供税务建议，但如果您的税务专家确定您另外需要特定的信息，请[联系 支持](https://aws.amazon.com/contact-us/)。
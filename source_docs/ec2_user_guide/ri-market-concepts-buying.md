

# 购买 Amazon EC2 的预留实例
<a name="ri-market-concepts-buying"></a>

要购买 Amazon EC2 的预留实例，您可以使用 Amazon EC2 控制台、命令行工具或 SDK 搜索 AWS 和第三方卖家的预留实例产品，调整搜索参数，直到找到与您的目标完全相符的对象。

在搜索要购买的预留实例时，您将收到一个关于退还产品的成本报价。当您继续购买时，AWS 将自动对购买价格设定一个限定价格。预留实例的总成本不会超过报价金额。

如果价格由于任何原因上升或变动，将不会完成购买。当您从 Amazon EC2 预留实例市场购买第三方卖家的预留实例时，如果有与您的选择类似但预付价格较低的产品，AWS 将以较低的预付价格向您出售这些产品。

在确认购买之前，请检查您计划购买的Reserved Instance的详细信息，并确保所有参数都是准确的。在您购买预留实例之后（无论是从预留实例 Marketplace 中的第三方卖家购买还是从 AWS 购买），将无法取消您的购买。您可以将购买排队到将来的某个日期，也可以在预定时间之前取消已排队的购买。

要购买和修改预留实例，请确保您的用户具有相应的权限，例如描述可用区的能力。有关信息，请参阅 [示例：使用预留实例](ExamplePolicies_EC2.md#iam-example-reservedinstances)（API）或 [示例：使用预留实例](iam-policies-ec2-console.md#ex-reservedinstances)（控制台）。

**Topics**
+ [选择平台](#ri-choosing-platform)
+ [排队购买](#ri-queued-purchase)
+ [购买标准 预留实例](#ri-buying-standard)
+ [购买 可转换预留实例](#ri-buying-convertible)
+ [从预留实例 Marketplace 中购买](#ri-market-buying-guide)
+ [取消已排队的购买](#cancel-queued-purchase)
+ [续订 Reserved Instance](#renew-ri)

## 选择平台
<a name="ri-choosing-platform"></a>

Amazon EC2 支持以下平台的预留实例：
+ Linux/UNIX
+ 含有 SQL Server Standard 的 Linux
+ 含有 SQL Server Web 的 Linux
+ 含有 SQL Server Enterprise 的 Linux
+ SUSE Linux
+ Red Hat Enterprise Linux
+ Red Hat Enterprise Linux with HA
+ Windows
+ 含有 SQL Server Standard 的 Windows
+ 含有 SQL Server Web 的 Windows
+ 含有 SQL Server Enterprise 的 Windows

**注意事项**
+ 如果您对 **Red Hat Enterprise Linux**、**SUSE Linux** 或 **Ubuntu Pro** 使用现有订阅（BYOS），则必须选择适用于 **Linux/Unix** 平台的服务产品。
+ 运行 **macOS** 或 Ubuntu Pro（包含 EC2 订阅，即非 BYOS）的实例不支持预留实例。如需通过按需型实例定价节省费用，建议您使用配套节省计划的 macOS 和 Ubuntu Pro（包括 EC2 订阅）。有关更多信息，请参阅《[Savings Plans User Guide](https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html)》。

为确保实例在特定的预留实例中运行，预留实例的平台必须与用于启动实例的 AMI 的平台相匹配。对于 Linux AMI，请务必检查 AMI 平台是使用常规值 **Linux/UNIX** 还是具体值（如 **SUSE Linux**）。

------
#### [ Console ]

**检查 AMI 平台**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI。

1. 在**详细信息**选项卡上，记下**平台详细信息**的值。

------
#### [ AWS CLI ]

**检查 AMI 平台**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令并检查 `PlatformDetails` 的值。

```
aws ec2 describe-images \
    --image-id {{ami-0abcdef1234567890}} \
    --query Images[*].PlatformDetails
```

下面是示例输出。

```
[
    "Linux/UNIX"
]
```

------
#### [ PowerShell ]

**检查 AMI 平台**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet 并检查 `PlatformDetails` 的值。

```
Get-EC2Image `
    -ImageId {{ami-0abcdef1234567890}} | `
    Select PlatformDetails
```

下面是示例输出。

```
PlatformDetails
---------------
Linux/UNIX
```

------

## 排队购买
<a name="ri-queued-purchase"></a>

默认情况下，当您购买时 Reserved Instance，购买立即完成。或者，您也可以排队预约在将来的某个日期和时间购买。例如，您可以排队预约在现有 Reserved Instance 到期的时间购买。这样可以帮助您确保获得不中断的服务。

您可以排队购买区域 预留实例，但不能排队购买其他卖家的区域 预留实例 或 预留实例。您最早可以提前三年排队购买。在指定日期和时间，将使用默认支付方式进行购买。支付成功后，将体现账单优势。

您可以在 Amazon EC2 控制台中为已排队的购买设置日期，购买将排队等候至该日期的 00:00 UTC。要为已排队的购买指定不同的时间，请使用 AWS SDK 或命令行工具。

您可以在 Amazon EC2 控制台中查看已排队的购买。已排队的购买的状态为**已排队**。在指定时间之前，您随时可以取消已排队的购买。有关详细信息，请参阅 [取消已排队的购买](#cancel-queued-purchase)。

## 购买标准 预留实例
<a name="ri-buying-standard"></a>

您可以购买特定可用区中的标准预留实例从而获得容量预留。或者，您也可以放弃容量预留并购买区域性标准Reserved Instance。

购买完成后，如果已有正在运行的与 Reserved Instance 规范匹配的实例，账单优势将立即体现。您不需要重启实例。如果您没有合适的正在运行的实例，请启动实例并确保符合您为预留实例指定的相同标准。有关更多信息，请参阅 [使用您的预留实例](using-reserved-instances.md)。

有关如何将 预留实例 应用于正在运行的实例的示例，请参阅[如何应用预留实例折扣](apply_ri.md)。

------
#### [ Console ]

**购买标准预留实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Reserved Instances (预留实例)**，然后选择 **Purchase 预留实例 (购买 预留实例)**。

1. 对于 **Offering class (服务类别)**，选择 **Standard (标准)** 以显示标准 预留实例。

1. 要购买容量预留，请在购买屏幕的右上角开启 **Only show offerings that reserve capacity (只显示预留容量的产品)**。开启此设置后，**Availability Zone (可用区)** 字段将会出现。

   要购买区域 Reserved Instance，请关闭此设置。关闭此设置后，**Availability Zone (可用区)** 字段将会消失。

1. 根据需要选择其他配置，然后选择 **Search (搜索)**。

1. 对于您要购买的每个 Reserved Instance，输入所需数量，然后选择 **Add to cart (添加到购物车)**。

   要从预留实例 Marketplace 购买标准预留实例，请在搜索结果的 **Seller (卖家)** 列中查找 **3rd party (第三方)**。**Term** 列会显示非标准期限。有关更多信息，请参阅[从预留实例 Marketplace 中购买](#ri-market-buying-guide)。

1. 要查看已选择的 预留实例 的汇总，请选择 **View cart (查看购物车)**。

1. 如果 **Order on (订购时间)** 为 **Now (现在)**，则在您选择 **Order all (全部订购)** 后，购买将立即完成。要排队购买，请选择 **Now (现在)** 并选择一个日期。您可以为购物车中每个符合条件的产品选择不同的日期。购买已排队，一直到选定日期 UTC 00:00 之前。

1. 要完成订单，请选择 **Order all (全部订购)**。

   如果在下订单时有与您的选择类似的低价位产品，AWS 将为您提供价格更低的产品。

1. 选择 **Close**。

   您的订单状态将在 **State (状态)** 列中列出。当您的订单完成时，**State (状态)** 值将从 `Payment-pending` 变为 `Active`。当 Reserved Instance 的状态为 `Active` 时即可使用。

   如果状态转为 `Retired`，AWS 可能未收到您的付款。

------
#### [ AWS CLI ]

**购买标准预留实例**

1. 使用 [describe-reserved-instances-offerings](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances-offerings.html) 命令查找可用 预留实例。为 `--offering-class` 选项指定 `standard` 以仅返回标准预留实例。可以应用更多标准来缩小结果范围。例如，使用以下命令为 `Linux/UNIX` 购买具有默认租赁的仅一年期的区域性 `t2.large` 预留实例。

   ```
   aws ec2 describe-reserved-instances-offerings \
       --instance-type {{t2.large}} \
       --offering-class standard \
       --product-description "{{Linux/UNIX}}" \
       --instance-tenancy {{default}} \
       --filters Name=duration,Values={{31536000}} \
                 Name=scope,Values={{Region}}
   ```

   要仅在预留实例 Marketplace 上查找预留实例，请使用 `marketplace` 筛选条件并在请求中不指定持续时间，因为期限可能会短于 1 年期或 3 年期。

   ```
   aws ec2 describe-reserved-instances-offerings \
       --instance-type {{t2.large}} \
       --offering-class standard \
       --product-description "{{Linux/UNIX}}" \
       --instance-tenancy {{default}} \
       --filters Name={{marketplace}},Values=true
   ```

   当您找到符合需求的 Reserved Instance 时，请记下产品 ID。例如：

   ```
   "ReservedInstancesOfferingId": "bec624df-a8cc-4aad-a72f-4f8abc34caf2"
   ```

1. 使用 [purchase-reserved-instances-offering](https://docs.aws.amazon.com/cli/latest/reference/ec2/purchase-reserved-instances-offering.html) 命令购买您的 Reserved Instance。您必须指定在上一步中获取的Reserved Instance产品 ID，并且必须为预留指定实例数量。

   ```
   aws ec2 purchase-reserved-instances-offering \
       --reserved-instances-offering-id {{bec624df-a8cc-4aad-a72f-4f8abc34caf2}} \
       --instance-count {{1}}
   ```

   默认情况下，会立即完成购买。或者，若要排队购买，请在之前的调用中添加以下选项。

   ```
   --purchase-time "{{2020}}-{{12}}-{{01}}T{{00}}:{{00}}:{{00}}Z"
   ```

1. 使用 [describe-reserved-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances.html) 命令获取您的 Reserved Instance 的状态。

   ```
   aws ec2 describe-reserved-instances \
       --reserved-instances-ids {{b847fa93-e282-4f55-b59a-1342fec06327}} \
       --query ReservedInstances[].State
   ```

------
#### [ PowerShell ]

**购买标准预留实例**

1. 使用 [Get-EC2ReservedInstancesOffering](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstancesOffering.html) cmdlet 查找可用的预留实例。为 `standard` 参数指定 `-OfferingClass` 以仅返回标准 预留实例。可以应用更多标准来缩小结果范围。例如，使用以下命令为 `Linux/UNIX` 购买具有默认租赁的仅一年期的区域性 `t2.large` 预留实例。

   ```
   Get-EC2ReservedInstancesOffering `
       -InstanceType "{{t2.large}}" `
       -OfferingClass "standard" `
       -ProductDescription "{{Linux/UNIX}}" `
       -InstanceTenancy "{{default}}" `
       -Filters @{Name="duration"; Values="{{31536000}}"} `
                @{Name="scope"; Values="{{Region}}"
   ```

   要仅在预留实例 Marketplace 上查找预留实例，请使用 `marketplace` 筛选条件并在请求中不指定持续时间，因为期限可能会短于 1 年期或 3 年期。

   ```
   Get-EC2ReservedInstancesOffering `
       -InstanceType {{t2.large}} `
       -OfferingClass "standard" `
       -ProductDescription "{{Linux/UNIX}}" `
       -InstanceTenancy {{default}} `
       -Filters @{Name="{{marketplace}}"; Values="true"}
   ```

   当您找到符合需求的 Reserved Instance 时，请记下产品 ID。例如：

   ```
   bec624df-a8cc-4aad-a72f-4f8abc34caf2
   ```

1. 使用 [New-EC2ReservedInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2ReservedInstance.html) cmdlet 购买预留实例。您必须指定在上一步中获取的Reserved Instance产品 ID，并且必须为预留指定实例数量。

   ```
   New-EC2ReservedInstance `
       -ReservedInstancesOfferingId "{{bec624df-a8cc-4aad-a72f-4f8abc34caf2}}" `
       -InstanceCount {{1}}
   ```

   默认情况下，会立即完成购买。或者，若要排队购买，请在之前的调用中增加以下参数。

   ```
   -PurchaseTime "{{2020}}-{{12}}-{{01}}T{{00}}:{{00}}:{{00}}Z"
   ```

1. 使用 [Get-EC2ReservedInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstance.html) cmdlet 获取预留实例的状态。

   ```
   Get-EC2ReservedInstance `
       -ReservedInstancesId {{b847fa93-e282-4f55-b59a-1342fec06327}} | `
       Select State
   ```

------

## 购买 可转换预留实例
<a name="ri-buying-convertible"></a>

您可以购买特定可用区中的可转换预留实例从而获得容量预留。或者，您也可以放弃容量预留并购买区域性可转换预留实例。

如果已经有与Reserved Instance的规格匹配的运行实例，则将立即体现账单收益。您不必重启您的实例。如果您没有合适的运行实例，请启动实例并确保符合您为Reserved Instance指定的相同标准。有关更多信息，请参阅[使用您的预留实例](using-reserved-instances.md)。

有关如何将 预留实例 应用于正在运行的实例的示例，请参阅[如何应用预留实例折扣](apply_ri.md)。

------
#### [ Console ]

**购买可转换预留实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Reserved Instances (预留实例)**，然后选择 **Purchase 预留实例 (购买 预留实例)**。

1. 对于 **Offering class (服务类别)**，选择 **Convertible (可转换)** 以显示 可转换预留实例。

1. 要购买容量预留，请在购买屏幕的右上角开启 **Only show offerings that reserve capacity (只显示预留容量的产品)**。开启此设置后，**Availability Zone (可用区)** 字段将会出现。

   要购买区域 Reserved Instance，请关闭此设置。关闭此设置后，**Availability Zone (可用区)** 字段将会消失。

1. 根据需要选择其他配置并选择 **搜索**。

1. 对于您要购买的每个 可转换预留实例，输入数量，然后选择 **Add to cart (添加到购物车)**。

1. 要查看您的选择的摘要，请选择 **View cart (查看购物车)**。

1. 如果 **Order on (订购时间)** 为 **Now (现在)**，则在您选择 **Order all (全部订购)** 后，购买将立即完成。要排队购买，请选择 **Now (现在)** 并选择一个日期。您可以为购物车中每个符合条件的产品选择不同的日期。购买已排队，一直到选定日期 UTC 00:00 之前。

1. 要完成订单，请选择 **Order all (全部订购)**。

   如果在下订单时有与您的选择类似的低价位产品，AWS 将为您提供价格更低的产品。

1. 选择 **Close**。

   您的订单状态将在 **State (状态)** 列中列出。当您的订单完成时，**State (状态)** 值将从 `Payment-pending` 变为 `Active`。当 Reserved Instance 的状态为 `Active` 时即可使用。

   如果状态转为 `Retired`，AWS 可能未收到您的付款。

------
#### [ AWS CLI ]

**购买可转换预留实例**

1. 使用 [describe-reserved-instances-offerings](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances-offerings.html) 命令查找可用 预留实例。为 `--offering-class` 选项指定 `convertible` 以仅返回可转换预留实例。可以应用更多标准来缩小结果范围。例如，使用以下命令为 `Linux/UNIX` 购买具有默认租赁的区域性 `t2.large` 预留实例。

   ```
   aws ec2 describe-reserved-instances-offerings \
       --instance-type {{t2.large}} \
       --offering-class convertible \
       --product-description "{{Linux/UNIX}}" \
       --instance-tenancy {{default}} \
       --filters Name=scope,Values={{Region}}
   ```

   当您找到符合需求的 Reserved Instance 时，请记下产品 ID。例如：

   ```
   "ReservedInstancesOfferingId": "bec624df-a8cc-4aad-a72f-4f8abc34caf2"
   ```

1. 使用 [purchase-reserved-instances-offering](https://docs.aws.amazon.com/cli/latest/reference/ec2/purchase-reserved-instances-offering.html) 命令购买您的 Reserved Instance。您必须指定在上一步中获取的Reserved Instance产品 ID，并且必须为预留指定实例数量。

   ```
   aws ec2 purchase-reserved-instances-offering \
       --reserved-instances-offering-id {{bec624df-a8cc-4aad-a72f-4f8abc34caf2}} \
       --instance-count {{1}}
   ```

   默认情况下，会立即完成购买。或者，若要排队购买，请在之前的调用中添加以下选项。

   ```
   --purchase-time "{{2020}}-{{12}}-{{01}}T{{00}}:{{00}}:{{00}}Z"
   ```

1. 使用 [describe-reserved-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances.html) 命令获取您的 Reserved Instance 的状态。

   ```
   aws ec2 describe-reserved-instances \
       --reserved-instances-ids {{b847fa93-e282-4f55-b59a-1342fec06327}} \
       --query ReservedInstances[].State
   ```

------
#### [ PowerShell ]

**购买可转换预留实例**

1. 使用 [Get-EC2ReservedInstancesOffering](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstancesOffering.html) cmdlet 查找可用的预留实例。为 `convertible` 参数指定 `-OfferingClass` 以仅返回 可转换预留实例。可以应用更多标准来缩小结果范围。例如，使用以下命令为 `Linux/UNIX` 购买具有默认租赁的区域性 `t2.large` 预留实例。

   ```
   Get-EC2ReservedInstancesOffering `
       -InstanceType "{{t2.large}}" `
       -OfferingClass "convertible" `
       -ProductDescription "{{Linux/UNIX}}" `
       -InstanceTenancy "{{default}}" `
       -Filters @{Name="scope"; Values="{{Region}}"
   ```

   当您找到符合需求的 Reserved Instance 时，请记下产品 ID。例如：

   ```
   bec624df-a8cc-4aad-a72f-4f8abc34caf2
   ```

1. 使用 [New-EC2ReservedInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2ReservedInstance.html) cmdlet 购买预留实例。您必须指定在上一步中获取的预留实例产品 ID，并且必须为预留指定实例数量。

   ```
   New-EC2ReservedInstance `
       -ReservedInstancesOfferingId "{{bec624df-a8cc-4aad-a72f-4f8abc34caf2}}" `
       -InstanceCount {{1}}
   ```

   默认情况下，会立即完成购买。或者，若要排队购买，请在之前的调用中增加以下参数。

   ```
   -PurchaseTime "{{2020}}-{{12}}-{{01}}T{{00}}:{{00}}:{{00}}Z"
   ```

1. 使用 [Get-EC2ReservedInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstance.html) cmdlet 获取预留实例的状态。

   ```
   Get-EC2ReservedInstance `
       -ReservedInstancesId {{b847fa93-e282-4f55-b59a-1342fec06327}} | `
       Select State
   ```

------

## 从预留实例 Marketplace 中购买
<a name="ri-market-buying-guide"></a>

您可以从预留实例 Marketplace 向不再需要其预留实例的第三方卖家购买预留实例。您可以使用 Amazon EC2 控制台或命令行工具执行此操作。该过程类似于从AWS购买预留实例。有关更多信息，请参阅[购买标准 预留实例](#ri-buying-standard)。

在预留实例 Marketplace 中购买的预留实例与直接从 AWS 购买的预留实例有一些区别：
+ **有效期** – 从第三方卖方购买的预留实例具有的剩余期限短于完整标准期限。从 AWS 获得的完整标准期限为一年或三年。
+ **预付价格** – 第三方预留实例可以不同的预付价格出售。使用费或周期性费用与最初从AWS购买预留实例时设定的费用一致。
+ **预留实例类型** – 只能从预留实例 Marketplace 购买 Amazon EC2 标准预留实例。可转换预留实例、Amazon RDS 和 Amazon ElastiCache 预留实例不能在预留实例 Marketplace 上购买。

有关您的基本信息将与卖方进行共享，如您的邮政编码和国家/地区信息。

此信息使卖方能够计算他们必须向政府缴纳并且采用支付报告形式提供的任何必需的交易税 (如销售税或增值税)。在极少数情况下，AWS 可能必须向卖方提供您的电子邮件地址，这样卖方才能就与销售相关的问题 (例如税务问题) 与您联系。

出于相似的原因，AWS 将在买方的购货发票上共享卖方的法律实体名称。如果您出于税务或相关原因需要关于卖方的额外信息，请联系 [支持](https://aws.amazon.com/contact-us/)。

## 取消已排队的购买
<a name="cancel-queued-purchase"></a>

您最早可以提前三年排队购买。在指定时间之前，您随时可以取消已排队的购买。

------
#### [ Console ]

**取消已排队的购买**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Reserved Instances**。

1. 选择一个或多个 预留实例。

1. 依次选择 **Actions (操作)**、**Delete queued Reserved Instances (删除已排队的预留实例)**。

1. 提示进行确认时，选择 **Delete (删除)**，然后选择 **Close (关闭)**。

------
#### [ AWS CLI ]

**取消已排队的购买**  
使用 [delete-queued-reserved-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-queued-reserved-instances.html) 命令。

```
aws ec2 delete-queued-reserved-instances \
    --reserved-instances-ids {{b847fa93-e282-4f55-b59a-1342fec06327}}
```

------
#### [ PowerShell ]

**取消已排队的购买**  
使用 [Remove-EC2QueuedReservedInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2QueuedReservedInstance.html) cmdlet。

```
Remove-EC2QueuedReservedInstance `
    -ReservedInstancesId {{b847fa93-e282-4f55-b59a-1342fec06327}}
```

------

## 续订 Reserved Instance
<a name="renew-ri"></a>

您可以在 Reserved Instance 按计划过期之前续订它。续订 Reserved Instance 将对购买 Reserved Instance（具有相同配置）进行排队，直到当前 Reserved Instance 过期。

您必须使用 Amazon EC2 控制台续订预留实例。

**使用排队的购买续订预留实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Reserved Instances**。

1. 选择要续订的预留实例。

1. 依次选择 **Actions (操作)**、**Renew Reserved Instances (续订预留实例)**。

1. 要完成订单，请选择 **Order all (全部订购)**，然后选择 **Close (关闭)**。
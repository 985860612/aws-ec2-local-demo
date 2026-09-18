

# 查找和购买容量块
<a name="capacity-blocks-purchase"></a>

要预留容量块，您首先需要找到符合您需求的可用容量的时间段。要查找可供预留的容量块，请指定以下内容。
+ 您需要的实例数
+ 您需要的实例持续时间
+ 您需要预留的日期范围

要搜索可用的容量块产品，您可以指定预留持续时间和实例数量。您指定预留持续时间必须**以 1 天为增量，最多 14 天；以 7 天为增量，最多 182 天**。每个容量块最多可以有 64 个实例，您最多可以跨容量块拥有 256 个实例。

当您请求符合规格的容量块时，系统最多会返回 6 个可用块的详细信息。所有容量块均于 UTC 时间上午 11:30 结束，因此同一天开始的块的持续时间将与您所需的持续时间最接近。一个块的持续时间将略小于您所需的持续时间，而另一个块的持续时间将略大于您所需的持续时间。

产品详细信息包括预留开始时间、预留可用区和预留价格。有关更多信息，请参阅 [容量块定价和计费](capacity-blocks-pricing-billing.md)。

您可以购买所显示的容量块产品，也可以修改搜索条件以查看其他可用选项。该产品没有预定义的到期时间，但产品仅按先到先得的原则进行提供。

当您购买容量块产品时，您会立即收到回复，确认已预留您的容量块。确认后，您将在账户中看到一个新的容量预留，其预留类型为 `capacity-block`，并且 `start-date` 设置为所购买产品的开始时间。您的容量块预留创建时的状态为 `payment-pending`。成功处理预付款后，预留状态变为 `scheduled`。有关更多信息，请参阅 [计费](capacity-blocks-pricing-billing.md#capacity-blocks-billing)。

**注意**  
 要购买和使用 Local Zones 中的容量块，您必须主动启用该本地区域。

------
#### [ Console ]

**查找和购买容量块**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在屏幕顶部的导航栏中，选择一个 AWS 区域。此选项很重要，因为并非所有区域中的所有实例类型都支持 64 个实例的容量块大小。

1. 在导航窗格中，依次选择**容量预留**、**创建容量块**。

1. 在**容量块类型**下，选择**实例**或 **UltraServer**。

1. 在**容量属性**下，您可以定义容量块搜索参数。默认情况下，平台为 Linux。如果要选择其他操作系统，请使用 AWS CLI。有关更多信息，请参阅 [支持的平台](ec2-capacity-blocks.md#capacity-blocks-platforms)。

1. 在**总容量**（适用于实例）或 **UltraServer 计数**（适用于 UltraServer）下，指定要预留的实例或 UltraServer 的数量。

1. 在**持续时间**下，输入您需要预留的天数或周数。

1. 在**容量块的搜索日期范围**下，输入预留的最早开始日期。

1. 选择**查找容量块**。

1. 如果有符合您要求的容量块，您将在**推荐的容量块**下方看到产品。如果有多个产品符合要求，则会显示开始日期最早的可用容量块产品。要查看其他容量块产品，请调整搜索输入，然后再次选择**查找容量块**。

1. 当您找到要购买的容量块产品时，选择**下一步**。

1. （可选）在**添加标签**页面上，选择**添加新标签**。

1. **查看和购买**页面列出了开始和结束日期、持续时间、实例总数和价格。
**注意**  
预留后，无法取消容量块。

1. 在**购买容量块**弹出窗口中，键入确认，然后选择**购买**。

------
#### [ AWS CLI ]

**查找实例容量块**  
使用 [describe-capacity-block-offerings](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-block-offerings.html) 命令。

以下示例查找实例容量块。

```
aws ec2 describe-capacity-block-offerings \
--instance-type {{p5.48xlarge}} \
--instance-count {{16}} \
--start-date-range {{2023-08-14T00:00:00Z}} \
--end-date-range {{2023-10-22-T00:00:00Z}} \
--capacity-duration-hours {{48}} \
--all-availability-zones
```

以下示例查找 UltraServer 容量块。

```
aws ec2 describe-capacity-block-offerings \
--ultraserver-type {{u-p6e-gb200x72}} \
--ultraserver-count {{1}} \
--start-date-range {{2023-08-14T00:00:00Z}} \
--end-date-range {{2023-10-22-T00:00:00Z}} \
--capacity-duration-hours {{48}}
```

**购买容量块**  
将 [purchase-capacity-block](https://docs.aws.amazon.com/cli/latest/reference/ec2/purchase-capacity-block.html) 命令与上一个示例输出中容量块的产品 ID 结合使用。

```
aws ec2 purchase-capacity-block \
--capacity-block-offering-id {{cb-0123456789abcdefg}} \
--instance-platform {{Linux/UNIX}}
```

------
#### [ PowerShell ]

**查找容量块**  
使用 [Get-EC2CapacityBlockOffering](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2CapacityBlockOffering.html) cmdlet。

以下示例查找实例容量块。

```
Get-EC2CapacityBlockOffering `
-InstanceType {{p5.48xlarge}} `
-InstanceCount {{16}} `
-CapacityDurationHour {{48}} `
-StartDateRange {{2023-08-14T00:00:00Z}} `
-EndDateRange {{2023-10-22-T00:00:00Z}} `
-AllAvailabilityZones {{$true}}
```

以下示例查找 UltraServer 容量块。

```
Get-EC2CapacityBlockOffering `
-UltraserverType {{u-p6e-gb200x72}} `
-UltraserverCount  {{1}} `
-CapacityDurationHour {{48}} `   
-StartDateRange {{2023-08-14T00:00:00Z}} `
-EndDateRange {{2023-10-22-T00:00:00Z}}
```

**购买容量块**  
将 [New-EC2EC2CapacityBlock](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2EC2CapacityBlock.html) cmdlet 与上一个示例输出中容量块的产品 ID 结合使用。

```
New-EC2EC2CapacityBlock `
-CapacityBlockOfferingId {{cb-0123456789abcdefg}} `
-InstancePlatform {{Linux/UNIX}}
```

------
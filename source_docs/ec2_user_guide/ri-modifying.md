

# 修改 预留实例
<a name="ri-modifying"></a>

当需求改变时，可以修改标准或可转换预留实例并继续利用账单优势。您可以修改可用区、实例大小（在相同的实例系列和世代中），以及预留实例的范围等属性。

**注意**  
您还可以将可转换预留实例交换为具有不同配置的其他可转换预留实例。有关更多信息，请参阅[交换 可转换预留实例](ri-convertible-exchange.md)。

可以修改全部或部分预留实例。可以将原始 预留实例 分为两个或更多新的 预留实例。例如，如果您在 `us-east-1a` 中有 10 个实例的预留，并决定将其中 5 个实例移至 `us-east-1b`，则修改请求会生成两个新的预留实例 - 一个用于 `us-east-1a` 中的 5 个实例，另一个用于 `us-east-1b` 中的 5 个实例。

还可以将两个或更多 预留实例 *合并* 成单个 Reserved Instance。例如，如果有四个 `t2.small` 均为 预留实例，则可以将其合并以创建单个 `t2.large` Reserved Instance。有关更多信息，请参阅[对于修改实例大小的支持](#ri-modification-instancemove)。

修改之后，预留实例的定价权益仅适用于与新参数匹配的实例。例如，如果您更改预留的可用区，则容量预留和定价优势自动应用到在新可用区中使用的实例。除非您的账户有其他适用的预留，否则将按照按需费率对不再符合新参数的实例收费。

如果您的修改请求成功：
+ 修改的预留会立即生效，并且定价优惠将于进行修改请求时这一小时的开始应用于新实例。例如，如果您在晚上 9:15 成功修改了预留，则定价优惠将在晚上 9:00 转移到新实例。您可以使用 [describe-reserved-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances.html) 命令，获取修改后的预留实例的生效日期。
+ 原始预留将停用。其结束日期是新预留的开始日期，而新预留的结束日期与原始Reserved Instance的结束日期相同。如果您修改一个剩余期限为 16 个月的三年期预留，则修改后得到的预留是为期 16 个月的预留，其结束日期与原始预留相同。
+ 已修改的预留将列出 0 美元固定价格，而不是原始预留的固定价格。
+ 已修改的预留实例的固定价格不影响您的账户的折扣定价套餐计算，后者基于原始预留的固定价格。

如果修改请求失败，预留实例会保持其原始配置，并立即对其他修改请求可用。

修改不会产生任何费用，因此您不会收到任何新账单或发票。

您可以根据自己的需要随时修改预留，但是不能在提交之后更改或取消挂起的修改请求。修改成功完成后，如果需要，您可以提交另一个修改请求，以回滚您所做的任何更改。

**Topics**
+ [修改的要求和限制](#ri-modification-limits)
+ [对于修改实例大小的支持](#ri-modification-instancemove)
+ [提交修改请求](#ri-modification-process)
+ [修改请求故障排除](#ri-modification-process-messages)

## 修改的要求和限制
<a name="ri-modification-limits"></a>

您可以按如下方式修改这些属性。


| 可修改的属性 | 支持的平台 | 限制和注意事项 | 
| --- | --- | --- | 
| 在相同区域内更改**可用区** | Linux 和 Windows | - | 
| 将**范围**从可用区更改到区域以及反之 | Linux 和 Windows | 可用区预留实例的范围限定为可用区，并在该可用区中预留容量。如果您将范围从可用区更改为区域（即从可用区范围到区域性），则会失去容量预留优势。<br />区域性预留实例的范围限定为区域。预留实例折扣适用于在该区域任何可用区中运行的实例。此外，预留实例折扣适用于所选实例系列中所有大小的实例用量。如果您将范围从区域更改为可用区（即从区域性到可用区范围），则会失去可用区灵活性和实例大小灵活性（如果适用）。<br />有关更多信息，请参阅 [如何应用预留实例折扣](apply_ri.md)。 | 
| 更改相同实例系列和世代中的**实例大小** | 仅限 Linux/UNIX<br />实例大小灵活性不适用于其他平台上的 预留实例，这些平台包括含有 SQL Server Standard 的 Linux、含有 SQL Server Web 的 Linux、含有 SQL Server Enterprise 的 Linux、Red Hat Enterprise Linux、SUSE Linux、Windows、含有 SQL Standard 的 Windows、含有 SQL Server Enterprise 的 Windows 和含有 SQL Server Web 的 Windows。 | 预留必须使用默认租赁。某些实例系列不受支持，因为没有其他大小可用。有关更多信息，请参阅 [对于修改实例大小的支持](#ri-modification-instancemove)。 | 

**要求**

Amazon EC2 处理您的修改请求的前提是，对于您的新配置（如果适用），有足够的容量，同时满足以下条件：
+ 在您购买 Reserved Instance 时或在此之前，无法对其进行修改
+ Reserved Instance 必须是活动的
+ 不能有待处理的修改请求
+ 预留实例未列在预留实例 Marketplace 中
+ 原始预留的实例大小占用空间必须与新配置匹配。有关更多信息，请参阅[对于修改实例大小的支持](#ri-modification-instancemove)。
+ 原始 预留实例 要么全部是标准 预留实例，要么全部是 可转换预留实例，不能每种类型都有一些
+ 原始 预留实例 如果是标准 预留实例，则必须在相同的时间过期
+ 要修改实例大小，预留实例必须支持实例大小灵活性。关于不支持实例大小灵活性的预留实例列表，请参阅[实例大小灵活性](apply_ri.md#ri-instance-size-flexibility)。

## 对于修改实例大小的支持
<a name="ri-modification-instancemove"></a>

在满足以下要求时可以修改Reserved Instance的实例大小。

**要求**
+ 平台是 Linux/UNIX。
+ 您必须在相同 [实例系列](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html)（用字母表示，例如 T）和 [世代](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html)（用数字指示，例如 2）中选择其他实例大小。

  例如，您可以将预留实例从 `t2.small` 修改为 `t2.large`，因为它们属于同一 T2 系列和世代。但您不能将预留实例从 T2 修改为 M2 或从 T2 修改为 T3，因为在这两个示例中，目标实例系列和世代与原始预留实例不同。
+ 只有在预留实例支持实例大小灵活性时，才可以修改预留实例的实例大小。关于不支持实例大小灵活性的预留实例列表，请参阅[实例大小灵活性](apply_ri.md#ri-instance-size-flexibility)。
+ 您不能修改 `t1.micro` 实例的预留实例的实例大小，因为 `t1.micro` 仅有一个大小。
+ 原始和新 Reserved Instance 必须具有相同的实例大小占用空间。

**Topics**
+ [实例大小占用空间](#ri-modification-instance-size-footprint)
+ [裸机实例的标准化因子](#ri-normalization-factor-bare-metal-2)

### 实例大小占用空间
<a name="ri-modification-instance-size-footprint"></a>

每个Reserved Instance都有*实例大小占用空间*，该空间由预留中实例大小的标准化因子和实例数量决定。修改 Reserved Instance 中的实例大小时，新配置的占用空间必须与原始配置相匹配，否则不会处理修改请求。

要计算Reserved Instance的实例占用空间大小，请将实例数量乘以标准化因子。在 Amazon EC2 控制台中，标准化因子用单位数来度量。下表描述了一个实例系列中实例大小的标准化因子。例如，`t2.medium` 的标准化因子为 2，因此 4 个 `t2.medium` 实例的预留具有 8 个单位的占用空间。


| 实例大小 | 标准化因子 | 
| --- | --- | 
| nano | 0.25 | 
| micro | 0.5 | 
| small | 1 | 
| medium | 2 | 
| large | 4 | 
| xlarge | 8 | 
| 2xlarge | 16 | 
| 3xlarge | 24 | 
| 4xlarge | 32 | 
| 6xlarge | 48 | 
| 8xlarge | 64 | 
| 9xlarge | 72 | 
| 10xlarge | 80 | 
| 12xlarge | 96 | 
| 16xlarge | 128 | 
| 18xlarge | 144 | 
| 24xlarge | 192 | 
| 32xlarge | 256 | 
| 48xlarge | 384 | 
| 56xlarge | 448 | 
| 96xlarge | 768 | 
| 112xlarge | 896 | 

只要预留的实例大小占用空间保持不变，您就可以将预留分配给相同实例系列中的不同实例大小。例如，您可以将 1 个 `t2.large`（1 个 4 单位）实例的预留划分为 4 个 `t2.small`（4 个 1 单位）实例。同样，您可以将 4 个 `t2.small` 实例的预留合并为 1 个 `t2.large` 实例。但是，您不能将两个 `t2.small` 实例的预留更改为一个 `t2.large` 实例，因为新预留的占用空间（4 个单位）大于原始预留的占用空间（2 个单位）。

在以下示例中，您有 1 个具有 2 个 `t2.micro` 实例（1 个单位）的预留和 1 个具有 1 个 `t2.small` 实例（1 个单位）的预留。如果您将这些预留合并到具有 1 个 `t2.medium` 实例（2 个单位）的单个预留中，则新预留的占用空间等于合并预留的占用空间。

![修改预留实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ri-modify-merge.png)


您还可以修改预留以将其拆分为多个预留。在以下示例中，您有 1 个具有 `t2.medium` 实例（2 个单位）的预留。您可以将该预留划分为两个预留，其中之一具有 2 个 `t2.nano` 实例（.5 个单位），另一个具有 3 个 `t2.micro` 实例（1.5 个单位）。

![修改预留实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ri-modify-divide.png)


### 裸机实例的标准化因子
<a name="ri-normalization-factor-bare-metal-2"></a>

您可以使用相同实例系列中的其他大小，通过 `metal` 实例修改预留。同样，您可以使用相同实例系列中的 `metal` 大小，通过裸机实例以外的实例修改预留。通常，裸机实例的大小与相同实例系列中可用的最大实例大小相同。例如，`i3.metal` 实例的大小与 `i3.16xlarge` 实例的大小相同，因此它们具有相同的标准化因子。

下表描述了具有裸机实例的实例系列中裸机实例大小的标准化因子。`metal` 实例的标准化因子取决于实例系列，与其他实例大小不同。


| 实例大小 | 标准化因子 | 
| --- | --- | 
| a1.metal | 32 | 
|  m5zn.metal \| x2iezn.metal z1d.metal  | 96 | 
|  c6g.metal \| c6gd.metal \| i3.metal \| m6g.metal \| m6gd.metal \| r6g.metal \| r6gd.metal \| x2gd.metal  | 128 | 
| c5n.metal | 144 | 
|  c5.metal \| c5d.metal \| i3en.metal \| m5.metal \| m5d.metal \| m5dn.metal \| m5n.metal \| r5.metal \| r5b.metal \| r5d.metal \| r5dn.metal \| r5n.metal  | 192 | 
|  c6i.metal \| c6id.metal \| m6i.metal \| m6id.metal \| r6d.metal \| r6id.metal  | 256 | 
|  u-18tb1.metal \| u-24tb1.metal  | 448 | 
|  u-6tb1.metal \| u-9tb1.metal \| u-12tb1.metal  | 896 | 

例如，`i3.metal` 实例的标准化因子为 128。如果您购买 `i3.metal` 默认租期 Amazon Linux/Unix Reserved Instance，则可以按照如下方式划分预留：
+ `i3.16xlarge` 的大小与 `i3.metal` 实例的大小相同，因此其标准化因子为 128 (128/1)。一个 `i3.metal` 实例的预留可以修改到一个 `i3.16xlarge` 实例中。
+ `i3.8xlarge` 的大小是 `i3.metal` 实例大小的一半，因此其标准化因子为 64 (128/2)。一个 `i3.metal` 实例的预留可以划分到两个 `i3.8xlarge` 实例中。
+ `i3.4xlarge` 的大小是 `i3.metal` 实例大小的四分之一，因此其标准化因子为 32 (128/4)。一个 `i3.metal` 实例的预留可以划分到四个 `i3.4xlarge` 实例中。

## 提交修改请求
<a name="ri-modification-process"></a>

在修改预留实例之前，请确保已阅读适用的[限制](#ri-modification-limits)。在您修改实例大小之前，请计算所要修改的原始预留的总[实例大小占用空间](#ri-modification-instancemove)，并确保该值与新配置的总实例大小占用空间相匹配。

------
#### [ Console ]

**修改预留实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在 **Reserved Instances (预留实例)** 页面上，选择一个或多个要修改的预留实例，然后依次选择 **Actions (操作)** 和 **Modify Reserved Instances (修改预留实例)**。

   如果 预留实例 不处于活动状态或无法修改，则 **Modify 预留实例 (修改预留实例)** 处于禁用状态。

1. 修改表中的第一个条目显示选定 预留实例 的属性，而且其下方至少有一个目标配置。**Units** 列显示总实例大小占用空间。单击各个新配置的 **Add** 以添加。根据需要修改每个配置的属性。
   + **Scope (范围)**：选择配置是应用于可用区还是整个区域。
   + **Availability Zone**：选择所需的可用区。不适用于区域性预留实例。
   + **实例类型**：选择所需的实例类型。组合配置必须等于原始配置的实例大小占用空间。
   + **Count (数量)**：指定实例数。要将预留实例拆分为多个配置，请减少数量，选择 **Add (添加)**，然后为其他配置指定数量。例如，如果单个配置的数量为 10，则可以将其数量更改为 6，并添加数量为 4 的配置。此过程在激活新的预留实例后会停用原始的Reserved Instance。

1. 选择 **Continue (继续)**。

1. 指定好目标配置之后，要确认您的修改选择，请选择 **Submit modifications (提交修改)**。

1. 您可以在 预留实例 屏幕中通过查看 **State (状态)** 列来确定修改请求的状态。有以下可能状态。
   + **active (活动)*（等待修改）*** — 原始预留实例的转换状态
   + **停用*（等待修改）*** — 创建新预留实例时原始预留实例的转换状态。
   + **停用** — 已成功修改和替换预留实例
   + **活动** — 以下选项之一：
     + 从成功的修改请求创建的新预留实例
     + 修改请求失败后的原始预留实例

------
#### [ AWS CLI ]

**修改预留实例**  
使用 [modify-reserved-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-reserved-instances.html) 命令。您可以在 JSON 文件中提供配置详细信息。

```
aws ec2 modify-reserved-instances \
    --reserved-instances-ids {{b847fa93-e282-4f55-b59a-1342f5bd7c02}} \
    --target-configurations {{file://configuration.json}}
```

**获取修改请求的状态**  
使用 [describe-reserved-instances-modifications](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances-modifications.html) 命令。状态为 `processing`、`fulfilled` 或 `failed`。

```
aws ec2 describe-reserved-instances-modifications \
    --reserved-instances-modification-ids {{rimod-d3ed4335-b1d3-4de6-ab31-0f13aaf46687}} \
    --query ReservedInstancesModifications[].Status
```

------
#### [ PowerShell ]

**修改预留实例**  
使用 [Edit-EC2ReservedInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2ReservedInstance.html) cmdlet。您可以在类型为 `Amazon.EC2.Model.ReservedInstancesConfiguration` 的对象中提供配置详细信息。

```
Edit-EC2ReservedInstance `
    -ReservedInstancesId {{b847fa93-e282-4f55-b59a-1342f5bd7c02}} `
    -TargetConfiguration $configuration
```

**获取修改请求的状态**  
使用 [Get-EC2ReservedInstancesModification](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstancesModification.html) cmdlet。状态为 `processing`、`fulfilled` 或 `failed`。

```
Get-EC2ReservedInstancesModification `
    -ReservedInstancesModificationId {{rimod-d3ed4335-b1d3-4de6-ab31-0f13aaf46687}} | `
    Select Status
```

------

## 修改请求故障排除
<a name="ri-modification-process-messages"></a>

如果您请求的目标配置设置是唯一的，则您会收到正在处理该请求的消息。此时，Amazon EC2 仅确定了修改请求的参数有效。在处理过程中，您的修改请求仍然可能因无可用容量而失败。

在某些情况下，您可能会收到一个指示修改请求未完成或失败的消息而不是确认。使用此类消息中的信息作为重新提交另一个更改请求的起点。提交请求前，请确保您已阅读适用的[限制](#ri-modification-limits)。

**并非所有选择的预留实例都可以进行修改处理**  
Amazon EC2 会确定并列出无法修改的 预留实例。如果收到与此类似的消息，请转到 Amazon EC2 控制台中的 **Reserved Instances (预留实例)** 页面，查看 预留实例 的信息。

**处理修改请求时出错**  
您提交了一个或多个预留实例进行修改，但无法处理您的任何请求。根据您修改的预留数量，您可以获取不同版本的消息。

Amazon EC2 会显示无法处理请求的原因。举例来说，您可能已经为想要修改的 预留实例 的一个或更多子集指定了相同的目标配置（可用区和平台的组合）。尝试重新提交修改请求，但确保预留的实例详细信息是匹配的，并确保修改的所有子集的目标配置是唯一的。
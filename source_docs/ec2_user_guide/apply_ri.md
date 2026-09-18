

# 如何应用预留实例折扣
<a name="apply_ri"></a>

预留实例不是物理实例，而是对账户中正在运行的按需型实例所应用的账单折扣。按需型实例必须与预留实例的特定规格匹配，才能享受账单折扣。

如果您购买了预留实例并且已经有正在运行的按需型实例与预留实例的规范匹配，则账单折扣将立即自动应用。您不必重启您的实例。若没有符合条件的正在运行的按需型实例，则请启动与您的预留实例具有相同规格的按需型实例。有关更多信息，请参阅 [使用您的预留实例](using-reserved-instances.md)。

预留实例的优惠类别（标准或可转换）不会影响账单折扣的应用方式。

**Topics**
+ [如何应用可用区预留实例](#apply-zonal-ri)
+ [如何应用区域性预留实例](#apply-regional-ri)
+ [实例大小灵活性](#ri-instance-size-flexibility)
+ [应用预留实例的示例](#ri-usage-examples)

## 如何应用可用区预留实例
<a name="apply-zonal-ri"></a>

为特定可用区中的预留容量而购买的预留实例称为地区性预留实例。
+ 预留实例折扣适用于该可用区中匹配的实例使用。
+ 正在运行的实例的属性（租赁、平台、可用区、实例系列和实例大小）必须与预留实例的属性匹配。

例如，如果购买可用区 us-east-1a 中的两个 `c4.xlarge` 默认租期 Linux/Unix 标准预留实例，则可用区 us-east-1a 中最多两个正在运行的 `c4.xlarge` 默认租赁 Linux/Unix 实例可享受预留实例折扣。

## 如何应用区域性预留实例
<a name="apply-regional-ri"></a>

为区域购买的预留实例称为区域性预留实例，可提供可用区和实例大小的灵活性。
+ Reserved Instance 折扣适用于该区域的任何可用区中的实例使用。
+ 预留实例折扣适用于实例系列中的实例使用，无论实例大小如何，这称为[实例大小灵活性](#ri-instance-size-flexibility)。

## 实例大小灵活性
<a name="ri-instance-size-flexibility"></a>

凭借实例大小的灵活性，预留实例折扣适用于对同一[系列](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html)实例的使用量。预留实例基于标准化因子应用于实例系列中各种规模的实例（从最小到最大）。有关如何应用预留实例折扣的示例，请参阅 [场景 2：使用标准化因素在单个账户中使用预留实例](#ri-usage-ex2)。

### 限制
<a name="ri-instance-size-flexibility-limitations"></a>
+ **支持：**仅区域性预留实例支持实例大小灵活性。
+ **不支持：**以下预留实例*不支持*实例大小灵活性：
  + 针对特定可用区购买的 预留实例（可用区 预留实例）
  + G4ad、G4dn、G5、G5g、G6、G6e、G6f、Gr6、Gr6f、hpc7a、P5、Inf1、Inf2、u7i-6tb 和 u7i-8tb 实例的预留实例
  + 适用于 Windows Server、装有 SQL Standard 的 Windows Server、装有 SQL Server Enterprise 的 Windows Server、装有 SQL Server Web 的 Windows Server、RHEL 和 SUSE Linux Enterprise Server 的 预留实例
  + 使用专用租赁的预留实例

### 实例大小灵活性由标准化因子决定
<a name="ri-normalization-factor"></a>

实例大小灵活性取决于实例大小的标准化因子。根据预留的实例大小，区域中的任何可用区中的相同实例系列的运行实例将享受全部或部分折扣。必须匹配的属性仅为实例系列、租期和平台。

下表列出了实例系列中的各种大小以及相应的标准化因子。这种比例用于将 预留实例 的折扣费率应用于实例系列的标准化使用。


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

例如，`t2.medium` 实例具有标准化因子 2。如果您在美国东部（弗吉尼亚州北部） 中购买了 `t2.medium` 默认租期 Amazon Linux/Unix Reserved Instance，并且您的账户在该区域中有两个正在运行的 `t2.small` 实例，则账单优势应用于全部两个实例。

![应用区域性预留实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ri-instance-flex-full.png)


或者，如果您的账户在 美国东部（弗吉尼亚州北部） 区域有一个 `t2.large` 实例，则账单优势应用到 50% 的实例使用。

![应用区域性预留实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ri-instance-flex-partial.png)


在修改预留实例时，标准化因子也适用。有关更多信息，请参阅[修改 预留实例](ri-modifying.md)。

#### 裸机实例的标准化因子
<a name="ri-normalization-factor-bare-metal"></a>

实例大小灵活性也适用于实例系列中的裸机实例。如果您具有区域性 Amazon Linux/Unix 预留实例 并对裸机实例使用共享租期，则可以获得在相同实例系列中节省 Reserved Instance 的好处。反过来也是如此：如果您具有区域性 Amazon Linux/Unix 预留实例 并对与裸机实例相同的系列中的实例使用共享租期，则可以获得在裸机实例中节省 Reserved Instance 的好处。

`metal` 实例大小的标准化因子不是单一的。裸机实例的标准化因子与同一实例系列中的等效虚拟化实例大小相同。例如，`i3.metal` 实例与 `i3.16xlarge` 实例具有相同的标准化因子。


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

例如，`i3.metal` 实例的标准化因子为 128。如果您购买美国东部（弗吉尼亚州北部） 中的 `i3.metal` 默认租期 Amazon Linux/Unix Reserved Instance，则可以获得如下的账单优惠：
+ 如果您在该区域的账户中有一个正在运行的 `i3.16xlarge`，则账单优惠全部应用于 `i3.16xlarge` 实例（`i3.16xlarge` 标准化因子 = 128）。
+ 或者，如果您在该区域的账户中有两个正在运行的 `i3.8xlarge` 实例，则账单优惠全部应用于这两个 `i3.8xlarge` 实例（`i3.8xlarge` 标准化因子 = 64）。
+ 或者，如果您在该区域的账户中有四个正在运行的 `i3.4xlarge` 实例，则账单优惠全部应用于所有四个 `i3.4xlarge` 实例（`i3.4xlarge` 标准化因子 = 32）。

反之亦然。例如，如果您购买美国东部（弗吉尼亚州北部） 中的两个 `i3.8xlarge` 默认租期 Amazon Linux/Unix 预留实例，并且您在该区域中有一个正在运行的 `i3.metal` 实例，则账单优惠全部应用于 `i3.metal` 实例。

## 应用预留实例的示例
<a name="ri-usage-examples"></a>

**Topics**
+ [方案 1：单个账户中的预留实例](#ri-usage-ex1)
+ [场景 2：使用标准化因素在单个账户中使用预留实例](#ri-usage-ex2)
+ [场景 3：关联账户中的区域性预留实例](#ri-usage-ex3)
+ [场景 4：关联账户中的可用区预留实例](#ri-usage-ex4)

### 方案 1：单个账户中的预留实例
<a name="ri-usage-ex1"></a>

您在账户 A 中运行以下按需型实例：
+ 4 x `m3.large` Linux，可用区 us-east-1a 中的默认租期实例
+ 2 x `m4.xlarge` Amazon Linux，可用区 us-east-1b 中的默认租期实例
+ 1 x `c4.xlarge` Amazon Linux，可用区 us-east-1c 中的默认租期实例

您在账户 A 中购买以下预留实例：
+ 4 x `m3.large`，可用区 us-east-1a 中的默认租期 预留实例（容量为预留）
+ 4 x `m4.large` Amazon Linux，区域 us-east-1 中的默认租期 预留实例
+ 1 x `c4.large` Amazon Linux，区域 us-east-1 中的默认租期 预留实例

Reserved Instance优惠以下面方式应用：
+ 四个 `m3.large` 地区性 预留实例 的折扣和容量预留将由四个 `m3.large` 实例使用，因为它们之间的属性（实例大小、区域、平台、租期）相匹配。
+ `m4.large` 区域性 预留实例 具备可用区和实例大小灵活性，因为它们是带默认租期的区域性 Amazon Linux 预留实例。

  `m4.large` 等效于 4 个标准化单位/小时。

  您已购买四个 `m4.large` 区域性 预留实例，它们加起来等效于 16 个标准化单位/小时 (4x4)。账户 A 具有两个正在运行的 `m4.xlarge` 实例，等效于 16 个标准化单位/小时 (2x8)。这种情况下，四个 `m4.large` 区域性预留实例可享受使用两个 `m4.xlarge` 实例的全部成本优势。
+ us-east-1 中的 `c4.large` 区域 Reserved Instance 提供了可用区和实例大小灵活性，因为它是带默认租期的区域 Amazon Linux Reserved Instance，并且将应用于 `c4.xlarge` 实例。`c4.large` 实例等效于 4 个标准化单位/小时，`c4.xlarge` 等效于 8 个标准化单位/小时。

  在这种情况下，`c4.large` 区域 Reserved Instance 提供了针对 `c4.xlarge` 用量的部分优势。这是因为 `c4.large` Reserved Instance 等效于 4 个标准化单位/小时的用量，而 `c4.xlarge` 实例需要 8 个标准化单位/小时。因此，`c4.large` Reserved Instance 账单折扣应用于 50% 的 `c4.xlarge` 用量。剩余的 `c4.xlarge` 用量按照按需费率收费。

### 场景 2：使用标准化因素在单个账户中使用预留实例
<a name="ri-usage-ex2"></a>

您在账户 A 中运行以下按需型实例：
+ 2 x `m3.xlarge` Amazon Linux，可用区 us-east-1a 中的默认租期实例
+ 2 x `m3.large` Amazon Linux，可用区 us-east-1b 中的默认租期实例

您在账户 A 中购买以下预留实例：
+ 1 x `m3.2xlarge` Amazon Linux，区域 us-east-1 中的默认租期预留实例

Reserved Instance优惠以下面方式应用：
+ us-east-1 中的 `m3.2xlarge` 区域预留实例提供了可用区和实例大小灵活性，因为它是带默认租期的区域 Amazon Linux 预留实例。它首先适用于 `m3.large` 实例，然后适用于 `m3.xlarge` 实例，因为它根据标准化因子应用于实例系列中从最小到最大的实例大小。

  `m3.large` 实例等效于 4 个标准化单位/小时。

  `m3.xlarge` 实例等效于 8 个标准化单位/小时。

  `m3.2xlarge` 实例等效于 16 个标准化单位/小时。

  该益处应用如下：

  `m3.2xlarge` 区域性预留实例为 2 x `m3.large` 使用提供充分的益处，因为这些实例加起来占 8 个标准化单位/小时。这会使 8 个标准化单位/小时适用于 `m3.xlarge` 实例。

  对于剩余 8 个标准化单位/小时，`m3.2xlarge` 区域性预留实例为 1 x `m3.xlarge` 使用提供充分益处，因为每个 `m3.xlarge` 实例等效于 8 个标准化单位/小时。剩余的 `m3.xlarge` 用量按照按需费率收费。

### 场景 3：关联账户中的区域性预留实例
<a name="ri-usage-ex3"></a>

预留实例首先供购买它们的账户使用，然后供组织中符合条件的任何其他账户使用。有关更多信息，请参阅[预留实例和整合账单](concepts-reserved-instances-application.md#concepts-reserved-instances-billing)。对于具备大小灵活性的区域性预留实例，这种优势适用于实例系列中各种规模的实例 (从最小到最大)。

您在账户 A (购买账户) 中运行以下按需型实例：
+ 2 x `m4.xlarge` Linux，可用区 us-east-1a 中的默认租期实例
+ 1 x `m4.2xlarge` Linux，可用区 us-east-1b 中的默认租期实例
+ 2 x `c4.xlarge` Linux，可用区 us-east-1a 中的默认租期实例
+ 1 x `c4.2xlarge` Linux，可用区 us-east-1b 中的默认租期实例

另一个客户在账户 B（链接账户）中运行以下 按需型实例：
+ 2 x `m4.xlarge` Linux，可用区 us-east-1a 中的默认租期实例

您在账户 A 中购买以下区域性预留实例：
+ 4 x `m4.xlarge` Linux，区域 us-east-1 中的默认租期 预留实例
+ 2 x `c4.xlarge` Linux，区域 us-east-1 中的默认租期 预留实例

区域Reserved Instance优惠以下面方式应用：
+ 四个 `m4.xlarge` 预留实例 的折扣将由两个 `m4.xlarge` 实例和账户 A（购买账户）中的单个 `m4.2xlarge` 实例使用。所有三个实例均与这些属性相匹配（实例系列、区域、平台和租期）。折扣将首先应用于购买账户（账户 A）中的实例，即使账户 B（链接账户）具有两个也匹配 预留实例 的 `m4.xlarge`。由于 预留实例 是区域性 预留实例，因此没有容量预留。
+ 两个 `c4.xlarge` 预留实例 的折扣适用于两个 `c4.xlarge`，因为它们比 `c4.2xlarge` 实例小。由于 预留实例 是区域性 预留实例，因此没有容量预留。

### 场景 4：关联账户中的可用区预留实例
<a name="ri-usage-ex4"></a>

通常，某个账户拥有的预留实例首先供该账户自用。不过，如果组织的其他账户中有适用于特定可用区、符合条件的未使用 预留实例（地区性 预留实例），这些实例将先于账户拥有的区域性 预留实例 应用于账户。这样做是为了确保实现最大Reserved Instance使用率和较低的费用。出于记账目的，组织中的所有账户将被视为一个账户。以下示例可能有助于您理解。

您在账户 A (购买账户) 中运行以下个按需型实例：
+ 1 x `m4.xlarge` Linux，可用区 us-east-1a 中的默认租期实例

某个客户在关联账户 B 中运行了以下个按需型实例：
+ 1 x `m4.xlarge` Linux，可用区 us-east-1b 中的默认租期实例

您在账户 A 中购买以下区域性预留实例：
+ 1 x `m4.xlarge` Linux，区域 us-east-1 中的默认租期 Reserved Instance

客户还在关联账户 C 中购买了以下区预留实例：
+ 1 x `m4.xlarge` Linux，可用区 us-east-1a 中的默认租期 预留实例

Reserved Instance优惠以下面方式应用：
+ 账户 C 拥有的 `m4.xlarge` 地区性 Reserved Instance 的折扣应用于账户 A 中的 `m4.xlarge` 用量。
+ 账户 A 拥有的 `m4.xlarge` 区域性 Reserved Instance 的折扣应用于账户 B 中的 `m4.xlarge` 用量。
+ 如果账户 A 拥有的区域性 Reserved Instance 先应用于账户 A 中的用量，则账户 C 拥有的地区性 Reserved Instance 将保持未使用状态，而账户 B 中的用量将按照按需费率收费。

有关更多信息，请参阅 AWS 成本和使用情况报告中的 [Understanding your reservations](https://docs.aws.amazon.com/cur/latest/userguide/understanding-ri.html)。

**注意**  
区域预留实例仅为所属账户预留容量，不能与其他 AWS 账户 账户共享。如果您需要与其他 AWS 账户 共享容量，请使用 [使用 EC2 按需容量预留来预留计算容量](ec2-capacity-reservations.md)。
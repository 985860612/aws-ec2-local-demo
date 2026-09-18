

# Amazon EC2 的预留实例概览
<a name="ec2-reserved-instances"></a>

**重要**  
我们建议使用节省计划，而不是预留实例。节省计划是节省 AWS 计算成本的最简单、最灵活方式，与预留实例一样，提供更低的价格（相比按需定价最高可省 72%）。但是，节省计划与预留实例不同。使用预留实例时，您将承诺使用特定的实例配置，而使用节省计划时，您可以灵活地使用最能满足您需求的实例配置。使用节省计划时，您将承诺保持一致的使用量（以美元/小时为单位）。有关更多信息，请参阅 [AWS Savings Plans 用户指南](https://docs.aws.amazon.com/savingsplans/latest/userguide/)。

相比按需型实例定价，预留实例可大幅节约您的 Amazon EC2 成本。预留实例不是物理实例，而是对账户中使用的按需型实例所应用的账单折扣。这些按需型实例必须与特定属性（例如实例类型和区域）匹配，才能享受账单折扣。

**Topics**
+ [预留实例示例场景](#ri-example-scenario)
+ [决定Reserved Instance定价的关键变量](#ri-key-pricing-variables)
+ [区域和可用区预留实例（范围）](reserved-instances-scope.md)
+ [预留实例的类型（提供的类别）](reserved-instances-types.md)
+ [如何应用预留实例折扣](apply_ri.md)
+ [使用您的预留实例](using-reserved-instances.md)
+ [预留实例的计费方式](concepts-reserved-instances-application.md)
+ [购买 Amazon EC2 的预留实例](ri-market-concepts-buying.md)
+ [在预留实例市场中销售 Amazon EC2 的预留实例](ri-market-general.md)
+ [修改 预留实例](ri-modifying.md)
+ [交换 可转换预留实例](ri-convertible-exchange.md)
+ [预留实例 ID](ri-limits.md)

## 预留实例示例场景
<a name="ri-example-scenario"></a>

下图是购买和使用预留实例的基本场景。

![购买预留实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ri-basics.png)


在此场景中，您的账户中有一个正在运行的个按需型实例 (T2)，当前您按照按需费率支付。您购买了一个与您正在运行的实例的属性相匹配的Reserved Instance，账单优势立即体现。接下来，您为 C4 实例购买一个Reserved Instance。您的账户中没有任何正在运行的实例与此Reserved Instance的属性相匹配。在最后的步骤中，您启动了一个与 C4 Reserved Instance的属性相匹配的实例，账单优势立即体现。

## 决定Reserved Instance定价的关键变量
<a name="ri-key-pricing-variables"></a>

Reserved Instance 定价由以下关键变量决定。

### 实例属性
<a name="ri-pricing-variable-instance-attributes"></a>

预留实例有四个决定其价格的实例属性。
+ **实例类型**：例如，`m4.large`。这由实例系列（例如，`m4`）和实例大小（例如，`large`）组成。
+ **区域**：购买Reserved Instance的区域。
+ **租赁**：您的实例在共享 (默认) 还是单租户 (专用) 硬件上运行。有关更多信息，请参阅[Amazon EC2 专用实例](dedicated-instance.md)。
+ **平台**：操作系统；例如，Windows 或 Linux/Unix。有关更多信息，请参阅[选择平台](ri-market-concepts-buying.md#ri-choosing-platform)。

### 期限承诺
<a name="ri-pricing-variable-term-commitment"></a>

您可以承诺购买一年或三年的 Reserved Instance，三年承诺可以获得更大的折扣。
+ **一年**：一年定义为 31536000 秒（365 天）。
+ **三年**：三年定义为 94608000 秒 (1095 天)。

预留实例不会自动续订；当它们过期时，可以继续使用 EC2 实例而不会中断，但要支付按需费率。在上面的示例中，当涵盖 T2 和 C4 实例的 预留实例 过期后，将改为以按需费率支付，直至终止这些实例或者购买与实例属性相匹配的新 预留实例。

**重要**  
购买Reserved Instance后，您将不能取消您的购买。但是，如果您需要更改，则可以[修改](ri-modifying.md)、[交换](ri-convertible-exchange.md)或[出售](ri-market-general.md)您的 Reserved Instance。

### 付款选项
<a name="ri-payment-options"></a>

针对 预留实例 可使用以下付款选项：
+ **预付全费**：所有款项于期限开始时支付，无论使用了多少小时数，剩余期限不会再产生其他任何费用或额外按小时计算的费用。
+ **预付部分费用**：必须预付部分费用，无论是否使用了 Reserved Instance，期限内剩余的小时数都将按照打折小时费率计费。
+ **无预付费用**：无论是否使用 Reserved Instance，您都将按照期限内的小时数，采用打折小时费率进行付费。无需预付款。
**注意**  
在整个预留期限内，“无预付费用”预留实例需要根据合同义务每月支付费用。因此，账户需要具有成功的账单历史记录才能购买“无预付”预留实例。

一般而言，通过为 预留实例 支付选较高的预付款，可以节省更多成本。您也可以在预留实例 Marketplace 中找到由第三方卖家以短期低价提供的预留实例。有关更多信息，请参阅[在预留实例市场中销售 Amazon EC2 的预留实例](ri-market-general.md)。

### 优惠类别
<a name="ri-pricing-variable-offering-class"></a>

在计算需求发生变化时，您可以根据产品类别修改或交换 Reserved Instance。
+ **标准**：这些提供最大力度的折扣，但只可以修改。标准 预留实例 无法交换。
+ **可转换**：这些相较于标准 预留实例 提供较低的折扣，但可以与具有不同实例属性的可转换 Reserved Instance 进行交换。可转换 预留实例 也可修改。

有关更多信息，请参阅[预留实例的类型（提供的类别）](reserved-instances-types.md)。

**重要**  
购买Reserved Instance后，您将不能取消您的购买。但是，如果您需要更改，则可以[修改](ri-modifying.md)、[交换](ri-convertible-exchange.md)或[出售](ri-market-general.md)您的 Reserved Instance。

有关更多信息，请参阅[“Amazon EC2 预留实例定价”页面](https://aws.amazon.com/ec2/pricing/reserved-instances/pricing/)。
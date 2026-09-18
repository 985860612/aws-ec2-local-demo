

# 区域和可用区预留实例（范围）
<a name="reserved-instances-scope"></a>

当您购买 Reserved Instance 时，可决定 Reserved Instance 的范围。范围可以是区域或可用区。
+ **区域**：当您购买某个区域的 Reserved Instance，该实例称为*区域性* Reserved Instance。
+ **可用区**：当您购买特定可用区的 Reserved Instance 时，该实例称为*可用区* Reserved Instance。

范围不影响价格。您为区域或可用区 Reserved Instance 支付相同的价格。有关 Reserved Instance 定价的更多信息，请参阅[决定Reserved Instance定价的关键变量](ec2-reserved-instances.md#ri-key-pricing-variables)和[Amazon EC2 预留实例定价](https://aws.amazon.com/ec2/pricing/reserved-instances/pricing/)。

有关如何指定预留实例范围的更多信息，请参阅 [RI 属性](https://aws.amazon.com/ec2/pricing/reserved-instances/#riattributes)，特别是**可用区**小点。

## 区域性或可用区预留实例之间的差异
<a name="reserved-instances-regional-zonal-differences"></a>

下表重点介绍了区域性 预留实例 和可用区 预留实例 之间的一些主要区别：


|  | 区域性预留实例 | 可用区预留实例 | 
| --- | --- | --- | 
| 是否能够预留容量 | 区域性Reserved Instance*无法*预留容量。 | 可用区Reserved Instance可在指定可用区中预留容量。 | 
| 可用区灵活性 | Reserved Instance 折扣适用于指定区域的任何可用区中的实例使用。 | 无可用区灵活性 — Reserved Instance 折扣仅适用于指定可用区中的实例使用。 | 
| 实例大小灵活性 | Reserved Instance 折扣适用于实例系列中的实例使用，无论实例大小如何。<br />只在具有默认租期的 Amazon Linux/Unix 预留实例 上受支持。有关更多信息，请参阅 [实例大小灵活性由标准化因子决定](apply_ri.md#ri-normalization-factor)。 | 无实例大小灵活性，预留实例折扣仅适用于指定实例系列和实例大小的实例使用。 | 
| 排队购买 | 您可以排队购买区域预留实例。 | 您不能将可用区预留实例的购买排队。 | 

有关更多信息以及示例，请参阅 [如何应用预留实例折扣](apply_ri.md)。
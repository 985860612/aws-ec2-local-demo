

# Amazon EC2 专属主机定价和账单
<a name="dedicated-hosts-billing"></a>

专属主机的价格因付款选项而异。

**Topics**
+ [按需专属主机](#on-demand-dedicated-hosts)
+ [Dedicated Host Reservations](#dedicated-host-reservations)
+ [Savings Plans](#dedicated-hosts-savings-plans)
+ [专属主机上的 Windows Server 定价](#dh-win-billing)

## 按需专属主机
<a name="on-demand-dedicated-hosts"></a>



按需计费在您将专属主机分配到您的账户时自动激活。

专属主机的按需价格因实例系列和区域而异。您需要为处于活动状态的专属主机按每秒支付费用（至少 60 秒），无论您选择在专属主机上启动的实例的数量或大小如何。有关按需定价的更多信息，请参阅 [Amazon EC2 专属主机按需定价](https://aws.amazon.com/ec2/dedicated-hosts/pricing/#on-demand)。



您可以随时释放按需专属主机以停止产生费用。有关释放专属主机的信息，请参阅[释放 Amazon EC2 专属主机](dedicated-hosts-releasing.md)。

## Dedicated Host Reservations
<a name="dedicated-host-reservations"></a>

与运行按需专属主机相比，专属主机预留可提供账单折扣。预留提供三种付款选项：
+ **无预付费用**：无预付费用预留为某个期限内的专属主机使用提供折扣，并且不需要预付款。可以选择一年或三年期限。只有一些实例系列支持三年期无预付预留。
+ **预付部分费用** — 必须支付一部分预留费用，期限内的剩余时间享受折扣。可以选择一年或三年期限。
+ **预付全费** — 提供最低的有效价格。提供一年和三年期限，覆盖整个前期费用，无需额外将来付费。

账户中必须有活动的专属主机才能购买预留。每个预留可以涵盖在单个可用区中支持同一实例系列的一个或多个主机。预留应用于主机上的实例系列，而不是实例大小。如果有三个不同实例大小的专属主机（`m4.xlarge`、`m4.medium` 和 `m4.large`），则可以将一个 `m4` 预留与所有这些专属主机关联。预留的实例系列和可用区必须与您希望与之关联的专属主机的实例系列和可用区相匹配。

当预留与专属主机关联后，将无法释放专属主机，直到预留期限结束。

有关预留定价的更多信息，请参阅 [Amazon EC2 专属主机定价](https://aws.amazon.com/ec2/dedicated-hosts/pricing/#reservations)。

## Savings Plans
<a name="dedicated-hosts-savings-plans"></a>

Savings Plans 是通过按需型实例提供大幅优惠的灵活定价模式。在使用 Savings Plans 时，您承诺在一年或三年期限内保持一致的使用量（以美元/小时为单位）。这使您能够灵活地使用最能满足您的需求的专属主机，并继续节省费用，而不必对特定专属主机做出承诺。有关更多信息，请参阅 [AWS Savings Plans 用户指南](https://docs.aws.amazon.com/savingsplans/latest/userguide/)。

**注意**  
Savings Plans 不支持 `u-6tb1.metal`、`u-9tb1.metal`、`u-12tb1.metal`、`u-18tb1.metal`、和 `u-24tb1.metal` 专属主机。

## 专属主机上的 Windows Server 定价
<a name="dh-win-billing"></a>

根据 Microsoft 的许可条款，您可以将现有的 Windows Server 和 SQL Server 许可证用于专属主机。如果选择使用自己的许可证，则不会收取额外的软件使用费用。

此外，您还可以使用 Amazon 提供的 Windows Server AMI，在专属主机上运行最新版本的 Windows Server。对于拥有现有的可在专属主机上运行的 SQL Server 许可证但需要 Windows Server 运行 SQL Server 工作负载的情况，这是很常见的。仅在最新一代的实例类型上支持 Amazon 提供的 Windows Server AMI。有关更多信息，请参阅 [Amazon EC2 专属主机定价](https://aws.amazon.com/ec2/dedicated-hosts/pricing/#windows-dh)。
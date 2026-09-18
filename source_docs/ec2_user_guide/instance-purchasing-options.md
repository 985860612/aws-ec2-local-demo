

# Amazon EC2 账单和购买选项
<a name="instance-purchasing-options"></a>

您可以使用以下选项优化 Amazon EC2 的成本：
+ **[按需型实例](ec2-on-demand-instances.md)**：按秒为启动的实例付费。
+ **[节省计划](https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html)**：通过承诺在 1 年或 3 年期限内保持一致的使用量（以美元/小时为单位）来降低您的 Amazon EC2 成本。
+ **[预留实例](ec2-reserved-instances.md)**：通过承诺在 1 年或 3 年期限内提供一致的实例配置（包括实例类型和区域）来降低您的 Amazon EC2 成本。
+ **[竞价型实例](using-spot-instances.md)**：请求未使用的 EC2 实例，这可能会显著降低您的 Amazon EC2 成本。
+ **[专属主机](dedicated-hosts-overview.md)**：为完全专用于运行您的实例的物理主机付费，让您现有的按插槽、按内核或按 VM 计费的软件许可证降低成本。
+ **[专用实例](dedicated-instance.md)**：为在单一租户硬件上运行的实例按小时付费。
+ **[容量预留](capacity-reservation-overview.md)** – 可在特定可用区中为 EC2 实例预留容量。

如果您无法承诺使用特定的实例配置，但可以承诺保证一定的使用量，请购买节省计划，降低按需型实例的成本。如果您需要预留容量，请为特定可用区购买预留实例或预留容量。可使用容量块预留 GPU 实例集群。如果能灵活控制应用程序的运行时间并且您的应用程序可以中断，竞价型实例就是经济实惠之选。专用主机或专用实例可以通过使用现有服务器端绑定软件许可证来满足合规性要求和降低成本。

有关更多信息，请参阅 [Amazon EC2 定价](https://aws.amazon.com/ec2/pricing/)和 [Amazon EC2 托管式实例](amazon-ec2-managed-instances.md)。
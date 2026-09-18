

# 弹性 IP 地址
<a name="elastic-ip-addresses-eip"></a>

*弹性 IP 地址* 是专为动态云计算设计的静态 IPv4 地址。弹性 IP 地址会分配给您的 AWS 账户，并且在您释放它之前一直属于您。使用弹性 IP 地址，您可以快速将地址重新映射到您的账户中的另一个实例，从而屏蔽实例故障。或者，您可以在域的 DNS 记录中指定弹性 IP 地址，以使域指向您的实例。有关更多信息，请参阅您的域注册商的文档。

弹性 IP 地址是公有 IPv4 地址，可通过 Internet 访问。如果需要连接到没有公有 IPv4 地址的实例，则可以将弹性 IP 地址与实例关联以实现与互联网的通信。

**Topics**
+ [弹性 IP 地址定价](#eip-pricing)
+ [弹性 IP 地址基本信息](#eip-basics)
+ [弹性 IP 地址配额](#using-instance-addressing-limit)
+ [将弹性 IP 地址与实例关联](working-with-eips.md)
+ [在 AWS 账户之间转移弹性 IP 地址](transfer-EIPs-intro-ec2.md)
+ [释放弹性 IP 地址](using-instance-addressing-eips-releasing.md)
+ [在 Amazon EC2 上为电子邮件创建反向 DNS 记录](Using_Elastic_Addressing_Reverse_DNS.md)

## 弹性 IP 地址定价
<a name="eip-pricing"></a>

所有正在使用（已分配给 EC2 实例等资源）和闲置（已在您的账户中创建但未分配）的弹性 IP 地址都会产生费用。

AWS 将对所有公有 IPv4 地址收费，包括与运行的实例相关联的公有 IPv4 地址和弹性 IP 地址。有关更多信息，请参阅 [Amazon VPC 定价页面](https://aws.amazon.com/vpc/pricing/)中的**公有 IPv4 地址定价**选项卡。

## 弹性 IP 地址基本信息
<a name="eip-basics"></a>

下面是弹性 IP 地址的基本特征：
+ 弹性 IP 地址是静态地址，不会随着时间的推移而改变。
+ 一个弹性 IP 地址只能在一个特定区域中使用，不能移动到其他区域。
+ 弹性 IP 地址来自 Amazon 的 IPv4 地址池，或来自已引入到您的 AWS 账户的自定义 IPv4 地址池。我们不支持对 IPv6 使用弹性 IP 地址。
+ 要使用弹性 IP 地址，您应首先向您的账户分配这样一个地址，然后将其与您的实例或网络接口关联。
+ 当您将弹性 IP 地址与实例关联时，该地址也会与实例的主网络接口相关联。当您将弹性 IP 地址与连接到实例的网络接口关联时，它也与该实例关联。
+ 当您将弹性 IP 地址与实例或其主网络接口关联时，如果该实例已具有与之关联的公有 IPv4 地址，则该公有 IPv4 地址将被释放回 Amazon 的公有 IPv4 地址池，并且弹性 IP 地址将与该实例关联。您不能重用以前与实例关联的公有 IPv4 地址，也不能将该公有 IPv4 地址转换为弹性 IP 地址。有关更多信息，请参阅 [公有 IPv4 地址](using-instance-addressing.md#concepts-public-addresses)。
+ 您可以取消弹性 IP 地址与资源的关联，然后重新将此地址与其他资源关联。为避免意外行为，请确保在进行更改之前关闭到现有关联中指定资源的所有活动连接。将弹性 IP 地址关联到其他资源后，可以重新打开与新关联的资源的连接。
+ 取消关联的弹性 IP 地址保持分配到您的账户，直至您明确释放它。您需要为账户中的所有弹性 IP 地址付费，无论这些地址是否与实例关联。有关更多信息，请参阅 [Amazon VPC 定价页面](https://aws.amazon.com/vpc/pricing/)中的**公有 IPv4 地址定价**选项卡。
+ 在将弹性 IP 地址与之前具有公有 IPv4 地址的实例关联时，该实例的公有 DNS 主机名将发生更改以匹配弹性 IP 地址。
+ 我们会将公有 DNS 主机名解析为实例所在网络外部的该实例的公有 IPv4 地址或弹性 IP 地址，以及实例所在网络内部的该实例的私有 IPv4 地址。
+ 从已引入到您 AWS 账户的 IP 地址池分配弹性 IP 地址时，该地址不会计入弹性 IP 地址限制。有关更多信息，请参阅[弹性 IP 地址配额](#using-instance-addressing-limit)。
+ 分配弹性 IP 地址时，您可以将弹性 IP 地址与网络边界组关联。这是我们公告 CIDR 块的位置。设置网络边界组会将 CIDR 块限制到此组。如果您未指定网络边界组，我们将设置包含区域中所有可用区的边界组（例如，`us-west-2`）。
+ 弹性 IP 地址仅用于特定网络边界组。

## 弹性 IP 地址配额
<a name="using-instance-addressing-limit"></a>

默认情况下，所有 AWS 账户在每个区域的限额为五（5）个弹性 IP 地址，因为公有（IPv4）互联网地址是稀缺的公有资源。我们强烈建议您使用弹性 IP 地址，主要是为了在实例出现故障的情况下能够将该地址映射到另一实例，同时能够将 [DNS 主机名](https://docs.aws.amazon.com/vpc/latest/userguide/AmazonDNS-concepts.html#vpc-dns-hostnames)用于所有其他节点间通信。

如果您认为您的架构需要额外的弹性 IP 地址，则可直接从 Service Quotas 控制台请求提高配额。要请求增加限额，请选择**请求增加账户限额**。有关更多信息，请参阅 [Amazon EC2 Service Quotas](ec2-resource-limits.md)。
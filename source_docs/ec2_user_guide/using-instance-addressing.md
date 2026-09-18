

# Amazon EC2 实例 IP 寻址
<a name="using-instance-addressing"></a>

Amazon EC2 和 Amazon VPC 支持 IPv4 和 IPv6 寻址协议。默认情况下，Amazon VPC 使用 IPv4 寻址协议；您无法禁用此行为。创建 VPC 时，您必须指定 IPv4 CIDR 块 (一系列私有 IPv4 地址)。您可以选择将 IPv6 CIDR 块分配给您的 VPC，并将来自该块的 IPv6 地址分配给您子网中的实例。

启动 EC2 实例时，您需要指定 VPC 和子网。实例会从子网的 CIDR 范围接收私有 IPv4 地址。您可以选择使用公有 IPv4 地址和 IPv6 地址配置实例。如果不同 VPC 中的 EC2 实例使用公有 IP 地址通信，则流量将保留在 AWS 私有全球网络中，不会遍历公共互联网。

**Topics**
+ [私有 IPv4 地址](#concepts-private-addresses)
+ [公有 IPv4 地址](#concepts-public-addresses)
+ [公有 IPv4 地址优化](#concepts-public-ip-address-opt)
+ [IPv6 地址](#ipv6-addressing)
+ [多个 IP 地址](#multiple-ip-addresses)
+ [EC2 实例主机名](#amazon-dns)
+ [链路本地地址](#link-local-addresses)
+ [管理 EC2 实例的 IPv4 地址](working-with-ip-addresses.md)
+ [管理 EC2 实例的 IPv6 地址](working-with-ipv6-addresses.md)
+ [EC2 实例的辅助 IP 地址](instance-secondary-ip-addresses.md)
+ [为 Windows 实例配置辅助私有 IPv4 地址](config-windows-multiple-ip.md)

## 私有 IPv4 地址
<a name="concepts-private-addresses"></a>

私有 IPv4 地址是指无法通过 Internet 访问的 IP 地址。您可以使用私有 IPv4 地址在同一 VPC 中实现实例之间的通信。有关私有 IPv4 地址标准和规范的更多信息，请参阅 [RFC 1918](http://www.faqs.org/rfcs/rfc1918.html)。我们会使用 DHCP 将私有 IPv4 地址分配到实例。

**注意**  
您可以创建一个具有公共可路由的 CIDR 块 (不在 RFC 1918 中指定的私有 IPv4 地址范围内) 的 VPC。但是，出于本文档的写作目的，我们的私有 IPv4 地址(或“私有 IP 地址”)指的是位于 VPC 的 IPv4 CIDR 范围内的 IP 地址。

VPC 子网可以是以下类型之一：
+ 仅 IPv4 子网：您只能在这些子网中创建已分配 IPv4 地址的资源。
+ 仅 IPv6 子网：您只能在这些子网中创建已分配 IPv6 地址的资源。
+ IPv4 和 IPv6 子网：您可以在这些子网中创建已分配 IPv4 或 IPv6 地址的资源。

在仅 IPv4 或双协议堆栈（IPv4 和 IPv6）子网中启动 EC2 实例时，该实例将在子网的 IPv4 地址范围内收到一个主要私有 IP 地址。有关更多信息，请参阅《Amazon VPC 用户指南》**中的 [IP 寻址](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html)。如果您在启动实例时未指定主要私有 IP 地址，我们会在子网的 IPv4 范围内为您选择一个可用的 IP 地址。每个实例都具有分配了主要私有 IPv4 地址的默认网络接口（索引 0）。您还可以指定其他私有 IPv4 地址，即*辅助私有 IPv4 地址*。与主要私有 IP 地址不同的是，辅助私有 IP 地址可以从一个实例重新分配到另一个实例。有关更多信息，请参阅 [多个 IP 地址](#multiple-ip-addresses)。

私有 IPv4 地址（无论是主地址还是辅助地址）会在实例停止和重新启动或休眠和启动时保持与网络接口的关联，并在实例终止时释放。

## 公有 IPv4 地址
<a name="concepts-public-addresses"></a>

公有 IP 地址是指可通过 Internet 访问的 IPv4 地址。您可以使用公用 地址在您的实例和 Internet 之间进行通信。

在默认 VPC 中启动实例时，默认情况下，我们会为实例分配公有 IP 地址。当您在非默认 VPC 中启动实例时，子网的一个属性会确定在该子网中启动的实例是否从公有 IPv4 地址池接收公有 IP 地址。默认情况下，我们不会将公有 IP 地址分配到非默认子网中启动的实例。

您可以按如下所示控制实例是否接收公有 IP 地址：
+ **修改子网的公有 IP 寻址属性。**有关更多信息，请参阅《*Amazon VPC 用户指南*》中的[修改子网的公有 IPv4 寻址属性](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-public-ip.html)。
+ **在启动时启用或禁用公有 IP 寻址功能。**这将覆盖子网的公有 IP 寻址属性。有关更多信息，请参阅 [在启动时分配公有 IPv4 地址](working-with-ip-addresses.md#public-ip-addresses)。
+ **启动后取消分配实例的公有 IP 地址。**有关更多信息，请参阅 [管理网络接口的 IP 地址](managing-network-interface-ip-addresses.md)。

公有 IP 地址将从 Amazon 的公有 IPv4 地址池分配给实例，不与您的 AWS 账户关联。在取消公有 IP 地址与实例的关联后，该地址即会释放回公有 IPv4 地址池中，并且您无法重新使用该地址。

在以下情况下，我们会从您的实例释放公有 IP 地址，并为其分配新地址：
+ 当该实例停止、休眠或终止后，我们会释放公有 IP 地址。当您启动已停止或休眠的实例时，我们会分配一个新的公有 IP 地址。
+ 当您将弹性 IP 地址与该实例关联时，我们会释放该公有 IP 地址。当您将弹性 IP 地址与实例取消关联时，我们会分配一个新的公有 IP 地址。
+ 如果我们释放了实例的公有 IP 地址并且其有辅助网络接口，则我们不会分配新的公有 IP 地址。
+ 如果我们释放了实例的公有 IP 地址并且其有与弹性 IP 地址关联的辅助私有 IP 地址，则我们不会分配新的公有 IP 地址。

如果您需要可根据需要关联到实例并从实例进行关联的永久公有 IP 地址，可改为使用弹性 IP 地址。

如果您使用动态 DNS 来将现有 DNS 名称映射到新实例的公有 IP 地址，可能需要 24 小时，以便 IP 地址可以传递到整个 Internet。其结果是，新的实例可能无法接收流量，而已终止实例继续接收请求。要解决此问题，请使用弹性 IP 地址。您可以分配自己的弹性 IP 地址，并将其与您的实例相关联。有关更多信息，请参阅 [弹性 IP 地址](elastic-ip-addresses-eip.md)。

如果使用的是 Amazon VPC IP 地址管理器（IPAM），则可以从 AWS 中获取连续的公有 IPv4 地址块，再用其将弹性 IP 地址分配给 AWS 资源。使用连续的 IPv4 地址块可以显著减少安全访问控制列表的管理开销，简化在 AWS 上扩展的企业的 IP 地址分配和跟踪工作。有关更多信息，请参阅《Amazon VPC IPAM User Guide》**中的 [Allocate sequential Elastic IP addresses from an IPAM pool](https://docs.aws.amazon.com/vpc/latest/ipam/tutorials-eip-pool.html)。

**注意事项**
+ AWS 将对所有公有 IPv4 地址收费，包括与运行的实例相关联的公有 IPv4 地址和弹性 IP 地址。有关更多信息，请参阅 [Amazon VPC 定价页面](https://aws.amazon.com/vpc/pricing/)中的**公有 IPv4 地址定价**选项卡。
+ 通过公有 NAT IP 地址访问其他实例的实例需要支付区域或 Internet 数据传输费用，具体取决于这些实例是否在同一区域内。

## 公有 IPv4 地址优化
<a name="concepts-public-ip-address-opt"></a>

AWS 将对所有公有 IPv4 地址收费，包括与运行的实例相关联的公有 IPv4 地址和弹性 IP 地址。有关更多信息，请参阅 [Amazon VPC 定价页面](https://aws.amazon.com/vpc/pricing/)中的**公有 IPv4 地址定价**选项卡。

以下列表包含相应的措施，您可以采取这些措施来优化所使用的公有 IPv4 地址数量：
+ 使用[弹性负载均衡器](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/load-balancer-getting-started.html)对 EC2 实例的流量进行负载均衡，以及[在分配给这些实例的主 ENI 上禁用**自动分配公有 IP**](managing-network-interface-ip-addresses.md)。负载均衡器使用单个公有 IPv4 地址，因此可减少公有 IPv4 地址数量。您可能还需要整合现有的负载均衡器，以进一步减少公有 IPv4 地址数量。
+ 如果使用 NAT 网关的唯一原因是将 SSH 连接到私有子网中的 EC2 实例以进行维护或应对紧急情况，请考虑改用 [EC2 Instance Connect Endpoint](connect-using-eice.md)。使用 EC2 Instance Connect Endpoint，您可从互联网连接到实例，而无需实例具有公有 IPv4 地址。
+ 如果您的 EC2 实例位于公有子网中并已分配公有 IP 地址，请考虑将这些实例移至私有子网，移除公有 IP 地址，然后使用[公有 NAT 网关](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)来允许访问您的 EC2 实例和从实例中访问。使用 NAT 网关需要考虑成本。使用此计算方法来确定 NAT 网关是否具有成本效益。您可以通过[创建 AWS 账单成本和使用情况报告](https://aws.amazon.com/blogs/networking-and-content-delivery/identify-and-optimize-public-ipv4-address-usage-on-aws/)来获取此计算所需的`Number of public IPv4 addresses`。

  ```
  NAT gateway per hour + NAT gateway public IPs + NAT gateway transfer / Existing public IP cost
  ```

  其中：
  + `NAT gateway per hour = $0.045 * 730 hours in a month * Number of Availability Zones the NAT gateways are in`
  + `NAT gateway public IPs = $0.005 * 730 hours in a month * Number of IPs associated with your NAT gateways`
  + `NAT gateway transfer = $0.045 * Number of GBs that will go through the NAT gateway in a month`
  + `Existing public IP cost = $0.005 * 730 hours in a month * Number of public IPv4 addresses`

  如果总计值小于 1，则 NAT 网关比公有 IPv4 地址便宜。
+ 使用 [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/userguide/endpoint-services-overview.html) 私密连接至 AWS 服务或其他 AWS 账户托管服务，而不是使用公有 IPv4 地址和互联网网关。
+ [自带 IP 地址范围（BYOIP）至 AWS](ec2-byoip.md) 并对公有 IPv4 地址使用该范围，而不是使用 Amazon 拥有的公有 IPv4 地址。
+ 关闭[公有 IPv4 地址自动分配到在子网中启动的实例](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-public-ip.html)。创建子网时，VPC 通常默认禁用此选项，但您应检查现有子网以确保其处于禁用状态。
+ 如果您的 EC2 实例不需要公有 IPv4 地址，[请检查连接到您实例的网络接口是否已禁用**自动分配公有 IP**](managing-network-interface-ip-addresses.md)。
+ 为私有子网中的 EC2 实例[在 AWS Global Accelerator 中配置加速器端点](https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints.html)，以使互联网流量无需公有 IP 地址即可直接流向 VPC 中的端点。您也可以[将自己的地址带入 AWS Global Accelerator](https://docs.aws.amazon.com/global-accelerator/latest/dg/using-byoip.html)，并使用自己的 IPv4 地址作为加速器的静态 IP 地址。

## IPv6 地址
<a name="ipv6-addressing"></a>

IPv6 地址具有全局唯一性，可以配置为保持私有或通过互联网进行访问。AWS 中提供公有和私有 IPv6 寻址：
+ **私有 IPv6**：AWS 认为私有 IPv6 地址是那些未公开发布且不能从 AWS 公开发布在互联网上的地址。
+ **公共 IPv6**：AWS 认为公共 IPv6 地址是 AWS 在互联网上已公开发布的地址。

有关公有和私有 IPv6 地址的更多信息，请参阅《Amazon VPC 用户指南》**中的 [IPv6 地址](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html#vpc-ipv6-addresses)。

除了 C1、M1、M2、M3 和 T1 实例类型，其余实例类型都支持 IPv6 地址。

如果您的 VPC 和子网关联了 IPv6 CIDR 块，并且满足以下条件之一，则您的 EC2 实例会收到 IPv6 地址：
+ 您的子网配置为在启动期间向实例自动分配 IPv6 地址。有关更多信息，请参阅[修改子网的 IP 寻址属性](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-public-ip.html)。
+ 您在启动期间为实例分配了 IPv6 地址。
+ 您在启动后为实例的主网络接口分配了 IPv6 地址。
+ 您向同一子网中的某个网络接口分配 IPv6 地址，并在启动后将此网络接口附加到您的实例。

当实例在启动期间收到 IPv6 地址时，此地址将与实例的主网络接口（索引 0）关联。您可以通过以下方式管理实例主网络接口的 IPv6 地址：
+ 从网络接口分配和取消分配 IPv6 地址。可以分配给网络接口的 IPv6 地址数量以及可以附加到实例的网络接口数量因实例类型而异。有关更多信息，请参阅 [每个网络接口的最大 IP 地址数](AvailableIpPerENI.md)。
+ 启用主 IPv6 地址。主 IPv6 地址使您能够避免中断实例或 ENI 的流量。有关更多信息，请参阅 [为 Amazon EC2 实例创建网络接口](create-network-interface.md) 或 [管理网络接口的 IP 地址](managing-network-interface-ip-addresses.md)。

IPv6 地址会在您停止和启动或休眠和启动实例时保留下来，并在您终止实例时释放出来。您无法重新分配已分配给某个网络接口的 IPv6 地址；您必须先取消分配此 IPv6 地址。

您可以通过控制子网的路由或使用安全组和网络 ACL 规则，来控制能否通过实例的 IPv6 地址对其进行访问。有关更多信息，请参阅《Amazon VPC 用户指南》**中的[互联网络流量隐私](https://docs.aws.amazon.com/IAM/latest/UserGuide/access.html)。

有关预留 IPv6 地址范围的更多信息，请参阅 [IANA IPv6 特殊用途地址注册表](http://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml)和 [RFC4291](https://tools.ietf.org/html/rfc4291)。

## 多个 IP 地址
<a name="multiple-ip-addresses"></a>

您可以为实例指定多个私有 IPv4 和 IPv6 地址。您可为实例指定的网络接口和私有 IPv4 和 IPv6 地址的数量取决于该实例的类型。有关更多信息，请参阅 [每个网络接口的最大 IP 地址数](AvailableIpPerENI.md)。

**使用案例**
+ 在单个服务器上使用多个 SSL 证书，并为每个证书关联一个指定的 IP 地址，以在单个服务器上托管多个网站。
+ 操作每个网络接口有多个 IP 地址的网络应用，如防火墙或负载均衡器。
+ 当实例发生故障时，可将内部流量重定向到备用实例，方法是为备用实例重新分配辅助 IP 地址。

**多个 IP 地址的工作方式**
+ 您可以为任何网络接口分配辅助私有 IPv4 地址。
+ 您可以将多个 IPv6 地址分配给拥有关联 IPv6 CIDR 块的子网中的网络接口。
+ 您必须从子网的 IPv4 CIDR 块范围内为网络接口选择辅助 IPv4 地址。
+ 您必须从子网的 IPv6 CIDR 块范围内为网络接口选择辅助 IPv6。
+ 将安全组与网络接口关联，而不是与各 IP 地址关联。因此，网络接口中指定的每个 IP 地址均受其网络接口的安全组约束。
+ 可将多个 IP 地址分配给附加到正在运行或已停止实例的网络接口，也可以取消分配操作。
+ 如果您明确允许，已分配给某个网络接口的辅助私有 IPv4 地址可重新分配给其他网络接口。
+ 无法将 IPv6 地址重新分配给其他网络接口；您必须先取消分配给现有网络接口的 IPv6 地址。
+ 当使用命令行工具或 API 将多个 IP 地址分配给某个网络接口时，如果其中有一个 IP 地址无法分配，整个操作都会失败。
+ 当网络接口与实例分离或附加到实例时，主要私有 IPv4 地址、辅助私有 IPv4 地址、弹性 IP 地址以及 IPv6 地址将仍然属于此辅助网络接口。
+ 尽管您无法从实例分离主要网络接口，但是您可以将主要网络接口的辅助私有 IPv4 地址重新分配给另一个网络接口。

有关更多信息，请参阅 [EC2 实例的辅助 IP 地址](instance-secondary-ip-addresses.md)。

## EC2 实例主机名
<a name="amazon-dns"></a>

当您创建 EC2 实例时，AWS 为该实例创建主机名。有关主机名类型及其 AWS 预置方式的更多信息，请参阅 [EC2 实例主机名和域](ec2-instance-naming.md)。Amazon 提供了 DNS 服务器，可将 Amazon 提供的主机名解析为 IPv4 和 IPv6 地址。Amazon DNS 服务器位于 VPC 网络范围起始地址 \+ 2 的位置。有关更多信息，请参阅《Amazon VPC 用户指南》**中的 [VPC 的 DNS 属性](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html)。

## 链路本地地址
<a name="link-local-addresses"></a>

Amazon EC2 为只能从某个 EC2 实例访问的服务保留特定的 IPv4 链路本地地址。这些服务不在实例上运行，而是在底层主机上运行。当您访问这些服务的保留链路本地地址时，您将与 Xen 虚拟机管理程序或 Nitro 控制器进行通信。底层主机处理通向这些保留地址的流量，而不是根据客户配置的路由进行转发。安全组和网络 ACL 不会筛选此流量。

AWS 并非保留 `169.254.0.0/16` 中的每个 IPv4 地址。通向该范围内非保留地址的流量将遵循适用的 VPC 路由。安全组和网络 ACL 可筛选此流量。

**链路本地地址范围**
+ IPv4 – 169.254.0.0/16（169.254.0.0 到 169.254.255.255）
+ IPv6 – fe80::/10

**您通过链路本地地址访问的服务**
+ [实例元数据服务](instancedata-data-retrieval.md) – `169.254.169.254`
+ [Amazon Route 53 Resolver](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html#AmazonDNS)（也称为 Amazon DNS 服务器））– `169.254.169.253`
+ [Amazon Time Sync Service](set-time.md) – `169.254.169.123`
+ [AWS KMS 服务器](common-messages.md#activate-windows)
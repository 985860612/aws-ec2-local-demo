

# Amazon EC2 安全组连接跟踪
<a name="security-group-connection-tracking"></a>

您的安全组使用连接跟踪来跟踪有关进出实例的流量的信息。将基于流量的连接状态应用规则以确定允许还是拒绝流量。有了这种方法，安全组就具有状态。这意味着无论出站安全组规则如何都允许对入站流量的响应流出实例，反之亦然。

例如，假设您从家中的计算机对您的实例启动 netcat 或与您的实例类似的命令，并且您的入站安全组规则允许 ICMP 流量。跟踪有关连接的信息（包括端口信息）。来自 命令的实例的响应流量不会作为新请求来跟踪，而是作为已建立的连接来跟踪，并且可以流出实例，即使您的出站安全组规则限制出站 ICMP 流量也是如此。

对于除 TCP、UDP 或 ICMP 以外的协议，仅跟踪 IP 地址和协议编号。如果您的实例将流量发送到另一个主机，且该主机在 600 秒内将同一类型的流量发送到您的实例，则无论入站安全组规则如何，您的实例的安全组都将接受该请求。安全组接受它，因为它被视为原始流量的响应流量。

更改安全组规则时，其跟踪的连接不会立即中断。在现有连接超时之前，安全组将继续允许数据包。要确保该流量立即中断，或确保所有流量无论跟踪状态如何，均遵循防火墙规则，您可以使用子网的网络 ACL。网络 ACL 是无状态的，因此不会自动允许响应流量。添加阻止任一方向的流量的网络 ACL 会破坏现有连接。有关更多信息，请参阅 *Amazon VPC 用户指南*中的[网络 ACL](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)。

**注意**  
安全组对传入或传出 Route 53 Resolver 的 DNS 流量没有影响，Route 53 Resolver 有时称为“VPC\+2 IP 地址”（请参阅《Amazon Route 53 开发者指南**》中的[什么是 Amazon Route 53 Resolver？](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html)）或“AmazonProvidedDNS”（请参阅《Amazon Virtual Private Cloud 用户指南**》中的[使用 DHCP 选项集](https://docs.aws.amazon.com/vpc/latest/userguide/DHCPOptionSet.html)）。如果希望通过 Route 53 Resolver 筛选 DNS 请求，则可以启用 Route 53 Resolver DNS Firewall（请参阅《Amazon Route 53 开发人员指南**》中的 [Route 53 Resolver DNS Firewall](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-dns-firewall.html)）。

## 未跟踪的连接
<a name="untracked-connections"></a>

并非所有通信流都会被跟踪。如果有安全组规则允许所有流量（0.0.0.0/0 或 ::/0）的 TCP 或 UDP 流，而另一个方向上存在对应的规则，允许任何端口（0-65535）的所有响应流量（0.0.0.0/0 或 ::/0），则系统不会跟踪该流量流，除非它属于[自动跟踪连接](#automatic-tracking)的一部分。基于允许响应流量的入站或出站规则允许未跟踪流的响应流量，而不是基于跟踪信息。

如果删除或修改了支持该流的规则，则会立即中断未被跟踪的通信流。例如，如果您有一个开放 (0.0.0.0/0) 出站规则，并且删除了允许所有 (0.0.0.0/0) 入站 SSH（TCP 端口 22）流量传输到实例的规则（或修改它以使不再允许连接），则您与实例的现有 SSH 连接将立即删除。该连接以前未跟踪，因此更改将断开连接。另一方面，如果您有一个较细化的入站规则，最初允许 SSH 连接（意味着已跟踪该连接），但将该规则更改为不再允许来自当前 SSH 客户端地址的新连接，则由于现有的 SSH 连接被跟踪，它不会中断。

## 自动跟踪的连接
<a name="automatic-tracking"></a>

即使安全组配置无需跟踪，也会自动跟踪通过以下各项建立的连接：
+ 仅出口互联网网关
+ Global Accelerator 加速器
+ NAT 网关
+ Network Firewall 防火墙端点
+ 网络负载均衡器
+ AWS PrivateLink（接口 VPC 端点）
+ AWS Lambda（Hyperplane 弹性网络接口）
+ DynamoDB 网关端点 – 与 DynamoDB 的每个连接都会消耗 2 个 conntrack 条目。

## 连接跟踪限额
<a name="connection-tracking-throttling"></a>

Amazon EC2 定义每个实例可以跟踪的最大连接数量。达到最大值后，由于无法建立新连接，所有发送或接收的数据包都将丢失。发生这种情况时，发送和接收数据包的应用程序无法正常通信。使用 `conntrack_allowance_available` 网络性能指标来确定该实例类型仍然可用的跟踪连接数。

要确定数据包是否因为您实例的网络流量超过了可跟踪的最大连接数量而丢弃，请使用 `conntrack_allowance_exceeded` 网络性能指标。有关更多信息，请参阅 [监控 EC2 实例上 ENA 设置的网络性能](monitoring-network-performance-ena.md)。

如果您超过了每个实例可跟踪的最大连接数量，建议您借助 Elastic Load Balancing 扩展负载均衡器注册的实例数或实例大小。

## 连接跟踪最佳实践
<a name="connection-tracking-performance"></a>

非对称路由（即流量通过一个网络接口进入实例，然后通过另一个网络接口离开）可能会降低实例在跟踪流量时所能达到的峰值性能。

为在针对安全组启用连接跟踪时保持峰值性能并优化连接管理，建议您使用以下配置：
+ 如有可能，请避免使用非对称路由拓扑。
+ 并非使用安全组进行筛选，而是使用网络 ACL。
+ 如果必须将安全组与连接跟踪结合使用，请配置尽可能短的空闲连接跟踪超时。有关空闲连接跟踪超时的详细信息，请参阅下一节。
+ 由于 Nitrov6 实例的默认超时时间较短，具有长期连接的应用程序（例如数据库连接池、持久 HTTP 连接或流式工作负载）应在实例启动时配置适当的 `TcpEstablishedTimeout` 值。
+ 对于长期连接，请将 TCP keepalive 配置为每隔少于 5 分钟发送一次，进而确保连接保持打开状态并保持其跟踪状态。这有助于防止由于空闲超时而导致连接中断，并减少重新建立连接的开销。

有关 Nitro 系统性能优化的更多信息，请参阅 [Nitro 系统性能调整注意事项](ena-nitro-perf.md)。

## 空闲连接跟踪超时
<a name="connection-tracking-timeouts"></a>

安全组会跟踪建立的每个连接，以确保返回数据包按预期交付。每个实例都有可以跟踪的最大连接数量。保持空闲状态的连接可能导致连接跟踪耗尽，并导致无法跟踪连接和丢弃数据包。您可以在弹性网络接口上设置空闲连接跟踪的超时时间。

**注意**  
此功能仅适用于[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。在部署到生产环境之前，您应该在 Nitrov6 代实例上测试应用程序，减少 `350` 秒默认连接跟踪超时。

有三种可配置的超时：
+ **TCP 建立超时**：处于已建立状态的空闲 TCP 连接的超时时间（以秒为单位）。
  + 最小值：`60` 秒
  + 最大值：`432000` 秒
  + 默认值：[Nitro v6](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-nitro-instances.html) 实例类型（不包括 p6e-GB200）为 `350` 秒；所有其他实例类型（包括 p6e-GB200）为 `432000` 秒。
  + 建议值：小于 `432000` 秒
+ **UDP 超时**：空闲 UDP 流的超时时间（以秒为单位），这些流仅在单个方向或单个请求-响应事务上看到流量。
  + 最小值：`30` 秒
  + 最大值：`60` 秒
  + 原定设置：`30` 秒
+ **UDP 流超时**：空闲 UDP 流的超时（以秒为单位），这些流被归类为已看到多个请求-响应事务的流。
  + 最小值：`60` 秒
  + 最大值：`180` 秒
  + 原定设置：`180` 秒

对于以下任何一种情况，您可能需要修改默认超时：
+  如果您[使用 Amazon EC2 网络性能指标监控跟踪的连接](monitoring-network-performance-ena.md)，那么 *conntrack\_allowance\_exceeded* 和 *conntrack\_allowance\_available* 指标使您能够监控丢弃的数据包并跟踪连接利用率，通过纵向或横向扩展操作主动管理 EC2 实例容量，从而在丢弃数据包之前帮助满足网络连接需求。如果您观察到正在 EC2 实例上丢弃 *conntrack\_allowance\_exceeded*，您可以设置较低的 TCP 建立超时，以解决因不正确的客户端或网络中继盒导致 TCP/UDP 会话失效的问题，您可能会受益于此操作。
+ 通常，负载均衡器或防火墙的 TCP 建立空闲超时在 60 到 90 分钟之间。如果您正在运行的工作负载需要处理来自网络防火墙等设备的大量连接（大于 100k），则建议在 EC2 网络接口上配置类似的超时时间。
+ 如果您运行的工作负载使用非对称路由拓扑，我们建议将 TCP 已建立空闲超时配置为 60 秒。
+ 如果您正在运行具有大量连接的工作负载，例如 DNS、SIP、SNMP、Syslog、Radius 和主要使用 UDP 来处理请求的其他服务，则将“UDP-Stream”超时设置为 60 秒可以提高现有容量的规模/性能，并防止灰色故障。
+ 对于通过网络负载均衡器进行的 TCP/UDP 连接，将追踪所有连接。TCP 流的空闲超时值为 350 秒，而 UDP 流为 120 秒，因接口级别的超时值而异。您可能希望在网络接口级别配置超时，以便比负载均衡器的默认值具有更大的超时灵活性。

当您执行以下操作时，可以选择配置连接跟踪超时：
+ [创建网络接口](create-network-interface.md)
+ [修改网络接口属性](modify-network-interface-attributes.md)
+ [启动 EC2 实例](ec2-instance-launch-parameters.md#liw-network-settings)
+ [创建 EC2 实例启动模板](ec2-instance-launch-parameters.md#liw-network-settings)

## 示例
<a name="connection-tracking-example"></a>

在以下示例中，安全组具有允许 TCP 和 ICMP 流量的入站规则，并具有允许所有出站流量的出站规则。


**入站**  

| 协议类型 | 端口号 | 来源 | 
| --- | --- | --- | 
| TCP  | 22 (SSH) | 203.0.113.1/32 | 
| TCP  | 80 (HTTP) | 0.0.0.0/0 | 
| TCP  | 80 (HTTP) | ::/0 | 
| ICMP | 全部 | 0.0.0.0/0 | 


**出站**  

| 协议类型 | 端口号 | 目标 | 
| --- | --- | --- | 
| 全部 | 全部 | 0.0.0.0/0 | 
| All | All | ::/0 | 

通过与实例或网络接口的直接网络连接，跟踪行为如下：
+ 将会跟踪端口 22（SSH）上的入站和出站 TCP 流量，因为入站规则只允许来自 203.0.113.1/32 的流量，而不是所有 IP 地址（0.0.0.0/0）。
+ 不会跟踪端口 80（HTTP）上的入站和出站 TCP 流量，因为入站和出站规则允许来自所有 IP 地址的流量。
+ 始终跟踪 ICMP 流量。

如果您删除 IPv4 流量的出站规则，则将跟踪所有入站和出站 IPv4 流量，包括端口 80（HTTP）上的流量。如果您删除 IPv6 流量的出站规则，这同样适用于 IPv6 流量。
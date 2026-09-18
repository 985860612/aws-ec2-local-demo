

# EC2 实例的网络最大传输单位 (MTU)
<a name="network_mtu"></a>

网络连接的最大传输单位 (MTU) 是能够通过该连接传递的最大可允许数据包的大小（以字节为单位）。连接的 MTU 越大，可在单个数据包中传递的数据越多。以太网帧由数据包（即您发送的实际数据）以及相关网络开销信息组成。

以太网帧有不同的格式，最常见的格式是标准以太网 v2 帧格式。它支持 1500 MTU，这是大部分 Internet 上支持的最大以太网数据包大小。实例支持的最大 MTU 取决于其实例类型。

所有 EC2 实例类型都支持 1500 MTU。

**Topics**
+ [巨型帧 (9001 MTU)](#jumbo_frame_instances)
+ [路径 MTU 发现](#path_mtu_discovery)
+ [设置 Amazon EC2 实例的 MTU](ec2-instance-mtu.md)
+ [故障排除](#mtu-troubleshooting)

## 巨型帧 (9001 MTU)
<a name="jumbo_frame_instances"></a>

借助巨型帧，您可以增加每个数据包的有效载荷大小，从而增加数据包中不属于数据包开销的百分比。使用巨型帧时，发送等量的可用数据所需要的数据包更少。但是，某些类型的流量受以下最大有效载荷的约束：

**MTU 限制 1500 字节**
+ 互联网网关流量
+ VPN 连接的流量
+ AWS 区域之间的流量，除非使用中转网关

**MTU 限制 8500 字节**
+ 区域间 VPC 对等连接中的流量

如果数据包超过其 MTU 限制，则对数据包进行分段；如果在 IP 标头中设置了 `Don't Fragment` 标记，则丢弃数据包。

对于面向 Internet 的流量或离开 VPC 的任何流量，应谨慎使用巨型帧。中间系统会对数据包进行分段，从而减缓此流量。要使用 VPC 中的巨型帧而不减慢 VPC 外部的绑定流量的速度，您可按路由配置 MTU 大小，或者将弹性网络接口与不同 MTU 大小和不同路由结合使用。

对于在集群置放群组中并置的实例，巨型帧有助于实现可能的最大网络吞吐量，建议在这种情况下使用这些帧。有关更多信息，请参阅[Amazon EC2 实例的置放群组](placement-groups.md)。

您可以通过 Direct Connect 使用巨型帧在 VPC 与本地网络之间进行通信。有关更多信息以及验证巨型帧功能的方法，请参阅《Direct Connect 用户指南》中的 [MTU for private virtual interfaces or transit virtual interfaces](https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html#set-jumbo-frames-vif.html)**。

所有[当前一代](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html#current-gen-instances)实例类型都支持巨型帧。下列[上一代](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html#previous-gen-instances)实例类型支持巨型帧：A1、C3、I2、M3 和 R3。

**相关资源**
+ 对于 NAT 网关，请参阅《Amazon VPC 用户指南》**中的 [NAT 网关基础知识](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html)。
+ 对于中转网关，请参阅 *Amazon VPC 中转网关用户指南*中的 [Maximum transmission unit](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-quotas.html#mtu-quotas)。
+ 对于 Local Zones，请参阅《AWS Local Zones User Guide》**中的 [Considerations](https://docs.aws.amazon.com/local-zones/latest/ug/how-local-zones-work.html#considerations)。
+ 对于 AWS Wavelength，请参阅 *AWS Wavelength 用户指南*中的 [Maximum transmission unit](https://docs.aws.amazon.com/wavelength/latest/developerguide/how-wavelengths-work.html#mtu)。
+ 对于 Outposts，请参阅 *AWS Outposts 用户指南*中的 [Service link maximum transmission unit requirements](https://docs.aws.amazon.com/outposts/latest/userguide/region-connectivity.html#sl-max-mtu-requirements)。

## 路径 MTU 发现
<a name="path_mtu_discovery"></a>

路径 MTU 发现（PMTUD）用于确定两台设备之间的路径 MTU。路径 MTU 是原始主机和接收主机之间的路径所支持的最大数据包大小。当两个主机的网络中 MTU 大小存在差异时，PMTUD 使接收主机能够使用 ICMP 消息响应原始主机。此 ICMP 消息将指示原始主机在网络路径中使用最低 MTU 大小并重新发送请求。若无此协商，当请求过大，导致接收主机无法接收时，数据包可能会丢失。

对于 IPv4，如果主机发送一个大于接收主机的 MTU 或大于路径上某台设备的 MTU 的数据包，则接收主机或设备将删除此数据包，然后返回以下 ICMP 消息：`Destination Unreachable: Fragmentation Needed and Don't Fragment was Set`（类型 3，代码 4）。这将指示传输主机将有效负载拆分为多个较小的数据包，然后重新传输。

IPv6 协议不支持网络中的分段。如果主机发送一个大于接收主机的 MTU 或大于路径上某台设备的 MTU 的数据包，则接收主机或设备将删除此数据包，然后返回以下 ICMP 消息：`ICMPv6 Packet Too Big (PTB)`（类型 2）。这将指示传输主机将有效负载拆分为多个较小的数据包，然后重新传输。

通过某些组件（例如 NAT 网关和负载均衡器）建立的连接会[自动跟踪](security-group-connection-tracking.md#automatic-tracking)。这意味着将为您的出站连接尝试自动启用[安全组跟踪](security-group-connection-tracking.md)。如果自动跟踪的连接状态为[未跟踪](security-group-connection-tracking.md#untracked-connections)，或者您的安全组规则允许入站 ICMP 流量，您可能会收到 PMTUD 响应。

请注意，即使在安全组级别允许流量，也可能会阻止 ICMP 流量；例如您的网络访问控制列表条目拒绝 ICMP 流量进入子网时。

**重要**  
路径 MTU 发现不能保证某些路由器不丢弃巨型帧。您 VPC 中的互联网网关仅将转发最多 1500 字节的数据包。建议对 Internet 流量使用 1500 MTU 数据包。

有关 NAT 网关的 MTU 规则，请参阅《Amazon VPC 用户指南》**中的[最大传输单元（MTU）](https://docs.aws.amazon.com/vpc/latest/userguide/amazon-vpc-limits.html#ngw-mtus)。有关中转网关的 MTU 规则，请参阅《AWS Transit Gateway User Guide》**中的 [Maximum transmission unit (MTU)](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-quotas.html#mtu-quotas)。

## 故障排除
<a name="mtu-troubleshooting"></a>

如果在使用巨型帧时您的 EC2 实例和 Amazon Redshift 集群之间出现连接问题，则请参阅《Amazon Redshift 管理指南》**中的[查询似乎挂起，有时无法连接到集群](https://docs.aws.amazon.com/redshift/latest/mgmt/troubleshooting-connections.html#connecting-drop-issues)。
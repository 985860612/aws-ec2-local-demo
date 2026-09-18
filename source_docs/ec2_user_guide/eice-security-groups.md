

# EC2 Instance Connect Endpoint 安全组
<a name="eice-security-groups"></a>

安全组控制允许到达和离开与其关联资源的流量。例如，除非与 Amazon EC2 实例关联的安全组特别允许，否则我们会拒绝进出该实例的流量。

以下示例演示了如何为 EC2 Instance Connect 端点和目标实例配置安全组规则。

**Topics**
+ [EC2 Instance Connect 端点安全组规则](#eice-security-group-rules)
+ [目标实例安全组规则](#resource-security-group-rules)

## EC2 Instance Connect 端点安全组规则
<a name="eice-security-group-rules"></a>

EC2 Instance Connect 端点的安全组规则必须允许离开该端点并指向目标实例的出站流量。您可以将实例安全组或 VPC 的 IPv4 或 IPv6 地址范围指定为目标。

由于指向端点的流量来自 EC2 Instance Connect 端点服务，因此无论端点安全组的入站规则如何，该流量都会被允许。要控制谁可以使用 EC2 Instance Connect 端点连接到实例，请使用 IAM 策略。有关更多信息，请参阅 [使用 EC2 Instance Connect 端点连接到实例的权限](permissions-for-ec2-instance-connect-endpoint.md#iam-OpenTunnel)。

**示例出站规则：安全组引用**  
以下示例使用了安全组引用，这意味着目标是一个与目标实例关联的安全组。此规则允许从该端点到使用此安全组的所有实例的出站流量。


| 协议 | 目标 | 端口范围 | Comment | 
| --- | --- | --- | --- | 
| TCP | {{实例安全组的 ID}} | 22 | 允许指向与实例安全组关联的所有实例的出站 SSH 流量 | 

**示例出站规则：IPv4 地址范围**  
以下示例允许指向指定 IPv4 地址范围的出站流量。实例的 IPv4 地址是从其子网分配的，因此可以使用 VPC 的 IPv4 地址范围。


| 协议 | 目标 | 端口范围 | Comment | 
| --- | --- | --- | --- | 
| TCP | {{VPC IPv4 CIDR}} | 22 | 允许指向 VPC 的出站 SSH 流量 | 

**示例出站规则：IPv6 地址范围**  
以下示例允许指向指定 IPv6 地址范围的出站流量。实例的 IPv6 地址是从其子网分配的，因此可以使用 VPC 的 IPv6 地址范围。


| 协议 | 目标 | 端口范围 | Comment | 
| --- | --- | --- | --- | 
| TCP | {{VPC IPv6 CIDR}} | 22 | 允许指向 VPC 的出站 SSH 流量 | 

## 目标实例安全组规则
<a name="resource-security-group-rules"></a>

目标实例安全组规则必须允许来自该 EC2 Instance Connect 端点的入站流量。您可以将端点安全组或 IPv4 或 IPv6 地址范围指定为源。如果指定 IPv4 地址范围，则源取决于关闭还是开启了客户端 IP 保留功能。有关更多信息，请参阅 [注意事项](connect-with-ec2-instance-connect-endpoint.md#ec2-instance-connect-endpoint-prerequisites)。

由于安全组是有状态的，因此无论实例安全组的出站规则如何，都将允许响应流量离开 VPC。

**示例入站规则：安全组引用**  
以下示例使用了安全组引用，这意味着源是与该端点关联的安全组。此规则允许从端点到使用此安全组的所有实例的入站 SSH 流量，无论客户端 IP 保留功能处于开启还是关闭状态。如果 SSH 没有其他入站安全组规则，则实例仅接受来自该端点的 SSH 流量。


| 协议 | 来源 | 端口范围 | Comment | 
| --- | --- | --- | --- | 
| TCP | {{端点安全组的 ID}} | 22 | 允许来自与端点安全组关联的资源的入站 SSH 流量 | 

**示例入站规则：客户端 IP 保留功能已关闭**  
以下示例允许来自指定 IPv4 地址范围的入站 SSH 流量。因为客户端 IP 保留功能已关闭，因此源 IPv4 地址是端点网络接口的地址。端点网络接口的地址由其子网分配，因此您可以使用 VPC 的 IPv4 地址范围来允许连接到 VPC 中的所有实例。


| 协议 | 来源 | 端口范围 | Comment | 
| --- | --- | --- | --- | 
| TCP | {{VPC IPv4 CIDR}} | 22 | 允许来自 VPC 的入站 SSH 流量 | 

**示例入站规则：客户端 IP 保留功能已开启**  
以下示例允许来自指定 IPv4 地址范围的入站 SSH 流量。因为客户端 IP 保留功能已开启，因此源 IPv4 地址是客户端的地址。


| 协议 | 来源 | 端口范围 | Comment | 
| --- | --- | --- | --- | 
| TCP | {{公有 IPv4 地址范围}} | 22 | 允许来自指定客户端 IPv4 地址范围的入站流量 | 
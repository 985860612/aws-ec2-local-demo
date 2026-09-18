

# EC2 实例的 Amazon EC2 安全组
<a name="ec2-security-groups"></a>

*安全组* 充当 EC2 实例的虚拟防火墙，用于控制传入和传出流量。入站规则控制传入到实例的流量，出站规则控制从实例传出的流量。启动实例时，您可以指定一个或多个安全组。如果您未指定安全组，则 Amazon EC2 将对 VPC 使用默认安全组。启动实例后，您可以更改其安全组。

安全性是 AWS 和您的共同责任。有关更多信息，请参阅 [Amazon EC2 中的安全性](ec2-security.md)。AWS 提供安全组作为一项工具用于保护您的实例，您需要对其进行配置以满足您的安全需求。如果安全组无法满足您的要求，除了使用安全组外，您还可以在任何一个实例上保持自己的防火墙。

**定价**  
使用安全组不会收取任何额外费用。

**Topics**
+ [概述](#security-group-basics)
+ [为 Amazon EC2 实例创建安全组](creating-security-group.md)
+ [更改 Amazon EC2 实例的安全组](changing-security-group.md)
+ [删除 Amazon EC2 安全组](deleting-security-group.md)
+ [Amazon EC2 安全组连接跟踪](security-group-connection-tracking.md)
+ [针对不同使用案例的安全组规则](security-group-rules-reference.md)

## 概述
<a name="security-group-basics"></a>

您可以将每个实例与多个安全组关联，也可以将每个安全组与多个实例关联。为每个安全组添加规则，规定流入或流出其关联实例的流量。您可以随时修改安全组的规则。新规则和修改后的规则将自动应用到与安全组相关联的所有实例。在决定是否允许流量到达某个实例时，Amazon EC2 会评估与该实例关联的所有安全组中的所有规则。有关更多信息，请参阅 *Amazon VPC 用户指南*中的[安全组规则](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html)。

下图显示了一个具有一个子网、一个互联网网关和一个安全组的 VPC。子网包含 EC2 实例。安全组与实例关联。到达实例的唯一流量是得到安全组规则允许的流量。例如，如果安全组包含一条允许来自您的网络的 SSH 流量的规则，则您可以使用 SSH 从您的计算机连接到实例。如果安全组包含一条规则，允许来自与其关联的资源的所有流量，则每个实例都可以接收从其他实例发送的任何流量。

![具有安全组的 VPC。将子网中的 EC2 实例与安全组关联起来。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2-security-groups.png)


安全组是有状态的 — 如果您从实例发送一个请求，则无论入站安全组规则如何，都将允许该请求的响应流量流入。此外，如果是为响应已允许的入站流量，则该响应可以出站，此时可忽略出站规则。有关更多信息，请参阅 [连接跟踪](security-group-connection-tracking.md)。
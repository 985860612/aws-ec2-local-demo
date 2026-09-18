

# 弹性网络接口
<a name="using-eni"></a>

*弹性网络接口* 是 VPC 中表示虚拟网卡的逻辑网络组件。您可以创建并配置网络接口，并将其连接到同一可用区中启动的实例。将网络接口附加到一个实例或者从一个实例分离并重新附加到另一实例时，网络接口的属性不会变化。当您将网络接口从一个实例移动到另一个实例时，网络流量也会从原始实例重定向到新实例。

请注意，该 AWS 资源在 AWS 管理控制台 和 Amazon EC2 API 中称为*网络接口*。因此，我们在本文档中使用“网络接口”，而不是“弹性网络接口”。本文档中的“网络接口”术语始终表示“弹性网络接口”。

**网络接口属性**

网络接口可以包含以下属性：
+ 您子网的 IPv4 地址范围内的一个主要私有 IPv4 地址
+ 您子网的 IPv6 地址范围内的一个主 IPv6 地址
+ 子网 IPv4 地址范围内的辅助私有 IPv4 地址
+ 每个私有 IPv4 地址一个弹性 IP 地址（IPv4）
+ 一个公有 IPv4 地址
+ 辅助 IPv6 地址
+ 安全组
+ 一个 MAC 地址
+ 一个源/目标检查标记
+ 一个描述

**监控流量**  
您可以在网络接口上启用 VPC 流日志以捕获有关出入该网络接口的流量的信息。创建流日志后，您可以在 Amazon CloudWatch Logs 中查看和检索其数据。有关更多信息，请参阅 *Amazon VPC 用户指南* 中的 [VPC 流日志](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)。

**Topics**
+ [网络接口概念](#eni-basics)
+ [网卡](#network-cards)
+ [每个网络接口的最大 IP 地址数](AvailableIpPerENI.md)
+ [为 Amazon EC2 实例创建网络接口](create-network-interface.md)
+ [EC2 实例的网络接口连接](network-interface-attachments.md)
+ [管理网络接口的 IP 地址](managing-network-interface-ip-addresses.md)
+ [修改网络接口属性](modify-network-interface-attributes.md)
+ [您的 Amazon EC2 实例的多个网络接口](scenarios-enis.md)
+ [请求者托管的网络接口](requester-managed-eni.md)
+ [Amazon EC2 网络接口的前缀委派](ec2-prefix-eni.md)
+ [删除网络接口](delete_eni.md)

## 网络接口概念
<a name="eni-basics"></a>

以下是开始使用网络接口时需要理解的重要概念。

**主网络接口**  
每个实例都有一个默认网络接口，称为*主网络接口*。您无法将主网络接口与实例分离。

**辅助网络接口**  
您可以创建辅助网络接口并将其附加到您的实例。最大网络接口数量因实例类型而不同。有关更多信息，请参阅 [每个网络接口的最大 IP 地址数](AvailableIpPerENI.md)。

**网络接口的 IPv4 地址**  
在仅 IPv4 或双堆栈子网中启动 EC2 实例时，该实例将在子网的 IPv4 地址范围内收到一个主要私有 IP 地址。您还可以指定其他私有 IPv4 地址，即辅助私有 IPv4 地址。与主要私有 IP 地址不同的是，辅助私有 IP 地址可以从一个实例重新分配到另一个实例。

**网络接口的公有 IPv4 地址**  
所有子网都有一个可以修改的属性，该属性可以确定在子网中创建的网络接口（以及因此在该子网中启动的实例）是否会分配一个公有 IPv4 地址。有关更多信息，请参阅《*Amazon VPC 用户指南*》中的[子网设置](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html#subnet-settings)。在启动实例时，将为主网络接口分配 IP 地址。如果启动实例时指定现有的网络接口作为主网络接口，则公有 IPv4 地址由该网络接口确定。  
当您创建一个网络接口时，它会继承子网的公有 IPv4 寻址属性。如果您日后修改了子网的公有 IPv4 寻址属性，网络接口仍会继续使用在其创建时生效的设置。  
当该实例停止、休眠或终止后，我们会释放公有 IP 地址。当您启动已停止或休眠状态的实例时，我们会分配新的公有 IP 地址，除非其具有辅助网络接口或与弹性 IP 地址关联的辅助私有 IPv4 地址。

**网络接口的 IPv6 地址**  
如果您将 IPv6 CIDR 块与您的 VPC 和子网关联，则可以将子网范围内的 IPv6 地址分配给一个网络接口。每个 IPv6 地址可以分配给一个网络接口。  
所有子网都有一个可以修改的属性，该属性可以确定在子网中创建的网络接口 (以及在该子网中启动的实例) 是否会自动分配到一个处于子网范围内的 IPv6 地址。在启动实例时，将为主网络接口分配 IPv6 地址。

**网络接口的弹性 IP 地址**  
您可以将弹性 IP 地址与网络接口的其中一个私有 IPv4 地址关联。您可以为每个私有 IPv4 地址关联一个弹性 IP 地址。如果解除弹性 IP 地址与网络接口的关联，则可以释放该弹性 IP 地址或将其与其他实例关联。

**终止操作**  
您可以设置附加到实例的网络接口的终止操作。您可以指定在终止网络接口附加到的实例时是否自动删除该接口。

**源/目标检查**  
您可以启用或禁用源/目标检查，以确保实例是其接收的任何流量的源或目标。默认情况下会启用源/目标检查。如果实例运行网络地址转换、路由或防火墙等服务，您必须禁用源/目标检查。

**请求者托管的网络接口**  
这些网络接口由 AWS 服务创建和管理，以使您能够使用一些资源和服务。您自己无法管理这些网络接口。有关更多信息，请参阅 [请求者托管的网络接口](requester-managed-eni.md)。

**前缀委派**  
前缀是预留的私有 IPv4 或 IPv6 CIDR 范围，用于自动或手动分配给与实例关联的网络接口。通过使用委派前缀，您可以通过将一系列 IP 地址分配为单个前缀来更快启动服务。

**托管网络接口**  
*托管网络接口*是指由服务提供商（例如 Amazon EKS 自动模式）管理的实例。您不能直接修改托管网络接口的设置。托管网络接口由**托管**字段中的 **true** 进行标识。有关更多信息，请参阅 [Amazon EC2 托管式实例](amazon-ec2-managed-instances.md)。

## 网卡
<a name="network-cards"></a>

大多数实例类型都支持一个网卡。支持多个网卡的实例类型可提供更高的网络性能，包括 100 Gbps 以上的带宽能力和更高的数据包速率性能。在将网络接口附加到支持多个网卡的实例时，可以为该网络接口选择网卡。必须将主网络接口分配给网卡索引 0。

EFA 和仅限 EFA 的网络接口算作网络接口。每个网卡只能分配一个 EFA 或仅限 EFA 的网络接口。主网络接口不能是仅限 EFA 的网络接口。

以下实例类型支持多个网卡。有关实例类型支持的网络接口数量的信息，请参阅[每个网络接口的最大 IP 地址数](AvailableIpPerENI.md)。


| 实例类型 | 网卡数 | 
| --- | --- | 
| c6in.32xlarge | 2 | 
| c6in.metal | 2 | 
| c8gb.48xlarge | 2 | 
| c8gb.metal-48xl | 2 | 
| c8gn.48xlarge | 2 | 
| c8gn.metal-48xl | 2 | 
| c8in.96xlarge | 2 | 
| c8in.metal-96xl | 2 | 
| c8ib.96xlarge | 2 | 
| c8ib.metal-96xl | 2 | 
| dl1.24xlarge | 4 | 
| g6e.24xlarge | 2 | 
| g6e.48xlarge | 4 | 
| g7.48xlarge | 2 | 
| g7e.24xlarge | 2 | 
| g7e.48xlarge | 4 | 
| hpc6id.32xlarge | 2 | 
| hpc7a.12xlarge | 2 | 
| hpc7a.24xlarge | 2 | 
| hpc7a.48xlarge | 2 | 
| hpc7a.96xlarge | 2 | 
| hpc8a.96xlarge | 2 | 
| i7ie.48xlarge | 2 | 
| i7ie.metal-48xl | 2 | 
| i8ge.48xlarge | 2 | 
| i8ge.metal-48xl | 2 | 
| m6idn.32xlarge | 2 | 
| m6idn.metal | 2 | 
| m6in.32xlarge | 2 | 
| m6in.metal | 2 | 
| m8gb.48xlarge | 2 | 
| m8gb.metal-48xl | 2 | 
| m8gn.48xlarge | 2 | 
| m8gn.metal-48xl | 2 | 
| m8in.96xlarge | 2 | 
| m8in.metal-96xl | 2 | 
| m8idn.96xlarge | 2 | 
| m8idn.metal-96xl | 2 | 
| m8ib.96xlarge | 2 | 
| m8ib.metal-96xl | 2 | 
| m8idb.96xlarge | 2 | 
| m8idb.metal-96xl | 2 | 
| p4d.24xlarge | 4 | 
| p4de.24xlarge | 4 | 
| p5.48xlarge | 32 | 
| p5e.48xlarge | 32 | 
| p5en.48xlarge | 16 | 
| p6-b200.48xlarge | 8 | 
| p6-b300.48xlarge | 17 | 
| p6e-gb200.36xlarge | 17 | 
| r8gb.48xlarge | 2 | 
| r8gb.metal-48xl | 2 | 
| r8gn.48xlarge | 2 | 
| r8gn.metal-48xl | 2 | 
| r8in.96xlarge | 2 | 
| r8in.metal-96xl | 2 | 
| r8idn.96xlarge | 2 | 
| r8idn.metal-96xl | 2 | 
| r8ib.96xlarge | 2 | 
| r8ib.metal-96xl | 2 | 
| r8idb.96xlarge | 2 | 
| r8idb.metal-96xl | 2 | 
| r6idn.32xlarge | 2 | 
| r6idn.metal | 2 | 
| r6in.32xlarge | 2 | 
| r6in.metal | 2 | 
| trn1.32xlarge | 8 | 
| trn1n.32xlarge | 16 | 
| trn2.48xlarge | 16 | 
| trn2u.48xlarge | 16 | 
| u7in-16tb.224xlarge | 2 | 
| u7in-24tb.224xlarge | 2 | 
| u7in-32tb.224xlarge | 2 | 
| u7inh-32tb.480xlarge | 2 | 
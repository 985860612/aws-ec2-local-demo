

# 适用于 Amazon EC2 上 AI/ML 和 HPC 工作负载的 Elastic Fabric Adapter
<a name="efa"></a>

Elastic Fabric Adapter（EFA）是一种网络设备，可以将其附加到 Amazon EC2 实例以加速人工智能（AI）、机器学习（ML）和高性能计算（HPC）应用程序。EFA 使您能够利用 AWS 云提供的可扩展性、灵活性和弹性，实现本地 AI/ML 或 HPC 集群的应用程序性能。

与以前在基于云的 HPC 系统中使用的 TCP 传输相比，EFA 提供更低且更一致的延迟和更高的吞吐量。它提高了实例间通信的性能，这对于扩展 AI/ML 和 HPC 应用程序至关重要。它经过优化以在现有的 AWS 网络基础设施上使用，并且可以根据应用程序要求进行扩展。

EFA 与 Libfabric 集成在一起，并支持适用于 AI 和 ML 应用程序的 Nvidia Collective Communications Library (NCCL) 和 NVIDIA Inference Xfer Library (NIXL)，以及适用于 HPC 应用程序的 Open MPI 4.1 及更高版本和 Intel MPI 2019 Update 5 及更高版本。NCCL 和 MPI 与 Libfabric 1.7.0 及更高版本集成。NIXL 与 Libfabric 1.21.0 及更高版本集成。

EFA 支持在大多数具有 Nitro 版本 4 及更高版本的受支持实例类型上进行 RDMA（远程直接内存访问）写入。所有具有 Nitro 版本 4 及更高版本的实例均支持 RDMA 读取。有关更多信息，请参阅 [支持的实例类型](#efa-instance-types)。

**Topics**
+ [EFA 基础知识](#efa-basics)
+ [支持的接口和库](#efa-mpi)
+ [支持的实例类型](#efa-instance-types)
+ [支持的操作系统](#efa-os)
+ [EFA 限制](#efa-limits)
+ [EFA 定价](#efa-pricing)
+ [EFA 和 MPI 入门](efa-start.md)
+ [EFA 和 NCCL 入门](efa-start-nccl.md)
+ [开始使用 EFA 和 NCCL](efa-start-nixl.md)
+ [最大化网络带宽](efa-acc-inst-types.md)
+ [在容器中安装 EFA](efa-installer-containers.md)
+ [创建并附加 EFA](create-efa.md)
+ [分离并删除 EFA](detach-efa.md)
+ [监控 EFA](efa-working-monitor.md)
+ [验证 EFA 安装程序](efa-verify.md)
+ [发行说明](efa-changelog.md)

## EFA 基础知识
<a name="efa-basics"></a>

EFA 设备可以通过两种方式附加到 EC2 实例：

1. 使用传统 EFA 接口（也称为带 ENA 的 EFA），它可以创建 EFA 设备和 ENA 设备。

1. 使用仅限 EFA 的接口，该接口仅创建 EFA 设备。

EFA 设备通过可扩展的可靠数据报（SRD）协议提供内置操作系统绕过和拥塞控制等功能。EFA 设备功能支持低延迟、可靠的传输功能，可让 EFA 接口为 Amazon EC2 上的 HPC 和 ML 应用程序提供更理想的应用程序性能。ENA 设备则提供传统的 IP 联网。有关根据使用案例使用哪种实例配置的指导，请参阅 [最大化网络带宽](efa-acc-inst-types.md)。

![将传统的 HPC 软件堆栈与使用 EFA 的软件堆栈进行比较。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/efa_stack.png)


传统上，AI/ML 应用程序使用 NCCL 和 NIXL（用于分解推理）。HPC 应用程序使用消息传递接口 (MPI) 与系统的网络传输进行交互。在 AWS 云中，这意味着应用程序与 NCCL、NIXL 或 MPI 进行交互，然后 MPI 使用操作系统的 TCP/IP 堆栈和 ENA 设备驱动程序以启用实例之间的网络通信。

对于传统 EFA（带 ENA 的 EFA）或仅限 EFA 的接口，AI/ML 应用程序使用 NCCL 和 NIXL（带 ENA 的 EFA）或仅限 EFA 的接口（用于分解推理）。HPC 应用程序使用 MPI 直接与 Libfabric API 进行交互。Libfabric API 绕过操作系统内核，并直接与 EFA 设备通信以将数据包放在网络上。这减少了开销，并且可以更有效地运行 AL/ML 和 HPC 应用程序。

**注意**  
libfabric 是 OpenFabrics 接口 (OFI) 框架的核心组件，它定义并导出 OFI 的 user-space API。有关更多信息，请参阅 [libfabric OpenFabrics](https://ofiwg.github.io/libfabric/) 网站。

### ENA、EFA 和仅限 EFA 的网络接口之间的区别
<a name="efa-differences"></a>

Amazon EC2 提供两种类型的网络接口：
+ **ENA** 接口提供支持 VPC 的 IP 联网所需的所有传统 IP 联网和路由功能。有关更多信息，请参阅 [在 EC2 实例上使用 ENA 启用增强联网功能](enhanced-networking-ena.md)。
+ **EFA**（带 ENA 的 EFA）接口既提供用于 IP 联网的 ENA 设备，又提供用于低延迟、高吞吐量通信的 EFA 设备。
+ **仅限 EFA** 的接口仅支持 EFA 设备功能，不支持用于传统 IP 联网的 ENA 设备。

下表比较 ENA、EFA 和仅限 EFA 的网络接口。


|  | ENA | EFA（带 ENA 的 EFA） | 仅限 EFA | 
| --- | --- | --- | --- | 
| 支持 IP 联网功能 | 支持 | 是 | 否 | 
| 可以分配 IPv4 或 IPv6 地址 | 支持 | 是 | 否 | 
| 例如，可以用作主网络接口 | 支持 | 是 | 否 | 
| 计入实例的 ENI 附件限制 | 支持 | 是 | 是 | 
| 实例类型支持 | 在所有基于 Nitro 的实例类型上支持 | [支持的实例类型](#efa-instance-types) | [支持的实例类型](#efa-instance-types) | 
| EC2 API 中的参数命名 | interface | efa | efa-only | 
| EC2 控制台中的字段命名 | 未选择 | 带 ENA 的 EFA | 仅限 EFA | 

## 支持的接口和库
<a name="efa-mpi"></a>

EFA 支持以下接口和库：
+ Open MPI 4.1 及更高版本
+ Intel MPI 2019 Update 5 及更高版本
+ NVIDIA Collective Communications Library (NCCL) 2.4.2 及更高版本
+ NVIDIA Inference Xfer Library (NIXL) 1.0.0 及更高版本
+ AWS Neuron SDK 版本 2.3 及更高版本

## 支持的实例类型
<a name="efa-instance-types"></a>

以下所有实例类型均支持 EFA。此外，这些表还指示对实例类型的 RDMA 读取和 RDMA 写入支持。

------
#### [ Nitro v6 (EFA v4) ]


| 实例类型 | RDMA 读取支持 | RDMA 写入支持 | 
| --- |--- |--- |
| 通用 | 
| --- |
| m8a.48xlarge | Yes | Yes | 
| m8a.metal-48xl | Yes | Yes | 
| m8azn.24xlarge | Yes | Yes | 
| m8azn.metal-24xl | Yes | Yes | 
| m8gb.16xlarge | Yes | Yes | 
| m8gb.24xlarge | Yes | Yes | 
| m8gb.48xlarge | Yes | Yes | 
| m8gb.metal-24xl | Yes | Yes | 
| m8gb.metal-48xl | Yes | Yes | 
| m8gn.16xlarge | Yes | Yes | 
| m8gn.24xlarge | Yes | Yes | 
| m8gn.48xlarge | Yes | Yes | 
| m8gn.metal-24xl | Yes | Yes | 
| m8gn.metal-48xl | Yes | Yes | 
| m8i.48xlarge | Yes | Yes | 
| m8i.96xlarge | Yes | Yes | 
| m8i.metal-48xl | Yes | Yes | 
| m8i.metal-96xl | Yes | Yes | 
| m8id.48xlarge | Yes | Yes | 
| m8id.96xlarge | Yes | Yes | 
| m8id.metal-48xl | Yes | Yes | 
| m8id.metal-96xl | Yes | Yes | 
| m8in.48xlarge | Yes | Yes | 
| m8in.96xlarge | Yes | Yes | 
| m8in.metal-48xl | Yes | Yes | 
| m8in.metal-96xl | Yes | Yes | 
| m8idn.48xlarge | Yes | Yes | 
| m8idn.96xlarge | Yes | Yes | 
| m8idn.metal-48xl | Yes | Yes | 
| m8idn.metal-96xl | Yes | Yes | 
| m8ib.48xlarge | Yes | Yes | 
| m8ib.96xlarge | Yes | Yes | 
| m8ib.metal-48xl | Yes | Yes | 
| m8ib.metal-96xl | Yes | Yes | 
| m8idb.48xlarge | Yes | Yes | 
| m8idb.96xlarge | Yes | Yes | 
| m8idb.metal-48xl | Yes | Yes | 
| m8idb.metal-96xl | Yes | Yes | 
| m9g.48xlarge | Yes | Yes | 
| m9g.metal-48xl | Yes | Yes | 
| m9gd.48xlarge | Yes | Yes | 
| m9gd.metal-48xl | Yes | Yes | 
| 计算优化 | 
| --- |
| c8a.48xlarge | Yes | Yes | 
| c8a.metal-48xl | Yes | Yes | 
| c8gb.16xlarge | Yes | Yes | 
| c8gb.24xlarge | Yes | Yes | 
| c8gb.48xlarge | Yes | Yes | 
| c8gb.metal-24xl | Yes | Yes | 
| c8gb.metal-48xl | Yes | Yes | 
| c8gn.16xlarge | Yes | Yes | 
| c8gn.24xlarge | Yes | Yes | 
| c8gn.48xlarge | Yes | Yes | 
| c8gn.metal-24xl | Yes | Yes | 
| c8gn.metal-48xl | Yes | Yes | 
| c8i.48xlarge | Yes | Yes | 
| c8i.96xlarge | Yes | Yes | 
| c8i.metal-48xl | Yes | Yes | 
| c8i.metal-96xl | Yes | Yes | 
| c8id.48xlarge | Yes | Yes | 
| c8id.96xlarge | Yes | Yes | 
| c8id.metal-48xl | Yes | Yes | 
| c8id.metal-96xl | Yes | Yes | 
| c8in.48xlarge | Yes | Yes | 
| c8in.96xlarge | Yes | Yes | 
| c8in.metal-48xl | Yes | Yes | 
| c8in.metal-96xl | Yes | Yes | 
| c8ib.48xlarge | Yes | Yes | 
| c8ib.96xlarge | Yes | Yes | 
| c8ib.metal-48xl | Yes | Yes | 
| c8ib.metal-96xl | Yes | Yes | 
| c9g.48xlarge | Yes | Yes | 
| c9g.metal-48xl | Yes | Yes | 
| c9gd.48xlarge | Yes | Yes | 
| c9gd.metal-48xl | Yes | Yes | 
| 内存优化 | 
| --- |
| r8a.48xlarge | Yes | Yes | 
| r8a.metal-48xl | Yes | Yes | 
| r8gb.16xlarge | Yes | Yes | 
| r8gb.24xlarge | Yes | Yes | 
| r8gb.48xlarge | Yes | Yes | 
| r8gb.metal-24xl | Yes | Yes | 
| r8gb.metal-48xl | Yes | Yes | 
| r8gn.16xlarge | Yes | Yes | 
| r8gn.24xlarge | Yes | Yes | 
| r8gn.48xlarge | Yes | Yes | 
| r8gn.metal-24xl | Yes | Yes | 
| r8gn.metal-48xl | Yes | Yes | 
| r8i.48xlarge | Yes | Yes | 
| r8i.96xlarge | Yes | Yes | 
| r8i.metal-48xl | Yes | Yes | 
| r8i.metal-96xl | Yes | Yes | 
| r8id.48xlarge | Yes | Yes | 
| r8id.96xlarge | Yes | Yes | 
| r8id.metal-48xl | Yes | Yes | 
| r8id.metal-96xl | Yes | Yes | 
| r8in.48xlarge | Yes | Yes | 
| r8in.96xlarge | Yes | Yes | 
| r8in.metal-48xl | Yes | Yes | 
| r8in.metal-96xl | Yes | Yes | 
| r8idn.48xlarge | Yes | Yes | 
| r8idn.96xlarge | Yes | Yes | 
| r8idn.metal-48xl | Yes | Yes | 
| r8idn.metal-96xl | Yes | Yes | 
| r8ib.48xlarge | Yes | Yes | 
| r8ib.96xlarge | Yes | Yes | 
| r8ib.metal-48xl | Yes | Yes | 
| r8ib.metal-96xl | Yes | Yes | 
| r8idb.48xlarge | Yes | Yes | 
| r8idb.96xlarge | Yes | Yes | 
| r8idb.metal-48xl | Yes | Yes | 
| r8idb.metal-96xl | Yes | Yes | 
| r9g.48xlarge | Yes | Yes | 
| r9g.metal-48xl | Yes | Yes | 
| r9gd.48xlarge | Yes | Yes | 
| r9gd.metal-48xl | Yes | Yes | 
| x8aedz.24xlarge | Yes | Yes | 
| x8aedz.metal-24xl | Yes | Yes | 
| x8i.48xlarge | Yes | Yes | 
| x8i.64xlarge | Yes | Yes | 
| x8i.96xlarge | Yes | Yes | 
| x8i.metal-48xl | Yes | Yes | 
| x8i.metal-96xl | Yes | Yes | 
| 存储优化 | 
| --- |
| i8ge.48xlarge | Yes | Yes | 
| i8ge.metal-48xl | Yes | Yes | 
| 加速计算 | 
| --- |
| g7.8xlarge | Yes | Yes | 
| g7.12xlarge | Yes | Yes | 
| g7.24xlarge | Yes | Yes | 
| g7.48xlarge | Yes | Yes | 
| g7e.8xlarge | Yes | Yes | 
| g7e.12xlarge | Yes | Yes | 
| g7e.24xlarge | Yes | Yes | 
| g7e.48xlarge | Yes | Yes | 
| p6-b200.48xlarge | Yes | Yes | 
| p6-b300.48xlarge | Yes | Yes | 
| 高性能计算 | 
| --- |
| hpc8a.96xlarge | Yes | Yes | 

------
#### [ Nitro v5 (EFA v3) ]


| 实例类型 | RDMA 读取支持 | RDMA 写入支持 | 
| --- |--- |--- |
| 通用 | 
| --- |
| m8g.24xlarge | Yes | Yes | 
| m8g.48xlarge | Yes | Yes | 
| m8g.metal-24xl | Yes | Yes | 
| m8g.metal-48xl | Yes | Yes | 
| m8gd.24xlarge | Yes | Yes | 
| m8gd.48xlarge | Yes | Yes | 
| m8gd.metal-24xl | Yes | Yes | 
| m8gd.metal-48xl | Yes | Yes | 
| 计算优化 | 
| --- |
| c7gn.16xlarge | Yes | No | 
| c7gn.metal | Yes | No | 
| c8g.24xlarge | Yes | Yes | 
| c8g.48xlarge | Yes | Yes | 
| c8g.metal-24xl | Yes | Yes | 
| c8g.metal-48xl | Yes | Yes | 
| c8gd.24xlarge | Yes | Yes | 
| c8gd.48xlarge | Yes | Yes | 
| c8gd.metal-24xl | Yes | Yes | 
| c8gd.metal-48xl | Yes | Yes | 
| 内存优化 | 
| --- |
| r8g.24xlarge | Yes | Yes | 
| r8g.48xlarge | Yes | Yes | 
| r8g.metal-24xl | Yes | Yes | 
| r8g.metal-48xl | Yes | Yes | 
| r8gd.24xlarge | Yes | Yes | 
| r8gd.48xlarge | Yes | Yes | 
| r8gd.metal-24xl | Yes | Yes | 
| r8gd.metal-48xl | Yes | Yes | 
| x8g.24xlarge | Yes | Yes | 
| x8g.48xlarge | Yes | Yes | 
| x8g.metal-24xl | Yes | Yes | 
| x8g.metal-48xl | Yes | Yes | 
| 存储优化 | 
| --- |
| i7ie.48xlarge | Yes | Yes | 
| i7ie.metal-48xl | Yes | Yes | 
| i8g.48xlarge | Yes | Yes | 
| i8g.metal-48xl | Yes | Yes | 
| 加速计算 | 
| --- |
| p5en.48xlarge | Yes | Yes | 
| p6e-gb200.36xlarge | Yes | Yes | 
| trn2.3xlarge | Yes | Yes | 
| trn2.48xlarge | Yes | Yes | 
| trn2u.48xlarge | Yes | Yes | 
| 高性能计算 | 
| --- |
| hpc7g.4xlarge | Yes | No | 
| hpc7g.8xlarge | Yes | No | 
| hpc7g.16xlarge | Yes | No | 

------
#### [ Nitro v4 (EFA v2) ]


| 实例类型 | RDMA 读取支持 | RDMA 写入支持 | 
| --- |--- |--- |
| 通用 | 
| --- |
| m6a.48xlarge | Yes | Yes | 
| m6a.metal | Yes | Yes | 
| m6i.32xlarge | Yes | Yes | 
| m6i.metal | Yes | Yes | 
| m6id.32xlarge | Yes | Yes | 
| m6id.metal | Yes | Yes | 
| m6idn.32xlarge | Yes | Yes | 
| m6idn.metal | Yes | Yes | 
| m6in.32xlarge | Yes | Yes | 
| m6in.metal | Yes | Yes | 
| m7a.48xlarge | Yes | Yes | 
| m7a.metal-48xl | Yes | Yes | 
| m7g.16xlarge | Yes | Yes | 
| m7g.metal | Yes | Yes | 
| m7gd.16xlarge | Yes | Yes | 
| m7gd.metal | Yes | Yes | 
| m7i.48xlarge | Yes | Yes | 
| m7i.metal-48xl | Yes | Yes | 
| 计算优化 | 
| --- |
| c6a.48xlarge | Yes | Yes | 
| c6a.metal | Yes | Yes | 
| c6gn.16xlarge | Yes | Yes | 
| c6i.32xlarge | Yes | Yes | 
| c6i.metal | Yes | Yes | 
| c6id.32xlarge | Yes | Yes | 
| c6id.metal | Yes | Yes | 
| c6in.32xlarge | Yes | Yes | 
| c6in.metal | Yes | Yes | 
| c7a.48xlarge | Yes | Yes | 
| c7a.metal-48xl | Yes | Yes | 
| c7g.16xlarge | Yes | Yes | 
| c7g.metal | Yes | Yes | 
| c7gd.16xlarge | Yes | Yes | 
| c7gd.metal | Yes | Yes | 
| c7i.48xlarge | Yes | Yes | 
| c7i.metal-48xl | Yes | Yes | 
| 内存优化 | 
| --- |
| r6a.48xlarge | Yes | Yes | 
| r6a.metal | Yes | Yes | 
| r6i.32xlarge | Yes | Yes | 
| r6i.metal | Yes | Yes | 
| r6id.32xlarge | Yes | Yes | 
| r6id.metal | Yes | Yes | 
| r6idn.32xlarge | Yes | Yes | 
| r6idn.metal | Yes | Yes | 
| r6in.32xlarge | Yes | Yes | 
| r6in.metal | Yes | Yes | 
| r7a.48xlarge | Yes | Yes | 
| r7a.metal-48xl | Yes | Yes | 
| r7g.16xlarge | Yes | Yes | 
| r7g.metal | Yes | Yes | 
| r7gd.16xlarge | Yes | Yes | 
| r7gd.metal | Yes | Yes | 
| r7i.48xlarge | Yes | Yes | 
| r7i.metal-48xl | Yes | Yes | 
| r7iz.32xlarge | Yes | Yes | 
| r7iz.metal-32xl | Yes | Yes | 
| u7i-6tb.112xlarge | Yes | Yes | 
| u7i-8tb.112xlarge | Yes | Yes | 
| u7i-12tb.224xlarge | Yes | Yes | 
| u7in-16tb.224xlarge | Yes | Yes | 
| u7in-24tb.224xlarge | Yes | Yes | 
| u7in-32tb.224xlarge | Yes | Yes | 
| u7inh-32tb.480xlarge | Yes | Yes | 
| x2idn.32xlarge | Yes | Yes | 
| x2idn.metal | Yes | Yes | 
| x2iedn.32xlarge | Yes | Yes | 
| x2iedn.metal | Yes | Yes | 
| 存储优化 | 
| --- |
| i4g.16xlarge | Yes | Yes | 
| i4i.32xlarge | Yes | Yes | 
| i4i.metal | Yes | Yes | 
| i7i.24xlarge | Yes | Yes | 
| i7i.48xlarge | Yes | Yes | 
| i7i.metal-48xl | Yes | Yes | 
| im4gn.16xlarge | Yes | Yes | 
| 加速计算 | 
| --- |
| f2.48xlarge | Yes | Yes | 
| g6.8xlarge | Yes | Yes | 
| g6.12xlarge | Yes | Yes | 
| g6.16xlarge | Yes | Yes | 
| g6.24xlarge | Yes | Yes | 
| g6.48xlarge | Yes | Yes | 
| g6e.8xlarge | Yes | Yes | 
| g6e.12xlarge | Yes | Yes | 
| g6e.16xlarge | Yes | Yes | 
| g6e.24xlarge | Yes | Yes | 
| g6e.48xlarge | Yes | Yes | 
| gr6.8xlarge | Yes | Yes | 
| p5.4xlarge | Yes | Yes | 
| p5.48xlarge | Yes | Yes | 
| p5e.48xlarge | Yes | Yes | 
| trn1.32xlarge | Yes | Yes | 
| trn1n.32xlarge | Yes | Yes | 
| 高性能计算 | 
| --- |
| hpc6a.48xlarge | Yes | Yes | 
| hpc6id.32xlarge | Yes | Yes | 
| hpc7a.12xlarge | Yes | Yes | 
| hpc7a.24xlarge | Yes | Yes | 
| hpc7a.48xlarge | Yes | Yes | 
| hpc7a.96xlarge | Yes | Yes | 

------
#### [ Nitro v3 (EFA v1) ]


| 实例类型 | RDMA 读取支持 | RDMA 写入支持 | 
| --- |--- |--- |
| 通用 | 
| --- |
| m5dn.24xlarge | No | No | 
| m5dn.metal | No | No | 
| m5n.24xlarge | No | No | 
| m5n.metal | No | No | 
| m5zn.12xlarge | No | No | 
| m5zn.metal | No | No | 
| 计算优化 | 
| --- |
| c5n.9xlarge | No | No | 
| c5n.18xlarge | No | No | 
| c5n.metal | No | No | 
| 内存优化 | 
| --- |
| r5dn.24xlarge | No | No | 
| r5dn.metal | No | No | 
| r5n.24xlarge | No | No | 
| r5n.metal | No | No | 
| x2iezn.12xlarge | No | No | 
| x2iezn.metal | No | No | 
| 存储优化 | 
| --- |
| i3en.12xlarge | No | No | 
| i3en.24xlarge | No | No | 
| i3en.metal | No | No | 
| 加速计算 | 
| --- |
| dl2q.24xlarge | No | No | 
| g4dn.8xlarge | No | No | 
| g4dn.12xlarge | No | No | 
| g4dn.16xlarge | No | No | 
| g4dn.metal | No | No | 
| g5.8xlarge | No | No | 
| g5.12xlarge | No | No | 
| g5.16xlarge | No | No | 
| g5.24xlarge | No | No | 
| g5.48xlarge | No | No | 
| inf1.24xlarge | No | No | 
| p3dn.24xlarge | No | No | 
| p4d.24xlarge | Yes | No | 
| p4de.24xlarge | Yes | No | 
| vt1.24xlarge | No | No | 
| 上一代 | 
| --- |
| p3dn.24xlarge | No | No | 

------

**查看特定区域中支持 EFA 的可用实例类型**  
可用的实例类型因区域而异。要查看某个区域中支持 EFA 的可用实例类型，请使用带 `--region` 参数的 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令。包括 `--filters` 参数以将结果范围限定为支持 EFA 的实例类型，并包括 `--query` 参数以将输出范围限定为 `InstanceType` 的值。

```
aws ec2 describe-instance-types \
    --region {{us-east-1}}  \
    --filters Name=network-info.efa-supported,Values=true \
    --query "InstanceTypes[*].[InstanceType]"  \
    --output text | sort
```

## 支持的操作系统
<a name="efa-os"></a>

操作系统支持因处理器类型而异。下表显示支持的操作系统。


| 操作系统 | Intel/AMD（`x86_64`）实例类型 | AWS Graviton（`arm64`）实例类型 | 
| --- | --- | --- | 
| Amazon Linux 2023 | ✓ | ✓ | 
| RHEL 8、9 和 10 | ✓ | ✓ | 
| Debian 11、12 和 13 | ✓ | ✓ | 
| Rocky Linux 8 和 9 | ✓ | ✓ | 
| Ubuntu 22.04、24.04 和 26.04 | ✓ | ✓ | 
| SUSE Linux Enterprise 15 SP2 和更高版本 | ✓ | ✓ | 

**注意**  
Intel MPI 可能不支持部分列出的操作系统。如果您使用的是 Intel MPI，请参阅 [Intel MPI 文档](https://www.intel.com/content/www/us/en/developer/articles/system-requirements/mpi-library-system-requirements.html)验证是否您的操作系统是否受支持。

## EFA 限制
<a name="efa-limits"></a>

EFA 具有以下限制：
+ 并非所有实例类型都支持 RDMA 写入。有关更多信息，请参阅 [支持的实例类型](#efa-instance-types)。
+ 目前不支持 P4d/P4de/DL1 实例与其他实例类型之间的 EFA 流量1。
+ [支持多个网卡的实例类型](using-eni.md#network-cards)可以为每个网卡配置一个 EFA。所有其他支持的实例类型每个实例仅支持一个 EFA。
+ `c7g.16xlarge`、`m7g.16xlarge` 和 `r7g.16xlarge`，当附加 EFA 时，不支持专用实例和专属主机。
+ EFA 流量1无法跨越可用区或 VPC。这不适用于来自 EFA 接口的 ENA 设备的正常 IP 流量。
+ 无法路由 EFA 流量1。仍然可以路由来自 EFA 接口的 ENA 设备的普通 IP 流量。
+ AWS Outposts 上不支持 EFA。
+ 仅在基于 AWS Cloud Digital Interface 软件开发工具包（AWS CDI SDK）的应用程序的 Windows 实例上支持 EFA（带 ENA 的 EFA）接口的 EFA 设备。如果您将 EFA（带 ENA 的 EFA）接口附加到基于非 CDI SDK 的应用程序的 Windows 实例，则该接口将充当 ENA 接口，而没有任何附加 EFA 设备功能。Windows 或 Linux 上基于 AWS CDI 的应用程序不支持仅限 EFA 的接口。有关更多信息，请参阅 [AWS Cloud Digital Interface 软件开发工具包（AWS CDI SDK）用户指南](https://docs.aws.amazon.com/CDI-SDK/latest/ug/what-is.html)。

1*EFA 流量*是指通过 EFA（带 ENA 的 EFA）或仅限 EFA 接口的 EFA 设备传输的流量。

## EFA 定价
<a name="efa-pricing"></a>

EFA 作为一项可选的 Amazon EC2 联网功能提供，您可以在任何支持的实例上启用该功能，无需支付额外费用。


# 辅助网络
<a name="secondary-networks"></a>

辅助网络是专为特殊网络使用案例构建的虚拟网络。这些网络在 AWS 云的各个分区内在逻辑上相互隔离。您可以在辅助网络中创建辅助子网之类的资源。辅助网络与 Amazon VPC 紧密关联，因此特定的实例会被设置为多网段连接，并同时部署在 VPC 和辅助网络中。

辅助网络目前可用于特定实例类型，并且需要通过长期承诺的容量预留方式来使用。如果您认为使用辅助网络可能对您的工作负载有所帮助，请联系您的客户团队获取更多信息。

**Topics**
+ [什么是辅助网络？](#secondary-networks-overview)
+ [重要概念](#secondary-networks-concepts)
+ [架构](#secondary-networks-architecture)
+ [其他注意事项](#secondary-networks-considerations)
+ [开始使用](#secondary-networks-getting-started)
+ [管理辅助网络资源](#secondary-networks-managing-resources)
+ [网络设计最佳实践](#secondary-networks-best-practices)
+ [问题排查](#secondary-networks-troubleshooting)
+ [限额和限制](#secondary-networks-quotas-limits)

## 什么是辅助网络？
<a name="secondary-networks-overview"></a>

辅助网络提供了一个与 VPC 网络结合使用的逻辑隔离网络，因此实例能够同时接入两个独立的网络。辅助网络的优势包括：
+ 适用于特定使用案例和协议（如用于机器学习工作负载的东西向连接）的高性能网络解决方案
+ 具有逻辑隔离功能的多租户支持
+ 实例与 VPC 和 AWS 服务无缝集成

## 重要概念
<a name="secondary-networks-concepts"></a>

辅助网络  
一种区域网络构造，它提供逻辑第 3 层网络，并采用 IPv4 CIDR 数据块（范围从 /28 到 /12）。辅助网络在物理分隔的网络基础设施上独立于 VPC 运行。

辅助子网  
辅助网络中特定于某个可用区的构造，类似于 VPC 子网。辅助子网支持范围从 /28 到 /12 的 CIDR 数据块。

辅助接口  
连接到辅助网卡的网络接口，用于在辅助子网内实现东西向连接。这些接口在物理和逻辑上与弹性网络接口（ENI）互相分隔。

## 架构
<a name="secondary-networks-architecture"></a>

支持辅助网络的 EC2 实例是多网段的，这意味着它们能够同时在 VPC 和辅助网络之间进行通信：
+ **VPC**：提供与 AWS 服务、存储、数据库、网络服务和互联网的南北向 TCP/IP 连接
+ **辅助网络**：在支持的专用实例之间提供东西向连接

## 其他注意事项
<a name="secondary-networks-considerations"></a>
+ 辅助接口通过 RunInstances 进行管理，它们不能单独创建或删除。
+ 实例启动后，辅助接口便无法再进行连接或分离。
+ 辅助接口 IP 地址一旦启动便无法更改。
+ 辅助网络不支持安全组、NACL、流日志等 VPC 功能。

## 开始使用
<a name="secondary-networks-getting-started"></a>

### 先决条件
<a name="secondary-networks-prerequisites"></a>

在使用辅助网络启动实例之前，请确保您已在目标区域内配置您的 VPC，并在 EC2 容量的目标可用区中配置子网。

### 步骤 1：创建辅助网络
<a name="secondary-networks-create-network"></a>

创建与 VPC 在同一区域的辅助网络。这是一种区域性资源，能够为您的 RDMA 流量提供逻辑隔离。

```
aws ec2 create-secondary-network \
  --network-type rdma \
  --ipv4-cidr-block 172.31.0.0/16 \
  --region us-east-2
```

**参数**
+ `--network-type`；网络类型（目前仅支持 rdma）
+ `--ipv4-cidr-block`：介于 /28 和 /12 之间的 IPv4 CIDR 数据块
+ `--region`：AWS 区域（US-East-2）

**注意**  
**最佳实践**：选择与您的 VPC CIDR 不重叠的 CIDR 数据块，以便在实例层面简化路由操作。

### 步骤 2：创建辅助子网
<a name="secondary-networks-create-subnet"></a>

在与您的 VPC 子网相同的可用区中创建辅助子网。这是特定于可用区的资源。

```
aws ec2 create-secondary-subnet \
  --secondary-network-id sn-1234567890abcdef0 \
  --ipv4-cidr-block 172.31.24.0/24 \
  --availability-zone us-east-2a
```

**注意**  
**IP 地址预留**：与 VPC 子网一样，Amazon 为每个辅助子网预留了前 4 个 IP 地址和最后一个 IP 地址，供内部使用。

### 步骤 3：启动实例
<a name="secondary-networks-launch-instance"></a>

在您的 VPC 子网和辅助子网中同时启动实例。该实例将具有多网连接功能，能够与两个网络实现连接。

```
aws ec2 run-instances \
  --image-id ami-12345678 \
  --count 1 \
  --instance-type <instance> \
  --key-name MyKeyPair \
  --instance-market-options '{"MarketType": "capacity-block"}' \
  --capacity-reservation-specification '{"CapacityReservationTarget": \
  {"CapacityReservationId": "cr-1234567890abcdef0"}}' \
  --network-interfaces \ 
    "NetworkCardIndex=0,DeviceIndex=0,Groups=sg-12345678,\
    SubnetId=subnet-0987654321fedcba0,InterfaceType=interface" \
  --secondary-interfaces \
    "NetworkCardIndex=1,DeviceIndex=0,SecondarySubnetId=ss-98765421yxz,\
    InterfaceType=secondary,PrivateIpAddressCount=1,DeleteOnTermination=true", \
    "NetworkCardIndex=2,DeviceIndex=0,SecondarySubnetId=ss-98765421yxz,\
    InterfaceType=secondary,PrivateIpAddressCount=1,DeleteOnTermination=true", \
    "NetworkCardIndex=3,DeviceIndex=0,SecondarySubnetId=ss-98765421yxz,\
    InterfaceType=secondary,PrivateIpAddressCount=1,DeleteOnTermination=true", \
    "NetworkCardIndex=4,DeviceIndex=0,SecondarySubnetId=ss-98765421yxz,\
    InterfaceType=secondary,PrivateIpAddressCount=1,DeleteOnTermination=true", \
    "NetworkCardIndex=5,DeviceIndex=0,SecondarySubnetId=ss-98765421yxz,\
    InterfaceType=secondary,PrivateIpAddressCount=1,DeleteOnTermination=true", \
    "NetworkCardIndex=6,DeviceIndex=0,SecondarySubnetId=ss-98765421yxz,\
    InterfaceType=secondary,PrivateIpAddressCount=1,DeleteOnTermination=true", \
    "NetworkCardIndex=7,DeviceIndex=0,SecondarySubnetId=ss-98765421yxz,\
    InterfaceType=secondary,PrivateIpAddressCount=1,DeleteOnTermination=true", \
    "NetworkCardIndex=8,DeviceIndex=0,SecondarySubnetId=ss-98765421yxz,\
    InterfaceType=secondary,PrivateIpAddressCount=1,DeleteOnTermination=true"
```

**关键参数：**
+ `--network-interfaces`：指定用于 VPC 连接的主 Nitro ENI（网卡索引 0）
+ `--secondary-interfaces`：为辅助子网内的东西向连接指定 8 个辅助接口（网卡索引 1-8）
+ `InterfaceType=secondary`：表示辅助接口

## 管理辅助网络资源
<a name="secondary-networks-managing-resources"></a>

### 描述辅助网络
<a name="secondary-networks-describe-networks"></a>

查看有关辅助网络的详细信息：

```
aws ec2 describe-secondary-networks \
  --secondary-network-id sn-1234567890abcdef0
```

### 描述辅助子网
<a name="secondary-networks-describe-subnets"></a>

查看有关辅助子网的详细信息：

```
aws ec2 describe-secondary-subnets \
  --secondary-subnet-id ss-98765421yxz
```

### 描述辅助接口
<a name="secondary-networks-describe-interfaces"></a>

查看有关连接到您的实例的辅助网络接口的详细信息：

```
aws ec2 describe-secondary-interfaces \
  --filters "Name=attachment.instance-id,Values=i-1234567890abcdef0"
```

### 删除资源
<a name="secondary-networks-deleting-resources"></a>

删除辅助子网：

```
aws ec2 delete-secondary-subnet \
  --secondary-subnet-id ss-98765421yxz
```

删除辅助网络：

```
aws ec2 delete-secondary-network \
  --secondary-network-id sn-1234567890abcdef0
```

**重要**  
在删除辅助网络之前，您必须先终止所有实例并删除所有辅助子网。

## 网络设计最佳实践
<a name="secondary-networks-best-practices"></a>

### CIDR 规划
<a name="secondary-networks-cidr-planning"></a>

**避免 CIDR 重叠**：尽管从物理层面上讲，辅助网络与 VPC 是相互隔离的，但使用不重叠的 CIDR 数据块可以简化实例操作系统层面的路由配置。

**注意**  
Amazon 为每个子网预留 5 个 IP 地址。

### 流量分割
<a name="secondary-networks-traffic-segregation"></a>

**按辅助网络分割**：为不同的项目、团队或安全边界创建单独的辅助网络。辅助网络实现了不同实例之间的逻辑隔离。实例无法在不同辅助网络之间进行通信。

**使用多个子网**：在辅助网络中，使用多个辅助子网按 GPU 索引、可用区或工作负载类型分割流量。例如，一种常见的架构模式是部署单个辅助网络，该网络包含 4 个或 8 个辅助子网，其中每个辅助子网都与一组具有相同索引的 GPU 相对应。

## 问题排查
<a name="secondary-networks-troubleshooting"></a>

### 实例启动失败
<a name="secondary-networks-launch-failures"></a>

**问题**：使用辅助网络接口启动实例失败。

**解决方案**：
+ 验证您的 AMI 是否包含适当的驱动程序支持
+ 确保您的辅助子网有足够的可用 IP 地址
+ 确认您的容量预留处于“活动”状态
+ 检查您的辅助子网是否与您的 VPC 子网位于相同的可用区中

### 连接问题
<a name="secondary-networks-connectivity-issues"></a>

**问题**：无法在各实例之间建立 RDMA 连接。

**解决方案**：
+ 确认所有实例都处于同一个辅助网络和辅助子网中
+ 检查实例上是否正确加载了辅助接口驱动程序
+ 确保您的应用程序绑定到正确的网络接口
+ 同一辅助子网内的实例可通过直接路由进行访问。跨子网通信可通过由 DHCP 分配的静态路由实现。

### API 错误
<a name="secondary-networks-api-errors"></a>

**问题**：辅助网络和辅助子网操作的 API 调用失败。

**解决方案**：
+ 验证 ec2:CreateSecondaryNetwork、ec2:CreateSecondarySubnet 的 IAM 权限。
+ 检查 CIDR 数据块是否在支持的范围内（/28 到 /12）
+ 确认您在使用正确的区域和可用区

## 限额和限制
<a name="secondary-networks-quotas-limits"></a>

要申请提高配额，您可以使用 AWS 服务配额或联系 AWS Support。


**辅助网络配额和限制**  

| 资源 | 限制 | 可调整 | 
| --- | --- | --- | 
| 每个区域的辅助网络数 | 5 | 是 | 
| 每个辅助网络的辅助子网数 | 200 | 是 | 
| CIDR 数据块大小 | /28 至 /12 | 否 | 
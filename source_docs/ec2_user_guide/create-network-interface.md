

# 为 Amazon EC2 实例创建网络接口
<a name="create-network-interface"></a>

您可以创建一个网络接口供您的 EC2 实例使用。创建网络接口时，需要指定创建该接口的子网。您不能在创建网络接口之后将其移动至另一子网。您必须将网络接口连接到同一可用区中的实例。您可以从实例中分离辅助网络接口，然后将其附加到同一可用区中的其他实例。您无法将主网络接口与实例分离。有关更多信息，请参阅 [EC2 实例的网络接口连接](network-interface-attachments.md)。

------
#### [ Console ]

**创建网络接口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Network Interfaces**。

1. 选择**创建网络接口**。

1. （可选）对于**描述**，请输入一个描述性的名称。

1. 对于 **Subnet (子网)**，选择一个子网。后续步骤中可用的选项根据您选择的子网类型（仅 IPv4、仅 IPv6 或双堆栈（IPv4 和 IPv6））而有所变化。

1. 对于**集成类型**，请选择下列选项之一：
   + **ENA**：一种高性能网络接口，旨在满足高吞吐量和每秒数据包速率的 TCP/IP 协议处理需求，同时尽可能降低 CPU 使用率。这是默认值。有关更多信息，请参阅[弹性网络适配器](enhanced-networking-ena.md)。
   + **带 ENA 的 EFA**：一种同时支持 ENA 和 EFA 设备的网络接口，用于传统基于 TCP/IP 的传输以及基于 SRD 的传输。如果选择带 ENA 的 EFA，则挂载该接口的实例必须[支持 EFA](efa.md#efa-instance-types)。有关 EFA 的更多信息，请参阅 [Elastic Fabric Adapter](efa.md)。
   + **仅 EFA**：一种高性能网络接口，旨在满足基于 SRD 的传输对高吞吐量、低延迟节点间通信的处理需求，同时避开操作系统堆栈。如果选择此选项，则挂载该接口的实例必须[支持 EFA](efa.md#efa-instance-types)。仅 EFA 网络接口不支持 IP 地址。有关 EFA 的更多信息，请参阅 [Elastic Fabric Adapter](efa.md)。

1. 对于**私有 IPv4 地址**，执行以下操作之一：
   + 选择**自动分配**允许 Amazon EC2 从子网中选择 IPv4 地址。
   + 选择**自定义**然后输入从子网中选择的 IPv4 地址。

1. （仅具有 IPv6 地址的子网）对于 **IPv6 地址**，请执行以下操作之一：
   + 如果您不想为网络接口分配 IPv6 地址，选择**没有**。
   + 选择**自动分配**允许 Amazon EC2 从子网中选择 IPv6 地址。
   + 选择**自定义**然后输入从子网中选择的 IPv6 地址。

1. （可选）如果您在双栈或仅使用 IPv6 的子网中创建网络接口，则可以选择**分配主要 IPv6 IP**。这将为网络接口分配一个主 IPv6 全局单播地址（GUA）。分配主要 IPv6 地址使您能够避免中断实例或 ENI 的流量。如果此 ENI 要连接至的实例依赖于其 IPv6 地址不变，则选择**启用**。AWS 会自动将与您的实例连接的 ENI 相关联 IPv6 地址分配为主要 IPv6 地址。一旦将 IPv6 GUA 地址启用为主要 IPv6，您将无法将其禁用。当您将 IPv6 GUA 地址启用为主要 IPv6 时，第一个 IPv6 GUA 将成为主要 IPv6 地址，直到实例终止或网络接口断开为止。如果您有多个 IPv6 地址与连接到实例的 ENI 相关联，并且启用了主要 IPv6 地址，则与该 ENI 关联的第一个 IPv6 GUA 地址将成为主要 IPv6 地址。

1. （可选）要创建 Elastic Fabric Adapter，请选择 **Elastic Fabric Adapter**，**启用**。

1. （可选）在**高级设置**下，您可以选择设置 IP 前缀委托。有关更多信息，请参阅 [前缀委派](ec2-prefix-eni.md)。
   + **自动分配**：AWS 从子网的 IPv4 或 IPv6 CIDR 块中选择前缀，并将其分配给该网络接口。
   + **手动分配**：您可以从子网的 IPv4 或 IPv6 CIDR 块中指定前缀，AWS 会在将该前缀分配给网络接口之前，验证其是否尚未分配给其他资源。

1. （可选）在**高级设置**下，对于**空闲连接跟踪超时**，请修改默认的空闲连接超时。有关更多信息，请参阅 [空闲连接跟踪超时](security-group-connection-tracking.md#connection-tracking-timeouts)。
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

1. 对于 **Security groups**，选择一个或多个安全组。

1. （可选）对于每个标签，请选择**添加新标签**，然后输入标签键和可选的标签值。

1. 选择**创建网络接口**。

------
#### [ AWS CLI ]

**示例 1：使用 Amazon EC2 选择的 IP 地址创建网络接口**  
使用以下 [create-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-network-interface.html) 命令。此示例将使用 Amazon EC2 选择的一个公有 IPv4 地址和一个 IPv6 地址创建一个网络接口。

```
aws ec2 create-network-interface \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --description "{{my dual-stack network interface}}" \
    --ipv6-address-count {{1}} \
    --groups {{sg-1234567890abcdef0}}
```

**示例 2：使用特定的 IP 地址创建网络接口**  
使用以下 [create-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-network-interface.html) 命令。

```
aws ec2 create-network-interface \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --description "{{my dual-stack network interface}}" \
    --private-ip-address {{10.251.50.12}} \
    --ipv6-addresses {{2001:db8::1234:5678:1.2.3.4}} \
    --groups {{sg-1234567890abcdef0}}
```

**示例 3：使用一组辅助 IP 地址创建网络接口**  
使用以下 [create-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-network-interface.html) 命令。在此示例中，Amazon EC2 选择了主 IP 地址和若干辅助 IP 地址。

```
aws ec2 create-network-interface \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --description "{{my network interface}}" \
    --secondary-private-ip-address-count {{2}} \
    --groups {{sg-1234567890abcdef0}}
```

**示例 4：使用特定的辅助 IP 地址创建网络接口**  
使用以下 [create-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-network-interface.html) 命令。此示例会指定一个主 IP 地址和一个辅助 IP 地址。

```
aws ec2 create-network-interface \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --description "{{my network interface}}" \
    --private-ip-addresses PrivateIpAddress={{10.0.1.30}},Primary=true \
                           PrivateIpAddress={{10.0.1.31}},Primary=false
    --groups {{sg-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**示例 1：使用 Amazon EC2 选择的 IP 地址创建网络接口**  
使用 [New-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2NetworkInterface.html) cmdlet。此示例将使用 Amazon EC2 选择的一个公有 IPv4 地址和一个 IPv6 地址创建一个网络接口。

```
New-EC2NetworkInterface `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -Description "{{my dual-stack network interface}}" `
    -Ipv6AddresCount {{1}} `
    -Group {{sg-1234567890abcdef0}}
```

**示例 2：使用特定的 IP 地址创建网络接口**  
使用 [New-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2NetworkInterface.html) cmdlet。

```
New-EC2NetworkInterface `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -Description "{{my dual-stack network interface}}" `
    -PrivateIpAddress {{10.251.50.12}} `
    -Ipv6Address $ipv6addr `
    -Group {{sg-1234567890abcdef0}}
```

按如下所示定义 IPv6 地址。

```
$ipv6addr = New-Object Amazon.EC2.Model.InstanceIpv6Address
$ipv6addr1.Ipv6Address = "{{2001:db8::1234:5678:1.2.3.4}}"
```

**示例 3：使用一组辅助 IP 地址创建网络接口**  
使用 [New-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2NetworkInterface.html) cmdlet。在此示例中，Amazon EC2 选择了主 IP 地址和若干辅助 IP 地址。

```
New-EC2NetworkInterface `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -Description "{{my network interface}}" `
    -SecondaryPrivateIpAddressCount {{2}} `
    -Group {{sg-1234567890abcdef0}}
```

**示例 4：使用特定的辅助 IP 地址创建网络接口**  
使用 [New-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2NetworkInterface.html) cmdlet。此示例会指定一个主 IP 地址和一个辅助 IP 地址。

```
New-EC2NetworkInterface `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -Description "{{my network interface}}" `
    -PrivateIpAddresses @($primary, $secondary) `
    -Group {{sg-1234567890abcdef0}}
```

按如下所示定义辅助地址。

```
$primary = New-Object Amazon.EC2.Model.PrivateIpAddressSpecification
$primary.PrivateIpAddress = "{{10.0.1.30}}"
$primary.Primary = $true
$secondary = New-Object Amazon.EC2.Model.PrivateIpAddressSpecification
$secondary.PrivateIpAddress = "{{10.0.1.31}}"
$secondary.Primary = $false
```

------
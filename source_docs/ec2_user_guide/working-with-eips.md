

# 将弹性 IP 地址与实例关联
<a name="working-with-eips"></a>

分配弹性 IP 地址后，您可以将其与 EC2 实例、NAT 网关或网络负载均衡器等 AWS 资源关联。要在稍后将弹性 IP 地址与其他 AWS 资源关联，您可以将其与当前资源取消关联，然后将其与新资源关联。

**Topics**
+ [分配弹性 IP 地址](#using-instance-addressing-eips-allocating)
+ [关联弹性 IP 地址](#using-instance-addressing-eips-associating)
+ [解除弹性 IP 地址的关联](#using-instance-addressing-eips-associating-different)

## 分配弹性 IP 地址
<a name="using-instance-addressing-eips-allocating"></a>

您可以分配弹性 IP 地址以在区域中使用。所有正在使用（已与 EC2 实例等资源关联）和闲置（已在您的账户中创建但未关联）的弹性 IP 地址都会产生费用。

------
#### [ Console ]

**分配弹性 IP 地址**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Network & Security**（网络与安全）下的**Elastic IPs**（弹性 IP）。

1. 选择 **Allocate Elastic IP address (分配弹性 IP 地址)**。

1. （可选）分配弹性 IP 地址（EIP）时，您可以选择要在其中分配 EIP 的**网络边界组**。网络边界组是一组可用区（AZ）、Local Zones 或 Wavelength Zones（AWS 可从中公告公有 IP 地址）。Local Zones 和 Wavelength Zones 的网络边界组可能与区域中的可用区不同，以确保 AWS 网络与访问这些区域中资源的客户之间保持最低延迟或最短物理距离。
**重要**  
您必须在将与该 EIP 关联的 AWS 资源所在的网络边界组中分配一个 EIP。一个网络边界组中的 EIP 只能在该网络边界组中的区域内公告，而不能在由其他网络边界组代表的任何其他区域内公告。

   如果您启用 Local Zones 或 Wavelength Zones（有关更多信息，请参阅[启用 Local Zone](https://docs.aws.amazon.com/local-zones/latest/ug/getting-started.html#getting-started-find-local-zone) 或[启用 Wavelength Zones](https://docs.aws.amazon.com/wavelength/latest/developerguide/get-started-wavelength.html#enable-zone-group)），则可以为可用区、Local Zones 或 Wavelength Zones 选择网络边界组。请谨慎选择网络边界组，因为 EIP 及其关联的 AWS 资源必须位于同一个网络边界组中。您可以使用 EC2 控制台查看可用区、本地区或 Wavelength 区所在的网络边界组。通常，一个区域中的所有可用区都属于同一个网络边界组，而 Local Zones 或 Wavelength Zones 则属于各自独立的网络边界组。

   如果您未启用 Local Zones 或 Wavelength Zones，则在分配 EIP 时，系统会为您预定义代表该区域所有可用区（例如 `us-west-2`）的网络边界组，并且您无法对其进行更改。这意味着您分配给该网络边界组的 EIP 将在您所属区域的所有可用区中公告。

1. 对于**Public IPv4 address pool**（公有 IPv4 地址池），选择以下选项之一：
   + **Amazon 的 IPv4 地址池**—如果要从 Amazon 的 IPv4 地址池中分配 IPv4 地址。
   + **引入 AWS 账户的公有 IPv4 地址** – 如果您想从已引入到 AWS 账户的 IP 地址池中分配一个不连续（非顺序）的 IPv4 地址。如果您没有任何 IP 地址池，则此选项将被禁用。有关将您自己的 IP 地址范围引入到您 AWS 账户的更多信息，请参阅 [自带 IP 地址（BYOIP）到 Amazon EC2](ec2-byoip.md)。
   + **Customer owned pool of IPv4 addresses (客户拥有的 IPv4 地址池)** – 如果要从在本地网络创建的池中分配 IPv4 地址以供 AWS Outpost 使用。如果您没有 AWS Outpost，则此选项将被禁用。
   + **使用 IPAM IPv4 池进行分配**：如果您想从 IPAM 池中连续的公有 IPv4 块中分配连续的弹性 IP 地址。分配连续的弹性 IP 地址可以显著减少安全访问控制列表的管理开销，简化在 AWS 上扩展的企业的 IP 地址分配和跟踪工作。有关更多信息，请参阅《Amazon VPC IPAM User Guide》**中的 [Allocate sequential Elastic IP addresses from an IPAM pool](https://docs.aws.amazon.com/vpc/latest/ipam/tutorials-eip-pool.html)。

1. （可选）要添加标签，请选择**添加新标签**，然后输入标签键和标签值。

------
#### [ AWS CLI ]

**分配弹性 IP 地址**  
使用 [allocate-address](https://docs.aws.amazon.com/cli/latest/reference/ec2/allocate-address.html) AWS CLI 命令。

在以下示例中，Amazon EC2 从 Amazon 的地址池中选择地址。

```
aws ec2 allocate-address
```

在以下示例中，Amazon EC2 从您通过 BYOIP 引入 AWS 的指定地址池中选择地址。

```
aws ec2 allocate-address \
    --public-ipv4-pool {{ipv4pool-ec2-012345abcdef67890}}
```

以下示例指定来自指定 IPv4 IPAM 地址池的地址。

```
aws ec2 allocate-address \
    --ipam-pool-id {{ipam-pool-1234567890abcdef0}} \
    --address {{192.0.2.0}}
```

------
#### [ PowerShell ]

**分配弹性 IP 地址**  
使用 [New-EC2Address](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Address.html) cmdlet。

在以下示例中，Amazon EC2 从 Amazon 的地址池中选择地址。

```
New-EC2Address
```

在以下示例中，Amazon EC2 从您通过 BYOIP 引入 AWS 的指定地址池中选择地址。

```
New-EC2Address `
    -PublicIpv4Pool {{ipv4pool-ec2-012345abcdef67890}}
```

以下示例指定来自指定 IPv4 IPAM 地址池的地址。

```
New-EC2Address `
    -IpamPoolId {{ipam-pool-1234567890abcdef0}} `
    -Address {{192.0.2.0}}
```

------

## 关联弹性 IP 地址
<a name="using-instance-addressing-eips-associating"></a>

如果要将弹性 IP 地址与您的实例关联以启用与 Internet 的通信，您还必须确保您的实例在公有子网中。有关更多信息，请参阅《Amazon VPC 用户指南》**中的[使用互联网网关启用 VPC 互联网访问](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)。

------
#### [ Console ]

**要关联弹性 IP 地址和实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Elastic IPs**。

1. 选择要关联的弹性 IP 地址，然后依次选择 **Actions (操作)**、**Associate Elastic IP address (关联弹性 IP 地址)**。

1. 对于 **Resource type (资源类型)**，选择 **Instance (实例)**。

1. 例如，选择要将弹性 IP 地址关联到的实例。您还可以输入文本以搜索特定实例。

1. （可选）对于 **Private IP address (私有 IP 地址)**，请指定要将弹性 IP 地址关联到的私有 IP 地址。

1. 选择 **Associate**。

**将弹性 IP 地址与网络接口相关联**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Elastic IPs**。

1. 选择要关联的弹性 IP 地址，然后依次选择 **Actions (操作)**、**Associate Elastic IP address (关联弹性 IP 地址)**。

1. 对于 **Resource type** (资源类型)，选择 **Network interface** (网络接口)。

1. 对于 **Network interface (网络接口)**，请选择要将弹性 IP 地址关联到的网络接口。您还可以输入文本来搜索特定网络接口。

1. （可选）对于 **Private IP address (私有 IP 地址)**，请指定要将弹性 IP 地址关联到的私有 IP 地址。

1. 选择 **Associate**。

------
#### [ AWS CLI ]

**关联弹性 IP 地址**  
使用 [associate-address](https://docs.aws.amazon.com/cli/latest/reference/ec2/associate-address.html) AWS CLI 命令。

```
aws ec2 associate-address \
    --instance-id {{i-0b263919b6498b123}} \
    --allocation-id {{eipalloc-64d5890a}}
```

------
#### [ PowerShell ]

**关联弹性 IP 地址**  
使用 [Register-EC2Address](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Address.html) cmdlet。

```
Register-EC2Address `
    -InstanceId {{i-0b263919b6498b123}} `
    -AllocationId {{eipalloc-64d5890a}}
```

------

## 解除弹性 IP 地址的关联
<a name="using-instance-addressing-eips-associating-different"></a>

您可以随时取消弹性 IP 地址与实例或网络接口的关联。取消关联弹性 IP 地址后，您可以将其与其他资源关联。

------
#### [ Console ]

**取消关联和重新关联弹性 IP 地址**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Elastic IPs**。

1. 选择要取消关联的弹性 IP 地址，然后依次选择 **Actions (操作)**、**Disassociate Elastic IP address (取消关联弹性 IP 地址)**。

1. 选择**取消关联**。

------
#### [ AWS CLI ]

**撤销弹性 IP 地址的关联**  
使用 [disassociate-address](https://docs.aws.amazon.com/cli/latest/reference/ec2/disassociate-address.html) AWS CLI 命令。

```
aws ec2 disassociate-address --association-id {{eipassoc-12345678}}
```

------
#### [ PowerShell ]

**撤销弹性 IP 地址的关联**  
使用 [Unregister-EC2Address](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2Address.html) cmdlet。

```
Unregister-EC2Address -AssociationId {{eipassoc-12345678}}
```

------
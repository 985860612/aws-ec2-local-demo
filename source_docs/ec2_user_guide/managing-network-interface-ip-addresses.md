

# 管理网络接口的 IP 地址
<a name="managing-network-interface-ip-addresses"></a>

您可以管理网络接口的以下 IP 地址：
+ 弹性 IP 地址（每个私有 IPv4 地址一个）
+ IPv4 地址
+ IPv6 地址

------
#### [ Console ]

**管理网络接口的 IP 地址**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Network Interfaces**。

1. 选中该网络接口的复选框。

1. 要管理 IPv4 和 IPv6 地址，请执行以下操作：

   1. 依次选择**操作**、**管理 IP 地址**。

   1. 展开网络接口。

   1. 对于 **IPv4 地址**，根据需要编辑 IP 地址。要分配其他 IPv4 地址，请选择**分配新 IP 地址**，然后从子网范围内指定一个 IPv4 地址，或者让 AWS 为您选择一个。

   1. （双栈或仅 IPv6）对于 **IPv6 地址**，请根据需要编辑 IP 地址。要分配其他 IPv6 地址，请选择**分配新 IP 地址**，然后从子网范围内指定一个 IPv6 地址，或者让 AWS 为您选择一个。

   1. 要为网络接口分配或取消分配公有 IPv4 地址，请选择**自动分配公有 IP**。您可以为任何网络接口启用或禁用此选项，但只会影响主网络接口。

   1. （双栈或仅 IPv6）对于 **分配主 IPv6 地址**，请选择**启用**来分配一个主 IPv6 地址。将与该网络接口关联的第一个 GUA 选择为主 IPv6 地址。分配主 IPv6 地址后，您无法对其进行更改。该地址将为主 IPv6 地址，直到实例终止或网络接口分离。

   1. 选择**保存**。

1. 要关联弹性 IP 地址，请执行以下操作：

   1. 依次选择**操作**、**关联地址**。

   1. 对于**弹性 IP 地址**，选择弹性 IP 地址。

   1. 对于**私有 IPv4 地址**，选择要与弹性 IP 地址关联的私有 IPv4 地址。

   1. （可选）如果网络接口当前已与其他实例或网络接口关联，选择**允许重新关联弹性 IP 地址**。

   1. 选择 **Associate**。

1. 要取消关联弹性 IP 地址，请执行以下操作：

   1. 选择 **Actions**、**Disassociate address**。

   1. 对于**公有 IP 地址**，选择弹性 IP 地址。

   1. 选择**取消关联**。

------
#### [ AWS CLI ]

**管理 IPv4 地址**  
使用以下 [assign-private-ip-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/assign-private-ip-addresses.html) 命令分配 IPv4 地址。

```
aws ec2 assign-private-ip-addresses \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --private-ip-addresses {{10.0.0.82}}
```

使用以下 [unassign-private-ip-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/unassign-private-ip-addresses.html) 命令取消分配 IPv4 地址。

```
aws ec2 unassign-private-ip-addresses \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --private-ip-addresses {{10.0.0.82}}
```

**管理 IPv6 地址**  
使用以下 [assign-ipv6-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/assign-ipv6-addresses.html) 命令分配 IPv6 地址。

```
aws ec2 assign-ipv6-addresses \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --ipv6-addresses {{2001:db8:1234:1a00:9691:9503:25ad:1761}}
```

使用以下 [unassign-ipv6-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/unassign-ipv6-addresses.html) 命令取消分配 IPv6 地址。

```
aws ec2 unassign-ipv6-addresses \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --ipv6-addresses {{2001:db8:1234:1a00:9691:9503:25ad:1761}}
```

**管理主私有 IPv4 地址的弹性 IP 地址**  
使用以下 [associate-address](https://docs.aws.amazon.com/cli/latest/reference/ec2/associate-address.html) 命令，将弹性 IP 地址关联到主私有 IPv4 地址。

```
aws ec2 associate-address \
    --allocation-id {{eipalloc-0b263919b6EXAMPLE}} \
    --network-interface-id {{eni-1234567890abcdef0}}
```

使用以下 [disassociate-address](https://docs.aws.amazon.com/cli/latest/reference/ec2/disassociate-address.html) 命令，将弹性 IP 地址与主私有 IPv4 地址取消关联。

```
aws ec2 disassociate-address --association-id {{eipassoc-2bebb745a1EXAMPLE}}
```

------
#### [ PowerShell ]

**管理 IPv4 地址**  
使用 [Register-EC2PrivateIpAddress](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2PrivateIpAddress.html) cmdlet 分配 IPv4 地址。

```
Register-EC2PrivateIpAddress `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -PrivateIpAddress {{10.0.0.82}}
```

使用 [Unregister-EC2PrivateIpAddress](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2PrivateIpAddress.html) cmdlet 取消分配 IPv4 地址。

```
Unregister-EC2PrivateIpAddress `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -PrivateIpAddress {{10.0.0.82}}
```

**管理 IPv6 地址**  
使用 [Register-EC2Ipv6AddressList](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Ipv6AddressList.html) cmdlet 分配 IPv6 地址。

```
Register-EC2Ipv6AddressList `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -Ipv6Address {{2001:db8:1234:1a00:9691:9503:25ad:1761}}
```

使用 [Unregister-EC2Ipv6AddressList](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2Ipv6AddressList.html) cmdlet 取消分配 IPv6 地址。

```
Unregister-EC2Ipv6AddressList `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -Ipv6Address {{2001:db8:1234:1a00:9691:9503:25ad:1761}}
```

**管理主私有 IPv4 地址的弹性 IP 地址**  
使用 [Register-EC2Address](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Address.html) cmdlet，将弹性 IP 地址与主私有 IPv4 地址相关联。

```
Register-EC2Address `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -AllocationId {{eipalloc-0b263919b6EXAMPLE}}
```

使用 [Unregister-EC2Address](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2Address.html) cmdlet，将弹性 IP 地址与主私有 IPv4 地址取消关联。

```
Unregister-EC2Address -AssociationId {{eipassoc-2bebb745a1EXAMPLE}}
```

------
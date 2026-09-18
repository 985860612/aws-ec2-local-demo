

# 管理网络接口的前缀
<a name="work-with-prefixes"></a>

在为网络接口分配前缀时，您可以选择是否让我们自动分配前缀，您也可以指定自定义前缀。如果您让我们自动分配前缀，并且网络接口的子网的子网 CIDR 预留类型为`prefix`，我们会从子网 CIDR 预留中选择前缀。否则，我们会从子网 CIDR 范围中选择它们。

**Topics**
+ [在网络接口创建过程中分配前缀](#assign-auto-creation)
+ [分配前缀至现有网络接口](#assign-auto-existing)
+ [从网络接口中移除前缀](#unassign-prefix)

## 在网络接口创建过程中分配前缀
<a name="assign-auto-creation"></a>

您可以在创建网络接口时分配自动或自定义前缀。

------
#### [ Console ]

**在网络接口创建过程中自动分配前缀**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Network Interfaces**。

1. 选择**创建网络接口**。

1. 输入网络接口的描述，选择要在其中创建网络接口的子网，并配置私有 IPv4 和 IPv6 地址。

1. 展开 **Advanced settings**（高级设置）。

1. 对于 **IPv4 前缀委派**，请执行下列操作之一：
   + 要自动分配 IPv4 前缀，请选择**自动分配**。对于 **IPv4 前缀的数量**，输入要分配的前缀数。
   + 要分配特定 IPv4 前缀，请选择**自定义**。选择**添加新的前缀**，然后输入该前缀。

1. 对于 **IPv6 前缀委派**，请执行下列操作之一：
   + 要自动分配 IPv6 前缀，请选择**自动分配**。对于 **IPv6 前缀的数量**，输入要分配的前缀数。
   + 要分配特定 IPv6 前缀，请选择**自定义**。选择**添加新的前缀**，然后输入该前缀。
**注意**  
**IPv6 prefix delegation**（IPv6 前缀委派）仅当为 IPv6 启用了选定的子网时才会显示。

1. 选择要与网络接口关联的安全组，并根据需要分配资源标签。

1. 选择**创建网络接口**。

------
#### [ AWS CLI ]

**在网络接口创建过程中自动分配 IPv4 前缀**  
使用 [create-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-network-interface.html) 命令并将 `--ipv4-prefix-count` 设置为要让 AWS 分配的 IPv4 前缀数。在下面的示例中，AWS 分配一个 IPv4 前缀。

```
aws ec2 create-network-interface \
    --subnet-id {{subnet-047cfed18eEXAMPLE}} \
    --description "{{IPv4 automatic example}}" \
    --ipv4-prefix-count {{1}}
```

**在网络接口创建过程中分配特定 IPv4 前缀**  
使用 [create-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-network-interface.html) 命令并将 `--ipv4-prefixes` 设置为该前缀范围。AWS 会从此范围中选择 IPv4 地址。在下面的示例中，前缀 CIDR 为 10.0.0.208/28。

```
aws ec2 create-network-interface \
    --subnet-id {{subnet-047cfed18eEXAMPLE}} \
    --description "{{IPv4 manual example}}" \
    --ipv4-prefixes Ipv4Prefix={{10.0.0.208/28}}
```

**在网络接口创建过程中自动分配 IPv6 前缀**  
使用 [create-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-network-interface.html) 命令并将 `--ipv6-prefix-count` 设置为要让 AWS 分配的 IPv6 前缀数。在下面的示例中，AWS 分配一个 IPv6 前缀。

```
aws ec2 create-network-interface \
    --subnet-id {{subnet-047cfed18eEXAMPLE}} \
    --description "{{IPv6 automatic example}}" \
    --ipv6-prefix-count {{1}}
```

**在网络接口创建过程中分配特定 IPv6 前缀**  
使用 [create-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-network-interface.html) 命令并将 `--ipv6-prefixes` 设置为该前缀范围。AWS 会从此范围中选择 IPv6 地址。在下面的示例中，前缀 CIDR 为 2600:1f13:fc2:a700:1768::/80。

```
aws ec2 create-network-interface \
    --subnet-id {{subnet-047cfed18eEXAMPLE}} \
    --description "{{IPv6 manual example}}" \
    --ipv6-prefixes Ipv6Prefix={{2600:1f13:fc2:a700:1768::/80}}
```

------
#### [ PowerShell ]

**在网络接口创建过程中自动分配 IPv4 前缀**  
使用 [New-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2NetworkInterface.html) cmdlet 并将 `Ipv4PrefixCount` 设置为要让 AWS 分配的 IPv4 前缀数。在下面的示例中，AWS 分配一个 IPv4 前缀。

```
New-EC2NetworkInterface `
    -SubnetId '{{subnet-047cfed18eEXAMPLE}}' `
    -Description '{{IPv4 automatic example}}' `
    -Ipv4PrefixCount {{1}}
```

**在网络接口创建过程中分配特定 IPv4 前缀**  
使用 [New-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2NetworkInterface.html) cmdlet 并将 `Ipv4Prefix` 设置为该前缀范围。AWS 会从此范围中选择 IPv4 地址。在下面的示例中，前缀 CIDR 为 10.0.0.208/28。

```
Import-Module AWS.Tools.EC2
New-EC2NetworkInterface `
    -SubnetId '{{subnet-047cfed18eEXAMPLE}}' `
    -Description '{{IPv4 manual example}}' `
    -Ipv4Prefix (New-Object `
        -TypeName Amazon.EC2.Model.Ipv4PrefixSpecificationRequest `
        -Property @{Ipv4Prefix = '{{10.0.0.208/28}}'})
```

**在网络接口创建过程中自动分配 IPv6 前缀**  
使用 [New-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2NetworkInterface.html) cmdlet 并将 `Ipv6PrefixCount` 设置为要让 AWS 分配的 IPv6 前缀数。在下面的示例中，AWS 分配一个 IPv6 前缀。

```
New-EC2NetworkInterface `
    -SubnetId '{{subnet-047cfed18eEXAMPLE}}' `
    -Description '{{IPv6 automatic example}}' `
    -Ipv6PrefixCount {{1}}
```

**在网络接口创建过程中分配特定 IPv6 前缀**  
使用 [New-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2NetworkInterface.html) cmdlet 并将 `Ipv6Prefixes` 设置为该前缀范围。AWS 会从此范围中选择 IPv6 地址。在下面的示例中，前缀 CIDR 为 2600:1f13:fc2:a700:1768::/80。

```
Import-Module AWS.Tools.EC2
New-EC2NetworkInterface `
    -SubnetId '{{subnet-047cfed18eEXAMPLE}}' `
    -Description '{{IPv6 manual example}}' `
    -Ipv6Prefix (New-Object `
        -TypeName Amazon.EC2.Model.Ipv6PrefixSpecificationRequest `
        -Property @{Ipv6Prefix = '{{2600:1f13:fc2:a700:1768::/80}}'})
```

------

## 分配前缀至现有网络接口
<a name="assign-auto-existing"></a>

您可以为现有网络接口分配自动或自定义前缀。

------
#### [ Console ]

**自动分配前缀至现有网络接口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**网络接口**。

1. 选择要为其分配前缀的网络接口，然后选择 **Actions**（操作）、**Manage prefixes**（管理前缀）。

1. 对于 **IPv4 前缀委派**，请执行下列操作之一：
   + 要自动分配 IPv4 前缀，请选择**自动分配**。对于 **IPv4 前缀的数量**，输入要分配的前缀数。
   + 要分配特定 IPv4 前缀，请选择**自定义**。选择**添加新的前缀**，然后输入该前缀。

1. 对于 **IPv6 前缀委派**，请执行下列操作之一：
   + 要自动分配 IPv6 前缀，请选择**自动分配**。对于 **IPv6 前缀的数量**，输入要分配的前缀数。
   + 要分配特定 IPv6 前缀，请选择**自定义**。选择**添加新的前缀**，然后输入该前缀。
**注意**  
**IPv6 prefix delegation**（IPv6 前缀委派）仅当为 IPv6 启用了选定的子网时才会显示。

1. 选择**保存**。

------
#### [ AWS CLI ]

使用 [assign-ipv6-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/assign-ipv6-addresses.html) 命令为现有网络接口分配 IPv6 前缀，并使用 [assign-private-ip-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/assign-private-ip-addresses.html) 命令为现有网络接口分配 IPv4 前缀。

**自动分配 IPv4 前缀至现有网络接口**  
使用 [assign-private-ip-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/assign-private-ip-addresses.html) 命令并将 `--ipv4-prefix-count` 设置为要让 AWS 分配的 IPv4 前缀数。在下面的示例中，AWS 分配一个 IPv4 前缀。

```
aws ec2 assign-private-ip-addresses \
    --network-interface-id {{eni-081fbb4095EXAMPLE}} \
    --ipv4-prefix-count {{1}}
```

**分配特定 IPv4 前缀至现有网络接口**  
使用 [assign-private-ip-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/assign-private-ip-addresses.html) 命令并设置 `--ipv4-prefixes` 至前缀。AWS 会从此范围中选择 IPv4 地址。在下面的示例中，前缀 CIDR 为 10.0.0.208/28。

```
aws ec2 assign-private-ip-addresses \
    --network-interface-id {{eni-081fbb4095EXAMPLE}} \
    --ipv4-prefixes {{10.0.0.208/28}}
```

**自动分配 IPv6 前缀至现有网络接口**  
使用 [assign-ipv6-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/assign-ipv6-addresses.html) 命令并将 `--ipv6-prefix-count` 设置为要让 AWS 分配的 IPv6 前缀数。在下面的示例中，AWS 分配一个 IPv6 前缀。

```
aws ec2 assign-ipv6-addresses \
    --network-interface-id {{eni-00d577338cEXAMPLE}} \
    --ipv6-prefix-count {{1}}
```

**分配特定 IPv6 前缀至现有网络接口**  
使用 [assign-ipv6-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/assign-ipv6-addresses.html) 命令并设置 `--ipv6-prefixes` 至前缀。AWS 会从此范围中选择 IPv6 地址。在下面的示例中，前缀 CIDR 为 2600:1f13:fc2:a700:18bb::/80。

```
aws ec2 assign-ipv6-addresses \
    --network-interface-id {{eni-00d577338cEXAMPLE}} \
    --ipv6-prefixes {{2600:1f13:fc2:a700:18bb::/80}}
```

------
#### [ PowerShell ]

**自动分配 IPv4 前缀至现有网络接口**  
使用 [Register-EC2PrivateIpAddress](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2PrivateIpAddress.html) cmdlet 并将 `Ipv4PrefixCount` 设置为要让 AWS 分配的 IPv4 前缀数。在下面的示例中，AWS 分配一个 IPv4 前缀。

```
Register-EC2PrivateIpAddress `
    -NetworkInterfaceId '{{eni-00d577338cEXAMPLE}}' `
    -Ipv4PrefixCount {{1}}
```

**分配特定 IPv4 前缀至现有网络接口**  
使用 [Register-EC2PrivateIpAddress](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2PrivateIpAddress.html) cmdlet 并将 `Ipv4Prefix` 设置为该前缀。AWS 会从此范围中选择 IPv4 地址。在下面的示例中，前缀 CIDR 为 10.0.0.208/28。

```
Register-EC2PrivateIpAddress `
    -NetworkInterfaceId '{{eni-00d577338cEXAMPLE}}' `
    -Ipv4Prefix '{{10.0.0.208/28}}'
```

**自动分配 IPv6 前缀至现有网络接口**  
使用 [Register-EC2Ipv6AddressList](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Ipv6AddressList.html) cmdlet 并将 `Ipv6PrefixCount` 设置为要让 AWS 分配的 IPv4 前缀数。在下面的示例中，AWS 分配一个 IPv6 前缀。

```
Register-EC2Ipv6AddressList `
    -NetworkInterfaceId '{{eni-00d577338cEXAMPLE}}' `
    -Ipv6PrefixCount {{1}}
```

**分配特定 IPv6 前缀至现有网络接口**  
使用 [Register-EC2Ipv6AddressList](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Ipv6AddressList.html) cmdlet 并将 `Ipv6Prefix` 设置为该前缀。AWS 会从此范围中选择 IPv6 地址。在下面的示例中，前缀 CIDR 为 2600:1f13:fc2:a700:18bb::/80。

```
Register-EC2Ipv6AddressList `
    -NetworkInterfaceId '{{eni-00d577338cEXAMPLE}}' `
    -Ipv6Prefix '{{2600:1f13:fc2:a700:18bb::/80}}'
```

------

## 从网络接口中移除前缀
<a name="unassign-prefix"></a>

您可以从现有网络接口中删除前缀。

------
#### [ Console ]

**从网络接口中移除前缀**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Network Interfaces**。

1. 选择网络接口。

1. 选择**操作**，**管理前缀**。

1. 对于 **IPv4 前缀委派**，要删除特定的前缀，请选择要删除的前缀旁边的**取消分配**。要移除所有前缀，请选择**不分配**。

1. 对于 **IPv6 前缀委派**，要删除特定的前缀，请选择要删除的前缀旁边的**取消分配**。要移除所有前缀，请选择**不分配**。
**注意**  
**IPv6 prefix delegation**（IPv6 前缀委派）仅当为 IPv6 启用了选定的子网时才会显示。

1. 选择**保存**。

------
#### [ AWS CLI ]

您可以使用 [unassign-ipv6-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/unassign-ipv6-addresses.html) 命令来移除 IPv6 前缀，使用 [unassign-private-ip-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/unassign-private-ip-addresses.html) 命令将 IPv4 前缀从现有网络接口中移除。

**从网络接口中移除 IPv4 前缀**  


使用 [unassign-private-ip-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/unassign-private-ip-addresses.html) 命令并将 `--ipv4-prefix` 设置为要移除的前缀 CIDR。

```
aws ec2 unassign-private-ip-addresses \
    --network-interface-id {{eni-081fbb4095EXAMPLE}} \
    --ipv4-prefixes {{10.0.0.176/28}}
```

**从网络接口中移除 IPv6 前缀**  
使用 [unassign-ipv6-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/unassign-ipv6-addresses.html) 命令并将 `--ipv6-prefix` 设置为要移除的前缀 CIDR。

```
aws ec2 unassign-ipv6-addresses \
    --network-interface-id {{eni-00d577338cEXAMPLE}} \
    --ipv6-prefix {{2600:1f13:fc2:a700:18bb::/80}}
```

------
#### [ PowerShell ]

**从网络接口中移除 IPv4 前缀**  
使用 [Unregister-EC2PrivateIpAddress](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2PrivateIpAddress.html) cmdlet 并将 `Ipv4Prefix` 设置为要移除的前缀 CIDR。

```
Unregister-EC2PrivateIpAddress `
    -NetworkInterfaceId '{{eni-00d577338cEXAMPLE}}' `
    -Ipv4Prefix '{{10.0.0.208/28}}'
```

**从网络接口中移除 IPv6 前缀**  
使用 [Unregister-EC2Ipv6AddressList](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2Ipv6AddressList.html) cmdlet 并将 `Ipv6Prefix` 设置为要移除的前缀 CIDR。

```
Unregister-EC2Ipv6AddressList `
    -NetworkInterfaceId '{{eni-00d577338cEXAMPLE}}' `
    -Ipv6Prefix '{{2600:1f13:fc2:a700:18bb::/80}}'
```

------
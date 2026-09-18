

# 管理 EC2 实例的 IPv6 地址
<a name="working-with-ipv6-addresses"></a>

如果您的 VPC 和子网有与之关联的 IPv6 CIDR 块，则您可以在启动期间或之后向实例分配 IPv6 地址。您可以在控制台的**实例**页面或**网络接口**页面上访问实例的 IPv6 地址。以下任务为您的实例配置 IP 地址。要改为配置网络接口的 IP 地址，请参阅[管理网络接口的 IP 地址](managing-network-interface-ip-addresses.md)。

**Topics**
+ [向实例分配 IPv6 地址](#assign-ipv6-address)
+ [查看实例的 IPv6 地址](#view-ipv6-addresses)
+ [使用实例元数据查看 IPv6 地址](#view-ipv6-addresses-imds)
+ [取消分配给实例的 IPv6 地址](#unassign-ipv6-address)

## 向实例分配 IPv6 地址
<a name="assign-ipv6-address"></a>

您可以在子网 IPv6 地址范围中指定一个 IPv6 地址，也可以让 Amazon EC2 为您选择一个。该地址会分配给主网络接口。请注意，C1、M1、M2、M3 和 T1 实例类型不支持 IPv6 地址。

------
#### [ Console ]

**在启动后分配 IPv6 地址**  
按照程序[启动实例](ec2-launch-instance-wizard.md)。在配置[网络设置](ec2-instance-launch-parameters.md#liw-network-settings)时，选择**自动分配 IPv6 IP** 选项。如果看不到此选项，则表示所选子网没有关联任何 IPv6 CIDR 块。

**在启动实例后分配 IPv6 地址**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择您的实例，然后依次选择**操作**、**联网**和**管理 IP 地址**。

1. 展开网络接口。在 **IPv6 地址**下，选择**分配新 IP 地址**。

1. 输入子网范围内的一个 IPv6 地址，也可将该字段留空，以便让 Amazon EC2 为您选择 IPv6 地址。如果看不到此选项，则表示实例子网没有关联任何 IPv6 CIDR 块。

1. 选择**保存**。

------
#### [ AWS CLI ]

**在启动后分配 IPv6 地址**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--ipv6-addresses` 选项。以下示例会分配两个 IPv6 地址。

```
--ipv6-addresses Ipv6Address={{2001:db8::1234:5678:1.2.3.4}} Ipv6Address={{2001:db8::1234:5678:5.6.7.8}}
```

要让 Amazon EC2 选择 IPv6 地址，请改用 `--ipv6-address-count` 选项。以下示例会分配两个 IPv6 地址。

```
--ipv6-address-count 2
```

**在启动实例后分配 IPv6 地址**  
使用 [assign-ipv6-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/assign-ipv6-addresses.html) 命令。以下示例会分配两个 IPv6 地址。

```
aws ec2 assign-ipv6-addresses \ 
    --network-interface-id {{eni-1234567890abcdef0}} \
    --ipv6-addresses {{2001:db8::1234:5678:1.2.3.4}} {{2001:db8::1234:5678:5.6.7.8}}
```

要让 Amazon EC2 选择 IPv6 地址，请改用 `--ipv6-address-count` 选项。以下示例会分配两个 IPv6 地址。

```
aws ec2 assign-ipv6-addresses \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --ipv6-address-count 2
```

------
#### [ PowerShell ]

**在启动后分配 IPv6 地址**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-Ipv6Address` 参数结合使用。以下示例会分配两个 IPv6 地址。

```
-Ipv6Address $ipv6addr1,$ipv6addr2
```

按如下所示定义 IPv6 地址。

```
$ipv6addr1 = New-Object Amazon.EC2.Model.InstanceIpv6Address
$ipv6addr1.Ipv6Address = "{{2001:db8::1234:5678:1.2.3.4}}"
$ipv6addr2 = New-Object Amazon.EC2.Model.InstanceIpv6Address
$ipv6addr2.Ipv6Address = "{{2001:db8::1234:5678:5.6.7.8}}"
```

要让 Amazon EC2 选择 IPv6 地址，请改用 `-Ipv6AddressCount` 参数。以下示例会分配两个 IPv6 地址。

```
-Ipv6AddressCount 2
```

**在启动实例后分配 IPv6 地址**  
使用 [Register-EC2Ipv6AddressList](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Ipv6AddressList.html) cmdlet。以下示例会分配两个 IPv6 地址。

```
Register-EC2Ipv6AddressList `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -Ipv6Address "{{2001:db8::1234:5678:1.2.3.4}}","{{2001:db8::1234:5678:5.6.7.8}}"
```

要让 Amazon EC2 选择 IPv6 地址，请改用 `-Ipv6AddressCount` 参数。以下示例会分配两个 IPv6 地址。

```
Register-EC2Ipv6AddressList `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -Ipv6AddressCount 2
```

------

## 查看实例的 IPv6 地址
<a name="view-ipv6-addresses"></a>

您可以查看实例的 IPv6 地址。

------
#### [ Console ]

**查看实例的 IPv6 地址**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 在**联网**选项卡上，找到 **IPv6 地址**。

------
#### [ AWS CLI ]

**查看实例的 IPv6 地址**  
可以使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --query "Reservations[*].Instances[].Ipv6Address" \
    --output text
```

下面是示例输出。

```
2001:db8::1234:5678:1.2.3.4
```

------
#### [ PowerShell ]

**查看实例的 IPv6 地址**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}}).Instances.Ipv6Address
```

下面是示例输出。

```
2001:db8::1234:5678:1.2.3.4
```

------

## 使用实例元数据查看 IPv6 地址
<a name="view-ipv6-addresses-imds"></a>

连接到实例后，您可以使用实例元数据检索 IPv6 地址。首先，您必须从 `http://169.254.169.254/latest/meta-data/network/interfaces/macs/` 中获取实例的 MAC 地址。

------
#### [ IMDSv2 ]

**Linux**  
在 Linux 实例上运行以下命令。

```
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/network/interfaces/macs/{{mac-address}}/ipv6s
```

**Windows**  
在 Windows 实例上运行以下 cmdlet。

```
[string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} `
    -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} `
    -Method GET -Uri http://169.254.169.254/latest/meta-data/network/interfaces/macs/{{mac-address}}/ipv6s
```

------
#### [ IMDSv1 ]

**Linux**  
在 Linux 实例上运行以下命令。

```
curl http://169.254.169.254/latest/meta-data/network/interfaces/macs/{{mac-address}}/ipv6s
```

**Windows**  
在 Windows 实例上运行以下 cmdlet。

```
Invoke-RestMethod -Uri http://169.254.169.254/latest/meta-data/network/interfaces/macs/{{mac-address}}/ipv6s
```

------

## 取消分配给实例的 IPv6 地址
<a name="unassign-ipv6-address"></a>

您可以随时取消分配给实例的 IPv6 地址。

------
#### [ Console ]

**取消分配给实例的 IPv6 地址**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择您的实例，然后依次选择**操作**、**联网**和**管理 IP 地址**。

1. 展开网络接口。在 **IPv6 地址**下方，选择 IPv6 地址旁边的**取消分配**。

1. 选择 **Save**。

------
#### [ AWS CLI ]

**取消分配给实例的 IPv6 地址**  
使用 [unassign-ipv6-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/unassign-ipv6-addresses.html) 命令。

```
aws ec2 unassign-ipv6-addresses \ 
    --network-interface-id {{eni-1234567890abcdef0}} \
    --ipv6-addresses {{2001:db8::1234:5678:1.2.3.4}}
```

------
#### [ PowerShell ]

**取消分配给实例的 IPv6 地址**  
使用 [Unregister-EC2Ipv6AddressList](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2Ipv6AddressList.html) cmdlet。

```
Unregister-EC2Ipv6AddressList `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -Ipv6Address {{2001:db8::1234:5678:1.2.3.4}}
```

------
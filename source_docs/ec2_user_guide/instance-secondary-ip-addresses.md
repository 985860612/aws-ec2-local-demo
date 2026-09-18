

# EC2 实例的辅助 IP 地址
<a name="instance-secondary-ip-addresses"></a>

主 IP 地址是指分配给网络接口的第一个 IPv4 地址。辅助 IP 地址是指分配给网络接口的其他 IPv4 地址。有关更多信息，请参阅 [多个 IP 地址](using-instance-addressing.md#multiple-ip-addresses)。

您还可以为实例分配多个 IPv6 地址。有关更多信息，请参阅 [管理 EC2 实例的 IPv6 地址](working-with-ipv6-addresses.md)。

**Topics**
+ [为实例分配辅助 IP 地址](#assign-secondary-ip-address)
+ [配置操作系统以使用辅助 IP 地址](#StepTwoConfigOS)
+ [取消分配给实例的辅助 IP 地址](#unassign-secondary-ip-address)

## 为实例分配辅助 IP 地址
<a name="assign-secondary-ip-address"></a>

您可以在启动实例时或在实例运行后为实例的网络接口分配辅助 IP 地址。

------
#### [ Console ]

**在启动时分配辅助 IP 地址**

1. 按照程序[启动实例](ec2-launch-instance-wizard.md)。配置[网络设置](ec2-instance-launch-parameters.md#liw-network-settings)时，展开**高级网络配置**。

1. 对于**辅助 IP**，选择**自动分配**，然后输入要让 Amazon EC2 分配的 IP 地址数量。也可以选择**手动分配**，然后输入相应的 IPv4 地址。

1. 完成剩余步骤以启动实例。

**在启动后分配辅助 IP 地址**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择您的实例，然后依次选择**操作**、**联网**和**管理 IP 地址**。

1. 展开网络接口。

1. 要添加 IPv4 地址，请在 **IPv4 地址**下选择**分配新 IP 地址**。输入子网范围内的一个 IPv4 地址，也可将该字段留空，以便让 Amazon EC2 为您选择一个。

1. 选择**保存**。

------
#### [ AWS CLI ]

**在启动时分配辅助 IP 地址**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--secondary-private-ip-addresses` 选项。

```
--secondary-private-ip-addresses {{10.251.50.12}}
```

要让 Amazon EC2 选择 IP 地址，请改用 `--secondary-private-ip-address-count` 选项。以下示例会分配一个辅助 IP 地址。

```
--secondary-private-ip-address-count 1
```

您也可以创建网络接口。有关更多信息，请参阅 [为 Amazon EC2 实例创建网络接口](create-network-interface.md)。

**在启动后分配辅助 IP 地址**  
使用 [assign-private-ip-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/assign-private-ip-addresses.html) 命令和 `--private-ip-addresses` 选项。

```
aws ec2 assign-private-ip-addresses \
    --network-interface-ids {{eni-1234567890abcdef0}} \
    --private-ip-addresses {{10.251.50.12}}
```

要让 Amazon EC2 选择 IPv4 地址，请改用 `--secondary-private-ip-address-count` 参数。以下示例会分配一个 IPv4 地址。

```
aws ec2 assign-private-ip-addresses \
    --network-interface-ids {{eni-1234567890abcdef0}} \
    --secondary-private-ip-address-count 1
```

------
#### [ PowerShell ]

**在启动时分配辅助 IP 地址**  
您必须创建一个网络接口。有关更多信息，请参阅 [为 Amazon EC2 实例创建网络接口](create-network-interface.md)。

**在启动后分配辅助 IP 地址**  
使用 [Register-EC2PrivateIpAddress](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2PrivateIpAddress.html) cmdlet 和 `-PrivateIpAddress` 参数。

```
Register-EC2PrivateIpAddress `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -PrivateIpAddress {{10.251.50.12}}
```

要让 Amazon EC2 选择 IPv4 地址，请改用 `-SecondaryPrivateIpAddressCount` 参数。以下示例会分配一个 IPv4 地址。

```
Register-EC2PrivateIpAddress `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -SecondaryPrivateIpAddressCount 1
```

------

## 配置操作系统以使用辅助 IP 地址
<a name="StepTwoConfigOS"></a>

为实例分配辅助 IP 地址后，您必须配置实例上的操作系统，以便识别此额外的私有 IPv4 地址。

**Linux 实例**
+ 如果您使用的是 Amazon Linux，ec2-net-utils 包可以在此步骤上为您提供帮助。它能在实例运行期间配置您附加的其他网络接口，在 DHCP 租约续订期间更新辅助 IPv4 地址，并更新相关的路由规则。根据您的系统，您可以使用以下命令之一立即刷新接口列表：`sudo systemctl restart systemd-networkd`（AL2023）或 `sudo service network restart`（Amazon Linux 2）。您可以使用以下命令查看最新列表：`ip addr li`。如果您需要手动控制网络配置，可以删除 ec2-net-utils 包。有关更多信息，请参阅 [Configure your network interface using ec2-net-utils](https://docs.aws.amazon.com/linux/al2/ug/ec2-net-utils.html)。
+ 如果您正在使用其他 Linux 分配，请参阅有关 Linux 分配的文档。您可以搜索有关配置其他网络接口和辅助 IPv4 地址的信息。如果实例在同一子网中有两个或更多接口，请搜索有关利用路由规则解决非对称路由的信息。

**Windows 实例**  
有关更多信息，请参阅 [为 Windows 实例配置辅助私有 IPv4 地址](config-windows-multiple-ip.md)。

## 取消分配给实例的辅助 IP 地址
<a name="unassign-secondary-ip-address"></a>

如果不再需要某个辅助 IP 地址，您可以将其从实例或网络接口取消分配。当取消分配给网络接口的辅助私有 IPv4 地址后，弹性 IP 地址 (如果存在) 也会断开相关联系。

------
#### [ Console ]

**取消分配给实例的辅助私有 IPv4 地址**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后依次选择**操作**、**联网**和**管理 IP 地址**。

1. 展开网络接口。在 **IPv4 地址**中，为要取消分配的 IPv4 地址选择**取消分配**。

1. 选择**保存**。

------
#### [ AWS CLI ]

**取消分配辅助私有 IP 地址**  
使用 [unassign-private-ip-addresses](https://docs.aws.amazon.com/cli/latest/reference/ec2/unassign-private-ip-addresses.html) 命令。

```
aws ec2 unassign-private-ip-addresses \
    --network-interface {{eni-1234567890abcdef0}}\
    --private-ip-addresses {{10.251.50.12}}
```

------
#### [ PowerShell ]

**取消分配辅助私有 IP 地址**  
使用 [Unregister-EC2PrivateIpAddress](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2PrivateIpAddress.html) cmdlet。

```
Unregister-EC2PrivateIpAddress `
    -NetworkInterface {{eni-1234567890abcdef0}} `
    -PrivateIpAddress {{10.251.50.12}}
```

------
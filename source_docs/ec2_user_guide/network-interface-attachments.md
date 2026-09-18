

# EC2 实例的网络接口连接
<a name="network-interface-attachments"></a>

可以创建网络接口，供 EC2 实例用作主要或辅助网络接口。如果某 EC2 实例与某网络接口位于同一可用区中，则必须将该网络接口附加到该 EC2 实例。实例类型决定了可以附加到该实例的网络接口数量。有关更多信息，请参阅 [每个网络接口的最大 IP 地址数](AvailableIpPerENI.md)。

**注意事项**
+ 您可以在实例运行时 (热附加)、实例停止时 (暖附加) 或实例启动时 (冷附加) 将网络接口连接到实例。
+ 您可以在实例运行时或停止时分离次要网络接口。不过，您无法分离主网络接口。
+ 您可以从一个实例分离辅助网络接口并将其附加到另一个实例。
+ 在使用 CLI、API 或开发工具包启动实例时，您可以指定主网络接口和额外的网络接口。请注意，如果您在启动期间添加了辅助网络接口，则无法启用公有 IPv4 地址的自动分配。
+ 启动具有多个网络接口的 Amazon Linux 或 Windows Server 实例会自动在该实例的操作系统上配置接口、私有 IPv4 地址和路由表。
+ 如果要通过暖附加或热附加方式连接一个额外的网络接口，您可能需要手动添加第二个接口、配置私有 IPv4 地址并相应修改路由表。运行 Amazon Linux 或 Windows Server 的实例会自动识别暖附加或热附加，并自行进行配置。
+ 您无法通过将另一个网络接口附加到实例（例如一种网卡绑定配置）以增加或加倍双主机实例的网络带宽。
+ 如果将来自同一子网的多个网络接口连接到一个实例，则可能会遇到非对称路由等联网问题。请尽可能在主网络接口上添加辅助私有 IPv4 地址。
+ 对于仅 IPv6 子网中的 EC2 实例，如果您附加辅助网络接口，则辅助网络接口的私有 DNS 主机名将解析为主网络接口的主 IPv6 地址。
+ [Windows 实例] – 如果向一个实例添加多个网络接口，则必须将网络接口配置为使用静态路由。

## 附加网络接口
<a name="attach_eni"></a>

您可以使用 Amazon EC2 控制台的 **Instances (实例)** 或 **Network Interfaces (网络接口)** 页面，将网络接口连接至相同可用区中的任何实例。或者，您可以在[启动实例](ec2-launch-instance-wizard.md)时指定现有的网络接口。

如果您的实例上的公有 IPv4 地址已释放，并且有多个网络接口附加到实例，那么该实例不会收到新地址。有关公有 IPv4 地址行为的更多信息，请参阅[公有 IPv4 地址](using-instance-addressing.md#concepts-public-addresses)。

------
#### [ Console ]

**使用“实例”页面挂载网络接口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选中该实例的复选框。

1. 依次选择**操作**、**联网**、**附加网络接口**。

1. 选择 VPC。该网络接口可以位于您的实例所在的同一 VPC 中，也可以位于您所拥有的其他 VPC 中，只要网络接口与实例位于同一可用区中即可。这使您能够在具有不同网络和安全配置的 VPC 之间创建多宿主实例。

1. 选择网络接口。如果实例支持多个网卡，则可以选择网卡。

1. 选择 **Attach**。

**使用“网络接口”挂载网络接口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Network Interfaces**。

1. 选中该网络接口的复选框。

1. 依次选择**操作**、**附加**。

1. 选择一个实例。如果实例支持多个网卡，则可以选择网卡。

1. 选择 **Attach**。

------
#### [ AWS CLI ]

**挂载网络接口**  
使用以下 [attach-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/attach-network-interface.html) 命令。

```
aws ec2 attach-network-interface \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --instance-id {{i-1234567890abcdef0}} \
    --device-index {{1}}
```

------
#### [ PowerShell ]

**挂载网络接口**  
使用 [Add-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/Add-EC2NetworkInterface.html) cmdlet。

```
Add-EC2NetworkInterface `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -InstanceId {{i-1234567890abcdef0}} `
    -DeviceIndex {{1}}
```

------

## 分离网络接口
<a name="detach_eni"></a>

您可以随时使用 Amazon EC2 控制台的 **Instances (实例)** 或 **Network Interfaces (网络接口)** 页面，分离附加到 EC2 实例的辅助网络接口。

如果试图将连接至资源的网络接口从另一个服务（如 Elastic Load Balancing 负载均衡器、Lambda 函数、WorkSpace 或 NAT 网关）中分离，您将收到错误消息，提示您无权访问资源。要查找哪个服务创建了连接到网络接口的资源，请检查网络接口的说明。如果删除资源，则其网络接口将被删除。

------
#### [ Console ]

**使用“实例”页面分离网络接口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选中该实例的复选框。检查**联网**选项卡的**网络接口**部分，以验证网络接口是否作为辅助网络接口附加到实例。

1. 依次选择**操作**、**联网**、**分离网络接口**。

1. 选择网络接口，然后选择**分离**。

**使用“网络接口”页面分离网络接口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Network Interfaces**。

1. 选中该网络接口的复选框。检查**详细信息**选项卡的**实例详细信息**部分，以验证网络接口是否作为辅助网络接口附加到实例。

1. 依次选择**操作**、**分离**。

1. 当系统提示进行确认时，选择**分离**。

1. 如果网络接口未能与实例分离，请选择**强制分离**、**启用**，然后重试。我们建议仅将强制分离用作最后手段。强制分离可以防止您在重新启动实例之前在同一索引上附加不同的网络接口。它还可以防止实例元数据反映网络接口在您重新启动实例已分离。

------
#### [ AWS CLI ]

**分离网络接口**  
使用以下 [detach-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/detach-network-interface.html) 命令。

```
aws ec2 detach-network-interface --attachment-id {{eni-attach-016c93267131892c9}}
```

------
#### [ PowerShell ]

**分离网络接口**  
使用 [Dismount-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/Dismount-EC2NetworkInterface.html) cmdlet。

```
Dismount-EC2NetworkInterface -AttachmentId {{eni-attach-016c93267131892c9}}
```

------


# 创建 Elastic Fabric Adapter 并将其附加到 Amazon EC2 实例
<a name="create-efa"></a>

您可以创建 EFA 并将其附加到 Amazon EC2 实例，就像 Amazon EC2 中的任何其他弹性网络接口一样。不过，与弹性网络接口不同，无法将 EFA 附加到处于 `running` 状态的实例，也无法将其从处于该状态的实例中分离。

**注意事项**
+  您可以更改与 EFA 关联的安全组。要启用操作系统绕过功能，EFA 必须是一个安全组的成员，以允许进出安全组本身的所有入站和出站流量。有关更多信息，请参阅 [步骤 1：准备启用 EFA 的安全组](efa-start.md#efa-start-security)。

  您可以使用更改与弹性网络接口关联的安全组的相同方式更改与 EFA 关联的安全组。有关更多信息，请参阅 [修改网络接口属性](modify-network-interface-attributes.md)。
+ 您可以使用将 IP 地址分配给弹性网络接口的相同方式将弹性 IP (IPv4) 和 IPv6 地址分配给 EFA（带 ENA 的 EFA）。有关更多信息，请参阅[管理 IP 地址](managing-network-interface-ip-addresses.md)。

  您不能为仅限 EFA 的网络接口分配 IP 地址。

**Topics**
+ [创建 EFA](#efa-create)
+ [将 EFA 附加到停止的实例](#efa-attach)
+ [在启动实例时附加 EFA](#efa-launch)
+ [将 EFA 添加到启动模板](#efa-launch-template)

## 创建 EFA
<a name="efa-create"></a>

您可以在 VPC 上的子网中创建 EFA。在创建 EFA 后，您无法将其移动到另一个子网，并且只能将其附加到同一可用区中的已停止实例。

------
#### [ Console ]

**创建 EFA（带 ENA 的 EFA 或仅限 ENA）网络接口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Network Interfaces**（网络接口），然后选择 **Create network interface**（创建网络接口）。

1. 对于 **Description (描述)**，请输入一个描述性的 EFA 名称。

1. 对于 **Subnet (子网)**，请选择要在其中创建 EFA 的子网。

1. **接口类型**，选择以下选项之一：
   + **带 ENA 的 EFA**：创建同时支持 ENA 和 EFA 设备的网络接口。
   + **仅限 EFA**：创建仅支持 EFA 设备的网络接口。

1. （仅适用于带 ENA 的 EFA）为网络接口配置 IP 地址和前缀分配。您可以分配的 IP 地址和前缀类型取决于所选的子网。对于仅限 IPv4 的子网，您只能分配 IPv4 IP 地址和前缀。对于仅限 IPv6 的子网，您只能分配 IPv6 IP 地址和前缀。对于双堆栈子网，可同时分配 IPv4 和 IPv6 IP 地址和前缀。
**注意**  
您不能为仅限 EFA 的网络接口分配 IP 地址。

   1. 对于**私有 IPv4 地址**和/或 **IPv6 地址**，选择**自动分配**以使 Amazon EC2 从选定子网中自动分配 IP 地址，或选择**自定义**以手动指定要分配的 IP 地址。

   1. 如果您分配 IPv6 地址，则可以选择启用**分配主 IPv6 IP**。此操作将为网络接口分配一个主 IPv6 全局单播地址（GUA）。分配主要 IPv6 地址使您能够避免中断实例或 ENI 的流量。有关更多信息，请参阅 [IPv6 地址](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html#vpc-ipv6-addresses)。

   1. 对于 **IPv4 前缀委派**和/或 **IPv6 前缀委派**，选择**自动分配**以使 Amazon EC2 自动从子网的 CIDR 数据块中分配前缀，或选择**自定义**以从子网的 CIDR 数据块中手动指定前缀。如果您指定前缀，则 AWS 会验证其是否已分配给其他资源。有关更多信息，请参阅 [Amazon EC2 网络接口的前缀委派](ec2-prefix-eni.md)。

   1. （可选）配置**空闲连接跟踪超时**设置。有关更多信息，请参阅 [空闲连接跟踪超时](security-group-connection-tracking.md#connection-tracking-timeouts)。
      + **TCP 建立超时**：处于已建立状态的空闲 TCP 连接的超时时间（秒）。最小值：60 秒。最大值：432000 秒（5 天）。默认值：432000 秒。建议值：小于 432000 秒。
      + **UDP 超时**：空闲 UDP 流的超时时间（秒），这些流仅在单个方向或单个请求-响应事务中看到流量。最小值：30 秒。最大值：60 秒。默认值：30 秒。
      + **UDP 流超时**：空闲 UDP 流的超时时间（秒），这些流被归类为已看到多个请求-响应事务的流。最小值：60 秒。最大值：180 秒（3 分钟）。默认值：180 秒。

1. 对于 **Security groups**，选择一个或多个安全组。

1. 选择**创建网络接口**。

------
#### [ AWS CLI ]

**创建 EFA**  
使用 [create-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-network-interface.html) 命令。对于 `--interface-type`，针对 EFA 网络接口指定 `efa` 或针对仅限 EFA 的网络接口指定 `efa-only`。

```
aws ec2 create-network-interface \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --interface-type {{efa}} \
    --description "{{my efa}}"
```

------
#### [ PowerShell ]

**创建 EFA**  
使用 [New-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2NetworkInterface.html) cmdlet。对于 `-InterfaceType`，针对 EFA 网络接口指定 `efa` 或针对仅限 EFA 的网络接口指定 `efa-only`

```
New-EC2NetworkInterface `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -InterfaceType {{efa}} `
    -Description "{{my efa}}"
```

------

## 将 EFA 附加到停止的实例
<a name="efa-attach"></a>

您可以将 EFA 附加到处于 `stopped` 状态的任何支持的实例。您无法将 EFA 附加到处于 `running` 状态的实例。有关支持的实例类型的更多信息，请参阅[支持的实例类型](efa.md#efa-instance-types)。

您可以使用将网络接口连接到实例的相同方式将 EFA 连接到实例。有关更多信息，请参阅[附加网络接口](network-interface-attachments.md#attach_eni)。

## 在启动实例时附加 EFA
<a name="efa-launch"></a>

------
#### [ AWS CLI ]

**在启动实例时附加现有的 EFA**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--network-interfaces` 选项。对于主网络接口，指定 EFA 网络接口以及 `NetworkCardIndex=0`、`DeviceIndex=0`。要附加多个 EFA 网络接口，请参阅[最大化网络带宽](efa-acc-inst-types.md)。

```
--network-interfaces "NetworkCardIndex=0, \
    DeviceIndex=0, \
    NetworkInterfaceId={{eni-1234567890abcdef0}}, \
    Groups={{sg-1234567890abcdef0}}, \
    SubnetId={{subnet-0abcdef1234567890}}"
```

**在启动实例时附加新的 EFA**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--network-interfaces` 选项。对于主网络接口，使用 `NetworkCardIndex=0`、`DeviceIndex=0` 和 `InterfaceType=efa`。如果您要附加多个 EFA 网络接口，请参阅 [最大化网络带宽](efa-acc-inst-types.md)。

```
--network-interfaces "NetworkCardIndex=0, \
    DeviceIndex=0, \
    InterfaceType=efa, \
    Groups={{sg-1234567890abcdef0}}, \
    SubnetId={{subnet-0abcdef1234567890}}"
```

------
#### [ PowerShell ]

**在启动实例时附加现有的 EFA**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-NetworkInterfaces` 参数结合使用。

```
-NetworkInterface $networkInterface
```

按如下方式定义网络接口。

```
$networkInterface = New-Object Amazon.EC2.Model.InstanceNetworkInterfaceSpecification
$networkInterface.DeviceIndex = 0
$networkInterface.NetworkInterfaceId = "{{eni-1234567890abcdef0}}"
$networkInterface.Groups = @("{{sg-1234567890abcdef0}}")
$networkInterface.SubnetId = "{{subnet-0abcdef1234567890}}"
```

**在启动实例时附加新的 EFA**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-NetworkInterfaces` 参数结合使用。

```
-NetworkInterface $networkInterface
```

按如下方式定义网络接口。

```
$networkInterface = New-Object Amazon.EC2.Model.InstanceNetworkInterfaceSpecification
$networkInterface.DeviceIndex = 0
$networkInterface.InterfaceType = "efa"
$networkInterface.Groups = @("{{sg-1234567890abcdef0}}")
$networkInterface.SubnetId = "{{subnet-0abcdef1234567890}}"
```

------

## 将 EFA 添加到启动模板
<a name="efa-launch-template"></a>

您可以创建一个启动模板，其中包含启动启用了 EFA 的实例所需的配置信息。您可以在启动模板中同时指定 EFA 和仅限 EFA 的网络接口。要创建启用了 EFA 的启动模板，请创建新的启动模板并指定支持的实例类型、启用了 EFA 的 AMI 以及启用了 EFA 的安全组。对于 `NetworkInterfaces`，请指定要附加的 EFA 网络接口。对于主网络接口，使用 `NetworkCardIndex=0`、`DeviceIndex=0` 和 `InterfaceType=efa`。如果您要附加多个 EFA 网络接口，请参阅 [使用多网卡最大化 Amazon EC2 实例上的网络带宽](efa-acc-inst-types.md)。

您可以利用启动模板通过其他 AWS 服务（如 [AWS Batch](https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html) 或 [AWS ParallelCluster](https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html)）启动启用了 EFA 的实例。

有关创建启动模板的更多信息，请参阅[创建 Amazon EC2 启动模板](create-launch-template.md)。
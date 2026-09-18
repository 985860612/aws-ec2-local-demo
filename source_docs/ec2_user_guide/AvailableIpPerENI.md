

# 每个网络接口的最大 IP 地址数
<a name="AvailableIpPerENI"></a>

每个实例类型支持的每个网络接口的最大数量、每个网络接口支持的私有 IPv4 地址的最大数量，以及每个网络接口支持的 IPv6 地址的最大数量。每个网络接口的 IPv6 地址与私有 IPv4 地址有不同的限制并且分别列出。请注意，除了 C1、M1、M2、M3 和 T1 实例类型，其余实例类型都支持 IPv6 寻址。

**可用的网络接口**

《Amazon EC2 实例类型指南》**提供有关每种实例类型可以使用的网络接口的信息。有关更多信息，请参阅下列内容：
+ [网络规格 – 通用型](https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html#gp_network)
+ [网络规格 – 计算优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html#co_network)
+ [网络规格 – 内存优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html#mo_network)
+ [网络规格 – 存储优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/so.html#so_network)
+ [网络规格 – 加速计算型](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html#ac_network)
+ [网络规格 – 高性能计算型](https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html#hpc_network)
+ [网络规格 – 上一代](https://docs.aws.amazon.com/ec2/latest/instancetypes/pg.html#pg_network)

------
#### [ Console ]

**检索最大网络接口数**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instance Types (实例类型)**。

1. 添加筛选条件来指定实例类型（**实例类型=c5.12xlarge**）或实例系列（**实例系列=c5**）。

1. （可选）选择**首选项**图标，然后开启**最大网络接口数**。此列会指示每种实例类型的最大网络接口数量。

1. （可选）选择实例类型。在**联网**选项卡上，找到**最大网络接口数**。

------
#### [ AWS CLI ]

**检索最大网络接口数**  
您可以使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令来显示有关实例类型的信息，例如其支持的网络接口和每个接口的 IP 地址。以下示例显示了所有 C8i 实例的此类信息。

```
{ echo -e "InstanceType\tMaximumNetworkInterfaces\tIpv4AddressesPerInterface"; \
aws ec2 describe-instance-types \
    --filters "Name=instance-type,Values=c8i.*" \
    --query 'InstanceTypes[*].[InstanceType, NetworkInfo.MaximumNetworkInterfaces, NetworkInfo.Ipv4AddressesPerInterface]' \
    --output text | sort -k2 -n; } | column -t
```

下面是示例输出。

```
InstanceType    MaximumNetworkInterfaces  Ipv4AddressesPerInterface
c8i.large       3                         20
c8i.2xlarge     4                         30
c8i.xlarge      4                         30
c8i.4xlarge     8                         50
c8i.8xlarge     10                        50
c8i.12xlarge    12                        50
c8i.16xlarge    16                        64
c8i.24xlarge    16                        64
c8i.32xlarge    24                        64
c8i.48xlarge    24                        64
c8i.96xlarge    24                        64
c8i.metal-48xl  24                        64
c8i.metal-96xl  24                        64
```

------
#### [ PowerShell ]

**检索最大网络接口数**  
您可以使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) PowerShell 命令来显示有关实例类型的信息，例如其支持的网络接口和每个接口的 IP 地址。以下示例显示了所有 C8i 实例的此类信息。

```
Get-EC2InstanceType -Filter @{Name="instance-type"; Values="c8i.*"} |
Select-Object `
    InstanceType,
    @{Name='MaximumNetworkInterfaces'; Expression={$_.NetworkInfo.MaximumNetworkInterfaces}},
    @{Name='Ipv4AddressesPerInterface'; Expression={$_.NetworkInfo.Ipv4AddressesPerInterface}} |
Sort-Object MaximumNetworkInterfaces |
Format-Table -AutoSize
```

下面是示例输出。

```
InstanceType   MaximumNetworkInterfaces Ipv4AddressesPerInterface
------------   ------------------------ -------------------------
c8i.large                             3                        20
c8i.xlarge                            4                        30
c8i.2xlarge                           4                        30
c8i.4xlarge                           8                        50
c8i.8xlarge                          10                        50
c8i.12xlarge                         12                        50
c8i.24xlarge                         16                        64
c8i.16xlarge                         16                        64
c8i.96xlarge                         24                        64
c8i.48xlarge                         24                        64
c8i.metal-96xl                       24                        64
c8i.32xlarge                         24                        64
c8i.metal-48xl                       24                        64
```

------
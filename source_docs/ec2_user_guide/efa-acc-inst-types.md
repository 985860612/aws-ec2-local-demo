

# 使用多网卡最大化 Amazon EC2 实例上的网络带宽
<a name="efa-acc-inst-types"></a>

许多支持 EFA 的实例类型也有多个网卡。有关更多信息，请参阅 [网卡](using-eni.md#network-cards)。如果您计划将 EFA 用于其中一种实例类型，建议使用以下基本配置：
+ 对于主网络接口（网卡索引 `0`、设备索引 `0`），请创建一个 ENA 接口。您不能使用仅限 EFA 的网络接口作为主网络接口。
+ 如果网卡索引 0 支持 EFA，则为网卡索引 `0` 设备索引 `1` 创建一个仅限 EFA 的网络接口。
+ 对于其他的每个网络接口，请将下一个未使用的网卡索引、设备索引 `0` 用于仅限 EFA 的网络接口，以及/或者将设备索引 `1` 用于 ENA 网络接口，具体取决于您的使用案例，例如 ENA 带宽要求或 IP 地址空间。有关示例使用案例，请参阅 [P5 和 P5e 实例的 EFA 配置](#efa-for-p5)。

**注意**  
P5 实例需要以特定方式配置网络接口，以实现最大化网络带宽。有关更多信息，请参阅 [P5 和 P5e 实例的 EFA 配置](#efa-for-p5)。

以下示例显示如何根据这些建议启动实例。

------
#### [ Instance launch ]

**要在实例启动期间使用启动实例向导指定 EFA**

1. 在**网络设置**部分中，选择**编辑**。

1. 展开**高级网络配置**。

1. 对于主网络接口（网卡索引 `0`、设备索引 `0`），请创建一个 ENA 接口。您不能使用仅限 EFA 的网络接口作为主网络接口。

1. 如果网卡索引 0 支持 EFA，则为网卡索引 `0` 设备索引 `1` 创建一个仅限 EFA 的网络接口。

1. 对于其他的每个网络接口，请将下一个未使用的网卡索引、设备索引 `0` 用于仅限 EFA 的网络接口，以及/或者将设备索引 `1` 用于 ENA 网络接口，具体取决于您的使用案例，例如 ENA 带宽要求或 IP 地址空间。有关示例使用案例，请参阅 [P5 和 P5e 实例的 EFA 配置](#efa-for-p5)。

**要在实例启动期间使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令指定 EFA**  
对于 `--network-interfaces`，请指定所需的网络接口数量。对于主网络接口，指定 `NetworkCardIndex=0`、`DeviceIndex=0` 和 `InterfaceType=interface`。如果网卡索引 0 支持 EFA，请指定 `NetworkCardIndex=0`、`DeviceIndex=1` 和 `InterfaceType=efa-only`。对于任何其他网络接口，请将 `NetworkCardIndex` 指定为下一个未使用的索引，将 `InterfaceType=efa-only` 指定为 `DeviceIndex=0`，以及/或者将 `InterfaceType=interface` 指定为 `DeviceIndex=1`。

以下示例命令片段显示具有 32 个 EFA 设备和一个 ENA 设备的请求。

```
$ aws ec2 run-instances \
 --instance-type p5.48xlarge \
 --count 1 \
 --key-name {{key_pair_name}} \
 --image-id {{ami-0abcdef1234567890}} \
 --network-interfaces "NetworkCardIndex=0,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=0,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=1,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=2,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=3,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=4,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=5,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=6,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=7,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=8,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=9,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=10,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=11,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=12,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=13,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=14,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=15,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=16,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=17,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=18,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=19,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=20,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=21,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=22,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=23,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=24,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=25,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=26,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=27,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=28,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=29,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=30,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=31,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only"
...
```

------
#### [ Launch templates ]

**要使用 Amazon EC2 控制台将 EFA 添加到启动模板**

1. 在**网络设置**中，展开**高级网络配置**。

1. 对于主网络接口（网卡索引 `0`、设备索引 `0`），请创建一个 ENA 接口。您不能使用仅限 EFA 的网络接口作为主网络接口。

1. 如果网卡索引 0 支持 EFA，则为网卡索引 `0` 设备索引 `1` 创建一个仅限 EFA 的网络接口。

1. 对于其他的每个网络接口，请将下一个未使用的网卡索引、设备索引 `0` 用于仅限 EFA 的网络接口，以及/或者将设备索引 `1` 用于 ENA 网络接口，具体取决于您的使用案例，例如 ENA 带宽要求或 IP 地址空间。有关示例使用案例，请参阅 [P5 和 P5e 实例的 EFA 配置](#efa-for-p5)。

**要使用 [create-launch-template](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-launch-template.html) 命令将 EFA 添加到启动模板**  
对于 `NetworkInterfaces`，请指定所需的网络接口数量。对于主网络接口，指定 `NetworkCardIndex=0`、`DeviceIndex=0` 和 `InterfaceType=interface`。如果网卡索引 0 支持 EFA，请指定 `NetworkCardIndex=0`、`DeviceIndex=1` 和 `InterfaceType=efa-only`。对于任何其他网络接口，请将 `NetworkCardIndex` 指定为下一个未使用的索引，将 `InterfaceType=efa-only` 指定为 `DeviceIndex=0`，以及/或者将 `InterfaceType=interface` 指定为 `DeviceIndex=1`。

以下代码段显示可能的 32 个网络接口中 3 个网络接口的示例。

```
"NetworkInterfaces":[
{
  "NetworkCardIndex":0,
  "DeviceIndex":0,
  "InterfaceType": "interface",
  "AssociatePublicIpAddress":false,
  "Groups":[
    "{{security_group_id}}"
  ],
  "DeleteOnTermination":true
},
{
  "NetworkCardIndex": 0,
  "DeviceIndex": 1,
  "InterfaceType": "efa-only",
  "AssociatePublicIpAddress":false,
  "Groups":[
    "{{security_group_id}}"
  ],
  "DeleteOnTermination":true
},
{
  "NetworkCardIndex": 1,
  "DeviceIndex": 0,
  "InterfaceType": "efa-only",
  "AssociatePublicIpAddress":false,
  "Groups":[
    "{{security_group_id}}"
  ],
  "DeleteOnTermination":true
},
{
  "NetworkCardIndex": 2,
  "DeviceIndex": 0,
  "InterfaceType": "efa-only",
  "AssociatePublicIpAddress":false,
  "Groups":[
    "{{security_group_id}}"
  ],
  "DeleteOnTermination":true
},
{
  "NetworkCardIndex": 3,
  "DeviceIndex": 0,
  "InterfaceType": "efa-only",
  "AssociatePublicIpAddress":false,
  "Groups":[
    "{{security_group_id}}"
  ],
  "DeleteOnTermination":true
}
...
```

------

## P5 和 P5e 实例的 EFA 配置
<a name="efa-for-p5"></a>

`p5.48xlarge` 和 `p5e.48xlarge` 实例支持 32 个网卡，总网络带宽容量为 3200 Gbps，其中最高 800 Gbps 可用于 IP 网络流量。由于 EFA 和 IP 网络流量共享相同的底层资源，因此一方使用的带宽会减少另一方可用的带宽。这意味着，只要总带宽不超过 3,200 Gbps 且 IP 带宽不超过 800 Gbps，就可以按任意组合在 EFA 流量和 IP 流量之间分配网络带宽。例如，如果您使用 400 Gbps 的 IP 带宽，则可以同时获得高达 2800 Gbps 的 EFA 带宽。

**使用案例 1：保存 IP 地址并避免潜在的 Linux IP 问题**

此配置通过一个私有 IP 地址提供高达 3,200 Gbps 的 EFA 网络带宽和高达 100 Gbps 的 IP 联网带宽。此配置还有助于避免潜在的 Linux IP 问题，例如不允许自动分配公有 IP 地址和 IP 路由挑战（主机名到 IP 地址的映射问题和源 IP 地址不匹配），如果实例有多个网络接口，则可能会出现这些问题。
+ 对于主网络接口（网卡索引 0、设备索引 0），请使用一个 ENA 接口。
+ 对于网卡索引 0、设备索引 1，请创建一个仅限 EFA 的网络接口。
+ 对于其余的网络接口（网卡索引 1-31、设备索引 0），请使用仅限 EFA 的网络接口。

**使用案例 2：最大 EFA 和 IP 网络带宽**

此配置通过 8 个私有 IP 地址提供高达 3,200 Gbps 的 EFA 网络带宽和高达 800 Gbps 的 IP 联网带宽。您无法使用此配置自动分配公有 IP 地址。但是，您可以在启动后将弹性 IP 地址连接到主网络接口（网卡索引 0、设备索引 0）以实现互联网连接。
+ 对于主网络接口（网卡索引 0、设备索引 0），使用 EFA 网络接口。
+ 对于其余接口，执行以下操作：
  + 在网卡索引 0、设备索引 1 上指定仅限 EFA 的网络接口，对于网卡接口 1、2 和 3，请使用设备索引 0。
  + 在以下**每个**网卡索引子集中，指定一个 ENA 网络接口和四个仅限 EFA 的网络接口；对仅限 EFA 的网络接口，请使用设备索引 0：
    + [4、5、6、7]
    + [8、9、10、11]
    + [12、13、14、15]
    + [16、17、18、19]
    + [20、21、22、23]
    + [24、25、26、27]
    + [28、29、30、31]

下面的示例对此配置进行说明：

```
$ aws --region $REGION ec2 run-instances \
 --instance-type p5.48xlarge \
 --count 1 \
 --key-name key_pair_name \
 --image-id ami_id \
 --network-interfaces "NetworkCardIndex=0,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=0,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=1,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=2,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=3,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=4,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=4,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=5,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=6,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=7,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=8,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=8,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=9,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=10,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=11,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=12,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=12,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=13,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=14,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=15,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=16,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=16,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=17,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=18,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=19,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=20,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=20,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=21,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=22,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=23,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=24,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=24,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=25,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=26,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=27,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=28,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=28,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=29,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=30,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=31,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only"
...
```

## P6-B200 实例的 EFA 配置
<a name="efa-for-p6-b200"></a>

P6-B200 实例的总网络带宽容量为 3200 Gbps，其中最高 1600 Gbps 可用于 ENA。这些实例有 8 个 GPU 和 8 个网卡，其中每个网卡支持高达 400 Gbps 的 EFA 带宽和 200 Gbps 的 ENA 带宽。由于 EFA 和 ENA 流量共享相同的底层资源，因此一方使用的带宽会减少另一方可用的带宽。

**使用案例 1：保存 IP 地址**

此配置每个实例至少消耗一个私有 IP 地址并支持高达 3200 Gbps 的 EFA 带宽和高达 200 Gbps 的 ENA 带宽。
+ 对于主网络接口（网卡索引 0、设备索引 0），请使用一个 ENA 接口。
+ 对于网卡索引 0、设备索引 1，请创建一个仅限 EFA 的网络接口。
+ 对于其余 7 个网卡（网卡索引 1-7，设备索引 0），使用仅限 EFA 的网络接口。

**使用案例 2：最大 EFA 和 ENA 带宽**

此配置每个实例至少消耗 8 个私有 IP 地址并支持高达 3200 Gbps 的 EFA 带宽和高达 1600 Gbps 的 ENA 带宽。
+ 对于主网络接口（网卡索引 0、设备索引 0），请使用一个 ENA 接口。
+ 对于网卡索引 0、设备索引 1，请创建一个仅限 EFA 的网络接口。
+ 对于其余 7 个网卡（网卡索引 1-7），请在设备索引 0 上创建一个仅限 EFA 的网络接口，并在设备索引 1 上创建一个 ENA 网络接口。

## P6e-GB200 实例的 EFA 配置
<a name="efa-for-p6e"></a>

P6e-GB200 实例最多可以配置 17 个网卡。下图显示 P6e-GB200 实例的物理网络接口卡（NIC）布局以及网卡索引（NCI）的映射。

![P6e-GB200 实例的物理网络接口卡（NIC）和网卡索引（NCI）映射。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/p6e.png)


主 NCI（索引 0）支持高达 100 Gbps 的 ENA 带宽。具有以下索引的 NCI 支持仅限 EFA 的网络接口和 400 Gbps 的 EFA 带宽：[1、3、5、7、9、11、13、15]。具有以下索引的 NCI 支持高达 200 Gbps 的 ENA 或 EFA 带宽：[2、4、6、8、10、12、14、16]。

以下组中的 NCI 共享主机上的底层物理 NIC：
+ [1 和 2]
+ [3 和 4]
+ [5 和 6]
+ [7 和 8]
+ [9 和 10]
+ [11 和 12]
+ [13 和 14]
+ [15 和 16]

每个物理 NIC 支持高达 400 Gbps 的带宽。由于这些组中的 NCI 共享相同的底层物理 NIC，因此一个 NCI 使用的带宽会减少另一个 NCI 可用的带宽。例如，如果 NCI 2 使用 200 Gbps 的 ENA 带宽，则 NCI 1 可以同时使用高达 200 Gbps 的 EFA 带宽。

主机上的每个底层 GPU 都可以通过以下几对 NCI 直接发送流量：
+ [1 和 3]
+ [5 和 7]
+ [9 和 11]
+ [13 和 15]

每个 GPU 支持高达 400 Gbps 的 EFA 带宽。由于这些组中的网卡共享相同的 GPU，因此一个网卡使用的带宽会减少另一个网卡可用的带宽。例如，如果 NCI 1 使用 200 Gbps 的 EFA 带宽，则 NCI 3 可以同时使用高达 200 Gbps 的 EFA 带宽。因此，为了实现最高 EFA 性能，我们建议您执行**以下操作之一**，以实现总计 1600 Gbps 的 EFA 带宽：
+ 在每个组中仅向一个 NCI 添加仅限 EFA 的网络接口，以实现每个网络接口 400 Gbps（*4 个 EFA 网络接口 x 400 Gbps*）。
+ 向每个组中的每个 NCI 添加仅限 EFA 的网络接口，以实现每个网络接口 200 Gbps（*8 个 EFA 网络接口 x 200 Gbps*）。

例如，以下配置使用每个 NCI 组中一个仅限 EFA 的网络接口提供高达 1600 Gbps 的 EFA 带宽，并仅使用主 NCI（索引 0）提供高达 100 Gbps 的 ENA 网络带宽。
+ 对于主 NCI（网卡索引 0、设备索引 0），使用 EFA 网络接口。
+ 将仅限 EFA 的网络接口添加到以下位置：
  + NCI 1，设备索引 0
  + NCI 5，设备索引 0
  + NCI 9，设备索引 0
  + NCI 13，设备索引 0

## P6-B300 实例的 EFA 配置
<a name="efa-for-p6-b300"></a>

对于 EFA 流量，P6-B300 实例的总网络带宽容量高达 6400 Gbps，对于 ENA 流量高达 3870 Gbps。它们有 8 个 GPU 和 17 个网卡，其中主网卡仅支持带宽高达 350 Gbps 的 ENA 网络接口。辅助网卡支持高达 400 Gbps 的 EFA 带宽和高达 220 Gbps 的 ENA 带宽。由于 EFA 和 ENA 流量共享相同的底层资源，因此一方使用的带宽会减少另一方可用的带宽。

![P6-B300 实例的物理网络接口卡（NIC）和网卡索引（NCI）映射。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/p6-b300.png)


**使用案例 1：保存 IP 地址**

此配置每个实例至少消耗一个私有 IP 地址并支持高达 6400 Gbps 的 EFA 带宽和高达 350 Gbps 的 ENA 带宽。
+ 对于主网络接口（网卡索引 0、设备索引 0），使用 EFA 网络接口。
+ 对于其余网卡（网卡索引 1-16，设备索引 0），请使用仅限 EFA 的网络接口。

```
--network-interfaces \
"NetworkCardIndex=0,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=1,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=2,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=3,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=4,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=5,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=6,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=7,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=8,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=9,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=10,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=11,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=12,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=13,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=14,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=15,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=16,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only"
```

**使用案例 2：最大 EFA 和 ENA 带宽**

此配置每个实例至少消耗 17 个私有 IP 地址并支持高达 6400 Gbps 的 EFA 带宽和高达 3870 Gbps 的 ENA 带宽。
+ 对于主网络接口（网卡索引 0、设备索引 0），使用 EFA 网络接口。
+ 对于其余的网卡，请创建一个仅限 EFA 的接口（网卡索引 1-16，设备索引 0）和一个 ENA 接口（网卡索引 1-16，设备索引 1）。

```
--network-interfaces \
"NetworkCardIndex=0,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=1,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=2,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=3,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=4,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=5,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=6,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=7,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=8,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=9,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=10,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=11,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=12,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=13,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=14,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=15,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=16,DeviceIndex=0,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=efa-only" \
"NetworkCardIndex=1,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=2,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=3,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=4,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=5,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=6,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=7,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=8,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=9,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=10,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=11,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=12,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=13,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=14,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=15,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface" \
"NetworkCardIndex=16,DeviceIndex=1,Groups={{security_group_id}},SubnetId={{subnet_id}},InterfaceType=interface"
```
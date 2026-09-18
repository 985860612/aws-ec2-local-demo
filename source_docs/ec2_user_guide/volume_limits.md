

# Amazon EC2 实例的 Amazon EBS 卷限制
<a name="volume_limits"></a>

您可以挂载到实例的最大 Amazon EBS 卷数取决于实例类型和实例规模。如果超过了实例的卷挂载限制，则连接请求将会失败并显示 `AttachmentLimitExceeded` 错误。

考虑应将多少个卷添挂载到实例时，应考虑是否需要增加 I/O 带宽或存储容量。

**带宽与容量**  
为获得一致且可预测的带宽使用案例，请将经 Amazon EBS 优化的实例与通用型 SSD 卷或预调配 IOPS SSD 卷结合使用。要获取最大性能，请将您为卷预置的 IOPS 与实例类型带宽匹配。

对于 RAID 配置，您可能会发现大于 8 个卷的阵列由于 I/O 开销提高而降低了性能回报。测试您的各个应用程序性能并根据需要优化。

**Contents**
+ [在 Nitro 系统上构建的实例卷的限制](#nitro-system-limits)
  + [专用 EBS 卷限制](#dedicated-limit)
  + [共享 EBS 卷限制](#shared-limit)
+ [基于 Xen 的实例的卷限制](#xen-limits)
  + [Linux 实例](#linux-specific-volume-limits)
  + [Windows 实例](#windows-specific-volume-limits)

## 在 Nitro 系统上构建的实例卷的限制
<a name="nitro-system-limits"></a>

基于 Nitro System 构建的实例的卷限制取决于实例类型。某些 Nitro 实例类型具有**专用 EBS 卷限制**，而大多数实例类型具有**共享卷限制**。要查看每种实例类型的卷附加限制，请参阅以下内容：
+ [Amazon EBS 规格 – 通用型](https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html#gp_storage-ebs)
+ [Amazon EBS 规格 – 计算优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html#co_storage-ebs)
+ [Amazon EBS 规格 – 内存优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html#mo_storage-ebs)
+ [Amazon EBS 规格 – 存储优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/so.html#so_storage-ebs)
+ [Amazon EBS 规格 – 加速计算型](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html#ac_storage-ebs)
+ [Amazon EBS 规格 – 高性能计算型](https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html#hpc_storage-ebs)
+ [Amazon EBS 规格 – 上一代](https://docs.aws.amazon.com/ec2/latest/instancetypes/pg.html#pg_storage-ebs)

### 专用 EBS 卷限制
<a name="dedicated-limit"></a>

以下 Nitro 实例类型的专用 EBS 卷限制取决于实例大小。此限制不与其他设备挂载共享。换句话说，无论连接的设备（如 NVMe 实例存储卷和网络接口）有多少，您都可以连接不超过卷挂载限制的任意数量的 EBS 卷。
+ **通用型：**M7a \| M7i \| M7i-flex \| M8a \| M8azn \| M8g \| M8gb \| M8gd \| M8gn \| M8i \| M8id \| M8i-flex \| M8in \| M8idn \| M8ine \| M8ib \| M8idb \| M9g \| M9gd
+ **计算优化型：**C7a \| C7i \| C7i-flex \| C8a \| C8g \| C8gb \| C8gd \| C8gn \| C8i \| C8id \| C8i-flex \| C8in \| C8ine \| C8ib \| C9g \| C9gd
+ **内存优化型：**R7a \| R7i \| R7iz \| R8a \| R8g \| R8gb \| R8gd \| R8gn \| R8i \| R8id \| R8i-flex \| R8in \| R8idn \| R8ib \| R8idb \| R9g \| R9gd \| U7i-6tb \| U7i-8tb \| U7i-12tb \| U7in-16tb \| U7in-24tb \| U7in-32tb \| U7inh-32tb \| X8g \| X8aedz \| X8i
+ **存储优化型：**I7i \| I7ie \| I8g \| I8ge
+ **加速计算型：**F2 \| G6 \| G6e \| G6f \| Gr6 \| Gr6f \| G7 \| G7e \| P4d \| P4de \| P5 \| P5e \| P5en \| P6-B200 \| P6-B300 \| P6e-GB200 \| Trn2 \| Trn2u
+ **高性能计算型：**Hpc7a \| Hpc8a

### 共享 EBS 卷限制
<a name="shared-limit"></a>

所有其他 Nitro 实例类型（[专用 EBS 卷限制](#dedicated-limit) 中未列出）都有卷挂载限制，该限制在 Amazon EBS 卷、网络接口和 NVMe 实例存储卷之间共享。您可以连接任意数量的 Amazon EBS 卷，但是不能超过该限制（减去连接的网络接口和 NVMe 实例存储卷的数量）。请记住，每个实例必须至少有一个网络接口，并且 NVMe 实例存储卷在启动时会自动附加。

大多数 Nitro 实例最多支持 28 个附加项。以下示例演示如何计算可以附加的 EBS 卷数量。

**示例**
+ 对于只有主网络接口的 `m5.xlarge` 实例，您可以附加 27 个 EBS 卷。

  28 个卷 - 1 个网络接口 = 27 个
+ 使用带有两个额外网络接口的 `m5.xlarge` 实例时，您可以附加 25 个 EBS 卷。

  28 个卷 - 3 个网络接口 = 25 个
+ 使用带有两个额外网络接口的 `m5d.xlarge` 实例时，您可以附加 24 个 EBS 卷。

  28 个卷 - 3 个网络接口 - 1 个 NVMe 实例存储卷 = 24 个

## 基于 Xen 的实例的卷限制
<a name="xen-limits"></a>

对于 T2 等基于 Xen 的实例，卷限制取决于操作系统。

有关更多信息，请参阅[基于 Xen 的实例](instance-types.md#instance-hypervisor-type)。

### Linux 实例
<a name="linux-specific-volume-limits"></a>

将超过 40 个卷附加到基于 Xen 的 Linux 实例可能会导致启动失败。此数字包括根卷以及所有附加的实例存储卷和 Amazon EBS 卷。

如果连接了大量卷的实例出现启动问题，请停止该实例，分离所有在启动过程中不必要的卷，启动该实例，然后在实例运行之后重新附加这些卷。

**重要**  
如果将 40 个以上的卷附加到基于 Xen 的 Linux 实例，系统只会尽力支持，不对此进行保证。

### Windows 实例
<a name="windows-specific-volume-limits"></a>

下表基于所使用的驱动程序显示基于 Xen 的 Windows 实例的卷限制。这些数字包括根卷以及所有附加的实例存储卷和 Amazon EBS 卷。


| 驱动程序 | 卷限制 | 
| --- | --- | 
| AWS PV | 26 | 
| Citrix 半虚拟化驱动程序 | 26 | 
| Red Hat 半虚拟化 | 17 | 

建议使用 AWS PV 或 Citrix PV 驱动程序连接至基于 Xen 的 Windows 实例的卷不要超过 26 个，否则可能导致性能问题。要确定您的实例所使用的半虚拟化驱动程序，或是要将 Windows 实例从 Red Hat 升级到 Citrix 半虚拟化驱动程序，请参阅 [在 EC2 Windows 实例上升级半虚拟化驱动程序](Upgrading_PV_drivers.md)。

**重要**  
如果附加到基于 Xen 的 Windows 实例的卷的数量超过下面的数字，系统只会尽力支持，不对此提供保证。

有关设备名称如何与卷相关联的更多信息，请参阅 [如何为 Amazon EC2 Windows 实例附加和映射卷](ec2-windows-volumes.md)。
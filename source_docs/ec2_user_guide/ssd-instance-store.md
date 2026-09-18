

# 适用于 EC2 实例的 SSD 实例存储卷
<a name="ssd-instance-store"></a>

像其他实例存储卷一样，您必须在启动实例时为其映射 SSD 实例存储卷。SSD 实例卷上的数据仅在其关联实例的生命周期内保留。有关更多信息，请参阅[将实例存储卷添加到 EC2 实例](add-instance-store-volumes.md)。

## NVMe SSD 卷
<a name="nvme-ssd-volumes"></a>

有些实例提供符合非易失性存储器规范（NVMe）的固态硬盘（SSD）实例存储卷。有关每种实例类型支持的实例存储卷类型的更多信息，请参阅[EC2 实例的实例存储卷限制](instance-store-volumes.md)。

NVMe 实例存储上的数据是使用在实例上的硬件模块中实施的 XTS-AES-256 数据块密码加密的。加密密钥是使用硬件模块生成的，并且对每台 NVMe 实例存储设备都是唯一的。当实例停止或终止并且无法恢复时，将销毁所有加密密钥。无法禁用此加密，并且无法提供自己的加密密钥。

### Linux 实例
<a name="nvme-ssd-linux"></a>

要访问 NVMe 卷，必须安装 NVMe 驱动程序。以下 AMI 满足此要求：
+ AL2023
+ Amazon Linux 2
+ Amazon Linux AMI 2018.03 和更高版本
+ Ubuntu 14.04 或更高版本（采用 `linux-aws` 内核）
**注意**  
AWS 基于 Graviton 的实例类型需要 Ubuntu 18.04 或更高版本（采用 `linux-aws` 内核）
+ Red Hat Enterprise Linux 7.4 或更高版本
+ SUSE Linux Enterprise Server 12 SP2 或更高版本
+ CentOS 7.4.1708 或更高版本
+ FreeBSD 11.1 或更高版本
+ Debian GNU/Linux 9 或更高版本
+ Bottlerocket

连接到实例后，您可以使用 **lspci** 命令列出 NVMe 设备。以下是支持 4 台 NVMe 设备的 `i3.8xlarge` 实例的示例输出。

```
[ec2-user ~]$ lspci
00:00.0 Host bridge: Intel Corporation 440FX - 82441FX PMC [Natoma] (rev 02)
00:01.0 ISA bridge: Intel Corporation 82371SB PIIX3 ISA [Natoma/Triton II]
00:01.1 IDE interface: Intel Corporation 82371SB PIIX3 IDE [Natoma/Triton II]
00:01.3 Bridge: Intel Corporation 82371AB/EB/MB PIIX4 ACPI (rev 01)
00:02.0 VGA compatible controller: Cirrus Logic GD 5446
00:03.0 Ethernet controller: Device 1d0f:ec20
00:17.0 Non-Volatile memory controller: Device 1d0f:cd01
00:18.0 Non-Volatile memory controller: Device 1d0f:cd01
00:19.0 Non-Volatile memory controller: Device 1d0f:cd01
00:1a.0 Non-Volatile memory controller: Device 1d0f:cd01
00:1f.0 Unassigned class [ff80]: XenSource, Inc. Xen Platform Device (rev 01)
```

如果您使用了受支持的操作系统但未看到 NVMe 设备，请使用以下命令验证是否已加载 NVMe 模块。
+ Amazon Linux、Amazon Linux 2、Ubuntu 14/16、Red Hat Enterprise Linux、SUSE Linux Enterprise Server、CentOS 7

  ```
  $ lsmod | grep nvme
  nvme          48813  0
  ```
+ Ubuntu 18

  ```
  $ cat /lib/modules/$(uname -r)/modules.builtin | grep nvme
  s/nvme/host/nvme-core.ko
  kernel/drivers/nvme/host/nvme.ko
  kernel/drivers/nvmem/nvmem_core.ko
  ```

NVMe 卷符合 NVMe 1.0e 规范。您可以对 NVMe 卷使用 NVMe 命令。利用 Amazon Linux，您可以使用 `nvme-cli` 命令从存储库安装 **yum install** 程序包。利用其他受支持的 Linux 版本，您可以下载 `nvme-cli` 包（如果包在映像中不可用）。

### Windows 实例
<a name="nvme-ssd-windows"></a>

以下操作系统的最新 AWS Windows AMI 包含用于与显示为 NVMe 块设备的 SSD 实例存储卷进行交互的 AWS NVMe 驱动程序，以提高性能：
+ Windows Server 2025
+ Windows Server 2022
+ Windows Server 2019
+ Windows Server 2016
+ Windows Server 2012 R2

连接到实例后，您可以验证 Disk Manager 中是否显示了 NVMe 卷。在任务栏上，打开 Windows 徽标的上下文（右键单击）菜单，然后选择**磁盘管理**。

由 Amazon 提供的 AWS Windows AMI 包含 AWS NVMe 驱动程序。如果您使用的不是最新 AWS Windows AMI，则可以[安装最新的 AWS NVMe 驱动程序](aws-nvme-drivers.md)。

## 非 NVMe SSD 卷
<a name="ssd-volumes"></a>

以下实例支持使用非 NVMe SSD 来提供高随机 /O 性能的实例存储卷：C3、I2、M3、R3 和 X1。有关每种实例类型支持的实例存储卷的更多信息，请参阅[EC2 实例的实例存储卷限制](instance-store-volumes.md)。

## 基于 SSD 的实例存储卷的 I/O 性能
<a name="ssd-volume-perf"></a>

随着您不断在您的实例的基于 SSD 的实例存储卷中填充数据，您可以达到的写入 IOPS 将不断减少。这是因为，SSD 控制器必须执行额外的工作，即查找可用空间、重写现有数据，以及擦除未使用的空间以使之可供重写。这一垃圾回收过程将导致对 SSD 的内部写入放大影响，这以 SSD 写入操作数相对于用户写入操作数的比率形式来表示。如果写入操作数并非 4096 字节的倍数，或不在 4096 字节这一边界上，则性能的降低会更明显。如果您写入的字节数较少或不在边界上，则 SSD 控制器必须读取周围的数据并在新位置存储结果。这种模式会大大增加写入放大的影响，加长延迟，并显著降低 I/O 性能。

SSD 控制器可以使用多种策略来减少写入放大的影响。其中的一个策略是在 SSD 实例存储中预订空间，以便控制器更高效地管理可用于写入操作的空间。这称为*超额配置*。为实例提供的基于 SSD 的实例存储卷不会为超额预置预保留任何空间。要减少写入放大问题造成的影响，建议您留出 10% 的卷空间不进行分区，以便 SSD 控制器使用这部分空间进行超额预置。虽然这会减少您可使用的存储空间，但可提高性能，即使磁盘容量快用完也是如此。

对于支持 TRIM 的实例存储卷，可在不再需要已写入的数据时，使用 TRIM 命令告知 SSD 控制器此情况。这将为控制器提供更多可用空间，从而可以减少写入放大的影响并提高性能。有关更多信息，请参阅 [实例存储卷 TRIM 支持](#InstanceStoreTrimSupport)。

## 实例存储卷 TRIM 支持
<a name="InstanceStoreTrimSupport"></a>

某些实例类型支持带有 TRIM 的 SSD 卷。有关更多信息，请参阅 [EC2 实例的实例存储卷限制](instance-store-volumes.md)。

**注意**  
（仅限 Windows 实例）从 AWS PV 驱动程序版本 7.3.0 起，运行 Windows Server 2012 R2 的实例支持 TRIM。运行更低版本的 Windows Server 的实例不支持 TRIM。

支持 TRIM 的实例存储卷先经全面删减，然后再分配到您的实例。这些卷在实例启动时未经过文件系统的格式化处理，因此，您必须先进行格式化，而后才能挂载和使用。为了更快地访问这些卷，您在格式化它们时应跳过 TRIM 操作。

（Windows 实例）要在初始格式化过程中暂时禁用 TRIM 支持，请使用 `fsutil behavior set DisableDeleteNotify 1` 命令。完成格式化后，使用 `fsutil behavior set DisableDeleteNotify 0` 重新启用 TRIM 支持。

利用支持 TRIM 的实例存储卷，您可在不再需要已写入的数据时使用 TRIM 命令告知 SSD 控制器此情况。这将为控制器提供更多可用空间，从而可以减少写入放大的影响并提高性能。在 **Linux 实例**上，使用 `fstrim` 命令启用定期 TRIM。在 **Windows 实例**上，使用 `fsutil behavior set DisableDeleteNotify 0` 命令确保在正常操作期间启用 TRIM 支持。
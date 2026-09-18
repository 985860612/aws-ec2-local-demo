

# Amazon EC2 实例上卷的设备名称
<a name="device_naming"></a>

当您将卷附加到实例时，需要为卷提供设备名称。该设备名称由 Amazon EC2 使用。实例的块储存设备驱动程序会在装载卷时分配实际的卷名称，指定的名称可以与 Amazon EC2 使用的名称不同。

您的实例可支持的卷的数量取决于操作系统。有关更多信息，请参阅[Amazon EC2 实例的 Amazon EBS 卷限制](volume_limits.md)。

**Topics**
+ [可用设备名称](#available-ec2-device-names)
+ [设备名称注意事项](#device-name-limits)

## 可用设备名称
<a name="available-ec2-device-names"></a>

### Linux 实例
<a name="device-names-linux"></a>

对 Linux 实例提供两种类型的虚拟化：半虚拟化（PV）和硬件虚拟机（HVM）。实例的虚拟化类型由用于启动实例的 AMI 确定。支持 HVM AMI 的所有实例类型。上一代的某些实例类型支持半虚拟化 AMI。请务必注意您的 AMI 的虚拟化类型，因为推荐的和您可以使用的可用设备名称取决于您的实例的虚拟化类型。有关更多信息，请参阅 [虚拟化类型](ComponentsAMIs.md#virtualization_types)。

下表列出了在块储存设备映射中或附加 EBS 卷时您可指定的可用设备名称。


| 虚拟化类型 | 可用 | 为根卷预留 | 建议用于 EBS 数据卷  | 实例存储卷 | 
| --- | --- | --- | --- | --- | 
| 半虚拟化 | /dev/sd[a-z]<br />/dev/sd[a-z][1-15]<br />/dev/hd[a-z]<br />/dev/hd[a-z][1-15] | /dev/sda1 | /dev/sd[f-p]<br />/dev/sd[f-p][1-6] | /dev/sd[b-e] | 
| 全虚拟化 | /dev/sd[a-z]<br />/dev/xvd[a-c][a-z]<br />/dev/xvdd[a-x] | 不同的 AMI<br />/dev/sda1 或 /dev/xvda | /dev/sd[b-z] <br />/dev/xvdb[b-z]<br />\* | /dev/sd[b-e]<br />/dev/sd[b-h]（h1.16xlarge）<br />/dev/sd[b-y]（d2.8xlarge）<br />/dev/sd[b-i]（i2.8xlarge）<br />\*\* | 

\* 您在块设备映射中为 NVMe EBS 卷指定的设备名称将使用 NVMe 设备名称（`/dev/nvme[0-26]n1`）进行重命名。块储存设备驱动程序可以使用不同于您在块储存设备映射中为卷指定的顺序来分配 NVMe 设备名称。

\*\* 将自动枚举 NVMe 实例存储卷并为其分配 NVMe 设备名称。

### Windows 实例
<a name="device-names-windows"></a>

AWS Windows AMI 使用其中一组驱动程序来允许访问虚拟化硬件：
+ AWS PV：[Windows 实例的半虚拟化驱动程序](xen-drivers-overview.md)
+ AWS NVMe：[NVMe 驱动程序](aws-nvme-drivers.md)

**基于 Nitro 的实例的设备名称**  
下表列出了可在块设备映射中或将 EBS 卷附加到基于 Nitro 的实例时指定的可用设备名称。


| 驱动程序类型 | 可用 | 为根卷预留 | 建议用于 EBS 卷 | 实例存储卷 | 
| --- | --- | --- | --- | --- | 
| AWS NVMe | xvd[a-z]<br />xvd[a-c][a-z]<br />xvdd[a-x]<br />/dev/sda1 | /dev/sda1 | xvd[b-z]<br />xvdb[b-z] | \* | 

\*系统将自动枚举 NVMe 实例存储卷并为其分配 Windows 驱动器号。

**基于 Xen 的实例的设备名称**  
下表列出了可在块设备映射中或将 EBS 卷附加到基于 Xen 的实例时指定的可用设备名称。


| 驱动程序类型 | 可用 | 为根卷预留 | 建议用于 EBS 卷 | 实例存储卷 | 
| --- | --- | --- | --- | --- | 
| AWS PV | xvd[b-z]<br />xvd[b-c][a-z]<br />/dev/sda1<br />/dev/sd[b-e] | /dev/sda1 | xvd[f-z] | xvdc[a-x]<br />xvd[a-e] | 
| Citrix PV（不再支持） | xvd[b-z]<br />xvd[b-c][a-z]<br />/dev/sda1<br />/dev/sd[b-e] | /dev/sda1 | xvd[f-z] | xvdc[a-x]<br />xvd[a-e] | 
| Red Hat PV（不再支持） | xvd[a-z]<br />xvd[b-c][a-z]<br />/dev/sda1<br />/dev/sd[b-e] | /dev/sda1 | xvd[f-p] | xvdc[a-x]<br />xvd[a-e] | 

有关实例存储卷的更多信息，请参阅 [适用于 EC2 实例的实例存储临时块存储](InstanceStorage.md)。有关 NVMe EBS 卷（基于 Nitro 的实例）的更多信息，包括如何识别 EBS 设备，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 和 NVMe](https://docs.aws.amazon.com/ebs/latest/userguide/nvme-ebs-volumes.html)。

## 设备名称注意事项
<a name="device-name-limits"></a>

在选择设备名称时请记住以下原则：
+ 您使用的设备名称的结尾部分不应重叠，因为这可能会在您启动实例时导致问题。例如，避免对连接到同一实例的卷使用 `/dev/xvdf` 和 `xvdf` 之类的组合。
+ 尽管您可以使用用于附加实例存储卷的设备名附加 EBS 卷，我们还是强烈建议您不要这样做，因为这种操作具有不可预测性。
+ 实例的 NVMe 实例存储卷数取决于该实例的大小。将自动枚举 NVMe 实例存储卷并为其分配 NVMe 设备名称（Linux 实例）或 Windows 驱动器号（Windows 实例）。
+ （Windows 实例）AWS Windows AMI 附带其他软件，用于在首次启动时准备实例。此软件为 EC2Config 服务（Windows Server 2016 之前的 Windows AMI）或 EC2Launch（Windows Server 2016 及更高版本）。设备映射到驱动器后，驱动器即完成初始化和装载。根硬盘经过初始化后装载为 `C:\`。默认情况下，当 EBS 卷附加到 Windows 实例时，它在实例上可能会显示为任何盘符。您可以更改设置，以便按您的规范来设置卷的盘符。对于实例存储卷，默认设置则取决于驱动程序。AWSPV 驱动程序和 Citrix PV 驱动程序以从 Z: 到 A: 的顺序分配实例存储卷驱动器盘符。Red Hat 驱动程序按 D: 到 Z: 的顺序分配实例存储卷盘符。有关更多信息，请参阅 [Amazon EC2 Windows 实例上的 Windows 启动代理](configure-launch-agents.md) 和 [如何为 Amazon EC2 Windows 实例附加和映射卷](ec2-windows-volumes.md)。
+ （Linux 实例）根据内核的块设备驱动程序，附加的设备所采用的名称可能与您指定的名称不同。例如，如果您指定 `/dev/sdh` 的设备名称，则设备可能命名为 `/dev/xvdh` 或`/dev/hdh`。在大多数情况下，尾部字母保持不变。在某些版本的 Red Hat Enterprise Linux（及其变体，例如，CentOS）中，尾部字母可能发生变化（`/dev/sda` 可能变为 `/dev/xvde`）。在这些情况下，每个设备名称的尾部字母都会递增相同次数。例如，如果 `/dev/sdb` 重命名为 `/dev/xvdf`，则 `/dev/sdc` 重命名为 `/dev/xvdg`。Amazon Linux 为您对重命名设备指定的名称创建符号链接。其他操作系统的行为方式可能有所不同。
+ （Linux 实例）HVM AMI 不支持在设备名称中使用尾部数字，除为根卷保留的 `/dev/sda1` 和 `/dev/sda2` 以外。尽管可以使用 `/dev/sda2`，但我们不建议将此设备映射与 HVM 实例结合使用。
+ （Linux 实例）使用 PV AMI 时，您不能连接共享相同设备字母的卷，无论是否带有尾部数字都是如此。例如，如果您将一个卷附加为 `/dev/sdc`，另一个卷附加为 `/dev/sdc1`，则只有 `/dev/sdc` 将对实例可见。要在设备名称中使用尾部数字，您必须对所有基础字母相同的设备名称使用尾部数字（例如 `/dev/sdc1`、`/dev/sdc2`、`/dev/sdc3`）。
+ （Linux 实例）一些自定义内核可能会包含限制，限制使用 `/dev/sd[f-p]` 或 `/dev/sd[f-p][1-6]`。如果您在使用 `/dev/sd[q-z]` 或 `/dev/sd[q-z][1-6]` 时遇到问题，请尝试切换为 `/dev/sd[f-p]` 或 `/dev/sd[f-p][1-6]`。

在指定所选设备名称之前，请确认其是否可用。否则，您将收到设备名称已被使用的错误。要查看磁盘设备及其挂载点，请使用 **lsblk** 命令（Linux 实例）、磁盘管理实用程序或 **diskpart** 命令（Windows 实例）。
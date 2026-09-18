

# 更改实例类型的兼容性
<a name="resize-limitations"></a>

仅当实例的当前配置与您所需的实例类型兼容时，才能更改实例类型。如果您所需的实例类型与实例的当前配置不兼容，则您必须启动一个具有与新实例类型兼容的配置的新实例，并将应用程序迁移到新实例。

可通过以下方式确定兼容性：

**虚拟化类型**  
Linux AMI 使用两种虚拟化之一：半虚拟化 (PV) 或硬件虚拟机 (HVM)。如果是从 PV AMI 启动的实例，则您无法将其更改为仅限 HVM 的实例类型。有关更多信息，请参阅 [虚拟化类型](ComponentsAMIs.md#virtualization_types)。要查看实例的虚拟化类型，请在 Amazon EC2 控制台中查看 **Instances**（实例）屏幕的详细信息窗格中的 **Virtualization**（虚拟化）值。

**架构**  
AMI 特定于处理器的架构，因此您必须选择与当前实例类型具有相同处理器架构的实例类型。例如：  
+ 如果当前实例类型处理器是基于 Arm 架构的，则仅限于支持基于 Arm 架构的处理器的实例类型，例如 C6g 和 M6g。
+ 只有以下实例类型支持 32 位 AMIs：`t2.nano`、`t2.micro`、`t2.small`、`t2.medium`、`c3.large`、`t1.micro`、`m1.small`、`m1.medium` 和 `c1.medium`。如需更改 32 位实例的实例类型，则仅限使用以下实例类型。

**网络适配器**  
如果从一个网络适配器的驱动程序切换到另一个网络适配器，则在操作系统创建新的适配器时将重置网络适配器设置。要重新配置设置，您可能需要使用管理员权限访问本地账户。以下是从一个网络适配器移到另一个网络适配器的示例：  
+ AWS PV（T2 实例）到 Intel 82599 VF（M4 实例）
+ Intel 82599 VF（大多数 M4 实例）到 ENA（M5 实例）
+ ENA（M5 实例）到高带宽 ENA（M5n 实例）

**增强联网**  
支持[增强联网](enhanced-networking.md)的实例类型需要安装必要的驱动程序。例如，[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)需要安装了弹性网络适配器（ENA）驱动程序的 EBS-backed AMI。要将实例的实例类型从不支持增强联网的类型更改为支持增强联网的实例类型，必须根据需要在实例上安装 [ENA 驱动程序](enhanced-networking-ena.md)或 [ixgbevf 驱动程序](sriov-networking.md)。  
在启用 ENA Express 的情况下调整实例大小时，新实例类型必须同时支持 ENA Express。有关支持 ENA Express 的实例类型列表，请参阅 [ENA Express 支持的实例类型](ena-express.md#ena-express-supported-instance-types)。  
要将实例类型从支持 ENA Express 更改为不支持 ENA Express，请确保在调整实例大小之前尚未启用 ENA Express。

**NVMe**  
在[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)上，EBS 卷显示为 NVMe 块储存设备。如果将实例类型不支持 NVMe 的实例的实例类型更改为支持 NVMe 的实例类型，您必须先在实例上安装 NVMe 驱动程序。此外，您在块设备映射中所指定设备的设备名称将使用 NVMe 设备名称（`/dev/nvme[0-26]n1`）进行重命名。  
[Linux 实例] 因此，要使用 `/etc/fstab` 在启动时挂载文件系统，必须使用 UUID/标签而非设备名称。

**卷限制**  
您可以挂载到实例的最大 Amazon EBS 卷数取决于实例类型和实例规模。有关更多信息，请参阅 [Amazon EC2 实例的 Amazon EBS 卷限制](volume_limits.md)。  
您只能更改为支持的卷数与当前附加到实例的卷数相同或更大的实例类型或实例大小。如果您更改为不支持当前附加卷数量的实例类型或实例大小，则请求会失败。例如，如果您从具有 32 个附加卷的 `m7i.4xlarge` 实例更改为最多支持 27 个卷的 `m6i.4xlarge`，请求将失败。

**NitroTPM**  
如果使用已启用 [NitroTPM](nitrotpm.md) 且实例类型支持 NitroTPM 的 AMI 启动了实例，则该实例将在启用 NitroTPM 的情况下启动。您只能更改为使用同样支持 NitroTPM 的实例类型。
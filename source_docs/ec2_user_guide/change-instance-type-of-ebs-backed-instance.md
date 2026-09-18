

# 更改 Amazon EC2 实例的实例类型
<a name="change-instance-type-of-ebs-backed-instance"></a>

如果您需要的实例类型与实例的当前配置兼容，请按照以下说明来更改 Amazon EBS 支持的实例的实例类型。有关更多信息，请参阅 [更改实例类型的兼容性](resize-limitations.md)。

**注意事项**
+ 您必须先停止实例，然后才能更改其实例类型。当实例停止时，请确保您已计划停机时间。停止实例并更改其实例类型可能需要几分钟时间，重新启动实例所用的时间则由应用程序的启动脚本决定。有关更多信息，请参阅 [启动和停止 Amazon EC2 实例](Stop_Start.md)。
+ 当您停止并启动实例时，我们会将该实例移动到新硬件。如果您的实例具有公有 IPv4 地址，这并非弹性 IP，我们会释放该地址并向实例提供一个新的公有 IPv4 地址。有关实例在整个生命周期中的 IP 地址行为的更多信息，请参阅[实例状态之间的区别](ec2-instance-lifecycle.md#lifecycle-differences)。
+ 您无法更改[竞价型实例](using-spot-instances-request.md#stopping-a-spot-instance)的实例类型。
+ [Windows 实例] 建议您在更改实例类型之前，更新 AWS PV 驱动程序包。有关更多信息，请参阅 [在 EC2 Windows 实例上升级半虚拟化驱动程序](Upgrading_PV_drivers.md)。
+ 如果您的实例处于自动扩缩组中，则 Amazon EC2 Auto Scaling 服务会将已停止的实例标记为运行状况不佳，可能会终止该实例并启动替换实例。为防止出现此情况，您可以在更改实例类型时，为组暂停扩展流程。有关更多信息，请参阅 *Amazon EC2 Auto Scaling 用户指南*中的[暂停和恢复 Auto Scaling 组的进程](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-suspend-resume-processes.html)。
+ 当您更改具有 NVMe 实例存储卷实例的实例类型时，更新后的实例可能会有更多实例存储卷，因为即使没有在 AMI 或实例块储存设备映射中指定，所有 NVMe 实例存储卷都可用。否则，已更新的实例通常具有您在启动原始实例时指定的相同实例存储卷数。
+ 您可以挂载到实例的最大 Amazon EBS 卷数取决于实例类型和实例规模。您不能更改为不支持已附加到您实例的卷数量的实例类型或实例大小。有关更多信息，请参阅 [Amazon EC2 实例的 Amazon EBS 卷限制](volume_limits.md)。
+ [Linux 实例] 您可以使用 `AWSSupport-MigrateXenToNitroLinux` 运行手册将兼容 Linux 实例从 Xen 实例类型迁移到 Nitro 实例类型。有关更多信息，请参阅**《AWS Systems Manager Automation Runbook Reference》中的 [AWSSupport-MigrateXenToNitroLinux runbook](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awssupport-migrate-xen-to-nitro.html)。
+ [Windows 实例] 有关将兼容的 Windows 实例从 Xen 实例类型迁移到 Nitro 实例类型的其他指南，请参阅[迁移到最新一代的实例类型](migrating-latest-types.md)。

**更改由 Amazon EBS 支持的实例的实例类型**

1. （可选）如果新实例类型需要现有实例上未安装的驱动程序，您必须先连接到您的实例并安装驱动程序。有关更多信息，请参阅 [更改实例类型的兼容性](resize-limitations.md)。

1. [Windows 实例] 如果您将 Windows 实例配置为使用[静态 IP 寻址](config-windows-multiple-ip.md#step1)，并将不支持增强联网的实例类型更改为支持增强联网的实例类型，则当您在重新配置静态 IP 寻址时，可能会收到有关潜在 IP 地址冲突的警告。要防止此情况出现，在更改实例类型之前，请在网络接口上为实例启用 DHCP。从您的实例中，打开 **Network and Sharing Center**（网络和共享中心），打开网络接口的 **Internet Protocol Version 4 (TCP/IPv4) Properties**（互联网协议版本 4 (TCP/IPv4) 属性），并选择 **Obtain an IP address automatically**（自动获取 IP 地址）。更改实例类型并在网络接口上重新配置静态 IP 寻址。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择所需实例，然后依次选择**实例状态**、**停止实例**。当系统提示您确认时，选择 **Stop**。停止实例可能需要几分钟时间。

1. 在实例处于选中状态时，依次选择**操作**、**实例设置**、**更改实例类型**。若实例状态不是 `stopped`，则此操作会显示为灰色。

1. 请在 **Change instance type**（更改实例类型）页面上执行以下操作：

   1. 对于 **Instance type**（实例类型），选择您所需的实例类型。

      如果列表中未包含该实例类型，则说明其与您的实例配置不兼容。请改为使用以下说明：[通过启动新的 EC2 实例迁移到新实例类型](migrate-instance-configuration.md)。

   1. （可选）如果您选择的实例类型支持 EBS 优化，则选择 **EBS-optimized**（EBS 优化）以启用 EBS 优化，或取消选择 **EBS-optimized**（EBS 优化）以禁用 EBS 优化。

      如果您选择的实例类型默认情况下已经过 EBS 优化，则 **EBS-optimized**（EBS 优化）已选中，您无法取消选择。

   1. （可选）配置新实例类型的 vCPU 选项。

      当您对现有实例更改实例类型时，Amazon EC2 会尽可能将现有实例的 CPU 选项设置应用到新实例。如果新的实例类型不支持这些设置，则 CPU 选项将重置为**无**。对于新实例类型，此选项会使用默认 vCPU 数。

      如果您选择的实例类型支持 vCPU 配置，请在**高级详细信息**面板中选择**指定 CPU 选项**，从而为您的新实例类型配置 vCPU。

   1. 选择**更改**以接受新设置。

1. 要启动实例，请选择该实例，然后依次选择 **Instance state**（实例状态）、**Start instance**（启动实例）。实例进入 `running` 状态可能需要几分钟时间。如果您的实例无法启动，请参阅 [实例类型更改的问题排查](troubleshoot-change-instance-type.md)。

1. [Windows 实例] 如果您的实例运行 Windows Server 2016 或 Windows Server 2019（带 EC2Launch v1），则会连接到您的 Windows 实例并运行以下 EC2Launch PowerShell 脚本，以便在更改实例类型后对其进行配置。
**重要**  
当您启用初始化实例 EC2 Launch 脚本时，管理员密码将重置。您可以修改配置文件，通过在初始化任务的设置中指定禁用管理员密码重置来禁用它。有关如何禁用密码重置的步骤，请参阅[配置初始化任务](ec2launch-config.md#ec2launch-inittasks)（EC2Launch）或[更改设置](ec2launch-v2-settings.md#ec2launch-v2-ui)（EC2Launch v2）。

   ```
   PS C:\> C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\InitializeInstance.ps1 -Schedule
   ```


# 将 EC2 Windows 实例迁移到基于 Nitro 的实例类型
<a name="migrating-latest-types"></a>

AWS Windows AMI 配置了 Microsoft 安装介质使用的默认设置，并进行一些自定义。自定义内容包括支持[基于 Nitro的实例](instance-types.md#instance-hypervisor-type)（例如 M5 和 C5）的驱动程序和配置。

在从基于 Xen 的实例迁移到基于 Nitro 的实例（包括裸机实例）时，对于下列情况，建议您按照本主题中的步骤操作：
+ 从自定义 Windows AMI 启动实例
+ 从 Amazon 提供的 Windows AMI（2018 年 8 月之前创建）启动实例

或者，您可以使用 `AWSSupport-UpgradeWindowsAWSDrivers` 自动化文档自动完成第 1 部分、第 2 部分和第 3 部分中所述的过程。如果您选择使用自动过程，请先阅读[（替代方法）使用 AWS 升级 AWS Systems Manager PV、ENA 和 NVMe 驱动程序](#auto-upgrade)，然后再继续执行第 4 部分和第 5 部分。

有关更多信息，请参阅 [Amazon EC2 更新 - 更多实例类型、Nitro 系统和 CPU 选项](https://aws.amazon.com/blogs/aws/amazon-ec2-update-additional-instance-types-nitro-system-and-cpu-options/)。

**注意**  
可以在 Windows Server 2016 及更高版本上执行以下迁移过程。已终止使用的早期操作系统版本未经测试，可能与最新的实例类型不兼容。  
要迁移 Linux 实例，请参阅 [Amazon EC2 实例类型更改](ec2-instance-resize.md)。

**Contents**
+ [第 1 部分：安装和升级 AWS PV 驱动程序](#upgrade-pv)
+ [第 2 部分：安装和升级 ENA](#upgrade-ena)
+ [第 3 部分：升级 AWS NVMe 驱动程序](#upgrade-nvme)
+ [第 4 部分：更新 EC2Config 和 EC2Launch](#upgdate-ec2config-ec2launch)
+ [第 5 部分：为裸机实例安装串行端口驱动程序](#install-serial-port-bare-metal)
+ [第 6 部分：更新电源管理设置](#power-management)
+ [第 7 部分：为新实例类型更新 Intel 芯片组驱动程序](#power-management-intel-drivers)
+ [（替代方法）使用 AWS 升级 AWS Systems Manager PV、ENA 和 NVMe 驱动程序](#auto-upgrade)

**开始前的准备工作** 

此过程假定您拥有[基于 Xen 的实例](instance-types.md#instance-hypervisor-type)（例如 M4 或 C4），并且要迁移到[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。

您必须使用 PowerShell 3.0 或更高版本才能成功执行升级。

**注意**  
迁移时，现有网络接口卡上的静态 IP 或自定义 DNS 网络设置可能会丢失，因为实例会默认使用新的增强联网适配器设备。

在按照本过程中的步骤操作之前，建议您先创建实例的备份。从 [EC2 控制台](https://console.aws.amazon.com/ec2/)中，选择需要迁移的实例，打开上下文（右键单击）菜单，然后依次选择 **Instance State (实例状态)** 和 **Stop (停止)**。

**警告**  
当您停止某个实例时，任何实例存储卷上的数据都将被擦除。要保留实例存储卷上的数据，请确保将这些数据备份到持久性存储中。

在 [EC2 控制台](https://console.aws.amazon.com/ec2/)中打开实例的上下文（右键单击）菜单，选择 **Image (映像)**，然后选择 **Create Image (创建映像)**。

**注意**  
本说明的第 4 部分和第 5 部分可以在您迁移或更改实例类型后完成。但是，如果要迁移到裸机实例类型，则建议您在迁移前完成这些步骤。

## 第 1 部分：安装和升级 AWS PV 驱动程序
<a name="upgrade-pv"></a>

尽管 AWS PV 驱动程序在 Nitro 系统中未使用，但如果您使用的是早期版本的 Citrix PV 或 AWS PV，应当仍升级它们。最新的 AWS PV 驱动程序解决了在以下情况下可能在早期版本的驱动程序中出现的错误：您使用的是 Nitro 系统或者需要迁移回基于 Xen 的实例。作为最佳实践，我们建议始终针对 AWS 上的 Windows 实例升级到最新驱动程序。

使用以下过程对 AWS PV 驱动程序执行就地升级，或在 Windows Server 2008 R2、Windows Server 2012、Windows Server 2012 R2、Windows Server 2016 或 Windows Server 2019 上从 Citrix PV 驱动程序升级到 AWS PV 驱动程序。有关更多信息，请参阅[在 EC2 Windows 实例上升级半虚拟化驱动程序](Upgrading_PV_drivers.md)。

要升级域控制器，请参阅 [升级域控制器 (AWS PV 升级)](Upgrading_PV_drivers.md#aws-pv-upgrade-dc)。

**执行升级或升级到 AWS PV 驱动程序**

1. 使用远程桌面连接到实例并进行实例升级准备。在执行该升级前使所有非系统磁盘脱机。如果您要对 AWS PV 驱动程序执行就地升级，则不需要此步骤。在 Services 控制台中将不必要的服务设置为**手动** 启动。

1. 将最新驱动程序包[下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSPV/Latest/AWSPVDriver.zip)到实例。

1. 提取文件夹的内容，然后运行 `AWSPVDriverSetup.msi`。

在运行 MSI 后，实例将自动重启，然后升级驱动程序。实例可能将有长达 15 分钟的时间不可用。

在升级完成并且实例在 Amazon EC2 控制台中通过了两项运行状况检查后，请使用远程桌面连接到实例并验证新驱动程序是否已安装。在设备管理器中的**存储控制器**下，找到 **AWS PV 存储主适配器**。确认驱动程序版本与驱动程序版本历史记录表中列出的最新版本相同。有关更多信息，请参阅[AWS PV 驱动程序包历史记录](xen-drivers-overview.md#pv-driver-history)。

## 第 2 部分：安装和升级 ENA
<a name="upgrade-ena"></a>

升级到最新的 Elastic Network Adapter 驱动程序以确保所有网络功能均受支持。如果您启动了实例，而该实例尚未启用增强联网，则必须在该实例上下载并安装所需的网络适配器驱动程序。然后，设置 enaSupport 实例属性以**激活增强联网**。仅当安装了 ENA 驱动程序时，才能在受支持的实例类型上启用此属性。有关更多信息，请参阅[在 EC2 实例上使用 ENA 启用增强联网功能](enhanced-networking-ena.md)。

1. 将最新驱动程序[下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/Latest/AwsEnaNetworkDriver.zip)到实例。如果您需要先前版本的驱动程序，请参阅 [ENA Windows 驱动程序版本历史记录](ena-driver-releases-windows.md#ena-win-driver-release-history)。

1. 提取 zip 存档。

1. 通过运行提取的文件夹中的 `install.ps1` PowerShell 脚本安装驱动程序。
**注意**  
要避免安装错误，请以管理员身份运行 `install.ps1` 脚本。

1.  检查 AMI 是否已激活 enaSupport。如果未启用，请按照 [在 EC2 实例上使用 ENA 启用增强联网功能](enhanced-networking-ena.md) 上的文档继续操作。

## 第 3 部分：升级 AWS NVMe 驱动程序
<a name="upgrade-nvme"></a>

AWS NVMe 驱动程序用于与显示为 Nitro 系统中的 NVMe 块储存设备的 Amazon EBS 和 SSD 实例存储卷交互以提高性能。

**重要**  
以下说明专门针对以下情况进行了修改：您在基于 Xen 的实例上安装或升级 AWS NVMe，以将实例迁移到基于 Nitro 的实例。

1. 将最新驱动程序包[下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/NVMe/Latest/AWSNVMe.zip)到实例。

   如果您需要先前版本的驱动程序，请参阅 [AWS NVMe Windows 驱动程序版本](nvme-driver-version-history.md)了解支持的版本。

1. 提取 zip 存档。

1. 如 `Readme.txt` 中所述安装驱动程序。

1. 打开 **PowerShell** 会话并运行以下命令：

   ```
   PS C:\> start rundll32.exe sppnp.dll,Sysprep_Generalize_Pnp -wait
   ```
**注意**  
要应用该命令，您必须以管理员身份运行 PowerShell 会话。PowerShell (x86) 版本将会导致错误。  
此命令仅在设备驱动程序上运行 sysprep。它不会运行完整的 sysprep 准备。

1. 对于 Windows Server 2008 R2 和 Windows Server 2012，请关闭实例，更改实例类型并启动实例，然后继续完成第 4 部分。如果在迁移到基于 Nitro 的实例类型之前，您在基于 Xen 的实例类型上再次启动了实例，则将无法启动。对于其他支持的 Windows AMI，您可以在运行设备 sysprep 后的任何时间更改实例类型。

## 第 4 部分：更新 EC2Config 和 EC2Launch
<a name="upgdate-ec2config-ec2launch"></a>

对于 Windows 实例，当在 Nitro 系统上（包括在 EC2 裸机上）运行时，最新的 EC2Config 和 EC2Launch 实用工具将提供额外的功能和信息。默认情况下，EC2Config 服务包含在早于 Windows Server 2016 的 AMI 中。EC2Launch 将取代 Windows Server 2016 及更高版本 AMI 上的 EC2Config。

EC2Config 和 EC2Launch 服务更新后，AWS 提供的新 Windows AMI 将包含最新版本的该服务。不过，您必须将自己的 Windows AMI 和实例更新为最新版本的 EC2Config 和 EC2Launch。

**安装或更新 EC2Config**

1. 下载并解压缩 [EC2Config 安装程序](https://s3.amazonaws.com/ec2-downloads-windows/EC2Config/EC2Install.zip)。

1. 运行 `EC2Install.exe`。有关选项的完整列表，请使用 `EC2Install` 选项运行 `/?`。默认情况下，安装程序会显示提示。要运行该命令而不显示提示，请使用 `/quiet` 选项。

有关更多信息，请参阅[安装最新版的 EC2Config](UsingConfig_Install.md)。

**安装或更新 EC2Launch**

1. 如果已在实例上安装和配置 EC2Launch，请备份 EC2Launch 配置文件。安装过程不保留此文件中的更改。默认情况下，该文件位于以下 `C:\ProgramData\Amazon\EC2-Windows\Launch\Config` 目录中。

1. 将 [EC2-Windows-Launch.zip](https://s3.amazonaws.com/ec2-downloads-windows/EC2Launch/latest/EC2-Windows-Launch.zip) 下载到实例上的一个目录中。

1. 将 [install.ps1](https://s3.amazonaws.com/ec2-downloads-windows/EC2Launch/latest/install.ps1) 下载到 `EC2-Windows-Launch.zip` 的下载目录中。

1. 运行 `install.ps1`。
**注意**  
要避免安装错误，请以管理员身份运行 `install.ps1` 脚本。

1. 如果您对 EC2Launch 配置文件进行了备份，则将其复制到 `C:\ProgramData\Amazon\EC2-Windows\Launch\Config` 目录。

有关更多信息，请参阅[使用 EC2Launch v1 代理在 EC2 Windows 实例启动期间执行任务](ec2launch.md)。

## 第 5 部分：为裸机实例安装串行端口驱动程序
<a name="install-serial-port-bare-metal"></a>

`i3.metal` 实例类型使用基于 PCI 的串行设备而不是基于 I/O 端口的串行设备。最新 Windows AMI 将自动使用基于 PCI 的串行设备并安装串行端口驱动程序。如果您没有使用从 Amazon 提供的 Windows AMI（日期为 2018 年 4 月 11 日或更晚）启动的实例，则必须安装串行端口驱动程序来启用串行设备的 EC2 功能（如密码生成和控制台输出）。最新的 EC2Config 和 EC2Launch 实用工具还支持 i3.metal 并提供额外的功能。按照第 4 部分中的步骤操作（如果尚未执行）。

**安装串行端口驱动程序**

1. 将串行驱动程序包[下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSPCISerialDriver/Latest/AWSPCISerialDriver.zip)到实例。

1. 提取文件夹的内容，打开 `aws_ser.INF` 的上下文（右键单击）菜单，然后选择 **install (安装)**。

1. 选择 **Okay (确定)**。

## 第 6 部分：更新电源管理设置
<a name="power-management"></a>

以下电源管理设置更新将显示器设置为从不关闭，从而允许在 Nitro 系统上正常关闭操作系统。Amazon 截至 2018 年 11 月 28 日提供的所有 Windows AMI 都已具有此默认配置。

1. 打开命令提示符或 PowerShell 会话。

1. 运行以下命令：

   ```
   powercfg /setacvalueindex 381b4222-f694-41f0-9685-ff5bb260df2e 7516b95f-f776-4464-8c53-06167f40cc99 3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e 0
   powercfg /setacvalueindex 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 7516b95f-f776-4464-8c53-06167f40cc99 3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e 0
   powercfg /setacvalueindex a1841308-3541-4fab-bc81-f71556f20b4a 7516b95f-f776-4464-8c53-06167f40cc99 3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e 0
   ```

## 第 7 部分：为新实例类型更新 Intel 芯片组驱动程序
<a name="power-management-intel-drivers"></a>

`u-6tb1.metal`、`u-9tb1.metal` 和 `u-12tb1.metal` 实例类型使用的硬件需要先前未安装在 Windows AMI 上的芯片组驱动程序。如果不使用从 Amazon 提供的 Windows AMI（日期为 2018 年 11 月 19 日或更晚）启动的实例，则必须使用 Intel Chipset INF Utility 安装驱动程序。

**安装芯片组驱动程序**

1. 将[芯片组 INF 实用程序](https://www.intel.com/content/www/us/en/download/19347/chipset-inf-utility.html)下载到实例。

1. 提取文件。

1. 运行 `SetupChipset.exe`。

1. 接受 Intel 软件许可协议并安装芯片组驱动程序。

1. 重启实例。

## （替代方法）使用 AWS 升级 AWS Systems Manager PV、ENA 和 NVMe 驱动程序
<a name="auto-upgrade"></a>

`AWSSupport-UpgradeWindowsAWSDrivers` 自动化文档自动完成第 1 部分、第 2 部分和第 3 部分中所述的步骤。此方法还可在驱动程序升级失败时修复实例。

`AWSSupport-UpgradeWindowsAWSDrivers` 自动化文档在指定的 EC2 实例上升级或修复存储及网络 AWS 驱动程序。该文档尝试通过调用 AWS 代理（SSM Agent），在线安装最新版本的 AWS Systems Manager 驱动程序。如果无法与 SSM Agent 通信，则在明确要求时，该文档可以执行 AWS 驱动程序的离线安装。

**注意**  
此过程将在域控制器上失败。要在域控制器上更新驱动程序，请参阅[升级域控制器 (AWS PV 升级)](Upgrading_PV_drivers.md#aws-pv-upgrade-dc)。

**使用 AWS 自动升级 AWS Systems Manager PV、ENA 和 NVMe 驱动程序**

1. 在 [https://console.aws.amazon.com/systems-manager](https://console.aws.amazon.com/systems-manager) 处打开 Systems Manager 控制台。

1. 选择 **Automation (自动化)**、**Execute Automation (执行自动化)**。

1. 搜索并选择 **AWSSupport-UpgradeWindowsAWSDrivers** 自动化文档，然后选择**执行自动化**。

1. 在**输入参数**部分，配置以下选项：  
实例 ID  
输入要升级实例的唯一 ID。  
AllowOffline  
（可选）选择下列选项之一：  
   + `True` — 选择此选项可执行离线安装。在升级过程中，实例将停止并重新启动。
**警告**  
当您停止某个实例时，任何实例存储卷上的数据都将被擦除。要保留实例存储卷上的数据，请确保将这些数据备份到持久性存储中。
   + `False` —（默认值）要执行在线安装，请保持选中此选项。在升级过程中，实例将重新启动。
在尝试升级操作之前，在线和离线升级会创建一个 AMI。该 AMI 在自动化完成后仍将存在。请确保您可以访问该 AMI，或者在不再需要时将其删除。  
SubnetId  
（可选）输入以下值之一：  
   + `SelectedInstanceSubnet` —（默认值）升级过程会在要升级实例所在的同一子网中启动*帮助程序* 实例。该子网必须允许与 Systems Manager 终端节点 (`ssm.*`) 进行通信。
   + `CreateNewVPC` — 升级过程会在新 VPC 中启动*帮助程序* 实例。如果您不确定目标实例的子网是否允许与 `ssm.*` 终端节点进行通信，请使用此选项。您的用户必须具有创建 VPC 的权限。
   + 特定子网 ID — 指定要在其中启动*帮助程序* 实例的特定子网的 ID。该子网必须与要升级的实例位于同一可用区中，并且必须允许与 `ssm.*` 终端节点进行通信。

1. 选择**执行**。

1. 留出完成升级的时间。完成在线升级可能需要长达 10 分钟的时间，而完成离线升级可能需要长达 25 分钟的时间。
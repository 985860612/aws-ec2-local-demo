

# NVMe 驱动程序
<a name="aws-nvme-drivers"></a>

在[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)上，Amazon EBS 卷和实例存储卷显示为 NVMe 块储存设备。要充分使用以 NVMe 块设备形式公开的卷的 Amazon EBS 功能的性能和特性，实例必须安装 AWS NVMe 驱动程序。所有当前一代 AWS Windows AMI 都默认安装了 AWS NVMe 驱动程序。

有关 EBS 和 NVMe 的更多信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 和 NVMe](https://docs.aws.amazon.com/ebs/latest/userguide/nvme-ebs-volumes.html)。有关 SSD 实例存储和 NVMe 的更多信息，请参阅[适用于 EC2 实例的 SSD 实例存储卷](ssd-instance-store.md)。

## Linux 实例
<a name="install-nvme-driver-linux"></a>

以下 AMI 包含所需的 NVMe 驱动程序：
+ Amazon Linux 2
+ Amazon Linux AMI 2018.03
+ Ubuntu 14.04 或更高版本（采用 `linux-aws` 内核）
**注意**  
AWS 基于 Graviton 的实例类型需要 Ubuntu 18.04 或更高版本（采用 `linux-aws` 内核）
+ Red Hat Enterprise Linux 7.4 或更高版本
+ SUSE Linux Enterprise Server 12 SP2 或更高版本
+ CentOS 7.4.1708 或更高版本
+ FreeBSD 11.1 或更高版本
+ Debian GNU/Linux 9 或更高版本

**确认实例具有 NVMe 驱动程序**  
您可以使用以下命令确认您的实例是否具有 NVMe 驱动程序。
+ Amazon Linux、RHEL、CentOS 和 SUSE Linux Enterprise Server

  ```
  $ modinfo nvme
  ```

  如果实例具有 NVMe 驱动程序，则该命令将返回有关该驱动程序的信息。
+ Amazon Linux 2 和 Ubuntu

  ```
  $ ls /sys/module/ | grep nvme
  ```

  如果实例具有 NVMe 驱动程序，该命令将返回已安装的驱动程序。

**更新 NVMe 驱动程序**

如果您的实例具有 NVMe 驱动程序，您可以使用以下过程将驱动程序更新到最新版本。

1. 连接到您的 实例。

1. 更新程序包缓存以获取必需程序包更新，如下所示。
   + 对于 Amazon Linux 2、Amazon Linux、CentOS 和 Red Hat Enterprise Linux：

     ```
     [ec2-user ~]$ sudo yum update -y
     ```
   + 对于 Ubuntu 和 Debian：

     ```
     [ec2-user ~]$ sudo apt-get update -y
     ```

1. Ubuntu 16.04 及更高版本包含 `linux-aws` 程序包，该程序包包含基于 Nitro 的实例所需的 NVMe 和 ENA 驱动程序。升级 `linux-aws` 程序包以接收最新版本，如下所示：

   ```
   [ec2-user ~]$ sudo apt-get install --only-upgrade -y linux-aws
   ```

   对于 Ubuntu 14.04，您可以安装最新的 `linux-aws` 程序包，如下所示：

   ```
   [ec2-user ~]$ sudo apt-get install linux-aws
   ```

1. 重启实例以加载最新内核版本。

   ```
   sudo reboot
   ```

1. 重启之后重新连接到实例。

## Windows 实例
<a name="install-nvme-drivers-windows"></a>

------
#### [ PowerShell ]

如果您没有从 Amazon 提供的最新 AWS Windows AMI 之一启动实例，请按照以下过程在实例上安装当前的 AWS NVMe 驱动程序。此安装需要重启。安装脚本将重新引导实例，或者您必须在最后一步中重新引导实例。

**先决条件**
+ 已安装 PowerShell 3.0 或更高版本。
+ 本节中显示的命令必须在 64 位版本的 PowerShell 中运行。不要使用 `x86` 版本的 PowerShell。这是 32 位版本的 shell，不支持这些命令。

**下载并安装最新 AWS NVMe 驱动程序**

1. 如果需要回滚更改，我们建议您按如下方式创建 AMI 作为备份。

   1. 当您停止某个实例时，任何实例存储卷上的数据都将被擦除。在停止实例之前，请确认您是否已将所需数据从实例存储卷复制到持久性存储，例如 Amazon EBS 或 Amazon S3。

   1. 在导航窗格中，选择**实例**。

   1. 选择需要升级驱动程序的实例，然后依次选择 **Instance state (实例状态)**、**Stop instance (停止实例)**。

   1. 实例停止后，选择实例，依次选择 **Actions (操作) **、**Image and templates (映像和模板)**，然后选择 **Create image (创建映像)**。

   1. 依次选择**实例状态**、**启动实例**。

1. 连接到您的实例并以本地管理员身份登录。

1. 使用以下选项之一将驱动程序下载到您的实例：
   + **浏览器** - 将最新的驱动程序包[下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/NVMe/Latest/AWSNVMe.zip)到实例并解压缩 zip 存档。
   + **PowerShell** – 运行以下命令：

     ```
     Invoke-WebRequest https://s3.amazonaws.com/ec2-windows-drivers-downloads/NVMe/Latest/AWSNVMe.zip -outfile $env:USERPROFILE\nvme_driver.zip
     Expand-Archive $env:userprofile\nvme_driver.zip -DestinationPath $env:userprofile\nvme_driver
     ```

     如果您在下载文件时收到错误，并且正在使用 Windows Server 2016 或更早的版本，则可能需要为 PowerShell 终端启用 TLS 1.2。可以使用以下命令为当前 PowerShell 会话启用 TLS 1.2，然后重试：

     ```
     [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
     ```

1. 通过运行 `nvme_driver` 目录 (`.\install.ps1`) 中的 `install.ps1` PowerShell 脚本，将驱动程序安装到您的实例中 如果出现错误，请确保您使用的是 PowerShell 3.0 或更高版本。

   1. （可选）从 AWS NVMe 版本 `1.5.0` 开始，Windows Server 2016 及更高版本支持小型计算机系统接口（SCSI）永久预留。此功能增加了对带有共享 Amazon EBS 存储的 Windows Server 故障转移集群的支持。默认情况下，安装期间不启用此功能。

      在运行 `install.ps1` 脚本以安装驱动程序时，您可以通过指定值为 `$true` 的 `EnableSCSIPersistentReservations` 参数来启用该功能。

      ```
      PS C:\> .\install.ps1 -EnableSCSIPersistentReservations $true
      ```

      在运行 `install.ps1` 脚本以安装驱动程序时，您可以通过指定值为 `$false` 的 `EnableSCSIPersistentReservations` 参数来禁用该功能。

      ```
      PS C:\> .\install.ps1 -EnableSCSIPersistentReservations $false
      ```

   1. 从 AWS NVMe `1.5.0` 开始，`install.ps1` 脚本始终安装带有驱动程序的 `ebsnvme-id` 工具。

      （可选）对于版本 `1.4.0`、`1.4.1` 和 `1.4.2`，`install.ps1` 脚本允许您指定 `ebsnvme-id` 工具是否应与驱动程序一起安装。

      1. 如需安装 `ebsnvme-id` 工具，请指定 `InstallEBSNVMeIdTool 'Yes'`。

      1. 如果不希望安装此工具，请指定 `InstallEBSNVMeIdTool 'No'`。

         如果您未指定 `InstallEBSNVMeIdTool`，且 `C:\ProgramData\Amazon\Tools` 中已存在该工具，则软件包将默认升级该工具。如果该工具不存在，则 `install.ps1` 将默认不升级该工具。

         如果您不想将该工具作为软件包的一部分进行安装，而想稍后再安装，则可以在驱动程序包中找到最新版本或该工具。或者，您可以从 Amazon S3 下载版本 `1.0.0`：

         [下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/EBSNVMeID/Latest/ebsnvme-id.zip) `ebsnvme-id` 工具。

1. 如果安装程序没有重新引导实例，请重新引导该实例。

------
#### [ Distributor ]

您可以使用分发服务器（AWS Systems Manager 的一项功能）一次性安装 NVMe 驱动程序包，也可以使用计划更新来安装。

**安装最新的 AWS NVMe 驱动程序**

1. 有关如何使用分发服务器安装 NVMe 驱动程序包的说明，请参阅《Amazon EC2 Systems Manager 用户指南》**中的[安装或更新软件包](https://docs.aws.amazon.com/systems-manager/latest/userguide/distributor-working-with-packages-deploy.html)。

1. 在**安装类型**中，选择**卸载并重新安装**。

1. 在**名称**中，选择 **AWSNVMe**。

1. （可选）在**其他参数**,中，通过指定值来自定义安装。必须使用有效的 JSON 语法来格式化这些值。有关如何为 `aws configure` 软件包传递其他参数的示例，请参阅[命令文档插件参考](https://docs.aws.amazon.com/systems-manager/latest/userguide/documents-command-ssm-plugin-reference.html)。

   1. 从 AWS NVMe `1.5.0` 开始，该驱动程序支持 Windows Server 2016 及更高版本的 SCSI 永久预留。默认情况下，安装期间不启用此功能。
      + 要启用此功能，请指定 `{"SSM_EnableSCSIPersistentReservations": "true"}`。
      + 如果您不想启用此功能，请指定 `{"SSM_EnableSCSIPersistentReservations": "false"}`。

   1. 从 AWS NVMe `1.5.0` 开始，`install.ps1` 脚本将始终安装 `ebsnvme-id` 工具。

      （可选）对于版本 `1.4.0`、`1.4.1` 和 `1.4.2`，`install.ps1` 脚本允许您指定 ebsnvme-id 工具是否应与驱动程序一起安装。
      + 要安装 ebsnvme-id 工具，请指定 `{"SSM_InstallEBSNVMeIdTool": "Yes"}`。
      + 如果不希望安装此工具，请指定 `{"SSM_InstallEBSNVMeIdTool": "No"}`。

        如果您未指定 **Additional Arguments**（其它参数）为 `SSM_InstallEBSNVMeIdTool`，且 `C:\ProgramData\Amazon\Tools` 中已存在该工具，则软件包将默认升级该工具。如果该工具不存在，则软件包将默认不升级该工具。

        如果您不想将该工具作为软件包的一部分进行安装，而想稍后再安装，则可以在驱动程序包中找到该工具的最新版本。或者，您可以从 Amazon S3 下载版本 `1.0.0`：

        [下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/EBSNVMeID/Latest/ebsnvme-id.zip) `ebsnvme-id` 工具。

1. 如果安装程序没有重新引导实例，请重新引导该实例。

------

## 为 Windows 实例配置 SCSI 永久预留
<a name="configure-scsi-persistent-reservations"></a>

安装 AWS NVMe 驱动程序版本 `1.5.0` 或更高版本后，您可以使用适用于 Windows Server 2016 及更高版本的 Windows 注册表启用或禁用 SCSI 永久预留。您必须先重启数据库实例，然后这些注册表更改才会生效。

您可以使用以下命令启用 SCSI 永久预留，该命令将 `EnableSCSIPersistentReservations` 的值设置为 `1`。

```
PS C:\> $registryPath = "HKLM:\SYSTEM\CurrentControlSet\Services\AWSNVMe\Parameters\Device"
Set-ItemProperty -Path $registryPath -Name EnableSCSIPersistentReservations -Value 1
```

您可以使用以下命令禁用 SCSI 永久预留，该命令将 `EnableSCSIPersistentReservations` 的值设置为 `0`。

```
PS C:\> $registryPath = "HKLM:\SYSTEM\CurrentControlSet\Services\AWSNVMe\Parameters\Device"
Set-ItemProperty -Path $registryPath -Name EnableSCSIPersistentReservations -Value 0
```
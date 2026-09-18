

# 通过 Intel 82599 VF 接口实现增强联网
<a name="sriov-networking"></a>

对于[基于 Xen 的实例](instance-types.md#instance-hypervisor-type)，Intel 82599 虚拟功能（VF）接口会提供增强的联网功能。该接口使用 Intel `ixgbevf` 驱动程序。

下列选项卡展示了如何验证为实例操作系统安装的网络适配器驱动程序。

------
#### [ Linux ]

**Linux 网络接口驱动程序**  
使用以下命令验证是否在特定接口上使用了该模块（替代要检查的接口名称）。如果您使用单个接口（默认设置），则为 `eth0`。如果操作系统支持[可预测的网络名称](#predictable-network-names-sriov)，这可以是 `ens5` 等名称。

在以下示例中，`ixgbevf` 模块未加载，因为列出的驱动程序是 `vif`。

```
[ec2-user ~]$ ethtool -i {{eth0}}
driver: vif
version:
firmware-version:
bus-info: vif-0
supports-statistics: yes
supports-test: no
supports-eeprom-access: no
supports-register-dump: no
supports-priv-flags: no
```

在此示例中，已加载 `ixgbevf` 模块。此实例正确配置了增强联网。

```
[ec2-user ~]$ ethtool -i {{eth0}}
driver: ixgbevf
version: 4.0.3
firmware-version: N/A
bus-info: 0000:00:03.0
supports-statistics: yes
supports-test: yes
supports-eeprom-access: no
supports-register-dump: yes
supports-priv-flags: no
```

------
#### [ Windows ]

**Windows 网络适配器**  
要验证是否已安装驱动程序，请连接到您的实例并打开设备管理器。您应该会在**网络适配器**下看到列出的 `Intel(R) 82599 Virtual Function`。

------

**Topics**
+ [为增强联网准备好实例](#ixgbevf-requirements)
+ [测试是否启用了增强联网功能](#test-enhanced-networking)
+ [在实例上启用增强联网](#enable-enhanced-networking)
+ [对连接问题进行故障排除](#enhanced-networking-troubleshooting)

## 为增强联网准备好实例
<a name="ixgbevf-requirements"></a>

要使用 Intel 82599 VF 接口准备增强联网，请按如下方式设置您的实例：
+ 验证实例类型是否为以下类型之一：C3、C4、D2、I2、M4（不包括 `m4.16xlarge`）和 R3。
+ 确保实例具有 Internet 连接。
+ 如果您的实例上有重要的数据需要保留，则应立即从您的实例创建 AMI，来备份这些数据。更新内核和内核模块以及启用 `sriovNetSupport` 属性可能会导致实例不兼容或无法访问操作系统。如果您有最新备份，则发生此情况时仍将保留数据。
+ **Linux 实例**：从使用 Linux 内核版本 2.6.32 或更高版本的 HVM AMI 启动实例。最新的 Amazon Linux HVM AMI 安装有增强联网所需的模块，并已设置所需的属性。因此，如果使用最新 Amazon Linux HVM AMI 启动由 Amazon EBS 提供支持且支持增强联网的实例，则已为您的实例启用增强联网。
**警告**  
仅 HVM 实例支持增强联网。使用半虚拟化实例启用增强联网会让该实例无法访问。在模块或模块版本不正确的情况下设置此属性还可能导致您的实例不可访问。
+ **Windows 实例**：从 64 位 HVM AMI 启动实例。您不能对 Windows Server 2008 启用增强联网。已针对 Windows Server 2012 R2 和 Windows Server 2016 及更高版本的 AMI 启用了增强联网功能。Windows Server 2012 R2 包含 Intel 驱动程序 1.0.15.3，我们建议您使用 Pnputil.exe 实用工具将该驱动程序升级到最新版本。
+ 从AWS 管理控制台使用 [AWS CloudShell](https://console.aws.amazon.com/cloudshell)，或在您选择的任意电脑（最好是本地台式机或笔记本电脑）上安装并配置 [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) 或 [AWS Tools for Windows PowerShell](https://docs.aws.amazon.com/powershell/latest/userguide/)。有关的更多信息，请参阅 [访问 Amazon EC2](concepts.md#access-ec2) 或 [AWS CloudShell 用户指南](https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html)。不能从 Amazon EC2 控制台管理增强联网。

## 测试是否启用了增强联网功能
<a name="test-enhanced-networking"></a>

确认已在实例或映像上设置了 `sriovNetSupport` 属性。

------
#### [ AWS CLI ]

**检查实例属性（sriovNetSupport）**  
使用以下 [describe-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-attribute.html) 命令。如果设置了该属性，则值为 `simple`。

```
aws ec2 describe-instance-attribute \
    --instance-id {{i-1234567890abcdef0}} \
    --attribute sriovNetSupport
```

**检查映像属性（sriovNetSupport）**  
使用以下 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。如果设置了该属性，则值为 `simple`。

```
aws ec2 describe-images \
    --image-id {{ami-0abcdef1234567890}} \
    --query "Images[].SriovNetSupport"
```

------
#### [ PowerShell ]

**检查实例属性（sriovNetSupport）**  
使用 [Get-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceAttribute.html) cmdlet。如果设置了该属性，则值为 `simple`。

```
Get-EC2InstanceAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -Attribute sriovNetSupport
```

**检查映像属性（sriovNetSupport）**  
使用以下 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。如果设置了该属性，则值为 `simple`。

```
(Get-EC2Image -ImageId {{ami-0abcdef1234567890}}).SriovNetSupport
```

------

## 在实例上启用增强联网
<a name="enable-enhanced-networking"></a>

您使用的过程取决于实例的操作系统。

**警告**  
增强联网属性启用之后将无法禁用。

### Amazon Linux
<a name="enable-amazon-linux"></a>

最新的 Amazon Linux HVM AMI 安装有增强联网所需的 `ixgbevf` 模块，并已设置所需的 `sriovNetSupport` 属性。因此，如果使用最新的 Amazon Linux HVM AMI 启动实例类型，则已为您的实例启用增强联网。有关更多信息，请参阅[测试是否启用了增强联网功能](#test-enhanced-networking)。

如果您使用较旧的 Amazon Linux AMI 启动了实例，并且实例尚未启用增强联网，请通过以下步骤启用增强联网。

**启用增强联网**

1. <a name="amazon-linux-enhanced-networking-start-step"></a>连接到您的实例。

1. 从实例运行以下命令以使用最新内核和内核模块 (包括 `ixgbevf`) 更新实例：

   ```
   [ec2-user ~]$ sudo yum update
   ```

1. 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机重启实例：[reboot-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/reboot-instances.html)（AWS CLI）或 [Restart-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Restart-EC2Instance.html)（AWS Tools for Windows PowerShell）。

1. <a name="amazon-linux-enhanced-networking-stop-step"></a>再次连接到您的实例，并使用`ixgbevf`中的 **modinfo ixgbevf** 命令验证 [测试是否启用了增强联网功能](#test-enhanced-networking) 模块是否已安装并具有推荐的最低版本。

1. [由 EBS 支持的实例] 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机停止实例：[stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html)（AWS CLI）或 [Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html)（AWS Tools for Windows PowerShell）。

   [实例存储支持的实例] 您无法停止实例来修改属性。请跳到下一步。

1. 使用以下任一命令从本地电脑启用增强联网属性：

------
#### [ AWS CLI ]

   如下所示使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令。

   ```
   aws ec2 modify-instance-attribute \
       --instance-id {{i-1234567890abcdef0}} \
       --sriov-net-support simple
   ```

------
#### [ PowerShell ]

   按如下方式使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet。

   ```
   Edit-EC2InstanceAttribute `
       -InstanceId {{i-1234567890abcdef0}} `
       -SriovNetSupport "simple"
   ```

------

1. (可选) 从实例创建 AMI，如 中所述[创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md) 该 AMI 从实例继承增强联网属性。因此，您可以使用此 AMI 启动默认情况下启用了增强联网功能的其他实例。

1. 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机启动实例：[start-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/start-instances.html)（AWS CLI）或 [Start-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Start-EC2Instance.html)（AWS Tools for Windows PowerShell）。

1. 连接到您的实例，并使用`ixgbevf`中的 **ethtool -i eth{{n}}** 命令验证是否在网络接口上安装并加载了 [测试是否启用了增强联网功能](#test-enhanced-networking) 模块。

**启用增强联网（由实例存储支持的实例）**  
按照上述过程操作，直到您停止实例的步骤。按照[创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md)中所述创建新 AMI，确保在注册 AMI 时启用增强联网属性。

------
#### [ AWS CLI ]

如下所示使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 命令。

```
aws ec2 register-image --sriov-net-support simple ...
```

------
#### [ PowerShell ]

按如下方式使用 [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html)。

```
Register-EC2Image -SriovNetSupport "simple" ...
```

------

### Ubuntu
<a name="enhanced-networking-ubuntu"></a>

在开始之前，在您的实例上[检查是否已启用增强联网](#test-enhanced-networking)。

Quick Start Ubuntu HVM AMI 包含实现增强联网所需的驱动程序。如果您的 `ixgbevf` 版本早于 2.16.4，则可以安装 `linux-aws` 内核程序包以获取最新增强的联网功能驱动程序。

以下过程提供了在 Ubuntu 实例上编译 `ixgbevf` 模块的一般步骤。<a name="ubuntu-enhanced-networking-procedure"></a>

**安装 `linux-aws` 内核程序包**

1. <a name="ubuntu-enhanced-networking-start-step"></a>连接到您的 实例。

1. 更新包缓存和包。

   ```
   ubuntu:~$ sudo apt-get update && sudo apt-get upgrade -y linux-aws
   ```
**重要**  
如果在更新过程中系统提示您安装 `grub`，请使用 `/dev/xvda` 安装 `grub`，然后选择保留当前版本的 `/boot/grub/menu.lst`。

### 其他 Linux 分配
<a name="enhanced-networking-linux"></a>

在开始之前，在您的实例上[检查是否已启用增强联网](#test-enhanced-networking)。最新 Quick Start HVM AMI 包含实现增强联网所需的驱动程序，因此您无需执行其他步骤。

下面的过程提供了在 Amazon Linux 或 Ubuntu 之外的 Linux 发行版上启用 Intel 82599 VF 接口增强联网所需的一般步骤。有关更多信息 (如命令的详细语法、文件位置或包和工具支持)，请参阅您的 Linux 发行版的特定文档。

**对 Linux 启用增强联网**

1. <a name="other-linux-enhanced-networking-start-step"></a>连接到您的 实例。

1. 从 Sourceforge 上的 `ixgbevf`https://sourceforge.net/projects/e1000/files/%20stable/[ 位置在实例上下载 ](https://sourceforge.net/projects/e1000/files/ixgbevf%20stable/)ixgbevf 模块的源代码。

   早于 2.16.4 的 `ixgbevf` 版本 (包括版本 2.14.2) 在某些 Linux 发行版 (包括某些 Ubuntu 版本) 上构建不正确。

1. 在实例上编译并安装 `ixgbevf` 模块。
**警告**  
如果您为当前内核编译 `ixgbevf` 模块，然后升级内核而不为新内核重新构建驱动程序，则系统会在下次重新启动时恢复为特定于发行版的 `ixgbevf` 模块。这可能会在特定于发行版的版本与增强联网不兼容时使您的系统无法访问。

1. 运行 **sudo depmod** 命令以更新模块依赖项。

1. <a name="other-linux-enhanced-networking-stop-step"></a>在实例上更新 `initramfs` 以确保在启动时加载新模块。

1. <a name="predictable-network-names-sriov"></a>确定您的系统是否默认使用可预测的网络接口名称。使用 **systemd** 或 **udev** 版本 197 或更高版本的系统可以重命名以太网设备，它们不保证单个网络接口将命名为 `eth0`。此行为可能导致连接到实例时出现问题。要获取更多信息并查看其他配置选项，请参阅 freedesktop.org 网站上的[可预测的网络接口名称](https://www.freedesktop.org/wiki/Software/systemd/PredictableNetworkInterfaceNames/)。

   1. 您可以使用以下命令在基于 RPM 的系统上检查 **systemd** 或 **udev** 版本：

      ```
      [ec2-user ~]$ rpm -qa | grep -e '^systemd-[0-9]\+\|^udev-[0-9]\+'
      				systemd-208-11.el7_0.2.x86_64
      ```

      在以上 Red Hat Enterprise Linux 7 示例中，**systemd** 版本是 208，因此必须禁用可预测的网络接口名称。

   1. 通过将 `net.ifnames=0` 选项添加到 `GRUB_CMDLINE_LINUX` 中的 `/etc/default/grub` 行，可禁用可预测的网络接口名称。

      ```
      [ec2-user ~]$ sudo sed -i '/^GRUB\_CMDLINE\_LINUX/s/\"$/\ net\.ifnames\=0\"/' /etc/default/grub
      ```

   1. 重新构建 grub 配置文件。

      ```
      [ec2-user ~]$ sudo grub2-mkconfig -o /boot/grub2/grub.cfg
      ```

1. [由 EBS 支持的实例] 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机停止实例：[stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html)（AWS CLI）或 [Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html)（AWS Tools for Windows PowerShell）。

   [实例存储支持的实例] 您无法停止实例来修改属性。请跳到下一步。

1. 使用以下任一命令从本地电脑启用增强联网属性：

------
#### [ AWS CLI ]

   如下所示使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令。

   ```
   aws ec2 modify-instance-attribute \
       --instance-id {{i-1234567890abcdef0}} -\
       -sriov-net-support simple
   ```

------
#### [ PowerShell ]

   按如下方式使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet。

   ```
   Edit-EC2InstanceAttribute `
       -InstanceId {{i-1234567890abcdef0}} `
       -SriovNetSupport "simple"
   ```

------

1. (可选) 从实例创建 AMI，如 中所述[创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md) 该 AMI 从实例继承增强联网属性。因此，您可以使用此 AMI 启动默认情况下启用了增强联网功能的其他实例。

   如果您的实例操作系统包含 `/etc/udev/rules.d/70-persistent-net.rules` 文件，则必须在创建 AMI 之前将其删除。此文件包含原始实例的以太网适配器 MAC 地址。如果其他实例使用此文件启动，操作系统将找不到设备，`eth0` 会失败，从而导致启动问题。此文件将在下次启动过程中重新生成，从 AMI 启动的任意实例都会创建这个文件的自有版本。

1. 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机启动实例：[start-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/start-instances.html)（AWS CLI）或 [Start-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Start-EC2Instance.html)（AWS Tools for Windows PowerShell）。

1. (可选) 连接到实例并确认已安装模块。

**启用增强联网（由实例存储支持的实例）**  
按照上述过程操作，直到您停止实例的步骤。按照[创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md)中所述创建新 AMI，确保在注册 AMI 时启用增强联网属性。

------
#### [ AWS CLI ]

如下所示使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 命令。

```
aws ec2 register-image --sriov-net-support simple ...
```

------
#### [ PowerShell ]

按如下方式使用 [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html)。

```
Register-EC2Image -SriovNetSupport "simple" ...
```

------

### Windows
<a name="enable-windows"></a>

如果您启动了您的实例且该实例未启用增强联网，则必须下载所需的网络适配器驱动程序并将其安装到您的实例上，然后设置 `sriovNetSupport` 实例属性以激活增强联网。您只能对支持的实例类型启用此属性。有关更多信息，请参阅 [Amazon EC2 实例上的增强联网功能](enhanced-networking.md)。

**重要**  
要查看 Windows AMI 的最近驱动程序更新，请参阅《AWS Windows AMI 参考》中的 [Windows AMI version history](https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/ec2-windows-ami-version-history.html)**。

**启用增强联网**

1. <a name="amazon-linux-enhanced-networking-start-step"></a>连接到您的实例并以本地管理员身份登录。

1. [Windows Server 2016 及更高版本] 运行以下 EC2 Launch PowerShell 脚本，以便在安装此驱动程序后配置实例。

   ```
   PS C:\> C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\InitializeInstance.ps1 -Schedule
   ```
**重要**  
当您启用初始化实例 EC2 Launch 脚本时，管理员密码将重置。您可以修改配置文件，通过在初始化任务的设置中指定禁用管理员密码重置来禁用它。

1. 从实例中，为操作系统下载 Intel 网络适配器驱动程序：
   + ** Windows Server 2022**

     访问[下载页面](https://www.intel.com/content/www/us/en/download/706171/intel-network-adapter-driver-for-windows-server-2022.html)并下载 `Wired_driver_{{version}}_x64.zip`。
   + **Windows Server 2019**（包括服务器版本 1809 及更高版本\*）

     访问[下载页面](https://www.intel.com/content/www/us/en/download/19372/intel-network-adapter-driver-for-windows-server-2019.html)并下载 `Wired_driver_{{version}}_x64.zip`。
   + **Windows Server 2016**（包括服务器版本 1803 及更低版本\*）

     访问[下载页面](https://www.intel.com/content/www/us/en/download/18737/intel-network-adapter-driver-for-windows-server-2016.html)并下载 `Wired_driver_{{version}}_x64.zip`。
   + **Windows Server 2012 R2**

     访问[下载页面](https://www.intel.com/content/www/us/en/download/17480/intel-network-adapter-driver-for-windows-server-2012-r2.html)并下载 `Wired_driver_{{version}}_x64.zip`。
   + **Windows Server 2012**

     访问[下载页面](https://www.intel.com/content/www/us/en/download/16789/intel-network-adapter-driver-for-windows-server-2012.html)并下载 `Wired_driver_{{version}}_x64.zip`。
   + **Windows Server 2008 R2**

     访问[下载页面](https://www.intel.com/content/www/us/en/download/15590/intel-network-adapter-driver-for-windows-7-final-release.html)并下载 `PROWinx64Legacy.exe`。

   \* “Intel 驱动程序和软件”页面上未明确说明服务器版本 1803 及更低版本和 1809 及更高版本。

1. 为操作系统安装 Intel 网络适配器驱动程序。
   + **Windows Server 2008 R2**

     1. 在 **Downloads (下载)** 文件夹中，找到 `PROWinx64Legacy.exe` 文件，并将其重命名为 `PROWinx64Legacy.zip`。

     1. 提取 `PROWinx64Legacy.zip` 文件内容。

     1. 打开命令行，转到提取的文件夹，然后运行以下命令，以使用 `pnputil` 实用工具在驱动程序存储中添加和安装 INF 文件。

        ```
        C:\> pnputil -a PROXGB\Winx64\NDIS62\vxn62x64.inf
        ```
   + **Windows Server 2022、Windows Server 2019、Windows Server 2016、Windows Server 2012 R2 和 Windows Server 2012**

     1. 在 **Downloads (下载)** 文件夹中，提取 `Wired_driver_{{version}}_x64.zip` 文件内容。

     1. 打开命令行，转到提取的文件夹，然后运行以下命令之一，以使用 `pnputil` 实用工具在驱动程序存储中添加和安装 INF 文件。
        + Windows Server 2022

          ```
          pnputil -i -a PROXGB\Winx64\NDIS68\vxn68x64.inf
          ```
        + Windows Server 2019

          ```
          pnputil -i -a PROXGB\Winx64\NDIS68\vxn68x64.inf
          ```
        + Windows Server 2016

          ```
          pnputil -i -a PROXGB\Winx64\NDIS65\vxn65x64.inf
          ```
        + Windows Server 2012 R2

          ```
          pnputil -i -a PROXGB\Winx64\NDIS64\vxn64x64.inf
          ```
        + Windows Server 2012

          ```
          pnputil -i -a PROXGB\Winx64\NDIS63\vxn63x64.inf
          ```

1. 使用以下任一命令从本地电脑启用增强联网属性：

------
#### [ AWS CLI ]

   如下所示使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令。

   ```
   aws ec2 modify-instance-attribute \
       --instance-id {{i-1234567890abcdef0}} \
       --sriov-net-support simple
   ```

------
#### [ PowerShell ]

   按如下方式使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet。

   ```
   Edit-EC2InstanceAttribute `
       -InstanceId {{i-1234567890abcdef0}} `
       -SriovNetSupport "simple"
   ```

------

1. (可选) 从实例创建 AMI，如 中所述[创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md) 该 AMI 从实例继承增强联网属性。因此，您可以使用此 AMI 启动默认情况下启用了增强联网功能的其他实例。

1. 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机启动实例：[start-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/start-instances.html)（AWS CLI）或 [Start-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Start-EC2Instance.html)（AWS Tools for Windows PowerShell）。

## 对连接问题进行故障排除
<a name="enhanced-networking-troubleshooting"></a>

如果您在启用增强联网期间丢失连接，则 `ixgbevf` 模块可能与内核不兼容。请尝试安装用于您的实例的 Linux 发行版所附带的 `ixgbevf` 模块版本。

如果您为半虚拟化实例或 AMI 启用增强网络，则这可能会使您的实例无法访问。

有关更多信息，请参阅[如何在 EC2 实例上启用和配置增强联网？](https://repost.aws/knowledge-center/enable-configure-enhanced-networking)
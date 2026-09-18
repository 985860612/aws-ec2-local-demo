

# 在实例上启用增强联网
<a name="enabling_enhanced_networking"></a>

您使用的过程取决于实例的操作系统。

## Amazon Linux
<a name="enable-enhanced-networking-ena-AL"></a>

适用于 Amazon Linux 的 AMI 包含安装了 ENA 的增强联网所需的内核驱动程序，并启用了 ENA 支持。因此，如果使用 HVM 版本的 Amazon Linux 在支持的实例类型上启动实例，则已为您的实例启用增强联网。有关更多信息，请参阅 [测试是否启用了增强联网功能](test-enhanced-networking-ena.md)。

## Ubuntu
<a name="enhanced-networking-ena-ubuntu"></a>

最新的 Ubuntu HVM AMI 包含安装了 ENA 的增强联网所需的内核驱动程序，并启用了 ENA 支持。因此，如果使用最新的 Ubuntu HVM AMI 在支持的实例类型上启动实例，则已为您的实例启用增强联网。有关更多信息，请参阅[测试是否启用了增强联网功能](test-enhanced-networking-ena.md)。

如果您使用较旧的 AMI 启动了实例，并且实例尚未启用增强联网，则可以安装 `linux-aws` 内核程序包以获取最新的增强联网驱动程序并更新所需的属性。

**安装 `linux-aws` 内核程序包（Ubuntu 16.04 或更高版本）**  
Ubuntu 16.04 和 18.04 随附 Ubuntu 自定义内核（`linux-aws` 内核程序包）。要使用其他内核，请联系 [支持](https://console.aws.amazon.com/support)。<a name="ubuntu-enhanced-networking-ena-procedure"></a>

**安装 `linux-aws` 内核程序包（Ubuntu Trusty 14.04）**

1. <a name="ubuntu-enhanced-networking-ena-start-step"></a>连接到您的 实例。

1. 更新包缓存和包。

   ```
   ubuntu:~$ sudo apt-get update && sudo apt-get upgrade -y linux-aws
   ```
**重要**  
如果在更新过程中系统提示您安装 `grub`，请使用 `/dev/xvda` 安装 `grub`，然后选择保留当前版本的 `/boot/grub/menu.lst`。

1. [由 EBS 支持的实例] 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机停止实例：[stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html)（AWS CLI）或 [Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html)（AWS Tools for Windows PowerShell）。

   [实例存储支持的实例] 您无法停止实例来修改属性。请执行此过程：[在 Ubuntu 上启用增强联网（由实例存储支持的实例）](#enhanced-networking-ena-instance-store-ubuntu)。

1. 使用以下任一命令从本地电脑启用增强联网属性：
   + [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) (AWS CLI)

     ```
     aws ec2 modify-instance-attribute --instance-id {{i-1234567890abcdef0}} --ena-support
     ```
   + [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html)（适用于 Windows PowerShell 的工具）

     ```
     Edit-EC2InstanceAttribute -InstanceId {{i-1234567890abcdef0}} -EnaSupport $true
     ```

1. (可选) 从实例创建 AMI，如 中所述[创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md) 该 AMI 从实例继承增强联网 `enaSupport` 属性。因此，您可以使用此 AMI 启动默认情况下启用了增强联网功能的其他实例。

1. 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机启动实例：[start-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/start-instances.html)（AWS CLI）或 [Start-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Start-EC2Instance.html)（AWS Tools for Windows PowerShell）。<a name="enhanced-networking-ena-instance-store-ubuntu"></a>

**在 Ubuntu 上启用增强联网（由实例存储支持的实例）**

按照上述过程操作，直到您停止实例的步骤。按照[创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md)中所述创建新 AMI，确保在注册 AMI 时启用增强联网属性。
+ [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) (AWS CLI)

  ```
  aws ec2 register-image --ena-support ...
  ```
+ [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html) (AWS Tools for Windows PowerShell)

  ```
  Register-EC2Image -EnaSupport $true ...
  ```

## RHEL、SUSE、CentOS
<a name="enhanced-networking-ena-linux"></a>

Red Hat Enterprise Linux、SUSE Linux Enterprise Server 和 CentOS 的最新 AMI 包含使用了 ENA 的增强联网所需的内核驱动程序，并启用了 ENA 支持。因此，如果使用最新的 AMI 在支持的实例类型上启动实例，则已为您的实例启用增强联网。有关更多信息，请参阅[测试是否启用了增强联网功能](test-enhanced-networking-ena.md)。

下面的过程提供了在 Amazon Linux AMI 或 Ubuntu 之外的 Linux 发行版上启用增强联网的一般步骤。有关更多信息（如命令的详细语法、文件位置或包和工具支持），请参阅您的 Linux 发行版的文档。

**对 Linux 启用增强联网**

1. <a name="other-linux-enhanced-networking-ena-start-step"></a>连接到您的实例。

1. 从 GitHub 的以下网址克隆实例上的 `ena` 内核驱动程序源代码：[https://github.com/amzn/amzn-drivers](https://github.com/amzn/amzn-drivers)。（默认情况下，SUSE Linux Enterprise Server 12 SP2 及更高版本包含 ENA 2.02，因此不需要下载和编译 ENA 驱动程序。对于 SUSE Linux Enterprise Server 12 SP2 及更高版本，您应该提交一个请求，将您想要的驱动程序版本添加到存储内核中）。

   ```
   git clone https://github.com/amzn/amzn-drivers
   ```

1. 在实例上编译并安装 `ena` 内核驱动程序。这些步骤取决于 Linux 发行版。有关在 Red Hat Enterprise Linux 上编译内核驱动程序的更多信息，请参阅[如何在运行 RHEL 的 Amazon EC2 实例上安装并激活最新的 ENA 驱动程序，以便获得增强型网络支持？](https://repost.aws/knowledge-center/install-ena-driver-rhel-ec2)

1. 运行 **sudo depmod** 命令来更新内核驱动程序依赖项。

1. <a name="other-linux-enhanced-networking-ena-stop-step"></a>在实例上更新 `initramfs`，确保在启动时加载新内核驱动程序。例如，如果您的发行版支持 **dracut**，则可使用以下命令。

   ```
   dracut -f -v
   ```

1. <a name="predictable-network-names-ena"></a>确定您的系统是否默认使用可预测的网络接口名称。使用 **systemd** 或 **udev** 版本 197 或更高版本的系统可以重命名以太网设备，它们不保证单个网络接口将命名为 `eth0`。此行为可能导致连接到实例时出现问题。要获取更多信息并查看其他配置选项，请参阅 freedesktop.org 网站上的[可预测的网络接口名称](https://www.freedesktop.org/wiki/Software/systemd/PredictableNetworkInterfaceNames/)。

   1. 您可以使用以下命令在基于 RPM 的系统上检查 **systemd** 或 **udev** 版本。

      ```
      rpm -qa | grep -e '^systemd-[0-9]\+\|^udev-[0-9]\+'
      systemd-208-11.el7_0.2.x86_64
      ```

      在此 Red Hat Enterprise Linux 7 示例中，**systemd** 版本为 208，因此必须禁用可预测的网络接口名称。

   1. 通过将 `net.ifnames=0` 选项添加到 `GRUB_CMDLINE_LINUX` 中的 `/etc/default/grub` 行，可禁用可预测的网络接口名称。

      ```
      sudo sed -i '/^GRUB\_CMDLINE\_LINUX/s/\"$/\ net\.ifnames\=0\"/' /etc/default/grub
      ```

   1. 重新构建 grub 配置文件。

      ```
      sudo grub2-mkconfig -o /boot/grub2/grub.cfg
      ```

1. [由 EBS 支持的实例] 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机停止实例：[stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html)（AWS CLI）、[Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html)（AWS Tools for Windows PowerShell）。

   [实例存储支持的实例] 您无法停止实例来修改属性。请执行此过程：[在 Linux 上启用增强联网（由实例存储支持的实例）](#other-linux-enhanced-networking-ena-instance-store)。

1. 使用以下任一命令从本地计算机启用增强联网 `enaSupport` 属性：
   + [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) (AWS CLI)

     ```
     aws ec2 modify-instance-attribute --instance-id {{i-1234567890abcdef0}} --ena-support
     ```
   + [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html)（适用于 Windows PowerShell 的工具）

     ```
     Edit-EC2InstanceAttribute -InstanceId {{i-1234567890abcdef0}} -EnaSupport $true
     ```

1. (可选) 从实例创建 AMI，如 中所述[创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md) 该 AMI 从实例继承增强联网 `enaSupport` 属性。因此，您可以使用此 AMI 启动默认情况下启用了增强联网功能的其他实例。

   如果您的实例操作系统包含 `/etc/udev/rules.d/70-persistent-net.rules` 文件，则必须在创建 AMI 之前将其删除。此文件包含原始实例的以太网适配器 MAC 地址。如果其他实例使用此文件启动，操作系统将找不到设备，`eth0` 会失败，从而导致启动问题。此文件将在下次启动过程中重新生成，从 AMI 启动的任意实例都会创建这个文件的自有版本。

1. 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机启动实例：[start-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/start-instances.html)（AWS CLI）或 [Start-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Start-EC2Instance.html)（AWS Tools for Windows PowerShell）。

1. （可选）连接到实例并验证是否安装了内核驱动程序。

   如果您在启用增强联网之后无法连接到实例，请参阅[排查 Linux 上 ENA 内核驱动程序的问题](troubleshooting-ena.md)。<a name="other-linux-enhanced-networking-ena-instance-store"></a>

**在 Linux 上启用增强联网（由实例存储支持的实例）**

按照上述过程操作，直到您停止实例的步骤。按照[创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md)中所述创建新 AMI，确保在注册 AMI 时启用增强联网属性。
+ [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) (AWS CLI)

  ```
  aws ec2 register-image --ena-support ...
  ```
+ [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html) (AWS Tools for Windows PowerShell)

  ```
  Register-EC2Image -EnaSupport ...
  ```

## 带有 DKMS 的 Ubuntu
<a name="enhanced-networking-ena-ubuntu-dkms"></a>

此方法仅用于测试和反馈目的。它不供生产部署使用。有关生产部署，请参阅[Ubuntu](#enhanced-networking-ena-ubuntu)。

**重要**  
使用 DKMS 可避免您的订阅的支持协议。不得将其用于生产部署。

**在 Ubuntu 上启用 ENA 增强联网 (EBS 支持的实例)**

1. 按照[Ubuntu](#enhanced-networking-ena-ubuntu)中的步骤 1 和 2 操作。

1. 安装 `build-essential` 程序包来编译内核驱动程序和 `dkms` 程序包，这样每次更新内核时都会重建 `ena` 内核驱动程序。

   ```
   ubuntu:~$ sudo apt-get install -y build-essential dkms
   ```

1. 从 GitHub 的以下网址克隆实例上的 `ena` 内核驱动程序源：[https://github.com/amzn/amzn-drivers](https://github.com/amzn/amzn-drivers)。

   ```
   ubuntu:~$ git clone https://github.com/amzn/amzn-drivers
   ```

1. 将 `amzn-drivers` 包移动到 `/usr/src/` 目录，以便 DKMS 可以在每次内核更新中找到并构建该模块。将源代码的版本号 (您可在发行说明中找到当前版本号) 附加到目录名称。例如，版本 `1.0.0` 显示在以下示例中。

   ```
   ubuntu:~$ sudo mv amzn-drivers /usr/src/amzn-drivers-1.0.0
   ```

1. 使用以下值创建 DKMS 配置文件（替代您的 `ena` 版本）。

   创建 文件。

   ```
   ubuntu:~$ sudo touch /usr/src/amzn-drivers-1.0.0/dkms.conf
   ```

   编辑文件并添加以下值。

   ```
   ubuntu:~$ sudo vim /usr/src/amzn-drivers-1.0.0/dkms.conf
   PACKAGE_NAME="ena"
   PACKAGE_VERSION="1.0.0"
   CLEAN="make -C kernel/linux/ena clean"
   MAKE="make -C kernel/linux/ena/ BUILD_KERNEL=${kernelver}"
   BUILT_MODULE_NAME[0]="ena"
   BUILT_MODULE_LOCATION="kernel/linux/ena"
   DEST_MODULE_LOCATION[0]="/updates"
   DEST_MODULE_NAME[0]="ena"
   AUTOINSTALL="yes"
   ```

1. 使用 DKMS 在实例上添加、生成和安装 `ena` 内核驱动程序。

   将内核驱动程序添加到 DKMS。

   ```
   ubuntu:~$ sudo dkms add -m amzn-drivers -v 1.0.0
   ```

   使用 **dkms** 命令生成内核驱动程序。

   ```
   ubuntu:~$ sudo dkms build -m amzn-drivers -v 1.0.0
   ```

   使用 **dkms** 安装内核驱动程序。

   ```
   ubuntu:~$ sudo dkms install -m amzn-drivers -v 1.0.0
   ```

1. 重新生成 `initramfs`，以便在启动时加载正确的内核驱动程序。

   ```
   ubuntu:~$ sudo update-initramfs -u -k all
   ```

1. 使用[测试是否启用了增强联网功能](test-enhanced-networking-ena.md)中的 modinfo ena 命令验证是否安装了 `ena` 内核驱动器。

   ```
   ubuntu:~$ modinfo ena
   filename:	   /lib/modules/3.13.0-74-generic/updates/dkms/ena.ko
   version:		1.0.0
   license:		GPL
   description:	Elastic Network Adapter (ENA)
   author:		 Amazon.com, Inc. or its affiliates
   srcversion:	 9693C876C54CA64AE48F0CA
   alias:		  pci:v00001D0Fd0000EC21sv*sd*bc*sc*i*
   alias:		  pci:v00001D0Fd0000EC20sv*sd*bc*sc*i*
   alias:		  pci:v00001D0Fd00001EC2sv*sd*bc*sc*i*
   alias:		  pci:v00001D0Fd00000EC2sv*sd*bc*sc*i*
   depends:
   vermagic:	   3.13.0-74-generic SMP mod_unload modversions
   parm:		   debug:Debug level (0=none,...,16=all) (int)
   parm:		   push_mode:Descriptor / header push mode (0=automatic,1=disable,3=enable)
   		  0 - Automatically choose according to device capability (default)
   		  1 - Don't push anything to device memory
   		  3 - Push descriptors and header buffer to device memory (int)
   parm:		   enable_wd:Enable keepalive watchdog (0=disable,1=enable,default=1) (int)
   parm:		   enable_missing_tx_detection:Enable missing Tx completions. (default=1) (int)
   parm:		   numa_node_override_array:Numa node override map
   (array of int)
   parm:		   numa_node_override:Enable/Disable numa node override (0=disable)
   (int)
   ```

1. 继续执行[Ubuntu](#enhanced-networking-ena-ubuntu)中的步骤 3。

## 在 Windows 上启用增强联网
<a name="enable-enhanced-networking-ena-windows"></a>

如果您启动了您的实例且该实例未启用增强联网，则必须下载所需的网络适配器驱动程序并将其安装到您的实例上，然后设置 `enaSupport` 实例属性以激活增强联网。

**启用增强联网**

1. 连接到您的实例并以本地管理员身份登录。

1. [仅限 Windows Server 2016 和 2019] 运行以下 EC2Launch PowerShell 脚本，以便在安装此驱动程序后配置实例。

   ```
   PS C:\> C:\ProgramData\Amazon\EC2-Windows\Launch\Scripts\InitializeInstance.ps1 -Schedule
   ```

1. 从实例安装驱动程序，如下所示：

   1. 将最新驱动程序[下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/Latest/AwsEnaNetworkDriver.zip)到实例。

   1. 提取 zip 存档。

   1. 通过运行 `install.ps1` PowerShell 脚本安装驱动程序。
**注意**  
如果您收到了执行策略错误，请将策略设置为 `Unrestricted`（默认情况下设置为 `Restricted` 或 `RemoteSigned`）。在命令行中，运行 `Set-ExecutionPolicy -ExecutionPolicy Unrestricted`，然后再次运行 `install.ps1` PowerShell 脚本。

1. 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机停止实例：[stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html)（AWS CLI）或 [Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html)）（AWS Tools for Windows PowerShell）。

1. 在您的实例上启用 ENA 支持，如下所示：

   1. 在您的本地计算机上，通过运行以下命令之一来检查实例的 EC2 实例 ENA 支持属性。如果未启用属性，则输出将为“[]”或为空。默认情况下，`EnaSupport` 设置为 `false`。
      + [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) (AWS CLI)

        ```
        aws ec2 describe-instances --instance-ids {{i-1234567890abcdef0}} --query "Reservations[].Instances[].EnaSupport"
        ```
      + [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html)（适用于 Windows PowerShell 的工具）

        ```
        (Get-EC2Instance -InstanceId {{i-1234567890abcdef0}}).Instances.EnaSupport
        ```

   1. 要启用 ENA 支持，请运行以下命令之一：
      + [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) (AWS CLI)

        ```
        aws ec2 modify-instance-attribute --instance-id {{i-1234567890abcdef0}} --ena-support
        ```
      + [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) (AWS Tools for Windows PowerShell)

        ```
        Edit-EC2InstanceAttribute -InstanceId {{i-1234567890abcdef0}} -EnaSupport $true
        ```

      如果在重新启动实例时遇到问题，也可以使用以下命令之一禁用 ENA 支持：
      + [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) (AWS CLI)

        ```
        aws ec2 modify-instance-attribute --instance-id {{i-1234567890abcdef0}} --no-ena-support
        ```
      + [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) (AWS Tools for Windows PowerShell)

        ```
        Edit-EC2InstanceAttribute -InstanceId {{i-1234567890abcdef0}} -EnaSupport $false
        ```

   1. 如前所示，使用 `true` 或 **describe-instances**，验证属性是否已设置为 **Get-EC2Instance**。现在，您应看到以下输出：

      ```
      [
      	true
      ]
      ```

1. 使用 Amazon EC2 控制台或以下任一命令从您的本地计算机启动实例：[start-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/start-instances.html)（AWS CLI）或 [Start-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Start-EC2Instance.html)（AWS Tools for Windows PowerShell）。

1. 在实例上，验证 ENA 驱动程序是否已如下所示安装并且启用：

   1. 打开网络图标的上下文（右键单击）菜单，然后选择**打开网络和共享中心**。

   1. 选择以太网适配器 (例如 **Ethernet 2**)。

   1. 选择 **Details**。对于**网络连接详细信息**，检查**描述**是否为 **Amazon 弹性网络适配器**。

1. (可选) 从实例创建 AMI。该 AMI 继承实例的 `enaSupport` 属性。因此，您可以使用该 AMI 来启动另一个默认启用 ENA 的实例。
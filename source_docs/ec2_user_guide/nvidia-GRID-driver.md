

# 安装 NVIDIA GRID 驱动程序（G7e、G6、Gr6、G6e、G6f、Gr6f、G5、G4dn 和 G3 实例）
<a name="nvidia-GRID-driver"></a>

这些下载仅供 AWS 客户使用。一旦开始下载，即表示您同意按照 NVIDIA GRID 云终端用户许可协议（EULA）中提及的 AWS 解决方案的要求，仅将下载的软件用来开发 AMI，以用于 NVIDIA L4、NVIDIA L40S、NVIDIA A10G、NVIDIA Tesla T4 或 NVIDIA Tesla M60 硬件。可使用 GRID 驱动程序在 AWS 环境中创建和使用 AMI。安装软件后，您将受 [NVIDIA GRID 云最终用户许可协议](https://aws-nvidia-license-agreement.s3.amazonaws.com/NvidiaGridAWSUserLicenseAgreement.DOCX)的条款约束。有关适用于您操作系统的 NVIDIA GRID 驱动程序版本的信息，请参阅 NVIDIA 网站上的 [NVIDIA Virtual GPU (vGPU) Software](https://docs.nvidia.com/vgpu/)。

**注意事项**
+ 对于 Linux，G7e 实例需要 GRID 19.1 或更高版本，对于 Windows，需要 19.4（582.16）或更高版本。
+ G6f 和 Gr6f 实例需要 GRID 18.4 至 GRID 19.5 版本。
+ G6e 实例需要 GRID 17.4 或更高版本。
+ G6 和 Gr6 实例需要 GRID 17.1 或更高版本。
+ G5 实例需要 GRID 13.1 或更高版本（或 GRID 12.4 或更高版本）。
+ 要让 GRID 许可正常运行，G3 实例需要 AWS 提供的 DNS 解析。
+ [IMDSv2](configuring-instance-metadata-service.md) 仅在 14.0 或更高版本的 NVIDIA 驱动程序上受支持。
+ 对于 Windows 实例，如果您使用自定义 Windows AMI 启动实例，则 AMI 必须是使用 Sysprep 创建的标准化映像，以确保 GRID 驱动程序正常工作。有关更多信息，请参阅 [使用 Windows Sysprep 创建 Amazon EC2 AMI](ami-create-win-sysprep.md)。
+ GRID 17.0 及更高版本不支持 Windows Server 2019。
+ GRID 14.2 及更高版本不支持 Windows Server 2016。
+ G3 实例不支持 GRID 17.0 及更高版本。
+ 对于 Linux 实例，如果 NVIDIA 安装程序失败并显示错误消息，则可能需要安装或更新软件包（例如 gcc）。具体情况取决于操作系统和内核的版本。有关更多信息，请参阅 NVIDIA 企业支持门户。

**先决条件**
+ (Linux) 验证 AWS CLI 是否已安装在您的实例上并配置了默认凭证。有关更多信息，请参阅《AWS Command Line Interface 用户指南》**中的[安装 AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)。
+ (Windows) 在您的实例上配置 AWS Tools for Windows PowerShell 的默认凭证。有关更多信息，请参阅《AWS Tools for PowerShell 用户指南》**中的 [AWS Tools for Windows PowerShell 入门](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-getting-started.html)。
+ 用户或角色必须具有包含 **AmazonS3ReadOnlyAccess** 策略的授予权限。

## Amazon Linux 2023
<a name="nvidia-grid-amazon-linux"></a>

**在实例上安装 NVIDIA GRID 驱动程序**

1. 连接到您的实例。更新软件包缓存并获取实例软件包更新。

   ```
   [ec2-user ~]$ sudo dnf update -y
   ```

1. 安装 **gcc** 和 **make**（如果尚未安装）。

   ```
   [ec2-user ~]$ sudo dnf install gcc make
   ```

1. 重启实例以加载最新内核版本。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 重启之后重新连接到实例。

1. 安装内核标头软件包。

   ```
   [ec2-user ~]$ sudo dnf install -y kernel-devel kernel-modules-extra
   ```

1. 使用以下命令下载 GRID 驱动程序安装实用程序：

   ```
   [ec2-user ~]$ aws s3 cp --recursive s3://ec2-linux-nvidia-drivers/latest/ .
   ```

   此存储桶中存储了多个版本的 GRID 驱动程序。您可以使用以下命令查看所有可用的版本。

   ```
   [ec2-user ~]$ aws s3 ls --recursive s3://ec2-linux-nvidia-drivers/
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序。

   ```
   [ec2-user ~]$ chmod +x NVIDIA-Linux-x86_64*.run
   ```

1. 如下所示运行自安装脚本，安装您下载的 GRID 驱动程序。例如：

   ```
   [ec2-user ~]$ sudo /bin/sh ./NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项（您可以接受默认选项）。

1. 确认驱动程序正常运行。以下命令的响应列出已安装的 NVIDIA 驱动程序版本和有关 GPU 的详细信息。

   ```
   [ec2-user ~]$ nvidia-smi -q | head
   ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 NVIDIA vGPU 软件版本 14.x 或更高版本，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

   ```
   [ec2-user ~]$ sudo touch /etc/modprobe.d/nvidia.conf
   ```

   ```
   [ec2-user ~]$ echo "options nvidia NVreg_EnableGpuFirmware=0" | sudo tee --append /etc/modprobe.d/nvidia.conf
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. （可选）根据您的用例，您可能会完成以下可选步骤。如果您不需要此功能，请不要完成这些步骤。

   1. 请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用四个高达 4K 分辨率的显示器的优势。

   1. NVIDIA Quadro 虚拟工作站模式默认处于启用状态。要为 RDSH 应用程序托管功能激活 GRID 虚拟应用程序，请完成[在基于 Amazon EC2 GPU 的实例上激活 NVIDIA GRID 虚拟应用程序](activate_grid.md)中的 GRID 虚拟应用程序激活步骤。

## Amazon Linux 2
<a name="nvidia-grid-amazon-linux-2"></a>

**在实例上安装 NVIDIA GRID 驱动程序**

1. 连接到您的实例。更新软件包缓存并获取实例软件包更新。

   ```
   [ec2-user ~]$ sudo yum update -y
   ```

1. 安装 **gcc** 和 **make**（如果尚未安装）。

   ```
   [ec2-user ~]$ sudo yum install gcc make
   ```

1. 重启实例以加载最新内核版本。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 重启之后重新连接到实例。

1. 为运行的内核版本安装内核标头软件包。

   ```
   [ec2-user ~]$ sudo yum install -y kernel-devel-$(uname -r)
   ```

1. 使用以下命令下载 GRID 驱动程序安装实用程序：

   ```
   [ec2-user ~]$ aws s3 cp --recursive s3://ec2-linux-nvidia-drivers/latest/ .
   ```

   此存储桶中存储了多个版本的 GRID 驱动程序。您可以使用以下命令查看所有可用的版本。

   ```
   [ec2-user ~]$ aws s3 ls --recursive s3://ec2-linux-nvidia-drivers/
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序。

   ```
   [ec2-user ~]$ chmod +x NVIDIA-Linux-x86_64*.run
   ```

1. 如下所示运行自安装脚本，安装您下载的 GRID 驱动程序。例如：

   ```
   [ec2-user ~]$ sudo /bin/sh ./NVIDIA-Linux-x86_64*.run
   ```

   如果您使用的是具有 5.10 内核版本的 Amazon Linux 2，请使用以下命令安装 GRID 驱动程序。

   ```
   [ec2-user ~]$ sudo CC=/usr/bin/gcc10-cc ./NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项（您可以接受默认选项）。

1. 确认驱动程序正常运行。以下命令的响应列出已安装的 NVIDIA 驱动程序版本和有关 GPU 的详细信息。

   ```
   [ec2-user ~]$ nvidia-smi -q | head
   ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 NVIDIA vGPU 软件版本 14.x 或更高版本，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

   ```
   [ec2-user ~]$ sudo touch /etc/modprobe.d/nvidia.conf
   ```

   ```
   [ec2-user ~]$ echo "options nvidia NVreg_EnableGpuFirmware=0" | sudo tee --append /etc/modprobe.d/nvidia.conf
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. （可选）根据您的用例，您可能会完成以下可选步骤。如果您不需要此功能，请不要完成这些步骤。

   1. 请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用四个高达 4K 分辨率的显示器的优势。

   1. NVIDIA Quadro 虚拟工作站模式默认处于启用状态。要为 RDSH 应用程序托管功能激活 GRID 虚拟应用程序，请完成[在基于 Amazon EC2 GPU 的实例上激活 NVIDIA GRID 虚拟应用程序](activate_grid.md)中的 GRID 虚拟应用程序激活步骤。

## CentOS 7 和 Red Hat Enterprise Linux 7
<a name="nvidia-grid-centos7-rhel7"></a>

**在实例上安装 NVIDIA GRID 驱动程序**

1. 连接到您的实例。更新软件包缓存并获取实例软件包更新。

   ```
   [ec2-user ~]$ sudo yum update -y
   ```

1. 安装 **gcc** 和 **make**（如果尚未安装）。

   ```
   [ec2-user ~]$ sudo yum install -y gcc make
   ```

1. 重启实例以加载最新内核版本。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 重启之后重新连接到实例。

1. 为您运行的内核版本安装内核标头软件包。

   ```
   [ec2-user ~]$ sudo yum install -y kernel-devel-$(uname -r)
   ```

1. 禁用 NVIDIA 显卡的 `nouveau` 开源驱动程序。

   1. 将 `nouveau` 添加到 `/etc/modprobe.d/blacklist.conf` 黑名单文件。复制下面的代码块并将其粘贴到终端中。

      ```
      [ec2-user ~]$ cat << EOF | sudo tee --append /etc/modprobe.d/blacklist.conf
      blacklist vga16fb
      blacklist nouveau
      blacklist rivafb
      blacklist nvidiafb
      blacklist rivatv
      EOF
      ```

   1. 编辑 `/etc/default/grub` 文件并添加以下行：

      ```
      GRUB_CMDLINE_LINUX="rdblacklist=nouveau"
      ```

   1. 重新生成 Grub 配置。

      ```
      [ec2-user ~]$ sudo grub2-mkconfig -o /boot/grub2/grub.cfg
      ```

1. 使用以下命令下载 GRID 驱动程序安装实用程序：

   ```
   [ec2-user ~]$ aws s3 cp --recursive s3://ec2-linux-nvidia-drivers/latest/ .
   ```

   此存储桶中存储了多个版本的 GRID 驱动程序。您可以使用以下命令查看所有可用的版本。

   ```
   [ec2-user ~]$ aws s3 ls --recursive s3://ec2-linux-nvidia-drivers/
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序。

   ```
   [ec2-user ~]$ chmod +x NVIDIA-Linux-x86_64*.run
   ```

1. 如下所示运行自安装脚本，安装您下载的 GRID 驱动程序。例如：

   ```
   [ec2-user ~]$ sudo /bin/sh ./NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项（您可以接受默认选项）。

1. 确认驱动程序正常运行。以下命令的响应列出已安装的 NVIDIA 驱动程序版本和有关 GPU 的详细信息。

   ```
   [ec2-user ~]$ nvidia-smi -q | head
   ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 NVIDIA vGPU 软件版本 14.x 或更高版本，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

   ```
   [ec2-user ~]$ sudo touch /etc/modprobe.d/nvidia.conf
   ```

   ```
   [ec2-user ~]$ echo "options nvidia NVreg_EnableGpuFirmware=0" | sudo tee --append /etc/modprobe.d/nvidia.conf
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. （可选）根据您的用例，您可能会完成以下可选步骤。如果您不需要此功能，请不要完成这些步骤。

   1. 请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用四个高达 4K 分辨率的显示器的优势。

   1. NVIDIA Quadro 虚拟工作站模式默认处于启用状态。要为 RDSH 应用程序托管功能激活 GRID 虚拟应用程序，请完成[在基于 Amazon EC2 GPU 的实例上激活 NVIDIA GRID 虚拟应用程序](activate_grid.md)中的 GRID 虚拟应用程序激活步骤。

   1. 安装 GUI 桌面/工作站程序包。

      ```
      [ec2-user ~]$ sudo yum groupinstall -y "Server with GUI"
      ```

## CentOS Stream 8 和 Red Hat Enterprise Linux 8
<a name="nvidia-grid-centos8-rhel8"></a>

**在实例上安装 NVIDIA GRID 驱动程序**

1. 连接到您的实例。更新软件包缓存并获取实例软件包更新。

   ```
   [ec2-user ~]$ sudo yum update -y
   ```

1. 安装 **gcc** 和 **make**（如果尚未安装）。

   ```
   [ec2-user ~]$ sudo yum install -y gcc make
   ```

1. 重启实例以加载最新内核版本。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 重启之后重新连接到实例。

1. 为您运行的内核版本安装内核标头软件包。

   ```
   [ec2-user ~]$ sudo dnf install -y elfutils-libelf-devel libglvnd-devel kernel-devel-$(uname -r)
   ```

1. 使用以下命令下载 GRID 驱动程序安装实用程序：

   ```
   [ec2-user ~]$ aws s3 cp --recursive s3://ec2-linux-nvidia-drivers/latest/ .
   ```

   此存储桶中存储了多个版本的 GRID 驱动程序。您可以使用以下命令查看所有可用的版本。

   ```
   [ec2-user ~]$ aws s3 ls --recursive s3://ec2-linux-nvidia-drivers/
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序。

   ```
   [ec2-user ~]$ chmod +x NVIDIA-Linux-x86_64*.run
   ```

1. 如下所示运行自安装脚本，安装您下载的 GRID 驱动程序。例如：

   ```
   [ec2-user ~]$ sudo /bin/sh ./NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项（您可以接受默认选项）。

1. 确认驱动程序正常运行。以下命令的响应列出已安装的 NVIDIA 驱动程序版本和有关 GPU 的详细信息。

   ```
   [ec2-user ~]$ nvidia-smi -q | head
   ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 NVIDIA vGPU 软件版本 14.x 或更高版本，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

   ```
   [ec2-user ~]$ sudo touch /etc/modprobe.d/nvidia.conf
   ```

   ```
   [ec2-user ~]$ echo "options nvidia NVreg_EnableGpuFirmware=0" | sudo tee --append /etc/modprobe.d/nvidia.conf
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. （可选）根据您的用例，您可能会完成以下可选步骤。如果您不需要此功能，请不要完成这些步骤。

   1. 请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用四个高达 4K 分辨率的显示器的优势。

   1. NVIDIA Quadro 虚拟工作站模式默认处于启用状态。要为 RDSH 应用程序托管功能激活 GRID 虚拟应用程序，请完成[在基于 Amazon EC2 GPU 的实例上激活 NVIDIA GRID 虚拟应用程序](activate_grid.md)中的 GRID 虚拟应用程序激活步骤。

   1. 安装 GUI 工作站程序包。

      ```
      [ec2-user ~]$ sudo dnf groupinstall -y workstation
      ```

## Rocky Linux 8
<a name="nvidia-grid-rocky-linux-8"></a>

**在 Linux 实例上安装 NVIDIA GRID 驱动程序**

1. 连接到您的实例。更新软件包缓存并获取实例软件包更新。

   ```
   [ec2-user ~]$ sudo yum update -y
   ```

1. 安装 **gcc** 和 **make**（如果尚未安装）。

   ```
   [ec2-user ~]$ sudo yum install -y gcc make
   ```

1. 重启实例以加载最新内核版本。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 重启之后重新连接到实例。

1. 为您运行的内核版本安装内核标头软件包。

   ```
   [ec2-user ~]$ sudo dnf install -y elfutils-libelf-devel libglvnd-devel kernel-devel-$(uname -r)
   ```

1. 使用以下命令下载 GRID 驱动程序安装实用程序：

   ```
   [ec2-user ~]$ aws s3 cp --recursive s3://ec2-linux-nvidia-drivers/latest/ .
   ```

   此存储桶中存储了多个版本的 GRID 驱动程序。您可以使用以下命令查看所有可用的版本。

   ```
   [ec2-user ~]$ aws s3 ls --recursive s3://ec2-linux-nvidia-drivers/
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序。

   ```
   [ec2-user ~]$ chmod +x NVIDIA-Linux-x86_64*.run
   ```

1. 如下所示运行自安装脚本，安装您下载的 GRID 驱动程序。例如：

   ```
   [ec2-user ~]$ sudo /bin/sh ./NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项（您可以接受默认选项）。

1. 确认驱动程序正常运行。以下命令的响应列出已安装的 NVIDIA 驱动程序版本和有关 GPU 的详细信息。

   ```
   [ec2-user ~]$ nvidia-smi -q | head
   ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 NVIDIA vGPU 软件版本 14.x 或更高版本，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

   ```
   [ec2-user ~]$ sudo touch /etc/modprobe.d/nvidia.conf
   ```

   ```
   [ec2-user ~]$ echo "options nvidia NVreg_EnableGpuFirmware=0" | sudo tee --append /etc/modprobe.d/nvidia.conf
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. （可选）根据您的用例，您可能会完成以下可选步骤。如果您不需要此功能，请不要完成这些步骤。

   1. 请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用四个高达 4K 分辨率的显示器的优势。

   1. NVIDIA Quadro 虚拟工作站模式默认处于启用状态。要为 RDSH 应用程序托管功能激活 GRID 虚拟应用程序，请完成[在基于 Amazon EC2 GPU 的实例上激活 NVIDIA GRID 虚拟应用程序](activate_grid.md)中的 GRID 虚拟应用程序激活步骤。

## Ubuntu 和 Debian
<a name="nvidia-grid-ubuntu-debian"></a>

**在实例上安装 NVIDIA GRID 驱动程序**

1. 连接到您的实例。更新软件包缓存并获取实例软件包更新。

   ```
   $ sudo apt-get update -y
   ```

1. 安装 **gcc** 和 **make**（如果尚未安装）。

   ```
   $ sudo apt-get install -y gcc make
   ```

1. （Ubuntu）升级 `linux-aws` 程序包以接收最新版本。

   ```
   $ sudo apt-get upgrade -y linux-aws
   ```

   （Debian）升级程序包以接收最新版本。

   ```
   $ sudo apt-get upgrade -y
   ```

1. 重启实例以加载最新内核版本。

   ```
   $ sudo reboot
   ```

1. 重启之后重新连接到实例。

1. 为您当前运行的内核版本安装内核标头软件包。

   ```
   $ sudo apt-get install -y linux-headers-$(uname -r) linux-modules-extra-$(uname -r)
   ```

1. 禁用 NVIDIA 显卡的 `nouveau` 开源驱动程序。

   1. 将 `nouveau` 添加到 `/etc/modprobe.d/blacklist.conf` 黑名单文件。复制下面的代码块并将其粘贴到终端中。

      ```
      $ cat << EOF | sudo tee --append /etc/modprobe.d/blacklist.conf
      blacklist vga16fb
      blacklist nouveau
      blacklist rivafb
      blacklist nvidiafb
      blacklist rivatv
      EOF
      ```

   1. 编辑 `/etc/default/grub` 文件并添加以下行：

      ```
      GRUB_CMDLINE_LINUX="rdblacklist=nouveau"
      ```

   1. 重新生成 Grub 配置。

      ```
      $ sudo update-grub
      ```

1. 使用以下命令下载 GRID 驱动程序安装实用程序：

   ```
   $ aws s3 cp --recursive s3://ec2-linux-nvidia-drivers/latest/ .
   ```

   此存储桶中存储了多个版本的 GRID 驱动程序。您可以使用以下命令查看所有可用的版本。

   ```
   $ aws s3 ls --recursive s3://ec2-linux-nvidia-drivers/
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序。

   ```
   $ chmod +x NVIDIA-Linux-x86_64*.run
   ```

1. 如下所示运行自安装脚本，安装您下载的 GRID 驱动程序。例如：

   ```
   $ sudo /bin/sh ./NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项（您可以接受默认选项）。

1. 确认驱动程序正常运行。以下命令的响应列出已安装的 NVIDIA 驱动程序版本和有关 GPU 的详细信息。

   ```
   $ nvidia-smi -q | head
   ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 NVIDIA vGPU 软件版本 14.x 或更高版本，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

   ```
   $ sudo touch /etc/modprobe.d/nvidia.conf
   ```

   ```
   $ echo "options nvidia NVreg_EnableGpuFirmware=0" | sudo tee --append /etc/modprobe.d/nvidia.conf
   ```

1. 重启实例。

   ```
   $ sudo reboot
   ```

1. （可选）根据您的用例，您可能会完成以下可选步骤。如果您不需要此功能，请不要完成这些步骤。

   1. 请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用四个高达 4K 分辨率的显示器的优势。

   1. NVIDIA Quadro 虚拟工作站模式默认处于启用状态。要为 RDSH 应用程序托管功能激活 GRID 虚拟应用程序，请完成[在基于 Amazon EC2 GPU 的实例上激活 NVIDIA GRID 虚拟应用程序](activate_grid.md)中的 GRID 虚拟应用程序激活步骤。

   1. 安装 GUI 桌面/工作站程序包。

      ```
      $ sudo apt-get install -y lightdm ubuntu-desktop
      ```

## Windows 操作系统
<a name="nvidia-grid-windows"></a>

**在 Windows 实例上安装 NVIDIA GRID 驱动程序**

1. 连接到您的 Windows 实例并打开 PowerShell 窗口。

1. 使用以下 PowerShell 命令，将驱动程序和 [NVIDIA GRID Cloud 最终用户许可协议](https://aws-nvidia-license-agreement.s3.amazonaws.com/NvidiaGridAWSUserLicenseAgreement.DOCX)从 Amazon S3 下载到您的桌面。

   ```
   $Bucket = "ec2-windows-nvidia-drivers"
   $KeyPrefix = "latest"
   $LocalPath = "$home\Desktop\NVIDIA"
   $Objects = Get-S3Object -BucketName $Bucket -KeyPrefix $KeyPrefix -Region us-east-1
   foreach ($Object in $Objects) {
   $LocalFileName = $Object.Key
   if ($LocalFileName -ne '' -and $Object.Size -ne 0) {
   $LocalFilePath = Join-Path $LocalPath $LocalFileName
   Copy-S3Object -BucketName $Bucket -Key $Object.Key -LocalFile $LocalFilePath -Region us-east-1
   }
   }
   ```

   此存储桶中存储了多个版本的 NVIDIA GRID 驱动程序。您可以通过删除 `-KeyPrefix $KeyPrefix` 选项下载桶中的所有可用 Windows 版本。有关适用于您操作系统的 NVIDIA GRID 驱动程序版本的信息，请参阅 NVIDIA 网站上的 [NVIDIA Virtual GPU (vGPU) Software](https://docs.nvidia.com/vgpu/)。

   从 GRID 版本 11.0 开始，您可以对 G3 和 G4dn 实例使用 `latest` 下的驱动程序。我们不会将 11.0 之后的版本添加到 `g4/latest` 中，但会将版本 11.0 和特定于 G4dn 的早期版本保留在 `g4/latest` 下。

   G5 实例需要 GRID 13.1 或更高版本（或 GRID 12.4 或更高版本）。

1. 导航到桌面，打开安装文件以启动它（选择与您的实例操作系统版本对应的驱动程序版本）。按照说明安装驱动程序并根据需要重启实例。要验证 GPU 是否正常工作，请检查设备管理器。

1. （可选）使用以下命令可在控制面板中禁用授权页面以防止用户意外更改产品类型（默认情况下，将启用 NVIDIA GRID 虚拟工作站）。有关更多信息，请参阅 [GRID 许可用户指南](https://docs.nvidia.com/vgpu/4.6/grid-licensing-user-guide/index.html)。

**PowerShell**  
运行以下 PowerShell 命令以创建注册表值，从而在控制面板中禁用授权页面。AWS Windows AMI 中的 AWS Tools for PowerShell 默认为 32 位版本，并且此命令将失败。相反，将使用操作系统附带的 64 位版本的 PowerShell。

   ```
   New-Item -Path "HKLM:\SOFTWARE\NVIDIA Corporation\Global" -Name GridLicensing
   New-ItemProperty -Path "HKLM:\SOFTWARE\NVIDIA Corporation\Global\GridLicensing" -Name "NvCplDisableManageLicensePage" -PropertyType "DWord" -Value "1"
   ```

**命令提示符**  
运行以下注册表命令以创建注册表值，从而在控制面板中禁用授权页面。您可以使用命令提示符窗口或 64 位版本的 PowerShell 运行它。

   ```
   reg add "HKLM\SOFTWARE\NVIDIA Corporation\Global\GridLicensing" /v NvCplDisableManageLicensePage /t REG_DWORD /d 1
   ```

1. （可选）根据您的用例，您可能会完成以下可选步骤。如果您不需要此功能，请不要完成这些步骤。

   1. 请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用四个高达 4K 分辨率的显示器的优势。

   1. NVIDIA Quadro 虚拟工作站模式默认处于启用状态。要为 RDSH 应用程序托管功能激活 GRID 虚拟应用程序，请完成[在基于 Amazon EC2 GPU 的实例上激活 NVIDIA GRID 虚拟应用程序](activate_grid.md)中的 GRID 虚拟应用程序激活步骤。
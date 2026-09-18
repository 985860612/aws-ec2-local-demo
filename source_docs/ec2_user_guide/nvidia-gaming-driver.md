

# 安装 NVIDIA 游戏驱动程序（G7e、G6、G6e、G5 和 G4dn 实例）
<a name="nvidia-gaming-driver"></a>

这些驱动程序仅供 AWS 客户使用。下载即表明您同意仅将下载的软件用于开发在 RTX PRO 6000 Blackwell、NVIDIA L4、NVIDIA L40S、NVIDIA A10G、NVIDIA Tesla T4 或 NVIDIA Tesla M60 硬件上使用的 AMI。可使用 GRID 驱动程序在 AWS 环境中创建和使用 AMI。安装软件后，您将受 [NVIDIA GRID 云最终用户许可协议](https://aws-nvidia-license-agreement.s3.amazonaws.com/NvidiaGridAWSUserLicenseAgreement.DOCX)的条款约束。

**注意事项**
+ 要让 GRID 许可正常运行，G3 实例需要 AWS 提供的 DNS 解析。
+ [IMDSv2](configuring-instance-metadata-service.md) 仅在 495.x 或更高版本的 NVIDIA 驱动程序上受支持。

**先决条件**
+ (Linux) 验证 AWS CLI 是否已安装在您的实例上并配置了默认凭证。有关更多信息，请参阅《AWS Command Line Interface 用户指南》**中的[安装 AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)。
+ 用户或角色必须具有包含 **AmazonS3ReadOnlyAccess** 策略的授予权限。

## Amazon Linux 2023
<a name="nvidia-gaming-amazon-linux"></a>

**在实例上安装 NVIDIA Gaming 驱动程序**

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

1. 重启后重新连接到您的实例。

1. 安装内核标头软件包。

   ```
   [ec2-user ~]$ sudo dnf install -y kernel-devel kernel-modules-extra kernel-devel-$(uname -r) kernel-headers-$(uname -r) dkms
   ```

1. 使用以下命令下载 Gaming 驱动程序安装实用程序：

   ```
   [ec2-user ~]$ aws s3 cp --recursive s3://nvidia-gaming/linux/latest/ .
   ```

   此存储桶中存储了多个版本的游戏驱动程序。您可以使用以下命令查看所有可用的版本：

   ```
   [ec2-user ~]$ aws s3 ls --recursive s3://nvidia-gaming/linux/
   ```

1. 从下载的 `.zip` 归档中提取 Gaming 驱动程序安装实用程序。

   ```
   [ec2-user ~]$ unzip {{latest-driver-name}}.zip -d nvidia-drivers
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序：

   ```
   [ec2-user ~]$ chmod +x nvidia-drivers/NVIDIA-Linux-x86_64*-grid.run
   ```

1. 使用以下命令运行安装程序：

   ```
   [ec2-user ~]$ sudo ./nvidia-drivers/NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项 (您可以接受默认选项)。

1. 使用以下命令创建所需的配置文件。

   ```
   [ec2-user ~]$ cat << EOF | sudo tee -a /etc/nvidia/gridd.conf
   vGamingMarketplace=2
   EOF
   ```

1. 使用以下命令下载并重命名认证文件。
   + 对于 590.48 及更高版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert_2026_03_02.cert"
     ```
   + 对于 575.64 到 580.105.08 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2025_07_01.cert"
     ```
   + 对于 460.39 到 575.57 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2024_02_22.cert"
     ```
   + 对于 440.68 到 445.48 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2020_04.cert"
     ```
   + 对于早期版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2019_09.cert"
     ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 510.x 或更高版本的 NVIDIA 驱动程序，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

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

1. 请使用以下命令验证 NVIDIA Gaming 许可证。

   ```
   [ec2-user ~]$ nvidia-smi.exe -q
   ```

   在输出中，搜索 `vGPU Software Licensed Product`。

1. （可选）请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用单个高达 4K 分辨率的显示器的优势。

## Amazon Linux 2
<a name="nvidia-gaming-amazon-linux-2"></a>

**在实例上安装 NVIDIA Gaming 驱动程序**

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

1. 重启后重新连接到您的实例。

1. 为您当前运行的内核版本安装内核标头软件包。

   ```
   [ec2-user ~]$ sudo yum install -y kernel-devel-$(uname -r)
   ```

1. 使用以下命令下载 Gaming 驱动程序安装实用程序：

   ```
   [ec2-user ~]$ aws s3 cp --recursive s3://nvidia-gaming/linux/latest/ .
   ```

   此存储桶中存储了多个版本的游戏驱动程序。您可以使用以下命令查看所有可用的版本：

   ```
   [ec2-user ~]$ aws s3 ls --recursive s3://nvidia-gaming/linux/
   ```

1. 从下载的 `.zip` 归档中提取 Gaming 驱动程序安装实用程序。

   ```
   [ec2-user ~]$ unzip {{latest-driver-name}}.zip -d nvidia-drivers
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序：

   ```
   [ec2-user ~]$ chmod +x nvidia-drivers/NVIDIA-Linux-x86_64*-grid.run
   ```

1. 使用以下命令运行安装程序：

   ```
   [ec2-user ~]$ sudo ./nvidia-drivers/NVIDIA-Linux-x86_64*.run
   ```

   如果您使用的是具有 5.10 内核版本的 Amazon Linux 2，请使用以下命令安装 NVIDIA 游戏驱动程序。

   ```
   [ec2-user ~]$ sudo CC=/usr/bin/gcc10-cc ./NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项（您可以接受默认选项）。

1. 使用以下命令创建所需的配置文件。

   ```
   [ec2-user ~]$ cat << EOF | sudo tee -a /etc/nvidia/gridd.conf
   vGamingMarketplace=2
   EOF
   ```

1. 使用以下命令下载并重命名认证文件。
   + 对于 590.48 及更高版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert_2026_03_02.cert"
     ```
   + 对于 575.64 到 580.105.08 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2025_07_01.cert"
     ```
   + 对于 460.39 到 575.57 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2024_02_22.cert"
     ```
   + 对于 440.68 到 445.48 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2020_04.cert"
     ```
   + 对于早期版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2019_09.cert"
     ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 510.x 或更高版本的 NVIDIA 驱动程序，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

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

1. 请使用以下命令验证 NVIDIA Gaming 许可证。

   ```
   [ec2-user ~]$ nvidia-smi.exe -q
   ```

   在输出中，搜索 `vGPU Software Licensed Product`。

1. （可选）请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用单个高达 4K 分辨率的显示器的优势。

## CentOS 7 和 Red Hat Enterprise Linux 7
<a name="nvidia-gaming-centos7-rhel7"></a>

**在实例上安装 NVIDIA Gaming 驱动程序**

1. 连接到 Linux 实例。安装 **gcc** 和 **make**（如果尚未安装）。

   ```
   [ec2-user ~]$ sudo yum install -y gcc make
   ```

1. 更新软件包缓存并获取实例软件包更新。

   ```
   [ec2-user ~]$ sudo yum update -y
   ```

1. 重启实例以加载最新内核版本。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 重启之后重新连接到实例。

1. 为您当前运行的内核版本安装内核标头软件包。

   ```
   [ec2-user ~]$ sudo yum install -y unzip kernel-devel-$(uname -r)
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

1. 使用以下命令下载 Gaming 驱动程序安装实用程序：

   ```
   [ec2-user ~]$ aws s3 cp --recursive s3://nvidia-gaming/linux/latest/ .
   ```

   此存储桶中存储了多个版本的游戏驱动程序。您可以使用以下命令查看所有可用的版本：

   ```
   [ec2-user ~]$ aws s3 ls --recursive s3://nvidia-gaming/linux/
   ```

1. 从下载的 `.zip` 归档中提取 Gaming 驱动程序安装实用程序。

   ```
   [ec2-user ~]$ unzip *Gaming-Linux-Guest-Drivers.zip -d nvidia-drivers
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序：

   ```
   [ec2-user ~]$ chmod +x nvidia-drivers/NVIDIA-Linux-x86_64*-grid.run
   ```

1. 使用以下命令运行安装程序：

   ```
   [ec2-user ~]$ sudo nvidia-drivers/NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项 (您可以接受默认选项)。

1. 使用以下命令创建所需的配置文件。

   ```
   [ec2-user ~]$ cat << EOF | sudo tee -a /etc/nvidia/gridd.conf
   vGamingMarketplace=2
   EOF
   ```

1. 使用以下命令下载并重命名认证文件。
   + 对于 590.48 及更高版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert_2026_03_02.cert"
     ```
   + 对于 575.64 到 580.105.08 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2025_07_01.cert"
     ```
   + 对于 460.39 到 575.57 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2024_02_22.cert"
     ```
   + 对于 440.68 到 445.48 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2020_04.cert"
     ```
   + 对于早期版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2019_09.cert"
     ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 510.x 或更高版本的 NVIDIA 驱动程序，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

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

1. （可选）请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用单个高达 4K 分辨率的显示器的优势。如果您不需要此功能，请勿完成此步骤。

## CentOS Stream 8 和 Red Hat Enterprise Linux 8
<a name="nvidia-gaming-centos8-rhel8"></a>

**在实例上安装 NVIDIA Gaming 驱动程序**

1. 连接到 Linux 实例。安装 **gcc** 和 **make**（如果尚未安装）。

   ```
   [ec2-user ~]$ sudo yum install -y gcc make
   ```

1. 更新软件包缓存并获取实例软件包更新。

   ```
   [ec2-user ~]$ sudo yum update -y
   ```

1. 重启实例以加载最新内核版本。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 重启之后重新连接到实例。

1. 为您当前运行的内核版本安装内核标头软件包。

   ```
   [ec2-user ~]$ sudo yum install -y unzip kernel-devel-$(uname -r)
   ```

1. 使用以下命令下载 Gaming 驱动程序安装实用程序：

   ```
   [ec2-user ~]$ aws s3 cp --recursive s3://nvidia-gaming/linux/latest/ .
   ```

   此存储桶中存储了多个版本的游戏驱动程序。您可以使用以下命令查看所有可用的版本：

   ```
   [ec2-user ~]$ aws s3 ls --recursive s3://nvidia-gaming/linux/
   ```

1. 从下载的 `.zip` 归档中提取 Gaming 驱动程序安装实用程序。

   ```
   [ec2-user ~]$ unzip *Gaming-Linux-Guest-Drivers.zip -d nvidia-drivers
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序：

   ```
   [ec2-user ~]$ chmod +x nvidia-drivers/NVIDIA-Linux-x86_64*-grid.run
   ```

1. 使用以下命令运行安装程序：

   ```
   [ec2-user ~]$ sudo nvidia-drivers/NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项 (您可以接受默认选项)。

1. 使用以下命令创建所需的配置文件。

   ```
   [ec2-user ~]$ cat << EOF | sudo tee -a /etc/nvidia/gridd.conf
   vGamingMarketplace=2
   EOF
   ```

1. 使用以下命令下载并重命名认证文件。
   + 对于 590.48 及更高版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert_2026_03_02.cert"
     ```
   + 对于 575.64 到 580.105.08 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2025_07_01.cert"
     ```
   + 对于 460.39 到 575.57 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2024_02_22.cert"
     ```
   + 对于 440.68 到 445.48 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2020_04.cert"
     ```
   + 对于早期版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2019_09.cert"
     ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 510.x 或更高版本的 NVIDIA 驱动程序，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

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

1. （可选）请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用单个高达 4K 分辨率的显示器的优势。

## Rocky Linux 8
<a name="nvidia-gaming-rocky-linux-8"></a>

**在实例上安装 NVIDIA Gaming 驱动程序**

1. 连接到 Linux 实例。安装 **gcc** 和 **make**（如果尚未安装）。

   ```
   [ec2-user ~]$ sudo yum install -y gcc make
   ```

1. 更新软件包缓存并获取实例软件包更新。

   ```
   [ec2-user ~]$ sudo yum update -y
   ```

1. 重启实例以加载最新内核版本。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 重启之后重新连接到实例。

1. 为您当前运行的内核版本安装内核标头软件包。

   ```
   [ec2-user ~]$ sudo dnf install -y unzip elfutils-libelf-devel libglvnd-devel kernel-devel-$(uname -r)
   ```

1. 使用以下命令下载 Gaming 驱动程序安装实用程序：

   ```
   [ec2-user ~]$ aws s3 cp --recursive s3://nvidia-gaming/linux/latest/ .
   ```

   此存储桶中存储了多个版本的游戏驱动程序。您可以使用以下命令查看所有可用的版本：

   ```
   [ec2-user ~]$ aws s3 ls --recursive s3://nvidia-gaming/linux/
   ```

1. 从下载的 `.zip` 归档中提取 Gaming 驱动程序安装实用程序。

   ```
   [ec2-user ~]$ unzip *Gaming-Linux-Guest-Drivers.zip -d nvidia-drivers
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序：

   ```
   [ec2-user ~]$ chmod +x nvidia-drivers/NVIDIA-Linux-x86_64*-grid.run
   ```

1. 使用以下命令运行安装程序：

   ```
   [ec2-user ~]$ sudo nvidia-drivers/NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项 (您可以接受默认选项)。

1. 使用以下命令创建所需的配置文件。

   ```
   [ec2-user ~]$ cat << EOF | sudo tee -a /etc/nvidia/gridd.conf
   vGamingMarketplace=2
   EOF
   ```

1. 使用以下命令下载并重命名认证文件。
   + 对于 590.48 及更高版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert_2026_03_02.cert"
     ```
   + 对于 575.64 到 580.105.08 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2025_07_01.cert"
     ```
   + 对于 460.39 到 575.57 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2024_02_22.cert"
     ```
   + 对于 440.68 到 445.48 版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2020_04.cert"
     ```
   + 对于早期版本：

     ```
     [ec2-user ~]$ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2019_09.cert"
     ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 510.x 或更高版本的 NVIDIA 驱动程序，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

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

1. （可选）请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用单个高达 4K 分辨率的显示器的优势。

## Ubuntu 和 Debian
<a name="nvidia-gaming-ubuntu-debian"></a>

**在实例上安装 NVIDIA Gaming 驱动程序**

1. 连接到 Linux 实例。安装 **gcc** 和 **make**（如果尚未安装）。

   ```
   $ sudo apt-get install -y gcc make build-essential
   ```

1. 更新软件包缓存并获取实例软件包更新。

   ```
   $ sudo apt-get update -y
   ```

1. 升级 `linux-aws` 程序包以接收最新版本。

   ```
   $ sudo apt-get upgrade -y linux-aws
   ```

1. 重启实例以加载最新内核版本。

   ```
   $ sudo reboot
   ```

1. 重启之后重新连接到实例。

1. 为您当前运行的内核版本安装内核标头软件包。

   ```
   $ sudo apt install -y unzip dkms linux-headers-$(uname -r)
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

1. 使用以下命令下载 Gaming 驱动程序安装实用程序：

   ```
   $ aws s3 cp --recursive s3://nvidia-gaming/linux/latest/ .
   ```

   此存储桶中存储了多个版本的游戏驱动程序。您可以使用以下命令查看所有可用的版本：

   ```
   $ aws s3 ls --recursive s3://nvidia-gaming/linux/
   ```

1. 从下载的 `.zip` 归档中提取 Gaming 驱动程序安装实用程序。

   ```
   $ unzip *Gaming-Linux-Guest-Drivers.zip -d nvidia-drivers
   ```

1. 使用以下命令添加权限以运行驱动程序安装实用程序：

   ```
   $ chmod +x nvidia-drivers/NVIDIA-Linux-x86_64*-grid.run
   ```

1. 使用以下命令运行安装程序：

   ```
   $ sudo nvidia-drivers/NVIDIA-Linux-x86_64*.run
   ```

   系统提示时，接受许可协议并根据需要指定安装选项 (您可以接受默认选项)。

1. 使用以下命令创建所需的配置文件。

   ```
   $ cat << EOF | sudo tee -a /etc/nvidia/gridd.conf
   vGamingMarketplace=2
   EOF
   ```

1. 使用以下命令下载并重命名认证文件。
   + 对于 590.48 及更高版本：

     ```
     $ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert_2026_03_02.cert"
     ```
   + 对于 575.64 到 580.105.08 版本：

     ```
     $ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2025_07_01.cert"
     ```
   + 对于 460.39 到 575.57 版本：

     ```
     $ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertLinux_2024_02_22.cert"
     ```
   + 对于 440.68 到 445.48 版本：

     ```
     $ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2020_04.cert"
     ```
   + 对于早期版本：

     ```
     $ sudo curl -o /etc/nvidia/GridSwCert.txt "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Linux_2019_09.cert"
     ```

1. 如果您在 G4dn、G5 或 G5g 实例上使用 510.x 或更高版本的 NVIDIA 驱动程序，请使用以下命令禁用 GSP。有关为什么需要这样做的更多信息，请访问 [NVIDIA 文档](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/index.html#disabling-gsp)。

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

1. （可选）请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用单个高达 4K 分辨率的显示器的优势。如果您不需要此功能，请勿完成此步骤。

## Windows 操作系统
<a name="nvidia-gaming-windows"></a>

在实例上安装 NVIDIA 游戏驱动程序之前，除了所有游戏驱动程序提及的注意事项之外，您还必须确保满足以下先决条件。
+ 如果您使用自定义 Windows AMI 启动 Windows 实例，则 AMI 必须是使用 Windows Sysprep 创建的标准化映像，以确保游戏驱动程序正常运行。有关更多信息，请参阅 [使用 Windows Sysprep 创建 Amazon EC2 AMI](ami-create-win-sysprep.md)。
+ 在 Windows 实例上配置 AWS Tools for Windows PowerShell 的默认凭证。有关更多信息，请参阅 *AWS Tools for Windows PowerShell 用户指南*中的 [AWS Tools for PowerShell 入门](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-getting-started.html)

**在 Windows 实例上安装 NVIDIA Gaming 驱动程序**

1. 连接到您的 Windows 实例并打开 PowerShell 窗口。

1. 使用以下 PowerShell 命令下载并安装 Gaming 驱动程序。

   ```
   $Bucket = "nvidia-gaming"
   $KeyPrefix = "windows/latest"
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

   此 S3 存储桶中存储了多个版本的 NVIDIA GRID 驱动程序。如果将 `$KeyPrefix` 变量的值从*“windows/latest”*更改为*“windows”*，则可以下载桶中的所有可用版本。

1. 导航到桌面，打开安装文件以启动它（选择与您的实例操作系统版本对应的驱动程序版本）。按照说明安装驱动程序并根据需要重启实例。要验证 GPU 是否正常工作，请检查设备管理器。

1. 使用以下方法之一注册驱动程序。

------
#### [ Version 527.27 or above ]

   使用 64 位版本的 PowerShell 或命令提示符窗口创建以下注册表项。

   *键*：`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\nvlddmkm\Global`

   *名称*：vGamingMarketplace

   *类型*：DWord

   *值*：2

**PowerShell**  
运行以下 PowerShell 命令创建此注册表值。AWS Windows AMI 中的 AWS Tools for PowerShell 默认为 32 位版本，并且此命令将失败。相反，将使用操作系统附带的 64 位版本的 PowerShell。

   ```
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\nvlddmkm\Global" -Name "vGamingMarketplace" -PropertyType "DWord" -Value "2"
   ```

**命令提示符**  
运行以下注册表命令创建此注册表值。您可以使用命令提示符窗口或 64 位版本的 PowerShell 运行它。

   ```
   reg add "HKLM\SYSTEM\CurrentControlSet\Services\nvlddmkm\Global" /v vGamingMarketplace /t REG_DWORD /d 2
   ```

------
#### [ Earlier versions ]

   使用 64 位版本的 PowerShell 或命令提示符窗口创建以下注册表项。

   *键*：`HKEY_LOCAL_MACHINE\SOFTWARE\NVIDIA Corporation\Global`

   *名称*：vGamingMarketplace

   *类型*：DWord

   *值*：2

**PowerShell**  
运行以下 PowerShell 命令创建此注册表值。AWS Windows AMI 中的 AWS Tools for PowerShell 默认为 32 位版本，并且此命令将失败。相反，将使用操作系统附带的 64 位版本的 PowerShell。

   ```
   New-ItemProperty -Path "HKLM:\SOFTWARE\NVIDIA Corporation\Global" -Name "vGamingMarketplace" -PropertyType "DWord" -Value "2"
   ```

**命令提示符**  
运行以下注册表命令以使用命令提示符窗口创建此注册表项。您也可以在 64 位版本的 PowerShell 中使用此命令。

   ```
   reg add "HKLM\SOFTWARE\NVIDIA Corporation\Global" /v vGamingMarketplace /t REG_DWORD /d 2
   ```

------

1. 在 PowerShell 中运行以下命令。这将下载认证文件，重命名文件 `GridSwCert.txt`，然后将该文件移至系统驱动器上的 Public Documents（公共文档）文件夹。通常，该文件夹的路径为 `C:\Users\Public\Documents`。
   + 对于 591.59 及更高版本：

     ```
     Invoke-WebRequest -Uri "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert_2026_03_02.cert" -OutFile "$Env:PUBLIC\Documents\GridSwCert.txt"
     ```
   + 对于 576.80 到 581.80 版本：

     ```
     Invoke-WebRequest -Uri "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertWindows_2025_07_01.cert" -OutFile "$Env:PUBLIC\Documents\GridSwCert.txt"
     ```
   + 对于 460.39 到 576.72 版本：

     ```
     Invoke-WebRequest -Uri "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCertWindows_2024_02_22.cert" -OutFile "$Env:PUBLIC\Documents\GridSwCert.txt"
     ```
   + 对于 445.87 版本：

     ```
     Invoke-WebRequest -Uri "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Windows_2020_04.cert" -OutFile "$Env:PUBLIC\Documents\GridSwCert.txt"
     ```
   + 对于早期版本：

     ```
     Invoke-WebRequest -Uri "https://nvidia-gaming.s3.amazonaws.com/GridSwCert-Archive/GridSwCert-Windows_2019_09.cert" -OutFile "$Env:PUBLIC\Documents\GridSwCert.txt"
     ```

   如果您在下载文件时收到错误，并且正在使用 Windows Server 2016 或更早的版本，则可能需要为 PowerShell 终端启用 TLS 1.2。可以使用以下命令为当前 PowerShell 会话启用 TLS 1.2，然后重试：

   ```
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
   ```

1. 重新启动您的实例。

1. 在实例上找到 `nvidia-smi.exe` 文件。

   ```
   Get-ChildItem -Path C:\ -Recurse -Filter "nvidia-smi.exe"
   ```

   请使用以下命令验证 NVIDIA Gaming 许可证。将 {{path}} 替换为上一个命令输出中的文件夹名称。

   ```
   C:\Windows\System32\DriverStore\FileRepository\{{path}}\nvidia-smi.exe -q
   ```

   该输出值应该类似于以下内容。

   ```
   vGPU Software Licensed Product
   Product Name              : NVIDIA Cloud Gaming
   License Status            : Licensed (Expiry: N/A)
   ```

1. （可选）请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用单个高达 4K 分辨率的显示器的优势。如果您不需要此功能，请勿完成此步骤。
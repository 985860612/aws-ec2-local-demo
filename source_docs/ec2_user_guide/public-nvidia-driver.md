

# 安装 NVIDIA 公共驱动程序
<a name="public-nvidia-driver"></a>

如果[使用包含 NVIDIA 驱动程序的 AMI](preinstalled-nvidia-driver.md)中所述的 AWS Marketplace AMI 不适合您的使用案例，则可以安装公共驱动程序和自带许可。安装选项包含以下内容：
+ [选项 1：仅安装驱动程序](#public-nvidia-driver-only-install)
+ [选项 2：使用 CUDA 工具包安装](#public-nvidia-driver-cuda-install)（建议用于 Linux 发行版）

 

**P6-B200 和 P6-B300 实例类型注意事项**  
P6-B200 和 P6-B300 平台的独特之处在于它们将 Mellanox ConnectX 网络接口卡 (NIC) 作为 PCIe 设备公开给实例。这些 NIC 不充当典型的网络接口，而是充当 NVSwitch 网桥，提供控制路径来初始化和配置 NVFabric（即 GPU 互连的 NVLink 拓扑）。

要完全初始化系统，NVIDIA Fabric Manager 必须配置 `NVFabric` 并建立 NVSwitch 拓扑。这使得 InfiniBand 内核模块能够与 Mellanox ConnectX NIC 通信。

NVIDIA Fabric Manager 包含在 CUDA 工具包中。对于此实例类型，我们建议使用 [选项 2：使用 CUDA 工具包安装](#public-nvidia-driver-cuda-install)。

## 选项 1：仅安装驱动程序
<a name="public-nvidia-driver-only-install"></a>

要安装特定驱动程序，请登录您的实例并从 [http://www.nvidia.com/Download/Find.aspx](http://www.nvidia.com/Download/Find.aspx) 下载适合实例类型的 64 位 NVIDIA 公共驱动程序。对于**产品类型**、**产品系列**和**产品**，请使用下表中所示的选项。

然后，按照《[NVIDIA 驱动程序安装指南](https://docs.nvidia.com/datacenter/tesla/driver-installation-guide/index.html)》中的**本地存储库安装**说明进行操作。

**注意**  
P6-B200 和 P6-B300 实例类型需要安装和配置与 NVIDIA CUDA Toolkit 捆绑在一起的附加包。有关更多信息，请参阅 [选项 2：使用 CUDA 工具包安装](#public-nvidia-driver-cuda-install) 中有关 Linux 发行版的说明。


| 实例 | 产品类型 | 产品系列 | 产品 | 最低驱动程序版本 | 
| --- | --- | --- | --- | --- | 
| G3 | Tesla | M-Class | M60 | -- | 
| G4dn | Tesla | T 系列 | T4 | -- | 
| G5 | Tesla | A 系列 | A10 | 470.00 或更高版本 | 
| G5g1 | Tesla | T 系列 | T4G | 470.82.01 或更高版本 | 
| G6 | Tesla | L 系列 | L4 | 525.0 或更高版本 | 
| G6e | Tesla | L 系列 | L40S | 535.0 或更高版本 | 
| Gr6 | Tesla | L 系列 | L4 | 525.0 或更高版本 | 
| G7 | Tesla | RTX 系列 | RTX PRO 4500 Blackwell | 595 或更高版本 | 
| G7e | Tesla | RTX 系列 | RTX PRO 6000 Blackwell | 575.0 或更高版本 | 
| P3 | Tesla | V 系列 | V100 | -- | 
| P4d | Tesla | A 系列 | A100 | -- | 
| P4de | Tesla | A 系列 | A100 | -- | 
| P5 | Tesla | H 系列 | H100 | 530 或更高版本 | 
| P5e | Tesla | H 系列 | H200 | 550 或更高版本 | 
| P5en | Tesla | H 系列 | H200 | 550 或更高版本 | 
| P6-B2002 | Tesla | HGX 系列 | B200 | 570 或更高版本 | 
| P6e-GB200 | Tesla | HGX 系列 | B200 | 570 或更高版本 | 
| P6-B3002 | Tesla | HGX 系列 | B300 | 580 或更高版本 | 

1 G5g 实例的操作系统是 Linux aarch64。

2 对于 P6-B200 和 P6-B300 实例类型，配置 NVIDIA Fabric Manager 有额外的安装要求。

## 选项 2：使用 CUDA 工具包安装
<a name="public-nvidia-driver-cuda-install"></a>

安装说明因操作系统而稍有不同。要使用 NVIDIA CUDA 工具包在您的实例上安装公共驱动程序，请按照有关您的实例操作系统的说明进行操作。对于此处未显示的实例操作系统，请按照 NVIDIA 开发者网站上有关您的操作系统和实例类型架构的说明进行操作。有关更多信息，请参阅 [CUDA 工具包下载](https://developer.nvidia.com/cuda-downloads)。

有关实例类型架构或其他规范，请参阅 *Amazon EC2 实例类型*参考中的[加速计算](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html)规范。

### Amazon Linux 2023
<a name="nvidia-public-install-driver-al2023"></a>

本节介绍在 Amazon Linux 2023 实例上安装的 NVIDIA CUDA 工具包。本节中的命令示例基于 `x86_64` 架构。

有关 `arm64-sbsa` 命令，请参阅 [CUDA 工具包下载](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=arm64-sbsa)并选择适用于您的发行版的选项。您做出最终选择之后会显示说明。

**先决条件**  
在安装工具包和驱动程序之前，请运行以下命令，以确保安装了正确版本的内核标头和开发包。

```
[ec2-user ~]$ sudo dnf install kernel-devel-$(uname -r) kernel-headers-$(uname -r) -y
```

**下载工具包和驱动程序**  
选择要用于您的实例的安装类型，然后按照相关步骤进行操作。

------
#### [ AL2023 NVIDIA repository ]

Amazon Linux 2023 通过 AWS 维护的专用存储库提供 NVIDIA GPU 驱动程序和 CUDA 工具包软件包。AWS 使用 AL2023 候选版本对该存储库进行认证，并通过 Amazon Linux 安全中心提供安全公告。建议 AL2023 实例使用此选项，因为它可以简化安装，并通过标准的 `dnf update` 工作流更新驱动程序。

有关说明，请参阅《Amazon Linux 2023 用户指南》**中的 [NVIDIA 驱动程序](https://docs.aws.amazon.com/linux/al2023/ug/nvidia-drivers.html)。

------
#### [ RPM local installation ]

您可以按照以下说明，将 CUDA 工具包安装程序存储库捆绑包下载到您的实例，然后提取并注册指定的捆绑包。

要查看 NVIDIA 开发者网站上的说明，请参阅 [CUDA 工具包下载](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Amazon-Linux&target_version=2023&target_type=rpm_local)。

```
[ec2-user ~]$ wget https://developer.download.nvidia.com/compute/cuda/{{13.0.0}}/local_installers/{{cuda-repo-amzn2023-13-0-local-13.0.0_580.65.06-1.x86_64.rpm}}
[ec2-user ~]$ sudo rpm -i {{cuda-repo-amzn2023-13-0-local-13.0.0_580.65.06-1.x86_64.rpm}}
```

------
#### [ RPM network installation ]

您可以按照以下说明，在实例上使用程序包管理器注册 CUDA 存储库。运行安装步骤时，程序包管理器仅会下载所需的程序包。

要查看 NVIDIA 开发者网站上的说明，请参阅 [CUDA 工具包下载](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Amazon-Linux&target_version=2023&target_type=rpm_network)。

```
[ec2-user ~]$ sudo dnf config-manager --add-repo https://developer.download.nvidia.com/compute/cuda/repos/amzn2023/x86_64/cuda-amzn2023.repo
```

------

RPM 本地安装和 RPM 网络安装的其余步骤相同。

1. 完成 CUDA 工具包安装

   ```
   [ec2-user ~]$ sudo dnf clean all
   [ec2-user ~]$ sudo dnf install cuda-toolkit -y
   ```

1. 安装驱动程序的开放内核模块变体

   ```
   [ec2-user ~]$ sudo dnf module install nvidia-driver:open-dkms -y
   ```

1. 安装 GPUDirect Storage 和 Fabric 管理器

   ```
   [ec2-user ~]$ sudo dnf install nvidia-gds -y
   [ec2-user ~]$ sudo dnf install nvidia-fabric-manager -y
   ```

1. 启用 Fabric 管理器和驱动程序持久性

   ```
   [ec2-user ~]$ sudo systemctl enable nvidia-fabricmanager
   [ec2-user ~]$ sudo systemctl enable nvidia-persistenced
   ```

1. （*仅 P6-B200 和 P6-B300*）这些实例类型需要安装和配置与 NVIDIA CUDA Toolkit 捆绑在一起的附加包。

   1. 安装 NVIDIA Link Subnet Manager 和 `ibstat`。

      ```
      [ec2-user ~]$ sudo dnf install nvlink5
      ```

   1. 启用启动时自动加载 Infiniband 模块。

      ```
      [ec2-user ~]$ echo "ib_umad" | sudo tee -a /etc/modules-load.d/modules.conf
      ```

1. 重启实例

   ```
   [ec2-user ~]$ sudo reboot
   ```

### Ubuntu 24.04
<a name="nvidia-public-install-driver-ubuntu2024"></a>

本节介绍在 Ubuntu 24.04 实例上安装的 NVIDIA CUDA 工具包。本节中的命令示例基于 `x86_64` 架构。

有关 `arm64-sbsa` 命令，请参阅 [CUDA 工具包下载](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=arm64-sbsa)并选择适用于您的发行版的选项。您做出最终选择之后会显示说明。

**先决条件**  
在安装工具包和驱动程序之前，请运行以下命令，以确保安装了正确版本的内核标头和开发包。

```
$ apt install linux-headers-$(uname -r)
```

**下载工具包和驱动程序**  
选择要用于您的实例的安装类型，然后按照相关步骤进行操作。

------
#### [ Deb local installation ]

您可以按照以下说明，将 CUDA 工具包安装程序存储库捆绑包下载到您的实例，然后提取并注册指定的捆绑包。

要查看 NVIDIA 开发者网站上的说明，请参阅 [CUDA 工具包下载](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=24.04&target_type=deb_local)。

```
$ wget https://developer.download.nvidia.com/compute/cuda/repos/{{ubuntu2404}}/x86_64/{{cuda-ubuntu2404.pin}}
$ sudo mv {{cuda-ubuntu2404.pin}} /etc/apt/preferences.d/cuda-repository-pin-600
$ wget https://developer.download.nvidia.com/compute/cuda/{{13.0.0}}/local_installers/{{cuda-repo-ubuntu2404-13-0-local_13.0.0-580.65.06-1_amd64.deb}}
$ sudo dpkg -i {{cuda-repo-ubuntu2404-13-0-local_13.0.0-580.65.06-1_amd64.deb}}
$ sudo cp /var/{{cuda-repo-ubuntu2404-13-0-local}}/cuda-*-keyring.gpg /usr/share/keyrings/
```

------
#### [ Deb network installation ]

您可以按照以下说明，在实例上使用程序包管理器注册 CUDA 存储库。运行安装步骤时，程序包管理器仅会下载所需的程序包。

要查看 NVIDIA 开发者网站上的说明，请参阅 [CUDA 工具包下载](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=24.04&target_type=deb_network)。

```
$ wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
$ sudo dpkg -i cuda-keyring_1.1-1_all.deb
```

------

本地安装和网络安装的其余步骤相同。

1. 完成 CUDA 工具包安装

   ```
   $ sudo apt update
   $ sudo apt install cuda-toolkit -y
   ```

1. 安装驱动程序的开放内核模块变体

   ```
   $ sudo apt install nvidia-open -y
   ```

1. 安装 GPUDirect Storage 和 Fabric 管理器

   ```
   $ sudo apt install nvidia-gds -y
   $ sudo apt install nvidia-fabricmanager -y
   ```

1. 启用 Fabric 管理器和驱动程序持久性

   ```
   $ sudo systemctl enable nvidia-fabricmanager
   $ sudo systemctl enable nvidia-persistenced
   ```

1. （*仅 P6-B200 和 P6-B300*）这些实例类型需要安装和配置与 NVIDIA CUDA Toolkit 捆绑在一起的附加包。

   1. 安装最新的 Infiniband 特定设备驱动程序和诊断实用程序。

      ```
      $ sudo apt install linux-modules-extra-$(uname -r) -y
      $ sudo apt install infiniband-diags -y
      ```

   1. 安装 NVIDIA Link Subnet Manager。

      ```
      $ sudo apt install nvlsm -y
      ```

1. 重启实例

   ```
   sudo reboot
   ```

1. 更新您的路径并添加以下环境变量。

   ```
   $ export PATH=${PATH}:/usr/local/{{cuda-13.0}}/bin
   $ export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/usr/local/{{cuda-13.0}}/lib64
   ```

### Windows 操作系统
<a name="nvidia-public-install-driver-windows"></a>

要在 Windows 上安装 NVIDIA 驱动程序，请执行以下步骤：

1. 打开在其中下载驱动程序的文件夹，然后启动安装文件。按照说明安装驱动程序并根据需要重启实例。

1. 使用设备管理器禁用标有警告图标的名为 **Microsoft Basic Display Adapter** 的显示适配器。安装这些 Windows 功能：**Media Foundation** 和 **Quality Windows Audio Video Experience**。
**重要**  
切勿禁用名为 **Microsoft Remote Display Adapter** 的显示适配器。如果禁用 **Microsoft Remote Display Adapter**，连接可能会中断，并且可能无法在实例重启后成功连接到实例。

1. 检查设备管理器以验证 GPU 正常工作。

1. 为实现 GPU 的最佳性能，请完成[优化 Amazon EC2 实例上的 GPU 设置](optimize_gpu.md)中的优化步骤。
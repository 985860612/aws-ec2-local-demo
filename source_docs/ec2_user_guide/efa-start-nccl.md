

# 开始使用 EFA 和 NCCL 处理 Amazon EC2 上的 ML 工作负载
<a name="efa-start-nccl"></a>

NVIDIA Collective Communications Library (NCCL) 是一个标准集体通信例程库，它适用于跨单个节点或多个节点的多个 GPU。可将 NCCL 与 EFA、Libfabric 和 MPI 结合使用来支持各种机器学习工作负载。有关更多信息，请参阅 [NCCL](https://developer.nvidia.com/nccl) 网站。

**要求**
+ 支持的实例类型包括 EFA 支持的 P 系列以及 G 系列实例类型。有关更多信息，请参阅 [Amazon EC2 加速型计算实例](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html#ac-sizes)。
+ 支持的基础 AMI：Amazon Linux 2023、Ubuntu 26.04、Ubuntu 24.04、Ubuntu 22.04、Debian 12 以及 RHEL 10。
+ EFA 仅支持 NCCL 2.4.2 及更高版本。

有关使用 AWS Deep Learning AMIs 运行包含 EFA 和 NCCL 的机器学习工作负载的更多信息，请参阅《AWS Deep Learning AMIs 开发者指南》**中的[在 DLAMI 上使用 EFA](https://docs.aws.amazon.com/dlami/latest/devguide/tutorial-efa-using.html)。

**Topics**
+ [步骤 1：准备启用 EFA 的安全组](#nccl-start-base-setup)
+ [步骤 2：启动临时实例](#nccl-start-base-temp)
+ [步骤 3：安装 NVIDIA GPU 驱动程序、NVIDIA CUDA 工具包和 cuDNN](#nccl-start-base-drivers)
+ [步骤 4：安装 GDRCopy](#nccl-start-base-gdrcopy)
+ [步骤 5：安装 EFA 软件](#nccl-start-base-enable)
+ [步骤 6：安装 NCCL](#nccl-start-base-nccl)
+ [步骤 7：安装 NCCL 测试](#nccl-start-base-tests)
+ [步骤 8：测试 EFA 和 NCCL 配置](#nccl-start-base-test)
+ [步骤 9：安装机器学习应用程序](#nccl-start-base-app)
+ [步骤 10：创建启用了 EFA 和 NCCL 的 AMI](#nccl-start-base-ami)
+ [步骤 11：终止临时实例](#nccl-start-base-terminate)
+ [步骤 12：在集群置放群组中启动启用了 EFA 和 NCCL 的实例](#nccl-start-base-cluster)
+ [步骤 13：启用无密码 SSH](#nccl-start-base-passwordless)

## 步骤 1：准备启用 EFA 的安全组
<a name="nccl-start-base-setup"></a>

EFA 需要使用一个安全组，以允许进出安全组本身的所有入站和出站流量。以下过程创建了一个安全组，该安全组允许所有进出其本身的入站和出站流量，并允许来自任何 IPv4 地址的入站 SSH 流量进行 SSH 连接。

**重要**  
此安全组仅用于测试目的。对于您的生产环境，建议您创建入站 SSH 规则，该规则仅允许来自您连接的 IP 地址的流量，例如计算机的 IP 地址或本地网络中的一系列 IP 地址。
自引用入站和出站规则（允许进出安全组自身的所有流量）是保证 EFA 正常运行的必要条件。如果没有这些规则，实例之间的 EFA 流量将被阻断，而且 NCCL 通信将失败。

有关其他场景，请参阅 [针对不同使用案例的安全组规则](security-group-rules-reference.md)。

**创建启用 EFA 的安全组**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Security Groups (安全组)**，然后选择 **Create Security Group (创建安全组)**。

1. 在 **Create security group（创建安全组）**窗口中，执行以下操作：

   1. 对于**安全组名称**，请输入一个描述性的安全组名称，例如 `EFA-enabled security group`。

   1. （可选）对于**描述**，请输入安全组的简要描述。

   1. 对于 **VPC**，请选择要在其中启动启用了 EFA 的实例的 VPC。

   1. 选择**创建安全组**。

1. 选择您创建的安全组，然后在 **Details**（详细信息）选项卡上复制 **Security group ID**（安全组 ID）。

1. 在安全组仍然选中的情况下，依次选择 **Actions**（操作）、**Edit inbound rules**（编辑入站规则），然后执行以下操作：

   1. 选择**添加规则**。

   1. 对于 **Type (类型)**，请选择 **All traffic (所有流量)**。

   1. 对于 **Source type**（源类型），请选择 **Custom**（自定义）并将您复制的安全组 ID 粘贴到该字段中。

   1. 选择**添加规则**。

   1. 对于 **Type**，选择 **SSH**。

   1. 对于 **Source type**（源类型），请选择 **Anywhere-IPv4**。

   1. 选择**保存规则**。

1. 在安全组仍然选中的情况下，依次选择 **Actions**（操作）、**Edit outbound rules**（编辑出站规则），然后执行以下操作：

   1. 选择**添加规则**。

   1. 对于 **Type (类型)**，请选择 **All traffic (所有流量)**。

   1. 对于 **Destination type**（目标类型），请选择 **Custom**（自定义）并将您复制的安全组 ID 粘贴到该字段中。

   1. 选择**保存规则**。

## 步骤 2：启动临时实例
<a name="nccl-start-base-temp"></a>

启动一个临时实例，可用于安装和配置 EFA 软件组件。您使用该实例创建一个启用了 EFA 的 AMI，您可以从中启动启用了 EFA 的实例。

**启动临时实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Instances**（实例），然后选择 **Launch Instances**（启动实例）以打开新的启动实例向导。

1. （*可选*）在 **Name and tags**（名称和标签）部分中，提供实例的名称，例如 `EFA-instance`。名称作为资源标签（`Name={{EFA-instance}}`）分配给实例。

1. 在**应用程序和操作系统映像**部分中，为其中一个支持的操作系统选择 AMI。

1. 在**实例类型**部分中，选择支持的实例类型。

1. 在 **Key pair**（密钥对）部分中，选择要用于实例的密钥对。

1. 在 **Network settings**（网络设置）部分中，请选择 **Edit**（编辑），然后执行以下操作：

   1. 对于**子网**，选择要在其中启动实例的子网。
**重要**  
必须选择子网。如果您未选择子网，则不能启用 EFA 的实例。

   1. 对于 **Firewall（security groups）**（防火墙（安全组）），请选择 **Select existing security group**（选择现有安全组），然后选择您在上一步中创建的安全组。

   1. 展开**高级网络配置**部分。

      对于**网络接口 1**，选择**网卡索引 = 0**、**设备索引 = 0**、**接口类型 = 带 ENA 的 EFA**。

      （*可选*）如果您使用的是多卡实例类型，则对于每个额外所需的网络接口，选择**添加网络接口**；对于**网卡索引**，选择下一个未使用的索引，然后选择**设备索引 = 1** 和**接口类型 = 带 ENA 的 EFA** 或**仅限 EFA**。

1. 在 **Storage**（存储）部分中，根据需要配置卷。
**注意**  
您必须为 NVIDIA CUDA 工具包额外预置 10 到 20 GiB 的存储空间。如果您没有预置足够的存储空间，您将在尝试安装 NVIDIA 驱动程序和 CUDA 工具包时收到 `insufficient disk space` 错误。

1. 在右侧的**摘要**面板中，选择**启动实例**。

## 步骤 3：安装 NVIDIA GPU 驱动程序、NVIDIA CUDA 工具包和 cuDNN
<a name="nccl-start-base-drivers"></a>

------
#### [ Amazon Linux 2023 ]

**安装 NVIDIA GPU 驱动程序、NVIDIA CUDA 工具包和 cuDNN**

1. 为确保您的所有软件包都处于最新状态，请对您的实例执行快速软件更新。

   ```
   $ sudo dnf upgrade -y && sudo reboot
   ```

   实例重启后，重新连接到实例。

1. 安装在安装 NVIDIA GPU 驱动程序和 NVIDIA CUDA 工具包时需要的实用程序。

   ```
   $ sudo dnf groupinstall 'Development Tools' -y && sudo dnf install -y dkms kernel-devel-$(uname -r) kernel-headers-$(uname -r)
   ```

1. 禁用 `nouveau` 开源驱动程序。

   1. 为您当前运行的内核版本安装所需的实用程序和内核标头软件包。

      ```
      $ sudo yum install -y wget kernel-devel-$(uname -r) kernel-headers-$(uname -r)
      ```

   1. 将 `nouveau` 添加到 `/etc/modprobe.d/blacklist.conf` 拒绝列表文件。

      ```
      $ cat << EOF | sudo tee --append /etc/modprobe.d/blacklist.conf
      blacklist vga16fb
      blacklist nouveau
      blacklist rivafb
      blacklist nvidiafb
      blacklist rivatv
      EOF
      ```

   1. 将 `GRUB_CMDLINE_LINUX="rdblacklist=nouveau"` 附加到 `grub` 文件并重新构建 GRUB 配置。

      ```
      $ echo 'GRUB_CMDLINE_LINUX="rdblacklist=nouveau"' | sudo tee -a /etc/default/grub \
      && sudo grub2-mkconfig -o /boot/grub2/grub.cfg
      ```

1. 重启实例并重新连接到它。

1. 添加 CUDA 网络存储库。

   ```
   $ sudo yum-config-manager --add-repo https://developer.download.nvidia.com/compute/cuda/repos/rhel8/x86_64/cuda-rhel8.repo
   ```

1. 下载并安装 NVIDIA GPU 驱动程序。

   ```
   $ wget https://us.download.nvidia.com/tesla/580.167.08/NVIDIA-Linux-x86_64-580.167.08.run \
   && sudo sh NVIDIA-Linux-x86_64-580.167.08.run -m kernel-open --no-drm --disable-nouveau --dkms --silent
   ```

1. 安装 NVIDIA CUDA 工具包和 cuDNN。

   ```
   $ sudo dnf install -y cuda-toolkit-13-0 libcudnn9-cuda-13 libcudnn9-devel-cuda-13
   ```

1. 重启实例并重新连接到它。

1. （带 NVSwitch 的实例，例如 P 系列多 GPU 实例）安装并启动 NVIDIA Fabric Manager。G 系列实例不使用 NVSwitch，亦不需要 Fabric Manager。

   ```
   $ sudo dnf install -y https://developer.download.nvidia.com/compute/cuda/repos/rhel8/x86_64/nvidia-fabricmanager-580.167.08-1.el8.x86_64.rpm \
   && sudo systemctl enable nvidia-fabricmanager && sudo systemctl start nvidia-fabricmanager
   ```

1. 确保每次启动实例时均设置 CUDA 路径。
   + 对于 * bash* shell，请将以下语句添加到 `/home/{{username}}/.bashrc` 和 `/home/{{username}}/.bash_profile`。

     ```
     export PATH=/usr/local/cuda/bin:$PATH
     export LD_LIBRARY_PATH=/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64:$LD_LIBRARY_PATH
     ```
   + 对于 * tcsh * shell，请将以下语句添加到 `/home/{{username}}/.cshrc`。

     ```
     setenv PATH=/usr/local/cuda/bin:$PATH
     setenv LD_LIBRARY_PATH=/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64:$LD_LIBRARY_PATH
     ```

1. 要验证 NVIDIA GPU 驱动程序是否正常运行，请运行以下命令。

   ```
   $ nvidia-smi -q | head
   ```

   此命令应返回有关 NVIDIA GPU、NVIDIA GPU 驱动程序和 NVIDIA CUDA 工具包的信息。

------
#### [ Ubuntu 26.04, Ubuntu 24.04, and Ubuntu 22.04 ]

**安装 NVIDIA GPU 驱动程序、NVIDIA CUDA 工具包和 cuDNN**

1. 为确保您的所有软件包都处于最新状态，请对您的实例执行快速软件更新。

   ```
   $ sudo apt-get update && sudo apt-get upgrade -y
   ```

1. 安装在安装 NVIDIA GPU 驱动程序和 NVIDIA CUDA 工具包时需要的实用程序。

   ```
   $ sudo apt-get update && sudo apt-get install build-essential -y
   ```

1. 要使用 NVIDIA GPU 驱动程序，您必须先禁用 `nouveau` 开源驱动程序。

   1. 为您当前运行的内核版本安装所需的实用程序和内核标头软件包。

      ```
      $ sudo apt-get install -y gcc make linux-headers-$(uname -r)
      ```

   1. 将 `nouveau` 添加到 `/etc/modprobe.d/blacklist.conf` 拒绝列表文件。

      ```
      $ cat << EOF | sudo tee --append /etc/modprobe.d/blacklist.conf
      blacklist vga16fb
      blacklist nouveau
      blacklist rivafb
      blacklist nvidiafb
      blacklist rivatv
      EOF
      ```

   1. 使用首选文本编辑器打开 `/etc/default/grub`，并添加以下内容。

      ```
      GRUB_CMDLINE_LINUX="rdblacklist=nouveau"
      ```

   1. 重新生成 GRUB 配置。

      ```
      $ sudo update-grub
      ```

1. 重启实例并重新连接到它。

1. 添加 CUDA 存储库并安装 NVIDIA GPU 驱动程序、NVIDIA CUDA 工具包和 cuDNN。
   + Ubuntu 26.04

     ```
     $ wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2604/x86_64/cuda-keyring_1.1-1_all.deb \
     && sudo dpkg -i cuda-keyring_1.1-1_all.deb \
     && sudo add-apt-repository -y 'deb [trusted=yes] https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2604/x86_64 /' \
     && sudo apt-get update
     ```

     ```
     $ sudo apt-get install -y nvidia-open cuda-toolkit-13-3 libcudnn9-cuda-13 libcudnn9-dev-cuda-13
     ```
   + Ubuntu 24.04

     ```
     $ wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb \
     && sudo dpkg -i cuda-keyring_1.1-1_all.deb \
     && sudo add-apt-repository -y 'deb [trusted=yes] https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64 /' \
     && sudo apt-get update
     ```

     ```
     $ sudo apt-get install -y nvidia-open-580 cuda-toolkit-13-0 libcudnn9-cuda-13 libcudnn9-dev-cuda-13
     ```
   + Ubuntu 22.04

     ```
     $ wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb \
     && sudo dpkg -i cuda-keyring_1.1-1_all.deb \
     && sudo DEBIAN_FRONTEND=noninteractive add-apt-repository -y "deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/ /" \
     && sudo apt-get update
     ```

     ```
     $ sudo apt-get install -y nvidia-open-580 cuda-toolkit-13-0 libcudnn9-cuda-13 libcudnn9-dev-cuda-13
     ```

1. 重启实例并重新连接到它。

1. （带 NVSwitch 的实例，例如 P 系列多 GPU 实例）安装并启动 NVIDIA Fabric Manager。G 系列实例不使用 NVSwitch，亦不需要 Fabric Manager。
   + Ubuntu 26.04

     ```
     $ sudo apt-get install -y nvidia-fabricmanager \
     && sudo systemctl enable nvidia-fabricmanager && sudo systemctl start nvidia-fabricmanager
     ```
   + Ubuntu 24.04 和 Ubuntu 22.04

     ```
     $ sudo apt-get install -y nvidia-fabricmanager-580 \
     && sudo systemctl enable nvidia-fabricmanager && sudo systemctl start nvidia-fabricmanager
     ```

1. 确保每次启动实例时均设置 CUDA 路径。
   + 对于 * bash* shell，请将以下语句添加到 `/home/{{username}}/.bashrc` 和 `/home/{{username}}/.bash_profile`。

     ```
     export PATH=/usr/local/cuda/bin:$PATH
     export LD_LIBRARY_PATH=/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64:$LD_LIBRARY_PATH
     ```
   + 对于 * tcsh * shell，请将以下语句添加到 `/home/{{username}}/.cshrc`。

     ```
     setenv PATH=/usr/local/cuda/bin:$PATH
     setenv LD_LIBRARY_PATH=/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64:$LD_LIBRARY_PATH
     ```

1. 要验证 NVIDIA GPU 驱动程序是否正常运行，请运行以下命令。

   ```
   $ nvidia-smi -q | head
   ```

   此命令应返回有关 NVIDIA GPU、NVIDIA GPU 驱动程序和 NVIDIA CUDA 工具包的信息。

------
#### [ Debian 12 ]

**安装 NVIDIA GPU 驱动程序、NVIDIA CUDA 工具包和 cuDNN**

1. 安装在安装 NVIDIA GPU 驱动程序和 NVIDIA CUDA 工具包时需要的实用程序。

   ```
   $ sudo apt-get install -y build-essential gcc make linux-headers-$(uname -r) dkms
   ```

1. 禁用 `nouveau` 开源驱动程序。

   ```
   $ sudo sed -i 's/GRUB_CMDLINE_LINUX=""/GRUB_CMDLINE_LINUX="rdblacklist=nouveau"/' /etc/default/grub && sudo update-grub
   ```

1. 重启实例并重新连接到它。

1. 添加 CUDA 存储库并安装 NVIDIA GPU 驱动程序、NVIDIA CUDA 工具包和 cuDNN。

   ```
   $ wget https://developer.download.nvidia.com/compute/cuda/repos/debian12/x86_64/cuda-keyring_1.1-1_all.deb \
   && sudo dpkg -i cuda-keyring_1.1-1_all.deb \
   && sudo DEBIAN_FRONTEND=noninteractive add-apt-repository -y "deb https://developer.download.nvidia.com/compute/cuda/repos/debian12/x86_64/ /" \
   && sudo apt-get update
   ```

   ```
   $ sudo apt-get install -y nvidia-open cuda-toolkit-13-0 libcudnn9-cuda-13 libcudnn9-dev-cuda-13
   ```

1. 配置 NVIDIA UVM 内核模块。

   ```
   $ uvm_ko=$(find /lib/modules/$(uname -r) -name 'nvidia*uvm*.ko*' 2>/dev/null | head -1) && if [ -n "$uvm_ko" ]; then real=$(basename "$uvm_ko"); real=${real%.ko*}; echo "$real" | sudo tee /etc/modules-load.d/nvidia-uvm.conf; if [ "$real" != "nvidia-uvm" ]; then echo "alias nvidia-uvm $real" | sudo tee /etc/modprobe.d/nvidia-uvm.conf; fi; sudo modprobe "$real" || true; fi && sudo modprobe nvidia
   ```

1. 重启实例并重新连接到它。

1. （带 NVSwitch 的实例，例如 P 系列多 GPU 实例）安装并启动 NVIDIA Fabric Manager。G 系列实例不使用 NVSwitch，亦不需要 Fabric Manager。

   1. 确定 NVIDIA 内核模块版本。

      ```
      $ cat /proc/driver/nvidia/version | grep "Kernel Module"
      ```

      下面是示例输出。

      ```
      NVRM version: NVIDIA UNIX x86_64 Kernel Module  610.43.02  ...
      ```

      上述示例中安装了内核模块的主要版本 `610`。

   1. 使用在上一步中确定的主要版本，安装 NVIDIA Fabric Manager。

      ```
      $ sudo apt-get install -y nvidia-fabricmanager-{{major_version_number}} \
      && sudo systemctl enable nvidia-fabricmanager && sudo systemctl start nvidia-fabricmanager
      ```

1. 确保每次启动实例时均设置 CUDA 路径。
   + 对于 * bash* shell，请将以下语句添加到 `/home/{{username}}/.bashrc` 和 `/home/{{username}}/.bash_profile`。

     ```
     export PATH=/usr/local/cuda/bin:$PATH
     export LD_LIBRARY_PATH=/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64:$LD_LIBRARY_PATH
     ```
   + 对于 * tcsh * shell，请将以下语句添加到 `/home/{{username}}/.cshrc`。

     ```
     setenv PATH=/usr/local/cuda/bin:$PATH
     setenv LD_LIBRARY_PATH=/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64:$LD_LIBRARY_PATH
     ```

1. 要验证 NVIDIA GPU 驱动程序是否正常运行，请运行以下命令。

   ```
   $ nvidia-smi -q | head
   ```

   此命令应返回有关 NVIDIA GPU、NVIDIA GPU 驱动程序和 NVIDIA CUDA 工具包的信息。

------
#### [ RHEL 10 ]

**安装 NVIDIA GPU 驱动程序、NVIDIA CUDA 工具包和 cuDNN**

1. 为确保您的所有软件包都处于最新状态，请对您的实例执行快速软件更新。

   ```
   $ sudo dnf upgrade -y && sudo reboot
   ```

   实例重启后，重新连接到实例。

1. 安装在安装 NVIDIA GPU 驱动程序和 NVIDIA CUDA 工具包时需要的实用程序。

   ```
   $ sudo dnf groupinstall 'Development Tools' -y \
   && sudo dnf install -y dkms kernel-devel-$(uname -r) \
   && sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-10.noarch.rpm
   ```

1. 禁用 `nouveau` 开源驱动程序。

   1. 将 `nouveau` 添加到 `/etc/modprobe.d/blacklist.conf` 拒绝列表文件。

      ```
      $ cat << EOF | sudo tee --append /etc/modprobe.d/blacklist.conf
      blacklist vga16fb
      blacklist nouveau
      blacklist rivafb
      blacklist nvidiafb
      blacklist rivatv
      EOF
      ```

   1. 将 `GRUB_CMDLINE_LINUX="rdblacklist=nouveau"` 附加到 `grub` 文件并重新构建 GRUB 配置。

      ```
      $ echo 'GRUB_CMDLINE_LINUX="rdblacklist=nouveau"' | sudo tee -a /etc/default/grub \
      && sudo grub2-mkconfig -o /boot/grub2/grub.cfg
      ```

1. 重启实例并重新连接到它。

1. 添加 CUDA 存储库并安装 NVIDIA GPU 驱动程序、NVIDIA CUDA 工具包和 cuDNN。

   ```
   $ sudo yum-config-manager --add-repo https://developer.download.nvidia.com/compute/cuda/repos/rhel10/x86_64/cuda-rhel10.repo \
   && sudo dnf install -y nvidia-open-580.167.08 cuda-toolkit-13-0 libcudnn9-cuda-13 libcudnn9-devel-cuda-13
   ```

1. 重启实例并重新连接到它。

1. （带 NVSwitch 的实例，例如 P 系列多 GPU 实例）安装并启动 NVIDIA Fabric Manager。G 系列实例不使用 NVSwitch，亦不需要 Fabric Manager。

   ```
   $ sudo dnf install -y https://developer.download.nvidia.com/compute/cuda/repos/rhel10/x86_64/nvidia-fabricmanager-580.167.08-1.x86_64.rpm \
   && sudo systemctl enable nvidia-fabricmanager && sudo systemctl start nvidia-fabricmanager
   ```

1. 确保每次启动实例时均设置 CUDA 路径。
   + 对于 * bash* shell，请将以下语句添加到 `/home/{{username}}/.bashrc` 和 `/home/{{username}}/.bash_profile`。

     ```
     export PATH=/usr/local/cuda/bin:$PATH
     export LD_LIBRARY_PATH=/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64:$LD_LIBRARY_PATH
     ```
   + 对于 * tcsh * shell，请将以下语句添加到 `/home/{{username}}/.cshrc`。

     ```
     setenv PATH=/usr/local/cuda/bin:$PATH
     setenv LD_LIBRARY_PATH=/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64:$LD_LIBRARY_PATH
     ```

1. 要验证 NVIDIA GPU 驱动程序是否正常运行，请运行以下命令。

   ```
   $ nvidia-smi -q | head
   ```

   此命令应返回有关 NVIDIA GPU、NVIDIA GPU 驱动程序和 NVIDIA CUDA 工具包的信息。

------

## 步骤 4：安装 GDRCopy
<a name="nccl-start-base-gdrcopy"></a>

安装 GDRCopy 以提高 Libfabric 的性能。有关 GDRCopy 的更多信息，请参阅 [GDRCopy 存储库](https://github.com/NVIDIA/gdrcopy)。

------
#### [ Amazon Linux 2023 ]

**安装 GDRCopy**

1. 安装所需的依赖项。

   ```
   $ sudo yum -y install dkms rpm-build make check check-devel
   ```

1. 下载并解压缩 GDRCopy 程序包。

   ```
   $ wget https://github.com/NVIDIA/gdrcopy/archive/refs/tags/v2.5.2.tar.gz \
   && tar xf v2.5.2.tar.gz && cd gdrcopy-2.5.2/packages
   ```

1. 构建 GDRCopy RPM 程序包。

   ```
   $ CUDA=/usr/local/cuda ./build-rpm-packages.sh
   ```

1. 安装 GDRCopy RPM 程序包。

   ```
   $ sudo rpm -Uvh gdrcopy-kmod-2.5.2*dkms*.rpm \
   && sudo rpm -Uvh gdrcopy-2.5.2*.rpm \
   && sudo rpm -Uvh gdrcopy-devel-2.5.2*.rpm
   ```

------
#### [ Ubuntu 26.04, Ubuntu 24.04, and Ubuntu 22.04 ]

**安装 GDRCopy**

1. 安装所需的依赖项。

   ```
   $ sudo apt-get install -y build-essential devscripts debhelper fakeroot pkg-config dkms
   ```
**注意**  
在 Ubuntu 22.04 上，还需要安装以下附加依赖项：

   ```
   $ sudo apt-get install -y check libsubunit-dev
   ```

1. 下载并解压缩 GDRCopy 程序包，然后构建程序包。

   ```
   $ wget https://github.com/NVIDIA/gdrcopy/archive/refs/tags/v2.5.2.tar.gz \
   && tar xf v2.5.2.tar.gz \
   && cd gdrcopy-2.5.2/packages \
   && CUDA=/usr/local/cuda ./build-deb-packages.sh
   ```

1. 安装 GDRCopy DEB 程序包。

   ```
   $ sudo dpkg -i gdrdrv-dkms_2.5.2-1_amd64.*.deb \
   && sudo dpkg -i libgdrapi_2.5.2-1_amd64.*.deb \
   && sudo dpkg -i gdrcopy-tests_2.5.2-1_amd64.*.deb \
   && sudo dpkg -i gdrcopy_2.5.2-1_amd64.*.deb
   ```

------
#### [ Debian 12 ]

**安装 GDRCopy**

1. 安装所需的依赖项。

   ```
   $ sudo apt-get install -y build-essential devscripts debhelper fakeroot pkg-config dkms
   ```

1. 下载并解压缩 GDRCopy 程序包。

   ```
   $ wget https://github.com/NVIDIA/gdrcopy/archive/refs/tags/v2.5.2.tar.gz \
   && tar xf v2.5.2.tar.gz && cd gdrcopy-2.5.2/packages
   ```

1. 应用 Debian 版本的补丁并构建程序包。

   ```
   $ sed -i 's/(2.5.2)/(2.5.2-1)/g' debian-lib/changelog \
   && sed -i 's/(2.5.2)/(2.5.2-1)/g' debian-tests/changelog \
   && sed -i 's/(2.5.2)/(2.5.2-1)/g' dkms/debian/changelog \
   && sed -i 's/(2.5.2)/(2.5.2-1)/g' debian-meta/changelog \
   && sed -i 's/FULL_VERSION="${VERSION}"/FULL_VERSION="${VERSION}-${DEBIAN_VERSION}"/g' build-deb-packages.sh
   ```

   ```
   $ CUDA=/usr/local/cuda ./build-deb-packages.sh
   ```

1. 安装 GDRCopy DEB 程序包。

   ```
   $ sudo dpkg -i gdrdrv-dkms_2.5.2*.deb \
   && sudo dpkg -i libgdrapi_2.5.2*.deb \
   && sudo dpkg -i gdrcopy-tests_2.5.2*.deb \
   && sudo dpkg -i gdrcopy_2.5.2*.deb
   ```

------
#### [ RHEL 10 ]

**安装 GDRCopy**

1. 安装所需的依赖项。

   ```
   $ sudo yum -y install dkms rpm-build make check check-devel
   ```

1. 下载并解压缩 GDRCopy 程序包。

   ```
   $ wget https://github.com/NVIDIA/gdrcopy/archive/refs/tags/v2.5.2.tar.gz \
   && tar xf v2.5.2.tar.gz && cd gdrcopy-2.5.2/packages
   ```

1. 构建 GDRCopy RPM 程序包。

   ```
   $ CUDA=/usr/local/cuda ./build-rpm-packages.sh
   ```

1. 安装 GDRCopy RPM 程序包。

   ```
   $ sudo rpm -Uvh gdrcopy-kmod-2.5.2*dkms*.rpm \
   && sudo rpm -Uvh gdrcopy-2.5.2*.rpm \
   && sudo rpm -Uvh gdrcopy-devel-2.5.2*.rpm
   ```

------

## 步骤 5：安装 EFA 软件
<a name="nccl-start-base-enable"></a>

在实例上安装支持 EFA 所需的启用 EFA 的内核、EFA 驱动程序、Libfabric、aws-ofi-nccl 插件和 Open MPI 堆栈。

**安装 EFA 软件**

1. 连接到您启动的实例。有关更多信息，请参阅 [使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)。

1. 下载 EFA 软件安装文件。软件安装文件为压缩的 tarball(`.tar.gz`) 文件。要下载最新的*稳定* 版本，请使用以下命令。

   ```
   $ curl -O https://efa-installer.amazonaws.com/aws-efa-installer-1.50.0.tar.gz
   ```

   您也可以通过将上面命令中的版本号替换为 `latest` 来获取最新版本。

1. （*可选*）验证 EFA tarball（`.tar.gz`）文件的真实性和完整性。

   建议您执行此操作以验证软件发布者的身份，并检查该文件自发布以来是否已被更改或损坏。如果您不想验证 tarball 文件，请跳过此步骤。
**注意**  
或者，如果您希望使用 MD5 或 SHA256 校验和验证 tarball 文件，请参阅 [使用校验和验证 EFA 安装程序](efa-verify.md)。

   1. 下载公有 GPG 密钥并将其导入到您的密钥环中。

      ```
      $ wget https://efa-installer.amazonaws.com/aws-efa-installer.key && gpg --import aws-efa-installer.key
      ```

      该命令应返回一个密钥值。请记下密钥值，因为需要在下一步中使用该值。

   1. 验证 GPG 密钥的指纹。运行以下命令并指定上一步中的密钥值。

      ```
      $ gpg --fingerprint {{key_value}}
      ```

      该命令应返回一个与 `4E90 91BC BB97 A96B 26B1 5E59 A054 80B1 DD2D 3CCC` 相同的指纹。如果指纹不匹配，请不要运行 EFA 安装脚本，并联系 支持。

   1. 下载签名文件并验证 EFA tarball 文件的签名。

      ```
      $ wget https://efa-installer.amazonaws.com/aws-efa-installer-1.50.0.tar.gz.sig && gpg --verify ./aws-efa-installer-1.50.0.tar.gz.sig
      ```

      下面显示了示例输出。

      ```
      gpg: Signature made Wed 29 Jul 2020 12:50:13 AM UTC using RSA key ID DD2D3CCC
      gpg: Good signature from "Amazon EC2 EFA <ec2-efa-maintainers@amazon.com>"
      gpg: WARNING: This key is not certified with a trusted signature!
      gpg:          There is no indication that the signature belongs to the owner.
      Primary key fingerprint: 4E90 91BC BB97 A96B 26B1  5E59 A054 80B1 DD2D 3CCC
      ```

      如果结果包含 `Good signature`，并且指纹与上一步中返回的指纹相匹配，请继续下一步。如果没有，请不要运行 EFA 安装脚本，并联系 支持。

1. 从压缩的 `.tar.gz` 文件中提取文件，并导航到提取的目录。

   ```
   $ tar -xf aws-efa-installer-1.50.0.tar.gz && cd aws-efa-installer
   ```

1. （*可选*）在安装过程中验证各个软件包的签名。

   从 EFA 安装程序 1.48.0 开始，安装程序包括 GPG 签名的各个 RPM 和 DEB 软件包。要在安装过程中验证每个软件包的真实性和完整性，请使用 `--check-signatures` 标志。启用此标志后，安装程序会首先验证所有软件包的签名，只有在每个软件包都通过验证后才会继续安装。如果有任何软件包未通过验证，安装程序将立即退出，而不安装任何程序。

   1. 下载 GPG 公有密钥。

      ```
      $ wget https://efa-installer.amazonaws.com/aws-efa-installer.key
      ```

   1. 导出密钥路径。然后，在下一步中，将 `--check-signatures` 附加到安装命令并使用 `sudo -E` 来保留环境变量，而不是 `sudo`。

      ```
      $ export EFA_INSTALLER_KEY=$(pwd)/aws-efa-installer.key
      ```

   在基于 RPM 的系统（Amazon Linux 2023、RHEL、Rocky Linux 和 SUSE）上，安装程序使用 `rpm --checksig` 来验证每个 RPM。在基于 DEB 的系统（Ubuntu、Debian）上，安装程序使用 GPG 签名验证来验证每个 DEB。如果任何程序包验证失败，安装将立即中止。
**注意**  
`--check-signatures` 标记是可选的。若没有此项验证，安装程序不会执行个人签名验证。

1. 运行 EFA 软件安装脚本。
**注意**  
如果您完成了前一个可选步骤来设置软件包签名验证，请将 `--check-signatures` 附加到安装命令并使用 `sudo -E`，而不是 `sudo`。例如：`sudo -E ./efa_installer.sh -y --mpi=openmpi5 --check-signatures`。
**注意**  
从 EFA 1.30.0 开始，默认情况下会同时安装 Open MPI 4.1 和 Open MPI 5。除非需要 Open MPI 4.1，否则只安装 Open MPI 5。以下命令仅安装 Open MPI 5。如果需要同时安装 Open MPI 4.1 和 Open MPI 5，请移除 `--mpi=openmpi5`。

   ```
   $ sudo ./efa_installer.sh -y --mpi=openmpi5
   ```

   **Libfabric** 安装在了 `/opt/amazon/efa` 目录中。**aws-ofi-nccl** 插件安装在了 `/opt/amazon/ofi-nccl` 目录中。**Open MPI** 安装在了 `/opt/amazon/openmpi` 目录中。

1. 如果 EFA 安装程序提示您重启实例，请执行此操作，然后重新连接到实例。否则，请注销实例，然后重新登录以完成安装。

1. 确认已成功安装 EFA 软件。

   ```
   $ fi_info -p efa -t FI_EP_RDM
   ```

   该命令应返回有关 Libfabric EFA 接口的信息。

## 步骤 6：安装 NCCL
<a name="nccl-start-base-nccl"></a>

安装 NCCL。有关 NCCL 的更多信息，请参阅 [NCCL 存储库](https://github.com/NVIDIA/nccl)。

**安装 NCCL**

1. 导航到 `/opt` 目录。

   ```
   $ cd /opt
   ```

1. 将官方 NCCL 存储库克隆到实例，然后导航到本地克隆的存储库。

   ```
   $ sudo git clone https://github.com/NVIDIA/nccl.git -b v2.30.4-1 && cd nccl
   ```

1. 生成并安装 NCCL，然后指定 CUDA 安装目录。

   ```
   $ sudo make -j src.build CUDA_HOME=/usr/local/cuda-13
   ```

## 步骤 7：安装 NCCL 测试
<a name="nccl-start-base-tests"></a>

安装 NCCL 测试。NCCL 测试使您能够确认是否已正确安装 NCCL 以及它是否正在按预期运行。有关 NCCL 测试的更多信息，请参阅 [nccl-tests 存储库](https://github.com/NVIDIA/nccl-tests)。

**安装 NCCL 测试**

1. 导航到您的主目录。

   ```
   $ cd $HOME
   ```

1. 将官方 nccl-tests 存储库克隆到实例，然后导航到本地克隆的存储库。

   ```
   $ git clone https://github.com/NVIDIA/nccl-tests.git && cd nccl-tests
   ```

1. 将 Libfabric 目录添加到 `LD_LIBRARY_PATH` 变量。
   + Amazon Linux 2023

     ```
     $ export LD_LIBRARY_PATH={{/opt/amazon/efa/lib64}}:$LD_LIBRARY_PATH
     ```
   + Ubuntu 和 Debian

     ```
     $ export LD_LIBRARY_PATH={{/opt/amazon/efa/lib}}:$LD_LIBRARY_PATH
     ```
   + RHEL 10

     ```
     $ export LD_LIBRARY_PATH={{/opt/amazon/efa/lib64}}:$LD_LIBRARY_PATH
     ```

1. 安装 NCCL 测试并指定 MPI、NCCL 和 CUDA 安装目录。

   ```
   $ make MPI=1 MPI_HOME={{/opt/amazon/openmpi}} NCCL_HOME={{/opt/nccl/build}} CUDA_HOME={{/usr/local/cuda-13}}
   ```

## 步骤 8：测试 EFA 和 NCCL 配置
<a name="nccl-start-base-test"></a>

运行测试以确保为 EFA 和 NCCL 正确配置临时实例。

**测试 EFA 和 NCCL 配置**

1. 创建一个主机文件来指定要在其上运行测试的主机。以下命令创建一个名为 `my-hosts` 的主机文件，该文件包含对实例本身的引用。

------
#### [ IMDSv2 ]

   ```
   [ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
   && curl -H "X-aws-ec2-metadata-token: $TOKEN" -v http://169.254.169.254/latest/meta-data/local-ipv4 >> my-hosts
   ```

------
#### [ IMDSv1 ]

   ```
   [ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/local-ipv4 >> my-hosts
   ```

------

1. 运行 NCCL 测试。以下命令假设一个实例有 8 个 GPU。根据实例类型调整 `-n` 和 `-N` 的值。

   ```
   $ /opt/amazon/openmpi/bin/mpirun \
   -x FI_EFA_USE_DEVICE_RDMA=1 \
   -x LD_LIBRARY_PATH=/opt/nccl/build/lib:/usr/local/cuda/lib64:/opt/amazon/efa/lib:/opt/amazon/openmpi/lib:/opt/amazon/ofi-nccl/lib:$LD_LIBRARY_PATH \
   -x NCCL_DEBUG=INFO \
   --hostfile my-hosts -n 8 -N 8 \
   --mca pml ^cm --mca btl tcp,self --mca btl_tcp_if_exclude lo,docker0 --bind-to none \
   $HOME/nccl-tests/build/all_reduce_perf -b 8 -e 1G -f 2 -g 1 -c 1 -n 100
   ```

1. 打印 `NCCL_DEBUG` 日志时，您可以确认 EFA 是否作为 NCCL 的底层提供程序处于活动状态。

   ```
   ip-192-168-2-54:14:14 [0] NCCL INFO NET/OFI Selected Provider is efa*
   ```

   使用 `p4d.24xlarge` 实例时会显示以下附加信息。

   ```
   ip-192-168-2-54:14:14 [0] NCCL INFO NET/OFI Running on P4d platform, Setting NCCL_TOPO_FILE environment variable to /home/ec2-user/install/plugin/share/aws-ofi-nccl/xml/p4d-24xl-topo.xml
   ```

## 步骤 9：安装机器学习应用程序
<a name="nccl-start-base-app"></a>

在临时实例上安装机器学习应用程序。安装过程因特定的机器学习应用程序而异。有关在 Linux 实例上安装软件的更多信息，请参阅*《Amazon Linux 2023 用户指南》*中的[管理操作系统更新](https://docs.aws.amazon.com/linux/al2023/ug/managing-repos-os-updates.html)。

**注意**  
请参阅机器学习应用程序文档以了解安装说明。

## 步骤 10：创建启用了 EFA 和 NCCL 的 AMI
<a name="nccl-start-base-ami"></a>

在安装所需的软件组件后，您可以创建一个 AMI，然后可以将其重复使用以启动启用了 EFA 的实例。

**从临时实例创建 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择您创建的临时实例，然后依次选择 **Actions (操作)**、**Image (映像)**、**Create image (创建映像)**。

1. 对于 **Create image (创建映像)**，请执行以下操作：

   1. 对于 **Image name (映像名称)**，为 AMI 输入一个描述性名称。

   1. （可选）对于 **Image description (映像描述)**，输入 AMI 用途的简要描述。

   1. 选择**创建映像**。

1. 在导航窗格中，选择 **AMIs**。

1. 在列表中找到您创建的 AMI。等待状态从 `pending` 更改为 `available`，然后继续下一步。

## 步骤 11：终止临时实例
<a name="nccl-start-base-terminate"></a>

现在，已不再需要您启动的临时实例。您可以终止实例以停止产生费用。

**终止临时实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择您创建的临时实例，然后依次选择 **Actions (操作)**、**Instance state (实例状态)**、**Terminate instance (终止实例)**。

1. 当系统提示您确认时，选择**终止**。

## 步骤 12：在集群置放群组中启动启用了 EFA 和 NCCL 的实例
<a name="nccl-start-base-cluster"></a>

使用启用了 EFA 的 AMI 以及之前创建的启用了 EFA 的安全组，在集群置放群组中启动启用了 EFA 和 NCCL 的实例。

**注意**  
在集群置放群组中启动启用了 EFA 的实例并不是一个绝对要求。不过，我们建议在集群置放群组中运行启用了 EFA 的实例，因为它在单个可用区的低延迟组中启动实例。
为了确保在扩展集群实例时容量可用，您可以为集群置放群组创建容量预留。有关更多信息，请参阅 [使用置放群组的容量预留](cr-cpg.md)。

------
#### [ New console ]

**启动临时实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Instances**（实例），然后选择 **Launch Instances**（启动实例）以打开新的启动实例向导。

1. （*可选*）在 **Name and tags**（名称和标签）部分中，提供实例的名称，例如 `EFA-instance`。名称作为资源标签（`Name={{EFA-instance}}`）分配给实例。

1. 在 **Application and OS Images**（应用程序和操作系统映像）部分中，请选择 **My AMIs**（我的 AMI），然后选择您在上一步骤创建的 AMI。

1. 在 **Instance type**（实例类型）部分中，选择 `p3dn.24xlarge` 或 `p4d.24xlarge`。

1. 在 **Key pair**（密钥对）部分中，选择要用于实例的密钥对。

1. 在 **Network settings**（网络设置）部分中，请选择 **Edit**（编辑），然后执行以下操作：

   1. 对于**子网**，选择要在其中启动实例的子网。如果您未选择子网，则不能启用 EFA 的实例。

   1. 对于 **Firewall（security groups）**（防火墙（安全组）），请选择 **Select existing security group**（选择现有安全组），然后选择您在上一步中创建的安全组。

   1. 展开**高级网络配置**部分。

      对于**网络接口 1**，选择**网卡索引 = 0**、**设备索引 = 0**、**接口类型 = 带 ENA 的 EFA**。

      （可选）如果您使用的是多卡实例类型，例如 `p4d.24xlarge` 或 `p5.48xlarge`，则对于每个额外的网络接口，选择**添加网络接口**；对于**网卡索引**，选择下一个未使用的索引，然后选择**设备索引 = 1** 和**接口类型 = 带 ENA 的 EFA** 或**仅限 EFA**。

1. （*可选*）在 **Storage**（存储）部分中，根据需要配置卷。

1. 在 **Advanced details**（高级详细信息）部分中，对于**置放群组名称**，选择要在其中启动实例的集群置放群组。如果您需要创建新的集群置放群组，请选择 **Create new placement group**（创建新置放群组）。

1. 在右侧的 **Summary**（摘要）面板中，为 **Number of instances**（实例数量）输入您要启动的启用了 EAA 的实例数量，然后选择 **Launch instance**（启动实例）。

------
#### [ Old console ]

**在集群置放群组中启动启用了 EFA 和 NCCL 的实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择 **Launch Instance**。

1. 在 **Choose an AMI (选择 AMI)** 页面上，选择 **My AMIs (我的 AMI)**，找到之前创建的 AMI，然后选择 **Select (选择)**。

1. 在**选择实例类型**页面上，选择 **p3dn.24xlarge**，然后选择**下一步：配置实例详细信息**。

1. 在 **Configure Instance Details (配置实例详细信息)** 页面中，执行以下操作：

   1. 对于 **Number of instances (实例的数量)**，请输入要启动的启用了 EFA 和 NCCL 的实例数量。

   1. 对于 **Network (网络)** 和 **Subnet (子网)**，请选择要在其中启动实例的 VPC 和子网。

   1. 对于 **Placement group (置放群组)**，请选择 **Add instance to placement group (将实例添加到置放群组)**。

   1. 对于 **Placement group name (置放群组名称)**，请选择 **Add to a new placement group (添加到新的置放群组)**，然后输入一个描述性的置放群组名称。然后，对于 **Placement group strategy (置放群组策略)**，请选择 **cluster (集群)**。

   1. 对于 **EFA**，请选择 **Enable (启用)**。

   1. 在 **Network Interfaces (网络接口)** 部分中，为设备 **eth0** 选择 **New network interface (新网络接口)**。您可以选择指定主 IPv4 地址以及一个或多个辅助 IPv4 地址。如果在具有关联的 IPv6 CIDR 数据块的子网中启动实例，您可以选择指定主 IPv6 地址以及一个或多个辅助 IPv6 地址。

   1. 选择 **Next: Add Storage**。

1. 在 **Add Storage (添加存储)** 页面上，除了 AMI 指定的卷（如根设备卷）以外，还要指定要附加到实例的卷。然后，选择 **Next: Add Tags (下一步: 添加标签)**。

1. 在 **Add Tags (添加标签)** 页面上，为实例指定标签（例如，便于用户识别的名称），然后选择 **Next: Configure Security Group (下一步：配置安全组)**。

1. 在 **Configure Security Group (配置安全组)** 页面上，为 **Assign a security group (分配安全组)** 选择 **Select an existing security group (选择一个现有的安全组)**，然后选择之前创建的安全组。

1. 选择 **Review and Launch**。

1. 在 **Review Instance Launch (核查实例启动)** 页面上，检查这些设置，然后选择 **Launch (启动)** 以选择一个密钥对并启动您的实例。

------

## 步骤 13：启用无密码 SSH
<a name="nccl-start-base-passwordless"></a>

**注意**  
默认 SSH 用户因操作系统而异：Ubuntu 为 `ubuntu`，Debian 为 `admin`，Amazon Linux，以及 RHEL 为 `ec2-user`。

要使应用程序能够在集群中的所有实例上运行，您必须启用从领导节点到成员节点的无密码 SSH 访问。领导节点是从中运行应用程序的实例。集群中的其余实例是成员节点。

**在集群中的实例之间启用无密码 SSH**

1. 在集群中选择一个实例作为领导节点，然后连接到该实例。

1. 在领导节点上禁用 `strictHostKeyChecking` 并启用 `ForwardAgent`。使用首选文本编辑器打开 `~/.ssh/config`，并添加以下内容。

   ```
   Host *
       ForwardAgent yes
   Host *
       StrictHostKeyChecking no
   ```

1. 生成 RSA 密钥对。

   ```
   $ ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa
   ```

   密钥对在 `$HOME/.ssh/` 目录中创建。

1. 更改领导节点上私有密钥的权限。

   ```
   $ chmod 600 ~/.ssh/id_rsa
   chmod 600 ~/.ssh/config
   ```

1. 使用首选文本编辑器打开 `~/.ssh/id_rsa.pub` 并复制密钥。

1. 对于集群中的每个成员节点，请执行以下操作：

   1. 连接到实例。

   1. 使用首选文本编辑器打开 `~/.ssh/authorized_keys`，并添加之前复制的公有密钥。

1. 要测试无密码 SSH 是否按预期运行，请连接到领导节点并运行以下命令。

   ```
   $ ssh {{member_node_private_ip}}
   ```

   您应该连接到成员节点，而不会收到输入密钥或密码的提示。
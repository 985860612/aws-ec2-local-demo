

# 开始使用 EFA 和 NIXL 处理 Amazon EC2 上的推理工作负载
<a name="efa-start-nixl"></a>

NVIDIA Inference Xfer Library (NIXL) 是一个高吞吐量、低延迟的通信库，专为分解推理工作负载而设计。NIXL 可以与 EFA 和 Libfabric 一起使用，以支持预填充和解码节点之间的 KV 缓存传输，并且它可以在不同存储层之间高效地移动 KV 缓存。有关更多信息，请参阅 [NIXL](https://github.com/ai-dynamo/nixl) 网站。

**要求**
+ 仅支持 Ubuntu 24.04 和 Ubuntu 22.04 基本 AMI。
+ EFA 仅支持 NIXL 1.0.0 及更高版本。

**Topics**

## 步骤 1：准备启用 EFA 的安全组
<a name="nixl-start-base-setup"></a>

EFA 需要使用一个安全组，以允许进出安全组本身的所有入站和出站流量。以下过程创建了一个安全组，该安全组允许所有进出其本身的入站和出站流量，并允许来自任何 IPv4 地址的入站 SSH 流量进行 SSH 连接。

**重要**  
此安全组仅用于测试目的。对于您的生产环境，建议您创建入站 SSH 规则，该规则仅允许来自您连接的 IP 地址的流量，例如计算机的 IP 地址或本地网络中的一系列 IP 地址。

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

**重要**  
自引用入站和出站规则（允许进出安全组自身的所有流量）是保证 EFA 正常运行的必要条件。如果没有这些规则，实例之间的 EFA 流量将被阻断。

## 步骤 2：启动临时实例
<a name="nixl-start-base-temp"></a>

启动一个临时实例，可用于安装和配置 EFA 软件组件。您使用该实例创建一个启用了 EFA 的 AMI，您可以从中启动启用了 EFA 的实例。

**启动临时实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Instances**（实例），然后选择 **Launch Instances**（启动实例）以打开新的启动实例向导。

1. （*可选*）在 **Name and tags**（名称和标签）部分中，提供实例的名称，例如 `EFA-instance`。名称作为资源标签（`Name={{EFA-instance}}`）分配给实例。

1. 在**应用程序和操作系统映像**部分中，为其中一个支持的操作系统选择 AMI。您也可以在 [DLAMI 发行说明页面上](https://docs.aws.amazon.com/dlami/latest/devguide/appendix-ami-release-notes)选择受支持的 DLAMI。

1. 在**实例类型**部分中，选择支持的实例类型。

1. 在 **Key pair**（密钥对）部分中，选择要用于实例的密钥对。

1. 在 **Network settings**（网络设置）部分中，请选择 **Edit**（编辑），然后执行以下操作：

   1. 对于**子网**，选择要在其中启动实例的子网。如果您未选择子网，则不能启用 EFA 的实例。

   1. 对于 **Firewall（security groups）**（防火墙（安全组）），请选择 **Select existing security group**（选择现有安全组），然后选择您在上一步中创建的安全组。

   1. 展开**高级网络配置**部分。

      对于**网络接口 1**，选择**网卡索引 = 0**、**设备索引 = 0**、**接口类型 = 带 ENA 的 EFA**。

      （*可选*）如果您使用的是多卡实例类型，例如 `p4d.24xlarge` 或 `p5.48xlarge`，则对于每个额外的网络接口，选择**添加网络接口**；对于**网卡索引**，选择下一个未使用的索引，然后选择**设备索引 1** 和**接口类型 = 带 ENA 的 EFA** 或**仅限 EFA**。

1. 在 **Storage**（存储）部分中，根据需要配置卷。
**注意**  
您必须为 Nvidia CUDA 工具包额外预置 10 到 20 GiB 的存储空间。如果您没有预置足够的存储空间，您将在尝试安装 Nvidia 驱动程序和 CUDA 工具包时收到 `insufficient disk space` 错误。

1. 在右侧的 **Summary**（摘要）面板中，选择 **Launch instance**（启动实例）。

**重要**  
如果您的 AMI 已经包含 Nvidia GPU 驱动程序、CUDA 工具包和 cuDNN，或者您使用的是非 GPU 实例，请跳过步骤 3。

## 步骤 3：安装 Nvidia GPU 驱动程序、Nvidia CUDA 工具包和 cuDNN
<a name="nixl-start-base-drivers"></a>

**安装 Nvidia GPU 驱动程序、Nvidia CUDA 工具包和 cuDNN**

1. 为确保您的所有软件包都处于最新状态，请对您的实例执行快速软件更新。

   ```
   $ sudo apt-get update && sudo apt-get upgrade -y
   ```

1. 安装在安装 Nvidia GPU 驱动程序和 Nvidia CUDA 工具包时需要的实用程序。

   ```
   $ sudo apt-get install build-essential -y
   ```

1. 要使用 Nvidia GPU 驱动程序，您必须先禁用 `nouveau` 开源驱动程序。

   1. 为您当前运行的内核版本安装所需的实用程序和内核标头软件包。

      ```
      $ sudo apt-get install -y gcc make linux-headers-$(uname -r)
      ```

   1. 将 `nouveau` 添加到`/etc/modprobe.d/blacklist.conf `拒绝列表文件。

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

   1. 重新生成 Grub 配置。

      ```
      $ sudo update-grub
      ```

1. 重启实例并重新连接到它。

1. 添加 CUDA 存储库并安装 Nvidia GPU 驱动程序、NVIDIA CUDA 工具包和 cuDNN。

   ```
   $ sudo apt-key adv --fetch-keys http://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu2004/x86_64/7fa2af80.pub \
   && wget -O /tmp/deeplearning.deb http://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu2004/x86_64/nvidia-machine-learning-repo-ubuntu2004_1.0.0-1_amd64.deb \
   && sudo dpkg -i /tmp/deeplearning.deb \
   && wget -O /tmp/cuda.pin https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-ubuntu2004.pin \
   && sudo mv /tmp/cuda.pin /etc/apt/preferences.d/cuda-repository-pin-600 \
   && sudo apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/3bf863cc.pub \
   && sudo add-apt-repository 'deb http://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/ /' \
   && sudo apt update \
   && sudo apt install nvidia-dkms-535 \
   && sudo apt install -o Dpkg::Options::='--force-overwrite' cuda-drivers-535 cuda-toolkit-12-3 libcudnn8 libcudnn8-dev -y
   ```

1. 重启实例并重新连接到它。

1. （仅限 `p4d.24xlarge` 和 `p5.48xlarge`）安装 Nvidia Fabric Manager。

   1. 您必须安装与上一步中安装的 Nvidia 内核模块版本匹配的 Nvidia Fabric Manager 版本。

      运行以下命令以确定 Nvidia 内核模块的版本。

      ```
      $ cat /proc/driver/nvidia/version | grep "Kernel Module"
      ```

      下面是示例输出。

      ```
      NVRM version: NVIDIA UNIX x86_64 Kernel Module  450.42.01  Tue Jun 15 21:26:37 UTC 2021
      ```

      上述示例中安装了内核模块的主要版本 `450`。这意味着您需要安装 Nvidia Fabric Manager 版本 `450`。

   1. 安装 Nvidia Fabric Manager。运行以下命令并指定上一步中确定的主要版本。

      ```
      $ sudo apt install -o Dpkg::Options::='--force-overwrite' nvidia-fabricmanager-{{major_version_number}}
      ```

      例如，如果已安装内核模块的主要版本 `450`，请使用以下命令安装与之匹配的 Nvidia Fabric Manager 版本。

      ```
      $ sudo apt install -o Dpkg::Options::='--force-overwrite' nvidia-fabricmanager-450
      ```

   1. 启动服务，并确保它在实例启动时自动启动。NV 交换管理需要 Nvidia Fabric 管理器。

      ```
      $ sudo systemctl start nvidia-fabricmanager && sudo systemctl enable nvidia-fabricmanager
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

1. 要验证 Nvidia GPU 驱动程序是否正常运行，请运行以下命令。

   ```
   $ nvidia-smi -q | head
   ```

   此命令应返回有关 Nvidia GPU、Nvidia GPU 驱动程序和 Nvidia CUDA 工具包的信息。

**重要**  
如果您的 AMI 已经包含 GDRCopy，或者您使用的是非 GPU 实例，请跳过步骤 4。

## 步骤 4：安装 GDRCopy
<a name="nixl-start-base-gdrcopy"></a>

安装 GDRCopy，以提高 Libfabric 在基于 GPU 的平台上的性能。有关 GDRCopy 的更多信息，请参阅 [GDRCopy 存储库](https://github.com/NVIDIA/gdrcopy)。

**安装 GDRCopy**

1. 安装所需的依赖项。

   ```
   $ sudo apt -y install build-essential devscripts debhelper check libsubunit-dev fakeroot pkg-config dkms
   ```

1. 下载并解压缩 GDRCopy 程序包。

   ```
   $ wget https://github.com/NVIDIA/gdrcopy/archive/refs/tags/v2.4.tar.gz \
   && tar xf v2.4.tar.gz \
   && cd gdrcopy-2.4/packages
   ```

1. 构建 GDRCopy DEB 程序包。

   ```
   $ CUDA=/usr/local/cuda ./build-deb-packages.sh
   ```

1. 安装 GDRCopy DEB 程序包。

   ```
   $ sudo dpkg -i gdrdrv-dkms_2.4-1_amd64.*.deb \
   && sudo dpkg -i libgdrapi_2.4-1_amd64.*.deb \
   && sudo dpkg -i gdrcopy-tests_2.4-1_amd64.*.deb \
   && sudo dpkg -i gdrcopy_2.4-1_amd64.*.deb
   ```

**重要**  
如果您的 AMI 已经包含最新的 EFA 安装程序，请跳过步骤 5。

## 步骤 5：安装 EFA 软件
<a name="nixl-start-base-enable"></a>

在实例上安装支持 EFA 所需的启用 EFA 的内核、EFA 驱动程序 和 Libfabric 堆栈。

**安装 EFA 软件**

1. 连接到您启动的实例。有关更多信息，请参阅 [使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)。

1. 下载 EFA 软件安装文件。软件安装文件将打包为压缩的 tarball（`.tar.gz`）文件。要下载最新的*稳定* 版本，请使用以下命令。

   ```
   $ curl -O https://efa-installer.amazonaws.com/aws-efa-installer-1.50.0.tar.gz
   ```

1. 从压缩的 `.tar.gz` 文件中提取文件，删除压缩包，并导航到提取的目录。

   ```
   $ tar -xf aws-efa-installer-1.50.0.tar.gz && rm -rf aws-efa-installer-1.50.0.tar.gz && cd aws-efa-installer
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

   在基于 RPM 的系统（Amazon Linux、RHEL、Rocky Linux 和 SUSE）上，安装程序使用 `rpm --checksig` 来验证每个 RPM。在基于 DEB 的系统（Ubuntu、Debian）上，安装程序使用 GPG 签名验证来验证每个 DEB。

   如果任何软件包验证失败，安装将立即中止，从而保护您的系统免受损坏或恶意软件包的侵害。
**注意**  
`--check-signatures` 标记是可选的。若没有此项验证，安装程序不会执行个人签名验证。

1. 运行 EFA 软件安装脚本。
**注意**  
如果您完成了前一个可选步骤来设置软件包签名验证，请将 `--check-signatures` 附加到安装命令并使用 `sudo -E`，而不是 `sudo`。例如：`sudo -E ./efa_installer.sh -y --check-signatures`。

   ```
   $ sudo ./efa_installer.sh -y
   ```

   **Libfabric** 安装在了 `/opt/amazon/efa` 目录中。

1. 如果 EFA 安装程序提示您重启实例，请执行此操作，然后重新连接到实例。否则，请注销实例，然后重新登录以完成安装。

1. 确认已成功安装 EFA 软件组件。

   ```
   $ fi_info -p efa -t FI_EP_RDM
   ```

   该命令应返回有关 Libfabric EFA 接口的信息。以下示例显示了命令输出。
   + `p3dn.24xlarge`（具有单个网络接口）

     ```
     provider: efa
     fabric: EFA-fe80::94:3dff:fe89:1b70
     domain: efa_0-rdm
     version: 2.0
     type: FI_EP_RDM
     protocol: FI_PROTO_EFA
     ```
   + `p4d.24xlarge` 和 `p5.48xlarge` 具有多个网络接口

     ```
     provider: efa
     fabric: EFA-fe80::c6e:8fff:fef6:e7ff
     domain: efa_0-rdm
     version: 111.0
     type: FI_EP_RDM
     protocol: FI_PROTO_EFA
     provider: efa
     fabric: EFA-fe80::c34:3eff:feb2:3c35
     domain: efa_1-rdm
     version: 111.0
     type: FI_EP_RDM
     protocol: FI_PROTO_EFA
     provider: efa
     fabric: EFA-fe80::c0f:7bff:fe68:a775
     domain: efa_2-rdm
     version: 111.0
     type: FI_EP_RDM
     protocol: FI_PROTO_EFA
     provider: efa
     fabric: EFA-fe80::ca7:b0ff:fea6:5e99
     domain: efa_3-rdm
     version: 111.0
     type: FI_EP_RDM
     protocol: FI_PROTO_EFA
     ```

## 步骤 6：安装 NIXL
<a name="nixl-start-base-nixl"></a>

安装 NIXL。有关 NIXL 的更多信息，请参阅 [NIXL 存储库](https://github.com/ai-dynamo/nixl)。

------
#### [ Pre-built distributions ]

**使用 PyPI 安装 NIXL**

1. 安装所需的依赖项。

   ```
   $ sudo apt install pip
   ```

1. 安装 NIXL。

   ```
   $ pip install nixl
   ```

------
#### [ Build from source ]

**从源代码构建和安装 NIXL**

1. 安装所需的依赖项。

   ```
   $ sudo apt install cmake pkg-config meson pybind11-dev libaio-dev nvidia-cuda-toolkit pip libhwloc-dev \
   && pip install meson ninja pybind11
   ```

1. 导航到您的主目录。

   ```
   $ cd $HOME
   ```

1. 将官方 NIXL 存储库克隆到实例，然后导航到本地克隆的存储库。

   ```
   $ sudo git clone https://github.com/ai-dynamo/nixl.git && cd nixl
   ```

1. 构建并安装 NIXL，并指定 Libfabric 安装目录的路径。

   ```
   $ sudo meson setup . nixl --prefix=/usr/local/nixl -Dlibfabric_path=/opt/amazon/efa
   $ cd nixl && sudo ninja && sudo ninja install
   ```

------

## 步骤 7：安装 NIXL Benchmark 并测试 EFA 和 NIXL 配置
<a name="nixl-start-base-tests"></a>

安装 NIXL Benchmark 并运行测试，以确保临时实例已为 EFA 和 NIXL 正确配置。通过 NIXL Benchmark，您可以确认 NIXL 已正确安装并按预期运行。有关更多信息，请参阅 [nixlbench 存储库](https://github.com/ai-dynamo/nixl/tree/main/benchmark/nixlbench)。

NIXL Benchmark (nixlbench) 需要 ETCD 来协调客户端和服务器。要将 ETCD 与 NIXL 一起使用，需要 ETCD 服务器和客户端，以及 ETCD CPP API。

------
#### [ Build from Docker ]

**使用 Docker 安装和测试 NIXL Benchmark**

1. 将官方 NIXL 存储库克隆到实例，然后导航到 nixlbench 构建目录。

   ```
   $ git clone https://github.com/ai-dynamo/nixl.git
   $ cd nixl/benchmark/nixlbench/contrib
   ```

1. 构建容器

   ```
   $ ./build.sh
   ```

   有关 Docker 构建选项的更多信息，请参阅 [nixlbench 存储库](https://github.com/ai-dynamo/nixl/tree/main/benchmark/nixlbench)。

1. 安装 Docker。

   ```
   $ sudo apt install docker.io -y
   ```

1. 启动 ETCD 服务器进行协调。

   ```
   $ docker run -d --name etcd-server \
       -p 2379:2379 -p 2380:2380 \
       quay.io/coreos/etcd:v3.5.18 \
       /usr/local/bin/etcd \
       --data-dir=/etcd-data \
       --listen-client-urls=http://0.0.0.0:2379 \
       --advertise-client-urls=http://0.0.0.0:2379 \
       --listen-peer-urls=http://0.0.0.0:2380 \
       --initial-advertise-peer-urls=http://0.0.0.0:2380 \
       --initial-cluster=default=http://0.0.0.0:2380
   ```

1. 验证 ETCD 服务器是否正在运行。

   ```
   $ curl -L http://localhost:2379/health
   ```

   预期输出：

   ```
   {"health":"true"}
   ```

1. 为该实例打开两个终端。在两个终端，运行以下命令来验证安装。该命令在同一个实例上使用 ETCD 服务器，使用 Libfabric 作为后端，并使用 GPU 内存进行操作。

   ```
   $ docker run -it --gpus all --network host nixlbench:latest \
       nixlbench --etcd_endpoints http://localhost:2379 \
       --backend LIBFABRIC \
       --initiator_seg_type VRAM \
       --target_seg_type VRAM
   ```
**注意**  
对于非 GPU 实例，使用值 `DRAM` 代替 `VRAM`。

------
#### [ Build from source ]

**重要**  
只有在步骤 6 中选择 “**从源代码构建**” 时，才遵循此选项卡。

**安装 NIXL Benchmark**

1. 安装所需的系统依赖项。

   ```
   $ sudo apt install libgflags-dev
   ```

1. 安装 ETCD 服务器和客户端。

   ```
   $ sudo apt install -y etcd-server etcd-client
   ```

1. 安装 ETCD CPP API。

   1. 安装 ETCD CPP API 所需的依赖项。

      ```
      $ sudo apt install libboost-all-dev libssl-dev libgrpc-dev libgrpc++-dev libprotobuf-dev protobuf-compiler-grpc libcpprest-dev
      ```

   1. 克隆并安装 ETCD CPP API。

      ```
      $ cd $HOME
      $ git clone https://github.com/etcd-cpp-apiv3/etcd-cpp-apiv3.git
      $ cd etcd-cpp-apiv3
      $ mkdir build && cd build
      $ cmake ..
      $ sudo make -j$(nproc) && sudo make install
      ```

1. 构建和安装 nxlbench。

   ```
   $ sudo meson setup . $HOME/nixl/benchmark/nixlbench -Dnixl_path=/usr/local/nixl/
   $ sudo ninja && sudo ninja install
   ```

**测试 EFA 和 NIXL 配置**

1. 在实例上启动 ETCD 服务器。

   ```
   $ etcd --listen-client-urls "http://0.0.0.0:2379" \
       --advertise-client-urls "http://localhost:2379" &
   ```

1. 验证 ETCD 服务器是否正在运行。

   ```
   $ curl -L http://localhost:2379/health
   ```

   预期输出：

   ```
   {"health":"true"}
   ```

1. 为该实例打开两个终端。在两个终端上，完成以下步骤，运行 nixlbench。

   1. 导航到安装 nxlbench 的目录。

      ```
      $ cd /usr/local/nixlbench/bin/
      ```

   1. 运行测试并指定后端、ETCD 服务器的地址和启动器分段类型。以下命令在同一实例上使用 ETCD 服务器，使用 Libfabric 作为后端，并使用 GPU 内存进行操作。环境变量配置如下：
      + `NIXL_LOG_LEVEL=INFO` — 启用详细的调试输出。您也可以指定 `WARN` 仅接收错误消息。
      + `LD_LIBRARY_PATH` — 设置 NIXL 库的路径。

      有关 NIXL Benchmark 参数的更多信息，请参阅官方 nxlbench 存储库中的 [NIXLbench 自述文件](https://github.com/ai-dynamo/nixl/blob/main/benchmark/nixlbench/README.md)。

      ```
      $ export NIXL_LOG_LEVEL=INFO
      $ export LD_LIBRARY_PATH=/usr/local/nixl/lib/$(gcc -dumpmachine):$LD_LIBRARY_PATH
      
      $ nixlbench --etcd-endpoints 'http://localhost:2379' \
          --backend 'LIBFABRIC' \
          --initiator_seg_type 'VRAM' \
          --target_seg_type 'VRAM'
      ```
**注意**  
对于非 GPU 实例，使用值 `DRAM` 代替 `VRAM`。

------

## 步骤 8：安装机器学习应用程序
<a name="nixl-start-base-app"></a>

在临时实例上安装机器学习应用程序。安装过程因特定的机器学习应用程序而异。

**注意**  
请参阅机器学习应用程序文档以了解安装说明。

## 步骤 9：创建启用了 EFA 和 NIXL 的 AMI
<a name="nixl-start-base-ami"></a>

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

## 步骤 10：终止临时实例
<a name="nixl-start-base-terminate"></a>

现在，已不再需要您启动的临时实例。您可以终止实例以停止产生费用。

**终止临时实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择您创建的临时实例，然后依次选择 **Actions (操作)**、**Instance state (实例状态)**、**Terminate instance (终止实例)**。

1. 当系统提示您确认时，选择**终止**。

## 步骤 11：启动启用 EFA 和 Nixl 的实例
<a name="nixl-start-base-cluster"></a>

使用在**步骤 9** 中创建的启用了 EFA 的 AMI 以及在**步骤 1** 中创建的启用了 EFA 的安全组，启动启用了 EFA 和 NIXL 的实例。

**启动启用了 EFA 和 NIXL 的实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Instances**（实例），然后选择 **Launch Instances**（启动实例）以打开新的启动实例向导。

1. （*可选*）在 **Name and tags**（名称和标签）部分中，提供实例的名称，例如 `EFA-instance`。名称作为资源标签（`Name={{EFA-instance}}`）分配给实例。

1. 在 **Application and OS Images**（应用程序和操作系统映像）部分中，请选择 **My AMIs**（我的 AMI），然后选择您在上一步骤创建的 AMI。

1. 在**实例类型**部分中，选择支持的实例类型。

1. 在 **Key pair**（密钥对）部分中，选择要用于实例的密钥对。

1. 在 **Network settings**（网络设置）部分中，请选择 **Edit**（编辑），然后执行以下操作：

   1. 对于**子网**，选择要在其中启动实例的子网。如果您未选择子网，则不能启用 EFA 的实例。

   1. 对于**防火墙（安全组）**，选择**选择现有安全组**，然后选择您在**步骤 1** 中创建的安全组。

   1. 展开**高级网络配置**部分。

      对于**网络接口 1**，选择**网卡索引 = 0**、**设备索引 = 0**、**接口类型 = 带 ENA 的 EFA**。

      （*可选*）如果您使用的是多卡实例类型，例如 `p4d.24xlarge` 或 `p5.48xlarge`，则对于每个额外的网络接口，选择**添加网络接口**；对于**网卡索引**，选择下一个未使用的索引，然后选择**设备索引 1** 和**接口类型 = 带 ENA 的 EFA** 或**仅限 EFA**。

1. （*可选*）在 **Storage**（存储）部分中，根据需要配置卷。

1. 在右侧的 **Summary**（摘要）面板中，为 **Number of instances**（实例数量）输入您要启动的启用了 EAA 的实例数量，然后选择 **Launch instance**（启动实例）。

## 步骤 12：启用无密码 SSH
<a name="nixl-start-base-passwordless"></a>

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

**重要**  
只有在执行步骤 7 时才执行步骤 13。

## 步骤 13：跨实例测试 EFA 和 NIXL 配置
<a name="nixl-start-base-test-multi"></a>

运行测试，确保实例已为 EFA 和 NIXL 正确配置。

------
#### [ Build from Docker ]

**使用 Docker 跨实例测试 EFA 和 NIXL 配置**

1. 选择两台主机来运行 nixlbench 基准测试。使用第一台主机的 IP 地址作为 ETCD 服务器 IP 进行元数据交换。

1. 在主机 1 上启动 ETCD 服务器。

   ```
   $ docker run -d --name etcd-server \
       -p 2379:2379 -p 2380:2380 \
       quay.io/coreos/etcd:v3.5.18 \
       /usr/local/bin/etcd \
       --data-dir=/etcd-data \
       --listen-client-urls=http://0.0.0.0:2379 \
       --advertise-client-urls=http://0.0.0.0:2379 \
       --listen-peer-urls=http://0.0.0.0:2380 \
       --initial-advertise-peer-urls=http://0.0.0.0:2380 \
       --initial-cluster=default=http://0.0.0.0:2380
   ```

1. 验证 ETCD 服务器是否正在运行。

   ```
   $ curl -L http://localhost:2379/health
   ```

   ```
   {"health":"true"}
   ```

1. 在主机 1 上运行 nixlbench 基准测试。

   ```
   $ docker run -it --gpus all --network host nixlbench:latest \
       nixlbench --etcd_endpoints http://localhost:2379 \
       --backend LIBFABRIC \
       --initiator_seg_type VRAM
   ```

1. 在主机 2 上运行 nixlbench 基准测试。

   ```
   $ docker run -it --gpus all --network host nixlbench:latest \
       nixlbench --etcd_endpoints http://{{ETCD_SERVER_IP}}:2379 \
       --backend LIBFABRIC \
       --initiator_seg_type VRAM
   ```

------
#### [ Build from source ]

**重要**  
只有在步骤 6 中选择 “**从源代码构建**” 时，才遵循此选项卡。

**跨实例测试 EFA 和 NIXL 配置**

1. 选择两台主机来运行 nixlbench 基准测试。使用第一台主机的 IP 地址作为 ETCD 服务器 IP 进行元数据交换。

1. 在主机 1 上启动 ETCD 服务器。

   ```
   $ etcd --listen-client-urls "http://0.0.0.0:2379" \
       --advertise-client-urls "http://localhost:2379" &
   ```

1. 验证 ETCD 服务器是否正在运行。

   ```
   $ curl -L http://localhost:2379/health
   ```

   ```
   {"health":"true"}
   ```

1. 在主机 1 上运行 nixlbench 基准测试。

   ```
   $ export NIXL_LOG_LEVEL=INFO
   $ export LD_LIBRARY_PATH=$HOME/nixl/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH
   
   $ nixlbench \
       --etcd-endpoints http://localhost:2379 \
       --backend LIBFABRIC \
       --initiator_seg_type VRAM
   ```

1. 在主机 2 上运行 nixlbench 基准测试。

   ```
   $ export NIXL_LOG_LEVEL=INFO
   $ export LD_LIBRARY_PATH=$HOME/nixl/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH
   
   $ nixlbench \
       --etcd-endpoints http://{{ETCD_SERVER_IP}}:2379 \
       --backend LIBFABRIC \
       --initiator_seg_type VRAM
   ```

------

## 步骤 14：测试在 vlLM 上提供的分解推理（*可选*）
<a name="nixl-start-base-serve"></a>

安装 NIXL 后，您可以通过 LLM 推理和服务框架（例如 vLLM、SGLang 和 TensorRT-LLM）来使用 NIXL。

**使用 vLLM 为推理工作负载提供服务**

1. 安装 vLLM。

   ```
   $ pip install vllm
   ```

1. 使用 NIXL 启动 vLLM 服务器。以下示例命令为 NIXL 握手连接、KV 连接器、KV 角色和传输后端创建一个预填充（生产者）和一个解码（使用者）实例。有关详细的示例和脚本，请参阅 [NIXLConnector 使用指南](https://github.com/vllm-project/vllm/blob/2d977a7a9ead3179fde9ed55d69393ef7b6cec47/docs/features/nixl_connector_usage.md)。

   要将 NIXL 与 EFA 配合使用，请根据您的设置和使用案例设置环境变量。
   + 生产者（预填器）配置

     ```
     $ vllm serve {{your-application}} \
         --port 8200 \
         --enforce-eager \
         --kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_both","kv_buffer_device":"cuda","kv_connector_extra_config":{"backends":["LIBFABRIC"]}}'
     ```
   + 使用者（解码器）配置

     ```
     $ vllm serve {{your-application}} \
         --port 8200 \
         --enforce-eager \
         --kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_both","kv_buffer_device":"cuda","kv_connector_extra_config":{"backends":["LIBFABRIC"]}}'
     ```

   前面的示例配置设置了以下内容：
   + `kv_role` 到 `kv_both`，这就实现了对称功能，连接器既可以充当生产者，也可以充当使用者。这为没有预先确定角色区分的实验设置和方案提供了灵活性。
   + `kv_buffer_device` 到 `cuda`，这允许使用 GPU 内存。
   + NIXL 后端到 `LIBFABRIC`，这使得 NIXL 流量能够通过 EFA 传输。


# 开始使用 EFA 和 MPI 处理 Amazon EC2 上的 HPC 工作负载
<a name="efa-start"></a>

本教程可帮助您为 HPC 工作负载启动启用了 EFA 和 MPI 的实例集群。

**注意**  
`u7i-12tb.224xlarge`、`u7in-16tb.224xlarge`、`u7in-24tb.224xlarge`、和 `u7in-32tb.224xlarge` 实例使用 Open MPI 最多可以运行 128 个并行 MPI 进程，使用 Intel MPI 最多可以运行 256 个并行 MPI 进程。

**Topics**
+ [步骤 1：准备启用 EFA 的安全组](#efa-start-security)
+ [步骤 2：启动临时实例](#efa-start-tempinstance)
+ [步骤 3：安装 EFA 软件](#efa-start-enable)
+ [步骤 4：（*可选*）启用 Open MPI 5](#efa-start-ompi5)
+ [步骤 5：（*可选*）安装 Intel MPI](#efa-start-impi)
+ [步骤 6：禁用 Ptrace 保护](#efa-start-ptrace)
+ [第 7 步。确认安装](#efa-start-test)
+ [步骤 8：安装 HPC 应用程序](#efa-start-hpc-app)
+ [步骤 9：创建启用 EFA 的 AMI](#efa-start-ami)
+ [步骤 10：在集群置放群组中启动启用 EFA 的实例](#efa-start-instances)
+ [步骤 11：终止临时实例](#efa-start-terminate)
+ [步骤 12：启用无密码 SSH](#efa-start-passwordless)

## 步骤 1：准备启用 EFA 的安全组
<a name="efa-start-security"></a>

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

   1. 选择**Create security group**（创建安全组）。

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
<a name="efa-start-tempinstance"></a>

启动一个临时实例，可用于安装和配置 EFA 软件组件。您使用该实例创建一个启用了 EFA 的 AMI，您可以从中启动启用了 EFA 的实例。

**启动临时实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Instances**（实例），然后选择 **Launch Instances**（启动实例）以打开新的启动实例向导。

1. （*可选*）在 **Name and tags**（名称和标签）部分中，提供实例的名称，例如 `EFA-instance`。名称作为资源标签（`Name={{EFA-instance}}`）分配给实例。

1. 在 **Application and OS Images**（应用程序和操作系统映像）部分中，为其中一个[支持的操作系统](efa.md#efa-os)选择 AMI。

1. 在 **Instance type**（实例类型）部分中，选择 [supported instance type](efa.md#efa-instance-types)（支持的实例类型）。

1. 在 **Key pair**（密钥对）部分中，选择要用于实例的密钥对。

1. 在 **Network settings**（网络设置）部分中，请选择 **Edit**（编辑），然后执行以下操作：

   1. 对于**子网**，选择要在其中启动实例的子网。
**重要**  
必须选择子网。如果您未选择子网，则不能启用 EFA 的实例。

   1. 对于 **Firewall（security groups）**（防火墙（安全组）），请选择 **Select existing security group**（选择现有安全组），然后选择您在上一步中创建的安全组。

   1. 展开**高级网络配置**部分。

      对于**网络接口 1**，选择**网卡索引 = 0**、**设备索引 = 0**、**接口类型 = 带 ENA 的 EFA**。

      （可选）如果您使用的是多卡实例类型，例如 `p4d.24xlarge` 或 `p5.48xlarge`，则对于每个额外的网络接口，选择**添加网络接口**；对于**网卡索引**，选择下一个未使用的索引，然后选择**设备索引 = 1** 和**接口类型 = 带 ENA 的 EFA** 或**仅限 EFA**。

1. 在 **Storage**（存储）部分中，根据需要配置卷。

1. 在右侧的 **Summary**（摘要）面板中，选择 **Launch instance**（启动实例）。

**注意**  
考虑要求临时实例以及您将在[步骤 9](#efa-start-ami) 中创建的 AMI 使用 IMDSv2，[除非您已将 IMDSv2 设置为账户的默认值](configuring-IMDS-new-instances.md#set-imdsv2-account-defaults)。有关 IMDSv2 配置的更多信息，请参阅 [为新实例配置实例元数据选项](configuring-IMDS-new-instances.md)。

## 步骤 3：安装 EFA 软件
<a name="efa-start-enable"></a>

在临时实例上安装支持 EFA 所需的启用 EFA 的内核、EFA 驱动程序、Libfabric 和 Open MPI 堆栈。

根据您打算将 EFA 与 Open MPI、与 Intel MPI 还是同时与这两者结合使用，这些步骤有所不同。

**注意**  
Intel MPI 可能不支持部分操作系统。如果您使用的是 Intel MPI，请参阅 [Intel MPI 文档](https://www.intel.com/content/www/us/en/developer/articles/system-requirements/mpi-library-system-requirements.html)验证是否您的操作系统是否受支持。

**安装 EFA 软件**

1. 连接到您启动的实例。有关更多信息，请参阅 [使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)。

1. 为确保您的所有软件包都处于最新状态，请对您的实例执行快速软件更新。此过程可能需要几分钟时间。
   + Amazon Linux 2023、RHEL 8/9、Rocky Linux 8/9

     ```
     $ sudo yum update -y
     ```
   + Ubuntu 和 Debian

     ```
     $ sudo apt-get update && sudo apt-get upgrade -y
     ```
   + SUSE Linux Enterprise

     ```
     $ sudo zypper update -y
     ```

1. 重启实例并重新连接到它。

1. 下载 EFA 软件安装文件。软件安装文件将打包为压缩的 tarball（`.tar.gz`）文件。要下载最新的*稳定* 版本，请使用以下命令。

   您也可以通过将上面命令中的版本号替换为 `latest` 来获取最新版本。

   ```
   $ curl -O https://efa-installer.amazonaws.com/aws-efa-installer-1.50.0.tar.gz
   ```

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

   在基于 RPM 的系统（Amazon Linux、RHEL、Rocky Linux 和 SUSE）上，安装程序使用 `rpm --checksig` 来验证每个 RPM。在基于 DEB 的系统（Ubuntu、Debian）上，安装程序使用 GPG 签名验证来验证每个 DEB。

   如果任何软件包验证失败，安装将立即中止，从而保护您的系统免受损坏或恶意软件包的侵害。
**注意**  
`--check-signatures` 标记是可选的。若没有此项验证，安装程序不会执行个人签名验证。

1. 安装 EFA 软件。根据您的使用案例执行以下某种操作。
**注意**  
如果您完成了前一个可选步骤来设置软件包签名验证，请将 `--check-signatures` 附加到安装命令并使用 `sudo -E`，而不是 `sudo`。例如：`sudo -E ./efa_installer.sh -y --check-signatures`。
**注意**  
**在 SUSE Linux 操作系统下，EFA 不支持 NVIDIA GPUDirect**。如果使用的是 SUSE Linux 操作系统，则必须另外指定 `--skip-kmod` 选项来防止 kmod 安装。预设情况下，SUSE Linux 不允许树外的内核模块。

------
#### [ Open MPI and Intel MPI ]

   如果打算将 EFA 同时与 Open MPI 和 Intel MPI 结合使用，则必须安装 EFA 软件及 Libfabric 和 Open MPI，并且**必须完成步骤 5：安装 Intel MPI**。

   若要安装 EFA 软件以及 Libfabric 和 Open MPI，请运行以下命令。

**注意**  
从 EFA 1.30.0 开始，默认情况下会同时安装 Open MPI 4.1 和 Open MPI 5。您也可以指定要安装的 Open MPI 版本。要仅安装 Open MPI 4.1，请包含 `--mpi=openmpi4`。要仅安装 Open MPI 5，请指定 `--mpi=openmpi5`。要同时安装两者，请忽略 `--mpi` 选项。

   ```
   $ sudo ./efa_installer.sh -y
   ```

   Libfabric 已安装到 `/opt/amazon/efa`。Open MPI 4.1 会安装到 `/opt/amazon/openmpi`。Open MPI 5 已安装到 `/opt/amazon/openmpi5`。

------
#### [ Open MPI only ]

   如果打算将 EFA 与 Open MPI 结合使用，则必须安装 EFA 软件及 Libfabric 和 Open MPI，并且可以**跳过步骤 5：安装 Intel MPI**。若要安装 EFA 软件以及 Libfabric 和 Open MPI，请运行以下命令。

**注意**  
从 EFA 1.30.0 开始，默认情况下会同时安装 Open MPI 4.1 和 Open MPI 5。您也可以指定要安装的 Open MPI 版本。要仅安装 Open MPI 4.1，请包含 `--mpi=openmpi4`。要仅安装 Open MPI 5，请指定 `--mpi=openmpi5`。要同时安装两者，请忽略 `--mpi` 选项。

   ```
   $ sudo ./efa_installer.sh -y
   ```

   Libfabric 已安装到 `/opt/amazon/efa`。Open MPI 4.1 会安装到 `/opt/amazon/openmpi`。Open MPI 5 已安装到 `/opt/amazon/openmpi5`。

------
#### [ Intel MPI only ]

   如果您仅打算将 EFA 与 Intel MPI 结合使用，则可以安装 EFA 而不带 Libfabric 和 Open MPI。在这种情况下，Intel MPI 使用其嵌入式 Libfabric。如果选择执行此操作，则**必须完成步骤 5：安装 Intel MPI**。

   若要在没有 Libfabric 和 Open MPI 的情况下安装 EFA 软件，请运行以下命令。

   ```
   $ sudo ./efa_installer.sh -y --minimal
   ```

------

1. 如果 EFA 安装程序提示您重启实例，请执行此操作，然后重新连接到实例。否则，请注销实例，然后重新登录以完成安装。

1. 删除解压缩后的压缩包和压缩包本身。否则，这些内容将包含在您创建的启用 EFA 的 AMI 中，从而增加其大小。

## 步骤 4：（*可选*）启用 Open MPI 5
<a name="efa-start-ompi5"></a>

**注意**  
仅在打算使用 Open MPI 5 时执行此步骤。

从 EFA 1.30.0 开始，默认情况下会同时安装 Open MPI 4.1 和 Open MPI 5。您也可以选择仅安装 Open MPI 4.1 或 Open MPI 5。

如果在**步骤 3：安装 EFA 软件**中选择安装 Open MPI 5，并且打算使用该软件，则必须执行以下步骤才能将其启用。

**启用 Open MPI 5**

1. 将 Open MPI 5 添加到 PATH 环境变量中。

   ```
   $ module load openmpi5
   ```

1. 确认已启用 Open MPI 5 以供使用。

   ```
   $ which mpicc
   ```

   命令应返回 Open MPI 5 安装目录：`/opt/amazon/openmpi5`。

1. （*可选*）要确保每次启动实例时都将 Open MPI 5 添加到 PATH 环境变量中，请执行以下操作：

------
#### [ bash shell ]

   将 `module load openmpi5` 添加到 `/home/{{username}}/.bashrc` 和 `/home/{{username}}/.bash_profile`。

------
#### [ csh and tcsh shells ]

   将 `module load openmpi5` 添加到 `/home/{{username}}/.cshrc`。

------

如果需要从 PATH 环境变量中删除 Open MPI 5，请运行以下命令，并从 Shell 启动脚本中删除该命令。

```
$ module unload openmpi5
```

## 步骤 5：（*可选*）安装 Intel MPI
<a name="efa-start-impi"></a>

**重要**  
仅在您打算使用 Intel MPI 时执行此步骤。如果您仅打算使用 Open MPI，请跳过此步骤。

Intel MPI 需要使用额外的安装和环境变量配置。

**先决条件**  
确保执行以下步骤的用户具有 sudo 权限。

**安装 Intel MPI**

1. 要下载 Intel MPI 安装脚本，请执行以下操作

   1. 访问 [Intel 网站](https://www.intel.com/content/www/us/en/developer/articles/tool/oneapi-standalone-components.html#mpi)。

   1. 在网页的 **Intel MPI Library** 部分，选择 **Intel MPI Library for Linux** **Offline** 安装程序的链接。

1. 运行您在上一个步骤中下载的安装脚本。

   ```
   $ sudo bash {{installation_script_name}}.sh
   ```

1. 在安装程序中，选择 **Accept & install**（接受并安装）。

1. 阅读 Intel 改进计划，选择适当的选项，然后选择 **Begin Installation**（开始安装）。

1. 安装完成后，选择**关闭**。

1. 默认情况下，Intel MPI 使用其嵌入式（内部）Libfabric。您可以将 Intel MPI 配置为使用 EFA 安装程序附带的 Libfabric。通常，EFA 安装程序附带的 Libfabric 版本高于 Intel MPI。在某些情况下，EFA 安装程序附带的 Libfabric 比 Intel MPI 性能更强。要将 Intel MPI 配置为使用 EFA 安装程序附带的 Libfabric，请根据您的 Shell 执行以下操作之一。

------
#### [ bash shells ]

   将以下语句添加到 `/home/{{username}}/.bashrc` 和 `/home/{{username}}/.bash_profile`。

   ```
   export I_MPI_OFI_LIBRARY_INTERNAL=0
   ```

------
#### [ csh and tcsh shells ]

   将以下语句添加到 `/home/{{username}}/.cshrc`。

   ```
   setenv I_MPI_OFI_LIBRARY_INTERNAL 0
   ```

------

1. 将以下 **source** 命令添加到 Shell 脚本中，以从安装目录获取 `vars.sh` 脚本，以便在每次启动实例时设置编译器环境。根据您的 Shell 执行下列操作之一。

------
#### [ bash shells ]

   将以下语句添加到 `/home/{{username}}/.bashrc` 和 `/home/{{username}}/.bash_profile`。

   ```
   source /opt/intel/oneapi/mpi/latest/env/vars.sh
   ```

------
#### [ csh and tcsh shells ]

   将以下语句添加到 `/home/{{username}}/.cshrc`。

   ```
   source /opt/intel/oneapi/mpi/latest/env/vars.csh
   ```

------

1. 默认情况下，如果 EFA 因配置错误而不可用，Intel MPI 将默认为 TCP/IP 网络堆栈，这可能会导致应用程序性能下降。您可以通过将 `I_MPI_OFI_PROVIDER` 设置为 `efa` 来防止这种情况。如果 EFA 不可用，这将导致 Intel MPI 出现以下错误：

   ```
   Abort (XXXXXX) on node 0 (rank 0 in comm 0): Fatal error in PMPI_Init: OtherMPI error,
   MPIR_Init_thread (XXX)........:	
   MPID_Init (XXXX)..............:
   MPIDI_OFI_mpi_init_hook (XXXX):
   open_fabric (XXXX)............:
   find_provider (XXXX)..........:
   OFI fi_getinfo() failed (ofi_init.c:2684:find_provider:
   ```

   根据您的 Shell 执行下列操作之一。

------
#### [ bash shells ]

   将以下语句添加到 `/home/{{username}}/.bashrc` 和 `/home/{{username}}/.bash_profile`。

   ```
   export I_MPI_OFI_PROVIDER=efa
   ```

------
#### [ csh and tcsh shells ]

   将以下语句添加到 `/home/{{username}}/.cshrc`。

   ```
   setenv I_MPI_OFI_PROVIDER efa
   ```

------

1. 默认情况下，Intel MPI 不会输出调试信息。您可以指定不同的详细程度来控制调试信息。可能的值（按提供的详细信息量排列）包括：`0`（默认值）、`1`、`2`、`3`、`4`、`5`。`1` 级及以上将输出 `libfabric version` 和 `libfabric provider`。使用 `libfabric version` 查看 Intel MPI 使用的是内部 Libfabric，还是 EFA 安装程序附带的 Libfabric。如果使用的是内部 Libfabric，则该版本的后缀为 `impi`。使用 `libfabric provider` 查看 Intel MPI 使用的是 EFA，还是 TCP/IP 网络。如果使用的是 EFA，则值为 `efa`。如果使用的是 TCP/IP，则值为 `tcp;ofi_rxm`。

   要启用调试信息，请根据您的 Shell 执行以下操作之一。

------
#### [ bash shells ]

   将以下语句添加到 `/home/{{username}}/.bashrc` 和 `/home/{{username}}/.bash_profile`。

   ```
   export I_MPI_DEBUG={{value}}
   ```

------
#### [ csh and tcsh shells ]

   将以下语句添加到 `/home/{{username}}/.cshrc`。

   ```
   setenv I_MPI_DEBUG {{value}}
   ```

------

1. 默认情况下，Intel MPI 使用操作系统的共享内存 (`shm`) 进行节点内通信，且仅使用 Libfabric (`ofi`) 进行节点间通信。通常，此配置可提供最佳性能。但是，在某些情况下，Intel MPI shm 结构可能会导致某些应用程序无限期挂起。

   要解决此问题，您可以强制 Intel MPI 使用 Libfabric 进行节点内和节点间通信。为此，请根据您的 Shell 执行下列操作之一。

------
#### [ bash shells ]

   将以下语句添加到 `/home/{{username}}/.bashrc` 和 `/home/{{username}}/.bash_profile`。

   ```
   export I_MPI_FABRICS=ofi
   ```

------
#### [ csh and tcsh shells ]

   将以下语句添加到 `/home/{{username}}/.cshrc`。

   ```
   setenv I_MPI_FABRICS ofi
   ```

------
**注意**  
EFA Libfabric 提供程序使用操作系统的共享内存进行节点内通信。这意味着将 `I_MPI_FABRICS` 设置为 `ofi` 可产生与默认 `shm:ofi` 配置接近的性能。

1. 注销实例，然后重新登录。

如果您不再需要使用 Intel MPI，请从 Shell 启动脚本中删除环境变量。

## 步骤 6：禁用 Ptrace 保护
<a name="efa-start-ptrace"></a>

为了提高 HPC 应用程序的性能，当进程在同一实例上运行时，Libfabric 使用实例的本地内存进行进程间通信。

共享内存功能使用交叉内存附加 (CMA) 功能，但 *ptrace 保护*不支持该功能。如果您正在使用默认情况下启用 ptrace 保护的 Linux 发行版（例如 Ubuntu），则必须禁用它。如果您的 Linux 发行版默认未启用 ptrace 保护，请跳过此步骤。

**禁用 ptrace 保护**  
请执行下列操作之一：
+ 要临时禁用 ptrace 保护以进行测试，请运行以下命令。

  ```
  $ sudo sysctl -w kernel.yama.ptrace_scope=0
  ```
+ 要永久禁用 ptrace 保护，请将 `kernel.yama.ptrace_scope = 0` 添加到 `/etc/sysctl.d/10-ptrace.conf` 并重新启动实例。

## 第 7 步。确认安装
<a name="efa-start-test"></a>

**要确认安装成功**

1. 要确认 MPI 已成功安装，请运行以下命令：

   ```
   $ which mpicc
   ```
   + 对于 Open MPI，返回的路径应包括 `/opt/amazon/`
   + 对于 Intel MPI，返回的路径应包括 `/opt/intel/`。如果您没有得到预期的输出，请确保您已获取 Intel MPI `vars.sh` 脚本。

1. 要确认已成功安装 EFA 软件组件和 Libfabric，请运行以下命令。

   ```
   $ fi_info -p efa -t FI_EP_RDM
   ```

   该命令应返回有关 Libfabric EFA 接口的信息。以下示例显示了命令输出。

   ```
   provider: efa
       fabric: EFA-fe80::94:3dff:fe89:1b70
       domain: efa_0-rdm
       version: 2.0
       type: FI_EP_RDM
       protocol: FI_PROTO_EFA
   ```

## 步骤 8：安装 HPC 应用程序
<a name="efa-start-hpc-app"></a>

在临时实例上安装 HPC 应用程序。安装过程因特定的 HPC 应用程序而异。有关更多信息，请参阅*《Amazon Linux 2023 用户指南》*中的[管理操作系统更新](https://docs.aws.amazon.com/linux/al2023/ug/managing-repos-os-updates.html)部分。

**注意**  
请参阅 HPC 应用程序文档以了解安装说明。

## 步骤 9：创建启用 EFA 的 AMI
<a name="efa-start-ami"></a>

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

## 步骤 10：在集群置放群组中启动启用 EFA 的实例
<a name="efa-start-instances"></a>

使用在**步骤 7** 中创建的启用了 EFA 的 AMI 以及在**步骤 1** 中创建的启用了 EFA 的安全组，在集群置放群组中启动启用了 EFA 的实例。

**注意**  
在集群置放群组中启动启用了 EFA 的实例并不是一个绝对要求。不过，我们建议在集群置放群组中运行启用了 EFA 的实例，因为它在单个可用区的低延迟组中启动实例。
为了确保在扩展集群实例时容量可用，您可以为集群置放群组创建容量预留。有关更多信息，请参阅 [使用置放群组的容量预留](cr-cpg.md)。

**启动实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Instances**（实例），然后选择 **Launch Instances**（启动实例）以打开新的启动实例向导。

1. （*可选*）在 **Name and tags**（名称和标签）部分中，提供实例的名称，例如 `EFA-instance`。名称作为资源标签（`Name={{EFA-instance}}`）分配给实例。

1. 在 **Application and OS Images**（应用程序和操作系统映像）部分中，请选择 **My AMIs**（我的 AMI），然后选择您在上一步骤创建的 AMI。

1. 在 **Instance type**（实例类型）部分中，选择 [supported instance type](efa.md#efa-instance-types)（支持的实例类型）。

1. 在 **Key pair**（密钥对）部分中，选择要用于实例的密钥对。

1. 在 **Network settings**（网络设置）部分中，请选择 **Edit**（编辑），然后执行以下操作：

   1. 对于**子网**，选择要在其中启动实例的子网。
**重要**  
必须选择子网。如果您未选择子网，则不能启用 EFA 的实例。

   1. 对于 **Firewall（security groups）**（防火墙（安全组）），请选择 **Select existing security group**（选择现有安全组），然后选择您在上一步中创建的安全组。

   1. 展开**高级网络配置**部分。

      对于**网络接口 1**，选择**网卡索引 = 0**、**设备索引 = 0**、**接口类型 = 带 ENA 的 EFA**。

      （*可选*）如果您使用的是多卡实例类型，例如 `p4d.24xlarge` 或 `p5.48xlarge`，则对于每个额外的网络接口，选择**添加网络接口**；对于**网卡索引**，选择下一个未使用的索引，然后选择**设备索引 1** 和**接口类型 = 带 ENA 的 EFA** 或**仅限 EFA**。

1. （*可选*）在 **Storage**（存储）部分中，根据需要配置卷。

1. 在 **Advanced details**（高级详细信息）部分中，对于**置放群组名称**，选择要在其中启动实例的集群置放群组。如果您需要创建新的集群置放群组，请选择 **Create new placement group**（创建新置放群组）。

1. 在右侧的 **Summary**（摘要）面板中，为 **Number of instances**（实例数量）输入您要启动的启用了 EAA 的实例数量，然后选择 **Launch instance**（启动实例）。

## 步骤 11：终止临时实例
<a name="efa-start-terminate"></a>

此时，您已不再需要在[步骤 2](#efa-start-tempinstance) 中启动的实例。您可以终止实例以停止产生费用。

**终止临时实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择您创建的临时实例，然后依次选择**操作**、**实例状态**、**终止（删除）实例**。

1. 当系统提示您确认时，选择**终止（删除）**。

## 步骤 12：启用无密码 SSH
<a name="efa-start-passwordless"></a>

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
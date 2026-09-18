

# EC2 实例的 AMD 驱动程序
<a name="install-amd-driver"></a>

已挂载 AMD GPU 的实例（如 G4ad 实例）必须安装相应的 AMD 驱动程序。根据您的要求，您可以使用带有预装驱动程序的 AMI，也可以从 Amazon S3 下载驱动程序。

要在挂载 NVIDIA GPU 的实例（例如，G4dn 实例）上安装 NVIDIA 驱动程序，则请参阅[NVIDIA 驱动程序](install-nvidia-driver.md)。

**Contents**
+ [AMD Radeon Pro Software for Enterprise Driver](#amd-radeon-pro-software-for-enterprise-driver)
+ [安装了 AMD 驱动程序的 AMI](#preinstalled-amd-driver)
+ [AMD 驱动程序下载](#download-amd-driver)

## AMD Radeon Pro Software for Enterprise Driver
<a name="amd-radeon-pro-software-for-enterprise-driver"></a>

The AMD Radeon Pro Software for Enterprise Driver 旨在为专业级图形使用案例提供支持。使用驱动程序，您可以将实例配置为每个 GPU 两个 4K 显示。

**支持的 API**
+ OpenGL、OpenCL
+ Vulkan
+ AMD 高级媒体框架
+ 视频加速 API
+ DirectX 9 及更高版本
+ 微软硬件媒体平台变换

## 安装了 AMD 驱动程序的 AMI
<a name="preinstalled-amd-driver"></a>

AWS 提供安装的 AMD 驱动程序随附的不同亚马逊机器映像（AMI）。打开[使用 AMD 驱动程序的 Marketplace 产品](https://aws.amazon.com/marketplace/search/results?page=1&filters=VendorId&VendorId=e6a5002c-6dd0-4d1e-8196-0a1d1857229b&searchTerms=AMD+Radeon+Pro+Driver)。

## AMD 驱动程序下载
<a name="download-amd-driver"></a>

如果您使用的不是安装了 AMD 驱动程序的 AMI，则可以下载 AMD 驱动程序并将其安装在您的实例上。仅以下操作系统版本支持 AMD 驱动程序：
+ Amazon Linux 2 内核版本 5.10
+ Ubuntu 24.04
+ Windows Server 2016
+ Windows Server 2019
+ Windows Server 2022

这些下载仅供 AWS 客户使用。下载即表明您同意仅将下载的软件用于开发在 AMD Radeon Pro V520 硬件上使用的 AMIs。安装软件时，您需要遵循 [AMD 最终用户许可协议](https://www.amd.com/en/legal/eula.html)的条款。

### 在 Amazon Linux 2 Linux 实例上安装 AMD 驱动程序
<a name="install-amd-driver-linux-al2"></a>

1. 连接到 Linux 实例。

1. 在 Linux 实例上安装 AWS CLI 并配置默认凭证。有关更多信息，请参阅 *AWS Command Line Interface 用户指南*中的[安装 AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)。
**重要**  
用户或角色必须具有包含 **AmazonS3ReadOnlyAccess** 策略的授予权限。有关更多信息，请参阅《Amazon Simple Storage Service 用户指南》**中的 [AWS 托管式策略：AmazonS3ReadOnlyAccess](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-iam-awsmanpol.html#security-iam-awsmanpol-amazons3readonlyaccess)。

1. 安装 **gcc**、**make** 和 **dialog**（如果尚未安装）。

   ```
   $ sudo yum install -y gcc make dialog
   ```

1. 更新软件包缓存并获取实例软件包更新。

   ```
   $ sudo amazon-linux-extras install epel -y
   $ sudo yum update -y
   ```

1. 重启实例。

   ```
   $ sudo reboot
   ```

1. 在实例重启后重新连接到实例。

1. 下载最新的 AMD 驱动程序。

   ```
   $ aws s3 cp --recursive s3://ec2-amd-linux-drivers/latest/ .
   ```

1. 解压文件。

   ```
   $ tar -xzf amdgpu-pro-*rhel*.tar.gz
   ```

1. 安装 **amdgpu-install** 软件包。将 {{version}} 替换为在您解压缩驱动程序时创建的版本目录名称。

   ```
   $ cd rhel_7/{{version}}/x86_64/a/
   $ sudo yum install -y ./amdgpu-install-*.el7.noarch.rpm
   ```

1. 编辑 `/etc/yum.repos.d/amdgpu.repo`。将 `baseurl` 设置为解压缩的 `x86_64` 目录（例如 `baseurl=file:///home/ec2-user/rhel_7/{{version}}/x86_64/`）。设置 `gpgcheck=0`。

1. 编辑 `/etc/yum.repos.d/amdgpu-proprietary.repo`。将 `baseurl` 设置为同一目录。设置 `gpgcheck=0` 和 `enabled=1`。

1. 编辑 `/etc/yum.repos.d/rocm.repo`。将 `baseurl` 设置为同一目录。设置 `gpgcheck=0`。

1. 安装适用于 Amazon Linux 2 的 AMD GPU 驱动程序。

   ```
   $ sudo amdgpu-install --usecase=workstation --vulkan=pro --accept-eula -y
   ```

1. 重启实例。

   ```
   $ sudo reboot
   ```

1. 确认驱动程序正常运行。

   ```
   $ sudo dmesg | grep amdgpu
   ```

   该响应应当与以下内容相似：

   ```
   Initialized amdgpu
   ```

### 在 Ubuntu Linux 实例上安装 AMD 驱动程序
<a name="install-amd-driver-linux-ubuntu"></a>

1. 连接到 Linux 实例。

1. 更新软件包缓存并获取实例软件包更新。

   ```
   $ sudo apt-get update -y && sudo apt-get upgrade -y
   ```

1. 安装 Linux 固件和内核模块。

   ```
   $ sudo apt install -y linux-firmware linux-modules-extra-$(uname -r)
   ```

1. 重启实例。

   ```
   $ sudo reboot
   ```

1. 在实例重启后重新连接到实例。

1. 从 AMD 网站上的 [AMD Radeon™ 显卡 Linux® 驱动程序](https://www.amd.com/en/support/download/linux-drivers.html)下载适用于 Ubuntu 24.04 的最新 AMD 驱动程序包。在下面的命令中，将 {{version}} 替换为下载的文件名中的版本字符串（例如 `31.30.313000-1_all`）。

   ```
   $ sudo apt install -y ./amdgpu-install_{{version}}.deb
   ```

1. 安装适用于 Ubuntu 的 AMD GPU 驱动程序。

   ```
   $ sudo amdgpu-install --usecase=graphics --vulkan=radv -y
   ```

1. 重启实例。

   ```
   $ sudo reboot
   ```

1. 确认驱动程序正常运行。

   ```
   $ sudo dmesg | grep amdgpu
   ```

   该响应应当与以下内容相似：

   ```
   Initialized amdgpu
   ```

### 在 Windows 实例上安装 AMD 驱动程序
<a name="install-amd-driver-windows"></a>

1. 连接到您的 Windows 实例并打开 PowerShell 窗口。

1. 在 Windows 实例上配置 AWS Tools for Windows PowerShell 的默认凭证。有关更多信息，请参阅 *AWS Tools for Windows PowerShell 用户指南*中的 [AWS Tools for PowerShell 入门](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-getting-started.html)
**重要**  
用户或角色必须具有包含 **AmazonS3ReadOnlyAccess** 策略的授予权限。有关更多信息，请参阅《Amazon Simple Storage Service 用户指南》**中的 [AWS 托管式策略：AmazonS3ReadOnlyAccess](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-iam-awsmanpol.html#security-iam-awsmanpol-amazons3readonlyaccess)。

1. 根据您的 Windows 版本设置密钥前缀：
   + Windows 10 和 Windows 11

     ```
     $KeyPrefix = "latest/AMD_GPU_WINDOWS10"
     ```
   + Windows Server 2016

     ```
     $KeyPrefix = "archives"
     ```
   + Windows Server 2019

     ```
     $KeyPrefix = "latest/AMD_GPU_WINDOWS_2K19" # use "archives" for Windows Server 2016
     ```
   + Windows Server 2022

     ```
     $KeyPrefix = "latest/AMD_GPU_WINDOWS_2K22"
     ```

1. 使用以下 PowerShell 命令将驱动程序从 Amazon S3 下载到桌面。

   ```
   $Bucket = "ec2-amd-windows-drivers"
   $LocalPath = "$home\Desktop\AMD"
   $Objects = Get-S3Object -BucketName $Bucket -KeyPrefix $KeyPrefix -Region us-east-1
   foreach ($Object in $Objects) {
   $LocalFileName = $Object.Key
   if ($LocalFileName -ne '' -and $Object.Size -ne 0) {
       $LocalFilePath = Join-Path $LocalPath $LocalFileName
       Copy-S3Object -BucketName $Bucket -Key $Object.Key -LocalFile $LocalFilePath -Region us-east-1
       }
   }
   ```

1. 解压下载的驱动程序文件并使用以下 PowerShell 命令运行安装程序。

   ```
   Expand-Archive $LocalFilePath -DestinationPath "$home\Desktop\AMD\$KeyPrefix" -Verbose
   ```

   然后请检查新目录的内容。可以使用 `Get-ChildItem` PowerShell 命令检索目录名称。

   ```
   Get-ChildItem "$home\Desktop\AMD\$KeyPrefix"
   ```

   此输出应当类似于如下所示：

   ```
   Directory: C:\Users\Administrator\Desktop\AMD\latest
   
   Mode                LastWriteTime         Length Name
   ----                -------------         ------ ----
   d-----       10/13/2021  12:52 AM                210414a-365562C-Retail_End_User.2
   ```

   安装驱动程序：

   ```
   pnputil /add-driver $home\Desktop\AMD\$KeyPrefix\*.inf /install /subdirs
   ```

1. 按照说明安装驱动程序并根据需要重启实例。

1. 要验证 GPU 是否正常工作，请检查设备管理器。您应看到“AMD Radeon Pro V520 MxGPU”作为显示适配器列出。

1. 请设置高性能显示协议 [Amazon DCV](https://docs.aws.amazon.com/dcv/)，从而有助于利用四个高达 4K 分辨率的显示器的优势。
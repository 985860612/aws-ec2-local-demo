

# 在 EC2 Windows 实例上安装 ENA 驱动程序
<a name="ena-adapter-driver-install-upgrade-win"></a>

如果实例并非基于 Amazon 提供的最新 Windows 亚马逊机器映像（AMI）中的一种，请使用以下步骤在您的实例上安装当前 ENA 驱动程序。您应该在方便重启实例的时候执行该更新。如果安装脚本没有自动重启实例，我们建议您最后再重启实例。

如果您在实例运行期间使用实例存储卷来存储数据，则当您停止该实例时，该数据将被擦除。在停止实例之前，请首先确认您是否已将所需数据从实例存储卷复制到持久性存储，例如 Amazon EBS 或 Amazon S3。

## 先决条件
<a name="ena-driver-install-prereq-win"></a>

要安装或升级 ENA 驱动程序，Windows 实例必须满足以下先决条件：
+ 已安装 PowerShell 3.0 或更高版本。
+ 本节中显示的命令必须在 64 位版本的 PowerShell 中运行。不要使用 `x86` 版本的 PowerShell。这是 32 位版本的 shell，不支持这些命令。

## 第 1 步：备份数据
<a name="ena-driver-install-step1-backup-win"></a>

我们建议您创建备份 AMI，以备在无法通过**设备管理器**回滚更改时使用。要使用 AWS 管理控制台创建备份 AMI，请执行以下步骤：

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择需要升级驱动程序的实例，然后从**实例状态**菜单中选择**停止实例**。

1. 在实例停止后再次选择该实例。要创建备份，请从**操作**菜单中选择**映像和模板**，然后选择**创建映像**。

1. 要重启实例，请从**实例状态**菜单中选择**启动实例**。

## 第 2 步：安装或升级 ENA 驱动程序
<a name="ena-driver-install-step2-install-win"></a>

您可以使用 AWS Systems Manager Distributor 或 PowerShell cmdlet 安装或升级 ENA 驱动程序。有关进一步的说明，请选择您要使用的方法对应的选项卡。

------
#### [ Systems Manager Distributor ]

您可以使用 Systems Manager Distributor 功能将程序包部署到 Systems Manager 托管式节点。使用 Systems Manager Distributor 时，您可以一次性安装 ENA 驱动程序包，也可以通过计划更新来安装。有关如何使用 Systems Manager Distributor 安装 ENA 驱动程序包 (`AwsEnaNetworkDriver`) 的更多信息，请参阅《AWS Systems Manager 用户指南》中的 [安装或更新程序包](https://docs.aws.amazon.com/systems-manager/latest/userguide/distributor-working-with-packages-deploy.html)**。

------
#### [ PowerShell ]

本节介绍了如何在实例上使用 PowerShell cmdlet 下载和安装 ENA 驱动程序包。

**选项 1：下载并解压缩最新版本**

1. 连接到您的实例并以本地管理员身份登录。

1. 使用 **invoke-webrequest** cmdlet 下载最新驱动程序包：

   ```
   PS C:\> invoke-webrequest https://ec2-windows-drivers-downloads.s3.amazonaws.com/ENA/Latest/AwsEnaNetworkDriver.zip -outfile {{$env:USERPROFILE\AwsEnaNetworkDriver.zip}}
   ```
**注意**  
如果您在下载文件时收到错误，并且正在使用 Windows Server 2016 或更早的版本，则可能需要为 PowerShell 终端启用 TLS 1.2。可以使用以下命令为当前 PowerShell 会话启用 TLS 1.2，然后重试：  

   ```
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
   ```
您还可以在实例上通过浏览器窗口下载最新驱动程序包。

1. 使用 **expand-archive** cmdlet 将您下载的 zip 存档文件提取到您的实例上：

   ```
   PS C:\> expand-archive {{$env:userprofile\AwsEnaNetworkDriver.zip}} -DestinationPath {{$env:userprofile\AwsEnaNetworkDriver}}
   ```

**选项 2：下载并解压缩特定版本**

1. 连接到您的实例并以本地管理员身份登录。

1. 利用 [ENA Windows 驱动程序版本历史记录](ena-driver-releases-windows.md#ena-win-driver-release-history) 表中的版本链接下载所需特定版本的 ENA 驱动程序包。

1. 将 zip 存档文件提取到您的实例。

**使用 PowerShell 安装 ENA 驱动程序**  
无论您下载的是最新版本还是特定版本的驱动程序，安装步骤都一样。要安装 ENA 驱动程序，请按照以下步骤操作。

1. 要安装驱动程序，请从实例上的 `AwsEnaNetworkDriver` 目录运行 `install.ps1` PowerShell 脚本。如果出现错误，请确保您使用的是 PowerShell 3.0 或更高版本。

1. 如果安装程序没有自动重启实例，请运行 **Restart-Computer** PowerShell cmdlet。

   ```
   PS C:\> Restart-Computer
   ```

------

## 第 3 步（可选）：安装后验证 ENA 驱动程序版本
<a name="ena-driver-install-step3-verify-win"></a>

为确保已在实例上成功安装 ENA 驱动程序包，您可以按如下方式验证新版本：

1. 连接到您的实例并以本地管理员身份登录。

1. 要打开 Windows 设备管理器，请在 **Run**（运行）框中输入 `devmgmt.msc`。

1. 选择**确定**。这将打开 Device Manager（设备管理器）窗口。

1. 选择 **Network adapters**（网络适配器）左侧的箭头以展开列表。

1. 选择名称或打开 **Amazon Elastic Network Adapter** 的上下文菜单，然后选择 **Properties**（属性）。这将打开 **Amazon 弹性网络适配器属性**对话框。
**注意**  
所有 ENA 适配器都使用相同的驱动程序。如果您有多个 ENA 适配器，选择其中任何一个即可更新所有 ENA 适配器的驱动程序。

1. 要验证已安装的当前版本，请打开**驱动程序**选项卡，然后检查**驱动程序版本**。如果当前版本与您的目标版本不符，请参阅 [对弹性网络适配器 Windows 驱动程序进行问题排查](troubleshoot-ena-driver.md)。

## 回滚 ENA 驱动程序安装
<a name="ena-driver-install-roll-back-win"></a>

如果安装出现任何问题，则可能需要回滚驱动程序。按照以下步骤回滚在实例上安装的先前版本的 ENA 驱动程序。

1. 连接到您的实例并以本地管理员身份登录。

1. 要打开 Windows 设备管理器，请在 **Run**（运行）框中输入 `devmgmt.msc`。

1. 选择**确定**。这将打开 Device Manager（设备管理器）窗口。

1. 选择 **Network adapters**（网络适配器）左侧的箭头以展开列表。

1. 选择名称或打开 **Amazon Elastic Network Adapter** 的上下文菜单，然后选择 **Properties**（属性）。这将打开 **Amazon 弹性网络适配器属性**对话框。
**注意**  
所有 ENA 适配器都使用相同的驱动程序。如果您有多个 ENA 适配器，选择其中任何一个即可更新所有 ENA 适配器的驱动程序。

1. 要回滚驱动程序，请打开**驱动程序**选项卡，然后选择**回滚驱动程序**。这将打开**驱动程序包回滚**窗口。
**注意**  
如果**驱动程序**选项卡未显示**回滚驱动程序**操作，或者该操作不可用，则表示实例上的[驱动程序存储](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/driver-store)不包含之前安装的驱动程序包。要解决此问题，请参阅 [诊断场景](troubleshoot-ena-driver.md#ts-ena-drv-scenarios) 并展开**安装了意外的 ENA 驱动程序版本**部分。有关设备驱动程序包选择过程的更多信息，请参阅《Microsoft 文档网站》上的 [Windows 如何为设备选择驱动程序包](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/how-windows-selects-a-driver-for-a-device)**。
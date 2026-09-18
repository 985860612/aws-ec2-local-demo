

# 安装最新版本的 EC2Launch v2
<a name="ec2launch-v2-install"></a>

您可以使用以下方法之一，在您的 EC2 实例上安装 EC2Launch v2 代理：
+ 从 Amazon S3 下载代理并使用 Windows PowerShell 进行安装。有关下载 URL，请参阅 [在 Amazon S3 上下载 EC2Launch v2](#lv2-download-s3)。
+ 使用 SSM 分发服务器安装。
+ 创建自定义映像时，从 EC2 Image Builder 组件安装。
+ 从预安装了 EC2Launch v2 的 AMI 启动您的实例。

**警告**  
AmazonEC2Launch.msi 不会卸载先前版本的 EC2 启动服务，如 EC2Launch (v1) 和 EC2Config。

有关安装步骤，请选择与您的首选方法相匹配的选项卡。

------
#### [ PowerShell ]

要使用 Windows PowerShell 安装最新版本的 EC2Launch v2 代理，请按照以下步骤操作。

1. 创建本地目录。

   ```
   New-Item -Path "$env:USERPROFILE\Desktop\EC2Launchv2" -ItemType Directory
   ```

1. 设置下载位置的 URL。使用您将使用的 Amazon S3 URL 运行以下命令。有关下载 URL，请参阅 [在 Amazon S3 上下载 EC2Launch v2](#lv2-download-s3)

   ```
   $Url = "{{Amazon S3 URL}}/AmazonEC2Launch.msi"
   ```

1. 使用以下混合命令下载代理并运行安装 

   ```
   $DownloadFile = "$env:USERPROFILE\Desktop\EC2Launchv2\" + $(Split-Path -Path $Url -Leaf)
   Invoke-WebRequest -Uri $Url -OutFile $DownloadFile
   msiexec /i "$DownloadFile"
   ```
**注意**  
如果您在下载文件时收到错误，并且正在使用 Windows Server 2016 或更早的版本，则可能需要为 PowerShell 终端启用 TLS 1.2。可以使用以下命令为当前 PowerShell 会话启用 TLS 1.2，然后重试：  

   ```
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
   ```

1. **msiexec** 命令在 Windows Server 实例上的以下位置安装 EC2Launch v2：`%ProgramFiles%\Amazon\EC2Launch`。要验证安装是否已运行，可以检查实例上的本地文件系统。

------
#### [ AWS Systems Manager Distributor ]

要使用 AWS Systems Manager 快速设置功能为 EC2Launch v2 配置自动更新，请参阅 [使用 Distributor 快速设置功能自动安装和更新 EC2Launch v2](#lv2-distributor-quick-setup)。

也可以从 AWS Systems Manager Distributor 处一次性安装 `AWSEC2Launch-Agent` 软件包。有关如何从系统管理器分发服务器安装软件包的说明，请参阅《AWS Systems Manager 用户指南》**中的[安装或更新软件包](https://docs.aws.amazon.com/systems-manager/latest/userguide/distributor-working-with-packages-deploy.html)。

------
#### [ EC2 Image Builder component ]

您可以在使用 EC2 Image Builder 构建自定义映像时安装 `ec2launch-v2-windows` 组件。有关如何使用 EC2 Image Builder 构建自定义映像的说明，请参阅 *EC2 Image Builder 用户指南*中的[使用 EC2 Image Builder 控制台创建映像管道向导](https://docs.aws.amazon.com/imagebuilder/latest/userguide/start-build-image-pipeline.html)。

------
#### [ AMI ]

EC2Launch v2 默认预安装在 Windows Server 2022 及更高版本操作系统的 AMI 上：
+ Windows\_Server-{{版本}}-English-Full-Base
+ Windows\_Server-{{版本}}-English-Core-Base
+ Windows\_Server-{{版本}}-English-Core-EKS\_Optimized
+ 具有所有其他语言的 Windows Server {{版本}}
+ 安装了 SQL 的 Windows Server {{版本}}

以下 Windows Server AMI 上也预装了 EC2Launch v2。您可以在 Amazon EC2 控制台上查找这些 AMI，也可以通过使用以下搜索前缀查找：`EC2LaunchV2-` 在 AWS CLI 中
+ EC2LaunchV2-Windows\_Server-2019-English-Core-Base
+ EC2LaunchV2-Windows\_Server-2019-English-Full-Base
+ EC2LaunchV2-Windows\_Server-2016-English-Core-Base
+ EC2LaunchV2-Windows\_Server-2016-English-Full-Base

------

## 使用 AWS Systems Manager Distributor 快速设置功能自动安装和更新 EC2Launch v2
<a name="lv2-distributor-quick-setup"></a>

使用 AWS Systems Manager Distributor 快速设置功能，可以为 EC2Launch v2 设置自动更新。以下过程可在您的实例上设置 Systems Manager 关联，该关联以您指定的频率自动更新 EC2Launch v2 代理。Distributor 快速设置功能创建的关联可包括 AWS 账户 和区域内的实例，也可以包括 AWS 组织内的实例。有关设置组织的更多信息，请参阅《*AWS Organizations 用户指南*》中的[教程：创建和配置组织](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_tutorials_basic.html)。

开始之前，请确保实例满足所有先决条件。

### 先决条件
<a name="lv2-distributor-quickset-prereq"></a>

要使用 Distributor 快速设置功能设置自动更新，实例必须满足以下先决条件。
+ 至少有一个支持 EC2Launch v2 的正在运行的实例。请参阅 [EC2Launch v2](ec2launch-v2.md) 支持的操作系统。
+ 已在实例上执行了 Systems Manager 设置任务。有关更多信息，请参阅《*AWS Systems Manager 用户指南*》中的[设置 Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-ec2.html)。
+ EC2Launch v2 必须是实例上安装的唯一启动代理。如果安装了多个启动代理，则 Distributor 快速设置功能配置将失败。在使用 Distributor 快速设置功能配置 EC2Launch v2 之前，请卸载 EC2Config 或 EC2Launch v1 启动代理（如果存在）。

### 为 EC2Launch v2 配置 Distributor 快速设置功能
<a name="lv2-distributor-quickset-config"></a>

要使用 Distributor 快速设置功能为 EC2Launch v2 创建配置，请在完成 [Distributor 包部署](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-distributor.html)步骤时使用以下设置：
+ **软件包：**Amazon EC2Launch v2 代理。
+ **更新频率：**从列表中选择一个频率。
+ **目标：**从可用的部署选项中进行选择。

要检查配置的状态，请导航至 AWS 管理控制台 中的 Systems Manager 快速设置功能**配置**选项卡。

1. 访问 [https://console.aws.amazon.com/systems-manager/](https://console.aws.amazon.com/systems-manager/)，打开 AWS Systems Manager 控制台。

1. 在导航窗格中，选择**快速设置**。

1. 在**配置**选项卡中，选择与您创建的配置关联的行。**配置**选项卡列出了您的配置，并包括关键详细信息的摘要，例如**区域**、**部署状态**和**关联状态**。
**注意**  
每个 EC2Launch v2 Distributor 配置的关联名称都以以下前缀开头：`AWS-QuickSetup-Distributor-EC2Launch-Agent-`。

1. 要查看详细信息，请选择配置，然后选择**查看详细信息**。

有关更多信息和故障排除步骤，请参阅《*AWS Systems Manager 用户指南》*中的[对快速设置结果进行故障排除](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-results-troubleshooting.html)。

## 在 Amazon S3 上下载 EC2Launch v2
<a name="lv2-download-s3"></a>

要安装最新版本的 EC2Launch v2，请从以下位置下载安装程序：
+ [https://s3.amazonaws.com/amazon-ec2launch-v2/windows/amd64/latest/AmazonEC2Launch.msi](https://s3.amazonaws.com/amazon-ec2launch-v2/windows/amd64/latest/AmazonEC2Launch.msi)

## 配置安装选项
<a name="lv2-configure-install"></a>

安装或升级 EC2Launch v2 时，可以使用 EC2Launch v2 安装对话框或命令行 shell 中的 **msiexec** 命令配置安装选项。

EC2Launch v2 安装程序首次在实例上运行时，它会按照以下方式初始化实例上的启动代理设置：
+ 它会创建本地路径并将启动代理文件写入其中。这有时被称为*净安装*。
+ 它创建了 `EC2LAUNCH_TELEMETRY` 环境变量（如果还不存在），然后根据您的配置进行设置。

有关配置详细信息，请选择与您将使用的配置方法相匹配的选项卡。

------
#### [ Amazon EC2Launch Setup dialog ]

安装或升级 EC2Launch v2 时，可以使用 EC2Launch v2 安装对话框配置以下安装选项。**基本安装**选项

**发送遥测**  
当您在设置对话框中包含此功能时，安装程序会将 `EC2LAUNCH_TELEMETRY` 环境变量的值设置为 `1`。如果您禁用**发送遥测**，安装程序会将环境变量的值设置为 `0`。  
当 EC2Launch v2 代理运行时，它会读取 `EC2LAUNCH_TELEMETRY` 环境变量，用于确定是否上传遥测数据。如果值等于 `1`，它会上传数据。否则，它不会上传。

**默认配置**  
EC2Launch v2 的默认配置为：如果本地启动代理已经存在，则将其覆盖。首次在实例上运行安装时，默认配置会执行净安装。如果您在初次安装时禁用默认配置，则安装将失败。  
如果您在实例上再次运行安装程序，则可以禁用默认配置，以执行不取代 `%ProgramData%/Amazon/EC2Launch/config/agent-config.yml` 文件的升级。

**示例：使用遥测升级 EC2Launch v2**  
以下示例显示了配置为升级当前安装并启用遥测的 EC2Launch v2 设置对话框。此配置在不替换代理配置文件的情况下执行安装程序，并将 `EC2LAUNCH_TELEMETRY` 环境变量设置为值 `1`。

![EC2Launch v2 升级配置。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2launchv2-clean-default-config.png)


------
#### [ Command line ]

安装或升级 EC2Launch v2 时，可以使用命令行 Shell 中的 **msiexec** 命令配置以下安装选项。`ADDLOCAL`参数值

**基本**（必需）  
安装启动代理。如果此值不存在于 `ADDLOCAL` 参数，安装将结束。

**清除**  
当您将 `Clean` 值包含在 `ADDLOCAL` 参数中，安装程序会将代理配置文件写入以下位置：`%ProgramData%/Amazon/EC2Launch/config/agent-config.yml`。如果代理配置文件已经存在，它会覆盖该文件。  
当您留下 `ADDLOCAL` 参数中的 `Clean` 值，安装程序执行的升级不会替换代理配置文件。

**遥测**  
当您在 `ADDLOCAL` 中包含 `Telemetry` 值，安装程序会将 `EC2LAUNCH_TELEMETRY` 环境变量的值设置为 `1`。  
当您留下 `ADDLOCAL` 参数中的 `Telemetry` 值，安装程序会将环境变量的值设置为 `0`。  
当 EC2Launch v2 代理运行时，它会读取 `EC2LAUNCH_TELEMETRY` 环境变量，用于确定是否上传遥测数据。如果值等于 `1`，它会上传数据。否则，它不会上传。

**示例：安装带有遥测功能的 EC2Launch v**

```
& msiexec /i "C:\Users\Administrator\Desktop\EC2Launchv2\AmazonEC2Launch.msi" ADDLOCAL="Basic,Clean,Telemetry" /q
```

------

## 验证 EC2Launch v2 版本
<a name="lv2-verify-version"></a>

使用以下过程之一验证您的实例上安装的 EC2Launch v2 版本。



------
#### [ PowerShell ]

使用 Windows PowerShell 验证已安装的 EC2Launch v2 版本，如下所示。

1. 从 AMI 启动实例并连接到该实例。

1. 使用以下 PowerShell 中的命令验证已安装的 EC2Launch v2 版本：

   ```
   & "C:\Program Files\Amazon\EC2Launch\EC2Launch.exe" version
   ```

------
#### [ Windows Control Panel ]

验证 Windows 控制面板中安装的 EC2Launch v2 版本，如下所示。

1. 从 AMI 启动实例并连接到该实例。

1. 打开 Windows 控制面板，然后选择**程序和功能**。

1. 在已安装程序的列表中查找 `Amazon EC2Launch`。其版本号会显示在 **Version (版本)** 列中。

------

要查看 AWS Windows AMI 的最近更新，请参阅《AWS Windows AMI 参考》中的 [Windows AMI version history](https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/ec2-windows-ami-version-history.html)**。

有关 EC2Launch v2 的最新版本，请参阅 [EC2Launch v2 版本历史记录](ec2launchv2-versions.md#ec2launchv2-version-history)。

您可在 EC2Launch v2 服务的新版本发布时收到通知。有关更多信息，请参阅 [订阅 EC2 Windows 启动代理通知](launch-agents-subscribe-notifications.md)。
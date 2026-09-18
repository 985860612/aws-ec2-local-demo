

# 安装最新版的 EC2Config
<a name="UsingConfig_Install"></a>

**注意**  
Windows Server 2022 及更高版本操作系统的最新启动代理是 [EC2Launch v2](ec2launch-v2.md)，其取代了 EC2Config 和 EC2Launch。EC2Launch v2 预装在 AWS Windows Server 2022 和 2025 AMI 中。您也可以在 Windows Server 2016 和 2019 上手动安装和配置代理。有关更多信息，请参阅 [安装 EC2Launch v2](ec2launch-v2-install.md)。

有关如何接收 EC2Config 更新通知的信息，请参阅[订阅 EC2 Windows 启动代理通知](launch-agents-subscribe-notifications.md)。有关每个版本中的更改的信息，请参阅[EC2Config 版本历史记录](ec2config-version-details.md)。

## 开始前的准备工作
<a name="ec2config-prereqs"></a>
+ 确认您有 .NET Framework 3.5 SP1 或更高版本。
+ 默认情况下，安装程序会在安装期间用默认设置文件替换您的设置文件，并在安装完成时重启 EC2Config 服务。如果您更改了 EC2Config 服务设置，请从 `config.xml` 目录中复制 `%Program Files%\Amazon\Ec2ConfigService\Settings` 文件。在更新 EC2Config 服务后，可以还原此文件来保留您的配置更改。

## 验证 EC2Config 版本
<a name="ec2config-verify-version"></a>

使用以下过程验证您的实例上安装的 EC2Config 版本。

**验证安装的 EC2Config 版本**

1. 从 AMI 启动实例并连接到该实例。

1. 在控制面板中，选择 **Programs and Features (程序和功能)**。

1. 在已安装程序的列表中查找 `Ec2ConfigService`。其版本号会显示在 **Version (版本)** 列中。

## 更新 EC2Config
<a name="ec2config-update-version"></a>

使用以下过程在实例上下载并安装最新版本的 EC2Config。

**下载并安装最新版本的 EC2Config**

1. 下载并解压缩 [EC2Config 安装程序](https://s3.amazonaws.com/ec2-downloads-windows/EC2Config/EC2Install.zip)。

1. 运行 `EC2Install.exe`。有关选项的完整列表，请使用 `EC2Install` 选项运行 `/?`。默认情况下，安装程序会显示提示。要运行该命令而不显示提示，请使用 `/quiet` 选项。
**重要**  
要保持您保存的 `config.xml` 文件提供自定义设置，请使用 `EC2Install` 选项运行 `/norestart`，还原您的设置，然后手动重启 EC2Config 服务。

1. 如果您运行的是 EC2Config 版本 4.0 或更高版本，则您必须从 Microsoft Services 管理单元重新启动实例上的 SSM Agent。
**注意**  
在重启或停止并启动实例前，实例系统日志或 Trusted Advisor 检查中不会显示更新的 EC2Config 版本信息。

**要使用 PowerShell 下载并安装最新版本的 EC2Config**  
要使用 PowerShell 下载、解压缩并安装最新版本的 EC2Config，请在 PowerShell 窗口中运行以下命令：

```
$Url = "https://s3.amazonaws.com/ec2-downloads-windows/EC2Config/EC2Install.zip"
$DownloadZipFile = "$env:USERPROFILE\Desktop\" + $(Split-Path -Path $Url -Leaf)
$ExtractPath = "$env:USERPROFILE\Desktop\"
Invoke-WebRequest -Uri $Url -OutFile $DownloadZipFile
$ExtractShell = New-Object -ComObject Shell.Application 
$ExtractFiles = $ExtractShell.Namespace($DownloadZipFile).Items() 
$ExtractShell.NameSpace($ExtractPath).CopyHere($ExtractFiles) 
Start-Process $ExtractPath
Start-Process `
    -FilePath $env:USERPROFILE\Desktop\EC2Install.exe `
    -ArgumentList "/S"
```

**注意**  
如果您在下载文件时收到错误，并且正在使用 Windows Server 2016 或更早的版本，则可能需要为 PowerShell 终端启用 TLS 1.2。可以使用以下命令为当前 PowerShell 会话启用 TLS 1.2，然后重试：  

```
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
```

通过检查 `Ec2ConfigService` 目录的 `C:\Program Files\Amazon\` 来验证安装。
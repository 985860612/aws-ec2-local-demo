

# 安装最新版本的 EC2Launch
<a name="ec2launch-download"></a>

使用以下过程在实例上下载并安装最新版本的 EC2Launch。

**下载并安装最新版本的 EC2Launch**

1. 如果已在实例上安装和配置 EC2Launch，请备份 EC2Launch 配置文件。安装过程不保留此文件中的更改。默认情况下，该文件位于以下 `C:\ProgramData\Amazon\EC2-Windows\Launch\Config` 目录中。

1. 将 [EC2-Windows-Launch.zip](https://s3.amazonaws.com/ec2-downloads-windows/EC2Launch/latest/EC2-Windows-Launch.zip) 下载到实例上的一个目录中。

1. 将 [install.ps1](https://s3.amazonaws.com/ec2-downloads-windows/EC2Launch/latest/install.ps1) 下载到 `EC2-Windows-Launch.zip` 的下载目录中。

1. 运行 `install.ps1`

1. 如果您对 EC2Launch 配置文件进行了备份，则将其复制到 `C:\ProgramData\Amazon\EC2-Windows\Launch\Config` 目录。

**要使用 PowerShell 下载并安装最新版本的 EC2Launch**  
如果已在实例上安装和配置 EC2Launch，请备份 EC2Launch 配置文件。安装过程不保留此文件中的更改。默认情况下，该文件位于以下 `C:\ProgramData\Amazon\EC2-Windows\Launch\Config` 目录中。

要使用 PowerShell 安装最新版本的 EC2Launch，请以管理员身份在 PowerShell 窗口中运行以下命令：

```
mkdir $env:USERPROFILE\Desktop\EC2Launch
$Url = "https://s3.amazonaws.com/ec2-downloads-windows/EC2Launch/latest/EC2-Windows-Launch.zip"
$DownloadZipFile = "$env:USERPROFILE\Desktop\EC2Launch\" + $(Split-Path -Path $Url -Leaf)
Invoke-WebRequest -Uri $Url -OutFile $DownloadZipFile
$Url = "https://s3.amazonaws.com/ec2-downloads-windows/EC2Launch/latest/install.ps1"
$DownloadZipFile = "$env:USERPROFILE\Desktop\EC2Launch\" + $(Split-Path -Path $Url -Leaf)
Invoke-WebRequest -Uri $Url -OutFile $DownloadZipFile
& $env:USERPROFILE\Desktop\EC2Launch\install.ps1
```

**注意**  
如果您在下载文件时收到错误，并且正在使用 Windows Server 2016，则可能需要为 PowerShell 终端启用 TLS 1.2。可以使用以下命令为当前 PowerShell 会话启用 TLS 1.2，然后重试：  

```
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
```

通过检查启动代理来验证安装。以管理员身份在 PowerShell 窗口运行以下命令：

```
Import-Module C:\ProgramData\Amazon\EC2-Windows\Launch\Module\Ec2Launch.psm1
Import-LocalizedData -BaseDirectory C:\ProgramData\Amazon\EC2-Windows\Launch\Module\ -FileName 'Ec2Launch.psd1' -BindingVariable moduleManifest
$moduleManifest.Get_Item('ModuleVersion')
```
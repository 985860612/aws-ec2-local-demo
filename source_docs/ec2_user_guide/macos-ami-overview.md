

# Amazon EC2 macOS AMI 发布说明
<a name="macos-ami-overview"></a>

以下信息提供了有关 EC2 macOS AMI 中默认包含的软件包的详细信息，并汇总了每个 EC2 macOS AMI 版本的更改。

有关如何订阅 macOS AMI 通知的信息，请参阅 [订阅 macOS AMI 通知](macos-subscribe-notifications.md)。

Mac 实例可运行以下操作系统之一：
+ macOS Mojave（版本 10.14）（仅限 x86 Mac 实例）
+ macOS Catalina（版本 10.15）（仅限 x86 Mac 实例）
+ macOS Big Sur（版本 11）（x86 和 M1 Mac 实例）
+ macOS Monterey（版本 12）（x86 和 M1 Mac 实例）
+ macOS Ventura（版本 13）（所有 Mac 实例、M2 和 M2 Pro Mac 实例均支持 macOS Ventura 版本 13.2 或更高版本）
+ macOS Sonoma（版本 14）（所有 Mac 实例）
+ macOS Sequoia（版本 15）（所有 Mac 实例）
**注意**  
M4 和 M4 Pro Mac 实例支持 macOS Sequoia 版本 15.6 或更高版本。

## 批准用于 macOS Sequoia 的本地网络隐私策略
<a name="macos-sequoia-lnp"></a>

macOS Sequoia（版本 15）具有一项新的本地网络隐私功能，该功能会影响基于本地 IP 的服务（包括 Amazon EC2 实例元数据服务（IMDS））的用户。

**重要**  
为确保您可以不间断地访问基于本地 IP 的服务，请使用以下步骤批准本地网络隐私策略。

**若要批准本地网络隐私策略**

1. [连接到您实例的图形用户界面（GUI）](connect-to-mac-instance.md#mac-instance-vnc).

1. 按照屏幕上的提示批准本地网络隐私策略。

1. 批准策略后，请创建您的 EC2 Mac 实例的 AMI。有关更多信息，请参阅 [创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。

从新创建的 AMI 启动的任何 EC2 Mac 实例都将保留本地网络隐私权限。

## Amazon EC2 macOS AMI 中包含的默认软件包
<a name="macos-ami-default-packages"></a>

下表描述了 EC2 macOS AMI 中默认包含的软件包。


| 软件包 | 发行说明 | 
| --- | --- | 
| EC2 macOS Init | [https://github.com/aws/ec2-macos-init/tags](https://github.com/aws/ec2-macos-init/tags) | 
| EC2 macOS Utils | [https://github.com/aws/ec2-macos-utils/tags](https://github.com/aws/ec2-macos-utils/tags) | 
| Amazon SSM Agent | [https://github.com/aws/amazon-ssm-agent/releases](https://github.com/aws/amazon-ssm-agent/releases) | 
| AWS Command Line Interface（AWS CLI）版本 2 | [https://raw.githubusercontent.com/aws/aws-cli/v2/CHANGELOG.rst](https://raw.githubusercontent.com/aws/aws-cli/v2/CHANGELOG.rst) | 
| Xcode 的命令行工具 | [https://developer.apple.com/documentation/xcode-release-notes](https://developer.apple.com/documentation/xcode-release-notes) | 
| Homebrew | [https://github.com/Homebrew/brew/releases](https://github.com/Homebrew/brew/releases) | 
| EC2 Instance Connect | [https://github.com/aws/aws-ec2-instance-connect-config/releases](https://github.com/aws/aws-ec2-instance-connect-config/releases) | 
| Safari | [https://developer.apple.com/documentation/safari-release-notes](https://developer.apple.com/documentation/safari-release-notes) | 

## Amazon EC2 macOS AMI 更新
<a name="macos-ami-change-log"></a>

下表描述了 EC2 macOS AMI 版本中包含的更改。请注意，有些更改适用于所有 EC2 macOS AMI，而有些只适用于一部分 AMI。

### EC2 macOS AMI 更新
<a name="monthly-ami-updates"></a>


| 版本 | 更改 | 
| --- | --- | 
| 2026 年 9 月 2 日 |  +  `awscli` 更新为 2.36.36 <br />+  Homebrew 已更新为 6.0.20  +  [macOS Sonoma 14.8.9 的安全内容](https://support.apple.com/en-us/148172) <br />+  Safari 更新为 26.6.1 版   [Safari 26.6.1 的安全内容](https://support.apple.com/en-us/148286)    +  [macOS Tahoe 26.6.2 的安全内容](https://support.apple.com/en-us/148281)   | 
| 2026 年 8 月 26 日 |  +  `awscli` 已更新为 2.36.27 <br />+  将 Homebrew 更新至 6.0.18  +  [macOS Sonoma 14.8.9 的安全内容](https://support.apple.com/en-us/148172) <br />+  Safari 更新为 26.6.1 版   [Safari 26.6.1 的安全内容](https://support.apple.com/en-us/148286)    +  [macOS Sequoia 15.7.9 的安全内容](https://support.apple.com/en-us/148171) <br />+  Safari 更新为 26.6.1 版   [Safari 26.6.1 的安全内容](https://support.apple.com/en-us/148286)    +  [macOS Tahoe 26.6.1 的安全内容](https://support.apple.com/en-us/148170)   | 
| 2026 年 8 月 13 日 |  +  `awscli` 已更新为 2.36.12 <br />+  Homebrew 更新至 6.0.13  +  [macOS Sonoma 14.8.8 的安全内容](https://support.apple.com/en-us/128072) <br />+  Safari 更新为 26.6 版   [Safari 26.6 的安全内容](https://support.apple.com/en-us/128073)    +  [macOS Sequoia 15.7.8 的安全内容](https://support.apple.com/en-us/128071) <br />+  Safari 更新为 26.6 版   [Safari 26.6 的安全内容](https://support.apple.com/en-us/128073)    +  [macOS Tahoe 26.6 的安全内容](https://support.apple.com/en-us/128067) <br />+  将命令行工具更新至 26.6   | 
| 2026 年 7 月 29 日 |  +  [macOS Tahoe 26.5.2 的安全内容](https://support.apple.com/en-us/127595) <br />+  `awscli` 更新至 2.36.1 <br />+  将 Homebrew 更新至 6.0.11   | 
| 2026 年 5 月 19 日 |  +  `awscli` 已更新为 2.34.46 <br />+  将 Homebrew 更新至 5.1.11  +  [macOS Sonoma 14.8.7 的安全内容](https://support.apple.com/en-us/127117) <br />+  Safari 更新为 26.5 版   [Safari 26.5 的安全内容](https://support.apple.com/en-us/127121)    +  [macOS Sequoia 15.7.7 的安全内容](https://support.apple.com/en-us/127116) <br />+  Safari 更新为 26.5 版   [Safari 26.5 的安全内容](https://support.apple.com/en-us/127121)    +  [macOS Tahoe 26.5 的安全内容](https://support.apple.com/en-us/127115) <br />+  将命令行工具更新至 26.5   | 
| 2026 年 4 月 20 日 |  +  [macOS Tahoe 26.4.1 的安全内容](https://support.apple.com/en-us/100100) <br />+  将命令行工具更新至 26.4.1 <br />+  `awscli` 已更新为 2.34.32 <br />+  Homebrew 更新至 5.1.7   | 
| 2026 年 4 月 16 日 |  +  `awscli` 已更新为 2.34.27 <br />+  `ec2-macos-init` 已更新为 1.5.15 <br />+  将 Homebrew 更新至 5.1.5  +  [macOS Sonoma 14.8.5 的安全内容](https://support.apple.com/en-us/126796) <br />+  Safari 更新为 26.4 版   [Safari 26.4 的安全内容](https://support.apple.com/en-us/126800)    +  [macOS Sequoia 15.7.5 的安全内容](https://support.apple.com/en-us/126795) <br />+  Safari 更新为 26.4 版   [Safari 26.4 的安全内容](https://support.apple.com/en-us/126800)    +  [macOS Tahoe 26.4 的安全内容](https://support.apple.com/en-us/126794) <br />+  命令行工具更新至 26.4   | 
| 2026 年 3 月 17 日 |  +  [macOS Tahoe 26 更新中的新增内容](https://support.apple.com/en-us/122868) <br />+  将命令行工具更新至 26.3 <br />+  `awscli` 已更新为 2.34.10 <br />+  将 Homebrew 更新至 5.1.0   | 
| 2026 年 3 月 3 日 |  +  `awscli` 已更新为 2.33.31 <br />+  Homebrew 已更新为 5.0.15  +  [macOS Sonoma 14.8.4 的安全内容](https://support.apple.com/en-us/126350) <br />+  Safari 已更新为 26.3   [Safari 26.3 的安全内容](https://support.apple.com/en-us/126354)    +  [macOS Sequoia 15.7.4 的安全内容](https://support.apple.com/en-us/126349) <br />+  Safari 已更新为 26.3   [Safari 26.3 的安全内容](https://support.apple.com/en-us/126354)    +  [macOS Tahoe 26.3 的安全内容](https://support.apple.com/en-us/126348)   | 
| 2025 年 12 月 26 日 |  +  `awscli` 更新至 2.32.19 <br />+  已更新 `amazon-ssm-agent` 至 3.3.3270.0 <br />+  将 Homebrew 更新至 5.0.6  +  [macOS Sonoma 14.8.3 的安全内容]( https://support.apple.com/en-us/125888) <br />+  Safari 已更新为 26.2   [Safari 26.2 的安全内容](https://support.apple.com/en-us/125892)    +  [macOS Sequoia 15.7.3 的安全内容](https://support.apple.com/en-us/125887) <br />+  Safari 已更新为 26.2   [Safari 26.2 的安全内容](https://support.apple.com/en-us/125892)   <br />+  命令行工具已更新为 26.2  +  [macOS Tahoe 26.2 的安全内容](https://support.apple.com/en-us/125886) <br />+  命令行工具已更新为 26.2   | 
| 2025 年 12 月 17 日 |  +  `awscli` 已更新为 2.32.16 <br />+  将 Homebrew 更新至 5.0.5  +  [macOS Sonoma 14.8.2 的安全内容](https://support.apple.com/en-us/125636) <br />+  Safari 更新为 26.1 版   [Safari 26.1 的安全内容](https://support.apple.com/en-us/125640)    +  [macOS Sequoia 15.7.2 的安全内容](https://support.apple.com/en-us/125635) <br />+  Safari 更新为 26.1 版   [Safari 26.1 的安全内容](https://support.apple.com/en-us/125640)   <br />+  将命令行工具更新至 26.1  +  [macOS Tahoe 26.1 的安全内容](https://support.apple.com/en-us/125634) <br />+  将命令行工具更新至 26.1   | 
| 2025 年 11 月 18 日 |  +  `awscli` 已更新为 2.31.35 <br />+  `ec2-macos-init` 已更新为 1.5.13 <br />+  `ec2-macos-utils` 已更新为 1.0.7 <br />+  Homebrew 更新至 5.0.1  +  [macOS Sonoma 14.8.1 的安全内容](https://support.apple.com/en-us/125330) <br />+  Safari 已更新为 26.0.1   [Safari 26.0.1 的安全内容](https://support.apple.com/en-us/125113)    +  [macOS Sequoia 15.7.1 的安全内容](https://support.apple.com/en-us/125329) <br />+  Safari 已更新为 26.0.1   [Safari 18.6 的安全内容](https://support.apple.com/en-us/125113)   <br />+  命令行工具已更新为 26.0  +  [macOS Tahoe 26.0.1 的安全内容](https://support.apple.com/en-us/125328) <br />+  命令行工具已更新为 26.0   | 
| 2025 年 9 月 4 日 |  +  `awscli` 更新至 2.28.19 <br />+  `ec2-instance-connect` 已更新至 2.0.0-5 <br />+  Homebrew 更新至 4.6.7  +  [macOS Ventura 13.7.8 的安全内容](https://support.apple.com/en-us/124929)  +  [macOS Sonoma 14.7.8 的安全内容](https://support.apple.com/en-us/124928)  +  [macOS Sequoia 15.6.1 的安全内容](https://support.apple.com/en-us/124927)   | 
| 2025 年 8 月 5 日 |  +  `awscli` 更新至 2.28.0 <br />+  Homebrew 更新至 4.5.13  +  [macOS Ventura 13.7.7 的安全内容](https://support.apple.com/en-us/124151) <br />+  Safari 更新至 18.6   [Safari 18.6 的安全内容](https://support.apple.com/en-us/124152)    +  [macOS Sonoma 14.7.7 的安全内容](https://support.apple.com/en-us/124150) <br />+  Safari 更新至 18.6   [Safari 18.6 的安全内容](https://support.apple.com/en-us/124152)    +  [macOS Sequoia 15.6 的安全内容](https://support.apple.com/en-us/124149) <br />+  AWS ENA 以太网更新至 2.0.0   | 
| 2025 年 6 月 27 日 |  +  `awscli` 更新至 2.27.40 <br />+  Homebrew 更新至 4.5.7 <br />+  已将 x86\_64 映像迁移到 AWS ENA 以太网 dext  +  [macOS Ventura 13.7.6 的安全内容](https://support.apple.com/en-us/122718) <br />+  Safari 更新至 18.5   [Safari 18.5 的安全内容](https://support.apple.com/en-us/122719)    +  [macOS Sonoma 14.7.6 的安全内容](https://support.apple.com/en-us/122717) <br />+  Safari 更新至 18.5   [Safari 18.5 的安全内容](https://support.apple.com/en-us/122719)    +  [macOS Sequoia 15.5 的安全内容](https://support.apple.com/en-us/122716) <br />+  命令行工具更新至 16.4 <br />+  AWS ENA 以太网更新至 1.0.9   | 
| 2025 年 5 月 21 日 |  +  `awscli` 更新至 2.27.7 <br />+  `ec2-macos-init` 更新至 1.5.11 <br />+  `ec2-macos-utils` 更新至 1.0.5 <br />+  Homebrew 更新至 4.5.1  +  [macOS Ventura 13.7.5 的安全内容](https://support.apple.com/en-us/122375) <br />+  Safari 更新至 18.4   [Safari 18.4 的安全内容](https://support.apple.com/en-us/122379)    +  [macOS Sonoma 14.7.5 的安全内容](https://support.apple.com/en-us/122374) <br />+  Safari 更新至 18.4   [Safari 18.4 的安全内容](https://support.apple.com/en-us/122379)    +  [macOS Sequoia 15.4.1 的安全内容](https://support.apple.com/en-us/122400) <br />+  命令行工具更新至 16.3   | 
| 2025 年 5 月 5 日 |  +  `awscli` 更新至 2.27.1 <br />+  `ec2-macos-init` 更新至 1.5.11 <br />+  `ec2-macos-system-monitor` 更新至 1.3.1 <br />+  `ec2-macos-utils` 更新至 1.0.5 <br />+  Homebrew 更新至 4.4.32  +  [macOS Ventura 13.7.5 的安全内容](https://support.apple.com/en-us/122375) <br />+  Safari 更新至 18.4   [Safari 18.4 的安全内容](https://support.apple.com/en-us/122379)    +  [macOS Sonoma 14.7.5 的安全内容](https://support.apple.com/en-us/122374) <br />+  Safari 更新至 18.4   [Safari 18.4 的安全内容](https://support.apple.com/en-us/122379)    +  [macOS Sequoia 15.4.1 的安全内容](https://support.apple.com/en-us/122400)   | 
| 2025 年 3 月 18 日 |  +  `awscli` 已更新为 2.24.2 <br />+  Homebrew 已更新为 4.4.20  +  [macOS Sequoia 15.3.1 的安全内容](https://support.apple.com/en-us/120283)  +  [macOS Sonoma 14.7.4 的安全内容](https://support.apple.com/en-us/109035) <br />+  Safari 已更新为 18.3  +  [macOS Ventura 13.7.4 的安全内容](https://support.apple.com/en-us/106337) <br />+  Safari 已更新为 18.3   | 
| 2025 年 1 月 24 日 |  +  `awscli` 已更新为 2.22.33 <br />+  Homebrew 已更新为 4.4.15  +  [macOS Sequoia 15.2 的安全内容](https://support.apple.com/en-us/121839) <br />+  命令行工具已更新为 16.2  +  [macOS Sonoma 14.7.2 的安全内容](https://support.apple.com/en-us/121840) <br />+  Safari 已更新为 18.2 <br />+  命令行工具已更新为 16.2  +  [acOS Ventura 13.7.2 的安全内容](https://support.apple.com/en-us/121842) <br />+  Safari 已更新为 18.2   | 
| 2024 年 12 月 20 日 |  +  Homebrew 已更新为 4.4.8 <br />+  `aws-cli` 已更新为 2.22.5 <br />+  `amazon-ssm-agent` 已更新为 3.3.987.0  +  [macOS Sequoia 15.1.1 的安全内容](https://support.apple.com/en-us/121753)  +  [macOS Sonoma 14.7.1 的安全内容](https://support.apple.com/en-us/121570) <br />+  Safari 已更新为 18.1.1  +  [macOS Ventura 13.7.1 的安全内容](https://support.apple.com/en-us/121568) <br />+  Safari 已更新为 18.1.1   | 
| 2024 年 10 月 28 日 |  +  将 Homebrew 更新至 4.4.2 <br />+  `aws-cli` 已更新为 2.18.13 <br />+  `amazon-ssm-agent` 已更新为 3.3.987.0 <br />+  `ec2-macos-init` 已更新为 1.5.10 <br />+  `ec2-macos-utils` 已更新为 1.0.4  +  [macOS Sequoia 15 的安全内容](https://support.apple.com/en-us/121238)  +  [macOS Sonoma 14.7 的安全内容](https://support.apple.com/en-us/121247) <br />+  命令行工具已更新为 16.0 <br />+  Safari 已更新为 18.0.1   [Safari 18 的安全内容](https://support.apple.com/en-us/121241)    +  [macOS Ventura 13.7 的安全内容](https://support.apple.com/en-us/121234) <br />+  Safari 已更新为 18.0.1   [Safari 18 的安全内容](https://support.apple.com/en-us/121241)     | 
| 2024 年 8 月 20 日 |  +  将 Homebrew 更新至 4.3.14 <br />+  `aws-cli` 已更新为 2.17.29  +  没有已发布的 CVE 条目。  +  没有已发布的 CVE 条目。 <br />+  Safari 更新为 17.6 版   [Safari 17.6 的安全内容](https://support.apple.com/en-us/120913)    +  [macOS Monterey 12.7.6 的安全内容](https://support.apple.com/en-us/120910) <br />+  Safari 更新为 17.6 版   [Safari 17.6 的安全内容](https://support.apple.com/en-us/120913)     | 
| 2024 年 6 月 7 日 |  +  将 Homebrew 更新至 4.3.1-1 <br />+  `aws-cli` 已更新为 2.15.56 <br />+  `amazon-ssm-agent` 已更新为 3.3.380.0-1  +  [macOS Sonoma 14.5 的安全内容](https://support.apple.com/en-us/120903)  +  [macOS Ventura 13.6.7 的安全内容](https://support.apple.com/en-us/120900) <br />+  Safari 更新为 17.5 版   [Safari 17.5 的安全内容](https://support.apple.com/en-us/120896)    +  [macOS Monterey 12.7.5 的安全内容](https://support.apple.com/en-us/120896) <br />+  Safari 更新为 17.5 版   [Safari 17.5 的安全内容](https://support.apple.com/en-us/120896)     | 
| 2024 年 4 月 12 日 |  +  将 Homebrew 更新至 4.2.16-1 <br />+  `aws-cli` 更新为 2.15.36  +  [macOS Sonoma 14.4.1 的安全内容](https://support.apple.com/en-us/120889)  +  [macOS Ventura 13.6.6 的安全内容](https://support.apple.com/en-us/120891) <br />+  Safari 更新为 17.4.1 版   [Safari 17.4.1 的安全内容](https://support.apple.com/en-us/120888)    +  Safari 更新为 17.4.1 版   [Safari 17.4.1 的安全内容](https://support.apple.com/en-us/120888)     | 
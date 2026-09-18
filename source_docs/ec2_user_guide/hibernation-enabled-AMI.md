

# 配置 Linux AMI 以支持休眠
<a name="hibernation-enabled-AMI"></a>

以下 Linux AMI 可以支持 Amazon EC2 实例休眠，前提是您完成了本节中所述的其他配置步骤。

**Topics**
+ [AL2023 最低 AMI 发布了 2023.09.20 版或更高版本](#configure-AL2023-minimal-for-hibernation)
+ [Amazon Linux 2 最小 AMI 发布了 2019.08.29 版或更高版本](#configure-AL2-minimal-for-hibernation)
+ [在 2019.08.29 前发布的 Amazon Linux 2](#configure-AL2-for-hibernation)
+ [在 2018.11.16 前发布的 Amazon Linux](#configure-AL-for-hibernation)
+ [CentOS 版本 8 或更高版本](#configure-centos-for-hibernation)
+ [Fedora 34 版或更高版本](#configure-fedora-for-hibernation)
+ [Red Hat Enterprise Linux 版本 8 或 9](#configure-RHEL-for-hibernation)
+ [发布序列号早于 20210820 的 Ubuntu 20.04 LTS（Focal Fossa）](#configure-ubuntu2004-for-hibernation)
+ [发布序列号早于 20190722.1 的 Ubuntu 18.04（Bionic Beaver）](#configure-ubuntu1804-for-hibernation)
+ [Ubuntu 16.04 (Xenial Xerus)](#configure-ubuntu1604-for-hibernation)

有关支持休眠且*无需额外*配置的 Linux 和 Windows AMI，请参阅[AMI](hibernating-prerequisites.md#hibernation-prereqs-supported-amis)。

有关更多信息，请参阅 [Update instance software on your Amazon Linux 2 instance](https://docs.aws.amazon.com/linux/al2/ug/install-updates.html)。

## AL2023 最低 AMI 发布了 2023.09.20 版或更高版本
<a name="configure-AL2023-minimal-for-hibernation"></a>

**配置 2023.09.20 版或更高版本的 AL2023 最低 AMI 以支持休眠**

1. 从存储库安装 `ec2-hibinit-agent` 程序包。

   ```
   [ec2-user ~]$ sudo dnf install ec2-hibinit-agent
   ```

1. 重新启动服务。

   ```
   [ec2-user ~]$ sudo systemctl start hibinit-agent
   ```

## Amazon Linux 2 最小 AMI 发布了 2019.08.29 版或更高版本
<a name="configure-AL2-minimal-for-hibernation"></a>

**配置 2019.08.29 版或更高版本的 Amazon Linux 2 最小 AMI 以支持休眠**

1. 从存储库安装 `ec2-hibinit-agent` 程序包。

   ```
   [ec2-user ~]$ sudo yum install ec2-hibinit-agent
   ```

1. 重新启动服务。

   ```
   [ec2-user ~]$ sudo systemctl start hibinit-agent
   ```

## 在 2019.08.29 前发布的 Amazon Linux 2
<a name="configure-AL2-for-hibernation"></a>

**配置在 2019.08.29 前发布的 Amazon Linux 2 AMI 以支持休眠**

1. 将内核更新为 `4.14.138-114.102` 或更高版本。

   ```
   [ec2-user ~]$ sudo yum update kernel
   ```

1. 从存储库安装 `ec2-hibinit-agent` 程序包。

   ```
   [ec2-user ~]$ sudo yum install ec2-hibinit-agent
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 确认内核版本已更新为 `4.14.138-114.102` 或更高版本。

   ```
   [ec2-user ~]$ uname -a
   ```

1. 停止实例并创建 AMI。有关更多信息，请参阅 [创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。

## 在 2018.11.16 前发布的 Amazon Linux
<a name="configure-AL-for-hibernation"></a>

**配置在 2018.11.16 前发布的 Amazon Linux AMI 以支持休眠**

1. 将内核更新为 `4.14.77-70.59` 或更高版本。

   ```
   [ec2-user ~]$ sudo yum update kernel
   ```

1. 从存储库安装 `ec2-hibinit-agent` 程序包。

   ```
   [ec2-user ~]$ sudo yum install ec2-hibinit-agent
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 确认内核版本已更新为 `4.14.77-70.59` 或更高版本。

   ```
   [ec2-user ~]$ uname -a
   ```

1. 停止实例并创建 AMI。有关更多信息，请参阅 [创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。

## CentOS 版本 8 或更高版本
<a name="configure-centos-for-hibernation"></a>

**配置 CentOS 版本 8 或更高版本 AMI 以支持休眠**

1. 将内核更新为 `4.18.0-305.7.1.el8_4.x86_64` 或更高版本。

   ```
   [ec2-user ~]$ sudo yum update kernel
   ```

1. 安装 Extra Packages for Enterprise Linux (EPEL) 存储库。

   ```
   [ec2-user ~]$ sudo yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
   ```

1. 从存储库安装 `ec2-hibinit-agent` 程序包。

   ```
   [ec2-user ~]$ sudo yum install ec2-hibinit-agent
   ```

1. 启用休眠代理以在引导时开启。

   ```
   [ec2-user ~]$ sudo systemctl enable hibinit-agent.service
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 确认内核版本已更新为 `4.18.0-305.7.1.el8_4.x86_64` 或更高版本。

   ```
   [ec2-user ~]$ uname -a
   ```

## Fedora 34 版或更高版本
<a name="configure-fedora-for-hibernation"></a>

**配置 Fedora 版本 34 或更高版本 AMI 以支持休眠**

1. 将内核更新为 `5.12.10-300.fc34.x86_64` 或更高版本。

   ```
   [ec2-user ~]$ sudo yum update kernel
   ```

1. 从存储库安装 `ec2-hibinit-agent` 程序包。

   ```
   [ec2-user ~]$ sudo dnf install ec2-hibinit-agent
   ```

1. 启用休眠代理以在引导时开启。

   ```
   [ec2-user ~]$ sudo systemctl enable hibinit-agent.service
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 确认内核版本已更新为 `5.12.10-300.fc34.x86_64` 或更高版本。

   ```
   [ec2-user ~]$ uname -a
   ```

## Red Hat Enterprise Linux 版本 8 或 9
<a name="configure-RHEL-for-hibernation"></a>

**配置 Red Hat Enterprise Linux 8 或 9 AMI 以支持休眠**

1. 将内核更新为 `4.18.0-305.7.1.el8_4.x86_64` 或更高版本。

   ```
   [ec2-user ~]$ sudo yum update kernel
   ```

1. 安装 Extra Packages for Enterprise Linux (EPEL) 存储库。

   RHEL 版本 8：

   ```
   [ec2-user ~]$ sudo yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
   ```

   RHEL 版本 9：

   ```
   [ec2-user ~]$ sudo yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
   ```

1. 从存储库安装 `ec2-hibinit-agent` 程序包。

   ```
   [ec2-user ~]$ sudo yum install ec2-hibinit-agent
   ```

1. 启用休眠代理以在引导时开启。

   ```
   [ec2-user ~]$ sudo systemctl enable hibinit-agent.service
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 确认内核版本已更新为 `4.18.0-305.7.1.el8_4.x86_64` 或更高版本。

   ```
   [ec2-user ~]$ uname -a
   ```

## 发布序列号早于 20210820 的 Ubuntu 20.04 LTS（Focal Fossa）
<a name="configure-ubuntu2004-for-hibernation"></a>

**配置发布序列号早于 20210820 的 Ubuntu 20.04 LTS（Focal Fossa）AMI 以支持休眠**

1. 将 linux-aws-kernel 更新为 `5.8.0-1038.40` 或更高版本，并将 grub2 更新为 `2.04-1ubuntu26.13` 或更高版本。

   ```
   [ec2-user ~]$ sudo apt update
   [ec2-user ~]$ sudo apt dist-upgrade
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 确认内核版本已更新为 `5.8.0-1038.40` 或更高版本。

   ```
   [ec2-user ~]$ uname -a
   ```

1. 确认 grub2 版本已更新为 `2.04-1ubuntu26.13` 或更高版本。

   ```
   [ec2-user ~]$ dpkg --list | grep grub2-common
   ```

## 发布序列号早于 20190722.1 的 Ubuntu 18.04（Bionic Beaver）
<a name="configure-ubuntu1804-for-hibernation"></a>

**配置在序列号 20190722.1 前发布的 Ubuntu 18.04 LTS AMI 以支持休眠**

1. 将内核更新为 `4.15.0-1044` 或更高版本。

   ```
   [ec2-user ~]$ sudo apt update
   [ec2-user ~]$ sudo apt dist-upgrade
   ```

1. 从存储库安装 `ec2-hibinit-agent` 程序包。

   ```
   [ec2-user ~]$ sudo apt install ec2-hibinit-agent
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 确认内核版本已更新为 `4.15.0-1044` 或更高版本。

   ```
   [ec2-user ~]$ uname -a
   ```

## Ubuntu 16.04 (Xenial Xerus)
<a name="configure-ubuntu1604-for-hibernation"></a>

要将 Ubuntu 16.04 LTS 配置为支持休眠，您需要安装 Linux-aws-hwe 内核软件包版本 4.15.0-1058-aws 或更高版本以及 ec2-hibinit-agent。

**重要**  
`linux-aws-hwe` 内核程序包受规范支持。对 Ubuntu 16.04 LTS 的标准支持于 2021 年 4 月结束，该软件包不再定期更新。但是，它将接收其他安全更新，直到扩展安全性维护支持在 2024 年结束。有关更多信息，请参阅规范 Ubuntu 博客上现已提供的[适用于 Ubuntu 16.04 LTS 的 Amazon EC2 休眠](https://ubuntu.com/blog/amazon-ec2-hibernation-for-ubuntu-16-04-lts-now-available)。  
我们建议您升级到 Ubuntu 20.04 LTS（Focal Fossa）AMI 或 Ubuntu 18.04 LTS（Bionic Beaver）AMI。

**配置 Ubuntu 16.04 LTS AMI 以支持休眠**

1. 将内核更新为 `4.15.0-1058-aws` 或更高版本。

   ```
   [ec2-user ~]$ sudo apt update
   [ec2-user ~]$ sudo apt install linux-aws-hwe
   ```

1. 从存储库安装 `ec2-hibinit-agent` 程序包。

   ```
   [ec2-user ~]$ sudo apt install ec2-hibinit-agent
   ```

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 确认内核版本已更新为 `4.15.0-1058-aws` 或更高版本。

   ```
   [ec2-user ~]$ uname -a
   ```
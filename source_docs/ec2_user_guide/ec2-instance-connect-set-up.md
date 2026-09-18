

# 在您的 EC2 实例上安装 EC2 Instance Connect
<a name="ec2-instance-connect-set-up"></a>

要使用 EC2 Instance Connect 连接到 Linux 实例，该实例必须安装 EC2 Instance Connect。安装 EC2 Instance Connect 将在实例上配置 SSH 进程守护程序。

有关 EC2 Instance Connect 程序包的更多信息，请参阅 GitHub 网站上的 [aws/aws-ec2-instance-connect-config](https://github.com/aws/aws-ec2-instance-connect-config)。

**注意**  
如果为 SSH 身份验证配置了 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser` 设置，则 EC2 Instance Connect 安装不会更新它们。因此，无法使用 EC2 Instance Connect。

## 安装必备组件
<a name="ec2-instance-connect-install-prerequisites"></a>

安装 EC2 Instance Connect 之前，务必确认已满足以下先决条件。
+ **验证实例使用了以下某一项：**
  + 版本 2.0.20190618 之前的 Amazon Linux 2 \*
  + AL2023 AMI 最低版本或经 Amazon ECS 优化的 AMI
  + CentOS Stream 8 和 9
  + 14.2.1 之前的 macOS Sonoma、13.6.3 之前的 Ventura 和 12.7.2 之前的 Monterey \*
  + Red Hat Enterprise Linux（RHEL）8 和 9
  + Ubuntu 16.04 和 18.04 \*
**提示**  
\* 对于 Amazon Linux 2、macOS 和 Ubuntu：如果使用比上述版本更高的版本启动实例，则会预装 EC2 Instance Connect，无需手动安装。
+ **验证 EC2 Instance Connect 的一般先决条件。**

  有关更多信息，请参阅 [EC2 Instance Connect 的先决条件](ec2-instance-connect-prerequisites.md)。
+ **确认满足使用本地计算机上的 SSH 客户端连接到实例的先决条件。**

  有关更多信息，请参阅 [使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)。
+ **获取实例 ID。**

  您可以使用 Amazon EC2 控制台获取实例 ID（从 **Instance ID (实例 ID)** 列）。如果您愿意，可以使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) (AWS CLI) 或 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) (AWS Tools for Windows PowerShell) 命令。

## 手动安装 EC2 Instance Connect
<a name="ec2-instance-connect-install"></a>

**注意**  
如果使用以下某一项 AMI 启动了实例，则该实例已预安装 EC2 Instance Connect，因此可以跳过此过程：  
AL2023 标准 AMI
Amazon Linux 2 2.0.20190618 或更高版本
macOS Sonoma 14.2.1 或更高版本
macOS Ventura 13.6.3 或更高版本
macOS Monterey 12.7.2 或更高版本
Ubuntu 20.04 或更高版本

根据实例的操作系统，使用以下过程之一安装 EC2 Instance Connect。

------
#### [ Amazon Linux 2 ]

**在使用 Amazon Linux 2 启动的实例上安装 EC2 Instance Connect**

1. 使用 SSH 连接到您的实例。

   在以下命令中，将示例值替换为自己的值。可以使用在启动实例时为其分配的 SSH 密钥对以及用于启动实例的 AMI 的默认用户名。对于 Amazon Linux 2，默认用户名为 `ec2-user`。

   ```
   $ ssh -i {{my_ec2_private_key}}.pem {{ec2-user}}@{{ec2-a-b-c-d.us-west-2.compute.amazonaws.com}}
   ```

   有关连接到实例的更多信息，请参阅[使用 SSH 客户端连接到 Linux 实例](connect-linux-inst-ssh.md)。

1. 在实例上安装 EC2 Instance Connect 程序包。

   ```
   [ec2-user ~]$ sudo yum install ec2-instance-connect
   ```

   您将会在 `/opt/aws/bin/` 文件夹中看到三个新脚本：

   ```
   eic_curl_authorized_keys
   eic_parse_authorized_keys
   eic_run_authorized_keys
   ```

1. （可选）验证是否在实例上成功安装了 EC2 Instance Connect。

   ```
   [ec2-user ~]$ sudo less /etc/ssh/sshd_config
   ```

   如果 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser` 行包含以下值，则成功安装 EC2 Instance Connect：

   ```
   AuthorizedKeysCommand /opt/aws/bin/eic_run_authorized_keys %u %f
   AuthorizedKeysCommandUser ec2-instance-connect
   ```
   + `AuthorizedKeysCommand` 设置 `eic_run_authorized_keys` 文件以从实例元数据中查找密钥
   + `AuthorizedKeysCommandUser` 将系统用户设置为 `ec2-instance-connect`
**注意**  
如果以前配置了 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser`，则 EC2 Instance Connect 安装不会更改这些值，并且无法使用 EC2 Instance Connect。

------
#### [ CentOS ]

**在通过 CentOS 启动的实例上安装 EC2 Instance Connect**

1. 使用 SSH 连接到实例。

   在以下命令中，将示例值替换为自己的值。可以使用在启动实例时为其分配的 SSH 密钥对以及用于启动实例的 AMI 的默认用户名。对于 CentOS，默认用户名为 `centos` 或 `ec2-user`。

   ```
   $ ssh -i {{my_ec2_private_key}}.pem {{centos}}@{{ec2-a-b-c-d.us-west-2.compute.amazonaws.com}}
   ```

   有关连接到实例的更多信息，请参阅[使用 SSH 客户端连接到 Linux 实例](connect-linux-inst-ssh.md)。

1. 如果使用 HTTP 或 HTTPS 代理，则必须在当前 Shell 会话中设置 `http_proxy` 或 `https_proxy` 环境变量。

   如果不使用代理，则可跳过此步骤。
   + 对于 HTTP 代理服务器，请运行以下命令：

     ```
     $ export http_proxy=http://hostname:port
     $ export https_proxy=http://hostname:port
     ```
   + 对于 HTTPS 代理服务器，请运行以下命令：

     ```
     $ export http_proxy=https://hostname:port
     $ export https_proxy=https://hostname:port
     ```

1. 运行以下命令，在实例上安装 EC2 Instance Connect 软件包。

   适用于 CentOS 的 EC2 Instance Connect 配置文件在 Red Hat Package Manager（RPM）包中提供，适用于 CentOS 8 和 CentOS 9，以及在 Intel/AMD（x86\_64）或 ARM（AArch64）上运行的实例类型有不同的 RPM 包。

   使用适用于操作系统和 CPU 架构的命令块。
   + CentOS 8

     Intel/AMD（x86\_64）

     ```
     [ec2-user ~]$ mkdir /tmp/ec2-instance-connect
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_amd64/ec2-instance-connect-2.0.0-5.rhel8.x86_64.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect.rpm
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_amd64/ec2-instance-connect-selinux-2.0.0-5.noarch.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     [ec2-user ~]$ sudo yum install -y /tmp/ec2-instance-connect/ec2-instance-connect.rpm /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     ```

     ARM（AArch64）

     ```
     [ec2-user ~]$ mkdir /tmp/ec2-instance-connect
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_arm64/ec2-instance-connect-2.0.0-5.rhel8.aarch64.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect.rpm
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_arm64/ec2-instance-connect-selinux-2.0.0-5.noarch.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     [ec2-user ~]$ sudo yum install -y /tmp/ec2-instance-connect/ec2-instance-connect.rpm /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     ```
   + CentOS 9

     Intel/AMD（x86\_64）

     ```
     [ec2-user ~]$ mkdir /tmp/ec2-instance-connect
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_amd64/ec2-instance-connect-2.0.0-5.rhel9.x86_64.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect.rpm
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_amd64/ec2-instance-connect-selinux-2.0.0-5.noarch.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     [ec2-user ~]$ sudo yum install -y /tmp/ec2-instance-connect/ec2-instance-connect.rpm /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     ```

     ARM（AArch64）

     ```
     [ec2-user ~]$ mkdir /tmp/ec2-instance-connect
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_arm64/ec2-instance-connect-2.0.0-5.rhel9.aarch64.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect.rpm
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_arm64/ec2-instance-connect-selinux-2.0.0-5.noarch.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     [ec2-user ~]$ sudo yum install -y /tmp/ec2-instance-connect/ec2-instance-connect.rpm /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     ```

   在 `/opt/aws/bin/` 文件夹中会看到以下新脚本：

   ```
   eic_run_authorized_keys
   ```

1. （可选）验证是否在实例上成功安装了 EC2 Instance Connect。
   + 对于 CentOS 8：

     ```
     [ec2-user ~]$ sudo less /lib/systemd/system/sshd.service.d/ec2-instance-connect.conf
     ```
   + 对于 CentOS 9：

     ```
     [ec2-user ~]$ sudo less /etc/ssh/sshd_config.d/60-ec2-instance-connect.conf
     ```

   如果 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser` 行包含以下值，则成功安装 EC2 Instance Connect：

   ```
   AuthorizedKeysCommand /opt/aws/bin/eic_run_authorized_keys %u %f
   AuthorizedKeysCommandUser ec2-instance-connect
   ```
   + `AuthorizedKeysCommand` 设置 `eic_run_authorized_keys` 文件以从实例元数据中查找密钥
   + `AuthorizedKeysCommandUser` 将系统用户设置为 `ec2-instance-connect`
**注意**  
如果以前配置了 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser`，则 EC2 Instance Connect 安装不会更改这些值，并且无法使用 EC2 Instance Connect。

------
#### [ macOS ]

**在使用 macOS 启动的实例上安装 EC2 Instance Connect**

1. 使用 SSH 连接到实例。

   在以下命令中，将示例值替换为自己的值。可以使用在启动实例时为其分配的 SSH 密钥对以及用于启动实例的 AMI 的默认用户名。对于 macOS 实例，默认用户名为 `ec2-user`。

   ```
   $ ssh -i {{my_ec2_private_key}}.pem {{ec2-user}}@{{ec2-a-b-c-d.us-west-2.compute.amazonaws.com}}
   ```

   有关连接到实例的更多信息，请参阅[使用 SSH 客户端连接到 Linux 实例](connect-linux-inst-ssh.md)。

1. 使用以下命令更新 Homebrew。更新将列出 Homebrew 了解的软件。EC2 Instance Connect 软件包通过 Homebrew 在 macOS 实例上提供。有关更多信息，请参阅 [更新 Amazon EC2 Mac 实例上的操作系统和软件](mac-instance-updates.md)。

   ```
   [ec2-user ~]$ brew update
   ```

1. 在实例上安装 EC2 Instance Connect 程序包。将安装软件并配置 sshd 以进行使用。

   ```
   [ec2-user ~]$ brew install ec2-instance-connect
   ```

   在 `/opt/aws/bin/` 文件夹中会看到以下新脚本：

   ```
   eic_run_authorized_keys
   ```

1. （可选）验证是否在实例上成功安装了 EC2 Instance Connect。

   ```
   [ec2-user ~]$ sudo less /etc/ssh/sshd_config.d/60-ec2-instance-connect.conf
   ```

   如果 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser` 行包含以下值，则成功安装 EC2 Instance Connect：

   ```
   AuthorizedKeysCommand /opt/aws/bin/eic_run_authorized_keys %u %f
   AuthorizedKeysCommandUser ec2-instance-connect
   ```
   + `AuthorizedKeysCommand` 设置 `eic_run_authorized_keys` 文件以从实例元数据中查找密钥
   + `AuthorizedKeysCommandUser` 将系统用户设置为 `ec2-instance-connect`
**注意**  
如果以前配置了 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser`，则 EC2 Instance Connect 安装不会更改这些值，并且无法使用 EC2 Instance Connect。

------
#### [ RHEL ]

**在使用 Red Hat Enterprise Linux（RHEL）启动的实例上安装 EC2 Instance Connect**

1. 使用 SSH 连接到实例。

   在以下命令中，将示例值替换为自己的值。可以使用在启动实例时为其分配的 SSH 密钥对以及用于启动实例的 AMI 的默认用户名。对于 RHEL，默认用户名为 `ec2-user` 或 `root`。

   ```
   $ ssh -i {{my_ec2_private_key}}.pem {{ec2-user}}@{{ec2-a-b-c-d.us-west-2.compute.amazonaws.com}}
   ```

   有关连接到实例的更多信息，请参阅[使用 SSH 客户端连接到 Linux 实例](connect-linux-inst-ssh.md)。

1. 如果使用 HTTP 或 HTTPS 代理，则必须在当前 Shell 会话中设置 `http_proxy` 或 `https_proxy` 环境变量。

   如果不使用代理，则可跳过此步骤。
   + 对于 HTTP 代理服务器，请运行以下命令：

     ```
     $ export http_proxy=http://hostname:port
     $ export https_proxy=http://hostname:port
     ```
   + 对于 HTTPS 代理服务器，请运行以下命令：

     ```
     $ export http_proxy=https://hostname:port
     $ export https_proxy=https://hostname:port
     ```

1. 运行以下命令，在实例上安装 EC2 Instance Connect 软件包。

   在 Red Hat Package Manager（RPM）包中提供适用于 RHEL 的 EC2 Instance Connect 配置文件，适用于 RHEL 8 和 RHEL 9，以及在 Intel/AMD（x86\_64）或 ARM（AArch64）上运行的实例类型有不同的 RPM 包。

   使用适用于操作系统和 CPU 架构的命令块。
   + RHEL 8

     Intel/AMD（x86\_64）

     ```
     [ec2-user ~]$ mkdir /tmp/ec2-instance-connect
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_amd64/ec2-instance-connect-2.0.0-5.rhel8.x86_64.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect.rpm
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_amd64/ec2-instance-connect-selinux-2.0.0-5.noarch.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     [ec2-user ~]$ sudo yum install -y /tmp/ec2-instance-connect/ec2-instance-connect.rpm /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     ```

     ARM（AArch64）

     ```
     [ec2-user ~]$ mkdir /tmp/ec2-instance-connect
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_arm64/ec2-instance-connect-2.0.0-5.rhel8.aarch64.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect.rpm
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_arm64/ec2-instance-connect-selinux-2.0.0-5.noarch.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     [ec2-user ~]$ sudo yum install -y /tmp/ec2-instance-connect/ec2-instance-connect.rpm /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     ```
   + RHEL 9

     Intel/AMD（x86\_64）

     ```
     [ec2-user ~]$ mkdir /tmp/ec2-instance-connect
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_amd64/ec2-instance-connect-2.0.0-5.rhel9.x86_64.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect.rpm
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_amd64/ec2-instance-connect-selinux-2.0.0-5.noarch.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     [ec2-user ~]$ sudo yum install -y /tmp/ec2-instance-connect/ec2-instance-connect.rpm /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     ```

     ARM（AArch64）

     ```
     [ec2-user ~]$ mkdir /tmp/ec2-instance-connect
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_arm64/ec2-instance-connect-2.0.0-5.rhel9.aarch64.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect.rpm
     [ec2-user ~]$ curl https://amazon-ec2-instance-connect-us-west-2.s3.us-west-2.amazonaws.com/latest/linux_arm64/ec2-instance-connect-selinux-2.0.0-5.noarch.rpm -o /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     [ec2-user ~]$ sudo yum install -y /tmp/ec2-instance-connect/ec2-instance-connect.rpm /tmp/ec2-instance-connect/ec2-instance-connect-selinux.rpm
     ```

   在 `/opt/aws/bin/` 文件夹中会看到以下新脚本：

   ```
   eic_run_authorized_keys
   ```

1. （可选）验证是否在实例上成功安装了 EC2 Instance Connect。
   + 对于 RHEL 8：

     ```
     [ec2-user ~]$ sudo less /lib/systemd/system/sshd.service.d/ec2-instance-connect.conf
     ```
   + 对于 RHEL 9：

     ```
     [ec2-user ~]$ sudo less /etc/ssh/sshd_config.d/60-ec2-instance-connect.conf
     ```

   如果 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser` 行包含以下值，则成功安装 EC2 Instance Connect：

   ```
   AuthorizedKeysCommand /opt/aws/bin/eic_run_authorized_keys %u %f
   AuthorizedKeysCommandUser ec2-instance-connect
   ```
   + `AuthorizedKeysCommand` 设置 `eic_run_authorized_keys` 文件以从实例元数据中查找密钥
   + `AuthorizedKeysCommandUser` 将系统用户设置为 `ec2-instance-connect`
**注意**  
如果以前配置了 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser`，则 EC2 Instance Connect 安装不会更改这些值，并且无法使用 EC2 Instance Connect。

------
#### [ Ubuntu ]

**在使用 Ubuntu 16.04 或更高版本启动的实例上安装 EC2 Instance Connect**

1. 使用 SSH 连接到实例。

   在以下命令中，将示例值替换为自己的值。可以使用在启动实例时为其分配的 SSH 密钥对以及用于启动实例的 AMI 的默认用户名。对于 Ubuntu AMI，用户名为 `ubuntu`。

   ```
   $ ssh -i {{my_ec2_private_key}}.pem {{ubuntu}}@{{ec2-a-b-c-d.us-west-2.compute.amazonaws.com}}
   ```

   有关连接到实例的更多信息，请参阅[使用 SSH 客户端连接到 Linux 实例](connect-linux-inst-ssh.md)。

1. （可选）确保您的实例具有最新 Ubuntu AMI。

   使用以下命令更新实例上的所有程序包。

   ```
   ubuntu:~$ sudo apt-get update
   ```

   ```
   ubuntu:~$ sudo apt-get upgrade
   ```

1. 在实例上安装 EC2 Instance Connect 程序包。

   ```
   ubuntu:~$ sudo apt-get install ec2-instance-connect
   ```

   您将会在 `/usr/share/ec2-instance-connect/` 文件夹中看到三个新脚本：

   ```
   eic_curl_authorized_keys
   eic_parse_authorized_keys
   eic_run_authorized_keys
   ```

1. （可选）验证是否在实例上成功安装了 EC2 Instance Connect。

   ```
   ubuntu:~$ sudo less /lib/systemd/system/ssh.service.d/ec2-instance-connect.conf
   ```

   如果 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser` 行包含以下值，则成功安装 EC2 Instance Connect：

   ```
   AuthorizedKeysCommand /usr/share/ec2-instance-connect/eic_run_authorized_keys %%u %%f
   AuthorizedKeysCommandUser ec2-instance-connect
   ```
   + `AuthorizedKeysCommand` 设置 `eic_run_authorized_keys` 文件以从实例元数据中查找密钥
   + `AuthorizedKeysCommandUser` 将系统用户设置为 `ec2-instance-connect`
**注意**  
如果以前配置了 `AuthorizedKeysCommand` 和 `AuthorizedKeysCommandUser`，则 EC2 Instance Connect 安装不会更改这些值，并且无法使用 EC2 Instance Connect。

------
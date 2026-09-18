

# 在 Amazon EC2 Linux 实例上安装 EC2Rescue
<a name="ec2rl_install"></a>

EC2Rescue for Linux 工具可以安装在满足以下先决条件的 Amazon EC2 Linux 实例上。

**先决条件**
+ 支持的操作系统：
  + Amazon Linux 2
  + Amazon Linux 2016.09\+
  + SUSE Linux Enterprise Server 12\+
  + RHEL 7\+
  + Ubuntu 16.04\+
+ 软件要求：
  + Python 2.7.9\+ 或 3.2\+

## 安装 EC2Rescue
<a name="ec2rl-install"></a>

`AWSSupport-TroubleshootSSH` 运行手册会安装 EC2Rescue for Linux，然后使用该工具检查或尝试修复阻止通过 SSH 远程连接到 Linux 计算机的常见问题。有关详细信息以及要运行此自动化，请参阅 [支持-TroubleshootSSH](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awssupport-troubleshootssh.html)。

如果您的系统具有所需的 Python 版本，可以安装标准构建过程。否则，您可以安装捆绑构建过程，其中包括 Python 的最小副本。

**安装标准构建过程**

1. 从正常工作的 Linux 实例下载 [EC2Rescue for Linux](https://s3.amazonaws.com/ec2rescuelinux/ec2rl.tgz) 工具：

   ```
   curl -O https://s3.amazonaws.com/ec2rescuelinux/ec2rl.tgz
   ```

1. （*可选*）验证 EC2Rescue for Linux 安装文件的签名。有关更多信息，请参阅 [（可选）验证 EC2Rescue for Linux 的签名](#ec2rl_verify)。

1. 下载 sha256 哈希文件：

   ```
   curl -O https://s3.amazonaws.com/ec2rescuelinux/ec2rl.tgz.sha256
   ```

1. 验证 tarball 的完整性：

   ```
   sha256sum -c ec2rl.tgz.sha256
   ```

1. 解压缩 tarball：

   ```
   tar -xzvf ec2rl.tgz
   ```

1. 通过列出帮助文件来验证安装：

   ```
   cd ec2rl-{{<version_number>}}
   ./ec2rl help
   ```

**安装捆绑构建过程**  
有关指向下载和限制列表的链接，请参阅 github 上的 [EC2Rescue for Linux](https://github.com/awslabs/aws-ec2rescue-linux/blob/master/README.md)。

## （可选）验证 EC2Rescue for Linux 的签名
<a name="ec2rl_verify"></a>

下面是验证基于 Linux 的操作系统的 EC2Rescue for Linux 软件包是否有效的推荐过程。

当您从 Internet 下载应用程序时，我们建议您验证软件发行商的身份，并检查应用程序在发行后是否已遭更改或损坏。这会保护您免于安装含有病毒或其他恶意代码的应用程序版本。

如果您在执行本主题中的步骤后确定适用于 EC2Rescue for Linux 的软件已遭更改或损坏，请不要运行安装文件。否则，可联系 Amazon Web Services。

适用于基于 Linux 的操作系统的 EC2Rescue for Linux 文件是使用 GnuPG（安全数字签名的 Pretty Good Privacy 的开源式执行 (OpenPGP) 标准）进行签名的。GnuPG（也称为 GPG）通过数字签名进行身份验证和完整性检查。AWS 发布了公有密钥和签名，可供您用于验证下载的 EC2Rescue for Linux 程序包。有关 PGP 和 GnuPG (GPG) 的更多信息，请访问 [https://www.gnupg.org/](https://www.gnupg.org/)。

第一步是与软件发行商建立信任。下载软件发行商的公有密钥，检查公有密钥的所有人是否真为其人，然后将该公有密钥添加到您的密钥环。密钥环是已知公有密钥的集合。验证公有密钥的真实性后，您可以使用它来验证应用程序的签名。

**Topics**
+ [验证并导入公有密钥](#ec2rl_authenticate)
+ [验证软件包的签名](#ec2rl_verify_signature)

### 验证并导入公有密钥
<a name="ec2rl_authenticate"></a>

本流程的下一步是验证 EC2Rescue for Linux 公有密钥，并在 GPG 密钥环中将其添加为可信任密钥。

**验证并导入 EC2Rescue for Linux 公有密钥**

1. 在命令提示符处，使用以下命令获取我们的公共 GPG 生成密钥的副本：

   ```
   curl -O https://s3.amazonaws.com/ec2rescuelinux/ec2rl.key
   ```

1. 在保存 `ec2rl.key` 的目录中的命令提示符处，使用以下命令将 EC2Rescue for Linux 公有密钥导入密钥环：

   ```
   gpg2 --import ec2rl.key
   ```

   该命令返回的结果类似于下方内容：

   ```
   gpg: /home/ec2-user/.gnupg/trustdb.gpg: trustdb created
   gpg: key 2FAE2A1C: public key "ec2autodiag@amazon.com <EC2 Rescue for Linux>" imported
   gpg: Total number processed: 1
   gpg:               imported: 1  (RSA: 1)
   ```
**提示**  
如果您看到指示找不到该命令的错误，请使用 `apt-get install gnupg2`（基于 Debian 的 Linux）或 `yum install gnupg2`（基于 Red Hat 的 Linux）安装 GnuPG 实用程序。

### 验证软件包的签名
<a name="ec2rl_verify_signature"></a>

在安装 GPG 工具、验证并导入 EC2Rescue for Linux 公有密钥以及确认 EC2Rescue for Linux 公有密钥可信后，便可以验证 EC2Rescue for Linux 安装脚本的签名。

**验证 EC2Rescue for Linux 安装脚本签名**

1. 在命令提示符处，运行以下命令以下载安装脚本的签名文件：

   ```
   curl -O https://s3.amazonaws.com/ec2rescuelinux/ec2rl.tgz.sig
   ```

1. 通过在保存 `ec2rl.tgz.sig` 和 EC2Rescue for Linux 安装文件的目录中的命令提示符处运行以下命令来验证签名。这两个文件都必须存在。

   ```
   gpg2 --verify ./ec2rl.tgz.sig
   ```

   输出应与以下内容类似：

   ```
   gpg: Signature made Thu 12 Jul 2018 01:57:51 AM UTC using RSA key ID 6991ED45
   gpg: Good signature from "ec2autodiag@amazon.com <EC2 Rescue for Linux>"
   gpg: WARNING: This key is not certified with a trusted signature!
   gpg:          There is no indication that the signature belongs to the owner.
   Primary key fingerprint: E528 BCC9 0DBF 5AFA 0F6C  C36A F780 4843 2FAE 2A1C
        Subkey fingerprint: 966B 0D27 85E9 AEEC 1146  7A9D 8851 1153 6991 ED45
   ```

   如果输出包含短语 `Good signature from "ec2autodiag@amazon.com <EC2 Rescue for Linux>"`，则意味着已成功验证签名，您可以继续运行 EC2Rescue for Linux 安装脚本。

   如果输出包含短语 `BAD signature`，则检查是否正确执行了此过程。如果您持续获得此响应，请联系 Amazon Web Services，而不要运行之前下载的安装文件。

下面是有关您可能看到的警告的详细信息：
+ **WARNING: This key is not certified with a trusted signature\! There is no indication that the signature belongs to the owner.**这表示您坚信自己拥有 EC2Rescue for Linux 的可信公有密钥的个人信任级别。理想情况下，您将前往 Amazon Web Services 办公室并亲自接收此密钥。但更常见的情况是，从网站下载此密钥。在这种情况下，该网站是 Amazon Web Services 网站。
+ **gpg2: no ultimately trusted keys found.** 这意味着您 (或您信任的其他人) 对特定密钥不是“绝对信任”。

有关更多信息，请参阅 [https://www.gnupg.org/](https://www.gnupg.org/)。
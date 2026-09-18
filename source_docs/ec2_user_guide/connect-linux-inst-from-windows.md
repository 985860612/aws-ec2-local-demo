

# 使用 PuTTY 连接到 Linux 实例
<a name="connect-linux-inst-from-windows"></a>

适用于 Windows 的免费 SSH 客户端 PuTTY 可用于连接 Linux 实例。

如果运行的是 Windows Server 2019 或更高版本，建议使用 OpenSSH（这是一款使用 SSH 协议进行远程登录的开源连接工具）。

**注意**  
如果您在尝试连接到您的实例时收到错误，请确保您的实例满足所有 [SSH 连接先决条件](connect-linux-inst-ssh.md#ssh-prereqs-linux-from-linux-macos) 要求。如果它满足所有先决条件，但您仍然无法连接到 Linux 实例，请参阅[排查 Amazon EC2 Linux 实例的连接问题](TroubleshootingInstancesConnecting.md)。

**Topics**
+ [前提条件](#putty-prereqs)
+ [使用 PuTTYgen 转换私有密钥](#putty-private-key)
+ [连接到您的 Linux 实例](#putty-ssh)

## 前提条件
<a name="putty-prereqs"></a>

使用 PuTTY 连接到 Linux 实例之前，请先完成以下任务。

**完成一般先决条件。**  
+ 检查您的实例是否通过了状态检查。可能需要花几分钟时间，实例才能准备好接受连接请求。有关更多信息，请参阅 [查看状态检查](viewing_status.md)。
+ [获取所需的实例详细信息](connection-prereqs-general.md#connection-prereqs-get-info-about-instance).
+ [查找私有密钥并设置权限](connection-prereqs-general.md#connection-prereqs-private-key).
+ [（可选）获取实例指纹](connection-prereqs-general.md#connection-prereqs-fingerprint).

**允许来自您 IP 地址的入站 SSH 流量。**  
确保与您的实例关联的安全组允许来自您的 IP 地址的入站 SSH 流量。有关更多信息，请参阅 [用于从您的计算机连接到实例的规则](security-group-rules-reference.md#sg-rules-local-access)。

**在本地计算机上安装 PuTTY（如果需要）。**  
从 [PuTTY 下载页面](https://www.chiark.greenend.org.uk/~sgtatham/putty/)下载 PuTTY 并安装。如果您安装的是早期版本的 PuTTY，建议您下载最新版本。确保安装整个套件。

**使用 PuTTYgen 将私有密钥转换为 PPK 格式。**  
必须指定启动实例时指定的密钥对的私有密钥。如果创建了.pem 格式的私有密钥，则必须将其转换为 PPK 文件，才能与 PuTTY 一起使用。找到私有密钥（.pem 文件），然后按照[使用 PuTTYgen 转换私有密钥](#putty-private-key)中的步骤操作。

## （可选）使用 PuTTYgen 转换私有密钥
<a name="putty-private-key"></a>

PuTTY 自身并不支持适用于 SSH 密钥的 PEM 格式。PuTTY 提供一种名为 PuTTYgen 的工具，该工具可以将 PEM 密钥转换为 PuTTY 所需的 PPK 格式。如果使用 PEM 格式而非 PPK 格式创建了密钥，则必须将私有密钥（.pem 文件）转换为此格式（.ppk 文件），才能与 PuTTY 一起使用。

**将私有密钥 从 PEM 格式转换为 PPK 格式**

1. 从 **Start (开始)** 菜单中，依次选择 **All Programs (所有程序)**、**PuTTY**、**PuTTYgen**。

1. 在 **Type of key to generate** 下，选择 ** RSA**。如果您的 PuTTYgen 版本不包含此选项，请选择 **SSH-2 RSA**。  
![PuTTYgen 中的 RSA 密钥。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/puttygen-key-type.png)

1. 选择 **Load**。默认情况下，PuTTYgen 仅显示扩展名为 `.ppk` 的文件。要找到您的 `.pem` 文件，请选择显示所有类型的文件的选项。  
![文件类型筛选条件设置为“所有文件”。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/puttygen-load-key.png)

1. 选择在启动实例时指定的密钥对的 `.pem` 文件，然后选择**打开**。PuTTYgen 显示一个通知，即 `.pem` 文件已导入成功。选择 **OK (确定)**。

1. 要以 PuTTY 可以使用的格式保存密钥，请选择 **Save private key (保存私有密钥)**。PuTTYgen 显示一条关于在没有密码的情况下保存密钥的警告。选择**是**。
**注意**  
私有密钥上的密码提供额外一层保护。即使发现了您的私有密钥，也不能在没有密码的情况下使用该密钥。使用密码的缺点是自动化更难实现，因为需要人工干预以登录到实例或将文件复制到实例中。

1. 为密钥指定您用于密钥对的相同名称（例如 `key-pair-name`）并选择 **Save (保存)**。PuTTY 会自动添加 `.ppk` 文件扩展名。

您的私有密钥格式现在是正确的 PuTTY 使用格式了。您现在可以使用 PuTTY 的 SSH 客户端连接到实例。

## 连接到您的 Linux 实例
<a name="putty-ssh"></a>

通过以下过程使用 PuTTY 连接到您的 Linux 实例。您需要使用为私有密钥创建的 `.ppk` 文件。有关更多信息，请参阅上一个部分中的[（可选）使用 PuTTYgen 转换私有密钥](#putty-private-key)。如果您在尝试连接到实例时收到错误，请参阅 [排查 Amazon EC2 Linux 实例的连接问题](TroubleshootingInstancesConnecting.md)。

**最后测试版本** – PuTTY .78

**使用 PuTTY 连接到您的实例**

1. 启动 PuTTY（从**开始**菜单中，搜索 **PuTTY**，然后选择**打开**）。

1. 在 **Category** 窗格中，选择 **Session** 并填写以下字段：

   1. 在**主机名**框中，执行以下操作之一：
      + （公有 DNS）要使用实例的公有 DNS 名称进行连接，请输入 {{instance-user-name}}@{{instance-public-dns-name}}。
      + （IPv6）或者，如果实例具有 IPv6 地址，要使用实例的 IPv6 地址进行连接，请输入 {{instance-user-name}}@{{2001:db8::1234:5678:1.2.3.4}}。

      有关如何获取实例的用户名以及实例的公有 DNS 名称或 IPv6 地址的信息，请参阅[获取所需的实例详细信息](connection-prereqs-general.md#connection-prereqs-get-info-about-instance)。

   1. 确保**端口**值为 22。

   1. 在**连接类型**下，选择 **SSH**。  
![PuTTY 配置 – 会话。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/putty-session-config.png)

1. (可选) 您可以配置 PuTTY 以定期自动发送“保持连接”数据以将会话保持活动状态。要避免由于会话处于不活动状态而与实例断开连接，这是非常有用的。在**类别** 窗格中，选择**连接**，然后在 **keepalives 之间的秒数**中输入所需的间隔。例如，如果您的会话在处于不活动状态 10 分钟后断开连接，请输入 180 以将 PuTTY 配置为每隔 3 分钟发送一次保持活动数据。

1. 在**类别**窗格中，依次展开**连接**、**SSH** 和 **Auth**。选择**凭证**。

1. 在**用于身份验证的私有密钥文件**旁，选择**浏览**。在**选择私有密钥文件**对话框中，选择您为密钥对生成的 `.ppk` 文件。您可以打开该文件，也可以在**选择私有密钥文件**对话框中选择**打开**。

1. （可选）如果打算在此会话后再次连接到此实例，则可以保存此会话信息以便日后使用。在**类别**窗格中，选择**会话**。在**已保存的会话**中输入会话名称，然后选择**保存**。

1. 要连接到实例，请选择**打开**。

1. 如果这是第一次连接到该实例，PuTTY 将显示安全警报对话框，以询问您是否信任要连接到的主机。

   1. (可选) 验证安全警报对话框中的指纹是否与您之前在 [（可选）获取实例指纹](connection-prereqs-general.md#connection-prereqs-fingerprint) 中获得的指纹相匹配。如果这些指纹不匹配，则表示有人可能在试图实施“中间人”攻击。如果匹配，请继续到下一步。

   1. 选择 **Accept (接受)**。将打开一个窗口，并且您连接到实例。
**注意**  
如果您在将私有密钥转换成 PuTTY 格式时指定了密语，当您登录到实例时，您必须提供该密语。

如果您在尝试连接到实例时收到错误，请参阅 [排查 Amazon EC2 Linux 实例的连接问题](TroubleshootingInstancesConnecting.md)。
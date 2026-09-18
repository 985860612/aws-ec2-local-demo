

# 使用 RDP 客户端连接到 Windows 实例
<a name="connect-rdp"></a>

您可以使用 RDP 客户端连接到 Windows 实例，如下所示。

**提示**  
或者，您可以使用 [Systems Manager Fleet Manager](connect-rdp-fleet-manager.md) 或 [EC2 Instance Connect Endpoint](connect-with-ec2-instance-connect-endpoint.md) 连接到 Windows 实例。

## 先决条件
<a name="rdp-prereqs"></a>

必须满足以下先决条件，才能使用 RDP 客户端连接到 Windows 实例。
+ **完成一般先决条件。**
  + 检查您的实例是否通过了状态检查。可能需要花几分钟时间，实例才能准备好接受连接请求。有关更多信息，请参阅 [查看状态检查](viewing_status.md)。
  + [获取所需的实例详细信息](connection-prereqs-general.md#connection-prereqs-get-info-about-instance).
  + [查找私有密钥并设置权限](connection-prereqs-general.md#connection-prereqs-private-key).
  + [（可选）获取实例指纹](connection-prereqs-general.md#connection-prereqs-fingerprint).
+ **安装 RDP 客户端。**
  + （Windows）默认情况下，Windows 包含一个 RDP 客户端。要进行验证，请在命令提示符窗口键入 **mstsc**。如果您的计算机不能识别此命令，请从 Microsoft Store 下载 [Microsoft Remote Desktop 应用程序](https://apps.microsoft.com/detail/9wzdncrfj3ps)。
  + （macOS X）从 Mac App Store 下载 [Windows App for Mac（此前名为 Microsoft Remote Desktop）](https://apps.apple.com/us/app/windows-app/id1295203466?mt=12)。
  + （Linux）使用 [Remmina](https://remmina.org/)。
+ **允许来自您 IP 地址的入站 RDP 流量。**

  确保与实例关联的安全组允许来自您 IP 地址的传入 RDP 流量。有关更多信息，请参阅 [用于从您的计算机连接到实例的规则](security-group-rules-reference.md#sg-rules-local-access)。

## 检索管理员密码
<a name="retrieve-initial-admin-password"></a>

如果您已将实例加入域，则可以使用 Directory Service 中的域凭证来连接自己的实例。在远程桌面登录屏幕上，将完全限定用户名用于管理员（例如 **corp.example.com\\Admin**），将密码用于此账户，而不是使用本地计算机名称和生成的密码。

要使用 RDP 连接到 Windows 实例，您必须检索初始管理员密码，然后在连接到实例时输入此密码。此密码在实例启动几分钟之后才可用。您的账户必须拥有调用 [GetPasswordData](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_GetPasswordData.html) 操作的权限。有关更多信息，请参阅 [用于控制访问 Amazon EC2 API 的示例策略](ExamplePolicies_EC2.md)。

管理员账户的默认用户名取决于 AMI 中包含的操作系统（OS）的语言。要确定正确的用户名，请识别操作系统的语言，然后选择相应的用户名。例如，对于英语操作系统，用户名是 `Administrator`；对于法语操作系统，用户名是 `Administrateur`；对于葡萄牙语操作系统，则是 `Administrador`。如果某个语言版本的操作系统没有相同语言的用户名，请选择用户名 `Administrator (Other)`。有关更多信息，请参阅 Microsoft 网站中的 [Localized Names for Administrator Account in Windows](https://learn.microsoft.com/en-us/archive/technet-wiki/13813.localized-names-for-administrator-account-in-windows)。

**检索初始管理员密码**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择该实例，然后选择 **Connect** (连接)。

1. 在**连接到实例**页面上，选择 **RDP 客户端**选项卡。

1. 在**用户名**中，选择管理员账户的默认用户名。您选择的用户名必须与用于启动实例的 AMI 中包含的操作系统（OS）语言相匹配。如果没有与操作系统相同语言的用户名，请选择**管理员（其他）**。

1. 选择**获取密码**。

1. 在**获取 Windows 密码**页面上，执行以下操作：

   1. 选择**上传私有密钥文件**，然后导航至您启动实例时指定的私有密钥（`.pem`）文件。选择文件并选择 **Open**（打开），以便将文件的全部内容复制到此窗口。

   1. 选择**解密密码**。**获取 Windows 密码**页面将关闭，实例的默认管理员密码将显示在**密码**下，替换先前显示的**获取密码**链接。

   1. 复制密码并将其保存在安全的位置。需要使用此密码连接实例。

## 连接到 Windows 实例
<a name="connecting-to-windows-instance-rdp-client"></a>

以下过程使用适用于 Windows 的远程桌面连接客户端（MSTSC）。如果使用的是其他 RDP 客户端，请下载 RDP 文件，然后查看 RDP 客户端的文档，了解建立 RDP 连接的步骤。

**使用 RDP 客户端连接到 Windows 实例**

1. 在**连接到实例**页面上，选择**下载远程桌面文件**。完成文件下载后，选择**取消**，然后返回**实例**页面。RDP 文件已下载到 `Downloads` 文件夹。

1. 运行 `mstsc.exe` 来打开 RDP 客户端。

1. 展开**显示选项**，选择**打开**，然后从 `Downloads` 文件夹中选择.rdp 文件。

1. 默认情况下，**计算机**是实例的公有 IPv4 DNS 名称，**用户名**是管理员账户。要改用 IPv6 连接到实例，请将实例的公有 IPv4 DNS 名称替换为其 IPv6 地址。查看默认设置并根据需要进行更改。

1. 选择**连接**。如果收到一条警告，指出远程连接发布者未知，请选择**连接**继续进行操作。

1. 输入之前保存的密码，然后选择**确定**。

1. 由于自签名证书的固有特性，您可能会看到一条警告，指出无法验证该安全证书。请执行以下操作之一：
   + 如果您信任该证书，则请选择**是**连接到您的实例。
   + [Windows] 在继续操作之前，请将证书的指纹与系统日志中的值进行比较，以确认远程计算机的身份。选择**查看证书**，然后从**详细信息**选项卡选择**指纹**。将此值与**操作**、**监控和故障排除**、**获取系统日志**中的 `RDPCERTIFICATE-THUMBPRINT` 值进行比较。
   + [Mac OS X] 在继续操作之前，请将证书的指纹与系统日志中的值进行比较，以确认远程计算机的身份。选择**显示证书**，展开**详细信息**，然后选择 **SHA1 指纹**。将此值与**操作**、**监控和故障排除**、**获取系统日志**中的 `RDPCERTIFICATE-THUMBPRINT` 值进行比较。

1. 如果 RDP 连接成功，RDP 客户端会先显示 Windows 登录屏幕，再显示 Windows 桌面。如果收到错误消息，请参阅[远程桌面无法连接到远程计算机](troubleshoot-connect-windows-instance.md#rdp-issues)。完成 RDP 连接后，可以关闭 RDP 客户端。

## 配置用户账户
<a name="configure-admin-accounts"></a>

通过 RDP 连接到实例之后，建议执行以下任务：
+ 更改默认的管理员密码。您可以[在登录实例本身后更改密码](https://support.microsoft.com/en-us/windows/change-or-reset-your-windows-password-8271d17c-9f9e-443f-835a-8318c8f68b9c)，其做法与任何电脑运行的 Windows Server 上的做法类似。
+ 在实例上创建另一个具有管理员权限的用户。这是一种保护措施，以防止您万一忘记管理员密码或管理员账户出现问题。新用户必须拥有远程访问实例的权限。通过右键单击 Windows 桌面上或文件资源管理器中的**此电脑**图标并选择**属性**，打开**系统属性**。选择**远程设置**，然后选择**选择用户**以将用户添加到**远程桌面用户**组。  
![“系统属性”窗口。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/windows-connect-properties-rdp.png)
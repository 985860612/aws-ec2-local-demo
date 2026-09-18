

# 开始使用 Amazon EC2
<a name="EC2_GetStarted"></a>

利用本教程开始使用 Amazon Elastic Compute Cloud (Amazon EC2)。您将了解如何启动和连接到 EC2 实例。*实例*是 AWS 云中的虚拟服务器。您可以使用 Amazon EC2 来创建和配置在实例上运行的操作系统和应用程序。

**概述**

下图演示了本教程中将使用的主要组件：
+ **映像**：包含要在您的实例上运行的软件（例如操作系统）的模板。
+ **密钥对**：您在连接到实例时用于证明个人身份的一组安全凭证。公有密钥在您的实例上，而私有密钥在您的计算机上。
+ **网络**：虚拟私有云（VPC）是专用于您的 AWS 账户的虚拟网络。为帮助您快速开始使用，您的账户在每个 AWS 区域中都附带一个默认 VPC，并且每个默认 VPC 在每个可用区中都有一个默认子网。
+ **安全组**：充当虚拟防火墙，以控制入站和出站流量。
+ **EBS 卷**：映像需要根卷。您可以选择性地添加数据卷。

![具有安全组、密钥对和 EBS 根卷的实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/get-started-diagram.png)


**本教程费用**  
创建 AWS 账户后，您可以通过 [AWS Free Tier](https://aws.amazon.com/free/)开始免费使用 Amazon EC2。

如果您在 2025 年 7 月 15 日之前创建了 AWS 账户，其使用时间未满 12 个月，且尚未超出 Amazon EC2 的免费套餐权益，则完成本教程无需支付任何费用，因为本教程将帮助您选择免费套餐权益范围内的选项。否则，从启动实例之时起至您终止实例之时止，您需要支付标准的 Amazon EC2 使用费（即使实例处于空闲状态也不例外）。

如果您是在 2025 年 7 月 15 日当天或之后创建的 AWS 账户，其使用时间未满 6 个月，且尚未用完所有服务抵扣金，则完成本教程无需支付任何费用，因为本教程将帮助您选择免费套餐权益范围内的选项。

有关如何确定您是否符合免费套餐资格的信息，请参阅[跟踪 Amazon EC2 免费套餐使用情况](ec2-free-tier-usage.md)。

**Topics**
+ [步骤 1：启动实例](#ec2-launch-instance)
+ [步骤 2：连接到您的实例](#ec2-connect-to-instance)
+ [步骤 3：清除您的实例](#ec2-clean-up-your-instance)
+ [后续步骤](#ec2-next-steps)

## 步骤 1：启动实例
<a name="ec2-launch-instance"></a>

您可以根据以下过程所述使用 AWS 管理控制台 启动 EC2 实例。本教程旨在帮助您快速启动第一个实例，因此不会涵盖所有可能的选项。

**启动实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在屏幕顶部的导航栏中，将显示当前 AWS 区域，例如**俄亥俄州**。您可以使用所选区域，也可以选择离您更近的区域。

1. 从 EC2 控制台控制面板的**启动实例**窗格中，选择**启动实例**。

1. 在 **Name and tags**（名称与标签）下，为 **Name**（名称）输入实例的描述性名称。

1. 在 **Application and OS Images (Amazon Machine Image)**（应用程序和操作系统映像 (Amazon Machine Image)）中，执行以下操作：

   1. 选择**快速启动**，然后为您的实例选择操作系统（OS）。对于您的第一个 Linux 实例，我们建议您选择 Amazon Linux。

   1. 从**亚马逊机器映像（AMI）**中，选择标记为**符合免费套餐资格**的 AMI。

1. 在**实例类型**下，对于**实例类型**，选择标记为**符合免费套餐资格**的实例类型。

1. 在**密钥对（登录）**下，对于**密钥对名称**，选择一个现有密钥对，或选择**创建新密钥对**以创建您的第一个密钥对。
**警告**  
如果您选择**在没有密钥对的情况下继续（不推荐）**，则将无法使用本教程中所述的方法连接到您的实例。

1. 在**网络设置**下，请注意已选择默认 VPC，可以选择使用为您选择的可用区中的默认子网以及一个安全组，该安全组包含一条允许从任何位置（`0.0.0.0/0`）连接到实例的规则。
**警告**  
如果您指定 `0.0.0.0/0`，则会启用来自世界上任何 IP 地址的流量。对于 SSH 和 RDP 协议，您可能考虑这在测试环境下短时间内是可以接受的，但它对于生产环境并不安全。对于生产环境，请确保仅授权从适当的单个 IP 地址或地址范围进行访问。

   对于第一个实例，我们建议您使用默认设置。否则，您可以按如下方式更新网络设置：
   + （可选）要使用特定的默认子网，请选择**编辑**，然后选择一个子网。
   + （可选）要使用不同的 VPC，请选择**编辑**，然后选择现有 VPC。如果 VPC 没有配置为公有互联网访问，则您将无法连接到您的实例。
   + （可选）要限制特定网络的入站连接流量，请选择**自定义**而不是**任何位置**，然后输入您的网络的 CIDR 块。
   + （可选）要使用其他安全组，请选择**选择现有安全组**，然后选择现有的安全组。如果安全组没有允许来自网络的连接流量的规则，则您将无法连接到实例。对于 Linux 实例，您必须允许 SSH 流量。对于 Windows 实例，您必须允许 RDP 流量。

1. 在**配置存储**下，请注意系统已配置根卷，但未配置数据卷。这对于测试目的来说已经足够了。

1. 查看 **Summary**（摘要）面板中您的实例配置的摘要，当您准备好后，选择 **Launch instance**（启动实例）。

1. 如果启动成功，则请从**成功**通知中选择该实例的 ID 以打开**实例**页面并监控启动状态。

1. 选中该实例的复选框。初始实例状态为 `pending`。实例启动后，其状态将更改为 `running`。选择**状态和警报**选项卡。在您的实例通过其状态检查后，该实例就可以接收连接请求了。

## 步骤 2：连接到您的实例
<a name="ec2-connect-to-instance"></a>

您使用的过程取决于实例的操作系统。如果您无法连接到实例，请参阅[排查 Amazon EC2 Linux 实例的连接问题](TroubleshootingInstancesConnecting.md)以获得帮助。

### Linux 实例
<a name="ec2-connect-to-instance-linux"></a>

您可以使用任何 SSH 客户端连接到您的 Linux 实例。如果您的计算机上运行的是 Windows，则请打开终端并运行 `ssh` 命令，以验证是否安装了 SSH 客户端。如果找不到该命令，[则请安装适用于 Windows 的 OpenSSH](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse?tabs=gui#install-openssh-for-windows)。

**使用 SSH 连接到您的实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择该实例，然后选择 **Connect** (连接)。

1. 在**连接到实例**页面上，选择 **SSH 客户端**选项卡。

1. （可选）如果您在启动实例时创建了密钥对，并将私有密钥（.pem 文件）下载到运行 Linux 或 macOS 的计算机，则请运行示例 **chmod** 命令来设置私有密钥的权限。

1. 复制示例 SSH 命令。以下是一个示例，其中 {{key-pair-name}}.pem 是私有密钥文件的名称，{{ec2-user}} 是与映像关联的用户名，@ 符号后的字符串是实例的公有 DNS 名称。

   ```
   ssh -i {{key-pair-name}}.pem {{ec2-user}}@{{ec2-198-51-100-1.us-east-2.compute.amazonaws.com}}
   ```

1. 在计算机的终端窗口，运行您在上一步中保存的 **ssh** 命令。如果私有密钥文件不在当前目录中，则必须在此命令中指定密钥文件的完全限定路径。

   以下为响应示例：

   ```
   The authenticity of host 'ec2-198-51-100-1.us-east-2.compute.amazonaws.com (198-51-100-1)' can't be established.
   ECDSA key fingerprint is l4UB/neBad9tvkgJf1QZWxheQmR59WgrgzEimCG6kZY.
   Are you sure you want to continue connecting (yes/no)?
   ```

1. （可选）验证安全警报中的指纹是否与您首次启动实例时控制台输出中包含的实例指纹相匹配。要获取控制台输出，请依次选择**操作**、**监控和故障排除**、**获取系统日志**。如果指纹不匹配，则表示有人可能在试图实施中间人攻击。如果匹配，请继续到下一步。

1. 输入 **yes**。

   以下为响应示例：

   ```
   Warning: Permanently added 'ec2-198-51-100-1.us-east-2.compute.amazonaws.com' (ECDSA) to the list of known hosts.
   ```

### Windows 实例
<a name="ec2-connect-to-instance-windows"></a>

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

## 步骤 3：清除您的实例
<a name="ec2-clean-up-your-instance"></a>

**警告**  
**终止实例是永久且不可逆转的。**  
终止一个实例后，您将无法再连接到该实例，而且也无法对其进行恢复操作。被配置为在终止后删除的所有连接的 Amazon EBS 卷也将被永久删除并且无法恢复。实例存储卷中存储的所有数据将永久丢失。有关更多信息，请参阅 [实例终止的工作原理](how-ec2-instance-termination-works.md)。  
在终止实例之前，请务必确保已将需要在终止后保留的所有数据备份到持久存储中。

在您完成为本教程创建的实例后，应通过终止该实例进行清除。如果在清除该实例前要对其执行更多操作，请参阅[后续步骤](#ec2-next-steps)。

一旦实例变为 `shutting down` 或 `terminated` 状态，该实例就会停止产生费用，或使用量计入免费套餐限制。若要保留实例以供将来使用，但又不产生费用或使用量计入免费套餐限制，您可以立即停止实例，稍后再重新启动。有关更多信息，请参阅 [启动和停止 Amazon EC2 实例](Stop_Start.md)。

**要终止您的实例，请执行以下操作：**

1. 在导航窗格中，选择 **Instances (实例)**。在实例列表中选择实例。

1. 依次选择**实例状态**、**终止（删除）实例**。

1. 当系统提示您确认时，选择**终止（删除）**。

   Amazon EC2 关闭并终止您的实例。您的实例在终止之后，短时间内仍将在控制台上可见，然后该条目将自动删除。您不能自己从控制台显示中删除已终止的实例。

## 后续步骤
<a name="ec2-next-steps"></a>

启动实例后，您可能想要探索以下后续步骤：
+ 借助入门教程了解 Amazon EC2 的核心概念。有关更多信息，请参阅 [EC2 实例的启动教程](ec2-instance-launch-tutorials.md)。
+ 了解如何使用控制台跟踪 Amazon EC2 免费套餐使用情况。有关更多信息，请参阅 [跟踪 Amazon EC2 免费套餐使用情况](ec2-free-tier-usage.md)。
+ 配置 CloudWatch 警报以在您的使用量超出免费套餐时向您发出通知（适用于在 2025 年 7 月 15 日之前创建的账户）。有关更多信息，请参阅《AWS Billing 用户指南》**中的[跟踪您的 AWS Free Tier 使用情况](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/tracking-free-tier-usage.html)。
+ 添加 EBS 卷。有关更多信息，请参阅《Amazon EBS 用户指南》**中的[创建 Amazon EBS 卷](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-volume.html)。
+ 了解如何使用 Run 命令远程管理您的 EC2 实例。有关更多信息，请参阅 *AWS Systems Manager 用户指南*中的 [AWS Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html)。
+ 了解实例购买选项。有关更多信息，请参阅 [Amazon EC2 账单和购买选项](instance-purchasing-options.md)。
+ 获取有关实例类型的建议。有关更多信息，请参阅 [从 EC2 实例类型查找器获取建议](get-ec2-instance-type-recommendations.md)。
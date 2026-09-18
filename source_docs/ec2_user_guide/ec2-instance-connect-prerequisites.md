

# EC2 Instance Connect 的先决条件
<a name="ec2-instance-connect-prerequisites"></a>

**Topics**
+ [安装 EC2 Instance Connect](#eic-prereqs-install-eic-on-instance)
+ [保障网络连接质量](#eic-prereqs-network-access)
+ [允许 EC2 实例连接代理的出站流量](#eic-prereqs-browser-network)
+ [允许入站 SSH 流量](#ec2-instance-connect-setup-security-group)
+ [授予权限](#eic-prereqs-grant-permissions)
+ [在本地计算机上安装 SSH 客户端](#eic-prereqs-install-ssh-client)
+ [满足用户名要求](#eic-prereqs-username)

## 安装 EC2 Instance Connect
<a name="eic-prereqs-install-eic-on-instance"></a>

要使用 EC2 Instance Connect 连接到实例，该实例必须安装 EC2 Instance Connect。您可以使用预装 EC2 Instance Connect 的 AMI 启动实例，也可以在使用支持的 AMI 启动的实例上安装 EC2 Instance Connect。有关更多信息，请参阅 [在您的 EC2 实例上安装 EC2 Instance Connect](ec2-instance-connect-set-up.md)。

## 保障网络连接质量
<a name="eic-prereqs-network-access"></a>

可以将实例配置为允许用户通过互联网或通过实例的私有 IP 地址连接到您的实例。根据您的用户使用 EC2 Instance Connect 连接到实例的方式，您必须配置以下网络访问：
+ 如果用户通过互联网连接到您的实例，则实例必须具有一个公有 IPv4 或 IPv6 地址，并且位于具有互联网路由的公有子网中。如果您尚未修改默认的公有子网，则其包含的互联网路由仅适用于 IPv4，而不适用于 IPv6。有关更多信息，请参阅《Amazon VPC 用户指南》中的[使用互联网网关启用 VPC 互联网访问](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html#vpc-igw-internet-access)**。
+ 如果用户要通过实例的私有 IPv4 地址连接到您的实例，则必须建立与您的 VPC 的私有网络连接，例如使用 AWS Direct Connect、AWS Site-to-Site VPN 或 VPC 对等连接，以便用户能够访问实例的私有 IP 地址。

如果您的实例没有公有 IPv4 或 IPv6 地址，并且您不希望按照上述方式配置网络访问权限，则可以考虑将 EC2 Instance Connect 端点作为 EC2 Instance Connect 的替代方案。借助 EC2 Instance Connect 端点，您可以通过 SSH 或 RDP 连接到实例，即使实例没有公有 IPv4 或 IPv6 地址。有关更多信息，请参阅 [使用 Amazon EC2 控制台连接到您的 Linux 实例](connect-using-eice.md#connect-using-the-ec2-console)。

## 允许 EC2 实例连接代理的出站流量
<a name="eic-prereqs-browser-network"></a>

当您使用 Amazon EC2 控制台连接到实例时，您的浏览器会通过端口 443 向特定区域端点的 EC2 Instance Connect 代理服务建立 WebSocket 连接。

端点格式取决于[分区](https://docs.aws.amazon.com/glossary/latest/reference/glos-chap.html#partition)：
+ 商用 AWS 区域和 AWS GovCloud（美国）区域使用端点格式：`prod.{{region}}.oneclickv2-proxy.ec2.aws.dev`。
+ 中国区域使用端点格式：`prod.{{region}}.oneclickv2-proxy.ec2.a2z.org.cn`。

以下示例显示了每个分区的端点：
+ 对于美国东部（弗吉尼亚州北部）区域，端点为 `prod.us-east-1.oneclickv2-proxy.ec2.aws.dev`。
+ 对于中国（北京）区域， 端点为 `prod.cn-north-1.oneclickv2-proxy.ec2.a2z.org.cn`。

**注意**  
您的浏览器必须能够访问此端点。如果防火墙或 VPN 阻止了连接，则连接将失败。

## 允许入站 SSH 流量
<a name="ec2-instance-connect-setup-security-group"></a>

**使用 Amazon EC2 控制台连接到实例时**  
当用户使用 Amazon EC2 控制台连接到实例时，必须允许到达实例的流量是来自 EC2 Instance Connect 服务的流量。该服务由特定的 IP 地址范围标识，AWS 通过前缀列表来管理这些地址范围。您必须创建一个安全组，以允许来自 EC2 Instance Connect 服务的入站 SSH 流量。要进行此配置，对于入站规则，请在**来源**旁的字段中，选择 EC2 Instance Connect 前缀列表。

AWS 为每个区域的 IPv4 和 IPv6 地址提供了不同的托管前缀列表。EC2 Instance Connect 前缀列表的名称如下，请将 {{region}} 替换为区域代码：
+ IPv4 前缀列表名称：`com.amazonaws.{{region}}.ec2-instance-connect`
+ IPv6 前缀列表名称：`com.amazonaws.{{region}}.ipv6.ec2-instance-connect`

有关创建安全组的说明，请参阅 [任务 2：允许从 EC2 Instance Connect 服务到实例的入站流量](ec2-instance-connect-tutorial.md#eic-tut1-task2)。有关更多信息，请参阅《Amazon VPC 用户指南》中的[可用的 AWS 托管前缀列表](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-aws-managed-prefix-lists.html#available-aws-managed-prefix-lists)**。

**使用 CLI 或 SSH 连接到实例时**  
确保与您实例关联的安全组[允许来自您 IP 地址端口 22 或您网络上的传入 SSH 流量](security-group-rules-reference.md#sg-rules-local-access)。默认情况下，VPC 的默认安全组不允许传入 SSH 流量。默认情况下，启动实例向导创建的安全组允许传入的 SSH 流量。有关更多信息，请参阅 [用于从您的计算机连接到实例的规则](security-group-rules-reference.md#sg-rules-local-access)。

## 授予权限
<a name="eic-prereqs-grant-permissions"></a>

您必须向使用 EC2 Instance Connect 连接到实例的每个 IAM 用户授予所需的权限。有关更多信息，请参阅 [为 EC2 Instance Connect 授予 IAM 权限](ec2-instance-connect-configure-IAM-role.md)。

## 在本地计算机上安装 SSH 客户端
<a name="eic-prereqs-install-ssh-client"></a>

如果您的用户使用 SSH 进行连接，他们必须确保其本地计算机具有 SSH 客户端。

用户的本地计算机可能已默认安装 SSH 客户端。他们可以通过在命令行键入 **ssh** 来检查 SSH 客户端。如果他们的本地计算机无法识别该命令，可安装 SSH 客户端。有关在 Linux 或 macOS X 上安装 SSH 客户端的信息，请参阅 [http://www.openssh.com](http://www.openssh.com/)。有关在 Windows 10 上安装 SSH 客户端的信息，请参阅 [Windows 中的 OpenSSH](https://learn.microsoft.com/en-us/windows-server/administration/OpenSSH/openssh-overview)。

如果用户仅使用 Amazon EC2 控制台连接到实例，则无需在本地计算机上安装 SSH 客户端。

## 满足用户名要求
<a name="eic-prereqs-username"></a>

使用 EC2 Instance Connect 连接到实例时，用户名必须满足以下要求：
+ 第一个字符：必须是字母（`A-Z`、`a-z`）、数字（`0-9`）或下划线（`_`）
+ 后续字符：可以是字母（`A-Z`、`a-z`）、数字 (`0-9`) 或以下字符：`@ . _ -`
+ 最小长度是 1 个字符
+ 最大长度为 31 个字符
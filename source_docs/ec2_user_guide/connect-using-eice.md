

# 使用 EC2 Instance Connect 端点连接到 Amazon EC2 实例
<a name="connect-using-eice"></a>

您可以使用 EC2 Instance Connect 端点连接到支持 SSH 或 RDP 的 Amazon EC2 实例。

**先决条件**
+ 您必须拥有连接到 EC2 Instance Connect Endpoint 所需的 IAM 权限。有关更多信息，请参阅 [使用 EC2 Instance Connect 端点连接到实例的权限](permissions-for-ec2-instance-connect-endpoint.md#iam-OpenTunnel)。
+ EC2 Instance Connect 端点必须处于以下状态之一：
  + 对于新端点为 **create-complete**
  + 对于进行修改的现有端点为 **update-in-progress**、**update-complete** 或 **update-failed**。修改端点时，该端点继续使用其原来的配置，直到状态更改为 **update-complete**。

    如果 VPC 没有 EC2 Instance Connect 端点，您可以创建一个。有关更多信息，请参阅 [创建 EC2 Instance Connect Endpoint](create-ec2-instance-connect-endpoints.md)。
+ EC2 Instance Connect 端点 IP 地址类型必须与实例的 IP 地址类型兼容。如果您的端点 IP 地址类型为双堆栈，则其可以同时适用于 IPv4 和 IPv6 地址。
+ （Linux 实例）要使用 Amazon EC2 控制台连接到您的实例，或者要使用 CLI 进行连接并让 EC2 Instance Connect 处理临时密钥，您的实例必须安装 EC2 Instance Connect。有关更多信息，请参阅 [安装 EC2 Instance Connect](ec2-instance-connect-set-up.md)。
+ 确保实例安全组允许来自 EC2 Instance Connect 端点的入站 SSH 流量。有关更多信息，请参阅 [目标实例安全组规则](eice-security-groups.md#resource-security-group-rules)。

**Topics**
+ [使用 Amazon EC2 控制台连接到您的 Linux 实例](#connect-using-the-ec2-console)
+ [使用 SSH 连接到 Linux 实例](#eic-connect-using-ssh)
+ [使用 AWS CLI 通过其实例 ID 连接到 Linux 实例](#eic-connect-using-cli)
+ [使用 RDP 连接到 Windows 实例](#eic-connect-using-rdp)
+ [故障排除](#troubleshoot-eice)

## 使用 Amazon EC2 控制台连接到您的 Linux 实例
<a name="connect-using-the-ec2-console"></a>

可以使用 Amazon EC2 控制台（基于浏览器的客户端）连接到实例，如下所示。

**使用 Amazon EC2 控制台连接到实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择该实例，然后选择**连接**。

1. 选择 **EC2 Instance Connect** 选项卡。

1. 对于**连接类型**，选择**使用私有 IP 进行连接**。

1. 选择**私有 IPv4 地址**或 **IPv6 地址**。这些选项的可用性取决于分配给实例的 IP 地址。如果某个选项显示为灰色，则表示您的实例没有为其分配该类型的 IP 地址。

1. 对于 **EC2 Instance Connect 端点**，选择该 EC2 Instance Connect 端点的 ID。
**注意**  
EC2 Instance Connect 端点必须与您在上一步中选择的 IP 地址兼容。如果您的端点 IP 地址类型为双堆栈，则其可以同时适用于 IPv4 和 IPv6 地址。有关更多信息，请参阅 [创建 EC2 Instance Connect Endpoint](create-ec2-instance-connect-endpoints.md)。

1. 对于**用户名**，如果您用于启动实例的 AMI 使用的用户名不是 `ec2-user`，请输入正确的用户名。

1. 对于**最大隧道持续时间（秒）**，输入 SSH 连接允许的最大持续时间。

   该持续时间必须符合 IAM 策略中指定的任何 `maxTunnelDuration` 条件。如果您无权访问该 IAM 策略，请联系您的管理员。

1. 选择**连接**。这将为您的实例打开一个终端窗口。

## 使用 SSH 连接到 Linux 实例
<a name="eic-connect-using-ssh"></a>

您可以使用 SSH 连接到您的 Linux 实例，然后使用 `open-tunnel` 命令建立私有隧道。可在单连接或多连接模式下使用 `open-tunnel`。您可以指定实例 ID、私有 IPv4 地址或 IPv6 地址。

有关如何使用 AWS CLI 通过 SSH 连接到您的 Linux 实例，请参阅 [使用 AWS CLI进行连接](ec2-instance-connect-methods.md#connect-linux-inst-eic-cli-ssh)。

下面的示例使用了 [OpenSSH](https://www.openssh.com/)。您可以使用任何其他支持代理模式的 SSH 客户端。

### 单一 连接
<a name="ssh-single-connection"></a>

**仅允许使用 SSH 和 `open-tunnel` 命令建立到实例的单一连接**

按照如下所示使用 `ssh` 和 [open-tunnel](https://docs.aws.amazon.com/cli/latest/reference/ec2-instance-connect/open-tunnel.html) AWS CLI 命令。`-o` 代理命令包含创建通往实例的私有隧道的 `open-tunnel` 命令。

```
ssh -i {{my-key-pair}}.pem {{ec2-user}}@{{i-1234567890abcdef0}} \
    -o ProxyCommand='aws ec2-instance-connect open-tunnel --instance-id {{i-1234567890abcdef0}}'
```

对于：
+ `-i` - 指定用于启动实例的密钥对。
+ `{{ec2-user}}@{{i-1234567890abcdef0}}` - 指定用于启动实例的 AMI 的用户名和实例 ID。对于具有 IPv6 地址的实例，您必须指定 IPv6 地址而不是实例 ID。
+ `--instance-id` - 指定要连接到的实例的 ID。或者，指定 `%h`，它从用户那里提取实例 ID。对于具有 IPv6 地址的实例，请将 `--instance-id {{i-1234567890abcdef0}}` 替换为 `--private-ip-address {{2001:db8::1234:5678:1.2.3.4}}`。

### 多连接
<a name="ssh-multi-connection"></a>

要允许与一个实例建立多连接，请先运行 [open-tunnel](https://docs.aws.amazon.com/cli/latest/reference/ec2-instance-connect/open-tunnel.html) AWS CLI 命令开始侦听新的 TCP 连接，然后使用 `ssh` 创建到实例的新 TCP 连接和私有隧道。

**要使用 SSH 和 `open-tunnel` 命令允许建立到实例的多连接**

1. 运行以下命令开始侦听本地机器上指定端口上的新 TCP 连接。

   ```
   aws ec2-instance-connect open-tunnel \
       --instance-id {{i-1234567890abcdef0}} \
       --local-port {{8888}}
   ```

   预期输出：

   ```
   Listening for connections on port 8888.
   ```

1. 在*新的终端窗口*中，运行以下 `ssh` 命令以创建到实例的新 TCP 连接和私有隧道。

   ```
   ssh -i {{my-key-pair}}.pem ec2-user@localhost -p {{8888}}
   ```

   预期输出 - 在*第一个*终端窗口中，您将看到以下内容：

   ```
   [1] Accepted new tcp connection, opening websocket tunnel.
   ```

   您可能还会看到以下内容：

   ```
   [1] Closing tcp connection.
   ```

## 使用 AWS CLI 通过其实例 ID 连接到 Linux 实例
<a name="eic-connect-using-cli"></a>

如果仅知道实例 ID，则可以使用 [ec2-instance-connect ssh](https://docs.aws.amazon.com/cli/latest/reference/ec2-instance-connect/ssh.html) AWS CLI 命令通过 SSH 客户端连接到实例。有关更多信息，请参阅 [使用 AWS CLI进行连接](ec2-instance-connect-methods.md#connect-linux-inst-eic-cli-ssh)。

**先决条件**
+ 安装 AWS CLI 版本 2 并使用您的凭证对其进行配置。有关更多信息，请参阅《AWS Command Line Interface 用户指南》中的 [Install or update to the latest version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) 和 [Configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)**。
+ 或者，在其预先经过身份验证的 shell 中打开 AWS CloudShell 并运行 AWS CLI 命令。

**要使用实例 ID 和 EC2 Instance Connect Endpoint 连接到实例**  
如果仅知道实例 ID，请使用 [ec2-instance-connect ssh](https://docs.aws.amazon.com/cli/latest/reference/ec2-instance-connect/ssh.html) CLI 命令，并指定 `ssh` 命令、实例 ID 和 `--connection-type` 参数及 `eice` 值，以使用 EC2 Instance Connect 端点。如果实例只有 IPv6 地址，您还必须包含 `--instance-ip` 参数和 IPv6 地址。
+ 如果实例有私有 IPv4 地址（也可以有 IPv6 地址），则请使用以下命令和参数：

  ```
  aws ec2-instance-connect ssh \
      --instance-id {{i-1234567890example}} \
      --os-user {{ec2-user}} \
      --connection-type eice
  ```
+ 如果实例只有 IPv6 地址，则请包含 `--instance-ip` 参数和 IPv6 地址：

  ```
  aws ec2-instance-connect ssh \
      --instance-id {{i-1234567890example}} \
      --instance-ip {{2001:db8::1234:5678:1.2.3.4}} \
      --os-user {{ec2-user}} \
      --connection-type eice
  ```

**提示**  
如果出现错误，则请确保使用的是 AWS CLI 版本 2。`ssh` 参数仅适用于 AWS CLI 版本 2。有关更多信息，请参阅《*AWS Command Line Interface 开发人员指南*》中的[关于 AWS CLI 版本 2](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html#welcome-versions-v2)。

## 使用 RDP 连接到 Windows 实例
<a name="eic-connect-using-rdp"></a>

您可以在 EC2 Instance Connect Endpoint 上使用远程桌面协议（RDP）连接到没有公有 IPv4 地址或公有 DNS 名称的 Windows 实例。

**使用 RDP 客户端连接到 Windows 实例**

1. 完成[使用 RDP 连接到 Windows 实例](connect-rdp.md)中的步骤 1 至 8。在步骤 8 中下载 RDP 桌面文件后，您将收到**无法连接**的消息，这是意料之中的，因为您的实例没有公有 IP 地址。

1. 运行以下命令，建立到实例所在 VPC 的私有隧道。`--remote-port` 必须是 `3389`，因为 RDP 默认使用端口 3389。

   ```
   aws ec2-instance-connect open-tunnel \
       --instance-id {{i-1234567890abcdef0}} \
       --remote-port 3389 \
       --local-port {{any-port}}
   ```

1. 在**下载**文件夹中，找到您下载的 RDP 桌面文件，然后将其拖到 RDP 客户端窗口中。

1. 打开 RDP 桌面文件的上下文（右键单击）菜单，然后选择**编辑**。

1. 在**编辑 PC** 窗口中，对于 **PC 名称**（要连接到的实例），输入 `localhost:{{local-port}}`，其中 `{{local-port}}` 使用的值与在步骤 2 中指定的值相同，然后选择**保存**。

   请注意，以下**编辑 PC** 窗口的屏幕截图来自 Mac 上的 Microsoft 远程桌面。如果您使用的是 Windows 客户端，窗口可能会有所不同。  
![PC 名称字段中具有 localhost:5555 的 RDP 客户端。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ec2-instance-connect-endpoint-rdp.png)

1. 在 RDP 客户端中，打开（您刚才配置的）PC 的上下文（右键单击）菜单，然后选择**连接**以连接到您的实例。

1. 根据提示，输入管理员账户的解密密码。

## 故障排除
<a name="troubleshoot-eice"></a>

使用以下信息帮助您诊断和修复您在使用 EC2 Instance Connect Endpoint 连接实例时可能遇到的问题。

### 无法连接到您的实例
<a name="troubleshoot-eice-1"></a>

以下是您可能无法连接到实例的常见原因：
+ 安全组 – 检查分配给 EC2 Instance Connect Endpoint 和您的实例的安全组。有关所需安全组规则的更多信息，请参阅 [EC2 Instance Connect Endpoint 安全组](eice-security-groups.md)。
+ 实例状态 – 验证您的实例是否处于 `running` 状态。
+ 密钥对 – 如果您用于连接的命令需要私钥，请确认您的实例是否有公钥，以及您是否拥有相应的私钥。
+ IAM 权限 – 验证您是否拥有所需的 IAM 权限。有关更多信息，请参阅 [授予使用 EC2 Instance Connect 端点的权限](permissions-for-ec2-instance-connect-endpoint.md)。

有关 Linux 实例的更多故障排除技巧，请参阅 [排查 Amazon EC2 Linux 实例的连接问题](TroubleshootingInstancesConnecting.md)。有关 Windows 实例的故障排除技巧，请参阅 [排查连接到 Amazon EC2 Windows 实例时遇到的问题](troubleshoot-connect-windows-instance.md)。

### ErrorCode: AccessDeniedException
<a name="troubleshoot-eice-2"></a>

如果您收到 `AccessDeniedException` 错误，并且 IAM policy 中已指定 `maxTunnelDuration` 条件，确保当您连接到实例时指定 `--max-tunnel-duration` 参数。有关该参数的更多信息，请参阅 *AWS CLI 命令参考*中的 [open-tunnel](https://docs.aws.amazon.com/cli/latest/reference/ec2-instance-connect/open-tunnel.html)。
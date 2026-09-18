

# 使用 EC2 Instance Connect 连接到 Linux 实例
<a name="ec2-instance-connect-methods"></a>

以下说明旨在介绍如何通过 Amazon EC2 控制台、AWS CLI 或 SSH 客户端使用 EC2 Instance Connect 连接到 Linux 实例。

在使用 EC2 Instance Connect 通过控制台或 AWS CLI 连接到实例时，EC2 Instance Connect API 会将一个 SSH 公有密钥推送到[实例元数据](ec2-instance-metadata.md)并在其中保留 60 秒。附加到用户的 IAM 策略负责授权此操作。如果您更喜欢使用自己的 SSH 密钥，则可以使用 SSH 客户端，并使用 EC2 Instance Connect 将您的 SSH 密钥显式推送到实例。

**注意事项**  
使用 EC2 Instance Connect 连接到实例后，连接会一直持续到 SSH 会话终止。连接的持续时间并不是由 IAM 凭证的持续时间决定的。如果您的 IAM 凭证过期，连接将继续保持。使用 EC2 Instance Connect 控制台体验时，如果 IAM 凭证过期，请关闭浏览器页面终止连接。使用自己的 SSH 客户端和 EC2 Instance Connect 推送密钥时，可以设置 SSH 超时值来自动终止 SSH 会话。

**要求**  
开始操作之前，务必查看[先决条件](ec2-instance-connect-prerequisites.md)。

**Topics**
+ [使用 Amazon EC2 控制台连接](#ec2-instance-connect-connecting-console)
+ [使用 AWS CLI进行连接](#connect-linux-inst-eic-cli-ssh)
+ [使用您自己的密钥和 SSH 客户端进行连接](#ec2-instance-connect-connecting-aws-cli)
+ [故障排除](#ic-troubleshoot)

## 使用 Amazon EC2 控制台连接
<a name="ec2-instance-connect-connecting-console"></a>

您可以通过 Amazon EC2 控制台使用 EC2 Instance Connect 连接到实例。

**要求**  
要使用 Amazon EC2 控制台进行连接，实例必须具有一个公有 IPv4 或 IPv6 地址。如果实例只有私有 IPv4 地址，则可使用 [ec2-instance-connect AWS CLI](#connect-linux-inst-eic-cli-ssh) 命令进行连接。

**使用 Amazon EC2 控制台连接到实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例，然后选择**连接**。

1. 选择 **EC2 Instance Connect** 选项卡。

1. 选择**使用公有 IP 连接**。

1. 如果可以选择，请选择要连接到的 IP 地址。否则，系统会自动选择 IP 地址。

1. 对于**用户名**，请验证用户名。

1. 选择**连接**以建立连接。浏览器内终端窗口随即打开。

## 使用 AWS CLI进行连接
<a name="connect-linux-inst-eic-cli-ssh"></a>

可以使用 [ec2-instance-connect](https://docs.aws.amazon.com/cli/latest/reference/ec2-instance-connect/index.html) AWS CLI 命令，通过 SSH 客户端连接到实例。EC2 Instance Connect 尝试根据指定的连接类型，按预定义顺序使用可用的 IP 地址建立连接。如果 IP 地址不可用，它会自动尝试顺序中的下一个 IP 地址。连接类型

`auto`（默认）  
EC2 Instance Connect 尝试按以下顺序使用实例的 IP 地址并使用相应的连接类型进行连接：  

1. 公有 IPv4：`direct`

1. 私有 IPv4：`eice`

1. IPv6：`direct`

`direct`  
EC2 Instance Connect 尝试按以下顺序使用实例的 IP 地址进行连接：  

1. 公有 IPv4

1. IPv6

1. 私有 IPv4（不通过 EC2 Instance Connect 端点进行连接）

`eice`  
EC2 Instance Connect 尝试使用实例的私有 IPv4 地址和 [EC2 Instance Connect 端点](connect-with-ec2-instance-connect-endpoint.md)进行连接。

**注意**  
将来，`auto` 连接类型的行为可能会发生变化。为确保使用所需的连接类型，请将 `--connection-type` 明确设置为 `direct` 或 `eice`。

**要求**  
您必须使用 AWS CLI 版本 2。有关更多信息，请参阅 [Install or update to the latest version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)。

**要使用实例 ID 连接到实例**  
如果只知道实例 ID，并想让 EC2 Instance Connect 确定连接到实例时要使用的连接类型，请使用 [ec2-instance-connect ssh](https://docs.aws.amazon.com/cli/latest/reference/ec2-instance-connect/ssh.html) CLI 命令及实例 ID。

```
aws ec2-instance-connect ssh --instance-id {{i-1234567890example}}
```

**要使用实例 ID 和 EC2 Instance Connect Endpoint 连接到实例**  
如果您想通过 [EC2 Instance Connect Endpoint](connect-with-ec2-instance-connect-endpoint.md) 连接到您的实例，请使用前面的命令并通过 `eice` 值指定 `--connection-type` 参数。

```
aws ec2-instance-connect ssh --instance-id {{i-1234567890example}} --connection-type eice
```

**要使用实例 ID 和您自己的私有密钥文件连接到实例**  
如果您想使用自己的私有密钥通过 EC2 Instance Connect Endpoint 连接到您的实例，请指定实例 ID 和私有密钥文件的路径。不要在路径中包含 {{file://}}；以下示例将会失败：{{file:///path/to/key}}。

```
aws ec2-instance-connect ssh --instance-id {{i-1234567890example}} --private-key-file {{/path/to/key}}.pem
```

**提示**  
如果使用这些命令时出现错误，务必确保使用的是 AWS CLI 版本 2，因为 `ssh` 命令仅在此主要版本中可用。我们还建议定期更新到 AWS CLI 版本 2 的最新次要版本，以便使用最新功能。有关更多信息，请参阅《*AWS Command Line Interface 开发人员指南*》中的[关于 AWS CLI 版本 2](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html#welcome-versions-v2)。

## 使用您自己的密钥和 SSH 客户端进行连接
<a name="ec2-instance-connect-connecting-aws-cli"></a>

您可以使用自己的 SSH 密钥，并在使用 EC2 Instance Connect API 时从您选择的 SSH 客户端连接到您的实例。这使您能够从将公有密钥推送到实例的 EC2 Instance Connect 功能中受益。此连接方法适用于具有公有和私有 IP 地址的实例。

**要求**
+ 密钥对的要求
  + 支持的类型：RSA（OpenSSH 和 SSH2）和 ED25519
  + 支持的长度：2048 和 4096
  + 有关更多信息，请参阅 [使用第三方工具创建密钥对，并将公有密钥导入 Amazon EC2](create-key-pairs.md#how-to-generate-your-own-key-and-import-it-to-aws)。
+ 当连接到仅具有私有 IP 地址的实例时，启动 SSH 会话的本地计算机必须连接到 EC2 Instance Connect 服务端点（以便将 SSH 公有密钥推送到实例）且与实例的私有 IP 地址有网络连接，才能建立 SSH 会话。EC2 Instance Connect 服务端点可以通过互联网或 Direct Connect 公共虚拟接口访问。要连接到实例的私有 IP 地址，您可以利用 [Direct Connect](https://aws.amazon.com/directconnect/)、[AWS Site-to-Site VPN](https://aws.amazon.com/vpn/) 或 [VPC 对等连接](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html)等服务。

**使用您自己的密钥和任何 SSH 客户端连接到实例**

1. 

**（可选）生成新的 SSH 私有密钥和公有密钥**

   您可以使用以下命令生成新的 SSH 私有密钥和公有密钥（`my_key` 和 `my_key.pub`）：

   ```
   ssh-keygen -t rsa -f my_key
   ```

1. 

**将 SSH 公有密钥推送到实例**

   使用 [send-ssh-public-key](https://docs.aws.amazon.com/cli/latest/reference/ec2-instance-connect/send-ssh-public-key.html) 命令可将 SSH 公有密钥推送到实例。如果使用 AL2023 或 Amazon Linux 2 启动实例，则 AMI 的默认用户名为 `ec2-user`。如果使用 Ubuntu 启动实例，则 AMI 的默认用户名为 `ubuntu`。

   以下示例将公有密钥推送到指定的可用区中的指定实例，以对 `ec2-user` 进行身份验证。

   ```
   aws ec2-instance-connect send-ssh-public-key \
       --region {{us-west-2}} \
       --availability-zone {{us-west-2b}} \
       --instance-id {{i-001234a4bf70dec41EXAMPLE}} \
       --instance-os-user {{ec2-user}} \
       --ssh-public-key file://{{my_key.pub}}
   ```

1. 

**使用私有密钥连接到实例**

   从实例元数据中删除公有密钥之前，可以使用 **ssh** 命令通过私有密钥连接到实例（在 60 秒后删除）。指定与公有密钥对应的私有密钥、用于启动实例的 AMI 的默认用户名以及实例的公有 DNS 名称（如果通过私有网络连接，请指定私有 DNS 名称或 IP 地址）。添加 `IdentitiesOnly=yes` 选项以确保仅使用 ssh config 中的文件和指定的密钥进行连接。

   ```
   ssh -o "IdentitiesOnly=yes" -i {{my_key}} {{ec2-user}}@{{ec2-198-51-100-1.compute-1.amazonaws.com}}
   ```

   以下示例使用 `timeout 3600` 将 SSH 会话设置为 1 小时后终止。会话终止后，会话期间启动的进程可能会继续在您的实例上运行。

   ```
   timeout 3600 ssh -o “IdentitiesOnly=yes” -i {{my_key}} {{ec2-user}}@{{ec2-198-51-100-1.compute-1.amazonaws.com}}
   ```

## 故障排除
<a name="ic-troubleshoot"></a>

如果您在尝试连接到实例时遇到错误，请参阅下文：
+ [排查 Amazon EC2 Linux 实例的连接问题](TroubleshootingInstancesConnecting.md)
+ [如何排查使用 EC2 Instance Connect 连接 EC2 实例时遇到的问题？](https://repost.aws/knowledge-center/ec2-instance-connect-troubleshooting)
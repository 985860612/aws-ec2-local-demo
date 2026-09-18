

# 排查 Amazon EC2 Linux 实例的连接问题
<a name="TroubleshootingInstancesConnecting"></a>

以下信息和常见错误可以帮助您排查连接到实例时出现的问题。

**Topics**
+ [连接问题的常见原因](#TroubleshootingInstancesCommonCauses)
+ [连接到您的实例时出错：连接超时](#TroubleshootingInstancesConnectionTimeout)
+ [Error: unable to load key ...(错误：无法加载密钥...) Expecting: ANY PRIVATE KEY(需要：任何私有密钥)](#troubleshoot-instance-connect-key-file)
+ [错误：服务器无法识别用户密钥](#TroubleshootingInstancesServerError)
+ [错误：权限被拒绝或 [实例] 端口 22 关闭了连接](#TroubleshootingInstancesConnectingSSH)
+ [错误：未保护的私有密钥文件](#troubleshoot-unprotected-key)
+ [错误：私有密钥的格式必须以“-----BEGIN RSA PRIVATE KEY-----”开头，以“-----END RSA PRIVATE KEY-----”结尾](#troubleshoot-private-key-file-format)
+ [错误：主机密钥验证失败](#troubleshoot-host-key-verification-failed)
+ [错误：服务器拒绝我们的密钥*或* 没有支持的身份验证方法](#TroubleshootingInstancesConnectingPuTTY)
+ [无法对实例执行 Ping 操作](#troubleshoot-instance-ping)
+ [错误：服务器意外关闭了网络连接](#troubleshoot-ssh)
+ [错误：EC2 Instance Connect 的主机密钥验证失败](#troubleshoot-host-key-validation)
+ [无法使用 EC2 Instance Connect 连接到 Ubuntu 实例](#troubleshoot-eic-ubuntu)
+ [我丢失了私有密钥。如何连接到我的实例？](#replacing-lost-key-pair)

## 连接问题的常见原因
<a name="TroubleshootingInstancesCommonCauses"></a>

建议您通过验证是否正确执行了以下任务，开始排查实例连接问题。

**验证实例的用户名**  
您可以使用用户账户的用户名或用于启动实例的 AMI 的默认用户名连接到实例。  
+ **获取用户账户的用户名。**

  有关如何创建用户账户的更多信息，请参阅[管理 Amazon EC2 Linux 实例上的系统用户](managing-users.md)。
+ **获取用于启动实例的 AMI 的默认用户名。**    
[See the AWS documentation website for more details](http://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/TroubleshootingInstancesConnecting.html)

**验证安全组规则是否允许流量**  
确保与您的实例关联的安全组允许来自您的 IP 地址的入站 SSH 流量。默认情况下，VPC 的默认安全组不允许传入 SSH 流量。默认情况下，由启动实例向导创建的安全组允许传入的 SSH 流量。有关向 Linux 实例添加入站 SSH 流量规则的步骤，请参阅 [用于从您的计算机连接到实例的规则](security-group-rules-reference.md#sg-rules-local-access)。有关验证步骤，请参阅 [连接到您的实例时出错：连接超时](#TroubleshootingInstancesConnectionTimeout)。

**验证实例是否准备就绪**  
启动实例后，可能需要花几分钟时间，实例才能准备好接受连接请求。检查实例以确保它正在运行并通过了状态检查。  

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**，然后选择您的实例。

1. 请验证以下内容：

   1. 在**Instance state (实例状态) **列中，验证您的实例是否处于 `running` 状态。

   1. 在 **Status check (状态检查)** 列中，验证您的实例是否已通过所有状态检查。

**确认您已满足连接的所有先决条件**  
确保您拥有连接所需的所有信息。有关更多信息，请参阅 [使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)。  
**从 Linux 或 macOS 进行连接**  
如果本地计算机操作系统是 Linux 或 macOS X，请检查以下连接到 Linux 实例的特定先决条件：
+ [SSH 客户端](connect-linux-inst-ssh.md)
+ [EC2 Instance Connect](connect-linux-inst-eic.md)
+ [AWS Systems Manager 会话管理器](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)
**从 Windows 进行连接**  
如果本地计算机操作系统是 Windows，请检查以下连接到 Linux 实例的特定先决条件：
+ [OpenSSH](connect-linux-inst-ssh.md)
+ [PuTTY](connect-linux-inst-from-windows.md)
+ [AWS Systems Manager 会话管理器](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)
+ [Windows Subsystem for Linux](connect-linux-inst-ssh.md)

**检查实例是否为托管实例**  
不允许用户向托管实例发起连接。要确定实例是否为托管实例，找到该实例的**托管**字段。如果此值为 **true**，则该实例为托管实例。有关更多信息，请参阅 [Amazon EC2 托管式实例](amazon-ec2-managed-instances.md)。

## 连接到您的实例时出错：连接超时
<a name="TroubleshootingInstancesConnectionTimeout"></a>

如果连接到实例时显示错误消息 `Network error: Connection timed out` 或 `Error connecting to [instance], reason: -> Connection timed out: connect`，请尝试以下选项：

**检查您的安全组规则。**  
您需要一条安全组规则，它允许在适当端口上传输来自您的本地计算机公有 IPv4 地址的入站流量。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**，然后选择您的实例。

1. 在控制台页面底部的 **Security (安全)** 选项卡上的 **Inbound rules (入站规则)** 下，检查对所选实例生效的规则列表。验证是否有允许流量从本地计算机到端口 22（SSH）的规则。

   如果您的安全组没有允许来自您的本地计算机的入站流量的规则，请向您的安全组添加一条规则。有关更多信息，请参阅 [用于从您的计算机连接到实例的规则](security-group-rules-reference.md#sg-rules-local-access)。

1. 对于允许入站流量的规则，请检查 **Source**（源）字段。如果该值是单个 IP 地址，并且如果该 IP 地址不是静态的，则每次重新启动计算机时都会分配一个新的 IP 地址。这将导致该规则不包括您计算机的 IP 地址流量。如果您的计算机位于企业网络上，或者当您通过互联网服务提供商 (ISP) 进行连接时，抑或您的计算机的 IP 地址是动态的，则该 IP 地址可能不是静态的，并且每次重新启动计算机时都会更改。为了确保您的安全组规则允许来自您的本地计算机的入站流量，应该指定您的客户端计算机使用的 IP 地址的范围，而不是为 **Source**（源）指定单个 IP 地址。

   有关安全组规则的更多信息，请参阅*Amazon VPC 用户指南*中的[安全组规则](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html)。

**查看子网的路由表。**  
您需要使用某个路由，以将发往 VPC 外部的所有流量发送到 VPC 的 Internet 网关。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**，然后选择您的实例。

1. 在 **Networking (联网)** 选项卡上，记下 **VPC ID** 和 **Subnet ID (子网 ID)** 的值。

1. 通过以下网址打开 Amazon VPC 控制台：[https://console.aws.amazon.com/vpc/](https://console.aws.amazon.com/vpc/)。

1. 在导航窗格中，选择 **Internet Gateways（互联网网关）**。验证是否有 Internet 网关附加到您的 VPC。否则，请选择 **Create internet gateway (创建 Internet 网关)**，为 Internet 网关输入名称，然后选择 **Create internet gateway (创建 Internet 网关)**。然后，对于您创建的 Internet 网关，依次选择 **Actions (操作)**、**Attach to VPC (附加到 VPC)**，选择您的 VPC，然后选择 **Attach internet gateway (附加 Internet 网关)** 将其附加到您的 VPC。

1. 在导航窗格中，选择 **Subnets**，然后选择您的子网。

1. 在 **Route Table (路由表)** 选项卡上，验证 `0.0.0.0/0` 的路由是否为目的地以及您的 VPC 的 Internet 网关是否为目标。如果您使用实例的 IPv6 地址连接到实例，请检查是否有一个路由可以将所有 IPv6 流量 (`::/0`) 指向 Internet 网关。否则请执行以下操作：

   1. 选择路由表的 ID (rtb-*xxxxxxxx*) 以导航到路由表。

   1. 在 **Routes（路由）**选项卡上，选择 **Edit routes（编辑路由）**。选择 **Add route (添加路由)**，将 `0.0.0.0/0` 用作目的地并将 Internet 网关用作目标。对于 IPv6，选择 **Add route (添加路由)**，将 `::/0` 用作目的地并将 Internet 网关用作目标。

   1. 选择 **Save routes (保存路由)**。

**检查子网的网络访问控制列表 (ACL)。**

该网络 ACL 必须允许端口 22 上来自本地 IP 地址的入站 SSH 流量。还须允许到临时端口 (1024-65535) 的出站流量。

1. 通过以下网址打开 Amazon VPC 控制台：[https://console.aws.amazon.com/vpc/](https://console.aws.amazon.com/vpc/)。

1. 在导航窗格中，选择 **Subnets (子网)**。

1. 选择您的子网。

1. 对于 **Inbound rules (入站规则)**，请在 **Network ACL (网络 ACL)** 选项卡上验证这些规则是否允许来自所需端口的计算机的入站流量。如果不允许，请删除或修改阻止该流量的规则。

1. 对于 **Outbound rules (出站规则)**，验证规则是否允许到您的计算机临时端口的出站流量。如果不允许，请删除或修改阻止该流量的规则。

**如果您的计算机在企业网络上**  
请询问网络管理员内部防火墙是否允许端口 22 上来自您计算机的入站和出站流量。

如果计算机有防火墙，请验证其是否允许端口 22 上来自您计算机的入站和出站流量。

**检查您的实例是否具有公有 IPv4 地址。**  
如果没有，您可以将弹性 IP 地址与您的实例关联。有关更多信息，请参阅[弹性 IP 地址](elastic-ip-addresses-eip.md)。

**检查实例上的 CPU 负载；服务器可能已超过负载。**  
AWS 自动提供数据，例如 Amazon CloudWatch 指标和实例状态，您可以使用这些数据查看实例上 CPU 的负载情况；如有必要，还可以调整负载的处理方式。有关更多信息，请参阅[使用 CloudWatch 监控您的实例](using-cloudwatch.md)。
+ 如果您的负载是可变的，您可以使用 [Auto Scaling](https://aws.amazon.com/autoscaling/) 和 [Elastic Load Balancing](https://aws.amazon.com/elasticloadbalancing/) 自动增加或减少实例。
+ 如果您的负载呈稳定增长的态势，您可以迁移到更大的实例类型。有关更多信息，请参阅[Amazon EC2 实例类型更改](ec2-instance-resize.md)。

**要使用 IPv6 地址连接实例，请检查以下各项：**
+ 您的子网必须与一个路由表关联，此表中具有一个将 IPv6 流量 (`::/0`) 指向 Internet 网关的路由。
+ 安全组规则必须允许端口 22 上来自本地 IPv6 地址的入站流量。
+ 您的网络 ACL 规则必须允许入站和出站 IPv6 流量。
+ 如果您从旧版 AMI 启动实例，则其可能未针对 DHCPv6 进行配置（IPv6 地址不会在网络接口上自动识别）。有关更多信息，请参阅《Amazon VPC 用户指南》**中的[在实例中配置 IPv6](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-migrate-ipv6.html#vpc-migrate-ipv6-dhcpv6)。
+ 您的本地计算机必须拥有 IPv6 地址，且必须配置为使用 IPv6。

## Error: unable to load key ...(错误：无法加载密钥...) Expecting: ANY PRIVATE KEY(需要：任何私有密钥)
<a name="troubleshoot-instance-connect-key-file"></a>

如果您尝试连接到您的实例并收到错误消息 `unable to load key ... Expecting: ANY PRIVATE KEY`，则说明未正确配置用于存储私有密钥的文件。如果私有密钥文件以 `.pem` 为结尾，则它可能仍未正确配置。未正确配置私有密钥文件的一个可能原因是缺少证书。

**如果未正确配置私有密钥文件，请按照下列步骤解决该错误**

1. 创建新的密钥对。有关更多信息，请参阅 [使用 Amazon EC2 创建密钥对](create-key-pairs.md#having-ec2-create-your-key-pair)。
**注意**  
另外，您也可以使用第三方工具创建新的密钥对。有关更多信息，请参阅 [使用第三方工具创建密钥对，并将公有密钥导入 Amazon EC2](create-key-pairs.md#how-to-generate-your-own-key-and-import-it-to-aws)。

1. 将新密钥对添加到您的实例。有关更多信息，请参阅[我丢失了私有密钥。如何连接到我的实例？](#replacing-lost-key-pair)。

1. 使用新的密钥对连接到实例。

## 错误：服务器无法识别用户密钥
<a name="TroubleshootingInstancesServerError"></a>

**如果您使用 SSH 连接到实例**
+ 请在连接时使用 `ssh -vvv` 获得三倍的详细调试信息：

  ```
  ssh -vvv -i {{path/key-pair-name}}.pem {{instance-user-name}}@{{ec2-203-0-113-25.compute-1.amazonaws.com}}
  ```

  下列样本输出演示了如果您尝试使用服务器无法识别的密钥连接实例时您可能会看到的信息：

  ```
  open/ANT/myusername/.ssh/known_hosts).
  debug2: bits set: 504/1024
  debug1: ssh_rsa_verify: signature correct
  debug2: kex_derive_keys
  debug2: set_newkeys: mode 1
  debug1: SSH2_MSG_NEWKEYS sent
  debug1: expecting SSH2_MSG_NEWKEYS
  debug2: set_newkeys: mode 0
  debug1: SSH2_MSG_NEWKEYS received
  debug1: Roaming not allowed by server
  debug1: SSH2_MSG_SERVICE_REQUEST sent
  debug2: service_accept: ssh-userauth
  debug1: SSH2_MSG_SERVICE_ACCEPT received
  debug2: key: boguspem.pem ((nil))
  debug1: Authentications that can continue: publickey
  debug3: start over, passed a different list publickey
  debug3: preferred gssapi-keyex,gssapi-with-mic,publickey,keyboard-interactive,password
  debug3: authmethod_lookup publickey
  debug3: remaining preferred: keyboard-interactive,password
  debug3: authmethod_is_enabled publickey
  debug1: Next authentication method: publickey
  debug1: Trying private key: boguspem.pem
  debug1: read PEM private key done: type RSA
  debug3: sign_and_send_pubkey: RSA 9c:4c:bc:0c:d0:5c:c7:92:6c:8e:9b:16:e4:43:d8:b2
  debug2: we sent a publickey packet, wait for reply
  debug1: Authentications that can continue: publickey
  debug2: we did not send a packet, disable method
  debug1: No more authentication methods to try.
  Permission denied (publickey).
  ```

**如果您使用 PuTTY 连接到实例**
+ 验证私有密钥 (.pem) 文件是否已转换为 PuTTY 可识别的格式 (.ppk)。有关转换您的私有密钥的更多信息，请参阅 [使用 PuTTY 连接到 Linux 实例](connect-linux-inst-from-windows.md)。
**注意**  
在 PuTTYgen 中，加载私有密钥文件并选择 **Save Private Key (保存私有密钥)** 而不是 **Generate (生成)**。
+ 验证您在连接时是否对为 AMI 使用了正确的用户名。在 **PuTTY 配置**窗口的**主机名**框中输入用户名。    
[See the AWS documentation website for more details](http://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/TroubleshootingInstancesConnecting.html)
+ 验证您的入站安全组规则允许入站流量进入合适的端口。有关更多信息，请参阅 [用于从您的计算机连接到实例的规则](security-group-rules-reference.md#sg-rules-local-access)。

## 错误：权限被拒绝或 [实例] 端口 22 关闭了连接
<a name="TroubleshootingInstancesConnectingSSH"></a>

如果您使用 SSH 连接到实例并出现任何以下错误：`Host key not found in [directory]`、`Permission denied (publickey)`、`Authentication failed, permission denied` 或 `Connection closed by [instance] port 22`，请确认您使用的是 AMI 对应的用户名进行连接*并且*为实例指定了正确的私有密钥（`.pem)` 文件。

正确的用户名如下所示：


| 用于启动实例的 AMI | 默认用户名 | 
| --- | --- | 
| Amazon Linux | ec2-user  | 
| CentOS | centos 或 ec2-user | 
| Debian | admin | 
| Fedora  | fedora 或 ec2-user | 
| FreeBSD | ec2-user | 
| RHEL | ec2-user 或 root | 
| SUSE  | ec2-user 或 root | 
| Ubuntu  | ubuntu | 
| Oracle  | ec2-user | 
| Bitnami  | bitnami | 
| Rocky Linux  | rocky | 
| 其他 | 检查 AMI 提供程序 | 

例如，要使用 SSH 客户端连接到从 Amazon Linux 实例，请使用以下命令：

```
ssh -i {{/path/key-pair-name}}.pem {{instance-user-name}}@{{ec2-203-0-113-25.compute-1.amazonaws.com}}
```

请确认您使用的私有密钥文件对应于您启动实例时选择的密钥对。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**，然后选择您的实例。

1. 在 **Details （详细信息)** 选项卡的 **Instance details (实例详细信息)** 下，验证 **Key pair name (密钥对名称)** 的值。

1. 如果您启动实例时没有指定密钥对，则可以终止实例并启动新实例，从而确保指定密钥对。如果这是您一直使用的实例，但您不再有密钥对的 `.pem` 文件，则可以使用新的密钥对取代该密钥对。有关更多信息，请参阅[我丢失了私有密钥。如何连接到我的实例？](#replacing-lost-key-pair)。

如果您已经生成了您自己的密钥对，请确保您的密钥生成器被设置为创建 RSA 密钥。不接受 DSA 密钥。

如果您遇到 `Permission denied (publickey)` 错误但以上情况都不适用 (例如，您之前能够连接)，则可能是实例主目录的权限发生了更改。`/home/{{instance-user-name}}/.ssh/authorized_keys` 的权限必须限制为仅限所有者。

**在您的实例上验证权限**

1. 停止您的实例并分离根卷。有关更多信息，请参阅 [启动和停止 Amazon EC2 实例](Stop_Start.md)。

1. 在当前实例所在的可用区中启动一个临时实例 (使用与您用于当前实例的 AMI 类似或相同的 AMI)，并将根卷附加到此临时实例。

1. 连接临时实例，创建一个挂载点并挂载您附加的卷。

1. 在临时实例中，检查附加的卷的 `/home/{{instance-user-name}}/` 目录的权限。如有必要，按如下方式调整权限：

   ```
   [ec2-user ~]$ chmod 600 {{mount_point}}/home/{{instance-user-name}}/.ssh/authorized_keys
   ```

   ```
   [ec2-user ~]$ chmod 700 {{mount_point}}/home/{{instance-user-name}}/.ssh
   ```

   ```
   [ec2-user ~]$ chmod 700 {{mount_point}}/home/{{instance-user-name}}
   ```

1. 卸载该卷，将其与临时实例分离，然后将其重新附加到原来的实例。确保为根卷指定正确的设备名称；例如，`/dev/xvda`。

1. 启动您的实例。如果不再需要临时实例，可以终止它。

## 错误：未保护的私有密钥文件
<a name="troubleshoot-unprotected-key"></a>

必须保护您的私钥文件，防止其他任何用户对其进行读写操作。如果除您外其他任何人都能够读取或写入您的私钥，则 SSH 会忽略您的密钥，并且您会看到以下警告消息。

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions {{0777}} for '{{.ssh/my_private_key.pem}}' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
bad permissions: ignore key: .ssh/my_private_key.pem
Permission denied (publickey).
```

如果在尝试登录到您的实例时看到类似的消息，请检查此错误消息的第一行，验证您为实例使用的公钥是否正确。上述示例利用 `.ssh/my_private_key.pem` 文件权限使用私钥 `0777`，这可使任何人都能读取或写入此文件。此权限级别非常不安全，因此 SSH 会忽略此密钥。

如果从 macOS 或 Linux 连接，请运行以下命令以修复此错误，替入您的私有密钥文件的路径。

```
[ec2-user ~]$ chmod 0400 {{.ssh/my_private_key.pem}}
```

如果要从 Windows 连接到 Linux 实例，请在本地计算机上执行以下步骤。

1. 导航到您的 .pem 文件。

1. 打开 .pem 文件的上下文（右键单击）菜单，然后选择**属性**。

1. 选择**安全性**选项卡。

1. 选择 **Advanced (高级)**。

1. 验证您是否是文件的所有者。如果不是，请将所有者更改为您的用户名。

1. 选择 **Disable inheritance (禁用继承)** 和 **Remove all inherited permissions from this object (从此对象中删除所有继承的权限)**。

1. 选择 **Add (添加)**、**Select a principal (选择委托人)**，输入您的用户名，然后选择 **OK (确定)**。

1. 从 **Permission Entry (权限条目)** 窗口，授予 **Read (读取)** 权限，然后选择 **OK (确定)**。

1. 单击 **Apply**（应用）以确保所有设置都已保存。

1. 选择 **OK (确定)** 关闭 **Advanced Security Settings (高级安全设置)** 窗口。

1. 选择 **OK (确定)** 关闭 **Properties (属性)** 窗口。

1. 您应该能够使用 SSH 从 Windows 连接到 Linux 实例。

从 Windows 命令提示符处运行以下命令。

1. 在命令提示符下，导航到 .pem 文件的文件路径位置。

1. 运行以下命令以重置和删除显式权限：

   ```
   icacls.exe $path /reset
   ```

1. 运行以下命令以向当前用户授予读取权限：

   ```
   icacls.exe $path /GRANT:R "$($env:USERNAME):(R)"
   ```

1. 运行以下命令以禁用继承并删除继承的权限。

   ```
   icacls.exe $path /inheritance:r
   ```

1. 您应该能够使用 SSH 从 Windows 连接到 Linux 实例。

## 错误：私有密钥的格式必须以“-----BEGIN RSA PRIVATE KEY-----”开头，以“-----END RSA PRIVATE KEY-----”结尾
<a name="troubleshoot-private-key-file-format"></a>

如果您使用第三方工具（如 **ssh-keygen**）创建 RSA 密钥对，则它会生成 OpenSSH 密钥格式的私有密钥。当您连接到实例时，如果使用 OpenSSH 格式的私有密钥来解密密码，您将收到错误 `Private key must begin with "-----BEGIN RSA PRIVATE KEY-----" and end with "-----END RSA PRIVATE KEY-----"`。

要解决该错误，私有密钥必须采用 PEM 格式。使用以下命令创建 PEM 格式的私有密钥：

```
ssh-keygen -m PEM
```

## 错误：主机密钥验证失败
<a name="troubleshoot-host-key-verification-failed"></a>

如果实例上存储在 `known_hosts` 文件中的主机密钥与客户端上的主机密钥不匹配，则会出现此错误。例如，假设使用一个公有 IP 地址连接到某个实例，然后尝试使用其他公有 IP 地址重新连接到该实例，则可能会出现不匹配的情况。这一问题可能在添加或移除弹性 IP 地址之后出现，因为此操作会更改实例的公有 IP 地址。

要解决此错误，首先要确认实例的主机密钥或网络配置更改符合预期。连接到实例之前，您可能还需要[验证主机指纹](connection-prereqs-general.md#connection-prereqs-fingerprint)。连接到实例后，您可以从 `known_hosts` 文件中移除旧主机密钥。有关说明，请参阅有关实例上所用 Linux 发行版的文档。

## 错误：服务器拒绝我们的密钥*或* 没有支持的身份验证方法
<a name="TroubleshootingInstancesConnectingPuTTY"></a>

如果您使用 PuTTY 连接到实例并出现以下任一错误：错误：服务器拒绝了我们的密钥或错误：没有支持的身份验证方法，请确认您使用 AMI 的相应用户名进行连接。在 **PuTTY 配置**窗口的**用户名**中键入用户名。

正确的用户名如下所示：


| 用于启动实例的 AMI | 默认用户名 | 
| --- | --- | 
| Amazon Linux | ec2-user  | 
| CentOS | centos 或 ec2-user | 
| Debian | admin | 
| Fedora  | fedora 或 ec2-user | 
| FreeBSD | ec2-user | 
| RHEL | ec2-user 或 root | 
| SUSE  | ec2-user 或 root | 
| Ubuntu  | ubuntu | 
| Oracle  | ec2-user | 
| Bitnami  | bitnami | 
| Rocky Linux  | rocky | 
| 其他 | 检查 AMI 提供程序 | 

您还应该验证：
+ 您使用的是否是最新版本的 PuTTY？ 有关更多信息，请参阅 [PuTTY 网页](https://www.chiark.greenend.org.uk/~sgtatham/putty/)。
+ 已将您的私有密钥 (.pem) 文件正确转换为 PuTTY 可识别的格式 (.ppk)。有关转换您的私有密钥的更多信息，请参阅 [使用 PuTTY 连接到 Linux 实例](connect-linux-inst-from-windows.md)。

## 无法对实例执行 Ping 操作
<a name="troubleshoot-instance-ping"></a>

`ping` 命令是一种 ICMP 流量 — 如果您无法对实例执行 ping 操作，请确保您的入站安全组规则允许的 `Echo Request` 消息的 ICMP 流量来自所有资源，或来自从中发出命令的计算机或实例。

如果您无法从实例发出 `ping` 命令，请确保您的出站安全组规则允许的 `Echo Request` 消息的 ICMP 流量发送到所有目标，或发送到您正在尝试对其执行 ping 操作的主机。

`Ping`由于网络延迟或硬件问题， 命令还可能被防火墙阻止或超时。您应咨询本地网络或系统管理员，以帮助进行进一步的故障排除。

## 错误：服务器意外关闭了网络连接
<a name="troubleshoot-ssh"></a>

如果您使用 PuTTY 连接到实例并出现“服务器意外关闭了网络连接”错误，请确认您已在 PuTTY Configuration (PuTTY 配置) 的 Connection (连接) 页面上启用 keepalives 以避免断开连接。有些服务器如果在指定的时间内未接收到任何数据，将会断开与客户端的连接。将“Seconds between keepalives”(keepalives 之间的秒数) 设置为 59 秒。

如果在启用 keepalives 后仍出现问题，请尝试在 PuTTY Configuration (PuTTY 配置) 的 Connection (连接) 页面上禁用 Nagle 的算法。

## 错误：EC2 Instance Connect 的主机密钥验证失败
<a name="troubleshoot-host-key-validation"></a>

如果您轮换实例主机密钥，则新主机密钥不会自动上传到 AWS 可信主机密钥数据库。当您尝试使用 EC2 Instance Connect 基于浏览器的客户端连接到实例时，会导致主机密钥验证失败，并且无法连接到实例。

要解决此错误，您必须在实例上运行 `eic_harvest_hostkeys` 脚本，该脚本会将新主机密钥上传到 EC2 Instance Connect。脚本位于 Amazon Linux 2 实例上的 `/opt/aws/bin/` 和 Ubuntu 实例上的 `/usr/share/ec2-instance-connect/`。

------
#### [ Amazon Linux 2 ]

**解决 Amazon Linux 2 实例上的主机密钥验证失败错误**

1. 使用 SSH 连接到实例。

   您可以使用 EC2 Instance Connect CLI 或使用在启动实例时为其分配的 SSH 密钥对以及用于启动实例的 AMI 的默认用户名进行连接。对于 Amazon Linux 2，默认用户名为 `ec2-user`。

   例如，如果实例是使用 Amazon Linux 2 启动的，实例的公有 DNS 名称是 `ec2-a-b-c-d.us-west-2.compute.amazonaws.com`，并且密钥对是 `my_ec2_private_key.pem`，请使用以下命令通过 SSH 连接到实例：

   ```
   $ ssh -i {{my_ec2_private_key}}.pem {{ec2-user}}@{{ec2-a-b-c-d.us-west-2.compute.amazonaws.com}}
   ```

   有关连接到实例的更多信息，请参阅[使用 SSH 客户端连接到 Linux 实例](connect-linux-inst-ssh.md)。

1. 导航到以下文件夹。

   ```
   [ec2-user ~]$ cd /opt/aws/bin/
   ```

1. 在您的实例上运行以下命令。 

   ```
   [ec2-user ~]$ ./eic_harvest_hostkeys
   ```

   请注意，调用成功导致没有输出。

   现在，您可以使用 EC2 Instance Connect 基于浏览器的客户端连接到您的实例。

------
#### [ Ubuntu ]

**解决 Ubuntu 实例上的主机密钥验证失败错误**

1. 使用 SSH 连接到实例。

   您可以使用 EC2 Instance Connect CLI 或使用在启动实例时为其分配的 SSH 密钥对以及用于启动实例的 AMI 的默认用户名进行连接。对于 Ubuntu，默认用户名是 `ubuntu`。

   例如，如果实例是使用 Ubuntu 启动的，实例的公有 DNS 名称是 `ec2-a-b-c-d.us-west-2.compute.amazonaws.com`，并且密钥对是 `my_ec2_private_key.pem`，请使用以下命令通过 SSH 连接到实例：

   ```
   $ ssh -i {{my_ec2_private_key}}.pem {{ubuntu}}@{{ec2-a-b-c-d.us-west-2.compute.amazonaws.com}}
   ```

   有关连接到实例的更多信息，请参阅[使用 SSH 客户端连接到 Linux 实例](connect-linux-inst-ssh.md)。

1. 导航到以下文件夹。

   ```
   [ec2-user ~]$ cd /usr/share/ec2-instance-connect/
   ```

1. 在您的实例上运行以下命令。 

   ```
   [ec2-user ~]$ ./eic_harvest_hostkeys
   ```

   请注意，调用成功导致没有输出。

   现在，您可以使用 EC2 Instance Connect 基于浏览器的客户端连接到您的实例。

------

## 无法使用 EC2 Instance Connect 连接到 Ubuntu 实例
<a name="troubleshoot-eic-ubuntu"></a>

如果您使用 EC2 Instance Connect 连接到 Ubuntu 实例，并且尝试连接时出错，则可以使用以下信息尝试修复此问题。

**可能的原因**

实例上的 `ec2-instance-connect` 软件包不是最新版本。

**解决方案**

将实例上的 `ec2-instance-connect` 软件包更新到最新版本，如下所示：

1. 使用 EC2 Instance Connect 以外的方法[连接](connect-to-linux-instance.md)到实例。

1. 在您的实例上使用以下命令将 `ec2-instance-connect` 软件包更新到最新版本。

   ```
   apt update && apt upgrade
   ```

## 我丢失了私有密钥。如何连接到我的实例？
<a name="replacing-lost-key-pair"></a>

如果丢失由 EBS 支持的实例的私有密钥，您可以重新获取对您的实例的访问权限。您必须停止实例，分离卷并将其作为数据卷附加到另一个实例，然后使用新的公有密钥修改 `authorized_keys` 文件，将卷移回原始实例，并重启实例。有关启动、连接和停止实例的更多信息，请参阅 [Amazon EC2 实例状态更改](ec2-instance-lifecycle.md)。

此过程仅支持具有 EBS 根卷的实例。如果实例具有实例存储根卷，则无法使用此过程重新获得对实例的访问权限；您必须拥有私有密钥才能连接到实例。要确定实例的根卷类型，请打开 Amazon EC2 控制台，选择**实例**，选择相应实例，然后选择**存储**选项卡，并在**根设备详细信息**部分中，检查**根设备类型**的值。

该值为 `EBS` 或 `INSTANCE-STORE`。

如果丢失私有密钥，除以下步骤外，还有其他方法可以连接到 Linux 实例。有关更多信息，请参阅[如果我在 SSH 密钥对初始启动后丢失，该如何连接到 Amazon EC2 实例？](https://repost.aws/knowledge-center/user-data-replace-key-pair-ec2)

**Topics**
+ [步骤 1：创建新的密钥对](#step-1-create-new-key-pair)
+ [步骤 2：获取有关原始实例及其根卷的信息](#step-2-get-info-about-original-instance)
+ [步骤 3：停止原始实例](#step-3-stop-original-instance)
+ [步骤 4：启动临时实例](#step-4-launch-temp-instance)
+ [步骤 5：从原始实例中分离根卷并将其附加到临时实例](#step-5-detach-root-volume-and-attach-to-temp-instance)
+ [步骤 6：将新的公钥添加到已安装到临时实例的原始卷上的 `authorized_keys`](#step-6-add-new-public-key-to-authorized_keys)
+ [步骤 7：从临时实例中卸载并分离原始卷，然后将其重新附加到原始实例](#step-7-unmount-detach-volume-and-reattach-to-original-instance)
+ [步骤 8：使用新密钥对连接到原始实例](#step-8-connect-to-original-instance)
+ [步骤 9：清除](#step-9-clean-up)

### 步骤 1：创建新的密钥对
<a name="step-1-create-new-key-pair"></a>

使用 Amazon EC2 控制台或第三方工具创建新的密钥对。如果您要将新密钥对的名称设置为与丢失的私有密钥相同的名称，则必须先删除现有密钥对。有关创建新密钥对的信息，请参阅[使用 Amazon EC2 创建密钥对](create-key-pairs.md#having-ec2-create-your-key-pair)或[使用第三方工具创建密钥对，并将公有密钥导入 Amazon EC2](create-key-pairs.md#how-to-generate-your-own-key-and-import-it-to-aws)。

### 步骤 2：获取有关原始实例及其根卷的信息
<a name="step-2-get-info-about-original-instance"></a>

请记下以下信息，因为您需要它来完成此过程。

**获取有关原始实例的信息**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中选择 **Instances (实例)**，然后选择要连接到的实例。（我们将此称为*原始*实例。）

1. 在 **Details**（详细信息）选项卡上，记下实例 ID 和 AMI ID。

1. 在 **Networking**（网络）选项卡上，记下可用区。

1. 在 **Storage**（存储）选项卡的 **Root device name**（根设备名称）下，记下根卷的设备名称（例如 `/dev/xvda`）。然后，在 **Block devices**（块存储设备）下，查找此设备的名称并记下卷 ID（例如 vol-0a1234b5678c910de）。

### 步骤 3：停止原始实例
<a name="step-3-stop-original-instance"></a>

依次选择**实例状态**、**停止实例**。如果此选项处于禁用状态，则表示实例已停止，或者其根卷是实例存储卷。

**警告**  
停止某个实例时，实例存储卷上的数据将会丢失。要保留这些数据，请将其备份到持久性存储中。

### 步骤 4：启动临时实例
<a name="step-4-launch-temp-instance"></a>

**启动临时实例**

1. 在导航窗格中，选择 **Instances**（实例），然后选择 **Launch instances**（启动实例）。

1. 在 **Name and tags**（名称和标签）部分，对于 **Name**（名称），输入 **Temporary**（临时）。

1. 在 **Application and OS Images**（应用程序和操作系统映像）部分中，选择您启动原始实例时所用的 AMI。如果此 AMI 不可用，您可以创建一个可在已停止的实例中使用的 AMI。有关更多信息，请参阅 [创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。

1. 在 **Instance type**（实例类型）部分中，保留默认的实例类型。

1. 在 **Key pair**（密钥对）部分中，对于 **Key pair name**（密钥对名称），选择现有密钥对进行使用或创建新密钥对。

1. 在 **Network settings**（网络设置）部分，选择 **Edit**（编辑），然后为 **Subnet**（子网），选择与原始实例位于同一可用区的子网。

1. 在 **Summary**（摘要）面板中，选择 **Launch**（启动）。

### 步骤 5：从原始实例中分离根卷并将其附加到临时实例
<a name="step-5-detach-root-volume-and-attach-to-temp-instance"></a>

1. 在导航窗格中，选择**卷**，并选择原始实例的根卷（您已在上一步骤中记下它的卷 ID）。依次选择 **Actions**（操作）、**Detach Volume**（分离卷），然后选择 **Detach**（分离）。等待卷的状态变为 `available`。（您可能需要选择“刷新”图标。）

1. 如果卷仍保持选中状态，则选择 **Actions**（操作），然后选择 **Attach Volume**（附加卷）。选择临时实例的实例 ID，记下在 **Device name**（设备名称）下指定的设备名称（例如 `/dev/sdf`），然后选择 **Attach volume**（附加卷）。
**注意**  
如果已从 AWS Marketplace AMI 启动原始实例，并且卷包含 AWS Marketplace 代码，则必须先停止临时实例，然后才能附加卷。

### 步骤 6：将新的公钥添加到已安装到临时实例的原始卷上的 `authorized_keys`
<a name="step-6-add-new-public-key-to-authorized_keys"></a>

1. 连接到临时实例。

1. 在临时实例中，挂载附加到实例的卷以访问其文件系统。例如，如果设备名称为 `/dev/sdf`，请使用以下命令将卷挂载为 `/mnt/tempvol`。<a name="device-name"></a>
**注意**  
您的实例上显示的设备名称可能不同。例如，作为 `/dev/sdf` 挂载的设备可能在实例上显示为 `/dev/xvdf`。某些版本的 Red Hat（或其变体，如 CentOS）甚至可能将尾部字母增加 4 个字符，其中 `/dev/sd{{f}}` 成为 `/dev/xvd{{k}}`。

   1. 使用 **lsblk** 命令确定卷是否已分区。

      ```
      [ec2-user ~]$ lsblk
      NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
      xvda    202:0    0    8G  0 disk
      └─xvda1 202:1    0    8G  0 part /
      xvdf    202:80   0  101G  0 disk
      └─xvdf1 202:81   0  101G  0 part
      xvdg    202:96   0   30G  0 disk
      ```

      在前一个示例中，`/dev/xvda` 和 `/dev/xvdf` 是分区卷，而 `/dev/xvdg` 不是。如果您的卷已分区，则应在后续步骤中挂载分区 (`/dev/xvdf1)`)，而不是原始设备 (`/dev/xvdf`)。

   1. 创建临时目录以挂载卷。

      ```
      [ec2-user ~]$ sudo mkdir /mnt/tempvol
      ```

   1. 使用之前确定的卷名称或设备名称在临时挂载点挂载卷（或分区）。所需命令取决于操作系统的文件系统。请注意，您的实例上显示的设备名称可能不同。有关更多信息，请参阅步骤 6 中的 [note](#device-name)。
      + Amazon Linux、Ubuntu 和 Debian

        ```
        [ec2-user ~]$ sudo mount /dev/{{xvdf1}} /mnt/tempvol
        ```
      + Amazon Linux 2、CentOS、SUSE Linux 12 和 RHEL 7.x

        ```
        [ec2-user ~]$ sudo mount -o nouuid /dev/{{xvdf1}} /mnt/tempvol
        ```
**注意**  
如果您收到说明文件系统受损的错误，请运行以下命令以使用 **fsck** 实用程序检查文件系统并修复任何问题：  

   ```
   [ec2-user ~]$ sudo fsck /dev/{{xvdf1}}
   ```

1. 在临时实例中，借助临时实例 `authorized_keys` 中的新公有密钥，在已挂载卷上使用以下命令更新 `authorized_keys`。
**重要**  
以下示例使用 Amazon Linux 用户名 `ec2-user`。您可能需要使用其他用户名来替换，例如对于 Ubuntu 实例为 `ubuntu`。

   ```
   [ec2-user ~]$ cp .ssh/authorized_keys /mnt/tempvol/home/{{ec2-user}}/.ssh/authorized_keys
   ```

   如果复制成功，则可以转到下一步骤。

   （可选）如果您没有权限编辑 `/mnt/tempvol` 中的文件，您必须使用 **sudo** 更新文件，然后检查文件的权限，以验证您是否能够登录原始实例。请使用以下命令检查文件权限。

   ```
   [ec2-user ~]$ sudo ls -l /mnt/tempvol/home/ec2-user/.ssh
   total 4
   -rw------- 1 {{222 500}} 398 Sep 13 22:54 authorized_keys
   ```

   在这个输出示例中，{{222}} 是用户 ID；{{500}} 是组 ID。接下来，请使用 **sudo** 重新运行失败的复制命令。

   ```
   [ec2-user ~]$ sudo cp .ssh/authorized_keys /mnt/tempvol/home/{{ec2-user}}/.ssh/authorized_keys
   ```

   再次运行以下命令以确定权限是否已更改。

   ```
   [ec2-user ~]$ sudo ls -l /mnt/tempvol/home/{{ec2-user}}/.ssh
   ```

   如果用户 ID 和组 ID 已经更改，请使用以下命令进行恢复。

   ```
   [ec2-user ~]$ sudo chown {{222:500}} /mnt/tempvol/home/{{ec2-user}}/.ssh/authorized_keys
   ```

### 步骤 7：从临时实例中卸载并分离原始卷，然后将其重新附加到原始实例
<a name="step-7-unmount-detach-volume-and-reattach-to-original-instance"></a>

1. 在临时实例中，卸载已附加的卷，以将其重新附加到原始实例。例如，使用以下命令卸载 `/mnt/tempvol` 处的卷。

   ```
   [ec2-user ~]$ sudo umount /mnt/tempvol
   ```

1. 从临时实例中分离卷（您在上一步中卸载了该卷）：从 Amazon EC2 控制台，在导航窗格中选择**卷**，为原始实例选择根卷（您在上一步中记下了卷 ID），依次选择**操作**、**分离卷**，然后选择**分离**。等待卷的状态变为 `available`。（您可能需要选择“刷新”图标。）

1. 将卷重新附加到原始实例：在卷仍保持选中状态时，选择 **Actions**（操作），然后选择 **Attach Volume**（附加卷）。选择原始实例的实例 ID，请指定您以前在[步骤 2](#step-2-get-info-about-original-instance) 中记下的原始根卷附加的设备名称（`/dev/sda1` 或 `/dev/xvda`），然后选择**附加卷**。
**重要**  
如果您不指定与原始附加相同的设备名称，则无法启动原始实例。Amazon EC2 要求根卷位于 `sda1` 或者 `/dev/xvda`。

### 步骤 8：使用新密钥对连接到原始实例
<a name="step-8-connect-to-original-instance"></a>

选择原始实例，然后依次选择**实例状态**、**启动实例**。在实例进入 `running` 状态后，您可以使用新密钥对的私有密钥文件连接到该实例。

**注意**  
如果您的新密钥对和相应私有密钥文件的名称不同于原始密钥对的名称，请确保在连接到实例时指定新私有密钥文件的名称。

### 步骤 9：清除
<a name="step-9-clean-up"></a>

(可选) 如果您将不再使用临时实例，可以将其终止。选择临时实例，然后依次选择**实例状态**、**终止（删除）实例**。
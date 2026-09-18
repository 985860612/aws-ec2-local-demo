

# 使用 SCP 将文件传输到 Linux 实例
<a name="linux-file-transfer-scp"></a>

在您的本地计算机与 Linux 实例之间传输文件的一种方法是使用安全复制协议 (SCP)。SCP 非常适合简单的操作，例如一次性文件副本。SCP 用来保护文件传输的 .pem 文件与您用来通过 SSH 连接到实例的文件相同。如果需要保持文件同步，或者文件很大，则 **rsync** 比 SCP 更快、更高效。为安全起见，请通过 SSH 使用 **rsync**，因为 **rsync** 默认情况下会使用明文传输数据。

在使用 SCP 连接到 Linux 实例之前，请先完成以下任务：
+ **完成一般先决条件。**
  + 检查您的实例是否通过了状态检查。可能需要花几分钟时间，实例才能准备好接受连接请求。有关更多信息，请参阅 [查看状态检查](viewing_status.md)。
  + [获取所需的实例详细信息](connection-prereqs-general.md#connection-prereqs-get-info-about-instance).
  + [查找私有密钥并设置权限](connection-prereqs-general.md#connection-prereqs-private-key).
  + [（可选）获取实例指纹](connection-prereqs-general.md#connection-prereqs-fingerprint).
+ **允许来自您 IP 地址的入站 SSH 流量。**

  确保与您的实例关联的安全组允许来自您的 IP 地址的入站 SSH 流量。有关更多信息，请参阅 [用于从您的计算机连接到实例的规则](security-group-rules-reference.md#sg-rules-local-access)。
+ **安装 SCP 客户端。**

  默认情况下，大多数 Linux、Unix 和 Apple 计算机都包含 SCP 客户端。如果您的计算机不含 SSH 客户端，OpenSSH 项目提供了整套 SSH 工具免费使用的功能，包括 SCP 客户端。有关更多信息，请参阅 [https://www.openssh.com](https://www.openssh.com)。

以下过程将指导您使用实例的公有 DNS 名称或 IPv6 地址（如果实例具有该地址），通过 SCP 传输文件。

**使用 SCP 在您的计算机和实例之间传输文件**

1. 确定源文件在计算机上的位置以及在实例上的目标路径。在以下示例中，私有密钥文件的名称是 `key-pair-name.pem`，要传输的文件是 `my-file.txt`，实例的用户名是 ec2-user，实例的公有 DNS 名称是 `instance-public-dns-name`，实例的 IPv6 地址是 `2001:db8::1234:5678:1.2.3.4`。
   + （公有 DNS）要将文件传输到实例上的目标位置，请在计算机中输入以下命令。

     ```
     scp -i {{/path/key-pair-name}}.pem {{/path/my-file.txt}} {{ec2-user}}@{{instance-public-dns-name}}:{{path/}}
     ```
   + (IPv6) 如果实例具有 IPv6 地址，要将文件传输到实例上的目标位置，请在计算机中输入以下命令。IPv6 地址必须用方括号 (`[ ]`) 括起来，并且必须对方括号进行转义 (`\`)。

     ```
     scp -i {{/path/key-pair-name}}.pem {{/path/my-file.txt}} {{ec2-user}}@\[{{2001:db8::1234:5678:1.2.3.4}}\]:{{path/}}
     ```

1. 如果您尚未使用 SSH 连接到实例，则会看到如下响应：

   ```
   The authenticity of host 'ec2-198-51-100-1.compute-1.amazonaws.com (10.254.142.33)'
   can't be established.
   RSA key fingerprint is 1f:51:ae:28:bf:89:e9:d8:1f:25:5d:37:2d:7d:b8:ca:9f:f5:f1:6f.
   Are you sure you want to continue connecting (yes/no)?
   ```

   （可选）您可以选择验证安全警报中的指纹是否与实例指纹匹配。有关更多信息，请参阅[（可选）获取实例指纹](connection-prereqs-general.md#connection-prereqs-fingerprint)。

   输入 **yes**。

1. 如果传输成功，则响应的形式与下方类似：

   ```
   Warning: Permanently added 'ec2-198-51-100-1.compute-1.amazonaws.com' (RSA) 
   to the list of known hosts.
   my-file.txt                                100%   480     24.4KB/s   00:00
   ```

1. 要在另一个方向上传输文件（从 Amazon EC2 实例中传输到计算机），请颠倒主机参数的顺序。例如，您可以将 `my-file.txt` 从 EC2 实例传输到本地计算机上的目标位置，保存为 `my-file2.txt`，如以下示例所示。
   + （公有 DNS）要将文件传输到计算机中的目标位置，请在计算机中输入以下命令。

     ```
     scp -i {{/path/key-pair-name}}.pem {{ec2-user}}@{{instance-public-dns-name}}:{{path/my-file.txt path/my-file2.txt}}
     ```
   + (IPv6) 如果实例具有 IPv6 地址，要将文件传输到计算机中的目标位置，请在计算机中输入以下命令。IPv6 地址必须用方括号 (`[ ]`) 括起来，并且必须对方括号进行转义 (`\`)。

     ```
     scp -i {{/path/key-pair-name}}.pem {{ec2-user}}@\[{{2001:db8::1234:5678:1.2.3.4}}\]:{{path/my-file.txt path/my-file2.txt}}
     ```
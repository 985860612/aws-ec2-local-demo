

# 创建共享 Linux AMI 的建议
<a name="building-shared-amis"></a>

使用以下指南可缩小攻击面并提高您创建的 AMI 的可靠性。

**重要**  
任何安全指南都不是详尽无遗的。请仔细构建您的共享 AMI，并花时间考虑可能导致暴露敏感数据的位置。

**Topics**
+ [对根用户禁用基于密码的远程登录](#public-amis-disable-password-logins-for-root)
+ [禁用本地根访问](#restrict-root-access)
+ [删除 SSH 主机密钥对](#remove-ssh-host-key-pairs)
+ [安装公有密钥凭证](#public-amis-install-credentials)
+ [禁用 sshd DNS 检查（可选）](#public-amis-disable-ssh-dns-lookups)
+ [移除敏感数据](#public-amis-protect-yourself)

如果为 AWS Marketplace 构建 AMI，请参阅 *AWS Marketplace 卖家指南*中的[构建 AMI 的最佳实践](https://docs.aws.amazon.com/marketplace/latest/userguide/best-practices-for-building-your-amis.html)，以了解指导原则、策略和最佳实践。

## 对根用户禁用基于密码的远程登录
<a name="public-amis-disable-password-logins-for-root"></a>

为公用 AMI 使用固定的根密码是一种很快为人知晓的安全风险。甚至于用户在第一次登录后更改密码都会给可能的滥用以可乘之机。

要解决此问题，请对根用户禁用基于密码的远程登录。

**对根用户禁用基于密码的远程登录**

1. 用文字编辑器打开 `/etc/ssh/sshd_config` 文件并查找以下行：

   ```
   #PermitRootLogin yes
   ```

1. 将行更改为：

   ```
   PermitRootLogin without-password
   ```

   若您的发行版不同或您未运行 OpenSSH，此配置文件的位置可能也会不同。若情况如此，请咨询相关文档。

## 禁用本地根访问
<a name="restrict-root-access"></a>

在使用共享 AMI 时，最佳做法是禁用直接根登录。为此，请登录到您正在运行的实例并发出以下命令：

```
[ec2-user ~]$ sudo passwd -l root
```

**注意**  
该命令不影响 `sudo` 的使用。

## 删除 SSH 主机密钥对
<a name="remove-ssh-host-key-pairs"></a>

 如果您计划共享源自公用 AMI 的 AMI，请删除 `/etc/ssh` 中的现有 SSH 主机密钥对。这会促使 SSH 在有人使用您的 AMI 启动实例时生成新的独特 SSH 密钥对，从而提高安全性并降低“中间人”攻击可能性。

删除系统上存在的以下所有密钥文件。
+  ssh\_host\_dsa\_key 
+  ssh\_host\_dsa\_key.pub 
+  ssh\_host\_key 
+  ssh\_host\_key.pub 
+  ssh\_host\_rsa\_key 
+  ssh\_host\_rsa\_key.pub 
+ ssh\_host\_ecdsa\_key
+ ssh\_host\_ecdsa\_key.pub
+ ssh\_host\_ed25519\_key
+ ssh\_host\_ed25519\_key.pub

您可以使用以下命令安全地删除所有这些文件。

```
[ec2-user ~]$ sudo shred -u /etc/ssh/*_key /etc/ssh/*_key.pub
```

**警告**  
安全删除实用工具（例如 **shred**）可能不会移除存储介质中某个文件的所有副本。文件的隐藏副本可能是由日志文件系统 (包括 Amazon Linux 默认 ext4)、快照、备份、RAID 和临时缓存创建的。有关更多信息，请参阅 [shred 文档](https://www.gnu.org/software/coreutils/manual/html_node/shred-invocation.html)。

**重要**  
如果您忘记从您的公用 AMI 中删除现有 SSH 主机密钥对，我们的例行审核过程会通知您和所有运行您的 AMI 实例的客户存在潜在安全风险。短暂的宽限期过后，我们会将 AMI 标记为私有。

## 安装公有密钥凭证
<a name="public-amis-install-credentials"></a>

配置 AMI 以防止使用密码进行登录后，您必须确保用户能用另一种机制登录。

Amazon EC2 允许用户在启动实例时指定公用–私有密钥对名称。向 `RunInstances` API 调用提供有效的密钥对名称后（或通过命令行 API 工具），公用密钥（Amazon EC2 在至 `CreateKeyPair` 或 `ImportKeyPair` 的调用后在服务器上保留的密钥对的部分)通过针对实例元数据的 HTTP 查询供实例使用。

要通过 SSH 登录，您的 AMI 必须在启动时检索密钥值并将该值附加到 `/root/.ssh/authorized_keys` (或 AMI 上任何其他用户账户的等效密钥)。用户可使用密钥对启动您的 AMI 的实例，并在不需要根密码的情况下进行登录。

很多发行版（包括 Amazon Linux 和 Ubuntu）使用 `cloud-init` 软件包为配置的用户插入公有密钥凭证。如果您的发行版不支持 `cloud-init`，则可以将以下代码添加到系统启动脚本（如 `/etc/rc.local`），以提取您在启动时为根用户指定的公有密钥。

**注意**  
在以下示例中，IP 地址 http://169.254.169.254/ 是链路本地地址，仅从该实例有效。

------
#### [ IMDSv2 ]

```
if [ ! -d /root/.ssh ] ; then
        mkdir -p /root/.ssh
        chmod 700 /root/.ssh
fi
# Fetch public key using HTTP
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key > /tmp/my-key
if [ $? -eq 0 ] ; then
        cat /tmp/my-key >> /root/.ssh/authorized_keys
        chmod 700 /root/.ssh/authorized_keys
        rm /tmp/my-key
fi
```

------
#### [ IMDSv1 ]

```
if [ ! -d /root/.ssh ] ; then
        mkdir -p /root/.ssh
        chmod 700 /root/.ssh
fi
# Fetch public key using HTTP
curl http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key > /tmp/my-key
if [ $? -eq 0 ] ; then
        cat /tmp/my-key >> /root/.ssh/authorized_keys
        chmod 700 /root/.ssh/authorized_keys
        rm /tmp/my-key
fi
```

------

 这一点适用于任何用户；无需将其限制为 `root` 用户。

**注意**  
根据此 AMI 进行的实例重新捆绑包括启动时所用的密钥。要防止密钥被包含，您必须清除 (或删除) `authorized_keys` 文件或将此文件排除在重新捆绑之外。

## 禁用 sshd DNS 检查（可选）
<a name="public-amis-disable-ssh-dns-lookups"></a>

禁用 sshd DNS 检查会稍微减弱您的 sshd 安全性。但是，如果 DNS 解析失败，SSH 的登录仍然有效。如果您未禁用 sshd 检查，DNS 解析失败后会阻止所有的登录。

**要禁用 sshd DNS 检查**

1. 用文字编辑器打开 `/etc/ssh/sshd_config` 文件并查找以下行：

   ```
   #UseDNS yes
   ```

1. 将行更改为：

   ```
   UseDNS no
   ```

**注意**  
若您的发行版不同或您未运行 OpenSSH，此配置文件的位置也会不同。若情况如此，请咨询相关文档。

## 移除敏感数据
<a name="public-amis-protect-yourself"></a>

我们不建议您将敏感数据或软件存储在您共享的任何 AMI 上。启动共享 AMI 的用户可能能够重新捆绑 AMI 并能自行注册 AMI。遵循上述指南可助您避免一些容易被忽视的安全风险：
+ 我们建议对 `--exclude {{directory}}` 使用 `ec2-bundle-vol` 选项，以跳过包含您不想在捆绑中包含的机密信息的所有目录和子目录。具体而言，在捆绑映像时，排除所有用户拥有的 SSH 公有/私有密钥对和 SSH `authorized_keys` 文件。Amazon 公有 AMI 会将其存储在 `/root/.ssh`（对于根用户）和 `/home/{{user_name}}/.ssh/`（对于常规用户）中。有关更多信息，请参阅 [ec2-bundle-vol](ami-tools-commands.md#ami-bundle-vol)。
+ 务必在捆绑前删除 Shell 程序历史记录。如果您在同一 AMI 中多次尝试捆绑上传，Shell 程序历史中将包含访问密钥。以下示例应为从实例内部捆绑前您运行的最后一个命令。

  ```
  [ec2-user ~]$ shred -u ~/.*history
  ```
**警告**  
以上警告中描述的 **shred** 的限制在此处也适用。  
请注意，bash 在退出时会将当前会话的历史记录写入磁盘。如果您在删除 `~/.bash_history` 后注销您的实例，然后重新登录，您将发现 `~/.bash_history` 已重新创建且包含上一会话期间运行的所有命令。  
Bash 以外的其他程序也会将历史记录写入磁盘，请谨慎使用并删除或排除不必要的点文件和点目录。
+ 捆绑正在运行的实例需要您的私有密钥和 X.509 证书。将上述密钥和凭证以及其他证书放置到未予捆绑的位置 (如实例存储)。
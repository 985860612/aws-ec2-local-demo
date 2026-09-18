

# 准备使用适用于 Linux 的共享 AMI
<a name="usingsharedamis-confirm"></a>

使用适用于 Linux 的共享 AMI 之前，应执行以下步骤以确认没有预安装凭证允许第三方对您的实例进行不希望的访问，并且没有可能将敏感数据传输给第三方的预配置远程登录。查看 AMI 使用的 Linux 发行版的文档以了解有关提高系统安全性的信息。

为了确保您不会在无意中丢失对您的实例的访问，我们建议您启动两个 SSH 会话并将第二个会话保持为打开状态，直到您删除了无法识别的凭证并确认您仍可以使用 SSH 登录您的实例。

1. 标识并禁用任何未经授权的公有 SSH 密钥。该文件中的唯一密钥应是您用于启动 AMI 的密钥。以下命令查找 `authorized_keys` 文件：

   ```
   [ec2-user ~]$ sudo find / -name "authorized_keys" -print -exec cat {} \;
   ```

1. 对根用户禁用基于密码的身份验证。打开 `sshd_config``PermitRootLogin` 文件并编辑 行，如下所示：

   ```
   PermitRootLogin without-password
   ```

   或者，您可以禁用以根用户身份登录实例的功能：

   ```
   PermitRootLogin No
   ```

   重启 sshd 服务。

1. 检查是否有任何其他用户能够登录您的实例。具有超级用户权限的用户尤为危险。删除或锁定任何未知账户的密码。

1. 检查打开的端口以确认您未在使用和运行侦听传入连接的网络服务。

1. 要防止预配置的远程登录，应删除现有配置文件并重启 `rsyslog` 服务。例如：

   ```
   [ec2-user ~]$ sudo rm /etc/rsyslog.conf
   [ec2-user ~]$ sudo service rsyslog restart
   ```

1. 验证所有 cron 作业的合法性。

如果您发现了认为存在安全风险的公用 AMI，请联系 AWS 安全团队。有关更多信息，请参阅 [AWS 安全中心](https://aws.amazon.com/security/)。
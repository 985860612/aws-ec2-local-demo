

# 更改 Amazon EC2 实例的 Windows 管理员密码
<a name="ec2-windows-passwords"></a>

如果您从 AWS Windows AMI 启动实例，则预安装的启动代理会按如下方式设置默认密码：
+ 对于 Windows Server 2022 及更高版本，[EC2Launch v2](ec2launch-v2.md) 会生成默认密码。
+ 对于 Windows Server 2016 和 2019，[EC2Launch](ec2launch.md) 代理会生成默认密码。
+ 对于 Windows Server 2012 R2 及更早版本，[EC2Config 服务](ec2config-service.md)会生成默认密码。

**注意**  
对于 Windows Server 2016 及更高版本 AMI，对本地管理员禁用 `Password never expires`。对于 Windows Server 2016 之前的 AMI 版本，对本地管理员启用 `Password never expires`。

## 在连接后更改管理员密码
<a name="change-admin-password"></a>

在首次连接到实例后，建议您更改管理员密码的默认值。执行以下步骤可更改 Windows 实例的管理员密码。

**重要**  
将新密码保存在安全位置。您无法使用 Amazon EC2 控制台检索新密码。控制台只能用于检索默认密码。如果您尝试在更改默认密码后使用该密码连接到实例，则会收到错误“Your credentials did not work”。

**更改本地管理员密码**

1. 连接到实例并打开命令提示符。

1. 运行以下命令。如果您的新密码包含特殊字符，请确保将密码放入双引号之中。

   ```
   net user Administrator "{{new_password}}"
   ```

1. 将新密码保存在安全位置。

## 更改丢失或过期的密码
<a name="change-lost-expired-password"></a>

如果您丢失了密码或密码过期，则可以生成新密码。有关密码重置步骤，请参阅[重置 Amazon EC2 Windows 实例的 Windows 管理员密码](ResettingAdminPassword.md)。


# 连接到您的 EC2 实例
<a name="connect"></a>

Amazon EC2 实例是 AWS Cloud中的虚拟服务器。要登录实例，必须先与实例建立连接。连接实例的方式取决于实例的操作系统，以及用于连接实例的计算机上的操作系统。下表详细说明了每种连接方法的要求。


| 连接选项 | 实例操作系统 | 入站流量规则 | IAM 权限 | 实例配置文件角色 | 实例上的软件 | 连接系统上的软件 | 密钥对 | 
| --- | --- | --- | --- | --- | --- | --- | --- | 
| SSH 客户端 | Linux | 是 | 否 | 否 | 否 | 是 | 是 | 
| EC2 Instance Connect | Linux | 支持 | 是 | 否 | 是¹ | 否 | 否 | 
| PuTTY | Linux | 是 | 否 | 否 | 否 | 是 | 是 | 
| RDP 客户端 | Windows | 是 | 否 | 否 | 否 | 是 | 是² | 
| Fleet Manager | Windows | 否 | 是 | 是 | 是¹ | 否 | 是 | 
| 会话管理器 | Linux、Windows | 否 | 是 | 是 | 是¹ | 否 | 否 | 
| EC2 Instance Connect Endpoint | Linux、Windows | 支持 | 是 | 否 | 否 | 否 | 否 ³ | 

¹ 仅某些 AMI 会预装必需的软件。您可以根据需要在支持的操作系统上手动安装所需的软件。

² 只有在使用随机生成的本地管理员用户账户密码时，才需要此密钥对。

³ 如果使用 SSH 连接方法，则需要密钥对。

有关详细信息，请参阅要使用的连接选项的文档。

**连接选项**
+ [使用 SSH 客户端连接到 Linux 实例](connect-linux-inst-ssh.md)
+ [使用 PuTTY 连接到 Linux 实例](connect-linux-inst-from-windows.md)
+ [使用 RDP 客户端连接到 Windows 实例](connect-rdp.md)
+ [使用 Fleet Manager 连接到 Windows 实例](connect-rdp-fleet-manager.md)
+ [使用会话管理器进行连接](connect-with-systems-manager-session-manager.md)
+ [使用公有 IP 和 EC2 Instance Connect 进行连接](connect-linux-inst-eic.md)
+ [使用私有 IP 和 EC2 Instance Connect Endpoint 进行连接](connect-with-ec2-instance-connect-endpoint.md)
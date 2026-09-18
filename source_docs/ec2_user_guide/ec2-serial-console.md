

# 适用于实例的 EC2 Serial Console
<a name="ec2-serial-console"></a>

使用 EC2 Serial Console，您可以访问 Amazon EC2 实例的串行端口，通过该端口可以排查启动、网络配置和其他方面的问题。串行控制台不要求您的实例拥有任何联网功能。使用串行控制台，您可以向实例输入命令，就像键盘和显示器直接连接到实例的串行端口一样。串行控制台会话在实例重启和停止期间持续存在。在重新启动过程中，您可以从一开始就查看所有引导消息。

默认情况下，对串行控制台的访问权限不可用。您的组织必须授予账户对串行控制台的访问权限，并配置 IAM policy 以授予用户对串行控制台的访问权限。通过使用实例 ID、资源标签和其他 IAM 操作，可以精细地控制串行控制台访问。有关更多信息，请参阅[配置对 EC2 Serial Console 的访问](configure-access-to-serial-console.md)。

串行控制台可使用 EC2 控制台或 AWS CLI 访问。

串行控制台不会产生额外的成本。

**Topics**
+ [EC2 Serial Console 的先决条件](ec2-serial-console-prerequisites.md)
+ [配置对 EC2 Serial Console 的访问](configure-access-to-serial-console.md)
+ [连接到 EC2 Serial Console](connect-to-serial-console.md)
+ [断开与 EC2 Serial Console 的连接](disconnect-serial-console-session.md)
+ [使用 EC2 Serial Console 对 Amazon EC2 实例进行故障排查](troubleshoot-using-serial-console.md)
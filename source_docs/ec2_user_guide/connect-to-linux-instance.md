

# 使用 SSH 连接到 Linux 实例
<a name="connect-to-linux-instance"></a>

有许多方法可以使用 SSH 连接到 Linux 实例。有些方法会因发起连接的本地计算机的操作系统而有所不同。其他方法基于浏览器，例如 EC2 Instance Connect 或 AWS Systems Manager Session Manager，可以在任何计算机上使用。您可以使用 SSH 连接到 Linux 实例并运行命令，也可以使用 SSH 在本地计算机和实例之间传输文件。

在使用 SSH 连接到 Linux 实例之前，请先完成以下先决条件：
+ 检查您的实例是否通过了状态检查。可能需要花几分钟时间，实例才能准备好接受连接请求。有关更多信息，请参阅 [查看状态检查](viewing_status.md)。
+ 确保与您的实例关联的安全组允许来自您的 IP 地址的入站 SSH 流量。有关更多信息，请参阅 [用于从您的计算机连接到实例的规则](security-group-rules-reference.md#sg-rules-local-access)。
+ [获取所需的实例详细信息](connection-prereqs-general.md#connection-prereqs-get-info-about-instance).
+ [查找私有密钥并设置权限](connection-prereqs-general.md#connection-prereqs-private-key).
+ [（可选）获取实例指纹](connection-prereqs-general.md#connection-prereqs-fingerprint).

然后，选择以下某个选项来使用 SSH 连接到 Linux 实例。
+ [使用 SSH 客户端进行连接](connect-linux-inst-ssh.md)
+ [使用 PuTTY 进行连接](connect-linux-inst-from-windows.md) 
+ [使用 SCP 传输文件](linux-file-transfer-scp.md)

如果无法连接到实例，并且需要进行问题排查，请参阅[排查 Amazon EC2 Linux 实例的连接问题](TroubleshootingInstancesConnecting.md)。
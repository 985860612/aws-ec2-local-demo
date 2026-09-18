

# 排查 Amazon EC2 Windows 实例的 Sysprep 问题
<a name="sysprep-troubleshoot"></a>

如果在映像准备过程中遇到问题或收到错误消息，请查看以下日志。日志位置取决于您是使用 Sysprep 运行 EC2Config、EC2Launch v1 还是 EC2Launch v2。
+ `%WINDIR%\Panther\Unattendgc`（EC2Config、EC2Launch v1 和 EC2Launch v2）
+ `%WINDIR%\System32\Sysprep\Panther`（EC2Config、EC2Launch v1 和 EC2Launch v2）
+ `C:\Program Files\Amazon\Ec2ConfigService\Logs\Ec2ConfigLog.txt`（仅限 EC2Config）
+ `C:\ProgramData\Amazon\Ec2Config\Logs`（仅限 EC2Config）
+ `C:\ProgramData\Amazon\EC2-Windows\Launch\Log\EC2Launch.log`（仅限 EC2Launch v1）
+ `%ProgramData%\Amazon\EC2Launch\log\agent.log`（仅限 EC2Launch v2）

如果在使用 Sysprep 进行映像准备的过程中收到错误消息，则 OS 可能无法访问。要查看日志文件，您必须停止实例，将其根卷作为辅助卷附加到另一个运行状况良好的实例，然后在辅助卷上查看前述日志。如需详细了解如何通过名称辨别日志文件的用途，请参阅 Microsoft 文档中的 [Windows 设置相关日志文件](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/deployment-troubleshooting-and-log-files#windows-setup-related-log-files)。

如果在 Unattendgc 日志文件中找到错误，请使用 [Microsoft 错误查找工具](https://www.microsoft.com/en-us/download/details.aspx?id=100432)获取有关错误的更多详细信息。以下在 Unattendgc 日志文件中报告的问题通常是实例上一个或多个损坏的用户配置文件造成的：

```
Error [Shell Unattend] _FindLatestProfile failed (0x80070003) [gle=0x00000003]
Error [Shell Unattend] CopyProfile failed (0x80070003) [gle=0x00000003]
```

有两个选项可用于解决此问题：

**选项 1**

在实例上使用 Regedit 搜索以下项。验证已删除用户是否没有配置文件注册表项。

`[HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\ProfileList\`

**选项 2**。

1. 按如下方式编辑相关文件：
   + Windows Server 2012 R2 及更早版本 — 编辑 EC2Config 应答文件 (`C:\Program Files\Amazon\Ec2ConfigService\sysprep2008.xml`)。
   + Windows Server 2016 和 2019 – 编辑 unattend.xml 应答文件 (`C:\ProgramData\Amazon\EC2-Windows\Launch\Sysprep\Unattend.xml`)。
   + Windows Server 2022 – 编辑 unattend.xml 应答文件 (`C:\ProgramData\Amazon\EC2Launch\sysprep\unattend.xml`)。

1. 将 `<CopyProfile>true</CopyProfile>` 更改为 `<CopyProfile>false</CopyProfile>`。

1. 再次运行 Sysprep。请注意，此配置更改会在 Sysprep 完成之后删除内置管理员用户配置文件。
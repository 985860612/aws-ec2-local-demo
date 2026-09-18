

# 排查 Amazon EC2 实例休眠问题
<a name="troubleshoot-instance-hibernate"></a>

使用此信息帮助您诊断和修复在使实例休眠时可能遇到的问题。

**Topics**
+ [在启动后无法立即休眠](#hibernate-troubleshooting-1)
+ [从 stopping 转变为 stopped 用时太长，内存状态在启动后无法恢复](#hibernate-troubleshooting-2)
+ [实例卡在 stopping 状态](#hibernate-troubleshooting-3)
+ [休眠后无法立即启动竞价型实例](#hibernate-troubleshooting-4)
+ [恢复竞价型实例失败](#hibernate-troubleshooting-5)

## 在启动后无法立即休眠
<a name="hibernate-troubleshooting-1"></a>

如果您在实例启动之后过快地尝试使实例休眠，则会收到错误。

Linux 实例在启动之后，您必须等待大约 2 分钟才会休眠，对于 Windows 实例，在启动之后，您必须等待大约 5 分钟后才会休眠。

## 从 stopping 转变为 stopped 用时太长，内存状态在启动后无法恢复
<a name="hibernate-troubleshooting-2"></a>

如果正在进入休眠的实例从 `stopping` 状态转变为 `stopped` 状态用时过长，并且在启动之后内存状态未恢复，则这可能表明未正确配置休眠。

**Linux 实例**

检查实例系统日志，查找与休眠相关的消息。要访问系统日志，请[连接](connect-to-linux-instance.md)到实例或者使用 [get-console-output](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-console-output.html) 命令。从 `hibinit-agent` 中查找日志行。如果日志行指示出现故障或者缺少日志行，则很有可能在启动时配置休眠失败。

例如，以下消息指明实例根卷不够大：`hibinit-agent: Insufficient disk space. Cannot create setup for hibernation. Please allocate a larger root device.`

如果 `hibinit-agent` 中的最后日志行是 `hibinit-agent: Running: swapoff /swap`，则已成功配置休眠。

如果您未看到来自这些进程的任何日志，您的 AMI 可能不支持休眠。有关支持的 AMI 的信息，请参阅[EC2 实例休眠的先决条件](hibernating-prerequisites.md)。如果您使用自己的 Linux AMI，则请确保按照 [配置 Linux AMI 以支持休眠](hibernation-enabled-AMI.md) 的说明操作。

**Windows Server 2016 及更高版本**  
检查 EC2 Launch 日志，查找与休眠相关的消息。要访问 EC2 Launch 日志，请[连接](connecting_to_windows_instance.md)到实例并在文本编辑器中打开 `C:\ProgramData\Amazon\EC2-Windows\Launch\Log\Ec2Launch.log` 文件。如果使用 EC2Launch v2，请打开 `C:\ProgramData\Amazon\EC2Launch\log\agent.log`。

**注意**  
默认情况下，Windows 会隐藏 `C:\ProgramData` 下的文件和文件夹。要查看 EC2 Launch 目录和文件，必须在 Windows 资源管理器中输入路径，或者更改文件夹属性以显示隐藏的文件和文件夹。

查找休眠的日志行。如果日志行指示出现故障或者缺少日志行，则很有可能在启动时配置休眠失败。

例如，以下消息指示休眠配置失败：`Message: Failed to enable hibernation.` 如果错误消息包含十进制 ASCII 值，则可以将这些 ASCII 值转换为纯文本，以便读取完整的错误消息。

如果日志行包含 `HibernationEnabled: true`，则已成功配置休眠。

**Windows Server 2012 R2 和早期版本**  
检查 EC2 配置日志，查找与休眠相关的消息。要访问 EC2 配置日志，请[连接](connecting_to_windows_instance.md)到实例并在文本编辑器中打开 `C:\Program Files\Amazon\Ec2ConfigService\Logs\Ec2ConfigLog.txt` 文件。从 `SetHibernateOnSleep` 中查找日志行。如果日志行指示出现故障或者缺少日志行，则很有可能在启动时配置休眠失败。

例如，以下消息指明实例根卷不够大：`SetHibernateOnSleep: Failed to enable hibernation: Hibernation failed with the following error: There is not enough space on the disk.`

如果日志行为 `SetHibernateOnSleep: HibernationEnabled: true`，则已成功配置休眠。

**Windows 实例大小**  
如果您使用的是 RAM 小于 1 GiB 的 T3 或 T3a Windows 实例，请尝试将实例的大小增加到至少有 1 GiB RAM 的实例。

## 实例卡在 stopping 状态
<a name="hibernate-troubleshooting-3"></a>

如果您已使实例休眠并且实例卡在 `stopping` 状态，则可以强制停止它。有关更多信息，请参阅 [排查 Amazon EC2 实例的停止问题](TroubleshootingInstancesStopping.md)。

## 休眠后无法立即启动竞价型实例
<a name="hibernate-troubleshooting-4"></a>

如果您尝试在竞价型实例休眠后的两分钟内启动该实例，则可能会出现以下错误：

`You failed to start the Spot Instance because the associated Spot Instance request is not in an appropriate state to support start.`

对于 Linux 实例，等待大约 2 分钟，对于 Windows 实例，等待大约 5 分钟，然后重试启动实例。

## 恢复竞价型实例失败
<a name="hibernate-troubleshooting-5"></a>

如果您的竞价型实例成功休眠但无法恢复，而是重新启动（未保留休眠状态的全新重启），则可能是因为用户数据包含以下脚本：

```
/usr/bin/enable-ec2-spot-hibernation
```

从启动模板的**用户数据**字段中移除此脚本，然后请求新的竞价型实例。

请注意，即使实例无法恢复，在不保留休眠状态的情况下，该实例仍然可以像从 `stopped` 状态启动一样启动。


# 发送诊断中断来调试无法访问的 Amazon EC2 实例
<a name="diagnostic-interrupt"></a>

**警告**  
诊断中断供高级用户使用。使用不当会对您的实例产生负面影响。向实例发送诊断中断可能会触发实例崩溃和重新启动，从而导致数据丢失。

您可以向无法访问或无响应的实例发送诊断中断，以手动触发 Linux 实例的*内核错误*或 Windows 实例的*停止错误*（通常称为*蓝屏错误*）。

**Linux 实例**  
在出现内核错误时，Linux 操作系统通常会发生崩溃并重启。操作系统的具体行为取决于其配置。内核错误也可用于使实例的操作系统内核执行任务，例如生成崩溃转储文件。然后，您可以使用崩溃转储文件中的信息进行根本原因分析并调试实例。崩溃转储数据由操作系统在实例本身上本地生成。

**Windows 实例**  
通常，Windows 操作系统在发生停止错误时发生崩溃并重启，但具体行为取决于其配置。停止错误还可能导致操作系统将调试信息（例如内核内存转储）写入文件。然后，您可以使用此信息进行根本原因分析以调试实例。内存转储数据由操作系统在实例本身上本地生成。

在向您的实例发送诊断中断之前，我们建议您查阅适合您操作系统的文档，然后进行必要的配置更改。

**Topics**
+ [支持的实例类型](#diagnostic-interrupt-instances)
+ [先决条件](#diagnostic-interrupt-prereqs)
+ [发送诊断中断](#diagnostic-interrupt-use)

## 支持的实例类型
<a name="diagnostic-interrupt-instances"></a>

除 AWS Graviton 处理器支持的实例类型外的所有基于 Nitro 的实例类型均支持诊断中断。有关更多信息，请参阅[基于 AWS Nitro System 构建的实例](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-nitro-instances.html)和 [AWS Graviton](https://aws.amazon.com/ec2/graviton/)。

## 先决条件
<a name="diagnostic-interrupt-prereqs"></a>

在使用诊断中断之前，必须配置实例的操作系统。这可确保在发生内核错误（Linux 实例）或停止错误（Windows 实例）时执行所需的操作。

### Linux 实例
<a name="diagnostic-interrupt-prereqs-linux"></a>

**将 Amazon Linux 2 或 Amazon Linux 2023 配置为在发生内核错误时生成崩溃转储**

1. 连接到您的 实例。

1. 安装 **kexec** 和 **kdump**。

   ```
   [ec2-user ~]$ sudo yum install kexec-tools -y
   ```

1. 配置内核以便为辅助内核预留适当的内存量。要预留的内存量取决于实例的总可用内存。使用首选文本编辑器打开 `/etc/default/grub` 文件，找到以 `GRUB_CMDLINE_LINUX_DEFAULT` 开始的行，然后按以下格式添加 `crashkernel` 参数：`crashkernel={{memory_to_reserve}}`。例如，要预留 `256MB`，请修改 `grub` 文件，如下所示：

   ```
   GRUB_CMDLINE_LINUX_DEFAULT="crashkernel=256M console=tty0 console=ttyS0,115200n8 net.ifnames=0 biosdevname=0 nvme_core.io_timeout=4294967295 rd.emergency=poweroff rd.shell=0"
   GRUB_TIMEOUT=0
   GRUB_DISABLE_RECOVERY="true"
   ```

1. 保存更改并关闭 `grub` 文件。

1. 重新构建 GRUB2 配置文件。

   ```
   [ec2-user ~]$ sudo grub2-mkconfig -o /boot/grub2/grub.cfg
   ```

1. 在基于 Intel 和 AMD 处理器的实例上，`send-diagnostic-interrupt` 命令将*未知的非屏蔽中断* (NMI) 发送到实例。您必须将内核配置为在收到未知 NMI 时发生崩溃。使用首选文本编辑器打开 `/etc/sysctl.conf` 文件，并添加以下内容。

   ```
   kernel.unknown_nmi_panic=1
   ```

1. 重启实例并重新连接到它。

1. 使用正确的 `crashkernel` 参数验证是否已启动内核。

   ```
   $ grep crashkernel /proc/cmdline
   ```

   以下示例输出指示成功的配置。

   ```
   BOOT_IMAGE=/boot/vmlinuz-4.14.128-112.105.amzn2.x86_64 root=UUID=a1e1011e-e38f-408e-878b-fed395b47ad6 ro crashkernel=256M console=tty0 console=ttyS0,115200n8 net.ifnames=0 biosdevname=0 nvme_core.io_timeout=4294967295 rd.emergency=poweroff rd.shell=0
   ```

1. 确认 **kdump** 服务正在运行。

   ```
   [ec2-user ~]$ systemctl status kdump.service
   ```

   以下示例输出显示在 **kdump** 服务正在运行的情况下的结果。

   ```
   kdump.service - Crash recovery kernel arming
      Loaded: loaded (/usr/lib/systemd/system/kdump.service; enabled; vendor preset: enabled)
      Active: active (exited) since Fri 2019-05-24 23:29:13 UTC; 22s ago
     Process: 2503 ExecStart=/usr/bin/kdumpctl start (code=exited, status=0/SUCCESS)
    Main PID: 2503 (code=exited, status=0/SUCCESS)
   ```

**注意**  
默认情况下，崩溃转储文件将保存到 `/var/crash/`。要更改位置，请使用首选文本编辑器修改 `/etc/kdump.conf` 文件。

**配置 SUSE Linux Enterprise、Ubuntu 或 Red Hat Enterprise Linux**  
在基于 Intel 和 AMD 处理器的实例上，`send-diagnostic-interrupt` 命令将*未知的非屏蔽中断* (NMI) 发送到实例。必须通过调整操作系统的配置文件，将内核配置为在收到未知 NMI 时发生崩溃。有关如何将内核配置为发生崩溃的信息，请参阅适用于操作系统的文档：
+ [SUSE Linux Enterprise](https://www.suse.com/support/kb/doc/?id=3374462)
+ [Ubuntu](https://ubuntu.com/server/docs/kernel-crash-dump) - 
+ [Red Hat Enterprise Linux (RHEL)](https://access.redhat.com/solutions/6038)

### Windows 实例
<a name="diagnostic-interrupt-prereqs-windows"></a>

**配置 Windows 以在发生停止错误时生成内存转储**

1. 连接到您的 实例。

1. 打开**控制面板**，然后选择**系统**、**高级系统设置**。

1. 在**系统属性**对话框中，选择**高级**选项卡。

1. 在**启动和恢复**部分中，选择**设置...**。

1. 在**系统故障**部分中，根据需要配置设置，然后选择**确定**。

有关配置 Windows 停止错误的更多信息，请参阅 [Windows 的内存转储文件概述](https://support.microsoft.com/en-us/help/254649/overview-of-memory-dump-file-options-for-windows)。

## 发送诊断中断
<a name="diagnostic-interrupt-use"></a>

在完成必要的配置更改后，您可以使用 AWS CLI 或 Amazon EC2 API 将诊断中断发送到实例。

------
#### [ AWS CLI ]

**将诊断中断发送到实例**  
使用 [send-diagnostic-interrupt](https://docs.aws.amazon.com/cli/latest/reference/ec2/send-diagnostic-interrupt.html) 命令。

```
aws ec2 send-diagnostic-interrupt --instance-id {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**将诊断中断发送到实例**  
使用 [Send-EC2DiagnosticInterrupt](https://docs.aws.amazon.com/powershell/latest/reference/items/Send-EC2DiagnosticInterrupt.html) cmdlet。

```
Send-EC2DiagnosticInterrupt -InstanceId {{i-1234567890abcdef0}}
```

------
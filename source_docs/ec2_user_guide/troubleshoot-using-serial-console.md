

# 使用 EC2 Serial Console 对 Amazon EC2 实例进行故障排查
<a name="troubleshoot-using-serial-console"></a>

通过使用 EC2 Serial Console，您可以通过连接到实例的串行端口来排查启动、网络配置和其他方面的问题。

请使用适用于实例操作系统和在实例上配置的工具的说明。

**Topics**
+ [GRUB (Linux)](#grub)
+ [SysRq (Linux)](#SysRq)
+ [SAC (Windows)](#troubleshooting-sac)

**先决条件**  
开始之前，请确保您已完成[先决条件](ec2-serial-console-prerequisites.md)，包括配置您选择的故障排除工具。

## （Linux 实例）使用 GRUB 对您的实例进行故障排除
<a name="grub"></a>

GNU GRUB（GNU GRand Unified Bootloader [统一引导加载程序] 的缩写，通常称为 GRUB）是大多数 Linux 操作系统的默认引导加载程序。从 GRUB 菜单中，您可以选择要引导到哪个内核，或修改菜单项以更改内核的启动方式。这在对失败的实例进行故障排查时非常有用。

在引导流程中将显示 GRUB 菜单。该菜单无法通过普通 SSH 访问，但您可以使用 EC2 Serial Console 访问。

启动到单用户模式或紧急模式。单用户模式将在较低的运行级别启动内核。例如，它可能会挂载文件系统，但不会激活网络，从而使您有机会执行修复实例所需的维护。紧急模式与单用户模式类似，只是内核在可达到的最低运行级别运行。

**启动到单用户模式**

1. [连接到](connect-to-serial-console.md)实例的串行控制台。

1. 使用以下命令重新引导实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 在重新启动期间，当 GRUB 菜单出现时，按任意键停止引导流程。

1. 在 GRUB 菜单中，使用箭头键选择要引导的内核，然后按键盘上的 `e`。

1. 使用箭头键将光标定位在包含内核的行上。该行以 `linux` 或 `linux16` 开头，取决于启动实例所使用的 AMI。对于 Ubuntu，有两行开头为 `linux`，必须在下一步中修改。

1. 在行末添加 `single` 一词。

   以下是 Amazon Linux 2 的示例。

   ```
   linux /boot/vmlinuz-4.14.193-149.317.amzn2.aarch64 root=UUID=d33f9c9a-\
   dadd-4499-938d-ebbf42c3e499 ro  console=tty0 console=ttyS0,115200n8 net.ifname\
   s=0 biosdevname=0 nvme_core.io_timeout=4294967295 rd.emergency=poweroff rd.she\
   ll=0 single
   ```

1. 按 **Ctrl\+X** 可启动到单用户模式。

1. 在 `login` 提示符下，输入您[之前设置](configure-access-to-serial-console.md#set-user-password)的、基于密码的用户的用户名，然后按 **Enter** 键。

1. 在 `Password` 提示符下，输入密码，然后按 **Enter** 键。

 

**启动到紧急模式**  
请按照与单用户模式相同的步骤操作，但在第 6 步中添加单词 `emergency` 而不是 `single`。

## （Linux 实例）使用 SysRq 对您的实例进行故障排除
<a name="SysRq"></a>

系统请求 (SysRq) 键（有时称为“magic SysRq”）可用于在 Shell 外直接向内核发送命令，无论内核正在执行什么操作，内核都会响应。例如，如果实例已停止响应，则可以使用 SysRq 密钥告诉内核崩溃或重新启动。有关更多信息，请参阅 Wikipedia 中的 [Magic SysRq 键](https://en.wikipedia.org/wiki/Magic_SysRq_key)。

您可以在基于 EC2 Serial Console 浏览器的客户端中或 SSH 客户端中使用 SysRq 命令。每个客户端发送中断请求的命令都不同。

要使用 SysRq，请根据您正在使用的客户端选择以下程序之一。

------
#### [ Browser-based client ]

**在串行控制台基于浏览器的客户端中使用 SysRq**

1. [连接到](connect-to-serial-console.md)实例的串行控制台。

1. 要发送中断请求，请按 `CTRL+0`（零）。如果您的键盘支持，还可以使用暂停或中断键发送中断请求。

   ```
   [ec2-user ~]$ CTRL+0
   ```

1. 要发出 SysRq 命令，请按键盘上与所需命令对应的键。例如，要显示 SysRq 命令列表，请按 `h`。

   ```
   [ec2-user ~]$ h
   ```

   `h` 命令的输出类似于以下内容。

   ```
   [ 1169.389495] sysrq: HELP : loglevel(0-9) reboot(b) crash(c) terminate-all-tasks(e) memory-full-oom-kill(f) kill-all-tasks(i) thaw-filesystems
   (j) sak(k) show-backtrace-all-active-cpus(l) show-memory-usage(m) nice-all-RT-tasks(n) poweroff(o) show-registers(p) show-all-timers(q) unraw(r
   ) sync(s) show-task-states(t) unmount(u) show-blocked-tasks(w) dump-ftrace-buffer(z)
   ```

------
#### [ SSH client ]

**在 SSH 客户端中使用 SysRq**

1. [连接到](connect-to-serial-console.md)实例的串行控制台。

1. 要发送中断请求，请按 `~B`（波浪号后跟大写 `B`）。

   ```
   [ec2-user ~]$ ~B
   ```

1. 要发出 SysRq 命令，请按键盘上与所需命令对应的键。例如，要显示 SysRq 命令列表，请按 `h`。

   ```
   [ec2-user ~]$ h
   ```

   `h` 命令的输出类似于以下内容。

   ```
   [ 1169.389495] sysrq: HELP : loglevel(0-9) reboot(b) crash(c) terminate-all-tasks(e) memory-full-oom-kill(f) kill-all-tasks(i) thaw-filesystems
   (j) sak(k) show-backtrace-all-active-cpus(l) show-memory-usage(m) nice-all-RT-tasks(n) poweroff(o) show-registers(p) show-all-timers(q) unraw(r
   ) sync(s) show-task-states(t) unmount(u) show-blocked-tasks(w) dump-ftrace-buffer(z)
   ```
**注意**  
您用于发送中断请求的命令可能会有所不同，取决于您正在使用的 SSH 客户端。

------

## （Windows 实例）使用 SAC 对您的实例进行故障排除
<a name="troubleshooting-sac"></a>

Windows 的特殊管理控制台 (SAC) 功能可用于对 Windows 实例进行故障排查。通过连接到实例的串行控制台并使用 SAC，您可以中断引导流程并在安全模式下启动 Windows。

**注意**  
如果您在实例上启用 SAC，则依赖密码检索的 EC2 服务将无法通过 Amazon EC2 控制台运行。Amazon EC2 启动代理（EC2Config、EC2Launch v1 和 EC2Launch v2）上的 Windows 依靠串行控制台来执行各种任务。当您在实例上启用 SAC 时，这些任务不会成功执行。有关 Amazon EC2 启动代理上的 Windows 的更多信息，请参阅 [配置您的 Amazon EC2 Windows 实例](ec2-windows-instances.md)。如果您启用 SAC，则可在之后将其禁用。有关更多信息，请参阅 [禁用 SAC 和启动菜单](#disable-sac-bootmenu)。

**Topics**
+ [使用 SAC](#use-sac)
+ [使用启动菜单](#use-boot-menu)
+ [禁用 SAC 和启动菜单](#disable-sac-bootmenu)

### 使用 SAC
<a name="use-sac"></a>

**使用 SAC**

1. [连接到串行控制台。](connect-to-serial-console.md)

   如果在实例上启用了 SAC，串行控制台将显示 `SAC>` 提示。  
![串行控制台中显示的 SAC 提示符。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/win-boot-3.png)

1. 要显示 SAC 命令，请输入 ?，然后按 **Enter**。

   预期输出  
![显示可用命令的 SAC 命令提示符。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/win-boot-4.png)

1. 要创建命令提示符通道（例如 `cmd0001` 或 `cmd0002`），请输入 cmd，然后按 **Enter**。

1. 要查看命令提示符通道，请按 **ESC**，然后按 **TAB**。

   预期输出  
![命令提示符通道。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/win-boot-5.png)

1. 要切换通道，请同时按 **ESC\+TAB\+通道编号**。例如，要切换至 `cmd0002` 通道（如果已创建），请按 **ESC\+TAB\+2**。

1. 输入命令提示符通道所需的凭证。  
![需要凭证的命令提示符。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/win-boot-6.png)

   命令提示符与您在桌面上获得的功能全面的命令 Shell 相同，例外之处是它不允许读取已输出的字符。  
![功能全面的命令 shell。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/win-boot-7.png)

**还可以从命令提示符使用 PowerShell。**

请注意，您可能需要将进度首选项设置为静默模式。

![命令提示符中的 PowerShell。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/win-boot-8.png)


### 使用启动菜单
<a name="use-boot-menu"></a>

如果实例已启用了启动菜单并在通过 SSH 连接后重新启动，则您应看到启动菜单，如下所示。

![命令提示符的启动菜单。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/win-boot-1.png)


**启动菜单命令**

ENTER  
启动操作系统的选定条目。

TAB  
切换到 Tools（工具）菜单。

ESC  
取消并重新启动实例。

按 ESC 后再按 8  
相当于按下 **F8**。显示所选项目的高级选项。

ESC 键 \+ 向左箭头  
返回到初始启动菜单。  
单靠 ESC 密钥不会让您返回主菜单，因为 Windows 正在等待查看转义序列是否正在进行中。

![高级启动选项。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/win-boot-2.png)


### 禁用 SAC 和启动菜单
<a name="disable-sac-bootmenu"></a>

如果您启用 SAC 和启动菜单，则可在之后将这些功能禁用。

使用以下方法之一在实例上禁用 SAC 和启动菜单。

------
#### [ PowerShell ]

**在 Windows 实例上禁用 SAC 和启动菜单**

1. [连接到](connecting_to_windows_instance.md)您的实例并从提升的 PowerShell 命令行执行以下步骤。

1. 首先，将值更改为 `no` 以禁用启动菜单。

   ```
   bcdedit /set '{bootmgr}' displaybootmenu no
   ```

1. 然后，将值更改为 `off` 以禁用 SAC。

   ```
   bcdedit /ems '{current}' off
   ```

1. 重新启动实例以应用更新后的配置。

   ```
   shutdown -r -t 0
   ```

------
#### [ Command prompt ]

**在 Windows 实例上禁用 SAC 和启动菜单**

1. [连接到](connecting_to_windows_instance.md)您的实例并从命令提示符执行以下步骤。

1. 首先，将值更改为 `no` 以禁用启动菜单。

   ```
   bcdedit /set {bootmgr} displaybootmenu no
   ```

1. 然后，将值更改为 `off` 以禁用 SAC。

   ```
   bcdedit /ems {current} off
   ```

1. 重新启动实例以应用更新后的配置。

   ```
   shutdown -r -t 0
   ```

------
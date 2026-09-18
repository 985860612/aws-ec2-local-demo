

# 通过失败状态检查来排查 Amazon EC2 Linux 实例问题
<a name="TroubleshootingInstances"></a>

如果您的 Linux 实例未能通过状态检查，则以下信息可帮助您排查问题。请首先确定您的应用程序是否存在任何问题。如果您验证的结果是实例没有按照预期运行应用程序，请查看状态检查信息和系统日志。

有关导致状态检查出现故障的问题示例，请参阅 [Amazon EC2 实例的状态检查](monitoring-system-instance-status-check.md)。

**Topics**
+ [查看状态检查信息](#InitialSteps)
+ [检索系统日志](#troubleshooting-retrieve-system-logs)
+ [排查 Linux 的实例的系统日志错误](#system-log-errors-linux)
+ [内存不足：终止进程](#MemoryOOM)
+ [错误：mmu\_update 失败 (内存管理更新失败)](#MemoryMMU)
+ [I/O 错误（块储存设备故障）](#DeviceBlock)
+ [I/O 错误：既不是本地磁盘也不是远程磁盘（破损的分布式块储存设备）](#DeviceDistributed)
+ [request\_module：runaway loop modprobe (在较旧的 Linux 版本上循环旧内核 modprobe)](#KernelLoop)
+ [“严重错误：内核太旧”和“fsck：在尝试打开 /dev 时没有此文件或目录”(内核与 AMI 不匹配)](#KernelOld)
+ [“FATAL: Could not load /lib/modules”或者“BusyBox”(内核模块缺失)](#KernelMissing)
+ [ERROR：无效内核 (EC2 不兼容内核)](#KernelInvalid)
+ [fsck：尝试打开时没有找到此文件或目录... (未找到文件系统)](#FilesystemFschk)
+ [挂载文件系统时出现一般性错误（挂载失败）](#FilesystemGeneral)
+ [VFS：无法在未知块上挂载根 fs (根文件系统不匹配)](#FilesystemKernel)
+ [错误：无法确定根设备的主/次编号… （根文件系统/设备不匹配）](#FilesystemError)
+ [XENBUS：设备没有驱动程序…](#FilesystemXenbus)
+ [… 没有检查时，已强制执行检查的工作日 (文件系统检查要求)](#FilesystemCheck)
+ [fsck 卡在退出状态... （设备缺失）](#FilesystemFschkDied)
+ [GRUB 提示 (grubdom>)](#OpSystemGrub)
+ [提起接口 eth0：设备 eth0 的 MAC 地址与预期不同，驳回。(硬编码的 MAC 地址)。](#OpSystemBringing)
+ [无法加载 SELinux 策略。计算机处于强制执行模式。正在中断。(SELinux 配置错误)](#OpSystemUnable)
+ [XENBUS：连接设备时超时 (Xenbus 超时)](#OpSystemXenbus)

## 查看状态检查信息
<a name="InitialSteps"></a>

**使用 Amazon EC2 控制台调查受损实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**，然后选择您的实例。

1. 选择**状态和警报**选项卡，查看所有**系统状态检查**、**实例状态检查**和**附加 EBS 状态检查**的各项结果。

如果某种状态检查失败，可以尝试以下一种选项：
+ 创建警报来恢复实例，作为对失败状态检查的响应。有关更多信息，请参阅 [创建停止、终止、重启或恢复实例的警报](UsingAlarmActions.md)。
+ （实例状态检查）如果将实例类型更改为[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)，则在从没有所需 ENA 和 NVMe 驱动程序的实例迁移时，状态检查将会失败。有关更多信息，请参阅 [更改实例类型的兼容性](resize-limitations.md)。
+ 对于具有 EBS 根卷的实例，请停止并重新启动该实例。有关更多信息，请参阅 [启动和停止 Amazon EC2 实例](Stop_Start.md)。
+ 对于具有实例存储根卷的实例，请终止该实例并启动替换实例。有关更多信息，请参阅 [终止 Amazon EC2 实例](terminating-instances.md)。
+ 等待 Amazon EC2 解决问题。
+ 联系 支持 或将问题发布到 [AWS re:Post](https://repost.aws/)。
+ 如果实例位于自动扩缩组中：
  + （系统状态检查和实例状态检查）默认情况下，Amazon EC2 Auto Scaling 会自动启动替换实例。有关更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南》**中的[自动扩缩组中实例的运行状况检查](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html)。
  + （附加 EBS 状态检查）必须配置 Amazon EC2 Auto Scaling 来自动启动替换实例。有关更多信息，请参阅《Amazon EC2 Auto Scaling User Guide》**中的 [Monitor and replace Auto Scaling instances with impaired Amazon EBS volumes](https://docs.aws.amazon.com/autoscaling/ec2/userguide/monitor-and-replace-instances-with-impaired-ebs-volumes.html)。
+ 检索系统日志并查找错误。有关更多信息，请参阅 [检索系统日志](#troubleshooting-retrieve-system-logs)。

## 检索系统日志
<a name="troubleshooting-retrieve-system-logs"></a>

如果实例状态检查失败，则您可以重启实例并检索系统日志。日志能够显示错误之处，从而帮助您诊断问题。重启可清除日志中不必要的信息。

**重启实例并检索系统日志**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances**，然后选择您的实例。

1. 依次选择 **Instance state (实例状态)**、**Reboot instance (启动实例)**。实例重启可能需要几分钟时间。

1. 验证问题是否依然存在；在一些情况下，重启可以解决此问题。

1. 如果实例位于 `running` 状态中，选择实例，依次选择 **Actions (操作)**、**Monitor and troubleshoot (监控和故障排除)**、**Get system log (获取系统日志)**。

1. 查看屏幕上显示的日志，使用下面的已知系统日志错误语句列表来诊断问题。

1. 如果您的问题没有得到解决，您可以将问题发布到 [AWS re:Post](https://repost.aws/)。

## 排查 Linux 的实例的系统日志错误
<a name="system-log-errors-linux"></a>

对于无法通过实例状态检查（例如实例可达性检查）的 Linux 实例，请验证您是否按照上述步骤检索系统日志。以下列表中包含一些常见的系统日志错误，还有一些建议您采取以解决此问题的针对性操作。

**内存错误**
+ [内存不足：终止进程](#MemoryOOM)
+ [错误：mmu\_update 失败 (内存管理更新失败)](#MemoryMMU)

**设备错误**
+ [I/O 错误（块储存设备故障）](#DeviceBlock)
+ [I/O 错误：既不是本地磁盘也不是远程磁盘（破损的分布式块储存设备）](#DeviceDistributed)

**内核错误**
+ [request\_module：runaway loop modprobe (在较旧的 Linux 版本上循环旧内核 modprobe)](#KernelLoop)
+ [“严重错误：内核太旧”和“fsck：在尝试打开 /dev 时没有此文件或目录”(内核与 AMI 不匹配)](#KernelOld)
+ [“FATAL: Could not load /lib/modules”或者“BusyBox”(内核模块缺失)](#KernelMissing)
+ [ERROR：无效内核 (EC2 不兼容内核)](#KernelInvalid)

**文件系统错误**
+ [fsck：尝试打开时没有找到此文件或目录... (未找到文件系统)](#FilesystemFschk)
+ [挂载文件系统时出现一般性错误（挂载失败）](#FilesystemGeneral)
+ [VFS：无法在未知块上挂载根 fs (根文件系统不匹配)](#FilesystemKernel)
+ [错误：无法确定根设备的主/次编号… （根文件系统/设备不匹配）](#FilesystemError)
+ [XENBUS：设备没有驱动程序…](#FilesystemXenbus)
+ [… 没有检查时，已强制执行检查的工作日 (文件系统检查要求)](#FilesystemCheck)
+ [fsck 卡在退出状态... （设备缺失）](#FilesystemFschkDied)

**操作系统错误**
+ [GRUB 提示 (grubdom>)](#OpSystemGrub)
+ [提起接口 eth0：设备 eth0 的 MAC 地址与预期不同，驳回。(硬编码的 MAC 地址)。](#OpSystemBringing)
+ [无法加载 SELinux 策略。计算机处于强制执行模式。正在中断。(SELinux 配置错误)](#OpSystemUnable)
+ [XENBUS：连接设备时超时 (Xenbus 超时)](#OpSystemXenbus)

## 内存不足：终止进程
<a name="MemoryOOM"></a>

指示内存不足错误的系统日志条目与下方显示的内容类似。

```
[115879.769795] {{Out of memory: kill process}} 20273 (httpd) score 1285879
or a child 
[115879.769795] Killed process 1917 (php-cgi) vsz:467184kB, anon-
rss:101196kB, file-rss:204kB
```

### 潜在原因
<a name="MemoryOOM-potential-cause"></a>

内存耗尽

### 建议采取的措施
<a name="MemoryOOM-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 请执行下列操作之一：+  停止并修改实例以使用不同的实例类型，然后再次启动实例。例如，一个更大或内存优化型实例类型。 <br />+  重启实例以使其恢复未受损状态。除非您更改实例类型，否则该问题可能还会出现。  | 
| 实例存储支持的 | 请执行下列操作之一：+   终止实例并启动新实例，指定一个不同的实例类型。例如，一个更大或内存优化型实例类型。 <br />+   重启实例以使其恢复未受损状态。除非您更改实例类型，否则该问题可能还会出现。  | 

## 错误：mmu\_update 失败 (内存管理更新失败)
<a name="MemoryMMU"></a>

表示内存管理更新故障的系统日志条目与以下示例类似：

```
...
Press `ESC' to enter the menu... 0   [H[J  Booting 'Amazon Linux 2011.09 (2.6.35.14-95.38.amzn1.i686)'


root (hd0)

 Filesystem type is ext2fs, using whole disk

kernel /boot/vmlinuz-2.6.35.14-95.38.amzn1.i686 root=LABEL=/ console=hvc0 LANG=

en_US.UTF-8 KEYTABLE=us

initrd /boot/initramfs-2.6.35.14-95.38.amzn1.i686.img

{{ERROR: mmu_update failed with rc=-22}}
```

### 潜在原因
<a name="MemoryMMU-potential-cause"></a>

Amazon Linux 的问题

### 建议采取的措施
<a name="MemoryMMU-suggested-actions"></a>

将问题发布到 [AWS re:Post](https://repost.aws/) 或联系 [支持](https://aws.amazon.com/premiumsupport/)。

## I/O 错误（块储存设备故障）
<a name="DeviceBlock"></a>

表示输入/输出错误的系统日志条目类似于以下示例：

```
[9943662.053217] end_request: {{I/O error}}, dev sde, {{sector 52428288}}
[9943664.191262] end_request: I/O error, dev sde, sector 52428168
[9943664.191285] Buffer I/O error on device md0, logical block 209713024
[9943664.191297] Buffer I/O error on device md0, logical block 209713025
[9943664.191304] Buffer I/O error on device md0, logical block 209713026
[9943664.191310] Buffer I/O error on device md0, logical block 209713027
[9943664.191317] Buffer I/O error on device md0, logical block 209713028
[9943664.191324] Buffer I/O error on device md0, logical block 209713029
[9943664.191332] Buffer I/O error on device md0, logical block 209713030
[9943664.191339] Buffer I/O error on device md0, logical block 209713031
[9943664.191581] end_request: I/O error, dev sde, sector 52428280
[9943664.191590] Buffer I/O error on device md0, logical block 209713136
[9943664.191597] Buffer I/O error on device md0, logical block 209713137
[9943664.191767] end_request: I/O error, dev sde, sector 52428288
[9943664.191970] end_request: I/O error, dev sde, sector 52428288
[9943664.192143] end_request: I/O error, dev sde, sector 52428288
[9943664.192949] end_request: I/O error, dev sde, sector 52428288
[9943664.193112] end_request: I/O error, dev sde, sector 52428288
[9943664.193266] end_request: I/O error, dev sde, sector 52428288
...
```

### 潜在原因
<a name="DeviceBlock-potential-cause"></a>


| 实例类型  | 潜在原因 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 发生故障的 Amazon EBS 卷  | 
| 实例存储支持的 | 发生故障的物理驱动器  | 

### 建议采取的措施
<a name="DeviceBlock-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 执行以下步骤：1.  停止实例。 <br />2.  分离该卷。 <br />3.  尝试恢复该卷。  最好的做法是经常拍摄 Amazon EBS 卷的快照。这样能大幅降低因故障而导致数据丢失的风险。  <br />4.   重新将卷附加到实例。 <br />5.  启动实例。  | 
| 实例存储支持的 |  终止实例并启动新的实例。 无法恢复数据。从备份恢复。  比较好的做法是使用 Amazon S3 或 Amazon EBS 进行备份。实例存储卷是直接与单个主机和磁盘故障相关的。  | 

## I/O 错误：既不是本地磁盘也不是远程磁盘（破损的分布式块储存设备）
<a name="DeviceDistributed"></a>

表示设备的输入/输出错误的系统日志条目类似于以下示例：

```
...
block drbd1: Local IO failed in request_timer_fn. Detaching...

Aborting journal on device drbd1-8.

block drbd1: {{IO ERROR: neither local nor remote disk}}

Buffer I/O error on device drbd1, logical block 557056

lost page write due to I/O error on drbd1

JBD2: I/O error detected when updating journal superblock for drbd1-8.
```

### 潜在原因
<a name="DeviceDistributed-potential-cause"></a>


| 实例类型  | 潜在原因 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 发生故障的 Amazon EBS 卷  | 
| 实例存储支持的 | 发生故障的物理驱动器  | 

### 建议采取的措施
<a name="DeviceDistributed-suggested-actions"></a>

终止实例并启动新的实例。

对于由 Amazon EBS 支持的实例，您可以从最近拍摄的快照恢复数据，方法是从该快照创建映像。快照之后添加的任何数据都无法恢复。

## request\_module：runaway loop modprobe (在较旧的 Linux 版本上循环旧内核 modprobe)
<a name="KernelLoop"></a>

表示此条件的系统日志类似于下方显示的示例。使用不稳定或陈旧的 Linux 内核 (如 2.6.16-xenU) 可能会在启动时导致无法终止的循环环境。

```
Linux version {{2.6.16-xenU}} (builder@xenbat.amazonsa) (gcc version 4.0.1 
20050727 (Red Hat 4.0.1-5)) #1 SMP Mon May 28 03:41:49 SAST 2007

BIOS-provided physical RAM map:

 Xen: 0000000000000000 - 0000000026700000 (usable)

0MB HIGHMEM available.
...

{{request_module: runaway loop modprobe binfmt-464c}}

request_module: runaway loop modprobe binfmt-464c

request_module: runaway loop modprobe binfmt-464c

request_module: runaway loop modprobe binfmt-464c

request_module: runaway loop modprobe binfmt-464c
```

### 建议采取的措施
<a name="KernelLoop-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 使用以下其中一个选项可使用较新的内核 (基于 GRUB 的内核或静态内核)。<br />选项 1：终止实例并启动新实例，指定 `-kernel` 和 `-ramdisk` 参数。<br />选项 2：1.  停止实例。 <br />2.  修改内核和虚拟磁盘的属性以使用较新的内核。 <br />3.  启动实例。  | 
| 实例存储支持的 | 终止实例并启动新实例，指定 `-kernel` 和 `-ramdisk` 参数。 | 

## “严重错误：内核太旧”和“fsck：在尝试打开 /dev 时没有此文件或目录”(内核与 AMI 不匹配)
<a name="KernelOld"></a>

表示此条件的系统日志类似于下方显示的示例。

```
Linux version 2.6.16.33-xenU (root@dom0-0-50-45-1-a4-ee.z-2.aes0.internal) 
(gcc version 4.1.1 20070105 (Red Hat 4.1.1-52)) #2 SMP Wed Aug 15 17:27:36 SAST 2007
...
{{FATAL: kernel too old}}
Kernel panic - not syncing: Attempted to kill init!
```

### 潜在原因
<a name="KernelOld-potential-cause"></a>

不可兼容的内核和用户空间

### 建议采取的措施
<a name="KernelOld-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 执行以下步骤：1.  停止实例。 <br />2.  修改配置以使用较新的内核。 <br />3.  启动实例。  | 
| 实例存储支持的 | 执行以下步骤：1.  创建使用较新内核的 AMI。 <br />2.  终止实例。 <br />3.  从您创建的 AMI 中启动新实例。  | 

## “FATAL: Could not load /lib/modules”或者“BusyBox”(内核模块缺失)
<a name="KernelMissing"></a>

表示此条件的系统日志类似于下方显示的示例。

```
[    0.370415] Freeing unused kernel memory: 1716k freed 
Loading, please wait...
WARNING: Couldn't open directory /lib/modules/2.6.34-4-virtual: No such file or directory
FATAL: Could not open /lib/modules/2.6.34-4-virtual/modules.dep.temp for writing: No such file or directory
FATAL: Could not load /lib/modules/2.6.34-4-virtual/modules.dep: No such file or directory
Couldn't get a file descriptor referring to the console
Begin: Loading essential drivers... ...
FATAL: Could not load /lib/modules/2.6.34-4-virtual/modules.dep: No such file or directory
FATAL: Could not load /lib/modules/2.6.34-4-virtual/modules.dep: No such file or directory
Done.
Begin: Running /scripts/init-premount ...
Done.
Begin: Mounting root file system... ...
Begin: Running /scripts/local-top ...
Done.
Begin: Waiting for root file system... ...
Done.
Gave up waiting for root device.  Common problems:
 - Boot args (cat /proc/cmdline)
   - Check rootdelay= (did the system wait long enough?)
   - Check root= (did the system wait for the right device?)
 - Missing modules (cat /proc/modules; ls /dev)
FATAL: Could not load /lib/modules/2.6.34-4-virtual/modules.dep: No such file or directory
{{FATAL: Could not load /lib/modules/}}2.6.34-4-virtual/modules.dep: No such file or directory
ALERT! /dev/sda1 does not exist. Dropping to a shell!


{{BusyBox}} v1.13.3 (Ubuntu 1:1.13.3-1ubuntu5) built-in shell (ash)
Enter 'help' for a list of built-in commands.

(initramfs)
```

### 潜在原因
<a name="KernelMissing-potential-cause"></a>

以下一个或多个条件可能会导致此问题：
+ 虚拟磁盘缺失 
+ 缺少正确的虚拟磁盘模块
+ Amazon EBS 根卷没有正确附加为 `/dev/sda1`

### 建议采取的措施
<a name="KernelMissing-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 执行以下步骤：1.  为 Amazon EBS 卷选择经过纠正的虚拟磁盘。 <br />2.  停止实例。 <br />3.  分离并修复该卷。 <br />4.  将卷附加到实例。 <br />5.  启动实例。 <br />6.  修改 AMI 以使用经过纠正的虚拟磁盘。  | 
| 实例存储支持的 | 执行以下步骤：1.  终止此实例，然后启动包含正确虚拟磁盘的新实例。 <br />2.  创建包含正确虚拟磁盘的新 AMI。  | 

## ERROR：无效内核 (EC2 不兼容内核)
<a name="KernelInvalid"></a>

表示此条件的系统日志类似于下方显示的示例。

```
...
root (hd0)

 Filesystem type is ext2fs, using whole disk

kernel /vmlinuz root=/dev/sda1 ro

initrd /initrd.img

{{ERROR Invalid kernel: elf_xen_note_check: ERROR: Will only load images 
built for the generic loader or Linux images
xc_dom_parse_image returned -1}}

Error 9: Unknown boot failure

  Booting 'Fallback'
  
root (hd0)

 Filesystem type is ext2fs, using whole disk

kernel /vmlinuz.old root=/dev/sda1 ro

Error 15: File not found
```

### 潜在原因
<a name="KernelInvalid-potential-cause"></a>

以下一个或两个条件都可能会导致此问题：
+ GRUB 不支持所提供的内核 
+ 后备内核不存在 

### 建议采取的措施
<a name="KernelInvalid-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 执行以下步骤：1.  停止实例。 <br />2.  替换为正在工作的内核。 <br />3.  安装后备内核。 <br />4.  通过纠正内核修改 AMI。  | 
| 实例存储支持的 | 执行以下步骤：1.  终止此实例，然后启动包含正确内核的新实例。 <br />2.  创建包含正确内核的 AMI。 <br />3.  （可选）通过 [支持](https://aws.amazon.com/premiumsupport/) 寻求技术支持以便恢复数据。  | 

## fsck：尝试打开时没有找到此文件或目录... (未找到文件系统)
<a name="FilesystemFschk"></a>

表示此条件的系统日志类似于下方显示的示例。

```
		Welcome to Fedora 
		Press 'I' to enter interactive startup.
Setting clock : Wed Oct 26 05:52:05 EDT 2011 [  OK  ]

Starting udev: [  OK  ]

Setting hostname localhost:  [  OK  ]

No devices found
Setting up Logical Volume Management: File descriptor 7 left open
  No volume groups found
[  OK  ]

Checking filesystems
Checking all file systems.
[/sbin/fsck.ext3 (1) -- /] fsck.ext3 -a /dev/sda1 
/dev/sda1: clean, 82081/1310720 files, 2141116/2621440 blocks
[/sbin/fsck.ext3 (1) -- /mnt/dbbackups] fsck.ext3 -a /dev/sdh 
{{fsck}}.ext3: {{No such file or directory}} while trying to open /dev/sdh

/dev/sdh: 
The superblock could not be read or does not describe a correct ext2
filesystem.  If the device is valid and it really contains an ext2
filesystem (and not swap or ufs or something else), then the superblock
is corrupt, and you might try running e2fsck with an alternate superblock:
    e2fsck -b 8193 <device>

[FAILED]


*** An error occurred during the file system check.
*** Dropping you to a shell; the system will reboot
*** when you leave the shell.
Give root password for maintenance
(or type Control-D to continue):
```

### 潜在原因
<a name="FilesystemFschk-potential-cause"></a>
+ 虚拟磁盘文件系统定义 /etc/fstab 中存在错误
+ /etc/fstab 中存在配置错误的文件系统定义
+ 硬盘丢失/故障

### 建议采取的措施
<a name="FilesystemFschk-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 执行以下步骤：1.  停止实例，分离根卷，修补/修改 /etc/fstab 该卷，将其附加到实例，然后启动该实例。 <br />2.  修改虚拟磁盘以使其包含经过修改的 /etc/fstab（如果适用）。 <br />3.  修改 AMI 以使用较新的虚拟磁盘。 <br />fstab 中的第 6 个字段定义此安装的可用性要求，非零值暗示将在该卷上执行文件系统检查并且*必须* 成功完成。能否在 Amazon EC2 中使用此字段还不确定，因为故障一般会导致交互性控制台提示信息，但是目前此功能在 Amazon EC2 中尚不可用。请谨慎使用此功能，并阅读 Linux man 页面了解有关 fstab 的信息。 | 
| 实例存储支持的 | 执行以下步骤：1.  终止实例并启动新的实例。 <br />2.  将所有不正确 Amazon EBS 卷与重启的实例分离。 <br />3.  （可选）通过 [支持](https://aws.amazon.com/premiumsupport/) 寻求技术支持以便恢复数据。  | 

## 挂载文件系统时出现一般性错误（挂载失败）
<a name="FilesystemGeneral"></a>

表示此条件的系统日志类似于下方显示的示例。

```
Loading xenblk.ko module 
xen-vbd: registered block device major 8

Loading ehci-hcd.ko module
Loading ohci-hcd.ko module
Loading uhci-hcd.ko module
USB Universal Host Controller Interface driver v3.0

Loading mbcache.ko module
Loading jbd.ko module
Loading ext3.ko module
Creating root device.
Mounting root filesystem.
kjournald starting.  Commit interval 5 seconds

EXT3-fs: mounted filesystem with ordered data mode.

Setting up other filesystems.
Setting up new root fs
no fstab.sys, mounting internal defaults
Switching to new root and running init.
unmounting old /dev
unmounting old /proc
unmounting old /sys
mountall:/proc: unable to mount: Device or resource busy
mountall:/proc/self/mountinfo: No such file or directory
mountall: root filesystem isn't mounted
init: mountall main process (221) terminated with status 1

{{General error mounting filesystems}}.
A maintenance shell will now be started.
CONTROL-D will terminate this shell and re-try.
Press enter for maintenance
(or type Control-D to continue):
```

### 潜在原因
<a name="FilesystemGeneral-potential-cause"></a>


| 实例类型  | 潜在原因 | 
| --- | --- | 
| 由 Amazon EBS 支持 |  +  分离或出故障的 Amazon EBS 卷。 <br />+  文件系统损坏。 <br />+  匹配错误的内存虚拟磁盘与 AMI 组合 (如 Debian 内存虚拟磁盘和 SUSE AMI)。  | 
| 实例存储支持的 |  +  发生故障的驱动器。 <br />+  损坏的文件系统。 <br />+  匹配错误的虚拟磁盘和组合 (例如，Debian 虚拟磁盘和 SUSE AMI)。  | 

### 建议采取的措施
<a name="FilesystemGeneral-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 执行以下步骤：1.  停止实例。 <br />2.  分离根卷。 <br />3.  将根卷附加到已知正在工作的实例。 <br />4.  执行文件系统检查（fsck -a /dev/...）。 <br />5.  修正所有错误。 <br />6.  从已知正在工作的实例分离卷。 <br />7.  将卷附加到已停止的实例。 <br />8.  启动实例。 <br />9.  重新检查实例的状态。  | 
| 实例存储支持的 | 请尝试以下任一操作：+  启动新实例。 <br />+  （可选）通过 [支持](https://aws.amazon.com/premiumsupport/) 寻求技术支持以便恢复数据。  | 

## VFS：无法在未知块上挂载根 fs (根文件系统不匹配)
<a name="FilesystemKernel"></a>

表示此条件的系统日志类似于下方显示的示例。

```
Linux version 2.6.16-xenU (builder@xenbat.amazonsa) (gcc version 4.0.1 
 20050727 (Red Hat 4.0.1-5)) #1 SMP Mon May 28 03:41:49 SAST 2007
...
Kernel command line:  root=/dev/sda1 ro 4
...
Registering block device major 8
...
{{Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(8,1)}}
```

### 潜在原因
<a name="FilesystemKernel-potential-cause"></a>


| 实例类型  | 潜在原因 | 
| --- | --- | 
| 由 Amazon EBS 支持 |  +  设备附加错误。 <br />+  根设备没有附加到正确的设备点。 <br />+  文件系统不是预期的格式。 <br />+  使用旧内核 (如 2.6.16-XenU)。 <br />+  实例上的近期更新内核 (错误更新或更新错误)   | 
| 实例存储支持的 | 硬件设备故障。 | 

### 建议采取的措施
<a name="FilesystemKernel-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 请执行下列操作之一：+  停止实例，然后再重启。 <br />+  修改根卷以附加到正确的设备点，可能是 /dev/sda1，而不是 /dev/sda。 <br />+  停止并修改新内核。 <br />+  请参阅您的 Linux 发行版的文档以检查是否有已知更新错误。更改或重新安装内核。  | 
| 实例存储支持的 | 终止实例并使用新内核启动新实例。 | 

## 错误：无法确定根设备的主/次编号… （根文件系统/设备不匹配）
<a name="FilesystemError"></a>

表示此条件的系统日志类似于下方显示的示例。

```
...
XENBUS: Device with no driver: device/vif/0
XENBUS: Device with no driver: device/vbd/2048
drivers/rtc/hctosys.c: unable to open rtc device (rtc0)
Initializing network drop monitor service
Freeing unused kernel memory: 508k freed
:: Starting udevd...
done.
:: Running Hook [udev]
:: Triggering uevents...<30>udevd[65]: starting version 173
done.
Waiting 10 seconds for device /dev/xvda1 ...
Root device '/dev/xvda1' doesn't exist. Attempting to create it.
{{ERROR: Unable to determine major/minor number of root device '/dev/xvda1'}}.
You are being dropped to a recovery shell
    Type 'exit' to try and continue booting
sh: can't access tty; job control turned off
{{[ramfs /]#}}
```

### 潜在原因
<a name="FilesystemError-potential-cause"></a>
+ 虚拟块储存设备驱动程序缺失或配置错误
+ 设备枚举冲突 (sda 与 xvda，或是 sda 而不是 sda1)
+ 实例内核选择错误

### 建议采取的措施
<a name="FilesystemError-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 执行以下步骤：1.  停止实例。 <br />2.  分离该卷。 <br />3.  修正设备映射问题。 <br />4.  启动实例。 <br />5.  修改 AMI 以解决设备映射问题。  | 
| 实例存储支持的 | 执行以下步骤：1.  创建附有适当补丁程序的新 AMI (正确映射块储存设备)。 <br />2.  终止实例并从您创建的 AMI 中启动新实例。  | 

## XENBUS：设备没有驱动程序…
<a name="FilesystemXenbus"></a>

表示此条件的系统日志类似于下方显示的示例。

```
XENBUS: Device with no driver: device/vbd/2048
drivers/rtc/hctosys.c: unable to open rtc device (rtc0)
Initializing network drop monitor service
Freeing unused kernel memory: 508k freed
:: Starting udevd...
done.
:: Running Hook [udev]
:: Triggering uevents...<30>udevd[65]: starting version 173
done.
Waiting 10 seconds for device /dev/xvda1 ...
Root device '/dev/xvda1' doesn't exist. Attempting to create it.
{{ERROR: Unable to determine major/minor number of root device '/dev/xvda1'.}}
You are being dropped to a recovery shell
    Type 'exit' to try and continue booting
sh: can't access tty; job control turned off
{{[ramfs /]#}}
```

### 潜在原因
<a name="FilesystemXenbus-potential-cause"></a>
+ 虚拟块储存设备驱动程序缺失或配置错误
+ 设备枚举冲突 (sda 与 xvda)
+ 实例内核选择错误

### 建议采取的措施
<a name="FilesystemXenbus-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 执行以下步骤：1.  停止实例。 <br />2.  分离该卷。 <br />3.  修正设备映射问题。 <br />4.  启动实例。 <br />5.  修改 AMI 以解决设备映射问题。  | 
| 实例存储支持的 | 执行以下步骤：1.  创建附有适当补丁程序的 AMI (正确映射块储存设备)。 <br />2.  终止实例并使用您创建的 AMI 启动新实例。  | 

## … 没有检查时，已强制执行检查的工作日 (文件系统检查要求)
<a name="FilesystemCheck"></a>

表示此条件的系统日志类似于下方显示的示例。

```
...
Checking filesystems
Checking all file systems.
[/sbin/fsck.ext3 (1) -- /] fsck.ext3 -a /dev/sda1 
/dev/sda1 has gone 361 {{days without being checked, check forced}}
```

### 潜在原因
<a name="FilesystemCheck-potential-cause"></a>

文件系统检查时间已过；正在强制执行文件系统检查。

### 建议采取的措施
<a name="FilesystemCheck-suggested-actions"></a>
+ 耐心等候文件系统检查的完成。文件系统检查可能需要很长一段时间，具体取决于根文件系统的大小。
+  使用 tune2fs 或适合您的文件系统的工具修改文件系统，以去除强制执行文件系统检查 (fsck) 的功能。

## fsck 卡在退出状态... （设备缺失）
<a name="FilesystemFschkDied"></a>

表示此条件的系统日志类似于下方显示的示例。

```
Cleaning up ifupdown....
Loading kernel modules...done.
...
Activating lvm and md swap...done.
Checking file systems...fsck from util-linux-ng 2.16.2
/sbin/fsck.xfs: /dev/sdh does not exist
{{fsck died with exit status}} 8
[31mfailed (code 8).[39;49m
```

### 潜在原因
<a name="FilesystemFschkDied-potential-cause"></a>
+ 为缺失的磁盘查找虚拟磁盘
+ 强制执行文件系统一致性检查
+ 磁盘故障或者已分离

### 建议采取的措施
<a name="FilesystemFschkDied-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 尝试以下一个或多个措施以解决此问题：+  停止实例，将该卷附加到正在运行的实例。 <br />+  手动运行一致性检查。 <br />+  修正虚拟磁盘以使其包含相关实用程序。 <br />+  修改文件系统调整参数以删除一致性要求 (不推荐)。  | 
| 实例存储支持的 | 尝试以下一个或多个措施以解决此问题：+  通过正确的工具作业重新绑定虚拟磁盘。 <br />+  修改文件系统调整参数以删除一致性要求 (不推荐)。 <br />+  终止实例并启动新的实例。 <br />+  （可选）通过 [支持](https://aws.amazon.com/premiumsupport/) 寻求技术支持以便恢复数据。  | 

## GRUB 提示 (grubdom>)
<a name="OpSystemGrub"></a>

表示此条件的系统日志类似于下方显示的示例。

```
    GNU GRUB  version 0.97  (629760K lower / 0K upper memory)

       [ Minimal BASH-like line editing is supported.   For

         the   first   word,  TAB  lists  possible  command

         completions.  Anywhere else TAB lists the possible

         completions of a device/filename. ]

{{grubdom> }}
```

### 潜在原因
<a name="OpSystem-potential-cause"></a>


| 实例类型  | 潜在原因 | 
| --- | --- | 
| 由 Amazon EBS 支持 |  +  缺少 GRUB 配置文件。 <br />+  使用了错误的 GRUB 映像，应使用不同位置的 GRUB 配置文件。 <br />+  使用了不受支持的文件系统存储您的 GRUB 配置文件 (例如，将您的根文件系统转换为 GRUB 早期版本不支持的类型)。   | 
| 实例存储支持的 |  +  缺少 GRUB 配置文件。 <br />+  使用了错误的 GRUB 映像，应使用不同位置的 GRUB 配置文件。 <br />+  使用了不受支持的文件系统存储您的 GRUB 配置文件 (例如，将您的根文件系统转换为 GRUB 早期版本不支持的类型)。   | 

### 建议采取的措施
<a name="OpSystem-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 选项 1：修改 AMI 并重启实例：1.  修改源 AMI 以便在标准位置 (/boot/grub/menu.lst) 创建 GRUB 配置文件。 <br />2.  验证您的 GRUB 版本支持基础文件系统类型，并根据需要升级 GRUB。 <br />3.  选择合适的 GRUB 映像 (hd0 – 第一个磁盘或 hd00 – 第一个磁盘，第一个分区)。 <br />4.  终止实例并使用您创建的 AMI 启动一个新实例。 <br />选项 2：修复现有实例：1.  停止实例。 <br />2.  分离根卷文件系统。 <br />3.  将根卷文件系统附加到已知正在工作的实例。 <br />4.  挂载文件系统。 <br />5.  创建 GRUB 配置文件。 <br />6.  验证您的 GRUB 版本支持基础文件系统类型，并根据需要升级 GRUB。 <br />7.  分离文件系统。 <br />8.  附加到原始实例。 <br />9.  修改内核属性以便使用正确的 GRUB 映像 (第 1 个磁盘或其上的第 1 个分区)。 <br />10.  启动实例。  | 
| 实例存储支持的 | 选项 1：修改 AMI 并重启实例：1.  使用位于标准位置 (/boot/grub/menu.lst) 的 GRUB 配置文件创建新 AMI。 <br />2.  选择合适的 GRUB 映像 (hd0 – 第一个磁盘或 hd00 – 第一个磁盘，第一个分区)。 <br />3.  验证您的 GRUB 版本支持基础文件系统类型，并根据需要升级 GRUB。 <br />4.  终止实例并使用您创建的 AMI 启动新实例。 <br />选项 2：终止此实例并启动新实例，指定正确的内核。 要从现有实例恢复数据，请联系 [支持](https://aws.amazon.com/premiumsupport/)。  | 

## 提起接口 eth0：设备 eth0 的 MAC 地址与预期不同，驳回。(硬编码的 MAC 地址)。
<a name="OpSystemBringing"></a>

表示此条件的系统日志类似于下方显示的示例。

```
... 
Bringing up loopback interface:  [  OK  ]

{{Bringing up interface eth0:  Device eth0 has different MAC address than expected, ignoring.
[FAILED]}}

Starting auditd: [  OK  ]
```

### 潜在原因
<a name="OpSystemBringing-potential-cause"></a>

AMI 配置中存在硬编码接口 MAC

### 建议采取的措施
<a name="OpSystemBringing-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 请执行下列操作之一：+  修改 AMI 以删除硬编码并重启实例。 <br />+  修改实例以删除硬编码 MAC 地址。 <br />OR<br />执行以下步骤：1.  停止实例。 <br />2.  分离根卷。 <br />3.  将卷附加到另一个实例并修改卷以删除硬编码 MAC 地址。 <br />4.  将卷附加到原始实例。 <br />5.  启动实例。  | 
| 实例存储支持的 | 请执行下列操作之一：+  修改实例以删除硬编码 MAC 地址。 <br />+  终止实例并启动新的实例。  | 

## 无法加载 SELinux 策略。计算机处于强制执行模式。正在中断。(SELinux 配置错误)
<a name="OpSystemUnable"></a>

表示此条件的系统日志类似于下方显示的示例。

```
audit(1313445102.626:2): enforcing=1 old_enforcing=0 auid=4294967295
{{Unable to load SELinux Policy. Machine is in enforcing mode. Halting now.
Kernel panic - not syncing: Attempted to kill init!}}
```

### 潜在原因
<a name="OpSystemUnable-potential-cause"></a>

SELinux 已在错误的情况下启动：
+ GRUB 不支持所提供的内核
+ 后备内核不存在

### 建议采取的措施
<a name="OpSystemUnable-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 执行以下步骤：1.  停止失败的实例。 <br />2.  分离失败的实例的根卷。 <br />3.  将根卷附加到另一个 Linux 的运行实例 (之后称为“恢复实例”)。 <br />4.  连接到恢复实例并挂载失败的实例的根卷。 <br />5.  在挂载的根卷上禁用 SELinux。此过程因 Linux 分配而异；有关更多信息，请参阅特定于操作系统的文档。  在某些系统上，可通过在 `SELINUX=disabled` 文件中设置 `/{{mount_point}}/etc/sysconfig/selinux` 来禁用 SELinux (其中，`{{mount_point}}` 是您在恢复实例上安装卷的位置)。  <br />6.  从恢复实例卸载和分离根卷并将该根卷重新附加到原始实例。 <br />7.  启动实例。  | 
| 实例存储支持的 | 执行以下步骤：1.  终止实例并启动新的实例。 <br />2.  （可选）通过 [支持](https://aws.amazon.com/premiumsupport/) 寻求技术支持以便恢复数据。  | 

## XENBUS：连接设备时超时 (Xenbus 超时)
<a name="OpSystemXenbus"></a>

表示此条件的系统日志类似于下方显示的示例。

```
Linux version 2.6.16-xenU (builder@xenbat.amazonsa) (gcc version 4.0.1 
20050727 (Red Hat 4.0.1-5)) #1 SMP Mon May 28 03:41:49 SAST 2007
...
{{XENBUS: Timeout connecting to devices!}}
...
Kernel panic - not syncing: No init found.  Try passing init= option to kernel.
```

### 潜在原因
<a name="OpSystemXenbus-potential-cause"></a>
+ 块储存设备未连接到实例
+ 此实例使用的是旧实例内核

### 建议采取的措施
<a name="OpSystemXenbus-suggested-actions"></a>


| 对于此实例类型  | 请执行该操作 | 
| --- | --- | 
| 由 Amazon EBS 支持 | 请执行下列操作之一：+  修改 AMI 和实例以便使用新内核并重启实例。 <br />+  重启实例。  | 
| 实例存储支持的 | 请执行下列操作之一：+  终止实例。 <br />+  修改 AMI 以使用新实例，使用此 AMI 启动新实例。  | 


# 为 M1 和 C1 EC2 实例启用实例存储交换卷
<a name="instance-store-swap-volumes"></a>

**注意**  
本主题仅适用于 `c1.medium` 和 `m1.small` Linux 实例。

`c1.medium` 和 `m1.small` 实例类型的物理内存量有限。因此，启动时作为 Linux 系统虚拟内存的是 900 MiB 交换卷或*交换空间*。当系统所需内存超过实际分配内存时，可以在 Linux 中使用交换空间。启用交换空间后，Linux 系统可以将很少使用的内存页面从物理内存交换至交换空间（现有文件系统中的专用分区或交换文件），并为需要高速访问的内存页面释放空间。

**注意**  
使用交换空间进行内存分页并不像使用 RAM 那样快速高效。如果您的工作负载定期将内存分页为交换空间，您应考虑迁移到具有更多 RAM 的较大实例类型。有关更多信息，请参阅 [Amazon EC2 实例类型更改](ec2-instance-resize.md)。
尽管 Linux 内核将此交换空间看作根卷的一部分，但是它实际上是一个独立的实例存储卷，与根卷类型无关。

Amazon Linux 可以自动启用和使用此交换空间，但是您的 AMI 可能需要一些额外的步骤来识别和使用此交换空间。要查看您的实例是否正在使用交换空间，可以使用 **swapon -s** 命令。

```
[ec2-user ~]$ swapon -s
Filename                                Type            Size    Used    Priority
/dev/xvda3                              partition       917500  0       -1
```

上述实例拥有一个已附加并启用的 900 MiB 交换卷。如果您没有通过该命令看到列出的交换卷，则可能需要启用该设备的交换空间。使用 **lsblk** 命令检查您的可用磁盘。

```
[ec2-user ~]$ lsblk
NAME  MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
xvda1 202:1    0    8G  0 disk /
xvda3 202:3    0  896M  0 disk
```

在这里，交换卷 `xvda3` 对该实例可用，但是尚未启用（请注意 `MOUNTPOINT` 字段为空）。您可以使用 **swapon** 命令启用交换卷。

**注意**  
您必须在 `/dev/` 列出的设备名称前加上 **lsblk**。设备的命名可以不同，例如 `sda3`、`sde3` 或 `xvde3`。在以下命令中使用系统的设备名称。

```
[ec2-user ~]$ sudo swapon /dev/xvda3
```

现在交换空间应该显示在 **lsblk** 和 **swapon -s** 输出中。

```
[ec2-user ~]$ lsblk
NAME  MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
xvda1 202:1    0    8G  0 disk /
xvda3 202:3    0  896M  0 disk [SWAP]
[ec2-user ~]$ swapon -s
Filename                                Type            Size    Used    Priority
/dev/xvda3                              partition       917500  0       -1
```

您还需要编辑您的 `/etc/fstab` 文件，以便在每次系统启动时自动启用此交换空间。

```
[ec2-user ~]$ sudo vim /etc/fstab
```

将以下行附加到您的 `/etc/fstab` 文件中（使用系统的交换设备名称）：

```
/dev/{{xvda3}}       none    swap    sw  0       0
```

**使用实例存储卷作为交换空间**

所有实例存储卷都可用作交换空间。例如，`m3.medium` 实例类型包含一个适用于交换空间的 4 GB SSD 实例存储卷。如果您的实例存储卷大很多（例如 350GB），则可以考虑将卷分区为一个较小的 4-8GB 交换分区，其余部分用作数据卷。
**注意**  
此过程仅适用于支持实例存储的实例类型。有关受支持实例类型的列表，请参阅[EC2 实例的实例存储卷限制](instance-store-volumes.md)。

1. <a name="step_swap_start"></a>列出附加到您的实例的块设备以获取实例存储卷的设备名称。

   ```
   [ec2-user ~]$ lsblk -p
   NAME       MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
   /dev/xvdb  202:16   0   4G  0 disk /media/ephemeral0
   /dev/xvda1 202:1    0   8G  0 disk /
   ```

   在此示例中，实例存储卷为 `/dev/xvdb`。因为这是 Amazon Linux 实例，所以实例存储卷在 `/media/ephemeral0` 处格式化并挂载；并不是所有 Linux 操作系统都自动执行这一操作。

1. （可选）如果您挂载了实例存储卷（它将在 `MOUNTPOINT` 命令输出中列出 **lsblk**），您需要使用以下命令卸载它。

   ```
   [ec2-user ~]$ sudo umount /dev/xvdb
   ```

1. <a name="step_mkswap"></a>使用 **mkswap** 命令在设备上设置一个 Linux 交换区域。

   ```
   [ec2-user ~]$ sudo mkswap /dev/xvdb
   mkswap: /dev/xvdb: warning: wiping old ext3 signature.
   Setting up swapspace version 1, size = 4188668 KiB
   no label, UUID=b4f63d28-67ed-46f0-b5e5-6928319e620b
   ```

1. 启用新的交换空间。

   ```
   [ec2-user ~]$ sudo swapon /dev/xvdb
   ```

1. <a name="step_swap_enable"></a>验证所使用的新交换空间。

   ```
   [ec2-user ~]$ swapon -s
   Filename				Type		Size	Used	Priority
   /dev/xvdb                              	partition	4188668	0	-1
   ```

1. 编辑您的 `/etc/fstab` 文件，以在每次系统启动时自动启用此交换空间。

   ```
   [ec2-user ~]$ sudo vim /etc/fstab
   ```

   如果您的 `/etc/fstab` 文件拥有 `/dev/xvdb`（或 `/dev/sdb`）条目，请将其更改为与下面的行匹配；如果没有针对此设备的条目，请将以下行附加到您的 `/etc/fstab` 文件（使用您系统的交换设备名称）：

   ```
   /dev/{{xvdb}}       none    swap    sw  0       0
   ```
**重要**  
当实例停止或休眠后，实例存储卷数据将丢失；这包括在[Step 3](#step_mkswap)中创建的实例存储交换空间格式设置。如果您停止并重新启动已配置为使用实例存储交换空间的实例，则必须在新的实例存储卷上重复 [Step 1](#step_swap_start) 到 [Step 5](#step_swap_enable)。
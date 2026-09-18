

# 使实例存储卷可供 EC2 实例使用
<a name="making-instance-stores-available-on-your-instances"></a>

启动带有附加实例存储卷的实例后，必须先挂载这些卷，然后才能访问它们。

## Linux 实例
<a name="view-instance-store-linux"></a>

您可以在启动实例后，使用您选择的文件系统将卷格式化。

**使实例存储卷在 Linux 上可用**

1. 使用 SSH 客户端连接到实例。有关更多信息，请参阅 [使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)。

1. 使用 `df -h` 命令查看已格式化并挂载的卷。

   ```
   $ df -h
   Filesystem      Size  Used Avail Use% Mounted on
   devtmpfs        3.8G   72K  3.8G   1% /dev
   tmpfs           3.8G     0  3.8G   0% /dev/shm
   /dev/nvme0n1p1  7.9G  1.2G  6.6G  15% /
   ```

1. 使用 `lsblk` 查看在启动时已映射但未格式化和装载的所有卷。

   ```
   $ lsblk
   NAME          MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
   nvme0n1       259:1    0    8G  0 disk
   ├─nvme0n1p1   259:2    0    8G  0 part /
   └─nvme0n1p128 259:3    0    1M  0 part
   nvme1n1       259:0    0 69.9G  0 disk
   ```

1. 要格式化并挂载仅映射的实例存储卷，请执行以下操作：

   1. 使用 `mkfs` 命令在设备上创建文件系统。

      ```
      $ sudo mkfs -t xfs {{/dev/nvme1n1}}
      ```

   1. 使用 `mkdir` 命令创建要将设备挂载到的目录。

      ```
      $ sudo mkdir {{/data}}
      ```

   1. 使用 `mount` 命令在新建目录上挂载设备。

      ```
      $ sudo mount {{/dev/nvme1n1 /data}}
      ```

## Windows 实例
<a name="view-instance-store-windows"></a>

对于 Windows 实例，我们利用 NTFS 文件系统重新格式化实例存储卷。

您可以使用 Windows 磁盘管理来查看实例存储卷。有关更多信息，请参阅 [列出非 NVMe 磁盘](windows-list-disks.md#windows-disks)。

**手动挂载实例存储卷**

1. 选择**开始**，输入**计算机管理**，然后按 **Enter**。

1. 在左侧面板中，选择**磁盘管理**。

1. 如果系统提示您初始化卷，请选择要初始化的卷，根据使用案例选择所需的分区类型，然后选择**确定**。

1. 在卷列表中，打开要挂载的卷的上下文（右键单击）菜单，然后选择**新建简单卷**。

1. 在向导中，选择**下一步**。

1. 在“指定卷大小”页面上，选择**下一步**，以使用最大卷大小。或者，也可以选择介于最小磁盘空间和最大磁盘空间之间的卷大小。

1. 在“分配驱动器号或路径”页面上，执行以下某项操作，然后选择**下一步**。
   + 要使用驱动器号挂载卷，请选择**分配以下驱动器号**，然后选择要使用的驱动器号。
   + 要将卷挂载为文件夹，请选择**装入以下空白 NTFS 文件夹中**，然后选择**浏览**，以创建或选择要使用的文件夹。
   + 要想不使用驱动器号或路径挂载卷，请选择**不分配驱动器号或驱动器路径**。

1. 在“格式化分区”屏幕上，指定是否格式化卷。如果选择格式化卷，请选择所需的文件系统和单位大小，然后指定卷标。

1. 选择**下一步**、**完成**。
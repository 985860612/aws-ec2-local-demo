

# 配置 Amazon EC2 上工作负载的防撕裂写入
<a name="configure-twp"></a>

[具有支持卷的受支持的实例类型](supported-block-sizes.md)上默认启用撕裂写防护功能。您无需进行任何其他设置即可启用防撕裂写入。

**注意**  
不支持防撕裂写入的工作负载不会受到性能影响。您无需对这些工作负载进行任何更改。  
支持防撕裂写入但未配置使用该功能的工作负载会继续使用双写缓冲区，并且不会获得任何性能优势。

要将 MySQL 或 MariaDB 软件堆栈配置为禁用双写缓冲区并使用撕裂写防护功能，请完成以下步骤：

1. 将您的卷配置为使用带有 BigAlloc 选项的 ext4 文件系统，并将集群大小设置为 4 KiB、8 KiB 或 16 KiB。使用集群大小为 4 KiB、8 KiB 或 16 KiB 的 BigAlloc，可确保文件系统分配与各自边界对齐的文件。

   ```
   $  mkfs.ext4 -O bigalloc -C {{4096|8192|16384}} {{device_name}}
   ```
**注意**  
对于 MySQL 和 MariaDB，必须使用 `-C 16384` 来匹配数据库页面大小。将分配粒度设置为页面大小倍数以外的值可能会导致分配与存储设备撕裂写防护边界不匹配。

   例如：

   ```
   $  mkfs.ext4 -O bigalloc -C 16384 /dev/nvme1n1
   ```

1. 将 InnoDB 配置为使用 `0_DIRECT` 刷新方法并关闭 InnoDB 双写模式。使用首选文本编辑器打开 `/etc/my.cnf`，更新 `innodb_flush_method` 和 `innodb_doublewrite` 参数，如下所示：

   ```
   innodb_flush_method=O_DIRECT
   innodb_doublewrite=0
   ```

**重要**  
如果您使用的是逻辑卷管理器（LVM）或其他存储虚拟化层，请确保卷的起始偏移量以 16 KiB 倍数对齐。这是相对于底层 NVMe 存储而言，用以考虑存储虚拟化层使用的元数据标头和超级块。如果您向 LVM 物理卷添加偏移量，则可能引起文件系统分配与 NVMe 设备的偏移量有偏差，从而导致撕裂写防护失效。有关更多信息，请参阅 [Linux manual page](https://man7.org/linux/man-pages/man8/pvcreate.8.html)（Linux 手册页面）中的 `--dataalignmentoffset`。
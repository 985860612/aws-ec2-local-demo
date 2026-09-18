

# 在 Mac 实例上增加 EBS 卷的大小
<a name="mac-instance-increase-volume"></a>

您可以在 Mac 实例上增加 Amazon EBS 卷的大小。有关更多信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 弹性卷](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html)。

增加卷的大小后，您必须按以下方式增加 APFS 容器的大小。

**使增加的磁盘空间可供使用**

1. 确定是否需要重新启动。如果您调整了正在运行的 Mac 实例上的现有 EBS 卷的大小，则必须[重新启动](ec2-instance-reboot.md)实例才能使新大小可用。如果在启动期间完成了磁盘空间的修改，则无需重新启动。

   查看磁盘大小的当前状态：

   ```
   [ec2-user ~]$  diskutil list external physical
   /dev/disk0 (external, physical):
      #:                       TYPE NAME                    SIZE       IDENTIFIER
      0:                 GUID_partition_scheme            *322.1 GB     disk0
      1:                 EFI EFI                           209.7 MB     disk0s1
      2:                 Apple_APFS Container disk2        321.9 GB     disk0s2
   ```

1. 复制并粘贴以下命令。

   ```
   [ec2-user ~]$ PDISK=$(diskutil list physical external | head -n1 | cut -d" " -f1)
   APFSCONT=$(diskutil list physical external | grep "Apple_APFS" | tr -s " " | cut -d" " -f8)
   yes | sudo diskutil repairDisk $PDISK
   ```

1. 复制并粘贴以下命令。

   ```
   [ec2-user ~]$ sudo diskutil apfs resizeContainer $APFSCONT 0
   ```
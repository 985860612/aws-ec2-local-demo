

# 排查从错误的卷启动 Amazon EC2 Linux 实例的问题
<a name="instance-booting-from-wrong-volume"></a>

在某些情况下，某个并非附加到 `/dev/xvda` 或 `/dev/sda` 的卷成为了 Linux 实例的根卷。当您将另一个实例的根卷或从某个根卷的快照中创建的卷附加到带有现有根卷的实例时，可能会发生这种情况。

这是由于 Linux 中的初始虚拟磁盘的工作方式导致的。它将选择在 `/` 中定义为 `/etc/fstab` 的卷，在某些发行版中，这是由附加到卷分区的标签决定的。具体来说，您将发现您的 `/etc/fstab` 与下面类似：

```
LABEL=/ / ext4 defaults,noatime 1 1 
tmpfs /dev/shm tmpfs defaults 0 0 
devpts /dev/pts devpts gid=5,mode=620 0 0 
sysfs /sys sysfs defaults 0 0 
proc /proc proc defaults 0 0
```

如果您检查两个卷的标签，您将看到它们都包含 `/` 标签：

```
[ec2-user ~]$ sudo e2label /dev/xvda1 
/ 
[ec2-user ~]$ sudo e2label /dev/xvdf1 
/
```

在此示例中，您最终可以让 `/dev/xvdf1`（而不是您打算从中启动实例的 `/dev/xvda1` 卷）成为您的实例在初始虚拟磁盘运行后从中启动的根卷。要解决此问题，请使用相同的 **e2label** 命令更改您不想从中启动实例的附加卷的标签。

某些情况下，在 `/etc/fstab` 中指定 UUID 可以解决此问题。但是，如果两个卷来自同一快照，或者辅助卷是通过主卷的快照创建的，则它们将共享 UUID。

```
[ec2-user ~]$ sudo blkid 
/dev/xvda1: LABEL="/" UUID=73947a77-ddbe-4dc7-bd8f-3fe0bc840778 TYPE="ext4" PARTLABEL="Linux" PARTUUID=d55925ee-72c8-41e7-b514-7084e28f7334 
/dev/xvdf1: LABEL="old/" UUID=73947a77-ddbe-4dc7-bd8f-3fe0bc840778 TYPE="ext4" PARTLABEL="Linux" PARTUUID=d55925ee-72c8-41e7-b514-7084e28f7334
```

**更改已附加 ext4 卷的标签**

1. 使用 **e2label** 命令将卷的标签更改为 `/` 之外的其他标签。

   ```
   [ec2-user ~]$ sudo e2label /dev/xvdf1 {{old/}} 
   ```

1. 验证卷是否有新标签。

   ```
   [ec2-user ~]$ sudo e2label /dev/xvdf1 
   old/
   ```

**更改已附加 xfs 卷的标签**
+ 使用 **xfs\_admin** 命令将卷的标签更改为 `/` 之外的其他标签。

  ```
  [ec2-user ~]$ sudo xfs_admin -L {{old/}} /dev/xvdf1
  writing all SBs
  new label = "old/"
  ```

如上所示更改卷标签后，您应该能够重新引导实例并在实例引导时让初始虚拟磁盘选择适当的卷。

**重要**  
如果您要分离使用新标签的卷并将它返回到另一实例以用作根卷，则必须再次执行上述过程并将卷标签更改回其原始值。否则，其他实例将不会启动，因为内存虚拟磁盘无法找到标签为 `/` 的卷。


# 在 EC2 实例上初始化实例存储卷
<a name="disk-performance"></a>

由于 Amazon EC2 采用特殊方式将磁盘虚拟化，所以第一次在部分实例存储卷上执行写入操作的速度会比之后的写入操作慢。对于大部分应用程序，可将此成本分摊到实例的整个使用期限。然而，如果您需要较高的磁盘性能，我们建议您在生产使用之前对每个磁盘位置执行一次性写入操作，以此来实现硬盘初始化。

**注意**  
使用直接附加的固态硬盘（SSD）且支持 TRIM 的实例类型，可以在启动时提供最大性能，无需初始化。有关每种实例类型的实例存储的信息，请参阅[EC2 实例的实例存储卷限制](instance-store-volumes.md)。

如果您需要在延迟或吞吐量方面具有更大灵活性，我们建议您使用 Amazon EBS。

要初始化实例存储卷，请使用以下 `dd` 命令，具体取决于要初始化的存储（例如 `/dev/sdb` 或 `/dev/nvme1n1`）。

**注意**  
请确保先卸载硬盘，然后再执行该命令。  
初始化可能需要很长一段时间（对于超大型实例，约为 8 小时）。

要将实例存储卷初始化，可使用 `m1.large`、`m1.xlarge`、`c1.xlarge`、`m2.xlarge`、`m2.2xlarge` 和 `m2.4xlarge` 实例类型上的以下命令：

```
dd if=/dev/zero of=/dev/sdb bs=1M          
dd if=/dev/zero of=/dev/sdc bs=1M          
dd if=/dev/zero of=/dev/sdd bs=1M          
dd if=/dev/zero of=/dev/sde bs=1M
```

要同时对所有实例存储卷执行初始化，可使用以下命令：

```
dd if=/dev/zero bs=1M|tee /dev/sdb|tee /dev/sdc|tee /dev/sde > /dev/sdd
```

配置硬盘以便通过对每个硬盘位置执行写入操作对其执行 RAID 初始化。当配置基于软件的 RAID 时，请务必更改最低重建速度：

```
echo $((30*1024)) > /proc/sys/dev/raid/speed_limit_min
```
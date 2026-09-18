

# Amazon EC2 实例存储卷的数据持久性
<a name="instance-store-lifetime"></a>

只有在实例启动时才会附加实例存储卷。无法在启动实例后附加实例存储卷。您无法将实例存储卷与一个实例分离并将该卷附加到另一个实例。

实例存储卷仅在其连接的实例的生命周期内存在。您无法将实例存储卷的生命周期配置为在其关联实例的生命周期之后保留。

即使实例重启，实例存储卷上的数据仍会保留。但是，如果实例停止、休眠或终止，则数据不会保留。当实例停止、休眠或终止后，实例存储卷的每个块都会通过加密方式删除。

因此，切勿依赖实例存储卷来存储珍贵且需要长期保存的数据。如果您需要在实例的生命周期之后保留存储在实例存储卷上的数据，需要手动将该数据复制到更持久的存储中，例如 Amazon EBS 卷、Amazon S3 存储桶或 Amazon EFS 文件系统。

有些事件可能导致数据无法在实例的整个生命周期内持续存在。下表显示了虚拟化实例和裸机实例的实例存储卷上的数据在特定事件期间是否会永久保存。


| 事件 | 您的数据会如何处理？ | 
| --- |--- |
| **用户启动的实例生命周期事件** | 
| --- |
| [实例重启](ec2-instance-reboot.md) | The data persists | 
| [实例停止](Stop_Start.md) | The data does not persist | 
| [实例休眠](Hibernate.md) | The data does not persist | 
| [实例终止](terminating-instances.md) | The data does not persist | 
| [实例类型更改](ec2-instance-resize.md) | The data does not persist \* | 
| [从实例创建 EBS 支持的 AMI](creating-an-ami-ebs.md) | The data does not persist in the created AMI \*\* | 
| [从实例创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md) (Linux instances) | The data persists in the AMI bundle uploaded to Amazon S3 \*\*\* | 
| **用户启动的操作系统事件** | 
| --- |
| A shutdown is initiated | The data does not persist † | 
| A restart is initiated | The data persists | 
| **AWS 计划的事件** | 
| --- |
| [实例停止](schedevents_actions_retire.md) | The data does not persist | 
| [实例重启](schedevents_actions_reboot.md) | The data persists | 
| [系统重启](schedevents_actions_reboot.md) | The data persists | 
| [实例指令引退](schedevents_actions_retire.md) | The data does not persist | 
| **计划外事件** | 
| --- |
| [简化的自动恢复](instance-configuration-recovery.md) | The data does not persist | 
| [CloudWatch 基于操作的恢复](cloudwatch-recovery.md) | The data does not persist | 
| The underlying disk fails | The data on the failed disk does not persist | 
| Power failure | The data persists upon reboot | 

\* 如果新实例类型支持实例存储，该实例将获得新实例类型支持的实例存储卷数，但数据不会传输到新实例。如果新的实例类型不支持实例存储，实例将无法获得实例存储卷。

\*\* 数据不包含在 EBS 支持的 AMI 中，也不包含在连接到从该 AMI 启动的实例的实例存储卷中。

\*\*\* 数据会包含在上传至 Amazon S3 的 AMI 捆绑包中。当您从该 AMI 启动实例时，该实例会将实例存储卷与创建 AMI 时它们所包含的数据捆绑在 AMI 中。

† 终止保护和停止保护不能让实例避免因实例上操作系统启动的关机引起的实例停止或终止。存储在实例存储卷上的数据不会在实例停止和终止事件中持续存在。
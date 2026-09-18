

# 使用 AWS VSS 解决方案恢复实例数据
<a name="application-consistent-snapshots-restore"></a>

您可以从 AWS VSS 解决方案创建的基于 VSS 的快照恢复 Windows 实例的 EBS 卷。如果您的 AWS VSS 解决方案快照包含 Microsoft SQL Server 数据库的备份，则可以使用 `AWSEC2-RestoreSqlServerDatabaseWithVss` AWS Systems Manager Automation 运行手册恢复该数据库。

数据库恢复运行手册可自动执行整个恢复过程，包括从快照创建卷并将其附加到实例。自动化利用 VSS 技术恢复数据库，使您无需停止 SQL Server 应用程序或断开任何活动连接即可进行恢复。

有关如何使用 Microsoft SQL Server 数据库运行手册的详细说明，请参阅《Microsoft SQL Server on Amazon EC2 User Guide》**中的 [Restore from VSS based snapshots](https://docs.aws.amazon.com/sql-server-ec2/latest/userguide/ms-ssdb-ec2-restore-vss.html)。

## 自定义脚本以从 AWS VSS 解决方案快照恢复 EBS 卷
<a name="vss-restore-script"></a>

您可以使用 `RestoreVssSnapshotSampleScript.ps1` 脚本作为模型来创建自己的自定义脚本，用于从 AWS VSS 解决方案快照恢复 EBS 卷。示例脚本将执行以下任务：
+ 停止实例
+ 从实例中删除所有现有驱动器（如果已排除引导卷，则引导卷除外）
+ 从快照创建新卷
+ 通过在快照上使用设备 ID 标签将卷附加到实例
+ 重新启动实例

**重要**  
以下脚本将断开附加到实例的所有卷，然后从快照创建新卷。确保已正确备份实例。不会删除旧卷。如果需要，您可以编辑脚本来删除旧卷。

**从基于 VSS 的 EBS 快照还原卷**

1. 下载 [RestoreVssSnapshotSampleScript.zip](https://docs.aws.amazon.com/systems-manager/latest/userguide/samples/RestoreVssSnapshotSampleScript.zip) 文件并提取文件内容。

1. 在文本编辑器中打开 `RestoreVssSnapshotSampleScript.ps1`，编辑脚本底部的示例调用以包含有效的 EC2 实例 ID 和 EBS 快照 ID，然后从 PowerShell 中运行该脚本。
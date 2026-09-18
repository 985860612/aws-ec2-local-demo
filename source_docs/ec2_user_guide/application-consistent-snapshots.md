

# 基于 Windows VSS 的应用程序一致性 Amazon EBS 快照
<a name="application-consistent-snapshots"></a>

您可以使用 [AWS Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html)，为附加到 Amazon EC2 Windows 实例的所有 Amazon EBS 卷拍摄应用程序一致性快照。快照过程使用 Windows [卷影复制服务（VSS）](https://learn.microsoft.com/en-us/windows-server/storage/file-server/volume-shadow-copy-service)为 VSS 感知应用程序拍摄 EBS 卷级备份。这些快照包括这些应用程序和磁盘之间的挂起事务中的数据。在需要备份所有附加的卷时，您无需关闭或断开连接实例。

使用基于 VSS 的 EBS 快照不会产生额外费用。您只需为备份过程创建的 EBS 快照付费。有关更多信息，请参阅[我的 Amazon EBS 快照是如何计费的？](https://repost.aws/knowledge-center/ebs-snapshot-billing)

**注意**  
只有 Windows 实例支持基于应用程序一致的 Windows VSS 快照。

**Topics**
+ [什么是 VSS？](#application-consistent-snapshots-how)
+ [基于 VSS 的 Amazon EBS 快照解决方案工作原理](#how-vss-works)
+ [VSS 先决条件](application-consistent-snapshots-prereqs.md)
+ [创建 VSS 快照](create-vss-snaps.md)
+ [排查 VSS 快照问题](application-consistent-snapshots-troubleshooting.md)
+ [AWS VSS 解决方案的恢复选项](application-consistent-snapshots-restore.md)
+ [版本历史记录](vss-comps-history.md)

## 什么是 VSS？
<a name="application-consistent-snapshots-how"></a>

卷影复制服务（VSS）是 Microsoft Windows 中包含的一项备份和恢复技术。它可以在计算机文件或卷处于使用状态时创建备份副本或快照。有关更多信息，请参阅[卷影复制服务](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee923636(v=ws.10)?redirectedfrom=MSDN)。

要创建应用程序一致性快照，需要使用以下软件组件。
+ *VSS 服务* – Windows 操作系统的一部分
+ *VSS 请求程序* – 请求创建卷影副本的软件
+ *VSS 写入器* – 通常作为应用程序（例如 SQL Server）的一部分提供，用于确保备份一致的数据集
+ *VSS 提供程序* – 创建底层卷影副本的组件

基于 Windows VSS 的 Amazon EBS 快照解决方案包括多个 Systems Manager（SSM）Run Command 文档，这些文档有助于创建备份，还有一个名为 `AwsVssComponents` 的 [Systems Manager Distributor 包](https://docs.aws.amazon.com/systems-manager/latest/userguide/distributor.html)，其中包含 *EC2 VSS 请求程序*和 *EC2 VSS 提供程序*。必须将 `AwsVssComponents` 包安装在 EC2 实例上，才能拍摄 EBS 卷的应用程序一致性快照。下图说明了这些软件组件之间的关系。

![VSS 软件组件。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/vss_components.png)


## 基于 VSS 的 Amazon EBS 快照解决方案工作原理
<a name="how-vss-works"></a>

拍摄基于 VSS 的应用程序一致性 EBS 快照脚本的过程包括以下步骤。

1. 完成 [创建基于 Windows VSS 的 EBS 快照的先决条件](application-consistent-snapshots-prereqs.md)。

1. 输入 `AWSEC2-VssInstallAndSnapshot` SSM 文档的参数，并使用 Run Command 运行该文档。有关更多信息，请参阅 [运行 AWSEC2-VssInstallAndSnapshot 命令文档（推荐）](create-vss-snapshots-ssm.md#create-with-AWSEC2-VssInstallAndSnapshot)。

1. 您的实例上的 Windows VSS 服务会协调正在运行的应用程序的所有正在进行的 I/O 操作。

1. 系统会刷新所有 I/O 缓冲区并临时暂停所有 I/O 操作。暂停最多持续 10 秒钟。

1. 在暂停期间，系统会为附加到实例的所有卷创建快照。

1. 暂停解除，I/O 恢复操作。

1. 系统将所有新建快照添加到 EBS 快照列表。系统会为此过程成功创建的所有基于 VSS 的 EBS 快照添加 **AppConsistent:true** 标签。

1. 如果需要从快照中还原，您可以使用从快照中创建卷的标准 EBS 过程，也可以使用示例脚本将所有卷还原到实例，如 [使用 AWS VSS 解决方案恢复实例数据](application-consistent-snapshots-restore.md) 中所述。
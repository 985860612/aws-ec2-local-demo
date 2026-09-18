

# 为您的 EC2 Windows 实例创建基于 VSS 的 EBS 快照
<a name="create-vss-snaps"></a>

满足所有[创建基于 Windows VSS 的 EBS 快照的先决条件](application-consistent-snapshots-prereqs.md)后，可以使用以下任一方法从 EC2 实例创建基于 VSS 的快照。

**AWS Systems Manager 命令文档**  
[使用 Systems Manager 命令文档](create-vss-snapshots-ssm.md)以创建基于 VSS 的快照。  
要自动执行备份，可以创建一个使用 `AWSEC2-VssInstallAndSnapshot` 命令文档的 AWS Systems Manager 维护时段任务。有关更多信息，请参阅 *AWS Systems Manager 用户指南*中的[使用维护时段（控制台）](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-maintenance-working.html)。

**AWS Backup**  
使用 AWS Backup 时，您可以在控制台或 CLI 中通过启用 VSS 来创建 VSS 备份。有关更多信息，请参阅《AWS Backup Developer Guide》**中的 [Creating Windows VSS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/windows-backups.html)。  
AWS Backup 不会在实例上自动安装 `AwsVssComponents` 软件包。您必须在实例上执行手动安装。有关更多信息，请参阅 [在 EC2 Windows 实例上手动安装 VSS 组件](application-consistent-snapshots-getting-started.md#install-vss-comps)。

**Amazon Data Lifecycle Manager**  
您可以通过在快照生命周期策略中启用前置和后置脚本，使用 Amazon Data Lifecycle Manager 创建 VSS 快照。有关更多信息，请参阅《Amazon EBS User Guide》**中的 [Automating application-consistent snapshots](https://docs.aws.amazon.com/ebs/latest/userguide/automate-app-consistent-backups.html)。  
Amazon Data Lifecycle Manager 不会在实例上自动安装 `AwsVssComponents` 软件包。您必须在实例上执行手动安装。有关更多信息，请参阅 [在 EC2 Windows 实例上手动安装 VSS 组件](application-consistent-snapshots-getting-started.md#install-vss-comps)。
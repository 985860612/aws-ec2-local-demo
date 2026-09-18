

# Amazon EC2 实例
<a name="Instances"></a>

Amazon EC2 实例是 AWS 云环境中的虚拟服务器。从首次启动实例（称为启动实例）到将其删除（称为终止实例），您可以完全控制自己的实例。启动实例时，您可以从各种操作系统中进行选择。您可以连接到您的实例并对其进行自定义以满足您的需求。例如，您可以在实例上配置操作系统、安装操作系统更新和安装应用程序。

Amazon EC2 提供各种实例类型。您可以选择一种实例类型，以提供运行应用程序所需的计算资源、内存、存储和网络性。

使用 Amazon EC2，您可以按实际用量付费。当您启动实例并转换到运行状态时，实例计费开始。当您停止实例时，计费停止，并在您启动实例后恢复计费。当您终止实例时，计费在实例转换到关闭状态时停止。

Amazon EC2 提供可用于优化实例的性能和成本的功能。例如，您可以使用 Amazon EC2 Fleet 或 Amazon EC2 Auto Scaling 在实例使用率发生变化时向上或向下扩展容量。您可以使用竞价型实例或节省计划来降低实例的成本。

*托管式实例*是指由服务提供商（例如 Amazon EKS 自动模式）管理的实例。您不能直接修改托管式实例的设置。托管式实例由**托管**字段中的 **true** 进行标识。有关更多信息，请参阅 [Amazon EC2 托管式实例](amazon-ec2-managed-instances.md)。

**Topics**
+ [Amazon EC2 实例类型](instance-types.md)
+ [Amazon EC2 托管式实例](amazon-ec2-managed-instances.md)
+ [利用嵌套虚拟化在 Amazon EC2 实例中运行虚拟机监控程序](amazon-ec2-nested-virtualization.md)
+ [Amazon EC2 账单和购买选项](instance-purchasing-options.md)
+ [在 Amazon EC2 启动模板中存储实例启动参数](ec2-launch-templates.md)
+ [启动 Amazon EC2 实例](LaunchingAndUsingInstances.md)
+ [连接到您的 EC2 实例](connect.md)
+ [Amazon EC2 实例状态更改](ec2-instance-lifecycle.md)
+ [实例自动恢复](ec2-instance-recover.md)
+ [使用实例元数据管理 EC2 实例](ec2-instance-metadata.md)
+ [检测主机是否为 EC2 实例](identify_ec2_instances.md)
+ [Amazon EC2 实例的实例身份文档](instance-identity-documents.md)
+ [EC2 实例的 STIG 合规性](ec2-configure-stig.md)
+ [在 EC2 实例上实现精确时钟和时间同步](set-time.md)
+ [EC2 容量管理器](capacity-manager.md)
+ [管理 EC2 实例的设备驱动程序](manage-device-drivers.md)
+ [配置您的 Amazon EC2 Windows 实例](ec2-windows-instances.md)
+ [将 EC2 Windows 实例升级到更高版本的 Windows Server](serverupgrade.md)
+ [Tutorial: Connect an Amazon EC2 instance to an Amazon RDS database（教程：将 Amazon EC2 实例连接到 Amazon RDS 数据库）](tutorial-connect-ec2-instance-to-rds-database.md)
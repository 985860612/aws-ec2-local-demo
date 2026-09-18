

# 使用自动化运行手册升级 EC2 Windows 实例
<a name="automated-upgrades"></a>

您可以使用 AWS Systems Manager Automation 运行手册在 AWS 上执行 Windows 和 SQL Server 实例的自动升级。

**Topics**
+ [相关服务](#automated-related)
+ [执行选项](#automated-execution-option)
+ [升级 Windows Server](#automated-upgrades-windows)
+ [升级 SQL Server](#automated-upgrades-sql)

## 相关服务
<a name="automated-related"></a>

将在自动升级过程中使用以下 AWS 服务：
+ **AWS Systems Manager**。AWS Systems Manager 是一个功能强大的统一界面，可以集中管理您的 AWS 资源。有关更多信息，请参阅 *[AWS Systems Manager 用户指南](https://docs.aws.amazon.com/systems-manager/latest/userguide/)*。
+ AWS Systems Manager 代理（SSM Agent）是一个 Amazon 软件，可以在 Amazon EC2 实例、本地服务器或虚拟机 (VM) 上安装和配置。SSM Agent 让 Systems Manager 可以更新、管理和配置这些资源。代理在AWS云中处理 Systems Manager 服务的请求，然后按照请求中的指定运行它们。有关更多信息，请参阅 *AWS Systems Manager 用户指南*中的[使用 SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)。
+ **AWS Systems Manager SSM 运行手册**。SSM 运行手册定义 Systems Manager 对您的托管实例执行的操作。SSM 运行手册使用 JavaScript Object Notation (JSON) 或 YAML，并包括您指定的步骤和参数。本主题使用两个 Systems Manager SSM 自动化运行手册。有关更多信息，请参阅 *AWS Systems Manager 用户指南*中的 [AWS Systems Manager Automation 运行手册参考](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-runbook-reference.html)。

## 执行选项
<a name="automated-execution-option"></a>

在 Systems Manager 控制台上选择**自动化**时，请选择**执行**。在选择 Automation 文档后，将提示您选择自动化执行选项。您可以从以下选项中进行选择。在本主题后面提供的途径步骤中，我们使用**简单执行**选项。

**简单执行**  
如果要更新单个实例，但不希望执行每个自动化步骤以审核结果，请选择该选项。在下面的升级步骤中更详细地介绍了该选项。

**速率控制**

如果要将升级应用于多个实例，请选择该选项。您可以定义以下设置。
+ **参数**

  该设置（也会在“多账户和区域”设置中设置）定义了如何完成自动化。
+ **目标**

  选择要将自动化应用到的目标。也会在“多账户和区域”设置中设置该设置。
+ **参数值**

  使用自动化文档参数中定义的值。
+ **资源组**

  在AWS中，资源是您可以使用的实体。示例包括 Amazon EC2 实例、AWS CloudFormation 堆栈或 Amazon S3 存储桶。如果您使用多个资源，这样做可能会很有帮助：将它们作为一个组进行管理，而不是在每个任务中将资源从一个AWS服务移动到另一个服务。在某些情况下，您可能希望管理大量相关的资源，例如，构成应用程序层的 EC2 实例。在这种情况下，您可能需要同时对这些资源执行批量操作。
+ **标签**

  标签帮助您按不同的方式对 AWS 资源进行分类，例如，按用途、所有者或环境进行分类。如果您具有很多相同类型的资源，这种分类是非常有用的。您可以使用分配的标签快速识别特定的资源。
+ **速率控制**

  也会在“多账户和区域”设置中设置速率控制。在设置速率控制参数时，您可以按目标数或队列百分比定义要将自动化应用到的队列数量。

 **多账户和区域**

除了在“速率控制”中指定的参数（也会在“多账户和区域”设置中使用）以外，还具有两个其他设置：
+ **账户和组织单位 (OU)**

  指定要在其中运行自动化的多个账户。
+ **AWS 区域**

  指定要在其中运行自动化的多个 AWS 区域。

**手动执行**  
该选项类似于**简单执行**，但允许您逐个执行每个自动化步骤并审核结果。

## 升级 Windows Server
<a name="automated-upgrades-windows"></a>

`[AWSEC2-CloneInstanceAndUpgradeWindows](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awsec2-CloneInstanceAndUpgradeWindows.html)` 运行手册从您的账户中的 Windows Server 实例中创建亚马逊机器映像（AMI），并将该 AMI 升级到所选的支持版本。该多步骤过程最多可能需要两小时才能完成。

在自动升级过程中包含两个 AMI：
+ **当前运行的实例**。第一个 AMI 是当前运行的实例，不会升级该实例。该 AMI 用于启动另一个实例以运行就地升级。在该过程完成后，将从您的账户中删除该 AMI，除非您明确要求保留原始实例。该设置是由 `KeepPreUpgradeImageBackUp` 参数处理的（默认值为 `false`，这表示默认删除该 AMI）。
+ **升级的 AMI**。该 AMI 是自动化过程的结果。

最终结果是一个 AMI，它是升级的 AMI 实例。

在升级完成后，您可以在 Amazon VPC 中启动新的 AMI 以测试应用程序功能。在测试后，在执行另一个升级之前，请计划应用程序停机，然后再完全切换到升级的实例。

### 先决条件
<a name="automated-prereq-windows"></a>

要使用 AWS Systems Manager Automation 文档自动执行 Windows Server 升级，您必须执行以下任务：
+ 使用指定的 IAM policy 创建 IAM 角色，以允许 Systems Manager 在 Amazon EC2 实例上执行自动化任务，并验证您是否满足使用 Systems Manager 的先决条件。有关更多信息，请参阅 *AWS Identity and Access Management 用户指南*中的[创建向 AWS 服务委派权限的角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html)。
+ [选择您希望如何运行自动化的选项](#automated-execution-option)。执行选项包括**简单执行**、**速率控制**、**多账户和区域**以及**手动执行**。有关这些选项的详细信息，请参阅[执行选项](#automated-execution-option)。
+ 验证实例上是否安装了 SSM Agent。有关更多信息，请参阅[在 Amazon EC2 实例中为 Windows Server 安装和配置 SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-windows.html)。
+ 必须在您的实例上安装 Windows PowerShell 3.0 或更高版本。
+ 对于加入到某个 Microsoft Active Directory 域的实例，建议指定一个没有连接到您的域控制器的 `SubnetId`，以帮助避免主机名冲突。
+ 实例子网必须具有通向互联网的出站连接，这样可以访问 Amazon S3 等 AWS 服务 以及从 Microsoft 下载补丁。如果子网是公有子网且实例具有公有 IP 地址，或者子网是私有子网并使用路由将互联网流量发送到公有 NAT 设备，即满足此要求。
+ 此自动化适用于运行 Windows Server 2008 R2、Windows Server 2012 R2、Windows Server 2016 和 Windows Server 2019 的实例。
+ 验证实例的启动盘具有 20 GB 的可用磁盘空间。
+ 如果实例未使用 AWS 提供的 Windows 许可证，请指定包含 Windows Server 2012 R2 安装介质的 Amazon EBS 快照 ID。要实现此目的，应按照以下步骤进行：

  1. 验证 Amazon EC2 实例运行的是否是 Windows Server 2012 或更高版本。

  1. 在运行实例的同一可用区中创建一个 6GB 的 Amazon EBS 卷。将卷附加到实例。例如，将其附加为驱动器 D。

  1. 打开 ISO 的上下文（右键单击）菜单，并将其作为驱动器（例如驱动器 E）挂载到实例。

  1. 将 ISO 的内容从驱动器 E:\\ 复制到驱动器 D:\\

  1. 为上面步骤 2 中创建的 6GB 卷创建 Amazon EBS 快照。

### Windows Server 升级限制
<a name="automated-windows-limits"></a>

此自动化程序不支持升级 Windows 域控制器、集群或 Windows 桌面操作系统。此外，该自动化程序不支持安装了以下角色的 Windows Server 的 Amazon EC2 实例：
+ 远程桌面会话主机 (RDSH)
+ 远程桌面连接代理 (RDCB) 
+ 远程桌面虚拟化主机 (RDVH) 
+ 远程桌面 Web 访问 (RDWA)

### 执行 Windows Server 自动升级的步骤
<a name="2008R2-2012R2"></a>

请按照以下步骤使用 [Amazon Web Services EC2-CloneInstanceAndUpgradeWindows](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awsec2-CloneInstanceAndUpgradeWindows.html) 自动化运行手册升级您的 Windows Server 实例。

1. 从**AWS管理控制台**打开 Systems Manager。

1. 从左侧导航窗格中，在 **Change Management**（变更管理）下，选择 **Automation**。

1. 选择**执行自动化**。

1. 搜索名为 `AWSEC2-CloneInstanceAndUpgradeWindows` 的自动化文档。

1. 在显示该文档名称时，选择该文档。在选择该文档时，将显示文档详细信息。

1. 选择 **Execute automation**（执行自动化）以输入此文档的参数。在页面顶部选择**简单执行**。

1. 根据以下准则输入请求的参数。
   + `InstanceID`

     **类型：**字符串

     （必需）运行 Windows Server 2008 R2、2012 R2、2016 或 2019 且安装有 SSM Agent 的实例。
   + `InstanceProfile`. 

     **类型：**字符串

     （必需）IAM 实例配置文件。这是用于针对 Amazon EC2 实例和 AWS AMI 执行 Systems Manager 自动化的 IAM 角色。有关更多信息，请参阅《AWS Systems Manager 用户指南》**中的[配置 EC2 实例权限](https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-instance-permissions.html#instance-profile-add-permissions)。
   + `TargetWindowsVersion`

     **类型：**字符串

     （必需）选择目标 Windows 版本。
   + `SubnetId`

     **类型：**字符串

     （必需）这是执行升级过程的子网以及源 EC2 实例所在的位置。验证子网是否具有到 AWS 服务（包括 Amazon S3）以及 Microsoft（用于下载补丁）的出站连接。
   + `KeepPreUpgradedBackUp`

     **类型：**字符串

     （可选）如果该参数设置为 `true`，自动化将保留从实例中创建的映像。默认设置为 `false`。
   + `RebootInstanceBeforeTakingImage`

     **类型：**字符串

     （可选）默认值为 `false`（无重新引导）。如果该参数设置为 `true`，Systems Manager 将在创建升级 AMI 之前重新引导实例。

1. 在输入这些参数后，选择**执行**。在自动化开始时，您可以监控执行进度。

1. 在自动化完成时，您将看到 AMI ID。您可以启动 AMI 以验证是否升级了 Windows 操作系统。
**注意**  
自动化不需要运行所有步骤。根据自动化和实例行为，可以有条件地执行这些步骤。Systems Manager 可能会跳过一些不需要的步骤。  
此外，一些步骤可能会超时。Systems Manager 尝试升级并安装所有最新的补丁。不过，根据给定步骤的可定义超时设置，补丁有时会超时。在发生这种情况时，Systems Manager Automation 继续执行下一步，以确保将内部操作系统升级到目标 Windows Server 版本。

1. 在自动化完成后，您可以使用 AMI ID 启动 Amazon EC2 实例以检查升级。有关如何从 AWS AMI 中创建 Amazon EC2 实例的更多信息，请参阅[如何从自定义 AMI 启动 EC2 实例？](https://repost.aws/knowledge-center/launch-instance-custom-ami)

## 升级 SQL Server
<a name="automated-upgrades-sql"></a>

[AWSEC2-CloneInstanceAndUpgradeSQLServer](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awsec2-CloneInstanceAndUpgradeSQLServer.html) 脚本从您账户中运行 SQL Server 的 Amazon EC2 实例中创建一个 AMI，然后将该 AMI 升级到较新版本的 SQL Server。该多步骤过程最多可能需要两小时才能完成。

在该工作流程中，自动化从实例中创建一个 AMI，然后在您提供的子网中启动新的 AMI。接下来，自动化执行 SQL Server 的就地升级。在升级完成后，自动化创建新的 AMI，然后再终止升级的实例。

在自动升级过程中包含两个 AMI：
+ **当前运行的实例**。第一个 AMI 是当前运行的实例，不会升级该实例。该 AMI 用于启动另一个实例以运行就地升级。在该过程完成后，将从您的账户中删除该 AMI，除非您明确要求保留原始实例。该设置是由 `KeepPreUpgradeImageBackUp` 参数处理的（默认值为 `false`，这表示默认删除该 AMI）。
+ **升级的 AMI**。该 AMI 是自动化过程的结果。

最终结果是一个 AMI，它是升级的 AMI 实例。

在升级完成后，您可以在 Amazon VPC 中启动新的 AMI 以测试应用程序功能。在测试后，在执行另一个升级之前，请计划应用程序停机，然后再完全切换到升级的实例。

### 先决条件
<a name="automated-prereq-sql"></a>

要使用 AWS Systems Manager Automation 文档自动执行 SQL Server 升级，您必须执行以下任务：
+ 使用指定的 IAM policy 创建 IAM 角色，以允许 Systems Manager 在 Amazon EC2 实例上执行自动化任务，并验证您是否满足使用 Systems Manager 的先决条件。有关更多信息，请参阅《AWS Identity and Access Management 用户指南》**中的[创建向 AWS 服务 委派权限的角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html)。
+ [选择您希望如何运行自动化的选项](#automated-execution-option)。执行选项包括**简单执行**、**速率控制**、**多账户和区域**以及**手动执行**。有关这些选项的详细信息，请参阅[执行选项](#automated-execution-option)。
+ Amazon EC2 实例必须使用 Windows Server 2008 R2 或更高版本和 SQL Server 2008 或更高版本。
+ 验证实例上是否安装了 SSM Agent。有关更多信息，请参阅[在适用于 Windows Server 的 Amazon EC2 实例上使用 SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-windows.html)。
+ 确认实例有足够的可用磁盘空间：
  + 如果要从 Windows Server 2008 R2 升级到 2012 R2，或者从 Windows Server 2012 R2 升级到更高版本的操作系统，请确认实例启动磁盘中有 20GB 的可用磁盘空间。
  + 如果要从 Windows Server 2008 R2 升级到 2016 或更高版本，请确认实例启动磁盘中有 40GB 的可用磁盘空间。
+ 对于使用自带许可 (BYOL) SQL Server 版本的实例，以下额外的先决条件适用：
  + 提供包含目标 SQL Server 安装介质的 Amazon EBS 快照 ID。要实现此目的，应按照以下步骤进行：

    1. 验证 Amazon EC2 实例运行的是否是 Windows Server 2008 R2 或更高版本。

    1. 在运行实例的同一可用区中创建一个 6GB 的 Amazon EBS 卷。将卷附加到实例。例如，将其附加为驱动器 D。

    1. 打开 ISO 的上下文（右键单击）菜单，并将其作为驱动器（例如驱动器 E）挂载到实例。

    1. 将 ISO 的内容从驱动器 E:\\ 复制到驱动器 D:\\ 

    1. 为步骤 2 中创建的 6GB 卷创建 Amazon EBS 快照。

### SQL Server 自动升级限制
<a name="automated-sql-limits"></a>

使用 [Amazon Web Services EC2-CloneInstanceAndUpgradeSQLServer](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awsec2-CloneInstanceAndUpgradeSQLServer.html) 运行手册执行自动升级时适用以下限制：
+ 只能在使用 Windows 身份验证的 SQL Server 上执行升级。
+ 验证实例上没有待处理的安全补丁更新。打开**控制面板**，然后选择**检查更新**。
+ 不支持 HA 和镜像模式下的 SQL Server 部署。

### 执行 SQL Server 自动升级的步骤
<a name="SQL2008R2-SQL2016"></a>

请按照以下步骤使用 [Amazon Web Services EC2-CloneInstanceAndUpgradeSQLServer](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awsec2-CloneInstanceAndUpgradeSQLServer.html) 自动化运行手册升级您的 SQL Server。

1. 如果尚未挂载，请下载 SQL Server 2016 .iso 文件并将其挂载到源服务器中。

1. 在挂载该 .iso 文件后，复制所有组件文件，并将其放在所选的任何卷上。

1. 拍摄该卷的 Amazon EBS 快照，并将快照 ID 复制到剪贴板以供以后使用。有关更多信息，请参阅《Amazon EBS User Guide》****中的 [Create Amazon EBS snapshots](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-snapshot.html)。

1. 将实例配置文件附加到 Amazon EC2 源实例。这允许 Systems Manager 与 EC2 实例通信，并在将其添加到 AWS Systems Manager 服务后在其中运行命令。对于该示例，我们将角色命名为 `SSM-EC2-Profile-Role` 并将 `AmazonSSMManagedInstanceCore ` 策略附加到该角色。

1. 在 AWS Systems Manager 控制台的左侧导航窗格中，选择**托管实例**。验证您的 EC2 实例是否位于托管实例列表中。如果在几分钟后没有看到您的实例，请参阅 *AWS Systems Manager 用户指南*中的[我的实例在哪里？](https://docs.aws.amazon.com/systems-manager/latest/userguide/troubleshooting-remote-commands.html#where-are-instances)。

1. 在左侧导航窗格中，在 **Change Management**（变更管理）下，选择 **Automation**。

1. 选择**执行自动化**。

1. 搜索名为 `AWSEC2-CloneInstanceAndUpgradeSQLServer` 的自动化文档。

1. 选择 `AWSEC2-CloneInstanceAndUpgradeSQLServer` SSM 文档，然后选择 **Next**（下一步）。

1. 确保选择了**简单执行**选项。

1. 根据以下准则输入请求的参数。
   + `InstanceId` 

     **类型：**字符串

     （必需）运行 SQL Server 2008 R2（或更高版本）的实例。
   + `IamInstanceProfile`

     **类型：**字符串

     （必需）IAM 实例配置文件。
   + `SQLServerSnapshotId`

     **类型：**字符串

     （必需）目标 SQL Server 安装介质的快照 ID。对于包含 SQL Server 许可证的实例，此参数不是必需的。
   + `SubnetId`

     **类型：**字符串

     （必需）这是执行升级过程的子网以及源 EC2 实例所在的位置。验证子网是否具有到 AWS 服务（包括 Amazon S3）以及 Microsoft（用于下载补丁）的出站连接。
   + `KeepPreUpgradedBackUp`

     **类型：**字符串

     （可选）如果该参数设置为 `true`，自动化将保留从实例中创建的映像。默认设置为 `false`。
   + `RebootInstanceBeforeTakingImage`

     **类型：**字符串

     （可选）默认值为 `false`（无重新引导）。如果该参数设置为 `true`，Systems Manager 将在创建升级 AMI 之前重新引导实例。
   + `TargetSQLVersion`

     **类型**：字符串

     （可选）目标 SQL Server 版本。默认为 `2016`。

1. 在输入这些参数后，选择**执行**。在自动化开始时，您可以监控执行进度。

1. 在 **Execution status**（执行状态）显示为 **Success**（成功）时，展开 **Outputs**（输出）以查看 AMI 信息。您可以使用 AMI ID 为所选的 VPC 启动 SQL Server 实例。

1. 打开 Amazon EC2 控制台。在左侧导航窗格中，选择 **AMI**。将会看到新的 AMI。

1. 要验证是否成功安装了新的 SQL Server 版本，请选择新的 AMI，然后选择 **Launch**（启动）。

1. 为该 AMI 选择所需的实例类型、要部署到的 VPC 和子网以及要使用的存储。由于您从 AMI 中启动新的实例，因此，将以选项形式向您提供这些卷以包含在启动的新 EC2 实例中。您可以删除其中的任何卷，也可以添加卷。

1. 添加标签以帮助您识别实例。

1. 将一个或多个安全组添加到实例中。

1. 选择 **Launch Instance**。

1. 选择实例的标签名称，然后在**操作**下拉列表中选择**连接**。

1. 验证 SQL Server 新版本是否为新实例上的数据库引擎。
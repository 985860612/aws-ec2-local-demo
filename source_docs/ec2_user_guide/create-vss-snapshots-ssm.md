

# 使用 Systems Manager 命令文档创建基于 VSS 的快照
<a name="create-vss-snapshots-ssm"></a>

可以使用 AWS Systems Manager 命令文档创建基于 VSS 的快照。以下内容介绍可用的命令文档，以及这些文档用于创建快照的运行时系统参数。

在使用任何 Systems Manager 命令文档之前，请确保已满足所有 [创建基于 Windows VSS 的 EBS 快照的先决条件](application-consistent-snapshots-prereqs.md)。

**Topics**
+ [Systems Manager VSS 快照文档的参数](#create-vss-snapshots-ssm-params)
+ [运行 Systems Manager VSS 快照命令文档](#create-vss-snapshots-ssm-methods)

## Systems Manager VSS 快照文档的参数
<a name="create-vss-snapshots-ssm-params"></a>

用于创建 VSS 快照的 Systems Manager 文档均使用以下参数，除非另有说明：

**AmiName**（字符串，可选）  
如果 **CreateAmi** 设置为 `True`，请指定备份创建的 AMI 名称。

**description**（字符串，可选）  
为此过程创建的快照或映像指定一个描述。

**CollectDiagnosticLogs**（字符串，可选）  
要在快照和 AMI 创建步骤中收集更多信息，请将此参数设置为“`True`”。此参数的默认值为“`False`”。整合后的诊断日志将以 `.zip` 存档格式保存在实例的以下位置：  
`C:\ProgramData\Amazon\AwsVss\Logs\{{timestamp}}.zip`

**CopyOnly**（字符串，可选）  
如果除了 AWS VSS 之外还使用本地 SQL Server 备份，执行“仅复制”备份可防止 AWS VSS 中断本地差异备份链。要执行一个“仅复制”备份操作，请将此参数设置为 `True`。  
此参数的默认值为 `False`，这样会导致 AWS VSS 执行完整备份操作。

**CreateAmi**（字符串，可选）  
要创建基于 VSS 的亚马逊机器映像（AMI）以备份您的实例，请将此参数设置为 `True`。此参数的默认值为 `False`，它将使用 EBS 快照备份您的实例。  
有关创建从实例创建 AMI 的更多信息，请参阅 [创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。

**executionTimeout**（字符串，可选）  
指定在实例上执行快照创建过程或从实例创建 AMI 的最长时间（以秒为单位）。增大此超时将允许此命令等待更长时间，以使 VSS 开始冻结并完成对它创建的资源执行的标记操作。此超时只适用于快照或 AMI 创建步骤。此超时不包括用来安装或更新 `AwsVssComponents` 软件包的初始步骤所花费的时间。

**ExcludeBootVolume**（字符串，可选）  
如果是创建快照，此设置将从备份过程中排除启动卷。**要从快照中排除启动卷，请将 **ExcludeBootVolume** 设置为 `True`、将 CreateAmi** 设置为 `False`。  
如果是为备份创建 AMI，应将此参数设置为 `False`。此参数的默认值为 `False`。

**NoWriters**（字符串，可选）  
要从快照进程中排除应用程序 VSS 写入器，请将此参数设置为 `True`。排除应用程序 VSS 写入器可以帮助您解决与第三方 VSS 备份组件的冲突。此参数的默认值为 `False`。  
如果 `SaveVssMetadata` 为 `True`，则此参数必须设置为 `False`。

**SaveVssMetadata**（字符串，可选）  
要在每次快照拍摄期间保存 VSS 元数据文件，请将此参数设置为 `True`。默认值为 `False`。这些文件有助于深入了解备份操作中包含的具体组件或写入器，以及每个快照的关联文件和卷。使用 VSS 还原解决方案还原 SQL 数据库时会使用元数据文件。有关如何从 VSS 快照还原 SQL 数据库的更多信息，请参阅[使用自动化运行手册从 AWS VSS 解决方案快照还原数据库](https://docs.aws.amazon.com/sql-server-ec2/latest/userguide/ms-ssdb-ec2-restore-vss.html)。  
元数据文件的名称中包含关联快照集的 ID。可以在实例上的以下位置找到这些信息：  

```
C:\ProgramData\Amazon\AwsVss\VssMetadata\
```
+ 保存 VSS 元数据文件需要 `AwsVssComponents` 软件包版本 2.4.0 或更高版本。如果实例安装的是早期版本，则将 `SaveVssMetadata` 设置为 `True` 会导致快照创建失败。
+ `NoWriters` 和 `SaveVssMetadata` 参数是互斥的。如果两者都设置为 `True`，则快照创建将会失败。

**tags**（字符串，可选）  
建议您标记快照和映像，以帮助您定位和管理资源，例如，从快照列表中恢复卷。系统添加带有空值的 `Name` 键，您可以在其中指定要应用于输出快照或映像的名称。  
如果您要指定更多标签，请使用分号分隔标签。例如 `Key=Environment,Value=Test;Key=User,Value=TestUser1`。  
标签键和值只能包含字母数字字符和以下特殊字符：`() ./\-"'@_+:={}`。
默认情况下，系统会为基于 VSS 的快照和映像添加以下保留标签。  
+ **设备**：对于基于 VSS 的快照，这是快照捕获的 EBS 卷的设备名称。
+ **AppConsistent**：此标签表示已成功创建基于 VSS 的快照或 AMI。
+ **AwsVssConfig** – 此标签用于识别在启用 VSS 的情况下创建的快照和 AMI。此标签包含 `AwsVssComponents` 版本等元信息以及快照集 ID。
在参数列表中指定这些保留标签中的任何一个都将导致错误。

**VssVersion**（字符串，可选）  
仅对于 `AWSEC2-VssInstallAndSnapshot` 文档，可以指定 `VssVersion` 参数，以便在实例上安装特定版本的 `AwsVssComponents` 软件包。如果将此参数留空，将安装建议的默认版本。  
如果已经安装了 `AwsVssComponents` 软件包的指定版本，此脚本将跳过安装步骤并转到备份步骤。有关 `AwsVssComponents` 软件包版本和操作支持的列表，请参阅 [AWS VSS 解决方案版本历史记录](vss-comps-history.md)。

## 运行 Systems Manager VSS 快照命令文档
<a name="create-vss-snapshots-ssm-methods"></a>

可以使用 AWS Systems Manager 命令文档创建基于 VSS 的 EBS 快照，如下所示。

### 运行 AWSEC2-VssInstallAndSnapshot 命令文档（推荐）
<a name="create-with-AWSEC2-VssInstallAndSnapshot"></a>

当使用 AWS Systems Manager 运行 `AWSEC2-VssInstallAndSnapshot` 文档时，此脚本将执行以下步骤。

1. 此脚本首先在实例上安装或更新 `AwsVssComponents` 软件包，具体情况取决于是否已安装此软件包。

1. 此脚本将在完成第一步之后创建应用程序一致性快照。

要运行 `AWSEC2-VssInstallAndSnapshot` 文档，请按照适用于您的首选环境的步骤操作。

------
#### [ Console ]

**从控制台创建基于 VSS 的 EBS 快照**

1. 访问 [https://console.aws.amazon.com/systems-manager/](https://console.aws.amazon.com/systems-manager/)，打开 AWS Systems Manager 控制台。

1. 从导航窗格中选择**运行命令**。这将显示您的账户中当前正在运行的命令的列表（如果适用）。

1. 选择 **Run command（运行命令）**。这将打开您有权访问的命令文档的列表。

1. 从命令文档列表中选择 `AWSEC2-VssInstallAndSnapshot`。为了简化结果，您可以输入完整或部分文档名称。也可以按所有者、平台类型或标签进行筛选。

   当选择命令文档时，将在列表下方填充详细信息。

1. 从**文档版本**列表中选择 `Default version at runtime`。

1. 配置**命令参数**，以定义 `AWSEC2-VssInstallAndSnapshot` 如何安装 `AwsVssComponents` 软件包以及如何使用 VSS 快照或 AMI 进行备份。有关参数的详细信息，请参阅 [Systems Manager VSS 快照文档的参数](#create-vss-snapshots-ssm-params)。

1. 对于**目标选择**，请指定标签或者手动选择实例，以确定要在其上执行此操作的实例。
**注意**  
如果手动选择实例，而且要查看的实例未包含在列表中，请参阅[我的实例在哪里？](https://docs.aws.amazon.com/systems-manager/latest/userguide/troubleshooting-remote-commands.html#where-are-instances)以获得故障排除提示。

1. 要获得用来定义 Systems Manager Run Command 行为（例如**速率控制**）的其他参数，请输入[从控制台运行命令](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-commands-console.html)中所述的值。

1. 选择**运行**。

   如果成功，则该命令使用新快照填充 EBS 快照列表。您可以通过搜索指定的标签或搜索 `AppConsistent` 在 EBS 快照列表中查找这些快照。如果命令执行失败，请查看 Systems Manager 命令输出，了解执行失败的详细原因。如果命令成功完成，但特定卷备份失败，您可以在 EBS 卷列表中排查失败的原因。

------
#### [ AWS CLI ]

可以在 AWS CLI 中运行以下命令，以创建基于 VSS 的 EBS 快照，并获取快照创建的状态。

**创建基于 VSS 的 EBS 快照**  
运行以下命令以创建基于 VSS 的 EBS 快照。要创建快照，必须使用 `--instance-ids` 参数标识实例。有关可以使用的其他参数的更多信息，请参阅 [Systems Manager VSS 快照文档的参数](#create-vss-snapshots-ssm-params)。

```
aws ssm send-command \
	--document-name "AWSEC2-VssInstallAndSnapshot" \
	--instance-ids "{{i-01234567890abcdef}}" \
	--parameters '{"ExcludeBootVolume":["False"],"description":["Description"],"tags":["Key={{key_name}},Value={{tag_value}}"],"VssVersion":[""]}'
```

如果成功，则该命令文档使用新快照填充 EBS 快照列表。您可以通过搜索指定的标签或搜索 `AppConsistent` 在 EBS 快照列表中查找这些快照。如果命令执行失败，请查看命令输出，了解执行失败的详细原因。

**获取命令状态**  
要获取快照的当前状态，请使用从 **send-command** 返回的命令 ID 运行如下命令。

```
aws ssm get-command-invocation
	--instance-ids "{{i-01234567890abcdef}}" \
	--command-id "{{a1b2c3d4-5678-90ab-cdef-EXAMPLE11111}}" \
	--plugin-name "CreateVssSnapshot"
```

------
#### [ PowerShell ]

使用 AWS Tools for Windows PowerShell 运行以下命令，以创建基于 VSS 的 EBS 快照，并获取输出创建过程的当前运行时状态。指定前面的列表中介绍的参数，以修改快照进程的行为。

**使用 Tools for Windows PowerShell 创建基于 VSS 的 EBS 快照**  
运行如下命令，以创建基于 VSS 的 EBS 快照或 AMI。

```
Send-SSMCommand -DocumentName "AWSEC2-VssInstallAndSnapshot" -InstanceId "{{i-01234567890abcdef}}" -Parameter @{'ExcludeBootVolume'='False';'description'='{{a_description}}'
	;'tags'='Key={{key_name}},Value={{tag_value}}';'VssVersion'=''}
```

**获取命令状态**  
要获取快照的当前状态，请使用从 **Send-SSMCommand** 返回的命令 ID 运行如下命令。

```
Get-SSMCommandInvocationDetail -InstanceId "{{i-01234567890abcdef}}" -CommandId "{{a1b2c3d4-5678-90ab-cdef-EXAMPLE11111}}" -PluginName "CreateVssSnapshot"
```

如果成功，则该命令使用新快照填充 EBS 快照列表。您可以通过搜索指定的标签或搜索 `AppConsistent` 在 EBS 快照列表中查找这些快照。如果命令执行失败，请查看命令输出，了解执行失败的详细原因。

------

### 运行 AWSEC2-CreateVssSnapshot 命令文档
<a name="create-with-AWSEC2-CreateVssSnapshot"></a>

要运行 `AWSEC2-CreateVssSnapshot` 文档，请按照适用于您的首选环境的步骤操作。

------
#### [ Console ]

**从控制台创建基于 VSS 的 EBS 快照**

1. 访问 [https://console.aws.amazon.com/systems-manager/](https://console.aws.amazon.com/systems-manager/)，打开 AWS Systems Manager 控制台。

1. 从导航窗格中选择**运行命令**。这将显示您的账户中当前正在运行的命令的列表（如果适用）。

1. 选择 **Run command（运行命令）**。这将打开您有权访问的命令文档的列表。

1. 从命令文档列表中选择 `AWSEC2-CreateVssSnapshot`。为了简化结果，您可以输入完整或部分文档名称。也可以按所有者、平台类型或标签进行筛选。

   当选择命令文档时，将在列表下方填充详细信息。

1. 从**文档版本**列表中选择 `Default version at runtime`。

1. 配置**命令参数**，以定义 `AWSEC2-CreateVssSnapshot` 使用 VSS 快照或 AMI 进行备份的方式。有关参数的详细信息，请参阅 [Systems Manager VSS 快照文档的参数](#create-vss-snapshots-ssm-params)。

1. 对于**目标选择**，请指定标签或者手动选择实例，以确定要在其上执行此操作的实例。
**注意**  
如果手动选择实例，而且要查看的实例未包含在列表中，请参阅[我的实例在哪里？](https://docs.aws.amazon.com/systems-manager/latest/userguide/troubleshooting-remote-commands.html#where-are-instances)以获得故障排除提示。

1. 要获得用来定义 Systems Manager Run Command 行为（例如**速率控制**）的其他参数，请输入[从控制台运行命令](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-commands-console.html)中所述的值。

1. 选择**运行**。

   如果成功，则该命令使用新快照填充 EBS 快照列表。您可以通过搜索指定的标签或搜索 `AppConsistent` 在 EBS 快照列表中查找这些快照。如果命令执行失败，请查看 Systems Manager 命令输出，了解执行失败的详细原因。如果命令成功完成，但特定卷备份失败，您可以在 EBS 卷列表中排查失败的原因。

------
#### [ AWS CLI ]

在 AWS CLI 中运行以下命令来创建基于 VSS 的 EBS 快照。

**创建基于 VSS 的 EBS 快照**  
运行以下命令以创建基于 VSS 的 EBS 快照。要创建快照，必须使用 `--instance-ids` 参数标识实例。有关可以使用的其他参数的更多信息，请参阅 [Systems Manager VSS 快照文档的参数](#create-vss-snapshots-ssm-params)。

```
aws ssm send-command \
	--document-name "AWSEC2-CreateVssSnapshot" \
	--instance-ids "{{i-01234567890abcdef}}" \
	--parameters '{"ExcludeBootVolume":["False"],"description":["Description"],"tags":["Key={{key_name}},Value={{tag_value}}"]}'
```

如果成功，则该命令文档使用新快照填充 EBS 快照列表。您可以通过搜索指定的标签或搜索 `AppConsistent` 在 EBS 快照列表中查找这些快照。如果命令执行失败，请查看命令输出，了解执行失败的详细原因。

------
#### [ PowerShell ]

使用 AWS Tools for Windows PowerShell 运行以下命令以创建基于 VSS 的 EBS 快照。

**使用 Tools for Windows PowerShell 创建基于 VSS 的 EBS 快照**  
运行以下命令以创建基于 VSS 的 EBS 快照。要创建快照，必须使用 `InstanceId` 参数标识实例。可以指定多个实例为其创建快照。有关可以使用的其他参数的更多信息，请参阅 [Systems Manager VSS 快照文档的参数](#create-vss-snapshots-ssm-params)。

```
Send-SSMCommand -DocumentName AWSEC2-CreateVssSnapshot -InstanceId "{{i-01234567890abcdef}}" -Parameter @{'ExcludeBootVolume'='False';'description'='{{a_description}}'
	;'tags'='Key={{key_name}},Value={{tag_value}}'}
```

如果成功，则该命令使用新快照填充 EBS 快照列表。您可以通过搜索指定的标签或搜索 `AppConsistent` 在 EBS 快照列表中查找这些快照。如果命令执行失败，请查看命令输出，了解执行失败的详细原因。如果命令成功完成，但特定卷备份失败，您可以在 EBS 快照列表中排查失败的原因。

------

### 为具有共享 EBS 存储的 Windows 失效转移群集运行命令文档
<a name="create-vss-win-failover-cluster"></a>

您可以使用上一部分中描述的任何命令行步骤来创建基于 VSS 的快照。命令文档（`AWSEC2-VssInstallAndSnapshot` 或 `AWSEC2-CreateVssSnapshot`）必须在集群中的主节点上运行。由于辅助节点无权访问共享磁盘，因此该文档将在辅助节点上失败。如果您的主节点和辅助节点动态更改，则可以在多个节点上运行 AWS Systems Manager Run Command 文档，并且预期该命令将在主节点上成功，而在辅助节点上会失败。

**注意**  
要自动执行备份，可以创建一个使用 `AWSEC2-VssInstallAndSnapshot` 文档的 AWS Systems Manager 维护时段任务。有关更多信息，请参阅 *AWS Systems Manager 用户指南*中的[使用维护时段（控制台）](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-maintenance-working.html)。


# 管理基于 Windows VSS 的 EBS 快照的 VSS 组件包
<a name="application-consistent-snapshots-getting-started"></a>

在创建基于 VSS 的 EBS 快照之前，请确保在 Windows 实例上已安装最新版本的 VSS 组件包。可使用多种方法将 `AwsVssComponents` 包安装到现有实例上，如下所示：
+ （建议）[运行 AWSEC2-VssInstallAndSnapshot 命令文档（推荐）](create-vss-snapshots-ssm.md#create-with-AWSEC2-VssInstallAndSnapshot)。在每次运行时都会根据需要自动安装或更新。
+ [在 EC2 Windows 实例上手动安装 VSS 组件](#install-vss-comps).
+ [更新 EC2 Windows 实例上的 VSS 组件包](#update-vss-comps).

您还可以使用 EC2 Image Builder 创建一个 AMI，该 AMI 将使用 `aws-vss-components-windows` 托管组件为映像安装 `AwsVssComponents` 软件包。托管组件使用 AWS Systems Manager Distributor 安装软件包。Image Builder 创建映像后，从关联 AMI 启动的每个实例都将安装 VSS 软件包。有关如何创建已安装 VSS 软件包的 AMI 的更多信息，请参阅《EC2 Image Builder 用户指南》**中的[适用于 Windows 的 Distributor 软件包托管组件](https://docs.aws.amazon.com/imagebuilder/latest/userguide/mgdcomponent-distributor-win.html)。

**Topics**
+ [手动安装](#install-vss-comps)
+ [更新组件](#update-vss-comps)

## 在 EC2 Windows 实例上手动安装 VSS 组件
<a name="install-vss-comps"></a>

EC2 Windows 实例必须安装 VSS 组件，然后您才能使用 Systems Manager 创建应用程序一致性快照。如果没有在每次创建应用程序一致性快照时，运行 `AWSEC2-VssInstallAndSnapshot` 命令文档来自动安装或更新软件包，则必须手动安装该软件包。

如果您计划使用以下方法之一从 EC2 实例创建应用程序一致性快照，则也必须进行手动安装。
+ 使用 AWS Backup 创建 VSS 快照
+ 使用 Amazon Data Lifecycle Manager 创建 VSS 快照

如果需要执行手动安装，我们建议使用最新的 AWS VSS 组件包，以提高 EC2 Windows 实例上应用程序一致性快照的可靠性和性能。

**注意**  
要在每次创建应用程序一致性快照时自动安装或更新 `AwsVssComponents` 软件包，建议使用 Systems Manager 运行 `AWSEC2-VssInstallAndSnapshot` 文档。有关更多信息，请参阅 [运行 AWSEC2-VssInstallAndSnapshot 命令文档（推荐）](create-vss-snapshots-ssm.md#create-with-AWSEC2-VssInstallAndSnapshot)。

要在 Amazon EC2 Windows 实例上安装 VSS 组件，请按照适用于您的首选环境的步骤操作。

------
#### [ Console ]

**要使用 SSM Distributor 安装 VSS 组件**

1. 访问 [https://console.aws.amazon.com/systems-manager/](https://console.aws.amazon.com/systems-manager/)，打开 AWS Systems Manager 控制台。

1. 在导航窗格中，选择**Run Command**。

1. 选择**运行命令**。

1. 对于 **Command document**（命令文档），选择 **AWS-ConfigureAWSPackage** 旁的按钮。

1. 对于**命令参数**，执行以下操作：

   1. 确认**操作**设置为**安装**。

   1. 对于**名称**，请输入 `AwsVssComponents`。

   1. 对于**版本**，输入一个版本或将该字段保留空白，以便 Systems Manager 安装最新的版本。

1. 对于**目标**，请指定标签或手动选择实例以确定要在其中运行该操作的实例。
**注意**  
如果您选择手动选择实例，并且您要查看的实例未包含在列表中，请参阅 *AWS Systems Manager 用户指南*中的[我的实例在哪里？](https://docs.aws.amazon.com/systems-manager/latest/userguide/troubleshooting-remote-commands.html#where-are-instances)以获得故障排除提示。

1. 对于**其他参数**：
   + （可选）对于**注释**，请键入有关该命令的信息。
   + 对于**超时（秒）**，请指定在整个命令执行失败之前系统等待的秒数。

1. （可选）对于**速率控制**：
   + 对于**并发**，请指定要同时运行该命令的实例数或百分比。
**注意**  
如果通过选择 Amazon EC2 标签选择了目标，但不确定有多少个实例使用所选标签，则可以通过指定百分比来限制可同时运行此文档的实例的数量。
   + 对于**错误阈值**，请指定在一定数量或百分比的实例上失败后何时在其他实例上停止运行该命令。例如，如果您指定三个错误，Systems Manager 将在收到第四个错误时停止发送该命令。仍在处理命令的实例也可能发送错误。

1. （可选）对于**输出选项**部分，如果您要将命令输出保存到文件，请选定**启用 S3 存储桶写入**旁边的选项框。指定存储桶和（可选）前缀（文件夹）名称。
**注意**  
授予将数据写入 S3 存储桶的能力的 S3 权限是分配给实例的实例配置文件的权限，而不是执行此任务的 用户的权限。有关更多信息，请参阅《AWS Systems Manager 用户指南》**中的[配置 EC2 实例权限](https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-instance-permissions.html#instance-profile-add-permissions)。

1. （可选）为 **SNS 通知**指定选项。

   有关为 Run Command 配置 Amazon SNS 通知的信息，请参阅[为 AWS Systems Manager 配置 Amazon SNS 通知](https://docs.aws.amazon.com/systems-manager/latest/userguide/monitoring-sns-notifications.html)。

1. 选择**运行**。

------
#### [ AWS CLI ]

可以使用以下过程下载 `AwsVssComponents` pa 程序包，并从 AWS CLI 中使用 Run Command 在实例上安装该程序包。该程序包安装两个组件：VSS 请求程序和 VSS 提供程序。系统将这些组件复制到实例上的某个目录，然后将提供程序 DLL 注册为 VSS 提供程序。

**安装 VSS 包**  
运行以下命令下载并安装 Systems Manager 所需的 VSS 组件。

```
aws ssm send-command \
    --document-name "AWS-ConfigureAWSPackage" \
    --instance-ids "{{i-1234567890abcdef0}}" \
    --parameters '{"action":["Install"],"name":["AwsVssComponents"]}'
```

------
#### [ PowerShell ]

使用以下过程用 Run Command 从 Tools for Windows PowerShell 下载 `AwsVssComponents` 程序包并在实例上进行安装。该程序包安装两个组件：VSS 请求程序和 VSS 提供程序。系统将这些组件复制到实例上的某个目录，然后将提供程序 DLL 注册为 VSS 提供程序。

**安装 VSS 包**  
运行以下命令下载并安装 Systems Manager 所需的 VSS 组件。

```
Send-SSMCommand `
    -DocumentName "AWS-ConfigureAWSPackage" `
    -InstanceId "{{i-1234567890abcdef0}}" `
    -Parameter @{'action'='Install';'name'='AwsVssComponents'}
```

------

### 验证 AWS VSS 组件上的签名
<a name="verify-ssm-comps"></a>

按照以下过程验证 `AwsVssComponents` 程序包上的签名。

1. 连接到您的 Windows 实例。有关更多信息，请参阅 [使用 RDP 连接到 Windows 实例](connecting_to_windows_instance.md)。

1. 导航到 C:\\Program Files\\Amazon\\AwsVssComponents。

1. 打开 `ec2-vss-agent.exe` 的上下文菜单（单击右键），然后选择**属性**。

1. 导航到**数字签名**选项卡，验证签名者的名称是否为 Amazon Web Services Inc.。

1. 按照前述步骤验证 `Ec2VssInstaller` 和 `Ec2VssProvider.dll` 上的签名。

## 更新 EC2 Windows 实例上的 VSS 组件包
<a name="update-vss-comps"></a>

建议始终将 VSS 组件更新到最新的推荐版本。当发布了一个新版本的 `AwsVssComponents` 软件包时，可以通过多种不同的方式更新组件。

**更新方法**
+ 当发布了新版本的 AWS VSS 组件时，可以重复 [在 EC2 Windows 实例上手动安装 VSS 组件](#install-vss-comps) 中所述的步骤。
+ 可以将一个 Systems Manager State Manager 关联配置为在 `AwsVssComponents` 软件包可用时，自动下载并安装全新或更新后的 VSS 组件。
+ 如果使用 Systems Manager 运行 `AWSEC2-VssInstallAndSnapshot` 文档，每次创建应用程序一致性快照时，都可以自动安装或更新 `AwsVssComponents` 软件包。

**注意**  
建议使用 Systems Manager 运行 `AWSEC2-VssInstallAndSnapshot` 命令文档，它会在创建应用程序一致性快照之前自动安装或更新 `AwsVssComponents` 软件包。有关更多信息，请参阅 [运行 AWSEC2-VssInstallAndSnapshot 命令文档（推荐）](create-vss-snapshots-ssm.md#create-with-AWSEC2-VssInstallAndSnapshot)。

要创建 Systems Manager State Manager 关联，请按照适用于您的首选环境的步骤操作。

------
#### [ Console ]

创建 Systems Manager 状态管理器关联时，有两个选项可用于更新 `AwsVssComponents` 程序包，如下所示：

**卸载并重新安装**  
此方法会下载并安装程序包，无需任何其他先决条件。

**就地更新**  
这将对程序包执行就地更新，并具有以下先决条件：  
+ 实例上安装的 SSM 代理版本必须是版本 `3.3.808.0` 或更高版本。有关更多信息，请参阅**《AWS Systems Manager 用户指南》中的[在适用于 Windows Server 的 Amazon EC2 实例上使用 SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-windows.html)。
+ 如果指定，则 `AwsVssComponents` 程序包版本必须为版本 `2.5.0` 或更高版本。早期版本不支持就地更新。
如果您的实例不满足这些先决条件，则就地更新将失败。改用**卸载并重新安装**选项。

**创建 State Manager 关联**

1. 访问 [https://console.aws.amazon.com/systems-manager/](https://console.aws.amazon.com/systems-manager/)，打开 AWS Systems Manager 控制台。

1. 在导航窗格中，选择**状态管理器**。

   或者，如果一开始打开了 Systems Manager 主页，请打开导航窗格，然后选择 **State Manager**。

1. 选择 **Create association（创建关联）**。

1. 在 **Name （名称）** 字段中，输入一个描述性名称。

1. 在**文档**列表中，选择 **AWS-ConfigureAWSPackage**。

1. 在**参数**部分，选择在**操作**列表中**安装**。

1. 对于**安装类型**，选择**卸载并重新安装**或**就地更新**。

1. 在**名称**字段中，输入 `AwsVssComponents`。您可以保持**版本**和**其他参数**字段为空。

1. 在 **Targets** 部分中，选择选项。
**注意**  
如果您选择使用标签将实例设为目标，并指定映射到 Linux 实例的标签，则关联在 Windows 实例上将成功，但在 Linux 实例上将失败。关联的总体状态将显示 **Failed**。

1. 在**指定计划**部分，选择一个选项。

1. 在 **高级选项** 部分中，对于**合规性严重级别**，选择关联的严重级别。有关更多信息，请参阅[关于关联合规性](https://docs.aws.amazon.com/systems-manager/latest/userguide/compliance-about.html)。对于 **Change Calendar**，请选择预配置的更改日历。有关更多信息，请参阅 [AWS Systems Manager Change Calendar](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-change-calendar.html)。

1. 对于**速率控制**，请执行以下操作：
   + 对于 **Concurrency**（并发），请指定要同时运行该命令的托管式节点的数量或百分比。
   + 对于 **Error threshold**（错误阈值），请指定当命令在一定数量或百分比的节点上失败后，何时在其他托管式节点上停止运行该命令。

1. （可选）对于**输出选项**，要将命令输出保存到文件，请选中 **启用将输出写入 S3** 方框。在输入框中输入存储桶和前缀（文件夹）名称。

1. 选择 **Create Association**，然后选择 **Close**。系统将尝试在实例上创建关联并立即应用状态。
**注意**  
如果适用于 Windows Server 的 EC2 实例显示**失败**状态，请验证 SSM Agent 是否在该实例上运行，并验证该实例是否配置有适用于 Systems Manager 的 AWS Identity and Access Management（IAM）角色。有关更多信息，请参阅[设置 AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-ec2.html)。

------
#### [ AWS CLI ]

使用 [create-association](https://docs.aws.amazon.com/cli/latest/reference/ssm/create-association.html) 命令以按计划更新 Distributor 包，而无需将关联的应用程序脱机。仅替换软件包中的新文件或更新的文件。

**创建 State Manager 关联**  
运行以下命令以创建关联。`--name`的值（文档名称）始终为 `AWS-ConfigureAWSPackage`。以下命令使用键 `InstanceIds` 指定目标实例。

```
aws ssm create-association \
    --name "AWS-ConfigureAWSPackage" \
    --parameters action=Install,installationType="Uninstall and reinstall",name=AwsVssComponents \
    --targets Key=InstanceIds,Values={{i-1234567890abcdef0}},{{i-000011112222abcde}}
```

------
#### [ PowerShell ]

**创建 State Manager 关联**  
使用 [New-SSMAssociation](https://docs.aws.amazon.com/powershell/latest/reference/items/New-SSMAssociation.html) cmdlet。

```
New-SSMAssociation `
    -Name "AWS-ConfigureAWSPackage" `
    -Parameter  @{
        "action" = "Install"
        "installationType" = "Uninstall and reinstall"
        "name" = "AwsVssComponents"
    } `
    -Target @{
        "Key" = "InstanceIds" 
        "Values" = @("{{i-1234567890abcdef0}}", "{{i-000011112222abcde}}")
    }
```

------
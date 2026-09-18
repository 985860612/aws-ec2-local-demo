

# 使用 EC2Config 重置 EC2 实例的 Windows 管理员密码
<a name="ResettingAdminPassword_EC2Config"></a>

如果您丢失了 Windows 管理员密码并且使用的是 Windows Server 2016 之前的 Windows AMI，则可以使用 EC2Config 代理生成新密码。

如果使用的是 Windows Server 2016 或更高版本 AMI，请参阅 [使用 EC2Launch 重置 EC2 实例的 Windows 管理员密码](ResettingAdminPassword_EC2Launch.md)，或者可以使用 [EC2Rescue 工具](Windows-Server-EC2Rescue.md)（使用 EC2Launch 服务）生成新密码。

**注意**  
如果您在实例上禁用了本地管理员账户，并且您的实例已配置为 Systems Manager，则还可以使用 EC2Rescue 和 Run Command 重新启用和重置本地管理员密码。有关更多信息，请参阅[将适用于 Windows Server 的 EC2Rescue 与 Systems Manager Run Command 配合使用](ec2rw-ssm.md)。

**注意**  
有一个自动应用重置本地管理员密码所需的手动步骤的 AWS Systems Manager 自动化文档。有关更多信息，请参阅 *AWS Systems Manager 用户指南*中的[在 Amazon EC2 实例上重置密码和 SSH 密钥](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-ec2reset.html)。

要使用 EC2Config 重置 Windows 管理员密码，需要执行以下操作：
+ [步骤 1：确认 EC2Config 服务正在运行](#resetting-password-ec2config-step1)
+ [步骤 2：从实例分离根卷](#resetting-password-ec2config-step2)
+ [步骤 3：将卷附加到临时实例](#resetting-password-ec2config-step3)
+ [步骤 4：修改配置文件](#resetting-password-ec2config-step4)
+ [步骤 5：重启原始实例](#resetting-password-ec2config-step5)

## 步骤 1：确认 EC2Config 服务正在运行
<a name="resetting-password-ec2config-step1"></a>

在尝试重置管理员密码之前，请确认已安装并运行 EC2Config 服务。在本节后面的内容中，您将使用 EC2Config 服务重置管理员密码。

**确认 EC2Config 服务正在运行**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**，然后选择要重置密码的实例。在本过程中，该实例称为*原始* 实例。

1. 依次选择 **Actions (操作)**、**Monitor and troubleshoot (监控和问题排查)**、**Get system log (获取系统日志)**。

1. 找到 EC2 代理条目，例如，**EC2 Agent: Ec2Config service v3.18.1118**。如果您看到此条目，则 EC2Config 服务正在运行。

   如果系统日志输出为空，或者 EC2Config 服务未运行，则使用实例控制台屏幕快照截图服务对实例进行故障排除。有关更多信息，请参阅 [捕获无法访问的实例的屏幕截图](troubleshoot-unreachable-instance.md#instance-console-screenshot)。

## 步骤 2：从实例分离根卷
<a name="resetting-password-ec2config-step2"></a>

如果存储密码的卷作为根卷附加到实例，则无法使用 EC2Config 重置管理员密码。必须先从原始实例分离该卷，然后才能将其作为辅助卷附加到临时实例。

**从实例分离根卷**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择需要重置密码的实例，然后依次选择**实例状态**、**停止实例**。在实例的状态更改为 **Stopped (已停止)** 后，继续下一步。

1. （可选）如果您拥有在启动此实例时指定的私有密钥，请继续执行下一步。否则，请使用以下步骤将实例替换为使用新密钥对启动的新实例。

   1. 使用 Amazon EC2 控制台创建新的密钥对。要将新密钥对的名称设置为与丢失的私有密钥相同的名称，则必须先删除现有密钥对。

   1. 选择要替换的实例。请注意实例的实例类型、VPC、子网、安全组和 IAM 角色。

   1. 选择实例后，再依次选择**操作**、**映像和模板**、**创建映像**。键入映像名称和描述，然后选择 **Create Image (创建映像)**。

   1. 在导航窗格中，选择 **AMI**。等待映像状态变为**可用**。然后，选择映像并选择**从映像启动实例**。

   1. 完成字段以启动实例，并确保选择与要替换的实例相同的实例类型、VPC、子网、安全组和 IAM 角色，然后选择**启动**。

   1. 出现提示后，选择您为新实例创建的密钥对，然后选择**启动实例**。

   1. （可选）如果原始实例有关联的弹性 IP 地址，则请将其传输到新实例。如果原始实例除了根卷之外还有 EBS 卷，请将它们传输到新实例。

1. 按如下操作从原始实例分离根卷：

   1. 选择原始实例，然后选择**存储**选项卡。记下**根设备名称**下根设备的名称。在**块设备**下找到带有此设备名称的卷，并记下卷 ID。

   1. 在导航窗格中，选择 **Volumes**。

   1. 在卷列表中，选择记为根设备的卷，然后依次选择**操作**、**断开卷**。在卷状态更改为**可用**后，继续进行下一步操作。

1. 如果您创建了新实例来替换原始实例，则现在可立即终止原始实例。该原始实例已不再需要。对于本过程的其余部分，对原始实例的所有引用都将应用于您创建的新实例。

## 步骤 3：将卷附加到临时实例
<a name="resetting-password-ec2config-step3"></a>

接下来，启动一个临时实例，将卷作为辅助卷附加到该临时实例。这是用来修改配置文件的实例。

**启动临时实例并附加卷**

1. 启动临时实例，如下所示：

   1. 在导航窗格中，选择 **Instances (实例)**，然后选择 **Launch instances (启动实例)** 和 AMI。
**重要**  
要避免磁盘签名冲突，必须为不同版本的 Windows 选择 AMI。例如，如果原始实例运行 Windows Server 2019，则使用 Windows Server 2016 的基础 AMI 启动临时实例。

   1. 保留默认实例类型，然后选择 **Next: Configure Instance Details (下一步: 配置实例详细信息)**。

   1. 在 **Configure Instance Details (配置实例详细信息)** 页面上，为 **Subnet (子网)** 选择与原始实例相同的可用区，然后选择 **Review and Launch (审核和启动)**。
**重要**  
临时实例必须与原始实例位于同一可用区。如果您的临时实例位于不同的可用区中，则无法将原始实例的根卷附加到该实例。

   1. 在 **Review Instance Launch** 页面上，选择 **Launch**。

   1. 出现提示后，创建新的密钥对，将其下载到您计算机中的安全位置，然后选择 **Launch Instances (启动实例)**。

1. 将卷作为辅助卷附加到临时实例，如下所示：

   1. 在导航窗格中，选择 **Volumes (卷)**，选择从原始实例中分离的卷，然后依次选择 **Actions (操作)**、**Attach Volume (附加卷)**。

   1. 在 **Attach Volume (附加卷)** 对话框中，对于 **Instances (实例)**，开始键入临时实例的名称或 ID，然后从列表中选择实例。

   1. 对于 **Device (设备)**，键入 **xvdf**（如果尚未打开），然后选择 **Attach (附加)**。

## 步骤 4：修改配置文件
<a name="resetting-password-ec2config-step4"></a>

将卷作为辅助卷附加到临时实例后，修改配置文件中的 `Ec2SetPassword` 插件。

**修改配置文件**

1. 在临时实例中，修改辅助卷上的配置文件，如下所示：

   1. 启动并连接到临时实例。

   1. 按照以下说明使驱动器联机：[使 Amazon EBS 卷可用](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html)。

   1. 导航到辅助卷，使用文本编辑器 (如 Notepad) 打开 `\Program Files\Amazon\Ec2ConfigService\Settings\config.xml`。

   1. 在文件顶部，查找名为 `Ec2SetPassword` 的插件，如屏幕截图所示。将状态从 `Disabled` 更改为 `Enabled`，然后保存文件。  
![要更改的 Config.xml 文件区域。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/pwreset_config.png)

1. 修改配置文件后，按如下方式从临时实例分离辅助卷：

   1. 使用 **Disk Management (磁盘管理)** 实用工具，将该卷脱机。

   1. 断开与临时实例的连接，并返回 Amazon EC2 控制台。

   1. 在导航窗格中，选择**卷**，选择该卷，然后依次选择**操作**、**断开卷**。当卷的状态变为 **available** 之后，继续下一步操作。

## 步骤 5：重启原始实例
<a name="resetting-password-ec2config-step5"></a>

修改配置文件后，将卷作为根卷重新附加到原始实例，并使用其密钥对连接到该实例以检索管理员密码。

1. 按以下操作将卷重新附加到原始实例：

   1. 在导航窗格中，选择 **Volumes (卷)**，选择从临时实例中分离的卷，然后依次选择 **Actions (操作)**、**Attach Volume (附加卷)**。

   1. 在 **Attach Volume (附加卷)** 对话框中，对于 **Instances (实例)**，开始键入原始实例的名称或 ID，然后选择实例。

   1. 对于 **Device (设备)**，键入 **/dev/sda1**。

   1. 选择 **附加**。在卷状态更改为 `in-use` 后，继续进行下一步操作。

1. 在导航窗格中，选择 **Instances (实例)**。选择原始实例，然后依次选择 **Instance state (实例状态)**、**Start instance (启动实例)**。在实例状态更改为 `Running` 后，继续进行下一步操作。

1. 使用新密钥对的私有密钥会检索您的新 Windows 管理员密码，然后连接到实例。有关更多信息，请参阅 [使用 RDP 连接到 Windows 实例](connecting_to_windows_instance.md)。
**重要**  
实例在您停止并启动它后将获取一个新的公共 IP 地址。确保使用实例的当前公有 DNS 名称连接到实例。有关更多信息，请参阅 [Amazon EC2 实例状态更改](ec2-instance-lifecycle.md)。

1. （可选）如果您不再使用临时实例，可以将其终止。选择临时实例，然后依次选择 **Instance State (实例状态)** 和 **Terminate instance (终止实例)**。
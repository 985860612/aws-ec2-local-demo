

# 排查 Amazon EC2 实例的停止问题
<a name="TroubleshootingInstancesStopping"></a>

如果您的 Amazon EBS 支持的实例卡在 `stopping` 状态，则底层主机可能存在问题。

要解决此问题，请按照下列步骤操作：

1. **强制停止实例**

   使用 Amazon EC2 控制台或 AWS CLI 强制停止实例。有关步骤，请参阅[强制停止实例](#force-stop-instance)。

   实例将首先尝试正常关闭，其中包括刷新文件系统缓存和元数据（虽然您可以选择绕过正常关闭）。如果在超时期限内无法完成正常关闭，则实例将强制关闭，而不会刷新文件系统缓存和元数据。

1. **强制停止后**

   执行文件系统检查和修复过程。
**重要**  
执行这些过程至关重要，因为强制的停止会阻止刷新文件系统缓存和元数据。

1. **如果强制停止失败**

   如果 10 分钟后实例仍未停止，请执行以下操作：

   1. 请在 [AWS re:Post](https://repost.aws/) 上发布求助请求。为了帮助加快解决问题，请提供实例 ID 并描述已采取的步骤。

   1. 此外，如果您有支持计划，则可在[支持中心](https://console.aws.amazon.com/support/home#/)创建技术支持案例。

   1. 在等待帮助时，您可以根据需要创建替代实例。有关步骤，请参阅[（可选）创建替代实例](#Creating_Replacement_Instance)。

当实例处于 `stopping` 状态或处于除 `running` 外的任何其他状态时，不会收取任何实例使用费用。只有当实例处于 `running` 状态时，您使用实例时才需要付费。

**Topics**
+ [强制停止实例](#force-stop-instance)
+ [（可选）创建替代实例](#Creating_Replacement_Instance)

## 强制停止实例
<a name="force-stop-instance"></a>

您可以强制停止实例。如果在 10 分钟后，实例未停止，请在 [AWS re:Post](https://repost.aws/) 上寻求帮助。为了帮助加快解决问题，请提供实例 ID 并描述已采取的步骤。此外，如果您有支持计划，则可在[支持中心](https://console.aws.amazon.com/support/home#/)创建技术支持案例。

**注意**  
使用控制台时，只能在实例处于 `stopping` 状态时强制停止实例。使用 AWS CLI 时，可以在实例处于 `pending`、`running` 或 `stopping` 状态时强制停止实例。

------
#### [ Console ]

**强制停止实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances**，然后选择卡住实例。

1. 选择**实例状态**、**强制停止实例**。

   请注意，只有当您的实例处于 `stopping` 状态时，**Force stop instance**（强制停止实例）才可用。如果您的实例处于另一状态（除 `shutting-down` 和 `terminated` 之外的状态），您可以使用 AWS CLI 强制停止您的实例。

1. （可选）要绕过强制停止期间操作系统的正常关闭，请选中**跳过操作系统关闭**复选框。

1. 选择**强制停止**。

------
#### [ AWS CLI ]

**强制停止实例**  
使用 [stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html) 命令和 `--force` 选项。

```
aws ec2 stop-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --force
```

要绕过强制停止期间操作系统的正常关闭，请包括 `--skip-os-shutdown` 选项。

```
aws ec2 stop-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --force \
    --skip-os-shutdown
```

------
#### [ PowerShell ]

**强制停止实例**  
使用 [Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html) cmdlet 并将 `-Enforce` 设置为 `true`。

```
Stop-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}} `
    -Enforce $true
```

要绕过强制停止期间操作系统的正常关闭，请包括 `-SkipOsShutdown $true`。

```
Stop-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}} `
    -Enforce $true `
    -SkipOsShutdown $true
```

------

## （可选）创建替代实例
<a name="Creating_Replacement_Instance"></a>

在等待 [AWS re:Post](https://repost.aws/) 或[支持中心](https://console.aws.amazon.com/support/home#/)的帮助时，您可以根据需要创建替代实例。创建卡住实例的 AMI，再使用新的 AMI 启动新实例。

**重要**  
如果卡住的实例仅生成[系统状态检查](monitoring-instances-status-check.md)，则可以创建替换实例，因为实例状态检查将导致 AMI 复制损坏操作系统的精确副本。确认状态消息后，创建 AMI 并使用新的 AMI 启动新实例。

------
#### [ Console ]

**创建替代实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances**，然后选择卡住实例。

1. 依次选择**操作**、**映像和模板**和**创建映像**。

1. 在 **Create image (创建映像)** 页面上，执行以下操作：

   1. 输入 AMI 的名称和说明。

   1. 清除**重启实例**。

   1. 选择**创建映像**。

   有关更多信息，请参阅 [从实例创建 AMI](creating-an-ami-ebs.md#how-to-create-ebs-ami)。

1. 从 AMI 启动新实例，验证新实例是否正常运行。

1. 选择卡住的实例，然后依次选择**操作**、**实例状态**、**终止（删除）实例**。如果该实例也因卡住而终止，则 Amazon EC2 会自动强制其在几个小时内终止。

如果无法按上一步骤所述从该实例创建 AMI，则可以设置替代实例，如下所示：

**(替代) 使用控制台创建替代实例**

1. 选择实例并选择 **Description**、**Block devices**。选择每个卷并记下其卷 ID。请务必注意哪个卷是根卷。

1. 在导航窗格中，选择 **Volumes**。选择该实例的各个卷，然后依次选择 **Actions**、**Create Snapshot**。

1. 在导航窗格中，选择**快照**。选择您刚刚创建的快照，然后依次选择 **Actions**、**Create Volume**。

1. 使用与粘滞的实例相同的操作系统启动实例。注意其根卷的卷 ID 和设备名称。

1. 在导航窗格中，选择**Instances**（实例），选择刚才启动的实例，然后依次选择 **Instance state**（实例状态）、**Stop Instance**（停止实例）。

1. 在导航窗格中，选择 **Volumes**，选择已停止实例的根卷，然后依次选择 **Actions**、**Detach Volume**。

1. 选择您从卡住的实例创建的根卷，依次选择 **Actions**、**Attach Volume**，然后将其附加到新实例以作为其根卷（使用记下的设备名称）。将任何其他非根卷附加到该实例。

1. 在导航窗格中，选择 **Instances**，然后选择替代实例。依次选择**实例状态**、**启动实例**。验证该实例是否正常运行。

1. 选择卡住的实例，然后依次选择**实例状态**、**终止（删除）实例**。如果该实例也因卡住而终止，则 Amazon EC2 会自动强制其在几个小时内终止。

------
#### [ AWS CLI ]

**创建替代实例**

1. 使用 [create-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-image.html) 命令和 `--no-reboot` 选项，根据卡滞的实例创建一个 AMI。

   ```
   aws ec2 create-image \
       --instance-id {{i-1234567890abcdef0}} \
       --name "{{my-replacement-ami}}" \
       --description "{{"AMI for replacement instance}}" \
       --no-reboot
   ```

1. 使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令，从您刚刚创建的 AMI 启动一个新实例。

1. 验证新实例是否正常运行。

1. （可选）使用 [terminate-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/terminate-instances.html) 命令，终止卡滞的实例。

   ```
   aws ec2 terminate-instances --instance-ids {{i-1234567890abcdef0}}
   ```

------
#### [ PowerShell ]

**创建替代实例**

1. 使用 [New-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Image.html) cmdlet 并将 `-NoReboot` 设置为 `true`，从卡滞的实例创建一个 AMI。

   ```
   New-EC2Image `
       -InstanceId {{i-1234567890abcdef0}} `
       -Name "my-replacement-ami" `
       -Description "AMI for replacement instance" `
       -NoReboot $true
   ```

1. 使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet，从您刚刚创建的 AMI 启动一个新实例。

1. 验证新实例是否正常运行。

1. （可选）使用 [Remove-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2Instance.html) cmdlet，终止卡滞的实例。

   ```
   Remove-EC2Instance -InstanceId {{i-1234567890abcdef0}}
   ```

------
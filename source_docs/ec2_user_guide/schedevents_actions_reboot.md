

# 管理计划重启的 Amazon EC2 实例
<a name="schedevents_actions_reboot"></a>

当 AWS 必须执行安装更新或维护底层主机等任务时，可以计划实例重启。在计划重启期间，实例可以保留在同一主机上，也可迁移到其他主机，具体取决于事件，如下所示：
+ `instance-reboot` 事件
  + 在重启期间，实例仍保留在主机上。这称为*就地重启*。
  + 当前主机正在执行维护。
  + 这通常会在几秒钟内完成。
+ `system-reboot` 事件
  + 实例将在重启期间迁移至新的主机。这称为*重启迁移*，
  + 通常在几分钟内完成。

要检查为实例安排计划的事件类型，请参阅[确定事件类型](monitoring-instances-status-check_sched.md#scheduled-event-type)。

## 您可以执行的操作
<a name="actions-you-can-take-for-scheduled-reboot-event"></a>

收到计划的 `instance-reboot` 或 `system-reboot` 事件通知时，您可以执行以下操作之一：
+ **等待计划重启：**您可以等待实例在计划的维护时段内重启。
+ **将计划重启改期：**您可以将实例重启[改期](reschedule-event.md)为适合自己的其他日期和时间。
+ **执行用户发起的重启：**您可以在自己方便的时间自行手动[重启](ec2-instance-reboot.md)实例。但结果因事件而异：
  + `instance-reboot` 事件：实例将保留在当前硬件上（就地重启），不会进行主机维护，并且事件将保持打开状态。
  + `system-reboot` 事件
    + 如果实例启用了重启迁移，则用户发起的重启会尝试将实例迁移到新硬件上。如果操作成功，事件将被清除。如果操作不成功，则会执行就地重启并保留计划事件。
    + 如果实例禁用了重启迁移，则用户发起的重启会使实例保留在相同的硬件上（就地重启），不会进行主机维护但会保留计划事件。当计划事件最终发生时，AWS 会将实例移至新硬件（重启迁移）。

**在 AWS 重启实例后**

在 AWS 重启实例后，将会发生以下情况：
+ 该计划事件将被清除。
+ 事件描述将被更新。
+ 对于 `instance-reboot` 事件：
  + 底层主机的维护将会完成。
+ 对于 `system-reboot` 事件：
  + 实例将迁移至新主机。
  + 实例将保留其 IP 地址和 DNS 名称。
  + 本地实例存储卷上的所有数据都会保留。
+ 您可在实例完全启动之后使用实例。

**替代方案**

如果无法将重启事件改期或为用户发起的重启启用重启迁移，但希望在计划维护时段内保持正常运行，则可以执行以下操作：
+ **对于具有 EBS 根卷的实例**
  + 手动停止并启动实例，以将其迁移至新的主机。这与手动重启实例不同，手动重启时实例会保留在同一主机上。
  + 此外也可以自动立即停止并启动实例以响应计划重启事件。有关更多信息，请参阅《*AWS Health 用户指南*》中的[自动在 EC2 实例上运行操作以响应 AWS Health 中的事件](https://docs.aws.amazon.com/health/latest/ug/automating-instance-actions.html)。
**重要**  
停止实例后，实例存储卷上的数据将会丢失。有关更多信息，请参阅 [启动和停止 Amazon EC2 实例](Stop_Start.md)。
+ **对于具有实例存储根卷的实例**

  1. 从最新的 AMI 启动替换实例。

  1. 在计划维护时段开始之前，将所有必需的数据迁移至替换实例。

  1. 终止原始实例。

## 启用或禁用重启迁移
<a name="reboot-migration"></a>

在为实例计划某个 `system-reboot` 事件后，您可以在事件到来之前重启该实例。用户发起的重启的结果取决于实例的重启迁移设置：
+ 已启用：用户发起的重启会尝试将实例迁移到新硬件上（重启迁移）。如果操作成功，事件将被清除。如果操作不成功，则会执行就地重启并保留计划事件。请注意，即使启用了重启迁移，也只能在实例满足[重启迁移要求](#requirements-for-reboot-migration)的前提下进行重启迁移。
+ 已禁用：用户发起的重启会使实例保留在相同的硬件上（就地重启），不会进行主机维护但会保留计划事件。当计划事件最终发生时，AWS 会将实例移至新硬件（重启迁移）。

迁移后重启所需的时间比就地重启的时间长：
+ 就地重启：大约 30 秒
+ 迁移后重启：几分钟

**注意**  
收到 `system-reboot` 事件通知的实例会为用户发起的重启默认启用此功能。

### 启用重启迁移的要求
<a name="requirements-for-reboot-migration"></a>

只有满足以下条件的实例才能启用重启迁移：

**实例类型**  
并非所有实例类型都支持启用重启迁移。您可以查看支持启用重启迁移的实例类型。  

**查看支持启用重启迁移的实例类型**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Instance Types**（实例类型）。

1. 在筛选条件栏中，输入**重启迁移支持：已支持**。选择输入字符时出现的筛选条件名称。

   **实例类型**表会显示支持启用重启迁移的所有实例类型。
**查看支持启用重启迁移的实例类型**  
使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令和 `reboot-migration-support` 筛选条件。

```
aws ec2 describe-instance-types \
    --filters Name=reboot-migration-support,Values=supported \
    --query "InstanceTypes[*].[InstanceType]" \
    --output text | sort
```
**查看支持启用重启迁移的实例类型**  
使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) cmdlet 和 `reboot-migration-support` 筛选条件。

```
Get-EC2InstanceType `
    -Filter @{Name="reboot-migration-support";Values="true"} | `
    Select InstanceType | Sort-Object InstanceType
```

**租赁**  
+ 共享
+ 专用实例
有关更多信息，请参阅 [Amazon EC2 专用实例](dedicated-instance.md)。

**限制**

具有以下特征的实例**不**支持重启迁移：
+ 平台：在 Xen 虚拟机监控程序上原生运行的实例
+ 实例大小：`metal` 实例
+ 租赁：专属主机。对专属主机使用[专属主机自动恢复](dedicated-hosts-recovery.md)
+ 存储：具有实例存储卷的实例
+ 网络：使用 Elastic Fabric Adapter 的实例
+ 自动扩缩：属于自动扩缩组的实例

### 启用或禁用重启迁移的步骤
<a name="configure-reboot-migration-behavior"></a>

实例收到 `system-reboot` 事件后，则会默认启用重启迁移。您可以禁用重启迁移，以便在用户发起的重启期间将实例保留在相同的硬件上（就地重启）。

`default` 配置不能为不受支持的实例启用重启迁移。有关更多信息，请参阅 [启用重启迁移的要求](#requirements-for-reboot-migration)。

您可以在正在运行或已停止的实例上禁用或启用重启迁移。

------
#### [ AWS CLI ]

**禁用重启迁移**  
使用e [modify-instance-maintenance-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-maintenance-options.html) 命令，并将 `--reboot-migration` 参数设置为 `disabled`。

```
aws ec2 modify-instance-maintenance-options \ 
    --instance-id {{i-0abcdef1234567890}} \ 
    --reboot-migration disabled
```

**启用重启迁移**  
使用e [modify-instance-maintenance-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-maintenance-options.html) 命令，并将 `--reboot-migration` 参数设置为 `default`。

```
aws ec2 modify-instance-maintenance-options \ 
    --instance-id {{i-0abcdef1234567890}} \ 
    --reboot-migration default
```

------
#### [ PowerShell ]

**禁用重启迁移**  
使用 [Edit-EC2InstanceMaintenanceOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMaintenanceOption.html) cmdlet。

```
Edit-EC2InstanceMaintenanceOption `
    -InstanceId  `
    -RebootMigration Disabled
```

**启用重启迁移**  
使用 [Edit-EC2InstanceMaintenanceOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMaintenanceOption.html) cmdlet。

```
Edit-EC2InstanceMaintenanceOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -RebootMigration Enabled
```

------
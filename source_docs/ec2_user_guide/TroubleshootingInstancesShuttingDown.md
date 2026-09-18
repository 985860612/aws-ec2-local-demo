

# 排查 Amazon EC2 实例的终止问题
<a name="TroubleshootingInstancesShuttingDown"></a>

关闭或删除实例被称为实例终止。以下信息可以帮助您排查终止实例时遇到的问题。

当实例未处于 `running` 状态时，不会向您收取任何实例使用费用。换言之，当您终止实例时，一旦实例的状态变为 `shutting-down`，就不再产生与该实例相关的费用。

## 实例立即终止
<a name="instance-terminates-immediately"></a>

有多个问题可能会导致您的实例在启动后立即终止。请参阅[实例立即终止](troubleshooting-launch.md#troubleshooting-launch-internal)了解更多信息。

## 延迟的实例终止
<a name="instance-stuck-terminating"></a>

如果您的实例处于`shutting-down`状态超过几分钟，这可能是因为以下原因：
+ 该实例正在运行关闭脚本。
+ 底层主机有问题。

实例处于`shutting-down`状态已有几小时之后，Amazon EC2 会视之为卡住，并会强制终止该实例。

要自行解决卡住的实例，请执行以下操作：

1. **强制终止实例**

   使用 Amazon EC2 控制台或 AWS CLI 强制终止实例。有关步骤，请参阅[强制终止实例](#force-terminate-ec2-instance)。

   实例将首先尝试正常关闭，其中包括刷新文件系统缓存和元数据（虽然您可以选择绕过正常关闭）。如果在超时期限内无法完成正常关闭，则实例将强制关闭，而不会刷新文件系统缓存和元数据。

1. **如果强制终止失败**

   如果在几个小时后，实例仍未终止，并且看上去终止被卡住，请执行以下操作：

   1. 请在 [AWS re:Post](https://repost.aws/) 上发布求助请求。为了帮助加快解决问题，请提供实例 ID 并描述已采取的步骤。

   1. 此外，如果您有支持计划，则可在[支持中心](https://console.aws.amazon.com/support/home#/)创建技术支持案例。

### 强制终止实例
<a name="force-terminate-ec2-instance"></a>

如果您的实例似乎卡在终止状态，您可以强制终止实例。如果几个小时后实例仍未终止，请向 [AWS re:Post](https://repost.aws/) 发送求助请求。为了帮助加快解决问题，请提供实例 ID 并描述已采取的步骤。此外，如果您有支持计划，则可在[支持中心](https://console.aws.amazon.com/support/home#/)创建技术支持案例。

------
#### [ Console ]

**要强制终止实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances**，然后选择卡住实例。

1. 依次选择**实例状态**和**强制终止实例**。

   请注意，只有当您的实例处于 `stopping` 状态时，**强制终止实例**才可用。如果您的实例处于其他状态（`shutting-down` 和 `terminated` 除外），您可以使用 AWS CLI 强制终止实例。

1. （可选）要绕过强制终止期间操作系统的正常关闭，请选中**跳过操作系统关闭**复选框。

1. 选择**强制终止**。

------
#### [ AWS CLI ]

**要强制终止实例**  
使用 [terminate-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/terminate-instances.html) 命令和 `--force` 选项。

```
aws ec2 terminate-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --force
```

要绕过强制终止期间操作系统的正常关闭，请包含 `--skip-os-shutdown` 选项。

```
aws ec2 terminate-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --force \
    --skip-os-shutdown
```

------
#### [ PowerShell ]

**要强制终止实例**  
使用 [Remove-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2Instance.html) cmdlet 并将 `-Enforce` 设置为 `true`。

```
Remove-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}} `
    -Enforce $true
```

要绕过强制终止期间操作系统的正常关闭，请包含 `-SkipOsShutdown $true`。

```
Remove-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}} `
    -Enforce $true `
    -SkipOsShutdown $true
```

------

## 已终止实例仍然显示
<a name="terminated-instance-still-displaying"></a>

在您终止某个实例之后，它会在删除之前的短时间内保持可见。状态显示为 `terminated`。如果该条目在几小时之后未删除，请联系 Support。

## 错误：此实例可能无法终止。修改其“disableApiTermination”实例属性
<a name="termination-protection-enabled"></a>

如果您尝试终止实例并收到 `The instance {{i-1234567890abcdef0}} may not be terminated. Modify its 'disableApiTermination' instance attribute` 错误消息，则表明此实例已启用终止保护。终止保护可防止实例意外终止。

终止实例前，必须先禁用终止保护。

有关更多信息，请参阅 [更改实例终止保护](Using_ChangingDisableAPITermination.md)。

## 自动启动或终止的实例
<a name="automatic-instance-create-or-delete"></a>

通常，以下行为意味着您已使用 Amazon EC2 Auto Scaling、EC2 队列或 Spot 队列，根据已定义的条件自动扩展计算资源：
+ 您终止实例，新实例将自动启动。
+ 您启动一个实例，并且其中一个实例将自动终止。
+ 您停止实例且此实例终止，新实例会自动启动。

要停止自动扩缩，请找到正在启动实例的自动扩缩组或实例集，然后将其容量设置为 0 或将其删除。
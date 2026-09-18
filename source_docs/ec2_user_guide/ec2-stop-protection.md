

# 为 EC2 实例启用停止保护
<a name="ec2-stop-protection"></a>

要防止实例意外停止，可以为实例启用停止保护。停止保护还可以保护您的实例免遭意外终止。

Amazon EC2 [`ModifyInstanceAttribute`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceAttribute.html) API 的 `DisableApiStop` 属性可控制是否可以使用 Amazon EC2 控制台、AWS CLI，或 Amazon EC2 API 停止实例。您可以在实例启动、运行或已停止时设置该属性值。

**注意事项**
+ 启用停止保护并不能防止通过使用操作系统命令（如 **shutdown**、**poweroff**）从实例启动关闭，来意外停止实例。
+ 在[计划事件](monitoring-instances-status-check_sched.md)停止实例时，启用停止保护不会阻止 AWS 停止实例。
+ 启用停止保护不会阻止 Amazon EC2 Auto Scaling 在实例运行状况不佳或在横向缩减事件期间终止实例。您可以通过使用[实例横向缩减保护](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-protection.html)控制自动扩缩组在横向缩减时是否可以终止特定实例。
+ 停止保护不仅可防止实例意外停止，还可以防止使用控制台、AWS CLI 或 API 时意外终止实例。但是，它不会自动设置 `DisableApiTermination` 属性。请注意，当 `DisableApiStop` 属性设置为 `false` 时，`DisableApiTermination` 属性设置确定是否可以使用控制台、AWS CLI 或 API 终止实例。有关更多信息，请参阅 [终止 Amazon EC2 实例](terminating-instances.md)。
+ 无法针对具有实例存储根卷的实例启用停止保护。
+ 无法针对竞价型实例启用停止保护。
+ 启用或禁用停止保护时，Amazon EC2 API 遵循最终一致性模型。这意味着运行设置停止保护属性的命令的结果可能不会立即对您运行的所有后续命令可见。有关更多信息，请参阅《Amazon EC2 开发人员指南》**中的[最终一致性](https://docs.aws.amazon.com/ec2/latest/devguide/eventual-consistency.html)。

**Topics**
+ [在实例启动时启用停止保护](#enable-stop-protection-at-launch)
+ [为正在运行或已停止的实例启用停止保护](#enable-stop-protection-on-running-or-stopped-instance)
+ [为正在运行或已停止的实例禁用停止保护](#disable-stop-protection-on-running-or-stopped-instance)

## 在实例启动时启用停止保护
<a name="enable-stop-protection-at-launch"></a>

您可以在启动实例时为实例启用停止保护。

------
#### [ Console ]

**在实例启动时为实例启用停止保护**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在控制面板上，选择**启动实例**。

1. 在[新启动实例向导](ec2-launch-instance-wizard.md)中配置您的实例。

1. 在向导中，通过在**高级详细信息**下为**停止保护**选择**启用**来启用停止保护。

------
#### [ AWS CLI ]

**在实例启动时为实例启用停止保护**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令启动实例。添加以下参数。

```
--disable-api-stop
```

------
#### [ PowerShell ]

**在实例启动时为实例启用停止保护**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 启动实例。添加以下参数。

```
-DisableApiStop $true
```

------

## 为正在运行或已停止的实例启用停止保护
<a name="enable-stop-protection-on-running-or-stopped-instance"></a>

您可以在实例正在运行或已停止时启用停止保护。

------
#### [ Console ]

**为实例启用停止保护**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后依次选择**操作**>**实例设置**>**更改停止保护**。

1. 选择**启用**复选框，然后选择**保存**。

------
#### [ AWS CLI ]

**为实例启用停止保护**  
使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令。

```
aws ec2 modify-instance-attribute \
    --instance-id {{i-1234567890abcdef0}} \
    --disable-api-stop
```

------
#### [ PowerShell ]

**为实例启用停止保护**  
使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet。

```
Edit-EC2InstanceAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -DisableApiStop $true
```

------

## 为正在运行或已停止的实例禁用停止保护
<a name="disable-stop-protection-on-running-or-stopped-instance"></a>

您可以使用以下方法之一为正在运行或已停止的实例禁用停止保护。

------
#### [ Console ]

**为正在运行或已停止的实例禁用停止保护**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后依次选择 **Actions**（操作）、**Instance Settings**（实例设置）、**Change Stop Protection（更改停止保护）**。

1. 清除**启用**复选框，然后选择**保存**。

------
#### [ AWS CLI ]

**为正在运行或已停止的实例禁用停止保护**  
使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令。

```
aws ec2 modify-instance-attribute \
    --instance-id {{i-1234567890abcdef0}} \
    --no-disable-api-stop
```

------
#### [ PowerShell ]

**为实例禁用停止保护**  
使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet。

```
Edit-EC2InstanceAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -DisableApiStop $false
```

------
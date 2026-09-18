

# 更改实例终止保护
<a name="Using_ChangingDisableAPITermination"></a>

要防止在使用 Amazon EC2 API 时意外终止实例（无论是直接还是使用其他接口（例如 Amazon EC2 控制台）调用 `TerminateInstances`），则可以为该实例启用*终止保护*。`DisableApiTermination` 属性用于控制是否可以终止实例。默认情况下，终止保护处于禁用状态。您可以在启动实例时、实例正在运行时或已停止时设置此属性的值。

当 `InstanceInitiatedShutdownBehavior` 属性设置为 `terminate` 时，`DisableApiTermination` 属性不会阻止您通过从实例启动关机来终止实例的操作（例如，使用操作系统的系统关机命令）。有关更多信息，请参阅 [更改实例启动的关闭行为](Using_ChangingInstanceInitiatedShutdownBehavior.md)。

**注意事项**
+ 在[计划事件](monitoring-instances-status-check_sched.md)终止实例时，启用停止保护不会阻止 AWS 终止实例。
+ 启用终止保护不会阻止 Amazon EC2 Auto Scaling 在实例运行状况不佳，或在横向缩减事件期间终止实例。可以通过使用[实例横向缩减保护](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-protection.html)，来控制自动扩缩组在横向缩减时是否可以终止特定实例。可以通过[暂停 ReplaceUnhealthy 扩展过程](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-suspend-resume-processes.html)，来控制自动扩缩组是否可以终止运行状况不佳的实例。
+ 无法为竞价型实例启用终止保护。

------
#### [ Console ]

**在实例启动时启用终止保护**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在控制面板上，选择**启动实例**。

1. 展开 **Advanced details**（高级详细信息）。对于**终止保护**，请选择**启用**。

1. 指定完实例详细信息后，选择**启动实例**。

**为实例更改终止保护**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例。

1. 依次选择**操作**、**实例设置**、**更改终止保护**。

1. 对于**终止保护**，选择或清除**启用**。

1. 选择**保存**。

------
#### [ AWS CLI ]

**为实例启用终止保护**  
使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令。

```
aws ec2 modify-instance-attribute \
    --instance-id {{i-1234567890abcdef0}} \
    --disable-api-termination
```

**为实例禁用终止保护**  
使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令。

```
aws ec2 modify-instance-attribute \
    --instance-id {{i-1234567890abcdef0}} \
    --no-disable-api-termination
```

------
#### [ PowerShell ]

**为实例启用终止保护**  
使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet。

```
Edit-EC2InstanceAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -DisableApiTermination $true
```

**为实例禁用终止保护**  
使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet。

```
Edit-EC2InstanceAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -DisableApiTermination $false
```

------

## 终止具有终止保护的多个实例
<a name="terminate-multiple"></a>

如果您在同一请求中终止跨多个可用区的多个实例，并且启用了一个或多个指定实例以进行终止保护，则请求失败，结果如下：
+ 与受保护实例位于同一可用区中的指定实例不会终止。
+ 位于不同可用区（其他指定实例不受保护）的指定实例将成功终止。

**示例**  
假设您在两个可用区中有以下四个实例。


<table>
<thead>
  <tr><th>实例 </th><th>可用区</th><th>终止保护</th></tr>
</thead>
<tbody>
  <tr><td><b>实例 1</b></td><td rowspan="2">可用区 A</td><td><code>Disabled</code></td></tr>
  <tr><td><b>实例 2</b></td><td><code>Disabled</code></td></tr>
  <tr><td><b>实例 3</b></td><td rowspan="2">可用区 B</td><td><code>Enabled</code></td></tr>
  <tr><td><b>实例 4</b></td><td><code>Disabled</code></td></tr>
</tbody>
</table>


如果您尝试终止同一请求中的所有这些实例，请求将报告失败，结果如下：
+ **实例 1** 和**实例 2** 已成功终止，因为两个实例均未启用终止保护。
+ **实例 3** 和**实例 4** 无法终止，因为**实例 3** 已启用终止保护。
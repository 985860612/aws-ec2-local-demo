

# 将 Amazon EC2 实例休眠
<a name="hibernating-instances"></a>

如果按需型实例或竞价型实例是 EBS 支持的实例、[已启用休眠](enabling-hibernation.md)且满足[休眠先决条件](hibernating-prerequisites.md)，则可以在该实例上启动休眠。如果无法成功使实例休眠，则会进行正常关闭。

------
#### [ Console ]

**要对实例进行休眠**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择所需实例，然后依次选择**实例状态**、**休眠实例**。如果**休眠实例**处于已禁用状态，则表示实例已经休眠或停止，或者无法休眠。有关更多信息，请参阅[EC2 实例休眠的先决条件](hibernating-prerequisites.md)。

1. 当系统提示进行确认时，选择**休眠**。使实例休眠可能需要几分钟时间。实例状态首先会更改为 **Stopping**（正在停止），然后如果实例已休眠，实例状态会更改为 **Stopped**（已停止）。

------
#### [ AWS CLI ]

**要对实例进行休眠**  
使用 [stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html) 命令并指定 `--hibernate` 参数。

```
aws ec2 stop-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --hibernate
```

------
#### [ PowerShell ]

**要对实例进行休眠**  
使用 [Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html) cmdlet。

```
Stop-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}} `
    -Hibernate $true
```

------

您可以检查是否已在实例上启动休眠。

------
#### [ Console ]

**查看是否已在实例上启动休眠**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后在**详细信息**选项卡的**实例详细信息**部分中，检查**状态转换消息**的值。

   **Client.UserInitiatedHibernate：用户启动的休眠**表示您在按需型实例或竞价型实例上启动了休眠。

------
#### [ AWS CLI ]

**查看是否已在实例上启动休眠**  
使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令并指定 `state-reason-code` 筛选条件以查看已启动了休眠的实例。

```
aws ec2 describe-instances \
    --filters "Name=state-reason-code,Values=Client.UserInitiatedHibernate"
```

输出中的以下字段表示已在按需型实例或竞价型实例上启动休眠。

```
"StateReason": {
    "Code": "Client.UserInitiatedHibernate"
}
```

------
#### [ PowerShell ]

**查看是否已在实例上启动休眠**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet 并指定 `state-reason-code` 筛选条件以查看已启动休眠的实例。

```
Get-EC2Instance `
    -Filter @{Name="state-reason-code";Value="Client.UserInitiatedHibernate"}
```

------
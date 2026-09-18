

# 更改实例启动的关闭行为
<a name="Using_ChangingInstanceInitiatedShutdownBehavior"></a>

**警告**  
**终止实例是永久且不可逆转的。**  
终止一个实例后，您将无法再连接到该实例，而且也无法对其进行恢复操作。被配置为在终止后删除的所有连接的 Amazon EBS 卷也将被永久删除并且无法恢复。实例存储卷中存储的所有数据将永久丢失。有关更多信息，请参阅 [实例终止的工作原理](how-ec2-instance-termination-works.md)。  
在终止实例之前，请务必确保已将需要在终止后保留的所有数据备份到持久存储中。

当从 Amazon EBS 支持的实例启动关闭（使用 **shutdown** 或 **poweroff** 命令）时，该实例默认会停止。您可以通过更改实例的 `InstanceInitiatedShutdownBehavior` 属性更改此行为，从而实例会改为终止。您可以在实例运行或停止时更改此属性。

**halt** 命令不会启动关闭。如果已经使用，实例并不会终止；而是将 CPU 置于 `HLT` 状态，实例将继续运行。

**注意**  
只有当您从实例本身的操作系统中执行关闭操作时，`InstanceInitiatedShutdownBehavior` 属性才适用。当使用 `StopInstances` API 或 Amazon EC2 控制台停止实例时，该属性不适用。

------
#### [ Console ]

**更改实例启动的关闭操作**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 依次选择**操作**、**实例设置**、**更改关闭操作**。

   **关闭行为**显示当前行为。

1. 要更改行为，请从**关闭行为**中选择**停止**或**终止**。

1. 选择**保存**。

------
#### [ AWS CLI ]

**更改实例启动的关闭操作**  
使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令。

```
aws ec2 modify-instance-attribute \
    --instance-id {{i-1234567890abcdef0}} \
    --instance-initiated-shutdown-behavior terminate
```

------
#### [ PowerShell ]

**更改实例启动的关闭操作**  
使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet。

```
Edit-EC2InstanceAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -InstanceInitiatedShutdownBehavior terminate
```

------
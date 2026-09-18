

# 终止 Amazon EC2 实例
<a name="terminating-instances"></a>

**警告**  
**终止实例是永久且不可逆转的。**  
终止一个实例后，您将无法再连接到该实例，而且也无法对其进行恢复操作。被配置为在终止后删除的所有连接的 Amazon EBS 卷也将被永久删除并且无法恢复。实例存储卷中存储的所有数据将永久丢失。有关更多信息，请参阅 [实例终止的工作原理](how-ec2-instance-termination-works.md)。  
在终止实例之前，请务必确保已将需要在终止后保留的所有数据备份到持久存储中。

当您不再需要实例时，可将其删除。这称为*终止* 实例。实例的状态一旦变为 `shutting-down` 或 `terminated`，就不再产生与该实例相关的费用。

在您终止之后，您将无法连接到或启动实例。但您可以使用同一 AMI 启动新的实例。

如果您希望停止或休眠实例，请参阅 [启动和停止 Amazon EC2 实例](Stop_Start.md) 或 [将您的 Amazon EC2 实例休眠](Hibernate.md)。有关更多信息，请参阅 [实例状态之间的区别](ec2-instance-lifecycle.md#lifecycle-differences)。

**Topics**
+ [实例终止的工作原理](how-ec2-instance-termination-works.md)
+ [终止实例的方法](instance-terminate-methods.md)
+ [终止实例并正常关闭操作系统](#terminating-instances-console)
+ [终止实例并绕过操作系统正常关闭](#terminating-instances-bypass-graceful-os-shutdown)
+ [排查实例终止问题](#troubleshoot-instance-terminate)
+ [更改实例终止保护](Using_ChangingDisableAPITermination.md)
+ [更改实例启动的关闭行为](Using_ChangingInstanceInitiatedShutdownBehavior.md)
+ [实例终止时保留数据](preserving-volumes-on-termination.md)

## 终止实例并正常关闭操作系统
<a name="terminating-instances-console"></a>

您可以使用默认的终止方法终止实例，其中包括尝试正常关闭操作系统。有关更多信息，请参阅 [终止实例的方法](instance-terminate-methods.md)。

------
#### [ Console ]

**使用默认终止方法终止实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择相应实例，然后依次选择**实例状态**、**终止（删除）实例**。

1. 当系统提示您确认时，选择**终止（删除）**。

1. 在您终止某个实例之后，它会在短时间内保持可见，状态为 `terminated`。

   如果终止失败，或者已终止实例的可见时间超过几个小时，请参阅 [已终止实例仍然显示](TroubleshootingInstancesShuttingDown.md#terminated-instance-still-displaying)。

------
#### [ AWS CLI ]

**使用默认终止方法终止实例**  
使用 [terminate-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/terminate-instances.html) 命令。

```
aws ec2 terminate-instances --instance-ids {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**使用默认终止方法终止实例**  
使用 [Remove-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2Instance.html) cmdlet。

```
Remove-EC2Instance -InstanceId {{i-1234567890abcdef0}}
```

------

## 终止实例并绕过操作系统正常关闭
<a name="terminating-instances-bypass-graceful-os-shutdown"></a>

在终止实例时，您可以绕过操作系统正常关闭。有关更多信息，请参阅 [终止实例的方法](instance-terminate-methods.md)。

------
#### [ Console ]

**终止实例并绕过操作系统正常关闭**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择相应实例，然后依次选择**实例状态**、**终止（删除）实例**。

1. 在**跳过操作系统关闭**下，选中**跳过操作系统关闭**复选框。如果您在控制台中看不到此选项，则当前区域的控制台尚未提供此选项。但是，您可以使用 AWS CLI 或 SDK 访问此功能，也可以在控制台中尝试其他区域。

1. 选择**终止（删除）**。

1. 在您终止某个实例之后，它会在短时间内保持可见，状态为 `terminated`。

   如果终止失败，或者已终止实例的可见时间超过几个小时，请参阅 [已终止实例仍然显示](TroubleshootingInstancesShuttingDown.md#terminated-instance-still-displaying)。

------
#### [ AWS CLI ]

**终止实例并绕过操作系统正常关闭**  
使用 [terminate-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/terminate-instances.html) 命令和 `--skip-os-shutdown`。

```
aws ec2 terminate-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --skip-os-shutdown
```

------
#### [ PowerShell ]

**终止实例并绕过操作系统正常关闭**  
使用 [Remove-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2Instance.html) cmdlet 和 `-SkipOsShutdown $true`。

```
Remove-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}} `
    -SkipOsShutdown $true
```

------

## 排查实例终止问题
<a name="troubleshoot-instance-terminate"></a>

请求者必须具有调用 `ec2:TerminateInstances` 的权限。有关更多信息，请参阅[使用实例的示例策略](ExamplePolicies_EC2.md#iam-example-instances)。

如果您终止您的实例而另一个实例启动，很可能您已通过 EC2 队列 或 Amazon EC2 Auto Scaling 等功能配置了自动扩展。有关更多信息，请参阅 [自动启动或终止的实例](TroubleshootingInstancesShuttingDown.md#automatic-instance-create-or-delete)。

**注意**  
如果启用了终止保护，则无法终止实例。有关更多信息，请参阅[更改实例终止保护](Using_ChangingDisableAPITermination.md)。

如果您的实例处于 `shutting-down` 状态的时间超出正常范围，可尝试强制终止。如果实例仍处于 `shutting-down` 状态，则应通过 Amazon EC2 服务中的自动进程进行清理（终止）。有关更多信息，请参阅 [延迟的实例终止](TroubleshootingInstancesShuttingDown.md#instance-stuck-terminating)。
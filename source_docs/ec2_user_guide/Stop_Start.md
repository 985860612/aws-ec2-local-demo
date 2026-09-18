

# 启动和停止 Amazon EC2 实例
<a name="Stop_Start"></a>

您可以停止和启动将 Amazon EBS 卷作为其根卷的实例。当您停止一个实例时，其会关闭。启动实例时，其通常会迁移到新的底层主机，并分配新的公有 IPv4 地址。

实例停止可以由用户启动（手动停止实例）或由 AWS 启动（当 AWS 检测到实例的底层主机发生不可修复的故障时，响应计划停止事件）。

对于由用户启动的停止，我们建议使用 Amazon EC2 控制台、CLI 或 API 而非在实例中运行操作系统停止命令。使用 Amazon EC2 时，如果实例未在几分钟内完全关闭，Amazon EC2 会执行强制关机。此外，AWS CloudTrail 还会创建一条关于实例停止时间的 API 记录。

本主题介绍如何执行由用户启动的停止 。有关 AWS 执行的停止的信息，请参阅 [管理计划停止或停用的 Amazon EC2 实例](schedevents_actions_retire.md)。

当您停止某个实例时，它不会被删除。当您决定不再需要实例时，可以终止该实例。有关更多信息，请参阅 [终止 Amazon EC2 实例](terminating-instances.md)。如果您想休眠某个实例以保存实例内存（RAM）中的内容，请参阅 [将您的 Amazon EC2 实例休眠](Hibernate.md)。有关实例生命周期操作之间的区别，请参阅 [实例状态之间的区别](ec2-instance-lifecycle.md#lifecycle-differences)。

**Topics**
+ [工作原理](how-ec2-instance-stop-start-works.md)
+ [停止实例的方法](instance-stop-methods.md)
+ [手动停止和启动](#starting-stopping-instances)
+ [自动停止和启动](#stop-start-ec2-instances-on-a-schedule)
+ [查找正在运行和已停止的实例](#find-running-and-stopped-instances-in-globalview)
+ [查找初始和最近的启动时间](#find-initial-launch-time)
+ [启用停止保护](ec2-stop-protection.md)

## 手动停止和启动实例
<a name="starting-stopping-instances"></a>

您可以停止并启动 Amazon EBS 支持的实例（具有 EBS 根卷的实例）。不能停止并启动具有实例存储根卷的实例。

使用默认方法停止实例时，会尝试正常关闭操作系统 (OS)。您可以绕过操作系统的正常关闭；但是，这可能会危及数据的完整性。

**警告**  
当您停止某个实例时，任何实例存储卷上的数据都将被擦除。在停止实例之前，请确认您是否已将所需数据从实例存储卷复制到持久性存储，例如 Amazon EBS 或 Amazon S3。

[Linux 实例] 从实例中使用操作系统 **halt** 命令不会启动关闭。如果您使用 **halt** 命令，则实例不会终止；相反，它会将 CPU 放入 `HLT`，从而暂停 CPU 操作。实例仍在运行中。

您可以使用操作系统 **shutdown** 或 **poweroff** 命令启动关机。当您使用操作系统命令时，实例会默认停止。您可以更改此行为。有关更多信息，请参阅 [更改实例启动的关闭行为](Using_ChangingInstanceInitiatedShutdownBehavior.md)。

**注意**  
如果您停止了由 Amazon EBS 支持的实例，而该实例“卡在”了 `stopping` 状态，则可以强制停止它。有关更多信息，请参阅 [排查 Amazon EC2 实例的停止问题](TroubleshootingInstancesStopping.md)。

**Topics**
+ [通过正常关闭操作系统来停止实例](#stop-instance-with-graceful-os-shutdown)
+ [停止实例并绕过操作系统正常关闭](#stop-instance-bypass-graceful-os-shutdown)
+ [启动实例](#start-ec2-instance)

### 通过正常关闭操作系统来停止实例
<a name="stop-instance-with-graceful-os-shutdown"></a>

您可以使用默认的停止方法停止实例，其中包括尝试正常关闭操作系统。有关更多信息，请参阅 [默认停止](instance-stop-methods.md#ec2-instance-default-stop)。

------
#### [ Console ]

**使用默认的停止方法停止实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择**实例**，然后选择实例。

1. 依次选择**实例状态**、**停止实例**。如果此选项处于禁用状态，则表示实例已停止，或者其根卷是实例存储卷。

1. 当系统提示您确认时，选择 **Stop**。停止实例可能需要几分钟时间。

------
#### [ AWS CLI ]

**使用默认的停止方法停止实例**  
使用 [stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html) 命令。

```
aws ec2 stop-instances --instance-ids {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**使用默认的停止方法停止实例**  
使用 [Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html) cmdlet 

```
Stop-EC2Instance -InstanceId {{i-1234567890abcdef0}}
```

------

### 停止实例并绕过操作系统正常关闭
<a name="stop-instance-bypass-graceful-os-shutdown"></a>

在停止实例时，您可以绕过操作系统正常关闭。有关更多信息，请参阅 [停止并跳过操作系统关闭](instance-stop-methods.md#ec2-instance-stop-with-skip-os-shutdown)。

**警告**  
绕过操作系统正常关闭可能会导致数据丢失或损坏（例如，内存内容未刷新到磁盘或正在运行的 IO 丢失）或跳过关闭脚本。

------
#### [ Console ]

**停止实例并绕过操作系统正常关闭**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances**，然后选择实例。

1. 依次选择**实例状态**、**停止实例**。

1. 在**跳过操作系统关闭**下，选中**跳过操作系统关闭**复选框。如果您在控制台中看不到此选项，则当前区域的控制台尚未提供此选项。但是，您可以使用 AWS CLI 或 SDK 访问此功能，也可以在控制台中尝试其他区域。

1. 选择**停止**。

------
#### [ AWS CLI ]

**停止实例并绕过操作系统正常关闭**  
结合使用 [stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html) 命令和 `--skip-os-shutdown`。

```
aws ec2 stop-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --skip-os-shutdown
```

------
#### [ PowerShell ]

**停止实例并绕过操作系统正常关闭**  
结合使用 [Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html) cmdlet 和 `-SkipOsShutdown $true`。

```
Stop-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}} `
    -SkipOsShutdown $true
```

------

### 启动实例
<a name="start-ec2-instance"></a>

您可以启动已停止的实例。

------
#### [ Console ]

**启动实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后依次选择**实例状态**、**启动实例**。

   实例进入 `running` 状态可能需要几分钟时间。

------
#### [ AWS CLI ]

**启动实例**  
使用 [start-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/start-instances.html) 命令。

```
aws ec2 start-instances --instance-ids {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**启动实例**  
使用 [Start-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Start-EC2Instance.html) cmdlet。

```
Start-EC2Instance -InstanceId {{i-1234567890abcdef0}}
```

------

## 自动停止和启动您的实例
<a name="stop-start-ec2-instances-on-a-schedule"></a>

您可以使用以下服务自动停止和启动实例：

**AWS 上的实例调度器**  
您可以在 AWS 上使用实例调度器以自动开启和停止 EC2 实例。有关更多信息，请参阅[如何将实例调度器与 CloudFormation 一起使用来制定 EC2 实例的计划？](https://repost.aws/knowledge-center/stop-start-instance-scheduler) 请注意，[需要支付额外费用](https://docs.aws.amazon.com/solutions/latest/instance-scheduler-on-aws/cost.html)。

**AWS Lambda 和 Amazon EventBridge 规则**  
您可以使用 Lambda 和 EventBridge 规则按计划停止和开启您的实例。有关更多信息，请参阅[如何使用 Lambda，按固定间隔停止和启动 Amazon EC2 实例？](https://repost.aws/knowledge-center/start-stop-lambda-eventbridge)

**Amazon EC2 Auto Scaling**  
为确保您有正确数量的 Amazon EC2 实例来处理应用程序的负载，请创建自动扩缩组。Amazon EC2 Auto Scaling 确保您的应用程序始终具有处理流量需求的适当容量，并通过仅在需要时启动实例来节省成本。请注意，Amazon EC2 Auto Scaling 会终止而不是停止不需要的实例。要设置自动扩缩组，请参阅 [Amazon EC2 Auto Scaling 入门](https://docs.aws.amazon.com/autoscaling/ec2/userguide/get-started-with-ec2-auto-scaling.html)。

## 查找所有正在运行和已停止的实例
<a name="find-running-and-stopped-instances-in-globalview"></a>

您可以在 [Amazon EC2 全局视图](https://console.aws.amazon.com/ec2globalview/home)中的单个页面上找到所有 AWS 区域 中正在运行和已停止的所有实例。此功能对于清点资源和查找忘记的实例特别有用。有关如何使用全局视图的信息，请参阅 [使用 AWS 全局视图查看跨区域的资源](global-view.md)。

您也可以在您有实例的每个区域中运行命令或 cmdlet。

------
#### [ AWS CLI ]

**获取某个区域中的 EC2 实例数量**  
使用以下 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令统计当前区域中的实例数。您必须在您有实例的每个区域运行此命令。

```
aws ec2 describe-instances \
    --region {{us-east-2}} \
    --query "length(Reservations[].Instances[])"
```

下面是示例输出。

```
27
```

**获取有关您在某个区域中的 EC2 实例的汇总信息**  
使用以下 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。您必须在您有实例的每个区域运行此命令。

```
aws ec2 describe-instances \
    --region {{us-east-2}} \
    --query "Reservations[].Instances[].[InstanceId,InstanceType,PrivateIpAddress]" \
    --output table
```

下面是示例输出。

```
---------------------------------------------------------
|                   DescribeInstances                   |
+---------------------+---------------+-----------------+
|  i-0e3e777f4362f1bf7|  t2.micro     |  10.0.12.9      |
|  i-09453945dcf1529e9|  t2.micro     |  10.0.143.213   |
|  i-08fd74f3f1595fdbd|  m7i.4xlarge  |  10.0.1.103     |
+---------------------+---------------+-----------------+
```

------
#### [ PowerShell ]

**获取某个区域中的 EC2 实例数量**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance -Region {{us-east-2}}).Instances.Length
```

下面是示例输出。

```
27
```

**获取有关您在某个区域中的 EC2 实例的汇总信息**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。您必须在您有实例的每个区域运行此命令。

```
(Get-EC2Instance).Instances | Select InstanceId, InstanceType, PrivateIpAddress
```

下面是示例输出。

```
InstanceId          InstanceType PrivateIpAddress
----------          ------------ ----------------
i-0e3e777f4362f1bf7 t2.micro     10.0.12.9
i-09453945dcf1529e9 t2.micro     10.0.143.213
i-08fd74f3f1595fdbd m7i.4xlarge  10.0.1.103
```

------

## 查找初始和最近的启动时间
<a name="find-initial-launch-time"></a>

当您描述一个实例时，该实例的启动时间是其最近的启动时间。在您停止并启动一个实例后，启动时间将反映新实例的启动时间。要查找一个实例的初始启动时间（即使在停止和启动该实例之后），请查看主网络接口连接到该实例的时间。

------
#### [ Console ]

**查找最近启动时间**  
选择该实例，然后在**详细信息**选项卡上的**实例详细信息**下查找**启动时间**。

**查找初始启动时间**  
选择该实例，然后在**联网**选项卡的**网络接口**下查找主网络接口（设备索引为 0）。

------
#### [ AWS CLI ]

**查找初始和最近启动时间**  
使用以下 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令，显示指定实例的初始启动时间和最近启动时间。

```
aws ec2 describe-instances \
    --instance-id {{i-1234567890abcdef0}} \
    --query 'Reservations[].Instances[].{InstanceID:InstanceId,InitialLaunch:NetworkInterfaces[0].Attachment.AttachTime,LastLaunch:LaunchTime}'
```

下面是示例输出。

```
[
    {
        "InstanceID": "i-1234567890abcdef0",
        "InitialLaunch": "2024-04-19T00:47:08+00:00",
        "LastLaunch": "2024-05-27T06:24:06+00:00"
    }
]
```

------
#### [ PowerShell ]

**查找最近启动时间**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance -InstanceId {{i-1234567890abcdef0}}).Instances.LaunchTime
```

下面是示例输出。

```
Monday, May 27, 2024 6:24:06 AM
```

**查找初始启动时间**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance -InstanceId {{i-1234567890abcdef0}}).Instances.NetworkInterfaces.Attachment.AttachTime
```

下面是示例输出。

```
Friday, April 19, 2024 12:47:08 AM
```

------
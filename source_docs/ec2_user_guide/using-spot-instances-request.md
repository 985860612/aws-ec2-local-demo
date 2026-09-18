

# 管理您的竞价型实例
<a name="using-spot-instances-request"></a>

当有容量可用时，Amazon EC2 会启动竞价型实例。竞价型实例将一直运行，直到该实例中断，或者您自行终止该实例。

**Topics**
+ [查找竞价型实例](#using-spot-instances-running)
+ [查找由特定请求启动的实例](#find-request-spot-instances)
+ [停止竞价型实例](#stopping-a-spot-instance)
+ [启动竞价型实例](#starting-a-spot-instance)
+ [终止竞价型实例](#terminating-a-spot-instance)

## 查找竞价型实例
<a name="using-spot-instances-running"></a>

竞价型实例与按需型实例一起显示在控制台的**实例**页面中。使用以下过程查找竞价型实例。

------
#### [ Console ]

**查找竞价型实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 要查找所有竞价型实例，请在搜索窗格中选择**实例生命周期 = 竞价型**。

1. 要验证实例是否为竞价型实例，请选择该实例，选择**详细信息**选项卡，然后查看**生命周期**的值。竞价型实例的值为 `spot`，按需型实例的值为 `normal`。

------
#### [ AWS CLI ]

**查找竞价型实例**  
使用以下 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances --filters "Name=instance-lifecycle,Values=spot"
```

**确定实例是否为竞价型实例**  
使用以下 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --query "Reservations[*].Instances[*].InstanceLifecycle" \
    --output text
```

如果值为 `spot`，则表示实例是竞价型实例。如果没有输出，则表示实例是按需型实例。

------
#### [ PowerShell ]

**查找竞价型实例**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
Get-EC2Instance -Filter @{Name="instance-lifecycle"; Values="spot"}
```

**确定实例是否为竞价型实例**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance -InstanceId {{i-1234567890abcdef0}}).Instances.InstanceLifecycle
```

如果值为 `Spot`，则表示实例是竞价型实例。如果没有输出，则表示实例是按需型实例。

------

## 查找由特定请求启动的实例
<a name="find-request-spot-instances"></a>

使用以下过程查找通过特定竞价型实例或竞价型实例集请求启动的竞价型实例。

------
#### [ Console ]

**查找请求的竞价型实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。列表包含了竞价型实例请求和竞价型实例集请求。

1. 如果竞价型实例请求已执行，那么**容量**就是竞价型实例的 ID。对于 Spot 实例集，**Capacity (容量)** 表示已执行的请求容量。要查看 Spot 实例集中的实例的 ID，请选择扩展箭头，或者选择实例集，然后选择 **Instances (实例)**。

1. 对于竞价型实例集，**容量**表示已执行的请求容量。要查看竞价型实例集中的实例 ID，请选择实例集 ID 打开其详细信息页面，然后找到**实例**窗格。

------
#### [ AWS CLI ]

**查找请求的竞价型实例**  
使用以下 [describe-spot-instance-requests](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-spot-instance-requests.html) 命令。

```
aws ec2 describe-spot-instance-requests \
    --spot-instance-request-ids {{sir-0e54a519c9EXAMPLE}} \
    --query "SpotInstanceRequests[*].{ID:InstanceId}"
```

下面是示例输出：

```
[
    {
        "ID": "i-1234567890abcdef0"
    },
    {
        "ID": "i-0598c7d356eba48d7"
    }
]
```

------
#### [ PowerShell ]

**查找请求的竞价型实例**  
使用 [Get-EC2SpotInstanceRequest](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2SpotInstanceRequest.html) cmdlet。

```
(Get-EC2SpotInstanceRequest -SpotInstanceRequestId {{sir-0e54a519c9EXAMPLE}}).InstanceId
```

------

## 停止竞价型实例
<a name="stopping-a-spot-instance"></a>

如果现在不需要您的竞价型实例，但希望能够在以后将其重启且不丢失在 Amazon EBS 卷中持久保留的数据，则可以将其停止。停止竞价型实例的步骤与停止按需型实例的步骤类似。

**注意**  
在停止竞价型实例后，您可以修改其部分实例属性，但不能修改实例类型。  
我们不会对已停止的竞价型实例收费，也不会收取数据传输费，但我们会对所有 Amazon EBS 卷的存储收费。

**限制**
+ 只有当竞价型实例是从 `persistent` 竞价型实例请求启动时，您才能停止竞价型实例。
+ 如果关联的竞价型实例请求被取消，则无法停止竞价型实例。当竞价型实例请求被取消后，您只能终止竞价型实例。
+ 如果竞价型实例是某个实例集或启动组或可用区组的一部分，则无法停止它。

------
#### [ Console ]

**停止竞价型实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择竞价型实例。如果您没有保存竞价型实例的实例 ID，请参阅[查找竞价型实例](#using-spot-instances-running)。

1. 依次选择**实例状态**、**停止实例**。

1. 当系统提示您确认时，选择 **Stop**。

------
#### [ AWS CLI ]

**停止竞价型实例**  
使用 [stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html) 命令手动停止竞价型实例。

```
aws ec2 stop-instances --instance-ids {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**停止竞价型实例**  
使用 [Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html) cmdlet。

```
Stop-EC2Instance -InstanceId {{i-1234567890abcdef0}}
```

------

## 启动竞价型实例
<a name="starting-a-spot-instance"></a>

您可以启动以前停止的竞价型实例。

**先决条件**

您只能在以下情况下启动竞价型实例：
+ 您手动停止了竞价型实例。
+ 竞价型实例是 EBS 支持的实例。
+ 竞价型实例容量可用。
+ Spot 价格低于您的最高价格。

**限制**
+ 如果竞价型实例是某个实例集或启动组或可用区组的一部分，则无法启动它。

启动竞价型实例的步骤与启动按需型实例的步骤类似。

------
#### [ Console ]

**启动竞价型实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择竞价型实例。如果您没有保存竞价型实例的实例 ID，请参阅[查找竞价型实例](#using-spot-instances-running)。

1. 依次选择**实例状态**、**启动实例**。

------
#### [ AWS CLI ]

**启动竞价型实例**  
使用 [start-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/start-instances.html) 命令手动启动竞价型实例\|。

```
aws ec2 start-instances --instance-ids {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**启动竞价型实例**  
使用 [Start-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Start-EC2Instance.html) cmdlet。

```
Start-EC2Instance -InstanceId {{i-1234567890abcdef0}}
```

------

## 终止竞价型实例
<a name="terminating-a-spot-instance"></a>

**警告**  
**终止实例是永久且不可逆转的。**  
终止一个实例后，您将无法再连接到该实例，而且也无法对其进行恢复操作。被配置为在终止后删除的所有连接的 Amazon EBS 卷也将被永久删除并且无法恢复。实例存储卷中存储的所有数据将永久丢失。有关更多信息，请参阅 [实例终止的工作原理](how-ec2-instance-termination-works.md)。  
在终止实例之前，请务必确保已将需要在终止后保留的所有数据备份到持久存储中。

如果您终止的运行中或已停止竞价型实例是由持久性竞价型实例请求启动的，则竞价型实例请求会转换为 `open` 状态，这样就可以启动新的竞价型实例。要确保没有启动新的竞价型实例，您必须首先取消该竞价型实例请求。

如果您取消含有正在运行的竞价型实例的 `active` 竞价型实例请求，则正在运行的竞价型实例不会自动终止；您必须手动终止该竞价型实例。

如果您取消含有已停止的竞价型实例的 `disabled` 竞价型实例请求，则 Amazon EC2 Spot 服务将自动终止已停止的竞价型实例。取消竞价型实例请求与 Spot 服务终止竞价型实例之间可能存在短暂的滞后。

有关更多信息，请参阅 [取消竞价型实例请求](using-spot-instances-cancel.md)。

------
#### [ Console ]

**手动终止竞价型实例**

1. 在终止实例前，请确认您是否会丢失任何数据，方法是确认您的 Amazon EBS 卷是否会在终止时被删除，以及您是否已将所需数据从实例存储卷复制到持久性存储，例如 Amazon EBS 或 Amazon S3。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择竞价型实例。如果您没有保存竞价型实例的实例 ID，请参阅[查找竞价型实例](#using-spot-instances-running)。

1. 依次选择**实例状态**、**终止（删除）实例**。

1. 当系统提示您确认时，选择**终止（删除）**。

------
#### [ AWS CLI ]

**手动终止竞价型实例**  
使用 [terminate-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/terminate-instances.html) 命令可手动终止竞价型实例。

```
aws ec2 terminate-instances --instance-ids {{i-1234567890abcdef0}} {{i-0598c7d356eba48d7}}
```

------
#### [ PowerShell ]

**手动终止竞价型实例**  
使用 [Remove-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2Instance.html) cmdlet。

```
Remove-EC2Instance -InstanceId {{i-1234567890abcdef0}}
```

------
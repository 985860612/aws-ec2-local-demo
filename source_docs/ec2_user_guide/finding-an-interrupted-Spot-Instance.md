

# 查找中断的竞价型实例
<a name="finding-an-interrupted-Spot-Instance"></a>

在描述您的 EC2 实例时，结果将包括您的竞价型实例。竞价型实例的实例生命周期为 `spot`。竞价型实例的实例状态为 `stopped` 或 `terminated`，具体取决于您配置的中断行为。对于休眠的竞价型实例，实例状态为 `stopped`。

有关中断原因的更多详细信息，请查看 Spot 请求状态代码。有关更多信息，请参阅 [获取竞价型实例请求的状态](spot-request-status.md)。

------
#### [ Console ]

**查找已中断的竞价型实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 应用以下筛选条件：**实例生命周期 = 竞价型**。

1. 应用**实例状态 = 已停止**或**实例状态 = 已终止**筛选条件，具体取决于您配置的中断行为。

1. 对于每个竞价型实例，在**详细信息**选项卡的**实例详细信息**下，找到**状态转换消息**。以下代码表明竞价型实例已中断。
   + `Server.SpotInstanceShutdown`
   + `Server.SpotInstanceTermination`

------
#### [ AWS CLI ]

**查找中断的竞价型实例**  
将 `--filters` 选项与 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令结合使用。要仅在输出中列出实例 ID，请包括 `--query` 选项。

如果中断行为是终止竞价型实例，请使用以下示例：

```
aws ec2 describe-instances \
    --filters Name=instance-lifecycle,Values=spot \
              Name=instance-state-name,Values=terminated \
              Name=state-reason-code,Values=Server.SpotInstanceTermination \
    --query "Reservations[*].Instances[*].InstanceId"
```

如果中断行为是停止竞价型实例，请使用以下示例：

```
aws ec2 describe-instances \
    --filters Name=instance-lifecycle,Values=spot \
              Name=instance-state-name,Values=stopped \
              Name=state-reason-code,Values=Server.SpotInstanceShutdown \
    --query "Reservations[*].Instances[*].InstanceId"
```

------
#### [ PowerShell ]

**查找中断的竞价型实例**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

如果中断行为是终止竞价型实例，请使用以下示例：

```
(Get-EC2Instance `
    -Filter @{Key="instance-lifecycle"; Values="spot"} `
            @{Key="instance-state-name"; Values="terminated"} `
            @{Key="state-reason-code"; Values="Server.SpotInstanceTermination"}).Instances.InstanceId
```

如果中断行为是停止竞价型实例，请使用以下示例：

```
(Get-EC2Instance `
    -Filter @{Key="instance-lifecycle"; Values="spot"} `
            @{Key="instance-state-name"; Values="stopped"} `
            @{Key="state-reason-code"; Values="Server.SpotInstanceTermination"}).Instances.InstanceId
```

------
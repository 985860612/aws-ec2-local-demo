

# 取消（删除）竞价型实例集请求
<a name="cancel-spot-fleet"></a>

**重要**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

如果您不再需要竞价型实例集，则可以取消竞价型实例集请求，这将删除该请求。取消实例集请求后，与实例集关联的所有竞价型实例请求也将取消，从而不会启动任何新的竞价型实例。

取消竞价型实例集请求后，您还必须指定是否要终止其所有实例。包括按需型实例和竞价型实例。

**警告**  
**终止实例是永久且不可逆转的。**  
终止一个实例后，您将无法再连接到该实例，而且也无法对其进行恢复操作。被配置为在终止后删除的所有连接的 Amazon EBS 卷也将被永久删除并且无法恢复。实例存储卷中存储的所有数据将永久丢失。有关更多信息，请参阅 [实例终止的工作原理](how-ec2-instance-termination-works.md)。  
在终止实例之前，请务必确保已将需要在终止后保留的所有数据备份到持久存储中。

如果您指定必须在取消实例集请求后终止实例，实例集请求会进入 `cancelled_terminating` 状态。否则，实例集会进入 `cancelled_running` 状态，并且实例会继续运行，直到遇到中断或您手动将其终止。

**限制**
+ 在单个请求中，最多可以取消 100 个实例集。如果超过指定数量，将不会取消任何实例集。

------
#### [ Console ]

**取消（删除）竞价型实例集请求**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择竞价型实例集请求。

1. 依次选择**操作**和**取消请求**。

1. 在**取消竞价型实例请求**对话框中，执行以下操作：

   1. 要在取消竞价型实例集请求的同时终止关联的实例，请将**终止实例**复选框保持为选中状态。要取消竞价型实例集请求而不终止关联的实例，请清除**终止实例**复选框。

   1. 选择**确认**。

------
#### [ AWS CLI ]

**取消（删除）竞价型实例集请求并终止其实例**  
使用带 `--terminate-instances` 选项的 [cancel-spot-fleet-requests](https://docs.aws.amazon.com/cli/latest/reference/ec2/cancel-spot-fleet-requests.html) 命令。

```
aws ec2 cancel-spot-fleet-requests \
    --spot-fleet-request-ids {{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}} \
    --terminate-instances
```

下面是示例输出。

```
{
    "SuccessfulFleetRequests": [
        {
            "SpotFleetRequestId": "sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE",
            "CurrentSpotFleetRequestState": "cancelled_terminating",
            "PreviousSpotFleetRequestState": "active"
        }
    ],
    "UnsuccessfulFleetRequests": []
}
```

**取消（删除）竞价型实例集请求而不终止其实例**  
通过改用 `--no-terminate-instances` 选项修改上一个示例。

```
aws ec2 cancel-spot-fleet-requests \
    --spot-fleet-request-ids {{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}} \
    --no-terminate-instances
```

下面是示例输出。

```
{
    "SuccessfulFleetRequests": [
        {
            "SpotFleetRequestId": "sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE",
            "CurrentSpotFleetRequestState": "cancelled_running",
            "PreviousSpotFleetRequestState": "active"
        }
    ],
    "UnsuccessfulFleetRequests": []
}
```

------
#### [ PowerShell ]

**取消（删除）竞价型实例集请求并终止其实例**  
使用带 `-TerminateInstance` 参数的 [Stop-EC2SpotFleetRequest](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2SpotFleetRequest.html) cmdlet。

```
Stop-EC2SpotFleetRequest `
    -SpotFleetRequestId "{{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}" `
    -TerminateInstance $true
```

**取消（删除）竞价型实例集请求而不终止其实例**  
通过更改 `-TerminateInstance` 参数的值修改上一个示例。

```
Stop-EC2SpotFleetRequest `
    -SpotFleetRequestId "{{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}" `
    -TerminateInstance $false
```

------
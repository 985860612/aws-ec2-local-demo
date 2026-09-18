

# 修改竞价型实例集请求
<a name="modify-spot-fleet"></a>

**重要**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

您可以修改活动的竞价型实例集请求以完成以下任务：
+ 增加总目标容量和按需部分
+ 减少总目标容量和按需部分

在增加总目标容量时，竞价型实例集会根据其竞价型实例集请求的[分配策略](ec2-fleet-allocation-strategy.md)启动额外的竞价型实例。当您提高按需部分时，竞价型实例集会启动其他按需型实例。

在减少总目标容量时，竞价型实例集会取消超过新目标容量的任何打开的请求。您可以请求竞价型实例集终止竞价型实例，直到实例集的大小达到新目标容量。如果分配策略为 `diversified`，则竞价型实例集将在池间终止实例。或者，您可以请求竞价型实例集保持实例集当前的实例集大小，而不替换已中断的任何竞价型实例或者您手动终止的任何竞价型实例。

**注意事项**
+ 您无法修改一次性竞价型实例集请求。您只能在创建竞价型实例集请求时选择了**保持目标容量**的情况下修改竞价型实例集请求。
+ 当竞价型实例集因目标容量下降而终止某个实例时，该实例将收到一条竞价型实例中断通知。

------
#### [ Console ]

**修改竞价型实例集请求**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择竞价型实例集请求。

1. 依次选择 **Actions (操作)** 和 **Modify target capacity (修改目标容量)**。

1. 在 **Modify target capacity** 中，执行以下操作：

   1. 输入新的目标容量和按需部分。

   1. （可选）如果您要减少目标容量，但是要使实例集保持其当前大小，请清除**终止实例**。

   1. 选择 **Submit**。

------
#### [ AWS CLI ]

**修改竞价型实例集请求**  
使用 [modify-spot-fleet-request](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-spot-fleet-request.html) 命令可更新指定竞价型实例集请求的目标容量。

```
aws ec2 modify-spot-fleet-request \
    --spot-fleet-request-id {{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}} \
    --target-capacity {{20}}
```

可以按如下所示修改前面的命令，以减少指定竞价型实例集的目标容量而不因此终止任何竞价型实例。

```
aws ec2 modify-spot-fleet-request \
    --spot-fleet-request-id {{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}} \
    --target-capacity {{10}} \
    --excess-capacity-termination-policy NoTermination
```

------
#### [ PowerShell ]

**修改竞价型实例集请求**  
使用 [Edit-EC2SpotFleetRequest](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2SpotFleetRequest.html) cmdlet 更新指定竞价型实例集请求的目标容量。

```
Edit-EC2SpotFleetRequest `
    -SpotFleetRequestId "{{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}" `
    -TargetCapacity {{20}}
```

可以按如下所示修改前面的命令，以减少指定竞价型实例集的目标容量而不因此终止任何竞价型实例。

```
Edit-EC2SpotFleetRequest `
    -SpotFleetRequestId "{{sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE}}" `
    -TargetCapacity {{20}} `
    -ExcessCapacityTerminationPolicy "NoTermination"
```

------
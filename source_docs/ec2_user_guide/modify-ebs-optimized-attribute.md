

# 为 Amazon EC2 实例启用 EBS 优化
<a name="modify-ebs-optimized-attribute"></a>

对于可选支持 EBS 优化的上一代实例类型，您只能手动启用 EBS 优化。如果您为这些实例类型启用了 EBS 优化，则需要[按小时费率额外付费](https://aws.amazon.com/ec2/previous-generation/#EBS-optimized_instances)

**先决条件**
+ 确认该实例类型需要启用 EBS 优化。有关更多信息，请参阅 [支持的 EBS 优化](ebs-optimized.md#previous)。
+ 要在启动后启用 EBS 优化，则必须首先停止实例。
**警告**  
停止某个实例时，实例存储卷上的数据将会丢失。要保留这些数据，请将其备份到持久性存储中。

------
#### [ Console ]

**要在启动期间启用 Amazon EBS 优化**  
在启动实例向导中，选择所需的实例类型。展开**高级详细信息**部分，然后对于 **EBS 优化的实例**，选择**启用**。

如果所选实例类型不支持 Amazon EBS 优化，则下拉列表将被禁用。如果实例类型默认为 Amazon EBS 优化，则已选择启用。

**要在启动之后启用 Amazon EBS 优化**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances**，然后选择实例。

1. 停止实例。依次选择**操作**、**实例状态**、**停止实例**。

1. 在实例处于选中状态时，依次选择**操作**、**实例设置**、**更改实例类型**。

1. 选择 **EBS 优化**，然后选择**应用**。

   如果实例类型默认为 Amazon EBS 优化，或者不支持 Amazon EBS 优化，则该复选框将被禁用。

1. 重新启动实例。依次选择**实例状态**、**启动实例**。

------
#### [ AWS CLI ]

**要在启动期间启用 Amazon EBS 优化**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--ebs-optimized` 选项。

**要在启动之后启用 Amazon EBS 优化**

1. 如果实例正在运行，请使用 [stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html) 命令将其停止。

   ```
   aws ec2 stop-instances --instance-ids {{i-1234567890abcdef0}}
   ```

1. 使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令和 `--ebs-optimized` 选项来启用 EBS 优化。

   ```
   aws ec2 modify-instance-attribute \
       --instance-id {{i-1234567890abcdef0}} \
       --ebs-optimized
   ```

------
#### [ PowerShell ]

**要在启动期间启用 Amazon EBS 优化**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 和 `-EbsOptimized` 选项。

**要在启动之后启用 Amazon EBS 优化**

1. 如果实例正在运行，请使用 [Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html) cmdlet 将其停止。

   ```
   Stop-EC2Instance -InstanceId {{i-1234567890abcdef0}}
   ```

1. 使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet 和 `-EbsOptimized` 选项启用 EBS 优化。

   ```
   Edit-EC2InstanceAttribute `
       -InstanceId {{i-1234567890abcdef0}} `
       -EbsOptimized $true
   ```

------
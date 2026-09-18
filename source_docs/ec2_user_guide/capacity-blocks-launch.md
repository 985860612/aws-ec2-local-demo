

# 使用容量块启动实例
<a name="capacity-blocks-launch"></a>

要使用容量块，您必须在启动实例时指定容量块预留 ID。在容量块中启动实例后，可用容量会减去已启动实例的数量。例如，如果您购买的实例容量为 8 个实例，而您启动了 4 个实例，则可用容量将减去 4。

如果您在预留结束之前终止在容量块中运行的实例，则可以在其位置启动新实例。当您停止或终止容量块中的实例时，系统需要几分钟的时间来清理实例，然后才能启动另一个实例来替换它。在此期间，您的实例将处于停止或 `shutting-down` 状态。此过程完成后，实例状态将变为 `stopped` 或 `terminated`。然后，容量块中的可用容量将会更新，以显示另一个可用实例。

**要求**
+ 您的实例无法在与您的容量块所在可用区不同的可用区的子网中启动。
+ 实例无法使用其平台与容量块上的平台不同的 AMI 启动。
+  要使用 Local Zones 中的容量块，您必须主动启用该本地区域。

------
#### [ Console ]

**要将实例启动到容量块中**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在屏幕顶部的导航栏中，选择容量块预留的区域。

1. 从 Amazon EC2 控制台控制面板中，选择**启动实例**。

1. 按照程序[启动实例](ec2-launch-instance-wizard.md)。

1. 展开**高级详细信息**，然后在**购买选项**中选择**容量块**。然后，执行以下操作之一：
   + 要将实例启动到特定的容量块，请在**容量预留**中选择**指定容量预留**，然后选择容量块。
   + （*仅限 UltraServer*）要将实例启动到 UltraServer 容量块容量预留资源组中，请在**容量预留**中选择**指定容量预留资源组**，然后选择相应的容量预留资源组。

1. 选择**启动实例**。

------
#### [ AWS CLI ]

**要将实例启动到容量块中**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `instance-market-options MarketType` 选项。

以下示例将实例启动到特定的容量块中。

```
aws ec2 run-instances \
--image-id {{ami-0abcdef1234567890}} \
--count {{1}} \
--instance-type {{p5.48xlarge}} \
--key-name {{my-key-pair}} \
--subnet-id {{subnet-0abcdef1234567890}} \
--instance-market-options MarketType='capacity-block' \
--capacity-reservation-specification CapacityReservationTarget={CapacityReservationId={{capacity_block_id}}}
```

以下示例将实例启动到 UltraServer 容量块容量预留资源组中。

```
aws ec2 run-instances \
--image-id {{ami-0abcdef1234567890}} \
--count {{1}} \
--instance-type {{p6e-gb200.36xlarge}} \
--key-name {{my-key-pair}} \
--subnet-id {{subnet-0abcdef1234567890}} \
--instance-market-options MarketType='capacity-block' \
--capacity-reservation-specification CapacityReservationTarget={CapacityReservationResourceGroupArn={{resource_group_arn}}}
```

------
#### [ PowerShell ]

**要将实例启动到容量块中**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet，其 `-InstanceMarketOption` 选项定义如下。

```
$marketoption = New-Object Amazon.EC2.Model.InstanceMarketOptionsRequest
$marketoption.MarketType = "capacity-block"
```

以下示例将实例启动到特定的容量块中。

```
New-EC2Instance `
-ImageId {{ami-0abcdef1234567890}} `
-InstanceType {{p5.48xlarge}} `
-KeyName "{{my-key-pair}}" `
-SubnetId {{subnet-0abcdef1234567890}} `
-InstanceMarketOptions $marketoption `
-CapacityReservationTarget_CapacityReservationId {{capacity_block_id}}
```

以下示例将实例启动到 UltraServer 容量块容量预留资源组中。

```
New-EC2Instance `
-ImageId {{ami-0abcdef1234567890}} `
-InstanceType {{p6e-gb200.36xlarge}} `
-KeyName "{{my-key-pair}}" `
-SubnetId {{subnet-0abcdef1234567890}} `
-InstanceMarketOptions $marketoption `
-CapacityReservationTarget_CapacityReservationResourceGroupArn "{{resource_group_arn}}"
```

------

**相关资源**
+ 要创建将容量块作为目标的启动模板，请参阅[在 Amazon EC2 启动模板中存储实例启动参数](ec2-launch-templates.md)。
+ 要使用 EC2 实例集在容量块中启动实例，请参阅[教程：将 EC2 实例集配置为将实例启动到容量块中](ec2-fleet-launch-instances-capacity-blocks-walkthrough.md)。
+ 要设置带容量块的 EKS 托管式节点组，请参阅《Amazon EKS 用户指南》中的[创建带适用于机器学习的容量块的托管式节点组](https://docs.aws.amazon.com/eks/latest/userguide/capacity-blocks-mng.html)。****
+ 要使用容量块设置 AWS ParallelCluster，请参阅 [ML on AWS ParallelCluster](https://catalog.workshops.aws/ml-on-aws-parallelcluster/en-US)。
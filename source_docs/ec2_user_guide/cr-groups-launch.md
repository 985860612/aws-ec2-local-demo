

# 将实例启动到组中的容量预留
<a name="cr-groups-launch"></a>

您可以通过指定容量预留资源组 ARN，将实例启动到现有容量预留中。定位到某个组的实例与该组中具有匹配属性（实例类型、平台、可用区和租赁）和可用容量的任何容量预留匹配。

当使用[启动实例向导](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-instance-wizard.html)或 RunInstances API 启动实例时，每次启动只能指定一个购买选项（一种预留类型）。要同时启动到组中的多个预留类型，可使用 [Amazon EC2 Fleet](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet.html) 或[自动扩缩组](https://docs.aws.amazon.com/autoscaling/ec2/userguide/)。

有关如何使用容量预留资源组将实例启动到多个容量预留类型的分步演练，请参阅以下教程：通过 [EC2 Fleet](ec2-fleet-launch-instances-multiple-cr-types-walkthrough.md) 以及通过 [Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/use-distribution-segments.html)。

## 按需容量预留
<a name="cr-groups-launch-odcr"></a>

要将实例启动到组中的按需容量预留，请使用带 `CapacityReservationResourceGroupArn` 字段的 `CapacityReservationTarget` 参数指定组 ARN。

Amazon EC2 将实例启动到组中任何匹配的按需容量预留。如果没有可用的匹配容量，实例将使用按需容量启动。

如果不希望实例在没有可用匹配容量时按需启动，可将 `CapacityReservationPreference` 设置为 `capacity-reservations-only`。使用此设置，如果组中没有具有可用容量的匹配按需容量预留，实例将无法启动。

------
#### [ Console ]

**将实例启动到组中的按需容量预留**  


1. 按照启动实例的步骤操作，但在完成以下步骤之前不要启动实例。

1. 展开**高级详细信息**。

1. 对于**购买选项**，保留为**无**（默认）。

1. 对于**容量预留**，选择**指定容量预留资源组**（默认）或**仅在容量预留资源组中启动**（以防止回退到按需模式），然后选择该组。

1. 选择**启动实例**。

------
#### [ AWS CLI ]

**将实例启动到组中的按需容量预留**  
使用带有 `--capacity-reservation-specification` 参数的 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令。

以下示例在组中实例启动：如果该组中没有具有匹配属性和可用容量的 ODCR，实例将作为按需型实例启动。

```
aws ec2 run-instances \
    --instance-type {{c5.xlarge}} \
    --image-id {{ami-0abcdef1234567890}} \
    --count {{3}} \
    --capacity-reservation-specification \
        CapacityReservationTarget={CapacityReservationResourceGroupArn={{arn:aws:resource-groups:sa-east-1:123456789012:group/MyCRGroup}}}
```

以下示例在组中实例启动：如果该组中没有具有匹配属性和可用容量的 ODCR，实例将无法启动。

```
aws ec2 run-instances \
    --instance-type {{c5.xlarge}} \
    --image-id {{ami-0abcdef1234567890}} \
    --count {{3}} \
    --capacity-reservation-specification \
        CapacityReservationPreference=capacity-reservations-only,CapacityReservationTarget={CapacityReservationResourceGroupArn={{arn:aws:resource-groups:sa-east-1:123456789012:group/MyCRGroup}}}
```

------

### 定位到特定的置放群组
<a name="cr-groups-launch-placement"></a>

或者，如果您的组在置放群组中包含按需容量预留，也可以同时指定置放群组 ID 和容量预留资源组 ARN，以将所有已启动的实例放入该置放群组中。

**注意**  
容量块不支持置放群组。当您的请求针对容量预留资源组中的容量块时，无法指定置放群组。

## 可中断容量预留
<a name="cr-groups-launch-icr"></a>

要将实例启动到组中的可中断容量预留，可指定组 ARN 并选择可中断购买选项。Amazon EC2 将实例放入组中具有匹配属性和可用容量的任何活动的可中断容量预留中。如果没有可用的匹配容量，则实例无法启动。

------
#### [ Console ]

**将实例启动到组中的可中断容量预留**  


1. 按照启动实例的步骤操作，但在完成以下步骤之前不要启动实例。

1. 展开**高级详细信息**。

1. 对于**购买选项**，选择**可中断容量预留**。

1. 对于**容量预留**，选择**指定容量预留资源组**，然后选择该组。

1. 选择 **启动实例**。

------
#### [ AWS CLI ]

**将实例启动到组中的可中断容量预留**  
使用带有 `--instance-market-options` 及 `--capacity-reservation-specification` 参数的 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令。

```
aws ec2 run-instances \
    --instance-type {{c5.xlarge}} \
    --image-id {{ami-0abcdef1234567890}} \
    --count {{3}} \
    --instance-market-options MarketType=interruptible-capacity-reservation \
    --capacity-reservation-specification \
        CapacityReservationTarget={CapacityReservationResourceGroupArn={{arn:aws:resource-groups:sa-east-1:123456789012:group/MyCRGroup}}}
```

------

## 容量块
<a name="cr-groups-launch-cb"></a>

要将实例启动到组中的容量块，可指定组 ARN 并选择容量块购买选项。Amazon EC2 将实例放入组中具有匹配属性和可用容量的任何活动的容量块中。如果没有可用的匹配容量，则实例无法启动。

**注意**  
启动到容量预留资源组中的容量块时，无法指定置放群组。

------
#### [ Console ]

**将实例启动到组中的容量块中**  


1. 按照启动实例的步骤操作，但在完成以下步骤之前不要启动实例。

1. 展开**高级详细信息**。

1. 对于**购买选项**，选择**容量块**。

1. 对于**容量预留**，选择**指定容量预留资源组**，然后选择该组。

1. 选择**启动实例**。

------
#### [ AWS CLI ]

**将实例启动到组中的容量块中**  
使用带有 `--instance-market-options` 及 `--capacity-reservation-specification` 参数的 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令。

```
aws ec2 run-instances \
    --instance-type {{p5.48xlarge}} \
    --image-id {{ami-0abcdef1234567890}} \
    --count {{1}} \
    --instance-market-options MarketType=capacity-block \
    --capacity-reservation-specification \
        CapacityReservationTarget={CapacityReservationResourceGroupArn={{arn:aws:resource-groups:sa-east-1:123456789012:group/MyCRGroup}}}
```

------
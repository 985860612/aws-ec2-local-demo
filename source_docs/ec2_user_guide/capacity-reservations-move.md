

# 在容量预留之间移动容量
<a name="capacity-reservations-move"></a>

您可以将容量从一个容量预留移动到另一个容量预留，以根据需要重新分配预留的计算资源。例如，如果您需要在容量预留中随着使用量增长而增加容量，并且另一个预留中有可用容量，则可以在两个预留之间重新分配该容量。

## 移动容量的先决条件
<a name="capacity-reservations-move-prereq"></a>

作为先决条件，两个容量预留必须满足下面的要求：
+ 两个预留必须处于活动状态。
+ 两个预留都必须归您的 AWS 账户所有。您不能在不同的 AWS 账户拥有的预留之间移动容量。
+ 两个预留必须具有相同的：
  + 实例类型
  + 平台
  + 可用区
  + 租赁
  + 置放群组
  + 结束时间

目标容量预留实例资格（`open` 或 `targeted`）和标签不必与源预留匹配。两个预留的配置保持不变，只是源预留的容量减少了，而目标预留的容量增加了。

当您指定要移动的实例数量时，默认情况下，将首先移动任何可用容量，然后移动任何符合条件的正在运行的实例（预留中的已用容量）。例如，如果您从具有 5 个已使用实例和 3 个可用实例的预留中移动 4 个实例，那么 3 个可用实例和 1 个已使用实例也将被移动。

**注意**  
当您通过指定大于可用容量的**移动数量**来从预留中移动已用的容量时，只有在**容量预留规范**为 `open` 的情况下启动的实例才会被移动。

## 注意事项
<a name="capacity-reservations-move-considerations"></a>

将容量从一个预留移动到另一个预留时，需要考虑以下事项：
+ 已用容量只能在与同一组账户共享的具有 `open` 实例资格的容量预留之间移动。
+ 当您移动已用的容量时，系统将随机选择符合条件的实例。您无法指定移动哪些正在运行的实例。如果找不到足够数量的合格实例来满足移动数量，则移动操作将失败。
+ 如果您从源预留中移动所有容量，则容量预留将被自动取消。
+ **未来日期的容量预留**：在承诺期内，您不能移动未来日期的容量预留的容量。

**注意**  
不支持从容量块移动容量。

## 移动容量
<a name="capacity-reservations-move-procedure"></a>

可以将容量从源容量预留移动到目标容量预留。

------
#### [ Console ]

**移动容量**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择**容量预留**。

1. 选择具有可移动容量的按需容量预留 ID。

1. 在**操作**、**管理容量**下，选择**移动**。

1. 在**移动容量**页面的**目标容量预留**下，从列表中选择预留。

1. 在**要移动的数量**下，使用滑块或键入要从源容量预留移动到目标容量预留的实例数量。

1. 查看摘要，准备就绪后，选择**移动**。

------
#### [ AWS CLI ]

**移动容量**  
使用 [move-capacity-reservation-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/move-capacity-reservation-instances.html) 命令。以下示例将 10 个实例从指定的源容量预留移动到指定的目标容量预留。

```
aws ec2 move-capacity-reservation-instances \
    --source-capacity-reservation-id {{cr-1234567890abcdef0}} \
    --destination-capacity-reservation-id {{cr-021345abcdef56789}} \
    --instance-count {{10}}
```

------
#### [ PowerShell ]

**移动容量**  
使用 [Move-EC2CapacityReservationInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/Move-EC2CapacityReservationInstance.html) cmdlet。以下示例将 10 个实例从指定的源容量预留移动到指定的目标容量预留。

```
Move-EC2CapacityReservationInstance `
    -SourceCapacityReservationId {{cr-1234567890abcdef0}} `
    -DestinationCapacityReservationId {{cr-021345abcdef56789}} `
    -InstanceCount {{10}}
```

------


# 使用置放群组的容量预留
<a name="cr-cpg"></a>

您可以在置放群组中创建容量预留，以便为您的工作负载预留 Amazon EC2 计算容量。

在置放群组中创建容量预留可以确保您在需要时访问置放群组中的计算容量。这允许您缩减，同时确保容量仍可供您使用，以便在需要时可以扩展备份。

在置放群组中创建容量预留后，可以与其他 AWS 账户共享。有关更多信息，请参阅 [共享置放群组中的容量预留](#cpg-cr-sharing)。

## 支持的置放策略
<a name="cr-pg-supported-strategies"></a>

您可以在使用以下策略的置放群组中创建容量预留：
+ 集群
+ 精准时间

**注意**  
分散和分区置放群组不支持容量预留。容量块不支持置放群组。

有关支持实例类型、可用区域及置放策略的信息，请参阅 [Amazon EC2 实例的置放群组](placement-groups.md)。

**Topics**
+ [支持的置放策略](#cr-pg-supported-strategies)
+ [限制](#cr-cpg-limitations)
+ [使用置放群组中的容量预留](#work-with-crs-cpgs)
+ [共享置放群组中的容量预留](#cpg-cr-sharing)

## 限制
<a name="cr-cpg-limitations"></a>

在置放群组中创建容量预留时，请牢记以下几点：
+ 如果现有容量预留不在置放群组中，则您无法修改容量预留以在置放群组中预留容量。要在置放群组中预留容量，您必须在置放群组中创建容量预留。
+ 在置放群组中创建容量预留后，您无法对其进行修改以在置放群组之外预留容量。
+ 您可以通过修改置放群组中的现有容量预留或在置放群组中创建其他容量预留来增加置放群组中的预留容量。但是，您增加了出现容量不足错误的机会。
+ 您只能从所拥有的置放群组共享容量预留。不能共享非所属的置放群组中的容量预留。
+ 您无法删除具有 `active` 容量预留的置放群组。删除前，您必须先取消置放群组中的所有容量预留。

## 使用置放群组中的容量预留
<a name="work-with-crs-cpgs"></a>

要开始对置放群组使用容量预留，请执行以下步骤。

**注意**  
如果要在现有置放群组中创建容量预留，请跳过步骤 1。然后，对于步骤 2 和 3，请指定现有置放群组的 ARN。

**Topics**
+ [步骤 1：（*条件*）创建用于容量预留的置放群组](#create-cpg)
+ [步骤 2：在置放群组中创建容量预留](#create-cr-in-cpg)
+ [步骤 3：将实例启动到在置放群组的容量预留中](#launch-instance-into-cpg)

### 步骤 1：（*条件*）创建用于容量预留的置放群组
<a name="create-cpg"></a>

仅在需要创建新的置放群组时，执行此步骤。要使用现有的置放群组，请跳过此步骤，然后对于步骤 2 和 3，使用该置放群组的 ARN。

------
#### [ Console ]

**创建置放群组**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Placement Groups**（置放群组），然后选择 **Create placement group**（创建置放群组）。

1. 对于 **Name**（名称），为置放群组指定一个描述性名称。

1. 对于**放置策略**，选择添加放置策略。

1. 选择**创建群组**。

1. 在**置放群组**表的**群组 ARN** 列中，记下您创建的置放群组的 ARN。下一步中您将需要使用该值。

------
#### [ AWS CLI ]

**创建置放群组**  
使用 [create-placement-group](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-placement-group.html) 命令。

```
aws ec2 create-placement-group \
    --group-name {{MyPG}} \
    --strategy {{strategy}}
```

请记下输出中返回的置放群组 ARN，因为下一个步骤需要用到。

------
#### [ PowerShell ]

**创建置放群组**  
使用 [New-EC2PlacementGroup](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2PlacementGroup.html) cmdlet。

```
New-EC2PlacementGroup `
    -GroupName {{my-placement-group}} `
    -Strategy {{strategy}}
```

请记下输出中返回的置放群组 ARN，因为下一个步骤需要用到。

------

### 步骤 2：在置放群组中创建容量预留
<a name="create-cr-in-cpg"></a>

在置放群组中创建容量预留的方式与创建任何容量预留的方式相同。但是，您还必须指定要在其中创建容量预留的置放群组的 ARN。

**注意事项**
+ 指定的置放群组必须处于 `available` 状态。如果置放群组处于 `pending`、`deleting` 或 `deleted` 状态，则请求将失败。
+ 容量预留和置放群组必须位于同一可用区。如果创建容量预留的请求指定的可用区与置放群组的可用区不同，则请求将失败。
+ 您只能为置放群组支持的实例类型创建容量预留。如果您指定了不受支持的实例类型，则请求将失败。
+ 如果您在置放群组中创建 `open` 容量预留，并且现有正在运行的实例具有匹配属性（置放群组 ARN、实例类型、可用区、平台和租赁），这些实例将在容量预留中自动运行。
+ 如果出现以下情况之一，创建容量预留的请求会失败：
  + Amazon EC2没有足够的容量来满足请求。请稍后重试、尝试不同的可用区或者尝试较小的容量。如果您的工作负载灵活地跨实例类型和大小，请尝试不同的实例属性。
  + 请求的数量超过选定实例系列的个按需型实例限制。增加该实例系列的个按需型实例限制，然后重试。有关更多信息，请参阅 [按需型实例限额](ec2-on-demand-instances.md#ec2-on-demand-instances-limits)。

------
#### [ Console ]

**创建容量预留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择 **容量预留 (容量预留)**，然后选择 **Create 容量预留 (创建容量预留)**。

1. 在**创建容量预留**页面上，根据需要指定实例类型、平台、可用区、租赁、数量和结束日期。

1. 对于**置放群组**，选择要在其中创建容量预留的置放群组的 ARN。

1. 选择**创建**。

有关更多信息，请参阅 [创建 容量预留](capacity-reservations-create.md)。

------
#### [ AWS CLI ]

**创建容量预留**  
使用 [create-capacity-reservation](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-capacity-reservation.html) 命令。对于 `--placement-group-arn`，请指定要在其中创建容量预留的置放群组的 ARN。

```
aws ec2 create-capacity-reservation \
    --instance-type {{instance_type}} \
    --instance-platform {{platform}} \
    --availability-zone-id {{az_id}} \
    --instance-count {{quantity}} \
    --placement-group-arn "{{placement_group_arn}}"
```

------
#### [ PowerShell ]

**创建容量预留**  
使用 [Add-EC2CapacityReservation](https://docs.aws.amazon.com/powershell/latest/reference/items/Add-EC2CapacityReservation.html) cmdlet。对于 `-PlacementGroupArn`，请指定要在其中创建容量预留的置放群组的 ARN。

```
Add-EC2CapacityReservation `
    -InstanceType {{instance_type}} `
    -InstancePlatform {{platform}} `
    -AvailabilityZoneId {{az_id}} `
    -InstanceCount {{quantity}} `
    -PlacementGroupArn "{{placement_group_arn}}"
```

------

### 步骤 3：将实例启动到在置放群组的容量预留中
<a name="launch-instance-into-cpg"></a>

您可以使用以下一种选项将实例启动到置放群组中的容量预留。
+ *指定要启动实例的目标置放群组的 ARN*——当提供了置放群组的 ARN 时，Amazon EC2 会将实例启动到该置放群组中。您可以使用以下方法之一：
  + *指定 `open`*：无需在实例启动请求中指定容量预留。如果实例具有匹配指定置放群组中的容量预留的属性（置放群组 ARN、实例类型、可用区、平台和租赁），这些实例将在容量预留中自动运行。
  + *指定容量预留*——如果容量预留仅接受目标实例启动，则除了请求中的置放群组之外，还必须指定目标容量预留。
  + *指定容量预留组*——有关更多信息，请参阅[在容量预留组中使用置放群组的容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cpg-odcr-crg.html)。
+ *仅指定容量预留组*——有关更多信息，请参阅[在容量预留组中使用置放群组的容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cpg-odcr-crg.html)。
+ *仅指定容量预留*——可以将实例启动到置放群组的容量预留中。
**注意**  
通过仅指定容量预留或仅指定容量预留组来启动实例时，实例将启动到置放群组中创建的容量预留中，但这些实例不会直接附加到置放群组。

------
#### [ Console ]

**在现有容量预留中启动实例**

1. 按照步骤[启动实例](ec2-launch-instance-wizard.md)，但请在完成以下步骤以指定置放群组和容量预留的设置之后再启动实例。

1. 展开**高级详细信息**，并执行以下操作：

   1. 对于**置放群组**，选择要在其中启动实例的置放群组。

   1. 对于 **Capacity Reservation**（容量预留），请选择以下选项之一，具体取决于容量预留的配置：
      + **打开**——将实例启动到置放群组中任何具有匹配属性和足够容量的 `open` 容量预留。
      + **按 ID 定位** – 将实例启动到只接受目标实例启动的容量预留中。
      + **按组定位** –在所选容量预留组中任何具有匹配属性和可用容量的容量预留中启动实例。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

------
#### [ AWS CLI ]

**在现有容量预留中启动实例**  
可以使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令。如果您需要定位特定容量预留或容量预留组，请指定 `--capacity-reservation-specification` 参数。对于 `--placement`，请指定 `GroupName` 参数，然后指定您在上述步骤中创建的置放群组的名称。

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --count {{quantity}} \
    --instance-type {{instance_type}} \
    --key-name {{key_pair_name}} \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --capacity-reservation-specification CapacityReservationTarget={CapacityReservationId={{capacity_reservation_id}}} \
    --placement "GroupName={{placement_group_name}}"
```

------
#### [ PowerShell ]

**在现有容量预留中启动实例**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet。对于 `-Placement`，请指定 `GroupName` 参数，然后指定您在上述步骤中创建的置放群组的名称。

```
New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{instance_type}} `
    -KeyName {{key_pair_name}} `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -CapacityReservationTarget_CapacityReservationId {{capacity_reservation_id}} `
    -Placement_GroupName {{placement_group_name}}
```

------

## 共享置放群组中的容量预留
<a name="cpg-cr-sharing"></a>

可通过仅共享容量预留或同时共享容量预留和创建容量预留的置放群组，来共享置放群组的容量预留。

通过仅共享容量预留，您仅向使用者账户提供该容量预留的访问权限。使用者账户无法看到或访问创建容量预留的置放群组。这样就对使用者账户的访问提供了细粒度的控制。使用者账户无法查看有关置放群组的任何信息，包括其 ARN。

当共享置放群组和容量预留时，使用者账户可以看到并访问置放群组。使用者账户可启动实例并在实例中创建自己的容量预留。

有关详细信息，请参阅以下资源：
+ [将实例启动到在置放群组的容量预留中](#launch-instance-into-cpg)
+ [共享容量预留](capacity-reservation-sharing.md)
+ [共享置放群组](share-placement-group.md)
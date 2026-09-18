

# 修改您的实例的容量预留设置
<a name="capacity-reservations-modify-instance"></a>

您随时可以为已停止实例修改以下容量预留设置：
+ 以具有匹配属性（实例类型、平台、可用区和租赁）以及可用容量的任意容量预留启动。
+ 在特定容量预留中启动实例。
+ 在容量预留组中任何具有匹配属性和可用容量的容量预留中启动
+ 阻止实例在容量预留中启动。

------
#### [ Console ]

**修改实例容量预留设置**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择**实例**并选择要修改的实例。停止实例（如果尚未停止）。

1. 依次选择**操作**、**实例设置**和**修改容量预留设置**。

1. 对于**容量预留**，请选择下列选项之一：
   + **开放** – 在具有匹配属性以及对于所选实例数具有足够容量的任意容量预留中启动实例。如果没有匹配的容量预留具有足够容量，实例使用按需容量。
   + **无** – 阻止实例在容量预留中启动。实例使用按需容量运行。
   + **指定容量预留**：将实例启动到选定的容量预留中。如果选定的容量预留没有足够的容量来运行所选数量的实例，实例启动将失败。
   + **指定容量预留组**：将实例启动到所选容量预留组中任何具有匹配属性和可用容量的容量预留。如果所选组中没有具有匹配属性和可用容量的容量预留，将会在按需容量中启动实例。
   + **仅指定容量预留**：将实例启动到容量预留中。如果未指定容量预留 ID，则实例将启动到开放的容量预留中。如果容量不可用，则实例无法启动。
   + **仅指定容量预留资源组**：将实例启动到容量预留资源组中的容量预留中。如果未指定容量预留资源组 ARN，则实例将启动到开放的容量预留中。如果容量不可用，则实例无法启动。

------
#### [ AWS CLI ]

**修改实例容量预留设置**  
使用 [modify-instance-capacity-reservation-attributes](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-capacity-reservation-attributes.html) 命令。

以下示例将容量预留首选项更改为 `none`。

```
aws ec2 modify-instance-capacity-reservation-attributes \
    --instance-id {{i-1234567890abcdef0}} \
    --capacity-reservation-specification CapacityReservationPreference=none
```

以下示例的目标是特定容量预留。

```
aws ec2 modify-instance-capacity-reservation-attributes \
    --instance-id {{i-1234567890abcdef0}} \
    --capacity-reservation-specification \
    CapacityReservationTarget={CapacityReservationId={{cr-1234567890abcdef0}}}
```

以下示例将目标更改为特定容量预留组。

```
aws ec2 modify-instance-capacity-reservation-attributes \
    --instance-id {{i-1234567890abcdef0}} \
    --capacity-reservation-specification \
        CapacityReservationTarget={CapacityReservationResourceGroupArn=arn:aws:resource-groups:{{us-west-2}}:{{123456789012}}:group/{{my-cr-group}}}
```

以下示例将容量预留首选项更改为 `capacity-reservation-only`。由于未指定容量预留，实例将在具有匹配属性和可用容量的任何开放容量预留中启动。

```
aws ec2 modify-instance-capacity-reservation-attributes \
    --instance-id {{i-1234567890abcdef0}} \
    --capacity-reservation-specification CapacityReservationPreference=capacity-reservation-only
```

以下示例将容量预留首选项更改为 `capacity-reservation-only`，并将目标更改为特定容量预留。如果指定容量预留中没有可用容量，则实例将启动失败。

```
aws ec2 modify-instance-capacity-reservation-attributes \
    --instance-id {{i-1234567890abcdef0}} \
    --capacity-reservation-specification \
        CapacityReservationPreference=capacity-reservation-only \
        CapacityReservationTarget={CapacityReservationId={{cr-1234567890abcdef0}}}
```

------
#### [ PowerShell ]

**修改实例容量预留设置**  
使用 [Edit-EC2InstanceCapacityReservationAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceCapacityReservationAttribute.html) cmdlet。

以下示例将容量预留首选项更改为 `none`。

```
Edit-EC2InstanceCapacityReservationAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -CapacityReservationSpecification_CapacityReservationPreference "none"
```

以下示例的目标是特定容量预留。

```
Edit-EC2InstanceCapacityReservationAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -CapacityReservationTarget_CapacityReservationId {{cr-1234567890abcdef0}}
```

以下示例将目标更改为特定容量预留组。

```
Edit-EC2InstanceCapacityReservationAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -CapacityReservationTarget_CapacityReservationResourceGroupArn `
        "arn:aws:resource-groups:{{us-west-2}}:{{123456789012}}:group/{{my-cr-group}}"
```

以下示例将容量预留首选项更改为 `capacity-reservation-only`。由于未指定容量预留，实例将在具有匹配属性和可用容量的任何开放容量预留中启动。

```
Edit-EC2InstanceCapacityReservationAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -CapacityReservationSpecification_CapacityReservationPreference "capacity-reservation-only"
```

以下示例将容量预留首选项更改为 `capacity-reservation-only`，并将目标更改为特定容量预留。如果指定容量预留中没有可用容量，则实例将启动失败。

```
Edit-EC2InstanceCapacityReservationAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -CapacityReservationSpecification_CapacityReservationPreference "capacity-reservation-only" `
    -CapacityReservationTarget_CapacityReservationId {{cr-1234567890abcdef0}}
```

------
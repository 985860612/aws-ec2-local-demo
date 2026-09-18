

# 在现有 容量预留 中启动实例
<a name="capacity-reservations-launch"></a>

您只能将实例启动到具有以下条件的容量预留中：
+ 具有匹配属性（实例类型、平台、可用区和租赁）
+ 具有足够的可用容量
+ 处于 `active` 状态

启动实例时，可以指定在任意 `open` 容量预留中、特定容量预留中还是容量预留组中启动实例。

或者，您也可以将实例配置为避免在容量预留中运行，即使您拥有具有匹配属性和可用容量的 `open` 容量预留也是如此。

在容量预留中启动实例会将其可用容量减去所启动实例的数量。例如，如果您启动 3 个实例，容量预留的可用容量将减去 3。

------
#### [ Console ]

**在现有容量预留中启动实例**

1. 按照步骤[启动实例](ec2-launch-instance-wizard.md)，但请在完成以下步骤以指定置放群组和容量预留的设置之后再启动实例。

1. 展开**高级详细信息**，并执行以下操作：

   1. 对于**置放群组**，选择要在其中启动实例的集群置放群组。

   1. 对于 **Capacity Reservation**（容量预留），请选择以下选项之一，具体取决于容量预留的配置：
      + **无** – 阻止实例在容量预留中启动。实例使用按需容量运行。
      + **开放** – 在具有匹配属性以及对于所选实例数具有足够容量的任意容量预留中启动实例。如果没有匹配的容量预留具有足够容量，实例使用按需容量。
      + **指定容量预留**：将实例启动到选定的容量预留中。如果选定的容量预留没有足够的容量来运行所选数量的实例，实例启动将失败。
      + **指定容量预留资源组**：将实例启动到所选容量预留组中任何具有匹配属性和可用容量的容量预留中。如果所选组中没有具有匹配属性和可用容量的容量预留，将会在按需容量中启动实例。
      + **仅指定容量预留**：将实例启动到容量预留中。如果未指定容量预留 ID，则实例将启动到开放的容量预留中。如果容量不可用，则实例无法启动。
      + **仅指定容量预留资源组**：将实例启动到容量预留资源组中的容量预留中。如果未指定容量预留资源组 ARN，则实例将启动到开放的容量预留中。如果容量不可用，则实例无法启动。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。

------
#### [ AWS CLI ]

**在现有容量预留中启动实例**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令并指定 `--capacity-reservation-specification` 选项。

以下示例在具有匹配属性和可用容量的任意开放容量预留中启动实例：

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --count {{1}} \
    --instance-type {{t2.micro}} \
    --key-name {{my-key-pair}} \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --capacity-reservation-specification CapacityReservationPreference=open
```

以下示例在 `targeted` 容量预留中启动实例：

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --count {{1}} \
    --instance-type {{t2.micro}} \
    --key-name {{my-key-pair}} \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --capacity-reservation-specification \
        CapacityReservationTarget={CapacityReservationId={{cr-1234abcd56EXAMPLE}}}
```

以下示例在指定容量预留组中启动实例：

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --count {{1}} \
    --instance-type {{t2.micro}} \
    --key-name {{my-key-pair}} \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --capacity-reservation-specification \
        CapacityReservationTarget={CapacityReservationResourceGroupArn=arn:aws:resource-groups:{{us-west-2}}:{{123456789012}}:group/{{my-cr-group}}}
```

以下示例仅在容量预留中启动实例。由于未指定容量预留 ID，该实例将在具有匹配属性和可用容量的任何开放容量预留中启动：

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --count {{1}} \
    --instance-type {{t2.micro}} \
    --key-name {{my-key-pair}} \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --capacity-reservation-specification \
        CapacityReservationPreference=capacity-reservations-only
```

以下示例仅在指定容量预留中启动实例。如果指定容量预留中没有可用容量，则实例将启动失败。

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --count {{1}} \
    --instance-type {{t2.micro}} \
    --key-name {{my-key-pair}} \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --capacity-reservation-specification \
        CapacityReservationPreference={{capacity-reservations-only}} \
        CapacityReservationTarget={CapacityReservationId={{cr-1234abcd56EXAMPLE}}}
```

------
#### [ PowerShell ]

**在现有容量预留中启动实例**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet。

以下示例在具有匹配属性和可用容量的任意开放容量预留中启动实例：

```
New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{t2.micro}} `
    -KeyName "{{my-key-pair}}" `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -CapacityReservationSpecification_CapacityReservationPreference "open"
```

以下示例在 `targeted` 容量预留中启动实例：

```
New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{t2.micro}} `
    -KeyName "{{my-key-pair}}" `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -CapacityReservationTarget_CapacityReservationId {{cr-1234abcd56EXAMPLE}}
```

以下示例在指定容量预留组中启动实例：

```
New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{t2.micro}} `
    -KeyName "{{my-key-pair}}" `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -CapacityReservationTarget_CapacityReservationResourceGroupArn `
        "arn:aws:resource-groups:{{us-west-2}}:{{123456789012}}:group/{{my-cr-group}}"
```

以下示例仅在容量预留中启动实例。由于未指定容量预留 ID，该实例将在具有匹配属性和可用容量的任何开放容量预留中启动：

```
New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{t2.micro}} `
    -KeyName "{{my-key-pair}}" `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -CapacityReservationSpecification_CapacityReservationPreference "capacity-reservations-only"
```

以下示例仅在指定容量预留中启动实例。如果指定容量预留中没有可用容量，则实例将启动失败。

```
New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{t2.micro}} `
    -KeyName "{{my-key-pair}}" `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -CapacityReservationSpecification_CapacityReservationPreference "capacity-reservations-only" `
    -CapacityReservationTarget_CapacityReservationId {{cr-1234abcd56EXAMPLE}}
```

------
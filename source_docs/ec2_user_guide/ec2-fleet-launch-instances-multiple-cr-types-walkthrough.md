

# 教程：将 EC2 Fleet 配置为使用容量预留资源组，将实例启动到多个容量预留类型中
<a name="ec2-fleet-launch-instances-multiple-cr-types-walkthrough"></a>

本教程将指导您完成 EC2 Fleet 的配置步骤，即使用单个容量预留资源组，在多个容量预留类型（按需容量预留 (ODCR)、ML 容量块和可中断容量预留）中启动实例。

您将了解如何创建包含不同容量预留类型的容量预留资源组，配置 EC2 Fleet 以按特定顺序确定容量预留类型的优先级，以及在预留容量不足以满足目标时选择回退到按需容量。

## 注意事项
<a name="ec2-fleet-multiple-cr-types-considerations"></a>
+ 使用 `ReservedCapacityOptions` 时，仅支持 `instant` 型的 EC2 Fleet 请求。
+ 务必在 `ReservationTypes` 列表中明确指定要定向的容量预留类型。EC2 Fleet 仅将实例启动到您所指定的容量预留类型中。
+ `ReservedCapacityOptions` 与 `OnDemandOptions.CapacityReservationOptions` 互相排斥。不能在同一个 EC2 Fleet 请求中同时使用两者。

本教程假定您的账户中已有以下容量预留：
+ ODCR (`cr-1234567890abcdef1`)，`us-east-1a` 中适用于 `p5.48xlarge`
+ ODCR (`cr-abcdef1234567890a`)，`us-east-1b` 中适用于 `p4d.48xlarge`
+ 容量块 (`cr-0123456789abcdef0`)，`us-east-1a` 中适用于 `p5.48xlarge`
+ 可中断容量预留 (`cr-9876543210fedcba9`)，`us-east-1a` 中适用于 `p5.48xlarge`，由您组织中的其他账户与您共享

## 验证权限
<a name="ec2-fleet-multiple-cr-types-verify-permissions"></a>

在创建 EC2 实例集之前，验证您是否拥有具备所需权限的 IAM 角色。有关更多信息，请参阅 [EC2 实例集先决条件](ec2-fleet-prerequisites.md)。

## 步骤 1：创建容量预留资源组
<a name="ec2-fleet-multiple-cr-types-step1"></a>

创建容量预留资源组，用于存放 EC2 Fleet 定向的容量预留。配置该组，以便接受任意实例类型和容量预留类型的容量预留，从而使该组得以保留多个容量预留类型的组合。对于分步说明，请参阅[容量预留组](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-groups.html)。

**注意**  
创建该组时，请勿在 `AWS::EC2::CapacityReservationPool` 配置中指定 `instance-type` 或 `reservation-type` 参数。忽略这些参数后，该组可接受任意实例类型和容量预留类型的容量预留。

## 步骤 2：向组中添加容量预留
<a name="ec2-fleet-multiple-cr-types-step2"></a>

将您的容量预留添加到容量预留资源组。可添加 ODCR、ML 容量块、可中断容量预留和 UltraServer 容量块的任意组合。在本教程中，请添加本教程页首列出的四个容量预留。对于分步说明，请参阅[容量预留组](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-groups.html)。

## 步骤 3：创建启动模板
<a name="ec2-fleet-multiple-cr-types-step3"></a>

使用 [create-launch-template](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-launch-template.html) 命令创建启动模板，将目标设定为容量预留资源组。在 EC2 Fleet 配置中使用 `ReservedCapacityOptions` 时，无需在启动模板中设置 `MarketType`，EC2 Fleet 会自动为各个容量预留类型进行设置。

```
aws ec2 create-launch-template \
    --launch-template-name {{my-cr-resource-group-template}} \
    --launch-template-data \
        '{"ImageId": "ami-{{0123456789example}}",
          "CapacityReservationSpecification":
            {"CapacityReservationTarget":
                {"CapacityReservationResourceGroupArn": "arn:aws:resource-groups:{{us-east-1}}:{{123456789012}}:group/{{my-cr-resource-group}}"}
            }
        }'
```

## 步骤 4：创建 EC2 队列
<a name="ec2-fleet-multiple-cr-types-step4"></a>

创建以容量预留资源组中的多个容量预留类型为目标的 EC2 Fleet。关键配置为 `ReservedCapacityOptions`，该选项指定了以下内容：
+ `ReservationTypes`：含有待定位容量预留类型的有序列表。EC2 Fleet 按此顺序处理各种类型。有效值包括 `on-demand-capacity-reservation`、`capacity-block` 和 `interruptible-capacity-reservation`。
+ `AllocationStrategy`：如何在各个容量预留类型中确定实例类型的优先级。设置为 `prioritized` 以遵循您的实例类型覆盖顺序。
+ `ReservedCapacityFallbackOptions`：将 `MarketTypes` 设置为 `["on-demand"]`，以便在预留容量不足时启动按需型实例。如果未指定回退选项，则在指定的容量预留类型耗尽后，EC2 Fleet 将不会回退到其他任何市场类型。

使用以下内容创建名为 `config.json` 的文件。在以下示例中，将资源标识符替换为您自己的资源标识符。

```
{
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateName": "{{my-cr-resource-group-template}}",
                "Version": "1"
            },
            "Overrides": [
                {
                    "InstanceType": "{{p5.48xlarge}}",
                    "AvailabilityZone": "{{us-east-1a}}",
                    "Priority": 1
                },
                {
                    "InstanceType": "{{p4d.48xlarge}}",
                    "AvailabilityZone": "{{us-east-1b}}",
                    "Priority": 2
                }
            ]
        }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": {{100}},
        "DefaultTargetCapacityType": "reserved-capacity"
    },
    "ReservedCapacityOptions": {
        "ReservationTypes": ["on-demand-capacity-reservation", "capacity-block", "interruptible-capacity-reservation"],
        "ReservedCapacityFallbackOptions": {
            "MarketTypes": ["on-demand"]
        },
        "AllocationStrategy": "prioritized"
    },
    "Type": "instant"
}
```

使用 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令启动实例集：

```
aws ec2 create-fleet --cli-input-json file://config.json
```

有关更多信息，请参阅 [创建 EC2 实例集](create-ec2-fleet.md)。

**EC2 Fleet 如何解析容量预留**  
根据上述配置，EC2 Fleet 将尝试按以下顺序启动实例：

1. **ODCR**：首先是 `p5.48xlarge` 预留（优先级最高的实例类型），然后是 `p4d.48xlarge` 预留。在各个实例类型中，如果存在多个 ODCR，则随机选择一个。

1. **容量块**：如果所有 ODCR 中均无可用容量，EC2 Fleet 将以容量块为目标。首先是 `p5.48xlarge` 预留，然后是 `p4d.48xlarge`，具体预留在各个实例类型中随机选择。

1. **可中断容量预留**：如果所有容量块中均无可用容量，EC2 Fleet 将以可中断容量预留为目标：首先是 `p5.48xlarge` 预留，然后是 `p4d.48xlarge`，具体预留在各个实例类型中随机选择。

1. **按需回退**：如果预留容量不足以满足 100 个实例的目标，剩余容量将作为按需型实例启动。EC2 Fleet 会根据您在 `OnDemandOptions` 中指定的分配策略启动这些按需型实例。

**注意**  
EC2 Fleet 首先解析容量预留类型，然后解析各个容量预留类型中的实例类型。各个容量预留类型完全耗尽后，EC2 Fleet 将移至有序列表中的下一个类型。

## （可选）步骤 5：验证实例属性
<a name="ec2-fleet-multiple-cr-types-step5"></a>

使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令验证各个实例所使用的容量预留类型。实例集启动的实例显示以下属性。


| 属性 | 按需容量预留值 | 容量块值 | 可中断容量预留值 | 按需值 | 
| --- | --- | --- | --- | --- | 
| instance-lifecycle | null | capacity-block | interruptible-capacity-reservation | null | 
| capacity-reservation-id | 已使用的容量预留 ID | 已使用的容量预留 ID | 已使用的容量预留 ID | 不存在 | 
| capacity-reservation-specification | 组 ARN | 组 ARN | 组 ARN | 不存在 | 

可使用以下命令按容量预留资源组筛选实例：

```
aws ec2 describe-instances \
    --filters "Name=capacity-reservation-specification.capacity-reservation-target.capacity-reservation-resource-group-arn,Values=arn:aws:resource-groups:{{us-east-1}}:{{123456789012}}:group/{{my-cr-resource-group}}"
```

## 清理
<a name="ec2-fleet-multiple-cr-types-cleanup"></a>

要停止产生费用，请在不再需要时终止实例。请注意，在容量块预留结束时，启动到容量块中的实例会自动终止。如果容量所有者收回容量，则在可中断容量预留中启动的实例将自动终止。

## 相关资源
<a name="ec2-fleet-multiple-cr-types-related-resources"></a>
+ [容量预留组](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-groups.html)
+ [ML 容量块](ec2-capacity-blocks.md)
+ [可中断容量预留](interruptible-capacity-reservations.md)
+ [使用 EC2 按需容量预留来预留计算容量](ec2-capacity-reservations.md)
+ [使用 EC2 实例集](manage-ec2-fleet.md)
+ [创建 EC2 实例集](create-ec2-fleet.md)
+ [在 Amazon EC2 启动模板中存储实例启动参数](ec2-launch-templates.md)


# 教程：将 EC2 实例集配置为将实例启动到可中断容量预留中
<a name="ec2-fleet-launch-instances-interruptible-cr-walkthrough"></a>

本教程将指导您完成必须执行的步骤，以便 EC2 实例集在可中断容量预留中启动实例。

可中断容量预留是指 AWS 组织内按需容量预留所有者借给您的备用容量。这些预留适用于可中断的工作负载，因为容量所有者可以随时收回容量，只需发出 2 分钟的中断通知，之后 EC2 就会终止实例。有关容量预留的更多信息，请参阅 [可中断容量预留](interruptible-capacity-reservations.md)。

EC2 实例集请求的目标容量应小于或等于您所定位的可中断容量预留的可用容量。如果目标容量请求超过您的可中断容量预留的可用容量，则 EC2 实例集会启动尽可能多的实例，并在 API 响应中报告已启动的实例。

在可中断容量预留中运行的实例将继续运行，直到您手动停止或终止它们，或直到容量所有者收回容量。当容量所有者收回容量时，Amazon EC2 会在终止实例前 2 分钟发送一条 Amazon EventBridge 通知。

## 注意事项
<a name="ec2-fleet-interruptible-cr-considerations"></a>
+ 只有类型为 `instant` EC2 实例集请求才支持将实例启动到可中断容量预留中。
+ 不支持在使用 `OnDemandTargetCapacity` 或 `SpotTargetCapacity` 的同时将 `reserved-capacity` 设置为 `DefaultTargetCapacityType`。
+ 当您指定多个启动模板（每个模板都针对不同的可中断容量预留）时，EC2 实例集会为所有匹配的预留配置实例。
+ 对于可中断容量预留，EC2 实例集将不会回退到为剩余的所需目标容量启动按需型实例或竞价型实例。

## 验证权限
<a name="ec2-fleet-interruptible-cr-verify-permissions"></a>

在创建 EC2 实例集之前，验证您是否拥有具备所需权限的 IAM 角色。有关更多信息，请参阅 [EC2 实例集先决条件](ec2-fleet-prerequisites.md)。

要将实例启动到可中断容量预留中，您必须执行以下步骤：

## 步骤 1：创建启动模板
<a name="ec2-fleet-interruptible-cr-step1"></a>

使用 [create-launch-template](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-launch-template.html) 命令可创建启动模板，指定目标可中断容量预留。在启动模板中，将 `MarketType` 设置为 `interruptible-capacity-reservation`，并指定可中断容量预留的 `CapacityReservationId`。

启动模板配置示例：

```
{
    "LaunchTemplateName": "{{interruptible-cr-launch-template}}",
    "LaunchTemplateData": {
        "InstanceType": "{{m5.large}}",
        "ImageId": "ami-{{0abcdef1234567890}}",
        "CapacityReservationSpecification": {
            "CapacityReservationTarget": {
                "CapacityReservationId": "{{cr-0123456789abcdef0}}"
            }
        },
        "InstanceMarketOptions": {
            "MarketType": "interruptible-capacity-reservation"
        }
    }
}
```

示例输出

```
{
    "LaunchTemplate": {
        "LaunchTemplateId": "lt-0123456789example",
        "LaunchTemplateName": "interruptible-cr-launch-template",
        "CreateTime": "2026-03-12T10:00:00.000Z",
        "CreatedBy": "arn:aws:iam::123456789012:user/Admin",
        "DefaultVersionNumber": 1,
        "LatestVersionNumber": 1
    }
}
```

有关更多信息，请参阅 [创建 Amazon EC2 启动模板](create-launch-template.md)。

## 步骤 2：配置 EC2 实例集。
<a name="ec2-fleet-interruptible-cr-step2"></a>

为 EC2 实例集创建一个配置文档，指定启动模板和目标容量。以下配置使用步骤 1 中创建的启动模板 `interruptible-cr-launch-template`。

使用 `reserved-capacity` 作为 `DefaultTargetCapacityType` 时，必须指定 `ReservedCapacityOptions`，并将 `ReservationType` 设置为 `interruptible-capacity-reservation`。

使用以下内容创建名为 `config.json` 的文件：

```
{
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateName": "{{interruptible-cr-launch-template}}",
                "Version": "1"
            },
            "Overrides": [
                {
                    "InstanceType": "{{m5.large}}",
                    "AvailabilityZone": "{{us-east-1a}}"
                }
            ]
        }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": {{10}},
        "DefaultTargetCapacityType": "reserved-capacity"
    },
    "ReservedCapacityOptions": {
        "ReservationType": ["interruptible-capacity-reservation"]
    },
    "Type": "instant"
}
```

关键配置参数：


| 参数 | 说明 | 
| --- | --- | 
| DefaultTargetCapacityType | 设置为 reserved-capacity 表示应将实例启动到预留容量。 | 
| ReservedCapacityOptions | 指定预留容量的类型。对于可中断容量预留，设置 ReservationType 为 ["interruptible-capacity-reservation"]。 | 
| Type | 必须设置为 instant。可中断容量预留仅支持实例集。 | 

## 步骤 3：启动实例集并查看结果
<a name="ec2-fleet-interruptible-cr-step3"></a>

使用 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令创建实例集。

```
aws ec2 create-fleet \
    --cli-input-json file://config.json
```

使用前面的配置创建 `instant` 实例集后，EC2 实例集会向可中断容量预留启动 10 个实例，以满足目标容量。

**注意**  
如果实例集无法满足全部目标容量，则响应将包括已启动的实例以及未实现容量的所有错误。

示例输出

```
{
    "FleetId": "fleet-12345678-1234-1234-1234-123456789012",
    "Instances": [
        {
            "LaunchTemplateAndOverrides": {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateId": "lt-0123456789example",
                    "Version": "1"
                },
                "Overrides": {
                    "InstanceType": "m5.large",
                    "AvailabilityZone": "us-east-1a"
                }
            },
            "Lifecycle": "interruptible-capacity-reservation",
            "InstanceIds": [
                "i-0123456789example1",
                "i-0123456789example2",
                "i-0123456789example3",
                "i-0123456789example4",
                "i-0123456789example5",
                "i-0123456789example6",
                "i-0123456789example7",
                "i-0123456789example8",
                "i-0123456789example9",
                "i-0123456789example0"
            ],
            "InstanceType": "m5.large",
            "Platform": "Linux/UNIX"
        }
    ],
    "Errors": []
}
```

有关更多信息，请参阅 [创建 EC2 实例集](create-ec2-fleet.md)。

## 清理
<a name="ec2-fleet-interruptible-cr-cleanup"></a>

要停止产生费用，请在不再需要时终止实例。请注意，当容量所有者收回容量时，EC2 还会自动终止在可中断容量预留中启动的实例。

## 相关资源
<a name="ec2-fleet-interruptible-cr-related-resources"></a>
+ [可中断容量预留](interruptible-capacity-reservations.md)
+ [使用 EC2 按需容量预留来预留计算容量](ec2-capacity-reservations.md)
+ [使用 EC2 实例集](manage-ec2-fleet.md)
+ [创建 EC2 实例集](create-ec2-fleet.md)
+ [在 Amazon EC2 启动模板中存储实例启动参数](ec2-launch-templates.md)
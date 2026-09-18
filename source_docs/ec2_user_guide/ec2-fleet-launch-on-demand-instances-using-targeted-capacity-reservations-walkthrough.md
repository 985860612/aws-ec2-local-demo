

# 教程：使用目标容量预留配置 EC2 实例集以启动按需型实例
<a name="ec2-fleet-launch-on-demand-instances-using-targeted-capacity-reservations-walkthrough"></a>

本教程将指导您完成必须执行的所有步骤，以便 EC2 队列将按需实例启动到 `targeted` 容量预留。

您将学习如何将队列配置为使用 `targeted` 启动按需实例时，首先使用按需容量预留。您还将了解如何配置队列，以便当按需目标总容量超过可用未使用容量预留的数量时，队列使用指定的分配策略来选择启动剩余目标容量的实例池。

**EC2 队列配置**

在本教程中，实例集配置如下：
+ 目标容量：10 个按需实例
+ 未使用总数 `targeted` 容量预留：6（少于队列的 10 个按需实例的按需目标容量）
+ 容量预留池数量：2 (`us-east-1a` 和 `us-east-1b`）
+ 每个池的容量预留数量：3
+ 按需分配策略：`lowest-price`（如果未使用的容量预留数少于按需目标容量，队列将根据按需分配策略确定启动剩余的按需容量的池。）

  请注意，您也可以使用 `prioritized` 分配策略而不是 `lowest-price` 分配策略。

**要将按需实例启动到 `targeted` 能力预留，您必须执行以下几个步骤：**
+ [步骤 1：创建容量预留](#ec2-fleet-odcr-step1)
+ [步骤 2：创建容量预留资源组](#ec2-fleet-odcr-step2)
+ [步骤 3：将容量预留添加到容量预留资源组](#ec2-fleet-odcr-step3)
+ [（可选）步骤 4：查看资源组中的容量预留](#ec2-fleet-odcr-step4)
+ [步骤 5：创建启动模板，该模板指定容量预留的目标是特定资源组](#ec2-fleet-odcr-step5)
+ [（可选）步骤 6：描述启动模板](#ec2-fleet-odcr-step6)
+ [步骤 7：创建 EC2 队列](#ec2-fleet-odcr-step7)
+ [（可选）步骤 8：查看剩余未使用的容量预留数](#ec2-fleet-odcr-step8)

## 步骤 1：创建容量预留
<a name="ec2-fleet-odcr-step1"></a>

使用[创建容量预留](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-capacity-reservation.html)命令创建容量预留，三个 `us-east-1a`，另外三个 `us-east-1b`。除了可用区之外，容量预留的其他属性是相同的。

** 中的 3 个容量预留`us-east-1a`**

```
aws ec2 create-capacity-reservation \
    --availability-zone us-east-1a \
    --instance-type c5.xlarge \
    --instance-platform Linux/UNIX \
    --instance-count 3 \
    --instance-match-criteria targeted
```

生成的容量预留 ID 示例

```
cr-1234567890abcdef1
```

** 中的 3 个容量预留`us-east-1b`**

```
aws ec2 create-capacity-reservation \
    --availability-zone us-east-1b \
    --instance-type c5.xlarge \
    --instance-platform Linux/UNIX \
    --instance-count 3 \
    --instance-match-criteria targeted
```

生成的容量预留 ID 示例

```
cr-54321abcdef567890
```

## 步骤 2：创建容量预留资源组
<a name="ec2-fleet-odcr-step2"></a>

使用 `resource-groups` 服务和 [create-group](https://docs.aws.amazon.com/cli/latest/reference/resource-groups/create-group.html) 命令可创建容量预留资源组。在此示例中，资源组名为 `my-cr-group`。有关必须创建资源组原因的信息，请参阅 [使用容量预留来预留 EC2 实例集中的按需型容量](ec2-fleet-on-demand-capacity-reservations.md)。

```
aws resource-groups create-group \
    --name {{my-cr-group}} \
    --configuration '{"Type":"AWS::EC2::CapacityReservationPool"}' '{"Type":"AWS::ResourceGroups::Generic", "Parameters": [{"Name": "allowed-resource-types", "Values": ["AWS::EC2::CapacityReservation"]}]}'
```

## 步骤 3：将容量预留添加到容量预留资源组
<a name="ec2-fleet-odcr-step3"></a>

使用 `resource-groups` 服务和 [group-resources](https://docs.aws.amazon.com/cli/latest/reference/resource-groups/group-resources.html) 命令将您在步骤 1 中创建的容量预留添加到容量预留资源组。请注意，您必须通过其 ARN 引用按需容量预留。

```
aws resource-groups group-resources \
    --group {{my-cr-group}} \
    --resource-arns \
      arn:aws:ec2:{{us-east-1}}:{{123456789012}}:capacity-reservation/{{cr-1234567890abcdef1}} \
      arn:aws:ec2:{{us-east-1}}:{{123456789012}}:capacity-reservation/{{cr-54321abcdef567890}}
```

示例输出

```
{
   "Failed": [], 
   "Succeeded": [ 
   "arn:aws:ec2:us-east-1:123456789012:capacity-reservation/cr-1234567890abcdef1", 
   "arn:aws:ec2:us-east-1:123456789012:capacity-reservation/cr-54321abcdef567890" 
   ] 
}
```

## （可选）步骤 4：查看资源组中的容量预留
<a name="ec2-fleet-odcr-step4"></a>

使用 `resource-groups` 服务和 [list-group-resources](https://docs.aws.amazon.com/cli/latest/reference/resource-groups/list-group-resources.html) 命令可根据需要描述资源组以查看其容量预留。

```
aws resource-groups list-group-resources --group {{my-cr-group}}
```

示例输出

```
{
    "ResourceIdentifiers": [
        {
            "ResourceType": "AWS::EC2::CapacityReservation",
            "ResourceArn": "arn:aws:ec2:us-east-1:123456789012:capacity-reservation/cr-1234567890abcdef1"
        },
        {
            "ResourceType": "AWS::EC2::CapacityReservation",
            "ResourceArn": "arn:aws:ec2:us-east-1:123456789012:capacity-reservation/cr-54321abcdef567890"
        }
    ]
}
```

## 步骤 5：创建启动模板，该模板指定容量预留的目标是特定资源组
<a name="ec2-fleet-odcr-step5"></a>

使用 [create-launch-template](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-launch-template.html) 命令可创建启动模板，在此启动模板中指定要使用的容量预留。在此示例中，队列将使用已添加到资源组的 `targeted` 容量预留。因此，启动模板数据指定容量预留以特定资源组为目标。在此示例中，启动模板名为 `my-launch-template`。

```
aws ec2 create-launch-template \
    --launch-template-name {{my-launch-template}} \
    --launch-template-data \
        '{"ImageId": "ami-{{0123456789example}}",
          "CapacityReservationSpecification": 
            {"CapacityReservationTarget": 
                { "CapacityReservationResourceGroupArn": "arn:aws:resource-groups:{{us-east-1}}:{{123456789012}}:group/{{my-cr-group}}" }
            }
        }'
```

## （可选）步骤 6：描述启动模板
<a name="ec2-fleet-odcr-step6"></a>

使用 [describe-launch-template-versions](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-launch-template-versions.html) 命令（可选）描述启动模板以查看其配置。

```
aws ec2 describe-launch-template-versions --launch-template-name {{my-launch-template}}
```

示例输出

```
{
    "LaunchTemplateVersions": [
        {
            "LaunchTemplateId": "lt-01234567890example",
            "LaunchTemplateName": "my-launch-template",
            "VersionNumber": 1,
            "CreateTime": "2021-01-19T20:50:19.000Z",
            "CreatedBy": "arn:aws:iam::123456789012:user/Admin",
            "DefaultVersion": true,
            "LaunchTemplateData": {
                "ImageId": "ami-0947d2ba12ee1ff75",
                "CapacityReservationSpecification": {
                    "CapacityReservationTarget": {
                        "CapacityReservationResourceGroupArn": "arn:aws:resource-groups:us-east-1:123456789012:group/my-cr-group"
                    }
                }
            }
        }
    ]
}
```

## 步骤 7：创建 EC2 队列
<a name="ec2-fleet-odcr-step7"></a>

创建一个 EC2 队列，指定将启动的实例配置信息。以下 EC2 队列配置仅显示该示例的相关配置。启动模板 `my-launch-template` 是您在步骤 5 中创建的启动模板。有两个实例池，每个实例池具有相同的实例类型 (`c5.xlarge`)，但具有不同的可用区域（`us-east-1a` 和 `us-east-1b`)。实例池的价格是相同的，因为定价是针对区域定义的，而不是按可用区定义的。总目标容量为 10，而原定设置目标容量类型为 `on-demand`。按需分配策略为 `lowest-price`。容量预留的使用策略是 `use-capacity-reservations-first`。

**注意**  
队列类型必须为 `instant`。其他队列类型不支持 `use-capacity-reservations-first`。

```
{
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateName": "{{my-launch-template}}",
                "Version": "1"
            },
            "Overrides": [
               {
                   "InstanceType": "{{c5.xlarge}}",
                   "AvailabilityZone": "{{us-east-1a}}"
               },
               {
                    "InstanceType": "{{c5.xlarge}}",
                    "AvailabilityZone": "{{us-east-1b}}"
               }
            ]
        }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": {{10}},
        "DefaultTargetCapacityType": "{{on-demand}}"
    },
    "OnDemandOptions": {
        "AllocationStrategy": "{{lowest-price}}",
        "CapacityReservationOptions": {
             "UsageStrategy": "use-capacity-reservations-first"
         }
    },
    "Type": "instant"
}
```

在使用上述配置创建 `instant` 队列后，将启动下面的 10 个实例来满足目标容量：
+ 容量预留首先用于启动 6 个按需实例，如下所示：
  + 3 个按需实例启动到 `us-east-1a` 中的 3 个`c5.xlarge` `targeted`容量预留
  + 3 个按需实例启动到 `us-east-1b` 中的 3 个`c5.xlarge` `targeted`容量预留
+ 为了满足目标容量，根据按需分配策略，将 4 个额外的按需实例启动到常规按需容量中（在本示例中为 `lowest-price`）。但是，由于池的价格相同（因为价格是每个区域而不是每个可用区），因此队列将在其中一个池中启动剩余的 4 个按需实例。

## （可选）步骤 8：查看剩余未使用的容量预留数
<a name="ec2-fleet-odcr-step8"></a>

在启动队列后，您可以运行 [describe-capacity-reservations](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservations.html) 来查看保留的未使用的容量预留的数目。在此示例中，您应看到以下响应，该响应指示所有池中的所有 容量预留 均已使用。

```
{ "CapacityReservationId":  "cr-111",
     "InstanceType":  "c5.xlarge",  
     "AvailableInstanceCount":  0
}

 { "CapacityReservationId":  "cr-222",
     "InstanceType":  "c5.xlarge", 
     "AvailableInstanceCount":  0
}
```


# 配置 instant 类型的 EC2 实例集
<a name="instant-fleet"></a>

*instant* 类型的 EC2 队列是同步一次性请求，该请求只尝试启动所需容量一次。API 响应列出已启动的实例，以及那些无法启动实例的错误。使用 *instant* 类型的 EC2 队列有几个益处，本文会对其进行介绍。本文末尾提供了配置示例。

对于需要仅启动 API 来启动 EC2 实例的工作负载，您可以使用 RunInstances API。但是，通过 RunInstances，您只能启动按需实例或 Spot 实例，但不能在同一请求中启动两者。此外，当您使用 RunInstances 启动 Spot 实例时，您的 Spot 实例请求仅限于一个实例类型和一个可用区。此操作针对单个 Spot 容量池（一组具有相同实例类型和可用区的未使用实例）。如果 Spot 容量池没有足够的 Spot 实例容量来满足您的请求，则 RunInstances 调用将失败。

相比使用 RunInstances 启动 Spot 实例，我们建议您使用具有设为 `instant` 的 `type` 参数的 CreateFleet API，以获得以下益处：
+ **在一个请求中启动按需实例和 Spot 实例。**EC2 队列可以启动按需实例和/或 Spot 实例。如果具有可用的容量，并且您的请求的每小时最高价格超过 Spot 价格，则会满足竞价型实例请求。
+ **提高 Spot 实例的可用性。**通过使用类型为 `instant` 的 EC2 阶段，您可以根据 [Spot 最佳实践](spot-best-practices.md)启动 Spot 实例，获得以下益处：
  + **Spot 最佳实践：灵活地选择实例类型和可用区。**

    益处：通过指定多个实例类型和可用区，您可以增加 Spot 容量池的数量。这让 Spot 服务有更好的机会查找和分配所需的 Spot 计算容量。一条很好的经验法则是，对于每种工作负载，灵活地在至少 10 种实例类型之间进行选择，并确保所有可用区配置为在 VPC 中使用。
  + **竞价型实例最佳实践：使用 price-capacity-optimized 分配策略。**

    益处：`price-capacity-optimized` 分配策略可从可用性最佳的竞价型实例容量池中识别实例，然后在这些容量池中自动预置价格最低的实例。由于 Spot 实例容量来自于具有最佳容量的池，因此，这会降低在 Amazon EC2 需要回收容量时，将中断 Spot 实例的可能性。
+ **获得更广泛功能集的访问权限。**对于需要仅启动 API 的工作负载，并且您希望管理实例的生命周期，而不是让 EC2 队列为您进行管理，请使用类型为 `instant` 的 EC2 队列，而不是 [RunInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RunInstances.html) API。EC2 队列提供相比 RunInstances 更广泛的功能组，如以下示例所示。对于所有其他工作负载，您应该使用 Amazon EC2 Auto Scaling，因为它为各种工作负载（如 ELB 支持的应用程序、容器化工作负载和队列处理作业）提供了更全面的功能集。

您可以使用类型为 *instant* 的 EC2 实例集在容量块中启动实例。有关更多信息，请参阅 [教程：将 EC2 实例集配置为将实例启动到容量块中](ec2-fleet-launch-instances-capacity-blocks-walkthrough.md)。

Amazon EC2 Auto Scaling 和 Amazon EMR 等 AWS 服务使用类型为 *instant* 的 EC2 队列启动 EC2 实例。

## 类型为 instant 的 EC2 队列的先决条件
<a name="instant-fleet-prerequisites"></a>

有关创建 EC2 实例集的先决条件，请参阅 [EC2 实例集先决条件](ec2-fleet-prerequisites.md)。

## instant EC2 队列如何工作
<a name="how-instant-fleet-works"></a>

使用类型为 `instant` 的 EC2 队列时，事件序列如下所示：

1. **配置：**将 [CreateFleet](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateFleet.html) 请求类型配置为 `instant`。有关更多信息，请参阅 [创建 EC2 实例集](create-ec2-fleet.md)。请注意，在进行 API 调用之后，您无法修改它。

1. **请求：**当您进行 API 调用时，Amazon EC2 队列会针对所需容量发出同步一次性请求。

1. **响应：**API 响应列出已启动的实例，以及那些无法启动实例的错误。

1. **描述：**您可以描述 EC2 队列、列出与 EC2 队列关联的实例，以及查看 EC2 队列的历史记录。

1. **终止实例：**您可以随时终止实例。

1. **删除实例集请求：**可以手动或自动删除实例集请求：
   + 手动：您可以在实例启动后[删除实例集请求](delete-fleet.md)。

     请注意，不支持包含正在运行实例的已删除 `instant` 实例集。当您删除 `instant` 实例集时，Amazon EC2 会自动终止其所有实例。对于具有超过 1000 个实例的 实例集，删除请求可能会失败。如果您的实例集有超过 1000 个实例，请先手动终止大多数实例，留下 1000 个或更少的实例。然后删除实例集，剩余的实例将自动终止。
   + 自动：Amazon EC2 会在以下任一时间后删除实例集请求：
     + 所有实例均已终止。
     + 实例集未能启动任何实例。

## 示例
<a name="instant-fleet-examples"></a>

以下示例显示如何使用类型为 `instant` 的 EC2 队列，以获取不同使用案例。有关使用 EC2 CreateFleet API 参数的更多信息，请参阅 *Amazon EC2 API 引用*中的 [CreateFleet](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateFleet.html)。

**Topics**
+ [示例 1：使用容量优化的分配策略启动 Spot 实例](#instant-fleet-example-1)
+ [示例 2：使用容量优化分配策略启动单个 Spot 实例](#instant-fleet-example-2)
+ [示例 3：使用实例权重启动 Spot 实例](#instant-fleet-example-3)
+ [示例 4：在单个可用区内启动竞价型实例](#instant-fleet-example-4)
+ [示例 5：在单个可用区内启动单个实例类型的 Spot 实例](#instant-fleet-example-5)
+ [示例 6：仅当可以启动最小目标容量时才启动 Spot 实例](#instant-fleet-example-6)
+ [示例 7：仅当可在单个可用区中启动相同实例类型的最低目标容量时，才能启动 Spot 实例](#instant-fleet-example-7)
+ [示例 8：启动具有多个启动模板的实例](#instant-fleet-example-8)
+ [示例 9：启动基于按需实例的 Spot 实例](#instant-fleet-example-9)
+ [示例 10：基于使用容量预留和优先分配策略的按需实例，使用容量优化分配策略启动 Spot 实例](#instant-fleet-example-10)
+ [示例 11：使用容量优化优先级分配策略启动 Spot 实例](#instant-fleet-example-11)
+ [示例 12：指定 Systems Manager 参数而非 AMI ID](#instant-fleet-example-12)

### 示例 1：使用容量优化的分配策略启动 Spot 实例
<a name="instant-fleet-example-1"></a>

下面的示例指定了类型为 `instant` 的 EC2 队列中所需的参数：启动模板、目标容量、原定设置购买选项，并启动模板覆盖。
+ 启动模板由其启动模板名称和版本号标识。
+ 12 个启动模板覆盖指定了 4 个不同的实例类型和 3 个不同的子网，每个子网都位于单独的可用区中。每个实例类型和子网组合都定义了 Spot 容量池，从而生成 12 个 Spot 容量池。
+ 队列的目标容量为 20 个实例。
+ 原定设置购买选项为 `spot`，这会导致实例集尝试在 Spot 容量池中启动 20 个 Spot 实例，并为启动的实例数量提供最佳容量。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized"
    },
    "LaunchTemplateConfigs": [
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt1",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-49e41922"
            }
         ]
      }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 20,
        "DefaultTargetCapacityType": "spot"
    },
    "Type": "instant"
}
```

### 示例 2：使用容量优化分配策略启动单个 Spot 实例
<a name="instant-fleet-example-2"></a>

您可以通过进行类型为 `instant` 的多个 EC2 队列 API 调用，将 TotalTargetCapacity 设置为 1，以最佳方式一次启动一个 Spot 实例。

下面的示例指定了类型为 instant 的 EC2 队列中所需的参数：启动模板、目标容量、原定设置购买选项和启动模板覆盖。启动模板由其启动模板名称和版本号标识。12 个启动模板覆盖有 4 个不同的实例类型和 3 个不同的子网，每个子网位于单独的可用区域中。实例集的目标容量为 1 个实例，并且原定设置购买选项为 Spot，这导致实例集尝试根据容量优化分配策略，从 12 个 Spot 容量池之一启动 Spot 实例，从最可用的容量池启动 Spot 实例。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized"
    },
    "LaunchTemplateConfigs": [
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt1",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-49e41922"
            }
         ]
      }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 1,
        "DefaultTargetCapacityType": "spot"
    },
    "Type": "instant"
}
```

### 示例 3：使用实例权重启动 Spot 实例
<a name="instant-fleet-example-3"></a>

以下示例使用实例权重，这意味着价格是每单位小时价格，而不是每实例小时价格。假定一个工作负载单位需要 15 GB 内存和 4 个 vCPU，每个启动配置列出不同的实例类型和不同的权重，具体取决于实例上可以运行的工作负载单位数。例如，m5.xlarge（4 个 vCPU 和 16 GB 内存）可以运行 1 个单位且权重为 1，m5.2xlarge（8 个 vCPUs 和 32 GB 内存）可以运行 2 个单位，且权重为 2，依此类推。总目标容量设置为 40 个单位。原定设置购买选项为 Spot，并且分配策略为容量优化，这会导致 40 个 m5.xlarge（40 除以 1），20 个 m5.2xlarge（40 除以 2），10 个 m5.4xlarge（40 除以 4），5 个 m5.8xlarge（40 除以 8），或基于容量优化分配策略，权重相加达到所需容量的实例类型的混合。

有关更多信息，请参阅 [使用实例权重来管理 EC2 实例集或竞价型实例集的成本和性能](ec2-fleet-instance-weighting.md)。

```
{
   "SpotOptions":{
      "AllocationStrategy":"capacity-optimized"
   },
   "LaunchTemplateConfigs":[
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt1",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"m5.xlarge",
               "SubnetId":"subnet-fae8c380",
               "WeightedCapacity":1
            },
            {
               "InstanceType":"m5.xlarge",
               "SubnetId":"subnet-e7188bab",
               "WeightedCapacity":1
            },
            {
               "InstanceType":"m5.xlarge",
               "SubnetId":"subnet-49e41922",
               "WeightedCapacity":1
            },
            {
               "InstanceType":"m5.2xlarge",
               "SubnetId":"subnet-fae8c380",
               "WeightedCapacity":2
            },
            {
               "InstanceType":"m5.2xlarge",
               "SubnetId":"subnet-e7188bab",
               "WeightedCapacity":2
            },
            {
               "InstanceType":"m5.2xlarge",
               "SubnetId":"subnet-49e41922",
               "WeightedCapacity":2
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-fae8c380",
               "WeightedCapacity":4
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-e7188bab",
               "WeightedCapacity":4
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-49e41922",
               "WeightedCapacity":4
            },
            {
               "InstanceType":"m5.8xlarge",
               "SubnetId":"subnet-fae8c380",
               "WeightedCapacity":8
            },
            {
               "InstanceType":"m5.8xlarge",
               "SubnetId":"subnet-e7188bab",
               "WeightedCapacity":8
            },
            {
               "InstanceType":"m5.8xlarge",
               "SubnetId":"subnet-49e41922",
               "WeightedCapacity":8
            }
         ]
      }
   ],
   "TargetCapacitySpecification":{
      "TotalTargetCapacity":40,
      "DefaultTargetCapacityType":"spot"
   },
   "Type":"instant"
}
```

### 示例 4：在单个可用区内启动竞价型实例
<a name="instant-fleet-example-4"></a>

您可以通过将 Spot 选项 SingleAvailabilityZone 设置为 true（真），将实例集配置为启动单个可用区中的所有实例。

12 个启动模板覆盖具有不同的实例类型和子网（每个都位于单独的可用区），但权重容量相同。总目标容量为 20 个实例，原定设置购买选项为 Spot，并且 Spot 分配策略为容量优化。EC2 队列使用启动规范，从具有最佳容量的 Spot 容量池启动全部在单个可用区中的 20 个 Spot 实例。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized",
        "SingleAvailabilityZone": true
    },
    "LaunchTemplateConfigs": [
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt1",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-49e41922"
            }
         ]
      }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 20,
        "DefaultTargetCapacityType": "spot"
    },
    "Type": "instant"
}
```

### 示例 5：在单个可用区内启动单个实例类型的 Spot 实例
<a name="instant-fleet-example-5"></a>

您可以通过将 SpotOptions SingleInstanceType 和 SingleAvailabilityZone 设置为 true（真），将队列配置为启动单个可用区中相同实例类型的所有实例。

12 个启动模板覆盖具有不同的实例类型和子网（每个都位于单独的可用区），但权重容量相同。总目标容量为 20 个实例，原定设置购买选项为 Spot，Spot 分配策略为容量优化。EC2 队列使用启动规范，从具有最佳容量的 Spot 容量池启动全部在单个可用区中相同实例类型的 20 个 Spot 实例。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized",
        "SingleInstanceType": true,
        "SingleAvailabilityZone": true
    },
    "LaunchTemplateConfigs": [
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt1",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-49e41922"
            }
         ]
      }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 20,
        "DefaultTargetCapacityType": "spot"
    },
    "Type": "instant"
}
```

### 示例 6：仅当可以启动最小目标容量时才启动 Spot 实例
<a name="instant-fleet-example-6"></a>

只有通过将 Spot 选项 MinTargetCapacity 设置为要同时启动的最小目标容量，以启动最小目标容量，您才可以将队列配置为启动实例。

指定 MinTargetCapacity 时，必须至少指定下列参数中的一个：SingleInstanceType 或 SingleAvailabilityZone。此示例中指定的是 SingleInstanceType，因此所有这 20 个实例必须使用相同的实例类型。

12 个启动模板覆盖具有不同的实例类型和子网（每个都位于单独的可用区），但权重容量相同。总目标容量和最小目标容量均设置为 20 个实例，默认购买选项为竞价型，竞价型分配策略为容量优化。只有在能够同时启动所有 20 个实例时，EC2 队列才能使用启动模板覆盖，从具有最佳容量的 Spot 容量池启动 20 个 Spot 实例。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized",
        "SingleInstanceType": true,
        "MinTargetCapacity": 20
    },
    "LaunchTemplateConfigs": [
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt1",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-49e41922"
            }
         ]
      }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 20,
        "DefaultTargetCapacityType": "spot"
    },
    "Type": "instant"
}
```

### 示例 7：仅当可在单个可用区中启动相同实例类型的最低目标容量时，才能启动 Spot 实例
<a name="instant-fleet-example-7"></a>

只有通过将 Spot 选项 MinTargetCapacity，以及 SingleInstanceType 和 SingleAvailabilityZone 选项设置为要同时启动的最小目标容量，以在单个可用区中，以单个实例类型启动最小目标容量，您才可以将队列配置为启动实例。

覆盖启动模板的 12 个启动规范具有不同的实例类型和子网（每个都位于单独的可用区），但权重容量相同。总目标容量和最小目标容量均为 20 个实例，原定设置购买选项为 Spot，Spot 分配策略为容量优化，SingleInstanceType 和 SingleAvailabilityZone 均为 true（真）。只有在能够同时启动所有 20 个实例时，EC2 队列才能使用启动规范，从具有最佳容量的 Spot 容量池，启动全部在单个可用区中相同实例类型的 20 个 Spot 实例。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized",
        "SingleInstanceType": true,
        "SingleAvailabilityZone": true,
        "MinTargetCapacity": 20
    },
    "LaunchTemplateConfigs": [
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt1",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5d.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5.4xlarge",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5d.4xlarge",
               "SubnetId":"subnet-49e41922"
            }
         ]
      }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 20,
        "DefaultTargetCapacityType": "spot"
    },
    "Type": "instant"
}
```

### 示例 8：启动具有多个启动模板的实例
<a name="instant-fleet-example-8"></a>

您可以通过指定多个启动模板来配置队列，以便为不同的实例类型或一组实例类型启动具有不同启动规范的实例。在此示例中，我们希望为不同实例类型提供不同的 EBS 卷大小，并且我们已经在启动模板 ec2-fleet-lt-4xl、ec2-fleet-lt-9xl 和 ec2-fleet-lt-18xl 中进行配置。

在此示例中，我们根据大小为 3 种实例类型使用了 3 种不同启动模板。所有启动模板上的启动规范覆盖使用基于实例类型上 vCPU 的实例权重。总目标容量为 144 个单位，原定设置购买选项为 Spot，并且 Spot 分配策略为容量优化。EC2 队列可以使用启动模板 ec2-fleet-4xl 启动 9 个 c5n.4xlarge（144 除以 16），或者使用启动模板 ec2-fleet-9xl 启动 4 个 c5n.9xlarge（144 除以 36），或者使用启动模板 ec2-fleet-18xl 启动 2 个 c5n.18xlarge（144 除以 72），或基于容量优化分配策略，权重相加达到所需容量的实例类型的混合。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized"
    },
    "LaunchTemplateConfigs": [
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt-18xl",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5n.18xlarge",
               "SubnetId":"subnet-fae8c380",
               "WeightedCapacity":72
            },
            {
               "InstanceType":"c5n.18xlarge",
               "SubnetId":"subnet-e7188bab",
               "WeightedCapacity":72
            },
            {
               "InstanceType":"c5n.18xlarge",
               "SubnetId":"subnet-49e41922",
               "WeightedCapacity":72
            }
         ]
      },
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt-9xl",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5n.9xlarge",
               "SubnetId":"subnet-fae8c380",
               "WeightedCapacity":36
            },
            {
               "InstanceType":"c5n.9xlarge",
               "SubnetId":"subnet-e7188bab",
               "WeightedCapacity":36
            },
            {
               "InstanceType":"c5n.9xlarge",
               "SubnetId":"subnet-49e41922",
               "WeightedCapacity":36
            }
         ]
      },
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt-4xl",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5n.4xlarge",
               "SubnetId":"subnet-fae8c380",
               "WeightedCapacity":16
            },
            {
               "InstanceType":"c5n.4xlarge",
               "SubnetId":"subnet-e7188bab",
               "WeightedCapacity":16
            },
            {
               "InstanceType":"c5n.4xlarge",
               "SubnetId":"subnet-49e41922",
               "WeightedCapacity":16
            }
         ]
      }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 144,
        "DefaultTargetCapacityType": "spot"
    },
    "Type": "instant"
}
```

### 示例 9：启动基于按需实例的 Spot 实例
<a name="instant-fleet-example-9"></a>

下面的示例为队列指定 20 个实例的总目标容量和 5 个按需实例的目标容量。原定设置购买选项为 Spot。队列按照指定的方式启动 5 个按需实例，但需要再启动 15 个实例以满足总目标容量要求。差值购买选项的计算公式为 TotalTargetCapacity – OnDemandTargetCapacity = DefaultTargetCapacityType，这使得启动 15 个 Spot 实例的队列根据容量优化分配策略构成 12 个 Spot 容量池之一。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized"
    },
    "LaunchTemplateConfigs": [
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt1",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-49e41922"
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-fae8c380"
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-e7188bab"
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-49e41922"
            }
         ]
      }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 20,
        "OnDemandTargetCapacity": 5,
        "DefaultTargetCapacityType": "spot"
    },
    "Type": "instant"
}
```

### 示例 10：基于使用容量预留和优先分配策略的按需实例，使用容量优化分配策略启动 Spot 实例
<a name="instant-fleet-example-10"></a>

您可以通过将容量预留的使用策略配置为 use-capacity-reservations-first（首先使用容量预留），来将队列配置为在以原定设置目标容量类型作为 Spot 启动按需实例的基础时，首先使用按需容量预留。此外，如果多个实例池具有未使用的 容量预留，则应用选定的按需分配策略。在此示例中，按需分配策略为优先级。

在该示例中，有 6 个可用的未使用容量预留。此数目少于队列的 10 个按需实例的目标按需容量。

账户在 2 个池中有以下 6 个未使用的容量预留。每个池中的容量预留数由 AvailableInstanceCount 指示。

```
{
    "CapacityReservationId": "cr-111", 
    "InstanceType": "m5.large", 
    "InstancePlatform": "Linux/UNIX", 
    "AvailabilityZone": "us-east-1a", 
    "AvailableInstanceCount": 3, 
    "InstanceMatchCriteria": "open", 
    "State": "active"
}
 
{
    "CapacityReservationId": "cr-222", 
    "InstanceType": "c5.large", 
    "InstancePlatform": "Linux/UNIX", 
    "AvailabilityZone": "us-east-1a", 
    "AvailableInstanceCount": 3, 
    "InstanceMatchCriteria": "open", 
    "State": "active"
}
```

以下队列配置仅显示该示例的相关配置。按需分配策略为优先级，容量预留的使用策略为 use-capacity-reservations-first（首先使用容量预留）。Spot 分配策略为容量优化。总目标容量为 20，按需目标容量为 10，原定设置目标容量类型为 Spot。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized"
    },
    "OnDemandOptions":{
       "CapacityReservationOptions": {
         "UsageStrategy": "use-capacity-reservations-first"
       },
       "AllocationStrategy":"prioritized"
    },
    "LaunchTemplateConfigs": [
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt1",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-fae8c380",
               "Priority": 1.0
            },
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-e7188bab",
               "Priority": 2.0
            },
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-49e41922",
               "Priority": 3.0
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-fae8c380",
               "Priority": 4.0
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-e7188bab",
               "Priority": 5.0
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-49e41922",
               "Priority": 6.0
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-fae8c380",
               "Priority": 7.0
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-e7188bab",
               "Priority": 8.0
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-49e41922",
               "Priority": 9.0
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-fae8c380",
               "Priority": 10.0
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-e7188bab",
               "Priority": 11.0
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-49e41922",
               "Priority": 12.0
            }
         ]
      }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 20,
        "OnDemandTargetCapacity": 10,
        "DefaultTargetCapacityType": "spot"
    },
    "Type": "instant"
}
```

在使用上述配置创建 instant 队列后，将启动下面的 20 个实例来满足目标容量：
+ us-east-1a 中的 7 个 c5.large 按需实例 – us-east-1a 中的 c5.large 的优先级第一，并且有 3 个可用的未使用 c5.large 容量预留。首先使用容量预留启动 3 个按需实例，并根据按需分配策略（此示例中为优先级）启动另 4 个按需实例。
+ us-east-1a 中的 3 个 m5.large 按需型实例：us-east-1a 中的 m5.large 实例优先级第二，并且有 3 个未使用的 m5.large 容量预留可用。
+ 来自 12 个 Spot 容量池之一的 10 个 Spot 实例，该容量池根据容量优化的分配策略具有最佳容量。

在启动队列后，您可以运行 [describe-capacity-reservations](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservations.html) 来查看保留的未使用的 容量预留 的数目。在此示例中，您该看到以下响应，该响应指示已使用所有 c5.large 和 m5.large 容量预留。

```
{
    "CapacityReservationId": "cr-111",
    "InstanceType": "m5.large",  
    "AvailableInstanceCount": 0
}
 
{
    "CapacityReservationId": "cr-222",
    "InstanceType": "c5.large", 
    "AvailableInstanceCount": 0
}
```

### 示例 11：使用容量优化优先级分配策略启动 Spot 实例
<a name="instant-fleet-example-11"></a>

下面的示例指定了类型为 instant 的 EC2 队列中所需的参数：启动模板、目标容量、原定设置购买选项和启动模板覆盖。启动模板由其启动模板名称和版本号标识。覆盖启动模板的 12 个启动规范具有分配了优先级的 4 个不同的实例类型，以及 3 个不同的子网（每个都位于单独的可用区）。队列的目标容量是 20 个实例，原定设置购买选项为 Spot，这导致队列尝试根据容量优化优先级的分配策略，从 12 个 Spot 容量池之一启动 20 个 Spot 实例，该策略会尽最大努力实施优先级，但首先会针对容量进行优化。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized-prioritized"
    },
    "LaunchTemplateConfigs": [
      {
         "LaunchTemplateSpecification":{
            "LaunchTemplateName":"ec2-fleet-lt1",
            "Version":"$Latest"
         },
         "Overrides":[
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-fae8c380",
               "Priority": 1.0
            },
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-e7188bab",
               "Priority": 1.0
            },
            {
               "InstanceType":"c5.large",
               "SubnetId":"subnet-49e41922",
               "Priority": 1.0
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-fae8c380",
               "Priority": 2.0
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-e7188bab",
               "Priority": 2.0
            },
            {
               "InstanceType":"c5d.large",
               "SubnetId":"subnet-49e41922",
               "Priority": 2.0
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-fae8c380",
               "Priority": 3.0
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-e7188bab",
               "Priority": 3.0
            },
            {
               "InstanceType":"m5.large",
               "SubnetId":"subnet-49e41922",
               "Priority": 3.0
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-fae8c380",
               "Priority": 4.0
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-e7188bab",
               "Priority": 4.0
            },
            {
               "InstanceType":"m5d.large",
               "SubnetId":"subnet-49e41922",
               "Priority": 4.0
            }
         ]
      }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 20,
        "DefaultTargetCapacityType": "spot"
    },
    "Type": "instant"
}
```

### 示例 12：指定 Systems Manager 参数而非 AMI ID
<a name="instant-fleet-example-12"></a>

以下示例使用启动模板来指定实例集中实例的配置。在本示例中，不是为 `ImageId` 指定 AMI ID，而是使用 System Manager 参数来引用 AMI。在实例启动时，Systems Manager 参数会解析为 AMI ID。

在本示例中，Systems Manager 参数以有效格式指定：`resolve:ssm:golden-ami`。Systems Manager 参数也有其他有效格式。有关更多信息，请参阅 [使用 Systems Manager 参数而非 AMI ID](create-launch-template.md#use-an-ssm-parameter-instead-of-an-ami-id)。

**注意**  
队列类型必须为类型 `instant`。其他实例集类型不支持指定 Systems Manager 参数来代替 AMI ID。

```
{
    "LaunchTemplateData": {
        "ImageId": "resolve:ssm:golden-ami",
        "InstanceType": "{{m5.4xlarge}}",
        "TagSpecifications": [{
            "ResourceType": "instance",
            "Tags": [{
                "Key": "{{Name}}",
                "Value": "{{webserver}}"
            }]
        }]
    }
}
```


# EC2 实例集 CLI 配置示例
<a name="ec2-fleet-examples"></a>

要创建实例集，请在 JSON 文件中定义 EC2 实例集配置，然后使用 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令引用该文件，如下所示：

```
aws ec2 create-fleet --cli-input-json file://{{file_name.json}}
```

以下示例说明了各种 EC2 实例集用例的启动配置。有关配置参数的更多信息，请参阅 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html)。

**Topics**
+ [示例 1：启动竞价型实例作为默认购买选项](#ec2-fleet-config1)
+ [示例 2：启动按需型实例作为默认购买选项](#ec2-fleet-config2)
+ [示例 3：启动按需型实例作为主容量](#ec2-fleet-config3)
+ [示例 4：使用多个容量保留按需启动实例](#ec2-fleet-config5)
+ [示例 5：当总目标容量大于未使用的容量预留数量时，使用容量预留启动按需实例](#ec2-fleet-config6)
+ [示例 6：使用容量预留启动按需实例](#ec2-fleet-config7)
+ [示例 7：配置容量再平衡以启动替换竞价型实例](#ec2-fleet-config8)
+ [示例 8：在容量优化的队列中启动竞价型实例](#ec2-fleet-config9)
+ [示例 9：在具有优先级的容量优化队列中启动竞价型实例](#ec2-fleet-config10)
+ [示例 10：在价格容量优化的实例集中启动竞价型实例](#ec2-fleet-config11)
+ [示例 11：配置基于属性的实例类型选择](#ec2-fleet-config12)
+ [示例 12：使用容量预留资源组将实例启动到多个容量预留类型中](#ec2-fleet-config13)

有关 `instant` 类型实例集的更多 CLI 示例，请参阅[配置 instant 类型的 EC2 实例集](instant-fleet.md)。

## 示例 1：启动竞价型实例作为默认购买选项
<a name="ec2-fleet-config1"></a>

下面的示例指定了 EC2 队列中所需的最少参数：启动模板、目标容量和默认购买选项。启动模板由其启动模板 ID 和版本号标识。队列的目标容量为 2 个实例，默认购买选项为 `spot`，因此队列启动两个竞价型实例。

```
{
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateId": "lt-0e8c754449b27161c",
                "Version": "1"
            }

        }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 2,
        "DefaultTargetCapacityType": "spot"
    }
}
```

## 示例 2：启动按需型实例作为默认购买选项
<a name="ec2-fleet-config2"></a>

下面的示例指定了 EC2 队列中所需的最少参数：启动模板、目标容量和默认购买选项。启动模板由其启动模板 ID 和版本号标识。队列的目标容量为 2 个实例，默认购买选项为 `on-demand`，因此队列启动两个 按需型实例。

```
{
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateId": "lt-0e8c754449b27161c",
                "Version": "1"
            }

        }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 2,
        "DefaultTargetCapacityType": "on-demand"
    }
}
```

## 示例 3：启动按需型实例作为主容量
<a name="ec2-fleet-config3"></a>

下面的示例为队列指定 2 个实例的总目标容量和 1 个按需实例的目标容量。默认购买选项为 `spot`。队列按照指定的方式启动 1 个按需型实例，但需要再启动一个实例以满足总目标容量要求。差值的购买选项是通过 `TotalTargetCapacity` – `OnDemandTargetCapacity` = `DefaultTargetCapacityType` 计算得出，因而实例集会启动 1 个竞价型实例。

```
{
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateId": "lt-0e8c754449b27161c",
                "Version": "1"
            }

        }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 2,
        "OnDemandTargetCapacity": 1,
        "DefaultTargetCapacityType": "spot"
    }
}
```

## 示例 4：使用多个容量保留按需启动实例
<a name="ec2-fleet-config5"></a>

可以通过将 容量预留 的使用策略配置为 `use-capacity-reservations-first` 来将队列配置为在启动 按需型实例 时首先使用 按需容量预留。此示例演示了当容量预留数量超过满足目标容量所需的容量预留数量时，队列如何选择要使用的容量预留。

队列配置如下所示：
+ 目标容量：12 个按需实例
+ 未使用的容量预留总数：15（超过了队列的 12 个按需实例的目标容量）
+ 容量预留池数量：3 (`m5.large`、`m4.xlarge` 和 `m4.2xlarge`）
+ 每个池的容量预留数量：5
+ 按需分配策略：`lowest-price`（当多个实例池中存在多个未使用的容量预留时，队列将根据按需分配策略确定启动按需实例的池。）

  请注意，您也可以使用 `prioritized` 分配策略而不是 `lowest-price` 分配策略。

**容量预留**

账户在 3 个不同的池中有以下 15 个未使用的 容量预留。每个池中的 容量预留 数由 `AvailableInstanceCount` 指示。

```
{
    "CapacityReservationId": "cr-111", 
    "InstanceType": "m5.large", 
    "InstancePlatform": "Linux/UNIX", 
    "AvailabilityZone": "us-east-1a", 
    "AvailableInstanceCount": 5, 
    "InstanceMatchCriteria": "open", 
    "State": "active"
}

{
    "CapacityReservationId": "cr-222", 
    "InstanceType": "m4.xlarge", 
    "InstancePlatform": "Linux/UNIX", 
    "AvailabilityZone": "us-east-1a", 
    "AvailableInstanceCount": 5, 
    "InstanceMatchCriteria": "open", 
    "State": "active"
}

{
    "CapacityReservationId": "cr-333", 
    "InstanceType": "m4.2xlarge", 
    "InstancePlatform": "Linux/UNIX", 
    "AvailabilityZone": "us-east-1a", 
    "AvailableInstanceCount":5, 
    "InstanceMatchCriteria": "open", 
    "State": "active"
}
```

**队列配置**

以下队列配置仅显示该示例的相关配置。总目标容量为 12，而默认目标容量类型为 `on-demand`。按需分配策略为 `lowest-price`。容量预留的使用策略是 `use-capacity-reservations-first`。

在此示例中，个按需型实例 价格为：
+ `m5.large` – 每小时 0.096 美元
+ `m4.xlarge` – 每小时 0.20 美元
+ `m4.2xlarge` – 每小时 0.40 美元

**注意**  
队列类型必须为类型 `instant`。其他队列类型不支持 `use-capacity-reservations-first`。

```
{
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateId": "lt-abc1234567example",
                "Version": "1"
            },
            "Overrides": [
                {
                  "InstanceType": "m5.large",
                  "AvailabilityZone": "us-east-1a",
                  "WeightedCapacity": 1
                },
                {
                  "InstanceType": "m4.xlarge",
                  "AvailabilityZone": "us-east-1a",
                  "WeightedCapacity": 1
                },
                {
                  "InstanceType": "m4.2xlarge",
                  "AvailabilityZone": "us-east-1a",
                  "WeightedCapacity": 1
                }
              ]

        }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 12,
        "DefaultTargetCapacityType": "on-demand"
    },
    "OnDemandOptions": {
        "AllocationStrategy": "lowest-price",
        "CapacityReservationOptions": {
            "UsageStrategy": "use-capacity-reservations-first"
        }
    },
    "Type": "instant"
}
```

在使用上述配置创建 `instant` 队列后，将启动下面的 12 个实例来满足目标容量：
+ `us-east-1a` 中的 5 个 `m5.large` 按需实例–`us-east-1a` 中的 `m5.large` 是最低的价格,并且有 5 个可用的未使用 `m5.large` 容量预留
+ us-east-1a 中的 5 个 `m4.xlarge` 按需实例 – `us-east-1a` 中的 `m4.xlarge` 是第二低的价格，并且有 5 个可用的未使用 `m4.xlarge` 容量预留
+ us-east-1a 中的 2 个 `m4.2xlarge` 按需实例 – `us-east-1a` 中的 `m4.2xlarge` 是第三低的价格，并且有 5 个可用的未使用 `m4.2xlarge` 容量预留，只需其中的 2 个即可满足目标容量

在启动队列后，您可以运行 [describe-capacity-reservations](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservations.html) 来查看保留的未使用的 容量预留 的数目。在此示例中，您该看到以下响应，该响应指示已使用所有 `m5.large` 和 `m4.xlarge` 容量预留，有 3 个 `m4.2xlarge` 容量预留未使用。

```
{
    "CapacityReservationId": "cr-111",
    "InstanceType": "m5.large",  
    "AvailableInstanceCount": 0
}

{
    "CapacityReservationId": "cr-222",
    "InstanceType": "m4.xlarge", 
    "AvailableInstanceCount": 0
}

{
    "CapacityReservationId": "cr-333",
    "InstanceType": "m4.2xlarge", 
    "AvailableInstanceCount": 3
}
```

## 示例 5：当总目标容量大于未使用的容量预留数量时，使用容量预留启动按需实例
<a name="ec2-fleet-config6"></a>

可以通过将 容量预留 的使用策略配置为 `use-capacity-reservations-first` 来将队列配置为在启动 按需型实例 时首先使用 按需容量预留。此示例演示了当总目标容量超过可用未使用容量预留数时，队列如何选择要在其中启动按需实例的实例池。

在此示例中，队列配置如下所示：
+ 目标容量：16 个按需实例
+ 未使用的容量预留总数：15（少于队列的 16 个按需实例的目标容量）
+ 容量预留池数量：3 (`m5.large`、`m4.xlarge` 和 `m4.2xlarge`）
+ 每个池的容量预留数量：5
+ 按需分配策略：`lowest-price`（如果未使用的容量预留数少于按需目标容量，队列将根据按需分配策略确定启动剩余的按需容量的池。）

  请注意，您也可以使用 `prioritized` 分配策略而不是 `lowest-price` 分配策略。

**容量预留**

账户在 3 个不同的池中有以下 15 个未使用的 容量预留。每个池中的 容量预留 数由 `AvailableInstanceCount` 指示。

```
{
    "CapacityReservationId": "cr-111", 
    "InstanceType": "m5.large", 
    "InstancePlatform": "Linux/UNIX", 
    "AvailabilityZone": "us-east-1a", 
    "AvailableInstanceCount": 5, 
    "InstanceMatchCriteria": "open", 
    "State": "active"
}

{
    "CapacityReservationId": "cr-222", 
    "InstanceType": "m4.xlarge", 
    "InstancePlatform": "Linux/UNIX", 
    "AvailabilityZone": "us-east-1a", 
    "AvailableInstanceCount": 5, 
    "InstanceMatchCriteria": "open", 
    "State": "active"
}

{
    "CapacityReservationId": "cr-333", 
    "InstanceType": "m4.2xlarge", 
    "InstancePlatform": "Linux/UNIX", 
    "AvailabilityZone": "us-east-1a", 
    "AvailableInstanceCount":5, 
    "InstanceMatchCriteria": "open", 
    "State": "active"
}
```

**队列配置**



以下队列配置仅显示该示例的相关配置。总目标容量为 16，而默认目标容量类型为 `on-demand`。按需分配策略为 `lowest-price`。容量预留的使用策略是 `use-capacity-reservations-first`。

在此示例中，个按需型实例 价格为：
+ m5.large – 每小时 0.096 美元
+ m4.xlarge – 每小时 0.20 美元
+ m4.2xlarge – 每小时 0.40 美元

**注意**  
队列类型必须为 `instant`。其他队列类型不支持 `use-capacity-reservations-first`。

```
{
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateId": "lt-0e8c754449b27161c",
                "Version": "1"
            },
            "Overrides": [
                {
                  "InstanceType": "m5.large",
                  "AvailabilityZone": "us-east-1a",
                  "WeightedCapacity": 1
                },
                {
                  "InstanceType": "m4.xlarge",
                  "AvailabilityZone": "us-east-1a",
                  "WeightedCapacity": 1
                },
                {
                  "InstanceType": "m4.2xlarge",
                  "AvailabilityZone": "us-east-1a",
                  "WeightedCapacity": 1
                }
              ]

        }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 16,
        "DefaultTargetCapacityType": "on-demand"
    },
    "OnDemandOptions": {
        "AllocationStrategy": "lowest-price"
        "CapacityReservationOptions": {
            "UsageStrategy": "use-capacity-reservations-first"
        }
    },
    "Type": "instant",
}
```

在使用上述配置创建 `instant` 队列后，将启动下面的 16 个实例来满足目标容量：
+ `us-east-1a` 中的 6个 `m5.large` 按需实例–`us-east-1a` 中的 `m5.large` 是最低的价格, 并且有 5 个可用的未使用 `m5.large` 容量预留。容量预留首先用于启动 5 个按需实例。使用了剩余 `m4.xlarge` 和 `m4.2xlarge` 容量保留后，为了满足目标容量，将额外的按需实例启动到常规按需容量中（在本示例中为 `lowest-price`）。
+ `us-east-1a` 中的 5个 `m4.xlarge` 按需实例–`us-east-1a` 中的 `m4.xlarge` 是第二低的价格, 并且有 5 个可用的未使用 `m4.xlarge` 容量预留。
+ `us-east-1a` 中的 5个 `m4.2xlarge` 按需实例–`us-east-1a` 中的 `m4.2xlarge` 是第三低的价格, 并且有 5 个可用的未使用 `m4.2xlarge` 容量预留。

在启动队列后，您可以运行 [describe-capacity-reservations](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservations.html) 来查看保留的未使用的 容量预留 的数目。在此示例中，您应看到以下响应，该响应指示所有池中的所有 容量预留 均已使用。

```
{
    "CapacityReservationId": "cr-111",
    "InstanceType": "m5.large",  
    "AvailableInstanceCount": 0
}

{
    "CapacityReservationId": "cr-222",
    "InstanceType": "m4.xlarge", 
    "AvailableInstanceCount": 0
}

{
    "CapacityReservationId": "cr-333",
    "InstanceType": "m4.2xlarge", 
    "AvailableInstanceCount": 0
}
```

## 示例 6：使用容量预留启动按需实例
<a name="ec2-fleet-config7"></a>

通过将容量保留的使用策略设置为 `use-capacity-reservations-first`，您可以将震源组配置为在启动按需实例时首先使用 `targeted` 按需容量保留。此示例演示如何将按需实例启动到 `targeted` 容量预留，其中容量预留的属性相同，但其可用区域除外 (`us-east-1a` 和 `us-east-1b`)。它还演示了当总目标容量超过可用未使用容量预留数时，队列如何选择要在其中启动按需实例的实例池。

在此示例中，队列配置如下所示：
+ 目标容量：10 个按需实例
+ 未使用总数 `targeted` 容量预留：6（少于队列的 10 个按需实例的按需目标容量）
+ 容量预留池数量：2 (`us-east-1a` 和 `us-east-1b`）
+ 每个池的容量预留数量：3
+ 按需分配策略：`lowest-price`（如果未使用的容量预留数少于按需目标容量，队列将根据按需分配策略确定启动剩余的按需容量的池。）

  请注意，您也可以使用 `prioritized` 分配策略而不是 `lowest-price` 分配策略。

有关完成此示例所必须执行的过程的演练，请参阅 [教程：使用目标容量预留配置 EC2 实例集以启动按需型实例](ec2-fleet-launch-on-demand-instances-using-targeted-capacity-reservations-walkthrough.md)。

**容量预留**

账户在 2 个不同的池中有以下 6 个未使用的容量预留。在此示例中，池因其可用区而异。每个池中的 容量预留 数由 `AvailableInstanceCount` 指示。

```
{
    "CapacityReservationId": "cr-111", 
    "InstanceType": "c5.xlarge", 
    "InstancePlatform": "Linux/UNIX", 
    "AvailabilityZone": "us-east-1a", 
    "AvailableInstanceCount": 3, 
    "InstanceMatchCriteria": "open", 
    "State": "active"
}

{
    "CapacityReservationId": "cr-222", 
    "InstanceType": "c5.xlarge", 
    "InstancePlatform": "Linux/UNIX", 
    "AvailabilityZone": "us-east-1b", 
    "AvailableInstanceCount": 3, 
    "InstanceMatchCriteria": "open", 
    "State": "active"
}
```

**队列配置**

以下队列配置仅显示该示例的相关配置。总目标容量为 10，而默认目标容量类型为 `on-demand`。按需分配策略为 `lowest-price`。容量预留的使用策略是 `use-capacity-reservations-first`。

在此示例中，`us-east-1` 中 `c5.xlarge` 的按需实例价格为：每小时 0.17 美元

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
+ 为了满足目标容量，根据按需分配策略，将 4 个额外的按需实例启动到常规按需容量中（在本示例中为 `lowest-price`）。但是，由于池的价格相同（因为价格是每个区域而不是每个可用区），因此队列将在一个池中启动剩余的 4 个按需实例。

在启动队列后，您可以运行 [describe-capacity-reservations](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservations.html) 来查看保留的未使用的 容量预留 的数目。在此示例中，您应看到以下响应，该响应指示所有池中的所有 容量预留 均已使用。

```
{
    "CapacityReservationId": "cr-111",
    "InstanceType": "c5.xlarge",  
    "AvailableInstanceCount": 0
}

{
    "CapacityReservationId": "cr-222",
    "InstanceType": "c5.xlarge", 
    "AvailableInstanceCount": 0
}
```

## 示例 7：配置容量再平衡以启动替换竞价型实例
<a name="ec2-fleet-config8"></a>

下面的示例将 EC2 实例集配置为在 Amazon EC2 为队列中的竞价型实例发出再平衡建议时启动替换竞价型实例。要配置竞价型实例的自动替换，对于 `ReplacementStrategy`，请指定 `launch-before-terminate`。要配置从启动新替换竞价型实例到自动删除旧竞价型实例的时间延迟，请对于 `termination-delay`，请指定值（以秒为单位）。有关更多信息，请参阅 [配置选项](ec2-fleet-capacity-rebalance.md#ec2-fleet-capacity-rebalance-config-options)。

**注意**  
我们建议仅当您可以预测实例关闭过程完成所需的时长时才使用 `launch-before-terminate`，这样只有在这些过程完成后才会终止旧实例。在实例运行期间，您需要为它们付费。

容量再平衡策略的有效性取决于 EC2 队列 请求中指定的 Spot 容量池的数量。我们建议您使用一组多样化的实例类型和可用区配置队列，对于 `AllocationStrategy`，请指定 `capacity-optimized`。有关为容量再平衡配置 EC2 队列 时应考虑的内容的更多信息，请参阅[在 EC2 实例集和竞价型实例集中使用“容量再平衡”功能来替换存在风险的竞价型实例](ec2-fleet-capacity-rebalance.md)。

```
{
    "ExcessCapacityTerminationPolicy": "termination",
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateName": "LaunchTemplate",
                "Version": "1"
            },
                 "Overrides": [
                       {
                           "InstanceType": "c3.large",
                           "WeightedCapacity": 1,
                            "Placement": {
                               "AvailabilityZone": "us-east-1a"
                           }
                       },
                       {
                           "InstanceType": "c4.large",
                           "WeightedCapacity": 1,
                            "Placement": {
                               "AvailabilityZone": "us-east-1a"
                           }
                       },
                       {
                           "InstanceType": "c5.large",
                           "WeightedCapacity": 1,
                            "Placement": {
                               "AvailabilityZone": "us-east-1a"
                           }
                       }
                ] 
          }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 5,
        "DefaultTargetCapacityType": "spot"
    },
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized",
        "MaintenanceStrategies": {
            "CapacityRebalance": {
                "ReplacementStrategy": "launch-before-terminate",
                "TerminationDelay": "720"
            }
        }
    }
}
```

## 示例 8：在容量优化的队列中启动竞价型实例
<a name="ec2-fleet-config9"></a>

以下示例演示如何使用针对容量进行优化的 Spot 分配策略配置 EC2 队列。要优化容量，您必须将 `AllocationStrategy` 设置为 `capacity-optimized`。

在以下示例中，三个启动规范指定了三个 Spot 容量池。目标容量为 50 个竞价型实例。EC2 实例集尝试在 Spot 容量池中启动 50 个竞价型实例，并为启动的实例数量提供最佳容量。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized",
        },
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateName": "my-launch-template",
                "Version": "1"
            },
                 "Overrides": [
                       {
                           "InstanceType": "r4.2xlarge",
                           "Placement": {
                               "AvailabilityZone": "us-west-2a"
                           },
                      },
                       {
                           "InstanceType": "m4.2xlarge",
                           "Placement": {
                               "AvailabilityZone": "us-west-2b"
                           },
                       }, 
                       {
                           "InstanceType": "c5.2xlarge",
                           "Placement": {
                               "AvailabilityZone": "us-west-2b"
                           }
                       }
                 ] 
           }
    ],
    "TargetCapacitySpecification": {
            "TotalTargetCapacity": 50,
            "DefaultTargetCapacityType": "spot"

    }
}
```

## 示例 9：在具有优先级的容量优化队列中启动竞价型实例
<a name="ec2-fleet-config10"></a>

以下示例演示如何通过 Spot 分配策略配置 EC2 队列，该策略针对容量进行优化，同时尽最大努力使用优先级。

使用 `capacity-optimized-prioritized` 分配策略时，您可以使用 `Priority` 参数指定 Spot 容量池的优先级，数字越小优先级越高。如果您平等地支持多个 Spot 容量池，您还可以为它们设置相同的优先级。如果您没有为某个池设置优先级，则该池将在优先级方面被视为最后一个。

要设置 Spot 容量池的优先级，您必须将 `AllocationStrategy` 设置为 `capacity-optimized-prioritized`。EC2 队列首先会针对容量进行优化，但会尽最大努力遵循优先级。（例如，如果遵循优先级不会显著影响 EC2 队列预置最佳容量的能力）。对于必须最大限度地减少中断可能性，同时对某些实例类型的偏好也很重要的工作负载来说，这是一个不错的选择。

在以下示例中，三个启动规范指定了三个 Spot 容量池。对每个池进行优先级排序，数字越小优先级越高。目标容量为 50 个竞价型实例。EC2 实例集尝试以最高优先级在 Spot 容量池中启动 50 个竞价型实例，但首先针对容量进行优化。

```
{
    "SpotOptions": {
        "AllocationStrategy": "capacity-optimized-prioritized"
        },
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateName": "my-launch-template",
                "Version": "1"
            },
                 "Overrides": [
                        {
                           "InstanceType": "r4.2xlarge",    
                           "Priority": 1,
                           "Placement": {
                               "AvailabilityZone": "us-west-2a"
                           },
                      },
                       {
                           "InstanceType": "m4.2xlarge",
                           "Priority": 2,
                           "Placement": {
                               "AvailabilityZone": "us-west-2b"
                           },
                       }, 
                       {
                           "InstanceType": "c5.2xlarge",
                           "Priority": 3,
                           "Placement": {
                               "AvailabilityZone": "us-west-2b"
                           }
                       }
                  ] 
             }
    ],
    "TargetCapacitySpecification": {
            "TotalTargetCapacity": 50,
            "DefaultTargetCapacityType": "spot"
}
```

## 示例 10：在价格容量优化的实例集中启动竞价型实例
<a name="ec2-fleet-config11"></a>

以下示例演示了如何通过 Spot 分配策略配置 EC2 实例集，该策略针对容量和最低价格进行了优化。若要在考虑价格的同时优化容量，必须将 Spot `AllocationStrategy` 设置为 `price-capacity-optimized`。

在以下示例中，三个启动规范指定了三个 Spot 容量池。目标容量为 50 个竞价型实例。EC2 实例集尝试在 Spot 容量池中启动 50 个竞价型实例，并为启动的实例数量提供最佳容量，同时选择最低价格的池。

```
{
    "SpotOptions": {
        "AllocationStrategy": "price-capacity-optimized",
        "MinTargetCapacity": 2,
        "SingleInstanceType": true
    },
    "OnDemandOptions": {
        "AllocationStrategy": "lowest-price"
    },
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateName": "my-launch-template",
                "Version": "1"
            },
                 "Overrides": [
                       {
                           "InstanceType": "r4.2xlarge",
                           "Placement": {
                               "AvailabilityZone": "us-west-2a"
                           },
                      },
                       {
                           "InstanceType": "m4.2xlarge",
                           "Placement": {
                               "AvailabilityZone": "us-west-2b"
                           },
                       }, 
                       {
                           "InstanceType": "c5.2xlarge",
                           "Placement": {
                               "AvailabilityZone": "us-west-2b"
                           }
                       }
                 ] 
           }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 50,
        "OnDemandTargetCapacity":0,
        "SpotTargetCapacity":50,
        "DefaultTargetCapacityType": "spot"
    },
    "Type": "instant"
}
```

## 示例 11：配置基于属性的实例类型选择
<a name="ec2-fleet-config12"></a>

以下示例演示了如何配置 EC2 实例集，以使用基于属性的实例类型选择来识别实例类型。若要指定所需的实例属性，请在 `InstanceRequirements` 结构中指定属性。

在以下示例中，指定了 2 个实例属性：
+ `VCpuCount` – 至少指定了 2 个 vCPU。由于未指定最大值，因此没有最大限制。
+ `MemoryMiB` – 至少指定了 4 MiB 的内存。由于未指定最大值，因此没有最大限制。

将识别具有 2 个或更多 vCPU 和 4 MiB 或更大内存的任何实例类型。然而，当 [EC2 实例集预置实例集](ec2-fleet-attribute-based-instance-type-selection.md#how-ef-uses-abs)时，价格保护和分配策略可能会排除某些实例类型。

有关您可以指定的所有可能属性的列表和描述，请参阅 *Amazon EC2 API Reference*（《Amazon EC2 API 参考》）中的 [InstanceRequirements](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_InstanceRequirements.html)。

```
{
	"SpotOptions": {
		"AllocationStrategy": "{{price-capacity-optimized}}"
	},
	"LaunchTemplateConfigs": [{
		"LaunchTemplateSpecification": {
			"LaunchTemplateName": "{{my-launch-template}}",
			"Version": "{{1}}"
		},
		"Overrides": [{
			"InstanceRequirements": {
				"VCpuCount": {
					"Min": {{2}}
				},
				"MemoryMiB": {
					"Min": {{4}}
				}
			}
		}]
	}],
	"TargetCapacitySpecification": {
		"TotalTargetCapacity": {{20}},
		"DefaultTargetCapacityType": "{{spot}}"
	},
	"Type": "{{instant}}"
}
```

## 示例 12：使用容量预留资源组将实例启动到多个容量预留类型中
<a name="ec2-fleet-config13"></a>

以下示例将 `instant` EC2 Fleet 配置为使用单个容量预留资源组，在多个容量预留类型（按需容量预留、ML 容量块和可中断容量预留）中启动实例。您可以在 `ReservedCapacityOptions` 结构中指定这些首选项，并将 `DefaultTargetCapacityType` 设为 `reserved-capacity`。

在以下示例中：
+ `ReservationTypes`：含有待定位容量预留类型的有序列表。EC2 Fleet 按以下顺序处理各种类型：`on-demand-capacity-reservation`、`capacity-block`、`interruptible-capacity-reservation`。
+ `AllocationStrategy`：设置为 `prioritized`，以根据您的实例类型覆盖顺序，对各个容量预留类型中的实例类型进行优先级排序。
+ `ReservedCapacityFallbackOptions`：将 `MarketTypes` 设置为 `["on-demand"]`，因此对于预留容量无法满足的任何目标容量，实例集将启动按需型实例。如果忽略此选项，则在指定的容量预留类型耗尽之后，实例集将不会回退到任何其他市场类型。

启动模板以容量预留资源组为目标。使用 `ReservedCapacityOptions` 时，您无需在启动模板中设置 `MarketType`，EC2 Fleet 会自动为各个容量预留类型设置此选项。

```
{
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateName": "{{my-cr-resource-group-template}}",
                "Version": "{{1}}"
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

如需分步教程，请参阅[教程：将 EC2 Fleet 配置为使用容量预留资源组，将实例启动到多个容量预留类型中](ec2-fleet-launch-instances-multiple-cr-types-walkthrough.md)。
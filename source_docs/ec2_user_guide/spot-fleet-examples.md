

# 竞价型实例集 CLI 配置示例
<a name="spot-fleet-examples"></a>

要创建实例集，请在 JSON 文件中定义竞价型实例集配置，然后使用 [request-spot-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-fleet.html) AWS CLI 命令引用该文件，如下所示：

```
aws ec2 request-spot-fleet --spot-fleet-request-config file://{{file_name.json}}
```

以下示例说明了各种竞价型实例集用例的启动配置。有关配置参数的更多信息，请参阅 [request-spot-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-fleet.html)。有关创建竞价型实例集的更多信息，请参阅[创建竞价型实例集](create-spot-fleet.md)。

**注意**  
对于竞价型实例集，您无法在启动模板或启动规范中指定网络接口 ID。请务必要忽略启动模板或启动规范中的 `NetworkInterfaceID` 参数。

**Topics**
+ [示例 1：使用区域中价格最低的可用区启动竞价型实例](#fleet-config1)
+ [示例 2：使用列表中价格最低的可用区启动竞价型实例](#fleet-config2)
+ [示例 3：使用列表中价格最低的实例类型启动竞价型实例](#fleet-config3)
+ [示例 4。覆盖请求的价格](#fleet-config4)
+ [示例 5：使用多样化分配策略启动 Spot 队列](#fleet-config5)
+ [示例 6：使用实例权重启动 Spot 队列](#fleet-config6)
+ [示例 7：使用按需容量启动竞价型实例集](#fleet-config7)
+ [示例 8：配置容量再平衡以启动替换竞价型实例](#fleet-config8)
+ [示例 9：在容量优化的队列中启动竞价型实例](#fleet-config9)
+ [示例 10：在具有优先级的容量优化队列中启动竞价型实例](#fleet-config10)
+ [示例 11：在 priceCapacityOptimized 实例集中启动竞价型实例](#fleet-config11)
+ [示例 12：配置基于属性的实例类型选择](#fleet-config12)

## 示例 1：使用区域中价格最低的可用区启动竞价型实例
<a name="fleet-config1"></a>

以下示例指定一个没有可用区或子网的启动规范。Spot 队列会在具有默认子网且价格最低的可用区中启动实例。您支付的价格不得超过按需价格。

```
{
  "TargetCapacity": 20,
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "LaunchSpecifications": [
      {
          "ImageId": "ami-1a2b3c4d",
          "KeyName": "my-key-pair",
          "SecurityGroups": [
              {
                  "GroupId": "sg-1a2b3c4d"
              }
          ],
          "InstanceType": "m3.medium",
          "IamInstanceProfile": {
              "Arn": "arn:aws:iam::123456789012:instance-profile/my-iam-role"
          }
      }
  ]
}
```

## 示例 2：使用列表中价格最低的可用区启动竞价型实例
<a name="fleet-config2"></a>

以下示例指定具有的可用区或子网不同但实例类型和 AMI 相同的两种启动规范。

** – 可用区**

Spot 队列会在价格最低的指定可用区的默认子网中启动实例。

```
{
  "TargetCapacity": 20,
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "LaunchSpecifications": [
      {
          "ImageId": "ami-1a2b3c4d",
          "KeyName": "my-key-pair",
          "SecurityGroups": [
              {
                  "GroupId": "sg-1a2b3c4d"
              }
          ],
          "InstanceType": "m3.medium",
          "Placement": {
              "AvailabilityZone": "{{us-west-2a}}, {{us-west-2b}}"
          },
          "IamInstanceProfile": {
              "Arn": "arn:aws:iam::123456789012:instance-profile/my-iam-role"
          }
      }
  ]
}
```

**子网** – 

您可以指定默认子网或非默认子网，并且非默认子网可来自默认 VPC 或非默认 VPC。Spot 服务会在位于价格最低的可用区的子网中启动实例。

您无法在 Spot 队列请求中指定来自相同可用区的不同子网。

```
{
  "TargetCapacity": 20,
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "LaunchSpecifications": [
      {
          "ImageId": "ami-1a2b3c4d",
          "KeyName": "my-key-pair",
          "SecurityGroups": [
              {
                  "GroupId": "sg-1a2b3c4d"
              }
          ],
          "InstanceType": "m3.medium",
          "SubnetId": "{{subnet-a61dafcf}}, {{subnet-65ea5f08}}",
          "IamInstanceProfile": {
              "Arn": "arn:aws:iam::123456789012:instance-profile/my-iam-role"
          }
      }
  ]
}
```

如果在默认 VPC 中启动实例，则实例在默认情况下会收到一个公有 IPv4 地址。如果在非默认 VPC 中启动实例，则实例在默认情况下不会收到一个公有 IPv4 地址。在启动规范中使用网络接口来将一个公有 IPv4 地址分配给在非默认 VPC 中启动的实例。指定网络接口时，您必须包括使用网络接口的子网 ID 和安全组 ID。

```
  ...       
      {
          "ImageId": "ami-1a2b3c4d",
          "KeyName": "my-key-pair",
          "InstanceType": "m3.medium",
          "NetworkInterfaces": [
              {
                  "DeviceIndex": 0,
                  "SubnetId": "subnet-1a2b3c4d",
                  "Groups": [ "sg-1a2b3c4d" ],
                  "AssociatePublicIpAddress": true
              }
          ],
          "IamInstanceProfile": {
              "Arn": "arn:aws:iam::123456789012:instance-profile/my-iam-role"
          }
      }
  ...
```

## 示例 3：使用列表中价格最低的实例类型启动竞价型实例
<a name="fleet-config3"></a>

以下示例指定实例类型不同、但 AMI 和可用区或子网相同的两种启动配置。Spot 队列使用价格最低的指定实例类型启动实例。

**可用区**。

```
{
  "TargetCapacity": 20,
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "LaunchSpecifications": [
      {
          "ImageId": "ami-1a2b3c4d",
          "SecurityGroups": [
              {
                  "GroupId": "sg-1a2b3c4d"
              }
          ],
          "InstanceType": "{{c5.4xlarge}}",
          "Placement": {
            "AvailabilityZone": "us-west-2b"
          }
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "SecurityGroups": [
              {
                  "GroupId": "sg-1a2b3c4d"
              }
          ],
          "InstanceType": "{{r3.8xlarge}}",
          "Placement": {
              "AvailabilityZone": "us-west-2b"
          }
      }
  ]
}
```

**子网**：.

```
{
  "TargetCapacity": 20,
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "LaunchSpecifications": [
      {
          "ImageId": "ami-1a2b3c4d",
          "SecurityGroups": [
              {
                  "GroupId": "sg-1a2b3c4d"
              }
          ],
          "InstanceType": "{{c5.4xlarge}}",
          "SubnetId": "subnet-1a2b3c4d"
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "SecurityGroups": [
              {
                  "GroupId": "sg-1a2b3c4d"
              }
          ],
          "InstanceType": "{{r3.8xlarge}}",
          "SubnetId": "subnet-1a2b3c4d"
      }
  ]
}
```

## 示例 4。覆盖请求的价格
<a name="fleet-config4"></a>

我们建议您使用默认最高价 (这是按需价格)。如果愿意，您可以为队列请求以及各个启动规范指定最高价。

以下示例为队列请求以及两个启动规范 (共三个) 指定最高价。队列请求的最高价用于未指定最高价的任何启动规范。Spot 队列使用价格最低的实例类型启动实例。

**可用区**。

```
{
  "SpotPrice": "{{1.00}}",
  "TargetCapacity": 30,
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "LaunchSpecifications": [
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "c3.2xlarge",
          "Placement": {
              "AvailabilityZone": "us-west-2b"
          },
          "SpotPrice": "{{0.10}}"
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "c3.4xlarge",
          "Placement": {
              "AvailabilityZone": "us-west-2b"
          },
          "SpotPrice": "{{0.20}}"
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "c3.8xlarge",
          "Placement": {
              "AvailabilityZone": "us-west-2b"
          }
      }
    ]
}
```

**子网**：.

```
{
  "SpotPrice": "{{1.00}}",
  "TargetCapacity": 30,
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "LaunchSpecifications": [
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "c3.2xlarge",
          "SubnetId": "subnet-1a2b3c4d",
          "SpotPrice": "{{0.10}}"
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "c3.4xlarge",
          "SubnetId": "subnet-1a2b3c4d",
          "SpotPrice": "{{0.20}}"
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "c3.8xlarge",
          "SubnetId": "subnet-1a2b3c4d"
      }
  ]
}
```

## 示例 5：使用多样化分配策略启动 Spot 队列
<a name="fleet-config5"></a>

以下示例使用 `diversified` 分配策略。启动规范具有不同的实例类型，但具有相同的 AMI 和可用区或子网。Spot 队列在 3 个启动规范间分配 30 个实例，以便每种类型有 10 个实例。有关更多信息，请参阅 [使用分配策略确定 EC2 实例集或竞价型实例集如何满足竞价型和按需型容量](ec2-fleet-allocation-strategy.md)。

**可用区**。

```
{
  "SpotPrice": "0.70", 
  "TargetCapacity": 30,
  "AllocationStrategy": "{{diversified}}",
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "LaunchSpecifications": [
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "{{c4.2xlarge}}",
          "Placement": {
              "AvailabilityZone": "us-west-2b"
          }
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "{{m3.2xlarge}}",
          "Placement": {
              "AvailabilityZone": "us-west-2b"
          }
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "{{r3.2xlarge}}",
          "Placement": {
              "AvailabilityZone": "us-west-2b"
          }
      }
  ]
}
```

**子网**：.

```
{
    "SpotPrice": "0.70", 
    "TargetCapacity": 30,
    "AllocationStrategy": "{{diversified}}",
    "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
    "LaunchSpecifications": [
        {
            "ImageId": "ami-1a2b3c4d",
            "InstanceType": "{{c4.2xlarge}}",
            "SubnetId": "subnet-1a2b3c4d"
        },
        {
            "ImageId": "ami-1a2b3c4d",
            "InstanceType": "{{m3.2xlarge}}",
            "SubnetId": "subnet-1a2b3c4d"
        },
        {
            "ImageId": "ami-1a2b3c4d",
            "InstanceType": "{{r3.2xlarge}}",
            "SubnetId": "subnet-1a2b3c4d"
        }
    ]
}
```

在其中一个可用区中断的情况下，增加 EC2 容量可以满足 Spot 请求的几率的最佳实践是跨区域实现多样化。对于这种情况，请在启动规范中包含每个对您可用的可用区。并且，不是每次使用同一个子网，而是使用三个唯一的子网（每个子网映射到不同的区域）。

**可用区**。

```
{
  "SpotPrice": "0.70", 
  "TargetCapacity": 30,
  "AllocationStrategy": "{{diversified}}",
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "LaunchSpecifications": [
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "{{c4.2xlarge}}",
          "Placement": {
              "AvailabilityZone": "us-west-2a"
          }
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "{{m3.2xlarge}}",
          "Placement": {
              "AvailabilityZone": "us-west-2b"
          }
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "{{r3.2xlarge}}",
          "Placement": {
              "AvailabilityZone": "us-west-2c"
          }
      }
  ]
}
```

**子网**：.

```
{
    "SpotPrice": "0.70", 
    "TargetCapacity": 30,
    "AllocationStrategy": "{{diversified}}",
    "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
    "LaunchSpecifications": [
        {
            "ImageId": "ami-1a2b3c4d",
            "InstanceType": "{{c4.2xlarge}}",
            "SubnetId": "subnet-1a2b3c4d"
        },
        {
            "ImageId": "ami-1a2b3c4d",
            "InstanceType": "{{m3.2xlarge}}",
            "SubnetId": "subnet-2a2b3c4d"
        },
        {
            "ImageId": "ami-1a2b3c4d",
            "InstanceType": "{{r3.2xlarge}}",
            "SubnetId": "subnet-3a2b3c4d"
        }
    ]
}
```

## 示例 6：使用实例权重启动 Spot 队列
<a name="fleet-config6"></a>

以下示例使用实例权重，这意味着价格是每单位小时价格，而不是每实例小时价格。每个启动配置列出不同的实例类型和不同的权重。Spot 队列选择每单位小时价格最低的实例类型。竞价型实例集通过将目标容量除以实例权重，计算出要启动的竞价型实例数。如果结果不是整数，则 Spot 队列会将其向上舍入到下一个整数，以便队列的大小不低于其目标容量。

如果 `r3.2xlarge` 请求成功，Spot 将预置其中的 4 个实例。将 20 除以 6 可得到总共 3.33 个实例，然后向上舍入为 4 个实例。

如果 `c3.xlarge` 请求成功，Spot 将预置其中的 7 个实例。将 20 除以 3 可得到总共 6.66 个实例，然后向上舍入为 7 个实例。

有关更多信息，请参阅 [使用实例权重来管理 EC2 实例集或竞价型实例集的成本和性能](ec2-fleet-instance-weighting.md)。

**可用区**。

```
{
  "SpotPrice": "0.70",
  "TargetCapacity": 20,
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "LaunchSpecifications": [
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "r3.2xlarge",
          "Placement": {
              "AvailabilityZone": "us-west-2b"
          },
          "WeightedCapacity": {{6}}
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "c3.xlarge",
          "Placement": {
              "AvailabilityZone": "us-west-2b"
          },
          "WeightedCapacity": {{3}}
      }
    ]
}
```

**子网**：.

```
{
  "SpotPrice": "0.70",
  "TargetCapacity": 20,
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "LaunchSpecifications": [
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "r3.2xlarge",
          "SubnetId": "subnet-1a2b3c4d",
          "WeightedCapacity": {{6}}
      },
      {
          "ImageId": "ami-1a2b3c4d",
          "InstanceType": "c3.xlarge",
          "SubnetId": "subnet-1a2b3c4d",
          "WeightedCapacity": {{3}}
      }
  ]
}
```

## 示例 7：使用按需容量启动竞价型实例集
<a name="fleet-config7"></a>

为确保始终拥有实例容量，您可以在 Spot 队列请求中包含按需容量请求。如果具有容量，则将始终执行按需请求。目标容量的余量将在具有容量且可用的情况下作为 Spot 容量执行。

以下示例将所需的目标容量指定为 10，其中 5 个必须为按需容量。未指定 Spot 容量；它由目标容量减去按需容量的余量隐含指定。Amazon EC2 启动 5 个容量单位作为按需容量，并在有可用的 Amazon EC2 容量并且可用时，启动 5 个容量单位 (10-5=5) 作为 Spot 容量。

```
{
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "AllocationStrategy": "lowestPrice",
  "TargetCapacity": 10,
  "SpotPrice": null,
  "ValidFrom": "2018-04-04T15:58:13Z",
  "ValidUntil": "2019-04-04T15:58:13Z",
  "TerminateInstancesWithExpiration": true,
  "LaunchSpecifications": [],
  "Type": "maintain",
  "OnDemandTargetCapacity": 5,
  "LaunchTemplateConfigs": [
    {
      "LaunchTemplateSpecification": {
        "LaunchTemplateId": "lt-0dbb04d4a6cca5ad1",
        "Version": "2"
      },
      "Overrides": [
        {
          "InstanceType": "t2.medium",
          "WeightedCapacity": 1,
          "SubnetId": "subnet-d0dc51fb"
        }
      ]
    }
  ]
}
```

## 示例 8：配置容量再平衡以启动替换竞价型实例
<a name="fleet-config8"></a>

下面的示例将竞价型实例集配置为在 Amazon EC2 为队列中的竞价型实例发出再平衡建议时启动替换竞价型实例。要配置竞价型实例的自动替换，对于 `ReplacementStrategy`，请指定 `launch-before-terminate`。要配置从启动新替换竞价型实例到自动删除旧竞价型实例的时间延迟，请对于 `termination-delay`，请指定值（以秒为单位）。有关更多信息，请参阅 [配置选项](ec2-fleet-capacity-rebalance.md#ec2-fleet-capacity-rebalance-config-options)。

**注意**  
我们建议仅当您可以预测实例关闭过程完成所需的时长时才使用 `launch-before-terminate`。这将确保只有在关闭过程完成后才终止旧实例。在实例运行期间，您需要为它们付费。

容量再平衡策略的有效性取决于 Spot 队列请求中指定的 Spot 容量池的数量。我们建议您使用一组多样化的实例类型和可用区配置队列，对于 `AllocationStrategy`，请指定 `capacityOptimized`。有关为容量再平衡配置竞价型实例集时应考虑的内容的更多信息，请参阅 [在 EC2 实例集和竞价型实例集中使用“容量再平衡”功能来替换存在风险的竞价型实例](ec2-fleet-capacity-rebalance.md)。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "capacityOptimized",
        "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
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
        "TargetCapacity": 5,
        "SpotMaintenanceStrategies": {
            "CapacityRebalance": {
                "ReplacementStrategy": "launch-before-terminate",
                "TerminationDelay": "720"
            }
        }
    }
}
```

## 示例 9：在容量优化的队列中启动竞价型实例
<a name="fleet-config9"></a>

以下示例演示如何使用针对容量进行优化的 Spot 分配策略配置 Spot 队列。要优化容量，您必须将 `AllocationStrategy` 设置为 `capacityOptimized`。

在以下示例中，三个启动规范指定了三个 Spot 容量池。目标容量为 50 个竞价型实例。竞价型实例集尝试在 Spot 容量池中启动 50 个竞价型实例，并为启动的实例数量提供最佳容量。

```
{
    "TargetCapacity": "50",
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "capacityOptimized",
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
                    "AvailabilityZone": "us-west-2a"
                },
                {
                    "InstanceType": "m4.2xlarge",
                    "AvailabilityZone": "us-west-2b"
                }, 
                {
                    "InstanceType": "c5.2xlarge",
                    "AvailabilityZone": "us-west-2b"
                }
            ] 
        }
    ]
}
```

## 示例 10：在具有优先级的容量优化队列中启动竞价型实例
<a name="fleet-config10"></a>

以下示例演示如何通过 Spot 分配策略配置 Spot 队列，该策略针对容量进行优化，同时尽最大努力使用优先级。

使用 `capacityOptimizedPrioritized` 分配策略时，您可以使用 `Priority` 参数指定 Spot 容量池的优先级，数字越小优先级越高。如果您平等地支持多个 Spot 容量池，您还可以为它们设置相同的优先级。如果您没有为某个池设置优先级，则该池将在优先级方面被视为最后一个。

要设置 Spot 容量池的优先级，您必须将 `AllocationStrategy` 设置为 `capacityOptimizedPrioritized`。Spot 队列首先会针对容量进行优化，但会尽最大努力遵循优先级。（例如，如果遵循优先级不会显著影响 Spot 队列预置最佳容量的能力）。对于必须最大限度地减少中断可能性，同时对某些实例类型的偏好也很重要的工作负载来说，这是一个不错的选择。

在以下示例中，三个启动规范指定了三个 Spot 容量池。对每个池进行优先级排序，数字越小优先级越高。目标容量为 50 个竞价型实例。竞价型实例集尝试以最高优先级在 Spot 容量池中启动 50 个竞价型实例，但首先针对容量进行优化。

```
{
    "TargetCapacity": "50",
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "capacityOptimizedPrioritized"
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
                    "AvailabilityZone": "us-west-2a"
                },
                {
                           "InstanceType": "m4.2xlarge",
                           "Priority": 2,
                           "AvailabilityZone": "us-west-2b"
                }, 
                {
                           "InstanceType": "c5.2xlarge",
                           "Priority": 3,
                           "AvailabilityZone": "us-west-2b"
                }
            ] 
        }
    ]
}
```

## 示例 11：在 priceCapacityOptimized 实例集中启动竞价型实例
<a name="fleet-config11"></a>

以下示例演示了如何通过 Spot 分配策略配置竞价型实例集，该策略针对容量和最低价格进行了优化。若要在考虑价格的同时优化容量，必须将 Spot `AllocationStrategy` 设置为 `priceCapacityOptimized`。

在以下示例中，三个启动规范指定了三个 Spot 容量池。目标容量为 50 个竞价型实例。竞价型实例集尝试在 Spot 容量池中启动 50 个竞价型实例，并为启动的实例数量提供最佳容量，同时选择最低价格的池。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "priceCapacityOptimized",
        "OnDemandAllocationStrategy": "lowestPrice",
        "ExcessCapacityTerminationPolicy": "default",
        "IamFleetRole": "arn:aws:iam::111111111111:role/aws-ec2-spot-fleet-tagging-role",
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateId": "lt-0123456789example",
                    "Version": "1"
                },
                "Overrides": [
                     {
                           "InstanceType": "r4.2xlarge",  
                           "AvailabilityZone": "us-west-2a"
                      },
                      {
                           "InstanceType": "m4.2xlarge",
                           "AvailabilityZone": "us-west-2b"
                      }, 
                      {
                           "InstanceType": "c5.2xlarge",
                           "AvailabilityZone": "us-west-2b"
                      }
                ]
            }
        ],
        "TargetCapacity": 50,
        "Type": "request"
    }
}
```

## 示例 12：配置基于属性的实例类型选择
<a name="fleet-config12"></a>

以下示例演示了如何配置竞价型实例集，以使用基于属性的实例类型选择来识别实例类型。若要指定所需的实例属性，请在 `InstanceRequirements` 结构中指定属性。

在以下示例中，指定了 2 个实例属性：
+ `VCpuCount` – 至少指定了 2 个 vCPU。由于未指定最大值，因此没有最大限制。
+ `MemoryMiB` – 至少指定了 4 MiB 的内存。由于未指定最大值，因此没有最大限制。

将识别具有 2 个或更多 vCPU 和 4 MiB 或更大内存的任何实例类型。然而，当[竞价型实例集预置实例集](ec2-fleet-attribute-based-instance-type-selection.md#how-ef-uses-abs)时，价格保护和分配策略可能会排除某些实例类型。

有关您可以指定的所有可能属性的列表和描述，请参阅 *Amazon EC2 API Reference*（《Amazon EC2 API 参考》）中的 [InstanceRequirements](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_InstanceRequirements.html)。

```
{
	"AllocationStrategy": "{{priceCapacityOptimized}}",
	"TargetCapacity": {{20}},
	"Type": "{{request}}",
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
	}]
}
```
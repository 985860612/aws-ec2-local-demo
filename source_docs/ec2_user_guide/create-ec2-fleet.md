

# 创建 EC2 实例集
<a name="create-ec2-fleet"></a>

要创建 EC2 实例集，请在 JSON 文件中定义实例集配置，然后使用 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令引用该文件。在 JSON 文件中，您必须指定实例集的总目标容量、竞价型实例和按需型实例的单独目标容量，以及用于定义实例集中实例配置（例如 AMI、实例类型、子网、可用区、一个或多个安全组）的启动模板。您可以选择指定其他配置，例如用于覆盖启动模板配置的参数、从 EC2 容量池中选择竞价型实例和按需型实例的分配策略，以及愿意为实例集支付的最高金额。有关更多信息，请参阅 [EC2 实例集或竞价型实例集配置选项](ec2-fleet-configuration-strategies.md)。

EC2 实例集在有可用容量时启动按需型实例，在最高价超过竞价型实例价格并且有可用容量时启动竞价型实例。

如果实例集包含竞价型实例且类型为 `maintain`，Amazon EC2 会尝试在竞价型实例中断时维持实例集的目标容量。

## EC2 实例集限制
<a name="EC2-fleet-limitations"></a>

以下限制适用于 EC2 实例集。
+ EC2 实例集仅可通过 [Amazon EC2 API](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateFleet.html)、[AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html)、[AWS SDK](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateFleet.html#API_CreateFleet_SeeAlso) 和 [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ec2fleet.html) 创建。
+ EC2 实例集请求不能跨 AWS 区域。您需要为每个区域创建单独的 EC2 实例集。
+ EC2 实例集请求不能跨同一可用区内的不同子网。

## 创建 EC2 实例集
<a name="create-ec2-fleet-procedure"></a>

要使用 EC2 实例集启动实例的实例集，只需在实例集请求中指定以下参数，实例集会使用其他参数的默认值：
+ `LaunchTemplateId` 或 `LaunchTemplateName` – 指定要使用的启动模板（其中包含要启动的实例的参数，例如实例类型和可用区）
+ `TotalTargetCapacity` – 指定机群的总目标容量
+ `DefaultTargetCapacityType` – 指定默认购买选项是按需型还是竞价型

要覆盖启动模板中指定的参数，可指定一个或多个覆盖。每个覆盖可以有不同的实例类型、可用区、子网和最高价，并且可以包含不同的权重容量。除了指定实例类型外，还可以指定实例必须具有的属性，Amazon EC2 将使用这些属性标识所有实例类型。有关更多信息，请参阅 [指定 EC2 实例集或竞价型实例集的实例类型选择属性](ec2-fleet-attribute-based-instance-type-selection.md)。

对于类型为 `instant` 的 EC2 实例集，您还可以覆盖以下启动模板参数：
+ `IamInstanceProfile` – 定义要与此实例关联的 IAM 实例配置文件。有关更多信息，请参阅 [适用于 Amazon EC2 的 IAM 角色](iam-roles-for-amazon-ec2.md)。
+ `KeyName` – 用于实例的密钥对的名称。有关更多信息，请参阅 [Amazon EC2 密钥对和 Amazon EC2 实例](ec2-key-pairs.md)。
+ `MetadataOptions` – 实例的实例元数据服务配置。有关更多信息，请参阅 [使用实例元数据服务访问实例元数据](configuring-instance-metadata-service.md)。

对于 `instant` 类型的 EC2 实例集，可以指定 Systems Manager 参数而非 AMI ID。您可以在覆盖或启动模板中指定 Systems Manager 参数。有关更多信息，请参阅 [使用 Systems Manager 参数而非 AMI ID](create-launch-template.md#use-an-ssm-parameter-instead-of-an-ami-id)。

对于类型为 `instant` 的 EC2 实例集，您还可以使用 `LaunchTemplateSpecificationUserData` 参数在启动模板规范级别指定用户数据。使用此参数，您可以提供 base64 编码的用户数据，而无需将其包含在启动模板本身中。在 base64 编码之前，用户数据不得超过 16 KB。

在 JSON 文件中指定实例集参数。有关可以指定的所有可能参数的信息，请参阅[查看所有的 EC2 实例集配置选项](#ec2-fleet-cli-skeleton)。

有关实例集配置示例，请参阅 [EC2 实例集 CLI 配置示例](ec2-fleet-examples.md)。

目前没有控制台支持创建 EC2 Fleet。

**创建 EC2 实例集**  
使用 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令创建实例集，并指定包含实例集配置参数的 JSON 文件。

```
aws ec2 create-fleet --cli-input-json file://{{file_name.json}}
```

以下是 `request` 或 `maintain` 类型的实例集的示例输出。

```
{
    "FleetId": "fleet-12a34b55-67cd-8ef9-ba9b-9208dEXAMPLE"
}
```

以下是启动了目标容量的 `instant` 类型实例集的示例输出。

响应包括每组已启动实例的可用区 ID、可用区名称和子网 ID。

```
{
  "FleetId": "fleet-12a34b55-67cd-8ef9-ba9b-9208dEXAMPLE",
  "Errors": [],
  "Instances": [
    {
      "LaunchTemplateAndOverrides": {
        "LaunchTemplateSpecification": {
          "LaunchTemplateId": "lt-01234a567b8910abcEXAMPLE",
          "Version": "1"
        },
        "Overrides": {
          "InstanceType": "c5.large",
          "AvailabilityZone": "us-east-1a"
        }
      },
      "Lifecycle": "on-demand",
      "InstanceIds": [
        "i-1234567890abcdef0",
        "i-9876543210abcdef9" 
      ],
      "InstanceType": "c5.large",
      "Platform": null,
      "AvailabilityZoneId": "use1-az1",
      "AvailabilityZone": "us-east-1a",
      "SubnetId": "subnet-0123456789abcdefEXAMPLE"
    },
    {
      "LaunchTemplateAndOverrides": {
        "LaunchTemplateSpecification": {
          "LaunchTemplateId": "lt-01234a567b8910abcEXAMPLE",
          "Version": "1"
        },
        "Overrides": {
          "InstanceType": "c4.large",
          "AvailabilityZone": "us-east-1a"
        }
      },
      "Lifecycle": "on-demand",
      "InstanceIds": [
        "i-5678901234abcdef0",
        "i-5432109876abcdef9" 
      ],
      "AvailabilityZoneId": "use1-az1",
      "AvailabilityZone": "us-east-1a",
      "SubnetId": "subnet-0123456789abcdefEXAMPLE"
    }
  ]
}
```

以下是启动了部分目标容量并且出现“无法启动实例”错误的 `instant` 类型实例集的示例输出。

```
{
  "FleetId": "fleet-12a34b55-67cd-8ef9-ba9b-9208dEXAMPLE",
  "Errors": [
    {
      "LaunchTemplateAndOverrides": {
        "LaunchTemplateSpecification": {
          "LaunchTemplateId": "lt-01234a567b8910abcEXAMPLE",
          "Version": "1"
        },
        "Overrides": {
          "InstanceType": "c4.xlarge",
          "AvailabilityZone": "us-east-1a",
        }
      },
      "Lifecycle": "on-demand",
      "ErrorCode": "InsufficientInstanceCapacity",
      "ErrorMessage": ""
    },
  ],
  "Instances": [
    {
      "LaunchTemplateAndOverrides": {
        "LaunchTemplateSpecification": {
          "LaunchTemplateId": "lt-01234a567b8910abcEXAMPLE",
          "Version": "1"
        },
        "Overrides": {
          "InstanceType": "c5.large",
          "AvailabilityZone": "us-east-1a"
        }
      },
      "Lifecycle": "on-demand",
      "InstanceIds": [
        "i-1234567890abcdef0",
        "i-9876543210abcdef9" 
      ]
  ]
}
```

以下是未启动任何实例的 `instant` 类型实例集的示例输出。

```
{
  "FleetId": "fleet-12a34b55-67cd-8ef9-ba9b-9208dEXAMPLE",
  "Errors": [
    {
      "LaunchTemplateAndOverrides": {
        "LaunchTemplateSpecification": {
          "LaunchTemplateId": "lt-01234a567b8910abcEXAMPLE",
          "Version": "1"
        },
        "Overrides": {
          "InstanceType": "c4.xlarge",
          "AvailabilityZone": "us-east-1a",
        }
      },
      "Lifecycle": "on-demand",
      "ErrorCode": "InsufficientCapacity",
      "ErrorMessage": ""
    },
    {
      "LaunchTemplateAndOverrides": {
        "LaunchTemplateSpecification": {
          "LaunchTemplateId": "lt-01234a567b8910abcEXAMPLE",
          "Version": "1"
        },
        "Overrides": {
          "InstanceType": "c5.large",
          "AvailabilityZone": "us-east-1a",
        }
      },
      "Lifecycle": "on-demand",
      "ErrorCode": "InsufficientCapacity",
      "ErrorMessage": ""
    },
  ],
  "Instances": []
}
```

## 创建 EC2 实例集来替换运行状况不佳的竞价型实例
<a name="ec2-fleet-health-checks"></a>

EC2 实例集每 2 分钟检查一次实例集中实例的运行状况。实例的运行状况为 `healthy` 或 `unhealthy`。

EC2 实例集将使用 Amazon EC2 提供的状态检查来确定实例的运行状况。如果在连续三次运行状况检查中，实例状态检查或系统状态检查的状态有任一项为 `unhealthy`，则确定该实例的运行状况为 `impaired`。有关更多信息，请参阅[Amazon EC2 实例的状态检查](monitoring-system-instance-status-check.md)。

您可以配置您的实例集以替换运行状况不佳的竞价型实例。将 `ReplaceUnhealthyInstances` 设置为 `true` 以后，若竞价型实例报告为 `unhealthy` 则将其替换。在替换运行状况不佳的竞价型实例时，实例集可能在几分钟内降至其目标容量之下。

**要求**
+ 仅对保持目标容量的 EC2 实例集（类型 `maintain` 的实例集）支持运行状况检查替换，不支持类型为 `request` 或 `instant` 的实例集。
+ 仅对竞价型实例支持运行状况检查替换。对于 按需型实例 不支持此功能。
+ 您可以将 EC2 实例集配置为仅在您创建它时替换运行状况不佳的实例。
+ 用户仅在其有权调用 `ec2:DescribeInstanceStatus` 操作时才能使用运行状况检查替换。

**配置 EC2 实例集 以替换运行状况不佳的竞价型实例**

1. 使用[创建 EC2 实例集](#create-ec2-fleet-procedure)中用于创建 EC2 实例集的信息。

1. 要将实例集配置为替换运行状况不佳的竞价型实例，请在 JSON 文件中将 `ReplaceUnhealthyInstances` 指定 `true`。

## 查看所有的 EC2 实例集配置选项
<a name="ec2-fleet-cli-skeleton"></a>

要查看 EC2 机群配置参数的完整列表，可以生成 JSON 文件。有关每个参数的描述，请参阅 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html)。

**通过所有可能的 EC2 实例集参数生成 JSON 文件**  
使用 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) (AWS CLI) 命令和 `--generate-cli-skeleton` 参数生成 EC2 机群 JSON 文件，并将输出定向到某个文件以将其保存。

```
aws ec2 create-fleet \
    --generate-cli-skeleton input > {{ec2createfleet.json}}
```

下面是示例输出。

```
{
    "DryRun": true,
    "ClientToken": "",
    "SpotOptions": {
        "AllocationStrategy": "price-capacity-optimized",
        "MaintenanceStrategies": {
            "CapacityRebalance": {
                "ReplacementStrategy": "launch"
            }
        },
        "InstanceInterruptionBehavior": "hibernate",
        "InstancePoolsToUseCount": 0,
        "SingleInstanceType": true,
        "SingleAvailabilityZone": true,
        "MinTargetCapacity": 0,
        "MaxTotalPrice": ""
    },
    "OnDemandOptions": {
        "AllocationStrategy": "prioritized",
        "CapacityReservationOptions": {
            "UsageStrategy": "use-capacity-reservations-first"
        },
        "SingleInstanceType": true,
        "SingleAvailabilityZone": true,
        "MinTargetCapacity": 0,
        "MaxTotalPrice": ""
    },
    "ExcessCapacityTerminationPolicy": "termination",
    "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateId": "",
                "LaunchTemplateName": "",
                "Version": ""
            },
            "Overrides": [
                {
                    "InstanceType": "r5.metal",
                    "MaxPrice": "",
                    "SubnetId": "",
                    "AvailabilityZone": "",
                    "WeightedCapacity": 0.0,
                    "Priority": 0.0,
                    "Placement": {
                        "AvailabilityZone": "",
                        "Affinity": "",
                        "GroupName": "",
                        "PartitionNumber": 0,
                        "HostId": "",
                        "Tenancy": "dedicated",
                        "SpreadDomain": "",
                        "HostResourceGroupArn": ""
                    },
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 0
                        },
                        "MemoryMiB": {
                            "Min": 0,
                            "Max": 0
                        },
                        "CpuManufacturers": [
                            "amd"
                        ],
                        "MemoryGiBPerVCpu": {
                            "Min": 0.0,
                            "Max": 0.0
                        },
                        "ExcludedInstanceTypes": [
                            ""
                        ],
                        "InstanceGenerations": [
                            "previous"
                        ],
                        "SpotMaxPricePercentageOverLowestPrice": 0,
                        "OnDemandMaxPricePercentageOverLowestPrice": 0,
                        "BareMetal": "included",
                        "BurstablePerformance": "required",
                        "RequireHibernateSupport": true,
                        "NetworkInterfaceCount": {
                            "Min": 0,
                            "Max": 0
                        },
                        "LocalStorage": "excluded",
                        "LocalStorageTypes": [
                            "ssd"
                        ],
                        "TotalLocalStorageGB": {
                            "Min": 0.0,
                            "Max": 0.0
                        },
                        "BaselineEbsBandwidthMbps": {
                            "Min": 0,
                            "Max": 0
                        },
                        "AcceleratorTypes": [
                            "inference"
                        ],
                        "AcceleratorCount": {
                            "Min": 0,
                            "Max": 0
                        },
                        "AcceleratorManufacturers": [
                            "amd"
                        ],
                        "AcceleratorNames": [
                            "a100"
                        ],
                        "AcceleratorTotalMemoryMiB": {
                            "Min": 0,
                            "Max": 0
                        }
                    }
                }
            ]
        }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 0,
        "OnDemandTargetCapacity": 0,
        "SpotTargetCapacity": 0,
        "DefaultTargetCapacityType": "on-demand",
        "TargetCapacityUnitType": "memory-mib"
    },
    "TerminateInstancesWithExpiration": true,
    "Type": "instant",
    "ValidFrom": "1970-01-01T00:00:00",
    "ValidUntil": "1970-01-01T00:00:00",
    "ReplaceUnhealthyInstances": true,
    "TagSpecifications": [
        {
            "ResourceType": "fleet",
            "Tags": [
                {
                    "Key": "",
                    "Value": ""
                }
            ]
        }
    ],
    "Context": ""
}
```
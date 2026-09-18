

# 计算 Spot 置放分数
<a name="work-with-spot-placement-score"></a>

您可以根据目标容量和计算要求计算 Spot 置放分数。有关更多信息，请参阅 [竞价放置分数的工作原理](how-sps-works.md)。

**所需的权限**  
确保拥有所需的权限。有关更多信息，请参阅 [Spot 置放分数所需的权限](sps-iam-permission.md)。

**Topics**
+ [使用实例属性计算](#sps-specify-instance-attributes-console)
+ [使用实例类型计算](#sps-specify-instance-types-console)
+ [使用 AWS CLI 计算](#calculate-sps-cli)

**需要一种自动化的解决方案？** 无需按照本用户指南中的手动步骤操作，只需构建一个竞价置放分数跟踪器控制面板，自动捕获分数并将其存储在 Amazon CloudWatch 中即可。有关更多信息，请参阅[有关如何在 AWS 上构建竞价置放评分跟踪器控制面板的指南](https://aws.amazon.com/solutions/guidance/building-a-spot-placement-score-tracker-dashboard-on-aws/)。

**Local Zones**  
在使用 Amazon EC2 控制台时，要包含本地区域，账户必须至少启用一个本地区域。有关更多信息，请参阅《AWS Local Zones User Guide》**中的 [Getting started with AWS Local Zones](https://docs.aws.amazon.com/local-zones/latest/ug/getting-started.html)。

## 使用实例属性计算
<a name="sps-specify-instance-attributes-console"></a>

**如需通过指定实例属性来计算竞价放置分数**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择**请求竞价型实例**旁边的向下箭头，然后选择**计算竞价放置分数**。

1. 选择 **Enter requirements**（输入要求）。

1. 对于 **Target capacity**（目标容量），请根据 **instances**（实例）或 **vCPUs** (vCPU) 的数量或者根据 **memory (MiB)**（内存 (MiB)）的数量来输入所需的容量。

1. 对于 **Instance type requirements**（实例类型要求），如需指定您的计算要求并使 Amazon EC2 识别符合这些要求的最佳实例类型，请选择 **Specify instance attributes that match your compute requirements**（指定符合计算要求的实例属性）。

1. 对于 **vCPU**，输入所需的最小和最大 vCPU 数。要指定没有限制，请选择 **No minimum**（没有最小值）和/或 **No maximum**（没有最大值）。

1. 对于 **Memory (GiB)**（内存 (GiB)），输入所需的最小和最大内存量。要指定没有限制，请选择 **No minimum**（没有最小值）和/或 **No maximum**（没有最大值）。

1. 对于 **CPU architecture**（CPU 架构），选择所需的实例架构。

1. （可选）对于 **Additional instance attributes**（其它实例属性），您可以选择指定一个或多个属性以更详细地表达计算要求。每个额外属性都会进一步增加对您的请求的限制。您可以省略其它属性；如果省略，则使用默认值。有关每个属性及其默认值的描述，请参阅 [get-spot-placement-scores](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-spot-placement-scores.html)。

1. （可选）要查看具有指定属性的实例类型，请展开 **Preview matching instance types**（预览匹配的实例类型）。要排除在安置性评量中使用的实例类型，请选择实例，然后选择 **Exclude selected instance types**（排除选定的实例类型）。

1. 选择 **Load placement scores**（加载放置分数），并审查结果。

1. （可选）要显示特定区域的竞价放置分数，请对于 **Regions to evaluate**（要评估的区域），选择要评估的区域，然后选择 **Calculate placement scores**（计算放置分数）。

1. （可选）在**分数选项**下，选择**包括本地区域**。

1. （可选）要在显示的区域中显示可用区的 Spot 置放分数，请选择**提供每个可用区的置放分数**复选框。如果您希望在单个可用区中启动所有竞价容量，那么一个已评分的可用区列表会非常有帮助。

1. （可选）如需编辑计算要求并获得新的放置分数，请选择 **Edit**（编辑）以进行必要的调整，然后选择 **Calculate placement scores**（计算放置分数）。

## 使用实例类型计算
<a name="sps-specify-instance-types-console"></a>

**如需通过指定实例类型来计算竞价放置分数**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择**请求竞价型实例**旁边的向下箭头，然后选择**计算竞价放置分数**。

1. 选择 **Enter requirements**（输入要求）。

1. 对于 **Target capacity**（目标容量），请根据 **instances**（实例）或 **vCPUs** (vCPU) 的数量或者根据 **memory (MiB)**（内存 (MiB)）的数量来输入所需的容量。

1. 对于 **Instance type requirements**（实例类型要求），如需指定要使用的实例类型，请选择 **Manually select instance types**（手动选择实例类型）。

1. 选择 **Select instance types**（选择实例类型），选择要使用的实例类型，然后选择 **Select**（选择）。如需快速查找实例类型，您可以使用筛选条件来按不同属性筛选实例类型。

1. 选择 **Load placement scores**（加载放置分数），并审查结果。

1. （可选）要显示特定区域的竞价放置分数，请对于 **Regions to evaluate**（要评估的区域），选择要评估的区域，然后选择 **Calculate placement scores**（计算放置分数）。

1. （可选）在**分数选项**下，选择**包括本地区域**。

1. （可选）要在显示的区域中显示可用区的 Spot 置放分数，请选择**提供每个可用区的置放分数**复选框。如果您希望在单个可用区中启动所有竞价容量，那么一个已评分的可用区列表会非常有帮助。

1. （可选）如需编辑实例类型列表并获得新的放置分数，请选择 **Edit**（编辑）以进行必要的调整，然后选择 **Calculate placement scores**（计算放置分数）。

## 使用 AWS CLI 计算
<a name="calculate-sps-cli"></a>

**如需计算竞价放置分数**

1. （可选）如需生成所有可以指定为竞价放置分数配置参数，请使用 [get-spot-placement-scores](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-spot-placement-scores.html) 命令和 `--generate-cli-skeleton` 参数。

   ```
   aws ec2 get-spot-placement-scores \
       --region {{us-east-1}} \
       --generate-cli-skeleton
   ```

   下面是示例输出。

   ```
   {
       "InstanceTypes": [
           ""
       ],
       "TargetCapacity": 0,
       "TargetCapacityUnitType": "vcpu",
       "SingleAvailabilityZone": true,
       "RegionNames": [
           ""
       ],
       "InstanceRequirementsWithMetadata": {
           "ArchitectureTypes": [
               "x86_64_mac"
           ],
           "VirtualizationTypes": [
               "hvm"
           ],
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
               "BareMetal": "excluded",
               "BurstablePerformance": "excluded",
               "RequireHibernateSupport": true,
               "NetworkInterfaceCount": {
                   "Min": 0,
                   "Max": 0
               },
               "LocalStorage": "included",
               "LocalStorageTypes": [
                   "hdd"
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
                   "fpga"
               ],
               "AcceleratorCount": {
                   "Min": 0,
                   "Max": 0
               },
               "AcceleratorManufacturers": [
                   "amd"
               ],
               "AcceleratorNames": [
                   "vu9p"
               ],
               "AcceleratorTotalMemoryMiB": {
                   "Min": 0,
                   "Max": 0
               }
           }
       },
       "DryRun": true,
       "MaxResults": 0,
       "NextToken": "",
       "IncludeLocalZones": true
   }
   ```

1. 使用上一步的输出创建 JSON 配置文件，然后按如下方式进行配置：

   1. 对于 `TargetCapacity`（目标容量），请根据 instances（实例）或 vCPUs (vCPU) 的数量或者根据 memory (MiB)（内存 (MiB)）的数量来输入所需的容量。

   1. 对于 `TargetCapacityUnitType`，请输入目标容量的单位。如果省略此参数，则默认为 `units`。

      有效值：`units`（转换为实例数）\| `vcpu` \| `memory-mib`

   1. 对于 `SingleAvailabilityZone`（单个可用区），请指定 `true` 以获得返回已评分的可用区列表的响应。如果您希望在单个可用区中启动所有竞价容量，那么一个已评分的可用区列表会非常有帮助。如果省略此参数，则默认为 `false`，然后响应会返回一个已评分区域的列表。

   1. （可选）对于 `IncludeLocalZones`，请指定 `true` 以包括本地区域。对于区域分数，本地区域容量计入父区域。对于可用区分数，响应可以包括各个本地区域分数。如果省略或设置为 `false`，则本地区域将被忽略。

   1. （可选）对于 `RegionNames`，请指定要用作筛选条件的区域。此处必须指定区域代码，例如 `us-east-1`。

      使用区域筛选条件后，响应将仅返回您指定的区域。若将 `SingleAvailabilityZone` 指定为 `true`，则响应仅返回指定区域中的可用区。

   1. 配置中可以包括 `InstanceTypes`（实例类型）或 `InstanceRequirements`（实例要求），但两者不可同时包含于同一配置中。

      在 JSON 配置中指定以下之一：
      + 如需指定实例类型列表，请指定 `InstanceTypes` 参数中的实例类型。指定至少三种不同的实例类型。若只指定了一种或两种实例类型，则竞价放置分数将返回一个较低的分数。有关实例类型的列表，请参阅 [Amazon EC2 实例类型](https://aws.amazon.com/ec2/instance-types/)。
      + 如需指定实例属性以便 Amazon EC2 识别与这些属性匹配的实例类型，请指定位于 `InstanceRequirements`（实例要求）结构中的属性。

        必须提供 `VCpuCount`、`MemoryMiB` 和 `CpuManufacturers` 的值。您可以省略其它属性；如果省略，则使用默认值。有关每个属性及其默认值的描述，请参阅 [get-spot-placement-scores](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-spot-placement-scores.html)。

      有关示例配置，请参阅 [示例配置](#sps-example-configs)。

1. 若要获取您在 JSON 文件中指定的要求的竞价放置分数，请使用 [get-spot-placement-scores](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-spot-placement-scores.html) 命令，然后使用 `--cli-input-json` 参数为 JSON 文件指定名称和路径。

   ```
   aws ec2 get-spot-placement-scores \
       --region {{us-east-1}} \
       --cli-input-json file://{{file_name}}.json
   ```

   `SingleAvailabilityZone` 设置为 `false` 或省略（省略则默认为 `false`）时的输出示例：返回区域的评分列表。

   ```
   "SpotPlacementScores": [
       {
           "Region": "us-east-1",
           "Score": 7
       },
       {
           "Region": "us-west-1",
           "Score": 5
       },  
      ...
   ```

   `SingleAvailabilityZone` 设置为 `true` 时的输出示例：返回可用区的评分列表；`IncludeLocalZones` 为 `true` 时则返回本地区域的评分列表。

   ```
   "SpotPlacementScores": [
       {
           "Region": "us-east-1",
           "AvailabilityZoneId": "use1-az1",
           "Score": 8
       },
       {
           "Region": "us-east-1",
           "AvailabilityZoneId": "usw2-az3",
           "Score": 6
       },
      ...
   ```

### 示例配置
<a name="sps-example-configs"></a>

使用 AWS CLI，您可以使用以下示例配置。

**Topics**
+ [示例：指定实例类型和目标容量](#example-config-instance-type-override)
+ [示例：根据内存指定实例类型和目标容量](#example-config-instance-type-memory-unit-override)
+ [示例：为基于属性的实例类型选择指定属性](#example-config-attribute-based-instance-type-selection)
+ [示例：为基于属性的实例类型选择指定属性并返回可用区的评分列表](#example-config-sps-singleAZ)

#### 示例：指定实例类型和目标容量
<a name="example-config-instance-type-override"></a>

以下示例配置指定了三种不同的实例类型和 500 个竞价型实例的目标竞价容量。

```
{
    "InstanceTypes": [
        "m5.4xlarge",
        "r5.2xlarge",
        "m4.4xlarge"
    ], 
    "TargetCapacity": 500
}
```

#### 示例：根据内存指定实例类型和目标容量
<a name="example-config-instance-type-memory-unit-override"></a>

以下示例配置指定了三种不同的实例类型和 500000MiB 内存的目标竞价容量，其中要启动的竞价型实例数必须能够提供总计 500000MiB 的内存。

```
{
    "InstanceTypes": [
        "m5.4xlarge",
        "r5.2xlarge",
        "m4.4xlarge"
    ], 
    "TargetCapacity": 500000,
    "TargetCapacityUnitType": "memory-mib"
}
```

#### 示例：为基于属性的实例类型选择指定属性
<a name="example-config-attribute-based-instance-type-selection"></a>

以下示例配置是针对基于属性的实例类型选择而进行的配置，以及该示例配置的文本说明。

```
{
    "TargetCapacity": 5000,
    "TargetCapacityUnitType": "vcpu",
    "InstanceRequirementsWithMetadata": {
        "ArchitectureTypes": ["arm64"],
        "VirtualizationTypes": ["hvm"],
        "InstanceRequirements": {
            "VCpuCount": {
                "Min": 1,
                "Max": 12
            },
            "MemoryMiB": {
                "Min": 512
            }
        }
    }
}
```

****`InstanceRequirementsWithMetadata`****  
要使用基于属性的实例类型选择，您必须在配置中包括 `InstanceRequirementsWithMetadata` 结构，并为竞价型实例指定所需的属性。

在上述示例中，指定了以下必要实例属性：
+ `ArchitectureTypes` – 实例类型的架构类型必须为 `arm64`。
+ `VirtualizationTypes` – 实例类型的虚拟化类型必须为 `hvm`。
+ `VCpuCount` – 实例类型的 vCPU 数量必须最少为 1 个，最多为 12 个。
+ `MemoryMiB` – 实例类型的最小内存必须为 512MiB。若省略 `Max` 参数，则表示没有最大限制。

请注意，您可以指定其它几个可选属性。有关属性列表，请参阅 [get-spot-placement-scores](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-spot-placement-scores.html)。

**`TargetCapacityUnitType`**  
`TargetCapacityUnitType` 参数为目标容量指定单位。在该示例中，目标容量是 `5000`，目标容量单位类型是 `vcpu`，它们共同指定了所需的 5000 个 vCPU 目标容量，其中要启动的竞价型实例数必须能够提供总计 5000 个 vCPU。

#### 示例：为基于属性的实例类型选择指定属性并返回可用区的评分列表
<a name="example-config-sps-singleAZ"></a>

以下示例配置是针对基于属性的实例类型选择而进行的配置。若指定 `"SingleAvailabilityZone": true`，则响应将返回已评分的可用区列表。

```
{
    "TargetCapacity": 1000,
    "TargetCapacityUnitType": "vcpu",
    "SingleAvailabilityZone": true,
    "InstanceRequirementsWithMetadata": {
        "ArchitectureTypes": ["arm64"],
        "VirtualizationTypes": ["hvm"],
        "InstanceRequirements": {
            "VCpuCount": {
                "Min": 1,
                "Max": 12
            },
            "MemoryMiB": {
                "Min": 512
            }
        }
    }
}
```
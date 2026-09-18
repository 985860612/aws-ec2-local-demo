

# 指定 EC2 实例集或竞价型实例集的实例类型选择属性
<a name="ec2-fleet-attribute-based-instance-type-selection"></a>

创建 EC2 实例集或竞价型实例集时，必须指定一种或多种实例类型，以便配置实例集中的按需型实例和竞价型实例。除了手动指定实例类型外，还可以指定实例必须具有的属性，Amazon EC2 将使用这些属性标识所有实例类型。这称为*基于属性的实例类型选择*。例如，您可以指定实例所需的最小和最大 vCPU 数量，实例集将使用满足这些 vCPU 要求的任何可用实例类型启动实例。

基于属性的实例类型选择是工作负载和框架的理想选择，这些工作负载和框架可以灵活地确定所用的实例类型，例如在运行容器或 Web 机群、处理大数据以及实施持续集成和部署 (CI/CD) 工具等情况下。

**优点**：

基于属性的实例类型选择具有以下优势：
+ **轻松使用正确的实例类型** – 有如此多的实例类型可供使用，因此找到适用于您的工作负载的实例类型可能非常耗时。当您指定实例属性时，实例类型将自动具有工作负载所需的属性。
+ **简化配置** – 要为实例集手动指定多种实例类型，您必须为每种实例类型创建单独的启动模板覆盖。但是，借助基于属性的实例类型选择，要提供多种实例类型，您只需在启动模板或启动模板覆盖中指定实例属性即可。
+ **自动使用新实例类型** – 当您指定实例属性而不是实例类型时，您的实例集可以在新一代实例类型发布时使用这些实例类型，“满足未来”实例集配置的需求。
+ **实例类型灵活性** – 指定实例属性而不是实例类型时，实例集可以从各种实例类型中进行选择来启动竞价型实例，从而遵循[灵活选择竞价型实例类型的最佳实践](spot-best-practices.md#be-instance-type-flexible)。

**Topics**
+ [基于属性的实例类型选择的工作原理](#ec2fleet-abs-how-it-works)
+ [价格保护](#ec2fleet-abs-price-protection)
+ [性能保护](#ec2fleet-abis-performance-protection)
+ [注意事项](#ec2fleet-abs-considerations)
+ [通过基于属性的实例类型选择创建 EC2 机群](#abs-create-ec2-fleet)
+ [通过基于属性的实例类型选择创建竞价型实例集](#abs-create-spot-fleet)
+ [有效 EC2 实例集配置示例和无效 EC2 实例集配置示例](#ec2fleet-abs-example-configs)
+ [有效竞价型实例集配置示例和无效竞价型实例集配置示例](#spotfleet-abs-example-configs)
+ [预览具有指定属性的实例类型](#ec2fleet-get-instance-types-from-instance-requirements)

## 基于属性的实例类型选择的工作原理
<a name="ec2fleet-abs-how-it-works"></a>

要在机群配置中使用基于属性的实例类型选择，请将实例类型列表替换为实例所需的实例属性列表。EC2 实例集或竞价型实例集将在具有指定实例属性的任何可用实例类型上启动实例。

**Topics**
+ [实例属性的类型](#ef-abs-instance-attribute-types)
+ [在何处配置基于属性的实例类型选择](#ef-abs-where-to-configure)
+ [EC2 实例集或竞价型实例集如何在预置实例集时使用基于属性的实例类型选择](#how-ef-uses-abs)

### 实例属性的类型
<a name="ef-abs-instance-attribute-types"></a>

您可以指定多个实例属性来表达计算需求，例如：
+ **vCPU 数量** - 每个实例的最小和最大 vCPU 数量。
+ **内存** - 每个实例的最小和最大内存 GiB 数量。
+ **本地存储** - 是使用 EBS 还是实例存储卷作为本地存储。
+ **可突增性能** - 是否使用 T 实例系列（包括 T4g、T3a、T3 和 T2 类型）。

有关每个属性和默认值的描述，请参阅 *Amazon EC2 API 参考*中的 [InstanceRequirements](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_InstanceRequirements.html)。

### 在何处配置基于属性的实例类型选择
<a name="ef-abs-where-to-configure"></a>

根据您使用的是控制台还是 AWS CLI，可以按如下方式为基于属性的实例类型选择指定实例属性：

在控制台中，您可以在以下实例集配置组件中指定实例属性：
+ 在启动模板中，并在实例集请求中引用启动模板
+ （仅适用于竞价型实例集）在实例集请求中

在 AWS CLI 中，您可以在以下一个或全部机群配置组件中指定实例属性：
+ 在启动模板中，并在实例集请求中引用启动模板
+ 在启动模板覆盖中

  如果您想混合应用使用不同 AMI 的实例，则可以在多个启动模板覆盖中指定实例属性。例如，不同的实例类型可以使用 x86 和基于 ARM 的处理器。
+ （仅适用于竞价型实例集）在启动规范中

### EC2 实例集或竞价型实例集如何在预置实例集时使用基于属性的实例类型选择
<a name="how-ef-uses-abs"></a>

EC2 实例集或竞价型实例集通过以下方式预置实例集：
+ 标识具有指定属性的实例类型。
+ 使用价格保护来确定要排除的实例类型。
+ 根据具有匹配实例类型的 AWS 区域或可用区确定将从中启动实例的容量池。
+ 应用指定的分配策略来确定从中启动实例的容量池。

  请注意，基于属性的实例类型选择不会选择从中预置实例集的容量池；这是[分配策略](ec2-fleet-allocation-strategy.md)的任务。

  如果您指定分配策略，实例集将根据指定的分配策略启动实例。
  + 若为竞价型实例，基于属性的实例类型选择支持**价格容量优化**、**容量优化**和**最低价格**分配策略。请注意，不推荐使用**最低价格**竞价型分配策略，因为这对竞价型实例造成的中断风险最高。
  + 若为按需型实例，基于属性的实例类型选择支持**最低价格**分配策略。
+ 如果没有适用于具有指定实例属性的实例类型的容量，则无法启动任何实例，并且机群返回错误。

## 价格保护
<a name="ec2fleet-abs-price-protection"></a>

价格保护是一项功能，可以防止 EC2 实例集或竞价型实例集使用您认为成本过高的实例类型，即使它们恰好适合您指定的属性。要使用价格保护，您需要设置价格阈值。然后，当 Amazon EC2 选择具有您的属性的实例类型时，会排除定价高于阈值的实例类型。

Amazon EC2 计算价格阈值的方式如下：
+ Amazon EC2 首先从与您的属性匹配的实例类型中识别出价格最低的实例类型。
+ 然后，Amazon EC2 会使用您为价格保护参数指定的值（以百分比表示）乘以已识别的实例类型的价格。其结果就是用作价格阈值的价格。

按需型实例和竞价型实例有不同的价格阈值。

当您使用基于属性的实例类型选择创建实例集时，默认情况下会启用价格保护。您可以保留默认值，也可以指定自己的值。

您也可以关闭价格保护。要表明无价格保护阈值，请指定一个较高的百分比值，如 `999999`。

**Topics**
+ [价格最低的实例类型的识别方式](#ec2fleet-abs-price-protection-lowest-priced)
+ [按需型实例价格保护](#ec2fleet-abs-on-demand-price-protection)
+ [竞价型实例价格保护](#ec2fleet-abs-spot-price-protection)
+ [指定价格保护阈值](#ec2fleet-abs-specify-price-protection)

### 价格最低的实例类型的识别方式
<a name="ec2fleet-abs-price-protection-lowest-priced"></a>

Amazon EC2 会从与您指定的属性相匹配的实例类型中识别价格最低的实例类型，从而确定价格阈值所依据的价格。它的做法具体如下：
+ 它首先会从当前一代 C、M 或 R 实例类型中查找与您的属性相匹配的实例类型。如果找到匹配结果，它就会识别出价格最低的实例类型。
+ 如果没有匹配结果，它会从当前一代的任何实例类型中查找与您的属性相匹配的实例类型。如果找到匹配结果，它就会识别出价格最低的实例类型。
+ 如果没有匹配结果，它会从上一代的任何实例类型中查找与您的属性相匹配的实例类型，并识别出价格最低的实例类型。

### 按需型实例价格保护
<a name="ec2fleet-abs-on-demand-price-protection"></a>

按需型实例类型的价格保护阈值基于已识别的最低价格按需型实例类型(`OnDemandMaxPricePercentageOverLowestPrice`)，按照*高于其价格的百分比*计算。您可以指定该高出的百分比，表示您原意支付的价格。如果您未指定此参数，则使用默认值 `20` 计算价格保护阈值(即比已识别的价格高出 20%)。

例如，如果识别的按需型实例价格为 `0.4271`，并且您指定了 `25`，则价格阈值将比 `0.4271` 高 25%。按如下方式计算：`0.4271 * 1.25 = 0.533875`。计算出的价格是您愿意为按需型实例支付的最高价格，在本示例中，Amazon EC2 将排除任何价格高于 `0.533875` 的按需型实例类型。

### 竞价型实例价格保护
<a name="ec2fleet-abs-spot-price-protection"></a>

默认情况下，Amazon EC2 将自动应用最佳的竞价型实例价格保护，从而始终如一地从各种实例类型中进行选择。您也可以自行手动设置价格保护。但是，让 Amazon EC2 为您代劳可以提高竞价型容量得到满足的可能性。

您可以使用以下选项之一，手动指定价格保护。如果您手动设置价格保护，则建议您使用第一个选项。
+ **已识别的最低价格*按需型实例*类型的*百分比*** [`MaxSpotPriceAsPercentageOfOptimalOnDemandPrice`]

  例如，如果识别的按需型实例价格为 `0.4271`，并且您指定了 `60`，则价格阈值将是 `0.4271` 的 60%。按如下方式计算：`0.4271 * 0.60 = 0.25626`。计算出的价格是您愿意为竞价型实例支付的最高价格，在本示例中，Amazon EC2 将排除任何价格高于 `0.25626` 的竞价型实例类型。
+ **比已识别的最低价格*竞价型实例*实例类型*高出的百分比*** [`SpotMaxPricePercentageOverLowestPrice`]

  例如，如果识别的竞价型实例价格为 `0.1808`，并且您指定了 `25`，则价格阈值将比 `0.1808` 高 25%。按如下方式计算：`0.1808 * 1.25 = 0.226`。计算出的价格是您愿意为竞价型实例支付的最高价格，在本示例中，Amazon EC2 将排除任何价格高于 `0.266` 的竞价型实例类型。我们不建议使用该参数，因为竞价型实例类型的价格可能会波动，因此您的价格保护阈值也可能会波动。

### 指定价格保护阈值
<a name="ec2fleet-abs-specify-price-protection"></a>

**使用 AWS CLI 指定价格保护阈值**

使用 AWS CLI 创建 EC2 实例集或竞价型实例集时，请配置实例集，以便使用基于属性的实例类型选择，然后执行以下操作：
+ 若要指定按需型实例价格保护阈值，请在 JSON 配置文件的 `InstanceRequirements` 结构中，为 `OnDemandMaxPricePercentageOverLowestPrice` 输入以百分比表示的价格保护阈值。
+ 要指定竞价型实例的价格保护阈值，请在 JSON 配置文件的 `InstanceRequirements` 结构中指定以下参数之*一*：
  + 对于 `MaxSpotPriceAsPercentageOfOptimalOnDemandPrice`，输入以百分比表示的价格保护阈值。
  + 对于 `SpotMaxPricePercentageOverLowestPrice`，输入以百分比表示的价格保护阈值。

有关更多信息，请参阅 [通过基于属性的实例类型选择创建 EC2 机群](#abs-create-ec2-fleet) 或 [通过基于属性的实例类型选择创建竞价型实例集](#abs-create-spot-fleet)。

**（仅适用于竞价型实例集）使用控制台指定价格保护阈值**

在控制台中创建竞价型实例集时，请配置实例集，以便使用基于属性的实例类型选择，然后执行以下操作：
+ 若要指定按需型实例价格保护阈值，请在**其他实例属性**下选择**按需型价格保护**，随后选择**添加属性**，然后输入以百分比表示的价格保护阈值。
+ 若要指定竞价型实例价格保护阈值，请在**其他实例属性**下选择**竞价型价格保护**，随后选择**添加属性**，再选择作为价格依据的基值，然后输入以百分比表示的价格保护阈值。

**注意**  
创建实例集时，如果将 `TargetCapacityUnitType` 设置为 `vcpu` 或 `memory-mib`，则会基于每个 vCPU 或每个内存的价格，而不是每个实例的价格应用价格保护阈值。

## 性能保护
<a name="ec2fleet-abis-performance-protection"></a>

*性能保护*是一项功能，可确保您的 EC2 实例集或竞价型实例集使用的实例类型类似于或超过指定的性能基准。要使用性能保护，请指定一个实例系列作为基准参考。指定的实例系列的功能确立了可接受的最低性能水平。当 Amazon EC2 为您的实例集选择实例类型时，它会考虑您指定的属性和性能基准。低于性能基准的实例类型将被自动排除在选择范围之外，即使它们与您指定的其他属性相匹配。这可确保所有选定的实例类型都提供与指定实例系列建立的基准相似或更好的性能。Amazon EC2 使用此基准来指导实例类型选择，但并不能保证选定实例类型始终会超过每个应用程序的基准。

目前，此功能仅支持将 CPU 性能作为基准性能因素。指定的实例系列的 CPU 处理器的 CPU 性能充当性能基准，确保选定的实例类型与该基准相似或超过该基准。具有相同 CPU 处理器的实例系列会产生相同的筛选结果，即使其网络或磁盘性能有所不同。例如，将 `c6in` 或 `c6i` 指定为基准参考将产生相同的基于性能的筛选结果，因为两个实例系列使用相同的 CPU 处理器。

**不支持的实例系列**  
以下实例系列**不支持**性能保护：
+ **通用型**：Mac1 \| Mac2 \| Mac2-m1ultra \| Mac2-m2 \| Mac2-m2pro \| M1 \| M2 \| T1
+ **计算优化型：**C1
+ **内存优化型：**U-3tb1 \| U-6tb1 \| U-9tb1 \| U-12tb1 \| U-18tb1 \| u-24tb1 \| U7i-12tb \| U7in-16tb \| U7in-24tb \| U7in-32tb
+ **加速计算型：**G3 \| G3s \| P3dn \| P4d \| P5
+ **高性能计算型：**Hpc7g

如果您通过指定支持的实例系列来启用性能保护，则返回的实例类型将排除上述不受支持的实例系列。

如果您将不支持的实例系列指定为基准性能值，则 API 会针对 [GetInstanceTypesFromInstanceRequirements](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_GetInstanceTypesFromInstanceRequirements.html) 返回空响应，对于 [CreateFleet](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateFleet.html)、[RequestSpotFleet](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RequestSpotFleet.html)、[ModifyFleet](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyFleet.html) 和 [ModifySpotFleetRequest](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifySpotFleetRequest.html) 返回异常。

**示例：设置 CPU 性能基准**  
在以下示例中，实例要求是使用具有与 `c6i` 实例系列一样性能的 CPU 核心的实例类型启动。这将筛选掉 CPU 处理器性能较低的实例类型，即使它们满足您指定的其他实例要求（例如 vCPU 数量）。例如，如果您指定的实例属性包括 4 个 vCPU 和 16 GB 内存，则具有这些属性但 CPU 性能低于 `c6i` 的实例类型将被排除在选择范围之外。

```
"BaselinePerformanceFactors": {
        "Cpu": {
            "References": [
                {
                    "InstanceFamily": "c6i"
                }
            ]
        }
```

## 注意事项
<a name="ec2fleet-abs-considerations"></a>
+ 您可以在 EC2 实例集或竞价型实例集中指定实例类型或实例属性，但不能同时指定两者。

  使用 CLI 时，启动模板覆盖将覆盖启动模板。例如，如果启动模板包含实例类型，而启动模板覆盖包含实例属性，则由实例属性标识的实例将覆盖启动模板中的实例类型。
+ 使用 CLI 时，如果将实例属性指定为覆盖，也无法指定权重或优先级。
+ 在一个请求配置中，最多可以指定四个 `InstanceRequirements` 结构。

## 通过基于属性的实例类型选择创建 EC2 机群
<a name="abs-create-ec2-fleet"></a>

可以配置 EC2 实例集以使用基于属性的实例类型选择。无法通过 Amazon EC2 控制台创建 EC2 实例集。

基于属性的实例类型选择的属性在 `InstanceRequirements` 结构中指定。如果实例集配置中包含 `InstanceRequirements`，则必须排除 `InstanceType` 和 `WeightedCapacity`，因为它们无法同时确定实例集配置与实例属性。

在 AWS CLI 和 PowerShell 示例中，指定了以下属性：
+ `VCpuCount`：最少 2 个 vCPU，最多 4 个 vCPU。如果不需要最大限制，则可省略最大值。
+ `MemoryMiB`：内存最小为 8 GiB，最大为 16 GiB。如果不需要最大限制，则可省略最大值。

此配置可识别具有 2 到 4 个 vCPU 和 8 到 16 GiB 内存的所有实例类型。然而，当 [EC2 实例集预置实例集](#how-ef-uses-abs)时，价格保护和分配策略可能会排除某些实例类型。

------
#### [ AWS CLI ]

**通过基于属性的实例类型选择创建 EC2 实例集**  
使用 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令创建 EC2 实例集。在 JSON 文件中指定机群配置。

```
aws ec2 create-fleet \
    --region {{us-east-1}} \
    --cli-input-json file://{{file_name}}.json
```

以下示例 `{{file_name}}.json` 文件所含参数可配置 EC2 实例集以使用基于属性的实例类型选择。

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
                    "Min": {{2}},
                    "Max": {{4}}
                },
                "MemoryMiB": {
                    "Min": {{8192}},
                    "Max": {{16384}}
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

------
#### [ PowerShell ]

**通过基于属性的实例类型选择创建 EC2 实例集**  
使用 [New-EC2Fleet](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Fleet.html) cmdlet。

```
$vcpuCount = New-Object Amazon.EC2.Model.VCpuCountRangeRequest
$vcpuCount.Min = {{2}} 
$vcpuCount.Max = {{4}}  
$memoryMiB = New-Object Amazon.EC2.Model.MemoryMiBRequest
$memoryMiB.Min = {{8192}}  
$memoryMiB.Max = {{16384}}  
$instanceRequirements = New-Object Amazon.EC2.Model.InstanceRequirementsRequest
$instanceRequirements.VCpuCount = $vcpuCount
$instanceRequirements.MemoryMiB = $memoryMiB

$launchTemplateSpec = New-Object Amazon.EC2.Model.FleetLaunchTemplateSpecificationRequest
$launchTemplateSpec.LaunchTemplateName = "{{my-launch-template}}" 
$launchTemplateSpec.Version = "{{1}}"
$override = New-Object Amazon.EC2.Model.FleetLaunchTemplateOverridesRequest
$override.InstanceRequirements = $instanceRequirements
$launchTemplateConfig = New-Object Amazon.EC2.Model.FleetLaunchTemplateConfigRequest
$launchTemplateConfig.LaunchTemplateSpecification = $launchTemplateSpec
$launchTemplateConfig.Overrides = @($override)

New-EC2Fleet `
    -SpotOptions_AllocationStrategy "{{price-capacity-optimized}}" `
    -LaunchTemplateConfig @($launchTemplateConfig) `
    -TargetCapacitySpecification_DefaultTargetCapacityType "{{spot}}" `
    -TargetCapacitySpecification_TotalTargetCapacity {{20}} `
    -Type "instant"
```

------

## 通过基于属性的实例类型选择创建竞价型实例集
<a name="abs-create-spot-fleet"></a>

**重要**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

您可以配置实例集以使用基于属性的实例类型选择。

基于属性的实例类型选择的属性在 `InstanceRequirements` 结构中指定。如果实例集配置中包含 `InstanceRequirements`，则必须排除 `InstanceType` 和 `WeightedCapacity`，因为它们无法同时确定实例集配置与实例属性。

在 AWS CLI 和 PowerShell 示例中，指定了以下属性：
+ `VCpuCount`：最少 2 个 vCPU，最多 4 个 vCPU。如果不需要最大限制，则可省略最大值。
+ `MemoryMiB`：内存最小为 8 GiB，最大为 16 GiB。如果不需要最大限制，则可省略最大值。

此配置可识别具有 2 到 4 个 vCPU 和 8 到 16 GiB 内存的所有实例类型。然而，当[竞价型实例集预置实例集](#how-ef-uses-abs)时，价格保护和分配策略可能会排除某些实例类型。

------
#### [ Console ]

**配置竞价型实例集以使用基于属性的实例类型选择**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Spot Requests**（竞价型请求），然后选择 **Request Spot Instances**（请求竞价型实例）。

1. 按照步骤创建竞价型实例集。有关更多信息，请参阅 [使用已定义的参数创建竞价型实例集请求](create-spot-fleet.md#create-spot-fleet-advanced)。

   创建竞价型实例集时，按如下方式配置机群以使用基于属性的实例类型选择：

   1. 对于 **Instance type requirements**（实例类型要求），选择 **Specify instance attributes that match your compute requirements**（指定符合计算要求的实例属性）。

   1. 对于 **vCPU**，输入所需的最小和最大 vCPU 数。要指定没有限制，请选择 **No minimum**（没有最小值）和/或 **No maximum**（没有最大值）。

   1. 对于 **Memory (GiB)**（内存 (GiB)），输入所需的最小和最大内存量。要指定没有限制，请选择 **No minimum**（没有最小值）和/或 **No maximum**（没有最大值）。

   1. （可选）对于 **Additional instance attributes**（其它实例属性），您可以选择指定一个或多个属性以更详细地表达计算要求。每个额外属性都会进一步增加对您的请求的限制。

   1. （可选）展开 **Preview matching instance types**（预览匹配的实例类型），查看具有指定属性的实例类型。

------
#### [ AWS CLI ]

**配置竞价型实例集以使用基于属性的实例类型选择**  
使用 [request-spot-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-fleet.html) 命令创建竞价型实例集。在 JSON 文件中指定机群配置。

```
aws ec2 request-spot-fleet \
    --region {{us-east-1}} \
    --spot-fleet-request-config file://{{file_name}}.json
```

以下示例 `{{file_name}}.json` 文件所含参数可配置竞价型实例集以使用基于属性的实例类型选择。

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
                    "Min": {{2}},
                    "Max": {{4}}
                },
                "MemoryMiB": {
                    "Min": {{8192}},
                    "Max": {{16384}}
                }
            }
        }]
    }]
}
```

------
#### [ PowerShell ]

**配置竞价型实例集以使用基于属性的实例类型选择**  
使用 [Request-EC2SpotFleet](https://docs.aws.amazon.com/powershell/latest/reference/items/Request-EC2SpotFleet.html) cmdlet。

```
$vcpuCount = New-Object Amazon.EC2.Model.VCpuCountRange
$vcpuCount.Min = {{2}} 
$vcpuCount.Max = {{4}}  
$memoryMiB = New-Object Amazon.EC2.Model.MemoryMiB
$memoryMiB.Min = {{8192}}  
$memoryMiB.Max = {{16384}}  
$instanceRequirements = New-Object Amazon.EC2.Model.InstanceRequirements
$instanceRequirements.VCpuCount = $vcpuCount
$instanceRequirements.MemoryMiB = $memoryMiB

$launchTemplateSpec = New-Object Amazon.EC2.Model.FleetLaunchTemplateSpecification
$launchTemplateSpec.LaunchTemplateName = "{{my-launch-template}}" 
$launchTemplateSpec.Version = "{{1}}"
$override = New-Object Amazon.EC2.Model.LaunchTemplateOverrides
$override.InstanceRequirements = $instanceRequirements
$launchTemplateConfig = New-Object Amazon.EC2.Model.LaunchTemplateConfig
$launchTemplateConfig.LaunchTemplateSpecification = $launchTemplateSpec
$launchTemplateConfig.Overrides = @($override)

Request-EC2SpotFleet `
    -SpotFleetRequestConfig_AllocationStrategy "{{PriceCapacityOptimized}}" `
    -SpotFleetRequestConfig_TargetCapacity {{20}} `
    -SpotFleetRequestConfig_Type "{{Request}}" `
    -SpotFleetRequestConfig_LaunchTemplateConfig $launchTemplateConfig
```

------

## 有效 EC2 实例集配置示例和无效 EC2 实例集配置示例
<a name="ec2fleet-abs-example-configs"></a>

如果您使用 AWS CLI 创建 EC2 机群，必须确保机群配置有效。以下示例展示了有效配置和无效配置。

如果配置包含以下项，则视为无效：
+ 单个 `Overrides` 结构，但同时包含 `InstanceRequirements` 和 `InstanceType`
+ 两个 `Overrides` 结构，其中一个包含 `InstanceRequirements`，而另一个包含 `InstanceType`
+ 两个 `InstanceRequirements` 结构，但在同一 `LaunchTemplateSpecification` 中具有重叠的属性值

**Topics**
+ [有效配置：具有覆盖的单个启动模板](#ef-abs-example-config1)
+ [有效配置：具有多个 InstanceRequirements 的单个启动模板](#ef-abs-example-config2)
+ [有效配置：两个启动模板，每个都具有覆盖](#ef-abs-example-config3)
+ [有效配置：仅指定 `InstanceRequirements`，且属性值不重叠](#ef-abs-example-config4)
+ [配置无效：`Overrides` 包含 `InstanceRequirements` 和 `InstanceType`](#ef-abs-example-config5)
+ [配置无效：两个 `Overrides` 包含 `InstanceRequirements` 和 `InstanceType`](#ef-abs-example-config6)
+ [配置无效：属性值重叠](#ef-abs-example-config7)

### 有效配置：具有覆盖的单个启动模板
<a name="ef-abs-example-config1"></a>

以下配置有效。包含一个启动模板和一个 `Overrides` 结构（包含一个 `InstanceRequirements` 结构）。下面是示例配置的文本说明。

```
{
        "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateName": "My-launch-template",
                "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 2,
                            "Max": 8
                        },
                        "MemoryMib": {
                            "Min": 0,
                            "Max": 10240
                        },
                        "MemoryGiBPerVCpu": {
                            "Max": 10000
                        },
                        "RequireHibernateSupport": true
                    }
                }
            ]
        }
    ],
    "TargetCapacitySpecification": {
        "TotalTargetCapacity": 5000,
        "DefaultTargetCapacityType": "spot",
        "TargetCapacityUnitType": "vcpu"
        }
    }
}
```

****`InstanceRequirements`****  
要使用基于属性的实例选择，您必须在机群配置中包含 `InstanceRequirements` 结构，并为机群中的实例指定所需的属性。

在上述示例中，指定了以下实例属性：
+ `VCpuCount` – 实例类型的 vCPU 数量必须最少为 2 个，最多为 8 个。
+ `MemoryMiB` – 实例类型的最大内存必须为 10240MiB。最小值 0 表示没有最低限制。
+ `MemoryGiBPerVCpu` – 实例类型的每个 vCPU 内存最大值必须为 10000GiB。`Min` 参数是可选的。省略此属性表示没有最低限制。

**`TargetCapacityUnitType`**  
`TargetCapacityUnitType` 参数为目标容量指定单位。在该示例中，目标容量是 `5000`，目标容量单位类型是 `vcpu`，它们共同指定了所需的 5000 个 vCPU 目标容量。EC2 机群将启动足够多的实例，以便机群中的 vCPU 总数为 5000 个 vCPU。

### 有效配置：具有多个 InstanceRequirements 的单个启动模板
<a name="ef-abs-example-config2"></a>

以下配置有效。包含一个启动模板和一个 `Overrides` 结构（包含两个 `InstanceRequirements` 结构）。`InstanceRequirements` 中指定的属性有效，因为值不重叠，第一个 `InstanceRequirements` 结构指定 `VCpuCount` 为 0-2 个 vCPU，而第二个 `InstanceRequirements` 结构指定 4-8 个 vCPU。

```
{
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                },
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 4,
                            "Max": 8
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                }
              ]
            }
        ],
        "TargetCapacitySpecification": {
            "TotalTargetCapacity": 1,
            "DefaultTargetCapacityType": "spot"
        }
    }
}
```

### 有效配置：两个启动模板，每个都具有覆盖
<a name="ef-abs-example-config3"></a>

以下配置有效。包含两个启动模板，每个模板都有一个 `Overrides` 结构（包含一个 `InstanceRequirements` 结构）。此配置适用于在同一机群中支持 `arm` 和 `x86` 架构。

```
{
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "armLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                },
                {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "x86LaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                }
              ]
            }
        ],
         "TargetCapacitySpecification": {
            "TotalTargetCapacity": 1,
            "DefaultTargetCapacityType": "spot"
        }
    }
}
```

### 有效配置：仅指定 `InstanceRequirements`，且属性值不重叠
<a name="ef-abs-example-config4"></a>

以下配置有效。包含两个 `LaunchTemplateSpecification` 结构，每个结构都有一个启动模板和一个 `Overrides` 结构（包含一个 `InstanceRequirements` 结构）。`InstanceRequirements` 中指定的属性有效，因为值不重叠，第一个 `InstanceRequirements` 结构指定 `VCpuCount` 为 0-2 个 vCPU，而第二个 `InstanceRequirements` 结构指定 4-8 个 vCPU。

```
{
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                }
              ]
            },
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyOtherLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 4,
                            "Max": 8
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                }
              ]
            }
        ],
        "TargetCapacitySpecification": {
            "TotalTargetCapacity": 1,
            "DefaultTargetCapacityType": "spot"
        }
    }
}
```

### 配置无效：`Overrides` 包含 `InstanceRequirements` 和 `InstanceType`
<a name="ef-abs-example-config5"></a>

以下配置无效。`Overrides` 结构同时包含 `InstanceRequirements` 和 `InstanceType`。对于 `Overrides`，可以指定 `InstanceRequirements` 或 `InstanceType`，但不能同时指定两者。

```
{
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                },
                {
                    "InstanceType": "m5.large"
                }
              ]
            }
        ],
        "TargetCapacitySpecification": {
            "TotalTargetCapacity": 1,
            "DefaultTargetCapacityType": "spot"
        }
    }
}
```

### 配置无效：两个 `Overrides` 包含 `InstanceRequirements` 和 `InstanceType`
<a name="ef-abs-example-config6"></a>

以下配置无效。`Overrides` 结构同时包含 `InstanceRequirements` 和 `InstanceType`。您可以指定 `InstanceRequirements` 或 `InstanceType`，但不能同时指定两者，即使采用不同的 `Overrides` 结构也是如此。

```
{
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                }
              ]
            },
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyOtherLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceType": "m5.large"
                }
              ]
            }
        ],
         "TargetCapacitySpecification": {
            "TotalTargetCapacity": 1,
            "DefaultTargetCapacityType": "spot"
        }
    }
}
```

### 配置无效：属性值重叠
<a name="ef-abs-example-config7"></a>

以下配置无效。两个 `InstanceRequirements` 结构，每个结构都包含 `"VCpuCount": {"Min": 0, "Max": 2}`。这些属性的值重叠，这将导致容量池重复。

```
{
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    },
                    {
                      "InstanceRequirements": {
                          "VCpuCount": {
                              "Min": 0,
                              "Max": 2
                          },
                          "MemoryMiB": {
                              "Min": 0
                          }
                      }
                  }
                }
              ]
            }
        ],
         "TargetCapacitySpecification": {
            "TotalTargetCapacity": 1,
            "DefaultTargetCapacityType": "spot"
        }
    }
}
```

## 有效竞价型实例集配置示例和无效竞价型实例集配置示例
<a name="spotfleet-abs-example-configs"></a>

如果您使用 AWS CLI 创建竞价型实例集，必须确保机群配置有效。以下示例展示了有效配置和无效配置。

如果配置包含以下项，则视为无效：
+ 单个 `Overrides` 结构，但同时包含 `InstanceRequirements` 和 `InstanceType`
+ 两个 `Overrides` 结构，其中一个包含 `InstanceRequirements`，而另一个包含 `InstanceType`
+ 两个 `InstanceRequirements` 结构，但在同一 `LaunchTemplateSpecification` 中具有重叠的属性值

**Topics**
+ [有效配置：具有覆盖的单个启动模板](#sf-abs-example-config1)
+ [有效配置：具有多个 InstanceRequirements 的单个启动模板](#sf-abs-example-config2)
+ [有效配置：两个启动模板，每个都具有覆盖](#sf-abs-example-config3)
+ [有效配置：仅指定 `InstanceRequirements`，且属性值不重叠](#sf-abs-example-config4)
+ [配置无效：`Overrides` 包含 `InstanceRequirements` 和 `InstanceType`](#sf-abs-example-config5)
+ [配置无效：两个 `Overrides` 包含 `InstanceRequirements` 和 `InstanceType`](#sf-abs-example-config6)
+ [配置无效：属性值重叠](#sf-abs-example-config7)

### 有效配置：具有覆盖的单个启动模板
<a name="sf-abs-example-config1"></a>

以下配置有效。包含一个启动模板和一个 `Overrides` 结构（包含一个 `InstanceRequirements` 结构）。下面是示例配置的文本说明。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "priceCapacityOptimized",
        "ExcessCapacityTerminationPolicy": "default",
        "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
        "LaunchTemplateConfigs": [
        {
            "LaunchTemplateSpecification": {
                "LaunchTemplateName": "My-launch-template",
                "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 2,
                            "Max": 8
                        },
                        "MemoryMib": {
                            "Min": 0,
                            "Max": 10240
                        },
                        "MemoryGiBPerVCpu": {
                            "Max": 10000
                        },
                        "RequireHibernateSupport": true
                    }
                }
            ]
        }
    ],
        "TargetCapacity": 5000,
            "OnDemandTargetCapacity": 0,
            "TargetCapacityUnitType": "vcpu"
    }
}
```

****`InstanceRequirements`****  
要使用基于属性的实例选择，您必须在机群配置中包含 `InstanceRequirements` 结构，并为机群中的实例指定所需的属性。

在上述示例中，指定了以下实例属性：
+ `VCpuCount` – 实例类型的 vCPU 数量必须最少为 2 个，最多为 8 个。
+ `MemoryMiB` – 实例类型的最大内存必须为 10240MiB。最小值 0 表示没有最低限制。
+ `MemoryGiBPerVCpu` – 实例类型的每个 vCPU 内存最大值必须为 10000GiB。`Min` 参数是可选的。省略此属性表示没有最低限制。

**`TargetCapacityUnitType`**  
`TargetCapacityUnitType` 参数为目标容量指定单位。在该示例中，目标容量是 `5000`，目标容量单位类型是 `vcpu`，它们共同指定了所需的 5000 个 vCPU 目标容量。竞价型实例集将启动足够多的实例，以便机群中的 vCPU 总数为 5000 个 vCPU。

### 有效配置：具有多个 InstanceRequirements 的单个启动模板
<a name="sf-abs-example-config2"></a>

以下配置有效。包含一个启动模板和一个 `Overrides` 结构（包含两个 `InstanceRequirements` 结构）。`InstanceRequirements` 中指定的属性有效，因为值不重叠，第一个 `InstanceRequirements` 结构指定 `VCpuCount` 为 0-2 个 vCPU，而第二个 `InstanceRequirements` 结构指定 4-8 个 vCPU。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "priceCapacityOptimized",
        "ExcessCapacityTerminationPolicy": "default",
        "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                },
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 4,
                            "Max": 8
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                }
              ]
            }
        ],
        "TargetCapacity": 1,
        "OnDemandTargetCapacity": 0,
        "Type": "maintain"
    }
}
```

### 有效配置：两个启动模板，每个都具有覆盖
<a name="sf-abs-example-config3"></a>

以下配置有效。包含两个启动模板，每个模板都有一个 `Overrides` 结构（包含一个 `InstanceRequirements` 结构）。此配置适用于在同一机群中支持 `arm` 和 `x86` 架构。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "priceCapacityOptimized",
        "ExcessCapacityTerminationPolicy": "default",
        "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "armLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                },
                {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "x86LaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                }
              ]
            }
        ],
        "TargetCapacity": 1,
        "OnDemandTargetCapacity": 0,
        "Type": "maintain"
    }
}
```

### 有效配置：仅指定 `InstanceRequirements`，且属性值不重叠
<a name="sf-abs-example-config4"></a>

以下配置有效。包含两个 `LaunchTemplateSpecification` 结构，每个结构都有一个启动模板和一个 `Overrides` 结构（包含一个 `InstanceRequirements` 结构）。`InstanceRequirements` 中指定的属性有效，因为值不重叠，第一个 `InstanceRequirements` 结构指定 `VCpuCount` 为 0-2 个 vCPU，而第二个 `InstanceRequirements` 结构指定 4-8 个 vCPU。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "priceCapacityOptimized",
        "ExcessCapacityTerminationPolicy": "default",
        "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                }
              ]
            },
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyOtherLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 4,
                            "Max": 8
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                }
              ]
            }
        ],
        "TargetCapacity": 1,
        "OnDemandTargetCapacity": 0,
        "Type": "maintain"
    }
}
```

### 配置无效：`Overrides` 包含 `InstanceRequirements` 和 `InstanceType`
<a name="sf-abs-example-config5"></a>

以下配置无效。`Overrides` 结构同时包含 `InstanceRequirements` 和 `InstanceType`。对于 `Overrides`，可以指定 `InstanceRequirements` 或 `InstanceType`，但不能同时指定两者。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "priceCapacityOptimized",
        "ExcessCapacityTerminationPolicy": "default",
        "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                },
                {
                    "InstanceType": "m5.large"
                }
              ]
            }
        ],
        "TargetCapacity": 1,
        "OnDemandTargetCapacity": 0,
        "Type": "maintain"
    }
}
```

### 配置无效：两个 `Overrides` 包含 `InstanceRequirements` 和 `InstanceType`
<a name="sf-abs-example-config6"></a>

以下配置无效。`Overrides` 结构同时包含 `InstanceRequirements` 和 `InstanceType`。您可以指定 `InstanceRequirements` 或 `InstanceType`，但不能同时指定两者，即使采用不同的 `Overrides` 结构也是如此。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "priceCapacityOptimized",
        "ExcessCapacityTerminationPolicy": "default",
        "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    }
                }
              ]
            },
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyOtherLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceType": "m5.large"
                }
              ]
            }
        ],
        "TargetCapacity": 1,
        "OnDemandTargetCapacity": 0,
        "Type": "maintain"
    }
}
```

### 配置无效：属性值重叠
<a name="sf-abs-example-config7"></a>

以下配置无效。两个 `InstanceRequirements` 结构，每个结构都包含 `"VCpuCount": {"Min": 0, "Max": 2}`。这些属性的值重叠，这将导致容量池重复。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "priceCapacityOptimized",
        "ExcessCapacityTerminationPolicy": "default",
        "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
        "LaunchTemplateConfigs": [
            {
                "LaunchTemplateSpecification": {
                    "LaunchTemplateName": "MyLaunchTemplate",
                    "Version": "1"
                },
                "Overrides": [
                {
                    "InstanceRequirements": {
                        "VCpuCount": {
                            "Min": 0,
                            "Max": 2
                        },
                        "MemoryMiB": {
                            "Min": 0
                        }
                    },
                    {
                      "InstanceRequirements": {
                          "VCpuCount": {
                              "Min": 0,
                              "Max": 2
                          },
                          "MemoryMiB": {
                              "Min": 0
                          }
                      }
                  }
                }
              ]
            }
        ],
        "TargetCapacity": 1,
        "OnDemandTargetCapacity": 0,
        "Type": "maintain"
    }
}
```

## 预览具有指定属性的实例类型
<a name="ec2fleet-get-instance-types-from-instance-requirements"></a>

您可以使用 [get-instance-types-from-instance-requirements](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-types-from-instance-requirements.html) 命令预览与您指定的属性匹配的实例类型。这对于在不启动任何实例的情况下确定要在请求配置中指定的属性尤其有用。请注意，该命令不考虑可用容量。

**通过使用 AWS CLI 指定属性来预览实例类型列表**

1. （可选）要生成所有可以指定的可能属性，请使用 [get-instance-types-from-instance-requirements](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-types-from-instance-requirements.html) 命令和 `--generate-cli-skeleton` 参数。您可以选择使用 `input > {{attributes.json}}` 将输出定向到某个文件以将其保存。

   ```
   aws ec2 get-instance-types-from-instance-requirements \
       --region us-east-1 \
       --generate-cli-skeleton input > {{attributes.json}}
   ```

   预期输出

   ```
   {
       "DryRun": true,
       "ArchitectureTypes": [
           "i386"
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
               "intel"
           ],
           "MemoryGiBPerVCpu": {
               "Min": 0.0,
               "Max": 0.0
           },
           "ExcludedInstanceTypes": [
               ""
           ],
           "InstanceGenerations": [
               "current"
           ],
           "SpotMaxPricePercentageOverLowestPrice": 0,
           "OnDemandMaxPricePercentageOverLowestPrice": 0,
           "BareMetal": "included",
           "BurstablePerformance": "included",
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
               "gpu"
           ],
           "AcceleratorCount": {
               "Min": 0,
               "Max": 0
           },
           "AcceleratorManufacturers": [
               "nvidia"
           ],
           "AcceleratorNames": [
               "a100"
           ],
           "AcceleratorTotalMemoryMiB": {
               "Min": 0,
               "Max": 0
           },
           "NetworkBandwidthGbps": {
               "Min": 0.0,
               "Max": 0.0
           },
           "AllowedInstanceTypes": [
               ""
           ]
       },
       "MaxResults": 0,
       "NextToken": ""
   }
   ```

1. 使用上一步的输出创建 JSON 配置文件，然后按如下方式进行配置：
**注意**  
您必须提供 `ArchitectureTypes`、`VirtualizationTypes`、`VCpuCount` 和 `MemoryMiB` 的值。您可以省略其它属性；如果省略，则使用默认值。  
有关每个属性及其默认值的描述，请参阅 [get-instance-types-from-instance-requirements](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-types-from-instance-requirements.html)。

   1. 对于 `ArchitectureTypes`，请指定一个或多个处理器架构类型。

   1. 对于 `VirtualizationTypes`，请指定一个或多个虚拟化类型。

   1. 对于 `VCpuCount`，请指定最小和最大 vCPU 数量。要指定没有最低限制，对于 `Min`，请指定 `0`。要指定没有最大限制，请省略 `Max` 参数。

   1. 对于 `MemoryMiB`，请指定最小和最大内存量（以 MiB 为单位）。要指定没有最低限制，对于 `Min`，请指定 `0`。要指定没有最大限制，请省略 `Max` 参数。

   1. 您可以选择指定一个或多个其他属性来进一步限制返回的实例类型列表。

1. 要预览具有您在 JSON 文件中所指定属性的实例类型，请使用 [get-instance-types-from-instance-requirements](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-types-from-instance-requirements.html) 命令，然后使用 `--cli-input-json` 参数指定 JSON 文件的名称和路径。您可以选择将输出格式设置为以表格格式显示。

   ```
   aws ec2 get-instance-types-from-instance-requirements \
       --cli-input-json file://{{attributes.json}} \
       --output table
   ```

   示例 {{attributes.json}} 文件

   在此示例中，JSON 文件包含所需属性。它们是 `ArchitectureTypes`、`VirtualizationTypes`、`VCpuCount` 和 `MemoryMiB`。此外，还包含可选属性 `InstanceGenerations`。请注意，对于 `MemoryMiB`，可以省略 `Max` 值，指示没有限制。

   ```
   {
       
       "ArchitectureTypes": [
           "x86_64"
       ],
       "VirtualizationTypes": [
           "hvm"
       ],
       "InstanceRequirements": {
           "VCpuCount": {
               "Min": 4,
               "Max": 6
           },
           "MemoryMiB": {
               "Min": 2048
           },
           "InstanceGenerations": [
               "current"
           ]
       }
   }
   ```

   示例输出

   ```
   ------------------------------------------
   |GetInstanceTypesFromInstanceRequirements|
   +----------------------------------------+
   ||             InstanceTypes            ||
   |+--------------------------------------+|
   ||             InstanceType             ||
   |+--------------------------------------+|
   ||  c4.xlarge                           ||
   ||  c5.xlarge                           ||
   ||  c5a.xlarge                          ||
   ||  c5ad.xlarge                         ||
   ||  c5d.xlarge                          ||
   ||  c5n.xlarge                          ||
   ||  d2.xlarge                           ||
   ...
   ```

1. 在确定满足您的需求的实例类型后，请记下您使用的实例属性，以便在配置机群请求时可以使用。
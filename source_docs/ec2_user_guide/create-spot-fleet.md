

# 创建竞价型实例集
<a name="create-spot-fleet"></a>

**重要**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

使用 AWS 管理控制台时，只需选择 AMI 和所需的目标总容量，即可快速创建竞价型实例集请求。Amazon EC2 将配置一个最符合您需求并遵循竞价型实例最佳实践的实例集。您也可以修改任何默认设置。

要在实例集中包含按需型实例，则必须在请求中指定启动模板以及所需的按需容量。

实例集在有可用容量时启动按需型实例，在最高价超过 Spot 价格并且有可用容量时启动竞价型实例。

如果实例集包含竞价型实例且类型为 `maintain`，Amazon EC2 会尝试在竞价型实例中断时维持实例集的目标容量。

**所需的权限**  
有关更多信息，请参阅 [竞价型实例集权限](spot-fleet-prerequisites.md)。

**Topics**
+ [快速创建竞价型实例集请求](#create-spot-fleet-quick)
+ [使用已定义的参数创建竞价型实例集请求](#create-spot-fleet-advanced)
+ [创建竞价型实例集来替换运行状况不佳的竞价型实例](#spot-fleet-health-checks)

## 快速创建竞价型实例集请求
<a name="create-spot-fleet-quick"></a>

使用 Amazon EC2 控制台，按照以下步骤快速创建竞价型实例集请求。

**使用推荐设置创建竞价型实例集请求**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 如果您是首次接触 Spot，则会看到一个欢迎页面；请选择 **Get started**。否则，请选择**创建竞价型实例集请求**。

1. 在 **Launch parameters**（启动参数）下，选择 **Manually configure launch parameters**（手动配置启动参数）。

1. 对于 **AMI**，选择一个 AMI。

1. 在 **Target capacity**（目标容量）下，对于 **Total target capacity**（总目标容量），请指定要请求的单位数。对于单位类型，您可以选择**实例**、**vCPU** 或 **内存（GiB）**。

1. 对于**您的实例集请求概览**，查看您的实例集配置，然后选择**启动**。

## 使用已定义的参数创建竞价型实例集请求
<a name="create-spot-fleet-advanced"></a>

您可以使用自己定义的参数创建竞价型实例集。

------
#### [ Console ]

**使用已定义的参数创建竞价型实例集请求**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 如果您是首次接触 Spot，则会看到一个欢迎页面；请选择 **Get started**。否则，请选择**创建竞价型实例集请求**。

1. 对于**启动参数**，可以手动配置启动参数，也可以使用启动模板，如下所示：

   1. [手动配置] 要在 Amazon EC2 控制台中定义启动参数，请选择**手动配置启动参数**，再执行以下操作：

      1. 对于 **AMI**，选择 AWS 提供的一个基本 AMI，或者选择 **Search for AMI (搜索 AMI)** 以使用来自我们用户社区的 AMI、AWS Marketplace 或您自己的一个 AMI。
**注意**  
如果启动参数中指定的 AMI 已注销或禁用，则无法从该 AMI 启动任何新实例。对于设置为维持目标容量的实例集，目标容量将无法维持。

      1. （可选）对于 **Key pair name (密钥对名称)**，选择现有密钥对或新建一个密钥对。

         [现有密钥对] 选择所需的密钥对。

         [新密钥对] 选择**创建新密钥对**前往**密钥对**页面。完成之后，返回 **Spot Requests**（竞价型请求）页面并刷新列表。

      1. （可选）展开 **Additional launch parameters**（其它启动参数），然后执行以下操作：

         1. （可选）要启用 Amazon EBS 优化，对于 **EBS-optimized**（EBS 优化），请选择 **Launch EBS-optimized instances**（启动 EBS 优化实例）。

         1. （可选）要为实例添加临时性块级存储，请对 **Instance store (实例存储)** 选择 **Attach at launch (启动时附加)**。

         1. （可选）要添加存储，请选择 **Add new volume**（添加新卷），然后根据实例类型指定其它实例存储卷或 Amazon EBS 卷。

         1. (可选) 默认情况下，已为您的实例启用基本监控。要启用详细监控，对于 **Monitoring**（监控），请选择 **Enable CloudWatch detailed monitoring**（启用 CloudWatch 详细监控）。

         1. （可选）要运行专用竞价型实例，请为**租赁**选择**专用 – 运行专用实例**。

         1. （可选）对于 **Security groups (安全组)**，选择一个或多个安全组，或者新建一个。

            [现有安全组] 选择一个或多个所需的安全组。

            [新安全组] 选择 **Create new security group**（新建安全组）以前往 **Security Groups**（安全组）页面。完成之后，返回 **Spot Requests**（Spot 请求）并刷新列表。

         1. （可选）要能够通过 Internet 访问实例，请对 **Auto-assign IPv4 Public IP (自动分配 IPv4 公有 IP)** 选择 **Enable (启用)**。

         1. （可选）要使用 IAM 角色启动竞价型实例，请对 **IAM 实例配置文件**选择角色。

         1. (可选) 要运行启动脚本，请将其复制到 **User data**。

         1. （可选）要添加标签，请选择 **Create tag**（创建标签），输入标签的键和值，然后选择 **Create**（创建）。对每个标签重复此操作。

            对于每个标签，要使用相同标签标记实例和竞价型实例集请求，请确保同时选择了 **Instance**（实例）和 **Fleet**（机群）。要仅标记由实例集启动的实例，请清除**实例集**。要仅标记竞价型实例集请求，请清除 **Instance**（实例）。

   1. [启动模板] 要使用在启动模板中创建的配置，请选择**使用启动模板**，再为**启动模板**选择一个启动模板。
**注意**  
如果希望在竞价型实例集中包含按需容量，则必须指定启动模板。

1. 对于 **Additional request details (其他请求详细信息)**，执行以下操作：

   1. 查看其他请求详细信息。要进行更改，请清除 **Apply defaults (应用默认设置)**。

   1. （可选）对于 **IAM 实例集角色**，您可以使用默认角色或选择其他角色。要在更改角色后使用默认角色，请选择 **Use default role (使用默认角色)**。

   1. (可选) 要创建仅在特定时间段内有效的请求，请编辑**请求有效起始时间**和**请求有效截止时间**。

   1. （可选）默认情况下，Amazon EC2 在竞价型实例集会在请求过期时终止竞价型实例。要保持这些实例在请求过期后继续运行，请清除 **Terminate the instances when the request expires (请求到期时终止实例)**。

   1. （可选）要向负载均衡器注册竞价型实例，请选择**从一个或多个负载均衡器接收流量**，然后选择一个或多个经典负载均衡器或目标组。

1. 对于 **Target capacity**（目标容量），执行以下操作：

   1. 对于 **Total target capacity**（总目标容量），请指定要请求的单位数。对于单位类型，您可以选择 **Instances**（实例）、**vCPU** 或 **Memory (MiB)**（内存 (MiB)）。要将目标容量指定为 0 以便以后可增加容量，请选择**维持目标容量**。

   1. （可选）对于 **Include On-Demand base capacity**（包括按需基本容量），请指定要请求的按需单位数。该数字必须小于 **Total target capacity (总目标容量)**。Amazon EC2 会计算差值，并将差值分配给要请求的 Spot 单位。
**重要**  
 要指定可选的按需容量，您必须先选择一个启动模板。

   1. （可选）默认情况下，在竞价型实例中断时，Amazon EC2 将终止这些实例。要保持目标容量，请选择**保持目标容量**。然后，您可以指定 Amazon EC2 在竞价型实例中断时终止、停止或休眠这些实例。为此，请从**中断行为**中选择相应的选项。
**注意**  
如果启动参数中指定的 AMI 已注销或禁用，则无法从该 AMI 启动任何新实例。在这种情况下，对于设置为维持目标容量的实例集，目标容量将无法维持。

   1. （可选）要允许竞价型实例集在系统针对实例集中的现有竞价型实例发出实例再平衡通知时启动替换竞价型实例，请选择 **Capacity rebalance**（容量再平衡），然后选择实例替换策略。如果选择**终止前启动**，请指定 Amazon EC2 终止旧实例之前的延迟时间（以秒为单位）。有关更多信息，请参阅 [在 EC2 实例集和竞价型实例集中使用“容量再平衡”功能来替换存在风险的竞价型实例](ec2-fleet-capacity-rebalance.md)。

   1. （可选）要控制每小时为实例集中所有的竞价型实例支付的金额，请选择**设置 竞价型实例的最大成本**，然后输入您每小时愿意支付的最大总额。当达到最大总额后，即使未达到目标容量，竞价型实例集也会停止启动竞价型实例。有关更多信息，请参阅 [为 EC2 实例集或竞价型实例集设置支出限额](ec2-fleet-control-spending.md)。

1. 对于 **Network**（网络），执行以下操作：

   1. 对于 **Network (网络)**，选择现有 VPC 或新建一个。

      [现有 VPC] 选择所需的 VPC。

      [新 VPC] 选择 **Create new VPC (新建 VPC)** 以前往 Amazon VPC 控制台。完成之后，请返回此屏幕并刷新列表。

   1. （可选）对于**可用区**，让 Amazon EC2 为竞价型实例选择可用区，或者指定一个或多个可用区。

      如果您在一个可用区中有多个子网，则请从 **Subnet (子网)** 中选择合适的子网。要添加子网，请选择 **Create new subnet (新建子网)** 以前往 Amazon VPC 控制台。完成之后，请返回此屏幕并刷新列表。

1. 对于 **Instance type requirements**（实例类型要求），可以指定实例属性，然后让 Amazon EC2 使用这些属性识别最佳实例类型，也可以指定实例列表。有关更多信息，请参阅 [指定 EC2 实例集或竞价型实例集的实例类型选择属性](ec2-fleet-attribute-based-instance-type-selection.md)。

   1. 如果选择 **Specify instance attributes that match your compute requirements**（指定符合计算要求的实例属性），请按如下方式指定实例属性：

      1. 对于 **vCPU**，请输入所需的最小和最大 vCPU 数。要指定没有限制，请选择**没有最小值**和/或**没有最大值**。

      1. 对于 **Memory (GiB)**（内存 (GiB)），输入所需的最小和最大内存量。要指定没有限制，请选择**没有最小值**和/或**没有最大值**。

      1. （可选）对于**其他实例属性**，您可以选择指定一个或多个属性来更详细地表达计算要求。每个额外属性都会进一步增加对您的请求的限制。您可以省略其它属性；如果省略，则使用默认值。有关每个属性及其默认值的描述，请参阅 [get-spot-placement-scores](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-spot-placement-scores.html)。

      1. （可选）要查看具有指定属性的实例类型，请展开 **Preview matching instance types**（预览匹配的实例类型）。要排除在请求中使用的实例类型，请选择实例，然后选择 **Exclude selected instance types**（排除选定的实例类型）。

   1. 如果选择 **Manually select instance types**（手动选择实例类型），竞价型实例集将提供实例类型默认列表。要选择更多实例类型，请选择 **Add instance types**（添加实例类型），选择要在请求中使用的实例类型，然后选择 **Select**（选择）。要删除实例类型，请选择实例类型，然后选择 **Delete**（删除）。

1. 对于**分配策略**，请选择符合需求的竞价型分配策略和按需型分配策略。有关更多信息，请参阅 [使用分配策略确定 EC2 实例集或竞价型实例集如何满足竞价型和按需型容量](ec2-fleet-allocation-strategy.md)。

1. 对于 **Your fleet request at a glance**（您的机群请求概览），查看您的机群配置，并在必要时进行任何调整。

1. （可选）要下载一个启动配置副本以用于 AWS CLI，请选择 **JSON config (JSON 配置)**。

1. 准备好启动竞价型实例集后，请选择**启动**。

   竞价型实例集请求类型为 `fleet`。执行请求后，系统会添加请求类型 `instance`，此时其状态为 `active` 和 `fulfilled`。

------
#### [ AWS CLI ]

**创建竞价型实例集请求**  
使用 [request-spot-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-fleet.html) 命令。

```
aws ec2 request-spot-fleet --spot-fleet-request-config file://{{config.json}}
```

有关示例配置文件，请参阅[竞价型实例集 CLI 配置示例](spot-fleet-examples.md)。

------
#### [ PowerShell ]

**创建竞价型实例集请求**  
使用 [Request-EC2SpotFleet](https://docs.aws.amazon.com/powershell/latest/reference/items/Request-EC2SpotFleet.html) cmdlet。以下示例在容量优化实例集中启动竞价型实例。

```
Request-EC2SpotFleet `
    -SpotFleetRequestConfig_TargetCapacity {{50}} `
    -SpotFleetRequestConfig_AllocationStrategy "CapacityOptimized" `
    -SpotFleetRequestConfig_IamFleetRole "arn:aws:iam::{{123456789012}}:role/{{my-spot-fleet-role}}" `
    -SpotFleetRequestConfig_LaunchTemplateConfig @($launchConfig)
```

按如下方式定义启动配置，设置启动模板并覆盖所需的属性。有关示例配置，请参阅 [竞价型实例集 CLI 配置示例](spot-fleet-examples.md)。

```
$lcSpec = Amazon.EC2.Model.FleetLaunchTemplateSpecification
# To do - Set FleetLaunchTemplateSpecification properties
$lcOverrides = New-Object Amazon.EC2.Model.LaunchTemplateOverrides
# To do - Set LaunchTemplateOverrides properties
$launchConfig = New-Object Amazon.EC2.Model.LaunchTemplateConfig
$launchConfig.LaunchTemplateSpecification $lcSpec
$launchConfig.Overrides @($lcOverrides)
```

------

## 创建竞价型实例集来替换运行状况不佳的竞价型实例
<a name="spot-fleet-health-checks"></a>

竞价型实例集每 2 分钟检查一次实例集中竞价型实例的运行状况。实例的运行状况为 `healthy` 或 `unhealthy`。

竞价型实例集将使用 Amazon EC2 提供的状态检查来确定实例的运行状况。如果在连续三次运行状况检查中，实例状态检查或系统状态检查的状态有任一项为 `unhealthy`，则可确定该实例的运行状况为 `impaired`。有关更多信息，请参阅 [Amazon EC2 实例的状态检查](monitoring-system-instance-status-check.md)。

您可以配置您的实例集以替换运行状况不佳的竞价型实例。启用运行状况检查替换后，如果竞价型实例被报告为 `unhealthy`，则会被替换。在替换运行状况不佳的竞价型实例时，实例集的容量可能在几分钟内降至其目标容量之下。

**要求**
+ 只有在保持目标容量（类型 `maintain` 的实例集）的情况下竞价型实例集才支持运行状况检查替换，而不支持一次性竞价型实例集（类型 `request` 的实例集）。
+ 仅对竞价型实例支持运行状况检查替换。对于 按需型实例 不支持此功能。
+ 您可以将竞价型实例集配置为仅在您创建它时替换运行状况不佳的实例。
+ 用户仅在其有权调用 `ec2:DescribeInstanceStatus` 操作时才能使用运行状况检查替换。

------
#### [ Console ]

**配置竞价型实例集来替换运行不正常的竞价型实例**

1. 按[使用已定义的参数创建竞价型实例集请求](#create-spot-fleet-advanced)中创建竞价型实例集的步骤操作。

1. 要将实例集配置为替换运行状况不佳的竞价型实例，请展开**其他启动参数**，然后在**运行状况检查**下选择**替换运行状况不佳的实例**。要启用此选项，您必须先选择 **Maintain target capacity (保持目标容量)**。

------
#### [ AWS CLI ]

**配置竞价型实例集来替换运行不正常的竞价型实例**  
使用 `ReplaceUnhealthyInstances` 属性为 `SpotFleetRequestConfig` 的 [request-spot-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-fleet.html) 命令。

```
{
    "SpotFleetRequestConfig": {
        "AllocationStrategy": "{{lowestPrice}}",
        "IamFleetRole": "arn:aws:iam::{{123456789012}}:role/{{aws-ec2-spot-fleet-tagging-role}}",
        "TargetCapacity": {{10}},
        "ReplaceUnhealthyInstances": true
    }
}
```

------
#### [ PowerShell ]

**配置竞价型实例集请求来替换运行不正常的竞价型实例**  
使用带 `-SpotFleetRequestConfig_ReplaceUnhealthyInstance` 参数的 [Request-EC2SpotFleet](https://docs.aws.amazon.com/powershell/latest/reference/items/Request-EC2SpotFleet.html) cmdlet。

```
-SpotFleetRequestConfig_ReplaceUnhealthyInstance $true
```

------
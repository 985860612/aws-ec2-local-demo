

# 配置可突增性能实例
<a name="burstable-performance-instances-how-to"></a>

用于启动、监控和修改可突增性能实例(T 实例)的步骤是类似的。主要差别在于它们启动时的默认积分规范。

每个 T 实例系列都具有以下*默认积分规范*：
+ T4g、T3a 和 T3 实例以 `unlimited` 模式启动
+ 专属主机上的 T3 实例仅可以作为 `standard` 启动
+ T2 实例以 `standard` 模式启动

您可以[更改账户的默认积分规范](#burstable-performance-instance-set-default-credit-specification-for-account)。

**Topics**
+ [在启动时配置积分规范](#launch-burstable-performance-instances)
+ [配置自动扩缩组以将积分规范设置为 unlimited](#burstable-performance-instances-auto-scaling-grp)
+ [管理可突增性能实例的积分规范](#modify-burstable-performance-instances)
+ [管理账户的默认积分规范](#burstable-performance-instance-set-default-credit-specification-for-account)

## 在启动时配置积分规范
<a name="launch-burstable-performance-instances"></a>

您可以启动积分规范为 `unlimited` 或 `standard` 的 T 实例。

以下过程介绍了如何使用 EC2 控制台或 AWS CLI。有关如何使用自动扩缩组的信息，请参阅 [配置自动扩缩组以将积分规范设置为 unlimited](#burstable-performance-instances-auto-scaling-grp)。

------
#### [ Console ]

**在启动时配置实例的积分规范**

1. 按照程序[启动实例](ec2-launch-instance-wizard.md)。

1. 在 **Instance type**（实例类型）下，选择一个 T 实例类型。

1. 展开**高级详细信息**。在**积分规范**中选择积分规范。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。

------
#### [ AWS CLI ]

**在启动时设置实例的积分规范**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--credit-specification` 选项。

```
--credit-specification CpuCredits=unlimited
```

------
#### [ PowerShell ]

**在启动时设置实例的积分规范**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-CreditSpecification_CpuCredit` 参数结合使用。

```
-CreditSpecification_CpuCredit unlimited
```

------

## 配置自动扩缩组以将积分规范设置为 unlimited
<a name="burstable-performance-instances-auto-scaling-grp"></a>

在启动 T 实例时，它们需要具有 CPU 积分才能获得良好的引导体验。如果您使用自动扩缩组启动实例，建议您将实例配置为 `unlimited`。如果这样做，实例会在自动启动或者由自动扩缩组重新启动时使用超额积分。使用超额积分可以防止受到性能限制。

### 创建启动模板
<a name="burstable-performance-instances-asg-launch-template"></a>

在自动扩缩组中以 `unlimited` 模式启动实例时，您必须使用*启动模板*。启动配置不支持以 `unlimited` 模式启动实例。

------
#### [ Console ]

**创建可用于设置积分规范的启动模板**

1. 请遵照《Amazon EC2 Auto Scaling 用户指南》**中的[使用高级设置创建启动模板](https://docs.aws.amazon.com/autoscaling/ec2/userguide/advanced-settings-for-your-launch-template.html)。

1. 在**启动模板内容**中，对于**实例类型**，请选择实例大小。

1. 要在自动扩缩组中以 `unlimited` 模式启动实例，请在**高级详细信息**下，对于**积分规范**选择**无限**。

1. 在您完成后，定义启动模板参数，选择**创建启动模板**。

------
#### [ AWS CLI ]

**创建可用于设置积分规范的启动模板**  
使用 [create-launch-template](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-launch-template.html) 命令。

```
aws ec2 create-launch-template \
    --launch-template-name {{my-launch-template}} \
    --version-description {{FirstVersion}} \
    --launch-template-data CreditSpecification={CpuCredits={{unlimited}}}
```

------
#### [ PowerShell ]

**创建可用于设置积分规范的启动模板**  
使用 [New-EC2LaunchTemplate](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2LaunchTemplate.html) cmdlet。按如下方式定义启动模板数据的积分规范。

```
$creditSpec = New-Object Amazon.EC2.Model.CreditSpecificationRequest
$creditSpec.CpuCredits = "unlimited"
$launchTemplateData = New-Object Amazon.EC2.Model.RequestLaunchTemplateData
$launchTemplateData.CreditSpecification = $creditSpec
```

------

### 关联自动扩缩组与启动模板
<a name="burstable-performance-instances-create-asg-with-launch-template"></a>

要将启动模板与一个自动扩缩组相关联，请使用启动模板创建自动扩缩组，或者将启动模板添加到现有自动扩缩组中。

------
#### [ Console ]

**使用启动模板创建自动扩缩组**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在屏幕顶部的导航栏中，选择在创建启动模板时使用的同一区域。

1. 在导航窗格中，依次选择**自动扩缩组**和**创建自动扩缩组**。

1. 选择**启动模板**，选择您的启动模板，然后选择**下一步**。

1. 填写自动扩缩组的各个字段。当您在**审核**页面上完成审核配置设置时，选择**创建自动扩缩组**。有关更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南》**中的[使用启动模板创建自动扩缩组](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-launch-template.html)。

**添加启动模板到现有自动扩缩组**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在屏幕顶部的导航栏中，选择在创建启动模板时使用的同一区域。

1. 在导航窗格中，选择 **Auto Scaling Groups**。

1. 从自动扩缩组列表中选择一个自动扩缩组，然后依次选择**操作**和**编辑**。

1. 在**详细信息**选项卡上，对于**启动模板**，选择一个启动模板，然后选择**保存**。

------
#### [ AWS CLI ]

**使用启动模板创建自动扩缩组**  
使用 [create-auto-scaling-group](https://docs.aws.amazon.com/cli/latest/reference/autoscaling/create-auto-scaling-group.html) 命令并指定 `--launch-template` 参数。

**添加启动模板到现有自动扩缩组**  
使用 [update-auto-scaling-group](https://docs.aws.amazon.com/cli/latest/reference/autoscaling/update-auto-scaling-group.html) 命令并指定 `--launch-template` 参数。

------
#### [ PowerShell ]

**使用启动模板创建自动扩缩组**  
使用 [New-ASAutoScalingGroup](https://docs.aws.amazon.com/powershell/latest/reference/items/New-ASAutoScalingGroup.html) cmdlet 并指定 `-LaunchTemplate_LaunchTemplateId` 或 `-LaunchTemplate_LaunchTemplateName` 参数。

**添加启动模板到现有自动扩缩组**  
使用 [Update-ASAutoScalingGroup](https://docs.aws.amazon.com/powershell/latest/reference/items/Update-ASAutoScalingGroup.html) cmdlet 并指定 `-LaunchTemplate_LaunchTemplateId` 或 `-LaunchTemplate_LaunchTemplateName` 参数。

------

## 管理可突增性能实例的积分规范
<a name="modify-burstable-performance-instances"></a>

您可以随时将正在运行或停止的 T 实例的积分规范在 `unlimited` 与 `standard` 之间切换。

请注意，在 `unlimited` 模式中，实例可能会花费超额积分，从而产生额外费用。有关更多信息，请参阅 [超额积分会产生费用](burstable-performance-instances-unlimited-mode-concepts.md#unlimited-mode-surplus-credits)。

------
#### [ Console ]

**管理实例的积分规范**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Instances (实例)**。

1. （可选）选择实例。在**详细信息**选项卡上，找到**积分规范**。该值为 `unlimited` 或 `standard`。

1. （可选）要一次修改多个实例的积分规范，请选择所有实例。

1. 依次选择**操作**、**实例设置**和**更改积分规范**。仅当您选择了 T 实例时，此选项才会启用。

1. 如要启用或停用**无限模式**，选中或清除每个实例 ID 旁边的复选框。

------
#### [ AWS CLI ]

**获取实例的积分规范**  
使用 [describe-instance-credit-specifications](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-credit-specifications.html) 命令。如果您不指定实例 ID，则将返回积分规范为 `unlimited` 的所有实例。输出还将包括先前配置了 `unlimited` 积分规范的实例。例如，如果您将 T3 实例大小调整为 M4 实例，而该实例配置为 `unlimited`，Amazon EC2 将返回 M4 实例。

```
aws ec2 describe-instance-credit-specifications \
    --instance-id {{i-1234567890abcdef0}} \
    --query InstanceCreditSpecifications[].CpuCredits \
    --output text
```

下面是示例输出。

```
unlimited
```

**设置实例的积分规范**  
使用 [modify-instance-credit-specification](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-credit-specification.html) 命令。

```
aws ec2 modify-instance-credit-specification \
    --region {{us-east-1}} \
    --instance-credit-specification "InstanceId={{i-1234567890abcdef0}},CpuCredits={{unlimited}}"
```

------
#### [ PowerShell ]

**获取实例的积分规范**  
使用 [Get-EC2CreditSpecification](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2CreditSpecification.html) cmdlet。

```
(Get-EC2CreditSpecification `
    -InstanceId {{i-1234567890abcdef0}}).CpuCredits
```

下面是示例输出。

```
unlimited
```

**设置实例的积分规范**  
使用 [Edit-EC2InstanceCreditSpecification](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceCreditSpecification.html) cmdlet。

```
Edit-EC2InstanceCreditSpecification `
    -Region {{us-east-1}} `
    -InstanceCreditSpecification @({InstanceId="{{i-1234567890abcdef0}}" CpuCredits="unlimited"})
```

------

## 管理账户的默认积分规范
<a name="burstable-performance-instance-set-default-credit-specification-for-account"></a>

每个 T 实例系列都有[默认积分规范](#default-credit-spec)。您可以在每个 AWS 区域的账户级别更改每个 T 实例系列的默认积分规范。默认积分规范的有效值为 `unlimited` 和 `standard`。

如果您使用 EC2 控制台中的启动实例向导来启动实例，则您为积分规范选择的值会覆盖账户级别的默认积分规范。如果您使用 AWS CLI 启动实例，则账户中所有新的 T 实例都使用默认积分规范启动。现有正在运行或已停止的实例的积分规范不受影响。

**考虑因素**  
实例系列的默认积分规范在 5 分钟滚动周期内只能修改一次，在 24 小时滚动周期内最多可修改四次。

------
#### [ Console ]

**管理默认积分规范**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 要更改 AWS 区域，请使用页面右上角的区域选择器。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡的**设置**下，选择**默认服务抵扣金规格**。

1. 选择**管理**。

1. 对于每个实例系列，选择 **Unlimited (无限)** 或 **Standard (标准)**，然后选择 **Update (更新)**。

------
#### [ AWS CLI ]

**获取默认积分规范**  
使用 [get-default-credit-specification](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-default-credit-specification.html) 命令。

```
aws ec2 get-default-credit-specification \
    --region {{us-east-1}} \
    --instance-family {{t2}} \
    --query InstanceFamilyCreditSpecifications[].CpuCredits \
    --output text
```

下面是示例输出。

```
standard
```

**设置默认积分规范**  
使用 [modify-default-credit-specification](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-default-credit-specification.html) 命令。以下示例将该值设置为 `unlimited`。

```
aws ec2 modify-default-credit-specification \
    --region {{us-east-1}} \
    --instance-family {{t2}} \
    --cpu-credits unlimited
```

------
#### [ PowerShell ]

**获取默认积分规范**  
使用 [Get-EC2DefaultCreditSpecification](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2DefaultCreditSpecification.html) cmdlet。

```
(Get-EC2DefaultCreditSpecification `
    -Region {{us-east-1}} `
    -InstanceFamily {{t2}}).CpuCredits
```

下面是示例输出。

```
standard
```

**设置默认积分规范**  
使用 [Edit-EC2DefaultCreditSpecification](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2DefaultCreditSpecification.html) cmdlet。以下示例将该值设置为 `unlimited`。

```
Edit-EC2DefaultCreditSpecification `
    -Region {{us-east-1}} `
    -InstanceFamily {{t2}} `
    -CpuCredit unlimited
```

------
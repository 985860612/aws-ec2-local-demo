

# 利用嵌套虚拟化在 Amazon EC2 实例中运行虚拟机监控程序
<a name="amazon-ec2-nested-virtualization"></a>

使用嵌套虚拟化，您可以在虚拟 Amazon EC2 实例内运行虚拟机监控程序，例如 Hyper-V 和 KVM。虚拟的 EC2 实例是非裸机实例。此功能通过为虚拟的 EC2 实例添加处理器级虚拟化支持，增强了虚拟化的灵活性，使得运行在实例中的虚拟机监控程序能够创建和管理虚拟机。

当您在开发工作流程中运行 Docker Desktop、Windows Subsystem for Linux 2（WSL2）、Android Studio 模拟器或 QEMU 等开发工具时，采用嵌套虚拟化技术会非常有用，因为它能让您从众多符合您特定性能和价格要求的标准 Amazon EC2 虚拟实例类型中进行选择。

使用嵌套虚拟化技术无需额外付费。

**Topics**
+ [工作原理](#nested-virtualization-how-it-works)
+ [注意事项](#nested-virtualization-considerations)
+ [在启用了嵌套虚拟化的情况下启动新实例](#nested-virtualization-launch-new-instance)
+ [将现有实例配置为使用嵌套虚拟化](#nested-virtualization-configure-existing-instance)
+ [查找支持嵌套虚拟化的实例类型](#nested-virtualization-find-supported-instance-types)

## 工作原理
<a name="nested-virtualization-how-it-works"></a>

虚拟 EC2 实例在装有 Nitro 虚拟机监控器的物理主机上运行。为了支持嵌套虚拟化，Nitro System 会将处理器扩展程序（例如 Intel VT-x）传递给各个实例，以方便运行嵌套虚拟机。嵌套虚拟化架构由三层组成：物理 AWS 基础设施和 Nitro 虚拟机监控器（L0）、运行虚拟机监控程序的 EC2 实例（L1），以及在该实例中创建的一台或多台虚拟机（L2）。

## 注意事项
<a name="nested-virtualization-considerations"></a>

在开始使用嵌套虚拟化之前，请考虑以下几点：
+ **支持的实例类型**：以下实例类型目前支持嵌套虚拟化：
  + **通用型**：M7i \| M7i-flex \| M8i \| M8id \| M8i-flex
  + **计算优化型**：C7i \| C7i-flex \| C8i \| C8id \| C8i-flex
  + **内存优化型**：R7i \| R7iz \| R8i \| R8id \| R8i-flex \| X8i
  + **存储优化型**：I7i \| I7ie
+ **支持的虚拟机监控程序**：目前，KVM 和 Hyper-V 是所支持的 L1 虚拟化监控程序。
+ **Windows 实例**：在 Windows 实例上启用嵌套虚拟化时：
  + **[凭证保护](credential-guard.md)**：虚拟安全模式（VSM）已自动禁用。
  + **休眠**：不支持实例休眠和恢复。
  + **CPU 限制**：在 CPU 超过 192 的 Windows 实例上不受支持，例如 `m8i.96xl`。
+ **安全责任**：在 EC2 实例上使用嵌套虚拟化时，AWS 负责“云*的*安全”、保护底层基础设施并维护 AWS Nitro System 提供的 EC2 实例之间的坚固隔离边界。客户负责“云*中*安全”，包括保护 EC2 实例中的操作系统、虚拟机监控程序、嵌套虚拟机、访客操作系统、应用程序和数据的安全。
+ **性能**：AWS 建议那些希望运行需要使用硬件虚拟化扩展程序的工作负载、并且对性能有较高要求或者对延迟有严格限制的客户，来评估裸机实例。

## 在启用了嵌套虚拟化的情况下启动新实例
<a name="nested-virtualization-launch-new-instance"></a>

启动新实例时，您可以开启嵌套虚拟化功能，以便在此实例上运行虚拟机监控程序和虚拟机。

------
#### [ Console ]

**要在实例启动期间启用嵌套虚拟化**

1. 按照 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md) 程序进行操作并根据需要配置实例。

1. 确保选择了支持的实例类型。

1. 展开**高级详细信息**，对于**嵌套虚拟化**，请选择**启用**。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。

------
#### [ AWS CLI ]

**要在启用嵌套虚拟化的情况下启动实例**  
可以使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令。

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --instance-type {{r8i.4xlarge}} \
    --cpu-options "NestedVirtualization=enabled" \
    --key-name {{my-key-pair}}
```

------
#### [ PowerShell ]

**要在启用嵌套虚拟化的情况下启动实例**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) 命令。

```
New-EC2Instance `
    -ImageId {{ami-0abcdef1234567890}} `
    -InstanceType {{r8i.4xlarge}} `
    -CpuOption @{NestedVirtualization='enabled'} `
    -KeyName {{my-key-pair}}
```

------

## 将现有实例配置为使用嵌套虚拟化
<a name="nested-virtualization-configure-existing-instance"></a>

您可以在现有 Amazon EC2 实例上开启嵌套虚拟化。

**先决条件**
+ 该实例必须处于 `stopped` 状态。
+ 该实例类型必须支持嵌套虚拟化。

------
#### [ Console ]

**要在现有实例上启用嵌套虚拟化**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 从实例表中选择要修改的实例。

1. 选择**操作**、**实例设置**、**更改 CPU 选项**。

1. 在**更改 CPU 选项**页面上，对于**嵌套虚拟化**，选择以下选项之一：
   + **启用**：为实例开启嵌套虚拟化
   + **禁用**：为实例关闭嵌套虚拟化

1. 查看您的更改，然后选择**更改**，以应用新的 CPU 选项。

------
#### [ AWS CLI ]

**要在现有实例上启用嵌套虚拟化**  
首先停止实例，然后使用 [modify-instance-cpu-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-cpu-options.html) 命令。

```
aws ec2 modify-instance-cpu-options \
    --instance-id {{i-1234567890abcdef0}} \
    --core-count {{4}} \
    --threads-per-core {{2}} \
    --nested-virtualization enabled
```

------
#### [ PowerShell ]

**要在现有实例上启用嵌套虚拟化**  
首先停止实例，然后使用 [Edit-EC2InstanceCpuOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceCpuOption.html) 命令。

```
Edit-EC2InstanceCpuOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -CoreCount {{4}} `
    -ThreadsPerCore {{2}} `
    -NestedVirtualization enabled
```

------

## 查找支持嵌套虚拟化的实例类型
<a name="nested-virtualization-find-supported-instance-types"></a>

您可以查看支持嵌套虚拟化的 Amazon EC2 实例类型。您可以在整个 AWS 区域 进行查询，也可以查看特定的实例类型。

------
#### [ AWS CLI ]

**列出某个区域中支持嵌套虚拟化的所有实例系列**  
使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令，并将 `processor-info.supported-features` 筛选条件设置为 `nested-virtualization` 的值：

```
aws ec2 describe-instance-types --region {{us-east-1}} \
  --filters "Name=processor-info.supported-features,Values=nested-virtualization" \
  --query "InstanceTypes[].InstanceType" --output text \
  | tr '\t' '\n' | cut -d. -f1 | sort -u
```

**查看特定实例类型是否支持嵌套虚拟化**  
使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令查询指定实例类型的 `ProcessorInfo.SupportedFeatures` 字段：

```
aws ec2 describe-instance-types \
  --instance-types {{m8i.2xlarge}} \
  --query "InstanceTypes[].ProcessorInfo.SupportedFeatures"
```

如果实例类型支持嵌套虚拟化，则输出包括 `nested-virtualization`。如果不支持，则命令会返回一个空数组 (`[]`)。

------
#### [ PowerShell ]

**列出某个区域中支持嵌套虚拟化的所有实例系列**  
使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) 命令，并将 `processor-info.supported-features` 筛选条件设置为 `nested-virtualization` 的值：

```
Get-EC2InstanceType -Region {{us-east-1}} -Filter @{ Name='processor-info.supported-features'; Values='nested-virtualization' } |
  ForEach-Object { ($_.InstanceType -split '\.')[0] } |
  Sort-Object -Unique
```

**查看特定实例类型是否支持嵌套虚拟化**  
使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) 命令查询指定实例类型的 `ProcessorInfo.SupportedFeatures` 属性：

```
(Get-EC2InstanceType -InstanceType {{m8i.2xlarge}}).ProcessorInfo.SupportedFeatures
```

如果实例类型支持嵌套虚拟化，则输出包括 `nested-virtualization`。如果没有，该命令不返回任何输出。

------
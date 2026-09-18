

# 使用 EC2 按需容量预留来预留计算容量
<a name="ec2-capacity-reservations"></a>

通过使用 Amazon EC2 容量预留，您可以在特定可用区中为 Amazon EC2 实例预留计算容量达任意持续时间。如果您对当前或未来的关键业务工作负载有严格的容量要求，需要一定程度的长期或短期容量保证，我们建议您创建容量预留，以帮助确保在需要时始终可以获得所需时长的 Amazon EC2 容量。

您能够随时创建容量预留，并且可以选择何时启动。您可以请求立即使用的容量预留，也可以请求未来某个日期的容量预留。
+ 如果您请求**立即使用的容量预留**，则容量预留将立即可用，并且没有期限承诺。您可以随时修改容量预留，也可以随时取消，进而释放预留容量并停止产生费用。
+ 如果您请求**未来日期的容量预留**，则需要指定何时需要容量以及承诺保留多长时间。在指定的未来日期，容量预留将可供使用，并且计费也将从那时开始。在承诺期限内，您不能将实例数量或承诺期限减少到初始承诺以下。您可以取消容量预留，但可能会收取取消费用，具体取决于您取消的时间。承诺期限过后，您可以以任何方式修改容量预留，或者免费将其取消。

容量预留只能由匹配其属性的实例使用。默认情况下，容量预留自动将新实例与具有匹配属性（实例类型、平台、可用区和租赁）的运行中实例进行匹配。这意味着，任何具有匹配属性的实例都将自动在容量预留中运行。不过，您还可以将容量预留定位到特定工作负载。这可以明确控制允许哪些实例在预留容量中运行。您还可指定实例仅在容量预留或容量预留资源组中运行。

**重要**  
未来日期的容量预留用于帮助您启动和涵盖增量实例，而不是涵盖现有正在运行的实例。如果需要涵盖现有正在运行的实例，请改用立即启动的容量预留。

具有匹配属性（即实例类型、平台、可用区和租赁）的所有受支持的 Amazon EC2 实例都有资格在该容量预留中运行。Amazon EC2 实例可以由您启动（*非托管式实例*），也可以由 AWS 服务代表您启动（*托管式实例*）。*开放的*容量预留尤其如此，因为系统会自动与任何具有匹配属性的正在运行的实例匹配。例如，以下服务代表您启动的托管式实例有资格在您创建和管理的容量预留中运行。
+ Amazon EC2 Auto Scaling
+ Amazon ECS
+ Amazon EKS
+ Amazon EMR
+ AWS Batch
+ AWS Elastic Beanstalk
+ AWS ParallelCluster
+ AWS 并行计算服务 (AWS PCS)

**Topics**
+ [Amazon EC2 容量预留的概念](cr-concepts.md)
+ [容量预留、预留实例与节省计划的区别](#capacity-reservations-differences)
+ [支持的平台](#capacity-reservations-platforms)
+ [配额](#capacity-reservations-limits)
+ [限制](#capacity-reservations-limitations)
+ [容量预留定价和计费](capacity-reservations-pricing-billing.md)
+ [创建 容量预留](capacity-reservations-create.md)
+ [查看容量预留的状态](capacity-reservations-view.md)
+ [在现有 容量预留 中启动实例](capacity-reservations-launch.md)
+ [修改活动容量预留](capacity-reservations-modify.md)
+ [修改您的实例的容量预留设置](capacity-reservations-modify-instance.md)
+ [在容量预留之间移动容量](capacity-reservations-move.md)
+ [从现有容量预留中拆分容量](capacity-reservations-split.md)
+ [取消 容量预留](capacity-reservations-release.md)
+ [使用置放群组的容量预留](cr-cpg.md)
+ [Local Zones 中的容量预留](capacity-reservations-localzones.md)
+ [Wavelength 区中的 容量预留](capacity-reservations-wavelengthzones.md)
+ [AWS Outposts 上的容量预留](capacity-reservations-outposts.md)
+ [共享容量预留](capacity-reservation-sharing.md)
+ [容量预留实例集](cr-fleets.md)
+ [使用 CloudWatch 指标监控容量预留使用情况](capacity-reservation-cw-metrics.md)
+ [监控容量预留利用率不足](cr-eventbridge.md)
+ [监控未来日期容量预留的状态变化](monitor-fcr-state.md)
+ [可中断容量预留](interruptible-capacity-reservations.md)

## 容量预留、预留实例与节省计划的区别
<a name="capacity-reservations-differences"></a>

下表重点介绍容量预留、预留实例和节省计划之间的主要区别：


<table>
<thead>
  <tr><th></th><th>Capacity Reservations</th><th>可用区预留实例</th><th>区域性预留实例</th><th>节省计划</th></tr>
</thead>
<tbody>
  <tr><td><b>租期</b></td><td>立即使用的容量预留无需承诺。它们可以根据需要创建、修改和取消。<br />利用未来日期的容量预留，您可以指定承诺在您的账户中保留容量的承诺期限。您可以随时取消；在承诺期限内，可能会收取取消费用。</td><td colspan="3">需要固定的一年或三年使用承诺</td></tr>
  <tr><td><b>容量优势</b></td><td colspan="2">在特定可用区中预留容量。</td><td colspan="2">无预留容量。</td></tr>
  <tr><td><b>账单折扣</b></td><td>无账单折扣。†</td><td colspan="3">提供账单折扣。</td></tr>
  <tr><td><b>实例限制</b></td><td>适用每个区域的每个按需型实例的限制。</td><td>默认值为每个可用区 20 个。您可以请求提高限制。</td><td>默认值为每个区域 20 个。您可以请求提高限制。</td><td>无限制。</td></tr>
</tbody>
</table>


† 您可以将容量预留与节省计划或区域性预留实例相结合，以获得折扣。

有关更多信息，请参阅下列内容：
+ [Amazon EC2 的预留实例概览](ec2-reserved-instances.md)
+ [节省计划用户指南](https://docs.aws.amazon.com/savingsplans/latest/userguide/)

## 支持的平台
<a name="capacity-reservations-platforms"></a>

您必须使用正确的平台创建容量预留，以确保它与您的实例正确匹配。容量预留支持 `platform` 的以下值：
+ Linux/UNIX
+ 含有 SQL Server Standard 的 Linux
+ 含有 SQL Server Web 的 Linux
+ 含有 SQL Server Enterprise 的 Linux
+ SUSE Linux
+ Red Hat Enterprise Linux
+ 含有 SQL Server Standard 的 RHEL
+ 含有 SQL Server Enterprise 的 RHEL
+ 含有 SQL Server Web 的 RHEL
+ 含有 HA 的 RHEL
+ 含有 HA 和 SQL Server Standard 的 RHEL
+ 含有 HA 和 SQL Server Enterprise 的 RHEL
+ Ubuntu Pro
+ Windows
+ 含有 SQL Server 的 Windows
+ 含有 SQL Server Web 的 Windows
+ 含有 SQL Server Standard 的 Windows
+ 含有 SQL Server Enterprise 的 Windows

为确保实例在特定的容量预留中运行，容量预留的平台必须与用于启动该实例的 AMI 平台相匹配。对于 Linux AMI，请务必检查 AMI 平台是使用常规值 **Linux/UNIX** 还是具体值（如 **SUSE Linux**）。

------
#### [ Console ]

**检查 AMI 平台**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI。

1. 在**详细信息**选项卡上，记下**平台详细信息**的值。

------
#### [ AWS CLI ]

**检查 AMI 平台**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令并检查 `PlatformDetails` 的值。

```
aws ec2 describe-images \
    --image-ids {{ami-0abcdef1234567890}} \
    --query Images[*].PlatformDetails
```

下面是示例输出。

```
[
    "Linux/UNIX"
]
```

------
#### [ PowerShell ]

**检查 AMI 平台**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet 并检查 `PlatformDetails` 的值。

```
(Get-EC2Image -ImageId {{ami-0abcdef1234567890}}).PlatformDetails
```

下面是示例输出。

```
Linux/UNIX
```

------

## 配额
<a name="capacity-reservations-limits"></a>

允许您预留容量的实例数基于您账户的个按需型实例配额。您可以在配额允许的数量减去已经运行的实例数量范围内，为任意数量的实例预留容量。

处于 `assessing`、`scheduled`、`pending`、`active` 和 `delayed` 状态的容量预留计入您的按需型实例配额。

## 限制
<a name="capacity-reservations-limitations"></a>

在创建容量预留之前，请注意以下限制。
+ 活动和未使用的容量预留会计入您的个按需型实例限制中。
+ 容量预留无法从一个AWS账户转移到另一个账户。但是，您可以与其他 AWS 账户共享容量预留。有关更多信息，请参阅 [共享容量预留](capacity-reservation-sharing.md)。
+ 可用区预留实例账单折扣不适用于容量预留。
+ 您可以在集群置放群组中创建容量预留。不支持分布和分区置放群组。
+ 容量预留不能与专属主机一起使用。容量预留可以与专用实例一起使用。
+ [Windows 实例] 容量预留不能用于自带许可（BYOL）。
+ [Red Hat 实例] 容量预留可用于自带许可（BYOL）。
+ 容量预留不能确保休眠的实例在尝试启动后可以恢复。
+ 您可以为至少具有 32 个 vCPU 的实例计数请求未来日期的容量预留。例如，如果您为 `m5.xlarge` 实例请求未来日期的容量预留，则必须请求至少 8 个实例（*8 \* m5.xlarge = 32 个 vCPU*）。
+ 您可以为 C、G、I、M、R、T、U 和 X 系列中的实例类型请求未来日期的容量预留。
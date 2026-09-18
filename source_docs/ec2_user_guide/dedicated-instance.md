

# Amazon EC2 专用实例
<a name="dedicated-instance"></a>

默认情况下，EC2 实例将在共享租赁硬件上运行。这表示多个 AWS 账户可能会共享相同物理硬件。

专用实例是在专用于单个 AWS 账户的硬件上运行的 EC2 实例。这就表示，专用实例在主机硬件层面与属于其他 AWS 账户 的实例存在物理隔离(即使这些账户都与单个付款人账户相关联也是如此)。不过，专用实例可能与来自同一 AWS 账户但非专用实例的其他实例共享硬件。

专用实例不提供对实例置放的可见性和控制力，也不支持主机关联性。停止专用实例后再启动，它可能不会在同一台主机上运行。同样，您也不能指定特定主机启动或运行该实例。此外，专用实例对自带许可(BYOL)的支持有限。

如果您需要实例置放方面的可见性和控制力，以及更全面的 BYOL 支持，请考虑改用专属主机。专用实例和专属主机均可用于在专用物理服务器上启动 Amazon EC2 实例。专用实例与专属主机上的实例在性能、安全性或物理特性方面没有区别。但是，它们之间也存在一些关键差异。下表重点介绍专用实例和专属主机之间的一些重要区别：


|  | Dedicated Host | Dedicated Instance | 
| --- | --- | --- | 
| 专用的物理服务器 | 实例容量完全供您专用的物理服务器。 | 专供单个客户账户使用的物理服务器。 | 
| 实例容量共享 | 可以与其他账户共享实例容量。 | 不支持 | 
| 计费 | 按主机计费 | 按实例计费 | 
| 套接字、内核和主机 ID 的可见性 | 提供套接字数和物理内核数的可见性 | 无可见性 | 
| 主机和实例关联 | 允许您在一段时间内将您的实例一致地部署到同一物理服务器 | 不支持 | 
| 定向实例置放 | 提供额外可见性以及对在物理服务器上放置实例的方式的控制 | 不支持 | 
| 自动实例恢复 | 支持。有关更多信息，请参阅[Amazon EC2 专属主机恢复](dedicated-hosts-recovery.md)。 | 支持 | 
| 自带许可 (BYOL) | 支持 | 部分支持\* | 
| Capacity Reservations | 不支持 | 支持 | 

\* 通过软件保障计划提供许可证移动性的 Microsoft SQL Server 和 Windows 虚拟桌面访问 (VDA) 许可证可用于专用实例。

有关更多信息，请参阅 [Amazon EC2 专属主机](dedicated-hosts-overview.md)。

**Topics**
+ [专用实例 基础知识](#dedicated-howitworks)
+ [支持的功能](#features)
+ [专用实例 限制](#dedicated-limits)
+ [专用实例定价](#dedicated-instance-pricing)
+ [启动专用实例](dedicatedinstancesintovpc.md)
+ [更改实例的租期](dedicated-change-tenancy.md)
+ [更改 VPC 的租期](change-tenancy-vpc.md)

## 专用实例 基础知识
<a name="dedicated-howitworks"></a>

VPC 的租赁可以为 `default` 或 `dedicated`。默认情况下，VPC 的租赁将为 `default`，并且在 `default` 租赁 VPC 中启动的实例租赁也为 `default`。要启动专用实例，请执行以下操作：
+ 创建一个租赁为 `dedicated` 的 VPC，从而确保该 VPC 中的所有实例都将作为专用实例运行。有关更多信息，请参阅 [在具有默认租赁的 VPC 中启动专用实例](dedicatedinstancesintovpc.md)。
+ 创建一个租赁为 `default` 的 VPC，然后为要作为专用实例运行的实例手动指定租赁 `dedicated`。有关更多信息，请参阅 [在具有默认租赁的 VPC 中启动专用实例](dedicatedinstancesintovpc.md)。

## 支持的功能
<a name="features"></a>

专用实例支持以下功能和 AWS 服务集成：

**Topics**
+ [预留实例](#dedicatedreservedinstances)
+ [自动扩缩](#dedicated-instance-autoscaling)
+ [自动恢复](#dedicated-instance-recovery)
+ [专用竞价型实例](#dedicated-instance-spot)
+ [具爆发能力的实例](#dedicated-instance-burstable)

### 预留实例
<a name="dedicatedreservedinstances"></a>

要为您的专用实例预留容量，可以购买专用预留实例或容量预留。有关更多信息，请参阅[Amazon EC2 的预留实例概览](ec2-reserved-instances.md)和[使用 EC2 按需容量预留来预留计算容量](ec2-capacity-reservations.md)。

如果购买专用预留实例，则可以按极其优惠的使用费率购买容量来启动专用实例；而这种使用费率价格优惠仅在您使用专用租赁启动实例时才有效。当您购买具有原定设置租赁的预留实例时，它仅适用于具有 `default` 租赁的运行实例；它不适用于具有 `dedicated` 租赁的运行实例。

您在购买Reserved Instance之后将无法使用修改过程来更改其租赁。但是，您可以将可转换预留实例换成具有不同租赁的新可转换预留实例。

### 自动扩缩
<a name="dedicated-instance-autoscaling"></a>

您可以使用 Amazon EC2 Auto Scaling 启动专用实例。有关更多信息，请参阅*Amazon EC2 Auto Scaling 用户指南*中的[使用高级设置创建启动模板](https://docs.aws.amazon.com/autoscaling/ec2/userguide/advanced-settings-for-your-launch-template.html) 。

### 自动恢复
<a name="dedicated-instance-recovery"></a>

如果专用实例因需要 AWS 参与才能修复的基础硬件故障或问题而受损，您可以为它配置自动恢复。有关更多信息，请参阅 [实例自动恢复](ec2-instance-recover.md)。

### 专用竞价型实例
<a name="dedicated-instance-spot"></a>

创建竞价型实例请求时，您可以通过指定租赁 `dedicated` 来运行专用竞价型实例。有关更多信息，请参阅 [在单租户硬件上启动](how-spot-instances-work.md#spot-instance-tenancy)。

### 具爆发能力的实例
<a name="dedicated-instance-burstable"></a>

您可以通过[可突增性能实例](burstable-performance-instances.md)，利用在专用租赁硬件上运行的优势。默认情况下，T3 专用实例以无限模式启动，提供了基准水平的 CPU 性能，并且在工作负载需要时能够突增到更高的 CPU 性能水平。T3 基准性能和突增能力由 CPU 积分控制。由于 T3 实例类型的可突增性质，我们建议您监控 T3 实例如何使用专用硬件的 CPU 资源，以获得最佳性能。T3 专用实例面向具有多种工作负载的客户，这些工作负载表现出随机 CPU 行为，但理想情况下，平均 CPU 使用率等于或低于基准使用率。有关更多信息，请参阅[可突增性能实例的关键概念](burstable-credits-baseline-concepts.md)。

Amazon EC2 具有识别和纠正性能可变性的系统。但是，如果您启动多个具有关联 CPU 使用模式的 T3 专用实例，仍可能遇到短暂的变化。对于这些要求更高或关联的工作负载，我们建议使用 M5 或 M5a 专用实例，而不是 T3 专用实例。

## 专用实例 限制
<a name="dedicated-limits"></a>

使用专用实例时请记住以下事项：
+ 某些 AWS 服务或其功能不受实例租期设置为 `dedicated` 的 VPC 支持。请参阅各自的服务文档以确认是否存在任何限制。
+ 某些实例类型无法启动至实例租期设置为 `dedicated` 的 VPC 中。有关支持的实例类型的更多信息，请参阅 [Amazon EC2 专用实例](https://aws.amazon.com/ec2/pricing/dedicated-instances/)。
+ 当启动 Amazon EBS 支持的专用实例时，EBS 卷不会在单一租户硬件上运行。

## 专用实例定价
<a name="dedicated-instance-pricing"></a>

专用实例的定价不同于按需实例的定价。有关更多信息，请参阅 [Amazon EC2 专用实例](https://aws.amazon.com/ec2/pricing/dedicated-instances/)。
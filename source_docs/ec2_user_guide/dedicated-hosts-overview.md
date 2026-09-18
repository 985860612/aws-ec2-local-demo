

# Amazon EC2 专属主机
<a name="dedicated-hosts-overview"></a>

Amazon EC2 专属主机是一种专供您使用的物理服务器。您可以选择与其他 AWS 账户共享实例容量。有关更多信息，请参阅 [跨账户 Amazon EC2 专属主机共享](dh-sharing.md)。

专属主机提供对实例置放的可见性和控制力，并且支持主机关联性。这意味着您可以在特定主机上启动和运行实例，并确保实例仅在特定主机上运行。有关更多信息，请参阅 [Amazon EC2 专属主机自动置放和主机关联](dedicated-hosts-understanding.md)。

专属主机提供全面的自带许可(BYOL)支持。它们允许您使用按插槽、按内核或按虚拟机授权的现有软件许可证，包括 Windows Server、SQL Server、SUSE Linux Enterprise Server、Red Hat Enterprise Linux，或其他绑定到虚拟机、插槽或物理内核的软件许可证(取决于您的许可证条款)。

如果您需要在专用硬件上运行实例，但不需要查看或控制实例的置放，也不需要使用按插槽或按内核授权的软件许可证，则可以考虑改用专用实例。专用实例和专属主机均可用于在专用物理服务器上启动 Amazon EC2 实例。专用实例与专属主机上的实例在性能、安全性或物理特性方面没有区别。但是，它们之间也存在一些关键差异。下表重点介绍专用实例和专属主机之间的一些重要区别：


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

有关专用实例的更多信息，请参阅 [Amazon EC2 专用实例](dedicated-instance.md)。

## 专属主机限制
<a name="dedicated-hosts-limitations"></a>

在分配专属主机之前，请注意以下限制：
+ 要在专属主机上运行 RHEL 和 SUSE Linux，您必须自带 AMI。由 AWS 提供或 AWS Marketplace 上提供的 RHEL 和 SUSE Linux AMI 不可用于专属主机。有关如何创建自己的 AMI 的更多信息，请参阅 [自带软件许可证到 Amazon EC2 专属主机](dedicated-hosts-BYOL.md)。

  此限制不适用于分配给高内存实例（`u-6tb1.metal`、`u-9tb1.metal`、`u-12tb1.metal`、`u-18tb1.metal` 和 `u-24tb1.metal`）的主机。由 AWS 提供或在 AWS Marketplace 上可用的 RHEL 和 SUSE Linux AMI 可以用于这些主机。
+ 每个区域每个 AWS 账户的每个实例系列运行的专属主机数量具有一定的限制。限额仅适用于正在运行的实例。如果实例处于待处理、正在停止或已停止状态，则不会计入限额。要查看账户限额或请求增加限额，请使用[服务限额控制台](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas)。
+ 在使用指定主机资源组的启动模板时，支持自动扩缩组。有关更多信息，请参阅*Amazon EC2 Auto Scaling 用户指南*中的[使用高级设置创建启动模板](https://docs.aws.amazon.com/autoscaling/ec2/userguide/advanced-settings-for-your-launch-template.html) 。
+ 不支持 Amazon RDS 实例。
+ AWS免费使用套餐不适用于专属主机。
+ 实例置放控制是指管理专属主机中的实例启动。不能在置放群组中启动专属主机。
+ 如果为虚拟化实例类型分配主机，在主机分配完成后，您无法将该实例类型修改为 `.metal` 实例类型。例如，如果您为 `m5.large` 实例类型分配主机，则无法将实例类型修改为 `m5.metal`。

  如果为 `.metal` 实例类型分配主机，在主机分配完成后，您无法将该实例类型修改为虚拟化实例类型。例如，如果您为 `m5.metal` 实例类型分配主机，则无法将实例类型修改为 `m5.large`。

**Topics**
+ [专属主机限制](#dedicated-hosts-limitations)
+ [定价和计费](dedicated-hosts-billing.md)
+ [实例容量配置](dedicated-hosts-limits.md)
+ [专属主机上的可突发实例](burstable-t3.md)
+ [自带许可证](dedicated-hosts-BYOL.md)
+ [自动置放和关联](dedicated-hosts-understanding.md)
+ [分配专属主机](dedicated-hosts-allocating.md)
+ [在专属主机上启动实例](launching-dedicated-hosts-instances.md)
+ [在主机资源组中启动实例](launching-hrg-instances.md)
+ [修改 专属主机 自动放置](modify-host-auto-placement.md)
+ [修改支持的实例类型](modify-host-support.md)
+ [修改实例租赁和关联](moving-instances-dedicated-hosts.md)
+ [释放专属主机](dedicated-hosts-releasing.md)
+ [迁移到基于 Nitro 的 Amazon EC2 专属主机](dh-migrate.md)
+ [购买专属主机预留](#purchasing-dedicated-host-reservations)
+ [跨账户共享](dh-sharing.md)
+ [Outpost 上的专属主机](dh-outposts.md)
+ [主机恢复](dedicated-hosts-recovery.md)
+ [主机维护](dedicated-hosts-maintenance.md)
+ [显示器 专属主机](dedicated-hosts-monitoring.md)
+ [跟踪配置更改](dedicated-hosts-aws-config.md)

## 购买专属主机预留，享受专属主机账单折扣
<a name="purchasing-dedicated-host-reservations"></a>

与按需专属主机定价相比，专属主机预留可提供高达 70% 的折扣。您的账户中必须分配活动的专属主机，然后才能购买专属主机预留。有关更多信息，请参阅 [Dedicated Host Reservations](dedicated-hosts-billing.md#dedicated-host-reservations)。

------
#### [ Console ]

**购买预留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择 **专属主机**、**专属主机预留** 和 **Purchase 专属主机预留 (购买专属主机预留)**。

1. 在**查找产品**屏幕上，执行以下操作：

   1. 对于**实例系列**，选择要为其购买专属主机预留的专属主机实例系列。

   1. 对于**付款选项**，选择并配置您的首选付款选项。

1. 选择**下一步**。

1. 选择要与专属主机预留关联的专属主机，然后选择**下一步**。

1. （*可选*）为专属主机预留分配标签。

1. 审核您的订单，然后选择**购买**。

------
#### [ AWS CLI ]

**购买预留**

1. 使用 [describe-host-reservation-offerings](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-host-reservation-offerings.html) 命令列出符合您需求的可用服务产品。以下示例列出了支持 `m4` 实例系列中的实例并具有一年期限的服务产品。

   期限以秒为单位指定。一年期限包括 31536000 秒，三年期限包括 94608000 秒。

   ```
   aws ec2 describe-host-reservation-offerings \
       --filter Name={{instance-family}},Values={{m4}} \
       --max-duration {{31536000}}
   ```

   这条命令会返回符合您条件的服务产品的列表。记下要购买的服务或产品的 ID。

1. 使用 [purchase-host-reservation](https://docs.aws.amazon.com/cli/latest/reference/ec2/purchase-host-reservation.html) 命令购买服务产品并提供上一步中提到的 `offeringId`。以下示例购买指定的预留，并将其与AWS账户中已分配的特定专属主机关联，同时还应用具有键 `purpose` 和值 `production` 的标签。

   ```
   aws ec2 purchase-host-reservation \
       --offering-id {{hro-03f707bf363b6b324}} \
       --host-id-set {{h-013abcd2a00cbd123}} \
       --tag-specifications 'ResourceType=host-reservation,Tags={Key=purpose,Value=production}'
   ```

------
#### [ PowerShell ]

**购买预留**

1. 使用 [Get-EC2HostReservationOffering](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2HostReservationOffering.html) cmdlet 列出符合需求的可用服务和产品。以下示例列出了支持 `m5` 实例系列中的实例并具有一年期限的产品。

   期限以秒为单位指定。一年期限包括 31536000 秒，三年期限包括 94608000 秒。

   ```
   $filter = @{Name="instance-family"; Values="m5"}
   Get-EC2HostReservationOffering `
       -Filter $filter `
       -MaxDuration {{31536000}}
   ```

   这条命令会返回符合您条件的服务产品的列表。记下要购买的服务或产品的 ID。

1. 使用 [New-EC2HostReservation](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2HostReservation.html) cmdlet 购买服务和产品并提供上一步中记下的服务和产品 ID。以下示例购买指定的预留，并将其与AWS账户中已分配的特定专属主机关联。

   ```
   New-EC2HostReservation `
       -OfferingId {{hro-03f707bf363b6b324}} `
       -HostIdSet {{h-013abcd2a00cbd123}}
   ```

------
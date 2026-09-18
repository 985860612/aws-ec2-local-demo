

# 创建 容量预留
<a name="capacity-reservations-create"></a>

您可以随时创建容量预留，以确保在特定可用区拥有可用的计算容量。容量预留可以立即启动，也可以在未来的某个日期启动。只有在容量预留进入 `active` 状态后，容量才可供使用。

**注意**  
如果您创建了具有 `open` 实例匹配条件的容量预留，并且在容量预留变为活动状态时，您正在运行具有匹配属性的实例，则这些实例将自动在预留容量中运行。为避免这种情况，请使用 `targeted` 实例匹配条件。有关更多信息，请参阅 [实例匹配条件](cr-concepts.md#cr-instance-eligibility)。

如果出现以下情况之一，创建容量预留的请求会失败：
+ Amazon EC2没有足够的容量来满足请求。请稍后重试、尝试不同的可用区或者尝试较小的请求。如果您的应用程序灵活地跨实例类型和大小，请尝试不同的实例属性。
+ 请求的数量超过选定实例系列的个按需型实例限制。增加该实例系列的个按需型实例限制，然后重试。有关更多信息，请参阅 [按需型实例限额](ec2-on-demand-instances.md#ec2-on-demand-instances-limits)。

**Topics**
+ [创建可立即使用的容量预留](#create-immediate-cr)
+ [创建未来日期的容量预留](#create-future-cr)

## 创建可立即使用的容量预留
<a name="create-immediate-cr"></a>

创建可立即使用的容量预留。

------
#### [ Console ]

**创建容量预留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择 **容量预留 (容量预留)**，然后选择 **Create 容量预留 (创建容量预留)**。

1. 在**实例详细信息**部分中配置以下设置。

   1. **实例类型**：为其预留容量的实例类型。

   1. **平台**：您的实例的操作系统。有关更多信息，请参阅 [支持的平台](ec2-capacity-reservations.md#capacity-reservations-platforms)。

   1. **可用区**：在其中预留容量的可用区。

   1. **租赁**：用于预留容量的租赁类型。选择“默认”可在共享硬件上预留容量，或选择“专用”则在专用于您的账户的硬件上预留容量。

   1. （*可选*）**置放群组 ARN**：要在其中创建容量预留的集群置放群组的 ARN。有关更多信息，请参阅 [使用置放群组的容量预留](cr-cpg.md)。

   1. **总实例数**：为其预留容量的实例的数量。如果指定的数量超过了选定实例类型的剩余按需型实例配额，则请求将失败。

1. 在**预留详细信息**部分中配置以下设置：

   1. **容量预留开始**：选择**立即**。

   1. **容量预留结束**：选择以下选项之一：
      + **手动**：预留容量，直到您明确取消它。
      + **特定时间**：在指定的日期和时间自动取消容量预留。

   1. **实例资格**：选择以下选项之一：
      + **开放**：（默认值）容量预留匹配具有匹配属性（实例类型、平台、可用区和租赁）的任何实例。如果您启动具有匹配属性的实例，则会自动将其放置到预留容量中。
      + **针对性**：容量预留仅接受具有匹配属性（实例类型、平台、可用区和租赁）并明确针对预留的实例。

1. 选择**创建**。

------
#### [ AWS CLI ]

**创建容量预留**  
使用 [create-capacity-reservation](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-capacity-reservation.html) 命令。

```
aws ec2 create-capacity-reservation \
    --availability-zone {{az_name}} \
    --instance-type {{instance_type}} \
    --instance-count {{number_of_instances}} \
    --instance-platform {{operating_system}} \
    --instance-match-criteria {{open}}|{{targeted}}
```

------
#### [ PowerShell ]

**创建容量预留**  
使用 [Add-EC2CapacityReservation](https://docs.aws.amazon.com/powershell/latest/reference/items/Add-EC2CapacityReservation.html) cmdlet。

```
Add-EC2CapacityReservation `
    -AvailabilityZone {{az_name}} `
    -InstanceType {{instance_type}} `
    -InstanceCount {{number_of_instances}} `
    -InstancePlatform {{operating_system}} `
    -InstanceMatchCriterion {{open}}|{{targeted}}
```

------

## 创建未来日期的容量预留
<a name="create-future-cr"></a>

如果您需要预留容量在未来某个日期和时间可用，请请求未来日期的容量预留。

在您请求未来日期的容量预留后，该请求将接受评估以确定是否可以支持。有关更多信息，请参阅 [未来日期的容量预留评估](cr-concepts.md#cr-future-dated-assessment)。

**注意事项**
+ 您可以为 C、G、I、M、R、T、U 和 X 系列中的实例类型请求未来日期的容量预留。
+ 您可以为至少具有 32 个 vCPU 的实例计数请求未来日期的容量预留。例如，如果您为 `m5.xlarge` 实例请求未来日期的容量预留，则必须请求至少 8 个实例的容量（*8 \* m5.xlarge = 32 个 vCPU*）。
+ 您可以提前 5 至 120 天请求未来日期的容量预留。我们建议您至少提前 56 天（8 周）提出请求以提高可支持性。
+ C、G、I、M、R 和 T 实例的最短承诺期限为 14 天。对于 U 和 X 实例，最短承诺期限为 12 周。

------
#### [ Console ]

**创建容量预留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择 **容量预留 (容量预留)**，然后选择 **Create 容量预留 (创建容量预留)**。

1. 在**实例详细信息**部分中配置以下设置。

   1. **实例类型**：为其预留容量的实例类型。

   1. **平台**：您的实例的操作系统。有关更多信息，请参阅 [支持的平台](ec2-capacity-reservations.md#capacity-reservations-platforms)。

   1. **可用区**：在其中预留容量的可用区。

   1. **租赁**：用于预留容量的租赁类型。选择“默认”可在共享硬件上预留容量，或选择“专用”则在专用于您的账户的硬件上预留容量。

   1. **总实例数**：为其预留容量的实例的数量。如果指定的数量超过了选定实例类型的剩余按需型实例配额，则请求将失败。

1. 在**预留详细信息**部分中配置以下设置：

   1. **容量预留开始**：选择**在特定时间**。

   1. **开始日期**：指定容量预留必须可供使用的日期和时间。有关更多信息，请参阅 [开始日期和时间](cr-concepts.md#cr-start-date)。

   1. **承诺期限**：指定您承诺在容量预留交付后保留它的最短期限。有关更多信息，请参阅 [承诺期限](cr-concepts.md#cr-commitment-duration)。

   1. **容量预留结束**：选择以下选项之一：
      + **当我取消它时**：预留容量，直至您明确取消它。
      + **特定时间**：在指定的日期和时间自动取消容量预留。

1. 选择**创建**。

------
#### [ AWS CLI ]

**创建容量预留**  
使用 [create-capacity-reservation](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-capacity-reservation.html) 命令。

```
aws ec2 create-capacity-reservation \
    --availability-zone {{az_name}} \
    --instance-type {{instance_type}} \
    --instance-count {{number_of_instances}} \
    --instance-platform {{operating_system}} \
    --instance-match-criteria targeted \
    --delivery-preference incremental \
    --commitment-duration {{commitment_in_seconds}} \ 
    --start-date {{YYYY-MMDDThh:mm:ss.sssZ}}
```

------
#### [ PowerShell ]

**创建容量预留**  
使用 [Add-EC2CapacityReservation](https://docs.aws.amazon.com/powershell/latest/reference/items/Add-EC2CapacityReservation.html) cmdlet。

```
Add-EC2CapacityReservation `
    -AvailabilityZone {{az_name}} `
    -InstanceType {{instance_type}} `
    -InstanceCount {{number_of_instances}} `
    -InstancePlatform {{operating_system}} `
    -InstanceMatchCriterion targeted `
    -DeliveryPreference incremental `
    -CommitmentDuration {{commitment_in_seconds}} `
    -StartDate  {{YYYY-MMDDThh:mm:ss.sssZ}}
```

------


# 竞价型实例的工作原理
<a name="how-spot-instances-work"></a>

要启动竞价型实例，您可以创建竞价型实例*请求*，或者 Amazon EC2 代表您创建竞价型实例请求。竞价型实例在满足竞价型实例请求时启动。

您可以使用多种不同的服务启动竞价型实例。有关更多信息，请参阅 [Amazon EC2 竞价型实例入门](https://aws.amazon.com/ec2/spot/getting-started/)。在本用户指南中，我们介绍了以下使用 EC2 启动竞价型实例的方法：
+ 您可以使用 Amazon EC2 控制台中的[启动实例向导](ec2-launch-instance-wizard.md)或 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令创建竞价型实例请求。有关更多信息，请参阅 [管理您的竞价型实例](using-spot-instances-request.md)。
+ 您可以创建 EC2 实例集，在其中指定所需数量的竞价型实例。Amazon EC2 代表您为 EC2 实例集中指定的每个竞价型实例创建一个竞价型实例请求。有关更多信息，请参阅[创建 EC2 实例集](create-ec2-fleet.md)。
+ 您可以创建竞价型实例集请求，在其中指定所需数量的竞价型实例。Amazon EC2 代表您为竞价型实例集中指定的每个竞价型实例创建一个竞价型实例请求。有关更多信息，请参阅 [创建竞价型实例集](create-spot-fleet.md)。
**注意**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

如果有可用容量，则您的竞价型实例将启动。您的竞价型实例会一直运行，直到您停止或终止它，或者 Amazon EC2 中断它（称为*竞价型实例中断*）。Amazon EC2 可以在中断竞价型实例时使实例停止、终止或休眠。

当您使用竞价型实例时，您必须为中断做好准备。在竞价型实例需求增加或供应减少时，Amazon EC2 可能会中断您的竞价型实例。在 Amazon EC2 中断竞价型实例时，将提供竞价型实例中断通知，这会在 Amazon EC2 终止该实例之前为其提供两分钟的警告。无法为竞价型实例启用终止保护。有关更多信息，请参阅 [竞价型实例中断](spot-interruptions.md)。

**Topics**
+ [竞价型实例请求状态](#creating-spot-request-status)
+ [在启动组中启动竞价型实例](#spot-launch-group)
+ [在可用区组中启动竞价型实例](#spot-az-group)
+ [在 VPC 中启动竞价型实例](#concepts-spot-instances-vpcs)
+ [启动可突增性能实例](#burstable-spot-instances)
+ [在单租户硬件上启动](#spot-instance-tenancy)

## 竞价型实例请求状态
<a name="creating-spot-request-status"></a>

竞价型实例请求可以处于以下某种状态：
+ `open` – 请求正在等待执行。
+ `active` – 请求已执行并有关联的竞价型实例。
+ `failed` – 请求的一个或多个参数错误。
+ `closed` – 竞价型实例被中断或终止。
+ `disabled` – 您停止了竞价型实例。
+ `cancelled` – 您取消了请求或请求已过期。

以下显示了请求状态之间的转换。请注意，转换取决于请求类型 (一次性还是持久性)。

![竞价型实例请求的状态。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/spot_request_states.png)


一次性竞价型实例请求在 Amazon EC2 启动竞价型实例、请求过期前或者您取消请求前保持有效。当没有容量可用时，将终止您的竞价型实例并关闭竞价型实例请求。

持久性竞价型实例请求在过期或您取消它之前保持有效，即使该请求已完成也如此。当没有容量可用时，您的竞价型实例将会中断。在您的实例中断后，在再次具有可用的容量时，将会启动竞价型实例（如果已停止）或将其恢复（如果已休眠）。您可以停止竞价型实例，然后在有容量可用是重新启动实例。如果竞价型实例终止（无论竞价型实例处于停止状态还是正在运行状态），则会重新打开竞价型实例请求，并且 Amazon EC2 启动一个新的竞价型实例。有关更多信息，请参阅[停止竞价型实例](using-spot-instances-request.md#stopping-a-spot-instance)、[启动竞价型实例](using-spot-instances-request.md#starting-a-spot-instance)和[终止竞价型实例](using-spot-instances-request.md#terminating-a-spot-instance)。

您可以跟踪竞价型实例请求的状态以及通过该状态启动的竞价型实例的状态。有关更多信息，请参阅 [获取竞价型实例请求的状态](spot-request-status.md)。

## 在启动组中启动竞价型实例
<a name="spot-launch-group"></a>

在竞价型实例请求中指定启动组，可以通知 Amazon EC2 只有在可以全部启动一组竞价型实例时才启动该组。此外，如果 Spot 服务必须终止启动组中的某个实例，它必须终止所有实例。不过，如果由您终止启动组中的一个或多个实例，Amazon EC2 不会终止该启动组中的剩余实例。

尽管此选项有用处，但是添加此约束会减少完成竞价型实例请求的几率并且增加竞价型实例被终止的几率。例如，启动组包括多个可用区中的实例。如果其中一个可用区中的容量减少且不再可用，则 Amazon EC2 会终止启动组的所有实例。

如果您创建了另一个成功的竞价型实例请求并指定与之前成功请求相同（现有）的启动组，则新实例将添加到该启动组中。以后，在该启动组的一个实例终止时，启动组中的所有实例均会终止，这包括第一次请求和第二次请求启动的实例。

## 在可用区组中启动竞价型实例
<a name="spot-az-group"></a>

在竞价型实例请求中指定可用区组，可以通知 Amazon EC2 在同一可用区中启动一组竞价型实例。Amazon EC2 无需同时中断可用区组中的所有实例。如果 Amazon EC2 必须中断可用区组中的某个实例，剩余的实例仍保持运行。

虽然此选项非常有用，但添加此约束会减少完成您的竞价型实例请求的几率。

如果您指定了可用区组，但未在竞价型实例请求中指定可用区，则具体结果将取决于您所指定的网络。

**默认 VPC**  
Amazon EC2 使用指定子网的可用区。如果您未指定子网，它会为您选择一个可用区及其默认子网，但不一定是价格最低的可用区。如果您删除了可用区的默认子网，则必须指定其他子网。

**非默认 VPC**  
Amazon EC2 使用指定子网的可用区。

## 在 VPC 中启动竞价型实例
<a name="concepts-spot-instances-vpcs"></a>

按照为按需型实例指定子网的相同方法，为您的竞价型实例指定子网。
+ [默认 VPC] 如果希望在特定的低价格可用区中启动您的竞价型实例，您必须在竞价型实例请求中指定对应的子网。如果您没有指定子网，则 Amazon EC2 将为您选择一个子网，而该子网的可用区中的 Spot 价格不一定是最低的。
+ [非默认 VPC] 您必须为您的竞价型实例指定子网。

## 启动可突增性能实例
<a name="burstable-spot-instances"></a>

T 实例类型是[可突增性能实例](burstable-performance-instances.md)。如果您使用可突增性能的实例类型启动竞价型实例，并计划立即短时间使用可突增性能的竞价型实例，且没有空闲时间来累积 CPU 积分，建议您以[标准模式](burstable-performance-instances-standard-mode.md)启动实例，以避免支付更高的费用。如果您以[无限模式](burstable-performance-instances-unlimited-mode.md)启动可突增性能的竞价型实例并立即突增 CPU，您将会为突增花费超额积分。如果使用实例的时间很短，使得实例没有时间积累 CPU 积分来支付超额积分，则您将在终止实例时为超额积分付费。

仅当实例的运行时间较长，足以积累进行突增的 CPU 积分时，针对可突增性能的竞价型实例的无限模式才适用。否则，支付剩余积分会使可突增性能的竞价型实例比使用其他实例更加昂贵。有关更多信息，请参阅 [何时使用无限模式与固定 CPU](burstable-performance-instances-unlimited-mode-concepts.md#when-to-use-unlimited-mode)。

以[标准模式](burstable-performance-instances-standard-mode.md)配置的 T2 实例可获得[启动积分](burstable-performance-instances-standard-mode-concepts.md#launch-credits)。T2 实例是唯一可获得启动积分的可突增性能实例。通过提供足够的计算资源来配置实例，启动积分旨在为 T2 实例提供有成效的初始启动体验。不允许重复启动 T2 实例以访问新的启动积分。如果您需要持续的 CPU，您可以赚取积分（通过空转一段时间），将[无限模式](burstable-performance-instances-unlimited-mode.md)用于 T2竞价型实例，或将实例类型和专用 CPU 一起使用。

## 在单租户硬件上启动
<a name="spot-instance-tenancy"></a>

您可以在单租户硬件上运行竞价型实例。专用竞价型实例与属于其他 AWS 账户的实例物理隔离。有关更多信息，请参阅 [Amazon EC2 专用实例](dedicated-instance.md)和 [Amazon EC2 专用实例](https://aws.amazon.com/ec2/pricing/dedicated-instances/)。

要运行专用竞价型实例，请执行以下操作之一：
+ 在创建竞价型实例请求时，请指定租赁 `dedicated`。有关更多信息，请参阅[管理您的竞价型实例](using-spot-instances-request.md)。
+ 在 VPC 中请求实例租赁为 `dedicated` 的竞价型实例。有关更多信息，请参阅 [在具有默认租赁的 VPC 中启动专用实例](dedicatedinstancesintovpc.md)。如果您在 VPC 中请求实例租赁为 `dedicated` 的竞价型实例，则无法请求租赁为 `default` 的竞价型实例。

所有实例系列都支持除 T 实例外的专用竞价型实例。对于每个受支持的实例系列，只有最大的实例或设备支持专用竞价型实例。
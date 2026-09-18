

# 在 EC2 实例集和竞价型实例集中使用“容量再平衡”功能来替换存在风险的竞价型实例
<a name="ec2-fleet-capacity-rebalance"></a>

借助“容量再平衡”功能，EC2 实例集或竞价型实例集可以通过主动替换存在中断风险的竞价型实例来维持所需的竞价型容量。竞价型实例面临较高的中断风险时，Amazon EC2 会发送[再平衡建议](rebalance-recommendations.md)。如果启用了“容量再平衡”功能，则再平衡建议会在存在风险的实例中断之前，触发启动新的竞价型实例。

“容量再平衡”功能可在运行中的实例被 Amazon EC2 中断之前，主动使用新竞价型实例扩展实例集，从而帮助维持工作负载的可用性。

**配置 EC2 实例集使用“容量再平衡”功能来启动替换竞价型实例**  
使用 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令和 `MaintenanceStrategies` 结构中的相关参数。有关 JSON 配置示例，请参阅[示例 7：配置容量再平衡以启动替换竞价型实例](ec2-fleet-examples.md#ec2-fleet-config8)。

**配置竞价型实例集使用“容量再平衡”功能来启动替换竞价型实例**  
您可以使用 Amazon EC2 控制台或 AWS CLI 来配置“容量再平衡”功能。

（控制台）创建竞价型实例集时，选中**容量重新平衡**复选框。有关更多信息，请参阅[使用已定义的参数创建竞价型实例集请求](create-spot-fleet.md#create-spot-fleet-advanced)中的步骤 6.d..

（AWS CLI）使用 [request-spot-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-fleet.html) 命令和 `SpotMaintenanceStrategies` 结构中的相关参数。有关 JSON 配置示例，请参阅[示例 8：配置容量再平衡以启动替换竞价型实例](spot-fleet-examples.md#fleet-config8)。

**Topics**
+ [限制](#ec2-fleet-capacity-rebalance-limitations)
+ [配置选项](#ec2-fleet-capacity-rebalance-config-options)
+ [注意事项](#ec2-fleet-capacity-rebalance-considerations)

## 限制
<a name="ec2-fleet-capacity-rebalance-limitations"></a>
+ 容量再平衡仅适用于类型为 `maintain` 的机群。
+ 队列运行时，您无法修改容量再平衡设置。要更改容量再平衡设置，您必须删除此队列并创建新队列。

## 配置选项
<a name="ec2-fleet-capacity-rebalance-config-options"></a>

EC2 实例集和竞价型实例集的 `ReplacementStrategy` 支持以下两个值：

`launch-before-terminate`  
Amazon EC2 可以在新的替换竞价型实例启动后终止接收再平衡通知的竞价型实例。如果指定 `launch-before-terminate`，还必须为 `termination-delay` 指定值。启动新的替换实例后，Amazon EC2 将等待 `termination-delay` 的持续时间，然后终止旧实例。对于 `termination-delay`，最短为 120 秒（2 分钟），最长为 7200 秒（2 小时）。  
建议仅当您可以预测实例关闭过程完成所需的时长时才使用 `launch-before-terminate`。这将确保只有在关闭过程完成后才终止旧实例。请注意，Amazon EC2 可能会在 `termination-delay` 之前中断旧实例，并发出两分钟警告。  
强烈建议不要将 `lowest-price`（EC2 实例集）或 `lowestPrice`（竞价型实例集）分配策略与 `launch-before-terminate` 结合使用，避免让替换竞价型实例面临较高的中断风险。

`launch`  
针对现有竞价型实例发出再平衡通知时，Amazon EC2 将启动替换竞价型实例。Amazon EC2 不会终止接收再平衡通知的实例。您可以终止旧实例，也可以使其保持运行状态。在实例运行期间，您需要为它们付费。

## 注意事项
<a name="ec2-fleet-capacity-rebalance-considerations"></a>

如果针对“容量再平衡”功能配置 EC2 实例集或竞价型实例集，请考虑以下事项：

**在请求中提供尽可能多的 Spot 容量池**  
将实例集配置为使用多种实例类型和多个可用区。这提供了在各种 Spot 容量池中启动竞价型实例的灵活性。有关更多信息，请参阅 [灵活地选择实例类型和可用区](spot-best-practices.md#be-instance-type-flexible)。

**避免替换竞价型实例中断的风险升高**  
为避免中断风险增加，我们建议使用 `capacity-optimized` 或 `capacity-optimized-prioritized` 分配策略。这些策略确保替换竞价型实例在最佳的竞价型容量池中启动，因此在不久的将来不太可能被中断。有关更多信息，请参阅 [使用价格和容量优化分配策略](spot-best-practices.md#use-capacity-optimized-allocation-strategy)。  
如果使用 `lowest-price` 分配策略，替换竞价型实例可能会面临较高的中断风险。这是因为，即使替换竞价型实例可能在启动后不久中断，Amazon EC2 始终会在当时具有可用容量的价格最低池中启动实例。

**只有可用性相同或更好时，Amazon EC2 才会启动新实例**  
容量再平衡的目标之一是提高竞价型实例的可用性。如果现有竞价型实例收到再平衡建议，Amazon EC2 只有在新实例提供与现有实例相同或更好的可用性时才会启动新实例。如果新实例的中断风险比现有实例更高，那么 Amazon EC2 将不会启动新实例。但是，Amazon EC2 将继续评测 Spot 容量池，并在可用性改善时启动新实例。  
如果 Amazon EC2 没有主动启动新实例，则您的现有实例可能会中断。发生这种情况时，无论新实例的中断风险是否较高，Amazon EC2 都会尝试启动新实例。

**容量再平衡不会提高您的竞价型实例中断率**  
当您启用容量再平衡时，它不会提高您的[竞价型实例中断率](spot-interruptions.md)（在 Amazon EC2 需要收回容量时回收的竞价型实例的数量）。然而，如果容量再平衡检测到实例存在中断风险，Amazon EC2 将立即尝试启动新实例。结果是，与存在风险的实例中断后等待 Amazon EC2 启动新实例相比，可能会替换更多实例。  
虽然在启用了容量再平衡的情况下您可以更换更多实例，但在中断您的实例之前，您会有更多时间采取行动，从而因为处于主动而非被动地位而受益。使用 [Spot Instance interruption notice](spot-instance-termination-notices.md)（竞价型实例中断通知），您通常最多只有两分钟的时间来正常关闭您的实例。借助容量再平衡提前启动新实例，您可以使现有流程更有可能在存在风险的实例上完成，您可以启动实例关闭程序，并防止在存在风险的实例上安排新工作。您还可以开始准备新启动的实例，以接管应用程序。借助容量再平衡的主动替换，您可以因绝佳的连续性而受益。  
作为演示使用容量再平衡的风险和优点的理论示例，请考虑以下场景：  
+ 下午 2:00 – 收到针对实例 A 的再平衡建议，Amazon EC2 立即开始尝试启动替换实例 B，让您有时间启动关闭程序。\*
+ 下午 2:30 - 收到针对实例 B 的再平衡建议，该实例将被替换为实例 C，让您有时间启动关闭程序。\*
+ 下午 2:32 - 如果未启用容量再平衡，并且如果在下午 2:32 收到针对实例 A 的竞价型实例中断通知，则您最多只有两分钟时间采取行动，但实例 A 将一直运行到此时。
\* 如果指定了 `launch-before-terminate`，Amazon EC2 将在替换实例上线后终止存在风险的实例。

**Amazon EC2 可以启动新替换竞价型实例，直到已执行容量达到目标容量的两倍**  
针对“容量再平衡”功能配置实例集时，实例集会尝试为接收再平衡建议的每个竞价型实例启动新的替换竞价型实例。在竞价型实例收到再平衡建议后，它不再统计为已执行容量的一部分。根据替换策略，Amazon EC2 将在预配置的终止延迟后终止实例，或使其保持运行状态。这使您有机会对实例执行[再平衡操作](rebalance-recommendations.md#rebalancing-actions)。  
如果您的队列达到目标容量的两倍，即使替换实例本身收到再平衡建议，它也会停止启动新的替换实例。  
例如，您创建的实例集目标容量为 100 个竞价型实例。所有竞价型实例都会收到再平衡建议，这将导致 Amazon EC2 启动 100 个替换竞价型实例。这使已执行的竞价型实例的数量增加到 200 个，是目标容量的两倍。一些替换实例会收到再平衡建议，但由于实例集不能超过其目标容量的两倍，因此不会再启动更多替换实例。  
请注意，在实例运行期间，您需要为所有实例付费。

**建议将实例集配置为终止接收再平衡建议的竞价型实例**  
如果针对“容量再平衡”功能配置实例集，建议仅在可以预测实例关闭过程完成所需的时长时，才选择 `launch-before-terminate` 和适当的终止延迟。这将确保只有在关闭过程完成后才终止旧实例。  
如果您选择自行终止建议再平衡的实例，我们建议您监控机群中的竞价型实例接收的再平衡建议信号。通过监控信号，您可以在 Amazon EC2 中断受影响的实例之前快速对其执行[再平衡操作](rebalance-recommendations.md#rebalancing-actions)，然后您可以手动终止它们。如果您不终止实例，则需要在实例运行期间继续为其付费。Amazon EC2 不会自动终止接收再平衡建议的实例。  
您可以使用 Amazon EventBridge 或实例元数据设置通知。有关更多信息，请参阅 [监控再平衡建议信号](rebalance-recommendations.md#monitor-rebalance-recommendations)。

**在计算横向缩减或横向扩展期间的已执行容量时，实例集会排除收到再平衡建议的实例**  
如果针对“容量再平衡”功能配置了实例集，并且将目标容量更改为横向缩减或横向扩展，则实例集不会将标记为再平衡的实例计算为已执行容量的一部分，如下所示：  
+ 横向缩减 – 如果您降低所需的目标容量，Amazon EC2 将终止未标记为再平衡的实例，直到达到所需容量。标记为再平衡的实例不计入已执行容量。

  例如，您创建的竞价型实例集目标容量为 100 个竞价型实例。10 个实例会收到再平衡建议，因此 Amazon EC2 会启动 10 个新的替换实例，从而获得 110 个实例的执行容量。然后，您将目标容量减少到 50 个（横向缩减），但已执行的容量实际上为 60 个实例，因为 Amazon EC2 不会终止标记为再平衡的 10 个实例。您需要手动终止这些实例，也可以让它们保持运行状态。
+ 横向扩展 – 如果您增加所需的目标容量，Amazon EC2 将启动新实例，直到达到所需容量。标记为再平衡的实例不计入已执行容量。

  例如，您创建的实例集目标容量为 100 个竞价型实例。10 个实例会收到再平衡建议，因此实例集启动 10 个新的替换实例，从而获得 110 个实例的执行容量。然后，您将目标容量增加到 200（扩展），但已执行的容量实际上为 210 个实例，因为标记为再平衡的 10 个实例不被队列计入目标容量的一部分。您需要手动终止这些实例，也可以让它们保持运行状态。
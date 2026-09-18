

# Amazon EC2 竞价型实例的最佳实践
<a name="spot-best-practices"></a>

Amazon EC2 通过竞价型实例提供 AWS Cloud 中的备用 EC2 计算容量，与按需型实例价格相比，这种实例最高可以节省 90% 的成本。按需型实例和竞价型实例之间的唯一区别是，当 Amazon EC2 需要回收容量时，Amazon EC2 可以中断竞价型实例并提前两分钟发出通知。要确保在使用竞价型实例时获得最佳体验，必须了解并运用最佳使用实践。

竞价型实例建议用于无状态、容错且灵活的应用程序。例如，竞价型实例非常适合大数据、容器化工作负载、CI/CD、无状态 Web 服务器、高性能计算 (HPC) 和渲染工作负载。

在运行时，竞价型实例与按需型实例完全相同。不过，Spot 不能保证您可以将运行的实例保持足够长的时间以完成工作负载。Spot 也不能保证您可以立即使用查找的实例，或者不能保证您始终可以获得请求的总容量。此外，竞价型实例中断和容量可能会随着时间的推移而发生变化，因为竞价型实例可用性根据供需关系而发生变化，过去的性能并不能保证将来的结果。

竞价型实例不适用于不灵活、有状态、非容错或在实例节点之间紧密耦合的工作负载。对于不能容忍整个目标容量偶尔不完全可用的工作负载，也不建议使用竞价型实例。虽然遵循竞价型最佳实践来灵活处理实例类型和可用区可以实现高可用性，但这不能保证始终有可用的容量，因为对按需型实例的需求激增可能会中断竞价型实例上的工作负载。

强烈建议不要在这些工作负载中使用竞价型实例，也不要尝试失效转移到按需型实例，来处理中断或一段时间内不可用的问题。失效转移到按需型实例可能会无意中导致其他竞价型实例发生中断。此外，如果实例类型和可用区组合的竞价型实例发生中断，可能会很难获得具有相同组合的按需型实例。

无论您是经验丰富的 Spot 用户还是竞价型实例新用户，如果您当前遇到竞价型实例中断或可用性问题，我们建议您按照以下最佳实践以获得使用 Spot 服务的最佳体验。

**Topics**
+ [准备各个实例以处理中断](#prep-instances-for-interruptions)
+ [灵活地选择实例类型和可用区](#be-instance-type-flexible)
+ [使用基于属性的实例类型选择](#use-attribute-based-instance-type-selection)
+ [使用竞价放置分数来确定最佳区域和可用区](#use-spot-placement-scores-to-identify-optimal-regions-and-availability-zones)
+ [使用 EC2 自动扩缩组或 EC2 实例集管理总容量](#use-sf-asg-for-aggregate-capacity)
+ [使用价格和容量优化分配策略](#use-capacity-optimized-allocation-strategy)
+ [使用集成的 AWS 服务以管理竞价型实例](#use-integrated-aws-services)
+ [使用哪种竞价型请求方法最好？](#which-spot-request-method-to-use)

## 准备各个实例以处理中断
<a name="prep-instances-for-interruptions"></a>

正常处理竞价型实例中断的最佳方法是，设计应用程序以提供容错能力。为此，您可以利用 EC2 实例再平衡建议和竞价型实例中断通知。

EC2 实例再平衡建议是一个信号，可在竞价型实例处于较高的中断风险时通知您。该信号使您有机会在两分钟的竞价型实例中断通知之前主动管理竞价型实例。您可以决定将工作负载再平衡到不处于较高中断风险的新的或现有的竞价型实例。借助自动扩缩组和 EC2 实例集中的容量再平衡功能，您可以轻松使用这个新信号。

竞价型实例中断通知是在 Amazon EC2 中断竞价型实例之前的两分钟发出的警告。如果工作负载为“时间灵活型”负载，您可以将竞价型实例配置为在中断时停止或休眠，而不是终止。Amazon EC2 在中断时使竞价型实例自动停止或休眠，并在我们具有可用容量时自动恢复这些实例。

我们建议您在 [Amazon EventBridge](https://docs.aws.amazon.com/eventbridge/index.html) 中创建一个规则以捕获再平衡建议和中断通知，然后触发工作负载进度的检查点或正常处理中断。有关更多信息，请参阅[监控再平衡建议信号](rebalance-recommendations.md#monitor-rebalance-recommendations)。有关指导您如何创建和使用事件规则的详细示例，请参阅[利用 Amazon EC2 竞价型实例中断通知](https://aws.amazon.com/blogs/compute/taking-advantage-of-amazon-ec2-spot-instance-interruption-notices/)。

有关更多信息，请参阅[EC2 实例再平衡建议](rebalance-recommendations.md) 和 [竞价型实例中断](spot-interruptions.md)。

## 灵活地选择实例类型和可用区
<a name="be-instance-type-flexible"></a>

竞价型容量池是具有相同实例类型（如 `m5.large`）和可用区（如 us-east-1a）的未使用 EC2 实例的集合。您应该灵活地选择请求哪些实例类型，以及可以在哪些可用区中部署工作负载。这为 Spot 提供了更好的机会以查找和分配所需数量的计算容量。例如，如果您希望使用 c4、m5 和 m4 系列中的大型实例，则不要仅请求 `c5.large`。

根据您的特定需求，您可以评估可灵活地选择哪些实例类型以满足您的计算要求。如果可以纵向扩展工作负载，您应该在请求中包括更大的实例类型（更多的 vCPU 和内存）。如果您只能横向扩展，您应该包括较旧一代的实例类型，因为按需客户很少需要使用它们。

一条很好的经验法则是，对于每种工作负载，灵活地在至少 10 种实例类型之间进行选择。此外，还要确保所有可用区配置为在 VPC 中使用，并为工作负载选择了这些可用区。

## 使用基于属性的实例类型选择
<a name="use-attribute-based-instance-type-selection"></a>

使用基于属性的实例类型选择后，可以为要运行的工作负载指定实例属性，例如 vCPU、内存和存储。之后，EC2 Auto Scaling 或 EC2 实例集会自动识别并启动与指定属性匹配的实例。这省去了手动选择特定实例类型所需的工作，免于深入了解每种实例类型的产品。

此外，基于属性的实例类型选择支持在新发布的实例类型可用时自动使用这些实例类型。此举可确保无缝访问范围越来越广泛的竞价型实例容量。

基于属性的实例类型选择适用于可以灵活确定所运行实例类型的工作负载和框架，例如高性能计算（HPC）和大数据工作负载。

有关更多信息，请参阅《Amazon EC2 Auto Scaling User Guide》**中的 [Create mixed instances group using attribute-based instance type selection](https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-mixed-instances-group-attribute-based-instance-type-selection.html)，以及本指南中的[指定 EC2 实例集或竞价型实例集的实例类型选择属性](ec2-fleet-attribute-based-instance-type-selection.md)。

## 使用竞价放置分数来确定最佳区域和可用区
<a name="use-spot-placement-scores-to-identify-optimal-regions-and-availability-zones"></a>

竞价型实例属于未使用的 EC2 容量，此类容量会因 EC2 的供需情况产生波动。因此，想在特定时间于特定地点获得所需的确切竞价型容量，并不总是可行。您可以使用竞价放置分数功能来应对这种不可预测性。此功能为更有可能拥有足够容量来满足竞价型容量需求的区域或可用区提供建议，不要求先在这些位置启动竞价型实例。

竞价放置分数适用于可以灵活确定实例类型及其可使用的区域或可用区的工作负载。您要做的就是指定所需的竞价型容量、实例类型要求，以及是否需要针对区域或可用区的建议。随后，每个区域或可用区会获得 1 到 10 的分数，表明在该位置成功预置请求的竞价型容量的可能性。10 分数表示竞价请求极有可能成功。

务必注意，竞价放置分数属于时间点建议，因为容量可能会随时间发生变化。其既不能保证可用容量，也不能预测中断风险。

您可以通过 Amazon EC2 控制台、AWS CLI 或软件开发工具包使用竞价放置分数功能。有关更多信息，请参阅 [竞价放置分数](spot-placement-score.md)。

## 使用 EC2 自动扩缩组或 EC2 实例集管理总容量
<a name="use-sf-asg-for-aggregate-capacity"></a>

Spot 允许您考虑总容量（包括 vCPU、内存、存储或网络吞吐量），而不是考虑单个实例。通过使用自动扩缩组和 EC2 实例集，您可以启动和维持目标容量，自动请求资源以替换任何中断或手动终止的资源。在配置自动扩缩组或 EC2 实例集时，您仅需要根据应用程序需求指定实例类型和目标容量。有关更多信息，请参阅 *Amazon EC2 Auto Scaling 用户指南* 中的 [Auto Scaling 组](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html)和本用户指南中的[创建 EC2 实例集](create-ec2-fleet.md)。

## 使用价格和容量优化分配策略
<a name="use-capacity-optimized-allocation-strategy"></a>

Auto Scaling 组中的分配策略可以帮助您预置目标容量，而无需手动查找具有备用容量的 Spot 容量池。我们建议使用 `price-capacity-optimized` ‎‏‏‏‎策略，因为该策略自动从可用性最佳的竞价型容量池中预置实例，同时也具有最低价格。您也可以在 EC2 实例集中利用 `price-capacity-optimized` 分配策略。由于竞价型实例容量来自于具有最佳容量的池，因此，这会降低回收竞价型实例的可能性。有关更多信息，请参阅《Amazon EC2 Auto Scaling User Guide》**中的 [Allocation strategies for multiple instance types](https://docs.aws.amazon.com/autoscaling/ec2/userguide/allocation-strategies.html) 和本用户指南中的[当工作负载拥有较高中断成本时](ec2-fleet-allocation-strategy.md#ec2-fleet-strategy-capacity-optimized)。

## 使用集成的 AWS 服务以管理竞价型实例
<a name="use-integrated-aws-services"></a>

其他 AWS 服务与 Spot 集成在一起以降低总体计算成本，而无需管理各个实例或实例集。我们建议您为适用的工作负载考虑以下解决方案：Amazon EMR、Amazon Elastic Container Service、AWS Batch、Amazon Elastic Kubernetes Service、Amazon SageMaker AI、AWS Elastic Beanstalk 和 Amazon GameLift Servers。要了解这些服务的 Spot 最佳实践的更多信息，请参阅 [Amazon EC2 竞价型实例 Workshops 网站](https://ec2spotworkshops.com/)。

## 使用哪种竞价型请求方法最好？
<a name="which-spot-request-method-to-use"></a>

使用下表确定在请求竞价型实例时使用哪个 API。



| API | 何时使用？ | 使用案例 | 我应该使用这个 API 吗？ | 
| --- | --- | --- | --- | 
| [CreateAutoScalingGroup](https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_CreateAutoScalingGroup.html) |  +  您需要多个采用单一配置或混合配置的实例。 <br />+  您希望通过可配置的 API 自动执行生命周期管理。   | 创建一个 Auto Scaling 组，以管理实例的生命周期，同时保持所需的实例数量。支持在指定的最小和最大限值之间的水平扩展（添加更多实例）。 | 是 | 
| [CreateFleet](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateFleet.html) |  +  您需要多个采用单一配置或混合配置的实例。 <br />+  您希望自行管理实例生命周期。 <br />+  如果不需要弹性伸缩，我们建议您使用 `instant` 类型的实例集。   | 在单个请求中创建一个由按需型实例和竞价型实例组成的实例集，并具有多个因实例类型、AMI、可用区或子网而异的启动规范。竞价型实例分配策略默认为每单位 `lowest-price`，但您可以将其更改为 `price-capacity-optimized`、`capacity-optimized` 或 `diversified`。 | 是 - 如果不需要自动扩缩，则在 `instant` 模式下 | 
| [RunInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RunInstances.html)： |  +  您已经在使用 RunInstances API 启动按需型实例，而且只想通过更改单个参数来更改为启动竞价型实例。 <br />+  您不需要多个实例类型不同的实例。   | 使用 AMI 和一个实例类型启动指定数量的实例。 | 否 - 因为 RunInstances 不允许在单个请求中混合多个实例类型 | 
| [RequestSpotFleet](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RequestSpotFleet.html) |  +  我们强烈反对使用 RequestSpotFleet API，因为它是不具有计划投资的旧式 API。 <br />+  如果想要管理实例生命周期，请使用 CreateFleet API。 <br />+  如果不想管理实例生命周期，请使用 CreateAutoScalingGroup API。   | 请勿使用。RequestSpotFleet 是不具有计划投资的旧式 API。 | 否 | 
| [RequestSpotInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RequestSpotInstances.html) |  +  我们强烈反对使用 RequestSpotInstances API，因为它是不具有计划投资的旧式 API。   | 请勿使用。RequestSpotInstances 是不具有计划投资的旧式 API。 | 否 | 
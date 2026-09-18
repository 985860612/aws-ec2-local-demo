

# 哪种是实例集最佳使用方法？
<a name="which-fleet-method-to-use"></a>

作为一般最佳实践，我们建议使用 Amazon EC2 Auto Scaling 启动竞价型实例和按需型实例实例集，因为其能够提供可用于管理实例集的其他功能。其他功能列表包括竞价型实例和按需型实例的自动运行状况检查替换、基于应用程序的运行状况检查，以及与弹性负载均衡器的集成，可确保将应用程序流量均匀分配到运行正常的实例。在使用 Amazon ECS、Amazon EKS（自管理式节点组）和 Amazon VPC Lattice 等 AWS 服务时，也可以使用自动扩缩组。有关更多信息，请参阅 [Amazon EC2 Auto Scaling 用户指南](https://docs.aws.amazon.com/autoscaling/ec2/userguide/)。

如果您无法使用 Amazon EC2 Auto Scaling，则可以考虑使用 EC2 实例集或竞价型实例集。EC2 实例集和竞价型实例集提供相同的核心功能。不过，EC2 实例集仅可通过命令行使用，不提供控制台支持。竞价型实例集提供控制台支持，但使用的是旧版 API，且暂无相关投资计划。

使用下表来确定要使用哪种实例集方法。



| 实例集方法 | 何时使用？ | 使用案例 | 
| --- | --- | --- | 
| [Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) |  +  您需要多个采用单一配置或混合配置的实例。 <br />+  您想要自动执行实例的生命周期管理。   | 创建一个 Auto Scaling 组，以管理实例的生命周期，同时保持所需的实例数量。支持在指定的最小和最大限值之间的水平扩展（添加更多实例）。 | 
| [EC2 实例集](manage-ec2-fleet.md) |  +  您需要多个采用单一配置或混合配置的实例。 <br />+  您希望自行管理实例生命周期。 <br />+  如果不需要自动扩缩，建议使用 `instant` 类型的 EC2 实例集。   | 在单次操作中创建一个由按需型实例和竞价型实例组成的 `instant` 实例集，并具有多个因实例类型、AMI、可用区或子网而异的启动规范。竞价型实例分配策略默认按单位计算 `lowest-price`，但建议将其改为 `price-capacity-optimized`。 | 
| [竞价型实例集](work-with-spot-fleets.md) –  |  +  强烈反对使用竞价型实例集，因为其使用的是旧版 API，且暂无相关投资计划。 <br />+  如果想要管理实例生命周期，请使用 EC2 实例集。 <br />+  如果不想管理实例生命周期，请使用自动扩缩组。   | 仅在使用 EC2 实例集的用例中需要控制台支持时，才使用竞价型实例集。 | 


# 使用容量预留来预留 EC2 实例集中的按需型容量
<a name="ec2-fleet-on-demand-capacity-reservations"></a>

通过使用按需容量预留，您可以在特定可用区中为按需实例预留计算容量达任意持续时间。您可以将 EC2 队列配置为在启动按需实例时首先使用容量预留。

按需容量预留仅适用于请求类型设置为 `instant` 的 EC2 实例集。

容量预留配置为 `open` 或者 `targeted`。EC2 队列可以将按需实例启动到 `open` 或者 `targeted` 容量预留，如下所示：
+ 如果容量预留为 `open`，具有匹配属性的按需实例会自动在预留容量预留容量中运行。
+ 如果容量预留处于 `targeted` 状态，只有专门定位到其中的按需实例才能在预留容量中运行。这对于使用特定的能力预留或控制何时使用特定的能力预留非常有用。

如果您使用 `targeted` EC2 队列中的容量预留，必须有足够的容量预留才能满足目标按需容量，否则启动失败。为了避免启动失败，请将 `targeted` 能力预留资源组，然后将资源组定位为目标。资源组不需要足够的容量预留；如果在满足目标按需容量之前，其容量预留不足，资源组将剩余的目标容量启动为常规按需容量。

**将容量预留与 EC2 队列结合使用**

1. 将队列配置为类型 `instant`。您不能将容量预留用于其他类型的队列。

1. 将容量预留的使用策略配置为 `use-capacity-reservations-first`。

1. 在启动模板中，**容量预留**中，选择**打开**或者**按组列分类的目标**。如果您选择**按组列分类的目标**中，指定能力预留资源组 ID。

当队列尝试满足按需容量时，如果发现多个实例池具有未使用的匹配容量预留，则会根据按需分配策略确定启动按需实例的池（`lowest-price` 或者 `prioritized`)。

**相关资源**
+ 有关如何将实例集配置为使用容量预留来实现按需容量的 CLI 示例，请参阅[EC2 实例集 CLI 配置示例](ec2-fleet-examples.md)，特别是示例 5 到 7。
+ 有关指导您完成创建容量预留、在实例集中使用容量预留以及查看剩余容量预留数量的教程，请参阅[教程：使用目标容量预留配置 EC2 实例集以启动按需型实例](ec2-fleet-launch-on-demand-instances-using-targeted-capacity-reservations-walkthrough.md)
+ 您还可以将 EC2 Fleet 配置为使用单个容量预留资源组，在多个容量预留类型（按需容量预留、ML 容量块和可中断容量预留）中启动实例，并选择性回退到按需容量。要执行此操作，请使用 `ReservedCapacityOptions`，并将 `DefaultTargetCapacityType` 设置为 `reserved-capacity`。有关教程，请参阅 [教程：将 EC2 Fleet 配置为使用容量预留资源组，将实例启动到多个容量预留类型中](ec2-fleet-launch-instances-multiple-cr-types-walkthrough.md)。
+ 有关配置容量预留的信息，请参阅 [使用 EC2 按需容量预留来预留计算容量](ec2-capacity-reservations.md) 和[按需容量预留常见问题](https://aws.amazon.com/ec2/faqs/#On-Demand_Capacity_Reservation)。


# 容量预留资源组
<a name="cr-groups"></a>

您可以使用 AWS Resource Groups 创建称为*容量预留资源组*（组）的容量预留逻辑集合。容量预留资源组是一个包含容量预留的资源组，您可以通过指定单个容量预留资源组 ARN，将实例启动到多个容量预留中。有关容量预留资源组的更多信息，请参阅 *AWS Resource Groups 用户指南*中的[什么是资源组？](https://docs.aws.amazon.com/ARG/latest/userguide/)

当指定一个组来启动实例时，Amazon EC2 会将实例与该组中具有匹配属性和可用容量的任意容量预留进行匹配。

您可以将您账户中拥有的容量预留，以及其他 AWS 账户与您共享的容量预留包含在单个组中。您也可以将具有不同属性（实例类型、平台、可用区、租赁和置放群组）的容量预留包含在单个组中。

资源组支持所有预留类型，包括[按需容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html)、[可中断容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/interruptible-capacity-reservations.html)和[ ML 容量块](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html)。您可以将任意组合的预留类型添加到单个组中。

**Topics**
+ [创建组](cr-groups-create.md)
+ [向组中添加容量预留](cr-groups-add.md)
+ [将实例启动到组中的容量预留](cr-groups-launch.md)
+ [从组中删除容量预留](cr-groups-remove.md)
+ [实例在组中的生命周期](cr-groups-lifecycle.md)
+ [删除组](cr-groups-delete.md)


# 共享置放群组
<a name="share-placement-group"></a>

通过置放群组共享，您可以影响由单独 AWS 账户拥有的相互依赖实例的置放。所有者可在多个 AWS 账户 之间或在其组织内共享一个置放群组。参与者可以在与其账户共享的置放群组中启动实例。

置放群组所有者可与以下人员共享置放群组：
+ 其组织内部或外部的特定 AWS 账户
+ 其 组织内的组织部门
+ 其整个 组织

可以使用 VPC 对等连接独立 AWS 账户拥有的实例，获得共享集群置放群组提供的全部延迟优势。

**Topics**
+ [规则和限制](#share-placement-group-limitations)
+ [所需的权限](#share-placement-group-permissions)
+ [跨可用区共享](#share-placement-group-sharing-azs)
+ [置放群组共享](#share-placement-group-share)
+ [取消置放群组共享](#share-placement-group-unshare)

## 规则和限制
<a name="share-placement-group-limitations"></a>

当您共享置放群组或与您共享置放群组时，请遵循以下规则和限制。
+ 要共享置放群组，您必须在您的 AWS 账户中拥有该置放群组。无法共享已与自己共享的置放群组。
+ 共享分区或扩展分布置放群组时，置放群组限制不会改变。共享分区置放群组支持每个可用区最多七个分区，共享分布置放群组支持每个可用区最多七个运行实例。
+ 要与您的组织或组织内的组织部门共享放置组，您必须允许与 AWS Organizations 共享。有关更多信息，请参阅[共享 AWS 资源](https://docs.aws.amazon.com/ram/latest/userguide/getting-started-sharing.html)。
+ 使用 AWS 管理控制台 启动实例时，可以选择已与自己共享的任何置放群组。使用 AWS CLI 启动实例时，必须按 ID 而非名称来指定共享置放群组。只有当您是共享置放群组的所有者时，才能使用置放群组的名称。
+ 您负责管理共享置放群组中您拥有的实例。
+ 您无法查看或修改与共享置放群组有关但不属于您的实例和容量预留。
+ 置放群组的 Amazon 资源名称（ARN）包含拥有该置放群组的账户 ID。您可以使用置放群组 ARN 的账户 ID 部分来识别与您共享的置放群组的所有者。

## 所需的权限
<a name="share-placement-group-permissions"></a>

要共享置放群组，用户必须具有执行以下操作的权限：
+ `ec2:PutResourcePolicy`
+ `ec2:DeleteResourcePolicy`

## 跨可用区共享
<a name="share-placement-group-sharing-azs"></a>

为确保资源分配到区域的各可用区，我们将可用区独立映射到每个账户的名称。这可能会导致账户之间的可用区命名差异。例如，您 AWS 账户的可用区 `us-east-1a` 可能与另一 AWS 账户的 `us-east-1a` 不在同一位置。

要指定专属主机相对于账户的位置，您必须使用*可用区 ID*（AZ ID）。AZ ID 是跨所有 AWS 账户的可用区的唯一且一致的标识符。例如，`use1-az1` 是 `us-east-1` 区域的可用区 ID，它在每个 AWS 账户中的位置均相同。有关更多信息，请参阅 [AZ IDs](https://docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html)。

## 置放群组共享
<a name="share-placement-group-share"></a>

要共享置放群组，您必须将其添加到资源共享。资源共享是一项 AWS RAM 资源，可让您跨 AWS 账户共享资源。资源共享指定要共享的资源以及与之共享资源的使用者。

如果您属于 AWS Organizations 中的某个组织并且已在您的组织中启用共享，则组织中的使用者将获得对共享置放群组的访问权限。

如果将置放群组与您组织以外的 AWS 账户共享，则 AWS 账户所有者将会收到加入资源共享的邀请。他们可在接受邀请后访问共享的置放群组。

您可以使用 AWS Resource Access Manager 在多个 AWS 账户之间共享置放群组。有关更多信息，请参阅《AWS RAM User Guide》**中的 [Creating a resource share](https://docs.aws.amazon.com/ram/latest/userguide/working-with-sharing-create.html)。

## 取消置放群组共享
<a name="share-placement-group-unshare"></a>

置放群组所有者随时可以将共享置放群组取消共享。将共享置放群组取消共享时，将发生以下更改：
+ 与之共享置放群组的 AWS 账户将无法再启动实例或预留容量。
+ 任何正在共享置放群组中运行的实例都将与该置放群组断开关联，但会继续在 AWS 账户中运行。
+ 共享置放群组中的所有容量预留容量都将与该置放群组断开关联，但仍可在 AWS 账户中可用。

有关更多信息，请参阅《AWS RAM User Guide》**中的 [Deleting a resource share](https://docs.aws.amazon.com/ram/latest/userguide/working-with-sharing-delete.html)。
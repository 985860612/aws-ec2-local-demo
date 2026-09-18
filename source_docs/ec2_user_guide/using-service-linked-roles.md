

# 将服务相关角色用于容量预留实例集
<a name="using-service-linked-roles"></a>

按需容量预留实例集将使用 AWS Identity and Access Management（IAM）[服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html#id_roles_terms-and-concepts)。服务相关角色是一种独特类型的 IAM 角色，它与容量预留实例集直接相关。服务相关角色由容量预留实例集预定义，并包含该服务代表您调用其他 AWS 服务所需的一切权限。

服务相关角色可让您更轻松地设置容量预留实例集，因为您不必手动添加必要的权限。容量预留实例集定义其服务相关角色的权限，除非另外定义，否则只有容量预留实例集可以代入其角色。定义的权限包括信任策略和权限策略，以及不能附加到任何其他 IAM 实体的权限策略。

只有在首先删除相关资源后，您才能删除服务关联角色。这将保护您的容量预留实例集资源，因为您不会无意中删除对资源的访问权限。

## 容量预留实例集的服务相关角色权限
<a name="slr-permissions"></a>

容量预留实例集使用名为 **AWSServiceRoleForEC2CapacityReservationFleet** 的服务相关角色，来创建、描述、修改和取消以前代表您在容量预留实例集中创建的容量预留。

AWSServiceRoleForEC2CapacityReservationFleet 服务相关角色信任以下实体来担任角色：
+ `capacity-reservation-fleet.amazonaws.com`

该角色使用 `AWSEC2CapacityReservationFleetRolePolicy` AWS 托管式策略。有关更多信息，请参阅 [AWS 托管式策略：AWSEC2CapacityReservationFleetRolePolicy](security-iam-awsmanpol.md#security-iam-awsmanpol-AWSEC2CapacityReservationFleetRolePolicy)。

您必须配置权限，允许 IAM 实体（如用户、组或角色）创建、编辑或删除服务关联角色。有关更多信息，请参阅*《IAM 用户指南》*中的[服务关联角色权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create-service-linked-role.html#service-linked-role-permissions)。

## 创建容量预留实例集的服务相关角色
<a name="create-slr"></a>

您无需手动创建服务关联角色。使用 `create-capacity-reservation-fleet` AWS CLI 命令或 `CreateCapacityReservationFleet` API 创建容量预留实例集时，系统将自动为您创建服务相关角色。

如果您删除该服务关联角色，然后需要再次创建，您可以使用相同流程在账户中重新创建此角色。创建容量预留实例集时，容量预留实例集会再次为您创建服务相关角色。

## 编辑容量预留实例集的服务相关角色
<a name="edit-slr"></a>

容量预留实例集不允许您编辑 Amazon Web Services ServiceRoleForEC2CapacityReservationFleet 服务相关角色。创建服务关联角色后，您将无法更改角色的名称，因为可能有多种实体引用该角色。但是可以使用 IAM 编辑角色描述。有关更多信息，请参阅《IAM 用户指南》**中的[编辑服务相关角色描述](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_update-service-linked-role.html#edit-service-linked-role-iam-console)。

## 删除容量预留实例集的服务相关角色
<a name="delete-slr"></a>

如果您不再需要使用某个需要服务相关角色的功能或服务，我们建议您删除该角色。这样您就没有未被主动监控或维护的未使用实体。但是，您必须先删除服务相关角色的资源，然后才能手动删除它。

**注意**  
如果在您试图删除资源时容量预留实例集服务正在使用该角色，则删除操作可能会失败。如果发生这种情况，请等待几分钟后重试。

**要删除 Amazon Web Services ServiceRoleForEC2CapacityReservationFleet 服务相关角色**

1. 使用 `delete-capacity-reservation-fleet` AWS CLI 命令或 `DeleteCapacityReservationFleet` API 删除您的账户中的容量预留实例集。

1. 使用 IAM 控制台、AWS CLI 或 AWS API 删除 Amazon Web Services ServiceRoleForEC2CapacityReservationFleet 服务相关角色。有关更多信息，请参阅《IAM 用户指南》**中的[删除服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage_delete.html#id_roles_manage_delete_slr)。

## 容量预留实例集服务相关角色支持的区域
<a name="slr-regions"></a>

容量预留实例集支持在服务可用的所有区域中使用服务相关角色。有关更多信息，请参阅 [AWS 区域和端点](https://docs.aws.amazon.com/general/latest/gr/ec2-service.html#ec2_region)。
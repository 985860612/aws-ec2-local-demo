

# EC2 Instance Connect Endpoint 的服务相关角色
<a name="eice-slr"></a>

Amazon EC2 使用 AWS Identity and Access Management（IAM）[服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html#iam-term-service-linked-role)。服务相关角色是一种独特类型的 IAM 角色，它与 Amazon EC2 直接相关。服务相关角色由 Amazon EC2 预定义，并包含 Amazon EC2 代表您调用其他 AWS 服务 所需的一切权限。有关更多信息，请参阅《IAM 用户指南》**中的[服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create-service-linked-role.html)。

## EC2 Instance Connect 端点的服务相关角色
<a name="slr-permissions"></a>

Amazon EC2 使用 **AWSServiceRoleForEC2InstanceConnect** 在您的账户中创建和管理 EC2 Instance Connect 端点需要的网络接口。

**AWSServiceRoleForEC2InstanceConnect** 服务相关角色信任以下服务来担任该角色：
+ `ec2-instance-connect.amazonaws.com`

**AWSServiceRoleForEC2InstanceConnect** 服务相关角色使用以下托管式策略：
+ **Ec2InstanceConnectEndpoint**

要查看托管式策略的权限，请参阅《AWS 托管式策略参考》**中的 [Ec2InstanceConnectEndpoint](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/Ec2InstanceConnectEndpoint.html)。

## 创建 EC2 Instance Connect 端点的服务相关角色
<a name="create-slr"></a>

您无需手动创建该服务相关角色。创建 EC2 Instance Connect 端点时，Amazon EC2 将为您创建该服务相关角色。

## 编辑 EC2 Instance Connect 端点的服务相关角色
<a name="edit-slr"></a>

EC2 Instance Connect Endpoint 不允许您编辑 **AWSServiceRoleForEC2InstanceConnect** 服务相关角色。

## 删除 EC2 Instance Connect 端点的服务相关角色
<a name="delete-slr"></a>

如果您不再需要使用 EC2 Instance Connect Endpoint，我们建议您删除 **AWSServiceRoleForEC2InstanceConnect** 服务相关角色。

必须首先删除所有 EC2 Instance Connect 端点资源后，然后才能删除该服务相关角色。

要删除服务相关角色，请参阅《IAM 用户指南》**中的[删除服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage_delete.html#id_roles_manage_delete-slr)。

您必须配置权限，允许 IAM 实体（用户、组或角色）创建、编辑或删除服务相关角色。有关更多信息，请参阅*《IAM 用户指南》*中的[服务关联角色权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create-service-linked-role.html#service-linked-role-permissions)。
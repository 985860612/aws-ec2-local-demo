

# 使用 EC2 容量管理器的服务相关角色
<a name="using-service-linked-roles-cm"></a>

EC2 容量管理器使用 AWS Identity and Access Management（IAM）[服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#iam-term-service-linked-role)。服务相关角色是一种与容量管理器直接关联的独特类型的 IAM 角色。服务相关角色由容量管理器预定义，并包含该服务代表您调用其他 AWS 服务所需的一切权限。

服务相关角色可让您更轻松地设置容量管理器，因为您不必手动添加必要的权限。容量管理器定义其服务相关角色的权限，除非另外定义，否则只有容量管理器可以代入该角色。定义的权限包括信任策略和权限策略，以及不能附加到任何其他 IAM 实体的权限策略。

只有在首先删除相关资源后，您才能删除服务关联角色。这将保护容量管理器资源，因为您不会无意中删除对资源的访问权限。

有关支持服务相关角色的其他服务的信息，请参阅[使用 IAM 的 AWS 服务](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-services-that-work-with-iam.html)，并查找**服务相关角色**列中显示为**是**的服务。选择**是**和链接，查看该服务的服务关联角色文档。

## 容量管理器的服务相关角色权限
<a name="slr-permissions"></a>

容量管理器使用名为 **AWSServiceRoleForEC2CapacityManager** 的服务相关角色，允许您管理容量资源并代表您与 AWS Organizations 集成。

AWSServiceRoleForEC2CapacityManager 服务相关角色信任以下服务代入该角色：
+ `ec2.capacitymanager.amazonaws.com`

名为 AWSEC2CapacityManagerServiceRolePolicy 的角色权限策略允许容量管理器完成以下操作：
+  `organizations:DescribeOrganization` 
+  `organizations:ListAccounts` 
+  `organizations:ListChildren` 
+  `organizations:ListAWSServiceAccessForOrganization` 
+  `organizations:ListDelegatedAdministrators` 

您必须配置使用户、组或角色能够创建、编辑或删除服务相关角色的权限。有关更多信息，请参阅*《IAM 用户指南》*中的[服务相关角色权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html#service-linked-role-permissions)。

## 创建容量管理器的服务相关角色
<a name="create-slr"></a>

您可以使用 IAM 控制台创建具有 **AWSEC2CapacityManagerServiceRolePolicy** 使用案例的服务相关角色。在 AWS CLI 或 AWS API 中，使用 `ec2.capacitymanager.amazonaws.com` 服务名称创建服务相关角色。有关更多信息，请参阅《IAM 用户指南》中的[创建服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html#create-service-linked-role)**。如果您删除了此服务相关角色，可以使用同样的过程再次创建角色。

## 编辑容量管理器的服务相关角色
<a name="edit-slr"></a>

容量管理器不允许您编辑 AWSServiceRoleForEC2CapacityManager 服务相关角色。创建服务关联角色后，您将无法更改角色的名称，因为可能有多种实体引用该角色。但是可以使用 IAM 编辑角色描述。有关更多信息，请参阅《IAM 用户指南》**中的[编辑服务关联角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html#edit-service-linked-role)。

## 删除容量管理器的服务相关角色
<a name="delete-slr"></a>

如果您不再需要使用某个需要服务相关角色的功能或服务，我们建议您删除该角色。这样您就没有未被主动监控或维护的未使用实体。但是，您必须先清除服务相关角色的资源，然后才能手动删除它。

**注意**  
如果在您试图删除资源时容量管理器服务正在使用该角色，则删除操作可能会失败。如果发生这种情况，请等待几分钟后重试。

**移除 AWSServiceRoleForEC2CapacityManager 使用的容量管理器资源**

1. 所有委派管理员都必须在移除组织访问权限之前禁用其容量管理器。

1. 在禁用容量管理器之前，必须删除所有活动的数据导出。

**使用 IAM 手动删除服务关联角色**

使用 IAM 控制台、AWS CLI 或 AWS API 删除 AWSServiceRoleForEC2CapacityManager 服务相关角色。有关更多信息，请参阅《IAM 用户指南》**中的[删除服务相关角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html#delete-service-linked-role)。

## 容量管理器服务相关角色支持的区域
<a name="slr-regions"></a>

容量管理器支持在服务可用的所有区域中使用服务相关角色。有关更多信息，请参阅 [AWS 区域和端点](https://docs.aws.amazon.com/general/latest/gr/rande.html)。

容量管理器并非在提供该服务的每个区域中都支持使用服务相关角色。您可以在以下区域中使用 AWSServiceRoleForEC2CapacityManager 角色。


| 区域名称 | 区域标识 | 容量管理器中的支持 | 
| --- | --- | --- | 
| 美国东部（弗吉尼亚州北部） | us-east-1 | 是 | 
| 美国东部（俄亥俄州） | us-east-2 | 是 | 
| 美国西部（北加利福尼亚） | us-west-1 | 是 | 
| 美国西部（俄勒冈州） | us-west-2 | 是 | 
| 非洲（开普敦） | af-south-1 | 否 | 
| 亚太地区（香港） | ap-east-1 | 否 | 
| 亚太地区（雅加达） | ap-southeast-3 | 否 | 
| 亚太地区（孟买） | ap-south-1 | 是 | 
| 亚太地区（大阪） | ap-northeast-3 | 是 | 
| 亚太地区（首尔） | ap-northeast-2 | 是 | 
| 亚太地区（新加坡） | ap-southeast-1 | 是 | 
| 亚太地区（悉尼） | ap-southeast-2 | 是 | 
| 亚太地区（东京） | ap-northeast-1 | 是 | 
| 加拿大（中部） | ca-central-1 | 是 | 
| 欧洲地区（法兰克福） | eu-central-1 | 是 | 
| 欧洲地区（爱尔兰） | eu-west-1 | 是 | 
| 欧洲地区（伦敦） | eu-west-2 | 是 | 
| 欧洲地区（米兰） | eu-south-1 | 否 | 
| 欧洲地区（巴黎） | eu-west-3 | 是 | 
| 欧洲地区（斯德哥尔摩） | eu-north-1 | 是 | 
| 中东（巴林） | me-south-1 | 否 | 
| 中东（阿联酋） | me-central-1 | 否 | 
| 南美洲（圣保罗） | sa-east-1 | 是 | 
| AWS GovCloud (US-East) | us-gov-east-1 | 否 | 
| AWS GovCloud（美国西部） | us-gov-west-1 | 否 | 
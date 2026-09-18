

# AWSAmazon EC2 的 托管式策略
<a name="security-iam-awsmanpol"></a>

要向用户、组和角色添加权限，与自己编写策略相比，使用 AWS 托管式策略更简单。创建仅为团队提供所需权限的 [IAM 客户管理型策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html)需要时间和专业知识。要快速入门，您可以使用我们的 AWS 托管式策略。这些策略涵盖常见使用案例，可在您的 AWS 账户中使用。有关 AWS 托管式策略的更多信息，请参阅《IAM 用户指南》**中的 [AWS 托管式策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html#aws-managed-policies)。

AWS 服务负责维护和更新 AWS 托管式策略。您无法更改 AWS 托管式策略中的权限。服务偶尔会向 AWS 托管式策略添加额外权限以支持新特征。此类更新会影响附加策略的所有身份（用户、组和角色）。当启动新特征或新操作可用时，服务最有可能会更新 AWS 托管式策略。服务不会从 AWS 托管式策略中删除权限，因此策略更新不会破坏您的现有权限。

此外，AWS 还支持跨多种服务的工作职能的托管式策略。例如，**ReadOnlyAccess** AWS 托管策略提供对所有 AWS 服务和资源的只读访问权限。当服务启动新特征时，AWS 会为新操作和资源添加只读权限。有关工作职能策略的列表和说明，请参阅*《IAM 用户指南》*中的[适用于工作职能的 AWS 托管策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html)。

## AWS 托管策略：AmazonEC2FullAccess
<a name="security-iam-awsmanpol-AmazonEC2FullAccess"></a>

您可以将 `AmazonEC2FullAccess` 策略附加得到 IAM 身份。此策略授予允许完全访问 Amazon EC2 的权限。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [AmazonEC2FullAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2FullAccess.html)**。

## AWS 托管式策略：AmazonEC2ReadOnlyAccess
<a name="security-iam-awsmanpol-AmazonEC2ReadOnlyAccess"></a>

您可以将 `AmazonEC2ReadOnlyAccess` 策略附加到 IAM 身份。此策略授予允许对 Amazon EC2 进行只读访问的权限。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [AmazonEC2ReadOnlyAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2ReadOnlyAccess.html)**。

## AWS 托管式策略：AmazonEC2ImageReferencesAccessPolicy
<a name="security-iam-awsmanpol-AmazonEC2ImageReferencesAccessPolicy"></a>

您可以将 `AmazonEC2ImageReferencesAccessPolicy` 策略附加到 IAM 身份。此策略授予使用 EC2 DescribeImageReferences API 所需的权限，包括查看 EC2 实例、启动模板、Systems Manager 参数和 Image Builder 配方的权限。该策略支持 `IncludeAllResourceTypes` 标志，并且当 AWS 添加对新资源类型的支持时将继续工作，从而无需进行未来的策略更新。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [AmazonEC2ImageReferencesAccessPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEC2ImageReferencesAccessPolicy.html)**。

## AWS 托管式策略：AWSEC2CapacityReservationFleetRolePolicy
<a name="security-iam-awsmanpol-AWSEC2CapacityReservationFleetRolePolicy"></a>

此策略将附加到名为 **AWSServiceRoleForEC2CapacityReservationFleet** 的服务相关角色，以允许服务代表您在容量预留实例集中创建、修改和取消容量预留。有关更多信息，请参阅 [将服务相关角色用于容量预留实例集](using-service-linked-roles.md)。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [AWSEC2CapacityReservationFleetRolePolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSEC2CapacityReservationFleetRolePolicy.html)**。

## AWS 托管式策略：AWSEC2FleetServiceRolePolicy
<a name="security-iam-awsmanpol-AWSEC2FleetServiceRolePolicy"></a>

此策略将附加到名为 **AWSServiceRoleForEC2Fleet** 的服务相关角色，以允许 EC2 实例集代表您请求、启动、终止和标记实例。有关更多信息，请参阅 [EC2 实例集的服务相关角色](ec2-fleet-prerequisites.md#ec2-fleet-service-linked-role)。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [AWSEC2FleetServiceRolePolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSEC2FleetServiceRolePolicy.html)**。

## AWS 托管式策略：AWSEC2SpotFleetServiceRolePolicy
<a name="security-iam-awsmanpol-AWSEC2SpotFleetServiceRolePolicy"></a>

此策略将附加到名为 **AWSServiceRoleForEC2SpotFleet** 的服务相关角色，以允许竞价型实例集代表您启动和管理实例。有关更多信息，请参阅 [竞价型实例集的服务相关角色](spot-fleet-prerequisites.md#service-linked-roles-spot-fleet-requests)。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [AWSEC2SpotFleetServiceRolePolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSEC2SpotFleetServiceRolePolicy.html)**。

## AWS 托管式策略：AWSEC2SpotServiceRolePolicy
<a name="security-iam-awsmanpol-AWSEC2SpotServiceRolePolicy"></a>

此策略将附加到名为 **AWSServiceRoleForEC2Spot** 的服务相关角色，以允许 Amazon EC2 代表您启动和管理 Spot 实例。有关更多信息，请参阅 [竞价型实例请求的服务相关角色](service-linked-roles-spot-instance-requests.md)。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [AWSEC2SpotServiceRolePolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSEC2SpotServiceRolePolicy.html)**。

## AWS 托管式策略：AWSEC2VssSnapshotPolicy
<a name="security-iam-awsmanpol-AWSEC2VssSnapshotPolicy"></a>

您可以将此托管策略附加到用于 Amazon EC2 Windows 实例的 IAM 实例配置文件角色。该策略授予允许 Amazon EC2 代表您创建和管理 VSS 快照的权限。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [AWSEC2VssSnapshotPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSEC2VssSnapshotPolicy.html)**。

## AWS 托管式策略：DeclarativePoliciesEC2Report
<a name="security-iam-awsmanpol-DeclarativePoliciesEC2Report"></a>

此策略将附加到名为 `AWSServiceRoleForDeclarativePoliciesEC2Report` 的服务相关角色，以提供对为声明式策略生成账户状态报告所需的只读 API 的访问权限。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [DeclarativePoliciesEC2Report](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/DeclarativePoliciesEC2Report.html)**。

## AWS 托管式策略：EC2FastLaunchFullAccess
<a name="security-iam-awsmanpol-EC2FastLaunchFullAccess"></a>

您可以将 `EC2FastLaunchFullAccess` 策略附加到实例配置文件或其他 IAM 角色。此策略会授予对 EC2 Fast Launch 操作的完全访问权限以及目标权限，如下所示。

**权限详细信息**
+ **EC2 Fast Launch** – 授予管理访问权限，便于角色启用或禁用 EC2 Fast Launch 并描述 EC2 Fast Launch 映像。
+ **Amazon EC2**：授予对 Amazon EC2 RunInstances、CreateTags，以及启动模版描述、创建和修改操作的访问权限。此外还授予了创建网络和安全组资源、授权入口规则以及删除 EC2 Fast Launch 所创建资源的访问权限。
+ **IAM** – 授予访问权限，以获取和使用名称包含 `ec2fastlaunch` 的实例配置文件，进而创建 EC2FastLaunchServiceRolePolicy 服务相关角色。
+ **CloudFormation**：向 EC2 Fast Launch 授予了描述和创建 CloudFormation 堆栈以及删除所创建堆栈的访问权限。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [EC2FastLaunchFullAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/EC2FastLaunchFullAccess.html)**。

## AWS 托管式策略：AWSEC2CapacityManagerServiceRolePolicy
<a name="security-iam-awsmanpol-AWSEC2CapacityManagerServiceRolePolicy"></a>

此策略将附加到名为 **AWSServiceRoleForEC2CapacityManager** 的服务相关角色，以允许 EC2 容量管理器代表您管理容量资源并与 AWS Organizations 集成。有关更多信息，请参阅 [EC2 容量管理器的服务相关角色](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-service-linked-roles-cm.html)。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [AWSEC2CapacityManagerServiceRolePolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSEC2CapacityManagerServiceRolePolicy.html)**。

## AWS 托管式策略：EC2FastLaunchServiceRolePolicy
<a name="security-iam-awsmanpol-EC2FastLaunchServiceRolePolicy"></a>

此策略将附加到名为 **AWSServiceRoleForEC2FastLaunch** 的服务相关角色，以允许 Amazon EC2 创建和管理一组预置快照，从而减少从启用了 EC2 Fast Launch 的 AMI 启动实例所需的时间。有关更多信息，请参阅 [用于 EC2 Fast Launch 的服务相关角色](slr-windows-fast-launch.md)。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [EC2FastLaunchServiceRolePolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/EC2FastLaunchServiceRolePolicy.html)**。

## AWS 托管式策略：Ec2InstanceConnect
<a name="Ec2InstanceConnect"></a>

您可以将 `Ec2InstanceConnect` 策略附加到 IAM 身份。此策略授予相应权限，允许客户调用 EC2 Instance Connect 向其 EC2 实例发布临时密钥，并通过 SSH 或 EC2 Instance Connect CLI 进行连接。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [Ec2InstanceConnect](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/EC2InstanceConnect.html)**。

## AWS 托管式策略：Ec2InstanceConnectEndpoint
<a name="Ec2InstanceConnectEndpoint"></a>

此策略附加到名为 **AWSServiceRoleForEC2InstanceConnect** 的服务相关角色，以允许 EC2 Instance Connect 端点代表您执行操作。有关更多信息，请参阅 [EC2 Instance Connect Endpoint 的服务相关角色](eice-slr.md)。

要查看此策略的权限，请参阅《AWS 托管式策略参考》中的 [Ec2InstanceConnectEndpoint](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/Ec2InstanceConnectEndpoint.html)**。有关此策略更新的说明，请参阅 [AWS 托管策略的 Amazon EC2 更新](#security-iam-awsmanpol-updates)。

## AWS 托管策略的 Amazon EC2 更新
<a name="security-iam-awsmanpol-updates"></a>

查看有关 Amazon EC2 的 AWS 托管策略的更新的详细信息（此服务开始跟踪这些更改）。


| 更改 | 描述 | 日期 | 
| --- | --- | --- | 
| [AWSEC2CapacityManagerServiceRolePolicy](#security-iam-awsmanpol-AWSEC2CapacityManagerServiceRolePolicy) - 新策略 | Amazon EC2 新增了此策略，以便可以代表您管理容量资源并与 AWS Organizations 集成。 | 2025 年 10 月 15 日 | 
| [AmazonEC2ImageReferencesAccessPolicy](#security-iam-awsmanpol-AmazonEC2ImageReferencesAccessPolicy)：新策略 | Amazon EC2 添加了此策略，以提供扫描 EC2 DescribeImageReferences API 支持的所有资源类型的权限。 | 2025 年 8 月 26 日 | 
| [Ec2InstanceConnectEndpoint](#Ec2InstanceConnectEndpoint) - 更新的策略 | 为了支持修改现有实例连接端点，Amazon EC2 更新了此策略，以添加分配和取消分配 IPv6 地址的权限，并修改 EC2 实例连接端点创建的网络接口上的安全组。Amazon EC2 还更新了此策略，用 StringLike 条件运算符替换了 Null 条件运算符。 | 2025 年 7 月 31 日 | 
| [EC2FastLaunchServiceRolePolicy](#security-iam-awsmanpol-EC2FastLaunchServiceRolePolicy) - 更新的策略 | 为了防止出现孤立资源，Amazon EC2 对此策略进行了更新，增加了描述卷、卷属性和网络接口的权限，并增加了删除 EC2 Fast Launch 创建的卷和网络接口的权限。 | 2025 年 7 月 17 日 | 
| [EC2FastLaunchFullAccess](#security-iam-awsmanpol-EC2FastLaunchFullAccess) - 更新的策略 | Amazon EC2 对此策略进行了更新，包含了启动模板创建和修改操作的权限，以及创建网络和安全组资源、授权入口规则以及删除 EC2 Fast Launch 所创建资源的权限。此外还可以描述和创建 CloudFormation 堆栈，以及删除 EC2 Fast Launch 创建的堆栈。 | 2025 年 5 月 14 日 | 
| [EC2FastLaunchServiceRolePolicy](#security-iam-awsmanpol-EC2FastLaunchServiceRolePolicy) - 更新的策略 | Amazon EC2 对此策略进行了更新，增加了可让 EC2 Fast Launch 创建和管理事件规则的 Amazon EventBridge 访问权限。此外，EC2 Fast Launch 现在还可以描述 CloudFormation 堆栈，利用关联到 AWS License Manager 的 AMI 启动实例，获取由其创建并且可以停用的 AWS KMS 授权列表，以及删除由其创建的启动模板。 | 2025 年 5 月 14 日 | 
| [AWSEC2CapacityReservationFleetRolePolicy](#security-iam-awsmanpol-AWSEC2CapacityReservationFleetRolePolicy) – 更新了权限 | Amazon EC2 更新了 AWSEC2CapacityReservationFleetRolePolicy 托管式策略，使用 ArnLike 条件运算符，而不是 StringLike 条件运算符。 | 2025 年 3 月 3 日 | 
| [AmazonEC2ReadOnlyAccess](#security-iam-awsmanpol-AmazonEC2ReadOnlyAccess)：添加了权限 | Amazon EC2 添加了一项权限，允许使用 GetSecurityGroupsForVpc 操作检索安全组。 | 2024 年 12 月 27 日 | 
| [EC2FastLaunchFullAccess](#security-iam-awsmanpol-EC2FastLaunchFullAccess)：新策略 | Amazon EC2 添加了此策略，以便在实例中执行与 EC2 Fast Launch 功能相关的 API 操作。对从启用了 EC2 Fast Launch 的 AMI 启动的实例，该策略可以附加到其实例配置文件。 | 2024 年 5 月 14 日 | 
| [AWSEC2VssSnapshotPolicy](#security-iam-awsmanpol-AWSEC2VssSnapshotPolicy)：新策略 | Amazon EC2 添加了 AWSEC2VssSnapshotPolicy 策略，该策略包含创建标签并将标签添加到亚马逊机器映像（AMI）和 EBS 快照的权限。 | 2024 年 3 月 28 日 | 
| [Ec2InstanceConnectEndpoint](#Ec2InstanceConnectEndpoint)：新策略 | Amazon EC2 添加了 Ec2InstanceConnectEndpoint 策略。此策略附加到 AWSServiceRoleForEC2InstanceConnect 服务相关角色，以允许 Amazon EC2 在您创建 EC2 Instance Connect Endpoint 时代表您执行操作。 | 2023 年 1 月 24 日 | 
| [EC2FastLaunchServiceRolePolicy](#security-iam-awsmanpol-EC2FastLaunchServiceRolePolicy)：新策略 | Amazon EC2 添加了 EC2 Fast Launch 功能，如此一来，只需创建一组预置快照，便能让 Windows AMI 更快地启动实例。 | 2021 年 11 月 26 日 | 
| Amazon EC2 开始跟踪更改 | Amazon EC2 已开始跟踪 AWS 托管式策略的更改 | 2021 年 3 月 1 日 | 
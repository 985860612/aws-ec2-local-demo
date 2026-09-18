

# Amazon EC2 托管式实例
<a name="amazon-ec2-managed-instances"></a>

*Amazon EC2 托管实例*是指由指定服务提供商预置和管理的 EC2 实例。托管式实例允许将实例的操作控制权委派给服务提供商，由此简化在 Amazon EC2 上运行计算工作负载的方式。

委派控制权是为托管式实例引入的唯一变更。技术规格和计费方面与非托管 EC2 实例保持一致。由于托管式实例允许将控制权委派给服务提供商，您可以从服务提供商的运营专业知识和最佳实践中受益。对于托管式实例，服务提供商会负责执行预置实例、配置软件、扩缩容量、处理实例故障和替换以及终止实例等任务。

不能直接修改托管式实例的设置或将其终止。服务及具体操作由您与服务提供商之间的协议决定。不过，您可以在托管式实例中添加、修改或删除标签，以便在自己的 AWS 环境中对实例进行分类。

以下 AWS 服务提供托管实例：
+ [EKS 自动模式](https://docs.aws.amazon.com/eks/latest/userguide/automode.html)
+ [Amazon ECS 托管实例](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ManagedInstances.html)
+ [WorkSpaces Core 托管实例](https://docs.aws.amazon.com/workspaces-core/latest/pg/deploy-instances.html)
+ [Lambda 托管实例](https://docs.aws.amazon.com/lambda/latest/dg/lambda-managed-instances.html)
+ [Amazon EC2 Fast Launch](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/win-ami-config-fast-launch.html)
+ [Bedrock AgentCore 运行时实例](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-instances-how-it-works.html)

**Topics**
+ [托管式实例的账单](#billing-for-ec2-managed-instances)
+ [确定托管式实例](#identify-ec2-managed-instances)
+ [托管资源可见性设置](#managed-resource-visibility-settings)
+ [开始使用托管式实例](#get-started-with-ec2-managed-instances)

## 托管式实例的账单
<a name="billing-for-ec2-managed-instances"></a>

Amazon EC2 托管式实例的基本费用与非托管 Amazon EC2 实例的相同，但需另外向服务提供商支付一笔费用。这笔额外费用单独计费，由管理您实例的服务提供商收取。范围涵盖了托管式实例操作和维护服务所需的费用。

所有 [Amazon EC2 购买选项](instance-purchasing-options.md)都适用于托管式实例，包括按需型实例、预留实例、竞价型实例和节省计划。通过将从 EC2 中直接获取的计算实例提供给服务提供商，您可以从适用于自己账户的任何现有预留实例或节省计划中受益，确保自己使用的是最具成本效益的可用计算容量。

例如，在使用 Amazon EKS 自动模式时，您需要为基础实例支付一笔标准 EC2 实例费用，还要就 Amazon EKS 代为管理实例支付一笔额外费用。如果之后决定注册[节省计划](https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html)，EC2 实例费用会因节省计划而减少，但 Amazon EKS 的额外费用保持不变。

## 确定托管式实例
<a name="identify-ec2-managed-instances"></a>

托管式实例由**托管**字段中的 **true** 进行标识。服务提供商由（控制台中的）**运营商**字段或（CLI 中的）`Principal` 字段标识。

按照以下过程确定托管式实例。

------
#### [ Console ]

**确定托管式实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择要检查的实例。

1. 在**详细信息**选项卡（如果选中了复选框）或摘要区域（如果选择了实例 ID）中，找到**托管**字段。
   + 值为 **true** 表示托管式实例。
   + 值为 **false** 表示非托管式实例。

1. 如果将**托管**设置为 **true**，则**运营商**字段会显示一个值，用于标识负责管理实例的服务提供商。例如，值为 **eks.amazonaws.com** 表示将 Amazon EKS 标识为服务提供商。

------
#### [ AWS CLI ]

**确定托管式实例**  
使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令并指定实例 ID。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --query Reservations[].Instances[].Operator
```

下面是示例输出。如果 `Managed` 为 `true`，表示该实例属于托管式实例并且包含一个 `Principal`。主体即为管理实例的服务提供商。例如，值为 `eks.amazonaws.com` 表示将 Amazon EKS 标识为服务提供商。

```
[
    {
        "Managed": true,
        "Principal": "eks.amazonaws.com"
    }
]
```

**查找托管式实例**  
使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令并指定值为 `true` 的 `operator.managed` 筛选条件。`--query` 选项用于仅显示托管式实例的 ID。

```
aws ec2 describe-instances \
    --filters "Name=operator.managed,Values=true" \
    --query Reservations[*].Instances[].InstanceId
```

------
#### [ PowerShell ]

**确定托管式实例**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance -InstanceId {{i-1234567890abcdef0}}).Instances.Operator
```

下面是示例输出。

```
Managed Principal
------- ---------
True    eks.amazonaws.com
```

**查找托管式实例**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。此示例仅显示托管式实例的 ID。

```
(Get-EC2Instance -Filter @{Name="operator.managed"; Values="true"}).Instances.InstanceId
```

------

## 托管资源可见性设置
<a name="managed-resource-visibility-settings"></a>

您可以控制 AWS 服务代表您预置的资源是否显示在 Amazon EC2 控制台视图及 API 列表操作中。

### 什么是托管资源可见性？
<a name="what-is-managed-resource-visibility"></a>

诸如 Amazon EKS、Amazon ECS、WorkSpaces Core、AWS Lambda 和 Amazon Bedrock AgentCore 等 AWS 服务可在您的账户内直接预置和运行 Amazon EC2 实例。这些服务负责扩展、操作系统补丁、安全更新以及生命周期管理。生成的 Amazon EC2 实例、Amazon EC2 启动模板、Amazon EBS 卷、快照和网络接口（ENI）将与您的客户自主管理型资源一同显示在 Amazon EC2 控制台和 API 中。托管资源可见性设置可让您控制这些托管资源是否会在资源视图中显示。

### 受影响的资源类型
<a name="managed-resource-visibility-affected-resource-types"></a>


| 资源类型 | 预置这些资源的服务 | 说明 | 
| --- | --- | --- | 
| Amazon EC2 实例 | Amazon EKS Worker 节点、Amazon ECS 容器实例、AWS Lambda 执行环境、Amazon WorkSpaces Core、Amazon Bedrock AgentCore | 受可见性设置影响的主要资源类型 | 
| Amazon EC2 启动模板 | Amazon EKS、Amazon ECS、Amazon WorkSpaces Core、Amazon Bedrock AgentCore | 启动由托管服务创建的模板 | 
| Amazon EBS 卷 | Amazon EKS、Amazon ECS、Amazon WorkSpaces Core、Amazon Bedrock AgentCore、Amazon EC2 Fast Launch | 附加到托管实例的卷 | 
| Amazon EBS 快照 | Amazon EC2 Fast Launch | 由 Amazon EC2 Fast Launch 管理的快照 | 
| 网络接口（ENI） | Amazon EKS、Amazon ECS、AWS Lambda、Amazon WorkSpaces Core、Amazon Bedrock AgentCore、Amazon EC2 Application Status Checks | 针对托管工作负载预置的网络接口 | 

**注意**  
默认情况下，对于在可见性设置可用之前未拥有托管资源的账户，Amazon EC2 会隐藏其托管资源。对于已拥有托管资源的账户，Amazon EC2 会将可见性设置为**可见**，以保留现有工作流程。可见性设置适用于一个区域中的所有托管资源，无论其创建时间为何。您可以随时更改可见性设置。

### 为何要配置可见性设置
<a name="managed-resource-visibility-why-configure"></a>

通过配置可见性设置，您可以自定义托管资源在操作工具中的显示方式。常见使用案例包括：
+ 将合规性仪表板中的资源数量缩减至仅包含客户自主管理型资源，从而简化治理。
+ 减少可观测性工具中的噪音，这些工具汇总账户内所有实例的 Amazon EC2 指标。
+ 防止云安全态势管理（CSPM）扫描器（例如 Qualys）将托管资源误判为客户配置错误，从而避免误报。
+ 对于托管实例，AWS 负责 Amazon EC2 实例的配置、补丁更新和运行状况。通过控制可见性，您可以更清晰地向最终用户阐明责任共担模式。

**注意**  
可见性设置控制资源在 AWS 控制台视图和 API 列表操作中的显示。这些设置不会影响计费、资源操作或实际访问权限。隐藏资源仍可正常运行并计费。

### 配置托管资源可见性
<a name="configuring-managed-resource-visibility"></a>

您可以通过 Amazon EC2 控制台或 AWS CLI 来配置托管资源的可见性。

------
#### [ Console ]

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**控制面板**。

1. 在**账户属性**卡片的**设置**下，选择**托管资源**。

1. 选择 **Modify**(修改)。

1. 在**默认可见性**下，选择下列选项之一：
   + **隐藏（默认）**：隐藏所有托管资源。
   + **可见**：显示所有托管资源。

1. 选择**修改可见性**。

------
#### [ AWS CLI ]

**获取当前的可见性设置**  
使用 [get-managed-resource-visibility](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-managed-resource-visibility.html) 命令检索当前的可见性配置：

```
aws ec2 get-managed-resource-visibility
```

响应示例：

```
{
    "visibility": {
        "defaultVisibility": "hidden"
    }
}
```

**隐藏所有托管资源**  
使用 [modify-managed-resource-visibility](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-managed-resource-visibility.html) 命令隐藏所有托管资源，无论操作员是谁：

```
aws ec2 modify-managed-resource-visibility \
    --default-visibility "hidden"
```

------

### 发现隐藏的托管资源
<a name="discovering-hidden-managed-resources"></a>

关闭可见性后，仍可访问托管资源。以下方法可按需显示这些资源：

1. **特定服务的控制台**：导航到相应的 AWS 服务控制台（例如，Amazon EKS 控制台），查看为该服务预置的实例。服务控制台提供该服务在您账户中管理的所有资源的完整详细信息。

1. **直接 API 查询**：使用带有特定 `instance-id` 参数的 `describe-instances` API。无论可见性设置如何，带已知实例 ID 的直接查询都会返回结果。可见性设置仅影响列表和筛选操作。您还可以使用带 `include-managed-resources` 参数的 `describe-instances`，以发现托管实例。

**注意**  
相同的 direct-query-by-ID 行为也适用于所有受影响的资源类型。您可以使用 `describe-volumes`、`describe-launch-templates` 以及带特定资源 ID 的 `describe-network-interfaces`，以访问这些类型的隐藏托管资源。

### 计费注意事项
<a name="managed-resource-visibility-billing"></a>

托管资源可见性设置不会影响计费。隐藏的托管实例仍会出现在计费数据中，因为这些实例是在您账户内运行、代表您进行预置的资源，且无论可见性配置如何，均需要保持全额计费。

隐藏资源在以下情况下仍可见：
+ AWS 账单
+ AWS 成本和使用率报告

**重要**  
托管实例会在您的账户中进行预置，并消耗计算资源。将这些实例隐藏在控制台视图中并不能降低成本。有关托管实例费用的详细信息，请查看特定服务的计费文档（例如 [Amazon EKS 定价](https://aws.amazon.com/eks/pricing/)、[Amazon ECS 定价](https://aws.amazon.com/ecs/pricing/)）。

### 限制
<a name="managed-resource-visibility-limitations"></a>
+ 可见性设置适用于整个账户，并统一影响所有 IAM 主体。
+ 您无法按资源类型或创建托管资源的服务而选择性地显示或隐藏托管资源。例如，您无法选择显示由 Amazon EKS 创建的托管实例，同时隐藏由 Lambda、Amazon ECS 或 Amazon WorkSpaces 创建的托管实例。

## 开始使用托管式实例
<a name="get-started-with-ec2-managed-instances"></a>

要开始使用托管实例，请参阅您首选服务提供商对应的文档：
+ 《Amazon EKS 用户指南》**中的[使用 EKS 自动模式实现集群基础设施自动化](https://docs.aws.amazon.com/eks/latest/userguide/automode.html)
+ 《Amazon ECS 开发人员指南》**中的 [Amazon ECS 托管实例](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ManagedInstances.html)
+ 《WorkSpaces Core 规划指南》**中的[部署托管实例](https://docs.aws.amazon.com/workspaces-core/latest/pg/deploy-instances.html)
+ 《Lambda 开发人员指南》**中的 [Lambda 托管实例](https://docs.aws.amazon.com/lambda/latest/dg/lambda-managed-instances.html)
+ 本指南中的 [Amazon EC2 Fast Launch](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/win-ami-config-fast-launch.html)
+ 《Amazon Bedrock AgentCore 开发人员指南》**中的 [Bedrock AgentCore 运行时实例](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-instances-how-it-works.html)


# 应用程序状态检查
<a name="application-status-checks"></a>

应用程序状态检查可帮助您监控 Amazon EC2 上运行的应用程序的性能和运行状况。通过应用程序状态检查，您可以通过可配置的路径和端口监控应用程序，从而检测并响应应用程序运行状况损坏。例如，您可以使用应用程序状态检查来确认 Web 服务器是否正在侦听其预期端口并接受新的连接。

应用程序状态检查会监控应用程序在可配置路径和端口上的 HTTP 和 HTTPS 响应。它们每 60 秒运行一次，并与 Amazon EC2 Auto Scaling 集成，因此您可以自动替换应用程序受损的实例。

**Topics**
+ [应用程序状态检查如何工作](#how-application-status-checks-work)
+ [开始使用应用程序状态检查](#get-started-application-status-checks)
+ [配置选项](#asc-configuration-options)
+ [默认设置](#asc-default-settings)
+ [Amazon EC2 Auto Scaling 集成](#asc-auto-scaling-integration)
+ [处理部署、就地修补和替换](#asc-handling-deployment-and-patching)
+ [测试新的应用程序状态检查](#asc-testing-a-new-check)
+ [高级联网](#asc-advanced-networking)
+ [最佳实践](#asc-best-practices)
+ [问题排查](#asc-troubleshooting)
+ [监控应用程序状态检查](#asc-monitoring)
+ [安全性和权限](#asc-security-and-permissions)
+ [定价](#asc-pricing)
+ [配额](#asc-quotas)

## 应用程序状态检查如何工作
<a name="how-application-status-checks-work"></a>

应用程序状态检查每 60 秒向侦听实例网络端口的端点发送 HTTP 或 HTTPS 请求。AWS 会将响应代码与您配置的状态代码匹配器进行比较。连续多次请求失败后，检查将被标记为受损；连续多次请求成功后，检查将再次标记为运行正常。这两个计数均默认为 2，并且可配置。有关更多信息，请参阅 [评估阈值](#asc-config-evaluation)。

**注意**  
应用程序状态检查通过 HTTP/2 发送运行状况检查请求。  
HTTPS 协议检查不会验证服务器证书。

重启期间，应用程序状态检查会报告失败，直到实例再次可用为止，因为在操作系统重启期间，应用程序无法响应运行状况检查请求。

### 网络架构
<a name="asc-network-architecture"></a>

应用程序状态检查源自 Amazon EC2 应用程序状态检查服务。为了访问您的实例，AWS 会在您的 VPC 中创建一个托管弹性网络接口（ENI）。AWS 会为每个具有关联实例的源子网和安全组组合创建一个 ENI。当应用程序状态检查首次需要该组合时，AWS 会创建托管 ENI，当没有应用程序状态检查需要该组合时将其移除。托管的 ENI 不计入您的实例 ENI 限制，但会计入您账户的*每个区域的网络接口数*配额，该配额按可用区强制执行。有关更多信息，请参阅 [Amazon VPC 配额](https://docs.aws.amazon.com/vpc/latest/userguide/amazon-vpc-limits.html)。

默认情况下，对于在此设置可用之前没有托管资源的账户，Amazon EC2 会将这些托管网络接口从控制台和 API 列表操作中隐藏。要更改其可见性，请参阅[托管资源可见性设置](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/amazon-ec2-managed-instances.html#managed-resource-visibility-settings)。

AWS 会为关联实例中每个源子网和安全组的组合创建一个托管网络接口。托管接口的数量会随着受监控实例使用的不同子网和安全组组合的数量而增长。将受监控实例整合到更少的子网和安全组组合中可减少托管接口的数量。例如，分布在 2 个子网中且使用同一个安全组的 200 个实例会产生 2 个受管接口。同样是这 200 个实例，如果分布在这 2 个子网中使用 3 个安全组，则最多会产生 6 个受管接口。每个接口对应一个子网和安全组组合。

应用程序状态检查会从 VPC 内的私有接入点访问实例。此范围描述的是检查的来源，而非实例 IP 地址的属性。AWS 会在您 VPC 内的子网中创建托管 ENI，并通过私有网络路径访问实例。

使用 AWS 托管网络路径时，运行状况检查流量源自与目标实例位于同一可用区（或本地区域目标的父可用区）的 AWS 托管 Amazon EC2 实例。流量通过 AWS 内部网络传输，不会经过公共互联网。有关更多信息，请参阅亚马逊云科技服务网站上的 [Amazon VPC 常见问题解答](https://aws.amazon.com/vpc/faqs/)。

通过客户管理的网络路径，您可以选择源子网，从而可以从与目标不同的可用区运行检查。有关更多信息，请参阅 [跨可用区监控](#asc-cross-az)。

### AWS 管理的网络路径和客户管理的网络路径
<a name="asc-onboarding-modes"></a>

应用程序状态检查支持两种载入模式，分别决定谁为运行状况检查 ENI 选择源子网和安全组，以及为目标实例选择目标子网和安全组。

AWS 管理的网络路径  
AWS 会为运行状况检查 ENI 选择源子网和安全组，并为目标实例选择目标子网和安全组。

客户管理的网络路径  
您可以为运行状况检查 ENI 指定源子网和安全组，并为目标实例指定目标子网和安全组。  
当您需要控制运行状况检查流量来自哪些子网和安全组时，例如当您的 VPC 具有严格的网络分段、防火墙规则或合规性要求，限制哪些源可以访问您的应用程序端点时，请使用客户管理的网络路径。

可以通过在 create 命令中包含或省略 `--health-check-paths` 参数来选择模式。如果省略 `--health-check-paths` 参数，则 AWS 会选择源子网和目标子网以及安全组（AWS 管理的网络路径）。如果包含 `--health-check-paths` 参数，则您负责管理它们（客户管理的网络路径）。

### IP 版本
<a name="asc-ipv4-ipv6"></a>

每个应用程序状态检查都与单个 IP 版本（IPv4 或 IPv6）关联。要同时通过 IPv4 和 IPv6 监控同一实例，请创建两个独立的应用程序状态检查，并将这两个检查都与该实例关联。

对于 IPv4 和 IPv6，检查均从 VPC 内到达实例。

### 检查状态值
<a name="asc-check-status-values"></a>

每个单独的检查报告以下状态之一：
+ `passed`：检查已成功完成
+ `failed`：检查失败。响应包括应用程序返回的 HTTP 状态代码。有关解释和修复指导，请参阅[问题排查](#asc-troubleshooting)。
+ `initializing`：检查尚未完成首次评估
+ `insufficient-data`：检查未收到足够的数据来确定结果
+ `not-applicable`：检查未与实例关联

针对该实例报告的总体应用程序状态汇总了所有单独的检查结果。总体状态为以下几种之一：
+ `ok`：所有检查均通过
+ `impaired`：一项或多项检查失败
+ `initializing`：一项或多项检查尚未完成首次评估
+ `insufficient-data`：一项或多项检查报告的数据不足
+ `not-applicable`：所有关联的应用程序状态检查都被排除在聚合之外
+ `suppressed`：实例的应用程序状态检查评估被抑制

### 聚合
<a name="asc-aggregation"></a>

您可以将每个应用程序状态检查标记为包含在实例的总体状态中，或从总体状态中排除。默认情况下，检查状态为 `included`。

`included`  
该检查会影响实例的总体状态，并且 Amazon EC2 Auto Scaling 会使用它。

`excluded`  
该检查报告其单独状态，但不会影响实例的总体状态，并且 Amazon EC2 Auto Scaling 不使用它。使用此设置可在生产环境中验证新检查，而不会影响总体状态或触发 Amazon EC2 Auto Scaling 替换。这是向现有生产工作负载添加检查时推荐的工作流程；请参阅[测试新的应用程序状态检查](#asc-testing-a-new-check)。

## 开始使用应用程序状态检查
<a name="get-started-application-status-checks"></a>

**先决条件**  
创建应用程序状态检查之前，请确保您已具备以下各项：
+ 包含要监控的实例的 VPC。
+ 每个实例上的应用程序端点，该端点可以响应您配置的端口和 HTTP 路径上的 HTTP 或 HTTPS 请求。
+ 每个目标实例上的安全组，该安全组允许来自应用程序状态检查所用源安全组的入站流量通过检查端口。请参阅[安全性和权限](#asc-security-and-permissions)。

**步骤 1：配置 应用程序**  
配置应用程序端点，使其响应您在创建检查时指定的端口和 HTTP 路径上的 HTTP 或 HTTPS 请求。返回包含在状态代码匹配器中的响应代码，以指示应用程序运行状况良好。

确保目标实例的安全组允许来自应用程序状态检查所用源安全组的入站流量通过检查端口。对于托管网络路径，AWS 会在创建检查时提供源安全组。对于客户管理的网络路径，您可以在创建检查时指定源安全组。

**步骤 2：创建检查定义**  
使用 AWS CLI 创建应用程序状态检查。

------
#### [ Console ]

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中的**实例**下，选择**应用程序状态检查**。

1. 选择**创建应用程序状态检查**。

1. 在**运行状况检查逻辑**下，配置以下项：
   + **协议**：选择 **HTTP** 或 **HTTPS**。
   + **端口**：输入应用程序侦听的端口。
   + **路径**（可选）：输入要请求的 HTTP 路径（例如 `/healthcheck`）。
   + **IP 版本**：选择 **IPv4** 或 **IPv6**。
   + **设备索引**：要检查的网络接口设备索引。默认值为 `0`。

1. 在**控制项与阈值**下，设置**超时**，并根据需要设置**状态码匹配器**、**失败阈值**、**成功阈值**和**初始化宽限期**。检查间隔固定为 60 秒。

1. 在**聚合**下，选择**包括**以使检查影响总体应用程序状态并驱动 Amazon EC2 Auto Scaling，或选择**排除**以在不影响总体状态的情况下报告检查结果。

1. 在**运行状况检查路径**下，保留**不指定网络路径（建议/默认）**以让 Amazon EC2 将运行状况检查网络接口放置在实例的子网中，或者选择**指定网络路径（高级）**以自行定义源子网、安全组和目标。

1. （可选）添加**名称标签**和其他**标签**。

1. 选择**创建应用程序状态检查**。

------
#### [ AWS CLI ]

要使用 AWS 管理的网络路径，请省略 `--health-check-paths` 参数并允许 AWS 选择源子网和目标子网以及安全组。

```
aws ec2 create-application-status-check \
        --protocol https \
        --port 443 \
        --path "/health" \
        --status-code-matcher "200"
```

要使用客户管理的网络路径，请包含 `--health-check-paths` 参数。每个运行状况检查路径都包含一个源（运行状况检查 ENI 的子网和安全组）以及一个或多个目标（目标实例的子网和安全组）。

```
aws ec2 create-application-status-check \
        --protocol https \
        --port 443 \
        --path "/health" \
        --status-code-matcher "200" \
        --health-check-paths '[{"Source":{"SubnetId":"subnet-111","SecurityGroupId":"sg-aaa"},"Destinations":[{"SubnetId":"subnet-222","SecurityGroupId":"sg-bbb"}]}]'
```

------

**步骤 3：将检查与实例关联**  
按实例 ID 或标签将检查与要监控的实例相关联。

------
#### [ Console ]

1. 在导航窗格中的**实例**下，选择**应用程序状态检查**，然后选择该检查。

1. 选择**管理状态检查关联**，然后选择**按资源 ID 管理关联**或**按标签管理关联**。

1. 要与自动扩缩组中的所有实例关联，请选择**按标签管理关联**，然后输入 `aws:autoscaling:groupName` 作为标签键，并输入您的自动扩缩组名称作为值。

1. 选择**关联**。

------
#### [ AWS CLI ]

按实例 ID：

```
aws ec2 associate-application-status-check \
        --application-status-check-id asc-1234567890abcdef0 \
        --instance-ids i-0123456789abcdef0
```

按标签：

```
aws ec2 associate-application-status-check \
        --application-status-check-id asc-1234567890abcdef0 \
        --target-tag-associations Key=Environment,Value=production
```

要与自动扩缩组中的所有实例关联，请使用 `aws:autoscaling:groupName` 系统标签：

```
aws ec2 associate-application-status-check \
        --application-status-check-id asc-1234567890abcdef0 \
        --target-tag-associations Key=aws:autoscaling:groupName,Value={{my-asg}}
```

------

关联和取消关联操作会返回每个实例的成功和失败结果。如果某些实例无法关联（例如，因为检查已关联），则这些实例会出现在失败结果中，并附有原因。

**步骤 4：查看结果**  
查看每个实例的应用程序运行状况。

------
#### [ Console ]

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后选择**状态和警报**选项卡。

1. 在**应用程序状态检查**下，查看总体状态以及每个关联检查的单独状态。

------
#### [ AWS CLI ]

```
aws ec2 describe-application-status \
        --instance-ids i-0123456789abcdef0
```

响应包括总体应用程序状态，以及每个关联检查的检查状态，对于失败的检查，还包括应用程序返回的 HTTP 状态代码。

响应示例：

```
{
        "ApplicationStatuses": [
            {
                "InstanceId": "i-0123456789abcdef0",
                "ApplicationStatus": {
                    "Status": "ok",
                    "Details": [
                        {
                            "ApplicationStatusCheckId": "asc-1234567890abcdef0",
                            "Status": "passed",
                            "Reason": {
                                "Code": "ResponseCodeMatched",
                                "StatusCode": 200,
                                "Protocol": "HTTP"
                            }
                        }
                    ]
                }
            }
        ]
    }
```

要查看检查定义（而不是每个实例的状态），请使用 [describe-application-status-checks](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-application-status-checks.html)。此命令会返回应用程序状态检查的配置，包括协议、端口、HTTP 路径和状态码匹配器设置。

------

## 配置选项
<a name="asc-configuration-options"></a>

应用程序状态检查接受多个配置参数。本节介绍无法从参数名称直接推断行为的参数。有关参数和验证规则的完整列表，请参阅《Amazon EC2 API 参考》**中的 [CreateApplicationStatusCheck](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateApplicationStatusCheck.html) 和 [AssociateApplicationStatusCheck](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_AssociateApplicationStatusCheck.html)。

### 评估阈值
<a name="asc-config-evaluation"></a>

`FailureThreshold`  
检查被标记为受损之前连续失败的请求数。默认值：2。

`SuccessThreshold`  
检查再次被标记为运行正常之前连续成功的请求数。默认值：2。

`Timeout`  
等待响应的秒数，超过此秒数请求将被记录为失败。强制超时；如果应用程序在此时间范围内未响应，则无论最终响应如何，请求都将被记录为失败。默认值：6。有效范围：1-30。

### 启动宽限期
<a name="asc-config-startup-grace"></a>

`InitializationGracePeriodSeconds`  
实例启动后等待的秒数，之后 AWS 才会开始评估检查。使用此参数可让应用程序有时间在开始检查之前启动侦听。如果宽限期过短，Amazon EC2 Auto Scaling 可能会在应用程序准备就绪之前替换新实例。默认值：300。有效范围：1 到 600。

### IP 范围
<a name="asc-config-ip-scope"></a>

`IpScope`  
应用程序状态检查使用 `private` 范围；检查从 VPC 内运行。对于 IPv4，这对应于实例的私有 IP 地址。对于 IPv6，AWS 不会将地址归类为公有或私有；检查会接受任何 IPv6 地址，并从 VPC 内对其进行评估。

### 设备索引
<a name="asc-config-device-index"></a>

`DeviceIndex`  
AWS 针对运行状况检查评估的实例上网络设备的索引。如果实例的主网络设备不是您想要检查的设备，请更改此值。默认值：0。

聚合、IP 版本和运行状况检查路径（源子网和目标子网以及安全组）在本页前面的章节中已有介绍。

## 默认设置
<a name="asc-default-settings"></a>

对于 AWS 管理的网络路径，应用程序状态检查使用下面的默认值。


| 设置 | 默认值 | 
| --- | --- | 
| 检查间隔 | 60 秒（固定；不可配置） | 
| Failure threshold | 连续 2 次失败 | 
| 成功阈值 | 连续 2 次成功 | 
| 超时 | 6 秒 | 
| 状态码匹配器 | 200 | 
| HTTP 路径 | / | 
| IP 版本 | IPv4 | 
| IP 范围 | 专属 | 
| 设备索引 | 0 | 
| 初始化宽限期 | 300 秒 | 
| 聚合 | 包括 | 
| 源子网和安全组 | 由 AWS管理 | 

## Amazon EC2 Auto Scaling 集成
<a name="asc-auto-scaling-integration"></a>

只要聚合中包含应用程序状态检查，Amazon EC2 Auto Scaling 就会自动终止并替换总体应用程序状态报告 `impaired` 的实例。除了置。 除了将应用程序状态检查与组中的实例关联之外，无需对自动扩缩组进行其他配置。

Amazon EC2 Auto Scaling 使用实例的总体状态，而不是单个检查状态。标记为 `excluded` 的检查不会驱动 Amazon EC2 Auto Scaling 操作。处于 `suppressed` 状态的检查不会驱动 Amazon EC2 Auto Scaling 操作。

在检查中使用 `InitializationGracePeriodSeconds` 参数，以便在应用程序状态检查开始之前，允许新实例有时间启动。如果宽限期太短，新实例可能会在应用程序准备好处理流量之前被 Amazon EC2 Auto Scaling 终止和替换。

检查的 `InitializationGracePeriodSeconds` 设置实例启动后多长时间内检查才会开始评估应用程序。请将其设置为涵盖应用程序的启动时间，因此在应用程序仍在启动时，检查不会报告 `impaired`。自动扩缩组的运行状况检查宽限期是独立的。它设置实例进入服务后多长时间，Amazon EC2 Auto Scaling 会因为运行状况检查失败而终止该实例。

有关 Amazon EC2 Auto Scaling 如何使用运行状况检查的更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南》**中的 [Health checks for instances in an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html) 和 [Use application status checks with an Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/use-application-status-checks-auto-scaling-group.html)。

## 处理部署、就地修补和替换
<a name="asc-handling-deployment-and-patching"></a>

部署、就地修补和其他维护操作可能会暂时停止或重启您的应用程序。在此期间，应用程序状态检查会报告失败，因为应用程序无法响应运行状况检查请求。如果实例位于聚合中包含应用程序状态检查的自动扩缩组中，则即使预期会出现中断，Amazon EC2 Auto Scaling 也可能会终止并替换这些实例。

### 选项 A：抑制检查
<a name="asc-option-a-suppress"></a>

对于已知持续时间的有限维护时段，请使用抑制功能。抑制在实例级别强制执行。您可以指定持续时间，或者省略持续时间以抑制检查，直到您禁用抑制功能为止。

------
#### [ AWS CLI ]

```
aws ec2 enable-application-status-check-suppression \
        --instance-ids i-0123456789abcdef0 \
        --duration-seconds 3600
```

响应会针对每个实例返回抑制开始时间和结束时间。操作可能部分成功；某些实例可能无法被抑制，并且在响应中出现并附有原因。

要在抑制时段到期之前恢复检查，请执行下面的操作：

```
aws ec2 disable-application-status-check-suppression \
        --instance-ids i-0123456789abcdef0
```

------

实例被抑制期间，其总体应用程序状态会报告 `suppressed`。Amazon EC2 Auto Scaling 不会对 `suppressed` 实例执行任何操作。

### 选项 B：从聚合中排除检查
<a name="asc-option-b-exclude"></a>

如果希望检查继续评估并报告其各自的状态，但不影响总体状态或触发 Amazon EC2 Auto Scaling 操作，请将检查的聚合设置设为 `excluded`。这对于持续时间较长的场景非常有用，例如推出新的检查版本或在不冒替换风险的情况下验证更改，以及在不影响运营的情况下继续进行遥测的情况。

有关更多信息，请参阅 [聚合](#asc-aggregation)。

### 选项 C：取消关联检查
<a name="asc-option-c-disassociate"></a>

对于持续时间较长或无限期的移除，请使用取消关联。

```
aws ec2 disassociate-application-status-check \
        --application-status-check-id asc-1234567890abcdef0 \
        --instance-ids i-0123456789abcdef0
```

如果按标签关联，请从实例中移除标签以取消关联。取消关联后，实例的总体应用程序状态将报告 `not-applicable`。

### 部署指导
<a name="asc-deployment-guidance"></a>

部署是需要抑制的最常见维护场景。如果部署工具具有部署前钩子和部署后钩子，请使用抑制功能，以便在部署开始之前抑制检查，并在部署完成后禁用抑制功能。

一般模式是：

1. 在部署前钩子中，为实例调用 [enable-application-status-check-suppression](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-application-status-check-suppression.html)，持续时间涵盖预期的部署时段。

1. 执行部署。

1. 在部署后钩子中，为实例调用 [disable-application-status-check-suppression](https://docs.aws.amazon.com/cli/latest/reference/ec2/disable-application-status-check-suppression.html)。

如果部署工具没有钩子，请从调用部署的 CI/CD 管线驱动抑制。

## 测试新的应用程序状态检查
<a name="asc-testing-a-new-check"></a>

在新的应用程序状态检查开始影响实例级监控之前，您可以在生产环境中对其进行验证。创建检查时，请将聚合设置设为 `excluded`，然后确认其报告预期状态和 HTTP 响应代码。准备就绪后，请将设置更改为 `included`，使检查影响实例的总体状态并与 Amazon EC2 Auto Scaling 集成。

1. 创建聚合设置设为 `excluded` 的检查。

   ```
   aws ec2 create-application-status-check \
           --protocol https \
           --port 443 \
           --path "/health" \
           --status-code-matcher "200" \
           --aggregation excluded
   ```

1. 将检查与测试实例或生产实例集的一部分相关联。

1. 至少等待两个检查间隔（大约两分钟），以便检查完成初步评估。

1. 使用 [describe-application-status](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-application-status.html) 验证检查是否报告预期状态和 HTTP 响应代码。

   ```
   aws ec2 describe-application-status \
           --instance-ids i-0123456789abcdef0
   ```

1. 如果检查按预期报告，请将聚合设置更新为 `included`，以使检查影响实例的总体状态并驱动 Amazon EC2 Auto Scaling 操作。

   ```
   aws ec2 modify-application-status-check \
           --application-status-check-id asc-1234567890abcdef0 \
           --aggregation included
   ```

## 高级联网
<a name="asc-advanced-networking"></a>

应用程序状态检查源自您指定的（或 AWS 为您选择的）源子网和安全组中的托管 ENI。对于需要比单源配置更高可用性的工作负载，或者在本地区域或 Outposts 中运行的工作负载，请考虑以下模式。

### 跨可用区监控
<a name="asc-cross-az"></a>

为了实现可用区冗余，您可以从多个可用区运行运行状况检查。借助客户管理的网络路径，您可以使用 `--health-check-paths` 参数定义运行状况检查路径，这些路径的源位于两个不同的可用区，但最终到达相同的目标实例。即使一个可用区不可用，来自两个可用区的监控也能确保实例的运行状况报告持续进行。

以下示例创建了一个检查，其中包含两条运行状况检查路径，这两条路径的源位于不同的可用区，但都到达相同的目标实例。

```
aws ec2 create-application-status-check \
        --protocol https \
        --port 443 \
        --path "/health" \
        --status-code-matcher "200" \
        --health-check-paths '[{"Source":{"SubnetId":"subnet-source-az1","SecurityGroupId":"sg-healthcheck"},"Destinations":[{"SubnetId":"subnet-app-az1","SecurityGroupId":"sg-app"}]},{"Source":{"SubnetId":"subnet-source-az2","SecurityGroupId":"sg-healthcheck"},"Destinations":[{"SubnetId":"subnet-app-az2","SecurityGroupId":"sg-app"}]}]'
```

### Local Zones
<a name="asc-local-zones"></a>

对于在 AWS Local Zones 中运行的实例，托管弹性网络接口（ENI）驻留在父 AWS 区域中，而不是本地区域中。父区域与本地区域实例之间的运行状况检查流量会遍历本地区域服务链路，这可能会产生额外的数据传输费用。

## 最佳实践
<a name="asc-best-practices"></a>
+ **设计运行状况端点，使其反映在该实例上运行的应用程序的运行状况。**当端点根据应用程序本身返回运行状况时，Amazon EC2 Auto Scaling 只会替换真正受损的实例。如果端点的响应还依赖于共享资源（例如数据库或下游服务），则该资源出现问题可能会导致多个实例同时检查失败。这可能会触发整个实例集替换。有关编写运行状况检查端点的指导，请参阅 Amazon Builders' Library 中的[实施运行状况检查](https://aws.amazon.com/builders-library/implementing-health-checks/)。
+ **防止关联故障。**包括的检查会驱动 Amazon EC2 Auto Scaling 替换。如果多个实例同时出现检查失败，则可能会触发一波替换。请在自动扩缩组上设置实例维护策略，以限制同时替换的实例数量。有关更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南》中的[实例维护策略](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-maintenance-policy.html)。
+ **针对受损实例计数发出警报。**跨实例集针对 `StatusCheckFailed_Application` 指标创建 Amazon CloudWatch 警报。多个实例骤然上升表明存在共享依赖项，而不是单个实例故障，这使您有时间在替换级联之前做出响应。有关更多信息，请参阅 [监控应用程序状态检查](#asc-monitoring)。
+ **保持在网络接口配额内。**应用程序状态检查会创建托管网络接口，它们会计入*每个区域的网络接口数*配额。AWS 按可用区强制执行此配额。请监控您的使用量，确保不断增长的实例集不会达到配额上限。如果达到上限，AWS 将无法创建新的接口。有关相关的配额警报指导，请参阅[配额](#asc-quotas)。
+ **将状态检查权限视为受变更控制。**创建、修改、删除、关联、取消关联和抑制应用程序状态检查的 IAM 操作可能会影响实例可用性。这些操作确定驱动 Amazon EC2 Auto Scaling 替换的因素。将 `ec2:CreateApplicationStatusCheck`、`ec2:AssociateApplicationStatusCheck`、`ec2:ModifyApplicationStatusCheck` 和 `ec2:EnableApplicationStatusCheckSuppression` 等操作视为受变更控制，而不是将其作为常规 Amazon EC2 访问的一部分进行授权。有关操作的完整列表，请参阅《Amazon EC2 API 参考》。

## 问题排查
<a name="asc-troubleshooting"></a>

当应用程序状态检查报告受损，但您预期应用程序运行正常时，请验证以下各项：

1. *实例可访问性。*确认实例的实例和系统状态检查均为 `ok`。

1. *安全组入站规则。*目标实例的安全组必须允许来自应用程序状态检查所用源安全组的入站流量通过检查端口。对于 AWS 管理的网络路径，AWS 提供源安全组；对于客户管理的网络路径，请使用您指定为源的安全组。

1. *主机防火墙。*实例上的任何主机级防火墙（iptables、Windows 防火墙、第三方主机防火墙）都必须允许入站流量通过检查端口。

1. *应用程序端点。*应用程序必须侦听您配置的端口和路径。通过实例的本地请求进行确认（`curl http://localhost:PORT/PATH`）。

1. *协议不匹配。*如果检查配置为 HTTPS，但端点仅服务于 HTTP（反之亦然），则所有调用都将失败。

1. *状态码匹配器。*确认应用程序的实际响应代码已包含在您配置的状态码匹配器中。

1. *网络路径。*如果您配置了客户管理的网络路径，请确认源子网和安全组与目标子网建立连接。使用 [VPC Reachability Analyzer](https://docs.aws.amazon.com/vpc/latest/reachability/what-is-reachability-analyzer.html) 跟踪网络路径。

1. *可用的 ENI 配额。* AWS 会在您的账户中为每个源子网和安全组组合创建一个托管弹性网络接口（ENI）。确认您的账户未达到*每个区域的网络接口数*配额，该配额按可用区强制执行。如果您的账户已达到此配额，则 AWS 将无法创建托管 ENI，并且无法运行检查。有关更多信息，请参阅 [Amazon VPC 配额](https://docs.aws.amazon.com/vpc/latest/userguide/amazon-vpc-limits.html)。

### 原因代码
<a name="asc-troubleshoot-reason-codes"></a>

[describe-application-status](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-application-status.html) 响应包括每项检查的原因。该原因包含应用程序返回的 HTTP 状态代码（以数字形式表示）以及用于检查的协议。如果返回的状态代码包含在状态码匹配器中，则检查会被标记为 `passed`，否则标记为 `failed`。

该原因还包括原因代码，对于 HTTP 级别的结果，还包括协议和返回的 HTTP 状态代码。原因包含以下字段：

`Code`  
应用程序状态检查结果的原因代码。下列值之一：  
+ `ResponseCodeMatched`：运行状况检查返回的 HTTP 状态代码与配置的 `StatusCodeMatcher` 匹配。
+ `ResponseCodeMismatch`：运行状况检查返回的 HTTP 状态代码与配置的 `StatusCodeMatcher` 不匹配。
+ `ConnectionTimeout`：与目标的连接超时。
+ `ResponseTimeout`：运行状况检查在等待目标的响应时超时。
+ `ConnectionRefused`：目标拒绝了运行状况检查连接。
+ `ConnectionReset`：在收到响应之前，运行状况检查连接已重置。
对于 `ResponseCodeMatched` 和 `ResponseCodeMismatch`，`StatusCode` 字段包含返回的 HTTP 状态代码，而 `Protocol` 字段包含用于运行状况检查的协议。对于连接错误（例如，`ConnectionTimeout`、`ResponseTimeout`、`ConnectionRefused` 和 `ConnectionReset`），不存在 `StatusCode` 和 `Protocol` 字段。

`Protocol`  
用于运行状况检查的协议。`HTTP` 或 `HTTPS` 其中一个。

`StatusCode`  
运行状况检查返回的 HTTP 状态代码。

使用返回的 HTTP 状态代码来确定检查失败的原因。一些常见示例：


| HTTP 状态代码 | 典型含义 | 常见补救措施 | 
| --- | --- | --- | 
| `200` | 应用程序返回成功的响应。 | 无。这通常表示正常运行状态。 | 
| `301`, `302` | 应用程序返回重定向。运行状况检查调用未遵循重定向。 | 将运行状况检查路径指向重定向的目标位置，或者如果您认为其运行正常，请将重定向代码添加到状态码匹配器中。 | 
| `401`, `403` | 应用程序需要身份验证或拒绝访问运行状况检查路径。 | 将运行状况检查路径配置为无需身份验证，或在不需要凭证的路径上处理运行状况检查。 | 
| `404` | 应用程序上未找到配置的运行状况检查路径。 | 确认路径与应用程序服务于的路由匹配。 | 
| `500` | 应用程序返回内部服务器错误。 | 调查实例上的应用程序日志。 | 
| `502`, `503`, `504` | 应用程序可以访问，但报告上游或容量问题。 | 调查应用程序运行状况、依赖项和容量。如果应用程序在启动期间返回这些代码，请增加 `InitializationGracePeriodSeconds`。 | 

有关完整的 `ApplicationStatusReason` 结构，请参阅《Amazon EC2 API 参考》**中的 [ApplicationStatusReason](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ApplicationStatusReason.html)。

### 常见错误
<a name="asc-troubleshoot-common-mistakes"></a>
+ 安全组不允许来自运行状况检查源的入站流量通过检查端口。
+ 应用程序绑定到 `127.0.0.1`，未侦听网络接口。
+ 运行状况检查路径返回重定向（301、302）而不是成功响应，并且状态码匹配器不包括重定向代码。
+ 检查配置为使用 HTTPS，但应用程序仅支持 HTTP，反之亦然。
+ 应用程序启动时间超过了 `InitializationGracePeriodSeconds` 值，Amazon EC2 Auto Scaling 会在实例准备就绪之前将其替换。

## 监控应用程序状态检查
<a name="asc-monitoring"></a>

您可以通过三种方式监控应用程序状态检查：
+ **Amazon CloudWatch** () `StatusCheckFailed_Application` 指标反映实例的总体应用程序状态，可驱动警报。该指标按实例汇总，范围为聚合设置为 `included` 的关联检查。CloudWatch 还会为每个关联检查发布名为 `StatusCheckFailed_Application_{{application-status-check-id}}` 的每次检查指标。
+ **[describe-instance-status](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-status.html)**。返回总体应用程序状态以及实例的其他状态信息。
+ **[describe-application-status](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-application-status.html)**。返回每个实例的详细结果，包括每个关联检查的单独状态以及应用程序返回的 HTTP 状态代码。

使用 CloudWatch 指标进行警报驱动的自动化。如果已查询实例状态，请使用 `describe-instance-status`。如需查看每项检查的详细状态，请使用 `describe-application-status`。

## 安全性和权限
<a name="asc-security-and-permissions"></a>

AWS 通过服务相关角色创建和管理用于应用程序状态检查的网络接口。创建这些 ENI 的服务无需任何 IAM 设置。服务相关角色使用 [`EC2ApplicationStatusChecksServiceRolePolicy`](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/EC2ApplicationStatusChecksServiceRolePolicy.html) AWS 托管式策略。

要自行创建、关联、描述、删除和抑制应用程序状态检查，IAM 用户或角色需要相应的 Amazon EC2 权限。有关操作的完整列表，请参阅《Amazon EC2 API 参考》**。

实例的安全组必须允许来自运行状况检查源安全组的入站流量通过您配置的端口。对于 AWS 管理的网络路径，AWS 提供源安全组；对于客户管理的网络路径，请使用您指定为源的安全组。

## 定价
<a name="asc-pricing"></a>

应用程序状态检查按以下组件计费：
+ 每个可用区的每个托管弹性网络接口（ENI）每小时收费 0.01 美元。
+ Amazon CloudWatch 标准定价适用于应用程序状态检查指标。

## 配额
<a name="asc-quotas"></a>

应用程序状态检查受 AWS 服务配额限制。有关配额名称、默认值和描述，请参阅《AWS 一般参考》**中的 [Amazon EC2 端点和配额](https://docs.aws.amazon.com/general/latest/gr/ec2-service.html)。

除了影响托管网络接口的 AWS 服务配额之外，应用程序状态检查还具有以下服务配额。您可以通过服务配额控制台查看您的使用情况并申请增加配额。

在这些配额中，*目标*是指一个运行状况检查监控的单个实例。如果多个运行状况检查监控一个实例，则每个实例和运行状况检查配对均计为一个单独的目标。*关联*是指您与运行状况检查关联的单个标签规则或单个实例 ID。无论解析到多少个实例，每个规则或实例 ID 都计为一个关联。


| 配额 | 默认值 | 可调整 | 
| --- | --- | --- | 
| 每个账户的运行状况检查 | 50 | 是，自动 | 
| 每个运行状况检查的关联数 | 50 | 是，自动 | 
| 每个账户的关联数 | 200 | 是，自动 | 
| 每个账户的目标数 | 5000 | 是，根据要求 | 

大多数配额增加都会自动获得批准。增加*每个账户的目标数*需要提出申请并经过手动审批。

**重要**  
如果您账户中的目标数量超过*每个账户的目标数*配额，则超出限制的目标不会受到监控，也不会报告应用程序状态。为避免监控出现空白，请将目标数量保持在配额范围内或申请增加配额。

建议针对应用程序状态检查配额使用情况创建一个 Amazon CloudWatch 警报，以便在达到配额之前收到通知。服务配额会将使用情况指标发布到 CloudWatch 中的 `AWS/Usage` 命名空间，您可以使用它来创建警报。
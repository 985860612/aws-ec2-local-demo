

# 什么是 Amazon EC2？
<a name="concepts"></a>

Amazon Elastic Compute Cloud（Amazon EC2）在 Amazon Web Services（AWS）云中按需提供可扩展的计算容量。使用 Amazon EC2 可以降低硬件成本，因此您可以更快地开发和部署应用程序。您可以使用 Amazon EC2 启动所需数量的虚拟服务器，配置安全性和联网以及管理存储。您可以添加容量（纵向扩展）来处理计算密集型任务，例如月度或年度进程或网站流量峰值。如果使用量减少，您可以再次减少容量（缩减）。

EC2 实例是 AWS 云中的虚拟服务器。启动 EC2 实例时，您指定的实例类型决定了用于您的实例的主机硬件。每种实例类型以不同方式兼顾计算、内存、存储和网络资源。有关更多信息，请参阅 [Amazon EC2 实例类型指南](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html)。

![每种 EC2 实例类型兼顾了计算、内存、存储和网络资源。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/instance-types.png)


## Amazon EC2 的功能
<a name="ec2-features"></a>

Amazon EC2 提供以下高级功能：

**实例**  
虚拟服务器。

**亚马逊机器映像（AMI）**  
实例的预置模板，其中包含服务器所需的组件（包括操作系统和其他软件）。

**实例类型**  
实例 CPU、内存、存储、网络容量和图形硬件的多种配置。

**Amazon EBS 卷**  
使用 Amazon Elastic Block Store（Amazon EBS）的数据的持久性存储卷。

**实例存储卷**  
停止、休眠或终止实例时会删除的临时数据的存储卷。

**密钥对**  
实例的安全登录信息。AWS 会存储公有密钥，而您可以在安全位置存储私有密钥。

**安全组**  
虚拟防火墙，允许您指定可以访问实例的协议、端口和源 IP 范围，以及实例可以连接的目标 IP 范围。

Amazon EC2 支持由商家或服务提供商处理、存储和传输信用卡数据，而且已经验证符合支付卡行业 (PCI) 数据安全标准 (DSS)。有关 PCI DSS 的更多信息，包括如何请求 AWS PCI Compliance Package 的副本，请参阅 [PCI DSS 第 1 级](https://aws.amazon.com/compliance/pci-dss-level-1-faqs/)。

## 相关服务
<a name="related-services"></a>与 Amazon EC2 结合使用的服务

可以将其他 AWS 服务 与使用 Amazon EC2 部署的实例一起使用。

[Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/)  
帮助确保您具有正确数量的 Amazon EC2 实例，可用于处理您的应用程序负载。

[AWS Backup](https://docs.aws.amazon.com/aws-backup/)  
自动备份 Amazon EC2 实例及其附加的 Amazon EBS 卷。

[Amazon CloudWatch](https://docs.aws.amazon.com/cloudwatch/)  
监控实例和 Amazon EBS 卷。

[Elastic Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/)  
可在多个实例间自动分配传入的应用程序流量。

[Amazon GuardDuty](https://docs.aws.amazon.com/guardduty/)  
检测对 EC2 实例的潜在未经授权或恶意的使用情况。

[EC2 Image Builder](https://docs.aws.amazon.com/imagebuilder/)  
自动创建、管理和部署自定义、安全且最新的服务器映像。

[AWS Launch Wizard](https://docs.aws.amazon.com/launchwizard/)  
调整、配置和部署用于第三方应用程序的 AWS 资源，而无需手动识别和预置单个 AWS 资源。

[AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/)  
使用该安全的端到端管理解决方案在 EC2 实例上大规模执行操作。其他计算服务

可以使用其他 AWS 计算服务而不是使用 Amazon EC2 来启动实例。

[Amazon Lightsail](https://docs.aws.amazon.com/lightsail/)  
使用 Amazon Lightsail 构建网站或 Web 应用程序，这是一个云平台，提供快速部署项目所需的资源，每月价格低廉、可预测。要比较 Amazon EC2 和 Lightsail，请参阅 [Amazon Lightsail 或 Amazon EC2](https://docs.aws.amazon.com/decision-guides/latest/lightsail-or-ec2/lightsail-or-ec2.html)。

[Amazon Elastic Container Service（Amazon ECS）](https://docs.aws.amazon.com/ecs/)  
在 EC2 实例集群上部署、管理和扩展容器化应用程序。有关更多信息，请参阅[选择 AWS 容器服务](https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html)。

[Amazon Elastic Kubernetes Service(Amazon EKS)](https://docs.aws.amazon.com/eks/)  
在 AWS 上运行您的 Kubernetes 应用程序。有关更多信息，请参阅[选择 AWS 容器服务](https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html)。

## 访问 Amazon EC2
<a name="access-ec2"></a>

您可以使用以下界面创建和管理 Amazon EC2 实例：

**Amazon EC2 控制台**  
用于创建和管理 Amazon EC2 实例和资源的简单 Web 界面。如果您已注册AWS账户，可以通过登录 AWS 管理控制台 并从控制台主页选择 **EC2** 来访问 Amazon EC2 控制台。

**AWS Command Line Interface**  
让您能够在命令行 Shell 中使用命令与 AWS 服务进行交互。它在 Windows、Mac 和 Linux 上受支持。有关 AWS CLI 的更多信息，请参阅 [AWS Command Line Interface 用户指南](https://docs.aws.amazon.com/cli/latest/userguide/)。您可以在 [AWS CLI 命令参考](https://docs.aws.amazon.com/cli/latest/reference/ec2/index.html)中查看 Amazon EC2 命令。

**CloudFormation**  
Amazon EC2 支持使用 CloudFormation 创建资源。您可以创建一个用于描述 AWS 资源的模板（采用 JSON 或 YAML 格式），然后 CloudFormation 会为您预置和配置这些资源。您可以重复使用 CloudFormation 模板来多次预置相同的资源，无论是在同一地区和账户中，还是在多个地区和账户中。有关 Amazon EC2 的受支持资源类型和属性的更多信息，请参阅《AWS CloudFormation 用户指南》**中的 [EC2 资源类型参考](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_EC2.html)。

**AWS SDK**  
如果您倾向于使用特定语言的 API 而非通过 HTTP 或 HTTPS 提交请求来构建应用程序，AWS 为软件开发人员提供了库文件、示例代码、教程和其他资源。这些库文件提供可自动执行任务的基本功能，例如以加密方式对请求签名、重试请求和处理错误响应，以便您可以更轻松地上手。有关更多信息，请参阅 [用于在 AWS 上构建的工具](https://aws.amazon.com/developer/tools/)。

**AWS Tools for PowerShell**  
一组根据 适用于 .NET 的 SDK 公开的功能构建的 PowerShell 模块。借助 Tools for PowerShell，您可以从 PowerShell 命令行为针对 AWS 资源的操作编写脚本。要开始使用，请参阅[《AWS Tools for PowerShell 用户指南》](https://docs.aws.amazon.com/powershell/latest/userguide/)。您可以在 [AWS Tools for PowerShell Cmdlet 参考](https://docs.aws.amazon.com/powershell/latest/reference/Index.html)中找到适用于 Amazon EC2 的 cmdlets。

**查询 API**  
Amazon EC2 提供查询 API。这些请求属于 HTTP 或 HTTPS 请求，需要使用 HTTP 动词 GET 或 POST 以及一个名为 `Action` 的查询参数。有关 Amazon EC2 的 API 操作的更多信息，请参阅**《Amazon EC2 API 参考》中的[操作](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_Operations.html)。

## Amazon EC2 定价
<a name="ec2-pricing"></a>

Amazon EC2 提供以下定价选项：

**免费套餐**  
您可以免费开始使用 Amazon EC2。要了解免费套餐选项，请参阅 [AWS Free Tier](https://aws.amazon.com/free/)。

**按需型实例**  
您只需按秒支付使用实例的费用（最少 60 秒），无需长期订阅或支付预付款。

**节省计划**  
可以通过承诺在 1 年或 3 年期限内保持一致的使用量（以美元/小时为单位）来降低您的 Amazon EC2 成本。

**预留实例**  
可以通过承诺在 1 年或 3 年期限内提供特定的实例配置（包括实例类型和区域）来降低您的 Amazon EC2 成本。

**竞价型实例**  
请求未使用的 EC2 实例，这可能会显著降低您的 Amazon EC2 成本。

**专属主机**  
通过使用完全专供您使用的物理 EC2 服务器（按需付费或作为实惠配套的一部分）来降低成本。您可以使用现有的服务器绑定软件许可证，并获得满足合规性要求的帮助。

**按需容量预留**  
在特定可用区中为 EC2 实例预留计算容量，持续时间不限。

**按秒计费**  
从账单中扣除未使用的分钟数计费和秒数计费。

有关 Amazon EC2 的费用和价格的完整列表以及有关购买模式的更多信息，请参阅 [Amazon EC2 定价](https://aws.amazon.com/ec2/pricing/)。

### 估算、账单和成本优化
<a name="ec2-pricing-additional"></a>

要为 AWS 用例创建估算，请使用 [AWS 定价计算器](https://calculator.aws/#/)。

要估算将 **Microsoft 工作负载**转换为使用部署在 AWS 上的云原生开源服务的现代架构成本，请使用[适用于 Microsoft 工作负载的 AWS 现代化计算器](https://modernization.calculator.aws/microsoft/workload)。

若要查看您的账单，请转到 [AWS 账单与成本管理 控制台](https://console.aws.amazon.com/billing/)中的**账单和成本管理控制面板**。您的账单中包含了提供您的账单详情的使用情况报告的链接。要了解有关 AWS 账户账单的更多信息，请参阅 [AWS 账单和成本管理用户指南](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/)。

如果您有关于 AWS 账单、账户和事件的问题，请[联系 AWS Support](https://aws.amazon.com/contact-us/)。

要计算示例预置环境的成本，请参阅[云成本中心](https://aws.amazon.com/economics/)。在计算预配置环境的成本时，请记住包括附带成本，例如 EBS 卷的快照存储。

您可以使用 [AWS Trusted Advisor](https://aws.amazon.com/premiumsupport/technology/trusted-advisor/) 来优化 AWS 环境的成本、安全性和性能。

您可以使用 AWS Cost Explorer 分析 EC2 实例的成本和使用情况。您最多可以查看过去 13 个月的数据，并预测您在接下来 12 个月内可能产生的费用。有关更多信息，请参阅《AWS Cost Management User Guide》**中的 [Analyzing your costs and usage with AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html)。

## 资源
<a name="more-resources"></a>
+ [Amazon EC2 功能](https://aws.amazon.com/ec2/features/)
+ [AWS re:Post](https://repost.aws/)
+ [AWS Skill Builder](https://aws.amazon.com/training/digital/)
+ [AWS 支持](https://aws.amazon.com/premiumsupport/)
+ [动手实践教程](https://aws.amazon.com/getting-started/hands-on/)
+ [Web 托管](https://aws.amazon.com/websites/)
+ [Windows on AWS](https://aws.amazon.com/windows/)


# 使用 Amazon EC2 控制台安装和配置 CloudWatch 代理以添加其他指标
<a name="install-and-configure-cloudwatch-agent-using-ec2-console"></a>


| 说明 | 
| --- | 
| 对于 Amazon EC2，使用 Amazon EC2 控制台安装和配置 CloudWatch 代理的功能为试用版，可能随时更改。 | 

默认情况下，Amazon CloudWatch 提供基本指标（例如 `CPUUtilization` 和 `NetworkIn`）用于监控 Amazon EC2 实例。要收集其他指标，您可以在 EC2 实例上安装 CloudWatch 代理，然后将该代理配置为发出所选指标。您可以使用 Amazon EC2 控制台执行此操作，而不必在每个 EC2 实例上手动安装和配置 CloudWatch 代理。

您可以使用 Amazon EC2 控制台在实例上安装 CloudWatch 代理以及配置代理以发出所选指标。

或者，要手动完成此过程，请参阅《Amazon CloudWatch 用户指南》**中的[安装 CloudWatch 代理](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)。有关 CloudWatch 代理的更多信息，请参阅[使用 CloudWatch 代理采集指标、日志和跟踪数据](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)。

**Topics**
+ [前提条件](#install-and-configure-cw-agent-prerequisites)
+ [工作原理](#install-and-configure-cw-agent-how-it-works)
+ [成本](#install-and-configure-cw-agent-costs)
+ [安装和配置 CloudWatch 代理](#install-and-configure-cw-agent-procedure)

## 前提条件
<a name="install-and-configure-cw-agent-prerequisites"></a>

要使用 Amazon EC2 安装和配置 CloudWatch 代理，您必须满足本节所述的用户和实例前提条件。

**提示**  
此功能并非在所有 AWS 区域 中都可用。如果 Amazon EC2 控制台中不存在本页安装过程中描述的菜单项，并且您可以灵活决定实例的运行位置，请尝试其他区域。否则，可以使用《Amazon CloudWatch 用户指南》**中的手动说明安装和配置代理。

**用户先决条件**  
要使用此功能，您的 IAM 控制台用户或角色必须具有使用 Amazon EC2 所需的权限以及下列 IAM 权限：

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:GetParameter",
                "ssm:PutParameter"
            ],
            "Resource": "arn:aws:ssm:*:*:parameter/EC2-Custom-Metrics-*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ssm:SendCommand",
                "ssm:ListCommandInvocations",
                "ssm:DescribeInstanceInformation"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:GetInstanceProfile",
                "iam:SimulatePrincipalPolicy"
            ],
            "Resource": "*"
        }
    ]
}
```

------

**实例先决条件**
+ 实例状态：`running`
+ 支持的操作系统：Linux
+ AWS Systems Manager Agent（SSM Agent）：已安装。关于 SSM Agent 的两个注意事项：
  + SSM Agent 预装在由 AWS 和受信任的第三方提供的一些亚马逊机器映像（AMI）上。有关支持的 AMI 和 SSM Agent 安装说明的信息，请参阅《*AWS Systems Manager 用户指南*》中的[预装了 SSM Agent 的亚马逊机器映像（AMI）](https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html)。
  + 如果在使用 SSM Agent 时遇到问题，请参阅《*AWS Systems Manager 用户指南*》中的 [SSM Agent 故障排除](https://docs.aws.amazon.com/systems-manager/latest/userguide/troubleshooting-ssm-agent.html)。
+ 实例的 IAM 权限：必须将以下 AWS 托管策略添加到附加到实例的 IAM 角色中：
  + [AmazonSSMManagedInstanceCore](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html) – 使实例能够使用 Systems Manager 安装和配置 CloudWatch 代理。
  + [CloudWatchAgentServerPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAgentServerPolicy.html) – 使实例能够使用 CloudWatch 代理将数据写入 CloudWatch。

  有关如何为实例添加 IAM 权限的信息，请参阅《IAM 用户指南》**中的[使用实例配置文件](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html)。

## 工作原理
<a name="install-and-configure-cw-agent-how-it-works"></a>

在使用 Amazon EC2 控制台安装和配置 CloudWatch 代理之前，必须确保 IAM 用户或角色以及要添加指标的实例满足某些先决条件。然后，可以使用 Amazon EC2 控制台在所选实例上安装和配置 CloudWatch 代理。

**首先满足[先决条件](#install-and-configure-cw-agent-prerequisites)**
+ **需要所需的 IAM 权限** – 开始之前，请确保控制台用户或角色具有使用此功能所需的 IAM 权限。
+ **实例** – 要使用该功能，EC2 实例必须是 Linux 实例，安装了 SSM Agent，具有所需的 IAM 权限并且正在运行。

**然后可以[使用该功能](#install-and-configure-cw-agent-procedure)**

1. **选择实例** – 在 Amazon EC2 控制台中，选择要在其上安装和配置 CloudWatch 代理的实例。然后，可以通过选择“**配置 CloudWatch 代理**”来开始该过程。

1. **验证 SSM Agent** – Amazon EC2 会检查每个实例上是否安装并启动了 SSM Agent。未通过此检查的任何实例都将从过程中排除。在此过程中，SSM Agent 用于对实例执行操作。

1. **验证 IAM 权限** – Amazon EC2 会检查每个实例是否具有此过程所需的 IAM 权限。未通过此检查的任何实例都将从过程中排除。IAM 权限使 CloudWatch 代理能够从实例收集指标并与AWS Systems Manager 集成以使用 SSM Agent。

1. **验证 CloudWatch 代理** – Amazon EC2 检查 CloudWatch 代理是否已安装并在每个实例上运行。如果任何实例未通过此检查，Amazon EC2 会主动为您安装和启动 CloudWatch 代理。此流程完成后，CloudWatch 代理将在每个实例上收集所选指标。

1. **选择指标配置** – 选择 CloudWatch 代理要从实例中发出的指标。选择后，Amazon EC2 会将配置文件存储在 Parameter Store 中，该文件将一直保留到过程完成。除非过程中断，否则 Amazon EC2 将从 Parameter Store 中删除配置文件。请注意，如果没有选择某指标，但之前已将其添加到实例中，则在此过程完成后，将从实例中删除该指标。

1. **更新 CloudWatch 代理配置** – Amazon EC2 将指标配置发送到 CloudWatch 代理。这是过程的最后一步。如果成功，则实例可以为所选指标发出数据，Amazon EC2 将从 Parameter Store 中删除配置文件。

## 成本
<a name="install-and-configure-cw-agent-costs"></a>

在此过程中添加的其他指标将作为自定义指标计费。有关 CloudWatch 指标定价的信息，请参阅 [Amazon CloudWatch 定价](https://aws.amazon.com/cloudwatch/pricing/)。

## 安装和配置 CloudWatch 代理
<a name="install-and-configure-cw-agent-procedure"></a>

可以使用 Amazon EC2 控制台来安装和配置 CloudWatch 代理，以添加其他指标。

**注意**  
每次执行此过程时，都将覆盖现有 CloudWatch 代理配置。如果没有选择之前选中的指标，则将从实例中删除该指标。

**使用 Amazon EC2 控制台安装和配置 CloudWatch 代理**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择要在其上安装和配置 CloudWatch 代理的实例。

1. 选择**操作**、**监控和故障排除**、**配置 CloudWatch 代理**。

1. 对于该过程中的每个步骤，请阅读控制台文本，然后选择**下一步**。

1. 要完成该过程，请在最后一步中选择**完成**。

**更新 Amazon EC2 控制台创建的代理配置**  
您可以手动自定义 EC2 控制台创建的配置。有关更多信息，请参阅《Amazon CloudWatch 用户指南》**中的[手动创建或编辑 CloudWatch 代理配置文件](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html)。
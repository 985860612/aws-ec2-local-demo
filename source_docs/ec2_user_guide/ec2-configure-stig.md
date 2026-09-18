

# EC2 实例的 STIG 合规性
<a name="ec2-configure-stig"></a>

安全技术实施指南 (STIG) 是 Defense Information Systems Agency (DISA) 创建的配置强化标准，用于保护信息系统和软件。为使您的系统符合 STIG 标准，您必须安装、配置和测试多种安全设置。

STIG 的应用基于以下漏洞分类。在创建 STIG 强化映像或将 STIG 设置应用于现有实例时，您可以选择应用到哪个级别进行强化。较高的级别包含所有较低级别的 STIG 设置。例如，*高（第一类）*级别包括“中等”和“低”类别的设置。

**法规遵从性级别**
+ **高（第一类）**

  最严重的风险。包括可能导致机密性、可用性或完整性丢失的任何漏洞。
+ **中等（第二类）**

  包括可能导致机密性、可用性或完整性丢失的任何漏洞，但可以减轻风险。
+ **低（第三类）**

  包括任何会降级用于防止机密性、可用性或完整性丢失的措施的漏洞。

Amazon EC2 提供以下方法来创建 STIG 强化实例：
+ 您可以从专门的公共 AWS Windows AMI 启动预先配置为 STIG 强化的 Windows 实例。有关更多信息，请参阅《AWS Windows AMI reference》中的 [STIG Hardened AWS Windows Server AMIs](https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/ami-windows-stig.html)**。
+ 您可以创建自定义 AMI 来启动使用 EC2 Image Builder STIG 强化组件构建的预配置实例。有关更多信息，请参阅《Image Builder User Guide》**中的 [STIG hardening components](https://docs.aws.amazon.com/imagebuilder/latest/userguide/ib-stig.html)。
+ 您可以使用 AWSEC2-ConfigureSTIG Systems Manager 命令文档将 STIG 设置应用于现有 EC2 实例。Systems Manager STIG 命令文档可扫描配置错误，运行补救脚本以安装和更新 DoD 证书，以及删除不必要的证书以维持 STIG 合规性。使用 STIG Systems Manager 文档无需额外付费。

**Topics**
+ [EC2 实例的 STIG 强化设置](ec2-stig-settings.md)
+ [STIG 强化脚本下载](ec2-stig-downloads.md)
+ [使用 AWS Systems Manager 将 STIG 设置应用到您的实例](ec2-stig-ssm-cmd-doc.md)
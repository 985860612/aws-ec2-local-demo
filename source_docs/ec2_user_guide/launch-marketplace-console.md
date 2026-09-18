

# 从 AWS Marketplace AMI 中启动 Amazon EC2 实例
<a name="launch-marketplace-console"></a>

您可以订阅 AWS Marketplace AMI 并使用 Amazon EC2 控制台或命令行工具从中启动实例。有关 AWS Marketplace AMI 的更多信息，请参阅[AWS Marketplace 中适用于 Amazon EC2 实例的付费 AMI](paid-amis.md)。

要在启动后取消对 AMI 的订阅，必须先终止从该 AMI 启动的所有实例。有关更多信息，请参阅 [管理您的 AWS Marketplace 订阅](marketplace-manage-subscriptions.md)。

**使用 Amazon EC2 控制台从 AWS Marketplace AMI 启动实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 从 Amazon EC2 控制台控制面板中，选择**启动实例**。

1. （可选）在 **Name and tags**（名称与标签）下，为 **Name**（名称）输入实例的描述性名称。

1. 在**应用程序和操作系统映像（Amazon 机器映像）**下，选择**浏览更多 AMI**，然后选择 **AWS Marketplace AMI** 选项。通过浏览类别或使用搜索功能找到合适的 AMI。选择 **Select**（选择）以选择产品。

1. 系统将打开一个窗口，显示所选产品的概览。您可以查看定价信息，以及供应商提供的任何其他信息。准备就绪后，选择**订阅并启动**。将立即开始您的订阅。在订阅过程中，您可以继续执行此过程中的步骤来配置实例。如果存在与信用卡详细信息有关的任何问题，会提示您更新账户详细信息。
**注意**  
在使用 AMI 启动实例之前，您无需为使用产品付费。选择实例类型时，记下每种受支持实例类型的定价。还可能对产品征收其他税款。

1. 对于 **Instance type**（实例类型），请为您的实例选择实例类型。实例类型定义了要启动的实例的硬件配置和大小。

1. （可选）在**密钥对（登录）**下，为**密钥对名称**选择一个现有密钥对或新建一个密钥对。

1. 在**网络设置**下，对于**防火墙（安全组）**，记下按照产品供应商规格创建的新安全组。安全组中的规则可能允许通过 Linux 上的 SSH（端口 22）或 Windows 上的 RDP（端口 3389）进行所有 IPv4 地址 (`0.0.0.0/0`) 访问。我们建议您调整这些规则，以仅允许特定地址或地址范围通过这些端口访问您的实例。

1. 您可以使用屏幕上的其他字段来配置实例、添加存储以及添加标签。有关可以配置的不同选项的信息，请参阅 [Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

1. 在 **Summary**（摘要）面板的 **Software Image (AMI)** [软件映像（AMI）] 下，检查要从中启动实例的 AMI 的详细信息。此外，还要检查您指定的其他配置的详细信息。当您准备好启动您的实例时，请选择 **Launch instance**（启动实例）。

1. 根据订阅的产品，实例可能需要几分钟或更多时间来启动。如果存在与信用卡详细信息有关的任何问题，会提示您更新账户详细信息。启动确认页面显示时，选择 **View all instances**（查看所有实例）以转到 **Instances**（实例）页面。
**注意**  
只要实例处于 `running` 状态（即使处于空闲状态），就会收取订阅费用。如果实例停止，仍可能会收取存储费。

1. 当实例处于 `running` 状态时，可以连接到实例。为此，请在列表中选择实例，然后选择 **Connect**（连接）并选择一个连接选项。有关连接到实例的更多信息，请参阅[连接到您的 EC2 实例](connect.md)。
**重要**  
仔细查看供应商的使用说明，因为您可能需要使用特定用户名来连接实例。有关访问订阅详细信息的信息，请参阅 [管理您的 AWS Marketplace 订阅](marketplace-manage-subscriptions.md)。

1. 如果实例无法启动或状态立即转至 `terminated` 而非 `running`，请参阅 [排查 Amazon EC2 实例启动问题](troubleshooting-launch.md)。

**使用命令行工具从 AWS Marketplace AMI 启动实例**  
要使用命令行工具从 AWS Marketplace 产品启动实例，请首先确保订阅了该产品。然后您可使用以下方法通过该产品的 AMI ID 启动一个实例：


| 方法 | 文档 | 
| --- | --- | 
| AWS CLI | 使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令，或参阅《AWS Command Line Interface 用户指南》**中的[启动实例](https://docs.aws.amazon.com/cli/latest/userguide/cli-services-ec2-instances.html)主题了解更多信息。 | 
| AWS Tools for Windows PowerShell  | 使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) 命令，或参阅以下主题了解更多信息：[使用 Windows PowerShell 启动 Amazon EC2 实例](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-ec2-launch.html) | 
| 查询 API | 使用 [RunInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RunInstances.html) 请求。 | 
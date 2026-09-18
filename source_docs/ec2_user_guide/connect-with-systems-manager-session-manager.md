

# 使用 Session Manager 连接到 Amazon EC2 实例
<a name="connect-with-systems-manager-session-manager"></a>

会话管理器是一项完全托管的 AWS Systems Manager 功能，可让您通过基于浏览器的交互式 Shell 或通过 AWS CLI 管理 Amazon EC2 实例。您可以使用会话管理器通过您账户中的实例来开启会话。开启会话后，您可以像对任何其他连接类型一样在实例上运行交互式命令。有关会话管理器的更多信息，请参阅 *AWS Systems Manager 用户指南* 中的 [AWS Systems Manager 会话管理器](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)。

**先决条件**  
在尝试使用 Session Manager 连接到实例之前，必须先完成必要的设置步骤。例如，实例必须由 SSM 托管且具有附加了 **AmazonSSMManagedInstanceCore** 策略的 IAM 角色。有关更多信息，请参阅[设置 Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started.html)。

**在 Amazon EC2 控制台上通过会话管理器连接到 Amazon EC2 实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例，然后选择**连接**。

1. 对于连接方法，请选择 **Session Manager**。

1. 选择**连接**来启动会话。  
![“Session Manager”选项卡上的“连接”按钮。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/connect-method-session-manager.png)

**问题排查**  
如果您收到一个错误，该错误指示您无权执行一个或多个 Systems Manager 操作 (`ssm:{{command-name}}`)，则必须更新策略，以便允许您从 Amazon EC2 控制台开始会话。有关更多信息和说明，请参阅《AWS Systems Manager 用户指南[https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-restrict-access-quickstart.html](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-restrict-access-quickstart.html)》中的 *Session Manager 快速入门默认 IAM 策略*。
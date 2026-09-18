

# 使用 Fleet Manager 连接到 Windows 实例
<a name="connect-rdp-fleet-manager"></a>

您可以使用 Fleet Manager（AWS Systems Manager 的一项功能）通过远程桌面协议（RDP）连接到 Windows 实例，并在 AWS 管理控制台 中的同一页面上显示最多四个 Windows 实例。您可以直接从 Amazon EC2 控制台中的**实例**页面连接到 Fleet Manager 远程桌面中的第一个实例。有关 Fleet Manager 的更多信息，请参阅《AWS Systems Manager 用户指南》**中的[使用 Remote Desktop 连接到托管式实例](https://docs.aws.amazon.com/systems-manager/latest/userguide/fleet-manager-remote-desktop-connections.html)。

如果您使用 Fleet Manager 进行连接，则无需特别允许来自您 IP 地址的传入 RDP 流量。Fleet Manager 会进行处理。

**先决条件**  
在尝试使用 Fleet Manager 连接到实例之前，必须先设置环境。有关更多信息，请参阅《AWS Systems Manager 用户指南》中的[设置环境](https://docs.aws.amazon.com/systems-manager/latest/userguide/fleet-manager-remote-desktop-connections.html#rdp-prerequisites)。**

**使用 Fleet Manager 连接到 Windows 实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 从导航窗格中选择 **Instances**（实例）。

1. 选择该实例，然后选择 **Connect** (连接)。

1. 在 **RDP 客户端**选项卡的**连接类型**中，选择**使用 Fleet Manager 进行连接**。

1. 选择 **Fleet Manager 远程桌面**。此操作将打开 AWS Systems Manager 控制台中的 **Fleet Manager Remote Desktop**（Fleet Manager 远程桌面）页面。

1. 输入凭证，然后选择**连接**。

1. 如果 RDP 连接成功，Fleet Manager 会显示 Windows 桌面。完成会话后，依次选择**操作**、**结束会话**。

有关更多信息，请参阅《AWS Systems Manager 用户指南》中的[使用 Remote Desktop 连接到 Windows Server 托管式实例](https://docs.aws.amazon.com/systems-manager/latest/userguide/fleet-manager-remote-desktop-connections.html)。**
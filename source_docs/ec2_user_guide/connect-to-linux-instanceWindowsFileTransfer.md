

# 使用 RDP 将文件传输到 Windows 实例
<a name="connect-to-linux-instanceWindowsFileTransfer"></a>

您可以像操作任何 Windows 服务器那样操作您的 Windows 实例。例如，您可以使用 Microsoft 远程桌面连接（RDP）软件的本地文件共享功能，在 Windows 实例与您的本地计算机之间传输文件。您可以访问硬盘驱动器、DVD 驱动器、便携式媒体驱动器和映射网络驱动器上的本地文件。

要从 Windows 实例访问本地文件，必须通过将远程会话驱动器映射到本地驱动器来启用本地文件共享功能。这些步骤略有不同，具体取决于您的本地电脑操作系统是 Windows 还是 macOS X。

要详细了解使用 RDP 进行连接的先决条件，请参阅[先决条件](connect-rdp.md#rdp-prereqs)。

------
#### [ Windows ]

**在本地 Windows 电脑上将远程会话驱动器映射到本地驱动器**

1. 打开远程桌面连接客户端。

1. 选择 **Show Options**。

1. 将实例主机名添加到**计算机**字段，将用户名添加到**用户名**字段，如下所示：

   1. 在 **Connection settings**（连接设置）项下，选择 **Open...**（打开…），然后浏览到您从 Amazon EC2 控制台下载的 RDP 快捷方式文件。该文件包含公有 IPv4 DNS 主机名（用于标识实例）和管理员用户名。

   1. 选择文件，然后选择 **Open**（打开）。使用 RDP 快捷方式文件中的值填充 **Computer**（电脑）和 **User name**（用户名）字段。

   1. 选择**保存**。

1. 选择 **Local Resources (本地资源)** 选项卡。

1. 在 **Local Devices and resources (本地设备和资源)** 项下，选择 **More...**（更多…）。  
![“RDP 本地资源”窗口。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/windows-connect-rdp-local-resources.png)

1. 打开 **Drives (驱动器)** 并选择要映射到 Windows 实例的本地驱动器。

1. 选择 **OK (确定)**。  
![RDP 本地设备和资源窗口。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/windows-connect-rdp-drives.png)

1. 选择 **Connect (连接)** 以连接到您的 Windows 实例。

------
#### [ macOS X ]

**在本地 macOS X 电脑上将远程会话驱动器映射到本地文件夹**

1. 打开远程桌面连接客户端。

1. 浏览到从 Amazon EC2 控制台下载的 RDP 文件（初次连接到实例时），然后将其拖到远程桌面连接客户端上。

1. 打开 RDP 文件的上下文（右键单击）菜单，然后选择**编辑**。

1. 选择**文件夹**选项卡，然后选择**重定向文件夹**复选框。  
![Microsoft 远程桌面编辑 PC 窗口。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/mac-map-folder-1.png)

1. 选择左下角的 **\+** 图标，浏览到要映射的文件夹，然后选择 **Open**（打开）。对要映射的每个文件夹重复此步骤。

1. 选择**保存**。

1. 选择 **Connect (连接)** 以连接到您的 Windows 实例。系统将提示您输入密码。

1. 在实例的文件资源管理器中，展开 **This PC**（此电脑），然后找到您可以从中访问本地文件的共享文件夹。在以下屏幕截图中，本地电脑上的 **Desktop**（桌面）文件夹已映射到实例上的远程会话驱动器。  
![Microsoft 远程桌面编辑 PC 窗口。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/mac-map-folder-2.png)

有关使本地设备可用于 Mac 电脑上远程会话的更多信息，请参阅[开始使用 macOS 客户端](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-mac)。

------
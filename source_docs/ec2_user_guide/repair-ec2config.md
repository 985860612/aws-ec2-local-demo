

# 排查 EC2Config 启动代理的问题
<a name="repair-ec2config"></a>

以下信息可帮助您解决与 EC2Config 服务相关的问题。

## 更新无法访问的实例上的 EC2Config
<a name="repair-stopped-w2k3"></a>

通过执行以下过程，使用远程桌面更新无法访问的 Windows Server 实例上的 EC2Config 服务。

**更新您无法连接到的 Amazon EBS 支持的 Windows 实例上的 EC2Config**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 找到受影响的实例。选择实例并选择 **Instance state (实例状态)**，然后选择 **Stop instance (停止实例)**。
**警告**  
停止某个实例时，实例存储卷上的数据将会丢失。要保留这些数据，请将其备份到持久性存储中。

1. 选择 **Launch instances (启动实例)** 并在受影响实例所在的同一可用区中创建一个临时 `t2.micro` 实例。使用与用于启动受影响实例的 AMI 不同的 AMI。
**重要**  
如果您未在与受影响实例相同的可用区中创建该实例，则无法将受影响的实例的根卷附加到新实例。

1. 在 EC2 控制台中，选择 **Volumes**。

1. 找到受影响的实例的根卷。分离卷并向之前创建的临时实例附加卷。使用默认设备名称 (xvdf) 附加该卷。

1. 使用远程桌面连接临时实例，然后通过磁盘管理实用工具使该卷可供使用。

1. [下载](https://s3.amazonaws.com/ec2-downloads-windows/EC2Config/EC2Install.zip)最新版本的 EC2Config 服务。将文件从 `.zip` 文件提取到附加的驱动器上的 `Temp` 目录。

1. 在临时实例上，打开“运行”对话框，键入 **regedit**，然后按 Enter。

1. 选择 `HKEY_LOCAL_MACHINE`。从 **File** 菜单中，选择 **Load Hive**（加载 Hive）。选择驱动器，然后导航至以下文件并打开：`Windows\System32\config\SOFTWARE`。当系统提示时，请指定密钥名称。

1. 选择刚加载的键并导航至 `Microsoft\Windows\CurrentVersion`。选择 `RunOnce` 密钥。如果此密钥不存在，则从上下文 (右键单击) 菜单中选择 `CurrentVersion`，然后选择 **New** 和 **Key**。为密钥 `RunOnce` 命名。

1. 从上下文（右键单击）菜单中，依次选择 `RunOnce` 密钥、**New** 和 **String Value**。输入 `Ec2Install` 作为名称并输入 `C:\Temp\Ec2Install.exe /quiet` 作为数据。

1. 选择 `HKEY_LOCAL_MACHINE\{{specified key name}}\Microsoft\Windows NT\CurrentVersion\Winlogon` 密钥。从上下文（右键单击）菜单中选择 **New**，然后选择 **String Value**。输入 **AutoAdminLogon** 作为名称并输入 **1** 作为值数据。

1. 选择 `HKEY_LOCAL_MACHINE\{{specified key name}}\Microsoft\Windows NT\CurrentVersion\Winlogon>` 密钥。从上下文（右键单击）菜单中选择 **New**，然后选择 **String Value**。输入 **DefaultUserName** 作为名称并输入 **Administrator** 作为值数据。

1. 选择 `HKEY_LOCAL_MACHINE\{{specified key name}}\Microsoft\Windows NT\CurrentVersion\Winlogon` 密钥。从上下文（右键单击）菜单中选择 **New**，然后选择 **String Value**。键入 **DefaultPassword** 作为名称，然后在值数据中输入密码。

1. 在注册表编辑器导航窗格中，选择在首次打开注册表编辑器时创建的临时项。

1. 从 **File**（文件）菜单中，选择 **Unload Hive**（卸载 Hive）。

1. 在磁盘管理实用工具中，选择以前附加的驱动器，打开上下文 (右键单击) 菜单，然后选择**脱机**。

1. 在 Amazon EC2 控制台中，将受影响的卷与临时实例分离，然后将其重新附加到具有设备名称 `/dev/sda1` 的实例。您必须指定此设备名称才能将卷指派为根卷。

1. [启动和停止 Amazon EC2 实例](Stop_Start.md)实例。

1. 在实例启动后，检查系统日志并确认看到消息 Windows is ready to use。

1. 打开注册表编辑器并选择 `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon`。删除您之前创建的字符串值密钥：**AutoAdminLogon**、**DefaultUserName** 和 **DefaultPassword**。

1. 删除或停止您在本过程中创建的临时实例。
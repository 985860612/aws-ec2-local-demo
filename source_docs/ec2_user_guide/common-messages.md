

# 排查 Amazon EC2 Windows 实例的启动问题
<a name="common-messages"></a>

以下问题排查技巧有助于解决与 Amazon EC2 Windows 实例相关的密码和激活问题。

**Topics**
+ ["密码不可用"](#password-not-available)
+ ["密码尚不可用"](#password-not-ready)
+ ["无法检索 Windows 密码"](#cannot-retrieve-password)
+ ["等待元数据服务"](#metadata-unavailable)
+ ["无法激活 Windows"](#activate-windows)
+ ["Windows 不是正版 (0x80070005)"](#windows-not-genuine)
+ ["没有终端服务器许可服务器可提供许可证"](#no-license-servers)
+ [“某些设置由您的组织管理”](#some-settings-managed-by-org)

## "密码不可用"
<a name="password-not-available"></a>

要使用远程桌面连接到 Windows 实例，必须指定账户和密码。提供的账户和密码基于用于启动实例的 AMI。您可以为管理员账户检索自动生成的密码，也可以使用在创建该 AMI 的原始实例中所用的账户和密码。

您可以为使用自定义 Windows AMI 启动的实例生成管理员账户密码。要生成密码，您需要在创建 AMI 之前在操作系统中配置一些设置。有关更多信息，请参阅 [创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。

如果未将 Windows 实例配置为生成随机密码，则在使用控制台检索自动生成的密码时会收到以下消息：

```
Password is not available.
The instance was launched from a custom AMI, or the default password has changed. A
password cannot be retrieved for this instance. If you have forgotten your password, you can
reset it using the Amazon EC2 configuration service. For more information, see Passwords for a
Windows Server instance.
```

检查实例的控制台输出，查看用于启动实例的 AMI 是不是在禁用了密码生成的情况下创建的。如果禁用了密码生成，则控制台输出包含以下内容：

```
Ec2SetPassword: Disabled
```

如果禁用了密码生成并且您未记住原始实例的密码，则可以重置该实例的密码。有关更多信息，请参阅[重置 Amazon EC2 Windows 实例的 Windows 管理员密码](ResettingAdminPassword.md)。

## "密码尚不可用"
<a name="password-not-ready"></a>

要使用远程桌面连接到 Windows 实例，必须指定账户和密码。提供的账户和密码基于用于启动实例的 AMI。您可以为管理员账户检索自动生成的密码，也可以使用在创建该 AMI 的原始实例中所用的账户和密码。

您的密码应在几分钟内可用。如果密码不可用，则在使用控制台检索自动生成的密码时会收到以下消息：

```
Password not available yet.
Please wait at least 4 minutes after launching an instance before trying to retrieve the 
auto-generated password.
```

如果超过四分钟后您仍然无法获取密码，则您的实例的启动代理可能未配置为生成密码。请根据控制台输出是否为空，对此进行验证。有关更多信息，请参阅[无法获取控制台输出](win-ts-common-issues.md#no-console-output)。

另请验证用于访问管理门户的 AWS Identity and Access Management（IAM）账户是否允许执行 `ec2:GetPasswordData` 操作。有关 IAM 权限的更多信息，请参阅[什么是 IAM？](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)。

## "无法检索 Windows 密码"
<a name="cannot-retrieve-password"></a>

要为管理员账户检索自动生成的密码，您必须针对启动实例时指定的密钥对使用私有密钥。如果在启动实例时未指定密钥对，您将会收到以下消息。

```
Cannot retrieve Windows password
```

您可以终止该实例并使用相同的 AMI 启动新实例，并确保指定密钥对。

## "等待元数据服务"
<a name="metadata-unavailable"></a>

Windows 实例必须包含其实例元数据中的信息才能将自身激活。默认情况下，`WaitForMetaDataAvailable` 设置可确保 EC2Config 服务等待实例元数据可以访问，然后继续启动过程。有关更多信息，请参阅[使用实例元数据管理 EC2 实例](ec2-instance-metadata.md)。

如果实例未通过实例可到达性测试，请尝试以下操作来解决此问题。
+ 检查您的 VPC 的 CIDR 块。如果 Windows 实例启动至 IP 地址范围为 `224.0.0.0` - `255.255.255.255` (D 类和 E 类 IP 地址范围) 的 VPC，则其无法正确启动。这些 IP 地址范围是预留的，不应分配给主机设备。我们建议您创建一台 CIDR 块来自私有（非公共可路由）IP 地址范围（如 [RFC 1918](http://www.faqs.org/rfcs/rfc1918.html) 所指）的 VPC。
+ 系统有可能配置了静态 IP 地址。尝试[创建网络接口](create-network-interface.md)并[将其连接到实例](network-interface-attachments.md#attach_eni)。
+ 

**在无法连接到的 Windows 实例上启用 DHCP**

  1. 停止受影响的实例并分离其根卷。

  1. 在受影响的实例所在的可用区中启动临时实例。
**警告**  
如果您的临时实例与原始实例基于相同的 AMI，则您必须完成额外的步骤，否则在您恢复原始实例的根卷之后，由于磁盘签名冲突，您将无法启动原始实例。或者，可以为临时实例选择不同的 AMI。例如，如果原始实例使用适用于 Windows Server 2016 的 AWS Windows AMI，则使用适用于 Windows Server 2019 的 AWS Windows AMI 来启动临时实例。

  1. 将根卷从受影响的实例附加到此临时实例。连接到临时实例，打开 **Disk Management (磁盘管理)** 实用工具，将驱动器联机。

  1. 从临时实例，打开 **Regedit** 并选择 **HKEY\_LOCAL\_MACHINE**。从 **File** 菜单中，选择 **Load Hive**。选择驱动器，打开文件 `Windows\System32\config\SYSTEM`，在出现提示时指定键名 (您可以使用任何名称)。

  1. 选择刚加载的键并导航至 `ControlSet001\Services\Tcpip\Parameters\Interfaces`。每个网络接口均按 GUID 列出。选择正确的网络接口。如果禁用了 DHCP 且分配了静态 IP 地址，则 `EnableDHCP` 设置为 0。要启用 DHCP，请将 `EnableDHCP` 设置为 1，并且删除以下键 (如果存在)：`NameServer`、`SubnetMask`、`IPAddress` 和 `DefaultGateway`。再次选择该键，在 **File** 菜单中，选择 **Unload Hive**。
**注意**  
如果您有多个网络接口，您将需要确定适合的 DHCP 来启用接口。要确定适合的网络接口，请查看以下键值 `NameServer`、`SubnetMask`、`IPAddress` 和 `DefaultGateway`。这些值显示前一实例的静态配置。

  1. （可选）如果已启用 DHCP，则可能是您没有通向该元数据服务的路由。更新 EC2Config 可以解决此问题。

     1. [下载](https://s3.amazonaws.com/ec2-downloads-windows/EC2Config/EC2Install.zip)并安装最新版本的 EC2Config 服务。有关安装此服务的更多信息，请参阅[安装最新版的 EC2Config](UsingConfig_Install.md)。

     1. 将文件从 `.zip` 文件提取到附加的驱动器上的 `Temp` 目录。

     1. 打开 **Regedit**，选择 **HKEY\_LOCAL\_MACHINE**。从 **File** 菜单中，选择 **Load Hive**。选择驱动器，打开文件 `Windows\System32\config\SOFTWARE`，在出现提示时指定键名 (您可以使用任何名称)。

     1. 选择刚加载的键并导航至 `Microsoft\Windows\CurrentVersion`。选择 `RunOnce` 键。(如果此键不存在，请右键单击 `CurrentVersion`，指向 **New**，选择 **Key**，然后将该键命名为 `RunOnce`。) 打开上下文（右键单击）菜单，指向**新建**，然后选择**字符串值**。输入 `Ec2Install` 作为名称并输入 `C:\Temp\Ec2Install.exe -q` 作为数据。

     1. 再次选择该键，在 **File** 菜单中，选择 **Unload Hive**。

  1. （可选）如果您的临时实例与原始实例基于相同的 AMI，则您必须完成以下步骤，否则在您恢复原始实例的根卷之后，由于磁盘签名冲突，您将无法启动原始实例。
**警告**  
以下过程介绍了如何使用注册表编辑器编辑 Windows 注册表。如果您不熟悉 Windows 注册表或如何安全地使用注册表编辑器进行更改，请参阅[配置注册表](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc725612(v=ws.11))。

     1. 打开命令提示符，键入 **regedit.exe**，然后按 Enter。

     1. 在 **Registry Editor (注册表编辑器)** 中，从上下文菜单（右键单击）中选择 **HKEY\_LOCAL\_MACHINE**，然后选择 **Find (查找)**。

     1. 键入 **Windows Boot Manager**，然后选择 **Find Next (查找下一个)**。

     1. 选择名为 `11000001` 的密钥。此密钥是您在上一步中找到的密钥的同级。

     1. 在右侧窗格中，选择 `Element`，然后从上下文菜单（右键单击）中选择 **Modify (修改)**。

     1. 找到数据中偏移 0x38 处的四字节磁盘签名。反转字节以创建磁盘签名，然后将其记录下来。例如，由以下数据表示的磁盘签名是 `E9EB3AA5`：

        ```
        ...
        0030  00 00 00 00 01 00 00 00
        0038  {{A5 3A EB E9}} 00 00 00 00
        0040  00 00 00 00 00 00 00 00
        ...
        ```

     1. 在命令提示符窗口运行以下命令以启动 Microsoft DiskPart。

        ```
        diskpart
        ```

     1. 运行以下 DiskPart 命令以选择卷。（您可以使用**磁盘管理**实用程序验证磁盘号是否为 1。）

        ```
        DISKPART> select disk {{1}}
        
        Disk {{1}} is now the selected disk.
        ```

     1. 运行以下 DiskPart 命令以获取磁盘签名。

        ```
        DISKPART>  uniqueid disk
        
        Disk ID: {{0C764FA8}}
        ```

     1. 如果上一步中显示的磁盘签名与之前写下的 BCD 中的磁盘签名不匹配，请使用以下 DiskPart 命令更改磁盘签名，使其匹配：

        ```
        DISKPART> uniqueid disk id={{E9EB3AA5}}
        ```

  1. 使用 **Disk Management (磁盘管理)** 实用工具，将驱动器脱机。
**注意**  
如果临时实例与受影响的实例运行相同的操作系统，则驱动程序将自动离线，因此您无需手动使其离线。

  1. 将该卷从临时实例分离。如果您不再使用临时实例，则可以将其终止。

  1. 将受影响实例的根卷作为 `/dev/sda1` 附加，从而将其还原。

  1. 启动受影响的实例。

如果您已连接到实例，请从该实例打开 Internet 浏览器，然后输入元数据服务器的以下 URL：

```
http://169.254.169.254/latest/meta-data/
```

如果您无法连接到元数据服务器，请尝试以下操作解决问题：
+ [下载](https://s3.amazonaws.com/ec2-downloads-windows/EC2Config/EC2Install.zip)并安装最新版本的 EC2Config 服务。有关安装此服务的更多信息，请参阅[安装最新版的 EC2Config](UsingConfig_Install.md)。
+ 检查 Windows 实例是否正在运行 Red Hat PV 驱动程序。如果正在运行这种驱动程序，请更新至 Citrix PV 驱动程序。有关更多信息，请参阅 [在 EC2 Windows 实例上升级半虚拟化驱动程序](Upgrading_PV_drivers.md)。
+ 验证防火墙、IPSec 和代理设置没有阻止到元数据服务 (`169.254.169.254`) 或 AWS KMS 服务器（地址在 `TargetKMSServer` 中的 `C:\Program Files\Amazon\Ec2ConfigService\Settings\ActivationSettings.xml` 元素中指定）的传出流量。
+ 使用以下命令验证您拥有到元数据服务 (`169.254.169.254`) 的路由。

  ```
  route print
  ```
+ 检查可能影响您的实例的可用区的网络问题。请访问 [http://status.aws.amazon.com/](https://status.aws.amazon.com/)。

## "无法激活 Windows"
<a name="activate-windows"></a>

Windows 实例使用 Windows AWS KMS 激活。如果您的实例无法访问 `A problem occurred when Windows tried to activate. Error Code 0xC004F074` 服务器，您可能会收到此消息：AWS KMS。必须每隔 180 天激活一次 Windows。在激活期限到期之前，EC2Config 会尝试连接 AWS KMS 服务器以确保 Windows 仍处于激活状态。

如果您遇到 Windows 激活问题，请使用以下过程来解决此问题。

**对于 EC2Config（Windows Server 2012 R2 AMI 及更早版本）**

1. [下载](https://s3.amazonaws.com/ec2-downloads-windows/EC2Config/EC2Install.zip)并安装最新版本的 EC2Config 服务。有关安装此服务的更多信息，请参阅[安装最新版的 EC2Config](UsingConfig_Install.md)。

1. 登录实例并打开以下文件：`C:\Program Files\Amazon\Ec2ConfigService\Settings\config.xml`。

1. 在 文件中找到 **Ec2WindowsActivate** 插件。`config.xml`将状态更改为 **Enabled** 并保存您的更改。

1. 在 Windows 服务管理单元中，重新启动 EC2Config 服务或者重启实例。

如果这没有解决激活问题，请按照下面这些额外步骤操作。

1. 设定 AWS KMS 目标：**C:\\> slmgr.vbs /skms 169.254.169.250:1688**

1. 激活 Windows：**C:\\> slmgr.vbs /ato**

**对于 EC2Launch（Windows Server 2016 AMI 及更高版本）**

1. 从具有管理权限的 PowerShell 提示符中，导入 EC2Launch 模块：

   ```
   PS C:\> Import-Module "C:\ProgramData\Amazon\EC2-Windows\Launch\Module\Ec2Launch.psd1"
   ```

1. 调用 Add Routes 函数查看新路由列表：

   ```
   PS C:\> Add-Routes
   ```

1. 调用 Set-ActivationSettings 函数：

   ```
   PS C:\> Set-Activationsettings
   ```

1. 然后，运行以下脚本以激活 Windows：

   ```
   PS C:\> cscript "${env:SYSTEMROOT}\system32\slmgr.vbs" /ato
   ```

 对于 EC2Config 和 EC2Launch，如果您仍收到激活错误，请验证以下信息。
+ 确认您有到 AWS KMS 服务器的路由。打开 `C:\Program Files\Amazon\Ec2ConfigService\Settings\ActivationSettings.xml`，找到 `TargetKMSServer` 元素。运行以下命令，检查是否列出了这些 AWS KMS 服务器的地址。

  ```
  route print
  ```
+ 确认已设置 AWS KMS 客户端密钥。运行以下命令并检查输出。

  ```
  C:\Windows\System32\slmgr.vbs /dlv
  ```

  如果输出包含 Error: product key not found，则说明未设置 AWS KMS 客户端密钥。如果未设置 AWS KMS 客户端密钥，请按 Microsoft 文章（[AWS KMS 客户端激活和产品密钥](https://learn.microsoft.com/en-us/windows-server/get-started/kms-client-activation-keys)）中的说明查找客户端密钥，然后运行以下命令来设置 AWS KMS 客户端密钥。

  ```
  C:\Windows\System32\slmgr.vbs /ipk {{client_key}}
  ```
+ 确认系统的时间和时区是正确的。如果您使用的是 UTC 之外的其他时区，请添加以下注册表项并将其设置为 `1` 以确保时间正确：`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\TimeZoneInformation\RealTimeIsUniversal`。
+ 如果启用了 Windows 防火墙，请使用以下命令临时将其禁用。

  ```
  netsh advfirewall set allprofiles state off
  ```

## "Windows 不是正版 (0x80070005)"
<a name="windows-not-genuine"></a>

Windows 实例使用 Windows AWS KMS 激活。如果实例无法完成激活过程，则会报告该 Windows 副本不是正版。

请尝试有关["无法激活 Windows"](#activate-windows) 的建议。

## "没有终端服务器许可服务器可提供许可证"
<a name="no-license-servers"></a>

默认情况下，Windows Server 已获得授权，允许两个用户通过远程桌面同时使用。如果需要允许两个以上用户通过远程桌面同时访问您的 Windows 实例，您可以购买远程桌面服务客户端访问许可证 (CAL)，并安装“Remote Desktop Session Host (远程桌面会话主机)”和“Remote Desktop Licensing Server (远程桌面许可服务器)”角色。

检查有无以下问题：
+ 已超过并发 RDP 会话的最大数目。
+ 已安装 Windows 远程桌面服务角色。
+ 许可已过期。如果许可已过期，那么您无法作为用户连接到您的 Windows 实例。您可以尝试以下操作：
  + 使用 `/admin` 参数从命令行连接到实例，例如：

    ```
    mstsc /v:{{instance}} /admin
    ```

    有关更多信息，请参阅以下 Microsoft 文章：[通过命令行访问远程桌面](https://learn.microsoft.com/en-us/archive/technet-wiki/4487.access-remote-desktop-via-commandline)。
  + 停止该实例，分离其 Amazon EBS 卷，然后将这些卷附加到同一可用区中的另一个实例以恢复数据。

## “某些设置由您的组织管理”
<a name="some-settings-managed-by-org"></a>

从最新的 Windows Server AMI 启动的实例可能会显示 Windows Update 对话框消息，说明“某些设置由您的组织管理”。显示此消息是由于 Windows Server 中的一些变化导致的，不会影响 Windows Update 的行为或您管理更新设置的能力。

**消除警告**

1. 打开 `gpedit.msc`，并依次导航到**计算机配置**、**管理模板**、**Windows 组件**、**Windows 更新**。编辑**配置自动更新**，并将其设置为**已启用**。

1. 在命令提示符下，使用 **gpupdate /force** 更新组策略。

1. 关闭并重新打开“Windows 更新设置”。此时将会看到有关您的组织正在管理的设置的上述消息，然后显示“我们将自动下载更新，但通过按流量计费的连接除外（在此情况下会收费）。在这种情况下，我们将自动下载保持 Windows 平稳运行所需的更新”。

1. 返回到 `gpedit.msc`，并将组策略重新设置为**未配置**。再次运行 **gpupdate /force**。

1. 关闭命令提示符并等待几分钟。

1. 重新打开“Windows 更新设置”。您将不会再看到“某些设置由您的组织管理”消息。
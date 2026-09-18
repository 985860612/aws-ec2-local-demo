

# 排查连接到 Amazon EC2 Windows 实例时遇到的问题
<a name="troubleshoot-connect-windows-instance"></a>

以下信息和常见错误可以帮助您排查连接到 Windows 实例时出现的问题。

**Topics**
+ [远程桌面无法连接到远程计算机](#rdp-issues)
+ [使用 macOS RDP 客户端时出错](#troubleshoot-instance-connect-mac-rdp)
+ [RDP 显示黑屏而不是桌面](#rdp-black-screen)
+ [无法使用非管理员用户远程登录到实例](#remote-failure)
+ [使用 AWS Systems Manager 解决远程桌面问题](#Troubleshooting-Remote-Desktop-Connection-issues-using-AWS-Systems-Manager)
+ [在具有远程注册表的 EC2 实例上启用远程桌面](#troubleshooting-windows-rdp-remote-registry)
+ [我丢失了私有密钥。我怎样才能连接到我的 Windows 实例？](#replacing-lost-key-pair-windows)

## 远程桌面无法连接到远程计算机
<a name="rdp-issues"></a>

尝试以下操作以解决与连接实例有关的问题：
+ 确认您使用的是正确的公有 DNS 主机名。(在 Amazon EC2 控制台中，请选择实例，并在详细信息窗格中查看 **Public DNS (IPv4) (公有 DNS (IPv4))**。) 如果您的实例是在 VPC 中，并且您没有看到公有 DNS 名称，则必须启用 DNS 主机名。有关更多信息，请参阅《Amazon VPC 用户指南》**中的 [VPC 的 DNS 属性](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html)。
+ 验证您的实例是否具有公有 IPv4 地址。如果没有，您可以将弹性 IP 地址与您的实例关联。有关更多信息，请参阅[弹性 IP 地址](elastic-ip-addresses-eip.md)。
+ 要使用 IPv6 地址连接到您的实例，请检查本地计算机是否具有 IPv6 地址以及是否已配置为可使用 IPv6。有关更多信息，请参阅《Amazon VPC 用户指南》**中的[在实例中配置 IPv6](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-migrate-ipv6.html#vpc-migrate-ipv6-dhcpv6)。
+ 确认安全组具有允许端口 3389 RDP 访问的规则。
+ 如果您输入复制的密码，然后收到错误消息 `Your credentials did not work`，请尝试根据系统提示手动键入密码。可能是复制密码时丢失了字符或添加了额外空格。
+ 确认实例已通过状态检查。有关更多信息，请参阅[Amazon EC2 实例的状态检查](monitoring-system-instance-status-check.md)和[通过失败状态检查来排查 Amazon EC2 Linux 实例问题](TroubleshootingInstances.md)。
+ 确认子网的路由表具有这样一个路由，该路由将发往 VPC 外部的所有流量发送到该 VPC 的 Internet 网关。有关更多信息，请参阅 *Amazon VPC 用户指南* 中的[创建自定义路由表](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html#Add_IGW_Routing)（Internet 网关）。
+ 确认 Windows 防火墙或其他防火墙软件没有阻止到实例的 RDP 流量。我们建议您禁用 Windows 防火墙，使用安全组规则来控制对实例的访问。尝试以下选项之一：
  + 可使用 [AWSSupport-TroubleshootRDP](#AWSSupport-TroubleshootRDP) 来[disable the Windows Firewall profiles using SSM Agent](#disable-firewall)。此选项要求为 AWS Systems Manager 配置实例。
  + 使用 [AWSSupport-ExecuteEC2Rescue](#AWSSupport-ExecuteEC2Rescue)。
  + 停止实例，分离根卷，然后将该卷作为数据卷附加到临时实例。连接到临时实例，将该卷联机。从数据卷加载注册表配置单元。在 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicyStandardProfile` 下方，将 `EnableFirewall` 设置为 0。卸载注册表配置单元，然后将卷脱机。从临时实例中分离卷并将其作为根卷附加到原始实例。启动原始实例。
+  验证是否在不属于 Active Directory 域的实例上禁用网络级身份验证（使用 [AWSSupport-TroubleshootRDP](#AWSSupport-TroubleshootRDP) 来 [disable NLA](#disable-nla)）。
+ 验证远程桌面服务（TermService）启动类型是否为“自动”，服务是否启动（使用 [AWSSupport-TroubleshootRDP](#AWSSupport-TroubleshootRDP) 来 [enable and start the RDP service](#rdp-auto)）。
+ 验证是否连接到正确的远程桌面协议端口，默认情况下为 3389（使用 [AWSSupport-TroubleshootRDP](#AWSSupport-TroubleshootRDP) 来 [read the current RDP port](#check-rdp) 和 [change it back to 3389](#restore-3389)）。
+  验证实例是否允许远程桌面连接（使用 [AWSSupport-TroubleshootRDP](#AWSSupport-TroubleshootRDP) 来 [enable Remote Desktop connections](#allow-rdp)）。
+ 确认密码没有过期。如果密码已过期，可以重置密码。有关更多信息，请参阅 [重置 Amazon EC2 Windows 实例的 Windows 管理员密码](ResettingAdminPassword.md)。
+ 如果您尝试使用在实例上创建的用户进行连接并收到错误消息 `The user cannot connect to the server due to insufficient access privileges`，请确认您已为该用户授予本地登录权限。有关更多信息，请参阅[向成员授予本地登录权限](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-r2-and-2008/ee957044(v%3dws.10))。
+ 如果尝试次数超过所允许的并发 RDP 会话的最大数目，则会终止会话，并显示消息 `Your Remote Desktop Services session has ended. Another user connected to the remote computer, so your connection was lost.`。默认情况下，实例可以有两个并发 RDP 会话。

## 使用 macOS RDP 客户端时出错
<a name="troubleshoot-instance-connect-mac-rdp"></a>

如果使用 Microsoft 网站上的远程桌面连接客户端连接到 Windows Server 实例，则可能会出现以下错误：

```
Remote Desktop Connection cannot verify the identity of the computer that you want to connect to.
```

从 Mac 应用商店下载 Microsoft 远程桌面应用程序，然后使用该应用程序连接到实例。

## RDP 显示黑屏而不是桌面
<a name="rdp-black-screen"></a>

请尝试以下操作解决该问题：
+ 检查控制台输出有无其他信息。要使用 Amazon EC2 控制台获取您的实例的控制台输出，请选择实例，然后依次选择 **Actions (操作)**、**Monitor and troubleshoot (显示屏和问题排查)**、**Get System Log (获取系统日志)**。
+ 确认您正在运行最新版本的 RDP 客户端。
+ 尝试使用 RDP 客户端的默认设置。
+ 如果您要使用远程桌面连接，请尝试使用 `/admin` 选项，通过以下方式将其启动。

  ```
  mstsc /v:{{instance}} /admin
  ```
+ 如果服务器正在运行全屏应用程序，则它可能会停止响应。使用 Ctrl\+Shift\+Esc 以启动 Windows 任务管理器，然后关闭应用程序。
+ 如果过度使用服务器，则服务器可能已停止响应。要使用 Amazon EC2 控制台来监控实例，请选择实例，然后选择 **Monitoring (监控)** 选项卡。如果需要将实例类型更改为更大大小，请参阅[Amazon EC2 实例类型更改](ec2-instance-resize.md)。

## 无法使用非管理员用户远程登录到实例
<a name="remote-failure"></a>

如果无法通过非管理员用户远程登录到 Windows 实例，请确保您已为该用户授予本地登录权限。请参阅[为用户或组授予本地登录到域中的域控制器的权限](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee957044(v=ws.10)#grant-a-user-or-group-the-right-to-log-on-locally-to-the-domain-controllers-in-the-domain)。

## 使用 AWS Systems Manager 解决远程桌面问题
<a name="Troubleshooting-Remote-Desktop-Connection-issues-using-AWS-Systems-Manager"></a>

您可以使用 AWS Systems Manager 解决使用 RDP 连接到 Windows 实例的问题。

### Amazon Web Services Support-TroubleshootRDP
<a name="AWSSupport-TroubleshootRDP"></a>

利用 Amazon Web Services Support-TroubleshootRDP 自动化文档，用户可以检查或修改目标实例上可影响远程桌面协议 (RDP) 连接的常规设置，如 **RDP 端口**、**网络层身份验证 (NLA)** 和 **Windows 防火墙**配置文件。默认情况下，此文档读取和输出这些设置的值。

Amazon Web Services Support-TroubleshootRDP 自动化文档可与 EC2 实例、本地实例和虚拟机 (VM)（已允许它们与 AWS Systems Manager（托管实例）一起使用）一起使用。此外，它还可以*不* 允许与 Systems Manager 一起使用的适用于 Windows 服务器的 EC2 实例一起使用。有关启用实例以与 AWS Systems Manager 一起使用的信息，请参阅《AWS Systems Manager 用户指南》**中的[托管式节点](https://docs.aws.amazon.com/systems-manager/latest/userguide/fleet-manager-managed-nodes.html)。

**使用 Amazon Web Services Support-TroubleshootRDP 文档进行故障排除**

1. 登录 [Systems Manager 控制台](https://console.aws.amazon.com/systems-manager/)。

1.  确认您与受损 实例位于同一区域。

1. 从左侧导航窗格中选择 **Documents**（文档）。

1. 在 **Owned by Amazon**（由 Amazon 拥有）选项卡上，在搜索字段中输入 `AWSSupport-TroubleshootRDP`。`AWSSupport-TroubleshootRDP` 文档显示时，选择该文档。

1. 选择**执行自动化**。

1. 对于 **Execution Mode (执行模式)**，选择 **Simple execution (简单执行)**。

1. 对于 **Input parameters (输入参数)** **InstanceId**，启用**Show interactive instance picker (显示交互式实例选取器)**。

1. 选择您的 Amazon EC2 实例。

1. 检查[示例](#AWSSupport-TroubleshootRDP-Examples)，然后选择 **Execute (执行)**。

1. 要监控执行进度，对于 **Execution status (执行状态)**，等待状态从 **Pending (待处理)** 变为 **Success (成功)**。展开 **Outputs (输出)** 以查看结果。要查看各个步骤的输出，请在 **Executed Steps (执行步骤)** 中，选择 **Step ID (步骤 ID)**。

#### Amazon Web Services Support-TroubleshootRDP 示例
<a name="AWSSupport-TroubleshootRDP-Examples"></a>

以下示例介绍如何使用 Amazon Web Services Support-TroubleshootRDP 完成常见的故障排除任务。您可以使用示例 AWS CLI [start-automation-execution](https://docs.aws.amazon.com/cli/latest/reference/ssm/start-automation-execution.html) 命令或提供的 AWS 管理控制台 链接。

**Example 示例：检查当前的 RDP 状态**  <a name="check-rdp"></a>
AWS CLI:  

```
aws ssm start-automation-execution --document-name "AWSSupport-TroubleshootRDP" --parameters "InstanceId={{i-1234567890abcdef0}}, Action=Custom" --region {{region_code}}
```
AWS Systems Manager 控制台：  

```
https://console.aws.amazon.com/systems-manager/automation/execute/AWSSupport-TroubleshootRDP?region={{region}}#documentVersion=$LATEST
```

**Example 示例：禁用 Windows 防火墙**  <a name="disable-firewall"></a>
AWS CLI:  

```
aws ssm start-automation-execution --document-name "AWSSupport-TroubleshootRDP" --parameters "InstanceId={{i-1234567890abcdef0}}, Action=Custom, Firewall=Disable" --region {{region_code}}
```
AWS Systems Manager 控制台：  

```
https://console.aws.amazon.com/systems-manager/automation/execute/AWSSupport-TroubleshootRDP?region={{region_code}}#documentVersion=$LATEST&Firewall=Disable
```

**Example 示例：禁用网络级别身份验证**  <a name="disable-nla"></a>
AWS CLI:  

```
aws ssm start-automation-execution --document-name "AWSSupport-TroubleshootRDP" --parameters "InstanceId={{i-1234567890abcdef0}}, Action=Custom, NLASettingAction=Disable" --region {{region_code}}
```
AWS Systems Manager 控制台：  

```
https://console.aws.amazon.com/systems-manager/automation/execute/AWSSupport-TroubleshootRDP?region={{region_code}}#documentVersion
```

**Example 示例：将 RDP 服务启动类型设置为自动并启动 RDP 服务**  <a name="rdp-auto"></a>
AWS CLI:  

```
aws ssm start-automation-execution --document-name "AWSSupport-TroubleshootRDP" --parameters "InstanceId={{i-1234567890abcdef0}}, Action=Custom, RDPServiceStartupType=Auto, RDPServiceAction=Start" --region {{region_code}}
```
AWS Systems Manager 控制台：  

```
https://console.aws.amazon.com/systems-manager/automation/execute/AWSSupport-TroubleshootRDP?region={{region_code}}#documentVersion=$LATEST&RDPServiceStartupType=Auto&RDPServiceAction=Start
```

**Example 示例：恢复默认 RDP 端口 (3389)**  <a name="restore-3389"></a>
AWS CLI:  

```
aws ssm start-automation-execution --document-name "AWSSupport-TroubleshootRDP" --parameters "InstanceId={{i-1234567890abcdef0}}, Action=Custom, RDPPortAction=Modify" --region {{region_code}}
```
AWS Systems Manager 控制台：  

```
https://console.aws.amazon.com/systems-manager/automation/execute/AWSSupport-TroubleshootRDP?region={{region_code}}#documentVersion=$LATEST&RDPPortAction=Modify
```

**Example 示例：允许远程连接**  <a name="allow-rdp"></a>
AWS CLI:  

```
aws ssm start-automation-execution --document-name "AWSSupport-TroubleshootRDP" --parameters "InstanceId={{i-1234567890abcdef0}}, Action=Custom, RemoteConnections=Enable" --region {{region_code}}
```
AWS Systems Manager 控制台：  

```
https://console.aws.amazon.com/systems-manager/automation/execute/AWSSupport-TroubleshootRDP?region={{region_code}}#documentVersion=$LATEST&RemoteConnections=Enable
```

### Amazon Web Services Support-ExecuteEC2Rescue
<a name="AWSSupport-ExecuteEC2Rescue"></a>

AWSSupport-ExecuteEC2Rescue 自动化文档使用 EC2Rescue for Windows Server 自动排查并修复 EC2 实例连接和 RDP 问题。有关更多信息，请参阅 [在无法访问的实例上运行 EC2Rescue 工具](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-ec2rescue.html)。

Amazon Web Services Support-ExecuteEC2Rescue 自动化文档需要停止并重新启动实例。Systems Manager Automation 将停止实例并创建亚马逊机器映像（AMI）。实例存储卷中存储的数据将会丢失。如果未使用弹性 IP 地址，公有 IP 地址将发生变化。有关更多信息，请参阅《AWS Systems Manager 用户指南》**中的[在无法访问的实例上运行 EC2Rescue 工具](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-ec2rescue.html)。

**使用 Amazon Web Services Support-ExecuteEC2Rescue 文档进行故障排除**

1. 打开 [Systems Manager 控制台](https://console.aws.amazon.com/systems-manager/)。

1. 确认您与受损 Amazon EC2 实例位于同一区域。

1. 在导航面板中，选择**文档**。

1. 搜索并选择 `AWSSupport-ExecuteEC2Rescue` 文档，然后选择**执行自动化**。

1. 在 **Execution Mode (执行模式)** 中，选择 **Simple execution (简单执行)**。

1.  在 **Input parameters (输入参数)** 部分的 **UnreachableInstanceId** 中，输入无法访问的实例的 Amazon EC2 实例 ID。

1.  （可选）对于 **LogDestination**，请输入 Amazon Simple Storage Service (Amazon S3) 存储桶名称（如果需要收集操作系统日志以便排查 Amazon EC2 实例问题）。日志会自动上传到此指定存储桶。

1. 选择 **Execute (执行)**。

1.  要监控执行进度，请在 **Execution (执行)** 状态中，等待状态从 **Pending (待处理)** 变为 **Success (成功)**。展开 **Outputs (输出)** 以查看结果。要查看各个步骤的输出，请在 **Executed Steps (执行步骤)** 中，选择 **Step ID (步骤 ID)**。

## 在具有远程注册表的 EC2 实例上启用远程桌面
<a name="troubleshooting-windows-rdp-remote-registry"></a>

如果无法访问的实例未由 AWS Systems Manager 会话管理器管理，则可以使用远程注册表启用远程桌面。

1. 从 EC2 控制台停止无法访问的实例。

1. 分离无法访问实例的根卷并将其附加到与存储卷位于同一可用区中的可访问实例。如果您在同一可用区中没有可访问的实例，请启动一个实例。记下无法访问的实例上根卷的设备名称。

1. 在可访问的实例上，打开磁盘管理。您可以通过在“命令提示符”窗口中运行以下命令来执行此操作。

   ```
   diskmgmt.msc
   ```

1. 打开来自无法访问的实例的新附加卷的上下文（右键单击）菜单，然后选择**在线**。

1. 打开 Windows 注册表编辑器。您可以通过在“命令提示符”窗口中运行以下命令来执行此操作。

   ```
   regedit
   ```

1. 在注册表编辑器中，选择 **HKEY\_LOCAL\_MACHINE**，然后选择**文件**、**加载配置单元**。

1. 选择附加卷的驱动器，导航到 `\Windows\System32\config\`，选择 `SYSTEM`，然后选择 **Open (打开)**。

1. 对于 **Key Name (密钥名称)**，输入配置单元的唯一名称，然后选择 **OK (确定)**。

1. 在对注册表进行任何更改之前，备份注册表配置单元。

   1. 在注册表编辑器控制台树中，选择您加载的配置单元：**HKEY\_LOCAL\_MACHINE**\\{{your-key-name}}。

   1. 选择**文件**、**导出**。

   1. 在 Export Registry File (导出注册表文件) 对话框中，选择要保存备份副本的位置，然后在 **File name (文件名)** 字段中键入备份文件的名称 。

   1. 选择**保存**。

1. 在注册表编辑器中，导航到 `HKEY_LOCAL_MACHINE\{{your key name}}\ControlSet001\Control\Terminal Server`，然后在详细信息窗格中打开 **fDenyTSConnections**。

1. 在 **Edit DWORD (编辑 DWORD)** 值框中，在 **Value data (值数据)** 字段中输入 `0`。

1. 选择 **OK**。
**注意**  
如果 **Value data (值数据)** 字段中的值为 `1`，则实例将拒绝远程桌面连接。值为 `0` 允许远程桌面连接。

1. 在注册表编辑器中，选择 **HKEY\_LOCAL\_MACHINE**\\{{your-key-name}}，然后选择**文件**、**卸载配置单元**。

1. 关闭注册表编辑器和磁盘管理。

1. 在 EC2 控制台中，将根卷与可访问的实例分离，然后将其重新附加到无法访问的实例。将卷附加到无法访问的实例时，请在**设备**字段中输入您之前保存的设备名称。

1. 重新启动无法访问的实例。

## 我丢失了私有密钥。我怎样才能连接到我的 Windows 实例？
<a name="replacing-lost-key-pair-windows"></a>

当您连接到新启动的 Windows 实例时，您需要使用在启动实例时指定的密钥对的私有密钥对管理员账户的密码进行解密。

如果丢失了管理员密码并且不再具有私有密钥，您必须重置密码或创建新的实例。有关更多信息，请参阅 [重置 Amazon EC2 Windows 实例的 Windows 管理员密码](ResettingAdminPassword.md)。有关使用 Systems Manager 文档重置密码的步骤，请参阅《AWS Systems Manager 用户指南》**中的[重置 Amazon EC2 实例上的密码和 SSH 密钥](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-ec2reset.html)。
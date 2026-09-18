

# 使用 Windows Sysprep 和 EC2Launch v2 创建 AMI
<a name="sysprep-using-ec2launchv2"></a>

当您从安装了 EC2Launch v2 代理的实例创建映像时，EC2Launch v2 会在准备映像时执行特定的任务。这包括使用 Windows Sysprep。有关更多信息，请参阅 [Windows Sysprep 阶段](ami-create-win-sysprep.md#sysprep-phases)。

**Topics**
+ [Windows Sysprep 操作](#sysprep-actions-ec2launchv2)
+ [Sysprep 之后](#sysprep-post-ec2launchv2)
+ [使用 EC2Launch v2 运行 Windows Sysprep](#sysprep-gui-procedure-ec2launchv2)

## Windows Sysprep 操作
<a name="sysprep-actions-ec2launchv2"></a>

在准备映像的过程中，Windows Sysprep 和 EC2Launch v2 会执行以下操作。

1. 当您在 **EC2Launch 设置**对话框中选择**使用 Sysprep 关闭**时，系统会运行 `ec2launch sysprep` 命令。

1. EC2Launch v2 通过读取 `unattend.xml` 的注册表值来编辑 `HKEY_USERS\.DEFAULT\Control Panel\International\LocaleName` 文件的内容。该文件位于以下目录中：`C:\ProgramData\Amazon\EC2Launch\sysprep`。

1. 系统运行 `BeforeSysprep.cmd`。该命令创建一个注册表项，如下所示：

   **reg add "HKEY\_LOCAL\_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG\_DWORD /d 1 /f**

   该注册表项禁用 RDP 连接，直到它们重新启用。禁用 RDP 连接是必需的安全措施，因为在 Windows Sysprep 运行之后的第一个启动会话过程中，在短时间内，RDP 允许连接并且管理员密码为空。

1. EC2Launch v2 服务通过运行以下命令来调用 Windows Sysprep：

   **sysprep.exe /oobe /generalize /shutdown /unattend: "C:\\ProgramData\\Amazon\\EC2Launch\\sysprep\\unattend.xml"**

### 一般化阶段
<a name="sysprep-generalize-ec2launchv2"></a>
+ EC2Launch v2 删除特定于映像的信息和配置，如计算机名称和 SID。如果实例是域的成员，则会从域中将其删除。`unattend.xml` 应答文件包含影响这一阶段的以下设置：
  + **PersistAllDeviceInstalls**：此设置防止 Windows 安装程序删除和重新配置设备，这可加快映像准备过程，因为 Amazon AMI 需要运行特定驱动程序，而这些驱动程序的重新检测需要花费一些时间。
  + **DoNotCleanUpNonPresentDevices**：此设置为当前不存在的设备保留即插即用信息。
+ Windows Sysprep 在准备创建 AMI 时会关闭操作系统。系统会启动新实例或启动原始实例。

### 专门化阶段
<a name="sysprep-specialize-ec2launchv2"></a>

系统生成特定于操作系统的要求，如计算机名称和 SID。系统还会根据您在 `unattend.xml` 应答文件中指定的配置执行以下操作。
+ **CopyProfile**：Windows Sysprep 可以配置为删除所有用户配置文件，包括内置管理员配置文件。此设置保留内置管理员账户，这样，您对该账户进行的所有自定义设置就都可以转移到新映像。默认值为 `True`。

  **CopyProfile** 将默认配置文件替换为现有本地管理员配置文件。运行 Windows Sysprep 后登录的所有账户在首次登录时都会收到该配置文件的副本及其内容。

  如果您没有要转移到新映像的特定用户配置文件自定义设置，请将此设置更改为 `False`。Windows Sysprep 会删除所有用户配置文件；此举可以节省时间和磁盘空间。
+ **TimeZone**：默认情况下，时区设置为协调世界时 (UTC)。
+ **顺序 1 同步命令**：系统运行以下命令，以启用管理员账户并指定密码要求。

  ```
  net user Administrator /ACTIVE:YES /LOGONPASSWORDCHG:NO /EXPIRES:NEVER /PASSWORDREQ:YES
  ```
+ **顺序 2 同步命令**：系统加密管理员密码。如果未配置 `setAdminAccount` 任务，则此安全措施可防止实例在 Windows Sysprep 完成后处于可访问状态。

  系统会从本地启动代理目录 (`C:\Program Files\Amazon\EC2Launch\`) 运行以下命令。

  ```
  EC2Launch.exe internal randomize-password --username Administrator
  ```
+ 要启用远程桌面连接，系统会将终端服务器 `fDenyTSConnections` 注册表项设置为 false。

### OOBE 阶段
<a name="sysprep-oobe-ec2launchv2"></a>

1. 系统使用 EC2Launch v2 应答文件指定以下配置：
   + `<InputLocale>en-US</InputLocale>`
   + `<SystemLocale>en-US</SystemLocale>`
   + `<UILanguage>en-US</UILanguage>`
   + `<UserLocale>en-US</UserLocale>`
   + `<HideEULAPage>true</HideEULAPage>`
   + `<HideWirelessSetupInOOBE>true</HideWirelessSetupInOOBE>`
   + `<ProtectYourPC>3</ProtectYourPC>`
   + `<BluetoothTaskbarIconEnabled>false</BluetoothTaskbarIconEnabled>`
   + `<TimeZone>UTC</TimeZone>`
   + `<RegisteredOrganization>Amazon.com</RegisteredOrganization>`
   + `<RegisteredOwner>EC2</RegisteredOwner>`
**注意**  
在一般化和专门化阶段，EC2Launch v2 会监控操作系统的状态。如果 EC2Launch v2 检测到操作系统处于 Sysprep 阶段，则会将以下消息发布到系统日志：  
正在配置 Windows。SysprepState=IMAGE\_STATE\_UNDEPLOYABLE

1. 系统运行 EC2Launch v2。

## Sysprep 之后
<a name="sysprep-post-ec2launchv2"></a>

Windows Sysprep 完成后，EC2Launch v2 会将以下消息发送到控制台输出：

```
Windows sysprep configuration complete.
```

EC2Launch v2 随后执行以下操作：

1. 读取 `agent-config.yml` 文件的内容并运行配置的任务。

1. 执行 `preReady` 阶段的所有任务。

1. 完成后，将 `Windows is ready` 消息发送到实例系统日志。

1. 执行 `PostReady` 阶段的所有任务。

有关 EC2Launch v2 的更多信息，请参阅[使用 EC2Launch v2 代理在 EC2 Windows 实例启动期间执行任务](ec2launch-v2.md)。

## 使用 EC2Launch v2 运行 Windows Sysprep
<a name="sysprep-gui-procedure-ec2launchv2"></a>

按照以下过程，结合使用 Windows Sysprep 与 EC2Launch v2 来创建标准化 AMI。

1. 在 Amazon EC2 控制台中，查找要复制的 AMI。

1. 启动并连接到您的 Windows 实例。

1. 自定义设置

   1. 在 Windows **开始**菜单中，搜索并选择 **Amazon EC2Launch 设置**。有关 Amazon **EC2Launch 设置**对话框中的选项和设置的更多信息，请参阅 [配置 Windows 实例的 EC2Launch v2 设置](ec2launch-v2-settings.md)。

   1. 如果您进行了更改，请选择**保存**后再关闭。

1. 选择**使用 Sysprep 关闭**或**不使用 Sysprep 关闭**。

如果系统询问您是否要运行 Windows Sysprep 并关闭该实例，请选择**是**。EC2Launch v2 会运行 Windows Sysprep。然后，您退出实例，实例关闭。如果您在 Amazon EC2 控制台中查看**实例**页面，实例状态会从 `Running` 变为 `Stopping`，再变为 `Stopped`。此时，从该实例创建一个 AMI 是安全的。

您可以使用以下命令从命令行中手动调用 Windows Sysprep 工具：

```
"%programfiles%\amazon\ec2launch\ec2launch.exe" sysprep --shutdown=true
```
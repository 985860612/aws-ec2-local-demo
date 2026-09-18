

# 使用 Windows Sysprep 和 EC2Config 创建 AMI
<a name="sysprep-using"></a>

当您从安装了 EC2Config 服务的实例创建映像时， EC2Config 会在准备映像时执行特定的任务。这包括使用 Windows Sysprep。有关更多信息，请参阅 [Windows Sysprep 阶段](ami-create-win-sysprep.md#sysprep-phases)。

**Topics**
+ [Windows Sysprep 操作](#sysprep-actions)
+ [Sysprep 之后](#sysprep-post)
+ [使用 EC2Config 服务运行 Windows Sysprep](#sysprep-gui-procedure)

## Windows Sysprep 操作
<a name="sysprep-actions"></a>

在准备映像的过程中，Windows Sysprep 和 EC2Config 服务会执行以下操作。

1. 在 **EC2 服务属性**对话框中选择**使用 Sysprep 关闭**时，系统会运行 **ec2config.exe -sysprep** 命令。

1. EC2Config 服务读取 `BundleConfig.xml` 文件的内容。默认情况下，该文件位于以下目录中：`C:\Program Files\Amazon\Ec2ConfigService\Settings`。

    `BundleConfig.xml` 文件包含以下设置：您可以更改这些设置：
   + **AutoSysprep**：指明是否自动使用 Windows Sysprep。如果从 EC2 Service Properties 对话框运行 Windows Sysprep，则无需更改此值。默认值为 `No`。
   + **SetRDPCertificate**：为远程桌面服务器设置自签名证书。这样，您可以安全地使用远程桌面协议 (RDP) 连接到实例。如果新实例应使用证书，请将该值更改为 `Yes`。此设置不适用于 Windows Server 2012 实例，因为这些操作系统会生成自己的证书。默认值为 `No`。
   + **SetPasswordAfterSysprep**：在新启动的实例上设置随机密码，使用用户启动密钥对其加密，并将加密密码输出到控制台。如果新实例不应设置为随机加密密码，请将该值更改为 `No`。默认值为 `Yes`。
   +  **PreSysprepRunCmd**：要运行的命令的位置。默认情况下，该命令位于以下目录中：`C:\Program Files\Amazon\Ec2ConfigService\Scripts\BeforeSysprep.cmd`。

1. 系统运行 `BeforeSysprep.cmd`。该命令创建一个注册表项，如下所示：

   ```
   reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f
   ```

   该注册表项禁用 RDP 连接，直到它们重新启用。禁用 RDP 连接是必需的安全措施，因为在 Windows Sysprep 运行之后的第一个启动会话过程中，在短时间内，RDP 允许连接并且管理员密码为空。

1. EC2Config 服务通过运行以下命令来调用 Windows Sysprep：

   ```
   sysprep.exe /unattend: "C:\Program Files\Amazon\Ec2ConfigService\sysprep2008.xml" /oobe /generalize /shutdown
   ```

### 一般化阶段
<a name="sysprep-generalize"></a>
+ 该工具删除特定于映像的信息和配置 (如计算机名称和 SID)。如果实例是域的成员，则会从域中将其删除。`sysprep2008.xml` 应答文件包含影响这一阶段的以下设置：
  + **PersistAllDeviceInstalls**：此设置防止 Windows 安装程序删除和重新配置设备，这可加快映像准备过程，因为 Amazon AMI 需要运行特定驱动程序，而这些驱动程序的重新检测需要花费一些时间。
  + **DoNotCleanUpNonPresentDevices**：此设置为当前不存在的设备保留即插即用信息。
+ Windows Sysprep 在准备创建 AMI 时会关闭操作系统。系统会启动新实例或启动原始实例。

### 专门化阶段
<a name="sysprep-specialize"></a>

系统生成特定于操作系统的要求，如计算机名称和 SID。系统还根据您在 sysprep2008.xml 应答文件中指定的配置来执行以下操作。
+ **CopyProfile**：Windows Sysprep 可以配置为删除所有用户配置文件，包括内置管理员配置文件。此设置保留内置管理员账户，这样，您对该账户进行的所有自定义都可转移到新映像。默认值是 True。

  **CopyProfile** 将默认配置文件替换为现有本地管理员配置文件。运行 Windows Sysprep 后登录的所有账户在首次登录时都会收到该配置文件的副本及其内容。

  如果您没有要转移到新映像的特定用户配置文件自定义设置，请将此设置更改为 False。Windows Sysprep 会删除所有用户配置文件；此举可以节省时间和磁盘空间。
+ **TimeZone**：默认情况下，时区设置为协调世界时 (UTC)。
+ **顺序 1 同步命令**：系统运行以下命令，以启用管理员账户并指定密码要求。

  **net user Administrator /ACTIVE:YES /LOGONPASSWORDCHG:NO /EXPIRES:NEVER /PASSWORDREQ:YES**
+ **顺序 2 同步命令**：系统加密管理员密码。如果未启用 ec2setpassword 设置，则此安全措施可防止实例在 Windows Sysprep 完成后处于可访问状态。

  C:\\Program Files\\Amazon\\Ec2ConfigService\\ScramblePassword.exe" -u Administrator
+ **顺序 3 同步命令**：系统运行以下命令：

  C:\\Program Files\\Amazon\\Ec2ConfigService\\Scripts\\SysprepSpecializePhase.cmd

   该命令添加以下注册表项，用于重新启用 RDP：

  reg add "HKEY\_LOCAL\_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG\_DWORD /d 0 /f

### OOBE 阶段
<a name="sysprep-oobe"></a>

1. 通过使用 EC2Config 服务应答文件，系统指定以下配置：
   + <InputLocale>en-US</InputLocale>
   + <SystemLocale>en-US</SystemLocale>
   + <UILanguage>en-US</UILanguage>
   + <UserLocale>en-US</UserLocale>
   + <HideEULAPage>true</HideEULAPage>
   + <HideWirelessSetupInOOBE>true</HideWirelessSetupInOOBE>
   + <NetworkLocation>Other</NetworkLocation>
   + <ProtectYourPC>3</ProtectYourPC>
   + <BluetoothTaskbarIconEnabled>false</BluetoothTaskbarIconEnabled>
   + <TimeZone>UTC</TimeZone>
   + <RegisteredOrganization>Amazon.com</RegisteredOrganization>
   + <RegisteredOwner>Amazon</RegisteredOwner>
**注意**  
在一般化和专门化阶段期间，EC2Config 服务监控操作系统的状态。如果 EC2Config 检测到操作系统处于 Sysprep 阶段，则会将以下消息发布到系统日志：  
EC2ConfigMonitorState: 0 Windows is being configured. SysprepState=IMAGE\_STATE\_UNDEPLOYABLE

1. OOBE 阶段完成后，系统将 从以下位置运行 `SetupComplete.cmd`：`C:\Windows\Setup\Scripts\SetupComplete.cmd`。在 2015 年 4 月之前的 Amazon 公用 AMI 中，此文件为空，不对映像运行任何操作。在 2015 年 4 月之后的公开 AMI 中，此文件包含以下值：**call "C:\\Program Files\\Amazon\\Ec2ConfigService\\Scripts\\PostSysprep.cmd"**。

1. 系统运行 `PostSysprep.cmd`，执行以下操作：
   + 将本地管理员密码设置为不过期。如果密码已过期，管理员可能无法登录。
   + 设置 MSSQLServer 机器名称 (如果已安装)，以便该名称与 AMI 同步。

## Sysprep 之后
<a name="sysprep-post"></a>

Windows Sysprep 完成后，EC2Config 服务会将以下消息发送到控制台输出：

```
Windows sysprep configuration complete.
			Message: Sysprep Start
			Message: Sysprep End
```

EC2Config 随后执行以下操作：

1. 读取 config.xml 文件的内容并列出所有已启用的插件。

1. 同时执行所有“Windows 就绪之前”插件。
   + Ec2SetPassword
   + Ec2SetComputerName
   + Ec2InitializeDrives
   + Ec2EventLog
   + Ec2ConfigureRDP
   + Ec2OutputRDPCert
   + Ec2SetDriveLetter
   + Ec2WindowsActivate
   + Ec2DynamicBootVolumeSize

1. 完成之后，将“Windows 准备就绪”消息发送到实例系统日志。

1. 同时运行所有“Windows 就绪之后”插件。
   + Amazon CloudWatch Logs 
   + UserData
   + AWS Systems Manager (Systems Manager) 

有关 Windows 插件的更多信息，请参阅[使用 EC2Config 服务在 EC2 旧版 Windows 操作系统实例启动期间执行任务](ec2config-service.md)。

## 使用 EC2Config 服务运行 Windows Sysprep
<a name="sysprep-gui-procedure"></a>

按照以下过程，结合使用 Windows Sysprep 与 EC2Config 服务来创建标准化 AMI。

1. 在 Amazon EC2 控制台中，查找或[创建](creating-an-ami-ebs.md)要复制的 AMI。

1. 启动并连接到您的 Windows 实例。

1. 对它进行自定义。

1. 在 EC2Config 服务应答文件中指定配置设置：

   `C:\Program Files\Amazon\Ec2ConfigService\sysprep2008.xml`

1. 在 Windows **开始**菜单中，选择**所有程序**，然后选择 **EC2ConfigService Settings**。

1. 在 **Ec2 Service Properties** 对话框中选择 **Image** 选项卡。有关 Ec2 Service Properties 对话框中的选项和设置的更多信息，请参阅 [Ec2 服务属性](ec2config-service.md)。

1. 选择管理员密码选项，然后选择 **Shutdown with Sysprep** 或 **Shutdown without Sysprep**。EC2Config 会根据您选择的密码选项编辑设置文件。
   + **随机**：EC2Config 生成一个密码，使用用户的密钥加密，并向控制台显示加密的密码。我们会在首次启动后禁用此设置，以便在重启或停止再启动实例后该密码仍然存在。
   + **指定**：密码以非加密格式（明文）存储在 Windows Sysprep 应答文件中。下一次运行 Windows Sysprep 时，即会设置管理员密码。如果现在就关闭，则会立即设置密码。服务再次启动时，则会删除管理员密码。务必要记住此密码，因为以后无法将其取回。
   + **保持现有**：运行 Windows Sysprep 或重新启动 EC2Config 时，管理员账户的现有密码不变。务必要记住此密码，因为以后无法将其取回。

1. 选择 **OK**。

如果系统询问您是否要运行 Windows Sysprep 并关闭该实例，请选择**是**。您会看到 EC2Config 运行 Windows Sysprep。然后，您会退出实例并且实例会关闭。如果您在 Amazon EC2 控制台中查看 **Instances (实例)** 页面，实例状态会从 `Running` 变为 `Stopping`，然后最终变为 `Stopped`。此时，从该实例创建一个 AMI 是安全的。

您可以使用以下命令从命令行中手动调用 Windows Sysprep 工具：

```
"%programfiles%\amazon\ec2configservice\"ec2config.exe -sysprep"" 
```

**注意**  
如果您的 CMD Shell 已在 C:\\Program Files\\Amazon\\EC2ConfigService\\ 目录中，则命令中不需要双引号。

但是，请务必确保 `Ec2ConfigService\Settings` 文件夹中指定的 XML 文件选项正确无误，否则您可能无法连接到实例。有关设置文件的更多信息，请参阅 [EC2Config 设置文件](ec2config-service.md#UsingConfigXML_WinAMI)。有关配置 Windows Sysprep 并从命令行中运行它的示例，请参阅 `Ec2ConfigService\Scripts\InstallUpdates.ps1`。
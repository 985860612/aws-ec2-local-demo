

# 使用 EC2Config 服务在 EC2 旧版 Windows 操作系统实例启动期间执行任务
<a name="ec2config-service"></a>

**注意**  
对 EC2Config 的支持已终止。Microsoft 不再支持其运行的操作系统版本。强烈建议升级到最新的启动代理。  
Windows Server 2022 及更高版本操作系统的最新启动代理是 [EC2Launch v2](ec2launch-v2.md)，它取代了 EC2Config 和 EC2Launch，并预装在 AWS Windows Server 2022 和 2025 AMI 上。您也可以在 Windows Server 2016 和 2019 上手动安装和配置代理。有关更多信息，请参阅 [安装 EC2Launch v2](ec2launch-v2-install.md)。

适用于 Windows Server 2016 之前的 Windows Server 版本的 Windows AMI 包括一项可选服务，即 EC2Config 服务 (`EC2Config.exe`)。EC2Config 在实例启动时启动，并且在启动期间以及您每次停止或启动实例时执行相关任务。EC2Config 还可按需执行任务。部分任务可自动启用，而其他任务必须手动启用。尽管此服务是可选的，但可让您访问否则无法访问的高级功能。此服务可使用 LocalSystem 账户运行。

EC2Config 服务会运行 Sysprep，借助该 Microsoft 工具您可以创建可重复使用的自定义 Windows AMI。在 EC2Config 调用 Sysprep 时，会使用 `%ProgramFiles%\Amazon\EC2ConfigService\Settings` 中的设置文件来确定要执行的操作。您可以使用 **EC2 服务属性**系统对话框间接编辑这些文件，也可以使用 XML 编辑器或文本编辑器直接进行编辑。然而，有些高级设置并未包含在 **Ec2 服务属性**系统对话框中，因此您必须直接编辑这些条目。

如果您在更新某实例的设置之后从中创建了一个 AMI，则新设置会应用到所有从新 AMI 启动的实例。有关创建 AMI 的信息，请参阅[创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。

EC2Config 会使用设置文件来控制它的操作。您可以通过图形工具或直接编辑 XML 文件来更新这些设置文件。服务二进制文件和其他文件均包含在 `%ProgramFiles%\Amazon\EC2ConfigService` 目录中。

**Topics**
+ [EC2Config 和 AWS Systems Manager](#ec2config-ssm)
+ [EC2Config 任务](#UsingConfig_Ovw)
+ [EC2Config 设置文件](#UsingConfigXML_WinAMI)
+ [安装最新版的 EC2Config](UsingConfig_Install.md)
+ [配置 EC2Config 服务的 .NET 代理设置](ec2config-proxy.md)
+ [在 EC2 Windows 实例上通过系统对话框设置 EC2Config 服务属性](set-ec2config-service-properties.md)
+ [排查 EC2Config 启动代理的问题](repair-ec2config.md)
+ [EC2Config 版本历史记录](ec2config-version-details.md)

## EC2Config 和 AWS Systems Manager
<a name="ec2config-ssm"></a>

对于在 2016 年 11 月之前发布的早于 Windows Server 2016 的 Windows Server 版本，EC2Config 服务可以处理从包含这些版本的 AMI 所创建实例上的 Systems Manager 请求。

对于在 2016 年 11 月之后发布的早于 Windows Server 2016 的 Windows Server 版本，从包含这些版本的 AMI 创建的实例包含 EC2Config 服务*和* SSM Agent。EC2Config 执行前面所述的所有任务，而 SSM Agent 处理 Run Command 和 State Manager 这样的 Systems Manager 功能的请求。

您可以使用 Run Command 更新现有实例，以便使用最新版本的 EC2Config 服务和 SSM Agent。有关更多信息，请参阅《AWS Systems Manager 用户指南》**中的[使用 Run Command 更新 SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command-tutorial-update-software.html)。

## EC2Config 任务
<a name="UsingConfig_Ovw"></a>

当系统首次启动实例后又将其禁用时，EC2Config 会运行初始启动任务。要再次运行这些任务，您必须在关闭实例之前明确启用它们，或者手动运行 Sysprep。这些任务如下所示：
+ 设置管理员账户的随机加密密码。
+ 生成和安装远程桌面连接使用的主机证书。
+ 请动态扩展操作系统分区，以包含所有未分区的空间。
+ 执行指定的用户数据 (和 Cloud-Init，如果已安装)。有关指定用户数据的更多信息，请参阅[在启动包含用户数据输入的 EC2 实例时运行命令](user-data.md)。

每次实例启动时，EC2Config 会执行以下任务：
+ 将主机名更改为与十六进制表示法的私有 IP 地址匹配（此任务默认处于禁用状态，必须启用后才能在实例启动时运行）。
+ 配置密钥管理服务器 (AWS KMS)，检查 Windows 激活状态并根据需要激活 Windows。
+ 挂载所有 Amazon EBS 卷和实例存储卷，并且将卷名称映射到驱动器盘符。
+ 将事件日志条目写入控制台以帮助排查问题（此任务默认处于禁用状态，必须启用后才能在实例启动时运行）。
+ 将 Windows 已准备就绪写入控制台。
+ 在附加单个或多个 NIC 的情况下，向主网络适配器添加自定义路由以启用以下 IP 地址：`169.254.169.250`、`169.254.169.251` 和 `169.254.169.254`。当您访问实例元数据时，Windows 激活会使用这些地址。
**注意**  
如果 Windows 操作系统配置为使用 IPv4，则可以使用这些 IPv4 链路本地地址。如果 Windows 操作系统禁用了 IPv4 网络协议堆栈并改为使用 IPv6，则请添加 `[fd00:ec2::250]` 来代替 `169.254.169.250` 和 `169.254.169.251`。然后添加 `[fd00:ec2::254]` 来代替 `169.254.169.254`。

每次用户登录时，EC2Config 都会执行以下任务：
+ 在桌面背景中显示墙纸信息。

实例运行时，您可以请求 EC2Config 按需执行以下任务：
+ 运行 Sysprep 并关闭实例，以便您可以从实例中创建一个 AMI。有关更多信息，请参阅 [使用 Windows Sysprep 创建 Amazon EC2 AMI](ami-create-win-sysprep.md)。

## EC2Config 设置文件
<a name="UsingConfigXML_WinAMI"></a>

设置文件会控制 EC2Config 服务的操作。这些文件位于 `C:\Program Files\Amazon\Ec2ConfigService\Settings` 目录下：
+ `ActivationSettings.xml`：使用密钥管理服务器 () 控制产品激活。AWS KMS
+ `AWS.EC2.Windows.CloudWatch.json` — 控制要发送到 CloudWatch 的性能计数器以及要发送到 CloudWatch Logs 的日志。
+ `BundleConfig.xml` — 控制 EC2Config 为 AMI 创建准备实例存储支持的实例的方式。
+ `Config.xml` — 控制基本设置。
+ `DriveLetterConfig.xml` — 控制盘符映射。
+ `EventLogConfig.xml` — 控制实例启动时控制台上显示的事件日志信息。
+ `WallpaperSettings.xml` — 控制桌面背景上显示的信息。



**ActivationSettings.xml**

此文件包含用于控制产品激活的设置。当 Windows 启动时，EC2Config 服务会检查是否已激活 Windows。如果尚未激活 Windows，它会通过搜索指定的 AWS KMS 服务器激活 Windows。
+ `SetAutodiscover` – 指示是否自动检测 AWS KMS。
+ `TargetKMSServer`：存储 的私有 IP 地址。AWS KMSAWS KMS 必须位于您的实例所在的同一区域。
+ `DiscoverFromZone` – 发现指定 DNS 区域中的 AWS KMS 服务器。
+ `ReadFromUserData` – 获取 UserData 中的 AWS KMS 服务器。
+ `LegacySearchZones` – 发现指定 DNS 区域中的 AWS KMS 服务器。
+ `DoActivate` — 尝试使用本部分中的指定设置进行激活。该值可以是 `true` 或 `false`。
+ `LogResultToConsole` — 在控制台中显示结果。

**BundleConfig.xml**

此文件包含用于控制 EC2Config 为 AMI 创建过程准备实例的方式的设置。
+ `AutoSysprep`—指明是否自动使用 Sysprep。将值更改为 `Yes` 可使用 Sysprep。
+ `SetRDPCertificate` — 为远程桌面服务器设置自签名证书。这样一来，您可以将 RDP 安全应用到实例中。如果新实例应该具有该证书，请将该值改为 `Yes`。

  此设置不用于操作系统版本早于 Windows Server 2016 的实例，因为它们可以生成自己的证书。
+ `SetPasswordAfterSysprep`—在新启动的实例上设置随机密码，使用用户启动密钥对其加密并且将该加密密码输出到控制台中。如果新实例不应设置为随机加密密码，请将该设置的值改为 `No`。

**Config.xml**

 *插件* 
+ `Ec2SetPassword` — 在您每次启动实例时生成随机加密密码。默认情况下，首次启动之后该功能会被禁用，因此重新启动该实例并不会更改用户设置的密码。每次您启动实例时，请将该设置改为 `Enabled`，以继续生成密码。

  如果您计划从自己的实例创建一个 AMI，则该设置非常重要。
+ `Ec2SetComputerName` — 根据实例的 IP 地址将实例的主机名设置为唯一名称，并且重新启动实例。若要设置您自己的主机名或防止修改您的现有主机名，必须禁用此设置。
+ `Ec2InitializeDrives` — 在启动期间初始化和格式化所有卷。该功能已默认启用。
+ `Ec2EventLog` — 在控制台中显示事件日志条目。默认情况下，会显示来自系统事件日志的最近三个错误条目。要指定将显示的事件日志条目，请编辑 `EventLogConfig.xml` 目录中的 `EC2ConfigService\Settings` 文件。有关此文件中设置的信息，请参阅[事件日志键](https://learn.microsoft.com/en-us/windows/win32/eventlog/eventlog-key)。
+ `Ec2ConfigureRDP` — 在实例上设置自签名证书，以便用户可以使用远程桌面安全访问实例。此设置不用于操作系统版本早于 Windows Server 2016 的实例，因为它们可以生成自己的证书。
+ `Ec2OutputRDPCert` — 在控制台中显示远程桌面证书信息，以便用户可以根据指纹对其进行验证。
+ `Ec2SetDriveLetter` — 根据用户定义的设置，设置已挂载卷的盘符。默认情况下，Amazon EBS 卷附加到实例之后，系统会根据实例上的盘符进行挂载。要指定您的盘符映射，请编辑 `DriveLetterConfig.xml` 目录中的 `EC2ConfigService\Settings` 文件。
+ `Ec2WindowsActivate` — 该插件处理 Windows 激活。它检查 Windows 是否已激活。如果未激活，则它会更新 AWS KMS 客户端设置，然后激活 Windows。

  要修改 AWS KMS 设置，请编辑 `ActivationSettings.xml` 目录中的 `EC2ConfigService\Settings` 文件。
+ `Ec2DynamicBootVolumeSize` — 扩展磁盘 0/卷 0 以包含所有未分区的空间。
+ `Ec2HandleUserData`—创建脚本并在运行 Sysprep 后首次启动实例时运行用户创建的脚本。脚本标签包含的命令会保存到批处理文件中，而 PowerShell 标签包含的命令会保存到 .ps1 文件中（对应于“Ec2 服务属性”系统对话框中的“用户数据”复选框）。
+ `Ec2ElasticGpuSetup` — 如果实例与 Elastic GPU 关联，请安装 Elastic GPU 软件包。
+ `Ec2FeatureLogging` — 将 Windows 功能安装和相应服务状态发送到控制台。仅对 Microsoft Hyper-V 功能和相应 vmms 服务提供支持。

 *全局设置* 
+ `ManageShutdown` — 确保从 Amazon S3 支持的 AMI 启动的实例不会在运行 Sysprep 时终止。
+ `SetDnsSuffixList` — 为 Amazon EC2 设置网络适配器的 DNS 后缀。这允许 Amazon EC2 中运行的服务器的 DNS 解析，无需提供完全限定域名。
**注意**  
这会为以下域添加 DNS 后缀查找，并配置其他标准后缀。有关启动代理如何设置 DNS 后缀的更多信息，请参阅 [为 EC2 Windows 启动代理配置 DNS 后缀](launch-agents-set-dns.md)。  

  ```
  {{region}}.ec2-utilities.amazonaws.com
  ```
+ `WaitForMetaDataAvailable` — 确保 EC2Config 服务会在继续启动之前等待元数据处于可访问状态并且网络可用。此检查确保了 EC2Config 可以从激活和其他插件的元数据获取信息。
+ `ShouldAddRoutes` — 在附加多个 NIC 的情况下，向主网络适配器添加自定义路由以启用以下 IP 地址：169.254.169.250、169.254.169.251 和 169.254.169.254。当您访问实例元数据时，Windows 激活会使用这些地址。
+ `RemoveCredentialsfromSyspreponStartup` — 在下一次启动服务时从 `Sysprep.xml` 中删除管理员密码。要确保该密码持久保留，请编辑该设置。

**DriveLetterConfig.xml**

此文件包含用于控制盘符映射的设置。默认情况下，一个卷可映射到任何可用的盘符。您可按以下方式将卷挂载为特定的盘符。

```
<?xml version="1.0" standalone="yes"?>
<DriveLetterMapping>
  <Mapping>
    <VolumeName></VolumeName>
    <DriveLetter></DriveLetter>
  </Mapping>
  . . .
  <Mapping>
    <VolumeName></VolumeName>
    <DriveLetter></DriveLetter>
  </Mapping>
</DriveLetterMapping>
```
+ `VolumeName` — 卷标签。例如：`{{My Volume}}`。要为实例存储卷指定映射，请使用标签 `Temporary Storage X`，其中 `X` 为 0 到 25 之间的数字。
+ `DriveLetter` — 盘符。例如：`{{M:}}`。如果盘符已在使用，则映射会失败。

**EventLogConfig.xml**

此文件包含用于控制实例启动时显示在控制台上的事件日志信息的设置。默认情况下，我们会显示来自系统事件日志的最近三个错误条目。
+ `Category` — 监视器的事件日志密钥。
+ `ErrorType` — 事件类型（例如 、`Error`、`Warning`）`Information`。
+ `NumEntries` — 此类别中所存储事件的数目。
+ `LastMessageTime` — 为防止重复推送相同的消息，服务会在每次推送消息时更新此值。
+ `AppName` — 事件源或记录事件的应用程序。

**WallpaperSettings.xml**

此文件包含用于控制在桌面背景上显示的信息的设置。默认情况下显示以下信息。
+ `Hostname` — 显示计算机名称。
+ `Instance ID` — 显示实例的 ID。
+ `Public IP Address` — 显示实例的公有 IP 地址。
+ `Private IP Address` — 显示实例的私有 IP 地址。
+ `Availability Zone` — 显示实例在其中运行的可用区。
+ `Instance Size` — 显示实例的类型。
+ `Architecture` — 显示 `PROCESSOR_ARCHITECTURE` 环境变量的设置。

您可以通过删除条目删除默认显示的任何信息。您可以按如下所示添加其他要显示的实例元数据。

```
<WallpaperInformation>
  <name>{{display_name}}</name>
  <source>metadata</source>
  <identifier>meta-data/{{path}}</identifier>
</WallpaperInformation>
```

您可以按如下所示添加其他要显示的系统环境变量。

```
<WallpaperInformation>
  <name>{{display_name}}</name>
  <source>EnvironmentVariable</source>
  <identifier>{{variable-name}}</identifier>
</WallpaperInformation>
```

**InitializeDrivesSettings.xml**  
此文件包含控制 EC2Config 如何初始化驱动器的设置。

默认情况下，EC2Config 用操作系统初始化未联机的驱动器。您可以自定义插件，如下所示。

```
<InitializeDrivesSettings>
    <SettingsGroup>{{setting}}</SettingsGroup>
</InitializeDrivesSettings>
```

使用设置组指定要如何初始化驱动器：

*FormatWithTRIM*  
在驱动器格式化时启用 TRIM 命令。在驱动器格式化和初始化后，系统还原 TRIM 配置。  
从 EC2Config 版本 3.18 开始，在磁盘格式化操作过程中默认禁用 TRIM 命令。这将缩短格式化时间。对于 EC2Config 版本 3.18 及更高版本，在磁盘格式化操作期间使用此设置启用 TRIM。

*FormatWithoutTRIM*  
在格式化驱动器时禁用 TRIM 命令并在 Windows 中改进格式化时间。在驱动器格式化和初始化后，系统还原 TRIM 配置。

*DisableInitializeDrives*  
对新驱动器禁用格式化。使用此设置可手动初始化驱动器。


# 在 EC2 Windows 实例上通过系统对话框设置 EC2Config 服务属性
<a name="set-ec2config-service-properties"></a>

以下过程介绍如何使用 **EC2 服务属性**系统对话框来启用或禁用设置。

1. 启动并连接到您的 Windows 实例。

1. 在**开始**菜单中，选择**所有程序**，然后选择 **EC2ConfigService 设置**。  
![EC2Config 服务属性在“常规”选项卡中显示。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/EC2ConfigProperties_General.png)

1. 在 **EC2 服务属性**系统对话框的**常规**选项卡上，您可以启用或禁用以下设置。  
 **Set Computer Name（设置电脑名称**   
如果此设置已启用 (默认情况下已启用)，则会在每次启动时将主机名与当前内部 IP 地址进行比较；如果主机名和内部 IP 地址不匹配，则重置主机名以包含内部 IP 地址，随后系统重启以接受新主机名。若要设置您自己的主机名或防止修改现有主机名，请不要启用该设置。  
 **用户数据**   
利用用户数据执行，您可以在实例元数据中指定脚本。默认情况下，这些脚本在初次启动期间运行。您还可以配置它们在下次重新引导或启动实例时运行，或者在每次重新引导或启动实例时运行。  
如果您有很大的脚本，我们建议您使用用户数据来下载该脚本，然后再运行它。  
有关更多信息，请参阅[用户数据执行](user-data.md#user-data-execution)。  
 **Event Log (事件日志**   
使用此设置可在启动期间在控制台上显示事件日志条目，以便轻松监控和调试。  
选择**设置**，为发送到控制台的日志条目指定筛选条件。默认筛选条件会将来自系统事件日志的最近三个错误条目发送到控制台。  
 **Wallpaper Information (壁纸信息**   
使用此设置可在桌面背景中显示系统信息。以下是桌面背景上所显示信息的示例。  

![墙纸信息显示在桌面背景上。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/EC2ConfigProperties_Wallpaper.png)

桌面背景上显示的信息受设置文件 `EC2ConfigService\Settings\WallpaperSettings.xml` 控制。  
 **Enable Hibernation (启用休眠**   
使用此设置可允许 EC2 向操作系统发出信号来执行休眠。

1. 选择**存储**选项卡。您可以启用或禁用以下设置。  
![EC2 Service Properties（EC2 服务属性）中的 Storage（存储）选项卡。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/EC2ConfigProperties_Storage.png)  
 **Root Volume**   
此设置可将磁盘 0/卷 0 动态扩展以包含所有未分区的空间。从具有自定义大小的根卷启动实例时，此设置非常有用。  
 **Initialize Drives**   
此设置可格式化并附加在启动期间附加到实例的所有卷。  
 **Drive Letter Mapping (盘符映射**   
系统会将附加到实例的卷映射到盘符。对于 Amazon EBS 卷，默认以从 D: 到 Z: 的顺序分配驱动器盘符。对于实例存储卷，默认设置则取决于驱动程序。AWSPV 驱动程序和 Citrix PV 驱动程序以从 Z: 到 A: 的顺序分配实例存储卷驱动器盘符。Red Hat 驱动程序按 D: 到 Z: 的顺序分配实例存储卷盘符。  
要为卷选择驱动器盘符，请选择**映射**。在 **DriveLetterSetting** 对话框中，为每个卷指定**卷名称**和**驱动器盘符**值，选择**应用**，然后选择**确定**。我们建议您选择诸如字母表中间的字母作为盘符，以避免与可能在使用的盘符发生冲突。  

![DriveLetterSetting 对话框。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/EC2ConfigProperties_driver_letter_mapping.png)

在指定盘符映射并附加与您指定的某个卷名称具有相同标签的卷之后，EC2Config 会自动为该卷分配您指定的盘符。然而，如果盘符已在使用，则盘符映射会失败。请注意，在您指定盘符映射之后，EC2Config 不会更改已挂载卷的盘符。

1. 要保存设置并在稍后继续处理，请选择**确定**以关闭 **EC2 服务属性**系统对话框。如果您已完成实例自定义并要从该实例创建 AMI，请参阅 [使用 Windows Sysprep 创建 Amazon EC2 AMI](ami-create-win-sysprep.md)。
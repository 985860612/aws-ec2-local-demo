

# 使用现有实例的详细信息来启动 EC2 实例
<a name="launch-more-like-this"></a>

Amazon EC2 控制台提供了 **Launch more like this**（启动更多类似实例）选项，允许将当前实例作为基础来启动其他实例。该选项自动使用所选实例中的特定配置详细信息来填充 Amazon EC2 启动实例向导。

**注意事项**
+ 我们不会克隆您的实例；我们只复制一些配置详细信息。要创建实例的副本，请先从它创建 AMI，然后从 AMI 启动更多实例。创建[启动模板](ec2-launch-templates.md)，以确保使用相同的启动详细信息启动实例。
+ 当前实例必须处于 `running` 状态。

**已复制详细信息**

以下配置详细信息会从所选实例复制到启动实例向导中：
+ AMI ID
+ 实例类型
+ 可用区，或所选实例所在的 VPC 和子网
+ 公有 IPv4 地址。如果所选实例当前具有公有 IPv4 地址，则无论所选实例的默认公有 IPv4 地址设置如何，新实例都会收到公有 IPv4 地址。有关公有 IPv4 地址的更多信息，请参阅[公有 IPv4 地址](using-instance-addressing.md#concepts-public-addresses)。
+ 置放群组，如果适用
+ 与实例关联的 IAM 角色 (如果适用)
+ 关闭操作设置 (停止或中止)
+ 终止保护设置 (true 或 false)
+ CloudWatch 监控 (启用或禁用)
+ Amazon EBS 优化的设置 (true 或 false)
+ 租期设置 (如果在 VPC (共享或专用) 中启动)
+ 内核 ID 和 RAM 磁盘 ID (如果适用)
+ 用户数据，如果指定
+ 与实例关联的标签 (如果适用) 
+ 与实例关联的安全组
+ [Windows 实例] 关联信息。如果所选实例已与某个配置文件关联，那么该文件会自动与新实例关联。如果该配置文件包含加入的域配置，则新实例将加入到同一个域中。有关加入域的更多信息，请参阅《AWS Directory Service Administration Guide》**中的 [Seamlessly join a Windows EC2 instance to your AWS Managed Microsoft AD Active Directory](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/launching_instance.html)。

**未复制详细信息**

向导不会从所选实例中复制以下配置详细信息，而会应用其默认设置或行为：
+ 网络接口数量：默认为一个网络接口，即主网络接口（eth0）。
+ 存储：默认存储配置由 AMI 和实例类型确定。

**启动更多实例（如现有实例）**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后依次选择**操作**、**映像和模板**、**启动更多类似实例**。

1. 此时会打开启动实例向导。通过在此屏幕上选择不同的选项，您可以对实例配置进行必要的更改。

   当您准备好启动实例时，请选择 **Launch instance**（启动实例）。

1. 如果实例无法启动或状态立即转至 `terminated` 而非 `running`，请参阅 [排查 Amazon EC2 实例启动问题](troubleshooting-launch.md)。
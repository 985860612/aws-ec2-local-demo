

# 使用 EC2Rescue 对受损的 Amazon EC2 Windows 实例进行问题排查
<a name="Windows-Server-EC2Rescue"></a>

EC2Rescue for Windows Server 是一个易于使用的工具，可以在 Amazon EC2 Windows Server 实例上运行，以诊断和排查可能存在的问题。它不仅可以收集日志文件以及进行故障排除，还会主动搜索可能存在问题的区域，具有很高的价值。它甚至可以检查其他实例中的 Amazon EBS 根卷，并收集相关日志以对使用该卷的 Windows Server 实例进行故障排除。以下是 EC2Rescue 可以解决的一些常见问题：
+ 防火墙、远程桌面协议（RDP）或网络接口配置导致的实例连接问题
+ 停止错误、启动循环或注册表损坏导致的操作系统启动问题
+ 可能需要进行高级日志分析和问题排查的问题

EC2Rescue for Windows Server 有两个不同模块：
+ 一个是**数据收集器模块**，用于收集所有不同来源的数据
+ 一个是**分析器模块**，用于解析根据一系列预定义规则收集的数据，从而识别问题并提供建议

EC2Rescue for Windows Server 工具只能在运行 Windows Server 2012 及更高版本的 Amazon EC2 实例上运行。该工具启动后，将检查它是否正在 Amazon EC2 实例上运行。

**注意**  
`AWSSupport-ExecuteEC2Rescue` AWS Systems Manager 自动化运行手册使用 EC2Rescue 工具进行问题排查，并尽可能修复指定 EC2 实例的常见连接问题。有关详细信息以及要运行此自动化，请参阅 [>AWSSupport-ExecuteEC2Rescue](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awssupport-executeec2rescue.html)。

如果您使用的是 Linux 实例，则请参阅 [使用 EC2Rescue 对受损的 Amazon EC2 Linux 实例进行问题排查](Linux-Server-EC2Rescue.md)。

**Topics**
+ [使用 EC2Rescue GUI 进行问题排查](ec2rw-gui.md)
+ [使用 EC2Rescue CLI 进行问题排查](ec2rw-cli.md)
+ [使用 EC2Rescue 和 Systems Manager 进行问题排查](ec2rw-ssm.md)
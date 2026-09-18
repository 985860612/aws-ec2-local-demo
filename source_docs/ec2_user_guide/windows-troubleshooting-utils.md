

# EC2 Windows 故障排除实用程序
<a name="windows-troubleshooting-utils"></a>

`EC2WinUtil` 驱动程序为 Windows 实例提供以下类型的故障排除支持。

**崩溃调用堆栈**  
`EC2WinUtil` 从实例收集基本崩溃信息并将其写入串行控制台。以下列表包括实用程序写入控制台的一些关键详细信息。  
+ 识别产生故障的模块。
+ 与事件关联的 Windows 错误代码。
+ 最近调用的堆栈跟踪。
有了这些详细信息，可以执行初步根本原因分析并确定是否需要进一步分析。输出到串行控制台还使 AWS 能够跟踪 Amazon EC2 驱动程序的崩溃趋势，并诊断大规模崩溃事件。  
`EC2WinUtil` 不会在其崩溃调用堆栈中收集任何客户数据。

有关驱动程序发行说明，请参阅 [EC2 Windows 实用程序驱动程序版本历史记录](ec2winutil-driver-version-history.md)
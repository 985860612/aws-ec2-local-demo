

# 对 EC2 Windows 实例上的操作系统升级进行问题排查
<a name="os-upgrade-trbl"></a>

AWS 利用升级帮助程序服务 (一种可帮助您执行涉及 Citrix PV 驱动程序的就地升级的 AWS 实用程序) 提供对升级问题的支持。

升级后，实例可能临时 遇到高于平均 CPU 使用率的情况，而 .NET 运行时优化服务将优化 .NET 框架。这是预期行为。

如果实例在数小时后未通过所有状态检查，请执行以下检查。
+ 如果已升级到 Windows Server 2008，但在数小时后所有状态检查均失败，则升级可能已失败，这时会显示 **Click OK** 提示以确认回滚。因为在这种状态下无法访问控制台，所以无法单击该按钮。要解决此问题，请通过 Amazon EC2 控制台或 API 执行重启。重启需要 10 分钟或更长时间才能开始。实例可能在 25 分钟后变为可用。
+ 从服务器删除应用程序或服务器角色，然后重试。

如果从服务器删除应用程序或服务器角色后实例未通过所有状态检查，请执行以下操作。
+ 停止实例，将根卷附加到其他实例。有关更多信息，请参阅["等待元数据服务"](common-messages.md#metadata-unavailable)中有关如何停止根卷并将其附加到其他实例的描述。
+ 分析 [Windows 安装程序日志文件和事件日志](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-setup-log-files-and-event-logs?view=windows-11)中有无失败。

如对操作系统升级或迁移有其他问题或疑问，我们建议您查看[就地升级开始前的准备工作](os-inplaceupgrade.md#os-upgrade-before)中所列的文章。
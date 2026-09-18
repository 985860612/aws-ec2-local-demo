

# EC2 Windows 实用程序驱动程序版本历史记录
<a name="ec2winutil-driver-version-history"></a>

下表显示了哪些 `EC2WinUtil` 驱动程序在 Amazon EC2 上的每个 Windows Server 版本上运行。早期版本的操作系统使用在启动实例的 AWS Windows Server AMI 上预安装的驱动程序。与您共享的 AMI 或您通过 AWS Marketplace 订阅的 AMI 未预安装该驱动程序。


| Windows Server 版本 | EC2WinUtil 驱动程序版本 | 
| --- | --- | 
| Windows Server 2025 | 最新版本 | 
| Windows Server 2022 | 最新版本 | 
| Windows Server 2019 | 最新版本 | 
| Windows Server 2016 | 最新版本 | 

**注意**  
在驱动程序版本 3.0.0 之前，无法下载 `EC2WinUtil` 驱动程序进行手动安装。早期版本仅作为 AWS Windows AMI 的预安装驱动程序提供。

下表介绍了 `EC2WinUtil` 驱动程序的发布版本。


| 程序包版本 | 驱动程序版本 | 详细信息 | 发行日期 | 
| --- | --- | --- | --- | 
| [3.2.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/EC2WinUtil/3.2.0/EC2WinUtil.zip) | 3.2.0 | 用于 EC2Launch v2 代理的增强控制台日志记录机制。 | 2026 年 6 月 2 日 | 
| [3.1.1](https://s3.amazonaws.com/ec2-windows-drivers-downloads/EC2WinUtil/3.1.1/EC2WinUtil.zip) | 3.1.1 | 增加了登录到控制台输出时的调用堆栈长度。 | 2026 年 3 月 3 日 | 
| [3.1.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/EC2WinUtil/3.1.0/EC2WinUtil.zip) | 3.1.0 | 改进了电源管理事件处理。 | 2026 年 2 月 4 日 | 
| 3.0.0 | 3.0.0 | 对适用于 Windows 10 的驱动程序进行了现代化改造，并添加了对作为原始驱动程序安装的支持。 | 2024 年 6 月 13 日 | 
| 2.0.0 | 2.0.0 | 增加了对裸机实例类型的 MMIO 串行端口输出的支持。还改进了崩溃解析并更新了输出格式。 | 2018 年 8 月 23 日 | 
| 1.0.1 | 1.0.1 | 由于命名空间与 Amazon Inspector 冲突，将驱动程序名称更改为 `EC2WinUtil`。包括几个错误修复。 | 2018 年 3 月 1 日 | 
| 1.0.0 | 1.0.0 | 初始版本。驱动程序最初名为 `AwsAgent`。 | 2017 年 11 月 28 日 | 
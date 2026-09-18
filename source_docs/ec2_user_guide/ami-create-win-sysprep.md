

# 使用 Windows Sysprep 创建 Amazon EC2 AMI
<a name="ami-create-win-sysprep"></a>

Microsoft 系统准备（简称 Windows Sysprep）工具会创建操作系统的通用版本，可在捕获新映像之前删除实例特定的系统配置。

我们建议您使用 [EC2 Image Builder](https://docs.aws.amazon.com/imagebuilder/latest/userguide/what-is-image-builder.html) 自动创建、管理和部署自定义、安全且最新的“黄金”服务器映像，这些映像是预先安装的，并预配置了软件和设置。

您还可以使用 Windows Sysprep 通过以下 Windows 启动代理创建标准化 AMI：EC2Launch v2、EC2Launch 和 EC2Config。

**重要**  
不要使用 Windows Sysprep 创建实例备份。Windows Sysprep 会删除系统特定的信息；删除这些信息可能会对实例备份造成意外结果。

要排查 Windows Sysprep 问题，请参阅[排查 Amazon EC2 Windows 实例的 Sysprep 问题](sysprep-troubleshoot.md)。

**Topics**
+ [Windows Sysprep 阶段](#sysprep-phases)
+ [开始前的准备工作](#sysprep-begin)
+ [将 Windows Sysprep 与 EC2Launch v2 结合使用](sysprep-using-ec2launchv2.md)
+ [将 Windows Sysprep 与 EC2Launch 结合使用](ec2launch-sysprep.md)
+ [将 Windows Sysprep 与 EC2Config 结合使用](sysprep-using.md)

## Windows Sysprep 阶段
<a name="sysprep-phases"></a>

Windows Sysprep 会经历以下阶段：
+ **一般化**：Sysprep 工具删除映像特定的信息和配置。例如，Windows Sysprep 会删除安全标识符（SID）、计算机名称、事件日志和特定驱动程序，等等。完成这一阶段后，操作系统 (OS) 即准备就绪，可以创建 AMI。
**注意**  
使用 Windows 启动代理运行 Windows Sysprep 时，系统会阻止删除驱动程序，因为 `PersistAllDeviceInstalls` 在默认情况下设置为 true。
+ **专门化**：即插即用功能会扫描计算机并为检测到的所有设备安装驱动程序。Sysprep 工具会生成操作系统要求，如计算机名称和 SID。您可以选择在这一阶段运行命令。
+ **全新体验 (OOBE)**：系统运行 Windows 安装程序的一个简化版本并要求您输入系统语言、时区和注册组织等信息。使用 Windows 启动运行 Windows Sysprep 时，应答文件会自动执行这一阶段。

## 开始前的准备工作
<a name="sysprep-begin"></a>
+ 执行 Windows Sysprep 前，建议删除所有本地用户账户及所有账户配置文件，而不是将在其下方运行 Windows Sysprep 的单个管理员账户。如果使用其他账户和配置文件执行 Windows Sysprep，可能会产生意外行为，包括配置文件数据丢失或完成 Sysprep 失败。
+ 了解有关 [Sysprep 概览](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview)的更多信息。
+ 了解 [Sysprep Support for Server Roles](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep-support-for-server-roles)。


# 跟踪 ENA Windows 驱动程序发行版
<a name="ena-driver-releases-windows"></a>

Windows AMI 包含 ENA 驱动程序，用于启用增强联网功能。

对于 Windows Server 2016 及以上版本，我们建议您使用最新的驱动程序版本。对于早期版本的 Windows Server，请参阅下表来确定要使用哪个 ENA 驱动程序版本。


| Windows Server 版本 | ENA 驱动程序版本 | 
| --- | --- | 
| Windows Server 2012 R2 | 2.6.0 及更早版本 | 
| Windows Server 2012 | 2.6.0 及更早版本 | 
| Windows Server 2008 R2 | 2.2.3 及更早版本 | 

## ENA Windows 驱动程序版本历史记录
<a name="ena-win-driver-release-history"></a>

下表总结了每个版本的变更。


| 驱动程序版本 | 详细信息 | 发行日期 | 
| --- | --- | --- | 
| [2.11.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/x64/2.11.0/AwsEnaNetworkDriver.zip) |  +  增加了对动态队列分配的支持，最多可扩展至 64 个 I/O 队列，具体视实例类型的限制而定。  +  修复了从设备检索 DMA 物理地址宽度时未处理错误情况的问题。   | 2025 年 8 月 1 日 | 
| [2.10.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/x64/2.10.0/AwsEnaNetworkDriver.zip) |  +  修复了队列初始化期间内存分配失败处理不当的问题，从而防止意外重启。 <br />+  修复了可能导致忽略设备功能的网络卸载配置错误。   | 2025 年 6 月 24 日 | 
| [2.9.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/x64/2.9.0/AwsEnaNetworkDriver.zip) |  +  增加了对由设备发起的异步重置请求的支持。 <br />+  增加了对处理由设备提供的大型 LLQ 最大深度值的支持。 <br />+  在 Windows 事件查看器中添加了事件 ID `58001`，以更好地了解因设备配置错误导致的意外电源状态转换。  +  修复了设备初始化期间内存分配失败处理不当的问题，从而防止意外重启。 <br />+  修复了中断服务例程中可能会在设备停止期间将 DPC 排入队列的问题，从而防止意外重启。   | 2024 年 12 月 12 日 | 
| [2.8.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/x64/2.8.0/AwsEnaNetworkDriver.zip) |  +  修复了完整出口网络缓冲区列表（NBL）处理流程中的争用条件，该条件可能尝试释放已经释放的 NBL，从而导致内存损坏。 <br />+  修复了禁用所有 LSO 时错误检测 L3 协议的问题，以及可能会导致意外行为的校验和卸载问题。   | 2024 年 9 月 30 日 | 
| [2.7.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/x64/2.7.0/AwsEnaNetworkDriver.zip) |  +  已删除对 Windows Server 2012（Windows 8）和 Windows Server 2012 R2（Windows 8.1）的支持。这些操作系统版本已终止对 AWS 的支持。在 Windows Server 2012 及更早版本上安装驱动程序将失败。 <br />+  添加了对将 IPv6 Tx 校验和计算分载到设备的支持。 <br />+  添加了广泛的低延迟队列（LLQ）支持。这将根据设备推荐动态启用。您可以使用新的“WidelLQ”注册表项覆盖此设置。 <br />+  添加了因 Rx 溢出导致的数据包丢失报告，这表明 Rx 环中没有足够的空间容纳传入的数据包。 <br />+  增加了对来自设备的次优配置通知的支持。在 Windows 事件查看器中查看事件 ID `59000`。  +  避免由于 Tx 数据包的标头超过最大低延迟队列（LLQ）标头大小而导致的不必要设备重置。   | 2024 年 5 月 1 日 | 
| [2.6.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/x64/2.6.0/AwsEnaNetworkDriver.zip) |  +  为支持 ENA Express 的实例类型添加了以下网络性能指标。   `ena_srd_mode`   `ena_srd_tx_pkts`   `ena_srd_eligible_tx_pkts`   `ena_srd_rx_pkts`   `ena_srd_resource_utilization`   <br />+  为基于 Nitro 的实例类型添加了 `conntrack_allowance_available` 网络性能指标。 <br />+  添加了由于检测到 RX 数据损坏而导致的新适配器重置原因。 <br />+  更新了驱动程序日志记录基础设施。  +  防止在 CPU 不足导致网络性能指标更新失败时重置适配器。 <br />+  防止错误检测到设备检测信号中断。 <br />+  修复了驱动程序安装脚本，可支持降级操作。 <br />+  修复了接收错误计数统计数据。   | 2023 年 6 月 20 日 | 
| 2.5.0 |   公告 由于无法在 Windows 域控制器上初始化，ENA Windows 驱动程序版本 2.5.0 已回滚。Windows 客户端和 Windows Server 不受影响。   | 2023 年 2 月 17 日 | 
| [2.4.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/x64/2.4.0/AwsEnaNetworkDriver.zip) |  +  添加了对 Windows Server 2022 的支持。 <br />+  删除了对 Windows Server 2008 R2 的支持。 <br />+  将低延迟队列 (LLQ) 设置为始终开启，以提高第六代 Amazon EC2 实例的性能。  +  修复了无法将网络性能指标发布到适用于 Windows 的性能计数器 (PCW) 系统的故障。 <br />+  修复了注册表项读取操作期间的内存泄漏问题。 <br />+  在适配器重置过程中，如果出现不可恢复的错误，可防止无限重置循环。   | 2022 年 4 月 28 日 | 
| 2.2.4 |   公告 由于第六代 EC2 实例的潜在性能下降，ENA Windows 驱动程序版本 2.2.4 已回滚。建议您使用以下方法之一降级驱动程序：  +  安装旧版本  从此表中的链接下载旧版本软件包（版本 2.2.3）。   运行 **install.ps1** PowerShell 安装脚本。   有关安装前和安装后步骤的详细信息，请参阅 [在 Windows 上启用增强联网](enabling_enhanced_networking.md#enable-enhanced-networking-ena-windows)。 <br />+  使用 Amazon EC2 Systems Manager 进行批量更新  通过 SSM 文档 `AWS-ConfigureAWSPackage` 和如下参数执行批量更新：   **Name**（名称）：AwsEnaNetworkDriver   **Version（版本**）：2.2.3       | 2021 年 10 月 26 日 | 
| [2.2.3](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/x64/2.2.3/AwsEnaNetworkDriver.zip) |  +  增加了对新 Nitro 卡的支持，实例联网速度高达 400 Gbps。  +  修复了 ENA 驱动程序的系统时间更改和系统时间查询之间的竞争条件，这会导致硬件无响应的误报检测。   公告 Windows ENA 驱动程序版本 2.2.3 是支持 Windows Server 2008 R2 的最终版本。Windows Server 2008 R2 将继续支持当前可用的使用 ENA 的实例类型，并且驱动程序可以通过下载获得。未来的实例类型不会支持 Windows Server 2008 R2，且您无法启动、导入或将 Windows Server 2008 R2 映像迁移到未来的实例类型。   | 2021 年 3 月 25 日 | 
| [2.2.2](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/2.2.2/AwsEnaNetworkDriver.zip) |  +  添加了对使用 CloudWatch 和适用于 Windows 使用者的性能计数器查询网络适配器性能指标的支持。  +  修复了裸机实例的性能问题。  | 2020 年 12 月 21 日 | 
| [2.2.1](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/2.2.1/AwsEnaNetworkDriver.zip) |  +  添加一种方法，以允许主机查询 Elastic Network Adapter 来获取网络性能指标。  | 2020 年 10 月 1 日 | 
| [2.2.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/2.2.0/AwsEnaNetworkDriver.zip) |  +  添加了对下一代硬件类型的支持。 <br />+  提高了从停止休眠恢复后的实例启动时间，并消除误报 ENA 错误消息。  +  优化入站流量的处理。 <br />+  改进了低资源环境中的共享内存管理。  +  在驱动程序无法重置的极少数情况下，避免在移除 ENA 设备时系统崩溃。   | 2020 年 8 月 12 日 | 
| [2.1.5](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/2.1.5/AwsEnaNetworkDriver.zip) |  +  修复了裸机实例上偶尔出现的网络适配器初始化失败的问题。  | 2020 年 6 月 23 日 | 
| [2.1.4](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/2.1.4/AwsEnaNetworkDriver.zip) |  +  防止来自网络堆栈的损坏 LSO 数据包元数据导致的连接问题。 <br />+  防止由罕见的竞争情况导致的系统崩溃，这种情况导致访问已释放的数据包内存。   | 2019 年 11 月 25 日 | 
| [2.1.2](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/2.1.2/AwsEnaNetworkDriver.zip) |  +  添加了对供应商 ID 报告的支持，以允许操作系统生成基于 MAC 的 UUID。  +  改进了初始化期间的 DHCP 网络配置性能。 <br />+  当最大传输单位 (MTU) 超过 4K 时，正确计算入站 IPv6 流量的 L4 校验和。 <br />+  驱动程序稳定性的一般改进和较小错误修复。   | 2019 年 11 月 4 日 | 
| [2.1.1](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/2.1.1/AwsEnaNetworkDriver.zip) |  +  防止丢弃从操作系统到达的高度分段的 TCP LSO 数据包。 <br />+  在 IPv6 网络中正确处理在 IPSec 内封装安全负载 (ESP) 协议。   | 2019 年 9 月 16 日 | 
| [2.1.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/2.1.0/AwsEnaNetworkDriver.zip) | ENA Windows 驱动程序 2.1 版引入了新的 ENA 设备功能，提升了性能，添加了新的功能并包含多项稳定性改进。+  在巨型帧配置中使用标准化的 Windows 注册表项。 <br />+  允许通过 ENA 驱动程序属性 GUI 配置 VLAN ID 设置。 <br />+  改进的恢复流程   改进的故障识别机制。   添加了对可调恢复参数的支持。   <br />+  对于具有超过 8 个 vCPU 的较新 EC2 实例，最多支持 32 个 I/O 队列。 <br />+  将驱动程序内存占用量减少约 90%。 +  减少了传输路径延迟。 <br />+  支持接收校验和分载。 <br />+  优化负载较高的系统的性能（优化了锁定机制使用）。 <br />+  进一步增强以降低 CPU 利用率，并提高了具有较高负载的系统的响应速度。 +  修复由于不连续 Tx 标头解析无效而导致崩溃的问题。 <br />+  修复在裸机实例上分离弹性网络接口期间驱动程序 1.5 版崩溃的问题。 <br />+  修复 IPv6 上的 LSO 伪标头校验和计算错误。 <br />+  修复在初始化失败时的潜在内存资源泄漏问题。 <br />+  禁用 IPv4 分段的 TCP/UDP 校验和分载。 <br />+  修复 VLAN 配置。在只应禁用 VLAN 优先级时，错误地禁用了 VLAN。 <br />+  使事件查看器能够正确解析自定义驱动程序消息。 <br />+  修复由于时间戳处理无效而无法初始化驱动程序的问题。 <br />+  修复数据处理和 ENA 设备禁用之间的争用情况。  | 2019 年 7 月 1 日 | 
| [1.5.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/1.5.0/AwsEnaNetworkDriver.zip) |  +  改进了稳定性，修复了性能问题。 <br />+  接收缓冲区现在可在 ENA NIC 的“Advanced Properties (高级属性)”中配置为高达 8192 的值。 <br />+  默认接收缓冲区为 1k。   | 2018 年 10 月 4 日 | 
| [1.2.3](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/1.2.3/AwsEnaNetworkDriver.zip) | 包括可靠性修复，并且统一了对 Windows Server 2008 R2 到 Windows Server 2016 的支持。 | 2018 年 2 月 13 日 | 
| [1.0.8](https://s3.amazonaws.com/ec2-windows-drivers-downloads/ENA/1.0.8/AwsEnaNetworkDriver.zip) | 首次发布。包含在适用于 Windows Server 2008 R2、Windows Server 2012 RTM、Windows Server 2012 R2 和 Windows Server 2016 的 AMI 中。 | 2016 年 7 月 | 

## 订阅来自 Amazon SNS 的 ENA Windows 驱动程序发布通知
<a name="ena-win-driver-release-notification"></a>

Amazon SNS 可在 EC2 Windows 驱动程序的新版本发布时向您发送通知。使用以下过程订阅这些通知。

**订阅 EC2 通知**

1. 通过以下网址打开 Amazon SNS 控制台：[https://console.aws.amazon.com/sns/v3/home](https://console.aws.amazon.com/sns/v3/home)。

1. 如果需要，可在导航栏中将区域更改为**美国东部（弗吉尼亚州北部）**。您必须选择此区域，因为您订阅的 SNS 通知是在此区域中创建的。

1. 在导航窗格中，选择 **Subscriptions**。

1. 选择 **Create subscription**。

1. 在 **Create subscription** 对话框中，执行以下操作：

   1. 对于 **TopicARN**，复制以下 Amazon 资源名称（ARN）：

      **arn:aws:sns:us-east-1:801119661308:ec2-windows-drivers**

   1. 对于 **Protocol**，选择 `Email`。

   1. 对于**端点**，输入您希望向其发送通知的电子邮件地址。

   1. 选择 **Create subscription**。

1. 您将收到一封确认电子邮件。打开电子邮件，然后按照说明操作以完成订阅。

每当发布新的 EC2 Windows 驱动程序时，我们都会向订户发送通知。如果您不希望再收到这些通知，请通过以下步骤取消订阅。

**从 Amazon EC2 Windows 驱动程序通知中取消订阅**

1. 通过以下网址打开 Amazon SNS 控制台：[https://console.aws.amazon.com/sns/v3/home](https://console.aws.amazon.com/sns/v3/home)。

1. 在导航窗格中，选择 **Subscriptions**。

1. 选中订阅的复选框，然后选择 **Actions**、**Delete subscriptions**。当系统提示进行确认时，选择 **Delete**。
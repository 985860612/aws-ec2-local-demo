

# 对弹性网络适配器 Windows 驱动程序进行问题排查
<a name="troubleshoot-ena-driver"></a>

弹性网络适配器（ENA） 旨在改进操作系统运行状况和降低可能会中断 Windows 实例运行的意外硬件行为或故障。ENA 架构保持设备或驱动程序故障对操作系统尽可能透明。

## 收集有关实例的诊断信息
<a name="ts-ena-drv-collect-diagnostics"></a>

打开 Windows 操作系统 (OS) 工具的步骤会有所不同，具体取决于实例上安装的操作系统版本。在以下各节中，我们使用 **Run**（运行）对话框以打开工具，该工具在所有操作系统版本中都是一样的。但是，您可以使用任何您喜欢的方法访问这些工具。

**访问 Run（运行）对话框**
+ 使用 Windows 徽标键组合：`Windows` \+ `R`
+ 使用搜索栏：
  + 在搜索栏中输入 `run`。
  + 从搜索结果中选择 **Run**（运行）应用程序。

有些步骤需要上下文菜单才能访问属性或上下文相关操作。根据操作系统版本和硬件，有多种方法可执行此操作。

**访问上下文菜单**
+ 使用鼠标：右键单击某个项目以弹出其上下文菜单。
+ 使用键盘：
  + 根据您的操作系统版本，使用`Shift` \+ `F10` 或 `Ctrl` \+ `Shift` \+ `F10`。
  + 如果键盘上有上下文键（一个框中有三条水平线），请选择所需的项目，然后按上下文键。

如果您可以连接到实例，请使用以下方法收集诊断信息以进行故障排除。

### 检查 ENA 设备状态
<a name="ts-ena-diagnostics-device-mgr"></a>

要使用 Windows 设备管理器检查 ENA Windows 驱动程序的状态，请按照以下步骤操作：

1. 使用上一个部分介绍的方法之一打开 **Run**（运行）对话框。

1. 要打开 Windows 设备管理器，请在 **Run**（运行）框中输入 `devmgmt.msc`。

1. 选择**确定**。这将打开 Device Manager（设备管理器）窗口。

1. 选择 **Network adapters**（网络适配器）左侧的箭头以展开列表。

1. 选择名称或打开 **Amazon Elastic Network Adapter** 的上下文菜单，然后选择 **Properties**（属性）。这将打开 **Amazon 弹性网络适配器属性**对话框。

1. 验证**常规**选项卡中的消息是否显示“此设备工作正常”。

### 调查驱动程序事件消息
<a name="ts-ena-diagnostics-event-log"></a>

要使用 Windows 事件查看器查看 ENA Windows 驱动程序事件日志，请执行以下步骤：

1. 使用上一个部分介绍的方法之一打开 **Run**（运行）对话框。

1. 要打开 Windows 事件查看器，请在 **Run**（运行）框中输入 `eventvwr.msc`。

1. 选择**确定**。此操作将打开 Event Viewer（事件查看器）窗口。

1. 展开 **Windows Logs**（Windows 日志）菜单，然后选择 **System**（系统）。

1. 在 **Actions**（操作）下的右上角面板中，选择 **Filter Current Log**（筛选当前日志）。此时将显示筛选对话框。

1. 在 **Event sources**（事件来源）框中，输入 `ena`。这会将结果限制为由 ENA Windows 驱动程序生成的事件。

1. 选择**确定**。这将在窗口的详细信息部分中显示已筛选的事件日志结果。

1. 要深入了解详细信息，请从列表中选择一条事件消息。

以下示例显示了 Windows 事件查看器系统事件列表中的 ENA 驱动程序事件：

![示例：Windows 事件查看器系统消息列表中显示的 ENA 驱动程序事件。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ena-event-viewer-example.png)


#### 事件消息摘要
<a name="ts-ena-diagnostics-event-messages"></a>

下表显示了 ENA Windows 驱动程序生成的事件消息。


**Input**  

| 事件 ID | ENA 驱动程序事件描述 | 类型 | 
| --- | --- | --- | 
| 5001 | 硬件资源不足 | 错误 | 
| 5002 | 适配器检测到硬件错误 | 错误 | 
| 5005 | 适配器的 NDIS 操作超时，未及时完成 | 错误 | 
| 5032 | 适配器无法重置设备 | 错误 | 
| 5200 | 适配器已初始化 | 信息性 | 
| 5201 | 适配器已停止 | 信息性 | 
| 5202 | 适配器已暂停 | 信息性 | 
| 5203 | 适配器已重新启动 | 信息性 | 
| 5204 | 适配器已关闭 | 信息性 | 
| 5205 | 适配器已重置 | 错误 | 
| 5206 | 适配器被意外移除 | 错误 | 
| 5208 | 适配器初始化例程失败 | 错误 | 
| 5210 | 适配器遇到并成功恢复了内部问题 | 错误 | 

### 查看性能指标
<a name="ts-ena-diagnostics-perf-metrics"></a>

ENA Windows 驱动程序从启用指标的实例发布网络性能指标。您可以使用本机性能监视器应用程序查看和启用实例上的指标。有关 ENA Windows 驱动程序生成的指标的更多信息，请参阅 [监控 EC2 实例上 ENA 设置的网络性能](monitoring-network-performance-ena.md)。

在启用了 ENA 指标并安装了 Amazon CloudWatch 代理的实例上，CloudWatch 将收集与 Windows 性能监控器中的计数器关联的指标以及 ENA 的一些高级指标。除了在 EC2 实例上默认启用的指标以外，还会收集这些指标。有关这些指标的更多信息，请参阅 *Amazon CloudWatch 用户指南*中的 [CloudWatch 代理收集的指标](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/metrics-collected-by-CloudWatch-agent.html)。

**注意**  
性能指标适用于 ENA 驱动程序版本 2.4.0 及更高版本（也适用于版本 2.2.3）。由于第六代 EC2 实例的潜在性能下降，ENA 驱动程序版本 2.2.4 已回滚。我们建议您将驱动程序升级到当前版本，以确保您拥有最新更新。

使用性能指标的一些方法包括：
+ 排查实例性能问题。
+ 为工作负载选择合适的实例大小。
+ 主动计划扩缩活动。
+ 设置应用程序基准，以确定它们是否最大限度地提高实例的可用性能。

**刷新率**  
默认情况下，驱动程序使用 1 秒的间隔刷新指标。但是，检索指标的应用程序可能会使用不同的时间间隔进行轮询。您可以使用驱动程序的高级属性在设备管理器中更改刷新间隔。

要更改 ENA Windows 驱动程序的指标刷新间隔，请执行以下步骤：

1. 使用上一个部分介绍的方法之一打开 **Run**（运行）对话框。

1. 要打开 Windows 设备管理器，请在 **Run**（运行）框中输入 `devmgmt.msc`。

1. 选择**确定**。这将打开 Device Manager（设备管理器）窗口。

1. 选择 **Network adapters**（网络适配器）左侧的箭头以展开列表。

1. 选择名称或打开 **Amazon Elastic Network Adapter** 的上下文菜单，然后选择 **Properties**（属性）。这将打开 **Amazon 弹性网络适配器属性**对话框。

1. 打开弹出窗口中的 **Advanced**（高级）选项卡。

1. 从 **Property**（属性）列表中选择 **Metrics Refresh Interval**（指标刷新间隔）以更改值。

1. 完成后，选择 **OK**（确定）。

## 调查次优配置通知
<a name="ts-ena-win-sub-opt-config-notification"></a>

ENA 设备检测驱动程序中您可以更改的次优配置设置。设备将通知 ENA 驱动程序并记录事件通知。要在 Windows 事件查看器中查看次优事件

1. 使用上一个部分介绍的方法之一打开 **Run**（运行）对话框。

1. 要打开 Windows 事件查看器，请在 **Run**（运行）框中输入 `eventvwr.msc`。

1. 选择**确定**。此操作将打开 Event Viewer（事件查看器）窗口。

1. 展开 **Windows Logs**（Windows 日志）菜单，然后选择 **System**（系统）。

1. 在 **Actions**（操作）下的右上角面板中，选择 **Filter Current Log**（筛选当前日志）。此时将显示筛选对话框。

1. 在 **Event sources**（事件来源）框中，输入 `ena`。这会将结果限制为由 ENA Windows 驱动程序生成的事件。

1. 选择**确定**。这将在窗口的详细信息部分中显示已筛选的事件日志结果。

ID 为 `59000` 的事件会通知您次优配置调查发现。打开事件的上下文（右键单击）菜单，选择**事件属性**以打开详细视图，或从**视图**菜单中选择**预览窗格**以查看相同的详细信息。

![示例：Windows 事件查看器预览窗格中显示的系统事件 ID 59000。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ena-sub-opt-event-general.png)


打开**详细信息**选项卡以查看事件代码。在**二进制数据：单词**部分中，最后一个单词是代码。

![示例：“二进制数据”部分的最后一个单词突出显示。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ena-sub-opt-event-detail.png)


以下列表显示通知代码详细信息以及对次优配置调查发现的建议操作。
+ **代码`1`：不建议使用宽 LLQ 配置的 ENA Express**

  ENA Express ENI 配置为宽 LLQ。此配置为次优配置，可能会影响 ENA Express 的性能。建议您在使用 ENA Express ENI 时禁用宽 LLQ 设置，如下所示。

  1. 要打开 Windows 设备管理器，请在 **Run**（运行）框中输入 `devmgmt.msc`。

  1. 选择**确定**。这将打开 Device Manager（设备管理器）窗口。

  1. 选择 **Network adapters**（网络适配器）左侧的箭头以展开列表。

  1. 打开 `Amazon Elastic Network Adapter` 的设备属性。

  1. 从这里请打开**高级**选项卡进行更改。

  1. 选择 **LLQ 标头大小策略**属性，并将其值设置为 `Normal (128 Bytes)`。

  1. 选择**确定**以保存您的更改。
+ **代码 `2`：不建议使用具有次优 Tx 队列深度的 ENA Express ENI**

  ENA Express ENI 配置为次优的 Tx 队列深度。此配置为可能会影响 ENA Express 的性能。我们建议您在使用 ENA Express ENI 时将所有 Tx 队列放大到网络接口的最大值，如下所示。

  按照以下步骤将 Tx 队列放大到最大深度：

  1. 要打开 Windows 设备管理器，请在 **Run**（运行）框中输入 `devmgmt.msc`。

  1. 选择**确定**。这将打开 Device Manager（设备管理器）窗口。

  1. 选择 **Network adapters**（网络适配器）左侧的箭头以展开列表。

  1. 打开 `Amazon Elastic Network Adapter` 的设备属性。

  1. 从这里请打开**高级**选项卡进行更改。

  1. 选择**传输缓冲区**属性，并将其值设置为支持的最大值。

  1. 选择**确定**以保存您的更改。

## ENA 适配器重置
<a name="ts-ena-drv-reset"></a>

当 ENA Windows 驱动程序检测到适配器上的错误并将适配器标记为运行状况不佳时，将启动重置过程。驱动程序无法自行重置，因此依赖操作系统来检查适配器的运行状况，并调用 ENA Windows 驱动程序的重置句柄。重置过程可能会在短时间内造成流量丢失。但是，TCP 连接应该能够恢复。

ENA 适配器也可能会间接请求设备重置过程，因为无法发送保持活动状态的通知。例如，如果 ENA 适配器在加载无法恢复的配置后达到未知状态，它可能会停止发送保持活动通知。

**ENA 适配器重置的常见原因**
+ 保持活动消息丢失

  ENA 适配器按固定速度（通常为每秒一次）发布保持活动事件。ENA Windows 驱动程序实施一种监视机制，用于定期检查是否存在这些保持活动消息。如果它自上次检查以来检测到一条或多条新消息，则会记录成功的结果。否则，驱动程序得出结论认为设备出现故障，并且会启动重置序列。
+ 数据包卡在传输队列中

  ENA 适配器验证数据包是否按预期流过传输队列。ENA Windows 驱动程序检测数据包是否卡住，如果卡住，则启动重置序列。
+ 内存映射输入/输出 (MMIO) 寄存器的读取超时

  为了限制内存映射输入/输出 (MMIO) 读取操作，ENA Windows 驱动程序仅在初始化和重置过程中访问 MMIO 寄存器。如果驱动程序检测到超时，则需要执行以下操作之一，具体取决于正在运行的进程：
  + 如果在初始化过程中检测到超时，流动将失败，从而导致驱动程序在 Windows 设备管理器中显示 ENA 适配器的黄色感叹号。
  + 如果在重置期间检测到超时，流动将失败。然后，操作系统会开始突然删除 ENA 适配器，然后通过停止和启动已移除的适配器来恢复它。有关突然移除网络接口卡 (NIC) 的更多信息，请参阅 *Microsoft Windows 硬件开发人员*文档中的[处理 NIC 的意外移除](https://learn.microsoft.com/en-us/windows-hardware/drivers/network/handling-the-surprise-removal-of-a-nic)。

## 诊断场景
<a name="ts-ena-drv-scenarios"></a>

以下场景可帮助您解决 ENA Windows 驱动程序可能遇到的问题。如果没有最新版本，我们建议您先升级 ENA 驱动程序。要查找适用于 Windows 操作系统版本的最新驱动程序，请参阅 [跟踪 ENA Windows 驱动程序发行版](ena-driver-releases-windows.md)。

### 安装了意外的 ENA 驱动程序
<a name="ts-ena-drv-sc-unexpected-vsn"></a>

#### 说明
<a name="ts-ena-drv-sc-unexpected-vsn-descr"></a>

完成安装特定版本 ENA 驱动程序的步骤后，Windows 设备管理器显示 Windows 安装了其他版本的 ENA 驱动程序。

#### 原因
<a name="ts-ena-drv-sc-unexpected-vsn-cause"></a>

运行安装驱动程序包时，Windows 会首先为本地[驱动程序存储](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/driver-store)中所有给定设备有效的驱动程序包进行排名，然后才会开始安装。系统会将排名最低的程序视为最佳匹配项。这可能与您计划安装的程序包版本不同。有关设备驱动程序包选择过程的更多信息，请参阅《Microsoft 文档网站》上的 [Windows 如何为设备选择驱动程序包](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/how-windows-selects-a-driver-for-a-device)**。

#### 解决方案
<a name="ts-ena-drv-sc-unexpected-vsn-solution"></a>

为确保 Windows 安装的是您选择的驱动程序包版本，您可以使用 [PnPUtil](https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/pnputil) 命令行工具从驱动程序存储中移除排名较低的驱动程序包。

按照以下步骤安装 ENA 驱动程序：

1. 连接到您的实例并以本地管理员身份登录。

1. 打开设备管理器属性窗口，如 [检查 ENA 设备状态](#ts-ena-diagnostics-device-mgr) 部分所述。这将打开 **Amazon 弹性网络适配器属性**窗口的**常规**选项卡。

1. 打开 **Driver**（驱动程序）选项卡。

1. 选择 **Update Driver (更新驱动程序)**。这将打开**更新驱动程序软件 – Amazon 弹性网络适配器**对话框。

   1. 在**您希望如何搜索驱动程序软件？**部分中，选择**浏览计算机以查找驱动程序软件**。

   1. 在**浏览计算机上的驱动程序软件**页面上，选择**让我从计算机上的设备驱动程序列表中选择**（位于搜索栏下方）。

   1. 在**选择要为此硬件安装的设备驱动程序**页面上，选择**硬盘驱动器...**。

   1. 在**从磁盘安装**窗口中，从下拉列表中选择文件位置旁的**浏览...**。

   1. 导航至您下载了目标 ENA 驱动程序包的位置。选择名为 `ena.inf` 的文件，然后选择**打开**。

   1. 要开始安装，请选择**确定**，然后选择**下一步**。

1. 如果安装程序没有自动重启实例，请运行 **Restart-Computer** PowerShell cmdlet。

   ```
   PS C:\> Restart-Computer
   ```

### ENA 驱动程序的设备警告
<a name="ts-ena-drv-sc-device-warn"></a>

#### 说明
<a name="ts-ena-drv-sc-device-warn-descr"></a>

设备管理器**网络适配器**部分中的 ENA 适配器图标显示一个警告标志（里面带有感叹号的黄色三角形）。

以下示例显示了 Windows 设备管理器中带有警告图标的 ENA 适配器：

![示例：Windows 设备管理器中显示的带有警告图标的 ENA 适配器。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ena-adapter-device-mgr-warn.png)


#### 原因
<a name="ts-ena-drv-sc-device-warn-cause"></a>

此设备警告通常是由环境问题引起的，环境问题可能需要更多的研究，而且通常需要一个消除过程来确定潜在原因。有关设备错误的完整列表，请参阅 Microsoft 文档中的[设备管理器错误消息](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/device-manager-error-messages)。

#### 解决方案
<a name="ts-ena-drv-sc-device-warn-solution"></a>

此设备警告的解决方案取决于根本原因。此处描述的消除过程包括一些基本步骤，以帮助确定和解决可能有一个简单的解决方案的最常见问题。如果这些步骤不能解决问题，则需要进行额外的根本原因分析。

请按照以下步骤帮助确定和解决常见问题：

1. 

**停止和启动设备**

   打开设备管理器属性窗口，如 [检查 ENA 设备状态](#ts-ena-diagnostics-device-mgr) 部分所述。这样一来，将打开 **Amazon Elastic Network Adapter Properties**（Amazon Elastic Network Adapter 属性）窗口的 **General**（常规）选项卡，**Device status**（设备状态）在其中显示错误代码和简短消息。

   1. 打开 **Driver**（驱动程序）选项卡。

   1. 选择 **Disable Device**（禁用设备），然后回应 **Yes**（是）转到显示的警告消息。

   1. 选择 **Enable Device**（启用设备）。

1. 

**停止和启动 EC2 实例**

   如果适配器仍然在设备管理器中显示警告图标，则下一步是停止并启动 EC2 实例。在大多数情况下，这会在不同的硬件上重新启动实例。

1. 

**调查可能的实例资源问题**

   如果您已停止并启动 EC2 实例，但问题仍然存在，则可能表明您的实例存在资源问题，例如内存不足。

### 适配器重置后的连接超时（错误代码 5007、5205）
<a name="ts-ena-drv-sc-conn"></a>

#### 说明
<a name="ts-ena-drv-sc-conn-descr"></a>

Windows 事件查看器显示 ENA 适配器的组合发生的适配器超时和重置事件。消息与以下示例类似：
+ **事件 ID 5007**：Amazon Elastic Network Adapter：在操作过程中超时。
+ **事件 ID 5205**：Amazon Elastic Network Adapter：适配器重置已开始。

适配器重置会导致最小的流量中断。即使进行了多次重置，对他们来说，造成任何严重的网络中断都是不寻常的。

#### 原因
<a name="ts-ena-drv-sc-conn-cause"></a>

这一系列事件表示 ENA Windows 驱动程序为无响应的 ENA 适配器启动了重置。但是，设备驱动程序用来检测此问题的机制受 CPU 0 匮乏造成的误报的影响。

#### 解决方案
<a name="ts-ena-drv-sc-conn-solution"></a>

如果这种错误组合频繁发生，请检查您的资源分配以了解哪些调整可能会有帮助。

1. 使用上一个部分介绍的方法之一打开 **Run**（运行）对话框。

1. 要打开 Windows 资源监视器，请在 **Run**（运行）框中输入 `resmon`。

1. 选择**确定**。这将打开资源监视器窗口。

1. 打开 **CPU** 选项卡。按 CPU 的使用率图表显示在资源监视器窗口的右侧。

1. 检查 CPU 0 的使用水平以查看它们是否太高。

我们建议您将 RSS 配置为在较大的实例类型（超过 16 个 vCPU）上排除 ENA 适配器的 CPU 0。对于较小的实例类型，配置 RSS 可能会改善体验，但是由于可用内核数量减少，必须进行测试，以确保限制 CPU 内核不会对性能产生负面影响。

使用 **Set-NetAdapterRss** 命令为 ENA 适配器配置 RSS，如以下示例所示。

```
Set-NetAdapterRss -name (Get-NetAdapter | Where-Object {$_.InterfaceDescription -like "*Elastic*"}).Name -Baseprocessorgroup 0 -BaseProcessorNumber 1
```

### 迁移到第六代实例基础设施会影响性能或附加
<a name="ts-ena-drv-6gen-instance-perf"></a>

#### 说明
<a name="ts-ena-drv-6gen-instance-perf-descr"></a>

如果迁移到第六代 EC2 实例，若尚未更新 ENA Windows 驱动程序版本，则可能会遇到性能降低或 ENA 附加失败的情况。

#### 原因
<a name="ts-ena-drv-6gen-instance-perf-cause"></a>

根据实例操作系统（OS），第六代 EC2 实例类型需要以下 ENA Windows 驱动程序的最低版本。


**最低版本**  

| Windows Server 版本 | ENA 驱动程序版本 | 
| --- | --- | 
| Windows Server 2008 R2 | 2.2.3 或 2.4.0 | 
| Windows Server 2012 及更高版本 | 2.2.3 及更高版本 | 
| Windows 工作站 | 2.2.3 及更高版本 | 

#### 解决方案
<a name="ts-ena-drv-6gen-instance-perf-solution"></a>

在升级到第六代 EC2 实例之前，请确保从中启动的 AMI 具有基于实例操作系统的兼容驱动程序，如上表所示。有关更多信息，请参阅 *AWS re:Post 知识中心*中的[在将 EC2 实例迁移到第六代实例之前，我需要做些什么才能确保获得最大的网络性能？](https://repost.aws/knowledge-center/migrate-to-gen6-ec2-instance)。

### 弹性网络接口的性能不佳
<a name="ts-ena-drv-interface-perf"></a>

#### 说明
<a name="ts-ena-drv-interface-perf-descr"></a>

ENA 接口没有按预期运行。

#### 原因
<a name="ts-ena-drv-interface-perf-cause"></a>

性能问题的根本原因分析是一个消除过程。涉及的变量太多，无法指出共同原因。

#### 解决方案
<a name="ts-ena-drv-interface-perf-solution"></a>

根本原因分析的第一步是查看未按预期运行的实例的诊断信息，以确定是否存在可能导致问题的错误。有关更多信息，请参阅 [收集有关实例的诊断信息](#ts-ena-drv-collect-diagnostics) 部分。

若要在具有增强联网的实例上实现最高网络性能，您可能需要修改原定设置操作系统配置。官方 Windows AMI 已默认配置了一些优化（例如打开校验和卸载和启用 RSS）。有关可以应用于 ENA 适配器的其他优化，请参阅 [ENA 适配器性能调整](#ts-ena-drv-perf-adj) 中显示的性能调整。

我们建议您谨慎行事，并将设备属性调整限制为本节中列出的调整，或者仅限于 AWS 支持团队建议的特定更改。

要更改 ENA 适配器属性，请执行以下步骤：

1. 使用上一个部分介绍的方法之一打开 **Run**（运行）对话框。

1. 要打开 Windows 设备管理器，请在 **Run**（运行）框中输入 `devmgmt.msc`。

1. 选择**确定**。这将打开 Device Manager（设备管理器）窗口。

1. 选择 **Network adapters**（网络适配器）左侧的箭头以展开列表。

1. 选择名称或打开 **Amazon Elastic Network Adapter** 的上下文菜单，然后选择 **Properties**（属性）。这将打开 **Amazon 弹性网络适配器属性**对话框。

1. 要进行更改，请打开**高级**选项卡。

1. 完成后，选择**确定**以保存更改。

以下示例显示了 Windows 设备管理器的 ENA 适配器属性：

![示例：Windows 设备管理器中显示的 ENA 适配器属性。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ena-adapter-device-mgr-property.png)


##### ENA 适配器性能调整
<a name="ts-ena-drv-perf-adj"></a>

下表包括可以调整以提高 ENA 接口性能的属性。


**Input**  

| 属性 | 说明 | 默认值 | 调整 | 
| --- | --- | --- | --- | 
| 接收缓冲区 | 控制软件接收队列中的条目数。 | 1024 | 可以最高增加到 8192。 | 
| 接收端缩放 (RSS) | 支持在多处理器系统中的多个 CPU 之间高效分配网络接收处理。 | 已启用 | 您可以将负载分散到多个处理器之间。要了解更多信息，请参阅[优化 EC2 Windows 实例上的网络性能](enhanced-networking-os.md)。 | 
| RSS 队列的最大数量 | 设置在启用 `RSS` 时允许的最大 RSS 队列数。 | 32 | RSS 队列的数量是在驱动程序初始化过程中确定的，其中包括以下限制（除其他外）：+  此属性设置的 RSS 队列限制 <br />+  实例限制（vCPU 计数） <br />+  硬件生成限制（ENAv1 中最多 8 个 RSS 队列，ENAv2 中最多 32 个 RSS 队列） <br />根据实例和硬件生成限制，您可以将值设置为 1 到 32。要了解更多信息，请参阅[优化 EC2 Windows 实例上的网络性能](enhanced-networking-os.md)。 | 
| 巨型数据包 | 允许使用巨型以太网帧（超过 1500 字节的有效负载）。 | 已禁用（这会将有效负载限制为 1500 字节或以下） | 可以将值最高设置为 `9015`，这将转换为 9001 字节的有效负载。这是巨型以太网帧的最大有效负载。请参阅[使用巨型以太网帧的注意事项](#ts-ena-drv-jumbo-frames)。 | 

##### 使用巨型以太网帧的注意事项
<a name="ts-ena-drv-jumbo-frames"></a>

巨型帧通过增加每个数据包的有效负载大小，从而增加数据包中不属于数据包开销的百分比来支持 1500 个字节以上的数据。发送等量的可用数据所需要的数据包更少。但是，在以下情况下，流量限制为最大 MTU 为 1500：
+ EC2 Classic 给定AWS区域外的流量
+ 单个 VPC 外的流量。
+ 区域间 VPC 对等连接中的流量。
+ VPN 连接的流量。
+ 互联网网关流量。

**注意**  
超过 1500 字节的数据包被分成片段。如果您在 IP 标头中设置了 `Don't Fragment` 标记，这些数据包将被丢弃。  
对于面向 Internet 的流量或离开 VPC 的任何流量，应谨慎使用巨型帧。中间系统会对数据包进行分段，从而减缓此流量。要在 VPC 内使用巨型帧而不影响离开 VPC 的出站流量，请尝试以下选项之一：  
按路由配置 MTU 大小。
使用具有不同 MTU 大小和不同路由的多个网络接口。

**巨型帧的推荐使用案例**  
巨型帧对于 VPC 内部和之间的流量非常有用。我们建议在以下使用案例中使用巨型帧：
+ 对于在集群置放群组中并置的实例，巨型帧有助于实现可能的最大网络吞吐量。有关更多信息，请参阅 [Amazon EC2 实例的置放群组](placement-groups.md)。
+ 您可以通过 Direct Connect 使用巨型帧在 VPC 与本地网络之间进行通信。有关使用 Direct Connect 以及验证巨型帧功能的更多信息，请参阅《Direct Connect User Guide》**中的 [MTUs for private virtual interfaces or transit virtual interfaces](https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html#set-jumbo-frames-vif.html)。
+ 有关中转网关支持的 MTU 大小的更多信息，请参阅 *Amazon VPC 中转网关*中的[您的中转网关的配额](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-quotas.html#mtu-quota)。
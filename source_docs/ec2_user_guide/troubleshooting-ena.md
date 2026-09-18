

# 排查 Linux 上 ENA 内核驱动程序的问题
<a name="troubleshooting-ena"></a>

弹性网络适配器（ENA） 旨在改进操作系统运行状况和降低因意外硬件行为或故障而导致长期中断的几率。ENA 架构保持设备或驱动程序故障对系统尽可能透明。本主题提供了关于 ENA 的故障排除信息。

如果您不能连接到实例，请先从[对连接问题进行故障排除](#ena-connectivity-issues)部分开始。

如果您在迁移到第六代实例类型后遇到性能下降，请参阅文章[在将 EC2 实例迁移到第六代实例之前，我需要做些什么才能确保获得最大的网络性能？](https://repost.aws/knowledge-center/migrate-to-gen6-ec2-instance)

如果您能连接到实例，则可以使用本主题后面部分中涵盖的故障检测和恢复机制收集诊断信息。

**Topics**
+ [对连接问题进行故障排除](#ena-connectivity-issues)
+ [保持活动机制](#ena-keep-alive)
+ [注册表读取超时](#register-read-timeout-ena)
+ [统计数据](#statistics-ena)
+ [syslog 中的驱动程序错误日志](#driver-error-logs-ena)
+ [次优配置通知](#ts-ena-sub-opt-config-notification)

## 对连接问题进行故障排除
<a name="ena-connectivity-issues"></a>

如果您在启用增强联网时丢失连接，则 `ena` 模块可能与您的实例当前运行的内核不兼容。如果您为特定内核版本安装该模块（不使用 **dkms**，或使用配置错误的 **dkms.conf** 文件），然后更新您的实例内核，则会发生这种情况。如果在启动时加载的实例内核未正确安装 `ena` 模块，则您的实例将无法识别网络适配器，并且您的实例将变得无法访问。

如果您为 PV 实例或 AMI 启用增强联网，这也会使您的实例无法访问。

如果在启用 ENA 增强联网后您的实例变得无法访问，可以为您的实例禁用 `enaSupport` 属性，这将回退到库存网络适配器。

**禁用 ENA 增强联网 (EBS 支持的实例)**

1. 在本地计算机上，使用 Amazon EC2 控制台、[stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html) 命令（AWS CLI）或 [Stop-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2Instance.html) cmdlet（AWS Tools for PowerShell）停止实例。

1. 在本地计算机上，使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令与 `--no-ena-support` 选项或使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet 与 `-EnaSupport $false` 参数来禁用增强型联网属性。

1. 在本地计算机上，使用 Amazon EC2 控制台、 [start-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/start-instances.html) 命令或 [Start-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Start-EC2Instance.html) cmdlet 启动实例。

1. (可选) 连接到您的实例，并按照`ena`中的步骤尝试重新安装具有当前内核版本的 [在 EC2 实例上使用 ENA 启用增强联网功能](enhanced-networking-ena.md) 模块。<a name="disable-enhanced-networking-ena-instance-store"></a>

**禁用 ENA 增强联网 (实例存储支持的实例)**

1. 按[创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md) 中的说明创建一个新 AMI。

1. 注册 AMI 时，请务必在 [stop-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/stop-instances.html) 命令（AWS CLI）中包含 `--no-ena-support` 选项或在 [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html) cmdlet 中包含 `-EnaSupport $false` 参数。

## 保持活动机制
<a name="ena-keep-alive"></a>

ENA 设备按固定速度 (通常每秒一次) 发布保持活动事件。ENA 驱动程序实施一种监视机制，用于检查是否存在这些保持活动消息。如果存在一条或多条消息，则重新启动监视，否则此驱动程序将认为设备出现故障，然后执行以下操作：
+ 将当前统计数据转储到 syslog
+ 重置 ENA 设备
+ 重置 ENA 驱动程序状态

上述重置过程可能会在短时间内导致一些流量丢失 (TCP 连接应该能恢复)，但应该不会影响到用户。

例如，如果 ENA 设备在加载无法恢复的配置后进入未知状态，ENA 设备也可能会间接请求设备重置过程，而不发送保持活动通知。

下面是重置过程的示例：

```
[18509.800135] ena 0000:00:07.0 eth1: Keep alive watchdog timeout. {{// The watchdog process initiates a reset}}
[18509.815244] ena 0000:00:07.0 eth1: Trigger reset is on		
[18509.825589] ena 0000:00:07.0 eth1: tx_timeout: 0 {{// The driver logs the current statistics}}
[18509.834253] ena 0000:00:07.0 eth1: io_suspend: 0
[18509.842674] ena 0000:00:07.0 eth1: io_resume: 0
[18509.850275] ena 0000:00:07.0 eth1: wd_expired: 1
[18509.857855] ena 0000:00:07.0 eth1: interface_up: 1
[18509.865415] ena 0000:00:07.0 eth1: interface_down: 0
[18509.873468] ena 0000:00:07.0 eth1: admin_q_pause: 0
[18509.881075] ena 0000:00:07.0 eth1: queue_0_tx_cnt: 0
[18509.888629] ena 0000:00:07.0 eth1: queue_0_tx_bytes: 0
[18509.895286] ena 0000:00:07.0 eth1: queue_0_tx_queue_stop: 0
.......
........
[18511.280972] ena 0000:00:07.0 eth1: free uncompleted tx skb qid 3 idx 0x7 {{// At the end of the down process, the driver discards incomplete packets.}}
[18511.420112] [ENA_COM: ena_com_validate_version] ena device version: 0.10 {{//The driver begins its up process}}
[18511.420119] [ENA_COM: ena_com_validate_version] ena controller version: 0.0.1 implementation version 1
[18511.420127] [ENA_COM: ena_com_admin_init] ena_defs : Version:[b9692e8] Build date [Wed Apr  6 09:54:21 IDT 2016]
[18512.252108] ena 0000:00:07.0: Device watchdog is Enabled
[18512.674877] ena 0000:00:07.0: irq 46 for MSI/MSI-X
[18512.674933] ena 0000:00:07.0: irq 47 for MSI/MSI-X
[18512.674990] ena 0000:00:07.0: irq 48 for MSI/MSI-X
[18512.675037] ena 0000:00:07.0: irq 49 for MSI/MSI-X
[18512.675085] ena 0000:00:07.0: irq 50 for MSI/MSI-X
[18512.675141] ena 0000:00:07.0: irq 51 for MSI/MSI-X
[18512.675188] ena 0000:00:07.0: irq 52 for MSI/MSI-X
[18512.675233] ena 0000:00:07.0: irq 53 for MSI/MSI-X
[18512.675279] ena 0000:00:07.0: irq 54 for MSI/MSI-X
[18512.772641] [ENA_COM: ena_com_set_hash_function] Feature 10 isn't supported
[18512.772647] [ENA_COM: ena_com_set_hash_ctrl] Feature 18 isn't supported
[18512.775945] ena 0000:00:07.0: Device reset completed successfully {{// The reset process is complete}}
```

## 注册表读取超时
<a name="register-read-timeout-ena"></a>

ENA 架构建议使用有限的内存映射的 I/O (MMIO) 读取操作。ENA 设备驱动程序仅在其初始化过程中访问 MMIO 注册表。

如果驱动程序日志（在 **dmesg** 输出中可用）指示读取操作失败，这可能是由驱动程序不兼容或编译错误、硬件设备繁忙或硬件故障所导致的。

指示读取操作失败的间歇性日志条目不应视为问题；在这种情况下，驱动程序将重试读取操作。但是，一系列包含读取失败的日志条目则指示驱动程序或硬件问题。

下面是指示读取操作因超时而失败的驱动程序日志条目示例：

```
[ 47.113698] [ENA_COM: ena_com_reg_bar_read32] reading reg failed for timeout. expected: req id[1] offset[88] actual: req id[57006] offset[0] 
[ 47.333715] [ENA_COM: ena_com_reg_bar_read32] reading reg failed for timeout. expected: req id[2] offset[8] actual: req id[57007] offset[0] 
[ 47.346221] [ENA_COM: ena_com_dev_reset] Reg read32 timeout occurred
```

## 统计数据
<a name="statistics-ena"></a>

如果您遇到网络性能差或延迟问题，您应该检索设备统计数据并检查这些数据。可以使用 **ethtool** 获取这些统计数据，如下所示：

```
[ec2-user ~]$ ethtool -S eth{{N}}
NIC statistics:
	tx_timeout: 0
	suspend: 0
	resume: 0
	wd_expired: 0
	interface_up: 1
	interface_down: 0
	admin_q_pause: 0
	bw_in_allowance_exceeded: 0
	bw_out_allowance_exceeded: 0
	pps_allowance_exceeded: 0
	conntrack_allowance_available: 450878
	conntrack_allowance_exceeded: 0
	linklocal_allowance_exceeded: 0
	queue_0_tx_cnt: 4329
	queue_0_tx_bytes: 1075749
	queue_0_tx_queue_stop: 0
	...
```

命令输出参数如下所述：

`tx_timeout`: {{N}}  
Netdev 监视的激活次数。

`suspend`: {{N}}  
驱动程序执行挂起操作的次数。

`resume`: {{N}}  
驱动程序执行恢复操作的次数。

`wd_expired`: {{N}}  
驱动程序在过去的 3 秒内未收到保持活动事件的次数。

`interface_up`: {{N}}  
ENA 接口启动的次数。

`interface_down`: {{N}}  
ENA 接口关闭的次数。

`admin_q_pause`: {{N}}  
在运行状态下找不到管理员队列的次数。

`bw_in_allowance_exceeded`: {{N}}  
因入站聚合带宽超过实例的最大值而排队或丢弃的数据包的数量。

`bw_out_allowance_exceeded`: {{N}}  
因出站聚合带宽超过实例的最大值而排队或丢弃的数据包的数量。

`pps_allowance_exceeded`: {{N}}  
因双向 PPS 超过实例的最大值而排队或丢弃的数据包的数量。\*

`conntrack_allowance_available`: {{N}}  
在达到该实例类型的跟踪连接限额之前，实例可以建立的跟踪连接数。仅适用于基于 Nitro 的实例。FreeBSD 实例或 DPDK 环境不支持。

`conntrack_allowance_exceeded`: {{N}}  
由于连接跟踪超过实例的最大值且无法建立新连接而丢弃的数据包的数量。这可能会导致进出实例的流量丢失数据包。

`linklocal_allowance_exceeded`: {{N}}  
由于到本地代理服务的流量的 PPS 超出网络接口的最大值而丢弃的数据包数量。这会影响流向 Amazon DNS 服务、实例元数据服务和 Amazon Time Sync Service 的流量，但不会影响流向自定义 DNS 解析器的流量。

`queue_{{N}}_tx_cnt`: {{N}}  
为此队列传输的数据包数。

`queue_{{N}}_tx_bytes`: {{N}}  
为此队列传输的字节数。

`queue_{{N}}_tx_queue_stop`: {{N}}  
队列 {{N}} 已满并停止的次数。

`queue_{{N}}_tx_queue_wakeup`: {{N}}  
队列 {{N}} 在停止后恢复的次数。

`queue_{{N}}_tx_dma_mapping_err`: {{N}}  
直接内存访问错误计数。如果此值不为 0，则表示系统资源不足。

`queue_{{N}}_tx_linearize`: {{N}}  
此对队列尝试 SKB 线性化处理的次数。

`queue_{{N}}_tx_linearize_failed`: {{N}}  
此队列的 SKB 线性化处理失败的次数。

`queue_{{N}}_tx_napi_comp`: {{N}}  
`napi` 处理程序为此队列调用 `napi_complete` 的次数。

`queue_{{N}}_tx_tx_poll`: {{N}}  
为此队列 计划 `napi` 处理程序的次数。

`queue_{{N}}_tx_doorbells`: {{N}}  
此队列的传输门铃数。

`queue_{{N}}_tx_prepare_ctx_err`: {{N}}  
此队列的 `ena_com_prepare_tx` 失败的次数。

`queue_{{N}}_tx_bad_req_id`: {{N}}  
此队列的 `req_id` 无效。有效的 `req_id` = 0 - `queue_size` - 1。

`queue_{{N}}_tx_llq_buffer_copy`: {{N}}  
此队列的报头大小大于 llq 条目的数据包的数量。

`queue_{{N}}_tx_missed_tx`: {{N}}  
此队列剩下未完成的数据包数。

`queue_{{N}}_tx_unmask_interrupt`: {{N}}  
此队列的 tx 中断被揭开的次数。

`queue_{{N}}_rx_cnt`: {{N}}  
为此队列接收的数据包数。

`queue_{{N}}_rx_bytes`: {{N}}  
为此队列接收的字节数。

`queue_{{N}}_rx_rx_copybreak_pkt`: {{N}}  
rx 队列收到小于此队列的 rx\_copybreak 数据包大小的数据包的次数。

`queue_{{N}}_rx_csum_good`: {{N}}  
rx 队列收到数据包的次数，其中检查校验和并且对此队列是正确的。

`queue_{{N}}_rx_refil_partial`: {{N}}  
驱动程序未成功使用此队列的缓冲区重填空的 rx 队列部分的次数。如果此值不为零，则表示内存资源不足。

`queue_{{N}}_rx_bad_csum`: {{N}}  
`rx` 队列具有此队列的错误校验和的次数（仅当支持 rx 校验和卸载时）。

`queue_{{N}}_rx_page_alloc_fail`: {{N}}  
此队列的页分配失败的次数。如果此值不为零，则表示内存资源不足。

`queue_{{N}}_rx_skb_alloc_fail`: {{N}}  
此队列的 SKB 分配失败的次数。如果此值不为零，则表示系统资源不足。

`queue_{{N}}_rx_dma_mapping_err`: {{N}}  
直接内存访问错误计数。如果此值不为 0，则表示系统资源不足。

`queue_{{N}}_rx_bad_desc_num`: {{N}}  
每个数据包使用的缓冲区太多。如果此值不为 0，则表示使用的缓冲区非常小。

`queue_{{N}}_rx_bad_req_id`: {{N}}  
此队列的 req\_id 无效。有效的 req\_id 来自 [0, queue\_size-1]。

`queue_{{N}}_rx_empty_rx_ring`: {{N}}  
此队列的 rx 队列为空的次数。

`queue_{{N}}_rx_csum_unchecked`: {{N}}  
rx 队列收到未检查此队列校验和的数据包的次数。

`queue_{{N}}_rx_xdp_aborted`: {{N}}  
XDP 数据包被归类为 XDP\_ABORT 的次数。

`queue_{{N}}_rx_xdp_drop`: {{N}}  
XDP 数据包被归类为 XDP\_DROP 的次数。

`queue_{{N}}_rx_xdp_pass`: {{N}}  
XDP 数据包被归类为 XDP\_PASS 的次数。

`queue_{{N}}_rx_xdp_tx`: {{N}}  
XDP 数据包被归类为 XDP\_TX 的次数。

`queue_{{N}}_rx_xdp_invalid`: {{N}}  
数据包的 XDP 返回代码无效的次数。

`queue_{{N}}_rx_xdp_redirect`: {{N}}  
XDP 数据包被归类为 XDP\_REDIRECT 的次数。

`queue_{{N}}_xdp_tx_cnt`: {{N}}  
为此队列传输的数据包数。

`queue_{{N}}_xdp_tx_bytes`: {{N}}  
为此队列传输的字节数。

`queue_{{N}}_xdp_tx_queue_stop`: {{N}}  
此队列已满并停止的次数。

`queue_{{N}}_xdp_tx_queue_wakeup`: {{N}}  
此队列在停止后恢复的次数。

`queue_{{N}}_xdp_tx_dma_mapping_err`: {{N}}  
直接内存访问错误计数。如果此值不为 0，则表示系统资源不足。

`queue_{{N}}_xdp_tx_linearize`: {{N}}  
此队列尝试 XDP 缓冲区线性化的次数。

`queue_{{N}}_xdp_tx_linearize_failed`: {{N}}  
此队列的 XDP 缓冲区线性化失败的次数。

`queue_{{N}}_xdp_tx_napi_comp`: {{N}}  
为此队列调用 napi\_complete 的 napi 处理程序的次数。

`queue_{{N}}_xdp_tx_tx_poll`: {{N}}  
为此队列安排了 napi 处理程序的次数。

`queue_{{N}}_xdp_tx_doorbells`: {{N}}  
此队列的传输门铃数。

`queue_{{N}}_xdp_tx_prepare_ctx_err`: {{N}}  
此队列 ena\_com\_prepare\_tx 失败的次数。此值应始终为零；否则，请查看驱动程序日志。

`queue_{{N}}_xdp_tx_bad_req_id`: {{N}}  
此队列的 req\_id 无效。有效的 req\_id 来自 [0, queue\_size-1]。

`queue_{{N}}_xdp_tx_llq_buffer_copy`: {{N}}  
使用此队列的 llq 缓冲区副本复制了其标头的数据包的数量。

`queue_{{N}}_xdp_tx_missed_tx`: {{N}}  
tx 队列条目错过此队列的完成超时的次数。

`queue_{{N}}_xdp_tx_unmask_interrupt`: {{N}}  
此队列的 tx 中断被揭开的次数。

`ena_admin_q_aborted_cmd`: {{N}}  
已中止的管理命令数。这通常发生在自动恢复过程中。

`ena_admin_q_submitted_cmd`: {{N}}  
管理队列门铃数。

`ena_admin_q_completed_cmd`: {{N}}  
管理队列完成数。

`ena_admin_q_out_of_space`: {{N}}  
驱动程序尝试提交新管理命令但队列已满的次数。

`ena_admin_q_no_completion`: {{N}}  
驱动程序未获得命令的管理完成的次数。

## syslog 中的驱动程序错误日志
<a name="driver-error-logs-ena"></a>

ENA 驱动程序会在系统启动期间将日志消息写入到 **syslog** 中。如果您遇到问题，则可以查看这些日志以检查错误。下面是 ENA 驱动程序在系统启动期间记录在 **syslog** 中的信息示例以及一些选择消息注释。

```
Jun  3 22:37:46 ip-172-31-2-186 kernel: [  478.416939] [ENA_COM: ena_com_validate_version] ena device version: 0.10
Jun  3 22:37:46 ip-172-31-2-186 kernel: [  478.420915] [ENA_COM: ena_com_validate_version] ena controller version: 0.0.1 implementation version 1
Jun  3 22:37:46 ip-172-31-2-186 kernel: [  479.256831] ena 0000:00:03.0: Device watchdog is Enabled
Jun  3 22:37:46 ip-172-31-2-186 kernel: [  479.672947] ena 0000:00:03.0: creating 8 io queues. queue size: 1024
Jun  3 22:37:46 ip-172-31-2-186 kernel: [  479.680885] [ENA_COM: ena_com_init_interrupt_moderation] Feature 20 isn't supported  {{// Interrupt moderation is not supported by the device}}
Jun  3 22:37:46 ip-172-31-2-186 kernel: [  479.691609] [ENA_COM: ena_com_get_feature_ex] Feature 10 isn't supported {{// RSS HASH function configuration is not supported by the device
}}Jun  3 22:37:46 ip-172-31-2-186 kernel: [  479.694583] [ENA_COM: ena_com_get_feature_ex] Feature 18 isn't supported {{//RSS HASH input source configuration is not supported by the device}} 
Jun  3 22:37:46 ip-172-31-2-186 kernel: [  479.697433] [ENA_COM: ena_com_set_host_attributes] Set host attribute isn't supported
Jun  3 22:37:46 ip-172-31-2-186 kernel: [  479.701064] ena 0000:00:03.0 (unnamed net_device) (uninitialized): Cannot set host attributes
Jun  3 22:37:46 ip-172-31-2-186 kernel: [  479.704917] ena 0000:00:03.0: Elastic Network Adapter (ENA) found at mem f3000000, mac addr 02:8a:3c:1e:13:b5 Queues 8
Jun  3 22:37:46 ip-172-31-2-186 kernel: [  480.805037] EXT4-fs (xvda1): re-mounted. Opts: (null)
Jun  3 22:37:46 ip-172-31-2-186 kernel: [  481.025842] NET: Registered protocol family 10
```

**可以忽略哪些错误？**  
可以忽略以下可能出现在系统错误日志中的关于 Elastic Network Adapter 的警告：

Set host attribute isn't supported  
此设备不支持主机属性。

failed to alloc buffer for rx queue  
这是可恢复的错误，引发此错误时，表示可能存在内存压力问题。

Feature {{X}} isn't supported  
Elastic Network Adapter 不支持引用的功能。{{X}} 的可能值包括：  
+ 10：此设备不支持 RSS 哈希函数配置。
+ 12：此设备不支持 RSS 间接表配置。
+ 18：此设备不支持 RSS 哈希输入配置。
+ 20：此设备不支持中断裁决。
+ 27：Elastic Network Adapter 驱动程序不支持从 snmpd 轮询以太网功能。

Failed to config AENQ  
Elastic Network Adapter 不支持 AENQ 配置。

Trying to set unsupported AENQ events  
此错误表示尝试设置 Elastic Network Adapter 不支持的 AENQ 事件组。

## 次优配置通知
<a name="ts-ena-sub-opt-config-notification"></a>

ENA 设备检测驱动程序中您可以更改的次优配置设置。设备将通知 ENA 驱动程序并将警告记录到控制台。以下示例显示警告消息的格式。

```
Sub-optimal configuration notification code: 1. Refer to AWS ENA documentation for additional details and mitigation options.
```

以下列表显示通知代码详细信息以及对次优配置调查发现的建议操作。
+ **代码 1：不建议使用宽 LLQ 配置的 ENA Express**

  ENA Express ENI 配置为宽 LLQ。此配置为次优配置，可能会影响 ENA Express 的性能。建议您在使用 ENA Express ENI 时禁用宽 LLQ 设置，如下所示。

  ```
  sudo rmmod ena && sudo modprobe ena force_large_llq_header=0
  ```

  有关 ENA Express 最佳配置的更多信息，请参阅 [使用 ENA Express 提高 EC2 实例之间的网络性能](ena-express.md)。
+ **代码 2：不建议使用具有次优 Tx 队列深度的 ENA Express ENI**

  ENA Express ENI 配置为次优的 Tx 队列深度。此配置为可能会影响 ENA Express 的性能。我们建议您在使用 ENA Express ENI 时将所有 Tx 队列放大到网络接口的最大值，如下所示。

  您可以运行以下 **ethtool** 命令来调整 LLQ 大小。要了解有关如何控制、查询和启用 Wide-LLQ 的更多信息，请参阅适用于 ENA 的 Linux 内核驱动程序文档中的 [Large Low-Latency Queue (Large LLQ)](https://github.com/amzn/amzn-drivers/tree/master/kernel/linux/ena#large-low-latency-queue-large-llq) 主题（详见《Amazon Drivers GitHub 存储库》**。

  ```
  ethtool -g {{interface}}
  ```

  将 Tx 队列设置为最大深度：

  ```
  ethtool -G {{interface}} tx {{depth}}
  ```

  有关 ENA Express 最佳配置的更多信息，请参阅 [使用 ENA Express 提高 EC2 实例之间的网络性能](ena-express.md)。
+ **代码 3：具有常规 LLQ 大小和 Tx 数据包流量的 ENA 超过了支持的最大标头大小**

  默认情况下，ENA LLQ 支持的 Tx 数据包标头大小最大为 96 字节。如果数据包标头大小超过 96 字节，则会丢弃该数据包。要缓解此问题，我们建议您启用 Wide-LLQ，这会将支持的 Tx 数据包标头大小增加到最大 224 字节。

  但在启用 Wide-LLQ 时，最大 Tx 环大小将从 1000 个条目减少到 512 个条目。默认情况下，所有 Nitro v4 及更高版本的实例类型都启用了 Wide-LLQ。
  + Nitro v4 实例类型的默认最大 Wide-LLQ Tx 环大小为 512 个条目，且无法更改。
  + Nitro v5 实例类型的默认 Wide-LLQ Tx 环大小为 512 个条目，但可以增加至 1000 个条目。

  您可以运行以下 **ethtool** 命令来调整 LLQ 大小。要了解有关如何控制、查询和启用 Wide-LLQ 的更多信息，请参阅适用于 ENA 的 Linux 内核驱动程序文档中的 [Large Low-Latency Queue (Large LLQ)](https://github.com/amzn/amzn-drivers/tree/master/kernel/linux/ena#large-low-latency-queue-large-llq) 主题（详见《Amazon Drivers GitHub 存储库》**。

  查找 Tx 队列的最大深度：

  ```
  ethtool -g {{interface}}
  ```

  将 Tx 队列设置为最大深度：

  ```
  ethtool -G {{interface}} tx {{depth}}
  ```
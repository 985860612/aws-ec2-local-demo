

# 监控 EC2 实例上 ENA 设置的网络性能
<a name="monitoring-network-performance-ena"></a>

弹性网络适配器（ENA）驱动程序从启用这些指标的实例发布网络性能指标。您可以使用这些指标来排查实例性能问题、为工作负载选择合适的实例大小、主动计划扩展活动以及对应用程序进行基准测试，以确定它们是否最大限度地提高了实例的可用性能。

Amazon EC2 定义实例级别的网络最大值，以确保高质量的联网体验，包括不同大小实例间一致的网络性能。AWS 为每个实例提供以下最大值：
+ **带宽功能** – 根据实例类型和大小，每个 EC2 实例都具有聚合入站和出站流量的最大带宽。一些实例使用一种网络 I/O 积分机制，根据平均带宽使用率分配网络带宽。Amazon EC2 还拥有最大的带宽，可用于流向 Direct Connect 和互联网的流量。有关更多信息，请参阅 [Amazon EC2 实例网络带宽](ec2-instance-network-bandwidth.md)。
+ **每秒数据包 (PPS) 性能** – 根据实例类型和大小，每个 EC2 实例都具有最大的 PPS 性能。
+ **跟踪连接** – 安全组会跟踪建立的每个连接，以确保返回数据包按预期交付。每个实例都有可以跟踪的最大连接数量。有关更多信息，请参阅 [Amazon EC2 安全组连接跟踪](security-group-connection-tracking.md)。
+ **链接本地服务访问** – 对于流向 Amazon DNS 服务、实例元数据服务和 Amazon Time Sync Service 等本地代理服务的流量，Amazon EC2 规定了每个网络接口的最大 PPS。

当实例的网络流量超过最大值时，AWS 将通过排队然后丢弃网络数据包来调整超过最大值的流量。您可以使用网络性能指标监控流量何时超过最大值。这些指标可以实时告知您对网络流量的影响以及可能的网络性能问题。

**Topics**
+ [要求](#network-performance-metrics-requirements)
+ [ENA 驱动程序的指标](#network-performance-metrics)
+ [查看实例的网络性能指标](#view-network-performance-metrics)
+ [ENA Express 指标](#network-performance-metrics-ena-express)
+ [ENA 的 DPDK 驱动程序的网络性能指标](#network-performance-metrics-dpdk)
+ [运行 FreeBSD 的实例的指标](#network-performance-metrics-freebsd)

## 要求
<a name="network-performance-metrics-requirements"></a>

**Linux 实例**
+ 安装 ENA 驱动程序版本 2.2.10 或更高版本。要验证安装的版本，请使用 **ethtool** 命令。在以下示例中，版本符合最低要求。

  ```
  [ec2-user ~]$ ethtool -i eth0 | grep version
  version: 2.2.10
  ```

  要升级 ENA 驱动程序，请参阅[增强联网](enhanced-networking-ena.md)。
+ 要将这些指标导入到 Amazon CloudWatch，请安装 CloudWatch 代理。有关更多信息，请参阅 *Amazon CloudWatch 用户指南* 中的[收集网络性能指标](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html)。
+ 要支持 `conntrack_allowance_available` 指标，请安装 ENA 驱动程序 2.8.1 或更高版本。
+ 要覆盖 1024 的出口片段 PPS 限制，请安装 ENA 驱动程序 2.13.3 或更高版本。

**Windows 实例**
+ 安装 ENA 驱动程序版本 2.2.2 或更高版本。要验证安装的版本，请按如下方式使用设备管理器。

  1. 通过运行 `devmgmt.msc` 打开设备管理器。

  1. 展开 **Network Adapters**（网络适配器）。

  1. 选择 **Amazon Elastic Network Adapter**、**Properties**（属性）。

  1. 在 **Driver**（驱动程序）选项卡上，查找 **Driver Version**（驱动程序版本）。

  要升级 ENA 驱动程序，请参阅[增强联网](enhanced-networking-ena.md)。
+ 要将这些指标导入到 Amazon CloudWatch，请安装 CloudWatch 代理。有关更多信息，请参阅 *Amazon CloudWatch 用户指南* 中的[收集高级网络指标](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html)。

## ENA 驱动程序的指标
<a name="network-performance-metrics"></a>

ENA 驱动程序实时向实例传送以下指标。它们提供了自上次驱动程序重置以来在每个网络接口上排队或丢弃的累计数据包数。


| 指标 | 说明 | 在以下实例上受支持： | 
| --- | --- | --- | 
| bw\_in\_allowance\_exceeded | 因入站聚合带宽超过实例的最大值而排队或丢弃的数据包的数量。 | 所有实例类型 | 
| bw\_out\_allowance\_exceeded | 因出站聚合带宽超过实例的最大值而排队或丢弃的数据包的数量。 | 所有实例类型 | 
| conntrack\_allowance\_exceeded | 由于连接跟踪超过实例的最大值且无法建立新连接而丢弃的数据包的数量。这可能会导致进出实例的流量丢失数据包。 | 所有实例类型 | 
| conntrack\_allowance\_available | 在达到该实例类型的跟踪连接限额之前，实例可以建立的跟踪连接数。 | 仅限[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type) | 
| linklocal\_allowance\_exceeded | 由于到本地代理服务的流量的 PPS 超出网络接口的最大值而丢弃的数据包数量。这会影响流向 Amazon DNS 服务、实例元数据服务和 Amazon Time Sync Service 的流量，但不会影响流向自定义 DNS 解析器的流量。 | 所有实例类型 | 
| pps\_allowance\_exceeded | 因双向 PPS 超过实例的最大值而排队或丢弃的数据包的数量。\* | 所有实例类型 | 

\*根据 ENA Linux 驱动程序 v2.13.3 或更高版本的片段代理模式设置，此限制还包括网络接口超过 1024 PPS 的出口片段丢弃。如果为 Linux 驱动程序启用了片段代理模式，则出口片段丢弃会绕过通常适用的 1024 PPS 限制，并计入标准 PPS 限额。片段代理模式默认处于禁用状态。

## 查看实例的网络性能指标
<a name="view-network-performance-metrics"></a>

您使用的过程取决于实例的操作系统。

### Linux 实例
<a name="view-network-performance-metrics-linux"></a>

您可以将指标发布到自己的收藏夹工具以可视化指标数据。例如，您可以使用 CloudWatch 代理将指标发布到 Amazon CloudWatch。代理使您能够选择单个指标并控制发布。

您还可以使用 **ethtool** 按如下方式检索每个网络接口的指标，例如 eth0。

```
[ec2-user ~]$ ethtool -S {{eth0}}
     bw_in_allowance_exceeded: 0
     bw_out_allowance_exceeded: 0
     pps_allowance_exceeded: 0
     conntrack_allowance_exceeded: 0
     linklocal_allowance_exceeded: 0
     conntrack_allowance_available: 136812
```

### Windows 实例
<a name="view-network-performance-metrics-windows"></a>

您可以使用 Windows 性能计数器的任何使用者查看指标。数据可以根据 EnaPerfCounters 清单进行解析。这是一个定义性能计数器提供程序及其计数器集的 XML 文件。

**安装清单**

如果您已使用包含 ENA 驱动程序 2.2.2 或更高版本的 AMI 启动实例，或已使用 ENA 驱动程序 2.2.2 的驱动程序包中的安装脚本，则清单已安装。要手动安装清单，请使用以下步骤：

1. 使用以下命令删除现有清单：

   ```
   unlodctr /m:EnaPerfCounters.man
   ```

1. 将清单文件 `EnaPerfCounters.man` 从驱动程序安装包复制到 `%SystemRoot%\System32\drivers`。

1. 使用以下命令安装新清单：

   ```
   lodctr /m:EnaPerfCounters.man
   ```

**使用性能监视器查看指标**

1. 打开性能监视器。

1. 按下 Ctrl\+N 添加新的计数器。

1. 从列表中选择 **ENA Packets Shaping**（ENA 数据包塑造）。

1. 选择要监控的实例，然后选择 **Add**（添加）。

1. 选择 **OK**。

## ENA Express 指标
<a name="network-performance-metrics-ena-express"></a>

ENA Express 由 AWS 可扩展的可靠数据报（SRD）技术提供支持。SRD 是一种高性能网络传输协议，使用动态路由来提高吞吐量并最大限度地减少尾部延迟。如果已为发送和接收实例上的网络接口附件启用 ENA Express，您可以使用 ENA Express 指标来帮助确保实例充分利用 SRD 技术所提供的性能改进。例如：
+ 评估您的资源，确保其有足够的容量来建立更多的 SRD 连接。
+ 确定哪些位置存在阻止符合条件的传出数据包使用 SRD 的潜在问题。
+ 计算实例使用 SRD 的传出流量的百分比。
+ 计算实例使用 SRD 的传入流量的百分比。

**注意**  
要生成指标，请使用驱动程序版本 2.8 或更高版本。

要查看针对 ENA Express 筛选的 Linux 实例指标列表，请对您的网络接口（此处显示为 `eth0`）运行以下 **ethtool** 命令。记下 `ena_srd_mode` 指标的值。

```
[ec2-user ~]$ ethtool -S {{eth0}} | grep ena_srd
NIC statistics:
	ena_srd_mode: 1
	ena_srd_tx_pkts: 0
	ena_srd_eligible_tx_pkts: 0
	ena_srd_rx_pkts: 0
	ena_srd_resource_utilization: 0
```

以下指标适用于所有已启用 ENA Express 的实例。

**ena\_srd\_mode**  
描述启用了哪些 ENA Express 功能。值如下所示：  
+ `0` = ENA Express 关闭，UDP 关闭
+ `1` = ENA Express 开启，UDP 关闭
+ `2` = ENA Express 关闭，UDP 开启
**注意**  
仅在最初启用 ENA Express 并将 UDP 配置为使用该功能时，才会发生这种情况。UDP 流量将保留先前值。
+ `3` = ENA Express 开启，UDP 开启

**ena\_srd\_eligible\_tx\_pkts**  
网络编号如下：  
+ 同时支持发送和接收实例类型。有关更多信息，请参阅 [ENA Express 支持的实例类型](ena-express.md#ena-express-supported-instance-types) 表。
+ 发送和接收实例都必须配置 ENA Express。
+ 发送和接收实例必须在同一区域中运行。
+ 实例之间的网络路径不得包含中间件。ENA Express 目前不支持中间件。
ENA Express 资格指标包括源和目标要求以及两个端点之间的网络。符合条件的数据包在已计数后仍可取消资格。例如，如果某个符合条件的数据包超过了最大传输单元（MTU）的限制，则尽管该数据包在计数器中仍显示为符合条件，但其仍会退回到标准 ENA 传输。

**ena\_srd\_tx\_pkts**  
指定时间段内传输的 SRD 数据包数量。

**ena\_srd\_rx\_pkts**  
指定时间段内接收的 SRD 数据包数量。

**ena\_srd\_resource\_utilization**  
实例已消耗的 SRD 并发连接的最大允许内存利用率的百分比。

要确认数据包传输是否使用 SRD，您可以将符合条件的数据包数量（`ena_srd_eligible_tx_pkts` 指标）与指定时间段内传输的 SRD 数据包数量（`ena_srd_tx_pkts` 指标）进行比较。

**出口流量（传出数据包）**  
为确保您的出口流量按预期使用 SRD，请将符合条件的 SRD 数据包数量（`ena_srd_eligible_tx_pkts`）与指定时间段内发送的 SRD 数据包数量（`ena_srd_tx_pkts`）进行比较。

符合条件的数据包数量和发送的 SRD 数据包数量之间的显著差异通常是由资源利用率问题引起的。当附加到实例的网卡已耗尽其最大资源，或数据包超过 MTU 限制时，符合条件的数据包将无法通过 SRD 传输，必须回退到标准 ENA 传输。在实时迁移或实时服务器更新期间，数据包也可能出现这种问题。要确定根本原因，还需进行额外的故障排除。

**注意**  
您可以忽略符合条件的数据包数量与 SRD 数据包数量之间偶尔的细微差异。例如，当您的实例为 SRD 流量与另一个实例建立连接时，就会发生这种情况。

要找出在给定时间段内使用 SRD 的总出口流量百分比，请将该时间段内发送的 SRD 数据包数（`ena_srd_tx_pkts`）与针对该实例发送的数据包总数（`NetworkPacketOut`）进行比较。

**入口流量（传入数据包）**  
要找出入口流量使用 SRD 的百分比，请将在给定时间段内接收的 SRD 数据包数（`ena_srd_rx_pkts`）与该时间段内针对该实例接收的数据包总数（`NetworkPacketIn`）进行比较。

**资源利用率**  
资源利用率基于单个实例在指定时间可以容纳的 SRD 并发连接的数量。资源利用率指标（`ena_srd_resource_utilization`）会持续跟踪您当前对实例的利用率。当利用率接近 100% 时，可能会出现性能问题。ENA Express 从 SRD 退回到标准 ENA 传输，丢弃数据包的可能性也随之增加。高资源利用率表明是时候向外扩展实例以提高网络性能了。

**注意**  
当实例的网络流量超过最大值时，AWS 将通过排队然后丢弃网络数据包来调整超过最大值的流量。

**持久性**  
为实例启用 ENA Express 时，会累积出口和入口指标。如果停用 ENA Express，指标就会停止累积，但只要实例仍在运行，指标就会一直存在。如果实例重启或终止，或网络接口与实例分离，则指标将重置。

## ENA 的 DPDK 驱动程序的网络性能指标
<a name="network-performance-metrics-dpdk"></a>

ENA 驱动程序版本 2.2.0 及更高版本支持网络指标报告。DPDK 20.11 包括 ENA 驱动程序 2.2.0，它是第一个支持此功能的 DPDK 版本。

DPDK 驱动程序 v25.03 或更高版本支持片段代理模式。如果为 DPDK 驱动程序启用了片段代理模式，则出口片段丢弃会绕过通常适用的 1024 PPS 限制，并计入标准 PPS 限额。片段代理模式默认处于禁用状态。

您可以使用示例应用程序查看 DPDK 统计信息。要启动示例应用程序的交互式版本，请运行以下命令。

```
./app/dpdk-testpmd -- -i
```

在此交互式会话中，您可以输入命令来检索端口的扩展统计信息。以下示例命令将检索端口 0 的统计信息。

```
show port xstats 0
```

以下是与 DPDK 示例应用程序进行交互式会话的示例。

```
[root@ip-192.0.2.0 build]# ./app/dpdk-testpmd -- -i
        EAL: Detected 4 lcore(s)
        EAL: Detected 1 NUMA nodes
        EAL: Multi-process socket /var/run/dpdk/rte/mp_socket
        EAL: Selected IOVA mode 'PA'
        EAL: Probing VFIO support...
        EAL:   Invalid NUMA socket, default to 0
        EAL:   Invalid NUMA socket, default to 0
        EAL: Probe PCI driver: net_ena (1d0f:ec20) device: 0000:00:06.0
(socket 0)
        EAL: No legacy callbacks, legacy socket not created
        Interactive-mode selected
    
        Port 0: link state change event
        testpmd: create a new mbuf pool <mb_pool_0>: n=171456,
size=2176, socket=0
        testpmd: preferred mempool ops selected: ring_mp_mc
    
        Warning! port-topology=paired and odd forward ports number, the
last port will pair with itself.
    
        Configuring Port 0 (socket 0)
        Port 0: 02:C7:17:A2:60:B1
        Checking link statuses...
        Done
        Error during enabling promiscuous mode for port 0: Operation
not supported - ignore
        testpmd> show port xstats 0
        ###### NIC extended statistics for port 0
        rx_good_packets: 0
        tx_good_packets: 0
        rx_good_bytes: 0
        tx_good_bytes: 0
        rx_missed_errors: 0
        rx_errors: 0
        tx_errors: 0
        rx_mbuf_allocation_errors: 0
        rx_q0_packets: 0
        rx_q0_bytes: 0
        rx_q0_errors: 0
        tx_q0_packets: 0
        tx_q0_bytes: 0
        wd_expired: 0
        dev_start: 1
        dev_stop: 0
        tx_drops: 0
        bw_in_allowance_exceeded: 0
        bw_out_allowance_exceeded: 0
        pps_allowance_exceeded: 0
        conntrack_allowance_exceeded: 0
        linklocal_allowance_exceeded: 0
        rx_q0_cnt: 0
        rx_q0_bytes: 0
        rx_q0_refill_partial: 0
        rx_q0_bad_csum: 0
        rx_q0_mbuf_alloc_fail: 0
        rx_q0_bad_desc_num: 0
        rx_q0_bad_req_id: 0
        tx_q0_cnt: 0
        tx_q0_bytes: 0
        tx_q0_prepare_ctx_err: 0
        tx_q0_linearize: 0
        tx_q0_linearize_failed: 0
        tx_q0_tx_poll: 0
        tx_q0_doorbells: 0
        tx_q0_bad_req_id: 0
        tx_q0_available_desc: 1023
        testpmd>
```

有关示例应用程序以及使用它检索扩展统计信息的更多信息。请参阅 DPDK 文档中的 [Testpmd 应用程序用户指南](https://doc.dpdk.org/guides/testpmd_app_ug/)。

## 运行 FreeBSD 的实例的指标
<a name="network-performance-metrics-freebsd"></a>

从 2.3.0 版开始，ENA FreeBSD 驱动程序支持在运行 FreeBSD 的实例上收集网络性能指标。要启用 FreeBSD 指标的收集，请输入以下命令并将 {{interval}} 设置为 1 到 3600 之间的值。这将指定收集 FreeBSD 指标的频率（以秒为单位）。

```
sysctl dev.ena.{{network_interface}}.eni_metrics.sample_interval={{interval}}
```

例如，以下命令将驱动程序设置为每 10 秒在网络接口 1 上收集 FreeBSD 指标：

```
sysctl dev.ena.1.eni_metrics.sample_interval=10
```

要关闭 FreeBSD 指标收集，您可以运行上述命令并将 {{interval}} 指定为 `0`。

启用 FreeBSD 指标收集后，您可以通过运行以下命令来检索最新收集的指标集。

```
sysctl dev.ena.{{network_interface}}.eni_metrics
```
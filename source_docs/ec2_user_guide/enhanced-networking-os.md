

# 优化 EC2 Windows 实例上的网络性能
<a name="enhanced-networking-os"></a>

要在具有增强联网的 Windows 实例上实现最高网络性能，您可能需要修改默认操作系统配置。我们建议对于需要高网络性能的应用程序进行以下配置更改。官方 Windows AMI 上已经配置了其他优化（例如打开校验和卸载和启用 RSS）。

**注意**  
大多数使用情况下应禁用 TCP Chimney 分载，自 Windows Server 2016 开始已弃用该功能。

除了这些操作系统优化之外，您还应考虑网络流量的最大传输单位 (MTU)，并根据您的工作负载和网络架构相应调整。有关更多信息，请参阅[EC2 实例的网络最大传输单位 (MTU)](network_mtu.md)。

AWS 定期测量在集群置放群组中启动的实例之间的平均往返延迟，在 99.9% 的情况下该值为 50us，尾延迟为 200us。如果您的应用程序需要稳定的低延迟，建议在基于 Nitro 系统的固定性能实例上，使用最新版本的 ENA 驱动程序。

## 配置接收端缩放 CPU 关联
<a name="windows-rss-cpu-affinity"></a>

使用接收端缩放 (RSS) 在多个处理器之间分布网络流量 CPU 负载。默认情况下，Amazon 官方 Windows AMI 配置为启用 RSS。ENA 弹性网络接口最多提供 8 个 RSS 队列。通过为 RSS 队列以及其他系统进程定义 CPU 关联，可以在多核系统上分布 CPU 负载，允许处理更多的网络流量。如果实例类型上的 vCPU 超过 16 个，建议使用 `Set-NetAdapterRSS` PowerShell cmdlt，因为这会手动从所有弹性网络接口的 RSS 配置中排除启动处理器（启用超线程时为逻辑处理器 0 和 1），以防与各种系统组件争用。

Windows 具有超线程感知功能，可确保单个网络接口卡（NIC）的 RSS 队列始终位于不同的物理内核上。因此，除非禁用超线程，否则为了完全防止与其他 NIC 的争用，请将每个 NIC 的 RSS 配置分散到 16 个逻辑处理器的范围内。`Set-NetAdapterRss` cmdlet 允许您通过定义 BaseProcessorGroup、BaseProcessorNumber、MaxProcessingGroup、MaxProcessorNumber 和 NumaNode（可选）的值来定义有效逻辑处理器的各 NIC 范围。如果没有足够的物理内核来完全消除 NIC 间的争用，则尽量缩小重叠范围或减少弹性网络接口范围内的逻辑处理器数量，具体取决于接口的预期工作负载（换句话说，低容量管理网络接口可能不需要分配尽可能多的 RSS 队列）。此外，如前所述，各种组件必须在 CPU 0 上运行，因此我们建议在有足够的 vCPU 时将其从所有 RSS 配置中排除。

例如，当具有 72 个 vCPU 的实例上有 3 个弹性网络接口，其中 2 个 NUMA 节点启用了超线程时，以下命令会在两个 CPU 之间分布网络负载而不会重叠，并完全阻止内核 0 的使用。

```
Set-NetAdapterRss -Name NIC1 -BaseProcessorGroup 0 -BaseProcessorNumber 2 -MaxProcessorNumber 16 
Set-NetAdapterRss -Name NIC2 -BaseProcessorGroup 1 -BaseProcessorNumber 0 -MaxProcessorNumber 14 
Set-NetAdapterRss -Name NIC3 -BaseProcessorGroup 1 -BaseProcessorNumber 16 -MaxProcessorNumber 30
```

请注意，这些设置对每个网络适配器都是持久的。如果将实例调整为具有不同数量的 vCPU 的实例，则应重新评估启用的每个弹性网络接口的 RSS 配置。cmdlet 的完整 Microsoft 文档可在以下位置找到：[Set-NetAdapterRss](https://learn.microsoft.com/en-us/powershell/module/netadapter/set-netadapterrss)。

SQL 工作负载特别注意事项：建议检查输入/输出线程关联设置以及弹性网络接口 RSS 配置，以便最大限度地减少相同 CPU 的输入/输出和网络争用。请参阅 [Server configuration: affinity mask](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/affinity-mask-server-configuration-option)。
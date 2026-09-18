

# 使用 ENA Express 提高 EC2 实例之间的网络性能
<a name="ena-express"></a>

ENA Express 由 AWS 可扩展的可靠数据报（SRD）技术提供支持。SRD 是一种高性能网络传输协议，使用动态路由来提高吞吐量并最大限度地减少尾部延迟。使用 ENA Express，您可在同一可用区中的两个 EC2 实例之间通信，或在同一区域不同可用区中的两个 EC2 实例之间通信。

**ENA Express 的优势**
+ 将同一区域内的单个流可用最大带宽从 5 Gbps 提升到高达 25 Gbps，最大不超过实例的总计限制。
+ 减少同一可用区内 EC2 实例之间网络流量的尾部延迟，尤其是在网络高负载期间。
+ 检测并避开拥塞的网络路径。
+ 直接在网络层处理某些任务，比如接收端的数据包重新排序以及所需的大部分重传。这样可以腾出应用层用于其他工作。

**注意**  
如果您的应用程序对每秒网络数据包数的要求很高，并且需要针对非拥塞时期的延迟进行优化，那么[增强联网](enhanced-networking.md)可能更合适。
ENA Express 流量无法在本地区域中发送。
ENA Express 对跨可用区流量的支持在南美洲（圣保罗）、中东（巴林）和中东（阿联酋）区域不可用。

为实例上的网络接口挂载启用 ENA Express 后，发送实例会启动与接收实例的通信，SRD 会检测 ENA Express 是否同时在发送实例和接收实例上运行。如果 ENA Express 正在运行，则通信可以使用 SRD 传输。如果 ENA Express 未在运行，则通信将退回到标准 ENA 传输。

在网络流量较少的时段内，当数据包使用 ENA Express 时，您可能会注意到数据包中位数延迟略有增加（数十微秒）。在此期间，优先考虑特定网络性能特征的应用程序可以从 ENA Express 中受益，如下所示：
+ 同一个区域内的最大单个流带宽从 5 Gbps 提升到高达 25 Gbps（最大不超过实例的总计限制）时，进程可以从中受益。例如，如果一种特定的实例类型支持最大 12.5Gbps 的贷款，单个流的带宽上限也将是 12.5Gbps。
+ 在网络拥塞时段，同一可用区中运行时间较长的进程会减少尾部延迟。
+ 网络响应时间分配更流畅、更标准时，进程可以从中受益。

**Topics**
+ [ENA Express 的工作原理](#ena-express-how-it-works)
+ [ENA Express 支持的实例类型](#ena-express-supported-instance-types)
+ [调整 Linux 实例上 ENA Express 设置的性能](#ena-express-tune)
+ [查看 EC2 实例的 ENA Express 设置](ena-express-list-view.md)
+ [为 EC2 实例配置 ENA Express 设置](ena-express-configure.md)

## ENA Express 的工作原理
<a name="ena-express-how-it-works"></a>

ENA Express 由 AWS 可扩展的可靠数据报（SRD）技术提供支持。该技术通过不同的 AWS 网络路径为每个网络流分配数据包，并在检测到拥塞迹象时动态调整分配。它还能管理接收端的数据包重新排序。

为确保 ENA Express 能够按预期方式管理网络流量，实例的发送和接收以及实例之间的通信必须满足以下所有要求：
+ 同时支持发送和接收实例类型。有关更多信息，请参阅 [ENA Express 支持的实例类型](#ena-express-supported-instance-types) 表。
+ 发送和接收实例都必须配置 ENA Express。如配置存在差异，则可能会遇到流量默认为标准 ENA 传输的情况。以下方案显示了可能发生的情况。

  **方案：配置差异**    
[See the AWS documentation website for more details](http://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/ena-express.html)

  在这种情况下，两个实例之间的 TCP 流量可以使用 ENA Express，因为两个实例均已启用该功能。但是，由于其中一个实例不将 ENA Express 用于 UDP 流量，因此这两个实例之间通过 UDP 进行的通信则使用标准 ENA 传输。
+ 发送和接收实例必须在同一区域中运行。
+ 实例之间的网络路径不得包含中间件。ENA Express 目前不支持中间件。
+ （仅限 Linux 实例）要充分利用带宽潜力，请使用驱动程序版本 2.2.9 或更高版本。
+ （仅限 Linux 实例）要生成指标，请使用驱动程序版本 2.8 或更高版本。

如果未满足任何要求，实例将使用标准 TCP/UDP 协议，但不使用 SRD 进行通信。

为确保您的实例网络驱动程序配置为最佳性能，请查看 ENA 驱动程序的最佳实践推荐。这些最佳实践同样适用于 ENA Express。有关更多信息，请参阅 GitHub 网站上的 [ENA Linux Driver Best Practices and Performance Optimization Guide](https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/ena/ENA_Linux_Best_Practices.rst)（ENA Linux 驱动程序最佳实践和性能优化指南）。

**注意**  
Amazon EC2 是指实例与作为*附件*附加到该实例的网络接口之间的关系。ENA Express 设置适用于该附件。如果网络接口从实例中分离，则该附件将不再存在，应用于它的 ENA Express 设置将不再生效。终止实例时也是如此，即使网络接口仍然存在。

在为发送和接收实例上的网络接口附件启用 ENA Express 后，您可以使用 ENA Express 指标来帮助确保实例充分利用 SRD 技术所提供的性能改进。有关 ENA Express 指标的更多信息，请参阅 [ENA Express 指标](monitoring-network-performance-ena.md#network-performance-metrics-ena-express)。

## ENA Express 支持的实例类型
<a name="ena-express-supported-instance-types"></a>

以下实例类型支持 ENA Express。

------
#### [ General purpose ]


| 实例类型 | 架构 | 
| --- | --- | 
| m6a.12xlarge | x86\_64 | 
| m6a.16xlarge | x86\_64 | 
| m6a.24xlarge | x86\_64 | 
| m6a.32xlarge | x86\_64 | 
| m6a.48xlarge | x86\_64 | 
| m6a.metal | x86\_64 | 
| m6i.8xlarge | x86\_64 | 
| m6i.12xlarge | x86\_64 | 
| m6i.16xlarge | x86\_64 | 
| m6i.24xlarge | x86\_64 | 
| m6i.32xlarge | x86\_64 | 
| m6i.metal | x86\_64 | 
| m6id.8xlarge | x86\_64 | 
| m6id.12xlarge | x86\_64 | 
| m6id.16xlarge | x86\_64 | 
| m6id.24xlarge | x86\_64 | 
| m6id.32xlarge | x86\_64 | 
| m6id.metal | x86\_64 | 
| m6idn.8xlarge | x86\_64 | 
| m6idn.12xlarge | x86\_64 | 
| m6idn.16xlarge | x86\_64 | 
| m6idn.24xlarge | x86\_64 | 
| m6idn.32xlarge | x86\_64 | 
| m6idn.metal | x86\_64 | 
| m6in.8xlarge | x86\_64 | 
| m6in.12xlarge | x86\_64 | 
| m6in.16xlarge | x86\_64 | 
| m6in.24xlarge | x86\_64 | 
| m6in.32xlarge | x86\_64 | 
| m6in.metal | x86\_64 | 
| m7a.12xlarge | x86\_64 | 
| m7a.16xlarge | x86\_64 | 
| m7a.24xlarge | x86\_64 | 
| m7a.32xlarge | x86\_64 | 
| m7a.48xlarge | x86\_64 | 
| m7a.metal-48xl | x86\_64 | 
| m7g.12xlarge | arm64 | 
| m7g.16xlarge | arm64 | 
| m7g.metal | arm64 | 
| m7gd.12xlarge | arm64 | 
| m7gd.16xlarge | arm64 | 
| m7gd.metal | arm64 | 
| m7i.12xlarge | x86\_64 | 
| m7i.16xlarge | x86\_64 | 
| m7i.24xlarge | x86\_64 | 
| m7i.48xlarge | x86\_64 | 
| m7i.metal-24xl | x86\_64 | 
| m7i.metal-48xl | x86\_64 | 
| m8a.16xlarge | x86\_64 | 
| m8a.24xlarge | x86\_64 | 
| m8a.48xlarge | x86\_64 | 
| m8a.metal-24xl | x86\_64 | 
| m8a.metal-48xl | x86\_64 | 
| m8azn.12xlarge | x86\_64 | 
| m8azn.24xlarge | x86\_64 | 
| m8azn.metal-12xl | x86\_64 | 
| m8azn.metal-24xl | x86\_64 | 
| m8g.8xlarge | arm64 | 
| m8g.12xlarge | arm64 | 
| m8g.16xlarge | arm64 | 
| m8g.24xlarge | arm64 | 
| m8g.48xlarge | arm64 | 
| m8g.metal-24xl | arm64 | 
| m8g.metal-48xl | arm64 | 
| m8gb.4xlarge | arm64 | 
| m8gb.8xlarge | arm64 | 
| m8gb.12xlarge | arm64 | 
| m8gb.16xlarge | arm64 | 
| m8gb.24xlarge | arm64 | 
| m8gb.48xlarge | arm64 | 
| m8gb.metal-24xl | arm64 | 
| m8gb.metal-48xl | arm64 | 
| m8gd.8xlarge | arm64 | 
| m8gd.12xlarge | arm64 | 
| m8gd.16xlarge | arm64 | 
| m8gd.24xlarge | arm64 | 
| m8gd.48xlarge | arm64 | 
| m8gd.metal-24xl | arm64 | 
| m8gd.metal-48xl | arm64 | 
| m8gn.4xlarge | arm64 | 
| m8gn.8xlarge | arm64 | 
| m8gn.12xlarge | arm64 | 
| m8gn.16xlarge | arm64 | 
| m8gn.24xlarge | arm64 | 
| m8gn.48xlarge | arm64 | 
| m8gn.metal-24xl | arm64 | 
| m8gn.metal-48xl | arm64 | 
| m8i.8xlarge | x86\_64 | 
| m8i.12xlarge | x86\_64 | 
| m8i.16xlarge | x86\_64 | 
| m8i.24xlarge | x86\_64 | 
| m8i.32xlarge | x86\_64 | 
| m8i.48xlarge | x86\_64 | 
| m8i.96xlarge | x86\_64 | 
| m8i.metal-48xl | x86\_64 | 
| m8i.metal-96xl | x86\_64 | 
| m8id.8xlarge | x86\_64 | 
| m8id.12xlarge | x86\_64 | 
| m8id.16xlarge | x86\_64 | 
| m8id.24xlarge | x86\_64 | 
| m8id.32xlarge | x86\_64 | 
| m8id.48xlarge | x86\_64 | 
| m8id.96xlarge | x86\_64 | 
| m8id.metal-48xl | x86\_64 | 
| m8id.metal-96xl | x86\_64 | 
| m8in.8xlarge | x86\_64 | 
| m8in.12xlarge | x86\_64 | 
| m8in.16xlarge | x86\_64 | 
| m8in.24xlarge | x86\_64 | 
| m8in.32xlarge | x86\_64 | 
| m8in.48xlarge | x86\_64 | 
| m8in.96xlarge | x86\_64 | 
| m8in.metal-48xl | x86\_64 | 
| m8in.metal-96xl | x86\_64 | 
| m8idn.8xlarge | x86\_64 | 
| m8idn.12xlarge | x86\_64 | 
| m8idn.16xlarge | x86\_64 | 
| m8idn.24xlarge | x86\_64 | 
| m8idn.32xlarge | x86\_64 | 
| m8idn.48xlarge | x86\_64 | 
| m8idn.96xlarge | x86\_64 | 
| m8idn.metal-48xl | x86\_64 | 
| m8idn.metal-96xl | x86\_64 | 
| m8ib.8xlarge | x86\_64 | 
| m8ib.12xlarge | x86\_64 | 
| m8ib.16xlarge | x86\_64 | 
| m8ib.24xlarge | x86\_64 | 
| m8ib.32xlarge | x86\_64 | 
| m8ib.48xlarge | x86\_64 | 
| m8ib.96xlarge | x86\_64 | 
| m8ib.metal-48xl | x86\_64 | 
| m8ib.metal-96xl | x86\_64 | 
| m8idb.8xlarge | x86\_64 | 
| m8idb.12xlarge | x86\_64 | 
| m8idb.16xlarge | x86\_64 | 
| m8idb.24xlarge | x86\_64 | 
| m8idb.32xlarge | x86\_64 | 
| m8idb.48xlarge | x86\_64 | 
| m8idb.96xlarge | x86\_64 | 
| m8idb.metal-48xl | x86\_64 | 
| m8idb.metal-96xl | x86\_64 | 
| m9g.8xlarge | arm64 | 
| m9g.12xlarge | arm64 | 
| m9g.16xlarge | arm64 | 
| m9g.24xlarge | arm64 | 
| m9g.48xlarge | arm64 | 
| m9g.metal-48xl | arm64 | 
| m9gd.8xlarge | arm64 | 
| m9gd.12xlarge | arm64 | 
| m9gd.16xlarge | arm64 | 
| m9gd.24xlarge | arm64 | 
| m9gd.48xlarge | arm64 | 
| m9gd.metal-48xl | arm64 | 

------
#### [ Compute optimized ]


| 实例类型 | 架构 | 
| --- | --- | 
| c6a.12xlarge | x86\_64 | 
| c6a.16xlarge | x86\_64 | 
| c6a.24xlarge | x86\_64 | 
| c6a.32xlarge | x86\_64 | 
| c6a.48xlarge | x86\_64 | 
| c6a.metal | x86\_64 | 
| c6gn.4xlarge | arm64 | 
| c6gn.8xlarge | arm64 | 
| c6gn.12xlarge | arm64 | 
| c6gn.16xlarge | arm64 | 
| c6i.8xlarge | x86\_64 | 
| c6i.12xlarge | x86\_64 | 
| c6i.16xlarge | x86\_64 | 
| c6i.24xlarge | x86\_64 | 
| c6i.32xlarge | x86\_64 | 
| c6i.metal | x86\_64 | 
| c6id.8xlarge | x86\_64 | 
| c6id.12xlarge | x86\_64 | 
| c6id.16xlarge | x86\_64 | 
| c6id.24xlarge | x86\_64 | 
| c6id.32xlarge | x86\_64 | 
| c6id.metal | x86\_64 | 
| c6in.8xlarge | x86\_64 | 
| c6in.12xlarge | x86\_64 | 
| c6in.16xlarge | x86\_64 | 
| c6in.24xlarge | x86\_64 | 
| c6in.32xlarge | x86\_64 | 
| c6in.metal | x86\_64 | 
| c7a.12xlarge | x86\_64 | 
| c7a.16xlarge | x86\_64 | 
| c7a.24xlarge | x86\_64 | 
| c7a.32xlarge | x86\_64 | 
| c7a.48xlarge | x86\_64 | 
| c7a.metal-48xl | x86\_64 | 
| c7g.12xlarge | arm64 | 
| c7g.16xlarge | arm64 | 
| c7g.metal | arm64 | 
| c7gd.12xlarge | arm64 | 
| c7gd.16xlarge | arm64 | 
| c7gd.metal | arm64 | 
| c7gn.4xlarge | arm64 | 
| c7gn.8xlarge | arm64 | 
| c7gn.12xlarge | arm64 | 
| c7gn.16xlarge | arm64 | 
| c7gn.metal | arm64 | 
| c7i.12xlarge | x86\_64 | 
| c7i.16xlarge | x86\_64 | 
| c7i.24xlarge | x86\_64 | 
| c7i.48xlarge | x86\_64 | 
| c7i.metal-24xl | x86\_64 | 
| c7i.metal-48xl | x86\_64 | 
| c8a.16xlarge | x86\_64 | 
| c8a.24xlarge | x86\_64 | 
| c8a.48xlarge | x86\_64 | 
| c8a.metal-24xl | x86\_64 | 
| c8a.metal-48xl | x86\_64 | 
| c8g.8xlarge | arm64 | 
| c8g.12xlarge | arm64 | 
| c8g.16xlarge | arm64 | 
| c8g.24xlarge | arm64 | 
| c8g.48xlarge | arm64 | 
| c8g.metal-24xl | arm64 | 
| c8g.metal-48xl | arm64 | 
| c8gb.4xlarge | arm64 | 
| c8gb.8xlarge | arm64 | 
| c8gb.12xlarge | arm64 | 
| c8gb.16xlarge | arm64 | 
| c8gb.24xlarge | arm64 | 
| c8gb.48xlarge | arm64 | 
| c8gb.metal-24xl | arm64 | 
| c8gb.metal-48xl | arm64 | 
| c8gd.8xlarge | arm64 | 
| c8gd.12xlarge | arm64 | 
| c8gd.16xlarge | arm64 | 
| c8gd.24xlarge | arm64 | 
| c8gd.48xlarge | arm64 | 
| c8gd.metal-24xl | arm64 | 
| c8gd.metal-48xl | arm64 | 
| c8gn.4xlarge | arm64 | 
| c8gn.8xlarge | arm64 | 
| c8gn.12xlarge | arm64 | 
| c8gn.16xlarge | arm64 | 
| c8gn.24xlarge | arm64 | 
| c8gn.48xlarge | arm64 | 
| c8gn.metal-24xl | arm64 | 
| c8gn.metal-48xl | arm64 | 
| c8i.8xlarge | x86\_64 | 
| c8i.12xlarge | x86\_64 | 
| c8i.16xlarge | x86\_64 | 
| c8i.24xlarge | x86\_64 | 
| c8i.32xlarge | x86\_64 | 
| c8i.48xlarge | x86\_64 | 
| c8i.96xlarge | x86\_64 | 
| c8i.metal-48xl | x86\_64 | 
| c8i.metal-96xl | x86\_64 | 
| c8id.8xlarge | x86\_64 | 
| c8id.12xlarge | x86\_64 | 
| c8id.16xlarge | x86\_64 | 
| c8id.24xlarge | x86\_64 | 
| c8id.32xlarge | x86\_64 | 
| c8id.48xlarge | x86\_64 | 
| c8id.96xlarge | x86\_64 | 
| c8id.metal-48xl | x86\_64 | 
| c8id.metal-96xl | x86\_64 | 
| c8in.8xlarge | x86\_64 | 
| c8in.12xlarge | x86\_64 | 
| c8in.16xlarge | x86\_64 | 
| c8in.24xlarge | x86\_64 | 
| c8in.32xlarge | x86\_64 | 
| c8in.48xlarge | x86\_64 | 
| c8in.96xlarge | x86\_64 | 
| c8in.metal-48xl | x86\_64 | 
| c8in.metal-96xl | x86\_64 | 
| c8ib.8xlarge | x86\_64 | 
| c8ib.12xlarge | x86\_64 | 
| c8ib.16xlarge | x86\_64 | 
| c8ib.24xlarge | x86\_64 | 
| c8ib.32xlarge | x86\_64 | 
| c8ib.48xlarge | x86\_64 | 
| c8ib.96xlarge | x86\_64 | 
| c8ib.metal-48xl | x86\_64 | 
| c8ib.metal-96xl | x86\_64 | 
| c9g.8xlarge | arm64 | 
| c9g.12xlarge | arm64 | 
| c9g.16xlarge | arm64 | 
| c9g.24xlarge | arm64 | 
| c9g.48xlarge | arm64 | 
| c9g.metal-48xl | arm64 | 
| c9gd.8xlarge | arm64 | 
| c9gd.12xlarge | arm64 | 
| c9gd.16xlarge | arm64 | 
| c9gd.24xlarge | arm64 | 
| c9gd.48xlarge | arm64 | 
| c9gd.metal-48xl | arm64 | 

------
#### [ Memory optimized ]


| 实例类型 | 架构 | 
| --- | --- | 
| r6a.12xlarge | x86\_64 | 
| r6a.16xlarge | x86\_64 | 
| r6a.24xlarge | x86\_64 | 
| r6a.32xlarge | x86\_64 | 
| r6a.48xlarge | x86\_64 | 
| r6a.metal | x86\_64 | 
| r6i.8xlarge | x86\_64 | 
| r6i.12xlarge | x86\_64 | 
| r6i.16xlarge | x86\_64 | 
| r6i.24xlarge | x86\_64 | 
| r6i.32xlarge | x86\_64 | 
| r6i.metal | x86\_64 | 
| r6id.8xlarge | x86\_64 | 
| r6id.12xlarge | x86\_64 | 
| r6id.16xlarge | x86\_64 | 
| r6id.24xlarge | x86\_64 | 
| r6id.32xlarge | x86\_64 | 
| r6id.metal | x86\_64 | 
| r6idn.8xlarge | x86\_64 | 
| r6idn.12xlarge | x86\_64 | 
| r6idn.16xlarge | x86\_64 | 
| r6idn.24xlarge | x86\_64 | 
| r6idn.32xlarge | x86\_64 | 
| r6idn.metal | x86\_64 | 
| r6in.8xlarge | x86\_64 | 
| r6in.12xlarge | x86\_64 | 
| r6in.16xlarge | x86\_64 | 
| r6in.24xlarge | x86\_64 | 
| r6in.32xlarge | x86\_64 | 
| r6in.metal | x86\_64 | 
| r7a.12xlarge | x86\_64 | 
| r7a.16xlarge | x86\_64 | 
| r7a.24xlarge | x86\_64 | 
| r7a.32xlarge | x86\_64 | 
| r7a.48xlarge | x86\_64 | 
| r7a.metal-48xl | x86\_64 | 
| r7g.12xlarge | arm64 | 
| r7g.16xlarge | arm64 | 
| r7g.metal | arm64 | 
| r7gd.12xlarge | arm64 | 
| r7gd.16xlarge | arm64 | 
| r7gd.metal | arm64 | 
| r7i.12xlarge | x86\_64 | 
| r7i.16xlarge | x86\_64 | 
| r7i.24xlarge | x86\_64 | 
| r7i.48xlarge | x86\_64 | 
| r7i.metal-24xl | x86\_64 | 
| r7i.metal-48xl | x86\_64 | 
| r7iz.8xlarge | x86\_64 | 
| r7iz.12xlarge | x86\_64 | 
| r7iz.16xlarge | x86\_64 | 
| r7iz.32xlarge | x86\_64 | 
| r7iz.metal-16xl | x86\_64 | 
| r7iz.metal-32xl | x86\_64 | 
| r8a.16xlarge | x86\_64 | 
| r8a.24xlarge | x86\_64 | 
| r8a.48xlarge | x86\_64 | 
| r8a.metal-24xl | x86\_64 | 
| r8a.metal-48xl | x86\_64 | 
| r8g.8xlarge | arm64 | 
| r8g.12xlarge | arm64 | 
| r8g.16xlarge | arm64 | 
| r8g.24xlarge | arm64 | 
| r8g.48xlarge | arm64 | 
| r8g.metal-24xl | arm64 | 
| r8g.metal-48xl | arm64 | 
| r8gb.4xlarge | arm64 | 
| r8gb.8xlarge | arm64 | 
| r8gb.12xlarge | arm64 | 
| r8gb.16xlarge | arm64 | 
| r8gb.24xlarge | arm64 | 
| r8gb.48xlarge | arm64 | 
| r8gb.metal-24xl | arm64 | 
| r8gb.metal-48xl | arm64 | 
| r8gd.8xlarge | arm64 | 
| r8gd.12xlarge | arm64 | 
| r8gd.16xlarge | arm64 | 
| r8gd.24xlarge | arm64 | 
| r8gd.48xlarge | arm64 | 
| r8gd.metal-24xl | arm64 | 
| r8gd.metal-48xl | arm64 | 
| r8gn.4xlarge | arm64 | 
| r8gn.8xlarge | arm64 | 
| r8gn.12xlarge | arm64 | 
| r8gn.16xlarge | arm64 | 
| r8gn.24xlarge | arm64 | 
| r8gn.48xlarge | arm64 | 
| r8gn.metal-24xl | arm64 | 
| r8gn.metal-48xl | arm64 | 
| r8i.8xlarge | x86\_64 | 
| r8i.12xlarge | x86\_64 | 
| r8i.16xlarge | x86\_64 | 
| r8i.24xlarge | x86\_64 | 
| r8i.32xlarge | x86\_64 | 
| r8i.48xlarge | x86\_64 | 
| r8i.96xlarge | x86\_64 | 
| r8i.metal-48xl | x86\_64 | 
| r8i.metal-96xl | x86\_64 | 
| r8id.8xlarge | x86\_64 | 
| r8id.12xlarge | x86\_64 | 
| r8id.16xlarge | x86\_64 | 
| r8id.24xlarge | x86\_64 | 
| r8id.32xlarge | x86\_64 | 
| r8id.48xlarge | x86\_64 | 
| r8id.96xlarge | x86\_64 | 
| r8id.metal-48xl | x86\_64 | 
| r8id.metal-96xl | x86\_64 | 
| r8in.8xlarge | x86\_64 | 
| r8in.12xlarge | x86\_64 | 
| r8in.16xlarge | x86\_64 | 
| r8in.24xlarge | x86\_64 | 
| r8in.32xlarge | x86\_64 | 
| r8in.48xlarge | x86\_64 | 
| r8in.96xlarge | x86\_64 | 
| r8in.metal-48xl | x86\_64 | 
| r8in.metal-96xl | x86\_64 | 
| r8idn.8xlarge | x86\_64 | 
| r8idn.12xlarge | x86\_64 | 
| r8idn.16xlarge | x86\_64 | 
| r8idn.24xlarge | x86\_64 | 
| r8idn.32xlarge | x86\_64 | 
| r8idn.48xlarge | x86\_64 | 
| r8idn.96xlarge | x86\_64 | 
| r8idn.metal-48xl | x86\_64 | 
| r8idn.metal-96xl | x86\_64 | 
| r8ib.8xlarge | x86\_64 | 
| r8ib.12xlarge | x86\_64 | 
| r8ib.16xlarge | x86\_64 | 
| r8ib.24xlarge | x86\_64 | 
| r8ib.32xlarge | x86\_64 | 
| r8ib.48xlarge | x86\_64 | 
| r8ib.96xlarge | x86\_64 | 
| r8ib.metal-48xl | x86\_64 | 
| r8ib.metal-96xl | x86\_64 | 
| r8idb.8xlarge | x86\_64 | 
| r8idb.12xlarge | x86\_64 | 
| r8idb.16xlarge | x86\_64 | 
| r8idb.24xlarge | x86\_64 | 
| r8idb.32xlarge | x86\_64 | 
| r8idb.48xlarge | x86\_64 | 
| r8idb.96xlarge | x86\_64 | 
| r8idb.metal-48xl | x86\_64 | 
| r8idb.metal-96xl | x86\_64 | 
| r9g.8xlarge | arm64 | 
| r9g.12xlarge | arm64 | 
| r9g.16xlarge | arm64 | 
| r9g.24xlarge | arm64 | 
| r9g.48xlarge | arm64 | 
| r9g.metal-48xl | arm64 | 
| r9gd.8xlarge | arm64 | 
| r9gd.12xlarge | arm64 | 
| r9gd.16xlarge | arm64 | 
| r9gd.24xlarge | arm64 | 
| r9gd.48xlarge | arm64 | 
| r9gd.metal-48xl | arm64 | 
| u7i-6tb.112xlarge | x86\_64 | 
| u7i-8tb.112xlarge | x86\_64 | 
| u7i-12tb.224xlarge | x86\_64 | 
| u7in-16tb.224xlarge | x86\_64 | 
| u7in-24tb.224xlarge | x86\_64 | 
| u7in-32tb.224xlarge | x86\_64 | 
| u7inh-32tb.480xlarge | x86\_64 | 
| x2idn.16xlarge | x86\_64 | 
| x2idn.24xlarge | x86\_64 | 
| x2idn.32xlarge | x86\_64 | 
| x2idn.metal | x86\_64 | 
| x2iedn.8xlarge | x86\_64 | 
| x2iedn.16xlarge | x86\_64 | 
| x2iedn.24xlarge | x86\_64 | 
| x2iedn.32xlarge | x86\_64 | 
| x2iedn.metal | x86\_64 | 
| x8g.8xlarge | arm64 | 
| x8g.12xlarge | arm64 | 
| x8g.16xlarge | arm64 | 
| x8g.24xlarge | arm64 | 
| x8g.48xlarge | arm64 | 
| x8g.metal-24xl | arm64 | 
| x8g.metal-48xl | arm64 | 
| x8aedz.24xlarge | x86\_64 | 
| x8aedz.metal-24xl | x86\_64 | 
| x8i.8xlarge | x86\_64 | 
| x8i.12xlarge | x86\_64 | 
| x8i.16xlarge | x86\_64 | 
| x8i.24xlarge | x86\_64 | 
| x8i.32xlarge | x86\_64 | 
| x8i.48xlarge | x86\_64 | 
| x8i.64xlarge | x86\_64 | 
| x8i.96xlarge | x86\_64 | 
| x8i.metal-48xl | x86\_64 | 
| x8i.metal-96xl | x86\_64 | 

------
#### [ Accelerated computing ]


| 实例类型 | 架构 | 
| --- | --- | 
| g6.48xlarge | x86\_64 | 
| g6e.12xlarge | x86\_64 | 
| g6e.24xlarge | x86\_64 | 
| g6e.48xlarge | x86\_64 | 
| g7.24xlarge | x86\_64 | 
| g7.48xlarge | x86\_64 | 
| g7e.12xlarge | x86\_64 | 
| g7e.24xlarge | x86\_64 | 
| g7e.48xlarge | x86\_64 | 
| p5.4xlarge | x86\_64 | 
| p5.48xlarge | x86\_64 | 
| p5e.48xlarge | x86\_64 | 
| p5en.48xlarge | x86\_64 | 
| p6-b200.48xlarge | x86\_64 | 
| p6-b300.48xlarge | x86\_64 | 
| p6e-gb200.36xlarge | arm64 | 

------
#### [ Storage optimized ]


| 实例类型 | 架构 | 
| --- | --- | 
| i4g.4xlarge | arm64 | 
| i4g.8xlarge | arm64 | 
| i4g.16xlarge | arm64 | 
| i4i.8xlarge | x86\_64 | 
| i4i.12xlarge | x86\_64 | 
| i4i.16xlarge | x86\_64 | 
| i4i.24xlarge | x86\_64 | 
| i4i.32xlarge | x86\_64 | 
| i4i.metal | x86\_64 | 
| i7i.12xlarge | x86\_64 | 
| i7i.16xlarge | x86\_64 | 
| i7i.24xlarge | x86\_64 | 
| i7i.48xlarge | x86\_64 | 
| i7i.metal-24xl | x86\_64 | 
| i7i.metal-48xl | x86\_64 | 
| i7ie.6xlarge | x86\_64 | 
| i7ie.12xlarge | x86\_64 | 
| i7ie.18xlarge | x86\_64 | 
| i7ie.24xlarge | x86\_64 | 
| i7ie.48xlarge | x86\_64 | 
| i7ie.metal-24xl | x86\_64 | 
| i7ie.metal-48xl | x86\_64 | 
| i8g.8xlarge | arm64 | 
| i8g.12xlarge | arm64 | 
| i8g.16xlarge | arm64 | 
| i8g.24xlarge | arm64 | 
| i8g.48xlarge | arm64 | 
| i8g.metal-24xl | arm64 | 
| i8g.metal-48xl | arm64 | 
| i8ge.6xlarge | arm64 | 
| i8ge.12xlarge | arm64 | 
| i8ge.18xlarge | arm64 | 
| i8ge.24xlarge | arm64 | 
| i8ge.48xlarge | arm64 | 
| i8ge.metal-24xl | arm64 | 
| i8ge.metal-48xl | arm64 | 
| im4gn.4xlarge | arm64 | 
| im4gn.8xlarge | arm64 | 
| im4gn.16xlarge | arm64 | 

------

## 调整 Linux 实例上 ENA Express 设置的性能
<a name="ena-express-tune"></a>

为确保 ENA Express 能够有效运行，您的 Linux 实例必须满足多项网络配置要求。

您可以从 Amazon GitHub 存储库下载并运行 ENA Express 设置检查脚本，不必手动配置各项设置。该脚本可根据 ENA Express 的必要设置和建议设置来验证您的实例，并输出确切的命令以修复脚本发现的任何问题。

[https://github.com/amzn/amzn-ec2-ena-utilities/blob/main/ena-express/check-ena-express-settings.sh](https://github.com/amzn/amzn-ec2-ena-utilities/blob/main/ena-express/check-ena-express-settings.sh)

该脚本可检查以下设置和配置：
+ **MTU 大小**：ENA Express 需要 MTU 低于默认值才能容纳额外的 AWS SRD 标头。新建立的 TCP 连接会自动限制 MSS 以缓解此问题，但 UDP 流量仍需要较低的 MTU。
+ **TCP 输出队列大小限制**：检查每个套接字的传输中字节限制是否足以维持高吞吐量。网络延迟较高的环境需要更高的限制。
+ **字节队列限制**：确认是否在网络接口上禁用了字节队列限制（BQL）。BQL 会限制排队等候设备级传输的数据量，从而限制 ENA Express 的性能。
**注意**  
默认情况下，Amazon Linux 发行版的 ENA 驱动程序会禁用字节队列限制。
+ **TCP 自动阻塞**：检查 TCP 自动阻塞是否已禁用。禁用自动阻塞可以减少某些 ENA Express TCP 流量模式（例如请求-响应工作负载）的延迟。这可能会导致数据包处理开销增加幅度很小。
+ **TX 队列大小和大型低延迟队列**：验证网络接口的发送队列大小是否足以实现最佳性能。该脚本还会检查 ENA 模块参数是否明确禁用大型低延迟队列（Large LLQ）功能，因为该功能会减少可用的 TX 队列深度。有关大型低延迟队列及其对 TX 队列大小的影响的更多信息，请参阅 GitHub 上的 [Large Low Latency Queue (Large LLQ)](https://github.com/amzn/amzn-drivers/tree/master/kernel/linux/ena#large-low-latency-queue-large-llq)。
+ **RX 队列大小**：检查网络接口的接收环形缓冲区大小是否足以高效处理传入流量并避免在负载下丢包。
+ **TCP 和网络套接字缓冲区大小**：验证 TCP 接收和发送缓冲区的最大大小，以及核心网络套接字缓冲区的默认值和最大值是否足以维持高吞吐量。这些设置在网络延迟较高的环境中非常重要，在此类环境中，需要更大的缓冲区才能充分使用连接。
+ **TCP 拥塞控制**：验证 TCP 拥塞控制配置是否经过优化，可在网络延迟较高的环境中与 ENA Express 配合使用。

该脚本还会报告其他诊断信息，包括 ENA 驱动程序版本、ENA SRD 统计信息、中断裁决设置、队列配置和套接字缓冲区大小。此信息对于 ENA Express 性能的问题排查非常有用。

为确保您的实例网络驱动程序配置为最佳性能，另请参阅 GitHub 上的 [ENA Linux Driver Best Practices and Performance Optimization Guide](https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/ena/ENA_Linux_Best_Practices.rst)。
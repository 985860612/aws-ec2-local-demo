

# Amazon EBS 优化的实例类型
<a name="ebs-optimized"></a>

Amazon EBS 优化的实例使用经过优化的配置堆栈，并为 Amazon EBS I/O 提供额外的专用带宽。这种优化通过最小化 Amazon EBS I/O 与来自您实例的其他流量之间的争用，为您的 EBS 卷提供最佳性能。

当附加到 EBS 优化的实例时，通用型 SSD（`gp2` 和 `gp3`）卷可在给定年度 99% 的时间内提供至少 90% 的预调配 IOPS 性能，而预调配 IOPS SSD（`io1` 和 `io2`）卷可在给定年度 99.9% 的时间内提供至少 90% 的预调配 IOPS 性能。吞吐量优化型 HDD（`st1`）和冷 HDD（`sc1`）在给定年度 99％ 的时间内提供至少 90% 的预期吞吐量性能。不合规时间段大致均匀分布，目标是达到 99% 的每小时预计总吞吐量。有关更多信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 卷类型](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html)。

某些实例类型**默认为 EBS 优化**，无需启用，尝试禁用也不会有任何影响。其他实例类型可选**支持 EBS 优化**，您可以在启动期间或之后启用该功能，但需[额外支付每小时费用](https://aws.amazon.com/ec2/previous-generation/#EBS-optimized_instances)。某些实例类型不支持 EBS 优化。

有关详细的实例类型规范和功能，请参阅 [Amazon EC2 实例类型指南](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html)。

**注意事项**
+ 实例的 EBS 性能受实例类型的性能限制或其附加卷的聚合性能的限制，以较小者为准。要实现最大的 EBS 性能，实例必须附加卷以提供等于或大于最大实例性能的总性能。例如，要实现 `r6i.16xlarge` 的 `80,000` IOPS，实例必须至少具有预置了 `16,000` IOPS 的 `5` 个 `gp2` 卷（`5` 个卷 x `16,000` IOPS = `80,000` IOPS），或具有预置了 `80,000` IOPS 的 `1` 个 `gp3` 卷。建议您选择一种实例类型，其提供的专用 Amazon EBS 吞吐量高于您的应用程序需求；否则，Amazon EBS 与 Amazon EC2 的连接将成为性能瓶颈。
+ 您可以挂载到实例的最大 Amazon EBS 卷数取决于实例类型和实例规模。有关更多信息，请参阅 [Amazon EC2 实例的 Amazon EBS 卷限制](volume_limits.md)。
+ 最大 IOPS 和吞吐量限制是相互依赖的。根据您的 I/O 大小，您可能会先达到一个限制，然后再达到另一个限制，这可能会影响整体性能。为获得最佳结果，请在计划工作负载时同时考虑这两个限制。

## 默认为 EBS 优化
<a name="current"></a>

以下实例类型在默认情况下会进行 EBS 优化。无需启用 EBS 优化，禁用 EBS 优化也没有效果。

**Topics**
+ [通用型](#current-general-purpose)
+ [计算优化型](#current-compute-optimized)
+ [内存优化型](#current-memory-optimized)
+ [存储优化](#current-storage-optimized)
+ [加速计算型](#current-accelerated-computing)
+ [高性能计算](#current-high-performance-computing)

### 通用型
<a name="current-general-purpose"></a>

**注意**  
M8a、M8g、M8gd、M8i、M8id、M8i-flex、M9g、M9gd 实例类型支持可配置的带宽权重。使用这些实例类型，您可以针对网络性能或 Amazon EBS 性能优化实例的带宽。下表显示了这些实例类型的默认 Amazon EBS 带宽性能。有关更多信息，请参阅 [EC2 实例带宽权重配置](configure-bandwidth-weighting.md)。


<table>
<thead>
  <tr><th>实例大小</th><th>基准带宽（Mbps）</th><th>最大带宽（Mbps）</th><th>基准吞吐量（MB/s，128 KiB I/O）</th><th>最大吞吐量（MB/s，128 KiB I/O）</th><th>基准 IOPS（16KiB I/O）</th><th>最大 IOPS（16KiB I/O）</th></tr>
</thead>
<tbody>
  <tr><td>a1.medium 1</td><td>300</td><td>3500</td><td>37.50</td><td>437.50</td><td>2500</td><td>20000</td></tr>
  <tr><td>a1.large 1</td><td>525</td><td>3500</td><td>65.62</td><td>437.50</td><td>4000</td><td>20000</td></tr>
  <tr><td>a1.xlarge 1</td><td>800</td><td>3500</td><td>100.00</td><td>437.50</td><td>6000</td><td>20000</td></tr>
  <tr><td>a1.2xlarge 1</td><td>1750</td><td>3500</td><td>218.75</td><td>437.50</td><td>10000</td><td>20000</td></tr>
  <tr><td>a1.4xlarge 2</td><td colspan="2">3500</td><td colspan="2">437.5</td><td colspan="2">20000</td></tr>
  <tr><td>a1.metal 2</td><td colspan="2">3500</td><td colspan="2">437.5</td><td colspan="2">20000</td></tr>
  <tr><td>m4.large 2</td><td colspan="2">450</td><td colspan="2">56.25</td><td colspan="2">3600</td></tr>
  <tr><td>m4.xlarge 2</td><td colspan="2">750</td><td colspan="2">93.75</td><td colspan="2">6000</td></tr>
  <tr><td>m4.2xlarge 2</td><td colspan="2">1000</td><td colspan="2">125.0</td><td colspan="2">8000</td></tr>
  <tr><td>m4.4xlarge 2</td><td colspan="2">2000</td><td colspan="2">250.0</td><td colspan="2">16000</td></tr>
  <tr><td>m4.10xlarge 2</td><td colspan="2">4000</td><td colspan="2">500.0</td><td colspan="2">32000</td></tr>
  <tr><td>m4.16xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">65000</td></tr>
  <tr><td>m5.large 1</td><td>650</td><td>4750</td><td>81.25</td><td>593.75</td><td>3600</td><td>18750</td></tr>
  <tr><td>m5.xlarge 1</td><td>1150</td><td>4750</td><td>143.75</td><td>593.75</td><td>6000</td><td>18750</td></tr>
  <tr><td>m5.2xlarge 1</td><td>2300</td><td>4750</td><td>287.50</td><td>593.75</td><td>12000</td><td>18750</td></tr>
  <tr><td>m5.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">18750</td></tr>
  <tr><td>m5.8xlarge 2</td><td colspan="2">6800</td><td colspan="2">850.0</td><td colspan="2">30000</td></tr>
  <tr><td>m5.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>m5.16xlarge 2</td><td colspan="2">13600</td><td colspan="2">1700.0</td><td colspan="2">60000</td></tr>
  <tr><td>m5.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m5.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m5a.large 1</td><td>650</td><td>2880</td><td>81.25</td><td>360.00</td><td>3600</td><td>16000</td></tr>
  <tr><td>m5a.xlarge 1</td><td>1085</td><td>2880</td><td>135.62</td><td>360.00</td><td>6000</td><td>16000</td></tr>
  <tr><td>m5a.2xlarge 1</td><td>1580</td><td>2880</td><td>197.50</td><td>360.00</td><td>8333</td><td>16000</td></tr>
  <tr><td>m5a.4xlarge 2</td><td colspan="2">2880</td><td colspan="2">360.0</td><td colspan="2">16000</td></tr>
  <tr><td>m5a.8xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>m5a.12xlarge 2</td><td colspan="2">6780</td><td colspan="2">847.5</td><td colspan="2">30000</td></tr>
  <tr><td>m5a.16xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>m5a.24xlarge 2</td><td colspan="2">13750</td><td colspan="2">1718.75</td><td colspan="2">60000</td></tr>
  <tr><td>m5ad.large 1</td><td>650</td><td>2880</td><td>81.25</td><td>360.00</td><td>3600</td><td>16000</td></tr>
  <tr><td>m5ad.xlarge 1</td><td>1085</td><td>2880</td><td>135.62</td><td>360.00</td><td>6000</td><td>16000</td></tr>
  <tr><td>m5ad.2xlarge 1</td><td>1580</td><td>2880</td><td>197.50</td><td>360.00</td><td>8333</td><td>16000</td></tr>
  <tr><td>m5ad.4xlarge 2</td><td colspan="2">2880</td><td colspan="2">360.0</td><td colspan="2">16000</td></tr>
  <tr><td>m5ad.8xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>m5ad.12xlarge 2</td><td colspan="2">6780</td><td colspan="2">847.5</td><td colspan="2">30000</td></tr>
  <tr><td>m5ad.16xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>m5ad.24xlarge 2</td><td colspan="2">13750</td><td colspan="2">1718.75</td><td colspan="2">60000</td></tr>
  <tr><td>m5d.large 1</td><td>650</td><td>4750</td><td>81.25</td><td>593.75</td><td>3600</td><td>18750</td></tr>
  <tr><td>m5d.xlarge 1</td><td>1150</td><td>4750</td><td>143.75</td><td>593.75</td><td>6000</td><td>18750</td></tr>
  <tr><td>m5d.2xlarge 1</td><td>2300</td><td>4750</td><td>287.50</td><td>593.75</td><td>12000</td><td>18750</td></tr>
  <tr><td>m5d.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">18750</td></tr>
  <tr><td>m5d.8xlarge 2</td><td colspan="2">6800</td><td colspan="2">850.0</td><td colspan="2">30000</td></tr>
  <tr><td>m5d.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>m5d.16xlarge 2</td><td colspan="2">13600</td><td colspan="2">1700.0</td><td colspan="2">60000</td></tr>
  <tr><td>m5d.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m5d.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m5dn.large 1</td><td>650</td><td>4750</td><td>81.25</td><td>593.75</td><td>3600</td><td>18750</td></tr>
  <tr><td>m5dn.xlarge 1</td><td>1150</td><td>4750</td><td>143.75</td><td>593.75</td><td>6000</td><td>18750</td></tr>
  <tr><td>m5dn.2xlarge 1</td><td>2300</td><td>4750</td><td>287.50</td><td>593.75</td><td>12000</td><td>18750</td></tr>
  <tr><td>m5dn.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">18750</td></tr>
  <tr><td>m5dn.8xlarge 2</td><td colspan="2">6800</td><td colspan="2">850.0</td><td colspan="2">30000</td></tr>
  <tr><td>m5dn.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>m5dn.16xlarge 2</td><td colspan="2">13600</td><td colspan="2">1700.0</td><td colspan="2">60000</td></tr>
  <tr><td>m5dn.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m5dn.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m5n.large 1</td><td>650</td><td>4750</td><td>81.25</td><td>593.75</td><td>3600</td><td>18750</td></tr>
  <tr><td>m5n.xlarge 1</td><td>1150</td><td>4750</td><td>143.75</td><td>593.75</td><td>6000</td><td>18750</td></tr>
  <tr><td>m5n.2xlarge 1</td><td>2300</td><td>4750</td><td>287.50</td><td>593.75</td><td>12000</td><td>18750</td></tr>
  <tr><td>m5n.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">18750</td></tr>
  <tr><td>m5n.8xlarge 2</td><td colspan="2">6800</td><td colspan="2">850.0</td><td colspan="2">30000</td></tr>
  <tr><td>m5n.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>m5n.16xlarge 2</td><td colspan="2">13600</td><td colspan="2">1700.0</td><td colspan="2">60000</td></tr>
  <tr><td>m5n.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m5n.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m5zn.large 1</td><td>800</td><td>3170</td><td>100.00</td><td>396.25</td><td>3333</td><td>13333</td></tr>
  <tr><td>m5zn.xlarge 1</td><td>1564</td><td>3170</td><td>195.50</td><td>396.25</td><td>6667</td><td>13333</td></tr>
  <tr><td>m5zn.2xlarge 2</td><td colspan="2">3170</td><td colspan="2">396.25</td><td colspan="2">13333</td></tr>
  <tr><td>m5zn.3xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>m5zn.6xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>m5zn.12xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m5zn.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m6a.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m6a.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m6a.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m6a.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m6a.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m6a.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m6a.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m6a.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m6a.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>m6a.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>m6a.metal 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>m6g.medium 1</td><td>315</td><td>4750</td><td>39.38</td><td>593.75</td><td>2500</td><td>20000</td></tr>
  <tr><td>m6g.large 1</td><td>630</td><td>4750</td><td>78.75</td><td>593.75</td><td>3600</td><td>20000</td></tr>
  <tr><td>m6g.xlarge 1</td><td>1188</td><td>4750</td><td>148.50</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>m6g.2xlarge 1</td><td>2375</td><td>4750</td><td>296.88</td><td>593.75</td><td>12000</td><td>20000</td></tr>
  <tr><td>m6g.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>m6g.8xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>m6g.12xlarge 2</td><td colspan="2">14250</td><td colspan="2">1781.25</td><td colspan="2">50000</td></tr>
  <tr><td>m6g.16xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m6g.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m6gd.medium 1</td><td>315</td><td>4750</td><td>39.38</td><td>593.75</td><td>2500</td><td>20000</td></tr>
  <tr><td>m6gd.large 1</td><td>630</td><td>4750</td><td>78.75</td><td>593.75</td><td>3600</td><td>20000</td></tr>
  <tr><td>m6gd.xlarge 1</td><td>1188</td><td>4750</td><td>148.50</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>m6gd.2xlarge 1</td><td>2375</td><td>4750</td><td>296.88</td><td>593.75</td><td>12000</td><td>20000</td></tr>
  <tr><td>m6gd.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>m6gd.8xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>m6gd.12xlarge 2</td><td colspan="2">14250</td><td colspan="2">1781.25</td><td colspan="2">50000</td></tr>
  <tr><td>m6gd.16xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m6gd.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>m6i.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m6i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m6i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m6i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m6i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m6i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m6i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m6i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m6i.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>m6i.metal 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>m6id.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m6id.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m6id.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m6id.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m6id.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m6id.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m6id.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m6id.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m6id.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>m6id.metal 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>m6idn.large 1</td><td>1562</td><td>25000</td><td>195.31</td><td>3125.00</td><td>6250</td><td>100000</td></tr>
  <tr><td>m6idn.xlarge 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>12500</td><td>100000</td></tr>
  <tr><td>m6idn.2xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>25000</td><td>100000</td></tr>
  <tr><td>m6idn.4xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>50000</td><td>100000</td></tr>
  <tr><td>m6idn.8xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">100000</td></tr>
  <tr><td>m6idn.12xlarge 2</td><td colspan="2">37500</td><td colspan="2">4687.5</td><td colspan="2">150000</td></tr>
  <tr><td>m6idn.16xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">200000</td></tr>
  <tr><td>m6idn.24xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">300000</td></tr>
  <tr><td>m6idn.32xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>m6idn.metal 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>m6in.large 1</td><td>1562</td><td>25000</td><td>195.31</td><td>3125.00</td><td>6250</td><td>100000</td></tr>
  <tr><td>m6in.xlarge 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>12500</td><td>100000</td></tr>
  <tr><td>m6in.2xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>25000</td><td>100000</td></tr>
  <tr><td>m6in.4xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>50000</td><td>100000</td></tr>
  <tr><td>m6in.8xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">100000</td></tr>
  <tr><td>m6in.12xlarge 2</td><td colspan="2">37500</td><td colspan="2">4687.5</td><td colspan="2">150000</td></tr>
  <tr><td>m6in.16xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">200000</td></tr>
  <tr><td>m6in.24xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">300000</td></tr>
  <tr><td>m6in.32xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>m6in.metal 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>m7a.medium 1</td><td>325</td><td>10000</td><td>40.62</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>m7a.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m7a.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m7a.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m7a.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m7a.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m7a.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m7a.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m7a.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m7a.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>m7a.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>m7a.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>m7g.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>m7g.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m7g.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m7g.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m7g.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m7g.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m7g.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m7g.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m7g.metal 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m7gd.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>m7gd.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m7gd.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m7gd.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m7gd.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m7gd.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m7gd.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m7gd.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m7gd.metal 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m7i.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m7i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m7i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m7i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m7i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m7i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m7i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m7i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m7i.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>m7i.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m7i.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>m7i-flex.large 1</td><td>312</td><td>10000</td><td>39.06</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>m7i-flex.xlarge 1</td><td>625</td><td>10000</td><td>78.12</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m7i-flex.2xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m7i-flex.4xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m7i-flex.8xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m7i-flex.12xlarge 1</td><td>7500</td><td>15000</td><td>937.50</td><td>1875.00</td><td>30000</td><td>60000</td></tr>
  <tr><td>m7i-flex.16xlarge 1</td><td>10000</td><td>20000</td><td>1250.00</td><td>2500.00</td><td>40000</td><td>80000</td></tr>
  <tr><td>m8a.medium 1</td><td>325</td><td>10000</td><td>40.62</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>m8a.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m8a.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m8a.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m8a.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m8a.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m8a.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m8a.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m8a.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8a.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8a.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8a.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8azn.medium 1</td><td>625</td><td>15000</td><td>78.12</td><td>1875.00</td><td>2500</td><td>60000</td></tr>
  <tr><td>m8azn.large 1</td><td>1250</td><td>15000</td><td>156.25</td><td>1875.00</td><td>5000</td><td>60000</td></tr>
  <tr><td>m8azn.xlarge 1</td><td>2500</td><td>15000</td><td>312.50</td><td>1875.00</td><td>10000</td><td>60000</td></tr>
  <tr><td>m8azn.3xlarge 1</td><td>7500</td><td>15000</td><td>937.50</td><td>1875.00</td><td>30000</td><td>60000</td></tr>
  <tr><td>m8azn.6xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m8azn.12xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8azn.24xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8azn.metal-12xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8azn.metal-24xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8g.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>m8g.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m8g.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m8g.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m8g.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m8g.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m8g.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m8g.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m8g.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8g.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8g.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8g.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8gb.medium 1</td><td>1562</td><td>25000</td><td>195.31</td><td>3125.00</td><td>7500</td><td>120000</td></tr>
  <tr><td>m8gb.large 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>15000</td><td>120000</td></tr>
  <tr><td>m8gb.xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>30000</td><td>120000</td></tr>
  <tr><td>m8gb.2xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>60000</td><td>120000</td></tr>
  <tr><td>m8gb.4xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8gb.8xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8gb.12xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">360000</td></tr>
  <tr><td>m8gb.16xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8gb.24xlarge 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>m8gb.48xlarge 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>m8gb.metal-24xl 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>m8gb.metal-48xl 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>m8gd.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>m8gd.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m8gd.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m8gd.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m8gd.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m8gd.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m8gd.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m8gd.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m8gd.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8gd.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8gd.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8gd.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8gn.medium 1</td><td>760</td><td>10000</td><td>95.00</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>m8gn.large 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5000</td><td>40000</td></tr>
  <tr><td>m8gn.xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10000</td><td>40000</td></tr>
  <tr><td>m8gn.2xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m8gn.4xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m8gn.8xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m8gn.12xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8gn.16xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>m8gn.24xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8gn.48xlarge 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8gn.metal-24xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8gn.metal-48xl 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8i.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m8i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m8i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m8i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m8i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m8i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m8i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m8i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8i.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>m8i.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8i.96xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8i.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8i.metal-96xl 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8id.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m8id.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m8id.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m8id.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m8id.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m8id.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m8id.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m8id.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8id.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>m8id.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8id.96xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8id.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8id.metal-96xl 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8i-flex.large 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>m8i-flex.xlarge 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m8i-flex.2xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m8i-flex.4xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m8i-flex.8xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m8i-flex.12xlarge 1</td><td>7500</td><td>15000</td><td>937.50</td><td>1875.00</td><td>30000</td><td>60000</td></tr>
  <tr><td>m8i-flex.16xlarge 1</td><td>10000</td><td>20000</td><td>1250.00</td><td>2500.00</td><td>40000</td><td>80000</td></tr>
  <tr><td>m8in.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m8in.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m8in.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m8in.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m8in.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m8in.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m8in.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m8in.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8in.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>m8in.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8in.96xlarge 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8in.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8in.metal-96xl 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8idn.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m8idn.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m8idn.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m8idn.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m8idn.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m8idn.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m8idn.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>m8idn.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8idn.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>m8idn.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8idn.96xlarge 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8idn.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8idn.metal-96xl 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8ine.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>m8ine.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>m8ine.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>m8ine.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>m8ine.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>m8ine.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>m8ib.large 1</td><td>1563</td><td>25000</td><td>195.38</td><td>3125.00</td><td>7500</td><td>120000</td></tr>
  <tr><td>m8ib.xlarge 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>15000</td><td>120000</td></tr>
  <tr><td>m8ib.2xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>30000</td><td>120000</td></tr>
  <tr><td>m8ib.4xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>60000</td><td>120000</td></tr>
  <tr><td>m8ib.8xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8ib.12xlarge 2</td><td colspan="2">37500</td><td colspan="2">4687.5</td><td colspan="2">180000</td></tr>
  <tr><td>m8ib.16xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8ib.24xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">360000</td></tr>
  <tr><td>m8ib.32xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8ib.48xlarge 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>m8ib.96xlarge 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>m8ib.metal-48xl 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>m8ib.metal-96xl 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>m8idb.large 1</td><td>1563</td><td>25000</td><td>195.38</td><td>3125.00</td><td>7500</td><td>120000</td></tr>
  <tr><td>m8idb.xlarge 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>15000</td><td>120000</td></tr>
  <tr><td>m8idb.2xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>30000</td><td>120000</td></tr>
  <tr><td>m8idb.4xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>60000</td><td>120000</td></tr>
  <tr><td>m8idb.8xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">120000</td></tr>
  <tr><td>m8idb.12xlarge 2</td><td colspan="2">37500</td><td colspan="2">4687.5</td><td colspan="2">180000</td></tr>
  <tr><td>m8idb.16xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">240000</td></tr>
  <tr><td>m8idb.24xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">360000</td></tr>
  <tr><td>m8idb.32xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">480000</td></tr>
  <tr><td>m8idb.48xlarge 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>m8idb.96xlarge 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>m8idb.metal-48xl 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>m8idb.metal-96xl 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>m9g.medium 1</td><td>380</td><td>12000</td><td>47.50</td><td>1500.00</td><td>2500</td><td>48000</td></tr>
  <tr><td>m9g.large 1</td><td>760</td><td>12000</td><td>95.00</td><td>1500.00</td><td>3600</td><td>48000</td></tr>
  <tr><td>m9g.xlarge 1</td><td>1500</td><td>12000</td><td>187.50</td><td>1500.00</td><td>6000</td><td>48000</td></tr>
  <tr><td>m9g.2xlarge 1</td><td>3000</td><td>12000</td><td>375.00</td><td>1500.00</td><td>12000</td><td>48000</td></tr>
  <tr><td>m9g.4xlarge 1</td><td>6000</td><td>12000</td><td>750.00</td><td>1500.00</td><td>24000</td><td>48000</td></tr>
  <tr><td>m9g.8xlarge 2</td><td colspan="2">12000</td><td colspan="2">1500.0</td><td colspan="2">48000</td></tr>
  <tr><td>m9g.12xlarge 2</td><td colspan="2">18000</td><td colspan="2">2250.0</td><td colspan="2">72000</td></tr>
  <tr><td>m9g.16xlarge 2</td><td colspan="2">24000</td><td colspan="2">3000.0</td><td colspan="2">96000</td></tr>
  <tr><td>m9g.24xlarge 2</td><td colspan="2">36000</td><td colspan="2">4500.0</td><td colspan="2">144000</td></tr>
  <tr><td>m9g.48xlarge 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
  <tr><td>m9g.metal-48xl 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
  <tr><td>m9gd.medium 1</td><td>380</td><td>12000</td><td>47.50</td><td>1500.00</td><td>2500</td><td>48000</td></tr>
  <tr><td>m9gd.large 1</td><td>760</td><td>12000</td><td>95.00</td><td>1500.00</td><td>3600</td><td>48000</td></tr>
  <tr><td>m9gd.xlarge 1</td><td>1500</td><td>12000</td><td>187.50</td><td>1500.00</td><td>6000</td><td>48000</td></tr>
  <tr><td>m9gd.2xlarge 1</td><td>3000</td><td>12000</td><td>375.00</td><td>1500.00</td><td>12000</td><td>48000</td></tr>
  <tr><td>m9gd.4xlarge 1</td><td>6000</td><td>12000</td><td>750.00</td><td>1500.00</td><td>24000</td><td>48000</td></tr>
  <tr><td>m9gd.8xlarge 2</td><td colspan="2">12000</td><td colspan="2">1500.0</td><td colspan="2">48000</td></tr>
  <tr><td>m9gd.12xlarge 2</td><td colspan="2">18000</td><td colspan="2">2250.0</td><td colspan="2">72000</td></tr>
  <tr><td>m9gd.16xlarge 2</td><td colspan="2">24000</td><td colspan="2">3000.0</td><td colspan="2">96000</td></tr>
  <tr><td>m9gd.24xlarge 2</td><td colspan="2">36000</td><td colspan="2">4500.0</td><td colspan="2">144000</td></tr>
  <tr><td>m9gd.48xlarge 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
  <tr><td>m9gd.metal-48xl 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
  <tr><td>mac1.metal 2</td><td colspan="2">14000</td><td colspan="2">1750.0</td><td colspan="2">80000</td></tr>
  <tr><td>mac2.metal 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">55000</td></tr>
  <tr><td>mac2-m1ultra.metal 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">55000</td></tr>
  <tr><td>mac2-m2.metal 2</td><td colspan="2">8000</td><td colspan="2">1000.0</td><td colspan="2">55000</td></tr>
  <tr><td>mac2-m2pro.metal 2</td><td colspan="2">8000</td><td colspan="2">1000.0</td><td colspan="2">55000</td></tr>
  <tr><td>mac-m3ultra.metal 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">55000</td></tr>
  <tr><td>mac-m4.metal 2</td><td colspan="2">8000</td><td colspan="2">1000.0</td><td colspan="2">55000</td></tr>
  <tr><td>mac-m4pro.metal 2</td><td colspan="2">8000</td><td colspan="2">1000.0</td><td colspan="2">55000</td></tr>
  <tr><td>mac-m4max.metal 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">55000</td></tr>
  <tr><td>t3.nano 1</td><td>43</td><td>2085</td><td>5.38</td><td>260.62</td><td>250</td><td>11800</td></tr>
  <tr><td>t3.micro 1</td><td>87</td><td>2085</td><td>10.88</td><td>260.62</td><td>500</td><td>11800</td></tr>
  <tr><td>t3.small 1</td><td>174</td><td>2085</td><td>21.75</td><td>260.62</td><td>1000</td><td>11800</td></tr>
  <tr><td>t3.medium 1</td><td>347</td><td>2085</td><td>43.38</td><td>260.62</td><td>2000</td><td>11800</td></tr>
  <tr><td>t3.large 1</td><td>695</td><td>2780</td><td>86.88</td><td>347.50</td><td>4000</td><td>15700</td></tr>
  <tr><td>t3.xlarge 1</td><td>695</td><td>2780</td><td>86.88</td><td>347.50</td><td>4000</td><td>15700</td></tr>
  <tr><td>t3.2xlarge 1</td><td>695</td><td>2780</td><td>86.88</td><td>347.50</td><td>4000</td><td>15700</td></tr>
  <tr><td>t3a.nano 1</td><td>45</td><td>2085</td><td>5.62</td><td>260.62</td><td>250</td><td>11800</td></tr>
  <tr><td>t3a.micro 1</td><td>90</td><td>2085</td><td>11.25</td><td>260.62</td><td>500</td><td>11800</td></tr>
  <tr><td>t3a.small 1</td><td>175</td><td>2085</td><td>21.88</td><td>260.62</td><td>1000</td><td>11800</td></tr>
  <tr><td>t3a.medium 1</td><td>350</td><td>2085</td><td>43.75</td><td>260.62</td><td>2000</td><td>11800</td></tr>
  <tr><td>t3a.large 1</td><td>695</td><td>2780</td><td>86.88</td><td>347.50</td><td>4000</td><td>15700</td></tr>
  <tr><td>t3a.xlarge 1</td><td>695</td><td>2780</td><td>86.88</td><td>347.50</td><td>4000</td><td>15700</td></tr>
  <tr><td>t3a.2xlarge 1</td><td>695</td><td>2780</td><td>86.88</td><td>347.50</td><td>4000</td><td>15700</td></tr>
  <tr><td>t4g.nano 1</td><td>43</td><td>2085</td><td>5.38</td><td>260.62</td><td>250</td><td>11800</td></tr>
  <tr><td>t4g.micro 1</td><td>87</td><td>2085</td><td>10.88</td><td>260.62</td><td>500</td><td>11800</td></tr>
  <tr><td>t4g.small 1</td><td>174</td><td>2085</td><td>21.75</td><td>260.62</td><td>1000</td><td>11800</td></tr>
  <tr><td>t4g.medium 1</td><td>347</td><td>2085</td><td>43.38</td><td>260.62</td><td>2000</td><td>11800</td></tr>
  <tr><td>t4g.large 1</td><td>695</td><td>2780</td><td>86.88</td><td>347.50</td><td>4000</td><td>15700</td></tr>
  <tr><td>t4g.xlarge 1</td><td>695</td><td>2780</td><td>86.88</td><td>347.50</td><td>4000</td><td>15700</td></tr>
  <tr><td>t4g.2xlarge 1</td><td>695</td><td>2780</td><td>86.88</td><td>347.50</td><td>4000</td><td>15700</td></tr>
</tbody>
</table>


1 这些实例可以至少每 24 小时维持一次 30 分钟的最大性能，之后会恢复到基线性能。

2 这些实例可以无限期地维持其既定性能。如果工作负载需要在超过 30 分钟的时长内保持最大性能，请选择以下任一实例。

### 计算优化型
<a name="current-compute-optimized"></a>

**注意**  
C8a、C8g、C8gd、C8i、C8id、C8i-flex、C9g、C9gd 实例类型支持可配置的带宽权重。使用这些实例类型，您可以针对网络性能或 Amazon EBS 性能优化实例的带宽。下表显示了这些实例类型的默认 Amazon EBS 带宽性能。有关更多信息，请参阅 [EC2 实例带宽权重配置](configure-bandwidth-weighting.md)。


<table>
<thead>
  <tr><th>实例大小</th><th>基准带宽（Mbps）</th><th>最大带宽（Mbps）</th><th>基准吞吐量（MB/s，128 KiB I/O）</th><th>最大吞吐量（MB/s，128 KiB I/O）</th><th>基准 IOPS（16KiB I/O）</th><th>最大 IOPS（16KiB I/O）</th></tr>
</thead>
<tbody>
  <tr><td>c4.large 2</td><td colspan="2">500</td><td colspan="2">62.5</td><td colspan="2">4000</td></tr>
  <tr><td>c4.xlarge 2</td><td colspan="2">750</td><td colspan="2">93.75</td><td colspan="2">6000</td></tr>
  <tr><td>c4.2xlarge 2</td><td colspan="2">1000</td><td colspan="2">125.0</td><td colspan="2">8000</td></tr>
  <tr><td>c4.4xlarge 2</td><td colspan="2">2000</td><td colspan="2">250.0</td><td colspan="2">16000</td></tr>
  <tr><td>c4.8xlarge 2</td><td colspan="2">4000</td><td colspan="2">500.0</td><td colspan="2">32000</td></tr>
  <tr><td>c5.large 1</td><td>650</td><td>4750</td><td>81.25</td><td>593.75</td><td>4000</td><td>20000</td></tr>
  <tr><td>c5.xlarge 1</td><td>1150</td><td>4750</td><td>143.75</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>c5.2xlarge 1</td><td>2300</td><td>4750</td><td>287.50</td><td>593.75</td><td>10000</td><td>20000</td></tr>
  <tr><td>c5.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>c5.9xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>c5.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>c5.18xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c5.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c5.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c5a.large 1</td><td>200</td><td>3170</td><td>25.00</td><td>396.25</td><td>800</td><td>13300</td></tr>
  <tr><td>c5a.xlarge 1</td><td>400</td><td>3170</td><td>50.00</td><td>396.25</td><td>1600</td><td>13300</td></tr>
  <tr><td>c5a.2xlarge 1</td><td>800</td><td>3170</td><td>100.00</td><td>396.25</td><td>3200</td><td>13300</td></tr>
  <tr><td>c5a.4xlarge 1</td><td>1580</td><td>3170</td><td>197.50</td><td>396.25</td><td>6600</td><td>13300</td></tr>
  <tr><td>c5a.8xlarge 2</td><td colspan="2">3170</td><td colspan="2">396.25</td><td colspan="2">13300</td></tr>
  <tr><td>c5a.12xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>c5a.16xlarge 2</td><td colspan="2">6300</td><td colspan="2">787.5</td><td colspan="2">26700</td></tr>
  <tr><td>c5a.24xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>c5ad.large 1</td><td>200</td><td>3170</td><td>25.00</td><td>396.25</td><td>800</td><td>13300</td></tr>
  <tr><td>c5ad.xlarge 1</td><td>400</td><td>3170</td><td>50.00</td><td>396.25</td><td>1600</td><td>13300</td></tr>
  <tr><td>c5ad.2xlarge 1</td><td>800</td><td>3170</td><td>100.00</td><td>396.25</td><td>3200</td><td>13300</td></tr>
  <tr><td>c5ad.4xlarge 1</td><td>1580</td><td>3170</td><td>197.50</td><td>396.25</td><td>6600</td><td>13300</td></tr>
  <tr><td>c5ad.8xlarge 2</td><td colspan="2">3170</td><td colspan="2">396.25</td><td colspan="2">13300</td></tr>
  <tr><td>c5ad.12xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>c5ad.16xlarge 2</td><td colspan="2">6300</td><td colspan="2">787.5</td><td colspan="2">26700</td></tr>
  <tr><td>c5ad.24xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>c5d.large 1</td><td>650</td><td>4750</td><td>81.25</td><td>593.75</td><td>4000</td><td>20000</td></tr>
  <tr><td>c5d.xlarge 1</td><td>1150</td><td>4750</td><td>143.75</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>c5d.2xlarge 1</td><td>2300</td><td>4750</td><td>287.50</td><td>593.75</td><td>10000</td><td>20000</td></tr>
  <tr><td>c5d.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>c5d.9xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>c5d.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>c5d.18xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c5d.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c5d.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c5n.large 1</td><td>650</td><td>4750</td><td>81.25</td><td>593.75</td><td>4000</td><td>20000</td></tr>
  <tr><td>c5n.xlarge 1</td><td>1150</td><td>4750</td><td>143.75</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>c5n.2xlarge 1</td><td>2300</td><td>4750</td><td>287.50</td><td>593.75</td><td>10000</td><td>20000</td></tr>
  <tr><td>c5n.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>c5n.9xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>c5n.18xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c5n.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c6a.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c6a.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c6a.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c6a.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c6a.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c6a.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c6a.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c6a.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c6a.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>c6a.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>c6a.metal 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>c6g.medium 1</td><td>315</td><td>4750</td><td>39.38</td><td>593.75</td><td>2500</td><td>20000</td></tr>
  <tr><td>c6g.large 1</td><td>630</td><td>4750</td><td>78.75</td><td>593.75</td><td>3600</td><td>20000</td></tr>
  <tr><td>c6g.xlarge 1</td><td>1188</td><td>4750</td><td>148.50</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>c6g.2xlarge 1</td><td>2375</td><td>4750</td><td>296.88</td><td>593.75</td><td>12000</td><td>20000</td></tr>
  <tr><td>c6g.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>c6g.8xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>c6g.12xlarge 2</td><td colspan="2">14250</td><td colspan="2">1781.25</td><td colspan="2">50000</td></tr>
  <tr><td>c6g.16xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c6g.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c6gd.medium 1</td><td>315</td><td>4750</td><td>39.38</td><td>593.75</td><td>2500</td><td>20000</td></tr>
  <tr><td>c6gd.large 1</td><td>630</td><td>4750</td><td>78.75</td><td>593.75</td><td>3600</td><td>20000</td></tr>
  <tr><td>c6gd.xlarge 1</td><td>1188</td><td>4750</td><td>148.50</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>c6gd.2xlarge 1</td><td>2375</td><td>4750</td><td>296.88</td><td>593.75</td><td>12000</td><td>20000</td></tr>
  <tr><td>c6gd.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>c6gd.8xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>c6gd.12xlarge 2</td><td colspan="2">14250</td><td colspan="2">1781.25</td><td colspan="2">50000</td></tr>
  <tr><td>c6gd.16xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c6gd.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c6gn.medium 1</td><td>760</td><td>9500</td><td>95.00</td><td>1187.50</td><td>2500</td><td>40000</td></tr>
  <tr><td>c6gn.large 1</td><td>1235</td><td>9500</td><td>154.38</td><td>1187.50</td><td>5000</td><td>40000</td></tr>
  <tr><td>c6gn.xlarge 1</td><td>2375</td><td>9500</td><td>296.88</td><td>1187.50</td><td>10000</td><td>40000</td></tr>
  <tr><td>c6gn.2xlarge 1</td><td>4750</td><td>9500</td><td>593.75</td><td>1187.50</td><td>20000</td><td>40000</td></tr>
  <tr><td>c6gn.4xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>c6gn.8xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>c6gn.12xlarge 2</td><td colspan="2">28500</td><td colspan="2">3562.5</td><td colspan="2">120000</td></tr>
  <tr><td>c6gn.16xlarge 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>c6i.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c6i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c6i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c6i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c6i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c6i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c6i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c6i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c6i.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>c6i.metal 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>c6id.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c6id.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c6id.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c6id.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c6id.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c6id.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c6id.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c6id.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c6id.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>c6id.metal 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>c6in.large 1</td><td>1562</td><td>25000</td><td>195.31</td><td>3125.00</td><td>6250</td><td>100000</td></tr>
  <tr><td>c6in.xlarge 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>12500</td><td>100000</td></tr>
  <tr><td>c6in.2xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>25000</td><td>100000</td></tr>
  <tr><td>c6in.4xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>50000</td><td>100000</td></tr>
  <tr><td>c6in.8xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">100000</td></tr>
  <tr><td>c6in.12xlarge 2</td><td colspan="2">37500</td><td colspan="2">4687.5</td><td colspan="2">150000</td></tr>
  <tr><td>c6in.16xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">200000</td></tr>
  <tr><td>c6in.24xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">300000</td></tr>
  <tr><td>c6in.32xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>c6in.metal 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>c7a.medium 1</td><td>325</td><td>10000</td><td>40.62</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>c7a.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c7a.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c7a.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c7a.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c7a.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c7a.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c7a.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c7a.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c7a.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>c7a.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>c7a.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>c7g.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>c7g.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c7g.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c7g.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c7g.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c7g.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c7g.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c7g.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c7g.metal 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c7gd.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>c7gd.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c7gd.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c7gd.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c7gd.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c7gd.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c7gd.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c7gd.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c7gd.metal 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c7gn.medium 1</td><td>521</td><td>10000</td><td>65.12</td><td>1250.00</td><td>2083</td><td>40000</td></tr>
  <tr><td>c7gn.large 1</td><td>1042</td><td>10000</td><td>130.25</td><td>1250.00</td><td>4167</td><td>40000</td></tr>
  <tr><td>c7gn.xlarge 1</td><td>2083</td><td>10000</td><td>260.38</td><td>1250.00</td><td>8333</td><td>40000</td></tr>
  <tr><td>c7gn.2xlarge 1</td><td>4167</td><td>10000</td><td>520.88</td><td>1250.00</td><td>16667</td><td>40000</td></tr>
  <tr><td>c7gn.4xlarge 1</td><td>8333</td><td>10000</td><td>1041.62</td><td>1250.00</td><td>33333</td><td>40000</td></tr>
  <tr><td>c7gn.8xlarge 1</td><td>16667</td><td>20000</td><td>2083.38</td><td>2500.00</td><td>66667</td><td>80000</td></tr>
  <tr><td>c7gn.12xlarge 1</td><td>25000</td><td>30000</td><td>3125.00</td><td>3750.00</td><td>100000</td><td>120000</td></tr>
  <tr><td>c7gn.16xlarge 1</td><td>33333</td><td>40000</td><td>4166.62</td><td>5000.00</td><td>133333</td><td>160000</td></tr>
  <tr><td>c7gn.metal 1</td><td>33333</td><td>40000</td><td>4166.62</td><td>5000.00</td><td>133333</td><td>160000</td></tr>
  <tr><td>c7i.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c7i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c7i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c7i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c7i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c7i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c7i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c7i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c7i.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>c7i.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c7i.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>c7i-flex.large 1</td><td>312</td><td>10000</td><td>39.06</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>c7i-flex.xlarge 1</td><td>625</td><td>10000</td><td>78.12</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c7i-flex.2xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c7i-flex.4xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c7i-flex.8xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c7i-flex.12xlarge 1</td><td>7500</td><td>15000</td><td>937.50</td><td>1875.00</td><td>30000</td><td>60000</td></tr>
  <tr><td>c7i-flex.16xlarge 1</td><td>10000</td><td>20000</td><td>1250.00</td><td>2500.00</td><td>40000</td><td>80000</td></tr>
  <tr><td>c8a.medium 1</td><td>325</td><td>10000</td><td>40.62</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>c8a.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c8a.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c8a.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c8a.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c8a.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c8a.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c8a.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c8a.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8a.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8a.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8a.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8g.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>c8g.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c8g.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c8g.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c8g.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c8g.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c8g.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c8g.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c8g.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8g.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8g.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8g.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8gb.medium 1</td><td>1562</td><td>25000</td><td>195.31</td><td>3125.00</td><td>7500</td><td>120000</td></tr>
  <tr><td>c8gb.large 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>15000</td><td>120000</td></tr>
  <tr><td>c8gb.xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>30000</td><td>120000</td></tr>
  <tr><td>c8gb.2xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>60000</td><td>120000</td></tr>
  <tr><td>c8gb.4xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8gb.8xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8gb.12xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">360000</td></tr>
  <tr><td>c8gb.16xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">480000</td></tr>
  <tr><td>c8gb.24xlarge 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>c8gb.48xlarge 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>c8gb.metal-24xl 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>c8gb.metal-48xl 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>c8gd.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>c8gd.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c8gd.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c8gd.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c8gd.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c8gd.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c8gd.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c8gd.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c8gd.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8gd.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8gd.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8gd.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8gn.medium 1</td><td>760</td><td>10000</td><td>95.00</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>c8gn.large 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5000</td><td>40000</td></tr>
  <tr><td>c8gn.xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10000</td><td>40000</td></tr>
  <tr><td>c8gn.2xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c8gn.4xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c8gn.8xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c8gn.12xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8gn.16xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>c8gn.24xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8gn.48xlarge 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>c8gn.metal-24xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8gn.metal-48xl 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>c8i.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c8i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c8i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c8i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c8i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c8i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c8i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c8i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8i.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>c8i.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8i.96xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>c8i.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8i.metal-96xl 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>c8id.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c8id.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c8id.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c8id.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c8id.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c8id.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c8id.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c8id.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8id.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>c8id.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8id.96xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>c8id.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8id.metal-96xl 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>c8i-flex.large 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>c8i-flex.xlarge 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c8i-flex.2xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c8i-flex.4xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c8i-flex.8xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c8i-flex.12xlarge 1</td><td>7500</td><td>15000</td><td>937.50</td><td>1875.00</td><td>30000</td><td>60000</td></tr>
  <tr><td>c8i-flex.16xlarge 1</td><td>10000</td><td>20000</td><td>1250.00</td><td>2500.00</td><td>40000</td><td>80000</td></tr>
  <tr><td>c8in.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c8in.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c8in.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c8in.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c8in.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c8in.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c8in.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>c8in.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8in.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>c8in.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8in.96xlarge 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>c8in.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8in.metal-96xl 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>c8ine.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>c8ine.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>c8ine.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>c8ine.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>c8ine.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>c8ine.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>c8ib.large 1</td><td>1563</td><td>25000</td><td>195.38</td><td>3125.00</td><td>7500</td><td>120000</td></tr>
  <tr><td>c8ib.xlarge 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>15000</td><td>120000</td></tr>
  <tr><td>c8ib.2xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>30000</td><td>120000</td></tr>
  <tr><td>c8ib.4xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>60000</td><td>120000</td></tr>
  <tr><td>c8ib.8xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">120000</td></tr>
  <tr><td>c8ib.12xlarge 2</td><td colspan="2">37500</td><td colspan="2">4687.5</td><td colspan="2">180000</td></tr>
  <tr><td>c8ib.16xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">240000</td></tr>
  <tr><td>c8ib.24xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">360000</td></tr>
  <tr><td>c8ib.32xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">480000</td></tr>
  <tr><td>c8ib.48xlarge 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>c8ib.96xlarge 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>c8ib.metal-48xl 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>c8ib.metal-96xl 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>c9g.medium 1</td><td>380</td><td>12000</td><td>47.50</td><td>1500.00</td><td>2500</td><td>48000</td></tr>
  <tr><td>c9g.large 1</td><td>760</td><td>12000</td><td>95.00</td><td>1500.00</td><td>3600</td><td>48000</td></tr>
  <tr><td>c9g.xlarge 1</td><td>1500</td><td>12000</td><td>187.50</td><td>1500.00</td><td>6000</td><td>48000</td></tr>
  <tr><td>c9g.2xlarge 1</td><td>3000</td><td>12000</td><td>375.00</td><td>1500.00</td><td>12000</td><td>48000</td></tr>
  <tr><td>c9g.4xlarge 1</td><td>6000</td><td>12000</td><td>750.00</td><td>1500.00</td><td>24000</td><td>48000</td></tr>
  <tr><td>c9g.8xlarge 2</td><td colspan="2">12000</td><td colspan="2">1500.0</td><td colspan="2">48000</td></tr>
  <tr><td>c9g.12xlarge 2</td><td colspan="2">18000</td><td colspan="2">2250.0</td><td colspan="2">72000</td></tr>
  <tr><td>c9g.16xlarge 2</td><td colspan="2">24000</td><td colspan="2">3000.0</td><td colspan="2">96000</td></tr>
  <tr><td>c9g.24xlarge 2</td><td colspan="2">36000</td><td colspan="2">4500.0</td><td colspan="2">144000</td></tr>
  <tr><td>c9g.48xlarge 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
  <tr><td>c9g.metal-48xl 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
  <tr><td>c9gd.medium 1</td><td>380</td><td>12000</td><td>47.50</td><td>1500.00</td><td>2500</td><td>48000</td></tr>
  <tr><td>c9gd.large 1</td><td>760</td><td>12000</td><td>95.00</td><td>1500.00</td><td>3600</td><td>48000</td></tr>
  <tr><td>c9gd.xlarge 1</td><td>1500</td><td>12000</td><td>187.50</td><td>1500.00</td><td>6000</td><td>48000</td></tr>
  <tr><td>c9gd.2xlarge 1</td><td>3000</td><td>12000</td><td>375.00</td><td>1500.00</td><td>12000</td><td>48000</td></tr>
  <tr><td>c9gd.4xlarge 1</td><td>6000</td><td>12000</td><td>750.00</td><td>1500.00</td><td>24000</td><td>48000</td></tr>
  <tr><td>c9gd.8xlarge 2</td><td colspan="2">12000</td><td colspan="2">1500.0</td><td colspan="2">48000</td></tr>
  <tr><td>c9gd.12xlarge 2</td><td colspan="2">18000</td><td colspan="2">2250.0</td><td colspan="2">72000</td></tr>
  <tr><td>c9gd.16xlarge 2</td><td colspan="2">24000</td><td colspan="2">3000.0</td><td colspan="2">96000</td></tr>
  <tr><td>c9gd.24xlarge 2</td><td colspan="2">36000</td><td colspan="2">4500.0</td><td colspan="2">144000</td></tr>
  <tr><td>c9gd.48xlarge 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
  <tr><td>c9gd.metal-48xl 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
</tbody>
</table>


1 这些实例可以至少每 24 小时维持一次 30 分钟的最大性能，之后会恢复到基线性能。

2 这些实例可以无限期地维持其既定性能。如果工作负载需要在超过 30 分钟的时长内保持最大性能，请选择以下任一实例。

### 内存优化型
<a name="current-memory-optimized"></a>

**注意**  
R8a、R8g、R8gd、R8i、R8id、R8i-flex、R9g、R9gd、X8g、X8aedz、X8i 实例类型支持可配置的带宽权重。使用这些实例类型，您可以针对网络性能或 Amazon EBS 性能优化实例的带宽。下表显示了这些实例类型的默认 Amazon EBS 带宽性能。有关更多信息，请参阅 [EC2 实例带宽权重配置](configure-bandwidth-weighting.md)。
为了实现 U7i 实例的最佳 IOPS 性能，我们建议使用 io2 BlockExpress 卷。


<table>
<thead>
  <tr><th>实例大小</th><th>基准带宽（Mbps）</th><th>最大带宽（Mbps）</th><th>基准吞吐量（MB/s，128 KiB I/O）</th><th>最大吞吐量（MB/s，128 KiB I/O）</th><th>基准 IOPS（16KiB I/O）</th><th>最大 IOPS（16KiB I/O）</th></tr>
</thead>
<tbody>
  <tr><td>r4.large 2</td><td colspan="2">425</td><td colspan="2">53.125</td><td colspan="2">3000</td></tr>
  <tr><td>r4.xlarge 2</td><td colspan="2">850</td><td colspan="2">106.25</td><td colspan="2">6000</td></tr>
  <tr><td>r4.2xlarge 2</td><td colspan="2">1700</td><td colspan="2">212.5</td><td colspan="2">12000</td></tr>
  <tr><td>r4.4xlarge 2</td><td colspan="2">3500</td><td colspan="2">437.5</td><td colspan="2">18750</td></tr>
  <tr><td>r4.8xlarge 2</td><td colspan="2">7000</td><td colspan="2">875.0</td><td colspan="2">37500</td></tr>
  <tr><td>r4.16xlarge 2</td><td colspan="2">14000</td><td colspan="2">1750.0</td><td colspan="2">75000</td></tr>
  <tr><td>r5.large 1</td><td>650</td><td>4750</td><td>81.25</td><td>593.75</td><td>3600</td><td>18750</td></tr>
  <tr><td>r5.xlarge 1</td><td>1150</td><td>4750</td><td>143.75</td><td>593.75</td><td>6000</td><td>18750</td></tr>
  <tr><td>r5.2xlarge 1</td><td>2300</td><td>4750</td><td>287.50</td><td>593.75</td><td>12000</td><td>18750</td></tr>
  <tr><td>r5.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">18750</td></tr>
  <tr><td>r5.8xlarge 2</td><td colspan="2">6800</td><td colspan="2">850.0</td><td colspan="2">30000</td></tr>
  <tr><td>r5.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>r5.16xlarge 2</td><td colspan="2">13600</td><td colspan="2">1700.0</td><td colspan="2">60000</td></tr>
  <tr><td>r5.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r5.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r5a.large 1</td><td>650</td><td>2880</td><td>81.25</td><td>360.00</td><td>3600</td><td>16000</td></tr>
  <tr><td>r5a.xlarge 1</td><td>1085</td><td>2880</td><td>135.62</td><td>360.00</td><td>6000</td><td>16000</td></tr>
  <tr><td>r5a.2xlarge 1</td><td>1580</td><td>2880</td><td>197.50</td><td>360.00</td><td>8333</td><td>16000</td></tr>
  <tr><td>r5a.4xlarge 2</td><td colspan="2">2880</td><td colspan="2">360.0</td><td colspan="2">16000</td></tr>
  <tr><td>r5a.8xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>r5a.12xlarge 2</td><td colspan="2">6780</td><td colspan="2">847.5</td><td colspan="2">30000</td></tr>
  <tr><td>r5a.16xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>r5a.24xlarge 2</td><td colspan="2">13570</td><td colspan="2">1696.25</td><td colspan="2">60000</td></tr>
  <tr><td>r5ad.large 1</td><td>650</td><td>2880</td><td>81.25</td><td>360.00</td><td>3600</td><td>16000</td></tr>
  <tr><td>r5ad.xlarge 1</td><td>1085</td><td>2880</td><td>135.62</td><td>360.00</td><td>6000</td><td>16000</td></tr>
  <tr><td>r5ad.2xlarge 1</td><td>1580</td><td>2880</td><td>197.50</td><td>360.00</td><td>8333</td><td>16000</td></tr>
  <tr><td>r5ad.4xlarge 2</td><td colspan="2">2880</td><td colspan="2">360.0</td><td colspan="2">16000</td></tr>
  <tr><td>r5ad.8xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>r5ad.12xlarge 2</td><td colspan="2">6780</td><td colspan="2">847.5</td><td colspan="2">30000</td></tr>
  <tr><td>r5ad.16xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>r5ad.24xlarge 2</td><td colspan="2">13570</td><td colspan="2">1696.25</td><td colspan="2">60000</td></tr>
  <tr><td>r5b.large 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5417</td><td>43333</td></tr>
  <tr><td>r5b.xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10833</td><td>43333</td></tr>
  <tr><td>r5b.2xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>21667</td><td>43333</td></tr>
  <tr><td>r5b.4xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">43333</td></tr>
  <tr><td>r5b.8xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">86667</td></tr>
  <tr><td>r5b.12xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">130000</td></tr>
  <tr><td>r5b.16xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">173333</td></tr>
  <tr><td>r5b.24xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">260000</td></tr>
  <tr><td>r5b.metal 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">260000</td></tr>
  <tr><td>r5d.large 1</td><td>650</td><td>4750</td><td>81.25</td><td>593.75</td><td>3600</td><td>18750</td></tr>
  <tr><td>r5d.xlarge 1</td><td>1150</td><td>4750</td><td>143.75</td><td>593.75</td><td>6000</td><td>18750</td></tr>
  <tr><td>r5d.2xlarge 1</td><td>2300</td><td>4750</td><td>287.50</td><td>593.75</td><td>12000</td><td>18750</td></tr>
  <tr><td>r5d.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">18750</td></tr>
  <tr><td>r5d.8xlarge 2</td><td colspan="2">6800</td><td colspan="2">850.0</td><td colspan="2">30000</td></tr>
  <tr><td>r5d.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>r5d.16xlarge 2</td><td colspan="2">13600</td><td colspan="2">1700.0</td><td colspan="2">60000</td></tr>
  <tr><td>r5d.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r5d.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r5dn.large 1</td><td>650</td><td>4750</td><td>81.25</td><td>593.75</td><td>3600</td><td>18750</td></tr>
  <tr><td>r5dn.xlarge 1</td><td>1150</td><td>4750</td><td>143.75</td><td>593.75</td><td>6000</td><td>18750</td></tr>
  <tr><td>r5dn.2xlarge 1</td><td>2300</td><td>4750</td><td>287.50</td><td>593.75</td><td>12000</td><td>18750</td></tr>
  <tr><td>r5dn.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">18750</td></tr>
  <tr><td>r5dn.8xlarge 2</td><td colspan="2">6800</td><td colspan="2">850.0</td><td colspan="2">30000</td></tr>
  <tr><td>r5dn.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>r5dn.16xlarge 2</td><td colspan="2">13600</td><td colspan="2">1700.0</td><td colspan="2">60000</td></tr>
  <tr><td>r5dn.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r5dn.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r5n.large 1</td><td>650</td><td>4750</td><td>81.25</td><td>593.75</td><td>3600</td><td>18750</td></tr>
  <tr><td>r5n.xlarge 1</td><td>1150</td><td>4750</td><td>143.75</td><td>593.75</td><td>6000</td><td>18750</td></tr>
  <tr><td>r5n.2xlarge 1</td><td>2300</td><td>4750</td><td>287.50</td><td>593.75</td><td>12000</td><td>18750</td></tr>
  <tr><td>r5n.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">18750</td></tr>
  <tr><td>r5n.8xlarge 2</td><td colspan="2">6800</td><td colspan="2">850.0</td><td colspan="2">30000</td></tr>
  <tr><td>r5n.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>r5n.16xlarge 2</td><td colspan="2">13600</td><td colspan="2">1700.0</td><td colspan="2">60000</td></tr>
  <tr><td>r5n.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r5n.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r6a.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r6a.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r6a.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r6a.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r6a.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r6a.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r6a.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r6a.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r6a.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r6a.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>r6a.metal 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>r6g.medium 1</td><td>315</td><td>4750</td><td>39.38</td><td>593.75</td><td>2500</td><td>20000</td></tr>
  <tr><td>r6g.large 1</td><td>630</td><td>4750</td><td>78.75</td><td>593.75</td><td>3600</td><td>20000</td></tr>
  <tr><td>r6g.xlarge 1</td><td>1188</td><td>4750</td><td>148.50</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>r6g.2xlarge 1</td><td>2375</td><td>4750</td><td>296.88</td><td>593.75</td><td>12000</td><td>20000</td></tr>
  <tr><td>r6g.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>r6g.8xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>r6g.12xlarge 2</td><td colspan="2">14250</td><td colspan="2">1781.25</td><td colspan="2">50000</td></tr>
  <tr><td>r6g.16xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r6g.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r6gd.medium 1</td><td>315</td><td>4750</td><td>39.38</td><td>593.75</td><td>2500</td><td>20000</td></tr>
  <tr><td>r6gd.large 1</td><td>630</td><td>4750</td><td>78.75</td><td>593.75</td><td>3600</td><td>20000</td></tr>
  <tr><td>r6gd.xlarge 1</td><td>1188</td><td>4750</td><td>148.50</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>r6gd.2xlarge 1</td><td>2375</td><td>4750</td><td>296.88</td><td>593.75</td><td>12000</td><td>20000</td></tr>
  <tr><td>r6gd.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>r6gd.8xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>r6gd.12xlarge 2</td><td colspan="2">14250</td><td colspan="2">1781.25</td><td colspan="2">50000</td></tr>
  <tr><td>r6gd.16xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r6gd.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>r6i.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r6i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r6i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r6i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r6i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r6i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r6i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r6i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r6i.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r6i.metal 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r6id.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r6id.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r6id.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r6id.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r6id.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r6id.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r6id.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r6id.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r6id.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r6id.metal 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r6idn.large 1</td><td>1562</td><td>25000</td><td>195.31</td><td>3125.00</td><td>6250</td><td>100000</td></tr>
  <tr><td>r6idn.xlarge 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>12500</td><td>100000</td></tr>
  <tr><td>r6idn.2xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>25000</td><td>100000</td></tr>
  <tr><td>r6idn.4xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>50000</td><td>100000</td></tr>
  <tr><td>r6idn.8xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">100000</td></tr>
  <tr><td>r6idn.12xlarge 2</td><td colspan="2">37500</td><td colspan="2">4687.5</td><td colspan="2">150000</td></tr>
  <tr><td>r6idn.16xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">200000</td></tr>
  <tr><td>r6idn.24xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">300000</td></tr>
  <tr><td>r6idn.32xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>r6idn.metal 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>r6in.large 1</td><td>1562</td><td>25000</td><td>195.31</td><td>3125.00</td><td>6250</td><td>100000</td></tr>
  <tr><td>r6in.xlarge 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>12500</td><td>100000</td></tr>
  <tr><td>r6in.2xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>25000</td><td>100000</td></tr>
  <tr><td>r6in.4xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>50000</td><td>100000</td></tr>
  <tr><td>r6in.8xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">100000</td></tr>
  <tr><td>r6in.12xlarge 2</td><td colspan="2">37500</td><td colspan="2">4687.5</td><td colspan="2">150000</td></tr>
  <tr><td>r6in.16xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">200000</td></tr>
  <tr><td>r6in.24xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">300000</td></tr>
  <tr><td>r6in.32xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>r6in.metal 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>r7a.medium 1</td><td>325</td><td>10000</td><td>40.62</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>r7a.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r7a.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r7a.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r7a.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r7a.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r7a.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r7a.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r7a.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r7a.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r7a.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>r7a.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>r7g.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>r7g.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r7g.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r7g.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r7g.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r7g.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r7g.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r7g.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r7g.metal 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r7gd.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>r7gd.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r7gd.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r7gd.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r7gd.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r7gd.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r7gd.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r7gd.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r7gd.metal 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r7i.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r7i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r7i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r7i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r7i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r7i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r7i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r7i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r7i.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>r7i.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r7i.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>r7iz.large 1</td><td>792</td><td>10000</td><td>99.00</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r7iz.xlarge 1</td><td>1584</td><td>10000</td><td>198.00</td><td>1250.00</td><td>6667</td><td>40000</td></tr>
  <tr><td>r7iz.2xlarge 1</td><td>3168</td><td>10000</td><td>396.00</td><td>1250.00</td><td>13333</td><td>40000</td></tr>
  <tr><td>r7iz.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r7iz.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r7iz.12xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">76000</td></tr>
  <tr><td>r7iz.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r7iz.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r7iz.metal-16xl 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r7iz.metal-32xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r8a.medium 1</td><td>325</td><td>10000</td><td>40.62</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>r8a.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r8a.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r8a.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r8a.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r8a.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r8a.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r8a.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r8a.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8a.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8a.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8a.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8g.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>r8g.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r8g.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r8g.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r8g.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r8g.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r8g.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r8g.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r8g.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8g.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8g.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8g.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8gb.medium 1</td><td>1562</td><td>25000</td><td>195.31</td><td>3125.00</td><td>7500</td><td>120000</td></tr>
  <tr><td>r8gb.large 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>15000</td><td>120000</td></tr>
  <tr><td>r8gb.xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>30000</td><td>120000</td></tr>
  <tr><td>r8gb.2xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>60000</td><td>120000</td></tr>
  <tr><td>r8gb.4xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8gb.8xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8gb.12xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">360000</td></tr>
  <tr><td>r8gb.16xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8gb.24xlarge 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>r8gb.48xlarge 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>r8gb.metal-24xl 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>r8gb.metal-48xl 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>r8gd.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>r8gd.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r8gd.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r8gd.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r8gd.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r8gd.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r8gd.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r8gd.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r8gd.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8gd.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8gd.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8gd.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8gn.medium 1</td><td>760</td><td>10000</td><td>95.00</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>r8gn.large 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5000</td><td>40000</td></tr>
  <tr><td>r8gn.xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10000</td><td>40000</td></tr>
  <tr><td>r8gn.2xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r8gn.4xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r8gn.8xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r8gn.12xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8gn.16xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r8gn.24xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8gn.48xlarge 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8gn.metal-24xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8gn.metal-48xl 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8i.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r8i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r8i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r8i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r8i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r8i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r8i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r8i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8i.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r8i.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8i.96xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8i.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8i.metal-96xl 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8id.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r8id.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r8id.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r8id.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r8id.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r8id.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r8id.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r8id.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8id.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r8id.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8id.96xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8id.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8id.metal-96xl 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8i-flex.large 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>r8i-flex.xlarge 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r8i-flex.2xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r8i-flex.4xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r8i-flex.8xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r8i-flex.12xlarge 1</td><td>7500</td><td>15000</td><td>937.50</td><td>1875.00</td><td>30000</td><td>60000</td></tr>
  <tr><td>r8i-flex.16xlarge 1</td><td>10000</td><td>20000</td><td>1250.00</td><td>2500.00</td><td>40000</td><td>80000</td></tr>
  <tr><td>r8in.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r8in.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r8in.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r8in.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r8in.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r8in.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r8in.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r8in.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8in.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r8in.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8in.96xlarge 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8in.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8in.metal-96xl 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8idn.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>r8idn.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>r8idn.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>r8idn.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>r8idn.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>r8idn.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>r8idn.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>r8idn.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8idn.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>r8idn.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8idn.96xlarge 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8idn.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8idn.metal-96xl 2</td><td colspan="2">120000</td><td colspan="2">15000.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8ib.large 1</td><td>1563</td><td>25000</td><td>195.38</td><td>3125.00</td><td>7500</td><td>120000</td></tr>
  <tr><td>r8ib.xlarge 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>15000</td><td>120000</td></tr>
  <tr><td>r8ib.2xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>30000</td><td>120000</td></tr>
  <tr><td>r8ib.4xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>60000</td><td>120000</td></tr>
  <tr><td>r8ib.8xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8ib.12xlarge 2</td><td colspan="2">37500</td><td colspan="2">4687.5</td><td colspan="2">180000</td></tr>
  <tr><td>r8ib.16xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8ib.24xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">360000</td></tr>
  <tr><td>r8ib.32xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8ib.48xlarge 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>r8ib.96xlarge 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>r8ib.metal-48xl 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>r8ib.metal-96xl 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>r8idb.large 1</td><td>1563</td><td>25000</td><td>195.38</td><td>3125.00</td><td>7500</td><td>120000</td></tr>
  <tr><td>r8idb.xlarge 1</td><td>3125</td><td>25000</td><td>390.62</td><td>3125.00</td><td>15000</td><td>120000</td></tr>
  <tr><td>r8idb.2xlarge 1</td><td>6250</td><td>25000</td><td>781.25</td><td>3125.00</td><td>30000</td><td>120000</td></tr>
  <tr><td>r8idb.4xlarge 1</td><td>12500</td><td>25000</td><td>1562.50</td><td>3125.00</td><td>60000</td><td>120000</td></tr>
  <tr><td>r8idb.8xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">120000</td></tr>
  <tr><td>r8idb.12xlarge 2</td><td colspan="2">37500</td><td colspan="2">4687.5</td><td colspan="2">180000</td></tr>
  <tr><td>r8idb.16xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">240000</td></tr>
  <tr><td>r8idb.24xlarge 2</td><td colspan="2">75000</td><td colspan="2">9375.0</td><td colspan="2">360000</td></tr>
  <tr><td>r8idb.32xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">480000</td></tr>
  <tr><td>r8idb.48xlarge 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>r8idb.96xlarge 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>r8idb.metal-48xl 2</td><td colspan="2">150000</td><td colspan="2">18750.0</td><td colspan="2">720000</td></tr>
  <tr><td>r8idb.metal-96xl 2</td><td colspan="2">300000</td><td colspan="2">37500.0</td><td colspan="2">1440000</td></tr>
  <tr><td>r9g.medium 1</td><td>380</td><td>12000</td><td>47.50</td><td>1500.00</td><td>2500</td><td>48000</td></tr>
  <tr><td>r9g.large 1</td><td>760</td><td>12000</td><td>95.00</td><td>1500.00</td><td>3600</td><td>48000</td></tr>
  <tr><td>r9g.xlarge 1</td><td>1500</td><td>12000</td><td>187.50</td><td>1500.00</td><td>6000</td><td>48000</td></tr>
  <tr><td>r9g.2xlarge 1</td><td>3000</td><td>12000</td><td>375.00</td><td>1500.00</td><td>12000</td><td>48000</td></tr>
  <tr><td>r9g.4xlarge 1</td><td>6000</td><td>12000</td><td>750.00</td><td>1500.00</td><td>24000</td><td>48000</td></tr>
  <tr><td>r9g.8xlarge 2</td><td colspan="2">12000</td><td colspan="2">1500.0</td><td colspan="2">48000</td></tr>
  <tr><td>r9g.12xlarge 2</td><td colspan="2">18000</td><td colspan="2">2250.0</td><td colspan="2">72000</td></tr>
  <tr><td>r9g.16xlarge 2</td><td colspan="2">24000</td><td colspan="2">3000.0</td><td colspan="2">96000</td></tr>
  <tr><td>r9g.24xlarge 2</td><td colspan="2">36000</td><td colspan="2">4500.0</td><td colspan="2">144000</td></tr>
  <tr><td>r9g.48xlarge 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
  <tr><td>r9g.metal-48xl 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
  <tr><td>r9gd.medium 1</td><td>380</td><td>12000</td><td>47.50</td><td>1500.00</td><td>2500</td><td>48000</td></tr>
  <tr><td>r9gd.large 1</td><td>760</td><td>12000</td><td>95.00</td><td>1500.00</td><td>3600</td><td>48000</td></tr>
  <tr><td>r9gd.xlarge 1</td><td>1500</td><td>12000</td><td>187.50</td><td>1500.00</td><td>6000</td><td>48000</td></tr>
  <tr><td>r9gd.2xlarge 1</td><td>3000</td><td>12000</td><td>375.00</td><td>1500.00</td><td>12000</td><td>48000</td></tr>
  <tr><td>r9gd.4xlarge 1</td><td>6000</td><td>12000</td><td>750.00</td><td>1500.00</td><td>24000</td><td>48000</td></tr>
  <tr><td>r9gd.8xlarge 2</td><td colspan="2">12000</td><td colspan="2">1500.0</td><td colspan="2">48000</td></tr>
  <tr><td>r9gd.12xlarge 2</td><td colspan="2">18000</td><td colspan="2">2250.0</td><td colspan="2">72000</td></tr>
  <tr><td>r9gd.16xlarge 2</td><td colspan="2">24000</td><td colspan="2">3000.0</td><td colspan="2">96000</td></tr>
  <tr><td>r9gd.24xlarge 2</td><td colspan="2">36000</td><td colspan="2">4500.0</td><td colspan="2">144000</td></tr>
  <tr><td>r9gd.48xlarge 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
  <tr><td>r9gd.metal-48xl 2</td><td colspan="2">72000</td><td colspan="2">9000.0</td><td colspan="2">288000</td></tr>
  <tr><td>u-3tb1.56xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>u-6tb1.56xlarge 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>u-6tb1.112xlarge 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>u-6tb1.metal 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>u-9tb1.112xlarge 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>u-9tb1.metal 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>u-12tb1.112xlarge 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>u-12tb1.metal 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>u-18tb1.112xlarge 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>u-18tb1.metal 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>u-24tb1.112xlarge 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>u-24tb1.metal 2</td><td colspan="2">38000</td><td colspan="2">4750.0</td><td colspan="2">160000</td></tr>
  <tr><td>u7i-6tb.112xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">560000</td></tr>
  <tr><td>u7i-8tb.112xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">560000</td></tr>
  <tr><td>u7i-12tb.224xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">560000</td></tr>
  <tr><td>u7in-16tb.224xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">560000</td></tr>
  <tr><td>u7in-24tb.224xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">560000</td></tr>
  <tr><td>u7in-32tb.224xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">560000</td></tr>
  <tr><td>u7inh-32tb.480xlarge 2</td><td colspan="2">160000</td><td colspan="2">20000.0</td><td colspan="2">840000</td></tr>
  <tr><td>x1.16xlarge 2</td><td colspan="2">7000</td><td colspan="2">875.0</td><td colspan="2">40000</td></tr>
  <tr><td>x1.32xlarge 2</td><td colspan="2">14000</td><td colspan="2">1750.0</td><td colspan="2">80000</td></tr>
  <tr><td>x1e.xlarge 2</td><td colspan="2">500</td><td colspan="2">62.5</td><td colspan="2">3700</td></tr>
  <tr><td>x1e.2xlarge 2</td><td colspan="2">1000</td><td colspan="2">125.0</td><td colspan="2">7400</td></tr>
  <tr><td>x1e.4xlarge 2</td><td colspan="2">1750</td><td colspan="2">218.75</td><td colspan="2">10000</td></tr>
  <tr><td>x1e.8xlarge 2</td><td colspan="2">3500</td><td colspan="2">437.5</td><td colspan="2">20000</td></tr>
  <tr><td>x1e.16xlarge 2</td><td colspan="2">7000</td><td colspan="2">875.0</td><td colspan="2">40000</td></tr>
  <tr><td>x1e.32xlarge 2</td><td colspan="2">14000</td><td colspan="2">1750.0</td><td colspan="2">80000</td></tr>
  <tr><td>x2gd.medium 1</td><td>315</td><td>4750</td><td>39.38</td><td>593.75</td><td>2500</td><td>20000</td></tr>
  <tr><td>x2gd.large 1</td><td>630</td><td>4750</td><td>78.75</td><td>593.75</td><td>3600</td><td>20000</td></tr>
  <tr><td>x2gd.xlarge 1</td><td>1188</td><td>4750</td><td>148.50</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>x2gd.2xlarge 1</td><td>2375</td><td>4750</td><td>296.88</td><td>593.75</td><td>12000</td><td>20000</td></tr>
  <tr><td>x2gd.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>x2gd.8xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>x2gd.12xlarge 2</td><td colspan="2">14250</td><td colspan="2">1781.25</td><td colspan="2">60000</td></tr>
  <tr><td>x2gd.16xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>x2gd.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>x2idn.16xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">173333</td></tr>
  <tr><td>x2idn.24xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">260000</td></tr>
  <tr><td>x2idn.32xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">260000</td></tr>
  <tr><td>x2idn.metal 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">260000</td></tr>
  <tr><td>x2iedn.xlarge 1</td><td>2500</td><td>20000</td><td>312.50</td><td>2500.00</td><td>8125</td><td>65000</td></tr>
  <tr><td>x2iedn.2xlarge 1</td><td>5000</td><td>20000</td><td>625.00</td><td>2500.00</td><td>16250</td><td>65000</td></tr>
  <tr><td>x2iedn.4xlarge 1</td><td>10000</td><td>20000</td><td>1250.00</td><td>2500.00</td><td>32500</td><td>65000</td></tr>
  <tr><td>x2iedn.8xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">65000</td></tr>
  <tr><td>x2iedn.16xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">130000</td></tr>
  <tr><td>x2iedn.24xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">195000</td></tr>
  <tr><td>x2iedn.32xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">260000</td></tr>
  <tr><td>x2iedn.metal 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">260000</td></tr>
  <tr><td>x2iezn.2xlarge 2</td><td colspan="2">3170</td><td colspan="2">396.25</td><td colspan="2">13333</td></tr>
  <tr><td>x2iezn.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>x2iezn.6xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>x2iezn.8xlarge 2</td><td colspan="2">12000</td><td colspan="2">1500.0</td><td colspan="2">55000</td></tr>
  <tr><td>x2iezn.12xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>x2iezn.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>x8g.medium 1</td><td>315</td><td>10000</td><td>39.38</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>x8g.large 1</td><td>630</td><td>10000</td><td>78.75</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>x8g.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>x8g.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>x8g.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>x8g.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>x8g.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>x8g.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>x8g.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>x8g.48xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>x8g.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>x8g.metal-48xl 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">240000</td></tr>
  <tr><td>x8aedz.large 1</td><td>1250</td><td>15000</td><td>156.25</td><td>1875.00</td><td>5000</td><td>60000</td></tr>
  <tr><td>x8aedz.xlarge 1</td><td>2500</td><td>15000</td><td>312.50</td><td>1875.00</td><td>10000</td><td>60000</td></tr>
  <tr><td>x8aedz.3xlarge 1</td><td>7500</td><td>15000</td><td>937.50</td><td>1875.00</td><td>30000</td><td>60000</td></tr>
  <tr><td>x8aedz.6xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>x8aedz.12xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>x8aedz.24xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>x8aedz.metal-12xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>x8aedz.metal-24xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>x8i.large 1</td><td>650</td><td>10000</td><td>81.25</td><td>1250.00</td><td>3600</td><td>40000</td></tr>
  <tr><td>x8i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>x8i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>12000</td><td>40000</td></tr>
  <tr><td>x8i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>x8i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>x8i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>x8i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>x8i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>x8i.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>x8i.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>x8i.64xlarge 2</td><td colspan="2">70000</td><td colspan="2">8750.0</td><td colspan="2">320000</td></tr>
  <tr><td>x8i.96xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>x8i.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>x8i.metal-96xl 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">480000</td></tr>
  <tr><td>z1d.large 1</td><td>800</td><td>3170</td><td>100.00</td><td>396.25</td><td>3333</td><td>13333</td></tr>
  <tr><td>z1d.xlarge 1</td><td>1580</td><td>3170</td><td>197.50</td><td>396.25</td><td>6667</td><td>13333</td></tr>
  <tr><td>z1d.2xlarge 2</td><td colspan="2">3170</td><td colspan="2">396.25</td><td colspan="2">13333</td></tr>
  <tr><td>z1d.3xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>z1d.6xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>z1d.12xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>z1d.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
</tbody>
</table>


1 这些实例可以至少每 24 小时维持一次 30 分钟的最大性能，之后会恢复到基线性能。

2 这些实例可以无限期地维持其既定性能。如果工作负载需要在超过 30 分钟的时长内保持最大性能，请选择以下任一实例。

### 存储优化
<a name="current-storage-optimized"></a>


<table>
<thead>
  <tr><th>实例大小</th><th>基准带宽（Mbps）</th><th>最大带宽（Mbps）</th><th>基准吞吐量（MB/s，128 KiB I/O）</th><th>最大吞吐量（MB/s，128 KiB I/O）</th><th>基准 IOPS（16KiB I/O）</th><th>最大 IOPS（16KiB I/O）</th></tr>
</thead>
<tbody>
  <tr><td>d2.xlarge 2</td><td colspan="2">750</td><td colspan="2">93.75</td><td colspan="2">6000</td></tr>
  <tr><td>d2.2xlarge 2</td><td colspan="2">1000</td><td colspan="2">125.0</td><td colspan="2">8000</td></tr>
  <tr><td>d2.4xlarge 2</td><td colspan="2">2000</td><td colspan="2">250.0</td><td colspan="2">16000</td></tr>
  <tr><td>d2.8xlarge 2</td><td colspan="2">4000</td><td colspan="2">500.0</td><td colspan="2">32000</td></tr>
  <tr><td>d3.xlarge 1</td><td>850</td><td>2800</td><td>106.25</td><td>350.00</td><td>5000</td><td>15000</td></tr>
  <tr><td>d3.2xlarge 1</td><td>1700</td><td>2800</td><td>212.50</td><td>350.00</td><td>10000</td><td>15000</td></tr>
  <tr><td>d3.4xlarge 2</td><td colspan="2">2800</td><td colspan="2">350.0</td><td colspan="2">15000</td></tr>
  <tr><td>d3.8xlarge 2</td><td colspan="2">5000</td><td colspan="2">625.0</td><td colspan="2">30000</td></tr>
  <tr><td>d3en.xlarge 1</td><td>850</td><td>2800</td><td>106.25</td><td>350.00</td><td>5000</td><td>15000</td></tr>
  <tr><td>d3en.2xlarge 1</td><td>1700</td><td>2800</td><td>212.50</td><td>350.00</td><td>10000</td><td>15000</td></tr>
  <tr><td>d3en.4xlarge 2</td><td colspan="2">2800</td><td colspan="2">350.0</td><td colspan="2">15000</td></tr>
  <tr><td>d3en.6xlarge 2</td><td colspan="2">4000</td><td colspan="2">500.0</td><td colspan="2">25000</td></tr>
  <tr><td>d3en.8xlarge 2</td><td colspan="2">5000</td><td colspan="2">625.0</td><td colspan="2">30000</td></tr>
  <tr><td>d3en.12xlarge 2</td><td colspan="2">7000</td><td colspan="2">875.0</td><td colspan="2">40000</td></tr>
  <tr><td>h1.2xlarge 2</td><td colspan="2">1750</td><td colspan="2">218.75</td><td colspan="2">12000</td></tr>
  <tr><td>h1.4xlarge 2</td><td colspan="2">3500</td><td colspan="2">437.5</td><td colspan="2">20000</td></tr>
  <tr><td>h1.8xlarge 2</td><td colspan="2">7000</td><td colspan="2">875.0</td><td colspan="2">40000</td></tr>
  <tr><td>h1.16xlarge 2</td><td colspan="2">14000</td><td colspan="2">1750.0</td><td colspan="2">80000</td></tr>
  <tr><td>i3.large 2</td><td colspan="2">425</td><td colspan="2">53.125</td><td colspan="2">3000</td></tr>
  <tr><td>i3.xlarge 2</td><td colspan="2">850</td><td colspan="2">106.25</td><td colspan="2">6000</td></tr>
  <tr><td>i3.2xlarge 2</td><td colspan="2">1700</td><td colspan="2">212.5</td><td colspan="2">12000</td></tr>
  <tr><td>i3.4xlarge 2</td><td colspan="2">3500</td><td colspan="2">437.5</td><td colspan="2">16000</td></tr>
  <tr><td>i3.8xlarge 2</td><td colspan="2">7000</td><td colspan="2">875.0</td><td colspan="2">32500</td></tr>
  <tr><td>i3.16xlarge 2</td><td colspan="2">14000</td><td colspan="2">1750.0</td><td colspan="2">65000</td></tr>
  <tr><td>i3.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>i3en.large 1</td><td>576</td><td>4750</td><td>72.10</td><td>593.75</td><td>3000</td><td>20000</td></tr>
  <tr><td>i3en.xlarge 1</td><td>1153</td><td>4750</td><td>144.20</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>i3en.2xlarge 1</td><td>2307</td><td>4750</td><td>288.39</td><td>593.75</td><td>12000</td><td>20000</td></tr>
  <tr><td>i3en.3xlarge 1</td><td>3800</td><td>4750</td><td>475.00</td><td>593.75</td><td>15000</td><td>20000</td></tr>
  <tr><td>i3en.6xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>i3en.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>i3en.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>i3en.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>i4g.large 1</td><td>625</td><td>10000</td><td>78.12</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>i4g.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5000</td><td>40000</td></tr>
  <tr><td>i4g.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10000</td><td>40000</td></tr>
  <tr><td>i4g.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>i4g.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>i4g.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>i4i.large 1</td><td>625</td><td>10000</td><td>78.12</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>i4i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5000</td><td>40000</td></tr>
  <tr><td>i4i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10000</td><td>40000</td></tr>
  <tr><td>i4i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>i4i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>i4i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>i4i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>i4i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>i4i.32xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>i4i.metal 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>i7i.large 1</td><td>625</td><td>10000</td><td>78.12</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>i7i.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5000</td><td>40000</td></tr>
  <tr><td>i7i.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10000</td><td>40000</td></tr>
  <tr><td>i7i.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>i7i.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>i7i.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>i7i.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>i7i.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>i7i.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>i7i.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>i7i.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>i7ie.large 1</td><td>625</td><td>10000</td><td>78.12</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>i7ie.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5000</td><td>40000</td></tr>
  <tr><td>i7ie.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10000</td><td>40000</td></tr>
  <tr><td>i7ie.3xlarge 1</td><td>3750</td><td>10000</td><td>468.75</td><td>1250.00</td><td>15000</td><td>40000</td></tr>
  <tr><td>i7ie.6xlarge 1</td><td>7500</td><td>10000</td><td>937.50</td><td>1250.00</td><td>30000</td><td>40000</td></tr>
  <tr><td>i7ie.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>i7ie.18xlarge 2</td><td colspan="2">22500</td><td colspan="2">2812.5</td><td colspan="2">90000</td></tr>
  <tr><td>i7ie.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>i7ie.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>i7ie.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>i7ie.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>i8g.large 1</td><td>625</td><td>10000</td><td>78.12</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>i8g.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5000</td><td>40000</td></tr>
  <tr><td>i8g.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10000</td><td>40000</td></tr>
  <tr><td>i8g.4xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>i8g.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>i8g.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>i8g.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>i8g.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>i8g.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>i8g.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>i8g.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>i8ge.large 1</td><td>625</td><td>10000</td><td>78.12</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>i8ge.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5000</td><td>40000</td></tr>
  <tr><td>i8ge.2xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10000</td><td>40000</td></tr>
  <tr><td>i8ge.3xlarge 1</td><td>3750</td><td>10000</td><td>468.75</td><td>1250.00</td><td>15000</td><td>40000</td></tr>
  <tr><td>i8ge.6xlarge 1</td><td>7500</td><td>10000</td><td>937.50</td><td>1250.00</td><td>30000</td><td>40000</td></tr>
  <tr><td>i8ge.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>i8ge.18xlarge 2</td><td colspan="2">22500</td><td colspan="2">2812.5</td><td colspan="2">90000</td></tr>
  <tr><td>i8ge.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>i8ge.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>i8ge.metal-24xl 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>i8ge.metal-48xl 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>im4gn.large 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5000</td><td>40000</td></tr>
  <tr><td>im4gn.xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10000</td><td>40000</td></tr>
  <tr><td>im4gn.2xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>im4gn.4xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>im4gn.8xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>im4gn.16xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>is4gen.medium 1</td><td>625</td><td>10000</td><td>78.12</td><td>1250.00</td><td>2500</td><td>40000</td></tr>
  <tr><td>is4gen.large 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>5000</td><td>40000</td></tr>
  <tr><td>is4gen.xlarge 1</td><td>2500</td><td>10000</td><td>312.50</td><td>1250.00</td><td>10000</td><td>40000</td></tr>
  <tr><td>is4gen.2xlarge 1</td><td>5000</td><td>10000</td><td>625.00</td><td>1250.00</td><td>20000</td><td>40000</td></tr>
  <tr><td>is4gen.4xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>is4gen.8xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
</tbody>
</table>


1 这些实例可以至少每 24 小时维持一次 30 分钟的最大性能，之后会恢复到基线性能。

2 这些实例可以无限期地维持其既定性能。如果工作负载需要在超过 30 分钟的时长内保持最大性能，请选择以下任一实例。

### 加速计算型
<a name="current-accelerated-computing"></a>


<table>
<thead>
  <tr><th>实例大小</th><th>基准带宽（Mbps）</th><th>最大带宽（Mbps）</th><th>基准吞吐量（MB/s，128 KiB I/O）</th><th>最大吞吐量（MB/s，128 KiB I/O）</th><th>基准 IOPS（16KiB I/O）</th><th>最大 IOPS（16KiB I/O）</th></tr>
</thead>
<tbody>
  <tr><td>dl1.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>dl2q.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>f2.6xlarge 2</td><td colspan="2">7500</td><td colspan="2">937.5</td><td colspan="2">30000</td></tr>
  <tr><td>f2.12xlarge 2</td><td colspan="2">15000</td><td colspan="2">1875.0</td><td colspan="2">60000</td></tr>
  <tr><td>f2.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>g3.4xlarge 2</td><td colspan="2">3500</td><td colspan="2">437.5</td><td colspan="2">20000</td></tr>
  <tr><td>g3.8xlarge 2</td><td colspan="2">7000</td><td colspan="2">875.0</td><td colspan="2">40000</td></tr>
  <tr><td>g3.16xlarge 2</td><td colspan="2">14000</td><td colspan="2">1750.0</td><td colspan="2">80000</td></tr>
  <tr><td>g4ad.xlarge 1</td><td>400</td><td>3170</td><td>50.00</td><td>396.25</td><td>1700</td><td>13333</td></tr>
  <tr><td>g4ad.2xlarge 1</td><td>800</td><td>3170</td><td>100.00</td><td>396.25</td><td>3400</td><td>13333</td></tr>
  <tr><td>g4ad.4xlarge 1</td><td>1580</td><td>3170</td><td>197.50</td><td>396.25</td><td>6700</td><td>13333</td></tr>
  <tr><td>g4ad.8xlarge 2</td><td colspan="2">3170</td><td colspan="2">396.25</td><td colspan="2">13333</td></tr>
  <tr><td>g4ad.16xlarge 2</td><td colspan="2">6300</td><td colspan="2">787.5</td><td colspan="2">26667</td></tr>
  <tr><td>g4dn.xlarge 1</td><td>950</td><td>3500</td><td>118.75</td><td>437.50</td><td>3000</td><td>20000</td></tr>
  <tr><td>g4dn.2xlarge 1</td><td>1150</td><td>3500</td><td>143.75</td><td>437.50</td><td>6000</td><td>20000</td></tr>
  <tr><td>g4dn.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>g4dn.8xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>g4dn.12xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>g4dn.16xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>g4dn.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>g5.xlarge 1</td><td>700</td><td>3500</td><td>87.50</td><td>437.50</td><td>3000</td><td>15000</td></tr>
  <tr><td>g5.2xlarge 1</td><td>850</td><td>3500</td><td>106.25</td><td>437.50</td><td>3500</td><td>15000</td></tr>
  <tr><td>g5.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>g5.8xlarge 2</td><td colspan="2">16000</td><td colspan="2">2000.0</td><td colspan="2">65000</td></tr>
  <tr><td>g5.12xlarge 2</td><td colspan="2">16000</td><td colspan="2">2000.0</td><td colspan="2">65000</td></tr>
  <tr><td>g5.16xlarge 2</td><td colspan="2">16000</td><td colspan="2">2000.0</td><td colspan="2">65000</td></tr>
  <tr><td>g5.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>g5.48xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>g5g.xlarge 1</td><td>1188</td><td>4750</td><td>148.50</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>g5g.2xlarge 1</td><td>2375</td><td>4750</td><td>296.88</td><td>593.75</td><td>12000</td><td>20000</td></tr>
  <tr><td>g5g.4xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>g5g.8xlarge 2</td><td colspan="2">9500</td><td colspan="2">1187.5</td><td colspan="2">40000</td></tr>
  <tr><td>g5g.16xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>g5g.metal 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>g6.xlarge 1</td><td>1000</td><td>5000</td><td>125.00</td><td>625.00</td><td>4000</td><td>20000</td></tr>
  <tr><td>g6.2xlarge 1</td><td>2000</td><td>5000</td><td>250.00</td><td>625.00</td><td>8000</td><td>20000</td></tr>
  <tr><td>g6.4xlarge 2</td><td colspan="2">8000</td><td colspan="2">1000.0</td><td colspan="2">32000</td></tr>
  <tr><td>g6.8xlarge 2</td><td colspan="2">16000</td><td colspan="2">2000.0</td><td colspan="2">64000</td></tr>
  <tr><td>g6.12xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>g6.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>g6.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>g6.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>g6e.xlarge 1</td><td>1000</td><td>5000</td><td>125.00</td><td>625.00</td><td>4000</td><td>20000</td></tr>
  <tr><td>g6e.2xlarge 1</td><td>2000</td><td>5000</td><td>250.00</td><td>625.00</td><td>8000</td><td>20000</td></tr>
  <tr><td>g6e.4xlarge 2</td><td colspan="2">8000</td><td colspan="2">1000.0</td><td colspan="2">32000</td></tr>
  <tr><td>g6e.8xlarge 2</td><td colspan="2">16000</td><td colspan="2">2000.0</td><td colspan="2">64000</td></tr>
  <tr><td>g6e.12xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>g6e.16xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>g6e.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>g6e.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>g6f.large 1</td><td>936</td><td>5000</td><td>117.00</td><td>625.00</td><td>3750</td><td>20000</td></tr>
  <tr><td>g6f.xlarge 1</td><td>1000</td><td>5000</td><td>125.00</td><td>625.00</td><td>4000</td><td>20000</td></tr>
  <tr><td>g6f.2xlarge 1</td><td>2000</td><td>5000</td><td>250.00</td><td>625.00</td><td>8000</td><td>20000</td></tr>
  <tr><td>g6f.4xlarge 2</td><td colspan="2">6000</td><td colspan="2">750.0</td><td colspan="2">24000</td></tr>
  <tr><td>gr6.4xlarge 2</td><td colspan="2">8000</td><td colspan="2">1000.0</td><td colspan="2">32000</td></tr>
  <tr><td>gr6.8xlarge 2</td><td colspan="2">16000</td><td colspan="2">2000.0</td><td colspan="2">64000</td></tr>
  <tr><td>gr6f.4xlarge 2</td><td colspan="2">8000</td><td colspan="2">1000.0</td><td colspan="2">32000</td></tr>
  <tr><td>g7.2xlarge 1</td><td>4000</td><td>8000</td><td>500.00</td><td>1000.00</td><td>16000</td><td>32000</td></tr>
  <tr><td>g7.4xlarge 2</td><td colspan="2">8000</td><td colspan="2">1000.0</td><td colspan="2">32000</td></tr>
  <tr><td>g7.8xlarge 2</td><td colspan="2">16000</td><td colspan="2">2000.0</td><td colspan="2">64000</td></tr>
  <tr><td>g7.12xlarge 2</td><td colspan="2">20000</td><td colspan="2">2500.0</td><td colspan="2">80000</td></tr>
  <tr><td>g7.24xlarge 2</td><td colspan="2">40000</td><td colspan="2">5000.0</td><td colspan="2">160000</td></tr>
  <tr><td>g7.48xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">320000</td></tr>
  <tr><td>g7e.2xlarge 1</td><td>2000</td><td>5000</td><td>250.00</td><td>625.00</td><td>8000</td><td>20000</td></tr>
  <tr><td>g7e.4xlarge 2</td><td colspan="2">8000</td><td colspan="2">1000.0</td><td colspan="2">32000</td></tr>
  <tr><td>g7e.8xlarge 2</td><td colspan="2">16000</td><td colspan="2">2000.0</td><td colspan="2">64000</td></tr>
  <tr><td>g7e.12xlarge 2</td><td colspan="2">25000</td><td colspan="2">3125.0</td><td colspan="2">100000</td></tr>
  <tr><td>g7e.24xlarge 2</td><td colspan="2">50000</td><td colspan="2">6250.0</td><td colspan="2">200000</td></tr>
  <tr><td>g7e.48xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>inf1.xlarge 1</td><td>1190</td><td>4750</td><td>148.75</td><td>593.75</td><td>4000</td><td>20000</td></tr>
  <tr><td>inf1.2xlarge 1</td><td>1190</td><td>4750</td><td>148.75</td><td>593.75</td><td>6000</td><td>20000</td></tr>
  <tr><td>inf1.6xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>inf1.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>inf2.xlarge 1</td><td>1250</td><td>10000</td><td>156.25</td><td>1250.00</td><td>6000</td><td>40000</td></tr>
  <tr><td>inf2.8xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">40000</td></tr>
  <tr><td>inf2.24xlarge 2</td><td colspan="2">30000</td><td colspan="2">3750.0</td><td colspan="2">120000</td></tr>
  <tr><td>inf2.48xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>p3.2xlarge 2</td><td colspan="2">1750</td><td colspan="2">218.75</td><td colspan="2">10000</td></tr>
  <tr><td>p3.8xlarge 2</td><td colspan="2">7000</td><td colspan="2">875.0</td><td colspan="2">40000</td></tr>
  <tr><td>p3.16xlarge 2</td><td colspan="2">14000</td><td colspan="2">1750.0</td><td colspan="2">80000</td></tr>
  <tr><td>p3dn.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>p4d.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>p4de.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
  <tr><td>p5.4xlarge 2</td><td colspan="2">10000</td><td colspan="2">1250.0</td><td colspan="2">32500</td></tr>
  <tr><td>p5.48xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">260000</td></tr>
  <tr><td>p5e.48xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">260000</td></tr>
  <tr><td>p5en.48xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>p6-b200.48xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>p6-b300.48xlarge 2</td><td colspan="2">100000</td><td colspan="2">12500.0</td><td colspan="2">400000</td></tr>
  <tr><td>p6e-gb200.36xlarge 2</td><td colspan="2">60000</td><td colspan="2">7500.0</td><td colspan="2">240000</td></tr>
  <tr><td>trn1.2xlarge 1</td><td>5000</td><td>20000</td><td>625.00</td><td>2500.00</td><td>16250</td><td>65000</td></tr>
  <tr><td>trn1.32xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">260000</td></tr>
  <tr><td>trn1n.32xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">260000</td></tr>
  <tr><td>trn2.3xlarge 2</td><td colspan="2">5000</td><td colspan="2">625.0</td><td colspan="2">16250</td></tr>
  <tr><td>trn2.48xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">260000</td></tr>
  <tr><td>trn2u.48xlarge 2</td><td colspan="2">80000</td><td colspan="2">10000.0</td><td colspan="2">260000</td></tr>
  <tr><td>vt1.3xlarge 1</td><td>2375</td><td>4750</td><td>296.88</td><td>593.75</td><td>10000</td><td>20000</td></tr>
  <tr><td>vt1.6xlarge 2</td><td colspan="2">4750</td><td colspan="2">593.75</td><td colspan="2">20000</td></tr>
  <tr><td>vt1.24xlarge 2</td><td colspan="2">19000</td><td colspan="2">2375.0</td><td colspan="2">80000</td></tr>
</tbody>
</table>


1 这些实例可以至少每 24 小时维持一次 30 分钟的最大性能，之后会恢复到基线性能。

2 这些实例可以无限期地维持其既定性能。如果工作负载需要在超过 30 分钟的时长内保持最大性能，请选择以下任一实例。

### 高性能计算
<a name="current-high-performance-computing"></a>


| 实例大小 | 基准带宽（Mbps） | 最大带宽（Mbps） | 基准吞吐量（MB/s，128 KiB I/O） | 最大吞吐量（MB/s，128 KiB I/O） | 基准 IOPS（16KiB I/O） | 最大 IOPS（16KiB I/O） | 
| --- | --- | --- | --- | --- | --- | --- | 
| hpc6a.48xlarge 1 | 87 | 2085 | 10.88 | 260.62 | 500 | 11000 | 
| hpc6id.32xlarge 1 | 87 | 2085 | 10.88 | 260.62 | 500 | 11000 | 
| hpc7a.12xlarge 1 | 87 | 2085 | 10.88 | 260.62 | 500 | 11000 | 
| hpc7a.24xlarge 1 | 87 | 2085 | 10.88 | 260.62 | 500 | 11000 | 
| hpc7a.48xlarge 1 | 87 | 2085 | 10.88 | 260.62 | 500 | 11000 | 
| hpc7a.96xlarge 1 | 87 | 2085 | 10.88 | 260.62 | 500 | 11000 | 
| hpc7g.4xlarge 1 | 87 | 2085 | 10.88 | 260.62 | 500 | 11000 | 
| hpc7g.8xlarge 1 | 87 | 2085 | 10.88 | 260.62 | 500 | 11000 | 
| hpc7g.16xlarge 1 | 87 | 2085 | 10.88 | 260.62 | 500 | 11000 | 
| hpc8a.96xlarge 1 | 87 | 2085 | 10.88 | 260.62 | 500 | 11000 | 

1 这些实例可以至少每 24 小时维持一次 30 分钟的最大性能，之后会恢复到基线性能。

2 这些实例可以无限期地维持其既定性能。如果工作负载需要在超过 30 分钟的时长内保持最大性能，请选择以下任一实例。

## 支持的 EBS 优化
<a name="previous"></a>

以下实例类型支持 EBS 优化，但默认情况下不启用 EBS 优化。您必须在启动期间或之后启用 EBS 优化，以达到所述的 EBS 性能水平，但需支付[额外的小时费用](https://aws.amazon.com/ec2/previous-generation/#EBS-optimized_instances)。


| 实例大小 | 最大带宽 (Mbps) | 最大吞吐量（MB/s，128 KiB I/O） | 最大 IOPS (16 KiB I/O) | 
| --- | --- | --- | --- | 
| c1.xlarge | 1000 | 125.0 | 8000 | 
| c3.xlarge | 500 | 62.5 | 4000 | 
| c3.2xlarge | 1000 | 125.0 | 8000 | 
| c3.4xlarge | 2000 | 250.0 | 16000 | 
| i2.xlarge | 500 | 62.5 | 4000 | 
| i2.2xlarge | 1000 | 125.0 | 8000 | 
| i2.4xlarge | 2000 | 250.0 | 16000 | 
| m1.large | 500 | 62.5 | 4000 | 
| m1.xlarge | 1000 | 125.0 | 8000 | 
| m2.2xlarge | 500 | 62.5 | 4000 | 
| m2.4xlarge | 1000 | 125.0 | 8000 | 
| m3.xlarge | 500 | 62.5 | 4000 | 
| m3.2xlarge | 1000 | 125.0 | 8000 | 
| r3.xlarge | 500 | 62.5 | 4000 | 
| r3.2xlarge | 1000 | 125.0 | 8000 | 
| r3.4xlarge | 2000 | 250.0 | 16000 | 

**注意**  
`i2.8xlarge`、`c3.8xlarge` 和 `r3.8xlarge` 实例没有专用 EBS 带宽，因此不提供 EBS 优化。在这些实例上，网络流量和 Amazon EBS 流量将共用同一 10 Gb 网络接口。
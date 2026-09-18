

# Amazon EC2 实例上的增强联网功能
<a name="enhanced-networking"></a>

增强联网使用单个根 I/O 虚拟化 (SR-IOV) 在支持的实例类型上提供高性能的联网功能。SR-IOV 是一种设备虚拟化方法，与传统虚拟化网络接口相比，它不仅能提高 I/O 性能，还能降低 CPU 使用率。增强联网可以提高带宽，提高每秒数据包数（PPS）性能，并不断降低实例间的延迟。使用增强联网不收取任何额外费用。

有关每个实例类型支持的网络速度的信息，请参阅 [Amazon EC2 实例类型](https://aws.amazon.com/ec2/instance-types/)。

您可以使用以下某种机制启用增强联网：

**弹性网络适配器（ENA）**  
对于支持的实例类型，弹性网络适配器（ENA）最多支持 100 Gbps 的网络速度。  
所有[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)都使用 ENA 来增强联网性能。此外，以下基于 Xen 的实例使用 ENA：H1、I3、G3、`m4.16xlarge`、P3、P3dn 和 R4。  
有关更多信息，请参阅 [在 EC2 实例上使用 ENA 启用增强联网功能](enhanced-networking-ena.md)。

**Intel 82599 虚拟功能 (VF) 接口**  
对于受支持的实例类型，Intel 82599 虚拟功能接口最多支持 10 Gbps 的网络速度。  
以下实例类型使用 Intel 82599 VF 接口来实现增强联网：C3、C4、D2、I2、M4（不包括 m4.16xlarge）和 R3。  
有关更多信息，请参阅 [通过 Intel 82599 VF 接口实现增强联网](sriov-networking.md)。

**Topics**
+ [弹性网络适配器（ENA）](enhanced-networking-ena.md)
+ [ENA Express](ena-express.md)
+ [Intel 82599 VF](sriov-networking.md)
+ [监控网络性能](monitoring-network-performance-ena.md)
+ [改善 Linux 上的网络延迟](ena-improve-network-latency-linux.md)
+ [Nitro 性能注意事项](ena-nitro-perf.md)
+ [优化 Windows 上的网络性能](enhanced-networking-os.md)


# 适用于 EC2 实例的实例存储临时块存储
<a name="InstanceStorage"></a>

*实例存储*为您的 EC2 实例提供临时块级存储。此存储由已物理附加到主机的磁盘提供。实例存储非常适合临时存储频繁更改的信息，例如缓冲区、缓存、Scratch 数据和其他临时内容。它还可用于存储您在一组实例中复制的临时数据，例如负载均衡的 Web 服务器池。

实例存储由一个或多个显示为块设备的实例存储卷组成。实例存储的大小以及可用设备的数量因实例类型和实例大小而异。例如，并非每种实例类型都提供实例存储卷。有关更多信息，请参阅 [EC2 实例的实例存储卷限制](instance-store-volumes.md)。

实例存储卷的虚拟设备按从 `ephemeral0` 到 `ephemeral23` 的顺序指定虚拟设备名称。例如，对于支持一个实例存储卷的实例类型，该卷的虚拟设备名称为 `ephemeral0`。对于支持四个实例存储卷的实例类型，四个卷的虚拟设备名称如下所示：`ephemeral0`、`ephemeral1`、`ephemeral2` 和 `ephemeral3`。

![Amazon EC2 实例存储。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/instance_storage.png)


**实例存储定价**  
使用为您的实例提供的实例存储卷无需支付额外费用。实例存储卷包含在实例使用成本中。

**Topics**
+ [Amazon EC2 实例存储卷的数据持久性](instance-store-lifetime.md)
+ [EC2 实例的实例存储卷限制](instance-store-volumes.md)
+ [适用于 EC2 实例的 SSD 实例存储卷](ssd-instance-store.md)
+ [将实例存储卷添加到 EC2 实例](add-instance-store-volumes.md)
+ [为 M1 和 C1 EC2 实例启用实例存储交换卷](instance-store-swap-volumes.md)
+ [在 EC2 实例上初始化实例存储卷](disk-performance.md)
+ [Amazon EC2 实例存储卷的详细性能统计数据](nvme-detailed-performance-stats.md)
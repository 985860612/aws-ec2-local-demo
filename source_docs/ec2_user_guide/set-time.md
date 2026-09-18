

# 在 EC2 实例上实现精确时钟和时间同步
<a name="set-time"></a>

对于许多服务器任务和进程来说，Amazon EC2 实例上准确一致的时间参考是非常重要的。系统日志中的时间戳在识别问题发生的时间和事件的时间顺序方面起着至关重要的作用。使用 AWS CLI 或 AWS SDK 从您的实例发送请求时，这些工具会以您的名义签署请求。如果实例的日期和时间设置不准确，可能会导致签名中的日期和请求的日期之间存在差异，进而导致 AWS 拒绝请求。

为解决这一重要问题，Amazon 提供了 Amazon Time Sync Service，该服务可从所有 EC2 实例访问，并由各种 AWS 服务 使用。该服务在每个 AWS 区域 中使用一组与卫星连接的原子参考时钟，以提供准确的协调世界时（UTC）全球标准的当前时间读数。

为了获得最佳性能，建议在 EC2 实例上使用[本地 Amazon Time Sync Service](configure-ec2-ntp.md)。要备份到实例上的本地 Amazon Time Sync Service，或者将 Amazon EC2 之外的资源连接到 Amazon Time Sync Service，您可以使用位于 `time.aws.com` 的[公共 Amazon Time Sync Service](configure-time-sync.md)。与本地 Amazon Time Sync Service 一样，公共 Amazon Time Sync Service 会自动涂抹添加到 UTC 中的任何闰秒。公共 Amazon Time Sync Service 由每个 AWS 区域 中一组与卫星连接的原子参考时钟在全球范围内提供支持。

## 硬件数据包时间戳
<a name="hardware-packet-timestamping"></a>

您可以在实例上启用硬件数据包时间戳，为每个传入的网络数据包添加 64 位纳秒精度的时间戳。由于硬件数据包时间戳发生在硬件级别（在数据包到达内核、套接字或应用程序层之前），因此您可以绕过软件时间戳增加的任何延迟。硬件时间戳的基础参考时钟是 Amazon Time Sync Service [PTP 硬件时钟](configure-ec2-ntp.md#connect-to-the-ptp-hardware-clock)。

**优势**

硬件数据包时间戳具有以下优点：
+ 改进事件排序，这也可用于确定数据包到达 EC2 实例的实际顺序，确保公平的数据包处理。
+ 衡量单向网络延迟。
+ 与大多数本地解决方案相比，以更高的精度和准确度提高分布式事务速度。

**先决条件和配置**

要启用硬件数据包时间戳，您的实例必须满足以下先决条件：
+ 必须是 Linux 实例。
+ 满足[支持 PTP 硬件时钟的要求](configure-ec2-ntp.md#ptp-hardware-clock-requirements)。

有关配置说明，请参阅 *GitHub* 上**弹性网络适配器 (ENA) 的 Linux 内核驱动程序系列**页面上的 [Hardware Packet Timestamping](https://github.com/amzn/amzn-drivers/tree/master/kernel/linux/ena#hardware-packet-timestamping)。

## 闰秒
<a name="leap-seconds"></a>

闰秒于 1972 年引入，是对 UTC 时间偶尔进行的一秒钟调整，用于将地球自转的不规则性纳入考量，以弥合国际原子时（TAI）与太阳时（UT1）之间的差异。为了代表客户管理闰秒，我们在 Amazon Time Sync Service 中设计了闰秒涂抹。有关更多信息，请参阅 [Look Before You Leap – The Coming Leap Second and AWS](https://aws.amazon.com/blogs/aws/look-before-you-leap-the-coming-leap-second-and-aws/)。

闰秒即将消失，我们完全支持在[第 27 届国际计量大会上做出的在 2035 年或之前取消闰秒](https://www.bipm.org/en/cgpm-2022/resolution-4)的决定。

为了支持这种过渡，当通过本地 NTP 连接或我们的公共 NTP 池（`time.aws.com`）访问 Amazon Time Sync Service 时，我们仍计划在闰秒事件期间涂抹时间。但是，PTP 硬件时钟不提供涂抹时间选项。如果出现闰秒，PTP 硬件时钟将按照 UTC 标准添加闰秒。在大多数情况下，闰秒涂抹和闰秒时间源是相同的。但是，由于其在闰秒事件中有所不同，因此我们不建议在闰秒事件期间在时间客户端配置中同时使用已涂抹和未涂抹的时间源。

 

**Topics**
+ [硬件数据包时间戳](#hardware-packet-timestamping)
+ [闰秒](#leap-seconds)
+ [在 EC2 实例上设置时间参考，以使用本地 Amazon Time Sync Service](configure-ec2-ntp.md)
+ [在您的 EC2 实例或任何连接互联网的设备上设置时间参考，以使用公共 Amazon Time Sync Service](configure-time-sync.md)
+ [比较您 Linux 实例的时间戳](compare-timestamps-with-clockbound.md)
+ [更改实例的时区](change-time-zone-of-instance.md)

 

**相关资源**
+ AWS 计算博客：[It’s About Time: Microsecond-Accurate Clocks on Amazon EC2 Instances](https://aws.amazon.com/blogs/compute/its-about-time-microsecond-accurate-clocks-on-amazon-ec2-instances/)
+ AWS Cloud Operations & Migrations Blog：[使用 Amazon Time Sync Service 和 Amazon CloudWatch 管理 Amazon EC2 实例时钟精度 – 第 1 部分](https://aws.amazon.com/blogs/mt/manage-amazon-ec2-instance-clock-accuracy-using-amazon-time-sync-service-and-amazon-cloudwatch-part-1/)
+ （Linux）[https://chrony-project.org/](https://chrony-project.org/)
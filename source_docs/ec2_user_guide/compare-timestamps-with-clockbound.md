

# 比较您 Linux 实例的时间戳
<a name="compare-timestamps-with-clockbound"></a>

如果您使用的是 Amazon Time Sync Service，就可以将 Amazon EC2 Linux 实例上的时间戳与 ClockBound 进行比较，以确定事件的真实时间。ClockBound 可以测定 EC2 实例的时钟的准确性，并允许您检查一个给定的时间戳是早于还是晚于实例的当前时钟。在确定整个 EC2 实例中的事件与事务的顺序和一致性方面，这些信息十分重要，并且不会收到各个实例的地理位置的影响。

ClockBound 是一个开源守护进程和开源库。要了解关于 ClockBound 的详情，包括安装说明，请参阅 [GitHub](https://github.com/aws/clock-bound) 上的 *ClockBound*。

ClockBound 仅支持 Linux 实例。

如果您使用与 PTP 硬件时钟的直接 PTP 连接，则您的时间进程守护程序（例如 chrony）将低估时钟误差范围。这是因为 PTP 硬件时钟不会像 NTP 那样将正确的误差范围信息传递给 chrony。因此，您的时钟同步进程守护程序假定时钟精确到 UTC，因此误差范围为 `0`。为了测量完整的误差范围，Nitro 系统会计算 PTP 硬件时钟的误差范围，并通过 ENA 驱动程序 `sysfs` 文件系统将其提供给您的 EC2 实例。您可以将其直接读取为以纳秒为单位的值。

**检索 PTP 硬件时钟错误绑定**

1. 首先使用以下命令之一获取 PTP 硬件时钟设备的正确位置。命令中的路径因用于启动实例的 AMI 而异。
   + 对于 Amazon Linux 2：

     ```
     cat /sys/class/net/eth0/device/uevent | grep PCI_SLOT_NAME
     ```
   + 对于 Amazon Linux 2023：

     ```
     cat /sys/class/net/ens5/device/uevent | grep PCI_SLOT_NAME
     ```

   输出是 PCI 插槽名称，也就是 PTP 硬件时钟设备的位置。在此例中，该位置为 `0000:00:03.0`。

   ```
   PCI_SLOT_NAME={{0000:00:03.0}}
   ```

1. 要检索 PTP 硬件时钟错误绑定，请运行以下命令。请包括上一步中的 PCI 插槽名称。

   ```
   cat /sys/bus/pci/devices/{{0000:00:03.0}}/phc_error_bound
   ```

   输出是 PTP 硬件时钟的时钟误差范围（以纳秒为单位）。

在使用直接 PTP 连接到 PTP 硬件时钟时，要计算特定时间点的正确时钟误差范围，必须在 chrony 轮询 PTP 硬件时钟时添加来自 chrony 或 ClockBound 的时钟误差范围。有关测量和监控时钟准确度的更多信息，请参阅 [Manage Amazon EC2 instance clock accuracy using Amazon Time Sync Service and Amazon CloudWatch – Part 1](https://aws.amazon.com/blogs/mt/manage-amazon-ec2-instance-clock-accuracy-using-amazon-time-sync-service-and-amazon-cloudwatch-part-1/)。
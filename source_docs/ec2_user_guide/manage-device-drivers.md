

# 管理 EC2 实例的设备驱动程序
<a name="manage-device-drivers"></a>

设备驱动程序是与 Amazon EC2 实例的虚拟化硬件通信的软件组件。为防止系统错误、性能问题和其他意外行为，务必让驱动程序保持在最新状态。对于可能因使用情况对系统性能产生重大影响的驱动程序（例如网络、显卡和存储设备驱动程序），则尤其如此。新的驱动程序版本可能包含缺陷修复或引入扩展功能，您可能想为当前运行的实例利用这些功能。

## 网络驱动程序
<a name="w2aac13c49b5"></a>

Linux 发行版可以在内核中加入弹性网络适配器（ENA）或 Elastic Fabric Adapter（EFA）。但是，不同发行版中实现内核驱动程序功能的时间可能会有所差异。

ENA 和 EFA Linux 内核驱动程序可从 Amazon Drivers GitHu 存储库中获得。有关更多信息和可用驱动程序的链接，请参阅 GitHub 上的 [Amazon Drivers](https://github.com/amzn/amzn-drivers/)。

有关 ENA 驱动程序的更多信息，请参阅[在 EC2 实例上使用 ENA 启用增强联网功能](enhanced-networking-ena.md)。有关 EFA 驱动程序的更多信息，请参阅本指南 [适用于 Amazon EC2 上 AI/ML 和 HPC 工作负载的 Elastic Fabric Adapter](efa.md) 部分的**入门**主题。

要在 Windows 实例上安装或更新网络驱动程序，请参阅下列主题：
+ [在 Windows 上安装 ENA 驱动程序](ena-adapter-driver-install-upgrade-win.md)
+ [安装最新的 AWS PV 驱动程序](xen-drivers-overview.md#aws-pv-download)

  有关更多信息，请参阅 [Windows 实例的半虚拟化驱动程序](xen-drivers-overview.md)。

**注意**  
EFA 在 Windows 实例上不受支持。

## 显卡驱动程序
<a name="w2aac13c49b7"></a>

要安装或更新显卡驱动程序，请参阅下列主题：
+ [EC2 实例的 AMD 驱动程序](install-amd-driver.md)
+ [Amazon EC2 实例的 NVIDIA 驱动程序](install-nvidia-driver.md)

## 存储设备驱动程序
<a name="w2aac13c49b9"></a>

要安装或更新存储驱动程序，请参阅下列主题：
+ 若为 Linux 实例，请参阅《Amazon EBS User Guide》**中的 [Install or upgrade the NVMe driver](https://docs.aws.amazon.com/ebs/latest/userguide/nvme-ebs-volumes.html#install-nvme-driver)。
+ 若为 Windows 实例，请参阅[NVMe 驱动程序](aws-nvme-drivers.md)。

## 其他 Windows 设备驱动程序
<a name="w2aac13c49c11"></a>

要安装或更新其他 Windows 设备驱动程序，请参阅下列主题：
+ [其他 Windows 设备驱动程序](other-windows-device-drivers.md)
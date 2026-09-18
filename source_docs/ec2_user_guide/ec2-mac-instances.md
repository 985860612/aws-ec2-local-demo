

# Amazon EC2 Mac 实例
<a name="ec2-mac-instances"></a>

EC2 Mac 实例非常适合为 Apple 平台（例如 iPhone、iPad、Mac、Vision Pro、Apple Watch、Apple TV 和 Safari）开发、构建、测试和签署应用程序。您可以使用 SSH 或 Apple Remote Desktop (ARD) 连接到 Mac 实例。

**注意**  
**计费单位**为**专属主机**。在该主机上运行的实例不产生额外费用。

Amazon EC2 Mac 实例本身支持 macOS 操作系统。
+ **EC2 x86 Mac 实例**（`mac1.metal`）基于 2018 Mac mini 硬件构建，并由 3.2 GHz Intel 第八代（Coffee Lake）酷睿 i7 处理器、6 个物理内核和 12 个逻辑内核以及 32 GiB 内存提供支持。
+ **EC2 M1 Mac 实例**（`mac2.metal`）基于 2020 Mac mini 硬件构建，并由 Apple silicon M1 处理器、8 个 CPU 内核、8 个 GPU 内核、16 GiB 内存和 16 核 Apple Neural Engine 提供支持。
+ **EC2 M1 Ultra Mac 实例**（`mac2-m1ultra.metal`）基于 2022 Mac Studio 硬件构建，并由 Apple silicon M1 Ultra 处理器、20 个 CPU 内核、64 个 GPU 内核、128 GiB 内存和 32 核 Apple Neural Engine 提供支持。
+ **EC2 M2 Mac 实例**（`mac2-m2.metal`）基于 2023 Mac mini 硬件构建，并由 Apple silicon M2 处理器、8 个 CPU 内核、10 个 GPU 内核、24 GiB 内存和 16 核 Apple Neural Engine 提供支持。
+ **EC2 M2 Pro Mac 实例**（`mac2-m2pro.metal`）基于 2023 Mac mini 硬件构建，并由 Apple silicon M2 Pro 处理器、12 个 CPU 内核、19 个 GPU 内核、32 GiB 内存和 16 核 Apple Neural Engine 提供支持。
+ **EC2 M4 Mac 实例**（`mac-m4.metal`）基于 2024 Mac mini 硬件构建，并由 Apple silicon M4 处理器、10 个 CPU 内核、10 个 GPU 内核、24 GiB 内存和 16 核 Apple Neural Engine 提供支持。
+ **EC2 M4 Pro Mac 实例**（`mac-m4pro.metal`）基于 2024 Mac mini 硬件构建，并由 Apple silicon M4 Pro 处理器、14 个 CPU 内核、20 个 GPU 内核、48 GiB 内存和 16 核 Apple Neural Engine 提供支持。

Amazon EC2 Mac 专属主机支持[专属主机自动恢复](dedicated-hosts-recovery.md)和[基于重启的主机维护](dedicated-hosts-maintenance.md)。

**Topics**
+ [注意事项](#mac-instance-considerations)
+ [实例就绪情况](#mac-instance-readiness)
+ [EC2 macOS AMI](#ec2-macos-images)
+ [EC2 macOS Init](#ec2-macos-init)
+ [Amazon EC2 System Monitor for macOS](#mac-instance-system-monitor)
+ [相关资源](#related-resources)
+ [使用 AWS 管理控制台 或 AWS CLI 启动 Mac 实例](mac-instance-launch.md)
+ [使用 SSH 或 GUI 连接到 Mac 实例](connect-to-mac-instance.md)
+ [更新 Amazon EC2 Mac 实例上的操作系统和软件](mac-instance-updates.md)
+ [在 Mac 实例上增加 EBS 卷的大小](mac-instance-increase-volume.md)
+ [停止或终止 Amazon EC2 Mac 实例](mac-instance-stop.md)
+ [配置 Amazon EC2 Mac 实例的系统完整性保护](mac-sip-settings.md)
+ [查找 Amazon EC2 Mac 专属主机支持的 macOS 版本](macos-firmware-visibility.md)
+ [订阅 macOS AMI 通知](macos-subscribe-notifications.md)
+ [使用 AWS Systems Manager 参数存储 API 检索 macOS AMI ID](macos-ami-ids-parameter-store.md)
+ [Amazon EC2 macOS AMI 发布说明](macos-ami-overview.md)

## 注意事项
<a name="mac-instance-considerations"></a>

以下注意事项适用于 Mac 实例：
+ Mac 实例只能作为[专属主机](dedicated-hosts-overview.md)的裸机实例，最短分配期为 24 小时，然后才能释放该专属主机。每台专属主机可启动一个 Mac 实例。您可以与 AWS 组织内的 AWS 账户或组织部门，或与整个 AWS 组织分享专属主机。
+ Mac实例在不同 AWS 区域 可用。有关每个 AWS 区域 的 Mac 实例可用性的列表，请参阅[按区域划分的 Amazon EC2 实例类型](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-regions.html)。
+ Mac 实例仅适用于按需型实例。它们不能作为竞价型实例或预留实例提供。您可以通过购买 [Savings Plan](https://docs.aws.amazon.com/savingsplans/latest/userguide/) 节省 Mac 实例的开支。
+ 不同 Mac 实例类型与特定 macOS 亚马逊机器映像（AMI）的兼容性有所不同。有关更多信息，请参阅 [Amazon EC2 macOS AMI 发布说明](macos-ami-overview.md)。
+ 支持 EBS hotplug。
+ AWS 不管理或支持 Apple 硬件上的内部 SSD。强烈建议您改用 Amazon EBS 卷。EBS 卷在 Mac 实例上提供的弹性、可用性和持久性优势与在任何其他 EC2 实例上相同。
+ 为实现最佳性能，建议在 Mac 实例中使用具有 1 万 IOPS 和 400 MiB/s 吞吐量的 Amazon EBS 卷。有关更多信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 卷类型](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html)。
+ [Mac 实例支持 Amazon EC2 Auto Scaling。](https://aws.amazon.com/blogs/compute/implementing-autoscaling-for-ec2-mac-instances/)
+ x86 Mac 实例禁用自动软件更新。我们建议您在将实例投入生产之前应用更新并在实例上进行测试。有关更多信息，请参阅[更新 Amazon EC2 Mac 实例上的操作系统和软件](mac-instance-updates.md)。
+ 停止或终止 Mac 实例时，将在专属主机上执行清理工作流程。有关更多信息，请参阅 [停止或终止 Amazon EC2 Mac 实例](mac-instance-stop.md)。
+ 
**重要**  
从外部卷启动 Mac 硬件时，“Apple 智能”功能不可用。由于系统默认从外部 EBS 卷启动 EC2 Mac 实例，这些实例不支持“Apple 智能”功能。
+ 
**警告**  
请勿使用 FileVault。如果启用 FileVault，主机无法启动，因为分区已锁定。如果需要数据加密，请使用 Amazon EBS 加密，以避免启动问题和性能影响。使用 Amazon EBS 加密后，加密操作会在主机服务器上进行，确保静态数据安全性以及在实例和其附加的 EBS 存储之间的传输中数据的安全性。有关更多信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 加密](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html)。

## 实例就绪情况
<a name="mac-instance-readiness"></a>

启动 Mac 实例后，您需要等到实例准备就绪后才能连接到该实例。对于 AWS 所售带 x86 Mac 实例或 Apple silicon Mac 实例的 AMI，启动时间可能在大约 6 分钟到 20 分钟不等。根据所选 Amazon EBS 卷的大小、在*用户数据*中包含的额外脚本或在自定义 macOS AMI 上额外加载的软件，启动时间可能会延长。

您可以使用小型 Shell 脚本（如下所示）轮询 describe-instance-status API，以了解实例何时可以连接。在以下命令中，将示例实例 ID 替换为您自己的 ID。

```
for i in $(seq 1 200); do aws ec2 describe-instance-status --instance-ids={{i-1234567890abcdef0}} \
    --query='InstanceStatuses[0].InstanceStatus.Status'; sleep 5; done;
```

## EC2 macOS AMI
<a name="ec2-macos-images"></a>

Amazon EC2 macOS 旨在为 Amazon EC2 Mac 实例上运行的开发人员工作负载提供稳定、安全和高性能的环境。EC2 macOS AMI 包含让您能够与 AWS 轻松集成的软件包，包括启动配置工具和许多常见的 AWS 库及工具。

有关 EC2 macOS AMI 的更多信息，请参阅 [Amazon EC2 macOS AMI 发布说明](macos-ami-overview.md)。

AWS 会定期提供更新的 EC2 macOS AMI，其中包括对 AWS 自有软件包的更新和经过全面测试的最新 macOS 版本。此外，只要最新的次要版本更新或主要版本更新能够完全测试和审查，AWS 就会向更新的 AMI 提供这些更新。如果您不需要为 Mac 实例保留数据或自定义内容，则可以通过使用当前 AMI 启动新实例，然后终止以前的实例来获取最新更新。否则，您可以选择要应用于 Mac 实例的更新。

有关如何订阅 macOS AMI 通知的信息，请参阅 [订阅 macOS AMI 通知](macos-subscribe-notifications.md)。

## EC2 macOS Init
<a name="ec2-macos-init"></a>

EC2 macOS Init 用于在启动时初始化 EC2 Mac 实例。它使用优先级组同时运行逻辑任务组。

已启动的 plist 文件是 `/Library/LaunchDaemons/com.amazon.ec2.macos-init.plist`。EC2 macOS Init 的文件位于 `/usr/local/aws/ec2-macos-init`。

有关更多信息，请参阅 [https://github.com/aws/ec2-macos-init](https://github.com/aws/ec2-macos-init)。

## Amazon EC2 System Monitor for macOS
<a name="mac-instance-system-monitor"></a>

Amazon EC2 System Monitor for macOS 为 Amazon CloudWatch 提供 CPU 利用率指标。它在 1 分钟内将这些指标通过自定义串行设备发送到 CloudWatch。您可以按如下方式启用或禁用此代理。该功能默认已启用。

```
sudo setup-ec2monitoring [enable | disable]
```

**注意**  
Apple silicon Mac 实例目前不支持 Amazon EC2 System Monitor for macOS。

## 相关资源
<a name="related-resources"></a>

有关定价的信息，请参阅[定价](https://aws.amazon.com/ec2/instance-types/mac/#Pricing)。

有关 Mac 实例的更多信息，请参阅 [Amazon EC2 Mac 实例](https://aws.amazon.com/ec2/instance-types/mac/)。

有关 Mac 实例硬件规格和网络性能的更多信息，请参阅[通用实例](https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html)。
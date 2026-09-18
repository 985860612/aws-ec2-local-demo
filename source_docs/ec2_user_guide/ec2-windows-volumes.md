

# 如何为 Amazon EC2 Windows 实例附加和映射卷
<a name="ec2-windows-volumes"></a>

**注意**  
本主题仅适用于 Windows 实例。

您的 Windows 实例附带一个作为根卷的 EBS 卷。如果您的 Windows 实例使用 AWS PV 或 Citrix PV 驱动程序，您可以选择最多添加 25 个卷，最终一共连接 26 个卷。有关更多信息，请参阅[Amazon EC2 实例的 Amazon EBS 卷限制](volume_limits.md)。

根据您的实例的实例类型，您将有 0 到 24 个可能的实例存储卷可用于实例。要使用可用于您的实例的任何实例存储卷，您必须在创建 AMI 或启动实例时指定这些卷。您还可以在创建 AMI 或启动实例时添加 EBS 卷，或在您的实例正在运行时连接这些卷。

将卷添加到实例时，您可以指定 Amazon EC2 使用的设备名称。有关更多信息，请参阅[Amazon EC2 实例上卷的设备名称](device_naming.md)。AWSWindows 亚马逊机器映像（AMI）包含 Amazon EC2 所使用的一系列驱动程序，用于将实例存储和 EBS 卷映射到 Windows 磁盘和驱动器盘符。

**Topics**
+ [将 NVME 磁盘映射到卷](windows-list-disks-nvme.md)
+ [将非 NVME 磁盘映射到卷](windows-list-disks.md)


# 将实例存储卷添加到 EC2 实例
<a name="add-instance-store-volumes"></a>

对于具有 **NVMe 实例存储卷**的实例类型，所有支持的实例存储卷都会在启动时自动连接到实例。将在实例启动时自动枚举 NVMe 实例存储卷，并为其分配设备名称。

对于具有**非 NVMe 实例存储卷**的实例类型（例如，C1、C3、M1、M2、M3、R3、D2、H1、I2、X1 和 X1e），您必须在启动时为要连接的实例存储卷手动指定块设备映射。可以在实例启动请求中指定块设备映射，也可以在用于启动实例的 AMI 中指定。块设备映射包括设备名称和映射到其上的卷。有关更多信息，请参阅 [Amazon EC2 实例上卷的块设备映射](block-device-mapping-concepts.md)。

**重要**  
只能在启动实例时附加实例的实例存储卷。无法在启动实例后将实例存储卷附加到该实例。

在启动实例后，您必须先确保已格式化和挂载实例的实例存储卷，然后才能使用这些存储卷。将自动挂载实例存储根卷。

**根卷注意事项**  
块设备映射始终指定实例的根卷。根卷始终自动挂载。

**Linux 实例**：根卷是一个 Amazon EBS 卷或实例存储卷。对于根卷的具有实例存储卷的实例，该卷的大小因 AMI 而异，但最大大小为 10 GB。有关更多信息，请参阅 [根卷类型](ComponentsAMIs.md#storage-for-the-root-device)。

**Windows 实例**：根卷必须是 Amazon EBS 卷。根卷不支持实例存储。

**Topics**
+ [将实例存储卷添加到 Amazon EC2 AMI](adding-instance-storage-ami.md)
+ [启动期间将实例存储卷添加到 EC2 实例](adding-instance-storage-instance.md)
+ [使实例存储卷可供 EC2 实例使用](making-instance-stores-available-on-your-instances.md)
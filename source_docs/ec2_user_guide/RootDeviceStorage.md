

# Amazon EC2 实例的根卷
<a name="RootDeviceStorage"></a>

当您启动一个实例时，我们会为该实例创建*根卷*。根卷包含用于启动该实例的映像。每个实例都有单独的根卷。您可以在启动期间或启动后向您的实例添加存储卷。

您用于启动实例的 AMI 决定根卷的类型。您可以从 *Amazon EBS-backed AMI*（Linux 和 Windows 实例）或 *Amazon S3 支持的 AMI*（仅限 Linux 实例）启动实例。使用每种 AMI 可进行的操作有很大区别。有关这些区别的更多信息，请参阅 [根卷类型](ComponentsAMIs.md#storage-for-the-root-device)。

我们建议您使用由 Amazon EBS 提供支持的 AMI，因为这些实例启动速度更快，而且采用了持久性存储。

我们为根卷保留特定的设备名称。有关更多信息，请参阅 [Amazon EC2 实例上卷的设备名称](device_naming.md)。

**Topics**
+ [具有 Amazon EBS 根卷的实例](#root-volume-ebs-backed)
+ [具有实例存储根卷的实例（仅限 Linux 实例）](#root-volume-instance-store-backed)
+ [Amazon EC2 实例终止后会保留 Amazon EBS 根卷](configure-root-volume-delete-on-termination.md)
+ [在不停止 Amazon EC2 实例的情况下替换该实例的根卷](replace-root.md)

## 具有 Amazon EBS 根卷的实例
<a name="root-volume-ebs-backed"></a>

使用 Amazon EBS 作为根卷的实例会自动附加一个 Amazon EBS 卷。当您启动具有 Amazon EBS-AMI 的实例时，系统会为 AMI 所引用的每一个 Amazon EBS 快照创建 Amazon EBS 卷。您可以根据实例类型选择使用其他Amazon EBS卷或实例存储卷。

具有 EBS 根卷的实例可以停止然后再重新启动，附加的卷中存储的数据不会受影响。当具有 EBS 根卷的实例处于停止状态时，您可以执行各种与该实例和卷有关的任务。例如，您可以修改实例的属性、更改其大小或更新其使用的内核，或者您可以将其根卷附加到另一个正在运行的实例，以进行调试或实现任何其他目的。有关更多信息，请参阅 [Amazon EBS 卷](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html)。

![从 EBS 支持的 AMI 启动的实例，其中包含根卷和其他 EBS 卷。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ebs_backed_instance.png)


**限制**  
您不能使用 `st1` 或 `sc1` EBS 卷作为根卷。

**实例失败**

如果具有 EBS 根卷的实例失败，您可以通过以下方法之一恢复您的会话：
+ 停止，然后再次启动（先尝试此方法）。
+ 自动为相关卷拍摄快照并创建新的 AMI。有关更多信息，请参阅[创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。
+ 通过以下步骤将卷附加到新实例：

  1. 创建根卷的快照。

  1. 使用快照注册一个新的 AMI。

  1. 从新的 AMI 启动一个新实例。

  1. 将其余 Amazon EBS 卷与旧实例分离。

  1. 将这些 Amazon EBS 卷重新附加到新实例。

## 具有实例存储根卷的实例（仅限 Linux 实例）
<a name="root-volume-instance-store-backed"></a>

**注意**  
Windows 实例不支持实例存储根卷。

使用实例存储作为根卷的实例会自带可用的一个或多个实例存储卷，其中一个卷充当根卷。从 Amazon S3 支持的 AMI 启动实例时，即会将 AMI 复制到根卷。请注意，您可以根据实例类型选择使用更多实例存储卷。

只要实例正在运行，实例存储卷上的所有数据便会存在，但是在实例终止时（具有实例存储根卷的实例不支持**停止**操作）或是实例失败时（例如底层硬盘有问题时），会删除这些数据。有关更多信息，请参阅 [适用于 EC2 实例的实例存储临时块存储](InstanceStorage.md)。

![从 Amazon S3 支持的 AMI 启动的 Amazon EC2 实例上的根卷。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/instance_store_backed_instance.png)


**支持的实例类型**  
只有以下实例类型支持将实例存储卷作为根卷：C1、C3、D2、I2、M1、M2、M3、R3 和 X1。

**实例失败**  
具有实例存储根卷的实例失败或终止后，该实例不能被恢复。如果您打算使用具有实例存储根卷的实例，我们强烈建议您将数据跨多个可用区分散到不同的实例存储卷中。您还应该定期将您的实例存储卷上的关键数据备份至持久性存储。
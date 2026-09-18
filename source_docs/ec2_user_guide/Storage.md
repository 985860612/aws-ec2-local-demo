

# 适用于 Amazon EC2 实例的存储选项
<a name="Storage"></a>

Amazon EC2 为您的实例提供了灵活、经济且易于使用的数据存储选项。各选项都具有独特的性能和耐久性。这些存储选项既可以单独使用，也可以组合使用，以便满足您的需求。

**数据块存储**  
+ [Amazon EBS](https://docs.aws.amazon.com/ebs/latest/userguide/) – Amazon EBS 提供持久的块级存储卷，您可以将其附加到实例或从实例中分离。您可以将多个 EBS 卷附加到一个实例。EBS 卷始终不受其关联实例的生命周期影响。您可以对 EBS 卷进行加密。要保留您数据的备份副本，您可以从 EBS 卷创建快照。快照会存储在 Amazon S3 中。您可以从快照创建 EBS 卷。
+ [适用于 EC2 实例的实例存储临时块存储](InstanceStorage.md) – 实例存储可以为实例提供临时性块级存储。实例存储卷的数量、大小和类型由实例类型和实例大小决定。实例存储卷上的数据仅在关联实例的生命周期内保留；如果您停止、休眠或终止实例，则实例存储卷上的所有数据都会丢失。

**对象存储**  
+ [Amazon S3](AmazonS3.md) – Amazon S3 提供可靠且廉价的数据存储基础设施。它的设计理念是通过支持您随时从 Amazon EC2 内部或从网络上的任何地方存储和检索任何数量的数据，从而简化整个网络计算。例如，您可以使用 Amazon S3 存储数据和应用程序的备份副本。Amazon EC2 使用 Amazon S3 存储 EBS 快照以及 Amazon S3 支持的 AMI。

**文件存储**  
+ [Amazon EFS](AmazonEFS.md)（仅适用于 Linux 实例）– Amazon EFS 提供适用于 Amazon EC2 的可扩展文件存储。您可以创建 EFS 文件系统并配置实例来装载文件系统。您可以使用 EFS 文件系统作为在多个实例上运行的工作负载和应用程序的通用数据来源。
+ [Amazon FSx](storage_fsx.md) – 借助 Amazon FSx，您可以在云中启动、运行和扩展功能丰富的高性能文件系统。Amazon FSx 是一项完全托管的服务，支持各种工作负载。您可以在这些广泛使用的文件系统之间进行选择：Lustre、NetApp ONTAP、OpenZFS 和 Windows File Server。

**文件缓存**  
+ [将 Amazon File Cache 与 Amazon EC2 实例结合使用](AmazonEFC.md) – Amazon File Cache 在 AWS 上提供临时的高性能缓存，用于处理文件数据。缓存提供对 Amazon EC2 上计算工作负载的读写数据访问权限，以及亚毫秒级别的延迟、高达数百 GB/s 的吞吐量以及高达数百万的 IOPS。

下图显示了这些存储选项和您的实例之间的关系。

![适用于 Amazon EC2 的存储选项。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/architecture_storage.png)


## AWS 存储定价
<a name="storage-pricing"></a>

打开 [AWS 定价](https://aws.amazon.com/pricing/)，滚动到 **AWS 产品定价**，然后选择**存储**。选择存储产品以打开其定价页面。
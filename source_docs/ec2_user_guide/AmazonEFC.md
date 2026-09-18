

# 将 Amazon File Cache 与 Amazon EC2 实例结合使用
<a name="AmazonEFC"></a>

Amazon File Cache 在 AWS 上提供一个完全托管的高速缓存，可以更轻松地处理文件数据，无论数据存储在何处。Amazon File Cache 可作为临时的高性能存储位置，供存储在本地文件系统、AWS 文件系统和 Amazon Simple Storage Service (Amazon S3)存储桶中的数据使用。您可以利用这一功能，以统一的视图和极快的速度(亚毫秒级延迟和高吞吐量)将分散的数据集提供给 AWS 上基于文件的应用程序。有关更多信息，请参阅《[Amazon File Cache 用户指南](https://docs.aws.amazon.com/fsx/latest/FileCacheGuide/what-is.html)》。

Amazon File Cache 可与最流行的 Linux AMI 配合使用，并与基于 x86 的实例类型和 Graviton 实例类型兼容。您可以使用开源的 Lustre 客户端从 Amazon EC2 实例访问缓存。您可以挂载缓存，然后使用标准 Linux 命令处理缓存中的文件和目录。Amazon EC2 实例可以从同一虚拟私有云（VPC）内的其他可用区访问您的缓存，但前提是您的网络配置允许在 VPC 内跨子网访问。您也可以在共享 VPC 中创建缓存。

要开始使用，请参阅《Amazon File Cache User Guide》**中的 [Getting started with Amazon File Cache](https://docs.aws.amazon.com/fsx/latest/FileCacheGuide/getting-started.html)。
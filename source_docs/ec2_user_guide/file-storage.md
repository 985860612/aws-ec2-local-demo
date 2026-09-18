

# Amazon EC2 上的对象存储、文件存储及文件缓存
<a name="file-storage"></a>

云文件存储是一种在云中存储数据的方法，允许服务器和应用程序通过共享文件系统访问数据。这种兼容性使得云文件存储非常适合依赖共享文件系统的工作负载，并且实现了无需更改代码的简单集成。

现在有许多文件存储解决方案，从使用块存储作为基础的计算实例上的单节点文件服务器（没有扩展性或冗余来保护数据），到自助集群解决方案，再到完全托管的解决方案，不一而足。以下内容介绍了一些由 AWS 提供的用于与 Amazon EC2 实例结合使用的存储服务。

**Topics**
+ [将 Amazon S3 与 Amazon EC2 实例结合使用](AmazonS3.md)
+ [将 Amazon EFS 与 Amazon EC2 Linux 实例结合使用](AmazonEFS.md)
+ [将 Amazon FSx 与 Amazon EC2 实例结合使用](storage_fsx.md)
+ [将 Amazon File Cache 与 Amazon EC2 实例结合使用](AmazonEFC.md)
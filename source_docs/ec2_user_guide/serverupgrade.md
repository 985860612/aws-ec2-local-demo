

# 将 EC2 Windows 实例升级到更高版本的 Windows Server
<a name="serverupgrade"></a>

如果需要将 EC2 Windows 实例上的 Windows Server 操作系统从早期版本升级，则可以使用以下方法之一。

**就地升级**  
在现有实例上执行就地升级。在此过程中，只有操作系统文件会受到影响，设置、服务器角色和数据会保持不变。

**迁移（也称为并行升级）**  
迁移涉及捕获设置、配置和数据，并将这些内容移植到全新 EC2 Windows 实例上的新版操作系统。您可以通过在 AWS Marketplace 中订阅的公有或私有 Windows AMI 启动实例，也可以通过与您共享的 AMI 启动实例。您还可以使用 EC2 Image Builder 创建自定义 AMI。有关更多信息，请参阅《[Image Builder User Guide](https://docs.aws.amazon.com/imagebuilder/latest/userguide/what-is-image-builder.html)》。  
AWS 为 EC2 实例上运行的 Windows Server 版本提供一组公开可用的亚马逊机器映像（AMI）。这些 AMI 按月更新。有关最新 Windows AMI 的信息，请参阅《[AWSWindows AMI Reference](https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/windows-amis.html)》。

传统上，Microsoft 会建议迁移到新版本的 Windows Server，而不是就地升级。虽然迁移所产生的升级错误或问题更少，但所需的时间可能多于就地升级所需的时间，因为需要预置新实例、规划和移植应用程序以及调整新实例上的配置设置。就地升级的速度更快，但软件不兼容可能会产生错误。

**Topics**
+ [在 EC2 Windows 实例上执行就地升级](os-inplaceupgrade.md)
+ [使用自动化运行手册升级 EC2 Windows 实例](automated-upgrades.md)
+ [将 EC2 Windows 实例迁移到基于 Nitro 的实例类型](migrating-latest-types.md)
+ [对 EC2 Windows 实例上的操作系统升级进行问题排查](os-upgrade-trbl.md)


# Amazon EC2 AMI 生命周期
<a name="ami-lifecycle"></a>

亚马逊机器映像（AMI）包含了设置和启动实例所需的软件配置。在启动实例时，您必须指定 (AMI)。您也可以使用 Amazon 提供的 AMI，也可以创建自己的 AMI。该 AMI 必须位于要从中启动实例的 AWS 区域。

AMI 的生命周期包括创建、复制、弃用、禁用和删除（注销）AMI。

**创建 AMI。**您可以使用 Amazon 提供的 AMI 来启动实例，也可以根据自己的需要创建自定义 AMI。要创建自定义 AMI，请从某个现有的 AMI 启动一个实例，对其进行自定义（例如，安装软件和配置操作系统设置），然后利用该实例创建一个 AMI。任何实例自定义都将保存到此新 AMI 中，从而确保利用您的新 AMI 启动的实例包含这些自定义。

**可认证的 AMI。**要创建支持 EC2 实例认证的 AMI，请参阅[可证明的 AMI](attestable-ami.md)。

**复制 AMI。**您只能在 AMI 所在的 AWS 区域使用该 AMI 启动实例。如果需要在多个区域启动具有相同配置的实例，请将该 AMI 复制到其他区域。

**弃用 AMI。**要将 AMI 标记为已取代或已过时，您可以设置立即弃用或某个未来弃用日期。已弃用的 AMI 会从 AMI 列表中隐藏，但如果用户和服务知道 AMI ID，则可以继续使用已弃用的 AMI。

**禁用 AMI。**要暂时阻止使用 AMI，可以禁用该 AMI。禁用某个 AMI 之后，其无法用于启动新实例。不过，如果您重新启用该 AMI，其可用于再次启动实例。请注意，禁用 AMI 不会影响已经从中启动的现有实例。

**注销（删除）AMI。**不再需要某个 AMI 时，可以将其注销，防止将其用于启动新实例。如果 AMI 符合某个留存规则，则会转移至回收站，并且可在留存期届满之前从回收站还原，但在留存期届满后将被永久删除。如果不符合任何留存规则，则会立即被永久删除。请注意，注销 AMI 不会影响利用该 AMI 启动的现有实例。

**自动化 AMI 生命周期。**您可以使用 Amazon Data Lifecycle Manager 来自动创建、保留、复制、弃用和取消注册 Amazon EBS-backed AMI 及其备份快照。您还可以使用 EC2 Image Builder 自动创建、管理和部署自定义 AMI。有关更多信息，请参阅《Amazon EBS 用户指南》中的 [Automate backups with Amazon Data Lifecycle Manager](https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-lifecycle.html)**和 [EC2 Image Builder 用户指南](https://docs.aws.amazon.com/imagebuilder/latest/userguide/what-is-image-builder.html)。

**Topics**
+ [创建 AMI](creating-an-ami-ebs.md)
+ [创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md)
+ [使用 Windows Sysprep 创建 AMI](ami-create-win-sysprep.md)
+ [复制 AMI](CopyingAMIs.md)
+ [存储和还原 AMI](ami-store-restore.md)
+ [AMI 世系](ami-ancestry.md)
+ [AMI 水印](ami-watermark.md)
+ [AMI 允许的实例类型](ami-allowed-instance-types.md)
+ [AMI 使用情况](ec2-ami-usage.md)
+ [弃用 AMI](ami-deprecate.md)
+ [禁用 AMI](disable-an-ami.md)
+ [取消注册 AMI](deregister-ami.md)
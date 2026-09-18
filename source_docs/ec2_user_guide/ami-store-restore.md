

# 使用 S3 存储和还原 AMI
<a name="ami-store-restore"></a>

您可以将亚马逊机器映像（AMI）存储在 Amazon S3 存储桶中、将 AMI 复制到另一个 S3 存储桶，然后从 S3 存储桶还原它。通过使用 S3 存储桶存储和还原 AMI，您可以将 AMI 从一个 AWS 分区复制到另一个分区，例如，从主商业分区到 AWS GovCloud (US) 分区。您还可以通过将 AMI 存储在 S3 存储桶中为其创建存档副本。

支持使用 S3 存储和还原 AMI 的 API 是 `CreateStoreImageTask`、`DescribeStoreImageTasks` 和 `CreateRestoreImageTask`。

`CopyImage` 是推荐用于在 AWS 分区*内*复制 AMI 的 API。但是，`CopyImage` 无法将 AMI 复制到*另一个*分区。

有关 AWS 分区的信息，请参阅 *IAM 用户指南*中 [Amazon 资源名称(ARN)](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html)页面上的{{分区}}。

**警告**  
在 AWS 分区或 AWS 区域之间移动数据时，请确保遵守所有适用法律和业务要求，包括但不限于任何适用的政府法规和数据驻留要求。

**Topics**
+ [使用案例](#use-cases)
+ [限制](#ami-store-restore-limitations)
+ [成本](#store-restore-costs)
+ [AMI 存储和还原的工作原理](store-restore-how-it-works.md)
+ [创建存储映像任务](work-with-ami-store-restore.md)

## 使用案例
<a name="use-cases"></a>

**Topics**
+ [在 AWS 分区之间复制 AMI](#copy-to-partition)
+ [制作 AMI 的存档副本](#archival-copies)

### 在 AWS 分区之间复制 AMI
<a name="copy-to-partition"></a>

通过使用 S3 存储桶存储和还原 AMI，您可以将 AMI 从一个 AWS 分区复制到另一个分区，或从一个 AWS 区域复制到另一个区域。在以下示例中，您可将 AMI 从主商业分区复制到 AWS GovCloud (US) 分区，尤其是从 `us-east-2` 区域复制到 `us-gov-east-1` 区域。

要将 AMI 从一个分区复制到另一个分区，请执行以下步骤：
+ 使用 `CreateStoreImageTask` 将 AMI 存储在当前区域内的 S3 存储桶中。在此示例中，S3 存储桶位于 `us-east-2` 中。
+ 使用 `DescribeStoreImageTasks` 监控存储任务的进度。任务完成后，对象将在 S3 存储桶中可见。
+ 使用您选择的程序将存储的 AMI 对象复制到目标分区中的 S3 存储桶。在此示例中，S3 存储桶位于 `us-gov-east-1` 中。
**注意**  
由于每个分区均需要不同的 AWS 凭证，因此无法将 S3 对象从一个分区直接复制到另一个分区。跨分区复制 S3 对象的过程不在本文档的讨论范围之内。我们提供以下复制过程作为示例，但您必须使用符合安全要求的复制过程。  
要跨分区复制某一 AMI，复制过程可能非常简单，如下所示：从源存储桶[下载对象](https://docs.aws.amazon.com/AmazonS3/latest/userguide/download-objects.html)到中间主机（例如，EC2 实例或笔记本电脑），然后从中间主机[上传对象](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)到目标存储桶。对于该过程的每个阶段，请对分区使用 AWS 凭证。
要实现更持久的使用，请考虑开发一个管理副本的应用程序（可能使用 S3 [分段下载和上传](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html)）。
+ 使用 `CreateRestoreImageTask` 从目标分区中的 S3 存储桶还原 AMI。在此示例中，S3 存储桶位于 `us-gov-east-1` 中。
+ 通过对需要检查其状态何时变为可用的 AMI 进行描述来监控还原任务的进度。您还可以通过描述快照来监控构成所还原 AMI 的快照的进度百分比。

### 制作 AMI 的存档副本
<a name="archival-copies"></a>

您可以通过将 AMI 存储在 S3 存储桶中为其创建存档副本。AMI 被打包到 S3 内的单个对象中，所有 AMI 元数据（不包括共享信息）都作为存储 AMI 的一部分得到保留。AMI 数据将作为存储流程的一部分进行压缩。由于 AMI 包含可轻松压缩的数据，因此 S3 中的对象较小。为了降低成本，您可以使用更便宜的 S3 存储套餐。有关更多信息，请参阅 [Amazon S3 存储类](https://aws.amazon.com/s3/storage-classes/)和 [Amazon S3 定价](https://aws.amazon.com/s3/pricing/)

## 限制
<a name="ami-store-restore-limitations"></a>
+ 要存储 AMI，您的 AWS 账户必须拥有该 AMI 及其快照的所有权，或者该 AMI 及其快照必须[直接与您的账户共享](sharingamis-explicit.md)。如果 AMI 仅[公开共享](sharingamis-intro.md)，则无法存储。
+ 使用这些 API 只能存储由 EBS 支持的 AMI。
+ 不支持半虚拟化 (PV) AMI。
+ 可存储的 AMI 的大小（压缩前）限制为 5,000 GB。
+ 存储映像请求的配额：1200 GB 的存储工作（快照数据）正在进行中。
+ 还原映像请求的配额：600 GB 的还原工作（快照数据）正在进行中。
+ 在存储任务的持续时间内，不得删除快照，执行存储的 IAM 委托人必须有权访问快照，否则存储流程将会失败。
+ 您不能在同一 S3 存储桶中创建 AMI 的多个副本。
+ 存储在 S3 存储桶中的 AMI 无法使用其原始 AMI ID 进行还原。您可以使用 [AMI 别名](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-ec2-aliases.html)来缓解这种情况。
+ 目前，仅支持使用 AWS Command Line Interface、AWS 开发工具包和 Amazon EC2 API 存储和还原 API。您无法使用 Amazon EC2 控制台存储和还原 AMI。

## 成本
<a name="store-restore-costs"></a>

使用 S3 存储和还原 AMI 时，您需要为存储和还原 API 使用的服务以及数据传输付费。API 使用 S3 和 EBS Direct API（由这些 API 在内部使用以访问快照数据）。有关更多信息，请参阅 [Amazon S3 定价](https://aws.amazon.com/s3/pricing/)和 [Amazon EBS 定价](https://aws.amazon.com/ebs/pricing/)。
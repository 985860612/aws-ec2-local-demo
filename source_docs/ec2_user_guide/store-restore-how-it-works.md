

# AMI 存储和还原的工作原理
<a name="store-restore-how-it-works"></a>

要使用 S3 存储和还原 AMI，请使用以下 API：
+ `CreateStoreImageTask` – 将 AMI 存储在 S3 存储桶中
+ `DescribeStoreImageTasks` – 提供 AMI 存储任务的进度
+ `CreateRestoreImageTask` – 从 S3 存储桶还原 AMI

**Topics**
+ [CreateStoreImageTask](#CreateStoreImageTask)
+ [DescribeStoreImageTasks](#DescribeStoreImageTasks)
+ [CreateRestoreImageTask](#CreateRestoreImageTask)
+ [文件路径](#file-paths-in-s3)

## CreateStoreImageTask
<a name="CreateStoreImageTask"></a>

`CreateStoreImageTask` API 将 AMI 作为单个对象存储在 S3 存储桶中。

API 创建一个任务，从 AMI 及其快照中读取所有数据，然后使用 [S3 分段上传](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html)将数据存储在 S3 对象中。API 获取 AMI 的所有组件，包括大多数非区域特定的 AMI 元数据以及 AMI 中包含的所有 EBS 快照，然后将它们打包到 S3 内的单个对象中。数据将作为上传流程的一部分进行压缩，以减少 S3 中使用的空间量，因此 S3 中的对象可能小于 AMI 中快照大小总和。

如果调用此 API 的账户有可见的 AMI 和快照标签，则会保留它们。

S3 中的对象的 ID 与 AMI 的相同，但带有 `.bin` 扩展名。以下数据还作为 S3 对象上的 S3 元数据标签存储：AMI 名称、AMI 描述、AMI 注册日期、AMI 拥有者账户以及存储操作的时间戳。

完成任务所需的时间取决于 AMI 的大小。它还取决于有多少其他任务正在进行，因为任务需要排队。您可以通过调用 `DescribeStoreImageTasks` API 跟踪任务的进度。

所有正在进行的 AMI 的大小总和限制为每个账户 1200 GB 的 EBS 快照数据。进一步的任务创建将被拒绝，直到正在进行的任务低于限制。例如，如果当前正在存储快照数据为 200 GB 的 AMI 和另一个快照数据为 400 GB 的 AMI，则将接受另一个请求，因为正在进行的总量为 600 GB，低于限制。但是，如果当前正在存储的单个 AMI 的快照数据为 1200 GB，则在任务完成之前，进一步的任务都将被拒绝。

## DescribeStoreImageTasks
<a name="DescribeStoreImageTasks"></a>

`DescribeStoreImageTasks` API 描述 AMI 存储任务的进度。您可以描述指定 AMI 的任务。如果未指定 AMI，则会获得过去 31 天内处理的所有存储映像任务的分页列表。

对于每个 AMI 任务，响应会指示任务是 `InProgress`、`Completed` 还是 `Failed`。对于任务 `InProgress`，响应会将估计进度显示为百分比值。

任务按反向的时间顺序列出。

目前，只能查看上个月的任务。

## CreateRestoreImageTask
<a name="CreateRestoreImageTask"></a>

`CreateRestoreImageTask` API 启动一个任务，该任务可从先前使用 `CreateStoreImageTask` 请求创建的 S3 对象还原 AMI。

执行还原任务的区域可以与执行存储任务的区域相同，也可以不同。

要从中还原 AMI 对象的 S3 存储桶必须位于请求执行还原任务的相同区域中。AMI 将在此区域中还原。

AMI 将使用其元数据还原，例如与存储的 AMI 值对应的名称、描述和块储存设备映射。名称对该账户在该区域中的 AMI 必须唯一。如果未提供名称，则新 AMI 获得的名称与原始 AMI 的名称相同。AMI 获得在还原流程中生成的新 AMI ID。

完成 AMI 还原任务所需的时间取决于 AMI 的大小。它还取决于有多少其他任务正在进行，因为任务需要排队。您可以通过描述 AMI ([describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html)) 或其 EBS 快照 ([describe-snapshots](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-snapshots.html)) 来查看任务的进度。如果任务失败，AMI 和快照将移至失败状态。

所有正在进行的 AMI 的大小总和限制为每个账户的 EBS 快照数据 600 GB（根据还原后的大小）。进一步的任务创建将被拒绝，直到正在进行的任务低于限制。

## 文件路径
<a name="file-paths-in-s3"></a>

您可以通过以下方式在存储和恢复 AMI 时使用文件路径：
+ 在 S3 中存储 AMI 时，可以将文件路径添加到存储桶名称中。在内部，系统将路径与存储桶名称分开，然后将路径添加到为存储 AMI 而生成的对象密钥中。完整的对象路径显示在 API 调用的响应中。
+ 在恢复 AMI 时，由于对象密钥参数可用，可以将路径添加到对象键值的开头。

**示例：带有附加文件路径的存储桶名称**  
存储 AMI 时，请在存储桶名称后指定文件路径。

```
{{amzn-s3-demo-bucket/path1/path2}}
```

以下是结果对象键。

```
{{path1/path2/ami-0abcdef1234567890}}.bin
```

还原 AMI 时，请指定存储桶名称和对象键。有关示例，请参阅 [创建存储映像任务](work-with-ami-store-restore.md#create-store-image-task)。
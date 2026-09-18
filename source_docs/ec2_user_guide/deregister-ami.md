

# 取消注册 Amazon EC2 AMI
<a name="deregister-ami"></a>

取消注册 AMI 时，Amazon EC2 会将其永久删除。取消注册 AMI 之后，便无法将其用于启动新实例。使用完 AMI 之后，可以考虑将其取消注册。

为防止意外或恶意取消注册 AMI，您可以开启[取消注册保护](ami-deregistration-protection.md)。如果您意外取消注册了 EBS-backed AMI，则可以使用[回收站](https://docs.aws.amazon.com/ebs/latest/userguide/recycle-bin.html)将其还原，但仅限在允许的期限内可以还原，并且该期限届满后 AMI 将被永久删除。

注销 AMI 时，您可以选择同时删除其关联的快照。如果一个快照关联到多个 AMI，则即使指定删除，系统也不会将该快照删除，但该 AMI 仍会被注销。任何未删除的快照都将继续产生存储费用。

取消注册 AMI 不会影响从该 AMI 启动的任何实例。您可以继续使用这些实例。默认情况下，注销 AMI 也不会影响在 AMI 创建过程中创建的任何快照。您需要继续按这些实例和快照的存储成本支付使用费。因此，为避免产生不必要的成本，我们建议您终止任何不需要的实例并删除任何不需要的快照。您可以在注销过程中自动删除快照，也可以在注销后手动删除快照。有关更多信息，请参阅 [避免因未使用的资源产生的成本](#delete-unneeded-resources-to-avoid-unnecessary-costs)。

对于从随后取消注册的 AMI 启动的实例，您仍然可以使用 `describe-instance-image-metadata` AWS CLI 命令查看有关 AMI 的一些高级信息。有关更多信息，请参阅 [describe-instance-image-metadata](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-image-metadata.html)。

**Topics**
+ [注意事项](#deregister-ami-considerations)
+ [取消注册 AMI](#deregister-an-ami)
+ [避免因未使用的资源产生的成本](#delete-unneeded-resources-to-avoid-unnecessary-costs)
+ [Amazon EC2 AMI 取消注册保护](ami-deregistration-protection.md)

## 注意事项
<a name="deregister-ami-considerations"></a>
+ 您无法取消注册不属于您账户所有的 AMI。
+ 您无法使用 Amazon EC2 注销由 AWS Backup 服务管理的 AMI。而是应该使用 AWS Backup 删除备份文件库中相应的恢复点。有关更多信息，请参阅 *AWS Backup 开发人员指南*中的[删除备份](https://docs.aws.amazon.com/aws-backup/latest/devguide/deleting-backups.html)。

## 取消注册 AMI
<a name="deregister-an-ami"></a>

您可以注销 EBS-backed AMI 和 Amazon S3 支持的 AMI。对于 EBS-backed AMI，您可以选择同时删除关联的快照。但如果一个快照还关联了其他 AMI，则即使指定删除，系统也不会将其删除。

------
#### [ Console ]

**要注册 AMI，请执行以下操作**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 在筛选条件栏中，选择**我拥有的**可列出可用的 AMI，选择**已禁用的映像**可列出已禁用的 AMI。

1. 选择要取消注册的 AMI。

1. 选择 **Actions**（操作）、**Deregister AMI**（取消注册 AMI）。

1. （可选）要在注销过程中删除关联的快照，请选中**删除关联的快照**复选框。
**注意**  
如果一个快照还关联了其他 AMI，则即使选中了该复选框，系统也不会将其删除。

1. 选择**注销 AMI**。

   控制台可能需要几分钟才能从列表中删除该 AMI。选择 **Refresh** 以刷新状态。

------
#### [ AWS CLI ]

**要注册 AMI，请执行以下操作**  
使用以下 [deregister-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/deregister-image.html) 命令。

```
aws ec2 deregister-image --image-id {{ami-0abcdef1234567890}}
```

**注销 AMI 并删除其关联的快照**  
使用以下 [deregister-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/deregister-image.html) 命令并指定 `--delete-associated-snapshots` 参数。请注意，如果一个快照还关联了其他 AMI，则即使指定了此参数，系统也不会将其删除。

```
aws ec2 deregister-image \
    --image-id {{ami-0abcdef1234567890}} \
    --delete-associated-snapshots
```

------
#### [ PowerShell ]

**要注册 AMI，请执行以下操作**  
使用 [Unregister-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2Image.html) cmdlet。

```
Unregister-EC2Image -ImageId {{ami-0abcdef1234567890}}
```

**注销 AMI 并删除其关联的快照**  
使用 [Unregister-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2Image.html) cmdlet 并指定 `-DeleteAssociatedSnapshots` 参数。请注意，如果一个快照还关联了其他 AMI，则即使指定了此参数，系统也不会将其删除。

```
Unregister-EC2Image `
    -ImageId {{ami-0abcdef1234567890}} `
    -DeleteAssociatedSnapshots
```

------

## 避免因未使用的资源产生的成本
<a name="delete-unneeded-resources-to-avoid-unnecessary-costs"></a>

默认情况下，注销 AMI 不会删除与该 AMI 关联的所有资源。这些资源包括 EBS-backed AMI 的快照以及在 Amazon S3 中 Amazon S3 支持的 AMI 的文件。取消注册某个 AMI 时，您也不会终止或停止从该 AMI 启动的任何实例。

存储快照和文件将继续产生费用，任何正在运行的实例都将产生费用。

为避免产生此类不必要的费用，我们建议您删除任何不再需要的资源。

**EBS 支持的 AMI**
+ 在注销 AMI 的同时删除关联的快照。有关更多信息，请参阅 [取消注册 AMI](#deregister-an-ami)。
+ 如果注销 AMI 但未删除其关联的快照，则可以手动[删除快照](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-deleting-snapshot.html#ebs-delete-snapshot)。创建 AMI 期间创建的实例根卷快照采用以下描述格式：

  ```
  Created by CreateImage({{i-1234567890abcdef0}}) for {{ami-0abcdef1234567890}}
  ```
+ 如果您不再需要利用该 AMI 启动的实例，则可以将其[停止](Stop_Start.md#starting-stopping-instances)或[终止](terminating-instances.md#terminating-instances-console)。要列出实例，请按 AMI 的 ID 进行筛选。

**Amazon S3 支持的 AMI**
+ 使用 [ec2-delete-bundle](ami-tools-commands.md#ami-delete-bundle)（AMI 工具）命令删除 Amazon S3 中的捆绑包。
+ 如果删除捆绑包后 Amazon S3 存储桶为空，并且该存储桶不再有进一步的用途，您可以[删除存储桶](https://docs.aws.amazon.com/AmazonS3/latest/userguide/delete-bucket.html)。
+ 如果您不再需要利用该 AMI 启动的实例，则可以将其[终止](terminating-instances.md#terminating-instances-console)。要列出实例，请按 AMI 的 ID 进行筛选。
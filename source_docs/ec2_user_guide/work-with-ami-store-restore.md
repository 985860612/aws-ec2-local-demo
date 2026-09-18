

# 创建存储映像任务
<a name="work-with-ami-store-restore"></a>

将 AMI 存储在 S3 存储桶中时，将创建存储映像任务。您可以使用存储映像任务来监控该过程的进度和结果。

**Topics**
+ [保护您的 AMI](#securing-amis)
+ [使用 S3 存储和还原 AMI 的权限](#ami-s3-permissions)
+ [创建存储映像任务](#create-store-image-task)
+ [创建还原映像任务](#create-restore-image-task)

## 保护您的 AMI
<a name="securing-amis"></a>

务必确保 S3 存储桶配置有足够的安全性来保护 AMI 的内容，并确保只要 AMI 对象仍保留在存储桶中，安全性将保持不变。如果无法做到这一点，建议不要使用这些 API。确保不允许对 S3 存储桶进行公开访问。我们建议为存储 AMI 的 S3 存储桶启用[服务器端加密](https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html)，但不是必需要求。

有关如何为 S3 存储桶设置适当的安全设置的信息，请查看以下安全主题：
+ [阻止对您的 Amazon S3 存储的公有访问](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html)
+ [为 Amazon S3 存储桶设置默认服务器端加密行为](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html)
+ [我可以使用哪个 S3 桶策略来遵守 AWS Config 规则 s3-bucket-ssl-requests-only？](https://repost.aws/knowledge-center/s3-bucket-policy-for-config-rule)
+ [启用 Amazon S3 服务器访问日志记录](https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html)

当 AMI 快照复制到 S3 对象时，将通过 TLS 连接复制数据。您可以使用加密快照存储 AMI，但是快照会作为存储流程的一部分进行解密。

## 使用 S3 存储和还原 AMI 的权限
<a name="ami-s3-permissions"></a>

如果您的 IAM 主体将使用 Amazon S3 来存储或还原 AMI，则需要向其授予所需权限。

以下示例策略包括允许 IAM 委托人执行存储和还原任务需要的所有操作。

此外，您还可以创建向主体授予仅访问指定资源权限的 IAM policy。如需了解更多示例策略，请参阅《IAM 用户指南**》中的 [AWS 资源的访问管理](https://docs.aws.amazon.com/IAM/latest/UserGuide/access.html)。

**注意**  
如果构成 AMI 的快照已加密，或者账户默认启用了加密功能，您的 IAM 主体必须具有使用 KMS 密钥的权限。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:DeleteObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:PutObject",
                "s3:PutObjectTagging",
                "s3:AbortMultipartUpload",
                "ebs:CompleteSnapshot",
                "ebs:GetSnapshotBlock",
                "ebs:ListChangedBlocks",
                "ebs:ListSnapshotBlocks",
                "ebs:PutSnapshotBlock",
                "ebs:StartSnapshot",
                "ec2:CreateStoreImageTask",
                "ec2:DescribeStoreImageTasks",
                "ec2:CreateRestoreImageTask",
                "ec2:GetEbsEncryptionByDefault",
                "ec2:DescribeTags",
                "ec2:CreateTags"
            ],
            "Resource": "*"
        }
    ]
}
```

------

## 创建存储映像任务
<a name="create-store-image-task"></a>

要将 AMI 存储在 S3 存储桶中，首先要创建存储映像任务。完成任务所需的时间取决于 AMI 的大小。您可以跟踪该任务的进度，直到其成功或失败。

------
#### [ AWS CLI ]

**创建存储映像任务**  
使用 [create-store-image-task](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-store-image-task.html) 命令。

```
aws ec2 create-store-image-task \
    --image-id {{ami-0abcdef1234567890}} \
    --bucket {{amzn-s3-demo-bucket}}
```

下面是示例输出。

```
{
  "ObjectKey": "ami-0abcdef1234567890.bin"
}
```

**描述存储映像任务的进度**  
使用 [describe-store-image-tasks](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-store-image-tasks.html) 命令。

```
aws ec2 describe-store-image-tasks \
    --image-ids{{ ami-0abcdef1234567890}} \
    --query StoreImageTaskResults[].StoreTaskState \
    --output text
```

下面是示例输出。

```
InProgress
```

------
#### [ PowerShell ]

**创建存储映像任务**  
使用 [New-EC2StoreImageTask](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2StoreImageTask.html) cmdlet。

```
New-EC2StoreImageTask `
    -ImageId {{ami-0abcdef1234567890}} `
    -Bucket {{amzn-s3-demo-bucket}}
```

下面是示例输出。

```
ObjectKey         : ami-0abcdef1234567890.bin
```

**描述存储映像任务的进度**  
使用 [Get-EC2StoreImageTask](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2StoreImageTask.html) cmdlet。

```
(Get-EC2StoreImageTask -ImageId {{ami-0abcdef1234567890}}).StoreTaskState
```

下面是示例输出。

```
InProgress
```

------

## 创建还原映像任务
<a name="create-restore-image-task"></a>

必须为还原的 AMI 指定名称。名称对该账户在该区域中的 AMI 必须唯一。还原的 AMI 将获得一个新 AMI ID。

------
#### [ AWS CLI ]

**创建恢复映像任务**  
使用 [create-restore-image-task](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-restore-image-task.html) 命令。

```
aws ec2 create-restore-image-task \
    --object-key {{ami-0abcdef1234567890}}.bin \
    --bucket {{amzn-s3-demo-bucket}} \
    --name "{{my-restored-ami}}"
```

下面是示例输出。

```
{
   "ImageId": "ami-1234567890abcdef0"
}
```

------
#### [ PowerShell ]

**创建恢复映像任务**  
使用 [New-EC2RestoreImageTask](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2RestoreImageTask.html) cmdlet。

```
New-EC2RestoreImageTask `
    -ObjectKey {{ami-0abcdef1234567890}}.bin `
    -Bucket {{amzn-s3-demo-bucket}} `
    -Name "{{my-restored-ami}}"
```

下面是示例输出。

```
ImageId         : ami-1234567890abcdef0
```

------
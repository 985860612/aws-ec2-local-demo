

# 授予复制 Amazon EC2 AMI 的权限
<a name="copy-ami-permissions"></a>

要复制 EBS-backed AMI 或 Amazon S3 支持的 AMI，您需要以下 IAM 权限：
+ `ec2:CopyImage` – 复制 AMI。对于 EBS-backed AMI，它还授予复制 AMI 支持快照的权限。
+ `ec2:CreateTags` – 标记目标 AMI。对于 EBS-backed AMI，它还授予标记目标 AMI 支持快照的权限。

如果您要复制由实例存储支持的 AMI，则需要以下*额外的* IAM 权限：
+ `s3:CreateBucket` – 在目标区域为新的 AMI 创建 S3 存储桶
+ `s3:PutBucketOwnershipControls` – 为新创建的 S3 存储桶启用 ACL，以便可以使用 `aws-exec-read` [标准 ACL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl) 写入对象
+ `s3:GetBucketAcl` – 读取源存储桶的 ACL
+ `s3:ListAllMyBuckets` – 在目标区域为 AMI 查找现有 S3 存储桶
+ `s3:GetObject` – 读取源存储桶中的对象
+ `s3:PutObject` – 将对象写入目标存储桶
+ `s3:PutObjectAcl` – 将新对象的权限写入目标存储桶

**注意**  
从 2024 年 10 月 28 日开始，您可以为源 AMI 上的 `CopyImage` 操作指定资源级权限。目标 AMI 的资源级权限与以前一样可用。有关更多信息，请参阅《*服务授权参考*》中的 [Amazon EC2 定义的操作](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html#amazonec2-actions-as-permissions)下的表中的 **CopyImage**。

## 用于复制 EBS-backed AMI 并标记目标 AMI 和快照的 IAM policy 示例
<a name="permissions-to-copy-ebs-backed-ami"></a>

以下示例策略授予您复制任何 EBS-backed AMI 并标记目标 AMI 及其支持快照的权限。

**注意**  
从 2024 年 10 月 28 日开始，您可以在 `Resource` 元素中指定快照。有关更多信息，请参阅《*服务授权参考*》中的 [Amazon EC2 定义的操作](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html#amazonec2-actions-as-permissions)下的表中的 **CopyImage**。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [{
        "Sid": "PermissionToCopyAllImages",
        "Effect": "Allow",
        "Action": [
            "ec2:CopyImage",
            "ec2:CreateTags"
        ],
        "Resource": [
            "arn:aws:ec2:*::image/*",
            "arn:aws:ec2:*::snapshot/*"
        ]
    }]
}
```

------

## 用于复制 EBS-backed AMI 但拒绝标记新快照的 IAM policy 示例
<a name="permissions-to-copy-ebs-backed-ami-but-deny-tagging-new-snapshots"></a>

当您获取 `ec2:CopySnapshot` 权限时，系统会自动授予 `ec2:CopyImage` 权限。可以明确拒绝标记新的支持快照的权限，从而覆盖 `ec2:CreateTags` 操作的 `Allow` 效果。

以下示例策略授予您复制任何 EBS-backed AMI 但拒绝您标记目标 AMI 的新支持快照的权限。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [{
            "Effect": "Allow",
            "Action": [
                "ec2:CopyImage",
                "ec2:CreateTags"
            ],
            "Resource": [
                "arn:aws:ec2:*::image/*",
                "arn:aws:ec2:*::snapshot/*"
            ]
        },
        {
            "Effect": "Deny",
            "Action": "ec2:CreateTags",
            "Resource": "arn:aws:ec2:::snapshot/*"
        }
    ]
}
```

------

## 用于复制 Amazon S3 支持的 AMI 并标记目标 AMI 的 IAM 策略示例
<a name="permissions-to-copy-instance-store-backed-ami"></a>

以下示例策略授予您将指定源存储桶中任何 Amazon S3 支持的 AMI 复制到指定区域并标记目标 AMI 的权限。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [{
            "Sid": "PermissionToCopyAllImages",
            "Effect": "Allow",
            "Action": [
                "ec2:CopyImage",
                "ec2:CreateTags"
            ],
            "Resource": "arn:aws:ec2:*::image/*"
        },
        {
            "Effect": "Allow",
            "Action": "s3:ListAllMyBuckets",
            "Resource": [
                "arn:aws:s3:::*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": [
                "arn:aws:s3:::amzn-s3-demo-source-bucket/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:CreateBucket",
                "s3:GetBucketAcl",
                "s3:PutObjectAcl",
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::amis-for-{{111122223333}}-in-{{us-east-2}}-{{hash}}"
            ]
        }
    ]
}
```

------

要查找 AMI 源存储桶的 Amazon Resource Name (ARN)，请访问 [https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)，打开 Amazon EC2 控制台，在导航窗格中选择 **AMIs (AMI)**，然后在 **Source (源)** 列中找到该存储桶名称。

**注意**  
仅在您首次将 Amazon S3 支持的 AMI 复制到单个区域时，才需要 `s3:CreateBucket` 权限。在此之后，将使用已在该区域中创建的 Amazon S3 存储桶来存储您将来复制到该区域的所有 AMIs。


# 设置用于容量管理器数据导出的 Amazon S3 存储桶
<a name="cm-set-up-s3-export"></a>

要接收容量管理器数据导出，您的 AWS 账户中必须有一个 Amazon S3 存储桶才能接收和存储导出文件。在容量管理器控制台中创建数据导出时，您可以选择自己拥有的现有 Amazon S3 存储桶，也可以创建新的存储桶。

无论哪种情况，您都必须应用所需的存储桶策略，以使容量管理器能够传输导出文件。在 Amazon S3 控制台中编辑此策略或在创建导出后更改存储桶拥有者会阻止容量管理器传输导出。

要创建 Amazon S3 存储桶，请参阅《Amazon Simple Storage Service 用户指南》**中的[创建 S3 存储桶](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)。

必须将以下策略应用于您的 S3 存储桶，以便容量管理器能够传输数据导出：

```
{
    "Version": "2012-10-17",		 	 	 
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "ec2.capacitymanager.amazonaws.com"
            },
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::{{amzn-s3-demo-bucket}}",
                "arn:aws:s3:::{{amzn-s3-demo-bucket}}/*"
            ],
            "Condition": {
                "StringEquals": {
                    "aws:SourceAccount": "{{111122223333}}"
                },
                "ArnLike": {
                    "aws:SourceArn": "arn:aws:ec2:us-east-1:{{111122223333}}:capacity-manager-data-export/*"
                }
            }
        }
    ]
}
```

此存储桶策略策略有助于确保容量管理器的数据导出文件能够安全地传输至您的存储桶中。具体来说：
+ 每次传输容量管理器数据导出时，AWS 会先确认存储桶是否仍由设置导出的账户拥有。如果存储桶所有权发生变化，则不会传输导出。这有助于确保容量管理器数据的安全性。该存储桶策略允许 AWS（`"Effect": "Allow"`）检查哪个账户拥有存储桶（`"Action": ["s3:ListBucket"]`）。
+ 该策略授予容量管理器服务（`"Service": "ec2.capacitymanager.amazonaws.com"`）写入导出文件（`"Action": "s3:PutObject"`）和读取对象（`"Action": "s3:GetObject"`）的权限，以便将数据复制到您的存储桶。
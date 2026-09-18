

# 为容量管理器数据创建数据导出
<a name="create-cm-export"></a>

要创建数据导出，您可以使用容量管理器控制台中的“数据导出”页面或 AWS CLI。

## 先决条件
<a name="cm-export-prerequisites"></a>

您必须创建 Amazon Simple Storage Service（Amazon S3）存储桶。您必须确保以下几点：
+ 您的 S3 存储桶必须与您启用容量管理器所在的同一 AWS 区域。
+ 您的 S3 存储桶具有容量管理器服务传输文件所需的权限策略。

有关更多信息，请参阅 [设置用于容量管理器数据导出的 Amazon S3 存储桶](cm-set-up-s3-export.md)。

## 过程
<a name="cm-export-procedure"></a>

您可以使用 AWS 控制台、AWS CLI 或 PowerShell 导出容量管理器数据。

------
#### [ Console ]

**要创建数据导出**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量管理器**。

1. 选择**数据导出**选项卡。

1. 选择**创建数据导出**。

1. 配置您的导出属性、传输位置和标签（可选）。

1. 选择**创建**。

------
#### [ AWS CLI ]

**要创建数据导出**  
使用以下命令按照指定配置创建数据导出：

```
aws ec2 create-capacity-manager-data-export \
    --s3-bucket-name my-exports-bucket \
    --s3-bucket-prefix capacity-data-exports \
    --schedule hourly \
    --output-format {{parquet/CSV}} \
    --tag-specifications 'ResourceType=capacity-manager-data-export,Tags=[{Key=environment,Value=production}]'
```

**注意**  
上述命令中的 `--tag-specifications` 参数将资源标签应用于数据导出资源本身（例如，用于成本分配或组织管理）。这些标签与受监控的标签键不同，后者决定了导出数据中包含哪些标签列。有关受监控标签键的更多信息，请参阅[管理受监控的标签键](managing-monitored-tag-keys.md)。

------
#### [ PowerShell ]

**要创建数据导出**  
使用 [New-EC2CapacityManagerDataExport](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2CapacityManagerDataExport.html) cmdlet。

```
New-EC2CapacityManagerDataExport `
    -S3BucketName "my-exports-bucket" `
    -S3BucketPrefix "capacity-data-exports" `
    -Schedule "hourly" `
    -OutputFormat "{{parquet}}" `
    -TagSpecification @([Amazon.EC2.Model.TagSpecification]@{
        ResourceType = "capacity-manager-data-export"
        Tags = @([Amazon.EC2.Model.Tag]@{
            Key   = "environment"
            Value = "production"
        })
    })
```

------

## 数据导出中的标签列
<a name="create-export-tag-columns"></a>

新创建的数据导出会将已激活的受监控标签键和容量管理器提供的标签对应的值作为附加列包含在内。有关更多信息，请参阅[管理受监控的标签键](managing-monitored-tag-keys.md)中的[数据导出中的标签](managing-monitored-tag-keys.md#tags-in-data-exports)。

**注意**  
如果您尚未激活任何受监控的标签键，导出仍将包含容量管理器提供的标签列（例如 `aws:autoscaling:groupName`、`aws:eks:cluster-name`、`eks:kubernetes-node-pool-name` 和 `karpenter.sh/nodepool`）。
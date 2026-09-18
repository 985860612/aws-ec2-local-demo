

# 使用竞价型实例数据源，跟踪您的竞价型实例费用
<a name="spot-data-feeds"></a>

为了帮助您了解竞价型实例的费用情况，Amazon EC2 通过提供的数据源说明竞价型实例使用情况和定价。此数据源会发送到您在订阅数据源时指定的 Amazon S3 存储桶。

数据源文件通常一小时到达存储桶一次。如果在特定小时中没有竞价型实例运行，则您不会收到该小时的数据源文件。

每小时竞价型实例的使用情况通常包含在一个数据文件中。这些文件在传送到您的存储桶前要进行压缩 (gzip)。当文件很大时（例如，当一小时的文件内容在压缩前超过 50 MB 时），Amazon EC2 可以将给定小时的使用情况写入多个文件。

**注意**  
您只能为每个 AWS 账户 创建一个竞价型实例数据源。

在所有 AWS 区域中，Spot 实例数据源均支持除中国（北京）、中国（宁夏）、AWS GovCloud (US) 和[预设情况下禁用的区域](using-regions-availability-zones.md#concepts-available-regions)。

**Topics**
+ [数据源文件名和格式](#using-spot-instances-format)
+ [Amazon S3 存储桶要求](#using-spot-instances-dfs3)
+ [订阅竞价型实例数据源](#using-spot-instances-datafeed-all)
+ [查看数据源中的数据](#using-spot-instances-datafeed-view-data)
+ [描述您的竞价型实例数据源](#using-spot-instances-datafeed-delete)

## 数据源文件名和格式
<a name="using-spot-instances-format"></a>

竞价型实例数据源的文件名采用以下格式 (用 UTC 日期和时间)：

```
{{bucket-name}}.s3.amazonaws.com{{/optional-prefix}}/{{aws-account-id}}.{{YYYY}}-{{MM}}-{{DD}}-{{HH}}.{{n}}.{{unique-id}}.gz
```

例如，如果您的存储桶名称为 **amzn-s3-demo-bucket** 并且前缀为 **my-prefix**，则您的文件名类似如下：

```
amzn-s3-demo-bucket.s3.amazonaws.com/my-prefix/111122223333.2023-12-09-07.001.b959dbc6.gz
```

有关存储桶名称的更多信息，请参阅《Amazon S3 用户指南》**中的[存储桶命名规则](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html)。

竞价型实例数据源文件采用制表符分隔格式。数据文件的每一行都对应一小时实例使用时间，并且包含在下表中列出的字段。


|  字段  |  描述  | 
| --- | --- | 
|  `Timestamp`  | 时间戳，其用于确定针对此实例使用收取的费用。 | 
|  `UsageType`  | 指示使用类型和被收取费用的实例类型。对于 `m1.small`竞价型实例，此字段设置为 `SpotUsage`。对于所有其他实例类型，此字段设置为 `SpotUsage:`{*instance-type*}。例如：`SpotUsage:c1.medium`。 | 
|  `Operation`  | 指示被收取费用的产品。对于 Linux 竞价型实例，此字段设置为 `RunInstances`。对于 Windows 竞价型实例，此字段设置为 `RunInstances:0002`。Spot 使用情况按照可用区分组。 | 
|  `InstanceID`  | 生成此实例使用的竞价型实例的 ID。 | 
|  `MyBidID`  | 生成此实例使用的竞价型实例请求的 ID。 | 
|  `MyMaxPrice`  | 为此竞价型请求指定的最高价。 | 
|  `MarketPrice`  | 在 `Timestamp` 字段中指定的时刻的 Spot 价格。 | 
|  `Charge`  | 针对此实例使用收取的费用。 | 
|  `Version`  | 数据源版本。1.0为可行的版本。 | 

## Amazon S3 存储桶要求
<a name="using-spot-instances-dfs3"></a>

在您订阅数据源时，必须指定 Amazon S3 存储桶来存储数据源文件。

在为数据源选择 Amazon S3 存储桶之前，请考虑以下内容：
+ 必须拥有对存储桶的 `FULL_CONTROL` 权限。如果您是存储桶拥有者，根据默认情况，您有此权限。否则，存储桶拥有者必须向您的 AWS 账户 授予此权限。
+ 在您订阅数据源时，这些权限用于更新存储桶 ACL，以向 AWS 数据源账户提供 `FULL_CONTROL` 权限。AWS 数据源账户会将数据源文件写入存储桶。如果您的账户没有所需权限，则数据源文件无法写入存储桶。有关的更多信息，请参阅《Amazon CloudWatch Logs 用户指南》中的[发送到 Amazon S3 的日志](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html#AWS-logs-infrastructure-S3)**。

  如果您更新 ACL 并删除 AWS 数据源账户的权限，则数据源文件无法写入存储桶。您必须重新订阅数据源以接收数据源文件。
+ 每一个数据源文件都有其自己的 ACL (不同于存储桶的 ACL)。存储桶拥有者具有数据文件的 `FULL_CONTROL` 权限。AWS 数据源账户具有读取和写入权限。
+ 如果您删除您的数据源订阅，Amazon EC2 不会撤销AWS数据源账户在存储桶或数据文件上的读取和写入权限。您必须自行撤销这些权限。
+ 如果您使用 AWS Key Management Service（SSE-KMS）中存储的 AWS KMS 密钥通过服务器端加密来加密 Amazon S3 存储桶，您必须使用客户自主管理型密钥。有关更多信息，请参阅 *Amazon CloudWatch Logs 用户指南*中的 [Amazon S3 存储桶服务器端加密](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html#AWS-logs-SSE-KMS-S3)。

## 订阅竞价型实例数据源
<a name="using-spot-instances-datafeed-all"></a>

您可以随时订阅竞价型实例数据源。您无法使用 Amazon EC2 控制台完成此任务。

如果您收到存储桶权限不足的错误，请参阅以下文章以获取故障排除信息：[Troubleshoot the data feed for Spot Instances](https://repost.aws/knowledge-center/s3-data-feed-ec2-spot-instances)。

------
#### [ AWS CLI ]

**订阅数据源**  
使用 [create-spot-datafeed-subscription](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-spot-datafeed-subscription.html) 命令。

要指定带前缀的存储桶，请使用以下示例：

```
aws ec2 create-spot-datafeed-subscription \
    --bucket {{amzn-s3-demo-bucket}} \
    --prefix {{my-prefix}}
```

要指定不带前缀的存储桶，请使用以下示例：

```
aws ec2 create-spot-datafeed-subscription \
    --bucket {{amzn-s3-demo-bucket}}
```

------
#### [ PowerShell ]

**订阅数据源**  
使用 [New-EC2SpotDatafeedSubscription](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2SpotDatafeedSubscription.html) cmdlet。

要指定带前缀的存储桶，请使用以下示例：

```
New-EC2SpotDatafeedSubscription `
    -Bucket {{amzn-s3-demo-bucket}} `
    -Prefix {{my-prefix}}
```

要指定不带前缀的存储桶，请使用以下示例：

```
New-EC2SpotDatafeedSubscription `
    -Bucket {{amzn-s3-demo-bucket}}
```

------

## 查看数据源中的数据
<a name="using-spot-instances-datafeed-view-data"></a>

在 AWS 管理控制台 中，打开 AWS CloudShell。使用以下 [s3 sync](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html) 命令从 S3 存储桶中获取数据源的 .gz 文件，并将文件存储到指定的文件夹。

```
aws s3 sync s3://{{amzn-s3-demo-bucket}} ./{{data-feed}}
```

要显示 .gz 文件的内容，请切换到存储 S3 存储桶内容的文件夹。

```
cd {{data-feed}}
```

使用 **ls** 命令查看文件名称。使用带有文件名的 **zcat** 命令来显示压缩文件的内容。示例命令如下。

```
zcat  {{111122223333.2023-12-09-07.001.b959dbc6}}.gz
```

下面是示例输出。

```
#Version: 1.0
#Fields: Timestamp UsageType Operation InstanceID MyBidID MyMaxPrice MarketPrice Charge Version
2023-12-09 07:13:47 UTC USE2-SpotUsage:c7a.medium       RunInstances:SV050      i-0c3e0c0b046e050df     sir-pwq6nmfp    0.0510000000 USD        0.0142000000 USD        0.0142000000 USD        1
```

## 描述您的竞价型实例数据源
<a name="using-spot-instances-datafeed-delete"></a>

用完竞价型实例数据源后，可以将其删除。

------
#### [ AWS CLI ]

**删除数据源**  
使用 [delete-spot-datafeed-subscription](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-spot-datafeed-subscription.html) 命令。

```
aws ec2 delete-spot-datafeed-subscription
```

------
#### [ PowerShell ]

**删除数据源**  
使用 [Remove-EC2SpotDatafeedSubscription](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2SpotDatafeedSubscription.html) cmdlet。

```
Remove-EC2SpotDatafeedSubscription
```

------
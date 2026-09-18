

# 使用 AWS CloudTrail 记录 Amazon EC2 API 调用
<a name="monitor-with-cloudtrail"></a>

Amazon EC2 API 与 [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/) 集成，后者是一项提供用户、角色或 AWS 服务所采取操作记录的服务。CloudTrail 将所有 Amazon EC2 API 调用作为事件捕获。捕获的调用包括控制台发出的调用。借助 CloudTrail 收集的信息，您可以确定向 Amazon EC2 API 发出的请求、发出请求的 IP 地址、发出请求的时间。

每个事件或日志条目都包含有关生成请求的人员信息。身份信息有助于您确定以下内容：
+ 请求是使用根用户凭证还是用户凭证发出的。
+ 请求是否代表 IAM Identity Center 用户发出。
+ 请求是使用角色还是联合用户的临时安全凭证发出的。
+ 请求是否由其他 AWS 服务 发出。

当您创建账户并可以自动访问 CloudTrail **事件历史记录**时，CloudTrail 在您的 AWS 账户 中处于活动状态。CloudTrail **事件历史记录**提供对 AWS 区域 中过去 90 天的已记录管理事件的可查看、可搜索、可下载和不可变记录。有关更多信息，请参阅《AWS CloudTrail 用户指南》的[使用 CloudTrail 事件历史记录](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html)**。查看**事件历史记录**不会收取 CloudTrail 费用。

要持续记录您的 AWS 账户 过去 90 天的事件，请创建跟踪或 [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html) 事件数据存储。

**CloudTrail 跟踪**  
通过*跟踪记录*，CloudTrail 可将日志文件传送至 Amazon S3 存储桶。使用 AWS 管理控制台 创建的所有跟踪均具有多区域属性。您可以通过使用 AWS CLI 创建单区域或多区域跟踪。建议创建多区域跟踪，因为您可记录您账户中的所有 AWS 区域 的活动。如果您创建单区域跟踪，则只能查看跟踪的 AWS 区域 中记录的事件。有关跟踪的更多信息，请参阅《AWS CloudTrail 用户指南》**中的[为您的 AWS 账户 创建跟踪](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-create-and-update-a-trail.html)和[为组织创建跟踪](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html)。  
通过创建跟踪，您可以从 CloudTrail 免费向您的 Amazon S3 存储桶传送一份正在进行的管理事件的副本，但会收取 Amazon S3 存储费用。有关 CloudTrail 定价的更多信息，请参阅 [AWS CloudTrail 定价](https://aws.amazon.com/cloudtrail/pricing/)。有关 Amazon S3 定价的信息，请参阅 [Amazon S3 定价](https://aws.amazon.com/s3/pricing/)。

**CloudTrail Lake 事件数据存储**  
*CloudTrail Lake* 允许您对事件运行基于 SQL 的查询。CloudTrail Lake 可将基于行的 JSON 格式的现有事件转换为 [Apache ORC](https://orc.apache.org/) 格式。ORC 是一种针对快速检索数据进行优化的列式存储格式。事件将被聚合到*事件数据存储*中，它是基于您通过应用[高级事件选择器](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-concepts.html#adv-event-selectors)选择的条件的不可变的事件集合。应用于事件数据存储的选择器用于控制哪些事件持续存在并可供您查询。有关 CloudTrail Lake 的更多信息，请参阅《AWS CloudTrail 用户指南》**中的[使用 AWS CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html)。  
CloudTrail Lake 事件数据存储和查询会产生费用。创建事件数据存储时，您可以选择要用于事件数据存储的[定价选项](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-manage-costs.html#cloudtrail-lake-manage-costs-pricing-option)。定价选项决定了摄取和存储事件的成本，以及事件数据存储的默认和最长保留期。有关 CloudTrail 定价的更多信息，请参阅 [AWS CloudTrail 定价](https://aws.amazon.com/cloudtrail/pricing/)。

## CloudTrail 中的 Amazon EC2 API 管理事件
<a name="cloudtrail-management-events"></a>

[管理事件](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-management-events-with-cloudtrail.html#logging-management-events)提供对您的 AWS 账户 内资源所执行管理操作的相关信息。这些也称为控制面板操作。默认情况下，CloudTrail 会记录管理事件。

所有 Amazon EC2 API 操作都被记录为管理事件。有关记录到 CloudTrail 中的 API 操作的列表，请参阅《[Amazon EC2 API 参考](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/)》。例如，对 [RunInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RunInstances.html)、[DescribeInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstances.html) 和 [StopInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_StopInstances.html) 操作的调用被记录为管理事件。

## Amazon EC2 API 事件示例
<a name="cloudtrail-event-examples"></a>

一个事件表示一个来自任何源的请求，包括有关所请求的 API 操作、操作的日期和时间、请求参数等方面的信息。CloudTrail 日志文件不是公用 API 调用的有序堆栈跟踪，因此事件不会按任何特定顺序显示。

下面的日志文件记录显示，用户终止了一个实例。

```
{
   "Records":[
      {
         "eventVersion":"1.03",
         "userIdentity":{
            "type":"Root",
            "principalId":"123456789012",
            "arn":"arn:aws:iam::123456789012:root",
            "accountId":"123456789012",
            "accessKeyId":"AKIAIOSFODNN7EXAMPLE",
            "userName":"user"
         },
         "eventTime":"2016-05-20T08:27:45Z",
         "eventSource":"ec2.amazonaws.com",
         "eventName":"TerminateInstances",
         "awsRegion":"us-west-2",
         "sourceIPAddress":"198.51.100.1",
         "userAgent":"aws-cli/1.10.10 Python/2.7.9 Windows/7botocore/1.4.1",
         "requestParameters":{
            "instancesSet":{
               "items":[{
                  "instanceId":"i-1a2b3c4d"
               }]
            }
         },
         "responseElements":{
            "instancesSet":{
               "items":[{
                  "instanceId":"i-1a2b3c4d",
                  "currentState":{
                     "code":32,
                     "name":"shutting-down"
                  },
                  "previousState":{
                     "code":16,
                     "name":"running"
                  }
               }]
            }
         },
         "requestID":"be112233-1ba5-4ae0-8e2b-1c302EXAMPLE",
         "eventID":"6e12345-2a4e-417c-aa78-7594fEXAMPLE",
         "eventType":"AwsApiCall",
         "recipientAccountId":"123456789012"
     }
   ]
}
```

有关 CloudTrail 记录内容的信息，请参阅《AWS CloudTrail 用户指南》**中的 [CloudTrail 记录内容](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)。

## 审核使用 EC2 Instance Connect 建立的连接
<a name="ec2-instance-connect-cloudtrail"></a>

您可以使用 AWS CloudTrail 审核通过 EC2 Instance Connect 连接到实例的用户。

**使用 AWS CloudTrail 控制台审计通过 EC2 Instance Connect 进行的 SSH 活动**

1. 访问 [https://console.aws.amazon.com/cloudtrail/](https://console.aws.amazon.com/cloudtrail/)，打开 CloudTrail 控制台。

1. 验证您是否位于正确的区域中。

1. 在导航窗格中，选择**事件历史记录**。

1. 对于**筛选条件**，请选择**事件源**，然后选择 **ec2-instance-connect.amazonaws.com**。

1. （可选）对于**时间范围**，请选择一个时间范围。

1. 选择**刷新事件**图标。

1. 该页面显示与 [SendSSHPublicKey](https://docs.aws.amazon.com/ec2-instance-connect/latest/APIReference/API_SendSSHPublicKey.html) API 调用对应的事件。使用箭头展开一个事件以查看其他详细信息，例如，用于建立 SSH 连接的用户名和 AWS 访问密钥以及源 IP 地址。

1. 要以 JSON 格式显示完整事件信息，请选择**查看事件**。**requestParameters** 字段包含用于建立 SSH 连接的目标实例 ID、操作系统用户名和公有密钥。

   ```
   {
       "eventVersion": "1.05",
       "userIdentity": {
           "type": "IAMUser",
           "principalId": "ABCDEFGONGNOMOOCB6XYTQEXAMPLE",
           "arn": "arn:aws:iam::1234567890120:user/IAM-friendly-name",
           "accountId": "123456789012",
           "accessKeyId": "ABCDEFGUKZHNAW4OSN2AEXAMPLE",
           "userName": "IAM-friendly-name",
           "sessionContext": {
               "attributes": {
                   "mfaAuthenticated": "false",
                   "creationDate": "2018-09-21T21:37:58Z"}
           }
       },
       "eventTime": "2018-09-21T21:38:00Z",
       "eventSource": "ec2-instance-connect.amazonaws.com",
       "eventName": "SendSSHPublicKey ",
       "awsRegion": "us-west-2",
       "sourceIPAddress": "123.456.789.012",
       "userAgent": "aws-cli/1.15.61 Python/2.7.10 Darwin/16.7.0 botocore/1.10.60",
       "requestParameters": {
           "instanceId": "i-0123456789EXAMPLE",
           "osUser": "ec2-user",
           "SSHKey": {
               "publicKey": "ssh-rsa ABCDEFGHIJKLMNO01234567890EXAMPLE"
           }
        },
       "responseElements": null,
       "requestID": "1a2s3d4f-bde6-11e8-a892-f7ec64543add",
       "eventID": "1a2w3d4r5-a88f-4e28-b3bf-30161f75be34",
       "eventType": "AwsApiCall",
       "recipientAccountId": "0987654321"
   }
   ```

   如果已将 AWS 账户配置为在 S3 存储桶中收集 CloudTrail 事件，您可以按编程方式下载和审计该信息。有关更多信息，请参阅《*AWS CloudTrail 用户指南*》中的[获取和查看 CloudTrail 日志文件](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/get-and-view-cloudtrail-log-files.html)。
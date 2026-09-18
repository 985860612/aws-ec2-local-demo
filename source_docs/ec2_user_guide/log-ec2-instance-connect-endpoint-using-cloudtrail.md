

# 通过 EC2 Instance Conect Endpoint 建立的日志连接
<a name="log-ec2-instance-connect-endpoint-using-cloudtrail"></a>

您可以使用日志记录资源操作并使用 AWS CloudTrail 日志审核通过 EC2 Instance Connect Endpoint 建立的连接。

有关将 AWS CloudTrail 与 Amazon EC2 结合使用的更多信息，请参阅 [使用 AWS CloudTrail 记录 Amazon EC2 API 调用](monitor-with-cloudtrail.md)。

## 使用 AWS CloudTrail 记录 EC2 Instance Connect Endpoint API 调用日志
<a name="ec2-instance-connect-endpoint-api-calls-cloudtrail"></a>

EC2 Instance Connect Endpoint 资源操作将作为管理事件记录到 CloudTrail。当进行以下 API 调用时，该活动将在**事件历史记录**中作为 CloudTrail 事件记录：
+ `CreateInstanceConnectEndpoint`
+ `DescribeInstanceConnectEndpoints`
+ `DeleteInstanceConnectEndpoint`

您可以在 AWS 账户中查看、搜索和下载最新事件。有关更多信息，请参阅 *AWS CloudTrail 用户指南*中的[使用 CloudTrail 事件历史记录查看事件](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html)。

## 使用 AWS CloudTrail 审核使用 EC2 Instance Connect Endpoint 连接到实例的用户
<a name="ec2-instance-connect-endpoint-audit-users-cloudtrail"></a>

通过 EC2 Instance Connect Endpoint 对实例的连接尝试将记录在 CloudTrail 的**事件历史记录**中。当通过 EC2 Instance Connect Endpoint 启动对实例的连接时，该连接将被记录为带有 `OpenTunnel` 的 `eventName` 的 CloudTrail 管理事件。

您可以创建将 CloudTrail 事件路由到目标的 Amazon EventBridge 规则。有关更多信息，请参阅 [Amazon EventBridge 用户指南](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html)。

以下是在 CloudTrail 中记录的 `OpenTunnel` 管理事件示例。

```
{
     "eventVersion": "1.08",
     "userIdentity": {
         "type": "IAMUser",
         "principalId": "ABCDEFGONGNOMOOCB6XYTQEXAMPLE",
         "arn": "arn:aws:iam::1234567890120:user/IAM-friendly-name",
         "accountId": "123456789012",
         "accessKeyId": "ABCDEFGUKZHNAW4OSN2AEXAMPLE",
         "userName": "IAM-friendly-name"
     },
     "eventTime": "2023-04-11T23:50:40Z",
     "eventSource": "ec2-instance-connect.amazonaws.com",
     "eventName": "OpenTunnel",
     "awsRegion": "us-east-1",
     "sourceIPAddress": "1.2.3.4",
     "userAgent": "aws-cli/1.15.61 Python/2.7.10 Darwin/16.7.0 botocore/1.10.60",
     "requestParameters": {
         "instanceConnectEndpointId": "eici-0123456789EXAMPLE",
         "maxTunnelDuration": "3600",
         "remotePort": "22",
         "privateIpAddress": "10.0.1.1"
     },
     "responseElements": null,
     "requestID": "98deb2c6-3b3a-437c-a680-03c4207b6650",
     "eventID": "bbba272c-8777-43ad-91f6-c4ab1c7f96fd",
     "readOnly": false,
     "resources": [{
         "accountId": "123456789012",
         "type": "AWS::EC2::InstanceConnectEndpoint",
         "ARN": "arn:aws:ec2:us-east-1:123456789012:instance-connect-endpoint/eici-0123456789EXAMPLE"
     }],
     "eventType": "AwsApiCall",
     "managementEvent": true,
     "recipientAccountId": "123456789012",
     "eventCategory": "Management"
}
```
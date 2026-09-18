

# 使用接口 VPC 端点访问 Amazon EC2
<a name="interface-vpc-endpoints"></a>

您可以通过在 VPC 中的资源和 Amazon EC2 API 之间创建私有连接来改善 VPC 的安保状况。您可以像在 VPC 中一样访问 Amazon EC2 API，而无需使用互联网网关、NAT 设备、VPN 连接或 Direct Connect 连接。VPC 中的 EC2 实例不需要公有 IP 地址即可访问 Amazon EC2 API。

有关更多信息，请参阅 *AWS PrivateLink 指南*中的[通过 AWS PrivateLink 访问 AWS 服务](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-access-aws-services.html)。

**Topics**
+ [创建接口 VPC 端点](#create-endpoint)
+ [创建端点策略](#endpoint-policy)

## 创建接口 VPC 端点
<a name="create-endpoint"></a>

使用以下服务名称为 Amazon EC2 创建接口端点：
+ **com.amazonaws.{{region}}.ec2** - 为 Amazon EC2 API 操作创建端点。

有关更多信息，请参阅 *AWS PrivateLink 指南*中的[使用接口 VPC 端点访问 AWS 服务](https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html)。

## 创建端点策略
<a name="endpoint-policy"></a>

端点策略是一种 IAM 资源，您可以将其附加到接口端点。默认端点策略允许通过接口端点访问 Amazon EC2 API 的完全权限。要控制允许从 VPC 访问 Amazon EC2 API 的权限，请将自定义端点策略附加到接口端点。

端点策略指定以下信息：
+ 可以执行操作的主体。
+ 可执行的操作。
+ 可对其执行操作的资源。

**重要**  
当将非默认策略应用于 Amazon EC2 的接口 VPC 端点时，某些失败的 API 请求（例如 `RequestLimitExceeded` 中失败的请求）可能不会记录到 AWS CloudTrail 或 Amazon CloudWatch。

有关更多信息，请参阅 *AWS PrivateLink 指南*中的[使用端点策略控制对服务的访问权限](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html)。

以下示例显示一个 VPC 端点策略，该策略拒绝创建未加密的卷或启动具有未加密卷的实例的权限。示例策略还授予执行所有其他 Amazon EC2 操作的权限。

------
#### [ JSON ]

****  

```
{
    "Version":"2012-10-17",		 	 	 
    "Statement": [
    {
        "Action": "ec2:*",
        "Effect": "Allow",
        "Resource": "*",
        "Principal": "*"
    },
    {
        "Action": [
            "ec2:CreateVolume"
        ],
        "Effect": "Deny",
        "Resource": "*",
        "Principal": "*",
        "Condition": {
            "Bool": {
                "ec2:Encrypted": "false"
            }
        }
    },
    {
        "Action": [
            "ec2:RunInstances"
        ],
        "Effect": "Deny",
        "Resource": "*",
        "Principal": "*",
        "Condition": {
            "Bool": {
                "ec2:Encrypted": "false"
            }
        }
    }]
}
```

------
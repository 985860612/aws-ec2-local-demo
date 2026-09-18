

# 检索 EC2 实例的实例身份文档
<a name="retrieve-iid"></a>

Amazon EC2 实例的实例身份文档使用纯文本 JSON 格式。有关实例身份证件内容的描述，请参阅 [Amazon EC2 实例的实例身份文档](instance-identity-documents.md)。

实例身份文件存储在实例的实例元数据中，属于 `instance-identity/document` 动态数据类别。您可以通过连接到实例并从实例元数据中进行检索来访问实例的实例身份文档。

您可以使用 IPv4 地址 169.254.169.254 或 IPv6 地址 fd00:ec2::254 访问实例元数据。这些是[链路本地地址](using-instance-addressing.md#link-local-addresses)，表示只能从该实例进行访问。本页上的示例使用 IMDS 的 IPv4 地址：169.254.169.254。要通过 IPv6 检索 EC2 实例的实例元数据，请使用 fd00:ec2::254。

要在检索实例身份文档后验证其真实性，请参阅[验证实例身份文档](verify-iid.md)。

------
#### [ IMDSv2 ]

**Linux**  
在 Linux 实例上运行以下命令，来检索实例身份文档。

```
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
    && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/dynamic/instance-identity/document
```

**Windows**  
在 Windows 实例上运行以下 cmdlet，来检索实例身份文档。

```
[string]$token = (Invoke-WebRequest -Headers @{'X-aws-ec2-metadata-token-ttl-seconds' = '21600'} `
    -Method PUT -Uri 'http://169.254.169.254/latest/api/token' -UseBasicParsing).Content
```

```
(Invoke-WebRequest -Headers @{'X-aws-ec2-metadata-token' = $token} `
    -Uri 'http://169.254.169.254/latest/dynamic/instance-identity/document' -UseBasicParsing).Content
```

------
#### [ IMDSv1 ]

**Linux**  
在 Linux 实例上运行以下命令，来检索实例身份文档。

```
curl http://169.254.169.254/latest/dynamic/instance-identity/document
```

**Windows**  
在 Windows 实例上运行以下 cmdlet，来检索实例身份文档。

```
(Invoke-WebRequest http://169.254.169.254/latest/dynamic/instance-identity/document).Content
```

------

下面是示例输出。

```
{
    "devpayProductCodes" : null,
    "marketplaceProductCodes" : [ "1abc2defghijklm3nopqrs4tu" ], 
    "availabilityZone" : "us-west-2b",
    "privateIp" : "10.158.112.84",
    "version" : "2017-09-30",
    "instanceId" : "i-1234567890abcdef0",
    "billingProducts" : null,
    "instanceType" : "t2.micro",
    "accountId" : "123456789012",
    "imageId" : "ami-5fb8c835",
    "pendingTime" : "2016-11-19T16:32:11Z",
    "architecture" : "x86_64",
    "kernelId" : null,
    "ramdiskId" : null,
    "region" : "us-west-2"
}
```
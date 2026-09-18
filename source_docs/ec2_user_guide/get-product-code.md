

# 从您的实例中检索 AWS Marketplace 产品代码
<a name="get-product-code"></a>

可以使用实例元数据检索实例的 AWS Marketplace 产品代码。如果实例具有产品代码，则 Amazon EC2 将返回产品代码。有关检索元数据的更多信息，请参阅 [访问 EC2 实例的实例元数据](instancedata-data-retrieval.md)。

------
#### [ IMDSv2 ]

**Linux**  
在 Linux 实例上运行以下命令。

```
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
    && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/product-codes
```

**Windows**  
在 Windows 实例上运行以下 cmdlet。

```
[string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} `
    -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} `
    -Method GET -Uri http://169.254.169.254/latest/meta-data/product-codes
```

------
#### [ IMDSv1 ]

**Linux**  
在 Linux 实例上运行以下命令。

```
curl http://169.254.169.254/latest/meta-data/product-codes
```

**Windows**  
在 Windows 实例上运行以下命令。

```
Invoke-RestMethod -Uri http://169.254.169.254/latest/meta-data/product-codes
```

------
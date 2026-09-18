

# 使用实例元数据服务访问实例元数据
<a name="configuring-instance-metadata-service"></a>

您可以使用以下其中一种方法，从正在运行的实例中访问实例元数据：
+ 实例元数据服务版本 2 (IMDSv2)：一种面向会话的方法

  有关示例，请参阅 [IMDSv2 的示例](#instance-metadata-retrieval-examples)。
+ 实例元数据服务版本 1（IMDSv1）– 一种请求/响应方法

  有关示例，请参阅 [IMDSv1 的示例](#instance-metadata-retrieval-examples-imdsv1)。

默认情况下，您可以使用 IMDSv1 和/或 IMDSv2。

您可以在每个实例上配置实例元数据服务（IMDS），使其仅接受 IMDSv2 调用，这将导致 IMDSv1 调用失败。有关如何配置实例以使用 IMDSv2 的信息，请参阅 [配置实例元数据服务选项](configuring-instance-metadata-options.md)。

`PUT` 或 `GET` 标头对于 IMDSv2 是唯一的。如果请求中存在这些标头，则该请求针对 IMDSv2。如果不存在标头，则假定该请求针对 IMDSv1。

有关 IMDSv2 的详细回顾，请参阅[借助 EC2 实例元数据服务的增强功能，为开放式防火墙、反向代理和 SSRF 漏洞增加深度防御](https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/)。

**Topics**
+ [实例元数据服务版本 2 的工作原理](#instance-metadata-v2-how-it-works)
+ [使用支持的 AWS 开发工具包](#use-a-supported-sdk-version-for-imdsv2)
+ [IMDSv2 的示例](#instance-metadata-retrieval-examples)
+ [IMDSv1 的示例](#instance-metadata-retrieval-examples-imdsv1)

## 实例元数据服务版本 2 的工作原理
<a name="instance-metadata-v2-how-it-works"></a>

IMDSv2 使用面向会话的请求。对于面向会话的请求，您创建一个会话令牌以定义会话持续时间，该时间最少为 1 秒，最多为 6 小时。在指定的持续时间内，您可以将相同的会话令牌用于后续请求。在指定的持续时间到期后，您必须创建新的会话令牌以用于将来的请求。

**注意**  
本部分中的示例使用实例元数据服务（IMDS）的 IPv4 地址：`169.254.169.254`。如果要通过 IPv6 地址检索 EC2 实例的实例元数据，请确保启用并改用 IPv6 地址：`[fd00:ec2::254]`。IMDS 的 IPv6 地址与 IMDSv2 命令兼容。IPv6 地址仅可在[支持 IPv6 的子网](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html#subnet-ip-address-range)（双栈或仅 IPv6）中[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)上访问。

以下示例使用 Shell 脚本和 IMDSv2 检索顶级实例元数据项。每个示例：
+ 使用 `PUT` 请求创建持续 6 小时（21600 秒）的会话令牌
+ 将会话令牌标头存储在名为 `TOKEN`（Linux 实例）或 `token`（Windows 实例）的变量中
+ 使用令牌请求顶级元数据项

### Linux 示例
<a name="how-imdsv2-works-example-linux"></a>

您可以运行两个单独的命令，也可以将它们组合使用。

**单独的命令**

首先，使用以下命令生成令牌。

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
```

然后，通过令牌使用以下命令生成顶级元数据项。

```
[ec2-user ~]$ curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/
```

**组合命令**

您可以存储令牌并组合命令。以下示例将上述两个命令组合在一起，并将会话令牌标头存储在名为 TOKEN 的变量中。

**注意**  
如果创建令牌时发生错误，则不会生成有效令牌，而会在变量中存储一条错误消息，该命令将不起作用。

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
	&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/
```

在创建令牌后，您可以重复使用令牌，直到令牌过期。在以下示例命令（获取用于启动实例的 AMI 的 ID）中，将重复使用上一示例中的令牌（存储在 `$TOKEN` 中）。

```
[ec2-user ~]$ curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/ami-id
```

### Windows 示例
<a name="how-imdsv2-works-example-windows"></a>

```
PS C:\> [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/meta-data/
```

在创建令牌后，您可以重复使用令牌，直到令牌过期。在以下示例命令（获取用于启动实例的 AMI 的 ID）中，将重复使用上一示例中的令牌（存储在 `$token` 中）。

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} `
	-Method GET -uri http://169.254.169.254/latest/meta-data/ami-id
```

在使用 IMDSv2 请求实例元数据时，请求必须包含以下内容：

1. 使用 `PUT` 请求启动到实例元数据服务的会话。`PUT` 请求返回一个令牌，该令牌必须包含在对实例元数据服务的后续 `GET` 请求中。需要具有该令牌才能使用 IMDSv2 访问元数据。

1. 将该令牌包含在对 IMDS 的所有 `GET` 请求中。如果将令牌使用设置为 `required`，没有有效令牌或令牌过期的请求将显示 `401 - Unauthorized` HTTP 错误代码。
   + 令牌是实例特定的密钥。令牌在其他 EC2 实例上无效，如果尝试在生成令牌的实例外部使用，令牌将会被拒绝。
   + `PUT` 请求必须包含一个标头，它以秒为单位指定令牌的生存时间 (TTL)，最多为 6 小时（21600 秒）。令牌表示一个逻辑会话。TTL 指定令牌的有效时间长度，因而指定会话的持续时间。
   + 在令牌过期后，要继续访问实例元数据，您必须使用另一 `PUT` 创建新会话。
   + 您可以选择在每个请求中重复使用令牌或创建新的令牌。对于少量请求，每次需要访问 IMDS 时生成令牌并立即使用可能会更容易。但为了提高效率，您可以为令牌指定更长的持续时间并重复使用令牌，而不必在每次需要请求实例元数据时都编写 `PUT` 请求。对并发令牌数量没有实际限制，每个令牌表示自己的会话。不过，IMDSv2 仍然受到正常 IMDS 连接和节流限制的制约。有关更多信息，请参阅 [查询限制](instancedata-data-retrieval.md#instancedata-throttling)。

允许在 IMDSv2 实例元数据请求中使用 HTTP `GET` 和 `HEAD` 方法。如果 `PUT` 请求包含 X-Forwarded-For 标头，则会被拒绝。

默认情况下，`PUT` 请求的响应在 IP 协议级别的响应跃点数限制（生存时间）为 `1`。如果需要更大的跃点数限制，可使用 [modify-instance-metadata-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-options.html) AWS CLI 命令进行调整。例如，您可能需要使用更大的跃点数限制，以便与实例上运行的容器服务保持向后兼容。有关更多信息，请参阅 [为现有实例修改实例元数据选项](configuring-IMDS-existing-instances.md)。

## 使用支持的 AWS 开发工具包
<a name="use-a-supported-sdk-version-for-imdsv2"></a>

要使用 IMDSv2，EC2 实例必须使用支持 IMDSv2 的 AWS 开发工具包版本。所有 AWS 开发工具包的最新版本均支持使用 IMDSv2。

**重要**  
我们建议您及时了解开发工具包版本，以了解其最新功能、安全更新和底层依赖项。不建议继续使用不受支持的开发工具包版本，但是否继续使用由您自行决定。有关更多信息，请参阅《AWS SDK 和工具参考指南》**中的 [AWS SDK 和工具维护策略](https://docs.aws.amazon.com/sdkref/latest/guide/maint-policy.html)。

以下是支持使用 IMDSv2 的最低版本：
+ [AWS CLI](https://github.com/aws/aws-cli) – 1.16.289
+ [AWS Tools for Windows PowerShell](https://github.com/aws/aws-tools-for-powershell) – 4.0.1.0
+ [适用于 .NET 的 AWS SDK](https://github.com/aws/aws-sdk-net) – 3.3.634.1
+ [适用于 C\+\+ 的 AWS SDK](https://github.com/aws/aws-sdk-cpp) – 1.7.229
+ [适用于 Go 的 AWS SDK](https://github.com/aws/aws-sdk-go) – 1.25.38
+ [AWS SDK for Go v2](https://github.com/aws/aws-sdk-go-v2) – 0.19.0
+ [适用于 Java 的 AWS SDK](https://github.com/aws/aws-sdk-java) – 1.11.678
+ [AWS SDK for Java 2.x](https://github.com/aws/aws-sdk-java-v2) – 2.10.21
+ [适用于 Node.js 中 JavaScript 的 AWS 开发工具包](https://github.com/aws/aws-sdk-js) – 2.722.0
+ [适用于 Kotlin 的 AWS SDK](https://github.com/awslabs/aws-sdk-kotlin)：1.1.4
+ [适用于 PHP 的 AWS SDK](https://github.com/aws/aws-sdk-php) – 3.147.7
+ [适用于 Python (Botocore) 的 AWS SDK](https://github.com/boto/botocore) – 1.13.25
+ [适用于 Python (Boto3) 的 AWS SDK](https://github.com/boto/boto3) – 1.12.6
+ [适用于 Ruby 的 AWS SDK](https://github.com/aws/aws-sdk-ruby) – 3.79.0

## IMDSv2 的示例
<a name="instance-metadata-retrieval-examples"></a>

在您的 Amazon EC2 实例上运行以下示例，以检索 IMDSv2 的实例元数据。

在 Windows 实例上，您可以使用 Windows PowerShell，也可以安装 cURL 或 wget。如果您在 Windows 实例上安装第三方工具，请确保您仔细阅读随附的文档，因为调用和输出格式可能与此处所述的内容不同。

**Topics**
+ [获取实例元数据的可用版本](#instance-metadata-ex-1)
+ [获取顶级元数据项](#instance-metadata-ex-2)
+ [获取元数据项的值](#instance-metadata-ex-2a)
+ [获取可用的公有密钥列表](#instance-metadata-ex-3)
+ [显示可以使用公有密钥 0 的格式](#instance-metadata-ex-4)
+ [获取公有密钥 0（采用 OpenSSH 密钥格式）](#instance-metadata-ex-5)
+ [获取实例的子网 ID](#instance-metadata-ex-6)
+ [获取实例的实例标签](#instance-metadata-ex-7)

### 获取实例元数据的可用版本
<a name="instance-metadata-ex-1"></a>

此示例可以获取实例元数据的可用版本。当有新的实例元数据类别发布时，每个版本都引用一个实例元数据构建。实例元数据构建版本与 Amazon EC2 API 版本不相关。如果您有依赖于以前版本中所存在的结构和信息的脚本，则您可使用早期版本。

------
#### [ cURL ]

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/
1.0
2007-01-19
2007-03-01
2007-08-29
2007-10-10
2007-12-15
2008-02-01
2008-09-01
2009-04-04
2011-01-01
2011-05-01
2012-01-12
2014-02-25
2014-11-05
2015-10-20
2016-04-19
...
latest
```

------
#### [ PowerShell ]

```
PS C:\> [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/
1.0
2007-01-19
2007-03-01
2007-08-29
2007-10-10
2007-12-15
2008-02-01
2008-09-01
2009-04-04
2011-01-01
2011-05-01
2012-01-12
2014-02-25
2014-11-05
2015-10-20
2016-04-19
...
latest
```

------

### 获取顶级元数据项
<a name="instance-metadata-ex-2"></a>

此示例获得顶级元数据项目。有关响应中项目的更多信息，请参阅 [实例元数据类别](ec2-instance-metadata.md#instancedata-data-categories)。

请注意，只有在允许您访问的情况下，标签才会包含在此输出中。有关更多信息，请参阅 [启用对实例元数据中标签的访问权限](work-with-tags-in-IMDS.md#allow-access-to-tags-in-IMDS)。

------
#### [ cURL ]

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/    
ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/
events/
hostname
iam/
instance-action
instance-id
instance-life-cycle
instance-type
local-hostname
local-ipv4
mac
metrics/
network/
placement/
profile
public-hostname
public-ipv4
public-keys/
reservation-id
security-groups
services/
tags/
```

------
#### [ PowerShell ]

```
PS C:\> [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/meta-data/
ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/
hostname
iam/
instance-action
instance-id
instance-life-cycle
instance-type
local-hostname
local-ipv4
mac
metrics/
network/
placement/
profile
public-hostname
public-ipv4
public-keys/
reservation-id
security-groups
services/
tags/
```

------

### 获取元数据项的值
<a name="instance-metadata-ex-2a"></a>

这些示例获取在前面示例中获取的某些顶级元数据项的值。这些请求使用在前面的示例中使用命令创建的存储令牌。令牌不得过期。

------
#### [ cURL ]

```
[ec2-user ~]$ curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/ami-id
ami-0abcdef1234567890
```

```
[ec2-user ~]$ curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/reservation-id
r-0efghijk987654321
```

```
[ec2-user ~]$ curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/local-hostname
ip-10-251-50-12.ec2.internal
```

```
[ec2-user ~]$ curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-hostname
ec2-203-0-113-25.compute-1.amazonaws.com
```

------
#### [ PowerShell ]

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/meta-data/ami-id
ami-0abcdef1234567890
```

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/meta-data/reservation-id
r-0efghijk987654321
```

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/meta-data/local-hostname
ip-10-251-50-12.ec2.internal
```

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/meta-data/public-hostname
ec2-203-0-113-25.compute-1.amazonaws.com
```

------

### 获取可用的公有密钥列表
<a name="instance-metadata-ex-3"></a>

此示例获得可用公有密钥的列表。

------
#### [ cURL ]

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-keys/
0=my-public-key
```

------
#### [ PowerShell ]

```
PS C:\> [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/meta-data/public-keys/
0=my-public-key
```

------

### 显示可以使用公有密钥 0 的格式
<a name="instance-metadata-ex-4"></a>

此示例显示了可以使用公有密钥 0 的格式。

------
#### [ cURL ]

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-keys/0/
openssh-key
```

------
#### [ PowerShell ]

```
PS C:\> [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key
openssh-key
```

------

### 获取公有密钥 0（采用 OpenSSH 密钥格式）
<a name="instance-metadata-ex-5"></a>

此示例获得公有密钥 0 (以 OpenSSH 密钥格式)。

------
#### [ cURL ]

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key
ssh-rsa MIICiTCCAfICCQD6m7oRw0uXOjANBgkqhkiG9w0BAQUFADCBiDELMAkGA1UEBhMC
VVMxCzAJBgNVBAgTAldBMRAwDgYDVQQHEwdTZWF0dGxlMQ8wDQYDVQQKEwZBbWF6
b24xFDASBgNVBAsTC0lBTSBDb25zb2xlMRIwEAYDVQQDEwlUZXN0Q2lsYWMxHzAd
BgkqhkiG9w0BCQEWEG5vb25lQGFtYXpvbi5jb20wHhcNMTEwNDI1MjA0NTIxWhcN
MTIwNDI0MjA0NTIxWjCBiDELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYD
VQQHEwdTZWF0dGxlMQ8wDQYDVQQKEwZBbWF6b24xFDASBgNVBAsTC0lBTSBDb25z
b2xlMRIwEAYDVQQDEwlUZXN0Q2lsYWMxHzAdBgkqhkiG9w0BCQEWEG5vb25lQGFt
YXpvbi5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMaK0dn+a4GmWIWJ
21uUSfwfEvySWtC2XADZ4nB+BLYgVIk60CpiwsZ3G93vUEIO3IyNoH/f0wYK8m9T
rDHudUZg3qX4waLG5M43q7Wgc/MbQITxOUSQv7c7ugFFDzQGBzZswY6786m86gpE
Ibb3OhjZnzcvQAaRHhdlQWIMm2nrAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAtCu4
nUhVVxYUntneD9+h8Mg9q6q+auNKyExzyLwaxlAoo7TJHidbtS4J5iNmZgXL0Fkb
FFBjvSfpJIlJ00zbhNYS5f6GuoEDmFJl0ZxBHjJnyp378OD8uTs7fLvjx79LjSTb
NYiytVbZPQUQ5Yaxu2jXnimvw3rrszlaEXAMPLE my-public-key
```

------
#### [ PowerShell ]

```
PS C:\> [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key
ssh-rsa MIICiTCCAfICCQD6m7oRw0uXOjANBgkqhkiG9w0BAQUFADCBiDELMAkGA1UEBhMC
VVMxCzAJBgNVBAgTAldBMRAwDgYDVQQHEwdTZWF0dGxlMQ8wDQYDVQQKEwZBbWF6
b24xFDASBgNVBAsTC0lBTSBDb25zb2xlMRIwEAYDVQQDEwlUZXN0Q2lsYWMxHzAd
BgkqhkiG9w0BCQEWEG5vb25lQGFtYXpvbi5jb20wHhcNMTEwNDI1MjA0NTIxWhcN
MTIwNDI0MjA0NTIxWjCBiDELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYD
VQQHEwdTZWF0dGxlMQ8wDQYDVQQKEwZBbWF6b24xFDASBgNVBAsTC0lBTSBDb25z
b2xlMRIwEAYDVQQDEwlUZXN0Q2lsYWMxHzAdBgkqhkiG9w0BCQEWEG5vb25lQGFt
YXpvbi5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMaK0dn+a4GmWIWJ
21uUSfwfEvySWtC2XADZ4nB+BLYgVIk60CpiwsZ3G93vUEIO3IyNoH/f0wYK8m9T
rDHudUZg3qX4waLG5M43q7Wgc/MbQITxOUSQv7c7ugFFDzQGBzZswY6786m86gpE
Ibb3OhjZnzcvQAaRHhdlQWIMm2nrAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAtCu4
nUhVVxYUntneD9+h8Mg9q6q+auNKyExzyLwaxlAoo7TJHidbtS4J5iNmZgXL0Fkb
FFBjvSfpJIlJ00zbhNYS5f6GuoEDmFJl0ZxBHjJnyp378OD8uTs7fLvjx79LjSTb
NYiytVbZPQUQ5Yaxu2jXnimvw3rrszlaEXAMPLE my-public-key
```

------

### 获取实例的子网 ID
<a name="instance-metadata-ex-6"></a>

此示例获取实例的子网 ID。

------
#### [ cURL ]

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/network/interfaces/macs/02:29:96:8f:6a:2d/subnet-id
subnet-be9b61d7
```

------
#### [ PowerShell ]

```
PS C:\> [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/meta-data/network/interfaces/macs/02:29:96:8f:6a:2d/subnet-id
subnet-be9b61d7
```

------

### 获取实例的实例标签
<a name="instance-metadata-ex-7"></a>

如果对实例元数据中的实例标签的访问权限已开启，则可以从实例元数据中获得实例标签。有关更多信息，请参阅 [从实例元数据中检索标签](work-with-tags-in-IMDS.md#retrieve-tags-from-IMDS)。

## IMDSv1 的示例
<a name="instance-metadata-retrieval-examples-imdsv1"></a>

在您的 Amazon EC2 实例上运行以下示例，以检索 IMDSv1 的实例元数据。

在 Windows 实例上，您可以使用 Windows PowerShell，也可以安装 cURL 或 wget。如果您在 Windows 实例上安装第三方工具，请确保您仔细阅读随附的文档，因为调用和输出格式可能与此处所述的内容不同。

**Topics**
+ [获取实例元数据的可用版本](#instance-metadata-ex-1-imdsv1)
+ [获取顶级元数据项](#instance-metadata-ex-2-imdsv1)
+ [获取元数据项的值](#instance-metadata-ex-2a-imdsv1)
+ [获取可用的公有密钥列表](#instance-metadata-ex-3-imdsv1)
+ [显示可以使用公有密钥 0 的格式](#instance-metadata-ex-4-imdsv1)
+ [获取公有密钥 0（采用 OpenSSH 密钥格式）](#instance-metadata-ex-5-imdsv1)
+ [获取实例的子网 ID](#instance-metadata-ex-6-imdsv1)
+ [获取实例的实例标签](#instance-metadata-ex-7-imdsv1)

### 获取实例元数据的可用版本
<a name="instance-metadata-ex-1-imdsv1"></a>

此示例可以获取实例元数据的可用版本。当有新的实例元数据类别发布时，每个版本都引用一个实例元数据构建。实例元数据构建版本与 Amazon EC2 API 版本不相关。如果您有依赖于以前版本中所存在的结构和信息的脚本，则您可使用早期版本。

------
#### [ cURL ]

```
[ec2-user ~]$ curl http://169.254.169.254/
1.0
2007-01-19
2007-03-01
2007-08-29
2007-10-10
2007-12-15
2008-02-01
2008-09-01
2009-04-04
2011-01-01
2011-05-01
2012-01-12
2014-02-25
2014-11-05
2015-10-20
2016-04-19
...
latest
```

------
#### [ PowerShell ]

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/
1.0
2007-01-19
2007-03-01
2007-08-29
2007-10-10
2007-12-15
2008-02-01
2008-09-01
2009-04-04
2011-01-01
2011-05-01
2012-01-12
2014-02-25
2014-11-05
2015-10-20
2016-04-19
...
latest
```

------

### 获取顶级元数据项
<a name="instance-metadata-ex-2-imdsv1"></a>

此示例获得顶级元数据项目。有关响应中项目的更多信息，请参阅 [实例元数据类别](ec2-instance-metadata.md#instancedata-data-categories)。

请注意，只有在允许您访问的情况下，标签才会包含在此输出中。有关更多信息，请参阅 [启用对实例元数据中标签的访问权限](work-with-tags-in-IMDS.md#allow-access-to-tags-in-IMDS)。

------
#### [ cURL ]

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/    
ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/
events/
hostname
iam/
instance-action
instance-id
instance-type
local-hostname
local-ipv4
mac
metrics/
network/
placement/
profile
public-hostname
public-ipv4
public-keys/
reservation-id
security-groups
services/
tags/
```

------
#### [ PowerShell ]

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/    
ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/
hostname
iam/
instance-action
instance-id
instance-type
local-hostname
local-ipv4
mac
metrics/
network/
placement/
profile
public-hostname
public-ipv4
public-keys/
reservation-id
security-groups
services/
tags/
```

------

### 获取元数据项的值
<a name="instance-metadata-ex-2a-imdsv1"></a>

这些示例获取在先前示例中获取的某些顶级元数据项的值。

------
#### [ cURL ]

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/ami-id
ami-0abcdef1234567890
```

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/reservation-id
r-0efghijk987654321
```

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/local-hostname
ip-10-251-50-12.ec2.internal
```

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/public-hostname
ec2-203-0-113-25.compute-1.amazonaws.com
```

------
#### [ PowerShell ]

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/ami-id
ami-0abcdef1234567890
```

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/reservation-id
r-0efghijk987654321
```

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/local-hostname
ip-10-251-50-12.ec2.internal
```

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/public-hostname
ec2-203-0-113-25.compute-1.amazonaws.com
```

------

### 获取可用的公有密钥列表
<a name="instance-metadata-ex-3-imdsv1"></a>

此示例获得可用公有密钥的列表。

------
#### [ cURL ]

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/public-keys/
0=my-public-key
```

------
#### [ PowerShell ]

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/public-keys/ 0=my-public-key
```

------

### 显示可以使用公有密钥 0 的格式
<a name="instance-metadata-ex-4-imdsv1"></a>

此示例显示了可以使用公有密钥 0 的格式。

------
#### [ cURL ]

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/public-keys/0/
openssh-key
```

------
#### [ PowerShell ]

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key
openssh-key
```

------

### 获取公有密钥 0（采用 OpenSSH 密钥格式）
<a name="instance-metadata-ex-5-imdsv1"></a>

此示例获得公有密钥 0 (以 OpenSSH 密钥格式)。

------
#### [ cURL ]

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key
ssh-rsa MIICiTCCAfICCQD6m7oRw0uXOjANBgkqhkiG9w0BAQUFADCBiDELMAkGA1UEBhMC
VVMxCzAJBgNVBAgTAldBMRAwDgYDVQQHEwdTZWF0dGxlMQ8wDQYDVQQKEwZBbWF6
b24xFDASBgNVBAsTC0lBTSBDb25zb2xlMRIwEAYDVQQDEwlUZXN0Q2lsYWMxHzAd
BgkqhkiG9w0BCQEWEG5vb25lQGFtYXpvbi5jb20wHhcNMTEwNDI1MjA0NTIxWhcN
MTIwNDI0MjA0NTIxWjCBiDELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYD
VQQHEwdTZWF0dGxlMQ8wDQYDVQQKEwZBbWF6b24xFDASBgNVBAsTC0lBTSBDb25z
b2xlMRIwEAYDVQQDEwlUZXN0Q2lsYWMxHzAdBgkqhkiG9w0BCQEWEG5vb25lQGFt
YXpvbi5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMaK0dn+a4GmWIWJ
21uUSfwfEvySWtC2XADZ4nB+BLYgVIk60CpiwsZ3G93vUEIO3IyNoH/f0wYK8m9T
rDHudUZg3qX4waLG5M43q7Wgc/MbQITxOUSQv7c7ugFFDzQGBzZswY6786m86gpE
Ibb3OhjZnzcvQAaRHhdlQWIMm2nrAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAtCu4
nUhVVxYUntneD9+h8Mg9q6q+auNKyExzyLwaxlAoo7TJHidbtS4J5iNmZgXL0Fkb
FFBjvSfpJIlJ00zbhNYS5f6GuoEDmFJl0ZxBHjJnyp378OD8uTs7fLvjx79LjSTb
NYiytVbZPQUQ5Yaxu2jXnimvw3rrszlaEXAMPLE my-public-key
```

------
#### [ PowerShell ]

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key
ssh-rsa MIICiTCCAfICCQD6m7oRw0uXOjANBgkqhkiG9w0BAQUFADCBiDELMAkGA1UEBhMC
VVMxCzAJBgNVBAgTAldBMRAwDgYDVQQHEwdTZWF0dGxlMQ8wDQYDVQQKEwZBbWF6
b24xFDASBgNVBAsTC0lBTSBDb25zb2xlMRIwEAYDVQQDEwlUZXN0Q2lsYWMxHzAd
BgkqhkiG9w0BCQEWEG5vb25lQGFtYXpvbi5jb20wHhcNMTEwNDI1MjA0NTIxWhcN
MTIwNDI0MjA0NTIxWjCBiDELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYD
VQQHEwdTZWF0dGxlMQ8wDQYDVQQKEwZBbWF6b24xFDASBgNVBAsTC0lBTSBDb25z
b2xlMRIwEAYDVQQDEwlUZXN0Q2lsYWMxHzAdBgkqhkiG9w0BCQEWEG5vb25lQGFt
YXpvbi5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMaK0dn+a4GmWIWJ
21uUSfwfEvySWtC2XADZ4nB+BLYgVIk60CpiwsZ3G93vUEIO3IyNoH/f0wYK8m9T
rDHudUZg3qX4waLG5M43q7Wgc/MbQITxOUSQv7c7ugFFDzQGBzZswY6786m86gpE
Ibb3OhjZnzcvQAaRHhdlQWIMm2nrAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAtCu4
nUhVVxYUntneD9+h8Mg9q6q+auNKyExzyLwaxlAoo7TJHidbtS4J5iNmZgXL0Fkb
FFBjvSfpJIlJ00zbhNYS5f6GuoEDmFJl0ZxBHjJnyp378OD8uTs7fLvjx79LjSTb
NYiytVbZPQUQ5Yaxu2jXnimvw3rrszlaEXAMPLE my-public-key
```

------

### 获取实例的子网 ID
<a name="instance-metadata-ex-6-imdsv1"></a>

此示例获取实例的子网 ID。

------
#### [ cURL ]

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/network/interfaces/macs/02:29:96:8f:6a:2d/subnet-id
subnet-be9b61d7
```

------
#### [ PowerShell ]

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/network/interfaces/macs/02:29:96:8f:6a:2d/subnet-id
subnet-be9b61d7
```

------

### 获取实例的实例标签
<a name="instance-metadata-ex-7-imdsv1"></a>

如果对实例元数据中的实例标签的访问权限已开启，则可以从实例元数据中获得实例标签。有关更多信息，请参阅 [从实例元数据中检索标签](work-with-tags-in-IMDS.md#retrieve-tags-from-IMDS)。
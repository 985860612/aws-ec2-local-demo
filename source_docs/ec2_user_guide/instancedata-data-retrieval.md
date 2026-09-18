

# 访问 EC2 实例的实例元数据
<a name="instancedata-data-retrieval"></a>

您可以从实例内或者从 EC2 控制台、API、SDK 或 AWS CLI 访问 EC2 实例元数据。要从控制台或命令行获取实例的当前实例元数据设置，请参阅[查询现有实例的实例元数据选项](#query-IMDS-existing-instances)。

您还可以修改具有 EBS 根卷的实例的用户数据。该实例必须处于已停止状态。有关控制台说明，请参阅 。[更新实例用户数据](user-data.md#user-data-modify)有关使用 AWS CLI 的 Linux 示例，请参阅 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html)。有关使用 Tools for Windows PowerShell 的 Windows 示例，请参阅 [用户数据和 Tools for Windows PowerShell](user-data.md#user-data-powershell)。

**注意**  
您无需为用于检索实例元数据和用户数据的 HTTP 请求付费。

## 实例元数据访问注意事项
<a name="imds-considerations"></a>

为避免实例元数据问题，请注意以下因素。

**因 IMDSv2 强制使用 (`HttpTokensEnforced=enabled`) 导致实例启动失败**  
在启用 IMDSv2 强制使用之前，首先需要确保实例上的所有软件都支持 IMDSv2，然后才能将默认设置更改为禁用 IMDSv1 (`httpTokens=required`)，再后才可以启用强制使用。有关更多信息，请参阅 [转换为使用 实例元数据服务版本 2](instance-metadata-transition-to-version-2.md)。

**命令格式**  
根据使用的是实例元数据服务版本 1 (IMDSv1) 还是实例元数据服务版本 2 (IMDSv2)，命令格式会有所不同。默认情况下，您可以使用两个版本的实例元数据服务。要要求使用 IMDSv2，请参阅[使用实例元数据服务访问实例元数据](configuring-instance-metadata-service.md)。

**如果需要 IMDSv2，则 IMDSv1 不起作用**  
如果使用 IMDSv1 后未收到任何响应，则很可能需要 IMDSv2。要检查是否需要 IMDSv2，请选择实例以查看其详细信息。**IMDSv2** 值要么表示**必选**（即必须使用 IMDSv2），要么表示**可选**（即可以使用 IMDSv2 或 IMDSv1）。

**（IMDSv2）使用 /latest/api/token 来检索令牌**  
将 `PUT` 请求发放到任何版本特定的路径（例如 `/2021-03-23/api/token`）将导致元数据服务返回 403 禁止错误。这是预期行为。

**元数据版本**  
为避免每次 Amazon EC2 发布新的实例元数据构建时都必须更新您的代码，我们建议您在路径中使用 `latest`，而不是版本号。

**IPv6 支持**  
要使用 IPv6 地址检索实例元数据，必须确保启用并使用 IPv6 地址 IMDS `[fd00:ec2::254]` 而不是 IPv4 地址 `169.254.169.254`。该实例必须是在[支持 IPv6 的子网](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html#subnet-ip-address-range)中启动的[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。

**（Windows）使用 Windows Sysprep 创建自定义 AMI**  
为了确保在您从自定义 Windows AMI 启动实例时 IMDS 能够正常工作，AMI 必须是使用 Windows Sysprep 创建的标准化映像。否则，IMDS 将无法正常运行。有关更多信息，请参阅 [使用 Windows Sysprep 创建 Amazon EC2 AMI](ami-create-win-sysprep.md)。

**在容器环境中，考虑重新配置或将跃点限制增加到 2**  
默认情况下，AWS开发工具包使用 IMDSv2 调用。如果 IMDSv2 调用没有收到任何响应，某些 AWS SDK 将重试调用，如果仍然不成功，则使用 IMDSv1。这可能会导致延迟，尤其是在容器环境中。对于那些*需要* IMDSv2 的 AWS SDK，如果容器环境中的跃点限制为 1，则调用可能根本收不到响应，因为转到容器被视为额外的网络跃点。  
要缓解容器环境中的这些问题，请考虑更改配置以将设置（例如 AWS 区域）直接传递到容器，或者考虑将跃点限制增加到 2。有关跃点限制影响的信息，请参阅 [Add defense in depth against open firewalls, reverse proxies, and SSRF vulnerabilities with enhancements to the EC2 Instance Metadata Service](https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/)。有关更改跃点限制的信息，请参阅[更改 PUT 响应跃点限制](configuring-IMDS-existing-instances.md#modify-PUT-response-hop-limit)。

**每秒数据包（PPS）限制**  
对于使用[本地链路](using-instance-addressing.md#link-local-addresses)地址的服务，每秒数据包数（PPS）限制为 1024 个。此限制是 [Route 53 Resolver DNS 查询](https://docs.aws.amazon.com/vpc/latest/userguide/AmazonDNS-concepts.html#vpc-dns-limits)、实例元数据服务（IMDS）请求、[Amazon Time Service 网络时间协议（NTP）](set-time.md)请求和 [Windows 许可服务（适用于基于 Microsoft Windows 的实例](https://aws.amazon.com/windows/resources/licensing/)）请求的总和。

**用户数据访问的其他注意事项**
+ 用户数据会被视为非透明数据；您指定什么数据就会在检索时得到什么数据。由实例来解释用户数据并对其进行操作。
+ 用户数据必须采用 base64 编码。根据您使用的工具或 SDK，可能会为您执行 base64 编码。例如：
  + Amazon EC2 控制台可以为您执行 base64 编码或接受 base64 编码的输入。
  + 默认情况下，[AWS CLI 版本 2](https://docs.aws.amazon.com/cli/latest/userguide/cliv2-migration-changes.html#cliv2-migration-binaryparam) 会为您执行二进制参数的 base64 编码。AWS CLI 版本 1 会为您执行 `--user-data` 参数的 base64 编码。
  + 适用于 Python (Boto3) 的 AWS SDK 会为您执行 `UserData` 参数的 base64 编码。
+ 用户数据在进行 base64 编码之前的原始格式的大小限制为 16 KB。长度为 *n* 的字符串在进行 base64 编码之后的大小为 ceil(*n*/3)\*4。
+ 在检索用户数据时，必须对其进行 base64 解码。如果您使用实例元数据或控制台检索数据，则会自动对数据进行解码。
+ 如果您停止实例，修改用户数据，然后启动实例，则在启动实例时，不会自动运行更新后的用户数据。对于 Windows 实例，您可以配置设置，这样更新后的用户数据脚本在您启动实例时运行一次，或者在每次重启或启动实例时运行。
+ 用户数据是一种实例属性。如果您从实例创建 AMI，则实例用户数据不包含在该 AMI 中。

## 从 EC2 实例内访问实例元数据
<a name="instancedata-inside-access"></a>

由于您的正在运行的实例存在实例元数据，因此您无需使用 Amazon EC2 控制台或 AWS CLI。这在您编写脚本以实现从实例运行时非常有用。例如，您可从实例元数据访问您的实例的本地 IP 地址来以管理与外部应用程序的连接。

以下所有内容均被视为实例元数据，但其访问方式不同。选择代表您要访问的实例元数据类型的选项卡，以查看更多信息。

------
#### [ Metadata ]

实例元数据属性分为几类。有关每个实例元数据类别的描述，请参阅[实例元数据类别](ec2-instance-metadata.md#instancedata-data-categories)。

要访问正在运行的实例内的实例元数据属性，请从以下 IPv4 或 IPv6 URI 获取数据。这些 IP 地址是链路本地地址，仅从该实例访问时有效。有关更多信息，请参阅 [链路本地地址](using-instance-addressing.md#link-local-addresses)。

**IPv4**

```
http://169.254.169.254/latest/meta-data/
```

**IPv6**

```
http://[fd00:ec2::254]/latest/meta-data/
```

------
#### [ Dynamic data ]

要从正在运行的实例中检索动态数据，请使用以下 URI 之一。

**IPv4**

```
http://169.254.169.254/latest/dynamic/
```

**IPv6**

```
http://[fd00:ec2::254]/latest/dynamic/
```

**示例：使用 cURL 访问**  
以下示例使用 `cURL` 检索高级实例身份类别。

*IMDSv2*

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/dynamic/instance-identity/
rsa2048
pkcs7
document
signature
dsa2048
```

*IMDSv1*

```
[ec2-user ~]$ curl http://169.254.169.254/latest/dynamic/instance-identity/
rsa2048
pkcs7
document
signature
dsa2048
```

**示例：使用 PowerShell 访问**  
以下示例使用 PowerShell 检索高级实例身份类别。

*IMDSv2*

```
PS C:\> [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
PS C:\> Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/dynamic/instance-identity/
document
rsa2048
pkcs7
signature
```

*IMDSv1*

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/dynamic/instance-identity/
document
rsa2048
pkcs7
signature
```

有关动态数据的详细信息和如何对其进行检索的示例，请参阅 [Amazon EC2 实例的实例身份文档](instance-identity-documents.md)。

------
#### [ User data ]

要从实例中检索用户数据，请使用以下 URI 之一。要使用 IPv6 地址检索用户数据，必须将启用该功能，并且实例必须是在支持 IPv6 的子网中的[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。

**IPv4**

```
http://169.254.169.254/latest/user-data
```

**IPv6**

```
http://[fd00:ec2::254]/latest/user-data
```

请求用户数据时，按原样返回数据 (内容类型 `application/octet-stream`)。如果该实例没有任何用户数据，则请求将返回 `404 - Not Found`。

**示例：使用 cURL 访问以检索逗号分隔的文本**  
以下示例使用 `cURL` 检索以逗号分隔文本形式指定的用户数据。

*IMDSv2*

```
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/user-data
1234,john,reboot,true | 4512,richard, | 173,,,
```

*IMDSv1*

```
curl http://169.254.169.254/latest/user-data
1234,john,reboot,true | 4512,richard, | 173,,,
```

**示例：使用 PowerShell 访问以检索逗号分隔的文本**  
以下示例使用 PowerShell 检索以逗号分隔文本形式指定的用户数据。

*IMDSv2*

```
[string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/user-data
1234,john,reboot,true | 4512,richard, | 173,,,
```

*IMDSv1*

```
Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} `
-Method PUT -Uri http://169.254.169.254/latest/api/token} -Method GET -uri http://169.254.169.254/latest/user-data
1234,john,reboot,true | 4512,richard, | 173,,,
```

**示例：使用 cURL 访问以检索脚本**  
以下示例使用 `cURL` 检索指定为脚本的用户数据。

*IMDSv2*

```
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/user-data
#!/bin/bash
yum update -y
service httpd start
chkconfig httpd on
```

*IMDSv1*

```
curl http://169.254.169.254/latest/user-data
#!/bin/bash
yum update -y
service httpd start
chkconfig httpd on
```

**示例：使用 PowerShell 访问以检索脚本**  
以下示例使用 PowerShell 检索指定为脚本的用户数据。

*IMDSv2*

```
[string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} -Method PUT -Uri http://169.254.169.254/latest/api/token
```

```
Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} -Method GET -Uri http://169.254.169.254/latest/user-data
<powershell>
$file = $env:SystemRoot + "\Temp\" + (Get-Date).ToString("MM-dd-yy-hh-mm")
New-Item $file -ItemType file
</powershell>
<persist>true</persist>
```

*IMDSv1*

```
Invoke-RestMethod -uri http://169.254.169.254/latest/user-data
<powershell>
$file = $env:SystemRoot + "\Temp\" + (Get-Date).ToString("MM-dd-yy-hh-mm")
New-Item $file -ItemType file
</powershell>
<persist>true</persist>
```

------

## 查询现有实例的实例元数据选项
<a name="query-IMDS-existing-instances"></a>

您可以查询现有实例的实例元数据选项。

------
#### [ Console ]

**查询现有实例的实例元数据选项**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择您的实例并选中以下字段：
   + **IMDSv2**：该值为**必填**或**可选**。
   + **允许在实例元数据中使用标签**：该值为**已启用**或**已禁用**。

1. 选择实例后，依次选择**操作**、**实例设置**、**修改实例元数据选项**。

   该对话框显示所选实例的实例元数据服务是处于已启用状态还是已禁用状态。

------
#### [ AWS CLI ]

**查询现有实例的实例元数据选项**  
可以使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances \
    --instance-id {{i-1234567898abcdef0}} \
    --query 'Reservations[].Instances[].MetadataOptions'
```

------
#### [ PowerShell ]

**使用 Tools for PowerShell 查询现有实例的实例元数据选项**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance `
    -InstanceId {{i-1234567898abcdef0}}).Instances.MetadataOptions
```

------

## 响应和错误消息
<a name="instance-metadata-returns"></a>

所有实例元数据以文本形式返回（HTTP 内容类型 `text/plain`）。

特定元数据资源的请求返回相应的值；如果资源不可用，则返回 HTTP 错误代码 `404 - Not Found`。

对通用元数据资源的请求 (以 / 结尾的 URI) 会返回一个可用资源列表，如果此类资源不存在，则会返回 HTTP 错误代码 `404 - Not Found`。列表中的各个项目位于被换行符 (ASCII 10) 终止的不同的行上。

如果 IMDSv1 请求没有收到响应，则很可能需要 IMDSv2。

对于使用 IMDSv2 发出的请求，可能会返回以下 HTTP 错误代码：
+ `400 - Missing or Invalid Parameters` – `PUT` 请求无效。
+ `401 - Unauthorized` – `GET` 请求使用无效的令牌。建议的措施是生成新的令牌。
+ `403 - Forbidden` – 该请求不被允许，或者 IMDS 已关闭。
+ `404 - Not Found` – 资源不可用或没有此类资源。
+ `503` – 无法完成请求。重试请求。

如果 IMDS 返回错误，**curl** 会在输出中打印错误消息并返回成功状态代码。错误消息存储在 `TOKEN` 变量中，这会导致使用该令牌的 **curl** 命令失败。如果使用 **-f** 选项调用 **curl**，则会在出现 HTTP 服务器错误时返回错误状态代码。如果启用错误处理功能，Shell 可以捕获错误并停止脚本。

## 查询限制
<a name="instancedata-throttling"></a>

我们基于每个实例来限制对 IMDS 的查询，并且对从实例到 IMDS 的同时连接数进行限制。

如果您使用 IMDS 检索 AWS 安全凭证，请避免在每个事务期间查询凭证或从大量线程或进程中并发查询凭证，因为这可能会导致节流。相反，我们建议您缓存凭证，直到凭证开始接近其到期时间。有关 IAM 角色以及与其关联的安全凭证的更多信息，请参阅 [从实例元数据中检索安全凭证](instance-metadata-security-credentials.md)。

如果在访问 IMDS 时受到限制，请使用指数回退策略重试查询。
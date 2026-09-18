

# 验证 Amazon EC2 实例的实例身份文档
<a name="verify-iid"></a>

如果您打算将实例身份文档的内容用于重要用途，则应在使用前验证其内容和真实性。

明文实例身份文档附有三个经哈希处理的加密签名。您可以使用这些签名验证实例身份文档的来源和真实性以及其中包含的信息。其中提供以下签名：
+ Base64 编码的签名 — 这是实例身份文档的 Base64 编码 SHA256 哈希值，使用 RSA 密钥对进行加密。
+ PKCS7 签名 — 这是实例身份文档的 SHA1 哈希值，使用 DSA 密钥对进行加密。
+ RSA-2048 签名 — 这是实例身份文档的 SHA256 哈希值，使用 RSA-2048 密钥对进行加密。

每个签名在实例元数据中的不同端点上可用。您可以根据哈希和加密要求使用这些签名中的任何一个。要验证签名，您必须使用对应的 AWS 公有证书。

**Contents**
+ [选项 1：使用 PKCS7 签名验证实例身份文档](#verify-pkcs7)
+ [选项 2：使用 base64 编码的签名验证实例身份文档](#verify-signature)
+ [选项 3：使用 RSA-2048 签名验证实例身份文档](#verify-rsa2048)

## 选项 1：使用 PKCS7 签名验证实例身份文档
<a name="verify-pkcs7"></a>

本主题说明如何使用 PKCS7 签名和 AWS DSA 公有证书验证实例身份文档。

### Linux 实例
<a name="verify-pkcs7-linux"></a>

**使用 PKCS7 签名和 AWS DSA 公有证书验证实例身份文档**

1. 连接到实例。

1. 从实例元数据中检索 PKCS7 签名，并将其连同所需的页眉和页脚添加到名为 `pkcs7` 的新文件。根据实例使用的 IMDS 版本，使用以下命令之一。

------
#### [ IMDSv2 ]

   ```
   $ echo "-----BEGIN PKCS7-----" >> {{pkcs7}} \
   	&& TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
   	&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/dynamic/instance-identity/pkcs7 >> {{pkcs7}} \
   	&& echo "" >> {{pkcs7}} \
   	&& echo "-----END PKCS7-----" >> {{pkcs7}}
   ```

------
#### [ IMDSv1 ]

   ```
   $ echo "-----BEGIN PKCS7-----" >> {{pkcs7}} \
   	&& curl -s http://169.254.169.254/latest/dynamic/instance-identity/pkcs7 >> {{pkcs7}} \
   	&& echo "" >> {{pkcs7}} \
   	&& echo "-----END PKCS7-----" >> {{pkcs7}}
   ```

------

1. 在 [AWS实例身份文档签名的 公有证书](regions-certs.md) 中找到您所在区域的 **DSA** 公有证书，并将内容添加到名为 `certificate` 的新文件。

1. 使用 **OpenSSL smime** 命令来验证签名。包括 `-verify` 选项以指示需要验证签名，而包括 `-noverify` 选项则指示不需要验证证书。

   ```
   $ openssl smime -verify -in {{pkcs7}} -inform PEM -certfile {{certificate}} -noverify | tee document
   ```

   如果签名有效，则会显示 `Verification successful` 消息。

   此命令还会将实例身份文档的内容写入一个名为 `document` 的新文件。您可以使用以下命令将来自实例元数据的实例身份文档内容与此文件的内容进行比较。

   ```
   $ openssl dgst -sha256 < {{document}}
   ```

   ```
   $ curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/dynamic/instance-identity/document | openssl dgst -sha256
   ```

    如果无法验证签名，请联系 支持。

### Windows 实例
<a name="verify-pkcs7-windows"></a>

**先决条件**  
此过程需要 `System.Security` Microsoft .NET Core 类。要将该类添加到 PowerShell 会话中，请运行以下命令。

```
PS C:\> Add-Type -AssemblyName System.Security
```

**注意**  
此命令仅将该类添加到当前 PowerShell 会话。如果您启动新会话，则必须再次运行该命令。

**使用 PKCS7 签名和 AWS DSA 公有证书验证实例身份文档**

1. 连接到实例。

1. 从实例元数据中检索 PKCS7 签名，将其转换为字节数组并添加到名为 `$Signature` 的变量。根据实例使用的 IMDS 版本，使用以下命令之一。

------
#### [ IMDSv2 ]

   ```
   PS C:\> [string]$token = (Invoke-WebRequest -Method Put -Headers @{'X-aws-ec2-metadata-token-ttl-seconds' = '21600'} -Uri http://169.254.169.254/latest/api/token).Content
   ```

   ```
   PS C:\> {{$Signature}} = [Convert]::FromBase64String((Invoke-WebRequest -Headers @{'X-aws-ec2-metadata-token' = $Token} -Uri http://169.254.169.254/latest/dynamic/instance-identity/pkcs7).Content)
   ```

------
#### [ IMDSv1 ]

   ```
   PS C:\> {{$Signature}} = [Convert]::FromBase64String((Invoke-WebRequest -Uri http://169.254.169.254/latest/dynamic/instance-identity/pkcs7).Content)
   ```

------

1. 从实例元数据中检索纯文本实例身份文档，将其转换为字节数组并添加到名为 `$Document` 的变量。根据实例使用的 IMDS 版本，使用以下命令之一。

------
#### [ IMDSv2 ]

   ```
   PS C:\> {{$Document }}= [Text.Encoding]::UTF8.GetBytes((Invoke-WebRequest -Headers @{'X-aws-ec2-metadata-token' = $Token} -Uri http://169.254.169.254/latest/dynamic/instance-identity/document).Content)
   ```

------
#### [ IMDSv1 ]

   ```
   PS C:\> {{$Document}} =  [Text.Encoding]::UTF8.GetBytes((Invoke-WebRequest http://169.254.169.254/latest/dynamic/instance-identity/document).Content)
   ```

------

1. 在 [AWS实例身份文档签名的 公有证书](regions-certs.md) 中找到您所在区域的 **DSA** 公有证书，并将内容添加到名为 `certificate.pem` 的新文件。

1. 从证书文件中提取证书并将其存储在名为 `$Store` 的变量中。

   ```
   PS C:\> {{$Store}} = [Security.Cryptography.X509Certificates.X509Certificate2Collection]::new([Security.Cryptography.X509Certificates.X509Certificate2]::new((Resolve-Path {{certificate.pem}})))
   ```

1. 验证签名。

   ```
   PS C:\> {{$SignatureDocument}} = [Security.Cryptography.Pkcs.SignedCms]::new()
   ```

   ```
   PS C:\> {{$SignatureDocument}}.Decode({{$Signature}})
   ```

   ```
   PS C:\> {{$SignatureDocument}}.CheckSignature({{$Store}}, $true)
   ```

   如果签名有效，则命令不返回任何输出。如果无法验证签名，则命令返回 `Exception calling "CheckSignature" with "2" argument(s): "Cannot find the original signer`。如果无法验证您的签名，请联系 AWS 支持。

1. 验证实例身份文档的内容。

   ```
   PS C:\> [Linq.Enumerable]::SequenceEqual(${{SignatureDocument}}.ContentInfo.Content, {{$Document}})
   ```

   如果实例身份文档的内容有效，则命令返回 `True`。如果无法验证实例身份文档，请联系 AWS 支持。

## 选项 2：使用 base64 编码的签名验证实例身份文档
<a name="verify-signature"></a>

本主题说明如何使用 base64 编码的签名和 AWS RSA 公有证书验证实例身份文档。

### Linux 实例
<a name="verify-signature-linux"></a>

**使用 base64 编码的签名和 AWS RSA 公有证书验证实例身份文档**

1. 连接到实例。

1. 从实例元数据中检索 base64 编码的签名，将其转换为二进制文件，然后将其添加到名为 `signature` 的文件。根据实例使用的 IMDS 版本，使用以下命令之一。

------
#### [ IMDSv2 ]

   ```
   $ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
   	&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/dynamic/instance-identity/signature | base64 -d >> {{signature}}
   ```

------
#### [ IMDSv1 ]

   ```
   $ curl -s http://169.254.169.254/latest/dynamic/instance-identity/signature | base64 -d >> {{signature}}
   ```

------

1. 从实例元数据中检索明文 实例身份文档，并将其添加到名为 `document` 的文件。根据实例使用的 IMDS 版本，使用以下命令之一。

------
#### [ IMDSv2 ]

   ```
   $ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
   	&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/dynamic/instance-identity/document >> {{document}}
   ```

------
#### [ IMDSv1 ]

   ```
   $ curl -s http://169.254.169.254/latest/dynamic/instance-identity/document >> {{document}}
   ```

------

1. 在 [AWS实例身份文档签名的 公有证书](regions-certs.md) 中找到您所在区域的 **RSA** 公有证书，并将内容添加到名为 `certificate` 的新文件。

1. 从 AWS RSA 公有证书中提取公有密钥，并将其保存到名为 `key` 的文件。

   ```
   $ openssl x509 -pubkey -noout -in {{certificate}} >> {{key}}
   ```

1. 使用 **OpenSSL dgst** 命令来验证实例身份文档。

   ```
   $ openssl dgst -sha256 -verify {{key}} -signature {{signature}} {{document}}
   ```

   如果签名有效，则会显示 `Verification successful` 消息。

   此命令还会将实例身份文档的内容写入一个名为 `document` 的新文件。您可以使用以下命令将来自实例元数据的实例身份文档内容与此文件的内容进行比较。

   ```
   $ openssl dgst -sha256 < {{document}}
   ```

   ```
   $ curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/dynamic/instance-identity/document | openssl dgst -sha256
   ```

    如果无法验证签名，请联系 支持。

### Windows 实例
<a name="verify-signature-windows"></a>

**使用 base64 编码的签名和 AWS RSA 公有证书验证实例身份文档**

1. 连接到实例。

1. 从实例元数据中检索 base64 编码的签名，将其转换为字节数组并添加到名为 `$Signature` 的变量。根据实例使用的 IMDS 版本，使用以下命令之一。

------
#### [ IMDSv2 ]

   ```
   PS C:\> [string]$token = (Invoke-WebRequest -Method Put -Headers @{'X-aws-ec2-metadata-token-ttl-seconds' = '21600'} http://169.254.169.254/latest/api/token).Content
   ```

   ```
   PS C:\> {{$Signature}} = [Convert]::FromBase64String((Invoke-WebRequest -Headers @{'X-aws-ec2-metadata-token' = $Token} http://169.254.169.254/latest/dynamic/instance-identity/signature).Content)
   ```

------
#### [ IMDSv1 ]

   ```
   PS C:\> {{$Signature}} = [Convert]::FromBase64String((Invoke-WebRequest http://169.254.169.254/latest/dynamic/instance-identity/signature).Content)
   ```

------

1. 从实例元数据中检索纯文本实例身份文档，将其转换为字节数组并添加到名为 `$Document` 的变量。根据实例使用的 IMDS 版本，使用以下命令之一。

------
#### [ IMDSv2 ]

   ```
   PS C:\> {{$Document }}= [Text.Encoding]::UTF8.GetBytes((Invoke-WebRequest -Headers @{'X-aws-ec2-metadata-token' = $Token} http://169.254.169.254/latest/dynamic/instance-identity/document).Content)
   ```

------
#### [ IMDSv1 ]

   ```
   PS C:\> {{$Document}} =  [Text.Encoding]::UTF8.GetBytes((Invoke-WebRequest http://169.254.169.254/latest/dynamic/instance-identity/document).Content)
   ```

------

1. 在 [AWS实例身份文档签名的 公有证书](regions-certs.md) 中找到您所在区域的 **RSA** 公有证书，并将内容添加到名为 `certificate.pem` 的新文件。

1. 验证实例身份文档。

   ```
   PS C:\> [Security.Cryptography.X509Certificates.X509Certificate2]::new((Resolve-Path {{certificate.pem}})).PublicKey.Key.VerifyData({{$Document}}, 'SHA256', {{$Signature}})
   ```

   如果签名有效，则命令返回 `True`。如果无法验证签名，请联系 支持。

## 选项 3：使用 RSA-2048 签名验证实例身份文档
<a name="verify-rsa2048"></a>

本主题说明如何使用 RSA-2048 签名和 AWS RSA-2048 公有证书验证实例身份文档。

### Linux 实例
<a name="verify-rsa2048-linux"></a>

**使用 RSA-2048 签名和 AWS RSA-2048 公有证书验证实例身份文档。**

1. 连接到实例。

1. 从实例元数据中检索 RSA-2048 签名，并将其连同所需的页眉和页脚添加到名为 `rsa2048` 的文件。根据实例使用的 IMDS 版本，使用以下命令之一。

------
#### [ IMDSv2 ]

   ```
   $ echo "-----BEGIN PKCS7-----" >> {{rsa2048}} \
   	&& TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
   	&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/dynamic/instance-identity/rsa2048 >> {{rsa2048}} \
   	&& echo "" >> {{rsa2048}} \
   	&& echo "-----END PKCS7-----" >> {{rsa2048}}
   ```

------
#### [ IMDSv1 ]

   ```
   $ echo "-----BEGIN PKCS7-----" >> {{rsa2048}} \
   	&& curl -s http://169.254.169.254/latest/dynamic/instance-identity/rsa2048 >> {{rsa2048}} \
   	&& echo "" >> {{rsa2048}} \
   	&& echo "-----END PKCS7-----" >> {{rsa2048}}
   ```

------

1. 在 [AWS实例身份文档签名的 公有证书](regions-certs.md) 中找到您所在区域的 **RSA-2048** 公有证书，并将内容添加到名为 `certificate` 的新文件。

1. 使用 **OpenSSL smime** 命令来验证签名。包括 `-verify` 选项以指示需要验证签名，而包括 `-noverify` 选项则指示不需要验证证书。

   ```
   $ openssl smime -verify -in {{rsa2048}} -inform PEM -certfile {{certificate}} -noverify | tee document
   ```

   如果签名有效，则会显示 `Verification successful` 消息。如果无法验证签名，请联系 支持。

### Windows 实例
<a name="verify-rsa2048-windows"></a>

**先决条件**  
此过程需要 `System.Security` Microsoft .NET Core 类。要将该类添加到 PowerShell 会话中，请运行以下命令。

```
PS C:\> Add-Type -AssemblyName System.Security
```

**注意**  
此命令仅将该类添加到当前 PowerShell 会话。如果您启动新会话，则必须再次运行该命令。

**使用 RSA-2048 签名和 AWS RSA-2048 公有证书验证实例身份文档。**

1. 连接到实例。

1. 从实例元数据中检索 RSA-2048 签名，将其转换为字节数组并添加到名为 `$Signature` 的变量。根据实例使用的 IMDS 版本，使用以下命令之一。

------
#### [ IMDSv2 ]

   ```
   PS C:\> [string]$token = (Invoke-WebRequest -Method Put -Headers @{'X-aws-ec2-metadata-token-ttl-seconds' = '21600'} http://169.254.169.254/latest/api/token).Content
   ```

   ```
   PS C:\> {{$Signature}} = [Convert]::FromBase64String((Invoke-WebRequest -Headers @{'X-aws-ec2-metadata-token' = $Token} http://169.254.169.254/latest/dynamic/instance-identity/rsa2048).Content)
   ```

------
#### [ IMDSv1 ]

   ```
   PS C:\> {{$Signature}} = [Convert]::FromBase64String((Invoke-WebRequest http://169.254.169.254/latest/dynamic/instance-identity/rsa2048).Content)
   ```

------

1. 从实例元数据中检索纯文本实例身份文档，将其转换为字节数组并添加到名为 `$Document` 的变量。根据实例使用的 IMDS 版本，使用以下命令之一。

------
#### [ IMDSv2 ]

   ```
   PS C:\> {{$Document }}= [Text.Encoding]::UTF8.GetBytes((Invoke-WebRequest -Headers @{'X-aws-ec2-metadata-token' = $Token} http://169.254.169.254/latest/dynamic/instance-identity/document).Content)
   ```

------
#### [ IMDSv1 ]

   ```
   PS C:\> {{$Document}} =  [Text.Encoding]::UTF8.GetBytes((Invoke-WebRequest http://169.254.169.254/latest/dynamic/instance-identity/document).Content)
   ```

------

1. 在 [AWS实例身份文档签名的 公有证书](regions-certs.md) 中找到您所在区域的 **RSA-2048** 公有证书，并将内容添加到名为 `certificate.pem` 的新文件。

1. 从证书文件中提取证书并将其存储在名为 `$Store` 的变量中。

   ```
   PS C:\> {{$Store}} = [Security.Cryptography.X509Certificates.X509Certificate2Collection]::new([Security.Cryptography.X509Certificates.X509Certificate2]::new((Resolve-Path {{certificate.pem}})))
   ```

1. 验证签名。

   ```
   PS C:\> {{$SignatureDocument}} = [Security.Cryptography.Pkcs.SignedCms]::new()
   ```

   ```
   PS C:\> {{$SignatureDocument}}.Decode({{$Signature}})
   ```

   ```
   PS C:\> {{$SignatureDocument}}.CheckSignature({{$Store}}, $true)
   ```

   如果签名有效，则命令不返回任何输出。如果无法验证签名，则命令返回 `Exception calling "CheckSignature" with "2" argument(s): "Cannot find the original signer`。如果无法验证您的签名，请联系 AWS 支持。

1. 验证实例身份文档的内容。

   ```
   PS C:\> [Linq.Enumerable]::SequenceEqual(${{SignatureDocument}}.ContentInfo.Content, {{$Document}})
   ```

   如果实例身份文档的内容有效，则命令返回 `True`。如果无法验证实例身份文档，请联系 AWS 支持。
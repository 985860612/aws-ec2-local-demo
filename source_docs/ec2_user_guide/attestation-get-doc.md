

# 获取 NitroTPM 认证文档
<a name="attestation-get-doc"></a>

认证文档是 NitroTPM 认证流程的关键组成部分。它包含一系列加密测量值，可用于验证实例的身份并证明其仅运行可信软件。您可以将认证文档与 AWS KMS（提供对 NitroTPM 认证的内置支持）一起使用，也可以构建自己的加密认证机制。

`nitro-tpm-attest` 实用程序使您能够在运行时检索 Amazon EC2 实例的已签名 NitroTPM 认证文档。

示例 Amazon Linux 2023 映像描述会自动将该实用程序安装到 `/usr/bin/` 目录中的内置映像。这可确保在使用 AMI 启动的实例上已预安装该实用程序。您无需手动安装该实用程序。有关更多信息，请参阅 [构建示例 Amazon Linux 2023 映像描述](build-sample-ami.md)。

**Topics**
+ [安装 `nitro-tpm-attest` 实用程序](#nitro-tpm-attest-install)
+ [使用 `nitro-tpm-attest` 实用程序](#nitro-tpm-attest-use)
+ [NitroTPM 认证文档](nitrotpm-attestation-document-content.md)
+ [验证认证文档](nitrotpm-attestation-document-validate.md)

## 安装 `nitro-tpm-attest` 实用程序
<a name="nitro-tpm-attest-install"></a>

如果您使用 Amazon Linux 2023，则可以按如下方式从 Amazon Linux 存储库安装 `nitro-tpm-attest` 实用程序。

```
sudo yum install aws-nitro-tpm-tools
```

## 使用 `nitro-tpm-attest` 实用程序
<a name="nitro-tpm-attest-use"></a>

该实用程序提供用于检索认证文档的单一命令 `nitro-tpm-attest`。该命令返回以简明二进制对象表示法（CBOR）编码并使用 CBOR 对象签名和加密（COSE）签名的认证文档。

运行该命令时，可指定以下可选的参数：
+ `public-key`：AWS KMS 或外部服务用于在返回响应数据之前对其进行加密的公有密钥。这可确保只有拥有私有密钥的预期接收者才能解密数据。例如，如果您使用 AWS KMS 进行认证，则该服务会使用认证文档中的公有密钥对纯文本数据进行加密，并在响应的 `CiphertextForRecipient` 字段中返回生成的加密文字。仅支持 RSA 密钥。
+ `user-data`：用户数据可用于将任何额外的签名数据传送到外部服务。此用户数据可用于完成请求实例与外部服务之间商定的协议。不用于使用 AWS KMS 的认证。
+ `nonce`：随机数可用于设置实例与外部服务之间的质询-响应身份验证，以帮助阻止冒充攻击。使用随机数使外部服务能够验证其是否与实时实例进行交互，而不是与重复使用旧认证文档的模拟者进行交互。不用于使用 AWS KMS 的认证。

**检索认证文档**  
使用以下命令和可选参数：

```
/usr/bin/nitro-tpm-attest \
--public-key {{rsa_public_key}} \
--user-data {{user_data}} \
--nonce {{nonce}}
```

有关展示如何生成 RSA 密钥对以及如何使用公有密钥请求认证的完整示例，请参阅 [nitro-tpm-attest GitHub repo](https://github.com/aws/NitroTPM-Tools/)。
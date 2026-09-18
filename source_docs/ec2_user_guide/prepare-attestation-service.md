

# 为认证准备 AWS KMS
<a name="prepare-attestation-service"></a>

**注意**  
如果您要认证第三方服务，则必须构建自己的自定义机制来接收、解析和验证认证文档。有关更多信息，请参阅 [验证 NitroTPM 认证文档](nitrotpm-attestation-document-validate.md)。

创建可证明的 AMI 后，您应该拥有可用于验证来自 Amazon EC2 实例请求的参考测量值。AWS KMS 提供对使用 NitroTPM 认证的内置支持。

对用于加密机密数据的 AWS KMS 密钥，添加一个密钥策略：仅在 API 请求包含的认证文档的测量值与您在可证明的 AMI 创建过程中生成的参考测量值匹配时才允许访问密钥。使用 PCR4 和 PCR12 测量值进行标准启动，或使用 PCR7 测量值进行安全启动。这可确保只有使用可证明的 AMI 启动的实例发出的请求才能使用 AWS KMS 密钥执行加密操作。

AWS KMS 提供 `kms:RecipientAttestation:NitroTPMPCR4`、`kms:RecipientAttestation:NitroTPMPCR7` 和 `kms:RecipientAttestation:NitroTPMPCR12` 条件键，使您能够为 NitroTPM KMS 密钥策略创建基于认证的条件。有关更多信息，请参阅 [NitroTPM 的条件键](https://docs.aws.amazon.com/kms/latest/developerguide/conditions-nitro-tpm.html)。

例如，以下 AWS KMS 密钥策略仅当请求源自附加 `MyEC2InstanceRole` 实例配置文件的实例，且请求包含具有特定 PCR 4 和 PCR 12 值的认证文档时，才允许访问密钥。

```
{
  "Version": "2012-10-17",		 	 	 
  "Statement": [
    {
      "Sid": "Allow requests from instances with attested AMI only",
      "Effect": "Allow",
      "Principal": {
        "AWS": "{{arn:aws:iam::111122223333:role/MyEC2InstanceRole}}"
      },
      "Action": [
        "kms:Decrypt",
        "kms:GenerateDataKey",
        "kms:GenerateRandom"
      ],
      "Resource": "*",
      "Condition": {
        "StringEqualsIgnoreCase": {
          "kms:RecipientAttestation:NitroTPMPCR4":"{{EXAMPLE6b9b3d89a53b13f5dfd14a1049ec0b80a9ae4b159adde479e9f7f512f33e835a0b9023ca51ada02160EXAMPLE}}",
          "kms:RecipientAttestation:NitroTPMPCR12":"{{000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000}}"
        }
      }
    }
  ]
}
```


# 将 与 集成AWS KMS
<a name="attestation-attest"></a>

您的实例应包含一个应用程序，其能够使用从 NitroTPM 检索的认证文档发出 AWS KMS API 请求。当您使用认证文档发出请求时，AWS KMS 会根据 KMS 密钥策略中的参考测量值来验证所提供认证文档中的测量值。仅当认证文档中的测量值与 KMS 密钥策略中的参考测量值匹配时，才会允许请求。

当您使用证明文档调用 [Decrypt](https://docs.aws.amazon.com/kms/latest/APIReference/API_Decrypt.html)、[DeriveSharedSecret](https://docs.aws.amazon.com/kms/latest/APIReference/API_DeriveSharedSecret.html)、[GenerateDataKey](https://docs.aws.amazon.com/kms/latest/APIReference/API_GenerateDataKey.html)、[GenerateDataKeyPair](https://docs.aws.amazon.com/kms/latest/APIReference/API_GenerateDataKeyPair.html) 或 [GenerateRandom](https://docs.aws.amazon.com/kms/latest/APIReference/API_GenerateRandom.html) API 操作时，这些 API 会使用证明文档中的公有密钥对响应中的明文进行加密，并返回密文而非明文。此加密文字只能使用实例中生成的匹配私有密钥进行解密。

有关更多信息，请参阅《AWS Key Management Service Developer Guide》**中的 [Cryptographic attestation for NitroTPM](https://docs.aws.amazon.com/kms/latest/developerguide/services-nitro-enclaves.html)。

**注意**  
如果您要认证第三方服务，则必须构建自己的自定义机制来接收、解析和验证认证文档。有关更多信息，请参阅 [验证 NitroTPM 认证文档](nitrotpm-attestation-document-validate.md)。
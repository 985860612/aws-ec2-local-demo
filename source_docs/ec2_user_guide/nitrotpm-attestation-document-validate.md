

# 验证 NitroTPM 认证文档
<a name="nitrotpm-attestation-document-validate"></a>

**注意**  
本主题面向使用第三方密钥管理服务并需要构建自己的证明文档验证机制的用户。

本主题详细介绍了整个 NitroTPM 认证流程。它还讨论了请求认证文档时 AWS Nitro 系统生成的内容，并解释了密钥管理服务应如何处理认证文档。

**Topics**
+ [认证文档](#doc-def)
+ [认证文档验证](#validation-process)

认证的目的是根据实例正在运行的代码和配置，证明实例是一个值得信赖的实体。实例的信任根位于 AWS Nitro 系统中，该系统提供认证文档。

认证文档由 AWS Nitro 认证公有密钥基础架构（PKI）签名，其中包含可以整合到任何服务中的已发布证书颁发机构。

## 认证文档
<a name="doc-def"></a>

认证文档以简明二进制对象表示法（CBOR）编码并使用 CBOR 对象签名和加密（COSE）签名。

有关 CBOR 的更多信息，请参阅 [RFC 8949: Concise Binary Object Representation (CBOR)](https://www.rfc-editor.org/rfc/rfc8949.html)。

### 认证文档规范
<a name="doc-spec"></a>

以下显示认证文档的结构。

```
AttestationDocument = {
    module_id: text,                     ; issuing Nitro hypervisor module ID
    timestamp: uint .size 8,             ; UTC time when document was created, in
                                         ; milliseconds since UNIX epoch
    digest: digest,                      ; the digest function used for calculating the
                                         ; register values
    nitrotpm_pcrs: { + index => pcr },   ; map of PCRs at the moment the Attestation Document was generated
    certificate: cert,                   ; the public key certificate for the public key 
                                         ; that was used to sign the Attestation Document
    cabundle: [* cert],                  ; issuing CA bundle for infrastructure certificate
    ? public_key: user_data,             ; an optional DER-encoded key the attestation
                                         ; consumer can use to encrypt data with
    ? user_data: user_data,              ; additional signed user data, defined by protocol
    ? nonce: user_data,                  ; an optional cryptographic nonce provided by the
                                         ; attestation consumer as a proof of authenticity
}

cert = bytes .size (1..1024)       ; DER encoded certificate
user_data = bytes .size (0..1024)
pcr = bytes .size (32/48/64)       ; PCR content
index = 0..31
digest = "SHA384"
```

认证文档中的可选参数（`public_key`、`user_data` 和 `nonce`）可用于在认证实例和外部服务之间建立自定义验证协议。

## 认证文档验证
<a name="validation-process"></a>

当您向 Nitro 虚拟机监控器请求认证文档时，您会收到一个包含已签名认证文档的二进制 blob。签名的认证文档是一个 CBOR 编码、COSE 签名（使用 COSE\_Sign1 签名结构）的对象。整个验证过程包括以下步骤：

1. 解码 CBOR 对象并将其映射到 COSE\_Sign1 结构。

1. 从 COSE\_Sign1 结构中提取认证文档。

1. 验证该证书链。

1. 确保认证文档已正确签名。

认证文档由 AWS Nitro Attestation PKI 签名，其中包含商业 AWS 分区的根证书。根证书可从 [https://aws-nitro-enclaves.amazonaws.com/AWS\_NitroEnclaves\_Root-G1.zip](https://aws-nitro-enclaves.amazonaws.com/AWS_NitroEnclaves_Root-G1.zip) 下载，并可使用以下指纹进行验证。

```
64:1A:03:21:A3:E2:44:EF:E4:56:46:31:95:D6:06:31:7E:D7:CD:CC:3C:17:56:E0:98:93:F3:C6:8F:79:BB:5B
```

根证书基于 AWS Certificate Manager 私有证书颁发机构（AWS 私有 CA）的私有密钥，有效期为 30 年。PCA 的主题采用以下格式。

```
CN=aws.nitro-enclaves, C=US, O=Amazon, OU=AWS
```

**Topics**
+ [COSE 和 CBOR](#COSE-CBOR)
+ [语义有效性](#semantic-validation)
+ [证书有效性](#cert-validity)
+ [证书链有效性](#chain)

### COSE 和 CBOR
<a name="COSE-CBOR"></a>

通常，当一条消息中只需要放置一个签名时，会使用 COSE\_Sign1 签名结构。处理内容和签名的参数放在受保护的标头中，而不是像 COSE\_Sign 那样分开放置。该结构可以编码为带标签或不带标签，具体取决于其使用上下文。带标签的 COSE\_Sign1 结构由 CBOR 标签 18 标识。

包含正文、签名以及正文和签名相关信息的 CBOR 对象称为 COSE\_Sign1 结构。COSE\_Sign1 结构是一个 CBOR 数组。该数组包含以下字段。

```
[
  protected:   Header,
  unprotected: Header,
  payload:     This field contains the serialized content to be signed,
  signature:   This field contains the computed signature value.
]
```

在认证文档上下文中，该数组包含以下内容。

```
18(/* COSE_Sign1 CBOR tag is 18 */
    {1: -35}, /* This is equivalent with {algorithm: ECDS 384} */
    {}, /* We have nothing in unprotected */
    $ATTESTATION_DOCUMENT_CONTENT /* Attestation Document */,
    signature /* This is the signature */
)
```

有关 CBOR 的更多信息，请参阅 [RFC 8949: Concise Binary Object Representation (CBOR)](https://www.rfc-editor.org/rfc/rfc8949.html)。

### 语义有效性
<a name="semantic-validation"></a>

认证文档的 CA 捆绑包始终按以下顺序排列。

```
[ ROOT_CERT - INTERM_1 - INTERM_2 .... - INTERM_N]
      0          1          2             N - 1
```

请记住此顺序，因为某些现有工具（例如《Java PKI API Programmer’s Guide》[https://docs.oracle.com/javase/8/docs/technotes/guides/security/certpath/CertPathProgGuide.html](https://docs.oracle.com/javase/8/docs/technotes/guides/security/certpath/CertPathProgGuide.html)中 Java 的 CertPath）可能会要求其按不同顺序排列。

要验证证书，请从认证文档的 CA 捆绑包开始并生成所需的链，其中 `TARGET_CERT` 为认证文档中的证书。

```
[TARGET_CERT, INTERM_N, ..... , INTERM_2, INTERM_1, ROOT_CERT]
```

### 证书有效性
<a name="cert-validity"></a>

对于证书链中的所有证书，您必须确保当前日期在证书中指定的有效期内。

### 证书链有效性
<a name="chain"></a>

通常，可能需要多个证书组成的证书链，包括由一个 CA 签名的公有密钥所有者证书，以及由其他 CA 签名的零个或多个其他 CA 证书。之所以需要这样的证书链（称为认证路径），是因为公有密钥用户仅初始化了有限数量有保证的 CA 公有密钥。互联网 PKI 的认证路径验证程序基于 X.509 中提供的算法。认证路径处理会验证主题可分辨名称和/或主题备用名称与主题公有密钥之间的绑定。绑定受证书中指定的约束以及依赖方所指定路径和输入的限制。基本限制和策略约束扩展允许认证路径处理逻辑自动执行决策过程。

**注意**  
进行验证时必须禁用 CRL。

使用 Java，从根路径和生成的证书链开始，证书链验证如下。

```
validateCertsPath(certChain, rootCertficate) {
    /* The trust anchor is the root CA to trust */
    trustAnchors.add(rootCertificate);

    /* We need PKIX parameters to specify the trust anchors
     * and disable the CRL validation
     */
    validationParameters = new PKIXParameters(trustAnchors);
    certPathValidator = CertPathValidator.getInstance(PKIX);
    validationParameters.setRevocationEnabled(false);

    /* We are ensuring that certificates are chained correctly */
    certPathValidator.validate(certPath, validationParameters);
}
```
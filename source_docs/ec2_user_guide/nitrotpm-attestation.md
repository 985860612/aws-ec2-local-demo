

# Amazon EC2 实例认证
<a name="nitrotpm-attestation"></a>

认证是一种过程，使您能够以加密方式向任何方证明，Amazon EC2 实例上仅运行可信软件、驱动程序和启动流程。Amazon EC2 实例认证由 Nitro 可信平台模块（NitroTPM）和*可证明的 AMI* 提供支持。

认证的第一步是**构建可证明的 AMI** 并确定该 AMI 的*参考测量值*。可证明的 AMI 是专为认证而从头构建的 AMI。参考测量值是对您的 AMI 中包含的所有软件和配置的测量值。有关如何获取参考测量值，请参阅[构建示例映像描述](build-sample-ami.md)。

![使用可证明的 AMI 生成参考测量值。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/attestable-ami.PNG)


下一步是使用可证明的 AMI 启动[启用 Nitro-TPM 的 EC2 实例](enable-nitrotpm-prerequisites.md#nitrotpm-instancetypes)。启动实例后，您可以使用 [NitroTPM 工具](attestation-get-doc.md)生成*认证文档*。然后，您可以将认证文档中 EC2 实例的实际测量值与参考测量值进行比较，以检查该实例是否有您信任的软件和配置。

通过将可证明的 AMI 创建过程中生成的参考测量值与实例认证文档中包含的测量值进行比较，您可以验证是否只有您信任的软件和代码在实例上运行。

![生成认证文档。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/attestation-document.PNG)


## 与 AWS KMS 集成
<a name="attestation-kms"></a>

为了简化比较测量值的过程，可以使用 AWS Key Management Service（AWS KMS）作为认证文档的验证程序。借助 AWS KMS，您可以创建基于认证的 KMS 密钥策略，仅当您向认证文档提供的测量值与参考测量值匹配时，才允许使用 KMS 密钥进行特定操作。为此，您需要向使用参考测量值作为条件键值的 KMS 密钥策略添加特定的条件键，然后指定如果满足条件键则允许哪些 KMS 操作。

使用 KMS 密钥执行 KMS 操作时，必须将认证文档附加到 KMS 请求。然后，AWS KMS 根据 KMS 密钥策略中的参考测量值验证认证文档中的测量值，并且仅在测量值匹配时才允许访问密钥。

此外，在为实例生成认证文档时，必须为自己拥有的密钥对指定公有密钥。指定的公有密钥包含在认证文档中。AWS KMS 验证认证文档并允许解密操作时，它会自动使用认证文档中包含的公有密钥对响应进行加密，然后再将其返回。这可确保响应只能使用与认证文档中所包含公有密钥的匹配私有密钥进行解密和使用。

这可确保只有运行可信软件和代码的实例才能使用 KMS 密钥执行加密操作。

## 认证隔离的计算环境
<a name="attestation-isolated-compute-environments"></a>

通常，您可以构建一个 EC2 实例并将其配置为**隔离的计算环境**，该环境不提供交互式访问权限，也不会为管理员和用户提供访问 EC2 实例中正在处理的数据的机制。借助 EC2 实例认证，您可以向第三方或服务证明您的实例正在作为隔离的计算环境运行。有关更多信息，请参阅 [将数据与您自己的操作员隔离](isolate-data-operators.md)。

有关示例，请参阅创建隔离计算环境的[示例 Amazon Linux 2023 映像描述](build-sample-ami.md)。您可以将此示例映像描述作为起点，并对其进行自定义，以满足您的要求。

## AWS 责任共担模式
<a name="attestation-shared-responsibility"></a>

NitroTPM 和可证明的 AMI 是构建基块，可以帮助您在 EC2 实例上设置和配置认证。您负责配置 AMI 以满足相应使用案例。有关更多信息，请参阅 [AWS 责任共担模式](https://aws.amazon.com/compliance/shared-responsibility-model/)。

**Topics**
+ [与 AWS KMS 集成](#attestation-kms)
+ [认证隔离的计算环境](#attestation-isolated-compute-environments)
+ [AWS 责任共担模式](#attestation-shared-responsibility)
+ [可证明的 AMI](attestable-ami.md)
+ [为认证准备 AWS KMS](prepare-attestation-service.md)
+ [获取 NitroTPM 认证文档](attestation-get-doc.md)
+ [将 与 集成AWS KMS](attestation-attest.md)
+ [将数据与您自己的操作员隔离](isolate-data-operators.md)


# 适用于 Amazon EC2 实例的 UEFI 安全启动
<a name="uefi-secure-boot"></a>

UEFI 安全启动构建在 Amazon EC2 长期以来的安全启动过程之上，并提供了额外的深度防御功能，可以帮助客户保护软件免受重新引导过程中持续存在的威胁。它确保实例只启动使用了加密密钥签名的软件。密钥存储在 [UEFI 非易失性变量存储](uefi-variables.md)的密钥数据库中。UEFI 安全启动可防止未经授权地修改实例启动流程。

**Topics**
+ [如何将 UEFI 安全启动与 Amazon EC2 实例配合使用](how-uefi-secure-boot-works.md)
+ [Amazon EC2 上 UEFI 安全启动的要求](launch-instance-with-uefi-sb.md)
+ [验证 Amazon EC2 实例是否启用了 UEFI 安全启动](verify-uefi-secure-boot.md)
+ [使用自定义 UEFI 安全启动密钥创建 Linux AMI](create-ami-with-uefi-secure-boot.md)
+ [为 UEFI 安全启动创建 AWS 二进制 blob](aws-binary-blob-creation.md)
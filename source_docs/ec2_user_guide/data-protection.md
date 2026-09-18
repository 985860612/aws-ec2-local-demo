

# Amazon EC2 中的数据保护
<a name="data-protection"></a>

AWS [责任共担模式](https://aws.amazon.com/compliance/shared-responsibility-model/)适用于 Amazon Elastic Compute Cloud 中的数据保护。如该模式中所述，AWS 负责保护运行所有 AWS Cloud 的全球基础结构。您负责维护对托管在此基础结构上的内容的控制。您还负责您所使用的 AWS 服务 的安全配置和管理任务。有关数据隐私的更多信息，请参阅[数据隐私常见问题](https://aws.amazon.com/compliance/data-privacy-faq/)。有关欧洲数据保护的信息，请参阅[通用数据保护条例（GDPR）中心](https://aws.amazon.com/compliance/gdpr-center/)。

出于数据保护目的，建议您保护 AWS 账户 凭证并使用 AWS IAM Identity Center 或 AWS Identity and Access Management（IAM）设置单个用户。这样，每个用户只获得履行其工作职责所需的权限。还建议您通过以下方式保护数据：
+ 对每个账户使用多重身份验证（MFA）。
+ 使用 SSL/TLS 与 AWS 资源进行通信。我们要求使用 TLS 1.2，建议使用 TLS 1.3。
+ 使用 AWS CloudTrail 设置 API 和用户活动日记账记录。有关使用 CloudTrail 跟踪来捕获 AWS 活动的信息，请参阅《AWS CloudTrail 用户指南》**中的[使用 CloudTrail 跟踪](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-trails.html)。
+ 使用 AWS 加密解决方案以及 AWS 服务中的所有默认安全控制。
+ 使用高级托管安全服务（例如 Amazon Macie），它有助于发现和保护存储在 Amazon S3 中的敏感数据。
+ 如果在通过命令行界面或 API 访问 AWS 时需要经过 FIPS 140-3 验证的加密模块，请使用 FIPS 端点。有关可用的 FIPS 端点的更多信息，请参阅《美国联邦信息处理标准（FIPS）第 140-3 版》[https://aws.amazon.com/compliance/fips/](https://aws.amazon.com/compliance/fips/)。

强烈建议您切勿将机密信息或敏感信息（如您客户的电子邮件地址）放入标签或自由格式文本字段（如**名称**字段）。这包括当您通过控制台、API、AWS CLI 或 AWS SDK 使用 Amazon EC2 或其他 AWS 服务 时。在用于名称的标签或自由格式文本字段中输入的任何数据都可能会用于计费或诊断日志。如果您向外部服务器提供网址，强烈建议您不要在网址中包含凭证信息来验证对该服务器的请求。

**Topics**
+ [Amazon EBS 数据安全](#ebs-data-security)
+ [静态加密](#encryption-rest)
+ [传输中加密](#encryption-transit)

## Amazon EBS 数据安全
<a name="ebs-data-security"></a>

Amazon EBS 卷作为未格式化的原始块设备呈现。这些设备是在 EBS 基础设施上创建的逻辑设备；Amazon EBS 服务可确保在客户使用或重复使用之前，这些设备为逻辑空白（即，原始数据块被归零或包含加密伪随机数据）。

如果您有要求在使用后和/或使用前使用特定方法擦除所有数据的程序，例如 **DoD 5220.22-M**（美国《国家工业安全计划操作手册》）或 **NIST 800-88**（《存储介质清理指南》）中详细说明的程序，您可以在 Amazon EBS 上执行此操作。该数据块级活动将反映到 Amazon EBS 服务的底层存储介质中。

## 静态加密
<a name="encryption-rest"></a>

**EBS 卷**  
Amazon EBS 加密是适用于 EBS 卷和快照的加密解决方案。它使用 AWS KMS keys。有关更多信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 加密](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html)。

[Windows 实例] 您也可使用 Microsoft EFS 和 NTFS 权限来进行文件夹级和文件级加密。

**实例存储卷**  
NVMe 实例存储卷上的数据是使用实例上的硬件模块中实施的 XTS-AES-256 密码加密的。用于加密写入本地连接的 NVMe 存储设备的数据的密钥是针对每个客户和每个卷的。密钥由硬件模块生成并且仅位于硬件模块内，AWS 人员无法访问该模块。当实例停止或终止并且无法恢复时，将销毁所有加密密钥。无法禁用此加密，并且无法提供自己的加密密钥。

HDD 实例存储卷上的数据在 H1、D3 和 D3en 实例上使用 XTS-AES-256 和一次性密钥加密。

停止、休眠或终止实例时，实例存储卷中的每个存储数据块都会被重置。因此，无法通过另一实例的实例存储访问您的数据。

**内存**

以下实例上启用了内存加密：
+ 使用 AWS Graviton2 或更高版本 AWS Graviton 处理器的实例支持始终在线内存加密。加密密钥是在主机系统内安全生成的，不要离开主机系统，并在重新启动或关闭主机电源时销毁的。有关更多信息，请参阅 [AWS Graviton 处理器](https://aws.amazon.com/ec2/graviton/)。
+ 采用第三代英特尔至强可扩展处理器（Ice Lake）的实例（如 M6i 实例）和采用第四代英特尔至强可扩展处理器（Sapphire Rapids）的实例（如 M7i 实例）。这些处理器支持使用英特尔总内存加密 (TME) 的永远在线内存加密。
+ 采用第三代 AMD EPYC 处理器（Milan）的实例（如 M6a 实例）和采用第四代 AMD EPYC 处理器（Genoa）的实例（如 M7a 实例）。这些处理器支持使用 AMD 安全内存加密（SME）进行始终在线内存加密。
+ 某些基于 AMD 的实例类型支持 AMD 安全加密虚拟化安全嵌套分页 (SEV-SNP)。有关更多信息，请参阅 [查找支持 AMD SEV-SNP 的 EC2 实例类型](snp-find-instance-types.md)。

## 传输中加密
<a name="encryption-transit"></a>

**物理层加密**  
所有在AWS全球网络上跨AWS区域流动的数据在离开AWS保护的设施之前都会在物理层自动加密。可用区之间的所有流量均已加密。其他加密层（包括本节中列出的加密层）可能会提供额外保护。

**Amazon VPC 对等连接和 Transit Gateway 跨区域对等连接提供的加密**  
使用 Amazon VPC 对等连接和 Transit Gateway 对等连接的所有跨区域流量在离开区域时都会自动批量加密。如本节之前所述，所有跨区域流量在离开AWS保护的设施之前均会在物理层自动提供一层额外加密层。

**实例之间的加密**  
AWS 在所有类型的 EC2 实例之间提供安全的私有连接。此外，某些实例类型使用底层 Nitro 系统硬件的卸载功能，自动加密实例之间的传输中流量。此加密使用关联数据的身份验证加密（AEAD）算法，采用 256 位加密。这对网络性能没有影响。要在实例之间支持这种额外的传输中流量加密，必须满足以下要求：
+ 使用以下实例类型：
  + **通用型**：M5dn、M5n、M5zn、M6a、M6i、M6id、M6idn、M6in、M7a、M7g、M7gd、M7i、M7i-flex、M8a、M8azn、M8g、M8gb、M8gd、M8gn、M8i、M8id、M8i-flex、M8in、M8idn、M8ine、M8ib、M8idb、M9g、M9gd、Mac-m4、Mac-m4pro
  + **计算优化型：**C5n、C6a、C6gn、C6i、C6id、C6in、C7a、C7g、C7gd、C7gn、C7i、C7i-flex、C8a、C8g、C8gb、C8gd、C8gn、C8i、C8id、C8i-flex、C8in、C8ine、C8ib、C9g、C9gd
  + **内存优化型：**R5dn、R5n、R6a、R6i、R6id、R6idn、R6in、R7a、R7g、R7gd、R7i、R7iz、R8a、R8g、R8gb、R8gd、R8gn、R8i、R8id、R8i-flex、R8in、R8idn、R8ib、R8idb、R9g、R9gd、U-3tb1、U-6tb1、U-9tb1、U-12tb1、U-18tb1、U-24tb1、U7i-6tb、U7i-8tb、U7i-12tb、U7in-16tb、U7in-24tb、U7in-32tb、U7inh-32tb、X2idn、X2iedn、X2iezn、X8g、X8aedz、X8i
  + **存储优化型：**D3、D3en、I3en、I4g、I4i、I7i、I7ie、I8g、I8ge、Im4gn、Is4gen
  + **加速计算型：**DL1、DL2q、F2、G4ad、G4dn、G5、G6、G6e、G6f、Gr6、Gr6f、G7、G7e、Inf1、Inf2、P3dn、P4d、P4de、P5、P5e、P5en、P6-B200、P6-B300、P6e-GB200、Trn1、Trn1n、Trn2、Trn2u、VT1
  + **高性能计算：**Hpc6a、Hpc6id、Hpc7a、Hpc7g、Hpc8a
+ 这些实例位于同一区域。
+ 这些实例位于相同 VPC 或对等的 VPC 中，并且流量不会通过虚拟网络设备或服务（如负载均衡器或中转网关）传输。

如本节之前所述，所有跨区域流量在离开AWS保护的设施之前均会在物理层自动提供一层额外加密层。

**使用 AWS CLI 查看加密实例之间传输中流量的实例类型**  
使用以下 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令。

```
aws ec2 describe-instance-types \
    --filters Name=network-info.encryption-in-transit-supported,Values=true \
    --query "InstanceTypes[*].[InstanceType]" \
    --output text | sort
```

**往返于 AWS Outposts 的加密**  
Outpost 会创建名为 *service links*（服务链接）的特殊网络连接到其 AWS 主区域，并且可以选择创建私有连接到您指定的 VPC 子网。通过这些连接的所有流量都完全加密。有关更多信息，请参阅 。[通过服务链路进行连接](https://docs.aws.amazon.com/outposts/latest/userguide/region-connectivity.html#service-links)和[传输中加密](https://docs.aws.amazon.com/outposts/latest/userguide/data-protection.html#encryption-transit)中的*AWS Outposts用户指南*。

**远程访问加密**  
SSH 和 RDP 协议直接或通过 EC2 Instance Connect 提供了用于远程访问实例的安全通信通道。使用 AWS Systems Manager Session Manage 或 Run Command 对实例的远程访问是使用 TLS 1.2 加密的，创建连接的请求是使用 [SigV4](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html) 签名的，且由 [AWS Identity and Access Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) 进行身份验证并授权。

使用传输层安全性协议（TLS）等加密协议加密在客户端和 Amazon EC2 实例之间传输的敏感数据是您的责任。

（Windows 实例）确保仅允许 EC2 实例和 AWS API 端点或其他敏感远程网络服务之间的加密连接。您可以通过出站安全组或 [Windows 防火墙](https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/)规则强制实施这一点。
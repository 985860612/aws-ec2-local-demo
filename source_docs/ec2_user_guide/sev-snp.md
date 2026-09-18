

# Amazon EC2 实例的 AMD SEV-SNP
<a name="sev-snp"></a>

AMD 安全加密虚拟化–安全嵌套分页（AMD SEV-SNP）CPU 功能具有以下属性：
+ **认证**–AMD SEV-SNP 使您能够检索已签名的认证报告，其中包含可用于验证实例状态和身份并证明实例在正版 AMD 硬件上运行的加密措施。有关更多信息，请参阅 [使用 AMD SEV-SNP 证明 Amazon EC2 实例](snp-attestation.md)。
+ **内存加密** – 从 AMD EPYC（米兰）、AWS Graviton2 和英特尔至强可扩展（Ice Lake）处理器开始，实例内存始终是加密的。

您可以将 AMD SEV-SNP 与专属主机或共享租赁一起使用。

**Topics**
+ [概念和术语](#snp-concepts)
+ [要求](#snp-requirements)
+ [注意事项](#snp-considerations)
+ [定价](#snp-pricing)
+ [查找支持的实例类型](snp-find-instance-types.md)
+ [启用 AMD SEV-SNP](snp-work-launch.md)
+ [使用 AMD SEV-SNP 证明](snp-attestation.md)

## 概念和术语
<a name="snp-concepts"></a>

在开始使用 AMD SEV-SNP 之前，请先熟悉以下概念和术语。

**AMD SEV-SNP 证明报告**  
AMD SEV-SNP 证明报告是实例可以请求 CPU 提供的一种文档。AMD SEV-SNP 证明报告可用于验证实例的状态和身份，以及验证实例是否在认可的 AMD 环境中运行。证明报告包括一项启动指标，该指标是实例初始引导状态的加密哈希值，其中包括其初始实例内存内容和 vCPU 的初始状态。AMD SEV-SNP 认证报告采用 VCEK 签名签署（在专属主机上）或回链至 AMD 信任根 VLEK 签名签署（共享租赁）。

**VCEK**  
版本控制芯片认可密钥（VLEK）是 AMD 认证的一种芯片签名密钥，由 AMD CPU 用于在专属主机上签署 AMD SEV-SNP 认证报告。VCEK 签名可通过 AMD 提供的证书来进行验证。

**VLEK**  
版本控制加载认可密钥（VLEK）是 AMD 认证的一种版本控制签名密钥，由 AMD CPU 用于签署共享租赁上的 AMD SEV-SNP 认证报告。VLEK 签名可通过 AMD 提供的证书来进行验证。

**OVMF 二进制文件**  
开放虚拟机固件（OVMF）是用于为实例提供 UEFI 环境的早期启动代码。早期启动代码将早于 AMI 中的代码启动运行。OVMF 还将查找并运行 AMI 中提供的引导加载程序。有关更多信息，请参阅 [OVMF 存储库](https://github.com/tianocore/tianocore.github.io/wiki/OVMF)。

## 要求
<a name="snp-requirements"></a>

AMD SEV-SNP 的要求取决于您使用的是专属主机还是共享租赁。

**专属主机要求**  
要在专属主机上使用 AMD SEV-SNP，您必须满足以下要求：
+ 使用以下任何一种支持的实例类型：
  + **通用型**：`m6a.large` \|`m6a.xlarge` \|`m6a.2xlarge` \|`m6a.4xlarge` \|`m6a.8xlarge` 
  + **计算优化型**：`c6a.large` \|`c6a.xlarge` \|`c6a.2xlarge` \|`c6a.4xlarge` \|`c6a.8xlarge` \|`c6a.12xlarge` \|`c6a.16xlarge` 
  + **内存优化型**：`r6a.large`\|`r6a.xlarge` \|`r6a.2xlarge` \|`r6a.4xlarge` 
+ 分配已启用 AMD SEV-SNP 的专属主机。有关更多信息，请参阅 [分配使用 AMD SEV-SNP 的专属主机](snp-work-launch.md#snp-allocate-dh)。
+ 在任何广告 AWS 区域 中启动您的实例。
+ 使用带有 `uefi` 或 `uefi-preferred` 启动模式的 AMI 以及支持 AMD SEV-SNP 的操作系统。对于 AWS，AL2023、RHEL 9.3 SLES 15 SP4 以及 Ubuntu 23.04 和更高版本都支持 AMD SEV-SNP。

**共享租赁的要求**  
要在共享租赁的情况下使用 AMD SEV-SNP，您必须满足以下要求：
+ 使用以下任何一种支持的实例类型：
  + **通用型**：`m6a.large` \|`m6a.xlarge` \|`m6a.2xlarge` \|`m6a.4xlarge` \|`m6a.8xlarge` 
  + **计算优化型**：`c6a.large` \|`c6a.xlarge` \|`c6a.2xlarge` \|`c6a.4xlarge` \|`c6a.8xlarge` \|`c6a.12xlarge` \|`c6a.16xlarge` 
  + **内存优化型**：`r6a.large`\|`r6a.xlarge` \|`r6a.2xlarge` \|`r6a.4xlarge` 
+ 在支持 AWS 区域 的区域启动您的实例：美国东部（俄亥俄州）或欧洲地区（爱尔兰）。
+ 使用带有 `uefi` 或 `uefi-preferred` 启动模式的 AMI 以及支持 AMD SEV-SNP 的操作系统。对于 AWS，AL2023、RHEL 9.3 SLES 15 SP4 以及 Ubuntu 23.04 和更高版本都支持 AMD SEV-SNP。

## 注意事项
<a name="snp-considerations"></a>

您只能在启动实例时启用 AMD SEV-SNP。如果在实例启动时启用 AMD SEV-SNP，则以下规则适用。
+ AMD SEV-SNP 启用后便无法禁用。会在整个实例生命周期中保持启用状态。
+ 您只能将[实例类型更改](ec2-instance-resize.md)为支持 AMD SEV-SNP 的其他实例类型。
+ 不支持休眠和 Nitro Enclaves。

**专属主机的其他注意事项**  
在专属主机上使用 AMD SEV-SNP 时，还需要考虑以下其他注意事项：
+ 分配主机时会应用固件更新。要获取最新固件，请释放现有主机并分配一个新的主机。有关更多信息，请参阅 [更新 AMD SEV-SNP 专属主机上的固件](snp-work-launch.md#snp-firmware)。
+ 无论是否启用 AMD SEV-SNP，您都可以在支持 AMD SEV-SNP 的专属主机上启动实例。
+ 支持主机资源组和专属主机预留。

**共享租赁的其他注意事项**  
在共享租赁中使用 AMD SEV-SNP 时，还需要考虑以下其他注意事项：
+ 如果实例的底层主机计划进行维护，您将在该事件发生前 14 天收到计划事件通知。您必须手动停止或重启实例，然后才能将其迁移到新主机。

## 定价
<a name="snp-pricing"></a>

**专属主机**  
在专属主机上使用 AMD SEV-SNP 无需支付额外费用。您只需按标准的专属主机定价付费。有关更多信息，请参阅[专属主机定价](https://aws.amazon.com/ec2/dedicated-hosts/pricing/)。

**共享租赁**  
在共享租赁模式下启用 AMD SEV-SNP 的情况下启动 Amazon EC2 实例时，您需要按小时支付额外的使用费，费率为所选实例类型[按需小时费率](https://aws.amazon.com/ec2/pricing/on-demand/)的 10%。此 AMD SEV-SNP 使用费将按您的 Amazon EC2 实例使用量单独收取。预留实例、Savings Plans 和操作系统使用情况不会影响此费用。

如果将竞价型实例配置为在共享租赁模式下启用 AMD SEV-SNP 的情况下启动，您需要按小时支付额外的使用费，费率为所选实例类型[按需小时费率](https://aws.amazon.com/ec2/pricing/on-demand/)的 10%。如果分配策略使用价格作为输入，则竞价型实例集不包括这笔额外费用；只使用 Spot 价格。
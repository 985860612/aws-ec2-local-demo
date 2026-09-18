

# EC2 实例休眠的先决条件
<a name="hibernating-prerequisites"></a>

您可以在启动按需型实例或竞价型实例时为其启用休眠支持。您不能在现有实例（无论其正在运行或已停止）上启用休眠。有关更多信息，请参阅 [启用实例休眠](enabling-hibernation.md)。

**Topics**
+ [AWS 区域](#hibernation-prereqs-regions)
+ [AMI](#hibernation-prereqs-supported-amis)
+ [实例系列](#hibernation-prereqs-supported-instance-families)
+ [实例 RAM 大小](#instance-ram-size)
+ [根卷类型](#hibernation-prereqs-root-volume-type)
+ [根卷大小](#hibernation-prereqs-ebs-root-volume-size)
+ [根卷加密](#hibernation-prereqs-ebs-root-volume-encryption)
+ [EBS 卷类型](#hibernation-prereqs-ebs-volume-types)
+ [竞价型实例请求](#hibernation-prereqs-spot-request)

## AWS 区域
<a name="hibernation-prereqs-regions"></a>

您可以对所有 AWS 区域 中的实例使用休眠。

## AMI
<a name="hibernation-prereqs-supported-amis"></a>

您必须使用支持休眠的 HVM AMI。下列 AMI 支持休眠：

### Linux AMI
<a name="hibernation-prereqs-supported-amis-linux"></a>

**Intel 和 AMD 实例类型的 AMI**
+ AL2023 AMI 发布了 2023.09.20 版或更高版本¹
+ Amazon Linux 2 AMI 发布了 2019.08.29 版或更高版本。
+ Amazon Linux AMI 2018.03 发布了 2018.11.16 版或更高版本。
+ CentOS 版本 8 AMI²（需要[其他配置](hibernation-enabled-AMI.md#configure-centos-for-hibernation)）
+ Fedora 版本 34 或更高版本 AMI²（需要[其他配置](hibernation-enabled-AMI.md#configure-fedora-for-hibernation)）
+ Red Hat Enterprise Linux (RHEL) 9 AMI²（需要[其他配置](hibernation-enabled-AMI.md#configure-RHEL-for-hibernation)）
+ Red Hat Enterprise Linux (RHEL) 8 AMI²（需要[其他配置](hibernation-enabled-AMI.md#configure-RHEL-for-hibernation)）
+ 发布序列号为 20230303 或更晚的 Ubuntu 22.04.2 LTS (Jammy Jellyfish) AMI³
+ 发布序列号为 20210820 或更晚的 Ubuntu 20.04 LTS (Focal Fossa) AMI³
+ 发布序列号为 20190722.1 或更晚的 Ubuntu 18.04 LTS (Bionic Beaver) AMI³ ⁵
+ Ubuntu 16.04 LTS（Xenial Xerus）AMI³ ⁴ ⁵（需要[其他配置](hibernation-enabled-AMI.md#configure-ubuntu1604-for-hibernation)）

**Graviton 实例类型的 AMI**
+ AL2023 AMI（64 位 Arm）发布了 2024.07.01 版或更高版本¹
+ Amazon Linux 2 AMI（64 位 Arm）发布了 2024.06.20 版或更高版本
+ 发布序列号为 20240701 或更晚的 Ubuntu 22.04.2 LTS（64 位 Arm）(Jammy Jellyfish) AMI³
+ 发布序列号为 20240701 或更晚的 Ubuntu 20.04 LTS（64 位 Arm）(Focal Fossa) AMI³

 

¹ 对于 AL2023 最低 AMI，[需要其他配置](hibernation-enabled-AMI.md#configure-AL2023-minimal-for-hibernation)。

² 对于 CentOS、Fedora 和 Red Hat Enterprise Linux，仅在基于 Nitro 的实例上支持休眠。

³ 我们建议在采用 Ubuntu 22.04.2 LTS (Jammy Jellyfish)、Ubuntu 20.04 LTS (Focal Fossa)、Ubuntu 18.04 LTS (Bionic Beaver) 和 Ubuntu 16.04 LTS (Xenial Xerus) 的实例上禁用 KASLR。有关更多信息，请参阅 [在实例上禁用 KASLR（仅限 Ubuntu）](hibernation-disable-kaslr.md)。

⁴ 对于 Ubuntu 16.04 LTS (Xenial Xerus) AMI，在 `t3.nano` 实例类型上不支持休眠。补丁将不可用，因为 Ubuntu（Xenial Xerus）于 2021 年 4 月终止了支持。要使用 `t3.nano` 实例类型，我们建议您升级到 Ubuntu 22.04.2 LTS (Jammy Jellyfish)、Ubuntu 20.04 LTS（Focal Fossa）AMI 或 Ubuntu 18.04 LTS（Bionic Beaver）AMI。

⁵ 对 Ubuntu 18.04 LTS (Bionic Beaver) 和 Ubuntu 16.04 LTS (Xenial Xerus) 的支持已结束。

要配置您自己的 AMI 以支持休眠，请参阅 [配置 Linux AMI 以支持休眠](hibernation-enabled-AMI.md)。

即将支持 Ubuntu 的其他版本和其他操作系统。

### Windows AMI
<a name="hibernation-prereqs-supported-amis-windows"></a>
+ Windows Server 2022 AMI 发布了 2023.09.13 版或更高版本
+ Windows Server 2019 AMI 发布了 2019.09.11 版或更高版本。
+ Windows Server 2016 AMI 发布了 2019.09.11 版或更高版本。
+ Windows Server 2012 R2 AMI 发布了 2019.09.11 版或更高版本。
+ Windows Server 2012 AMI 发布了 2019.09.11 版或更高版本。

## 实例系列
<a name="hibernation-prereqs-supported-instance-families"></a>

您必须使用支持休眠的实例系列。但是，不支持裸机实例。
+ 通用型：M3、M4、M5、M5a、M5ad、M5d、M6a、M6g、M6gd、M6i、M6id、M6idn、M6in、M7a、M7g、M7gd、M7i、M7i-flex、M8a、M8azn、M8g、M8gb、M8gd、M8gn、M8i、M8i-flex、M8in、M8idn、M8ib、M8idb、M9g、M9gd、T2、T3、T3a、T4g
+ 计算优化型：C3、C4、C5、C5d、C6a、C6g、C6gd、C6gn、C6i、C6id、C6in、C7a、C7g、C7gd、C7gn、C7i、C7i-flex、C8a、C8g、C8gb、C8gd、C8gn、C8i、C8i-flex、C8in、C8ib、C9g、C9gd
+ 内存优化型：R3、R4、R5、R5a、R5ad、R5d、R6a、R6g、R6gd、R6idn、R6in、R7a、R7g、R7gd、R7i、R7iz、R8a、R8g、R8gb、R8gd、R8gn、R8i、R8i-flex、R8in、R8idn、R8ib、R8idb、R9g、R9gd、X2gd、X8aedz、X8i
+ 存储优化型：I3、I3en、I4g、I7i、I7ie、I8g、I8ge、Im4gn、Is4gen

------
#### [ Console ]

**获取支持休眠的实例类型**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instance Types (实例类型)**。

1. 添加筛选条件**按需休眠支持 = true**。

1. （可选）添加筛选条件以进一步筛选相关的特定实例类型。

------
#### [ AWS CLI ]

**获取支持休眠的实例类型**  
请使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/describe-instance-types/.html) 命令。请注意，可用的实例类型因区域而异。

```
aws ec2 describe-instance-types \
    --filters Name=hibernation-supported,Values=true \
    --query "InstanceTypes[*].[InstanceType]" \
    --output text | sort
```

------
#### [ PowerShell ]

**获取支持休眠的实例类型**  
使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) cmdlet。请注意，可用的实例类型因区域而异。

```
(Get-EC2InstanceType `
    -Filter @{Name="hibernation-supported"; Values="true"}).InstanceType | Sort-Object
```

------

## 实例 RAM 大小
<a name="instance-ram-size"></a>

**Linux 实例** – 必须小于 150 GiB。

**Windows 实例** – 必须小于或等于 16 GiB。如需将 T3 或 T3a Windows 实例休眠，建议内存至少为 1 GiB RAM。

## 根卷类型
<a name="hibernation-prereqs-root-volume-type"></a>

根卷必须是 EBS 卷，而不是实例存储卷。

## 根卷大小
<a name="hibernation-prereqs-ebs-root-volume-size"></a>

根卷必须足够大，以存储 RAM 内容并满足您的预期使用量，例如，操作系统或应用程序。如果您启用休眠，则启动时在根卷上分配空间以存储 RAM。

## 根卷加密
<a name="hibernation-prereqs-ebs-root-volume-encryption"></a>

必须加密根卷以在休眠时保护内存中的敏感内容。可使用控制台、AWS CLI 或 API，通过 Amazon EC2 为实例启用休眠功能。在实例启动之前，Amazon EC2 会验证根卷是否加密。由于 EBS 根卷已加密，因此休眠期间写入根卷的 RAM 数据亦被加密。

**只有 Amazon EC2 API 会对休眠强制执行静态加密**  
Amazon EC2 仅对您通过 Amazon EC2 启动的休眠验证休眠的先决条件，包括验证根卷加密情况。这包括控制台、AWS CLI 及 API。  
如果您从来宾操作系统中启动休眠（例如 Linux 或 Windows 挂起到磁盘），则这些检查不适用。在这种情况下，务必确保 EBS 根卷已加密。在停止实例之前，操作系统会将内存中的内容持续保存到该卷中。在责任共担模式下，您负责对在来宾操作系统中执行的操作进行静态数据加密。有关更多信息，请参阅*安全支柱——AWSWell-Architected Framework* 中的 [责任共担模型](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/shared-responsibility.html)和[静态数据保护](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/protecting-data-at-rest.html)。

可以使用以下三个选项之一，以确保根卷是加密的 EBS 卷：
+ **EBS encryption by default**（EBS 原定设置加密） - 您可以启用 EBS 原定设置加密，以确保对在您的 AWS 账户中创建的所有新 EBS 卷进行加密。这样，您就可以为实例启用休眠，而无需在实例启动时指定加密意图。有关更多信息，请参阅 [Enable encryption by default](https://docs.aws.amazon.com/ebs/latest/userguide/encryption-by-default.html)。
+ **EBS "single-step" encryption**（EBS“单步”加密） - 您可以从未加密的 AMI 中启动 EBS 支持的加密 EC2 实例，并且还可以同时启用休眠。有关更多信息，请参阅 [将加密与 EBS 支持的 AMI 结合使用](AMIEncryption.md)。
+ **Encrypted AMI**（加密的 AMI） - 您可以使用加密的 AMI 启动实例以启用 EBS 加密。如果 AMI 没有加密的根快照，则可以将其复制到新的 AMI 并请求加密。有关更多信息，请参阅[在复制过程中将未加密映像加密](AMIEncryption.md#copy-unencrypted-to-encrypted)和[复制 AMI](CopyingAMIs.md#ami-copy-steps)。

## EBS 卷类型
<a name="hibernation-prereqs-ebs-volume-types"></a>

EBS 卷必须使用以下 EBS 卷类型之一：
+ 通用型 SSD（`gp2` 和 `gp3`）
+ 预调配 IOPS SSD（`io1` 和 `io2`）

如果选择预调配 IOPS SSD 卷类型，您必须为 EBS 卷预调配合适的 IOPS，以实现休眠状态的最佳性能。有关更多信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 卷类型](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html)。

## 竞价型实例请求
<a name="hibernation-prereqs-spot-request"></a>

对于竞价型实例，以下要求适用：
+ 竞价型实例请求类型必须为 `persistent`。
+ 您不能在竞价型实例请求中指定启动组。
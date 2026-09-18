

# 将 NitroTPM 与 Amazon EC2 实例结合使用的要求
<a name="enable-nitrotpm-prerequisites"></a>

要在启用 NitroTPM 的情况下启动实例，必须满足以下要求。

**Topics**
+ [AMI](#nitrotpm-ami)
+ [实例类型](#nitrotpm-instancetypes)
+ [注意事项](#nitrotpm-considerations)

## AMI
<a name="nitrotpm-ami"></a>

AMI 必须启用了 NitroTPM。

**Linux AMI**  
没有预配置的 AMI。您必须配置自己的 AMI。有关更多信息，请参阅 [为 NitroTPM 启用 Linux AMI](enable-nitrotpm-support-on-ami.md)。

**Windows AMI**  
要查找使用 Microsoft 密钥为 NitroTPM 和 UEFI 安全启动预先配置的 AWS Windows AMI，请参阅《AWS Windows AMI 参考》**中的[查找使用 NitroTPM 和 UEFI 安全启动配置的 Windows Server AMI](https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/ami-windows-tpm.html#ami-windows-tpm-find)。

**注意**  
**操作系统**：AMI 必须包含具有 TPM 2.0 命令响应缓冲区（CRB）驱动程序的操作系统。大多数当前操作系统都包含 TPM 2.0 CRB 驱动程序。  
**UEFI 启动模式**：AMI 必须配置为 UEFI 启动模式。有关更多信息，请参阅 [适用于 Amazon EC2 实例的 UEFI 安全启动](uefi-secure-boot.md)。

## 实例类型
<a name="nitrotpm-instancetypes"></a>

必须使用以下虚拟化实例类型之一：
+ **通用型**：M5、M5a、M5ad、M5d、M5dn、M5n、M5zn、M6a、M6g、M6gd、M6i、M6id、M6idn、M6in、M7a、M7g、M7gd、M7i、M7i-flex、M8a、M8azn、M8g、M8gb、M8gd、M8gn、M8i、M8id、M8i-flex、M8in、M8idn、M8ine、M8ib、M8idb、M9g、M9gd、T3、T3a、T4g
+ **计算优化型**：C5、C5a、C5ad、C5d、C5n、C6a、C6g、C6gd、C6gn、C6i、C6id、C6in、C7a、C7g、C7gd、C7gn、C7i、C7i-flex、C8a、C8g、C8gb、C8gd、C8gn、C8i、C8id、C8i-flex、C8in、C8ine、C8ib、C9g、C9gd
+ **内存优化型**：R5、R5a、R5ad、R5b、R5d、R5dn、R5n、R6a、R6g、R6gd、R6i、R6id、R6idn、R6in、R7a、R7g、R7gd、R7i、R7iz、R8a、R8g、R8gb、R8gd、R8gn、R8i、R8id、R8i-flex、R8in、R8idn、R8ib、R8idb、R9g、R9gd、U7i-6tb、U7i-8tb、U7i-12tb、U7in-16tb、U7in-24tb、U7in-32tb、X2idn、X2iedn、X2iezn、X8g、X8aedz、X8i、z1d
+ **存储优化型**：D3、D3en、I3en、I4i、I7i、I7ie、I8g、I8ge、Im4gn
+ **加速计算型**：F2、G4dn、G5、G6、G6e、G6f、Gr6、Gr6f、G7、G7e、Inf1、Inf2、P5、P5e、P5en、P6-B200、P6-B300、P6e-GB200、Trn2、Trn2u
+ **高性能计算：**Hpc6a、Hpc6id、Hpc8a

## 注意事项
<a name="nitrotpm-considerations"></a>

在使用 NitroTPM 时，请注意以下几点：
+ 使用启用了 NitroTPM 的 AMI 启动实例后，如果要更改实例类型，您选择的新实例类型也必须支持 NitroTPM。
+ 使用基于 NitroTPM 的密钥加密的 BitLocker 卷只能在原始实例上使用。
+ Amazon EC2 控制台中不会显示 NitroTPM 状态。
+ NitroTPM 状态不包括在 [Amazon EBS 快照](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html)中。
+ NitroTPM 状态不包括在 [VM Import/Export](https://docs.aws.amazon.com/vm-import/latest/userguide/) 映像中。
+ AWS Outposts、本地区或 Wavelength 区中不支持 NitroTPM。
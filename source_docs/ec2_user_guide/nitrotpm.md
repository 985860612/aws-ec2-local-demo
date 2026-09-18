

# Amazon EC2 实例的 NitroTPM
<a name="nitrotpm"></a>

Nitro 可信平台模块 (NitroTPM) 是一种虚拟设备，由 [AWS Nitro 系统](https://aws.amazon.com/ec2/nitro/)提供，并且符合 [TPM 2.0 规范](https://trustedcomputinggroup.org/resource/trusted-platform-module-2-0-a-brief-introduction/)。它可以安全地存储用于对实例进行身份验证的构件（例如密码、证书或加密密钥）。NitroTPM 可以生成密钥，并将它们用于加密功能（例如哈希、签名、加密和解密）。

NitroTPM 提供*测量引导*，在此过程中，引导加载程序和操作系统将为每个引导二进制文件创建加密哈希，并将它们与 NitroTPM 内部平台配置寄存器 (PCR) 中之前的值结合起来。借助测量引导，您可以从 NitroTPM 获取签名 PCR 值，然后使用它们向远程实体证明实例的引导软件的完整性。这称为远程*证明*。

借助 NitroTPM，可以使用特定 PCR 值标记密钥和秘密，这样，如果 PCR 的值进而实例完整性发生变化，就永远无法访问它们。这种特殊形式的有条件访问称为*密封和解封*。操作系统技术，如 [BitLocker](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/)，可以使用 NitroTPM 来密封驱动器解密密钥，以便仅在操作系统正确引导并处于已知良好状态时才能解密驱动器。

要使用 NitroTPM，您必须选择一个配置了 NitroTPM 支持的[亚马逊机器映像](AMIs.md)（AMI），然后使用该 AMI 启动[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。您可以选择亚马逊预构建的 AMI，也可以自己创建 AMI。

**定价**  
使用 NitroTPM 不会产生额外成本。您仅需为实际使用的底层资源付费。

**Topics**
+ [要求](enable-nitrotpm-prerequisites.md)
+ [为 NitroTPM 启用 Linux AMI](enable-nitrotpm-support-on-ami.md)
+ [验证是否为 NitroTPM 启用了 AMI](verify-nitrotpm-support-on-ami.md)
+ [启用或停止使用 NitroTPM](nitrotpm-instance.md)
+ [验证是否为 NitroTPM 启用了实例](verify-nitrotpm-support-on-instance.md)
+ [检索公有认可密钥](retrieve-ekpub.md)
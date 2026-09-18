

# Amazon EC2 上 UEFI 安全启动的要求
<a name="launch-instance-with-uefi-sb"></a>

当您使用支持的 AMI 和支持的实例类型[启动 Amazon EC2 实例](LaunchingAndUsingInstances.md)时，该实例将根据其 UEFI 安全启动数据库自动验证 UEFI 启动二进制文件。无需其他配置。您还可以在启动后在实例上配置 UEFI 安全启动。

**注意**  
UEFI 安全启动可以保护您的实例及其操作系统免受启动流程修改的影响。如果从启用了 UEFI 安全引导的源 AMI 创建新的 AMI，并在复制过程中修改了某些参数，如更改了 AMI 中的 `UefiData`，则可以禁用 UEFI 安全引导。

**Topics**
+ [支持的 AMI](#uefi-amis)
+ [支持的实例类型](#uefi-instance)

## 支持的 AMI
<a name="uefi-amis"></a>

**Linux AMI**  
要启动 Linux 实例，Linux AMI 必须启用 UEFI 安全引导。

从 AL2023 2023.1 版本开始，Amazon Linux 支持 UEFI 安全启动。但是，默认 AMI 中不会启用 UEFI 安全启动。有关更多信息，请参阅《AL2023 User Guide》**中的 [UEFI Secure Boot](https://docs.aws.amazon.com/linux/al2023/ug/uefi-secure-boot.html)。旧版本的 Amazon Linux AMI 不会为 UEFI 安全启动启用。要使用受支持的 AMI，您必须在自己的 Linux AMI 上执行多个配置步骤。有关更多信息，请参阅 [使用自定义 UEFI 安全启动密钥创建 Linux AMI](create-ami-with-uefi-secure-boot.md)。

**Windows AMI**  
要启动 Windows 实例，Windows AMI 必须启用 UEFI 安全引导。要查找使用 Microsoft 密钥为 UEFI 安全启动预先配置的 AWS Windows AMI，请参阅《AWS Windows AMIs Reference》**中的 [Find Windows Server AMIs configured with NitroTPM and UEFI Secure Boot](https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/ami-windows-tpm.html#ami-windows-tpm-find)。

目前，我们不支持使用 [import-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/import-image.html) 命令导入包含 UEFI 安全启动的 Windows。

## 支持的实例类型
<a name="uefi-instance"></a>

所有支持 UEFI 的虚拟化实例类型也支持 UEFI 安全启动。有关支持 UEFI 安全引导的实例类型，请参阅 [UEFI 启动模式的要求](launch-instance-boot-mode.md)。

**注意**  
裸机实例类型不支持 UEFI 安全启动。
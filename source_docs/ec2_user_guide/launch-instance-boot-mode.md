

# 在 UEFI 启动模式下启动 EC2 实例的要求
<a name="launch-instance-boot-mode"></a>

实例的启动模式由 AMI 的配置、其中包含的操作系统和实例类型决定。要在 UEFI 启动模式下启动实例，必须满足以下要求。

**AMI**  
AMI 必须按如下方式为 UEFI 配置：  
+ **操作系统** – AMI 中包含的操作系统必须配置为使用 UEFI；否则，实例启动将失败。有关更多信息，请参阅 [确定 EC2 实例操作系统的启动模式](os-boot-mode.md)。
+ **AMI 启动模式参数** – AMI 的启动模式参数必须设置为 `uefi` 或 `uefi-preferred`。有关更多信息，请参阅 [确定 Amazon EC2 AMI 的启动模式参数](ami-boot-mode.md)。
**Linux** – 以下 Linux AMI 支持 UEFI：  
+ Amazon Linux 2023
+ Amazon Linux 2（仅适用于 Graviton 实例类型）
至于其他 Linux AMI，则必须[配置 AMI](set-ami-boot-mode.md)，通过 [VM Import/Export](https://docs.aws.amazon.com/vm-import/latest/userguide/) 导入 AMI，或通过 [CloudEndure](https://docs.cloudendure.com/) 导入 AMI。  
**Windows**：以下 Windows AMI 支持 UEFI：  
+ Windows\_Server-2025-\*（带有 `BIOS-` 名称前缀的 AMI 除外）
+ TPM-Windows\_Server-2022-English-Full-Base
+ TPM-Windows\_Server-2022-English-Core-Base
+ TPM-Windows\_Server-2019-English-Full-Base
+ TPM-Windows\_Server-2019-English-Core-Base
+ TPM-Windows\_Server-2016-English-Full-Base
+ TPM-Windows\_Server-2016-English-Core-Base

**实例类型**  
所有基于 AWS Nitro System 构建的实例都支持 UEFI 和传统 BIOS，下列实例除外：裸机实例、DL1、G4ad、P4、u-3tb1、u-6tb1、u-9tb1、u-12tb1、u-18tb1、u-24tb1 和 VT1。有关更多信息，请参阅 [确定 EC2 实例类型支持的启动模式](instance-type-boot-mode.md)。

下表显示，实例的启动模式（由**生成的实例启动模式**列表示）由 AMI 的启动模式参数（第 1 列）、AMI 中包含的操作系统的启动模式配置（第 2 列）和实例类型的启动模式支持（第 3 列）共同决定。


| AMI 启动模式参数 | 操作系统启动模式配置 | 实例类型启动模式支持 | 生成的实例启动模式 | 
| --- | --- | --- | --- | 
| UEFI | UEFI | UEFI | UEFI | 
| 传统 BIOS | 传统 BIOS | 传统 BIOS | 传统 BIOS | 
| UEFI Preferred | UEFI | UEFI | UEFI | 
| UEFI Preferred | UEFI | UEFI 和传统 BIOS | UEFI | 
| UEFI Preferred | 传统 BIOS | 传统 BIOS | 传统 BIOS | 
| UEFI Preferred | 传统 BIOS | UEFI 和传统 BIOS | 传统 BIOS | 
| 未指定启动模式 – ARM | UEFI | UEFI | UEFI | 
| 未指定启动模式 – x86 | 传统 BIOS | UEFI 和传统 BIOS | 传统 BIOS | 


# 使用 Amazon EC2 启动模式的实例启动行为
<a name="ami-boot"></a>

电脑启动时，它运行的第一个软件负责初始化平台并为操作系统执行特定于平台的操作提供界面。

在 Amazon EC2 中，支持启动模式软件的两种变体包括：统一可扩展固件接口（UEFI）和传统 BIOS。

**AMI 上可能的启动模式参数**  
AMI 可以具有以下任一启动模式参数值：`uefi`、`legacy-bios` 或 `uefi-preferred`。AMI 启动模式参数是可选项。对于不带启动模式参数的 AMI，从这些 AMI 启动的实例将使用实例类型的默认启动模式值。

**AMI 启动模式参数的用途**  
AMI 启动模式参数向 Amazon EC2 发出信号，指明启动实例时要使用哪种启动模式。当启动模式参数设置为 `uefi` 时，EC2 将尝试在 UEFI 上启动实例。如果操作系统未配置为支持 UEFI，则实例启动可能失败。

**UEFI Preferred 启动模式参数**  
您可以使用 `uefi-preferred` 启动模式参数创建同时支持 UEFI 和传统 BIOS 的 AMI。当启动模式参数设置为 `uefi-preferred` 并且实例类型支持 UEFI 时，实例会在 UEFI 上启动。如果实例类型不支持 UEFI，实例会在传统 BIOS 上启动。

**警告**  
UEFI 安全启动等部分功能仅适用于在 UEFI 上启动的实例。将 `uefi-preferred` AMI 启动模式参数与不支持 UEFI 的实例类型结合使用时，实例将以传统 BIOS 启动，并禁用 UEFI 相关功能。如果您依赖于 UEFI 相关功能的可用性，请将 AMI 启动模式参数设置为 `uefi`。

**实例类型的默认启动模式**
+ Graviton 实例类型：UEFI
+ Intel 和 AMD 实例类型：传统 BIOS

**区域支持**  
Wavelength 区中不支持 UEFI 启动。

**Topics**
+ [在 UEFI 启动模式下启动 EC2 实例的要求](launch-instance-boot-mode.md)
+ [确定 Amazon EC2 AMI 的启动模式参数](ami-boot-mode.md)
+ [确定 EC2 实例类型支持的启动模式](instance-type-boot-mode.md)
+ [确定 EC2 实例的启动模式](instance-boot-mode.md)
+ [确定 EC2 实例操作系统的启动模式](os-boot-mode.md)
+ [设置 Amazon EC2 AMI 的启动模式](set-ami-boot-mode.md)
+ [Amazon EC2 实例的 UEFI 变量](uefi-variables.md)
+ [适用于 Amazon EC2 实例的 UEFI 安全启动](uefi-secure-boot.md)
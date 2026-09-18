

# 配置您的 Amazon EC2 Windows 实例
<a name="ec2-windows-instances"></a>

启动 Windows 实例后，您可以以管理员身份登录，以执行 Windows 功能和系统设置的其他配置。[EC2 Windows 故障排除实用程序](windows-troubleshooting-utils.md) 可以帮助您排查实例上的问题。

您可以按如下方式配置 Windows 启动代理和其他 Windows 特定功能。

**[Windows 启动代理](configure-launch-agents.md)**  
每个 AWS Windows AMI（以及 AWS Marketplace 上提供的许多其他 AMI）都包含一个已预先配置默认设置的 Windows 启动代理。启动代理在实例启动期间执行任务，并可在实例停止并稍后启动或重新启动时运行。

**[适用于 Windows 的 EC2 快速启动](win-ami-config-fast-launch.md)**  
必须对每个 Amazon EC2 Windows 实例执行标准的 Windows 操作系统（OS）启动步骤，其中包括多次重启，通常需要 15 分钟或更长时间才能完成。启用了 EC2 Fast Launch 功能的 Amazon EC2 Windows Server AMI 会提前完成其中一些步骤并重启，以便缩短启动实例所需的时间。

## Windows 特定的系统设置
<a name="windows-specific-system-settings"></a>

以下列表包括一些仅适用于 Windows 操作系统的系统设置：

**[更改 Windows 管理员密码](ec2-windows-passwords.md)**  
在连接到 Windows 实例时，您必须指定有权访问该实例的用户账户以及密码。首次连接到实例时，必须使用管理员账户并提供默认密码。在首次连接到实例后，建议您更改管理员密码的默认值。

**[添加 Windows 系统组件](windows-optional-components.md)**  
Windows Server 操作系统包括许多可选组件。在每个 AWS Windows Server AMI 中包含所有可选组件是不实际的。作为替代，我们提供安装介质 EBS 快照，这些快照具有在您的 Windows 实例上配置或安装组件所需的文件。

**[在 Windows 上安装 WSL](install-wsl-on-ec2-windows-instance.md)**  
适用于 Linux 的 Windows 子系统（WSL）可以免费下载并在 Windows 实例上安装。安装 WSL 后，除传统的 Windows 桌面系统外，您可以直接在 Windows 实例上运行原生的 Linux 命令行工具，并使用 Linux 工具来编写脚本。您可以在单个 Windows 实例上轻松切换 Linux 和 Windows 系统，这在开发环境中可能非常实用。

## AWS适用于 Windows 实例的 设备驱动程序
<a name="windows-specific-device-drivers"></a>

可以为 Windows 实例更新 AWS 设备驱动程序。有关更多信息，请参阅 [管理 EC2 实例的设备驱动程序](manage-device-drivers.md)。

下表按 Windows 版本总结了[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)支持的驱动程序。


| 版本 | 存储驱动程序 | 增强的网络驱动程序 | 
| --- | --- | --- | 
| Windows Server 2025 | AWS NVMe 最新版本 | ENA 最新版本 | 
| Windows Server 2022 | AWS NVMe 最新版本 | ENA 最新版本 | 
| Windows Server 2019 | AWS NVMe 最新版本 | ENA 最新版本 | 
| Windows Server 2016 | AWS NVMe 最新版本 | ENA 最新版本 | 
| Windows Server 2012 R2 | AWS NVMe 版本 1.5.1 | ENA 版本 2.6.0 | 
| Windows Server 2008 R2 | AWS NVMe 版本 1.3.2 | ENA 版本 2.2.3 | 

下表按 Windows 版本总结了[基于 Xen 的实例](instance-types.md#instance-hypervisor-type)支持的驱动程序。


| 版本 | 存储驱动程序 | 增强的网络驱动程序 | 
| --- | --- | --- | 
| Windows Server 2022 | AWS PV 最新版本 |  + ENA 最新版本 1<br />+ Intel VF 2<br />+ AWS PV 最新版本 3  | 
| Windows Server 2019 | AWS PV 最新版本 |  + ENA 最新版本 1<br />+ Intel VF 2<br />+ AWS PV 最新版本 3  | 
| Windows Server 2016 | AWS PV 最新版本 |  + ENA 最新版本 1<br />+ Intel VF 2<br />+ AWS PV 最新版本 3  | 
| Windows Server 2012 R2 | AWS PV 版本 8.4.3 |  + ENA 版本 2.6.0 1<br />+ Intel VF 2<br />+ AWS PV 版本 8.4.3 3  | 
| Windows Server 2008 R2 | AWS PV 版本 8.3.5 |  + ENA 版本 2.2.3 1<br />+ Intel VF 2<br />+ AWS PV 版本 8.3.5 3  | 

1 适用于实例类型 G3、H1、I3、`m4.16xlarge`、P3、P3dn 和 R4。

2 适用于实例类型 C3、C4、D2、I2、M4（`m4.16xlarge` 除外）和 R3。

3 适用于实例类型 C1、M1、M2、M3、T1、T2、X1 和 X1e。


# AWS VSS 解决方案版本历史记录
<a name="vss-comps-history"></a>

此页面包含 AWS VSS 组件程序包的版本发行说明，以及每个受支持的 Windows Server 版本的组件和脚本版本要求。

**Topics**
+ [AwsVssComponents 包版本](#AwsVssComponents-history)
+ [Windows 操作系统版本支持](#windows-version-support)

## AwsVssComponents 包版本
<a name="AwsVssComponents-history"></a>

下表介绍 AWS VSS 组件包的已发布版本。


| Version | 详细信息 | 发行日期 | 可下载 | 
| --- | --- | --- | --- | 
| 2.5.2 |  +  增加了对 `aws-eusc` 分区端点的支持。 <br />+  更新了 AWS SDK 以纳入安全更新。   | 2026 年 9 月 2 日 | 是 | 
| 2.5.1 | 修复了指定目标数据库参数时 SQL 数据库还原可能失败的情况。 | 2025 年 3 月 13 日 | 是 | 
| 2.5.0 |  +  增加了读取 VSS 元数据文件和在实例上恢复 Microsoft SQL Server 数据库的功能。有关更多信息，请参阅《Microsoft SQL Server on Amazon EC2 User Guide》**中的 [Restore from VSS based snapshots](https://docs.aws.amazon.com/sql-server-ec2/latest/userguide/ms-ssdb-ec2-restore-vss.html)。 <br />+  在安装或升级 `AwsVssComponents` 软件包时增加了对就地更新选项的支持。   | 2025 年 1 月 17 日 | 是 | 
| 2.4.0 | 增加了在创建快照时保存 VSS 元数据文件的功能。要启用此功能，请参阅 [Systems Manager VSS 快照文档的参数](create-vss-snapshots-ssm.md#create-vss-snapshots-ssm-params) 中的 SaveVssMetadata。 | 2024 年 10 月 7 日 | 是 | 
| 2.3.3 | 已更新 VSS 代理以确保在快照创建期间使用 `Ec2VssProvider`。 | 2024 年 6 月 25 日 | 是 | 
| 2.3.2 | 修复了卸载时未删除 VSS 提供程序注册的情况。 | 2024 年 5 月 9 日 | 是 | 
| 2.3.1 | 添加了新的默认标签 `AwsVssConfig` 以识别 AWS VSS 创建的快照和 AMI。 | 2024 年 3 月 7 日 | 是 | 
| 2.2.1 |  +  增加了对使用 `DescribeInstanceAttribute` API 的支持。 <br />+  错误修复与可靠性改进。 <br />+  已放弃对 Windows Server 2012 和 2012 R2 的支持。AWSVSS 组件版本 2.2.1 在 Windows Server 2012 和 2012 R2 上的安装将失败。AWSVSS 组件版本 2.1.0 是最后一个支持 Windows Server 2012 和 2012 R2 的版本。   | 2024 年 1 月 18 日 | 是 | 
| 2.1.0 | 增加了对使用 `CreateSnapshots` API 的支持。 | 2023 年 11 月 6 日 | 是 | 
| 2.0.1 | 增加了对使用 WinHTTP 代理设置的支持。 | 2023 年 10 月 26 日 | 否 | 
| 2.0.0 | AWS VSS 组件增加了创建快照和 AMI 的功能，从而实现了与 PowerShell 模块日志记录、脚本块日志记录和转录功能的兼容。 | 2023 年 4 月 28 日 | 否 | 
| 1.3.2.0 | 修复了未正确报告安装失败的情况。 | 2022 年 5 月 10 日 | 否 | 
| 1.3.1.0 |  +  修复了域控制器上与 NTDS VSS 写入器日志记录错误相关的快照失败。 <br />+  修复了卸载版本 1.0 VSS 提供程序时的 VSS 代理错误。   | 2020 年 2 月 6 日 | 是 | 
| 1.3.00 |  +  通过减少不需要的详细程度来改进日志记录。 <br />+  修复了安装过程中的区域化问题。 <br />+  修正了某些供应商注册错误条件的返回代码。 <br />+  修复了各种安装问题。   | 2019 年 3 月 19 日 | 否 | 
| 1.2.00 |  +  将命令行参数 `-nw`（无写入器）和 `-copy`（仅复制）添加到代理。 <br />+  修复了由不正确的内存分配调用引起的 EventLog 错误。   | 2018 年 11 月 15 日 | 否 | 
| 1.1 | 修复了 AWS VSS 组件被错误用作默认 Windows 备份和还原提供程序的问题。 | 2017 年 12 月 12 日 | 否 | 
| 1.0 | 初始版本。 | 2017 年 11 月 20 日 | 否 | 

## Windows 操作系统版本支持
<a name="windows-version-support"></a>

下表显示了应在 Amazon EC2 上每个版本的 Windows Server 上运行的 AWS VSS 解决方案版本。


| Windows Server 版本 | AwsVssComponents 版本 | AWSEC2-VssInstallAndSnapshot 版本名称 | AWSEC2-CreateVssSnapshot 版本名称 | 
| --- | --- | --- | --- | 
| Windows Server 2025 | 默认 | 默认 | 默认 | 
| Windows Server 2022 | 默认 | 默认 | 默认 | 
| Windows Server 2019 | 默认 | 默认 | 默认 | 
| Windows Server 2016 | 默认 | 默认 | 默认 | 
| Windows Server 2012 R2 | 2.1.0 | 不支持 | 2012R2 | 
| Windows Server 2012 | 2.1.0 | 不支持 | 2012R2 | 
| Windows Server 2008 R2 | 1.3.1.0 | 不支持 | 2008R2 | 
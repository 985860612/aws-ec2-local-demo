

# 对基于 Windows VSS 的 EBS 快照进行问题排查
<a name="application-consistent-snapshots-troubleshooting"></a>

在尝试任何其他故障排除步骤之前，我们建议您验证以下详细信息。
+ 确保已满足所有 [创建基于 Windows VSS 的 EBS 快照的先决条件](application-consistent-snapshots-prereqs.md)。
+ 确认操作系统使用的是最新 [Windows 操作系统版本支持](vss-comps-history.md#windows-version-support) 的 `AwsVssComponents` 软件包。您发现的问题可能已在较新的版本中得到解决。

**Topics**
+ [检查日志文件](#general-log-files)
+ [收集其他诊断日志](#vss-ts-collect-diagnostic-logs)
+ [在已配置代理的实例上使用 VSS](#general-using-vss-with-proxy)
+ [错误：解冻管道连接超时、解冻时出错、等待 VSS 冻结超时或其他超时错误](#error-thaw)
+ [错误：无法调用方法。在此语言模式下，仅核心类型支持方法调用。](#error-invoke)

## 检查日志文件
<a name="general-log-files"></a>

如果您在创建基于 VSS 的 EBS 快照时遇到问题或收到错误消息，可以在 Systems Manager 控制台中查看命令输出。

对于可创建 VSS 快照的 Systems Manager 文档，可在运行时将 `CollectDiagnosticLogs` 参数设置为“`True`”。当 `CollectDiagnosticLogs` 参数设置为“`True`”时，VSS 会收集其他日志以帮助调试。有关更多信息，请参阅 [收集其他诊断日志](#vss-ts-collect-diagnostic-logs)。

如果您收集诊断日志，Systems Manager 文档会将其存储在实例的以下位置：`C:\ProgramData\Amazon\AwsVss\Logs\{{timestamp}}.zip`。`CollectDiagnosticLogs` 参数的默认值为“`False`”。

**注意**  
有关调试的其他帮助，可将 `.zip` 文件发送到 支持。

无论您是否收集诊断日志，以下其他日志均可访问：
+ `%ProgramData%\Amazon\SSM\InstanceData\{{InstanceID}}\document\orchestration\{{SSMCommandID}}\awsrunPowerShellScript\runPowerShellScript\stdout`
+ `%ProgramData%\Amazon\SSM\InstanceData\{{InstanceID}}\document\orchestration\{{SSMCommandID}}\awsrunPowerShellScript\runPowerShellScript\stderr`

您还可以打开事件查看器 Windows 应用程序，然后选择 **Windows 日志**、**应用程序**以查看其他日志。要专门查看来自 EC2 Windows VSS 提供程序和卷影复制服务的事件，请根据条款 **Ec2VssSoftwareProvider** 和 **VSS** 按**源**进行筛选。

如果您将 Systems Manager 与 VPC 端点结合使用，并且 Systems Manager [send-command](https://docs.aws.amazon.com/cli/latest/reference/ssm/send-command.html) API 操作（控制台中的 **Run Command**）失败，请确认您是否正确配置了如下端点：**com.amazonaws.{{region}}.ec2**。

如果没有定义 Amazon EC2 端点，枚举附加的 EBS 卷的调用将会失败，进而导致 Systems Manager 命令失败。有关使用 Systems Manager 设置 VPC 端点的更多信息，请参阅《AWS Systems Manager 用户指南》**中的[创建 Virtual Private Cloud 端点](https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html)。

## 收集其他诊断日志
<a name="vss-ts-collect-diagnostic-logs"></a>

要在通过 Systems Manager 发送命令以运行 VSS 快照文档时收集其他诊断日志，请在运行时将 `CollectDiagnosticLogs` 输入参数设置为“`True`”。建议您在排查问题时将该参数设置为“`True`”。

要查看命令行示例，请选择以下选项卡之一。

------
#### [ AWS CLI ]

以下示例将在 AWS CLI 中运行 `AWSEC2-CreateVssSnapshot` Systems Manager 文档：

```
aws ssm send-command \ 
    --document-name "{{AWSEC2-CreateVssSnapshot}}" \
    --instance-ids "{{i-1234567890abcdef0}}" \
    --parameters '{"description":["{{Example - create diagnostic logs at runtime.}}"],"tags":["Key={{tag_name}},Value={{tag_value}}"],"CollectDiagnosticLogs":["True"]}'
```

------
#### [ PowerShell ]

以下示例将在 PowerShell 中运行 `AWSEC2-CreateVssSnapshot` Systems Manager 文档：

```
Send-SSMCommand `
    -DocumentName "{{AWSEC2-CreateVssSnapshot}}" `
    -InstanceId "{{i-1234567890abcdef0}}" `
    -Parameter @{'description'='{{Example - create diagnostic logs at runtime.}}';'tags'='Key={{tag_name}},Value={{tag_value}}';'CollectDiagnosticLogs'='True'}
```

------

## 在已配置代理的实例上使用 VSS
<a name="general-using-vss-with-proxy"></a>

如果在使用代理访问 EC2 端点的实例上创建基于 VSS 的 EBS 快照时遇到问题，请验证实例上的以下设置：
+ 验证是否配置代理，以便以 SYSTEM 身份运行的 AWS Tools for Windows PowerShell 可以访问实例区域和 IMDS 中的 EC2 服务端点。
+ 要支持使用系统配置的 WinHTTP 代理，请确保实例上已安装最新的 `AwsVssComponents` 版本。有关配置 WinHTTP 代理的更多信息，请参阅 Microsoft 网站上的 [Windows 超文本传输协议（WINHTTP）的 Netsh 命令](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-r2-and-2008/cc731131(v=ws.10))。

## 错误：解冻管道连接超时、解冻时出错、等待 VSS 冻结超时或其他超时错误
<a name="error-thaw"></a>

EC2 Windows VSS 提供程序可能会由于实例上的活动或服务阻止基于 VSS 的快照及时继续而超时。Windows VSS 框架提供了一个不可配置的 10 秒钟窗口，在此期间暂停与文件系统的通信。在此期间，对卷执行 `AWSEC2-CreateVssSnapshot` 快照。

以下问题可能会导致 EC2 Windows VSS Provider 在快照期间受到时间限制：
+ 对卷的 I/O 过多
+ 实例上 EC2 API 的响应速度缓慢
+ 片段化的卷
+ 与某些杀毒软件不兼容
+ VSS 应用程序编写者的问题
+ 当为大量 PowerShell 模块启用模块日志记录时，这样可能会导致 PowerShell 脚本运行缓慢

运行 `AWSEC2-CreateVssSnapshot` 命令文档时出现的大多数超时问题，与备份时实例上的工作负载过高有关。以下操作可以帮助您成功拍摄快照：
+ 重试 `AWSEC2-CreateVssSnapshot` 命令以查看快照尝试是否成功。如果在某些情况下重试成功，减少实例负载可能会使快照成功几率更高。
+ 等待片刻，让实例上的工作负载减少，然后重试该 `AWSEC2-CreateVssSnapshot` 命令。或者，当已知实例处于低压力时，您也可以尝试拍摄快照。
+ 在系统上的杀毒软件关闭时尝试拍摄 VSS 快照。如果这样解决了问题，请参阅杀毒软件说明并将其配置为允许 VSS 快照。
+ 如果在运行快照的同一区域内的账户中有大量 Amazon EC2 API 调用，则 API 节流可能会延迟快照操作。要降低节流带来的影响，请使用最新的 `AwsVssComponents` 程序包。此软件包使用 EC2 `CreateSnapshots` API 操作，以减少变更操作的数量，例如按卷创建快照和添加标签。
+ 如果同时运行多个 `AWSEC2-CreateVssSnapshot` 命令脚本，则可以采取以下步骤来减少并发问题。
  + 考虑在 API 活动较低的时段安排快照。
  + 如果在 Systems Manager 控制台中（或 API **SendCommand** 中）使用 **Run Command** 来运行命令脚本，则可以使用 Systems Manager 速率控制来减少并发。

    还可以使用 Systems Manager 速率控制，来减少诸如 AWS Backup 等服务（使用 Systems Manager 运行命令脚本）的并发。
+ 在 Shell 中运行命令 `vssadmin list writers`，看它是否在系统上任何写入程序的**最后一个错误**字段中报告任何错误。如果有写入程序报告**超时**错误，请考虑在实例负载较小时重新拍摄快照。
+ 当使用较小的实例类型（例如，{{t2 \| t3 \| t3a}}.nano 或 {{t2 \| t3 \| t3a}}.micro）时，可能会由于内存和 CPU 限制而出现超时。以下操作可能有助于减少超时问题。
  + 在拍摄快照之前，请尝试关闭内存或 CPU 密集型应用程序。
  + 尝试在实例活动较低的时段拍摄快照。

## 错误：无法调用方法。在此语言模式下，仅核心类型支持方法调用。
<a name="error-invoke"></a>

PowerShell 语言模式未设置为 `FullLanguage` 时，会发生此错误。`AWSEC2-CreateVssSnapshot` SSM 文档要求将 PowerShell 配置为 `FullLanguage` 模式。

要验证语言模式，请在 PowerShell 控制台中的实例上运行以下命令：

```
$ExecutionContext.SessionState.LanguageMode
```

有关语言模式的更多信息，请参阅 Microsoft 文档中的 [about\_Language\_Modes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_modes)。


# 创建基于 Windows VSS 的 EBS 快照的先决条件
<a name="application-consistent-snapshots-prereqs"></a>

可以使用 Systems Manager Run Command、AWS Backup 或 Amazon Data Lifecycle Manager 创建基于 VSS 的 EBS 快照。以下是使用两种解决方案的先决条件。

**[系统要求](#vss-sys-reqs)**  
确保您的 EC2 Windows 实例满足创建基于 VSS 的快照的所有系统要求，包括支持的 Windows 操作系统版本、.NET 框架、PowerShell、AWS Tools for Windows PowerShell 和 AWS Systems Manager 代理版本。

**[IAM 权限](vss-iam-reqs.md)**  
附加到您的 Amazon EC2 Windows 实例的 IAM 角色必须有使用 VSS 创建应用程序一致性快照的权限。要授予必要的权限，您可以将 `AWSEC2VssSnapshotPolicy` 托管策略附加到实例配置文件。

**[VSS 组件](application-consistent-snapshots-getting-started.md)**  
要在 Windows 操作系统上创建应用程序一致性快照，必须在实例上安装 `AwsVssComponents` 软件包。此软件包包含一个实例 EC2 VSS 代理，它充当 VSS 请求程序以及 EBS 卷的 EC2 VSS 提供程序。

## 系统要求
<a name="vss-sys-reqs"></a>

**安装 Systems Manager 代理**  
VSS 由 Systems Manager Agent 使用 PowerShell 编排。请确保您已在您的 Amazon EC2 实例上安装了 SSM Agent 版本 `3.0.502.0` 或更高版本。如果使用的是较旧版本的 SSM Agent，请使用 Run Command 进行更新。有关更多信息，请参阅《AWS Systems Manager 用户指南**》中的[为 Amazon EC2 实例设置 Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-ec2.html) 和[在适用于 Windows Server 的 Amazon EC2 实例上使用 SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-windows.html)。

**Amazon EC2 Windows 实例要求**  
运行 Windows Server 2016 及更高版本的实例可支持基于 VSS 的 EBS 快照。

**.NET Framework 版本**  
`AwsVssComponents` 包需要 .NET Framework 版本 `4.6` 及更高版本。Windows Server 2016 之前的 Windows 操作系统版本默认使用早期版本的 .NET Framework。如果实例使用早期版本的 .NET Framework，则必须使用 Windows Update 安装 `4.6` 或更高版本。

**AWS Tools for Windows PowerShell 版本**  
确保实例运行的是版本 `3.3.48.0` 或更高版本的 AWS Tools for Windows PowerShell。要检查版本，请在 PowerShell 终端中的实例上运行以下命令。  

```
C:\> Get-AWSPowerShellVersion
```
如果您需要在实例上更新 AWS Tools for Windows PowerShell，请参阅**《AWS Tools for PowerShell 用户指南》中的[安装 AWS Tools for Windows PowerShell](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-getting-set-up-windows.html)。

**Windows Powershell 版本**  
确保您的实例运行的是 Windows PowerShell 主要版本 `3`、`4` 或 `5`。要检查版本，请在 PowerShell 终端中的实例上运行以下命令。  

```
C:\> $PSVersionTable.PSVersion
```

**PowerShell 语言模式**  
确保实例将 PowerShell 语言模式设置为 `FullLanguage`。有关更多信息，请参阅 Microsoft 文档中的 [about\_Language\_Modes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_modes?view=powershell-7.3)。
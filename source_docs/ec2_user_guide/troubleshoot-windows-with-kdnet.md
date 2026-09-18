

# 通过网络对 Windows 实例进行内核调试
<a name="troubleshoot-windows-with-kdnet"></a>

适用于弹性网络适配器（ENA）的 KDNET 可扩展性模块是一个硬件驱动程序支持层，它借助 Amazon Elastic Compute Cloud 实例上的 ENA，支持通过网络对 Windows 进行内核调试。您可以将可扩展性模块与 Windows 调试程序（WinDbg）结合使用，对运行 Windows 的 EC2 实例进行内核级调试。

内核调试可帮助您诊断并解决 EC2 Windows 实例上的低级操作系统问题，例如蓝屏错误（BSOD）、驱动程序故障和启动问题。

**Topics**
+ [前提条件](#kdnet-prerequisites)
+ [步骤 1：在调试主机上安装 Windows 调试工具](#kdnet-step1-install-debugging-tools)
+ [步骤 2：设置调试目标](#kdnet-step2-setup-debug-target)
+ [步骤 3：在调试主机上启动调试会话](#kdnet-step3-start-debugging-session)
+ [步骤 4：重新启动调试目标](#kdnet-step4-reboot-debug-target)
+ [调试后清理调试设置](#kdnet-clean-up)
+ [限制](#kdnet-limitations)
+ [附加说明](#kdnet-additional-notes)

## 前提条件
<a name="kdnet-prerequisites"></a>

在开始之前，请确保您具有以下各项：

同一子网中的两个 EC2 Windows 实例：
+ 一个**调试主机**实例：运行 Windows 调试程序（WinDbg）的实例。
+ 一个**调试目标**实例：要调试的实例。

有关启动实例的更多信息，请参阅 [开始使用 Amazon EC2](EC2_GetStarted.md)。

主机和目标实例的安全组必须允许用于调试 KDNET 的端口上的入站和出站 UDP 流量（建议范围：50000 – 50039）。设置此规则的最简单方法是创建一个安全组，添加入站规则允许来自自身的 UDP 流量作为来源，然后将该安全组附加到两个实例。有关更多信息，请参阅 *Amazon VPC 用户指南*中的[安全组规则](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html)。

调试目标实例必须运行以下 Windows 版本之一（或更高版本）：
+ Windows Server 2025，内部版本号 26100.7462（2025 年 12 月补丁）
+ Windows 11 24H2，内部版本号 26100.7309
+ Windows 11 25H2，内部版本号 26200.7309

**注意**  
适用于 ENA 的 KDNET 可扩展性模块作为 Windows 的一部分分发，只能通过 Windows 每月累积更新进行更新。建议在调试目标上安装最新的 Windows 知识库，以确保您拥有最新的模块版本。  
要验证调试目标上是否存在模块，请在提升权限的 PowerShell 会话中运行以下命令：  

```
Test-Path C:\Windows\system32\kd_02_1d0f.dll
```
如果命令返回 `True`，则模块可用。

## 步骤 1：在调试主机上安装 Windows 调试工具
<a name="kdnet-step1-install-debugging-tools"></a>

在调试主机实例上，通过在 PowerShell 会话中运行以下命令来安装 Windows 调试工具：

```
winget install microsoft.windbg
```

有关详细的安装说明，请参阅 Microsoft 文档中的 [Install the Windows Debugger](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/)。

安装完成后，通过在 PowerShell 会话中运行以下命令来验证调试程序是否正常工作：

```
windbgx
```

WinDbg 窗口应该会打开。如果打开，则说明安装成功，您可以关闭该窗口。

## 步骤 2：设置调试目标
<a name="kdnet-step2-setup-debug-target"></a>

**注意**  
当内核调试处于活动状态时，用于调试会话的 ENA 设备将仅用于调试程序流量。如果需要在调试期间保持调试目标实例的互联网访问，请在开始之前将第二个 ENA 附加到实例。

在调试目标上，打开提升权限的 PowerShell 会话，按照以下步骤配置内核调试。

运行以下命令，列出附加到实例的 ENA 适配器的总线、设备、功能编号：

```
Get-NetAdapter -Physical |
    Where-Object -Property PnPDeviceID -Match -Value '^PCI\\VEN_1D0F&DEV_EC2[01]&' |
    Get-NetAdapterHardwareInfo |
    Select-Object InterfaceDescription, BusNumber, DeviceNumber, FunctionNumber |
    Format-List
```

### 如果多个 ENA 适配器附加到实例
<a name="kdnet-multiple-ena-adapters"></a>

如果多个 ENA 适配器附加到实例，请使用以下命令将每个物理适配器映射到其私有 IP 地址。您可以在 AWS 管理控制台中的 **EC2 → 实例 → [实例 ID] → 联网 → 网络接口**下交叉引用这些详细信息。这有助于您将特定的网络接口 ID、私有 IP 和安全组与操作系统级适配器关联起来，以便进行有针对性的调试。

```
Get-NetAdapter -Physical |
    Where-Object PnPDeviceID -Match '^PCI\\VEN_1D0F&DEV_EC2[01]&' |
    ForEach-Object {
        $adapter = $_
        $hwInfo = $adapter | Get-NetAdapterHardwareInfo
        $ipInfo = Get-NetIPAddress -InterfaceIndex $adapter.InterfaceIndex -AddressFamily IPv4
        [PSCustomObject]@{
            InterfaceDescription = $adapter.InterfaceDescription
            IPAddress            = $ipInfo.IPAddress
            BusNumber            = $hwInfo.BusNumber
            DeviceNumber         = $hwInfo.DeviceNumber
            FunctionNumber       = $hwInfo.FunctionNumber
        }
    } | Format-List
```

记下输出中用于调试的 ENA 适配器的 `BusNumber`、`DeviceNumber` 和 `FunctionNumber` 值。

运行以下命令来配置内核调试。将占位符值替换为具体配置：

```
bcdedit /debug on
bcdedit /set loadoptions FORCEHVTONOTSHAREDEBUGDEVICE
bcdedit /dbgsettings net hostip:{{host-private-ip}} port:{{port-number}} key:{{encryption-key}} busparams:{{b.d.f}}
```

**注意**  
运行以下命令来检查现有的 `loadoptions`。如果返回值，请复制该字符串并为其附加 `;FORCEHVTONOTSHAREDEBUGDEVICE`。  

```
(bcdedit /enum) -match "loadoptions"
```

其中：
+ {{host-private-ip}}：调试主机实例的私有 IPv4 地址。如果实例是在仅使用 IPv6 的子网中启动的，请参阅 Microsoft 文档中的 [Setting up KDNET with IPv6](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/setting-up-a-network-debugging-connection#ipv6)，以了解有关将 IPv6 与 KDNET 结合使用的更多信息。
+ {{port-number}}：用于调试会话的端口。建议范围为 50000 – 50039（例如 `50000`）。
+ {{encryption-key}}：用于加密调试连接的 256 位密钥，以四个 64 位值表示，用英文句点分隔。每个 64 位值最长可为 13 个字符，仅可使用小写字母 a – z 和数字 0 – 9。不允许使用特殊字符。加密密钥示例：`1kdnet2keys3.4kdnet5keys6.7kdnet8keys9.10kdnet11ke`。
+ {{b.d.f}}：ENA 设备的总线、设备和功能编号，格式为 `bus.device.function`（例如 `0.3.0`），用于调试。

**提示**  
要调试 Windows 启动流程，另请运行以下命令：  

```
bcdedit /bootdebug on
```

## 步骤 3：在调试主机上启动调试会话
<a name="kdnet-step3-start-debugging-session"></a>

要允许主机上的调试流量，可以为 WinDbg 应用程序或特定的 UDP 端口创建防火墙规则。

**选项 1：允许 WinDbg 应用程序**  
运行以下命令以授权 WinDbg 可执行文件：

```
$WinDbgxPath = "$env:LocalAppData\Microsoft\WindowsApps\WinDbgX.exe"
New-NetFirewallRule -DisplayName "Allow Inbound KDNET Connection" -Action Allow -Program $WinDbgxPath
```

**选项 2：允许特定的 UDP 端口**  
或者，您可以允许入站 UDP 流量到达为内核调试配置的端口。将{{端口号}}替换为所选择的 KDNET 端口：

```
$DebugPort = {{port-number}}
New-NetFirewallRule -DisplayName "Allow Inbound KDNET Connection" -Direction Inbound -LocalPort $DebugPort -Protocol UDP -Action Allow
```

**注意**  
防火墙配置可能受域组策略（GPO）限制，或者需要提升管理员权限。如果命令失败，请联系网络管理员。

使用与调试目标配置匹配的端口和密钥启动 WinDbg。您可以根据自己的使用案例指定 [Microsoft WinDbg command line reference](https://learn.microsoft.com/en-us/windows-hardware/drivers/debuggercmds/windbg-command-line-preview#kernel-options) 中记录的其他内核调试选项。

```
windbgx -k net:port={{port-number}},key={{encryption-key}}
```

WinDbg 打开并等待调试目标连接。

## 步骤 4：重新启动调试目标
<a name="kdnet-step4-reboot-debug-target"></a>

在调试目标上，重新启动实例以启动调试连接：

```
shutdown -r -t 0
```

调试目标重新启动后，调试主机上的 WinDbg 会自动连接到目标。现在，您可以使用 WinDbg 来检查内核状态、设置断点并诊断问题。

## 调试后清理调试设置
<a name="kdnet-clean-up"></a>

**在调试目标上**  
完成调试后，从调试目标中删除内核调试配置以恢复正常启动行为。在调试目标上，打开提升权限的 PowerShell 会话并运行以下命令：

```
bcdedit /debug off
bcdedit /dbgsettings LOCAL
bcdedit /deletevalue loadoptions
```

如果您除 `FORCEHVTONOTSHAREDEBUGDEVICE` 之外还有其他现有的 `loadoptions`，则应通过运行带有原始 `loadoptions` 的 `bcdedit /set loadoptions` 来恢复该设置。

如果您启用了启动调试，请另运行：

```
bcdedit /bootdebug off
```

重新启动实例以使更改生效。

**在调试主机上**  
通过运行以下命令删除防火墙规则：

```
Remove-NetFirewallRule -DisplayName "Allow Inbound KDNET Connection"
```

## 限制
<a name="kdnet-limitations"></a>

适用于 ENA 的 KDNET 可扩展性模块目前不支持：
+ 第 8 代非裸机 x86\_64 实例类型（例如 `m8a.xlarge`）
+ 第 7 代 48xlarge 非裸机 x86\_64 实例类型（例如 `m7a.48xlarge`）
+ u7i 实例类型

该模块目前不支持启用了安全启动的实例。您可以通过在提升权限的 PowerShell 会话中运行 `Confirm-SecureBootUEFI` 来验证状态。如果输出为 `True`，则安全启动处于活动状态。请注意，所有带有“TPM”前缀的 Amazon 提供的映像默认情况下启用安全启动。

## 附加说明
<a name="kdnet-additional-notes"></a>

如果在将调试程序连接到目标实例时遇到问题，请验证以下各项：
+ 满足本指南中列出的所有先决条件，包括所需的 Windows Server 内部版本号和可扩展性模块的存在。
+ 附加到两个实例的安全组配置正确，允许它们之间在配置的调试端口上进行流量通信。
+ 主机实例上的 Windows 防火墙规则不会阻止两个实例之间在配置端口上的网络流量。

有关其他指导，请参阅 Microsoft 文档中的 [Set up KDNET network kernel debugging manually](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/setting-up-a-network-debugging-connection)。
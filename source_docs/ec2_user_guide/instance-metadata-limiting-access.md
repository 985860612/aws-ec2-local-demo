

# 限制访问实例元数据服务
<a name="instance-metadata-limiting-access"></a>

您可以考虑使用本地防火墙规则，以禁止从某些或所有进程中访问实例元数据服务（IMDS）。

对于[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)，如果 VPC 内的网络设备（例如虚拟路由器）会将数据包转发到 IMDS 地址，且实例的默认[源/目标检查](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html#EIP_Disable_SrcDestCheck)已被禁用，则可以从您自己的网络访问 IMDS。要防止来自 VPC 外的源访问 IMDS，建议您修改网络设备的配置，丢弃目标 IPv4 地址为 IMDS `169.254.169.254` 的数据包，如果您启用了 IPv6 端点，则丢弃目标 IPv6 地址为 IMDS `[fd00:ec2::254]` 的数据包。

## 限制 Linux 实例的 IMDS 访问
<a name="instance-metadata-limiting-access-linux"></a>

**使用 iptables 限制访问**

以下示例使用 Linux iptables 及其 `owner` 模块禁止 Apache Web 服务器（基于其默认安装用户 ID `apache`）访问 169.254.169.254。它使用*拒绝规则* 拒绝来自以该用户身份运行的任何进程的所有实例元数据请求（无论是 IMDSv1 还是 IMDSv2）。

```
$ sudo iptables --append OUTPUT --proto tcp --destination 169.254.169.254 --match owner --uid-owner apache --jump REJECT
```

或者，您可以考虑使用*允许规则* 以仅允许特定用户或组进行访问。从安全的角度看，允许规则可能更易于管理，因为它们要求您决定哪种软件需要访问实例元数据。如果使用*允许规则*，在您以后更改实例上的软件或配置时，不太可能会意外允许软件访问元数据服务（您不打算让该软件进行访问）。您还可以将组与允许规则结合使用，以便您可以在允许的组中添加和删除用户，而无需更改防火墙规则。

以下示例禁止所有进程访问 IMDS，但在用户账户 `trustworthy-user` 中运行的进程除外。

```
$ sudo iptables --append OUTPUT --proto tcp --destination 169.254.169.254 --match owner ! --uid-owner {{trustworthy-user}} --jump REJECT
```

**注意**  
要使用本地防火墙规则，您需要修改前面的示例命令以符合您的需求。
默认情况下，不会在系统重新引导之间持久保留 iptables 规则。可以使用此处未介绍的操作系统功能持久保留这些规则。
只有在组是给定本地用户的主要组时，iptables `owner` 模块才会匹配组成员资格。不会匹配其他组。

**使用 PF 或 IPFW 限制访问**

如果使用 FreeBSD 或 OpenBSD，则还可以考虑使用 PF 或 IPFW。以下示例将 IMDS 访问限制为仅根用户。

**PF**

```
$ block out inet proto tcp from any to 169.254.169.254
```

```
$ pass out inet proto tcp from any to 169.254.169.254 user root
```

**IPFW**

```
$ allow tcp from any to 169.254.169.254 uid root
```

```
$ deny tcp from any to 169.254.169.254
```

**注意**  
PF 和 IPFW 命令的顺序至关重要。PF 默认为最后一个匹配规则，而 IPFW 默认为第一个匹配规则。

## 限制 Windows 实例的 IMDS 访问
<a name="instance-metadata-limiting-access-windows"></a>

**使用 Windows 防火墙限制访问**

以下 PowerShell 示例使用内置的 Windows 防火墙禁止 Internet Information Server Web 服务器（基于其默认安装用户 ID `NT AUTHORITY\IUSR`）访问 169.254.169.254。它使用*拒绝规则* 拒绝来自以该用户身份运行的任何进程的所有实例元数据请求（无论是 IMDSv1 还是 IMDSv2）。

```
PS C:\> $blockPrincipal = New-Object -TypeName System.Security.Principal.NTAccount ("NT AUTHORITY\IUSR")
PS C:\> $BlockPrincipalSID = $blockPrincipal.Translate([System.Security.Principal.SecurityIdentifier]).Value
PS C:\> $BlockPrincipalSDDL = "D:(A;;CC;;;$BlockPrincipalSID)"
PS C:\> New-NetFirewallRule -DisplayName "Block metadata service from IIS" -Action block -Direction out `
-Protocol TCP -RemoteAddress 169.254.169.254 -LocalUser $BlockPrincipalSDDL
```

或者，您可以考虑使用*允许规则* 以仅允许特定用户或组进行访问。从安全的角度看，允许规则可能更易于管理，因为它们要求您决定哪种软件需要访问实例元数据。如果使用*允许规则*，在您以后更改实例上的软件或配置时，不太可能会意外允许软件访问元数据服务（您不打算让该软件进行访问）。您还可以将组与允许规则结合使用，以便您可以在允许的组中添加和删除用户，而无需更改防火墙规则。

以下示例禁止作为 `blockPrincipal` 变量中指定的操作系统组（在该示例中为 Windows 组 `Everyone`）运行的所有进程访问实例元数据，但在 `exceptionPrincipal` 中指定的进程除外（在该示例中为名为 `trustworthy-users` 的组）。您必须同时指定拒绝委托人和允许委托人，因为与 Linux iptables 中的 `! --uid-owner trustworthy-user` 规则不同，Windows 防火墙不提供拒绝所有其他委托人以仅允许特定委托人（用户或组）的快捷方法。

```
PS C:\> $blockPrincipal = New-Object -TypeName System.Security.Principal.NTAccount ("Everyone")
PS C:\> $BlockPrincipalSID = $blockPrincipal.Translate([System.Security.Principal.SecurityIdentifier]).Value
PS C:\> $exceptionPrincipal = New-Object -TypeName System.Security.Principal.NTAccount ("trustworthy-users")
PS C:\> $ExceptionPrincipalSID = $exceptionPrincipal.Translate([System.Security.Principal.SecurityIdentifier]).Value
PS C:\> $PrincipalSDDL = "O:LSD:(D;;CC;;;$ExceptionPrincipalSID)(A;;CC;;;$BlockPrincipalSID)"
PS C:\> New-NetFirewallRule -DisplayName "Block metadata service for $($blockPrincipal.Value), exception: $($exceptionPrincipal.Value)" -Action block -Direction out `
-Protocol TCP -RemoteAddress 169.254.169.254 -LocalUser $PrincipalSDDL
```

**注意**  
要使用本地防火墙规则，您需要修改前面的示例命令以符合您的需求。

**使用 netsh 规则限制访问**

您可以考虑使用 `netsh` 规则阻止所有软件，但这些规则不太灵活。

```
C:\> netsh advfirewall firewall add rule name="Block metadata service altogether" dir=out protocol=TCP remoteip=169.254.169.254 action=block
```

**注意**  
要使用本地防火墙规则，您需要修改前面的示例命令以符合您的需求。
必须从提升权限的命令提示符中设置 `netsh` 规则，并且不能将其设置为拒绝或允许特定委托人。
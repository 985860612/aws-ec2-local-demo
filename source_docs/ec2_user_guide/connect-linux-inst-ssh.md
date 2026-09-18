

# 使用 SSH 客户端连接到 Linux 实例
<a name="connect-linux-inst-ssh"></a>

使用 Secure Shell（SSH）可以从本地计算机连接到 Linux 实例。有关其他选项的更多信息，请参阅[连接到您的 EC2 实例](connect.md)。

**注意**  
如果您在尝试连接到您的实例时收到错误，请确保您的实例满足所有 [SSH 连接先决条件](#ssh-prereqs-linux-from-linux-macos) 要求。如果它满足所有先决条件，但您仍然无法连接到 Linux 实例，请参阅[排查 Amazon EC2 Linux 实例的连接问题](TroubleshootingInstancesConnecting.md)。

**Topics**
+ [SSH 连接先决条件](#ssh-prereqs-linux-from-linux-macos)
+ [使用 SSH 客户端连接到 Linux 实例](#connect-linux-inst-sshClient)

## SSH 连接先决条件
<a name="ssh-prereqs-linux-from-linux-macos"></a>

使用 SSH 连接到 Linux 实例之前，请先完成以下任务。

**完成一般先决条件。**  
+ 检查您的实例是否通过了状态检查。可能需要花几分钟时间，实例才能准备好接受连接请求。有关更多信息，请参阅 [查看状态检查](viewing_status.md)。
+ [获取所需的实例详细信息](connection-prereqs-general.md#connection-prereqs-get-info-about-instance).
+ [查找私有密钥并设置权限](connection-prereqs-general.md#connection-prereqs-private-key).
+ [（可选）获取实例指纹](connection-prereqs-general.md#connection-prereqs-fingerprint).

**允许来自您 IP 地址的入站 SSH 流量。**  
确保与您的实例关联的安全组允许来自您的 IP 地址的入站 SSH 流量。有关更多信息，请参阅 [用于从您的计算机连接到实例的规则](security-group-rules-reference.md#sg-rules-local-access)。

**在本地计算机上安装 SSH 客户端（如果需要）。**  
您的本地计算机可能已默认安装了 SSH 客户端。在终端窗口输入以下命令可以验证该情况。如果计算机无法识别该命令，则必须安装 SSH 客户端。  

```
ssh
```
以下是适用于 Windows 的一些可能选项。如果计算机运行别的操作系统，请参阅相应操作系统的文档来了解 SSH 客户端选项。

## 在 Windows 系统上安装 OpenSSH
<a name="openssh"></a>

在 Windows 上安装 OpenSSH 后，即可使用 SSH 从 Windows 计算机连接到 Linux 实例。开始操作之前，务必确认已满足以下要求。

**Windows 版本**  
计算机上的 Windows 版本必须是 Windows Server 2019 或更高版本。  
若为较早版本的 Windows，请改为下载并安装 [Win32-OpenSSH](https://github.com/PowerShell/Win32-OpenSSH/wiki)。

**PowerShell 要求**  
若要在 Windows 操作系统上使用 PowerShell 安装 OpenSSH，您必须运行 PowerShell 版本 5.1 或更高版本，并且您的账户必须是内置管理员组的成员。在 PowerShell 中运行 `$PSVersionTable.PSVersion` 以查看 PowerShell 版本。  
若要查看您是否是内置管理员组的成员，请运行以下 PowerShell 命令：  

```
(New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
```
如果您是内置管理员组的成员，则输出为 `True`。

若要使用 PowerShell 安装适用于 Windows 的 OpenSSH，请运行以下 PowerShell 命令。

```
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

下面是示例输出。

```
Path          :
Online        : True
RestartNeeded : False
```

若要使用 PowerShell 将 OpenSSH 从 Windows 卸载，请运行以下 PowerShell 命令。

```
Remove-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

下面是示例输出。

```
Path          :
Online        : True
RestartNeeded : True
```

## 安装适用于 Linux 的 Windows 子系统（WSL）
<a name="WSL"></a>

在 Windows 上安装 WSL 后，即可使用 Linux 命令行工具（例如 SSH 客户端）从 Windows 计算机连接到 Linux 实例。

按照[在 EC2 Windows 实例上安装适用于 Linux 的 Windows 子系统](install-wsl-on-ec2-windows-instance.md)中的说明进行操作。如果您按照 Microsoft 安装指南中的说明进行操作，他们会安装 Linux 的 Ubuntu 发行版。如果愿意，您可以安装不同的 Linux 发行版。

在 WSL 终端窗口中，将 `.pem` 文件（适用于您在启动时为实例指定的密钥对）从 Windows 复制到 WSL。记下在连接到实例时要使用的 WSL 上的 `.pem` 文件的完全限定路径。有关如何指定 Windows 硬盘的路径的信息，请参阅[如何访问我的 C 驱动器？](https://learn.microsoft.com/en-us/windows/wsl/faq#how-do-i-access-my-c--drive-)。

```
cp /mnt/{{<Windows drive letter>/path/my-key-pair}}.pem ~/{{WSL-path/my-key-pair}}.pem
```

有关卸载 Windows Subsystem for Linux 的信息，请参阅[如何卸载 WSL 发行版？](https://learn.microsoft.com/en-us/windows/wsl/faq#how-do-i-uninstall-a-wsl-distribution-)

## 使用 SSH 客户端连接到 Linux 实例
<a name="connect-linux-inst-sshClient"></a>

通过以下过程使用 SSH 客户端连接到您的 Linux 实例。

**使用 SSH 客户端连接到实例**

1. 在计算机上打开终端窗口。

1. 使用 **ssh** 命令连接到实例。此时需要用到在先决条件中收集的有关实例的详细信息。例如，您需要私有密钥（`.pem` 文件）的位置、用户名以及公有 DNS 名称或 IPv6 地址。以下是命令示例。
   + （公有 DNS）要使用公有 DNS 名称，请输入以下命令。

     ```
     ssh -i {{/path/key-pair-name}}.pem {{instance-user-name}}@{{instance-public-dns-name}}
     ```
   + （IPv6）或者，如果实例具有 IPv6 地址，请输入以下命令来使用 IPv6 地址。

     ```
     ssh -i {{/path/key-pair-name}}.pem {{instance-user-name}}@{{2001:db8::1234:5678:1.2.3.4}}
     ```

   以下为响应示例。

   ```
   The authenticity of host 'ec2-198-51-100-1.compute-1.amazonaws.com (198-51-100-1)' can't be established.
   ECDSA key fingerprint is l4UB/neBad9tvkgJf1QZWxheQmR59WgrgzEimCG6kZY.
   Are you sure you want to continue connecting (yes/no)?
   ```

1. （可选）验证安全警报中的指纹是否与该指纹相匹配。如果这些指纹不匹配，则表示有人可能在试图实施中间人攻击。如果匹配，请继续到下一步。有关更多信息，请参阅[获取实例指纹](connection-prereqs-general.md#connection-prereqs-fingerprint)。

1. 输入 **yes**。

   您会看到如下响应：

   ```
   Warning: Permanently added 'ec2-198-51-100-1.compute-1.amazonaws.com' (ECDSA) to the list of known hosts.
   ```
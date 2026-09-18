

# 验证 Amazon EC2 实例是否启用了 UEFI 安全启动
<a name="verify-uefi-secure-boot"></a>

您可以使用以下过程确定 Amazon EC2 是否启用了 UEFI 安全启动。

## Linux 实例
<a name="verify-uefi-secure-boot-linux"></a>

您可以使用 `mokutil` 实用程序验证 Linux 实例是否启用了 UEFI 安全启动。如果实例上未安装 `mokutil`，则必须进行安装。有关 Amazon Linux 2 的安装说明，请参阅 [Find and install software packages on an Amazon Linux 2 instance](https://docs.aws.amazon.com/linux/al2/ug/find-install-software.html)。有关其他 Linux 发行版，请参阅特定于该版本的文档。

**验证 Linux 实例是否启用了 UEFI 安全启动**  
连接到您的实例并在终端窗口中作为 `root` 运行以下命令。

```
mokutil --sb-state 
```

下面是示例输出。
+ 如果启用了 UEFI 安全启动，则输出包含 `SecureBoot enabled`。
+ 如果未启用 UEFI 安全启动，则输出将包含 `SecureBoot disabled` 或 `Failed to read SecureBoot`。

## Windows 实例
<a name="verify-uefi-secure-boot-windows"></a>

**验证 Windows 实例是否启用了 UEFI 安全启动**

1. 连接到您的实例。

1. 打开 msinfo32 工具。

1. 检查 **Secure Boot State**（安全启动状态）字段。如果启用了 UEFI 安全启动，则该值为**支持**，如下图所示。  
![系统信息中的安全启动状态。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/secure-boot-state-win.png)

您还可以使用 Windows PowerShell Cmdlet `Confirm-SecureBootUEFI` 来检查安全启动状态。有关 cmdlet 的更多信息，请参阅 Microsoft 文档中的 [Confirm-SecureBootUEFI](https://learn.microsoft.com/en-us/powershell/module/secureboot/confirm-securebootuefi)。
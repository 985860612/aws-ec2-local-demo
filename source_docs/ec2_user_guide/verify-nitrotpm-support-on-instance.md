

# 验证是否为 NitroTPM 启用了 Amazon EC2 实例
<a name="verify-nitrotpm-support-on-instance"></a>

您可以验证是否为 NitroTPM 启用了 Amazon EC2 实例。如果在实例上启用了 NitroTPM 支持，则该命令将返回 `"v2.0"`。否则，输出内容中不会显示 `TpmSupport` 字段。

Amazon EC2 控制台不显示 `TpmSupport` 字段。

------
#### [ AWS CLI ]

**验证是否为 NitroTPM 启用了实例**  
可以使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --query Reservations[].Instances[].TpmSupport
```

------
#### [ PowerShell ]

**验证是否为 NitroTPM 启用了实例**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}}).Instances.TpmSupport
```

------

## 验证您的 Windows 实例上的 nitroTPM 访问权限
<a name="verify-nitrotpm-support-windows-instance"></a>

**（仅限 Windows 实例）验证 Windows 是否可以访问 NitroTPM**

1. [连接到您的 EC2 Windows 实例](connecting_to_windows_instance.md)。

1. 在该实例上，运行 tpm.msc 程序。

   **TPM Management on Local Computer**（本地电脑上的 TPM 管理）窗口将打开。

1. 检查 **TPM Manufacturer Information**（TPM 制造商信息）字段。它包含制造商的名称和实例上的 NitroTPM 版本。  
![“TPM 管理”窗口，显示“TPM 制造商信息”字段及 NitroTPM 版本。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/tpm-1.png)
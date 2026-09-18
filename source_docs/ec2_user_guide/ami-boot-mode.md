

# 确定 Amazon EC2 AMI 的启动模式参数
<a name="ami-boot-mode"></a>

AMI 启动模式参数是可选项。AMI 可以具有以下任一启动模式参数值：`uefi`、`legacy-bios` 或 `uefi-preferred`。

某些 AMI 没有启动模式参数。如果 AMI 没有启动模式参数，从 AMI 启动的实例将使用实例类型的默认值，在 Graviton 上使用 `uefi`，并在 Intel 和 AMD 实例类型上使用 `legacy-bios`。

------
#### [ Console ]

**确定 AMI 的启动模式参数**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**，然后选择 AMI。

1. 检查**启动模式**字段。
   + 值 **uefi** 表示 AMI 支持 UEFI。
   + 值 **uefi-preferred** 表示 AMI 同时支持 UEFI 和传统 BIOS。
   + 如果没有值，从 AMI 启动的实例将使用实例类型的默认值。

**在启动实例时确定 AMI 的启动模式参数**  
使用启动实例向导启动实例时，请在选择 AMI 的步骤中检查**启动模式**字段。有关更多信息，请参阅 [应用程序和操作系统映像（亚马逊机器映像）](ec2-instance-launch-parameters.md#liw-ami)。

------
#### [ AWS CLI ]

**确定 AMI 的启动模式参数**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令确定 AMI 的启动模式。

```
aws ec2 describe-images \
    --region {{us-east-1}} \
    --image-id {{ami-0abcdef1234567890}} \
    --query Images[].BootMode \
    --output text
```

下面是示例输出。

```
uefi
```

输出中的值 `uefi` 表示 AMI 支持 UEFI。值 `uefi-preferred` 表示 AMI 同时支持 UEFI 和传统 BIOS。如果没有值，从 AMI 启动的实例将使用实例类型的默认值。

------
#### [ PowerShell ]

**确定 AMI 的启动模式参数**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet 确定 AMI 的启动模式。

```
Get-EC2Image -Region {{us-east-1}} `
    -ImageId {{ami-0abcdef1234567890}} | Format-List Name, BootMode, TpmSupport
```

下面是示例输出。

```
Name       : TPM-Windows_Server-2016-English-Full-Base-2023.05.10
BootMode   : uefi
TpmSupport : v2.0
```

输出中的值 `BootMode` 表示 AMI 的启动模式。值 `uefi` 表示 AMI 支持 UEFI。值 `uefi-preferred` 表示 AMI 同时支持 UEFI 和传统 BIOS。如果没有值，从 AMI 启动的实例将使用实例类型的默认值。

------
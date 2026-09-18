

# 确定 EC2 实例类型支持的启动模式
<a name="instance-type-boot-mode"></a>

您可以确定实例类型支持的启动模式。

Amazon EC2 控制台不会显示实例类型支持的启动模式。

------
#### [ AWS CLI ]

使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令确定实例类型支持的启动模式。`--query` 参数筛选输出以仅返回支持的启动模式。

以下示例显示，指定的实例类型同时支持 UEFI 和传统 BIOS 启动模式。

```
aws ec2 describe-instance-types \
    --instance-types {{m5.2xlarge}} \
    --query "InstanceTypes[*].SupportedBootModes"
```

下面是示例输出。

```
[
    [
        "legacy-bios",
        "uefi"
    ]
]
```

以下示例显示 `t2.xlarge` 仅支持传统 BIOS。

```
aws ec2 describe-instance-types \
    --instance-types t2.xlarge \
    --query "InstanceTypes[*].SupportedBootModes"
```

下面是示例输出。

```
[
    [
        "legacy-bios"
    ]
]
```

------
#### [ PowerShell ]

使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) cmdlet 确定实例类型支持的启动模式。

以下示例显示 `m5.2xlarge` 支持 UEFI 和传统 BIOS 启动模式。

```
Get-EC2InstanceType -InstanceType m5.2xlarge | Format-List InstanceType, SupportedBootModes
```

下面是示例输出。

```
InstanceType       : m5.2xlarge
SupportedBootModes : {legacy-bios, uefi}
```

以下示例显示 `t2.xlarge` 仅支持传统 BIOS。

```
Get-EC2InstanceType -InstanceType t2.xlarge | Format-List InstanceType, SupportedBootModes
```

下面是示例输出。

```
InstanceType       : t2.xlarge
SupportedBootModes : {legacy-bios}
```

------

**确定支持 UEFI 的实例类型**  
您可以确定支持 UEFI 的实例类型。Amazon EC2 控制台不会显示实例类型是否支持 UEFI。

------
#### [ AWS CLI ]

可用的实例类型因 AWS 区域 而异。要查看某个区域中支持 UEFI 的可用实例类型，请使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令。包括 `--filters` 参数以将结果范围限定为支持 UEFI 的实例类型，并包括 `--query` 参数以将输出范围限定为 `InstanceType` 的值。

```
aws ec2 describe-instance-types \
    --filters Name=supported-boot-mode,Values=uefi \
    --query "InstanceTypes[*].[InstanceType]" \
    --output text | sort
```

------
#### [ PowerShell ]

可用的实例类型因 AWS 区域 而异。要查看某个区域中支持 UEFI 的可用实例类型，请使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) cmdlet。

```
Get-EC2InstanceType -Filter @{Name="supported-boot-mode"; Values="uefi"} |
	Sort-Object @{E={$_.ProcessorInfo.SupportedArchitectures}}, InstanceType |
	Format-Table InstanceType, SupportedBootModes, `
      @{Name="SupportedArchitectures"; E={$_.ProcessorInfo.SupportedArchitectures}}
```

------

**确定支持 UEFI 安全启动并保留非易失性变量的实例类型**  
裸机实例不支持 UEFI 安全启动和非易失性变量，因此这些示例将它们从输出中排除。有关 UEFI 安全启动的信息，请参阅 [适用于 Amazon EC2 实例的 UEFI 安全启动](uefi-secure-boot.md)。

------
#### [ AWS CLI ]

使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令，并从输出中排除裸机实例。

```
aws ec2 describe-instance-types \
    --filters Name=supported-boot-mode,Values=uefi Name=bare-metal,Values=false \
    --query "InstanceTypes[*].[InstanceType]" \
    --output text | sort
```

------
#### [ PowerShell ]

使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) cmdlet，并从输出中排除裸机实例。

```
Get-EC2InstanceType -Filter `
      @{Name="supported-boot-mode"; Values="uefi"}, `
      @{Name="bare-metal"; Values="false"} |
	Sort-Object @{E={$_.ProcessorInfo.SupportedArchitectures}}, InstanceType |
	Format-Table InstanceType, SupportedBootModes, `
      @{Name="SupportedArchitectures"; E={$_.ProcessorInfo.SupportedArchitectures}}
```

------
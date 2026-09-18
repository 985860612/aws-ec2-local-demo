

# 将实例存储卷添加到 Amazon EC2 AMI
<a name="adding-instance-storage-ami"></a>

您可创建带包括实例存储卷的块设备映射的 AMI。

如果使用指定实例存储卷块设备映射的 AMI 启动支持**非 NVMe 实例存储卷**的实例，该实例将包括实例存储卷。如果 AMI 中实例存储卷块设备映射的数量超过实例可用的实例存储卷的数量，则会忽略其他实例存储卷块设备映像。

如果使用指定实例存储卷块设备映射的 AMI 启动支持 **NVMe 实例存储卷**的实例，则会忽略实例存储卷块设备映射。无论在实例启动请求和 AMI 中指定的块设备映射如何，支持 NVMe 实例存储卷的实例都会获得其支持的所有实例存储卷。此类卷的设备映射取决于操作系统枚举这些卷的顺序。

**注意事项**
+ 可用的实例存储卷数量取决于实例类型。有关更多信息，请参阅 [可用的实例存储卷](instance-store-volumes.md#available-instance-store-volumes)。
+ 必须为每个块设备指定一个设备名称。有关更多信息，请参阅 [Amazon EC2 实例上卷的设备名称](device_naming.md)。
+ 启动实例时，可忽略 AMI 块设备映射中指定的非 NVMe 实例存储卷，或添加实例存储卷。
+ 对于 M3 实例，请在实例的块设备映射中指定实例存储卷，而非 AMI。Amazon EC2 可能会忽略 AMI 中的实例存储卷块设备映射。

------
#### [ Console ]

**向 Amazon EBS-backed AMI 添加实例存储卷**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances**，然后选择实例。

1. 依次选择**操作**、**映像和模板**和**创建映像**。

1. 在**创建映像**页面上，为您的映像添加一个有意义的名称和描述。

1. 对于要添加的每个实例存储卷，选择**添加新卷**，从**卷类型**中选择实例存储卷，并从**设备**中选择设备名称。

1. 选择**创建映像**。

------
#### [ AWS CLI ]

**将实例存储卷添加到 AMI**  
使用 [create-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-image.html) 命令和 `--block-device-mappings` 选项，为 EBS-backed AMI 指定块设备映射。使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 命令和 `--block-device-mappings` 选项，为 iAmazon S3 支持的 AMI 指定块设备映射。

```
--block-device-mappings file://mapping.json
```

以下块设备映射会添加两个实例存储卷。

```
[
    {
        "DeviceName": "/dev/sdc",
        "VirtualName": "ephemeral0"
    },
    {
        "DeviceName": "/dev/sdd",
        "VirtualName": "ephemeral1"
    }
]
```

------
#### [ PowerShell ]

**将实例存储卷添加到 AMI**  
使用 [New-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Image.html) cmdlet 和 `-BlockDeviceMapping` 参数，为 EBS-backed AMI 指定块设备映射。使用 [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html) cmdlet 和 `-BlockDeviceMapping` 参数，为 Amazon S3 支持的 AMI 指定块设备映射。

```
-BlockDeviceMapping $bdm
```

以下块设备映射会添加两个实例存储卷。

```
$bdm = @()

$sdc = New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping
$sdc.DeviceName = "/dev/sdc"
$sdc.VirtualName = "ephemeral0"
$bdm += $sdc

$sdd = New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping
$sdd.DeviceName = "/dev/sdd"
$sdd.VirtualName = "ephemeral1"
$bdm += $sdd
```

------
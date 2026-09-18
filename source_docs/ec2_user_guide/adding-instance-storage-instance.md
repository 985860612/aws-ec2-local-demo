

# 启动期间将实例存储卷添加到 EC2 实例
<a name="adding-instance-storage-instance"></a>

启动具有**非 NVMe 实例存储卷**的实例类型（例如，C1、C3、M1、M2、M3、R3、D2、H1、I2、X1 和 X1e）时，您必须在启动时为要附加的实例存储卷指定块设备映射。必须在实例启动请求中指定块设备映射，或者在用于启动实例的 AMI 中指定。

如果 AMI 包含实例存储卷的块设备映射，则无需在实例启动请求中指定块设备映射，除非您需要的实例存储卷超过 AMI 中包含的容量。

如果 AMI 不包含实例存储卷的块设备映射，则必须在实例启动请求中指定块设备映射。

对于具有 NVMe 实例存储卷的实例类型，所有支持的实例存储卷都会在启动时自动连接到实例。

**注意事项**
+ 可用的实例存储卷数量取决于实例类型。有关更多信息，请参阅 [可用的实例存储卷](instance-store-volumes.md#available-instance-store-volumes)。
+ 必须为每个块设备指定一个设备名称。有关更多信息，请参阅 [Amazon EC2 实例上卷的设备名称](device_naming.md)。
+ 对于 M3 实例，即使您未在实例的块设备映射中指定实例存储卷，您也可能收到这些卷。

------
#### [ Console ]

**在实例启动请求中指定块设备映射**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在控制面板中，选择**启动实例**。

1. 在 **Application and OS Images**（应用程序和操作系统映像）部分中，请选择要使用的 AMI。

1. 在**配置存储**部分中，**实例存储卷**部分列出了可附加到实例的实例存储卷。

1. 对于要附加的每个实例存储卷，对于**设备名称**，选择要使用的设备名称。

1. 根据需要配置剩余的实例设置，然后选择**启动实例**。

------
#### [ AWS CLI ]

**在实例启动请求中指定块设备映射**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--block-device-mappings` 选项。

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

**在实例启动请求中指定块设备映射**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 和 `-BlockDeviceMapping` 选项。

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
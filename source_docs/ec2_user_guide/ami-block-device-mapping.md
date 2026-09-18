

# 将块设备映射添加到 AMI
<a name="ami-block-device-mapping"></a>

各个 AMI 都拥有块储存设备映射，指定实例启动时要附加的块储存设备。要向 AMI 添加更多块储存设备，必须创建自己的 AMI。

**Topics**
+ [为 AMI 指定块储存设备映射](#create-ami-bdm)
+ [查看 AMI 块储存设备映射中的 EBS 卷](#view-ami-bdm)

## 为 AMI 指定块储存设备映射
<a name="create-ami-bdm"></a>

创建 AMI 时，您可以使用两种方法来指定除根卷以外的卷。如果您在从该实例创建 AMI 前已将卷附加到运行中的实例，则 AMI 的块储存设备映射将包括这些相同的卷。对于 EBS 卷，这些现存的数据会保存在一个新的快照中，而且是块储存设备映射指定的新快照。而实例存储卷的数据无法保存。

对于 EBS 支持的 AMI，您可以使用块储存设备映射来添加 EBS 卷和实例存储卷。对于 Amazon S3 支持的 AMI，您只能添加实例存储卷，方法是在注册镜像时修改镜像清单文件中的块设备映射条目。

**注意**  
对于 M3 实例，您必须在启动实例时，在块储存设备映射中指定适用于实例的实例存储卷。当您启动 M3 实例时，如果在块储存设备映射中为 AMI 指定的实例存储卷未指定为块储存设备映射的一部分，则该卷可能会被忽略。

------
#### [ Console ]

**将卷添加到 AMI**

1. 打开 Amazon EC2 控制台。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择一个实例，再依次选择 **Actions**（操作）**Image and templates**（映像和模板）、**Create image**（创建映像）。

1. 输入映像的名称和描述。

1. 实例卷将显示在 **Instance volumes**（实例卷）下。要添加另一个卷，请选择 **Add volume**（添加卷）。

1. 对于 **Volume Type**（卷类型），选择卷类型。对于 **Device**（设备），请选择设备名称。对于 EBS 卷，您可以指定其他详细信息，例如快照、卷大小、卷类型、IOPS 和加密状态。

1. 选择**创建映像**。

------
#### [ AWS CLI ]

**将卷添加到 AMI**

使用 [create-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-image.html) 命令可为由 EBS 支持的 AMI 指定块设备映射。使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 命令可为 Amazon S3 支持的 AMI 指定块设备映射。

使用 `--block-device-mappings` 参数指定块储存设备映射。您可以直接通过命令行指定 JSON 编码格式的参数，也可以通过引用 JSON 文件指定参数，如下所示。

```
--block-device-mappings file://{{mapping.json}}
```

要添加实例存储卷，请使用以下映射。请注意，NVMe 实例存储卷会自动挂载。

```
{
    "DeviceName": "{{device_name}}",
    "VirtualName": "ephemeral0"
}
```

要添加空的 100 GiB 卷，请使用以下映射。

```
{
    "DeviceName": "{{device_name}}",
    "Ebs": {
      "VolumeSize": 100
    }
}
```

要添加基于快照的 EBS 卷，请使用以下映射。

```
{
    "DeviceName": "{{device_name}}",
    "Ebs": {
      "SnapshotId": "{{snap-1234567890abcdef0}}"
    }
}
```

要对设备省略映射，请使用以下映射。

```
{
    "DeviceName": "{{device_name}}",
    "NoDevice": ""
}
```

------
#### [ PowerShell ]

使用 [New-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Image.html) cmdlet 为由 EBS 支持的 AMI 指定块设备映射。使用 [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html) cmdlet，为 Amazon S3 支持的 AMI 指定块设备映射。

添加 `-BlockDeviceMapping` 选项，并在 `bdm` 中指定更新：

```
-BlockDeviceMapping $bdm
```

以下映射添加了一个基于快照的卷。

```
$ebd = New-Object -TypeName Amazon.EC2.Model.EbsBlockDevice
$ebd.SnapshotId = "{{snap-1234567890abcdef0}}"
$bdm = New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping
$bdm.DeviceName = "{{device_name}}"
$bdm.Ebs = $ebd
```

以下映射添加了一个 100 GB 的空卷。

```
$ebd = New-Object -TypeName Amazon.EC2.Model.EbsBlockDevice
$ebd.VolumeSize = {{100}}
$bdm = New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping
$bdm.DeviceName = "{{device_name}}"
$bdm.Ebs = $ebd
```

------

## 查看 AMI 块储存设备映射中的 EBS 卷
<a name="view-ami-bdm"></a>

您可以轻松列举块储存设备映射中适用于 AMI 的 EBS 卷。

------
#### [ Console ]

**查看 AMI 的 EBS 卷**

1. 打开 Amazon EC2 控制台。

1. 在导航窗格中，选择 **AMIs**。

1. 从 **Filter** 列表中选择 **EBS images** 以获取 EBS 支持的 AMI 的列表。

1. 选择所需的 AMI，然后查看**详细信息**选项卡。至少，以下信息适用于根卷（其中术语**根设备**等同于**根卷**）：
   + **根设备类型**（`ebs`）
   + **根设备名称**（例如 `/dev/sda1`）
   + **块设备**（例如 `/dev/sda1=snap-1234567890abcdef0:8:true`）

   如果使用块设备映射创建的 AMI 带有额外 卷，则**块设备**字段会显示针对这些额外 EBS 卷的映射。（此屏幕不显示实例存储卷。）

------
#### [ AWS CLI ]

**查看 AMI 的 EBS 卷**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --image-ids {{ami-0abcdef1234567890}} \
    --query Image[0].BlockDeviceMappings
```

------
#### [ PowerShell ]

**查看 AMI 的 EBS 卷**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
(Get-EC2Image -ImageId {{ami-0abcdef1234567890}}).BlockDeviceMappings
```

------
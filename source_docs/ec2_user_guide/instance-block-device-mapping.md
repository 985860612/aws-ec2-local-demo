

# 将块设备映射添加到 Amazon EC2 实例
<a name="instance-block-device-mapping"></a>

默认情况下，您启动的实例包含所有在 AMI 的块设备映射中指定的存储设备（您是从该 AMI 启动实例的）。您可以在启动实例时，为实例指定要对块储存设备映射执行的更改，而这些更新会覆盖 AMI 的块储存设备映射或与其合并。

**限制**
+ 对于根卷，您只能修改下列内容：卷大小、卷类型和 **Delete on Termination** 标志。
+ 修改 EBS 卷时，无法减小其大小。因此，您必须指定大小等于或大于 AMI 的块储存设备映射中指定的快照大小的快照。

**Topics**
+ [在启动实例时更新块储存设备映射](#Using_OverridingAMIBDM)
+ [更新正在运行的实例的块储存设备映射](#update-instance-bdm)
+ [查看实例块储存设备映射中的 EBS 卷](#view-instance-bdm)
+ [查看实例存储卷的实例块储存设备映射](#bdm-instance-metadata)

## 在启动实例时更新块储存设备映射
<a name="Using_OverridingAMIBDM"></a>

您可以在启动实例时向其添加 EBS 卷和实例存储卷。请注意，针对实例更新块储存设备映射不会对启动实例的 AMI 的块储存设备映射造成永久性更改。

------
#### [ Console ]

**在启动时更新实例的卷**

1. 按照[启动实例](ec2-launch-instance-wizard.md)的步骤操作，但在完成以下步骤更新卷前不要启动实例。

1. （可选）要添加卷，请选择**配置存储**、**添加新卷**。选择卷大小和卷类型。

1. （可选）要隐藏由 AMI 的块设备映射指定的卷，请选择**配置存储**、**移除**。

1. （可选）要修改 EBS 卷的配置，请在**配置存储**窗格上选择**高级**。展开该卷的信息，然后根据需要进行任何更改。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

------
#### [ AWS CLI ]

**在启动时更新实例的卷**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--block-device-mappings` 选项。

```
--block-device-mappings file://mapping.json
```

例如，假定某个 AMI 块设备映射指定的设置如下：
+ `/dev/xvda` – EBS 根卷
+ `/dev/sdh` – 从 `snap-1234567890abcdef0` 创建的 EBS 卷
+ `/dev/sdj` – 空 EBS 卷，大小为 `100`
+ `/dev/sdb` – 实例存储卷 `ephemeral0`

假设以下为 `mapping.json` 中的实例块设备映射。

```
[
    {
        "DeviceName": "/dev/xvda",
        "Ebs": {
            "VolumeSize": 100
        }
    },
    {
        "DeviceName": "/dev/sdj",
        "NoDevice": ""
    },
    {
        "DeviceName": "/dev/sdh",
        "Ebs": {
            "VolumeSize": 300
        }
    },
    {
        "DeviceName": "/dev/sdc",
        "VirtualName": "ephemeral1"
    }
]
```

此实例块设备映射会执行以下操作：
+ 覆盖根卷 `/dev/xvda` 的大小，将其增加到 100 GiB。
+ 阻止 `/dev/sdj` 连接到该实例。
+ 覆盖 `/dev/sdh` 的大小，将其增加到 300 GiB。请注意，不需要再次指定快照 ID。
+ 添加临时卷 `/dev/sdc`。如果实例类型不支持多个实例存储卷，则这将无效。如果实例类型支持 NVMe 实例存储卷，则会自动枚举这些卷并将其包含在实例块设备映射中，并且无法覆盖。

------
#### [ PowerShell ]

**在启动时更新实例的卷**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 以及 `-BlockDeviceMapping` 参数和 `-BlockDeviceMapping` 参数。

```
-BlockDeviceMapping $bdm
```

假设以下为 `$bdm` 中的实例块设备映射。

```
$bdm = @()

$root = New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping
$root.DeviceName = "/dev/xvda"
$ebs1 = New-Object -TypeName Amazon.EC2.Model.EbsBlockDevice
$ebs1.VolumeSize = 100
$root.Ebs = $ebs1
$bdm += $root

$sdj = New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping
$sdj.DeviceName = "/dev/sdj"
$sdj.NoDevice = ""
$bdm += $sdj

$sdh = New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping
$sdh.DeviceName = "/dev/sdh"
$ebs2 = New-Object -TypeName Amazon.EC2.Model.EbsBlockDevice
$ebs2.VolumeSize = 300
$sdh.Ebs = $ebs2
$bdm += $sdh

$sdc = New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping
$sdc.DeviceName = "/dev/sdc"
$sdc.VirtualName = "ephemeral1"
$bdm += $sdc
```

此实例块设备映射会执行以下操作：
+ 覆盖根卷 `/dev/xvda` 的大小，将其增加到 100 GiB。
+ 阻止 `/dev/sdj` 连接到该实例。
+ 覆盖 `/dev/sdh` 的大小，将其增加到 300 GiB。请注意，不需要再次指定快照 ID。
+ 添加临时卷 `/dev/sdc`。如果实例类型不支持多个实例存储卷，则这将无效。如果实例类型支持 NVMe 实例存储卷，则会自动枚举这些卷并将其包含在实例块设备映射中，并且无法覆盖。

------

## 更新正在运行的实例的块储存设备映射
<a name="update-instance-bdm"></a>

在更改此属性之前，您不需要停止该实例。

------
#### [ AWS CLI ]

**更新正在运行的实例的块设备映射**  
使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令。

添加 `--block-device-mappings` 选项：

```
--block-device-mappings file://mapping.json
```

在 `mapping.json` 中，指定更新。例如，以下更新会将根卷更改为持久保留。

```
[
  {
    "DeviceName": "{{/dev/sda1}}",
    "Ebs": {
      "DeleteOnTermination": false
    }
  }
]
```

------
#### [ PowerShell ]

**更新正在运行的实例的块设备映射**  
使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet。

添加 `-BlockDeviceMapping` 选项：

```
-BlockDeviceMapping $bdm
```

在 `bdm` 中，指定更新。例如，以下更新会将根卷更改为持久保留。

```
$ebd = New-Object -TypeName Amazon.EC2.Model.EbsBlockDevice
$ebd.DeleteOnTermination = false
$bdm = New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping
$bdm.DeviceName = "{{/dev/sda1}}"
$bdm.Ebs = $ebd
```

------

## 查看实例块储存设备映射中的 EBS 卷
<a name="view-instance-bdm"></a>

您可以轻松枚举映射到实例的 EBS 卷。

------
#### [ Console ]

**查看实例的 EBS 卷**

1. 打开 Amazon EC2 控制台。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后查看**存储**选项卡中显示的详细信息。至少，以下信息适用于根卷（其中术语**根设备**等同于**根卷**）：
   + **Root device type**（例如** EBS **）
   + **Root Device Name**（例如，`/dev/xvda`）
   + **块设备**（例如 `/dev/xvda`、`/dev/sdf` 和 `/dev/sdj`）

   如果使用块储存设备映射启动了带有其他 EBS 卷的实例，则它们将显示在 **Block devices**（块储存设备）下。此选项卡上不会显示任何实例存储卷。

1. 要显示有关 EBS 卷的其他信息，请选择其卷 ID 以转到卷页面。

------
#### [ AWS CLI ]

**查看实例的 EBS 卷**  
可以使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --query Reservations[*].Instances[0].BlockDeviceMappings
```

------
#### [ PowerShell ]

**查看实例的 EBS 卷**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance -InstanceId {{i-0bac57d7472c89bac}}).Instances.BlockDeviceMappings
```

------

## 查看实例存储卷的实例块储存设备映射
<a name="bdm-instance-metadata"></a>

实例类型将决定对实例可用的实例存储卷的数量和类型。如果块储存设备映射中的实例存储卷数超过了对实例可用的实例存储卷数，则其他卷将被忽略。要查看实例的实例存储卷，请运行 **lsblk** 命令（Linux 实例）或打开 **Windows 磁盘管理**（Windows 实例）。要了解每种实例类型支持的实例存储卷数，请参阅 [Amazon EC2 instance type specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-type-specifications.html)。

当您查看实例的块储存设备映射时，可以只查看 EBS 卷，但是不能查看实例存储卷。您用于查看实例的实例存储卷的方法取决于卷类型。



### NVMe 实例存储卷
<a name="nvme-instance-store"></a>

#### Linux 实例
<a name="nvme-instance-store-linux"></a>

您可以使用 NVMe 命令行程序包 [nvme-cli](https://github.com/linux-nvme/nvme-cli) 来查询块储存设备映射中的 NVMe 实例存储卷。运行以下命令，下载程序包，并在实例上安装该程序包。

```
[ec2-user ~]$ sudo nvme list
```

以下是实例的示例输出。“模型”列中的文本表示卷是 EBS 卷还是实例存储卷。在这个例子中，`/dev/nvme1n1` 和 `/dev/nvme2n1` 均为实例存储卷。

```
Node             SN                   Model                                    Namespace
---------------- -------------------- ---------------------------------------- ---------
/dev/nvme0n1     vol06afc3f8715b7a597 Amazon Elastic Block Store               1        
/dev/nvme1n1     AWS2C1436F5159EB6614 Amazon EC2 NVMe Instance Storage         1         
/dev/nvme2n1     AWSB1F4FF0C0A6C281EA Amazon EC2 NVMe Instance Storage         1         ...
```

#### Windows 实例
<a name="nvme-instance-store-windows"></a>

您可以使用磁盘管理或 PowerShell 列出 EBS 和实例存储 NVMe 卷。有关更多信息，请参阅 [将 Amazon EC2 Windows 实例上的 NVMe 磁盘映射到卷](windows-list-disks-nvme.md)。

### HDD 或 SSD 实例存储卷
<a name="hdd-ssd-instance-store"></a>

您可以使用实例元数据在块储存设备映射中查询 HDD 或 SSD 实例存储卷。未包含 NVMe 实例储存卷。

所有针对实例元数据的请求的基本 URI 均为 `http://169.254.169.254/latest/`。有关更多信息，请参阅 [使用实例元数据管理 EC2 实例](ec2-instance-metadata.md)。

#### Linux 实例
<a name="hdd-ssd-instance-store-linux"></a>

首先，连接到运行中的实例。从该实例中，使用此查询获取其块储存设备映射。

------
#### [ IMDSv2 ]

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/block-device-mapping/
```

------
#### [ IMDSv1 ]

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/block-device-mapping/
```

------

该响应包含实例的块储存设备名称。举例来说，由实例存储支持的 `m1.small` 实例的输出如下所示。

```
ami
ephemeral0
root
swap
```

`ami` 设备是实例所看到的根卷。实例存储卷命名为 `ephemeral[0-23]`。`swap` 设备用于存储页面文件。如果您还映射了一些 EBS 卷，它们会依次显示为 `ebs1`、`ebs2` 等。

要了解块储存设备映射中的单个块储存设备的详细信息，可将其名称添加到上述查询，如下所示。

------
#### [ IMDSv2 ]

```
[ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/block-device-mapping/ephemeral0
```

------
#### [ IMDSv1 ]

```
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/block-device-mapping/ephemeral0
```

------

#### Windows 实例
<a name="hdd-ssd-instance-store-windows"></a>

首先，连接到运行中的实例。从该实例中，使用此查询获取其块储存设备映射。

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/block-device-mapping/
```

该响应包含实例的块储存设备名称。举例来说，由实例存储支持的 `m1.small` 实例的输出如下所示。

```
ami
ephemeral0
root
swap
```

`ami` 设备是实例所看到的根卷。实例存储卷命名为 `ephemeral[0-23]`。`swap` 设备用于存储页面文件。如果您还映射了一些 EBS 卷，它们会依次显示为 `ebs1`、`ebs2` 等。

要了解块储存设备映射中的单个块储存设备的详细信息，可将其名称添加到上述查询，如下所示。

```
PS C:\> Invoke-RestMethod -uri http://169.254.169.254/latest/meta-data/block-device-mapping/ephemeral0
```
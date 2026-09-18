

# 实例终止时保留数据
<a name="preserving-volumes-on-termination"></a>

当 Amazon EC2 实例终止时，您可以在实例存储卷或 Amazon EBS 卷上保留数据。本主题将介绍如何确保数据在实例终止后仍然存在。

## 实例终止如何影响根卷和数据卷
<a name="how-instance-termination-affects-root-and-data-volumes"></a>

**实例存储卷**  
实例终止时，实例存储卷会自动删除，数据也会丢失。要在实例生命周期结束后保留这些数据，可在终止实例之前手动将数据复制到持久性存储，如 Amazon EBS 卷、Amazon S3 存储桶或 Amazon EFS 文件系统。有关更多信息，请参阅 [适用于 Amazon EC2 实例的存储选项](Storage.md)。

**Amazon EBS 卷**  
实例终止时，EBS 卷将被删除或保留，具体取决于每个卷的 `DeleteOnTermination` 属性值：
+ **是**（控制台）/`true`（CLI）：实例终止时，卷将会删除。
+ **否**（控制台）/`false`（CLI）：实例终止时，卷将会保留。保留的卷将继续产生费用。
**注意**  
实例终止后，您可以为保留的卷拍摄快照，或将其附加到其他实例。为避免产生费用，您必须删除该卷。

## EBS 卷的默认删除行为
<a name="default-deletion-behavior-for-ebs-volumes"></a>

默认的 `DeleteOnTermination` 值因卷类型、卷是在启动时还是启动后附加以及附加卷所用的方法（控制台或 CLI）而异：


| 卷类型 | 附加时间 | 附加方法 | 实例终止时的默认行为 | 
| --- | --- | --- | --- | 
| 根卷 | 在启动时 | 控制台或 CLI | 删除 | 
| 根卷 | 启动后 | 控制台或 CLI | Preserve | 
| 数据量 | 在启动时 | 控制台 | Preserve | 
| 数据量 | 在启动时 | CLI | 删除 | 
| 数据量 | 启动后 | 控制台和 CLI | Preserve | 

## 检查卷持久性设置
<a name="check-ebs-volume-persistence-settings"></a>

EBS 卷启动时的默认值由 AMI 上设置的 `DeleteOnTermination` 属性决定。您可以在实例启动时更改该值，以覆盖 AMI 设置。我们建议您在启动实例后验证 `DeleteOnTermination` 属性的默认设置。

**要检查实例终止时是否会删除 Amazon EBS 卷**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 选择**存储**选项卡。

1. 在**块设备**下，向右滚动以选中**终止时删除**列。
   + 如果为**是**，则在实例终止时将会删除卷。
   + 如果为**否**，则在实例终止时不会删除卷。任何未删除的卷将继续产生费用。

## 将根卷更改为在启动时持久保留
<a name="delete-on-termination-ebs-volume"></a>

您可以在启动实例时更改 EBS 根卷的 `DeleteOnTermination` 属性。您还可以对数据卷使用以下过程。

------
#### [ Console ]

**在启动时更改要持久保留的实例根卷**

1. 按照步骤[启动实例](ec2-launch-instance-wizard.md)，但请在完成以下步骤以将根卷更改为持久保留后，再启动实例。

1. 在**配置存储**窗格上，选择**高级**。

1. 在 **EBS 卷**下，展开根卷信息。

1. 对于**终止时删除**，选择**是**。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

------
#### [ AWS CLI ]

**在启动时更改要持久保留的实例根卷**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令更改块设备映射中 `DeleteOnTermination` 的值。

添加 `--block-device-mappings` 选项：

```
--block-device-mappings file://mapping.json
```

在 `mapping.json` 中，指定设备名称，例如 `/dev/sda1` 或 `/dev/xvda`，并为 `DeleteOnTermination` 指定 `false`。

```
[
  {
    "DeviceName": "{{device_name}}",
    "Ebs": {
      "DeleteOnTermination": false
    }
  }
]
```

------
#### [ PowerShell ]

**在启动时更改要持久保留的实例根卷**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 更改块设备映射中 `DeleteOnTermination` 的值。

添加 `-BlockDeviceMapping` 选项：

```
-BlockDeviceMapping $bdm
```

在 `bdm` 中，指定设备名称，例如 `/dev/sda1` 或 `/dev/xvda`，并为 `DeleteOnTermination` 指定 `false`。

```
$ebd = New-Object -TypeName Amazon.EC2.Model.EbsBlockDevice
$ebd.DeleteOnTermination = false
$bdm = New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping
$bdm.DeviceName = "{{/dev/sda1}}"
$bdm.Ebs = $ebd
```

------

## 将运行的实例的根卷更改为持久保留
<a name="delete-on-termination-running-instance"></a>

您可以将正在运行的实例的根卷更改为持久保留。您还可以对数据卷使用以下过程。

------
#### [ AWS CLI ]

**将根卷更改为持久保留**  
使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令。

```
aws ec2 modify-instance-attribute \
    --instance-id {{i-1234567890abcdef0}}  \
    --block-device-mappings file://mapping.json
```

在 `mapping.json` 中，指定设备名称，例如 `/dev/sda1` 或 `/dev/xvda`，并为 `--DeleteOnTermination` 指定 `false`。

```
[
  {
    "DeviceName": "{{device_name}}",
    "Ebs": {
      "DeleteOnTermination": false
    }
  }
]
```

------
#### [ PowerShell ]

**将根卷更改为持久保留**  
使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet。

添加 `-BlockDeviceMapping` 选项：

```
-BlockDeviceMapping $bdm
```

在 `bdm` 中，指定设备名称，例如 `/dev/sda1` 或 `/dev/xvda`，并为 `DeleteOnTermination` 指定 `false`。

```
$ebd = New-Object -TypeName Amazon.EC2.Model.EbsBlockDevice
$ebd.DeleteOnTermination = false
$bdm = New-Object -TypeName Amazon.EC2.Model.BlockDeviceMapping
$bdm.DeviceName = "{{/dev/sda1}}"
$bdm.Ebs = $ebd
```

------
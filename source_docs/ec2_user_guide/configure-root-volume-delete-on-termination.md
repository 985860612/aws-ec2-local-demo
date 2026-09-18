

# Amazon EC2 实例终止后会保留 Amazon EBS 根卷
<a name="configure-root-volume-delete-on-termination"></a>

默认情况下，当实例终止时，实例的 Amazon EBS 根卷会被删除。您可以更改默认行为，确保 Amazon EBS 根卷在实例终止后仍保留。要更改默认行为，请将 `DeleteOnTermination` 属性设置为 `false`。您可以在实例启动时或稍后执行此操作。

**Topics**
+ [将根卷配置为在实例启动期间保留](#Using_ChangeRootDeviceVolumeToPersist)
+ [配置根卷以便为现有实例保留](#set-deleteOnTermination-aws-cli)
+ [确认已将根卷配置为保留](#Using_ConfirmRootDeviceVolumeToPersist)

## 将根卷配置为在实例启动期间保留
<a name="Using_ChangeRootDeviceVolumeToPersist"></a>

您可以将根卷配置为在启动实例时保留。

------
#### [ Console ]

**在启动实例时将根卷配置为持久保留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**，然后选择**启动实例**。

1. 依次选择亚马逊机器映像（AMI）、实例类型、密钥对，然后配置网络设置。

1. 在**配置存储**中，选择**高级**。

1. 扩展根卷。

1. 对于**终止时删除**，选择**是**。

1. 配置完实例后，选择**启动实例**。

------
#### [ AWS CLI ]

**在启动实例时将根卷配置为持久保留**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令并包含以下选项。

```
--block-device-mappings file://mapping.json
```

在 `mapping.json` 中，指定一个将 `DeleteOnTermination` 属性设置为 `false` 的块设备映射。

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

**在启动实例时将根卷配置为持久保留**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 并包含以下参数。

```
-BlockDeviceMapping $bdm
```

创建一个将 `DeleteOnTermination` 属性设置为 `$false` 的块设备映射。

```
$ebs = New-Object Amazon.EC2.Model.EbsBlockDevice
$ebs.DeleteOnTermination = $false
$bdm = New-Object Amazon.EC2.Model.BlockDeviceMapping
$bdm.DeviceName = "dev/xvda"
$bdm.Ebs = $ebs
```

------

## 配置根卷以便为现有实例保留
<a name="set-deleteOnTermination-aws-cli"></a>

您可以将根卷配置为对运行的实例保留。请注意，您无法使用 Amazon EC2 控制台完成此任务。

------
#### [ AWS CLI ]

**将现有实例的根卷配置为持久保留**  
使用 [modify-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-attribute.html) 命令以及将 `DeleteOnTermination` 属性设置为 `false` 的块设备映射。

```
aws ec2 modify-instance-attribute \
    --instance-id {{i-1234567890abcdef0}} \
    --block-device-mappings file://mapping.json
```

在 `mapping.json` 中指定以下内容。

```
[
    {
        "DeviceName": "/dev/xvda",
        "Ebs": {
            "DeleteOnTermination": false
        }
    }
]
```

------
#### [ PowerShell ]

**将现有实例的根卷配置为持久保留**  
使用 [Edit-EC2InstanceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceAttribute.html) cmdlet 以及将 `DeleteOnTermination` 属性设置为 `$false` 的块设备映射。

```
$ebs = New-Object Amazon.EC2.Model.EbsInstanceBlockDeviceSpecification
$ebs.DeleteOnTermination = $false
$bdm = New-Object Amazon.EC2.Model.InstanceBlockDeviceMappingSpecification
$bdm.DeviceName = "{{/dev/xvda}}"
$bdm.Ebs = $ebs
Edit-EC2InstanceAttribute `
    -InstanceId {{i-1234567890abcdef0}} `
    -BlockDeviceMapping $bdm
```

------

## 确认已将根卷配置为保留
<a name="Using_ConfirmRootDeviceVolumeToPersist"></a>

您可以确认已将根卷配置为持久保留。

------
#### [ Console ]

**确认已将根卷配置为持久保留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**，然后选择实例。

1. 在**存储**选项卡的**块设备**下，找到根卷的条目。如果**终止时删除**为 `No`，则表示卷已配置为保留。

------
#### [ AWS CLI ]

**确认已将根卷配置为持久保留**  
使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令，并确认 `DeleteOnTermination` 属性设置为 `false`。

```
aws ec2 describe-instances \
    --instance-id {{i-1234567890abcdef0}} \
    --query "Reservations[].Instances[].BlockDeviceMappings"
```

下面是示例输出。

```
[
    [
        {
            "DeviceName": "/dev/xvda",
            "Ebs": {
                "AttachTime": "2024-07-12T04:05:33.000Z",
                "DeleteOnTermination": false,
                "Status": "attached",
                "VolumeId": "vol-1234567890abcdef0"
                
        }
    ]              
]
```

------
#### [ PowerShell ]

**确认已将根卷配置为持久保留**  
使用 [ Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet，并确认 `DeleteOnTermination` 属性设置为 `False`。

```
(Get-EC2Instance -InstanceId i-i-1234567890abcdef0).Instances.BlockDeviceMappings.Ebs
```

下面是示例输出。

```
AssociatedResource  : 
AttachTime          : 7/12/2024 4:05:33 AM
DeleteOnTermination : False
Operator            : 
Status              : attached
VolumeId            : vol-1234567890abcdef0
```

------


# 将可选 Windows Server 组件添加到 Amazon EC2 Windows 实例
<a name="windows-optional-components"></a>

要访问并安装可选组件，您必须找到适合您的 Windows Server 版本的正确 EBS 快照，从快照创建卷，并将卷附加到您的实例。

**开始前的准备工作**  
使用 AWS 管理控制台或命令行工具获取实例的实例 ID 和可用区。您必须在实例所在的可用区中创建 EBS 卷。

使用以下过程之一，将 Windows Server 组件添加到实例。

------
#### [ Console ]

**向实例添加 Windows 组件**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Snapshots**。

1. 从 **Filter**（筛选条件）栏中，选择 **Public Snapshots**（公有快照）。

1. 添加 **Owner Alias**（所有者别名）筛选条件，并选择 **amazon**。

1. 添加**描述**筛选条件并输入 **Windows**。

1. 按 Enter

1. 选择符合您的系统架构和语言首选项的快照。例如，如果您的实例运行的是 Windows Server 2019，请选择 **Windows 2019 English Installation Media**。

1. 选择 **Actions**（操作）、**Create volume from snapshot**（从快照中创建卷）。

1. 对于**可用区**，选择与您的 Windows 实例匹配的可用区。选择 **Add tag**（添加标签），然后为标签键输入 **Name**，为标签值指定描述性名称。选择**创建卷**。

1. 在 **Successfully created volume**（成功创建的卷）消息（绿色广告条）中，选择刚才创建的卷。

1. 选择 **Actions**（操作）、**Attach Volume**（附加卷）。

1. 从 **Instance**（实例）中，选择实例 ID。

1. 对于 **Device name**（设备名称），输入连接的设备名称。如果您需要设备名称的帮助，请参阅 [Amazon EC2 实例上卷的设备名称](device_naming.md)。

1. 选择**附加卷**。

1. 连接到您的实例并将卷置于可用状态。有关更多信息，请参阅《Amazon EBS 用户指南》**中的[使 Amazon EBS 卷可供使用](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html)。
**重要**  
请勿初始化该卷。

1. 打开 **Control Panel**、**Programs and Features**。选择 **Turn Windows features on or off**。当系统提示安装介质时，则使用安装介质指定 EBS 卷。

1. （可选）完成介质安装后，可以断开卷。断开卷后，可以将其删除。

------
#### [ AWS CLI ]

**向实例添加 Windows 组件**

1. 使用 [describe-snapshots](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-snapshots.html) 命令以及 `owner-ids` 参数和 `description` 筛选条件，以获取可用安装介质快照的列表。

   ```
   aws ec2 describe-snapshots \
       --owner-ids amazon \
       --filters Name=description,Values=Windows*
   ```

1. 在输出中，请注意与您的系统架构和语言偏好匹配的快照的 ID。例如：

   ```
   {
       "Snapshots": [
       ...
           {
               "OwnerAlias": "amazon", 
               "Description": "Windows 2019 English Installation Media", 
               "Encrypted": false, 
               "VolumeId": "vol-be5eafcb", 
               "State": "completed", 
               "VolumeSize": 6, 
               "Progress": "100%", 
               "StartTime": "2019-10-25T20:00:47.000Z", 
               "SnapshotId": "snap-22da283e", 
               "OwnerId": "123456789012"
           }, 
       ...
      ]
   }
   ```

1. 使用 [create-volume](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-volume.html) 命令从快照创建卷。指定与您的实例相同的可用区。

   ```
   aws ec2 create-volume \
       --snapshot-id {{snap-0abcdef1234567890}} \
       --volume-type {{gp2}} \
       --availability-zone {{us-east-1a}}
   ```

1. 在输出中，记下卷 ID。

   ```
   {
       "AvailabilityZone": "us-east-1a", 
       "Encrypted": false, 
       "VolumeType": "gp2", 
       "VolumeId": "vol-01234567890abcdef", 
       "State": "creating", 
       "Iops": 100, 
       "SnapshotId": "snap-0abcdef1234567890", 
       "CreateTime": "2017-04-18T10:33:10.940Z", 
       "Size": 6
   }
   ```

1. 使用 [attach-volume](https://docs.aws.amazon.com/cli/latest/reference/ec2/attach-volume.html) 命令将卷附加到实例。

   ```
   aws ec2 attach-volume \
       --volume-id {{vol-0c98b37f30bcbc290}} \
       --instance-id {{i-01474ef662b89480}} \
       --device {{xvdg}}
   ```

1. 连接到您的实例并将卷置于可用状态。有关更多信息，请参阅《Amazon EBS 用户指南》**中的[使 Amazon EBS 卷可供使用](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html)。
**重要**  
请勿初始化该卷。

1. 打开 **Control Panel**、**Programs and Features**。选择 **Turn Windows features on or off**。当系统提示安装介质时，则使用安装介质指定 EBS 卷。

1. （可选）完成介质安装后，使用 [detach-volume](https://docs.aws.amazon.com/cli/latest/reference/ec2/detach-volume.html) 命令将卷与实例断开。断开卷后，您可以使用 [delete-volume](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-volume.html) 命令删除该卷。

------
#### [ PowerShell ]

**向实例添加 Windows 组件**

1. 使用包含 `Owner` 和 `description` 筛选器 [Get-EC2Snapshot](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Snapshot.html) 获取可用的安装介质快照的列表。

   ```
   Get-EC2Snapshot `
       -Owner amazon `
       -Filter @{ Name="description"; Values="Windows*" }
   ```

1. 在输出中，请注意与您的系统架构和语言偏好匹配的快照的 ID。例如：

   ```
   ...
   DataEncryptionKeyId :
   Description         : Windows 2019 English Installation Media
   Encrypted           : False
   KmsKeyId            :
   OwnerAlias          : amazon
   OwnerId             : 123456789012
   Progress            : 100%
   SnapshotId          : snap-0abcdef1234567890
   StartTime           : 10/25/2019 8:00:47 PM
   State               : completed
   StateMessage        :
   Tags                : {}
   VolumeId            : vol-01234567890abcdef
   VolumeSize          : 6
   ...
   ```

1. 使用 [New-EC2Volume](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Volume.html) cmdlet 从快照创建卷。指定与您的实例相同的可用区。

   ```
   New-EC2Volume `
       -AvailabilityZone {{us-east-1a}} `
       -VolumeType {{gp2}} `
       -SnapshotId {{snap-0abcdef1234567890}}
   ```

1. 在输出中，记下卷 ID。

   ```
   Attachments      : {}
   AvailabilityZone : us-east-1a
   CreateTime       : 4/18/2017 10:50:25 AM
   Encrypted        : False
   Iops             : 100
   KmsKeyId         :
   Size             : 6
   SnapshotId       : snap-0abcdef1234567890
   State            : creating
   Tags             : {}
   VolumeId         : vol-01234567890abcdef
   VolumeType       : gp2
   ```

1. 使用 [Add-EC2Volume](https://docs.aws.amazon.com/powershell/latest/reference/items/Add-EC2Volume.html) cmdlet 将卷附加到您的实例。

   ```
   Add-EC2Volume `
       -InstanceId {{i-1234567890abcdef0}} `
       -VolumeId {{vol-01234567890abcdef}} `
       -Device {{xvdh}}
   ```

1. 连接到您的实例并将卷置于可用状态。有关更多信息，请参阅《Amazon EBS 用户指南》**中的[使 Amazon EBS 卷可供使用](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html)。
**重要**  
请勿初始化该卷。

1. 打开 **Control Panel**、**Programs and Features**。选择 **Turn Windows features on or off**。当系统提示安装介质时，则使用安装介质指定 EBS 卷。

1. （可选）完成介质安装后，使用 [Dismount-EC2Volume](https://docs.aws.amazon.com/powershell/latest/reference/items/Dismount-EC2Volume.html) cmdlet 将卷与实例断开。断开卷后，您可以使用 [Remove-EC2Volume](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2Volume.html) cmdlet 删除该卷。

------
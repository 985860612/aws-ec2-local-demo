

# 设置 Amazon EC2 AMI 的启动模式
<a name="set-ami-boot-mode"></a>

默认情况下，AMI 会继承用于创建 AMI 的 EC2 实例的启动模式。例如，如果从传统 BIOS 上运行的 EC2 实例创建 AMI，则新 AMI 的启动模式为 `legacy-bios`。如果从启动模式为 `uefi-preferred` 的 EC2 实例创建 AMI，则新 AMI 的启动模式为 `uefi-preferred`。

注册 AMI 时，可以将 AMI 的启动模式设置为 `uefi`、`legacy-bios` 或 `uefi-preferred`。

当 AMI 启动模式设置为 `uefi-preferred` 时，实例将按如下方式启动：
+ 对于同时支持 UEFI 和传统 BIOS 的实例类型（例如 `m5.large`），实例通过 UEFI 启动。
+ 对于仅支持传统 BIOS 的实例类型（例如 `m4.large`），实例通过传统 BIOS 启动。

如果将 AMI 启动模式设置为 `uefi-preferred`，则操作系统必须支持同时启动 UEFI 和传统 BIOS 的功能。

要将现有的基于传统 BIOS 的实例转换为 UEFI，或将现有的基于 UEFI 的实例转换为传统 BIOS，必须首先修改实例的卷和操作系统以支持选定的启动模式。然后，创建该卷的快照。首先，从快照创建 AMI。

**注意事项**
+ 设置 AMI 启动模式参数不会自动将操作系统配置为指定的启动模式。您必须首先对实例的卷和操作系统进行适当的修改，以支持通过选定的启动模式启动。否则，生成的 AMI 将不可用。例如，如果要将基于传统 BIOS 的 Windows 实例转换为 UEFI，则可以使用 Microsoft 的 [MBR2GPT](https://learn.microsoft.com/en-us/windows/deployment/mbr-to-gpt) 工具将系统磁盘从 MBR 转换为 GPT。所需的修改是特定于操作系统的。有关更多信息，请参阅操作系统的手册。
+ 无法使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 命令或 [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html) cmdlet 创建同时支持 [NitroTPM](nitrotpm.md) 和 UEFI Preferred 的 AMI。
+ UEFI 安全启动等部分功能仅适用于在 UEFI 上启动的实例。将 `uefi-preferred` AMI 启动模式参数与不支持 UEFI 的实例类型结合使用时，实例将以传统 BIOS 启动，并禁用 UEFI 相关功能。如果您依赖于 UEFI 相关功能的可用性，请将 AMI 启动模式参数设置为 `uefi`。

------
#### [ AWS CLI ]

**设置 AMI 的启动模式**

1. 对实例的卷和操作系统进行适当修改，以支持使用所选启动模式进行启动。所需的修改是特定于操作系统的。有关更多信息，请参阅操作系统的手册。
**警告**  
如果不执行此步骤，AMI 将无法使用。

1. 要查找实例的卷 ID，请使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。您将在下一步中创建此卷的快照。

   ```
   aws ec2 describe-instances \
       --instance-ids {{i-1234567890abcdef0}} \
       --query Reservations[].Instances[].BlockDeviceMappings
   ```

   下面是示例输出。

   ```
   [
       [
           {
               "DeviceName": "/dev/xvda",
               "Ebs": {
                   "AttachTime": "2024-07-11T01:05:51+00:00",
                   "DeleteOnTermination": true,
                   "Status": "attached",
                   "VolumeId": "{{vol-1234567890abcdef0}}"
               }
           }
       ]
   ]
   ```

1. 要创建卷的快照，请使用 [create-snapshot](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-snapshot.html) 命令。使用上一步中的卷 ID。

   ```
   aws ec2 create-snapshot \
       --volume-id {{vol-01234567890abcdef}} \
       --description "{{my snapshot}}"
   ```

   下面是示例输出。

   ```
   {
       "Description": "my snapshot",
       "Encrypted": false,
       "OwnerId": "123456789012",
       "Progress": "",
       "SnapshotId": "snap-0abcdef1234567890",
       "StartTime": "",
       "State": "pending",
       "VolumeId": "vol-01234567890abcdef",
       "VolumeSize": 30,
       "Tags": []
   }
   ```

1. 等到快照状态为 `completed` 后，继续执行下一步。要获取快照状态，请将 [describe-snapshots](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-snapshots.html) 命令与上一步中的快照 ID 结合使用。

   ```
   aws ec2 describe-snapshots \
       --snapshot-ids {{snap-0abcdef1234567890}} \
       --query Snapshots[].State \
       --output text
   ```

   下面是示例输出。

   ```
   completed
   ```

1. 要创建新的 AMI，请使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 命令。使用 **CreateSnapshot** 输出中 `SnapshotId` 的值。
   + 要将启动模式设置为 UEFI，请添加 `--boot-mode` 参数，并指定值 `uefi`。

     ```
     aws ec2 register-image \
        --description "{{my image}}" \
        --name "{{my-image}}" \
        --block-device-mappings "DeviceName=/dev/sda1,Ebs={SnapshotId={{snap-0abcdef1234567890}},DeleteOnTermination=true}" \
        --root-device-name /dev/sda1 \
        --virtualization-type hvm \
        --ena-support \
        --boot-mode uefi
     ```
   + 要将启动模式设置为 `uefi-preferred`，请将 `--boot-mode` 的值设置为 `uefi-preferred`

     ```
     aws ec2 register-image \
        --description "{{my description}}" \
        --name "{{my-image}}" \
        --block-device-mappings "DeviceName=/dev/sda1,Ebs={SnapshotId={{snap-0abcdef1234567890}},DeleteOnTermination=true}" \
        --root-device-name /dev/sda1 \
        --virtualization-type hvm \
        --ena-support \
        --boot-mode uefi-preferred
     ```

1. （可选）要验证新创建的 AMI 是否具有您指定的启动模式，请使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

   ```
   aws ec2 describe-images \
       --image-id {{ami-1234567890abcdef0}} \
       --query Images[].BootMode \
       --output text
   ```

   下面是示例输出。

   ```
   uefi
   ```

------
#### [ PowerShell ]

**设置 AMI 的启动模式**

1. 对实例的卷和操作系统进行适当修改，以支持使用所选启动模式进行启动。所需的修改是特定于操作系统的。有关更多信息，请参阅操作系统的手册。
**警告**  
如果不执行此步骤，AMI 将无法使用。

1. 要查找实例的卷 ID，请使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

   ```
   (Get-EC2Instance `
       -InstanceId {{i-1234567890abcdef0}}).Instances.BlockDeviceMappings.Ebs
   ```

   下面是示例输出。

   ```
   AssociatedResource  : 
   AttachTime          : 7/11/2024 1:05:51 AM
   DeleteOnTermination : True
   Operator            : 
   Status              : attached
   VolumeId            : vol-01234567890abcdef
   ```

1. 要创建卷的快照，请使用 [New-EC2Snapshot](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Snapshot.html) cmdlet。使用上一步中的卷 ID。

   ```
   New-EC2Snapshot `
       -VolumeId {{vol-01234567890abcdef}} `
       -Description "{{my snapshot}}"
   ```

   下面是示例输出。

   ```
   AvailabilityZone          : 
   Description               : my snapshot
   Encrypted                 : False
   FullSnapshotSizeInBytes   : 0
   KmsKeyId                  : 
   OwnerId                   : 123456789012
   RestoreExpiryTime         : 
   SnapshotId                : snap-0abcdef1234567890
   SseType                   : 
   StartTime                 : 4/25/2025 6:08:59 PM
   State                     : pending
   StateMessage              : 
   VolumeId                  : vol-01234567890abcdef
   VolumeSize                : 30
   ```

1. 等到快照状态为 `completed` 后，继续执行下一步。要获取快照状态，请将 [Get-EC2Snapshot](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Snapshot.html) cmdlet 与上一步中的快照 ID 结合使用。

   ```
   (Get-EC2Snapshot `
       -SnapshotId {{snap-0abcdef1234567890}}).State.Value
   ```

   下面是示例输出。

   ```
   completed
   ```

1. 要创建新的 AMI，请使用 [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html) cmdlet。使用 **New-EC2Snapshot** 输出中 `SnapshotId` 的值。
   + 要将启动模式设置为 UEFI，请添加 `-BootMode` 参数，并指定值 `uefi`。

     ```
     $block = @{SnapshotId=snap-0abcdef1234567890}
     Register-EC2Image ` 
        -Description "{{my image}}" `
        -Name "{{my-image}}" `
        -BlockDeviceMapping @{DeviceName="{{/dev/xvda}}";Ebs=$block} `
        -RootDeviceName {{/dev/xvda}} `
        -EnaSupport $true `
        -BootMode uefi
     ```
   + 要将启动模式设置为 `uefi-preferred`，请将 `-BootMode` 的值设置为 `uefi-preferred`

     ```
     $block = @{SnapshotId=snap-0abcdef1234567890}
     Register-EC2Image ` 
        -Description "{{my image}}" `
        -Name "{{my-image}}" `
        -BlockDeviceMapping @{DeviceName="{{/dev/xvda}}";Ebs=$block} `
        -RootDeviceName {{/dev/xvda}} `
        -EnaSupport $true `
        -BootMode uefi-preferred
     ```

1. （可选）要验证新创建的 AMI 是否具有您指定的启动模式，请使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

   ```
   (Get-EC2Image `
       -ImageId {{ami-1234567890abcdef0}}).BootMode.Value
   ```

   下面是示例输出。

   ```
   uefi
   ```

------


# 为 NitroTPM 启用 Linux AMI
<a name="enable-nitrotpm-support-on-ami"></a>

要为实例启用 NitroTPM，必须使用启用了 NitroTPM 的 AMI 启动该实例。您必须在注册 Linux AMI 时为其配置 NitroTPM 支持。因为此后无法配置 NitroTPM 支持。

有关为获得 NitroTPM 支持而预配置的 Windows AMI 的列表，请参阅 [将 NitroTPM 与 Amazon EC2 实例结合使用的要求](enable-nitrotpm-prerequisites.md)。

必须使用 [RegisterImage](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RegisterImage.html) API 创建配置了 NitroTPM 的 AMI，因为无法使用 Amazon EC2 控制台或 VM Import/Export 完成此操作。

**为 NitroTPM 启用 Linux AMI**

1. 使用所需的 Linux AMI 启动临时实例。记下其根卷的 ID，该 ID 可在控制台中实例的**存储**选项卡上找到。

1. 实例进入 `running` 状态后，创建实例根卷的快照。有关更多信息，请参阅 [Create a snapshot of an EBS volume](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-create-snapshot.html)。

1. 将创建的快照注册为 AMI。在块设备映射中，指定您为根卷创建的快照。

   以下是 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 命令示例。对于 `--tpm-support`，请指定 `v2.0`。对于 `--boot-mode`，请指定 `uefi`。

   ```
   aws ec2 register-image \
       --name {{my-image}} \
       --boot-mode uefi \
       --architecture x86_64 \
       --root-device-name /dev/xvda \
       --block-device-mappings DeviceName=/dev/xvda,Ebs={SnapshotId={{snap-0abcdef1234567890}}} \
       --tpm-support v2.0
   ```

   以下是 [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html) cmdlet 的示例。

   ```
   $block = @{SnapshotId={{snap-0abcdef1234567890}}}
   Register-EC2Image `
       -Name {{my-image}} `
       -Architecture "x86_64" `
       -RootDeviceName /dev/xvda `
       -BlockDeviceMapping @{DeviceName="/dev/xvda";Ebs=$block} `
       -BootMode Uefi `
       -TpmSupport V20
   ```

1. 终止您在步骤 1 中启动的临时实例。
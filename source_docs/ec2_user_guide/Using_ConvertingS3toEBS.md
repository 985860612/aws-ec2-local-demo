

# 将 Amazon S3 支持的 AMI 转换为 EBS-backed AMI
<a name="Using_ConvertingS3toEBS"></a>

您可以将拥有的 Amazon S3 支持的 Linux AMI 转换为 Amazon EBS 支持的 Linux AMI。

**重要**  
您无法转换不属于自己的 AMI。

**将 Amazon S3 支持的 AMI 转换为 Amazon EBS-backed AMI**

1. 从 Amazon EBS-backed AMI 启动 Amazon Linux 实例。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。Amazon Linux 实例预先安装了 AWS CLI 和 AMI 工具。

1. 上传您用于将 Amazon S3 支持的 AMI 捆绑到实例的 X.509 私有密钥。我们使用此密钥确保只有您和 Amazon EC2 才能访问您的 AMI。

   1. 在您的实例上为 X.509 私有密钥创建临时目录，如下所示：

      ```
      [ec2-user ~]$ mkdir /tmp/cert
      ```

   1. 使用安全复制工具 (如 `/tmp/cert`scp[) 将您的 X.509 私有密钥从您的计算机复制到您实例上的 ](linux-file-transfer-scp.md) 目录。以下命令中的 {{my-private-key}} 参数是您用于通过 SSH 连接到实例的私有密钥。例如：

      ```
      you@your_computer:~ $ scp -i {{my-private-key}}.pem {{/path/to/pk-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem}} ec2-user@{{ec2-203-0-113-25.compute-1.amazonaws.com}}:/tmp/cert/
      pk-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem  100%  717     0.7KB/s   00:00
      ```

1. 配置环境变量以使用 AWS CLI。有关更多信息，请参阅 [Environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html)。

   1. （推荐）为您的 AWS 访问密钥、私有密钥和会话令牌设置环境变量。

      ```
      [ec2-user ~]$ export AWS_ACCESS_KEY_ID={{your_access_key_id}}
      [ec2-user ~]$ export AWS_SECRET_ACCESS_KEY={{your_secret_access_key}}
      [ec2-user ~]$ export AWS_SESSION_TOKEN={{your_session_token}}
      ```

   1. 为您的 AWS 访问密钥和私有密钥设置环境变量。

      ```
      [ec2-user ~]$ export AWS_ACCESS_KEY_ID={{your_access_key_id}}
      [ec2-user ~]$ export AWS_SECRET_ACCESS_KEY={{your_secret_access_key}}
      ```

1. 为新 AMI 准备 Amazon Elastic Block Store (Amazon EBS) 卷。

   1. 使用 [create-volume](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-volume.html) 命令在您的实例所在的同一可用区中创建空 EBS 卷。记下命令输出中的卷 ID。
**重要**  
 此 EBS 卷不小于原始实例存储根卷。

      ```
      aws ec2 create-volume \
          --size 10 \
          --region {{us-west-2}} \
          --availability-zone {{us-west-2b}}
      ```

   1. 使用 [attach-volume](https://docs.aws.amazon.com/cli/latest/reference/ec2/attach-volume.html) 命令将该卷附加到 Amazon EBS 支持的实例。

      ```
      aws ec2 attach-volume \
          --volume-id {{vol-01234567890abcdef}} \
          --instance-id {{i-1234567890abcdef0}} \
          --region {{us-west-2}}
      ```

1. 创建用于捆绑的文件夹。

   ```
   [ec2-user ~]$ mkdir /tmp/bundle
   ```

1. 使用 `/tmp/bundle` 命令将由实例存储支持的 AMI 的捆绑下载到 [ec2-download-bundle](ami-tools-commands.md#ami-download-bundle)。

   ```
   [ec2-user ~]$ ec2-download-bundle -b {{amzn-s3-demo-bucket}}/{{bundle_folder}}/{{bundle_name}} -m image.manifest.xml -a $AWS_ACCESS_KEY_ID -s $AWS_SECRET_ACCESS_KEY --privatekey {{/path/to/pk-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem}} -d /tmp/bundle
   ```

1. 使用 [ec2-unbundle](ami-tools-commands.md#ami-unbundle) 命令从捆绑重新构建映像文件。

   1. 将目录更改为捆绑文件夹。

      ```
      [ec2-user ~]$ cd /tmp/bundle/
      ```

   1. 运行 [ec2-unbundle](ami-tools-commands.md#ami-unbundle) 命令。

      ```
      [ec2-user bundle]$ ec2-unbundle -m image.manifest.xml --privatekey {{/path/to/pk-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem}}
      ```

1. 将文件从未捆绑的映像复制到新 EBS 卷。

   ```
   [ec2-user bundle]$ sudo dd if=/tmp/bundle/image of=/dev/sdb bs=1M
   ```

1. 探测所有未捆绑的新分区的卷。

   ```
   [ec2-user bundle]$ sudo partprobe /dev/sdb1
   ```

1. 列出块储存设备以查找要装载的设备名称。

   ```
   [ec2-user bundle]$ lsblk
   NAME         MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
   /dev/sda    202:0    0   8G  0 disk
   └─/dev/sda1 202:1    0   8G  0 part /
   /dev/sdb    202:80   0  10G  0 disk
   └─/dev/sdb1 202:81   0  10G  0 part
   ```

   在此示例中，要装载的分区是 `/dev/sdb1`，但您的设备名称可能有所不同。如果您的卷未分区，则要装载的设备类似于 `/dev/sdb` (没有设备分区尾部数字)。

1. 为新 EBS 卷创建装载点并装载该卷。

   ```
   [ec2-user bundle]$ sudo mkdir /mnt/ebs
   [ec2-user bundle]$ sudo mount {{/dev/sdb1}} /mnt/ebs
   ```

1. 使用您常用的文本编辑器（如 `/etc/fstab` 或 **vim**）在 EBS 卷上打开 **nano** 文件，然后删除实例存储（临时）卷的所有条目。因为 EBS 卷装载在 `/mnt/ebs` 上，所以 `fstab` 文件位于 `/mnt/ebs/etc/fstab` 处。

   ```
   [ec2-user bundle]$ sudo nano /mnt/ebs/etc/fstab
   #
   LABEL=/     /           ext4    defaults,noatime  1   1
   tmpfs       /dev/shm    tmpfs   defaults        0   0
   devpts      /dev/pts    devpts  gid=5,mode=620  0   0
   sysfs       /sys        sysfs   defaults        0   0
   proc        /proc       proc    defaults        0   0
   {{/dev/sdb        /media/ephemeral0       auto    defaults,comment=cloudconfig    0       2}}
   ```

   在本示例中，应删除最后一行。

1. 从实例中卸载和分离该卷。

   ```
   [ec2-user bundle]$ sudo umount /mnt/ebs
   [ec2-user bundle]$ aws ec2 detach-volume --volume-id {{vol-01234567890abcdef}} --region {{us-west-2}}
   ```

1. 按如下所示从新 EBS 卷创建 AMI。

   1. 创建新 EBS 卷的快照。

      ```
      [ec2-user bundle]$ aws ec2 create-snapshot --region {{us-west-2}} --description "{{your_snapshot_description}}" --volume-id {{vol-01234567890abcdef}}
      ```

   1. 检查快照是否完整。

      ```
      [ec2-user bundle]$ aws ec2 describe-snapshots --region {{us-west-2}} --snapshot-id {{snap-0abcdef1234567890}}
      ```

   1. 使用 `aki` 命令标识在原始 AMI 上使用的处理器架构、虚拟化类型和内核映像 (**describe-images**)。对于此步骤，您需要 Amazon S3 支持的原始 AMI 的 AMI ID。

      ```
      [ec2-user bundle]$ aws ec2 describe-images --region {{us-west-2}} --image-id {{ami-0abcdef1234567890}} --output text
      IMAGES	x86_64	amazon/amzn-ami-pv-2013.09.2.x86_64-s3	{{ami-8ef297be}}	amazon	available	public	machine	aki-fc8f11cc	instance-store	paravirtual	xen
      ```

      在此示例中，架构是 `x86_64`，内核映像 ID 是 `aki-fc8f11cc`。在以下步骤中使用这些值。如果上面命令的输出还列出 `ari` ID，请记下该 ID。

   1. 使用新 EBS 卷的快照 ID 和上一步中得到的值注册新 AMI。如果前一命令输出列出了 `ari` ID，请通过 `--ramdisk-id {{ari_id}}` 将其包括在后续命令中。

      ```
      [ec2-user bundle]$ aws ec2 register-image --region {{us-west-2}} --name {{your_new_ami_name}} --block-device-mappings DeviceName={{device-name}},Ebs={SnapshotId={{snap-0abcdef1234567890}}} --virtualization-type paravirtual --architecture x86_64 --kernel-id {{aki-fc8f11cc}} --root-device-name {{device-name}}
      ```

1. (可选) 测试了您可以从新 AMI 启动实例之后，您可以删除为此过程创建的 EBS 卷。

   ```
   aws ec2 delete-volume --volume-id {{vol-01234567890abcdef}}
   ```
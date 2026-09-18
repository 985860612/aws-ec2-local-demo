

# 创建 Amazon S3 支持的 AMI
<a name="creating-an-ami-instance-store"></a>

您在启动实例时指定的 AMI 决定根卷的类型

要创建 Amazon S3 支持的 Linux AMI，请通过从 Amazon S3 支持的现有 Linux AMI 启动的实例开始进行。根据您自己的需要自定义该实例之后，请捆绑卷并注册新 AMI，您可以使用该 AMI 启动具有这些自定义项的新实例。

您无法创建 Amazon S3 支持的 Windows AMI，因为 Windows AMI 不支持根卷的实例存储。

**重要**  
只有以下实例类型支持将实例存储卷作为根卷，并且需要 Amazon S3 支持的 AMI：C1、C3、D2、I2、M1、M2、M3、R3 和 X1。

用于 Amazon EBS-backed AMI 的 AMI 创建过程有所不同。有关更多信息，请参阅 [创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。

**Topics**
+ [AMI 创建概述](#process-creating-an-ami-instance-store)
+ [先决条件](#bundle-ami-prerequisites)
+ [从 Amazon Linux 实例创建 AMI](#amazon_linux_instructions)
+ [设置 Amazon EC2 AMI 工具](set-up-ami-tools.md)
+ [Amazon EC2 AMI 工具参考](ami-tools-commands.md)
+ [将 Amazon S3 支持的 AMI 转换为 EBS-backed AMI](Using_ConvertingS3toEBS.md)

## AMI 创建概述
<a name="process-creating-an-ami-instance-store"></a>

下图总结了从具有实例存储根卷的实例创建 AMI 的过程。

![创建 Amazon S3 支持的 Linux AMI。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ami_create_instance_store.png)


首先，从类似于您要创建的 AMI 的 AMI 启动实例。您可以连接到您的实例并进行自定义。根据您的需要设置好实例后，您可以捆绑它。完成捆绑过程需要几分钟的时间。该过程完成之后，您会得到一个捆绑，该捆绑由映像清单 (`image.manifest.xml`) 以及包含根卷模板的文件 (`image.part.`*xx*) 组成。接下来，将该捆绑上传到 Amazon S3 存储桶，然后注册您的 AMI。

**注意**  
要将对象上载到 Amazon S3 支持的 Linux AMI 的 S3 存储桶，必须为该存储桶启用 ACL。否则，Amazon EC2 将无法在要上载的对象上设置 ACL。如果您的目标存储桶使用存储桶拥有者强制执行的 S3 对象所有权设置，则这将不起作用，因为 ACL 已禁用。有关更多信息，请参阅[为您的存储桶控制对象所有权和禁用 ACL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html)。

当您使用新 AMI 启动实例时，我们会使用您上传到 Amazon S3 的捆绑为实例创建根卷。Amazon S3 中的捆绑使用的存储空间会使您的账户产生费用，直到将其删除。有关更多信息，请参阅 [取消注册 Amazon EC2 AMI](deregister-ami.md)。

如果除了根卷之外，您还向实例添加实例存储卷，则新 AMI 的块设备映射包含这些卷的信息，并且您从新 AMI 启动的实例的块设备映射自动包含这些卷的信息。有关更多信息，请参阅 [Amazon EC2 实例上卷的块设备映射](block-device-mapping-concepts.md)。

## 先决条件
<a name="bundle-ami-prerequisites"></a>

必须先完成以下任务才能创建 AMI：
+ 安装 AMI 工具。有关更多信息，请参阅[设置 Amazon EC2 AMI 工具](set-up-ami-tools.md)。
+ 安装 AWS CLI。有关更多信息，请参阅 [AWS CLI 入门](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)。
+ 请确保您具有用于捆绑的 S3 存储桶，并且您的存储桶已启用 ACL。有关配置 ACL 的更多信息，请参阅 [配置 ACL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/managing-acls.html)。
  + 要使用 AWS 管理控制台创建 S3 存储桶，请打开 Amazon S3 控制台（地址为 [https://console.aws.amazon.com/s3/](https://console.aws.amazon.com/s3/)），然后选择**创建存储桶**。
  + 要使用 AWS CLI 创建 S3 存储桶，请使用 [mb](https://docs.aws.amazon.com/cli/latest/reference/s3/mb.html) 命令。如果您安装的 AMI 工具版本为 1.5.18 或更高版本，则还可以使用 `ec2-upload-bundle` 命令创建 S3 存储桶。有关更多信息，请参阅 [ec2-upload-bundle](ami-tools-commands.md#ami-upload-bundle)。
+ 确保捆绑包中的文件未在 S3 存储桶中加密。如果您需要对 AMI 进行加密，则可以改用 EBS 支持的 AMI。有关更多信息，请参阅 [将加密与 EBS 支持的 AMI 结合使用](AMIEncryption.md)。
+ 确保您拥有您的 AWS 账户 ID。有关更多信息，请参阅 *AWS 账户管理参考指南*中的[查看 AWS 账户 身份](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-identifiers.html)。
+ 确保您拥有凭证以使用 AWS CLI。有关更多信息，请参阅《AWS Command Line Interface User Guide》**中的 [Authentication and access credentials for the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html)。
+ 确保您拥有 X.509 证书以及相应的私有密钥。
  + 如果您需要创建 X.509 证书，请参阅[管理签名证书](set-up-ami-tools.md#ami-tools-managing-certs)。X.509 证书和私有密钥用于加密和解密您的 AMI。
  + [中国（北京）] 使用 `$EC2_AMITOOL_HOME/etc/ec2/amitools/cert-ec2-cn-north-1.pem` 证书。
  + [AWS GovCloud（美国西部）] 使用 `$EC2_AMITOOL_HOME/etc/ec2/amitools/cert-ec2-gov.pem` 证书。
+ 连接到您的 实例并对其进行自定义。例如，您可以安装软件和应用程序、复制数据、删除临时文件及修改 Linux 配置。

## 从 Amazon Linux 实例创建 AMI
<a name="amazon_linux_instructions"></a>

以下过程介绍如何从运行 Amazon Linux 1 的具有实例存储根卷的实例创建 AMI。它们可能不适用于运行其他 Linux 发行版的实例。

**准备使用 AMI 工具 (仅限 HVM 实例)**

1. AMI 工具需要有 GRUB Legacy，才能正确启动。使用以下命令安装 GRUB：

   ```
   [ec2-user ~]$ sudo yum install -y grub
   ```

1. 使用以下命令安装分区管理程序包：

   ```
   [ec2-user ~]$ sudo yum install -y gdisk kpartx parted
   ```

**从具有实例存储根卷的 Amazon Linux 实例创建 AMI**

此过程假设您满足[先决条件](#bundle-ami-prerequisites)中的先决条件。

在以下示例中，将每个{{用户输入占位符}}替换为您自己的信息。

1. 将您的凭证上传到您的实例。我们使用这些凭证确保只有您和 Amazon EC2 才能访问您的 AMI。

   1. 在您的实例上为凭证创建临时目录，如下所示：

      ```
      [ec2-user ~]$ mkdir /tmp/cert
      ```

      这使您可以从创建的映像中排除您的凭证。

   1. 使用安全复制工具 (如 [scp](linux-file-transfer-scp.md)) 将 X.509 证书和对应的私有密钥从您的计算机复制到实例上的 `/tmp/cert` 目录。以下 `-i {{my-private-key}}.pem` 命令中的 **scp** 选项是您用于通过 SSH 连接到实例的私有密钥，而不是 X.509 私有密钥。例如：

      ```
      you@your_computer:~ $ scp -i {{my-private-key}}.pem {{/path/to/pk-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem}} {{/path/to/cert-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem}} ec2-user@{{ec2-203-0-113-25.compute-1.amazonaws.com}}:/tmp/cert/
      pk-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem  100%  717     0.7KB/s   00:00
      cert-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem  100%  685     0.7KB/s   00:00
      ```

   此外，由于这些是纯文本文件，所以您可以在文本编辑器中打开证书和密钥，并将其内容复制到 `/tmp/cert` 中的新文件。

1. <a name="step_with_bundle_path_amazon_linux"></a>通过从您的实例内部运行 [ec2-bundle-vol](ami-tools-commands.md#ami-bundle-vol) 命令，准备捆绑包以便上传到 Amazon S3。请务必指定 `-e` 选项以排除用于存储您的凭证的目录。默认情况下，捆绑过程不包括可能包含敏感信息的文件。这些文件包括 `*.sw`、`*.swo`、`*.swp`、`*.pem`、`*.priv`、`*id_rsa*`、`*id_dsa*` `*.gpg`、`*.jks`、`*/.ssh/authorized_keys` 和 `*/.bash_history`。要包括所有这些文件，请使用 `--no-filter` 选项。要包括其中部分文件，请使用 `--include` 选项。
**重要**  
默认情况下，AMI 捆绑过程在表示根卷的 `/tmp` 目录中创建经过压缩和加密的文件集合。如果您在 `/tmp` 中没有足够的可用磁盘空间来存储捆绑，则需要使用 `-d {{/path/to/bundle/storage}}` 选项指定不同的位置来存储捆绑。某些实例会在 `/mnt` 或 `/media/ephemeral0` 上装载您可以使用的临时存储，您还可以创建、连接和挂载新 Amazon EBS 卷以存储捆绑。有关更多信息，请参阅《Amazon EBS 用户指南》**中的[创建 Amazon EBS 卷](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-volume.html)。

   1. 您必须以根用户身份运行 **ec2-bundle-vol** 命令。对于大部分命令，您可以使用 **sudo** 获取提升的权限，但是在这种情况下，您应运行 **sudo -E su** 以保留环境变量。

      ```
      [ec2-user ~]$ sudo -E su
      ```

      请注意，在 bash 提示符下现在将您标识为根用户，并且美元符号已替换为哈希标签，表示您现在处于 root Shell 中：

      ```
      [root ec2-user]#
      ```

   1. 要创建 AMI 捆绑，请如下所示运行 [ec2-bundle-vol](ami-tools-commands.md#ami-bundle-vol) 命令：

      ```
      [root ec2-user]# ec2-bundle-vol -k /tmp/cert/{{pk-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem}} -c /tmp/cert/{{cert-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem}} -u {{123456789012}} -r x86_64 -e /tmp/cert --partition {{gpt}}
      ```
**注意**  
对于中国（北京）和 AWS GovCloud（美国西部）区域，请使用 `--ec2cert` 参数并根据[先决条件](#bundle-ami-prerequisites)指定证书。

      创建映像可能需要几分钟时间。该命令完成后，您的 `/tmp` (非默认) 目录会包含捆绑 (`image.manifest.xml` 以及多个 `image.part.`{{xx}} 文件)。

   1. 从 root Shell 退出。

      ```
      [root ec2-user]# exit
      ```

1. （可选）要添加更多实例存储卷，请在 `image.manifest.xml` 文件中为您的 AMI 编辑块储存设备映射。有关更多信息，请参阅[Amazon EC2 实例上卷的块设备映射](block-device-mapping-concepts.md)。

   1. 创建 `image.manifest.xml` 文件的备份。

      ```
      [ec2-user ~]$ sudo cp /tmp/image.manifest.xml /tmp/image.manifest.xml.bak
      ```

   1. 重新设置 `image.manifest.xml` 文件的格式，使其更易于阅读和编辑。

      ```
      [ec2-user ~]$ sudo xmllint --format /tmp/image.manifest.xml.bak > /tmp/image.manifest.xml
      ```

   1. 使用文本编辑器编辑 `image.manifest.xml` 中的块储存设备映射。以下示例显示了 `ephemeral1` 实例存储卷的一个新条目。
**注意**  
有关排除的文件的列表，请参阅[ec2-bundle-vol](ami-tools-commands.md#ami-bundle-vol)。

      ```
          <block_device_mapping>
            <mapping>
              <virtual>ami</virtual>
              <device>sda</device>
            </mapping>
            <mapping>
              <virtual>ephemeral0</virtual>
              <device>sdb</device>
            </mapping>
      {{      <mapping>
              <virtual>ephemeral1</virtual>
              <device>sdc</device>
            </mapping>}}
            <mapping>
              <virtual>root</virtual>
              <device>/dev/sda1</device>
            </mapping>
          </block_device_mapping>
      ```

   1. 保存 `image.manifest.xml` 文件并退出文本编辑器。

1. 要将捆绑上传到 Amazon S3，请如下所示运行 [ec2-upload-bundle](ami-tools-commands.md#ami-upload-bundle) 命令。

   ```
   [ec2-user ~]$ ec2-upload-bundle -b {{amzn-s3-demo-bucket}}/{{bundle_folder}}/{{bundle_name}} -m /tmp/image.manifest.xml -a {{your_access_key_id}} -s {{your_secret_access_key}}
   ```
**重要**  
要在US East (N. Virginia)之外的区域中注册 AMI，则必须指定带 `--region` 选项的目标区域和目标区域中已存在的存储桶路径或可在目标区域中创建的唯一存储桶路径。

1. （可选）将捆绑上传到 Amazon S3 之后，您可以使用以下 `/tmp` 命令将捆绑从实例上的 **rm** 目录中删除：

   ```
   [ec2-user ~]$ sudo rm /tmp/image.manifest.xml /tmp/image.part.* /tmp/image
   ```
**重要**  
如果您在 `-d {{/path/to/bundle/storage}}` 中使用 [Step 2](#step_with_bundle_path_amazon_linux) 选项指定了路径，请使用该路径，而不是 `/tmp`。

1. 要注册您的 AMI，请按以下所示运行 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 命令。

   ```
   [ec2-user ~]$ aws ec2 register-image --image-location {{amzn-s3-demo-bucket}}/{{bundle_folder}}/{{bundle_name}}/image.manifest.xml --name {{AMI_name}} --virtualization-type {{hvm}}
   ```
**重要**  
如果您先前为 [ec2-upload-bundle](ami-tools-commands.md#ami-upload-bundle) 命令指定了某个区域，请为该命令再次指定该区域。
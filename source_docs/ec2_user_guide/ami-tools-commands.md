

# Amazon EC2 AMI 工具参考
<a name="ami-tools-commands"></a>

您可以使用 AMI 工具命令创建和管理 Amazon S3 支持的 Linux AMI。要设置这些工具，请参阅[设置 Amazon EC2 AMI 工具](set-up-ami-tools.md)。

有关访问密钥的信息，请参阅《IAM 用户指南》**中的[管理 IAM 用户的访问密钥](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)。

**Topics**
+ [ec2-ami-tools-version](#ami-tools-version)
+ [ec2-bundle-image](#ami-bundle-image)
+ [ec2-bundle-vol](#ami-bundle-vol)
+ [ec2-delete-bundle](#ami-delete-bundle)
+ [ec2-download-bundle](#ami-download-bundle)
+ [ec2-migrate-manifest](#ami-migrate-manifest)
+ [ec2-unbundle](#ami-unbundle)
+ [ec2-upload-bundle](#ami-upload-bundle)
+ [AMI 工具的常用选项](#common-args-ami)

## ec2-ami-tools-version
<a name="ami-tools-version"></a>

### 说明
<a name="ami-tools-version-description"></a>

描述 AMI 工具的版本。

### 语法
<a name="ami-tools-version-request"></a>

**ec2-ami-tools-version**

### Output
<a name="ami-tools-version-output"></a>

版本信息。

### 示例
<a name="ami-tools-version-response"></a>

此示例命令显示所用 AMI 工具的版本信息。

```
[ec2-user ~]$ ec2-ami-tools-version
1.5.2 20071010
```

## ec2-bundle-image
<a name="ami-bundle-image"></a>

### 说明
<a name="bundle-image-description"></a>

通过回环文件中创建的操作系统映像创建 Amazon S3 支持的 Linux AMI。

### 语法
<a name="bundle-image-request"></a>

****ec2-bundle-image** -c {{path}} -k {{path}} -u {{account}} -i {{path}} [-d {{path}}] [--ec2cert {{path}}] [-r {{architecture}}] [--productcodes {{code1}},{{code2}},...] [-B {{mapping}}] [-p {{prefix}}]** 

### 选项
<a name="bundle-image-parameters"></a>

`-c, --cert` *路径*  
用户的 PEM 编码 RSA 公有密钥凭证文件。  
必需：是

`-k, --privatekey` *路径*  
指向 PEM 编码 RSA 密钥文件的路径。您需要指定此密钥解开此捆绑包，因此，请将其保存在安全的地方。请注意，不需要在您的 AWS 账户中注册该密钥。  
必需：是

`-u, --user ` *账户*  
用户的 AWS 账户 ID (不包含破折号)。  
必需：是

`-i, --image` *路径*  
指向待捆绑映像的路径。  
必需：是

`-d, --destination` *路径*  
要在其中创建捆绑的目录。  
默认值：`/tmp`  
必需：否

`--ec2cert` *路径*  
用于加密映像清单的 Amazon EC2 X.509 公有密钥凭证的路径。  
`us-gov-west-1` 和 `cn-north-1` 区域使用非默认公有密钥凭证，必须随该选项指定该证书的路径。该证书的路径因 AMI 工具的安装方法而异。对于 Amazon Linux，证书位于 `/opt/aws/amitools/ec2/etc/ec2/amitools/`。如果您将来自 RPM 或 ZIP 文件的 AMI 工具安装在了 [设置 Amazon EC2 AMI 工具](set-up-ami-tools.md) 中，则证书位于 `$EC2_AMITOOL_HOME/etc/ec2/amitools/`。  
必需：仅限 `us-gov-west-1` 和 `cn-north-1` 区域。

`-r, --arch` *架构*  
映像架构。如果您不在命令行上提供架构，则会在绑定开始时提示您输入架构。  
有效值：`i386` \| `x86_64`  
必需：否

`--productcodes`*code1,code2,...*  
在注册时附加到映像的产品代码，用逗号隔开。  
必需：否

`-B, --block-device-mapping` *映射*  
定义块储存设备向此 AMI 的实例公开的方式 (如果其实例类型支持指定的设备)。  
指定键值对的逗号分隔列表，每个键是虚拟名称，每个值是相应的设备名称。虚拟名称包括：  
+ `ami` — 实例所看到的根文件系统设备
+ `root` — 内核所看到的根文件系统设备
+ `swap` — 实例所看到的交换设备
+ `ephemeralN` — 第 N 个实例存储卷
必需：否

`-p, --prefix` *prefix*  
捆绑的 AMI 文件的文件名前缀。  
默认：映像文件的名称。例如，如果映像路径为 `/var/spool/my-image/version-2/debian.img`，则默认前缀为 `debian.img`。  
必需：否

`--kernel` *kernel\_id*  
已淘汰。使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 设置内核。  
必需：否

`--ramdisk` *ramdisk\_id*  
已淘汰。使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 设置 RAM 磁盘 (若需要)。  
必需：否

### Output
<a name="bundle-image-output"></a>

描述捆绑过程的阶段和状态的状态消息。

### 示例
<a name="bundle-image-response"></a>

此示例从回环文件中所创建的操作系统映像创建捆绑的 AMI。

```
[ec2-user ~]$ ec2-bundle-image -k pk-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem -c cert-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem -u 111122223333 -i image.img -d bundled/ -r x86_64
Please specify a value for arch [i386]: 
Bundling image file...
Splitting bundled/image.gz.crypt...
Created image.part.00
Created image.part.01
Created image.part.02
Created image.part.03
Created image.part.04
Created image.part.05
Created image.part.06
Created image.part.07
Created image.part.08
Created image.part.09
Created image.part.10
Created image.part.11
Created image.part.12
Created image.part.13
Created image.part.14
Generating digests for each part...
Digests generated.
Creating bundle manifest...
ec2-bundle-image complete.
```

## ec2-bundle-vol
<a name="ami-bundle-vol"></a>

### 说明
<a name="bundle-vol-description"></a>

通过对实例根卷的副本进行压缩、加密和签名来创建 Amazon S3 支持的 Linux AMI。

Amazon EC2 将尝试从实例继承产品代码、内核设置、RAM 磁盘设置和块储存设备映射。

默认情况下，捆绑过程不包括可能包含敏感信息的文件。这些文件包括 `*.sw`、`*.swo`、`*.swp`、`*.pem`、`*.priv`、`*id_rsa*`、`*id_dsa*` `*.gpg`、`*.jks`、`*/.ssh/authorized_keys` 和 `*/.bash_history`。要包括所有这些文件，请使用 `--no-filter` 选项。要包括其中部分文件，请使用 `--include` 选项。

有关更多信息，请参阅 [创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md)。

### 语法
<a name="bundle-vol-request"></a>

****ec2-bundle-vol** -c {{path}} -k {{path}} -u {{account}} [-d {{path}}] [--ec2cert {{path}}] [-r {{architecture}}] [--productcodes {{code1}},{{code2}},...] [-B {{mapping}}] [--all] [-e {{directory1}},{{directory2}},...] [-i {{file1}},{{file2}},...] [--no-filter] [-p {{prefix}}] [-s {{size}}] [--[no-]inherit] [-v {{volume}}] [-P {{type}}] [-S {{script}}] [--fstab {{path}}] [--generate-fstab] [--grub-config {{path}}]** 

### 选项
<a name="bundle-vol-parameters"></a>

`-c, --cert` *路径*  
用户的 PEM 编码 RSA 公有密钥凭证文件。  
必需：是

`-k, --privatekey ` *路径*   
用户的 PEM 编码 RSA 密钥文件的路径。  
必需：是

`-u, --user` *账户*  
用户的 AWS 账户 ID (不包含破折号)。  
必需：是

`-d, --destination` *destination*  
要在其中创建捆绑的目录。  
默认值：`/tmp`  
必需：否

`--ec2cert` *路径*  
用于加密映像清单的 Amazon EC2 X.509 公有密钥凭证的路径。  
`us-gov-west-1` 和 `cn-north-1` 区域使用非默认公有密钥凭证，必须随该选项指定该证书的路径。该证书的路径因 AMI 工具的安装方法而异。对于 Amazon Linux，证书位于 `/opt/aws/amitools/ec2/etc/ec2/amitools/`。如果您将来自 RPM 或 ZIP 文件的 AMI 工具安装在了 [设置 Amazon EC2 AMI 工具](set-up-ami-tools.md) 中，则证书位于 `$EC2_AMITOOL_HOME/etc/ec2/amitools/`。  
必需：仅限 `us-gov-west-1` 和 `cn-north-1` 区域。

`-r, --arch ` *架构*  
映像架构。如果您不在命令行上提供架构，则会在绑定开始时提示您提供架构。  
有效值：`i386` \| `x86_64`  
必需：否

`--productcodes`*code1,code2,...*  
在注册时附加到映像的产品代码，用逗号隔开。  
必需：否

`-B, --block-device-mapping` *映射*  
定义块储存设备向此 AMI 的实例公开的方式 (如果其实例类型支持指定的设备)。  
指定键值对的逗号分隔列表，每个键是虚拟名称，每个值是相应的设备名称。虚拟名称包括：  
+ `ami` — 实例所看到的根文件系统设备
+ `root` — 内核所看到的根文件系统设备
+ `swap` — 实例所看到的交换设备
+ `ephemeralN` — 第 N 个实例存储卷
必需：否

`-a, --all`  
捆绑所有目录，包括远程装载的文件系统上的目录。  
必需：否

`-e, --exclude `*directory1,directory2,...*  
要从捆绑操作中排除的绝对目录路径和文件的列表。此参数覆盖 `--all` 选项。指定排除时，随此参数列出的目录和子目录将不会随卷捆绑。  
必需：否

`-i, --include `*file1,file2,...*  
要在捆绑操作中包含的文件的列表。因为指定的文件可能包含敏感信息，若不指定则会从 AMI 中排除。  
必需：否

`--no-filter`  
如果指定，则我们不会因为文件可能包含敏感信息而将其从 AMI 排除。  
必需：否

`-p, --prefix ` *prefix*  
捆绑的 AMI 文件的文件名前缀。  
默认值：`image`  
必需：否

`-s, --size` *size*  
要创建的映像文件的大小，以 MB (1024 \* 1024 字节) 为单位。最大大小为 10240 MB。  
默认值：10240  
必需：否

`--[no-]inherit`  
指示映像是否应当继承实例的元数据 (默认为继承)。如果启用 `--inherit` 但实例元数据不可访问，则捆绑将失败。  
必需：否

`-v, --volume ` *体积*  
要从中创建捆绑的装载卷的绝对路径。  
默认值：根目录 (/)  
必需：否

`-P, --partition` *type*  
指示磁盘映像是否应使用分区表。如果不指定分区表类型，则默认使用卷的父块储存设备上使用的类型 (如果适用)，否则默认为 `gpt`。  
有效值：`mbr` \|`gpt` \|`none`  
必需：否

`-S, --script` *脚本*  
将在捆绑前运行的自定义脚本。该脚本必须获得一个参数，即卷的装载点。  
必需：否

`--fstab` *路径*  
要捆绑到映像中的 fstab 的路径。如果未指定，Amazon EC2 将捆绑 /etc/fstab。  
必需：否

`--generate-fstab`  
使用 Amazon EC2 提供的 fstab 捆绑卷。  
必需：否

`--grub-config`  
将捆绑到映像中的备用 GRUB 配置文件的路径。默认情况下，`ec2-bundle-vol` 预计克隆的映像上存在 `/boot/grub/menu.lst` 或 `/boot/grub/grub.conf`。该选项可让您指定备用 GRUB 配置文件的路径，将会复制该文件以覆盖默认值 (若存在)。  
必需：否

`--kernel` *kernel\_id*  
已淘汰。使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 设置内核。  
必需：否

`--ramdisk`*ramdisk\_id*  
已淘汰。使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 设置 RAM 磁盘 (若需要)。  
必需：否

### Output
<a name="bundle-vol-output"></a>

描述捆绑的阶段和状态的状态消息。

### 示例
<a name="bundle-vol-response"></a>

此示例通过对本机根文件系统进行压缩、加密和签名创建捆绑的 AMI。

```
[ec2-user ~]$ ec2-bundle-vol -d /mnt -k pk-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem -c cert-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem -u 111122223333 -r x86_64
  Copying / into the image file /mnt/image...
  Excluding:
       sys
       dev/shm
       proc
       dev/pts
       proc/sys/fs/binfmt_misc
       dev
       media
       mnt
       proc
       sys
       tmp/image
       mnt/img-mnt
  1+0 records in
  1+0 records out
  mke2fs 1.38 (30-Jun-2005)
  warning: 256 blocks unused.

  Splitting /mnt/image.gz.crypt...
  Created image.part.00
  Created image.part.01
  Created image.part.02
  Created image.part.03
  ...
  Created image.part.22
  Created image.part.23
  Generating digests for each part...
  Digests generated.
  Creating bundle manifest...
  Bundle Volume complete.
```

## ec2-delete-bundle
<a name="ami-delete-bundle"></a>

### 说明
<a name="delete-bundle-description"></a>

从 Amazon S3 存储中删除指定的捆绑。删除捆绑后，您不能从相应的 AMI 启动实例。

### 语法
<a name="delete-bundle-request"></a>

****ec2-delete-bundle** -b {{bucket}} -a {{access\_key\_id}} -s {{secret\_access\_key}} [-t {{token}}] [--url {{url}}] [--region {{region}}] [--sigv {{version}}] [-m {{path}}] [-p {{prefix}}] [--clear] [--retry] [-y]** 

### 选项
<a name="delete-bundle-parameters"></a>

`-b, --bucket `*存储桶*  
包含捆绑的 AMI 的 Amazon S3 存储桶的名称，后跟可选的以“/”分隔的路径前缀  
必需：是

`-a, --access-key` *access\_key\_id*  
AWS 访问密钥 ID。  
必需：是

`-s, --secret-key` *secret\_access\_key*  
AWS 秘密访问密钥。  
必需：是

`-t, --delegation-token` *token*  
传递到 AWS 请求的委托令牌。有关更多信息，请参阅《IAM 用户指南》**中的[临时安全凭证](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html)。  
必需：仅当使用临时安全凭证时是必需的。  
默认：`AWS_DELEGATION_TOKEN` 环境变量的值 (若已设置)。

`--region`*区域*  
要在请求签名中使用的区域。  
默认值：`us-east-1`  
必需：若使用签名版本 4 则必需

`--sigv`*版本*  
对请求进行签名时要使用的签名版本。  
有效值：`2` \| `4`  
默认值：`4`  
必需：否

`-m, --manifest`*path*  
清单文件的路径。  
必需：您必须指定 `--prefix` 或 `--manifest`。

`-p, --prefix` *prefix*  
捆绑的 AMI 文件名前缀。请提供完整前缀。例如，如果前缀是 image.img，请使用 `-p image.img` 而不是 `-p image`。  
必需：您必须指定 `--prefix` 或 `--manifest`。

`--clear`  
删除指定的捆绑之后删除 Amazon S3 存储桶 (若为空)。  
必需：否

`--retry`  
在所有 Amazon S3 错误后自动重试，每个操作最多五次。  
必需：否

`-y, --yes`  
自动假定所有提示的回答为 yes。  
必需：否

### Output
<a name="delete-bundle-output"></a>

Amazon EC2 显示状态消息以指示删除过程的阶段和状态。

### 示例
<a name="delete-bundle-response"></a>

此示例从 Amazon S3 删除捆绑。

```
[ec2-user ~]$ ec2-delete-bundle -b {{amzn-s3-demo-bucket}} -a {{your_access_key_id}} -s {{your_secret_access_key}}
Deleting files:
amzn-s3-demo-bucket/image.manifest.xml
amzn-s3-demo-bucket/image.part.00
amzn-s3-demo-bucket/image.part.01
amzn-s3-demo-bucket/image.part.02
amzn-s3-demo-bucket/image.part.03
amzn-s3-demo-bucket/image.part.04
amzn-s3-demo-bucket/image.part.05
amzn-s3-demo-bucket/image.part.06
Continue? [y/n]
y
Deleted amzn-s3-demo-bucket/image.manifest.xml
Deleted amzn-s3-demo-bucket/image.part.00
Deleted amzn-s3-demo-bucket/image.part.01
Deleted amzn-s3-demo-bucket/image.part.02
Deleted amzn-s3-demo-bucket/image.part.03
Deleted amzn-s3-demo-bucket/image.part.04
Deleted amzn-s3-demo-bucket/image.part.05
Deleted amzn-s3-demo-bucket/image.part.06
ec2-delete-bundle complete.
```

## ec2-download-bundle
<a name="ami-download-bundle"></a>

### 说明
<a name="download-bundle-description"></a>

从 Amazon S3 存储下载指定的 Amazon S3 支持的 Linux AMIs。

### 语法
<a name="download-bundle-request"></a>

****ec2-download-bundle** -b {{bucket}} -a {{access\_key\_id}} -s {{secret\_access\_key}} -k {{path}} [--url {{url}}] [--region {{region}}] [--sigv {{version}}] [-m {{file}}] [-p {{prefix}}] [-d {{directory}}] [--retry]** 

### 选项
<a name="download-bundle-parameters"></a>

`-b, --bucket` *存储桶*  
捆绑所在的 Amazon S3 存储桶的名称，后跟可选的以“/”分隔的路径前缀。  
必需：是

`-a, --access-key` *access\_key\_id*  
AWS 访问密钥 ID。  
必需：是

`-s, --secret-key` *secret\_access\_key*  
AWS 秘密访问密钥。  
必需：是

`-k, --privatekey` *路径*  
用于解密清单的私有密钥。  
必需：是

`--url` *url*  
Amazon S3 服务 URL。  
默认值：`https://s3.amazonaws.com/`  
必需：否

`--region` *region*  
要在请求签名中使用的区域。  
默认值：`us-east-1`  
必需：若使用签名版本 4 则必需

`--sigv` *version*  
对请求进行签名时要使用的签名版本。  
有效值：`2` \| `4`  
默认值：`4`  
必需：否

`-m, --manifest` *file*  
清单文件的名称 (无路径)。我们建议您指定清单 (`-m`) 或前缀 (`-p`)。  
必需：否

`-p, --prefix ` *prefix*  
捆绑的 AMI 文件的文件名前缀。  
默认值：`image`  
必需：否

`-d, --directory ` *directory*  
保存下载的捆绑的目录。该目录必须存在。  
默认：当前工作目录。  
必需：否

 `--retry`   
在所有 Amazon S3 错误后自动重试，每个操作最多五次。  
必需：否

### Output
<a name="download-bundle-output"></a>

将显示指示下载过程各个阶段的状态消息。

### 示例
<a name="download-bundle-response"></a>

此示例创建 `bundled` 目录（使用 Linux **mkdir** 命令）并从 `amzn-s3-demo-bucket` Amazon S3 存储桶下载捆绑。

```
[ec2-user ~]$ mkdir bundled
[ec2-user ~]$ ec2-download-bundle -b amzn-s3-demo-bucket/bundles/bundle_name -m image.manifest.xml -a {{your_access_key_id}} -s {{your_secret_access_key}} -k pk-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem -d mybundle
Downloading manifest image.manifest.xml from amzn-s3-demo-bucket to mybundle/image.manifest.xml ...
Downloading part image.part.00 from amzn-s3-demo-bucket/bundles/bundle_name to mybundle/image.part.00 ...
Downloaded image.part.00 from amzn-s3-demo-bucket
Downloading part image.part.01 from amzn-s3-demo-bucket/bundles/bundle_name to mybundle/image.part.01 ...
Downloaded image.part.01 from amzn-s3-demo-bucket
Downloading part image.part.02 from amzn-s3-demo-bucket/bundles/bundle_name to mybundle/image.part.02 ...
Downloaded image.part.02 from amzn-s3-demo-bucket
Downloading part image.part.03 from amzn-s3-demo-bucket/bundles/bundle_name to mybundle/image.part.03 ...
Downloaded image.part.03 from amzn-s3-demo-bucket
Downloading part image.part.04 from amzn-s3-demo-bucket/bundles/bundle_name to mybundle/image.part.04 ...
Downloaded image.part.04 from amzn-s3-demo-bucket
Downloading part image.part.05 from amzn-s3-demo-bucket/bundles/bundle_name to mybundle/image.part.05 ...
Downloaded image.part.05 from amzn-s3-demo-bucket
Downloading part image.part.06 from amzn-s3-demo-bucket/bundles/bundle_name to mybundle/image.part.06 ...
Downloaded image.part.06 from amzn-s3-demo-bucket
```

## ec2-migrate-manifest
<a name="ami-migrate-manifest"></a>

### 说明
<a name="migrate-manifest-description"></a>

修改 Amazon S3 支持的 Linux AMI（例如，其证书、内核和 RAM 磁盘）以使其支持其他区域。

### 语法
<a name="migrate-manifest-request"></a>

****ec2-migrate-manifest** -c {{path}} -k {{path}} -m {{path}} {(-a {{access\_key\_id}} -s {{secret\_access\_key}} --region {{region}}) \| (--no-mapping)} [--ec2cert {{ec2\_cert\_path}}] [--kernel {{kernel-id}}] [--ramdisk {{ramdisk\_id}}]** 

### 选项
<a name="migrate-manifest-parameters"></a>

`-c, --cert` *路径*  
用户的 PEM 编码 RSA 公有密钥凭证文件。  
必需：是

`-k, --privatekey` *路径*  
用户的 PEM 编码 RSA 密钥文件的路径。  
必需：是

`--manifest` *路径*  
清单文件的路径。  
必需：是

`-a, --access-key` *access\_key\_id*  
AWS 访问密钥 ID。  
必需：若使用自动映射则必需。

`-s, --secret-key ` *secret\_access\_key*  
AWS 秘密访问密钥。  
必需：若使用自动映射则必需。

`--region` *region*  
要在映射文件中查找的区域。  
必需：若使用自动映射则必需。

`--no-mapping`  
禁用内核和 RAM 磁盘的自动映射。  
 迁移期间，Amazon EC2 会将清单文件中的内核和 RAM 磁盘替换为目标区域指定的内核和 RAM 磁盘。除非提供了 `--no-mapping` 参数，否则 `ec2-migrate-bundle` 便可能使用 `DescribeRegions` 和 `DescribeImages` 操作执行自动映射。  
必需：若您不提供用于自动映射的 `-a`、`-s` 和 `--region` 选项，则必需。

`--ec2cert` *路径*  
用于加密映像清单的 Amazon EC2 X.509 公有密钥凭证的路径。  
`us-gov-west-1` 和 `cn-north-1` 区域使用非默认公有密钥凭证，必须随该选项指定该证书的路径。该证书的路径因 AMI 工具的安装方法而异。对于 Amazon Linux，证书位于 `/opt/aws/amitools/ec2/etc/ec2/amitools/`。如果您将来自 ZIP 文件的 AMI 工具安装在 [设置 Amazon EC2 AMI 工具](set-up-ami-tools.md) 中，则证书位于 `$EC2_AMITOOL_HOME/etc/ec2/amitools/`。  
必需：仅限 `us-gov-west-1` 和 `cn-north-1` 区域。

`--kernel` *kernel\_id*  
要选择的内核的 ID。  
我们建议您使用 PV-GRUB 而不是内核和 RAM 磁盘。有关更多信息，请参阅《Amazon Linux 2 User Guide》**中的 [User provided kernels](https://docs.aws.amazon.com/linux/al2/ug/UserProvidedKernels.html)。
必需：否

`--ramdisk` *ramdisk\_id*  
供选择的 RAM 磁盘的 ID。  
我们建议您使用 PV-GRUB 而不是内核和 RAM 磁盘。有关更多信息，请参阅《Amazon Linux 2 User Guide》**中的 [User provided kernels](https://docs.aws.amazon.com/linux/al2/ug/UserProvidedKernels.html)。
必需：否

### Output
<a name="migrate-manifest-output"></a>

描述捆绑过程的阶段和状态的状态消息。

### 示例
<a name="migrate-manifest-response"></a>

此示例将 `my-ami.manifest.xml` 清单中指定的 AMI 从美国复制到欧洲。

```
[ec2-user ~]$ ec2-migrate-manifest --manifest my-ami.manifest.xml --cert cert-HKZYKTAIG2ECMXYIBH3HXV4ZBZQ55CLO.pem --privatekey pk-HKZYKTAIG2ECMXYIBH3HXV4ZBZQ55CLO.pem --region eu-west-1 

Backing up manifest...
Successfully migrated my-ami.manifest.xml It is now suitable for use in eu-west-1.
```

## ec2-unbundle
<a name="ami-unbundle"></a>

### 说明
<a name="unbundle-description"></a>

从 Amazon S3 支持的 Linux AMI 重新创建捆绑。

### 语法
<a name="unbundle-request"></a>

****ec2-unbundle** -k {{path}} -m {{path}} [-s {{source\_directory}}] [-d {{destination\_directory}}]** 

### 选项
<a name="unbundle-parameters"></a>

`-k, --privatekey` *路径*  
您的 PEM 编码 RSA 密钥文件的路径。  
必需：是

`-m, --manifest` *路径*  
清单文件的路径。  
必需：是

`-s, --source` *source\_directory*  
包含捆绑的目录。  
默认：当前目录。  
必需：否

`-d, --destination` *destination\_directory*  
将 AMI 解绑到的目录。目标目录必须存在。  
默认：当前目录。  
必需：否

### 示例
<a name="unbundle-response"></a>

此 Linux 和 UNIX 示例解绑 `image.manifest.xml` 文件中指定的 AMI。

```
[ec2-user ~]$ mkdir unbundled
$ ec2-unbundle -m mybundle/image.manifest.xml -k pk-HKZYKTAIG2ECMXYIBH3HXV4ZBEXAMPLE.pem -s mybundle -d unbundled
$ ls -l unbundled
total 1025008
-rw-r--r-- 1 root root 1048578048 Aug 25 23:46 image.img
```

### Output
<a name="unbundle-output"></a>

将显示指示解绑过程各个阶段的状态消息。

## ec2-upload-bundle
<a name="ami-upload-bundle"></a>

### 说明
<a name="upload-bundle-description"></a>

将 Amazon S3 支持的 Linux AMI 的捆绑上载到 Amazon S3，并在上载的对象上设置相应的访问控制列表（ACL）。有关更多信息，请参阅 [创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md)。

**注意**  
要将对象上载到 Amazon S3 支持的 Linux AMI 的 S3 存储桶，必须为该存储桶启用 ACL。否则，Amazon EC2 将无法在要上载的对象上设置 ACL。如果您的目标存储桶使用存储桶拥有者强制执行的 S3 对象所有权设置，则这将不起作用，因为 ACL 已禁用。有关更多信息，请参阅[为您的存储桶控制对象所有权和禁用 ACL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html)。

### 语法
<a name="upload-bundle-request"></a>

****ec2-upload-bundle** -b {{bucket}} -a {{access\_key\_id}} -s {{secret\_access\_key}} [-t {{token}}] -m {{path}} [--url {{url}}] [--region {{region}}] [--sigv {{version}}] [--acl {{acl}}] [-d {{directory}}] [--part {{part}}] [--retry] [--skipmanifest]** 

### 选项
<a name="upload-bundle-parameters"></a>

`-b, --bucket` *存储桶*  
用于存储捆绑的 Amazon S3 存储桶的名称，后跟可选的以“/”分隔的路径前缀。如果存储桶不存在，则创建一个 (若存储桶名称可用)。此外，如果存储桶不存在且 AMI 工具版本为 1.5.18 或更高版本，则此命令会为存储桶设置 ACL。  
是否必需：是

`-a, --access-key` *access\_key\_id*  
您的 AWS 访问密钥 ID。  
必需：是

`-s, --secret-key` *secret\_access\_key*  
您的 AWS 秘密访问密钥。  
必需：是

`-t, --delegation-token` *token*  
传递到 AWS 请求的委托令牌。有关更多信息，请参阅《IAM 用户指南》**中的[临时安全凭证](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html)。  
必需：仅当使用临时安全凭证时是必需的。  
默认：`AWS_DELEGATION_TOKEN` 环境变量的值 (若已设置)。

`-m, --manifest` *路径*  
清单文件的路径。清单文件是在捆绑过程中创建的，可以在包含捆绑的目录中找到。  
必需：是

`--url` *url*  
已淘汰。请使用 `--region` 选项，除非您的存储桶被限制到 `EU` 位置 (且不是 `eu-west-1`)。`--location` 标记是确定该特定位置限制的唯一途径。  
Amazon S3 终端节点服务 URL。  
默认值：`https://s3.amazonaws.com/`  
必需：否

`--region` *region*  
要在请求签名中为目标 S3 存储桶使用的区域。  
+ 如果存储桶不存在，您也没有指定区域，则该工具将创建无位置限制的存储桶（在 `us-east-1` 中）。
+ 如果存储桶不存在，而您指定了区域，则该工具将在指定区域创建存储桶。
+ 如果存储桶存在，而您没有指定区域，则该工具将使用存储桶的位置。
+ 如果存储桶存在，并且您指定 `us-east-1` 为区域，则该工具将使用存储桶的实际位置而不会显示任何错误消息，并将覆盖任何现有的匹配文件。
+ 如果存储桶存在，并且您指定与存储桶的实际位置不符的区域（非 `us-east-1`），则该工具将报错退出。
如果您的存储桶被限制到 `EU` 位置 (不是 `eu-west-1`)，请改用 `--location` 标记。`--location` 标记是确定该特定位置限制的唯一途径。  
默认值：`us-east-1`  
必需：若使用签名版本 4 则必需

`--sigv` *version*  
对请求进行签名时要使用的签名版本。  
有效值：`2` \| `4`  
默认值：`4`  
必需：否

`--acl` *acl*  
捆绑的映像的访问控制列表策略。  
有效值：`public-read` \| `aws-exec-read`  
默认值：`aws-exec-read`  
必需：否

`-d, --directory` *directory*  
包含捆绑的 AMI 段的目录。  
默认：包含清单文件的目录 (参阅 `-m` 选项)。  
必需：否

`--part` *part*  
开始上传指定的段及所有后续段。例如：`--part 04`。  
必需：否

`--retry`  
在所有 Amazon S3 错误后自动重试，每个操作最多五次。  
必需：否

`--skipmanifest`  
不上传清单。  
必需：否

`--location` *位置*  
已淘汰。请使用 `--region` 选项，除非您的存储桶被限制到 `EU` 位置 (且不是 `eu-west-1`)。`--location` 标记是确定该特定位置限制的唯一途径。  
目标 Amazon S3 存储桶的位置限制。如果存储桶存在，而您指定的位置与存储桶的实际位置不符，则该工具将报错退出。如果存储桶存在，而您没有指定位置，则该工具将使用存储桶的位置。如果存储桶不存在，而您指定了位置，则该工具将在指定位置创建存储桶。如果存储桶不存在，您也没有指定位置，则该工具将创建无位置限制的存储桶 (在 `us-east-1` 中)。  
默认：如果指定 `--region`，则将位置设置为该指定区域。如果未指定 `--region`，则位置默认为 `us-east-1`。  
必需：否

### Output
<a name="upload-bundle-output"></a>

Amazon EC2 显示状态消息以指示上传过程的阶段的状态。

### 示例
<a name="upload-bundle-response"></a>

此示例上传 `image.manifest.xml` 清单所指定的捆绑。

```
[ec2-user ~]$ ec2-upload-bundle -b amzn-s3-demo-bucket/bundles/bundle_name -m image.manifest.xml -a {{your_access_key_id}} -s {{your_secret_access_key}}
Creating bucket...
Uploading bundled image parts to the S3 bucket amzn-s3-demo-bucket ...
Uploaded image.part.00
Uploaded image.part.01
Uploaded image.part.02
Uploaded image.part.03
Uploaded image.part.04
Uploaded image.part.05
Uploaded image.part.06
Uploaded image.part.07
Uploaded image.part.08
Uploaded image.part.09
Uploaded image.part.10
Uploaded image.part.11
Uploaded image.part.12
Uploaded image.part.13
Uploaded image.part.14
Uploading manifest ...
Uploaded manifest.
Bundle upload completed.
```

## AMI 工具的常用选项
<a name="common-args-ami"></a>

大多数 AMI 工具接受以下可选参数。

`--help, -h`  
显示帮助消息。

`--version`  
显示版本和版权声明。

`--manual`  
显示手动输入。

`--batch`  
以批处理模式运行，不显示交互提示。

`--debug`  
显示对故障排除可能有帮助的信息。


# 将 Amazon S3 与 Amazon EC2 实例结合使用
<a name="AmazonS3"></a>

Amazon Simple Storage Service（Amazon S3）是一种对象存储服务，提供行业领先的可扩展性、数据可用性、安全性和性能。您可以使用 Amazon S3 为数据湖、网站、备份和大数据分析等一系列用例存储和检索任意数量的数据，这些数据可以来自 Amazon EC2 实例或互联网上的任何地方。有关更多信息，请参阅[什么是 Amazon S3？](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)

有两种方法可以从 Amazon EC2 实例访问 Amazon S3 数据：
+ **文件访问**：使用 [Amazon S3 Files](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-files.html) 将 S3 存储桶作为高性能文件系统挂载到实例。
+ **对象访问**：使用 [Amazon S3 API](https://docs.aws.amazon.com/AmazonS3/latest/API/)、AWS CLI、AWS SDK 或 wget 等工具在 S3 之间复制对象。

## 使用 Amazon S3 Files 进行文件访问
<a name="S3FilesAccess"></a>

Amazon S3 Files 是一个无服务器文件系统，允许您将 S3 通用存储桶作为高性能文件系统挂载到计算实例。借助 S3 Files，您可以通过本地挂载路径上的标准文件系统操作（例如读取和写入），将 S3 对象作为文件进行访问。

您可以在启动时或启动后正在运行的实例上，将 S3 文件系统挂载到 EC2 实例。

**先决条件**

在使用 EC2 实例设置 S3 Files 之前，务必先满足以下条件：
+ 拥有一个 S3 文件系统，以及至少一个处于可用状态的挂载目标。有关创建 S3 文件系统的信息，请参阅《Amazon S3 用户指南**》中的[使用 Amazon S3 Files](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-files.html)。
+ EC2 Linux 实例附加到实例配置文件。有关挂载文件系统所需权限的信息，请参阅《Amazon S3 用户指南**》中的 [IAM 角色和策略](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-files-prereq-policies.html#s3-files-prereq-iam)。
+ 安全组允许实例与文件系统挂载目标之间的 NFS 流量（端口 2049）。有关所需安全组设置的信息，请参阅《Amazon S3 用户指南**》中的[安全组](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-files-prereq-policies.html#s3-files-prereq-security-groups)。

**在启动时使用 EC2 控制台将文件系统挂载到 EC2 实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择**启动实例**。

1. 在 **Network settings**（网络设置）下，执行以下操作：

   1. 选择**编辑**。

   1. 对于 **Subnet (子网)**，选择一个子网。

   1. 选择默认安全组，以确保 EC2 实例可以访问 S3 文件系统。您不能使用该安全组通过安全外壳 (SSH) 访问您的 EC2 实例。要通过 SSH 进行访问，您可以稍后编辑默认安全组，并添加一个允许 SSH 的规则/新安全组。您可以使用以下设置：

      1. **类型：**SSH 

      1. **协议**：TCP 

      1. **端口范围：**22 

      1. **源：**任何位置 0.0.0.0/0

1. 在**配置存储**下，执行以下操作：

   1. 在**文件系统**下，选择 **S3 Files**。

   1. 请选择 **Add shared file system**（添加共享文件系统）。

   1. 对于 **S3 文件系统**，文件系统会根据您在网络设置中选择的子网显示在可用区中。选择要挂载的 S3 文件系统。如果没有任何文件系统，请选择**创建新的文件系统**创建一个新的。

   1. 在 EC2 实例上输入要在其中挂载文件系统的本地挂载路径（例如 `/mnt/s3files`）。

   1. 将生成一个命令来挂载文件系统并将其添加到 fstab。您可以将此命令添加到**高级详细信息**下的**用户数据**字段中。然后，EC2 实例将配置为在启动或重启时挂载 S3 文件系统。您也可以在 EC2 实例启动后运行这些命令。

1. 在**高级详细信息**下，将实例配置文件附加到实例。IAM 角色必须具有挂载文件系统和访问 S3 存储桶的权限。有关所需权限的更多信息，请参阅《Amazon S3 用户指南**》中的 [IAM 角色和策略](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-files-prereq-policies.html#s3-files-prereq-iam)。

1. 选择**启动实例**。

   实例启动后，将安装所需的软件实用程序并挂载文件系统。您可以通过导航到本地挂载路径来查看文件系统。

**在启动后将文件系统挂载到 EC2 实例**

1. 通过 Secure Shell（SSH）或 EC2 控制台中的 EC2 Instance Connect [连接到 EC2 实例](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect.html)。

1. 要挂载 S3 文件系统，请使用挂载帮助程序 `amazon-efs-utils`。根据 Linux 发行版，使用以下命令之一安装 `amazon-efs-utils` 软件包：

   1. 如果您使用的是 Amazon Linux，请运行以下命令从 Amazon 存储库安装 efs-utils：

      ```
      sudo yum -y install amazon-efs-utils
      ```

   1. 如果您使用的是其他[受支持的 Linux 发行版](https://github.com/aws/efs-utils/?tab=readme-ov-file#efs-utils)，请运行以下命令：

      ```
      curl https://amazon-efs-utils.aws.com/efs-utils-installer.sh | sudo sh -s -- --install
      ```

   1. 有关其他 Linux 发行版，请参阅 *GitHub* 上的 [efs-utils](https://github.com/aws/efs-utils/?tab=readme-ov-file#on-other-linux-distributions) 存储库。

1. 使用以下命令为文件系统挂载点创建一个目录：

   ```
   sudo mkdir {path/to/mount}
   ```

1. 挂载 S3 文件系统：

   ```
   FS="{YOUR_FILE_SYSTEM_ID}"
   sudo mount -t s3files $FS:/ {path/to/mount}
   ```

1. 确认文件系统已挂载：

   ```
   df -h {path/to/mount}
   ```

**将 S3 存储桶中的对象作为文件查看**  
完成上述步骤后，您现在可以使用标准文件系统操作在本地挂载路径上将 S3 对象作为文件进行读取和写入。如果 S3 存储桶中有对象，则可以使用以下命令将其作为文件进行查看：

```
ls {path/to/mount}
```

## 基于对象的访问
<a name="objectaccess"></a>

您可以使用 S3 API、AWS CLI、AWS SDK 或标准 HTTP 工具在 Amazon S3 之间复制文件。如果您具有所需的权限，可以使用以下方法之一在 Amazon S3 和实例之间复制文件。

------
#### [ wget ]

**注意**  
此方法仅适用于公有对象。如果对象不是公有的，您会收到 `ERROR 403: Forbidden` 消息。如果您收到此错误，您必须使用 Amazon S3 控制台、AWS CLI、AWS API、AWS 开发工具包或 AWS Tools for Windows PowerShell，并且您必须拥有所需的权限。有关更多信息，请参阅《Amazon S3 用户指南》**中的 [Amazon S3 的身份和访问管理](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-iam.html)以及[下载对象](https://docs.aws.amazon.com/AmazonS3/latest/userguide/download-objects.html)。

**wget** 实用程序是一个 HTTP 和 FTP 客户端，可用于从 Amazon S3 下载公有对象。该实用工具在 Amazon Linux 和大多数其他分发版中均为默认安装，可在 Windows 上下载安装。要下载 Amazon S3 对象，请使用以下命令（替换要下载的对象的 URL）。

```
[ec2-user ~]$ wget https://{{amzn-s3-demo-bucket}}.s3.amazonaws.com/{{path-to-file}}
```

------
#### [ PowerShell ]

您可以使用 [AWS Tools for Windows PowerShell](https://aws.amazon.com/powershell/) 将对象移入和移出 Amazon S3。

您可以使用 [Copy-S3Object](https://docs.aws.amazon.com/powershell/latest/reference/items/Copy-S3Object.html) cmdlet 将 Amazon S3 对象复制到 Windows 实例，如下所示。

```
Copy-S3Object `
    -BucketName {{amzn-s3-demo-bucket}} `
    -Key {{path-to-file}} `
    -LocalFile {{my_copied_file.ext}}
```

您也可以在 Windows 实例上使用 Web 浏览器打开 Amazon S3 控制台。

------
#### [ AWS CLI ]

您可以使用 AWS Command Line Interface（AWS CLI）从 Amazon S3 下载受限制的项目和上传项目。有关更多信息（例如如何安装和配置这些工具），请参阅 [AWS Command Line Interface 详细信息页](https://aws.amazon.com/cli/)。

[aws s3 cp](https://docs.aws.amazon.com/cli/latest/reference/s3/cp.html) 命令与 Unix **cp** 命令类似。您可以将文件从 Amazon S3 复制到您的实例，从您的实例复制到 Amazon S3，可以将文件在不同 Amazon S3 位置之间复制。

使用以下命令可将对象从 Amazon S3 复制到实例：

```
aws s3 cp s3://{{amzn-s3-demo-bucket}}/{{my_folder}}/{{my_file.ext}} {{my_copied_file.ext}}
```

使用以下命令可将对象从实例重新复制到 Amazon S3：

```
aws s3 cp {{my_copied_file.ext}} s3://{{amzn-s3-demo-bucket}}/{{my_folder}}/{{my_file.ext}}
```

[aws s3 sync](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html) 命令可以将整个 Amazon S3 存储桶同步到本地目录位置。这可以用于下载数据集并使本地副本随远程集保持更新。如果您对 Amazon S3 存储桶拥有合适权限，则当您最后在命令中将源与目标位置反转时，可以将本地目录备份推送到云。

使用以下命令可将整个 Amazon S3 存储桶下载到实例上的本地目录：

```
aws s3 sync s3://{{amzn-s3-demo-source-bucket}} {{local_directory}}
```

------
#### [ Amazon S3 API ]

您可以使用 API 访问 Amazon S3 中的数据。您可以使用此 API 帮助开发应用程序，并且可以将其与其他 API 和 SDK 集成。有关更多信息，请参阅《Amazon Simple Storage Service API Reference》**中的 [Code examples for Amazon S3 using AWS SDKs](https://docs.aws.amazon.com/AmazonS3/latest/API/service_code_examples.html)。

------
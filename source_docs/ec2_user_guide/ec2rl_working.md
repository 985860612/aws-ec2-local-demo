

# 在 Amazon EC2 Linux 实例上运行 EC2Rescue 命令
<a name="ec2rl_working"></a>

EC2Rescue 是一个命令行工具。在 Linux 实例上安装 EC2Rescue 后，您可以通过运行 `./ec2rl help` 获得有关如何使用该工具的一般帮助。您可以通过运行 `./ec2rl list` 查看可用模块，也可以通过运行 `./ec2rl help {{module_name}}` 获得有关特定模块的帮助。

下面是您可以执行以便开始使用此工具的常见任务。

**Topics**
+ [运行 EC2Rescue 模块](#ec2rl_running_module)
+ [上传 EC2Rescue 模块结果](#ec2rl_uploading_results)
+ [创建 Amazon EC2 Linux 实例的备份](#ec2rl_creating_backups)

## 运行 EC2Rescue 模块
<a name="ec2rl_running_module"></a>

**运行所有 EC2Rescue 模块**  
使用 **./ec2rl run** 命令而不指定任何附加参数。有些模块需要根访问权限。如果您不是根用户，请在运行命令时使用 **sudo**。

```
./ec2rl run
```

**运行特定的 EC2Rescue 模块**  
使用 **./ec2rl run** 命令并为 `--only-modules` 指定要运行的模块的名称。有些模块需要*参数*才能使用。

```
./ec2rl run --only-modules={{module_name}} --{{arguments}}
```

例如，要运行 **dig** 模块查询 `amazon.com` 域，请使用以下命令。

```
./ec2rl run --only-modules=dig --domain=amazon.com
```

**查看 EC2Rescue 模块的结果**  
运行该模块，然后查看 `cat /var/tmp/ec2rl/{{logfile_location}}` 中的日志文件。例如，可在以下位置找到 **dig** 模块的日志文件：

```
cat /var/tmp/ec2rl/{{timestamp}}/mod_out/run/dig.log
```

## 上传 EC2Rescue 模块结果
<a name="ec2rl_uploading_results"></a>

如果 支持 请求 EC2Rescue 模块的结果，则可以使用 EC2Rescue 工具上传日志文件。您可以将结果上传到 支持 提供的位置或您自己的 Amazon S3 存储桶。

**将结果上传到 支持 提供的位置**  
使用 **./ec2rl upload** 命令。对于 `--upload-directory`，指定日志文件的位置。对于 `--support-url`，请指定 支持 提供的 URL。

```
./ec2rl upload --upload-directory=/var/tmp/ec2rl/{{logfile_location}} --support-url="{{url_provided_by_aws_support}}"
```

**将结果上传到 Amazon S3 存储桶**  
使用 **./ec2rl upload** 命令。对于 `--upload-directory`，指定日志文件的位置。对于 `--presigned-url`，为 S3 存储桶指定预签名 URL。有关为 Amazon S3 生成预签名 URL 的更多信息，请参阅[使用预签名 URL 上传对象](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)。

```
./ec2rl upload --upload-directory=/var/tmp/ec2rl/{{logfile_location}} --presigned-url="{{presigned_s3_url}}"
```

## 创建 Amazon EC2 Linux 实例的备份
<a name="ec2rl_creating_backups"></a>

您可以使用 EC2Rescue 通过创建 AMI 或创建其附加卷的快照来备份您的 Linux 实例。

**创建 AMI**  
使用 `./ec2rl run` 命令，并为 --`backup` 指定 `ami`。

```
./ec2rl run --backup=ami
```

**创建所有附加卷的多卷快照**  
使用 `./ec2rl run` 命令，并为 --`backup` 指定 `allvolumes`。

```
./ec2rl run --backup=allvolumes
```

**创建特定附加卷的快照**  
使用 `./ec2rl run` 命令，并为 --`backup` 指定要备份的卷的 ID。

```
./ec2rl run --backup={{vol-01234567890abcdef}}
```
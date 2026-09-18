

# 将 Amazon EFS 与 Amazon EC2 Linux 实例结合使用
<a name="AmazonEFS"></a>

**注意**  
Amazon EFS 在 Windows 实例上不受支持。

Amazon EFS 提供可扩展文件存储以供和 Amazon EC2 一起使用。您可以使用 EFS 文件系统作为在多个实例上运行的工作负载和应用程序的通用数据源。有关更多信息，请参阅[Amazon Elastic File System产品页](https://aws.amazon.com/efs/)。

本教程向您展示如何在实例启动期间，使用 Amazon EFS 快速创建向导创建和附加 Amazon EFS 文件系统。有关如何使用 Amazon EFS 控制台创建文件系统的教程，请参阅 [Amazon Elastic File System User Guide](https://docs.aws.amazon.com/efs/latest/ug/getting-started.html)（《Amazon File System 用户指南》）中的 *Getting started with Amazon Elastic File System*（Amazon Elastic File System 入门）。

**注意**  
使用 EFS 快速创建 EFS 文件系统时，将使用以下服务推荐设置创建文件系统：  
[已启用自动备份](https://docs.aws.amazon.com/efs/latest/ug/awsbackup.html)。
在所选 VPC 中[管理挂载目标](https://docs.aws.amazon.com/efs/latest/ug/accessing-fs.html)。
[通用性能模式](https://docs.aws.amazon.com/efs/latest/ug/performance.html#performancemodes)。
[突增吞吐量模式](https://docs.aws.amazon.com/efs/latest/ug/performance.html#throughput-modes)。
使用 Amazon EFS 的默认密钥 (`aws/elasticfilesystem`) [启用静态数据加密](https://docs.aws.amazon.com/efs/latest/ug/encryption-at-rest.html)。
使用 30 天策略[启用 Amazon EFS 生命周期管理](https://docs.aws.amazon.com/efs/latest/ug/lifecycle-management-efs.html)。

**Topics**
+ [使用 Amazon EFS 快速创建创建 EFS 文件系统](#quick-create)
+ [测试 EFS 文件系统](#efs-test-file-system)
+ [删除 EFS 文件系统](#efs-clean-up)

## 使用 Amazon EFS 快速创建创建 EFS 文件系统
<a name="quick-create"></a>

在使用 Amazon EC2 [启动实例向导](ec2-launch-instance-wizard.md)的 Amazon EFS 快速创建功能启动实例时，您可以创建 EFS 文件系统并将其挂载到自己的实例。

**使用 Amazon EFS 快速创建创建 EFS 文件系统**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择**启动实例**。

1. （可选）在**名称与标签**下，为**名称**输入名称以识别您的实例。

1. 在**应用程序和操作系统映像（亚马逊机器映像）**下，选择一个 Linux 操作系统；对于**亚马逊机器映像（AMI）**，选择一个 Linux AMI。

1. 在 **Instance type**（实例类型）下，为 **Instance type**（实例类型）选择实例类型，或保留默认设置。

1. （可选）在**密钥对（登录）**下，为**密钥对名称**选择一个现有密钥对或新建一个密钥对。

1. 在**网络设置**下，选择右侧的**编辑**；对于**子网**，选择一个子网。
**注意**  
必须先选择子网，才能添加 EFS 文件系统。

1. 在**配置存储**下，选择右下角的**编辑**，然后执行以下操作：

   1. 对于**文件系统**，确保选择 **EFS**，然后选择**创建新的共享文件系统**。

   1. 对于**文件系统名称**，输入 Amazon EFS 文件系统的名称，然后选择**创建文件系统**。

   1. 对于**挂载点**，指定自定义挂载点或保留默认设置。

   1. 要启用对文件系统的访问权限，请选择 **Automatically create and attach security groups**（自动创建并附加安全组）。选中此复选框后，将自动创建以下安全组，并将其附加到实例和文件系统的挂载目标：
      + 实例安全组：包括允许流量通过 NFS 2049 端口的出站规则，但不包括入站规则。
      + 文件系统挂载目标安全组 – 包括允许来自（上述）实例安全组的流量通过 NFS 2049 端口的入站规则，以及允许流量通过 NFS 2049 端口的出站规则。
**注意**  
您还可以选择手动创建并附加安全组。如果要手动创建并附加安全组，请取消选中 **Automatically create and attach the required security groups**（自动创建并附加所需的安全组）。

   1. 若要在实例启动时自动挂载共享文件系统，请选择 **Automatically mount shared file system by attaching required user data script**（通过附加所需的用户数据脚本自动挂载共享文件系统）。若要查看自动生成的用户数据，请展开 **Advanced details**（高级详细信息），然后向下滚动到 **User data**（用户数据）。
**注意**  
如果在选中此复选框之前添加了用户数据，则自动生成的用户数据将覆盖原始用户数据。

1. 请按需配置任何其他实例配置设置。

1. 在 **Summary**（摘要）面板中查看实例配置，然后选择 **Launch instance**（启动实例）。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

## 测试 EFS 文件系统
<a name="efs-test-file-system"></a>

您可以连接到实例并验证文件系统是否已挂载到您指定的目录（例如，/mnt/efs）。

**验证文件系统是否已装载**

1. 连接到您的实例。有关更多信息，请参阅 [使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)。

1. 从每个实例的终端窗口，运行 **df -T** 命令以验证是否已挂载 EFS 文件系统。

   ```
   $ df -T
   Filesystem     Type              1K-blocks    Used          Available Use% Mounted on
   /dev/xvda1     ext4                8123812 1949800            6073764  25% /
   devtmpfs       devtmpfs            4078468      56            4078412   1% /dev
   tmpfs          tmpfs               4089312       0            4089312   0% /dev/shm
   {{efs-dns}}        nfs4       9007199254740992       0   9007199254740992   0% {{/mnt/efs}}
   ```

   请注意，文件系统的名称（在示例输出中显示为 {{efs-dns}}）具有以下格式。

   ```
   {{file-system-id}}.efs.{{aws-region}}.amazonaws.com:/
   ```

1. （可选）在该实例的文件系统中创建文件，然后验证您是否可以从另一实例查看该文件。

   1. 在该实例中，运行以下命令来创建文件。

      ```
      $ sudo touch {{/mnt/efs}}/test-file.txt
      ```

   1. 在另一个实例中，运行以下命令来查看文件。

      ```
      $ ls {{/mnt/efs}}
      test-file.txt
      ```

## 删除 EFS 文件系统
<a name="efs-clean-up"></a>

如果您不再需要文件系统，可将其删除。

**要删除文件系统**

1. 访问 [https://console.aws.amazon.com/efs/](https://console.aws.amazon.com/efs/)，打开 Amazon Elastic File System 控制台。

1. 选择要删除的文件系统。

1. 选择 **Actions**、**Delete file system**。

1. 当系统提示您确认时，输入文件系统 ID 并选择**删除文件系统**。
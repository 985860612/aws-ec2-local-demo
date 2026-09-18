

# 将 Amazon FSx 与 Amazon EC2 实例结合使用
<a name="storage_fsx"></a>

借助 Amazon FSx 系列服务，可以轻松启动、运行和扩缩由常见的商业和开源文件系统提供支持的共享存储。您可以使用*新的启动实例向导*在启动时自动将以下类型的 Amazon FSx 文件系统附加到您的 Amazon EC2 实例：
+ 适用于 NetApp ONTAP 的 Amazon FSx 使用 NetApp ONTAP 的常见数据访问和管理功能在 AWS 云中提供完全托管式共享存储。
+ 适用于 OpenZFS 的 Amazon FSx 提供了由常见 OpenZFS 文件系统提供支持的完全托管的、经济高效的共享存储。

**注意**  
此功能仅在新启动实例向导中可用。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)
启动时无法挂载 适用于 Windows File Server 的 Amazon FSx 和适用于 Lustre 的 Amazon FSx 文件系统。启动后必须手动挂载这些文件系统。

您可以选择挂载先前创建的现有文件系统，也可以创建一个新的文件系统以在启动时挂载到实例。

**Topics**
+ [安全组和用户数据脚本](#sg-user-data)
+ [在启动时挂载 Amazon FSx 文件系统](#mount-fsx)

## 安全组和用户数据脚本
<a name="sg-user-data"></a>

当您使用启动实例向导将 Amazon FSx 文件系统挂载到实例时，您可以选择是否自动创建和附加启用对文件系统的访问所需的安全组，以及是否自动包含挂载文件系统和使其可用所需的用户数据脚本。

**Topics**
+ [安全组](#fsx-sg)
+ [用户数据脚本](#fsx-user-data)

### 安全组
<a name="fsx-sg"></a>

如果您选择自动创建启用对文件系统的访问所需的安全组，启动实例向导将创建并附加两个安全组 - 一个安全组附加到实例，另一个安全组附加到文件系统。有关安全组要求的更多信息，请参阅[使用 Amazon VPC 进行 FSx for ONTAP 文件系统访问控制](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/limit-access-security-groups.html)和[使用 Amazon VPC 进行 FSx for OpenZFS 文件系统访问控制](https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/limit-access-security-groups.html)。

我们将标签 `Name=instance-sg-{{1}}` 添加到已创建并附加到实例的安全组中。标签中的值在启动实例向导每次为 Amazon FSx 文件系统创建安全组时都会自动递增。

安全组包括以下输出规则，但不包括入站规则。


**出站规则**  

| 协议类型 | 端口号 | 目标 | 
| --- | --- | --- | 
| UDP | 111 | {{文件系统安全组}} | 
| UDP | 20001 – 20003 | {{文件系统安全组}} | 
| UDP | 4049 | {{文件系统安全组}} | 
| UDP | 2049 | {{文件系统安全组}} | 
| UDP | 635 | {{文件系统安全组}} | 
| UDP | 4045 – 4046 | {{文件系统安全组}} | 
| TCP | 4049 | {{文件系统安全组}} | 
| TCP | 635 | {{文件系统安全组}} | 
| TCP | 2049 | {{文件系统安全组}} | 
| TCP | 111 | {{文件系统安全组}} | 
| TCP | 4045 – 4046 | {{文件系统安全组}} | 
| TCP | 20001 – 20003 | {{文件系统安全组}} | 
| 全部 | 全部 | {{文件系统安全组}} | 

已创建并附加到文件系统的安全组都通过 `Name=fsx-sg-{{1}}` 进行标记。标签中的值在启动实例向导每次为 Amazon FSx 文件系统创建安全组时都会自动递增。

该安全组包括以下规则。


**入站规则**  

| 协议类型 | 端口号 | 来源 | 
| --- | --- | --- | 
| UDP | 2049 | {{实例安全组}} | 
| UDP | 20001 – 20003 | {{实例安全组}} | 
| UDP | 4049 | {{实例安全组}} | 
| UDP | 111 | {{实例安全组}} | 
| UDP | 635 | {{实例安全组}} | 
| UDP | 4045 – 4046 | {{实例安全组}} | 
| TCP | 4045 – 4046 | {{实例安全组}} | 
| TCP | 635 | {{实例安全组}} | 
| TCP | 2049 | {{实例安全组}} | 
| TCP | 4049 | {{实例安全组}} | 
| TCP | 20001 – 20003 | {{实例安全组}} | 
| TCP | 111 | {{实例安全组}} | 


**出站规则**  

| 协议类型 | 端口号 | 目标 | 
| --- | --- | --- | 
| 全部 | 全部 | 0.0.0.0/0 | 

### 用户数据脚本
<a name="fsx-user-data"></a>

如果您选择自动附加用户数据脚本，启动实例向导会将以下用户数据添加到实例。此脚本安装必要的软件包、挂载文件系统并更新您的实例设置，以便在实例重新启动时，文件系统将自动重新挂载。

```
#cloud-config
package_update: true
package_upgrade: true
runcmd:
- yum install -y nfs-utils
- apt-get -y install nfs-common
- {{svm_id_1}}={{svm_id}}
- {{file_system_id_1}}={{file_system_id}}
- {{vol_path_1}}={{/vol1}}
- {{fsx_mount_point_1}}={{/mnt/fsx/fs1}}
- mkdir -p "${{{fsx_mount_point_1}}}"
- if [ -z "${{svm_id_1}}" ]; then printf "\n${{{file_system_id_1}}}.fsx.{{eu-north-1}}.amazonaws.com:/${{{vol_path_1}}} ${{{fsx_mount_point_1}}} nfs4 nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport,_netdev 0 0\n" >> /etc/fstab; else printf "\n${{{svm_id_1}}}.${{{file_system_id_1}}}.fsx.{{eu-north-1}}.amazonaws.com:/${{{vol_path_1}}} ${{{fsx_mount_point_1}}} nfs4 nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport,_netdev 0 0\n" >> /etc/fstab; fi
- retryCnt=15; waitTime=30; while true; do mount -a -t nfs4 defaults; if [ $? = 0 ] || [ $retryCnt -lt 1 ]; then echo File system mounted successfully; break; fi; echo File system not available, retrying to mount.; ((retryCnt--)); sleep $waitTime; done;
```

## 在启动时挂载 Amazon FSx 文件系统
<a name="mount-fsx"></a>



**要在启动时挂载新的或现有的 Amazon FSx 文件系统**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Instances**（实例），然后选择 **Launch instance**（启动实例）以打开启动实例向导。

1. 在 **Application and OS Images**（应用程序和操作系统映像）部分中，请选择要使用的 AMI。

1. 在 **Instance type**（实例类型）部分中，选择实例类型。

1. 在 **Key pair**（密钥对）部分中，选择现有密钥对或创建新密钥对。

1. 在 **Network settings**（网络设置）部分，执行以下操作：

   1. 选择**编辑**。

   1. 如果您想**挂载现有文件系统**，对于 **Subnet**（子网），请选择文件系统的首选子网。我们建议您将实例作为文件系统的首选子网启动到同一可用区中，以优化性能。

      如果您想**创建新的文件系统**以挂载到实例，对于 **Subnet**（子网），请选择要在其中启动实例的子网。
**重要**  
您必须选择一个子网才能在新启动实例向导中启用 Amazon FSx 功能。如果不选择子网，将无法挂载现有文件系统或创建新的文件系统。

1. 在 **Storage**（存储）部分中，执行以下操作：

   1. 根据需要配置卷。

   1. 展开 **File systems**（文件系统）部分，然后选择 **FSx**。

   1. 请选择 **Add shared file system**（添加共享文件系统）。

   1. 对于 **File system**（文件系统），请选择要挂载的文件系统。
**注意**  
该列表显示所选区域内您账户中的所有 适用于 NetApp ONTAP 的 Amazon FSx 和适用于 OpenZFS 的 Amazon FSx 文件系统。

   1. 要自动创建并附加启用对文件系统的访问所需的安全组，请选择 **Automatically create and attach security groups**（自动创建和附加安全组）。如果您更喜欢手动创建安全组，请清除该复选框。有关更多信息，请参阅 [安全组](#fsx-sg)。

   1. 要自动附加挂载文件系统所需的用户数据脚本，请选择 **Automatically mount shared file system by attaching required user data script**（通过附加所需的数据用户数据脚本自动挂载共享文件系统）。如果更喜欢手动提供用户数据脚本，请清除该复选框。有关更多信息，请参阅 [用户数据脚本](#fsx-user-data)。

1. 在 **Advanced**（高级）部分中，根据需要配置其他实例设置。

1. 选择**启动**。


# 创建 Amazon EBS-backed AMI
<a name="creating-an-ami-ebs"></a>

您可以从 Amazon EC2 实例或从 Amazon EC2 实例的根卷快照创建自己的 Amazon EBS-backed AMI。

要从实例创建 Amazon EBS-backed AMI，请先使用现有的 Amazon EBS-backed AMI 启动一个实例。此 AMI 可以是从 AWS Marketplace 获得的 AMI，可以是使用 [VM Import/Export](https://docs.aws.amazon.com/vm-import/latest/userguide/what-is-vmimport.html) 创建的 AMI，也可以是能够访问的任何其他 AMI。自定义满足特定要求的实例后，创建新的 AMI 并加以注册。然后，即可使用新的 AMI 启动具有自定义项的新实例。

**注意**  
要创建支持 EC2 实例认证的 AMI，请参阅[可证明的 AMI](attestable-ami.md)。

下述过程适用于由加密的 Amazon Elastic Block Store (Amazon EBS) 卷（包括根卷）支持的 Amazon EC2 实例，也适用于未加密卷。

用于 Amazon S3 支持的 AMI 的 AMI 创建过程有所不同。有关更多信息，请参阅 [创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md)。

**Topics**
+ [关于从实例创建 AMI 的概述](#process-creating-an-ami-ebs)
+ [从实例创建 AMI](#how-to-create-ebs-ami)
+ [从快照创建 AMI](#creating-launching-ami-from-snapshot)

## 关于从实例创建 AMI 的概述
<a name="process-creating-an-ami-ebs"></a>

以下图表概述了从运行中的 EC2 实例创建 Amazon EBS-backed AMI 的流程：从现有 AMI 开始，启动实例，自定义该实例，从该实例创建新 AMI，并最终启动新 AMI 的实例。图中的数字与以下描述中的数字匹配。

![从实例创建 AMI 的工作流程。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/running-instance.png)


**1 – AMI \#1：从现有的 AMI 开始**  
查找类似于您要创建的 AMI 的现有 AMI。这可以是您从 AWS Marketplace 获得的 AMI、您使用 [VM Import/Export](https://docs.aws.amazon.com/vm-import/latest/userguide/what-is-vmimport.html) 创建的 AMI 或您可以访问的任何其他 AMI。您将根据自己的需求自定义此 AMI。  
在图中，**EBS 根卷快照 \#1** 表示 AMI 为 Amazon EBS-backed AMI，并且有关根卷的信息存储在此快照中。

**2 – 从现有 AMI 启动实例**  
配置 AMI 的方法是从您希望作为新 AMI 基础的 AMI 启动实例，然后自定义该实例（在图中以 **3** 表示）。然后，您将创建一个包含自定义项的新 AMI（在图中以 **4** 表示）。

**3 – EC2 实例 \#1：自定义实例**  
连接到您的实例并根据您的需求对其进行自定义。您的新 AMI 将包含这些自定义项。  
您可以对您的实例执行以下任何操作，以便自定义该实例：  
+ 安装软件和应用程序
+ 复制数据
+ 通过删除临时文件和对您的硬盘进行碎片整理来缩短启动时间
+ 附加其他 EBS 卷

**4 – 创建映像**  
当您从实例中创建 AMI 时，Amazon EC2 先切断实例的电源再创建 AMI，以确保创建过程中实例上的所有内容均停止并保持一致状态。如果您确信您的实例处于适合 AMI 创建的一致状态，则可以告知 Amazon EC2 不断电和重启实例。一些文件系统 (例如 XFS) 可以冻结和解冻活动，因此能在不重启实例的情况下安全创建映像。  
在 AMI 创建过程中，Amazon EC2 会创建您实例的根卷和附加到您实例的任何其他 EBS 卷的快照。在[注销 AMI](deregister-ami.md) 并删除快照之前，您需要支付快照的费用。如果有任何附加到实例的卷进行了加密，则新 AMI 只会在支持 Amazon EBS 加密的实例上成功启动。  
根据卷的大小，可能需要几分钟才能完成 AMI 创建过程 (有时长达 24 小时)。您可能会发现先创建卷的快照，然后再创建 AMI 后会更高效。这样，创建 AMI 时就只需创建小的增量快照，且创建过程完成得更快 (快照创建的总时间保持不变)。

**5 – AMI \#2：新 AMI**  
该过程完成之后，您便具有从实例的根卷创建的新 AMI 和快照（**快照 \#2**）。如果除了根卷之外，您还向实例添加了实例存储卷或 EBS 卷，则新 AMI 的块设备映射包含这些卷的信息。  
Amazon EC2 自动为您注册 AMI。

**6 – 从新 AMI 启动实例**  
您可以使用新 AMI 启动实例。

**7 – EC2 实例 \#2：新实例**  
当您使用新 AMI 启动实例时，Amazon EC2 会使用快照为实例的根卷创建新 EBS 卷。如果您在自定义实例时添加了实例存储卷或 EBS 卷，则新 AMI 的块设备映射包含这些卷的信息，并且您从新 AMI 启动的实例的块设备映射自动包含这些卷的信息。新实例的块设备映射中指定的实例存储卷是新的，不包含用于创建 AMI 的实例的实例存储卷中的任何数据。EBS 卷上的数据会持久保留。有关更多信息，请参阅[Amazon EC2 实例上卷的块设备映射](block-device-mapping-concepts.md)。  
当您从由 EBS 支持的 AMI 创建新实例时，应该先初始化其根卷及任何额外的 EBS 存储，然后再将其投入生产。有关更多信息，请参阅《Amazon EBS 用户指南》**中的[初始化 Amazon EBS 卷](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-initialize.html)。

## 从实例创建 AMI
<a name="how-to-create-ebs-ami"></a>

如果您有现有实例，则可以通过该实例创建 AMI。

------
#### [ Console ]

**创建 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择要从中创建 AMI 的实例，然后选择 **Actions**（操作）、**Image and templates**（映像和模板）、**Create image**（创建映像）。
**提示**  
如果该选项处于禁用状态，则表明您的实例不是由 Amazon EBS 支持的实例。

1. 在 **Create image**（创建映像）页面上，请指定以下信息：

   1. 对于 **Image name**（映像名称），请输入映像的唯一名称，最多 127 个字符。

   1. 对于 **Image description**（映像描述），输入映像的可选描述，最多 255 个字符。

   1. 对于**重启实例**，请保持选中该复选框（默认），或将其清除。
      + 如果选择**重启实例**，则当 Amazon EC2 创建新 AMI 时，会重启该实例，以便其可以在数据处于静态状态时拍摄附加卷的快照，以确保一致的状态。
      + 如果清除**重启实例**，则 Amazon EC2 创建新 AMI 时，不会关闭和重启实例。
**警告**  
如果您清除**重启实例**，则我们无法保证所创建映像的文件系统完整性。

   1. **Instance volumes**（实例卷）– 您可以修改根卷，并添加其他 Amazon EBS 和实例存储卷，如下所示：

      1. 根卷在第一行中定义。
         + 要更改根卷的大小，请在 ** Size (尺寸)** 中输入所需的值。
         + 如果选择 **Delete on Termination (终止时删除)**，则当您终止从此 AMI 创建的实例时，将删除 EBS 卷。如果取消选择 **Delete on Termination (终止时删除)**，则当您终止实例时，不会删除 EBS 卷。有关更多信息，请参阅[实例终止时保留数据](preserving-volumes-on-termination.md)。

      1. 要添加 EBS 卷，请选择 **Add New Volume**（添加新卷）（这将添加一个新行）。对于**存储类型**，选择 **EBS**，并填写行中的字段。当您从新的 AMI 启动实例时，额外的卷会自动附加到该实例。您必须格式化并挂载空卷。您必须挂载基于快照的卷。

      1. 要添加实例存储卷，请参阅 [将实例存储卷添加到 Amazon EC2 AMI](adding-instance-storage-ami.md)。当您从新的 AMI 启动实例时，这些额外的卷会自动初始化并挂载。这些卷不包含您的 AMI 所基于的运行实例的实例存储卷上的数据。

   1. **快照目标**：如果实例卷位于支持 EBS 本地快照的本地区域中，请选择创建 AMI 快照的位置：
      + **AWS 区域**：在卷的本地区域的父区域中创建快照。
      + **AWS 本地区域**：在与卷相同的本地区域中创建快照。
**注意**  
此选项仅在支持 EBS 本地快照的本地区域中出现，并且仅当您的实例是在本地区域中创建时才会出现。如果卷位于某个区域中，则不会出现此选项，快照会自动在与卷相同的区域中创建。有关更多信息，请参阅《Amazon EBS User Guide》**中的 [Local snapshots in Local Zones](https://docs.aws.amazon.com/ebs/latest/userguide/snapshots-localzones.html)。
**重要**  
实例卷的所有快照都必须位于同一位置。验证现有快照的位置。如果任何现有快照的位置与您选择的目标不同，AMI 创建将失败。

   1. **标签** – 您可以使用相同的标签来标记 AMI 和快照，也可以使用不同的标签来标记它们。
      + 要使用*相同*标签标记的 AMI 和快照，请选择 **Tag image and snapshots together (将映像和快照一起标记)**。相同的标签将应用于 AMI 和创建的每个快照。
      + 要使用*不同*的标签标记 AMI 和快照，请选择 **Tag image and snapshots separately (分别标记映像和快照)**。对 AMI 和创建的快照应用了不同的标签。但是，所有快照都获得相同的标签；您不能使用不同的标签来标记每个快照。

      要添加标签，请选择 **Add tag (添加标签)**，然后输入该标签的键和值。对每个标签重复此操作。

   1. 准备好创建 AMI 时，选择 **Create image**（创建映像）。

1. 若要在创建 AMI 时查看其状态，请执行以下操作：

   1. 在导航窗格中，选择 **AMI**。

   1. 将筛选条件设置为 **Owned by me**（我拥有的），然后在列表中查找您的 AMI。

      最初，状态是 `pending`，但过几分钟就会变成 `available`。

1. （可选）若要查看为新 AMI 创建的快照，请执行以下操作：

   1. 记下您在上一步骤中找到的 AMI ID。

   1. 在导航窗格中，选择**快照**。

   1. 将筛选条件设置为 **Owned by me**（我拥有的），然后在 **Description**（描述）列中查找具有新 AMI ID 的快照。

      您从此 AMI 启动实例时，Amazon EC2 使用此快照创建实例的根卷。

------
#### [ AWS CLI ]

**创建 AMI**  
使用 [create-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-image.html) 命令。

```
aws ec2 create-image \
    --instance-id {{i-1234567890abcdef0}} \
    --name "{{my-web-server}}" \
    --description "{{My web server image}}" \
    --no-reboot
```

------
#### [ PowerShell ]

**创建 AMI**  
使用 [New-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Image.html) cmdlet。

```
New-EC2Image `
    -InstanceId {{i-1234567890abcdef0}} ` 
    -Name {{"my-web-server"}} `
    -Description "{{My web server image}}" `
    -NoReboot $true
```

------

## 从快照创建 AMI
<a name="creating-launching-ami-from-snapshot"></a>

如果您有实例根卷的快照，则可以通过此快照创建 AMI。

**注意**  
在大多数情况下，适用于 Windows、Red Hat、SUSE 和 SQL Server 的 AMI 需要在 AMI 上提供正确的许可信息。有关更多信息，请参阅 [了解 AMI 账单信息](ami-billing-info.md)。从快照创建 AMI 时，`RegisterImage` 操作会从快照的元数据获取正确的账单信息，但这需要存在相应的元数据。要验证是否应用了正确的账单信息，请检查新 AMI 上的**平台详细信息**字段。如果该字段为空或不匹配预期的操作系统代码（例如 Windows、Red Hat、SUSE 或 SQL），则 AMI 创建失败，您应丢弃 AMI 并按照[从实例创建 AMI](#how-to-create-ebs-ami)中的说明进行操作。

------
#### [ Console ]

**从快照创建 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**快照**。

1. 选择从中创建 AMI 的快照并选择 **Actions**（操作）、**Create image from snapshot**（从快照创建映像）。

1. 在**从快照创建映像**页面上，请指定以下信息：

   1. 对于 **Image name**（镜像名称），请输入镜像的描述性名称。

   1. 对于 **Description**（描述），请输入镜像的简短描述。

   1. 对于 **Architecture**（架构），请选择镜像架构。对于 32 位选择 **i386**，对于 64 位选择 **x86\_64**，对于 64 位 ARM 选择 **arm64**，或者对于 64 位 macOS 选择 **x86\_64**。

   1. 对于**根设备名称**，请输入要用于根卷的设备名称。有关更多信息，请参阅 [Amazon EC2 实例上卷的设备名称](device_naming.md)。

   1. 对于 **Virtualization type**（虚拟化类型），请选择从此 AMI 启动的实例要使用的虚拟化类型。有关更多信息，请参阅 [虚拟化类型](ComponentsAMIs.md#virtualization_types)。

   1. （仅适用于半虚拟化）对于 **Kernel ID**（内核 ID），选择镜像的操作系统内核。如果您使用的是实例的根卷快照，请选择与原始实例相同的内核 ID。如果您不确定，请使用默认内核。

   1. （仅适用于半虚拟化）对于 **RAM disk ID**（RAM 磁盘 ID），请选择镜像的 RAM 磁盘。如果您选择了一个特定内核，则您可能需要选择带有可支持该内核的驱动程序的某个特定 RAM 磁盘。

   1. 对于**启动模式**，选择映像的启动模式，或者选择**使用默认值**，以便在使用此 AMI 启动实例时，它会以该实例类型支持的启动模式启动。有关更多信息，请参阅 [设置 Amazon EC2 AMI 的启动模式](set-ami-boot-mode.md)。

   1. （可选）在**块设备映射**部分中，自定义根卷并添加其它数据卷。

      对于每个卷，您可以指定大小、类型、性能特征、终止时删除的行为以及加密状态。对于根卷，其大小不能小于快照的大小。对于卷类型，默认选择为通用型 SSD `gp3`。

   1. （可选）在**标签**下，您可以向新的 AMI 添加一个或多个标签。要添加标签，请选择 **Add tag (添加标签)**，然后输入该标签的键和值。对每个标签重复此操作。

   1. 准备好创建 AMI 时，选择 **Create image**（创建映像）。

1. （仅适用于 Windows、Red Hat、SUSE 和 SQL Server）要验证是否应用了正确的账单信息，请检查新 AMI 上的**平台详细信息**字段。如果该字段为空或不匹配预期的操作系统代码（例如 **Windows** 或 **Red Hat**），则 AMI 创建失败，您应丢弃 AMI 并按照[从实例创建 AMI](#how-to-create-ebs-ami)中的说明进行操作。

------
#### [ AWS CLI ]

**使用 AWS CLI 从快照创建 AMI**  
使用 [register-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/register-image.html) 命令。

```
aws ec2 register-image \
    --name {{my-image}} \
    --root-device-name {{/dev/xvda}} \
    --block-device-mappings DeviceName={{/dev/xvda}},Ebs={SnapshotId={{snap-0db2cf683925d191f}}}
```

------
#### [ PowerShell ]

**使用 PowerShell 从快照创建 AMI**  
使用 [Register-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-EC2Image.html) cmdlet。

```
$block = @{SnapshotId={{snap-0db2cf683925d191f}}}
Register-EC2Image `
    -Name {{my-image}} `
    -RootDeviceName {{/dev/xvda}} `
    -BlockDeviceMapping @{DeviceName="/dev/xvda";Ebs=$block}
```

------
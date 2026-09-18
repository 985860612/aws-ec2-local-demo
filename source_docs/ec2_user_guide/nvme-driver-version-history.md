

# AWS NVMe Windows 驱动程序版本历史记录
<a name="nvme-driver-version-history"></a>

下表显示在 Amazon EC2 上每个版本的 Windows Server 上运行的 AWS NVMe 驱动程序。


| Windows Server 版本 | AWS NVME 驱动程序版本 | 
| --- | --- | 
| Windows Server 2025 | 最新版本 | 
| Windows Server 2022 | 最新版本 | 
| Windows Server 2019 | 最新版本 | 
| Windows Server 2016 | 最新版本 | 
| Windows Server 2012 R2 | 版本 1.5.1 及更早版本 | 
| Windows Server 2012  | 版本 1.5.1 及更早版本 | 
| Windows Server 2008 R2 | 版本 1.3.2 及更早版本 | 
| Windows Server 2008 | 版本 1.3.2 及更早版本 | 

下表说明已发行的 AWS NVMe 驱动程序版本。


| 程序包版本 | 驱动程序版本 | 详细信息 | 发行日期 | 
| --- | --- | --- | --- | 
|  [1.8.2](https://s3.amazonaws.com/ec2-windows-drivers-downloads/NVMe/1.8.2/AWSNVMe.zip)  | 1.8.2 |  +  通过改进中断处理修复了启动时的错误检查。   | 2026 年 6 月 15 日 | 
|  [1.8.1](https://s3.amazonaws.com/ec2-windows-drivers-downloads/NVMe/1.8.1/AWSNVMe.zip)  | 1.8.1 |  +  修复了磁盘序列号生成方面的向后兼容性问题。   | 2026 年 2 月 24 日 | 
| 1.8.0 | 1.8.0 |  +  增加了对 IOCTL 的支持，以便在实现动态命名空间管理的设备上运行。有关更多信息，请参阅 Microsoft 文档中的 [IOCTL\_SCSI\_MINIPORT IOCTL](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/ntddscsi/ni-ntddscsi-ioctl_scsi_miniport)。 <br />+  修复了“获取日志页面”命令和序列号生成中的错误。   | 2026 年 1 月 16 日 | 
|  [1.7.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/NVMe/1.7.0/AWSNVMe.zip)  | 1.7.0 |  +  添加了对 NVMe 获取日志页面命令的支持。 <br />+  添加了对 EBS 和 EC2 实例存储卷详细性能统计数据的支持。 <br />+  修复了识别命名空间命令的错误。   | 2025 年 9 月 17 日 | 
|  [1.6.0](https://s3.amazonaws.com/ec2-windows-drivers-downloads/NVMe/1.6.0/AWSNVMe.zip)  | 1.6.0 |  +  更新了安装脚本以使用 PnPUtil。 <br />+  更新了 ebsnvme-id.exe 以使用 NVMe IOCTL。   | 2024 年 10 月 25 日 | 
|  [1.5.1](https://s3.amazonaws.com/ec2-windows-drivers-downloads/NVMe/1.5.1/AWSNVMe.zip)  | 1.5.0 | 修复了安装脚本，以便在 `ebsnvme-id` 工具不存在时为其创建文件夹。 | 2023 年 11 月 17 日 | 
| 1.5.0 | 1.5.0 | 为运行 Windows Server 2016 及更高版本的实例增加对小型计算机系统接口（SCSI）永久保留的支持。ebsnvme-id 工具（`ebsnvme-id.exe`）现在已默认安装。 | 2023 年 8 月 31 日 | 
| 1.4.2 | 1.4.2 | 修复了 AWS NVMe 驱动程序 不支持 D3 实例上实例存储卷的错误。 | 2023 年 3 月 16 日 | 
| 1.4.1 | 1.4.1 | 报告支持此可选 NVMe 功能的 EBS 卷的命名空间首选写入粒度（NPGW）。有关更多信息，请参阅 [NVMe 基本规范版本 1.4](https://nvmexpress.org/wp-content/uploads/NVM-Express-1_4b-2020.09.21-Ratified.pdf) 中的第 8.25 部分“通过 I/O 大小和对齐依从性改进性能”。 | 2022 年 5 月 20 日 | 
| 1.4.0 | 1.4.0 |  +  增加了对 IOCTL 的支持，允许应用程序与 NVMe 设备进行交互。此支持允许应用程序从 NVMe 设备处获得 `IdentifyController`、`IdentifyNamespace` 和 `NameSpace` 的列表。有关更多信息，请参阅 Microsoft 文档中的[协议特定的查询](https://learn.microsoft.com/en-us/windows/win32/fileio/working-with-nvme-devices#protocol-specific-queries)。 <br />+  1.4.0 驱动程序版本和最新 `ebsnvme-id` 工具 (`ebsnvme-id.exe`) 组合包含于同一个软件包中。这种组合使您能够通过单个软件包即可同时安装驱动程序和工具。有关更多详细信息，请参阅[NVMe 驱动程序](aws-nvme-drivers.md)。 <br />+  错误修复与可靠性改进。   | 2021 年 11 月 23 日 | 
|  [1.3.2](https://s3.amazonaws.com/ec2-windows-drivers-downloads/NVMe/1.3.2/AWSNVMe.zip)  | 1.3.2 | 修复了与修改主动处理 IO 的 EBS 卷有关的问题，此问题可能导致数据损坏。不修改在线 EBS 卷（例如，调整大小或更改类型）的客户不会受到影响。<br />这是最后一个可以在 Windows Server 2008 和 2008 R2 上运行的版本。此版本可供下载，但不再受支持。Windows Server 2008 和 2008 R2 的生命周期已经终止，Microsoft 不再提供支持。 | 2019 年 9 月 10 日 | 
| 1.3.1 | 1.3.1 | 可靠性改进。 | 2019 年 5 月 21 日 | 
| 1.3.0 | 1.3.0 | 设备优化改进。 | 2018 年 8 月 31 日 | 
| 1.2.0 | 1.2.0 | 对所有受支持的实例（包括裸机实例）上的 AWS NVMe 设备的性能和可靠性改进。 | 2018 年 6 月 13 日 | 
| >1.0.0 | >1.0.0 | AWS运行 Windows Server 的受支持实例类型的 NVMe 驱动程序。 | 2018 年 2 月 12 日 | 

## 订阅 通知
<a name="nvme-drivers-subscribe-notifications"></a>

Amazon SNS 可在 EC2 Windows 驱动程序的新版本发布时向您发送通知。使用以下过程订阅这些通知。

**从控制台订阅 EC2 通知**

1. 通过以下网址打开 Amazon SNS 控制台：[https://console.aws.amazon.com/sns/v3/home](https://console.aws.amazon.com/sns/v3/home)。

1. 如果需要，可在导航栏中将区域更改为**美国东部（弗吉尼亚州北部）**。您必须选择此区域，因为您订阅的 SNS 通知是在此区域中创建的。

1. 在导航窗格中，选择 **Subscriptions**。

1. 选择 **Create subscription**。

1. 在 **Create subscription** 对话框中，执行以下操作：

   1. 对于 **TopicARN**，复制以下 Amazon 资源名称（ARN）：

      arn:aws:sns:us-east-1:801119661308:ec2-windows-drivers

   1. 对于 **Protocol**，选择 `Email`。

   1. 对于 **Endpoint**，键入可用于接收通知的电子邮件地址。

   1. 选择 **Create subscription**。

1. 您将收到一封确认电子邮件。打开电子邮件，然后按照说明操作以完成订阅。

每当发布新的 EC2 Windows 驱动程序时，我们都会向订户发送通知。如果您不希望再收到这些通知，请通过以下步骤取消订阅。

**从 Amazon EC2 Windows 驱动程序通知中取消订阅**

1. 通过以下网址打开 Amazon SNS 控制台：[https://console.aws.amazon.com/sns/v3/home](https://console.aws.amazon.com/sns/v3/home)。

1. 在导航窗格中，选择 **Subscriptions**。

1. 选中订阅的复选框，然后选择 **Actions**、**Delete subscriptions**。当系统提示进行确认时，选择 **Delete**。

**使用AWS CLI 订阅 EC2 通知**  
要使用 AWS CLI 订阅 EC2 通知，请使用以下命令。

```
aws sns subscribe --topic-arn {{arn:aws:sns:us-east-1:801119661308:ec2-windows-drivers}} --protocol {{email}} --notification-endpoint {{YourUserName@YourDomainName.ext}}
```

**使用 AWS Tools for Windows PowerShell 订阅 EC2 通知**  
要使用 AWS Tools for Windows PowerShell 订阅 EC2 通知，请使用以下命令。

```
Connect-SNSNotification -TopicArn {{'arn:aws:sns:us-east-1:801119661308:ec2-windows-drivers'}} -Protocol {{email}} -Region {{us-east-1}} -Endpoint {{'YourUserName@YourDomainName.ext'}}
```
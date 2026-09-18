

# 实例指令引退
<a name="instance-retirement"></a>

计划在 AWS 检测到托管实例的基础硬件发生无法弥补的故障时停用实例。实例根卷类型会决定实例停用的行为：
+ 如果实例的根卷是 Amazon EBS 卷，将停止实例，您可随时重新启动它。启动停止的实例会将其迁移到新的硬件。
+ 如果实例根卷是实例存储卷，则实例将终止，且无法再次使用。

有关实例事件类型的更多信息，请参阅[Amazon EC2 实例的计划事件](monitoring-instances-status-check_sched.md)。

**Topics**
+ [确定计划停用的实例](#instance-retirement-identify)
+ [可对计划停用的由 EBS 支持的实例执行的操作](#instance-retirement-actions-EBS)
+ [可对计划停用的由实例存储支持的实例执行的操作](#instance-retirement-actions-instance-store)

## 确定计划停用的实例
<a name="instance-retirement-identify"></a>

如果已计划停用实例，您将在事件发生之前收到包含实例 ID 和停用日期的电子邮件。您还可以检查已计划停用的实例。

**重要**  
如果某个实例已计划停用，我们建议您尽快采取行动，因为该实例可能已经无法访问。有关更多信息，请参阅 [Check if your instance is reachable](#check-instance)。

**Topics**
+ [监控账户联系人的电子邮件](#identify-by-email)
+ [检查实例](#identify-in-console-cli)

### 监控账户联系人的电子邮件
<a name="identify-by-email"></a>

如果某个实例已计划停用，该账户的主要联系人和操作联系人会在该事件生效之前收到电子邮件。该电子邮件会包含实例 ID 和计划的停用日期。有关更多信息，请参阅《AWS 账户管理 参考指南》中的 [Update the primary contact for your AWS account](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-contact-primary.html) 和 [Update the alternate contacts for your AWS account](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-contact-alternate.html)**。

### 检查实例
<a name="identify-in-console-cli"></a>

如果您不会经常检查所用的电子邮件账户，则可能会错过实例停用通知。您可以随时检查是否有任何实例已计划停用。<a name="identify-retiring-instances"></a>

------
#### [ Console ]

**识别已计划停用的实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **EC2 控制面板**。在**计划的事件**下方，您可以看到与您的 Amazon EC2 实例和卷相关的事件，这些事件按区域列出。  
![计划的事件。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/dashboard-scheduled-events.png)

1. 如果您的某个实例列有计划的事件，请选择区域名称下方的链接以转至 **Events (事件)** 页面。

1. **事件**页面会列出与事件相关的所有资源。要查看计划停用的实例，请从第一个筛选列表中选择 **Instance resources**，然后从第二个筛选列表中选择 **Instance stop or retirement**。

1. 如果筛选结果显示有实例被计划停用，请选择该实例，并注意详细信息窗格中**开始时间**字段中的日期和时间。这就是您的实例停用的日期。

------
#### [ AWS CLI ]

**查找已计划停用的实例**  
使用以下 [describe-instance-status](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-status.html) 命令。在您有实例正在运行的每个区域重复此操作。

```
aws ec2 describe-instance-status --filters Name=event.code,Values=instance-retirement
```

------
#### [ PowerShell ]

**查找已计划停用的实例**  
使用 [Get-EC2InstanceStatus](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceStatus.html) cmdlet。在您有实例正在运行的每个区域重复此操作。

```
Get-EC2InstanceStatus -Filter @{Name="event.code"; Values="instance-retirement"}
```

------

## 可对计划停用的由 EBS 支持的实例执行的操作
<a name="instance-retirement-actions-EBS"></a>

要保留即将停用的实例上的数据，您可以执行以下某项操作。请务必在实例停用日期之前执行该操作，以防止意外的停机和数据丢失。

对于 Linux 实例，如果您不确定您的实例是由 EBS 还是由实例存储支持，则请参阅 [Amazon EC2 实例的根卷](RootDeviceStorage.md)。

**检查实例是否可访问**

当您收到计划停用实例的通知时，建议您尽快采取以下操作：
+ 通过[连接](connect.md)或 ping 实例来检查实例是否可以访问。
+ 如果实例可以访问，则应计划在预定停用日期之前的某个适当的时间停止/启动实例，以影响最小为准。有关停止和启动实例以及在停止实例时可能发生的情况（例如，对与实例关联的公有、私有和弹性 IP 地址的影响）的更多信息，请参阅[启动和停止 Amazon EC2 实例](Stop_Start.md)。请注意，停止和启动实例后，实例存储卷上的数据将会丢失。
+ 如果您的实例无法访问，您应立即采取操作，执行[停止/启动](Stop_Start.md)来恢复实例。
+ 或者，如果您想[终止](terminating-instances.md)实例，请尽快计划终止，以便停止为实例产生费用。

**创建实例备份**  
从实例创建由 EBS 支持的 AMI，以便您可以有一个备份。为确保数据的完整性，请在创建 AMI 之前停止实例。您可以等到计划的停用日期（实例停止的日期），或者在停用日期之前自行停止实例。您可随时重新启动实例。有关更多信息，请参阅 [创建 Amazon EBS-backed AMI](creating-an-ami-ebs.md)。

**启动替换实例**  
从实例创建 AMI 后，您可以使用 AMI 启动替换实例。在 Amazon EC2 控制台中，选择您的新 AMI，然后选择**从 AMI 启动实例**。为您的实例配置参数，然后选择**启动实例**。有关每个字段的更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

## 可对计划停用的由实例存储支持的实例执行的操作
<a name="instance-retirement-actions-instance-store"></a>

要保留即将停用的实例上的数据，您可以执行以下某项操作。请务必在实例停用日期之前执行该操作，以防止意外的停机和数据丢失。

**警告**  
如果具有实例存储根卷的实例超过了停用日期，则会终止该实例，并且无法恢复该实例或其中存储的任何数据。无论您的实例根卷是哪种类型，在停用实例后，存储在实例存储卷上的数据都会丢失，即使这些卷连接到具有 EBS 根卷的实例也不例外。

**检查实例是否可访问**

当您收到计划停用实例的通知时，建议您尽快采取以下操作：
+ 通过[连接](connect-to-linux-instance.md)或 ping 实例来检查实例是否可以访问。
+ 如果实例无法访问，则很可能无法恢复实例。有关更多信息，请参阅 [排查 Amazon EC2 实例无法访问的问题](troubleshoot-unreachable-instance.md)。AWS 将在计划的停用日期终止您的实例，因此，对于无法访问的实例，您可以立即自行将其[终止](terminating-instances.md)。

**启动替换实例**  
使用 AMI 工具从实例创建 Amazon S3 支持的 AMI，如[创建 Amazon S3 支持的 AMI](creating-an-ami-instance-store.md)中所述。在 Amazon EC2 控制台中，选择您的新 AMI，然后选择**从 AMI 启动实例**。为您的实例配置参数，然后选择**启动实例**。有关每个字段的更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

**将实例转换为由 EBS 支持的实例**  
将数据传输到 EBS 卷，制作卷的快照，然后从快照创建 AMI。您可以从新 AMI 启动替换实例。有关更多信息，请参阅 [将 Amazon S3 支持的 AMI 转换为 EBS-backed AMI](Using_ConvertingS3toEBS.md)。
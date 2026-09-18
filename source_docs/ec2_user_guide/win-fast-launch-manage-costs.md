

# 管理 EC2 Fast Launch 底层资源的成本
<a name="win-fast-launch-manage-costs"></a>

为 EC2 Fast Launch 配置 Windows AMI 无需支付服务费。但是，当您为 Amazon EC2 Windows AMI 启用 EC2 Fast Launch 时，标准定价适用于 Amazon EC2 用于准备和存储预置快照的底层 AWS 资源。您可以配置成本分配标签，帮助跟踪和管理与 EC2 Fast Launch 资源相关的成本。有关如何配置成本分配标签的更多信息，请参阅 [在账单上跟踪 EC2 Fast Launch 成本](#win-track-fast-launch-costs)。

以下示例演示如何分配与 EC2 Fast Launch 快照成本相关的成本。

**示例场景：**AtoZ Example 公司有一个具有 50 GiB EBS 根卷的 Windows AMI。它们可以为其 AMI 启用 EC2 Fast Launch，并将目标资源计数设置为五。在一个月的期限内，为 AMI 使用 EC2 Fast Launch 的成本约为 5.00 美元，成本细目如下：

1. 当 AtoZ Example 启用 EC2 Fast Launch 时，Amazon EC2 会启动五个小型实例。每个实例都会完成 Sysprep 和 OOBE Windows 启动步骤，并根据需要重启。每个实例需要几分钟时间（时长可能有所不同，具体取决于该区域或可用区（AZ）的忙闲状况以及 AMI 的大小）。

**成本**
   + 实例运行时成本（或最小运行时 [如适用]）：五个实例
   + 卷成本：五个 EBS 根卷

1. 预置过程完成后，Amazon EC2 会创建实例的快照并将其存储在 Simple Storage Service（Amazon S3）中。快照通常会存储 4-8 小时，然后才会被启动消耗。在这种情况下，每张快照的成本大约为 0.02 至 0.05 美元。

**成本**
   + 快照存储 [Simple Storage Service（Amazon S3）]：五张快照

1. Amazon EC2 创建快照后，会停止实例。此时，实例不再累积成本。但是，EBS 卷的成本会继续累积。

**成本**
   + EBS 卷：关联的 EBS 根卷的成本会继续增加。

**注意**  
此处显示的成本仅用于演示目的。成本可能有所不同，具体取决于您的 AMI 配置和定价套餐。

## 在账单上跟踪 EC2 Fast Launch 成本
<a name="win-track-fast-launch-costs"></a>

成本分配标签有利于整理 AWS 账单，从而反映与 EC2 Fast Launch 相关的成本。Amazon EC2 在为 EC2 Fast Launch 准备和存储预置快照时，会将以下标签添加到其创建的资源中。您可以使用该标签：

**标签键：**`CreatedBy`，**值：**`EC2 Fast Launch`

在 Billing and Cost Management 控制台中激活这些标签并设置详细账单报告后，报告中会显示 `user:CreatedBy` 列。该列包含来自所有服务的值。但是，如果您下载了 CSV 文件，则可以将数据导入电子表格，然后在值中筛选 `EC2 Fast Launch`。标签激活后，此信息也会显示在 AWS 成本和使用情况报告 中。

**步骤 1：激活用户定义的成本分配标签**  
要在成本报告中包含资源标签，您必须先在 Billing and Cost Management 控制台中激活这些标签。有关更多信息，请参阅《AWS 账单与成本管理 用户指南》**中的[激活用户定义的成本分配标签](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/activating-tags.html)。

**注意**  
激活时间可能长达 24 小时。

**步骤 2：设置成本报告**  
如果您已经设置了成本报告，则在激活完成后，下次运行报告时会显示您的标签列。若是首次设置成本报告，请选择以下选项之一。
+ 请参阅 *AWS 账单与成本管理 用户指南*中的[设置月度成本分配报告](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/configurecostallocreport.html#allocation-report)。
+ 请参阅 *AWS 成本和使用情况报告 用户指南*中的[创建成本和使用情况报告](https://docs.aws.amazon.com/cur/latest/userguide/cur-create.html)。

**注意**  
AWS 最多可能需要 24 小时才能开始将报告传输到 S3 存储桶。

您可以为拥有的 Windows AMI 或通过 Amazon EC2 控制台、API、开发工具包、[CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-imagebuilder-distributionconfiguration-fastlaunchconfiguration.html) 或 AWS CLI 中的 **ec2** 命令与您共享的 AMI 配置 EC2 Fast Launch。以下部分介绍了 Amazon EC2 控制台和 AWS CLI 的配置步骤。

您还可以使用 EC2 Image Builder 创建为 EC2 Fast Launch 配置的自定义 Windows AMI。有关更多信息，请参阅 [Create distribution settings for a Windows AMI with EC2 Fast Launch enabled (AWS CLI)](https://docs.aws.amazon.com/imagebuilder/latest/userguide/cr-upd-ami-distribution-settings.html#cli-create-ami-dist-config-win-fast-launch)。
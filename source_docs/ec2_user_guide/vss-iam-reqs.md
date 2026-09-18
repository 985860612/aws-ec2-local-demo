

# 使用 IAM 托管策略为基于 VSS 的快照授予权限
<a name="vss-iam-reqs"></a>

AWSEC2VssSnapshotPolicy 托管策略允许 Systems Manager 在 Windows 实例上执行以下操作：
+ 创建和标记 EBS 快照
+ 创建和标记亚马逊机器映像（AMI）
+ 将元数据（如设备 ID）附加到 VSS 创建的默认快照标签。

本主题介绍 VSS 托管策略的权限详细信息，以及如何将其附加到您的 EC2 实例配置文件 IAM 角色。

**Topics**
+ [AWSEC2VssSnapshotPolicy 托管策略详细信息](#vss-iam-manpol-AWSEC2VssSnapshotPolicy)
+ [将 VSS 快照托管策略附加到实例配置文件角色](#vss-snapshots-attach-policy)

## AWSEC2VssSnapshotPolicy 托管策略详细信息
<a name="vss-iam-manpol-AWSEC2VssSnapshotPolicy"></a>

AWS 托管策略是 Amazon 为 AWS 客户提供的独立策略。AWS 托管策略旨在为常见使用案例授予权限。您无法更改 AWS 托管策略中定义的权限。但是，您可以复制该策略并将其用作特定于您的使用案例的[客户管理型策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html#customer-managed-policies)的基准。

 有关 AWS 托管式策略的更多信息，请参阅《IAM 用户指南》**中的 [AWS 托管式策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html#aws-managed-policies)。

要使用 **AWSEC2VssSnapshotPolicy** 托管策略，您可以将其附加到 IAM 角色，该角色已附加到您的 EC2 Windows 实例。此策略允许 EC2 VSS 解决方案为亚马逊机器映像（AMI）和 EBS 快照创建和添加标签。要附加策略，请参阅 [将 VSS 快照托管策略附加到实例配置文件角色](#vss-snapshots-attach-policy)。

### AWSEC2VssSnapshotPolicy 授予的权限
<a name="vss-iam-manpol-AWSEC2VssSnapshotPolicy-details"></a>

**AWSEC2VssSnapshotPolicy** 策略包括以下 Amazon EC2 权限，允许 Amazon EC2 代表您创建和管理 VSS 快照。您可以将此托管策略附加到用于 EC2 Windows 实例的 IAM 实例配置文件角色。
+ **ec2:CreateTags** – 向 EBS 快照和 AMI 添加标签，以帮助识别和分类资源。
+ **ec2:DescribeInstanceAttribute** – 检索附加到目标实例的 EBS 卷和相应的块设备映射。
+ **ec2:CreateSnapshots** – 创建 EBS 卷的快照。
+ **ec2:CreateImage** – 从正在运行的 EC2 实例创建 AMI。
+ **ec2:DescribeImages** – 检索 EC2 AMI 和快照的信息。
+ **ec2:DescribeSnapshots** – 确定快照的创建时间和状态以验证应用程序一致性。

**注意**  
要查看此策略的权限详细信息，请参阅《AWS Managed Policy Reference》**中的 [AWSEC2VssSnapshotPolicy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSEC2VssSnapshotPolicy.html)。

### 简化特定使用案例的权限：高级
<a name="scope-down-perms"></a>

`AWSEC2VssSnapshotPolicy` 托管策略包括创建基于 VSS 的快照的所有方式的权限。您可创建仅包含所需权限的自定义策略。

**使用案例：创建 AMI，使用案例：使用 AWS Backup 服务**

如果您只使用 `CreateAmi` 选项，或者仅通过 AWS Backup 服务创建基于 VSS 的快照，则可以按如下方式简化策略语句。
+ 忽略由以下语句 ID（SID）标识的策略语句：
  + `CreateSnapshotsWithTag`
  + `CreateSnapshotsAccessInstance`
  + `CreateSnapshotsAccessVolume`
+ 按如下方式调整 `CreateTagsOnResourceCreation` 语句：
  + 从资源中删除 `arn:aws:ec2:*:*:snapshot/*`。
  + 从 `ec2:CreateAction` 条件中删除 `CreateSnapshots`。
+ 调整 `CreateTagsAfterResourceCreation` 语句以从资源中删除 `arn:aws:ec2:*:*:snapshot/*`。
+ 调整 `DescribeImagesAndSnapshots` 语句以从语句操作中删除 `ec2:DescribeSnapshots`。

**使用案例：仅限快照**

如果您不使用 `CreateAmi` 选项，则可以按如下方式简化策略语句。
+ 忽略由以下语句 ID（SID）标识的策略语句：
  + `CreateImageAccessInstance`
  + `CreateImageWithTag`
+ 按如下方式调整 `CreateTagsOnResourceCreation` 语句：
  + 从资源中删除 `arn:aws:ec2:*:*:image/*`。
  + 从 `ec2:CreateAction` 条件中删除 `CreateImage`。
+ 调整 `CreateTagsAfterResourceCreation` 语句以从资源中删除 `arn:aws:ec2:*:*:image/*`。
+ 调整 `DescribeImagesAndSnapshots` 语句以从语句操作中删除 `ec2:DescribeImages`。

**注意**  
为确保您的自定义策略按预期执行，建议您定期查看托管策略并将其更新纳入其中。

## 将 VSS 快照托管策略附加到实例配置文件角色
<a name="vss-snapshots-attach-policy"></a>

要为您的 EC2 Windows 实例授予基于 VSS 的快照的权限，您可以按如下方式将 **AWSEC2VssSnapshotPolicy** 托管策略附加到您的实例配置文件角色。确保您的实例满足所有 [系统要求](application-consistent-snapshots-prereqs.md#vss-sys-reqs) 很重要。

**注意**  
要使用托管策略，您的实例必须安装 `AwsVssComponents` 软件包版本 `2.3.1` 或更高版本。有关版本历史记录，请参阅 [AwsVssComponents 包版本](vss-comps-history.md#AwsVssComponents-history)。

1. 通过 [https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/) 打开 IAM 控制台。

1. 在导航窗格中，选择**角色**以查看您有权访问的 IAM 角色列表。

1. 为附加到您的实例的角色选择**角色名称**链接。这将打开角色详细信息页面。

1. 要附加托管策略，请选择位于列表面板右上角的**添加权限**。然后，从下拉列表中选择**附加策略**。

1. 要简化搜索结果，请在搜索栏中输入策略名称（`AWSEC2VssSnapshotPolicy`）。

1. 选中要附加的策略名称旁边的复选框，然后选择**添加权限**。
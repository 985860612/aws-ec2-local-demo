

# 在不停止 Amazon EC2 实例的情况下替换该实例的根卷
<a name="replace-root"></a>

Amazon EC2 使您能够替换正在运行的实例的根 Amazon EBS 卷，同时保留以下内容：
+ 存储在实例存储卷上的数据 – 还原根卷后，实例存储卷仍附加到实例。
+ 存储在数据（非根）Amazon EBS 卷上的数据 – 在还原根卷后，非根 Amazon EBS 卷仍附加到实例。
+ 网络配置 – 所有网络接口均仍附加到实例，并保留其 IP 地址、标识符和附件 ID。当实例变为可用时，将刷新所有待处理的网络流量。此外，实例保留在同一个物理主机上，因此它会保留其公有和私有 IP 地址以及 DNS 名称。
+ IAM policy – 将保留和强制实施与实例相关联的 IAM 配置文件和策略（例如基于标签的策略）。

**Topics**
+ [根卷替换的工作原理](#replace-root-how)
+ [注意事项](#replace-root-considerations)
+ [替换根卷](#replace)

## 根卷替换的工作原理
<a name="replace-root-how"></a>

当您替换实例的根卷时，将会创建*根卷替换任务*。原始根卷与实例分离，新根卷将在其位置附加到实例。将更新实例的块设备映射，以反映替换根卷的 ID。

替换实例的根卷时，必须指定新卷的源。以下是可能的选项。

### 将根卷还原到其原始状态
<a name="replace-launchstate"></a>

此选项将当前根卷替换为一个卷，该卷基于创建根卷时使用的快照。

**使用启动状态的注意事项**  
替换根卷的类型、大小和终止时删除属性与原始根卷相同。

### 使用快照替换根卷
<a name="replace-snapshot"></a>

此选项将当前根卷替换为一个卷，该卷基于您指定的快照。例如，您之前从该根卷创建的特定快照。如果您需要从根卷损坏或客户操作系统中的网络配置错误引起的问题中恢复，这将非常有用。

替换根卷的类型、大小和终止时删除属性与原始根卷相同。

**使用快照的注意事项**
+ 您只能使用直接从实例当前或以前的根卷创建的快照。
+ 您不能使用从根卷拍摄的快照创建的快照副本。
+ 成功替换根卷后，您仍可使用从原始根卷获取的快照来替换新的（替换）根卷。

### 使用 AMI 替换根卷
<a name="replace-ami"></a>

此选项使用您指定的 AMI 替换当前根卷。如果需要执行操作系统和应用程序修补或升级，这将非常有用。AMI 必须具有与实例相同的产品代码、账单信息、架构类型和虚拟化类型。

如果实例启用了 ENA 或 sriov-net，则必须使用支持这些功能的 AMI。如果实例未启用 ENA 或 sriov-net，则可以选择不支持这些功能的 AMI，或者如果选择支持 ENA 或 sriov net 的 AMI，则可以自动添加支持。

如果实例启用了 NitroTPM，则必须使用启用了 NitroTPM 的 AMI。无论选择哪种 AMI，如果没有实例配置它，都不会启用 NitrotPM 支持。

您可以选择与实例的启动模式不同的 AMI，前提是该实例支持 AMI 的启动模式。如果实例不支持启动模式，则该请求将失败。如果实例支持启动模式，则新的启动模式将传播到该实例，并相应更新其 UEFI 数据。如果您手动修改了启动顺序或添加了私有 UEFI 安全启动密钥来加载私有内核模块，则在根卷替换期间，更改将丢失。

替换根卷获得与原始根卷相同的卷类型和终止时删除属性。替换根卷的大小为 AMI 根卷块设备映射大小与当前根卷大小两者中的较大者。

在根卷替换任务完成后，当您使用控制台 AWS CLI 或 AWS SDK 描述实例时，将反映以下新的和经过更新的信息：
+ 新 AMI ID
+ 根卷的新卷 ID
+ 经过更新的启动模式配置（如果由 AMI 更改）
+ 经过更新的 NitroTPM 配置（如果由 AMI 启用）
+ 经过更新的 ENA 配置（如果由 AMI 启用）
+ 经过更新的 sriov-net 配置（如果由 AMI 启用）

新 AMI ID 也反映在实例元数据中。

**使用 AMI 的注意事项：**
+ 如果您使用拥有多个块设备映射的 AMI，则仅使用该 AMI 的根卷。其他（非根）卷将被忽略。
+ 只有当您拥有 AMI 及其关联根卷快照的权限时，才能使用此功能。您不能对 AWS Marketplace AMI 使用此功能。
+ 仅当实例没有产品代码时，您才能使用没有产品代码的 AMI。
+ 替换根卷的大小为 AMI 根卷块设备映射大小与当前根卷大小两者中的较大者。
+ 将自动更新实例的实例身份文档。
+ 如果实例支持 NitroTPM，则将重置该实例的 NitroTPM 数据，并将生成新密钥。

### 使用现有 Amazon EBS 卷替换根卷
<a name="replace-volume"></a>

与创建新卷的快照和 AMI 选项不同，此选项将当前的根卷替换为您已经配置的现有 Amazon EBS 卷。这对于有状态的工作负载（例如数据库）非常有用，在这些工作负载中，您要在根卷上准备元数据或软件，然后再将其连接到实例。

在使用此选项之前，您必须创建并准备替换 Amazon EBS 卷。您可以将其作为数据卷挂载到实例上，将所需数据复制到其中，然后再将其分离，以此完成准备工作。卷必须与实例位于同一可用区中。

替换根卷将保留您在创建和准备根卷时配置的大小、类型和其他属性。原始根卷的“终止时删除”属性不会转移至替换根卷。

**使用现有 Amazon EBS 卷的注意事项**
+ 替换卷必须与实例位于同一可用区中。
+ 请求时不得将替换卷挂载到任何实例。
+ 替换卷必须处于 `available` 状态。
+ 如果替换卷不符合这些要求，则根卷更换请求将失败。
+ 您可以将此选项用于 AWS Marketplace 实例，但替换卷上的市场产品代码和计费代码必须与实例上的代码匹配。
+ 如果原始根卷被加密，则新根卷将被加密。您可以从未加密卷移动到加密卷，但不能从加密卷移动到未加密卷。加密替换卷后，您的 IAM 主体必须拥有分离原始卷所需的 AWS KMS 权限。您还必须具有挂载和解密替换卷的权限。这些权限与连接加密卷所需的权限相同。

您可以选择在根卷替换过程完成后是否保留原始根卷。如果您在替换过程完成后选择删除原始根卷，则原始根卷将被自动删除，并变得不可恢复。如果您选择在该过程完成后保留原始根卷，则该卷仍会在您的账户中预调配；当您不再需要该卷时，必须手动将其删除。

根卷替换任务会经历以下几个状态：
+ `pending`：正在创建替换卷。
+ `in-progress`：正在分离原始卷，正在附加替换卷。
+ `succeeded`：已将替换卷成功附加到实例并且实例可用。
+ `failing`：替换任务即将失败。
+ `failed`：替换任务已失败，但根卷仍处于附加状态。
+ `failing-detached`：替换任务即将失败，并且实例可能未附加根卷。
+ `failed-detached`：替换任务已失败，并且实例未附加根卷。

如果根卷替换任务失败，则实例将重新启动，原始根卷仍附加到该实例。

## 注意事项
<a name="replace-root-considerations"></a>

开始之前，请注意以下因素：

**要求**
+ 该实例必须处于 `running` 状态。
+ 在此过程中，实例将自动重新启动。在重启过程中，将清空内存（RAM）的内容。无需手动重启。
+ 如果根卷是实例存储卷，则无法替换它。仅支持具有 Amazon EBS 根卷的实例。
+ 您可以替换所有虚拟化实例类型和 EC2 Mac 裸机实例的根卷。不支持其他裸机实例类型。
+ 使用快照时，您只能使用直接从实例当前或先前根卷创建的快照。
+ 如果您的账户在当前区域启用了 Amazon EBS 默认加密密，无论指定快照的加密状态或指定 AMI 的根卷如何，由根卷替换任务创建的替换根卷始终处于加密状态。

**加密结果**  
下表汇总了可能的加密结果。



- ****将替换根卷还原到初始启动状态****
  - **原始根卷:** 已加密 / **指定的快照、AMI 或卷:** 不适用 / **默认加密:** 不考虑 / **替换根卷:** 已加密 / **用于替换根卷的加密密钥:** 与原始根卷相同的 KMS 密钥
  - **原始根卷:** 未加密 / **指定的快照、AMI 或卷:** 不适用 / **默认加密:** 已禁用 / **替换根卷:** 未加密 / **用于替换根卷的加密密钥:** 不适用
  - **原始根卷:** 未加密 / **指定的快照、AMI 或卷:** 不适用 / **默认加密:** 已启用 / **替换根卷:** 已加密 / **用于替换根卷的加密密钥:** 账户的 Amazon EBS 加密的默认 KMS 密钥

- ****从快照或 AMI 还原替换根卷****
  - **原始根卷:** 已加密 / **指定的快照、AMI 或卷:** 未加密 / **默认加密:** 不考虑 / **替换根卷:** 已加密 / **用于替换根卷的加密密钥:** 与原始根卷相同的 KMS 密钥
  - **原始根卷:** 已加密 / **指定的快照、AMI 或卷:** 已加密 / **默认加密:** 不考虑 / **替换根卷:** 已加密 / **用于替换根卷的加密密钥:** 与原始根卷相同的 KMS 密钥
  - **原始根卷:** 未加密 / **指定的快照、AMI 或卷:** 未加密 / **默认加密:** 已禁用 / **替换根卷:** 未加密 / **用于替换根卷的加密密钥:** 不适用
  - **原始根卷:** 未加密 / **指定的快照、AMI 或卷:** 未加密 / **默认加密:** 已启用 / **替换根卷:** 已加密 / **用于替换根卷的加密密钥:** 账户的 Amazon EBS 加密的默认 KMS 密钥
  - **原始根卷:** 未加密 / **指定的快照、AMI 或卷:** 已加密 / **默认加密:** 不考虑 / **替换根卷:** 已加密 / **用于替换根卷的加密密钥:** 如果 AMI 或快照归账户所有，则使用 AMI 或快照的 KMS 密钥对替换卷进行加密。如果与账户共享 AMI 或快照，则使用该账户的 Amazon EBS 加密的默认 KMS 密钥加密替换卷。

- ****从现有 Amazon EBS 卷还原替换根卷****
  - **原始根卷:** 已加密 / **指定的快照、AMI 或卷:** 已加密 / **默认加密:** 不适用 / **替换根卷:** 已加密 / **用于替换根卷的加密密钥:** 指定卷的 KMS 密钥
  - **原始根卷:** 已加密 / **指定的快照、AMI 或卷:** 未加密 / **默认加密:** 不适用 / **替换根卷:** 不允许。您不能将加密的根卷替换为未加密的卷。Amazon EC2 拒绝替换任务。 / **用于替换根卷的加密密钥:** 不适用
  - **原始根卷:** 未加密 / **指定的快照、AMI 或卷:** 未加密 / **默认加密:** 不适用 / **替换根卷:** 未加密 / **用于替换根卷的加密密钥:** 不适用
  - **原始根卷:** 未加密 / **指定的快照、AMI 或卷:** 已加密 / **默认加密:** 不适用 / **替换根卷:** 已加密 / **用于替换根卷的加密密钥:** 指定卷的 KMS 密钥



## 替换根卷
<a name="replace"></a>

当您替换实例的根卷时，将创建*根卷替换任务*。您可以使用根卷更换任务来监控替换过程的进度和结果。

------
#### [ Console ]

**替换根卷**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择要替换其根卷的实例，然后选择 **Actions（操作）**、**Monitor and troubleshoot（监控和故障排除）**、**Replace root volume（替换根卷）**。
**注意**  
如果选定的实例不在 `running` 状态，**替换根卷**操作将被禁用。

1. 对于**还原**，选择以下选项之一：
   + **启动状态**：从用于创建当前根卷的快照中还原替换根卷。
   + **快照**：将替换根卷还原到您指定的快照。对于**快照**，选择要使用的快照。
   + **映像**：使用您指定的 AMI 还原替换根卷。对于**映像**，选择要使用的 AMI。

1. （可选）对于**卷初始化速率**，您可以指定 Amazon EBS 预置卷初始化速率（卷初始化速率），单位为 MiB/s，这是将快照块从 Amazon S3 下载到卷的速率。有关更多信息，请参阅 [Use an Amazon EBS Provisioned Rate for Volume Initialization](https://docs.aws.amazon.com/ebs/latest/userguide/initalize-volume.html#volume-initialization-rate)。要使用默认初始化速率或快速快照还原功能（如果已为所选快照启用此功能），请不要指定速率。

1. （可选）要删除要替换的根卷，请选择**删除替换的根卷**。

1. 选择**创建替换任务**。

1. 要监控替换任务，请选择实例的**存储**选项卡，然后展开**最近的根卷替换任务**。

------
#### [ AWS CLI ]

**将替换根卷还原到启动状态**  
使用 [create-replace-root-volume-task](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-replace-root-volume-task.html) 命令。对于 `--instance-id`，指定要为其替换根卷的实例的 ID。省略 `--snapshot-id` 和 `--image-id` 参数。若要在替换原始根卷后将其删除，请包括 `--delete-replaced-root-volume` 并指定 `true`。要指定将快照块从 Amazon S3 下载到卷的卷初始化速率，则对于 `--volume-initialization-rate`，请指定一个介于 `100` 到 `300` MiB/s 之间的值。

```
aws ec2 create-replace-root-volume-task \
--instance-id {{i-1234567890abcdef0}} \
--delete-replaced-root-volume \ 
--volume-initialization-rate {{150}}
```

**将替换根卷还原到特定快照**  
使用 [create-replace-root-volume-task](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-replace-root-volume-task.html) 命令。对于 `--instance-id`，指定要为其替换根卷的实例的 ID。对于 `--snapshot-id`，请定要使用的快照的 ID。若要在替换原始根卷后将其删除，请包括 `--delete-replaced-root-volume` 并指定 `true`。要指定将快照块从 Amazon S3 下载到卷的卷初始化速率，则对于 `--volume-initialization-rate`，请指定一个介于 `100` 到 `300` MiB/s 之间的值。

```
aws ec2 create-replace-root-volume-task \
--instance-id {{i-1234567890abcdef0}} \
--snapshot-id {{snap-9876543210abcdef0}} \
--delete-replaced-root-volume \ 
--volume-initialization-rate {{150}}
```

**使用 AMI 还原替换根卷**  
使用 [create-replace-root-volume-task](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-replace-root-volume-task.html) 命令。对于 `--instance-id`，指定要为其替换根卷的实例的 ID。对于 `--image-id`，指定要使用的 AMI 的 ID。若要在替换原始根卷后将其删除，请包括 `--delete-replaced-root-volume` 并指定 `true`。要指定将快照块从 Amazon S3 下载到卷的卷初始化速率，则对于 `--volume-initialization-rate`，请指定一个介于 `100` 到 `300` MiB/s 之间的值。

```
aws ec2 create-replace-root-volume-task \
--instance-id {{i-1234567890abcdef0}} \
--image-id {{ami-09876543210abcdef}} \
--delete-replaced-root-volume \ 
--volume-initialization-rate {{150}}
```

**使用现有 Amazon EBS 卷替换根卷**  
使用 [create-replace-root-volume-task](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-replace-root-volume-task.html) 命令。对于 `--instance-id`，指定要替换其根卷的实例 ID（例如 `i-1234567890abcdef0`）。对于`--volume-id`，指定用作新根卷的 Amazon EBS 卷 ID。要在替换完成后删除原始根卷，请包括 `--delete-replaced-root-volume`。Amazon EC2 接受 `--volume-initialization-rate` 参数，但使用此选项时会忽略该参数，因为此选项不下载快照数据。

```
aws ec2 create-replace-root-volume-task \
--instance-id {{i-1234567890abcdef0}} \
--volume-id {{vol-0123456789abcdef0}} \
--delete-replaced-root-volume
```

**查看根卷替换任务的状态**  
使用 [describe-replace-root-volume-tasks](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-replace-root-volume-tasks.html) 命令并指定要查看的根卷替换任务的 ID。

```
aws ec2 describe-replace-root-volume-tasks \
    --replace-root-volume-task-ids {{replacevol-1234567890abcdef0}} \
    --query ReplaceRootVolumeTasks[].TaskState
```

下面是示例输出。

```
[
    "succeeded"
]
```

或者，请指定 `instance-id` 筛选条件以按实例筛选结果。

```
$ aws ec2 describe-replace-root-volume-tasks \
    --filters Name=instance-id,Values={{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**将替换根卷还原到启动状态**  
使用 [New-EC2ReplaceRootVolumeTask](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2ReplaceRootVolumeTask.html) 命令。对于 `-InstanceId`，指定要为其替换根卷的实例的 ID。省略 `-SnapshotId` 和 `-ImageId` 参数。若要在替换原始根卷后将其删除，请包括 `-DeleteReplacedRootVolume` 并指定 `$true`。要指定将快照块从 Amazon S3 下载到卷的卷初始化速率，则对于 `-VolumeInitializationRate`，请指定一个介于 `100` 到 `300` MiB/s 之间的值。

```
New-EC2ReplaceRootVolumeTask `
    -InstanceId {{i-1234567890abcdef0}} `
    -VolumeInitializationRate {{150}} `
    -DeleteReplacedRootVolume $true
```

**将替换根卷还原到特定快照**  
使用 [New-EC2ReplaceRootVolumeTask](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2ReplaceRootVolumeTask.html) 命令。对于 `--InstanceId`，指定要为其替换根卷的实例的 ID。对于 `-SnapshotId`，请定要使用的快照的 ID。若要在替换原始根卷后将其删除，请包括 `-DeleteReplacedRootVolume` 并指定 `$true`。要指定将快照块从 Amazon S3 下载到卷的卷初始化速率，则对于 `-VolumeInitializationRate`，请指定一个介于 `100` 到 `300` MiB/s 之间的值。

```
New-EC2ReplaceRootVolumeTask `
    -InstanceId {{i-1234567890abcdef0}} `
    -SnapshotId {{snap-9876543210abcdef0}} `
    -VolumeInitializationRate {{150}} `
    -DeleteReplacedRootVolume $true
```

**使用 AMI 还原替换根卷**  
使用 [New-EC2ReplaceRootVolumeTask](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2ReplaceRootVolumeTask.html) 命令。对于 `-InstanceId`，指定要为其替换根卷的实例的 ID。对于 `-ImageId`，指定要使用的 AMI 的 ID。若要在替换原始根卷后将其删除，请包括 `-DeleteReplacedRootVolume` 并指定 `$true`。要指定将快照块从 Amazon S3 下载到卷的卷初始化速率，则对于 `-VolumeInitializationRate`，请指定一个介于 `100` 到 `300` MiB/s 之间的值。

```
New-EC2ReplaceRootVolumeTask `
    -InstanceId {{i-1234567890abcdef0}} `
    -ImageId {{ami-0abcdef1234567890}} `
    -VolumeInitializationRate {{150}} `
    -DeleteReplacedRootVolume $true
```

**使用现有 Amazon EBS 卷替换根卷**  
使用 [New-EC2ReplaceRootVolumeTask](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2ReplaceRootVolumeTask.html) 命令。对于 `-InstanceId`，指定要替换其根卷的实例 ID（例如 `i-1234567890abcdef0`）。对于 `-VolumeId`，指定用作新根卷的 Amazon EBS 卷 ID。要在替换完成后删除原始根卷，请包括 `-DeleteReplacedRootVolume` 并指定 `$true`。Amazon EC2 接受 `-VolumeInitializationRate` 参数，但使用此选项时会忽略该参数，因为此选项不下载快照数据。

```
New-EC2ReplaceRootVolumeTask `
    -InstanceId {{i-1234567890abcdef0}} `
    -VolumeId {{vol-0123456789abcdef0}} `
    -DeleteReplacedRootVolume $true
```

**查看根卷替换任务的状态**  
使用 [Get-EC2ReplaceRootVolumeTask](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReplaceRootVolumeTask.html) 命令并指定要查看的根卷替换任务的 ID。

```
(Get-EC2ReplaceRootVolumeTask `
    -ReplaceRootVolumeTaskIds {{replacevol-1234567890abcdef0}}).TaskState.Value
```

下面是示例输出。

```
Succeeded
```

或者，请指定 `instance-id` 筛选条件以按实例筛选结果。

```
PS C:\> Get-EC2ReplaceRootVolumeTask -Filters @{Name = 'instance-id'; Values = '{{i-1234567890abcdef0}}'} | Format-Table 
```

------
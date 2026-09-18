

# 复制 Amazon EC2 AMI
<a name="CopyingAMIs"></a>

如果需要跨多个区域统一配置 Amazon EC2 实例，您可以将单个亚马逊机器映像（AMI）作为模板来启动所有实例。但由于 AMI 属于区域特定的资源，要在特定 AWS 区域中启动实例，该 AMI 必须位于该区域。因此，要在多个区域使用相同的 AMI，必须将其从源区域复制到每个目标区域。

用于复制 AMI 的方法取决于您是*在同一[分区](https://docs.aws.amazon.com/glossary/latest/reference/glos-chap.html#partition)内*跨区域复制，还是*跨不同分区*复制：
+ **跨区域复制** – *在同一分区内*跨区域复制 AMI，例如，在商业分区内跨区域复制。本主题中介绍的就是这种复制方法。
+ **跨分区复制** – 将 AMI *从一个分区复制到另一个分区*，例如，从商业分区复制到 AWS GovCloud (US) 分区。有关此复制方法的更多信息，请参阅[存储和还原 AMI](ami-store-restore.md)。
+ **跨账户复制** – 创建由其他 AWS 账户[与您的 AWS 账户共享](sharingamis-explicit.md)的 AMI 的副本。本主题中介绍的就是这种复制方法。

对于跨区域和跨账户 AMI 复制，完成复制操作需要的时间为尽力完成的时间。如果需要控制完成时间，您可以指定一个介于 15 分钟到 48 小时之间的完成时限，从而确保在所需的时限内复制 AMI。基于时间的 AMI 复制操作会产生额外的费用。有关更多信息，请参阅《Amazon EBS 用户指南》中的 [Time-based copies](https://docs.aws.amazon.com/ebs/latest/userguide/time-based-copies.html)**。

**Topics**
+ [注意事项](#copy-ami-considerations)
+ [成本](#copy-ami-costs)
+ [授予复制 Amazon EC2 AMI 的权限](copy-ami-permissions.md)
+ [复制 AMI](#ami-copy-steps)
+ [停止待处理的 AMI 复制操作](#ami-copy-stop)
+ [Amazon EC2 AMI 复制工作原理](how-ami-copy-works.md)

## 注意事项
<a name="copy-ami-considerations"></a>
+ **复制 AMI 的权限** – 您可以使用 IAM 策略授予或拒绝用户复制 AMI 的权限。从 2024 年 10 月 28 日开始，您可以为源 AMI 上的 `CopyImage` 操作指定资源级权限。新 AMI 的资源级权限与以前一样可用。
+ **启动权限和 Amazon S3 存储桶权限** – AWS 不会将启动权限或 Amazon S3 存储桶权限从源 AMI 复制到新 AMI。复制操作完成之后，您可以将启动许可和 Amazon S3 存储桶权限应用于新的 AMI。
+ **标签** – 您只能复制附加到源 AMI 的用户定义的 AMI 标签。不会复制系统标签（前缀为 `aws:`）和由其他 AWS 账户 附加的用户定义标签。复制 AMI 时，您可以向新 AMI 及其备份快照附加新标签。
+ **基于时间的 AMI 复制配额** – 达到*累积快照复制吞吐量配额*后，后续基于时间的 AMI 复制请求将会失败。有关更多信息，请参阅《Amazon EBS 用户指南》中的 [Quotas for time-based copies](https://docs.aws.amazon.com/ebs/latest/userguide/time-based-copies.html#time-based-copies-quota)**。
+ **支持的源-目标复制** – 源 AMI 的位置决定您是否可以复制它以及新 AMI 允许的目标：
  + 如果源 AMI 位于某个区域，您可以在该区域内复制它，或者将其复制到另一个区域、与该区域关联的 Outpost 或该区域的本地区域。
  + 如果源 AMI 位于某个本地区域，您可以在该本地区域内复制它，或者将其复制到该本地区域的父区域或具有相同父区域的某些其他本地区域。
  + 如果源 AMI 位于某个 Outpost 上，则您无法复制它。
+ **源和目标的 CLI 参数** – 使用 CLI 时，支持通过以下参数来指定要复制的 AMI 的源位置和新 AMI 的目标。请注意，复制操作必须在目标区域中启动；如果省略 `--region` 参数，则目标将采用 AWS CLI 设置中配置的默认区域。    
[See the AWS documentation website for more details](http://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/CopyingAMIs.html)

## 成本
<a name="copy-ami-costs"></a>

如果未指定完成时间，则复制 AMI 不会产生任何费用。而基于时间的 AMI 复制操作会产生额外的费用。有关更多信息，请参阅《Amazon EBS 用户指南》中的 [Time-based copies](https://docs.aws.amazon.com/ebs/latest/userguide/time-based-copies.html#time-based-copies-pricing)**。

将会收取标准的存储和数据传输费。如果您复制由 EBS 支持的 AMI，则任何其他 EBS 快照的存储将会产生费用。

## 复制 AMI
<a name="ami-copy-steps"></a>

您可以复制您自己拥有的 AMI，也可以复制其他账户与您共享的 AMI。有关支持的源和目标组合，请参阅[注意事项](#copy-ami-considerations)。

------
#### [ Console ]

**复制 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 从控制台导航栏中，选择包含 AMI 的区域。

1. 在导航窗格中，选择 **AMI** 以显示区域中可供您使用的 AMI 列表。

1. 如果看不到您要复制的 AMI，请选择其他筛选条件。您可以按 AMI **我拥有的**、**私有映像**、**公共映像**和**禁用映像**进行筛选。

1. 选择要复制的 AMI，然后选择**操作**、**复制 AMI**。

1. 在**复制亚马逊机器映像（AMI）**页面上，指定以下信息：

   1. **AMI copy name**（AMI 副本名称）：新 AMI 的名称。您可以在名称中包含操作系统信息，因为 Amazon EC2 在显示有关 AMI 的详细信息时不提供该信息。

   1. **Description**（描述）：默认情况下，描述包括源 AMI 的相关信息，以便您能区分副本和原本。您可以按需更改此描述。

   1. **Destination Region**（目标区域）：在其中复制 AMI 的区域。有关更多信息，请参阅[跨区域复制](how-ami-copy-works.md#copy-amis-across-regions)和[跨账户复制](how-ami-copy-works.md#copy-ami-across-accounts)。

   1. **复制标签**：选中此复选框可在复制 AMI 时包含用户定义的 AMI 标签。不会复制系统标签（前缀为 `aws:`）和由其他 AWS 账户 附加的用户定义标签。

   1. **基于时间的复制**：您可以指定复制操作是在特定时限内完成还是尽力完成，如下所示：
      + 要在特定时限内完成复制，请执行以下操作：
        + 选择**启用基于时间的复制**。
        + 对于**完成时限**，输入允许执行复制操作的分钟数（以 15 分钟为增量）。此完成期限将会应用到与该 AMI 关联的所有快照。

          有关更多信息，请参阅《Amazon EBS 用户指南》中的 [Time-based copies](https://docs.aws.amazon.com/ebs/latest/userguide/time-based-copies.html)**。
      + 要尽力完成复制，请执行以下操作：
        + 保持取消选择**启用基于时间的复制**。

   1. （仅限 EBS-backed AMI）**加密 AMI 副本的 EBS 快照**：选择此复选框可加密目标快照，或使用不同的密钥对它们进行重新加密。如果启用默认加密，**加密 AMI 副本的 EBS 快照**复选框处于选中状态，无法清除。有关更多信息，请参阅 [加密和复制](how-ami-copy-works.md#ami-copy-encryption)。

   1. （仅限 EBS-backed AMI）**KMS 密钥**：用于加密目标快照的 KMS 密钥。

   1. **标签**：您可以使用相同的标签来标记新的 AMI 和新快照，也可以使用不同的标签来标记它们。
      + 要使用*相同*标签标记新的 AMI 和新快照，请选择**将映像和快照一起标记**。相同的标签将应用于新的 AMI 和创建的每个快照。
      + 要使用*不同*的标签标记新的 AMI 和新的快照，请选择**分别标记映像和快照**。对新的 AMI 和创建的快照应用了不同的标签。但是，请注意，创建的所有新快照都获得相同的标签；您不能使用不同的标签来标记每个新快照。

      要添加标签，请选择 **Add tag (添加标签)**，然后输入该标签的键和值。对每个标签重复此操作。

   1. 准备好复制 AMI 时，选择**复制 AMI**。

      新 AMI 的初始状态是 `Pending`。当状态为 `Available` 时，AMI 复制操作完成。

------
#### [ AWS CLI ]

**将 AMI 从一个区域复制到另一个区域**  
使用 [copy-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/copy-image.html) 命令。您必须指定源和目标区域。您可以使用 `--source-region` 参数指定源区域。您可以使用 `--region` 参数指定目标区域（或者省略此参数以采用 AWS CLI 设置中配置的默认区域）。

```
aws ec2 copy-image \
    --source-image-id {{ami-0abcdef1234567890}} \
    --source-region {{us-west-2}} \
    --name {{my-ami}} \
    --region {{us-east-1}}
```

要在复制期间加密目标快照，您必须指定以下额外的参数：`--encrypted` 和 `--kms-key-id`。

**将 AMI 从区域复制到本地区域**  
使用 [copy-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/copy-image.html) 命令。必须指定源和目标。您可以使用 `--source-region` 参数指定源区域。可以使用 `--destination-availability-zone` 参数指定目标本地区域（可以改用 `--destination-availability-zone-id`）。请注意，只能将 AMI 从一个区域复制到同一区域内的本地区域。

```
aws ec2 copy-image \
    --source-image-id {{ami-0abcdef1234567890}} \
    --source-region {{cn-north-1}} \
    --destination-availability-zone {{cn-north-1-pkx-1a}} \
    --name {{my-ami}} \
    --region {{cn-north-1}}
```

**将 AMI 从本地区域复制到区域**  
使用 [copy-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/copy-image.html) 命令。必须指定源和目标。您可以使用 `--source-region` 参数指定源区域。使用 `--region` 参数指定目标区域（或者省略此参数以采用 AWS CLI 设置中配置的默认区域）。源本地区域是根据指定源 AMI ID 的位置采用的。请注意，只能将 AMI 从本地区域复制到其父区域。

```
aws ec2 copy-image \
    --source-image-id {{ami-0abcdef1234567890}} \
    --source-region {{cn-north-1}} \
    --name {{my-ami}} \
    --region {{cn-north-1}}
```

**将 AMI 从一个本地区域复制到另一个本地区域**  
使用 [copy-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/copy-image.html) 命令。必须指定源和目标。可以使用 `--source-region` 参数指定本地区域的源区域。可以使用 `--destination-availability-zone` 参数指定目标本地区域（可以改用 `--destination-availability-zone-id`）。源本地区域是根据指定源 AMI ID 的位置采用的。使用 `--region` 参数指定目标本地区域的父区域（或者省略此参数以采用 AWS CLI 设置中配置的默认区域）。

```
aws ec2 copy-image \
    --source-image-id {{ami-0abcdef1234567890}} \
    --source-region {{cn-north-1}} \
    --destination-availability-zone {{cn-north-1-pkx-1a}} \
    --name {{my-ami}} \
    --region {{cn-north-1}}
```

------
#### [ PowerShell ]

**将 AMI 从一个区域复制到另一个区域**  
使用 [Copy-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Copy-EC2Image.html) cmdlet。您必须指定源和目标区域。您可以使用 `-SourceRegion` 参数指定源区域。您可以使用 `-Region` 参数或 [Set-AWSDefaultRegion](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-installing-specifying-region.html) cmdlet 指定目标区域。

```
Copy-EC2Image `
    -SourceImageId {{ami-0abcdef1234567890}} `
    -SourceRegion {{us-west-2}} `
    -Name {{my-ami}} `
    -Region {{us-east-1}}
```

要在复制期间加密目标快照，您必须指定以下额外的参数：`-Encrypted` 和 `-KmsKeyId`。

**将 AMI 从区域复制到本地区域**  
使用 [Copy-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Copy-EC2Image.html) cmdlet。必须指定源和目标。您可以使用 `-SourceRegion` 参数指定源区域。可以使用 `-DestinationAvailabilityZone` 参数指定目标本地区域（可以改用 `-DestinationAvailabilityZoneId`）。请注意，只能将 AMI 从一个区域复制到同一区域内的本地区域。

```
Copy-EC2Image `
    -SourceImageId {{ami-0abcdef1234567890}} `
    -SourceRegion {{cn-north-1}} `
    -DestinationAvailabilityZone {{cn-north-1-pkx-1a}} `
    -Name {{my-ami}} `
    -Region {{cn-north-1}}
```

**将 AMI 从本地区域复制到区域**  
使用 [Copy-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Copy-EC2Image.html) cmdlet。必须指定源和目标。您可以使用 `-SourceRegion` 参数指定源区域。使用 `-Region` 参数或 [Set-AWSDefaultRegion](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-installing-specifying-region.html) cmdlet 指定目标区域。源本地区域是根据指定源 AMI ID 的位置采用的。请注意，只能将 AMI 从本地区域复制到其父区域。

```
Copy-EC2Image `
    -SourceImageId {{ami-0abcdef1234567890}} `
    -SourceRegion {{cn-north-1}} `
    -Name {{my-ami}} `
    -Region {{cn-north-1}}
```

**将 AMI 从一个本地区域复制到另一个本地区域**  
使用 [Copy-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Copy-EC2Image.html) cmdlet。必须指定源和目标。可以使用 `-SourceRegion` 参数指定本地区域的源区域。可以使用 `-DestinationAvailabilityZone` 参数指定目标本地区域（可以改用 `-DestinationAvailabilityZoneId`）。源本地区域是根据指定源 AMI ID 的位置采用的。使用 `-Region` 参数或 [Set-AWSDefaultRegion](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-installing-specifying-region.html) cmdlet 指定目标本地区域的父区域。

```
Copy-EC2Image `
    -SourceImageId {{ami-0abcdef1234567890}} `
    -SourceRegion {{cn-north-1}} `
    -DestinationAvailabilityZone {{cn-north-1-pkx-1a}} `
    -Name {{my-ami}} `
    -Region {{cn-north-1}}
```

------

## 停止待处理的 AMI 复制操作
<a name="ami-copy-stop"></a>

您可以使用以下过程停止待处理的 AMI 复制。

------
#### [ Console ]

**停止 AMI 复制操作**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 从导航栏中，从区域选择器中选择目标区域。

1. 在导航窗格中，选择 **AMIs**。

1. 选择要停止复制的 AMI，然后选择**操作**、**取消注册 AMI**。

1. 当系统要求您确认时，选择 **Deregister AMI**（取消注册 AMI）。

------
#### [ AWS CLI ]

**停止 AMI 复制操作**  
使用 [deregister-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/deregister-image.html) 命令。

```
aws ec2 deregister-image --image-id {{ami-0abcdef1234567890}}
```

------
#### [ PowerShell ]

**使用以下方法停止 AMI 复制操作**  
使用 [Unregister-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-EC2Image.html) cmdlet。

```
Unregister-EC2Image -ImageId {{ami-0abcdef1234567890}}
```

------
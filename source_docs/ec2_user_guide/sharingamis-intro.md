

# 将您的 AMI 设为可在 Amazon EC2 中公开使用
<a name="sharingamis-intro"></a>

您可以通过向所有 AWS 账户 共享来公开您的 AMI。

如果您想阻止公开共享您的 AMI，可以启用*阻止 AMI 的公开访问*。这可以阻止任何公开 AMI 的尝试，从而有助于防止未经授权的访问和对 AMI 数据的潜在滥用。请注意，启用阻止公开访问不会影响已经公开提供的 AMI；它们仍然公开可用。有关更多信息，请参阅 [了解 AMI 的屏蔽公共访问](block-public-access-to-amis.md)。

要仅允许特定账户使用您的 AMI 启动实例，请参阅 [与特定 AWS 账户共享 AMI](sharingamis-explicit.md)。

**Topics**
+ [注意事项](#considerations-for-sharing-public-AMIs)
+ [与所有 AWS 账户共享 AMI（公开共享）](#share-an-ami-publicly)

## 注意事项
<a name="considerations-for-sharing-public-AMIs"></a>

在将 AMI 设为公用之前，请考虑以下事项。
+ **所有权** – 若要将 AMI 设为公有，您的 AWS 账户 必须拥有 AMI。
+ **区域** – AMI 是一种区域性资源。当您共享 AMI 时，则它只能在您共享该 AMI 的区域使用。要使 AMI 能够在其他区域使用，请将该 AMI 复制到该区域并进行共享。有关更多信息，请参阅 [复制 Amazon EC2 AMI](CopyingAMIs.md)。
+ **阻止公开访问** – 要公开共享 AMI，必须在 AMI 公开共享的每个区域禁用[阻止 AMI 的公开访问](block-public-access-to-amis.md)。公开共享 AMI 后，您可以重新启用阻止 AMI 的公开访问功能，以防止进一步公开共享您的 AMI。
+ **有些 AMI 无法设为公共** – 如果您的 AMI 包含以下组件之一，则无法将其设为公共（但您可以[将 AMI 与特定 AWS 账户 账户共享](sharingamis-explicit.md)）：
  + 加密卷
  + 加密卷的快照
  + 产品代码
+ **避免泄露敏感数据** – 要避免在共享 AMI 时泄露敏感数据，请阅读 [创建共享 Linux AMI 的建议](building-shared-amis.md) 中的安全注意事项并遵循建议的操作。
+ **使用** – 当您共享 AMI 时，用户只能从该 AMI 启动实例。他们无法删除、共享或修改实例。但是，在他们使用您的 AMI 启动实例后，他们可以从其启动的实例创建 AMI。
+ **自动弃用** – 默认情况下，所有公有 AMI 的弃用日期均设置为自 AMI 创建日期起 2 年。您可以将弃用日期设置为早于两年。要取消弃用日期，或将弃用移至未来某一日期，您必须通过仅[将 AMI 与特定 AWS 账户 共享](sharingamis-explicit.md)来将其设为私有。
+ **删除过时的 AMI** – 在公共 AMI 达到其弃用日期后，如果在六个月或更长时间内没有从 AMI 启动任何新实例，则 AWS 最终会删除该公共共享属性，这样过时的 AMI 就不会出现在公共 AMI 列表中。
+ **账单** – 当其他 AWS 账户 使用您的 AMI 启动实例时，您无需付费。使用 AMI 启动实例的账户将为它们启动的实例付费。

## 与所有 AWS 账户共享 AMI（公开共享）
<a name="share-an-ami-publicly"></a>

将 AMI 设为公开后，它将在控制台的**社区 AMI** 中可用，您可以从 EC2 控制台左侧导航器的 **AMI 目录**中访问此 AMI，或者在使用控制台启动实例时访问该 AMI。请注意，将某个 AMI 设置为公用之后，可能需要一点时间 **Community AMIs** 中才会显示该 AMI。

------
#### [ Console ]

**将 AMI 设为公用**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 从列表中选择您的 AMI，然后选择 **Actions**（操作）、**Edit AMI permissions**（编辑 AMI 权限）。

1. 在 **AMI 可用性**下，选择**公开**。

1. 选择**保存更改**。

------
#### [ AWS CLI ]

每个 AMI 都有一个 `launchPermission` 属性，用于控制允许哪些 AWS 账户（包括拥有者账户在内）使用该 AMI 启动实例。通过修改 AMI 的 `launchPermission` 属性，可以将该 AMI 设为公共（这会向所有 AWS 账户 授予启动权限），或仅将其与您指定的 AWS 账户 共享。

可以在具有 AMI 启动许可的账户的列表中添加或删除账户 ID。要将 AMI 设为公有，请指定 `all` 组。公用和显式启动许可都可以指定。

**将 AMI 设为公用**

1. 使用 [modify-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-image-attribute.html) 命令可以将 `all` 组添加到指定 AMI 的 `launchPermission` 列表中，如下所示。

   ```
   aws ec2 modify-image-attribute \
       --image-id {{ami-0abcdef1234567890}} \
       --launch-permission "Add=[{Group=all}]"
   ```

1. 要验证 AMI 的启动权限，请使用 [describe-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-image-attribute.html) 命令。

   ```
   aws ec2 describe-image-attribute \
       --image-id {{ami-0abcdef1234567890}} \
       --attribute launchPermission
   ```

1. （可选）要再次将 AMI 设为私有，请从其启动许可中删除 `all` 组。请注意，AMI 的拥有者始终具有启动许可，因此不受该命令影响。

   ```
   aws ec2 modify-image-attribute \
       --image-id {{ami-0abcdef1234567890}} \
       --launch-permission "Remove=[{Group=all}]"
   ```

------
#### [ PowerShell ]

每个 AMI 都有一个 `launchPermission` 属性，用于控制允许哪些 AWS 账户（包括拥有者账户在内）使用该 AMI 启动实例。通过修改 AMI 的 `launchPermission` 属性，可以将该 AMI 设为公共（这会向所有 AWS 账户 授予启动权限），或仅将其与您指定的 AWS 账户 共享。

可以在具有 AMI 启动许可的账户的列表中添加或删除账户 ID。要将 AMI 设为公有，请指定 `all` 组。公用和显式启动许可都可以指定。

**将 AMI 设为公用**

1. 使用 [Edit-EC2ImageAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2ImageAttribute.html) 命令可以将 `all` 组添加到指定 AMI 的 `launchPermission` 列表中，如下所示。

   ```
   Edit-EC2ImageAttribute `
       -ImageId {{ami-0abcdef1234567890}} `
       -Attribute launchPermission `
       -OperationType add `
       -UserGroup all
   ```

1. 要验证 AMI 的启动权限，请使用以下 [Get-EC2ImageAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageAttribute.html) 命令。

   ```
   Get-EC2ImageAttribute `
       -ImageId {{ami-0abcdef1234567890}} `
       -Attribute launchPermission
   ```

1. （可选）要再次将 AMI 设为私有，请从其启动许可中删除 `all` 组。请注意，AMI 的拥有者始终具有启动许可，因此不受该命令影响。

   ```
   Edit-EC2ImageAttribute `
       -ImageId {{ami-0abcdef1234567890}} `
       -Attribute launchPermission `
       -OperationType remove `
       -UserGroup all
   ```

------
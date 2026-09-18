

# 与特定 AWS 账户共享 AMI
<a name="sharingamis-explicit"></a>

您可以在不将 AMI 设为公共的情况下，与特定 AWS 账户 共享 AMI。您需要的只是 AWS 账户 ID。

AWS 账户 ID 是一个 12 位数字（如 `012345678901`），用于唯一标识 AWS 账户。有关更多信息，请参阅《AWS 账户管理 参考指南》中的 [Viewing AWS 账户 identifiers](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-identifiers.html)**。



## 注意事项
<a name="considerations-for-sharing-AMI-with-accounts"></a>

在与特定 AWS 账户 共享 AMI 时，请考虑以下事项。
+ **所有权** – 若要共享 AMI，您的 AWS 账户 必须拥有 AMI。
+ **共享限制** - 有关某一区域内可以共享 AMI 的最大实体数量，请参阅 [Amazon EC2 服务限额](https://docs.aws.amazon.com/general/latest/gr/ec2-service.html#limits_ec2)。
+ **标签** – 您无法共享用户定义的标签（附加到 AMI 的标签）。共享 AMI 时，与其共享 AMI 的任何 AWS 账户 均无法使用用户定义的标签。
+ **快照** – 您不需要共享某个 AMI 为了共享该 AMI 而引用的 Amazon EBS 快照。您可以仅共享 AMI 本身；系统会自动为实例提供访问所引用 EBS 快照的权限来完成启动。不过，您必须共享用于对 AMI 引用的快照进行加密的所有 KMS 密钥。有关更多信息，请参阅《Amazon EBS 用户指南》**中的[共享 Amazon EBS 快照](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modifying-snapshot-permissions.html)。
+ **加密和密钥** – 您可以共享由未加密和加密快照支持的 AMI。
  + 加密快照必须使用 KMS 密钥加密。您无法共享由使用默认 AWS 托管式密钥加密的快照支持的 AMI。
  + 如果您共享由加密快照支持的 AMI，则必须允许 AWS 账户 使用用于加密快照的 KMS 密钥。有关更多信息，请参阅 [允许企业和 OU 使用 KMS 密钥](allow-org-ou-to-use-key.md)。要设置在使用客户托管密钥进行加密时启动 Auto Scaling 实例所需的密钥策略，请参阅*《Amazon EC2 Auto Scaling 用户指南》*中的[加密卷所需的 AWS KMS key 策略](https://docs.aws.amazon.com/autoscaling/ec2/userguide/key-policy-requirements-EBS-encryption.html)。
+ **区域** – AMI 是一种区域性资源。如果您共享 AMI，则它只能在该区域使用。要使 AMI 能够在其他区域使用，请将该 AMI 复制到该区域并进行共享。有关更多信息，请参阅 [复制 Amazon EC2 AMI](CopyingAMIs.md)。
+ **使用** – 当您共享 AMI 时，用户只能从该 AMI 启动实例。他们无法删除、共享或修改实例。但是，在他们使用您的 AMI 启动实例后，他们可以从其实例创建 AMI。
+ **复制共享 AMI** – 如果另一个账户中的用户想复制共享 AMI，则必须向他们授予对支持 AMI 的存储的读取权限。有关更多信息，请参阅 [跨账户复制](how-ami-copy-works.md#copy-ami-across-accounts)。
+ **账单** – 当其他 AWS 账户 使用您的 AMI 启动实例时，您无需付费。使用 AMI 启动实例的账户将为它们启动的实例付费。

------
#### [ Console ]

**要授予显式启动许可**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 在列表中选择您的 AMI，然后选择 **Actions**、**然后选择 Edit AMI Permissions**。

1. 选择**私有**。

1. 在 **Shared accounts**（共享账户）下，选择 **Add account ID**（添加账户 ID）。

1. 对于 **AWS 账户 ID**，输入要与其共享 AMI 的 AWS 账户 ID，然后选择 **Share AMI**（共享 AMI）。

   要与多账户共享此 AMI，请重复此步骤 5 和 6，直至您添加完所需全部账户 ID。

1. 完成后，选择 **Save changes**（保存更改）。

1. （可选）要查看您已与其共享 AMI 的 AWS 账户 ID，请在列表中选择该 AMI，然后选择 **Permissions**（权限）选项卡。要查找与您共享的 AMI，请参阅[查找用于 Amazon EC2 实例的共享 AMI](usingsharedamis-finding.md)。

------
#### [ AWS CLI ]

使用 [modify-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-image-attribute.html) 命令共享 AMI，如以下示例所示。

**要授予显式启动许可**  
以下示例向指定 AWS 账户 授予指定 AMI 的启动权限。

```
aws ec2 modify-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --launch-permission "Add=[{UserId={{123456789012}}}]"
```

**要删除账户的启动许可**  
以下示例从指定 AWS 账户 中删除指定 AMI 的启动权限。

```
aws ec2 modify-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --launch-permission "Remove=[{UserId={{123456789012}}}]"
```

**要删除所有的启动许可**  
以下示例从指定 AMI 中删除所有公有和显式启动权限。请注意，AMI 的拥有者始终具有启动许可，因此不受该命令影响。

```
aws ec2 reset-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --attribute launchPermission
```

------
#### [ PowerShell ]

使用 [Edit-EC2ImageAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2ImageAttribute.html) 命令（适用于 Windows PowerShell 的工具）共享 AMI，如以下示例所示。

**要授予显式启动许可**  
以下示例向指定 AWS 账户 授予指定 AMI 的启动权限。

```
Edit-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} ` 
    -Attribute launchPermission `
    -OperationType add `
    -UserId "{{123456789012}}"
```

**要删除账户的启动许可**  
以下示例从指定 AWS 账户 中删除指定 AMI 的启动权限。

```
Edit-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -Attribute launchPermission -OperationType remove `
    -UserId "{{123456789012}}"
```

**要删除所有的启动许可**  
以下示例从指定 AMI 中删除所有公有和显式启动权限。请注意，AMI 的拥有者始终具有启动许可，因此不受该命令影响。

```
Reset-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -Attribute launchPermission
```

------
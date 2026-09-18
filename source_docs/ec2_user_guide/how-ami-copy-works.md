

# Amazon EC2 AMI 复制工作原理
<a name="how-ami-copy-works"></a>

复制源 AMI 将生成完全相同但独立的新 AMI（我们也称之为*目标* AMI）。目标 AMI 有自己的唯一 AMI ID。您可以更改或注销源 AMI，这不会对目标 AMI 产生任何影响。反之亦然。

对于 EBS-backed AMI，每个支持快照将会复制到完全相同但独立的目标快照。如果您将 AMI 复制到新区域，则快照是完整的（非增量）副本。如果您加密未加密的备份快照或将其加密到新 KMS 密钥，则快照是完整（非增量）副本。后续的 AMI 复制操作会生成备份快照的增量副本。

**Topics**
+ [跨区域复制](#copy-amis-across-regions)
+ [跨账户复制](#copy-ami-across-accounts)
+ [基于时间的 AMI 复制操作](#ami-time-based)
+ [加密和复制](#ami-copy-encryption)

## 跨区域复制
<a name="copy-amis-across-regions"></a>

跨不同地理位置复制 AMI 具有以下优势：
+ 一致的全球部署：通过将 AMI 从一个区域复制到另一个区域，您可以根据相同的 AMI 在不同的区域中启动一致的实例。
+ 可扩展性：无论用户身处何处，您都可以更轻松地设计和构建能满足他们需求的全球应用程序。
+ 性能：您可以通过分发您的应用程序以及找到较接近您用户的应用程序的关键组件来提高性能。您还可以利用区域特定的功能，例如，实例类型或其他 AWS 服务。
+ 高可用性：您可以跨 AWS 区域设计和部署应用程序以提高可用性。

下图显示源 AMI、在不同的区域中复制的两个 AMI 以及从它们中启动的 EC2 实例之间的关系。从 AMI 中启动实例时，该实例位于 AMI 所在的区域中。如果您更改源 AMI，并希望在目标区域中的 AMIs 上反映这些更改，您必须将源 AMI 重新复制到目标区域中。

![在不同区域中复制的 AMI。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ami_copy.png)


在首次将 Amazon S3 支持的 AMI 复制到一个区域时，我们为复制到该区域的 AMI 创建一个 Amazon S3 存储桶。复制到该区域的所有 Amazon S3 支持的 AMI 存储在该存储桶中。存储桶名称具有以下格式：amis-for-{{account}}-in-{{region}}-{{hash}}。例如：`amis-for-123456789012-in-us-east-2-yhjmxvp6`。

**先决条件**  
在复制 AMI 之前，您必须确保更新源 AMI 的内容以支持在不同的区域中运行。例如，您应更新任何数据库连接字符串或相似的应用程序配置数据，以指向适当的资源。否则，从目标区域上的新 AMI 中启动的实例可能仍会使用源区域中的资源，这可能会影响性能和成本。

**限制**
+ 目标区域限制为 300 个并发 AMI 复制操作。这也适用于基于时间的 AMI 复制操作。
+ 您无法将半虚拟化（PV）AMI 复制到不支持 PV AMI 的区域。有关更多信息，请参阅 [虚拟化类型](ComponentsAMIs.md#virtualization_types)。

## 跨账户复制
<a name="copy-ami-across-accounts"></a>

如果[与您的 AWS 账户 共享](sharingamis-explicit.md)另一 AWS 账户 的 AMI，您可以复制共享的 AMI。这称为跨账户复制。与您共享的 AMI 就是源 AMI。复制源 AMI 时，即创建了一个新的 AMI。新的 AMI 通常称为目标 AMI。

**AMI 成本**
+ 对于共享 AMI，共享 AMI 的账户要支付该区域的存储费用。
+ 如果您复制了与您的账户共享的 AMI，则您就是账户中目标 AMI 的所有者。
  + 源 AMI 的所有者需要支付标准 Amazon EBS 或 Amazon S3 传输费用。
  + 您需要支付目标区域中的目标 AMI 存储费用。

**资源权限**  
要复制其他账户与您共享的 AMI，源 AMI 的所有者必须授予您对支持该 AMI 的存储的读取权限，而不仅限于该 AMI 本身的权限。存储是关联的 EBS 快照（用于 Amazon EBS-backed AMI）或关联的 S3 存储桶（用于 Amazon S3 支持的 AMI）。如果共享 AMI 具有加密快照，则拥有者必须同时与您共享一个或多个密钥。有关授予资源权限的更多信息，对于 EBS 快照，请参阅《Amazon EBS 用户指南》**中的 [Share an Amazon EBS snapshot with other AWS 账户](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modifying-snapshot-permissions.html)；对于 S3 存储桶，请参阅《Amazon S3 用户指南》**中的 [Amazon S3 的身份和访问管理](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-iam.html)。

**注意**  
附加到源 AMI 的标签不会跨账户复制到目标 AMI。

## 基于时间的 AMI 复制操作
<a name="ami-time-based"></a>

当您为具有单个关联快照的 EBS 支持的 AMI 启动基于时间的 AMI 复制操作时，其行为方式将与**单个基于时间的快照复制操作**相同，并且具有相同的吞吐量限制。

当您为具有多个关联快照的 EBS 支持的 AMI 启动基于时间的 AMI 复制操作时，其行为方式将与**并发基于时间的快照复制操作**相同，并且具有相同的吞吐量限制。每个关联的快照都会导致一个单独的快照复制请求，并且每个请求都会占用您的累积快照复制吞吐量配额。您指定的完成期限将应用于每个关联的快照。

有关更多信息，请参阅《Amazon EBS 用户指南》中的 [Time-based copies](https://docs.aws.amazon.com/ebs/latest/userguide/time-based-copies.html)**。

## 加密和复制
<a name="ami-copy-encryption"></a>

下表显示了各种 AMI 复制场景的加密支持。尽管可以复制未加密快照来生成加密快照，但是不能复制加密快照来生成未加密快照。


| 场景 | 描述 | 支持 | 
| --- | --- | --- | 
| 1 | 未加密到未加密 | 是 | 
| 2 | 已加密到已加密 | 是 | 
| 3 | 未加密到已加密 | 是 | 
| 4 | 已加密到未加密 | 否 | 

**注意**  
在 `CopyImage` 操作期间加密仅适用于 Amazon EBS-backed AMI。由于 Amazon S3 支持的 AMI 不使用快照，因此您不能使用复制来更改其加密状态。

当您复制 AMI 而不指定加密参数时，默认情况下将复制备份快照及其原始加密状态。因此，如果源 AMI 由未加密的快照支持，则生成的目标快照也将处于未加密状态。同样，如果源 AMI 的快照已加密，则生成的目标快照也将使用相同的 AWS KMS 密钥进行加密。对于多个快照支持的 AMI，每个目标快照都会保留其对应源快照的加密状态。

要在 AMI 复制期间更改目标备份快照的加密状态，可以指定加密参数。以下示例显示非默认情况，其中使用 `CopyImage` 操作指定加密参数来更改目标 AMI 的加密状态。

**将未加密的源 AMI 复制到加密目标 AMI**

在这种情况下，由未加密根快照支持的 AMI 会复制到带加密根快照的 AMI。`CopyImage` 操作将使用两个加密参数（包括一个客户托管密钥）调用。因此，根快照的加密状态发生变化，这样目标 AMI 由与原快照具有相同数据的根快照支持，但使用指定的密钥进行加密。在两个 AMI 中，您都会产生快照的存储成本，以及从任一 AMI 启动的任何实例的费用。

**注意**  
启用默认加密与将 AMI 中所有快照的 `Encrypted` 参数设置为 `true` 具有相同的效果。

![即时复制 AMI 并加密快照](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ami-to-ami-convert.png)


设置 `Encrypted` 参数会加密此实例的单个快照。如果您未指定 `KmsKeyId` 参数，会使用默认客户托管密钥来加密快照副本。

有关复制带加密快照的 AMIs 的更多信息，请参阅[将加密与 EBS 支持的 AMI 结合使用](AMIEncryption.md)。
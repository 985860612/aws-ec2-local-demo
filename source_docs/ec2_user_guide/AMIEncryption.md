

# 将加密与 EBS 支持的 AMI 结合使用
<a name="AMIEncryption"></a>

由 Amazon EBS 快照支持的 AMI 可以利用 Amazon EBS 加密。可以将数据和根卷的快照加密并附加到 AMI。在启动实例和复制映像时，您可以包含 EBS 完全加密支持。在提供了 AWS KMS 的所有区域中，支持在这些操作中使用加密参数。

从 AMIs 中启动带加密 EBS 卷的 EC2 实例的方式与其他实例相同。另外，从未加密 EBS 快照支持的 AMI 中启动实例时，您可以在启动过程中将部分或全部卷加密。

与 EBS 卷相似，可使用默认 AWS KMS key 或您指定的客户托管密钥加密 AMI 中的快照。在所有情况下，您都必须拥有使用所选 KMS 密钥 的权限。

带加密快照的 AMI 可以跨 AWS 账户共享。有关更多信息，请参阅[了解 Amazon EC2 中共享 AMI 的使用情况](sharing-amis.md)。

**Topics**
+ [启动实例场景](#AMI-encryption-launch)
+ [映像复制场景](#AMI-encryption-copy)

## 启动实例场景
<a name="AMI-encryption-launch"></a>



Amazon EC2 实例是通过 AWS 管理控制台 或者直接使用 Amazon EC2 API 或 CLI，使用 `RunInstances` 操作以及通过块储存设备映射提供的参数在 AMI 中启动的。有关更多信息，请参阅 [Amazon EC2 实例上卷的块设备映射](block-device-mapping-concepts.md)。有关通过 AWS CLI 控制数据块设备映射的示例，请参阅[启动、列出和终止 EC2 实例](https://docs.aws.amazon.com/cli/latest/userguide/cli-services-ec2-instances.html)。

如果不使用显式加密参数，在默认情况下，`RunInstances` 操作会在从 AMI 的源快照中还原 EBS 卷时保持这些快照的现有加密状态。如果启用默认加密，从 AMI 中（无论使用加密还是未加密的快照）创建的所有卷都会被加密。如果在默认情况下并未启用加密，则实例保持 AMI 的加密状态。

您也可以启动实例，同时通过提供加密参数来对结果卷应用新的加密状态。因此，会观察到以下行为：

**启动时不指定加密参数**
+ 未加密快照会还原为未加密卷，除非已在默认情况下启用加密，那么所有新创建的所有卷都将加密。
+ 您拥有的加密快照会还原为使用相同 KMS 密钥 加密的卷。
+ 您未拥有的加密快照（例如，与您共享了 AMI）会还原到由您的 AWS 账户的默认 KMS 密钥加密的卷。

可以通过提供加密参数覆盖默认行为。可用参数包括 `Encrypted` 和 `KmsKeyId`。仅设置 `Encrypted` 参数会得到以下结果：

**已设置 `Encrypted`，但未指定 `KmsKeyId` 时的实例启动行为**
+ 未加密快照会还原到由您的 AWS 账户的默认 KMS 密钥加密的 EBS 卷。
+ 您拥有的加密快照会还原到由相同 KMS 密钥 加密的 EBS 卷。（也就是说，`Encrypted` 参数没有影响。）
+ 您未拥有的加密快照（即，AMI 与您共享）会还原到由您的 AWS 账户的默认 KMS 密钥加密的卷。（也就是说，`Encrypted` 参数没有影响。）

如果同时设置 `Encrypted` 和 `KmsKeyId` 参数，可以为加密操作指定非默认 KMS 密钥。会实现以下行为：

**同时设置 `Encrypted` 和 `KmsKeyId` 的实例**
+ 未加密快照会还原到由指定 KMS 密钥 加密的 EBS 卷。
+ 加密快照还原为未使用原始 KMS 密钥 加密，而是使用指定 KMS 密钥 加密的 EBS 卷。

提交 `KmsKeyId` 但没有同时设置 `Encrypted` 参数会导致错误。

以下部分提供使用非默认加密参数从 AMI 中启动实例的示例。在以下每个场景中，提供给 `RunInstances` 操作的参数会导致在使用快照还原卷的过程中加密状态发生变化。

有关使用控制台从 AMI 启动实例的信息，请参阅 [启动 Amazon EC2 实例](LaunchingAndUsingInstances.md)。

### 在启动过程中加密卷
<a name="launch1"></a>

在该示例中，使用未加密快照支持的 AMI 启动带加密 EBS 卷的 EC2 实例。

![启动实例并对卷进行动态加密。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ami-launch-convert.png)


仅使用 `Encrypted` 参数的结果是对该实例中的卷行加密。提供 `KmsKeyId` 参数是可选的。如果未指定 KMS 密钥 ID，会使用 AWS 账户的默认 KMS 密钥加密卷。要使用您拥有的不同 KMS 密钥 加密卷，请提供 `KmsKeyId` 参数。

### 在启动过程中重新加密卷
<a name="launch2"></a>

在该示例中，使用加密快照支持的 AMI 启动带有由新 KMS 密钥 加密的 EBS 卷的 EC2 实例。

![启动实例并重新对卷进行动态加密。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ami-launch-encrypted.png)


如果您拥有 AMI 且未提供加密参数，则生成的实例具有由与快照相同的 KMS 密钥 加密的卷。如果 AMI 是与他人共享而不是由您拥有，且您未提供加密参数，则由您的默认 KMS 密钥 对卷进行加密。如果按所示提供加密参数，则会由指定 KMS 密钥 对卷进行加密。

### 在启动过程中更改多个卷的加密状态
<a name="launch3"></a>

在这一更为复杂的示例中，会使用多个快照（分别具有自己的加密状态）支持的 AMI 启动带有新加密卷和重新加密卷的 EC2 实例。

![在启动过程中加密和重新加密多个卷。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ami-launch-mixed.png)


在这种情况下，会为 `RunInstances` 操作提供用于各个源快照的加密参数。在指定所有可用的加密参数后，无论您是否拥有 AMI，结果实例都相同。

## 映像复制场景
<a name="AMI-encryption-copy"></a>

可通过 AWS 管理控制台 或者直接使用 Amazon EC2 API 或 CLI，使用 `CopyImage` 操作复制 Amazon EC2 AMI。

如果不使用显式加密参数，在默认情况下，`CopyImage` 操作会在复制 AMI 的源快照时保持这些快照的现有加密状态。您也可以复制 AMI，同时通过提供加密参数来对其关联的 EBS 快照应用新的加密状态。因此，会观察到以下行为：

**复制时不指定加密参数**
+ 未加密快照会复制为另一个未加密快照，除非已在默认情况下启用加密，那么所有新创建的快照都将加密。
+ 您拥有的加密快照会复制为使用相同 KMS 密钥 加密的快照。
+ 您未拥有的加密快照（例如，与您共享了 AMI）会复制为由您的 AWS 账户的默认 KMS 密钥加密的快照。

可以通过提供加密参数覆盖以上所有默认行为。可用参数包括 `Encrypted` 和 `KmsKeyId`。仅设置 `Encrypted` 参数会得到以下结果：

**已设置 `Encrypted`，但未指定 `KmsKeyId` 时的复制映像行为**
+ 未加密快照会复制为由 AWS 账户的默认 KMS 密钥加密的快照。
+ 加密快照会复制为由相同 KMS 密钥 加密的快照。（也就是说，`Encrypted` 参数没有影响。）
+ 您未拥有的加密快照（即，AMI 与您共享）会复制到由您的 AWS 账户的默认 KMS 密钥加密的卷。（也就是说，`Encrypted` 参数没有影响。）

通过同时设置 `Encrypted` 和 `KmsKeyId` 参数，可以为加密操作指定客户托管的 KMS 密钥。会实现以下行为：

**同时设置 `Encrypted` 和 `KmsKeyId` 时的复制映像行为**
+ 未加密快照会复制为由指定 KMS 密钥 加密的快照。
+ 加密快照会复制为未使用原始 KMS 密钥 加密，而是使用指定 KMS 密钥 加密的快照。

提交 `KmsKeyId` 但没有同时设置 `Encrypted` 参数会导致错误。

以下部分提供使用非默认加密参数复制 AMI，导致更改加密状态的示例。

有关使用控制台的说明，请参阅 [复制 Amazon EC2 AMI](CopyingAMIs.md)。

### 在复制过程中将未加密映像加密
<a name="copy-unencrypted-to-encrypted"></a>

在这种情况下，由未加密根快照支持的 AMI 会复制到带加密根快照的 AMI。`CopyImage` 操作将使用两个加密参数（包括一个客户托管密钥）调用。因此，根快照的加密状态发生变化，这样目标 AMI 由与原快照具有相同数据的根快照支持，但使用指定的密钥进行加密。在两个 AMI 中，您都会产生快照的存储成本，以及从任一 AMI 启动的任何实例的费用。

**注意**  
启用默认加密与将 AMI 中所有快照的 `Encrypted` 参数设置为 `true` 具有相同的效果。

![即时复制 AMI 并加密快照](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ami-to-ami-convert.png)


设置 `Encrypted` 参数会加密此实例的单个快照。如果您未指定 `KmsKeyId` 参数，会使用默认客户托管密钥来加密快照副本。

**注意**  
您也可以复制带多个快照的映像，并单独配置每个快照的加密状态。
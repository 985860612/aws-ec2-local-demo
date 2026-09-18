

# 标记 Amazon EC2 资源
<a name="Using_Tags"></a>

为了方便您管理实例、映像以及其他 Amazon EC2 资源，您可通过*标签* 的形式为每个资源分配元数据。标签可让您按各种标准（例如用途、所有者或环境）对 AWS 资源进行分类。这在您具有相同类型的很多资源时会很有用 – 您可以根据分配给特定资源的标签快速识别该资源。本主题介绍标签并说明如何创建标签。

**警告**  
很多不同的 API 调用返回标签键及其值。拒绝访问 `DescribeTags` 不会自动拒绝访问其他 API 返回的标签。作为最佳实践，我们建议您不要在标签中包含敏感数据。

**Topics**
+ [有关标签的基本知识](#tag-basics)
+ [标记 资源](#tag-resources)
+ [标签限制](#tag-restrictions)
+ [标签和访问管理](#tag-resources-access-management)
+ [为资源添加标签以便于进行计费](#tag-resources-for-billing)
+ [资源标记权限](supported-iam-actions-tagging.md)
+ [添加或删除标签](Using_Tags_Console.md)
+ [按标签筛选资源](filtering-the-list-by-tag.md)
+ [使用实例元数据来查看标签](work-with-tags-in-IMDS.md)

## 有关标签的基本知识
<a name="tag-basics"></a>

标签是为AWS资源分配的标记。每个标签都包含您定义的一个*键* 和一个可选*值*。

标签可让您按各种标准（例如用途、所有者或环境）对 AWS 资源进行分类。例如，您可以为账户中的 Amazon EC2 实例定义一组标签，以跟踪每个实例的所有者和堆栈级别。

下图说明了标签的工作方式。在此示例中，您为每个实例分配了两个标签 — 一个标签使用键 `Owner`，另一个使用键 `Stack`。每个标签都拥有相关的值。

![标签示例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/Tag_Example.png)


我们建议您针对每类资源设计一组标签，以满足您的需要。使用一组连续的标签键，管理资源时会更加轻松。您可以根据添加的标签搜索和筛选资源。有关如何实施有效资源标记策略的更多信息，请参阅 [标记最佳实践 AWS 白皮书](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/tagging-best-practices.html)。

标签对 Amazon EC2 没有任何语义意义，应严格按字符串进行解析。同时，标签不会自动分配至您的资源。您可以修改标签的密钥和值，还可以随时删除资源的标签。您可以将标签的值设为空的字符串，但是不能将其设为空值。如果您添加的标签的值与该实例上现有标签的值相同，新的值就会覆盖旧值。如果删除资源，资源的所有标签也会被删除。

**注意**  
删除资源后，其标签可能会在短时间内在控制台、API 和 CLI 输出中仍保持可见。这些标签将逐步解除与资源的关联，并永久删除。

## 标记 资源
<a name="tag-resources"></a>

当您使用 Amazon EC2 控制台时，可以使用相关资源屏幕上的**标签**选项卡或 AWS Resource Groups 控制台中的**标签编辑器**，将标签应用到资源。在您创建资源时，某些资源屏幕能让您为资源指定标签；例如，具有 `Name` 键并且具有您指定的值的标签。在大多数情况下，控制台会在资源创建后 (而不是在资源创建期间) 立即应用标签。控制台可能根据 `Name` 标签对资源进行组织，但此标签对于 Amazon EC2 服务没有任何语义意义。

如果使用的是 Amazon EC2 API、AWS CLI 或 AWS 软件开发工具包，则您可以使用 `CreateTags` EC2 API 操作向现有资源应用标签。此外，某些资源创建操作允许您在创建资源时为其指定标签。如果无法在资源创建期间应用标签，系统会回滚资源创建过程。这样可确保要么创建带有标签的资源，要么根本不创建资源，即任何时候都不会创建出未标记的资源。通过在创建时标记资源，您不需要在资源创建后运行自定义标记脚本。有关允许用户在创建时标记资源的更多信息，请参阅 [在创建过程中授予标记 Amazon EC2 资源的权限](supported-iam-actions-tagging.md)。

对于支持在创建时进行标记的 Amazon EC2 API 操作，您可以在 IAM policies 中应用基于标签的资源级权限，以对可在创建时标记资源的用户和组实施精细控制。您的资源从创建开始会受到适当的保护 — 标签会立即用于您的资源，因此控制资源使用的任何基于标签的资源级权限都会立即生效。可以更准确地对您的资源进行跟踪和报告。您可以强制对新资源使用标记，可以控制对资源设置哪些标签键和值。

此外，您还可以在 IAM policies 中对 `CreateTags` 和 `DeleteTags` Amazon EC2 API 操作应用资源级权限，从而控制对现有资源设置哪些标签键和值。有关更多信息，请参阅[示例：标记资源](ExamplePolicies_EC2.md#iam-example-taggingresources)。

有关标记资源以便于计费的更多信息，请参阅 *AWS Billing 用户指南*中的[使用成本分配标签](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html)。

## 标签限制
<a name="tag-restrictions"></a>

下面是适用于标签的基本限制：
+ 每个资源的标签数上限：50
+ 对于每个资源，每个标签键都必须是唯一的，每个标签键只能有一个值。
+ 最大键长度：128 个 Unicode 字符（采用 UTF-8 格式）
+ 最大值长度：256 个 Unicode 字符 (采用 UTF-8 格式)
+ 允许使用的字符
  + 虽然 EC2 允许在其标签中使用任何字符，但其他 AWS 服务具有更严格的限制。允许在所有 AWS 服务中使用的字符包括：可以使用 UTF-8 表示的字母（`a-z`、`A-Z`）、数字（`0-9`）和空格以及以下字符：`+ - = . _ : / @`。
  + 如果在实例元数据中启用实例标签，实例标签*键*只能使用字母 (`a-z`、`A-Z`)、数字 (`0-9`) 及以下字符：`+ - = . , _ : @`。实例标签 *keys* 不能包含空格或 `/`，也不能只包含 `.`（一个句号）、`..`（两个句号）或 `_index`。有关更多信息，请参阅 [使用实例元数据来查看 EC2 实例的标签](work-with-tags-in-IMDS.md)。
+ 标签键和值区分大小写。
+ `aws:` 前缀专门预留供 AWS 使用。如果某个标签具有带有此标签键，则您无法编辑该标签的键或值。具有 `aws:` 前缀的标签不计入每个资源的标签数限制。

您不能仅依据标签终止或删除资源，而必须指定资源的标识符。例如，要删除您使用名为 `DeleteMe` 的标签键标记的快照，您必须将 `DeleteSnapshots` 操作与快照的资源标识符 (如 `snap-1234567890abcdef0`) 结合使用。

当您为公有或共享资源添加标签时，您分配的标签仅对您的 AWS 账户可用；其他 AWS 账户无权访问这些标签。为了对共享资源进行基于标签的访问控制，每个 AWS 账户必须分配自己的一组标签来控制对资源的访问。

## 标签和访问管理
<a name="tag-resources-access-management"></a>

如果您使用的是 AWS Identity and Access Management (IAM)，则可以控制AWS账户中的哪些用户拥有创建、编辑或删除标签的权限。有关更多信息，请参阅[在创建过程中授予标记 Amazon EC2 资源的权限](supported-iam-actions-tagging.md)。

您还可以使用资源标签来实现基于属性的控制 (ABAC)。您可以创建 IAM policies，基于资源标签允许操作。有关更多信息，请参阅[使用基于属性的访问控制访问权限](iam-policies-for-amazon-ec2.md#control-access-with-tags)。

## 为资源添加标签以便于进行计费
<a name="tag-resources-for-billing"></a>

您也可以使用标签来组织您的 AWS 账单，使其反映您的成本结构。要执行此操作，请注册以获取包含标签键值的 AWS 账户账单。有关设置带有标签的成本分配报告的更多信息，请参阅 *AWS Billing 用户指南*中的[月度成本分配报告](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/configurecostallocreport.html)。如需查看组合资源的成本，请按具有相同标签键值的资源组织您的账单信息。例如，您可以将特定的应用程序名称用作几个资源的标签，然后组织账单信息，以查看在数个服务中的使用该应用程序的总成本。有关更多信息，请参阅 *AWS Billing 用户指南*中的[使用成本分配标签](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html)。

**注意**  
如果您已启用报告，则可以在 24 小时后查看当月的数据。

成本分配标签可指示哪些资源导致产生成本，而删除或停用资源并不总是能降低成本。例如，即使删除包含原始数据的快照，其他快照引用的快照数据也将保留。有关更多信息，请参阅 *AWS Billing 用户指南*中的 [Amazon Elastic Block Store 卷和快照](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/checklistforunwantedcharges.html#checkebsvolumes)。

**注意**  
标记的弹性 IP 地址不会显示在成本分配报告中。
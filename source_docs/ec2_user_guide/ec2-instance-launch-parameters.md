

# Amazon EC2 实例配置参数参考
<a name="ec2-instance-launch-parameters"></a>

Amazon EC2 控制台中的启动实例向导和启动模板提供了用于配置 Amazon EC2 实例的所有参数。

除了密钥对外，启动实例向导还会为每个参数提供默认值。您可以接受任何或全部默认值，也可以通过自己的值来配置实例。创建启动模板时，参数是可选的。如果您使用启动模板启动实例，则启动模板中指定的参数将覆盖启动实例向导中的默认值。启动模板中未指定的任何参数都将默认为启动实例向导提供的值。

这些参数在启动实例向导和启动模板中进行了分组。以下描述根据控制台中的参数分组呈现。

**Topics**
+ [名称和标签](#liw-name-and-tags)
+ [应用程序和操作系统映像（亚马逊机器映像）](#liw-ami)
+ [实例类型](#liw-instance-type)
+ [密钥对（登录）](#liw-key-pair)
+ [网络设置](#liw-network-settings)
+ [配置存储](#liw-storage)
+ [高级详细信息](#liw-advanced-details)
+ [摘要](#liw-summary)

## 名称和标签
<a name="liw-name-and-tags"></a>

实例名称是一个标签，其中密钥为 **Name**（名称），而值为您指定的名称。您可以标记实例、卷和网络接口。对于竞价型实例，您只能标记竞价型实例请求。有关标签的信息，请参阅 [标记 Amazon EC2 资源](Using_Tags.md)。

指定实例名称和其它标签为可选项。
+ 对于 **Name**（名称），为实例输入一个描述性名称。如果您没有指定名称，则可以通过其 ID 标识实例，该 ID 将在您启动实例时自动生成。
+ 要添加其它标签，请选择 **Add additional tags**（添加其它标签）。选择 **Add tag**（添加标签），然后输入密钥和值，然后选择要标记的资源类型。为每个要添加的其它标签选择 **Add tag**（添加标签）。

您只能在启动实例时指定实例名称。创建启动模板时您无法命名实例，但可以为实例启动时创建的资源添加标签。

## 应用程序和操作系统映像（亚马逊机器映像）
<a name="liw-ami"></a>

亚马逊机器映像（AMI）中包含了创建实例所需的信息。例如，AMI 可能包含充当 Web 服务器所需的软件，例如 Linux、Apache 和您的网站。

您可以找到适合的 AMI，如下所示。通过查找 AMI 的每个选项，您可以选择右上角的 **Cancel**（取消）以返回启动实例向导，而不选择 AMI。

**搜索栏**  
要搜索所有可用的 AMI，请在 AMI 搜索栏中输入关键字，然后按 **Enter** 键。要选择 AMI，请选择 **Select**（选择）。

**最近使用的项目**  
您最近使用的 AMI。  
选择**最近启动**或**当前使用**，然后在**亚马逊机器映像（AMI）**中，选择一个 AMI。

**我的 AMI**  
您拥有的私有 AMI，或与您共享的私有 AMI。  
选择**我拥有的**或**与我共享**，然后在**亚马逊机器映像（AMI）**中选择一个 AMI。

**快速入门**  
AMI 按操作系统 (OS) 分组以助您快速入门。  
首先选择所需的操作系统，然后从**亚马逊机器映像（AMI）**中选择一个 AMI。要选择可以在 AWS 免费套餐下使用的 AMI，请确保该 AMI 已标记**符合免费套餐资格**。

**浏览更多 AMI**  
选择 **Browse more AMIs**（浏览更多 AMI）以浏览完整的 AMI 目录。  
+ 要搜索所有可用的 AMI，请在搜索栏中输入关键字，然后按 **Enter** 键。
+ 要使用 Systems Manager 参数查找 AMI，请选择搜索栏右侧的箭头按钮，然后选择 **Search by Systems Manager parameter**（按 Systems Manager 参数搜索）。有关更多信息，请参阅 [使用 Systems Manager 参数引用 AMI](using-systems-manager-parameter-to-find-AMI.md)。
+ 要按类别搜索，请依次选择 **Quickstart AMI**、**My AMIs**（我的 AMI）、**AWS Marketplace AMI** 或者 **Community AMIs**（社区 AMI）。

  AWS Marketplace 是一个在线商店，您可以从中购买在 AWS 上运行的软件（包括 AMI）。有关从 AWS Marketplace 启动实例的更多信息，请参阅[从 AWS Marketplace AMI 中启动 Amazon EC2 实例](launch-marketplace-console.md)。在 **Community AMIs**（社区 AMI）中，您可以找到 AWS 社区成员提供给其它人使用的 AMI。将来自 Amazon 或经过验证的合作伙伴的 AMI 标记为**经过验证的提供商**。
+ 要筛选 AMI 列表，请在屏幕左侧的 **Refine results**（优化结果）下方选中一个或多个复选框。筛选条件选项会因所选搜索类别而有所不同。
+ 检查对每个 AMI 列出的 **Root device type (根设备类型)**。请注意哪些 AMI 是您需要的类型：即 **ebs**（由 Amazon EBS 支持）或 **instance-store**（由实例存储支持）。有关更多信息，请参阅 [根卷类型](ComponentsAMIs.md#storage-for-the-root-device)。
+ 检查对每个 AMI 列出的 **Virtualization type (虚拟化类型)**。注意哪些 AMI 类型是您需要的类型：即 **hvm**（全虚拟化）或 **paravirtual**（半虚拟化）。例如，一些实例类型需要 HVM。有关 Linux 虚拟化类型更多信息，请参阅 [虚拟化类型](ComponentsAMIs.md#virtualization_types)。
+ 检查对每个 AMI 列出的**启动模式**。请注意哪些 AMI 使用您需要的启动模式：**legacy-bios**、**uefi** 或 **uefi-preferred**。有关更多信息，请参阅 [使用 Amazon EC2 启动模式的实例启动行为](ami-boot.md)。
+ 选择满足您的需求的 AMI，然后选择 **Select**。

**更改 AMI 时发出警告**  
启动实例时，如果您修改了与所选 AMI 关联的任何卷或安全组的配置，然后选择了其他 AMI，则会打开一个窗口，警告您当前的某些设置将被更改或删除。您可以查看对安全组和卷的更改。此外，您可以查看将添加和删除哪些卷，也可以仅查看要添加的卷。创建启动模板时不会出现此警告。

## 实例类型
<a name="liw-instance-type"></a>

实例类型定义了实例的硬件配置和大小。更大的实例类型拥有更多的 CPU 和内存。有关更多信息，请参阅 [Amazon EC2 实例类型](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html)。
+ **Instance type (实例类型)**：确保实例类型与指定的 AMI 兼容。有关更多信息，请参阅 [Amazon EC2 实例类型](instance-types.md)。

  **免费套餐**：您可以在免费套餐下免费使用标有**符合免费套餐资格**的实例类型。具体的实例类型取决于您创建 AWS 账户的时间。

  如果您在 2025 年 7 月 15 日之前创建 AWS 账户且其使用时间未满 12 个月，您可以通过选择 **t2.micro** 实例类型（或在 **t2.micro** 不可用的区域中选择 **t3.micro** 实例类型）来使用免费套餐下的 Amazon EC2。请注意，在启动 **t3.micro** 实例时，默认会启用[**无限**模式](burstable-performance-instances-unlimited-mode.md)，该模式可能会根据 CPU 使用情况产生额外费用。

  如果您是在 2025 年 7 月 15 日当天或之后创建的 AWS 账户，则可以使用 **t3.micro**、**t3.small**、**t4g.micro**、**t4g.small**、**c7i-flex.large** 和 **m7i-flex.large** 实例类型 6 个月，或直到您的服务抵扣金用完为止。

  有关更多信息，请参阅 [2025 年 7 月 15 日之前和之后的免费套餐权益](ec2-free-tier-usage.md#ec2-free-tier-comparison)。
+ **比较实例类型**：您可以通过以下属性比较不同的实例类型：vCPU 数、架构、内存量 (GiB)、存储量 (GB)、存储类型和网络性能。
+ **获取建议**：您可以从 EC2 实例类型查找器中获取实例类型指导和建议。有关更多信息，请参阅 [从 EC2 实例类型查找器获取建议](get-ec2-instance-type-recommendations.md)。
+ （仅限启动模板）**高级**：要指定实例属性并让 Amazon EC2 使用这些属性识别实例类型，请选择**高级**，然后选择**指定实例类型属性**。
  + **Number of vCPUs**（vCPU 量）：输入您的计算要求的最小 vCPU 数和最大 vCPU 数。若要表示为无限制，请输入最小值为 **0**，然后将最大值留空。
  + **Amount of memory (MiB)** (内存量 (MiB))：输入您的计算要求的最小内存量和最大内存量（以 MiB 为单位）。若要表示为无限制，请输入最小值为 **0**，然后将最大值留空。
  + 展开 **Optional instance type attributes**（可选的实例类型属性），然后选择 **Add attribute**（添加属性）以更详细地表达您的计算需求。有关每个属性的信息，请参阅 [Amazon EC2 API 参考](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_InstanceRequirementsRequest.html)中的 *InstanceRequirementsRequest*。
  + **Resulting instance types**（生成的实例类型）：您可以预览与指定属性匹配的实例类型。若要排除实例类型，请选择 **Add attribute**（添加属性），并从 **Attribute**（属性）列表中选择 **Excluded instance types**（排除的实例类型）。从 **Attribute value**（属性值）列表中，选择要排除的实例类型。

## 密钥对（登录）
<a name="liw-key-pair"></a>

为 **Key pair name**（密钥对名称）选择一个现有密钥对，或选择 **Create new key pair**（创建新密钥对）来新建一个密钥对。有关更多信息，请参阅 [Amazon EC2 密钥对和 Amazon EC2 实例](ec2-key-pairs.md)。

**重要**  
如果您选择 **Proceed without key pair (Not recommended)**（在没有密钥对的情况下继续（不推荐））选项，则将无法连接到此实例，除非您选择配置为允许用户以其它方式登录的 AMI。

## 网络设置
<a name="liw-network-settings"></a>

网络设置定义实例的 [IP 地址](using-instance-addressing.md)、[安全组](ec2-security-groups.md)和[网络接口](using-eni.md)。您可以使用默认网络设置或根据需要进行配置。
+ （仅限启动实例向导）**VPC**：为您的实例选择现有 VPC。默认选中该区域的默认 VPC。或者，您可以选择自己创建的或与您共享的 VPC。有关更多信息，请参阅 [适用于您的 EC2 实例的虚拟私有云](using-vpc.md)。
+ **子网**：为实例选择子网，或者选择**创建新子网**，使用 Amazon VPC 控制台创建新子网。
  + 您可以在任何可用区、本地区域、Wavelength 区域或 Outpost 区域内为所选 VPC 创建子网。
  + 要在仅使用 IPv6 的子网中启动实例，该实例必须是[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。
+ （仅限启动实例向导）**自动分配公有 IP**：启用或禁用自动分配公有 IPv4 地址。在默认子网中启动实例时，默认值为**启用**。在非默认子网中启动实例时，默认值为**禁用**。有关更多信息，请参阅 [公有 IPv4 地址](using-instance-addressing.md#concepts-public-addresses)。

  如果添加辅助网络接口，则无法为非默认子网启用此选项。有关更多信息，请参阅 [在启动时分配公有 IPv4 地址](working-with-ip-addresses.md#public-ip-addresses)。
+ （仅限启动实例向导）**自动分配 IPv6 IP**：启用或禁用自动分配 IPv6 地址。有关更多信息，请参阅 [IPv6 地址](using-instance-addressing.md#ipv6-addressing)。
+ **防火墙（安全组）**：选择现有安全组或创建一个新安全组。确保您的安全组有允许流量进出实例的规则。所有其他的流量将被忽略。

  如果您创建一个新安全组，我们会自动创建一条入站规则，允许您通过 SSH（Linux 实例）或 RDP（Windows 实例）从所有 IP 地址连接到您的实例。您可以根据需要删除或者修改此规则。您可以根据需要添加规则。有关更多信息，请参阅 [配置安全组规则](changing-security-group.md#add-remove-security-group-rules)。
**警告**  
如果您只是短暂地启动测试实例并将很快停止或终止该实例，那么允许所有 IP 地址通过 SSH 或 RDP 访问实例的规则是可以接受的，但这些规则对生产环境来说是不安全的。您应该仅授权特定 IP 地址范围访问您的实例。

  此安全组将添加到主网络接口和所有辅助网络接口。您可以为网络接口选择其他安全组，但不能删除在此处选择的安全组。
+ **高级网络配置**：您可以根据需要配置主网络接口。要添加辅助网络接口，请选择**添加网络接口**。您可以添加的网络接口数量取决于所选实例的类型。请注意，此部分仅在选择子网时可用。
  + **设备索引**：设备的索引。主网络接口必须分配给索引 0。
  + **网络接口**：网络的接口。选择**新接口**让 Amazon EC2 创建新的接口，或选择现有的可用网络接口。如果您选择现有网络接口作为主网络接口，则无法为非默认子网启用**自动分配公有 IP**。
  + **描述**：新网络接口的描述。
  + **Subnet**（子网）：要在其中创建新网络接口的子网。实例在与主网络接口相同的子网中启动。

    您必须从与主网络接口子网相同的可用区选择辅助网络接口的子网。如果选择其他 VPC 的子网，该网络接口旁将会显示**多 VPC** 标签。这使您能够在具有不同网络和安全配置的 VPC 之间创建多宿主实例。

    要在仅使用 IPv6 的子网中启动 EC2 实例，您必须使用[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。启动仅 IPv6 实例时，DHCPv6 可能不会立即为该实例提供 IPv6 DNS 名称服务器。在此初始延迟期间，实例可能无法解析公有域。您可以更改配置文件并重新映像 AMI，以便该文件在启动时立即具有 IPv6 DNS 名称服务器地址。
  + **安全组**：要与该网络接口关联的安全组。您必须从与网络接口子网相同的 VPC 中选择安全组。
  + （仅限启动模板）**自动分配公有 IP**：指定您的实例是否接收公有 IPv4 地址。默认情况下，默认子网中的实例会收到公有 IPv4 地址，而非默认子网中的实例不会收到。可以选择 **Enable (启用)** 或 **Disable (禁用)** 以覆盖子网的默认设置。有关更多信息，请参阅 [公有 IPv4 地址](using-instance-addressing.md#concepts-public-addresses)。
  + **Primary IP (主要 IP)**：您的子网范围内的一个私有 IPv4 地址。保留空白会让 Amazon EC2 为您选择一个私有 IPv4 地址。
  + **辅助 IP**：子网范围内的其他私有 IPv4 地址。选择**手动分配**，然后输入 IPv4 地址。选择**添加 IP** 添加另一个 IPv4 地址。或者，选择**自动分配**并输入一个值，来指示 Amazon EC2 为您选择的 IPv4 地址数量。
  + （仅限 IPv6）**IPv6 IP**：子网范围内的 IPv6 地址。选择**手动分配**，然后输入 IPv6 地址。选择**添加 IP** 添加另一个 IPv6 地址。或者，选择**自动分配**并输入一个值，来指示 Amazon EC2 为您选择的 IPv6 地址数量。
  + **IPv4 前缀**：网络接口的 IPv4 前缀。选择**手动分配**，然后输入 IPv4 前缀。或者，选择**自动分配**并输入一个值，来指示 Amazon EC2 为您选择的 IPv4 前缀数量。
  + **IPv6 前缀**：网络接口的 IPv6 前缀。选择**手动分配**，然后输入 IPv6 前缀。或者，选择**自动分配**并输入一个值，来指示 Amazon EC2 为您选择的 IPv6 前缀数量。
  + （双堆栈和仅 IPv6）**分配主 IPv6 IP**：如果您选择双堆栈或仅 IPv6 子网，则分配主 IPv6 地址。这有助于防止到实例或网络接口的流量中断。如果您希望 IPv6 地址不变，则启用此选项。以后将无法移除主 IPv6 地址。当您将 IPv6 GUA 地址启用为主 IPv6 时，第一个 IPv6 GUA 将成为主 IPv6 地址，直到实例终止或网络接口断开为止。如果您有多个 IPv6 地址与网络接口关联，并且可让 Amazon EC2 分配主 IPv6 地址，则与该网络接口关联的第一个 IPv6 GUA 地址将成为主 IPv6 地址。
  + **终止时删除**：指示在删除实例时是否删除网络接口。
  + **接口类型**：网络接口类型：
    + **ENA**：一种高性能网络接口，旨在满足高吞吐量和每秒数据包速率的 TCP/IP 协议处理需求，同时尽可能降低 CPU 使用率。这是默认值。有关更多信息，请参阅[弹性网络适配器](enhanced-networking-ena.md)。
    + **带 ENA 的 EFA**：一种同时支持 ENA 和 EFA 设备的网络接口，用于传统基于 TCP/IP 的传输以及基于 SRD 的传输。有关 EFA 的更多信息，请参阅 [Elastic Fabric Adapter](efa.md)。
    + **仅 EFA**：一种高性能网络接口，旨在满足基于 SRD 的传输对高吞吐量、低延迟节点间通信的处理需求，同时避开操作系统堆栈。仅 EFA 网络接口不支持 IP 地址。有关 EFA 的更多信息，请参阅 [Elastic Fabric Adapter](efa.md)。
  + **Elastic Fabric Adapter**：指示网络接口是否为 Elastic Fabric Adapter。有关更多信息，请参阅 [适用于 Amazon EC2 上 AI/ML 和 HPC 工作负载的 Elastic Fabric Adapter](efa.md)。
  + **网卡索引 **：网卡的索引。必须将主网络接口分配给网卡索引 0。有些实例类型支持多个[网卡](using-eni.md#network-cards)。
  + **ENA Express**：ENA Express 由 AWS 可扩展的可靠数据报（SRD）技术提供支持。SRD 技术使用数据包散射机制来分配负载并避免网络拥塞。启用 ENA Express 允许支持的实例在可能的情况下在常规 TCP 流量之上使用 SRD 进行通信。除非您从列表中选择**启用**或**禁用**，否则启动实例向导或启动模板不包括实例的 ENA Express 配置。
  + **ENA Express UDP**：如果您已启用 ENA Express，则可以选择将其用于 UDP 流量。除非您选择**启用**或**禁用**，否则启动实例向导或启动模板不包括实例的 ENA Express 配置。

## 配置存储
<a name="liw-storage"></a>

您选择的 AMI 包含一个或多个存储卷，包括根卷。您可以指定要附加到实例的其它卷。

（仅限启动实例向导）您可以使用**简单**或**高级**视图。借助 **Simple**（简单）视图，您可以指定卷的大小和类型。若要指定所有卷参数，请选择位于卡片的右上角的 **Advanced**（高级）视图。

在 **Advanced**（高级）视图中，您可以按如下方式配置每个卷：
+ **Storage type**（存储类型）：选择要与实例关联的 Amazon EBS 或实例存储卷。列表中可用的卷类型取决于您选择的实例类型。有关更多信息，请参阅 [适用于 EC2 实例的实例存储临时块存储](InstanceStorage.md) 和 [Amazon EBS 卷](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html)。
+ **Device name**（设备名称）：从卷的可用设备名称列表中进行选择。
+ **Snapshot**（快照）：选择要从其中还原卷的快照。您可以通过在 **Snapshot**（快照）字段中输入文本来搜索可用的共享快照和公有快照。
+ **Size (GiB)**（大小 (GiB)）：对于 EBS 卷，您可以指定存储大小。
+ **卷类型**：对于 EBS 卷，请选择卷类型。有关更多信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 卷类型](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html)。
+ **IOPS**：如果选择了 io1、io2 或 gp3 卷类型，则可以输入卷支持的每秒 I/O 操作数 (IOPS)。io1、io2 和 gp3 卷必需。gp2、st1、sc1 或标准卷不支持。如果您省略了启动模板中的此参数，必须在从启动模板启动实例时指定其值。
+ **Delete on termination**（终止时删除）：对于 Amazon EBS 卷，选择 **Yes**（是）以在终止实例时删除此卷或选择 **No**（否）以保留此卷。有关更多信息，请参阅 [实例终止时保留数据](preserving-volumes-on-termination.md)。
+ **Encrypted**（加密）：如果实例类型支持 EBS 加密，则可以选择 **Yes**（是）以为此卷启用加密。如果默认情况下在此区域中启用了加密，则会为您启用加密。有关更多信息，请参阅《Amazon EBS 用户指南》**中的 [Amazon EBS 加密](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html)。
+ **KMS key**（KMS 密钥）：如果您将 **Encrypted**（加密）选择为 **Yes**（是），则您必须选择一个客户托管式密钥来加密卷。如果默认情况下在此区域中启用了加密，则将为您选择默认的客户托管密钥。您可以选择不同的密钥或指定由您创建的任何客户托管密钥的 ARN。
+ **吞吐量**：如果选择 `gp3` 卷类型，则可以输入该卷支持的吞吐量（以 MiB/s 为单位）。
+ **卷初始化速率**：选择某个快照后，您可以选择指定卷初始化速率（以 MiB/s 为单位），亦即将快照块从 Amazon S3 下载到卷的速率。有关更多信息，请参阅 [Use an Amazon EBS Provisioned Rate for Volume Initialization](https://docs.aws.amazon.com/ebs/latest/userguide/initalize-volume.html#volume-initialization-rate)。要使用默认初始化速率或快速快照还原功能（如果已为所选快照启用此功能），请不要指定速率。
+ **File systems**（文件系统）：将 Amazon EFS 或 Amazon FSx 文件系统挂载到实例。有关挂载 Amazon EFS 文件系统的更多信息，请参阅 [将 Amazon EFS 与 Amazon EC2 Linux 实例结合使用](AmazonEFS.md)。有关挂载 Amazon FSx 文件系统的更多信息，请参阅 [将 Amazon FSx 与 Amazon EC2 实例结合使用](storage_fsx.md)

## 高级详细信息
<a name="liw-advanced-details"></a>

对于**高级详细信息**，请展开该部分以查看字段并为实例指定任何其他参数。
+ （仅限启动实例向导）**域加入目录**：选择您的实例在启动后加入到的 Directory Service 目录（域）。如果选择一个域，则必须选择一个具有所需权限的 IAM 角色。有关域加入域更多信息，请参阅[将 Amazon EC2 Linux 实例无缝加入 AWS 托管 Microsoft AD 目录](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/seamlessly_join_linux_instance.html)（Linux 实例）和[将 Amazon EC2 Windows 实例无缝加入 AWS 托管 Microsoft AD 目录](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/launching_instance.html)（Windows 实例）。
+ **IAM 实例配置文件**：选择要与实例关联的 IAM 实例配置文件。这是 IAM 角色的容器。有关更多信息，请参阅 [适用于 Amazon EC2 的 IAM 角色](iam-roles-for-amazon-ec2.md)。
+ **Hostname type**（主机名类型）：选择实例的来宾操作系统主机名将包括资源名称还是 IP 名称。有关更多信息，请参阅 [EC2 实例主机名和域](ec2-instance-naming.md)。
+ **DNS Hostname**（DNS 主机名）：确定对资源名称或 IP 名称的 DNS 查询（根据您对 **Hostname type**（主机名类型）的选择）是否将以 IPv4 地址（A 记录）、IPv6 地址（AAAA 记录）响应，还是同时以两者响应。有关更多信息，请参阅 [EC2 实例主机名和域](ec2-instance-naming.md)。
+ **实例自动恢复**：启用后，如果系统状态检查失败，则会恢复您的实例。默认情况下，对于支持的实例类型，此设置在启动时启用。有关更多信息，请参阅 [在 Amazon EC2 实例上配置简化的自动恢复](instance-configuration-recovery.md)。
+ **Shutdown behavior (关闭行为)**：选择关闭时实例应该停止还是终止。有关更多信息，请参阅 [更改实例启动的关闭行为](Using_ChangingInstanceInitiatedShutdownBehavior.md)。
+ **Stop - Hibernate behavior**（停止 – 休眠行为）：要启用休眠，请选择 **Enable**（启用）。只有当实例满足休眠先决条件时，此字段才可用。有关更多信息，请参阅 [将您的 Amazon EC2 实例休眠](Hibernate.md)。
+ **Termination protection**（终止保护）：要防止意外终止，请选择 **Enable**（启用）。有关更多信息，请参阅 [更改实例终止保护](Using_ChangingDisableAPITermination.md)。
+ **Stop protection**（停止保护）：为防止意外停止，请选择 **Enable**（启用）。有关更多信息，请参阅 [启用停止保护](ec2-stop-protection.md)。
+ **Detailed CloudWatch monitoring**（详细的 CloudWatch 监控）：选择 **Enable**（启用）将使用 Amazon CloudWatch 开启对您的实例的详细监控。将收取额外费用。有关更多信息，请参阅 [使用 CloudWatch 监控您的实例](using-cloudwatch.md)。
+ **Credit specification**（积分规范）：选择 **Unlimited**（无限）以允许应用程序只要有需要即突增到基准以上。此字段仅适用于 **T** 实例。可能收取额外费用。有关更多信息，请参阅 [可突增性能实例](burstable-performance-instances.md)。
+ **置放群组**：指定要在其中启动实例的置放群组。您可以选择现有置放群组或创建新组。并非所有实例类型都支持在放置群组中启动实例。有关更多信息，请参阅 [Amazon EC2 实例的置放群组](placement-groups.md)。
+ **EBS-optimized instance**（EBS 优化的实例）：Amazon EBS 优化的实例使用优化的配置堆栈，并为 Amazon EBS I/O 提供额外的专用容量。如果实例类型支持此功能，请选择 **Enable**（启用）来启用该功能。将收取额外费用。有关更多信息，请参阅 [Amazon EBS 优化的实例类型](ebs-optimized.md)。
+ **实例带宽配置**：您可以增加网络带宽或 EBS 带宽。仅适用于支持的实例类型。有关更多信息，请参阅 [EC2 实例带宽权重配置](configure-bandwidth-weighting.md)。
+ **购买选项**：选择**竞价型实例**即可按照竞价型价格请求竞价型实例，上限为按需价格，选择**自定义竞价型实例选项**即可更改默认的竞价型实例设置。您可以设置最高价（不建议），并更改请求类型、请求时长和中断行为。如果您未请求竞价型实例，则默认情况下 Amazon EC2 会启动按需型实例。有关更多信息，请参阅 [管理您的竞价型实例](using-spot-instances-request.md)。
+ **Capacity Reservation**（容量预留）：指定是在任何开放容量预留 [**Open**（开放）]、特定容量预留 [**Target by ID**（按 ID 定位）]，还是容量预留组 [**Target by group**（按组定位）] 中启动实例。要指定不使用容量预留，请选择 **None**（无）。有关更多信息，请参阅 [在现有 容量预留 中启动实例](capacity-reservations-launch.md)。
+ **Tenancy (租期)**：选择是在共享硬件（**Shared (共享)**）、隔离的专用硬件（**Dedicated (专用)**），还是在 专用主机（**Dedicated host (专用主机)**）上运行您的实例。如果您选择在专用主机上启动实例，则可以指定是否在主机资源组中启动实例，也可以定位特定专用主机。可能收取额外费用。有关更多信息，请参阅 [Amazon EC2 专用实例](dedicated-instance.md) 和 [Amazon EC2 专属主机](dedicated-hosts-overview.md)。
+ **RAM disk ID**（RAM 磁盘 ID）：[仅对半虚拟 (PV) AMI 有效] 为实例选择一个 RAM 磁盘。如果您选择了一个内核，则您可能需要选择带有可支持该内核的驱动程序的某个特定 RAM 磁盘。
+ **Kernel ID**（内核 ID）：[仅对半虚拟 (PV) AMI 有效] 为实例选择一个内核。
+ **Nitro Enclave**：允许您从 Amazon EC2 实例创建隔离的执行环境，称为 Enclave。选择 **Enable**（启用）以启用 AWS Nitro Enclaves 的实例。有关更多信息，请参阅 *AWS Nitro Enclaves 用户指南*中的[什么是 AWS Nitro Enclaves？](https://docs.aws.amazon.com/enclaves/latest/user/nitro-enclave.html)
+ **许可证配置**：您可以根据指定的许可证配置启动实例，以跟踪您的许可证使用情况。有关更多信息，请参阅《**AWS License Manager 用户指南》中的[创建许可证配置](https://docs.aws.amazon.com/license-manager/latest/userguide/create-license-configuration.html)。
+ **指定 CPU 选项**：在启动实例向导中，仅当所选实例类型支持指定 CPU 选项时，此字段才可见。选择**指定 CPU 选项**可在启动期间指定自定义 vCPU 数。设置 CPU 内核数和每内核线程数。有关更多信息，请参阅 [Amazon EC2 实例适用的 CPU 选项](instance-optimize-cpu.md)。
+ **可访问的元数据**：您可以启用或禁用对实例元数据服务（IMDS）的访问权限。有关更多信息，请参阅 [为新实例配置实例元数据选项](configuring-IMDS-new-instances.md)。
+ **元数据 IPv6 端点**：让实例能够使用 IMDS IPv6 地址 `[fd00:ec2::254]` 来检索实例元数据。此选项仅当您在[支持 IPv6 的子网](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html#subnet-ip-address-range)（双栈或仅 IPv6）中启动[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)时可用。有关检索实例元数据的更多信息，请参阅 [访问 EC2 实例的实例元数据](instancedata-data-retrieval.md)。
+ **元数据版本**：如果您启用对 IMDS 的访问权限，可以选择在请求实例元数据时要求使用实例元数据服务版本 2。有关更多信息，请参阅 [为新实例配置实例元数据选项](configuring-IMDS-new-instances.md)。
+ **元数据响应跃点限制**：如果您启用 IMDS，可以为元数据标记设置允许的网络跃点数。有关更多信息，请参阅 [为新实例配置实例元数据选项](configuring-IMDS-new-instances.md)。
+ **Allow tags in metadata**（允许元数据中的标签）：如果选择**Enable**（启用），该实例将允许从其元数据访问其所有标签。如果未指定值，则默认情况下，将不允许对实例元数据中的标签的访问。有关更多信息，请参阅 [启用对实例元数据中标签的访问权限](work-with-tags-in-IMDS.md#allow-access-to-tags-in-IMDS)。
+ **User data**：您可以指定用户数据在启动时配置实例或运行配置脚本。有关 Linux 实例用户数据的更多信息，请参阅 [在启动包含用户数据输入的 EC2 实例时运行命令](user-data.md)。有关 Windows 实例用户数据的更多信息，请参阅 [Amazon EC2 如何处理 Windows 实例的用户数据](user-data.md#ec2-windows-user-data)。

## 摘要
<a name="liw-summary"></a>

使用 **Summary**（摘要）面板来指定要启动的实例数、查看实例配置和启动实例。
+ **Number of instances (实例的数量)**：输入要启动的实例的数量。所有实例都将以相同的配置启动。
**提示**  
为确保更快地启动实例，请将大量请求分成较小的批次。例如，创建五个独立的请求批次，每个批次包含 100 个实例启动请求，而不要创建一个包含 500 个实例的启动请求。
+ （可选）如果您指定的实例不止一个，为了帮助确保保持正确数量的实例来处理应用程序的需求，您可以选择 **consider EC2 Auto Scaling**（考虑 EC2 Auto Scaling）以创建启动模板和 Auto Scaling 组。Auto Scaling 将根据您的规格来扩展组中的实例数。有关更多信息，请参阅 [Amazon EC2 Auto Scaling 用户指南](https://docs.aws.amazon.com/autoscaling/ec2/userguide/)。
**注意**  
如果 Amazon EC2 Auto Scaling 将某个 Auto Scaling 组中的实例标记为运行状况不佳，则会自动安排该实例进行替换，此时将终止此实例而启动另一个实例，并且您将丢失原始实例上的数据。如果您停止或重新引导实例，或者其他事件将实例标记为运行状况不佳，则此实例将被标记为运行状况不佳。有关更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南》**中的[自动扩缩组中实例的运行状况检查](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html)。
+ 查看实例的详细信息并进行必要的更改。您可以在 **Summary**（摘要）面板选择某部分的链接以直接导航到该部分。
+ 当您准备好启动您的实例时，请选择 **Launch instance**（启动实例）。
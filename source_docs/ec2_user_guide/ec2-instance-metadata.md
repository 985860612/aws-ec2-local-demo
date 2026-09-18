

# 使用实例元数据管理 EC2 实例
<a name="ec2-instance-metadata"></a>

*实例元数据* 是有关您的实例的数据，可以用来配置或管理正在运行的实例。实例元数据包括以下内容：

**实例元数据属性**  
实例元数据属性分为[几类](#instancedata-data-categories)，例如，主机名、事件和安全组。

**动态数据**  
动态数据是实例启动时生成的元数据，如实例身份文件。有关更多信息，请参阅 [动态数据类别](#dynamic-data-categories)。

**用户数据**  
您也可以使用实例元数据访问您启动实例时指定的*用户数据*。例如，您可以指定参数以配置实例，或者包含简单的脚本。您还可以构建通用 AMI，并使用用户数据修改启动时提供的配置文件。例如，如果您为各种小型企业运行 Web 服务器，则这些企业可以全部使用相同的通用 AMI，并在启动时从您在用户数据中指定的 Amazon S3 存储桶中检索其内容。要随时添加新客户，请为客户创建一个存储桶，添加其内容，并使用在用户数据中为您的代码提供的唯一存储桶名称启动 AMI。如果使用同一个 `RunInstances` 调用启动多个实例，则用户数据可供该预留中的所有实例使用。属于同一保留的每个实例都具有唯一的 `ami-launch-index` 编号，这允许您编写代码控制实例的行为。例如，第一台主机可能会选择将自己作为集群中的原始节点。有关详细的 AMI 启动示例，请参阅。[识别在单个请求中启动的每个实例](AMI-launch-index-examples.md)

**重要**  
虽然您只能从实例本身中访问实例元数据和用户数据，但并未使用身份验证或加密方法对数据进行保护。任何可以直接访问实例的人以及可能在实例上运行的任何软件都可以查看其元数据。因此，您不应将敏感数据（例如密码或长期保存的加密密钥）存储为用户数据。

**Topics**
+ [实例元数据类别](#instancedata-data-categories)
+ [动态数据类别](#dynamic-data-categories)
+ [访问 EC2 实例的实例元数据](instancedata-data-retrieval.md)
+ [配置实例元数据服务选项](configuring-instance-metadata-options.md)
+ [在启动包含用户数据输入的 EC2 实例时运行命令](user-data.md)
+ [识别在单个请求中启动的每个实例](AMI-launch-index-examples.md)

## 实例元数据类别
<a name="instancedata-data-categories"></a>

实例元数据属性分为几类。要检索实例元数据属性，请在请求中指定类别，然后响应中会返回元数据。

有新类别发布时，系统会使用新版本号创建新的实例元数据构建。在下表中，**Version when category was released**（类别发布时的版本）列指定实例元数据类别发布时的构建版本。为避免每次 Amazon EC2 发布新的实例元数据构建时都必须更新您的代码，请在元数据请求中使用 `latest`，而不是版本号。有关更多信息，请参阅 [获取实例元数据的可用版本](configuring-instance-metadata-service.md#instance-metadata-ex-1)。

当 Amazon EC2 发布新的实例元数据类别时，新类别的实例元数据可能不适用于现有实例。对于[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)，只能检索启动时可用类别的实例元数据。对于具有 Xen 虚拟机管理程序的实例，可以[停止然后启动](Stop_Start.md)实例以更新可用于实例的类别。

下表列举了实例元数据的类别。一些类别名称包括实例独有的数据的占位符。例如，{{mac}} 表示网络接口的 MAC 地址。在检索实例元数据时，您必须使用实际值替换占位符。


| 类别 | 说明 | 类别发布时的版本 | 
| --- | --- | --- | 
| ami-id  | 用于启动实例的 AMI ID。 | 1.0 | 
| ami-launch-index  | 如果使用同一个 RunInstances 调用启动多个实例，此值将指明各个实例的启动顺序。第一个启动的实例的值是 0。如果使用自动扩缩或 EC2 实例集启动实例，此值将始终为 0。 | 1.0 | 
| ami-manifest-path  | 指向 Amazon S3 中的 AMI 清单文件的路径。如果您使用 Amazon EBS-backed AMI 来启动实例，则返回的结果为 unknown。 | 1.0 | 
| ancestor-ami-ids  | 为创建此 AMI 而重新绑定的任何实例的 AMI ID。仅当 AMI 清单文件包含一个 ancestor-amis 密钥时，此值才存在。 | 2007-10-10 | 
| autoscaling/target-lifecycle-state | 显示 Auto Scaling 实例正在转换到的目标 Auto Scaling 生命周期状态的值。当实例在 2022 年 3 月 10 日之后转换到目标生命周期状态之一时显示。可能的值：`Detached` \|`InService` \|`Standby` \|`Terminated` \|`Warmed:Hibernated` \|`Warmed:Running` \|`Warmed:Stopped` \|`Warmed:Terminated` 。有关更多信息，请参阅《*Amazon EC2 Auto Scaling 用户指南*》中的[通过实例元数据检索目标生命周期状态](https://docs.aws.amazon.com/autoscaling/ec2/userguide/retrieving-target-lifecycle-state-through-imds.html)。 | 2021-07-15 | 
| block-device-mapping/ami | 包含根/启动文件系统的虚拟设备。 | 2007-12-15 | 
| block-device-mapping/ebs否  | 与任何 Amazon EBS 卷关联的虚拟设备。仅当 Amazon EBS 卷在启动时存在或者在上一次启动该实例时存在时，这些卷才在元数据中可用。N 表示 Amazon EBS 卷的索引（例如 ebs1 或 ebs2）。 | 2007-12-15 | 
| block-device-mapping/ephemeral否  | 任何非 NVMe 实例存储卷的虚拟设备。N 表示每个卷的索引。块储存设备映射中的实例存储卷数可能与实例的实际实例存储卷数不匹配。实例类型将决定对实例可用的实例存储卷的数量。如果块储存设备映射中的实例存储卷数超过了对实例可用的实例存储卷数，则其他实例存储卷将被忽略。 | 2007-12-15 | 
| block-device-mapping/root  | 与根设备关联的虚拟设备或分区或虚拟设备上的分区，其中根（/ 或 C:）文件系统与给定实例相关联。 | 2007-12-15 | 
| block-device-mapping/swap  | 与 swap 关联的虚拟设备。并不总是存在。 | 2007-12-15 | 
| events/maintenance/history | 如果实例存在已完成或已取消的维护事件，则包含一个 JSON 字符串，其中包含有关事件的信息。 | 2018-08-17 | 
| events/maintenance/scheduled | 如果实例存在活动的维护事件，则包含一个 JSON 字符串，其中包含有关事件的信息。有关更多信息，请参阅[查看会影响 Amazon EC2 实例的计划事件](viewing_scheduled_events.md)。 | 2018-08-17 | 
| events/recommendations/rebalance | 为实例发出 EC2 实例再平衡建议通知的大致时间 (UTC)。下面是此类别的元数据示例：{"noticeTime": "2020-11-05T08:22:00Z"}。此类别仅在发出通知后可用。有关更多信息，请参阅 [EC2 实例再平衡建议](rebalance-recommendations.md)。 | 2020-10-27 | 
| hostname | 如果 EC2 实例使用的是基于 IP 的命名 (IPBN)，则此为实例的私有 IPv4 DNS 主机名。如果 EC2 实例使用的是基于资源的命名 (RBN)，则此为 RBN。在存在多个网络接口的情况下，其指的是 eth0 设备 (设备号为 0 的设备)。有关 IPBN 和 RBN 的更多信息，请参阅 [EC2 实例主机名和域](ec2-instance-naming.md)。 | 1.0 | 
|  iam/info  | 如果存在与实例关联的 IAM 角色，则包含有关实例配置文件上次更新时间的信息 (包括实例的 LastUpdated 日期、InstanceProfileArn 和 InstanceProfileId)。如果没有，则不显示。 | 2012-01-12 | 
|  iam/security-credentials/{{role-name}}  | 如果存在与实例关联的 IAM 角色，则 {{role-name}} 为角色的名称，并且 {{role-name}} 包含与角色关联的临时安全凭证 (有关更多信息，请参阅 [从实例元数据中检索安全凭证](instance-metadata-security-credentials.md))。如果没有，则不显示。 | 2012-01-12 | 
| identity-credentials/ec2/info | identity-credentials/ec2/security-credentials/ec2-instance 中凭证的相关信息。 | 2018-05-23 | 
| identity-credentials/ec2/security-credentials/ec2-instance | 允许实例软件向 AWS 确认自身身份，以支持 EC2 Instance Connect 及 AWS Systems Manager 默认主机管理配置等功能的实例身份角色凭证。这些凭证并未附加策略，因此除了将实例标识为 AWS 功能外，它们没有其他AWS API 权限。有关更多信息，请参阅 [Amazon EC2 实例的实例身份角色](iam-roles-for-amazon-ec2.md#ec2-instance-identity-roles)。 | 2018-05-23 | 
| instance-action | 通知实例在准备打包时重新启动。有效值：none \| shutdown \| bundle-pending。 | 2008-09-01 | 
| instance-id | 此实例的 ID。 | 1.0 | 
| instance-life-cycle | 此实例的采购选项。有关更多信息，请参阅[Amazon EC2 账单和购买选项](instance-purchasing-options.md)。 | 2019-10-01 | 
| instance-type  | 实例的类型。有关更多信息，请参阅[Amazon EC2 实例类型](instance-types.md)。 | 2007-08-29 | 
| ipv6  | 实例的 IPv6 地址。在存在多个网络接口的情况下，其指的是 eth0 设备（设备号为 0 的设备）的网络接口和第一个分配的 IPv6 地址。若网络接口 [0] 上不存在 IPv6 地址，则不会设置此项目且会导致 HTTP 404 响应。 | 2021-01-03 | 
|  kernel-id  | 此实例启动的内核的 ID，如果适用的话。 | 2008-02-01 | 
|  local-hostname  | 在存在多个网络接口的情况下，其指的是 eth0 设备 (设备号为 0 的设备)。如果 EC2 实例使用的是基于 IP 的命名 (IPBN)，则此为实例的私有 IPv4 DNS 主机名。如果 EC2 实例使用的是基于资源的命名 (RBN)，则此为 RBN。有关 IPBN、RBN 和 EC2 实例命名的更多信息，请参阅 [EC2 实例主机名和域](ec2-instance-naming.md)。 | 2007-01-19 | 
|  local-ipv4  | 实例的私有 IPv4 地址。在存在多个网络接口的情况下，其指的是 eth0 设备 (设备号为 0 的设备)。若此为仅 IPv6 的实例，则不会设置此项目且会导致 HTTP 404 响应。 | 1.0 | 
|  mac  | 实例的媒体访问控制 (MAC) 地址。在存在多个网络接口的情况下，其指的是 eth0 设备 (设备号为 0 的设备)。 | 2011 年 1 月 1 日 | 
| metrics/vhostmd | 不再可用。 | 2011-05-01 | 
|  network/interfaces/macs/{{mac}}/device-number  | 与该接口关联的唯一设备号。设备号与设备名称对应；例如，device-number 为 2 对应于 eth2 设备。此类别对应的是 AWS CLI 的 Amazon EC2 API 和 EC2 命令使用的 DeviceIndex 和 device-index 字段。 | 2011 年 1 月 1 日 | 
|  network/interfaces/macs/{{mac}}/interface-id  | 网络接口的 ID。 | 2011 年 1 月 1 日 | 
|  network/interfaces/macs/{{mac}}/ipv4-associations/{{public-ip}}  | 与每个公用 IP 地址相关联并被分配到该接口的私有 IPv4 地址。 | 2011 年 1 月 1 日 | 
| network/interfaces/macs/{{mac}}/ipv6s | 分配给接口的 IPv6 地址。 | 2016-06-30 | 
| network/interfaces/macs/{{mac}}/ipv6-prefix | 分配给网络接口的 IPv6 前缀。 |  | 
|  network/interfaces/macs/{{mac}}/local-hostname  | 网络接口的私有 IPv4 DNS 主机名。对于完全没有 IP 地址的接口（例如仅 EFA 接口），不会设置此值。若此为仅 IPv6 的接口，则此为基于资源的名称。有关 IPBN 和 RBN 的更多信息，请参阅 [EC2 实例主机名和域](ec2-instance-naming.md)。 | 2007-01-19 | 
|  network/interfaces/macs/{{mac}}/local-ipv4s  | 与接口关联的私有 IPv4 地址。若此为仅 IPv6 的网络接口，则不会设置此项目且会导致 HTTP 404 响应。 | 2011 年 1 月 1 日 | 
|  network/interfaces/macs/{{mac}}/mac  | 该实例的 MAC 地址。 | 2011 年 1 月 1 日 | 
|  network/interfaces/macs/{{mac}}/network-card  | 网卡的索引。有些实例类型支持多个网卡。 | 2020-11-01 | 
| network/interfaces/macs/{{mac}}/owner-id  | 网络接口拥有者的 ID。在多个接口的环境中，接口可由第三方连接，如 Elastic Load Balancing。接口拥有者需为接口上的流量付费。 | 2011 年 1 月 1 日 | 
|  network/interfaces/macs/{{mac}}/public-hostname  | 接口的公有 DNS (IPv4)。仅当 enableDnsHostnames 属性设置为 true 时，才返回此类别。有关更多信息，请参阅《Amazon VPC 用户指南》中的 [VPC 的 DNS 属性](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html)。如果实例仅具有公有 IPv6 地址而没有公有 IPv4 地址，则不会设置此项目并导致 HTTP 404 响应。 |  2011 年 1 月 1 日 | 
|  network/interfaces/macs/{{mac}}/public-ipv4s  | 与接口关联的公有 IP 地址或弹性 IP 地址。一个实例上可能有多个 IPv4 地址。 | 2011 年 1 月 1 日 | 
| network/interfaces/macs/{{mac}}/security-groups  | 网络接口所属的安全组。 | 2011 年 1 月 1 日 | 
|  network/interfaces/macs/{{mac}}/security-group-ids  | 网络接口所属的安全组的 ID。 | 2011 年 1 月 1 日 | 
|  network/interfaces/macs/{{mac}}/subnet-id  | 接口所驻留的子网的 ID。 | 2011 年 1 月 1 日 | 
|  network/interfaces/macs/{{mac}}/subnet-ipv4-cidr-block  | 接口所在子网的 IPv4 CIDR 块。 | 2011 年 1 月 1 日 | 
| network/interfaces/macs/{{mac}}/subnet-ipv6-cidr-blocks  | 接口所在子网的 IPv6 CIDR 块。 | 2016-06-30  | 
|  network/interfaces/macs/{{mac}}/vpc-id  | 接口所驻留的 VPC 的 ID。 | 2011 年 1 月 1 日 | 
| network/interfaces/macs/{{mac}}/vpc-ipv4-cidr-block | VPC 的主 IPv4 CIDR 块。 | 2011 年 1 月 1 日 | 
| network/interfaces/macs/{{mac}}/vpc-ipv4-cidr-blocks | VPC 的 IPv4 CIDR 块。 | 2016-06-30  | 
| network/interfaces/macs/{{mac}}/vpc-ipv6-cidr-blocks | 接口所在 VPC 的 IPv6 CIDR 块。 | 2016-06-30  | 
|  placement/availability-zone | 实例启动的可用区。 | 2008-02-01 | 
|  placement/availability-zone-id | 在其中启动实例的静态可用区 ID。可用区 ID 在账户之间保持一致。但是，它可能与可用区不同，后者可能因账户而异。 | 2019-10-01 | 
|  placement/group-name  | 在其中启动实例的置放群组的名称。 | 2020-08-24 | 
|  placement/host-id  | 启动实例的主机的 ID。仅适用于专用主机。 | 2020-08-24 | 
|  placement/partition-number  | 在其中启动实例的分区编号。 | 2020-08-24 | 
|  placement/region  | 在其中启动实例的 AWS 区域。 | 2020-08-24 | 
|  product-codes  | AWS Marketplace与实例相关联的 产品代码（如果有）。 | 2007-03-01 | 
|  public-hostname  | 实例的公有 DNS (IPv4)。仅当 enableDnsHostnames 属性设置为 true 时，才返回此类别。有关更多信息，请参阅《Amazon VPC 用户指南》中的 [VPC 的 DNS 属性](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html)。如果实例仅具有公有 IPv6 地址而没有公有 IPv4 地址，则不会设置此项目并导致 HTTP 404 响应。 | 2007-01-19 | 
|  public-ipv4  | 公有 IPv4 地址。如果弹性 IP 地址与实例相关联，返回的值是弹性 IP 地址。 | 2007-01-19 | 
|  public-keys/0/openssh-key  | 公有密钥。仅在实例启动时提供了公有密钥的情况下可用。 | 1.0 | 
|  ramdisk-id  | 启动时指定的 RAM 磁盘 的 ID，如果适用的话。 | 2007-10-10 | 
|  reservation-id  | 预留的 ID。 | 1.0 | 
|  security-groups  | 应用到实例的安全组的名称。<br />在启动后，您可以更改实例的安全组。这些更改将体现在此处和 network/interfaces/macs/*{{mac}}*/security-groups 中。 | 1.0 | 
|  services/domain  | 区域的 AWS 资源所在的域。 | 2014-02-25 | 
|  services/partition  | 资源所处的分区。对于标准 AWS 区域，分区是 `aws`。如果资源位于其他分区，则分区是 `aws-{{partitionname}}`。例如，中国（北京）区域中的资源的分区为 `aws-cn`。 | 2015-10-20 | 
|  spot/instance-action  | 操作（休眠、停止或终止）和操作发生的大致时间（用 UTC 表示）。仅在已将竞价型实例标记为休眠、停止或终止时才提供此项目。有关更多信息，请参阅[instance-action](spot-instance-termination-notices.md#instance-action-metadata)。 | 2016-11-15 | 
|  spot/termination-time  | 竞价型实例 操作系统将收到关闭信号的大致时间 (UTC)。仅当竞价型实例已由 Amazon EC2 标记为终止时，此项目才会出现并包含时间值（例如，2015-01-05T18:02:00Z）。如果您自己终止了竞价型实例，那么终止时间项目不会设置为时间。有关更多信息，请参阅[termination-time](spot-instance-termination-notices.md#termination-time-metadata)。 | 2014-11-05 | 
| system | 实例的底层虚拟化类型（虚拟机监控程序）。 | 2022-09-24 | 
| tags/instance | 与实例关联的实例标签。只有明确允许访问实例元数据中的标签时才可用。有关更多信息，请参阅 [启用对实例元数据中标签的访问权限](work-with-tags-in-IMDS.md#allow-access-to-tags-in-IMDS)。 | 2021-03-23 | 

## 动态数据类别
<a name="dynamic-data-categories"></a>

下表列举了动态数据的类别。


| 类别 | 说明 | 类别发布时的版本 | 
| --- | --- | --- | 
| fws/instance-monitoring  | 显示客户是否在 CloudWatch 中启用了详细的一分钟监控的值。有效值：enabled \| disabled | 2009-04-04 | 
| instance-identity/document  | 包含实例属性（如实例 ID、私有 IP 地址）的 JSON。请参阅 [Amazon EC2 实例的实例身份文档](instance-identity-documents.md)。 | 2009-04-04 | 
| instance-identity/pkcs7  | 用于验证签名的文档的真实性和内容。请参阅 [Amazon EC2 实例的实例身份文档](instance-identity-documents.md)。 | 2009-04-04 | 
| instance-identity/signature  | 可被其他各方用于验证来源和真实性的数据。请参阅 [Amazon EC2 实例的实例身份文档](instance-identity-documents.md)。 | 2009-04-04 | 
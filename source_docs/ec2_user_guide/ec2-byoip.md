

# 自带 IP 地址（BYOIP）到 Amazon EC2
<a name="ec2-byoip"></a>

您可将自己的部分或全部可公开路由的 IPv4 或 IPv6 地址从本地网络引入到 AWS 账户中。您可以继续控制地址范围，并且可以通过 AWS 在互联网上公告地址范围。在将地址范围引入 Amazon EC2 中之后，它会在您的 AWS 账户中显示为地址池。

**注意**  
本文档介绍如何将您自己的 IP 地址范围仅用于 Amazon EC2。要在 AWS Global Accelerator 中使用自己的 IP 地址范围，请参阅《AWS Global Accelerator 开发人员指南》中的 [自带 IP 地址（BYOIP）](https://docs.aws.amazon.com/global-accelerator/latest/dg/using-byoip.html)**。要将您自己的 IP 地址范围与 Amazon VPC IP Address Manager 结合使用，请参阅《Amazon VPC IPAM 用户指南》中的 [教程：自带 IP 地址到 IPAM](https://docs.aws.amazon.com/vpc/latest/ipam/tutorials-byoip-ipam.html)**。

如果将 IP 地址范围带入 AWS，AWS 会验证您是否控制了 IP 地址范围。有两种方法可用于表明您控制了范围：
+ 如果 IP 地址范围是在支持 RDAP 的互联网注册机构（例如 ARIN、RIPE 和 APNIC）注册，您可以通过此页面上的流程，使用 X.509 证书验证对域的控制。证书必须仅在预调配过程中有效。预调配完成后，可以从 RIR 的记录中删除证书。
+ 无论互联网注册机构是否支持 RDAP，您都可以使用 Amazon VPC IPAM，通过 DNS TXT 记录验证对域的控制。该流程记录在《Amazon VPC IPAM 用户指南》**中的[教程：将 IP 地址带入 IPAM](https://docs.aws.amazon.com/vpc/latest/ipam/tutorials-byoip-ipam.html)。

有关更多信息，请参阅 AWS 在线技术研讨会[深入了解自带 IP](https://pages.awscloud.com/Deep-Dive-on-Bring-Your-Own-IP_1024-NET_OD.html)。

**Topics**
+ [BYOIP 定义](#byoip-definitions)
+ [要求和配额](#byoip-requirements)
+ [区域可用性](#byoip-reg-avail)
+ [本地区域可用性](#byoip-zone-avail)
+ [先决条件](prepare-for-byoip.md)
+ [载入您的地址范围](byoip-onboard.md)
+ [使用您的地址范围](byoip-working-with.md)

## BYOIP 定义
<a name="byoip-definitions"></a>
+ **X.509 自签名证书**：最常用于加密和验证网络内数据的证书标准。这是 AWS 用来验证从 RDAP 记录控制 IP 空间的证书。有关 X.509 证书的更多信息，请参阅 [RFC 3280](https://datatracker.ietf.org/doc/html/rfc3280)。
+ **自治系统编号 (ASN)**是一种全局唯一标识符，它定义了一组 IP 前缀，这些前缀由一个或多个维护单一、明确定义的路由策略的网络运营商运行。
+ **区域互联网注册机构（RIR）**是管理世界某个区域内 IP 地址和 ASN 的分配和注册的组织。
+ **注册数据访问协议（RDAP）**：用于查询 RIR 中当前注册数据的只读协议。查询的 RIR 数据库中的条目称为“RDAP 记录”。某些记录类型需要客户通过 RIR 提供的机制进行更新。这些记录将由 AWS 查询以验证对 RIR 中地址空间的控制。
+ **路由来源授权 (ROA)**：由 RIR 创建的对象，供客户对特定自治系统中的 IP 公告进行身份验证。如需相关概览，请参阅 ARIN 网站上的[路由来源授权 (ROA)](https://www.arin.net/resources/manage/rpki/roa_request/)。
+ **本地互联网注册机构（LIR）**是网络服务提供商等企业，从 RIR 为其客户分配 IP 地址数据块。

## 要求和配额
<a name="byoip-requirements"></a>
+ 地址范围必须在您所在的区域互联网注册机构（RIR）注册。有关地理区域的任何策略，请咨询您的 RIR。BYOIP 目前支持在美国互联网号码注册机构（ARIN）、欧洲 IP 资源网络协调中心（RIPE）或亚太网络信息中心（APNIC）注册。它必须由企业或机构实体注册，而不能由个人注册。
+ 您可以引入的最具体 IPv4 地址范围是 /24。
+ 对于公开发布的 CIDR，可以引入的最具体 IPv6 地址范围是 /48；对于[不公开发布](byoip-onboard.md#byoip-provision-non-public)的 CIDR，可以引入的最具体 IPv6 地址范围是 /60。
+ 不公开发布的 CIDR 范围不需要 ROA，但 RDAP 记录仍需更新。
+ 您可以将每个地址范围一次添加到一个 AWS 区域中。
+ 对于每个 AWS 区域，您可以将总共 5 个 BYOIP IPv4 和 IPv6 地址范围引入到您的 AWS 账户中。您无法使用服务限额控制台调整 BYOIP CIDR 的限额，但可以按照 *AWS 一般参考* 中的 [AWS 服务限额](https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html)所述，通过联系 AWS 支持中心来请求提高限额。
+ 您无法使用 AWS RAM 与其它账户共享您的 IP 地址范围，除非您使用 Amazon VPC IP 地址管理器 (IPAM) 并将 IPAM 与 AWS Organizations 集成。有关更多信息，请参阅 *Amazon VPC IPAM 用户指南*中的[将 IPAM 与 AWS Organizations 集成](https://docs.aws.amazon.com/vpc/latest/ipam/enable-integ-ipam.html)。
+ IP 地址范围中的地址必须具有干净的历史记录。我们可能会调查 IP 地址范围的声誉，并保留权利以拒绝包含的 IP 地址具有不良声誉或与恶意行为关联的 IP 地址范围。
+ 遗留地址空间是指在区域互联网注册机构（RIR）系统成立之前由互联网号码分配机构（IANA）的中央注册管理机构分配的 IPv4 地址空间，仍然需要相应的 ROA 对象。
+ 如果为 LIR，常见做法是通过手动过程更新记录。这可能需要几天的时间来部署，具体取决于 LIR。
+ 大型 CIDR 块需要单个 ROA 对象和 RDAP 记录。您可以使用单个对象和记录，将多个较小的 CIDR 块从该范围添加到 AWS，甚至可以跨多个 AWS 区域添加。
+ Wavelength 区域或 AWS Outposts 上不支持 BYOIP。
+ 不要在 RADb 对 BYOIP 或任何其他 IRR 进行任何手动更改。BYOIP 将自动更新 RADb。任何包含 BYOIP ASN 的手动更改都将导致 BYOIP 预置操作失败。
+ 将 IPv4 地址范围引入 AWS 后，您可以使用该范围内的所有 IP 地址，包括第一个地址（网络地址）和最后一个地址（广播地址）。

## 区域可用性
<a name="byoip-reg-avail"></a>

BYOIP 功能目前适用于除中国区域以外的所有商业 [AWS 区域](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)。

## 本地区域可用性
<a name="byoip-zone-avail"></a>

[本地区域](https://docs.aws.amazon.com/local-zones/latest/ug/how-local-zones-work.html)是在地理上靠近您的用户的 AWS 区域的扩展。本地区域分组为“网络边界组”。在 AWS 中，网络边界组是一组可用区（AZ）、本地区域或 Wavelength 区域（AWS 可从中公告公有 IP 地址）。本地区域的网络边界组可能与 AWS 区域中的可用区不同，以确保 AWS 网络与访问这些区域中资源的客户之间，保持最低延迟或最短物理距离。

您可以使用 `--network-border-group` 选项将 BYOIPv4 地址范围预置到以下本地区域网络边界组，并在该边界组中进行公告：
+ af-south-1-los-1
+ ap-northeast-1-tpe-1
+ ap-south-1-ccu-1
+ ap-south-1-del-1
+ ap-southeast-1-bkk-1
+ ap-southeast-1-mnl-1
+ ap-southeast-2-akl-1
+ ap-southeast-2-per-1
+ eu-central-1-ham-1
+ eu-central-1-ist-1
+ eu-central-1-waw-1
+ eu-north-1-cph-1
+ eu-north-1-hel-1
+ me-south-1-mct-1
+ us-east-1-atl-2
+ us-east-1-bos-1
+ us-east-1-bue-1
+ us-east-1-chi-2
+ us-east-1-dfw-2
+ us-east-1-iah-2
+ us-east-1-lim-1
+ us-east-1-mci-1
+ us-east-1-mia-2
+ us-east-1-msp-1
+ us-east-1-nyc-1
+ us-east-1-nyc-2
+ us-east-1-phl-1
+ us-east-1-qro-1
+ us-east-1-scl-1
+ us-west-2-den-1
+ us-west-2-hnl-1
+ us-west-2-las-1
+ us-west-2-lax-1
+ us-west-2-pdx-1
+ us-west-2-phx-2
+ us-west-2-sea-1

如果启用了“本地区域”（请参阅[启用本地区域](https://docs.aws.amazon.com/local-zones/latest/ug/getting-started.html#getting-started-find-local-zone)），则在预置和公告 BYOIPv4 CIDR 时，可以为本地区域选择网络边界组。请谨慎选择网络边界组，因为 EIP 及其关联的 AWS 资源必须位于同一个网络边界组中。

**注意**  
此时无法在本地区域中预置或公告 BYOIPv6 地址范围，但同时支持 BYOIPv4 和 BYOIPv6 的 `eu-central-1-ist-1` 除外。

在 `eu-central-1-ist-1` 本地区域中，公告和撤回是异步操作，完成这些操作最多可能需要五个工作日。当您公告地址范围时，其状态会从 `provisioned` 变为 `pending-advertising`，并在操作完成后变为 `advertised`。当您撤回时，状态会从 `advertised` 变为 `pending-withdrawal`，然后又变回 `provisioned`。您可以通过 AWS 控制台或 CLI 监控这些操作的进度。

如果您使用自己的 ASN（BYOASN），则可以在发布地址范围时进行指定。公告后，无法更改与 CIDR 相关联的 ASN。要更改 ASN，请撤回 CIDR 并重新公告。

**重要**  
无法取消待处理的公告或撤销。在执行下一操作之前，必须等待当前操作完成。
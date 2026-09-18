

# Amazon EC2 网络接口的前缀委派
<a name="ec2-prefix-eni"></a>

您可以自动或手动为网络接口分配私有 IPv4 或 IPv6 CIDR 范围。通过分配前缀，您可以扩展和简化应用程序的管理，包括一个实例上需要多个 IP 地址的容器和网络应用程序。有关 IPv4 和 IPv6 地址的更多信息，请参阅 [Amazon EC2 实例 IP 寻址](using-instance-addressing.md)。

可用的分配选项如下：
+ **自动分配** - AWS选择前缀并将其分配给您的网络接口。如果网络接口的子网的子网 CIDR 预留类型为`prefix`，我们会从子网 CIDR 预留中选择前缀。否则，我们会从子网 CIDR 范围中选择它们。
+ **手动分配** – 您指定前缀后，AWS 会在将前缀分配给您的网络接口之前，验证该前缀是否尚未分配给其他资源。

分配前缀具有以下优势：
+ 增加了网络接口上的 IP 地址 – 使用前缀时，您可以分配一个 IP 地址块，而不是单个 IP 地址。这会增加网络接口的 IP 地址数量。
+ 简化了容器的 VPC 管理 – 在容器应用程序中，每个容器都需要一个唯一的 IP 地址。为您的实例分配前缀可简化 VPC 的管理，因为您可以启动和终止容器，而无需为单个 IP 分配调用 Amazon EC2 API。

**Contents**
+ [基本功能](#ec2-prefix-basics)
+ [注意事项](#prefix-limit)
+ [管理前缀](work-with-prefixes.md)
  + [在网络接口创建过程中分配前缀](work-with-prefixes.md#assign-auto-creation)
  + [分配前缀至现有网络接口](work-with-prefixes.md#assign-auto-existing)
  + [从网络接口中移除前缀](work-with-prefixes.md#unassign-prefix)

## 基本功能
<a name="ec2-prefix-basics"></a>
+ 您可以为新的或现有网络接口分配前缀。
+ 要使用前缀，请为您的网络接口分配前缀，将该网络接口连接至您的实例，然后配置您的操作系统。
+ 选择指定前缀的选项时，前缀必须满足以下要求：
  + 您可以指定的 IPv4 前缀为 `/28`。
  + 您可以指定的 IPv6 前缀为 `/80`。
  + 前缀位于网络接口的子网 CIDR 中，并且不会与分配给子网中现有资源的其他前缀或 IP 地址重叠。
+ 您可以为主网络接口或辅助网络接口分配前缀。
+ 您可以将弹性 IP 地址分配给有前缀的网络接口。
+ 您也可以将弹性 IP 地址分配给已分配前缀的 IP 地址。
+ 我们将实例的私有 DNS 主机名解析为主私有 IPv4 地址。
+ 我们使用以下格式为网络接口分配每个私有 IPv4 地址，包括前缀中的地址：
  + `us-east-1` 区域

    ```
    {{ip-private-ipv4-address}}.ec2.internal
    ```
  + 所有其他区域

    ```
    {{ip-private-ipv4-address}}.{{region}}.compute.internal
    ```

## 注意事项
<a name="prefix-limit"></a>

使用前缀时请注意以下事项：
+ [基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)支持带有前缀的网络接口。
+ 网络接口的前缀必须使用 IPv6 地址和私有 IPv4 地址。
+ 您可以分配给网络接口的 IP 地址的最大数量取决于实例类型。您分配给网络接口的每个前缀都算作一个 IP 地址。例如，`c5.large` 实例具有每个网络接口 `10` 个 IPv4 地址的限制。此实例的每个网络接口都有一个主 IPv4 地址。如果网络接口没有辅助 IPv4 地址，则您最多可以为网络接口分配 9 个前缀。您每为网络接口多分配一个 IPv4 地址，则您就可以为网络接口少分配一个前缀。有关更多信息，请参阅 [每个网络接口的最大 IP 地址数](AvailableIpPerENI.md)。
+ 前缀包含在源/目标检查中。
+ 您必须配置操作系统，才能使用带有前缀的网络接口。请注意以下几点：
  + 一些 Amazon Linux AMI 包含由 AWS 安装的其他脚本，它们称为 `ec2-net-utils`。这些脚本可以选择性地自动配置您的网络接口。它们仅在 Amazon Linux 上使用。
  + 对于容器，您可以将容器网络接口（CNI）用于 Kubernetes 插件或 `dockerd`（如果您使用 Docker 管理容器）。
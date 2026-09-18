

# 主机名类型
<a name="hostname-types"></a>

AWS 提供的主机名分为**私有**和**公用**这两种类型。下表比较了私有主机名和公有主机名之间的主要区别，包括其解析方式、配置方式以及使用场景。


| ​ | 私有主机名 | 公有主机名 | 
| --- | --- | --- | 
| DNS 解析 | 私有主机名用于无法从公共互联网访问的私有 FQDN。私有主机名仅允许将请求解析为 VPC 内的私有 IPv4 和 IPv6 GUA 地址。 | 公有主机名用于可从公共互联网访问的公有 FQDN。公有主机名允许将请求解析为 VPC 内的私有 IPv4 和 IPv6 GUA 以及来自互联网的公有 IP（水平分割 DNS）。 | 
| 配置 | 私有主机名在实例级别配置。 | 公共主机名在网络接口级别配置。 | 
| 何时使用 |  + 适用于仅在 VPC 内解析以用于内部通信的主机名<br />+ 将内部命名方案保密<br />+ 简化内部资源管理，无需考虑外部 DNS 因素  |  + 从 IPv4 和 IPv6 地址通过互联网访问实例<br />+ 确保从 IPv4 环境顺利迁移到 IPv6 环境  | 

**Topics**
+ [公有主机名](#public-hostnames)
+ [私有主机名](#ec2-instance-private-hostnames)

## 公有主机名
<a name="public-hostnames"></a>

您可以使用*公有主机名*来访问 EC2 实例，这些主机名将会解析为实例的公有 IPv4 或 IPv6 地址，以方便您过渡到 IPv6。

使用公有主机名时，您可以：
+ 通过 IPv4 和 IPv6 访问 EC2 实例，从而提高资源连接方式的灵活性。
+ 按照自己的节奏从 IPv4 环境迁移到 IPv6 环境。例如，您可以分开迁移数据库和应用程序，从而降低复杂性和风险。
+ 使用多个主机名选项（仅 IPv4、仅 IPv6 和双栈），自动解析为相应的 IP 地址。
+ 享受[水平分割 DNS](https://en.wikipedia.org/wiki/Split-horizon_DNS) 提供的更好安全性。在您的 VPC 内进行查询时，系统会将主机名解析为私有 IP 地址。

**Topics**
+ [公有主机名的类型及使用场景](#public-hostname-types)
+ [查看公有主机名](#view-public-hostnames)
+ [修改公有主机名类型](#modify-public-hostnames)

### 公有主机名的类型及使用场景
<a name="public-hostname-types"></a>

要使用公有主机名，必须修改现有的网络接口。本节介绍了三种公有主机名类型选项，并提供了有关使用决策的帮助：
+ **双栈 – 基于 IP 的名称**
  + 如果您正在迁移或计划从 IPv4 迁移到 IPv6，那么此选项将非常适合。此选项同时支持通过 IPv4 和 IPv6 进行连接，为可能使用任一协议的客户端提供了灵活性，并使客户端能够在迁移到 IPv6 的整个过程中保持相同的主机名。
  + 来自 VPC 内部的请求将会解析为网络接口的私有 IPv4 地址和 IPv6 全局单播地址（GUA）；而来自互联网的请求则会解析为网络接口的公有 IPv4 和 IPv6 GUA 地址。
  + **示例**
    + 选择此选项时，将为此网络接口生成一个双栈 FQDN。以下是将生成的 FQDN 示例：
      + f5lnz-0khrm-nt2u3-gyqqt-nbdl5-q3cdpO.ap-southeast-2.ip.aws
    + 其中：
      + f5lnz-0khrm-nt2u3-gyqqt-nbdl5-q3cdpO 是主机名，即网络接口主公有 IPv6 地址（f5lnz-0khrm-nt2u3-gyqqt-nbdl5）的 [base36](https://en.wikipedia.org/wiki/Base36) 表示法加该网络接口主公有 IPv4 地址（q3cdpO）的 base36 表示法。
      + f5lnz-0khrm-nt2u3-gyqqt-nbdl5 将由 Amazon DNS 解析器解析为 IPv6 GUA 地址 FFFF:1407:4:f000:81d:2689:1066:4489。这是分配给网络接口的第一个 IPv6 GUA。
      + q3cdpO 将会解析为 IPv4 地址 52.54.55.56。这是附加到主网络接口的公有 IPv4 地址。
      + ap-southeast-2 是网络接口所在子网所属区域。
      + ip.aws 是由 AWS 提供的域。
+ **IPv6 – 基于 IP 的名称**
  + 如果您已经迁移到 IPv6 并且只需要通过 IPv6 进行连接，那么此选项将非常适合。
  + VPC 内或来自互联网的请求都会解析为网络接口的 IPv6 GUA 地址。
  + **示例**
    + 选择此选项时，将为此网络接口生成一个 FQDN。以下是将生成的 FQDN 示例：
      + f5lnz-0khrm-nt2u3-gyqqt-nbdl5.ap-southeast-2.ip.aws
    + 其中：
      + f5lnz-0khrm-nt2u3-gyqqt-nbdl5 是主机名，即网络接口主公有 IPv6 地址的 base36 表示法。
      + f5lnz-0khrm-nt2u3-gyqqt-nbdl5 将由 Amazon DNS 解析器解析为 IPv6 GUA 地址 FFFF:1407:4:f000:81d:2689:1066:4489。这是分配给网络接口的第一个 IPv6 GUA。
      + ap-southeast-2 是网络接口所在子网所属区域。
      + ip.aws 是由 AWS 提供的域。
+ **IPv4 – 基于 IP 的名称**
  + 如果使用此网络接口的实例在过渡到 IPv6 期间需要继续使用 IPv4 访问，或者在该实例上运行的应用程序或系统仅支持 IPv4，则此选项将非常适合。如果只需要保持 IPv4 连接，并且工作负载不需要 IPv6 支持，则此选项将非常适合。例如，假设要迁移到 IPv6，并且您决定某些应用程序保留 IPv4，而其他应用程序则迁移到 IPv6。
  + 来自 VPC 内部的请求将会解析为网络接口的私有主 IPv4 地址；而来自互联网的请求则会解析为网络接口的公有 IPv4 地址。
  + **示例**
    + 选择此选项时，将为此网络接口生成一个支持 IPv4 的公有主机名。以下是将生成的 DNS 名称示例：
      + ec2-52-54-55-66.ap-southeast-2.compute.amazonaws.com
    + 其中：
      + ec2-52-54-55-66 是源自网络接口的主公有 IPv4 地址的主机名，格式为 ec2- 后跟 IP 地址，其中点号用连字符代替。
      + ec2-52-54-55-66 将会解析为 IPv4 地址 52.54.55.66。这是附加到主网络接口的公有 IPv4 地址。
      + ap-southeast-2 是网络接口所在子网所属区域。
      + compute.amazonaws.com 是 AWS 为基于 IPv4 的公有主机名提供的域。

**重要**  
在上面的示例中，IP 地址被用于生成主机名。如果您更改分配给网络接口的主私有 IPv4 地址或第一个 IPv6 GUA，则主机名中转换为 IP 地址的部分也将改变，并且**先前生成的公有主机名将不再有效**。此外，更改主 IPv4 公有地址会强制下游刷新《Amazon EC2 用户指南》中所述的[实例元数据服务（IMDS）](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html)**，因此 EC2 实例 IMDS 元数据也会自动更新。

### 查看公有主机名
<a name="view-public-hostnames"></a>

如果网络接口所在的 VPC 未同时启用 EnableDnsHostnames 和 EnableDnsSupport，则不会定义或生成任何主机名类型。

------
#### [ Console ]

可查看实例或主网络接口的公有主机名。

**查看实例的主机名类型和 DNS 名称**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选中该实例的复选框。

1. 在**网络**选项卡上的**主机名和 DNS**下，查找以下内容：
   + **公共主机名类型**
   + **公有 DNS**
   + **仅 IPv4 - 基于 IP 的名称**
   + **仅 IPv6 – 基于 IP 的名称**
   + **双栈 – 基于 IP 的名称**

**查看网络接口的主机名类型和 DNS 名称**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**网络接口**。

1. 在搜索字段中，输入实例 ID。选择网络接口的 ID 以打开其详细信息页面。

1. 在**主机名和 DNS**下，查找以下内容：
   + **公共主机名类型**
   + **公有 DNS 名称**
   + **公有 IPv4 DNS 名称**
   + **公有 IPv6 DNS 名称**
   + **公有双栈 DNS 名称**

------
#### [ AWS CLI ]

**查看网络接口的主机名类型和 DNS 名称**  
使用 [describe-network-interfaces](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-network-interfaces.html) 命令。

```
aws ec2 describe-network-interfaces \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --query NetworkInterfaces[].PublicIpDnsNameOptions
```

下面是示例输出。由于主机名类型为 `public-dual-stack-dns-name`，因此 DNS 主机名与 `PublicDualStackDnsName` 相同。

```
[
     {
          "DnsHostnameType": "public-dual-stack-dns-name",
          "PublicIpv4DnsName": "ec2-52-54-55-66.ap-southeast-2.compute.amazonaws.com",
          "PublicIpv6DnsName": "f5lnz-0khrm-nt2u3-gyqqt-nbdl5.ap-southeast-2.ip.aws",
          "PublicDualStackDnsName": "f5lnz-0khrm-nt2u3-gyqqt-nbdl5-q3cdpO.ap-southeast-2.ip.aws"
     }
]
```

------
#### [ PowerShell ]

**查看网络接口的主机名类型和 DNS 名称**  
使用 [Get-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2NetworkInterface.html) cmdlet。

```
(Get-EC2NetworkInterface `
    -NetworkInterfaceId {{eni-1234567890abcdef0}}).PublicIpDnsNameOptions
```

下面是示例输出。由于主机名类型为 `public-dual-stack-dns-name`，因此 DNS 主机名与 `PublicDualStackDnsName` 相同。

```
DnsHostnameType        : public-dual-stack-dns-name
PublicDualStackDnsName : f5lnz-0khrm-nt2u3-gyqqt-nbdl5-q3cdpO.ap-southeast-2.ip.aws
PublicIpv4DnsName      : ec2-52-54-55-66.ap-southeast-2.compute.amazonaws.com
PublicIpv6DnsName      : f5lnz-0khrm-nt2u3-gyqqt-nbdl5.ap-southeast-2.ip.aws
```

------

### 修改公有主机名类型
<a name="modify-public-hostnames"></a>

公有主机名类型选项取决于与网络接口关联的 IP 地址：
+ 如果网络接口只有一个公有 IPv4 地址，则主机名类型必须为 **IPv4 – 基于 IP 的名称**。
+ 如果网络接口只有一个 IPv6 地址，则主机名类型必须为 **IPv6 – 基于 IP 的名称**。
+ 如果网络接口同时拥有一个公有 IPv4 地址和一个 IPv6 地址，则主机名类型可以为 **双栈 – 基于 IP 的名称**。

**先决条件**
+ 网络接口必须具有关联的公有 IPv4 或 IPv6 地址。
+ 网络接口所在的 VPC 必须已经启用了 EnableDnsHostnames 和 EnableDnsSupport 选项。请参阅《Amazon VPC 用户指南》中的[查看和更新 VPC 的 DNS 属性](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns-updating.html)**。

------
#### [ Console ]

**修改公共主机名类型**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**网络接口**。

1. 在搜索字段中，输入实例 ID。选中该网络接口的复选框。

   或者，在实例详细信息页面中选择**网络**选项卡，然后为设备索引 0 选择网络接口的 ID。

1. 选择**操作**、**修改公有主机名类型**。

1. 选择一个选项：
   + **双栈 – 基于 IP 的名称**：网络接口的双栈公有主机名。来自 VPC 内部的请求将会解析为网络接口的私有 IPv4 地址和 IPv6 全局单播地址；而来自互联网的请求则会解析为网络接口的公有 IPv4 和 IPv6 GUA 地址。
   + **IPv4 – 基于 IP 的名称**：已启用 IPv4 的网络接口公有主机名。来自 VPC 内部的请求将会解析为网络接口的私有主 IPv4 地址；而来自互联网的请求则会解析为网络接口的公有 IPv4 地址。
   + **IPv6 – 基于 IP 的名称**：已启用 IPv6 的网络接口公有主机名。VPC 内或来自互联网的请求都会解析为网络接口的 IPv6 GUA 地址。

1. 选择 **Modify**(修改)。

------
#### [ AWS CLI ]

**修改公共主机名类型**  
使用 [modify-public-ip-dns-name-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-public-ip-dns-name-options.html) 命令。

```
aws ec2 modify-public-ip-dns-name-options \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --hostname-type {{public-dual-stack-dns-name}}
```

下面是示例输出。

```
{
    "Successful": true
}
```

------
#### [ PowerShell ]

**修改公共主机名类型**  
使用 [edit-EC2PublicIpDnsNameOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2PublicIpDnsNameOption.html) cmdlet。

```
Edit-EC2PublicIpDnsNameOption `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -HostNameType {{public-dual-stack-dns-name}}
```

------

## 私有主机名
<a name="ec2-instance-private-hostnames"></a>

本节介绍在 VPC 子网中启动实例时可用的 Amazon EC2 实例私有主机名。

私有主机名用来区分您网络中的 EC2 实例。例如，假设您想通过运行脚本来与网络上的部分或全部实例进行通信，则可以使用实例的私有主机名。

**Topics**
+ [私有主机名类型](#instance-naming-types)
+ [在哪里可以找到资源名称和 IP 名称](#instance-naming-presence)
+ [在资源名称和 IP 名称之间进行选择](#instance-naming-choose)
+ [更改 Amazon EC2 基于资源的命名选项](#instance-naming-modify)

### 私有主机名类型
<a name="instance-naming-types"></a>

在 VPC 中启动 EC2 实例时，来宾操作系统主机名有两种私有主机名类型：
+ **IP name**（IP 名称）：传统命名方案，当您启动实例时，实例的*私有 IPv4 地址*包含在实例的主机名中。IP 名称在 EC2 实例的生命周期内存在。当用作私有 DNS 主机名时，它只会返回私有 IPv4 地址（A 记录）。
+ **Resource name**（资源名称）：当您启动实例时，*EC2 instance ID*（EC2 实例 ID）包含在实例的主机名中。资源的名称在 EC2 实例的生命周期内存在。当用作私有 DNS 主机名时，它可以返回私有 IPv4 地址（A 记录）和/或 IPv6 全局单播地址（AAAA 记录）。

EC2 实例来宾操作系统主机名类型取决于子网设置：
+ 如果在仅 IPv4 子网中启动实例，则可以选择 IP 名称或资源名称。
+ 如果在双堆栈（IPv4\+IPv6）子网中启动实例，则可以选择 IP 名称或资源名称。
+ 如果在仅 IPv6 子网中启动实例，则会自动使用资源名称。

**Topics**
+ [IP 名称](#instance-naming-ipbn)
+ [资源名称](#instance-naming-rbn)
+ [IP 名称和资源名称之间的区别](#instance-naming-diff)

#### IP 名称
<a name="instance-naming-ipbn"></a>

当您启动具有 **IP name**（IP 名称）的 **Hostname type**（主机名类型）的 EC2 实例时，来宾操作系统主机名将配置为使用私有 IPv4 地址。
+ us-east-1 中的实例的格式：`{{private-ipv4-address}}.ec2.internal`
+ 示例：`{{ip-10-24-34-0}}.ec2.internal`
+ 任何其它AWS区域中的实例的格式：`{{private-ipv4-address.region}}.compute.internal`
+ 示例：`{{ip-10-24-34-0.us-west-2}}.compute.internal`

#### 资源名称
<a name="instance-naming-rbn"></a>

当您在仅 IPv6 子网中启动 EC2 实例时，**Resource name**（资源名称）的 **Hostname type**（主机名类型）默认处于选中状态。当您在仅 IPv4 子网或双堆栈（IPv4\+IPv6）子网中启动实例时，**Resource name**（资源名称）是您可以选择的选项。启动实例后，您可以管理主机名配置。有关更多信息，请参阅 [更改 Amazon EC2 基于资源的命名选项](#instance-naming-modify)。

当您启动具有 **Resource name**（资源名称）的**Hostname type**（主机名类型）的 EC2 实例时，来宾操作系统主机名将配置为使用 EC2 实例 ID。
+ us-east-1 中的实例的格式：`{{ec2-instance-id}}.ec2.internal`
+ 示例：`{{i-0123456789abcdef}}.ec2.internal`
+ 任何其它AWS区域中的实例的格式：`{{ec2-instance-id.region}}.compute.internal`
+ 示例：`{{i-0123456789abcdef.us-west-2}}.compute.internal`

#### IP 名称和资源名称之间的区别
<a name="instance-naming-diff"></a>

IP 名称和资源名称的 DNS 查询共存，以确保向后兼容并允许您从基于 IP 的主机名命名迁移到基于资源的命名。对于基于 IP 名称的私有 DNS 主机名，您无法配置是否响应实例的 DNS A 记录查询。无论客户操作系统主机名设置如何，DNS A 记录查询始终得到响应。相反，对于基于资源名称的私有 DNS 主机名，您可以配置是否响应实例的 DNS A 和/或 DNS AAAA 查询。当您启动实例或修改子网时，您可以配置响应行为。有关更多信息，请参阅 [更改 Amazon EC2 基于资源的命名选项](#instance-naming-modify)。

### 在哪里可以找到资源名称和 IP 名称
<a name="instance-naming-presence"></a>

您可以在 Amazon EC2 控制台中查看主机名类型、资源名称和 IP 名称。

**Topics**
+ [创建 EC2 实例时](#instance-naming-presence-create)
+ [查看现有 EC2 实例的详细信息时](#instance-naming-presence-view)

#### 创建 EC2 实例时
<a name="instance-naming-presence-create"></a>

当您创建 EC2 实例时，根据您选择的子网类型，**Resource name（资源名称）**的 **Hostname type**（主机名类型）可能是可用的，也可能已选中且无法修改。本节介绍您会在什么场景中看到主机名类型、资源名称和 IP 名称。

##### 方案 1
<a name="instance-naming-presence-create-1"></a>

您在向导中创建 EC2 实例（参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)），然后配置详细信息时，您选择配置为仅 IPv6 的子网。

在这种情况下，**Resource name**（资源名称）的 **Hostname type**（主机名类型）已自动选中且无法修改。将自动取消选择 **Enable IP name IPv4 (A record) DNS requests**（启用 IP 名称 IPv4（A 记录）DNS 请求）和 **Enable resource-based IPv4 (A record) DNS requests**（启用基于资源的 IPv4（A 记录）DNS 请求）的 **DNS Hostname**（DNS 主机名）选项且不可修改。**Enable resource-based IPv6 (AAAA record) DNS requests**（启用基于资源的 IPv6（AAAA 记录）DNS 请求）默认处于选中状态，但是可修改。如果选择该选项，对资源名称的 DNS 请求将解析为此 EC2 实例的 IPv6 地址（AAAA 记录）。

##### 方案 2
<a name="instance-naming-presence-create-2"></a>

您在向导中创建 EC2 实例（见 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)），然后配置详细信息时，您选择配置为 IPv4 CIDR 块或同时配置 IPv4 和 IPv6 CIDR 块（“双堆栈”）的子网。

在此情况下，**Enable IP name IPV4 (A record) DNS requests**（启用 IP 名称 IPv4（A 记录）DNS 请求）已自动选中且无法更改。这意味着对 IP 名称的请求将解析为此 EC2 实例的 IPv4 地址（A 记录）。

选项默认为子网的配置，但是您可以根据子网设置修改此实例的选项：
+ **Hostname type**（主机名类型）：确定您希望 EC2 实例的来宾操作系统主机名是资源名称还是 IP 名称。默认值是 **IP name**（IP 名称）。
+ **Enable resource-based IPv4 (A record) DNS requests**（启用基于资源的 IPV4（A 记录）DNS 请求）：确定对您的资源名称的请求是否解析为此 EC2 实例的私有 IPv4 地址（A 记录）。此选项非默认选定。
+ **Enable resource-based IPV6 (AAAA record) DNS requests**（启用基于资源的 IPV6（AAAA 记录）DNS 请求）：确定对您的资源名称的请求是否解析为此 EC2 实例的 IPv6 GUA 地址（AAAA 记录）。此选项非默认选定。

#### 查看现有 EC2 实例的详细信息时
<a name="instance-naming-presence-view"></a>

您可以在 EC2 实例的 **Details**（详细信息）选项卡中查看现有 EC2 实例的主机名值：
+ **Hostname type**（主机名类型）：IP 名称或资源名称格式的主机名。
+ **Private IP DNS name (IPv4 only)**（私有 IP DNS 名称（仅 IPv4））：将始终解析为实例的私有 IPv4 地址的 IP 名称。
+ **Private resource DNS name**（私有资源 DNS 名称）：解析为为此实例选择的 DNS 记录的资源名称。
+ **Answer private resource DNS name**（回答私有资源 DNS 名称）：资源名称解析为 IPv4（A）、IPv6（AAAA）或 IPv4 和 IPv6（A 和 AAAA）DNS 记录。

此外，如果您直接通过 SSH 连接到 EC2 实例，然后输入 `hostname` 命令，您将看到 IP 名称或资源名称格式的主机名。

### 在资源名称和 IP 名称之间进行选择
<a name="instance-naming-choose"></a>

当您启动 EC2 实例时（请参阅[使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md))，如果选择 **Resource name**（资源名称）的 **Hostname type**（主机名类型），EC2 实例将使用资源名称格式的主机名启动。在这种情况下，此 EC2 实例的 DNS 记录也可以指向资源名称。这使您可以灵活地选择该主机名是解析为实例的 IPv4 地址、IPv6 地址，还是同时解析实例的 IPv4 和 IPv6 地址。如果您计划在未来使用 IPv6，或者如果您现在使用双堆栈子网，最好使用 **Resource name**（资源名称）的 **Hostname type**（主机名类型），以便在不对 DNS 记录本身进行任何更改的情况下更改实例主机名的 DNS 解析。资源名称允许您在 EC2 实例上添加和删除 IPv4 和 IPv6 DNS 解析。

如果选择了 **IP name**（IP 名称）的 **Hostname type**（主机名类型），并将其用作 DNS 主机名，则只能解析为实例的 IPv4 地址。即使实例同时具有与之关联 IPv4 地址和 IPv6 地址，它也不会解析为实例的 IPv6 地址。

### 更改 Amazon EC2 基于资源的命名选项
<a name="instance-naming-modify"></a>

您可以更改子网的主机名类型和 DNS 主机名配置，这会影响该主题中的所有后续实例启动，也可以在启动 EC2 实例后更改实例的这些内容。

**基于资源的命名选项**
+ **主机名类型**：确定在子网中启动的 EC2 实例的访客操作系统主机名的默认设置。这可以是资源名称，也可以是 IP 名称。
+ **启用 DNS 主机名 IPv4（A 记录）请求**：确定是否将对资源名称的 DNS 请求/查询解析为此 EC2 实例的私有 IPv4 地址（A 记录）。
+ **启用 DNS 主机名 IPv6（AAAA 记录）请求**：确定是否将对资源名称的 DNS 请求/查询解析为此 EC2 实例的 IPv6 地址（AAAA 记录）。

#### 子网
<a name="instance-naming-modify-subnets"></a>

更改子网设置不会更改子网中已启动的 EC2 实例的配置。

------
#### [ Console ]

**修改子网的选项**  
打开 Amazon VPC 控制台并选择子网。依次选择**操作**、**编辑子网设置**。根据需要修改设置并保存更改。

------
#### [ AWS CLI ]

**修改子网的选项**  
使用 [modify-subnet-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-subnet-attribute.html) 命令。

```
aws ec2 modify-subnet-attribute \
    --subnet-id {{subnet-0abcdef1234567890}} \
    --private-dns-hostname-type-on-launch resource-name \
    --enable-resource-name-dns-a-record-on-launch \
    --enable-resource-name-dns-aaaa-record-on-launch
```

------
#### [ PowerShell ]

**修改子网的选项**  
使用 [Edit-EC2SubnetAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2SubnetAttribute.html) cmdlet。

```
Edit-EC2SubnetAttribute `
    -SubnetId {{subnet-0abcdef1234567890}} `
    -PrivateDnsHostnameTypeOnLaunch ResourceName `
    -EnableResourceNameDnsAAAARecordOnLaunch $true `
    -EnableResourceNameDnsARecordOnLaunch $true
```

------

#### EC2 实例
<a name="instance-naming-modify-instances"></a>

**注意事项**
+ 要更改主机名类型，必须先停止实例。要更改其他两个选项，则无需停止实例。
+ 因为无法停止具有实例存储根卷的实例，所以您只能在实例启动时配置主机名类型和 DNS 主机名选项。只有以下实例类型支持实例存储根卷：C1、C3、D2、I2、M1、M2、M3、R3 和 X1。

------
#### [ Console ]

**修改实例的主机名类型和 DNS 主机名选项**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 如果您要更改 **Use resource based naming as guest OS hostname**（将基于资源的命名用作来宾操作系统主机名）设置，首先停止该 EC2 实例。否则，请跳过此步骤。

   要停止实例，请选择该实例，然后依次选择 **Instance state**（实例状态）、**Stop instance**（停止实例）。

1. 选择实例，然后依次选择 **Actions**（操作）、**Instance settings**（实例设置）、**Change resource based naming options**（更改基于资源的命名选项）。
   + **Use resource based naming as guest OS hostname**（将基于资源的命名用作来宾操作系统主机名）：确定您希望 EC2 实例的来宾操作系统主机名是资源名称还是 IP 名称。
   + **Answer DNS hostname IPv4 (A record) requests** [回答 DNS 主机名 IPv4（A 记录）请求]：确定是否将对资源名称的 DNS 请求/查询解析为此 EC2 实例的私有 IPv4 地址。
   + **Answer DNS hostname IPv6 (AAAA record) requests**（回答 DNS 主机名 IPv6（AAAA 记录）请求）：确定对您的资源名称的 DNS 请求/查询是否解析为此 EC2 实例的 IPv6 地址（AAAA 记录）。

1. 选择**保存**。

1. 如果您已经停止实例，可以重新启动它。

------
#### [ AWS CLI ]

**修改实例的主机名类型和 DNS 主机名选项**  
使用 [modify-private-dns-name-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-private-dns-name-options.html) 命令。

```
aws ec2 modify-private-dns-name-options \
    --instance-id {{i-1234567890abcdef0}} \
    --private-dns-hostname-type resource-name \
    --enable-resource-name-dns-a-record \
    --enable-resource-name-dns-aaaa-record
```

------
#### [ PowerShell ]

**修改实例的主机名类型和 DNS 主机名选项**  
使用 [Edit-EC2PrivateDnsNameOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2PrivateDnsNameOption.html) cmdlet。

```
Edit-EC2PrivateDnsNameOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -PrivateDnsHostnameType ResourceName `
    -EnableResourceNameDnsAAAARecord $true`
    -EnableResourceNameDnsARecord $true
```

------
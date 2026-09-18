

# 在 AWS 账户之间转移弹性 IP 地址
<a name="transfer-EIPs-intro-ec2"></a>

您可以将弹性 IP 地址从一个 AWS 账户转移到另一个。这可能在以下情况下有帮助：
+ **灾难恢复**：在紧急事件期间为面向公众的互联网工作负载快速重新映射 IP 地址。
+ **组织调整**：将工作负载从一个 AWS 账户快速移动到另一个。地址转移无需等待安全组和网络 ACL 允许即可使用新弹性 IP 地址。
+ **集中式安全管理** – 使用集中式 AWS 安全账户跟踪和转移已通过安全合规性审查的弹性 IP 地址。

**定价**  
转移弹性 IP 地址不收取任何费用。

**Topics**
+ [启用弹性 IP 地址转移](#using-instance-addressing-eips-transfer-enable-ec2)
+ [接受转移的弹性 IP 地址](#using-instance-addressing-eips-transfer-accept-ec2)
+ [禁用弹性 IP 地址转移](#using-instance-addressing-eips-transfer-disable-ec2)

## 启用弹性 IP 地址转移
<a name="using-instance-addressing-eips-transfer-enable-ec2"></a>

本节介绍如何接受转移的弹性 IP 地址。请注意以下与启用弹性 IP 地址转移相关的限制：
+ 您可以将弹性 IP 地址从任何 AWS 账户（源账户）转移到同一 AWS 区域中的任何其他 AWS 账户（转入账户）。无法将弹性 IP 地址转移到其他区域。
+ 在转移弹性 IP 地址时，AWS 账户 账户之间有两步握手。当源账户开始转移时，转移账户有七天的时间来接受这个弹性 IP 地址转移。在那七天之内，从源账户可以看得见有待转移的那个弹性 IP 地址，比如：在 AWS 控制台中或使用 [describe-address-transfers](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-address-transfers.html) 命令即可看到。七天之后，转移将过期，而且弹性 IP 地址的所有权将被返回给其原始账户。
+ 在接受转移后的 14 天内，源账户可以查看已接受的转移，例如：在 AWS 控制台中或使用 [describe-address-transfers](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-address-transfers.html) 命令即可查看。
+ AWS 不会向转移账户通知待处理的弹性 IP 地址转移请求。源账户的所有者必须通知转移账户的所有者：他们必须接受弹性 IP 地址转移请求。
+ 转移完成后，与正在转移的弹性 IP 地址关联的所有标签都将被重置。
+ 您无法将从自带的公有 IPv4 地址池 [通常称为自带 IP（BYOIP）地址池] 分配的弹性 IP 地址转移到您的 AWS 账户。
+ 从 Amazon 提供的连续公有 IPv4 Amazon VPC IP 地址管理器（IPAM）池中分配的弹性 IP 地址不支持转移。不过，通过将 IPAM 与 AWS Organizations 集成并使用 AWS RAM，IPAM 允许跨 AWS 账户共享 IPAM 池。有关更多信息，请参阅《Amazon VPC IPAM User Guide》**中的 [Allocate sequential Elastic IP addresses from an IPAM pool](https://docs.aws.amazon.com/vpc/latest/ipam/tutorials-eip-pool.html)。
+ 如果您尝试转移与反向 DNS 记录相关联的弹性 IP 地址，则可以开始转移过程，但是在删除关联的 DNS 记录之前，转移账户将无法接受转移。
+ 如果已启用并配置了 AWS Outposts，则您可能已从客户拥有的 IP 地址池（CoIP）中分配了弹性 IP 地址。您无法转移从 CoIP 分配的弹性 IP 地址。但是，您可以使用 AWS RAM 与其他账户共享 CoIP。有关更多信息，请参阅《AWS Outposts 用户指南》**中的[客户拥有的 IP 地址](https://docs.aws.amazon.com/outposts/latest/userguide/routing.html#ip-addressing)。
+ 您可以使用 Amazon VPC IPAM 跟踪向 AWS Organizations 组织中的账户转移弹性 IP 地址的情况。有关更多信息，请参阅[查看 IP 地址历史记录](https://docs.aws.amazon.com/vpc/latest/ipam/view-history-cidr-ipam.html)。但是，如果将弹性 IP 地址转移到组织外部的 AWS 账户，则弹性 IP 地址的 IPAM 审核历史记录将丢失。

这些步骤必须由源账户完成。

------
#### [ Console ]

**启用弹性 IP 地址转移**

1. 确保您使用的是源 AWS 账户。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**弹性 IP**。

1. 选择一个或多个要启用转移的弹性 IP 地址，然后选择 **Actions**（操作）、**Enable transfer**（启用转移）。

1. 如果要转移多个弹性 IP 地址，则会看到 **Transfer type**（转移类型）选项。请选择以下选项之一：
   + 如果要将弹性 IP 地址转移到单个 AWS 账户，请选择 **Single account**（单个账户）。
   + 如果要将弹性 IP 地址转移到多个 AWS 账户，请选择 **Multiple accounts**（多个账户）。

1. 在 **Transfer account ID**（转移账户 ID）下，输入要向其转移弹性 IP 地址的 AWS 账户的 ID。

1. 在文本框中输入 **enable** 以确认转移。

1. 选择**提交**。

1. 若要接受转移，请参阅 [接受转移的弹性 IP 地址](#using-instance-addressing-eips-transfer-accept-ec2)。若要禁用转移，请参阅 [禁用弹性 IP 地址转移](#using-instance-addressing-eips-transfer-disable-ec2)。

------
#### [ AWS CLI ]

**启用弹性 IP 地址转移**

使用 [enable-address-transfer](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-address-transfer.html) 命令。

```
aws ec2 enable-address-transfer \
    --allocation-id {{eipalloc-09ad461b0d03f6aaf}} \
    --transfer-account-id {{123456789012}}
```

------
#### [ PowerShell ]

**启用弹性 IP 地址转移**  
使用 [Enable-EC2AddressTransfer](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-EC2AddressTransfer.html) cmdlet。

```
Enable-EC2AddressTransfer `
    -AllocationId {{eipalloc-09ad461b0d03f6aaf}} `
    -TransferAccountId {{123456789012}}
```

------

## 接受转移的弹性 IP 地址
<a name="using-instance-addressing-eips-transfer-accept-ec2"></a>

本节介绍如何接受转移的弹性 IP 地址。

在转移弹性 IP 地址时，AWS 账户 账户之间有两步握手。当源账户开始转移时，转移账户有七天的时间来接受这个弹性 IP 地址转移。在那七天之内，从源账户可以看得见有待转移的那个弹性 IP 地址，比如：在 AWS 控制台中或使用 [describe-address-transfers](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-address-transfers.html) 命令即可看到。七天之后，转移将过期，而且弹性 IP 地址的所有权将被返回给其原始账户。

接受转移时，请注意可能发生的以下异常情况以及如何解决这些异常：
+ **AddressLimitExceeded**：如果您的转移账户相应的弹性 IP 地址配额已超出，可以通过源账户来启动弹性 IP 地址转移，但此举将会导致系统出现异常，因为只要是转移账户在尝试接受这样的转移，此异常情况就会发生。默认情况下，每个 AWS 账户的限额为每个区域仅能使用最多 5 个弹性 IP 地址。欲提高此限制，请见此说明:[弹性 IP 地址配额](elastic-ip-addresses-eip.md#using-instance-addressing-limit)。
+ **InvalidTransfer.AddressCustomPtrSet**：如果您或组织中的某人已将您正在尝试转移的弹性 IP 地址配置为使用反向 DNS 查找，则源账户可以启用弹性 IP 地址转移，但是当转移账户尝试接受转移时，会发生此异常。若要解决此问题，源账户必须删除弹性 IP 地址的 DNS 记录。有关更多信息，请参阅 [在 Amazon EC2 上为电子邮件创建反向 DNS 记录](Using_Elastic_Addressing_Reverse_DNS.md)。
+ **InvalidTransfer.AddressAssociated**：如果弹性 IP 地址与 ENI 或 EC2 实例相关联，则源帐户可以启用弹性 IP 地址转移，但是当转移帐户尝试接受转移时，会发生此异常。若要解决此问题，源帐户必须解除弹性 IP 地址的关联。有关更多信息，请参阅 [解除弹性 IP 地址的关联](working-with-eips.md#using-instance-addressing-eips-associating-different)。

对于任何其他异常，[请联系 支持](https://aws.amazon.com/contact-us/)。

这些步骤必须由转移账户完成。

------
#### [ Console ]

**接受弹性 IP 地址转移**

1. 确保您使用的是转移账户。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**弹性 IP**。

1. 选择 **Actions**（操作）、**Accept transfer**（接受转移）。

1. 当您接受转移时，与要转移的弹性 IP 地址关联的标签不会随弹性 IP 地址一起转移。如果要为所接受的弹性 IP 地址定义 **Name**（名称）标签，请选择 **Create a tag with a key of 'Name' and a value that you specify**（创建具有“Name”键以及您指定的值的标签）。

1. 输入要转移的弹性 IP 地址。

1. 如果您接受多个转移的弹性 IP 地址，请选择 **Add address**（添加地址）以输入附加弹性 IP 地址。

1. 选择**提交**。

------
#### [ AWS CLI ]

**接受弹性 IP 地址转移**

使用 [accept-address-transfer](https://docs.aws.amazon.com/cli/latest/reference/ec2/accept-address-transfer.html) 命令。

```
aws ec2 accept-address-transfer --address {{100.21.184.216}}
```

------
#### [ PowerShell ]

**接受弹性 IP 地址转移**  
使用 [Approve-EC2AddressTransfer](https://docs.aws.amazon.com/powershell/latest/reference/items/Approve-EC2AddressTransfer.html) cmdlet。

```
Approve-EC2AddressTransfer -Address {{100.21.184.216}}
```

------

## 禁用弹性 IP 地址转移
<a name="using-instance-addressing-eips-transfer-disable-ec2"></a>

本节介绍如何在启用转移后禁用弹性 IP 转移。

这些步骤必须由启用转移的源账户完成。

------
#### [ Console ]

**禁用弹性 IP 地址转移**

1. 确保您使用的是源 AWS 账户。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**弹性 IP**。

1. 在弹性 IP 的资源列表中，确保启用了显示 **Transfer status**（转移状态）列的属性。

1. 选择一个或多个 **Transfer status**（转移状态）为 **Pending**（待处理）的弹性 IP 地址，然后选择 **Actions**（操作）、**Disable transfer**（禁用转移）。

1. 在文本框中输入 **disable** 以确认。

1. 选择**提交**。

------
#### [ AWS CLI ]

**禁用弹性 IP 地址转移**

使用 [disable-address-transfer](https://docs.aws.amazon.com/cli/latest/reference/ec2/disable-address-transfer.html) 命令。

```
aws ec2 disable-address-transfer --allocation-id {{eipalloc-09ad461b0d03f6aaf}}
```

------
#### [ PowerShell ]

**禁用弹性 IP 地址转移**  
使用 [Disable-EC2AddressTransfer](https://docs.aws.amazon.com/powershell/latest/reference/items/Disable-EC2AddressTransfer.html) cmdlet。

```
Disable-EC2AddressTransfer -AllocationId {{eipalloc-09ad461b0d03f6aaf}}
```

------
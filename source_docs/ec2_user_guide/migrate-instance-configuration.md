

# 通过启动新的 EC2 实例迁移到新实例类型
<a name="migrate-instance-configuration"></a>

仅当 EC2 实例是 EBS 支持的实例，并且其配置与您想要的新实例类型兼容时，您才能更改该实例的实例类型。否则，如果配置或实例与新实例类型不兼容，或者它是基于实例存储的实例，则您必须启动与所需实例类型兼容的替代实例。有关如何确定兼容性的更多信息，请参阅[更改实例类型的兼容性](resize-limitations.md)。

**迁移过程概述**
+ 备份原始实例上的数据。
+ 启动一个具有与您所需的新实例类型兼容的配置的新实例，附加已附加到原始实例的任何 EBS 卷。
+ 在新实例上安装应用程序。
+ 恢复所有数据。
+ 如果原始实例有弹性 IP 地址，则必须将其与新实例关联，以确保您的用户可以继续使用您的应用程序而不会中断。

**将实例迁移到新实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 备份仍然需要的任何数据，如下所示：
   + 连接到您的实例，并将实例存储卷上的数据复制到持久性存储中。
   + [创建 EBS 卷的快照](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-snapshot.html)，以便您可以使用相同数据创建新卷；或者将卷从原始实例分离，以便您可以将其附加到新实例。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择 **Launch instances**。配置实例时，执行以下操作：

   1. 选择支持您所需实例类型的 AMI。例如，您必须选择支持新实例类型的处理器类型的 AMI。此外，当前一代的实例类型需要 HVM AMI。

   1. 选择所需的新实例类型。如果您所需的实例类型不可用，则说明其与您所选 AMI 的配置不兼容。

   1. 如果您要允许相同的流量到达新实例，请选择与原始实例使用相同的 VPC 和安全组。

   1. 完成新实例的配置后，请完成以下步骤以选择密钥对并启动实例。实例进入 `running` 状态可能需要几分钟时间。

1. 如果您将数据备份到 EBS 快照，请[从快照创建卷](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-volume.html#ebs-create-volume-from-snapshot)，然后[将该卷附加](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-attaching-volume.html)到新实例。

   要将 EBS 卷从原始实例移动到新实例，请先从原始实例[分离该卷](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-detaching-volume.html)，然后[将该卷附加](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-attaching-volume.html)到新实例。

1. 在新实例上安装应用程序和所有必需软件。

1. 还原您在原始实例的实例存储卷中备份的所有数据。

1. 如果原始实例有弹性 IP 地址，请将其按如下方式分配给新实例：

   1. 在导航窗格中，选择 **Elastic IPs**。

   1. 选择与原始实例关联的弹性 IP 地址，然后依次选择**操作**、**取消关联弹性 IP 地址**。当系统提示进行确认时，选择**取消关联**。

   1. 在弹性 IP 地址仍处于选中状态的情况下，依次选择**操作**、**关联弹性 IP 地址**。

   1. 对于 **Resource type (资源类型)**，选择 **Instance (实例)**。

   1. 对于**实例**，选择新实例。

   1. （可选）对于 **Private IP address (私有 IP 地址)**，请指定要将弹性 IP 地址关联到的私有 IP 地址。

   1. 选择 **Associate**。

1. (可选) 如果不再需要原始实例，您可以将其终止。选择实例，确认您将要终止原始实例而不是新实例（例如，查看名称或启动时间），然后依次选择 **Instance state**（实例状态）、**Terminate instance**（终止实例）。
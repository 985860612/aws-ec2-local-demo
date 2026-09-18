

# Amazon EC2 中的联网功能
<a name="ec2-networking"></a>

通过 Amazon VPC，您可以在专供您的AWS账户使用的虚拟网络（称为 Virtual Private Cloud (VPC)）中启动AWS资源，如 Amazon EC2 实例。启动实例时，您可以从 VPC 中选择子网。该实例配置了主网络接口，即逻辑虚拟网卡。该实例从子网的 IPv4 地址接收主要私有 IP 地址，并将其分配到主网络接口。

您可以控制实例是否从 Amazon 的公有 IP 地址池接收公有 IP 地址。实例的公有 IP 地址会与您的实例关联，直至实例停止或终止。如果您需要持久性公有 IP 地址，可以为 AWS 账户分配弹性 IP 地址，并将其与实例或网络接口关联。在您释放弹性 IP 地址之前，该地址仍然与您的 AWS 账户关联，您可以根据需要将其从一个实例移动到另一个实例。您可以在 AWS 账户中使用您自己的 IP 地址，它会显示为地址池，然后从地址池中分配弹性 IP 地址。

要提高网络性能并减少延迟，您可以在置放群组中启动实例。您可以使用增强型联网功能显著地提高每秒数据包数 (PPS) 性能。您可以使用 Elastic Fabric Adapter (EFA) 加速高性能计算和机器学习应用程序，这是一种可以附加到支持的实例类型的网络设备。

**Topics**
+ [区域和可用区](using-regions-availability-zones.md)
+ [实例 IP 寻址](using-instance-addressing.md)
+ [EC2 实例主机名和域](ec2-instance-naming.md)
+ [自带 IP 地址](ec2-byoip.md)
+ [弹性 IP 地址](elastic-ip-addresses-eip.md)
+ [网络接口](using-eni.md)
+ [网络带宽](ec2-instance-network-bandwidth.md)
+ [增强联网](enhanced-networking.md)
+ [Elastic Fabric Adapter](efa.md)
+ [EC2 拓扑](ec2-instance-topology.md)
+ [置放群组](placement-groups.md)
+ [网络 MTU](network_mtu.md)
+ [Virtual Private Cloud](using-vpc.md)
+ [辅助网络](secondary-networks.md)
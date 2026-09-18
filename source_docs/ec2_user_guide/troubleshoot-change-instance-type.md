

# 实例类型更改的问题排查
<a name="troubleshoot-change-instance-type"></a>

使用以下信息可帮助您诊断和修复在更改实例类型时可能遇到的常见问题。

## 更改实例类型后，实例无法启动
<a name="troubleshoot-change-instance-type-no-start"></a>

**可能的原因：未满足新实例类型的要求**  
如果您的实例未启动，则可能是新实例类型的某一要求未满足。有关更多信息，请参阅[为什么我的 Linux 实例在更改其类型后无法启动？](https://repost.aws/knowledge-center/boot-error-linux-nitro-instance)

**可能的原因：AMI 不支持实例类型**  
若使用 EC2 控制台更改实例类型，则仅限所选 AMI 支持的实例类型可用。若使用 AWS CLI 启动实例，则可以指定不兼容的 AMI 和实例类型。如果 AMI 和实例类型不兼容，则实例无法启动。有关更多信息，请参阅 [更改实例类型的兼容性](resize-limitations.md)。

**可能的原因：实例位于集群置放群组中**  
如果您的实例位于[集群置放群组](placement-strategies.md#placement-groups-cluster)中，并且更改实例类型后实例无法启动，请尝试以下操作：  

1. 停止集群置放群组中的所有实例。

1. 更改受影响的实例的实例类型。

1. 启动集群置放群组中的所有实例。

## 更改实例类型后，无法从互联网访问应用程序或网站
<a name="troubleshoot-change-instance-type-ipv4"></a>

**可能的原因：公有 IPv4 地址被释放**  
更改实例类型时，您必须先停止该实例。停止实例时，我们会释放公有 IPv4 地址并向该实例提供一个新的公有 IPv4 地址。  
为了在实例停止和启动之间保留公有 IPv4 地址，我们建议您使用弹性 IP 地址。有关更多信息，请参阅 [弹性 IP 地址](elastic-ip-addresses-eip.md)。
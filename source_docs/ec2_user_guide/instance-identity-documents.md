

# Amazon EC2 实例的实例身份文档
<a name="instance-identity-documents"></a>

您启动的每个实例都有一个实例身份文档，用于提供有关实例自身的信息。您可以使用实例身份文档验证实例的属性。

实例身份文档在实例停止并启动、重新启动或启动时生成。您可以通过实例元数据服务（IMDS）访问实例的实例身份文档。有关说明，请参阅 [检索实例身份文档](retrieve-iid.md)。

实例身份文档使用纯文本 JSON 格式。其包含以下信息。


| 数据 | 说明 | 
| --- | --- | 
| accountId | 启动实例的 AWS 账户的 ID。 | 
| architecture | 启动实例所用 AMI 的架构 (i386 \| x86\_64 \| arm64)。 | 
| availabilityZone | 实例在其中运行的可用区的名称。例如 `us-east-1`。请记住，可用区名称可能因 AWS账户而异。 | 
| billingProducts | 实例的计费产品。 | 
| devpayProductCodes | 已淘汰。 | 
| imageId | 用于启动实例的 AMI 的 ID。 | 
| instanceId | 实例的 ID。 | 
| instanceType | 实例的实例类型。 | 
| kernelId | 与实例关联的内核的 ID（如果适用）。 | 
| marketplaceProductCodes | 用于启动实例的 AMI 的 AWS Marketplace 产品代码。 | 
| pendingTime | 启动实例的日期和时间。 | 
| privateIp | 实例的私有 IP 地址。对于仅限 IPv4 和双堆栈实例，此项包含 IPv4 地址。对于仅限 IPv6 实例，此项包含 IPv6 地址。 | 
| ramdiskId | 与实例关联的 RAM 磁盘的 ID（如果适用）。 | 
| region | 运行实例的区域。 | 
| version | 实例身份文档格式的版本。 | 
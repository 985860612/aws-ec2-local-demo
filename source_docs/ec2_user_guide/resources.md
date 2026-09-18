

# 管理 Amazon EC2 资源
<a name="resources"></a>

*资源*是可以使用的实体。Amazon EC2 会在您使用服务的功能时创建资源。例如，Amazon EC2 资源包括映像、实例、实例集、密钥对和安全组。所有 Amazon EC2 资源类型都包含可描述资源的属性，例如名称、描述、资源标识符和 Amazon 资源名称（ARN）。

Amazon EC2 资源取决于所在的 AWS 区域或可用区。例如，亚马逊机器映像（AMI）是特定于某个 AWS 区域，但从 AMI 启动的实例是特定于您启动该实例的区域。您可以使用 Amazon EC2 资源的 ARN 在权限策略中指定 Amazon EC2 资源。

您的 AWS 账户具有 Amazon EC2 的默认配额。这些配额定义了您可以创建的最大资源数量。例如，正在运行的实例中 vCPU 的最大数量有配额。如果启动实例或启动已停止的实例会导致您超出配额，则操作将失败。

您可以使用资源 ID 或标签按区域搜索 AWS 账户中的特定资源。要搜索多个区域中的特定资源或资源类型，请使用 Amazon EC2 全局视图。

**Topics**
+ [为您的 Amazon EC2 资源选择区域](using-regions-availability-zones-setup.md)
+ [查找 Amazon EC2 资源](Using_Filtering.md)
+ [使用 AWS 全局视图查看跨区域的资源](global-view.md)
+ [标记 Amazon EC2 资源](Using_Tags.md)
+ [Amazon EC2 Service Quotas](ec2-resource-limits.md)
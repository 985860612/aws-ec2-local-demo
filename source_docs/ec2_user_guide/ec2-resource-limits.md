

# Amazon EC2 Service Quotas
<a name="ec2-resource-limits"></a>

在创建 AWS 账户 时，我们会根据区域设置 AWS 资源的默认*限额*（也称为限制）。如果超出资源的限额，请求会失败。例如，在某一区域中，可为按需型实例预置的 Amazon EC2 vCPU 数量存在最大数量限制。如果尝试在某一区域中启动实例，但此请求会导致使用量超出限额，则请求会失败。如果发生这种情况，可以减少资源使用量或请求增加限额。

您可以通过服务配额控制台集中查看和管理 AWS 服务配额，以及请求提高所使用各种资源的限额。使用我们提供的限制信息来管理您的 AWS 基础设施。请根据需要请提前计划以请求提高限额。

**相关配额文档**
+ [Amazon EC2 端点和配额](https://docs.aws.amazon.com/general/latest/gr/ec2-service.html)
+ [Amazon EC2 实例类型配额](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-quotas.html)
+ [Amazon EBS 的配额](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-resource-quotas.html)
+ [Amazon VPC 配额](https://docs.aws.amazon.com/vpc/latest/userguide/amazon-vpc-limits.html)

## 查看当前限额
<a name="view-limits"></a>

您可以使用 服务配额控制台来查看您在每个区域的配额。

**使用服务配额控制台查看当前配额**

1. 访问 [https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/)，打开服务配额控制台。

1. 在导航栏（位于屏幕顶部）中，选择一个区域。

1. 在**管理配额**窗格上，选择一项服务；例如，**Amazon Elastic Compute Cloud（Amazon EC2）**。选择**查看配额**。

1. 使用筛选字段按资源名称筛选列表。例如，输入 **On-Demand** 即可查找按需型实例的限额。

1. 要查看更多信息，请选择限额名称以打开限额的详细信息页面。

## 请求提高
<a name="request-increase"></a>

您可以请求为每个区域提高限额。

**使用服务配额控制台请求提高限制**

1. 访问 [https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/)，打开服务配额控制台。

1. 在导航栏（位于屏幕顶部）中，选择一个区域。

1. 使用筛选字段按资源名称筛选列表。例如，输入 **On-Demand** 即可查找按需型实例的限额。

1. 如果限额可调，则选中该限额并选择**请求提高限额**。

1. 对于**更改限额值**，请输入新的限额值。

1. 选择**请求**。

1. 要在控制台中查看任何待处理或最近已解决的请求，请从导航窗格中选择**控制面板**。对于待处理的请求，请选择请求状态以打开收到的请求。请求的初始状态为 **Pending**。状态更改为**已请求限额**后，您将在 支持 中看到工单编号。选择案例编号以打开请求服务单。

有关更多信息，包括如何使用 AWS CLI 或 SDK 请求提高配额的信息，请参阅《服务配额用户指南》中的[请求增加配额](https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html)**。

## 对使用端口 25 发送的电子邮件的限制
<a name="port-25-throttle"></a>

默认情况下，Amazon EC2 仅允许通过端口 25 的出站流量指向私有 IPv4 地址。通过端口 25 指向公有 IPv4 地址和 IPv6 地址的流量会被阻止。

您可以请求删除此限制。有关更多信息，请参阅[如何删除 Amazon EC2 实例或 Lambda 函数的端口 25 的限制？](https://repost.aws/knowledge-center/ec2-port-25-throttle)

此限制不适用于通过端口 25 指向下列地址的出站流量：
+ 存在原始网络接口的 VPC 主 CIDR 数据块中的 IP 地址。
+ [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918)、[RFC 6598](https://datatracker.ietf.org/doc/html/rfc6598) 和 [ RFC 4193](https://datatracker.ietf.org/doc/html/rfc4193) 中定义的 CIDR 中的 IP 地址。


# Spot 实例配额
<a name="using-spot-limits"></a>

每个 AWS 账户 可在每个区域运行和待处理的竞价型实例数量存在限额。待处理竞价型实例请求完成后，该请求将不再计入限额，因为正在运行的实例将计入限额。

竞价型实例限额根据您正在运行的竞价型实例为了完成待处理的竞价型实例请求而正在使用或将会使用的*虚拟中央处理器（vCPU）数*进行管理。如果您终止了竞价型实例但未取消竞价型实例请求，则这些请求将会计入您的竞价型实例 vCPU 限额，直到 Amazon EC2 检测到竞价型实例已经终止并关闭请求为止。

我们为竞价型实例提供以下限额类型。


| 名称 | 默认值 | 可调整 | 
| --- | --- | --- | 
| 所有 DL 竞价型实例请求 | 0 | [可以](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-85EED4F7)。 | 
| 所有 F 竞价型实例请求 | 0 | [可以](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-88CF9481)。 | 
| 所有 G 和 VT 竞价型实例请求 | 0 | [可以](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-3819A6DF)。 | 
| 所有 Inf 竞价型实例请求 | 0 | [可以](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-B5D1601B)。 | 
| 所有 P 竞价型实例请求 | 0 | [可以](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-7212CCBC)。 | 
| 所有标准（A、C、D、H、I、M、R、T、Z）竞价型实例请求 | 5 | [可以](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-34B43A08)。 | 
| 所有 Trn 竞价型实例请求 | 0 | [可以](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-6B0D517C)。 | 
| 所有 X 竞价型实例请求 | 0 | [可以](https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-E3A00192)。 | 

尽管 Amazon EC2 会根据您的使用情况自动调整竞价型实例限额，您仍可以在必要时请求提高限额。例如，假设您计划启动超过当前限额允许数量的竞价型实例，则可以请求提高限额。如果您提交竞价型实例请求并收到 `Max spot instance count exceeded` 错误，则也可以请求提高限额。要请求提高限额，请根据 [Amazon EC2 Service Quotas](ec2-resource-limits.md) 中的描述使用服务限额控制台。

您可以启动任意实例类型组合以满足您不断变化的应用程序需求。例如，对于 256 个 vCPU 的全标准竞价型实例请求限额，您可以请求 32 个 `m5.2xlarge` 竞价型实例（32 x 8 vCPU）或 16 个 `c5.4xlarge` 竞价型实例（16 x 16 vCPU）。

借助 Amazon CloudWatch 指标集成，您可以根据限额监控 EC2 使用情况。您还可以配置警报以在即将达到限额时发出警告。有关更多信息，请参阅《服务限额用户指南》中的 [服务限额与 Amazon CloudWatch 警报](https://docs.aws.amazon.com/servicequotas/latest/userguide/configure-cloudwatch.html)**。
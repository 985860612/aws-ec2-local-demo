

# EC2 实例集和竞价型实例集的限额
<a name="fleet-quotas"></a>

对于每项 AWS 服务，您的 AWS 账户都具有默认配额（以前称为限制）。除非另有说明，否则，每个配额是区域特定的。

常用的 Amazon EC2 配额适用于由 EC2 实例集或竞价型实例集启动的实例，例如竞价型实例[限制](using-spot-limits.md)和[卷限制](volume_limits.md)。

此外，AWS 账户 存在以下与 EC2 实例集和竞价型实例集相关的限额：



| 配额描述 | 配额 | 
| --- | --- | 
| 每个区域中状态为 active、deleted\_running 和 cancelled\_running 的 maintain 和 request 类型 EC2 实例集和竞价型实例集的数量 | 1,000 ¹ ² ³ | 
| instant 类型 EC2 实例集的数量 | 无限制 | 
| maintain 和 request 类型 EC2 实例集和竞价型实例集的竞价型容量池数量（不重复的实例类型和子网组合） | 300¹ | 
| instant 类型 EC2 实例集的竞价型容量池数量（不重复的实例类型和子网组合） | 无限制 | 
| 启动规范中的用户数据大小 | 16 KB ² | 
| 每个 EC2 实例集或竞价型实例集的目标容量 | 10000 | 
| 使用 ReservedCapacityOptions 时每个 EC2 Fleet 请求的容量预留数量 | 5,000 ² | 
| 区域中所有 EC2 实例集和竞价型实例集的目标容量 | 100,000 ¹ | 
| EC2 队列请求或 Spot 队列请求不能跨区域。 |  | 
| EC2 队列请求或 Spot 队列请求不能跨同一可用区内的不同子网。 |  | 

¹ 这些限制同时适用于您的 EC2 实例集和竞价型实例集。

² 这些是硬配额。您不能请求提高这些限额。

³ 删除 EC2 实例集或取消竞价型实例集请求之后，如果您指定在您删除或取消请求时该实例集*不*应终止其竞价型实例，实例集请求将输入 `deleted_running`（EC2 实例集）或 `cancelled_running`（竞价型实例集）状态，并且实例将继续运行直至它们中断或您手动将其终止。如果终止这些实例，实例集请求将输入 `deleted_terminating`（EC2 实例集）或 `cancelled_terminating`（竞价型实例集）状态，并且不计入此配额。有关更多信息，请参阅[删除 EC2 实例集请求和实例集中的实例](delete-fleet.md)和[取消（删除）竞价型实例集请求](cancel-spot-fleet.md)。

## 请求增加目标容量配额
<a name="fleet-quota-increase-request"></a>

如果您需要的容量超出目标容量的默认配额，您可以在此请求增加配额。

**请求增加目标容量配额**

1. 打开 支持 Center 的 [Create case](https://console.aws.amazon.com/support/home#/case/create?issueType=service-limit-increase&limitType=service-code-ec2-fleet)（创建案例）表。

1. 选择**提高服务限制**。

1. 对于 **Limit type**（限制类型），选择 **EC2 Fleet**（EC2 实例集）。

1. 对于 **Region**（区域），选择请求增加配额的 AWS 区域。

1. 对于 **Limit**（限制），选择 **Target Fleet Capacity per Fleet (in units)**（每个实例集的目标实例集容量（单位））或 **Target Fleet Capacity per Region (in units)**（每个区域的目标实例集容量（单位）），具体取决于您要增加的配额。

1. 对于 **New limit value**（新增限制值），输入新的配额值。

1. 要请求增加其他配额，选择 **Add another request**（添加另一个请求），然后重复步骤 4-6。

1. 对于 **Use case description**（使用案例描述），输入请求增加配额的原因。

1. 在 **Contact options**（联系选项）下，指定您首选的联系语言和联系方式。

1. 选择**提交**。
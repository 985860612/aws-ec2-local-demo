

# 为 EC2 实例集或竞价型实例集设置支出限额
<a name="ec2-fleet-control-spending"></a>

您可以设置每小时愿意为 EC2 实例集或竞价型实例集支出的限额。在达到支出限额时，即使尚未达到目标容量，实例集也会停止启动实例。

按需型实例和竞价型实例有单独的支出限额。

**为 EC2 实例集中的按需型实例和竞价型实例配置支出限额**  
使用 [create-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-fleet.html) 命令和以下参数：
+ 若为按需型实例：在 `OnDemandOptions` 结构中，在 `MaxTotalPrice` 字段中指定支出限额。
+ 若为竞价型实例：在 `SpotOptions` 结构中，在 `MaxTotalPrice` 字段中指定支出限额。

**为竞价型实例集中的按需型实例和竞价型实例配置支出限额**  
Amazon EC2 控制台和 AWS CLI 都可用于配置支出限额。

（控制台）创建竞价型实例集时，请选中**设置 Spot 实例的最大成本**复选框，然后在**设置您的最大成本(每小时)**中输入一个值。有关更多信息，请参阅[使用已定义的参数创建竞价型实例集请求](create-spot-fleet.md#create-spot-fleet-advanced)中的步骤 6.e.。

（AWS CLI）使用 [request-spot-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-fleet.html) 命令和以下参数：
+ 若为按需型实例：在 `OnDemandMaxTotalPrice` 字段中指定支出限额。
+ 若为竞价型实例：在 `SpotMaxTotalPrice` 字段中指定支出限额。

## 示例
<a name="ec2-fleet-spending-limit-examples"></a>

以下示例显示了两个不同的方案。在第一个示例中，实例集在满足按需型实例的目标容量 (`OnDemandTargetCapacity`) 后停止启动按需型实例。在第二个示例中，实例集在达到每小时愿意为按需型实例支付的最高金额 (`MaxTotalPrice`) 时停止启动实例。

**示例：在达到目标容量时停止启动按需型实例**

假设发出 `m4.large` 按需型实例请求，其中：
+ 按需价格：每小时 0.10 美元
+ `OnDemandTargetCapacity`: 10
+ `MaxTotalPrice`：1.50 美元

实例集启动 10 个按需型实例，因为总费用 1.00 美元（10 个实例 x 0.10 美元）未超过实例的 `MaxTotalPrice` 1.50 美元。

**示例：在达到最高总费用时停止启动按需型实例**

假设发出 `m4.large` 按需型实例请求，其中：
+ 按需价格：每小时 0.10 美元
+ `OnDemandTargetCapacity`: 10
+ `MaxTotalPrice`：0.80 美元

如果实例集启动按需型目标容量（10 个按需型实例），则每小时的总成本为 1.00 美元。这超过了为按需型实例的 `MaxTotalPrice` 指定的金额（0.80 美元）。为了防止支出超过您愿意支付的金额，实例集仅启动 8 个按需型实例（低于按需型目标容量），因为启动更多实例将超过按需型实例的 `MaxTotalPrice`。

## 具爆发能力的实例
<a name="ec2-fleet-burstable-spot-instances"></a>

如果您使用[可突增性能的实例类型](burstable-performance-instances.md)启动您的竞价型实例，并打算立即并短时间使用可突增性能的竞价型实例，且没有空闲时间来积累 CPU 积分，建议您以[标准模式](burstable-performance-instances-standard-mode.md)启动实例，以避免支付更高的成本。如果您以[无限模式](burstable-performance-instances-unlimited-mode.md)启动可突增性能的竞价型实例并立即突增 CPU，您将会为突增花费超额积分。如果使用实例的时间很短，使得实例没有时间积累 CPU 积分来支付超额积分，则您将在终止实例时为超额积分付费。

仅当实例的运行时间较长，足以积累进行突增的 CPU 积分时，针对可突增性能的竞价型实例的无限模式才适用。否则，支付剩余积分会使可突增性能的竞价型实例比使用其他实例更加昂贵。有关更多信息，请参阅[何时使用无限模式与固定 CPU](burstable-performance-instances-unlimited-mode-concepts.md#when-to-use-unlimited-mode)。

通过提供足够的计算资源来配置实例，启动积分旨在为 T2 实例提供有成效的初始启动体验。不允许重复启动 T2 实例以访问新的启动积分。如果您需要持续的 CPU，您可以赚取积分（通过空转一段时间），将[无限模式](burstable-performance-instances-unlimited-mode.md)用于 T2竞价型实例，或将实例类型和专用 CPU 一起使用。
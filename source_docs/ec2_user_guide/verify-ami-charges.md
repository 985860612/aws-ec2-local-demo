

# 验证账单上的 AMI 费用
<a name="verify-ami-charges"></a>

为确保您不会产生计划外费用，您可以验证 AWS 成本和使用情况报告 (CUR) 中某个实例的账单信息和与您用于启动实例的 AMI 关联的账单信息匹配。

要验证账单信息，请在 CUR 中找到实例 ID 并检查 `[lineitem/Operation](https://docs.aws.amazon.com/cur/latest/userguide/Lineitem-columns.html#Lineitem-details-O-Operation)` 列中的相应值。该值应和与 AMI 关联的 **Usage operation** (使用情况操作) 的值相匹配。

例如，AMI `ami-0123456789EXAMPLE` 具有以下账单信息：
+ **Platform details** (平台详细信息) = `Red Hat Enterprise Linux`
+ **Usage operation** (使用情况操作) = `RunInstances:0010`

如果您使用此 AMI 启动了实例，您可以在 CUR 中找到实例 ID 并检查 `[lineitem/Operation](https://docs.aws.amazon.com/cur/latest/userguide/Lineitem-columns.html#Lineitem-details-O-Operation)` 列中的相应值。在这个例子中，值应该是 `RunInstances:0010`。
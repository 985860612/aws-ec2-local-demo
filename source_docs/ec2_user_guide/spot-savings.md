

# 通过购买竞价型实例实现节省
<a name="spot-savings"></a>

您可以在每个实例集级别或针对所有正在运行的竞价型实例，查看竞价型实例的用量和节省信息。在每个实例集级别，用量和节省信息包括该实例集启动和终止的所有实例。您可以查看过去一小时或过去三天的此信息。

来自 **Savings (节省成本)** 部分的以下屏幕截图显示了 Spot 实例集的 Spot 用量和节省信息。

![Spot Fleet details (Spot 实例集详细信息) 页面的 Savings (节省成本) 部分。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/spot-savings.png)


您可查看以下用量和节省信息：
+ **Spot Instances (竞价型实例)** –竞价型实例集启动和终止的竞价型实例数量。在查看节省摘要时，该数字表示您的所有正在运行的竞价型实例。
+ **vCPU-hours (vCPU 小时数)** – 在所选时间范围内所有竞价型实例使用的 vCPU 小时数。
+ **Mem(GiB)-hours (内存 (GiB) 小时数)** – 在所选时间范围内所有竞价型实例使用的 GiB 小时数。
+ **On-Demand total (按需总额)** – 您在将这些实例作为 按需型实例 启动后，在所选时间范围内支付的总额。
+ **Spot total (Spot 总额)** – 您在所选时间范围内支付的总额。
+ **Savings (节省)** – 您通过未支付按需价格而节省的百分比。
+ **Average cost per vCPU-hour (每 vCPU 小时的平均费用)** – 在所选时间范围内所有竞价型实例使用 vCPU 的平均小时费用，其计算方式如下：**每 vCPU 小时的平均费用** = **Spot 总额** / **vCPU 小时数**。
+ **Average cost per mem(GiB)-hour (每内存 (GiB) 小时的平均费用)** – 在所选时间范围内所有竞价型实例使用 GiB 的平均小时费用，其计算方式如下：**每内存 (GiB) 小时的平均费用** = **Spot 总额** / **内存 (GiB) 小时数**。
+ **Details (详细信息)** 表 – 构成 Spot 实例集的各种实例类型（每个实例类型的实例数括在圆括号中）。在查看节省摘要时，这些数字涵盖了您的所有正在运行的竞价型实例。

节省信息只能使用 Amazon EC2 控制台查看。

**注意**  
竞价型实例集仍在使用旧版 API，且暂无相关投资计划。建议改用 EC2 实例集或自动扩缩组。有关更多信息，请参阅 [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)。

**查看竞价型实例集的节省信息**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择 Spot 实例集请求的 ID，然后滚动到 **Savings (节省成本)** 部分。

   或者，选中竞价型实例集请求 ID 旁边的复选框，然后选择**节省成本**选项卡。

1. 默认情况下，该页面显示过去三天的用量和节省信息。您可以选择 **last hour (过去一小时)** 或 **last three days (过去三天)**。对于不到一小时之前启动的 Spot 实例集，该页面显示这一小时的预计节省。

**查看所有正在运行的竞价型实例的节省信息**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择 **Savings Summary (节省成本摘要)**。
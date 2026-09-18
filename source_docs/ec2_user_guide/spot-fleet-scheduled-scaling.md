

# 计划扩展：按计划扩展竞价型实例集
<a name="spot-fleet-scheduled-scaling"></a>

按计划扩展实例集使您可以按照可预测的需求变化来扩展应用程序。通过创建*计划操作*，您可以指示竞价型实例集在特定时间执行扩展活动。要创建计划的操作，您必须指定现有的竞价型实例集、必须发生扩展活动的时间以及所需的最小容量和最大容量。可以将计划操作配置为一次性或按定期计划进行扩展。如果需要更改，可以编辑或删除计划的操作。

**先决条件**
+ 只能为现有竞价型实例集创建计划操作。您不能在创建竞价型实例集时创建计划操作。
+ 竞价型实例集请求必须使用 `maintain` 作为请求类型。`request` 类型的请求不支持自动扩缩。
+ 配置 [竞价型实例集自动扩展所需的 IAM 权限](spot-fleet-auto-scaling-IAM.md)。
+ 查看[注意事项](spot-fleet-automatic-scaling.md#considerations-for-spot-fleet-automatic-scaling)。

**创建一次性计划操作**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择竞价型实例集请求。

1. 选择屏幕底部附近的**计划扩缩**选项卡。如果您选择了竞价型实例集的链接，则没有选项卡；而是向下滚动到**计划扩缩**部分。

1. 选择**创建计划操作**。

1. 对于 **Name (名称)**，请指定计划操作的名称。

1. 对于 **Minimum capacity (最小容量)** 和/或 **Maximum capacity (最大容量)**，输入所需的值。

1. 对于 **Recurrence (重复次数)**，选择 **Once (一次)**。

1. （可选）对于 **Start time (开始时间)** 和/或 **End time (结束时间)**，选择所需的日期和时间。

1. 选择**创建**。

**创建重复计划操作**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择竞价型实例集请求。

1. 选择屏幕底部附近的**计划扩缩**选项卡。如果您选择了竞价型实例集的链接，则没有选项卡；而是向下滚动到**计划扩缩**部分。

1. 对于 **Name (名称)**，请指定计划操作的名称。

1. 对于 **Minimum capacity (最小容量)** 和/或 **Maximum capacity (最大容量)**，输入所需的值。

1. 对于 **Recurrence**（重复次数），选择预定义计划之一（例如 **Every day**（每天）），或者选择 **Custom**（自定义）并输入 cron 表达式。有关计划扩展所支持的 cron 表达式的更多信息，请参阅《Amazon EventBridge User Guide》**中的 [Cron expressions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html#eb-cron-expressions)。

1. （可选）对于 **Start time (开始时间)** 和/或 **End time (结束时间)**，选择所需的日期和时间。

1. 选择 **Submit**。

**编辑计划操作**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择竞价型实例集请求。

1. 选择屏幕底部附近的**计划扩缩**选项卡。如果您选择了竞价型实例集的链接，则没有选项卡；而是向下滚动到**计划扩缩**部分。

1. 选择所需的计划操作，然后依次选择 **Actions (操作)** 和 **Edit (编辑)**。

1. 进行所需的更改，然后选择 **Submit (提交)**。

**删除计划操作**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，请选择 **Spot Requests**。

1. 选择竞价型实例集请求。

1. 选择屏幕底部附近的**计划扩缩**选项卡。如果您选择了竞价型实例集的链接，则没有选项卡；而是向下滚动到**计划扩缩**部分。

1. 选择所需的计划操作，然后依次选择 **Actions (操作)** 和 **Delete (删除)**。

1. 当系统提示进行确认时，选择 **Delete (删除)**。

**使用 AWS CLI 管理计划扩展**

使用以下命令：
+ [put-scheduled-action](https://docs.aws.amazon.com/cli/latest/reference/application-autoscaling/put-scheduled-action.html)
+ [describe-scheduled-actions](https://docs.aws.amazon.com/cli/latest/reference/application-autoscaling/describe-scheduled-actions.html)
+ [delete-scheduled-action](https://docs.aws.amazon.com/cli/latest/reference/application-autoscaling/delete-scheduled-action.html)
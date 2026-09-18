

# 管理计划停止或停用的 Amazon EC2 实例
<a name="schedevents_actions_retire"></a>

当 AWS 检测到您的实例的基础主机存在无法修复的故障时，它会计划停止或终止实例，这取决于实例的根卷类型。
+ 如果实例具有 Amazon EBS 根卷，则将计划停止实例。
+ 如果实例具有实例存储根卷，则将计划终止实例。

有关更多信息，请参阅 [实例指令引退](instance-retirement.md)。

**重要**  
实例停止、休眠或终止后，实例存储卷上存储的所有数据都会丢失。这包括附加到具有 EBS 根卷的实例的实例存储卷。在实例停止、休眠或终止之前，请务必保存实例存储卷中以后可能需要的数据。

## 您可以执行的操作
<a name="actions-you-can-take-for-scheduled-stop-or-retire-event"></a>

**可以对具有 EBS 根卷的实例执行的操作**

收到计划 `instance-stop` 事件通知时，您可以执行以下操作之一：
+ **等待计划停止：**您可等待实例在其计划维护时段内停止。
+ **执行手动停止并启动：**您也可在适合的时间自行停止并启动实例，这会将实例迁移至新的主机。这与重启实例不同。有关更多信息，请参阅 [启动和停止 Amazon EC2 实例](Stop_Start.md)。
+ **自动停止并启动：**您可以自动立即停止并启动以响应计划的 `instance-stop` 事件。有关更多信息，请参阅《*AWS Health 用户指南*》中的[自动在 EC2 实例上运行操作以响应 AWS Health 中的事件](https://docs.aws.amazon.com/health/latest/ug/automating-instance-actions.html)。

**可以对具有实例存储根卷的实例执行的操作**

收到计划 `system-retirement` 事件通知，并且您希望保留数据时，您可以执行以下操作之一：

1. 从最新的 AMI 启动替换实例。

1. 在实例按计划终止之前，将所有必需的数据迁移至替换实例。

1. 终止原始实例，或等待其按计划终止。

有关您可以执行的操作的更多信息，请参阅[实例指令引退](instance-retirement.md)。
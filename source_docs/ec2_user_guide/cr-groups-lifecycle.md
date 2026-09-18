

# 实例在组中的生命周期
<a name="cr-groups-lifecycle"></a>

当组中的容量预留更改状态时，其对正在运行的实例的影响取决于预留类型。

## 按需容量预留
<a name="cr-groups-lifecycle-odcr"></a>

当组中的按需容量预留被取消、到期或容量减少时，定位到该组的实例将与组中具有匹配属性（实例类型、平台、可用区和租户）和可用容量的其他任何按需容量预留进行匹配。如果该组中没有具有匹配属性和可用容量的按需容量预留，相关实例将会使用按需容量运行。如果您稍后向该组添加匹配的按需容量预留，Amazon EC2 会自动将实例移入其预留容量。

## 可中断容量预留
<a name="cr-groups-lifecycle-icr"></a>

当可中断容量预留的容量被回收时，实例将在终止前 2 分钟收到中断通知。有关更多信息，请参阅[中断体验](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/interruptible-capacity-reservations.html#interruption-experience)。

## 容量块
<a name="cr-groups-lifecycle-cb"></a>

在容量预留资源组的容量块中运行的实例将在容量块结束之前终止，您直接定位的容量块亦是如此。有关更多信息，请参阅 [Amazon EC2 容量块工作原理](capacity-blocks-how.md)。
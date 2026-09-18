

# Spot 请求的状态更改
<a name="spot-instances-request-status-lifecycle"></a>

以下图表显示您的 Spot 请求在其整个生命周期 (从提交到终止) 所遵循的路径。每个步骤用节点表示，每个节点状态代码描述您的 Spot 请求和竞价型实例的状态。

![竞价型实例请求的生命周期。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/spot-request-status-diagram.png)


**待评估**  
当您创建竞价型实例请求之后，除非一个或多个请求参数无效（`bad-parameters`），否则该请求就会进入 `pending-evaluation` 状态。


| 状态代码 | 请求状态 | 实例状态 | 
| --- | --- | --- | 
| pending-evaluation | open | 不适用 | 
| bad-parameters | closed | 不适用 | 

**暂停**  
如果一个或多个请求限制有效但目前无法满足，或者如果没有足够的容量，那么请求将进入暂挂状态，等待满足限制。请求选项影响请求完成的可能性。例如，如果没有容量可用，您的请求将会保持暂挂状态，直到有容量可用为止。如果您指定了可用区组，则该请求将保持为暂挂状态，直至满足可用区的限制。

如果其中一个可用区中断，则可能会影响其他可用区中可用于竞价型实例请求的备用 EC2 容量。


| 状态代码 | 请求状态 | 实例状态 | 
| --- | --- | --- | 
| capacity-not-available | open | 不适用 | 
| price-too-low | open | 不适用 | 
| not-scheduled-yet | open | 不适用 | 
| launch-group-constraint | open | 不适用 | 
| az-group-constraint | open | 不适用 | 
|  placement-group-constraint  |  open  | 不适用 | 
|  constraint-not-fulfillable  |  open  | 不适用 | 

**等待评估/最终执行**  
如果您创建的请求仅在特定时段内有效，但该时段在您的请求到达等待执行阶段之前过期，则您的竞价型实例请求可能会进入 `terminal` 状态。如果您取消请求，或者出现系统错误，请求也可能会进入该状态。


| 状态代码 | 请求状态 | 实例状态 | 
| --- | --- | --- | 
|  schedule-expired  |  cancelled  | 不适用 | 
|  canceled-before-fulfillment ¹  |  cancelled  | 不适用 | 
|  bad-parameters  |  failed  | 不适用 | 
|  system-error  |  closed  | 不适用 | 

¹ 如果您取消请求。

**等待履行**  
如果满足指定的限制（如有），您的 Spot 请求将会进入 `pending-fulfillment` 状态。

此时，Amazon EC2 已经准备好为您预置您请求的实例。如果该过程在此时停止，则可能是因为用户在启动竞价型实例之前取消了请求。也可能是因为出现了意外的系统错误。


| 状态代码 | 请求状态 | 实例状态 | 
| --- | --- | --- | 
|  pending-fulfillment  |  open  | 不适用 | 

**已完成**  
当您的竞价型实例的所有规范都得到满足时，您的竞价型实例就会执行。Amazon EC2 会启动竞价型实例，这可能需要几分钟的时间。如果竞价型实例在中断时休眠或停止，它将保持该状态，直到可以再次完成该请求或取消该请求。


| 状态代码 | 请求状态 | 实例状态 | 
| --- | --- | --- | 
|  fulfilled  |  active  |  pending → running  | 
|  fulfilled  |  active  |  stopped → running  | 

如果您停止竞价型实例，则 Spot 请求将进入 `marked-for-stop` 或 `instance-stopped-by-user` 状态，直到竞价型实例可以重新启动或者取消了请求。


| 状态代码 | 请求状态 | 实例状态 | 
| --- | --- | --- | 
|  marked-for-stop  | active |  stopping  | 
|  instance-stopped-by-user ¹  |  disabled 或 cancelled ²  |  stopped  | 

¹ 如果您停止实例或从实例运行 shutdown 命令，则竞价型实例将进入 `instance-stopped-by-user` 状态。停止实例后，您可以重新启动它。重新启动时，竞价型实例请求将返回 `pending-evaluation` 状态，然后 Amazon EC2 在满足约束时启动一个新的竞价型实例。

² 如果您停止竞价型实例但不取消请求，则 Spot 请求状态为 `disabled`。如果您的竞价型实例已停止并且请求已过期，则请求状态为 `cancelled`。

**执行的最终**  
只要实例类型具有可用的容量，并且您未终止竞价型实例，这些实例就会继续运行。如果 Amazon EC2 必须终止竞价型实例，竞价型请求将会进入终止状态。如果取消 Spot 请求或终止竞价型实例，请求也将进入终止状态。


| 状态代码 | 请求状态 | 实例状态 | 
| --- | --- | --- | 
|  request-canceled-and-instance-running  |  cancelled  |  running  | 
|  marked-for-stop  |  active  |  running  | 
|  marked-for-termination  |  active  |  running  | 
|  instance-stopped-by-price  |  disabled  |  stopped  | 
|  instance-stopped-by-user  |  disabled  |  stopped  | 
|  instance-stopped-no-capacity  |  disabled  |  stopped  | 
|  instance-terminated-by-price  |  closed（一次性），open（持久性）  |  terminated  | 
|  instance-terminated-by-schedule  |  closed  |  terminated  | 
|  instance-terminated-by-service  |  cancelled  |  terminated  | 
|  instance-terminated-by-user  |  closed 或 cancelled ¹  |  terminated  | 
|  instance-terminated-no-capacity  |  closed（一次性），open（持久性）  |  running †  | 
|  instance-terminated-no-capacity  |  closed（一次性），open（持久性）  |  terminated  | 
|  instance-terminated-launch-group-constraint  |  closed（一次性），open（持久性）  |  terminated  | 

¹ 如果您终止实例但未取消请求，则请求状态为 `closed`。如果您终止实例并取消请求，则请求状态为 `cancelled`。即使您在取消实例请求之前终止了竞价型实例，Amazon EC2 检测您的竞价型实例已终止的过程可能会有延迟。在这种情况下，请求状态可能是 `closed` 或 `cancelled`。

† Amazon EC2 中断竞价型实例时（如果其需要恢复容量*且*该实例配置为在中断时*终止*），状态将立即设置为 `instance-terminated-no-capacity`（如果未设置为 `marked-for-termination`）。但是，实例会保持 2 分钟 `running` 状态，以反映实例收到竞价型实例中断通知的 2 分钟时间段。2 分钟后，实例状态设置为 `terminated`。

**中断实验**  
您可以使用 AWS Fault Injection Service 启动竞价型实例中断，从而测试竞价型实例上的应用程序如何响应中断。如果 AWS FIS 停止竞价型实例，则竞价型实例请求会先进入 `marked-for-stop-by-experiment` 状态，然后进入 `instance-stopped-by-experiment` 状态。如果 AWS FIS 终止竞价型实例，则竞价型实例请求会进入 `instance-terminated-by-experiment` 状态。有关更多信息，请参阅 [启动竞价型实例中断](initiate-a-spot-instance-interruption.md)。


| 状态代码 | 请求状态 | 实例状态 | 
| --- | --- | --- | 
| marked-for-stop-by-experiment | active | running | 
| instance-stopped-by-experiment | disabled | stopped | 
| instance-terminated-by-experiment | closed | terminated | 

**持久性请求：**  
当您的竞价型实例终止（由您或由 Amazon EC2）时，如果 Spot 请求为持久性请求，则该请求返回 `pending-evaluation` 状态，并且在满足约束时，Amazon EC2 可以启动新的竞价型实例。
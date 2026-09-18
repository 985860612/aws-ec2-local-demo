

# Amazon EC2 实例的状态检查
<a name="monitoring-system-instance-status-check"></a>

通过状态检查，您可以快速确定是否存在可能阻止实例运行应用程序的问题。Amazon EC2 提供四种类型的状态检查：系统、实例、附加的 EBS 和应用程序。系统、实例和附加的 EBS 状态检查由 Amazon EC2 管理，并在每个实例上自动运行。应用程序状态检查是可选的，监控在实例上运行的应用程序的 HTTP 或 HTTPS 响应。您可以在 Amazon EC2 控制台、AWS CLI 或 AWS SDK 中查看所有状态检查的结果。

状态检查每分钟进行一次，会返回一个通过或失败状态。如果所有的检查都通过，则实例的整体状态是**OK**。如果有一个或多个检查故障，则整体状态为**受损**。系统、实例和附加的 EBS 状态检查由 Amazon EC2 管理，无法禁用或删除。应用程序状态检查是可选的；您可以自己创建、关联和管理它们。

当状态检查失败时，状态检查的相应 CloudWatch 指标将增加。有关更多信息，请参阅[状态检查指标](viewing_metrics_with_cloudwatch.md#status-check-metrics)。您可以使用这些指标创建基于状态检查结果触发的 CloudWatch 警报。例如，您可以创建一个警报来提醒您在一个指定实例上的状态检查中返回了故障状态。有关更多信息，请参阅[为未能通过状态检查的 Amazon EC2 实例创建 CloudWatch 警报](creating_status_check_alarms.md)。

您也可以创建 Amazon CloudWatch 警报，用于监控 Amazon EC2 实例并在实例由于潜在问题而受损时自动恢复实例。有关更多信息，请参阅[实例自动恢复](ec2-instance-recover.md)。

**Topics**
+ [状态检查类型](#types-of-instance-status-checks)
+ [查看 Amazon EC2 实例的状态检查](viewing_status.md)
+ [为未能通过状态检查的 Amazon EC2 实例创建 CloudWatch 警报](creating_status_check_alarms.md)

## 状态检查类型
<a name="types-of-instance-status-checks"></a>

状态检查有四种类型。
+ [系统状态检查](#system-status-checks)
+ [实例状态检查](#instance-status-checks)
+ [附加的 EBS 状态检查](#attached-ebs-status-checks)
+ [应用程序状态检查](#application-status-checks-summary)

### 系统状态检查
<a name="system-status-checks"></a>

系统状态检查监控您的实例在其上运行的 AWS 系统。这些检查会检测出需要 AWS 参与修复的深层实例问题。如果系统状态检查失败，您可以选择等待 AWS 修复问题，也可以自行解决问题。对于由 Amazon EBS 支持的实例，您也可自行停止和启动实例，在大多数情况下，这会导致实例被迁移至新的主机。对于由实例存储支持的实例（仅 Linux 实例支持），您可以终止并替换实例。请注意，实例存储卷是临时的，实例停止后所有数据都会丢失。

以下是可能导致系统状态检查失败的问题的示例：
+ 网络连接丢失
+ 系统电源损耗
+ 物理主机上的软件问题
+ 物理主机上影响到网络连接状态的硬件问题

如果未通过系统状态检查，我们会微增 [StatusCheckFailed\_System](viewing_metrics_with_cloudwatch.md#status-check-metrics) 指标。

**裸机实例**  
如果在裸机实例上重新启动，系统状态检查可能会暂时返回失败状态。当实例变为可用时，系统状态检查应返回通过状态。

### 实例状态检查
<a name="instance-status-checks"></a>

实例状态检查会监控各个实例的软件和网络连接情况。Amazon EC2 通过向网络接口 (NIC) 发送地址解析协议 (ARP) 请求，检查实例的运行状况。这些检查检测需要您参与修复的问题。如果实例状态检查失败，通常必须由您自行解决问题（例如，重启实例或更改实例配置）。

**注意**  
使用 `systemd-networkd` 进行网络配置的最新 Linux 发行版在报告运行状况检查时可能与早期发行版不同。在启动过程中，这种类型的网络可以更早地启动，并可能在其他启动任务之前完成，这些任务也可能会影响实例运行状况。依赖于网络可用性的状态检查可以在其他任务完成之前报告运行状况。

以下是可能导致实例状态检查失败的问题的示例：
+ 系统状态检查故障
+ 网络或启动配置不正确
+ 内存耗尽
+ 文件系统损坏
+ 内核不兼容
+ 在重启期间，在实例变得再次可用之前，实例状态检查都会报告失败。

如果未通过实例状态检查，我们会微增 [StatusCheckFailed\_Instance](viewing_metrics_with_cloudwatch.md#status-check-metrics) 指标。

**裸机实例**  
如果在裸机实例上重新启动，实例状态检查可能会暂时返回失败状态。当实例变为可用时，实例状态检查应返回通过状态。

### 附加的 EBS 状态检查
<a name="attached-ebs-status-checks"></a>

附加的 EBS 状态检查可监控附加到实例的 Amazon EBS 卷是否可以访问并能够完成 I/O 操作。如果附加到实例的一个或多个 EBS 卷无法完成 I/O 操作，`StatusCheckFailed_AttachedEBS` 指标是表示受损的二进制值。这些状态检查可检测计算或 Amazon EBS 基础设施的底层问题。当附加的 EBS 状态检查指标失败时，您可以等待 AWS 解决问题，也可以自行采取措施，例如更换受影响的卷或停止并重启实例。

以下是可能导致附加的 EBS 状态检查失败的问题的示例：
+ EBS 卷底层的存储子系统的硬件或软件问题
+ 物理主机上影响到 EBS 卷的可访问性的硬件问题
+ 实例和 EBS 卷之间的连接问题

您可以使用 `StatusCheckFailed_AttachedEBS` 指标来帮助提高工作负载的弹性。您可以使用此指标创建基于状态检查结果触发的 Amazon CloudWatch 告警。例如，当您检测到长时间影响时，可以故障转移到辅助实例或可用区。或者，您可以使用 EBS CloudWatch 指标监控每个附加的卷的 I/O 性能，以检测和替换受损的卷。如果 EBS 状态检查表明存在受损，并且工作负载不会驱动挂载到 EBS 卷的 I/O，则可以停止并启动该实例，进而将其转移到新的主机。这可以解决影响 EBS 卷可访问性的底层主机问题。有关更多信息，请参阅 [Amazon EBS 的 Amazon CloudWatch 指标](https://docs.aws.amazon.com/ebs/latest/userguide/using_cloudwatch_ebs.html)。

您还可以配置 Amazon EC2 Auto Scaling 组来检测附加 EBS 状态检查失败情况，然后用新的实例替换受影响的实例。有关更多信息，请参阅《Amazon EC2 Auto Scaling User Guide》**中的 [Monitor and replace Auto Scaling instances with impaired Amazon EBS volumes](https://docs.aws.amazon.com/autoscaling/ec2/userguide/monitor-and-replace-instances-with-impaired-ebs-volumes.html)。

**注意**  
附加的 EBS 状态检查指标仅适用于 Nitro 实例。

### 应用程序状态检查
<a name="application-status-checks-summary"></a>

使用应用程序状态检查来监控 Amazon EC2 实例上运行的应用程序的网络可访问性和可用性。通过应用程序状态检查，您可以监控应用程序级别的 HTTP 和 HTTPS 响应。应用程序状态检查仅在您关联的实例上运行。

您可以配置每个应用程序状态检查，使其请求应用程序端点上的 HTTP 路径，并定义指示正常响应的响应代码。

您可以在应用程序重启或部署期间抑制应用程序状态检查，以避免在预期停机期间出现误报故障。有关更多信息，请参阅 [处理部署、就地修补和替换](application-status-checks.md#asc-handling-deployment-and-patching)。

以下是可能导致应用程序状态检查失败的问题的示例：
+ 应用程序进程崩溃或停止响应
+ 应用程序返回 HTTP 响应代码，指示内部应用程序服务错误或其他问题
+ 应用程序端口无法访问
+ 软件或底层硬件问题导致实例失败并变得无响应

如果应用程序状态检查失败，我们将递增 `StatusCheckFailed_Application` 指标。

有关配置应用程序状态检查的信息，请参阅[应用程序状态检查](application-status-checks.md)。
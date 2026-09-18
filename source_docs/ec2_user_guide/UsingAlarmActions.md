

# 创建停止、终止、重启或恢复实例的警报
<a name="UsingAlarmActions"></a>

利用 Amazon CloudWatch 警报操作，您可创建自动停止、终止、重启或恢复实例的警报。当不再需要某个实例运行时，您可使用停止或终止操作来帮助您节省资金。如果发生了系统损害，您可使用重启和恢复操作自动重启这些实例或将它们恢复到新硬件上。

**注意**  
有关 Amazon CloudWatch 告警账单和成本信息，请参阅《Amazon CloudWatch 用户指南》中的 [CloudWatch 账单和成本](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_billing.html)。**

`AWSServiceRoleForCloudWatchEvents` 服务相关角色使 AWS 能够代表您执行警报操作。当您首次在 AWS 管理控制台、AWS CLI 或 IAM API 中创建告警时，CloudWatch 会为您创建服务相关角色。

在许多情况下，您可能需要自动终止或停止实例。例如，您可能拥有专用于批工资单处理作业或科学计算任务的实例，这些实例在运行一段时间后就完成了其工作。与其让这些实例空闲 (并产生费用)，不如将其停止或终止以节省开支。使用停止警报操作和使用终止警报操作的主要区别在于，停止的实例在以后需要再次运行时，可以轻松地启动，并且可以保留相同的实例 ID 和根卷，而终止的实例则无法再启动。如此就必须启动一个新的实例。停止或终止实例后，实例存储卷上的数据将丢失。

您可以向为 Amazon EC2 每个实例指标设置的任何警报添加停止、终止、重启或恢复操作，这些指标包括 Amazon CloudWatch 提供的基本和详细监控指标（在 `AWS/EC2` 命名空间中），以及包含 `InstanceId` 维度的任何自定义指标，只要其值引用有效运行的 Amazon EC2 实例。

**重要**  
如果缺少指标数据点，状态检查警报可能会暂时进入 `INSUFFICIENT_DATA` 状态。尽管很少见，但当指标报告系统出现中断时，即使实例运行正常，也会发生这种情况。我们建议您将 `INSUFFICIENT_DATA` 状态视为数据丢失而不是警报违例，尤其是在配置警报以停止、终止、重启或恢复实例时。

**控制台支持**  
可使用 Amazon EC2 控制台或 CloudWatch 控制台创建警报。本文档中的过程使用 Amazon EC2 控制台。有关使用 CloudWatch 控制台的过程，请参阅《Amazon CloudWatch 用户指南》**中的[创建停止、终止、重新启动或恢复实例的告警](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/UsingAlarmActions.html)。

**权限**  
您必须拥有 `iam:CreateServiceLinkedRole` 才能创建或修改执行 EC2 告警操作的告警。服务角色是由一项服务担任、代表您执行操作的 [IAM 角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)。IAM 管理员可以在 IAM 中创建、修改和删除服务角色。有关更多信息，请参阅《IAM 用户指南》**中的[创建向 AWS 服务 委派权限的角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html)。

**Topics**
+ [在 Amazon CloudWatch 警报中添加停止操作](#AddingStopActions)
+ [在 Amazon CloudWatch 警报中添加终止操作](#AddingTerminateActions)
+ [在 Amazon CloudWatch 警报中添加重启操作](#AddingRebootActions)
+ [在 Amazon CloudWatch 警报中添加恢复操作](#AddingRecoverActions)
+ [Amazon CloudWatch 警报操作场景](AlarmActionScenarios.md)

## 在 Amazon CloudWatch 警报中添加停止操作
<a name="AddingStopActions"></a>

可以创建当达到一定阈值后停止 Amazon EC2 实例的警报。例如，您可能运行了开发或测试实例而偶尔忘记将其关闭。可以创建当平均 CPU 使用率低于 10% 达 24 小时时触发的警报，同时告知其为空闲并不再使用。可以根据需要调整阈值、持续时间和周期，还可以添加 Amazon Simple Notification Service (Amazon SNS) 通知，以便在触发警报后，您能够收到电子邮件。

可以停止或终止将 Amazon EBS 卷用作根卷的实例，但只能终止将实例存储用作根卷的实例。停止或终止实例后，实例存储卷上的数据将丢失。

**创建停止空闲实例的警报（Amazon EC2 控制台）**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择所需实例，然后依次选择 **Actions**（操作）、**Monitor and troubleshoot**（监控和问题排查）、**Manage CloudWatch alarms**（管理 CloudWatch 警报）。

   或者，您可以在 **Alarm status**（警报状态）列中选择加号 (![Add icon](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/add-plus.png))。

1. 在 **Manage CloudWatch alarms**（管理 CloudWatch 警报）页面上，执行以下操作：

   1. 选择 **Create an alarm**（创建警报）。

   1. 要在警报触发时接收电子邮件，对于 **Alarm notification**（警报通知），选择现有的 Amazon SNS 主题。您首先需要使用 Amazon SNS 控制台创建 Amazon SNS 主题。有关更多信息，请参阅*Amazon Simple Notification Service 开发人员指南*中的[使用 Amazon SNS 进行应用程序对人 (A2P) 消息传送](https://docs.aws.amazon.com/sns/latest/dg/sns-user-notifications.html)。

   1. 开启 **Alarm action**（警报操作），然后选择 **Stop**（停止）。

   1. 对于 **Group samples by**（样本分组方式）和 **Type of data to sample**（要采样的数据类型），选择统计数据和指标。在此示例中，选择 **Average**（平均值）和 **CPU utilization**（CPU 利用率）。

   1. 对于 **Alarm When**（警报时间）和 **Percent**（百分比），请指定指标阈值。在此示例中，请指定 **<=** 和 **10**%。

   1. 对于 **Consecutive period**（连续周期）和 **Period**（周期），请指定警报的评估周期。在此示例中，将 **1** 个连续周期指定为 **5 分钟**。

   1. Amazon CloudWatch 自动为您创建警报名称。要更改名称，请在 **Alarm name**（警报名称）中输入新名称。警报名称必须仅包含 ASCII 字符。
**注意**  
可以在创建警报前根据自己的要求调整警报配置，也可以在之后编辑配置。这包括指标、阈值、时长、操作和通知等设置。但是，警报创建后其名称无法再次编辑。

   1. 选择**创建**。

## 在 Amazon CloudWatch 警报中添加终止操作
<a name="AddingTerminateActions"></a>

可以创建当达到一定阈值时自动终止 EC2 实例的警报 (只要该实例未启用终止保护)。例如，某个实例已经完成工作，您不再需要此实例而想将其终止。如果可能在之后使用该实例，则应该选择停止而不是终止。终止实例后，实例存储卷上的数据将丢失。有关为实例启用和禁用终止保护的信息，请参阅 [更改实例终止保护](Using_ChangingDisableAPITermination.md)。

**创建终止空闲实例的警报（Amazon EC2 控制台）**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择所需实例，然后依次选择 **Actions**（操作）、**Monitor and troubleshoot**（监控和问题排查）、**Manage CloudWatch alarms**（管理 CloudWatch 警报）。

   或者，您可以在 **Alarm status**（警报状态）列中选择加号 (![Add icon](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/add-plus.png))。

1. 在 **Manage CloudWatch alarms**（管理 CloudWatch 警报）页面上，执行以下操作：

   1. 选择 **Create an alarm**（创建警报）。

   1. 要在警报触发时接收电子邮件，对于 **Alarm notification**（警报通知），选择现有的 Amazon SNS 主题。您首先需要使用 Amazon SNS 控制台创建 Amazon SNS 主题。有关更多信息，请参阅*Amazon Simple Notification Service 开发人员指南*中的[使用 Amazon SNS 进行应用程序对人 (A2P) 消息传送](https://docs.aws.amazon.com/sns/latest/dg/sns-user-notifications.html)。

   1. 开启 **Alarm action**（警报操作），然后选择 **Terminate**（终止）。

   1. 对于 **Group samples by**（样本分组方式）和 **Type of data to sample**（要采样的数据类型），选择统计数据和指标。在此示例中，选择 **Average**（平均值）和 **CPU utilization**（CPU 利用率）。

   1. 对于 **Alarm When**（警报时间）和 **Percent**（百分比），请指定指标阈值。在此示例中，请指定 **=>** 和 **10**%。

   1. 对于 **Consecutive period**（连续周期）和 **Period**（周期），请指定警报的评估周期。在此示例中，将 **24** 个连续周期指定为 **1 小时**。

   1. Amazon CloudWatch 自动为您创建警报名称。要更改名称，请在 **Alarm name**（警报名称）中输入新名称。警报名称必须仅包含 ASCII 字符。
**注意**  
可以在创建警报前根据自己的要求调整警报配置，也可以在之后编辑配置。这包括指标、阈值、时长、操作和通知等设置。但是，警报创建后其名称无法再次编辑。

   1. 选择**创建**。

## 在 Amazon CloudWatch 警报中添加重启操作
<a name="AddingRebootActions"></a>

您可创建监控 Amazon EC2 实例并自动重启此实例的 Amazon CloudWatch 警报。在实例运行状况检查失败时，推荐重启警报操作（与恢复警报操作相反，该操作适合系统运行状况检查失败的情况）。实例重启相当于操作系统重启。在许多情况下，只需要几分钟时间即可重启您的实例。重启实例时，其仍驻留在相同的物理主机上，因此您的实例将保留其公有 DNS 名称、私有 IP 地址及其实例存储卷上的任何数据。

与停止并重新启动您的实例不同，重启实例不会启动新的实例计费周期（最低收取一分钟的费用）。重启实例后，实例存储卷上的数据会保留。重启后，必须将实例存储卷重新挂载到文件系统中。有关更多信息，请参阅 [重启 Amazon EC2 实例](ec2-instance-reboot.md)。

**重要**  
为了避免重启操作与恢复操作之间的竞争情况，请避免为重启警报和恢复警报设置相同的评估周期数。我们建议您将重启警报设置为 3 个 1 分钟的评估期。有关更多信息，请参阅 *Amazon CloudWatch 用户指南* 中的[评估警报](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation)。

**创建重启实例的警报（Amazon EC2 控制台）**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择所需实例，然后依次选择 **Actions**（操作）、**Monitor and troubleshoot**（监控和问题排查）、**Manage CloudWatch alarms**（管理 CloudWatch 警报）。

   或者，您可以在 **Alarm status**（警报状态）列中选择加号 (![Add icon](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/add-plus.png))。

1. 在 **Manage CloudWatch alarms**（管理 CloudWatch 警报）页面上，执行以下操作：

   1. 选择 **Create an alarm**（创建警报）。

   1. 要在警报触发时接收电子邮件，对于 **Alarm notification**（警报通知），选择现有的 Amazon SNS 主题。您首先需要使用 Amazon SNS 控制台创建 Amazon SNS 主题。有关更多信息，请参阅*Amazon Simple Notification Service 开发人员指南*中的[使用 Amazon SNS 进行应用程序对人 (A2P) 消息传送](https://docs.aws.amazon.com/sns/latest/dg/sns-user-notifications.html)。

   1. 开启 **Alarm action**（警报操作），然后选择 **Reboot**（重启）。

   1. 对于 **Group samples by**（样本分组方式）和 **Type of data to sample**（要采样的数据类型），选择统计数据和指标。在此示例中，选择 **Average**（平均值）和 **Status check failed: instance**（状态检查失败：实例）。

   1. 对于 **Consecutive period**（连续周期）和 **Period**（周期），请指定警报的评估周期。在此示例中，输入 **3** 个 **1 分钟**的连续周期。如果**禁用 1 分钟**，则必须[启用详细监控](manage-detailed-monitoring.md#enable-detailed-monitoring)，您也可以选择 **5 分钟**。

   1. Amazon CloudWatch 自动为您创建警报名称。要更改名称，请在 **Alarm name**（警报名称）中输入新名称。警报名称必须仅包含 ASCII 字符。

   1. 选择**创建**。

## 在 Amazon CloudWatch 警报中添加恢复操作
<a name="AddingRecoverActions"></a>

您可以创建 Amazon CloudWatch 警报来监控 Amazon EC2 实例。如果实例因需要 AWS 参与才能修复的基础硬件故障或问题而受损，您可自动恢复实例。无法恢复终止的实例。恢复的实例与原始实例相同，包括实例 ID、私有 IP 地址、弹性 IP 地址以及所有实例元数据。

CloudWatch 会阻止您将恢复操作添加到位于不支持恢复操作的实例上的警报。

当 `StatusCheckFailed_System` 警报触发且恢复操作启动时，您在创建警报及相关恢复操作时所选择的 Amazon SNS 主题将向您发出通知。在实例恢复过程中，实例将在重启时迁移，并且内存中的所有数据都将丢失。当该过程完成后，会向您已配置警报的 SNS 主题发布信息。任何订阅此 SNS 主题的用户都将收到一封电子邮件通知，其中包括恢复尝试的状态以及任何进一步的指示。您将注意到，实例会在已恢复的实例上重启。

**注意**  
恢复操作仅适用于 `StatusCheckFailed_System`，而不能用于 `StatusCheckFailed_Instance`。

下列问题可能导致系统状态检查失败：
+ 网络连接丢失
+ 系统电源损耗
+ 物理主机上的软件问题
+ 物理主机上影响到网络连接状态的硬件问题

仅具有以下特性的实例支持恢复操作。有关更多信息，请参阅 [实例自动恢复](ec2-instance-recover.md)。

如果您的实例具有公有 IP 地址，它会在恢复后保留公有 IP 地址。

**重要**  
为了避免重启操作与恢复操作之间的竞争情况，请避免为重启警报和恢复警报设置相同的评估周期数。我们建议您将恢复警报设置为 2 个 1 分钟的评估期。有关更多信息，请参阅 *Amazon CloudWatch 用户指南* 中的[评估警报](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation)。

**创建恢复实例的警报（Amazon EC2 控制台）**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择所需实例，然后依次选择 **Actions**（操作）、**Monitor and troubleshoot**（监控和问题排查）、**Manage CloudWatch alarms**（管理 CloudWatch 警报）。

   或者，您可以在 **Alarm status**（警报状态）列中选择加号 (![Add icon](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/add-plus.png))。

1. 在 **Manage CloudWatch alarms**（管理 CloudWatch 警报）页面上，执行以下操作：

   1. 选择 **Create an alarm**（创建警报）。

   1. 要在警报触发时接收电子邮件，对于 **Alarm notification**（警报通知），选择现有的 Amazon SNS 主题。您首先需要使用 Amazon SNS 控制台创建 Amazon SNS 主题。有关更多信息，请参阅*Amazon Simple Notification Service 开发人员指南*中的[使用 Amazon SNS 进行应用程序对人 (A2P) 消息传送](https://docs.aws.amazon.com/sns/latest/dg/sns-user-notifications.html)。
**注意**  
用户必须订阅指定的 SNS 主题才能在触发警报时收到电子邮件通知。执行实例自动恢复操作时，AWS 账户根用户 始终会收到电子邮件通知，即使未指定 SNS 主题或者根用户未订阅指定 SNS 主题也是如此。

   1. 开启 **Alarm action**（警报操作），然后选择 **Recover**（恢复）。

   1. 对于 **Group samples by**（样本分组方式）和 **Type of data to sample**（要采样的数据类型），选择统计数据和指标。在此示例中，选择 **Average**（平均值）和 **Status check failed: system**（状态检查失败：系统）。

   1. 对于 **Consecutive period**（连续周期）和 **Period**（周期），请指定警报的评估周期。在此示例中，输入 **2** 个 **1 分钟**的连续周期。如果**禁用 1 分钟**，则必须[启用详细监控](manage-detailed-monitoring.md#enable-detailed-monitoring)，您也可以选择 **5 分钟**。

   1. Amazon CloudWatch 自动为您创建警报名称。要更改名称，请在 **Alarm name**（警报名称）中输入新名称。警报名称必须仅包含 ASCII 字符。

   1. 选择**创建**。
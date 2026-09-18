

# Amazon EC2 专属主机恢复功能的工作原理
<a name="dedicated-hosts-recovery-basics"></a>

专属主机和主机资源组恢复程序使用主机级运行状况检查以评估专属主机可用性，以及检测基本系统故障。专属主机故障的类型决定了专属主机能否自动恢复。可能导致主机级运行状况检查失败的问题示例包括：
+ 网络连接丢失
+ 系统电源损耗
+ 物理主机上的硬件或软件问题

**重要**  
主机计划停用后，专属主机将无法自动恢复。

## 专属主机自动恢复
<a name="dedicated-hosts-recovery-basics-auto-recovery"></a>

在专属主机上检测到系统电源或网络连接故障时，将启动专属主机自动恢复，并且 Amazon EC2 **自动在与原始专属主机相同的可用区中分配一个替换专属主机**。替换专属主机收到新的主机 ID，但保留与原始专属主机相同的属性，包括：
+ 可用区
+ 实例类型
+ 标签
+ 自动置放设置
+ 预留

在分配替换专属主机时，**实例将恢复到替换专属主机上**。恢复的实例保留与原始实例相同的属性，包括：
+ 实例 ID
+ 私有 IP 地址
+ 弹性 IP 地址
+ EBS 卷附加
+ 所有实例元数据

此外，与 AWS License Manager 的内置集成自动跟踪和管理您的许可证。

**注意**  
仅在提供了 AWS License Manager 的区域中支持 AWS License Manager 集成。

如果实例与受损专属主机之间具有主机关联关系，恢复的实例将与替换专属主机建立主机关联。

在所有实例已恢复到替换专属主机时，**将释放受损专属主机**并且替换专属主机变为可用。

在启动了主机恢复时，将通过电子邮件和 AWS 事件通知 AWS Health Dashboard 账户所有者。在成功完成主机恢复后，将发送第二个通知。

如果使用 AWS License Manager 跟踪您的许可证，AWS License Manager 根据许可证配置限制为替换专属主机分配新的许可证。如果由于主机恢复而违反许可证配置的硬限制，则不允许执行恢复过程，并通过 Amazon SNS 通知向您通知主机恢复失败（如果已经为 AWS License Manager 配置了通知设置）。如果由于主机恢复而违反许可证配置的软限制，则允许继续执行恢复，并通过 Amazon SNS 通知向您通知违反了限制。有关更多信息，请参阅 *AWS License Manager 用户指南*中的[使用许可证配置](https://docs.aws.amazon.com/license-manager/latest/userguide/license-configurations.html)和 [License Manager 中的设置](https://docs.aws.amazon.com/license-manager/latest/userguide/settings.html)。

## 主机恢复状态
<a name="dedicated-hosts-recovery-states"></a>

当检测到专属主机故障时，受损专属主机将进入 `under-assessment` 状态，并且所有实例会进入 `impaired` 状态。在处于 `under-assessment` 状态时，您无法在受损的专属主机上启动实例。

在分配替换专属主机后，它进入 `pending` 状态。它保持该状态，直到主机恢复过程完成。在处于 `pending` 状态时，您无法在替换专属主机上启动实例。在恢复过程中，在替换专属主机上恢复的实例保持 `impaired` 状态。

在主机恢复完成后，替换专属主机进入 `available` 状态，并且恢复的实例恢复为 `running` 状态。在进入 `available` 状态后，您可以在替换专属主机上启动实例。将永久释放原始受损专属主机，并且它进入 `released-permanent-failure` 状态。

如果受损专属主机具有不支持主机恢复的实例（例如，具有实例存储根卷的实例），则不会释放该专属主机。相反，它标记为停用并进入 `permanent-failure` 状态。

## 专属主机无法自动恢复的场景
<a name="dedicated-hosts-recovery-basics-non-auto"></a>

**主机计划停用后，专属主机将无法自动恢复**。您将在 AWS Health Dashboard 中收到停用通知、Amazon CloudWatch 活动以及 AWS 账户所有者的电子邮件地址会收到有关专属主机故障的消息。在指定的时间段内，按照停用通知中所述的纠正步骤手动恢复停用主机上的实例。

**停止的实例不会恢复**到替换专属主机上。如果您尝试启动将受损专属主机作为目标的停止实例，实例启动将失败。我们建议您修改停止的实例以将不同的专属主机作为目标，或者在任何可用的专属主机上启动并启用匹配的配置和自动置放。

**具有实例存储的实例不会恢复**到替换专属主机上。作为一项纠正措施，将受损专属主机标记为停用，并且您在主机恢复完成后收到停用通知。在指定的时间段内，按照停用通知中所述的纠正步骤手动恢复受损专属主机上的其余实例。
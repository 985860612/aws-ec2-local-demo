

# 在 EC2 实例上配置基于 CloudWatch 操作的恢复
<a name="cloudwatch-recovery"></a>

**重要**  
本节旨在介绍如何在 EC2 实例上主动配置恢复机制。这些恢复机制专门用于在 AWS 检测到导致系统状态检查失败的底层硬件或软件问题时恢复实例可用性。如果目前存在实例访问问题，请参阅 [EC2 实例问题排查](ec2-instance-troubleshoot.md)。

如果 AWS 检测到某个实例因底层硬件或软件问题而无法使用，*基于 CloudWatch 操作的恢复*可以将该实例从存在底层问题的主机转移到其他主机，从而自动恢复实例的可用性。

如果进行了基于 CloudWatch 操作的恢复，AWS 会根据结果向 AWS Health Dashboard 发送以下某个事件：
+ 成功事件：`AWS_EC2_INSTANCE_AUTO_RECOVERY_SUCCESS`
+ 失败事件：`AWS_EC2_INSTANCE_AUTO_RECOVERY_FAILURE`

您可以配置基于 CloudWatch 操作的恢复机制，将恢复操作添加到 Amazon CloudWatch 警报中。CloudWatch 基于操作的恢复与 `StatusCheckFailed_System` 指标结合使用。CloudWatch 基于操作的恢复可提供分钟级恢复响应时间粒度，以及有关恢复操作和结果的 Amazon Simple Notification Service（Amazon SNS）通知。与简化的自动恢复相比，这些配置选项可以更精细地控制系统状态检查失败事件响应，从而更快地尝试恢复。有关可用 CloudWatch 选项的更多信息，请参阅[实例的状态检查](monitoring-system-instance-status-check.md)。

不过，只有当实例处于 `running` 状态，AWS Health Dashboard 中未列出任何服务事件，且该实例类型有可用容量时，基于 CloudWatch 操作的恢复机制才能发挥作用。在某些情况下，例如出现严重中断问题，容量限制可能会导致恢复失败。有关更多信息，请参阅 [排查基于 CloudWatch 操作的恢复失败问题](#ec2-instance-recover-cloudwatch-troubleshooting)。

**警告**  
在 AWS 因底层硬件或软件问题而恢复实例后，须注意以下后果：存储在易失性存储器（RAM）和实例存储卷中的数据会丢失，操作系统的正常运行时间会从零开始计算。为协助防止数据丢失，我们建议您定期创建宝贵数据的备份。有关 EC2 实例备份和恢复最佳实践的更多信息，请参阅 [Amazon EC2 最佳实践](ec2-best-practices.md)。  
实例自动恢复机制是为*单个实例*设计的。有关构建弹性*系统*的指导，请参阅[构建弹性系统](ec2-instance-recover.md#instance-recovery-build-a-resilient-system)。

**Topics**
+ [启用基于 CloudWatch 操作的恢复的要求](#requirements-for-cloudwatch-action-based-recovery)
+ [配置 CloudWatch 基于操作的恢复](#ec2-instance-recover-cloudwatch-configure)
+ [排查基于 CloudWatch 操作的恢复失败问题](#ec2-instance-recover-cloudwatch-troubleshooting)

## 启用基于 CloudWatch 操作的恢复的要求
<a name="requirements-for-cloudwatch-action-based-recovery"></a>

只有满足以下条件的实例，才可以启用基于 CloudWatch 操作的恢复：

**实例类型**  
+ **通用型：**A1、M3、M4、M5、M5a、M5n、M5zn、M6a、M6g、M6i、M6in、M7a、M7g、M7i、M7i-flex、M8a、M8azn、M8g、M8gb、M8gn、M8i、M8i-flex、M8in、M8ine、M8ib、M9g、T1、T2、T3、T3a、T4g
+ **计算优化型：**C3、C4、C5、C5a、C5n、C6a、C6g、C6gn、C6i、C6in、C7a、C7g、C7gn、C7i、C7i-flex、C8a、C8g、C8gb、C8gn、C8i、C8i-flex、C8in、C8ine、C8ib、C9g
+ **内存优化型：**R3、R4、R5、R5a、R5b、R5n、R6a、R6g、R6i、R6in、R7a、R7g、R7i、R7iz、R8a、R8g、R8gb、R8gn、R8i、R8i-flex、R8in、R8ib、R9g、U-3tb1、U-6tb1、U-9tb1、U-12tb1、U-18tb1、U-24tb1、U7i-6tb、U7i-8tb、U7i-12tb、U7in-16tb、U7in-24tb、U7in-32tb、U7inh-32tb、X1、X1e、X2idn、X2iedn、X2iezn、X8g、X8i 
+ **加速计算型：**G3、G5g、Inf1、P3、VT1
+ **高性能计算：**Hpc6a、Hpc7a、Hpc7g、Hpc8a
+ **裸机实例：**具有裸机实例大小的任何上述实例类型。
+ **如果在启动时添加了实例存储卷：**则仅支持以下实例类型：M3、C3、R3、X1、X1e、X2idn、X2iedn 

**租赁**  
+ 共享
+ 专用实例
有关更多信息，请参阅 [Amazon EC2 专用实例](dedicated-instance.md)。

**限制**

如果实例存在以下特性，则不支持基于 CloudWatch 操作的恢复机制：
+ 租赁：专属主机。对专属主机使用[专属主机自动恢复](dedicated-hosts-recovery.md)
+ 网络：使用 Elastic Fabric Adapter 的实例
+ 自动扩缩：属于自动扩缩组的实例
+ 维护：当前正在进行定期维护事件的实例

### 查找受支持的实例类型
<a name="cloudwatch-recovery-find-instance-types"></a>

您可以查看支持基于 CloudWatch 操作的恢复功能的实例类型。

------
#### [ Console ]

**查看支持基于 CloudWatch 操作的恢复的实例类型**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Instance Types**（实例类型）。

1. 在筛选条件栏中，添加筛选条件**自动恢复支持 = true**。**实例类型**表显示了支持基于 Amazon CloudWatch 操作的恢复的所有实例类型。

1. （可选）添加筛选条件以进一步筛选相关的特定实例类型。

------
#### [ AWS CLI ]

**查看支持基于 CloudWatch 操作的恢复的实例类型**  
使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令和 `auto-recovery-supported` 筛选条件。

```
aws ec2 describe-instance-types \
    --filters Name=auto-recovery-supported,Values=true \
    --query "InstanceTypes[*].[InstanceType]" \
    --output text | sort
```

------
#### [ PowerShell ]

**查看支持基于 CloudWatch 操作的恢复的实例类型**  
使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) cmdlet 和 `auto-recovery-supported` 筛选条件。

```
Get-EC2InstanceType `
    -Filter @{Name="auto-recovery-supported";Values="true"} | `
    Select InstanceType | Sort-Object InstanceType
```

------

## 配置 CloudWatch 基于操作的恢复
<a name="ec2-instance-recover-cloudwatch-configure"></a>

要为 EC2 实例配置基于 CloudWatch 操作的恢复，请创建 CloudWatch 警报来监控指定实例的 `StatusCheckFailed_System` 指标。设置指标值为 **1** 时触发警报，表示系统状态检查失败。配置警报操作，在警报触发时自动恢复实例。

您可以使用 Amazon EC2 控制台或 CloudWatch 控制台配置警报。如需有关说明，请参阅本用户指南中的[在 Amazon CloudWatch 警报中添加恢复操作](UsingAlarmActions.md#AddingRecoverActions)，或者《Amazon CloudWatch 用户指南》**中的[在 Amazon CloudWatch 警报中添加恢复操作](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/UsingAlarmActions.html#AddingRecoverActions)。

## 排查基于 CloudWatch 操作的恢复失败问题
<a name="ec2-instance-recover-cloudwatch-troubleshooting"></a>

如果基于 CloudWatch 操作的恢复机制无法恢复实例，考虑是否存在以下问题：
+ AWS 服务事件正在运行

  CloudWatch 基于操作的恢复在 AWS Health Dashboard 中的服务事件期间不起作用。您可能不会收到此类事件的恢复失败通知。要了解最新的服务可用性信息，请参阅[服务运行](https://health.aws.amazon.com/health/status)状况页面。
+ 容量不足

  暂无足够的替换硬件来迁移实例。
+ 已达到每日恢复尝试次数上限

  该实例已达到每天的恢复尝试操作限制。如果自动恢复失败，并且确定硬件性能下降是初始系统状态检查失败的根本原因，实例随后可能会被停用。

如果尽管多次尝试恢复，但实例的系统状态检查失败仍然存在，请参阅[对状态检查失败的实例进行故障排除](TroubleshootingInstances.md)以获取更多指导。
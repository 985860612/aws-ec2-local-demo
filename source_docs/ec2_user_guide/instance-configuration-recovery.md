

# 在 Amazon EC2 实例上配置简化的自动恢复
<a name="instance-configuration-recovery"></a>

**重要**  
本节旨在介绍如何在 EC2 实例上主动配置恢复机制。这些恢复机制专门用于在 AWS 检测到导致系统状态检查失败的底层硬件或软件问题时恢复实例可用性。如果目前存在实例访问问题，请参阅 [EC2 实例问题排查](ec2-instance-troubleshoot.md)。

如果 AWS 检测到某个实例因底层硬件或软件问题而无法使用，*简化的自动恢复*可以将该实例从存在底层问题的主机转移到其他主机，从而自动恢复实例的可用性。

如果进行了简化的自动恢复，AWS 会根据结果向 AWS Health Dashboard 发送以下某个事件：
+ 成功事件：`AWS_EC2_SIMPLIFIED_AUTO_RECOVERY_SUCCESS`
+ 失败事件：`AWS_EC2_SIMPLIFIED_AUTO_RECOVERY_FAILURE`

要接收这些事件的通知，可以配置通知选项。有关更多信息，请参阅《AWS 用户通知服务 User Guide》**中的 [Creating your first notification configuration in AWS 用户通知服务](https://docs.aws.amazon.com/notifications/latest/userguide/getting-started.html)。您还可以使用 [Amazon EventBridge 规则](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html)来监控简化的自动恢复事件。

启动实例期间，默认在所有支持的实例上启用简化的自动恢复。不过，只有当实例处于 `running` 状态，AWS Health Dashboard 中未列出任何服务事件，且该实例类型有可用容量时，该机制才能发挥作用。在某些情况下，例如出现严重中断问题，容量限制可能会导致恢复失败。有关更多信息，请参阅 [排查简化的自动恢复失败问题](#ec2-instance-recover-simplified-auto-recovery-troubleshooting)。

可以在启动期间或启动后禁用简化的自动恢复，再在之后需要时重新启用。

**警告**  
在 AWS 因底层硬件或软件问题而恢复实例后，须注意以下后果：存储在易失性存储器（RAM）中的数据会丢失，操作系统的正常运行时间会从零开始计算。为协助防止数据丢失，我们建议您定期创建宝贵数据的备份。有关 EC2 实例备份和恢复最佳实践的更多信息，请参阅 [Amazon EC2 最佳实践](ec2-best-practices.md)。  
实例自动恢复机制是为*单个实例*设计的。有关构建弹性*系统*的指导，请参阅[构建弹性系统](ec2-instance-recover.md#instance-recovery-build-a-resilient-system)。

**Topics**
+ [启用简化的自动恢复的要求](#requirements-for-simplified-automatic-recovery)
+ [配置简化的自动恢复](#set-recovery-behavior)
+ [排查简化的自动恢复失败问题](#ec2-instance-recover-simplified-auto-recovery-troubleshooting)

## 启用简化的自动恢复的要求
<a name="requirements-for-simplified-automatic-recovery"></a>

只有满足以下条件的实例，才可以启用简化的自动恢复：

**实例类型**  
+ **通用型：**A1、M3、M4、M5、M5a、M5n、M5zn、M6a、M6g、M6i、M6in、M7a、M7g、M7i、M7i-flex、M8a、M8azn、M8g、M8gb、M8gn、M8i、M8i-flex、M8in、M8ine、M8ib、M9g、T1、T2、T3、T3a、T4g
+ **计算优化型：**C3、C4、C5、C5a、C5n、C6a、C6g、C6gn、C6i、C6in、C7a、C7g、C7gn、C7i、C7i-flex、C8a、C8g、C8gb、C8gn、C8i、C8i-flex、C8in、C8ine、C8ib、C9g
+ **内存优化型：**R3、R4、R5、R5a、R5b、R5n、R6a、R6g、R6i、R6in、R7a、R7g、R7i、R7iz、R8a、R8g、R8gb、R8gn、R8i、R8i-flex、R8in、R8ib、R9g、U-3tb1、U-6tb1、U-9tb1、U-12tb1、U-18tb1、U-24tb1、U7i-6tb、U7i-8tb、U7i-12tb、U7in-16tb、U7in-24tb、U7in-32tb、U7inh-32tb、X1、X1e、X2iezn、X8g、X8i 
+ **加速计算型：**G3、G5g、Inf1、P3、VT1
+ **高性能计算：**Hpc6a、Hpc7a、Hpc7g、Hpc8a

**租赁**  
+ 共享
+ 专用实例
有关更多信息，请参阅 [Amazon EC2 专用实例](dedicated-instance.md)。

**限制**

如果实例存在以下特性，则不支持简化的自动恢复机制：
+ 实例大小：`metal` 实例
+ 租赁：专属主机。对专属主机使用[专属主机自动恢复](dedicated-hosts-recovery.md)
+ 存储：具有实例存储卷的实例
+ 网络：使用 Elastic Fabric Adapter 的实例
+ 自动扩缩：属于自动扩缩组的实例
+ 维护：当前正在进行定期维护事件的实例

## 配置简化的自动恢复
<a name="set-recovery-behavior"></a>

启动支持的实例时，默认情况下会启用简化的自动恢复。启动实例期间或之后，您可以将自动恢复行为设置为 `disabled`。

`default` 配置不能为不受支持的实例启用简化的自动恢复。

------
#### [ Console ]

**在启动时禁用简化自动恢复**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances**（实例），然后选择 **Launch instance**（启动实例）。

1. 在**高级详细信息**部分，在**实例自动恢复**字段中选择**禁用**。

1. 根据需要配置剩余的实例启动设置，然后启动实例。

**在启动后禁用简化自动恢复**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 请选择实例，然后依次选择 **Actions**（操作）、**Instance settings**（实例设置）、**Change auto-recovery behavior**（更改自动恢复行为）。

1. 选择 **Off**（关闭），然后选择 **Save（保存）**。

**在启动后启用简化自动恢复**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 请选择实例，然后依次选择 **Actions**（操作）、**Instance settings**（实例设置）、**Change auto-recovery behavior**（更改自动恢复行为）。

1. 选择**默认（开启）**，然后选择**保存**。

------
#### [ AWS CLI ]

**在启动时禁用简化自动恢复**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instance.html) 命令和 `--maintenance-options` 选项。

```
--maintenance-options AutoRecovery=Disabled
```

**在启动后禁用简化自动恢复**  
使用 [modify-instance-maintenance-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-maintenance-options.html) 命令。

```
aws ec2 modify-instance-maintenance-options \
    --instance-id {{i-1234567890abcdef0}} \
    --auto-recovery disabled
```

**在启动后启用简化自动恢复**  
使用 [modify-instance-maintenance-options](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-maintenance-options.html) 命令。

```
aws ec2 modify-instance-maintenance-options \
    --instance-id {{i-1234567890abcdef0}} \
    --auto-recovery default
```

------
#### [ PowerShell ]

**在启动时禁用简化自动恢复**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet。

```
-MaintenanceOptions_AutoRecovery Disabled
```

**在启动后禁用简化自动恢复**  
使用 [Edit-EC2InstanceMaintenanceOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMaintenanceOption.html) cmdlet。

```
Edit-EC2InstanceMaintenanceOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -AutoRecovery Disabled
```

**在启动后启用简化自动恢复**  
使用 [Edit-EC2InstanceMaintenanceOption](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceMaintenanceOption.html) cmdlet。

```
Edit-EC2InstanceMaintenanceOption `
    -InstanceId {{i-1234567890abcdef0}} `
    -AutoRecovery Enabled
```

------

## 排查简化的自动恢复失败问题
<a name="ec2-instance-recover-simplified-auto-recovery-troubleshooting"></a>

如果简化的自动恢复机制无法恢复实例，考虑是否存在以下问题：
+ AWS 服务事件正在运行

  简化的自动恢复在 AWS Health Dashboard 中的服务事件期间不起作用。您可能不会收到此类事件的恢复失败通知。要了解最新的服务可用性信息，请参阅[服务运行](https://health.aws.amazon.com/health/status)状况页面。
+ 容量不足

  暂无足够的替换硬件来迁移实例。
+ 已达到每日恢复尝试次数上限

  该实例已达到每天的恢复尝试操作限制。如果自动恢复失败，并且确定硬件性能下降是初始系统状态检查失败的根本原因，实例随后可能会被停用。

如果尽管多次尝试恢复，但实例的系统状态检查失败仍然存在，请参阅[对状态检查失败的实例进行故障排除](TroubleshootingInstances.md)以获取更多指导。
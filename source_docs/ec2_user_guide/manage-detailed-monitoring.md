

# 管理 EC2 实例的详细监控
<a name="manage-detailed-monitoring"></a>

Amazon CloudWatch 提供两类监控：*基本监控*和*详细监控*。默认情况下，您的实例已配置为基本监控。您可以选择启用详细监控，以帮助您更快地识别运行问题并对其采取措施。可以在实例启动时或在实例运行或停止时，启用或关闭详细监控。

在实例上启用详细监控不会影响其附加的 EBS 卷的监控。有关更多信息，请参阅 [Amazon EBS 的 Amazon CloudWatch 指标](https://docs.aws.amazon.com/ebs/latest/userguide/using_cloudwatch_ebs.html)。

下面突出显示了实例的基本监控和详细监控之间的区别。


| 监控类型 | 描述 | 收费 | 
| --- | --- | --- | 
| 基本监控 | 状态检查指标在 1 分钟内可用。所有其他指标均在 5 分钟内可用。 | 免费。 | 
| Detailed monitoring（详细监控） | 只要您为实例开启详细监控功能，便每隔 1 分钟获取一次指标。<br />启用详细监控后，您可以跨相似实例组聚合数据。 | 您需要按 Amazon EC2 发送到 CloudWatch 的每个指标付费。您无需为数据存储付费。有关更多信息，请参阅 [Amazon CloudWatch 定价页面](https://aws.amazon.com/cloudwatch/pricing/#Paid_tier)中的付费套餐。 | 

**Topics**
+ [所需权限](#iam-detailed-monitoring)
+ [启动时启用详细监控](#enable-detailed-monitoring)
+ [管理详细监控](#disable-detailed-monitoring)

## 所需权限
<a name="iam-detailed-monitoring"></a>

要启用对实例的详细监控，用户必须具有使用 [MonitorInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_MonitorInstances.html) API 操作的权限。要关闭对实例的详细监控，用户必须具有使用 [UnmonitorInstances](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_UnmonitorInstances.html) API 操作的权限。

## 启动时启用详细监控
<a name="enable-detailed-monitoring"></a>

使用以下过程在启动时启用详细监控。默认情况下，您的实例使用基本监控。

------
#### [ Console ]

**要在启动实例时启用详细监视**  
当使用 Amazon EC2 控制台启动实例时，请在**高级详细信息**下，选中**详细 CloudWatch 监控**复选框。

------
#### [ AWS CLI ]

**要在启动实例时启用详细监视**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--monitoring` 选项。

```
--monitoring Enabled=true
```

------
#### [ PowerShell ]

**要在启动实例时启用详细监视**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-Monitoring` 参数结合使用。

```
-Monitoring $true
```

------

## 管理详细监控
<a name="disable-detailed-monitoring"></a>

使用以下过程管理正在运行或已停止实例的详细监控。

------
#### [ Console ]

**管理详细监控**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 依次选择**操作**、**监控和故障排除**以及**管理详细监控**。

1. 在**详细监控**页面上，对于**详细监控**，执行以下操作之一：
   + 详细监控：选择**启用**。
   + 基本监控：清除**启用**。

1. 选择**确认**。

------
#### [ AWS CLI ]

**启用详细监控**  
使用以下 [monitor-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/monitor-instances.html) 命令。

```
aws ec2 monitor-instances --instance-ids {{i-1234567890abcdef0}}
```

**禁用详细监控**  
使用 [unmonitor-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/unmonitor-instances.html) 命令。

```
aws ec2 unmonitor-instances --instance-ids {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**启用详细监控**  
使用 [Start-EC2InstanceMonitoring](https://docs.aws.amazon.com/powershell/latest/reference/items/Start-EC2InstanceMonitoring.html) cmdlet。

```
Start-EC2InstanceMonitoring -InstanceId {{i-1234567890abcdef0}}
```

**禁用详细监控**  
使用 [Stop-EC2InstanceMonitoring](https://docs.aws.amazon.com/powershell/latest/reference/items/Stop-EC2InstanceMonitoring.html) cmdlet。

```
Stop-EC2InstanceMonitoring -InstanceId {{i-1234567890abcdef0}}
```

------
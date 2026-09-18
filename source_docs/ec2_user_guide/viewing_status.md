

# 查看 Amazon EC2 实例的状态检查
<a name="viewing_status"></a>

如果实例状态检查失败，通常必须由您自行解决问题（例如，通过重启实例或更改实例配置）。要自行解决系统或实例状态检查失败问题，请参阅 [通过失败状态检查来排查 Amazon EC2 Linux 实例问题](TroubleshootingInstances.md)。

------
#### [ Console ]

**查看状态检查，需要进行以下操作**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. **实例**页面上的**状态检查**列中会列出每个实例的运行状态。

1. 要查看特定实例的状态，请选择该实例，然后选择**状态和警报**选项卡。

1. 要查看 CloudWatch 指标以进行状态检查，请在**状态和警报**选项卡上，展开**指标**以查看以下指标的图表：
   + **系统状态检查失败**
   + **实例状态检查失败**
   + **附加 EBS 状态检查失败**
   + **应用程序的状态检查失败**

   有关更多信息，请参阅 [状态检查指标](viewing_metrics_with_cloudwatch.md#status-check-metrics)。

------
#### [ AWS CLI ]

**查看状态检查，需要进行以下操作**  
使用 [describe-instance-status](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-status.html) 命令。

**示例**：获取所有正在运行的实例的状态

```
aws ec2 describe-instance-status
```

**示例**：获取所有实例的状态

```
aws ec2 describe-instance-status --include-all-instances
```

**示例**：获取单个正在运行的实例的状态

```
aws ec2 describe-instance-status --instance-ids {{i-1234567890abcdef0}}
```

**示例：**获取所有状态为 `impaired` 的实例

```
aws ec2 describe-instance-status \
--filters Name=instance-status.status,Values=impaired
```

------
#### [ PowerShell ]

**查看状态检查，需要进行以下操作**  
使用 [Get-EC2InstanceStatus](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceStatus.html) 命令。

**示例**：获取所有正在运行的实例的状态

```
Get-EC2InstanceStatus
```

**示例**：获取所有实例的状态

```
Get-EC2InstanceStatus -IncludeAllInstance $true
```

**示例**：获取单个正在运行的实例的状态

```
Get-EC2InstanceStatus -InstanceId {{i-1234567890abcdef0}}
```

**示例：**获取所有状态为 `impaired` 的实例

```
Get-EC2InstanceStatus \
-Filter @{Name="instance-status.status"; Values="impaired"}
```

------
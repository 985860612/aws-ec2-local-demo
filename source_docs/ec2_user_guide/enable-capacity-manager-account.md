

# 在账户级别启用 EC2 容量管理器
<a name="enable-capacity-manager-account"></a>

在账户级别启用容量管理器，以监控和分析单个 AWS 账户内的 EC2 容量使用情况。启用后，容量管理器会收集有关您的按需型实例、竞价型实例和容量预留的相关数据，以帮助您发现优化机会并跟踪使用模式。

## 在账户级别启用容量管理器
<a name="enable-account-capacity-manager"></a>

------
#### [ Console ]

**为您的账户启用容量管理器**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量管理器**。

1. 在容量管理器页面上，选择**在区域中启用**。

------
#### [ AWS CLI ]

**为您的账户启用容量管理器**  
运行以下命令：

```
aws ec2 enable-capacity-manager
```

------
#### [ PowerShell ]

**为您的账户启用容量管理器**  
使用 [Enable-EC2CapacityManager](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-EC2CapacityManager.html) cmdlet。

```
Enable-EC2CapacityManager
```

------

**注意**  
启用容量管理器后，它会收集并聚合 14 天的历史数据。此过程可能需要几小时时间。
在收集历史数据时，将显示 `initial-ingestion-in-progress` 状态。在此收集期间，您可能会发现历史数据存在差距。数据收集完成后，将显示 `ingestion-complete` 状态。
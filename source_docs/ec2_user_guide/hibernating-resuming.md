

# 启动已休眠的 Amazon EC2 实例
<a name="hibernating-resuming"></a>

按照启动已停止实例的相同方式，启动已休眠的实例。

对于竞价型实例，如果 Amazon EC2 对实例进行了休眠，则只有 Amazon EC2 可以恢复它。只有在*您*对竞价型实例进行休眠的情况下，您才能自己恢复该实例。仅当容量可用且竞价价格低于或等于您指定的最高价格时，才能恢复竞价型实例。

------
#### [ Console ]

**启动已休眠实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择已休眠的实例，然后依次选择**实例状态**、**启动实例**。实例进入 `running` 状态可能需要几分钟时间。在此期间，实例[状态检查](monitoring-system-instance-status-check.md#types-of-instance-status-checks)显示实例处于失败状态，直至实例已启动。

------
#### [ AWS CLI ]

**启动已休眠实例**  
使用 [start-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/start-instances.html) 命令。

```
aws ec2 start-instances --instance-ids {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**启动已休眠实例**  
使用 [Start-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Start-EC2Instance.html) cmdlet。

```
Start-EC2Instance -InstanceId {{i-1234567890abcdef0}}
```

------
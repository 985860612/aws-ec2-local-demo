

# 监控 Amazon EC2 专属主机的状态
<a name="dedicated-hosts-monitoring"></a>

Amazon EC2 持续监控专属主机的状态。将在 Amazon EC2 控制台上显示更新的状态。您可以使用以下方法查看有关专属主机的信息。

------
#### [ Console ]

**查看专属主机的状态**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 在列表中找到专属主机，并查看**状态**列中的值。

------
#### [ AWS CLI ]

**查看专属主机的状态**  
可以使用 [describe-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-hosts.html) 命令。

```
aws ec2 describe-hosts --host-id {{h-012a3456b7890cdef}}
```

------
#### [ PowerShell ]

**查看专属主机的状态**  
使用 [Get-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Host.html) cmdlet。

```
Get-EC2Host -HostId {{h-012a3456b7890cdef}}
```

------

下表说明了可能的专属主机状态。


| **州** | **说明** | 
| --- | --- | 
| available | AWS未检测到专属主机的问题。不会安排维护或修复。实例可在此专属主机上启动。 | 
| released | 已释放专属主机。主机 ID 不再使用。无法重新使用已释放的主机。 | 
| under-assessment | AWS正在寻找专属主机可能存在的问题。如果必须采取措施，系统将通过 AWS 管理控制台 或电子邮件通知您。无法在处于该状态的专属主机上启动实例。 | 
| pending | 专属主机不能用于启动新的实例。正在对其进行[修改以支持多种实例类型](modify-host-support.md)，或者正在进行[主机恢复](dedicated-hosts-recovery.md)。 | 
| permanent-failure | 检测到了一个不可恢复的故障。您将通过您的实例和通过电子邮件接收到一个移出通知。实例可能会继续运行。如果在处于此状态的专属主机上停止或终止所有实例，AWS将停用该主机。AWS不会在此状态下重新启动实例。无法在处于该状态的专属主机上启动实例。 | 
| released-permanent-failure | AWS永久释放已发生故障的专属主机，不再在这些主机上运行实例。专属主机 ID 不再可供使用。 | 
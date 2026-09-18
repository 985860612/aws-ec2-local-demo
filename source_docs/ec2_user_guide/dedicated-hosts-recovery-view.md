

# 查看 Amazon EC2 专属主机的主机恢复设置
<a name="dedicated-hosts-recovery-view"></a>

您可以随时查看专属主机的主机恢复配置。

------
#### [ Console ]

**查看专属主机的主机恢复配置**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 选择专属主机，然后在**描述**选项卡中查看**主机恢复**字段。

------
#### [ AWS CLI ]

**查看专属主机的主机恢复配置**  
可以使用 [describe-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-hosts.html) 命令。

```
aws ec2 describe-hosts \
    --host-ids {{h-012a3456b7890cdef}} \
    --query Hosts[].HostRecovery
```

下面是示例输出。

```
on
```

------
#### [ PowerShell ]

**查看专属主机的主机恢复配置**  
使用 [Get-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Host.html) cmdlet。

```
(Get-EC2Host -HostId {{h-012a3456b7890cdef}}).Hosts | Select HostRecovery
```

下面是示例输出。

```
HostRecovery
------------
on
```

------
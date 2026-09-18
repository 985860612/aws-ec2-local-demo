

# 释放 Amazon EC2 专属主机
<a name="dedicated-hosts-releasing"></a>

如果您不再需要某个专属主机，则可以停止在该主机上运行的实例，指示实例在另一主机上启动，然后*释放*该主机。

必须先停止专属主机上运行的所有实例，然后才能释放主机。这些实例可以迁移至您账户的其他专属主机，这样您就可以继续使用它们。这些步骤只适用于按需专属主机。

------
#### [ Console ]

**释放专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 在**专属主机**页面上，选择要释放的专属主机。

1. 依次选择 **Actions (操作)**、**Release host (释放主机)**。

1. 选择 **Release (释放)** 确认。

------
#### [ AWS CLI ]

**释放专属主机**  
使用 [release-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/release-hosts.html) 命令。

```
aws ec2 release-hosts --host-ids {{h-012a3456b7890cdef}}
```

------
#### [ PowerShell ]

**释放专属主机**  
使用 [Remove-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2Host.html) cmdlet。

```
Remove-EC2Host -HostId {{h-012a3456b7890cdef}}
```

------

在释放专属主机后，您无法再次重新使用同一主机或主机 ID，并将不再根据按需账单费率向您收费。专属主机的状态将变为 `released`，您将无法在该主机上启动任何实例。

**注意**  
如果您是刚刚释放的专属主机，则系统可能需要过一些时间才会停止将其计入限制。如果您在这段时间内尝试分配新的专属主机，可能会遇到 `LimitExceeded` 错误。如果出现这种情况，请在几分钟后再次尝试分配新的主机。

已停止的实例仍可以使用和列在 **Instances** 页面上。这些实例将保留其 `host` 租赁设置。
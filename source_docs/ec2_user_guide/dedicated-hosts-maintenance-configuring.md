

# 配置 Amazon EC2 专属主机的主机维护设置
<a name="dedicated-hosts-maintenance-configuring"></a>

启用主机维护，确保在计划维护事件期间，在专属主机上运行的实例自动恢复到新的专属主机上。

如果禁用主机维护，您会收到一封电子邮件通知，要求在 28 天内驱逐降级主机并将实例手动迁移到另一台主机。如果您有专属主机预留，则会分配替换主机。28 天后，降级主机上运行的实例将终止，主机会自动释放。

------
#### [ Console ]

**为专属主机启用主机维护**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 依次选择专属主机 > **操作** > **修改主机**。

1. 在**主机维护**字段中选择*启用*。

**为专属主机禁用主机维护**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 依次选择专属主机 > **操作** > **修改主机**。

1. 在**主机维护**字段中选择*关闭*。

------
#### [ AWS CLI ]

**为专属主机启用主机维护**  
使用 [modify-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-hosts.html) 命令。

```
aws ec2 modify-hosts \
    --host-maintenance on \
    --host-ids {{h-0d123456bbf78910d}}
```

**为专属主机禁用主机维护**  
使用 [modify-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-hosts.html) 命令。

```
aws ec2 modify-hosts \
    --host-maintenance off \
    --host-ids {{h-0d123456bbf78910d}}
```

------
#### [ PowerShell ]

**为专属主机启用主机维护**  
使用 [Edit-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2Host.html) cmdlet。

```
Edit-EC2Host `
    -HostMaintenance on `
    -HostId {{h-0d123456bbf78910d}}
```

**为专属主机禁用主机维护**  
使用 [Edit-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2Host.html) cmdlet。

```
Edit-EC2Host `
    -HostMaintenance off `
    -HostId {{h-0d123456bbf78910d}}
```

------
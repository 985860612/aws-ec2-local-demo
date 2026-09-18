

# 管理 Amazon EC2 专属主机恢复
<a name="dedicated-hosts-recovery-enable"></a>

如果在专属主机上检测到具有特定问题的条件，专属主机恢复自动在新的替换主机上重新启动实例。您可以在分配专属主机时或分配后启用主机恢复。

分配主机时，请使用以下过程启用主机恢复。

------
#### [ Console ]

**在分配时启用主机恢复**  
使用 Amazon EC2 控制台分配专属主机时，对于**主机恢复**，请选择**启用**。有关更多信息，请参阅 [分配一台 Amazon EC2 专属主机供您的账户使用](dedicated-hosts-allocating.md)。

------
#### [ AWS CLI ]

**在分配时启用主机恢复**  
使用 [allocate-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/allocate-hosts.html) 命令。

```
aws ec2 allocate-hosts \
    --instance-type {{m5.large}} \
    --availability-zone {{eu-west-1a}} \
    --auto-placement on \
    --host-recovery on \
    --quantity 1
```

------
#### [ PowerShell ]

**在分配时启用主机恢复**  
使用 [New-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Host.html) cmdlet。

```
New-EC2Host `
    -InstanceType {{m5.large}} `
    -AvailabilityZone {{eu-west-1a}} `
    -AutoPlacement on `
    -HostRecovery on `
    -Quantity 1
```

------

使用以下过程管理专属主机的主机恢复。

------
#### [ Console ]

**在分配后管理主机恢复**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 选择专属主机。

1. 依次选择**操作**和**修改主机**。

1. 对于**主机恢复**，请选择或清除**启用**。

1. 选择**保存**。

------
#### [ AWS CLI ]

**在分配后启用主机恢复**  
使用 [modify-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-hosts.html) 命令。

```
aws ec2 modify-hosts \
    --host-recovery on \
    --host-ids {{h-012a3456b7890cdef}}
```

**在分配后禁用主机恢复**  
使用 [modify-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-hosts.html) 命令并指定 `host-recovery` 参数的值为 `off`。

```
aws ec2 modify-hosts \
    --host-recovery off \
    --host-ids {{h-012a3456b7890cdef}}
```

------
#### [ PowerShell ]

**在分配后启用主机恢复**  
使用 [Edit-Host](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2Host.html) cmdlet。

```
Edit-EC2Host `
    -HostRecovery on `
    -HostId {{h-012a3456b7890cdef}}
```

**在分配后禁用主机恢复**  
使用 [Edit-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2Host.html) cmdlet。

```
Edit-EC2Host `
    -HostRecovery off `
    -HostId {{h-012a3456b7890cdef}}
```

------
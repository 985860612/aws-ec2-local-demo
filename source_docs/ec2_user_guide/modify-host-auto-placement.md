

# 修改现有 Amazon EC2 专属主机的自动置放设置
<a name="modify-host-auto-placement"></a>

将专属主机分配到您的 AWS 账户后，您可以修改其自动置放设置。

------
#### [ Console ]

**修改专属主机的自动置放**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 选择一个主机，然后依次选择 **Actions (操作)**、**Modify host (修改主机)**。

1. 对于 **Instance auto-placement (实例自动置放)**，选择 **Enable (启用)** 来启用自动置放，或者取消选择 **Enable (启用)** 来禁用自动置放。有关更多信息，请参阅[Amazon EC2 专属主机自动置放和主机关联](dedicated-hosts-understanding.md)。

1. 选择**保存**。

------
#### [ AWS CLI ]

**修改专属主机的自动置放**  
使用 [modify-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-hosts.html) 命令。

```
aws ec2 modify-hosts \
    --auto-placement {{on}} \
    --host-ids {{h-012a3456b7890cdef}}
```

------
#### [ PowerShell ]

**修改专属主机的自动置放**  
使用 [Edit-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2Host.html) cmdlet。

```
Edit-EC2Host `
    -AutoPlacement {{1}} `
    -HostId {{h-012a3456b7890cdef}}
```

------
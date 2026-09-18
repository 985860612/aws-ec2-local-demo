

# 查看您 AWS 账户中共享的 Amazon EC2 专属主机
<a name="identifying-shared-dh"></a>

您可以查看与其他账户共享的专属主机以及与您共享的专属主机。如果您拥有专属主机，则可以查看在主机上运行的所有实例，包括使用者启动的实例。如果专属主机是与您共享的，则只能看到您在共享主机上启动的实例，而不能看到其他使用者启动的实例。

拥有者和使用者可以使用以下方法之一标识共享的专属主机。

------
#### [ Console ]

**识别共享专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。屏幕列出了您拥有的专属主机以及与您共享的专属主机。

1. **Owner (拥有者)** 列显示专属主机拥有者的AWS账户 ID。

1. 要查看在主机上运行的实例，请选择**实例**选项卡。

------
#### [ AWS CLI ]

**识别共享专属主机**  
可以使用 [describe-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-hosts.html) 命令。该命令返回您拥有的专属主机以及与您共享的专属主机。`Owner` 的值是专属主机所有者的账户 ID。`Instances` 列表会描述在主机上运行的实例。

```
aws ec2 describe-hosts --filter "Name=state,Values=available"
```

------
#### [ PowerShell ]

**识别共享专属主机**  
使用 [Get-EC2host](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Host.html) cmdlet。此 cmdlet 会返回由您拥有的专属主机以及共享给您的专属主机。响应中 `Owner` 的值是专属主机所有者的账户 ID。`Instances` 列表会描述在主机上运行的实例。

```
Get-EC2Host -Filter @{Name="state"; Values="available"}
```

------
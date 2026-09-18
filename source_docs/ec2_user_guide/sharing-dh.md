

# 跨 AWS 账户共享 Amazon EC2 专属主机
<a name="sharing-dh"></a>

当所有者共享专属主机时，它允许使用者在主机上启动实例。使用者可以在共享主机上启动其可用容量允许的任意数量的实例。

**重要**  
请注意，您有责任确保您具有相应的许可权利，以便在专属主机上共享任何 BYOL 许可证。

如果您共享启用了自动放置的专属主机，请记住以下内容，因为它可能导致意外的专属主机使用：
+ 如果使用者启动具有专属主机租赁的实例，但他们的账户中拥有的专属主机上没有容量，则会自动在共享的专属主机上启动实例。

要共享专属主机，您必须将它添加到资源共享。资源共享是一项 AWS RAM 资源，可让您跨 AWS 账户共享资源。资源共享指定要共享的资源以及与之共享资源的使用者。您可以将专属主机添加到现有资源，也可以将其添加到新的资源共享。

如果您是 AWS Organizations 中某组织的一部分并且已在您的组织中启用共享，组织中的使用者将自动获得对共享的专属主机的访问权限。否则，使用者会收到加入资源共享的邀请，并在接受邀请后获得对共享专属主机的访问权限。

**注意**  
共享专属主机后，使用者可能需要几分钟的时间才能访问它。

------
#### [ Console ]

**使用 Amazon EC2 控制台共享您拥有的专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 选择要共享的专属主机，然后选择**操作**、**共享主机**。

1. 选择要将专属主机添加到的资源共享，然后选择**共享主机**。

   使用者可能需要几分钟的时间才能访问共享主机。

**使用 AWS RAM 控制台共享您拥有的专属主机**  
请参阅《AWS RAM 用户指南》中的 [Create a resource share](https://docs.aws.amazon.com/ram/latest/userguide/working-with-sharing-create.html)**。

------
#### [ AWS CLI ]

**共享您拥有的专属主机**  
使用 [create-resource-share](https://docs.aws.amazon.com/cli/latest/reference/ram/create-resource-share.html) 命令。

```
aws ram create-resource-share \
    --name {{my-resource-share}} \
    --resource-arns arn:aws:ec2:{{us-east-2}}:{{123456789012}}:dedicated-host/{{h-07879acf49EXAMPLE}}
```

------
#### [ PowerShell ]

**共享您拥有的专属主机**  
使用 [New-RAMResourceShare](https://docs.aws.amazon.com/powershell/latest/reference/items/New-RAMResourceShare.html) cmdlet。

```
New-RAMResourceShare `
    -Name {{my-resource-share}} `
    -ResourceArn arn:aws:ec2:{{us-east-2}}:{{123456789012}}:dedicated-host/{{h-07879acf49EXAMPLE}}
```

------
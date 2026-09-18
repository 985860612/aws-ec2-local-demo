

# 取消共享与其他 AWS 账户共享的专属主机
<a name="unsharing-dh"></a>

专属主机拥有者可以随时将共享的专属主机取消共享。在将共享的专属主机取消共享时，以下规则将适用：
+ 与之共享专属主机的使用者不再能够在专属主机上启动新实例。
+ 取消共享时在专属主机上运行的使用者所拥有的实例将继续运行，但计划[停用](schedevents_actions_retire.md)。消费者将收到实例的停用通知，他们有两周时间对通知采取措施。但是，如果在停用通知期内与使用者重新共享专属主机，则将取消实例停用。

要取消共享您拥有的已共享专属主机，必须从资源共享中将其删除。

------
#### [ Console ]

**取消共享您拥有的共享专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 选择要取消共享的专属主机，然后选择**共享**选项卡。

1. **共享**选项卡列出了已将专属主机添加到的资源共享。选择要从中删除专属主机的资源共享，然后选择**从资源共享中删除主机**。

**使用 AWS RAM 控制台取消共享您拥有的已共享专属主机**  
请参阅《AWS RAM 用户指南》**中的[更新资源共享](https://docs.aws.amazon.com/ram/latest/userguide/working-with-sharing-update.html)。

------
#### [ AWS CLI ]

**取消共享您拥有的共享专属主机**  
使用 [disassociate-resource-share](https://docs.aws.amazon.com/cli/latest/reference/ram/disassociate-resource-share.html) 命令。

```
aws ram disassociate-resource-share \
    --resource-share-arn arn:aws:ram:{{us-east-2}}:{{123456789012}}:resource-share/{{7ab63972-b505-7e2a-420d-6f5d3EXAMPLE}} \
	--resource-arns arn:aws:ec2:{{us-east-2}}:{{123456789012}}:dedicated-host/{{h-07879acf49EXAMPLE}}
```

------
#### [ PowerShell ]

**取消共享您拥有的共享专属主机**  
使用 [Disconnect-RAMResourceShare](https://docs.aws.amazon.com/powershell/latest/reference/items/Disconnect-RAMResourceShare.html) cmdlet。

```
Disconnect-RAMResourceShare `
    -ResourceShareArn "arn:aws:ram:{{us-east-2}}:{{123456789012}}:resource-share/{{7ab63972-b505-7e2a-420d-6f5d3EXAMPLE}}" `
    -ResourceArn "arn:aws:ec2:{{us-east-2}}:{{123456789012}}:dedicated-host/{{h-07879acf49EXAMPLE}}"
```

------
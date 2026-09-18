

# 停止共享容量预留
<a name="unsharing-cr"></a>

容量预留拥有者可以随时停止共享容量预留。以下规则适用：
+ 如果使用者拥有的实例在停止共享时已在共享容量中运行，则将继续在预留容量中运行。该容量将在使用者终止实例时恢复到容量预留中。
+ 与之共享容量预留的使用者不再能够在预留容量中启动新实例。

要停止共享您拥有的共享容量预留，必须从资源共享中将其删除。

------
#### [ Console ]

**使用 Amazon EC2 控制台停止共享您拥有的容量预留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 选择容量预留并选择**共享**选项卡。

1. **共享**选项卡列出了已将容量预留添加到的资源共享。选择要从中删除容量预留的资源共享，然后选择**从资源共享中删除**。

**使用 AWS RAM 控制台停止共享您拥有的容量预留**  
请参阅 *AWS RAM 用户指南*中的[更新资源共享](https://docs.aws.amazon.com/ram/latest/userguide/working-with-sharing.html#working-with-sharing-update)。

------
#### [ AWS CLI ]

**停止共享您拥有的容量预留**  
使用 [disassociate-resource-share](https://docs.aws.amazon.com/cli/latest/reference/ram/disassociate-resource-share.html) 命令。

```
aws ram disassociate-resource-share \
    --resource-share-arn arn:aws:ram:{{us-east-2}}:{{123456789012}}:resource-share/{{7ab63972-b505-7e2a-420d-6f5d3EXAMPLE}} \
	--resource-arns arn:aws:ec2:{{us-east-2}}:{{123456789012}}:capacity-reservation/{{cr-1234abcd56EXAMPLE}}
```

------
#### [ PowerShell ]

**停止共享您拥有的容量预留**  
使用 [Disconnect-RAMResourceShare](https://docs.aws.amazon.com/powershell/latest/reference/items/Disconnect-RAMResourceShare.html) cmdlet。

```
Disconnect-RAMResourceShare `
    -ResourceShareArn "arn:aws:ram:{{us-east-2}}:{{123456789012}}:resource-share/{{7ab63972-b505-7e2a-420d-6f5d3EXAMPLE}}" `
    -ResourceArn "arn:aws:ec2:{{us-east-2}}:{{123456789012}}:capacity-reservation/{{cr-1234abcd56EXAMPLE}}"
```

------
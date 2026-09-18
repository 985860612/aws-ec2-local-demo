

# 重启 Amazon EC2 实例
<a name="ec2-instance-reboot"></a>

实例重启相当于操作系统重启。在许多情况下，只需要几分钟时间即可重启您的实例。

重启实例后，将保留以下内容：
+ 公有 DNS 名称（IPv4）
+ 私有 IPv4 地址
+ 公有 IPv4 地址
+ IPv6 地址（如适用）
+ 其实例存储卷上的所有数据

与[停止并启动](Stop_Start.md)实例会启动新的计费周期并且最低收取一分钟的费用不同，重启实例不会启动新的实例计费周期。

实例重启可以由用户启动（即手动重启实例），也可以由 AWS 启动（用于自动恢复实例，或者响应计划重启事件以进行必要的维护，例如应用需要重启的更新）。

对于由用户启动的重启，我们建议使用 Amazon EC2 控制台、CLI 或 API 而非在实例中运行操作系统重启命令。使用 Amazon EC2 时，如果实例未在几分钟内完全关闭，Amazon EC2 会执行强制重启。此外，AWS CloudTrail 还会创建一条关于实例重启时间的 API 记录。

本主题介绍如何执行由用户启动的重启。有关 AWS 执行的重启的信息，请参阅[实例自动恢复](ec2-instance-recover.md)和[管理计划重启的 Amazon EC2 实例](schedevents_actions_reboot.md)。

**重要**  
如果正在您的实例上安装更新，我们建议您在所有更新都安装完毕之后，才使用 Amazon EC2 控制台或命令行重启或关闭您的实例。当您使用 Amazon EC2 控制台或命令行重启或关闭实例时，您的实例会存在硬重启的风险。在安装更新过程中硬重启会将您的实例置于不稳定状态。

------
#### [ Console ]

**重启实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instances (实例)**。

1. 选择实例，然后选择 **Instance state**（实例状态）、**Reboot instance**（重新引导实例）。

1. 当系统提示您确认时，选择**重启**。

   实例仍处于 `running` 状态。

------
#### [ AWS CLI ]

**重启实例**  
使用 [reboot-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/reboot-instances.html) 命令。

```
aws ec2 reboot-instances --instance-ids {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**重启实例**  
使用 [Restart-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Restart-EC2Instance.html) cmdlet。

```
Restart-EC2Instance -InstanceId {{i-1234567890abcdef0}}
```

------

**运行受控的故障注入实验**  
您可以使用 AWS Fault Injection Service 测试您的实例重新启动时您的应用程序如何响应。有关更多信息，请参阅[《AWS Fault Injection Service 用户指南》](https://docs.aws.amazon.com/fis/latest/userguide/what-is.html)。
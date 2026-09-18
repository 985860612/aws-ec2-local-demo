

# 终止实例的方法
<a name="instance-terminate-methods"></a>

**警告**  
**终止实例是永久且不可逆转的。**  
终止一个实例后，您将无法再连接到该实例，而且也无法对其进行恢复操作。被配置为在终止后删除的所有连接的 Amazon EBS 卷也将被永久删除并且无法恢复。实例存储卷中存储的所有数据将永久丢失。有关更多信息，请参阅 [实例终止的工作原理](how-ec2-instance-termination-works.md)。  
在终止实例之前，请务必确保已将需要在终止后保留的所有数据备份到持久存储中。

有四种方法可以执行用户启动的实例终止：默认终止、跳过操作系统关闭终止、强制终止和跳过操作系统关闭强制终止。下表比较了各种终止方法之间的关键差异：

**注意**  
如果启用了终止保护，则无法终止实例。有关更多信息，请参阅[更改实例终止保护](Using_ChangingDisableAPITermination.md)。


| 终止方法 | 关键用途 | 使用案例 | CLI 命令 | 
| --- | --- | --- | --- | 
| 默认终止 | 正常关闭实例，尝试正常关闭操作系统。 | 典型实例终止。 | <pre>aws ec2 terminate-instances \<br />--instance-id {{i-1234567890abcdef0}}</pre> | 
| 终止并跳过操作系统关闭 | 终止实例时绕过操作系统正常关闭。 | 需要绕过正常关闭操作系统时。 | <pre>aws ec2 terminate-instances \<br />--instance-id {{i-1234567890abcdef0}} \<br />--skip-os-shutdown</pre> | 
| 强制终止 | 处理卡住的实例。首先尝试默认终止；如果实例无法终止，则强制终止实例。 | 当实例卡住在shutting-down状态时。 | <pre>aws ec2 terminate-instances \<br />--instance-id {{i-1234567890abcdef0}} \<br />--force</pre> | 
| 强制终止并跳过操作系统关闭 | 强制终止并在终止实例时绕过操作系统正常关闭。 | 当需要强制终止并绕过操作系统正常关闭时。 | <pre>aws ec2 terminate-instances \<br />--instance-id {{i-1234567890abcdef0}} \<br />--force \<br />--skip-os-shutdown</pre> | 

有关如何使用每种方法的说明，请参阅以下内容：
+ [终止实例并正常关闭操作系统](terminating-instances.md#terminating-instances-console)
+ [终止实例并绕过操作系统正常关闭](terminating-instances.md#terminating-instances-bypass-graceful-os-shutdown)
+ [强制终止实例](TroubleshootingInstancesShuttingDown.md#force-terminate-ec2-instance)
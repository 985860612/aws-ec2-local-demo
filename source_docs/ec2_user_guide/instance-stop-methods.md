

# 停止实例的方法
<a name="instance-stop-methods"></a>

有四种方法可以执行用户启动的停止：默认停止、通过跳过操作系统关闭而停止、强制停止以及通过跳过操作系统关闭强制停止。下表比较了各种停止方法之间的关键差异：


| 停止方法 | 关键用途 | 使用案例 | CLI 命令 | 
| --- | --- | --- | --- | 
| 默认停止 | 正常关闭实例，尝试正常关闭操作系统。 | 典型实例停止。 |  <pre>aws ec2 stop-instances \<br />--instance-id {{i-1234567890abcdef0}}</pre>  | 
| 停止并跳过操作系统关闭 | 在停止实例时，可绕过操作系统正常关闭。 | 需要绕过正常关闭操作系统时。 | <pre>aws ec2 stop-instances \<br />--instance-id {{i-1234567890abcdef0}} \<br />--skip-os-shutdown</pre> | 
| 强制停止 | 处理卡住的实例。先尝试默认停止；如果实例无法停止，则强制停止实例。 | 当实例卡住在stopping状态时。 | <pre>aws ec2 stop-instances \<br />--instance-id {{i-1234567890abcdef0}} \<br />--force</pre> | 
| 强制停止并跳过操作系统关闭 | 停止实例时强制停止并绕过操作系统正常关闭。 | 需要强制停止并绕过正常关闭操作系统时。 | <pre>aws ec2 stop-instances \<br />--instance-id {{i-1234567890abcdef0}} \<br />--force \<br />--skip-os-shutdown</pre> | 

有关如何使用每种方法的说明，请参阅以下内容：
+ [通过正常关闭操作系统来停止实例](Stop_Start.md#stop-instance-with-graceful-os-shutdown)
+ [停止实例并绕过操作系统正常关闭](Stop_Start.md#stop-instance-bypass-graceful-os-shutdown)
+ [强制停止实例](TroubleshootingInstancesStopping.md#force-stop-instance)

**Topics**
+ [默认停止](#ec2-instance-default-stop)
+ [停止并跳过操作系统关闭](#ec2-instance-stop-with-skip-os-shutdown)
+ [强制停止](#ec2-instance-force-stop)
+ [强制停止并跳过操作系统关闭](#ec2-instance-force-stop-with-skip-os-shutdown)

以下各节提供了有关四种不同的用户启动的停止方法的更多详细信息。

## 默认停止
<a name="ec2-instance-default-stop"></a>

默认的停止方法是停止实例的标准方法。当您发出 StopInstances 命令时，实例会从`running`状态转换到`stopping`状态，最后转换到`stopped`状态，如下图所示：

![默认停止流。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/stop-instance-flow-1.png)


**用途：**正常关闭实例，尝试正常关闭操作系统。

**数据影响：**保留 EBS 根卷和数据卷上的数据。实例存储卷上的数据丢失。

**何时使用：**典型停止的第一次尝试停止。

**注意**  
如果您已经尝试通过跳过操作系统关闭来停止，则在同一状态转换会话期间的后续默认停止尝试将不执行正常关闭操作系统。对于实例的当前会话，绕过操作系统的正常关闭是不可逆的。

## 停止并跳过操作系统关闭
<a name="ec2-instance-stop-with-skip-os-shutdown"></a>

当需要绕过操作系统正常关闭时，可以使用停止并跳过操作系统关闭方法来停止实例并绕过操作系统的正常关闭，如下图所示：

![停止并跳过操作系统关闭流。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/stop-instance-flow-3.png)


**警告**  
绕过操作系统正常关闭可能会导致数据丢失或损坏（例如，内存内容未刷新到磁盘或正在运行的 IO 丢失）或跳过关闭脚本。

**用途：**停止实例时绕过操作系统正常关闭。

**数据影响：**可能导致数据丢失或损坏。内存中的内容可能无法刷新到磁盘，正在运行的 IO 可能会丢失。可能会跳过关闭脚本。

**何时使用：**需要绕过操作系统正常关闭时。如果在执行操作系统正常关闭的默认停止时使用，则将绕过操作系统正常关闭。

**注意**  
对于实例的当前状态转换会话，绕过操作系统的正常关闭是不可逆的。在此会话期间的后续默认停止尝试不会尝试正常关闭操作系统。

## 强制停止
<a name="ec2-instance-force-stop"></a>

强制停止方法用于处理在`stopping`状态卡住的实例。实例通常会由于底层硬件问题（由[系统状态检查](monitoring-system-instance-status-check.md#system-status-checks)失败表示）而被卡住。

强制停止方法首先尝试默认停止。如果实例仍在`stopping`状态卡住，则`force`参数会强制关闭实例并将实例转换为`stopped`状态，如下图所示：

![强制停止流。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/stop-instance-flow-2.png)


**用途：**处理在`stopping`状态卡住的实例。先尝试默认停止。如果实例无法停止，则强制关闭该实例。

**数据影响：**先尝试默认停止，但如果继续强制停止，则可能会导致数据丢失或损坏。在极少数情况下，会导致停止后写入 EBS 卷或其他共享资源。

**何时使用：**当实例在默认停止后仍卡住时进行第二次停止尝试。有关更多信息，请参阅 [排查 Amazon EC2 实例的停止问题](TroubleshootingInstancesStopping.md)。

## 强制停止并跳过操作系统关闭
<a name="ec2-instance-force-stop-with-skip-os-shutdown"></a>

当需要强制停止并绕过操作系统正常关闭时，可以使用强制停止并跳过操作系统关闭方法使实例进入`stopped`状态，如下图所示：

![强制停止并跳过操作系统关闭流。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/stop-instance-flow-4.png)


**用途：**停止实例时强制停止并绕过操作系统正常关闭。

**数据影响：**跳过操作系统关闭可能导致数据丢失或损坏。内存中的内容可能无法刷新到磁盘，正在运行的 IO 可能会丢失。可能会跳过关闭脚本。如果继续强制停止，则可能会导致更多数据丢失或损坏。在极少数情况下，会导致停止后写入 EBS 卷或其他共享资源。

**何时使用：**当您想确保您的实例将停止并且想要绕过操作系统正常关闭时。如果在执行操作系统正常关闭的默认停止时使用，则将绕过操作系统正常关闭。
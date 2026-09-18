

# 实例终止的工作原理
<a name="how-ec2-instance-termination-works"></a>

当终止实例时，则会在实例的操作系统（OS）级别注册更改，一些资源会丢失，而一些资源会持续存在。

下图显示了 Amazon EC2 实例终止后丢失的内容和仍然存在的情况。实例终止后，任何实例存储卷上的数据和存储在实例 RAM 中的数据都将擦除。与实例关联的任何弹性 IP 地址都将分离。对于 Amazon EBS 根卷和数据卷，结果取决于每个卷的**终止时删除**设置。

![实例终止时，IP 地址、RAM、实例存储卷和 EBS 根卷都将丢失。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/terminate-instance.png)


## 注意事项
<a name="terminate-instance-overview"></a>
+ **数据持久性**
  + 实例存储卷：当实例终止时，所有数据将永久删除。
  + EBS 根卷：
    + 如果启动时附加，则实例终止时默认删除。
    + 如果启动后附加，则实例终止时默认存在。
  + EBS 数据卷：
    + 如果启动时使用控制台附加：实例终止时默认存在。
    + 如果启动时使用 CLI 附加：实例终止时默认删除。
    + 如果启动后使用控制台或 CLI 附加：实例终止时默认存在。
**注意**  
任何在实例终止时未删除的卷将继续产生费用。您可以更改设置，以便在实例终止时删除或保留卷。有关更多信息，请参阅 [实例终止时保留数据](preserving-volumes-on-termination.md)。
+ **防止意外终止**
  + 要防止有人意外终止实例，请[启用终止保护](Using_ChangingDisableAPITermination.md)。
  + 要控制从实例启动关闭操作时实例停止还是终止，请更改[实例启动的关闭行为](Using_ChangingInstanceInitiatedShutdownBehavior.md)。
+ **关闭脚本**：如果您在实例终止时运行脚本，您的实例可能会异常终止，因为我们无法确保关闭脚本运行。Amazon EC2 尝试彻底关闭实例并运行任何系统关闭脚本；但是，某些事件（如硬件故障）可能会阻止这些系统关闭脚本运行。
+ **裸机实例**：x86 裸机实例不支持协同关闭。

## 在终止实例时发生的情况
<a name="what-happens-terminate"></a>

**在操作系统级别注册的更改**
+ API 请求会向访客发送按钮按下事件。
+ 该按钮按下事件致使各种系统服务停止。由 **systemd**（Linux）或系统进程（Windows）提供系统正常关闭。来自管理程序的 ACPI 关闭按钮按下事件触发正常关闭。
+ 启动 ACPI 关闭。
+ 正常关闭进程退出后，该实例将关闭。没有可配置的操作系统关闭时间。短时间内仍可在控制台中看到该实例，然后该条目将自动被删除。

**资源丢失**
+ 实例存储卷中存储的数据。
+ 如果 `DeleteOnTermination` 属性设置为 `true`，则为 EBS 根卷。
+ 如果 `DeleteOnTermination` 属性设置为 `true`，则为 EBS 数据卷（在启动时或启动后附加）。

**持续存在的资源**
+ 如果 `DeleteOnTermination` 属性设置为 `false`，则为 EBS 根卷。
+ 如果 `DeleteOnTermination` 属性设置为 `false`，则为 EBS 数据卷（在启动时或启动后附加）。

## 测试应用程序对实例终止的响应
<a name="test-terminate-instance"></a>

您可以使用 AWS Fault Injection Service 测试您的实例终止时您的应用程序如何响应。有关更多信息，请参阅[《AWS Fault Injection Service 用户指南》](https://docs.aws.amazon.com/fis/latest/userguide/what-is.html)。
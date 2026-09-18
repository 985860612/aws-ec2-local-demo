

# 停止和启动 EC2 实例的工作原理
<a name="how-ec2-instance-stop-start-works"></a>

您停止 Amazon EC2 实例时，将在实例的操作系统（OS）级别注册更改，一些资源会丢失，而另一些资源会持续存在。启动实例时，将在实例级别注册更改。

**Topics**
+ [在停止实例时发生的情况](#what-happens-stop)
+ [在启动实例时发生的情况](#what-happens-start)
+ [测试应用程序对停止和启动的响应](#test-stop-start-instance)
+ [与实例停止和启动相关的成本](#ec2-stop-start-costs)

## 在停止实例时发生的情况
<a name="what-happens-stop"></a>

以下内容描述了使用默认停止方法停止实例时通常会发生的情况。请注意，某些方面可能会因您使用的[停止方法](instance-stop-methods.md)而异。

**在操作系统级别注册的更改**
+ API 请求会向访客发送按钮按下事件。
+ 该按钮按下事件致使各种系统服务停止。来自管理程序的 ACPI 关闭按钮按下事件触发操作系统正常关闭。
+ 启动 ACPI 关闭。
+ 当操作系统正常关闭进程退出时，实例即会关闭。没有可配置的操作系统关闭时间。
+ 如果实例操作系统未在几分钟内完全关闭，则会执行硬关闭。
+ 实例将停止运行。
+ 实例的状态将先更改为 `stopping`，然后更改为 `stopped`。
+ [自动扩缩] 如果您的实例在自动扩缩组中，当实例状态处于除 `running` 以外的其他 Amazon EC2 状态，或者状态检查的状态变为 `impaired`，则 Amazon EC2 Auto Scaling 会认为实例运行不正常并予以替换。有关更多信息，请参阅《Amazon EC2 Auto Scaling 用户指南》**中的[自动扩缩组中实例的运行状况检查](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html)。
+ [Windows 实例] 当您停止和启动 Windows 实例时，启动代理将对该实例执行任务，例如更改所有附加的 Amazon EBS 卷的驱动器号。有关这些默认值以及如何更改它们的更多信息，请参阅 [使用 EC2Launch v2 代理在 EC2 Windows 实例启动期间执行任务](ec2launch-v2.md)。

**资源丢失**
+ 存储在 RAM 中的数据。
+ 实例存储卷中存储的数据。
+ Amazon EC2 在启动或开始时自动分配给实例的公有 IPv4 地址。要保留永不更改的公有 IPv4 地址，您可以将[弹性 IP 地址](elastic-ip-addresses-eip.md)与您的实例关联。

**持续存在的资源**
+ 任何挂载的 Amazon EBS 根卷和数据卷。
+ 存储在 Amazon EBS 卷中的数据。
+ 任何挂载的[网络接口](using-eni.md)。

  网络接口包括以下也会持久保留的资源：
  + 私有 IPv4 地址。
  + IPv6 地址。
  + 与实例关联的弹性 IP 地址。请注意，当实例停止时，我们[向您收取相关弹性 IP 地址的费用](elastic-ip-addresses-eip.md#eip-pricing)。

下图说明了在 EC2 实例停止后，哪些资源会持久保留，哪些资源会丢失。该图分为三个部分：第一部分标记为**正在运行的 EC2 实例**，显示处于 `running` 状态的实例及其资源。第二部分标记为**已停止的 EC2 实例**，显示处于 `stopped` 状态且相关资源会持久保留的实例。第三部分标记为**丢失**，显示实例停止后会丢失的资源。

![当实例停止时，公有 IPv4 地址、RAM 和实例存储数据会丢失。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/stop-instance.png)


有关停止 Mac 实例可能会发生情况的更多信息，请参阅 [停止或终止 Amazon EC2 Mac 实例](mac-instance-stop.md)。

## 在启动实例时发生的情况
<a name="what-happens-start"></a>
+ 大多数情况下，实例会迁移到新的底层主机（尽管在某些情况下，例如在[专属主机](dedicated-hosts-understanding.md)配置中将实例分配到主机时，它仍会保留在当前主机上）。
+ 关联的 EBS 卷和网络接口将重新连接到实例。
+ 如果该实例配置为接收公有 IPv4 地址，则 Amazon EC2 会为该实例分配一个新的公有 IPv4 地址，除非其具有辅助网络接口或与弹性 IP 地址关联的辅助私有 IPv4 地址。
+ 如果您停止置放群组中的某个实例，然后重启该实例，则其仍将在该置放群组中运行。但是，如果没有足够容量可用于该实例，则启动将会失败。如果您在已有正在运行的实例的置放群组中启动实例时接收到容量错误，请在该置放群组中停止所有实例，然后再次启动它们。启动实例可能会将实例迁移至具有针对所有请求实例的容量的硬件。

## 测试应用程序对停止和启动的响应
<a name="test-stop-start-instance"></a>

您可以使用 AWS Fault Injection Service 测试您的实例停止和启动时您的应用程序是如何响应的。有关更多信息，请参阅[《AWS Fault Injection Service 用户指南》](https://docs.aws.amazon.com/fis/latest/userguide/what-is.html)。

## 与实例停止和启动相关的成本
<a name="ec2-stop-start-costs"></a>

以下费用与停止和启动实例有关。

**正在停止**：某个实例的状态一旦变为 `shutting-down` 或 `terminated`，该实例就不再产生费用。您无需支付已停止实例的使用费或数据传输费。存储 Amazon EBS 存储卷会产生费用。

**正在启动**：每次您启动已停止的实例时，我们便会收取最低一分钟的使用费用。一分钟之后，我们仅按您使用实例的秒数收费。例如，如果您运行一个实例 20 秒后停止实例，我们将按一分钟收取费用。如果您运行一个实例 3 分 40 秒，我们将收取 3 分 40 秒的使用费用。
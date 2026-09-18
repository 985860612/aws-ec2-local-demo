

# 停止或终止 Amazon EC2 Mac 实例
<a name="mac-instance-stop"></a>

当您停止 Mac 实例时，它会保持 `stopping` 状态约 15 分钟，然后进入 `stopped` 状态。

当您停止或终止 Mac 实例时，Amazon EC2 将在底层 专属主机 上执行清理工作流程以擦除内部 SSD、清除持久 NVRAM 变量，并更新到最新的设备固件。这可确保 Mac 实例提供与其他 EC2 Nitro 实例相同的安全性和数据隐私。您还可以借助它运行最新的 macOS AMI。在清理工作流程中，专属主机临时进入待处理状态。在 x86 Mac 实例上，清理工作流程最多可能需要 50 分钟才能完成。如果 Amazon EC2 需要更新设备固件，则该工作流可能需要长达 3 小时才能完成。在 Apple silicon Mac 实例上，清理工作流最多可能需要 4.5 小时才能完成。

在清理工作流完成之前，您无法启动已停止的 Mac 实例或启动新的 Mac 实例，在该工作流完成之后，专属主机将进入 `available` 状态。

专属主机进入 `pending` 状态时，计量和计费将暂停。清理工作流程执行期间不会向您计费。

## 释放 Mac 实例的专属主机
<a name="mac-instance-release-dedicated-host"></a>

完成 Mac 实例后，您可以释放专属主机。在释放专属主机之前，必须停止或终止 Mac 实例。在分配期超过 24 小时最低限度之前，您无法释放主机。

**释放专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例并选择 **Instance state (实例状态)**，然后选择 **Stop instance (停止实例)** 或 **Terminate instance (终止实例)**。

1. 在导航窗格中，选择**专属主机**。

1. 选择专属主机，然后选择**操作**、**释放主机**。

1. 当系统提示进行确认时，选择 **Release (释放)**。
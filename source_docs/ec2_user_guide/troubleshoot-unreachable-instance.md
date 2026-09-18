

# 排查 Amazon EC2 实例无法访问的问题
<a name="troubleshoot-unreachable-instance"></a>

以下信息可帮助您排查无法访问的 Amazon EC2 实例的问题。您可以捕获屏幕截图或获取控制台输出，以便帮助诊断问题并确定您是否应重启实例。对于无法访问的 Windows 实例，请根据服务返回的屏幕截图进行问题排查。

**Topics**
+ [实例重启](#instance-console-rebooting)
+ [实例控制台输出](#instance-console-console-output)
+ [捕获无法访问的实例的屏幕截图](#instance-console-screenshot)
+ [Windows 实例的常见屏幕截图](ics-common.md)
+ [主机发生故障时的实例恢复](#instance-machine-failure)
+ [实例出现脱机后又意外重启](#troubleshoot-unavailable-instance-unexpected-reboot)

## 实例重启
<a name="instance-console-rebooting"></a>

能够重启无法访问的实例对于故障排除和一般实例管理都非常有用。

就像可以通过按下重置按钮来重置计算机一样，您可以使用 Amazon EC2 控制台、CLI 或 API 来重置 EC2 实例。有关更多信息，请参阅 [重启 Amazon EC2 实例](ec2-instance-reboot.md)。

## 实例控制台输出
<a name="instance-console-console-output"></a>

控制台输出对于问题诊断是非常有价值的工具。它尤其适合用于排查内核问题和服务配置问题，它们可能会导致实例在 SSH 后台程序启动前终止或变得不可达到。
+ **Linux 实例**：实例控制台输出显示了确切的控制台输出，在正常情况下，这些输出会在连接到计算机的物理显示器上显示。控制台输出返回缓冲的信息，该信息在实例转变状态 (启动、停止、重新引导和终止) 之后很快发布。发布的输出不会持续更新；仅当它可能是最大值时。
+ **Windows 实例**：实例控制台输出包括最后三个系统事件日志错误。

只有实例的所有人可以访问控制台输出。

您可以在实例生命周期中检索最新的串行控制台输出。仅[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)支持此选项。

------
#### [ Console ]

**获取控制台输出**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Instances (实例)**。

1. 选择实例。

1. 依次选择 **Actions (操作)**、**Monitor and troubleshoot (监控和问题排查)**、**Get system log (获取系统日志)**。

------
#### [ AWS CLI ]

**获取控制台输出**  
使用 [get-console-output](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-console-output.html) 命令。

```
aws ec2 get-console-output --instance-id {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**获取控制台输出**  
使用 [Get-EC2ConsoleOutput](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ConsoleOutput.html) cmdlet。

```
Get-EC2ConsoleOutput -InstanceId {{i-1234567890abcdef0}}
```

------

## 捕获无法访问的实例的屏幕截图
<a name="instance-console-screenshot"></a>

如果无法连接到实例，则您可以捕获实例的屏幕截图并将其作为图像查看。该图像可以让您查看实例的状态，更快地处理问题。

您可在实例运行时或在其崩溃后生成屏幕截图。生成的图像为 JPG 格式，大小不超过 100 kb。屏幕截图不会产生数据传输费用。

**限制**

以下客户端不支持此功能：
+ 裸机实例（类型 `*.metal` 的实例）
+ 实例正在使用 NVIDIA GRID 驱动程序
+ [由基于 Arm 的 Graviton 处理器支持的实例](https://aws.amazon.com/ec2/graviton/#EC2_Instances_Powered_by_AWS_Graviton_Processors)
+ AWS Outposts 上的 Windows 实例
+ AWS 本地区域上的 Windows 实例

** 区域支持**

此功能在下列区域尚未开放：
+ 亚太地区（泰国）
+ 墨西哥（中部）
+ GovCloud 区域

------
#### [ Console ]

**获取实例的屏幕截图**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Instances (实例)**。

1. 选择要捕获的实例。

1. 依次选择 **Actions (操作)**、**Monitor and troubleshoot (监控和问题排查)**、**Get instance log (获取实例屏幕截图)**。

1. 选择**下载**，或打开映像的上下文（右键单击）菜单进行下载并保存。

------
#### [ AWS CLI ]

**捕获实例的屏幕截图**  
使用 [get-console-screenshot](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-console-screenshot.html) 命令。输出为 base64 编码。

```
aws ec2 get-console-screenshot --instance-id {{i-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**捕获实例的屏幕截图**  
使用 [Get-EC2ConsoleScreenshot](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ConsoleScreenshot.html) cmdlet。输出为 base64 编码。

```
Get-EC2ConsoleScreenshot -InstanceId {{i-1234567890abcdef0}}
```

------

## 主机发生故障时的实例恢复
<a name="instance-machine-failure"></a>

如果底层主机上的硬件出现不可恢复性问题，AWS 可能会预定实例停止事件。我们会通过电子邮件提前通知您这类事件。

**恢复发生故障的主机上运行的 Amazon EBS 支持的实例**

1. 将您实例存储卷上的所有关键数据 Amazon EBS 或 Amazon S3。

1. 停止实例。

1. 启动实例。

1. 恢复所有重要数据。

有关更多信息，请参阅 [启动和停止 Amazon EC2 实例](Stop_Start.md)。

**恢复具有发生故障的主机上运行的实例存储根卷的实例**

1. 从该实例创建 AMI。

1. 将映像上传到 Amazon S3。

1. 将重要数据备份到 Amazon EBS 或 Amazon S3。

1. 终止实例。

1. 从 AMI 启动新实例。

1. 将所有重要数据恢复到新实例。

## 实例出现脱机后又意外重启
<a name="troubleshoot-unavailable-instance-unexpected-reboot"></a>

如果实例出现脱机后又意外重启，则可能是已经进行了实例自动恢复。当 AWS 检测到实例因底层硬件或软件问题而无法使用，且在该实例上启用了简化的自动恢复或基于 CloudWatch 操作的恢复时，就会出现这种情况。

在恢复过程中，AWS 尝试将实例迁移到其他硬件来恢复实例的可用性。要确认实例是否进行了实例自动恢复，请参阅[验证是否已进行实例自动恢复](verify-if-automatic-recovery-occurred.md)。

**注意**  
如果工作负载或应用程序没有响应，请检查工作负载或应用程序是否是在实例上运行。如果不是，则手动启动工作负载或应用程序。为防将来出现此问题，请实施恢复计划，确保工作负载或应用程序在实例恢复后能正常运行。
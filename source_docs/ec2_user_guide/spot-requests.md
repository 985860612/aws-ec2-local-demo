

# 创建竞价型实例请求
<a name="spot-requests"></a>

要使用竞价型实例，您需要创建竞价型实例请求，其中包括所需实例数量、实例类型以及可用区。当有容量可用时，Amazon EC2 将立即满足您的请求。否则，Amazon EC2 将等待直至可以完成您的请求，或者直至您取消请求。

您可以使用 Amazon EC2 控制台中的[启动实例向导](ec2-launch-instance-wizard.md)或 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令以与启动按需型实例相同的方式请求竞价型实例。建议使用此方法的原因如下：
+ 您已经在使用[启动实例向导](ec2-launch-instance-wizard.md)或 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令启动按需型实例，而且只想通过更改单个参数来更改为启动竞价型实例。
+ 您不需要多个实例类型不同的实例。

通常不建议使用此方法来启动竞价型实例，因为您无法指定多种实例类型，也无法在同一请求中启动竞价型实例和按需型实例。有关启动竞价型实例的首选方法（包括启动*实例集*，其中包含具有多种实例类型的竞价型实例和按需型实例类型），请参阅 [使用哪种竞价型请求方法最好？](spot-best-practices.md#which-spot-request-method-to-use)

如果您一次请求了多个竞价型实例，Amazon EC2 将创建单独的竞价型实例，这样您可以分别跟踪各个请求的状态。有关跟踪竞价型实例请求的更多信息，请参阅 [获取竞价型实例请求的状态](spot-request-status.md)。

------
#### [ Console ]<a name="create-spot-instance-request-console-procedure"></a>

**创建竞价型实例请求**

步骤 1-9 与启动按需型实例时使用的步骤相同。在步骤 10 中，您配置竞价型实例请求。

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在屏幕顶部的导航栏中，选择一个区域。

1. 从 Amazon EC2 控制台控制面板中，选择**启动实例**。

1. （可选）在**Name and tags**（名称和标签）下，您可以为实例命名，并为竞价型实例请求、实例、卷和弹性图形添加标签。有关标签的信息，请参阅 [标记 Amazon EC2 资源](Using_Tags.md)。

   1. 对于 **Name**（名称），为您的实例输入一个描述性名称。

      实例名称是一个标签，其中密钥为**名称**，而值为您指定的名称。如果您没有指定名称，则可以通过其 ID 标识实例，该 ID 将在您启动实例时自动生成。

   1. 要为竞价型实例请求、实例、卷和弹性图形添加标签，请选择 **Add additional tags**（添加其他标签）。选择**添加标签**，然后输入密钥和值，然后选择要标记的资源类型。为每个要添加的其它标签选择**添加标签**。

1. 在**应用程序和操作系统镜像（亚马逊机器映像）**下，为您的实例选择操作系统（OS），然后选择 AMI。有关更多信息，请参阅 [应用程序和操作系统映像（亚马逊机器映像）](ec2-instance-launch-parameters.md#liw-ami)。

1. 在 **Instance type**（实例类型）下，请选择符合您对实例硬件配置和大小要求的实例类型。有关更多信息，请参阅 [实例类型](ec2-instance-launch-parameters.md#liw-instance-type)。

1. 在 **Key pair（login）**（密钥对（登录））下，选择一个现有密钥对，或选择 **Create new key pair**（创建新密钥对）来新建一个密钥对。有关更多信息，请参阅 [Amazon EC2 密钥对和 Amazon EC2 实例](ec2-key-pairs.md)。
**重要**  
如果您选择 **Proceed without key pair (Not recommended)**（在没有密钥对的情况下继续（不推荐））选项，则将无法连接到此实例，除非您选择配置为允许用户以其它方式登录的 AMI。

1. 在 **Network settings**（网络设置）下，使用默认设置，或选择 **Edit**（编辑）根据需要配置网络设置。

   安全组构成了网络设置的一部分，并为实例定义防火墙规则。这些规则指定哪些传入的网络流量可传输到您的实例。

   有关更多信息，请参阅 [网络设置](ec2-instance-launch-parameters.md#liw-network-settings)。

1. 您选择的 AMI 包含一个或多个存储卷，包括根设备卷。在 **Configure storage**（配置存储）下，您可以选择 **Add new volume**（添加新卷）来指定要附加到实例的其他卷。有关更多信息，请参阅 [配置存储](ec2-instance-launch-parameters.md#liw-storage)。

1. 在 **Advanced details**（高级详细信息）下，按如下方式配置竞价型实例请求：

   1. 在**购买选项**下，选择**请求竞价型实例**复选框。

   1. 您可以保留竞价型实例请求的默认配置，也可以选择（位于右侧的） **Customize**（自定义）为竞价型实例请求指定自定义设置。

      选择 **Customize**（自定义）后，将显示以下字段。

      1. **Maximum price**（最高价）：您可以以 Spot 价格请求竞价型实例，上限为按需价格，也可以指定您愿意支付的最高金额。
**警告**  
如果您指定了某个最高价，则实例被中断的频率将比您选择 **No maximum price**（无最高价）时更高。  
如果您指定最高价格，则该价格必须高于 0.001 美元。指定低于 0.001 美元的值将导致启动失败。
         + **No maximum price**（无最高价）：您的竞价型实例将以当前的 Spot 价格启动。价格永远不会超过按需价格。（建议）
         + **Set your maximum price (per instance/hour)**（设置最高价（每实例/小时））：您可以指定愿意支付的最高金额。
           + 如果您指定的最高价低于 Spot 价格，则不会启动您的竞价型实例。
           + 如果您指定的最高价高于当前 Spot 价格，则您的竞价型实例将按当前 Spot 价格启动和计费。竞价型实例运行后，如果 Spot 价格上涨到超过您的最高价格，Amazon EC2 将中断您的竞价型实例。
           + 无论您指定哪种最高价，都将始终按当前的 Spot 价格向您收取费用。

           要查看 Spot 价格趋势，请参阅 [查看竞价型实例定价历史记录](using-spot-instances-history.md)。

      1. **Request type**（请求类型）：您选择的竞价型实例请求类型决定了竞价型实例中断时会发生什么。
         + **One-time**（一次性）：Amazon EC2 为您的竞价型实例发出一次性请求。如果您的竞价型实例被中断，不会重新提交请求。
         + **Persistent request**（持久性请求）：Amazon EC2 对您的竞价型实例发出持久请求。如果您的竞价型实例中断，则将重新提交请求以补充中断的竞价型实例。

         如果您未指定值，则默认值为一次性请求。

      1. **Valid to**（有效截止时间）：*持久性*竞价型实例请求的到期日期。

         一次性请求不支持此字段。*一次性*请求在请求中的所有实例启动或者您取消请求前保持有效。
         + **No request expiry date**（没有请求到期日期）：请求在您将其取消之前保持有效。
         + **Set your request expiry date**（设置请求到期日期）：持久性请求将保持活动状态，直到您指定的日期或取消该请求为止。

      1. **Interruption behavior**（中断行为）：您选择的行为决定了竞价型实例中断时会发生什么。
         + 对于持久性请求，有效值为 **Stop**（停止）和 **Hibernate**（休眠）。实例停止后，将收取 EBS 卷存储费用。
**注意**  
竞价型实例现在使用与按需型实例相同的休眠功能。要启用休眠，您可以在此处选择**休眠**，也可以在启动实例向导下方显示的**停止 - 休眠行为**字段中选择**启用**。有关休眠的先决条件，请参阅 [EC2 实例休眠的先决条件](hibernating-prerequisites.md)。
         + 对于一次性请求，只有 **Terminate**（终止）有效。

         如果您未指定值，则默认值为 **Terminate**（终止），这对持久性竞价型实例请求无效。如果您保持默认设置并尝试启动持久性竞价型实例请求，则会收到错误消息。

         有关更多信息，请参阅 [竞价型实例中断行为](interruption-behavior.md)。

1. 在存储库的 **Summary**（摘要）面板，对于 **Number of instances**（实例数量），输入要启动的实例数量。
**注意**  
Amazon EC2 为每个竞价型实例创建一个单独的请求。

1. 在 **Summary**（摘要）面板，查看实例的详细信息并进行必要的更改。在提交竞价型实例请求后，您无法更改该请求的参数。您可以在 **Summary**（摘要）面板选择启动实例向导中某部分的链接以直接导航到该部分。有关更多信息，请参阅 [摘要](ec2-instance-launch-parameters.md#liw-summary)。

1. 当您准备好启动您的实例时，请选择 **Launch instance**（启动实例）。

   如果实例无法启动或状态立即转至 `terminated` 而非 `running`，请参阅 [排查 Amazon EC2 实例启动问题](troubleshooting-launch.md)。

------
#### [ AWS CLI ]

**使用 run-instances 创建竞价型实例请求**  
按如下所示，使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令并在 `--instance-market-options` 参数中指定竞价型实例选项。

```
--instance-market-options file://{{spot-options.json}}
```

以下是要在 JSON 文件中指定的数据结构。您还可以指定 `ValidUntil` 和 `InstanceInterruptionBehavior`。如果未在数据结构中指定字段，则将使用默认值。

以下示例将创建一个 `persistent` 请求。

```
{
  "MarketType": "spot",
  "SpotOptions": {
    "SpotInstanceType": "{{persistent}}"
  }
}
```

**使用 request-spot-instances 创建竞价型实例请求**

**注意**  
我们强烈反对使用 [request-spot-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-instances.html) 命令来请求竞价型实例，因为它是不具有计划投资的旧式 API。有关更多信息，请参阅 [使用哪种竞价型请求方法最好？](spot-best-practices.md#which-spot-request-method-to-use)

使用 [request-spot-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-instances.html) 命令可创建一次性请求。

```
aws ec2 request-spot-instances \
    --instance-count {{5}} \
    --type "one-time" \
    --launch-specification file://{{specification.json}}
```

使用 [request-spot-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-instances.html) 命令可创建持久性请求。

```
aws ec2 request-spot-instances \
    --instance-count {{5}} \
    --type "persistent" \
    --launch-specification file://{{specification.json}}
```

有关要用于这些命令的启动规范文件的示例，请参阅[竞价型实例请求示例启动规范](spot-request-examples.md)。如果您从竞价型请求控制台下载启动规范文件，必须改为使用 [request-spot-fleet](https://docs.aws.amazon.com/cli/latest/reference/ec2/request-spot-fleet.html) 命令（竞价型请求控制台使用竞价型实例集指定竞价型实例请求）。

------
#### [ PowerShell ]

**创建竞价型实例请求**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 并使用 `-InstanceMarketOption` 参数指定竞价型实例选项。

```
-InstanceMarketOptions $marketOptions
```

按如下所示创建竞价型实例选项的数据结构。

```
$spotOptions = New-Object Amazon.EC2.Model.SpotMarketOptions
$spotOptions.SpotInstanceType="persistent"
$marketOptions = New-Object Amazon.EC2.Model.InstanceMarketOptionsRequest
$marketOptions.MarketType = "spot"
$marketOptions.SpotOptions = $spotOptions
```

------


# 为 EC2 实例配置 ENA Express 设置
<a name="ena-express-configure"></a>

您可为支持的 EC2 实例类型配置 ENA Express，而无需安装任何其他软件。有关更多信息，请参阅 [ENA Express 支持的实例类型](ena-express.md#ena-express-supported-instance-types)。

------
#### [ Console ]

**管理网络接口的 ENA Express**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Network interfaces**（网络接口）。

1. 选择附加到实例的网络接口。您可以选择 **Network interface ID**（网络接口 ID）链接以打开详情页面，也可以选择列表左侧的复选框。

1. 从页面右上角的 **Action**（操作）菜单中选择 **Manage ENA Express**（管理 ENA Express）。这样将打开 **Manage ENA Express**（管理 ENA Express）对话框，显示选定的网络接口 ID 和当前设置。

   如果您选择的网络接口未附加到实例，则菜单中不会出现此操作。

1. 要使用 **ENA Express**，请选择**启用**复选框。

1. 启用 ENA Express 后，您可以配置 UDP 设置。要使用 **ENA Express UDP**，请选择**启用**复选框。

1. 选择**保存**以保存您的设置。

**管理实例的 ENA Express**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Instances (实例)**。

1. 选择想要管理的实例。您可以选择 **Instance ID**（实例 ID）以打开详情页面，也可以选择列表左侧的复选框。

1. 选择要为您的实例配置的 **Network interface**（网络接口）。

1. 从页面右上角的 **Action**（操作）菜单中选择 **Manage ENA Express**（管理 ENA Express）。

1. 要为附加到实例的网络接口配置 ENA Express，请从 **Network interface**（网络接口）列表中进行选择。

1. 要对选定的网络接口附件使用 **ENA Express**，请选择**启用**复选框。

1. 启用 ENA Express 后，您可以配置 UDP 设置。要使用 **ENA Express UDP**，请选择**启用**复选框。

1. 选择**保存**以保存您的设置。

**挂载网络接口时配置 ENA Express**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Network interfaces**（网络接口）。

1. 选择未附加到实例的网络接口 [**Status**（状态）为**可用**]。您可以选择 **Network interface ID**（网络接口 ID）链接以打开详情页面，也可以选择列表左侧的复选框。

1. 选择要附加到的 **Instance**（实例）。

1. 将网络接口附加到实例后要使用 **ENA Express**，请选择**启用**复选框。

1. 启用 ENA Express 后，您可以配置 UDP 设置。要使用 **ENA Express UDP**，请选择**启用**复选框。

1. 要将网络接口附加到实例并保存 ENA Express 设置，请选择 **Attach**（附加）。

------
#### [ AWS CLI ]

**挂载网络接口时配置 ENA Express**  
使用 [attach-network-interface](https://docs.aws.amazon.com/cli/latest/reference/;attach-network-interface.html) 命令，如以下示例所示。

**示例 1：将 ENA Express 用于 TCP 流量，而非 UDP 流量**  
此示例将 `EnaSrdEnabled` 配置为 `true`，且允许 `EnaSrdUdpEnabled` 默认为 `false`。

```
aws ec2 attach-network-interface \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --instance-id {{i-1234567890abcdef0}} \
    --device-index 1 \
    --ena-srd-specification 'EnaSrdEnabled=true'
```

**示例 2：将 ENA Express 用于 TCP 流量和 UDP 流量**  
此示例将 `EnaSrdEnabled` 和 `EnaSrdUdpEnabled` 均配置为 `true`。

```
aws ec2 attach-network-interface \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --instance-id {{i-1234567890abcdef0}} \
    --device-index 1 \
    --ena-srd-specification 'EnaSrdEnabled=true,EnaSrdUdpSpecification={EnaSrdUdpEnabled=true}'
```

**更新网络接口挂载的 ENA Express 设置**  
使用 [modify-network-interface-attribute](https://docs.aws.amazon.com/cli/latest/reference/modify-network-interface-attribute.html) 命令，如以下示例所示。

**示例 1：将 ENA Express 用于 TCP 流量，而非 UDP 流量**  
此示例将 `EnaSrdEnabled` 配置为 `true`，并且如果之前从未设置过，则允许 `EnaSrdUdpEnabled` 默认为 `false`。

```
aws ec2 modify-network-interface-attribute \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --ena-srd-specification 'EnaSrdEnabled=true'
```

**示例 2：将 ENA Express 用于 TCP 流量和 UDP 流量**  
此示例将 `EnaSrdEnabled` 和 `EnaSrdUdpEnabled` 均配置为 `true`。

```
aws ec2 modify-network-interface-attribute \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --ena-srd-specification 'EnaSrdEnabled=true,EnaSrdUdpSpecification={EnaSrdUdpEnabled=true}'
```

**示例 3：停止将 ENA Express 用于 UDP 流量**  
此示例将 `EnaSrdUdpEnabled` 配置为 `false`。

```
aws ec2 modify-network-interface-attribute \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --ena-srd-specification 'EnaSrdUdpSpecification={EnaSrdUdpEnabled=false}'
```

------
#### [ PowerShell ]

**挂载网络接口时配置 ENA Express**  
使用 [Add-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/Add-EC2NetworkInterface.html) cmdlet，如以下示例中所示。

**示例 1：将 ENA Express 用于 TCP 流量，而非 UDP 流量**  
此示例将 `EnaSrdEnabled` 配置为 `true`，且允许 `EnaSrdUdpEnabled` 默认为 `false`。

```
Add-EC2NetworkInterface `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -InstanceId {{i-1234567890abcdef0}} `
    -DeviceIndex {{1}} `
    -EnaSrdSpecification_EnaSrdEnabled $true
```

**示例 2：将 ENA Express 用于 TCP 流量和 UDP 流量**  
此示例将 `EnaSrdEnabled` 和 `EnaSrdUdpEnabled` 均配置为 `true`。

```
Add-EC2NetworkInterface `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -InstanceId {{i-1234567890abcdef0}} `
    -DeviceIndex {{1}} `
    -EnaSrdSpecification_EnaSrdEnabled $true `
    -EnaSrdUdpSpecification_EnaSrdUdpEnabled $true
```

**配置网络接口挂载的 ENA Express 设置**  
使用 [Edit-EC2NetworkInterfaceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2NetworkInterfaceAttribute.html) cmdlet，如以下示例中所示。

**示例 1：将 ENA Express 用于 TCP 流量，而非 UDP 流量**  
此示例将 `EnaSrdEnabled` 配置为 `true`，并且如果之前从未设置过，则允许 `EnaSrdUdpEnabled` 默认为 `false`。

```
Edit-EC2NetworkInterfaceAttribute `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -EnaSrdSpecification_EnaSrdEnabled $true ; 
Get-EC2NetworkInterface -NetworkInterfaceId eni-{{0123f4567890a1b23}} | `
Select-Object `
    NetworkInterfaceId, 
    @{Name = 'EnaSrdEnabled'; Expression = { $_.Attachment.EnaSrdSpecification.EnaSrdEnabled }}, 
    @{Name = 'EnaSrdUdpEnabled'; Expression = { $_.Attachment.EnaSrdSpecification.EnaSrdUdpSpecification.EnaSrdUdpEnabled }} | `
Format-List
```

**示例 2：将 ENA Express 用于 TCP 流量和 UDP 流量**  
此示例将 `EnaSrdEnabled` 和 `EnaSrdUdpEnabled` 均配置为 `true`。

```
Edit-EC2NetworkInterfaceAttribute `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -EnaSrdSpecification_EnaSrdEnabled $true `
    -EnaSrdSpecification_EnaSrdUdpSpecification_EnaSrdUdpEnabled $true ;
Get-EC2NetworkInterface -NetworkInterfaceId {{eni-1234567890abcdef0}} | `
Select-Object `
    NetworkInterfaceId, 
    @{Name = 'EnaSrdEnabled'; Expression = { $_.Attachment.EnaSrdSpecification.EnaSrdEnabled }}, 
    @{Name = 'EnaSrdUdpEnabled'; Expression = { $_.Attachment.EnaSrdSpecification.EnaSrdUdpSpecification.EnaSrdUdpEnabled }} | `
Format-List
```

**示例 3：停止将 ENA Express 用于 UDP 流量**  
此示例将 `EnaSrdUdpEnabled` 配置为 `false`。

```
Edit-EC2NetworkInterfaceAttribute `
    -NetworkInterfaceId eni-{{0123f4567890a1b23}} `
    -EnaSrdSpecification_EnaSrdUdpSpecification_EnaSrdUdpEnabled $false ; 
Get-EC2NetworkInterface -NetworkInterfaceId eni-{{0123f4567890a1b23}} | `
Select-Object `
    NetworkInterfaceId, 
    @{Name = 'EnaSrdEnabled'; Expression = { $_.Attachment.EnaSrdSpecification.EnaSrdEnabled }}, 
    @{Name = 'EnaSrdUdpEnabled'; Expression = { $_.Attachment.EnaSrdSpecification.EnaSrdUdpSpecification.EnaSrdUdpEnabled }} | `
Format-List
```

------

## 启动时配置 ENA Express
<a name="ena-express-configure-on-launch"></a>

启动实例时，您可以使用以下方法之一直接配置 ENA Express。指定的链接会提供关于这些方法的 AWS 管理控制台 说明。
+ **启动实例向导**：使用启动实例向导时，可以在启动时配置 ENA Express。有关详细信息，请参阅启动实例向导[网络设置](ec2-instance-launch-parameters.md#liw-network-settings)中的**高级网络配置**。
+ **启动模板**：使用启动模板时，可以在启动时配置 ENA Express。有关更多信息，请参阅[创建 Amazon EC2 启动模板](create-launch-template.md)页面，然后展开**网络设置**部分，从中查看**高级网络配置**。
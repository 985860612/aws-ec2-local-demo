

# 使用 EC2Rescue CLI 对受损的 Windows 实例进行问题排查
<a name="ec2rw-cli"></a>

利用 EC2Rescue for Windows Server 命令行界面 (CLI)，您可以编程方式运行 EC2Rescue for Windows Server 插件（称为“操作”）。

EC2Rescue for Windows Server 工具有两种执行模式：
+ **/online** — 这允许您对安装了 EC2Rescue for Windows Server 的实例执行操作（如收集日志文件）。
+ **/offline:<device\_id>** — 这允许您对附加到单独的 Amazon EC2 Windows 实例（已安装 EC2Rescue for Windows Server）的脱机根卷执行操作。

将 [EC2Rescue for Windows Server](https://s3.amazonaws.com/ec2rescue/windows/EC2Rescue_latest.zip?x-download-source=docs) 工具下载到您的 Windows 实例并提取文件。您可以使用以下命令查看帮助文件：

```
EC2RescueCmd.exe /help
```

EC2Rescue for Windows Server 可对 Amazon EC2 Windows 实例执行下列操作：
+ [收集操作](#ec2rw-collect)
+ [救援行动](#ec2rw-rescue)
+ [还原操作](#ec2rw-restore)

## 收集操作
<a name="ec2rw-collect"></a>

**注意**  
您可以收集所有日志、整个日志组或一个组中的单个日志。

EC2Rescue for Windows Server 可以从**活动实例和离线实例**收集以下数据。


| 日志组 | 可用日志 | 说明 | 
| --- | --- | --- | 
| all |  | 收集所有可用日志。 | 
| eventlog |  +  `'Application'` <br />+  `'System'` <br />+  `'EC2ConfigService'`   | 收集应用程序、系统和 EC2Config 事件日志。 | 
| memory-dump |  +  `'Memory Dump File'` <br />+  `'Mini Dump Files'`   | 收集实例上的所有内存转储文件。 | 
| ec2config |  +  `'Log Files'` <br />+  `'Configuration Files'`   | 收集 EC2Config 服务生成的日志文件。 | 
| ec2launch |  +  `'Logs'` <br />+  `'Config'`   | 收集 EC2Launch 脚本生成的日志文件。 | 
| ssm-agent |  +  `'Log Files'` <br />+  `'Patch Baseline Logs'` <br />+  `'InstanceData'`   | 收集 SSM Agent 生成的日志文件和 Patch Manager 日志。 | 
| sysprep | 'Log Files' | 收集 Windows 系统准备工具生成的日志文件。 | 
| driver-setup |  +  `'SetupAPI Log Files'` <br />+  `'DPInst Log File'` <br />+  `'AWS PV Setup Log File'`   | 收集 Windows SetupAPI 日志 (setupapi.dev.log 和 setupapi.setup.log)。 | 
| registry |  +  `'SYSTEM'` <br />+  `'SOFTWARE'` <br />+  `'BCD'`   | 收集 SYSTEM 和 SOFTWARE Hive。 | 
| egpu |  +  `'Event Log'` <br />+  `'System Files'`   | 收集与 Elastic GPU 相关的事件日志。 | 
| boot-config | 'BCDEDIT Output' | 收集 HKEY\_LOCAL\_MACHINE\\BCD00000000 Hive。 | 
| windows-update | 'Log Files' | 收集 Windows 更新生成的日志文件。在 Windows Server 2016 及更高版本中，日志以 Windows 事件跟踪 (ETW) 格式收集。 | 
| cloudendure |  +  `'Migrate Script Logs'` <br />+  `'Driver Logs'` <br />+  `'CloudEndure File List'`   | 收集与 CloudEndure 代理相关的日志文件。 | 

EC2Rescue for Windows Server 可以从**活动实例**收集以下额外数据。


| 日志组 | 可用日志 | 说明 | 
| --- | --- | --- | 
| system-info | 'MSInfo32 Output' | 收集 MSInfo32。 | 
| gpresult | 'GPResult Output' | 收集组策略报告。 | 

可用选项如下：
+ **/output:<outputFilePath>** – 使用 zip 格式保存收集的日志文件所需的目标文件路径位置。
+ **/no-offline** – 离线模式下使用的可选属性。不会在完成操作后将卷设置为脱机。
+ **/no-fix-signature** – 离线模式下使用的可选属性。不会在完成操作后修复可能的磁盘签名冲突。

### 示例
<a name="ec2rw-collect-examples"></a>

以下示例使用的是 EC2Rescue for Windows Server CLI。

#### 在线模式示例
<a name="ec2rw-collect-examples-online"></a>

收集所有可用日志：

```
EC2RescueCmd /accepteula /online /collect:all /output:<outputFilePath>
```

仅收集特定日志组：

```
EC2RescueCmd /accepteula /online /collect:ec2config /output:<outputFilePath>
```

收集日志组中的单个日志：

```
EC2RescueCmd /accepteula /online /collect:'ec2config.Log Files,driver-setup.SetupAPI Log Files' /output:<outputFilePath>
```

#### 离线模式示例
<a name="ec2rw-collect-examples-offline"></a>

从 EBS 卷收集所有可用日志。该卷按 device\_id 值指定。

```
EC2RescueCmd /accepteula /offline:{{xvdf}} /collect:all /output:<outputFilePath>
```

仅收集特定日志组：

```
EC2RescueCmd /accepteula /offline:{{xvdf}} /collect:ec2config /output:<outputFilePath>
```

## 救援行动
<a name="ec2rw-rescue"></a>

EC2Rescue for Windows Server 可以使用以下服务设置检测和解决问题：


|  服务组  | 可用操作 |  说明  | 
| --- | --- | --- | 
| all |  |  | 
| system-time | 'RealTimeIsUniversal' | 系统时间+  **RealTimeisUniversal** – 检测是否已启用 `RealTimeisUniversal` 注册表项。如果禁用，当时区设置为非 UTC 的值时，Windows 系统时间将有偏差。  | 
| firewall |  +  `'Domain networks'` <br />+  `'Private networks'` <br />+  `'Guest or public networks'`   | Windows 防火墙+  **域网络** – 检测是否已启用或禁用此 Windows 防火墙配置文件。 <br />+  **私有网络** – 检测是否已启用或禁用此 Windows 防火墙配置文件。 <br />+  **访客或公有网络** – 检测是否已启用或禁用此 Windows 防火墙配置文件。  | 
| rdp |  +  `'Service Start'` <br />+  `'Remote Desktop Connections'` <br />+  `'TCP Port'`   | 远程桌面+  **服务启动** – 检测是否已启用远程桌面服务。 <br />+  **远程桌面连接** – 检测是否已启用。 <br />+  **TCP 端口** – 检测远程桌面服务正在侦听的端口。  | 
| ec2config |  +  `'Service Start'` <br />+  `'Ec2SetPassword'` <br />+  `'Ec2HandleUserData'`   | EC2Config+  **服务启动** – 检测是否已启用 EC2Config 服务。 <br />+  **Ec2SetPassword** – 生成新的管理员密码。 <br />+  **Ec2HandleUserData** – 在实例下一次启动时允许您运行用户数据脚本。  | 
| ec2launch | 'Reset Administrator Password' | 生成新的 Windows 管理员密码。 | 
| network | 'DHCP Service Startup' | 网络接口+  **DHCP 服务启动** – 检测是否已启用 DHCP 服务。  | 

可用选项如下：
+ **/level:<level>** – 操作应触发的检查级别的可选属性。允许的值包括：`information`、`warning`、`error`、`all`。默认情况下，将它设置为 `error`。
+ **/check-only** – 可生成报告但不修改离线卷的可选属性。
**注意**  
如果 EC2Rescue for Windows Server 检测到可能存在磁盘签名冲突，则默认情况下，即使您使用 `/check-only` 选项，它也会在此离线过程完成后更正签名。必须使用 `/no-fix-signature` 选项才能阻止更正。
+ **/no-offline** – 可防止在完成操作之后将卷设置为离线的可选属性。
+ **/no-fix-signature** – 不会在完成操作后修复可能的磁盘签名冲突的可选属性。

### 救援示例
<a name="ec2rw-rescue-examples"></a>

以下示例使用的是 EC2Rescue for Windows Server CLI。该卷是使用 device\_id 值指定的。

尝试修复在卷上发现的所有问题：

```
EC2RescueCmd /accepteula /offline:{{xvdf}} /rescue:all
```

尝试修复卷上的一个服务组内的所有问题：

```
EC2RescueCmd /accepteula /offline:{{xvdf}} /rescue:firewall
```

尝试修复卷上的一个服务组内的特定项目：

```
EC2RescueCmd /accepteula /offline:{{xvdf}} /rescue:rdp.'Service Start'
```

指定在一个卷上要尝试修复的多个问题：

```
EC2RescueCmd /accepteula /offline:{{xvdf}} /rescue:'system-time.RealTimeIsUniversal,ec2config.Service Start'
```

## 还原操作
<a name="ec2rw-restore"></a>

EC2Rescue for Windows Server 可以使用以下服务设置检测和解决问题：


|  服务组  | 可用操作 |  说明  | 
| --- | --- | --- | 
| 还原上次已知的正常配置 | lkgc | 上次已知的正常配置 – 尝试以上次已知的可启动状态启动实例。 | 
| 从最新备份还原 Windows 注册表 | regback | 从备份还原注册表 – 从 \\Windows\\System32\\config\\RegBack 还原注册表。 | 

可用选项如下：
+ **/no-offline** — 可防止在完成操作之后将卷设置为脱机的可选属性。
+ **/no-fix-signature** — 不会在完成操作后修复可能的磁盘签名冲突的可选属性。

### 还原示例
<a name="ec2rw-restore-examples"></a>

以下示例使用的是 EC2Rescue for Windows Server CLI。该卷是使用 device\_id 值指定的。

在卷上还原上次已知的正常配置：

```
EC2RescueCmd /accepteula /offline:{{xvdf}} /restore:lkgc
```

在卷上还原上一个 Windows 注册表备份：

```
EC2RescueCmd /accepteula /offline:{{xvdf}} /restore:regback
```


# 使用 EC2Rescue GUI 对受损的 Windows 实例进行问题排查
<a name="ec2rw-gui"></a>

EC2Rescue for Windows Server 可以对**离线实例**执行以下分析：


| 选项 | 描述 | 
| --- | --- | 
| 诊断和抢救 | EC2Rescue for Windows Server 可以使用以下服务设置检测和解决问题：+  系统时间   **RealTimeisUniversal** – 检测是否已启用 `RealTimeisUniversal` 注册表项。如果禁用，当时区设置为非 UTC 的值时，Windows 系统时间将有偏差。   +  Windows 防火墙   **域网络** – 检测是否已启用或禁用此 Windows 防火墙配置文件。   **私有网络** – 检测是否已启用或禁用此 Windows 防火墙配置文件。   **访客或公有网络** – 检测是否已启用或禁用此 Windows 防火墙配置文件。   +  远程桌面   **服务启动** – 检测是否已启用远程桌面服务。   **远程桌面连接** – 检测是否已启用。   **TCP 端口** – 检测远程桌面服务正在侦听的端口。   +  EC2Config（Windows Server 2012 R2 及更早版本）   **安装** – 检测所安装的 EC2Config 版本。   **服务启动** – 检测是否已启用 EC2Config 服务。   **Ec2SetPassword** – 生成新的管理员密码。   **Ec2HandleUserData** – 在实例下一次启动时允许您运行用户数据脚本。   +  EC2Launch（Windows Server 2016 及更高版本）   **安装** – 检测所安装的 EC2Launch 版本。   **Ec2SetPassword** – 生成新的管理员密码。   +  网络接口   **DHCP 服务启动** – 检测是否已启用 DHCP 服务。   **以太网详细信息** – 显示检测到的网络驱动器的版本信息。   **以太网上的 DHCP** – 检测是否已启用 DHCP。   <br />+  磁盘签名状态   **Signature on disk**（磁盘上的签名）和 **Signature on Boot Configuration Database (BCD)**（启动配置数据库 (BCD) 上的签名）– 检测磁盘签名和 BCD 签名是否相同。如果值不同，EC2Rescue 会尝试使用 BCD 上的签名覆盖磁盘签名。    | 
| Restore | 执行以下操作之一：+  **上次已知的正常配置** – 尝试以上次已知的可启动状态启动实例。 <br />+  **从备份还原注册表** – 从 `\Windows\System32\config\RegBack` 还原注册表。  | 
| 捕获日志 | 允许您捕获实例的日志，用于分析。 | 

EC2Rescue for Windows Server 可以从**活动实例和离线实例**收集以下数据：


| 项目 | 说明 | 
| --- | --- | 
| Event Log (事件日志) | 收集应用程序、系统和 EC2Config 事件日志。 | 
| 注册表 | 收集 SYSTEM 和 SOFTWARE Hive。 | 
| Windows 更新日志 | 收集 Windows 更新生成的日志文件。在 Windows Server 2016 及更高版本中，日志以 Windows 事件跟踪 (ETW) 格式收集。 | 
| Sysprep 日志 | 收集 Windows 系统准备工具生成的日志文件。 | 
| 驱动程序安装日志 | 收集 Windows SetupAPI 日志 (setupapi.dev.log 和 setupapi.setup.log)。 | 
| 启动配置 | 收集 HKEY\_LOCAL\_MACHINE\\BCD00000000 Hive。 | 
| 内存转储 | 收集实例上的所有内存转储文件。 | 
| EC2Config 文件 | 收集 EC2Config 服务生成的日志文件。 | 
| EC2Launch 文件 | 收集 EC2Launch 脚本生成的日志文件。 | 
| SSM Agent 文件 | 收集 SSM Agent 生成的日志文件和 Patch Manager 日志。 | 
| EC2 ElasticGPU 文件 | 收集与 Elastic GPU 相关的事件日志。 | 
| ECS | 收集与 Amazon ECS 相关的日志。 | 
| CloudEndure | 收集与 CloudEndure 代理相关的日志文件。 | 
| AWS适用于 MGN 或 DRS 日志文件的 Replication Agent | 收集与 AWS Transform MGN 或 AWS 弹性灾难恢复相关的日志文件。 | 

EC2Rescue for Windows Server 可以从**活动实例**收集以下额外数据：


| 项目 | 说明 | 
| --- | --- | 
| 信息系统 | 收集 MSInfo32。 | 
| 组策略结果 | 收集组策略报告。 | 

## 分析离线实例
<a name="ec2rescue-offline"></a>

**Offline Instance** 选项在调试 Windows 实例的启动问题时很有用。

**在离线实例上执行操作**

1. 在正在运行的 Windows Server 实例上，下载 [EC2Rescue for Windows Server](https://s3.amazonaws.com/ec2rescue/windows/EC2Rescue_latest.zip?x-download-source=docs) 工具并提取文件。

   您可以运行以下 PowerShell 命令以下载 EC2Rescue，而无需更改 Internet Explorer 增强安全性配置 (ESC)：

   ```
   Invoke-WebRequest https://s3.amazonaws.com/ec2rescue/windows/EC2Rescue_latest.zip -OutFile $env:USERPROFILE\Desktop\EC2Rescue_latest.zip
   ```

   该命令将 EC2Rescue .zip 文件下载到当前登录用户的桌面中。
**注意**  
如果您在下载文件时收到错误，并且正在使用 Windows Server 2016 或更早的版本，则可能需要为 PowerShell 终端启用 TLS 1.2。可以使用以下命令为当前 PowerShell 会话启用 TLS 1.2，然后重试：  

   ```
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
   ```

1. 停止出现故障的实例 (如果目前尚未停止)。

1. 从出现故障的实例中分离 EBS 根卷，并将该卷附加到安装了 EC2Rescue for Windows Server 的正在运行的 Windows 实例。

1. 在正在运行的实例上运行 EC2Rescue for Windows Server 工具并选择**离线实例**。

1. 选择新装载卷的磁盘，并选择 **Next**。

1. 确认所选磁盘并选择 **Yes**。

1. 选择要执行的离线实例选项，并选择 **Next**。

EC2Rescue for Windows Server 工具会扫描该卷，并根据所选的日志文件收集故障排除信息。

## 收集来自活动实例的数据
<a name="ec2rescue-active"></a>

您可以收集活动实例的日志和其他数据。

**收集来自活动实例的数据**

1. 连接到您的 Windows 实例。

1. 将 [EC2Rescue for Windows Server](https://s3.amazonaws.com/ec2rescue/windows/EC2Rescue_latest.zip?x-download-source=docs) 工具下载到您的 Windows 实例并提取文件。

   您可以运行以下 PowerShell 命令以下载 EC2Rescue，而无需更改 Internet Explorer 增强安全性配置 (ESC)：

   ```
   Invoke-WebRequest https://s3.amazonaws.com/ec2rescue/windows/EC2Rescue_latest.zip -OutFile $env:USERPROFILE\Desktop\EC2Rescue_latest.zip
   ```

   该命令将 EC2Rescue .zip 文件下载到当前登录用户的桌面中。
**注意**  
如果您在下载文件时收到错误，并且正在使用 Windows Server 2016 或更早的版本，则可能需要为 PowerShell 终端启用 TLS 1.2。可以使用以下命令为当前 PowerShell 会话启用 TLS 1.2，然后重试：  

   ```
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
   ```

1. 打开 EC2Rescue for Windows Server 应用程序并接受许可协议。

1. 选择 **Next**、**Current instance**、**Capture logs**。

1. 选择要收集的数据项，然后选择 **Collect...**。阅读警告并选择 **Yes** 以继续操作。

1. 选择 ZIP 文件的文件名和位置，然后选择 **Save**。

1. EC2Rescue for Windows Server 完成之后，选择**打开包含文件夹**查看 ZIP 文件。

1. 选择**结束**。
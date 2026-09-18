

# EC2Launch v2 版本历史记录
<a name="ec2launchv2-versions"></a>

**Topics**
+ [EC2Launch v2 版本历史记录](#ec2launchv2-version-history)

## EC2Launch v2 版本历史记录
<a name="ec2launchv2-version-history"></a>

要确保安装了最新的启动代理，请参阅[安装最新版本的 EC2Launch v2](ec2launch-v2-install.md)。您可在 EC2Launch v2 代理的新版本发布时收到通知。有关更多信息，请参阅 [订阅 EC2 Windows 启动代理通知](launch-agents-subscribe-notifications.md)。

下表说明已发行的 EC2Launch v2 版本。


| 版本 | 详细信息 | 发行日期 | 
| --- | --- | --- | 
| 2.5.2 | +  修复了自定义证书和组策略部署的证书的 RDP 证书验证失败的问题。   | 2026 年 8 月 5 日 | 
| 2.5.1 | +  改进了启用休眠时的错误检测。   | 2026 年 6 月 3 日 | 
| 2.5.0 | +  更新了串行端口逻辑，以便在串行端口不可用时继续执行代理任务。 <br />+  实例控制台输出中新增了 EC2 Windows 实用程序设备驱动程序版本。 <br />+  移除了未使用的 bench.log 文件。 <br />+  优化了写入实例控制台输出时的驱动程序查找。   | 2026 年 5 月 4 日 | 
| 2.4.0 | +  通过删除冗余 `console.log`、`err.log` 文件来简化代理日志记录。 <br />+   通过添加日志轮换、将日志大小限制为 1 MB 并将时间精度提高到毫秒，增强了代理日志记录功能。 <br />+  移除了 Hyper-V 状态查询和相关的实例控制台输出。   | 2026 年 3 月 5 日 | 
| 2.3.237 | +  修复了因某些 Visual C\+\+ 运行时版本与代理遥测函数不兼容导致的代理崩溃问题。   | 2026 年 2 月 25 日 | 
| 2.3.108 | +  在壁纸上增加了 IPv6 地址显示功能。有关内存和网络属性的信息，请参阅 [AWS 文档](https://aws.amazon.com/ec2/instance-types/)。   | 2025 年 12 月 29 日 | 
| 2.3.56 | +  修复了以下问题：EC2Launch v2 未正确处理预配置的永久网络路由。   | 2025 年 11 月 4 日 | 
| 2.3.5 | +  在添加路由时使用 IMDS 改进了主网络接口检测。  | 2025 年 9 月 15 日 | 
| 2.2.63 | +  更新启动代理以改进 [遥测](ec2launch-v2.md#ec2launch-v2-telemetry)。  | 2025 年 7 月 29 日 | 
| 2.1.1 | +  增加了对 IPv6 的全面支持。  | 2025 年 5 月 14 日 | 
| 2.0.2107 | +  增加了增强路由功能，用于处理接口上没有 IPv4 或 IPv6 地址可用的情况。  | 2025 年 3 月 27 日 | 
| 2.0.2081 | +  修复了未正确检索或验证 RDP 证书信息的问题。添加了在需要时自动启动远程桌面服务的功能。 <br />+  调整了 EC2Launch v2 服务权限以修复查询服务状态时出现的问题。   | 2025 年 2 月 4 日 | 
| 2.0.2046 | +  更新了 `agent-config.yml` 文件中的壁纸路径，以使用默认的操作系统壁纸路径。 <br />+  增加了遥测功能，用于监控代理出现错误的位置。 <br />+  更新了代理日志消息收发。   | 2024 年 10 月 3 日 | 
| 2.0.1981 | +  更新了非管理员用户的 `EC2Launch.exe` CLI 命令错误消息。   | 2024 年 8 月 6 日 | 
| 2.0.1948 | +  添加了遥测来监控管理员密码选项的使用情况。 <br />+  修改了 EC2Launch 权限。   | 2024 年 7 月 1 日 | 
| 2.0.1924 | +  更新了 EC2Launch 设置 UI。 <br />+  更新了壁纸 CLI 命令。 <br />+  更新了 EC2Launch 安装程序。   | 2024 年 6 月 10 日 | 
| 2.0.1914 | +  添加具有未指定网关地址的路由（IPv4 为 `0.0.0.0`，或 IPv6 为 `::`）。 <br />+  务必同时添加 IPv4 和 IPv6 路由。 <br />+  修复了未指定 `Administrator` 用户名时将其添加到 `agent-config.yml` 文件中的问题。 <br />+  修改了 EC2Launch v2 权限。   | 2024 年 6 月 5 日 | 
| 2.0.1881 | +  在 `setAdminAccount` 任务中添加了加密密码选项。 <br />+  添加了 CLI 命令来加密 agent-config.yml 中的加密静态密码。 <br />+  修复了 XML 用户数据在使用管理员权限运行时无法添加 PowerShell 参数的问题。有关更多详细信息，请参阅[Amazon EC2 如何处理 Windows 实例的用户数据](user-data.md#ec2-windows-user-data)。 <br />+  调整了 `executeScript` 任务和用户数据脚本使用 `LocalSystem` 权限运行时的 PowerShell 参数。参数为空时，代理使用以下默认值：`-ExecutionPolicy Unrestricted`。 <br />+  已阻止将重复的驱动程序版本打印到控制台日志。   | 2024 年 5 月 8 日 | 
| 2.0.1815 | +  在 sysprep 之前，将错误处理调整为在关键设置问题上失败。 <br />+  修复了壁纸和主机名任务在多个 IP 地址分配给主网络接口的实例上使用错误 IP 地址的问题。 <br />+  壁纸和主机名任务更改为先从 IMDS 获取私有 IP，如果禁用 IMDS，则故障恢复到 WMI。 <br />+  修复了 `initializeVolume` 任务中由于暂时性错误而导致 `sc1` 卷无法初始化的问题。   | 2024 年 3 月 6 日 | 
| 2.0.1739 | +  修复了以 Windows 管理员用户身份运行的 `executeScript` 任务无法捕获退出代码的问题。   | 2024 年 1 月 17 日 | 
| 2.0.1702 | +  对于标准用户，将 `Telemetry.log` 权限限制为仅 `read-execute`。 <br />+  将 EC2Launch Windows 服务配置为在启动失败时重新启动。 <br />+  通过记录 `route.exe` `stderr` 输出，使 `add-routes` 故障变得可操作。 <br />+  修复了路由指标超出范围 [1, 9999] 时出现的问题。 <br />+  为几种新实例类型添加了壁纸支持。 <br />+  修复了以 Windows 管理员用户身份运行并将输出发送到 `stderr` 的用户数据脚本引起的问题。  | 2024 年 1 月 4 日 | 
| 2.0.1643 | +  已将 `ebsnvme-id.exe` 工具更新为版本 1.1.0.7。 <br />+  修复了以“metal-\*”开头的裸机实例类型（例如 metal-48x1）的接收端缩放（RSS）和接收队列深度设置的问题。 <br />+  删除了报告阻止代理的 XML UserData 命令的遥测事件。 <br />+  更新了 `setDnsSuffix` 任务以基于以下注册表条目限制域名传递：`HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Dnscache\Parameters\DomainNameDevolutionLevel`。 <br />+  添加了公共任务和添加网络路由的 CLI。 <br />+  *注意*：这是最后一个正式支持 Windows Server 2012 的版本。 <br />+  *注意*：这是最后一个正式支持 32 位操作系统的版本。  | 2023 年 10 月 4 日 | 
| 2.0.1580 | +  更改在您修改日志文件权限时启动代理处理错误的方式。 <br />+  添加连接串行端口的超时时间。如果正在使用串行端口，则超时允许启动代理继续运行。  | 2023 年 9 月 5 日 | 
| 2.0.1521 | +  已弃用 `EC2Launch.exe` **reset** 和 **sysprep** 命令的 `—block` 标记。 <br />+  已更新 `EC2Launch.exe` 以检测和处理内联 `executeScript` 任务中使用的 **reset** 和 **sysprep** 命令。这些命令会导致代理在 `executeScript` 任务运行它们后停止运行。 <br />+  更新了 XML 用户数据脚本，使其在默认情况下以内联方式运行。 <br />+  启用 XML 用户数据脚本以便与新的 `detach` 标签分离运行。有关更多详细信息，请参阅[用户数据脚本](user-data.md#user-data-scripts)。 <br />+  对代理日志进行了以下更改。   更新了代理日志消息。   从代理日志中删除了 `executeScript` 内容和输出。   从代理日志中删除了 `executeProgram` 参数和输出。   <br />+  对控制台日志进行了以下更改。   为控制台日志增加了 `EnableSCSIPersistentReservations` 值。    | 2023 年 7 月 3 日 | 
| 2.0.1303 | +  增加了添加网络路由时的额外错误处理和日志行。 <br />+  允许在 PreReady 阶段的 `executeScript` 和 `executeProgram` 任务。 <br />+  更新了 `executeProgram` 任务，以生成与 executeScript 任务输出类似的输出文件。有关更多信息，请参阅 [executeProgram](ec2launch-v2-task-definitions.md#ec2launch-v2-executeprogram)。 <br />+  增加了遥测功能，以用于监控 XML 用户数据中阻止代理命令的使用情况。  | 2023 年 5 月 3 日 | 
| 2.0.1245 | +  以明文形式记录崩溃调用堆栈，从而提高了崩溃可见性。 <br />+  添加了 EventLog 服务作为启动依赖项，以修复 Amazon EC2Launch 服务启动速度快于 EventLog 服务时发生的崩溃。 <br />+  代理配置文件（如 EC2Launch v1 和 EC2Config）中的 XML 用户数据将在 PostReady 阶段之前运行。 <br />+  添加了 YAML 用户数据版本 1.1，代理配置文件中的用户数据将在 PostReady 阶段之前运行（代理配置文件的 YAML 用户数据版本 1.0 则会在 PostReady 阶段之后运行）。  | 2023 年 3 月 8 日 | 
| 2.0.1173 | +  新增了在墙纸上显示实例标签的可选功能。有关更多信息，请参阅 [setWallpaper](ec2launch-v2-task-definitions.md#ec2launch-v2-setwallpaper)。 <br />+  新增了 Elastic Graphics 的安全组设置有误时的错误处理功能。 <br />+  修复了未启用实例元数据服务时的超时问题。  | 2023 年 2 月 6 日 | 
| 2.0.1121 | +  修复了未分配公有 IPv4 地址时将 404 错误打印到墙纸的问题。 <br />+  修复了卷的文件系统在其设备驱动器号设为 `D` 时，格式化为 `RAW` 而不是 `NTFS` 的问题。 <br />+  修复了将 NVMe SSD 卷错误识别为 EBS 卷的问题。 <br />+  修复了禁用 IMDS 时激活 Windows 的错误。  | 2023 年 1 月 4 日 | 
| 2.0.1082 | +  修复了禁用 IMDS 时 `setWallpaper`: `privateIpAddress` 字段为空的问题。 <br />+  修复了禁用 IMDS 时将主机名设置为私有 IPv4 地址的问题。 <br />+  修复了在 Windows Server 2012 上初始化卷的问题。 <br />+  修复了设置巨型帧的问题。 <br />+  修复了实例启动时未指定 SSH 密钥时的错误。 <br />+  修复了当 Windows 没有“ReleaseId”注册表项时 Windows Server 2012 上的错误。  | 2022 年 12 月 7 日 | 
| 2.0.1011 | +  修复了 PnPDeviceID 为空时查找网络适配器的逻辑。  | 2022 年 11 月 11 日 | 
| 2.0.1009 | +  使用 PCI 分段信息选择控制台端口。  | 2022 年 11 月 8 日 | 
| 2.0.982 | +  添加重试逻辑以获取 RDP 信息。 <br />+  修复了在 `d2.8xlarge` 实例上进行卷初始化期间的错误。 <br />+  修复了重启后可以选择不正确的网络适配器的问题。 <br />+  移除 ACPI SPCR 不可用时的误报错误消息。  | 2022 年 10 月 31 日 | 
| 2.0.863 | +  更新了的 IMDS 等待逻辑以仅发出 IMDSv2 请求。 <br />+  添加了可将驱动器号分配给已初始化但尚未装入的卷的逻辑。 <br />+  当密钥对类型不受支持时，会显示更具体的错误消息。 <br />+  修复了 3010 重启代码错误。 <br />+  添加了对无效 base64 编码用户数据的检查。  | 2022 年 7 月 6 日 | 
| 2.0.698 | +  修复了执行脚本时日志输出中的错别字。  | 2022 年 1 月 30 日 | 
| 2.0.674 | +  遥测上载启用/禁用的隐私控制。 <br />+  修复 `index out of bounds` 错误。 <br />+  在 `sysprep` 期间删除壁纸快捷键。  | 2021 年 11 月 15 日 | 
| 2.0.651 | +  添加逻辑以在 EC2Launch v2 安装期间卸载旧版代理。 <br />+  修复根卷未列为卷 0 时出现的 `list-volume` CLI 问题。  | 2021 年 10 月 7 日 | 
| 2.0.592 | +  修复错误以正确报告阶段状态。 <br />+  删除日志文件关闭时的错误告警的错误信息。 <br />+  添加遥测。  | 2021 年 8 月 31 日 | 
| 2.0.548 | +  为十六进制 IP 主机名添加前导零。 <br />+  修复了 `enableOpenSsh` 任务的文件权限。 <br />+  修复了 sysprep 命令崩溃。  | 2021 年 8 月 4 日 | 
| 2.0.470 | +  修复了网络阶段等待 DHCP 向实例分配 IP 的错误。 <br />+  修复了 `SearchList` 注册表项不存在时，`setDnsSuffix` 的错误。 <br />+  修复了 `setDnsSuffix` 中的 DNS 传递逻辑中的错误。 <br />+  中途重新启动后添加网络路由。 <br />+  允许 `initializeVolume` 重新编写现有卷的字母。 <br />+  从版本子命令中删除了额外信息。  | 2021 年 7 月 20 日 | 
| 2.0.285 | +  增加了在已分离的进程中运行用户脚本的选项。 <br />+  旧用户数据（XML 用户数据）现在在一个分离的进程中运行，这是与之前的启动代理类似的行为。 <br />+  将 CLI 标志添加到 `sysprep` 和 `reset` 命令，这允许它们在服务停止之前阻塞。 <br />+  限制配置文件夹的权限。  | 2021 年 3 月 8 日 | 
| 2.0.207 | +  向 `hostName` 任务添加可选 `setHostName` 字段。 <br />+  修复了重启错误。重启任务 `executeScript` 和 `executeProgram` 将标记为“running”。 <br />+  向状态命令添加更多返回代码。 <br />+  添加引导服务以修复在 `t2.nano` 实例类型上运行时的启动问题。 <br />+  修复了净安装模式以删除安装程序未跟踪的文件。  | 2021 年 2 月 2 日 | 
| 2.0.160 | +  修复 `validate` 命令以检测无效的阶段名称。 <br />+  在 `w32tm resync` 任务中添加 `addroutes` 命令。 <br />+  修复了更改 DNS 后缀搜索顺序的问题。 <br />+  添加检查条件以更好地报告无效用户数据。  | 2020 年 12 月 4 日 | 
| 2.0.153 | 在 UserData 中添加 Sysprep 功能。 | 2020 年 11 月 3 日 | 
| 2.0.146 |  +  修复了非英语 AMI 上的 RootExtend 的问题。 <br />+  授予用户组对日志文件的写入权限。 <br />+  为 GPT 卷创建 MS 预留分区。 <br />+  在 Amazon EC2Launch 设置中添加 list-volumes 命令和卷下拉列表。 <br />+  添加了 get-agent-config 命令，用于按 yaml 或 json 格式打印 agent-config.yml 文件。 <br />+  如果未检测到公有密钥，则清除静态密码。   | 2020 年 10 月 6 日 | 
| 2.0.124 |  +  添加了在壁纸上显示操作系统版本的选项。 <br />+  初始化加密的 EBS 卷。 <br />+  为没有本地 DNS 名称的 VPC 添加路由。   | 2020 年 9 月 10 日 | 
| 2.0.104 |  +  创建 DNS 后缀搜索列表（如果不存在）。 <br />+  如果没有请求，则跳过休眠状态。   | 2020 年 8 月 12 日 | 
| 2.0.0 | 首次发布。 | 2020 年 6 月 30 日 | 
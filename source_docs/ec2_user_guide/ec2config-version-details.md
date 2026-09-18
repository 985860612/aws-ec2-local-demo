

# EC2Config 版本历史记录
<a name="ec2config-version-details"></a>

下表说明已发行的 EC2Config 版本。有关 SSM Agent 更新的信息，请参阅 [Systems Manager SSM Agent 发布说明](https://github.com/aws/amazon-ssm-agent/blob/master/RELEASENOTES.md)。

**重要**  
对 EC2Config 的支持已终止。仅最新版本的 EC2Config 代理可供下载。之前的版本将标记为私有。


| 版本 | 详细信息 | 发行日期 | 
| --- | --- | --- | 
| 4.9.5777 |  +  修复了某些实例类型的 RSS 配置设置不正确的问题。 <br />+  SSM Agent `3.3.484.0` 的新版本。   | 2024 年 6 月 17 日 | 
| 4.9.5554 |  +  基于以下注册表条目限制域名传递：`HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Dnscache\Parameters\DomainNameDevolutionLevel`。 <br />+  SSM Agent `3.2.1630.0` 的新版本。   | 2023 年 10 月 4 日 | 
| 4.9.5467 |  +  添加了用于发现控制台端口的重试功能。 <br />+  SSM Agent `3.1.2282.0` 的新版本。   | 2023 年 8 月 1 日 | 
| 4.9.5288 |  +  已将 Amazon Core SDK 更新为版本 `3.7.103.23`。 <br />+  修复了 `AWS-UpdateEC2Config` SSM 文档无法在仅启用 IMDSv2 的实例上更新 `EC2Config` 的问题。 <br />+  SSM Agent `3.1.2144.0` 的新版本。   | 2023 年 3 月 8 日 | 
| 4.9.5231 |  +  SSM Agent 的新版本 3.1.1927.0。   | 2023 年 2 月 14 日 | 
| 4.9.5103 |  +  修复了在 r5d 和 i4i 实例系列上错误识别临时卷的问题。<br />+  SSM Agent 的新版本 3.1.1856.0。   | 2022 年 12 月 5 日 | 
| 4.9.5064 |  +  更新为使用 PCI 分段信息选择控制台端口。<br />+  签署了 PowerShell 脚本并添加了版权标头。 <br />+  修复了主网络适配器选择逻辑。 <br />+  SSM Agent 的新版本 3.1.1732.0。   | 2022 年 11 月 16 日 | 
| 4.9.4588 |  + 更新了的 IMDS 等待逻辑以仅发出 IMDSv2 请求。<br />+  添加了 libec2launch.dll 启动代理共享库。 <br />+  SSM Agent 的新版本 3.1.1188.0。   | 2022 年 5 月 31 日 | 
| 4.9.4556 |  + 增加了等待逻辑，以确保在使用之前完成 NIC 的完全初始化。<br />+  新版本的 Log4Net 2.0.14.0 包含了安全补丁。 <br />+  新版本的 SSM Agent 3.1.1045.0 包含了安全补丁。   | 2022 年 3 月 1 日 | 
| 4.9.4536 |  + 修复了 Temp 文件夹丢失时 UserData 崩溃的问题。<br />+  SSM Agent 的新版本 (3.1.804.0)。   | 2022 年 1 月 31 日 | 
| 4.9.4508 |  + 修复了正确计算 diskpart 脚本路径的问题。<br />+  SSM Agent 的新版本 (3.1.338.0)。   | 2021 年 10 月 6 日 | 
| 4.9.4500 |  + 已更新具有 IMDS v2 支持的 `Install-EgpuManagerConfig`。<br />+  已更新网站链接以使用 https。 <br />+  SSM Agent 的新版本 3.1.282.0   | 2021 年 9 月 7 日 | 
| 4.9.4419 |  + 修复了 IMDS 版本 1 回退逻辑<br />+  将 Windows 临时目录的所有用法更新到 EC2Config 临时目录 <br />+  SSM Agent 的新版本 (3.0.1124.0)   | 2021 年 6 月 2 日 | 
| 4.9.4381 |  + 在 EC2ConfigUpdater 中增加了对 SSM 文档架构版本 2.2 的支持<br />+  将 AWS Nitro Enclaves 程序包版本添加到了控制台日志中。 <br />+  SSM Agent 的新版本 (3.0.529.0)   | 2021 年 5 月 4 日 | 
| 4.9.4326 |  + 已删除设置 UI 中的所有链接<br />+  这是最后一个支持 Windows Server 2008 的 EC2Config 版本。   | 2021 年 3 月 3 日 | 
| 4.9.4279 |  + 修复了与 `Ec2ConfigMonitor` 计划任务相关的安全问题<br />+ 修复了盘符映射问题和不正确的临时磁盘计数<br />+ 已将 `OsCurrentBuild` 和 `OsReleaseId` 添加到控制台输出<br />+ SSM Agent 的新版本 (2.3.871.0)  | 2020 年 12 月 11 日 | 
| 4.9.4222 |  + 修复了 IMDS 版本 1 回退逻辑<br />+ SSM Agent 的新版本 (2.3.842.0)  | 2020 年 4 月 7 日 | 
| 4.9.4122 |  + 添加了对 IMDS v2 的支持<br />+ SSM Agent 的新版本 (2.3.814.0)  | 2020 年 3 月 4 日 | 
| 4.9.3865 |  + 解决了在裸机实例上检测到 Windows Server 2008 R2 的 COM 端口的问题<br />+ SSM Agent 的新版本 (2.3.722.0)  | 2019 年 10 月 31 日 | 
| 4.9.3519 |  + 新的 SSM Agent 版本 2.3.634.0  | 2019 年 6 月 18 日 | 
| 4.9.3429 |  + 新的 SSM Agent 版本 2.3.542.0  | 2019 年 4 月 25 日 | 
| 4.9.3289 |  + 新的 SSM Agent 版本 2.3.444.0  | 2019 年 2 月 11 日 | 
| 4.9.3270 |  + 增加了用于将监视器设置为永不关闭以修复 ACPI 问题的插件<br />+ 将 SQL Server 版本写入到了控制台中<br />+ 新的 SSM Agent 版本 2.3.415.0  | 2019 年 1 月 22 日 | 
| 4.9.3230 |  + 更新了盘符映射说明以更好地符合相应功能<br />+ 新的 SSM Agent 版本 2.3.372.0  | 2019 年 1 月 10 日 | 
| 4.9.3160 |  + 增加了主 NIC 的等待时间<br />+ 添加了 RSS 的默认配置以及 ENA 设备的接收队列设置<br />+ Sysprep 期间禁用休眠<br />+ 新的 SSM Agent 版本 2.3.344.0<br />+ 将 AWS 开发工具包升级到 3.3.29.13  | 2018 年 12 月 15 日 | 
| 4.9.3067 |  + 对实例休眠进行了改进<br />+ 新的 SSM Agent 版本 2.3.235.0  | 2018 年 11 月 8 日 | 
| 4.9.3034 |  + 添加了 DNS 服务器的路由 169.254.169.253/32<br />+ 新的 SSM Agent 版本 2.3.193.0  | 2018 年 10 月 24 日 | 
| 4.9.2986 |  + 为所有 EC2Config 相关库添加了签名<br />+ 新的 SSM Agent 版本 2.3.136.0  | 2018 年 10 月 11 日 | 
| 4.9.2953 | 新的 SSM Agent 版本 (2.3.117.0) | 2018 年 10 月 2 日 | 
| 4.9.2926 | 新的 SSM Agent 版本 (2.3.68.0) | 2018 年 9 月 18 日 | 
| 4.9.2905 |  + 新的 SSM Agent 版本 (2.3.50.0)<br />+ 将路由 169.254.169.123/32 添加到 AMZN 时间服务<br />+ 将路由 169.254.169.249/32 添加到 GRID 许可证服务<br />+ 修复导致 EBS NVMe 卷被标记为短暂存储的问题  | 2018 年 9 月 17 日 | 
| 4.9.2854 | 新的 SSM Agent 版本 (2.3.13.0) | 2018 年 8 月 17 日 | 
| 4.9.2831 | 新的 SSM Agent 版本 (2.2.916.0) | 2018 年 8 月 7 日 | 
| 4.9.2818 | 新的 SSM Agent 版本 (2.2.902.0) | 2018 年 7 月 31 日 | 
| 4.9.2756 | 新的 SSM Agent 版本 (2.2.800.0) | 2018 年 6 月 27 日 | 
| 4.9.2688 | 新的 SSM Agent 版本 (2.2.607.0) | 2018 年 5 月 25 日 | 
| 4.9.2660 | 新的 SSM Agent 版本 (2.2.546.0) | 2018 年 5 月 11 日 | 
| 4.9.2644 | 新的 SSM Agent 版本 (2.2.493.0) | 2018 年 4 月 26 日 | 
| 4.9.2586 | 新的 SSM Agent 版本 (2.2.392.0) | 2018 年 3 月 28 日 | 
| 4.9.2565 |  +  新的 SSM Agent 版本 (2.2.355.0) <br />+  修复了 M5 和 C5 实例的问题 (找不到半虚拟化驱动程序) <br />+  添加有关实例类型、最新半虚拟化驱动程序和 NVMe 驱动程序的控制台日志记录   | 2018 年 3 月 13 日 | 
| 4.9.2549 | 新的 SSM Agent 版本 (2.2.325.0) | 2018 年 3 月 8 日 | 
| 4.9.2461 | 新的 SSM Agent 版本 (2.2.257.0) | 2018 年 2 月 15 日 | 
| 4.9.2439 | 新的 SSM Agent 版本 (2.2.191.0) | 2018 年 2 月 6 日 | 
| 4.9.2400 | 新的 SSM Agent 版本 (2.2.160.0) | 2018 年 1 月 16 日 | 
| 4.9.2327 |  +  新的 SSM Agent 版本 (2.2.120.0) <br />+  Amazon EC2 裸机实例上增加了 COM 端口发现 <br />+  Amazon EC2 裸机实例上增加了 Hyper-V 状态日志   | 2018 年 1 月 2 日 | 
| 4.9.2294 | 新的 SSM Agent 版本 (2.2.103.0) | 2017 年 12 月 4 日 | 
| 4.9.2262 | 新的 SSM Agent 版本 (2.2.93.0) | 2017 年 11 月 15 日 | 
| 4.9.2246 | 新的 SSM Agent 版本 (2.2.82.0) | 2017 年 11 月 11 日 | 
| 4.9.2218 | 新的 SSM Agent 版本 (2.2.64.0) | 2017 年 10 月 29 日 | 
| 4.9.2212 | 新的 SSM Agent 版本 (2.2.58.0) | 2017 年 10 月 23 日 | 
| 4.9.2203 | 新的 SSM Agent 版本 (2.2.45.0) | 2017 年 10 月 19 日 | 
| 4.9.2188 | 新的 SSM Agent 版本 (2.2.30.0) | 2017 年 10 月 10 日 | 
| 4.9.2180 |  +  新的 SSM Agent 版本 (2.2.24.0) <br />+  添加了适用于 GPU 实例的 Elastic GPU 插件   | 2017 年 10 月 5 日 | 
| 4.9.2143 | 新的 SSM Agent 版本 (2.2.16.0) | 2017 年 10 月 1 日 | 
| 4.9.2140 | 新的 SSM Agent 版本 (2.1.10.0) |  | 
| 4.9.2130 | 新的 SSM Agent 版本 (2.1.4.0) |  | 
| 4.9.2106 | 新的 SSM Agent 版本 (2.0.952.0) |  | 
| 4.9.2061 | 新的 SSM Agent 版本 (2.0.922.0) |  | 
| 4.9.2047 | 新的 SSM Agent 版本 (2.0.913.0) |  | 
| 4.9.2031 | 新的 SSM Agent 版本 (2.0.902.0) |  | 
| 4.9.2016 |  +  新的 SSM Agent 版本 (2.0.879.0) <br />+  修复了 Windows Server 2003 的 CloudWatch Logs 目录路径   |  | 
| 4.9.1981 |  +  新的 SSM Agent 版本 (2.0.847.0) <br />+  修复了与使用在 EBS 卷中生成的 `important.txt` 有关的问题。   |  | 
| 4.9.1964 | 新的 SSM Agent 版本 (2.0.842.0) |  | 
| 4.9.1951 |  +  新的 SSM Agent 版本 (2.0.834.0) <br />+  修复了不为临时驱动器从 Z: 映射驱动器盘符的问题。   |  | 
| 4.9.1925 |  +  新的 SSM Agent 版本 (2.0.822.0) <br />+  [错误] 此版本不是从 SSM Agent v4.9.1775 进行更新的有效目标。   |  | 
| 4.9.1900 | 新的 SSM Agent 版本 (2.0.805.0) |  | 
| 4.9.1876 |  +  新的 SSM Agent 版本 (2.0.796.0) <br />+  修复了与管理用户数据执行的输出/错误重定向有关的问题。   |  | 
| 4.9.1863 |  +  新的 SSM Agent 版本 (2.0.790.0) <br />+  修复了与将多个 EBS 卷附加到 Amazon EC2 实例有关的问题。 <br />+  改进了 CloudWatch 以获取配置路径，保持向后兼容性。   |  | 
| 4.9.1791 | 新的 SSM Agent 版本 (2.0.767.0) |  | 
| 4.9.1775 | 新的 SSM Agent 版本 (2.0.761.0) |  | 
| 4.9.1752 | 新的 SSM Agent 版本 (2.0.755.0) |  | 
| 4.9.1711 | 新的 SSM Agent 版本 (2.0.730.0) |  | 
| 4.8.1676  | 新的 SSM Agent 版本 (2.0.716.0) |  | 
| 4.7.1631 | 新的 SSM Agent 版本 (2.0.682.0) |  | 
| 4.6.1579 |  +  新的 SSM Agent 版本 (2.0.672.0) <br />+  修复了 v4.3、v4.4 和 v4.5 中的代理更新问题   |  | 
| 4.5.1534 | 新的 SSM Agent 版本 (2.0.645.1) |  | 
| 4.4.1503 | 新的 SSM Agent 版本 (2.0.633.0) |  | 
| 4.3.1472 | 新的 SSM Agent 版本 (2.0.617.1) |  | 
| 4.2.1442 | 新的 SSM Agent 版本 (2.0.599.0) |  | 
| 4.1.1378 | 新的 SSM Agent 版本 (2.0.558.0) |  | 
| 4.0.1343 |  +  Run Command、State Manager、CloudWatch 代理以及域加入支持已转移到称为 SSM Agent 的另一个代理中。SSM Agent 将作为 EC2Config 升级的一部分进行安装。有关更多信息，请参阅[EC2Config 和 AWS Systems Manager](ec2config-service.md#ec2config-ssm)。 <br />+  如果您在 EC2Config 中设置了代理，则您需要更新 SSM Agent 的代理设置才可以升级。如果您不更新代理设置，则将无法使用 Run Command 来管理实例。要避免此情况出现，请先参阅以下信息，然后再更新到更新版本：*AWS Systems Manager 用户指南*中的[在 Windows 实例上安装和配置 SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-windows.html)。 <br />+  如果您之前使用本地配置文件 (`AWS.EC2.Windows.CloudWatch.json`) 在实例上启用了 CloudWatch 集成，则您需要对文件进行配置，才能与 SSM Agent 配合使用。   |  | 
| 3.19.1153  |  +  已为具有旧 AWS KMS 配置的实例重新启用激活插件。跳过 BYOL 用户的激活过程。 <br />+  已更改在磁盘格式化操作期间要禁用的默认 TRIM 行为，并且增加了 FormatWithTRIM 来使用 UserData 覆盖 InitializeDisks 插件。   |  | 
| 3.18.1118  |  +  进行了修复，现在能够可靠地将路由添加到主网络适配器。 <br />+  进行了更新来改善对 AWS 服务的支持。   |  | 
| 3.17.1032 |  +  修复了当筛选条件设置为相同类别时出现重复系统日志的问题。 <br />+  进行了修复，可防止在磁盘初始化期间挂起。   |  | 
| 3.16.930 | 增加了对在启动时将“Windows 已可供使用”事件记录到 Windows 事件日志的支持。 |  | 
| 3.15.880  | 进行了修复，允许将 Systems Manager Run Command 输出上传到名称中带有“.”字符的 S3 存储桶。 |  | 
| 3.14.786  | 增加了对覆盖 InitializeDisks 插件设置的支持。例如：为了加快 SSD 磁盘初始化，您可以通过在 UserData 中指定的方式来临时禁用 TRIM：<br /> <InitializeDrivesSettings><SettingsGroup>FormatWithoutTRIM</SettingsGroup></InitializeDrivesSettings  |  | 
| 3.13.727  | Systems Manager Run Command - 进行了修复，能够在 Windows 重新启动后可靠地处理命令。 |  | 
| 3.12.649  |  +  进行了修复，能够在运行命令/脚本时正常处理重新启动操作。 <br />+  进行了修复，能够可靠地取消正在运行的命令。 <br />+  增加了对（可选）在通过 Systems Manager Run Command 安装应用程序时将 MSI 日志上传到 S3 的支持。   |  | 
| 3.11.521  |  +  进行了修复，可启用适用于 Windows Server 2003 的 RDP 指纹生成。 <br />+  进行了修复，以便在 EC2Config 日志行中包括时区和 UTC 偏移量。 <br />+  对并行运行 Run Command 命令的 Systems Manager 支持。 <br />+  回滚上一个更改以使分区磁盘联机。   |  | 
| 3.10.442  |  +  修复了在安装 MSI 应用程序时的 Systems Manager 配置故障。 <br />+  进行了修复，使存储磁盘能够可靠地联机。 <br />+  进行了更新来改善对 AWS 服务的支持。   |  | 
| 3.9.359  |  +  修复了后处理 Sysprep 脚本，将 Windows 更新配置保留为默认状态。 <br />+  修复了密码生成插件，改善了在获取 GPO 密码策略设置时的可靠性。 <br />+  将 EC2Config/SSM 日志文件夹权限限制为本地管理员组。 <br />+  进行了更新来改善对 AWS 服务的支持。   |  | 
| 3.8.294  |  +  修复了不在主驱动器上时阻止日志上传的 CloudWatch 问题。 <br />+  通过添加重试逻辑改善了磁盘初始化过程。 <br />+  增加了在创建 AMI 期间 SetPassword 插件偶尔发生故障时的改进的错误处理方式。 <br />+  进行了更新来改善对 AWS 服务的支持。   |  | 
| 3.7.308  |  +  改进了用于实例内的测试和故障排除的 ec2config-cli 实用程序。 <br />+  避免在 OpenVPN 适配器上为 AWS KMS 和元数据服务添加静态路由。 <br />+  修复了 UserData 执行未遵循“persist”标签的问题。 <br />+  改进了 EC2 控制台日志记录不可用时的错误处理。 <br />+  进行了更新来改善对 AWS 服务的支持。   |  | 
| 3.6.269  |  +  修复了 Windows 激活可靠性问题，优先使用链路本地地址 169.254.0.250/251 通过 AWS KMS 激活 Windows <br />+  改进了用于 Systems Manager、Windows 激活和域加入方案的代理处理方式 <br />+  修复了将重复的用户账户行添加到 Sysprep 回复文件的问题   |  | 
| 3.5.228  |  +  解决了 CloudWatch 插件在读取 Windows 事件日志时可能会消耗过多的 CPU 和内存的情况 <br />+  新增了一个指向 EC2Config 设置 UI 中的 CloudWatch 配置文档的链接   |  | 
| 3.4.212  |  +  修复了 EC2Config 与 VM-Import 结合使用时的问题。 <br />+  修复了 WiX 安装程序中的服务命名问题。   |  | 
| 3.3.174  |  +  改进了 Systems Manager 和域加入故障的异常处理。 <br />+  进行了更改，以便支持 Systems Manager SSM 架构版本控制。 <br />+  修复了 Win2K3 的临时磁盘格式化问题。 <br />+  进行了更改，以便支持配置超过 2TB 的磁盘大小。 <br />+  通过将 GC 模式设置为默认值来减少虚拟内存使用量。 <br />+  支持从 `aws:psModule` 和 `aws:application` 插件中的 UNC 路径下载构件。 <br />+  改进了 Windows 激活插件的日志记录。   |  | 
| 3.2.97  |  +  通过延迟加载 Systems Manager SSM 程序集改进了性能。 <br />+  改进了格式错误的 sysprep2008.xml 的异常处理。 <br />+  对 Systems Manager 的“Apply”配置的命令行支持。 <br />+  进行了更改，以支持当存在暂挂计算机重命名操作时加入域。 <br />+  支持 `aws:applications` 插件中的可选参数。 <br />+  支持 `aws:psModule` 插件中的命令数组。   |  | 
| 3.0.54  |  +  启用面向 Systems Manager 的支持。 <br />+  通过 Systems Manager 自动将 EC2 Windows 实例加入 AWS 目录域。 <br />+  通过 Systems Manager 配置并上传 CloudWatch 日志/指标。 <br />+  通过 Systems Manager 安装 PowerShell 模块。 <br />+  通过 Systems Manager 安装 MSI 应用程序。   |  | 
| 2.4.233  |  +  增加了计划任务来从服务启动故障中恢复 EC2Config。 <br />+  改进了控制台日志错误消息。 <br />+  进行了更新来改善对 AWS 服务的支持。   |  | 
| 2.3.313  |  +  修复了当启用 CloudWatch Logs 功能时某些情况下消耗大量内存的问题。 <br />+  修复了升级错误，使得低于 2.1.19 的 ec2config 版本现在可以升级到最新版本。 <br />+  更新了日志中的 COM 端口打开异常，使之可读性更好，更有帮助。 <br />+  Ec2configServiceSettings UI 禁用了大小调整，并修复了 UI 中的属性和版本显示位置。   |  | 
| 2.2.12  |  +  已处理在查询注册表项来确定 Windows Sysprep 状态时偶尔返回空值的情况下的 NullPointerException。 <br />+  释放 finally 代码块中的未托管资源。   |  | 
| 2.2.11  | 修复了 CloudWatch 插件处理空日志行的问题。 |  | 
| 2.2.10  |  +  删除了通过 UI 配置 CloudWatch Logs 设置的功能。 <br />+  允许用户定义 `%ProgramFiles%\Amazon\Ec2ConfigService\Settings\AWS.EC2.Windows.CloudWatch.json` 文件中的 CloudWatch Logs 设置，以便在未来做出改进。   |  | 
| 2.2.9  | 修复了未处理异常，增加了日志记录。 |  | 
| 2.2.8  |  +  修复了 EC2Config 安装程序用来支持 Windows Server 2003 SP1 以及更高版本的 Windows 操作系统版本检查。 <br />+  修复了读取与更新 Sysprep 配置文件相关的注册表项时的空值处理。   |  | 
| 2.2.7  |  +  增加了在针对 Windows 2008 及更高版本执行 Sysprep 期间运行 EC2Config 的支持。 <br />+  改进了异常处理和日志记录，以实现更好的诊断   |  | 
| 2.2.6  |  +  减少了在上传日志事件时实例以及 CloudWatch Logs 上的负载。 <br />+  解决了 CloudWatch Logs 插件未始终保持启用状态的升级问题   |  | 
| 2.2.5  |  +  增加了对将日志上传到 CloudWatch 日志服务的支持。 <br />+  修复了 Ec2OutputRDPCert 插件中的竞用情况问题 <br />+  更改了 EC2Config 服务恢复选项以便从 TakeNoAction 重新启动 <br />+  增加了 EC2Config 崩溃时的更多异常信息   |  | 
| 2.2.4  |  +  修复了 PostSysprep.cmd 中的拼写错误 <br />+  修复了 EC2Config 不将自身固定到 OS2012\+ 开始菜单的错误   |  | 
| 2.2.3  |  +  增加了安装 EC2Config 但不在安装后立即启动服务的选项。要使用该选项，可从命令提示符运行“Ec2Install.exe start=false” <br />+  在墙纸插件中增加了参数来控制对墙纸的添加/删除。要使用该选项，可从命令提示符运行“Ec2WallpaperInfo.exe set”或“Ec2WallpaperInfo.exe revert” <br />+  增加了对 RealTimeIsUniversal 键的检查，将不正确的 RealTimeIsUniveral 注册表项设置输出到控制台 <br />+  删除了 Windows 临时文件夹的 EC2Config 依赖项 <br />+  删除了 .Net 3.5 的 UserData 执行依赖项   |  | 
| 2.2.2  |  +  增加了对服务停止行为的检查来检查是否正在释放资源 <br />+  修复了在加入域时长时间执行的问题   |  | 
| 2.2.1  |  +  更新了安装程序，允许从较旧的版本升级 <br />+  修复了纯 .Net4.5 环境中的 Ec2WallpaperInfo 错误 <br />+  修复了间歇性的驱动程序检测错误 <br />+  增加了无提示安装选项。使用“-q”选项执行 Ec2Install.exe。例如：“Ec2Install.exe -q”   |  | 
| 2.2.0  |  +  增加了对纯 .Net4 和 .Net4.5 环境的支持 <br />+  更新了安装程序   |  | 
| 2.1.19  |  +  增加了使用 Intel 网络驱动程序时的临时磁盘标记支持 (例如 C3 实例类型)。有关更多信息，请参阅[Amazon EC2 实例上的增强联网功能](enhanced-networking.md)。 <br />+  增加了对控制台输出的 AMI 原始版本和 AMI 源名称支持 <br />+  对控制台输出进行了更改，以实现一致的格式/分析 <br />+  更新了帮助文件   |  | 
| 2.1.18  |  +  对完成通知增加了 EC2Config WMI 对象 (-Namespace root\\Amazon -Class EC2\_ConfigService) <br />+  改进了大事件日志的启动 WMI 查询的性能；此类查询可能会在初始执行期间导致长时间的高 CPU 占用率   |  | 
| 2.1.17  |  +  修复了与标准输出以及标准错误缓冲区填充有关的 UserData 执行问题 <br />+  修复了在 w2k8 及更高版本的操作系统上有时会出现的不正确的 RDP 指纹 <br />+  控制台输出现在对于 Windows 2008 及更高版本的操作系统包含“RDPCERTIFICATE-SubjectName:”，其中带有计算机名称值 <br />+  在盘符映射下拉列表中增加了 D:\\ <br />+  将“帮助”按钮移到了右上角，并更改了外观 <br />+  在右上角增加了反馈调查链接   |  | 
| 2.1.16  |  +  “常规”选项包含指向新版本的 EC2Config 下载页面的链接 <br />+  重叠桌面墙纸现在存储在用户本地的 Appdata 文件夹而不是“我的文档”中，以便支持 MyDoc 重定向 <br />+  MSSQLServer 名称在后处理 Sysprep 脚本中与系统同步 (2008\+) <br />+  对应用程序文件夹重新排序 (将文件移到插件目录并删除了重复的文件) <br />+  更改了系统日志输出 (控制台)： <br />+  \*转变为日期、名称、值的格式，以便于分析 (请开始将依赖项迁移到新格式) <br />+  \*增加了“Ec2SetPassword”插件状态 <br />+  \*增加了 Sysprep 开始和结束时间 <br />+  修复了在非英语操作系统中临时磁盘未标记为“临时存储”的问题 <br />+  修复了运行 Sysprep 后出现的 EC2Config 卸载故障   |  | 
| 2.1.15  |  +  优化了对元数据服务的请求 <br />+  元数据现在绕过代理设置 <br />+  临时磁盘标记为“临时存储”，并且 Important.txt 放在找到的卷上 (仅 Citrix PV 驱动程序)。有关更多信息，请参阅[在 EC2 Windows 实例上升级半虚拟化驱动程序](Upgrading_PV_drivers.md)。 <br />+  向临时磁盘分配从 A 到 Z 的盘符 (仅 Citrix PV 驱动程序) - 这一分配可通过盘符映射插件使用卷标签“Temporary Storage X” (其中 x 是 0 到 25 之间的数字) 来覆盖 <br />+  UserData 现在会在“Windows 已准备就绪”后立即运行   |  | 
| 2.1.14  | 桌面墙纸修复 |  | 
| 2.1.13  |  +  桌面墙纸在默认情况下将显示主机名称 <br />+  删除了 Windows 时间服务的依赖项 <br />+  在多个 IP 分配到一个接口的情况下增加了路由   |  | 
| 2.1.11  |  +  对 Ec2Activation 插件进行了更改 <br />+  - 每 30 天验证激活状态 <br />+  - 如果宽限期还剩下 90 天 (共 180 天)，则重新尝试激活   |  | 
| 2.1.10  |  +  重叠桌面墙纸不再随 Sysprep 保留，或者在无 Sysprep 的情况下关机时不再保留 <br />+  每次使用 <persist>true</persist> 启动服务时运行的 Userdata 选项 <br />+  将 /DisableWinUpdate.cmd 的位置和名称更改为 /Scripts/PostSysprep.cmd <br />+  管理员密码默认情况下设置为在 /Scripts/PostSysprep.cmd 中不过期 <br />+  卸载程序将从 c:\\windows\\setup\\script\\CommandComplete.cmd 中删除 EC2Config PostSysprep 脚本 <br />+  增加路由支持自定义接口指标   |  | 
| 2.1.9  | UserData 执行不再限制为 3851 个字符 |  | 
| 2.1.7  |  +  将操作系统版本和语言标识符写入到控制台中 <br />+  将 EC2Config 版本写入到控制台中 <br />+  将半虚拟化驱动程序版本写入到控制台中 <br />+  检测错误检查，并在找到错误的情况下在下次启动时输出到控制台 <br />+  在 config.xml 中增加了选项来保存 Sysprep 凭证 <br />+  增加在启动时 ENI 不可用的情况下执行的路由重试逻辑 <br />+  UserData 执行 PID 写入到控制台中 <br />+  从 GPO 检索生成的最短密码长度 <br />+  将服务启动设置为重试 3 次 <br />+  向 /Scripts 文件夹增加了 S3\_DownloadFile.ps1 和 S3\_Upload file.ps1 示例   |  | 
| 2.1.6  |  +  在“常规”选项卡中增加了版本信息 <br />+  将“服务包”选项卡重命名为“映像” <br />+  简化了指定密码的过程，并且将密码相关的 UI 从“常规”选项卡转移到“映像”选项卡 <br />+  将“磁盘设置”选项卡重命名为“存储” <br />+  增加了提供常见故障诊断工具的“支持”选项卡 <br />+  设置 Windows Server 2003 `sysprep.ini` 以在默认情况下扩展操作系统分区 <br />+  向墙纸中添加私有 IP 地址 <br />+  在墙纸上显示私有 IP 地址 <br />+  为控制台输出增加了重试逻辑 <br />+  修复了元数据可访问性的 Com 端口异常 -- 该异常会导致 EC2Config 在显示控制台输出前终止 <br />+  每次启动时检查激活状态 -- 必要时会激活 <br />+  修复了相对路径问题 -- 在从启动文件夹手动执行墙纸快捷方式时会导致该问题；指向管理员/日志 <br />+  修复了 Windows Server 2003 用户的默认背景颜色 (管理员除外)   |  | 
| 2.1.2  |  +  采用 UTC (祖鲁) 的控制台时间戳 <br />+  “Sysprep”选项卡上不再显示超链接 <br />+  增加了在 Windows 2008 和更高版本上首次启动时动态扩展根卷的功能 <br />+  当启用“设置密码”时，现在自动允许 EC2Config 设置密码 <br />+  EC2Config 会在运行 Sysprep 之前检查激活状态 (如果未激活，则发出警告) <br />+  Windows Server 2003 `Sysprep.xml` 现在默认采用 UTC 时区而不是太平洋时区 <br />+  随机化的激活服务器 <br />+  将“磁盘映射”选项卡重命名为“磁盘设置” <br />+  已将初始化驱动器 UI 项从“常规”选项卡移动到“磁盘设置”选项卡 <br />+  “帮助”按钮现在指向 HTML 帮助文件 <br />+  使用更改对 HTML 帮助文件进行了更新 <br />+  更新了盘符映射的“注释”文本 <br />+  向 /Scripts 文件夹增加了 InstallUpdates.ps1，在执行 Sysprep 之前执行自动修补和清除   |  | 
| 2.1.0  |  +  默认情况下，桌面墙纸在第一次登录 (不是断开/重新连接)时显示实例信息 <br />+  通过将代码放在 <powershell></powershell> 之内，PowerShell 可以从 UserData 中运行   |  | 
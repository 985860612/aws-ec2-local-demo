

# 在 EC2 实例上设置时间参考，以使用本地 Amazon Time Sync Service
<a name="configure-ec2-ntp"></a>

 Amazon Time Sync Service 为您的 Amazon EC2 实例提供了多种与本地时间源同步的方法。首先，任何 Amazon EC2 实例都可以通过网络时间协议 (NTP) 访问本地时间源。此外，增强版的 Amazon Time Sync Service 为[支持的 Amazon EC2 实例](#ptp-hardware-clock-requirements)提供了更精确的本地时间源。在采用 `precision-time` 策略的置放群组中启动受支持的实例，以连接到精度更高的 NTP 源。最后，在精准时间置放群组中启动的 Linux 实例可访问 PTP 硬件时钟 (PHC) 设备，并具备检索硬件数据包时间戳的能力。

 任何 Amazon EC2 实例都可以访问本地 NTP 源。您可以通过链路本地 IP 地址访问 NTP 源，该方式将 NTP 流量限制在 VPC 内部，无需对 VPC 进行特定配置更改。您的 AMI 可能已经将时钟同步进程守护程序配置为默认使用本地 NTP 源。此 NTP 源可通过以下 IP 地址获得：
+ IPv4：`169.254.169.123`
+ IPv6：`fd00:ec2::123`（只能在[基于 Nitro的实例](instance-types.md#instance-hypervisor-type)上访问。）

 [支持的 Amazon EC2 实例](#ptp-hardware-clock-requirements)可以访问增强版 Amazon Time Sync Service。要访问增强版 Amazon Time Sync Service，请使用 `precision-time` 策略在置放群组中启动受支持的实例。如果您使用 NTP 链路本地 IP 地址，则无需对实例进行配置即可受益于此改进。任何操作系统都可以使用此增强功能。您可以使用自己选择的 NTP 客户端来验证您是否受益于增强的 NTP 源。

在支持的实例系列上运行的基于 Linux 的 AMI，还具有从 PHC 设备获取时间的额外选项。ENA 驱动程序使该设备可用。增强型 NTP 源和 PHC 设备都使用相同的高精度时间源。对 PHC 时间源的访问经过优化，从而可以更准确地同步您的 Amazon EC2 实例。

**注意事项**
+ NTP 时间源提供 UTC 时间尺度的闰秒平滑视图，而 PHC 不进行时间平滑。有关更多信息，请参阅 [闰秒](set-time.md#leap-seconds)。
+ 只有 Linux 实例可以访问本地 PTP 硬件时钟。Windows 实例必须使用 NTP 来访问增强版 Amazon Time Sync Service。
+ 对于使用[本地链路](using-instance-addressing.md#link-local-addresses)地址的服务，每秒数据包数（PPS）限制为 1024 个。此限制是 [Route 53 Resolver DNS 查询](https://docs.aws.amazon.com/vpc/latest/userguide/AmazonDNS-concepts.html#vpc-dns-limits)、[实例元数据服务（IMDS）](instancedata-data-retrieval.md)请求、Amazon Time Sync Service 网络时间协议（NTP）请求和 [Windows 许可服务（适用于基于 Microsoft Windows 的实例）](https://aws.amazon.com/windows/resources/licensing/)请求的总和。

**Topics**
+ [访问 Amazon Time Sync Service 的 IPv4 端点](#configure-amazon-time-service-IPv4)
+ [访问 Amazon Time Sync Service 的 IPv6 端点](#configure-amazon-time-service-IPv6)
+ [访问增强型 Amazon Time Sync Service](#enhanced-amazon-time-sync-service)
+ [访问 PTP 硬件时钟 (PHC)](#connect-to-the-ptp-hardware-clock)

## 访问 Amazon Time Sync Service 的 IPv4 端点
<a name="configure-amazon-time-service-IPv4"></a>

您的 AMI 可能已经默认配置了 Amazon Time Sync Service。否则请按照以下过程配置实例，从而通过 IPv4 端点使用本地 Amazon Time Sync Service。

有关故障排除问题的帮助，请参阅[排查 Linux 实例上的 NTP 同步问题](https://repost.aws/knowledge-center/linux-troubleshoot-ntp-synchronization)或[排查 Windows 实例上的时间问题](https://repost.aws/knowledge-center/ec2-windows-time-service)。

------
#### [ Amazon Linux ]

默认情况下，AL2023 以及最新版本的 Amazon Linux 2 配置为使用 Amazon Time Sync Service IPv4 端点。如果确认您的实例已经配置，则可以跳过下面的过程。

**验证 chrony 是否已配置为使用 IPv4 端点**  
运行如下命令。输出中以 `^*` 开始的行会指示首选的时间源。

```
[ec2-user ~]$ chronyc sources -v | grep -F ^*
```

```
^* 169.254.169.123               3   4   377    13  -4325ns[-9201ns] +/-  401us
```

**将 chrony 配置为连接到旧版 Amazon Linux 2 上的 IPv4 端点**

1. 连接到您的实例并卸载 NTP 服务。

   ```
   [ec2-user ~]$ sudo yum erase 'ntp*'
   ```

1. 安装 `chrony` 软件包。

   ```
   [ec2-user ~]$ sudo yum install chrony
   ```

1. 使用任何文本编辑器（如 **nano** 或 **vim**）打开 `/etc/chrony.conf` 文件。在该文件中可能存在的其他 `server` 或 `pool` 语句前面添加以下行，然后保存更改：

   ```
   server 169.254.169.123 prefer iburst minpoll 4 maxpoll 4
   ```

1. 重启 `chrony` 守护程序 (`chronyd`)。

   ```
   [ec2-user ~]$ sudo service chronyd restart
   ```

   ```
   Starting chronyd:                                          [  OK  ]
   ```
**注意**  
在 RHEL 和 CentOS (最高版本为 6) 上，服务名称是 `chrony` 而不是 `chronyd`。

1. 要配置 `chronyd` 为在每次系统启动时启动，请使用 `chkconfig` 命令。

   ```
   [ec2-user ~]$ sudo chkconfig chronyd on
   ```

1. 确认 `chrony` 使用 `169.254.169.123` IPv4 端点来同步时间。

   ```
   [ec2-user ~]$ chronyc sources -v | grep -F ^*
   ```

   输出中的 `^*` 会指示首选的时间源。

   ```
   ^* 169.254.169.123               3   6    17    43    -30us[ -226us] +/-  287us
   ```

1. 验证 `chrony` 报告的时间同步指标。

   ```
   [ec2-user ~]$ chronyc tracking
   ```

   ```
   Reference ID    : A9FEA97B (169.254.169.123)
   Stratum         : 4
   Ref time (UTC)  : Wed May 06 00:39:14 2026
   System time     : 0.000002191 seconds fast of NTP time
   Last offset     : +0.000002164 seconds
   RMS offset      : 0.000082968 seconds
   Frequency       : 3.710 ppm slow
   Residual freq   : +0.002 ppm
   Skew            : 0.504 ppm
   Root delay      : 0.000362541 seconds
   Root dispersion : 0.000225028 seconds
   Update interval : 16.1 seconds
   Leap status     : Normal
   ```

------
#### [ Ubuntu ]

**将 chrony 配置为连接到 Ubuntu 上的 IPv4 端点**

1. 连接到您的实例并使用 `apt` 安装 `chrony` 软件包。

   ```
   ubuntu:~$ sudo apt install chrony
   ```
**注意**  
如有必要，请先运行 `sudo apt update` 以更新您的实例。

1. 使用任何文本编辑器（如 **nano** 或 **vim**）打开 `/etc/chrony/chrony.conf` 文件。在该文件中已包含的任何其他 `server` 或 `pool` 语句前面添加以下行，然后保存您的更改：

   ```
   server 169.254.169.123 prefer iburst minpoll 4 maxpoll 4
   ```

1. 重新启动 `chrony` 服务。

   ```
   ubuntu:~$ sudo /etc/init.d/chrony restart
   ```

   ```
   Restarting chrony (via systemctl): chrony.service.
   ```

1. 确认 `chrony` 使用 `169.254.169.123` IPv4 端点来同步时间。

   ```
   ubuntu:~$ chronyc sources -v | grep -F ^*
   ```

   输出中以 `^*` 开始的行会指示首选的时间源。

   ```
   ^* 169.254.169.123               3   6    17    12    +15us[  +57us] +/-  320us
   ```

1. 验证 `chrony` 报告的时间同步指标。

   ```
   ubuntu:~$ chronyc tracking
   ```

   ```
   Reference ID    : A9FEA97B (169.254.169.123)
   Stratum         : 4
   Ref time (UTC)  : Wed May 06 00:39:14 2026
   System time     : 0.000002191 seconds fast of NTP time
   Last offset     : +0.000002164 seconds
   RMS offset      : 0.000082968 seconds
   Frequency       : 3.710 ppm slow
   Residual freq   : +0.002 ppm
   Skew            : 0.504 ppm
   Root delay      : 0.000362541 seconds
   Root dispersion : 0.000225028 seconds
   Update interval : 16.1 seconds
   Leap status     : Normal
   ```

------
#### [ SUSE Linux ]

从 SUSE Linux Enterprise Server 15 开始，`chrony` 是 NTP 的默认实现。

**将 chrony 配置为连接到 SUSE Linux 上的 IPv4 端点**

1. 使用任何文本编辑器（如 `/etc/chrony.conf` 或 **vim**）打开 **nano** 文件。

1. 确认该文件包含以下行：

   ```
   server 169.254.169.123 prefer iburst minpoll 4 maxpoll 4
   ```

   如果此行不存在，请添加它。

1. 注释掉任何其他服务器或池行。

1. 打开 YaST 并启用 chrony 服务。

------
#### [ Windows ]

从 2018 年 8 月的发行版开始，Windows AMI 默认情况下使用 Amazon Time Sync Service。从这些 AMI 启动的实例无需进一步配置，您可以跳过以下过程。

如果您使用的 AMI 默认未配置 Amazon Time Sync Service，则请先验证您当前的 NTP 配置。如果您的实例已经在使用 Amazon Time Sync Service的 IPv4 端点，则无需进行进一步配置。如果您的实例未使用 Amazon Time Sync Service，则请完成将 NTP 服务器更改为使用 Amazon Time Sync Service 的过程。

**验证 NTP 配置**

1. 从实例打开命令提示符窗口。

1. 通过键入以下命令获取当前 NTP 配置：

   ```
   w32tm /query /configuration
   ```

   该命令返回 Windows 实例的当前配置设置，并将显示您是否已连接到 Amazon Time Sync Service。

1. (可选) 通过键入以下命令获取当前配置的状态：

   ```
   w32tm /query /status
   ```

   该命令返回实例与 NTP 服务器同步的最后时间和轮询间隔等信息。

**更改 NTP 服务器以使用 Amazon Time Sync Service**

1. 从命令提示符窗口运行以下命令：

   ```
   w32tm /config /manualpeerlist:169.254.169.123 /syncfromflags:manual /update
   ```

1. 使用以下命令验证新设置：

   ```
   w32tm /query /configuration
   ```

   在返回的输出中，请确认 `NtpServer` 显示 `169.254.169.123` IPv4 端点。

**Amazon Windows AMI 的默认 NTP 设置**

亚马逊机器映像（AMI）通常符合现成的默认值，但在需要更改以便在 EC2 基础设施上正常工作的情况除外。以下设置已确定可在虚拟环境中正常工作，此外，还可将任何时间偏差保持在一秒的准确率内：
+ **更新间隔** – 控制时间服务调整系统时间准确性的频率。AWS 将更新间隔配置为每两分钟发生一次。
+ **NTP 服务器** – 从 2018 年 8 月版本开始，AMI 默认使用 Amazon Time Sync Service。此时间服务可通过位于 169.254.169.123 IPv4 端点的任何 AWS 区域 访问。此外，0x9 标记指示时间服务充当客户端，并使用 `SpecialPollInterval` 来确定与所配置的时间服务器核查时间的频率。
+ **类型** –“NTP”指示服务将充当独立的 NTP 客户端而不是作为域的一部分。
+ **已启用和 InputProvider** – 时间服务已启用并向操作系统提供时间。
+ **特殊轮询间隔**：对照所配置的 NTP 服务器，每 900 秒（即 15 分钟）检查一次。
**注意**  
对于 Windows Server 2025 AMI，`SpecialPollInterval` 值为 1024 秒而不是 900 秒。


| 注册表路径 | 键名称 | 数据 | 
| --- | --- | --- | 
| HKLM:\\System\\CurrentControlSet\\services\\w32time\\Config | UpdateInterval | 120 | 
| HKLM:\\System\\CurrentControlSet\\services\\w32time\\Parameters | NtpServer | 169.254.169.123,0x9 | 
| HKLM:\\System\\CurrentControlSet\\services\\w32time\\Parameters | 类型 | NTP | 
| HKLM:\\System\\CurrentControlSet\\services\\w32time\\TimeProviders\\NtpClient | 启用 | 1 | 
| HKLM:\\System\\CurrentControlSet\\services\\w32time\\TimeProviders\\NtpClient | InputProvider | 1 | 
| HKLM:\\System\\CurrentControlSet\\services\\w32time\\TimeProviders\\NtpClient | SpecialPollInterval | 900（Windows Server 2016、2019 和 2022）或 1024（Windows Server 2025） | 

------

## 访问 Amazon Time Sync Service 的 IPv6 端点
<a name="configure-amazon-time-service-IPv6"></a>

本节介绍如果您将实例配置为通过 IPv6 端点使用本地 Amazon Time Sync Service，在 [访问 Amazon Time Sync Service 的 IPv4 端点](#configure-amazon-time-service-IPv4) 中所述的步骤有何不同。它没有解释整个 Amazon Time Sync Service 配置流程。

IPv6 端点只能在[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)上访问。

不建议同时使用 IPv4 和 IPv6 端点条目。IPv4 和 IPv6 NTP 数据包来自您的实例的同一个本地服务器。没有必要同时配置 IPv4 和 IPv6 端点，这样做也不会提高实例上时间的准确性。

------
#### [ Linux ]

根据您使用的 Linux 发行版，当您到达编辑 `chrony.conf` 文件的步骤时，您将使用 Amazon Time Sync Service 的 IPv6 端点 (`fd00:ec2::123`) 而不是 IPv4 端点 (`169.254.169.123`)：

```
server fd00:ec2::123 prefer iburst minpoll 4 maxpoll 4
```

保存文件并验证 chrony 是否使用 `fd00:ec2::123` IPv6 端点来同步时间：

```
[ec2-user ~]$ chronyc sources -v
```

在输出中，如果您看到 `fd00:ec2::123` IPv6 端点，则配置完成。

------
#### [ Windows ]

当您到达将 NTP 服务器更改为使用 Amazon Time Sync Service 的步骤时，您将使用 Amazon Time Sync Service 的 IPv6 端点（`fd00:ec2::123`），而不是 IPv4 端点（`169.254.169.123`）：

```
w32tm /config /manualpeerlist:fd00:ec2::123 /syncfromflags:manual /update
```

验证您的新设置是否使用 `fd00:ec2::123` IPv6 端点同步时间：

```
w32tm /query /configuration
```

在输出中，请确认 `NtpServer` 显示 `fd00:ec2::123` IPv6 端点。

------

## 访问增强型 Amazon Time Sync Service
<a name="enhanced-amazon-time-sync-service"></a>

 增强版 Amazon Time Sync Service 为支持的 Amazon EC2 实例提供精度更高的本地时间源。在采用 `precision-time` 策略的置放群组中启动的实例可以访问这些本地源。对于需要从本地链路 NTP 源或 Linux 实例上的 PTP 硬件时钟 (PHC) 设备获得更精确时间的应用程序，我们建议使用精确时间置放群组。当您在精准时间置放群组中启动实例时，AWS 会将其放置于可直接访问 AWS 基础设施中高精度时间源的受支持硬件上。

**主要优势**
+  **默认情况下已改进 NTP 源**——如果您使用上一节所述的 NTP 链接本地 IP 地址，则您的实例可以立即访问增强型本地 NTP 时间源。
+  **微秒级精确时钟同步**——将您的 Amazon EC2 Linux 实例配置为使用 PTP 硬件时钟设备，即可实现微秒级精确的时钟同步。
+  **简化部署**——单一置放策略可确保所有实例均具备精准计时能力。
+  **硬件数据包时间戳**——访问底层数据包时间戳以进行网络测量。
+  **无额外费用**——精准时间置放群组免费提供。

**规则和限制**
+  所有 AWS 商业区域都提供精确时间置放群组。
+  精确时间置放群组支持以下 Gen7 及更高版本的 Amazon EC2 实例系列：
  +  **通用型：**M7a、M7g、M7gd、M7i、M7i-flex、M8a、M8g 
  +  **计算优化型：**C7a、C7gd、C7i、C7i-flex、C8g、C8gd 
  +  **内存优化型：**R7a、R7g、R7i、R8g、X8g 
  +  **存储优化型：**I8g、I8ge 
+  如果在一个精确的时间置放群组中启动一个实例，而没有足够的硬件来访问增强型 Amazon Time Sync Service，则请求将失败。
+  如果您停止精准时间置放群组中的某个实例，然后重启该实例，则其仍将在该置放群组中运行。但是，如果硬件不足，无法访问增强版 Amazon Time Sync Service，则启动可能会失败。
+  Amazon EC2 持续新增支持增强版 Amazon Time Sync Service 的硬件。如果您的请求因容量不足而失败，请稍后重试或尝试其他可用区。有关更多信息，请参阅 [排查 Amazon EC2 实例启动问题](troubleshooting-launch.md)。
+ 置放群组的规则和限制同样适用。有关更多信息，请参阅 [Amazon EC2 实例的置放群组](placement-groups.md)。

### 创建精确时间置放群组
<a name="create-precision-time-placement-group"></a>

您可以使用 AWS CLI、AWS 管理控制台或 AWS SDK 通过指定 `precision-time` 策略来创建精确时间置放群组。

**使用 AWS CLI**  
运行以下命令：

```
aws ec2 create-placement-group \
    --group-name {{my-precision-time-pg}} \
    --strategy precision-time
```

该命令返回您在创建容量预留时使用的置放群组 ARN，以及您在启动实例和关联置放群组时使用的群组名称或群组 ID。

### 启动实例
<a name="launch-instance-precision-time"></a>

创建精准时间置放群组后，在启动实例时指定该群组即可访问增强版 Amazon Time Sync Service：

```
aws ec2 run-instances \
    --image-id {{ami-0abcdef1234567890}} \
    --instance-type {{r7g.2xlarge}} \
    --placement GroupId={{pg-0aaa1111111111111}}
```

### 验证对增强版 Amazon Time Sync Service 的访问权限
<a name="verify-enhanced-local-ntp-time-source"></a>

在精确时间置放群组中启动实例后，您将受益于增强的 NTP 时间源。

例如，如果您在实例上使用 chronyd 进程守护程序，则可以验证 NTP 时间源现在被标识为 Stratum 1，并且时钟精度指标已得到改善：

```
[ec2-user ~]$ chronyc sources
```

```
MS Name/IP address         Stratum Poll Reach LastRx Last sample
===============================================================================
^* 169.254.169.123               1   4   377     3  +3477ns[+4689ns] +/-   91us
```

验证 `chrony` 报告的时间同步指标。

```
[ec2-user ~]$ chronyc tracking
```

```
Reference ID    : A9FEA97B (169.254.169.123)
Stratum         : 2
Ref time (UTC)  : Wed May 06 01:33:43 2026
System time     : 0.000000276 seconds fast of NTP time
Last offset     : +0.000000331 seconds
RMS offset      : 0.000001929 seconds
Frequency       : 2.870 ppm fast
Residual freq   : +0.000 ppm
Skew            : 0.031 ppm
Root delay      : 0.000107584 seconds
Root dispersion : 0.000036476 seconds
Update interval : 16.2 seconds
Leap status     : Normal
```

## 访问 PTP 硬件时钟 (PHC)
<a name="connect-to-the-ptp-hardware-clock"></a>

 PTP 硬件时钟 (PHC) 是[AWS Nitro System](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-nitro-instances.html) 的一部分。它可以在精确时间置放群组中启动的[支持的裸机和虚拟化 Amazon EC2 实例](#ptp-hardware-clock-requirements)上直接访问。PHC 设备目前只能在 Linux 实例上访问。以下部分介绍如何在 Linux 实例上设置和验证 PHC 设备。

### 要求
<a name="ptp-hardware-clock-requirements"></a>
+  支持的操作系统上已安装 ENA 驱动程序版本 2.10.0 或更高版本。
+  一个运行 Linux 的 Amazon EC2 实例。有关支持的操作系统的更多信息，请参阅 *GitHub* 上的驱动程序[先决条件](https://github.com/amzn/amzn-drivers/tree/master/kernel/linux/ena#prerequisites)。
+  一个在精准时间置放群组中启动的 Amazon EC2 实例（参见 [访问增强型 Amazon Time Sync Service](#enhanced-amazon-time-sync-service)）。

**注意**  
 在以下区域和特定实例系列中，增强版 Amazon Time Sync Service 和 PHC 设备无需精准时间置放群组即可访问。为获得最佳体验，我们建议改为在精准时间置放群组中启动 Amazon EC2 实例。  
支持旧版访问 AWS 区域：美国东部（弗吉尼亚州北部）、美国东部（俄亥俄州）、亚太地区（马来西亚）、亚太地区（泰国）、亚太地区（东京）和欧洲地区（斯德哥尔摩）
支持旧版访问的本地区域：美国东部（纽约市）
支持的旧版访问实例系列：  
**通用型：**M7a、M7g、M7i
**内存优化型：**R7a、R7g、R7i
**存储优化型：**I8g、I8ge

### 编译并启用支持 PHC 的 ENA 驱动程序
<a name="compile-enable-ena-driver-phc"></a>

 请始终查阅 *GitHub* 上 [ENA](https://github.com/amzn/amzn-drivers/tree/master/kernel/linux/ena#ptp-hardware-clock-phc) 驱动程序文档中最新版本弹性网络适配器（ENA）驱动程序的说明，以获取针对您操作系统的具体信息。以下为适用于 Amazon Linux 的步骤概述。

在开始之前，确保您的实例满足 [要求](#ptp-hardware-clock-requirements)。

**要编译并启用支持 PHC 的 ENA 驱动程序**

1. 安装必备组件

   ```
   [ec2-user ~]$ sudo yum update
   [ec2-user ~]$ sudo yum install kernel-devel-$(uname -r) git
   [ec2-user ~]$ sudo reboot
   ```

1. 加载所需的 ptp 模块。

   ```
   [ec2-user ~]$ sudo modprobe ptp
   ```

1. 检索最新的 ENA 驱动程序版本（2.10.0 版本或更高版本）。

   ```
   [ec2-user ~]$ git clone https://github.com/amzn/amzn-drivers.git /tmp/amzn-drivers
   ```

1. 使用 PHC 支持构建 ENA 驱动程序 `ena.ko`。

   ```
   [ec2-user ~]$ cd /tmp/amzn-drivers/kernel/linux/ena
   [ec2-user ~]$ ENA_PHC_INCLUDE=1 make
   ```

1. 重新加载 ENA 驱动程序并启用 PHC 设备。

   ```
   [ec2-user ~]$ sudo rmmod ena && sudo insmod ena.ko phc_enable=1
   ```

1. 验证加载的 ENA 驱动程序是否支持 PHC。

   ```
   [ec2-user ~]$ modinfo ena | grep -E "phc_enable"
   ```

   ```
   parm:           phc_enable:Enable PHC.
   ```

1. 验证 ENA 驱动程序是否已启用 PHC 支持。

   ```
   [ec2-user ~]$ cat /sys/module/ena/parameters/phc_enable
   ```

   ```
   1
   ```

有关安装驱动程序并在重启后激活 phc\_enable 选项的说明，请参阅 *GitHub* 上的 [ENA 驱动程序自述文件](https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/ena/README.rst)。

### 验证 PTP 设备配置
<a name="verify-ptp-device-configuration"></a>

验证 ENA PTP 硬件时钟设备是否显示在您的实例上。

```
[ec2-user ~]$ for file in /sys/class/ptp/*; do echo -n "$file: "; cat "$file/clock_name"; done
```

预期输出

```
/sys/class/ptp/ptp{{<index>}}: ena-ptp-{{<PCI slot>}}
```

其中：
+ `{{index}}` 是内核注册的 PTP 硬件时钟索引。
+ `{{PCI slot}}` 是 ENA 以太网控制器 PCI 插槽。这与 `lspci | grep ENA` 中所示的插槽相同。

示例输出

```
/sys/class/ptp/{{ptp0}}: ena-ptp-{{05}}
```

如果输出中没有 `ena-ptp-{{<PCI slot>}}`，则说明未正确安装 ENA 驱动程序。查看 [编译并启用支持 PHC 的 ENA 驱动程序](#compile-enable-ena-driver-phc) 中的步骤。

### 配置 PTP 符号链接
<a name="configure-ptp-symlink"></a>

PTP 设备的名称通常命名为 `/dev/ptp0`、`/dev/ptp1`，以此类推，其索引取决于硬件初始化顺序。创建符号链接可确保无论索引如何更改，chrony 这类应用程序始终能引用正确的设备。

最新的 Amazon Linux 2023 AMI 包括一条创建 `/dev/ptp_ena` 符号链接的 `udev` 规则，该规则指向与 ENA 主机关联的正确 `/dev/ptp` 条目。

首先，通过运行以下命令，检查是否已存在符号链接。

```
[ec2-user ~]$ ls -l /dev/ptp*
```

示例输出

```
crw------- 1 root root 245, 0 Jan 31 2025 /dev/ptp0
lrwxrwxrwx 1 root root      4 Jan 31 2025 /dev/ptp_ena -> ptp0
```

其中：
+ `/dev/ptp{{<index>}}` 是 PTP 设备的路径。
+ `/dev/ptp_ena` 是常量符号链接，它指向同一 PTP 设备。

如果存在 `/dev/ptp_ena` 符号链接，请跳至 [配置 chronyd 进程守护程序以使用 PHC 设备](#configure-chronyd-phc)。如果缺少符号链接，请执行以下操作之一：

**创建 PTP 符号链接**

1. 添加以下 `udev` 代码。

   ```
   [ec2-user ~]$ echo "SUBSYSTEM==\"ptp\", ATTR{clock_name}==\"ena-ptp-*\", SYMLINK += \"ptp_ena\"" | sudo tee -a /etc/udev/rules.d/53-ec2-network-interfaces.rules
   ```

1. 通过重启实例或通过运行以下命令来重新加载 `udev` 规则。

   ```
   [ec2-user ~]$ sudo udevadm control --reload-rules && sudo udevadm trigger
   ```

### 配置 chronyd 进程守护程序以使用 PHC 设备
<a name="configure-chronyd-phc"></a>

必须将 chronyd 时钟同步进程守护程序配置为使用 PHC 设备作为额外的时间源，使用 `/dev/ptp_ena` 符号链接来识别该设备。

**要配置 chronyd 进程守护程序以使用 PHC 设备**

1. 使用文本编辑器编辑 `/etc/chrony.conf`，并添加以下行：

   ```
   refclock PHC /dev/ptp_ena poll 0 delay 0.000010 prefer
   ```

1. 重新启动 chrony。

   ```
   [ec2-user ~]$ sudo systemctl restart chronyd
   ```

1. 验证 chrony 是否使用 PTP 硬件时钟。PHC0 设备必须是首选时间源，层数值为 0。本地 NTP 时间源（如果已配置）必须具有 Stratum 1 值。

   ```
   [ec2-user ~]$ chronyc sources
   ```

   ```
   MS Name/IP address         Stratum Poll Reach LastRx Last sample
   ===============================================================================
   #* PHC0                          0   0   377     0   +184ns[ +198ns] +/- 5032ns
   ^- 169.254.169.123               1   4   377     8    -18us[  -18us] +/-  115us
   ```

### 验证硬件数据包时间戳
<a name="verify-hardware-packet-timestamping"></a>

加载了 PHC 支持的 ENA 驱动程序提供对硬件数据包时间戳的访问。您可以使用 `ethtool -T {{interface}}` 命令验证对此功能的支持。

有关使用硬件数据包时间戳的更多信息，请参阅[数据包时间戳 Linux 文档](https://www.kernel.org/doc/html/latest/networking/timestamping.html)。

```
[ec2-user ~]$ sudo ethtool -T {{ens5}}
```

```
Time stamping parameters for ens5:
Capabilities:
        software-transmit
        hardware-receive
        software-receive
        software-system-clock
PTP Hardware Clock: 0
Hardware Transmit Timestamp Modes: none
Hardware Receive Filter Modes:
        none
        all
```

如果输出结果显示 Capabilities 列表中包含 `hardware-receive`，则表示您的实例支持硬件数据包时间戳。
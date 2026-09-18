

# 更改实例的时区
<a name="change-time-zone-of-instance"></a>

Amazon EC2 实例默认设置为 UTC（协调世界时）时区。您可以将实例上的时间更改为本地时区或网络中的其他时区。

请使用适用于您实例操作系统的说明。

## Linux
<a name="change_time_zone"></a>

**重要**  
此信息适用于 Amazon Linux。有关其他发布版本的信息，请参阅特定于该版本的文档。

**在 Amazon Linux 上更改时区**

1. 查看系统的当前时区设置。

   ```
   [ec2-user ~]$ timedatectl
   ```

1. 列出可用的时区。

   ```
   [ec2-user ~]$ timedatectl list-timezones
   ```

1. 设置选定的时区。

   ```
   [ec2-user ~]$ sudo timedatectl set-timezone {{America/Vancouver}}
   ```

1. （可选）通过运行 **timedatectl** 命令，确认当前时区已更新为新时区。

   ```
   [ec2-user ~]$ timedatectl
   ```

## Windows
<a name="windows-changing-time-zone"></a>

**更改 Windows 实例上的时区**

1. 从实例打开命令提示符窗口。

1. 确定将在实例上使用的时区。要获取时区的列表，请使用以下命令：

   ```
   tzutil /l
   ```

   该命令采用以下格式返回所有可用时区的列表：

   ```
   {{display name}}
   {{time zone ID}}
   ```

1. 查找要分配给该实例的时区 ID。

1. 示例：分配 UTC 时区：

   ```
   tzutil /s "UTC"
   ```

   示例：分配太平洋标准时间：

   ```
   tzutil /s "Pacific Standard Time"
   ```

在更改 Windows 实例上的时间时，必须确保该时区在系统重启后仍然保留。否则，当实例重新启动时，它会恢复使用 UTC 时间。可通过添加 **RealTimeIsUniversal** 注册表项来保留时区设置。默认情况下，会在所有当前一代实例上设置此注册表项。若要验证是否设置了 **RealTimeIsUniversal** 注册表项，请参阅以下过程中的步骤 3。如果未设置该注册表项，请从头开始执行以下步骤。

**设置 RealTimeIsUniversal 注册表项**

1. 从实例打开命令提示符窗口。

1. 使用以下命令添加注册表项：

   ```
   reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\TimeZoneInformation" /v RealTimeIsUniversal /d 1 /t REG_DWORD /f
   ```

1. (可选) 验证该实例是否使用以下命令成功保存了该注册表项：

   ```
   reg query "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\TimeZoneInformation" /s
   ```

   此命令返回 **TimeZoneInformation** 注册表项的子项。您应在列表底部看到 **RealTimeIsUniversal** 项，类似于下文：

   ```
   HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\TimeZoneInformation
       Bias                            REG_DWORD     0x1e0
       DaylightBias                    REG_DWORD     0xffffffc4
       DaylightName                    REG_SZ        @tzres.dll,-211
       DaylightStart                   REG_BINARY    00000300020002000000000000000000
       StandardBias                    REG_DWORD     0x0
       StandardName                    REG_SZ        @tzres.dll,-212
       StandardStart                   REG_BINARY    00000B00010002000000000000000000
       TimeZoneKeyName                 REG_SZ        Pacific Standard Time
       DynamicDaylightTimeDisabled     REG_DWORD     0x0
       ActiveTimeBias                  REG_DWORD     0x1a4
       RealTimeIsUniversal             REG_DWORD     0x1
   ```


# 在您的 EC2 实例或任何连接互联网的设备上设置时间参考，以使用公共 Amazon Time Sync Service
<a name="configure-time-sync"></a>

您可以将实例或任何互联网连接设备（例如您的本地计算机或本地服务器）设置为使用公共 Amazon Time Sync Service，该服务可通过 `time.aws.com` 在互联网上进行访问。您可以使用公共 Amazon Time Sync Service 作为本地 Amazon Time Sync Service 的备份，并将 AWS 以外的资源连接到 Amazon Time Sync Service。

**注意**  
为了获得最佳性能，建议在您的实例上使用*本地* Amazon Time Sync Service，并且仅使用*公共* Amazon Time Sync Service 作为备份。

使用适用于您的实例或设备操作系统的说明。

## Linux
<a name="configure-time-sync-linux"></a>

**使用 chrony 或 ntpd 将您的 Linux 实例或设备设置为使用公共 Amazon Time Sync Service**

1. 使用文本编辑器编辑 `/etc/chrony.conf`（如您使用 chrony）或 `/etc/ntp.conf`（如您使用 ntpd），如下所示：

   1. 为防止您的实例或设备尝试混用已涂抹和未涂抹的服务器，请移除或注释掉以 `server` 开头的行，但与本地 Amazon Time Sync Service 的任何现有连接除外。
**重要**  
如果您要将 EC2 实例设置为连接到公共 Amazon Time Sync Service，请勿删除以下将您的实例设置为连接到本地 Amazon Time Sync Service 的行。本地 Amazon Time Sync Service 是一种更直接的连接，可以提供更好的时钟准确度。公共 Amazon Time Sync Service 只能用作备份。  

      ```
      server 169.254.169.123 prefer iburst minpoll 4 maxpoll 4
      ```

   1. 添加以下行以连接到公共 Amazon Time Sync Service。

      ```
      pool time.aws.com iburst
      ```

1. 使用以下命令之一重启进程守护程序。
   + chrony

     ```
     sudo service chronyd force-reload
     ```
   + ntpd

     ```
     sudo service ntp reload
     ```

## macOS
<a name="configure-time-sync-macos"></a>

**将您的 macOS 实例或设备设置为使用公共 Amazon Time Sync Service**

1. 打开 **System Preferences (系统首选项)**。

1. 选择 **Date & Time**（日期和时间），然后选择 **Date & Time**（日期和时间）选项卡。

1. 要进行更改，请选择锁定图标，并在出现提示时输入密码。

1. 对于**自动设置日期和时间**，请输入 **time.aws.com**。

## Windows
<a name="configure-time-sync-windows"></a>

**将您的 Windows 实例或设备设置为使用公共 Amazon Time Sync Service**

1. 打开 **Control Panel**（控制面板）。

1. 选择 **Date and Time**（日期和时间）图标。

1. 选择 **Internet Time**（互联网时间）选项卡。如果您的 PC 是域的一部分，此选项卡将不可用。在这种情况下，您的 PC 将与域控制器同步时间。您可以将控制器配置为使用公共 Amazon Time Sync Service。

1. 选择 **Change settings**（更改设置）。

1. 选中**与互联网时间服务器同步**复选框。

1. 在**服务器**旁边，输入 **time.aws.com**。

**将您的 Windows Server 实例或设备设置为使用公共 Amazon Time Sync Service**
+ 按照 [Microsoft 的说明](https://support.microsoft.com/en-us/kb/816042)更新注册表。
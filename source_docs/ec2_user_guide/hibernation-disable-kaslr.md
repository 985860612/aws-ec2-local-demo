

# 在实例上禁用 KASLR（仅限 Ubuntu）
<a name="hibernation-disable-kaslr"></a>

要使用 Ubuntu 16.04 LTS（Xenial Xerus）、发布序列号为 20190722.1 或更晚的 Ubuntu 18.04 LTS - Bionic 或者发布序列号为 20210820 或更晚的 Ubuntu 20.04 LTS（Bionic Beaver）在新启动的实例上运行休眠，我们建议禁用 KASLR（内核地址空间布局随机掩码）。在 Ubuntu 16.04 LTS、Ubuntu 18.04 LTS 或 Ubuntu 20.04 LTS 上，默认启用 KASLR。

KASLR 是一项标准 Linux 内核安全功能，它通过随机化内核的基本地址值，来帮助减少尚未发现的内存访问漏洞的风险和后果。启用 KASLR 后，实例在休眠后可能无法恢复。

要详细了解 KASLR，请参阅 [Ubuntu 功能](https://wiki.ubuntu.com/Security/Features)。

**在使用 Ubuntu 启动的实例上禁用 KASLR**

1. 使用 SSH 连接到您的实例。有关更多信息，请参阅 [使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)。

1. 在选定编辑器中打开 `/etc/default/grub.d/50-cloudimg-settings.cfg` 文件。编辑 `GRUB_CMDLINE_LINUX_DEFAULT` 行以将 `nokaslr` 选项追加到其末尾，如以下示例所示。

   ```
   GRUB_CMDLINE_LINUX_DEFAULT="console=tty1 console=ttyS0 nvme_core.io_timeout=4294967295 nokaslr"
   ```

1. 保存文件并退出您的编辑器。

1. 运行以下命令来重新构建 grub 配置。

   ```
   sudo update-grub
   ```

1. 重启实例。

   ```
   sudo reboot
   ```

1. 运行以下命令确认 `nokaslr` 已添加。

   ```
   cat /proc/cmdline
   ```

   命令的输出应包含 `nokaslr` 选项。
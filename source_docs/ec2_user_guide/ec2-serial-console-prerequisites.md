

# EC2 Serial Console 的先决条件
<a name="ec2-serial-console-prerequisites"></a>

**Topics**
+ [AWS 区域](#sc-prereqs-regions)
+ [Wavelength 区域](#sc-prereqs-wavelength-zones-outposts)
+ [AWS Outposts](#sc-prereqs-outposts)
+ [Local Zones](#sc-prereqs-local-zones)
+ [实例类型](#sc-prereqs-instance-types)
+ [授予访问权限](#sc-prereqs-configure-ec2-serial-console)
+ [支持基于浏览器的客户端](#sc-prereqs-for-browser-based-connection)
+ [实例状态](#sc-prereqs-instance-state)
+ [Amazon EC2 Systems Manager](#sc-prereqs-ssm)
+ [配置您选择的故障排除工具](#sc-prereqs-configure-troubleshooting-tool)

## AWS 区域
<a name="sc-prereqs-regions"></a>

除 AWS European Sovereign Cloud (Germany) 外，所有 AWS 区域 均支持。

## Wavelength 区域
<a name="sc-prereqs-wavelength-zones-outposts"></a>

不支持。

## AWS Outposts
<a name="sc-prereqs-outposts"></a>

所有 AWS Outposts 均支持。

## Local Zones
<a name="sc-prereqs-local-zones"></a>

在所有 Local Zones 中支持。

## 实例类型
<a name="sc-prereqs-instance-types"></a>

支持的实例类型：
+ **Linux**
  + 基于 Nitro 系统构建的所有虚拟化实例。
  + 所有裸机实例，以下项除外：
    + 通用型：`a1.metal`、`mac1.metal`、`mac2.metal`、`mac2-m1ultra.metal`、`mac2-m2.metal`、`mac2-m2pro.metal`、`mac-m3ultra.metal`、`mac-m4.metal`、`mac-m4max.metal` 和 `mac-m4pro.metal`
    + 加速计算：`g5g.metal`
    + 内存优化型：`u-6tb1.metal`、`u-9tb1.metal`、`u-12tb1.metal`、`u-18tb1.metal` 和 `u-24tb1.metal`
+ **Windows**：
  + 基于 Nitro 系统构建的所有虚拟化实例。
  + 所有裸机实例，以下项除外：
    + 通用型：`a1.metal`、`mac1.metal`、`mac2.metal`、`mac2-m1ultra.metal`、`mac2-m2.metal`、`mac2-m2pro.metal`、`mac-m3ultra.metal`、`mac-m4.metal`、`mac-m4max.metal` 和 `mac-m4pro.metal`
    + 加速计算：`g5g.metal`
    + 内存优化型：`u-6tb1.metal`、`u-9tb1.metal`、`u-12tb1.metal`、`u-18tb1.metal` 和 `u-24tb1.metal`

## 授予访问权限
<a name="sc-prereqs-configure-ec2-serial-console"></a>

您必须完成配置任务才能授予对 EC2 Serial Console 的访问权限。有关更多信息，请参阅 [配置对 EC2 Serial Console 的访问](configure-access-to-serial-console.md)。

## 支持基于浏览器的客户端
<a name="sc-prereqs-for-browser-based-connection"></a>

如需[使用基于浏览器的客户端](connect-to-serial-console.md#sc-connect-browser-based-client)连接至串行控制台，您的浏览器必须支持 WebSocket。如果您的浏览器不支持 WebSocket，请[使用您自己的密钥和 SSH 客户端](connect-to-serial-console.md#sc-connect-SSH)连接至串行控制台。

基于浏览器的客户端通过端口 443 连接到您所在区域的 EC2 Instance Connect 代理端点。端点格式取决于[分区](https://docs.aws.amazon.com/glossary/latest/reference/glos-chap.html#partition)：
+ 商用 AWS 区域和 AWS GovCloud（美国）区域使用端点格式：`prod.{{region}}.oneclickv2-proxy.ec2.aws.dev`。
+ 中国区域使用端点格式：`prod.{{region}}.oneclickv2-proxy.ec2.a2z.org.cn`。

以下示例显示了每个分区的端点：
+ 对于美国东部（弗吉尼亚州北部）区域，端点为 `prod.us-east-1.oneclickv2-proxy.ec2.aws.dev`。
+ 对于中国（北京）区域， 端点为 `prod.cn-north-1.oneclickv2-proxy.ec2.a2z.org.cn`。

**注意**  
您的浏览器必须能够访问此端点。如果防火墙或 VPN 阻止了连接，则连接将失败。

## 实例状态
<a name="sc-prereqs-instance-state"></a>

必须是 `running`。

如果实例处于 `pending`、`stopping`、`stopped`、`shutting-down` 或 `terminated` 状态，则无法连接到串行控制台。

有关实例状态的更多信息，请参阅 [Amazon EC2 实例状态更改](ec2-instance-lifecycle.md)。

## Amazon EC2 Systems Manager
<a name="sc-prereqs-ssm"></a>

如果实例使用 Amazon EC2 Systems Manager，则必须在实例上安装 SSM Agent 3.0.854.0 版或更高版本。有关 SSM Agent 的更多信息，请参阅《*AWS Systems Manager 用户指南*》中的[使用 SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)。

## 配置您选择的故障排除工具
<a name="sc-prereqs-configure-troubleshooting-tool"></a>

要使用串行控制台对 Windows 实例进行故障排除，在 Linux 实例上可以使用 GRUB 或 SysRq，在 Windows 实例上可使用特殊管理控制台（SAC）。您必须先在要使用这些工具的每个实例上执行配置步骤，然后才可以使用这些工具。

请使用适用于实例操作系统的说明，配置您选择的故障排除工具。

### （Linux 实例）配置 GRUB
<a name="configure-grub"></a>

要配置 GRUB，请根据用于启动实例的 AMI 选择以下程序之一。

------
#### [ Amazon Linux 2 ]

**在 Amazon Linux 2 实例上配置 GRUB**

1. [使用 SSH 连接到 Linux 实例](connect-to-linux-instance.md)

1. 在 `/etc/default/grub` 中添加或更改以下选项：
   + 设置 `GRUB_TIMEOUT=1`。
   + 添加 `GRUB_TERMINAL="console serial"`。
   + 添加 `GRUB_SERIAL_COMMAND="serial --speed=115200"`。

   以下是 `/etc/default/grub` 的示例。您可能需要根据系统设置更改配置。

   ```
   GRUB_CMDLINE_LINUX_DEFAULT="console=tty0 console=ttyS0,115200n8 net.ifnames=0 biosdevname=0 nvme_core.io_timeout=4294967295 rd.emergency=poweroff rd.shell=0"
   GRUB_TIMEOUT=1
   GRUB_DISABLE_RECOVERY="true"
   GRUB_TERMINAL="console serial"
   GRUB_SERIAL_COMMAND="serial --speed=115200"
   ```

1. 运行以下命令以应用更新后的配置。

   ```
   [ec2-user ~]$ sudo grub2-mkconfig -o /boot/grub2/grub.cfg
   ```

------
#### [ Ubuntu ]

**在 Ubuntu 实例上配置 GRUB**

1. [连接到您的实例](connect-to-linux-instance.md)。

1. 在 `/etc/default/grub.d/50-cloudimg-settings.cfg` 中添加或更改以下选项：
   + 设置 `GRUB_TIMEOUT=1`。
   + 添加 `GRUB_TIMEOUT_STYLE=menu`。
   + 添加 `GRUB_TERMINAL="console serial"`。
   + 删除 `GRUB_HIDDEN_TIMEOUT`。
   + 添加 `GRUB_SERIAL_COMMAND="serial --speed=115200"`。

   以下是 `/etc/default/grub.d/50-cloudimg-settings.cfg` 的示例。您可能需要根据系统设置更改配置。

   ```
   # Cloud Image specific Grub settings for Generic Cloud Images
   # CLOUD_IMG: This file was created/modified by the Cloud Image build process
   
   # Set the recordfail timeout
   GRUB_RECORDFAIL_TIMEOUT=0
   
   # Do not wait on grub prompt
   GRUB_TIMEOUT=1
   GRUB_TIMEOUT_STYLE=menu
   
   # Set the default commandline
   GRUB_CMDLINE_LINUX_DEFAULT="console=tty1 console=ttyS0 nvme_core.io_timeout=4294967295"
   
   # Set the grub console type
   GRUB_TERMINAL="console serial"
   GRUB_SERIAL_COMMAND="serial --speed 115200"
   ```

1. 运行以下命令以应用更新后的配置。

   ```
   [ec2-user ~]$ sudo update-grub
   ```

------
#### [ RHEL ]

**在 RHEL 实例上配置 GRUB**

1. [连接到您的实例](connect-to-linux-instance.md)。

1. 在 `/etc/default/grub` 中添加或更改以下选项：
   + 删除 `GRUB_TERMINAL_OUTPUT`。
   + 添加 `GRUB_TERMINAL="console serial"`。
   + 添加 `GRUB_SERIAL_COMMAND="serial --speed=115200"`。

   以下是 `/etc/default/grub` 的示例。您可能需要根据系统设置更改配置。

   ```
   GRUB_TIMEOUT=1
   GRUB_DISTRIBUTOR="$(sed 's, release .*$,,g' /etc/system-release)"
   GRUB_DEFAULT=saved
   GRUB_DISABLE_SUBMENU=true
   GRUB_CMDLINE_LINUX="console=tty0 console=ttyS0,115200n8 net.ifnames=0 rd.blacklist=nouveau nvme_core.io_timeout=4294967295 crashkernel=auto"
   GRUB_DISABLE_RECOVERY="true"
   GRUB_ENABLE_BLSCFG=true
   GRUB_TERMINAL="console serial"
   GRUB_SERIAL_COMMAND="serial --speed=115200"
   ```

1. 运行以下命令以应用更新后的配置。

   ```
   [ec2-user ~]$ sudo grub2-mkconfig -o /boot/grub2/grub.cfg --update-bls-cmdline
   ```

   对于 RHEL 9.2 及更早版本，请使用以下命令。

   ```
   [ec2-user ~]$ sudo grub2-mkconfig -o /boot/grub2/grub.cfg
   ```

------
#### [ CentOS ]

对于使用 CentOS AMI 启动的实例，默认情况下为串行控制台配置了 GRUB。

以下是 `/etc/default/grub` 的示例。根据您的系统设置，您的配置可能会有所不同。

```
GRUB_TIMEOUT=1
GRUB_DISTRIBUTOR="$(sed 's, release .*$,,g' /etc/system-release)"
GRUB_DEFAULT=saved
GRUB_DISABLE_SUBMENU=true
GRUB_TERMINAL="serial console"
GRUB_SERIAL_COMMAND="serial --speed=115200"
GRUB_CMDLINE_LINUX="console=tty0 crashkernel=auto console=ttyS0,115200"
GRUB_DISABLE_RECOVERY="true"
```

------

### （Linux 实例）配置 SysRq
<a name="configure-sysrq"></a>

要配置 SysRq，请在当前引导周期中启用 SysRq 命令。要使配置永久化，您还可以为后续引导启用 SysRq 命令。

**为当前引导周期启用所有 SysRq 命令**

1. [连接到您的实例](connect-to-linux-instance.md)。

1. 运行以下命令。

   ```
   [ec2-user ~]$ sudo sysctl -w kernel.sysrq=1
   ```

   下次重新启动时将会清除此设置。

**为后续引导启用所有 SysRq 命令**

1. 创建文件 `/etc/sysctl.d/99-sysrq.conf` 并在您收藏的编辑器中打开。

   ```
   [ec2-user ~]$ sudo vi /etc/sysctl.d/99-sysrq.conf
   ```

1. 添加以下行。

   ```
   kernel.sysrq=1
   ```

1. 重启实例以应用更改。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. 在 `login` 提示符下，输入您[之前设置](configure-access-to-serial-console.md#set-user-password)的、基于密码的用户的用户名，然后按 **Enter** 键。

1. 在 `Password` 提示符下，输入密码，然后按 **Enter** 键。

### （Windows 实例）启用 SAC 和启动菜单
<a name="configure-sac-bootmenu"></a>

**注意**  
如果您在实例上启用 SAC，则依赖密码检索的 EC2 服务将无法通过 Amazon EC2 控制台运行。Amazon EC2 启动代理（EC2Config、EC2Launch v1 和 EC2Launch v2）上的 Windows 依靠串行控制台来执行各种任务。当您在实例上启用 SAC 时，这些任务不会成功执行。有关 Amazon EC2 启动代理上的 Windows 的更多信息，请参阅 [配置您的 Amazon EC2 Windows 实例](ec2-windows-instances.md)。如果您启用 SAC，则可在之后将其禁用。有关更多信息，请参阅 [禁用 SAC 和启动菜单](troubleshoot-using-serial-console.md#disable-sac-bootmenu)。

使用以下方法之一在实例上启用 SAC 和启动菜单。

------
#### [ PowerShell ]

**在 Windows 实例上启用 SAC 和启动菜单**

1. [连接到](connecting_to_windows_instance.md)您的实例并从提升的 PowerShell 命令行执行以下步骤。

1. 启用 SAC。

   ```
   bcdedit /ems '{current}' on
   bcdedit /emssettings EMSPORT:1 EMSBAUDRATE:115200
   ```

1. 启用启动菜单。

   ```
   bcdedit /set '{bootmgr}' displaybootmenu yes
   bcdedit /set '{bootmgr}' timeout 15
   bcdedit /set '{bootmgr}' bootems yes
   ```

1. 重新启动实例以应用更新后的配置。

   ```
   shutdown -r -t 0
   ```

------
#### [ Command prompt ]

**在 Windows 实例上启用 SAC 和启动菜单**

1. [连接到](connecting_to_windows_instance.md)您的实例并从命令提示符执行以下步骤。

1. 启用 SAC。

   ```
   bcdedit /ems {current} on
   bcdedit /emssettings EMSPORT:1 EMSBAUDRATE:115200
   ```

1. 启用启动菜单。

   ```
   bcdedit /set {bootmgr} displaybootmenu yes
   bcdedit /set {bootmgr} timeout 15
   bcdedit /set {bootmgr} bootems yes
   ```

1. 重新启动实例以应用更新后的配置。

   ```
   shutdown -r -t 0
   ```

------
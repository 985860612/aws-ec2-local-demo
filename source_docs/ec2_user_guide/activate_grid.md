

# 在基于 Amazon EC2 GPU 的实例上激活 NVIDIA GRID 虚拟应用程序
<a name="activate_grid"></a>

要激活基于 GPU 的实例上的 GRID 虚拟应用程序（默认情况下启用 NVIDIA GRID 虚拟工作站），您必须为驱动程序定义产品类型。您使用的过程取决于实例的操作系统。

## Linux 实例
<a name="activate-nvidia-grid-linux"></a>

**激活 Linux 实例上的 GRID 虚拟应用程序**

1. 从提供的模板文件创建 `/etc/nvidia/gridd.conf` 文件。

   ```
   [ec2-user ~]$ sudo cp /etc/nvidia/gridd.conf.template /etc/nvidia/gridd.conf
   ```

1. 在您常用的文本编辑器中打开 `/etc/nvidia/gridd.conf` 文件。

1. 找到 `FeatureType` 行，并将其设置为 `0`。然后，添加包含 `IgnoreSP=TRUE` 的行。

   ```
   FeatureType=0 IgnoreSP=TRUE
   ```

1. 保存文件并退出。

1. 重启实例以接受新配置。

   ```
   [ec2-user ~]$ sudo reboot
   ```

## Windows 实例
<a name="activate-nvidia-grid-windows"></a>

**激活 Windows 实例上的 GRID 虚拟应用程序**

1. 运行 **regedit.exe** 以打开注册表编辑器。

1. 导航到 `HKEY_LOCAL_MACHINE\SOFTWARE\NVIDIA Corporation\Global\GridLicensing`。

1. 打开右侧窗格上的上下文 (右键单击) 菜单，选择**新建**，然后选择 **DWORD**。

1. 对于 **Name** (名称)，输入 **FeatureType**，然后按 `Enter`。

1. 打开 **FeatureType** 上的上下文 (右键单击) 菜单，然后选择**修改**。

1. 对于**值数据**，请输入 NVIDIA GRID 虚拟应用的 `0` 并选择 **OK**。

1. 打开右侧窗格上的上下文 (右键单击) 菜单，选择**新建**，然后选择 **DWORD**。

1. 对于**名称**，输入 **IgnoreSP**，然后按 `Enter`。

1. 打开 **IgnoreSP** 上的上下文 (右键单击) 菜单，然后选择**修改**。

1. 对于**值数据**，键入 `1`，然后选择**确定**。

1. 关闭注册表编辑器。


# 确定 EC2 实例操作系统的启动模式
<a name="os-boot-mode"></a>

AMI 的启动模式指导 Amazon EC2 使用哪种启动模式来启动实例。要查看实例的操作系统是否配置为 UEFI，需要通过 SSH（Linux 实例）或 RDP（Windows 实例）连接到实例。

请使用适用于您实例操作系统的说明。

## Linux
<a name="os-boot-mode-linux"></a>

**要确定实例操作系统的启动模式**

1. [使用 SSH 连接到 Linux 实例](connect-linux-inst-ssh.md)。

1. 要查看操作系统的启动模式，请尝试以下任一操作：
   + 运行如下命令。

     ```
     [ec2-user ~]$ sudo /usr/sbin/efibootmgr
     ```

     在 UEFI 启动模式下启动的实例的预期输出

     ```
     BootCurrent: 0001
     Timeout: 0 seconds
     BootOrder: 0000,0001
     Boot0000* UiApp
     Boot0001* UEFI Amazon Elastic Block Store vol-xyz
     ```
   + 运行以下命令以验证 `/sys/firmware/efi` 目录是否存在。仅当实例使用 UEFI 启动时，此目录才会存在。如果此目录不存在，该命令将返回 `Legacy BIOS Boot Detected`。

     ```
     [ec2-user ~]$ [ -d /sys/firmware/efi ] && echo "UEFI Boot Detected" || echo "Legacy BIOS Boot Detected"
     ```

     在 UEFI 启动模式下启动的实例的预期输出

     ```
     UEFI Boot Detected
     ```

     在传统 BIOS 启动模式下启动的实例的预期输出

     ```
     Legacy BIOS Boot Detected
     ```
   + 运行以下命令以验证 EFI 是否出现在 `dmesg` 输出中。

     ```
     [ec2-user ~]$ dmesg | grep -i "EFI"
     ```

     在 UEFI 启动模式下启动的实例的预期输出

     ```
     [    0.000000] efi: Getting EFI parameters from FDT:
     [    0.000000] efi: EFI v2.70 by EDK II
     ```

## Windows
<a name="os-boot-mode-windows"></a>

**要确定实例操作系统的启动模式**

1. [使用 RDP 连接到 Windows 实例](connecting_to_windows_instance.md)。

1. 转到**系统信息**并检查 **BIOS 模式**行。  
![显示所选 BIOS 模式行的系统信息窗口。BIOS 模式的值为 Legacy。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/BIOS-mode-win.png)
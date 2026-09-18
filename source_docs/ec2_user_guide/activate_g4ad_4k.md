

# 在 G4ad Linux 实例上设置双 4K 显示屏
<a name="activate_g4ad_4k"></a>

启动 G4ad 实例后，您可以设置双 4K 显示屏。

**安装 AMD 驱动程序并配置双屏**

1. 连接到您的 Linux 实例以获取相关 GPU 的 PCI 总线地址，以用作双 4K（2x4k）的目标：

   ```
   lspci -vv | grep -i amd
   ```

   您将获得与下内容类似的输出：

   ```
   00:1e.0 Display controller: Advanced Micro Devices, Inc. [*AMD*/ATI] Device 7362 (rev c3)
   Subsystem: Advanced Micro Devices, Inc. [AMD/ATI] Device 0a34
   ```

1. 请注意，上述输出中的 PCI 总线地址为 00:1e.0。创建一个名为 `/etc/modprobe.d/amdgpu.conf` 的文件然后添加：

   ```
   options amdgpu virtual_display=0000:00:1e.0,2
   ```

1. 要在 Linux 上安装 AMD 驱动程序，请参阅 [EC2 实例的 AMD 驱动程序](install-amd-driver.md)。如果您已经安装了 AMD GPU 驱动程序，则需要通过 dkms 重建 amdgpu 内核模块。

1. 使用下面的 xorg.conf 文件定义双（2x4K）屏幕拓扑并将文件保存到 `/etc/X11/xorg.conf:`

   ```
   ~$ cat /etc/X11/xorg.conf
   Section "ServerLayout"
       Identifier     "Layout0"
       Screen          0 "Screen0"
       Screen        1 "Screen1"
       InputDevice     "Keyboard0" "CoreKeyboard"
       InputDevice     "Mouse0" "CorePointer"
       Option          "Xinerama" "1"
   EndSection
   Section "Files"
       ModulePath "/opt/amdgpu/lib64/xorg/modules/drivers"
       ModulePath "/opt/amdgpu/lib/xorg/modules"
       ModulePath "/opt/amdgpu-pro/lib/xorg/modules/extensions"
       ModulePath "/opt/amdgpu-pro/lib64/xorg/modules/extensions"
       ModulePath "/usr/lib64/xorg/modules"
       ModulePath "/usr/lib/xorg/modules"
   EndSection
   Section "InputDevice"
       # generated from default
       Identifier     "Mouse0"
       Driver         "mouse"
       Option         "Protocol" "auto"
       Option         "Device" "/dev/psaux"
       Option         "Emulate3Buttons" "no"
       Option         "ZAxisMapping" "4 5"
   EndSection
   Section "InputDevice"
       # generated from default
       Identifier     "Keyboard0"
       Driver         "kbd"
   EndSection
   
   Section "Monitor"
       Identifier     "Virtual"
       VendorName     "Unknown"
       ModelName      "Unknown"
       Option         "Primary" "true"
   EndSection
   
   Section "Monitor"
       Identifier     "Virtual-1"
       VendorName     "Unknown"
       ModelName      "Unknown"
       Option         "RightOf" "Virtual"
   EndSection
   
   Section "Device"
       Identifier     "Device0"
       Driver         "amdgpu"
       VendorName     "AMD"
       BoardName      "Radeon MxGPU V520"
       BusID          "PCI:0:30:0"
   EndSection
   
   Section "Device"
       Identifier     "Device1"
       Driver         "amdgpu"
       VendorName     "AMD"
       BoardName      "Radeon MxGPU V520"
       BusID          "PCI:0:30:0"
   EndSection
   
   Section "Extensions"
       Option         "DPMS" "Disable"
   EndSection
   
   Section "Screen"
       Identifier     "Screen0"
       Device         "Device0"
       Monitor        "Virtual"
       DefaultDepth   24
       Option         "AllowEmptyInitialConfiguration" "True"
       SubSection "Display"
           Virtual    3840 2160
           Depth      32
       EndSubSection
   EndSection
   
   Section "Screen"
       Identifier     "Screen1"
       Device         "Device1"
       Monitor        "Virtual"
       DefaultDepth   24
       Option         "AllowEmptyInitialConfiguration" "True"
       SubSection "Display"
           Virtual    3840 2160
           Depth      32
       EndSubSection
   EndSection
   ```

1. 按照设置[交互式桌面](#amd-interactive-desktop)中的说明设置 DCV。

1. 完成 DCV 设置后，重新启动。

1. 确认驱动程序运行正常：

   ```
   dmesg | grep amdgpu
   ```

   该响应应当与以下内容相似：

   ```
   Initialized amdgpu
   ```

1. 您应会在 `DISPLAY=:0 xrandr -q` 的输出中看到您已连接了 2 个虚拟显示器：

   ```
   ~$ DISPLAY=:0 xrandr -q
   Screen 0: minimum 320 x 200, current 3840 x 1080, maximum 16384 x 16384
   Virtual connected primary 1920x1080+0+0 (normal left inverted right x axis y axis) 0mm x 0mm
    4096x3112  60.00
    3656x2664  59.99
    4096x2160  60.00
    3840x2160  60.00
    1920x1200  59.95
    1920x1080  60.00
    1600x1200  59.95
    1680x1050  60.00
    1400x1050  60.00
    1280x1024  59.95
    1440x900 59.99
    1280x960 59.99
    1280x854 59.95
    1280x800 59.96
    1280x720 59.97
    1152x768 59.95
    1024x768 60.00 59.95
    800x600  60.32 59.96 56.25
    848x480  60.00 59.94
    720x480  59.94
    640x480  59.94 59.94
   Virtual-1 connected 1920x1080+1920+0 (normal left inverted right x axis y axis) 0mm x 0mm
    4096x3112  60.00
    3656x2664  59.99
    4096x2160  60.00
    3840x2160  60.00
    1920x1200  59.95
    1920x1080  60.00
    1600x1200  59.95
    1680x1050  60.00
    1400x1050  60.00
    1280x1024  59.95
    1440x900 59.99
    1280x960 59.99
    1280x854 59.95
    1280x800 59.96
    1280x720 59.97
    1152x768 59.95
    1024x768 60.00 59.95
    800x600  60.32 59.96 56.25
    848x480  60.00 59.94
    720x480  59.94
   640x480  59.94 59.94
   ```

1. 连接到 DCV 后，将分辨率更改为 2x4K，确认 DCV 已经注册了双显示器支持。  
![DCV 分辨率更改。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/dm-dcv-example.png)

## 为 Linux 设置交互式桌面
<a name="amd-interactive-desktop"></a>

确认 Linux 实例已安装 AMD GPU 驱动程序并且 amdgpu 正在使用中之后，您可以安装交互式桌面管理器。我们建议使用 MATE 桌面环境，以获得最佳兼容性和性能。

**先决条件**  
打开文本编辑器并将以下内容另存为名为 `xorg.conf` 的文件。您的实例上需要此文件。

```
Section "ServerLayout"
Identifier     "Layout0"
Screen          0 "Screen0"
InputDevice     "Keyboard0" "CoreKeyboard"
InputDevice     "Mouse0" "CorePointer"
EndSection
Section "Files"
ModulePath "/opt/amdgpu/lib64/xorg/modules/drivers"
ModulePath "/opt/amdgpu/lib/xorg/modules"
ModulePath "/opt/amdgpu-pro/lib/xorg/modules/extensions"
ModulePath "/opt/amdgpu-pro/lib64/xorg/modules/extensions"
ModulePath "/usr/lib64/xorg/modules"
ModulePath "/usr/lib/xorg/modules"
EndSection
Section "InputDevice"
# generated from default
Identifier     "Mouse0"
Driver         "mouse"
Option         "Protocol" "auto"
Option         "Device" "/dev/psaux"
Option         "Emulate3Buttons" "no"
Option         "ZAxisMapping" "4 5"
EndSection
Section "InputDevice"
# generated from default
Identifier     "Keyboard0"
Driver         "kbd"
EndSection
Section "Monitor"
Identifier     "Monitor0"
VendorName     "Unknown"
ModelName      "Unknown"
EndSection
Section "Device"
Identifier     "Device0"
Driver         "amdgpu"
VendorName     "AMD"
BoardName      "Radeon MxGPU V520"
BusID          "PCI:0:30:0"
EndSection
Section "Extensions"
Option         "DPMS" "Disable"
EndSection
Section "Screen"
Identifier     "Screen0"
Device         "Device0"
Monitor        "Monitor0"
DefaultDepth   24
Option         "AllowEmptyInitialConfiguration" "True"
SubSection "Display"
    Virtual    3840 2160
    Depth      32
EndSubSection
EndSection
```

**在 Amazon Linux 2 上设置交互式桌面**

1. 安装 EPEL 存储库。

   ```
   [ec2-user ~]$ sudo amazon-linux-extras install epel -y
   ```

1. 安装 MATE 桌面。

   ```
   [ec2-user ~]$ sudo amazon-linux-extras install mate-desktop1.x -y
   [ec2-user ~]$ sudo yum groupinstall "MATE Desktop" -y
   [ec2-user ~]$ sudo systemctl disable firewalld
   ```

1. 将 `xorg.conf` 文件复制到 `/etc/X11/xorg.conf`。

1. 重启实例。

   ```
   [ec2-user ~]$ sudo reboot
   ```

1. （可选）[安装 Amazon DCV 服务器](https://docs.aws.amazon.com/dcv/latest/adminguide/setting-up-installing.html)以将 Amazon DCV 作为高性能显示协议，然后使用您偏好的客户端[连接到 Amazon DCV 会话](https://docs.aws.amazon.com/dcv/latest/userguide/using-connecting.html)。

**在 Ubuntu 上设置交互式桌面**

1. 安装 MATE 桌面。

   ```
   $ sudo apt install xorg-dev ubuntu-mate-desktop -y
   $ sudo apt purge ifupdown -y
   ```

1. 将 `xorg.conf` 文件复制到 `/etc/X11/xorg.conf`。

1. 重启实例。

   ```
   $ sudo reboot
   ```

1. 为适当版本的 Ubuntu 安装 AMF 编码器。

   ```
   $ sudo apt install ./amdgpu-pro-20.20-*/amf-amdgpu-pro_20.20-*_amd64.deb
   ```

1. （可选）[安装 Amazon DCV 服务器](https://docs.aws.amazon.com/dcv/latest/adminguide/setting-up-installing.html)以将 Amazon DCV 作为高性能显示协议，然后使用您偏好的客户端[连接到 Amazon DCV 会话](https://docs.aws.amazon.com/dcv/latest/userguide/using-connecting.html)。

1. DCV 安装完成后，授予 DCV 用户视频权限：

   ```
   $ sudo usermod -aG video dcv
   ```

**在 CentOS 上设置交互式桌面**

1. 安装 EPEL 存储库。

   ```
   $ sudo yum update -y
   $ sudo yum install epel-release -y
   ```

1. 安装 MATE 桌面。

   ```
   $ sudo yum groupinstall "MATE Desktop" -y
   $ sudo systemctl disable firewalld
   ```

1. 将 `xorg.conf` 文件复制到 `/etc/X11/xorg.conf`。

1. 重启实例。

   ```
   $ sudo reboot
   ```

1. （可选）[安装 Amazon DCV 服务器](https://docs.aws.amazon.com/dcv/latest/adminguide/setting-up-installing.html)以将 Amazon DCV 作为高性能显示协议，然后使用您偏好的客户端[连接到 Amazon DCV 会话](https://docs.aws.amazon.com/dcv/latest/userguide/using-connecting.html)。

   
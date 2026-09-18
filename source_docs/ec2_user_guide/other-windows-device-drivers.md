

# 其他 Windows 设备驱动程序
<a name="other-windows-device-drivers"></a>

AWS VMClock 设备是一种虚拟时钟设备，存在于基于 Nitro 的实例上。该设备在**系统设备**下的设备管理器中显示为 `AWS VMClock Device`。AWS 为 Windows 提供了一个空（无功能）驱动程序包，允许操作系统识别设备。

## 支持的实例
<a name="aws-vmclock-supported-instances"></a>

AWS VMClock 设备适用于基于 Nitro 的实例类型。有关基于 Nitro 的实例类型的列表，请参阅[基于 Nitro 的实例](instance-types.md#instance-hypervisor-type)。

## 支持的操作系统
<a name="aws-vmclock-supported-os"></a>

驱动程序包支持以下版本的 Windows Server：
+ Windows Server 2016
+ Windows Server 2019
+ Windows Server 2022
+ Windows Server 2025

## 驱动程序安装
<a name="aws-vmclock-install"></a>

如果 AWS VMClock 设备在设备管理器中显示警告图标，表示未安装任何驱动程序，则可以手动安装空驱动程序包。

**安装 AWS VMClock 驱动程序**

1. 从 Amazon S3 [下载](https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSVMClock/Latest/AWSVMClock.zip)并解压缩驱动程序包。

   ```
   Invoke-WebRequest https://s3.amazonaws.com/ec2-windows-drivers-downloads/AWSVMClock/Latest/AWSVMClock.zip -OutFile $env:USERPROFILE\AWSVMClock.zip
   Expand-Archive $env:USERPROFILE\AWSVMClock.zip -DestinationPath $env:USERPROFILE\AWSVMClock
   ```

1. 使用 `pnputil` 安装驱动程序。

   ```
   pnputil /add-driver $env:USERPROFILE\AWSVMClock\aws_vmclock.inf /install
   ```

1. 在设备管理器中验证设备状态。您无需重新启动实例。
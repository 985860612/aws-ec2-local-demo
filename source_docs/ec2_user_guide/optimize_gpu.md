

# 优化 Amazon EC2 实例上的 GPU 设置
<a name="optimize_gpu"></a>

您可以执行多个 GPU 设置优化，以实现 NVIDIA GPU 实例的最佳性能。对于其中一些实例类型，NVIDIA 驱动程序使用 autoboost 功能，该功能会改变 GPU 时钟速度。通过禁用 autoboost 并将 GPU 时钟速度设置为其最大频率，您可以始终获得 GPU 实例的最大性能。

## 在 Linux 上优化 GPU 设置
<a name="optimize-gpu-linux"></a>

1. 将 GPU 设置配置为永久。该命令可能需要几分钟才能运行完毕。

   ```
   [ec2-user ~]$ sudo nvidia-persistenced
   ```

1. [仅限 G3 实例] 禁用实例上所有 GPU 的 autoboost 功能。

   ```
   [ec2-user ~]$ sudo nvidia-smi --auto-boost-default=0
   ```

1. 将所有 GPU 时钟速度设置为其最大频率。使用以下命令中指定的内存和图形时钟速度。

   有些版本的 NVIDIA 驱动程序不支持设置应用程序时钟速度，并会显示错误 `"Setting applications clocks is not supported for GPU..."`，您可以忽略该错误。
   + G3 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{2505,1177}}
     ```
   + G4dn 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{5001,1590}}
     ```
   + G5 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{6250,1710}}
     ```
   + G6、Gr6f、Gr6 和 Gr6f 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{6251,2040}}
     ```
   + G6e 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{9001,2520}}
     ```
   + G7e 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{12481,2430}}
     ```
   + G7 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{12501,2415}}
     ```
   + P3 和 P3dn 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{877,1530}}
     ```
   + P4d 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{1215,1410}}
     ```
   + P4de 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{1593,1410}}
     ```
   + P5 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{2619,1980}}
     ```
   + P5e 和 P5en 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{3201,1980}}
     ```
   + P6-B200 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{3996,1965}}
     ```
   + P6-B300 实例：

     ```
     [ec2-user ~]$ sudo nvidia-smi -ac {{3996,2032}}
     ```

## 在 Windows 上优化 GPU 设置
<a name="optimize-gpu-windows"></a>

1. 打开 PowerShell 窗口并导航到 NVIDIA 安装文件夹。

   ```
   PS C:\> cd "C:\Windows\System32\DriverStore\FileRepository\nvgridsw_aws.inf_*\"
   ```

1. [仅限 G3 实例] 禁用实例上所有 GPU 的 autoboost 功能。

   ```
   PS C:\> .\nvidia-smi --auto-boost-default=0
   ```

1. 将所有 GPU 时钟速度设置为其最大频率。使用以下命令中指定的内存和图形时钟速度。

   有些版本的 NVIDIA 驱动程序不支持设置应用程序时钟速度，并会显示错误 `"Setting applications clocks is not supported for GPU..."`，您可以忽略该错误。
   + G3 实例：

     ```
     PS C:\> .\nvidia-smi -ac "{{2505,1177}}"
     ```
   + G4dn 实例：

     ```
     PS C:\> .\nvidia-smi -ac "{{5001,1590}}"
     ```
   + G5 实例：

     ```
     PS C:\> .\nvidia-smi -ac "{{6250,1710}}"
     ```
   + G6、Gr6f、Gr6 和 Gr6f 实例：

     ```
     PS C:\> .\nvidia-smi -ac "{{6251,2040}}"
     ```
   + G6e 实例：

     ```
     PS C:\> .\nvidia-smi -ac "{{9001,2520}}"
     ```
   + P3 和 P3dn 实例：

     ```
     PS C:\> .\nvidia-smi -ac "{{877,1530}}"
     ```
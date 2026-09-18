

# 使用包含 NVIDIA 驱动程序的 AMI
<a name="preinstalled-nvidia-driver"></a>

AWS 和 NVIDIA 随已安装的 NVIDIA 驱动程序提供了不同的亚马逊机器映像（AMI）。
+ [具备 Tesla 公共驱动程序的 Marketplace 产品](https://aws.amazon.com/marketplace/search/results?page=1&filters=VendorId&VendorId=e6a5002c-6dd0-4d1e-8196-0a1d1857229b%2Cc568fe05-e33b-411c-b0ab-047218431da9&searchTerms=tesla+driver)
+ [具备 GRID 驱动程序的 Marketplace 产品](https://aws.amazon.com/marketplace/search/results?&searchTerms=NVIDIA+quadro)
+ [具备 Gaming 驱动程序的 Marketplace 产品](https://aws.amazon.com/marketplace/search/results?searchTerms=NVIDIA+gaming)

要查看取决于操作系统（OS）平台的注意事项，请选择适用于您的 AMI 的选项卡。

------
#### [ Linux ]

要使用这些 AMI 之一更新已安装的驱动程序版本，您必须从实例中卸载 NVIDIA 软件包以避免版本冲突。使用此命令卸载 NVIDIA 软件包：

```
[ec2-user ~]$ sudo yum erase nvidia cuda
```

Amazon 提供的 CUDA 工具包安装包对 NVIDIA 驱动程序有依赖性。卸载 NVIDIA 软件包也会删除 CUDA 工具包。必须在安装 NVIDIA 驱动程序之后重新安装 CUDA 工具包。

------
#### [ Windows ]

如果您使用 AWS Marketplace 产品之一创建自定义 Windows AMI，则 AMI 必须是使用 Windows Sysprep 创建的标准化映像，以确保 GRID 驱动程序正常工作。有关更多信息，请参阅 [使用 Windows Sysprep 创建 Amazon EC2 AMI](ami-create-win-sysprep.md)。

------
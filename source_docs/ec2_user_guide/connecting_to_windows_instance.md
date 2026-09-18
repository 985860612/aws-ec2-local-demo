

# 使用 RDP 连接到 Windows 实例
<a name="connecting_to_windows_instance"></a>

您可以通过远程桌面，连接到从大多数 Windows 亚马逊机器映像（AMI）创建的 Amazon EC2 实例。远程桌面使用远程桌面协议 (RDP)，并且可让您像使用您面前的电脑一样（本地电脑），来连接并使用您的实例。它在大多数的 Windows 版本上可用，并且也适用于 Mac OS。

借助适用于 Windows Server 操作系统的许可证，可以同时进行两个远程连接以进行管理。适用于 Windows Server 的许可证包含在您的 Windows 实例的价格中。如果您需要同时进行两个以上的远程连接，则必须购买远程桌面服务 (RDS) 许可证。如果尝试第三个连接，将产生错误。

**提示**  
如果需要连接到您的实例，以排查基于 [AWS Nitro System](https://aws.amazon.com/ec2/nitro/) 构建的实例的启动、网络配置和其他问题，您可以使用 [适用于实例的 EC2 Serial Console](ec2-serial-console.md)。

**Topics**
+ [使用 RDP 客户端连接到 Windows 实例](connect-rdp.md)
+ [使用 Fleet Manager 连接到 Windows 实例](connect-rdp-fleet-manager.md)
+ [使用 RDP 将文件传输到 Windows 实例](connect-to-linux-instanceWindowsFileTransfer.md)
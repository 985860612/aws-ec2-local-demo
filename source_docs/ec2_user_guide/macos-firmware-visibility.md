

# 查找 Amazon EC2 Mac 专属主机支持的 macOS 版本
<a name="macos-firmware-visibility"></a>

您可以查看 Amazon EC2 Mac 专属主机支持的最新 macOS 版本。您可以使用此功能来验证专属主机是否支持通过首选的 macOS 版本启动实例。

每个 macOS 版本都需要在底层 Apple Mac 上安装最低固件版本才能成功启动。如果分配的 Mac 专属主机长时间处于空闲状态，或者存在长时间运行的实例，则 Apple Mac 固件版本可能会过时。

为确保支持最新 macOS 版本，可在分配的 Mac 专属主机上停止或终止实例。这将触发主机清理工作流程并更新底层 Apple Mac 上的固件，从而支持最新 macOS 版本。停止或终止正在运行的实例时，存在长时间运行实例的专属主机将自动更新。

有关清理工作流程的更多信息，请参阅 [停止或终止 Amazon EC2 Mac 实例](mac-instance-stop.md)。

有关启动 Mac 实例的更多信息，请参阅 [使用 AWS 管理控制台 或 AWS CLI 启动 Mac 实例](mac-instance-launch.md)。

您可以使用 Amazon EC2 控制台或 AWS CLI 来查看有关分配的专属主机支持的最新 macOS 版本的信息。

------
#### [ Console ]

**使用控制台查看专属主机固件信息**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 您可以在**专属主机详细信息**页面上的**支持的最新 macOS 版本**下，查看该主机支持的最新 macOS 版本。

------
#### [ AWS CLI ]

**使用 AWS CLI 查看专属主机固件信息**  
使用 [`describe-mac-hosts`](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-mac-hosts.html) 命令，将 `region` 替换为相应的 AWS 区域。

```
$ aws ec2 describe-mac-hosts --region {{us-east-1}}
  {
      "MacHosts": [
          {
              "HostId": "h-07879acf49EXAMPLE",
              "MacOSLatestSupportedVersions": [
                  "14.3",
                  "13.6.4",
                  "12.7.3"
              ]
          }
      ]
  }
```

------


# 使用 AWS 管理控制台 或 AWS CLI 启动 Mac 实例
<a name="mac-instance-launch"></a>

EC2 Mac 实例需要一个[专属主机](dedicated-hosts-overview.md)。您首先需要为您的账户分配一台主机，然后在该主机上启动实例。

您可以使用 AWS 管理控制台 或 AWS CLI 启动 Mac 实例。

## 使用控制台启动 Mac 实例
<a name="mac-instance-launch-console"></a>

**将 Mac 实例启动到专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 分配专属主机，如下所示：

   1. 在导航窗格中，选择**专属主机**。

   1. 选择**分配专属主机**，然后执行以下操作：

      1. 对于**实例系列**，选择 **Mac** 实例系列。如果相应实例系列未出现在列表中，则表示当前选定的区域不支持该系列。

      1. 对于**实例类型**，根据所选的实例系列选择实例类型。

      1. 对于**可用区**，为专属主机选择可用区。

      1. 对于 **Quantity**（数量），请保留 **1**。

      1. 选择 **Allocate**。

1. 在主机上启动实例，如下所示：

   1. 选择您创建的专属主机，然后执行以下操作：

      1. 依次选择 **Actions**（操作）、**Launch instances onto host**（在主机上启动实例）。

      1. 在**应用程序和操作系统映像（Amazon 系统映像）**下，选择 macOS AMI。

      1. 在**实例类型**下，选择 Mac 实例类型。

      1. 在**高级详细信息**下，验证**租赁**、**租赁主机类型**和**租赁主机 ID** 是否已根据您创建的专属主机进行预配置。根据需要更新 **Tenancy affinity**（租赁关联）。

      1. 完成向导，根据需要指定 EBS 卷、安全组和密钥对。

      1. 在 **Summary**（摘要）面板中，选择 **Launch instance**（启动实例）。

   1. 确认页面会让您知道自己的实例已启动。选择 **View all instances**（查看所有实例）以关闭确认页面并返回控制台。实例的初始状态为 `pending`。当实例的状态更改为 `running` 并通过状态检查时，该实例即可准备就绪。

## 使用启动 Mac 实例 AWS CLI
<a name="mac-instance-launch-cli"></a>

**分配专属主机**

使用以下 [allocate-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/allocate-hosts.html) 命令为 Mac 实例分配专属主机，将 `instance-type` 替换为有效的 mac 实例类型，并将 `region` 和 `availability-zone` 替换为符合您环境的内容。

```
aws ec2 allocate-hosts --region {{us-east-1}} --instance-type {{mac1.metal}} --availability-zone {{us-east-1b}} --auto-placement "on" --quantity 1
```

**在主机上启动实例**

使用以下 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令启动 Mac 实例，再次将 `instance-type` 替换为有效的 mac 实例类型，并将 `region` 和 `availability-zone` 替换为之前使用的内容。

```
aws ec2 run-instances --region {{us-east-1}} --instance-type {{mac1.metal}} --placement Tenancy=host --image-id {{ami_id}} --key-name {{my-key-pair}}
```

实例的初始状态为 `pending`。当实例的状态更改为 `running` 并通过状态检查时，该实例即可准备就绪。使用以下 [describe-instance-status](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-status.html) 命令显示实例的状态信息。

```
aws ec2 describe-instance-status --instance-ids {{i-017f8354e2dc69c4f}}
```

以下是正在运行且已通过状态检查的实例的示例输出。

```
{
    "InstanceStatuses": [
        {
            "AvailabilityZone": "us-east-1b",
            "InstanceId": "i-017f8354e2dc69c4f",
            "InstanceState": {
                "Code": 16,
                "Name": "running"
            },
            "InstanceStatus": {
                "Details": [
                    {
                        "Name": "reachability",
                        "Status": "passed"
                    }
                ],
                "Status": "ok"
            },
            "SystemStatus": {
                "Details": [
                    {
                        "Name": "reachability",
                        "Status": "passed"
                    }
                ],
                "Status": "ok"
            }
        }
    ]
}
```
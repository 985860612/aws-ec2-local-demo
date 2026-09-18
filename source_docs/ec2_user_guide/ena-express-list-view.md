

# 查看 EC2 实例的 ENA Express 设置
<a name="ena-express-list-view"></a>

可以通过实例或网络接口验证 ENA Express 设置。要更新 ENA Express 设置，请参阅[为 EC2 实例配置 ENA Express 设置](ena-express-configure.md)。

------
#### [ Console ]

**查看网络接口的 ENA Express 设置**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Network interfaces**（网络接口）。

1. 选择一个网络接口以查看该实例的详细信息。您可以选择 **Network interface ID**（网络接口 ID）链接以打开详情页面，也可以选择列表左侧的复选框，在页面底部的详情窗格中查看详细信息。

1. 在**详细信息**选项卡或详情页面的**网络接口附件**部分中，查看 **ENA Express** 和 **ENA Express UDP** 的设置。

**查看实例的 ENA Express 设置**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **Instances (实例)**。

1. 选择实例以查看该实例的详细信息。您可以选择 **Instance ID**（实例类型）链接以打开详情页面，也可以选择列表左侧的复选框，在页面底部的详情窗格中查看详细信息。

1. 在 **Networking**（网络）选项卡的 **Network interfaces**（网络接口）部分中，向右滚动查看 **ENA Express** 和 **ENA Express UDP** 的设置。

------
#### [ AWS CLI ]

**获取实例的 ENA Express 设置**  
使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/describe-instances.html) 命令。此命令示例将为 `--instance-ids` 参数所指定每个正在运行的实例连接的网络接口返回 ENA Express 配置列表。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} {{i-0598c7d356eba48d7}} \
    --query 'Reservations[*].Instances[*].[InstanceId, NetworkInterfaces[*].Attachment.EnaSrdSpecification]'
```

下面是示例输出。

```
[
    [
        [
            "i-1234567890abcdef0",
            [
                {
                    "EnaSrdEnabled": true,
                    "EnaSrdUdpSpecification": {
                        "EnaSrdUdpEnabled": false
                    }
                }
            ]
        ]
    ],
    [
        [
            "i-0598c7d356eba48d7",
            [
            {
                    "EnaSrdEnabled": true,
                    "EnaSrdUdpSpecification": {
                        "EnaSrdUdpEnabled": false
                    }
                }
            ]
        ]
    ]
]
```

**获取网络接口的 ENA Express 设置**  
使用 [describe-network-interfaces](https://docs.aws.amazon.com/cli/latest/reference/describe-network-interfaces.html) 命令。

```
aws ec2 describe-network-interfaces \
    --network-interface-ids {{eni-1234567890abcdef0}} \
    --query NetworkInterfaces[].[NetworkInterfaceId,Attachment.EnaSrdSpecification]
```

下面是示例输出。

```
[
    [
        "eni-1234567890abcdef0",
        {
            "EnaSrdEnabled": true,
            "EnaSrdUdpSpecification": {
                "EnaSrdUdpEnabled": false
            }
        }
    ]
]
```

------
#### [ PowerShell ]

**获取网络接口的 ENA Express 设置**  
使用 [Get-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2NetworkInterface.html) cmdlet。

```
Get-EC2NetworkInterface `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} | `
Select-Object `
    Association, 
    NetworkInterfaceId, 
    OwnerId, 
    @{Name = 'AttachTime'; Expression = { $_.Attachment.AttachTime } },
    @{Name = 'AttachmentId'; Expression = { $_.Attachment.AttachmentId } },
    @{Name = 'DeleteOnTermination'; Expression = { $_.Attachment.DeleteOnTermination } },
    @{Name = 'NetworkCardIndex'; Expression = { $_.Attachment.NetworkCardIndex } },
    @{Name = 'InstanceId'; Expression = { $_.Attachment.InstanceId } },
    @{Name = 'InstanceOwnerId'; Expression = { $_.Attachment.InstanceOwnerId } },
    @{Name = 'Status'; Expression = { $_.Attachment.Status } },
    @{Name = 'EnaSrdEnabled'; Expression = { $_.Attachment.EnaSrdSpecification.EnaSrdEnabled } },
    @{Name = 'EnaSrdUdpEnabled'; Expression = { $_.Attachment.EnaSrdSpecification.EnaSrdUdpSpecification.EnaSrdUdpEnabled } }
```

下面是示例输出。

```
Association         : 
NetworkInterfaceId  : eni-0d1234e5f6a78901b
OwnerId             : 111122223333
AttachTime          : 6/11/2022 1:13:11 AM
AttachmentId        : eni-attach-0d1234e5f6a78901b
DeleteOnTermination : True
NetworkCardIndex    : 0
InstanceId          : i-1234567890abcdef0
InstanceOwnerId     : 111122223333
Status              : attached
EnaSrdEnabled       : True
EnaSrdUdpEnabled    : False
```

------
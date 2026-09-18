

# 查看启用了 EC2 Fast Launch 的 AMI
<a name="win-view-fast-launch"></a>

您可以在 AWS CLI 中使用 [describe-fast-launch-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-fast-launch-images.html) 命令，或者 [Get-EC2FastLaunchImage](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2FastLaunchImage.html) Tools for PowerShell Cmdlet，获取启用了 EC2 Fast Launch 的 AMI 的详细信息。

Amazon EC2 会提供结果中返回的每个 Windows AMI 的以下详细信息：
+ 启用了 EC2 Fast Launch 的 AMI 的映像 ID。
+ 用于预调配关联 Windows AMI 的资源类型。支持的值为：`snapshot`。
+ 快照配置，这是用于为使用快照的关联 Windows AMI 配置预调配的一组参数。
+ 启动模板信息，其中包括关联的 AMI 从预调配快照启动 Windows 实例时使用的启动模板的 ID、名称和版本。
+ 可为创建资源而同时启动的实例的最大数量。
+ 关联 AMI 的所有者 ID。对于与您共享的 AMI，不会填充此内容。
+ 关联 AMI 的当前 EC2 Fast Launch 状态。支持的值包括：`enabling | enabling-failed | enabled | enabled-failed | disabling | disabling-failed`。
**注意**  
您还可在 EC2 控制台中的 **Manage image optimization**（管理映像优化）页面上看到，当前的状态为 **Image optimization state**（映像优化状态）。
+ 关联 AMI 的 EC2 Fast Launch 变为当前状态的原因。
+ 关联 AMI 的 EC2 Fast Launch 变为当前状态的时间。

------
#### [ AWS CLI ]

**查找配置了 EC2 Fast Launch 的 AMI**  
使用以下 [describe-fast-launch-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-fast-launch-images.html) 命令，描述账户中配置了 EC2 Fast Launch 的每个 AMI 的详细信息。在此示例中，账户中只有一个 AMI 配置为 EC2 Fast Launch。

```
aws ec2 describe-fast-launch-images
```

下面是示例输出。

```
{
    "FastLaunchImages": [
        {
            "ImageId": "ami-01234567890abcedf",
            "ResourceType": "snapshot",
            "SnapshotConfiguration": {},
            "LaunchTemplate": {
                "LaunchTemplateId": "lt-01234567890abcedf",
                "LaunchTemplateName": "EC2FastLaunchDefaultResourceCreation-a8c6215d-94e6-441b-9272-dbd1f87b07e2",
                "Version": "1"
            },
            "MaxParallelLaunches": 6,
            "OwnerId": "0123456789123",
            "State": "enabled",
            "StateTransitionReason": "Client.UserInitiated",
            "StateTransitionTime": "2022-01-27T22:20:06.552000+00:00"
        }
    ]
}
```

------
#### [ PowerShell ]

**查找配置了 EC2 Fast Launch 的 AMI**  
使用以下 [Get-EC2FastLaunchImage](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2FastLaunchImage.html) cmdlet，描述账户中配置了 EC2 Fast Launch 的每个 AMI 的详细信息。在此示例中，账户中只有一个 AMI 配置为 EC2 Fast Launch。

```
Get-EC2FastLaunchImage -ImageId {{ami-0abcdef1234567890}}
```

下面是示例输出。

```
ImageId               : ami-0abcdef1234567890
LaunchTemplate        : Amazon.EC2.Model.FastLaunchLaunchTemplateSpecificationResponse
MaxParallelLaunches   : 6
OwnerId               : 012345678912
ResourceType          : snapshot
SnapshotConfiguration : 
State                 : enabled
StateTransitionReason : Client.UserInitiated
StateTransitionTime   : 2/25/2022 12:54:43 PM
```

------
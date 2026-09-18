

# 删除 EC2 Instance Connect 端点
<a name="delete-ec2-instance-connect-endpoint"></a>

用完 EC2 Instance Connect 端点后，您可以将其删除。

您必须拥有创建 EC2 Instance Connect Endpoint 所需的 IAM 权限。有关更多信息，请参阅 [创建、描述、修改和删除 EC2 Instance Connect 端点的权限](permissions-for-ec2-instance-connect-endpoint.md#iam-CreateInstanceConnectEndpoint)。

使用控制台删除 EC2 Instance Connect 端点时，该端点首先会进入**正在删除**状态。如果删除成功，已删除的端点不会再出现。如果删除失败，则状态为 **delete-failed**，同时**状态消息**会提供失败原因。

使用 AWS CLI 删除 EC2 Instance Connect 端点时，该端点会进入 `delete-in-progress` 状态。如果删除成功，则会进入 `delete-complete` 状态。如果删除失败，则状态为 `delete-failed`，同时 `StateMessage` 会提供失败原因。

------
#### [ Console ]

**要删除 EC2 Instance Connect Endpoint**

1. 通过 [https://console.aws.amazon.com/vpc/](https://console.aws.amazon.com/vpc/) 打开 Amazon VPC 控制台。

1. 在左侧导航窗格中，选择**端点**。

1. 选择端点。

1. 选择**操作**、**删除 VPC 端点**。

1. 当系统提示进行确认时，输入 **delete**。

1. 选择**删除**。

------
#### [ AWS CLI ]

**要删除 EC2 Instance Connect Endpoint**  
使用 [delete-instance-connect-endpoint](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-instance-connect-endpoint.html) 命令并指定要删除的 EC2 Instance Connect Endpoint 的 ID。

```
aws ec2 delete-instance-connect-endpoint --instance-connect-endpoint-id {{eice-03f5e49b83924bbc7}}
```

下面是示例输出。

```
{
    "InstanceConnectEndpoint": {
        "OwnerId": "{{111111111111}}",
        "InstanceConnectEndpointId": "{{eice-0123456789example}}",
        "InstanceConnectEndpointArn": "arn:aws:ec2:{{us-east-1}}:{{111111111111}}:instance-connect-endpoint/{{eice-0123456789example}}",
        "State": "{{delete-in-progress}}",
        "StateMessage": "",
        "NetworkInterfaceIds": [],
        "VpcId": "{{vpc-0123abcd}}",
        "AvailabilityZone": "{{us-east-1d}}",
        "AvailabilityZoneId": "{{use1-az2}}",
        "CreatedAt": "{{2023-02-07T12:05:37+00:00}}",
        "SubnetId": "{{subnet-0123abcd}}"
    }
}
```

------
#### [ PowerShell ]

**要删除 EC2 Instance Connect Endpoint**  
使用 [Remove-EC2InstanceConnectEndpoint](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-instance-connect-endpoint.html) cmdlet 并指定要删除的 EC2 Instance Connect Endpoint 的 ID。

```
Remove-EC2InstanceConnectEndpoint -InstanceConnectEndpointId {{eice-03f5e49b83924bbc7}}
```

下面是示例输出。

```
@{
    InstanceConnectEndpoint = @{
        OwnerId = "{{111111111111}}"
        InstanceConnectEndpointId = "{{eice-0123456789example}}"
        InstanceConnectEndpointArn = "arn:aws:ec2:{{us-east-1}}:{{111111111111}}:instance-connect-endpoint/{{eice-0123456789example}}"
        State = "{{delete-in-progress}}"
        StateMessage = ""
        NetworkInterfaceIds = @()
        VpcId = "{{vpc-0123abcd}}"
        AvailabilityZone = "{{us-east-1d}}"
        AvailabilityZoneId = "{{use1-az2}}"
        CreatedAt = "2023-02-07T12:05:37+00:00"
        SubnetId = "{{subnet-0123abcd}}"
    }
}
```

------
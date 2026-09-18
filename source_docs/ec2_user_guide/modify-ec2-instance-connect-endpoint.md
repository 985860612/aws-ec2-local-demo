

# 修改 EC2 Instance Connect Endpoint
<a name="modify-ec2-instance-connect-endpoint"></a>

您可以使用控制台、AWS CLI 或 SDK 修改现有 EC2 Instance Connect Endpoint。

在开始之前，您必须具备所需的 IAM 权限。有关更多信息，请参阅 [创建、描述、修改和删除 EC2 Instance Connect 端点的权限](permissions-for-ec2-instance-connect-endpoint.md#iam-CreateInstanceConnectEndpoint)。

## 可修改的参数
<a name="eice-modify-parameters"></a>

可修改以下 EC2 Instance Connect Endpoint 参数：

**安全组**：  
可以为 EC2 Instance Connect Endpoint 指定新的安全组。新的安全组将取代当前的安全组。  
修改安全组时，必须指定：  
+ 至少一个安全组，即使只是 VPC 中的默认安全组。
+ 安全组的 ID，而不是名称。

**IP 地址类型**  
可以为 EC2 Instance Connect Endpoint 指定新的 IP 地址。  
有效值：`ipv4` \|`dualstack` \|`ipv6`

**保留客户端 IP 设置**  
可指定是否保留客户端 IP 地址作为源。  
只有 IPv4 EC2 Instance Connect Endpoint 支持保留客户端 IP。启用 `PreserveClientIp` 后，端点的现有 IP 地址类型必须为 `ipv4`，或者如果修改相同请求中的 IP 地址类型，则新值必须为 `ipv4`。

------
#### [ Console ]

**修改 EC2 Instance Connect Endpoint**

1. 通过 [https://console.aws.amazon.com/vpc/](https://console.aws.amazon.com/vpc/) 打开 Amazon VPC 控制台。

1. 在左侧导航窗格中，选择**端点**。

1. 选择端点。

1. 选择**操作**、**修改端点设置**。

1. 更改端点设置。

1. 选择**保存更改**。

   端点进入**待处理**状态。修改完成后，端点会返回**可用**状态。

------
#### [ AWS CLI ]

**修改 EC2 Instance Connect Endpoint**  
使用 [modify-instance-connect-endpoint](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-connect-endpoint.html) 命令并指定要修改的 EC2 Instance Connect Endpoint 和参数。修改单个请求中的所有参数见以下示例。

```
aws ec2 modify-instance-connect-endpoint \
    --instance-connect-endpoint-id {{eice-0123456789example}} \
    --security-group-ids {{sg-0123456789example}} \
    --ip-address-type {{dualstack}} \
    --no-preserve-client-ip
```

下面是示例输出。

```
{
    "Return": true
}
```

**监视更新状态**  
在修改期间，EC2 Instance Connect Endpoint 状态更改为 `update-in-progress`。更新过程异步运行，完成时状态为 `update-complete` 或 `update-failed`。在状态更改为 `update-complete` 之前，端点将使用其旧配置。

使用 [describe-instance-connect-endpoints](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-connect-endpoints.html) 命令监视更新状态。`--query` 参数会将结果筛选到 `State` 字段。

```
aws ec2 describe-instance-connect-endpoints \
    --instance-connect-endpoint-ids {{eice-0123456789example}} \
    --query InstanceConnectEndpoints[*].State --output text
```

下面是示例输出。

```
update-complete
```

------
#### [ PowerShell ]

**修改 EC2 Instance Connect Endpoint**  
使用 [Edit-EC2InstanceConnectEndpoint](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstanceConnectEndpoint.html) cmdlet 并指定要修改的 EC2 Instance Connect Endpoint 和参数。修改单个请求中的所有参数见以下示例。

```
Edit-EC2InstanceConnectEndpoint `
    -InstanceConnectEndpointId {{eice-0123456789example}} `
    -SecurityGroupIds {{sg-0123456789example}} `
    -IpAddressType {{dualstack}} `
    -PreserveClientIp {{$false}}
```

下面是示例输出。

```
True
```

**监视更新状态**  
在修改期间，EC2 Instance Connect Endpoint 状态更改为 `update-in-progress`。更新过程异步运行，完成时状态为 `update-complete` 或 `update-failed`。在状态更改为 `update-complete` 之前，端点将使用其旧配置。

使用 [Get-EC2InstanceConnectEndpoint](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceConnectEndpoint.html) 命令监视更新状态。`.State.Value` 将结果筛选到 `State` 字段。

```
(Get-EC2InstanceConnectEndpoint -InstanceConnectEndpointId "{{eice-0123456789example}}").State.Value
```

下面是示例输出。

```
update-complete
```

------


# 创建 EC2 Instance Connect Endpoint
<a name="create-ec2-instance-connect-endpoints"></a>

您可以创建 EC2 Instance Connect 端点来确保安全连接到实例。

**注意事项**
+ **共享子网**：您可以在与您共享的子网中创建 EC2 Instance Connect 端点。但您无法使用 VPC 所有者在与您共享的子网中创建的 EC2 Instance Connect 端点。
+ **IP 地址类型**：EC2 Instance Connect 端点支持以下地址类型，这些地址类型必须与您的子网兼容：
  + `ipv4`：仅连接到具有私有 IPv4 地址的 EC2 实例。
  + `dualstack`：连接到具有私有 IPv4 地址或 IPv6 地址的 EC2 实例。
  + `ipv6`：仅连接到具有 IPv6 地址的 EC2 实例。

**先决条件**  
您必须拥有创建 EC2 Instance Connect Endpoint 所需的 IAM 权限。有关更多信息，请参阅 [创建、描述、修改和删除 EC2 Instance Connect 端点的权限](permissions-for-ec2-instance-connect-endpoint.md#iam-CreateInstanceConnectEndpoint)。

------
#### [ Console ]

**要创建 EC2 Instance Connect Endpoint**

1. 通过 [https://console.aws.amazon.com/vpc/](https://console.aws.amazon.com/vpc/) 打开 Amazon VPC 控制台。

1. 在左侧导航窗格中，选择**端点**。

1. 选择**创建端点**，然后按如下所示指定端点设置：

   1. （可选）对于**名称标签**，输入端点的名称。

   1. 对于**类型**，选择 **EC2 Instance Connect Endpoint**。

   1. 在**网络设置**下，对于 **VPC**，选择具有目标实例的 VPC。

   1. （可选）要保留客户端 IP 地址，请展开**其他设置**，然后选中**保留客户端 IP** 复选框。否则会默认将端点网络接口用作客户端 IP 地址。
**注意**  
仅当端点的 IP 地址类型配置为 IPv4 时，此选项才可用。

   1. （可选）对于**安全组**，请选择要与端点关联的安全组。否则会默认使用 VPC 的默认安全组。有关更多信息，请参阅 [EC2 Instance Connect Endpoint 安全组](eice-security-groups.md)。

   1. 对于**子网**，选择要在其中创建端点的子网。

   1. 对于 **IP 地址类型**，选择端点的 IP 地址类型。如果需要同时支持实例的 IPv4 和 IPv6 连接，则请选择**双堆栈**。如果需要支持客户端 IP 保留，则请选择 **IPv4**。

   1. （可选）若要添加标签，请选择**添加新标签**，然后输入该标签的键和值。

1. 检查您的设置，然后选择**创建端点**。

   端点的初始状态为**待处理**。您必须等待端点状态变为**可用**后，才能使用此端点连接到实例。这可能需要几分钟的时间。

1. 要使用端点连接到实例，请参阅 [连接到实例](connect-using-eice.md)。

------
#### [ AWS CLI ]

**要创建 EC2 Instance Connect Endpoint**  
使用 [create-instance-connect-endpoint](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-instance-connect-endpoint.html) 命令。

```
aws ec2 create-instance-connect-endpoint \
    --subnet-id {{subnet-0123456789example}}
```

要指定端点支持的流量类型，请包含 `--ip-address-type` 参数。有效值为 `ipv4`、`dualstack` 或 `ipv6`。子网必须支持您指定的 IP 地址类型。省略 `--ip-address-type` 参数时，默认值由子网支持的 IP 地址类型决定。

```
aws ec2 create-instance-connect-endpoint \
    --subnet-id {{subnet-0123456789example}} \
    --ip-address-type {{ipv4}}
```

下面是示例输出。

```
{
        "OwnerId": "{{111111111111}}",
        "InstanceConnectEndpointId": "{{eice-0123456789example}}",
        "InstanceConnectEndpointArn": "arn:aws:ec2:{{us-east-1}}:{{111111111111}}:instance-connect-endpoint/{{eice-0123456789example}}",
        "State": "create-complete",
        "StateMessage": "",
        "DnsName": "{{eice-0123456789example}}.{{0123abcd}}.ec2-instance-connect-endpoint.{{us-east-1}}.amazonaws.com",
        "FipsDnsName": "{{eice-0123456789example}}.{{0123abcd}}.fips.ec2-instance-connect-endpoint.{{us-east-1}}.amazonaws.com",
        "NetworkInterfaceIds": [
            "{{eni-0123abcd}}"
        ],
        "VpcId": "{{vpc-0123abcd}}",
        "AvailabilityZone": "{{us-east-1a}}",
        "AvailabilityZoneId": "{{use1-az4}}",
        "CreatedAt": "{{2023-04-07T15:43:53.000Z}}",
        "SubnetId": "{{subnet-0123abcd}}",
        "PreserveClientIp": false,
        "SecurityGroupIds": [
            "{{sg-0123abcd}}"
        ],
        "Tags": [],
        "IpAddressType": "{{ipv4}}"
}
```

**监控创建状态**  
`State` 字段的初始值为 `create-in-progress`。在使用此端点连接到实例之前，请等待状态变为 `create-complete`。使用 [describe-instance-connect-endpoints](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-connect-endpoints.html) 命令监控 EC2 Instance Connect 端点的状态。`--query` 参数会将结果筛选到 `State` 字段。

```
aws ec2 describe-instance-connect-endpoints --instance-connect-endpoint-ids {{eice-0123456789example}} --query InstanceConnectEndpoints[*].State --output text
```

下面是示例输出。

```
create-complete
```

------
#### [ PowerShell ]

**创建 EC2 Instance Connect Endpoint**  
使用 [New-EC2InstanceConnectEndpoint](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2InstanceConnectEndpoint.html) cmdlet。

```
New-EC2InstanceConnectEndpoint -SubnetId {{subnet-0123456789example}}
```

要指定端点支持的流量类型，请包含 `-IpAddressType` 参数。有效值为 `ipv4`、`dualstack` 或 `ipv6`。子网必须支持您指定的 IP 地址类型。省略 `-IpAddressType` 参数时，默认值由子网支持的 IP 地址类型决定。

```
New-EC2InstanceConnectEndpoint -SubnetId {{subnet-0123456789example}} -IpAddressType {{ipv4}}
```

下面是示例输出。

```
OwnerId                     : {{111111111111}}
InstanceConnectEndpointId   : {{eice-0123456789example}}
InstanceConnectEndpointArn  : arn:aws:ec2:{{us-east-1}}:{{111111111111}}:instance-connect-endpoint/{{eice-0123456789example}}
State                       : create-complete
StateMessage                : 
DnsName                     : {{eice-0123456789example}}.{{0123abcd}}.ec2-instance-connect-endpoint.{{us-east-1}}.amazonaws.com
FipsDnsName                 : {{eice-0123456789example}}.{{0123abcd}}.fips.ec2-instance-connect-endpoint.{{us-east-1}}.amazonaws.com
NetworkInterfaceIds         : {{{eni-0123abcd}}}
VpcId                       : {{vpc-0123abcd}}
AvailabilityZone            : {{us-east-1a}}
AvailabilityZoneId          : {{use1-az4}}
CreatedAt                   : 4/7/2023 3:43:53 PM
SubnetId                    : {{subnet-0123abcd}}
PreserveClientIp            : False
SecurityGroupIds            : {{{sg-0123abcd}}}
Tags                        : {}
IpAddressType               : {{ipv4}}
```

**监控创建状态**  
`State` 字段的初始值为 `create-in-progress`。在使用此端点连接到实例之前，请等待状态变为 `create-complete`。使用 [Get-EC2InstanceConnectEndpoint](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceConnectEndpoint.html) cmdlet 监控 EC2 Instance Connect Endpoint 的状态。`.State.Value` 将结果筛选到 `State` 字段。

```
(Get-EC2InstanceConnectEndpoint -InstanceConnectEndpointId "{{eice-0123456789example}}").State.Value
```

下面是示例输出。

```
create-complete
```

------
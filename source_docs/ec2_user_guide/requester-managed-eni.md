

# 请求者托管的网络接口
<a name="requester-managed-eni"></a>

请求者托管式网络接口是 AWS 服务 代表您在 VPC 中创建的网络接口。网络接口与其他服务的资源相关联，例如 Amazon RDS 的数据库实例、NAT 网关或 AWS PrivateLink 的接口 VPC 端点。

**注意事项**
+ 您可以在账户中查看请求者托管式网络接口，并可以添加或删除标签。但是，您无法对请求者管理的网络接口执行以下操作：
  + 修改网络接口属性
  + 附加或分离网络接口
  + 关联或撤销关联弹性 IP 地址
  + 分配或取消分配私有 IP 地址
  + 在启动实例时指定网络接口

  虽然无法修改网络接口属性，但您仍然可以进行重置
+ 如果您删除与请求者托管式网络接口关联的资源，AWS 服务 会断开网络接口并将其删除。如果服务断开了网络接口但没有将其删除，您可以删除断开的网络接口。

------
#### [ Console ]

**查看请求者托管式网络接口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，依次选择 **Network & Security**（网络与安全）、**Network Interfaces**（网络接口）。

1. 选择网络接口的 ID 以打开其详细信息页面。

1. 以下是可用于确定网络接口用途的关键字段：
   + **Description**（描述）：由创建接口的 AWS 服务提供的描述。例如，“VPC Endpoint Interface vpce 089f2123488812123（VPC 端点接口 vpce 089f2123488812123）”。
   + **Requester-managed**（请求者托管式）：指明网络接口是否由 AWS 托管。
   + **Requester ID**（请求者 ID）：创建网络接口的主体或服务的别名或 AWS 账户 ID。如果您创建了网络接口，这便是您的 AWS 账户 ID。如果没有，则由其他主体或服务创建。

------
#### [ AWS CLI ]

**查看请求者托管式网络接口**  
按如下方式使用 [describe-network-interfaces](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-network-interfaces.html) 命令。

```
aws ec2 describe-network-interfaces \
    --filters "Name=requester-managed,Values=true" \
    --query "NetworkInterfaces[*].[Description, InterfaceType]" \ 
    --output table
```

以下示例输出显示了可用于确定网络接口用途的关键字段 `Description` 和 `InterfaceType`。

```
-------------------------------------------------------------------------------
|                          DescribeNetworkInterfaces                          |
+---------------------------------------------------+-------------------------+
|  VPC Endpoint Interface: vpce-0f00567fa8477a1e6   |  interface              |
|  VPC Endpoint Interface vpce-0d8ddce4be80e4474    |  interface              |
|  VPC Endpoint Interface vpce-078221a1e27d1ea5b    |  vpc_endpoint           |
|  Resource Gateway Interface rgw-0bba03f3d56060135 |  interface              |
|  VPC Endpoint Interface: vpce-0cc199f605eaeace7   |  interface              |
|  VPC Endpoint Interface vpce-019b90d6f16d4f958    |  interface              |
+---------------------------------------------------+-------------------------+
```

------
#### [ PowerShell ]

**查看请求者托管式网络接口**  
按如下所示使用 [Get-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2NetworkInterface.html) cmdlet。

```
Get-EC2NetworkInterface -Filter @{Name="requester-managed"; Values="true"} | Select Description, InterfaceType
```

以下示例输出显示了可用于确定网络接口用途的关键字段 `Description` 和 `InterfaceType`。

```
Description                                      InterfaceType
-----------                                      -------------
VPC Endpoint Interface: vpce-0f00567fa8477a1e6   interface
VPC Endpoint Interface vpce-0d8ddce4be80e4474    interface
VPC Endpoint Interface vpce-078221a1e27d1ea5b    vpc_endpoint
Resource Gateway Interface rgw-0bba03f3d56060135 interface
VPC Endpoint Interface: vpce-0cc199f605eaeace7   interface
VPC Endpoint Interface vpce-019b90d6f16d4f958    interface
```

------
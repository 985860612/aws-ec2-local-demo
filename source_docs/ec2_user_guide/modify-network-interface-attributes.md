

# 修改网络接口属性
<a name="modify-network-interface-attributes"></a>

您可以更改以下网络接口属性：
+ 描述
+ 安全组
+ 终止时删除
+ 源/目标检查
+ 空闲连接跟踪超时

**注意事项**  
不能更改请求者托管式网络接口的属性。

------
#### [ Console ]

**修改网络接口属性**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Network Interfaces**。

1. 选中该网络接口的复选框。

1. 要更改描述，请执行以下操作：

   1. 依次选择**操作**、**更改描述**。

   1. 对于**说明**，输入说明。

   1. 选择**保存**。

1. 要更改安全组，请执行以下操作：

   1. 依次选择**操作**、**更改安全组**。

   1. 对于**关联安全组**，根据需要添加和移除安全组。安全组和网络接口必须针对相同 VPC 创建。

   1. 选择**保存**。

1. 要更改终止行为，请执行以下操作：

   1. 依次选择**操作**、**更改终止行为**。

   1. 选择或清除**终止时删除**、**启用**。

   1. 选择**保存**。

1. 要更改源/目标检查，请执行以下操作：

   1. 依次选择**操作**、**更改源/目标检查**。

   1. 选择或清除**源/目标**、**启用**。

   1. 选择**保存**。

1. 要更改空闲连接跟踪超时，请执行以下操作：

   1. 选择**操作**、**修改空闲连接跟踪超时**。

   1. 根据需要修改超时值。有关更多信息，请参阅 [空闲连接跟踪超时](security-group-connection-tracking.md#connection-tracking-timeouts)。
      + **TCP 建立超时**：处于已建立状态的空闲 TCP 连接的超时时间（以秒为单位）。
        + 最小值：`60` 秒
        + 最大值：`432000` 秒
        + 默认值：[Nitro v6](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-nitro-instances.html) 实例类型（不包括 p6e-GB200）为 `350` 秒；所有其他实例类型（包括 p6e-GB200）为 `432000` 秒。
        + 建议值：小于 `432000` 秒
      + **UDP 超时**：空闲 UDP 流的超时时间（以秒为单位），这些流仅在单个方向或单个请求-响应事务上看到流量。
        + 最小值：`30` 秒
        + 最大值：`60` 秒
        + 原定设置：`30` 秒
      + **UDP 流超时**：空闲 UDP 流的超时（以秒为单位），这些流被归类为已看到多个请求-响应事务的流。
        + 最小值：`60` 秒
        + 最大值：`180` 秒
        + 原定设置：`180` 秒

   1. 选择**保存**。

------
#### [ AWS CLI ]

**Example 示例：修改描述**  
使用以下 [modify-network-interface-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-network-interface-attribute.html) 命令。  

```
aws ec2 modify-network-interface-attribute \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --description "{{my updated description}}"
```

**Example 示例：修改安全组**  
使用以下 [modify-network-interface-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-network-interface-attribute.html) 命令。  

```
aws ec2 modify-network-interface-attribute \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --groups {{sg-1234567890abcdef0}}
```

**Example 示例：修改终止行为**  
使用以下 [modify-network-interface-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-network-interface-attribute.html) 命令。  

```
aws ec2 modify-network-interface-attribute \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --attachment AttachmentId={{eni-attach-43348162abEXAMPLE}},DeleteOnTermination={{false}}
```

**Example 示例：启用源/目标检查**  
使用以下 [modify-network-interface-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-network-interface-attribute.html) 命令。  

```
aws ec2 modify-network-interface-attribute \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --source-dest-check
```

**Example 示例：修改空闲连接跟踪超时**  
使用以下 [modify-network-interface-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-network-interface-attribute.html) 命令。有关更多信息，请参阅 [空闲连接跟踪超时](security-group-connection-tracking.md#connection-tracking-timeouts)。  

```
aws ec2 modify-network-interface-attribute \
    --network-interface-id {{eni-1234567890abcdef0}} \
    --connection-tracking-specification TcpEstablishedTimeout={{172800}},UdpStreamTimeout={{90}},UdpTimeout={{60}}
```

------
#### [ PowerShell ]

**Example 示例：修改描述**  
使用 [Edit-EC2NetworkInterfaceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2NetworkInterfaceAttribute.html) cmdlet。  

```
Edit-EC2NetworkInterfaceAttribute `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -Description "{{my updated description}}"
```

**Example 示例：修改安全组**  
使用 [Edit-EC2NetworkInterfaceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2NetworkInterfaceAttribute.html) cmdlet。  

```
Edit-EC2NetworkInterfaceAttribute `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -Group {{sg-1234567890abcdef0}}
```

**Example 示例：修改终止行为**  
使用 [Edit-EC2NetworkInterfaceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2NetworkInterfaceAttribute.html) cmdlet。  

```
Edit-EC2NetworkInterfaceAttribute `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -Attachment_AttachmentId {{eni-attach-43348162abEXAMPLE}} `
    -Attachment_DeleteOnTermination {{$false}}
```

**Example 示例：启用源/目标检查**  
使用 [Edit-EC2NetworkInterfaceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2NetworkInterfaceAttribute.html) cmdlet。  

```
Edit-EC2NetworkInterfaceAttribute `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -SourceDestCheck {{$true}}
```

**Example 示例：修改空闲连接跟踪超时**  
使用 [Edit-EC2NetworkInterfaceAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2NetworkInterfaceAttribute.html) cmdlet。有关更多信息，请参阅 [空闲连接跟踪超时](security-group-connection-tracking.md#connection-tracking-timeouts)。  

```
Edit-EC2NetworkInterfaceAttribute `
    -NetworkInterfaceId {{eni-1234567890abcdef0}} `
    -ConnectionTrackingSpecification_TcpEstablishedTimeout {{172800}} `
    -ConnectionTrackingSpecification_UdpStreamTimeout {{90}} `
    -ConnectionTrackingSpecification_UdpTimeout {{60}}
```

------
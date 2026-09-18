

# 为 Amazon EC2 实例创建安全组
<a name="creating-security-group"></a>

安全组用作相关实例的防火墙，可在实例级别控制入站和出站的数据流。您可以向安全组添加规则，以便能够使用 SSH（Linux 实例）或 RDP（Windows 实例）连接到实例。您还可以添加允许客户端流量的规则，例如发往 Web 服务器的 HTTP 和 HTTPS 流量。

在启动某个实例时，您可以将安全组与该实例关联。在关联的安全组中添加或删除规则时，这些更改将自动应用于与安全组关联的所有实例。

启动实例后，即可关联其他安全组。有关更多信息，请参阅 [更改 Amazon EC2 实例的安全组](changing-security-group.md)。

您可以在创建安全组时添加入站和出站安全组规则，也可以稍后添加规则。有关更多信息，请参阅 [配置安全组规则](changing-security-group.md#add-remove-security-group-rules)。有关可以添加到安全组的规则示例，请参阅[针对不同使用案例的安全组规则](security-group-rules-reference.md)。

**注意事项**
+ 新安全组起初只有一条出站规则，即允许所有通信离开资源。您必须添加规则，以便允许任何入站数据流或限制出站数据流。
+ 在为允许 SSH 或 RDP 访问实例的规则配置来源时，切勿允许从任何地方进行访问，因为这将允许从互联网上的所有 IP 地址访问实例。这在测试环境中可以接受一小段时间，但是在生产环境中并不安全。
+ 如果特定端口具有多个规则，Amazon EC2 将应用最宽松的规则。例如，如果有一条规则允许从 IP 地址 203.0.113.1 访问 TCP 端口 22（SSH），而另一条规则允许从任何地方访问 TCP 端口 22，则所有人都可以访问 TCP 端口 22。
+ 您可以将多个安全组与一个实例关联。因此，一个实例可以有数百条适用的规则。访问该实例时，这可能会导致问题。因此，我们建议您尽可能使规则简洁。
+ 当您指定一个安全组作为规则的源或目标时，规则会影响与该安全组关联的所有实例。允许的传入流量基于与源安全组相关联的实例的私有 IP 地址 (而不是公有 IP 或弹性 IP 地址)。有关 IP 地址的更多信息，请参阅 [Amazon EC2 实例 IP 寻址](using-instance-addressing.md)。
+ 默认情况下，Amazon EC2 会阻止端口 25 上的流量。有关更多信息，请参阅 [对使用端口 25 发送的电子邮件的限制](ec2-resource-limits.md#port-25-throttle)。

------
#### [ Console ]

**创建安全组**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Security Groups (安全组)**。

1. 选择 **Create security group**（创建安全组）。

1. 输入安全组的描述性名称和简要说明。在创建安全组后，您无法更改其名称和描述。

1. 对于 **VPC**，请选择将在其中运行 Amazon EC2 实例的 VPC。

1. （可选）要添加入站规则，请选择**入站规则**。对于每条规则，请选择**添加规则**并指定协议、端口和来源。例如，要允许 SSH 流量，请在**类型**中选择 **SSH**，并为**来源**指定计算机或网络的公有 IPv4 地址。

1. （可选）要添加出站规则，请选择**出站规则**。对于每条规则，请选择**添加规则**并指定协议、端口和目标。若不这样做，您可以保留允许所有出站流量的默认规则。

1. （可选）若要添加标签，请选择 **Add new tag**（添加新标签），然后输入该标签的键和值。

1. 选择**创建安全组**。

------
#### [ AWS CLI ]

**创建安全组**  
使用以下 [create-security-group](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-security-group.html) 命令。

```
aws ec2 create-security-group \
    --group-name {{my-security-group}} \
    --description "{{my security group}}" \
    --vpc-id {{vpc-1234567890abcdef0}}
```

有关添加规则的示例，请参阅[配置安全组规则](changing-security-group.md#add-remove-security-group-rules)。

------
#### [ PowerShell ]

**创建安全组**  
使用 [New-EC2SecurityGroup](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2SecurityGroup.html) cmdlet。

```
New-EC2SecurityGroup `
    -GroupName {{my-security-group}} `
    -Description "{{my security group}}" `
    -VpcId {{vpc-1234567890abcdef0}}
```

有关添加规则的示例，请参阅[配置安全组规则](changing-security-group.md#add-remove-security-group-rules)。

------
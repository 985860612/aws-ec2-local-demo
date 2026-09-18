

# 测试是否启用了增强联网功能
<a name="test-enhanced-networking-ena"></a>

您可以测试实例或 AMI 中是否启用了增强联网。

**实例属性**  
检查 `enaSupport` 实例属性的值。

------
#### [ AWS CLI ]

使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --query "Reservations[].Instances[].EnaSupport"
```

如果启用了增强联网功能，则输出会如下所示。

```
[
    true
]
```

------
#### [ PowerShell ]

使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance -InstanceId {{i-1234567890abcdef0}}).Instances.EnaSupport
```

如果启用了增强联网功能，则输出会如下所示。

```
True
```

------

**映像属性**  
检查 `enaSupport` 映像属性的值。

------
#### [ AWS CLI ]

使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --image-id {{ami-0abcdef1234567890}} \
    --query "Images[].EnaSupport"
```

如果启用了增强联网功能，则输出会如下所示。

```
[
    true
]
```

------
#### [ PowerShell ]

使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
(Get-EC2Image -ImageId {{ami-0abcdef1234567890}}).EnaSupport
```

如果启用了增强联网功能，则输出会如下所示。

```
True
```

------

**Linux 网络接口驱动程序**  
使用以下命令验证是否在特定接口上使用了 `ena` 内核驱动程序（替代要检查的接口名称）。如果您使用单个接口（默认设置），则为 `eth0`。如果您的 Linux 发行版支持可预测的网络名称，则这可以是类似于 `ens5` 的名称。有关更多信息，请展开[在实例上启用增强联网](enabling_enhanced_networking.md)中的 RHEL、SUSE 和 CentOS 部分。

在以下示例中，`ena` 内核驱动程序未加载，因为列出的驱动程序是 `vif`。

```
[ec2-user ~]$ ethtool -i {{eth0}}
driver: vif
version:
firmware-version:
bus-info: vif-0
supports-statistics: yes
supports-test: no
supports-eeprom-access: no
supports-register-dump: no
supports-priv-flags: no
```

在本示例中，`ena` 内核驱动程序已加载并具有推荐的最低版本。此实例正确配置了增强联网。

```
[ec2-user ~]$ ethtool -i {{eth0}}
driver: ena
version: 1.5.0g
firmware-version:
expansion-rom-version:
bus-info: 0000:00:05.0
supports-statistics: yes
supports-test: no
supports-eeprom-access: no
supports-register-dump: no
supports-priv-flags: no
```
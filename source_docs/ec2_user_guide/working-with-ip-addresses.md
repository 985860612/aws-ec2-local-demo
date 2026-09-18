

# 管理 EC2 实例的 IPv4 地址
<a name="working-with-ip-addresses"></a>

您可以在启动实例时为其分配公有 IPv4 地址。您可以在控制台中通过 **Instances**（实例）或 **Network Interfaces**（网络接口）页面查看实例的 IPv4 地址。

**Topics**
+ [在启动时分配公有 IPv4 地址](#public-ip-addresses)
+ [在启动时分配私有 IPv4 地址](#assign-private-ipv4-address)
+ [查看主 IPv4 地址](#view-instance-ipv4-addresses)
+ [使用实例元数据查看 IPv4 地址](#view-instance-ipv4-addresses-imds)

## 在启动时分配公有 IPv4 地址
<a name="public-ip-addresses"></a>

所有子网都有一个属性可确定在子网中启动的实例是否分配了公有 IP 地址。默认情况下，非默认子网的此属性设置为 false，默认子网的此属性设置为 true。启动实例时，您也可以通过公有 IPv4 寻址功能来控制是否为实例分配公有 IPv4 地址；您可以覆盖子网 IP 寻址属性的默认行为。公有 IPv4 地址从 Amazon 的公有 IPv4 地址池进行分配，并分配给设备索引为 0 的网络接口。此功能取决于启动实例时的特定条件。

**注意事项**
+ 启动后，您可以通过[管理与网络接口关联的 IP 地址](managing-network-interface-ip-addresses.md)来将实例的公有 IP 地址取消分配。有关公有 IPv4 地址的更多信息，请参阅[公有 IPv4 地址](using-instance-addressing.md#concepts-public-addresses)。
+ 如果指定多个网络接口，则不能自动分配公有 IP 地址。此外，如果指定设备索引为 0 的某个现有网络接口，则无法使用自动分配公有 IP 功能来覆盖子网设置。
+ 无论您是否在启动时为实例分配了公有 IP 地址，您都可以在启动后将弹性 IP 地址与实例相关联。有关更多信息，请参阅 [弹性 IP 地址](elastic-ip-addresses-eip.md)。您还可以修改子网的公有 IPv4 寻址行为。有关更多信息，请参阅[修改子网的公有 IPv4 寻址属性](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-public-ip.html)。

------
#### [ Console ]

**在启动时分配公有 IPv4 地址**  
请按照步骤[启动实例](ec2-launch-instance-wizard.md)，并在配置[网络设置](ec2-instance-launch-parameters.md#liw-network-settings)时选择 **Auto-assign Public IP**（自动分配公有 IP）。

------
#### [ AWS CLI ]

**在启动时分配公有 IPv4 地址**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--associate-public-ip-address` 选项。

```
--associate-public-ip-address
```

------
#### [ PowerShell ]

**在启动时分配公有 IPv4 地址**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-AssociatePublicIp` 参数结合使用。

```
-AssociatePublicIp $true
```

------

## 在启动时分配私有 IPv4 地址
<a name="assign-private-ipv4-address"></a>

您可以在子网 IPv4 地址范围中指定一个私有 IPv4 地址，也可以让 Amazon EC2 为您选择一个。该地址会分配给主网络接口。

要在启动后分配 IPv4 地址，请参阅[为实例分配辅助 IP 地址](instance-secondary-ip-addresses.md#assign-secondary-ip-address)。

------
#### [ Console ]

**在启动时分配私有 IPv4 地址**  
按照程序[启动实例](ec2-launch-instance-wizard.md)。配置[网络设置](ec2-instance-launch-parameters.md#liw-network-settings)时，展开**高级网络配置**，然后输入**主 IP** 的值。

------
#### [ AWS CLI ]

**在启动时分配私有 IPv4 地址**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--private-ip-address` 选项。

```
--private-ip-addresses {{10.251.50.12}}
```

要让 Amazon EC2 选择 IP 地址，请省略此选项。

------
#### [ PowerShell ]

**在启动时分配私有 IPv4 地址**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-PrivateIpAddress` 参数结合使用。

```
-PrivateIpAddress {{10.251.50.12}}
```

要让 Amazon EC2 选择 IP 地址，请省略此参数。

------

## 查看主 IPv4 地址
<a name="view-instance-ipv4-addresses"></a>

公有 IPv4 地址在控制台中显示为网络接口的属性，但它通过 NAT 映射到主要私有 IPv4 地址。因此，如果您检查实例网络接口的属性 (例如，通过 `ifconfig` [Linux] 或 `ipconfig` [Windows])，则不会显示公有 IPv4 地址。

------
#### [ Console ]

**查看实例的 IPv4 地址**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 在**联网**选项卡上，找到**公有 IPv4 地址**和**私有 IPv4 地址**。

1. （可选）**联网**选项卡中还包含实例的网络接口和弹性 IP 地址。

------
#### [ AWS CLI ]

**查看实例的主 IPv4 地址**  
可以使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --query "Reservations[].Instances[].PrivateIpAddress" \
    --output text
```

下面是示例输出。

```
10.251.50.12
```

------
#### [ PowerShell ]

**查看实例的主 IPv4 地址**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}}).Instances.PrivateIpAddress
```

下面是示例输出。

```
10.251.50.12
```

------

## 使用实例元数据查看 IPv4 地址
<a name="view-instance-ipv4-addresses-imds"></a>

可以通过检索实例元数据来获取实例的 IPv4 地址。有关更多信息，请参阅 [使用实例元数据管理 EC2 实例](ec2-instance-metadata.md)。

**使用实例元数据查看 IPv4 地址**

1. 连接到您的实例。有关更多信息，请参阅 [连接到您的 EC2 实例](connect.md)。

1. 运行以下命令之一。

------
#### [ IMDSv2 ]

**Linux**  
在 Linux 实例上运行以下命令。

   ```
   TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
   && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/local-ipv4
   ```

**Windows**  
在 Windows 实例上运行以下命令。

   ```
   [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} `
       -Method PUT -Uri http://169.254.169.254/latest/api/token
   ```

   ```
   Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} `
       -Method GET -Uri http://169.254.169.254/latest/meta-data/local-ipv4
   ```

------
#### [ IMDSv1 ]

**Linux**  
在 Linux 实例上运行以下命令。

   ```
   curl http://169.254.169.254/latest/meta-data/local-ipv4
   ```

**Windows**  
在 Windows 实例上运行以下命令。

   ```
   Invoke-RestMethod http://169.254.169.254/latest/meta-data/local-ipv4
   ```

------

1. 使用以下命令之一访问公有 IP 地址。如果实例关联了弹性 IP 地址，则命令会返回该弹性 IP 地址。

------
#### [ IMDSv2 ]

**Linux**  
在 Linux 实例上运行以下命令。

   ```
   [ec2-user ~]$ TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
   && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4
   ```

**Windows**  
在 Windows 实例上运行以下命令。

   ```
   [string]$token = Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token-ttl-seconds" = "21600"} `
       -Method PUT -Uri http://169.254.169.254/latest/api/token
   ```

   ```
   Invoke-RestMethod -Headers @{"X-aws-ec2-metadata-token" = $token} `
       -Method GET -Uri http://169.254.169.254/latest/meta-data/public-ipv4
   ```

------
#### [ IMDSv1 ]

**Linux**  
在 Linux 实例上运行以下命令。

   ```
   curl http://169.254.169.254/latest/meta-data/public-ipv4
   ```

**Windows**  
在 Windows 实例上运行以下命令。

   ```
   Invoke-RestMethod http://169.254.169.254/latest/meta-data/public-ipv4
   ```

------
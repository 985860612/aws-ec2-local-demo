

# 创建 EC2 实例的清单
<a name="ec2-data-inventory"></a>

Amazon EC2 提供按需、可扩展的计算容量。EC2 实例是 AWS 网络中运行的虚拟服务器。

下表描述 EC2 实例的主要特征。系统管理员可以使用本指南中提供的指导来获取有关这些特征的信息，并使用它来配置在本地或另一个云提供商网络中运行的功能等效服务器。


| 特征 | 说明 | 
| --- | --- | 
| [地理位置](#ec2-data-geographic-location) | Amazon EC2 托管在全球所有 AWS 区域。您可以为实例选择靠近客户的位置。您可以在多个位置中启动实例。 | 
| [硬件规格](#ec2-data-specifications) | Amazon EC2 提供针对不同使用案例优化的各种不同的实例类型。您为实例选择的实例类型决定了其计算、内存、网络和存储资源。 | 
| [图片](#ec2-data-images) | 亚马逊机器映像（AMI）包含启动时要在实例上安装的软件。这包括操作系统、软件包和自定义配置。 | 
| [IP 地址和 DNS 主机名](#ec2-data-ip-dns) | 实例接收私有 IP 地址和私有 DNS 主机名。如果您为实例配置了公有 IP 地址，它还会收到公有 DNS 主机名。 | 
| [安全组规则](#ec2-data-rules) | 与您的实例关联的安全组规则决定允许哪些入站流量和出站流量。 | 
| [用户数据](#ec2-data-user-data) | 用户数据在启动时可供实例使用。它包含 shell 脚本（Linux）或 PowerShell 脚本（Windows）。 | 

## 地理位置
<a name="ec2-data-geographic-location"></a>

Amazon EC2 在全球每个 AWS 区域均可用。每个区域都是一个单独的地理区域。为服务器选择靠近大多数用户的区域，可以降低网络延迟。

您可以使用 [Amazon EC2 全球视图](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/global-view.html)列出所有区域的 Amazon EC2 实例。使用 AWS 管理控制台 和 API 时，您必须单独列出每个区域的实例。

**为什么这很重要**  
确定实例所在的位置后，您可以根据需要决定是在相同位置还是不同位置部署功能等效的服务器。

**获取所有区域中 EC2 实例的摘要**

1. 通过以下网址打开 Amazon EC2 全局视图控制台：[https://console.aws.amazon.com/ec2globalview/home](https://console.aws.amazon.com/ec2globalview/home)。

1. 在**区域资源管理器**选项卡的**摘要**下，查看**实例**的资源计数，其中包括实例数量和区域数量。选择带下划线的文本，查看实例数量在各区域的分布情况。

1. 在**全球搜索**选项卡上，选择客户端筛选器**资源类型 = 实例**。您可通过指定区域或标签进一步筛选结果。

**使用 AWS CLI 获取某个区域中的 EC2 实例数量**  
使用以下 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令统计指定区域中的实例数。您必须在您有实例的每个区域运行此命令。

```
aws ec2 describe-instances \
    --region {{us-east-2}} \
    --query "length(Reservations[*].Instances[])"
```

下面是示例输出。

```
27
```

要获取实例 ID 列表而不是实例计数，请改用以下 `--query` 参数。

```
--query "Reservations[*].Instances[].InstanceId"
```

## 硬件规格
<a name="ec2-data-specifications"></a>

您为 EC2 实例指定的实例类型决定了其可用的计算、内存、存储和联网资源。每个实例系列以不同方式兼顾计算、内存、网络和存储资源。有关更多信息，请参阅 [Amazon EC2 实例类型指南](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html)。

**为什么这些很重要**  
确定实例的硬件规格后，您可以决定功能等效的服务器所需的最低规格。

**获取您的实例所使用实例类型的摘要**  
使用以下 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。**sed** 命令删除会带有方括号的行和空行。您必须在您有实例的每个区域运行此命令。

```
aws ec2 describe-instances \
    --query "Reservations[*].Instances[].InstanceType" | sed 's/[][]//g;/^$/d' | sort | uniq -c | sort -nr
```

下面是示例输出。

```
  20    "c6i.4xlarge",
   5    "t2.micro",
   2    "g6e.2xlarge",
```

**获取有关特定实例类型的信息**  
使用以下 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令描述实例类型。`--query` 参数在输出中仅包括指定的字段。这些是基本特征。您可以包括所需的任何其他字段，也可以参阅《Amazon EC2 Instance Types Guide》**中的 [Amazon EC2 instance type specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-type-specifications.html)。

```
aws ec2 describe-instance-types \
    --instance-types {{c6i.4xlarge t2.micro g6e.2xlarge}} \
    --query "InstanceTypes[*].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB,NetworkInfo.NetworkPerformance]" \
    --output table
```

下面是示例输出。这些列包括实例类型、vCPU、内存（GiB）和网络带宽（Gbps）。

```
------------------------------------------------------
|                DescribeInstanceTypes               |
+--------------+-----+--------+----------------------+
|  t2.micro    |  1  |  1024  |  Low to Moderate     |
|  c6i.4xlarge |  16 |  32768 |  Up to 12.5 Gigabit  |
|  g6e.2xlarge |  8  |  65536 |  Up to 20 Gigabit    |
+--------------+-----+--------+----------------------+
```

## 图像
<a name="ec2-data-images"></a>

亚马逊机器映像（AMI）提供启动时安装在实例上的软件，例如操作系统、服务、开发工具和应用程序。您可以将 AMI 导出为其他格式以供其他服务器使用。

**为什么这些很重要**  
确定实例的 AMI 后，您可以规划功能等效的服务器所需的映像。可以将您的 AMI 导出为可以在其他地方使用的格式。或者，您可能需要连接到从每个 AMI 启动的实例，确认已安装的内容及其配置方式，并确保拥有所需所有内容的副本。

**获取实例的 AMI**  
使用以下 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。**sed** 命令删除会带有方括号的行和空行。您必须在您有实例的每个区域运行此命令。

```
aws ec2 describe-instances \
    --query "Reservations[*].Instances[].ImageId" | sed 's/[][]//g;/^$/d' | sort | uniq -c | sort -nr
```

下面是示例输出。

```
20     "ami-0a70b9d193ae8a79",
 5     "ami-07d9cf938edb0739b",
 2     "ami-09245d5773578a1d6",
```

**获取有关特定 AMI 的信息**  
使用以下 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。`--query` 参数在输出中仅包括指定的字段。您可以包括所需的任何其他字段。

```
aws ec2 describe-images \
    --image-id {{ami-0a70b9d193ae8a79 ami-07d9cf938edb0739b ami-09245d5773578a1d6}} \
    --query "Images[*].{ID:ImageId,CreateDate:CreationDate,Name:Name,Description:Description}"
```

下面是示例输出。

```
[
    {
        "ID": "ami-0a70b9d193ae8a799",
        "CreateDate": "2025-03-01T02:22:41.000Z",
        "Name": "web-server-3.1",
        "Description": "Image for web servers"
    },
    {
        "ID": "ami-07d9cf938edb0739b",
        "CreateDate": "2025-02-01T23:59:03.000Z",
        "Name": "awesome-application-11.5",
        "Description": "Image for Awesome Application"
    },
    {
        "ID": "ami-09245d5773578a1d6",
        "CreateDate": "2025-01-31T02:22:41.000Z",
        "Name": "monitoring-4.2",
        "Description": "Monitoring software"
    }
]
```

**从 AMI 创建 VM 文件**  
使用 [export-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/export-image.html) 命令。支持的映像格式包括 VHD（与 Citrix Xen 和 Microsoft Hyper-V 兼容）、VMDK（与 VMware ESX 和 VMware vSphere 兼容）以及原始格式 raw（与 KVM 和 Xen 虚拟机监控程序兼容）。有关 VM Import/Export 要求和限制的信息，请参阅 [VM Import/Export 要求](https://docs.aws.amazon.com/vm-import/latest/userguide/vmie_prereqs.html)。

## IP 地址和 DNS 主机名
<a name="ec2-data-ip-dns"></a>

您的用户使用其公有 DNS 主机名通过互联网连接到 EC2 实例。EC2 实例的公有 DNS 主机名解析为其公有 IP 地址。EC2 实例可以使用其私有 IP 地址相互通信。

**为什么这些很重要**  
IP 地址允许设备通过本地网络或互联网相互通信。通过记下实例的 IP 地址和 DNS 名称，可帮助确保功能等效的服务器可以与实例相同的客户端或设备进行通信。例如，您可以更新负载均衡器配置或更新您为 DNS 提供商创建的 DNS 记录。

**获取实例的 IP 地址和 DNS 主机名**  
使用以下 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。您必须在您有实例的每个区域运行此命令。`--query` 参数在输出中仅包括指定的字段。您可以包括所需的任何其他字段。

```
aws ec2 describe-instances \
    --query "Reservations[*].Instances[].[InstanceId,PrivateIpAddress,PublicDnsName]" \
    --output table
```

下面是示例输出。这些列包括实例 ID、私有 IPv4 地址和公有 IPv4 DNS 名称。

```
----------------------------------------------------------------------------------------
|                                   DescribeInstances                                  |
+---------------------+------------+---------------------------------------------------+
| i-0bac57d7472c89bac | 10.0.2.139 | ec2-192-0-2-142.us-east-2.compute.amazonaws.com   |
| i-0fa8b7678975a3fff | 10.0.14.85 | ec2-198-51-100-56.us-east-2.compute.amazonaws.com |
  ...
  ...
| i-08fd74f3f1595fdbd | 10.0.1.241 | ec2-203.0.113.13.us-east-2.compute.amazonaws.com  |
+---------------------+------------+---------------------------------------------------+
```

## 安全组规则
<a name="ec2-data-rules"></a>

安全组起到虚拟防火墙的作用。在将安全组与 EC2 实例关联后，其规则会允许该 EC2 实例通过特定端口和协议的入站和出站流量。

**为什么这些很重要**  
确定允许到达服务器的入站流量和允许离开服务器的出站流量之后，您可以规划功能等效的服务器所需的防火墙规则。

**获取实例的安全组**  
使用以下 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。**sed** 命令删除会带有方括号的行和空行。您必须在您有实例的每个区域运行此命令。

```
aws ec2 describe-instances \
    --query "Reservations[*].Instances[].SecurityGroups[].GroupId" | sed 's/[][]//g;/^$/d' | sort | uniq -c | sort -nr
```

下面是示例输出。

```
27     "sg-01dd3383691d02f42",
10     "sg-08c77cc910c0b3b2c",
 2     "sg-00f4e409629f1a42d",
```

**获取安全组的入站规则**  
使用以下 [describe-security-group-rules](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-security-group-rules.html) 命令显示 `IsEgress` 为 `false` 的指定安全组的规则。

```
aws ec2 describe-security-group-rules \
    --filters Name=group-id,Values={{sg-01dd3383691d02f42}} \
    --query 'SecurityGroupRules[?IsEgress==`false`]'
```

下面是示例输出。第一条规则是默认入站规则，其允许分配给此安全组的所有资源的入站流量。另一条规则允许来自指定前缀列表中 IP 地址的 SSH 流量。要描述前缀列表中的 CIDR 块，请使用 [describe-prefix-lists](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-prefix-lists.html) 命令。

```
[
    {
        "SecurityGroupRuleId": "sgr-06c8b42574a91db1b",
        "GroupId": "sg-01dd3383691d02f42",
        "GroupOwnerId": "123456789012",
        "IsEgress": false,
        "IpProtocol": "-1",
        "FromPort": -1,
        "ToPort": -1,
        "ReferencedGroupInfo": {
            "GroupId": "sg-01dd3383691d02f42",
            "UserId": "123456789012"
        },
        "Tags": [],
        "SecurityGroupRuleArn": "arn:aws:ec2:us-west-2:123456789012:security-group-rule/sgr-06c8b42574a91db1b"
    },
    {
        "SecurityGroupRuleId": "sgr-0886a5d46afcd1758",
        "GroupId": "sg-01dd3383691d02f42",
        "GroupOwnerId": "123456789012",
        "IsEgress": false,
        "IpProtocol": "tcp",
        "FromPort": 22,
        "ToPort": 22,
        "PrefixListId": "pl-f8a6439125e7bf465",
        "Tags": [],
        "SecurityGroupRuleArn": "arn:aws:ec2:us-east-2:123456789012:security-group-rule/sgr-0886a5d46afcd1758"
    }
]
```

**获取安全组的出站规则**  
使用以下 [describe-security-group-rules](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-security-group-rules.html) 命令显示 `IsEgress` 为 `true` 的指定安全组的规则。

```
aws ec2 describe-security-group-rules \
    --filters Name=group-id,Values={{sg-01dd3383691d02f42}} \
    --query 'SecurityGroupRules[?IsEgress==`true`]'
```

下面是示例输出。其仅包含默认出站规则，允许所有出站 IPv4 流量。

```
[
    {
        "SecurityGroupRuleId": "sgr-048f09a719247dce7",
        "GroupId": "sg-01dd3383691d02f42",
        "GroupOwnerId": "123456789012",
        "IsEgress": true,
        "IpProtocol": "-1",
        "FromPort": -1,
        "ToPort": -1,
        "CidrIpv4": "0.0.0.0/0",
        "Tags": [],
        "SecurityGroupRuleArn": "arn:aws:ec2:us-east-2:123456789012:security-group-rule/sgr-048f09a719247dce7"
    }
]
```

## 用户数据
<a name="ec2-data-user-data"></a>

在启动 EC2 实例时，您可以使用用户数据将 shell 脚本传递给该实例。请注意，用户数据采用 base64 编码，因此您需要解码用户数据才能读取脚本。

**为什么这很重要**  
如果您在启动时运行命令作为设置实例的一部分，则在设置功能等效的服务器时，可能需要执行相同的任务。

**查看实例的解码用户数据**  
使用以下 [describe-instance-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-attribute.html) 命令。**base64** 命令会解码用户数据。

```
aws ec2 describe-instance-attribute \
    --instance-id {{i-1234567890abcdef0}} \
    --attribute userData \
    --output text \
    --query "UserData.Value" | base64 --decode
```

下面是示例输出。

```
#!/bin/bash
yum update -y
service httpd start
chkconfig httpd on
```

## 相关资源
<a name="ec2-data-related-resources"></a>

以下是 EC2 实例的其他特征：
+ [密钥对](ec2-key-pairs.md)
+ [仓储服务](Storage.md)
+ [标签](Using_Tags.md)

您可以验证自己是使用以下方式启动 EC2 实例，还是在 EC2 实例之间分配流量：
+ [自动扩缩组](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html)
+ [EC2 实例集](Fleets.md)
+ [Elastic Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/)
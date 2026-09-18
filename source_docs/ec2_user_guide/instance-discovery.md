

# 查找 Amazon EC2 实例类型
<a name="instance-discovery"></a>

您必须先选择要使用的实例类型，然后才能启动实例。您选择的实例类型可能取决于您的工作负载所需的资源，例如计算、内存或存储资源。确定几种可能适合您的工作负载的实例类型，并在测试环境中评估它们的性能可能很有帮助。没有方法可以替代衡量应用程序在负载下的性能。

您可以使用 EC2 实例类型查找器获取有关 EC2 实例类型的建议和指导。有关更多信息，请参阅 [从 EC2 实例类型查找器获取建议](get-ec2-instance-type-recommendations.md)。

如果您已在运行 EC2 实例，可以使用 AWS Compute Optimizer 获取有关您应该用来提高性能、节省资金或两者兼顾的实例类型的建议。有关更多信息，请参阅 [从 Compute Optimizer 获取 EC2 实例建议](ec2-instance-recommendations.md)。

**Topics**
+ [使用控制台查找实例类型](#instance-discovery-console)
+ [使用 AWS CLI 描述实例类型](#describe-instance-type-example)
+ [使用 AWS CLI 查找实例类型](#instance-discovery-cli)
+ [使用 Tools for PowerShell 来查找实例类型](#instance-discovery-ps)

## 使用控制台查找实例类型
<a name="instance-discovery-console"></a>

您可以使用 Amazon EC2 控制台查找满足您的需求的实例类型。

**使用控制台查找实例类型**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 从导航栏，选择您在其中启动实例的区域。您可以选择向您提供的任何区域，无需理会您身处的位置。

1. 在导航窗格中，选择 **Instance Types (实例类型)**。

1. （可选）选择首选项（齿轮）图标以选择要显示的实例类型属性（例如 **On-Demand Linux pricing (按需 Linux 定价)**），然后选择 **Confirm (确认)**。或者，选择实例类型的名称以打开其详细信息页面，并查看通过控制台提供的所有属性。控制台不会显示通过 API 或命令行提供的所有属性。

1. 使用实例类型属性筛选显示的实例类型列表，以仅显示满足您的需求的实例类型。例如，您可以筛选以下属性：
   + **Availability zones**（可用区）– 可用区、本地区域或 Wavelength 区域的名称。有关更多信息，请参阅 [区域和可用区](using-regions-availability-zones.md)。
   + **vCPUs** 或 **Cores**（内核）– vCPU 或内核的数量。
   + **Memory (GiB)** [内存（GiB)] - 内存大小，以 GiB 为单位。
   + **Network performance**（网络性能）– 网络性能，以千兆为单位。
   + **Local instance storage**（本地实例存储）– 指示实例类型是否具有本地实例存储（`true` \| `false`）。

1. （可选）要并排查看比较结果，请选中多个实例类型的复选框。比较结果显示在屏幕底部。

1. （可选）要将实例类型列表保存到逗号分隔值（.csv）文件以进一步查看，请依次选择 **Actions**（操作）、**Download list CSV**（下载列表 CSV）。该文件包括与您设置的筛选条件匹配的所有实例类型。

1. （可选）要使用符合您需求的实例类型启动实例，请选中该实例类型的复选框并依次选择 **Actions**（操作）、**Launch instance**（启动实例）。有关更多信息，请参阅 [使用控制台中的启动实例向导来启动 EC2 实例](ec2-launch-instance-wizard.md)。

## 使用 AWS CLI 描述实例类型
<a name="describe-instance-type-example"></a>

您可以使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令来描述特定的实例类型。

**完整描述实例类型**  
以下命令显示了指定实例类型的所有可用详细信息。输出很长，所以此处进行了省略。

```
aws ec2 describe-instance-types \
    --instance-types {{t2.micro}} \
    --region {{us-east-2}}
```

**描述实例类型并筛选输出**  
以下命令显示了指定实例类型的网络详细信息。

```
aws ec2 describe-instance-types \
    --instance-types {{t2.micro}} \
    --region {{us-east-2}} \
    --query "InstanceTypes[].NetworkInfo"
```

下面是示例输出。

```
[
    {
        "NetworkPerformance": "Low to Moderate",
        "MaximumNetworkInterfaces": 2,
        "MaximumNetworkCards": 1,
        "DefaultNetworkCardIndex": 0,
        "NetworkCards": [
            {
                "NetworkCardIndex": 0,
                "NetworkPerformance": "Low to Moderate",
                "MaximumNetworkInterfaces": 2,
                "BaselineBandwidthInGbps": 0.064,
                "PeakBandwidthInGbps": 1.024
            }
        ],
        "Ipv4AddressesPerInterface": 2,
        "Ipv6AddressesPerInterface": 2,
        "Ipv6Supported": true,
        "EnaSupport": "unsupported",
        "EfaSupported": false,
        "EncryptionInTransitSupported": false,
        "EnaSrdSupported": false
    }
]
```

以下命令显示了指定实例类型的可用内存。

```
aws ec2 describe-instance-types \
    --instance-types {{t2.micro}} \
    --region {{us-east-2}} \
    --query "InstanceTypes[].MemoryInfo"
```

下面是示例输出。

```
[
    {
        "SizeInMiB": 1024
    }
]
```

## 使用 AWS CLI 查找实例类型
<a name="instance-discovery-cli"></a>

您可以使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 和 [describe-instance-type-offerings](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-type-offerings.html) 命令来查找满足需求的实例类型。

**Topics**
+ [按可用区查找实例类型](#find-instance-type-example-1)
+ [按可用内存大小查找实例类型](#find-instance-type-example-2)
+ [按可用实例存储查找实例类型](#find-instance-type-example-3)
+ [查找支持休眠的实例类型](#find-instance-type-example-4)

### 示例 1：按可用区查找实例类型
<a name="find-instance-type-example-1"></a>

以下示例仅显示了在指定可用区中提供的实例类型。

```
aws ec2 describe-instance-type-offerings \
    --location-type "availability-zone" \
    --filters "Name=location,Values={{us-east-2a}}" \
    --region {{us-east-2}} \
    --query "InstanceTypeOfferings[*].[InstanceType]" --output text | sort
```

输出是按字母顺序排序的实例类型列表。下面只是输出的开始部分。

```
a1.2xlarge
a1.4xlarge
a1.large
a1.medium
a1.metal
a1.xlarge
c4.2xlarge
   ...
```

### 示例 2：按可用内存大小查找实例类型
<a name="find-instance-type-example-2"></a>

以下示例仅显示了当前一代中具有 64 GiB（65536 MiB）内存的实例类型。

```
aws ec2 describe-instance-types \
    --filters "Name=current-generation,Values=true" "Name=memory-info.size-in-mib,Values={{65536}}" \
    --region {{us-east-2}} \
    --query "InstanceTypes[*].[InstanceType]" --output text | sort
```

输出是按字母顺序排序的实例类型列表。下面只是输出的开始部分。

```
c5a.8xlarge
c5ad.8xlarge
c6a.8xlarge
c6g.8xlarge
c6gd.8xlarge
c6gn.8xlarge
c6i.8xlarge
c6id.8xlarge
c6in.8xlarge
   ...
```

### 示例 3：按可用实例存储查找实例类型
<a name="find-instance-type-example-3"></a>

以下示例显示了包含实例存储卷的所有 R7 实例的实例存储总大小。

```
aws ec2 describe-instance-types \
    --filters "Name=instance-type,Values=r7*" "Name=instance-storage-supported,Values=true" \
    --region {{us-east-2}} \
    --query "InstanceTypes[].[InstanceType, InstanceStorageInfo.TotalSizeInGB]" \
    --output table
```

下面是示例输出。

```
---------------------------
|  DescribeInstanceTypes  |
+----------------+--------+
|  r7gd.xlarge   |  237   |
|  r7gd.8xlarge  |  1900  |
|  r7gd.16xlarge |  3800  |
|  r7gd.medium   |  59    |
|  r7gd.4xlarge  |  950   |
|  r7gd.2xlarge  |  474   |
|  r7gd.metal    |  3800  |
|  r7gd.large    |  118   |
|  r7gd.12xlarge |  2850  |
+----------------+--------+
```

### 示例 4：查找支持休眠的实例类型
<a name="find-instance-type-example-4"></a>

以下示例显示支持休眠的实例类型。

```
aws ec2 describe-instance-types \
    --filters "Name=hibernation-supported,Values=true" \
    --region {{us-east-2}} \
    --query "InstanceTypes[*].[InstanceType]" \
    --output text | sort
```

输出是按字母顺序排序的实例类型列表。下面只是输出的开始部分。

```
c4.2xlarge
c4.4xlarge
c4.8xlarge
c4.large
c4.xlarge
c5.12xlarge
c5.18xlarge
c5.2xlarge
c5.4xlarge
c5.9xlarge
...
```

## 使用 Tools for PowerShell 来查找实例类型
<a name="instance-discovery-ps"></a>

您可以使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) 和 [Get-EC2InstanceTypeOffering](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceTypeOffering.html) cmdlet 来查找满足您需求的实例类型。

**Topics**
+ [按可用区查找实例类型](#find-instance-type-by-az-ps)
+ [按可用内存大小查找实例类型](#find-instance-type-by-memory-ps)
+ [按可用实例存储查找实例类型](#find-instance-type-by-storage-ps)
+ [查找支持休眠的实例类型](#find-instance-type-hibernation-ps)

### 按可用区查找实例类型
<a name="find-instance-type-by-az-ps"></a>

以下示例仅显示了在指定可用区中提供的实例类型。

```
(Get-EC2InstanceTypeOffering `
    -LocationType "availability-zone" `
    -Region {{us-east-2}} `
    -Filter @{Name="location"; Values="{{us-east-2a}}"}).InstanceType | Sort-Object `
```

### 按可用内存大小查找实例类型
<a name="find-instance-type-by-memory-ps"></a>

以下示例仅显示了当前一代中具有 64 GiB（65536 MiB）内存的实例类型。

```
(Get-EC2InstanceType `
    -Filter @{Name="current-generation"; Values="true"}, 
            @{Name="memory-info.size-in-mib"; Values="65536"}).InstanceType | Sort-Object
```

### 按可用实例存储查找实例类型
<a name="find-instance-type-by-storage-ps"></a>

以下示例显示了包含实例存储卷的所有 R7 实例的实例存储总大小。

```
Get-EC2InstanceType `
    -Filter @{Name="instance-type"; Values="r7*"}, 
            @{Name="instance-storage-supported"; Values="true"} | `
     Select InstanceType, @{Name="TotalSizeInGB"; Expression={($_.InstanceStorageInfo.TotalSizeInGB)}}
```

下面是示例输出。

```
InstanceType  TotalSizeInGB
------------  -------------
r7gd.8xlarge           1900
r7gd.16xlarge          3800
r7gd.xlarge             237
r7gd.4xlarge            950
r7gd.medium              59
r7gd.2xlarge            474
r7gd.large              118
r7gd.metal             3800
r7gd.12xlarge          2850
```

### 查找支持休眠的实例类型
<a name="find-instance-type-hibernation-ps"></a>

以下示例显示支持休眠的实例类型。

```
(Get-EC2InstanceType `
    -Filter @{Name="hibernation-supported"; Values="true"}).InstanceType | Sort-Object
```


# EC2 实例的实例存储卷限制
<a name="instance-store-volumes"></a>

实例存储卷的数量、大小和类型由实例类型决定。某些实例类型（例如，C8i、M8i 和 R8i）不支持实例存储卷，而其他实例类型（例如，C8id、M8id 和 R8id）可支持实例存储卷。您向实例附加的实例存储卷不能超过其实例类型所支持的数量。对于支持实例存储卷的实例类型，实例存储卷的数量和大小因实例大小而异。例如，`r8id.large` 支持 1 x 118 GB 的实例存储卷，而 `r8id.32xlarge` 支持 2 x 3800GB 的实例存储卷。

对于具有 **NVMe 实例存储卷**的实例类型，所有支持的实例存储卷都会在启动时自动连接到实例。对于具有**非 NVMe 实例存储卷**的实例类型（例如，C1、C3、M1、M2、M3、R3、D2、H1、I2、X1 和 X1e），您必须在启动时为要连接的实例存储卷手动指定块设备映射。然后，在实例启动后，必须先[格式化并装载连接的实例存储卷](making-instance-stores-available-on-your-instances.md)，然后才能使用它们。无法在启动实例后附加实例存储卷。

某些实例类型使用基于 NVMe 或 SATA 的固态硬盘（SSD），而其他实例类型使用基于 SATA 的硬盘驱动器（HDD）。SSD 提供高随机 I/O 性能，且延迟非常低；但实例终止时不需要保留数据，或者可以利用容错架构。有关更多信息，请参阅 [适用于 EC2 实例的 SSD 实例存储卷](ssd-instance-store.md)。

NVMe 实例存储卷和某些 HDD 实例存储卷上的数据采用静态加密。有关更多信息，请参阅 [Amazon EC2 中的数据保护](data-protection.md)。

## 可用的实例存储卷
<a name="available-instance-store-volumes"></a>

《Amazon EC2 实例类型指南》**提供每种支持的实例类型可以使用的实例存储卷的数量、大小、类型和性能优化。有关更多信息，请参阅下列内容：
+ [实例存储规格 – 通用型](https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html#gp_instance-store)
+ [实例存储规格 – 计算优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html#co_instance-store)
+ [实例存储规格 – 内存优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html#mo_instance-store)
+ [实例存储规格 – 存储优化型](https://docs.aws.amazon.com/ec2/latest/instancetypes/so.html#so_instance-store)
+ [实例存储规格 – 加速计算型](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html#ac_instance-store)
+ [实例存储规格 – 高性能计算型](https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html#hpc_instance-store)
+ [实例存储规格 – 上一代](https://docs.aws.amazon.com/ec2/latest/instancetypes/pg.html#pg_instance-store)

------
#### [ Console ]

**检索实例存储卷信息**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Instance Types (实例类型)**。

1. 添加筛选条件**本地实例存储 = true**。**存储**列指示该实例类型的实例存储总大小。

1. （可选）选择**首选项**图标，然后开启**存储磁盘计数**。此列指示实例存储卷的数量。

1. （可选）添加筛选条件以进一步筛选相关的特定实例类型。

------
#### [ AWS CLI ]

**检索实例存储卷信息**  
请使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令。以下示例显示了在具有实例存储卷的 R8i 实例系列中，每种实例类型的实例存储总大小。

```
aws ec2 describe-instance-types \
    --filters "Name=instance-type,Values=r8i*" "Name=instance-storage-supported,Values=true" \
    --query 'sort_by(InstanceTypes, &InstanceStorageInfo.TotalSizeInGB)[].{InstanceType:InstanceType,TotalSizeInGB:InstanceStorageInfo.TotalSizeInGB}' \
    --output table
```

下面是示例输出。

```
--------------------------------------
|        DescribeInstanceTypes       |
+------------------+-----------------+
|   InstanceType   |  TotalSizeInGB  |
+------------------+-----------------+
|  r8id.large      |  118            |
|  r8id.xlarge     |  237            |
|  r8id.2xlarge    |  474            |
|  r8id.4xlarge    |  950            |
|  r8id.8xlarge    |  1900           |
|  r8id.12xlarge   |  2850           |
|  r8id.16xlarge   |  3800           |
|  r8id.24xlarge   |  5700           |
|  r8id.32xlarge   |  7600           |
|  r8id.48xlarge   |  11400          |
|  r8id.metal-48xl |  11400          |
|  r8id.96xlarge   |  22800          |
|  r8id.metal-96xl |  22800          |
+------------------+-----------------+
```

**获取实例类型的完整实例存储详细信息**  
请使用 [describe-instance-types](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-types.html) 命令。

```
aws ec2 describe-instance-types \
    --filters "Name=instance-type,Values={{r8id.32xlarge}}" \
    --query 'InstanceTypes[0].InstanceStorageInfo' \
    --output json
```

示例输出显示，此实例类型有两个 3800 GB 的 NVMe SSD 卷，总共 7600 GB 的实例存储空间。

```
{
    "TotalSizeInGB": 7600,
    "Disks": [
        {
            "SizeInGB": 3800,
            "Count": 2,
            "Type": "ssd"
        }
    ],
    "NvmeSupport": "required",
    "EncryptionSupport": "required"
}
```

------
#### [ PowerShell ]

**检索实例存储卷信息**  
使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) cmdlet。以下示例显示了在具有实例存储卷的 R8i 实例系列中，每种实例类型的实例存储总大小。

```
(Get-EC2InstanceType -Filter `
    @{Name="instance-type"; Values="r8i*"},
    @{Name="instance-storage-supported"; Values="true"}) |
    Sort-Object {$_.InstanceStorageInfo.TotalSizeInGB} |
    Format-Table InstanceType,
        @{Name="Disks.SizeInGB";Expression={$_.InstanceStorageInfo.Disks[0].SizeInGB}},
        @{Name="Disks.Count";Expression={$_.InstanceStorageInfo.Disks[0].Count}},
        @{Name="TotalSizeInGB";Expression={$_.InstanceStorageInfo.TotalSizeInGB}}
```

下面是示例输出。

```
InstanceType    Disks.SizeInGB Disks.Count TotalSizeInGB
------------    -------------- ----------- -------------
r8id.large                 118           1           118
r8id.xlarge                237           1           237
r8id.2xlarge               474           1           474
r8id.4xlarge               950           1           950
r8id.8xlarge              1900           1          1900
r8id.12xlarge             2850           1          2850
r8id.16xlarge             3800           1          3800
r8id.24xlarge             2850           2          5700
r8id.32xlarge             3800           2          7600
r8id.48xlarge             3800           3         11400
r8id.metal-48xl           3800           3         11400
r8id.96xlarge             3800           6         22800
r8id.metal-96xl           3800           6         22800
```

**获取实例类型的完整实例存储详细信息**  
使用 [Get-EC2InstanceType](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceType.html) cmdlet。

```
(Get-EC2InstanceType `
    -Filter @{Name="instance-type"; Values="{{r8id.32xlarge}}"}).InstanceStorageInfo |
    Format-List *,
        @{Name="Disks.Count";Expression={$_.Disks[0].Count}},
        @{Name="Disks.SizeInGB";Expression={$_.Disks[0].SizeInGB}},
        @{Name="Disks.Type";Expression={$_.Disks[0].Type.Value}}
```

示例输出显示，此实例类型有两个 3800 GB 的 NVMe SSD 卷，总共 7600 GB 的实例存储空间。

```
Disks             : {Amazon.EC2.Model.DiskInfo}
EncryptionSupport : required
NvmeSupport       : required
TotalSizeInGB     : 7600
Disks.Count       : 2
Disks.SizeInGB    : 3800
Disks.Type        : ssd
```

------
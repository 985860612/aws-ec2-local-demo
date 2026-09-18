

# Amazon EC2 实例拓扑的示例
<a name="ec2-instance-topology-examples"></a>

您可以使用 [describe-instance-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 命令来描述 EC2 实例的拓扑。另外，您可以使用 [describe-capacity-reservation-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 命令来描述容量预留的拓扑。

当您使用不带参数或筛选条件的 `describe-instance-topology` 或 `describe-capacity-reservation-topology` 命令时，响应将包括与指定区域中该命令支持的实例类型相匹配的所有实例或容量预留（具体取决于所使用的命令）。您可以通过包含 `--region` 参数或通过设置默认区域来指定区域。有关设置默认区域的更多信息，请参阅 [为您的 Amazon EC2 资源选择区域](using-regions-availability-zones-setup.md)。

您可以包含参数以返回与指定实例或容量预留 ID 或置放群组名称相匹配的实例或容量预留。您还可以包含筛选条件以返回与指定实例类型或实例系列匹配的实例或容量预留，或者返回指定可用区或本地区域中的实例或容量预留。您可以包含单个参数或筛选条件，也可以包含参数和筛选条件的组合。

输出是分页的，默认情况下每页最多 20 个实例或容量预留。您可以使用 `--max-results` 参数为每页指定最多 100 个实例或容量预留。

有关更多信息，请参阅 [describe-instance-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 和 [describe-reservation-topology-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reservation-topology-topology.html)。

**所需的权限**

需要以下权限：
+ `ec2:DescribeInstanceTopology` – 用于描述实例拓扑
+  `ec2:DescribeCapacityReservationTopology` – 用于描述容量预留拓扑

**Contents**
+ [示例 1：DescribeInstanceTopology - 实例 ID](#instance-topology-ex1)
+ [示例 2：DescribeInstanceTopology - 置放群组名称参数](#instance-topology-ex2)
+ [示例 3：DescribeInstanceTopology - 实例类型筛选条件](#instance-topology-ex3)
  + [示例 3a – 指定实例类型的精确匹配筛选条件](#instance-topology-ex3a)
  + [示例 3b – 实例系列的通配符筛选条件](#instance-topology-ex3b)
  + [示例 3c – 组合的实例系列和精确匹配筛选条件](#instance-topology-ex3c)
+ [示例 4：DescribeInstanceTopology - 区域 ID 筛选条件](#instance-topology-ex4)
  + [示例 4a – 可用区筛选条件](#instance-topology-ex4a)
  + [示例 4b – 本地区域筛选条件](#instance-topology-ex4b)
  + [示例 4c – 组合的可用区和本地区域筛选条件](#instance-topology-ex4c)
+ [示例 5：DescribeInstanceTopology - 实例类型和区域 ID 筛选条件](#instance-topology-ex5)
+ [示例 6：DescribeCapacityReservationTopology - 容量预留 ID](#instance-topology-ex6)
+ [示例 7：DescribeCapacityReservationTopology - 实例类型筛选条件](#instance-topology-ex7)

## 示例 1：DescribeInstanceTopology - 实例 ID
<a name="instance-topology-ex1"></a>

------
#### [ AWS CLI ]

**描述特定实例的拓扑**  
将 [describe-instance-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 命令与 `--instance-ids` 参数一起使用。输出内容会包含与指定实例 ID 匹配的实例。

```
aws ec2 describe-instance-topology \
    --region {{us-west-2}} \
    --instance-ids {{i-1111111111example}} {{i-2222222222example}}
```

下面是示例输出。

```
{
    "Instances": [
        {
            "InstanceId": "i-1111111111example",
            "InstanceType": "p4d.24xlarge",
            "GroupName": "ML-group",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3333333333example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "usw2-az2",
            "AvailabilityZone": "us-west-2a"
        },
        {
            "InstanceId": "i-2222222222example",
            "InstanceType": "trn1n.32xlarge",
            "GroupName": "HPC-group",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3214313214example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "usw2-az2",
            "AvailabilityZone": "us-west-2a"
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

------
#### [ PowerShell ]

**描述特定实例的拓扑**  
使用 [Get-EC2InstanceTopology](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceTopology.html) cmdlet。

```
Get-EC2InstanceTopology `
    -InstanceId {{i-1111111111example}}, {{i-2222222222example}}
```

------

## 示例 2：DescribeInstanceTopology - 置放群组名称参数
<a name="instance-topology-ex2"></a>

------
#### [ AWS CLI ]

**描述特定置放群组中实例的拓扑**  
将 [describe-instance-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 命令与 `group-names` 参数一起使用。输出内容会包含位于任一指定置放组中的实例。

```
aws ec2 describe-instance-topology \
    --region {{us-west-2}} \
    --group-names {{ML-group}} {{HPC-group}}
```

下面是示例输出。

```
{
    "Instances": [
        {
            "InstanceId": "i-1111111111example",
            "InstanceType": "p4d.24xlarge",
            "GroupName": "ML-group",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3333333333example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "usw2-az2",
            "AvailabilityZone": "us-west-2a"
        },
        {
            "InstanceId": "i-2222222222example",
            "InstanceType": "trn1n.32xlarge",
            "GroupName": "HPC-group",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3214313214example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "usw2-az2",
            "AvailabilityZone": "us-west-2a"
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

------
#### [ PowerShell ]

**描述特定置放群组中实例的拓扑**  
使用 [Get-EC2InstanceTopology](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceTopology.html) cmdlet。

```
Get-EC2InstanceTopology `
    -GroupName {{ML-group}}, {{HPC-group}}
```

------

## 示例 3：DescribeInstanceTopology - 实例类型筛选条件
<a name="instance-topology-ex3"></a>

您可以按指定的实例类型（精确匹配）进行筛选，也可以按实例系列进行筛选（使用通配符）。您也可以将指定的实例类型筛选条件和实例系列筛选条件组合使用。

### 示例 3a – 指定实例类型的精确匹配筛选条件
<a name="instance-topology-ex3a"></a>

------
#### [ AWS CLI ]

**描述特定实例类型的实例拓扑**  
将 [describe-instance-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 命令与 `instance-type` 筛选条件一起使用。输出内容仅包含指定实例类型的实例。

```
aws ec2 describe-instance-topology \
    --region {{us-west-2}} \
    --filters Name=instance-type,Values={{trn1n.32xlarge}}
```

下面是示例输出。

```
{
    "Instances": [
        {
            "InstanceId": "i-2222222222example",
            "InstanceType": "trn1n.32xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3333333333example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "usw2-az2",
            "AvailabilityZone": "us-west-2a"
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

------
#### [ PowerShell ]

**描述特定实例类型的实例拓扑**  
使用 [Get-EC2InstanceTopology](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceTopology.html) cmdlet。

```
Get-EC2InstanceTopology `
    -Filter @{Name="instance-type"; Values="{{trn1n.32xlarge}}"}
```

------

### 示例 3b – 实例系列的通配符筛选条件
<a name="instance-topology-ex3b"></a>

------
#### [ AWS CLI ]

**描述特定实例系列的实例拓扑**  
将 [describe-instance-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 命令与 `instance-type` 筛选条件一起使用。输出内容仅包含指定实例系列的实例。

```
aws ec2 describe-instance-topology \
    --region {{us-west-2}} \
    --filters Name=instance-type,Values={{trn1*}}
```

下面是示例输出。

```
{
    "Instances": [
        {
            "InstanceId": "i-2222222222example",
            "InstanceType": "trn1n.32xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3333333333example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "usw2-az2",
            "AvailabilityZone": "us-west-2a"
        },
        {
            "InstanceId": "i-3333333333example",
            "InstanceType": "trn1.32xlarge",
            "NetworkNodes": [
                "nn-1212121212example",
                "nn-1211122211example",
                "nn-1311133311example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "usw2-az4",
            "AvailabilityZone": "us-west-2d"            
        },
        {
            "InstanceId": "i-444444444example",
            "InstanceType": "trn1.2xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-5434334334example",
                "nn-1235301234example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "usw2-az2",
            "AvailabilityZone": "us-west-2a"          
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

------
#### [ PowerShell ]

**描述特定实例系列的实例拓扑**  
使用 [Get-EC2InstanceTopology](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceTopology.html) cmdlet。

```
Get-EC2InstanceTopology `
    -Filter @{Name="instance-type"; Values="{{trn1*}}"}
```

------

### 示例 3c – 组合的实例系列和精确匹配筛选条件
<a name="instance-topology-ex3c"></a>

------
#### [ AWS CLI ]

**描述某个实例系列或具有实例类型的实例的拓扑**  
将 [describe-instance-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 命令与 `instance-type` 筛选条件一起使用。输出内容仅包含符合指定条件的实例。

```
aws ec2 describe-instance-topology \
    --region {{us-west-2}} \
    --filters "Name=instance-type,Values={{p4d*}},{{trn1n.32xlarge}}"
```

下面是示例输出。

```
{
    "Instances": [
        {
            "InstanceId": "i-1111111111example",
            "InstanceType": "p4d.24xlarge",
            "GroupName": "ML-group",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3333333333example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "usw2-az2",
            "AvailabilityZone": "us-west-2a"
        },
        {
            "InstanceId": "i-2222222222example",
            "InstanceType": "trn1n.32xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-4343434343example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "usw2-az2",
            "AvailabilityZone": "us-west-2a"
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

------
#### [ PowerShell ]

**描述某个实例系列或具有实例类型的实例的拓扑**  
使用 [Get-EC2InstanceTopology](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceTopology.html) cmdlet。

```
Get-EC2InstanceTopology `
    -Filter @{Name="instance-type"; Values="{{p4d*}}", "{{trn1n.32xlarge}}"}
```

------

## 示例 4：DescribeInstanceTopology - 区域 ID 筛选条件
<a name="instance-topology-ex4"></a>

您可以使用 `zone-id` 筛选条件按可用区或本地区域进行筛选。您也可以将可用区筛选条件和本地区域筛选条件组合使用。

### 示例 4a – 可用区筛选条件
<a name="instance-topology-ex4a"></a>

------
#### [ AWS CLI ]

**描述特定可用区中的实例的拓扑**  
将 [describe-instance-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 命令与 `zone-id` 筛选条件一起使用。输出内容仅包含指定可用区中的实例。

```
aws ec2 describe-instance-topology \
    --region {{us-east-1}} \
    --filters Name=zone-id,Values={{use1-az1}}
```

下面是示例输出。

```
{
    "Instances": [
        {
            "InstanceId": "i-2222222222example",
            "InstanceType": "trn1n.32xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3214313214example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "use1-az1",
            "AvailabilityZone": "us-east-1a"
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

------
#### [ PowerShell ]

**描述特定可用区中的实例的拓扑**  
使用 [Get-EC2InstanceTopology](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceTopology.html) cmdlet。

```
Get-EC2InstanceTopology `
    -Filter @{Name="zone-id"; Values="{{use1-az1}}"}
```

------

### 示例 4b – 本地区域筛选条件
<a name="instance-topology-ex4b"></a>

------
#### [ AWS CLI ]

**描述特定本地区域中的实例的拓扑**  
将 [describe-instance-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 命令与 `zone-id` 筛选条件一起使用。输出内容仅包含指定本地区域中的实例。

```
aws ec2 describe-instance-topology \
    --region {{us-east-1}} \
    --filters Name=zone-id,Values={{use1-atl2-az1}}
```

下面是示例输出。

```
{
    "Instances": [
        {
            "InstanceId": "i-1111111111example",
            "InstanceType": "p4d.24xlarge",
            "GroupName": "ML-group",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3333333333example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "use1-atl2-az1",
            "AvailabilityZone": "us-east-1-atl-2a"
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

------
#### [ PowerShell ]

**描述特定本地区域中的实例的拓扑**  
使用 [Get-EC2InstanceTopology](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceTopology.html) cmdlet。

```
Get-EC2InstanceTopology `
    -Filter @{Name="zone-id"; Values="{{use1-atl2-az1}}"}
```

------

### 示例 4c – 组合的可用区和本地区域筛选条件
<a name="instance-topology-ex4c"></a>

------
#### [ AWS CLI ]

**描述特定区域中实例的拓扑**  
将 [describe-instance-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 命令与 `zone-id` 筛选条件一起使用。输出内容仅包含位于任一指定区域中的实例。

```
aws ec2 describe-instance-topology \
    --region {{us-east-1}} \
    --filters Name=zone-id,Values={{use1-az1}},{{use1-atl2-az1}}
```

下面是示例输出。

```
{
    "Instances": [
        {
            "InstanceId": "i-1111111111example",
            "InstanceType": "p4d.24xlarge",
            "GroupName": "ML-group",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3333333333example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "use1-atl2-az1",
            "AvailabilityZone": "us-east-1-atl-2a"
        },
        {
            "InstanceId": "i-2222222222example",
            "InstanceType": "trn1n.32xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3214313214example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "use1-az1",
            "AvailabilityZone": "us-east-1a"
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

------
#### [ PowerShell ]

**描述特定区域中实例的拓扑**  
使用 [Get-EC2InstanceTopology](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceTopology.html) cmdlet。

```
Get-EC2InstanceTopology `
    -Filter @{Name="zone-id"; Values="{{use1-az1}}", "{{use1-atl2-az1}}"}
```

------

## 示例 5：DescribeInstanceTopology - 实例类型和区域 ID 筛选条件
<a name="instance-topology-ex5"></a>

您可以将筛选条件组合在单个命令中。

------
#### [ AWS CLI ]

**描述具有特定实例类型、实例系列和区域的实例的拓扑**  
将 [describe-instance-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instance-topology.html) 命令与 `instance-type` 和 `zone-id` 筛选条件一起使用。响应包含任一指定实例类型的、位于任一指定区域的任何实例。

```
aws ec2 describe-instance-topology \
    --region {{us-east-1}} \
    --filters "Name=instance-type,Values={{p4d*}},{{trn1n.32xlarge}}" \
              "Name=zone-id,Values={{use1-az1}},{{use1-atl2-az1}}"
```

下面是示例输出。

```
{
    "Instances": [
        {
            "InstanceId": "i-1111111111example",
            "InstanceType": "p4d.24xlarge",
            "GroupName": "ML-group",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3333333333example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "use1-atl2-az1",
            "AvailabilityZone": "us-east-1-atl-2a"
        },
        {
            "InstanceId": "i-2222222222example",
            "InstanceType": "trn1n.32xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3214313214example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "use1-az1",
            "AvailabilityZone": "us-east-1a"
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

------
#### [ PowerShell ]

**描述具有特定实例类型、实例系列和区域的实例的拓扑**  
使用 [Get-EC2InstanceTopology](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2InstanceTopology.html) cmdlet。

```
Get-EC2InstanceTopology `
    -Filter @{Name="instance-type"; Values="{{p4d*}}", "{{trn1n.32xlarge}}"} `
            @{Name="zone-id"; Values="{{use1-az1}}", "{{use1-atl2-az1}}"}
```

------

## 示例 6：DescribeCapacityReservationTopology - 容量预留 ID
<a name="instance-topology-ex6"></a>

------
#### [ AWS CLI ]

**描述特定容量预留的拓扑**  
将 [describe-capacity-reservation-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservation-topology.html) 命令与 `capacity-reservation-id` 参数一起使用。输出仅包含与指定容量预留 ID 匹配的容量预留。

```
aws ec2 describe-capacity-reservation-topology \
    --region {{us-east-1}} \
    --capacity-reservation-id {{cr-1111111111example}} {{cr-2222222222example}}
```

下面是示例输出。

```
{
    "CapacityReservations": [
        {
            "CapacityReservationId": "cr-1111111111example",
            "CapacityBlockId": "null",
            "State": "active",
            "InstanceType": "p5.48xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example"
            ],
            "AvailabilityZone": "us-east-1a"
        },
        {
            "CapacityReservationId": "cr-2222222222example",
            "CapacityBlockId": "null",
            "State": "active",
            "InstanceType": "p5en.48xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example"
            ],
            "AvailabilityZone": "us-east-1a"
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

------
#### [ PowerShell ]

**描述特定容量预留的拓扑**  
使用 [Get-EC2CapacityReservationTopology](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2CapacityReservationTopology.html) cmdlet。

```
Get-EC2CapacityReservationTopology `
    -CapacityReservationId {{cr-1111111111example}} {{cr-2222222222example}}
```

------

## 示例 7：DescribeCapacityReservationTopology - 实例类型筛选条件
<a name="instance-topology-ex7"></a>

您可以按指定的实例类型（精确匹配）进行筛选，也可以按实例系列进行筛选（使用通配符）。您也可以将指定的实例类型筛选条件和实例系列筛选条件组合使用。

------
#### [ AWS CLI ]

**描述具有特定实例类型的容量预留的拓扑**  
将 [describe-capacity-reservation-topology](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservation-topology.html) 命令与 `instance-type` 筛选条件一起使用。响应包含具有特定实例类型的所有实例。

```
aws ec2 describe-capacity-reservation-topology \
    --region {{us-east-1}} \
    --filters Name=instance-type,Values={{p5en.48xlarge}}
```

下面是示例输出。

```
{
    "CapacityReservations": [
        {
            "CapacityReservationId": "cr-2222222222example",
            "CapacityBlockId": "null",
            "State": "active",
            "InstanceType": "p5en.48xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example"
            ],
            "AvailabilityZone": "us-east-1a"
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

------
#### [ PowerShell ]

**描述具有特定实例类型的容量预留的拓扑**  
使用 [Get-EC2CapacityReservationTopology](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2CapacityReservationTopology.html) cmdlet。

```
Get-EC2CapacityReservationTopology `
    -Filter @{Name="instance-type"; Values="{{p5en.48xlarge}}"}
```

------
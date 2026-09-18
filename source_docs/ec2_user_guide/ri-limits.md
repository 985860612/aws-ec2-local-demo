

# 预留实例 ID
<a name="ri-limits"></a>

您可以每月购买新的预留实例。您每月可购买的新预留实例数由每月配额决定，如下所示：



| 配额描述 | 默认配额 | 
| --- | --- | 
| 新的[区域性](apply_ri.md#apply-regional-ri)预留实例 | 每个区域每月 20 个 | 
| 新的[可用区](apply_ri.md#apply-zonal-ri)预留实例 | 每个可用区每月 20 个 | 

例如，在带有三个可用区的区域中，默认配额为每月 80 个新预留实例，计算方法如下：
+ 该区域有 20 个区域预留实例
+ 加 60 个可用区预留实例（三个可用区各有 20 个）

处于 `running` 状态的实例将计入您的限额。处于 `pending`、`stopping`、`stopped` 和 `hibernated` 状态的实例不会计入您的限额。

## 查看您已购买的预留实例数量
<a name="view-number-of-purchased-reserved-instances"></a>

您购买的预留实例数量通过 **Instance count**（实例计数）字段（控制台）或 `InstanceCount` 参数（AWS CLI）表示。当您购买新的预留实例时，配额会根据实例总数进行衡量。例如，如果您购买了实例数量为 10 的单个预留实例配置，则计入配额的购买数量为 10，而不是 1。

您可以使用 Amazon EC2 或 AWS CLI 查看已购买的预留实例数量。

------
#### [ Console ]

**查看您已购买的预留实例数量**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Reserved Instances**。

1. 从表中选择预留实例配置，然后查看 **Instance count**（实例计数）字段。

   在下列屏幕截图中，选定的行表示 `t3.micro` 实例类型的单个预留实例配置。表视图中的 **Instance count**（实例计数）列和详细信息视图中的 **Instance count**（实例计数）字段（在屏幕截图中划出）表示此配置有 10 个预留实例。  
![“预留实例”屏幕，显示实例计数列和详细信息字段。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ri-instance-count.png)

------
#### [ AWS CLI ]

**查看您已购买的预留实例数量**  
使用 [describe-reserved-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-reserved-instances.html) 命令并指定预留实例配置的 ID。

```
aws ec2 describe-reserved-instances \
    --reserved-instances-ids {{a1b2c3d4-5678-90ab-cdef-EXAMPLE11111}} \
    --output table
```

下面是示例输出。`InstanceCount` 字段表示此配置有 10 个预留实例。

```
-------------------------------------------------------------------
|                    DescribeReservedInstances                    |
+-----------------------------------------------------------------+
||                       ReservedInstances                       ||
|+----------------------+----------------------------------------+|
||  CurrencyCode        |  USD                                   ||
||  Duration            |  31536000                              ||
||  End                 |  2023-08-27T13:29:44+00:00             ||
||  FixedPrice          |  59.0                                  ||
||  InstanceCount       |  10                                    ||
||  InstanceTenancy     |  default                               ||
||  InstanceType        |  t3.micro                              ||
||  OfferingClass       |  standard                              ||
||  OfferingType        |  All Upfront                           ||
||  ProductDescription  |  Linux/UNIX                            ||
||  ReservedInstancesId |  a1b2c3d4-5678-90ab-cdef-EXAMPLE11111  ||
||  Scope               |  Region                                ||
||  Start               |  2022-08-27T13:29:45.938000+00:00      ||
||  State               |  active                                ||
||  UsagePrice          |  0.0                                   ||
|+----------------------+----------------------------------------+|
|||                      RecurringCharges                       |||
||+----------------------------------+--------------------------+||
|||  Amount                          |  0.0                     |||
|||  Frequency                       |  Hourly                  |||
||+----------------------------------+--------------------------+||
```

------
#### [ PowerShell ]

**查看您已购买的预留实例数量**  
使用 [Get-EC2ReservedInstance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ReservedInstance.html) Cmdlet 并指定预留实例配置的 ID。

```
Get-EC2ReservedInstance -ReservedInstancesId {{a1b2c3d4-5678-90ab-cdef-EXAMPLE11111}}
```

下面是示例输出。`InstanceCount` 字段表示此配置有 10 个预留实例。

```
AvailabilityZone    : 
CurrencyCode        : USD
Duration            : 31536000
End                 : 1/12/2017 8:57:08 PM
FixedPrice          : 0
InstanceCount       : 10
InstanceTenancy     : default
InstanceType        : t3.medium
OfferingClass       : standard
OfferingType        : All Upfront
ProductDescription  : Windows
RecurringCharges    : {}
ReservedInstancesId : a1b2c3d4-5678-90ab-cdef-EXAMPLE11111
Scope               : Region
Start               : 10/12/2016 4:00:00 PM
State               : active
Tags                : {}
UsagePrice          : 0
```

------

## 注意事项
<a name="ri-quota-considerations"></a>

区域性预留实例账单折扣适用于正在运行的按需型实例。默认按需型实例 限制为 20。购买区域性预留实例时，不能超出正在运行的按需型实例限制。例如，如果您已有 20 个正在运行的按需型实例，并且购买了 20 个区域性预留实例，则使用 20 个区域性预留实例将折扣应用于 20 个正在运行的按需型实例。即使您购买了更多的区域性预留实例，也无法启动更多的实例，因为已达到按需型实例限制。

在购买区域性预留实例 之前，请确保 个按需型实例 限制匹配或超出您打算拥有的区域性预留实例 的数量。如果需要，请确保在购买更多区域性预留实例 *之前*，请求增加 个按需型实例 限制。

可用区预留实例（为特定可用区域购买的预留实例）提供容量预留以及折扣。购买地区性 预留实例 时，*可以超出* 正在运行的 个按需型实例 限制。例如，如果您已有 20 个正在运行的 按需型实例，并且购买了 20 个地区性 预留实例，则可以启动另外的 20 个 按需型实例，以区配地区性 预留实例 为您提供总共 40 个正在运行的实例的规范。

## 查看您的预留实例配额并请求增加配额
<a name="view-ri-quotas"></a>

Amazon EC2 控制台提供了配额信息。您也可以请求增加配额。有关更多信息，请参阅[查看当前限额](ec2-resource-limits.md#view-limits)和[请求提高](ec2-resource-limits.md#request-increase)。


# 从现有容量预留中拆分容量
<a name="capacity-reservations-split"></a>

您可以从现有容量预留中拆分容量来创建新的预留。通过拆分容量，您可以将原始预留的一部分分配给特定工作负载或将其与其他 AWS 账户共享。例如，要与其他账户部分共享容量预留，您可以拆分部分容量以创建较小大小的容量预留。然后，可以使用 [AWS Resource Access Manager](https://docs.aws.amazon.com/ram/latest/userguide/what-is.html) 与其他账户共享较小大小的容量预留。

当您从现有容量预留中拆分容量时，系统会自动创建新容量预留。现有预留将保持不变，但由于拆分的实例数量而减少的总容量除外。在现有容量预留中运行的实例不受影响。您只能将现有预留拆分为一个新容量预留。

除标签外，新容量预留将与现有容量预留具有相同的配置。默认情况下，新容量预留没有任何标签。您可以在拆分操作期间指定新标签。如有必要，也可以在创建新容量预留之后对其进行修改。

当您指定要拆分的实例数量时，默认情况下，将首先拆分任何可用容量，然后移动任何符合条件的正在运行的实例（预留中的已用容量）。例如：如果您从具有 5 个已使用实例和 3 个可用实例的容量预留中拆分 4 个实例，则 3 个可用实例和 1 个已使用实例将拆分到新的预留中。

## 拆分容量的先决条件
<a name="capacity-reservations-split-prereq"></a>

作为先决条件，您的容量预留必须满足下面的要求：
+ 源预留必须处于活动状态。
+ 源预留必须归您的 AWS 账户所有。

**注意**  
当您通过指定大于可用容量的**拆分数量**来从预留中拆分已用容量时，只有在**容量预留规范**为 `open` 的情况下启动的实例才会被拆分。

## 注意事项
<a name="capacity-reservations-split-considerations"></a>

将容量从一个预留拆分到新的预留时，需要考虑以下事项：
+ 已用容量只能分配给具有“开放”实例资格且未与任何账户共享的容量预留。
+ 当您拆分已用容量时，系统将随机选择符合条件的实例。您无法指定拆分哪些正在运行的实例。如果找不到足够数量的合格实例来满足拆分数量，则拆分操作将失败。
+ 从现有预留中拆分的最大实例数量等于预留的大小减一。例如，如果预留总容量为 5 个实例，则最多可以将 4 个实例拆分为一个新的预留。
+ **未来日期的容量预留** – 在承诺期内，您不能拆分未来日期的容量预留的容量。
+ **容量预留资源组**：如果现有容量预留属于某个容量预留资源组，则新容量预留不会自动添加到该容量预留资源组。如有必要，可以在创建新容量预留后将其添加到容量预留资源组。
+ **共享**：如果现有容量预留与消费者账户共享，则新容量预留不会自动与消费者账户共享。如有必要，您可以在创建新容量预留后将其共享。
+ **集群置放群组**：如果现有容量预留是集群置放群组的一部分，则新容量预留将在同一个集群置放群组中创建。

**注意**  
不支持从容量块中拆分容量。

## 使用标签控制拆分容量预留的访问权限
<a name="capacity-reservations-split-permissions"></a>

您可以使用标签来控制对 Amazon EC2 资源的访问，包括从现有容量预留中拆分容量以创建新容量预留。有关更多信息，请参阅《*IAM 用户指南*》中的[使用标签控制对 AWS 资源的访问](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_tags.html)。

要使用标签控制拆分容量预留的访问权限，请确保在策略语句中同时指定资源和请求标签，因为 IAM 策略是根据源容量预留和新创建的容量预留进行评估的。以下示例策略包括带有源容量预留标签 `Owner=ExampleDepartment1` 的 `ec2:ResourceTag` 条件键和带有新创建容量预留标签 `stack=production` 的条件键 `ec2:RequestTag`。

```
{
  "Statement": [
    {
      "Sid": "AllowSourceCapacityReservation",
      "Effect": "Allow",
      "Action": "ec2:CreateCapacityReservationBySplitting",
      "Resource": "arn:aws:ec2:us-east-1:111122223333:capacity-reservation/cr-1234567890abcdef0",
      "Condition": {
        "StringEquals": {
          "ec2:ResourceTag/Owner": "ExampleDepartment1"
        }
      }
    },
    {
      "Sid": "AllowNewlyCreatedCapacityReservation",
      "Effect": "Allow",
      "Action": ["ec2:CreateCapacityReservationBySplitting", "ec2:CreateTags"],
      "Resource": "arn:aws:ec2:us-east-1:111122223333:capacity-reservation/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestTag/stack": "production"
        }
      }
    }
  ]
}
```

## 拆分容量
<a name="capacity-reservations-split-procedures"></a>

可以从现有容量预留中拆分容量来创建新的容量预留。

------
#### [ Console ]

**拆分容量**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择**容量预留**。

1. 选择具有可拆分容量的按需容量预留 ID。

1. 在**操作**、**管理容量**下，选择**拆分**。

1. 在**拆分容量预留**页面的**要拆分的数量**下，使用滑块或键入要从当前预留中拆分的实例数量。

1. （可选）为新容量预留添加标签。

1. 查看摘要，准备就绪后，选择**拆分**。

------
#### [ AWS CLI ]

**拆分容量**  
使用 `create-capacity-reservation-by-splitting` 命令。以下示例通过从指定容量预留中拆分 10 个实例来创建新的容量预留。

```
aws ec2 create-capacity-reservation-by-splitting \
    --source-capacity-reservation-id {{cr-1234567890abdef0}} \
    --instance-count {{10}}
```

------
#### [ PowerShell ]

**拆分容量**  
使用 [New-EC2CapacityReservationBySplitting](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2CapacityReservationBySplitting.html) cmdlet。以下示例通过从指定容量预留中拆分 10 个实例来创建新的容量预留。

```
New-EC2CapacityReservationBySplitting `
    -SourceCapacityReservationId {{cr-1234567890abdef0}} `
    -InstanceCount {{10}}
```

------
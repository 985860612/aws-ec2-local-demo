

# 为 EC2 实例创建置放群组
<a name="create-placement-group"></a>

您可以使用置放群组来控制实例相对于彼此的置放。创建置放群组后，您可以启动置放群组中的实例。

**限制**  
每个区域最多可创建 500 个置放群组。

------
#### [ Console ]

**创建置放群组**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Placement Groups**。

1. 选择**创建置放群组**。

1. 对于**名称**，请指定群组的名称。

1. 对于**置放策略**，为群组选择置放策略：**集群**、**分布**、**分区**或**精准时间**。

   1. 如果选择**分布**，则必须选择**分布级别**：**主机**或**机架**。

   1. 如果选择**分区**，则在**分区数**中输入该群组的分区数。

   1. 如果您选择**集群**，则可以选择指定一个父级精准时间置放群组，以确保集群置放群组中的实例在具备精准计时能力的硬件上启动。

1. （可选）要添加标签，请在**标签**下选择**添加新标签**，然后输入键和值。

1. 选择**创建群组**。

------
#### [ AWS CLI ]

使用 [create-placement-group](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-placement-group.html) 命令。

**创建集群置放群组**  
以下示例创建一个使用 `purpose` 置放策略的置放群组，并应用键为 `cluster` 且值为 `production` 的标签。

```
aws ec2 create-placement-group \
    --group-name {{my-cluster}} \
    --strategy cluster \
    --tag-specifications 'ResourceType=placement-group,Tags={Key={{purpose}},Value={{production}}}'
```

**创建以精准时间置放群组为父级的集群置放群组**  
以下示例通过 `--parent-group-id` 参数创建了一个指定父级精准时间置放群组的集群置放群组。

```
aws ec2 create-placement-group \
    --group-name {{my-cluster}} \
    --strategy cluster \
    --parent-group-id {{pg-0aaa1111111111111}}
```

**创建分区置放群组**  
以下示例创建一个使用 `partition` 置放策略的置放群组，并使用 `--partition-count` 参数指定五个分区。

```
aws ec2 create-placement-group \
    --group-name {{HDFS-Group-A}} \
    --strategy partition \
    --partition-count {{5}}
```

**创建精确时间置放群组**  
以下示例创建一个使用 `precision-time` 置放策略的置放群组。

```
aws ec2 create-placement-group \
    --group-name {{my-precision-time-pg}} \
    --strategy precision-time
```

------
#### [ PowerShell ]

使用 [New-EC2PlacementGroup](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2PlacementGroup.html) cmdlet。

**创建集群置放群组**  
以下示例创建了一个集群置放群组。

```
New-EC2PlacementGroup `
    -GroupName {{my-placement-group}} `
    -Strategy cluster
```

**创建以精准时间置放群组为父级的集群置放群组**  
以下示例通过 `-ParentGroupId` 参数创建了一个指定父级精准时间置放群组的集群置放群组。

```
New-EC2PlacementGroup `
    -GroupName {{my-placement-group}} `
    -Strategy cluster `
    -ParentGroupId {{pg-0aaa1111111111111}}
```

**创建分区置放群组**  
以下示例创建一个分区置放群组。

```
New-EC2PlacementGroup `
    -GroupName {{my-placement-group}} `
    -Strategy partition `
    -PartitionCount {{5}}
```

**创建精确时间置放群组**  
以下示例创建一个精准时间置放群组。

```
New-EC2PlacementGroup `
    -GroupName {{my-precision-time-pg}} `
    -Strategy precision-time
```

------
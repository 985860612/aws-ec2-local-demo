

# 管理受监控的标签键
<a name="managing-monitored-tag-keys"></a>

借助 Amazon EC2 容量管理器，您可以从 Amazon EC2 资源（例如 `environment` 或 `team`）中选择标签键，以便在分析容量数据时用作维度。标签键激活后，您就可以像按区域、实例类型或可用区一样，按该标签的值对指标进行分组和筛选。

每个账户最多可以监控五个标签键。容量管理器提供的标签不计入此限额。

**Topics**
+ [容量管理器提供的标签](#cm-provided-tags)
+ [标签生命周期](#tag-lifecycle)
+ [激活和停用受监控的标签键](#activate-deactivate-tag-keys)
+ [查看受监控的标签键](#view-monitored-tag-keys)
+ [使用标签维度查询指标](#query-metrics-tag-dimensions)
+ [数据导出中的标签](#tags-in-data-exports)
+ [组织和委托管理员](#tag-keys-organizations)
+ [注意事项](#tag-keys-considerations)

## 容量管理器提供的标签
<a name="cm-provided-tags"></a>

容量管理器为每个账户提供一组默认标签。这些标签不计入标签键限额。容量管理器提供的标签代表常用的分组维度，包括：
+ `aws:autoscaling:groupName`：EC2 自动扩缩组
+ `aws:eks:cluster-name`：EKS 集群名称
+ `eks:kubernetes-node-pool-name`：EKS Kubernetes 节点池
+ `karpenter.sh/nodepool`：Karpenter 节点池

容量管理器提供的标签在 `GetCapacityManagerMonitoredTagKeys` 中显示，且 `CapacityManagerProvided` 设置为 `true`，客户无法将其激活或停用。首次启用容量管理器时，容量管理器提供的标签将以 `activating` 状态开始，并在容量管理器收到包含容量管理器提供标签的第一个数据点后（通常在一到两小时内）转换为 `activated` 状态。

## 标签生命周期
<a name="tag-lifecycle"></a>

受监控的标签键会经历以下状态：


| Status | 说明 | 
| --- | --- | 
| activating | 标签键已完成注册。容量管理器正在准备为此标签收集数据。您无法使用处于此状态的标签查询指标。 | 
| activated | 正在摄取标签数据，且可通过指标 API 和数据导出进行查询。 | 
| suspended | 标签键已超过 10 万个唯一标签值的阈值。该标签仍然计入限额，但容量管理器不再为其摄取数据。如果标签值使用量持续一段时间低于阈值，标签将自动重新激活。 | 
| deactivating | 正在移除标签键。停用完成后，它将不再出现在 GetCapacityManagerMonitoredTagKeys 中。 | 

当标签处于 `suspended` 状态时，`GetCapacityManagerMonitoredTagKeys` 会返回以下状态消息：“标签因标签值过多而暂停。请减少该标签的使用量或将其停用。”

**注意**  
如果您停用一个标签键，之后重新激活同一个键，将只能查询重新激活后摄取的数据。无法访问先前激活的历史数据。每次重新激活都会重置 `EarliestDatapointTimestamp`。

## 激活和停用受监控的标签键
<a name="activate-deactivate-tag-keys"></a>

您可以激活标签键以开始将其作为维度进行监控，也可以停用不再需要的标签键。激活是异步的，标签会进入 `activating` 状态，并在容量管理器开始接收该标签的数据后转换为 `activated` 状态。停用之后，标签键将从受监控集中移除。

**注意**  
激活标签键时，仅输入键名称（例如 `environment`）。容量管理器会在对指标进行分组和筛选时自动将其用作维度。

------
#### [ Console ]

**激活或停用受监控的标签键**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量管理器**。

1. 选择**设置**选项卡。

1. 在**受监控的标签键**部分中，选择**管理标签键**。

1. 要激活标签键，请输入标签键名称，然后选择**添加**。要停用标签键，请选择该标签键，然后选择**移除**。

1. 选择**保存更改**。

------
#### [ AWS CLI ]

**激活标签键**  
使用以下命令激活一个或多个标签键：

```
aws ec2 update-capacity-manager-monitored-tag-keys \
    --activate-tag-keys "environment" "teamId"
```

输出显示了标签键及其初始状态：

```
{
    "CapacityManagerTagKeys": [
        {
            "TagKey": "environment",
            "Status": "activating"
        },
        {
            "TagKey": "teamId",
            "Status": "activating"
        }
    ]
}
```

**停用标签键**  
使用以下命令停用一个或多个标签键：

```
aws ec2 update-capacity-manager-monitored-tag-keys \
    --deactivate-tag-keys "project"
```

输出显示了更新后的状态：

```
{
    "CapacityManagerTagKeys": [
        {
            "TagKey": "project",
            "Status": "deactivating"
        }
    ]
}
```

您可以在同一个请求中同时激活和停用标签键：

```
aws ec2 update-capacity-manager-monitored-tag-keys \
    --activate-tag-keys "environment" "teamId" \
    --deactivate-tag-keys "project"
```

------

## 查看受监控的标签键
<a name="view-monitored-tag-keys"></a>

您可以查看账户中所有受监控的标签键，包括其当前状态以及数据可用的最早时间戳。

------
#### [ Console ]

**查看受监控的标签键**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量管理器**。

1. 选择**设置**选项卡。

1. 在**受监控的标签键**部分，查看标签键及其状态，以及它们是否为容量管理器提供的标签。

------
#### [ AWS CLI ]

**查看受监控的标签键**  
运行以下命令：

```
aws ec2 get-capacity-manager-monitored-tag-keys
```

输出列出了所有标签键，包括容量管理器提供的标签和客户自主管理型标签：

```
{
    "CapacityManagerTagKeys": [
        {
            "TagKey": "aws:autoscaling:groupName",
            "Status": "activated",
            "CapacityManagerProvided": true,
            "earliestDatapointTimestamp": "2026-04-08T00:00:00"
        },
        {
            "TagKey": "environment",
            "Status": "activated",
            "CapacityManagerProvided": false,
            "earliestDatapointTimestamp": "2025-08-11T22:00:00"
        }
    ]
}
```

`CapacityManagerProvided` 字段指示标签是容量管理器提供的标签 (`true`) 还是客户自主管理型标签 (`false`)。容量管理器提供的标签不计入标签键限额。`EarliestDatapointTimestamp` 指示该标签键数据可用的最早时间点。

------

## 使用标签维度查询指标
<a name="query-metrics-tag-dimensions"></a>

标签键达到 `activated` 状态后，您可以在 `GetCapacityManagerMetricDimensions` 和 `GetCapacityManagerMetricData` 中将其用作维度。

**按标签维度分组查询指标**  
使用以下命令：

```
aws ec2 get-capacity-manager-metric-dimensions \
    --group-by tag:environment account-id \
    --filter-by 'DimensionCondition={Dimension=tag:environment,Comparison=equals,Values=[prod]}'
```

当您按标签维度分组时，结果将包含账户中的所有资源，而不仅仅是带有标签的资源。没有为该标签设置值的资源将分组到一个单独的存储桶中，其值为空字符串。例如，如果账户在特定时段内使用了 800 个 vCPU 小时，但只有部分资源带有 `environment` 标签，则按 `environment` 标签键分组可能会返回：
+ `prod`：300 个 vCPU 小时
+ `staging`：200 个 vCPU 小时
+ `""`（空字符串）：没有使用 `environment` 标签的资源中的 300 个 vCPU 小时

这样可以确保所有存储桶的总量可以计入全部使用量。可以通过传递空字符串作为筛选值，以显式筛选未标记的资源：

```
--filter-by 'DimensionCondition={Dimension=tag:environment,Comparison=equals,Values=[""]}'
```

**注意**  
如果使用仍处于 `activating` 状态的标签键进行查询，查询将被拒绝并返回 400 错误。等待标签状态变为 `activated`，然后再进行查询。可以使用 `GetCapacityManagerMonitoredTagKeys` 查看检查状态。

**注意**  
对于任何提供的标签维度，如果查询的开始时间早于该维度的 `EarliestDatapointTimestamp`，该查询将被拒绝。使用 `GetCapacityManagerMonitoredTagKeys` 检查每个标签的数据何时变为可用。

## 数据导出中的标签
<a name="tags-in-data-exports"></a>

启用标签监控后，数据导出会将已激活的标签键和容量管理器提供的标签作为附加列包含在内。标签列会在所有标准列（具有 `tag:environment` 和 `tag:team` 等标题）之后显示。标签列按字母顺序排序。

导出仅包含处于 `activated` 状态的标签。容量管理器会排除处于 `activating`、`deactivating` 或 `suspended` 状态的标签。

**注意**  
如果您激活了一个新的标签键，现有的数据导出将不会自动包含该新标签。必须创建新的数据导出，才能将新激活的标签键作为一列包括在内。

## 组织和委托管理员
<a name="tag-keys-organizations"></a>

如果账户属于已启用组织级别容量管理器的 AWS Organization，每个账户（组织管理员和委托管理员）都将可以独立激活、停用和查询标签键。每个账户都需维护自己的标签状态、`EarliestDatapointTimestamp` 和标签键限额。

账户只能查询其自身已激活的标签键的指标数据。如果组织管理员和委托管理员都激活了同一个标签键（例如 `environment`），则每个账户将独立跟踪自己的激活状态和数据可用性。

当委托管理员停用某个标签键后，即使组织管理员仍激活了同一个标签键，该委托管理员也无法再查询该标签的数据。

## 注意事项
<a name="tag-keys-considerations"></a>
+ **标签值更新：**新资源的标签值和新应用于现有资源的标签值会在几小时内可用。如果您更改资源上现有标签的值，更新后的值可能需要长达 24 小时才能在容量管理器中生效。
+ **激活时间：**标签键激活后，可能需要长达 24 小时，标签才会转换为 `activated` 状态，数据才可查询。`EarliestDatapointTimestamp` 表示数据可用的时间，而不是标签激活的时间。
+ **标签键限额：**每个账户最多可以监控五个标签键。容量管理器提供的标签不计入此限额。
+ **标签键字符要求：**标签键可以包含 Unicode 字母、数字、空格及以下字符：`_ . : / = + @ -`。标签键不得超过 128 个字符。
+ **重新激活：**如果您停用并重新激活同一个标签键，则仅新数据可用。每次激活都会重置 `EarliestDatapointTimestamp`。
+ **暂停的标签：**每个标签键最多支持 10 万个唯一标签值。如果标签键超过此阈值，将变为 `suspended` 状态。该标签仍然计入限额，但不再摄取数据。请减少该标签的唯一值数量或将其停用，以便为另一个标签键腾出空间。
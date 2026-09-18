

# 在容量管理器中组织数据
<a name="capacity-manager-data-organization"></a>

容量管理器利用指标、数据点、维度、日期范围和时间段的组合来组织您的容量数据。这能够帮助您分析使用模式，并据此做出关于您的资源的明智决策。

**指标和数据点**

指标是一个按时间顺序排列的数据点集。例如，如果您想监控 vCPU 中的竞价型使用情况，则可以使用 `SpotTotalUsageHrsVcpu` 指标。

该指标每小时都会生成一个带有时间戳的数据点，以 vCPU 小时为单位的显示竞价型使用情况。例如，如果在上午 10 点时段内您使用了 100 个 vCPU，容量管理器就会创建一个数据点，其时间戳为上午 10 点，值为 100。

有关容量管理器分析的指标的完整列表，请参阅 [EC2 容量管理器指标](cm-metrics-units.md)。

**Dimensions**

维度是名称/值对，可帮助您对指标的不同方面进行分类和识别。例如，容量管理器中一个维度的名称是 AccountID，其值是实际的账户 ID。容量管理器提供了多种维度，用于对您的数据进行细分和分组，例如实例系列、预留 ARN、预留类型以及租赁。

除了内置维度之外，您还可以激活 Amazon EC2 资源中的标签键，用作自定义维度。例如，如果实例标有 `environment` 或 `team`，您可以激活这些标签键，然后根据其值对容量指标进行分组和筛选。

容量管理器还提供由其自身提供的标签，例如 EC2 自动扩缩组 (`aws:autoscaling:groupName`)、EKS 集群名称 (`aws:eks:cluster-name`)、EKS Kubernetes 节点池 (`eks:kubernetes-node-pool-name`) 和 Karpenter 节点池 (`karpenter.sh/nodepool`)，这些标签在默认情况下可用，且不计入标签键限额。

有关维度的完整列表，请参阅 [EC2 容量管理器指标](cm-metrics-units.md)。有关激活和管理标签维度的信息，请参阅[管理受监控的标签键](managing-monitored-tag-keys.md)。

**日期范围和时间段**

日期范围指定您想要分析的时间长度，从一小时到 90 天不等。时间段决定容量管理器如何跨时间点聚合您的数据，以及要返回多少个数据点。例如，如果您的日期范围为一周，而您的时间段为 1 天，那么容量管理器将返回 7 个数据点。每个数据点代表一天的聚合数据。时间段必须为一小时的整数倍，并且要能整除日期范围。

**Topics**
+ [EC2 容量管理器指标](cm-metrics-units.md)
+ [分组和筛选数据](grouping-filtering-data.md)
+ [管理受监控的标签键](managing-monitored-tag-keys.md)
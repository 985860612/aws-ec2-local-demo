

# EC2 容量管理器指标
<a name="cm-metrics-units"></a>

容量管理器提供了全面的指标供您用于追踪不同资源类型的容量情况。根据您的分析需求，可以使用不同的单位来衡量指标。

容量管理器中的指标名称使用四种不同的前缀来对所测量的容量类型进行分类：
+ `Reservation`：容量预留本身，包括总预留容量、利用率、未使用容量和预留数量。
+ `Reserved`：容量预留涵盖的按需型实例使用量。
+ `Unreserved`：在任何容量预留之外运行的按需型实例使用量。
+ `Spot`：专门针对竞价型实例的使用情况，包括实际运行时成本和预计成本。这些指标与基于预留的容量是相互独立的。

下表还提供了每个指标所对应的*可用维度*。这些维度类别具体划分如下：
+ **一般容量维度**：账户 ID、账户名称、区域、实例系列、可用区、实例类型、平台和租赁
+ **容量预留维度**：预留 ID（容量预留 ID）、预留 ARN、未使用的财务拥有者、预留类型（ODCR/容量块）、创建时间戳、开始时间戳、结束时间戳、状态和实例匹配标准。
+ **预留使用维度**：预留 ID（CRID）、预留 ARN、预留类型
+ **标签维度**：客户自主管理型标签键和容量管理器提供的标签。必须先激活标签键，然后才能将其用作维度。有关更多信息，请参阅 [管理受监控的标签键](managing-monitored-tag-keys.md)。


| 指标 | 说明 | 可用维度 | 可用单位 | 
| --- | --- | --- | --- | 
| ReservationAvgCommittedSize | 处于活动或计划状态且有承诺保障的容量的平均总量。大小按各个维度相加后，再按时间平均计算得出。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationAvgFutureSize | 选定时段内，计划在未来启动但尚未生效的容量预留的平均数量。大小按各个维度相加后，再按时间平均计算得出。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationAvgUtilization | 选定时段内已使用的预留容量的平均百分比。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationMaxCommittedSize | 处于活动或计划状态且有承诺保障的最大总容量。大小按各个维度相加后，再取该时段的最大值。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationMaxFutureSize | 选定时段内，计划在未来启动但尚未生效的容量预留的最大数量。大小按各个维度相加后，再取该时段的最大值。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationMaxSize | 在所选时间段内，您的容量预留在任何时间点达到的最大值。预留 ID 为必填项。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationMaxUnusedSize | 在所选时间段内，您的容量预留在任何时间点的未使用容量最大值。预留 ID 为必填项。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationMaxUtilization | 在所选时间段内，您的容量预留在任何时间点达到的最大利用率百分比。预留 ID 为必填项。 | 一般容量和容量预留维度 |  | 
| ReservationMinCommittedSize | 处于活动或计划状态且有承诺保障的容量的最小总量。大小按各个维度相加后，再取该时段的最小值。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationMinFutureSize | 选定时段内，计划在未来任何时间点启动但尚未生效的容量预留的最小数量。大小按各个维度相加后，再取该时段的最小值。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationMinSize | 在所选时间段内，您的容量预留在任何时间点达到的最小值。预留 ID 为必填项。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationMinUnusedSize | 在所选时间段内，您的容量预留在任何时间点的未使用容量最小值。预留 ID 为必填项。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationMinUtilization | 在所选时间段内，您的容量预留在任何时间点达到的最小利用率百分比。预留 ID 为必填项。 | 一般容量和容量预留维度 |  | 
| ReservationTotalCapacityHrs | 您在选定时段内您通过容量预留所预留的总容量。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationTotalCount | 您在选定时段内拥有的不同容量预留总数。 | 一般容量和容量预留维度 |  | 
| ReservationTotalEstimatedCost | 所选时段内预留的总容量小时数的预估成本。 | 一般容量和容量预留维度  |  | 
| ReservationUnusedTotalCapacityHrs | 在选定时段内您所拥有但未使用的总预留容量。 | 一般容量和容量预留维度 | vCPU、实例 | 
| ReservationUnusedTotalEstimatedCost | 您在选定时段内拥有但未使用的预留容量的预估成本（根据按需费率计算得出）。 | 一般容量和容量预留维度 |  | 
| ReservedTotalEstimatedCost | 在选定时段内，由容量预留所覆盖的按需型实例的预估成本。这不包括竞价型实例使用量。 | 一般容量和容量使用维度 |  | 
| ReservedTotalUsageHrs | 在选定时段内，由容量预留所覆盖的按需型实例的总使用时长。这不包括竞价型实例使用量。 | 一般容量和容量使用维度 | vCPU、实例 | 
| SpotAvgRunTimeBeforeInterruption | 所选时段内中断的实例的平均运行时间（以小时为单位）。 | 仅限区域、可用区和账户 ID 维度 | 实例 | 
| SpotInterruptionRate | 所选时段内中断的正在运行的竞价型实例的百分比。 | 仅限区域、可用区和账户 ID 维度 | vCPU、实例 | 
| SpotMaxRunTimeBeforeInterruption | 所选时段内中断的实例的最大运行时间（以小时为单位）。 | 仅限区域、可用区和账户 ID 维度 | 实例 | 
| SpotMinRunTimeBeforeInterruption | 所选时段内中断的实例的最小运行时间（以小时为单位）。 | 仅限区域、可用区和账户 ID 维度 | 实例 | 
| SpotTotalCount | 所选时段内运行的竞价型实例或 vCPU 的数量。 | 仅限区域、可用区和账户 ID 维度 | vCPU、实例 | 
| SpotTotalEstimatedCost | 选定时段内竞价型实例的预估使用成本（使用公布的竞价型实例费率计算）。 | 一般容量维度 |  | 
| SpotTotalInterruptions | 所选时段内中断的竞价型实例或 vCPU 的数量。 | 仅限区域、可用区和账户 ID 维度 | vCPU、实例 | 
| SpotTotalUsageHrs | 选定时段内竞价型实例的总使用小时数。 | 一般容量维度 | vCPU、实例 | 
| UnreservedTotalEstimatedCost | 在选定时段内，容量预留未覆盖的按需型实例的预估成本。这不包括竞价型实例使用量。 | 一般容量维度 |  | 
| UnreservedTotalUsageHrs | 在选定时段内，容量预留未覆盖的按需型实例的总使用时长。这不包括竞价型实例使用量。 | 一般容量维度 | vCPU、实例 | 

**注意**  
如果您在单位中包含了实例，我们建议您在维度中也包含实例类型。

## 标签维度
<a name="tag-dimensions"></a>

除了上一节中的内置维度外，容量管理器还支持标签维度。借助标签维度，您可以使用 Amazon EC2 资源中的标签键对指标进行分组和筛选。

**客户自主管理型标签维度**

最多可以激活五个标签键用作维度。激活并处于 `activated` 状态后，标签维度可用于支持一般容量维度的指标。有关维度类别的完整列表，请参阅 [EC2 容量管理器指标](#cm-metrics-units)。


| 维度 | 说明 | 示例值 | 
| --- | --- | --- | 
| 标签键名称 | Amazon EC2 资源中的客户自主管理型标签键。 | environment, team, cost-center | 

**容量管理器提供的标签维度**

容量管理器默认提供以下内置标签。容量管理器提供的标签将始终可用，且不计入标签键限额。


| 维度 | 说明 | 
| --- | --- | 
| tag:aws:autoscaling:groupName | 与实例关联的 EC2 自动扩缩组名称。 | 
| tag:aws:eks:cluster-name | 与实例关联的 EKS 集群名称。 | 
| tag:eks:kubernetes-node-pool-name | 与实例关联的 EKS Kubernetes 节点池。 | 
| tag:karpenter.sh/nodepool | 与实例关联的 Karpenter 节点池。 | 

**注意**  
当您按标签维度分组时，没有为该标签设置值的资源将包含在一个单独的存储桶中，其值为空字符串。这样可以确保所有资源都计入总计。
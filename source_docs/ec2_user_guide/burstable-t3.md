

# Amazon EC2 专属主机上的可突发 T3 实例
<a name="burstable-t3"></a>

专属主机支持突增性能 T3 实例。T3 实例提供了在专用硬件上使用符合条件的 BYOL 许可证软件的经济高效的方式。T3 实例较小的 vCPU 占用空间使您能够在更少的主机上整合工作负载，并最大限度地提高每核心许可利用率。

T3 专属主机最适合运行具有低到中等 CPU 利用率的 BYOL 软件。这包括符合条件的按插槽、按内核或按虚拟机授权的软件许可证，例如 Windows Server、Windows 桌面、SQL Server、SUSE Enterprise Linux Server、Red Hat Enterprise Linux 和 Oracle 数据库。适用 T3 专属主机的工作负载示例包括中小型数据库、虚拟桌面、开发和测试环境、代码存储库以及产品原型。不建议使用 T3 专属主机用于持续高 CPU 利用率的工作负载或同时出现相关 CPU 突发的工作负载。

专属主机上的 T3 实例使用与共享租赁硬件上的 T3 实例相同的信用模型。但是，它们支持 `standard` 信用模式；不支持 `unlimited` 积分模式。在 `standard` 模式下，专属主机上的 T3 实例*赚取*、*消耗*和*累积*服务抵扣金，其方式与共享租赁硬件上的突增实例相同。突增实例具有在基准 CPU 性能，并能够在需要时提升到基准水平之上。为了突增到基准以上，实例会花费在其 CPU 积分余额中累积的积分。当累积积分耗尽时，CPU 利用率将降低到基准水平。有关 `standard` 模式的更多信息，请参阅 [标准可突增性能实例的工作原理](burstable-performance-instances-standard-mode-concepts.md#how-burstable-performance-instances-standard-works)。

T3 专属主机支持 Amazon EC2 专属主机提供的所有功能，包括单个主机上的多个实例大小、主机 Resource Groups 和 BYOL。

**支持的 T3 实例大小和配置**  


T3 专属主机通过提供基准 CPU 性能和在需要时突发到更高级别的能力来运行通用的可爆发 T3 实例，这些实例共享主机的 CPU 资源。这使得拥有 48 个核心的 T3 专属主机能够支持每台主机最多 192 个实例。为了有效使用主机的资源并提供最佳实例性能，Amazon EC2 实例放置算法会自动计算可在主机上启动的受支持实例数量和实例大小组合。

T3 专属主机支持同一主机上的多个实例类型。专属主机上不是支持所有 T3 实例。您可以运行不同的 T3 实例组合，直到主机的 CPU 限制为止。

下表列出了支持的实例类型，总结了每种实例类型的性能，并指出了每种大小可以启动的最大实例数。


| 实例类型 | vCPU | 内存（GiB） | 每个 vCPU 的基准 CPU 利用率 | 网络突增带宽 (Gbps) | Amazon EBS 突增带宽 (Mbps) | 每个专属主机的最大实例数 | 
| --- | --- | --- | --- | --- | --- | --- | 
| t3.nano | 2 | 0.5 | 5% | 5 | 最多 2,085 | 192 | 
| t3.micro | 2 | 1 | 10% | 5 | 最多 2,085 | 192 | 
| t3.small | 2 | 2 | 20% | 5 | 最多 2,085 | 192 | 
| t3.medium | 2 | 4 | 20% | 5 | 最多 2,085 | 192 | 
| t3.large | 2 | 8 | 30% | 5 | 2,780 | 96 | 
| t3.xlarge | 4 | 16 | 40% | 5 | 2,780 | 48 | 
| t3.2xlarge | 8 | 32 | 40% | 5 | 2,780 | 24 | 

**监控 T3 专属主机的 CPU 利用率**  
您可以使用 `DedicatedHostCPUUtilization` Amazon CloudWatch 指标，用于监控专属主机的 vCPU 利用率。`EC2` 命名空间和 `Per-Host-Metrics` 维度中可用指标。有关更多信息，请参阅 [专属主机指标](viewing_metrics_with_cloudwatch.md#dh-metrics)。
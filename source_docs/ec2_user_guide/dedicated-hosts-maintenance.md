

# Amazon EC2 专属主机的主机维护
<a name="dedicated-hosts-maintenance"></a>

借助主机维护功能，在专属主机出现性能降级的极少见情况下，Amazon EC2 会自动将该主机上运行的实例迁移到运行正常的替代专属主机上。这有助于尽可能减少工作负载的停机时间，并简化专属主机的管理。此外，还会针对计划内和例行的 Amazon EC2 维护，执行主机维护。

Amazon EC2 支持两种类型的主机维护：
+ **实时迁移主机维护** – 实例将在 24 小时内自动迁移到替换主机，而无需停止和重新启动实例。
+ **基于重启的主机维护** – 将实例列入*实例重启*计划事件，实例将在该计划事件期间自动停止并在替换主机上重新启动。

**Topics**
+ [主机维护与主机恢复](#dedicated-hosts-maintenance-differences)
+ [注意事项](#dedicated-hosts-maintenance-basics-limitations)
+ [相关服务](#dedicated-hosts-maintenance-related)
+ [定价](#dedicated-hosts-maintenance-pricing)
+ [Amazon EC2 专属主机的主机维护工作原理](dedicated-hosts-maintenance-basics.md)
+ [配置 Amazon EC2 专属主机的主机维护设置](dedicated-hosts-maintenance-configuring.md)

## 主机维护与主机恢复
<a name="dedicated-hosts-maintenance-differences"></a>

下表显示了主机恢复与主机维护之间的主要区别。



|  | 主机恢复 | 主机维护 | 
| --- | --- | --- | 
| 实例的可连接性 | 无法访问 | 可以访问 | 
| 专属主机状态 | under-assessment | permanent-failure | 
| 主机资源组 | 支持 | 不支持 | 

有关主机恢复的更多信息，请参阅[主机恢复](dedicated-hosts-recovery.md)。

## 注意事项
<a name="dedicated-hosts-maintenance-basics-limitations"></a>
+ 主机维护功能已在除中国区域和 AWS GovCloud (US) Regions 的所有 AWS 区域 开放。
+ AWS Outposts、AWS Local Zone 和 AWS Wavelength Zone 不支持主机维护。
+ 无法为已经位于主机资源组中的主机开启或关闭主机维护。添加到主机资源组的主机保留其主机维护设置。有关更多信息，请参阅[主机资源组](https://docs.aws.amazon.com/license-manager/latest/userguide/host-resource-groups.html)。
+ 以下实例类型具有实例存储根卷，因此不支持主机维护功能：C1、C3、D2、I2、M1、M2、M3、R3 和 X1。

## 相关服务
<a name="dedicated-hosts-maintenance-related"></a>

专属主机与**AWS License Manager** 集成 – 跨 Amazon EC2 专属主机跟踪许可证（仅在提供 AWS License Manager 的区域支持跟踪）。有关更多信息，请参阅 [AWS License Manager 用户指南](https://docs.aws.amazon.com/license-manager/latest/userguide/license-manager.html)。

AWS 账户 必须具备足够许可证才能使用新专属主机。在计划事件完成后释放主机时，与性能降级主机关联的许可证也将被释放。

## 定价
<a name="dedicated-hosts-maintenance-pricing"></a>

使用主机维护不会产生额外费用，但会收取正常的专属主机费用。有关更多信息，请参阅 [Amazon EC2 专属主机定价](https://aws.amazon.com/ec2/dedicated-hosts/pricing/)。

启动主机维护后，不再对降级专属主机计费。仅在进入 `available` 状态后，才会开始对替换专属主机计费。

如果降级的专属主机使用按需费率计费，则替换的专属主机也将用按需费率计费。如果降级专属主机具有有效专属主机预留，则会将其转移到新专属主机。


# Amazon EC2 专属主机恢复
<a name="dedicated-hosts-recovery"></a>

如果在专属主机上检测到具有特定问题的条件，专属主机恢复自动在新的替换主机上重新启动实例。主机恢复减少了人工干预的需求，并降低了发生关于系统电源或网络连接的意外专属主机故障时的运营负担。其它专属主机问题需要进行手动干预才能从中恢复。

**Topics**
+ [主机恢复的工作原理](dedicated-hosts-recovery-basics.md)
+ [支持的实例类型](#dedicated-hosts-recovery-instances)
+ [定价](#dedicated-hosts-recovery-pricing)
+ [管理主机恢复](dedicated-hosts-recovery-enable.md)
+ [查看主机恢复设置](dedicated-hosts-recovery-view.md)
+ [手动恢复不支持的实例](dedicated-hosts-recovery-unsupported.md)

## 支持的实例类型
<a name="dedicated-hosts-recovery-instances"></a>

以下实例系列支持主机恢复：
+ **通用型：**A1 \| M3 \| M4 \| M5 \| M5n \| M5zn \| M6a \| M6g \| M6i \| T3 \| Mac1 \| Mac2 \| Mac2-m1ultra \| Mac2-m2 \| Mac2-m2pro \| M6in \| M7a \| M7g \| M7i \| Mac-m4 \| Mac-m4pro \| Mac-m4max \| Mac-m3ultra
+ **计算优化型：**C3 \| C4 \| C5 \| C5n \| C6a \| C6g \| C6i \| C6gn \| C6in \| C7g \| C7gn \| C7i
+ **内存优化型：**R3 \| R4 \| R5 \| R5b \| R5n \| R6g \| R6i \| U-6tb1 \| U-9tb1 \| U-12tb1 \| U-18tb1 \| U-24tb1 \| X1 \| X1e \| X2iezn \| R6a \| R6in \| R7g \| R7i \| R7iz
+ **加速计算型：**Inf1 \| G3 \| G5g \| P3

要恢复不支持的实例，请参阅[手动恢复 Amazon EC2 专属主机恢复不支持的实例](dedicated-hosts-recovery-unsupported.md)。

**注意**  
与非裸机实例类型相比，受支持的裸机实例类型的专属主机的自动恢复将需要更长时间来进行检测和恢复。

## 定价
<a name="dedicated-hosts-recovery-pricing"></a>

使用主机恢复不会收取额外的费用，但会收取正常的专属主机费用。有关更多信息，请参阅 [Amazon EC2 专属主机定价](https://aws.amazon.com/ec2/dedicated-hosts/pricing/)。

一旦启动了主机恢复，将不再对受损专属主机计费。仅在进入 `available` 状态后，才会开始对替换专属主机计费。

如果使用按需费率对受损专属主机进行计费，还会使用按需费率对替换专属主机进行计费。如果受损专属主机具有有效专属主机预留，则会将其转移到替换专属主机。
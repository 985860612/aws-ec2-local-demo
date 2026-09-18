

# 竞价型实例中断
<a name="spot-interruptions"></a>

您可以在空闲的 EC2 容量上启动竞价型实例，以便在 Amazon EC2 需要收回这些容量时，就返还实例获得大幅折扣。我们将 Amazon EC2 回收竞价型实例的情况称为竞价型实例*中断*。

对竞价型实例的需求可能因时间不同而有显著的差异，竞价型实例 的可用性也会因为有多少未使用 EC2 实例可用而差别巨大。竞价型实例可能会中断。下面列出了 Amazon EC2 中断您的竞价型实例的可能原因：

**容量**  
Amazon EC2 可以在需要收回时中断 Spot 实例。EC2 回收您的实例主要是为了重新调整容量用途，但也可能出于其他原因，如主机维护或硬件停用。

**Price**  
Spot 价格高于您的最高价格。  
您可以在竞价型请求中指定最高价格。但如果您指定了某个最高价，则实例被中断的频率将比您未指定时更高。

**约束**  
如果您的竞价型请求包含约束（如启动组或可用区组），则当不再满足约束时，这些竞价型实例将成组终止。

当 Amazon EC2 中断竞价型实例时，它会终止、停止或休眠实例，具体取决于您在创建 Spot 请求时指定的中断行为。

**Topics**
+ [中断行为](interruption-behavior.md)
+ [准备中断](prepare-for-interruptions.md)
+ [启动中断](initiate-a-spot-instance-interruption.md)
+ [竞价型实例中断通知](spot-instance-termination-notices.md)
+ [查找中断的竞价型实例](finding-an-interrupted-Spot-Instance.md)
+ [确定 Amazon EC2 是否终止了竞价型实例](BidEvictedEvent.md)
+ [计费](billing-for-interrupted-spot-instances.md)
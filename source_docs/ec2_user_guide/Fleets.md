

# EC2 实例集和竞价型实例集
<a name="Fleets"></a>

EC2 实例集和竞价型实例集非常实用，可在单次操作中启动几十、几百或几千个 Amazon EC2 实例的实例集。实例集中的每个实例由[启动模板](ec2-launch-templates.md)或您在启动时手动配置的启动参数集配置。

**Topics**
+ [功能和优势](#ec2-fleet-features-and-benefits)
+ [哪种是实例集最佳使用方法？](which-fleet-method-to-use.md)
+ [EC2 实例集或竞价型实例集配置选项](ec2-fleet-configuration-strategies.md)
+ [使用 EC2 实例集](manage-ec2-fleet.md)
+ [使用竞价型实例集](work-with-spot-fleets.md)
+ [监控 EC2 实例集或竞价型实例集](fleet-monitor.md)
+ [EC2 实例集的教程](fleet-tutorials.md)
+ [EC2 实例集 CLI 配置示例](ec2-fleet-examples.md)
+ [竞价型实例集 CLI 配置示例](spot-fleet-examples.md)
+ [EC2 实例集和竞价型实例集的限额](fleet-quotas.md)

## 功能和优势
<a name="ec2-fleet-features-and-benefits"></a>

实例集提供以下功能和优势，让您能够在多个 EC2 实例上运行应用程序时，最大限度地节省成本并优化可用性和性能。

**多种实例类型**  
一个实例集可以启动多种实例类型，避免依赖一种实例类型的可用性。这可以提高实例集中实例的总体可用性。

**在可用区之间分配实例**  
一个实例集可以启动到多个可用区，从而使您能够降低成本并提高可用性。如果您的实例集包含竞价型实例，则实例集会根据您对价格和中断的偏好自动选择可用区。

**多种购买选项**  
一个实例集可以启动多种购买选项（竞价型实例和按需型实例），以便让您通过竞价型实例的使用来优化成本。您还可以将预留实例和节省计划折扣与实例集中的按需型实例结合使用，从而享受这些折扣。

**自动替换竞价型实例**  
如果实例集包含竞价型实例，则当竞价型实例中断时，可以自动请求替换竞价型容量。通过[容量再平衡](ec2-fleet-capacity-rebalance.md)功能，实例集还可以监控和主动替换中断风险较高的竞价型实例。

**预留按需型容量**  
实例集可以使用[按需容量预留](ec2-fleet-on-demand-capacity-reservations.md)来预留按需型容量。实例集还可以包含[适用于机器学习的容量块](ec2-capacity-blocks.md)，让您能在未来某个日期预留 GPU 实例，从而支持短期机器学习（ML）工作负载。
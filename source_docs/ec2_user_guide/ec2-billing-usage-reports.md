

# 了解账单和使用情况报告中的 Amazon EC2 代码
<a name="ec2-billing-usage-reports"></a>

当您使用 Amazon EC2 时，我们会在您的 AWS 账单和使用情况报告中包含相关代码。查看这些代码有助于您了解 Amazon EC2 的成本和使用模式。跟踪和管理您的支出对于优化成本至关重要。

下表描述您的账单和使用情况报告中出现的 Amazon EC2 代码。有关账单和使用情况报告中使用的区域代码列表，请参阅 [AWS Region billing codes](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-region-billing-codes.html)。

**Topics**
+ [实例](#instances-billing-usage-reports)
+ [裸机实例](#bare-metal-instances-billing-usage-reports)
+ [专属主机](#dedicated-hosts-billing-usage-reports)
+ [Dedicated Instances](#dedicated-instances-billing-usage-reports)
+ [EBS 优化](#ebs-billing-usage-reports)
+ [容量预留](#capacity-reservation-billing-usage-reports)

**相关资源**
+ [Amazon EC2 账单和购买选项](instance-purchasing-options.md)
+ [了解 AMI 账单信息](ami-billing-info.md)
+ [Amazon EC2 定价](https://aws.amazon.com/ec2/pricing/)

## 实例
<a name="instances-billing-usage-reports"></a>


| 代码 | 描述 | 单位 | 
| --- | --- | --- | 
| {{region}}-BoxUsage:{{instance-type}} | 按需型实例的运行时间。 | Hours | 
| {{region}}-HostBoxUsage:{{instance-type}} | 专属主机上实例的运行时间。 | Hours | 
| {{region}}-SpotUsage:{{instance-type}} | 竞价型实例的运行时间。 | Hours | 



## 裸机实例
<a name="bare-metal-instances-billing-usage-reports"></a>


| 代码 | 描述 | 单位 | 
| --- | --- | --- | 
| {{region}}-BoxUsage:{{instance-family}}.metal | 裸机按需型实例的运行时间。 | Hours | 
| {{region}}-HostBoxUsage:{{instance-family}}.metal | 专属主机上裸机实例的运行时间。 | Hours | 
| {{region}}-SpotUsage:{{instance-family}}.metal | 裸机竞价型实例的运行时间。 | Hours | 



## 专属主机
<a name="dedicated-hosts-billing-usage-reports"></a>


| 代码 | 描述 | 单位 | 
| --- | --- | --- | 
| {{region}}-HostUsage:{{host-type}} | 预置专属主机的时间。 | Hours | 
| {{region}}-ReservedHostUsage:{{host-type}} | 应用专属主机预留的时间。 | Hours | 



## Dedicated Instances
<a name="dedicated-instances-billing-usage-reports"></a>


| 代码 | 描述 | 单位 | 
| --- | --- | --- | 
| {{region}}-DedicatedUsage:{{instance-type}} | 专用实例的运行时间。 | 小时 \+ 每个区域的费用 | 



## EBS 优化
<a name="ebs-billing-usage-reports"></a>


| 代码 | 描述 | 单位 | 
| --- | --- | --- | 
| {{region}}-EBSOptimized:{{instance-type}} | 启用 EBS 优化的时间。 | Hours | 



## 容量预留
<a name="capacity-reservation-billing-usage-reports"></a>


| 代码 | 描述 | 单位 | 
| --- | --- | --- | 
| {{region}}-Reservation:{{instance-type}} | 容量预留的预留实例时间。 | Hours | 
| {{region}}-UnusedBox:{{instance-type}} | 容量预留的未使用预留实例时间。 | Hours | 
| {{region}}-DedicatedRes:{{instance-type}} | 专用容量预留的预留实例时间。 | Hours | 
| {{region}}-UnusedDed:{{instance-type}} | 专用容量预留的未使用预留实例时间。 | Hours | 


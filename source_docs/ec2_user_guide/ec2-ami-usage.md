

# 管理和监控 AMI 使用情况
<a name="ec2-ami-usage"></a>

AWS 提供了多种功能来帮助您有效地管理和监控 AMI 使用情况。您可以跟踪哪些账户正在使用共享 AMI，确定 AMI 的上次使用时间，以及发现 AWS 账户中哪些资源正在引用特定的 AMI。

下表概括介绍了用于管理和监控 AMI 使用情况的功能：


| 功能 | 使用案例 | 主要优势 | 
| --- | --- | --- | 
| [AMI 使用情况报告](your-ec2-ami-usage.md) | 了解哪些 AWS 账户正在使用您的 AMI 以及每个 AMI 的使用量。 |  +  识别引用 AMI 的 AWS 账户和资源类型，以便您可以安全地取消注册或禁用 AMI。 <br />+  识别未使用的 AMI 以取消注册，从而降低存储成本。 <br />+  识别最常用的 AMI。   | 
| [上次使用的跟踪](ami-last-launched-time.md) | 检查上次使用 AMI 的时间。 |  +  识别未使用的 AMI，以便您可以安全地取消注册 AMI。 <br />+  识别未使用的 AMI 以取消注册，从而降低存储成本。   | 
| [AMI 引用检查](ec2-ami-references.md) | 确保 AWS 资源使用最新的合规 AMI。 |  +  审核您账户中 AMI 的使用情况。 <br />+  检查引用特定 AMI 的位置。 <br />+  通过更新资源以引用最新的 AMI 来保持合规性。   | 

**Topics**
+ [查看 AMI 使用情况](your-ec2-ami-usage.md)
+ [检查上次使用 Amazon EC2 AMI 的时间](ami-last-launched-time.md)
+ [识别引用指定 AMI 的资源](ec2-ami-references.md)
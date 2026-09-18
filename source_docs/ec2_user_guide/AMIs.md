

# Amazon EC2 中的亚马逊机器映像
<a name="AMIs"></a>

亚马逊机器映像（AMI）是一个映像，它提供设置和启动 Amazon EC2 实例所需的软件。每个 AMI 还包含块设备映射，指定要附加到启动的实例的块设备。在启动实例时，您必须指定 (AMI)。AMI 必须与您为实例选择的实例类型兼容。您可以使用 AWS 提供的 AMI、公共 AMI、其他人与您共享的 AMI 或从 AWS Marketplace 购买的 AMI。

AMI 特定于以下各项：
+ 区域
+ 操作系统
+ 处理器架构
+ 根卷类型
+ 虚拟化类型

在需要具有相同配置的多个实例时，您可以从单个 AMI 启动多个实例。在需要不同的配置的实例时，您可以使用其他 AMI 启动实例，如下图中所示。

![从一个 AMI 上启动多个实例。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/launch-from-ami.png)


您可以从 Amazon EC2 实例创建 AMI，然后使用它启动具有相同配置的实例。您可以将 AMI 复制到另一个 AWS 区域，然后使用它在该区域中启动实例。您还可以与其他账户共享您创建的 AMI，以便他们可以启动具有相同配置的实例。您可以使用 AWS Marketplace 销售 AMI。

**Topics**
+ [AMI 特征](ComponentsAMIs.md)
+ [查找 AMI](finding-an-ami.md)
+ [AWS Marketplace 中的付费 AMI](paid-amis.md)
+ [AMI 周期](ami-lifecycle.md)
+ [启动模式](ami-boot.md)
+ [AMI 加密](AMIEncryption.md)
+ [共享 AMI](sharing-amis.md)
+ [监控 AMI 事件](monitor-ami-events.md)
+ [了解 AMI 账单](ami-billing-info.md)
+ [AMI 限额](ami-quotas.md)
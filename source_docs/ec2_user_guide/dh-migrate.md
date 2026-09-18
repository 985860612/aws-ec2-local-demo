

# 迁移到基于 Nitro 的 Amazon EC2 专属主机
<a name="dh-migrate"></a>

Nitro 系统是由 AWS 打造的硬件和软件组件集合，可实现高性能、高可用性和高安全性。与基于 Xen 的专属主机相比，基于 Nitro 的专属主机具有更高的性价比。如果您的账户中有任何基于 Xen 的专属主机，我们建议您将工作负载迁移到基于 Nitro 的专属主机。有关更多信息，请参阅 [AWS Nitro 系统](https://aws.amazon.com/ec2/nitro/)。

要从基于 Xen 的专属主机迁移到基于 Nitro 的专属主机，需要将专属主机上基于 Xen 的实例迁移到基于 Nitro 的实例类型，分配新的基于 Nitro 的专属主机，然后将迁移的基于 Nitro 的实例移动到基于 Nitro 的新专属主机。

本主题提供了从基于 Xen 的专属主机迁移到基于 Nitro 的专属主机的详细步骤。

**Topics**
+ [步骤 1：确定基于 Xen 的专属主机](#identify-xen-hosts)
+ [步骤 2：将基于 Xen 的实例迁移到基于 Nitro 的实例类型](#migrate-dh-instances)
+ [步骤 3：分配基于 Nitro 的专属主机](#allocate-nitro-host)
+ [步骤 4：将迁移的实例移动至新的基于 Nitro 的专属主机](#move-instances)
+ [步骤 5：释放未使用的基于 Xen 的专属主机](#release-xen-instances)

## 步骤 1：确定基于 Xen 的专属主机
<a name="identify-xen-hosts"></a>

以下专属主机基于 Xen，有资格迁移到基于 Nitro 的专属主机。
+ **通用型：**M3 \| M4
+ **计算优化型：**C3 \| C4
+ **内存优化型**：R3 \| R4 \| X1 \| X1e
+ **存储优化型**：D2 \| H1 \| I2 \| I3
+ **加速计算型**：G3 \| P3

**检查您的账户中是否有基于 Xen 的专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 在**搜索字段**中，使用**实例系列**筛选条件搜索上述基于 Xen 的专属主机。例如，*实例系列 = m3*。

## 步骤 2：将基于 Xen 的实例迁移到基于 Nitro 的实例类型
<a name="migrate-dh-instances"></a>

在基于 Xen 的专属主机上运行的实例也基于 Xen。必须先将这些实例迁移到基于 Nitro 的实例类型，然后才能将其移动至基于 Nitro 的专属主机。

**重要**  
在开始迁移实例之前，我们建议您对数据进行备份。有关更多信息，请参阅 [Create multi-volume Amazon EBS snapshots from an Amazon EC2 instance](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-create-snapshots.html)。

**查找在基于 Xen 的专属主机上运行的实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 选择要迁移的基于 Xen 的主机，然后选择**正在运行的实例**选项卡。该选项卡列出了在选定主机上运行的所有实例。

要迁移 **Linux 实例**，请参阅[Amazon EC2 实例类型更改](ec2-instance-resize.md)。

要迁移 **Windows 实例**，请参阅[将 EC2 Windows 实例迁移到基于 Nitro 的实例类型](migrating-latest-types.md)。

**注意**  
确保将您的实例迁移到与您打算迁移到的基于 Nitro 的专属主机相匹配的实例类型。例如，如果您打算迁移到 M7i 专属主机，请确保将实例迁移到 M7i 实例类型。

## 步骤 3：分配基于 Nitro 的专属主机
<a name="allocate-nitro-host"></a>

**查找支持的基于 Nitro 的专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例类型**。

1. 应用以下筛选条件：
   + *虚拟机监控程序 = nitro*
   + *专属主机支持 = true*

找到合适的基于 Nitro 的实例类型后，请[分配新的专属主机](dedicated-hosts-allocating.md)。

## 步骤 4：将迁移的实例移动至新的基于 Nitro 的专属主机
<a name="move-instances"></a>

分配基于 Nitro 的专属主机且主机状态变为 `available` 后，您可以将之前迁移到基于 Nitro 的实例类型的实例移动至新专属主机。

**将您的实例移动至基于 Nitro 的新专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航面板中，选择**实例**。

1. 选择您迁移的实例，然后依次选择**操作**、**实例设置**、**修改实例置放**。

1. 对于**目标专属主机**，选择基于 Nitro 的新专属主机，然后选择**保存**。

1. 重新启动实例。选择实例，然后依次选择**实例状态**、**开始实例**。

## 步骤 5：释放未使用的基于 Xen 的专属主机
<a name="release-xen-instances"></a>

将工作负载从基于 Xen 的专属主机迁移到基于 Nitro 的新专属主机后，如果您不再需要它，则可以[释放基于 Xen 的专属主机](dedicated-hosts-releasing.md)。
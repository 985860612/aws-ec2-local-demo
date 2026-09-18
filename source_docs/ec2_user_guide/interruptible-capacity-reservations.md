

# 可中断容量预留
<a name="interruptible-capacity-reservations"></a>

可中断容量预留可帮助您将未使用的容量临时用于您的账户中的其他工作负载。这使您可以获得控制权，以在需要时回收容量。当您回收容量时，在可中断预留内运行的所有实例都将被终止。创建可中断预留后，您可以使用 AWS Resource Access Manager（RAM）与其他 AWS 账户或您的 AWS 组织共享该预留。

如果您在非高峰时段、部署间隙或工作负载缩减时拥有未使用的预留容量，请使用可中断容量预留。如果您知道另一个团队可以使用此容量，则可以通过创建可中断容量预留来使其可用。当您的关键工作负载需要恢复容量时，您可以回收该容量。

您可以将可中断容量预留用作以下对象之一：
+ **容量所有者**：您拥有源容量预留并创建可中断容量预留，以与其他团队共享未使用的容量，同时保留控制权，以便在需要时回收该容量。
+ **容量使用者**：您将实例启动到共享的可中断预留中，但须知，当所有者回收容量时，您的实例可能会被终止。

**Topics**
+ [工作原理](#how-interruptible-cr-works)
+ [计费](#interruptible-cr-billing)
+ [注意事项](#interruptible-cr-considerations)
+ [容量所有者的可中断容量预留](capacity-owner-procedures.md)
+ [容量使用者的可中断容量预留](capacity-consumer-procedures.md)
+ [使用 EventBridge 和 CloudTrail 监控可中断容量预留](monitor-interruptible-cr.md)

## 工作原理
<a name="how-interruptible-cr-works"></a>

要将未使用的容量提供给其他团队，请通过指定要从源预留共享的未使用实例数量来创建可中断预留。当您创建可中断预留时，我们会将这些实例从您的源预留转移到您账户中新的可中断预留。

我们会保留源预留和可中断容量预留之间的关联。因此，当您回收容量时，所有正在运行的使用者实例都将被终止，并且容量将恢复到原始源预留。

主要功能：
+ 让未使用的容量暂时可用，同时保持控制权以回收容量
+ 随时回收容量。有关更多信息，请参阅 [回收过程和跟踪](capacity-owner-procedures.md#reclamation-process)。
+ 使用 AWS Resource Access Manager（RAM）与其他账户或您的 AWS 组织共享

## 计费
<a name="interruptible-cr-billing"></a>

创建可中断预留时，系统会将其作为独立的新预留进行计费。这将拆分您的计费：
+ 源预留：按总容量减去分配的容量得出的差额进行计费
+ 可中断预留：按分配的容量进行计费

有关按需容量预留计费的更多信息，请参阅[容量预留定价和计费](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservations-pricing-billing.html)。

## 注意事项
<a name="interruptible-cr-considerations"></a>

在使用可中断容量预留之前，请查看以下适用于容量所有者和使用者的限制和要求。

### 容量所有者
<a name="capacity-owner-considerations"></a>
+ 您不能直接修改或取消可中断容量预留。要编辑它，请更新从源容量预留中分配的容量。
+ 您只能查看、启动、标记、共享和分配可中断预留的计费。
+ 每个源容量预留只能创建一个可中断分配。

### 容量使用者
<a name="capacity-consumer-considerations"></a>
+ 可中断容量预留默认情况下是有针对性的容量预留，因此您需要在实例启动时将其作为目标。
+ 您无法将可中断容量预留添加到容量预留组。
+ 我们建议您仅对可能中断的应用程序使用可中断容量预留。
+ 当所有者回收容量时，您的实例将被终止，不会回退为按需型实例或竞价型实例。有关更多信息，请参阅 [中断体验](capacity-consumer-procedures.md#interruption-experience)。


# 容量所有者的可中断容量预留
<a name="capacity-owner-procedures"></a>

容量所有者是拥有源容量预留的账户，它创建可中断容量预留以与其他团队共享未使用的容量，同时保留控制权，以便在需要时回收该容量。

本节介绍您（容量所有者）如何创建、修改、回收和跟踪可中断容量预留。

**Topics**
+ [创建可中断容量预留](#creating-interruptible-cr)
+ [查看可中断容量预留](#view-interruptible-cr)
+ [修改可中断容量预留](#modify-interruptible-cr)
+ [在容量为零时保留可中断容量预留](#retain-interruptible-cr-zero-capacity)
+ [回收过程和跟踪](#reclamation-process)
+ [共享可中断预留](#sharing-interruptible-reservations)

## 创建可中断容量预留
<a name="creating-interruptible-cr"></a>

创建可中断容量预留，使源预留中未使用的容量可用于其他工作负载，同时保持控制权，以便在需要时回收该容量。

### 先决条件
<a name="interruptible-cr-prerequisites"></a>

在创建可中断分配之前，请确保源按需容量预留满足下面的要求：
+ 容量预留必须处于活跃状态，且未设置结束日期。您无法从待处理、已过期、已取消或具有计划的结束日期的预留创建分配。
+ 容量预留必须具有可供分配的容量。您只能分配可用的实例（也称为未使用的容量）。
+ 每个源容量预留只能创建一个可中断分配。如果分配已存在，则必须在创建新分配之前先修改或取消该分配。
+ 一次最多可以为可中断容量预留分配 1000 个实例。

您可以使用控制台或 AWS CLI 创建可中断容量预留。

------
#### [ Console ]

**创建可中断容量预留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择**容量预留**。

1. 选择容量预留。

1. 选择**操作**、**创建可中断预留**。

1. 对于**数量**，输入要分配的实例数量。

1. 对于**回收所有容量时的分配首选项**，选择**默认**或**保留**。

1. （可选）添加标签。

1. 选择**创建可中断预留**。

------
#### [ AWS CLI ]

**创建可中断容量预留**  
使用 [create-interruptible-capacity-reservation-allocation](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/create-interruptible-capacity-reservation-allocation.html) 命令：

```
aws ec2 create-interruptible-capacity-reservation-allocation \
    --capacity-reservation-id {{cr-1234567890abcdef0}} \
    --instance-count {{10}}
```

------

## 查看可中断容量预留
<a name="view-interruptible-cr"></a>

在创建可中断容量预留后，您可以在您的账户中或从特定资源查看可中断预留。

### 查看您账户中的所有可中断容量预留
<a name="view-all-interruptible-cr"></a>

请按照以下过程查看您的账户中的可中断容量预留。

------
#### [ Console ]

**查看您账户中的可中断容量预留**

1. 前往控制台中的“容量预留”页面。

1. 在**可中断**列中，查找标记为**是**的预留。

1. 选择可中断预留以查看详细信息。

------
#### [ AWS CLI ]

**查看您账户中的可中断容量预留**

```
aws ec2 describe-capacity-reservations \
    --capacity-reservation-id {{cr-interruptible-id}} \
    --filters Name=interruptible,Values=true
```

------

### 查看来自特定源的可中断容量预留
<a name="view-interruptible-cr-from-source"></a>

请按照以下过程查看从特定源容量预留创建的可中断容量预留。

```
aws ec2 describe-capacity-reservations \
    --capacity-reservation-id {{cr-source-id}}
```

在响应中，您将找到一个包含可中断容量预留 ID 和分配详细信息的 `interruptibleCapacityAllocation` 对象。有关响应结构的信息，请参阅《Amazon EC2 API 参考》**中的 [InterruptibleCapacityAllocation](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_InterruptibleCapacityAllocation.html)。

## 修改可中断容量预留
<a name="modify-interruptible-cr"></a>

请按照以下过程编辑或取消可中断容量预留。

**注意**  
当您减少分配时，我们会先回收可用的实例，然后再回收正在运行的实例，直到达到请求的计数。如果我们能够完全利用可用实例满足计数，则不会发生终止。对已分配实例计数所做的所有修改都是通过源容量预留完成的，而不是直接在可中断容量预留上进行。
一次最多只能修改 1000 个实例的可中断容量预留（增加或减少）。

### 编辑可中断容量预留
<a name="edit-interruptible-allocation"></a>

请按照以下过程编辑可中断容量预留。

------
#### [ Console ]

1. 在源容量预留详细信息页面上，选择**编辑可中断分配**链接。

1. 对于**数量**，输入新数字：
   + 添加更多共享容量
   + 将容量回收到源容量预留

1. 选择**更新**。

------
#### [ AWS CLI ]

```
aws ec2 update-interruptible-capacity-reservation-allocation \
    --capacity-reservation-id {{cr-1234567890abcdef0}} \
    --target-instance-count {{80}}
```

------

### 取消可中断容量预留
<a name="cancel-interruptible-allocation"></a>

请按照以下过程永久移除分配并返回所有容量。

------
#### [ Console ]

1. 在源容量预留详细信息页面上，导航至可中断容量分配详细信息。

1. 选择**编辑可中断分配**。

1. 在**数量**栏，输入 `0`。

1. 选择**更新**。

------
#### [ AWS CLI ]

```
aws ec2 update-interruptible-capacity-reservation-allocation \
--capacity-reservation-id {{cr-1234567890abcdef0}} \
--target-instance-count {{0}}
```

------

**保留零大小首选项**  
如果将零大小首选项配置为 `retain`，可中断容量预留在零实例数时仍保持活动状态。如果要取消，请将零大小首选项更新为 `default`，然后将分配值减小为零。有关更多信息，请参阅 [在容量为零时保留可中断容量预留](#retain-interruptible-cr-zero-capacity)。

## 在容量为零时保留可中断容量预留
<a name="retain-interruptible-cr-zero-capacity"></a>

默认情况下，当可中断预留的实例分配减小到零时，Amazon EC2 会取消该预留。回收的容量将返回到源容量预留中。

如果希望稍后再次共享容量，可以将可中断预留配置为在零实例时保持活动状态。使用此选项，您可以稍后将实例分配给同一个预留，而无需重新创建。

可使用零大小首选项来控制此行为。您可以在创建或编辑可中断容量预留分配时，在控制台或 AWS CLI 中对其进行设置。

------
#### [ Console ]

在**创建可中断预留**或**编辑可中断分配**页面上，对于**回收所有容量时的分配首选项**，选择以下选项之一：
+ **默认**：当可中断容量预留分配减小到零时，Amazon EC2 会取消该容量预留。
+ **保留**：当可中断容量预留分配减小到零时，容量预留在零容量时仍保持活动状态。然后，您可以稍后再为其分配实例。

保存更改后，该设置将以只读的**零大小首选项**字段显示在可中断容量预留详细信息中。

------
#### [ AWS CLI ]

要使可中断容量预留在零容量时保持活动状态，请在调用 [create-interruptible-capacity-reservation-allocation](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/create-interruptible-capacity-reservation-allocation.html)或[update-interruptible-capacity-reservation-allocation](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/update-interruptible-capacity-reservation-allocation.html) 时指定 `--zero-size-preference retain`。要在预留的分配值达到零时取消预留，请指定 `default`。

```
aws ec2 update-interruptible-capacity-reservation-allocation \
    --capacity-reservation-id {{cr-1234567890abcdef0}} \
    --zero-size-preference retain
```

------

## 回收过程和跟踪
<a name="reclamation-process"></a>

当您回收容量时：
+ 正在运行的实例会通过 EventBridge 事件收到 2 分钟中断警告。
+ 在通知期之后，以回收容量运行的实例将进入关闭状态并被终止。
+ 终止后，回收的实例将在源容量预留中可供立即使用。
+ 完成后，分配状态将从**正在更新**变为**活跃**。

完全回收可能需要几分钟，具体取决于实例类型和关闭时间。有关过程完成后您收到的 EventBridge 通知的更多信息，请参阅[回收完成](monitor-interruptible-cr.md#reclamation-completion)。

### 跟踪回收状态
<a name="track-reclamation-status"></a>

通过描述您的源预留来监控回收进度：

```
aws ec2 describe-capacity-reservations \
--capacity-reservation-id {{cr-1234567890abcdef0}}
```

响应会显示 `interruptibleCapacityAllocation` 对象中的以下字段：
+ `instance-count`：当前分配的实例
+ `target-instance-count`：回收后的请求数量
+ `status`：回收期间为**正在更新**，完成后为**活跃**

## 共享可中断预留
<a name="sharing-interruptible-reservations"></a>

您只能使用 AWS Resource Access Manager（RAM）在您的 AWS 组织内共享可中断预留。

注意事项：
+ 如果使用者账户离开您的组织，则该账户将自动取消共享可中断预留。
+ 在取消共享的预留中运行的任何实例最终将被终止。
+ 所有其他共享功能的工作原理与标准容量预留相同。

有关完整的共享过程，请参阅[共享容量预留](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservation-sharing.html)。
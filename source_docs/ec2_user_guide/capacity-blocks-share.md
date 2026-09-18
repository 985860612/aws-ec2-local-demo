

# 共享容量块
<a name="capacity-blocks-share"></a>

 容量块共享使容量块拥有者能够与 AWS 组织内的其他 AWS 账户共享 Amazon EC2 容量块。这样，您便可以最大限度地利用不同团队和项目的预留 GPU 容量，从而有效地使用容量块。

 拥有容量块的 AWS 账户（拥有者）可以与其他 AWS 账户（使用者）共享它。拥有者可以与其 AWS 组织内的特定 AWS 账户、其 AWS 组织内的组织单位或整个 AWS 组织共享容量块。使用者可以像在自己拥有的容量块中启动实例一样，在与他们共享的容量块中启动实例。

## 共享容量块的先决条件
<a name="capacity-blocks-share-prereq"></a>

在共享容量块之前，必须满足下面的条件：
+ **您必须拥有容量块**：您无法共享已与您共享的容量块。
+  **容量块状态必须为活跃或已计划**：处于其他[状态](https://docs.aws.amazon.com/cli/latest/reference/ec2/purchase-capacity-block.html)（例如 `expired` 或`payment-pending`）的容量块无法共享。
+ **仅在您的 AWS 组织内共享**：拥有者可以与其 AWS 组织内的特定 AWS 账户、其 AWS 组织内的组织单位或整个 AWS 组织共享容量块。
+  **不支持 UltraServer 容量块**：您无法共享 Amazon EC2 UltraServers 的容量块。
+ **账户资格**：容量块共享不适用于新的 AWS 账户或具有有限账单历史记录的 AWS 账户。

## 相关服务
<a name="capacity-blocks-share-related"></a>

容量块共享与 AWS Resource Access Manager (AWS RAM) 集成。AWS RAM 是一项服务，允许您与任何 AWS 账户或通过 AWS Organizations 共享 AWS 资源。利用 AWS RAM，您可通过创建*资源共享*来共享您拥有的资源。资源共享指定要共享的资源以及与之共享资源的使用者。使用者可以是单个 AWS 账户或 AWS Organizations 中的组织部门或整个组织。

AWS RAM有关 * 的更多信息，请参阅 [AWS RAM](https://docs.aws.amazon.com/ram/latest/userguide/) 用户指南*。

## 共享容量块权限
<a name="capacity-blocks-share-permissions"></a>

### 所有者的权限
<a name="capacity-blocks-share-permissions-owner"></a>

 容量块拥有者仍然负责管理容量块（例如，延期、共享）以及在其中启动的实例。拥有者无法修改使用者启动到已共享的容量块中的实例。

### 使用者的权限
<a name="capacity-blocks-share-permissions-consumer"></a>

 使用者可以在共享容量中启动实例，并负责管理这些实例。使用者无法查看或修改由其他使用者或容量块拥有者拥有的实例。使用者还只能查看共享容量块中的总容量和可用容量。

## 共享容量块
<a name="capacity-blocks-sharing"></a>

要共享容量块，您必须将它添加到资源共享。资源共享是一项 AWS RAM 资源，可让您跨 AWS 账户共享资源。

如果您已将容量块添加到与整个 AWS 组织共享的资源共享，则组织中的使用者将能够访问共享的容量块。

------
#### [ Console ]

**要使用 Amazon EC2 控制台共享您拥有的容量块**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 选择要共享的容量块，然后选择**操作、共享预留**。

1. 选择要将容量块添加到的资源共享，然后选择**共享容量预留**。

   使用者可能需要几分钟的时间才能访问共享容量块。

**要将容量块添加到新的资源共享中**  
必须使用 AWS RAM 控制台先创建资源共享。有关更多信息，请参阅《AWS RAM User Guide》**中的 [Creating a resource share](https://docs.aws.amazon.com/ram/latest/userguide/working-with-sharing.html#working-with-sharing-create)。

------
#### [ AWS CLI ]

**共享您拥有的容量块**  
 使用 [create-resource-share](https://docs.aws.amazon.com/cli/latest/reference/ram/create-resource-share.html) 和 [associate-resource-share](https://docs.aws.amazon.com/cli/latest/reference/ram/associate-resource-share.html) 命令。

```
aws ram create-resource-share \
    --name {{my-resource-share}} \
    --resource-arns arn:aws:ec2:{{us-east-2}}:{{123456789012}}:capacity-reservation/{{cr-1234abcd56EXAMPLE}}
```

```
aws ram associate-resource-share \
    --resource-share-arn arn:aws:ram:{{us-east-2}}:{{123456789012}}:resource-share/{{7ab63972-b505-7e2a-420d-6f5d3EXAMPLE}} \
    --resource-arns arn:aws:ec2:{{us-east-2}}:{{123456789012}}:capacity-reservation/{{cr-1234abcd56EXAMPLE}}
```

------
#### [ PowerShell ]

**共享您拥有的容量块**  
 使用 [New-RAMResourceShare](https://docs.aws.amazon.com/powershell/latest/reference/items/New-RAMResourceShare.html) 和 [Connect-RAMResourceShare](https://docs.aws.amazon.com/powershell/latest/reference/items/Connect-RAMResourceShare.html) cmdlet。

```
New-RAMResourceShare `
    -Name {{my-resource-share}} `
    -ResourceArn "arn:aws:ec2:{{us-east-2}}:{{123456789012}}:capacity-reservation/{{cr-1234abcd56EXAMPLE}}"
```

```
Connect-RAMResourceShare `
    -ResourceShareArn "arn:aws:ram:{{us-east-2}}:{{123456789012}}:resource-share/{{7ab63972-b505-7e2a-420d-6f5d3EXAMPLE}}" `
    -ResourceArn "arn:aws:ec2:{{us-east-2}}:{{123456789012}}:capacity-reservation/{{cr-1234abcd56EXAMPLE}}"
```

------

 对于所有账户，无论所有权状态如何，容量块都按**先到先得的原则**运行。当您共享容量块时，如果使用者在拥有者之前启动实例，则这些实例会占用容量，直到使用者终止实例或直到容量块到期前 30 分钟。

## 停止共享容量块
<a name="capacity-blocks-unsharing"></a>

 您可以在容量块到期前 30 分钟随时停止共享容量块。

**停止共享时会发生什么情况：**
+ 使用者无法再在未共享的容量块中启动新实例。
+ 除非使用者终止，否则任何正在运行的实例都会持续运行到容量块到期日前 30 分钟。

------
#### [ Console ]

**要使用 Amazon EC2 控制台停止共享您拥有的容量块**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 选择容量块并选择**共享**选项卡。

1.  **共享**选项卡列出了已将容量块添加到的资源共享。选择要从中移除容量块的资源共享。

1. 选择**从资源共享中移除**。

------
#### [ AWS CLI ]

**停止共享您拥有的容量块**  
使用 [disassociate-resource-share](https://docs.aws.amazon.com/cli/latest/reference/ram/disassociate-resource-share.html) 命令。

```
aws ram disassociate-resource-share \
    --resource-share-arn arn:aws:ram:{{us-east-2}}:{{123456789012}}:resource-share/{{7ab63972-b505-7e2a-420d-6f5d3EXAMPLE}} \
    --resource-arns arn:aws:ec2:{{us-east-2}}:{{123456789012}}:capacity-reservation/{{cr-1234abcd56EXAMPLE}}
```

------
#### [ PowerShell ]

**停止共享您拥有的容量块**  
使用 [Disconnect-RAMResourceShare](https://docs.aws.amazon.com/powershell/latest/reference/items/Disconnect-RAMResourceShare.html) cmdlet。

```
Disconnect-RAMResourceShare `
    -ResourceShareArn "arn:aws:ram:{{us-east-2}}:{{123456789012}}:resource-share/{{7ab63972-b505-7e2a-420d-6f5d3EXAMPLE}}" `
    -ResourceArn "arn:aws:ec2:{{us-east-2}}:{{123456789012}}:capacity-reservation/{{cr-1234abcd56EXAMPLE}}"
```

------

## 监控共享容量块使用情况
<a name="capacity-blocks-shared-monitor-usage"></a>

容量块拥有者可以监控哪些账户正在使用其共享容量块，并跟踪每个账户的实例使用情况。

------
#### [ AWS CLI ]

**监控容量块的使用情况**  
使用 [get-capacity-reservation-usage](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-capacity-reservation-usage.html) 命令。

```
aws ec2 get-capacity-reservation-usage \
    --capacity-reservation-id {{cr-1234abcd56EXAMPLE}}
```

**此 API 使拥有者能够：**
+ 查看哪些账户当前正在使用容量块。
+ 查看每个账户正在运行的实例数。

------

## 实例终止通知
<a name="capacity-blocks-shared-instance-termination-notices"></a>

 在容量块中运行实例的拥有者和使用者账户将在容量块预留结束前 40 分钟收到一个 EventBridge 事件，指明预留中运行的所有实例将在 10 分钟后开始终止。有关更多信息，请参阅 [使用 EventBridge 监控容量块](capacity-blocks-monitor.md)。

## 容量块扩展
<a name="capacity-blocks-shared-extend"></a>

容量块可以在共享时进行扩展。只有拥有者账户才能扩展共享容量区块。

 扩展容量块后，拥有者或使用者启动的正在运行的实例会自动继承新的到期日期，使用者可以继续使用共享容量，直到新的到期日，而不会中断任何实例。

## 定价和计费
<a name="capacity-blocks-shared-pricing-billing"></a>

 拥有者需要为他们共享的容量块付费，在购买容量块时需预先支付容量块的费用。拥有者还需为他们在容量块上运行的实例支付操作系统费用。

 使用者只需为他们在共享容量块中运行的实例支付操作系统费用。使用者无需为容量块预留本身付费。


# 共享 容量预留
<a name="sharing-cr"></a>

在与其他 AWS 账户共享您拥有的容量预留时，您必须启用它们以便将实例启动到预留容量中。如果您共享开放容量预留，请记住以下内容，因为它可能导致意外的容量预留使用：
+ 如果使用者拥有与容量预留的属性匹配的运行中实例、已将 `CapacityReservationPreference` 参数设置为 `open` 且尚未在预留容量中运行，他们将自动使用共享容量预留。
+ 如果使用者启动具有匹配属性（实例类型、平台、可用区和租赁）的实例，并且已将 `CapacityReservationPreference` 参数设置为 `open`，则它们将自动启动到共享容量预留中。

要共享容量预留，您必须将它添加到资源共享。资源共享是一项 AWS RAM 资源，可让您跨 AWS 账户共享资源。资源共享指定要共享的资源以及与之共享资源的使用者。在使用 Amazon EC2 控制台共享容量预留时，必须将它添加到现有资源共享。要将容量预留添加到新的资源共享，您必须使用 [AWS RAM 控制台](https://console.aws.amazon.com/ram)创建资源共享。

如果您属于 AWS Organizations 中的某个企业并且已在您的组织中启用共享，当达到[共享先决条件](capacity-reservation-sharing.md#sharing-cr-prereq)时，组织中的使用者将自动获得对所共享容量预留的访问权限。如果与外部账户共享了容量预留，他们会收到加入资源共享的邀请，并在接受邀请后获得对所共享容量预留的访问权限。

**重要**  
在与您共享的容量预留中启动实例之前，请通过以下任一方式验证您是否拥有访问共享的容量预留的权限：在控制台中进行查看，或使用 [ describe-capacity-reservations](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-reservations.html) AWS CLI 命令对其进行描述。如果您可以在控制台中查看共享的容量预留或者使用 AWS CLI 描述它，即表示您可以使用它，并且可以在其中启动实例。如果您尝试在容量预留中启动实例，但由于共享失败而无法访问容量预留，则实例将在按需型容量中启动。

------
#### [ Console ]

**使用 Amazon EC2 控制台共享您拥有的容量预留**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 选择要共享的容量预留，然后选择**操作**、**共享预留**。

1. 选择要将容量预留添加到的资源共享，然后选择**共享容量预留**。

   使用者可能需要几分钟的时间才能访问共享容量预留。

**使用 AWS RAM 控制台共享您拥有的容量预留**  
请参阅《AWS RAM 用户指南**》中的[创建资源共享](https://docs.aws.amazon.com/ram/latest/userguide/working-with-sharing.html#working-with-sharing-create)。

------
#### [ AWS CLI ]

**共享您拥有的容量预留**  
使用 [create-resource-share](https://docs.aws.amazon.com/cli/latest/reference/ram/create-resource-share.html) 命令。

```
aws ram create-resource-share \
    --name {{my-resource-share}} \
    --resource-arns arn:aws:ec2:{{us-east-2}}:{{123456789012}}:capacity-reservation/{{cr-1234abcd56EXAMPLE}}
```

------
#### [ PowerShell ]

**共享您拥有的容量预留**  
使用 [New-RAMResourceShare](https://docs.aws.amazon.com/powershell/latest/reference/items/New-RAMResourceShare.html) cmdlet。

```
New-RAMResourceShare `
    -Name {{my-resource-share}} `
    -ResourceArn "arn:aws:ec2:{{us-east-2}}:{{123456789012}}:capacity-reservation/{{cr-1234abcd56EXAMPLE}}"
```

------
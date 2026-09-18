

# 在具有默认租赁的 VPC 中启动专用实例
<a name="dedicatedinstancesintovpc"></a>

当您创建 VPC 时，您可以选择指定它的实例租期。如果在实例租赁为 `dedicated` 的 VPC 中启动实例，则该实例将作为专用实例在专用硬件上运行。

有关启动租期为 `host` 的实例的更多信息，请参阅[在 Amazon EC2 专属主机上启动 Amazon EC2 实例](launching-dedicated-hosts-instances.md)。

有关 VPC 租赁选项的更多信息，请参阅《Amazon VPC 用户指南》中的[创建 VPC](https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html)**。

**要求**
+ 选择一个受支持的实例类型。有关更多信息，请参阅 [Amazon EC2 专用实例](https://aws.amazon.com/ec2/pricing/dedicated-instances/)。

------
#### [ Console ]

**在默认租赁 VPC 中启动专用实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，依次选择 **Instances**（实例）、**Launch instance**（启动实例）。

1. 在 **Application and OS Images**（应用程序和操作系统镜像）部分中，请从列表中选择一个 AMI。

1. 在 **Instance type**（实例类型）部分中，选择要启动的实例类型。

1. 在 **Key pair**（密钥对）部分中，选择要与实例关联的密钥对。

1. 在 **Advanced details**（高级详细信息）部分中，对于 **Tenancy**（租赁），选择 **Dedicated**（专属）。

1. 根据需要配置其他实例选项。有关更多信息，请参阅 [Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

1. 选择**启动实例**。

------
#### [ AWS CLI ]

**在启动过程中设置实例的租赁选项**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令并包含 `Tenancy` 及 `--placement` 选项。

```
--placement Tenancy=dedicated
```

------
#### [ PowerShell ]

**在启动过程中设置实例的租赁选项**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-Placement_Tenancy` 参数结合使用。

```
-Placement_Tenancy dedicated
```

------
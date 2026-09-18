

# 在主机资源组中启动 Amazon EC2 实例
<a name="launching-hrg-instances"></a>

专属主机也与 AWS License Manager 相集成。使用 License Manager，您可以创建主机资源组，该组是作为单个实体进行管理的专属主机的集合。创建主机资源组时，可以为专属主机指定主机管理首选项，如自动分配和自动释放。这允许您在专属主机上启动实例，而无需手动分配和管理这些主机。有关更多信息，请参阅 *AWS License Manager 用户指南*中的[主机 Resource Groups](https://docs.aws.amazon.com/license-manager/latest/userguide/host-resource-groups.html)。

在包含具有可用实例容量的专属主机的主机资源组中启动实例时，Amazon EC2 将在该主机上启动实例。如果主机资源组没有包含具有可用实例容量的主机，Amazon EC2 将自动分配主机资源组中的新主机，然后在该主机上启动实例。有关更多信息，请参阅 *AWS License Manager 用户指南*中的[主机资源组](https://docs.aws.amazon.com/license-manager/latest/userguide/host-resource-groups.html)。

**要求和限制**
+ 为主机资源组创建许可证配置（自管理许可证）是可选的：
  + 如果在创建主机资源组时需要许可证配置，则只能从具有匹配的基于核心或套接字的许可证配置的 AMI 启动实例。
  + 如果创建主机资源组时不需要许可证配置，则不需要设置自管理许可证或关联 AMI。
+ 您不能将 Amazon EC2 提供的 SQL Server、SUSE 或 RHEL AMI 用于专属主机。
+ 您无法通过选择主机 ID 来定位特定主机，并且无法在主机资源组中启动实例时启用实例关联。

------
#### [ Console ]

**在主机资源组中启动实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，依次选择 **Instances**（实例）、**Launch instance**（启动实例）。

1. 在 **Application and OS Images**（应用程序和操作系统镜像）部分中，请从列表中选择一个 AMI。

1. 在 **Instance type**（实例类型）部分中，选择要启动的实例类型。

1. 在 **Key pair**（密钥对）部分中，选择要与实例关联的密钥对。

1. 在 **Advanced details**（高级详细信息）部分中，执行以下操作：

   1. 对于 **Tenancy**（租赁），选择 **Dedicated Host**（专属主机）。

   1. 对于 **Target host by** [目标主机（按）]，选择 **Host resource group**（主机资源组）。

   1. 对于 **Tenancy host resource group**（租赁主机资源组），选择要在其中启动实例的主机资源组。

   1. 对于 **Tenancy affinity**（租赁关联），执行下面的任意一项操作：
      + 选择 **Off**（关闭） – 实例将在指定的主机上启动，但不保证停止后仍会在同一专属主机上重新启动。
      + 选择专属主机 ID – 如果停止，实例将始终在此特定主机上重新启动。

      有关关联的更多信息，请参阅[Amazon EC2 专属主机自动置放和主机关联](dedicated-hosts-understanding.md)。

1. 根据需要配置其他实例选项。有关更多信息，请参阅 [Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

1. 选择**启动实例**。

------
#### [ AWS CLI ]

**在主机资源组中启动实例**  
可以使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令。在 `--placement` 选项中，省略租赁并指定主机资源组的 ARN。

```
--placement HostResourceGroupArn=arn:aws:resource-groups:{{us-east-2}}:{{123456789012}}:group/{{my-resource-group}}
```

------
#### [ PowerShell ]

**在主机资源组中启动实例**  
使用 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet。在 `-Placement` 参数中，省略租赁并指定主机资源组的 ARN。

```
-Placement_HostResourceGroupArn arn:aws:resource-groups:{{us-east-2}}:{{123456789012}}:group/{{my-resource-group}}
```

------
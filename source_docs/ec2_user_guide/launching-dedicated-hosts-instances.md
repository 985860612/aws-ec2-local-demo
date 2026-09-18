

# 在 Amazon EC2 专属主机上启动 Amazon EC2 实例
<a name="launching-dedicated-hosts-instances"></a>

在分配一个专属主机后，您可以在其中启动实例。对于您启动的实例类型，如果没有具有足够可用容量的活动专属主机，则无法启动具有 `host` 租赁的实例。

**注意事项**
+ SQL Server、SUSE 和 Amazon EC2 提供的 RHEL AMI 无法用于专属主机。
+ 对于支持多种实例尺寸的专属主机，我们建议您首先启动较大的实例大小，然后根据需要用较小的实例大小填充剩余的实例容量。
+ 在启动实例之前，请注意限制。有关更多信息，请参阅 [专属主机限制](dedicated-hosts-overview.md#dedicated-hosts-limitations)。

------
#### [ Console ]

**从专属主机页面中在特定专属主机上启动实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。

1. 在 **Dedicated Hosts**（专属主机）页面上，选择一个主机，然后依次选择 **Actions**（操作）、**Launch Instance(s) onto host**（在主机上启动实例）。

1. 在 **Application and OS Images**（应用程序和操作系统镜像）部分中，请从列表中选择一个 AMI。

1. 在 **Instance type**（实例类型）部分中，选择要启动的实例类型。
**注意**  
如果专属主机仅支持一种实例类型，则默认选择支持的实例类型，而无法进行更改。  
如果专属主机支持多种实例类型，您必须根据专属主机的可用实例容量在支持的实例系列中选择一种实例类型。建议您首先启动较大的实例大小，然后根据需要用较小的实例大小填充剩余的实例容量。

1. 在 **Key pair**（密钥对）部分中，选择要与实例关联的密钥对。

1. 在**高级详细信息**部分中，对于**租赁关联**，执行下面的任意一项操作：
   + **关闭**：禁用主机关联。实例在指定的主机上启动，但不保证停止后仍在同一专属主机上重新启动。
   + 专属主机 ID：启用主机关联。停止后，实例将始终在此指定主机上重新启动（如果主机有容量）。如果主机没有容量，则无法重新启动实例；您必须与其他主机建立关联。

   有关关联的更多信息，请参阅[Amazon EC2 专属主机自动置放和主机关联](dedicated-hosts-understanding.md)。
**注意**  
**租赁**和**主机**选项是根据您选择的主机预配置的。

1. 根据需要配置其他实例选项。有关更多信息，请参阅 [Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

1. 选择**启动实例**。

**使用启动实例向导在专属主机上启动实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，依次选择 **Instances**（实例）、**Launch instance**（启动实例）。

1. 在 **Application and OS Images**（应用程序和操作系统镜像）部分中，请从列表中选择一个 AMI。

1. 在 **Instance type**（实例类型）部分中，选择要启动的实例类型。

1. 在 **Key pair**（密钥对）部分中，选择要与实例关联的密钥对。

1. 在 **Advanced details**（高级详细信息）部分中，执行以下操作：

   1. 对于 **Tenancy**（租赁），选择 **Dedicated Host**（专属主机）。

   1. 对于 **Target host by** [目标主机（按）]，选择 **Host ID**（主机 ID）。

   1. 对于 **Target host ID**（目标主机 ID），选择要在其上启动实例的主机。

   1. 对于**租赁关联**，执行下面的任意一项操作：
      + **关闭**：禁用主机关联。实例在指定的主机上启动，但不保证停止后仍在同一专属主机上重新启动。
      + 专属主机 ID：启用主机关联。停止后，实例将始终在此指定主机上重新启动（如果主机有容量）。如果主机没有容量，则无法重新启动实例；您必须与其他主机建立关联。

      有关关联的更多信息，请参阅[Amazon EC2 专属主机自动置放和主机关联](dedicated-hosts-understanding.md)。

1. 根据需要配置其他实例选项。有关更多信息，请参阅 [Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

1. 选择**启动实例**。

------
#### [ AWS CLI ]

**在专属主机上启动实例**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令并在 `--placement` 选项中指定实例亲和性、租赁和主机。

在具有主机关联的特定专属主机上启动（如果实例停止，它将始终在同一主机上重启）：

```
--placement Affinity=host,Tenancy=host,HostId={{h-07879acf49EXAMPLE}}
```

在没有主机关联的特定专属主机上启动（实例可以在任何可用主机上重启）：

```
--placement Tenancy=host,HostId={{h-07879acf49EXAMPLE}}
```

在启用了自动置放和具有匹配实例类型的任何可用专属主机上启动：

```
--placement Tenancy=host
```

------
#### [ PowerShell ]

**在专属主机上启动实例**  
使用 [New-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 并在 `-Placement` 参数中指定实例亲和性、租赁和主机。

在具有主机关联的特定专属主机上启动（如果实例停止，它将始终在同一主机上重启）：

```
-Placement_Affinity host `
-Placement_Tenancy host `
-Placement_HostId {{h-07879acf49EXAMPLE}}
```

在没有主机关联的特定专属主机上启动（实例可以在任何可用主机上重启）：

```
-Placement_Tenancy host `
-Placement_HostId {{h-07879acf49EXAMPLE}}
```

在启用了自动置放和具有匹配实例类型的任何可用专属主机上启动：

```
-Placement_Tenancy host
```

------


# 在 AWS Outposts 上分配 Amazon EC2 专属主机
<a name="dh-outpost-allocate"></a>

在 Outposts 上分配和使用专属主机的方式与在 AWS 区域中分配和使用专属主机的方式相同。

**先决条件**  
在 Outpost 上创建子网。有关更多信息，请参阅 *AWS Outposts 用户指南*中的[创建子网](https://docs.aws.amazon.com/outposts/latest/userguide/launch-instance.html#create-subnet)。

**要在 Outpost 上分配专属主机，请使用以下方法之一：**

------
#### [ Console ]

**使用 AWS Outposts 控制台在 Outpost 上分配专属主机**

1. 打开 AWS Outposts 控制台 ([https://console.aws.amazon.com/outposts/](https://console.aws.amazon.com/outposts/home))。

1. 在导航窗格中，选择 **Outposts**。选择 Outpost，然后依次选择 **Actions**（操作）和 **Allocate Dedicated Host**（分配专属主机）。

1. 根据需要配置专属主机。有关更多信息，请参阅 [分配一台 Amazon EC2 专属主机供您的账户使用](dedicated-hosts-allocating.md)。
**注意**  
**Availability Zone**（可用区）和 **Outpost ARN** 应预先填充所选 Outpost 的可用区和 ARN。

1. 选择 **Allocate**。

**使用 Amazon EC2 控制台在 Outpost 上分配专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Dedicated Hosts**（专属主机），然后选择 **Allocate Dedicated Host**（分配专属主机）。

1. 对于 **Availability Zone**（可用区），选择与 Outpost 关联的可用区。

1. 对于 **Outpost ARN**，输入 Outpost 的 ARN。

1. 要将 Outpost 上的特定硬件资产作为目标，针对**将 Outpost 上的特定硬件资产作为目标**，选择**启用**。对于要作为目标的每项硬件资产，选择**添加资产 ID**，然后输入硬件资产的 ID。
**注意**  
您为**数量**指定的值必须等于您指定的资产 ID 数。例如，如果您指定 3 个资产 ID，则“数量”也必须为 3。

1. 根据需要配置剩余专属主机设置。有关更多信息，请参阅 [分配一台 Amazon EC2 专属主机供您的账户使用](dedicated-hosts-allocating.md)。

1. 选择 **Allocate**。

------
#### [ AWS CLI ]

**在 Outpost 上分配专属主机**  
使用 [allocate-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/allocate-hosts.html) 命令。对于 `--availability-zone`，指定与 Outpost 关联的可用区。对于 `--outpost-arn`，指定 Outpost 的 ARN。（可选）对于 `--asset-ids`，指定要作为目标的 Outpost 硬件资产的 ID。

```
aws ec2 allocate-hosts \
    --availability-zone "{{us-east-1a}}" \
    --outpost-arn "{{arn:aws:outposts:us-east-1a:111122223333:outpost/op-4fe3dc21baEXAMPLE}}" \
    --asset-ids {{asset_id}} \
    --instance-family "{{m5}}" \
    --auto-placement "{{off}}" \
    --quantity 1
```

------
#### [ PowerShell ]

**在 Outpost 上分配专属主机**  
使用 [New-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Host.html) cmdlet。指定与 Outpost 关联的可用区。（可选）对于 `-AssetId`，指定要作为目标的 Outpost 硬件资产的 ID。

```
New-EC2Host `
    -AvailabilityZone "{{us-east-1a}}" `
    -OutpostArn "{{arn:aws:outposts:us-east-1a:111122223333:outpost/op-4fe3dc21baEXAMPLE}}" `
    -AssetId {{asset_id}} `
    -InstanceFamily "{{m5}}" `
    -AutoPlacement "{{off}}" `
    -Quantity 1
```

------

**在 Outpost 上将专属主机启动到实例**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**专属主机**。选择您在上一步中分配的专属主机，然后依次选择 **Actions**（操作）和 **Launch instance onto host**（在主机上启动实例）。

1. 根据需要配置实例，然后启动实例。有关更多信息，请参阅 [在 Amazon EC2 专属主机上启动 Amazon EC2 实例](launching-dedicated-hosts-instances.md)。
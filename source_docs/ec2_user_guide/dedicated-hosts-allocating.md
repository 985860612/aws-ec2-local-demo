

# 分配一台 Amazon EC2 专属主机供您的账户使用
<a name="dedicated-hosts-allocating"></a>

要开始使用专属主机，必须先在您的账户中分配主机。在分配专属主机后，将在您的账户中立即提供专属主机容量，您可以开始在专属主机上启动实例。

当您在账户中分配专属主机时，您可以选择支持同一个实例系列中**单个实例类型**或**多种实例类型**的配置。您可以在主机上运行的实例数量取决于您选择的配置。有关更多信息，请参阅 [Amazon EC2 专属主机实例容量配置](dedicated-hosts-limits.md)。

------
#### [ Console ]

**分配专属主机**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **专属主机**，然后选择 **Allocate 专属主机 (分配专属主机)**。

1. 对于 **Instance family (实例系列)**，为专属主机选择实例系列。

1. 指定 专属主机 是支持选定实例系列中的多种实例大小，还是仅支持特定的实例类型。请执行以下任一操作。
   + 要将专属主机配置为支持选定实例系列中的多种实例类型，请为 **Support multiple instance types (支持多种实例类型)** 选择 **Enable (启用)**。通过启用该选项，您可以在 专属主机 上启动同一实例系列中的不同实例大小。例如，如果您选择 `m5` 实例系列并选择该选项，则可以在专属主机上启动 `m5.xlarge` 和 `m5.4xlarge` 实例。
   + 要将专属主机配置为支持选定实例系列中的单个实例类型，请清除 **Support multiple instance types (支持多种实例类型)**，然后为 **Instance type (实例类型)** 选择要支持的实例类型。这样，您就可以在专属主机上启动单个实例类型。例如，如果选择该选项并将 `m5.4xlarge` 指定为支持的实例类型，则只能在专属主机上启动 `m5.4xlarge` 实例。

1. 对于 **Availability Zone (可用区)**，选择要在其中分配专属主机的可用区。

1. 要允许专属主机接受与其实例类型匹配的非定向实例启动，请为**实例自动置放**选择**启用**。有关自动置放的更多信息，请参阅[Amazon EC2 专属主机自动置放和主机关联](dedicated-hosts-understanding.md)。

1. 要为专属主机启用主机恢复，请为 **Host recovery (主机恢复)** 选择 **Enable (启用)**。有关更多信息，请参阅[Amazon EC2 专属主机恢复](dedicated-hosts-recovery.md)。

1. 对于 **Quantity (数量)**，输入要分配的专属主机数量。

1. （可选）选择 **Add new tag** (添加新标签)，然后输入标签键和标签值。

1. 选择 **Allocate**。

------
#### [ AWS CLI ]

**分配专属主机**  
使用 [allocate-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/allocate-hosts.html) 命令。以下示例会在 `us-east-1a` 可用区中，分配一个支持 `m5` 实例系列中多种实例类型的专属主机。此外还会启用主机恢复功能并禁用自动置放功能。

```
aws ec2 allocate-hosts \
    --instance-family "{{m5}}" \
    --availability-zone "{{us-east-1a}}" \
    --auto-placement "{{off}}" \
    --host-recovery "{{on}}" \ 
    --quantity 1
```

以下示例会在指定可用区中，分配一个支持*非定向*实例启动的专属主机，并启用主机恢复和自动置放功能。

```
aws ec2 allocate-hosts \
    --instance-type {{"m5.large"}} \
    --availability-zone {{"eu-west-1a"}} \
    --auto-placement {{"on"}} \
    --host-recovery {{"on"}} \
    --quantity 1
```

------
#### [ PowerShell ]

**分配专属主机**  
使用 [New-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Host.html) cmdlet。以下示例会在 `us-east-1a` 可用区中，分配一个支持 `m5` 实例系列中多种实例类型的专属主机。该主机还会启用主机恢复功能，并禁用自动置放功能。

```
New-EC2Host `
    -InstanceFamily {{m5}} `
    -AvailabilityZone {{us-east-1a}} `
    -AutoPlacement {{Off}} `
    -HostRecovery {{On}} `
    -Quantity 1
```

以下示例会在指定可用区中，分配一个支持*非定向*实例启动的专属主机，并启用主机恢复。

```
New-EC2Host `
    -InstanceType {{m5.large}} `
    -AvailabilityZone {{eu-west-1a}} `
    -AutoPlacement {{On}} `
    -HostRecovery {{On}} `
    -Quantity 1
```

------
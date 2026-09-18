

# 修改现有 Amazon EC2 专属主机支持的实例类型
<a name="modify-host-support"></a>

您可以修改专属主机以更改它支持的实例类型。如果它当前支持一种实例类型，您可以对其进行修改以支持该实例系列中的多种实例类型。类似地，如果它当前支持多种实例类型，您可以对其进行修改以仅支持特定的实例类型。

要修改专属主机以支持多种实例类型，您必须先停止主机上正在运行的所有实例。完成修改大约需要 10 分钟。在进行修改时，专属主机将转变为 `pending` 状态。在处于 `pending` 状态时，您无法在专属主机上启动停止的实例或启动新实例。

要将支持多种实例类型的专属主机修改为仅支持单个实例类型，主机不能具有运行中的实例，或者运行中的实例必须是您希望主机支持的实例类型。例如，要将支持 `m5` 实例系列中的多种实例类型的主机修改为仅支持 `m5.large` 实例，则专属主机不能具有正在运行的实例，或者只能在主机上运行 `m5.large` 实例。

如果为虚拟化实例类型分配主机，在主机分配完成后，您无法将该实例类型修改为 `.metal` 实例类型。例如，如果您为 `m5.large` 实例类型分配主机，则无法将实例类型修改为 `m5.metal`。如果为 `.metal` 实例类型分配主机，在主机分配完成后，您无法将该实例类型修改为虚拟化实例类型。例如，如果您为 `m5.metal` 实例类型分配主机，则无法将实例类型修改为 `m5.large`。

------
#### [ Console ]

**修改专属主机的支持实例类型**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **专属主机**。

1. 选择要修改的专属主机，然后依次选择 **Actions (操作)**、**Modify host (修改主机)**。

1. 根据专属主机的当前配置，执行以下某项操作：
   + 如果专属主机当前支持特定实例类型，则未启用 **Support multiple instance types (支持多种实例类型)**，并且 **Instance type (实例类型)** 会列出所支持的实例类型。要修改主机以支持当前实例系列中的多种类型，请为 **Support multiple instance types (支持多种实例类型)** 选择 **Enable (启用)**。

     您必须先停止主机上正在运行的所有实例，然后再修改主机以支持多种实例类型。
   + 如果专属主机当前支持实例系列中的多种实例类型，则为 **Support multiple instance types (支持多种实例类型)** 选择了 **Enabled (已启用)**。要修改主机以支持特定的实例类型，请为 **Support multiple instance types (支持多种实例类型)** 取消选择 **Enable (启用)**，然后为 **Instance type (实例类型)** 选择要支持的特定实例类型。

     您无法更改专属主机支持的实例系列。

1. 选择**保存**。

------
#### [ AWS CLI ]

**修改专属主机的支持实例类型**  
使用 [modify-hosts](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-hosts.html) 命令。

以下示例会修改专属主机以支持 `m5` 实例系列中的多种实例类型。

```
aws ec2 modify-hosts \
    --instance-family {{m5}} \
    --host-ids {{h-012a3456b7890cdef}}
```

以下示例会修改专属主机以仅支持 `m5.xlarge` 实例。

```
aws ec2 modify-hosts \
    --instance-type {{m5.xlarge}} \
    --instance-family --host-ids {{h-012a3456b7890cdef}}
```

------
#### [ PowerShell ]

**修改专属主机的支持实例类型**  
使用 [Edit-EC2Host](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2Host.html) cmdlet。

以下示例会修改专属主机以支持 `m5` 实例系列中的多种实例类型。

```
Edit-EC2Host `
    -InstanceFamily {{m5}} `
    -HostId {{h-012a3456b7890cdef}}
```

以下示例会修改专属主机以仅支持 `m5.xlarge` 实例。

```
Edit-EC2Host `
    -InstanceType {{m5.xlarge}} `
    -HostId {{h-012a3456b7890cdef}}
```

------
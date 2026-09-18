

# 修改 Amazon EC2 实例的 Amazon EC2 专属主机租赁和关联
<a name="moving-instances-dedicated-hosts"></a>

启动实例后，可以更改其租赁属性。您还可以修改实例的亲和性以定位特定主机，或者允许其在您账户中具有匹配属性的任何可用专属主机上启动。要修改实例租赁或关联，实例必须处于 `stopped` 状态。

您实例的操作系统详细信息以及是否安装了 SQL Server 会影响支持的转换。有关实例可用的租赁转换路径的更多信息，请参阅《License Manager User Guide》**中的 [Tenancy conversion](https://docs.aws.amazon.com/license-manager/latest/userguide/conversion-tenancy.html)。

**注意**  
对于 T3 实例，您必须在专属主机上启动实例才能使用 `host` 租赁。对于 T3 实例，您不能将租赁从 `host` 改为 `dedicated` 或 `default`。尝试进行这些不受支持的租赁更改会导致 `InvalidRequest` 错误代码。

------
#### [ Console ]

**修改实例租赁或关联**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 选择**实例**并选择要修改的实例。

1. 依次选择**实例状态**、**停止**。

1. 在实例处于选中状态时，依次选择**操作**、**实例设置**、**修改实例置放**。

1. 在**修改实例置放**页面上，配置以下项：
   + **租赁** — 选择下列项之一：
     + 运行专用硬件实例 — 将实例作为专用实例启动。有关更多信息，请参阅[Amazon EC2 专用实例](dedicated-instance.md)。
     + 在专属主机上启动实例 — 在具有可配置关联的专属主机上启动实例。
   + **关联** — 选择下列项之一：
     + 此实例可以在任一主机上运行 — 实例在您的账户中支持该实例类型的任何可用专属主机上启动。
     + 此实例只能在选定的主机上运行 — 实例只能在为**目标主机**选择的专属主机上运行。
   + **目标主机** — 选择实例必须在其中运行的专属主机。如果未列出目标主机，则账户中可能没有可用的兼容专属主机。

   有关更多信息，请参阅[Amazon EC2 专属主机自动置放和主机关联](dedicated-hosts-understanding.md)。

1. 选择**保存**。

------
#### [ AWS CLI ]

**修改实例租赁或关联**  
使用 [modify-instance-placement](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-placement.html) 命令。以下示例将指定实例的关联从 `default` 更改为 `host`，并指定实例已关联到的专属主机。

```
aws ec2 modify-instance-placement \
    --instance-id {{i-1234567890abcdef0}} \
    --affinity {{host}} \
    --tenancy {{host}} \
    --host-id {{h-012a3456b7890cdef}}
```

------
#### [ PowerShell ]

**修改实例租赁或关联**  
使用 [Edit-EC2InstancePlacement](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstancePlacement.html) cmdlet。以下示例将指定实例的关联从 `default` 更改为 `host`，并指定实例已关联到的专属主机。

```
Edit-EC2InstancePlacement `
    -InstanceId {{i-1234567890abcdef0}} `
    -Affinity {{host}} `
    -Tenancy {{host}} `
    -HostId {{h-012a3456b7890cdef}}
```

------
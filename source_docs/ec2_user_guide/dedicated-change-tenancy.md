

# 更改 EC2 实例的租赁
<a name="dedicated-change-tenancy"></a>

启动实例后，可以更改已停止实例的租赁属性。您所做的更改将在下次实例开启时生效。

或者，您可以更改虚拟私有云（VPC）的租赁。有关更多信息，请参阅 [更改 VPC 的实例租赁](change-tenancy-vpc.md)。

**限制**
+ 不能使用 AWS 管理控制台更改实例的租赁。
+ 该实例必须处于 `stopped` 状态。
+ 您实例的操作系统详细信息以及是否安装了 SQL Server 会影响支持的转换。有关实例可用的租赁转换路径的更多信息，请参阅《License Manager User Guide》**中的 [Tenancy conversion](https://docs.aws.amazon.com/license-manager/latest/userguide/conversion-tenancy.html)。
+ 对于 T3 实例，您必须在专属主机上启动实例才能使用 `host` 租赁。您不能将租赁从 `host` 更改 `dedicated` 或 `default`。尝试进行这些不受支持的租赁更改会导致 `InvalidRequest` 错误代码。

------
#### [ AWS CLI ]

**修改实例的租赁值**  
使用 [modify-instance-placement](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-placement.html) 命令。

```
aws ec2 modify-instance-placement \
    --instance-id {{i-1234567890abcdef0}} \ 
    --tenancy {{dedicated}}
```

------
#### [ PowerShell ]

**修改实例的租赁值**  
使用 [Edit-EC2InstancePlacement](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstancePlacement.html) cmdlet。

```
Edit-EC2InstancePlacement `
    -InstanceId {{i-1234567890abcdef0}} `
    -Tenancy {{Dedicated}}
```

------
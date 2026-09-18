

# 更改 VPC 的实例租赁
<a name="change-tenancy-vpc"></a>

在创建虚拟私有云（VPC）之后，可以将其实例租赁从 `dedicated` 改为 `default`。修改 VPC 的实例租赁不会影响 VPC 中任何现有实例的租赁。下次在 VPC 中启动一个实例时，该实例将具有 `default` 租赁，除非您在实例启动过程中另有指定。

或者，您可以更改特定实例的租赁。有关更多信息，请参阅 [更改 EC2 实例的租赁](dedicated-change-tenancy.md)。

**限制**
+ 在创建 VPC 之后，您无法将其实例租赁从 `default` 更改为 `dedicated`。
+ 不能使用 AWS 管理控制台更改 VPC 的实例租赁。

------
#### [ AWS CLI ]

**修改 VPC 的实例租赁属性**  
使用 [modify-vpc-tenancy](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-vpc-tenancy.html) 命令。唯一受支持的租赁值为 `default`。

```
aws ec2 modify-vpc-tenancy \
    --vpc-id {{vpc-1234567890abcdef0}} \
    --instance-tenancy default
```

------
#### [ PowerShell ]

**修改 VPC 的实例租赁属性**  
使用 [Edit-EC2VpcTenancy](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2VpcTenancy.html) cmdlet。唯一受支持的租赁值为 `Default`。

```
Edit-EC2VpcTenancy `
    -VpcId {{vpc-1234567890abcdef0}} `
    -InstanceTenancy Default
```

------
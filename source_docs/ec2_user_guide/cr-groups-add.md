

# 向组中添加容量预留
<a name="cr-groups-add"></a>

您可以将您账户中拥有的容量预留，或其他 AWS 账户与您共享的容量预留添加到组中。

**注意事项**  

+ 您只能将处于 `active` 状态下的容量预留添加到组中。
+ 如果共享容量预留随后被其所有者取消共享，Amazon EC2 会自动将其从组中删除。

------
#### [ Console ]

您可以从容量预留资源组详细信息页面，或者从容量预留控制台向组添加容量预留。

**从容量预留资源组页面添加容量预留**  


1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 选择**容量预留资源组**。

1. 选择组名称以打开其详细信息页面。

1. 在**容量预留**部分，选择**添加**。

1. 选择要添加的容量预留，然后选择**添加**。

**从容量预留控制台添加容量预留**  


1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 选择要添加到组中的容量预留。

1. 选择**操作**，然后选择**添加到组**。

1. 选择组，然后选择**添加**。

------
#### [ AWS CLI ]

**向组中添加容量预留**  
使用 [group-resources](https://docs.aws.amazon.com/cli/latest/reference/resource-groups/group-resources.html) 命令。提供要添加的每个容量预留的 ARN。

以下示例向指定组添加两个容量预留。

```
aws resource-groups group-resources \
    --group {{MyCRGroup}} \
    --resource-arns \
        arn:aws:ec2:{{sa-east-1}}:{{123456789012}}:capacity-reservation/{{cr-1234567890abcdef1}} \
        arn:aws:ec2:{{sa-east-1}}:{{123456789012}}:capacity-reservation/{{cr-54321abcdef567890}}
```

------
#### [ PowerShell ]

**向组中添加容量预留**  
使用 [Add-RGResource](https://docs.aws.amazon.com/powershell/latest/reference/items/Add-RGResource.html) cmdlet。

以下示例向指定组添加两个容量预留。

```
Add-RGResource `
    -Group {{MyCRGroup}} `
    -ResourceArn `
        "arn:aws:ec2:{{sa-east-1}}:{{123456789012}}:capacity-reservation/{{cr-1234567890abcdef1}}", `
        "arn:aws:ec2:{{sa-east-1}}:{{123456789012}}:capacity-reservation/{{cr-54321abcdef567890}}"
```

------
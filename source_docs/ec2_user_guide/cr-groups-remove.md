

# 从组中删除容量预留
<a name="cr-groups-remove"></a>

您可以随时从组中删除容量预留。定位到该组的实例将继续在其当前的容量预留中运行，不受删除操作的影响。该容量预留仅在您终止实例时才会恢复容量。

**注意**  
如果与您共享的容量预留随后被取消共享，Amazon EC2 会自动将其从组中删除。

------
#### [ Console ]

**从组中删除容量预留**  


1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 选择**容量预留资源组**。

1. 选择组名称以打开其详细信息页面。

1. 在**容量预留**部分，选择要删除的容量预留，然后选择**删除**。

------
#### [ AWS CLI ]

**从组中删除容量预留**  
使用 [ungroup-resources](https://docs.aws.amazon.com/cli/latest/reference/resource-groups/ungroup-resources.html) 命令。

以下示例从指定组中删除两个容量预留。

```
aws resource-groups ungroup-resources \
    --group {{MyCRGroup}} \
    --resource-arns \
        arn:aws:ec2:{{sa-east-1}}:{{123456789012}}:capacity-reservation/{{cr-0e154d26a16094dd}} \
        arn:aws:ec2:{{sa-east-1}}:{{123456789012}}:capacity-reservation/{{cr-54321abcdef567890}}
```

------
#### [ PowerShell ]

**从组中删除容量预留**  
使用 [Remove-RGResource](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-RGResource.html) cmdlet。

以下示例从指定组中删除两个容量预留。

```
Remove-RGResource `
    -Group {{MyCRGroup}} `
    -ResourceArn `
        "arn:aws:ec2:{{sa-east-1}}:{{123456789012}}:capacity-reservation/{{cr-0e154d26a16094dd}}", `
        "arn:aws:ec2:{{sa-east-1}}:{{123456789012}}:capacity-reservation/{{cr-54321abcdef567890}}"
```

------
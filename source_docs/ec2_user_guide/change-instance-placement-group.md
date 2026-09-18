

# 更改 Amazon EC2 实例的置放
<a name="change-instance-placement-group"></a>

可以如下所示更改实例的置放群组：
+ 将实例添加到置放群组
+ 将实例从一个置放群组移动到另一个置放群组
+ 从置放群组中删除实例

**要求**  
在更改实例的置放群组之前，该实例必须处于 `stopped` 状态。

------
#### [ Console ]

**更改实例置放**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 依次选择**操作**、**实例设置**、**修改实例放置**。

1. 对于**置放群组**，请执行以下操作之一：
   + 要将实例添加到置放群组，请选择该置放群组。
   + 要将实例从一个置放群组移动到另一个，请选择该置放群组。
   + 要从置放群组中移除实例，请选择**无**。

1. 选择**保存**。

------
#### [ AWS CLI ]

**将实例移动到置放群组**  
使用以下 [modify-instance-placement](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-placement.html) 命令。

```
aws ec2 modify-instance-placement \
    --instance-id {{i-0123a456700123456}} \
    --group-name {{MySpreadGroup}}
```

**从置放群组中删除实例**  
使用以下 [modify-instance-placement](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-placement.html) 命令。当您为置放群组名称指定空字符串时，这会将实例从当前所在的置放群组中移除。

```
aws ec2 modify-instance-placement \
    --instance-id {{i-0123a456700123456}} \
    --group-name ""
```

------
#### [ PowerShell ]

**将实例移动到置放群组**  
使用 [Edit-EC2InstancePlacement](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstancePlacement.html) cmdlet 和置放群组的名称。

```
Edit-EC2InstancePlacement `
    -InstanceId {{i-0123a456700123456}} `
    -GroupName {{MySpreadGroup}}
```

**从置放群组中删除实例**  
使用 [Edit-EC2InstancePlacement](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2InstancePlacement.html) cmdlet，并将置放群组名称设为空字符串。

```
Edit-EC2InstancePlacement `
    -InstanceId {{i-0123a456700123456}} `
    -GroupName ""
```

------
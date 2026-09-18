

# 创建组
<a name="cr-groups-create"></a>

您可以创建一个组来整理您的容量预留。创建组后，您可以向该组[添加容量预留](cr-groups-add.md)。

------
#### [ Console ]

**创建组**  


1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 选择**容量预留资源组**。

1. 选择**创建组**。

1. 输入组名称，可选择添加描述、容量预留和标签。

1. 选择**创建**。

------
#### [ AWS CLI ]

**为容量预留创建组**  
使用带以下请求参数的 [create-group](https://docs.aws.amazon.com/cli/latest/reference/resource-groups/create-group.html) AWS CLI 命令。
+ `AWS::EC2::CapacityReservationPool`：可确保容量预留资源组可以作为实例启动的目标。
+ `AWS::ResourceGroups::Generic`，并将 `allowed-resource-types` 设置为 `AWS::EC2::CapacityReservation`：可确保容量预留资源组仅接受容量预留。

```
aws resource-groups create-group \
    --name {{MyCRGroup}} \
    --configuration \
        '{"Type": "AWS::EC2::CapacityReservationPool"}' \
        '{"Type": "AWS::ResourceGroups::Generic", "Parameters": [{"Name": "allowed-resource-types", "Values": ["AWS::EC2::CapacityReservation"]}]}'
```

------
#### [ PowerShell ]

**为容量预留创建组**  
使用 [New-RGGroup](https://docs.aws.amazon.com/powershell/latest/reference/items/New-RGGroup.html) cmdlet。

```
New-RGGroup `
    -Name {{MyCRGroup}} `
    -Configuration `
        @{"Type"="AWS::EC2::CapacityReservationPool"} `
        @{"Type"="AWS::ResourceGroups::Generic"; "Parameters"=@{"allowed-resource-types"=@{"Values"="AWS::EC2::CapacityReservation"}}}
```

------

要创建仅接受特定实例类型的 UltraServer 容量块的组，请参阅[为 UltraServer 容量块创建容量预留资源组](cb-group.md)。
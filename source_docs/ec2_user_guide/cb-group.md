

# 为 UltraServer 容量块创建容量预留资源组
<a name="cb-group"></a>

您可以使用 AWS Resource Groups 创建 UltraServer 容量块的逻辑集合。创建容量预留资源组后，您可以添加您账户中拥有的 UltraServer 容量块。添加 UltraServer 容量块后，您可以将实例启动定位到容量预留资源组，而不是单个容量块。定位到容量预留资源组的实例与组中具有匹配属性和可用容量的任何 UltraServer 容量块匹配。如果容量预留资源组没有具有匹配属性和可用容量的 UltraServer 容量块，则实例启动失败。

如果在 UltraServer 容量块有正在运行的实例时将其从容量预留资源组中删除，则这些实例将继续在容量块中运行。如果组中的 UltraServer 容量块在具有正在运行的实例时结束，则实例将终止。

要将实例容量块添加到某个容量预留资源组，请参阅[容量预留资源组](cr-groups.md)。

要为 UltraServer 容量块创建容量预留资源组，请使用以下方法之一。

------
#### [ AWS CLI ]

**为 UltraServer 容量块创建容量预留资源组**  
使用 [create-group](https://docs.aws.amazon.com/cli/latest/reference/resource-groups/create-group.html) AWS CLI 命令，并为 `--configuration` 指定以下内容：

```
{
  "Configuration": [
    {
      "Type": "AWS::EC2::CapacityReservationPool",
      "Parameters": [
        {
          "Name": "instance-type",
          "Values": [
            "{{instance_type}}"
          ]
        },
        {
          "Name": "reservation-type",
          "Values": [
            "capacity-block"
          ]
        }
      ]
    },
    {
      "Type": "AWS::ResourceGroups::Generic",
      "Parameters": [
        {
          "Name": "allowed-resource-types",
          "Values": [
            "AWS::EC2::CapacityReservation"
          ]
        }
      ]
    }
  ]
}
```

------
#### [ PowerShell ]

**为 UltraServer 容量块创建容量预留资源组**  
使用 [New-RGGroup](https://docs.aws.amazon.com/powershell/latest/reference/items/New-RGGroup.html) cmdlet。对于 `-Configuration`，请指定以下内容：

```
{
  "Configuration": [
    {
      "Type": "AWS::EC2::CapacityReservationPool",
      "Parameters": [
        {
          "Name": "instance-type",
          "Values": [
            "{{instance_type}}"
          ]
        },
        {
          "Name": "reservation-type",
          "Values": [
            "capacity-block"
          ]
        }
      ]
    },
    {
      "Type": "AWS::ResourceGroups::Generic",
      "Parameters": [
        {
          "Name": "allowed-resource-types",
          "Values": [
            "AWS::EC2::CapacityReservation"
          ]
        }
      ]
    }
  ]
}
```

------

**注意**  
要向现有仅限 UltraServer 的组中添加不同容量预留，必须先使用 [put-group-configuration](https://docs.aws.amazon.com/cli/latest/reference/resource-groups/put-group-configuration.html) API 修改组配置，然后删除 `instance-type` 和 `reservation-type` 配置部分。完成后，请参阅[容量预留资源组](cr-groups.md)了解更多分组操作。

为 UltraServer 容量块创建容量预留资源组后，使用以下方法之一将现有的 UltraServer 容量块添加到其中。

------
#### [ AWS CLI ]

**将 UltraServer 容量块添加到容量预留资源组**  
使用 [group-resources](https://docs.aws.amazon.com/cli/latest/reference/resource-groups/group-resources.html) 命令。对于 `--group`，请指定您创建的容量预留资源组的名称。对于 `--resource-arns`，请指定要添加的 UltraServer 容量块的 ARN。

```
aws resource-groups group-resources \
--group {{MyCRGroup}} \
--resource-arns {{CapacityReservationArn}}
```

------
#### [ PowerShell ]

**将 UltraServer 容量块添加到容量预留资源组**  
使用 [Add-RGResource](https://docs.aws.amazon.com/powershell/latest/reference/items/Add-RGResource.html) cmdlet。对于 `-Group`，请指定您创建的容量预留资源组的名称。对于 `-ResourceArn `，请指定要添加的 UltraServer 容量块的 ARN。

以下示例向指定组添加两个容量预留。

```
Add-RGResource `
-Group {{MyCRGroup}} `
-ResourceArn {{CapacityReservationArn}}
```

------
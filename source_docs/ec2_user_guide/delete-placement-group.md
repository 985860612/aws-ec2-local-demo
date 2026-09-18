

# 删除置放群组
<a name="delete-placement-group"></a>

如果您需要替换或不再需要某个置放群组，您可以将其删除。在删除置放群组之前，该群组中不能包含任何实例。您可以终止实例，将这些实例移动到另一个置放群组，或者将其从置放群组中删除。

您无法删除作为集群置放群组父级的置放群组。先删除集群置放群组。

------
#### [ Console ]

**删除置放群组**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Placement Groups**。

1. 选择该置放群组，然后依次选择**操作**、**删除**。

1. 提示进行确认时，输入 **Delete**，然后选择 **Delete**（删除）。

------
#### [ AWS CLI ]

**删除置放群组**  
使用 [delete-placement-group](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-placement-group.html) 命令。

```
aws ec2 delete-placement-group --group-name {{my-cluster}}
```

------
#### [ PowerShell ]

**删除置放群组**  
使用 [Remove-EC2PlacementGroup](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2PlacementGroup.html) cmdlet。

```
Remove-EC2PlacementGroup -GroupName {{my-cluster}}
```

------
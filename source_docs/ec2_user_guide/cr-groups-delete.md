

# 删除组
<a name="cr-groups-delete"></a>

如果不再需要您的组，可以随时将其删除。将具有正在运行的实例和处于活动状态的容量预留的组删除时，定位到该组的实例将在组删除后继续在其当前容量预留中运行。当您终止实例时，Amazon EC2 会将容量恢复到容量预留中。

------
#### [ Console ]

**删除组**  


1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量预留**。

1. 选择**容量预留资源组**。

1. 选择要删除的组，选择**操作**，然后选择**删除**。

1. 当系统提示进行确认时，选择**删除**。

------
#### [ AWS CLI ]

**删除组**  
使用 [delete-group](https://docs.aws.amazon.com/cli/latest/reference/resource-groups/delete-group.html) 命令。

```
aws resource-groups delete-group --group {{MyCRGroup}}
```

------
#### [ PowerShell ]

**删除组**  
使用 [Remove-RGGroup](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-RGGroup.html) cmdlet。

```
Remove-RGGroup -GroupName {{MyCRGroup}}
```

------
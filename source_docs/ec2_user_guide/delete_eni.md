

# 删除网络接口
<a name="delete_eni"></a>

删除网络接口之后，所有与该接口关联的属性都会被释放，而且所有私有 IP 地址或弹性 IP 地址也都会被释放以供另一个实例使用。

您无法删除正在使用的网络接口。首先，您必须[分离网络接口](network-interface-attachments.md#detach_eni)。

------
#### [ Console ]

**删除网络接口**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Network Interfaces**。

1. 选中网络接口的复选框，然后依次选择**操作**、**删除**。

1. 当系统提示进行确认时，选择 **Delete (删除)**。

------
#### [ AWS CLI ]

**删除网络接口**  
使用以下 [delete-network-interface](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-network-interface.html) 命令。

```
aws ec2 delete-network-interface --network-interface-id {{eni-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**删除网络接口**  
使用 [Remove-EC2NetworkInterface](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2NetworkInterface.html) cmdlet。

```
Remove-EC2NetworkInterface -NetworkInterfaceId {{eni-1234567890abcdef0}}
```

------
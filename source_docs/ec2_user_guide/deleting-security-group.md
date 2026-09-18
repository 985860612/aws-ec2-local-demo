

# 删除 Amazon EC2 安全组
<a name="deleting-security-group"></a>

使用完为使用 Amazon EC2 实例创建的安全组后，可以将其删除。

**要求**
+ 安全组不能与实例或网络接口关联。
+ 其他安全组中的规则无法引用安全组。

------
#### [ Console ]

**删除安全组**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. （可选）要验证安全组是否未与实例关联，请执行以下操作：

   1. 在导航窗格中，选择**安全组**。

   1. 复制要删除的安全组的 ID。

   1. 在导航窗格中，选择 **Instances (实例)**。

   1. 在搜索栏中，添加**安全组 ID 等于**筛选条件，再粘贴安全组的 ID。若没有结果，则安全组未与实例关联。若有结果，则必须取消关联安全组，才能将其删除。

1. 在导航窗格中，选择**安全组**。

1. 选择安全组，然后依次选择**操作**、**删除安全组**。

1. 如果选择了多个安全组，系统会提示您进行确认。如果某些安全组无法删除，我们会显示每个安全组的状态，表明是否会被删除。要确认删除操作，请输入**删除**。

1. 选择**删除**。

------
#### [ AWS CLI ]

**删除安全组**  
使用以下 [delete-security-group](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-security-group.html) 命令。

```
aws ec2 delete-security-group --group-id {{sg-1234567890abcdef0}}
```

------
#### [ PowerShell ]

**删除安全组**  
使用 [Remove-EC2SecurityGroup](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2SecurityGroup.html) cmdlet。

```
Remove-EC2SecurityGroup -GroupId {{sg-1234567890abcdef0}}
```

------
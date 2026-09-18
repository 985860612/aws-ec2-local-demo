

# 配置委托管理员
<a name="enable-capacity-manager-da"></a>

您可以为容量管理器注册委派管理员。这使得成员账户能够为您的 AWS Organization 管理容量管理器。只有管理账户才能在您的组织内注册或移除委派管理员。

**注意**  
如果已有注册的委派管理员，则无法为组织禁用容量管理器。

**Topics**
+ [先决条件](#da-prerequisites)
+ [注册委派管理员](#add-capacity-manager-da)
+ [移除委托管理员](#remove-capacity-manager-da)

## 先决条件
<a name="da-prerequisites"></a>

您的管理账户必须已使用 AWS Organizations 启用容量管理器。有关更多信息，请参阅 [使用 AWS Organizations 启用 EC2 容量管理器](enable-capacity-manager-organizations.md)。

## 注册委派管理员
<a name="add-capacity-manager-da"></a>

您可以使用 Amazon EC2 控制台、AWS CLI 或 PowerShell 注册委派管理员。

------
#### [ Console ]

**注册委派管理员**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量管理器**。

1. 选择**设置**选项卡。

1. 在**委派管理员**部分中，选择**添加**。

1. 在出现的提示中，输入您要添加为委派管理员的组织成员的账户 ID。

1. 选择 **Add delegated administrator (添加委派管理员)**。

------
#### [ AWS CLI ]

**注册委派管理员**  
运行以下命令：

```
aws organizations register-delegated-administrator \
    --account-id {{123456789012}} \
    --service-principal ec2.capacitymanager.amazonaws.com
```

------
#### [ PowerShell ]

**注册委派管理员**  
使用 [Register-ORGDelegatedAdministrator](https://docs.aws.amazon.com/powershell/latest/reference/items/Register-ORGDelegatedAdministrator.html) cmdlet。

```
Register-ORGDelegatedAdministrator `
    -AccountId "{{123456789012}}" `
    -ServicePrincipal "ec2.capacitymanager.amazonaws.com"
```

------

## 移除委托管理员
<a name="remove-capacity-manager-da"></a>

您可以使用 Amazon EC2 控制台、AWS CLI 或 PowerShell 移除委派管理员。

------
#### [ Console ]

**要移除委派管理员**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**容量管理器**。

1. 选择**设置**选项卡。

1. 在**委派管理员**部分中，选择**管理**。

1. 在出现的提示中，选择**移除委派管理员**。

------
#### [ AWS CLI ]

**要移除委派管理员**  
运行以下命令：

```
aws organizations deregister-delegated-administrator \
    --account-id {{123456789012}} \
    --service-principal ec2.capacitymanager.amazonaws.com
```

------
#### [ PowerShell ]

**要移除委派管理员**  
使用 [Unregister-ORGDelegatedAdministrator](https://docs.aws.amazon.com/powershell/latest/reference/items/Unregister-ORGDelegatedAdministrator.html) cmdlet。

```
Unregister-ORGDelegatedAdministrator `
    -AccountId "{{123456789012}}" `
    -ServicePrincipal "ec2.capacitymanager.amazonaws.com"
```

------
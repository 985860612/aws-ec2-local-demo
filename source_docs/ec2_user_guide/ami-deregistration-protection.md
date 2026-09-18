

# Amazon EC2 AMI 取消注册保护
<a name="ami-deregistration-protection"></a>

您可以在 AMI 上开启*取消注册保护*，以防止意外或恶意删除。开启取消注册保护后，任何用户都无法取消注册该 AMI，无论其 IAM 权限如何。如果要取消注册该 AMI，则必须首先关闭其上的取消注册保护。

在 AMI 上开启取消注册保护时，您可以选择包含 24 小时的冷却时间。此冷却时间是取消注册保护在您关闭后仍然有效的时间。在此冷却时间内，该 AMI 无法取消注册。冷却时间结束后，可以取消注册该 AMI。

所有现有和新的 AMI 都会默认关闭取消注册保护。

## 开启取消注册保护
<a name="enable-deregistration-protection"></a>

使用以下过程开启取消注册保护。

------
#### [ Console ]

**开启注销保护**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 在筛选条件栏中，选择**我拥有的**可列出可用的 AMI，选择**已禁用的映像**可列出已禁用的 AMI。

1. 选择要开启取消注册保护的 AMI，然后选择**操作**、**管理 AMI 注销保护**。

1. 在**管理 AMI 取消注册保护**对话框中，您可以在带冷却时间或不带冷却时间的情况下开启取消注册保护。请选择以下选项之一：
   + **启用并包含 24 小时的冷却时间** – 有冷却时间，取消注册保护关闭后 24 小时内无法取消注册 AMI。
   + **启用但无冷却时间** – 无冷却时间，取消注册保护关闭后可以立即取消注册 AMI。

1. 选择**保存**。

------
#### [ AWS CLI ]

**开启注销保护**  
使用 [enable-image-deregistration-protection](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-image-deregistration-protection.html) 命令。要启用可选的冷却时间，请添加 `--with-cooldown` 选项。

```
aws ec2 enable-image-deregistration-protection \
    --image-id {{ami-0abcdef1234567890}} \
    --with-cooldown
```

------
#### [ PowerShell ]

**开启注销保护**  
使用 [Enable-EC2ImageDeregistrationProtection](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-EC2ImageDeregistrationProtection.html) cmdlet。要启用可选的冷却时间，请将 `-WithCooldown` 参数设置为 `true`。

```
Enable-EC2ImageDeregistrationProtection `
    -ImageId {{ami-0abcdef1234567890}} `
    -WithCooldown $true
```

------

## 关闭取消注册保护
<a name="disable-deregistration-protection"></a>

使用以下过程关闭取消注册保护。

如果您在为 AMI 开启取消注册保护时选择了包含 24 小时冷却时间的选项，则在您关闭取消注册保护后，您将无法立即取消注册 AMI。此冷却时间为 24 小时，是取消注册保护在您关闭后仍然有效的时间。在此冷却时间内，该 AMI 无法取消注册。冷却时间结束后，可以取消注册该 AMI。

------
#### [ Console ]

**关闭注销保护**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 在筛选条件栏中，选择**我拥有的**可列出可用的 AMI，选择**已禁用的映像**可列出已禁用的 AMI。

1. 选择要关闭取消注册保护的 AMI，然后选择**操作**、**管理 AMI 取消注册保护**。

1. 在**管理 AMI 取消注册保护**对话框中，选择**禁用**。

1. 选择**保存**。

------
#### [ AWS CLI ]

**关闭注销保护**  
使用 [disable-image-deregistration-protection](https://docs.aws.amazon.com/cli/latest/reference/ec2/disable-image-deregistration-protection.html) 命令。

```
aws ec2 disable-image-deregistration-protection --image-id {{ami-0abcdef1234567890}}
```

------
#### [ PowerShell ]

**关闭注销保护**  
使用 [Disable-EC2ImageDeregistrationProtection](https://docs.aws.amazon.com/powershell/latest/reference/items/Disable-EC2ImageDeregistrationProtection.html) cmdlet。

```
Disable-EC2ImageDeregistrationProtection -ImageId {{ami-0abcdef1234567890}}
```

------
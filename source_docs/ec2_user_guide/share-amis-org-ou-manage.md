

# 管理与组织或 OU 共享的 AMI
<a name="share-amis-org-ou-manage"></a>

您可以使用组织和组织部门（OU）来管理 AMI 共享，从而控制其是否可以启动 Amazon EC2 实例。

## 查看共享 AMI 的企业和 OU
<a name="decribe-ami-launch-permissions"></a>

可以查找与 AMI 共享的组织和组织单元。

------
#### [ Console ]

**检查您与哪些组织和组织单位共享了 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 在列表中选择您的 AMI，选择 **Permissions**（权限）选项卡，然后向下滚动到 **Shared organizations/OUs**（共享企业/OU）。

   要查找与您共享的 AMI，请参阅[查找用于 Amazon EC2 实例的共享 AMI](usingsharedamis-finding.md)。

------
#### [ AWS CLI ]

**检查您与哪些组织和组织单位共享了 AMI**  
使用带 `launchPermission` 属性的 [describe-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-image-attribute.html) 命令。

```
aws ec2 describe-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --attribute launchPermission
```

以下为响应示例。

```
{
    "ImageId": "ami-0abcdef1234567890",
    "LaunchPermissions": [
        {
            "OrganizationalUnitArn": "arn:aws:organizations::111122223333:ou/o-123example/ou-1234-5example"
        }
    ]
}
```

------
#### [ PowerShell ]

**检查您与哪些组织和组织单位共享了 AMI**  
使用 [Get-EC2ImageAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageAttribute.html) cmdlet。

```
Get-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -Attribute launchPermission
```

------

## 与组织或 OU 共享 AMI
<a name="share-amis-org-ou"></a>

可以与组织或组织单元共享 AMI。

**注意**  
您无需共享 AMI 所引用的 Amazon EBS 快照即可共享该 AMI。只需共享 AMI 本身，系统会自动为实例提供访问所引用 EBS 快照的权限，以便启动。不过，您确实需要共享用于对 AMI 引用的快照加密的 KMS 密钥。有关更多信息，请参阅 [允许企业和 OU 使用 KMS 密钥](allow-org-ou-to-use-key.md)。

------
#### [ Console ]

**与企业或 OU 共享 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 在列表中选择您的 AMI，然后选择 **Actions**、**然后选择 Edit AMI Permissions**。

1. 在 **AMI availability**（AMI 可用性）下，选择 **Private**（私有）。

1. 在 **Shared organizations/OUs**（共享企业/OU）旁，选择 **Add organization/OU ARN**（添加企业/OU ARN）。

1. 对于 **Organization/OU ARN**（企业/OU ARN），输入要与之共享 AMI 的企业 ARN 或 OU ARN，然后选择 **Share AMI**（共享 AMI）。请注意，您必须指定完整 ARN，而不仅仅是 ID。

   要与多个企业或 OU 共享此 AMI，请重复此步骤，直至您添加完所需全部企业或 OU。

1. 完成后，选择 **Save changes (保存更改)**。

1. （可选）要查看您已共享 AMI 的企业或 OU，请在列表中选择此 AMI，然后选择 **Permissions**（权限）选项卡，然后向下滚动到 **Shared organizations/OUs**（共享企业/OU）。要查找与您共享的 AMI，请参阅[查找用于 Amazon EC2 实例的共享 AMI](usingsharedamis-finding.md)。

------
#### [ AWS CLI ]

**与组织共享 AMI**  
使用 [modify-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-image-attribute.html) 命令，向指定组织授予指定 AMI 的启动权限。

```
aws ec2 modify-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --launch-permission "Add=[{OrganizationArn=arn:aws:organizations::{{123456789012}}:organization/{{o-123example}}}]"
```

**与组织单位共享 AMI**  
[modify-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-image-attribute.html) 命令向指定 OU 授予指定 AMI 的启动许可。请注意，您必须指定完整 ARN，而不仅仅是 ID。

```
aws ec2 modify-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --launch-permission "Add=[{OrganizationalUnitArn=arn:aws:organizations::{{123456789012}}:ou/{{o-123example}}/{{ou-1234-5example}}}]"
```

------
#### [ PowerShell ]

使用 [Edit-EC2ImageAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2ImageAttribute.html) 命令（适用于 Windows PowerShell 的工具）共享 AMI，如以下示例所示。

**与企业或 OU 共享 AMI**  
以下命令向指定企业授予指定 AMI 的启动许可。

```
Edit-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -Attribute launchPermission `
    -OperationType add `
    -OrganizationArn "arn:aws:organizations::{{123456789012}}:organization/{{o-123example}}"
```

**停止与企业或 OU 共享 AMI**  
以下命令从指定企业中删除指定 AMI 的启动许可：

```
Edit-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -Attribute launchPermission `
    -OperationType remove `
    -OrganizationArn "arn:aws:organizations::{{123456789012}}:organization/{{o-123example}}"
```

**停止与所有组织、OU 和 AWS 账户 共享 AMI**  
以下命令从指定 AMI 中删除所有公用和显式启动许可。请注意，AMI 的拥有者始终具有启动许可，因此不受该命令影响。

```
Reset-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -Attribute launchPermission
```

------

## 停止与组织或 OU 共享 AMI
<a name="stop-sharing-amis-org-ou"></a>

可以停止与组织或组织单元共享 AMI。

**注意**  
如果某个特定账户位于您与之共享 AMI 的企业或 OU 中，则您无法停止与该账户共享 AMI 如果您尝试通过删除账户的启动许可来停止共享 AMI，Amazon EC2 将返回成功消息。但是，AMI 将继续与账户共享。

------
#### [ Console ]

**停止与企业或 OU 共享 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 在列表中选择您的 AMI，然后选择 **Actions**、**然后选择 Edit AMI Permissions**。

1. 在 **Shared organizations/OUs**（共享企业/OU）下，选择要停止共享 AMI 的企业或 OU，然后选择 **Remove selected**（删除所选）。

1. 完成后，选择 **Save changes (保存更改)**。

1. （可选）要确认您已停止与企业或 OU 共享 AMI，请在列表中选择此 AMI，然后选择 **Permissions**（权限）选项卡，然后向下滚动到 **Shared organizations/OUs**（共享企业/OU）。

------
#### [ AWS CLI ]

**停止与企业或 OU 共享 AMI**  
使用 [modify-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-image-attribute.html) 命令。此示例从指定组织中删除指定 AMI 的启动权限。

```
aws ec2 modify-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --launch-permission "Remove=[{OrganizationArn=arn:aws:organizations::{{123456789012}}:organization/{{o-123example}}}]"
```

**停止与所有组织、OU 和 AWS 账户 共享 AMI**  
使用 [reset-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/reset-image-attribute.html) 命令。此示例从指定 AMI 中删除所有公有和显式启动权限。请注意，AMI 的拥有者始终具有启动许可，因此不受该命令影响。

```
aws ec2 reset-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --attribute launchPermission
```

------
#### [ PowerShell ]

**停止与企业或 OU 共享 AMI**  
使用 [Edit-EC2ImageAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2ImageAttribute.html) cmdlet。此示例从指定组织中删除指定 AMI 的启动权限。

```
Edit-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -Attribute launchPermission `
    -OperationType remove `
    -OrganizationArn "arn:aws:organizations::{{123456789012}}:organization/{{o-123example}}"
```

**停止与所有组织、OU 和 AWS 账户 共享 AMI**  
使用 [Reset-EC2ImageAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Reset-EC2ImageAttribute.html) cmdlet。此示例从指定 AMI 中删除所有公有和显式启动权限。请注意，AMI 的拥有者始终具有启动许可，因此不受该命令影响。

```
Reset-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -Attribute LaunchPermission
```

------
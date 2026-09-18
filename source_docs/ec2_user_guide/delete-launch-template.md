

# 删除启动模板或启动模板版本
<a name="delete-launch-template"></a>

如果不再需要某个启动模板，您可以将其删除。如果删除启动模板，则会删除该模板的所有版本。如果只想删除启动模板的某个特定版本，可以在保留启动模板其他版本的同时删除该版本。

删除启动模板或启动模板版本不会影响您从启动模板启动的任何实例。

## 删除启动模板及其所有版本
<a name="delete-launch-template-including-versions"></a>

如果不再需要某个启动模板（包括其所有版本），您可以删除该启动模板。如果删除启动模板，则会删除该模板的所有版本。

------
#### [ Console ]

**删除启动模板及其所有版本**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Launch Templates**。

1. 选择启动模板，然后依次选择**操作**、**删除模板**。

1. 输入 **Delete** 以确认删除，然后选择**删除**。

------
#### [ AWS CLI ]

**删除启动模板及其所有版本**  
使用 [delete-launch-template](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-launch-template.html) 命令，并指定启动模板。

```
aws ec2 delete-launch-template --launch-template-id {{lt-01238c059e3466abc}}
```

------
#### [ PowerShell ]

**删除启动模板及其所有版本**  
使用 [Remove-EC2LaunchTemplate](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2LaunchTemplate.html)（AWS Tools for PowerShell）命令，并指定启动模板。如果省略 `-Force`，PowerShell 会提示您进行确认。

```
Remove-EC2LaunchTemplate -LaunchTemplateId {{lt-0123456789example}} -Force
```

------

## 删除启动模板版本
<a name="delete-launch-template-version"></a>

如果不再需要某个启动模板版本，您可以将其删除。

**注意事项**
+ 在删除该版本后，您将无法替换版本号。
+ 您无法删除启动模板的默认版本；您必须先分配一个不同的版本以作为默认版本。如果默认版本是启动模板的唯一版本，您必须[删除整个启动模板](#delete-launch-template)。
+ 使用控制台时，一次可以删除一个启动模板版本。使用 AWS CLI 时，您可以在单个请求中删除多达 200 个启动模板版本。要在单个请求中删除 200 多个版本，您可以[删除启动模板](#delete-launch-template)，这样还会删除其所有版本。

------
#### [ Console ]

**删除启动模板版本**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Launch Templates**。

1. 选择启动模板，然后依次选择**操作**、**删除模板版本**。

1. 选择要删除的版本，然后选择**删除**。

------
#### [ AWS CLI ]

**删除启动模板版本**  
使用 [delete-launch-template-versions](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-launch-template-versions.html) 命令，并指定要删除的版本号。您可以在单个请求中删除多达 200 个启动模板版本。

```
aws ec2 delete-launch-template-versions \
    --launch-template-id {{lt-0abcd290751193123}} \
    --versions {{1}}
```

------
#### [ PowerShell ]

**删除启动模板版本**  
使用 [Remove-EC2TemplateVersion](https://docs.aws.amazon.com/powershell/latest/reference/items/Remove-EC2TemplateVersion.html) cmdlet 并指定要删除的版本号。您可以在单个请求中删除多达 200 个启动模板版本。

```
Remove-EC2TemplateVersion `
    -LaunchTemplateId {{lt-0abcd290751193123}} `
    -Version {{1}}
```

------
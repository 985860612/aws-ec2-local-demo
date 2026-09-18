

# 修改启动模板（管理启动模板版本）
<a name="manage-launch-template-versions"></a>

启动模板是不可变的；在创建启动模板之后，您无法修改它。相反，您可以创建包含所需更改的新版本启动模板。

您可以创建不同版本的启动模板，设置默认版本，描述启动模板版本以及[删除不再需要的版本](delete-launch-template.md#delete-launch-template-version)。

**Topics**
+ [创建启动模板版本](#create-launch-template-version)
+ [设置默认启动模板版本](#set-default-launch-template-version)
+ [描述启动模板版本](#describe-launch-template-version)

## 创建启动模板版本
<a name="create-launch-template-version"></a>

在创建启动模板版本时，您可以指定新的启动参数，或者将现有版本作为基础以创建新的版本。有关每个参数的说明，请参阅[Amazon EC2 实例配置参数参考](ec2-instance-launch-parameters.md)。

------
#### [ Console ]

**创建启动模板版本**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Launch Templates**。

1. 选择启动模板，然后依次选择**操作**、**修改模板（创建新版本）**。

1. 对于 **Template version description**（模板版本说明），输入此版本启动模板的说明。

1. （可选）展开 **Source template (源模板)** ，然后选择要用作新启动模板版本基础的启动模板版本。新启动模板版本从此启动模板版本继承启动参数。

1. 根据需要修改启动参数。

1. 选择**Create launch template**（创建启动模板）。

------
#### [ AWS CLI ]

**创建启动模板版本**  
使用 [create-launch-template-version](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-launch-template-version.html) 命令。您可以指定新版本所基于的源版本。新版本从此版本继承启动参数，您可以使用 `--launch-template-data` 覆盖参数。以下示例根据启动模板的版本 1 创建新的版本并指定不同的 AMI ID。

```
aws ec2 create-launch-template-version \
    --launch-template-id {{lt-0abcd290751193123}} \
    --version-description {{WebVersion2}} \
    --source-version {{1}} \
    --launch-template-data "ImageId={{ami-0abcdef1234567890}}"
```

------
#### [ PowerShell ]

**创建启动模板版本**  
使用 [New-EC2LaunchTemplateVersion](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2LaunchTemplateVersion.html) Cmdlet。您可以指定新版本所基于的源版本。新版本从此版本继承启动参数，您可以使用 `LaunchTemplateData` 覆盖参数。以下示例根据启动模板的版本 1 创建新的版本并指定不同的 AMI ID。

```
New-EC2LaunchTemplateVersion `
    -LaunchTemplateId {{lt-0abcd290751193123}} `
    -VersionDescription {{WebVersion2}} `
    -SourceVersion {{1}} `
    -LaunchTemplateData (
        New-Object `
            -TypeName Amazon.EC2.Model.RequestLaunchTemplateData `
            -Property @{ImageId = '{{ami-0abcdef1234567890}}'}
    )
```

------

## 设置默认启动模板版本
<a name="set-default-launch-template-version"></a>

您可以设置启动模板的默认版本。如果通过启动模板启动实例并且未指定版本，将使用默认版本的参数启动实例。

------
#### [ Console ]

**设置默认启动模板版本**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Launch Templates**。

1. 选择启动模板，然后依次选择**操作**及**设置默认版本**。

1. 对于 **Template version (模板版本)**，选择要设置为默认版本的版本号，然后选择 **Set as default version (设置为默认版本)**。

------
#### [ AWS CLI ]

**设置默认启动模板版本**  
使用 [modify-launch-template](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-launch-template.html) 命令。

```
aws ec2 modify-launch-template \
    --launch-template-id {{lt-0abcd290751193123}} \
    --default-version {{2}}
```

------
#### [ PowerShell ]

**设置默认启动模板版本**  
使用 [Edit-EC2LaunchTemplate](https://docs.aws.amazon.com/powershell/latest/reference/items/Edit-EC2LaunchTemplate.html) cmdlet。

```
Edit-EC2LaunchTemplate `
    -LaunchTemplateId {{lt-0abcd290751193123}} `
    -DefaultVersion {{2}}
```

------

## 描述启动模板版本
<a name="describe-launch-template-version"></a>

使用控制台，您可以查看所选启动模板的所有版本，或获取其最新版本或默认版本与特定版本号匹配的启动模板列表。使用 AWS CLI，您可以描述指定启动模板的所有版本、单个版本或一系列版本。您还可以描述账户中所有启动模板的所有最新版本或所有默认版本。

------
#### [ Console ]

**描述启动模板版本**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **Launch Templates**。

1. 您可以查看特定启动模板的某个版本，或获取其最新版本或默认版本与特定版本号匹配的启动模板列表。
   + 要查看启动模板的版本，请执行以下操作：选择启动模板。在**版本**选项卡上，从**版本**中选择一个版本，以查看其详细信息。
   + 要获取最新版本与特定版本号匹配的所有启动模板的列表，请执行以下操作：从搜索栏中选择**最新版本**，然后选择版本号。
   + 要获取其默认版本与特定版本号匹配的所有启动模板的列表，请执行以下操作：从搜索栏中选择**默认版本**，然后选择版本号。

------
#### [ AWS CLI ]

**描述启动模板版本**  
使用 [describe-launch-template-versions](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-launch-template-versions.html) 命令，并指定版本号。在以下示例中，指定了版本 `{{1}}` 和 {{`3`}}。

```
aws ec2 describe-launch-template-versions \
    --launch-template-id {{lt-0abcd290751193123}} \
    --versions {{1 3}}
```

**描述您账户中最新的和默认的启动模板版本**  
使用 [describe-launch-template-versions](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-launch-template-versions.html) 命令并指定 `$Latest` 和/或 `$Default`。您必须在调用中省略启动模板 ID 和名称。您不能指定版本号。

```
aws ec2 describe-launch-template-versions \
    --versions "{{$Latest}},{{$Default}}"
```

------
#### [ PowerShell ]

**描述启动模板版本**  
使用 [Get-EC2TemplateVersion](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2TemplateVersion.html) Cmdlet 并指定版本号。在以下示例中，指定了版本 `{{1}}` 和 {{`3`}}。

```
Get-EC2TemplateVersion `
    -LaunchTemplateId {{lt-0abcd290751193123}} `
    -Version {{1,3}}
```

**描述您账户中最新的和默认的启动模板版本**  
使用 [Get-EC2TemplateVersion](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2TemplateVersion.html) Cmdlet 并指定 `$Latest`、`$Default` 或两者。您必须在调用中省略启动模板 ID 和名称。您不能指定版本号。

```
Get-EC2TemplateVersion `
    -Version '{{$Latest}}','{{$Default}}'
```



------
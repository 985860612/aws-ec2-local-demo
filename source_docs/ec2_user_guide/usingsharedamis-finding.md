

# 查找用于 Amazon EC2 实例的共享 AMI
<a name="usingsharedamis-finding"></a>

您可使用 Amazon EC2 控制台或命令行查找与您的 Amazon EC2 实例一起使用的共享 AMI。

AMI 是一种区域性资源。在搜索共享 AMI（公有或私有）时，必须在共享此 AMI 的同一区域中进行搜索。要使 AMI 能够在其他区域使用，请将该 AMI 复制到该区域，然后进行共享。有关更多信息，请参阅 [复制 Amazon EC2 AMI](CopyingAMIs.md)。

------
#### [ Console ]

控制台提供了一个 AMI 筛选条件字段。您也可以使用**搜索**字段中提供的筛选条件来确定搜索范围。

**查找共享 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 在第一个筛选条件中，选择以下选项之一：
   + **私有映像** – 列出共享给您的所有 AMI。
   + **公有映像** – 列出所有公有 AMI。

1. （可选）要仅显示 Amazon 提供的公有映像，请选择**搜索**字段，然后从菜单选项中选择**所有者别名**，再选择 **=**，然后选择 **amazon**。

1. （可选）添加筛选条件，将搜索范围限定为符合您要求的 AMI。

**查找来自[经过验证的提供商](sharing-amis.md#verified-ami-provider)的共享公共 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI Catalog**（AMI 目录）。

1. 选择**社区 AMI**。

1. 在**优化结果**窗格中，选择**经过验证的提供商**。**经过验证的提供商**标签指示相关 AMI 是由 Amazon 或经过验证的合作伙伴提供。

------
#### [ AWS CLI ]

使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令列出 AMI。可以将该列表范围确定为所需的 AMI 类型，如以下示例所示。

**列出所有公用 AMI**  
以下命令将列出所有公用 AMI，包括您拥有的所有公用 AMI。

```
aws ec2 describe-images --executable-users all
```

**列出拥有显式启动许可的 AMI**  
以下命令列出您对其拥有显式启动许可的 AMI。此列表不包括您拥有的任何 AMI。

```
aws ec2 describe-images --executable-users self
```

**列出经过验证的提供商拥有的 AMI**  
以下命令将列出[经过验证的提供商](sharing-amis.md#verified-ami-provider)拥有的 AMI。经过验证的提供商（Amazon 或经过验证的合作伙伴）拥有的公共 AMI 具有一个别名拥有者，它将在账户字段中显示为 `amazon`、`aws-backup-vault` 或 `aws-marketplace`。这可帮助您轻松查找来自经过验证的提供商的 AMI。其他用户不能对其 AMI 使用别名。

```
aws ec2 describe-images \
    --owners amazon aws-marketplace \
    --query 'Images[*].[ImageId]' \
    --output text
```

**列出账户拥有的 AMI**  
以下命令列出指定 AWS 账户 拥有的 AMI。

```
aws ec2 describe-images --owners {{123456789012}}
```

**使用筛选条件确定 AMI 的范围**  
要减少显示的 AMI 数量，请使用筛选条件只列出您感兴趣的 AMI 类型。例如，使用以下筛选条件可以只显示 EBS 支持的 AMI。

```
--filters "Name=root-device-type,Values=ebs"
```

------
#### [ PowerShell ]

使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet（Tools for Windows PowerShell）列出 AMI。可以将该列表范围确定为所需的 AMI 类型，如以下示例所示。

**列出所有公用 AMI**  
以下命令将列出所有公用 AMI，包括您拥有的所有公用 AMI。

```
Get-EC2Image -ExecutableUser all
```

**列出拥有显式启动许可的 AMI**  
以下命令列出您对其拥有显式启动许可的 AMI。此列表不包括您拥有的任何 AMI。

```
Get-EC2Image -ExecutableUser self
```

**列出经过验证的提供商拥有的 AMI**  
以下命令将列出[经过验证的提供商](sharing-amis.md#verified-ami-provider)拥有的 AMI。经过验证的提供商（Amazon 或经过验证的合作伙伴）拥有的公共 AMI 具有一个别名拥有者，它将在账户字段中显示为 `amazon`、`aws-backup-vault` 或 `aws-marketplace`。这可帮助您轻松查找来自经过验证的提供商的 AMI。其他用户不能对其 AMI 使用别名。

```
Get-EC2Image -Owner amazon aws-marketplace
```

**列出账户拥有的 AMI**  
以下命令列出指定 AWS 账户 拥有的 AMI。

```
Get-EC2Image -Owner {{123456789012}}
```

**使用筛选条件确定 AMI 的范围**  
要减少显示的 AMI 数量，请使用筛选条件只列出您感兴趣的 AMI 类型。例如，使用以下筛选条件可以只显示 EBS 支持的 AMI。

```
-Filter @{Name="root-device-type"; Values="ebs"}
```

------
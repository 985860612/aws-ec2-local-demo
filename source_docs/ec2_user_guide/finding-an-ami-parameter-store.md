

# 使用 Systems Manager 公共参数引用最新的 AMI
<a name="finding-an-ami-parameter-store"></a>

AWS Systems Manager 为 维护的公有 AMI 提供公有参数。AWS您可以在启动实例时使用公有参数来确保使用最新 AMI。例如，公有参数 `/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64` 在所有区域中均可用，并且始终指向给定区域中适用于 arm64 架构的最新版本 Amazon Linux 2023 AMI。

在以下路径中提供公有参数：
+ **Linux** – `/aws/service/ami-amazon-linux-latest`
+ **Windows** – `/aws/service/ami-windows-latest`

有关更多信息，请参阅《AWS Systems Manager 用户指南》**中的[使用公共参数](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters.html)。

## 查找公共 AMI 的 SSM 参数
<a name="find-ssm-parameter-for-ami"></a>

当您描述公共 AMI 时，响应中会在 `PublicSsmParameterName` 字段中包含相关联的 AWS Systems Manager（SSM）参数。使用此参数来标识始终指向该 AMI 最新版本的 SSM 参数。

------
#### [ Console ]

**查找公共 AMI 的 SSM 参数**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 查找公共 AMI。

1. 在**详细信息**选项卡上，查找**公共 SSM 参数名称**。

------
#### [ AWS CLI ]

**查找公共 AMI 的 SSM 参数**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。响应包含具有关联 SSM 参数的公共 AMI 的 `PublicSsmParameterName` 字段。

```
aws ec2 describe-images \
    --image-ids {{ami-0abcdef1234567890}}
```

以下示例输出显示了 `PublicSsmParameterName` 字段。为简洁起见，省略了一些字段。

```
{
    "Images": [
        {
            "ImageId": "ami-0abcdef1234567890",
            "Name": "al2023-ami-2023.7.20260601.0-kernel-6.1-x86_64",
            ...
            "PublicSsmParameterName": "aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
        }
    ]
}
```

------
#### [ PowerShell ]

**查找公共 AMI 的 SSM 参数**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。响应包含具有关联 SSM 参数的公共 AMI 的 `PublicSsmParameterName` 字段。

```
Get-EC2Image -ImageId {{ami-0abcdef1234567890}}
```

以下示例输出显示了 `PublicSsmParameterName` 字段。为简洁起见，省略了一些字段。

```
ImageId                : ami-0abcdef1234567890
Name                   : al2023-ami-2023.7.20260601.0-kernel-6.1-x86_64
...
PublicSsmParameterName : aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64
```

------

## 列出 Amazon Linux AMI
<a name="list-ami-amazon-linux-latest"></a>

------
#### [ AWS CLI ]

**列出当前 AWS 区域中的 Linux AMI**  
使用以下 [get-parameters-by-path](https://docs.aws.amazon.com/cli/latest/reference/ssm/get-parameters-by-path.html) 命令。`--path` 参数的值因 Linux AMI 而异。

```
aws ssm get-parameters-by-path \
    --path /aws/service/ami-amazon-linux-latest \
    --query "Parameters[].Name"
```

------
#### [ PowerShell ]

**列出当前 AWS 区域中的 Linux AMI**  
使用 [Get-SSMParametersByPath](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-SSMParametersByPath.html) cmdlet。

```
Get-SSMParametersByPath `
    -Path "/aws/service/ami-amazon-linux-latest" | `
    Sort-Object Name | Format-Table Name
```

------

## 列出 Windows AMI
<a name="list-ami-windows-latest"></a>

------
#### [ AWS CLI ]

**列出当前 AWS 区域中的 Windows AMI**  
使用以下 [get-parameters-by-path](https://docs.aws.amazon.com/cli/latest/reference/ssm/get-parameters-by-path.html) 命令。`--path` 参数的值因 Windows AMI 而异。

```
aws ssm get-parameters-by-path \
    --path /aws/service/ami-windows-latest \
    --query "Parameters[].Name"
```

------
#### [ PowerShell ]

**列出当前 AWS 区域中的 Windows AMI**  
使用 [Get-SSMParametersByPath](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-SSMParametersByPath.html) cmdlet。

```
Get-SSMParametersByPath `
    -Path "/aws/service/ami-windows-latest" | `
    Sort-Object Name | Format-Table Name
```

------

## 使用公有参数启动实例
<a name="launch-instance-public-parameter"></a>

要在启动实例时指定此公有参数，请使用以下语法 `resolve:ssm:{{public-parameter}}`，其中 `resolve:ssm` 是标准前缀，`{{public-parameter}}` 是公有参数的路径和名称。

------
#### [ AWS CLI ]

**使用公有参数启动实例**  
使用 [run-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html) 命令和 `--image-id` 选项。此示例为该映像 ID 指定了一个 Systems Manager 公有参数，以使用最新版本的 Amazon Linux 2023 AMI 启动实例

```
--image-id resolve:ssm:{{/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64}}
```

------
#### [ PowerShell ]

**使用公有参数启动实例**  
将 [New-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/New-EC2Instance.html) cmdlet 与 `-ImageId` 参数结合使用。此示例为该映像 ID 指定了一个 Systems Manager 公有参数，以使用最新版本适用于 Windows Server 2022 的 AMI 启动实例。

```
-ImageId "resolve:ssm:{{/aws/service/ami-windows-latest/Windows_Server-2022-English-Full-Base}}"
```

------

有关使用 Systems Manager 参数的更多示例，请参阅 [Query for the latest Amazon Linux AMI IDs Using AWS Systems Manager Parameter Store](https://aws.amazon.com/blogs/compute/query-for-the-latest-amazon-linux-ami-ids-using-aws-systems-manager-parameter-store/) 和 [Query for the Latest Windows AMI Using AWS Systems Manager Parameter Store](https://aws.amazon.com/blogs/mt/query-for-the-latest-windows-ami-using-systems-manager-parameter-store/)。
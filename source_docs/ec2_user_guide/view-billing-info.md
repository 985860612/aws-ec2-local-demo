

# 查找 AMI 账单和使用详细信息
<a name="view-billing-info"></a>

以下属性可以帮助您验证账单上的 AMI 费用：
+ **平台详细信息**
+ **使用情况操作** \*
+ **AMI ID**。

------
#### [ Console ]

**查找 AMI 的 AMI 账单信息**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI。

1. 在**详细信息**选项卡上，查找**平台详细信息**和**使用情况操作**。

**查找实例的 AMI 账单信息**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择**实例**。

1. 选择实例。

1. 在**详细信息**选项卡上，展开**实例详细信息**，然后查找**平台详细信息**和**使用情况操作**。

------
#### [ AWS CLI ]

**查找 AMI 的 AMI 账单信息**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --image-ids {{ami-0abcdef1234567890}} \
    --query "Images[].{PlatformDetails:PlatformDetails,UsageOperation:UsageOperation}"
```

以下是 Linux AMI 的示例输出。

```
[
    {
        "PlatformDetails": "Linux/UNIX",
        "UsageOperation": "RunInstances"
    }
]
```

**查找实例的 AMI 账单信息**  
可以使用 [describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) 命令。

```
aws ec2 describe-instances \
    --instance-ids {{i-1234567890abcdef0}} \
    --query "Reservations[].Instances[].{PlatformDetails:PlatformDetails,UsageOperation:UsageOperation}"
```

以下是 Windows 实例的示例输出。

```
[
    {
        "PlatformDetails": "Windows",
        "UsageOperation": "RunInstances:0002"
    }
]
```

------
#### [ PowerShell ]

**查找 AMI 的 AMI 账单信息**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
Get-EC2Image `
    -ImageId {{ami-0abcdef1234567890}} | `
    Format-List PlatformDetails, UsageOperation
```

以下是 Linux AMI 的示例输出。

```
PlatformDetails : Linux/UNIX
UsageOperation  : RunInstances
```

**查找实例的 AMI 账单信息**  
使用 [Get-EC2Instance](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Instance.html) cmdlet。

```
(Get-EC2Instance `
    -InstanceId {{i-1234567890abcdef0}}).Instances | `
    Format-List PlatformDetails, UsageOperation
```

以下是 Windows 实例的示例输出。

```
PlatformDetails : Windows
UsageOperation  : RunInstances:0002
```

------
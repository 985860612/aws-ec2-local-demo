

# AMI 允许的实例类型
<a name="ami-allowed-instance-types"></a>

作为 AMI 所有者，您可以指定 AMI 支持或不支持的实例类型。这样可以防止在不兼容的实例类型上启动。Amazon EC2 会在启动时强制执行允许的实例类型。

例如，如果 AMI 需要 GPU 硬件，可以将其限制为仅使用 GPU 实例类型。如果 AMI 与特定实例系列不兼容，可以将该系列排除在允许的实例类型之外。

**Topics**
+ [允许的实例类型的工作方式](#ami-allowed-instance-types-how-it-works)
+ [为 AMI 设置允许的实例类型](#ami-allowed-instance-types-set)
+ [查看 AMI 允许的实例类型](#ami-allowed-instance-types-view)
+ [使用允许的实例类型的启动行为](#ami-allowed-instance-types-launch-behavior)
+ [注意事项](#ami-allowed-instance-types-considerations)

## 允许的实例类型的工作方式
<a name="ami-allowed-instance-types-how-it-works"></a>

可通过 AMI 上的 `InstanceTypeSpecification` 属性控制允许的实例类型。此属性含有两个列表：
+ `SupportedInstanceTypes`：AMI 支持的实例类型。只有这些实例类型可通过 AMI 启动。
+ `UnsupportedInstanceTypes`：AMI 不支持的实例类型。其他所有实例类型均可通过 AMI 启动。

Amazon EC2 使用以下逻辑来评估该规范：
+ 如果未设置 `InstanceTypeSpecification`，Amazon EC2 允许所有实例类型。这是默认行为。
+ 如果仅设置 `SupportedInstanceTypes`，则只允许使用指定的实例类型。Amazon EC2 会屏蔽其他所有实例类型。
+ 如果仅设置 `UnsupportedInstanceTypes`，则 Amazon EC2 允许除指定之外的所有实例类型。
+ 如果同时设置了两个列表，则实例类型必须处在 `SupportedInstanceTypes` 中，且不能在 `UnsupportedInstanceTypes` 中。

### 通配符支持
<a name="ami-allowed-instance-types-wildcards"></a>

两个列表均支持使用 `*` 字符的通配符模式。可使用通配符匹配多个实例类型，而不必单独列出每个实例类型。

下表给出了通配符模式的一些示例。


| 模式 | Matches | 
| --- | --- | 
| t3.\* | t3 实例系列中的所有大小（比如 t3.micro、t3.small 和 t3.large） | 
| p4d.\* | p4d 实例系列中的所有大小 | 
| g5.\* | g5 实例系列中的所有大小 | 
| \*xlarge | 所有实例系列中为 xlarge 或更大规格的任何实例类型 | 
| \*.12xlarge | 所有实例系列中的任何 12xlarge 实例类型 | 

## 为 AMI 设置允许的实例类型
<a name="ami-allowed-instance-types-set"></a>

可使用 Amazon EC2 控制台或 AWS Command Line Interface（AWS CLI），为 AMI 设置或更改允许的实例类型。您必须是 AMI 拥有者才能执行此过程。

------
#### [ Console ]

**为 AMI 设置允许的实例类型**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI，然后选择**操作**、**管理实例类型规范**。

1. 在**支持的实例类型**或**不支持的实例类型**下，选择**添加**。

1. 选择实例类型

1. 选择**保存**。

------
#### [ AWS CLI ]

**为 AMI 设置支持的实例类型**  
使用 [replace-image-instance-type-specification](https://docs.aws.amazon.com/cli/latest/reference/ec2/replace-image-instance-type-specification.html) 命令。在以下示例中，允许除 `t3.micro` 之外的所有 `t3` 和 `a2` 实例类型。

```
aws ec2 replace-image-instance-type-specification \
    --image-id {{ami-1234567890abcdef0}} \
    --instance-type-specification '{"SupportedInstanceTypes": ["t3.*", "a2.*"], "UnsupportedInstanceTypes": ["t3.micro"]}'
```

**仅为 AMI 设置不支持的实例类型**  
使用以下命令阻止特定的实例类型，同时允许其他所有实例类型。

```
aws ec2 replace-image-instance-type-specification \
    --image-id {{ami-1234567890abcdef0}} \
    --instance-type-specification '{"UnsupportedInstanceTypes": ["t3.micro", "t3.nano"]}'
```

**从 AMI 中删除实例类型规范**  
无需指定 `--instance-type-specification`，即可使用以下命令取消限制并允许所有实例类型。

```
aws ec2 replace-image-instance-type-specification \
    --image-id {{ami-1234567890abcdef0}}
```

------

## 查看 AMI 允许的实例类型
<a name="ami-allowed-instance-types-view"></a>

可使用 Amazon EC2 控制台或 AWS CLI 查看 AMI 的实例类型规范。

------
#### [ Console ]

**查看 AMI 允许的实例类型**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMI**。

1. 选择 AMI。

1. 在**详细信息**选项卡中，查看支持和不支持的实例类型。

------
#### [ AWS CLI ]

**查看 AMI 的实例类型规范**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。如果 AMI 有实例类型规范，则响应中含有 `InstanceTypeSpecification` 字段。

```
aws ec2 describe-images \
    --image-ids {{ami-1234567890abcdef0}}
```

以下是包含实例类型规范的 AMI 的示例输出。

```
{
    "Images": [
        {
            "ImageId": "ami-1234567890abcdef0",
            ...
            "InstanceTypeSpecification": {
                "SupportedInstanceTypes": [
                    {
                        "InstanceType": "t3.*"
                    },
                    {
                        "InstanceType": "a2.*"
                    }
                ],
                "UnsupportedInstanceTypes": [
                    {
                        "InstanceType": "t3.micro"
                    }
                ]
            }
        }
    ]
}
```

------

## 使用允许的实例类型的启动行为
<a name="ami-allowed-instance-types-launch-behavior"></a>

当启动实例时，Amazon EC2 会检查指定的实例类型与 AMI 的实例类型规范是否兼容。如果不允许使用该实例类型，Amazon EC2 会阻止启动并返回错误。

**示例：阻止启动**  
以下命令尝试使用不支持 `t3.micro` 的 AMI 来启动 `t3.micro` 实例。

```
aws ec2 run-instances \
    --image-id {{ami-1234567890abcdef0}} \
    --instance-type t3.micro
```

Amazon EC2 将返回以下错误：

```
An error occurred (InvalidParameterCombination) when calling the RunInstances operation: This AMI does not support the specified instance type. Check DescribeImages for InstanceTypeSpecification, and try again.
```

要解决此错误，请选择 AMI 支持的实例类型。可使用 `describe-images` 命令查看 AMI 的实例类型规范。

## 注意事项
<a name="ami-allowed-instance-types-considerations"></a>

使用允许的实例类型时，务必记住以下信息。
+ AMI 默认没有实例类型规范。在您明确设置规范之前，Amazon EC2 允许所有实例类型。
+ 只有 AMI 所有者方可设置或更改实例类型规范。
+ 当使用 `CopyImage` 复制 AMI 时，Amazon EC2 会在新的 AMI 中保留实例类型规范。
+ Amazon EC2 会将实例类型规范作为硬性限制来强制执行。如果不允许使用该实例类型，启动会失败并显示 `InvalidParameterCombination` 错误。
+ 该规范不影响现有的实例。它仅适用于新的启动。
+ 如果不允许所配置的实例类型，则引用包含实例类型规范的 AMI 的启动模板和自动扩缩组可能会失败。建议在验证兼容性之后，再在共享的 AMI 上设置规范。
+ `ReplaceImageInstanceTypeSpecification` 操作将替换整个规范。要添加或移除单个实例类型，必须在请求中包含完整的更新后规范。
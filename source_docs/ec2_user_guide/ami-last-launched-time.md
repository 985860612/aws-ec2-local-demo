

# 检查上次使用 Amazon EC2 AMI 的时间
<a name="ami-last-launched-time"></a>

Amazon EC2 会自动跟踪 AMI 上次被用于启动实例的日期和时间。如果您的 AMI 已经很长时间没有用于启动实例，请考虑该 AMI 是否适合[注销](deregister-ami.md)或[弃用](ami-deprecate.md)。

**注意事项**
+ 在使用 AMI 启动实例时，使用情况报告会有 24 小时的延迟。
+ 您必须是 AMI 的所有者才能获取上次启动的时间。
+ AMI 使用情况数据自 2017 年 4 月起可用。

------
#### [ Console ]

**查看 AMI 的上次启动时间**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **AMI**。

1. 从筛选栏中选择 **Owned by me**（我拥有的）。

1. 选中该 AMI 对应的复选框。

1. 在**详细信息**选项卡上，找到**上次启动时间**。

------
#### [ AWS CLI ]

**通过描述 AMI 来查看上次启动时间**  
使用 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。如果输出中不存在 `LastLaunchedTime`，则请确认您拥有该 AMI。

```
aws ec2 describe-images \
    --image-id {{ami-0abcdef1234567890}} \
    --query Images[].LastLaunchedTime \
    --output text
```

下面是示例输出。

```
2025-02-17T20:22:19Z
```

**查看 AMI 的上次启动时间属性**  
使用 [describe-image-attribute](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-image-attribute.html) 命令。您必须是指定 AMI 的所有者。

```
aws ec2 describe-image-attribute \
    --image-id {{ami-0abcdef1234567890}} \
    --attribute lastLaunchedTime \
    --query LastLaunchedTime.Value \
    --output text
```

下面是示例输出。

```
2025-02-17T20:22:19Z
```

------
#### [ PowerShell ]

**通过描述 AMI 来查看上次启动时间**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。如果输出中不存在 `LastLaunchedTime`，则请确认您拥有该 AMI。

```
(Get-EC2Image -ImageId {{ami-0abcdef1234567890}}).LastLaunchedTime
```

下面是示例输出。

```
2025-02-17T20:22:19Z
```

**查看 AMI 的上次启动时间属性**  
使用 [Get-EC2ImageAttribute](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2ImageAttribute.html) cmdlet。您必须是指定 AMI 的所有者。

```
(Get-EC2ImageAttribute `
    -ImageId {{ami-0abcdef1234567890}} `
    -Attribute LastLaunchedTime).LastLaunchedTime
```

下面是示例输出。

```
2025-02-17T20:22:19Z
```

------


# 弃用 Amazon EC2 AMI
<a name="ami-deprecate"></a>

您可以弃用 AMI，以表明该 AMI 已过期且不应使用。您还可以为 AMI 指定未来弃用日期，表明 AMI 何时过期。例如，您可能会弃用不再主动维护的 AMI，或是已被较新版本取代的 AMI。默认情况下，已弃用的 AMI 不会显示在 AMI 列表中，防止新用户使用过期的 AMI。但是，现有用户和启动服务（如启动模板和 Auto Scaling 组）可以通过指定其 ID 来继续使用已弃用的 AMI。要删除 AMI 以便使用户和服务无法使用，您必须[注销](deregister-ami.md)。

AMI 弃用后：
+ 对于 AMI 用户，已弃用的 AMI 不会显示在 [DescribeImages](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImages.html) API 调用中，除非您指定其 ID 或要求必须显示已弃用的 AMI。AMI 拥有者可继续在 [DescribeImages](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImages.html) API 调用中看到已弃用的 AMI。
+ 对于 AMI 用户，已弃用的 AMI 在 EC2 控制台中不可选择。例如，已弃用的 AMI 不会出现在启动实例向导的 AMI 目录中。AMI 拥有者可继续在 EC2 控制台中看到已弃用的 AMI。
+ 对于 AMI 用户，如果您知道已弃用的 AMI 的 ID，则可以通过 API、CLI 或开发工具包继续使用已弃用的 AMI 启动实例。
+ 启动服务（如启动模板和 Auto Scaling 组）可以继续引用已弃用的 AMI。
+ 使用随后被弃用的 AMI 启动的 EC2 实例不会受到影响，可以停止、启动和重新启动。

您可以弃用私有和公用 AMI。

**Topics**
+ [成本](#ami-deprecate-costs)
+ [注意事项](#ami-deprecate-limitations)
+ [弃用 AMI](#deprecate-ami)
+ [描述已弃用的 AMI](#describe-deprecate-ami)
+ [取消 AMI 弃用](#cancel-deprecate-ami)

## 成本
<a name="ami-deprecate-costs"></a>

当您弃用 AMI 时，不会删除该 AMI。AMI 拥有者须继续为 AMI 的快照付费。要停止支付快照费用，AMI 拥有者必须通过[注销](deregister-ami.md)删除 AMI。

## 注意事项
<a name="ami-deprecate-limitations"></a>
+ 要弃用 AMI，您必须是 AMI 的拥有者。
+ 最近未用于启动实例的 AMI 可能需要弃用或注销。有关更多信息，请参阅 [检查上次使用 Amazon EC2 AMI 的时间](ami-last-launched-time.md)。
+ 您可以创建 Amazon Data Lifecycle Manager EBS-backed AMI 策略，以自动执行 EBS-backed AMI 的弃用。有关更多信息，请参阅 [Create AMI lifecycle policies](https://docs.aws.amazon.com/ebs/latest/userguide/ami-policy.html)。
+ 默认情况下，所有公用 AMI 的弃用日期设置为自 AMI 创建日期起的两年。您可以将弃用日期设置为早于两年。要取消弃用日期，或将弃用移至未来某一日期，您必须通过仅[将 AMI 与特定 AWS 账户共享](sharingamis-explicit.md)来将其设为私有。

## 弃用 AMI
<a name="deprecate-ami"></a>

您可以在特定日期和时间弃用 AMI。您必须是该 AMI 的所有者。

弃用日期的上限为从当前日期起 10 年，但公有 AMI 除外，其上限为自创建之日起 2 年。不能指定某个过去的日期。

------
#### [ Console ]

**在特定日期弃用 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航器中选择 **AMI**。

1. 从筛选栏中选择 **Owned by me**（我拥有的）。

1. 选取相应 AMI，然后选择 **Actions**（操作）、**Manage AMI Deprecation**（管理 AMI 弃用）。您可以选择多个 AMI，一次性为多个 AMI 设置同一弃用日期。

1. 选择**启用**复选框，然后输入弃用日期和时间。

1. 选择**保存**。

------
#### [ AWS CLI ]

**在特定日期弃用 AMI**  
使用 [enable-image-deprecation](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-image-deprecation.html) 命令。如果指定以秒为单位的值，Amazon EC2 会将秒四舍五入到最近的分钟数。

```
aws ec2 enable-image-deprecation \
    --image-id {{ami-0abcdef1234567890}} \
    --deprecate-at "{{2025-04-15T13:17:12.000Z}}"
```

------
#### [ PowerShell ]

**在特定日期弃用 AMI**  
使用 [Enable-EC2ImageDeprecation](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-EC2ImageDeprecation.html) cmdlet。如果指定以秒为单位的值，Amazon EC2 会将秒四舍五入到最近的分钟数。

```
Enable-EC2ImageDeprecation `
    -ImageId {{ami-0abcdef1234567890}} `
    -DeprecateAt {{2025-04-15T13:17:12.000Z}}
```

------

## 描述已弃用的 AMI
<a name="describe-deprecate-ami"></a>

您可以查看 AMI 的弃用日期和时间，以及按弃用日期筛选 AMI。

------
#### [ Console ]

**查看 AMI 的弃用日期**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航器中选择 **AMIs**，然后选择相应 AMI。

1. 检查**弃用时间**字段（如果选中 AMI 旁边的复选框，则它位于**详细信息**选项卡上）。该字段将显示 AMI 的弃用日期和时间。如果该字段为空，表示该 AMI 未遭弃用。

**按弃用日期筛选 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航器中选择 **AMI**。

1. 从筛选栏中选择 **Owned by me**（我拥有的）或 **Private images**（私有映像）（私有映像包括与您共享的 AMI 以及您拥有的 AMI）。

1. 在搜索栏中输入 **Deprecation time**（输入字母时会出现 **Deprecation time**（弃用时间）筛选器），然后选择运算符以及日期和时间。

------
#### [ AWS CLI ]

当您描述所有 AMI 时，结果会因您是 AMI 用户还是 AMI 拥有者而异。
+ **AMI 用户** – 默认情况下，当您描述所有 AMI 时，结果会排除与您共享但不属于您的已弃用 AMI。要在结果中包括已弃用的 AMI，请指定 `--include-deprecated` 选项。
+ **AMI 所有者** – 当您描述所有 AMI 时，结果将包含您拥有的所有 AMI，包括已弃用的 AMI。您不能使用 `--no-include-deprecated` 选项来排除自己拥有的已弃用 AMI。

**在描述某个账户的所有 AMI 时包含已弃用 AMI**  
使用以下 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images 
    --owners {{123456789012}} \   
    --include-deprecated
```

**描述您账户中的已弃用 AMI**  
使用以下 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --owners self \
    --query "Images[?DeprecationTime!=null].ImageId" \
    --output text
```

下面是示例输出。

```
ami-0abcdef1234567890
```

**描述 AMI 的弃用日期**  
使用以下 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。如果输出中不存在 `DeprecationTime`，则表示该 AMI 未被弃用，也未设置为在某个未来日期弃用。

```
aws ec2 describe-images \
    --image-ids {{ami-0abcdef1234567890}} \
    --query Images[].DeprecationTime \
    --output text
```

下面是示例输出。

```
2025-05-01T00:00:00.000Z
```

------
#### [ PowerShell ]

**列出您账户中的已弃用 AMI**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
(Get-EC2Image -Owner self | Where-Object {$_.DeprecationTime -ne $null}).ImageId
```

下面是示例输出。

```
ami-0abcdef1234567890
```

**描述 AMI 的弃用日期**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。如果输出中不存在 `DeprecationTime`，则表示该 AMI 未被弃用，也未设置为在某个未来日期弃用。

```
(Get-EC2Image -ImageId {{ami-0abcdef1234567890}}).DeprecationTime
```

下面是示例输出。

```
2025-05-01T00:00:00.000Z
```

------

## 取消 AMI 弃用
<a name="cancel-deprecate-ami"></a>

您可以取消弃用某个 AMI，这将移除弃用日期和时间。您必须是 AMI 拥有者才能执行此过程。

------
#### [ Console ]

**取消弃用 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航器中选择 **AMI**。

1. 从筛选栏中选择 **Owned by me**（我拥有的）。

1. 选取相应 AMI，然后选择 **Actions**（操作）、**Manage AMI Deprecation**（管理 AMI 弃用）。您可以选择多个 AMI，一次性取消对多个 AMI 的弃用。

1. 清除**启用**复选框，然后选择**保存**。

------
#### [ AWS CLI ]

**取消弃用 AMI**  
使用以下 [disable-image-deprecation](https://docs.aws.amazon.com/cli/latest/reference/ec2/disable-image-deprecation.html) 命令。

```
aws ec2 disable-image-deprecation --image-id {{ami-0abcdef1234567890}}
```

------
#### [ PowerShell ]

**取消弃用 AMI**  
使用 [Disable-EC2ImageDeprecation](https://docs.aws.amazon.com/powershell/latest/reference/items/Disable-EC2ImageDeprecation.html) cmdlet。

```
Disable-EC2ImageDeprecation -ImageId {{ami-0abcdef1234567890}}
```

------
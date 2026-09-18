

# 禁用 Amazon EC2 AMI
<a name="disable-an-ami"></a>

您可以禁用 AMI，以防止系统将其用于实例启动。您无法从已禁用的 AMI 启动新实例。您可以重新启用已禁用的 AMI，使其可以再次用于实例启动。

您可以禁用私有和公用 AMI。

禁用由 EBS 支持的 AMI 后，如果该 AMI 的使用频率很少，但需要长期留存，则可以将其关联的快照归档以降低其存储成本。有关更多信息，请参阅《Amazon EBS 用户指南》**中的[归档 Amazon EBS 快照](https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-archive.html)。

**Topics**
+ [AMI 禁用的工作原理](#how-disable-ami-works)
+ [成本](#ami-disable-costs)
+ [先决条件](#ami-disable-prerequisites)
+ [所需的 IAM 权限](#ami-disable-iam-permissions)
+ [禁用 AMI](#disable-ami)
+ [描述已禁用的 AMI](#describe-disabled-ami)
+ [重新启用已禁用的 AMI](#re-enable-a-disabled-ami)

## AMI 禁用的工作原理
<a name="how-disable-ami-works"></a>

**警告**  
禁用 AMI 会移除其所有启动权限。

**当 AMI 被禁用时：**
+ AMI 的状态会更改为 `disabled`。
+ 无法共享已禁用的 AMI。如果 AMI 为公用性质或以前共享过，则会将其设为私有。如果与 AWS 账户、组织或组织单位共享了 AMI，则它们将无法访问已禁用的 AMI。
+ 默认情况下，已禁用的 AMI 不会出现在 [DescribeImages](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImages.html) API 调用中。
+ 禁用的 AMI 不会在**我拥有的**控制台筛选条件下显示。要查找已禁用的 AMI，请使用**已禁用的映像**控制台筛选条件。
+ 已禁用的 AMI 不可在 EC2 控制台中选择用于实例启动。例如，已禁用的 AMI 不会出现在启动实例向导的 AMI 目录中，创建启动模板时也不会显示。
+ 启动服务（如启动模板和自动扩缩组）可以继续引用已禁用的 AMI。从已禁用的 AMI 发起的后续实例启动将失败，因此我们建议更新启动模板和自动扩缩组，使其仅引用可用的 AMI。
+ 之前使用随后被禁用的 AMI 启动的 EC2 实例不会受到影响，可以停止、启动和重新启动。
+ 无法删除与已禁用的 AMI 关联的快照。尝试删除关联的快照会导致 `snapshot is currently in use` 错误。

**重新启用 AMI 时：**
+ AMI 的状态将更改为 `available`，可用于启动实例。
+ AMI 可以共享。
+ AWS 账户在 AMI 被禁用后失去对其的访问权限的 、组织和组织单位不会自动重新获得访问权限，但可以再次与它们共享 AMI。

## 成本
<a name="ami-disable-costs"></a>

当您禁用 AMI 时，不会删除该 AMI。如果 AMI 是 EBS-backed AMI，则您需要继续为 AMI 的 EBS 快照付费。如果您想保留此类 AMI，则可以通过归档快照来降低存储成本。有关更多信息，请参阅《Amazon EBS 用户指南》**中的[归档 Amazon EBS 快照](https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-archive.html)。如果您不想保留此类 AMI 及其快照，则必须取消注册相关 AMI 并删除相应快照。有关更多信息，请参阅 [取消注册 AMI](deregister-ami.md)。

## 先决条件
<a name="ami-disable-prerequisites"></a>

要禁用或重新启用 AMI，您必须是 AMI 的所有者。

## 所需的 IAM 权限
<a name="ami-disable-iam-permissions"></a>

要禁用和重新启用 AMI，您必须拥有以下 IAM 权限：
+ `ec2:DisableImage`
+ `ec2:EnableImage`

## 禁用 AMI
<a name="disable-ami"></a>

您可以使用 EC2 控制台或 AWS Command Line Interface（AWS CLI）禁用 AMI。您必须是 AMI 拥有者才能执行此过程。

------
#### [ Console ]

**要禁用 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **AMI**。

1. 从筛选栏中选择 **Owned by me**（我拥有的）。

1. 选择 AMI，然后依次选择**操作**和**禁用 AMI**。您可以同时选择多个 AMI，一并将其禁用。

1. 在**禁用 AMI**窗口中，选择**禁用 AMI**。

------
#### [ AWS CLI ]

**要禁用 AMI**  
使用以下 [disable-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/disable-image.html) 命令。

```
aws ec2 disable-image --image-id {{ami-0abcdef1234567890}}
```

------
#### [ PowerShell ]

**要禁用 AMI**  
使用 [Disable-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Disable-EC2Image.html) cmdlet。

```
Disable-EC2Image -ImageId {{ami-0abcdef1234567890}}
```

------

## 描述已禁用的 AMI
<a name="describe-disabled-ami"></a>

您可以在 EC2 控制台中或使用 AWS CLI 查看已禁用的 AMI。

您必须是 AMI 所有者才能查看已禁用的 AMI。由于已禁用的 AMI 被设为私有，因此如果您不是所有者，则无法对其进行查看。

------
#### [ Console ]

**要查看已禁用的 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **AMI**。

1. 从筛选栏中选择**已禁用的映像**。  
![“已禁用的映像”筛选器。](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/images/ami-filter-by-disabled-images.png)

------
#### [ AWS CLI ]

默认情况下，当您描述所有 AMI 时，已禁用的 AMI 不会包含在结果中。要在结果中包含已禁用的 AMI，请指定 `--include-disabled` 选项。如果 AMI 已被禁用，则该 AMI 的 `State` 字段将为 `disabled`。

**在描述某个账户的所有 AMI 时包含已禁用 AMI**  
使用以下 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --owners {{123456789012}} \
    --include-disabled
```

**列出您账户中的已禁用 AMI**  
使用以下 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images \
    --owners self \
    --include-disabled \
    --filters Name=state,Values=disabled \
    --query Images[].ImageId \
    --output text
```

下面是示例输出。

```
ami-0abcdef1234567890
```

**描述 AMI 的状态**  
使用以下 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。如果输出中不存在 `DeprecationTime`，则表示该 AMI 未被弃用，也未设置为在某个未来日期弃用。

```
aws ec2 describe-images \
    --image-ids {{ami-0abcdef1234567890}} \
    --query Images[].State \
    --output text
```

下面是示例输出。

```
disabled
```

------
#### [ PowerShell ]

默认情况下，当您描述所有 AMI 时，已禁用的 AMI 不会包含在结果中。要在结果中包含已禁用的 AMI，请指定 `-IncludeDisabled` 参数。如果 AMI 已被禁用，则该 AMI 的 `State` 字段将为 `disabled`。

**列出您账户中的已禁用 AMI**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
(Get-EC2Image `
    -Owner self `
    -IncludeDisabled $true | Where-Object {$_.State -eq "disabled"}).ImageId
```

下面是示例输出。

```
ami-0abcdef1234567890
```

**描述 AMI 的状态**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
(Get-EC2Image -ImageId {{ami-0abcdef1234567890}}).State.Value
```

下面是示例输出。

```
disabled
```

------

## 重新启用已禁用的 AMI
<a name="re-enable-a-disabled-ami"></a>

您可以重新启用已禁用的 AMI。您必须是 AMI 拥有者才能执行此过程。

------
#### [ Console ]

**要重新启用已禁用的 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在左侧导航窗格中，选择 **AMI**。

1. 从筛选栏中选择**已禁用的映像**。

1. 选择 AMI，然后依次选择**操作**、**启用 AMI**。您可以同时选择多个 AMI，一并将其重新启用。

1. 在**启用 AMI**窗口中，选择**启用**。

------
#### [ AWS CLI ]

**要重新启用已禁用的 AMI**  
使用以下 [enable-image](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-image.html) 命令。

```
aws ec2 enable-image --image-id {{ami-0abcdef1234567890}}
```

------
#### [ PowerShell ]

**要重新启用已禁用的 AMI**  
使用 [Enable-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Enable-EC2Image.html) cmdlet。

```
Enable-EC2Image -ImageId {{ami-0abcdef1234567890}}
```

------


# 查找付费 AMI
<a name="using-paid-amis-finding-paid-ami"></a>

付费 AMI 是可供购买的亚马逊机器映像（AMI）。付费 AMI 也有产品代码。您可以查找可通过 AWS Marketplace 购买的 AMI。

------
#### [ Console ]

**查找付费 AMI**

1. 通过以下网址打开 Amazon EC2 控制台：[https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)。

1. 在导航窗格中，选择 **AMIs**。

1. 对于第一个筛选条件，选择**公有映像**。

1. 请执行以下操作之一：
   + 如果您知道产品代码，请选择 **Product code**（产品代码），再选择 **=**，然后输入产品代码。
   + 如果您不知道产品代码，请在搜索栏中指定以下筛选条件：**所有者别名=aws-marketplace**。根据需要指定其他筛选条件。

1. 保存 AMI 的 ID。

------
#### [ AWS CLI ]

**查找付费 AMI**  
使用以下 [describe-images](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html) 命令。

```
aws ec2 describe-images --owners aws-marketplace
```

输出中包含大量映像。您可以通过指定筛选条件来帮助确定所需的 AMI。找到 AMI 后，请在以下命令中指定其 ID 来获取产品代码。

```
aws ec2 describe-images \
    --image-ids {{ami-0abcdef1234567890}} \
    --query Images[*].ProductCodes[].ProductCodeId
```

下面是示例输出。

```
[
    "cdef1234abc567def8EXAMPLE"
]
```

如果您知道产品代码，可以按产品代码筛选结果。此示例返回具有指定产品代码的最新 AMI。

```
aws ec2 describe-images \
    --filters "Name=product-code,Values={{cdef1234abc567def8EXAMPLE}}" \
    --query "sort_by(Images, &CreationDate)[-1].[ImageId]"
```

------
#### [ PowerShell ]

**查找付费 AMI**  
使用 [Get-EC2Image](https://docs.aws.amazon.com/powershell/latest/reference/items/Get-EC2Image.html) cmdlet。

```
Get-EC2Image -Owner aws-marketplace
```

输出中包含大量映像。您可以通过指定筛选条件来帮助确定所需的 AMI。找到 AMI 后，请在以下命令中指定其 ID 来获取产品代码。

```
(Get-EC2Image -ImageId {{ami-0abcdef1234567890}}).ProductCodes
```

下面是示例输出。

```
ProductCodeId             ProductCodeType
-------------             ---------------
cdef1234abc567def8EXAMPLE marketplace
```

如果您知道产品代码，可以按产品代码筛选结果。此示例返回具有指定产品代码的最新 AMI。

```
(Get-EC2Image -Owner aws-marketplace -Filter @{"Name"="product-code";"Value"="{{cdef1234abc567def8EXAMPLE}}"} | sort CreationDate -Descending | Select-Object -First 1).ImageId
```

------